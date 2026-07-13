# Knowledge Object: B.8 Tax Rights (Study Fund Tax-Tier Buckets)

**Rule ID:** SF-B8-TAX-RIGHTS
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-B8-TAX-RIGHTS` — the canonical statement of what a Study Fund annual report's "B.8" reform table represents, how its tax-tier buckets are structured, and what evidence exists for their persistence over time and across a provider transfer.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** Every Israeli Keren Hishtalmut annual report contains a section titled "ב.8. פירוט סכומים בהתאם לרפורמה במיסוי רווחי הון בקרן השתלמות" (Section B.8: details of amounts per the capital-gains-tax reform in the Study Fund). This section partitions the fund's balance into up to seven buckets, one per combination of deposit-era (pre-31/12/2002, 1/1/2003–31/12/2005, 1/1/2006–31/12/2011, 1/1/2012+) and ceiling-position (up to / above the "preferential deposit ceiling," תקרת ההפקדה המוטבת) for the eras that have both. Each non-empty bucket carries a fixed **tax rate** (0%, 15%, 20%, or 25%) and reports **principal**, **linkage** (הפרשי הצמדה, CPI/index adjustment), and **real profit** (רווחים ריאליים) for that bucket. The bucket a deposit belongs to is fixed by **when the deposit was made and its era-ceiling position** — the table itself carries no age, seniority, or years-held field.

**Human statement (Hebrew):** כל דוח שנתי של קרן השתלמות מכיל סעיף (ב.8) שמפרק את יתרת הקרן ל"שכבות מס" — כל שכבה משויכת לתקופת הפקדה מסוימת (למשל: החל מ-1.1.2012) ולמעמד ביחס ל"תקרת ההפקדה המוטבת" (עד לתקרה / מעל לתקרה), ולכל שכבה כזו שיעור מס קבוע (0%, 15%, 20% או 25%). השכבה של כל הפקדה נקבעת לפי **מועד ההפקדה** בלבד — הטבלה עצמה אינה מכילה שדה של גיל או ותק.

Both statements describe the same underlying fact: bucket assignment and tax rate are a function of deposit timing, not of the account holder's current age or how long the account has been held as of today.

## 3. Evidence

Each item below carries two independent labels: the template's own A/B/C source-quality grade (`docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md` §3), and this milestone's Product Owner-approved evidence-classification convention (Repository-verified / Independently inspected local report evidence / Roy-confirmed domain decision / Roy-supplied external analysis pending / Working Hypothesis / Unknown) — a milestone-specific convention, not one defined in `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md`. The two are shown together for convenience; they are not the same taxonomy.

- **Level A (Independently inspected local report evidence, this session)**: real B.8 tables from two accounts across five report-years were reconstructed from each PDF's own text-layer glyph coordinates (row-position clustering, column-position sorting) — not linear-text extraction — and cross-checked against each other. See `docs/knowledge/study_fund/EVIDENCE_INDEX.md` for the redacted figures. Both accounts show exactly two non-zero buckets in every year inspected (0% "2012+, up to ceiling" and 25% "2012+, above ceiling"), with **stable principal** (2022 onward) and **plausibly evolving profit/linkage** consistent with real market conditions across the period.
- **Level A (Independently inspected local report evidence, this session)**: `SF-EVIDENCE-A`'s account (Altshuler, alias `...0513`) is present in the 2021–2024 detailed annual reports and absent from the 2025 detailed report; `SF-EVIDENCE-B`'s account (Meitav, alias `...2504`) shows, in its own report's B.3 funds-movement section, an opening balance of zero as of 31.12.2024 and a transfer-in during 2025 — both facts consistent with, and Roy-confirmed to be, the same underlying fund moving providers.
- **Level A (Repository-verified)**: `server.js:208-232` (`_aggregateTierRows`) and `server.js:317-540` (`parseMeitav`, `parseAltshuler`) show the app's own parsers extracting exactly this bucket shape (`{taxRate, principal, realProfit, linkage}` per row) from a real report, confirming the code's model of the B.8 table matches the table's actual structure.
- **Level A (Repository-verified)**: `app.js:19469-19507` (`_sfPdfToSegments`) converts the parsed bucket shape into the 2-segment (`tikrat:1` exempt / `tikrat:2` taxable) shape the tax engine consumes.

## 4. Model Assumptions

This object models the B.8 table's bucket structure as **complete and authoritative for tax-rate classification as of the report date** — i.e., a bucket's rate is treated as a durable fact about the deposits in it, not merely a snapshot that could be reclassified without a corresponding regulatory or deposit event. This is a simplification: the object does not model *why* a bucket's rate could ever change (e.g. a ceiling recalculation), only that no such change was observed across the five report-years inspected. It also does not model what happens to bucket classification at the moment of actual withdrawal — see `SF-LIQUIDITY-TAX-SEPARATION` for the boundary between this object's scope (current classification) and the separate, unresolved legal question of withdrawal-time treatment.

**Model Assumptions are not Simulation Assumptions** — see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` §6. No user-adjustable projection parameter belongs in this section; those live in `SF-TAX-MODEL` §8.

