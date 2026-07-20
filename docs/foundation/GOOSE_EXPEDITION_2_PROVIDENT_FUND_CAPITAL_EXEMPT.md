# Provident Fund / Amendment 190 — `capital_exempt` Investigation

**Version:** E2-1.0 — Draft
**Status:** Evidence finding — Approved. Canonical data model — Not approved. Knowledge Object — Not created. Runtime implementation — Blocked.
**Scope:** Legal/regulatory research into Goose's `capital_exempt` Amendment-190 bucket. No code, no Knowledge Object.
**Author:** Claude Code
**Reviewed by:** Codex (independent review) — accepted with corrections, incorporated below
**Product Owner:** Roy

---

This document is the Roy Reality Lab milestone record for the first legal-reality investigation opened under `GOOSE_BOOT.md`'s Provident Fund / Amendment 190 track. It follows the same evidence-graded, no-code-change discipline as `GOOSE_EXPEDITION_1_ASSESSMENT.md`, applied to a legal-research question rather than a repository-code question. It records an **evidence finding**, not a canonical rule: it is not a Knowledge Object, no Rule ID is assigned, and none of this content may be cited by application code, an AI prompt, or a UI string as canonical. Per Roy's explicit instruction, drafting the Knowledge Object is deferred to a future milestone.

---

## Evidence basis

Two official documents were located, downloaded, and read directly (full text extracted via `pypdf`, cross-checked page by page against Hebrew source — not summarized from a secondary source):

1. **Income Tax Circular 2/2013** ("חוזר מס הכנסה מס' 2/2013 – רשות המסים, בנושא: תיקון 190 לפקודה - הוראות סעיף 9א למתן פטור על הקצבה המזכה") — 26 pages, fully read.
2. **Form 159** ("בקשת עמית מפקיד השומה למשיכת כספי תגמולים מקופת גמל ללא ניכוי מס") — 1 page, fully read.

Both were retrieved from official `gov.il` URLs; local copies are retained under this session's tool-results cache, not committed to this repository. A known extraction limitation applies to Circular 2/2013: multi-digit numerals in the PDF's text layer are subject to a bidi/font-encoding corruption not fully decoded in this pass — prose, section headings, and single-token references (e.g. "9א", "§23") extracted cleanly and are the basis for every quoted passage below; monetary figures and some numeral labels were not relied upon. This is flagged explicitly in Open Item 1 below rather than smoothed over.

---

## Consolidated evidence finding (this milestone)

**1.** The current Goose `capital_exempt` field is **not supported by Circular 2/2013 as a real third source-of-money bucket.** No passage in the circular describes a standing fund balance matching Goose's `buckets.capital_exempt.balance_k`.

**2.** The circular's term **`ההון הפטור`** is a calculation concept for the capitalized pension-exemption framework — a theoretical present-value ceiling on the קצבה מזכה monthly exemption, computed as `הפטור לקצבה × מכפיל ההמרה להון`. The circular's own footnote states this term does not appear in the Ordinance and is defined only for the circular's own calculation purposes. It is **not** a current fund balance and **not** a contribution category.

**3.** Roy's intended product concept remains valid, but only reframed as a **derived, non-additive scenario** based on recognized-pension (`recognized_annuity`) balance:

```
recognized-pension balance
  → hypothetical future lawful commutation
  → estimated net capital result
```

**4.** This derived value:
- is not currently liquid;
- is not presently withdrawable merely because it is displayed;
- must not be added to the recognized-pension balance;
- must not be persisted or ingested as an independent source-of-money bucket;
- requires explicit eligibility, basis/profit, exemption-capacity, and operational assumptions before it can be computed at all.

