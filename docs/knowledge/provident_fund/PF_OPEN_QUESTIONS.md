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
- Real-account evidence (Altshuler account ALT-EX-2, examined against its own Annual Report, 2026-07-26): SUG-1 balances matched the Annual Report's Capital/lump-sum classification, and SUG-2 balances matched the Annual Report's Pension classification — demonstrated numerically and structurally. The same classification dimensions and amounts remained identifiable after the account's transfer from Altshuler to Mor; the mapping survived the transfer in this examined case.

**Current conclusion:** For the examined real account (Altshuler account ALT-EX-2), SUG-1 and SUG-2 were shown to match the Annual Report's Capital and Pension classifications numerically and structurally, including continuity across the transfer to Mor. This is Operationally Supported for the examined case, but it is not yet a confirmed universal or legal rule — `PF_ROY_REALITY_DEFINITION.md` §6.1 does not assert "`SUG-1` = Capital" as a canonical rule, and this register does not either.

**Exact unresolved boundary:**
- Why a Contribution Event or balance is classified `SUG-1` versus `SUG-2` in the first place — no statute, regulation, or CMA circular establishing this has been found. This is explicitly not speculated on, per the instruction that governed this document's creation.
- Whether the mapping is universal across account types, providers, and scenarios. One account (ALT-EX-2) has been fully validated to this evidentiary level; additional examined accounts do not contradict the observed mapping but have not yet been analyzed to the same level.
- The absence of an authoritative legal or CMA value dictionary defining the field and its classification rule — the same category of primary source missing per Q3.

**What would close it:** A primary legal/regulatory source (the statutory or regulatory text governing the `SUG` classification), or an authoritative CMA circular defining the field's value dictionary and classification rule — the same category of primary source still missing per Q3.

**Update 2026-09-21 — working interpretation added (question narrowed, not closed):** Severance evidence in Mor case MOR-1 (identifier masked) carries both `REKIV1 / SUG1` and `REKIV1 / SUG2`. Together with external institutional reporting — the Israel Aerospace Industries Employees Provident Fund report, which distinguishes severance-component money deposited through 31.12.2007 and states that money deposited from 1.1.2008 onward is designated for pension — this supports the following **working interpretation, supported by the examined Provident Fund evidence** (not an official XML field-dictionary decoding): `SUG-1` = money attributable to deposits through 31.12.2007 (historical capital regime); `SUG-2` = money attributable to deposits from 01.01.2008 (pension regime). Status: Evidence Supported — not an official XML-dictionary decoding, and not a legal rule. What remains unresolved is unchanged in kind: no statute, regulation or CMA dictionary defining the field has been recovered (the external report is not an official decoding of `SUG-ITRA-LETKUFA`, and statutory / regulatory text for the boundary has not yet been attached), and universality is not established. Whether the interpretation extends beyond severance is not established. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §3; registry `PF-KR-006`.

---

## Q3 — Relationship Between KOD-TECHULAT-SHICHVA and Legal Regime

**Question:** What do the observed KOD-TECHULAT-SHICHVA values mean in terms of historical contribution periods and the underlying legal regime?

**Current evidence:**
- `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` §4, §6: `KOD-TECHULAT-SHICHVA` is a confirmed per-segment classification field inside `PerutYitraLeTkufa` (observed values 3, 4, 5, 6, 7, 9, 13).
- `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`: Status B — the official Holdings data dictionary (`MivneAchid_Holdings_Excel.xlsx` and the corresponding provident-fund XSD) was positively identified but could not be recovered from any public source or archive checked.
- Real-account evidence (Altshuler account ALT-EX-2, examined against its own Annual Report, 2026-07-26): comparison demonstrated numerically and structurally that KOD 3 → first historical period, through 2004; KOD 5 → second historical period, 2005–2007; KOD 7 → third historical period, from 2008 onward. Evidence level: Operationally Supported, not Verified.
- The same three classification dimensions remained identifiable after the transfer to Mor.
- Other observed values include 4, 6, 9, and 13, whose meanings have not yet been established.

**Current conclusion:** `KOD-TECHULAT-SHICHVA` is a confirmed, structurally placed classification field. For ALT-EX-2, the mappings — 3 → through 2004, 5 → 2005–2007, 7 → from 2008 onward — are Operationally Supported. The complete code-value mapping is not established. This evidence is sufficient to inform Roy Reality modeling for the examined case; it is not sufficient to claim recovery of the complete official KOD code-book.

**Exact unresolved boundary:**
- The official CMA data dictionary or XSD has not been recovered by any documented search (gov.il, Wayback Machine, Common Crawl, GitHub/GitLab, industry mirrors — all checked per `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`).
- Whether these mappings are universal across all Provident Fund account types and providers.
- The meanings of the remaining observed values, including 4, 6, 9, and 13.
- The exact statutory or regulatory rule represented by each value.

