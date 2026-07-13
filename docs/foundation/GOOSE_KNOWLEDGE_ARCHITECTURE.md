# Knowledge Architecture

*Goose Foundation — Artifact 005*

*Version 1.0 — Draft, pending Chief Architect ratification*

**Author:** Claude Code
**Reviewed by:** *(pending — Chief Architect review not yet performed)*
**Product Owner:** Roy

---

## 1. Purpose

This document defines what Canonical Knowledge is in Goose, how it relates to documentation, and why documentation is treated as a generated representation of it rather than a source in its own right. It is philosophy and architecture, not process: it does not say who approves a change or which lifecycle state a document is in — that is `GOOSE_DOCUMENTATION_GOVERNANCE.md`, which states the governance consequences of the concepts defined here (see its §3, §4, §6, §8, §9, §12). It does not redefine what Goose is (`GOOSE_CONSTITUTION.md`) or what belongs in Goose Core (`GOOSE_CORE_BOUNDARY.md`) — it applies both to the specific problem of how business knowledge is captured and represented.

This document is domain-independent, at the Goose General layer: everything defined here must hold for Study Fund exactly as it must hold for a future Pension, Insurance, or non-financial Goose domain — the same test `GOOSE_CORE_BOUNDARY.md` applies to its own Core concepts.

It was introduced by the Knowledge Architecture Foundation milestone, in response to a concrete, on-the-record failure: the Study Fund vesting-exemption tax rule is independently stated in four places that disagree with each other (see `GOOSE_DOCUMENTATION_GOVERNANCE.md` §13 for the full account). This document is the structural answer to that failure — it does not itself resolve the conflict; that is deferred to a future Study Fund Tax Model migration milestone.

---

## 2. Reality → Evidence → Knowledge → Documentation Views

Goose Core (`GOOSE_CORE_BOUNDARY.md`) already establishes Reality, Evidence, and Knowledge as permanent Core concepts. Knowledge Architecture applies that same flow to how Goose's own business rules — tax law, eligibility conditions, formulas — are captured and represented:

```
Reality
  ↓  (the actual law, regulation, or mathematical fact)
Evidence
  ↓  (what grounds our claim about that reality — a statute, a document, a verified read of the code)
Knowledge
  ↓  (Reality + Evidence, held with an explicit degree of confidence — a Canonical Knowledge Object)
Documentation Views
     (developer excerpts, human guides, tooltips, FAQs, AI prompts, QA checklists — every representation
      a person or system actually reads, each *generated from* Knowledge rather than independently authored)
```

Documentation must be a generated view, not a source, because a source that exists in more than one place inevitably drifts. This is not hypothetical: `docs/TaxLogic.md`, `israel_tax_rules.md`, the live behavior of `_sfCalculateTax`/`_sfRecalculate`, and the AI advisor's system prompt each independently state the Study Fund vesting-exemption rule today, and they disagree. Four independent sources for one fact is not four times the documentation — it is one fact with three ways to be wrong. Treating documentation as generated collapses this to one place capable of being wrong, which is the only number of places a rule's truth can be checked and corrected.

---

## 3. Canonical Knowledge Object

A Canonical Knowledge Object is the single, atomic, authoritative statement of one business rule with a legal, regulatory, or mathematical basis. It is the only place that rule's wording may originate. Built from `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`, it lives under `docs/knowledge/<domain>/`.

**Granularity heuristic:** not every fact needs its own Knowledge Object — that would produce more process overhead than value in a codebase this size. Promote a rule to its own Knowledge Object only when it is, or will be, independently stated in two or more places, or when it carries its own distinct statutory/regulatory basis. Otherwise it stays inline in the owning Capability document's Major Components table (`docs/foundation/templates/CAPABILITY_TEMPLATE.md` §4).

---

## 4. Knowledge Model

A Knowledge Model is the composed, coherent statement of a business *model* built from two or more Knowledge Objects — the answer to a real-world question that is only meaningful as their combination. It sits between the module-level Capability document (whole module, including non-rule concerns like UI and data import) and the atomic Knowledge Object (deliberately scoped to one rule):

```
Capability → Knowledge Model → Knowledge Object
```

The motivating example is the Study Fund Tax Model: "how much tax is owed on a Study Fund withdrawal" is not one rule, it is the vesting-exemption rule, the exempt/taxable segment classification, the tax rate, the blended `effectiveTaxCoeff` approximation, and pre-2002/pre-2003 special cases, combined — and the combination has behavior of its own. Whether the vesting exemption still applies once a PDF-verified tier calculation supersedes the XML-only fallback is exactly the kind of interaction question a Knowledge Model exists to answer explicitly, rather than leaving it to be discovered by reading two functions and noticing they disagree.

