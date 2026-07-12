# Goose Core Boundary

*Goose Foundation — Artifact 002*

*Version 1.1 — July 2026*

---

## Purpose

Goose Core, as defined in this document, is the architectural mechanism operating within Goose General — the domain-independent platform layer. "Financial Understanding Platform" describes Goose Financial, the first domain instantiation of Goose General, not Goose General itself. (See `GOOSE_DOCUMENTATION_GOVERNANCE.md` for the full three-layer model: Goose General → Goose Financial → Roy Reality Lab.)

Within Goose Financial, the Retirement module is the first built — not the definition of the domain. Future modules will address pension products, cash flow planning, tax strategy, insurance understanding, estate planning, and domains that do not yet have names. Each will bring its own logic, its own rules, and its own way of making a person's situation visible. Future Goose domains beyond Financial (e.g. Goose Medical, Goose Legal) would instantiate Goose General the same way Goose Financial does.

For Goose to grow coherently across all of them, something must remain constant. That constant is Goose Core.

This document defines the boundary of the Core: what belongs inside it, what must remain outside it, and the rules by which both sides of that boundary evolve over time.

The boundary is not a technical boundary. It is a conceptual one. It must remain valid even if every line of code is rewritten, even if the platform is rebuilt in a different language, even if the team that builds it is entirely replaced. The Core is not an implementation. It is an identity.

---

## Core Responsibilities

Goose Core is responsible for one thing: holding a person's financial reality and making it available for understanding.

Everything else — calculating, simulating, advising, visualizing — is the work of modules. The Core does not calculate. The Core does not advise. The Core holds what is true and makes it accessible to everything that builds on top of it.

Within that responsibility, the Core does the following:

**Holds human intent.** A person does not come to Goose because they have documents. They come because they want to understand something — whether they can afford to retire, where their pension contributions are going, how much they can safely spend each month. This intention is not a search term. It is the purpose behind every question, every module, and every interaction. The Core holds it explicitly, because without knowing what a person is trying to achieve, every answer is technically correct and practically meaningless.

**Represents financial reality.** The Core maintains a coherent picture of a person's financial situation as it actually is — not as any single institution sees it, not as any single module interprets it, but as it exists across all sources and all domains simultaneously.

**Tracks evidence.** Every known fact in the Core is connected to its origin: which document produced it, which entry recorded it, which rule derived it. The Core never holds a number without knowing where it came from.

**Models entities.** The Core maintains the things that exist in a person's financial life — the people, the assets, the obligations, the institutions, the events, the relationships between them. These entities are shared across all modules. A pension fund (קרן פנסיה) known to the Retirement module is the same entity known to the Tax module.

**Holds time as a dimension of reality.** Goose does not model a snapshot. It models a financial life — which means it models reality as it moves through time. Evidence appears at specific moments. Entities change. Decisions made today create events in the future. The arc of a financial life is only visible when time is held as a first-class dimension of the Core, not an attribute of individual records.

**Maintains truth.** The Core distinguishes three states that must never be confused: what is known from evidence, what is estimated from inference, and what is projected from assumptions. These three states are not interchangeable. The Core never collapses them into one.

**Generates alternatives.** Given a person's current reality, the Core holds the set of possible futures — different choices, different paths, different outcomes. Modules refine and illuminate these alternatives. The Core makes them available.

**Assesses consequences.** For each alternative, consequences follow. The Core tracks these across every dimension of a person's financial life, so that a decision made in one domain can be understood in light of its effects on all others.

**Supports decision readiness.** The Core maintains an ongoing assessment of whether a person has enough understanding to make a confident choice on any given question. This is not a score. It is a reflection of how complete and how clear the current picture is.

**Enables learning.** When new information arrives — a new document, a correction, a life event — the Core updates its picture of reality. Learning is not exceptional. It is continuous.

---

## What Belongs Inside Goose Core

The following concepts belong in the Core permanently. They belong there not because they are abstract, but because they are universal — every possible Goose module, in every possible domain, will need to work with them.

**Reality** is the foundation of the Core. It is the true state of a person's financial life at any point in time — the assets held, the obligations owed, the events that have occurred, the rules that govern each. Every module begins from this reality. No module may redefine it. Reality is shared, singular, and authoritative.

**Evidence** is what makes reality trustworthy. It is the source material behind every known fact: the document, the entry, the calculation chain that produced a given number. Evidence is what separates what Goose knows from what Goose is guessing. Without evidence tracking in the Core, there is no provenance — and without provenance, there is no trust.

