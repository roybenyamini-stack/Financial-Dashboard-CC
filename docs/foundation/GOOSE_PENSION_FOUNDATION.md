# GOOSE Pension Foundation

**Status:** Draft 0.1
**Author:** Claude Code
**Product Owner:** Roy — approval pending
**Derived from:** `docs/knowledge/provident_fund/PF_STAGE1_STAGE2_DISCOVERIES.md` (Stage 1 / Stage 2 discovery
history).

---

## 1. Purpose

This document is the governing foundation for how Goose describes Israeli pension reality — the layer between
the discovery history in `PF_STAGE1_STAGE2_DISCOVERIES.md` and any future software model.

This document is not itself the Canonical Pension Language. It establishes the concepts, distinctions, and
evidence discipline a future Canonical Pension Language document will be derived from. That derivation is a
separate, later artifact; this Foundation governs it rather than substituting for it.

This is not an implementation document, not a persistence design, not a software object model. No field name,
table, schema, class, or JSON shape belongs here. Software models are derived from this language — never the
reverse.

As Draft 0.1, this document is expected to be revised. Sections marked TBD (§7) are open by design.

---

## 2. Fundamental Principle

**Goose does not model pension products. Goose models pension reality.**

Products, providers, accounts, and documents represent that reality. They are not the reality itself. Goose's
role is not to be a single source of truth competing with these representations — it is the engine that
reconciles them into one canonical reality.

---

## 3. Reality, Representations, Projections, Canonical Reality

**Status:** Operationally Supported.

This is one of Goose's central concepts, and it governs everything else in this document: no source Goose
reads is reality itself, and no single source is ever sufficient.

```
Reality
  ↓
Representations
  ↓
Projections
  ↓
Canonical Reality
```

**Reality** is what actually happened to a person's rights and money — every deposit, return, transfer,
election, and event, in full, whether or not any document ever records it completely.

**Representations** are the concrete containers reality passes through: a provider's internal system, a
policy, an account, a product.

**Projections** are what each representation actually exposes, shaped for a specific purpose: a clearinghouse
XML feed answers "how are transferable rights described between systems"; a detailed annual report answers "how
does the managing body document every account component"; a short annual report answers "what does the member
need to understand this year"; a professional reclassification letter answers "is the legal classification of
these funds correct." No projection is a lie — each is accurate to its own purpose — but no single one is
complete, and two projections of the identical underlying reality can look nothing alike (a bank-account-style
short report and a bucket-forward short report, from two different providers, over the identical rights).

**Canonical Reality** is not stored complete in any single source. It is produced by Goose reconciling
multiple projections against each other — it does not exist until the projections are connected.

This replaces an earlier, looser idea of Goose as a single source of truth (SSOT) that simply holds the "real"
numbers somewhere. The corrected model: **the SSOT is not located in any one source — it is constructed by
Goose out of several.**

---

## 4. Canonical Concepts

### 4.1 Rights Layer

**Status:** Operationally Supported.

**Human Meaning:** What a person actually holds — independent of which institution currently administers it,
what a statement calls it, or which investment track it currently sits in.

**Canonical Definition:** A Rights Layer is the smallest unit that preserves legal and tax identity across
operational events: transfers between institutions, changes of investment track, changes in how a provider
presents the money.

**Characteristics:**

- Survives a transfer intact, even when the receiving institution's account number, joining date, and
  presentation format are all new.
- Survives a reclassification intact — reclassification changes how a layer's balance is allocated between
  classifications, not the layer's existence or history.
- Can be held inside more than one kind of Domain over its life without losing its own identity.

**Open:** the exact minimal set of dimensions that make two balance segments the same Rights Layer, or
different ones, is not yet settled (§7).

### 4.2 Domain

**Status:** Operationally Supported.

**Human Meaning:** The system of rules currently governing what can be done with a Rights Layer — for example,
a pension product's rules before retirement, or the income-tax system's rules after a realization event.

**Canonical Definition:** A Domain defines the realization possibilities available to a Rights Layer at a
given time. A Domain does not define the Rights Layer's identity — identity belongs to the Rights Layer, and
survives a change of Domain.