A Knowledge Model never originates rule wording of its own — every fact it states about an individual rule must already live in that rule's own Knowledge Object. It is warranted only when constituent rules are routinely used together *and* their combination has behavior that isn't obvious from reading each rule alone (an interaction effect, an ordering dependency, a precedence rule). A list of rules with no interaction behavior of its own does not need a Model — reference them individually instead. Built from `docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md`, it lives alongside atomic objects under `docs/knowledge/<domain>/`.

---

## 5. Documentation Views & Knowledge Consumers

A Documentation View is any representation of a Knowledge Object's or Knowledge Model's content produced for an audience — a developer excerpt, a Human Guide, a tooltip, an FAQ entry, an AI system-prompt fragment, a QA checklist item, an architecture-doc excerpt, a product-documentation excerpt, or a generated rulebook such as `israel_tax_rules.md`. A view either references a Knowledge Object or Model by ID, or copies from a specific, named section of it — never inventing its own wording — under the provenance convention defined in `docs/foundation/templates/DERIVED_VIEWS.md`.

A Knowledge Consumer is who or what a Documentation View is ultimately produced for: Developer, User, AI, QA, Architecture, Product. Naming consumers explicitly, not only view types, is what exposed a real gap during this milestone's own review — the first draft of `DERIVED_VIEWS.md` had no view type serving the Architecture or Product consumer at all. The concrete table of consumers, what each needs, and which view type serves them lives in `docs/foundation/templates/DERIVED_VIEWS.md` — this document establishes Knowledge Consumer as a first-class concept; that document holds the working table.

---

## 6. Model Assumptions vs. Simulation Assumptions

These are two different concepts and must never be recorded in the same place:

**Model Assumptions** are permanent, definitional simplifications — what a rule deliberately does not model, and where it knowingly diverges from a stricter legal reading. They are not user-adjustable. They are part of what the rule *means*, fixed regardless of who is using it or when. They belong in a Knowledge Object's own §4.

**Simulation Assumptions** are user-adjustable, forward-looking projection parameters — investment return, inflation, timeline, withdrawal percentage — used when a rule or composed model is projected into the future. They are inputs a person can change and see the effect of, per the Constitution's Design Philosophy: *"Make assumptions visible and editable. Whenever Goose projects into the future, the assumptions driving that projection must be surfaced... A projection is a tool for thinking, not a prediction."* (`GOOSE_CONSTITUTION.md`). Because a simulation typically projects a *composed* model rather than one isolated rule (e.g. the Study Fund withdrawal simulation's timeline/return/inflation sliders act on the whole Tax Model, not on the vesting-exemption rule alone), Simulation Assumptions default to living in the composing Knowledge Model's §8, not duplicated across every constituent Knowledge Object.

Conflating the two risks exactly the failure the Constitution's principle exists to prevent: a person mistaking an adjustable slider default for a fixed part of a tax rule, or a genuine legal simplification for something they are free to change.

---

## 7. No Generation Tooling

This repository has no build step — a single `app.js`/`server.js`, no build system. Nothing in this Knowledge Architecture proposes one. Generation from Canonical Knowledge to Documentation Views is **manual-but-disciplined**: a human or AI copies content under the provenance marker defined in `docs/foundation/templates/DERIVED_VIEWS.md`, and the Documentation Completion Rule and SSOT Rules in `GOOSE_DOCUMENTATION_GOVERNANCE.md` (§9, §4) are what catch a violation — not an automated check. This is a known limitation, not an oversight; it is logged as such in that document's §13.

---

## 8. Relationship to Goose Core Concepts

A Knowledge Object's Confidence section and a Knowledge Model's aggregate Confidence section both operationalize `GOOSE_CORE_BOUNDARY.md`'s own definition of Knowledge: *"the Core's current understanding of what is true — held with a degree of confidence that reflects the quality of the underlying evidence... not binary... comes in degrees."* This document does not redefine that Core concept; it applies it concretely to how a documented business rule states its own degree of confidence, and distinguishes that from Evidence-level grading (which grades citation quality, not business-truth confidence).

---

*This document should be read alongside `GOOSE_CORE_BOUNDARY.md` (what Goose Core is) and `GOOSE_DOCUMENTATION_GOVERNANCE.md` (how documents, including Knowledge Objects and Knowledge Models, are owned, reviewed, and approved). It defines what Canonical Knowledge is; it does not govern the process around it.*
