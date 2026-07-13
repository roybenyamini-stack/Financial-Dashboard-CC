# Derived Views — Reference

*Companion reference for Canonical Knowledge Objects (`docs/knowledge/**/`)*

*Version 1.0*

---

This is a reference document, not a fill-in template. It lists the kinds of Documentation Views that may be produced from a Canonical Knowledge Object (`docs/knowledge/**`, see `KNOWLEDGE_OBJECT_TEMPLATE.md`), which of the Knowledge Object's sections each view is allowed to copy from, and the provenance convention that marks a view as derived rather than an independent source.

No build tooling exists in this repository (a single `app.js`/`server.js`, no build step), and none is being introduced by this milestone. "Generated" here means **manual-but-disciplined**: a human or AI copies content from the canonical Knowledge Object into the view, under the provenance marker below, and never originates rule wording inside the view itself.

---

## The Provenance Convention

Any file, or section of a file, that is a Derived View of one or more Knowledge Objects should carry this marker as close as possible to the copied content:

```
<!-- GENERATED VIEW — derived from docs/knowledge/<domain>/<RULE-ID>.md, do not hand-edit rule wording; edit the canonical object and recopy. -->
```

For a non-Markdown consumer (e.g. a JS string literal in `server.js`), use the nearest equivalent code comment directly above the string, naming the same Rule ID and file path.

A file carrying this marker that is edited to change rule wording without first updating the canonical Knowledge Object is a defect — the wording forked. This is caught by discipline and review today (no automated check exists yet); flagging that gap is itself logged in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §12/§13, not solved by this document.

---

## View Types

| View | Copies from | Audience | Example |
|---|---|---|---|
| **Developer excerpt** | §5 Mathematical Model, §6 Implementation | Builder | A short "how this is computed" note inline in a Capability document's Major Components table, referencing the Rule ID instead of restating the formula. |
| **Human Guide** | §2 Reality (Human statement), §9 Explainability | Human (Roy), Hebrew | Follows the existing twin-doc pattern's spirit (`docs/study_fund_input_guide_human.md`) — never copies §5's formula verbatim. |
| **Tooltip** | §9 Explainability (a single sentence or clause of it) | Human, in-app | A short in-UI hint string. |
| **FAQ entry** | §2 Reality (Human statement), §9 Explainability | Human | A question-and-answer pair; the answer is a copy of §9, not a new explanation. |
| **AI system-prompt fragment** | §9 Explainability | AI (Builder-authored, human-facing output) | E.g. the Study Fund advisor's hardcoded phrasing in `server.js` — today an independent restatement; once a Knowledge Object exists for the rule it states, it becomes a Generated View of that object's §9. |
| **QA checklist item** | §8 Validation, the owning Review document's §2 Risks | Builder | A test/manual-check scenario derived from what the Knowledge Object and Review already say is or isn't verified — not a new claim about correctness. |
| **Generated Rulebook** | §5 Mathematical Model, §9 Explainability, across multiple Knowledge Objects | Builder + AI-consumed | E.g. `israel_tax_rules.md`, which `server.js` loads at runtime as AI ground truth. Stays a real, standalone file (its location is a code-path coupling, not a free choice — see `GOOSE_DOCUMENTATION_GOVERNANCE.md` §3), but its rule content becomes assembled from canonical objects rather than independently authored. |
| **Architecture doc excerpt** | Knowledge Model's §3 Composition, §5 Interaction & Edge Cases | Architecture | A note in an architecture-level document about how several rules combine and where their boundaries are — e.g. citing `SF-TAX-MODEL`'s Interaction & Edge Cases rather than re-deriving the interaction independently. |
| **Product Documentation excerpt** | §2 Reality, §10 Confidence, §11 Open Questions (or a Knowledge Model's equivalents) | Product | A product-facing note on what a capability does and how settled/uncertain it currently is — copies the stated Confidence and Open Questions rather than the Product owner forming an independent view of how solid a rule is. |

---

## Knowledge Consumers

A Knowledge Consumer is who or what a Documentation View is ultimately produced for. Naming consumers explicitly, rather than only naming view *types*, makes it possible to check that every consumer Goose is meant to serve actually has a view type feeding it — this table is what surfaced that the original view-type list above was missing an Architecture and a Product row.

| Consumer | What they need from Canonical Knowledge | Served by |
|---|---|---|
| **Developer (Builder)** | Precise implementation detail: Mathematical Model, Implementation citations, Model Assumptions | Developer excerpt |
| **User (Human)** | Plain-language Reality and Explainability — never the formula itself | Human Guide, Tooltip, FAQ entry |
| **AI** | Explainability as ground truth for verification/advisor behavior; Mathematical Model for computation cross-checks | AI system-prompt fragment, Generated Rulebook |
| **QA** | Validation status, Confidence, and — for a composed model — Interaction & Edge Cases | QA checklist item |
| **Architecture** | Composition and Interaction & Edge Cases — how rules and models relate to and depend on each other | Architecture doc excerpt |
| **Product** | Purpose, Confidence, and Open Questions — what a capability does and how settled it is | Product Documentation excerpt |

A single Documentation View may serve more than one consumer (a Human Guide primarily serves User, but a Product owner may also read it); the table states the primary relationship, not an exclusive one.

---

## What Is Never a Derived View

A document like `docs/TaxLogic.md` that states a rule in its own original prose — with its own formula, its own conditions, written independently of any Knowledge Object — is not a Derived View. It is a second SSOT for the same topic, which `GOOSE_DOCUMENTATION_GOVERNANCE.md` §4 already forbids. Once a Knowledge Object exists for a rule such a document states, the document's own text for that rule must be replaced by a reference or a Generated View under the marker above — not left standing alongside the new canonical object.

---

*For what a Knowledge Object is, see `KNOWLEDGE_OBJECT_TEMPLATE.md`. For how this fits Goose's documentation hierarchy and governance, see `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §12.*
