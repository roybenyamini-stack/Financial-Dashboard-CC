// Version: v183.10
require('dotenv').config();
const express                = require('express');
const cors                   = require('cors');
const Anthropic              = require('@anthropic-ai/sdk');
const { OpenAI }             = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs                     = require('fs');
const path                   = require('path');

const app          = express();
const client       = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });
const googleClient = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const stripMd = s => s.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();

const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'specialist_prompts.md'), 'utf8');

app.use(cors({ origin: '*' }));
app.use(express.static(__dirname));
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

// ── Generic account-number scoping utilities ─────────────────────────────────
//
// Problem: management companies format account numbers differently in PDFs.
// The system provides "912-443286"; the PDF might print "912443286",
// "0912-443286", "912 443286", or even "00912443286".
//
// Solution: strip to digits → build a separator-tolerant regex → find & scope.

// Returns just the digit characters of an account number.
// "912-443286" → "912443286"
function _acctDigits(acctNum) {
  return acctNum.replace(/\D/g, '');
}

// Returns a RegExp that matches the account number in all formatting variants,
// including when embedded as a substring within a longer company-prefixed number.
//
// Examples for input "917-443195":
//   • "917-443195"          (exact with hyphen)
//   • "917443195"           (no separator)
//   • "917 443195"          (space-separated)
//   • "0917443195"          (1-5 leading digits, e.g. leading zeros)
//   • "033-917-443195-000"  (company prefix 033, trailing suffix 000)
//   • "033917443195000"     (same, no separators)
function createFlexibleAccountRegex(acctNum) {
  const digits  = _acctDigits(acctNum);
  // Each digit may be followed by an optional separator before the next digit
  const pattern = digits.split('').join('[\\s\\-\\.]*');
  // Allow up to 6 extra digits (with optional separators) as a prefix —
  // this handles company routing codes like "033-" prepended before the account digits.
  // No anchoring at start/end so the sequence is also found mid-string.
  return new RegExp('(?:\\d[\\s\\-\\.]*){0,6}' + pattern);
}

// Phrases marking the start of an account's OWN detail section (not a summary row).
// Used to pick the correct occurrence when the account number appears multiple times.
const _DETAIL_SECTION_RE  = /(?:מספר\s*חשבון\s*העמית|פרטי\s*החשבון|גיליון\s*חשבון|חשבון\s*מספר\s*\d)/;

