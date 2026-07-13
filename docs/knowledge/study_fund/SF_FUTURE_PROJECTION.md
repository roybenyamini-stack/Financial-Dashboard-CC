# Knowledge Object: Future Projection

**Rule ID:** SF-FUTURE-PROJECTION
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-FUTURE-PROJECTION` — the canonical statement of how Goose projects a Study Fund's value forward from today to a selected future withdrawal date, and translates that projected growth into estimated tax.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** Given a selected time horizon, Goose compounds the fund's current balance forward in two phases: an investment-return phase up to the person's retirement age, and a (possibly different) post-retirement return phase for any remaining years — then deducts a linear inflation adjustment over the full horizon to arrive at projected real profit. That projected real profit is taxed using the same blended coefficient as the YTD update (`SF-TAX-SENSITIVITY-COEFFICIENT`), not a separately re-derived one.

**Human statement (Hebrew):** בהינתן טווח זמן נבחר, Goose מגדיל את יתרת הקרן הנוכחית בשני שלבים: תשואת השקעה עד לגיל הפרישה, ותשואה (שיכולה להיות שונה) לאחר הפרישה עבור שאר השנים — ולאחר מכן מנכה התאמת אינפלציה ליניארית על פני כל הטווח, כדי להגיע לרווח ריאלי חזוי. הרווח החזוי הזה ממוסה באמצעות אותו מקדם מס מעורב כמו בעדכון ה-YTD.

## 3. Evidence

- **Level A (Repository-verified)**: `app.js:20818-20831` — `_phase1Years = min(years, yearsToRetire)`, `_phase2Years = years - _phase1Years`; `_simPhase1K = baseK × (1+invReturn/100)^_phase1Years`; `_simFutureNomK = _simPhase1K × (1+penReturn/100)^_phase2Years`; `_simInflDeductK = baseK × (inflation/100) × years` (linear, not compounded); `_simRealProfitK = _simFutureNomK - baseK - _simInflDeductK`; `_simTaxDueK = _simRealProfitK × _effectiveTaxCoeff`.
- **Level B**: `israel_tax_rules.md` states the same nominal-profit, non-compounded-inflation-deduction convention used project-wide for CGT calculations (v181.76 per that document), consistent with this formula.

## 4. Model Assumptions

The inflation deduction is **linear** (`baseK × inflationRate × years`), not compound — a deliberate simplification already documented project-wide (`israel_tax_rules.md`, item 2: real CGT is deferred pending a historical CPI API; the inflation slider currently only affects forward projections, not historical real-profit calculation). The retirement-age split assumes a single, fixed retirement age and a clean two-phase return structure — it does not model a phased/partial retirement or a mid-horizon return-rate change for any other reason.

**Model Assumptions are not Simulation Assumptions.** The investment-return rate, pension-return rate, inflation rate, and time horizon used in this formula are themselves Simulation Assumptions — user-adjustable slider inputs — recorded once in `SF-TAX-MODEL` §8, not restated here.

## 5. Mathematical Model

```
yearsToRetire  = max(0, retirementAge - currentAge)     [if birth date known, else = full horizon]
phase1Years    = max(0, min(horizonYears, yearsToRetire))
phase2Years    = max(0, horizonYears - phase1Years)

projectedNominalK = baseK × (1 + investReturnPct/100)^phase1Years
                          × (1 + pensionReturnPct/100)^phase2Years

inflationDeductK  = baseK × (inflationPct/100) × horizonYears     [linear, not compounded]

projectedRealProfitK = projectedNominalK - baseK - inflationDeductK
simTaxDueK           = projectedRealProfitK × effectiveTaxCoeff    [from SF-TAX-SENSITIVITY-COEFFICIENT]
```

## 6. Implementation

- `app.js:20818-20831` — the 2-phase projection and simulated-tax formula, inside `_sfRecalculate`.

## 7. Consuming Views

- **Reference**: `SF-TAX-MODEL` §3–§4, §8 (Simulation Assumptions) — this object is the fifth stage of the composed model; its user-adjustable inputs are documented once at the Model level.

## 8. Validation

- No automated test exists for the 2-phase projection formula.

## 9. Explainability

To show what a Study Fund might be worth at a future date you choose, Goose grows the current balance using an assumed investment return up to your retirement age and a (possibly different) assumed return afterward, then subtracts a simple estimate for inflation over the whole period. The resulting projected growth is taxed using the same blended approach used for growth that has already happened since your last report.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**High** for the formula matching the live code exactly; **Medium** for whether the linear (non-compounded) inflation treatment is the right long-run approximation for long horizons, an open question already logged project-wide, not newly discovered here.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Is the linear inflation-deduction approximation acceptable for long projection horizons (e.g. 20+ years), or does it need to move to a compounded treatment before this object can be rated higher confidence for long-horizon projections specifically?
