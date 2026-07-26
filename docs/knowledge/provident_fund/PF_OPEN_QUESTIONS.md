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
- Real-account evidence (Altshuler account 6899425, examined against its own Annual Report, 2026-07-26): SUG-1 balances matched the Annual Report's Capital/lump-sum classification, and SUG-2 balances matched the Annual Report's Pension classification — demonstrated numerically and structurally. The same classification dimensions and amounts remained identifiable after the account's transfer from Altshuler to Mor; the mapping survived the transfer in this examined case.

**Current conclusion:** For the examined real account (Altshuler 6899425), SUG-1 and SUG-2 were shown to match the Annual Report's Capital and Pension classifications numerically and structurally, including continuity across the transfer to Mor. This is Operationally Supported for the examined case, but it is not yet a confirmed universal or legal rule — `PF_ROY_REALITY_DEFINITION.md` §6.1 does not assert "`SUG-1` = Capital" as a canonical rule, and this register does not either.

**Exact unresolved boundary:**
- Why a Contribution Event or balance is classified `SUG-1` versus `SUG-2` in the first place — no statute, regulation, or CMA circular establishing this has been found. This is explicitly not speculated on, per the instruction that governed this document's creation.
- Whether the mapping is universal across account types, providers, and scenarios. One account (Altshuler 6899425) has been fully validated to this evidentiary level; additional examined accounts do not contradict the observed mapping but have not yet been analyzed to the same level.
- The absence of an authoritative legal or CMA value dictionary defining the field and its classification rule — the same category of primary source missing per Q3.

**What would close it:** A primary legal/regulatory source (the statutory or regulatory text governing the `SUG` classification), or an authoritative CMA circular defining the field's value dictionary and classification rule — the same category of primary source still missing per Q3.

---

## Q3 — Relationship Between KOD-TECHULAT-SHICHVA and Legal Regime

**Question:** What do the observed KOD-TECHULAT-SHICHVA values mean in terms of historical contribution periods and the underlying legal regime?

**Current evidence:**
- `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` §4, §6: `KOD-TECHULAT-SHICHVA` is a confirmed per-segment classification field inside `PerutYitraLeTkufa` (observed values 3, 4, 5, 6, 7, 9, 13).
- `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`: Status B — the official Holdings data dictionary (`MivneAchid_Holdings_Excel.xlsx` and the corresponding provident-fund XSD) was positively identified but could not be recovered from any public source or archive checked.
- Real-account evidence (Altshuler account 6899425, examined against its own Annual Report, 2026-07-26): comparison demonstrated numerically and structurally that KOD 3 → first historical period, through 2004; KOD 5 → second historical period, 2005–2007; KOD 7 → third historical period, from 2008 onward. Evidence level: Operationally Supported, not Verified.
- The same three classification dimensions remained identifiable after the transfer to Mor.
- Other observed values include 4, 6, 9, and 13, whose meanings have not yet been established.

**Current conclusion:** `KOD-TECHULAT-SHICHVA` is a confirmed, structurally placed classification field. For account 6899425, the mappings — 3 → through 2004, 5 → 2005–2007, 7 → from 2008 onward — are Operationally Supported. The complete code-value mapping is not established. This evidence is sufficient to inform Roy Reality modeling for the examined case; it is not sufficient to claim recovery of the complete official KOD code-book.

**Exact unresolved boundary:**
- The official CMA data dictionary or XSD has not been recovered by any documented search (gov.il, Wayback Machine, Common Crawl, GitHub/GitLab, industry mirrors — all checked per `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`).
- Whether these mappings are universal across all Provident Fund account types and providers.
- The meanings of the remaining observed values, including 4, 6, 9, and 13.
- The exact statutory or regulatory rule represented by each value.

**What would close it:** Any of the three primary artifacts named in `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`'s "What would close the evidence gap" section: the official workbook, the official XSD, or an authoritative implementation package. Additional independent real-account evidence that confirms the remaining values and the universality of the established mappings would also help close it.

*Note: TIKUN-190 value decoding is no longer open — 1 = Yes, 2 = No. It is an account-level flag and is not part of this question. The semantic meaning of what the flag affirms or denies remains outside the scope of this question and is not inferred here.*

---

*This register is the single place genuinely unresolved Provident Fund questions are tracked. It does not duplicate `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §8's own open-work list (Money Layer code-book verification), which remains owned by that document. New discovery evidence closing or narrowing a question here should update the relevant entry in place, not create a parallel restatement.*
