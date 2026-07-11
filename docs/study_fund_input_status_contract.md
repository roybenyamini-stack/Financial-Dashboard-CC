# Input Status Contract

System / Builder documentation. Not user-facing documentation. See `docs/study_fund_input_guide_human.md` for the Hebrew user-facing guide.

Scope: Study Fund (קרן השתלמות) only, `FFS_PROFILE.investments[]` items with `category === 'קרן השתלמות'`. Introduced across three phases of the Goose Finance "Asset Completion" workstream (Study Fund Input & Readiness Flow, plans v1.0–v1.2, Phase 3 prompt v1.0):
- Phase 1 — `_sfGetInputStatus`, pure derivation.
- Phase 2 — the `accountMatchConfirmed` trust boundary in `/api/parse-pdf`.
- Phase 3 — `_sfRenderInputStatusHtml`, the card-level UI consumer, plus the `pdf_verified_active` → `pdf_verified_present` rename (see below).

## Purpose

Gives any caller (UI code, other Goose modules) a way to ask "how much evidence exists for this Study Fund asset, and where did it come from?" — without that caller needing to know the storage layout of `sf_pdf_data_<assetNum>` / `sf_manual_data_<assetNum>`, or re-derive the acceptance rules itself.

## Responsibilities

- Read the three already-persisted signals that describe evidence provenance for a given item: `item.rawXml`, the object at `sf_pdf_data_<assetNum>` (via `_sfLoadPdfData`), and the object at `sf_manual_data_<assetNum>` (via `_sfLoadManualData`).
- Classify those signals into one of four mutually-exclusive base states, plus one independent overlay flag.
- Do this as a pure function: same inputs (same persisted data) always produce the same output, with no side effects.
- (Phase 3) Render that classification as a small, additive block on the Study Fund card in `ffsRenderSection` — and only there.

## Non-Responsibilities

