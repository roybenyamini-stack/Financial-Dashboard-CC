# Study Fund — Evidence Index

*Goose Financial — Canonical Knowledge, supporting evidence*

*Version 1.0 — Draft*

---

## Classification

**`EVIDENCE_INDEX.md` is a Supporting Evidence Artifact.** It is neither a Knowledge Object (`docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`) nor a Knowledge Model (`docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md`) — it does not follow either template's required-sections structure, and no dedicated Evidence Index template currently exists in the Foundation architecture. Its sole role is to provide privacy-redacted, durable, repository-committed observations that Canonical Knowledge Objects can cite, in place of citing a private, external, uncommitted source directly. Formalizing an "Evidence Index" artifact type in the Foundation architecture, if warranted, is a separate governance decision, not made by this milestone.

## Purpose

This index records the specific numeric observations that `SF-B8-TAX-RIGHTS` and `SF-TAX-SENSITIVITY-COEFFICIENT` cite as their evidentiary source. **The source annual-report PDFs are private, external, personal financial documents. They are not stored in this repository, are not tracked by git, and are not referenced here by filename.** This index records only the derived observations below — rounded principal figures and growth ratios/deltas — needed to support the Knowledge Objects that cite it. It does not reproduce full account numbers, source filenames, or exact-to-the-cent personal balances.

If exact-to-the-cent reproducibility is ever needed (e.g. for a stricter regression test), a separate local-only file covered by `.gitignore` would hold full-precision figures — no such file exists yet; this index is the only evidence artifact committed to the repository for this domain.

---

## Evidence Sources

| Alias | Provider | Domain | Account (redacted) | Report year(s) inspected |
|---|---|---|---|---|
| `SF-EVIDENCE-A` | Altshuler | Study Fund (קרן השתלמות) | ...0513 | 2021, 2022, 2023, 2024 |
| `SF-EVIDENCE-B` | Meitav | Study Fund (קרן השתלמות) | ...2504 | December 2025 |

`SF-EVIDENCE-B`'s account is the Roy-confirmed transfer destination of `SF-EVIDENCE-A`'s account (Altshuler → Meitav provider transfer). Both were inspected in a single research session by reconstructing each report's B.8 tax-tier table from the PDF's own text-layer glyph coordinates (grouping text by row position, then reading left to right by column position) — a method that does not depend on inferring RTL reading order, and which is independent of the linear-text/regex extraction method `server.js`'s parsers use. 2020 was not inspected: its digit-run text did not extract cleanly enough to parse reliably by either method.

Both accounts carry exactly two non-zero B.8 buckets across every report year inspected: one at **0%** (era: accumulated from 1.1.2012, up to the preferential-deposit ceiling) and one at **25%** (era: accumulated from 1.1.2012, above the preferential-deposit ceiling). All other era/rate buckets (pre-2003, 2003–2005, 2006–2011) are zero in every report inspected for both accounts.

---

## Principal, Rounded to the Nearest 10 ILS

| Report | 0%-bucket principal | 25%-bucket principal |
|---|---|---|
| SF-EVIDENCE-A, 2021 | ~109,980 | ~373,270 |
| SF-EVIDENCE-A, 2022 | ~114,700 | ~384,480 |
| SF-EVIDENCE-A, 2023 | ~114,700 | ~384,480 |
| SF-EVIDENCE-A, 2024 | ~114,700 | ~384,480 |
| SF-EVIDENCE-B, Dec 2025 | ~114,700 | ~384,480 |

Principal is stable from 2022 onward across every report year and across the provider transfer — the 2021→2022 step change is consistent with a deposit event, not an error. This is the evidentiary basis for `SF-B8-TAX-RIGHTS`'s bucket-persistence and transfer-continuity findings.

---

## Real Profit and Linkage — Deltas and Ratios Between Consecutive Report Years

Absolute real-profit and linkage figures are not published here (see the local-only pack note above for a path to exact figures if ever needed). The derived ratios below are the evidentiary content actually used by `SF-TAX-SENSITIVITY-COEFFICIENT`'s Model A/B analysis:

| Transition | Real-profit Δ ratio (25%-bucket Δ : 0%-bucket Δ) | Linkage Δ ratio (25%-bucket Δ : 0%-bucket Δ) |
|---|---|---|
| 2022 → 2023 | 3.307 | 3.351 |
| 2023 → 2024 | 3.311 | 3.350 |
| 2024 → Dec 2025 (transfer) | 3.313 | 3.350 |

For reference, the fixed bucket-principal ratio (25%-bucket : 0%-bucket) is **3.352** (≈384,480 / ≈114,700).

These three ratios were computed only across "clean" transitions — consecutive report years where principal did not change (2022→2023, 2023→2024, 2024→Dec 2025) — excluding 2021→2022, where a deposit occurred.

---

## Evidence Grading

This milestone classifies claims using the following Product Owner-approved evidence categories: Repository-verified, Independently inspected local report evidence, Roy-confirmed domain decision, Roy-supplied external analysis pending repository evidence capture, Working Hypothesis, and Unknown. This is a milestone-specific evidence-classification convention, not a taxonomy currently defined in `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` — that document defines a separate A/B/C source-quality grading (per `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md` §3, citing `GOOSE_EXPEDITION_1_ASSESSMENT.md`'s scale). The two systems serve different purposes and are not the same taxonomy: A/B/C grades how directly a citation was verified; the six categories here grade what *kind* of source underlies a claim (code, a real document, a product decision, external analysis, or an open question).

All observations above are graded **Independently inspected local report evidence** under this milestone's convention — read directly from real annual-report PDFs, outside the repository, in the session that produced this index, using row/column-position reconstruction rather than linear-text extraction. They are not Repository-verified (the source PDFs are not repository files) and not Roy-supplied external analysis (Roy did not perform this specific extraction; a research agent and direct inspection did, in this repository's working session).

---

*Cited by: `SF-B8-TAX-RIGHTS`, `SF-TAX-SENSITIVITY-COEFFICIENT`. For what a Knowledge Object is, see `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`.*
