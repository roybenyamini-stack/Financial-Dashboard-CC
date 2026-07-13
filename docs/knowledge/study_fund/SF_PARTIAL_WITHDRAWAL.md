# Knowledge Object: Partial Withdrawal Proportionality

**Rule ID:** SF-PARTIAL-WITHDRAWAL
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-PARTIAL-WITHDRAWAL` — the canonical statement of how Goose estimates tax when a person withdraws only a percentage (or fixed amount) of a Study Fund, rather than the full balance.

**Granularity justification:** this is a single-line mathematical rule (one multiplication), smaller in formula complexity than the other atomic objects in this domain. It nonetheless warrants a standalone Knowledge Object rather than staying inline in `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md`'s component table, because its legal/operational correctness is independently unresolved and may change without changing the surrounding Tax Model — a future finding about the legally correct partial-withdrawal treatment (see Open Questions) would revise this object alone, not `SF-REPORT-DATE-TAX`, `SF-TAX-SENSITIVITY-COEFFICIENT`, or any other constituent of `SF-TAX-MODEL`.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** Goose applies the withdrawal percentage as a single multiplier to the *combined* estimated tax (report-date tax + YTD update + future projection), rather than applying it separately per bucket or per phase and re-summing. This assumes tax scales proportionally with the withdrawn fraction — i.e. withdrawing 30% of the fund incurs exactly 30% of the tax that a full withdrawal would.

**Human statement (Hebrew):** Goose מפעיל את אחוז המשיכה כמכפיל יחיד על סך המס המוערך (מס נכון לתאריך הדוח + עדכון YTD + תחזית עתידית), ולא בנפרד לכל שכבה או שלב. ההנחה היא שהמס גדל באופן פרופורציונלי לשיעור שנמשך.

## 3. Evidence

- **Level A (Repository-verified)**: `app.js:20832` — `taxDueK = max(0, (_pdfTierTaxK + _ytdTaxDueK + _simTaxDueK) × pctFraction)`. The percentage is applied exactly once, to the sum of all three components, not separately to each.

## 4. Model Assumptions

This is a simplification with an explicitly **unresolved legal basis**: proportional withdrawal treatment (each bucket's tax scaling linearly with the withdrawn fraction) is a reasonable default engineering assumption, but this object does not assert it is the legally mandated method for a partial Keren Hishtalmut withdrawal under Israeli tax law — no primary source for that specific rule was found or sought in this milestone.

**Model Assumptions are not Simulation Assumptions** — the withdrawal percentage/fixed-amount itself is a Simulation Assumption, recorded in `SF-TAX-MODEL` §8, not here; this object states only how that user-chosen figure is *applied* to the tax calculation, not what value it should be.

## 5. Mathematical Model

```
withdrawalTaxDue = (reportDateTaxDue + ytdTaxDue + simulatedFutureTaxDue) × withdrawalFraction
```

## 6. Implementation

- `app.js:20832` — the single `× pctFraction` multiplication, inside `_sfRecalculate`.

## 7. Consuming Views

- **Reference**: `SF-TAX-MODEL` §3–§4 — the sixth stage of the composed model, immediately before the final expected-tax/expected-net output.

## 8. Validation

- No automated test exists for this specific proportionality assumption.

## 9. Explainability

If you plan to withdraw only part of your Study Fund, Goose estimates the tax on that portion by taking the same fraction of the total estimated tax — for example, withdrawing a third of the fund is estimated to incur a third of the tax a full withdrawal would.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Medium** for the arithmetic being a reasonable, consistently-applied engineering default; **Low/Unknown** for whether this is the legally correct treatment — this must remain a **Working Hypothesis**, not promoted further, absent a primary legal source (per the explicit instruction to keep this status unless stronger evidence is found).

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Is proportional-by-fraction the legally correct way partial Keren Hishtalmut withdrawals are taxed in Israel, or does the law require withdrawing from specific buckets first (e.g. exempt before taxable, or oldest before newest)?
