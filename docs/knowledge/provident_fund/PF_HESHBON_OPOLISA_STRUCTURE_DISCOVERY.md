# Provident Fund — `HeshbonOPolisa` Structure Discovery

Date: 2026-07-25

Scope: discovery only. This report maps the schema/structural region surrounding `HeshbonOPolisa` and the path from it to `PerutYitraLeTkufa`, using actual repository evidence. It does not propose a Roy Reality data model, a TypeScript type, tax logic, or a complete Provident Fund model. It does not modify `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` — that document is referenced only, never restated as if this document were its source.

Method note: no official CMA-published XSD or Excel data dictionary was located in this repository or in the sibling Evidence Vault (`Goose_Evidence_Vault/`) — confirmed by direct search this session (see §2). In their absence, this report's structural map is built from (a) the single existing verified real-XML-path observation already on record in this repository, and (b) this codebase's own live XML-parsing code, which is real, verifiable evidence in its own right: it successfully parses Roy's real clearinghouse exports today, so its structural assumptions are not guesses — but it is not an official schema, and it uses deep-descendant search rather than direct-child search (see §3), which limits what it can and cannot prove about nesting depth.

## Evidence-status legend

- **Verified** — directly observed in a real XML-path excerpt, or confirmed by an official source.
- **Level A (code)** — read directly, this session, in the live application code that successfully parses real clearinghouse files.
- **Operationally Supported** — consistent, repeated evidence across independent code paths and/or documents, but not sourced from an official schema.
- **Named only** — appears in exactly one non-canonical document and is not otherwise corroborated.
- **Unknown** — not established by any source available this session.

---

## 1. Status and scope