This contract does **not**:
- Validate PDF content, parse a PDF, or call any parsing/extraction endpoint.
- Perform the account-match check itself — it only *reads* the result of that check (`accountMatchConfirmed`), which is produced upstream by the server-side guard in `/api/parse-pdf` (Phase 2).
- Compute tax, net, or projection figures. That remains `_sfCalculateTax` / `_sfRecalculate`'s job, entirely unchanged by this contract.
- Judge whether a calculation is *correct* — only whether evidence for it exists and where it came from.
- Write to storage, mutate `item`, or touch the DOM (Phase 3's `_sfRenderInputStatusHtml` returns an HTML string; it does not itself write to the DOM — the caller, `ffsRenderSection`, does).
- Distinguish "principal is real" from "principal is a legacy default" beyond the specific checks below — it is not a general-purpose data-quality auditor.
- Declare that evidence is currently *driving* a calculation — only that it *exists*. See "Evidence Presence vs. Active Calculation Source" below.

## Allowed Inputs

- `item` — specifically `item.rawXml` (truthy/falsy check only) and `item.assetNum` (used as a storage key).
- `_sfLoadPdfData(item.assetNum)` — the persisted `sf_pdf_data_<assetNum>` object, if any. Only its `accountMatchConfirmed` field is inspected.
- `_sfLoadManualData(item.assetNum)` — the persisted `sf_manual_data_<assetNum>` object, if any. Only its `principalAmount` field is inspected (a `sourceNote`-only object, with no `principalAmount`, does **not** count as an active manual override — it does not drive any calculation).

No other globals (e.g. `_sfIsManual`, `_sfCurrentItem`) are read, since those are transient UI/session state tied to whichever asset's modal happens to be open, not a durable fact about an arbitrary item.

## Returned States

`_sfGetInputStatus(item)` returns `{ base, manualActive }`, or `null` if `item` is falsy.

`base` (mutually exclusive, evaluated in this priority order):
1. `xml_missing` — `item.rawXml` is falsy (a manually-created asset with no clearinghouse import).
2. `xml_identified_pdf_missing` — XML present, no `sf_pdf_data_<assetNum>` object exists yet.
3. **`pdf_verified_present`** — a `sf_pdf_data_<assetNum>` object exists **and** `accountMatchConfirmed === true`.
4. `legacy_pdf_present_unverified` — a `sf_pdf_data_<assetNum>` object exists but `accountMatchConfirmed` is not `true` (either it's genuinely `false`, or the field is entirely absent because the object was saved before Phase 2's server-side guard existed, or by the synthetic-stub exception below). This is the defensive default — evidence saved under the old, ungated flow (or written by a non-parser source) is never silently promoted to "verified."

`manualActive` (independent overlay, not exclusive with any `base` value): `true` when `sf_manual_data_<assetNum>` exists and has a `principalAmount > 0`. This can be `true` at the same time as `base === 'pdf_verified_present'` — see the next section for why this combination is exactly why the state was renamed.

## Rename: `pdf_verified_active` → `pdf_verified_present` (Phase 3)

**Renamed in Phase 3.** The original Phase 1 name, `pdf_verified_active`, implied the PDF is the source *currently driving* the displayed calculation. That is not always true: per `_sfRecalculate`'s manual-override block (app.js:20761-20814, unchanged by any phase of this workstream), when `manualActive` is `true`, the manually-entered principal is what actually drives the displayed tax figure — even if a verified PDF also exists underneath. The state describes **evidence presence**, not **active calculation source**. `pdf_verified_present` is accurate in both cases; `pdf_verified_active` was only accurate in one of them. `accountMatchConfirmed` itself was **not** renamed — its meaning (the account number was located in the uploaded document) was always accurate and remains unchanged.

## Evidence Presence vs. Active Calculation Source

These are two different questions, and this contract only answers the first:
- **Evidence presence** (`base`): does verified/legacy/absent PDF evidence exist in storage for this item? This is what `_sfGetInputStatus` reports.
- **Active calculation source**: which evidence is `_sfRecalculate` actually using right now to compute the displayed tax/net figures? This depends on `_sfRecalculate`'s own internal logic (PDF-derived segments vs. the manual-override block), which this contract does not read, duplicate, or influence.

A user can be looking at `pdf_verified_present` + `manualActive: true` at the same time — meaning verified institutional evidence exists, *and* the number on screen right now is actually coming from what they typed in, not from that evidence. The Phase 3 UI surfaces both facts side by side (see below) rather than letting one hide the other.

## Client Normalization Whitelist — Known Trap for Future Fields

`parseAnnualReportPDF` (app.js, the client-side normalizer that receives the raw `/api/parse-pdf` response and builds the object eventually passed to `_sfSavePdfData`) is a **strict field whitelist** — it constructs an entirely new object naming each field explicitly (`_promptVersion`, `isPreReformExempt`, `accountMatchConfirmed`, `exemptPrincipal`, etc.). **Any field present in the server's response but not explicitly listed in this whitelist is silently dropped and never reaches storage.**

This is not a hypothetical risk: this is exactly what happened to `accountMatchConfirmed` itself during Phase 2 development — the server set it, but it was initially missing from this whitelist, and only reached storage after being added there explicitly. **Any future developer adding a new field to `/api/parse-pdf`'s response (a new acceptance dimension, a new parser's metadata, anything) must also add it to this whitelist, or it will be silently discarded with no error, no warning, and no test failure to catch it.**

## Rule for Future Writers of `sf_pdf_data_<assetNum>`

**Any writer of `sf_pdf_data_<assetNum>` — whether a new parser routed through `/api/parse-pdf`, a hypothetical future direct API import, or any other future source — must explicitly set `accountMatchConfirmed: true` only after independently proving account matching. Silence or absence of the field means unverified, unconditionally.** `_sfGetInputStatus` treats anything other than a literal `accountMatchConfirmed === true` as `legacy_pdf_present_unverified` — there is no partial-credit or "probably fine" state. This is a deliberate fail-closed default: a writer that does nothing produces unverified evidence, never falsely verified evidence.

## Synthetic-Stub Exception

`_sfRecalculate` contains a pre-existing (pre-dates this workstream), unchanged-by-any-phase code path (app.js:20868-20877) that writes a synthetic, all-zero placeholder object directly to `sf_pdf_data_<assetNum>` for a fund whose join year equals the current year (no annual report could exist yet). This write:
- Goes through the same `_sfSavePdfData` function the real upload path uses, and the same storage key.
- **Does not** go through `/api/parse-pdf` or `scopeTextToAccount` — it never touches the server or the Phase 2 trust boundary at all.
- **Does not** include `accountMatchConfirmed` in its object literal.
- Therefore correctly, if incidentally, resolves to `legacy_pdf_present_unverified` under `_sfGetInputStatus` — it fails closed, the same as any other writer that stays silent on the field, per the rule above.
- Is **not** institutional PDF evidence, despite living at the same storage key as evidence that is. This is a known, verified-safe exception to "all evidence flows through the trust boundary" — not a bug, but worth remaining aware of, since a future refactor of the new-fund logic could change this safety property without anyone noticing unless this note is read first.

