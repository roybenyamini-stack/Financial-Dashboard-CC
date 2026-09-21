# Goose Workflow

*Version 1.1 — Repository Recovery Rule, Solved Questions Guard and Private Evidence review added 2026-09-22*

---

## Purpose

This document defines the canonical workflow used during Goose Engineering. It describes how a Goose working session is performed.

It is independent of any specific domain. It does not describe Provident Funds, implementation, or business knowledge.

---

## Session Lifecycle

```
GOOSE BOOT
    ↓
Start Session
    ↓
Research / Design / Implementation
    ↓
Knowledge Review
    ↓
Documentation Decision
    ↓
End Session
```

---

## GOOSE BOOT

GOOSE BOOT is used **only** when starting a **new** ChatGPT conversation.

GOOSE BOOT automatically performs:

- Read `GOOSE_CONSTITUTION.md`
- Read `GOOSE_WORKFLOW.md`
- Read the relevant Knowledge Registry
- Review today's objective

After BOOT, the first Goose Session begins.

### Repository Recovery Rule

When a new ChatGPT conversation begins and the canonical project state is not available in the conversation context, the acting Chief Architect must **first** actively attempt to recover that state from the repository / project sources available to it. The correct flow is:

```
New conversation
    ↓
Canonical state missing
    ↓
Attempt repository / project recovery
    ↓
Read canonical documents
    ↓
Reconstruct current state from the repository
    ↓
Continue
```

Only if repository / project access genuinely fails may the human be asked to paste or reconstruct the missing canonical material. Conversation memory must not substitute for repository recovery.

---

## Solved Questions Guard

Before starting a new research expedition, or reopening a field / code / domain question:

1. Inspect the relevant Knowledge Registry / canonical Knowledge.
2. Inspect the relevant Discovery evidence.
3. Inspect Open Questions.
4. Inspect Closed Decisions (`DECISIONS.md`) where applicable.
5. Identify the **exact unresolved boundary**.

Research may begin only after confirming the question is genuinely open. If a broad family of questions has already been resolved and only one narrow remainder is open, investigate only that remainder. Do not restart a prior expedition merely because the current conversation lacks its history.

---

## Start Session

Within the **same** conversation, no BOOT is required.

Typical user triggers include:

- בוקר טוב
- חזרתי
- ממשיכים
- בוא נמשיך

These begin a new Goose Session. The workflow resumes automatically.

---

## Conversation vs Session

A ChatGPT conversation may contain multiple Goose Sessions.

GOOSE BOOT is executed only once when a new conversation begins.

Each subsequent work period inside the same conversation starts a new Session without running BOOT again.

Knowledge Review is performed at the end of every Session.

---

## End Session

Typical user triggers include:

- נסיים להיום
- נמשיך מחר
- אני חייב לזוז

Before ending the session, a mandatory Knowledge Review is performed.

---

## Knowledge Review

Every significant Goose session ends with Knowledge Review.

Knowledge Review determines whether today's work requires updating any canonical project documentation.

Knowledge Review is mandatory.

---

## End-of-Session Checklist

□ Was new knowledge discovered?

□ Should any Knowledge Registry be updated?

□ Should any Research document be updated?

□ Should GOOSE_WORKFLOW.md be updated?

□ Should GOOSE_CONSTITUTION.md be updated?

□ Is the current knowledge sufficiently stable for implementation?

□ If Private Evidence was used during the session, has every proposed committed derivation been reviewed against the Private Evidence boundary (`EVIDENCE_HANDLING.md` §5.1) before documentation / commit?

---

## Documentation Decision

After Knowledge Review, an explicit Documentation Decision is made:

- No documentation update required

or

- Documentation update required

Only then is the Session considered complete.

---

## Responsibilities

**Roy**

- Product Owner
- Domain Expert
- Final Approval

**ChatGPT**

- Chief Architect
- Knowledge Curator
- Workflow Manager

**Claude**

- Implementation
- Testing
- Documentation
- Refactoring

---

## Guiding Principle

The project must never rely on ChatGPT conversation memory.

Important knowledge must eventually become part of the project itself through the appropriate documentation.