// Phrases that signal the start of a DIFFERENT account's section in consolidated PDFs
// (used as the end-boundary for the current account's block).
const _SECTION_BOUNDARY_RE = /(?:מספר\s*(?:חשבון|פוליסה|קופה|חבר)|מספ[''']\s*(?:חשבון|פוליסה))/g;

// Scan the full text for account-number-like patterns (≥7 consecutive digits, possibly
// separated by hyphens/spaces). Used to report which accounts ARE in the PDF when
// the requested account is not found.
function detectAccountsInText(fullText) {
  const seen = new Set();
  const re   = /\d[\d\-]{5,16}\d/g;
  let m;
  while ((m = re.exec(fullText)) !== null) {
    const digits = m[0].replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 14) seen.add(m[0]);
  }
  return [...seen].slice(0, 10);
}

// Scope full PDF text to the section that belongs to acctNum.
// Returns { scopedText, found, matchedForm, allMatchCount, stats, detectedAccounts }
//   found=true  → scoped to the account's block; text sent to AI is smaller & focused
//   found=false → account not located; full text is returned as a safe fallback
//
// v2 improvements over v1:
//   • Finds ALL occurrences (matchAll) — consolidated PDFs list accounts in summary
//     tables before the detailed sections; v1 always grabbed the first (wrong) one.
//   • Prefers the occurrence adjacent to a "detail section" header phrase.
//   • Falls back to the LAST occurrence (detail sections follow cover/summary pages).
//   • MIN_BOUNDARY_SKIP=3000 prevents false boundary triggers inside summary tables
//     where multiple account numbers appear within a few hundred chars of each other.
//   • Larger BEFORE/AFTER window (300/10000) safely captures all tax-layer tables.
function scopeTextToAccount(fullText, acctNum) {
  const BEFORE         = 300;
  const AFTER          = 10000;
  const MIN_BOUNDARY_SKIP = 3000; // don't allow boundary detection within 3000 chars of match

  const reGlobal   = new RegExp(createFlexibleAccountRegex(acctNum).source, 'g');
  const allMatches = [...fullText.matchAll(reGlobal)];

  if (!allMatches.length) {
    const detectedAccounts = detectAccountsInText(fullText);
    return { scopedText: fullText, found: false, matchedForm: null,
             allMatchCount: 0, detectedAccounts,
             stats: { inputLen: fullText.length, outputLen: fullText.length } };
  }

  // 1st priority: occurrence adjacent to a detail-section header phrase.
  // 2nd priority: last occurrence (detail sections come after cover/summary pages).
  let chosen = allMatches[allMatches.length - 1];
  for (const m of allMatches) {
    const vicinity = fullText.slice(Math.max(0, m.index - 50), m.index + 120);
    if (_DETAIL_SECTION_RE.test(vicinity)) { chosen = m; break; }
  }

  const matchIdx   = chosen.index;
  const blockStart = Math.max(0, matchIdx - BEFORE);
  const hardEnd    = Math.min(fullText.length, matchIdx + AFTER);

  let boundaryEnd = hardEnd;
  _SECTION_BOUNDARY_RE.lastIndex = matchIdx + chosen[0].length + MIN_BOUNDARY_SKIP;
  const boundaryMatch = _SECTION_BOUNDARY_RE.exec(fullText);
  if (boundaryMatch && boundaryMatch.index < hardEnd) {
    const lineStart = fullText.lastIndexOf('\n', boundaryMatch.index);
    boundaryEnd = lineStart > blockStart ? lineStart : boundaryMatch.index;
  }

  const scopedText = fullText.slice(blockStart, boundaryEnd);
  return {
    scopedText,
    found:           true,
    matchedForm:     chosen[0],
    allMatchCount:   allMatches.length,
    detectedAccounts: [],
    stats: { inputLen: fullText.length, outputLen: scopedText.length }
  };
}

// ── /api/parse-pdf — extract Keren Hishtalmut tax layers from annual report PDF ──
const pdfParse = require('pdf-parse');

// Returns 'meitav', 'altshuler', or null based on firm keywords in the full PDF text.
function detectFirm(text) {
  if (/מיטב/.test(text)) return 'meitav';
  if (/אלטשולר/.test(text)) return 'altshuler';
  return null;
}

// Aggregates AI-parsed tier rows into the full field set returned to the frontend.
// Tier count is determined by account seniority (Israeli tax law), not by the firm —
// both parsers call this with however many rows the document contains.
function _aggregateTierRows(rows, pdfTotalBalance) {
  let exemptPrincipal = 0, exemptProfit = 0, taxablePrincipal = 0;
  let taxableProfit15 = 0, taxableProfit20 = 0, taxableProfit25 = 0;
  let allTierTotal = 0;

  for (const row of rows) {
    const tr = Number(row.taxRate);
    const p  = Number(row.principal)  || 0;
    const rp = Number(row.realProfit) || 0;
    const lk = Number(row.linkage)    || 0;
    allTierTotal += p + rp + lk;
    if (tr === 0)  { exemptPrincipal += p; exemptProfit += (rp + lk); }
    else             taxablePrincipal += p;
    if (tr === 15)   taxableProfit15  += rp;
    if (tr === 20)   taxableProfit20  += rp;
    if (tr === 25)   taxableProfit25  += rp;
  }

  return {
    exemptPrincipal, exemptProfit, taxablePrincipal,
    taxableProfit: taxableProfit15 + taxableProfit20 + taxableProfit25,
    taxableProfit15, taxableProfit20, taxableProfit25,
    exemptAssets: Math.max(0, pdfTotalBalance - allTierTotal)
  };
}

// Meitav ("מיטב קרנות השתלמות") parser.
// Uses Meitav-specific prompt describing its table format and balance terminology.
// Meitav tier + balance extraction is fully regex-based (no AI calls).
// The AI cannot reliably map columns 2/3 in Meitav's inverted layout, so
// hardcoded positional regex replaces it entirely.
async function parseMeitav(scopedText) {
  const lines = scopedText.split('\n');

  // ── Tier extraction ───────────────────────────────────────────────────────
  // Meitav has two row structures in the tax reform table:
  //
  // Structure A — pre-2003 row (3-column: total | realProfit | principal, no linkage):
  //   "{total}{realProfit}{principal}יתרה בגין הפקדות..."   taxRate always 0
  //
  // Structure B — post-2003 rows (4-column: total | realProfit | linkage | principal):
  //   Line N:   "{total}{realProfit}{linkage}{principal}"    ← numbers only
  //   Line N+1: "0%" or "15%" or "20%" or "25%"             ← tax rate for this row
  //
  // Column order (positions 1–4 left-to-right in extracted text):
  //   1 = סה"כ (skip)  2 = רווחים ריאליים (→ realProfit)
  //   3 = הפרשי הצמדה (→ linkage)  4 = קרן (→ principal)

  const NUM  = '([\\d,]+\\.\\d{2})';   // one number: digits+commas then .XX
  const PRE2003_RE = new RegExp('^' + NUM + NUM + NUM + 'יתרה\\s*בגין\\s*הפקדות');
  const NUM4_RE    = new RegExp('^' + NUM + NUM + NUM + NUM + '$');
  const RATE_RE    = /^(0|15|20|25)%$/;

  function parseNum(s) { return parseFloat(s.replace(/,/g, '')); }

  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i].trim();

    // Structure A
    const pre = PRE2003_RE.exec(ln);
    if (pre) {
      const rp = parseNum(pre[2]), p = parseNum(pre[3]);
      if (rp > 0 || p > 0) rows.push({ taxRate: 0, principal: p, realProfit: rp, linkage: 0 });
      continue;
    }

    // Structure B
    const dm = NUM4_RE.exec(ln);
    if (dm && i + 1 < lines.length) {
      const rm = RATE_RE.exec(lines[i + 1].trim());
      if (rm) {
        const rp = parseNum(dm[2]), lk = parseNum(dm[3]), p = parseNum(dm[4]);
        if (rp > 0 || lk > 0 || p > 0)
          rows.push({ taxRate: parseInt(rm[1], 10), principal: p, realProfit: rp, linkage: lk });
      }
    }
  }
  console.log('[parseMeitav] regex extracted %d non-zero tier rows:', rows.length, JSON.stringify(rows));

  // ── Balance extraction ────────────────────────────────────────────────────
  // "סכום למשיכה: 529,997.83" appears in the account summary section.
  // Fallback: largest number on the "סה"כ" line of the tax table.
  let pdfTotalBalance = 0;
  const balM = scopedText.match(/סכום\s*למשיכה[:\s]+([\d,]+\.?\d*)/);
  if (balM) {
    pdfTotalBalance = parseFloat(balM[1].replace(/,/g, ''));
  } else {
    // Fallback: find the "סה"כ" summary line of the tax table and take its first number
    const sekM = scopedText.match(/([\d,]+\.\d{2})(?:[\d,]+\.\d{2})*סה"כ/);
    if (sekM) pdfTotalBalance = parseFloat(sekM[1].replace(/,/g, ''));
  }

  // ── Report year extraction ────────────────────────────────────────────────
  // Look for "שנת 2025" or any date like "31.12.2025" or "31/12/2025"
  let reportYear = 0;
  const yrM = scopedText.match(/שנת\s+(20\d{2})/) || scopedText.match(/31[./]12[./](20\d{2})/);
  if (yrM) reportYear = parseInt(yrM[1], 10);

  console.log('[parseMeitav] balance=%d year=%d', pdfTotalBalance, reportYear);
  const agg = _aggregateTierRows(rows, pdfTotalBalance);
  console.log('[parseMeitav] aggregated: p15=%d p20=%d p25=%d',
    agg.taxableProfit15, agg.taxableProfit20, agg.taxableProfit25);
  return { ...agg, pdfTotalBalance, reportYear };
}

// Altshuler ("אלטשולר שחם") parser.
// Uses Altshuler-specific prompt describing its detailed annual report format and terminology.
async function parseAltshuler(scopedText, assetNum) {
  const TIER_PROMPT = `CRITICAL: Output ONLY valid JSON starting with { and ending with }. No text, no markdown, no code blocks.

You are analyzing an Altshuler Shaham Keren Hishtalmut ("אלטשולר שחם") detailed annual report ("דוח שנתי מפורט").
Work ONLY with account ${assetNum}.

Find the Israeli capital gains tax reform table titled "פירוט סכומים בהתאם לרפורמה במיסוי רווחי הון". This table breaks the fund assets into historical periods with different tax rates (0%, 15%, 20%, 25%).

COLUMN IDENTIFICATION — CRITICAL:
This is an RTL (right-to-left) Hebrew document. When extracted to text, columns appear LEFT-TO-RIGHT, which is the REVERSE of their visual order on the page. In Altshuler's table the extracted column order is:
  סה"כ (total)  |  רווחים ריאליים (real profits)  |  הפרשי הצמדה (linkage)  |  קרן (principal)

Identify each value by its Hebrew column header — do NOT use positional counting:
  • Number under סה"כ            → SKIP — always the largest (sum of the other three)
  • Number under רווחים ריאליים  → realProfit field
  • Number under הפרשי הצמדה    → linkage field
  • Number under קרן             → principal field

Extract ALL present tax-rate rows. There may be 1 to 4 rows (0%, 15%, 20%, 25%) depending on the account's deposit history. Extract every row that appears. Skip rows where ALL monetary values are 0.
The taxRate field must be the integer tax rate (0, 15, 20, or 25).

Return EXACTLY this JSON:
{"rows": [{"taxRate": 0, "principal": 0, "realProfit": 0, "linkage": 0}]}

One object per non-zero table row.

Report text:
${scopedText}`;

  const BALANCE_PROMPT = `CRITICAL: Output ONLY valid JSON. No text, no markdown.
In this Altshuler Shaham ("אלטשולר שחם") financial report for account ${assetNum}:
1. Find the total fund balance. Primary source: find the line containing the word "סה\"כ" (grand total) at the bottom of the tax reform table — the first (leftmost/largest) number on that line is the total balance. Secondary: look for "יתרה לתום תקופת הדיווח" followed by a number. Report in NIS as a plain number without commas.
2. Find the report year. Look for "שנת הדיווח", "לשנת", or a date like "31.12.2025". Report as a 4-digit integer.
Return EXACTLY: {"pdfTotalBalance": 0, "reportYear": 0}
Report text:
${scopedText}`;

  const tierMsg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001', max_tokens: 1000, temperature: 0,
    messages: [{ role: 'user', content: TIER_PROMPT }]
  });
  const rawTier = stripMd((tierMsg.content[0].text || '').trim());
  console.log('[parseAltshuler] raw tier response:', rawTier);
  let parsed;
  try { parsed = JSON.parse((rawTier.match(/\{[\s\S]*\}/) || [])[0] || '{}'); } catch (e) {
    throw new Error('Altshuler: AI returned invalid JSON for tiers: ' + rawTier);
  }

  let pdfTotalBalance = 0, reportYear = 0, rawBal = 'NOT_YET_CALLED';
  try {
    const balMsg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', max_tokens: 200,
      messages: [{ role: 'user', content: BALANCE_PROMPT }]
    });
    rawBal = stripMd((balMsg.content[0].text || '').trim());
    console.log('[parseAltshuler] raw balance response:', rawBal);
    const parsedBal = JSON.parse((rawBal.match(/\{[\s\S]*\}/) || [])[0] || '{}');
    pdfTotalBalance = Number(parsedBal.pdfTotalBalance) || 0;
    reportYear      = Number(parsedBal.reportYear)      || 0;
  } catch (balErr) {
    console.error('[parseAltshuler] Balance extraction FAILED. Raw response was:', rawBal, '| Error:', balErr.message);
  }

  const agg = _aggregateTierRows(parsed.rows || [], pdfTotalBalance);
  console.log('[parseAltshuler] aggregated: p15=%d p20=%d p25=%d pdfTotal=%d year=%d',
    agg.taxableProfit15, agg.taxableProfit20, agg.taxableProfit25, pdfTotalBalance, reportYear);
  return { ...agg, pdfTotalBalance, reportYear };
}

// Routes each PDF to the correct firm-specific parser.
app.post('/api/parse-pdf', express.json({ limit: '25mb' }), async (req, res) => {
  const { pdf, assetNum } = req.body || {};
  if (!pdf)      return res.status(400).json({ error: 'Missing pdf field (base64)' });
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
  if (text.length < 30)
    return res.status(422).json({ error: 'PDF appears to have no extractable text (scanned image?)' });

  // Step 2: scope text to the specific account block before sending to AI
  const scoped = scopeTextToAccount(text, assetNum);
  console.log('[parse-pdf] account scoping: found=%s matchedForm=%s occurrences=%d inputLen=%d outputLen=%d',
    scoped.found, scoped.matchedForm, scoped.allMatchCount || 0, scoped.stats.inputLen, scoped.stats.outputLen);
  if (!scoped.found) {
    console.warn('[parse-pdf] WARNING: account "%s" not found in PDF — falling back to full text. Accounts detected in PDF: %s',
      assetNum, JSON.stringify(scoped.detectedAccounts));
  }
  const scopedText = scoped.scopedText;

  // Step 3: detect firm and route to its dedicated parser
  const firm = detectFirm(text);
  if (!firm)
    return res.status(422).json({ error: 'Unrecognized investment firm in PDF — expected מיטב or אלטשולר' });
  console.log('[parse-pdf] detected firm: %s', firm);

  try {
    const result = firm === 'meitav'
      ? await parseMeitav(scopedText)
      : await parseAltshuler(scopedText, assetNum);
    res.json(result);
  } catch (err) {
    console.error('[parse-pdf] Parser error (%s): %s %s', firm, err.status || '', err.message);
    res.status(500).json({ error: 'Parse error (' + firm + '): ' + err.message });
  }
});

// ── /api/verification/tax — 3-model parallel tax verification ────────────────
const MASTER_TAX_RULES_FILE = path.join(__dirname, 'israel_tax_rules.md');
const SUPPORTED_ASSET_TYPES = ['keren_hishtalmut', 'kupat_gemel'];

function buildVerificationPrompt(assetType, ruleContent, genericData) {
  return [
    'You are an Israeli tax verification expert.',
    '',
    '[SOURCE OF TRUTH — ' + assetType + ' Tax Rules]',
    ruleContent,
    '',
    '[USER DATA TO VERIFY]',
    JSON.stringify(genericData, null, 2),
    '',
    '[TASK]',
    'Based solely on the tax rules above, verify whether the tax calculation in the user data is correct.',
    'Return a JSON object with exactly these keys:',
    '{',
    '  "verdict": "correct" | "incorrect" | "uncertain",',
    '  "confidence": <integer 0-100>,',
    '  "issues": ["list of specific issues found, or empty array"],',
    '  "explanation": "<brief explanation in Hebrew>"',
    '}',
    'Return ONLY the JSON object. No markdown, no preamble.',
  ].join('\n');
}

function parseModelJson(raw) {
  const cleaned = (raw || '').replace(/^```json?\n?/, '').replace(/\n?```$/, '').trim();
  const match   = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in response');
  return JSON.parse(match[0]);
}

app.post('/api/verification/tax', express.json({ limit: '2mb' }), async (req, res) => {
  const { assetType, genericData } = req.body || {};
  if (!assetType)    return res.status(400).json({ error: 'Missing assetType' });
  if (!genericData)  return res.status(400).json({ error: 'Missing genericData' });
  if (!SUPPORTED_ASSET_TYPES.includes(assetType))
    return res.status(400).json({ error: 'Unsupported assetType', supported: SUPPORTED_ASSET_TYPES });

  let ruleContent;
  try { ruleContent = fs.readFileSync(MASTER_TAX_RULES_FILE, 'utf8'); }
  catch (e) { return res.status(500).json({ error: 'Tax rules file not found' }); }

  console.log('[verification/tax] assetType=%s', assetType);
  const prompt = buildVerificationPrompt(assetType, ruleContent, genericData);

  const anthropicCall = client.messages.create({
    model: 'claude-sonnet-4-6', max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  }).then(msg => parseModelJson(msg.content[0].text));

  const openaiCall = openaiClient.chat.completions.create({
    model: 'gpt-4o', max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  }).then(r => parseModelJson(r.choices[0].message.content));

  const googleCall = (async () => {
    const model  = googleClient.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    return parseModelJson(result.response.text());
  })();

  const [aR, oR, gR] = await Promise.allSettled([anthropicCall, openaiCall, googleCall]);
  function settle(r, name) {
    if (r.status === 'fulfilled') return r.value;
    console.error('[verification/tax] ' + name + ' failed:', r.reason.message);
    return { error: r.reason.message };
  }
  res.json({ anthropic: settle(aR, 'anthropic'), openai: settle(oR, 'openai'), google: settle(gR, 'google') });
});

// ── /api/chat/tax — conversational AI tax advisor ────────────────────────────
app.post('/api/chat/tax', express.json({ limit: '1mb' }), async (req, res) => {
  const { question, data } = req.body || {};
  if (!question) return res.status(400).json({ error: 'Missing question' });

  let ruleContent;
  try { ruleContent = fs.readFileSync(MASTER_TAX_RULES_FILE, 'utf8'); }
  catch (e) { return res.status(500).json({ error: 'Tax rules file not found' }); }

  const prompt = [
    'אתה יועץ מס ישראלי מומחה בקרנות השתלמות וחישובי מס.',
    'ענה על שאלת המשתמש בעברית, בצורה ברורה וקצרה (עד 4 משפטים).',
    '',
    '[חוקי המס — מקור אמת]',
    ruleContent,
    '',
    '[נתוני הקרן של המשתמש]',
    JSON.stringify(data || {}, null, 2),
    '',
    '[שאלת המשתמש]',
    question,
  ].join('\n');

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6', max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ answer: (msg.content[0].text || '').trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log('[Masklaka Server] Listening on port ' + PORT));
