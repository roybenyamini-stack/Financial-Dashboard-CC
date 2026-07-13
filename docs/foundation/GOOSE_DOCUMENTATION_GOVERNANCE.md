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

This is the first governance artifact in the Goose Documentation System. It establishes Documentation Governance only. Decision Log, Current Direction, and the RFC workflow are named in §10 as future components of the same system — not designed here. The Boot Protocol is no longer among them: it is designed in `GOOSE_CORE_BOUNDARY.md` and manifested as `GOOSE_BOOT.md` (see §3).

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
| Goose General | `GOOSE_CONSTITUTION.md`, `GOOSE_CORE_BOUNDARY.md`, `GOOSE_DOCUMENTATION_GOVERNANCE.md` (this document), `GOOSE_BOOT.md`, `GOOSE_KNOWLEDGE_ARCHITECTURE.md` (Artifact 005 — see §12); `docs/foundation/templates/**` — the companion-template family for these Foundation and Knowledge Architecture artifacts, mapped once here rather than naming some individually and leaving others implicit: `GOOSE_BOOT_TEMPLATE.md`, `CAPABILITY_TEMPLATE.md`, `KNOWLEDGE_MODEL_TEMPLATE.md`, `KNOWLEDGE_OBJECT_TEMPLATE.md`, `REVIEW_TEMPLATE.md`, `DERIVED_VIEWS.md` |
| Goose Financial | `CLAUDE.md`, and all module/logic documents under `docs/`: `events_module.md`, `pension_logic.md`, `provident_funds_logic.md`, `sliders_module.md`, `system_architecture.md`, `T190_Tax_Rules.md`, `TaxLogic.md`, `study_fund_input_status_contract.md`, `study_fund_input_guide_human.md`; `docs/modules/**` (module-level Capability/Review documents, e.g. `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md` and its companion Review — previously written but unmapped here, closed as of §12); `docs/knowledge/**` — Canonical Knowledge, both tiers: atomic Knowledge Objects and composed Knowledge Models (introduced by §12; see `GOOSE_KNOWLEDGE_ARCHITECTURE.md` §3–4 for the distinction); `israel_tax_rules.md` — Generated View, runtime-loaded by `server.js`'s AI verification/advisor routes; its root location (outside `docs/`) is a code-path coupling, not a governance choice, and is left as-is rather than relocated in this milestone; `ARCHITECTURE_RULES.md` — engineering-standard document (e.g. the no-hardcoding rule), explicitly *not* a Knowledge Object, since it governs code style rather than a business/regulatory rule |
| Roy Reality Lab | `GOOSE_EXPEDITION_1_ASSESSMENT.md` — an evidence-graded audit of this repository's real code and data. It is classified here, not as Goose Financial, because it records repository *truth* discovered through investigation, not product policy or domain rules. No other Roy Reality Lab documents exist yet; this is a known gap, left for a future milestone rather than filled in speculatively here. |
| Classification pending | `Mislaka_Rules.md`, `tech_doc.md`, `guidelines.md`, `specialist_prompts.md`, `audit_report.md` — root-level documents identified as unmapped during the Knowledge Architecture Foundation milestone but not read in that session. Logged here rather than guessed at; see §13. |

### Current Direction and Documentation Governance are complementary

Documentation Governance describes *how* documents are structured, owned, and reviewed. It does not describe *what is currently prioritized* in any layer. That is the role of `CURRENT_DIRECTION.md`, a future governance component (§10). The two are complementary, not hierarchical: Current Direction governs what is currently prioritized in each layer; Documentation Governance governs how durable knowledge is managed. This document must never be read as establishing priority, only process — and Current Direction, once it exists, must never be read as redefining how documents are structured, owned, or reviewed.

---

## 4. SSOT Rules

- Every topic has exactly one owning document. If a second document needs to touch the same topic, it references the owning document — it does not restate the rule in its own words.
- A business rule with a legal, regulatory, or mathematical basis has exactly one canonical Knowledge Object under `docs/knowledge/` (see §12). Any other document, prompt string, or UI string stating the same rule must be a reference or a Generated View carrying a `Derived from:` provenance line — independent restatement is a violation regardless of whether the restatement happens to be correct. This applies within a layer as much as across layers: two Goose Financial documents stating the same rule independently (e.g. `docs/TaxLogic.md` and `israel_tax_rules.md` both stating the Study Fund vesting-exemption rule, in disagreeing forms — see §13) is exactly the failure this rule exists to prevent, not a lesser violation because both documents share a layer.
- Lower layers reference upper layers, never the reverse in substance. `GOOSE_CORE_BOUNDARY.md` may reference this document; this document does not redefine what Goose Core is.
- When an applied, lower-layer rule appears to conflict with an upper-layer principle, the conflict is escalated for review — it is never silently resolved by picking one side. §11 is a live example: a known conflict, logged rather than quietly patched over.
- A cross-reference must name the actual file it points to. A reference to a document that does not yet exist must say so explicitly (as this document does for `CURRENT_DIRECTION.md` and `DECISIONS.md` in §10).

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

