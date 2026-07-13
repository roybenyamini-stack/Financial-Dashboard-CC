# Study Fund — Canonical Knowledge

*Goose Financial — Canonical Knowledge*

*Version 1.1 — Draft*

---

This directory holds Canonical Knowledge for the Study Fund (קרן השתלמות) domain, in two tiers:

- **Knowledge Objects** — atomic, one file per business rule, built from `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`.
- **Knowledge Models** — composed, one file per coherent business model built from two or more Knowledge Objects, built from `docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md`.

## Contents

**Composed model:**
- `SF_TAX_MODEL.md` (`SF-TAX-MODEL`) — the end-to-end estimate of expected tax and expected net proceeds for a Study Fund withdrawal scenario, composed from the eight atomic objects below.

**Atomic Knowledge Objects:**
- `SF_B8_TAX_RIGHTS.md` (`SF-B8-TAX-RIGHTS`) — the B.8 tax-tier bucket structure and its evidenced persistence over time and across a provider transfer.
- `SF_REPORT_DATE_TAX.md` (`SF-REPORT-DATE-TAX`) — tax calculation as of the fund's last annual report.
- `SF_TAX_SENSITIVITY_COEFFICIENT.md` (`SF-TAX-SENSITIVITY-COEFFICIENT`) — the blended coefficient translating post-report-date gain/loss into tax, including a longitudinal comparison of two candidate allocation models.
- `SF_YTD_UPDATE.md` (`SF-YTD-UPDATE`) — estimating the change from the report date to today.
- `SF_FUTURE_PROJECTION.md` (`SF-FUTURE-PROJECTION`) — projecting value and tax forward to a selected future date.
- `SF_PARTIAL_WITHDRAWAL.md` (`SF-PARTIAL-WITHDRAWAL`) — the proportional-withdrawal assumption.
- `SF_LINKAGE_TREATMENT.md` (`SF-LINKAGE-TREATMENT`) — a newly-documented asymmetry in how linkage/indexation is included per bucket.
- `SF_LIQUIDITY_TAX_SEPARATION.md` (`SF-LIQUIDITY-TAX-SEPARATION`) — the boundary rule separating withdrawal eligibility (liquidity) from tax-bucket taxability; the reframing of the original vesting-exemption conflict.

**Supporting evidence:**
- `EVIDENCE_INDEX.md` — privacy-redacted numeric observations from real annual-report inspection, cited by `SF-B8-TAX-RIGHTS` and `SF-TAX-SENSITIVITY-COEFFICIENT`. The source PDFs are private, external, personal financial documents and are not stored in this repository.

## The Reframed Conflict

The original four-way vesting-exemption conflict (`docs/TaxLogic.md` §3.1/§5.1 and `israel_tax_rules.md`'s binary "fund becomes fully exempt after six years" statement, vs. the code's actual mixed/no-check behavior) is **not preserved as accepted knowledge**. `SF-LIQUIDITY-TAX-SEPARATION` reframes it as a conflation of withdrawal-eligibility and bucket-taxability. The conceptual confusion is resolved; the underlying legal question — whether Israeli law imposes a seniority-based exemption mechanism at actual withdrawal, separate from the deposit-era/ceiling bucket classification — remains explicitly **Unknown**, not resolved or superseded. See `SF-LIQUIDITY-TAX-SEPARATION` §10–§11 and `SF-TAX-MODEL` §5 for the full statement, and `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §13 for the governance-level record of this reframing.

---

*For what a Knowledge Object and a Knowledge Model are and how to author one, see `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md` and `docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md`. For the philosophy behind this hierarchy, see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md`. For how this fits Goose's documentation governance, see `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §12.*
