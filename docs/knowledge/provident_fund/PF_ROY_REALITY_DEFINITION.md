# Roy Reality — Provident Fund: Canonical Definition

**Status:** Working canonical definition. Sufficiently stable to guide all future Provident Fund work in Goose. Not an implementation contract, not a persistence design, not a UI design.
**Author:** Claude Code
**Product Owner:** Roy
**Scope:** Defines the canonical financial reality Roy Reality models for Israeli Provident Funds (Kupot Gemel). Does not define XML structure, provider database schema, persistence, calculations, or UI — those are separate concerns handled by separate documents (see §10).

This document is an architecture artifact, not a research log. It states three things, kept explicitly separate throughout: what is **canonical** (established, to be treated as true going forward), what is **evidence** (what currently grounds a canonical statement), and what is **open** (genuinely unresolved — recorded only in `PF_OPEN_QUESTIONS.md`, never speculated on here).

---

## 1. Definition of Roy Reality

No prior document in this repository formally defines the term "Roy Reality" itself in one place — it is used throughout (including as the title of `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md`) without a standing definition. This section states it, as used in this document:

**Roy Reality** is the financial reality that Goose uses as the basis for calculation, simulation, and explanation. It is a canonical model of what is true about a person's financial state — not a copy of any single data source's representation of that state, not a database schema, and not an implementation.

