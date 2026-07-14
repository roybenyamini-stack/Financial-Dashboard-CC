# Study Fund Capability — Review

*Goose Financial — Module Documentation*

*Version 1.0 — Draft, pending Product Owner review*

**Author:** Claude Code
**Reviewed by:** *(pending — Product Owner review not yet performed)*
**Product Owner:** Roy

**Scope:** Repository understanding and evidence-based review only, per the Study Fund Capability Discovery milestone. No application code was modified in producing this document. No fixes are proposed — see `STUDY_FUND_CAPABILITY.md` for the canonical description this review assesses.

---

## Evidence Levels

Following the precedent set by `docs/foundation/GOOSE_EXPEDITION_1_ASSESSMENT.md`:

- **Level A** — Verified directly in this session (file read or targeted search performed in this conversation, with the specific line(s) inspected).
- **Level B** — Supported by existing project documentation (`docs/*.md`, `ARCHITECTURE_RULES.md`) treated as this project's own source of truth, not independently re-derived from code in this session.
- **Level C** — Reported by a parallel automated exploration pass (a research agent that searched and read the repository and returned file:line citations) during this same milestone, not independently re-verified by direct reading in this final document.

Every finding below is graded. Nearly all load-bearing claims in this review are **Level A** — the Study Fund module's `app.js` footprint (lines 17788–21330, plus the XML-import functions at 16998–17395) and all of `server.js` were read in full during this session, not sampled.

---

## 1. Repository Findings — Data Flow & Trust Assessment

Assessed stage by stage, following the flow in `STUDY_FUND_CAPABILITY.md` §3.

### 1.1 XML Import → Category Classification — **Trust: Medium** [Level A]

The category `'קרן השתלמות'` is assigned by a substring match on the free-text plan name (`SHEM-TOCHNIT`) for the literal Hebrew word `"השתלמות"` (`app.js:17278`). The XML also carries a `SUG-MUTZAR`/`KOD-SUG-MUTZAR`/`KOD-SUG-KUPA` numeric type code, captured into the parsed product at `app.js:17012-17013`, but **no code path anywhere in the import pipeline reads it for classification purposes** — it is stored in the intermediate `'סוג מוצר'` field and then discarded (never copied onto the final `investments[]` object at the create site, `app.js:17281-17289`).

*Why Medium, not Low:* the substring match is a reasonable heuristic — "השתלמות" is a near-universal component of Israeli Study Fund plan names — and the skip/upsert logic surrounding it is sound (§1.2). *Why not High:* the classification is one unusual plan-naming convention away from silent misclassification, with no fallback signal (the code field) actually consulted despite being available in the same parse pass.

### 1.2 Asset Upsert / Skip Logic — **Trust: High** [Level A]

Match-by-policy-number (`app.js:17216-17223`), the sub-1,000-₪ skip (`app.js:17204-17208`, surfaced to the user as a visible "דולגו" chip, not silent), and the `manual_override`-vs-XML-date protection window (`app.js:17235-17250`) are all deterministic, well-reasoned, and — critically — **transparent**: the import summary UI shows exactly which policies were added, updated, or skipped (`app.js:17313-17321`). This matches the Constitution's "Reality First" principle well. One caveat carried into §2 below: the protection is dormant for Study Fund items until a user manually engages it, since `manual_override` is never initialized at Study-Fund creation time (only for `_isProvidentCategory` items, `app.js:16218-16220`, `17290-17295`).

### 1.3 Annual Report PDF Parsing — Meitav — **Trust: High** [Level A]

`parseMeitav` (`server.js:317-404`) is regex/string-based with no AI involvement, a hard product-type pre-check (`"קרן השתלמות" not found` throws immediately), a table-window anchor that must be found or the function throws, and an **integrity gate** (`_validateIntegrity`, `server.js:286-297`) that cross-checks extracted row sums against the document's own stated total within a ±10 ILS tolerance — a genuine self-consistency check, not a rubber stamp. All three "strict mode" validations (rows found, balance found, year found) throw rather than return partial data (`server.js:390-395`), consistent with `docs/system_architecture.md`'s documented "Strict Mode" philosophy.

