# Goose Constitution

*Version 1.1 — Ratified July 2026; North Star extended 2026-07-26*

---

## Why Goose Exists

Most people have no clear picture of their own financial life.

Not because the information does not exist — it does, scattered across dozens of institutions, pension houses, tax authorities, and investment firms. Statements arrive. Reports are filed. Numbers accumulate. But numbers without context are not understanding. And understanding is what financial decisions require.

In Israel, a person approaching retirement may hold a pension fund (קרן פנסיה), a manager's insurance policy (ביטוח מנהלים), a provident savings fund (קופת גמל), a study fund (קרן השתלמות), and a collection of securities — each managed by a different institution, governed by different tax rules, and reported in a different format. No single institution shows the whole picture. No single document answers the simplest question: *What do I actually have, and what will it mean for my life?*

Goose exists to answer that question honestly.

---

## Mission

Goose transforms scattered financial data into genuine human understanding — making a person's complete financial reality visible, navigable, and their own.

---

## North Star

Goose exists to help a person reach an honest understanding of their own financial reality.

Its primary purpose — before retirement, before tax, before optimization, before any form of financial planning — is to establish that reality: what a person actually has, as evidenced by real sources. Only once that reality exists can any use case interpret it, in service of the person trying to understand it.

Use Cases — retirement, taxation, inheritance, divorce, financial planning, and simulation among them — interpret reality. Reality is never defined by a use case, and this list is illustrative, not closed: any future use case, named or not yet imagined, is bound by the same rule. This holds for every financial product Goose models — Study Funds, Provident Funds, Pension Funds, Manager's Insurance, Investment Provident Funds, Savings Policies, and any product added later — itself an illustrative, not exhaustive, list.

**Calculations adapt to reality. Reality never adapts to calculations.** Goose never invents or reshapes a person's financial reality merely to satisfy a calculation, a simulation, or a presentation.

**Reality before Simulation. Reality before Calculation. Reality before Presentation.**

Unknown is a valid outcome. A confidence level such as "Operationally Supported" is a valid, honest state — not a placeholder for a stronger claim that has not yet been earned (see Core Principles 2 and 7, below). Evidence evolves reality; assumptions never do.

Every design decision, architectural choice, and product direction is evaluated against one question:

> **Does this bring the person closer to an honest understanding of their own financial reality?**

If yes, the direction is sound. If no, the burden falls on the proposer to justify why.

---

## What Goose Is

**A financial intelligence layer.** Goose sits between raw institutional data and human understanding. It does not hold money, execute trades, or manage accounts. It reads, interprets, and explains.

**A personal financial operating system.** Goose integrates every dimension of a person's financial life — assets, liabilities, pension projections, tax obligations, life events, and scenarios — into one coherent picture. There is one reality. Goose offers many ways to see it.

**A system that earns trust through honesty.** Goose is only as valuable as it is accurate. When data is missing, Goose says so. When a number is an estimate, Goose labels it as one. When a projection depends on assumptions, those assumptions are surfaced. Trust is built on transparency, not confidence.

**A tool where the human understands the output.** The goal is not for a person to receive a number. The goal is for a person to understand what that number means, where it came from, and what it implies. A Goose session that ends with a user saying "I understand my situation better now" is a success, regardless of the figures shown.

---

## What Goose Is Not

**Not a black box.** Every number Goose produces has a traceable origin. A user may always ask: where did this come from? The answer must always be available.

**Not a financial advisor.** Goose explains. It does not prescribe. It shows what is, and what could be under different assumptions. The decision always belongs to the person.

**Not a bank, broker, or institution.** Goose holds no money and takes no position. It has no stake in what a person chooses to do with their assets.

**Not a source of invented precision.** Showing a confident number when the underlying data is missing or ambiguous is one of the most dangerous things a financial system can do. Goose will never do it. Silence, a range, or an explicit "unknown" is always preferred over a fabricated certainty.

**Not a replacement for professional advice in complex situations.** Goose is a tool for self-understanding. It is not a substitute for a qualified accountant, actuary, or financial planner when a person's situation warrants one.

---

## Core Principles

### 1. Reality First

Every number in Goose must trace to a real source: an imported document, an explicit user entry, or a named rule applied to known inputs. Numbers that cannot be traced to one of these origins must not appear.

### 2. Missing Truth Is Better Than False Precision

When a field is unknown, it is shown as unknown. When a calculation depends on a missing input, the output is flagged — not filled with a default that hides the gap. A person making a decision based on incomplete data should know they are doing so.

