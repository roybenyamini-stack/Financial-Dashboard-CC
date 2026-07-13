# Knowledge Model: Study Fund Tax Model

**Model ID:** SF-TAX-MODEL
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Model ID & Name

`SF-TAX-MODEL` — the composed statement of how Goose estimates expected tax and expected net proceeds for a Study Fund withdrawal scenario, built from the eight atomic Knowledge Objects below.

## 2. Purpose

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

For any withdrawal scenario a person selects — today or a future date, full or partial withdrawal, under chosen return/inflation assumptions — this model answers: *what tax would be owed, and what would the net proceeds be?* It is a hypothetical estimate for understanding, not a final tax assessment, and it is explicitly **not** a statement about whether that withdrawal can actually be executed on the selected date (see §5 and `SF-LIQUIDITY-TAX-SEPARATION`).

**Tax is not paid until an actual withdrawal event occurs.** Goose estimates the hypothetical liability for a selected scenario — the scenario may be today or any future date, and may be a full or partial withdrawal. A fund that is not currently liquid may still be modeled for What-If purposes; withdrawal feasibility/liquidity is outside this Tax Model's responsibility (see `SF-LIQUIDITY-TAX-SEPARATION`, and the future `SF-WITHDRAWAL-FEASIBILITY` object referenced but not created in this milestone).

## 3. Composition

| Rule ID | Role in this model |
|---|---|
| `SF-B8-TAX-RIGHTS` | Defines the canonical tax-tier bucket structure and its evidenced persistence over time and across provider transfer. |
| `SF-LINKAGE-TREATMENT` | Modifies how `SF-B8-TAX-RIGHTS`'s bucket data is read: linkage folds into exempt profit but is excluded from taxable profit. |
| `SF-REPORT-DATE-TAX` | Computes tax as of the report date from the (linkage-adjusted) buckets. |
| `SF-TAX-SENSITIVITY-COEFFICIENT` | Provides the blended coefficient used to translate any post-report-date gain/loss into tax. |
| `SF-YTD-UPDATE` | Applies the coefficient to the balance change between the report date and today. |
| `SF-FUTURE-PROJECTION` | Applies the same coefficient to a projected balance change between today and a selected future date. |
| `SF-PARTIAL-WITHDRAWAL` | Applies the selected withdrawal fraction to the combined tax figure. |
| `SF-LIQUIDITY-TAX-SEPARATION` | Boundary/interaction rule — constrains what this model does and does not claim; not a calculation stage. |

## 4. Composed Model

```
Canonical Study Fund facts (asset identity, balance, as-of date, report date)
  ▼
SF-B8-TAX-RIGHTS §5           — bucket structure, modified by SF-LINKAGE-TREATMENT §5
  ▼
SF-REPORT-DATE-TAX §5         — Σ(taxable real profit × rate), linkage-excluded per SF-LINKAGE-TREATMENT
  ▼
SF-TAX-SENSITIVITY-COEFFICIENT §5   — effectiveTaxCoeff
  ▼
SF-YTD-UPDATE §5              — report-date → today
  ▼
SF-FUTURE-PROJECTION §5       — today → selected future date
  ▼
SF-PARTIAL-WITHDRAWAL §5      — × selected withdrawal fraction
  ▼
Expected tax → Expected net (gross − tax)
```

Each stage cites its own object's §5 for the actual formula; no formula is restated here. The cross-cutting liquidity/tax boundary (`SF-LIQUIDITY-TAX-SEPARATION`) is documented in §5 (Interaction & Edge Cases) below and is intentionally not a calculation stage in this diagram.

## 5. Interaction & Edge Cases

