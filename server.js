// Version: v182.05
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const fs        = require('fs');
const path      = require('path');

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const stripMd = s => s.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();

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

  const TIER_PROMPT = `CRITICAL: Output ONLY valid JSON starting with { and ending with }. No text, no markdown, no code blocks.

You are analyzing an Israeli Keren Hishtalmut (savings fund) annual financial report.
Work ONLY with account ${assetNum}.

Find the Israeli capital gains tax reform table that shows the fund's assets broken down by historical periods and tax rates (0%, 15%, 20%, 25%). The table has 4 monetary columns per row: קרן (principal) | רווחים ריאליים (real profits) | הפרשי הצמדה (linkage differences) | סה"כ (total).

WARNING: Do NOT use the סה"כ (total) column — it is always the largest number in the row and is the sum of the other 3 columns. You must report the exact value under רווחים ריאליים (real profits) for the realProfit field. The רווחים ריאליים column is the SECOND column and is typically NOT the largest number.

For EACH row in this table, report ALL THREE non-total column values EXACTLY as they appear. Do NOT calculate, do NOT combine columns, do NOT aggregate.
The taxRate field must be the integer tax rate for that row (0, 15, 20, or 25).

Return EXACTLY this JSON:
{"rows": [{"taxRate": 0, "principal": 0, "realProfit": 0, "linkage": 0}]}

There must be one object per table row.

Report text:
${text}`;

  const BALANCE_PROMPT = `CRITICAL: Output ONLY valid JSON. No text, no markdown.
In this Israeli financial report for account ${assetNum}:
1. Find the total fund balance at end of reporting period ("יתרה לתום תקופת הדיווח" or "יתרה כוללת"). Report in NIS as a plain number without commas.
2. Find the report year (the calendar year this annual report covers). Look for "שנת הדיווח", "לשנת", or a date like "31.12.2025". Report as a 4-digit integer.
Return EXACTLY: {"pdfTotalBalance": 0, "reportYear": 0}
Report text:
${text}`;

  try {
    // Step 1 — tier extraction (fatal if it fails)
    const tierMsg = await client.messages.create({
      model:       'claude-haiku-4-5-20251001',
      max_tokens:  1000,
      temperature: 0,
      messages:    [{ role: 'user', content: TIER_PROMPT }]
    });

    const rawTier = stripMd((tierMsg.content[0].text || '').trim());
    console.log('[parse-pdf] raw tier response:', rawTier);
    const tierStr = (rawTier.match(/\{[\s\S]*\}/) || [])[0] || '{}';

    let parsed;
    try { parsed = JSON.parse(tierStr); } catch (e) {
      console.error('[parse-pdf] Failed to parse tier JSON:', rawTier);
      return res.status(500).json({ error: 'AI returned invalid JSON for tiers', raw: rawTier });
    }

    // Step 2 — balance + reportYear extraction (non-fatal: falls back to 0 on any failure)
    let pdfTotalBalance = 0;
    let reportYear      = 0;
    let rawBalance      = 'NOT_YET_CALLED';
    try {
      const balanceMsg = await client.messages.create({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages:   [{ role: 'user', content: BALANCE_PROMPT }]
      });
      rawBalance = stripMd((balanceMsg.content[0].text || '').trim());
      console.log('[parse-pdf] raw balance response:', rawBalance);
      const balanceStr = (rawBalance.match(/\{[\s\S]*\}/) || [])[0] || '{}';
      const parsedBal  = JSON.parse(balanceStr);
      pdfTotalBalance = Number(parsedBal.pdfTotalBalance) || 0;
      reportYear      = Number(parsedBal.reportYear)      || 0;
    } catch (balErr) {
      console.error('[parse-pdf] Balance extraction FAILED. Raw response was:', rawBalance, '| Error:', balErr.message);
    }

    let exemptPrincipal = 0, exemptProfit = 0, taxablePrincipal = 0;
    let taxableProfit15 = 0, taxableProfit20 = 0, taxableProfit25 = 0;
    for (const row of (parsed.rows || [])) {
      const tr = Number(row.taxRate);
      const p  = Number(row.principal)  || 0;
      const rp = Number(row.realProfit) || 0;
      const lk = Number(row.linkage)    || 0;
      if (tr === 0)  { exemptPrincipal += p; exemptProfit += (rp + lk); }
      else             taxablePrincipal += p;
      if (tr === 15)   taxableProfit15  += rp;
      if (tr === 20)   taxableProfit20  += rp;
      if (tr === 25)   taxableProfit25  += rp;
    }
    console.log('[parse-pdf] aggregated tiers: p15=%d p20=%d p25=%d | pdfTotalBalance:%d | reportYear:%d',
      taxableProfit15, taxableProfit20, taxableProfit25, pdfTotalBalance, reportYear);
    res.json({
      exemptPrincipal, exemptProfit, taxablePrincipal,
      taxableProfit:   taxableProfit15 + taxableProfit20 + taxableProfit25,
      taxableProfit15, taxableProfit20, taxableProfit25,
      pdfTotalBalance, reportYear
    });

  } catch (err) {
    console.error('[parse-pdf] Anthropic error:', err.status, err.message, JSON.stringify(err.error || {}));
    res.status(500).json({ error: 'Anthropic API error: ' + err.message, httpStatus: err.status, detail: err.error || null });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('[Masklaka Server] Listening on port ' + PORT));