## 5. Mathematical Model

For a given account and report date, the B.8 table is the set of tuples:

```
bucket_i = { era_i, ceiling_position_i, rate_i ∈ {0, 15, 20, 25}, principal_i, linkage_i, realProfit_i }
```

with `total_i = principal_i + linkage_i + realProfit_i` for each bucket, and the report's overall balance equal to `Σ total_i` across all buckets (subject to the integrity gate in `server.js:286-297`, ±10 ILS tolerance). No formula transforms one bucket into another within this object — composition of buckets into a single tax figure is `SF-REPORT-DATE-TAX`'s responsibility, not this object's.

## 6. Implementation

- `server.js:208-232` — `_aggregateTierRows`, the shared bucket-aggregation function for both parsers.
- `server.js:234-244` — `calculateMarginalTaxRate`, profit-weighted average rate across taxable buckets.
- `server.js:286-297` — `_validateIntegrity`, the row-sum-vs-stated-total check.
- `server.js:317-404` — `parseMeitav` (regex-based, no AI).
- `server.js:407-540` — `parseAltshuler` (two Claude Haiku calls, RTL-column-mapping prompt).
- `app.js:19469-19507` — `_sfPdfToSegments`, converts parsed buckets into the tax engine's segment shape.

## 7. Consuming Views

- **Reference**: `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md` §4 (Major Components table) — cites this Rule ID for the B.8 parsing/aggregation logic instead of restating it.
- **Reference**: `SF-TAX-MODEL` §3 (Composition) — names this object as the first stage in the composed tax model.
- No Generated View exists yet for this object (no tooltip, FAQ, or AI-prompt fragment has been produced from it in this milestone).

## 8. Validation

- `server.js:286-297`'s integrity gate runs on every real parse, in production, for both firms — a genuine, load-bearing automated check that the extracted buckets sum to the report's own stated total.
- This session's five-report-year, two-account positional re-verification (§3) is additional, independently produced validation, beyond what the app's own code checks — but it is a one-time research verification, not a repeatable automated test.
- No automated regression test exists for `_aggregateTierRows` or the parsers against a real PDF (matches the pre-existing finding in `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md` Risk 6).

## 9. Explainability

A Study Fund's tax-tier "buckets" simply record when each portion of the fund's balance was deposited, and whether that portion fell inside or outside the preferential deposit ceiling in force at the time. The rate a bucket carries (0%, 15%, 20%, or 25%) is fixed by that deposit-timing fact, not by how long the account has been held since. In the provider-transfer case examined, the same principal buckets and tax classifications were preserved across the transfer.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**High** — for bucket-value persistence over time and across the provider transfer: independently reproduced across five real report-years from two providers, with exact-to-the-cent principal matches at every clean (no-deposit) transition. **This is one observed transfer case** (one fund, one Altshuler-to-Meitav transfer). It strongly supports continuity *in that case*; it does not, by itself, prove universal behavior for every provider and every transfer — a different provider pair, a different fund structure, or a partial/split transfer could plausibly behave differently, and none of that is tested here. **Confidence in the completeness of the bucket-classification model as a full legal statement is lower and explicitly out of scope here** — see Open Questions and `SF-LIQUIDITY-TAX-SEPARATION`.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Whether the B.8 table's deposit-era/ceiling classification is the *complete* legal picture, or whether a separate seniority/age-based mechanism could still apply at actual withdrawal without appearing anywhere in the holdings report itself (see `SF-LIQUIDITY-TAX-SEPARATION`).
2. Whether Roy has, or can obtain, the original pre-2021 Altshuler reports (2020 was excluded here as unreadable) or the exact-cent figures, should a stricter regression test ever be wanted.
