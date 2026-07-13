# Study Fund Capability (קרן השתלמות)

*Goose Financial — Module Documentation*

*Version 1.0 — Draft, pending Product Owner review*

**Author:** Claude Code
**Reviewed by:** *(pending — Product Owner review not yet performed)*
**Product Owner:** Roy

---

## 0. How This Document Was Produced

This is a **discovery document**, produced by reading the repository directly — not by design intent. Every claim below is backed by a file:line citation to `app.js`, `server.js`, or an existing `docs/*.md` file, verified in this session (see the companion `STUDY_FUND_CAPABILITY_REVIEW.md` for the evidence-graded review, risks, and open questions). Where the repository is silent or self-contradictory, that is stated explicitly rather than inferred.

This document is the canonical knowledge source for the Study Fund module. Future Developer Notes, User Guides, QA documents, and Help documentation should derive from it rather than becoming competing sources of truth (per `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §2, §4).

Two documents already exist and remain authoritative for their narrower scope — this document does not duplicate them, only references them:
- `docs/study_fund_input_status_contract.md` — Builder contract for the "Input Status" evidence-presence display (`_sfGetInputStatus`/`_sfRenderInputStatusHtml`).
- `docs/study_fund_input_guide_human.md` — Hebrew, human-facing guide to the same feature.

---

## 1. Purpose

The Study Fund capability lets a person import, track, and understand the tax-net value of an Israeli **Keren Hishtalmut** (קרן השתלמות) — an education/savings fund with its own capital-gains tax regime distinct from pension and provident-fund products. Concretely, it:

- Recognizes Study Fund holdings from Mislaka (clearinghouse) XML imports.
- Lets a person upload an annual report (PDF) from their fund manager to obtain verified, tax-tier-level evidence instead of a rough estimate.
- Computes an estimated net-of-tax withdrawal value under Israeli capital-gains tax rules — using whatever evidence exists (XML only, XML + PDF, or manual entry), never inventing figures the evidence doesn't support.
- Lets a person simulate future withdrawals under adjustable assumptions (time horizon, investment return, inflation, withdrawal amount).
- Surfaces AI-assisted verification and a conversational tax advisor as an optional cross-check on the displayed figures — never as the primary source of truth.

This directly serves the Goose Constitution's principles of **Reality First**, **Missing Truth Is Better Than False Precision**, and **Every Number Has Provenance** (`docs/foundation/GOOSE_CONSTITUTION.md`): the module is explicit, at every stage, about whether a figure is XML-derived, PDF-verified, manually entered, or a simulation — and never silently upgrades one to another.

---

## 2. Responsibilities

### In scope (owned by this module)

- Classifying an imported or manually-created investment item as `category === 'קרן השתלמות'`.
- Deriving and rendering the card-level "Input Status" (evidence presence, not correctness) for Study Fund items — `docs/study_fund_input_status_contract.md` is the SSOT for this sub-feature.
- Server-side parsing of annual report PDFs into tax-tier evidence (`server.js` `/api/parse-pdf`), including the account-match trust boundary.
- Manual calibration (principal amount + join date) as a fallback/supplement when XML and/or PDF evidence is incomplete.
- Manual YTD salary-deposit entry, as a fallback/supplement to XML-derived deposit data.
- The Study Fund tax-calculation engine (`_sfCalculateTax`) and its higher-accuracy PDF-evidence extension (`_sfRecalculate`'s 3-phase YTD/simulation model).
- The withdrawal-simulation UI: timeline, investment-return, and inflation sliders; percentage or fixed-₪ withdrawal mode; nominal/real value toggle.
- The data-reliability banner (5 states) and the collapsible tax-breakdown receipt shown inside the analysis modal.
- AI-assisted cross-verification of the displayed tax figure (3 models in parallel) and a conversational Study-Fund-specific tax advisor — both explicitly advisory, never gating the displayed number.

### Out of scope (owned elsewhere, only touched at the boundary)

- **Amendment 190 / T190 provident-fund bucket logic** (`קופת גמל`). This is a structurally separate capability — `docs/provident_funds_logic.md` is its SSOT. The two capabilities share only the generic XML-import pipeline; the tax engine explicitly branches on product type (`sugMutzar === 4` → Study Fund path, `sugMutzar === 3` → Provident Fund path — `app.js:20478`, `app.js:20524`), and the master grid and asset-card UI show a Study Fund "ניתוח" (analysis) button *or* a T190 "ת190" button, never both, based on `item.category` (`app.js:9729-9733`, `app.js:17518-17524`).
- **Generic Mislaka/Salkah XML import infrastructure.** `_salkahParseOneXML` and `processMultipleSalkahFiles` (`app.js:16998`, `app.js:17170`) parse *every* investment and pension product type, not just Study Funds. This module's only touch-point is the category string assigned to the resulting investments[] item (§4.1) and the tax engine's product-type routing.
- **Master grid rendering (`renderMasterGrid`, `app.js:17494`).** Study Fund contributes one conditional analysis-button branch and a category-grouping label; the grid itself is generic, shared UI.
- **The general investments-drawer card (`ffsRenderSection`, `app.js:9540` onward).** Study Fund contributes the Input Status block (`_sfRenderInputStatusHtml`, called at `app.js:9724`) and the analysis-button branch (`app.js:9729-9731`); the card layout, category grouping, and edit/delete controls are generic.

---

## 3. Capability Flow

The following is the flow as actually implemented, not an idealized design. Every stage is optional except the first — the module is designed to produce *some* usable (if imprecise) figure at every level of evidence completeness, per the Constitution's "Missing Truth Is Better Than False Precision" principle.

```
Mislaka XML import
  │  (_salkahParseOneXML, processMultipleSalkahFiles — app.js:16998, 17170)
  │  category = 'קרן השתלמות' iff SHEM-TOCHNIT text contains "השתלמות" (app.js:17278)
  ▼
Investments[] asset created/updated (upsert by policy number, app.js:17216-17223)
  │  manual_override protects against stale XML overwrite (app.js:17235-17250, investments only)
  ▼
[Optional] Annual Report PDF upload
  │  parseAnnualReportPDF (app.js:19235) → POST /api/parse-pdf (server.js:543)
  │  → detectFirm → parseMeitav | parseAltshuler → _aggregateTierRows
  │  → accountMatchConfirmed trust boundary (server.js:566-580, 594)
  │  → stored client-side at localStorage['sf_pdf_data_'+assetNum] (_sfSavePdfData, app.js:19287)
  ▼
Input Status derivation (evidence presence only — _sfGetInputStatus, app.js:19312)
  │  rendered on the asset card (_sfRenderInputStatusHtml, app.js:19338)
  ▼
[Optional/parallel] Manual calibration (principal + join date, app.js:19168-19222)
[Optional/parallel] Manual YTD deposits (app.js:19156-19167)
  ▼
Tax calculation (_sfCalculateTax, app.js:20344 — always runs)
  │  seniority/age vesting exemption check, segment-based CGT (XML-segment-only accuracy)
  ▼
[If PDF evidence exists] 3-phase upgrade (_sfRecalculate, app.js:20604-20932)
  │  Phase 1: historical tax from PDF tiers (pdfTierTaxK)
  │  Phase 2: YTD accrual since report date (ytdTaxDueK, using effectiveTaxCoeff)
  │  Phase 3: forward simulation under slider assumptions (simTaxDueK)
  ▼
Withdrawal / projection simulation UI
  │  timeline, investment-return, inflation, withdrawal-%/fixed sliders
  │  nominal/real toggle, pie chart, collapsible tax-breakdown receipt
  ▼
[Optional, on demand] AI cross-verification (3 models) and AI advisor chat
   POST /api/verification/tax, POST /api/chat/tax (server.js:636, 689)
```

---

## 4. Major Components

### 4.1 XML Import & Category Classification (generic infra, Study-Fund touch-point)

| Function | Location | Role |
|---|---|---|
| `_salkahParseOneXML(xmlString)` | `app.js:16998-17152` | Parses one Mislaka XML file into `{provider, products, totalBalance}`. Captures `SUG-MUTZAR`/`KOD-SUG-MUTZAR`/`KOD-SUG-KUPA` into each product's `'סוג מוצר'` field (`app.js:17012-17013`) and the plan name into `'שם מוצר'` (`SHEM-TOCHNIT`, `app.js:17014-17015`) — **but no downstream consumer reads `'סוג מוצר'` to classify Study Funds** (see §6, Limitation 1). |
| `processMultipleSalkahFiles(files, statusEl)` | `app.js:17170-17328` | Orchestrates multi-file import, bucket assignment (investments vs. pension), upsert-vs-create, and category assignment. |
| Category assignment | `app.js:17278-17280` | `productName.indexOf('השתלמות') !== -1 ? 'קרן השתלמות' : productName.indexOf('להשקעה') !== -1 ? 'קופת גמל להשקעה' : 'קופת גמל'` — a **free-text substring match** on the plan name, not a code-field check. |
| Bucket routing (investments vs. pension) | `app.js:17194, 17212-17214` | A product lands in the `investments` bucket (where Study Funds live) if its product name matches `_investKW` (includes `'השתלמות'`, `'תומלתשה'`) or contains `'גמל'`/`'למג'`; otherwise it goes to `pension`. |
| Upsert / skip logic | `app.js:17204-17250` | Balance `< 1,000 ₪` and not a legacy ("vatika") product → skipped entirely (surfaced to the user as a "דולגו" chip, `app.js:17315`). Existing investments-bucket item matched by `assetNum`/`accountNum` (`app.js:17216-17223`) is updated **unless** `manual_override === true` and the manual update postdates the XML's data date (`app.js:17235-17238`) — the protected item's `isActive`/`needsReview` still update regardless. This match/skip/protect logic is identical across all investment categories — there is no Study-Fund-only branch. Note: `manual_override` is only initialized (`false`) at creation time for `_isProvidentCategory` items (`app.js:16218-16220`, i.e. `קופת גמל` only) — a freshly-imported Study Fund item has no `manual_override` field at all until a user sets one explicitly via the edit UI, so this protection is inert for Study Fund until then (not a defect — XML re-import updating the balance is the sensible default absent an explicit manual edit). |
| AI-fallback import path | `_salkahFallbackToAI` (`app.js:17330-17356`), `_salkahAIResponseToProducts` (`app.js:17358-17395`) | Triggered when regex XML parsing yields zero products on a plausible XML file (`app.js:17179`). Calls `POST /api/parse-masklaka` (Claude Haiku, `server.js:26-63`). Explicitly hardcodes `'סוג מוצר': 'קרן השתלמות'` for every item it returns (`app.js:17382`) — i.e. this fallback path assumes Study Fund rather than classifying, unlike the regex path. |
| Manual creation | `ffsSaveInvFromModal` (`app.js:16625` onward) | The category dropdown (`app.js:9650-9661`, `16252`) includes `'קרן השתלמות'` as a selectable option; a manually-created Study Fund has no `rawXml`, which the tax engine treats as a hard "cannot calculate" state (§4.4). |

### 4.2 Input Status (Evidence Presence)

Fully specified by `docs/study_fund_input_status_contract.md` — not restated here. Implementation: `_sfGetInputStatus` (`app.js:19312-19331`), `_sfRenderInputStatusHtml` (`app.js:19338-19372`), called once from `ffsRenderSection`'s Study Fund card block (`app.js:9721-9724`) and nowhere else (explicitly not in `renderMasterGrid`).

### 4.3 Annual Report PDF Parsing (`server.js`)

| Component | Location | Role |
|---|---|---|
| `POST /api/parse-pdf` | `server.js:543-600` | Route handler: extracts PDF text (`pdf-parse`), scopes it to the target account, detects the firm, dispatches to the firm's parser, and stamps `accountMatchConfirmed: true` on success. |
| `scopeTextToAccount(fullText, acctNum)` | `server.js:149-193` | Locates the account's block via a separator-tolerant digit regex (`createFlexibleAccountRegex`, `server.js:104-112`), preferring an occurrence adjacent to a "detail section" header phrase, else the last occurrence in the document. Returns `found:false` (with a list of *other* account numbers detected, for diagnostics) if the target account never appears anywhere in the text. |
| **Trust boundary** | `server.js:565-580` | If `!scoped.found`, the request is rejected with **422** before any parser runs — a PDF whose account cannot be located is never treated as evidence for the target asset. This is the single check behind `accountMatchConfirmed` (§4.3.1). |
| `detectFirm(text)` | `server.js:199-203` | Regex test for `מיטב` then `אלטשולר` on the **full**, unscoped text. No third firm, no default — unrecognized firm → 422. |
| `parseMeitav(scopedText, fullText, assetNum)` | `server.js:317-404` | Regex/string-based, **no AI call**. Requires the literal string `קרן השתלמות` in the document (else throws "wrong document type"). Locates the B.8 reform table via `_findTableWindow` (`server.js:273-282`), extracts 1–4 tax-tier rows by two line-structure patterns (pre-2003 exempt row; 4-number row + rate label), validates row-sum against the document's own stated total (`_validateIntegrity`, `server.js:286-297`, ±10 ILS tolerance), and throws (never returns partial data) if rows, balance, or year cannot be found. |
| `parseAltshuler(scopedText, assetNum, fullText)` | `server.js:407-540` | Two sequential Claude Haiku (`claude-haiku-4-5-20251001`, `temperature:0`) calls: one for the tier-row table, one for balance/year. A deterministic (non-AI) post-processing step forces `taxRate:0` on any row associated with a `31.12.2002` reference (`server.js:483-488`). Same integrity gate and same strict-mode throws as Meitav. |
| `_aggregateTierRows(rows, pdfTotalBalance)` | `server.js:208-232` | Shared aggregation: `taxRate===0` rows → `exemptPrincipal`/`exemptProfit`; `taxRate∈{15,20,25}` rows → `taxableProfit15/20/25`. Firm-agnostic — tier *count* (1–4) reflects account seniority under Israeli law, not the firm. |
| `calculateMarginalTaxRate(rows)` | `server.js:234-244` | Profit-weighted average CGT rate across taxable-tier rows: `Σ(realProfit·rate) / Σ(realProfit)`. |

#### 4.3.1 `accountMatchConfirmed` — what it actually proves

`accountMatchConfirmed` is not a strong identity check. It is unconditionally set to `true` after a successful parse (`server.js:594`) whenever `scopeTextToAccount` found **at least one** occurrence of the account's digit sequence anywhere in the PDF (subject to the detail-section heuristic). There is no independent cross-check of ownership beyond this. `docs/study_fund_input_status_contract.md` documents the client-side consumption of this flag (`pdf_verified_present` vs. `legacy_pdf_present_unverified`) in full.

#### 4.3.2 Client-side normalization

`parseAnnualReportPDF` (`app.js:19235-19283`) is a **strict field whitelist** on the server's JSON response — any server field not explicitly named here is silently dropped before it ever reaches storage (`docs/study_fund_input_status_contract.md` documents this trap in detail; it is the same mechanism, not a Study-Fund-specific one).

### 4.4 Tax Calculation Engine

| Function | Location | Role |
|---|---|---|
| `_sfCalcSegments(item)` | `app.js:20324-20340` | Reduces `item.taxSegments[]` (tikrat=1 exempt / tikrat=2 taxable) into `{exemptPrincipal, taxablePrincipal, exemptProfit, taxableProfit}`. |
| `_sfCalculateTax(product, withdrawalPct, globalConfig)` | `app.js:20344-20602` | The core, pure (no DOM access) tax function. Returns `null`/"low confidence" figures if `product.rawXml` is falsy (`app.js:20360-20371` — a manually-created Study Fund with no XML import). Otherwise re-derives `joinDate` and `taxSegments` from the raw XML if not already present (`app.js:20382-20400`), tracks a confidence score (`high`/`medium`/`low`) based on data completeness (`app.js:20402-20465`), and for `sugMutzar===4` (Study Fund) computes: `isExemptEligible = seniority≥6y OR age≥retirementAge`; **taxable-tier (tikrat=2) profit is taxed regardless of `isExemptEligible`; exempt-tier (tikrat=1) profit's tax is waived only when `isExemptEligible`** (`app.js:20481-20522` — see the Review document for the discrepancy this creates against `docs/TaxLogic.md` and `israel_tax_rules.md`). |
| `sugMutzar` resolution | `app.js:20436-20442` | `product.sugMutzar` is never actually populated by any import pipeline (§4.1) — this function falls back to inferring it from the `category` string (`cat.indexOf('השתלמות') !== -1 → 4`), defaulting to `4` with a confidence downgrade if neither Study Fund nor provident-fund keywords match. |
| `_sfPdfToSegments(d, currentBalanceK)` | `app.js:19469-19507` | Converts server-parsed PDF tier data into the 2-segment (`tikrat:1`/`tikrat:2`) shape `_sfCalculateTax` expects, so the same tax function can consume either XML-derived or PDF-derived segments. |
| `_sfRecalculate()` | `app.js:20604-21215` | The modal's live-recalculation driver (runs on every slider change). Always calls `_sfCalculateTax` first (`app.js:20733`); when `_hasExactTiers` (a PDF with real 15/20/25% tier data) is present, **overrides** the displayed tax/net figures with the 3-phase model below (`app.js:20745-20837`) — this override path does **not** re-check the seniority/age vesting exemption (see Review doc, Risk 2). Also implements: pre-2002 full exemption override (`app.js:20840-20845`), the manual-calibration override branch (`app.js:20847-20900`, itself with a pre-2003-join absolute-exemption special case), the "new fund, no PDF possible yet" synthetic stub (`app.js:20920-20932`), and the 5-state data-reliability banner (`app.js:20982-21004`, distinct from and not reconciled with the Input Status card per `docs/study_fund_input_status_contract.md`'s own documented gap). |
| 3-phase formula | `app.js:20745-20832` | `effectiveTaxCoeff = marginalTaxRate × taxableRatio` (fallback `taxableRatio × 0.25` when no `marginalTaxRate`), applied identically to YTD real profit and to future simulated profit — matches `israel_tax_rules.md`'s "Current Dashboard Implementation" section and `ARCHITECTURE_RULES.md` Rule 2a. **`docs/TaxLogic.md` §5.1a documents an older, different formula** (`effectiveTaxCoeff = pdfTierTaxK / pdfTotalBalanceK`) that does not match the live code (see Review doc). |
| YTD salary-deposit detection | `app.js:20760-20814` | Priority order: manual override (`_sfManualDeposits`) → XML scan of `PerutHafkadotMetchilatShana` elements dated after Jan 1 of the current year → auto-fill extrapolation (1–6 months gap) from the last known deposit amount. |

### 4.5 Simulation & Withdrawal UI

`ffsOpenStudyFundModal` (`app.js:17788-17896`) initializes the modal (macro defaults from live DOM or profile fallback, timeline/return/inflation/withdrawal sliders). `_sfSyncPair`/`_sfSyncAllSliders`/`_sfOnSlider`/`_sfOnInput` (`app.js:20197-20264` region) keep slider/input pairs and visual fill in sync. `_sfSetWdMode`/`_sfApplyWdModeUI` (`app.js:20264-20309`) toggle between percentage and fixed-₪ withdrawal modes. `_sfGetProjectedBalance` (`app.js:20310-20322`) computes the inflation-adjusted real-return projection used to size the fixed-withdrawal slider's max. `_sfUpdatePieChart` (`app.js:21217-21304`) renders the gross/tax/net breakdown as a Chart.js doughnut.

### 4.6 AI Verification & Advisor Chat

| Component | Location | Role |
|---|---|---|
| `POST /api/verification/tax` | `server.js:636-686` | 3-model parallel verification (`claude-sonnet-4-6`, `gpt-4o`, `gemini-2.5-flash`) of the displayed tax figure against `israel_tax_rules.md` as the injected ground truth. Supports `assetType ∈ {'keren_hishtalmut','kupat_gemel'}`. Has a fast-path for `isNewFund:true` that returns a Hebrew "pending, no error" verdict without calling any model (`server.js:639-648`). Failures are isolated per model via `Promise.allSettled` (`server.js:679`) — one model failing does not block the others. |
| `_sfTriggerAIVerification` / `_sfShowAIModal` | `app.js:19787-19830`, `20013-20074` | Frontend trigger and 3-card result modal. |
| `POST /api/chat/tax` | `server.js:689-744` | Conversational advisor, `claude-sonnet-4-6`, with a Study-Fund-specific system prompt (`_sfAdvisorSystem`, `server.js:697-703`) that hard-codes several exact Hebrew phrasings the model must use verbatim for tax-status explanations, and explicitly forbids leaking internal variable names to the user. |
| `_sfTriggerAdvisorModal` / `_sfAdvSendChat` / `_sfSendAIChat` | `app.js:19832-20003`, `19947-20000`, `20090-20121` | Frontend advisor panel (lazy-loaded summary + free-form chat) and the standalone AI-modal chat box. |

Both AI features are **advisory only** — neither gates or overrides the deterministic `_sfCalculateTax`/`_sfRecalculate` figures; they are cross-checks a user can consult on demand.

---

## 5. Current Supported Providers

| Firm | Hebrew | Parser | Method |
|---|---|---|---|
| Meitav | מיטב | `parseMeitav` | Regex/string extraction, no AI |
| Altshuler Shaham | אלטשולר (שחם) | `parseAltshuler` | Claude Haiku (2 calls), with deterministic post-processing overrides |

No other firm is recognized by `detectFirm` (`server.js:199-203`); an unrecognized firm's PDF is rejected with a 422 before any parsing is attempted. `module.exports` (`server.js:862`) confirms only these two parser functions are exported/exist.

---

## 6. Current Limitations

Backed by direct repository evidence only:

1. **Category classification is free-text-based, not code-field-based.** `_salkahParseOneXML` captures the XML's `SUG-MUTZAR`/`KOD-SUG-MUTZAR`/`KOD-SUG-KUPA` field into `'סוג מוצר'` (`app.js:17012-17013`), but `processMultipleSalkahFiles` never reads that field when assigning `category` — it substring-matches the free-text plan name (`SHEM-TOCHNIT`) for the literal word `"השתלמות"` instead (`app.js:17278`). A Study Fund whose plan name doesn't contain that word would be misclassified as `'קופת גמל'`.
2. **The tax engine's own `sugMutzar` routing never reads a real `sugMutzar` field either** — it infers product type from the same `category` string at calculation time (`app.js:20436-20442`), one layer removed from any XML code field.
3. **Only two PDF-parsing firms are supported** (§5); any other provider's annual report is rejected outright.
4. **The seniority/age vesting exemption is not applied once a PDF is uploaded.** `_sfCalculateTax`'s `isExemptEligible` check (`app.js:20481`) only affects the XML-only fallback path; `_sfRecalculate`'s PDF-verified 3-phase formula (`app.js:20745-20832`) computes tax purely from PDF tiers + YTD + simulation, with no seniority/age gate (the pre-2002 and pre-2003 full-exemption special cases are still respected). Whether this is intended is a question for Roy (Review doc, §5).
5. **No automated test coverage.** `package.json` defines no `test` script; the repository's `test-meitav-parser.js`, `test-altshuler-parser.js`, `audit-meitav-two-accounts.js` hand-duplicate `server.js`'s parsing logic (verified: `test-meitav-parser.js:17-40` is explicitly commented "Inline copy of server.js scoping utilities") rather than importing the functions `server.js` already exports (`server.js:862`), and reference a hardcoded personal file path (`/Users/roybenyamini/Downloads/...`), so they cannot run in CI or for any user besides Roy on his own machine.
6. **API base URLs are hardcoded to `http://localhost:3005`** throughout the Study Fund frontend code (e.g. `app.js:19249, 19821, 19927, 19979, 20104`) — the module assumes frontend and backend run together on localhost.
7. **Two different, undocumented-as-such data-reliability signals coexist in the same modal**: the Input Status card (`_sfGetInputStatus`) and the 5-state reliability banner inside `_sfRecalculate` (`app.js:20982-21004`) compute independently and can disagree, a gap already flagged (for a structurally similar case) in `docs/study_fund_input_status_contract.md`'s "Separation from the Existing Modal Reliability Banner" section.

---

## 7. Business Knowledge Missing From Repository

These cannot be resolved by reading code or existing documentation further — they require Roy's domain knowledge. Full context and reasoning for each is in the companion Review document (§"Questions For Roy"); listed here for completeness:

1. Which vesting-exemption model is legally correct for Israeli Study Funds: the "full exemption of all layers after 6 years / retirement age" stated in `docs/TaxLogic.md` and `israel_tax_rules.md`, or the code's actual behavior (taxable-tier profit remains taxed even after vesting is reached)?
2. Whether it is intentional that the vesting/seniority exemption check is entirely absent from the PDF-verified calculation path.
3. Whether Study Fund category classification should eventually be keyed off the XML's `SUG-MUTZAR` code rather than free-text product-name matching, and what real-world Study Fund plan names (if any) are known to lack the word "השתלמות".
4. Whether Meitav/Altshuler-only PDF coverage matches Roy's actual real-world need, or whether other providers' annual reports are already in use and simply unsupported.
5. What error tolerance is acceptable for the blended "effective tax coefficient" approximation used for YTD and future-simulation tax estimates, relative to a fully precise tax filing.
