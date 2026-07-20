# Provident Fund / Amendment 190 — Current Implementation Reality

**Version:** E3-1.0 — Draft
**Status:** Repository Understanding Only. Not yet reviewed by the Product Owner. No approval required to produce (Roy Reality Lab artifact).
**Scope:** How the current Goose codebase parses, represents, maps, persists, and consumes provident-fund / Amendment 190 money-classification fields (`qualifying_annuity`, `recognized_annuity`, `capital_exempt`). This document describes **implementation reality only** — what the code currently does, not what the law requires, not whether the code is correct, and not what it should do instead.
**Author:** Claude Code
**Product Owner:** Roy

---

## Placement rationale (per `GOOSE_DOCUMENTATION_GOVERNANCE.md`)

This document is classified **Roy Reality Lab**, per the governance doc's own classification rule (§3): an artifact belongs here when it "records repository *truth* discovered through investigation, not product policy or domain rules" — exactly this document's content. No approval is required to produce it (§8, line 120: "Roy Reality Lab artifacts require no formal approval to produce — they are research, experimentation, and discovery by nature").

Two other locations were considered and rejected:

- **`docs/knowledge/provident_fund/`** — mapped under the **Goose Financial** layer as "Canonical Knowledge, both tiers: atomic Knowledge Objects and composed Knowledge Models" (§3, line 58). This report is neither. The two existing files in that folder (`PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md`, `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md`) are themselves non-canonical discovery documents whose fit with that layer's stated purpose is not something this report resolves — adding a third document of a different kind (implementation audit, not legal/domain discovery) to an already-unformalized location would compound rather than clarify that open question.
- **`docs/modules/**` Capability/Review pairs** (e.g. `STUDY_FUND_CAPABILITY_REVIEW.md`) — also Goose Financial, requiring Product Owner approval, and structurally a *Review* of a paired *Capability* document (STUDY_FUND_CAPABILITY_REVIEW.md's own scope line: "the canonical description this review assesses"). No `PROVIDENT_FUND_CAPABILITY.md` exists to review against, and authoring one is out of scope for a read-only audit — it would itself be new product-policy content.

`GOOSE_EXPEDITION_1_ASSESSMENT.md` is the closer structural precedent in kind (not merely in numbering): its own scope line is "Repository Understanding Only," applied there to general architecture and here narrowed to one classification model — the same narrowing `GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` already applied to a single legal question. No Expedition template exists (`docs/foundation/templates/` contains only Capability/Review/Knowledge Object/Knowledge Model templates); this document follows Expedition 1's freeform structure (front matter, Evidence Levels, Assumptions, graded findings).

**Relationship to the two Codex discovery reports:** `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` describe external/legal reality (statutes, regulations, CMA circulars). This document describes implementation reality (what the code does). The two are deliberately **not reconciled here** — no statement below evaluates whether the code's model satisfies, contradicts, or should be changed by the external findings.

---

## Evidence Levels

**Level A** — verified directly in this session by reading the cited file/line during this investigation.
**Level B** — supported by existing project documentation (`docs/*.md`), not independently re-verified line-by-line in this pass.
**Level C** — a confirmed absence (e.g., "no test file references X"), established via directed search in this session.

Every citation below is Level A unless marked otherwise. All line numbers reflect the repository at the time of this reading (`app.js` is large and frequently edited; treat numbers as pointers to relocate, not permanent coordinates).

---

## Assumptions

- The repository's current committed state (no local uncommitted changes to `app.js`, `server.js`, or `index.html` at the time of this reading, confirmed via `git status`) is treated as the system under investigation.
- No production `localStorage` data was inspected; all statements about stored shape come from the code that reads/writes it, not from observed real records.
- Absence-of-evidence findings (no tests, no fixtures) rely on repository-wide `grep`/`find` and are stated as confirmed absences (Level C), not inferred.

---

# PART I — EVIDENCE

## 1. Field Inventory

| External / source field | Internal field | Ingestion path | Value type | Disposition | Downstream use |
|---|---|---|---|---|---|
| `TIKRAT-HAFKADA-MUTEVET` (XML, values `'1'`/`'2'`) | routes into `capital_exempt.balance_k` or `qualifying_annuity.balance_k` | `_salkahParseOneXML`, `app.js:17095-17101` | string enum | mapped (sum accumulated per value) | feeds `_t190Buckets` object, `app.js:17105-17109` |
| `SACH-ITRA-LESHICHVA-BESHACH` (XML, per-segment amount) | summed into `_t1K`/`_t2K` then divided by 1000 | `app.js:17096, 17099` | numeric string (agorot/NIS) | normalized (÷1000 → K₪) | same |
| (implicit) total balance minus tikrat-1 and tikrat-2 sums | `recognized_annuity.balance_k` | `app.js:17103-17104` | derived numeric | mapped by subtraction, clamped `≥0` | same |
| `SUG-MUTZAR` (XML, product type) | `type` local var, compared to `'3'` | `app.js:17012-17013, 17112` | string | mapped (gates the pre-2008 override) | pre-2008 routing rule |
| `TAARICH-HITZTARFUT-RISHON` (XML, first join date) | `_firstJoin`, compared as string `< '20080101'` | `app.js:17113-17115` | string date, hyphens stripped | mapped (gates override) | pre-2008 routing rule |
| `TAARICH-NECHONUT` (XML, data-currency date) | `xmlDataDate`, reformatted `YYYY-MM-DD` | `app.js:17083-17086` | string date | normalized | stored per product, used in manual-override date comparison (`docs/provident_funds_logic.md:130-139`, Level B) |
| `PerutYitraLeTkufa` / `KOD-TECHULAT-SHICHVA` (alternate XML schema, values 1-10) | routes into `exK`/`qualK`/`recK`/`recPrinK` | `_parseT190BucketsFromXML`, `app.js:18609-18618` | integer enum | mapped (direct sum, non-residual) | Branch B of `_t190SimGetBuckets` |
| `SUG-ITRA-LETKUFA` (alternate schema, balance type, `1`=principal) | `recPrinK` | `app.js:18610, 18617` | integer enum | mapped | `recognized_annuity.principal_manual_k` |
| PDF text, LLM-extracted `"קצבה מזכה"` label | `qualifying_annuity` (flat key in `/api/extract` JSON response) | `server.js:789, 798` (prompt instruction) | LLM-produced number or `null` | mapped via prompt instruction, no code-level validation beyond `EXPECTED_KEYS` whitelist | populates edit-modal input `#ffs-inv-t190-qualifying` (`app.js:18868`) |
| PDF text, LLM-extracted `"קצבה מוכרת"` label | `recognized_annuity` | `server.js:790, 798` | LLM-produced number, or `0` per instruction 3, or `null` | mapped via prompt instruction | same, `#ffs-inv-t190-recognized` |
| PDF text, LLM-extracted `"הון פטור"`/`"כספים הוניים"`/`"הפקדות עד 2007"` label | `exempt_capital` | `server.js:791, 797` | LLM-produced number or `null` | mapped via prompt instruction | `#ffs-inv-t190-exempt` |
| PDF text, LLM-extracted `"קרן קצבה מוכרת"` label | `recognized_principal` | `server.js:792` | LLM-produced number or `null` (or `0` per instruction 5) | mapped via prompt instruction | `#ffs-inv-f-recognized-principal` |
| PDF text, LLM-extracted `"עוגן 31/12"` label | `dec_31_anchor` | `server.js:793` | LLM-produced number or `null` | mapped via prompt instruction | `#ffs-inv-f-dec31-anchor` |
| Manual user keystrokes in edit-modal inputs | `_editedInv.buckets.{qualifying_annuity,recognized_annuity,capital_exempt}.balance_k` | `ffsSaveInvFromModal`, `app.js:16777-16798` | float parsed from `<input>` value | preserved (overwrites prior value unconditionally) | persisted via `ffsSaveProfile()` |
| Manual user keystroke in principal input | `buckets.recognized_annuity.principal_manual_k` | `app.js:16799-16803` | float, only written if input non-empty and parses | preserved (only on non-empty input; empty input leaves prior value untouched) | tax-calc principal in `_t190SimCalculate` |

**Adjacent, out-of-scope pipeline (noted, not traced further):** `server.js:26-58` (`/api/parse-masklaka`) and `_salkahFallbackToAI` (`app.js:17330-17395`, per prior research pass, not re-read line-by-line in this session) also read `TIKRAT-HAFKADA-MUTEVET`, but are hard-coded to `'סוג מוצר': 'קרן השתלמות'` (Study Fund) — a different asset category from `'קופת גמל'`. Not part of the provident-fund classification path. (Level B.)

## 2. Traced Flow

```
XML path:
  Mislaka XML string
    → _salkahParseOneXML(xmlString)                         app.js:16998
        → per Mutzar/HeshbonOPolisa node:
            → read PerutYitraLeTkufa segments                app.js:17091-17102
            → build _t190Buckets {qualifying_annuity, recognized_annuity, capital_exempt}
                                                               app.js:17105-17109
            → pre-2008 override check (type==='3' + join date) app.js:17111-17122
            → fallback: _parseT190BucketsFromXML(rawXml) if no _t190Buckets yet
                                                               app.js:17123-17125
        → product pushed with t190Buckets, rawXml, xmlDataDate app.js:17138-17148
    → (caller assigns product.t190Buckets into an investment item's `.buckets`;
       assignment site not re-traced in this pass — not located in the ranges read)

PDF path:
  PDF upload (drag/drop or file picker)                       app.js:18919-18940 (handler wiring)
    → POST /api/extract (multipart form + optional accountNumber)
                                                               app.js:18841-18844
    → server: pdfParse → identifier search → window slice → LLM call
                                                               server.js:750-827
    → EXPECTED_KEYS whitelist + number coercion               server.js:843-850
    → JSON response {qualifying_annuity, recognized_annuity, exempt_capital,
                      recognized_principal, dec_31_anchor}
    → frontend fields{} map writes values into modal <input> elements
                                                               app.js:18867-18877
    → (transient — not yet in FFS_PROFILE until Save)

Manual/Save path (both XML-populated and PDF-populated modal state converge here):
  Edit modal Save button
    → ffsSaveInvFromModal                                     app.js:16760-16809
        → guards: buckets exists / capital_exempt key exists   app.js:16765-16766
        → reads current <input> values                         app.js:16773-16780
        → change-detection vs prior stored values (tolerance 0.05)
                                                                app.js:16785-16794
        → writes buckets.qualifying_annuity.balance_k,
                 buckets.recognized_annuity.balance_k,
                 buckets.capital_exempt.balance_k               app.js:16796-16798
        → conditionally writes principal_manual_k                app.js:16799-16803
    → ffsSaveProfile()                                          app.js:8214-8221
        → localStorage.setItem(ffsGetActiveKey(), JSON.stringify(FFS_PROFILE))
                                                                 app.js:8219

Read/consume path (simulation modal):
  _t190SimGetBuckets(item)                                     app.js:18631-18696
    → Branch A: manual_override + dec_31_anchor_k>0 → scale stored ratios
                                                                 app.js:18636-18657
    → Branch B: rawXml re-parsed via _parseT190BucketsFromXML, ≥2 non-zero buckets
                                                                 app.js:18660-18670
    → Branch B': item.buckets rescaled proportionally to current balance
                                                                 app.js:18675-18692
    → Branch C: isEmpty:true fail-safe                          app.js:18694-18695
  → _t190SimCalculate()                                         app.js:18291-18480
    → tax computation (see §6)
    → _t190SimUpdateKPIs / _t190SimBuildReceipt / _t190SimRenderBucketFlow (UI render)

Load path (on app boot / profile load):
  ffsLoadProfile()                                              app.js:8142-8213
    → JSON.parse(localStorage.getItem(...))
    → migration: for each investment where _isProvidentCategory(inv.category),
      ensure buckets/manual_override/last_manual_update_date/dec_31_anchor_k exist
      if missing (non-destructive)                              app.js:8201-8209
```

## 3. Bucket Construction — Per Category

**`capital_exempt`:**
- Direct sum of segments where `TIKRAT-HAFKADA-MUTEVET === '1'` (`app.js:17100`), OR
- 100% of `rawBalance` when `SUG-MUTZAR==='3'` and `TAARICH-HITZTARFUT-RISHON < '20080101'` (`app.js:17111-17122`), overriding any tikrat-segment result, OR
- Direct sum of segments where `KOD-TECHULAT-SHICHVA` is 1–4, in the alternate-schema parser (`app.js:18613`), OR
- The PDF/LLM-produced `exempt_capital` value (`server.js:791`), OR
- Manually typed value (`app.js:16798`).

**`qualifying_annuity`:**
- Direct sum of segments where `TIKRAT-HAFKADA-MUTEVET === '2'` (`app.js:17101`), OR
- Direct sum of segments where `KOD-TECHULAT-SHICHVA` is 5–8 (`app.js:18614`), OR
- The PDF/LLM-produced `qualifying_annuity` value (`server.js:789, 798`), OR
- Manually typed value (`app.js:16796`).

**`recognized_annuity`:**
- In `_salkahParseOneXML`: `max(0, totalK - t1K - t2K)` — computed by subtraction from the segment-derived total, not summed from a distinct source tag (`app.js:17103-17104`).
- In `_parseT190BucketsFromXML` (alternate schema): direct sum of segments where `KOD-TECHULAT-SHICHVA` is 9–10, with `SUG-ITRA-LETKUFA===1` sub-segments additionally summed into `principal_manual_k` (`app.js:18615-18618`) — not a subtraction in this parser.
- The PDF/LLM-produced `recognized_annuity` value, which the prompt instructs to set to `0` (not `null`) when the source report shows no pension/qualifying split (`server.js:790, 798`).
- Manually typed value (`app.js:16797`).

**Unmapped/unrecognized tikrat values:** in `_salkahParseOneXML`'s segment loop (`app.js:17094-17102`), only `tikrat === '1'` and `tikrat === '2'` add to `_t1K`/`_t2K`; any other `tikrat` string value causes neither accumulator to change for that segment.

## 4. Mapping / Lookup / Conditional Inventory

| Mechanism | Location | Rule |
|---|---|---|
| `tikrat` 1/2 lookup | `app.js:17100-17101` | `'1'`→capital_exempt sum, `'2'`→qualifying_annuity sum |
| Pre-2008 override conditional | `app.js:17111-17122` | `SUG-MUTZAR==='3'` AND join date `< '20080101'` → all balance to capital_exempt |
| `KOD-TECHULAT-SHICHVA` range lookup | `app.js:18613-18618` | 1-4→exempt, 5-8→qualifying, 9-10→recognized (+principal sub-check) |
| PDF/LLM label-matching instructions | `server.js:785-818` | Hebrew label text → JSON key, with a "PHOENIX REPORTS" special-case block and a ±1K sum-validation self-check instruction |
| `_t190SimGetBuckets` branch priority | `app.js:18631-18696` | A (manual+anchor) → B (re-parsed XML, ≥2 nonzero) → B′ (stored buckets, rescaled) → C (empty) |
| `_t190CheckBucketSum` UI warning | `app.js:16379-16391` | flags UI-only mismatch between typed bucket sum and `dec_31_anchor_k`, does not alter stored data |
| `_t190AutoComplete` UI helper | `app.js:16393-16410` | if exactly one of the three modal inputs is empty and an anchor value exists, fills that one input as `anchor − other two` |

## 5. Persistence

**Persisted** (inside `FFS_PROFILE.investments[]`, written to `localStorage` key returned by `ffsGetActiveKey()` via `ffsSaveProfile()`, `app.js:8219`):
- `buckets.{qualifying_annuity,recognized_annuity,capital_exempt}.balance_k`
- `buckets.recognized_annuity.principal_manual_k`
- `manual_override` (boolean)
- `last_manual_update_date`
- `override_source` (`app.js:16792, 18862`)
- `dec_31_anchor_k`
- `rawXml` (raw serialized XML node, `app.js:17078-17080, 17144`)
- `t190_audit_notes` (`app.js:16808`)

**Transient** (exists only in DOM/JS state until an explicit Save):
- PDF/LLM `/api/extract` response values, held in modal `<input>` elements until `ffsSaveInvFromModal` runs (`app.js:18867-18877`).
- The re-parsed-on-the-fly result of `_parseT190BucketsFromXML(item.rawXml)` inside `_t190SimGetBuckets` Branch B (`app.js:18660-18670`) — not written back to `item.buckets`.
- The AI-chat payload object built in `_t190SimTriggerAIVerification` (`app.js:18950-18969`) — constructed per-call, not stored.

**`FFS_PROFILE` top-level shape:** defined at `app.js:7944` as a flat object with an `investments: []` array; no top-level field named after any of the three buckets exists on `FFS_PROFILE` itself — bucket data lives only per-item inside `investments[]`.

## 6. Downstream Consumers

| Consumer | Location | Representation trusted |
|---|---|---|
| `_t190SimCalculate` (tax engine) | `app.js:18291-18480` | `_t190SimGetBuckets(item).buckets` (snake_case `balance_k` fields) |
| `_t190SimUpdateKPIs` | `app.js:18539-18596` (per prior pass; not re-read line-by-line this session, Level B) | same, passed as function args |
| `_t190SimBuildReceipt` | `app.js:18489+` | same |
| `_t190SimRenderBucketFlow` | `app.js:18698+` | same, via `_t190SimLastResult.bucketFlow` object (`app.js:18430-18434`) |
| Edit modal (`_ffsPopulateT190Section`) | `app.js:16336-16499` | `item.buckets`, falling back to `_t190InitBuckets()` or a fresh `_parseT190BucketsFromXML(item.rawXml)` re-parse if the stored sum is 0 (`app.js:16353-16361`) |
| Edit modal Save (`ffsSaveInvFromModal`) | `app.js:16760-16809` | raw `<input>` element values, typed by the user or pre-filled from XML/PDF |
| `/api/chat/tax` advisor prompt | `server.js:689-745` | a camelCase payload (`capitalExemptK`, `qualifyingAnnuityK`, `recognizedAnnuityK`) built ad hoc in `_t190SimTriggerAIVerification` (`app.js:18950-18969`), not the same key casing as the persisted `buckets` object |
| `index.html` edit-modal inputs | `index.html:2793-2848` (per prior pass, confirmed input IDs at lines 2816, 2820, 2824, 2830, 2841 in this session) | DOM values only |

**Confirmed absence (Level C):** repository-wide search found no test file, fixture file, JSON export, or migration script referencing `qualifying_annuity`, `recognized_annuity`, `capital_exempt`, or their Hebrew source labels. `test-pdf.js` and `test_parser.js` exist in the repository root but do not reference these fields (grep performed this session).

## 7. Existing Documentation, Tests, and Uncertainty Markers

- **`docs/provident_funds_logic.md`** (276 lines, read in full this session) is the current de facto contract for this model: it documents the three-bucket schema, the residual formula for `recognized_annuity`, the pre-2008 override, the `_t190SimGetBuckets` branch table, manual-override date-comparison protection, and the AI-extraction windowing/hard-stop logic — consistent with the code read directly in this session.
- **`docs/T190_Tax_Rules.md`** exists (not re-read line-by-line this session; referenced in prior research pass, Level B) and documents the three tax rules (annuity/nominal/real) plus a "Phase 4" bucket table.
- **`docs/foundation/GOOSE_EXPEDITION_1_ASSESSMENT.md`** (read in full this session) flags, per its own text, a naming mismatch between `app.js` bucket keys and the `/api/extract` server response shape as an open question (Level B, cited by a prior research pass at lines 103/199 — not independently re-verified at those exact line numbers in this session).
- **`docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md`** (read in full this session) is an external/legal-research document about `capital_exempt`; its content is domain reality, not implementation reality, and is not restated or reconciled here.
- **`docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md`** and **`PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md`** (read in full this session) are external/legal discovery reports, explicitly "discovery only," not Knowledge Objects. Same relationship as above — noted as existing, not reconciled.
- **No Evidence Level A test, fixture, or code comment was found stating a known limitation, TODO, or uncertainty marker specifically about the classification model's internal correctness**, beyond `docs/provident_funds_logic.md`'s own documented "Schema Gotcha" (missing `capital_exempt` key causing a silent TypeError, lines 85-94) and "Form Validation Gotcha" (silent save failure on missing dropdown fields, lines 98-102) — both are Level B, drawn from that document's own text, not independently reproduced in code this session.

---

# PART II — ANALYSIS

*Everything in this section is interpretation of the evidence above — not itself independently verified fact. Nothing here evaluates external/legal correctness; it describes only what follows from the code's own construction.*

## A. Verified current implementation facts

1. Goose currently implements exactly one internal representation for provident-fund classification: three fixed keys (`qualifying_annuity`, `recognized_annuity`, `capital_exempt`), each holding only a single `balance_k` total (plus an optional `principal_manual_k` under `recognized_annuity`). No per-contribution, per-legal-component (`תגמולי עובד`/`תגמולי מעסיק`/`פיצויים`), per-cohort, or per-`רצף` field exists anywhere in the schema (§1, §5).
2. Two independent XML-parsing functions exist for the same conceptual data and disagree on method: `_salkahParseOneXML` computes `recognized_annuity` as a residual (total minus the other two), while `_parseT190BucketsFromXML` computes all three buckets as direct sums with no residual step (§3). Both are live and reachable — the first at initial XML import, the second as a Branch-B re-parse inside `_t190SimGetBuckets` and as a fallback inside the first parser itself when no tikrat segments are found (`app.js:17123-17125`).
3. The PDF/LLM extraction path and the two XML paths use different absence-semantics: the LLM path is explicitly instructed to return `null` for a field it cannot find (with a special-cased `0` for `recognized_annuity` when no pension split exists) (`server.js:790, 798-799`), while the XML residual path has no `null` state at all — an unmapped or absent value simply does not contribute to any bucket's sum, and the residual bucket absorbs the difference silently.
4. A third, unrelated code path (`pensionSliderChange`, `app.js:7082-7178`) computes a value it also calls "הון פטור" / `capitalExempt`, but from a completely different input (a UI slider percentage applied to `pnsExemptBasket`/`REAL_TAX_CONFIG.taxBasket`), operating on `PENSION_ASSETS`, not `FFS_PROFILE.investments[].buckets`. This is a same-vocabulary, different-mechanism coexistence within the repository, not a shared code path.
5. Camelcase field names (`capitalExemptK`, `qualifyingAnnuityK`, `recognizedAnnuityK`) appear only in the transient AI-advisor payload (`app.js:18950-18969`, consumed by `server.js:723-725`) — distinct from the persisted snake_case `buckets.*.balance_k` keys and from the flat `exempt_capital`/`qualifying_annuity`/`recognized_annuity`/`recognized_principal`/`dec_31_anchor` keys returned by `/api/extract`. Three different key-naming conventions exist across the pipeline for conceptually the same three values.
6. The `/api/chat/tax` system prompt (`server.js:701-703`) hard-codes specific Hebrew tax-status sentences (15% nominal capital-gains withholding on `capital_exempt`/`recognized_annuity` gains, 35%-or-marginal penalty for improper capital withdrawal of `qualifying_annuity`) as instructions to an LLM — a third independent statement of these tax figures in the repository, alongside `docs/T190_Tax_Rules.md` and the arithmetic actually executed in `_t190SimCalculate` (§6, evidence only — whether these three statements agree with each other is not evaluated here).

## B. Encoded implementation assumptions

- The `_salkahParseOneXML` residual formula assumes the tikrat scheme is effectively binary-plus-remainder: any segment value other than `'1'` or `'2'` is treated as if it does not exist for allocation purposes, with the *total* balance (not the sum of recognized segments) determining what's left over for `recognized_annuity`.
- The pre-2008 override assumes `SUG-MUTZAR==='3'` combined with a pre-2008 join date is sufficient, by itself, to justify routing 100% of the balance to `capital_exempt`, superseding whatever the tikrat segments (if present) would otherwise indicate.
- Branch B of `_t190SimGetBuckets` assumes a re-parsed XML result is trustworthy only when at least two of the three buckets are non-zero; a single non-zero bucket is treated as an unreliable "blind dump" and rejected in favor of Branch B′ (comment at `app.js:18659`, "reject single-bucket blind dump").
- The PDF-extraction prompt assumes the target document's internal math (bucket sum vs. reported total) is a reliable self-check, and explicitly instructs the model to return its best-guess values even when that check fails (`server.js:818`) rather than nulling out mismatched fields.
- `_t190ProportionalUpdate` and Branch B′'s rescaling both assume that the *relative proportions* among the three buckets remain valid when only the total balance changes — i.e., a balance update carries no information suggesting the classification mix itself has shifted.

## C. Source information currently preserved

- Three aggregate totals per provident-fund item (`balance_k` per bucket), regardless of ingestion path.
- One principal figure (`principal_manual_k`) for the `recognized_annuity` bucket only, and only when it has been supplied (via manual entry, PDF extraction, or the `KOD-TECHULAT-SHICHVA`/`SUG-ITRA-LETKUFA` alternate-schema parser).
- A manual-override flag, its date, and its source (`manual`/`ai`), which gates whether subsequent automated re-imports are allowed to overwrite the stored buckets.
- A single YTD anchor value (`dec_31_anchor_k`) per item, entered once and used for both a UI percentage display and (in Branch A) as the scaling basis for the stored bucket ratios.
- The raw XML node text itself (`rawXml`), which is available to be re-parsed on demand (Branch B, and the edit-modal's zero-sum fallback at `app.js:16358-16361`) even though its structured bucket content is not separately persisted beyond that raw string.

## D. Source information currently lost

- Any tikrat/layer value outside the two (or, in the alternate schema, three) recognized code ranges is not retained in any form — it neither creates a fourth bucket nor is logged; it is simply absent from every sum, meaning it is implicitly folded into whatever the residual bucket computes to in `_salkahParseOneXML`, with no trace of the original segment surviving.
- No per-employer, per-cohort, per-component, or per-event (e.g., `רצף`, `חשבון חדש`) distinction is retained at any point in the pipeline — every source segment that maps to the same one of three buckets is summed into a single number, and the mapping is one-directional (segment → bucket total; no reverse trace from a stored total back to its contributing segments, except by re-parsing `rawXml` from scratch).
- The two XML-parsing functions' disagreement on which bucket (if any) is a residual means that, depending on which function last populated `item.buckets` or was last re-parsed for a simulation, the same underlying document could in principle be represented as either a subtraction-derived or a directly-summed `recognized_annuity` value — the stored number does not indicate which method produced it.
- The PDF-extraction path's `null` values, once written into modal inputs and then saved, become plain empty/zero values in the persisted `buckets` object (`app.js:16777-16798` parses empty input as `0` via `parseFloat(...) || 0`) — the distinction between "confirmed zero" and "field was never found" does not survive into `FFS_PROFILE`.
- `recognized_annuity.principal_manual_k` is the only place any principal/gain distinction is preserved at all, and only for one of the three buckets; no equivalent principal-vs-gain split exists for `capital_exempt` or `qualifying_annuity` anywhere in the schema.