### 1.4 Annual Report PDF Parsing — Altshuler — **Trust: Medium** [Level A]

`parseAltshuler` (`server.js:407-540`) shares Meitav's pre-flight check, table-window anchoring, and integrity gate, but the tier-row and balance/year extraction themselves are two sequential Claude Haiku calls rather than regex. Mitigations are real: `temperature:0`, a very detailed and specific column-mapping prompt (the prompt explicitly warns the model that RTL-extracted column order is reversed and that Hebrew headers are sometimes squished together and unusable — `server.js:430-441`), a deterministic (non-AI) post-processing override for the `31.12.2002` pre-reform date (`server.js:483-488`), and the same integrity gate as Meitav applied to the AI's output before it's trusted (`server.js:523`). *Why Medium, not High:* even with these mitigations, correctness ultimately depends on an LLM correctly mapping ambiguous, bidi-reversed column data in a single pass — the integrity gate catches magnitude errors (row sum vs. stated total) but cannot catch a systematic column-swap that happens to preserve the row sum (e.g., swapping `realProfit` and `linkage` between two same-shaped columns).

### 1.5 `accountMatchConfirmed` Trust Boundary — **Trust: Medium** [Level A]

The check is a single question: does the account's digit sequence (in any hyphen/space-tolerant form, with up to 6 extra leading digits for company routing prefixes) appear **anywhere** in the PDF text (`scopeTextToAccount`, `server.js:149-193`)? If yes, `accountMatchConfirmed` is unconditionally set `true` (`server.js:594`) — there is no secondary check that the matched occurrence genuinely belongs to the account holder (e.g., no name cross-reference, no ID-number cross-reference). This is explicitly and correctly documented as a **fail-closed** design in `docs/study_fund_input_status_contract.md` ("Rule for Future Writers of `sf_pdf_data_<assetNum>`") — absence of a match rejects the upload outright (`server.js:570-580`) — but a *false positive* (the number appears in the document by coincidence, e.g. as part of an unrelated ID number in a consolidated multi-account report) is architecturally possible and not specifically guarded against beyond the "prefer the occurrence near a detail-section header" heuristic (`server.js:164-170`).

### 1.6 Input Status Display — **Trust: High** [Level A]

`_sfGetInputStatus` (`app.js:19312-19331`) is a pure derivation function over three already-persisted signals, with no side effects, matching `docs/study_fund_input_status_contract.md` exactly (re-verified directly against source in this session — the contract document is accurate as of this review). The "evidence presence, never correctness" boundary is enforced both in the returned data shape and in the UI text (`_sfRenderInputStatusHtml`, `app.js:19338-19372` — no wording implies calculation correctness).

### 1.7 Tax Calculation — XML-only fallback path — **Trust: Medium-Low** [Level A]