**Characteristics:**

- Before retirement, the relevant Domain is typically a pension product; after a realization event, it shifts —
  for example, to the income-tax system.
- Risk is naturally expressed as a Rights Layer evaluated against its current Domain:
  `Rights Layer × Current Domain → Risk`.

**Open:** no closed taxonomy of Domain types or Domain capabilities exists yet (§7).

### 4.3 Event

**Status:** Operationally Supported.

**Human Meaning:** Something that happens to a Rights Layer or the person holding it — a deposit, a return
credited, a transfer, a correction, a retirement election, a reclassification.

**Canonical Definition:** An Event is a fact that occurred at a point in time and may change a Rights Layer's
state without changing its identity.

**Characteristics:**

- Reality is understood through the sequence of events, not through any single snapshot. Comparing two balance
  snapshots without the events between them produces a meaningless or misleading difference; reconciliation
  requires the events, not just the endpoints.
- Events transform state without necessarily transforming identity: a transfer resets an account's joining
  date but not the money's legal/tax seniority; a reclassification changes an allocation between
  classifications but not the underlying balance or its history.

**Open:** no closed, versioned event taxonomy exists yet (§7).

### 4.4 Realization

**Status:** Operationally Supported.

**Human Meaning:** The moment accumulated rights turn into something the person actually receives or can
receive — a monthly pension payment, a lump-sum withdrawal.

**Canonical Definition:** Realization transforms accumulated rights (a Rights Layer, held in a Domain) into an
actual economic outcome (an income stream or a capital flow), via a Realization Event:

```
Money Rights Layer
  ↓ Realization Event
Income / Capital Stream
  ↓
Tax Domain
```

**Characteristics:**

- **Realization precedes tax analysis.** Rights-fixation (קיבוע זכויות) — deciding how to use the exemption
  entitlement — is a separate, prior operation to the ordinary income-tax calculation. Only after the exempt
  portion is fixed does the remaining taxable amount enter the general tax mechanism.
