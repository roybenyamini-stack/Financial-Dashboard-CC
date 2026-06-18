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
var _effectiveTaxCoeff = _pdfBalK > 0 ? (_pdfTierTaxK / _pdfBalK) : (_taxableRatio * 0.25);
```

It is **never** a hardcoded constant, a localStorage value, or a field on `_pdfData`. Storing or caching it would violate Rule 1, because the effective rate changes whenever the PDF data changes.

This coefficient is applied identically to YTD accrual and to future simulation, ensuring the tax projection from the slider uses the same blended rate as the current-year calculation. See `docs/TaxLogic.md` § 5.1a and `israel_tax_rules.md` § "Phase 2" for the full formula.

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
