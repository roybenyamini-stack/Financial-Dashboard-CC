// Manual assertion smoke test, following the repo's existing test_parser.js convention
// (node test_t190_bucket_view.js). Requires the real production module directly — no logic
// is copied or reimplemented here.
//
// Fixtures 1 and 3 use Roy's real, previously-verified PerutYitraLeTkufa occurrence data
// (accounts internally labeled PF-D / PF-B) — exact tuples and amounts confirmed earlier
// this session by directly parsing real rawXml. All other fixtures are synthetic, built to
// exercise specific edge cases.
//
// Fixture 12(a) (regression check on the refactored _parseT190BucketsFromXML) and 12(b)
// (git diff scope check) are NOT run by this script — app.js cannot be require()'d in Node
// (its top-level code is a password/login gate touching document/sessionStorage/crypto.subtle
// unconditionally). Those two checks are performed manually / via a separate git diff command,
// per the implementation plan.

var t190 = require('./t190_bucket_view.js');

var passed = 0, failed = 0;
function assert(cond, label) {
  if (cond) { passed++; console.log('✅ ' + label); }
  else      { failed++; console.error('❌ ' + label); }
}
function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// ── Fixture builders ─────────────────────────────────────────────────────────
function nilTikrat() { return { present: true, nil: true, text: '' }; }
function occ(rekiv, sug, kod, tikratRaw, amountRaw) {
  return {
    rekiv_itra_letkufa: rekiv,
    sug_itra_letkufa: sug,
    kod_techulat_shichva: kod,
    tikrat_raw: tikratRaw,
    amount_raw: amountRaw
  };
}

// Real PF-D occurrences (verified earlier this session).
var PF_D = [
  occ('2', '1', '3', nilTikrat(), '87961.90'),
  occ('3', '1', '3', nilTikrat(), '87961.93'),
  occ('2', '1', '5', nilTikrat(), '23713.38'),
  occ('3', '1', '5', nilTikrat(), '23713.17'),
  occ('2', '2', '7', nilTikrat(), '4803.70'),
  occ('3', '2', '7', nilTikrat(), '4803.70')
];

// Real PF-B occurrences (verified earlier this session) — exercises the KOD 9–10 path.
var PF_B = [
  occ('4', '2', '7', nilTikrat(), '2461.01'),
  occ('1', '1', '9', nilTikrat(), '126822.29'),
  occ('1', '2', '9', nilTikrat(), '121932.83')
];

// ── 1. Exact PF-D totals ──────────────────────────────────────────────────────
(function () {
  var view = t190._t190BuildAccountBucketView(PF_D, 'PF-D', 'fallback_id');
  assert(view.buckets.capital_exempt.amount_agorot === 17592383, '1. capital_exempt.amount_agorot === 17,592,383');
  assert(view.buckets.qualifying_annuity.amount_agorot === 5703395, '1. qualifying_annuity.amount_agorot === 5,703,395');
  assert(view.buckets.recognized_annuity.amount_agorot === 0, '1. recognized_annuity.amount_agorot === 0');
  assert(view.buckets.unresolved.amount_agorot === 0, '1. unresolved.amount_agorot === 0');

  // ── 2. display_amount_k (whole integers, sign-preserving, no -0) ───────────
  assert(view.buckets.capital_exempt.display_amount_k === 176, '2. capital_exempt.display_amount_k === 176');
  assert(view.buckets.qualifying_annuity.display_amount_k === 57, '2. qualifying_annuity.display_amount_k === 57');
  assert(view.buckets.recognized_annuity.display_amount_k === 0, '2. recognized_annuity.display_amount_k === 0');
  assert(view.buckets.capital_exempt.amount_agorot === 17592383, '2. amount_agorot unaffected by display_amount_k');
})();

(function () {
  assert(t190._t190DeriveDisplayAmountK(-50000) === -1, '2. sign-preserving rounding: -50000 agorot -> -1');
  var z1 = t190._t190DeriveDisplayAmountK(-1);
  var z2 = t190._t190DeriveDisplayAmountK(-49999);
  assert(z1 === 0 && !Object.is(z1, -0), '2. -1 agorot -> ordinary 0, not -0');
  assert(z2 === 0 && !Object.is(z2, -0), '2. -49999 agorot -> ordinary 0, not -0');
})();

