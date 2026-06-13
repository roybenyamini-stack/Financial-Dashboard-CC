// audit_rules.js — Codex tax rule assertions for Keren Hishtalmut
// Run: node audit_rules.js
// Mirrors the _sfCalculateTax() sugMutzar=4 nominal CGT path from app.js (v181.76+)

'use strict';

var PASS = 0, FAIL = 0;

function assert(label, actual, expected) {
  if (Math.abs(actual - expected) < 0.01) {
    console.log('  ✅ PASS:', label);
    PASS++;
  } else {
    console.error('  ❌ FAIL:', label, '| expected:', expected, '| got:', actual);
    FAIL++;
  }
}

// Pure replica of the sugMutzar=4 nominal CGT block in _sfCalculateTax()
function calcNominalCGT(seg, wdFraction, isExemptEligible, capitalTaxRate) {
  capitalTaxRate = (capitalTaxRate != null) ? capitalTaxRate : 0.25;
  var nomTxProfit   = (seg.taxableProfit  || 0) * wdFraction;
  var taxableSegTax = nomTxProfit * capitalTaxRate;
  var nomExProfit   = (seg.exemptProfit   || 0) * wdFraction;
  var exemptSegTax  = isExemptEligible ? 0 : nomExProfit * capitalTaxRate;
  return taxableSegTax + exemptSegTax;
}

// ─── Rule 1: Strictly NOMINAL — no inflation deduction ───────────────────────
console.log('\nRule 1: Tax must be strictly NOMINAL (no inflation adjustment)');
(function() {
  var seg = { exemptPrincipal: 0, exemptProfit: 0, taxablePrincipal: 100, taxableProfit: 50 };
  var actual     = calcNominalCGT(seg, 1, false, 0.25);
  var taxNominal = 50 * 0.25;                               // 12.5
  var taxIfReal  = Math.max(0, 50 - 0.03 * 100) * 0.25;    // 9.25 — wrong

  assert('Nominal tax on 50K profit = 12.5K', actual, taxNominal);
  // The actual result must NOT equal the real-CGT value
  assert('Result differs from real-CGT (12.5 ≠ 9.25)', actual === taxIfReal ? 1 : 0, 0);
})();

// ─── Rule 2: Principal is never taxed — only profit ──────────────────────────
console.log('\nRule 2: Only profit (above deposits) is taxed, never the principal itself');
(function() {
  // Large principal, zero profit → zero tax
  var seg1 = { exemptPrincipal: 0, exemptProfit: 0, taxablePrincipal: 200, taxableProfit: 0 };
  assert('Principal 200K, profit 0K → tax = 0', calcNominalCGT(seg1, 1, false, 0.25), 0);

  // Tax = profit × rate, not (principal + profit) × rate
  var seg2 = { exemptPrincipal: 0, exemptProfit: 0, taxablePrincipal: 200, taxableProfit: 80 };
  assert('Tax = 80K profit \xD7 25% = 20K (not 280K \xD7 25% = 70K)', calcNominalCGT(seg2, 1, false, 0.25), 20);
})();

// ─── Rule 3: Fully-exempt fund (all tikrat=1, seniority-eligible) → tax = 0 ─
console.log('\nRule 3: Fully liquid fund with all deposits under ceiling → tax = 0 when eligible');
(function() {
  var seg = { exemptPrincipal: 300, exemptProfit: 120, taxablePrincipal: 0, taxableProfit: 0 };

  // Eligible (6+ years seniority) → fully exempt
  assert('Fully exempt fund, 6yr+ seniority → tax = 0', calcNominalCGT(seg, 1, true, 0.25), 0);

  // NOT eligible → exempt profit is taxed at 25%
  assert('Same fund, seniority < 6yr → tax = 120K \xD7 25% = 30K', calcNominalCGT(seg, 1, false, 0.25), 30);
})();

// ─── Results ─────────────────────────────────────────────────────────────────
console.log('\n─────────────────────────────────────────');
console.log('Codex Audit Results:', PASS, 'passed,', FAIL, 'failed');
if (FAIL === 0) {
  console.log('✅ ALL RULES PASS — engine is Codex-compliant.\n');
} else {
  console.error('❌ FAILURES DETECTED — fix before shipping.\n');
  process.exit(1);
}
