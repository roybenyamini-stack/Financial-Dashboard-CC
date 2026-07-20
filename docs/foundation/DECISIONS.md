# Goose Decisions Log

*Goose Foundation — Artifact 006*

*Version 1.0 — Draft, pending Chief Architect ratification*

**Author:** Claude Code
**Reviewed by:** *(pending — Chief Architect review not yet performed)*
**Product Owner:** Roy

---

## 1. Purpose

This document is the permanent mechanism for **Closed Knowledge** — architectural and product decisions that have already been reached and ratified, and must not be rediscovered by a future session.

It exists because Discovery and Accepted Knowledge are structurally different things and must not share one home:

- **Discovery** (a Roy Reality Lab expedition, a `*_DISCOVERY.md` document, an Open Questions section) is provisional by nature. It carries evidence, hypotheses, and confidence labels, and it is expected to change as more evidence arrives. `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8 already states this explicitly: "Roy Reality Lab artifacts require no formal approval to produce — they are research, experimentation, and discovery by nature."
- **Accepted Knowledge** is a conclusion that has crossed out of that provisional state. It has been reviewed, it has an owner (the Product Owner, per Governance §8), and — critically — a future session must be able to find it and cite it *without redoing the investigation that produced it*.

Without a dedicated place for the second kind, every settled conclusion either rots inside a Discovery document that a future reader has no reason to trust as final, or gets stuffed into `GOOSE_BOOT.md`, which `GOOSE_BOOT.md` itself says it must not become (`GOOSE_BOOT.md`: "It is a loader, not an explanation"). This document is that dedicated place.

This document was not invented for this milestone. It fulfills a component `GOOSE_DOCUMENTATION_GOVERNANCE.md` §10 already named and deferred: *"`DECISIONS.md` — a future decision log recording architectural and product decisions over time."* This milestone activates that deferred component; §9 below records the reasoning for doing it this way rather than another way.

---

## 2. What this document is not

- **Not a Knowledge Object.** A Knowledge Object (`docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`) is the atomic, canonical statement of **one business rule** with a legal, regulatory, or mathematical basis, living under `docs/knowledge/<domain>/`. A Decision entry here may be broader than one rule — an architectural principle, a documentation-structure choice, a scope boundary — and may *point to* a Knowledge Object as part of its evidence, but it is not itself one, and it does not restate rule wording that belongs in one.
- **Not a discovery document.** `GOOSE_EXPEDITION_*.md` files and `docs/knowledge/**/*_DISCOVERY.md` files remain exactly what they are: Roy Reality Lab investigation records, revisable, evidence-graded, not requiring approval to produce. A Decision entry is what gets written *after* a discovery's conclusion is reviewed and ratified — the discovery document itself is never edited to claim that status (per Governance §5's Historical/Frozen rule: a document is not silently rewritten to look more settled than it was when written).
- **Not `CURRENT_DIRECTION.md`.** That future component (still deferred, per Governance §10) will state *what is currently prioritized*. This document states *what has already been concluded*. A Decision does not expire when priorities shift; a priority is not a Decision.

---

## 3. Lifecycle

Every entry in this log carries one of these statuses:

- **Open (Discovery)** — not an entry here yet. Lives in its native Roy Reality Lab or Open-Questions location. Listed here only for contrast, never as an actual row.
- **Proposed Closed** — drafted as a candidate Decision, with its evidence cited, awaiting explicit Product Owner confirmation. A session may read a Proposed Closed entry but must not treat it as settled — it is closer to Discovery than to Closed.
- **Closed** — ratified by the Product Owner (per the Approval Workflow appropriate to the layer the decision touches, Governance §8). This is the state that satisfies this document's purpose: a future session cites it, it does not re-derive it.
- **Amended** — a Closed decision revised in light of new evidence. The original entry is never deleted or silently rewritten; a new version is recorded with an explicit `Supersedes:` back-reference, mirroring Governance §5's rule for any Approved document.
- **Reopened** — a Closed decision that new evidence has called into serious question. Explicitly flagged as such and treated as Open again until re-closed — never quietly left in a Closed state that no longer matches reality, per Governance §2's "silence is preferred over staleness dressed as truth."

A status changes only by an explicit edit to this document, never implicitly by time passing or by a discovery document elsewhere being updated.

---

## 4. Entry format

Each Decision is one entry, numbered `DEC-NNN`, in ascending order, never renumbered or reused even if a decision is later superseded.

```
### DEC-NNN — <Title>

