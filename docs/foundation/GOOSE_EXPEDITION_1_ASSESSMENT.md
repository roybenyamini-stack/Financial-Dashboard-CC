# Goose Architecture Assessment — Expedition 1

**Version:** E1-1.1
**Status:** Evidence-Based Architectural Assessment — **Approved**
**Scope:** Repository Understanding Only
**Author:** Claude Code
**Reviewed by:** ChatGPT (Chief Architect)
**Product Owner:** Roy

---

This document is the official architectural assessment produced by Expedition 1: repository understanding and architectural review only. It contains no field renames, no adapter designs, no migration code, no phase sequencing, and no RFC. Everything below is either (a) evidence observed in the repository, graded by the Evidence Level scale below, or (b) an explicitly labeled hypothesis, question, or recommendation for later validation. No code has been modified as part of producing this document. This revision (E1-1.1) makes no change to any architectural conclusion, finding, or recommendation carried over from E1-1.0 — it adds an evidence-level classification, an assumptions section, and per-section confidence ratings for traceability.

---

## Evidence Levels

Every significant finding in this document is graded against one of three levels:

**Evidence Level A** — Verified directly during this review. The specific line(s) of source were read or executed against in this session (via file reads or targeted searches performed in this conversation) and the finding follows directly from that inspection.

**Evidence Level B** — Supported by repository evidence but not independently re-verified in this review. This includes claims grounded in project documentation (`docs/*.md`, `CLAUDE.md`, `ARCHITECTURE_RULES.md`) treated as the project's own source of truth, or code-adjacent evidence that was read in a related but not identical form to the exact claim made.

**Evidence Level C** — Reported by earlier repository exploration and explicitly not re-verified. These findings originate from automated exploration passes conducted earlier in this engagement (separate research agents that searched and read the repository and returned file:line citations). They are included because they are materially useful and internally consistent with directly-verified evidence, but they have not been independently re-confirmed against source in this final document.

Where a finding is not evidence at all — an assumption, an open question, a hypothesis, or a recommendation — it is labeled as such instead of graded, per §Assumptions and the relevant sections below.

---

## Assumptions

The following assumptions were necessary to produce this assessment and are distinguished here from both evidence and unknowns. An assumption is a premise taken as given for the purpose of this review; an unknown (as used in §H) is a specific open question the review identified but did not resolve.

- The current state of the repository, as reviewed, is assumed representative of the production application. No separate production deployment or production data store was inspected independently of this repository's own files.
- Historical `localStorage` data from real users was not available for inspection. All statements about stored data shape are inferred from the code that reads and writes it, not from observation of actual stored records.
- External import/export tools, browser extensions, saved bookmarklets, or manual JSON paste workflows operating outside this repository were not inspected and are assumed either not to exist or not to materially affect the findings, pending confirmation (see §J, question 6).
- Findings reported by earlier automated exploration passes (Evidence Level C) are assumed accurate unless explicitly re-checked and marked otherwise in this document.
- Line-number references reflect the repository state at the time of review. `app.js` is a large, frequently and incrementally edited file (per its own internal version-comment history), so line numbers may drift with subsequent edits and should be treated as pointers to be re-located, not permanent coordinates.
- Absence-of-evidence findings (e.g., "no writer was found for field X") rely on text-search/grep methodology and are assumed not to be masked by dynamically constructed property names, code outside the files searched, or logic that has since been removed from the codebase — this assumption is explicitly flagged as a limitation wherever such a finding appears.
- Project documentation (`docs/*.md`, `CLAUDE.md`, `ARCHITECTURE_RULES.md`) is assumed to accurately reflect the project's intended domain rules and architecture. Where this was cross-checked against code in earlier exploration and found closely consistent, that is noted; full exhaustive re-verification of every documentation claim against every line of code was not repeated in this final review.

---

## A. Current System Map

`app.js` (21,244 lines, single global-scope file, no build system) contains five informally-named function clusters that each read and/or write some notion of "the person's financial holdings":