`_sfCalculateTax`'s `sugMutzar === 4` branch (`app.js:20478-20522`) computes: taxable-tier (`tikrat=2`) profit is **always** taxed; exempt-tier (`tikrat=1`) profit's tax is waived **only** when the seniority/age vesting condition is met. This produces a genuinely "mixed" partial-exemption outcome (the code's own template is literally named `SF_MIXED`, with the Hebrew explanation "הקרן המוטבת פטורה בשל ותק. חלה חבות מס... על רווחי הקרן החייבת" — "the privileged fund is exempt due to seniority; the liable fund still owes tax"). **This directly contradicts two of the project's own documented sources of truth for the same rule** — see Risk 1 below. *Why Medium-Low:* the code is internally consistent and its behavior is deliberate (there's a named template and an explanatory Hebrew string, not an accidental fallthrough) — but it disagrees with the documents the project itself designates as authoritative for this exact business rule, and this review cannot determine from the repository alone which is correct.

### 1.8 Tax Calculation — PDF-verified 3-phase path — **Trust: Low-Medium** [Level A]

`_sfRecalculate`'s `_hasExactTiers` branch (`app.js:20745-20837`) — used whenever a PDF with real 15/20/25% tier data exists, i.e. the module's *highest-accuracy* state — computes `taxDueK = (pdfTierTaxK + ytdTaxDueK + simTaxDueK) × withdrawalPct` with **no seniority/age vesting check anywhere in that formula**. Only the pre-2002 (`isPreReformExempt`) and pre-2003-manual-join full-exemption special cases are still honored in this path (`app.js:20840-20845`, `20855-20864`). This means: for a Study Fund whose owner has already reached 6 years' seniority or retirement age, uploading the annual report PDF — the action the module actively encourages as the path to a more accurate figure — **removes** an exemption that the XML-only fallback path would have applied. *Why Low-Medium, not Low:* the formula itself is internally consistent, matches the currently-live formula in `israel_tax_rules.md` (Level A cross-check, §1.9), and the underlying Phase 1/2/3 model is a reasonable engineering approach to blending historical-tier and YTD data — the specific finding is a *scope gap* (vesting exemption not carried into this branch), not an arithmetic error within the branch itself.

### 1.9 Documentation Consistency for the Tax Rules Themselves — **Trust: Low** [Level A — direct comparison of code against both documents]

Two project documents claim to be the source of truth for Study Fund tax rules:

- `docs/TaxLogic.md` §3.1, §5.1: "A withdrawal is fully tax-exempt if either condition is met [seniority or age]" / pseudocode `IF seniority>=cutoff OR age>=retirementAge: taxDue = 0 — full exemption`.
- `israel_tax_rules.md` (lines 51-54): "After 6 years from the first deposit date, the entire fund (**all layers**) is fully exempt from CGT on withdrawal. Before 6 years: Exempt layers remain tax-free; Taxable Profit is taxed."

Both describe a **binary, all-or-nothing** exemption. Neither describes the `SF_MIXED` partial state that `_sfCalculateTax` actually implements (§1.7), nor the complete absence of the vesting check in the PDF-verified path (§1.8). Additionally, `docs/TaxLogic.md` §5.1a's documented `effectiveTaxCoeff` formula (`pdfTierTaxK / pdfTotalBalanceK`) does not match either the current live code (`marginalTaxRate × taxableRatio`, `app.js:20754-20756`) or `israel_tax_rules.md`'s own documented formula for the same coefficient (which does match the code) — i.e. `TaxLogic.md` itself appears to be stale relative to a fix already recorded in `ARCHITECTURE_RULES.md`'s "Recent Financial Physics Fixes (2026-06)" section. Per `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §4 ("Every topic has exactly one owning document... a cross-reference must name the actual file it points to"), this is exactly the kind of SSOT conflict that document is meant to prevent, and it currently exists uncaught for this business rule.

**Status update (Study Fund Tax Knowledge milestone):** The `effectiveTaxCoeff` formula conflict is now documented canonically, once, in `docs/knowledge/study_fund/SF_TAX_SENSITIVITY_COEFFICIENT.md` (`SF-TAX-SENSITIVITY-COEFFICIENT`) — that object is now the one owning document for this formula; `TaxLogic.md` and `israel_tax_rules.md` should become references to it rather than independent restatements (not changed in this milestone; flagged for a future one). The binary-exemption-vs-`SF_MIXED` conflict named in this section is **reframed, not resolved**, by `docs/knowledge/study_fund/SF_LIQUIDITY_TAX_SEPARATION.md` (`SF-LIQUIDITY-TAX-SEPARATION`) — see that object and `SF-TAX-MODEL` §5 for the current canonical statement: the conceptual conflation (liquidity vs. bucket-taxability) is resolved; whether Israeli law imposes a seniority-based mechanism at actual withdrawal remains explicitly Unknown.

### 1.10 AI Verification & Advisor Chat — **Trust: Medium (as an advisory feature)** [Level A]

Both `/api/verification/tax` and `/api/chat/tax` (`server.js:636-686`, `689-744`) are explicitly non-gating — they never write back into `FFS_PROFILE` or alter the displayed `_sfCalculateTax`/`_sfRecalculate` figures; a user consults them and forms their own judgment. `/api/verification/tax`'s 3-model design with `Promise.allSettled` (`server.js:679`) degrades gracefully per-model on failure. The advisor's system prompt (`server.js:697-703`) hard-codes specific Hebrew phrasings for tax-status explanations and explicitly forbids leaking internal variable names — a reasonable UX safeguard, though it also means the advisor's stated tax rules (e.g. "משיכה הונית של הון פטור... חייבת בניכוי מס רווחי הון במקור (15% נומינלי)") are a *third* independent statement of Study Fund tax rules, alongside `TaxLogic.md` and `israel_tax_rules.md`, not obviously reconciled with either (out of scope to resolve here — flagged as part of Risk 1's broader pattern).

### 1.11 Simulation / Withdrawal Sliders — **Trust: High** [Level A]

The slider-sync and projection math (`app.js:20197-20322` region) is pure arithmetic with no hidden state or external calls — deterministic and directly traceable to visible slider inputs.

---

## 2. Risks

Ordered roughly by consequence, not by confidence.

1. **Contradictory sources of truth for the vesting-exemption rule.** `docs/TaxLogic.md` and `israel_tax_rules.md` both describe a binary full-exemption-after-6-years rule; the live code (`_sfCalculateTax`, `app.js:20481-20522`) implements a partial (`SF_MIXED`) exemption instead, and the PDF-verified calculation path (`_sfRecalculate`, `app.js:20745-20837`) applies no vesting check at all. Three different behaviors are now live or documented for the same business rule, none formally reconciled. [Level A] **Status: reframed, not resolved** — see `docs/knowledge/study_fund/SF_LIQUIDITY_TAX_SEPARATION.md`. The conceptual conflation (liquidity vs. bucket-taxability) driving this contradiction is now named explicitly; whether Israeli law imposes a seniority-based mechanism at withdrawal remains Unknown.

2. **The higher-accuracy path silently drops a lower-accuracy path's exemption logic.** Uploading a PDF is the module's own recommended way to get a more accurate figure, yet doing so removes the seniority/age vesting exemption from the calculation entirely (§1.8). No code comment, UI text, or documentation acknowledges this asymmetry between the two paths. [Level A] **Status: still open** — this specific asymmetry is carried forward, on the record, in `docs/knowledge/study_fund/SF_TAX_MODEL.md` §5 (Interaction & Edge Cases) and `SF_LIQUIDITY_TAX_SEPARATION.md` §11, not silently resolved.

3. **Category classification and tax-engine product-type routing both bypass an available, more authoritative signal.** The XML's `SUG-MUTZAR`/code field is parsed and then discarded at import time (§1.1); the tax engine re-infers the same information from a `category` string one step further removed from the source data (`app.js:20436-20442`). Two independent points where a stronger signal exists but isn't used. [Level A]

4. **Two independent, unreconciled "how good is this data" signals in the same modal.** The Input Status card (`_sfGetInputStatus`) and the 5-state reliability banner (`_sfRecalculate`, `app.js:20982-21004`) are computed by separate logic and can disagree — a gap `docs/study_fund_input_status_contract.md` already documents for itself explicitly ("Separation from the Existing Modal Reliability Banner"), confirming this is a known, accepted (not accidental) design tradeoff rather than an oversight, but still a real source of potential user confusion. [Level B, confirmed A via direct source re-read in this session]

5. **A history of live tax-calculation bugs in this exact engine.** `ARCHITECTURE_RULES.md`'s "Recent Financial Physics Fixes (2026-06)" section documents two prior defects that shipped and were later fixed: a balance-zeroing bug that overstated tax for all post-2003 funds with ceiling-exempt tiers, and an `effectiveTaxCoeff` formula that applied a flat 25% to the entire taxable balance instead of the correct blended rate. This establishes that the tax engine has a track record of incorrect-but-plausible-looking output reaching a state a user could have relied on, caught only by manual review. [Level B — cited directly from the project's own change log]