### 3. Every Number Has Provenance

The origin of every figure must be traceable: which document it came from, which field produced it, and which rule was applied. This is not a debugging feature — it is a trust feature. A person should be able to point to any number and ask "where did this come from?" and receive a real answer.

### 4. AI Assists — AI Does Not Invent

Artificial intelligence is a legitimate part of Goose. It can extract data from documents, summarize a person's financial situation, and explain complex rules in plain language. It may never fabricate a number to fill a gap. If a document does not contain the required information, the correct behavior is to stop and say so — not to approximate.

### 5. Explain Before Recommend

A person must understand what their current situation is before Goose presents what it could be. Projections and scenarios are only meaningful when anchored to a clear picture of reality. Goose never leads with possibilities before establishing facts.

### 6. Human Understanding Is the Primary Output

Goose is not an accounting system. The primary output is not a balance sheet — it is understanding. A person should leave a Goose session knowing more about their financial life than when they arrived. Clarity for the human is always the measure of success.

### 7. One Reality, Many Views

There is exactly one set of facts for each person's financial situation. Projections, scenarios, and simulations are interpretations of those facts — not alternatives to them. The distinction between what is real, what is estimated, and what is projected must always be visible and clear.

### 8. Complexity Belongs to the System, Not the User

The Israeli financial system is complex. Tax rules like Amendment 190 (תיקון 190) involve multiple buckets, seniority calculations, and interaction effects that would take years to master. That complexity belongs inside Goose. The person should see the meaning, not the mechanism.

### 9. Financial Knowledge Must Be Accessible

Institutional opacity, professional jargon, and the assumption that financial understanding requires a specialist are barriers that Goose is built to remove. Every concept must be explainable in plain language. A person without financial training should be able to understand what Goose tells them.

### 10. Terminology Is Not Decoration

Words carry meaning. The correct term for an investment classification track is track (מסלול) — not type, category, or class. The correct name for a provident investment fund is קופת גמל להשקעה — not a shortened form. The correct distinction between a cash flow instrument (תזרים) and a capital asset (נכס הוני) shapes how a product is calculated and displayed. Precision in language reflects precision in thought.

---

## Design Philosophy

Goose should be built to think in the following ways:

**Reject rather than approximate.** When incoming data is ambiguous, malformed, or unrecognizable, the correct response is to reject it and explain why — not to make a best guess and continue silently. A wrong number delivered confidently is more harmful than no number at all.

**Distinguish what is known from what is estimated from what is projected.** These three states have different levels of certainty and different implications for decision-making. They must never look identical. A person should always be able to see which state a figure is in.

**Make assumptions visible and editable.** Whenever Goose projects into the future, the assumptions driving that projection must be surfaced. A person should be able to change those assumptions and see what changes. A projection is a tool for thinking, not a prediction.

**Serve the human's mental model.** Goose should present information in the way that best matches how a person actually thinks about their financial life — not in the way that is most convenient for data processing. If a concept needs to be reorganized or reframed to be understood, reorganize and reframe it.

**Earn trust through correct failure.** How a system behaves when something goes wrong reveals its character. Goose should fail loudly and helpfully — surfacing what went wrong, why it matters, and what can be done — rather than silently degrading or hiding its errors.

**Prefer human language.** Whenever technical or institutional language and plain language communicate the same truth, plain language is preferred. The goal is understanding, and jargon is an obstacle to understanding.

---

## Decision Rule

When any future decision must be made — architectural, product, design, or otherwise — it should be evaluated against this rule:

> **Does this choice bring the person closer to an honest understanding of their financial reality — or does it optimize for something else?**

"Something else" may include technical elegance, development convenience, visual appeal, or competitive feature parity. These are valid considerations. But they are secondary. They must not override the primary purpose.

If a proposed direction fails the Decision Rule, it requires explicit justification. The burden of proof falls on the direction that moves away from honest understanding — not on the direction that upholds it.

---

*This document is the canonical statement of what Goose is and why it exists. It is not a technical specification. It does not describe how Goose is built. It describes what Goose must remain true to — regardless of how it is built, rebuilt, or extended.*

*Human-facing product materials, tutorials, and explanations may be translated into Hebrew (עברית) and other languages. This Constitution remains in English as the single source of truth.*

*For how Goose documentation — including this Constitution — is structured, owned, and reviewed, see* GOOSE_DOCUMENTATION_GOVERNANCE.md*, which also records a known open item: this Constitution's current framing predates the approved Goose General → Goose Financial → Roy Reality Lab layering and is pending a future revision.*