This exception is documented here, not fixed here — no phase of this workstream has modified this code path.

## Separation from the Existing Modal Reliability Banner

`_sfRecalculate` also contains a pre-existing, separate 5-state "reliability banner" (states 1–5, app.js:~20930-20938 as of this writing) shown inside the Study Fund analysis modal. **This banner is a different, older mechanism, is not the source of truth for Input Status, and is not reconciled with this contract by any phase of this workstream.** Concretely:
- The banner's "high accuracy" state (state 1) checks `_hasExactTiers` (whether tax-tier numbers look populated) — **not** `accountMatchConfirmed`.
- The banner factors in YTD-deposit status, which this contract deliberately excludes as out of scope.
- The banner reads manual-override status from the transient global `_sfIsManual`; this contract reads the storage-derived `manualActive` instead.
- **Consequence, stated explicitly:** it is possible for the modal banner to show "✨ high accuracy" for an asset that the Phase 3 card status simultaneously describes as `legacy_pdf_present_unverified`, because the two mechanisms answer genuinely different questions. This is a known, documented gap, not a defect introduced by this workstream — the banner already existed and already used this logic before Phase 1 began.
- **Do not reuse the banner's wording on the card, and do not treat the banner as authoritative for Input Status.** The card status (Phase 3) describes input evidence only; the banner describes the modal's own, separate notion of calculation-readiness.

## Future Extension Points

- **A future third PDF parser**, if one is added and does not route through the current guarantee chain (`_aggregateTierRows`'s always-initialized fields, the pre-response `pdfTotalBalance`/`reportYear` throws), should define its own Parser Contract at that time rather than this function growing ad hoc new fields. Per the approved v1.2 correction, no `_missingFields`-style completeness guard was implemented in this sprint, because the current two parsers (Meitav, Altshuler) cannot produce a genuinely incomplete successful response — see server.js `_aggregateTierRows` (server.js:208-232). **If such a parser is added, remember the client normalization whitelist trap above.**
- `accountMatchConfirmed` is currently the **only** acceptance-metadata field this contract reads. If a future acceptance dimension is added (e.g. document-freshness, provider-match — both flagged as open items in plan v1.1 §B/§E, not implemented), it should be threaded through the same `sf_pdf_data_<assetNum>` object and read here as an additional condition on `pdf_verified_present`, not as a new parallel contract.
- `renderMasterGrid` (the compact table view) does **not** consume this contract as of Phase 3, by explicit product decision — not a technical limitation. If it is added later, it should call the same `_sfGetInputStatus`/`_sfRenderInputStatusHtml` functions rather than re-deriving state independently, to avoid recreating the exact banner-vs-card divergence described above.

## Phase 3 UI Consumer

`_sfRenderInputStatusHtml(item)` (app.js) is the sole UI consumer of this contract. It:
- Returns `''` immediately for any item where `item.category !== 'קרן השתלמות'` — no other asset type is affected.
- Maps each `base` value to short, plain-Hebrew wording and (where applicable) a "next useful action" line — no internal enum name (`xml_missing`, `pdf_verified_present`, etc.) is ever shown to the user.
- Renders `manualActive` as a separate, additional line when true — it does not replace or hide the base-state line.
- Is called from exactly one place: `ffsRenderSection`'s Study Fund card block. **Not called from `renderMasterGrid`.**
- Contains no wording implying "analysis complete," "tax verified," "high accuracy," or "fully validated" — the architectural boundary below applies equally to this UI text.

## Architectural Boundary

> This contract describes ONLY evidence readiness.
>
> It MUST NEVER be interpreted as:
> - tax correctness
> - calculation correctness
> - parser correctness
> - financial correctness

A `pdf_verified_present` result means the input evidence was confirmed to match the target account and is present in storage. It says nothing about whether `_sfCalculateTax`'s output is correct — that is a separate, unresolved question (see the live `ARCHITECTURE_RULES.md` Rule 2b violation in `_sfRecalculate`, app.js:20607-20612, tracked as a separate follow-up finding and explicitly untouched by this contract or by any phase of this workstream).