6. **No regression coverage for a financially consequential, actively-changing calculation engine.** `package.json` defines no `test` script. `test-meitav-parser.js`, `test-altshuler-parser.js`, and `audit-meitav-two-accounts.js` hand-duplicate `server.js`'s scoping/parsing logic (confirmed: `test-meitav-parser.js:17` is explicitly commented "Inline copy of server.js scoping utilities") instead of importing the functions `server.js` already exports (`server.js:862`) — meaning these scripts can silently drift out of sync with the real implementation, and would not catch a `server.js` regression. They also hardcode a personal local file path (`/Users/roybenyamini/Downloads/...`), so they cannot run in CI or on any machine but Roy's own. [Level A]

7. **Category misclassification risk from free-text matching.** A Study Fund whose `SHEM-TOCHNIT` plan name does not contain the literal substring `"השתלמות"` would silently become `'קופת גמל'` instead (§1.1) — with no user-facing warning, since the import summary only reports "added/updated/skipped," not "classification uncertain." [Level A]

8. **Environment-coupled API base URLs.** Every Study Fund network call in the frontend (`parseAnnualReportPDF`, `_sfTriggerAIVerification`, `_sfTriggerAdvisorModal`, `_sfSendAIChat`, `_sfAdvSendChat`) hardcodes `http://localhost:3005` (e.g. `app.js:19249, 19821, 19927, 19979, 20104`). Not a Study-Fund-specific pattern — the same convention is used project-wide — but worth naming since it means this module cannot function against a differently-hosted backend without a source change. [Level A]

