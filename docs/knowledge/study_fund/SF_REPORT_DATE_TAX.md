# Knowledge Object: Report-Date Tax Calculation

**Rule ID:** SF-REPORT-DATE-TAX
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-REPORT-DATE-TAX` — the canonical statement of how Goose estimates a Study Fund's tax liability as of the date of its most recent annual report (B.8 table), before any YTD update or future projection is applied.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** Given a set of B.8 tax-tier buckets (`SF-B8-TAX-RIGHTS`), the estimated tax owed on full withdrawal as of the report date is the sum, across all buckets, of each bucket's **real profit** multiplied by its **tax rate**. Principal is never taxed, in any bucket, at any rate. Buckets carrying a 0% rate contribute zero tax regardless of how large their profit is. Linkage's inclusion in this sum is a separate, narrower question — see `SF-LINKAGE-TREATMENT`.

**Human statement (Hebrew):** נכון לתאריך הדוח השנתי האחרון, ההערכה של Goose למס המשוער על משיכה מלאה היא סכימה, על כל שכבות המס (ב.8), של הרווח הריאלי בכל שכבה כפול שיעור המס של אותה שכבה. הקרן (הקרן המקורית שהופקדה) אינה ממוסה לעולם, באף שכבה. שכבות בשיעור 0% אינן מייצרות מס כלל, גם אם הרווח בהן גדול.

## 3. Evidence

- **Level A (Repository-verified)**: `app.js:20745-20756`, the `_hasExactTiers` branch of `_sfRecalculate` — `_pdfTierTaxK = (((taxableProfit15||0)*0.15) + ((taxableProfit20||0)*0.20) + ((taxableProfit25||0)*0.25)) / 1000` — sums profit × rate across the three taxable tiers only; the 0%-rate tier's profit never appears in this formula at all, matching the "0% buckets generate zero tax" claim exactly.
- **Level A (Repository-verified)**: `_sfCalculateTax` (`app.js:20344-20602`) is the XML-only fallback used when no PDF-derived tiers exist — it re-derives a coarser 2-segment (`tikrat:1` exempt / `tikrat:2` taxable) split from the raw XML and applies the same "principal never taxed, exempt segment never taxed" logic at a coarser granularity.
- **Level A (Independently inspected local report evidence, this session)**: real figures in `docs/knowledge/study_fund/EVIDENCE_INDEX.md` confirm the 0%-bucket and 25%-bucket structure this formula assumes is real, not hypothetical — see `SF-B8-TAX-RIGHTS`.

## 4. Model Assumptions

This object assumes the tax rate attached to each bucket in the report is the correct, applicable rate for a full withdrawal *as of the report date* — it does not model whether that rate could change between the report date and an actual future withdrawal date (that is `SF-FUTURE-PROJECTION`'s and `SF-TAX-SENSITIVITY-COEFFICIENT`'s concern), and it does not model whether reaching seniority/liquidity at the withdrawal date could alter the rate on the 25% bucket (see `SF-LIQUIDITY-TAX-SEPARATION` — this remains an open legal question, not resolved by this object).

**Model Assumptions are not Simulation Assumptions** — see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` §6.

## 5. Mathematical Model

```
reportDateTaxDue = Σ over taxable buckets (realProfit_bucket × rate_bucket)
                 = (taxableProfit15 × 0.15) + (taxableProfit20 × 0.20) + (taxableProfit25 × 0.25)

reportDateTaxDue does NOT include:
  - any bucket's principal, at any rate
  - any 0%-rate bucket's profit
  - (per SF-LINKAGE-TREATMENT) any taxable-tier bucket's linkage value
```

This is the single authoritative formula for report-date tax; every other document or view stating it must cite this section rather than restate it.

## 6. Implementation

- `app.js:20745-20756` — the `_pdfTierTaxK` formula (PDF-verified path).
- `app.js:20344-20602` — `_sfCalculateTax` (XML-only fallback path, coarser 2-segment version of the same principle).

## 7. Consuming Views

- **Reference**: `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md` §4 — cites this Rule ID for the tax-calculation core instead of restating it.
- **Reference**: `SF-TAX-MODEL` §3 (Composition) and §4 (Composed Model) — this object is the second stage of the composed model.

## 8. Validation

- `audit_rules.js` (repository-tracked, self-labeled "Codex tax rule assertions") asserts behavior of `_sfCalculateTax`'s nominal path against expected values — real, running, automated validation for the XML-only fallback path.
- No automated test exists specifically for the `_pdfTierTaxK` PDF-verified-path formula.

## 9. Explainability

The estimated tax on a full withdrawal, as of the fund's latest annual report, is simply the sum of each taxable bucket's profit multiplied by that bucket's own tax rate — the original deposited money is never taxed, and money that fell into a 0%-rate bucket contributes no tax no matter how much it has grown.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**High** for the formula itself (directly read from the live code, matches the B.8 bucket structure independently confirmed in `SF-B8-TAX-RIGHTS`). **Not yet assessed** for whether this is the legally complete picture at actual withdrawal — see `SF-LIQUIDITY-TAX-SEPARATION`.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Is the report-date bucket rate always the rate that would actually apply on a real withdrawal executed on the report date itself, or could a professional filing apply an adjustment not visible in the annual report?