**Status:** Proposed Closed | Closed | Amended | Reopened
**Date:** <YYYY-MM-DD>
**Layer:** Goose General | Goose Financial | Roy Reality Lab (per Governance §3 — states which approval track governed this decision)

**Statement:** <the decision itself, in one to three sentences — what is now true and settled>

**Scope:** <what this decision governs>
**Non-scope:** <what remains explicitly open, so a reader does not over-extend this decision beyond its evidence>

**Evidence / authority:** <the specific document(s), finding(s), or file:line citations this decision rests on>

**Supersedes / Superseded by:** <DEC-NNN, or "none">
```

A Decision entry states a conclusion and points to its evidence. It does not re-derive the evidence inline — that duplication is exactly what `GOOSE_DOCUMENTATION_GOVERNANCE.md` §4's SSOT Rules already forbid.

---

## 5. Where a Decision may point

- A Knowledge Object Rule ID (`docs/knowledge/<domain>/<RULE-ID>.md`).
- A section of a Foundation artifact (`GOOSE_CONSTITUTION.md`, `GOOSE_CORE_BOUNDARY.md`, `GOOSE_KNOWLEDGE_ARCHITECTURE.md`, this document).
- A Roy Reality Lab discovery document, cited as *the evidence that produced the decision* — not as an ongoing source of truth. Once a Decision is Closed, the discovery document that led to it remains the historical record of *how* the conclusion was reached; this document is the record of *that it was reached and what it now means*.

---

## 6. Approval

Follows `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8 by the layer named in each entry's `Layer` field:

- A Goose General decision requires Product Owner **and** Chief Architect approval before moving from Proposed Closed to Closed.
- A Goose Financial decision requires Product Owner approval; Chief Architect approval is additionally required if the decision is architectural (data model, module boundary, cross-cutting contract).
- A decision reached through explicit Product Owner instruction in a working session (as with the two entries in §8 below, both instructed directly by Roy) satisfies the Product Owner half of that requirement at the moment it is written. Chief Architect sign-off, where required, remains tracked as pending in the entry's own status until performed — an entry is not described as fully Closed ahead of that if Chief Architect approval is still outstanding for its layer.

---

## 7. Integration with Boot

`GOOSE_BOOT.md` adds this document to its required-reading list (see `GOOSE_BOOT.md` §3) so that a session's understanding of already-settled architecture loads before it reads project-specific, Goose Financial documentation (`CLAUDE.md`, module docs) — the same ordering principle Boot already uses for its other required documents (general principles before specific application). Boot does not restate any entry from this document; it only points here, per Boot's own stated job of being "a loader, not an explanation."

---

## 8. Current Decisions Log

### DEC-001 — Goose Terminology Is Sovereign; External Vocabulary Is Mapped, Not Adopted

**Status:** Closed
**Date:** 2026-07-20
**Layer:** Goose Financial

**Statement:** Goose never adopts the terminology of any authority, regulator, clearinghouse, or provider as its own canonical model. Goose maintains its own canonical financial ontology; all external terminology is mapped into that ontology, never merged into or allowed to redefine it.

**Scope:** How Goose Financial names and structures the financial concepts it works with, across every domain (Provident Fund, Study Fund, Pension, and future domains).
**Non-scope:** This decision does not itself define the canonical names, Rule IDs, or final ontology — only that one sovereign ontology must exist and that institutional labels are evidence to be mapped, not schema to be inherited. Authoring the actual ontology, concept by concept, remains open (see `docs/knowledge/goose_finance/FINANCIAL_CONCEPTS_LAYER.md` §11).