// ── 3. KOD 9–10 -> recognized_annuity (real PF-B data) ────────────────────────
(function () {
  var view = t190._t190BuildAccountBucketView(PF_B, 'PF-B', 'fallback_id');
  assert(view.buckets.recognized_annuity.amount_agorot === 12682229 + 12193283, '3. recognized_annuity sums both real KOD=9 occurrences');
  assert(view.buckets.qualifying_annuity.amount_agorot === 246101, '3. qualifying_annuity gets the real KOD=7 occurrence');
})();

// ── 4. Unknown / absent / malformed / out-of-range KOD -> unresolved ─────────
(function () {
  var synth = [
    occ('1', '1', null, nilTikrat(), '100.00'),
    occ('1', '1', 'abc', nilTikrat(), '100.00'),
    occ('1', '1', '0', nilTikrat(), '100.00'),
    occ('1', '1', '11', nilTikrat(), '100.00')
  ];
  var buckets = t190._t190AggregateOccurrencesIntoBuckets(synth);
  assert(buckets.unresolved.source_occurrences.length === 4, '4. all four land in unresolved');
  var reasons = buckets.unresolved.source_occurrences.map(function (o) { return o.unresolved_reason; });
  assert(reasons.indexOf('kod_absent') !== -1, '4. reason: kod_absent');
  assert(reasons.indexOf('kod_malformed') !== -1, '4. reason: kod_malformed');
  assert(reasons.indexOf('kod_out_of_known_range:0') !== -1, '4. reason: kod_out_of_known_range:0');
  assert(reasons.indexOf('kod_out_of_known_range:11') !== -1, '4. reason: kod_out_of_known_range:11');
  assert(buckets.unresolved.amount_agorot === 40000, '4. all four amounts (100.00 each) still counted in unresolved total');
})();

// ── 5. Malformed amount stays visible, does not corrupt totals ───────────────
(function () {
  var buckets = t190._t190AggregateOccurrencesIntoBuckets([occ('1', '1', '3', nilTikrat(), 'N/A')]);
  assert(buckets.unresolved.source_occurrences.length === 1, '5. unparseable-amount occurrence lands in unresolved');
  assert(buckets.unresolved.source_occurrences[0].unresolved_reason === 'amount_unparseable', '5. reason: amount_unparseable');
  assert(buckets.unresolved.source_occurrences[0].amount_agorot === null, '5. amount_agorot stays null');
  assert(buckets.unresolved.source_occurrences[0].amount_raw === 'N/A', '5. raw amount preserved verbatim');
  assert(buckets.unresolved.amount_agorot === 0, "5. unparseable amount does not change unresolved's numeric total");
})();

// ── 6. Exact sign-safe parsing ────────────────────────────────────────────────
(function () {
  assert(t190._t190ParseAgorotExact('0.10') === 10, '6. "0.10" -> 10 agorot');
  assert(t190._t190ParseAgorotExact('0.20') === 20, '6. "0.20" -> 20 agorot');
  assert(t190._t190ParseAgorotExact('-0.50') === -50, '6. "-0.50" -> -50 agorot (sign capture group, not whole<0 inference)');
})();

// ── 6a. Safe-integer boundary behavior ────────────────────────────────────────
(function () {
  var atBoundary   = '90071992547409.91'; // exact agorot value === Number.MAX_SAFE_INTEGER
  var overBoundary = '90071992547409.92'; // one agorot beyond -> 2^53, unsafe
  assert(t190._t190ParseAgorotExact(atBoundary) === Number.MAX_SAFE_INTEGER, '6a. exact MAX_SAFE_INTEGER agorot parses successfully');
  assert(t190._t190ParseAgorotExact(overBoundary) === null, '6a. one agorot beyond MAX_SAFE_INTEGER returns null');
})();

// ── 6b. Unsafe-magnitude occurrence -> unresolved with specific reason ───────
(function () {
  var unsafeAmount = '90071992547409920.00'; // whole itself already exceeds Number.MAX_SAFE_INTEGER
  var buckets = t190._t190AggregateOccurrencesIntoBuckets([occ('1', '1', '3', nilTikrat(), unsafeAmount)]);
  var rec = buckets.unresolved.source_occurrences[0];
  assert(rec !== undefined, '6b. unsafe-magnitude occurrence lands in unresolved');
  assert(rec.unresolved_reason === 'amount_out_of_safe_integer_range', '6b. reason is amount_out_of_safe_integer_range, not amount_unparseable');
  assert(rec.amount_agorot === null, '6b. amount_agorot stays null for unsafe magnitude');
  assert(rec.amount_raw === unsafeAmount, '6b. raw amount preserved verbatim');
})();