- Convergence for calculation is not identity merge: three distinct aggregates — Rights Aggregate (same legal
  nature, lineage preserved), Realization Aggregate (payments from one realization event), Tax Aggregate
  (everything entering one period's tax calculation) — must not be collapsed into one gross.

**Open:** only examples of realization events exist (annuity event, capital withdrawal); no exhaustive
taxonomy (§7).

### 4.5 Evidence

**Status:** Operationally Supported as a discipline.

**Human Meaning:** Every statement Goose makes about pension reality should be traceable to where it came
from — a document, a regulation, a real observed case, or a clearly labeled inference.

**Canonical Definition:** Evidence is part of the model, not an afterthought. A canonical statement carries,
alongside its content, a status describing how well-supported it is (§6) and, where practical, a pointer to
its source. Documents represent reality; they do not create it — Goose's canonical reality is reconciled
across documents, not dictated by any single one (§3).

---

## 5. Canonical Distinctions

These distinctions were reasoned through directly in Stage 2 and are canonical Goose language. Each is marked
Operationally Supported: reasoned from real, observed cases (the Deloitte reclassification, the Altshuler →
Mor transfer, the multi-view provider comparison), not yet cross-checked against primary statute text, and
open to refinement — but not tentative in the sense of being unused. Goose applies these now.

**Object versus Domain.** An Object (a Rights Layer, or the new object a realization produces) is not the same
thing as the Domain it is currently evaluated in. Before retirement: `Object = Money Rights Layer`,
`Domain = Pension Product`. After a realization event: `Object = Pension Income Stream`,
`Domain = Income-Tax System`. The Domain changes; the Object's own lineage does not disappear with it.

**Identity versus State.** A Rights Layer's identity — its legal and tax seniority, the shape of the right it
represents — is independent of its state at any moment: current balance, current allocation between
classifications, current administering institution. State changes constantly through Events; identity
persists through them.

**Rights survive operational events.** A transfer between institutions, a change of investment track, or a
reclassification of balance between tax categories does not, by itself, end or restart a Rights Layer's
identity. The Altshuler → Mor transfer is the clearest evidenced case: the account number and joining date
reset, while legal/tax seniority and the shape of the right (capital-portion plus annuity-portion coexisting)
carried through unchanged.

**Realization creates a new object.** A Realization Event does not relabel a Rights Layer as now belonging to
a different Domain. It produces a new object — a Pension Stream, a Capital Flow — whose own identity is
distinct from, but traceable back to, the Rights Layer(s) that produced it.

**Tax analyzes realized objects, not accumulated rights.** The income-tax system never evaluates a Rights
Layer directly. It evaluates the realized object a Realization Event produced from it. This is why realization
precedes tax analysis (§4.4), and why rights-fixation — an allocation decision about the realized object's
exemption — is itself prior to, and distinct from, the ordinary tax calculation that follows it.

---

## 6. Evidence Status vocabulary

| Status | Meaning |
|---|---|
| **Verified** | Directly supported by a primary official/legal source, explicit enough for the claim being made. |
| **Strongly Supported** | An official or clearly authoritative source exists, but exact granularity or a fully closed reading still needs one more primary text. |
| **Operationally Supported** | Supported by a real observed case, a real operational document, or a clearly operational (non-statutory) source — an actual transfer, an actual reclassification, an actual clearinghouse report. |
| **Inferred** | The conclusion follows from sourced structure but is not stated directly anywhere. |
| **Hypothesis** | A reasoned, plausible idea not yet tested against a primary source or a real observed case. Distinct from Unknown: a Hypothesis has a specific, stated shape. |
| **Unknown** | Current evidence does not establish the proposition — a deliberate, stated result. |

`Verified` through `Unknown` are the vocabulary already used in the adjacent Provident Fund legal/regulatory
discovery research. `Hypothesis` is added here to give Goose's language a status for a reasoned idea that has
not yet been tested — several such ideas exist in the discovery record (§7).

This mirrors the Goose Constitution's principle that missing truth is better than false precision: a
Hypothesis or Unknown label is a feature of honest modeling, not a gap to be smoothed over.

---

## 7. Open Topics / TBD

- **Merge rules** — when two balance segments are safely the same Rights Layer versus when apparent
  aggregation is only calculation convergence.
- **Split rules** — when a single reported bucket actually contains more than one distinct right.
- **Domain capabilities** — no closed taxonomy yet for what a Domain does or does not make possible for a
  Rights Layer it holds.
- **Realization taxonomy** — only examples exist (annuity event, capital withdrawal); no exhaustive list.
- **Event taxonomy** — deposits, returns, transfers, corrections are named; no closed, versioned taxonomy.
- **Persistence implications** — explicitly out of scope for Stage 1/2 and this document. Deferred until this
  language is stable enough to derive a model from.
- **Presentation implications** — touched only indirectly (different institutions present the same reality
  differently); no presentation design exists.
- **Holding** — named once in the discovery record, alongside Rights Layer and Domain, and never defined. Its
  relationship to Rights Layer, Account, and Product is open.
- **Identity** — used throughout as a property of the Rights Layer (§5); whether it deserves standing as its
  own concept, independent of Rights Layer, is open.
- **Digital Twin** — no discovery exists yet for this term. Open, unevidenced — a future discovery pass, not a
  defined concept.
- **The fuller risk-reasoning chain** — the evidenced shape of Goose's risk reasoning to date is
  `Rights Layer × Current Domain → Risk`, and a four-factor combined model
  (`Rights Layer × Domain × Realization Event × Person State → Realized Financial Flow × Tax Classification ×
  Rights-Fixation Election × Tax-Year Context → Net Outcome`). Whether a more elaborate chain — naming
  intermediate stages such as an enumeration of possible realizations, or a gap analysis between current and
  possible state — should become canonical is a Hypothesis, not yet reasoned through.

---

*This document should be read alongside `docs/knowledge/provident_fund/PF_STAGE1_STAGE2_DISCOVERIES.md`, which
preserves the discovery history this Foundation is derived from, and
`docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md`, which governs how this document is classified, owned, and
reviewed. This is Draft 0.1 of the Foundation — the governing basis for a separate Canonical Pension Language
document still to be written, not that document itself.*
