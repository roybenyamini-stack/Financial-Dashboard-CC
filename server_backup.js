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

  const PROMPT = `CRITICAL OUTPUT RULE: Your entire response MUST be a single valid JSON object starting with { and ending with }. No conversational text, no apologies, no markdown tables, no explanation. If you cannot find the data, return: {"exemptPrincipal":0,"exemptProfit":0,"taxablePrincipal":0,"taxableProfit":0}

You are extracting tax-layer data from an Altshuler Shaham Keren Hishtalmut annual report.
This is a consolidated report for multiple accounts. Work ONLY with account: ${assetNum}.

STEP 1 — Find the table for account ${assetNum}:
Look for the table whose title CONTAINS: "פירוט סכומים בהתאם לרפורמה במיסוי רווחי הון"
The section prefix ("8.1", "ב.8", etc.) does not matter — match the title words only.
Confirm the table belongs to account ${assetNum}.

STEP 2 — Columns to use:
Principal = "קרן"
Real Profits = "רווחים ריאליים"
Linkage Differences = "הפרשי הצמדה"
Tax Rate = "שיעור המס"
Total = "סה"כ"

STEP 3 — Classify rows:
   EXEMPT (0% tax): rows containing "עד לגובה של תקרת ההפקדה המוטבת" or "עד ליום 31.12.2002"
   TAXABLE (>0% tax): rows containing "מעל לתקרת ההפקדה המוטבת" or "מעל לתקרת ההפקדה"

STEP 4 — Compute:
   exemptPrincipal  = sum of "קרן" for EXEMPT rows
   exemptProfit     = sum of "הפרשי הצמדה" + "רווחים ריאליים" for EXEMPT rows
   taxablePrincipal = sum of "קרן" for TAXABLE rows
   taxableProfit    = sum of "הפרשי הצמדה" + "רווחים ריאליים" for TAXABLE rows

Return ONLY: {"exemptPrincipal": ..., "exemptProfit": ..., "taxablePrincipal": ..., "taxableProfit": ...}

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
    const jsonStr = (raw.match(/\{[\s\S]*\}/) || [])[0] || raw;

    let parsed;
    try { parsed = JSON.parse(jsonStr); } catch (e) {
      console.error('[parse-pdf] Failed to parse JSON. Raw response was:', raw);
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