- `ffs*` (manual data-entry drawer) — investments and pension modals, drawer card rendering (`ffsRenderSection`), master-grid support.
- `_salkah*`/`salkah*` — Mislaka/Salkah pension-clearinghouse XML import.
- `sim*` — the Simulator engine (`simRunEngine`) and chart-layer rendering.
- `_t190*`/`_t190Sim*` — Amendment-190 (תיקון 190) provident-fund bucket logic and its dedicated AI extraction flow.
- `cf*`/`pension*`/`cm*` — Excel-driven legacy tabs (Cashflow, Pension, Investments category modal), operating on entirely separate global stores.

*[Evidence Level C — this cluster inventory was produced by earlier repository exploration passes and not independently re-derived function-by-function in this review.]* No shared constructor, factory, or type definition for "an investment" or "a pension item" was found anywhere in the file during those passes. Every write site examined independently builds a raw JavaScript object literal.

**Confidence: Medium.** *Reason: the high-level cluster structure and the "no shared constructor" finding are internally consistent and were cross-referenced across multiple independent exploration passes, but were not exhaustively re-verified by direct reading of all ~250 clustered functions in this final review.*

---

## B. Existing Data Stores and Lifecycles

| Store | Declared | Written by | Read by | Persistence | Relationship to `FFS_PROFILE` | Level |
|---|---|---|---|---|---|---|
| `FFS_PROFILE.investments[]` / `.pension[]` | `app.js:7944` | 5 pipelines (§C) | `renderMasterGrid`, `ffsRenderSection`, `simRunEngine`, T190/StudyFund modals, `buildFFSContext` (AI chat) | `localStorage`, key managed via `ffsGetActiveKey()`/`ffsLoadProfile`/`ffsSaveProfile` | — (this is the object under review) | B |
| `FUNDS` (object literal) | `app.js:39-71` | Legacy Excel "Investments" sheet parser; `_dashRestoreAssets` on load | Investments-tab category modal (`cm*`), some `sim*` capital-total functions | `localStorage` (separate key) | Not merged into `FFS_PROFILE`. Functions such as `simGetRoyCapital` appear to select `FUNDS` **or** `FFS_PROFILE.investments` based on `isExcelLoaded()` — an if/else data-source switch, not a join. | C |
| `PENSION_ASSETS[]` | `app.js:6458` | Excel pension-sheet parser (`pensionParseWorkbook`) | Pension tab, Overview cards, `buildPnsContext` | `localStorage` (separate key) | Not merged into `FFS_PROFILE.pension`, and gated as mutually exclusive with it via `isExcelLoaded()`/`APP_MODE`. Appears to represent the same conceptual real-world entity (pension/insurance policy) under a materially different field vocabulary — see §D. | C |
| `CF_DATA[]` | `app.js:4404` | Excel "שוטף חדשי" cashflow-sheet parser | Cashflow tab, several `sim*` monthly-flow functions | `localStorage` (separate key) | Structurally distinct — per-month income/expense rows, not asset balances. Out of scope for any entity-schema discussion. | C |

`FUNDS`, `PENSION_ASSETS`, and `CF_DATA` are legacy stores tied to "EXCEL mode." `FFS_PROFILE.investments/.pension` is tied to "SIMULATOR mode" (manual entry / imports). The two universes are switch-selected by app mode and, based on the code paths reviewed, never simultaneously active.

**Unknown:** whether historical/legacy data in `PENSION_ASSETS` has ever been manually re-entered into `FFS_PROFILE.pension` by a user switching modes, which would create latent duplicate real-world entities under different field names. Not established by this expedition.

**Confidence: Medium.** *Reason: the mode-switch/never-merged relationship is reported consistently by earlier exploration (Level C) and is architecturally significant, but the underlying `isExcelLoaded()`/`APP_MODE` gating logic was not independently re-traced line-by-line in this final review.*

---

## C. The Five Write Pipelines Identified

