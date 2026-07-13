# Goose Boot — Update Template

*Companion template for Goose Foundation — Artifact 004 (`GOOSE_BOOT.md`)*

*Version 1.0*

---

Use this template when `GOOSE_BOOT.md` needs to be updated for a new milestone. Copy the structure below; do not restructure `GOOSE_BOOT.md` itself unless a Foundation-level decision requires it.

---

## Version Header

```
*Version X.Y — [Draft | Reviewed | Approved/Ratified], [pending Chief Architect ratification if applicable]*

**Author:** [who updated this]
**Reviewed by:** [Chief Architect name, or "(pending)"]
**Product Owner:** Roy
```

---

## Required Sections (do not remove any)

1. Purpose
2. Project Identity
3. Repository Authority
4. Required Documents
5. Current Milestone
6. Current Project Status
7. Session Initialization Workflow
8. Boot Completion Contract

---

## Milestone Section — update pattern

```
**[Milestone Name] vN** — [one-sentence description of what changed and why]. [State explicitly whether application code changed — it should not, for a documentation milestone.]
```

---

## Required Documents — update pattern

When a document is added, removed, or reordered in the required-reading list, state:

- Document name and path.
- Why it is now required reading (or why it no longer is).
- Where in the reading order it belongs, and why that order matters.

---

## Session Objective Checklist

Before publishing an updated `GOOSE_BOOT.md`, confirm:

- [ ] Every required document listed still exists at the stated path.
- [ ] The Current Milestone section matches the actual, current state of the repository — not a planned or in-progress state.
- [ ] The Current Project Status section's application version matches `STATUS.md`.
- [ ] No content has been duplicated from `GOOSE_CONSTITUTION.md`, `GOOSE_CORE_BOUNDARY.md`, `GOOSE_KNOWLEDGE_ARCHITECTURE.md`, or `GOOSE_DOCUMENTATION_GOVERNANCE.md` — only references.
- [ ] The document is still short enough to be read in full before any other required document.

---

## Validation Checklist (apply after any edit to `GOOSE_BOOT.md`)

- [ ] All cross-references resolve to real files.
- [ ] Version header bumped, not edited in place, if content materially changed — per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §5.
- [ ] Approval workflow followed per `GOOSE_DOCUMENTATION_GOVERNANCE.md` §8 (Goose General layer: Product Owner + Chief Architect).
- [ ] No application code referenced or modified as part of this update.

---

*This template is itself a Foundation artifact. Changes to its structure should go through the same review as changes to `GOOSE_BOOT.md`.*
