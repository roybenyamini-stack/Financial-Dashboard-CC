// ── Roy Reality retirement-bucket division (t190_bucket_view.js) ──────────────
// Pure, DOM-free production logic. No DOMParser, no XML lookup, no document access.
// Classifies real PerutYitraLeTkufa occurrences (already extracted as plain objects by the
// app.js XML adapter) into the current-implementation retirement buckets
// (capital_exempt / qualifying_annuity / recognized_annuity / unresolved), with exact
// integer-agorot arithmetic and full source lineage.
//
// Scope boundaries (see docs discussion / implementation plan):
//   - This is a CURRENT classification-and-totaling picture only.
//   - No withdrawal eligibility, realization alternatives, pension conversion, or tax of any
//     kind is calculated here. Tax is explicitly deferred to a later What If stage.
//   - The KOD-TECHULAT-SHICHVA range mapping below is VERIFIED current Goose implementation
//     behavior. Its statutory/domain meaning is NOT verified.
//   - amount_agorot is the sole authoritative monetary value. display_amount_k is a derived,
//     display-only whole integer (thousands of shekels) and must never be used for
//     aggregation, conservation, or later What If / tax calculations.

// ── Exact money parsing ─────────────────────────────────────────────────────

// Parses a decimal shekel string into an exact integer count of agorot.
// Sign is parsed from its own capture group, never inferred from the whole-number magnitude
// (parseInt('-0') === 0, which would silently lose the sign of e.g. "-0.50").
// JS Number arithmetic is exact only within Number.isSafeInteger's range — every intermediate
// and the final result is validated; an unsafe result returns null rather than a silently
// imprecise Number.
// Returns null (never a guess, never an unsafe value) if the string cannot be parsed safely.
function _t190ParseAgorotExact(rawAmountString) {
  if (rawAmountString == null) return null;
  var s = String(rawAmountString).trim();
  var m = /^(-)?(\d+)(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;
  var isNegative = !!m[1];
  var whole = parseInt(m[2], 10);
  if (!Number.isSafeInteger(whole)) return null;
  var wholeAgorot = whole * 100;
  if (!Number.isSafeInteger(wholeAgorot)) return null;
  var frac = parseInt((m[3] || '').padEnd(2, '0'), 10);
  var magnitude = wholeAgorot + frac;
  if (!Number.isSafeInteger(magnitude)) return null;
  var result = isNegative ? -magnitude : magnitude;
  if (!Number.isSafeInteger(result)) return null;
  return result;
}

// Format-only check (same regex, no magnitude validation) — lets the classifier distinguish
// "malformed string" from "well-formed string whose magnitude is unsafe" without duplicating
// the regex or re-deriving the magnitude.
function _t190IsAmountFormatValid(rawAmountString) {
  if (rawAmountString == null) return false;
  return /^(-)?(\d+)(?:\.(\d{1,2}))?$/.test(String(rawAmountString).trim());
}

// ── Safe aggregation ─────────────────────────────────────────────────────────
// Number.isSafeInteger validates a single parsed amount, but summing several individually-
// safe amounts can still produce a total outside the safe-integer range (e.g. two values just
// under Number.MAX_SAFE_INTEGER). Every place this module adds amount_agorot values together
// — a bucket's running total, the account's total_amount_agorot, and the independent resum in
// _t190VerifyConservation — goes through these two helpers so an unsafe aggregate is always
// reported explicitly (as null + a status), never silently returned as an imprecise Number.

// Adds two agorot values. Returns null if either input is null or the sum would exceed
// Number.isSafeInteger's range.
function _t190SafeAddAgorot(a, b) {
  if (a === null || b === null) return null;
  var sum = a + b;
  return Number.isSafeInteger(sum) ? sum : null;
}

// Sums an array of agorot values via repeated _t190SafeAddAgorot. Returns 0 for an empty
// array (matches the "no contributing occurrences" case), or null as soon as any value is
// null or any partial sum becomes unsafe — never partially-correct, never imprecise.
function _t190SafeSumAgorot(amounts) {
  var sum = 0;
  for (var i = 0; i < amounts.length; i++) {
    sum = _t190SafeAddAgorot(sum, amounts[i]);
    if (sum === null) return null;
  }
  return sum;
}

// ── TIKRAT-HAFKADA-MUTEVET normalization (lineage only — not used for classification) ──

// Takes the minimal 3-fact descriptor the app.js adapter extracts from the DOM element
// ({present, nil, text}) and returns a tagged, disjoint shape so NIL/absent/malformed/value
// can never be confused with one another.
function _t190NormalizeTikrat(rawDescriptor) {
  if (!rawDescriptor || !rawDescriptor.present) return { kind: 'absent', raw: null };
  if (rawDescriptor.nil) return { kind: 'nil', raw: null };
  var text = rawDescriptor.text;
  if (text != null && String(text).trim().toUpperCase() === 'NIL') return { kind: 'nil', raw: null };
  if (text == null || String(text).trim() === '') return { kind: 'malformed', raw: text == null ? null : text };
  return { kind: 'value', raw: String(text).trim() };
}

// ── KOD-TECHULAT-SHICHVA classification — single source of truth ───────────

// VERIFIED as current Goose implementation behavior (unchanged range logic, re-read from
// app.js:18598-18629 this session). Statutory/domain meaning is NOT verified.
function _t190KodRangeToBucket(kod) {
  if (kod >= 1 && kod <= 4)  return 'capital_exempt';
  if (kod >= 5 && kod <= 8)  return 'qualifying_annuity';
  if (kod >= 9 && kod <= 10) return 'recognized_annuity';
  return null;
}

// Classifies one already-enriched occurrence ({..., amount_agorot}) into a bucket name or
// 'unresolved' with a specific, distinguishing reason. Never silently drops an occurrence.
function _t190ClassifyOccurrenceBucket(occurrence) {
  var kodRaw = occurrence.kod_techulat_shichva;
  if (kodRaw == null) return { bucket: 'unresolved', reason: 'kod_absent' };
  var kodStr = String(kodRaw).trim();
  if (!/^\d+$/.test(kodStr)) return { bucket: 'unresolved', reason: 'kod_malformed' };
  var kod = parseInt(kodStr, 10);
  var bucket = _t190KodRangeToBucket(kod);
  if (!bucket) return { bucket: 'unresolved', reason: 'kod_out_of_known_range:' + kod };
  if (occurrence.amount_agorot === null) {
    var reason = _t190IsAmountFormatValid(occurrence.amount_raw)
      ? 'amount_out_of_safe_integer_range'
      : 'amount_unparseable';
    return { bucket: 'unresolved', reason: reason };
  }
  return { bucket: bucket, reason: null };
}

// ── Display derivation ──────────────────────────────────────────────────────

// Derived, display-only. Never authoritative, never fed back into aggregation, conservation,
// or later What If / tax calculations — amount_agorot is always the source for those.
// Sign-preserving nearest-integer rounding avoids JavaScript's asymmetric Math.round behavior
// on negative halves (Math.round(-0.5) === -0 in JS, not -1). A small negative amount that
// rounds to zero (e.g. -1 or -49999 agorot) must never surface as JS's -0 — normalized to
// ordinary 0 before returning.
function _t190DeriveDisplayAmountK(amountAgorot) {
  var exactK  = amountAgorot / 100000;
  var rounded = exactK < 0 ? -Math.round(Math.abs(exactK)) : Math.round(exactK);
  return rounded === 0 ? 0 : rounded; // normalizes -0 to ordinary 0
}

// ── Bucket aggregation ───────────────────────────────────────────────────────

// display_amount_k is intentionally absent here — the finalization loop in
// _t190AggregateOccurrencesIntoBuckets always assigns it (null or _t190DeriveDisplayAmountK(sum))
// before this object is ever returned to a caller, so a placeholder initial value here would be
// dead code.
function _t190EmptyKnownBucket() {
  return {
    amount_agorot: 0,
    amount_agorot_status: 'ok',
    source_occurrences: [],
    observed_rekiv_values: [],
    evidence_status: {
      classification_basis: 'kod_range_current_goose_behavior_v1',
      statutory_meaning_verified: false
    }
  };
}

function _t190EmptyUnresolvedBucket() {
  return {
    amount_agorot: 0,
    amount_agorot_status: 'ok',
    source_occurrences: [],
    observed_rekiv_values: [],
    unresolved_reasons: []
  };
}

// Core pure transform. Each raw occurrence is classified INDEPENDENTLY, using only
// KOD-TECHULAT-SHICHVA (exactly as the existing routing already does — REKIV plays no role
// in bucket membership). Occurrences whose independent classification lands on the same
// bucket are summed into that bucket's total. This is not a claim that the contributing
// occurrences form one canonical Money Layer, and not a claim of REKIV equivalence for any
// other Event — REKIV, SUG, KOD, TIKRAT, and the exact amount remain fully visible per
// occurrence in every bucket's lineage.
function _t190AggregateOccurrencesIntoBuckets(rawOccurrences) {
  var buckets = {
    capital_exempt:     _t190EmptyKnownBucket(),
    qualifying_annuity: _t190EmptyKnownBucket(),
    recognized_annuity: _t190EmptyKnownBucket(),
    unresolved:          _t190EmptyUnresolvedBucket()
  };

  (rawOccurrences || []).forEach(function(raw) {
    var tikrat = _t190NormalizeTikrat(raw.tikrat_raw);
    var amountRaw = raw.amount_raw != null ? raw.amount_raw : null;
    var amountAgorot = amountRaw != null ? _t190ParseAgorotExact(amountRaw) : null;

    var enriched = {
      rekiv_itra_letkufa:   raw.rekiv_itra_letkufa   != null ? raw.rekiv_itra_letkufa   : null,
      sug_itra_letkufa:     raw.sug_itra_letkufa     != null ? raw.sug_itra_letkufa     : null,
      kod_techulat_shichva: raw.kod_techulat_shichva != null ? raw.kod_techulat_shichva : null,
      tikrat_hafkada_mutevet: tikrat,
      amount_raw: amountRaw,
      amount_agorot: amountAgorot
    };

    var cls   = _t190ClassifyOccurrenceBucket(enriched);
    var entry = buckets[cls.bucket];

    if (cls.bucket === 'unresolved') {
      enriched.unresolved_reason = cls.reason;
      if (entry.unresolved_reasons.indexOf(cls.reason) === -1) entry.unresolved_reasons.push(cls.reason);
    }
    entry.source_occurrences.push(enriched);
    if (enriched.rekiv_itra_letkufa != null && entry.observed_rekiv_values.indexOf(enriched.rekiv_itra_letkufa) === -1) {
      entry.observed_rekiv_values.push(enriched.rekiv_itra_letkufa);
    }
  });

  // Sums are computed once here, from the preserved source_occurrences, via the safe-sum
  // helper — never via incremental += during the loop above. An occurrence's own amount is
  // only ever individually safe (already validated by _t190ParseAgorotExact); the sum across
  // several such occurrences is separately validated here, so a bucket whose contributing
  // amounts are each fine but whose total is not gets an explicit 'unsafe_aggregate' status
  // and a null amount_agorot — its source_occurrences are preserved either way, never dropped.
  Object.keys(buckets).forEach(function(key) {
    var b = buckets[key];
    b.observed_rekiv_values.sort();
    var contributingAmounts = b.source_occurrences
      .filter(function(o) { return o.amount_agorot !== null; })
      .map(function(o) { return o.amount_agorot; });
    var sum = _t190SafeSumAgorot(contributingAmounts);
    if (sum === null) {
      b.amount_agorot = null;
      b.amount_agorot_status = 'unsafe_aggregate';
      b.display_amount_k = null;
    } else {
      b.amount_agorot = sum;
      b.amount_agorot_status = 'ok';
      b.display_amount_k = _t190DeriveDisplayAmountK(sum);
    }
  });

  return buckets;
}

// ── Account-level view ───────────────────────────────────────────────────────

function _t190BuildAccountBucketView(rawOccurrences, accountIdentity, accountIdentitySource) {
  var buckets = _t190AggregateOccurrencesIntoBuckets(rawOccurrences);
  // Each bucket's own amount_agorot is already either a validated-safe sum or null (with its
  // own amount_agorot_status). Summing the four bucket totals is itself an aggregation that
  // must go through the same safe-sum path — four individually-safe bucket totals can still
  // add up to an unsafe total_amount_agorot, and any bucket already null must not be silently
  // treated as 0 by ordinary '+' (null + number coerces to number in JS).
  var totalAgorot = _t190SafeSumAgorot([
    buckets.capital_exempt.amount_agorot,
    buckets.qualifying_annuity.amount_agorot,
    buckets.recognized_annuity.amount_agorot,
    buckets.unresolved.amount_agorot
  ]);
  return {
    account_identity: accountIdentity,
    account_identity_source: accountIdentitySource,
    buckets: buckets,
    total_amount_agorot: totalAgorot,
    total_amount_agorot_status: totalAgorot === null ? 'unsafe_aggregate' : 'ok',
    total_display_amount_k: totalAgorot === null ? null : _t190DeriveDisplayAmountK(totalAgorot)
  };
}

// ── Conservation check ───────────────────────────────────────────────────────

// Independently re-derives the expected total (sum of every successfully-parsed raw amount)
// from rawOccurrences, via the same safe-sum path, and compares it to the view's own
// (already safely-computed) total_amount_agorot. Excludes occurrences whose amount could not
// be parsed at all — an unknown value cannot participate in a numeric equality (Product
// Decision B). If either side is unsafe, equality cannot be verified — that is reported
// explicitly via `status`, never collapsed into a possibly-wrong true/false by chance.
function _t190VerifyConservation(rawOccurrences, view) {
  var parsedAmounts = [];
  (rawOccurrences || []).forEach(function(raw) {
    if (raw.amount_raw != null) {
      var parsed = _t190ParseAgorotExact(raw.amount_raw);
      if (parsed !== null) parsedAmounts.push(parsed);
    }
  });
  var expectedTotal = _t190SafeSumAgorot(parsedAmounts);
  var actualTotal   = view.total_amount_agorot;
  var status = (expectedTotal === null || actualTotal === null)
    ? 'unsafe_aggregate'
    : (expectedTotal === actualTotal ? 'ok' : 'mismatch');
  return {
    conserved: status === 'ok',
    status: status,
    expectedTotal: expectedTotal,
    actualTotal: actualTotal
  };
}

// ── Balance provenance reconciliation (PF_ROY_REALITY_V1, first commit) ─────────────────────
// This section never rescales, redistributes, or reshapes classification data — it only
// compares an already-computed evidence total against item.balance's own provenance-dated
// value, and reports the arithmetic relationship honestly, including when it cannot be
// established at all. It explicitly does NOT claim that the PerutYitraLeTkufa occurrence set
// covers item.balance's full monetary scope — that equivalence is unproven in this repository
// (item.balance is sourced from a different, fund-level summary field), so no branch below
// uses language implying money was added, removed, or moved. See the implementation plan for
// the full rationale.

// Converts item.balance (K₪, a float) into an exact integer count of agorot, with the same
// "return null rather than a guess" discipline as _t190ParseAgorotExact. Every intermediate is
// validated via Number.isSafeInteger so a non-finite or absurdly large balance never silently
// produces a wrong number.
function _t190BalanceKToAgorotExact(balanceK) {
  if (balanceK == null || typeof balanceK !== 'number' || !isFinite(balanceK)) return null;
  var agorot = Math.round(balanceK * 1000 * 100);
  return Number.isSafeInteger(agorot) ? agorot : null;
}

// Deterministic, timezone-free, calendar-aware YYYY-MM-DD validator. Rejects nonexistent
// calendar dates (e.g. 2026-02-31, 2026-04-31) via direct Gregorian day-count arithmetic —
// never via `new Date(...)`, which would silently roll an invalid date into the next month
// instead of rejecting it.
function _t190IsValidYmd(s) {
  if (typeof s !== 'string') return false;
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  var year = parseInt(m[1], 10), month = parseInt(m[2], 10), day = parseInt(m[3], 10);
  if (month < 1 || month > 12 || day < 1) return false;
  var isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  var daysInMonth = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= daysInMonth[month - 1];
}

// Reconciles a classification view's evidence total against item.balance's provenance-dated
// value. Returns { totals, reconciliation } — see the implementation plan §4 for the exact
// shape and §5/§6 for the exact state/reason vocabulary and decision order. Pure: no DOM, no
// wall-clock reads, no mutation of `view`.
function _t190ReconcileEvidenceWithBalance(view, conservationResult, balanceAgorot, balanceAsOf, evidenceAsOf) {
  var buckets = view.buckets;
  var classifiedTotalAgorot = _t190SafeSumAgorot([
    buckets.capital_exempt.amount_agorot,
    buckets.qualifying_annuity.amount_agorot,
    buckets.recognized_annuity.amount_agorot
  ]);
  var evidenceUnresolvedTotalAgorot = buckets.unresolved.amount_agorot;
  var evidenceTotalAgorot = view.total_amount_agorot; // already = all 4 buckets summed safely

  var totals = {
    classified_total_agorot: classifiedTotalAgorot,
    evidence_unresolved_total_agorot: evidenceUnresolvedTotalAgorot,
    evidence_total_agorot: evidenceTotalAgorot
  };

  var occurrenceCount = buckets.capital_exempt.source_occurrences.length
    + buckets.qualifying_annuity.source_occurrences.length
    + buckets.recognized_annuity.source_occurrences.length
    + buckets.unresolved.source_occurrences.length;

  function unresolvedResult(state, reason) {
    return {
      totals: totals,
      reconciliation: {
        state: state,
        reason: reason,
        temporal_relation: null,
        balance_evidence_gap_agorot: null,
        gap_status: null,
        scope_relation: null,
        evidence_as_of: evidenceAsOf != null ? evidenceAsOf : null,
        balance_as_of: balanceAsOf != null ? balanceAsOf : null
      }
    };
  }

  if (occurrenceCount === 0) return unresolvedResult('no_evidence', 'no_occurrences');

  if (!conservationResult || conservationResult.status !== 'ok') {
    var conservationReason = (conservationResult && conservationResult.status === 'unsafe_aggregate')
      ? 'conservation_unsafe_aggregate'
      : 'conservation_mismatch';
    return unresolvedResult('conservation_failure', conservationReason);
  }

  if (balanceAgorot === null || balanceAgorot === undefined) {
    return unresolvedResult('unreconciled', 'unsafe_balance_value');
  }
  if (balanceAsOf == null) return unresolvedResult('unreconciled', 'missing_balance_date');
  if (evidenceAsOf == null) return unresolvedResult('unreconciled', 'missing_evidence_date');
  if (!_t190IsValidYmd(balanceAsOf)) return unresolvedResult('unreconciled', 'malformed_balance_date');
  if (!_t190IsValidYmd(evidenceAsOf)) return unresolvedResult('unreconciled', 'malformed_evidence_date');
  if (balanceAsOf < evidenceAsOf) return unresolvedResult('unreconciled', 'balance_predates_evidence');
  if (!(balanceAsOf === evidenceAsOf || balanceAsOf > evidenceAsOf)) {
    // Defensive fallback — unreachable given the checks above, kept so a future date source
    // can never silently fall through into an unproven comparison.
    return unresolvedResult('unreconciled', 'unsupported_temporal_relationship');
  }
  if (evidenceTotalAgorot === null) {
    // Conservation reported 'ok' but the view's own total is unsafe — should not occur given
    // conservation's own contract, but never trusted blindly here either.
    return unresolvedResult('conservation_failure', 'conservation_unsafe_aggregate');
  }

  // Subtraction goes through the module's own safe-arithmetic path, not raw '-'. Two
  // individually safe integers can still produce a difference outside Number.isSafeInteger's
  // range; _t190SafeAddAgorot (via negation) reports that explicitly as null rather than
  // silently returning an imprecise Number. Negating a safe integer is always itself safe
  // (the safe-integer range is symmetric), so only the addition needs checking.
  var gap = _t190SafeAddAgorot(balanceAgorot, -evidenceTotalAgorot);
  if (gap === null) return unresolvedResult('unreconciled', 'unsafe_gap_arithmetic');

  var gapStatus = gap === 0
    ? 'exact_match'
    : (gap > 0 ? 'balance_above_evidence_total' : 'balance_below_evidence_total');

  return {
    totals: totals,
    reconciliation: {
      state: 'arithmetic_gap_available',
      reason: null,
      temporal_relation: (balanceAsOf === evidenceAsOf) ? 'same_date' : 'balance_later',
      balance_evidence_gap_agorot: gap,
      gap_status: gapStatus,
      // Fixed 'unproven' in this commit — no repository or domain evidence yet establishes
      // that PerutYitraLeTkufa occurrences cover item.balance's full monetary scope. See plan §8.
      scope_relation: 'unproven',
      evidence_as_of: evidenceAsOf,
      balance_as_of: balanceAsOf
    }
  };
}

// ── Dual-environment export (no-op in the browser; index.html never defines `module`) ──
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    _t190ParseAgorotExact: _t190ParseAgorotExact,
    _t190IsAmountFormatValid: _t190IsAmountFormatValid,
    _t190SafeAddAgorot: _t190SafeAddAgorot,
    _t190SafeSumAgorot: _t190SafeSumAgorot,
    _t190NormalizeTikrat: _t190NormalizeTikrat,
    _t190KodRangeToBucket: _t190KodRangeToBucket,
    _t190ClassifyOccurrenceBucket: _t190ClassifyOccurrenceBucket,
    _t190DeriveDisplayAmountK: _t190DeriveDisplayAmountK,
    _t190AggregateOccurrencesIntoBuckets: _t190AggregateOccurrencesIntoBuckets,
    _t190BuildAccountBucketView: _t190BuildAccountBucketView,
    _t190VerifyConservation: _t190VerifyConservation,
    _t190BalanceKToAgorotExact: _t190BalanceKToAgorotExact,
    _t190IsValidYmd: _t190IsValidYmd,
    _t190ReconcileEvidenceWithBalance: _t190ReconcileEvidenceWithBalance
  };
}