9. **`accountMatchConfirmed`'s single check is a coincidental-match false positive, not just a false negative.** §1.5 — the trust boundary correctly fails closed on no-match, but a numeric coincidence (the account's digits appearing elsewhere in a consolidated document, attached to someone else's section) is not independently ruled out beyond the "prefer text near a detail-section header" heuristic. [Level A]

10. **The reliability banner has no state for "PDF-derived tax tiers present, Mislaka XML absent."** Inside `_sfRecalculate()` (`app.js:20604`), the banner's only warning-free state (`_mainBannerState = 1`, `app.js:20982-21004`) requires `_hasMaslekaMain && _hasPdfMain && _ytdOkMain` together. A fund with a successfully parsed, integrity-verified annual PDF and confirmed YTD deposits, but no separate Mislaka clearinghouse XML import (`item.rawXml` absent), does not satisfy `_hasMaslekaMain` and therefore cannot reach state 1 — nor state 5, whose condition (`_hasPdfMain && !_ytdOkMain`) requires YTD to specifically be *unconfirmed*. That combination — `_hasPdfMain && !_hasMaslekaMain && _ytdOkMain` — falls through to the generic fallback (state 3), whose hardcoded text ("הנתונים מבוססים על מסלקה בלבד... מומלץ להעלות דו״ח שנתי") is then actively inaccurate rather than merely imprecise, since an annual report has in fact been uploaded and is driving the calculation. Confirmed via direct trace of the full round trip — `parseAnnualReportPDF` (`app.js:19235-19283`) correctly normalizes and versions the parsed data, `_sfSavePdfData` (`app.js:19287-19289`) persists it verbatim, and the banner-state read (`app.js:20676-21004`) is in the same function and execution as the save-triggering recalculation — ruling out a stale-render or schema-version explanation. Confirmed unaffected by the Git Privacy Remediation Incident: `app.js` verified byte-identical before and after that incident's history rewrite. [Level A] **Status: verified, not fixed.** Recommended direction (not implemented, not scoped in detail here, subject to product wording review): an additive new banner state for exactly the `_hasPdfMain && !_hasMaslekaMain && _ytdOkMain` combination, with wording that separately addresses accumulation source, tax-tier source, YTD confidence, and what remains missing — rather than reusing state 3's undifferentiated "Mislaka only" text.

---

## 3. Validation Status

**How correctness is currently verified:** Primarily by manual, ad hoc review — running a dry-run script against a real downloaded PDF and eyeballing the output (`test-meitav-parser.js`, `audit-meitav-two-accounts.js`), plus the in-app AI verification feature (§1.10) as an optional user-triggered cross-check, plus the server-side integrity gate (§1.3, §1.4) that catches internal row-sum inconsistencies at parse time.

**What evidence exists:** The integrity gate (`_validateIntegrity`, `server.js:286-297`) is a genuine automated check that runs on every parse, in production, for both firms — this is real, load-bearing verification, not merely aspirational. The strict-mode throws (§1.3) are likewise real safety nets against silently returning corrupt/partial data.

