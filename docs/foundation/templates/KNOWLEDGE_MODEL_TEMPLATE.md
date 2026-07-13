# Knowledge Model — Template

*Companion template for composed Canonical Knowledge (`docs/knowledge/**/`)*

*Version 1.0*

---

## What a Knowledge Model Is

A Knowledge Model is the composed, coherent statement of a business *model* — the answer to a real-world question that is only meaningful as the combination of two or more atomic rules. It sits between the module-level Capability document (`CAPABILITY_TEMPLATE.md`, which describes an entire module end-to-end, including concerns like UI and data import that are not business rules at all) and the atomic Knowledge Object (`KNOWLEDGE_OBJECT_TEMPLATE.md`, deliberately scoped to exactly one rule).

**Hierarchy:** `Capability → Knowledge Model → Knowledge Object`

The Study Fund Tax Model is the motivating example: "how much tax is owed on a Study Fund withdrawal" is not one rule — it is the seniority/age vesting-exemption rule, the exempt/taxable segment (tikrat) classification, the capital-gains tax rate, the blended `effectiveTaxCoeff` approximation, and the pre-2002/pre-2003 special cases, combined. Each of those is its own Knowledge Object. The Tax Model is what states how they combine — and, critically, what happens at their boundaries (see Interaction & Edge Cases below), which is exactly where an unaddressed real defect currently lives: whether the seniority/age vesting exemption still applies once a PDF-verified tier calculation supersedes the XML-only fallback.

A Knowledge Model **never originates rule wording of its own.** Every fact it states about an individual rule must already exist in that rule's own Knowledge Object; the Model only states how those facts compose. If a Model needs to say something about a rule that isn't yet captured in that rule's own object, the fix is to update the object, not to state it in the Model.

**When a Knowledge Model is warranted:** when two or more Knowledge Objects are routinely used together to answer one real-world question, and — critically — when their *combination* has behavior that isn't obvious from reading each object in isolation (an interaction effect, an ordering dependency, a precedence rule). If a set of rules is simply listed together with no interaction behavior of its own, they don't need a Model — reference them individually from the owning Capability document instead.

---

## Required Sections

```
# Knowledge Model: <Model Name>

**Model ID:** <STABLE-KEBAB-ID, e.g. SF-TAX-MODEL>
**Domain:** <e.g. Study Fund>
**Version X.Y — [Draft | Reviewed | Approved/Ratified]**

**Author:** [who drafted this]
**Approved by (Product Owner):** Roy — [date, or "(pending)"]
```

**1. Model ID & Name** — a stable, referenceable identifier (e.g. `SF-TAX-MODEL`).

**2. Purpose** — the real-world question this composed model answers, end to end, in plain language.

**3. Composition** — a table: `Rule ID | Role in this model`. Every row must name an existing Knowledge Object under `docs/knowledge/<domain>/`. This section is an index, not a restatement — it says *what part each rule plays*, not what the rule says.

**4. Composed Model** — the assembled formula, decision tree, or ordered procedure, built strictly by citing the constituent objects' Mathematical Model sections (`SF-VESTING-EXEMPTION §5`, etc.) rather than reproducing them. This is the one place the *combination* logic may be written out in full.

**5. Interaction & Edge Cases** — behavior at the boundaries between constituent rules: what happens when two rules could both apply, when one rule's precondition changes what another rule means, or when a higher-accuracy data source (e.g. a PDF-verified tier breakdown) supersedes a lower-accuracy one. Each interaction is graded with its own Evidence level and Confidence rating — it is a distinct claim from any single constituent rule, and must not be assumed to inherit "High" confidence just because each constituent alone is well-established.

**6. Consuming Views** — same convention as `KNOWLEDGE_OBJECT_TEMPLATE.md` §7: every place this composed model appears is a reference or a Generated View (see `DERIVED_VIEWS.md`), never an independent restatement.

**7. Validation** — how the composed model's correctness (not just each constituent rule's correctness) is verified today.

**8. Simulation Assumptions** (if applicable) — the user-adjustable, forward-looking parameters used when this model is projected into the future (e.g. timeline, investment-return, inflation, withdrawal-percentage sliders). These are distinct from any constituent Knowledge Object's Model Assumptions (permanent, definitional simplifications) — see `GOOSE_KNOWLEDGE_ARCHITECTURE.md` for the distinction. This is the default home for Simulation Assumptions precisely because a simulation typically projects a composed model, not one isolated rule.

**9. Confidence** — an aggregate rating for the model as a whole. This may be lower than any single constituent Knowledge Object's own Confidence rating — a well-established rule combined with another well-established rule can still have an untested or contested interaction.

**10. Open Questions for Roy** — anything about the composition or its interactions that requires Roy's domain knowledge or a legal/regulatory judgment call, distinct from open questions already recorded on an individual constituent object.

---

## Authoring Notes

- If drafting this Model surfaces a fact about a constituent rule that its own Knowledge Object doesn't yet state, fix the object first — do not patch the gap here.
- The Interaction & Edge Cases section is usually where a real, previously-undetected defect is found (rules that are individually correct but combine incorrectly). Treat a finding here with the same rigor as a Review document's Risk entry (`REVIEW_TEMPLATE.md`).

---

## Validation Checklist (apply before publishing or approving a Knowledge Model)

- [ ] Every row in §3 Composition names an existing Knowledge Object — no forward reference to a rule that doesn't exist yet.
- [ ] §4 Composed Model contains no rule wording that isn't a citation into a constituent object.
- [ ] §5 Interaction & Edge Cases has been evaluated for every pair of constituents that could plausibly interact, not only the ones already known to.
- [ ] §9 Confidence is assessed independently for the model as a whole, not copied from the highest (or lowest) constituent rating.
- [ ] The document is registered under `docs/knowledge/<domain>/` and named in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3's layer table.

---

*This template is itself a Foundation artifact. Changes to its structure should go through the same review as changes to `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md`. For the philosophy behind this tier, see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md`.*
