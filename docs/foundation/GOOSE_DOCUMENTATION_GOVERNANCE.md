# Goose Documentation Governance

*Goose Foundation — Artifact 003*

*Version 1.0 — Draft, pending Chief Architect ratification*

**Author:** Claude Code
**Reviewed by:** *(pending — Chief Architect review not yet performed)*
**Product Owner:** Roy

---

## 1. Purpose

This document is the Foundation governance document for how Goose documentation itself is created, owned, reviewed, and kept coherent across all layers of the Goose architecture. It is one part of the evolving Goose governance system. Additional governance components will be introduced through future approved milestones (§10).

It governs documentation. It does not govern architecture or code. It does not redefine what Goose is (that is `GOOSE_CONSTITUTION.md`), what belongs in Goose Core (that is `GOOSE_CORE_BOUNDARY.md`), or what is currently prioritized (that will be `CURRENT_DIRECTION.md` — see §10). Where this document needs to say something about Goose's identity or architecture, it references those documents rather than restating them.

This is the first governance artifact in the Goose Documentation System. It establishes Documentation Governance only. Boot protocol, Decision Log, Current Direction, and the RFC workflow are named in §10 as future components of the same system — not designed here.

---

## 2. Documentation Philosophy

Documentation in Goose is not decoration. It is the system's memory — the record of what was decided, why, and what remains true as the system evolves. A codebase without documentation forces every reader to rediscover intent from scratch; a codebase with the wrong documentation is worse, because it actively misleads. Goose documentation is held to a higher bar than "exists": it must be accurate to current reality.

Three commitments follow from this:

- **Every living document reflects current reality**, unless it is explicitly marked historical or frozen (§5). A reader must never have to guess whether a document is still true.
- **One document, one clear scope of ownership.** A document that tries to describe two things at once becomes impossible to keep accurate, because it can go stale in one dimension while looking current in the other.
- **Silence is preferred over staleness dressed as truth.** If a document's content is known to be out of date, that must be stated in the document itself (see §11 for a live example), not left for a reader to discover on their own.

---

## 3. Documentation Hierarchy

Goose documentation is organized into three layers, matching the approved Goose architecture. The relationship between them is a flow of scope and application — principles flow down, evidence and discoveries flow back up into review — not a rigid inheritance chain and not three separate products.

```
Goose General
    ↓
Goose Financial
    ↓
Roy Reality Lab
```

**Goose General** — the domain-independent platform. Defines how Goose produces Truth, Evidence, Knowledge, Trust, and Human Understanding, regardless of domain. Must never be defined as a financial product; a future Goose Medical or Goose Legal would instantiate this layer exactly as Goose Financial does.

**Goose Financial** — the first domain implementation of Goose General. Applies the universal Goose principles to financial reality: assets, pensions, tax, retirement, cash flow, projections, scenarios, cross-asset relationships, and their evidence flows. This repository *is* Goose Financial.

**Roy Reality Lab** — Roy's real working, research, experimentation, and validation environment for Goose Financial. It uses Roy's real data (Mislaka XML, annual PDFs, manually created assets, the Excel "Real Data" workflow) for real-world QA, UX experiments, proof-of-concept work, and discovery. It is not a third independent product and not a universal Goose layer. It may surface facts and generate proposals, but it does not redefine Goose General or Goose Financial without an approved decision.

### Current documents mapped to layers

| Layer | Documents |
|---|---|
| Goose General | `GOOSE_CONSTITUTION.md`, `GOOSE_CORE_BOUNDARY.md`, `GOOSE_DOCUMENTATION_GOVERNANCE.md` (this document) |
| Goose Financial | `CLAUDE.md`, and all module/logic documents under `docs/`: `events_module.md`, `pension_logic.md`, `provident_funds_logic.md`, `sliders_module.md`, `system_architecture.md`, `T190_Tax_Rules.md`, `TaxLogic.md`, `study_fund_input_status_contract.md`, `study_fund_input_guide_human.md` |
| Roy Reality Lab | `GOOSE_EXPEDITION_1_ASSESSMENT.md` — an evidence-graded audit of this repository's real code and data. It is classified here, not as Goose Financial, because it records repository *truth* discovered through investigation, not product policy or domain rules. No other Roy Reality Lab documents exist yet; this is a known gap, left for a future milestone rather than filled in speculatively here. |

### Current Direction and Documentation Governance are complementary

Documentation Governance describes *how* documents are structured, owned, and reviewed. It does not describe *what is currently prioritized* in any layer. That is the role of `CURRENT_DIRECTION.md`, a future governance component (§10). The two are complementary, not hierarchical: Current Direction governs what is currently prioritized in each layer; Documentation Governance governs how durable knowledge is managed. This document must never be read as establishing priority, only process — and Current Direction, once it exists, must never be read as redefining how documents are structured, owned, or reviewed.

---

## 4. SSOT Rules

- Every topic has exactly one owning document. If a second document needs to touch the same topic, it references the owning document — it does not restate the rule in its own words.
- Lower layers reference upper layers, never the reverse in substance. `GOOSE_CORE_BOUNDARY.md` may reference this document; this document does not redefine what Goose Core is.
- When an applied, lower-layer rule appears to conflict with an upper-layer principle, the conflict is escalated for review — it is never silently resolved by picking one side. §11 is a live example: a known conflict, logged rather than quietly patched over.
- A cross-reference must name the actual file it points to. A reference to a document that does not yet exist must say so explicitly (as this document does for `CURRENT_DIRECTION.md`, `DECISIONS.md`, and `GOOSE_BOOT.md` in §10).

