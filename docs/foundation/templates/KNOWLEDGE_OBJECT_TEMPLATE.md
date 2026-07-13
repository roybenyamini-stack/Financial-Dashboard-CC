# Knowledge Object — Template

*Companion template for atomic Canonical Knowledge (`docs/knowledge/**/`)*

*Version 1.0*

---

## What a Knowledge Object Is

A Knowledge Object is the single, atomic, canonical statement of **one** business rule with a legal, regulatory, or mathematical basis — one tax rule, one eligibility condition, one formula. It is not a module description (that is `CAPABILITY_TEMPLATE.md`) and not a review (that is `REVIEW_TEMPLATE.md`). It exists so that a rule is written exactly once, and every other place that needs to state it — a reference doc, a tooltip, an AI prompt, a user-facing guide — either points at it or copies from its Explainability section under an explicit provenance marker (see `DERIVED_VIEWS.md`). It never contains a second, independently-worded version of the same rule.

**When a rule warrants its own Knowledge Object** (per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §12): it is, or will be, independently stated in 2+ places, or it carries its own distinct statutory/regulatory basis. Otherwise, keep it inline in the owning Capability document's Major Components table — a one-off internal detail does not need this overhead.

**Deviation from the Builder/Human twin-doc pattern, by design:** `GOOSE_DOCUMENTATION_GOVERNANCE.md` §6 pairs a Builder document with a separate Human document (e.g. `study_fund_input_status_contract.md` + `study_fund_input_guide_human.md`). A Knowledge Object is small enough that splitting it into two files would be pure overhead for what may be a single paragraph of substance — so it holds **both** the Builder and Human statements of the same fact in one file (§2 below). This is a deliberate, ratified exception to §6 for this granularity only; it does not change the twin-doc pattern for Capability/Review or any other document type.

---

## Who Authors Each Section

Roy is the Product Owner, not a developer. The template divides authorship accordingly:

- **Roy owns:** Reality (§2), Confidence (§9), Open Questions (§10). He states what is legally/factually true in his own understanding, and how sure he is.
- **AI/developer drafts, Roy approves:** Evidence (§3), Model Assumptions (§4), Mathematical Model (§5), Implementation (§6), Consuming Views (§7), Validation (§8) — drafted *from* Roy's Reality statement and existing repository evidence, then presented back to Roy in plain language for explicit approval. These sections are never invented independently of what Roy has stated in §2.

---

## Required Sections

```
# Knowledge Object: <Rule Name>

**Rule ID:** <STABLE-KEBAB-ID, e.g. SF-VESTING-EXEMPTION>
**Domain:** <e.g. Study Fund>
**Version X.Y — [Draft | Reviewed | Approved/Ratified]**

**Author:** [who drafted this]
**Approved by (Product Owner):** Roy — [date, or "(pending)"]
```

**1. Rule ID & Name** — a stable, referenceable identifier (e.g. `SF-VESTING-EXEMPTION`). This ID, not prose, is what every other document cites.

**2. Reality** — the real-world fact or rule being modeled, in plain language, in both:
- *Builder statement* (English) — precise enough for implementation.
- *Human statement* (Hebrew) — plain language, no implementation knowledge assumed.

Both describe the same fact. If they ever appear to diverge, that is itself a defect in this Knowledge Object, to be resolved here — not a signal to fork into two documents.

**3. Evidence** — every claim graded A/B/C, per the scale established in `docs/foundation/GOOSE_EXPEDITION_1_ASSESSMENT.md`:
- **Level A** — verified directly in the session that wrote it (statute text read, `file:line` inspected).
- **Level B** — supported by another project document treated as its own source of truth, not independently re-derived.
- **Level C** — reported by an earlier exploration pass, not re-verified here.

**4. Model Assumptions** — permanent, definitional simplifications: what this rule deliberately does *not* model, and where it is known to diverge from a stricter legal reading, and why. These are not user-adjustable — they are part of what the rule *means*, fixed regardless of who is using it or when.

**Model Assumptions are not Simulation Assumptions.** Simulation Assumptions are user-adjustable, forward-looking projection parameters (e.g. investment-return, inflation, timeline, withdrawal-percentage sliders) used when this rule's effect is projected into the future — they are inputs a person can change and see the effect of, per the Constitution's "make assumptions visible and editable" principle, not simplifications baked into the rule's definition. Conflating the two risks a person mistaking an adjustable slider default for a fixed part of the rule, or a genuine legal simplification for something they're free to change. Do **not** record Simulation Assumptions in this section. A rule that is projected as part of a composed model should have its Simulation Assumptions recorded once, in that model's `KNOWLEDGE_MODEL_TEMPLATE.md` §8 — not duplicated per constituent object. Only if this rule is genuinely simulated in isolation (never composed with others) should it carry its own Simulation Assumptions sub-section here, and even then, name it explicitly as such rather than folding it into Model Assumptions. See `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` for the full distinction.

**5. Mathematical Model** — the one authoritative formula or pseudocode for this rule, version-tagged. This is the only place this formula may be written out in full; every other document referencing it must cite this section rather than restate the formula.

**6. Implementation** — `file:line` pointer(s) to where this rule is actually coded. This is the single link between this document and the running application; treat any code change touching this range as a trigger to re-review this Knowledge Object (see Governance §12).

**7. Consuming Views** — an explicit inventory of every place this rule currently appears or will appear (a doc, a UI string, an AI prompt, a config), each entry marked as either a **Reference** (points at this Rule ID, states no content of its own) or a **Generated View** (copies from §5/§9 under the provenance convention in `DERIVED_VIEWS.md`). No entry may be "independent restatement" — if one is found, it is a defect to fix, not a valid state to record.

**8. Validation** — how correctness is currently verified (tests, integrity gates, manual review, or explicitly "none yet").

**9. Explainability** — the one canonical plain-language explanation of this rule. This is the text every tooltip, FAQ entry, and AI system-prompt fragment is allowed to copy from (see `DERIVED_VIEWS.md`) — never their own independent wording.

**10. Confidence** — High / Medium / Low, with rationale. This reflects how well-established the *business truth* of the rule is (per `docs/foundation/GOOSE_CORE_BOUNDARY.md`'s definition of Knowledge as "held with a degree of confidence that reflects the quality of the underlying evidence") — distinct from §3's Evidence grading, which grades citation quality, not business-truth confidence.

**11. Open Questions for Roy** — anything that cannot be resolved by reading the repository further and requires Roy's domain knowledge or a legal/regulatory judgment call.

---

## Validation Checklist (apply before publishing or approving a Knowledge Object)

- [ ] §2's Builder and Human statements describe the same fact, not two.
- [ ] §4 Model Assumptions contains no user-adjustable, forward-looking projection parameter — those belong in the composing Knowledge Model's Simulation Assumptions section instead (or, rarely, a clearly-labeled Simulation Assumptions sub-section here if this rule is never composed with others).
- [ ] §5 (Mathematical Model) contains the *only* full statement of the formula anywhere in the repository — every other mention is a Reference or Generated View per §7.
- [ ] §7 accounts for every place this rule is known to currently appear (grep the repository for the rule's key terms if unsure).
- [ ] §10's Confidence rating is Roy's own assessment, not inferred by the drafting AI/developer on his behalf.
- [ ] The document is registered under `docs/knowledge/<domain>/` and named in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3's layer table.
- [ ] Approval follows `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8: ordinary rule-content changes need Product Owner approval only; Chief Architect approval is required only if this template's own structure is being changed.

---

*This template is itself a Foundation artifact. Changes to its structure should go through the same review as changes to `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md`.*