**What evidence is missing:** No unit or integration tests exist for `_sfCalculateTax`, `_sfRecalculate`, `parseMeitav`, or `parseAltshuler` in any form that runs automatically or portably. The existing manual scripts (Risk 6) test against exactly one real PDF each, hand-duplicate rather than import the code under test, and cannot run outside Roy's own machine. There is no evidence in the repository of the `SF_MIXED` partial-exemption behavior (§1.7) or the vesting-exemption gap in the PDF-verified path (§1.8) ever having been deliberately tested or manually confirmed against a real seniority/age-eligible fund — these behaviors were discovered in this review by reading the calculation code directly, not by finding a test or audit trail that exercised them.

---

## 4. Questions For Roy

Each of these requires domain knowledge (Israeli tax law, or Roy's own real-world Study Fund holdings) that cannot be resolved by further reading the repository.

1. **Which vesting-exemption behavior is legally correct** — full exemption of the entire fund (all layers) once seniority ≥ 6 years or retirement age is reached, as `docs/TaxLogic.md` and `israel_tax_rules.md` both state, or the code's actual `SF_MIXED` behavior where taxable-tier profit remains taxed even after vesting? This cannot be resolved from the repository because the code and the documents disagree with each other, and both are presented elsewhere in the project as authoritative. (§1.7, §1.9, Risk 1) **Superseded framing, question still open:** `docs/knowledge/study_fund/SF_LIQUIDITY_TAX_SEPARATION.md` reframes this as a conflation of liquidity and bucket-taxability rather than a single binary rule — see that object's §11 for the precise remaining legal question and what evidence (a primary legal/regulatory source, not further annual reports) would close it.

2. **Is it intentional that the PDF-verified calculation path applies no vesting exemption at all** — i.e., is PDF-derived tier data meant to fully supersede the seniority/age rule (perhaps because the annual report itself is assumed to already reflect any applicable exemption, though nothing in the code or docs states this), or is this a genuine gap? (§1.8, Risk 2)

3. **Does the "effective tax coefficient" approximation (blended rate applied uniformly to YTD and future growth) need to hit a specific accuracy bar**, or is it understood and accepted as a deliberately rough estimate pending a full annual report each year? The repository states the method but not an acceptance tolerance.

4. **Has Roy (or would Roy) ever encountered a Study Fund annual report from a provider other than Meitav or Altshuler Shaham?** This determines whether "only 2 firms supported" (Limitation 3 in the Capability doc) is a real near-term gap or a non-issue given Roy's actual holdings.

5. **Are there real Study Fund plan names in Roy's own data (or ones he's aware of) that do *not* contain the word "השתלמות"?** This would confirm or rule out Risk 7 (category-misclassification-by-free-text) as a live concern versus a theoretical one.

---

## 5. Readiness Assessment

Based only on the evidence above:

- **Roy-ready: Yes, with an explicit caveat.** The module is extensively self-documenting at the UI level (Input Status card, reliability banner, explicit "estimate only, consult a professional" disclaimers throughout `_sfCalculateTax`'s templates and the AI advisor's system prompt), which aligns well with the Constitution's transparency principles. However, Roy should not treat the displayed tax figure as reliable near the 6-year-seniority or retirement-age boundary, or immediately after uploading a PDF for a fund that has already vested, until Question 1/2 above are resolved — the repository itself does not currently agree on what the correct number should be in that specific situation.
- **Production-ready (for users beyond Roy): No.** Hardcoded `localhost:3005` API URLs (Risk 8), two-firm-only PDF coverage (Limitation 3), and zero portable/automated test coverage (Risk 6) would all need to be addressed before this module could reasonably serve a user other than Roy on his own machine.
- **Requires additional work before further changes to the tax engine specifically:** the combination of Risk 1 (contradictory documented rules), Risk 5 (a documented history of prior live tax bugs in this same engine), and Risk 6 (no regression coverage) together suggest that any future change to `_sfCalculateTax`/`_sfRecalculate` carries meaningfully elevated risk of reintroducing a silent calculation error, with nothing in place to catch it automatically. Resolving Question 1 and adding even minimal regression coverage for the scenarios in §1.7/§1.8 would materially de-risk future work in this area.