This split extends to Knowledge Objects (§12), with one ratified exception: because a Knowledge Object is atomic (one rule), it holds its Builder statement and its Human (Hebrew) statement in the same file rather than splitting into twin documents — splitting a single paragraph of substance across two files is overhead this granularity does not need. This exception applies to Knowledge Objects only; it does not loosen the twin-doc requirement for Capability/Review pairs or any other document type. A Human Guide derived from a Knowledge Object (per `docs/foundation/templates/DERIVED_VIEWS.md`) may only copy its Reality (Human statement) and Explainability sections — never its Mathematical Model verbatim.

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
- **Knowledge Objects** (§12) are Goose Financial documents, with one clarification: ordinary edits to a Knowledge Object's rule content (Reality, Evidence, Model Assumptions, Mathematical Model, Confidence, etc.) require Product Owner approval only, following the general Goose Financial rule above. Chief Architect approval is additionally required only when the Knowledge Object *template's own structure* (`docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md`) is being changed — not when an ordinary tax-law or business-rule update is made within the existing structure. This keeps routine domain-content edits from false-triggering the higher architectural approval bar.

---

## 9. Documentation Completion Rule

A documentation task is complete only when all of the following hold:

1. The document lives at the correct hierarchy layer (§3).
2. It contains no content duplicated from another document — whether that document sits at another layer or the same layer — only references or, for a Knowledge Object's Derived Views, copies made under the provenance convention in `docs/foundation/templates/DERIVED_VIEWS.md`. Same-layer duplication is not a lesser violation than cross-layer duplication (see §4's Study Fund vesting-exemption example).
3. It carries the header metadata required for its layer (version, status, and — for Goose General — the reviewer byline from §7).
4. Every cross-reference in it resolves to a real, existing file.
5. It has been explicitly acknowledged per the Approval Workflow (§8) appropriate to its layer.

A document that is written but not yet acknowledged per §8 remains in **Draft** or **Reviewed** status — it is not to be described as complete or as the SSOT for its topic until approved.

---

## 10. Deferred Governance Milestones (referenced only)

The following are approved future milestones of the Goose Documentation System, deferred rather than designed here — not open questions, but components already accepted as part of the system's direction. (`GOOSE_BOOT.md` was previously listed here; it is no longer deferred — it exists as Artifact 004, mapped in §3.)

- **`DECISIONS.md`** — a future decision log recording architectural and product decisions over time.
- **`CURRENT_DIRECTION.md`** — a future document setting the operational compass and priorities for each layer. As stated in §3, it is complementary to this document, not superior to it: it governs *what matters now*, while this document governs *how documentation is structured and reviewed*.
- **RFC workflow** — a future proposal process for changes to Goose Core, tying into the "Extension Rules" already defined in `GOOSE_CORE_BOUNDARY.md`.

---

## 11. Known Documentation Debt

`GOOSE_CONSTITUTION.md` currently defines Goose in inherently financial terms throughout — its "Why Goose Exists" section and its examples are all drawn from Israeli pension and tax reality. This was accurate when Goose had no layered architecture. It is no longer accurate: under the approved identity (Goose General → Goose Financial → Roy Reality Lab), Goose General must never be defined as a financial product — that framing now belongs to Goose Financial.

