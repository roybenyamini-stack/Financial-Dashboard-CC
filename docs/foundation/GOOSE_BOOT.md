# Goose Boot

*Goose Foundation — Artifact 004*

*Version 1.0 — Draft, pending Chief Architect ratification*

**Author:** Claude Code
**Reviewed by:** *(pending — Chief Architect review not yet performed)*
**Product Owner:** Roy

---

## Purpose

This document is the entry point for any AI session (Claude, ChatGPT, Codex, Gemini, or a future agent) beginning work in this repository. Its job is navigation, not explanation: it states which documents to read, in what order, and what "ready" means before touching code or documentation. It does not restate what those documents say — see `GOOSE_CORE_BOUNDARY.md`'s Boot Protocol section for why this document exists and how it fits the Foundation.

---

## 1. Project Identity

This repository is **Goose Financial** — the first domain instantiation of Goose General, applying Goose's principles to Israeli financial reality (pensions, provident funds, tax, retirement planning). See `GOOSE_CONSTITUTION.md` for what Goose is and why it exists, and `GOOSE_CORE_BOUNDARY.md` for what belongs in Goose Core versus a domain module.

---

## 2. Repository Authority

This repository — its committed files, not a session's memory or a prior conversation — is the single source of truth. A session re-derives its understanding of current state from the repository on every boot; it never relies on what it, or another agent, recalls having done previously.

Authority flows in one direction:

```
Reality → Foundation → Constitution → Architecture → RFC → Milestone → Current Session
```

A session acts within the scope granted by this chain. It does not reorder it, and it does not treat its own prior output as authoritative over the repository.

---

## 3. Required Documents

Read in this order before making any change:

1. `GOOSE_CONSTITUTION.md` — what Goose is, why it exists, its non-negotiable principles.
2. `GOOSE_CORE_BOUNDARY.md` — what belongs in Goose Core, what belongs in a module, and the Boot Protocol section.
3. `GOOSE_KNOWLEDGE_ARCHITECTURE.md` — what Canonical Knowledge, Knowledge Objects, and Knowledge Models are, and why documentation is treated as a generated view rather than a source.
4. `GOOSE_DOCUMENTATION_GOVERNANCE.md` — how Goose documentation itself is owned, reviewed, and kept coherent.
5. `DECISIONS.md` — the Closed Knowledge log: architectural and product decisions already ratified by the Product Owner. Read before any project-specific document, so a session builds on settled conclusions instead of re-investigating them.
6. `CLAUDE.md` (or the equivalent builder entry point for the acting agent) — project-specific coding rules and module-doc pointers.
7. `STATUS.md` — current application version and most recent changes.
8. Any module doc named in `CLAUDE.md` relevant to the task at hand (e.g. `docs/pension_logic.md`, `docs/sliders_module.md`).

---

## 4. Current Milestone

**Closed Knowledge Mechanism v1** — activating `DECISIONS.md` (Artifact 006), the deferred decision log named in `GOOSE_DOCUMENTATION_GOVERNANCE.md` §10, and adding it to Required Documents (§3) so ratified architectural decisions are read before project-specific documentation instead of being rediscovered. Documentation only; no application code changed.

*(Update this section, and only this section plus §5, when a new milestone begins or completes — see `templates/GOOSE_BOOT_TEMPLATE.md`.)*

---

## 5. Current Project Status

Application version: **v177.68** (per `STATUS.md`). No application code has changed as part of any Goose Foundation milestone to date (Expedition 1, Documentation Governance, Boot Protocol, Closed Knowledge Mechanism) — each is a documentation-only effort running parallel to the ordinary development cycle.

---

## 6. Session Initialization Workflow

1. Locate the repository root.
2. Read this document (`GOOSE_BOOT.md`).
3. Read every document listed in §3, in order.
4. Validate that each document's version header is internally consistent (a session must not treat a document as ratified if its own header says Draft).
5. Confirm the current milestone (§4) and current project status (§5) against the repository's actual state — not against this document alone, since it can lag between updates.
6. Report readiness to the human: which documents were read, current milestone, current application version.
7. Wait for the human's objective. Do not infer a task from repository state alone.

---

## 7. Boot Completion Contract

A session is considered "booted" only when it can truthfully state:

- It has read every document in §3.
- It knows the current milestone and current application version.
- It has not modified any file yet.
- It understands that this repository, not its own memory, is authoritative.

A session that cannot state all four has not completed Boot and must not proceed to implementation.

---

*This document is intentionally short. It is a loader, not an explanation. For what Goose is, see `GOOSE_CONSTITUTION.md`. For what belongs in Goose Core and for the Boot Protocol's rationale, see `GOOSE_CORE_BOUNDARY.md`. For how this and every other Goose document is owned and reviewed, see `GOOSE_DOCUMENTATION_GOVERNANCE.md`. For already-ratified architectural and product decisions, see `DECISIONS.md` — this document points to it; it does not restate it.*
