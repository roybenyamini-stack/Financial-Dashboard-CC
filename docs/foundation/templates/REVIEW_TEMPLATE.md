# Review Document — Template

*Companion template for the module-level Review documentation pattern (`docs/modules/**/`)*

*Version 1.0*

---

Use this template alongside `CAPABILITY_TEMPLATE.md` when a module's Capability document warrants an evidence-graded review pass — assessing trust, risk, and readiness, not re-describing what the capability does. This structure is extracted from the first working instance of this pattern, `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md`, produced in the same milestone as its companion Capability document.

A Review document assesses; it does not propose fixes, redesign, or migration code. It is repository-understanding and evidence-grading only, per the precedent in `docs/foundation/GOOSE_EXPEDITION_1_ASSESSMENT.md`.

---

## Version Header

```
# <Capability Name> — Review

*Goose Financial — Module Documentation*

*Version X.Y — [Draft | Reviewed | Approved/Ratified], [pending Product Owner review if applicable]*

**Author:** [who produced this]
**Reviewed by:** [Product Owner name, or "(pending)"]
**Product Owner:** Roy

**Scope:** Repository understanding and evidence-based review only. No application code was modified in producing this document. No fixes are proposed — see the companion Capability document for the canonical description this review assesses.
```

---

## Required Sections (do not remove any)

**Evidence Levels** — restate the three-level scale up front (Level A — verified directly this session; Level B — supported by existing project documentation, not independently re-derived; Level C — reported by an earlier automated exploration pass, not re-verified here). Grade every finding.

**1. Repository Findings — Data Flow & Trust Assessment** — assessed stage by stage, following the companion Capability document's flow section. Each stage gets a **Trust: High / Medium / Low** rating with the reasoning for why it is not one notch higher or lower, and an Evidence Level.

**2. Risks** — ordered by consequence, not confidence. Each risk states the concrete failure scenario, not just a category label, and its Evidence Level.

**3. Validation Status** — three sub-parts: *How correctness is currently verified* (tests, integrity gates, manual review, or none), *What evidence exists* that this verification is real and load-bearing (not aspirational), and *What evidence is missing*.

**4. Questions For Roy** — each question states explicitly why it cannot be resolved by further reading the repository (requires domain/legal knowledge, or the repository itself is contradictory), and which section/risk above it relates to.

**5. Readiness Assessment** — explicit answers to: is this Roy-ready (with caveats named), is this production-ready for other users, and what specifically blocks moving a stage further. Base every claim only on evidence already presented above — this section synthesizes, it does not introduce new findings.

---

## Authoring Notes

- If this review surfaces a business rule stated independently in two or more places (a same-topic, cross-document or code-vs-document conflict, as opposed to a data-flow trust issue), name it explicitly as a candidate for its own Knowledge Object under `docs/knowledge/<domain>/` (see `KNOWLEDGE_OBJECT_TEMPLATE.md`) — do not resolve the conflict inside this Review document; log it as a Risk and a Question For Roy, and defer resolution to the Knowledge Object.
- A Review document is Roy Reality Lab or Goose Financial layer depending on scope — register it in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3 accordingly.
- Grade honestly. A Level C finding presented as Level A is worse than an ungraded document, because it looks more trustworthy than it is.

---

## Validation Checklist (apply before publishing a new Review document)

- [ ] Every finding carries an Evidence Level.
- [ ] Every Risk states a concrete failure scenario, not a category.
- [ ] Any cross-document or code-vs-document rule conflict found is flagged as a Knowledge Object candidate, not resolved inline.
- [ ] The Readiness Assessment introduces no claim absent from §1–§3 above it.
- [ ] The document is registered in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3's layer table.

---

*This template is itself a Foundation artifact. Changes to its structure should go through the same review as changes to `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md`.*