This is recorded here explicitly, on the record, rather than left for a reader to notice on their own (per §2's philosophy that staleness must be stated, not silently preserved). Reconciling `GOOSE_CONSTITUTION.md`'s framing with this identity is a known future revision. It is out of scope for this milestone, which is documentation governance only.

---

## 12. Knowledge Architecture

See `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` (Artifact 005) for what Canonical Knowledge, Knowledge Objects, Knowledge Models, Documentation Views, and Knowledge Consumers are, why documentation is treated as a generated view rather than a source, and the Model-Assumptions-vs-Simulation-Assumptions distinction. This section states only the governance consequences of that philosophy, which are already codified elsewhere in this document rather than restated here: the layer mapping for `docs/knowledge/**` and `docs/modules/**` (§3), the same-layer SSOT duplication rule (§4), the Builder/Human combined-file exception for Knowledge Objects (§6), the approval-workflow clarification for ordinary rule-content edits versus template-structure changes (§8), and the Documentation Completion Rule's same-layer-duplication check (§9).

Two templates — `docs/foundation/templates/CAPABILITY_TEMPLATE.md` and `docs/foundation/templates/REVIEW_TEMPLATE.md` — formalize the module-level orchestration/review pattern already proven by `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md` and its companion Review document; neither changes those documents' content, only their registration in §3. `docs/foundation/templates/KNOWLEDGE_OBJECT_TEMPLATE.md` and `docs/foundation/templates/KNOWLEDGE_MODEL_TEMPLATE.md` are the two Canonical Knowledge templates (atomic rule and composed model, respectively — see `GOOSE_KNOWLEDGE_ARCHITECTURE.md` §3–4 for the distinction); `docs/foundation/templates/DERIVED_VIEWS.md` defines the Documentation View types, the Knowledge Consumer taxonomy, and the provenance-comment convention that ties a view back to its canonical source.

---

## 13. Known Documentation Debt (Knowledge Architecture)

Two items are logged here on the record, per §2's philosophy of stating staleness/gaps explicitly rather than leaving them for a reader to discover, both surfaced by the Knowledge Architecture Foundation milestone and explicitly deferred rather than resolved by it:

**The Study Fund vesting-exemption conflict — reframed by the Study Fund Tax Knowledge milestone.** The Study Fund vesting-exemption tax rule was stated independently in at least four places that disagreed with each other: `docs/TaxLogic.md` §3.1/§5.1 (a binary full-exemption rule, plus a stale `effectiveTaxCoeff` formula), `israel_tax_rules.md` (the same binary rule, but a formula that matches live code instead), the live behavior of `_sfCalculateTax`/`_sfRecalculate` in `app.js` (a partial `SF_MIXED` exemption, and a third variant in the PDF-verified path with no vesting check at all), and the AI advisor's hardcoded system-prompt phrasing in `server.js`. Full citations remain in `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md` §1.9, Risk 1, and Question 1 (now annotated with this entry's status).

This entry is written in three parts, per the project's own practice of stating exactly what is resolved, what remains open, and what would close it — not a blanket "resolved" claim:

1. **What conceptual confusion is resolved:** the four-way conflict's framing as a single binary "fund becomes exempt after 6 years" rule conflated two separable claims — withdrawal-eligibility (liquidity) and tax-bucket taxability. `docs/knowledge/study_fund/SF_LIQUIDITY_TAX_SEPARATION.md` (`SF-LIQUIDITY-TAX-SEPARATION`) states this separation as Goose's own product-design decision (Roy-confirmed), supported by real annual-report evidence (`docs/knowledge/study_fund/SF_B8_TAX_RIGHTS.md`, independently inspected this milestone) showing the actual tax-tier bucket classification carries no seniority or age field — buckets are classified purely by deposit era and ceiling position. The `effectiveTaxCoeff` formula conflict (the second, narrower discrepancy in this entry) is separately resolved by having exactly one canonical statement now: `docs/knowledge/study_fund/SF_TAX_SENSITIVITY_COEFFICIENT.md`.
2. **What arithmetic/legal question remains unresolved:** whether Israeli tax law imposes a seniority/age-based exemption mechanism that applies at actual withdrawal, separate from and not visible in the deposit-era/ceiling bucket classification an annual report shows — and if so, how the code should apply it. This is explicitly **Unknown**, not resolved, not superseded — see `SF-LIQUIDITY-TAX-SEPARATION` §10–§11.
3. **What evidence would close it:** annual reports can strengthen the *operational* evidence of how tax buckets are classified and preserved (as this milestone's independently-inspected, multi-year, cross-provider evidence now does) but cannot, alone, establish the *governing legal rule* for what happens at withdrawal. Closing this requires a primary legal/regulatory source (the statutory text of the relevant reform) or a suitably authoritative professional source.

The nine Knowledge files are registered under `docs/knowledge/study_fund/` (see `docs/knowledge/study_fund/README.md`); `docs/TaxLogic.md` and `israel_tax_rules.md` have not yet been reduced to references — that migration remains a future step, not performed by this milestone, which produced Canonical Knowledge only.

**Unclassified root-level documents.** `Mislaka_Rules.md`, `tech_doc.md`, `guidelines.md`, `specialist_prompts.md`, and `audit_report.md` were identified as unmapped in §3's layer table during this milestone, but were not read in the session that produced it — so they are logged here as "classification pending" rather than assigned a guessed layer. Resolving their classification is deferred to a future milestone.

---

*This document should be read alongside `GOOSE_CONSTITUTION.md` and `GOOSE_CORE_BOUNDARY.md`. It governs how Goose documentation is managed — it does not define what Goose is or what belongs in its Core.*
