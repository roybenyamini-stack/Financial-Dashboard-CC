/**
 * run_audit.js — Financial Logic Auditor Bridge
 *
 * Reads israel_tax_rules.md and relevant tax functions from app.js,
 * then asks a secondary LLM auditor to verify the code matches the rules.
 * Output is written to audit_report.md.
 *
 * Usage:
 *   AUDIT_API_KEY=sk-... node run_audit.js
 *   node run_audit.js          # runs in stub mode (no API call)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

const ROOT      = __dirname;
const RULES_FILE  = path.join(ROOT, 'israel_tax_rules.md');
const APP_FILE    = path.join(ROOT, 'app.js');
const REPORT_FILE = path.join(ROOT, 'audit_report.md');

// ── Keywords that identify financial tax calculation functions ──────────────
const TAX_KEYWORDS = [
  'hishtalmut', 'taxable', 'keren', 'exempt',
  'realGain', 'capitalGain', 'taxRate', 'inflation',
  'withdrawal', 'realProfit', 'nominalProfit'
];

// ── Step 1: Read rules ──────────────────────────────────────────────────────
function readRules() {
  if (!fs.existsSync(RULES_FILE)) {
    console.error('[audit] ERROR: israel_tax_rules.md not found.');
    process.exit(1);
  }
  return fs.readFileSync(RULES_FILE, 'utf8');
}

// ── Step 2: Extract relevant lines from app.js ──────────────────────────────
function extractTaxCode() {
  if (!fs.existsSync(APP_FILE)) {
    console.error('[audit] ERROR: app.js not found.');
    process.exit(1);
  }

  const lines = fs.readFileSync(APP_FILE, 'utf8').split('\n');
  const pattern = new RegExp(TAX_KEYWORDS.join('|'), 'i');

  // Collect matching lines with ±5 lines of context
  const hits = new Set();
  lines.forEach(function(line, i) {
    if (pattern.test(line)) {
      for (let j = Math.max(0, i - 5); j <= Math.min(lines.length - 1, i + 5); j++) {
        hits.add(j);
      }
    }
  });

  if (hits.size === 0) {
    return '(No tax-related code found matching keywords: ' + TAX_KEYWORDS.join(', ') + ')';
  }

  const sorted = Array.from(hits).sort(function(a, b) { return a - b; });
  const chunks = [];
  let block = [];

  sorted.forEach(function(lineNum, idx) {
    block.push((lineNum + 1) + ': ' + lines[lineNum]);
    const next = sorted[idx + 1];
    if (next === undefined || next > lineNum + 1) {
      chunks.push(block.join('\n'));
      block = [];
    }
  });

  return chunks.join('\n\n...\n\n');
}

// ── Step 3: Build prompt ────────────────────────────────────────────────────
function buildPrompt(rules, code) {
  return [
    'You are a strict financial compliance auditor specializing in Israeli tax law.',
    'Your job is to verify that the JavaScript code below correctly implements the rules provided.',
    '',
    '## RULES',
    rules,
    '',
    '## CODE UNDER AUDIT (extracted from app.js)',
    '```javascript',
    code,
    '```',
    '',
    '## YOUR TASK',
    'For each rule, state explicitly:',
    '  PASS — the code correctly implements this rule, OR',
    '  FAIL — the code violates or ignores this rule (quote the offending line).',
    '',
    'If no relevant code was found for a rule, state: NOT FOUND — no implementation detected.',
    '',
    'End your report with an overall verdict: APPROVED or NEEDS FIXES.',
    'Be concise. Do not hallucinate code that is not shown above.'
  ].join('\n');
}

// ── Step 4: Call OpenAI API ─────────────────────────────────────────────────
function callOpenAI(prompt, apiKey) {
  return new Promise(function(resolve, reject) {
    const body = JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error('OpenAI API error: ' + parsed.error.message));
          } else {
            resolve(parsed.choices[0].message.content);
          }
        } catch (e) {
          reject(new Error('Failed to parse API response: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Step 5: Write report ────────────────────────────────────────────────────
function writeReport(content, isStub) {
  const timestamp = new Date().toISOString();
  const header = [
    '# Audit Report — Keren Hishtalmut Tax Logic',
    '**Generated:** ' + timestamp,
    isStub ? '**Mode:** STUB (no AUDIT_API_KEY set — no real API call was made)' : '**Mode:** LIVE (OpenAI API)',
    '',
    '---',
    ''
  ].join('\n');

  fs.writeFileSync(REPORT_FILE, header + content + '\n', 'utf8');
  console.log('[audit] Report written to audit_report.md');
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('[audit] Reading rules from israel_tax_rules.md...');
  const rules = readRules();

  console.log('[audit] Extracting tax-related code from app.js...');
  const code = extractTaxCode();
  console.log('[audit] Extracted ' + code.split('\n').length + ' lines of relevant code.');

  const prompt = buildPrompt(rules, code);

  const apiKey = process.env.AUDIT_API_KEY;

  if (!apiKey) {
    console.warn('[audit] WARNING: AUDIT_API_KEY not set. Writing stub report.');
    const stubContent = [
      '## [STUB — no API key set]',
      '',
      'To run a real audit, set the AUDIT_API_KEY environment variable:',
      '```',
      'AUDIT_API_KEY=sk-... node run_audit.js',
      '```',
      '',
      '## Prompt that would be sent to auditor:',
      '',
      '```',
      prompt,
      '```'
    ].join('\n');
    writeReport(stubContent, true);
    return;
  }

  console.log('[audit] Calling OpenAI API...');
  try {
    const response = await callOpenAI(prompt, apiKey);
    writeReport(response, false);
  } catch (err) {
    console.error('[audit] API call failed:', err.message);
    writeReport('## ERROR\n\n' + err.message, false);
    process.exit(1);
  }
}

main();