This is distinct from **Roy Reality Lab** (`docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §3), which is Roy's research and experimentation environment for producing and validating Roy Reality — a process, not the model itself.

This statement is scoped to this document's domain (Provident Funds) and does not claim to redefine the term for every future Goose domain; a Goose General-layer restatement, if ever needed, belongs at that layer, not here.

---

## 2. Purpose

Define Roy Reality for Israeli Provident Funds (Kupot Gemel).

This document is **not**:

- XML documentation.
- A provider database schema.
- An implementation design.
- Reverse-engineering notes.

Its purpose is to state the financial reality Goose will model for Provident Funds — the objects, events, and projections that exist, what they mean, and how they relate — so that calculation, simulation, and explanation logic has a stable foundation to build on.

---

## 3. Design Principles

1. **Canonical / Evidence / Open Questions are three distinct categories, never blended.** A canonical statement in §4–§6 is treated as established. An evidence statement in §8 grounds a canonical statement without itself being the model. An open question is recorded only in `PF_OPEN_QUESTIONS.md` — this document does not speculate on unresolved causal or legal questions inline.
2. **Roy Reality models financial reality, not provider internal implementation.** A provider's XML shape, a clearinghouse interface, or an application's current code representation may all be *evidence* for what Roy Reality should model — none of them *is* Roy Reality.
3. **Documentation is a generated view of Canonical Knowledge, not an independent source.** Per `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` §2–§3: a fact belongs in exactly one place. This document references other canonical and evidence documents rather than restating their content — most importantly `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` for the Money Layer concept (§4.2). The same rule applies internally: each concept defined in this document is defined in exactly one section; every other section references it rather than re-explaining it (e.g. §4.2's use of Contribution Event references §5.1 rather than restating what a Contribution Event is).
4. **Missing truth is preferred over false precision.** Where the evidence supports only a correlation or a structural placement, this document states exactly that — it does not round up to a stronger claim than the evidence supports (see §6.1's Retirement View / SUG treatment).
5. **Objects, Events, and Projections are three distinct categories, never blended.** A Canonical Object (§4) is a persisted, structural element of Roy Reality's current financial-state model. A Canonical Event (§5) is an occurrence that creates or extends an object's state — it is not itself a structural entity Roy Reality is required to store. A Canonical Projection (§6) is a purpose-specific view over the underlying financial reality — it may be exposed directly by an evidence source, or produced by a known calculation; this document does not assume which for a given projection, and states that explicitly per projection (§6.1). A Canonical Projection is neither a stored Canonical Object nor a Canonical Event.

---

## 4. Canonical Objects

Persisted, structural elements of Roy Reality's current financial-state model.

### 4.1 Provident Account

A **Provident Account** is the canonical financial container for Provident Fund money.

Grounded in the structural evidence of `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` (the `Mutzar` → `HeshbonOPolisa` container region) and in `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.2's finding that **Account and Money Rights History are not the same entity** — a real transfer (Altshuler → Mor) preserved the money's legal/tax seniority while the account's own joining date restarted. A Provident Account is therefore an administrative and structural identity (institution, account/policy number, status, product type); it does not, by itself, carry the full rights history of the money it holds. That history is carried by the Money Layers it contains (§4.2).

### 4.2 Money Layer

A **Money Layer** is the smallest homogeneous financial unit preserved over time within a Provident Account.

The canonical definition of Money Layer is **not restated here**. `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` is the single owning document for this concept, domain-independent by design. This section adds only the Provident-Fund-specific semantics that document does not itself state:

- **Money Layers survive transfers between providers.** Transfer does not destroy layer identity. `MONEY_LAYER_DEFINITION.md` §5 already establishes that transfer is not an "event" in the Reality-vs-Event sense; this is the Provident-Fund-specific instance of that principle, grounded in `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C item 8 ("Transfer Continuity Lineage") and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §D2/§C1, and directly evidenced by the real Altshuler → Mor transfer in `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.2.
- **A Money Layer's boundary relative to a Contribution Event.** See §5.1 for the Contribution Event's definition — it is not repeated here. A Money Layer's boundary is determined by whether a new Contribution Event's classification dimensions match an existing layer's, grounded in `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §B1's "homogeneous rights-bearing balance segment" reasoning: aggregation is safe only when those dimensions match; where they differ, a distinct layer is required (see `PF_OPEN_QUESTIONS.md` Q1 for what remains unresolved about the exact trigger).
- **The XML exposes Money Layers; it is not the definition of a Money Layer.** Per `MONEY_LAYER_DEFINITION.md` §1 and §3, and consistent with `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md`'s finding that `PerutYitraLeTkufa` is the best-evidenced Clearinghouse representation of a Money Layer — a representation, not the concept itself.

---

## 5. Canonical Events

Occurrences that create or extend a Canonical Object's state. A Canonical Event is not itself a persisted structural entity Roy Reality is required to store in order to represent current financial reality.

### 5.1 Contribution Event

A **Contribution Event** is the canonical **origin event** of a Money Layer: the event by which money enters a Provident Account and is either allocated to a new Money Layer or accumulated into an existing one (§4.2).

The Contribution Event is named as its own canonical concept — distinct from Money Layer — because a Money Layer's identity and a Contribution Event's occurrence are different kinds of fact: one is a present classification of money, the other is a historical event that may have produced or extended it. Grounded in `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.2 (contribution allocation as the point a layer's source/legal-component attribute is created) and in `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md`'s category map (the `Contribution / cohort` row: deposit month, legal reform cohort, employer-period cohort).

**The Contribution Event is explicitly not a canonical object, not a required structural child of Provident Account, and not a prerequisite for representing a Money Layer.** Roy Reality must be able to represent a Money Layer from its current classification and financial state alone, with no dependency on reconstructing or storing contribution history. This mirrors `MONEY_LAYER_DEFINITION.md` §1's own principle — "A Money Layer represents the person's current financial reality. It is not created by a future event" — applied here to the *originating* side: a Money Layer is also not defined by needing its originating event to be known. The Contribution Event explains how a Money Layer came to be; it is not part of what a Money Layer currently is.

This is the single owning definition of Contribution Event in this document; §4.2 references it rather than restating it.

---

## 6. Canonical Projections

A Canonical Projection is a purpose-specific view over the underlying financial reality. It may be exposed directly by an evidence source (e.g. an annual report), or produced by a known calculation — this document does not assume which, and states the distinction explicitly for each projection (§6.1). A Canonical Projection is not stored as Roy Reality's own ground truth; it is neither a Canonical Object nor a Canonical Event. This category exists because a concept can be canonical — a stable, well-defined thing Roy Reality recognizes — without being either a stored object or an occurrence: `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §6 already establishes an adjacent pattern — user-facing results such as Capital, Pension type, and tax treatment are "outputs of event logic, not stored Money Layers." A Canonical Projection generalizes that same principle: a canonical, named view over the underlying financial reality, not itself a Money Layer or an Account.

### 6.1 Retirement View

The **Retirement View** is the canonical retirement-classification projection of a Provident Account's underlying financial reality.

- **The annual report (דוח שנתי) is the canonical evidence source that exposes the Retirement View.** The current Retirement View presentation consists of:
  - **Capital**
  - **Pension**
- **It is a projection of the underlying financial reality**, not a second, independent representation of it.
- **It is not stored as an independent canonical ground-truth object.** Roy Reality does not persist "Retirement View" as its own data alongside Money Layers.
- **Goose does not yet know the complete derivation rule required to reconstruct the Retirement View from Money Layers (§4.2) alone.** The Retirement View is currently known only as something the annual report exposes — not as a calculation Roy Reality can independently perform. This is an existing Known Limitation (§9), not a gap newly introduced or resolved here.
- **The observed SUG correlation (below) remains evidence only and does not close that derivation gap.**

Retirement View is classified as a Canonical Projection, not a Canonical Object, precisely because of the points above: it is a purpose-specific view of the underlying financial reality, currently known only through a particular evidence source, and not itself persisted as ground truth (§6). This mirrors `MONEY_LAYER_DEFINITION.md` §6's adjacent treatment of Capital/Pension as outputs of event/projection logic rather than stored Money Layers — without assuming this document's own derivation mechanism is the same one, or that it is known at all.

**On the XML SUG correlation:** current evidence shows a strong correlation between the XML's `SUG` values and the Annual Report's Retirement View classification — observationally, `SUG-1` co-occurs with Capital and `SUG-2` co-occurs with Pension. This is stated here strictly as an **observed correlation**, not as a canonical or universal mapping, and not as a derivation rule. Roy Reality does not assert "`SUG-1` = Capital" as a rule, and the correlation does not by itself establish how to reconstruct the Retirement View from Money Layers. The rules determining *why* a given Contribution Event or balance becomes one classification or the other are not understood from current evidence and are not speculated on here — see `PF_OPEN_QUESTIONS.md` Q2.

---

## 7. Canonical Relationships

The sole structural containment relationship is:

```
Provident Account
    contains
Money Layers
```

This is the complete containment model. **The Contribution Event is deliberately not part of this containment edge**, and is not a Canonical Object at all (§5). It is modeled as the event that creates or extends a Money Layer:

```
Contribution Event ──(origin event)──> Money Layer
```

— not as a structural child of Provident Account, and not a stored prerequisite for representing a Money Layer's current state.

The Retirement View (§6.1) is a further relationship, of a different kind from containment:

```
Money Layers ──(projected via the annual report)──> Retirement View
```

— a projection, not a containment edge and not a second copy of the Money Layer data. This edge is drawn from the evidence that the annual report exposes the Retirement View (§6.1); it does not assert that Roy Reality currently knows how to derive the Retirement View from Money Layers independently of that report (§9).

Two further relationships hold between the objects/events/projections defined in §4–§6 and the evidence sources in §8:

- **The XML exposes Money Layers.** It is an evidence source describing Money Layers; it is not itself the canonical model of them (§4.2).
- **The annual report exposes the Retirement View as one projection among several possible ones.** This follows `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.4's Projections principle: no single information source describes Provident Fund reality in full — the XML, the detailed annual report, the short annual report, and any other source are each a projection of the same reality, adapted to a purpose. Roy Reality is not any one projection; it is the canonical reality those projections are evidence for.

---

## 8. Evidence

This table maps each canonical statement above to its grounding source and evidence status. Evidence-status labels are carried from the cited source document, not re-graded here.

| Canonical statement (§) | Grounding source | Evidence status (per source) |
|---|---|---|
| Provident Account is the canonical container (§4.1) | `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` §3–§4 | Level A (code) / Verified (one real XML-path observation) |
| Account ≠ Money Rights History (§4.1) | `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.2 | Operationally Supported — real transfer case (Altshuler → Mor) |
| Money Layers survive transfer (§4.2) | `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C item 8; `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §D2, §C1 | Verified (inter-fund transfer) / Strongly Supported |
| Money Layers survive transfer — real case (§4.2) | `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.2 | Operationally Supported — real transfer case |
| Money Layer boundary relative to a Contribution Event (§4.2) | `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §B1 | Strongly Supported |
| XML exposes, does not define, Money Layers (§4.2) | `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §1, §3; `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` §7 | Working canonical definition / High |
| Contribution Event as origin event (§5.1) | `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.2 | Verified (statutory: Regulation 49א, Section 21) |
| Contribution / cohort category (§5.1) | `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A1 | Strongly Supported |
| Retirement View = Capital + Pension (§6.1) | Roy-supplied real annual-report observation (2026-07-25) | Operationally Supported — direct observation, not yet a discovery document |
| Retirement View classified as a Canonical Projection, not a stored object (§6.1) | `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §6 | Working canonical definition — "outputs of event logic, not stored Money Layers" |
| SUG↔Retirement View correlation (§6.1) | Roy-supplied real annual-report observation (2026-07-25); `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.3 (short report's כקצבה / חד פעמית framing) | Operationally Supported — observed correlation only, not a legal/causal source |
| Projections principle (§7) | `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.4 | Flagged in source as one of Expedition 3's most important architectural conclusions |

---

## 9. Known Limitations

- **The SUG ↔ Retirement View causal rule is unknown.** §6.1 states a correlation only. No statute, regulation, or CMA source establishing *why* a Contribution Event or balance is classified one way or the other has been found. See `PF_OPEN_QUESTIONS.md` Q2.
- **Provident Account structural boundaries are partly unresolved.** Whether `Mutzarim` / `HeshbonotOPolisot` are universal wrapper elements or provider-specific is not fully confirmed (`PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` §8, items 1 and 3). This does not affect §4.1's canonical statement (the Provident Account as a container is still correct), but bounds how precisely its structural evidence can currently be cited.
- **The exact Money Layer creation trigger is unknown.** §4.2 states when aggregation is *safe*; it does not state the operational rule a provider actually applies at the moment of a Contribution Event. See `PF_OPEN_QUESTIONS.md` Q1.
- **The official Provident Fund code-book (KOD value dictionary) has not been recovered.** See `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md` and `PF_OPEN_QUESTIONS.md` Q3.

---

## 10. Future Extensions

- **Inheritance** is named, in `MONEY_LAYER_DEFINITION.md` §5, as a possible future event alongside Retirement. It is not modeled here and requires its own future milestone.
- This document does not define, and future work must address separately: implementation, persistence model, retirement/inheritance calculations, tax calculations, or UI presentation (per conclusion 9 of Roy's original brief — Roy Reality models financial reality; it does not reproduce provider internal implementations).
- Reconciling the Retirement View (§6.1) with the current application's three-bucket Amendment-190 code model (`qualifying_annuity` / `recognized_annuity` / `capital_exempt`, documented in `docs/provident_funds_logic.md`) is explicitly **not** performed by this document. They are evidence for two currently un-merged layers of Roy Reality, and reconciling them is a future decision, not assumed here.

---

*This document is the canonical definition for Provident Fund Roy Reality. It references, and does not restate, `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` and the discovery documents cited in §8. Genuinely unresolved questions are tracked exclusively in `docs/knowledge/provident_fund/PF_OPEN_QUESTIONS.md` — this document does not speculate on them.*