**Entities** are the things that inhabit a financial life: the persons involved, the assets accumulated, the obligations carried, the institutions engaged, the events that shape the arc of a financial journey. Every module works with these same entities. A person's investment account (קופת גמל להשקעה) is one entity, known consistently across every module that touches it. Entities are defined once, in the Core.

**Time** is the dimension that makes financial reality coherent. A pension fund opened twenty years ago is not the same entity as the same fund today — its balance, its rules, and its tax status have all evolved. Evidence arrives over time. Decisions create events that unfold over time. Projections extend forward in time. Without time as a permanent Core concept, there is no way to understand the difference between what was, what is, and what will be — and that distinction is essential to every financial decision.

**Knowledge** is the Core's current understanding of what is true — held with a degree of confidence that reflects the quality of the underlying evidence. Knowledge is not binary. It comes in degrees. The Core tracks not only what is known but how well it is known and why.

**Human Intent** is what brings a person to Goose and gives every question its meaning. Intent is not a question. It is the goal behind the questions — to understand, to decide, to prepare, to confirm. Two people asking the same question may have entirely different intentions, and those intentions change what a complete answer looks like. The Core holds intent because every module must orient its work toward the person's actual goal, not only the literal question they asked.

**Questions** are what bring a person to Goose. They are not merely search terms. They are structured expressions of what a person is trying to understand — questions about what they have, what they owe, what will happen if they make a given choice, whether they are ready to decide. The Core holds the person's questions so that every module can orient its work toward answering them.

**Alternatives** are the possible paths a person can take from their current reality. The Core generates the space of alternatives; modules explore specific ones. Alternatives belong in the Core because decision-making is always comparative. A person cannot evaluate one path without understanding the others.

**Consequences** are what follow from each alternative, across all domains and all time horizons. The Core holds consequences in their full context — not just what happens in the pension domain, or the tax domain, but what happens everywhere simultaneously when a choice is made. This cross-domain view is only possible if consequences live in the Core.

**Understanding** is the practical state of having made sense of one's situation well enough to act on it. It is not knowledge — knowledge is what the Core holds about the world. Understanding is what happens when a person connects that knowledge to their own life. Goose exists to produce understanding, not merely to display information. Understanding belongs in the Core because it is the bridge between the evidence and knowledge the Core holds, and the decision readiness the person is working toward. A person with full knowledge but no understanding is not ready to decide.

**Decision Readiness** is the state of having enough understanding, on a given question, to make a confident and informed choice. It is a Core concept because it cuts across every domain. A person may have high decision readiness on their pension situation and low decision readiness on the tax implications of the same choice. The Core holds both.

**Learning** is the capacity to update. A person's financial reality changes: a new account is opened, a document arrives, a law is amended, a life event occurs. The Core must absorb these changes and update its picture without losing what was previously known. Learning is not a feature of any specific module. It is a property of the Core.

---

## What Does NOT Belong Inside Goose Core

The Core is deliberately narrow. What is excluded is as important as what is included.

**Domain calculations and business rules** do not belong in the Core. Retirement projections, pension accumulation math, income tax computation, investment return scoring, insurance premium logic, estate tax planning — these are the work of modules. They interpret reality. They do not define it. When tax law changes, the Tax module changes. The Core does not.

**Document parsing and data extraction** do not belong in the Core. Reading an Excel file (קובץ אקסל), parsing a PDF pension statement, or receiving a structured feed from the pension clearinghouse (מסלקה) are infrastructure concerns. The Core receives structured financial facts. It does not concern itself with how those facts were extracted from raw documents. The pipeline feeds the Core; it is not part of the Core.

**User interface and visualization** do not belong in the Core. The Core holds understanding. Interfaces render it. How a person's financial picture is displayed — as charts, tables, narratives, or any other form — is the responsibility of the presentation layer. The Core must remain presentation-agnostic. The same Core should be able to serve a screen, a voice interface, a report, or an AI conversation without modification.

**External integrations and data pipelines** do not belong in the Core. APIs, broker connections, regulatory data feeds, and third-party services are the infrastructure through which information reaches the Core. They are not part of what the Core knows — they are how it comes to know it.

**Domain-specific regulatory logic** does not belong in the Core. Israeli pension law, Amendment 190 (תיקון 190) tax rules, capital gains tax tiers, insurance licensing requirements — these change when governments change their minds. The Core must remain valid across regulatory environments. The rules that govern a specific domain live in the module responsible for that domain.

The general principle: anything that would need to change if the regulatory environment changed, the country changed, or a new financial domain was added — belongs outside the Core.

---

## Module Contract

Every future module in Goose enters into the same contract with the Core.

**What the Core gives to every module:**