**Evidence / authority:** `docs/knowledge/goose_finance/FINANCIAL_CONCEPTS_LAYER.md` §4–5, resting on `docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §E (Terminology Map — multiple non-interchangeable institutional terms for overlapping realities), `docs/knowledge/provident_fund/PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A1 (payout-side tax results explicitly distinguished from stored principal buckets), and `docs/foundation/GOOSE_EXPEDITION_3_PROVIDENT_FUND_CLASSIFICATION_IMPLEMENTATION.md` §A.5 (three disagreeing key-naming conventions for the same concepts already present in the live codebase — the concrete cost of not having this decision in force).

**Supersedes / Superseded by:** none.

---

### DEC-002 — Financial Concepts Are Interpretations, Not Canonical Stored Facts

**Status:** Closed
**Date:** 2026-07-20
**Layer:** Goose Financial

**Statement:** Named financial concepts (e.g. Qualifying Pension, Recognized Pension, Capital Exempt, New Account, Pension Sequence, Severance Sequence) are not canonical stored facts. Each is an interpretation produced from Canonical Facts, applicable legislation, person state, and a requested scenario — reproducible from those inputs, never a shortcut stored past them.

**Scope:** How Goose Financial represents and reasons about named financial concepts, across every domain.
**Non-scope:** This decision is directly evidenced for Capital Exempt specifically (Expedition 2, below) and generalized to the other five concepts as the current working position — it does not claim each of the other five has been individually re-verified to the same evidence level. That per-concept verification remains open (`docs/knowledge/goose_finance/FINANCIAL_CONCEPTS_LAYER.md` §11).

**Evidence / authority:** `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` Findings 1–4 (primary-source review of Income Tax Circular 2/2013 establishing that `capital_exempt` is not a real stored fund balance, but a derived, non-additive scenario computed from the Recognized Pension balance), as generalized in `docs/knowledge/goose_finance/FINANCIAL_CONCEPTS_LAYER.md` §6.

**Supersedes / Superseded by:** none.

---

## 9. Why this artifact, and not an extension of an existing one

Three existing Foundation artifacts were considered as a home for Closed Knowledge before creating this one, and each was rejected for a specific, stated reason:

- **`GOOSE_DOCUMENTATION_GOVERNANCE.md`** — rejected. That document governs *how* documents are structured, owned, and reviewed (its own §1: "It governs documentation. It does not govern architecture or code."). Recording decision *content* there would conflate process with substance, which is exactly the "one document, one clear scope of ownership" failure its own §2 warns against.
- **`GOOSE_BOOT.md`** — rejected, and explicitly ruled out by this milestone's own instructions. Boot's job is navigation: "which documents to read, in what order, and what 'ready' means" (`GOOSE_BOOT.md` §Purpose). `GOOSE_CORE_BOUNDARY.md`'s Boot Protocol section reinforces this: Boot "does not create new principles, it enforces reading the ones that already exist." Making Boot hold Decision content directly would turn a loader into a growing, unbounded repository — the opposite of what keeps it readable in full before every other required document (per its own Validation Checklist in `GOOSE_BOOT_TEMPLATE.md`: "still short enough to be read in full before any other required document").
- **A new Knowledge Object per decision** — rejected as the general mechanism, though not as a tool that individual decisions may still point to. A Knowledge Object is scoped to one rule with a legal/regulatory/mathematical basis (`KNOWLEDGE_OBJECT_TEMPLATE.md` §1). Many architectural decisions — like DEC-001, a naming-sovereignty principle — have no such basis and would not fit that template without distorting it.

**`DECISIONS.md` was preferred because it did not need to be invented as a new concept** — `GOOSE_DOCUMENTATION_GOVERNANCE.md` §10 had already named it as an approved, deferred future milestone ("a future decision log recording architectural and product decisions over time"), the same way `GOOSE_BOOT.md` itself was once named and deferred before being built out as Artifact 004. Activating an already-approved, already-scoped component is a smaller, more traceable change than introducing a new mechanism the governance system had not already anticipated — consistent with this milestone's "no rewrites, small focused amendments" instruction.

---

*This document should be read alongside `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` (which names this artifact and its approval workflow) and `GOOSE_BOOT.md` (which points to it as required reading). It holds Closed Knowledge; it does not hold Discovery, and it does not hold documentation process rules.*
