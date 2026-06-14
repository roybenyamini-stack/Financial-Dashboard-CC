require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const fs        = require('fs');
const path      = require('path');

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'specialist_prompts.md'), 'utf8');

app.use(cors({ origin: '*' }));
app.use(express.text({ limit: '10mb', type: ['text/xml', 'application/xml', 'text/plain'] }));

app.post('/api/parse-masklaka', async (req, res) => {
  const xmlString = req.body;
  if (!xmlString || xmlString.length < 100) {
    return res.status(400).json({ error: 'XML string missing or too short' });
  }

  try {
    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: xmlString }]
    });

    const raw     = (message.content[0].text || '').trim();
    const jsonStr = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '');

    let data;
    try { data = JSON.parse(jsonStr); } catch(e) {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw });
    }

    if (!Array.isArray(data)) {
      return res.status(500).json({ error: 'AI response is not an array', raw });
    }

    const valid = data.filter(item => item.fundNumber && item.totalBalance != null);

    if (!valid.length) {
      return res.status(500).json({ error: 'No valid fund entries in AI response', raw, parsed: data });
    }

    res.json(valid);

  } catch(err) {
    res.status(500).json({ error: 'Anthropic API error: ' + err.message });
  }
});

// ── /api/debug-api — live Anthropic connectivity check ───────────────────────
app.get('/api/debug-api', async (req, res) => {
  const model = 'claude-haiku-4-5-20251001';
  try {
    const msg = await client.messages.create({
      model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Reply with the single word: ok' }]
    });
    res.json({ status: 'ok', model: msg.model, reply: msg.content[0].text, apiKeyPrefix: (process.env.ANTHROPIC_API_KEY || '').slice(0, 8) + '...' });
  } catch (err) {
    res.json({ status: 'error', httpStatus: err.status, message: err.message, errorBody: err.error || null, apiKeyPrefix: (process.env.ANTHROPIC_API_KEY || '(not set)').slice(0, 8) + '...' });
  }
});

// ── /api/parse-pdf — extract Keren Hishtalmut tax layers from annual report PDF ──
const pdfParse = require('pdf-parse');

app.post('/api/parse-pdf', express.json({ limit: '25mb' }), async (req, res) => {
  const { pdf, assetNum } = req.body || {};
  if (!pdf) return res.status(400).json({ error: 'Missing pdf field (base64)' });
  if (!assetNum) return res.status(400).json({ error: 'Missing assetNum field' });

  // Step 1: extract text from PDF bytes
  let text;
  try {
    const buf  = Buffer.from(pdf, 'base64');
    const data = await pdfParse(buf);
    text = (data.text || '').trim();
  } catch (e) {
    return res.status(422).json({ error: 'PDF text extraction failed: ' + e.message });
  }

  if (text.length < 30) {
    return res.status(422).json({ error: 'PDF appears to have no extractable text (scanned image?)' });
  }

  // Step 2: ask Claude to extract the 4 tax-layer values
  console.log('[parse-pdf] text total length:', text.length);
  console.log('[parse-pdf] text FIRST 1000:', text.slice(0, 1000));
  console.log('[parse-pdf] text LAST 500:', text.slice(-500));

  const PROMPT = `You are extracting tax-layer data from a large consolidated Israeli annual report that covers multiple Keren Hishtalmut accounts.

CRITICAL: Extract data ONLY for account number: ${assetNum}. Ignore all other accounts completely.

Find the section for account ${assetNum} and return the 4 tax-layer values for that account only.
Hebrew PDF text may appear in visual order (reversed). Match all variants:

- exemptPrincipal:  "קרן פטורה" / "הרוטפ ןרק" / "הפקדות עד תקרה" / "הרקת דע תודקפה" / "קרן מוטבת" / "תבטומ ןרק"
- exemptProfit:     "רווח פטור" / "רוטפ חוור" / "ריבית פטורה" / "הרוטפ תיביר"
- taxablePrincipal: "קרן חייבת" / "תבייח ןרק" / "הפקדות מעל תקרה" / "הרקת לעמ תודקפה" / "קרן עודפת" / "תפדוע ןרק"
- taxableProfit:    "רווח חייב" / "בייח חוור" / "ריבית חייבת" / "תבייח תיביר"

Return ONLY raw JSON (no markdown, no explanation):
{"exemptPrincipal": ..., "exemptProfit": ..., "taxablePrincipal": ..., "taxableProfit": ...}

Rules:
1. Use 0 ONLY if genuinely absent for account ${assetNum}.
2. All values >= 0. Values are in thousands of NIS unless the report uses different units.
3. If account ${assetNum} is not found in the report, return all zeros.

Full report text:
${text}`;

  try {
    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages:   [{ role: 'user', content: PROMPT }]
    });

    const raw     = (message.content[0].text || '').trim();
    console.log('[parse-pdf] raw Claude response:', raw);
    const jsonStr = raw.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim();

    let parsed;
    try { parsed = JSON.parse(jsonStr); } catch (e) {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw });
    }

    console.log('[parse-pdf] parsed result:', parsed);
    res.json({
      exemptPrincipal:  Number(parsed.exemptPrincipal)  || 0,
      exemptProfit:     Number(parsed.exemptProfit)     || 0,
      taxablePrincipal: Number(parsed.taxablePrincipal) || 0,
      taxableProfit:    Number(parsed.taxableProfit)    || 0
    });

  } catch (err) {
    console.error('[parse-pdf] Anthropic error:', err.status, err.message, JSON.stringify(err.error || {}));
    res.status(500).json({ error: 'Anthropic API error: ' + err.message, httpStatus: err.status, detail: err.error || null });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('[Masklaka Server] Listening on port ' + PORT));