| # | Pipeline | Entry point(s) | Writes to | Level |
|---|---|---|---|---|
| 1 | Manual entry via FFS drawer modals | `ffsSaveInvFromModal` (app.js:16621), `ffsSavePensionFromModal` (app.js:9154) | `FFS_PROFILE.investments[]` / `.pension[]` directly | A (literal sites at 16827-16839 and 9186-9237 were read directly in this session) |
| 2 | Mislaka/Salkah XML import (regex path + AI fallback) | `_salkahParseOneXML` (app.js:16994), `_salkahFallbackToAI` (app.js:17326) → `processMultipleSalkahFiles` (app.js:17166) | `FFS_PROFILE.investments[]` / `.pension[]` directly | A for the investments-push literal (read directly at ~17270-17295 in this session); C for the pension-push literal and the AI-fallback shape |
| 3 | AI vision extraction (image/PDF) | `ffsExtractFromImage` (app.js:17643) → external Cloudflare Worker → `ffsImportAssets` (app.js:10011) | `FFS_PROFILE.investments[]` / `.pension[]` directly | C |
| 4 | PDF tax-tier parsing | `_sfHandlePdfFile`/`parseAnnualReportPDF` (app.js:19231) → `server.js` `/api/parse-pdf` → `_sfSavePdfData` (app.js:19282) | Not `FFS_PROFILE` — a separate `localStorage['sf_pdf_data_'+assetNum]` key, cross-referenced by `assetNum` only at render time | C |
| 5 | T190-bucket AI extraction | `_t190OpenAIExtractionModal`'s file handler → `server.js` `/api/extract` → DOM form fields → (on Save) `ffsSaveInvFromModal` | `FFS_PROFILE.investments[].buckets`, but only indirectly, via pipeline 1's save path | C |