**What would close it:** Any of the three primary artifacts named in `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`'s "What would close the evidence gap" section: the official workbook, the official XSD, or an authoritative implementation package. Additional independent real-account evidence that confirms the remaining values and the universality of the established mappings would also help close it.

**Update 2026-09-21 — `KOD9` observation (qualifies the period mapping; does not extend it):** In severance evidence the same `KOD-TECHULAT-SHICHVA` = 9 (research notation `KOD9`; field and value confirmed by Roy) always appears with `REKIV1`. In case MOR-1 (identifier masked) that one `KOD9 / REKIV1` spans **both** `SUG1` and `SUG2`; in active case MOR-2 `KOD9 / REKIV1 / SUG2` is current post-2008 severance. `KOD9` is therefore **not** simply the pre/post-2008 distinction, and `KOD-TECHULAT-SHICHVA` is not a pure date-period code in general. The period mappings above (3 / 5 / 7, one examined Altshuler account) must not be extended to `KOD9`. `KOD9` is recorded as **Observed, semantics unresolved**: the field and value are confirmed, the official meaning of value 9 is not, and no meaning is to be inferred or assigned. It must not be recorded as `KOD9 = severance`. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §9; registry `PF-KR-011`.

**Update 2026-09-22 — the same missing dictionary also gates the `YitrotShonot` fields (no change to this question's scope):** The Holdings XML also contains a separate severance-related family, `YitrotShonot`, including the account-level field `YITRAT-PITZUIM-LELO-HITCHASHBENOT` and the sequence-existence flags `KAYAM-RETZEF-PITZUIM-KITZBA` / `KAYAM-RETZEF-ZECHUYOT-PITZUIM`. Their authoritative semantics and enum mappings are unrecovered and are tracked under Q4 (boundary items 1–2), because the missing artifact is the same one named here. Registry `PF-KR-012`; detail `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §13.6–§13.9.

*Note: TIKUN-190 value decoding is no longer open — 1 = Yes, 2 = No. It is an account-level flag and is not part of this question. The semantic meaning of what the flag affirms or denies remains outside the scope of this question and is not inferred here.*

---

## Q4 — Severance Rights Matrix

**Question:** What exact rights, conditions and tax consequences result from the severance Money-Layer regimes (through 31.12.2007 / capital regime; from 01.01.2008 / pension regime) and from the choices available at an employment-termination / retirement event?

**Current evidence:**
- The existence of a meaningful pre/post-2008 distinction for severance money is supported (`PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §3; registry `PF-KR-006`).
- Capital regime character is not tax-free, and pension regime character is not monthly-pension-only (`PF-KR-007`).
- Exempt grants enter the Fixation of Rights calculation and reduce the exempt capital, per the Tax Authority's Form 161ד (`PF-KR-010`); the exact mechanism for exempt severance grants remains unresolved.
- Lump-sum severance grant, annuity sequence (רצף קצבה) and severance sequence (רצף פיצויים) are distinct mechanisms; pension capitalization (היוון קצבה) is a different mechanism again (`PF-KR-009`).
- `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5 and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A2, §D2 record severance-disposition statuses as event-created, and employer rights as depending on labor-law conditions.

**Current conclusion:** The distinction exists; the rights matrix it produces is **not** established. No cell of the matrix is asserted.

**Exact unresolved boundary:**
1. Is every pre-2008 severance `SUG1` amount (working interpretation) in Roy's current funds presently eligible for capital withdrawal?
2. What exact conditions allow post-2008 severance `SUG2` to be received as a lump-sum grant?
3. How is the exempt portion determined in each case?
4. What happens to the taxable portion?
5. How do the alternatives affect future qualifying-pension exemption and Fixation of Rights (קיבוע זכויות)?
6. What exact rights / conditions distinguish lump-sum severance withdrawal, annuity sequence and severance sequence? (Including the rules for withdrawing from a previous annuity-sequence decision.)
7. What employer rights or possible employer claims apply to each severance layer / state?
8. Which rights belong intrinsically to the Money Layer, and which depend on a future retirement / termination event or user choice?

**What would close it:** Current Tax Authority form instructions for 161 / 161ג / 161ד in full (not service-page summaries), the controlling statutory text, and, for the XML side, the official Holdings data dictionary (see Q3). Roy's own Form 161 rights and choices are inputs to the future scenario, not evidence of the Money Layer.

**Update 2026-09-22 — evidence added and boundary refined (Q4 remains OPEN; not closed, no matrix cell asserted):**

*Evidence added* (detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §13; registry `PF-KR-012`, `PF-KR-008` refinement):
- The severance domain needs an explicit intermediate State / Event structure between Money and Rights: Money Layer → Statutory Regime → Current Tax / Disposition State → Employment / Termination / Retirement Event Context → Current Rights → Available Choice → Immediate Consequence → New State → Future Consequence. A Choice at an event can create a later Rights / Disposition State. Working structure — not a verified state machine.
- The examined Holdings XML contains a separate `YitrotShonot` severance family; in both examined severance cases the account-level `YITRAT-PITZUIM-LELO-HITCHASHBENOT` amount reconciles exactly to the total `REKIV1` severance Money-Layer balance. Money Layer identity and the separate account-level severance information in `YitrotShonot` are therefore distinct dimensions in the examined evidence. Whether that information constitutes a tax / disposition / rights state remains under investigation (open hypothesis, not weakened; not established). Legal meaning not established.
- Clearinghouse severance ≠ necessarily total severance reality: institutional severance reality must be distinguished from employer / non-institutional severance reality.
- Employer rights are not a property of `SUG1` / `SUG2`; they belong to the Event / Rights model.

*Exact remaining research boundary* (supersedes the working scope of the eight items above where they overlap; those items are retained for history — original 1–2 → 4; 3 → 5; 4 → 6; 5 → 7; 6 → 4 and 8; 7 → 9; 8 → 11):
1. Authoritative legal / interface semantics of `YITRAT-PITZUIM-LELO-HITCHASHBENOT`. (Working hypothesis only: a severance tax / disposition-state field for which the relevant settlement has not yet been completed. **Not verified.**)
2. Authoritative enum mapping for `KAYAM-RETZEF-PITZUIM-KITZBA` and `KAYAM-RETZEF-ZECHUYOT-PITZUIM`. Observed numeric values are not mapped; presence of a populated flag does not prove an active sequence.
3. Whether Holdings XML contains sufficient **Current State** to derive current institutional severance rights without reconstructing the provider's full historical severance ledger. (Open research hypothesis.)
4. Exact eligibility conditions for: lump-sum severance grant; annuity sequence; severance sequence — including how the pre/post-2008 regime affects eligibility, if at all.
5. Exact exempt-amount calculation.
6. Treatment of the taxable amount.
7. Exact Fixation-of-Rights consequence under current law (Section 9A mechanism, coefficient, which grants count, exclusions, interaction with the qualifying-pension exemption).
8. Exact reversal / transition rules for prior sequence choices.
9. Employer rights and claims.
10. Integration of employer / non-institutional severance into Total Severance Reality (initially potentially via explicit / manual event input; later possibly employer / Form-161-derived data). Future requirement — nothing is implemented.
11. Which properties belong intrinsically to Money Layer versus State versus Event versus Rights.

*Additional closing sources:* an authoritative XML / interface dictionary for the `YitrotShonot` fields (same artifact as Q3); primary citations for the Tax Authority and Capital Market material on termination as a tax event and on sequence choices (not attached in the 2026-09-22 checkpoint).

*Status:* OPEN. `KOD9` remains unresolved (Q3). Q5 is a separate question and is not merged into Q4.

---

## Q5 — Form 161 Choice Model versus Existing Retirement-Simulation Inputs

**Question:** Does the actual Form 161 decision structure, and its related tax rules, provide the correct domain basis for the user's severance choices in a future Provident Fund retirement scenario — and how does it compare with the inputs the current retirement simulation already has?

**Current evidence:** `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §6.4. Form 161 is a decision point for future termination / retirement, not current XML evidence. The current simulation's fields may predate the Money Layer / Rights understanding; they are **not** assumed to represent the Form 161 / severance choice model.

**Current conclusion:** Not studied. Recorded as a future design requirement: Reality → Rights → Form-161-related scenario inputs → Simulation. Legal / domain reality must not be forced into the existing UI or data structure.

**Exact unresolved boundary:** The Form 161 decision structure itself has not been studied in full, and has not been compared with the existing simulation inputs. Depends on Q4.

**Known implementation conflict recorded with this question (future correction required):** `docs/provident_funds_logic.md` ("Pre-2008 Legacy Funds — Critical Routing Rule") routes the entire balance of a pre-2008 provident fund to `capital_exempt`. Pre-2008 capital character must **not** automatically imply `capital_exempt` (capital ≠ tax-free — registry `PF-KR-007`). That document is implementation-facing and was not modified; the correction belongs with this question's future work. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §11.1.

**What would close it:** A dedicated study of the Form 161 decision structure, followed by an explicit comparison with existing simulation inputs. This register records the question only; no implementation is implied.

**Update 2026-09-22 — status unchanged; kept separate from Q4:** The Q4 checkpoint refined how Form 161 is understood as a domain concept (an event-reconciliation / decision document connecting employer reality, institutional money, event-created rights, choices and tax treatment — `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §13.4). This is domain-modeling input only. The Form 161 decision structure has still not been studied in full or compared with the existing simulation, and Q5 remains a future-facing question that depends on Q4.

---

*This register is the single place genuinely unresolved Provident Fund questions are tracked. It does not duplicate `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` §8's own open-work list (Money Layer code-book verification), which remains owned by that document. New discovery evidence closing or narrowing a question here should update the relevant entry in place, not create a parallel restatement.*