- **The historical vesting-exemption conflict — see `SF-LIQUIDITY-TAX-SEPARATION` §2–§3, §10–§11 for the full reframing.** In summary, at the model level: liquidity does not gate the What-If tax pipeline above — none of §4's stages take a liquidity/seniority input — while the legal question of whether Israeli law imposes a seniority-based exemption mechanism at actual withdrawal remains separately, explicitly Unknown. This model does not carry forward the old binary "fund becomes fully exempt after six years" statement as accepted knowledge; `SF-LIQUIDITY-TAX-SEPARATION` is the canonical reference for why, and for what remains open.
- **Linkage asymmetry (`SF-LINKAGE-TREATMENT`) interacting with report-date tax.** This is a genuine, previously-undocumented interaction: the exclusion of linkage from taxable-tier profit means `SF-REPORT-DATE-TAX`'s formula understates taxable profit relative to a hypothetical model that included linkage — by a real, non-trivial amount in the evidence inspected. Whether this is correct or a gap is `SF-LINKAGE-TREATMENT`'s own open question (§11), carried forward here as a live interaction risk rather than resolved.
- **Active-fund YTD confidence interacting with partial withdrawal.** `SF-YTD-UPDATE`'s lower confidence for active funds (deposit-netting ambiguity) compounds with `SF-PARTIAL-WITHDRAWAL`'s already-open legal-basis question when both apply to the same scenario (an active fund, partially withdrawn) — the combined estimate should not be treated as more confident than its weakest constituent.
- **`SF-TAX-SENSITIVITY-COEFFICIENT`'s candidate model, if ever implemented, would change `SF-YTD-UPDATE` and `SF-FUTURE-PROJECTION`'s shared coefficient input** — both objects consume `effectiveTaxCoeff` as given; neither has its own independent view of how it should be derived, so a change to the coefficient object propagates to both without requiring their own changes.

## 6. Consuming Views

- **Reference**: `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md` §4 — cites this Model ID for the overall tax-engine flow instead of restating it.
- **Reference**: `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §13 — the reframed debt entry cites this Model ID and `SF-LIQUIDITY-TAX-SEPARATION` together.
- No Derived Views (tooltip, FAQ, Human Guide, AI-prompt fragment) are generated from this model in this milestone — that is explicitly out of scope.

## 7. Validation

- Each constituent object's own Validation section (§8 in each) states what's checked at that stage; this model's *composition* — that the stages chain together correctly end to end — has not been independently tested as a whole. `audit_rules.js` exercises pieces of the chain (the report-date/coefficient path) but not the full YTD→projection→partial-withdrawal chain in one test.

## 8. Simulation Assumptions

The following are user-adjustable, forward-looking parameters, distinct from any constituent object's Model Assumptions (permanent, definitional simplifications) — per `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` §6, they are recorded once, here, not duplicated per object:

- **Time horizon** — the selected future withdrawal date (or "today," a zero-length horizon), consumed by `SF-FUTURE-PROJECTION`.
- **Investment return rate** (pre-retirement phase) and **pension/post-retirement return rate** — consumed by `SF-FUTURE-PROJECTION`.
- **Inflation rate** — consumed by `SF-FUTURE-PROJECTION`'s linear deduction.
- **Withdrawal amount or percentage** — consumed by `SF-PARTIAL-WITHDRAWAL`.

## 9. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Medium** — an aggregate assessment, not copied from any single constituent's rating. The report-date and coefficient stages are High/Medium-High confidence individually; the model as a whole is capped by (a) `SF-LIQUIDITY-TAX-SEPARATION`'s explicitly Unknown legal question, (b) `SF-LINKAGE-TREATMENT`'s newly-found, unresolved asymmetry, and (c) `SF-PARTIAL-WITHDRAWAL`'s unverified legal basis — an interaction can be less well-tested than any individual piece, which is the case here.

## 10. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. All open questions from `SF-LIQUIDITY-TAX-SEPARATION` §11, `SF-LINKAGE-TREATMENT` §11, `SF-PARTIAL-WITHDRAWAL` §11, and `SF-TAX-SENSITIVITY-COEFFICIENT` §11 apply to this composed model collectively — resolving any one of them individually does not resolve the others, and the model's aggregate confidence should be re-assessed once any of them is closed.
2. Should a future `SF-WITHDRAWAL-FEASIBILITY` object be created to formally state what liquidity/eligibility rules actually govern a Study Fund withdrawal, complementing this model's explicit non-responsibility for that question? Not created in this milestone — named here only as a forward reference.
