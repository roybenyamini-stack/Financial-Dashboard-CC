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
      model:      'claude-3-haiku-20240307',
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

// ── /api/parse-pdf — extract Keren Hishtalmut tax layers from annual report PDF ──
const pdfParse = require('pdf-parse');

app.post('/api/parse-pdf', express.json({ limit: '25mb' }), async (req, res) => {
  const { pdf } = req.body || {};
  if (!pdf) return res.status(400).json({ error: 'Missing pdf field (base64)' });

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
  const PROMPT = `You are extracting tax layer data from an Israeli Keren Hishtalmut (study fund) annual report.

Find and return ONLY a JSON object with exactly these 4 keys (values in thousands of NIS, as numbers):
- exemptPrincipal: total deposits/principal under the annual ceiling (קרן פטורה)
- exemptProfit: profit/gains on exempt deposits (רווח פטור)
- taxablePrincipal: deposits above the annual ceiling (קרן חייבת)
- taxableProfit: profit/gains on taxable deposits (רווח חייב)

Rules:
1. Use 0 for any value not found.
2. All values must be non-negative numbers.
3. Return ONLY raw JSON — no markdown fences, no explanation.

Annual report text (first 12000 chars):
${text.slice(0, 12000)}`;

  try {
    const message = await client.messages.create({
      model:      'claude-3-haiku-20240307',
      max_tokens: 300,
      messages:   [{ role: 'user', content: PROMPT }]
    });

    const raw     = (message.content[0].text || '').trim();
    const jsonStr = raw.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim();

    let parsed;
    try { parsed = JSON.parse(jsonStr); } catch (e) {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw });
    }

    res.json({
      exemptPrincipal:  Number(parsed.exemptPrincipal)  || 0,
      exemptProfit:     Number(parsed.exemptProfit)     || 0,
      taxablePrincipal: Number(parsed.taxablePrincipal) || 0,
      taxableProfit:    Number(parsed.taxableProfit)    || 0
    });

  } catch (err) {
    res.status(500).json({ error: 'Anthropic API error: ' + err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('[Masklaka Server] Listening on port ' + PORT));
