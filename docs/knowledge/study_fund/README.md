# Study Fund — Canonical Knowledge

*Goose Financial — Canonical Knowledge*

*Version 1.0 — Draft*

---

This directory is reserved for Canonical Knowledge for the Study Fund (קרן השתלמות) domain, in two tiers:

- **Knowledge Objects** — atomic, one file per business rule, built from `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`.
- **Knowledge Models** — composed, one file per coherent business model built from two or more Knowledge Objects, built from `docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md`.

No Knowledge Object or Knowledge Model has been authored yet. This directory is created now, empty, as part of the Knowledge Architecture Foundation milestone, so the next milestone — consolidating the Study Fund Tax Model — has a home to write into rather than inventing one under time pressure.

The atomic rules expected here include the vesting-exemption rule (a working ID would be `SF-VESTING-EXEMPTION`), which currently exists as four independent, disagreeing statements: `docs/TaxLogic.md` §3.1/§5.1, `israel_tax_rules.md`, the live behavior of `_sfCalculateTax`/`_sfRecalculate` in `app.js`, and the AI advisor's system prompt in `server.js` — plus its sibling rules (segment/tikrat classification, the tax rate, the `effectiveTaxCoeff` blending formula, pre-2002/pre-2003 special cases). See `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md` §1.9, Risk 1, and Question 1 for the full evidence trail.

The composed model expected here is the Study Fund Tax Model (a working ID would be `SF-TAX-MODEL`), which must state how those atomic rules combine — in particular, its Interaction & Edge Cases section must resolve whether the seniority/age vesting exemption still applies once a PDF-verified tier calculation supersedes the XML-only fallback, the specific unresolved asymmetry documented in `STUDY_FUND_CAPABILITY_REVIEW.md`'s Risk 2.

Consolidating this conflict into these files is deferred to that future milestone — not performed by this one.

---

*For what a Knowledge Object and a Knowledge Model are and how to author one, see `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md` and `docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md`. For the philosophy behind this hierarchy, see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md`. For how this fits Goose's documentation governance, see `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §12.*
