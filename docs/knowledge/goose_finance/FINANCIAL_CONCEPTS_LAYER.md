# Financial Concepts Layer

*Goose Financial — Domain Architecture*

*Version 1.0 — Draft, pending Product Owner ratification per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8*

**Author:** Claude Code
**Reviewed by:** *(pending — Chief Architect review not yet performed)*
**Product Owner:** Roy

---

## 1. Purpose

This document states, as a permanent Goose Financial architectural principle, the separation between **Financial Reality**, **Canonical Facts**, **Legal Interpretation**, **Financial Concepts**, and **User Views**. It exists so that this separation — reached through direct evidence from this repository's own investigations, not asserted from theory — does not have to be rediscovered by a future session reading `app.js`'s bucket fields and assuming they are the ontology.

It governs how Goose Financial *names and structures* financial concepts. It does not itself state any tax rule, formula, or eligibility condition — that remains the job of individual Knowledge Objects under `docs/knowledge/**`, per `GOOSE_KNOWLEDGE_ARCHITECTURE.md`. This document is the architectural layer those objects will eventually sit inside.

---

## 2. Relationship to Goose General

This document does not redefine Reality, Evidence, or Knowledge — those are Goose Core concepts, defined once in `GOOSE_CORE_BOUNDARY.md`, and the Reality → Evidence → Knowledge → Documentation Views flow is defined once in `GOOSE_KNOWLEDGE_ARCHITECTURE.md` §2. This document applies that same flow specifically to Goose Financial's domain concepts — named financial ideas like "Qualifying Pension" or "Recognized Pension" — which is a narrower and more specific case than the general flow those two documents already establish.

Where this document's five layers (§3) and the general Reality → Evidence → Knowledge flow appear to say similar things, that is intentional: this is the financial-domain instantiation, not a competing model.

---

## 3. The Five Layers

```
Financial Reality
  ↓  (the actual state of a person's accounts, contracts, and legal status — what is objectively true,
      independent of how any institution or any Goose field happens to label it)
Canonical Facts
  ↓  (Goose's own stored representation of that reality: structured fields, held with evidence and a
      degree of confidence, per GOOSE_CORE_BOUNDARY.md's Reality/Evidence/Knowledge — never an
      institution's raw export format adopted verbatim as the canonical shape)
Legal Interpretation
  ↓  (applicable legislation, regulation, and tax rule, applied to Canonical Facts and Person State —
      what the law says a given set of facts currently means)
Financial Concepts
  ↓  (named, human-meaningful ideas — "Qualifying Pension," "Recognized Pension," "Capital Exempt" —
      produced by combining Canonical Facts, Legal Interpretation, Person State, and a requested
      Scenario; never stored as-is, always producible again from its inputs)
User Views
   (the same Financial Concept, rendered at the consumption level the person chose — Simple answer,
    Financial explanation, Concept explanation, or Deep knowledge exploration — see §7)
```

Each arrow is a derivation, not a copy. A layer never stores a shortcut past the layer above it — a Financial Concept is not permitted to exist as a stored field with no traceable Canonical-Facts-plus-Legal-Interpretation origin, per the Constitution's Reality First and Every Number Has Provenance principles (`GOOSE_CONSTITUTION.md`, Core Principles 1 and 3).

---

## 4. Principle: Goose never adopts institutional terminology as canonical

No authority, regulator, clearinghouse, or pension provider's field name, form label, or internal vocabulary is treated as Goose's own canonical model. Institutional terminology is *evidence to be mapped*, not a schema to be inherited.

**Evidence this principle is necessary, not theoretical:**

- `docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §E (Terminology Map) documents that a single legal/administrative reality already carries multiple, non-interchangeable institutional terms in current use — `קצבה מוכרת`, `קצבה מזכה`, `חשבון חדש`, `רצף פיצויים`, `רצף קצבה` — each with its own legal meaning and its own triggering conditions.
- `docs/knowledge/provident_fund/PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A1 independently classifies `קצבה מוכרת` and `קצבה מזכה` as **"Payout-side tax result"**, explicitly distinct from **"Stored principal bucket from day one"** — i.e. even the source-of-truth-adjacent research treats these as computed labels, not raw stored categories.
- `docs/foundation/GOOSE_EXPEDITION_3_PROVIDENT_FUND_CLASSIFICATION_IMPLEMENTATION.md` §A.5 documents that the current codebase itself already has **three disagreeing key-naming conventions** for the same three concepts across one pipeline (snake_case persisted `buckets.*.balance_k`, flat PDF/LLM-extraction keys, and a separate camelCase AI-advisor payload) — a concrete, present-tense illustration of what happens when a system lets externally-sourced vocabulary leak into its own schema instead of mapping it at the boundary.