No pipeline observed in this review calls a shared object constructor; each of pipelines 1–3 (and pipeline 5's eventual save) independently builds its own object literal at its own call site, based on the code read during this expedition.

**[Evidence Level C]** Pipeline 1 alone appears to have two non-identical code paths for constructing a "pension item" — the dedicated pension modal (`ffsSavePensionFromModal`, literal at app.js:9186-9237, directly read this session) and the investment-modal's "move to pension" context (`ffsSaveInvFromModal`, literal at app.js:16692-16710, not directly re-read in this session) — which do not produce the same set of fields.

**Confidence: Medium.** *Reason: the pipeline count and two of the five entry points (manual entry, Salkah investments-push) were independently spot-checked against source in this session; the AI vision, PDF tax-tier, and T190-bucket pipelines rest on earlier exploration and were not re-traced end-to-end here.*

---

## D. Confirmed Schema Dialects (presented without normalization)

The following are observations of currently-coexisting field-naming differences. No recommendation is made here about which name is "correct" or should ultimately be used. They are listed so the inconsistency is visible as evidence, not proposal.

| Concept | Investments dialect | Pension dialect | Evidentiary status | Level |
|---|---|---|---|---|
| Identifier | `assetNum` (app.js:16830, directly read this session) | `accountNum` (app.js:9188, directly read this session) | These are the field names directly observed at the cited literal-construction sites. Not established: whether the two fields are guaranteed unique within their respective arrays, whether either is ever reused/recycled, or whether Salkah's upsert-match logic keys identically on both sides (see §H — this last point is an unknown, not graded). | A (field names at cited sites); unknown (uniqueness/lifecycle) |
| Amount | `balance` | `accumulation` | Directly verified in this session for two of the five pipelines: for manual entry, both UI input labels explicitly read "צבירה (K ש״ח)" (index.html:2703) and "הון צבור (K ₪)" (index.html:3004-3006), and `renderMasterGrid` multiplies both `item.balance` and `item.accumulation` by 1000 before display (app.js:17501, 17540) — i.e. both are stored in thousands-NIS ("K") for the manual-entry pipeline, and the Salkah XML pipeline's push site assigns `balance: balanceK` (app.js, Salkah investment-push literal, directly read this session), consistent with the same convention. Not independently re-verified in this review for the AI-vision-import pipeline (`ffsImportAssets`) or for T190-bucket-derived amount fields. | A (manual entry, Salkah investments); C (AI vision, T190) |
| T190 bucket amounts | `buckets.{qualifying_annuity, recognized_annuity, capital_exempt}` (each `.balance_k`, a shape documented in `docs/provident_funds_logic.md`, built by `_t190InitBuckets()`) | — | This is the shape reported as persisted in-app by earlier exploration and cross-referenced against project documentation. The Salkah XML parser is reported to populate the same shape. The `/api/extract` AI route (server.js:731) is reported to return a differently-named flat shape: `{qualifying_annuity, recognized_annuity, exempt_capital, recognized_principal, dec_31_anchor}` — note `exempt_capital` vs. `capital_exempt`, `recognized_principal` vs. `principal_manual_k`, `dec_31_anchor` vs. `dec_31_anchor_k`. The naming difference is identified from repository evidence; whether the underlying tax/regulatory concept is identical or subtly different is a domain question, not a code question (see §J). | B (bucket shape, per documentation) / C (server route return shape, per earlier exploration) |
| PDF-tier amounts | `_pdfData.{exemptPrincipal, exemptProfit, taxablePrincipal, taxableProfit, taxableProfit15/20/25}` (raw, server-returned) → separately converted via `_sfPdfToSegments` into a `{tikrat, deposits, accumulation}` segment-array shape used only inside the tax engine | — | Reported by earlier exploration as a fourth distinct vocabulary for what may or may not be the same underlying "how is this balance split by tax treatment" concept as the T190 buckets. Whether `tikrat` segments and T190 `buckets` represent the same regulatory partition or two different partitions is an open domain question, not resolved by this expedition. | C |
| Track/type | `type` (the only field observed with a write site, e.g. app.js:16833) | — | `renderMasterGrid` (app.js:17500) contains a fallback chain referencing `item.trackName`, `item.track`, `item.maslul`, `item.maslulName`, `item.maslul_name` in addition to `item.type`. A repository-wide grep (performed during earlier exploration) found no write site for any of the five alternate names — this is an absence-of-evidence finding, not a proof of non-existence (see §Assumptions). No removal or cleanup of these fields is proposed here. | C |
| Manager/Bituach-Menahalim signal | `isBituachMenahalim` (boolean) and `pensionType` (`'pension'\|'manager'\|'gemel'`) coexist on the same pension item | — | Both fields are directly observed, in this session, to be checked together (not exclusively) at two specific sites (`renderMasterGrid`:17559-17560 and `simRunEngine`:11291). Whether any code path elsewhere resolves a disagreement between the two fields was not exhaustively searched in this session. CLAUDE.md states `isBituachMenahalim` "takes absolute priority" as a project rule, but this is a stated UI-labeling rule in project documentation, not something independently confirmed in this review as being enforced identically by every consumer (see §E, §G). | A (coexistence at the two cited sites); B (CLAUDE.md's stated rule); unknown (whether any conflict-resolution logic exists elsewhere) |

**Confidence: Medium-High.** *Reason: the two most decision-relevant dialect claims — the exact identifier field names used in the manual-entry literals, and the K-NIS unit convention for 2 of 5 pipelines — were independently verified against source in this session. The remaining rows (T190/PDF-tier vocabularies, the dead track/type fields) rest on earlier exploration or project documentation and were not re-checked line-by-line here.*

---

## E. Confirmed Readers and Fallback Chains

Multiple independently-written consumer functions read `FFS_PROFILE.investments/.pension` with their own separate assumptions about field names, based on the code examined in this review:

| Reader | Location | Observed logic (verbatim behavior, not proposal) | Level |
|---|---|---|---|
| `renderMasterGrid` | app.js:17490-17605 | Identifier: `item.assetNum \|\| item.accountNum` (17496). Display name: `item.provider \|\| item.name` (17497). Manager grouping (17559-17560): `x.pensionType === 'manager' \|\| x.isBituachMenahalim` for the "managers" bucket; the complementary "pensionAll" bucket is `x.pensionType !== 'manager' && !x.isBituachMenahalim` — i.e. `gemel`-type items land in the general pension bucket here. | A — directly read this session |
| `simRunEngine` | app.js:11280-11299 | Manager-item selection (11291): `p.pensionType === 'manager' \|\| p.pensionType === 'gemel' \|\| p.pensionType === 'ביטוח מנהלים' \|\| p.isBituachMenahalim` — a four-way condition, one arm of which (`pensionType === 'ביטוח מנהלים'`) matches a literal Hebrew string that no producer examined was observed to ever assign to `pensionType` (producers observed only assign `'pension'`, `'manager'`, `'gemel'`). | A — directly read this session |
| `ffsRenderSection` | app.js:~9908-9909 | Reads `item.provider` and `item.accountNum` directly with no fallback to `item.name`/`item.assetNum`. | C |
| `buildFFSContext` (AI chat context) | app.js:8634-8668 | No field-name fallback at all; falls back to a hardcoded generic label (`'נכס'`/`'פוליסה'`) when `name` is absent, rather than searching alternate fields. | C |
| `ffsOpenStudyFundModal` | app.js:17784-17800 | Looks up an item by `id`; if not found, retries by `assetNum`. | C |
| `ffsOpenT190SimulationModal` | app.js:~17934-17960 | Looks up an item by `id` only — no retry-by-`assetNum` fallback observed. | C |
| `simGetPhoenixLayerName` / `simGetHarelLayerName` | app.js:8720-8755 | Own `provider \|\| name` fallback, independently written from `renderMasterGrid`'s equivalent. | C |
| `simRenderChart` | app.js:11696-11699 | Own fallback in the opposite priority order: `name \|\| provider \|\| 'פנסיה'`. | C |

The two manager-item predicate implementations shown above (`renderMasterGrid` and `simRunEngine`) were both directly read and compared in this session and are confirmed to disagree on `gemel`-type items — this is the one finding in this section rated Evidence Level A. The remaining rows reflect an earlier exploration pass and are presented at Evidence Level C.

**Confidence: Medium.** *Reason: the single most decision-relevant comparison in this section (the two manager predicates) is Level A and was independently verified; the broader reader inventory (6 of 8 rows) rests on Level C evidence not re-checked in this final review.*

---

## F. Natural Goose Boundaries Already Present in the Repository

Observations of where the codebase already appears to draw a line, without any code change:

- **Reality vs. Evidence, partially.** `_pdfData` (per-`assetNum`, sourced from server-parsed annual-report PDFs) is kept in a storage location physically separate from `FFS_PROFILE`, and is treated at render time as a distinct, cross-referenced input rather than being merged into the entity record. This is a naturally-occurring separation between "a holding" (in `FFS_PROFILE`) and "evidence about that holding's tax composition" (in `_pdfData`) — whether this was a deliberate design choice or an artifact of how the PDF-parsing feature was added incrementally is not established. *[Level C]*
- **Parsing vs. entity storage.** All PDF/XML text-extraction happens in `server.js` or in the `_salkah*` cluster and produces intermediate shapes (Hebrew-keyed "products" objects, raw PDF JSON) before anything is written into `FFS_PROFILE`. This intermediate-shape step is a natural seam, already present, between "what a document says" and "what the app's ledger holds." *[Level C]*
- **EXCEL mode vs. SIMULATOR mode.** The mutual exclusivity of `FUNDS`/`PENSION_ASSETS`/`CF_DATA` versus `FFS_PROFILE`, gated by `isExcelLoaded()`/`APP_MODE`, is itself a boundary — currently a mode switch rather than a data model boundary, but it demonstrates the codebase already has a notion of "two different representations of a person's holdings that don't talk to each other." *[Level C, per §B]*
- **Provenance markers already exist informally.** `needsReview`, `manual_override`, `last_manual_update_date`, `override_source`, and an auto-populated `notes` field (e.g. `'מסלקה: ' + productName` on import) are observed as existing fields that function as ad hoc, partial evidence/provenance tracking on individual entity records — narrower in scope than a full Evidence model, but a real precedent already present in production code. *[Level C]*

These are observations, not a proposal to extract them — see §I.

**Confidence: Low-Medium.** *Reason: these are interpretive architectural observations built on top of underlying evidence that is itself mostly Level C. They are useful for framing the Goose-alignment discussion but have not been independently re-derived from source in this review, and the "deliberate vs. incidental" question for each is explicitly left open.*

---

## G. Confirmed Drift Bugs

Behavior in this section is graded individually by how it was verified:

1. **`ffsRenderSection` may render a blank identifier/name for a pension item.** *[Level C]* Reported that because it reads `item.provider`/`item.accountNum` with no fallback, an item that only has `assetNum` populated (e.g., one that arrived via the investments→pension move path, which per §C does not consistently populate `accountNum`) would show blank fields here, even though `renderMasterGrid` would resolve the same item via its `assetNum || accountNum` fallback.
2. **`ffsOpenT190SimulationModal` appears to lack the id→assetNum retry fallback that its sibling `ffsOpenStudyFundModal` has.** *[Level C]* Identified by comparison of the two functions during earlier exploration; not established whether this has caused an observed user-facing failure (no incident report was found — this is a structural inconsistency, not a reported incident).
3. **Two different "manager item" predicates produce different results for `gemel`-type pension items.** *[Level A]* Directly confirmed in this session by reading both functions: `renderMasterGrid` groups `gemel` items under the general pension bucket; `simRunEngine` groups them as manager-like items with their own chart layer. This is a present-tense state of the running application, not a hypothetical.
4. **At least 3 of 4 identified investments↔pension conversion code paths appear not to preserve `_originalCategory`/`_originalType`/`_originalLiquidity`** state when moving an item. *[Level C]* This count is reported from an earlier exploration pass and has not been independently re-verified line-by-line in this final review.
5. **Fallback references exist for fields with no write site identified** (`trackName`, `track`, `maslul`, `maslulName`, `maslul_name` in `renderMasterGrid`; `item.moedNezilut` in a Study Fund modal; `a.type` on `PENSION_ASSETS` items). *[Level C, absence-of-evidence — see §Assumptions]* No removal is proposed.

**Confidence: Medium.** *Reason: one of five items (item 3, arguably the most product-relevant, since it produces a visibly different grouping today) is Level A and independently verified. The remaining four rest on Level C evidence and would benefit from independent re-verification before being treated as fully settled.*

---

## H. Risks and Unknowns

**Material risk — no automated test coverage.** *[Level C]* It is reported that no test framework (jest/mocha/etc.) exists in `package.json` or `node_modules`, and no `test` script is defined there. The `test-*.js` scripts present in the repository appear to hand-duplicate parsing logic rather than import it, and are run manually rather than in CI. This must be stated plainly: manual, ad hoc verification of any future change to this data model is not equivalent to regression protection. A manual pass can show that a specific scenario renders correctly at a specific point in time; it cannot demonstrate the absence of a regression in a code path not manually exercised, nor guard against regressions introduced later by unrelated changes. Any future work in this area carries materially higher risk than it would in a codebase with automated coverage, and this risk should be weighed explicitly before further work is approved.

**Unresolved: whether visually-identical field names carry identical meaning.** This expedition does not assume `balance`, `accumulation`, `assetNum`, and `accountNum` are semantically interchangeable merely because they occupy analogous structural positions. What is directly confirmed (Level A) and what remains at Level C is stated field-by-field in §D.

**Unknown: upsert/match-key behavior.** `processMultipleSalkahFiles` is reported *[Level C]* to "find/update an existing item by assetNum/accountNum match" when reconciling a re-imported XML file against existing records. Which exact field is used as the match key for pension items specifically, and whether that could cause a false match if `assetNum`/`accountNum` are inconsistently populated, was not independently re-verified in this review.

**Unknown: historical/backward-compatibility exposure.** This expedition examined the current state of `app.js` only (see §Assumptions). It has no visibility into prior versions of the file, exported/backed-up JSON a user might re-import, or external systems writing into this structure. This is a meaningful blind spot for any future schema-related effort.

**Unknown: regulatory/domain equivalence.** Whether the T190 bucket concept and the PDF-tier `tikrat` segment concept represent the same underlying tax partition, a related-but-distinct one, or two genuinely independent regulatory concepts is a tax-domain question this architectural review cannot answer from code alone (§D, §J).

**Stated preference, not architectural conclusion.** In an earlier working discussion, Roy indicated a preference that, if legacy field names (`balance`/`accumulation`/`accountNum`) are ever supplemented with new canonical names in some future effort, the old names should continue to be written indefinitely ("permanent dual-writing") rather than eventually retired. This is recorded as Roy's stated current preference, not as an evaluated or approved architectural decision — no canonical field names have been proposed for approval by this document. This is not evidence and is not graded.

**Confidence: Medium-High.** *Reason: the existence and severity of the no-test-coverage risk is well-supported and low-complexity to confirm, even though the specific check was performed during earlier exploration (Level C) rather than re-run in this session. The remaining items in this section are explicitly framed as open unknowns rather than findings, so a confidence rating applies to the framing of the risk, not to a resolved fact.*

---

## I. Candidate Extraction Opportunities

*These are architectural hypotheses based on the current repository. They are not implementation recommendations and do not imply approval for future changes. Hypotheses are not evidence and are not assigned an Evidence Level; each rests on the graded evidence cited in the sections above.*

- **Hypothesis:** a single shared constructor/factory for investment and pension entities could reduce the divergence caused by 5 independent write pipelines each building raw object literals. Not decided: what fields it would contain, what they'd be named, or whether investments and pension items should share one constructor or two related ones.
- **Hypothesis:** a single shared "display name" resolution function could replace the several independently-written fallback chains observed in §E. Not decided: what priority order it should use — the existing implementations disagree with each other, so any chosen order would be a judgment call requiring sign-off, not a neutral technical fact.
- **Hypothesis:** a single shared "is this a manager-like item" predicate could remove the disagreement documented in §G (item 3, Level A). **Explicitly unresolved:** unifying the two implementations would visibly change which grid section a real user's `gemel` item appears under. This is preserved here as an open product decision, not included in any default future scope. Any future proposal touching this must surface the visible behavior change explicitly and obtain a separate decision before implementing it.
- **Hypothesis:** reconciling `PENSION_ASSETS` (Excel-mode) and `FFS_PROFILE.pension` (Simulator-mode) field vocabularies could be worthwhile, given they appear to represent the same real-world entity type today under disjoint names. Not decided: whether this is worth doing at all, given the two modes are not simultaneously active in normal use.
- **Hypothesis:** an explicit "Evidence" concept could generalize the informal provenance fields already observed in §F (`needsReview`, `manual_override`, `last_manual_update_date`, `override_source`). Not decided: scope, or whether this should be pension/investment-specific or a Core-level concept per the Goose Foundation vision documents.

**Confidence: N/A.** *Reason: this section contains explicitly labeled hypotheses, not verified findings, so a confidence rating on the findings themselves does not apply. Each hypothesis's plausibility is only as strong as the underlying evidence cited in §A–§H.*

---

## J. Questions Requiring Roy's Domain Validation

1. Do `assetNum` (investments) and `accountNum` (pension) represent the same real-world thing (a policy/account number) with the same uniqueness/lifecycle guarantees, or are there cases where they behave differently?
2. Is a `gemel`-type pension item, from a real financial-planning perspective, more like a "manager insurance" capital asset or more like a general pension — i.e., should `renderMasterGrid`'s current grouping or `simRunEngine`'s current grouping be treated as the more correct one, or do they legitimately serve different purposes?
3. When `isBituachMenahalim` and `pensionType` disagree on a real record (if this has ever happened), which should win, and how would such a record have arisen?
4. Are the T190 buckets (`qualifying_annuity`/`recognized_annuity`/`capital_exempt`) and the PDF-tier `tikrat` segments the same regulatory partition of a balance, or two distinct classifications?
5. Has any user ever manually re-entered the same real-world holding into both `PENSION_ASSETS` and `FFS_PROFILE.pension` across a mode switch, creating a latent duplicate?
6. Is there any external system or manual process that reads or writes `FFS_PROFILE` data using field names not reflected in the current `app.js`, that this expedition would not have visibility into?

**Confidence: N/A.** *Reason: this section is a set of open questions, not findings — no confidence rating applies.*

---

## K. Recommended Scope for the First Future RFC

This is a recommendation, not a decision. Should a future RFC arise from this expedition, it is suggested that it be scoped narrowly enough to be independently reviewable, and that it explicitly not bundle the open product question in §I (manager/`gemel` grouping) into its default scope. Suggested narrow starting scope for that future RFC to investigate and propose — still requiring its own evidence and Roy's approval before any code changes:

- Resolving §J's identifier-semantics question (`assetNum`/`accountNum`) with domain input.
- Independently re-verifying (not assuming) the amount-field unit convention across the two pipelines not checked in this expedition (AI vision import, T190-bucket flow).
- Proposing a test/verification strategy appropriate to the confirmed absence of automated coverage (§H) — resolved before, or explicitly alongside, any schema-related RFC.
- Explicitly listing the `gemel`-grouping decision (§I) as a separate, standalone decision item requiring Roy's direct sign-off.

No further planning beyond identifying this scope is in order until this Expedition 1 assessment itself is reviewed and approved.

**Confidence: N/A.** *Reason: this section is a forward-looking recommendation about scope, not a finding — no confidence rating applies.*

---

## Evidence Sources

This assessment draws on two kinds of evidence: (a) direct inspection performed in this session (via file reads and targeted searches against the live repository — Evidence Level A), and (b) findings reported by earlier exploration passes over the same repository, or supported by project documentation (Evidence Levels B/C), which are labeled as such throughout this document.

**Application code:**
- `app.js` — the single frontend file, including: `FFS_PROFILE` declaration (~7944); manual investment modal (`ffsSaveInvFromModal`, ~16621-16850); manual pension modal (`ffsSavePensionFromModal`, ~9154-9240); Salkah/Mislaka XML import (`_salkahParseOneXML`, `processMultipleSalkahFiles`, `_salkahFallbackToAI`, ~16994-17392); AI vision extraction and import (`ffsExtractFromImage`, `ffsImportAssets`, `ffsApproveAsset`, ~10011-10118, ~17643-17721); T190 AI extraction (`_t190OpenAIExtractionModal`, ~18800-18890); master grid rendering (`renderMasterGrid`, ~17490-17605); drawer card rendering (`ffsRenderSection`, ~9537-9744); simulator engine (`simRunEngine`, ~11251-11560) and chart-layer naming (`simGetPhoenixLayerName`, `simGetHarelLayerName`, `simRenderChart`, ~8720-8809, ~11696-11699); profile load/migration (`ffsLoadProfile`, ~8150-8220); PDF data handling (`_sfHandlePdfFile`, `parseAnnualReportPDF`, `_sfSavePdfData`, `_sfPdfToSegments`, ~19231-19424); AI chat context building (`buildFFSContext`, ~8634-8668); study-fund and T190 modal lookups (`ffsOpenStudyFundModal`, `ffsOpenT190SimulationModal`, ~17784-17960); legacy Excel-mode stores and parsers (`FUNDS`, `PENSION_ASSETS`, `CF_DATA` and their parsers, ~39-71, ~4404, ~6458, ~7639-7793).
- `server.js` — PDF parsing route (`/api/parse-pdf`, ~543-585), T190-bucket AI extraction route (`/api/extract`, ~731-842), Mislaka AI-fallback route (`/api/parse-masklaka`, ~26).
- `index.html` — manual-entry form field labels used to verify the K-NIS unit convention (investment balance field, ~2701-2704; pension accumulation field, ~3004-3007).
- `package.json` and `node_modules` — checked for the presence/absence of a test framework and `test` script.

**Project documentation (read as this project's own source of truth for domain rules):**
- `docs/provident_funds_logic.md` — T190 bucket shape and Amendment-190 domain rules.
- `docs/pension_logic.md` — capital-asset vs. cash-flow classification of pension/insurance products.
- `docs/system_architecture.md` — PDF parsing pipeline description.
- `CLAUDE.md` — project terminology rules and the `isBituachMenahalim`-priority rule.
- `ARCHITECTURE_RULES.md` — no-hardcoding rules and the explicit scoping of `_sfPdfToSegments` as a value that must always be recomputed live, never persisted.
- `docs/foundation/GOOSE_CONSTITUTION.md`, `docs/foundation/GOOSE_CORE_BOUNDARY.md` — referenced for the "Goose" architectural vision used in framing §F and §I.

**Methodology note:** the initial repository survey (system layers, responsibility map, and the five-pipeline/field-inventory research) was produced via parallel automated exploration passes over the repository, each returning file:line citations (Evidence Level C throughout this document unless otherwise upgraded). Several of the most consequential and load-bearing claims — the two divergent manager-item predicates (§E, §G item 3), the migration block's non-destructive backfill pattern, and the K-NIS unit convention for the manual-entry and Salkah investments pipelines (§D) — were independently re-verified against source in this session via direct file reads and targeted searches (Evidence Level A). Other claims, particularly around `ffsRenderSection`'s fallback behavior and the exact count of conversion sites missing `_original*` preservation, rest on the earlier exploration passes and remain at Evidence Level C.
