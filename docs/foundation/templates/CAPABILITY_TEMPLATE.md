# Capability Document — Template

*Companion template for the module-level Capability documentation pattern (`docs/modules/**/`)*

*Version 1.0*

---

Use this template when producing a new module-level Capability document (e.g. `docs/modules/<module>/<MODULE>_CAPABILITY.md`). This is the module-level orchestration document — it describes an entire capability end-to-end, in the order it actually runs, and points into `docs/knowledge/<module>/` for any individual business rule rather than restating that rule's content. It does not replace a Knowledge Object; it is the map that shows where each one sits in the flow.

This structure is extracted from the first working instance of this pattern, `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md`, produced during the Study Fund Capability Discovery milestone. Do not restructure a Capability document unless a Foundation-level decision requires it — keep new instances consistent with this template so the pattern stays recognizable across modules.

---

## Version Header

```
# <Capability Name> (<Hebrew name if applicable>)

*Goose Financial — Module Documentation*

*Version X.Y — [Draft | Reviewed | Approved/Ratified], [pending Product Owner review if applicable]*

**Author:** [who produced this]
**Reviewed by:** [Product Owner name, or "(pending)"]
**Product Owner:** Roy
```

---

## Required Sections (do not remove any)

**0. How This Document Was Produced** — state plainly whether this is a discovery document (produced by reading the repository directly) or a design document (produced from intent before implementation), and that every claim is backed by a `file:line` citation or an explicit statement that the repository is silent/self-contradictory on the point. Name this document as the canonical knowledge source for the module, and name any narrower-scope sibling documents it references rather than duplicates (e.g. an existing Builder/Human contract pair for one sub-feature).

**1. Purpose** — what the capability does, in plain language, for the person using it. Anchor it to the relevant Goose Constitution principles it serves (`docs/foundation/GOOSE_CONSTITUTION.md`), not just a feature list.

**2. Responsibilities** — split into:
- *In scope (owned by this module)* — everything this module is the SSOT for.
- *Out of scope (owned elsewhere, only touched at the boundary)* — name the actual sibling document or module that owns each adjacent concern, and the exact touch-point (a shared function, a shared field, a UI branch), per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §4's cross-reference rule.

**3. Capability Flow** — the flow as actually implemented (or, for a design document, as intended), not an idealized version. An ASCII pipeline diagram with `file:line` citations at each stage is the proven format. Mark optional stages as optional.

**4. Major Components** — a table per functional cluster: `Function | Location | Role`. Where a business rule inside a component has (or should have) its own Knowledge Object under `docs/knowledge/<module>/`, reference it by Rule ID instead of restating the rule's logic here. Where several rules are routinely used together and their *combination* has behavior of its own (an interaction, an ordering dependency), reference the composing Knowledge Model instead of listing each constituent Rule ID separately — see `KNOWLEDGE_MODEL_TEMPLATE.md`.

**5. Current Limitations** — backed by direct repository evidence only, not speculation.

**6. Business Knowledge Missing From Repository** — open questions that cannot be resolved by reading code or existing documentation further; they require the Product Owner's domain knowledge. Full reasoning for each belongs in the companion Review document if one exists (see `REVIEW_TEMPLATE.md`); list the questions here for completeness.

---

## Authoring Notes

- Every claim needs a citation (`file:line`) or an explicit "repository is silent/contradictory here" statement — this is what separates a Capability document from a feature description.
- A Capability document is Builder documentation (`GOOSE_DOCUMENTATION_GOVERNANCE.md` §6) — precise, technical, English or mixed Hebrew/English. If the module also warrants a Human-facing guide, follow the existing twin pattern (`docs/study_fund_input_status_contract.md` + `docs/study_fund_input_guide_human.md`), not this template.
- Do not restate a business rule's Reality/Mathematical Model/Evidence here if it has (or should have) its own Knowledge Object, or a composed Knowledge Model if several rules interact — reference it by Rule ID or Model ID instead. See `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` for when a rule warrants its own Knowledge Object, when several warrant a Knowledge Model, versus staying inline in §4's component table.

---

## Validation Checklist (apply before publishing a new Capability document)

- [ ] Every factual claim has a `file:line` citation, or is explicitly marked as an assumption/unknown.
- [ ] §2's out-of-scope list names the actual sibling document/module for each adjacent concern — no vague "handled elsewhere."
- [ ] No business rule is restated in full where a Knowledge Object or Knowledge Model reference would do instead.
- [ ] The document is registered in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3's layer table.
- [ ] Version header and byline match the pattern above.

---

*This template is itself a Foundation artifact. Changes to its structure should go through the same review as changes to `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md`.*