A complete and current representation of reality — what is known, to what degree, from which evidence. The set of entities relevant to the module's domain. The person's active questions, so the module can orient its work. The existing alternatives and consequences already contributed by other modules, so the module can build on and connect to them.

The Core gives this not as raw data, but as structured understanding — organized, labeled by certainty, and ready to be extended.

**What every module returns to the Core:**

New knowledge about the person's situation in the module's domain. Refined alternatives — the space of possible paths, enriched with the module's domain-specific insight. New consequences — what follows from each alternative when examined through the module's lens. An updated assessment of decision readiness on the questions the module can address.

Modules do not return data. They return understanding.

This contract is symmetrical by design. The Core grows richer each time a module contributes to it. A module that adds tax consequences enriches the retirement alternatives. A module that models cash flow enriches the picture of what is achievable in each alternative. The Core is the accumulation of everything all modules have understood — and that accumulated understanding is available to every module that comes after.

---

## Extension Rules

Goose will grow over the next decade. New modules will be added. New financial domains will become relevant. New forms of evidence will arrive. The Core will be asked to hold concepts it was not originally built to hold.

The following rules govern that growth:

A new module must never redefine Goose Core. A module receives the Core as it is. It does not reshape what the Core means or how it works. A module that needs the Core to be different must propose that change as a Core extension — not implement it unilaterally.

Modules extend understanding in their domain. They do not extend reality. Reality is what it is. A Tax module does not create a new kind of reality — it illuminates what was already there.

When a new module requires a concept that does not yet exist in the Core, that concept must pass one test before it is admitted: does it apply to every possible Goose module, in every possible domain? If yes, it belongs in the Core. If it applies only to the requesting module, it belongs in that module.

New infrastructure — a new document format, a new data source, a new parsing method — extends the pipeline into the Core. It does not modify the Core itself. Infrastructure serves the Core; it is not part of it.

The purpose of these rules is not rigidity. It is coherence. A Core that changes every time a new module arrives eventually becomes indistinguishable from the modules themselves — and Goose becomes exactly what it was built to replace: a collection of disconnected, domain-specific tools.

---

## Reality Validation

No architectural principle of Goose is adopted on faith. Every principle must be validated against a real financial life — a real person, with real accounts, real documents, real questions, and real decisions to make.

Goose is developed in two parallel tracks, and neither is complete without the other.

**Track 1 — Foundation** produces the permanent principles, the Core boundary, the module contracts, and the extension rules. It answers the question: what must always be true about Goose, regardless of what is built on it?

**Track 2 — Roy Reality Lab** tests every principle against an actual person's actual situation, and is Roy's real working, research, experimentation, and validation environment for Goose Financial — using real data (Mislaka XML, annual PDFs, manually created assets, the Excel "Real Data" workflow) for real-world QA, UX experiments, proof-of-concept work, and discovery, not only validation. It answers the question: does this principle hold when it meets the world? Roy Reality Lab may surface facts and generate proposals, but it does not redefine Goose General or Goose Financial without an approved decision (see `GOOSE_DOCUMENTATION_GOVERNANCE.md`).

The first validation case is **Reality Case 001 — Roy's Retirement Journey.** It is a complete picture of one person's financial life: pension funds, investment accounts, a study fund, life events, tax obligations, and retirement projections — built using Goose Core as the foundation. If the Core concepts cannot accurately model this real case, the concepts are wrong. Not the case.

Roy Reality Lab is not a test phase. It is a permanent parallel discipline. Every new Core concept will be validated against a real case before it is ratified. Every module will be validated against a real scenario before it is considered complete.

Foundation without validation is philosophy. Validation without foundation is just software. Goose requires both.

---

## Closing Statement

The Core is what makes Goose coherent across all of its modules, all of its domains, and all of its future directions. Without a protected Core, each new module brings its own definition of reality — its own understanding of what entities exist, what facts matter, and what counts as truth. That fragmentation is not a future risk. It is the current state of the financial industry. Every institution, every platform, every application has its own model of reality. No two agree. The person in the middle has no unified picture.

Goose exists to provide that unified picture. The Core is the mechanism by which that unity is maintained. Protecting the Core is not a technical concern. It is the architectural commitment that makes the mission possible.

---

*This document defines the architectural boundary of Goose Core. It is not a technical specification. It does not describe how the Core is implemented. It describes what the Core is responsible for, what belongs inside it, and what must remain outside it — permanently, across every version of Goose that will ever be built.*

*This document should be read alongside* GOOSE_CONSTITUTION.md *and reviewed whenever a new module, a new integration, or a new architectural direction is proposed. For how Goose documentation itself — including this document — is structured, owned, and reviewed, see* GOOSE_DOCUMENTATION_GOVERNANCE.md*.*
