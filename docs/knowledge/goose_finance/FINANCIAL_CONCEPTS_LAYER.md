# Financial Concepts Layer

*Goose Financial — Domain Architecture*

*Version 1.0 — Draft, pending Product Owner ratification per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8*

**Author:** Claude Code
**Reviewed by:** *(pending — Chief Architect review not yet performed)*
**Product Owner:** Roy

---

## 1. Purpose

This document proposes a candidate Goose Financial architectural model — not yet ratified (see the version header) — for the separation between **Financial Reality**, **Canonical Facts**, **Legal Interpretation**, **Financial Concepts**, and **User Views**. Once reviewed and ratified per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8, it is intended to stand as a permanent Goose Financial architectural principle; until then it is a proposal open to correction, not settled doctrine. It exists so that this separation — reached through direct evidence from this repository's own investigations, not asserted from theory — does not have to be rediscovered by a future session reading `app.js`'s bucket fields and assuming they are the ontology.

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
      Scenario; reproducible from those inputs — a specific computed result may be cached or
      persisted for audit and history, but that persisted copy never becomes a canonical
      source of truth in its own right)
User Views
   (the same Financial Concept, rendered at the consumption level the person chose — Simple answer,
    Financial explanation, Concept explanation, or Deep knowledge exploration — see §7)
```

Each arrow is a derivation, not a copy. A layer never stores a shortcut past the layer above it — a Financial Concept is not permitted to exist as a stored field with no traceable Canonical-Facts-plus-Legal-Interpretation origin, per the Constitution's Reality First and Every Number Has Provenance principles (`GOOSE_CONSTITUTION.md`, Core Principles 1 and 3).

This does not forbid storing a Financial Concept's result. A derived interpretation or scenario result may be cached, materialized, snapshotted, or stored for audit and history, provided the stored record retains its provenance: the canonical inputs it was computed from, the evidence references behind those inputs, the applicable rule/version, the person state, the scenario, the calculation date, and its confidence/status. What §3's "no shortcut" rule forbids is narrower and specific: a persisted derived output silently becoming the canonical source of truth — read back later as though it were itself a Canonical Fact, detached from the inputs and rule version that produced it.

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

## 6. Classification Principle: a familiar term is not a Canonical Fact by default

The following named financial concepts are currently in active use in this codebase's domain vocabulary:

- Qualifying Pension (קצבה מזכה)
- Recognized Pension (קצבה מוכרת)
- Capital Exempt (הון פטור / כספים הוניים)
- New Account (חשבון חדש)
- Pension Sequence (רצף קצבה)
- Severance Sequence (רצף פיצויים)

A familiar financial term must not be assumed to be a canonical stored fact merely because institutions, professionals, or this codebase already use it as a named concept. Each concept above must be classified individually, based on evidence, as one of:

- **Canonical Fact** — a Goose-held fact with its own evidence and confidence, per `GOOSE_CORE_BOUNDARY.md`'s Reality/Evidence/Knowledge.
- **Legal or Operational Status** — a status attached to an account, product, or person by law or provider process (e.g. a container status, an elected sequence); may be closer to a Canonical Fact than to a derived Concept.
- **Derived Interpretation** — produced by combining Canonical Facts and Legal Interpretation; not itself a first-class stored fact.
- **Scenario Result** — meaningful only once a requested scenario is supplied.
- **User View** — the concept rendered for a person at a chosen consumption level (§7); a presentation, not a fact.

A concept may occupy more than one role depending on context — e.g. a status that is a Canonical Fact at the account level but whose payout consequence is a Derived Interpretation — but each role a concept occupies must be stated explicitly and traced to its own evidence, not assumed from the concept's familiarity or borrowed from another concept's classification.

**Capital Exempt — the one concept currently classified with strong evidence:** `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` Findings 1–4 establish Capital Exempt as a **Derived Interpretation / Scenario Result**, not a Canonical Fact and not an independent stored money bucket:

1. The current Goose `capital_exempt` field is "not supported by Circular 2/2013 as a real third source-of-money bucket. No passage in the circular describes a standing fund balance matching Goose's `buckets.capital_exempt.balance_k`."
2. The circular's own term `ההון הפטור` is "a calculation concept for the capitalized pension-exemption framework... not a current fund balance and not a contribution category."
3. Roy's intended product concept "remains valid, but only reframed as a derived, non-additive scenario based on recognized-pension (`recognized_annuity`) balance."
4. That derived value "is not currently liquid... must not be added to the recognized-pension balance... must not be persisted or ingested as an independent source-of-money bucket." This is a specific instance of §3's persistence principle: Finding 4 forbids this derived value from silently being merged into the `recognized_annuity` Canonical Fact — it does not forbid recording the derived estimate itself, with its provenance, for audit or history.

This is Evidence Level A within that document (primary circular text, read directly), not a hypothesis. It is currently the only one of the six concepts classified to this evidence level. It illustrates what individual classification looks like; it does not establish the classification of the other five.

**The other five are open, not assumed.** `docs/knowledge/provident_fund/PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A1 lists `חשבון חדש` (New Account) under its "Account" category as a container status, and lists severance/pension sequence elections under "Event record" — both closer, on that document's own account, to a Legal or Operational Status than to a Derived Interpretation. The same document classifies `קצבה מוכרת` and `קצבה מזכה` (Recognized Pension, Qualifying Pension) as "Payout-side tax result," distinct from "Stored principal bucket from day one" — suggestive of Derived Interpretation, but not yet reviewed to Capital Exempt's Evidence Level A. None of these four classifications is settled by this document; each requires its own individual evidence review (§11).

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
- Which classification (§6: Canonical Fact / Legal-or-Operational-Status / Derived Interpretation / Scenario Result / User View) applies to each of Qualifying Pension, Recognized Pension, New Account, Pension Sequence, and Severance Sequence individually? Only Capital Exempt has been reviewed to Evidence Level A (Expedition 2); the other five remain open, including the possibility that some (e.g. New Account, per `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A1's "Account" container-status classification) turn out to be a Legal or Operational Status rather than a Derived Interpretation.
- How should a Financial Concept object's shape (§9) be reconciled with `KNOWLEDGE_OBJECT_TEMPLATE.md`, given the two-item gap identified there — a new template, an extension of the existing one, or a documented decision that Concepts are represented differently from Rules? Not decided here; requires Chief Architect involvement per Governance §8.
- Where should the ratified terminology-mapping tables eventually live — inline per Knowledge Object, or as a shared cross-domain reference — once more than one domain (Provident Fund, Study Fund, Pension) has its own mapping?

---

*This document should be read alongside `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` (the Goose General flow this document instantiates for Goose Financial) and `docs/foundation/DECISIONS.md` (the Closed Knowledge mechanism). §4–6 above state two candidate architectural conclusions — terminology sovereignty and concepts-as-interpretations — that remain this document's own content, not yet ratified as Closed Decisions; `DECISIONS.md` §8 explains the ratification step still required before they would be logged there as `DEC-001`, `DEC-002`, etc.*