**Status:** Discovery only. Evidence output, not a proposed Roy Reality hierarchy (per the task's own instruction — see §7 for the explicit, non-final comparison).

**Scope:** The structural region inside and immediately around one `HeshbonOPolisa` record, in the Clearinghouse Holdings interface (`ממשק אחזקות`) representation that this codebase's provident-fund import path (`_salkahParseOneXML`) consumes. Out of scope: the `BlockItrot` / `NesilutTag` blocks named in `Mislaka_Rules.md` §12a in a Study Fund extraction context (not investigated here; they are not Study-Fund-specific — `NesilutTag` was directly observed in the examined KGM Holdings evidence in both Provident Fund and Study Fund product types, see `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §13.6; universality across every product type or provider is not established), the Mobility (`ניוד`) interface (a structurally different interface family, not investigated here), tax rules, and any application/TypeScript design.

---

## 2. Evidence sources inspected

| Source | Type | What it contributed |
|---|---|---|
| Repository-wide search for `*.xsd` / `*.xml` | Negative search | **No XSD or XML file exists anywhere in this repository.** |
| `Goose_Evidence_Vault/primary_reality/clearinghouse_xml/` | Negative search | The Vault folder exists per its Phase 1 skeleton, but is currently empty. The only file present anywhere in the Vault is an unrelated synthetic test file (`primary_reality/salary_slips/TEST_SYNTHETIC_salary_slip.txt`). **No real Provident Fund XML instance was available to this session.** |
| `docs/knowledge/provident_fund/PF_TIKUN_190_XML_FIELD_DISCOVERY.md` | Existing discovery doc, not modified | The one **Verified** real XML-path observation for the region above `HeshbonOPolisa` (§3). |
| `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` | Existing discovery doc, not modified | `PerutYitraLeTkufa` as the smallest repeating balance record; the four axis fields. |
| `app.js`, lines 16988–17152 (`_salkahXmlEl`, `_salkahXmlEls`, `_salkahParseOneXML`) | Level A (code, read directly this session) | The live traversal from `Mutzar` → `HeshbonOPolisa` → field reads, including the `YeshutYatzran`-scoping fallback (§3) and the full direct-child field inventory (§4). |
| `app.js`, lines 18598–18629 (`_parseT190BucketsFromXML`) | Level A | Confirms `SACH-ITRA-LESHICHVA-BESHACH` as the amount field inside `PerutYitraLeTkufa`, independently of the parser above. |
| `app.js`, lines 20372–20400 (`_t190SimCalculate` re-scoping) | Level A | A third, independent confirmation of the same amount field; also confirms multiple `HeshbonOPolisa` siblings are disambiguated by `MISPAR-POLISA-O-HESHBON`. |
| `docs/provident_funds_logic.md` | Existing Goose Financial doc, not modified | Corroborates the field inventory and the two-parser field-name disagreement (`TIKRAT-HAFKADA-MUTEVET` vs. `KOD-TECHULAT-SHICHVA`). |
| `docs/foundation/GOOSE_EXPEDITION_3_PROVIDENT_FUND_CLASSIFICATION_IMPLEMENTATION.md` | Existing Roy Reality Lab doc, not modified | Independent Level-A field inventory and flow trace, consistent with this session's own code reading. |
| `Mislaka_Rules.md` (root, classification pending) | Existing root doc, not modified | Confirms PascalCase container-node naming convention (`Mutzar`, `HeshbonOPolisa`, `Maslulit`); confirms the `PerutYitrot` legacy fallback container; independently corroborates `SACH-ITRA-LESHICHVA-BESHACH` as an amount field, in a Study-Fund-scoped section. |
| `specialist_prompts.md` (root, classification pending) | Existing root doc, not modified | A third independent corroboration of `PerutYitraLeTkufa` / `SACH-ITRA-LESHICHVA-BESHACH` / `TIKRAT-HAFKADA-MUTEVET`, and confirms `MISPAR-POLISA-O-HESHBON` as one-record-per-`HeshbonOPolisa`. Explicitly Study-Fund-scoped by its own text (line 28 excludes `קופת גמל`) — used only as shared-vocabulary corroboration, not as Provident Fund structural evidence in its own right. |
| `audit_report.md` (root, classification pending) | Existing root doc, not modified | A synthetic, application-generated `rawXml` construction (not a real export) showing the app's own internal contract: `PerutYitraLeTkufa` elements as direct string-concatenated siblings inside `<HeshbonOPolisa>`, with no wrapper. Cited only as evidence of internal contract, explicitly not as proof of the real official schema. |
| `tech_doc.md` (root, classification pending) | Existing root doc, not modified | Confirms multiple `HeshbonOPolisa` siblings can exist under one `Mutzar`, and that account disambiguation by `MISPAR-POLISA-O-HESHBON` was a specific, dated bug fix (v181.36) — i.e., this is a real, previously-encountered structural fact, not a hypothesis. |

---

## 3. Exact XSD structural path

No official XSD was available (§2). The path below combines the one existing **Verified** real XML-path observation with what this session's direct code reading can and cannot corroborate.

**Verified** (from `PF_TIKUN_190_XML_FIELD_DISCOVERY.md`, itself sourced from a supplied real XML-path observation, corroborated by official Holdings Interface terminology):

```
Mimshak
 └─ YeshutYatzran
     └─ Mutzarim
         └─ Mutzar            [repeating]
             └─ HeshbonotOPolisot
                 └─ HeshbonOPolisa   [repeating]
                     └─ TIKUN-190
```

**What this session's code reading can and cannot corroborate:**

- `app.js`'s traversal helpers (`_salkahXmlEl` / `_salkahXmlEls`, `app.js:16988–16997`) use `ctx.getElementsByTagName('*')` filtered by `localName` — a **deep-descendant search**, not a direct-child search. This means the application code is, by construction, agnostic to whether `Mutzarim` and `HeshbonotOPolisot` exist as intermediate wrapper elements. It neither confirms nor denies them. The wrapper layers in the tree above remain evidenced by the single verified XML-path observation only — not independently re-confirmed this session.
- `app.js:17000–17003` (comment + code) proves `YeshutYatzran` nesting is **not universal**: `var _scope = _salkahXmlEl(doc, 'YeshutYatzran') || doc;` with the comment "Scope to `<YeshutYatzran>` when present (some providers, e.g. Altshuler, nest content there); fall back to the document root so all other providers continue to work unchanged." This is Level A, real evidence that at least one class of provider export places `Mutzar` without that wrapper.
- `app.js:17022–17028` proves `HeshbonOPolisa` itself is not guaranteed present: `var accountEls = _salkahXmlEls(m, 'HeshbonOPolisa'); ... if (accountEls.length > 0) { ... } else { nodes.push(m); }` — i.e., some real exports have no `HeshbonOPolisa` child at all, and the `Mutzar` itself is treated as the sole account node. `Mislaka_Rules.md` §9 documents the same fallback rule independently.

**Working structural path (this session, evidence-graded, not official):**

```
Mutzar                                          [repeating; parent context: Verified wrapped in Mutzarim under
                                                  YeshutYatzran in one real export; YeshutYatzran itself NOT
                                                  universal — Level A, app.js:17000-17003]
 └─ HeshbonOPolisa                               [repeating, OPTIONAL — falls back to Mutzar itself if absent —
                                                  Level A, app.js:17022-17028, Mislaka_Rules.md §9]
     └─ PerutYitraLeTkufa                        [repeating — see §4]
```

---

## 4. Direct-child structural map

Text tree, beginning at the closest meaningful parent above `HeshbonOPolisa` (`Mutzar`), through `HeshbonOPolisa`'s own fields, down to `PerutYitraLeTkufa`. All fields below are Level A (read directly in `app.js` this session) unless noted otherwise.

```
Mutzar  (product/fund container — one product may have MULTIPLE HeshbonOPolisa children)
│
├─ SUG-MUTZAR / KOD-SUG-MUTZAR / KOD-SUG-KUPA ... single value, Mutzar-level — product/fund type code
│                                                  (3 alias field names, tried in priority order)
├─ SHEM-TOCHNIT .................................. single value, Mutzar-level — product/plan name
├─ PENSIA-VATIKA-O-HADASHA ....................... single value, Mutzar-level — veteran/new pension-fund flag
│                                                  (gates a DIFFERENT, non-provident-fund code path)
│
└─ HeshbonOPolisa  [repeating; optional — Mutzar itself is the fallback account node if absent]
    │
    ├─ MISPAR-POLISA-O-HESHBON ..................... single value — policy/account number
    │                                                 (provider-assigned identifier; NOT treated here as
    │                                                  Roy Reality continuing identity — see boundary note below)
    ├─ KOD-STATUS-HESHBON / STATUS-HESHBON /
    │  KOD-STATUS-KUPA / STATUS-POLISA-O-CHESHBON .. single value — account status code
    │                                                 (4 alias field names, first match wins)
    ├─ TAARICH-NECHONUT ............................. single value — data-currency / as-of date (YYYYMMDD)
    ├─ TAARICH-HITZTARFUT-RISHON /
    │  TAARICH-HITZTARFUT-MUTZAR .................... single value — first-join date
    │                                                 (also used as a classification trigger — see §6)
    ├─ TIKUN-190 ..................................... single value — Amendment-190 account-level flag;
    │                                                 semantic meaning UNKNOWN (per PF_TIKUN_190_XML_FIELD_DISCOVERY.md;
    │                                                 not re-investigated this session)
    ├─ MEKADEM-MOVTACH-LEPRISHA ...................... single value — a "guaranteed retirement conversion
    │                                                 coefficient" (non-Vatika path only)
    │
    ├─ KITZVAT-HODSHIT-TZFUYA ........................ single value — expected monthly pension (Vatika path only)
    ├─ AHUZ-PENSIYA-TZVURA ............................ single value — accumulated pension percentage (Vatika path only)
    │
    ├─ TOTAL-CHISACHON-MTZBR [repeating] .............. total accumulated savings (max taken across occurrences)
    ├─ ITRA-TZVURA [repeating] ........................ accumulated balance (max taken across occurrences)
    ├─ SCHUM-TZVIRA-BAMASLUL [repeating] .............. accumulation amount per investment track (summed)
    │     (a container named `Maslulit` is mentioned once, in Mislaka_Rules.md §9 only, as a PascalCase
    │      block node alongside Mutzar/HeshbonOPolisa — it is never itself read by the live parsing code
    │      found this session; see §8)
    │
    ├─ PerutYitrot [repeating, LEGACY FALLBACK CONTAINER — distinct from PerutYitraLeTkufa below]
    │   └─ TOTAL-CHISACHON-MTZBR [repeating] .......... per-track balance sub-total; only consulted when the
    │                                                    three tags above all resolve to zero (older
    │                                                    Bituach Menahalim formats)
    │
    ├─ PerutYitraLeTkufa [repeating]  ◄── MONEY LAYER RECORDS (per docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md §3)
    │   ├─ TIKRAT-HAFKADA-MUTEVET ..................... single value per segment — classification field
    │   │                                                (observed values: empty, 1, 2)
    │   ├─ KOD-TECHULAT-SHICHVA ........................ single value per segment — classification field,
    │   │                                                alternate schema (observed: 3,4,5,6,7,9,13)
    │   ├─ SUG-ITRA-LETKUFA ............................ single value per segment — classification field,
    │   │                                                alternate schema (observed: 1,2)
    │   ├─ REKIV-ITRA-LETKUFA .......................... single value per segment — classification field
    │   │                                                (observed: 1,2,3,4,8,9); NOT read anywhere in the
    │   │                                                live application code found this session (see §8)
    │   └─ SACH-ITRA-LESHICHVA-BESHACH ................. single value per segment — THE AMOUNT FIELD for this
    │                                                    segment (new finding this session — see §8)
    │
    └─ PerutYitrotLesofShanaKodemet [container, observed 0..1]  — a DIFFERENT region from PerutYitraLeTkufa
        └─ YITRAT-SOF-SHANA ............................ single value — prior year-end (Dec 31) balance figure
```

**Boundary note (per task instructions):** `MISPAR-POLISA-O-HESHBON` is structurally the account/policy identifier in this schema, but per the task's explicit boundaries this document does not claim it defines the continuing identity of the Provident Fund in Roy Reality, and does not invent a stable transfer identifier from it.

---

## 5. Actual XML confirmation

**Not performed — no real Provident Fund XML instance was available.** Per §2, neither this repository nor the Evidence Vault's `clearinghouse_xml/` folder contains a real clearinghouse export at this time. The only XML-shaped material available was:

- one **path-only** excerpt (not a full document) quoted in `PF_TIKUN_190_XML_FIELD_DISCOVERY.md`, and
- a **synthetic, application-generated** `rawXml` construction found in `audit_report.md` (§2), built by the app's own AI-agent fallback path, not a real provider export.

Neither can answer the task's specific questions — which regions are populated, which are absent/optional in practice, how many `PerutYitraLeTkufa` records appear in a real example, or whether they appear directly or through an intermediate container. These questions are recorded as **Unknown** in §8 rather than answered from inference, per the Constitution's "Missing Truth Is Better Than False Precision."

**Next action implied by this gap:** obtain at least one real (or a redacted/non-identifying but structurally faithful) Provident Fund XML export into the Vault before the next structural pass — this is the single highest-value follow-up from this discovery.

---

## 6. Conservative region classification

| Region (child or child-region of `HeshbonOPolisa`, unless noted as Mutzar-level) | Tentative category | Basis | Confidence |
|---|---|---|---|
| `SUG-MUTZAR`/`KOD-SUG-MUTZAR`/`KOD-SUG-KUPA`, `SHEM-TOCHNIT`, `PENSIA-VATIKA-O-HADASHA` | Provider/product-level classification and administrative information — **Mutzar-level, above `HeshbonOPolisa`, not inside it** | `app.js` | High for "these sit above HeshbonOPolisa" |
| `MISPAR-POLISA-O-HESHBON` | Account/policy identity — administrative/provider-assigned | `app.js`, `Mislaka_Rules.md` | High for structural role; explicitly NOT classified as Roy Reality identity (§4 boundary note) |
| `KOD-STATUS-HESHBON` (+3 aliases) | Account-level administrative status | `app.js` §10, `Mislaka_Rules.md` §10 | High |
| `TAARICH-NECHONUT` | Provider/administrative representation (as-of date of the whole record) | `app.js` | High |
| `TAARICH-HITZTARFUT-RISHON`/`-MUTZAR` | Account identity field that also functions as an account-level classification trigger (pre-2008 rule) | `app.js`, `docs/provident_funds_logic.md` | Medium — plays a dual identity/classification role, not cleanly one or the other |
| `TIKUN-190` | Unknown / requires interpretation — account-level classification field of undetermined meaning | `PF_TIKUN_190_XML_FIELD_DISCOVERY.md` (explicitly UNKNOWN) | High for structural placement; Low for meaning |
| `MEKADEM-MOVTACH-LEPRISHA` | Ambiguous between account-level classification and fund-level financial state | `app.js` | Low/Medium |
| `KITZVAT-HODSHIT-TZFUYA`, `AHUZ-PENSIYA-TZVURA` | Fund-level financial state (Vatika/veteran-fund path only) | `app.js` | Medium — only observed for one product sub-type |
| `TOTAL-CHISACHON-MTZBR`, `ITRA-TZVURA`, `SCHUM-TZVIRA-BAMASLUL` | Fund-level (account-level) financial state | `app.js`, `Mislaka_Rules.md` §8 | High that these are financial-state fields; Unknown whether they represent the *same* financial state as the sum of `PerutYitraLeTkufa` segments, or a separate summary (see §8) |
| `PerutYitrot` (legacy container) | Financial-state / investment-track region, legacy schema variant | `app.js` comment, `Mislaka_Rules.md` §8 | Medium — clearly a fallback financial-state region; relationship to `PerutYitraLeTkufa` unresolved |
| `PerutYitraLeTkufa` | **Money Layer / balance-detail region** | `app.js` (3 independent code paths), `Mislaka_Rules.md`, `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` | High — the best-evidenced region in the entire structure |
| `PerutYitrotLesofShanaKodemet` → `YITRAT-SOF-SHANA` | Fund-level financial state — prior year-end (Dec 31) snapshot, explicitly distinct from `PerutYitraLeTkufa` | `app.js` | High for "this is a distinct region from PerutYitraLeTkufa"; Medium for its own precise category |
| `Maslulit` (named in `Mislaka_Rules.md` only) | Unknown / requires interpretation — plausibly investment-track information by name, never confirmed as read by live code | `Mislaka_Rules.md` §9 only | Low |

---

## 7. Comparison with the current Roy Reality hierarchy candidate

This is a comparison only — the candidate is **not** converted into a final definition here.

| Candidate branch | Status | Why |
|---|---|---|
| **Financial identity** | Partially supported | `MISPAR-POLISA-O-HESHBON` and `TAARICH-HITZTARFUT-RISHON` are structurally present, identity-shaped fields — but no field was found that behaves as a stable identity across transfer/provider change, and the task's own boundaries forbid treating the account number as that identity. The schema has identity-shaped material; it does not yet resolve what "Financial identity" should be built from. |
| **Fund-level classification** | Partially supported | Classification-shaped fields exist both above `HeshbonOPolisa` (`SUG-MUTZAR` at `Mutzar`-level) and inside it (`TIKUN-190`), but no single confirmed "fund-level classification" region sits cleanly inside `HeshbonOPolisa` with resolved meaning — `TIKUN-190`'s own semantics remain Unknown. |
| **Money Layers** (top-level) | Directly supported | `PerutYitraLeTkufa` is a clearly repeating, well-evidenced region inside `HeshbonOPolisa` carrying both classification and amount data — the strongest-supported branch of the candidate. |
| **· Money Layer classification** | Directly supported | `TIKRAT-HAFKADA-MUTEVET`, `KOD-TECHULAT-SHICHVA`, `SUG-ITRA-LETKUFA` confirmed per-segment inside `PerutYitraLeTkufa` in live code; `REKIV-ITRA-LETKUFA` confirmed structurally in prior discovery evidence, though not consumed by any code found this session. |
| **· Money Layer financial state** | Directly supported | `SACH-ITRA-LESHICHVA-BESHACH` is confirmed, this session, as the per-segment amount field — see §8 for why this is new evidence relative to the existing Money Layer definition. |
| **Fund-level financial state** | Directly supported, but under-modeled by the candidate as written | The schema shows at least three distinct sibling financial-state regions (current-period summary tags; the `PerutYitrot` legacy container; `PerutYitrotLesofShanaKodemet`'s prior-year snapshot), not one undifferentiated region. |
| **Administrative representation** | Directly supported | `KOD-STATUS-HESHBON` (+aliases), `TAARICH-NECHONUT`, and the Mutzar-level provider/product fields are clearly distinguishable from money-classification and money-state fields. |

No candidate branch is contradicted by the evidence gathered this session.

---

## 8. Unknowns and next decision required

1. **Whether `Mutzarim` and `HeshbonotOPolisot` are genuine, universal wrapper elements, or a single provider's export shape.** Only one verified real XML-path observation exists; not re-confirmed this session. `app.js`'s deep-descendant traversal cannot distinguish direct-child from nested-descendant placement, so the application's own successful parsing neither confirms nor denies these wrappers.
2. **Whether any intermediate structural layer exists between `HeshbonOPolisa` and `PerutYitraLeTkufa`.** Unknown. No XSD and no real XML instance was available this session to answer this directly.
3. **Whether `YeshutYatzran` nesting is universal or provider-specific.** Partially answered: `app.js`'s own fallback logic (§3) proves it is *not* universal for at least one provider class. A full provider-by-provider inventory was not attempted.
4. **The role of `Maslulit`.** Named once, in one non-canonical root document, never referenced in the live parsing code found this session. Whether it is a real, currently-relevant container, or stale/aspirational documentation, is unresolved.
5. **Whether `PerutYitrot` (legacy) and `PerutYitraLeTkufa` (current) can coexist in the same `HeshbonOPolisa`, or are mutually exclusive.** The code treats them as mutually exclusive by convenience (falls back to the legacy container only when other balance tags are zero) — an application-side heuristic, not a proven schema exclusivity rule.
6. **Whether `TOTAL-CHISACHON-MTZBR`/`ITRA-TZVURA`/`SCHUM-TZVIRA-BAMASLUL` represent the same financial state as the sum of `PerutYitraLeTkufa` segments, or a genuinely separate summary.** No evidence either way this session; the application computes these two figures independently and does not cross-validate them (`docs/foundation/GOOSE_EXPEDITION_3_PROVIDENT_FUND_CLASSIFICATION_IMPLEMENTATION.md` independently notes a related residual-vs-direct-sum disagreement between two parsers).
7. **No real Provident Fund XML instance was available this session** (§5) — the single most direct next action is obtaining one (real or redacted-but-structurally-faithful) into the Evidence Vault before the next structural pass.
8. **New evidence not yet reflected elsewhere:** `SACH-ITRA-LESHICHVA-BESHACH` as the `PerutYitraLeTkufa` amount field is confirmed this session across three independent code/document sources (Operationally Supported), directly answering the open point left in `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §3 ("No specific XML field name for the amount is used here... no other document in this repository has verified it"). **This document does not modify that definition** — whether and how to update it is a decision for Roy, not performed here.

**Next decision required (for Roy):**

- Whether to obtain a real, redacted Provident Fund XML sample for the Vault, since no real-data confirmation was possible this session (item 7).
- Whether to update `MONEY_LAYER_DEFINITION.md` §3 with the `SACH-ITRA-LESHICHVA-BESHACH` finding (item 8), given it directly resolves a question that document explicitly left open.
- Whether `Mutzarim`/`HeshbonotOPolisot`/`YeshutYatzran` wrapper variance should be treated as universal official schema (with providers as exceptions) or as genuine provider-specific variation (item 1, 3) — this affects how "the parent of `HeshbonOPolisa`" should eventually be named in the Roy Reality hierarchy, not decided here.