// ── 7. Account isolation ──────────────────────────────────────────────────────
(function () {
  var occA = [occ('2', '1', '3', nilTikrat(), '100.00')];
  var occB = [occ('2', '1', '3', nilTikrat(), '100.00')]; // identical tuple, different account
  var viewA = t190._t190BuildAccountBucketView(occA, 'acct-A', 'assetNum');
  var viewB = t190._t190BuildAccountBucketView(occB, 'acct-B', 'assetNum');
  assert(viewA.account_identity === 'acct-A' && viewB.account_identity === 'acct-B', '7. accounts keep distinct identities');
  assert(viewA.buckets.capital_exempt.amount_agorot === 10000 && viewB.buckets.capital_exempt.amount_agorot === 10000,
    '7. each account independently totaled (never merged — the pure module has no cross-account entry point)');
})();

// ── 8. Complete per-occurrence lineage ────────────────────────────────────────
(function () {
  var buckets = t190._t190AggregateOccurrencesIntoBuckets([occ('2', '1', '3', nilTikrat(), '87961.90')]);
  var rec = buckets.capital_exempt.source_occurrences[0];
  assert(rec.rekiv_itra_letkufa === '2', '8. REKIV preserved');
  assert(rec.sug_itra_letkufa === '1', '8. SUG preserved');
  assert(rec.kod_techulat_shichva === '3', '8. KOD preserved');
  assert(rec.tikrat_hafkada_mutevet.kind === 'nil', '8. normalized TIKRAT preserved');
  assert(rec.amount_raw === '87961.90', '8. raw amount preserved');
  assert(rec.amount_agorot === 8796190, '8. exact parsed amount preserved');
})();

// ── 9. Input immutability ─────────────────────────────────────────────────────
(function () {
  var original = [occ('2', '1', '3', nilTikrat(), '87961.90')];
  var clone = JSON.parse(JSON.stringify(original));
  t190._t190AggregateOccurrencesIntoBuckets(original);
  assert(deepEqual(original, clone), '9. raw occurrences array is never mutated by aggregation');
})();

// ── 10. Exact total conservation ──────────────────────────────────────────────
(function () {
  var mixed = PF_D.concat([occ('1', '1', null, nilTikrat(), '50.00')]); // one kod_absent, valid amount
  var viewMixed = t190._t190BuildAccountBucketView(mixed, 'mixed', 'fallback_id');
  var cons = t190._t190VerifyConservation(mixed, viewMixed);
  assert(cons.conserved === true, '10. conservation holds with a mixed known+unresolved (parseable) set');

  var mixed2 = mixed.concat([occ('1', '1', '3', nilTikrat(), 'N/A')]); // + one unparseable amount
  var viewMixed2 = t190._t190BuildAccountBucketView(mixed2, 'mixed2', 'fallback_id');
  var cons2 = t190._t190VerifyConservation(mixed2, viewMixed2);
  assert(cons2.conserved === true, '10. conservation holds excluding the unparseable-amount occurrence from the equality');
})();

// ── 6c. Safe-add / safe-sum helpers, used directly ────────────────────────────
(function () {
  assert(t190._t190SafeAddAgorot(100, 200) === 300, '6c. _t190SafeAddAgorot sums two safe values');
  assert(t190._t190SafeAddAgorot(Number.MAX_SAFE_INTEGER, 1) === null, '6c. _t190SafeAddAgorot detects an unsafe pairwise sum');
  assert(t190._t190SafeAddAgorot(null, 5) === null, '6c. _t190SafeAddAgorot treats a null input as unsafe');
  assert(t190._t190SafeSumAgorot([]) === 0, '6c. _t190SafeSumAgorot of an empty array is 0');
  assert(t190._t190SafeSumAgorot([100, 200, 300]) === 600, '6c. _t190SafeSumAgorot sums several safe values');
  assert(t190._t190SafeSumAgorot([100, null, 300]) === null, '6c. _t190SafeSumAgorot propagates a null element');
})();

