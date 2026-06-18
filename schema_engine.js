'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// schema_engine.js — Generic PDF extraction engine.
// Accepts any Schema object (see parse_schema.js); knows nothing about providers.
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Block Isolation ───────────────────────────────────────────────────────
// Finds the text block that belongs to `accountNum` in a multi-account PDF.
// Returns { block: string, found: boolean }.
function isolateBlock(fullText, accountNum, schema) {
  const candidates = [accountNum];
  const digitsOnly = accountNum.replace(/-/g, '');
  if (digitsOnly !== accountNum) candidates.push(digitsOnly);
  const noTrailing = accountNum.replace(/-\d+$/, '');
  if (noTrailing !== accountNum && noTrailing !== digitsOnly) candidates.push(noTrailing);

  let startIdx = -1;
  let matchedNum = accountNum;
  for (const c of candidates) {
    const idx = fullText.indexOf(c);
    if (idx !== -1) { startIdx = idx; matchedNum = c; break; }
  }

  if (startIdx === -1) {
    console.log('[schema_engine] WARNING: accountNum %s not found (tried: %s)', accountNum, candidates.join(', '));
    return { block: '', found: false };
  }

  const afterStart = fullText.slice(startIdx + matchedNum.length);
  const boundaryPattern = new RegExp(
    schema.blockBoundaryPatterns.map(r => r.source).join('|')
  );
  const nextMatch = afterStart.match(boundaryPattern);
  const naturalEnd = nextMatch
    ? startIdx + matchedNum.length + nextMatch.index
    : fullText.length;
  const sectionEnd = Math.min(naturalEnd, startIdx + schema.maxBlockChars);
  const block = fullText.slice(startIdx, sectionEnd);

  console.log('[schema_engine] scoped: %d/%d chars for account %s', block.length, fullText.length, accountNum);
  return { block, found: true };
}

// ── 2. Seniority Date Extractor ──────────────────────────────────────────────
// Two-pass: account-anchored search (preferred), then global label fallback.
function extractSeniorityDate(block, fullText, accountNum, fieldDef) {
  const cleanBlock    = block.replace(/\s+/g, ' ');
  const cleanFull     = fullText.replace(/\s+/g, ' ');
  const { accountAnchor, globalLabels, windowAfter } = fieldDef;

  // Pass 1 — anchor search around each occurrence of accountNum in full text
  if (accountNum && accountAnchor) {
    let pos = cleanFull.indexOf(accountNum);
    while (pos !== -1) {
      const area = cleanFull.substring(pos, pos + accountAnchor.windowChars);
      const kwMatch = area.match(accountAnchor.keywords);
      if (kwMatch) {
        const dateRe = /(\d{1,2}[./]\d{1,2}[./]\d{4})/g;
        let m, closestDate = null, minDist = Infinity;
        while ((m = dateRe.exec(area)) !== null) {
          const dist = Math.abs(m.index - kwMatch.index);
          if (dist < minDist) { minDist = dist; closestDate = m[1]; }
        }
        if (closestDate) {
          console.log('[schema_engine] seniorityDate (anchor):', closestDate);
          return _parseDate(closestDate);
        }
      }
      pos = cleanFull.indexOf(accountNum, pos + 1);
    }
  }

  // Pass 2 — global label search
  if (globalLabels) {
    const parts = [];
    for (const label of globalLabels) {
      const normal   = label.split(' ').join('\\s+');
      const reversed = label.split('').reverse().join('').split(' ').join('\\s+');
      parts.push(normal, reversed);
    }
    const re = new RegExp('(?:' + parts.join('|') + ').{0,' + (windowAfter || 250) + '}?(\\d{1,2}[./]\\d{1,2}[./]\\d{4})');
    const m  = cleanBlock.match(re);
    if (m) {
      console.log('[schema_engine] seniorityDate (global label):', m[1]);
      return _parseDate(m[1]);
    }
  }

  console.log('[schema_engine] seniorityDate: not found');
  return null;
}

function _parseDate(str) {
  const p = str.split(/[./]/);
  return new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]));
}

// ── 3. Generic Field Extractor ───────────────────────────────────────────────
// Runs each label pattern against `text`; on match applies the type-specific extractor.
// Returns the extracted value or null.
function extractField(text, fieldDef) {
  for (const label of fieldDef.labels) {
    const m = text.match(label);
    if (!m) continue;

    if (fieldDef.type === 'firstNumberAbove') {
      const window = m[1] || '';
      const nums = (window.match(/[\d,]+(?:\.\d+)?/g) || [])
        .map(n => Number(n.replace(/,/g, '')))
        .filter(n => n > (fieldDef.threshold || 0));
      if (nums.length > 0) {
        console.log('[schema_engine] field balance: %d', nums[0]);
        return nums[0];
      }
    }

    if (fieldDef.type === 'captureGroup1AsYear') {
      const year = Number(m[1]);
      if (year > 1990 && year < 2100) {
        console.log('[schema_engine] field reportYear: %d', year);
        return year;
      }
    }
  }
  return null;
}

// ── 4. Main Engine ───────────────────────────────────────────────────────────
// extractBySchema(fullText, accountNum, schema, aiClient, buildPrompt)
//   → { balance, reportYear, seniorityDate, tiers, _block } | null
async function extractBySchema(fullText, accountNum, schema, aiClient, buildPrompt) {
  const { block, found } = isolateBlock(fullText, accountNum, schema);
  if (!found) return null;

  const result = { _block: block };

  for (const [key, fieldDef] of Object.entries(schema.fields)) {
    if (fieldDef.type === 'seniorityDate') {
      result[key] = extractSeniorityDate(block, fullText, accountNum, fieldDef);
    } else {
      result[key] = extractField(block, fieldDef);
    }
  }

  if (schema.aiExtraction && aiClient && buildPrompt) {
    const prompt = buildPrompt(block, accountNum);
    const msg = await aiClient.messages.create({
      model:       schema.aiExtraction.model,
      max_tokens:  schema.aiExtraction.maxTokens,
      temperature: schema.aiExtraction.temperature,
      messages:    [{ role: 'user', content: prompt }],
    });
    result[schema.aiExtraction.outputKey] = (msg.content[0].text || '').trim();
  }

  return result;
}

module.exports = { extractBySchema, isolateBlock, extractField, extractSeniorityDate };
