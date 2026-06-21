# Architecture Rules — Financial Dashboard

## Rule 1: Absolute Ban on Hard-Coding

No numbers, dates, fund IDs, provider names, or policy numbers may appear as literal constants inside calculation logic.

**Forbidden:**
```javascript
var cutoff = new Date('2026-01-01');   // ❌ hard-coded year
if (assetNum === '912-443286') { ... } // ❌ hard-coded fund ID
var taxRate = 0.25;                    // ❌ hard-coded rate not from PDF/config
```

**Required:**
```javascript
var cutoff = new Date(new Date().getFullYear() + '-01-01'); // ✅ dynamic
// ✅ all logic works on item.assetNum from the data layer — no specific value checks
var taxRate = _pdfData.effectiveTaxRate || defaultRate;    // ✅ from PDF data
```

---

## Rule 2: All Logic Must Be Dynamic and Data-Driven

Every calculation must derive its inputs exclusively from:
- Real-time data: `item.balance`, `item.joinDate`, `item.rawXml`
- PDF-extracted data: `_pdfData.pdfTotalBalance`, `_pdfData.taxableProfit15/20/25`, `_pdfData.reportYear`
- User inputs: sliders, manual deposit entries
- System date: `new Date()` — never a literal year

Tax rates, thresholds, cutoff dates, and balance comparisons must all flow from these dynamic sources. If a value cannot be derived from live data, it does not belong in the calculation engine.

### Rule 2a: The Effective Tax Coefficient Is Computed, Never Stored

The `effectiveTaxCoeff` is derived at runtime inside `_sfRecalculate()`:

```javascript
// ✅ Correct — always recomputed from live PDF data
var _effectiveTaxCoeff = (_pdfData.marginalTaxRate > 0)
  ? (_pdfData.marginalTaxRate * _taxableRatio)
  : (_taxableRatio * 0.25);
```

`_pdfData.marginalTaxRate` = weighted average CGT rate on taxable-tier profits, returned by the server parser (`calculateMarginalTaxRate(rows)`). `_taxableRatio` = fraction of total balance held in taxable tiers = `1 − (exemptPrincipal + exemptProfit) / pdfTotalBalance`. The fallback `_taxableRatio * 0.25` applies only when the parser did not return `marginalTaxRate` (i.e., no PDF uploaded).

It is **never** a hardcoded constant, a localStorage value, or a field on `_pdfData`. Storing or caching it would violate Rule 1, because the effective rate changes whenever the PDF data changes.

This coefficient is applied identically to YTD accrual and to future simulation. See `docs/TaxLogic.md` § 5.1a and `israel_tax_rules.md` § "Phase 2" for the full formula.

---

### Rule 2b: `isPreReformExempt` Is Sourced from the PDF Parser, Never from `joinDate`

The `isPreReformExempt` flag must be read from `_pdfData.isPreReformExempt` — set by the server-side PDF parsers — and **never** derived by comparing `item.joinDate` to a cutoff year.

**Why:** `joinDate` is often absent from the DB for Meitav-format funds. The parsers have direct access to the B.8 table text and make a content-based determination:
- `parseMeitav`: sets `isPreReformExempt: true` when `PRE2003_RE` fires (row text contains `"יתרה בגין הפקדות"`). Ceiling-exempt rows (matched by `NUM4_RE + 0%`) do not trigger the flag.
- `parseAltshuler`: AI tier-extraction prompt instructs the model to set `isPreReformExempt: true` only on an explicitly labeled pre-31.12.2002 row.

The label in `_sfBuildTierReceipt` must use:

```javascript
// ✅ Correct — data-driven from PDF parser
var _exemptLabel = pdfData.isPreReformExempt
  ? 'פטור (הפקדות לפני 2002)'
  : 'פטור ממס (הפקדות עד התקרה)';
```

---

## Rule 3: Alert on Violations

If any future instruction or code change would introduce:
- A literal year (e.g. `2026`, `2027`) inside calculation or filtering logic
- A specific fund name, policy number, or provider name inside an `if/else` condition
- A tax rate or threshold that is not read from `_pdfData`, a config object, or a slider

...the AI assistant **must immediately alert the user** before proceeding:

> "⚠️ Architecture violation: this change introduces hard-coded [value] which breaks Rule [1/2]. The correct approach is [dynamic alternative]. Should I proceed with the generic implementation instead?"

---

## Scope

These rules apply to:
- `_sfRecalculate()` and all functions it calls
- `_sfCalculateTax()`, `_sfPdfToSegments()`, `_sfBuildTierReceipt()`
- Any deposit filtering, YTD accrual, or tax tier logic

These rules do **not** apply to:
- `FUNDS_DATA` — historical portfolio display data (read-only, not used in tax math)
- Simulator constants (`SIM_START_YEAR`, birth years) — separate personal finance module
- UI display strings that reference the current year via `_currentYear` variable (dynamic, allowed)

---

## Recent Financial Physics Fixes (2026-06)

### Fix 1 — v182.60 Balance-Zeroing Bug Removed

A block of code was zeroing `exemptPrincipal` and `exemptProfit` for all accounts with `joinYear >= 2003`, which forced `taxableRatio = 100%` and caused the effective tax coefficient to be severely overstated for post-2003 funds with ceiling-exempt tiers.

**Fix:** Removed the two zeroing lines. The `isPreReformExempt` flag is still set to `false` for these accounts (correct), but the exempt tier data from the PDF is now preserved.

### Fix 2 — `effectiveTaxCoeff` Now Uses `marginalTaxRate × taxableRatio`

The old fallback `taxableRatio × 0.25` was inadvertently being used as the primary formula for all funds, applying a flat 25% to the entire taxable balance and ignoring that many funds have significant 15%/20% bracket profits. The fix uses `marginalTaxRate` (the actual PDF-derived weighted rate on taxable profits) multiplied by `taxableRatio`, preventing systematic overstatement of YTD tax for mixed-tier funds.

### Fix 3 — `isPreReformExempt` Label Now Data-Driven

The exempt-tier label in `_sfBuildTierReceipt` previously computed `joinYear` from `item.joinDate` and compared to 2003 — unreliable when `joinDate` is absent. The label now reads `pdfData.isPreReformExempt` exclusively (set by the parser on upload). `joinYear` has been removed from the `ytdData` pass-through entirely. See Rule 2b above.