// ── 6d. Individually-safe amounts whose AGGREGATE is unsafe ───────────────────
// Two occurrences, each well within Number.isSafeInteger on its own (6e15 agorot), but whose
// sum (1.2e16) exceeds Number.MAX_SAFE_INTEGER (~9.007e15) — the exact bug class this
// correction targets: per-value validation alone is not enough.
(function () {
  var BIG = '60000000000000.00'; // 6,000,000,000,000,000 agorot — individually safe
  var overflowing = [
    occ('2', '1', '3', nilTikrat(), BIG),
    occ('3', '1', '3', nilTikrat(), BIG)
  ];

  var eachParsed = t190._t190ParseAgorotExact(BIG);
  assert(eachParsed !== null && Number.isSafeInteger(eachParsed), '6d. each individual amount parses to a safe integer');

  var buckets = t190._t190AggregateOccurrencesIntoBuckets(overflowing);
  var b = buckets.capital_exempt;
  assert(b.amount_agorot === null, '6d. bucket amount_agorot is null when the aggregate would be unsafe (never an imprecise Number)');
  assert(b.amount_agorot_status === 'unsafe_aggregate', '6d. bucket exposes an explicit unsafe_aggregate status');
  assert(b.display_amount_k === null, '6d. display_amount_k is null too, not silently derived from a bad number');
  assert(b.source_occurrences.length === 2, '6d. both source occurrences are preserved, not dropped');
  assert(b.source_occurrences[0].amount_agorot === eachParsed && b.source_occurrences[1].amount_agorot === eachParsed,
    '6d. each occurrence still carries its own individually-safe exact amount in lineage');

  var view = t190._t190BuildAccountBucketView(overflowing, 'overflow-acct', 'fallback_id');
  assert(view.total_amount_agorot === null, '6d. account total_amount_agorot is null when a contributing bucket is unsafe');
  assert(view.total_amount_agorot_status === 'unsafe_aggregate', '6d. account exposes an explicit unsafe_aggregate status');
  assert(view.total_display_amount_k === null, '6d. total_display_amount_k is null, never derived from a null total');

  var cons = t190._t190VerifyConservation(overflowing, view);
  assert(cons.status === 'unsafe_aggregate', '6d. conservation check reports unsafe_aggregate rather than a possibly-wrong true/false');
  assert(cons.conserved === false, '6d. conserved is false (not silently true) when equality cannot be verified');
  assert(cons.expectedTotal === null && cons.actualTotal === null, '6d. both sides of the conservation check are null, not a coincidentally-matching imprecise pair');
})();

// ── 6e. total_amount_agorot overflow even when every individual bucket is safe ─
// Four bucket totals, each safely within range on its own, whose SUM across buckets is
// unsafe — proves the account-level total sum is guarded independently of the per-bucket guard.
(function () {
  var NEAR_MAX = '30000000000000.00'; // 3,000,000,000,000,000 agorot — safe alone, and safe
                                       // within a single bucket (only one occurrence each)
  var occs = [
    occ('1', '1', '3',  nilTikrat(), NEAR_MAX), // capital_exempt
    occ('1', '1', '5',  nilTikrat(), NEAR_MAX), // qualifying_annuity
    occ('1', '1', '9',  nilTikrat(), NEAR_MAX), // recognized_annuity
    occ('1', '1', null, nilTikrat(), NEAR_MAX)  // unresolved (kod_absent), amount still safe
  ];
  var view = t190._t190BuildAccountBucketView(occs, 'total-overflow-acct', 'fallback_id');
  assert(view.buckets.capital_exempt.amount_agorot_status === 'ok'
      && view.buckets.qualifying_annuity.amount_agorot_status === 'ok'
      && view.buckets.recognized_annuity.amount_agorot_status === 'ok'
      && view.buckets.unresolved.amount_agorot_status === 'ok',
    '6e. every individual bucket is safe on its own (only one occurrence each)');
  assert(view.total_amount_agorot === null, '6e. summing four individually-safe bucket totals still detects an unsafe grand total');
  assert(view.total_amount_agorot_status === 'unsafe_aggregate', '6e. total_amount_agorot_status reports unsafe_aggregate');
})();

// ── 11. Production functions imported, not copied ────────────────────────────
(function () {
  assert(typeof t190._t190BuildAccountBucketView === 'function'
      && typeof t190._t190AggregateOccurrencesIntoBuckets === 'function'
      && typeof t190._t190ParseAgorotExact === 'function'
      && typeof t190._t190KodRangeToBucket === 'function'
      && typeof t190._t190VerifyConservation === 'function',
    '11. every assertion above ran against functions required directly from t190_bucket_view.js');
})();

// ── 12. Existing behavior unchanged ───────────────────────────────────────────
// (a) Regression check on the refactored _parseT190BucketsFromXML: verified manually in the
//     browser console, per the implementation plan — app.js cannot be require()'d in Node
//     (its top-level code is a password/login gate touching document/sessionStorage/
//     crypto.subtle unconditionally, unrelated and out of scope to modify).
// (b) git diff scope check: run separately as `git diff` after this script passes.

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
