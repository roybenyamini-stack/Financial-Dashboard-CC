# Input Status Contract

System / Builder documentation. Not user-facing documentation.

Scope: Study Fund (קרן השתלמות) only, `FFS_PROFILE.investments[]` items with `category === 'קרן השתלמות'`. Introduced as Phase 1 of the Goose Finance "Asset Completion" workstream (Study Fund Input & Readiness Flow, plans v1.0–v1.2).

## Purpose

Gives any caller (future UI code, other Goose modules) a way to ask "how much evidence exists for this Study Fund asset, and where did it come from?" — without that caller needing to know the storage layout of `sf_pdf_data_<assetNum>` / `sf_manual_data_<assetNum>`, or re-derive the acceptance rules itself.

## Responsibilities

- Read the three already-persisted signals that describe evidence provenance for a given item: `item.rawXml`, the object at `sf_pdf_data_<assetNum>` (via `_sfLoadPdfData`), and the object at `sf_manual_data_<assetNum>` (via `_sfLoadManualData`).
- Classify those signals into one of four mutually-exclusive base states, plus one independent overlay flag.
- Do this as a pure function: same inputs (same persisted data) always produce the same output, with no side effects.

## Non-Responsibilities

This contract does **not**:
- Validate PDF content, parse a PDF, or call any parsing/extraction endpoint.
- Perform the account-match check itself — it only *reads* the result of that check (`accountMatchConfirmed`), which is produced upstream by the server-side guard in `/api/parse-pdf` (Phase 2).
- Compute tax, net, or projection figures. That remains `_sfCalculateTax` / `_sfRecalculate`'s job, entirely unchanged by this contract.
- Judge whether a calculation is *correct* — only whether evidence for it exists and where it came from.
- Write to storage, mutate `item`, or touch the DOM.
- Distinguish "principal is real" from "principal is a legacy default" beyond the specific checks below — it is not a general-purpose data-quality auditor.

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
3. `pdf_verified_active` — a `sf_pdf_data_<assetNum>` object exists **and** `accountMatchConfirmed === true`.
4. `legacy_pdf_present_unverified` — a `sf_pdf_data_<assetNum>` object exists but `accountMatchConfirmed` is not `true` (either it's genuinely `false`, or the field is entirely absent because the object was saved before Phase 2's server-side guard existed). This is the defensive default — evidence saved under the old, ungated flow is never silently promoted to "verified."

`manualActive` (independent overlay, not exclusive with any `base` value): `true` when `sf_manual_data_<assetNum>` exists and has a `principalAmount > 0`. This can be `true` at the same time as `base === 'pdf_verified_active'` — a verified PDF and an active manual override are not mutually exclusive, and this contract intentionally reports both facts rather than letting one hide the other.

## Future Extension Points

- **Phase 3** (not yet implemented) will consume this contract to render a card-level status in `ffsRenderSection` only — this contract itself renders nothing and defines no copy/wording.
- **A future third PDF parser**, if one is added and does not route through the current guarantee chain (`_aggregateTierRows`'s always-initialized fields, the pre-response `pdfTotalBalance`/`reportYear` throws), should define its own Parser Contract at that time rather than this function growing ad hoc new fields. Per the approved v1.2 correction, no `_missingFields`-style completeness guard was implemented in this sprint, because the current two parsers (Meitav, Altshuler) cannot produce a genuinely incomplete successful response — see server.js `_aggregateTierRows` (server.js:208-232).
- `accountMatchConfirmed` is currently the **only** acceptance-metadata field this contract reads. If a future acceptance dimension is added (e.g. document-freshness, provider-match — both flagged as open items in plan v1.1 §B/§E, not implemented), it should be threaded through the same `sf_pdf_data_<assetNum>` object and read here as an additional condition on `pdf_verified_active`, not as a new parallel contract.

## Architectural Boundary

> This contract describes ONLY evidence readiness.
>
> It MUST NEVER be interpreted as:
> - tax correctness
> - calculation correctness
> - parser correctness
> - financial correctness

A `pdf_verified_active` result means the input evidence was confirmed to match the target account. It says nothing about whether `_sfCalculateTax`'s output is correct — that is a separate, unresolved question (see the live `ARCHITECTURE_RULES.md` Rule 2b violation in `_sfRecalculate`, app.js:20607-20612, tracked as a separate follow-up finding and explicitly untouched by this contract or by Phases 1–2 of this workstream).