---

## 5. Principle: Goose maintains its own canonical financial ontology

Goose Financial's own names for its concepts are the only names a Knowledge Object, a stored field, or an AI prompt may treat as ground truth. Every institutional label maps *into* that ontology; the ontology is never redefined *by* an institutional label. This is the financial-domain application of `GOOSE_CORE_BOUNDARY.md`'s Extension Rules: a module (or, here, an external data source) does not get to reshape what Goose already holds as true — new vocabulary is mapped in, not merged in.

The canonical ontology itself — the actual Rule IDs, the actual chosen English/Hebrew canonical names — is **not defined by this document**. This document states that such an ontology must exist and be sovereign; authoring it, concept by concept, is future Knowledge Object work (§7–8).

---

## 6. Financial Concepts are interpretations, not canonical stored facts

The following are named Financial Concepts currently in active use in this codebase's domain vocabulary:

- Qualifying Pension (קצבה מזכה)
- Recognized Pension (קצבה מוכרת)
- Capital Exempt (הון פטור / כספים הוניים)
- New Account (חשבון חדש)
- Pension Sequence (רצף קצבה)
- Severance Sequence (רצף פיצויים)

None of these are Canonical Facts. Each is produced from Canonical Facts, applicable legislation, person state, and (where relevant) a requested scenario — never read off a stored field as-is.

**Direct evidence, not assertion:** `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` is the concrete case that established this for Capital Exempt specifically. Its Findings 1–4:

1. The current Goose `capital_exempt` field is "not supported by Circular 2/2013 as a real third source-of-money bucket. No passage in the circular describes a standing fund balance matching Goose's `buckets.capital_exempt.balance_k`."
2. The circular's own term `ההון הפטור` is "a calculation concept for the capitalized pension-exemption framework... not a current fund balance and not a contribution category."
3. Roy's intended product concept "remains valid, but only reframed as a derived, non-additive scenario based on recognized-pension (`recognized_annuity`) balance."
4. That derived value "is not currently liquid... must not be added to the recognized-pension balance... must not be persisted or ingested as an independent source-of-money bucket."

This is Evidence Level A within that document (primary circular text, read directly), not a hypothesis. It is the strongest currently available proof that at least one of these six concepts is an interpretation rather than a fact — and it is the pattern this document generalizes to the other five, pending their own individual evidence review (§10, Open Questions).

**A structural echo, held at lower confidence:** `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` documents (as an explicit **Hypothesis**, not a conclusion) that the underlying clearinghouse XML itself may be structured as independent classification axes rather than as directly-stored tax buckets. If that hypothesis is later confirmed, it would mean the interpretation step described in this section begins even earlier than Legal Interpretation — at the Canonical Facts layer itself, where multiple raw axis values must already be combined before any bucket-shaped fact exists to interpret. This is flagged as a structural echo, not restated as settled — that document's own confidence labels remain authoritative for its own claims.

---

## 7. Consumption levels

A person may consume a Financial Concept at different depths depending on what they need in the moment. This is the financial-domain application of the Knowledge Consumer / Documentation View pattern already established in `docs/foundation/templates/DERIVED_VIEWS.md` — not a new mechanism, a named set of depths for one consumer (User/Human) walking through one concept:

| Level | What it gives | Nearest existing View type |
|---|---|---|
| **Simple answer** | One number or one short sentence — "how much," "yes/no" | Tooltip |
| **Financial explanation** | What that number means for the person's situation right now, in plain language | Human Guide, FAQ entry |
| **Concept explanation** | The Financial Concept's own definition, its legal basis, and Goose's interpretation of it | A future Financial Concept object's Reality + Explainability (§10) |
| **Deep knowledge exploration** | Full evidence trail, the calculation itself, and how this concept relates to other concepts | A future Financial Concept object in full, per §10 |

Per the Constitution's Complexity Belongs to the System principle (`GOOSE_CONSTITUTION.md`, Core Principle 8), moving between these levels must never require the person to already understand the layer below. Each level is a complete, honest answer at its own depth — not a teaser for the next one.

---

## 8. Terminology mapping is a per-concept, evidence-gated activity

