# Goose Workflow

*Version 1.0*

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