**5.** Circular 2/2013 directly supports:
- `קצבה מזכה` and `קצבה מוכרת` as distinct pension categories (page 4: קצבה מזכה is defined as the residual category — "סך כל הקצבאות שמקבל אדם למעט קצבה מוכרת" — not the other way around, which is the reverse of how `provident_funds_logic.md` currently frames `recognized_annuity` as the residual bucket);
- **15% taxation on the profit component** in the described recognized-pension (קצבה מוכרת) commutation case, beyond the applicable shared exemption framework (page 21: "היוון 'קצבה מוכרת' מעבר לתקרת הפטור חייב במס בשיעור של 15% ממרכיב הרווחים הכלולים בסכום זה");
- **marginal taxation** for the described qualifying-pension (קצבה מזכה) commutation beyond the exemption framework (page 21: "בהתאם לשיעורי המס להכנסה מיגיעה אישית");
- **35% or marginal, whichever is higher**, for unlawful/non-Section-23 commutation (page 13, citing 1962 Regulation 3) — a penalty rate for improper withdrawal, not a property of any specific bucket.

**6.** "Principal is not taxed again" is a **strong inference**, not yet an explicit quoted rule. The circular states 15% applies to "מרכיב הרווחים" (the profit component) of the over-ceiling amount; it never explicitly states the principal portion of that same over-ceiling amount is exempt. The inference is reasonable but not textually closed — logged as Open Item 6, not asserted as settled.

**7.** Form 159 is **not evidence** for the Amendment 190 bucket model or the recognized-pension commutation estimate. It governs a materially different mechanism: hardship-based (permanent disability ≥75%, or major medical expense) withdrawal of `כספי תגמולים`, under Regulations 34 and 38 of the 1964 provident-fund regulations — no contribution-date cutoff, no קצבה מזכה/קצבה מוכרת distinction, and no tax rate appears anywhere on the form.

---

## Recommended working term (not canonical, not yet approved)

- Hebrew: **אומדן היוון קצבה מוכרת**
- English: **`recognized_pension_commutation_estimate`**

This term is recorded here as the current working name for the derived scenario in Finding 3. It is not a field name authorization and not a Knowledge Object Rule ID — both remain pending.

---

## Open items (backlog for the next research pass)

1. **OCR/extraction risk on the 15% and 35% figures.** Both rates were read from prose sentences that extracted cleanly, but the surrounding circular suffers a known digit-rendering corruption elsewhere. A visual (rendered-page) confirmation of these two figures has not been performed — `poppler`/`pdftoppm` is unavailable in this environment and was not installed without approval.
2. **The separate official circular on recognized pension.** Circular 2/2013 explicitly states (page 4) that it does not cover קצבה מוכרת's own mechanics and that a dedicated circular was expected. That document has not been located or read.
3. **XML field semantics and operational classification** — whether `TIKRAT-HAFKADA-MUTEVET`, `KOD-TECHULAT-SHICHVA`, and related fields correspond to anything found in this legal research remains untested. Per prior instruction, this requires a separate, narrowly-scoped, privacy-safe evidence review of local-only files, not yet executed.
4. **Exact data requirements for calculating the derived estimate** (Finding 3/4) — what eligibility, basis/profit, and exemption-capacity inputs Goose would need, and from where, is not yet specified.
5. **Final product terminology and whether a "virtual bucket" presentation is acceptable** — an open product-design question, not a legal one; deferred to Roy.

---

## Status

| Layer | Status |
|---|---|
| Evidence finding | **Approved** |
| Canonical data model | **Not approved** |
| Knowledge Object | **Not created** |
| Runtime implementation | **Blocked pending remaining research** |
| Code change | **None authorized** |

---

*This document is classified under Roy Reality Lab (`GOOSE_DOCUMENTATION_GOVERNANCE.md` §3), alongside `GOOSE_EXPEDITION_1_ASSESSMENT.md` — it records investigation truth, not product policy or a canonical rule. It should not be cited by application code, an AI prompt, or a UI string. A future milestone may promote parts of this finding into a Knowledge Object under `docs/knowledge/provident_fund/`, per `GOOSE_KNOWLEDGE_ARCHITECTURE.md` — not performed here.*