Mapping an institution's vocabulary into Goose's canonical ontology (§5) is not a one-time global table — it is done per concept, grounded in evidence, the same way `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §E already did for the Provident Fund domain. That existing Terminology Map is the working precedent for how this should be done elsewhere; this document does not duplicate it, only points to it.

Different institutions may label the same underlying concept differently (a pension provider's annual report, a clearinghouse XML field, a Tax Authority form, and an insurer's policy statement need not agree on a term for the same legal reality). Where they disagree, that disagreement is itself evidence to record, not a conflict to silently resolve by picking one institution's word as canonical.

---

## 9. Future direction: the Financial Concept as a first-class Knowledge Object

Every Financial Concept named in §6 should eventually become a first-class canonical object, holding:

- **definition** — what the concept is, in plain language;
- **legal meaning** — the statutory/regulatory basis, where one exists;
- **operational meaning** — how it currently behaves in practice (provider reporting, clearinghouse data, form instructions);
- **Goose interpretation** — Goose's own canonical framing, explicitly distinguished from any single institution's label (§5);
- **evidence** — graded per the existing A/B/C scale (`GOOSE_EXPEDITION_1_ASSESSMENT.md`'s Evidence Levels, reused by every Knowledge Object since);
- **calculation** — how the concept is derived from Canonical Facts and Legal Interpretation, where a calculation exists;
- **relationships** — how this concept relates to other Financial Concepts (e.g. Capital Exempt's derivation from Recognized Pension, per Expedition 2 Finding 3);
- **examples** — worked instances grounded in real evidence, not invented figures.

**This is stated as direction, not as a template change made by this document.** `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md` is built around **one rule** with a legal/regulatory/mathematical basis (§1–§11 of that template: Rule ID, Reality, Evidence, Model Assumptions, Mathematical Model, Implementation, Consuming Views, Validation, Explainability, Confidence, Open Questions). A **Financial Concept** is a different shape of thing — closer to a named idea that several rules and facts feed into than to a single rule itself. Two of the eight items above (**Goose interpretation** as distinct from legal meaning, and **relationships** to other concepts) do not currently have an obvious home in the existing template's sections.

Per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8, changing `KNOWLEDGE_OBJECT_TEMPLATE.md`'s own structure requires Chief Architect approval, not just Product Owner approval — so this document deliberately does not propose a new or modified template. That gap is logged as an open question (§11) for a future, explicitly-scoped template-design milestone, not resolved here.

---

## 10. Evidence base

- `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` — primary-source finding that `capital_exempt` is not a real stored bucket (§6 above).
- `docs/foundation/GOOSE_EXPEDITION_3_PROVIDENT_FUND_CLASSIFICATION_IMPLEMENTATION.md` — implementation-reality audit showing three disagreeing key-naming conventions for the same three concepts in the live codebase (§4 above).
- `docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` — the Terminology Map (§4, §8 above) and the broader finding that provident-fund money carries multiple overlapping legal layers, not a small bucket set.
- `docs/knowledge/provident_fund/PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` — independent classification of `קצבה מוכרת`/`קצבה מזכה` as payout-side tax results, not stored principal buckets (§4 above).
- `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` — a lower-confidence, explicitly-labeled Hypothesis about the raw XML layer itself (§6 above).

---

## 11. Open Questions

- What are the actual canonical Rule IDs and canonical English/Hebrew names for the six concepts in §6 — this document names them descriptively, it does not ratify their final canonical form.
- Does the "not a stored fact" finding, currently evidenced only for Capital Exempt (Expedition 2), also hold for Qualifying Pension, Recognized Pension, New Account, Pension Sequence, and Severance Sequence individually, or do some of them behave more like genuine stored legal statuses (e.g. `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A1 lists `חשבון חדש` under "Account" as a container status, which may be closer to a Canonical Fact than a derived Concept)? Not yet individually reviewed.
- How should a Financial Concept object's shape (§9) be reconciled with `KNOWLEDGE_OBJECT_TEMPLATE.md`, given the two-item gap identified there — a new template, an extension of the existing one, or a documented decision that Concepts are represented differently from Rules? Not decided here; requires Chief Architect involvement per Governance §8.
- Where should the ratified terminology-mapping tables eventually live — inline per Knowledge Object, or as a shared cross-domain reference — once more than one domain (Provident Fund, Study Fund, Pension) has its own mapping?

---

*This document should be read alongside `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` (the Goose General flow this document instantiates for Goose Financial) and `docs/foundation/DECISIONS.md` (where the two architectural conclusions this document formalizes — terminology sovereignty and concepts-as-interpretations — are logged as Closed Knowledge; see `DECISIONS.md` DEC-001 and DEC-002).*