---

## 5. Documentation Lifecycle

Every Goose document moves through the same lifecycle:

**Draft** → **Reviewed** → **Approved / Ratified** → **Living** (the active SSOT for its topic) → **Historical / Frozen** (superseded, but preserved for audit — never deleted or silently rewritten).

An **Approved** document is not edited in place when its content materially changes. The version header is bumped instead (mirroring `GOOSE_CONSTITUTION.md`'s "Version 1.0 — Ratified" and `GOOSE_CORE_BOUNDARY.md`'s "Version 1.1"), so that the history of what was true, and when, remains reconstructable.

A document becomes **Historical / Frozen** when it is explicitly superseded but retained as an audit trail. `GOOSE_EXPEDITION_1_ASSESSMENT.md` is the standing example — it is not to be edited to reflect new findings; a new assessment document would be created instead.

---

## 6. Human Documentation vs. Builder Documentation

Goose documentation splits into two audiences, and every document should be clearly one or the other:

**Builder documentation** is written for AI collaborators and developers. It describes system contracts, implementation constraints, and precise technical behavior. It may be written in English or mixed Hebrew/English and favors precision over accessibility.

**Human documentation** is written for Roy (or any future end user) in plain language, in Hebrew, describing what a feature does and how to use it — without requiring the reader to understand the underlying implementation.

The existing pair `study_fund_input_status_contract.md` (Builder — explicitly labeled "System / Builder documentation. Not user-facing documentation.") and `study_fund_input_guide_human.md` (Human) is the reference example for this split. Any future feature that warrants both a technical contract and a user-facing explanation should follow this same pairing pattern rather than inventing a new one.

---

## 7. Review Workflow

Goose General documents follow the review byline pattern already established by `GOOSE_EXPEDITION_1_ASSESSMENT.md`:

- **Author** — who produced the document.
- **Reviewed by** — the Chief Architect (architectural/technical review).
- **Product Owner** — Roy (reality and priority authority).

This three-line header is the standard for any document operating at the Goose General layer. Goose Financial documents may use a lighter version of the same pattern where a full architectural review is not warranted (e.g. a module logic doc reviewed only by the Product Owner).

---

## 8. Approval Workflow

- **Goose General** documents require both Product Owner (Roy) approval and Chief Architect approval before moving from Reviewed to Approved/Ratified — changes at this layer affect every future domain, not just Goose Financial.
- **Goose Financial** documents require Product Owner approval; Chief Architect approval is additionally required when the change is architectural (affects data model, module boundaries, or cross-cutting contracts) rather than purely domain content.
- **Roy Reality Lab** artifacts require no formal approval to produce — they are research, experimentation, and discovery by nature. However, any proposal derived from a Reality Lab artifact that would change a Goose General or Goose Financial document must go through that target layer's approval workflow before it takes effect. A Reality Lab finding does not become policy by itself.

---

## 9. Documentation Completion Rule

A documentation task is complete only when all of the following hold:

1. The document lives at the correct hierarchy layer (§3).
2. It contains no content duplicated from a document at another layer — only references.
3. It carries the header metadata required for its layer (version, status, and — for Goose General — the reviewer byline from §7).
4. Every cross-reference in it resolves to a real, existing file.
5. It has been explicitly acknowledged per the Approval Workflow (§8) appropriate to its layer.

A document that is written but not yet acknowledged per §8 remains in **Draft** or **Reviewed** status — it is not to be described as complete or as the SSOT for its topic until approved.

---

## 10. Deferred Governance Milestones (referenced only)

The following are approved future milestones of the Goose Documentation System, deferred rather than designed here — not open questions, but components already accepted as part of the system's direction:

- **`GOOSE_BOOT.md`** — a future session-initialization protocol.
- **`DECISIONS.md`** — a future decision log recording architectural and product decisions over time.
- **`CURRENT_DIRECTION.md`** — a future document setting the operational compass and priorities for each layer. As stated in §3, it is complementary to this document, not superior to it: it governs *what matters now*, while this document governs *how documentation is structured and reviewed*.
- **RFC workflow** — a future proposal process for changes to Goose Core, tying into the "Extension Rules" already defined in `GOOSE_CORE_BOUNDARY.md`.

---

## 11. Known Documentation Debt

`GOOSE_CONSTITUTION.md` currently defines Goose in inherently financial terms throughout — its "Why Goose Exists" section and its examples are all drawn from Israeli pension and tax reality. This was accurate when Goose had no layered architecture. It is no longer accurate: under the approved identity (Goose General → Goose Financial → Roy Reality Lab), Goose General must never be defined as a financial product — that framing now belongs to Goose Financial.

This is recorded here explicitly, on the record, rather than left for a reader to notice on their own (per §2's philosophy that staleness must be stated, not silently preserved). Reconciling `GOOSE_CONSTITUTION.md`'s framing with this identity is a known future revision. It is out of scope for this milestone, which is documentation governance only.

---

*This document should be read alongside `GOOSE_CONSTITUTION.md` and `GOOSE_CORE_BOUNDARY.md`. It governs how Goose documentation is managed — it does not define what Goose is or what belongs in its Core.*
