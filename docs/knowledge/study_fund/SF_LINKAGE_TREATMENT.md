# Knowledge Object: Linkage (Indexation) Treatment

**Rule ID:** SF-LINKAGE-TREATMENT
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-LINKAGE-TREATMENT` — the canonical statement of how Goose's tier-aggregation logic treats "linkage" (הפרשי הצמדה, CPI/index adjustment) values reported in each B.8 bucket, and a specific asymmetry discovered in that treatment.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** Each B.8 bucket row reports a linkage value alongside principal and real profit. In the aggregation logic that converts a parsed report into the fields the tax engine consumes, linkage is treated **differently depending on the bucket's rate**: for a 0%-rate (exempt) bucket, linkage is added into the bucket's exempt-profit total; for a 15/20/25%-rate (taxable) bucket, linkage is included in the report's overall balance-reconciliation total but is **not** added into that bucket's taxable-profit total — it is effectively excluded from what gets taxed on taxable-tier buckets, even though it was captured from the report.

**Human statement (Hebrew):** כל שורת דלי ב-ב.8 מדווחת ערך "הפרשי הצמדה" לצד הקרן והרווח הריאלי. בלוגיקת האיגוד, ערך זה מטופל **אחרת בהתאם לשיעור המס של הדלי**: בדלי פטור (0%) הוא מתווסף לסך הרווח הפטור; בדלי חייב (15%/20%/25%) הוא נכלל בסך הכולל להתאמת יתרה, אך **אינו** מתווסף לסך הרווח החייב באותו דלי — כלומר הוא בפועל אינו ממוסה בדליים חייבים, למרות שנקלט מהדוח.

## 3. Evidence

- **Level A (Repository-verified, new finding this session, not previously logged anywhere in the repository)**: `server.js:213-224`, inside `_aggregateTierRows`:
  ```
  const lk = Number(row.linkage) || 0;
  allTierTotal += p + rp + lk;
  if (tr === 0)  { exemptPrincipal += p; exemptProfit += (rp + lk); }
  else             taxablePrincipal += p;
  if (tr === 15)   taxableProfit15  += rp;   // linkage (lk) not added here
  if (tr === 20)   taxableProfit20  += rp;   // linkage (lk) not added here
  if (tr === 25)   taxableProfit25  += rp;   // linkage (lk) not added here
  ```
  Confirmed by direct reading of the current code — this is the exact mechanism, not an inference.
- **Level A (Independently inspected local report evidence, this session)**: real linkage values in the redacted evidence (`docs/knowledge/study_fund/EVIDENCE_INDEX.md`) are non-trivial, growing amounts — this is not a rounding-error-scale edge case, it is a material, real exclusion.

## 4. Model Assumptions

None asserted — this object deliberately does not assume the current behavior is correct; it records what the code does, as a finding, with an explicitly open question about whether it should.

**Model Assumptions are not Simulation Assumptions** — not applicable to this object.

## 5. Mathematical Model

```
For a 0%-rate bucket:      exemptProfit  += (realProfit + linkage)
For a 15/20/25%-rate bucket: taxableProfitN += realProfit           [linkage excluded]
                              allTierTotal   += (principal + realProfit + linkage)   [balance check only]
```

This is a description of existing behavior, not a prescription — `SF-REPORT-DATE-TAX` §5 cites this section for what "real profit" means for taxable buckets (linkage-excluded), rather than restating it.

## 6. Implementation

- `server.js:213-224` — `_aggregateTierRows`, the exact lines shown above.

## 7. Consuming Views

- **Reference**: `SF-B8-TAX-RIGHTS` §2 — names this object rather than restating the linkage mechanism.
- **Reference**: `SF-REPORT-DATE-TAX` §5 — the "real profit" term in that object's formula is, for taxable buckets, exactly what this object defines (linkage-excluded).
- **Reference**: `SF-TAX-MODEL` §5 (Interaction & Edge Cases) — this asymmetry is exactly the kind of cross-object interaction finding that section exists to surface.

## 8. Validation

- No automated test exists checking whether this asymmetric treatment is intentional or an oversight; it was found by direct code reading this session, not by any existing test or audit.

## 9. Explainability

When a Study Fund's annual report shows an inflation/indexation adjustment on top of a bucket's real investment profit, Goose currently treats that adjustment differently depending on whether the bucket is tax-exempt or taxable: for exempt buckets it's folded in as more (untaxed) profit, but for taxable buckets it is tracked for balance-reconciliation purposes only and is not currently counted as taxable profit.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**High** that this is what the code currently does (directly verified, unambiguous). **Unknown** whether this is the legally/actuarially correct treatment, or an unintentional gap — this is a genuinely new question this milestone surfaces, not one with an existing answer to cite.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

This asymmetry has two sides, and neither is assumed correct by this object — only its taxable-tier side was flagged in earlier drafts; both are open:

1. Is excluding linkage from taxable-tier taxable profit correct?
2. Is including linkage within the exempt-tier amount correct?
3. Is the asymmetry between the two sides intentional and legally supported (e.g. a real distinction in how CPI-linkage is taxed on exempt vs. taxable capital under Israeli rules), or is it merely an implementation convention that happened to treat the two sides differently without a deliberate legal basis?
4. If either side is a genuine gap, does correcting it materially change the displayed tax figure for funds with large linkage values (as seen in the real evidence inspected this session)?
