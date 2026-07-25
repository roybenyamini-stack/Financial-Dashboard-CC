# Provident Fund — Open Questions (Living Register)

**Status:** Living document. Updated in place as questions close — not superseded by a new discovery document restating the same open item.
**Author:** Claude Code
**Product Owner:** Roy
**Scope:** Genuinely unresolved research questions referenced by `docs/knowledge/provident_fund/PF_ROY_REALITY_DEFINITION.md`. This is not a discovery log and not a backlog of brainstormed ideas — every entry below is a question already surfaced by existing evidence, not a new one invented here.

Each entry states: the current evidence, the current conclusion (what can safely be said today), and the exact unresolved boundary (the precise remaining gap) — per `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §2's principle that a document's staleness or incompleteness must be stated explicitly, not left for a reader to discover.

---

## Q1 — Exact Layer Creation Rules

**Question:** When does a Contribution Event create a new Money Layer, versus accumulate into an existing one?

**Current evidence:**
- `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §B1–§B2: the smallest legally meaningful unit is a "homogeneous rights-bearing balance segment" — a segment must remain separate whenever legal account component, tax subcomponent, employer-period/separation cohort, legal reform cohort, or later event-created status (`רצף`) differ and still affect future rights.
- `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.2: contribution allocation is the point at which a layer's source/legal-component attribute is created (Regulation 49א; Section 21).

**Current conclusion:** Aggregation of a Contribution Event into an existing Money Layer is safe only when the Contribution Event's classification dimensions match that layer's exactly. Where any relevant dimension differs (component, tax subcomponent, cohort, employer-period, later event status), a distinct Money Layer is required. This is the basis for `PF_ROY_REALITY_DEFINITION.md` §4.2's statement that a Contribution Event does not necessarily create a new layer.

**Exact unresolved boundary:** No primary source states the operational trigger a provider's own system actually applies at contribution time to decide "new layer vs. accumulate." `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §E records this directly as unresolved (items 1–6): the official CMA `מבנה אחיד` Excel/XSD attachments needed to confirm live field-level behavior were not obtainable.

**What would close it:** Recovery of the official CMA Holdings/transfer-interface data dictionary (see Q3), or a primary provider/clearinghouse operational specification describing the contribution-posting algorithm.

---

## Q2 — Exact Legal Mapping Between Contribution Types and SUG Classification

**Question:** Why does a given Contribution Event or balance become `SUG-1` versus `SUG-2` in the XML, and why does that correlate with Capital versus Pension in the Annual Report's Retirement View?

**Current evidence:**
- Roy-supplied real annual-report observation (2026-07-25): the Retirement View presents Capital and Pension; `SUG-1` is observed alongside Capital, `SUG-2` alongside Pension.
- `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.3: Altshuler's short annual report foregrounds "יתרת הכספים המיועדים למשיכה כקצבה" (balance designated for pension withdrawal) and "יתרת הכספים המיועדים למשיכה חד פעמית" (balance designated for lump-sum withdrawal) — the same Capital/Pension framing, from an independently-observed real report.

**Current conclusion:** A strong correlation between XML `SUG` values and the Annual Report Retirement View's Capital/Pension classification is observed. This is stated explicitly as a **correlation**, not a canonical or universal mapping — `PF_ROY_REALITY_DEFINITION.md` §6.1 does not assert "`SUG-1` = Capital" as a rule, and this register does not either.

**Exact unresolved boundary:** No statute, regulation, or CMA circular establishing *why* a Contribution Event or balance is classified `SUG-1` versus `SUG-2` has been found. This is explicitly not speculated on, per the instruction that governed this document's creation.

**What would close it:** A primary legal/regulatory source (the statutory or regulatory text governing the `SUG` classification), or an authoritative CMA circular defining the field's value dictionary and classification rule — the same category of primary source still missing per Q3.

---

## Q3 — Relationship Between KOD and Legal Regime

**Question:** What do the observed KOD-prefixed classification fields (`KOD-TECHULAT-SHICHVA`, and the account-level `TIKUN-190` flag) mean in terms of the underlying legal regime?

**Current evidence:**
- `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` §4, §6: `KOD-TECHULAT-SHICHVA` is a confirmed per-segment classification field inside `PerutYitraLeTkufa` (observed values 3, 4, 5, 6, 7, 9, 13); `TIKUN-190` is a confirmed account-level (`HeshbonOPolisa`) flag, observed values `1`/`2`.
- `PF_TIKUN_190_XML_FIELD_DISCOVERY.md`: `TIKUN-190`'s placement is Verified; its semantic meaning is explicitly UNKNOWN — the official CMA Holdings Excel/XSD row was not obtained, and no official source confirms what "yes"/"no" refers to.
- `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`: Status B — the official Holdings data dictionary (`MivneAchid_Holdings_Excel.xlsx` and the corresponding provident-fund XSD) was positively identified but could not be recovered from any public source or archive checked.

**Current conclusion:** `KOD-TECHULAT-SHICHVA` and `TIKUN-190` are confirmed, structurally placed classification fields. Neither has a confirmed legal-regime meaning. No code-value-to-legal-rule mapping is established for either field.

**Exact unresolved boundary:** The official CMA data dictionary or XSD has not been recovered by any documented search (gov.il, Wayback Machine, Common Crawl, GitHub/GitLab, industry mirrors — all checked per `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`). Closing this requires one of: a recovered copy of the official workbook/XSD, or a CMA/clearinghouse implementation package that reproduces the data-dictionary rows with declared source and version.

**What would close it:** Any of the three primary artifacts named in `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`'s "What would close the evidence gap" section: the official workbook, the official XSD, or an authoritative implementation package.

---

*This register is the single place genuinely unresolved Provident Fund questions are tracked. It does not duplicate `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §8's own open-work list (Money Layer code-book verification), which remains owned by that document. New discovery evidence closing or narrowing a question here should update the relevant entry in place, not create a parallel restatement.*
