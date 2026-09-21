# Provident Fund — Severance Identity, Regime Split, and Rights/Choice Architecture

Date: 2026-09-21

**Status:** Discovery / domain knowledge record. Documentation only — no implementation, no simulation change, no Rights Engine, no tax or Fixation-of-Rights calculation is defined or performed here.
**Author:** Claude Code (recording conclusions established in Roy's research sessions)
**Product Owner:** Roy
**Scope:** Preserves established Provident Fund knowledge about the severance (פיצויים) component so the project does not depend on conversational memory (`docs/foundation/GOOSE_WORKFLOW.md`, Guiding Principle). The document follows one line of reasoning:

```
Severance identity → pre/post-2008 regime split → capital/pension vs tax
→ Money Reality / Rights / Scenario → Form 161 choices → Fixation-of-Rights consequence
→ unresolved Rights Matrix → KOD9 unresolved
```

Concise conclusions are registered in `PF_KNOWLEDGE_REGISTRY.md` (PF-KR-005 to PF-KR-011); unresolved questions are tracked in `PF_OPEN_QUESTIONS.md` (Q2, Q3 updated; Q4, Q5 new). Historical material stays by reference.

**Addendum 2026-09-22 (§13):** Q4 end-of-session checkpoint. Extends §5–§8; does not replace or reopen anything above. Q4 remains OPEN. Registry: PF-KR-012 (new), PF-KR-008 (refined).

---

## 0. Evidence and confidence discipline

Vocabularies are those already in `PF_KNOWLEDGE_REGISTRY.md`, unmodified:

- **Confidence:** Observed · Evidence Supported · Operationally Supported · Verified.
- **XML Completeness** — whether the required reality/information is represented in XML: Confirmed in XML · Partially Supported · Not Yet Identified · Confirmed Missing. It is **not** used here to record that a code is physically present in XML, and it is kept separate from confidence and from official field semantics.

Each section labels whether it states *observed evidence*, *evidence-supported knowledge*, a *working interpretation*, or an *unresolved* question. No authoritative XML field dictionary has been recovered (`PF_OPEN_QUESTIONS.md` Q3; `MONEY_LAYER_DEFINITION.md` §7), so nothing below is **Verified** at the level of XML field semantics.

---

## 1. Evidence base, privacy masking, and scope rule

### 1.1 Source of evidence

Roy's real clearinghouse XML exports and the clearinghouse Severance Balance Report for Income Tax Purposes (דוח יתרות כספי פיצויים לצרכי מס הכנסה). These are **Private Evidence** (`docs/foundation/EVIDENCE_HANDLING.md` §1), not stored in this repository. Exact amounts and other personal values are retained only in Private Evidence; this document records the structural finding, not the values that proved it (`EVIDENCE_HANDLING.md` §5.1).

### 1.2 Privacy masking (this repository is public)

This document contains **no real account or policy numbers**. Real accounts are replaced by neutral case identifiers (`EVIDENCE_HANDLING.md` §5, §5.1; `GIT_PRIVACY_REMEDIATION_INCIDENT.md`). The case-to-account mapping is held in Roy's Private Evidence and is not recorded here.

| Case ID | Meaning |
|---|---|
| **MOR-1** | A Mor provident-fund account holding severance in both `SUG1` and `SUG2`; receiving account of a transfer from ALT-SRC-1. |
| **MOR-2** | A second Mor provident-fund account whose entire balance is severance (`SUG2`), still receiving deposits. |
| **ALT-SRC-1** | The Altshuler source account whose money was transferred into MOR-1. |
| **ALT-EX-2** | A separate Altshuler account examined in `PF_OPEN_QUESTIONS.md` Q2 / Q3. |
| **Further cases** | Three further evidence cases; identifiers withheld. |

Exact balances and account-specific values are **not** recorded in this document (`EVIDENCE_HANDLING.md` §5.1); they remain in Private Evidence. Evidence snapshot dates are retained only where needed to identify the evidence set.

### 1.3 Field-name reading (confirmed by Roy, 2026-09-21)

| Notation | Field | Observed value set (`UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` §B) |
|---|---|---|
| `KOD9` | `KOD-TECHULAT-SHICHVA` = 9 | 3, 4, 5, 6, 7, 9, 13 |
| `REKIV1` | `REKIV-ITRA-LETKUFA` = 1 | 1, 2, 3, 4, 8, 9 |
| `SUG1` / `SUG2` | `SUG-ITRA-LETKUFA` = 1 / 2 | 1, 2 |

Roy confirmed the field and value for `KOD9`. **The official meaning of value 9 remains unresolved; none is inferred or assigned.**

### 1.4 Scope rule

MOR-1, MOR-2 and the three further cases are evidence cases used to discover and validate the model — not the universe of Provident Fund money. Absence of a Money Layer, component or right from them is **not** evidence that it does not exist generally. The final model must represent the union of Money Layers and rights found across all valid evidence cases.

---

## 2. Severance identity — `REKIV1`

### 2.1 Observed evidence

Mor accounts, evidence snapshot 30.04.2026: both cases carry a `REKIV1` (severance) balance. The exact balances are Private Evidence and are not recorded here.

The clearinghouse Severance Balance Report for Income Tax Purposes reports, for Mor, a figure **שווי פיצויים למעסיק** that equals the sum of the two `REKIV1` balances (MOR-1 + MOR-2) **exactly**.

Independent confirmation from MOR-2: its entire balance is `KOD9 / REKIV1 / SUG2`, and that balance equals `YITRAT-PITZUIM-LELO-HITCHASHBENOT` exactly (field name as supplied; the containing interface/report is not identified); its current-year deposits are severance-only.

Source-account evidence for MOR-1: *ALT-SRC-1 is supported as severance-only in the examined 2025 evidence.* This is not generalized to other periods, and earlier Stage 1/2 wording about the same money is not relied on (its substance is unchanged; private values are not part of its canonical content).

### 2.2 Knowledge, confidence, XML Completeness

- **Evidence-supported knowledge:** `REKIV1` identifies the severance (פיצויים) component in the examined cases.
- **Confidence: Evidence Supported — very strong.** Not Verified (no authoritative field dictionary).
- **XML Completeness — two separate questions:**
  - **A. Is the severance component identifiable in XML in the examined cases? Confirmed in XML.** `REKIV1` provides strong XML evidence for the severance component and its balance. This is not downgraded by anything under B; the identification itself remains Evidence Supported, not Verified.
  - **B. Does XML contain the complete severance information required for the future Form 161 / Rights model? Not Yet Identified.** Employer / liability-period detail, where required (`PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §C), has not been established as reconstructable from XML; its absence is not established either.
- **Not claimed:** the meaning of `REKIV` values 2, 3, 4, 8, 9; universality beyond the examined cases.

---

## 3. Pre/post-2008 regime split

### 3.1 Observed evidence

Case MOR-1 contains **both** `KOD9 / REKIV1 / SUG1` and `KOD9 / REKIV1 / SUG2`. The severance component itself therefore carries two `SUG` values in one account.

### 3.2 Working interpretation

**Working interpretation supported by the examined Provident Fund evidence — not an official XML field-dictionary decoding:**

| Code | Working interpretation |
|---|---|
| `SUG1` | Money attributable to deposits **through 31.12.2007**, including gains attributed to that underlying money — the **historical capital regime**. |
| `SUG2` | Money attributable to deposits **from 01.01.2008 onward**, including gains attributed to that underlying money — the **pension regime**. |

### 3.3 External evidence for the 01.01.2008 boundary

**Source:** Israel Aerospace Industries Employees Provident Fund, annual report — <https://www.gemeliai.co.il/wp-content/uploads/2026/03/G376A_425.pdf>. Institutional reporting by a provident-fund manager; **not** a statute, regulator circular or clearinghouse specification.

Retrieved and read (2026-09-21). In the description of the fund's general characteristics (PDF page 48 of 99) it states (Hebrew reconstructed from the PDF's reversed RTL text layer; punctuation placement may differ from the printed page):

- קופת גמל אישית לפיצויים — כספי רכיב הפיצויים שהופקדו בקופה עד 31.12.2007.
- כל הכספים המופקדים מ-1.1.2008 ואילך מיועדים לקצבה.

**Use and limits.** This report supports the existence of the pre/post-2008 regime boundary for severance-component money, which the `SUG1`/`SUG2` interpretation appears to represent. As institutional reporting it does not itself establish the underlying statutory or regulatory position. It is **not** an official decoding of `SUG-ITRA-LETKUFA`, says nothing about XML values, describes one fund's own plans, and does not establish the rights differences (§8). Primary statutory/regulatory text for the boundary is **not yet attached**; that gap must close before any promotion beyond Evidence Supported.

Tracked corroboration (partial; none decodes `SUG`): `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.3 (severance split between lump-sum and annuity portions in provider reports); `PF_OPEN_QUESTIONS.md` Q2 (for ALT-EX-2, `SUG-1` matched the annual report's capital classification and `SUG-2` its pension classification).

### 3.4 Resulting severance Money-Layer regimes

Current evidence justifies distinguishing **at least** two severance Money-Layer regimes. **Working interpretation supported by the examined Provident Fund evidence:**

| Component | Period | Regime | Coordinates in evidence |
|---|---|---|---|
| Severance | through 31.12.2007 | capital regime | `REKIV1 / SUG1` |
| Severance | from 01.01.2008 | pension regime | `REKIV1 / SUG2` |

This is **not** a claim that these are the only severance Money Layers. Additional dimensions may exist (`PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §B3: employer-period cohort and later election status). Other historical boundaries also appear in the record (e.g. `PF_STAGE1_STAGE2_DISCOVERIES.md` §A.6, 1999/2000). Component identity ≠ balance regime; a current right or outcome ≠ historical Money Layer identity.

### 3.5 Confidence, XML Completeness, and the open question

- **Confidence: Evidence Supported** (working interpretation). Not Operationally Supported; not Verified.
- **XML Completeness: Partially Supported.** The pre/post-2008 regime distinction of severance money appears to be represented in XML by the `SUG` value (working interpretation); official field semantics are not recovered.
- Whether a pre/post-2008 distinction exists for severance money is **no longer the question**. What remains open is *what exact rights differences result from it* (§8).

---

## 4. Capital / pension character is not tax status

> **Capital character ≠ tax-free. Pension character ≠ monthly-pension-only.**

Using the working interpretation of §3.2:

- **Severance / `SUG1` / pre-2008** has historical *capital* character. This does **not** imply the whole amount is tax-exempt. At an employment-termination / retirement event tax treatment is still determined: some amount may qualify as an exempt severance grant and some may be taxable.
- **Severance / `SUG2` / post-2008** belongs to the *pension* regime. Pension-regime character does not by itself establish that the money is monthly-pension-only. Whether, when, and under what conditions that severance may be received as a lump-sum grant is part of the unresolved Severance Rights Matrix (§8; `PF_OPEN_QUESTIONS.md` Q4).

**Evidence Supported.** Consistent with `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5, §C.9 (rights depend on money-internal lineage and on event-time facts) and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A2.8, §D4. The exact conditions are **not** established (§8).

---

## 5. Money Reality / Rights / Scenario

A **Money Layer describes what the money is**, e.g. `component = severance`, `historical_period = post-2008`, `balance_regime = pension`. A later Form 161 decision does **not** create or redefine it; it **acts upon** it. The Money Layer preserves its historical identity even if a later choice changes what happens to the money.

| Level | Question | Contains |
|---|---|---|
| **1. Money Reality** | What money exists today, and what are its intrinsic / history-derived properties? | component; historical period; contribution source; capital/pension regime; liquidity facts; preserved transfer history; other evidence-supported identity dimensions |
| **2. Rights** | What may legally / tax-wise be done with that Money Layer, and under which conditions? | depends on Money Layer identity; age; employment termination; retirement event; tax history; previous choices; employer rights; other legal conditions |
| **3. Scenario** | What does Roy choose to do when a future retirement / termination decision becomes available? | the selected choices |

```
XML → Money Reality → Money Layers → Current Rights
    → Available Retirement Choices → Selected Scenario → Tax / Pension Outcome
```

Current Reality ≠ Rights ≠ Scenario. **Money Layer ≠ XML row**: an XML row is an **Evidence Record** that may represent one Money Layer, part of one, or one coordinate needed to identify one (a refinement of, not a contradiction to, `MONEY_LAYER_DEFINITION.md` §3). The existing working definition stands: a combination of characteristics of the money that produces a uniform set of rights and obligations; different Money Layers may converge to the same right or outcome, and one reporting category may contain more than one Money Layer.

**Evidence Supported** as a domain distinction (an architectural principle established by Roy, consistent with `MONEY_LAYER_DEFINITION.md` §5, `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §D2, `GOOSE_PENSION_FOUNDATION.md` §5).

---

## 6. Form 161 choices

### 6.1 Form 161 is a decision point

Roy is **before** retirement. Form 161 is therefore **not** current XML evidence of a choice already made; it and its related rules describe **future rights and choices** exercisable at an employment-termination / retirement event. In Goose it belongs to the future decision / rights layer, not to the definition of the Money Layer.

### 6.2 Principal severance alternatives

**Evidence Supported** that these are three distinct mechanisms (Tax Authority material recorded in `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5 and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A2.4, §D2). **Detailed conditions are unresolved (§8).**

1. **Lump-sum severance grant / withdrawal — משיכת מענק / פיצויים.** The severance money is received as capital; tax treatment is determined at the event, some may be exempt and some taxable. "Available as capital" is **not** synonymous with "tax-free."
2. **Annuity sequence — רצף קצבה.** Not withdrawn as a grant at that point; it remains in the pension system, designated toward future pension use. רצף קצבה is **not** קצבה: it is a decision about severance money at the event; קצבה is the periodic pension payment. Regulated mechanisms exist to withdraw from / cancel a previous annuity-sequence decision (`PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5 records a reversal path via Form 161ג); the detailed rules are **not** stated here.
3. **Severance sequence — רצף פיצויים.** Not withdrawn now; the severance tax event is deferred and connected to a future termination event, subject to statutory conditions. Conceptually different from annuity sequence.

> **Annuity sequence ≠ pension. Severance sequence ≠ annuity sequence.**

### 6.3 Pension capitalization is a different mechanism

```
Path 1:  Severance     → severance grant / capital withdrawal
Path 2:  Pension money → pension capitalization (היוון קצבה) → lump sum instead of part of future pension
```

Both may produce a lump sum but are not the same right: capitalization consumes/replaces pension value and may affect future pension. They must not be modeled as one generic "capital withdrawal." **Severance withdrawal ≠ pension capitalization.** Capitalization may interact with the overall retirement simulation but is **not** a Form 161 severance choice unless the legal model specifically supports it. **Evidence Supported** (`PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.9, §E; `GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md`; `PF_STAGE1_STAGE2_DISCOVERIES.md` §B.7).

### 6.4 Future retirement scenario — Form 161 as a candidate choice model

When the future-retirement simulation for Provident Funds is redesigned, Form 161 and its related tax rules should be evaluated as a **candidate domain basis** for the user's severance choices (lump-sum grant / withdrawal; annuity sequence; severance sequence; leaving severance money in the pension system; the exempt/taxable treatment of the grant):

```
Money Reality → Money Layers → Rights Engine → Form-161-related Retirement Choices
    → Retirement Scenario → Simulation Engine → Capital / Pension / Tax / Fixation-of-Rights Outcome
```

Form 161 does not define what money exists. **Do not assume the current simulation fields already represent the correct Form 161 / severance choice model** — they may predate the Money Layer / Rights understanding; the actual decision structure must be studied and compared before anything is built, without forcing legal reality into the existing UI or data structure. Reality determines what money exists; Rights determine which choices are legally available; scenario inputs capture the user's decisions; the simulation calculates the consequences. Future design requirement only (`PF_OPEN_QUESTIONS.md` Q5).

---

## 7. Fixation-of-Rights consequence

### 7.1 The relationship, and its primary source

A tax-exempt severance withdrawal is **not costless**: exempt grants enter the Fixation of Rights (קיבוע זכויות) calculation and may reduce the exemption available for future qualifying pension.

**Primary source: Israel Tax Authority, Form 161ד** — בקשה לקיבוע זכויות בגיל פרישה או בפרישה עקב נכות (request for fixation of rights under section 9א of the Income Tax Ordinance). Retrieved for this document (2026-09-21) from an Internet Archive snapshot dated 2025-03-02 of the Tax Authority's own PDF, because direct access to gov.il is blocked (HTTP 403):

- Original: <https://www.gov.il/BlobFolder/service/itc-request-for-fixed-rights-at-retirement-age/he/Service_Pages_Purchase_and_Excise_tax_161d.pdf>
- Archive copy: <https://web.archive.org/web/20250302135038if_/https://www.gov.il/BlobFolder/service/itc-request-for-fixed-rights-at-retirement-age/he/Service_Pages_Purchase_and_Excise_tax_161d.pdf>
- Service page (snapshot 2025-03-02): <https://www.gov.il/he/service/itc-request-for-fixed-rights-at-retirement-age>, "last updated 26.02.2024."

What the form itself says (section ב, "קיבוע זכויות"; Hebrew reconstructed from the PDF's reversed RTL text layer, punctuation may differ from the printed page):

- **Item 2:** "בעבר קיבלתי מענקים פטורים כמפורט בסך … ש״ח, ולפיכך הפגיעה בהון הפטור לאחר הכפלה במקדם הינה …" — previously received *exempt grants* directly produce a *reduction ("הפגיעה") in the exempt capital*, after multiplication by a coefficient.
- **Item 5:** "לאחר פרישתי ממקום העבודה הנ״ל, בכוונתי למשוך מענק פטור בגין השנים שקדמו לגיל הזכאות: לא / כן" with an estimated withdrawal amount — an *intended* exempt grant is a declared input.
- **Item 7 and its footnote (8):** the exempt capital that may be designated for future exempt capitalization is taken "לאחר הפחתה של הסכום המתקבל בסעיף 2" (after reducing the amount computed in item 2).
- **Declaration:** "אני מצהיר כי סכום המענקים הפטורים, כאמור בסעיף 2-ב כולל את כל המענקים הפטורים שקיבלתי."

### 7.2 Classification, and pending citations

- **Confidence: Evidence Supported**, based on a primary Tax Authority form — not on Roy as the source. The mechanism (exempt grants, past or intended, enter the fixation and reduce the exempt capital) is directly evidenced.
- **Not Verified.** Pending primary citations: (a) the statutory text of section 9א; (b) the current (2026) Tax Authority Form 161ד guidance, which could not be retrieved in this session — the archived copy above predates it and may differ; (c) the form itself calls them "exempt grants" (מענקים פטורים) and the recovered text does not itemize exempt *severance* grants from provident funds, so their exact treatment, the coefficient, and which grants count remain **unresolved** (§8, question 5).
- **XML Completeness: Not Yet Identified** — event-time tax history is not expected in current XML.

### 7.3 Requirement (documented only, not implemented)

Roy Reality must eventually distinguish and simulate at least: amount withdrawn; exempt amount; taxable amount; immediate tax; remaining pension capital; effect on future pension; effect on Fixation of Rights / the retirement exemption basket.

---

## 8. Severance Rights Matrix — open research

**None of the following is answered here.** The pre/post-2008 distinction is supported; the exact **Rights Matrix** it produces is not.

1. Is every pre-2008 severance `SUG1` amount (working interpretation) in Roy's current funds presently eligible for capital withdrawal?
2. What exact conditions allow post-2008 severance `SUG2` to be received as a lump-sum grant? (Unevaluated lead: the IAI report, PDF page 39 of 99, lists under "שינוי חקיקה" the item "הגבלת משיכת הכספים שהופקדו בשנת 2008 ואילך למסלול קצבתי" — recorded, not interpreted.)
3. How is the exempt portion determined in each case?
4. What happens to the taxable portion?
5. How do the alternatives affect future qualifying-pension exemption and Fixation of Rights?
6. What exact rights / conditions distinguish lump-sum severance withdrawal, annuity sequence (רצף קצבה), and severance sequence (רצף פיצויים)?
7. What employer rights or possible employer claims apply to each severance layer / state? (Pointer: employer withdrawal rights depend on labor-law conditions — `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5.)
8. Which rights belong intrinsically to the Money Layer, and which depend on a future retirement / termination event or user choice?

Tracked as `PF_OPEN_QUESTIONS.md` Q4. **Confidence: not classified — open research.** No cell is asserted.

---

## 9. `KOD9` — unresolved

`KOD9` = `KOD-TECHULAT-SHICHVA` = 9 (field and value confirmed by Roy, §1.3). **Do not decode it.**

**Observed:** `KOD9` appears in severance evidence, always with `REKIV1`; in MOR-1 the **same** `KOD9 / REKIV1` spans **both** `SUG1` and `SUG2`; in active MOR-2, `KOD9 / REKIV1 / SUG2` is current post-2008 severance. Therefore `KOD9` is **not** simply the pre/post-2008 distinction.

**Status:** `KOD9` is an observed layer-applicability code strongly associated in our evidence with severance; its official semantics are **not** decoded. Do **not** write `KOD9 = severance`: `REKIV1` already appears to encode the component, and it is unknown what independent dimension `KOD9` represents.

- **Confidence: Observed.** **Official semantics: Not Yet Identified.**
- **XML Completeness: not recorded.** `KOD9` is an observed code, not a reality whose representation in XML is in question; its physical presence in XML is an observation, not an XML Completeness finding.
- **Interaction with Q3.** Q3 records `KOD 3/5/7` period mappings for one account (ALT-EX-2). `KOD9` spanning the 2008 boundary shows `KOD-TECHULAT-SHICHVA` is not a pure date-period code in general; those mappings must not be extended to `KOD9`.

---

## 10. Distinctions to preserve

- Money Layer ≠ XML row (an XML row is an Evidence Record)
- Money Layer ≠ retirement choice ≠ current realization method
- Capital ≠ tax-free; Pension ≠ monthly-pension-only
- Annuity sequence ≠ pension; Severance sequence ≠ annuity sequence
- Severance withdrawal ≠ pension capitalization
- Current Reality ≠ Rights ≠ Scenario
- Component identity ≠ balance regime
- A current right / outcome ≠ historical Money Layer identity

---

## 11. Existing documentation: conflicts and qualifications

Nothing in existing documents was rewritten.

| # | Existing statement | Relationship to new material | Handling |
|---|---|---|---|
| 1 | `PF_ROY_REALITY_DEFINITION.md` §6.1: SUG↔Retirement View is an observed correlation only; `SUG-1` = Capital is not asserted as a rule. | Not contradicted. A *working interpretation* now exists; it is neither a canonical rule nor an official decoding. | Pointer note added under §6.1; canonical statement unchanged. |
| 2 | `PF_OPEN_QUESTIONS.md` Q2: why a balance is `SUG-1` vs `SUG-2` is unexplained. | Narrowed, not closed. | Update appended to Q2. |
| 3 | `PF_OPEN_QUESTIONS.md` Q3: `KOD` 3/5/7 period mappings (one account); 9 unexplained. | Qualified: `KOD-TECHULAT-SHICHVA` is not a pure date-period code. | Update appended to Q3. |
| 4 | `docs/provident_funds_logic.md`, "Pre-2008 Legacy Funds — Critical Routing Rule". | **Conflict — see §11.1.** | **Not modified.** Required future implementation correction. |
| 5 | `MONEY_LAYER_DEFINITION.md` §3: `PerutYitraLeTkufa` = best-evidenced representation of a Money Layer. | Refined: an XML row is an Evidence Record (§5). | Recorded here; owning document not edited. |
| 6 | `GOOSE_PENSION_FOUNDATION.md` Rights Layer / Domain / Realization vs Money Reality / Rights / Scenario. | Vocabulary overlap; correspondence (e.g. whether "Rights" = "Domain") not settled. | Recorded; decision left to Roy. |
| 7 | Existing docs list `REKIV` values 1,2,3,4,8,9 as unexplained. | Partially answered: `REKIV1` = severance (Evidence Supported); the rest remain unexplained. | Registry PF-KR-005. |

### 11.1 Known implementation conflict — future correction required

**Pre-2008 capital character must NOT automatically imply `capital_exempt`.**

`docs/provident_funds_logic.md` routes the entire balance of a fund whose first join date is before 01.01.2008 to `capital_exempt` (described as exempt capital, הון פטור). That equates historical capital character with tax exemption and keys the rule on the account's first join date rather than on the money's own layers. It conflicts with §4 (capital ≠ tax-free; `SUG1`/pre-2008 severance may be partly exempt and partly taxable at the event) and §5 (identity of the money is separate from what later happens to it). `GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` Findings 1–4 independently record that `capital_exempt` is not supported as a real money bucket.

**This task does not modify implementation-facing logic.** The conflict stays visible as a future implementation correction, to be made with the Rights Engine / Form 161 choice-model work (`PF_OPEN_QUESTIONS.md` Q5). Until then that file must not be read as evidence that pre-2008 capital money is tax-exempt.

---

## 12. Resulting confidence classification

| Item | Confidence | XML Completeness | Note |
|---|---|---|---|
| `REKIV1` = severance | **Evidence Supported** (very strong) | A (component and balance, examined cases): Confirmed in XML · B (complete Form 161 / Rights information): Not Yet Identified | Not Verified — no authoritative field dictionary. |
| Severance has a real pre/post-2008 boundary | **Evidence Supported** | — | External institutional report attached (§3.3); statutory/regulatory text pending. |
| `SUG1` / `SUG2` = pre/post-2008 capital / pension regime | **Evidence Supported** (working interpretation) | Partially Supported | Not an official XML-dictionary decoding. |
| Capital ≠ tax-free; pension ≠ monthly-only | **Evidence Supported** | — | Exact conditions unresolved. |
| Money Reality / Rights / Scenario; Money Layer ≠ choice | **Evidence Supported** | — | Architectural principle; vocabulary reconciliation open. |
| Form 161 severance alternatives are distinct mechanisms | **Evidence Supported** | Not Yet Identified | Detailed conditions unresolved. |
| Exempt grants affect Fixation of Rights | **Evidence Supported** (primary Tax Authority form, §7.1) | Not Yet Identified | Not Verified: statute and 2026 guidance pending; exact mechanism unresolved. |
| `KOD9` (`KOD-TECHULAT-SHICHVA` = 9) | **Observed**; official semantics Not Yet Identified | Not recorded | Not decoded. |
| Detailed severance Rights Matrix | **Not classified — open research** | — | No cell asserted. |

---

## 13. Addendum 2026-09-22 — Q4 end-of-session checkpoint

**Status:** Discovery record. Documentation only. This addendum is additive: §1–§12 above are unchanged and their confidence classifications stand. **Q4 is not closed; no Rights Matrix cell is asserted; no Rights Engine, simulation change or UI is defined.**

### 13.0 Privacy and confidence discipline for this addendum

Private Evidence (clearinghouse XML and related reports) was used. Per `docs/foundation/EVIDENCE_HANDLING.md` §5.1, this addendum records the **reusable structural finding**, not the evidence itself: no account or policy numbers, no personal names or identifiers, no exact balances, no employer or employment facts or dates, no XML filenames. Where a reproducible reference is needed, only the existing masked case identifiers (MOR-1, MOR-2) are used. Exact evidence is retained in Private Evidence storage outside this repository.

Private values are not part of the canonical content of this document; §1.2 and §2.1 record only structural findings (for example, that the figures reconcile exactly). Earlier repository revisions may contain superseded private evidence and are subject to the repository privacy-remediation process (`EVIDENCE_HANDLING.md` §5.1; `GIT_PRIVACY_REMEDIATION_INCIDENT.md`).

Confidence labels are those of §0. Where a statement is an **open research hypothesis** it is labeled as such. Nothing in this addendum is **Verified**.

### 13.1 Refined domain model — Money, State, Event, Rights, Choice

§5's Money Reality → Rights → Scenario path remains directionally correct. The severance domain shows that an explicit intermediate state/event structure is needed between Money and Rights:

```
Money Layer
→ Statutory Regime
→ Current Tax / Disposition State
→ Employment / Termination / Retirement Event Context
→ Current Rights
→ Available Choice
→ Immediate Tax / Pension Consequence
→ New Rights / Tax / Disposition State
→ Future Pension / Fixation-of-Rights Consequence
```

Distinctions preserved:

1. A Money Layer is **not** a Right.
2. A Money Layer is **not** a user Choice.
3. A legal / tax / disposition **State** is not necessarily intrinsic Money-Layer identity.
4. Rights may depend on: Money Layer identity; statutory regime; current disposition / tax state; employment / event context; previous choices; employer / legal conditions.
5. A Choice can create a new future Rights / Disposition State — **a choice today can create a rights state tomorrow.** Annuity sequence and severance sequence are not kinds of money; they are choices at a termination / retirement event that can create a legally / tax-relevant state governing later treatment.

**Classification: Evidence Supported as a domain refinement** (consistent with §5, §6 and PF-KR-008). **The state machine as written, and every transition in it, is a working structure — not promoted.** Which properties belong to Money Layer, State, Event or Rights, and the legal transition rules, remain Q4 research.

### 13.2 Terminology distinctions

The following are already recorded in §6.2, §6.3 and §10 and are restated here only to fix vocabulary for the rest of this addendum:

| Term | Meaning in this model |
|---|---|
| Severance (פיצויים) | Type / origin / component of money associated with employment and severance. Not a right, not a choice. |
| Pension / annuity (קצבה) | Pension-purpose / periodic-payment concept. |
| Annuity sequence (רצף קצבה) | A tax / legal **choice** concerning severance at a termination event. **Not** the pension payment itself. |
| Severance sequence (רצף פיצויים) | A **different** tax / legal choice concerning severance, deferring the severance tax event under statutory conditions. |
| Pension capitalization (היוון קצבה) | A different mechanism from severance withdrawal. |

Capital character ≠ tax-free. Pension character ≠ monthly-pension-only. Annuity sequence ≠ pension. Severance sequence ≠ annuity sequence. Severance withdrawal ≠ pension capitalization. **None of these distinctions is converted into an eligibility rule.**

### 13.3 Pre/post-2008 severance — refinement, not change

The existing conclusion (§3) is unchanged: a meaningful severance regime boundary exists between deposits through 31.12.2007 and from 01.01.2008; the `SUG1` (historical capital regime) / `SUG2` (pension regime) reading is a working interpretation at **Evidence Supported**, with the limits recorded in §3.3 and §3.5.

The session strengthened one point: post-2008 pension-regime severance is **not** conceptually identical to "pension-only money"; what may be done with it is determined through the Rights / Event model (§13.1), not by regime label. **Not inferred:** `SUG1` → automatically tax-free; `SUG1` → withdrawable in every current situation; `SUG2` → monthly pension only; `SUG2` → never available as a severance grant. Detailed eligibility remains Q4.

#### 13.3.1 `KOD9` (status unchanged)

Unchanged and unresolved (§9). Not inferred.

### 13.4 Form 161 as an event-reconciliation / decision document

§6.1 records Form 161 as a future decision point. The refinement: Form 161 is not merely a tax form or a UI candidate. A termination / retirement event can create new financial reality.

- **Before the event**, Goose may know Institutional Reality + Employment Reality.
- **At the event**, employer / fund / event information can create an **Event Reality**, containing facts such as: the relevant employment period; severance entitlement / liability; employer-direct payment or completion; institutional severance balances; total retirement-grant / severance amounts; relevant tax / disposition facts.
- The event then connects: Current Reality → Event Reality → Rights → Choice → Consequence → New State.

Form 161 can therefore be understood as an **Event Reconciliation / Decision document** connecting employer reality, institutional money, event-created severance rights, employee choices and tax treatment.

**Classification:** domain-modeling conclusion. Evidence Supported only to the extent of the Tax Authority form material already recorded in §6.2 and §7.1; the wider framing is a working model. **It is not an instruction to implement Form 161.** Q5 remains the separate future question of how the actual Form-161 decision structure should compare with, and eventually inform, the existing retirement simulation.

### 13.5 Institutional vs non-institutional severance reality

**Clearinghouse severance ≠ necessarily total severance reality.** Roy Reality must conceptually distinguish:

- **A. Institutional Severance Reality** — severance money actually held in institutional products and represented through clearinghouse / provider evidence.
- **B. Employer / Non-Institutional Severance Reality** — employment-based severance liability, grant, completion or entitlement that may exist outside the institutional balances.

```
Institutional Severance Reality + Employer / Non-Institutional Severance Reality
    → Total Severance Reality at the relevant event
```

This is a scope distinction, not a defect finding: the clearinghouse may provide rich **Current Institutional Reality**, while complete Retirement / Event Reality can require additional Employment / Event Reality. The reusable knowledge is only that real employment situations can create severance rights or liabilities for periods or amounts not represented by current institutional severance balances. The private employment example that surfaced this is deliberately not recorded.

**Classification: working domain-modeling conclusion** — not placed on the Observed / Evidence Supported scale, because the motivating case is Private Evidence and is not recorded here. **Future requirement (documented only, not implemented):** Roy Reality will need a way to receive non-institutional severance reality — initially potentially through explicit / manual event input, later possibly through employer / Form-161-derived data. Tracked as Q4 boundary item 10.

### 13.6 `YitrotShonot` — a separate XML family (Observed)

The examined KGM Holdings XML — in every examined product, including provident-fund-type (`SUG-MUTZAR` = 3) and Study-Fund-type (`SUG-MUTZAR` = 4) products — contains structurally separate areas that correspond operationally to:

| XML area | Operational reading |
|---|---|
| `PerutYitraLeTkufa` | Money-Layer evidence |
| `NesilutTag` | Liquidity-related evidence |
| `YitrotShonot` | A separate family of severance-related balances / status fields |

**Structural placement (checked on 2026-09-22 against the original private KGM exports):** the three areas are sibling children of the same `Yitrot` block under `BlockItrot`, and were found in every product of the examined, parseable KGM Holdings files. **Reconciliation with earlier documentation:** `Mislaka_Rules.md` §12a (an extraction rule that targets `BlockItrot` and `NesilutTag` for Study Fund products) and the scope note of `PF_HESHBON_OPOLISA_STRUCTURE_DISCOVERY.md` referred to those blocks in a Study Fund context. Both now carry a note that `NesilutTag` is not Study-Fund-specific: it was directly observed in the examined KGM Holdings evidence in both Provident Fund and Study Fund product types. Their Study-Fund-specific content (which blocks the Study Fund extraction reads) is unchanged. This does **not** establish coverage of every product type or provider; one further product type was observed and is not classified here. `SUG-MUTZAR` = 3 and 4 are the product-type values already used in this repository's documentation (`docs/TaxLogic.md` §3.1–§3.2, `docs/provident_funds_logic.md`); other observed values are not classified here.

The observed `YitrotShonot` family contains fields concerning: previous-employer severance; current-employer severance redemption values; exempt / tax-related severance values; capital / pension-related severance values; annuity-sequence balances; severance / rights-sequence balances; severance without settlement; sequence existence / status flags; and an explicit historical 31.12.1999 boundary.

**Authoritative semantics beyond what the field names and evidence support are not assigned.** Confidence: **Observed** (structure and presence in the examined evidence). Field meanings: not classified.

### 13.7 Observed reconciliation (sanitized)

In **both** examined Provident Fund cases containing severance (MOR-1, MOR-2), the account-level field `YITRAT-PITZUIM-LELO-HITCHASHBENOT` reconciled **exactly** to the total `REKIV1` (severance) Money-Layer balance of that account. In MOR-1 that balance consists of **two** `REKIV1` Money Layers belonging to different `SUG` regimes, and their aggregate reconciled exactly to the single account-level amount. (This extends the single-case observation in §2.1 to both cases. Values and account mapping are not recorded here.)

**Reading — distinct dimensions.** Money Layer answers: *what kind / origin / historical regime of money is this?* `YitrotShonot` carries separate account-level severance information. The reconciliation is strong structural evidence that the two are **distinct information dimensions in the examined evidence**. Whether the `YitrotShonot` information constitutes a tax / disposition / rights state — i.e. answers *what current tax / disposition / severance state applies at account level?* — **remains under investigation**; that it *may* is an open hypothesis (§13.8, §13.10) and is not weakened here, but it is not established by the reconciliation.

**Limits.** This does not establish the authoritative legal meaning of the field. An amount equality in two cases is a structural observation, not a definition; whether the equality holds in cases with other sequence or settlement states is untested. **Confidence: Observed** (the reconciliation, two cases); **Evidence Supported** (Money Layer and `YitrotShonot` information are distinct dimensions, examined cases). Not established: that `YitrotShonot` is a tax / disposition / rights state. Registered as PF-KR-012.

### 13.8 "Without settlement" (`LELO-HITCHASHBENOT`) — confidence boundary

**Hypothesis — supporting material reviewed but not yet canonically cited:** "התחשבנות" in this severance context is hypothesized to refer to the settlement / accounting performed around termination and tax treatment, including the Form 161 process. Tax Authority and Capital Market material reviewed in research is reported to support the broader domain concept that: termination may itself create a tax event even without physical withdrawal; sequence choices can defer or alter treatment; and severance balances are required for employer settlement and Form 161. *That material is not yet cited canonically in this repository, so nothing in this section is classified Evidence Supported; primary citations must be attached before any promotion beyond hypothesis.*

On that basis `YITRAT-PITZUIM-LELO-HITCHASHBENOT` is **plausibly** a tax / disposition-state field concerning severance for which the relevant settlement has not yet been completed.

**THIS EXACT XML FIELD SEMANTIC IS NOT VERIFIED.** It is not to be stated as canonical fact that the field means: no tax event occurred; the money is withdrawable; the money is tax-free; the employee has an unconditional current right; or "unsettled severance" in an authoritative legal sense — until an authoritative XML / interface dictionary is recovered (Q3).

### 13.9 `KAYAM` enums — unresolved

Fields `KAYAM-RETZEF-PITZUIM-KITZBA` and `KAYAM-RETZEF-ZECHUYOT-PITZUIM` were observed with numeric values that include 2 and 3. Human-readable clearinghouse-derived displays appear to use the states "קיים", "לא קיים" and "לא ידוע". **No correspondence between the numeric values and the display states is implied by the order in which they are listed here, and none is recovered.** 2 and 3 are **not mapped**. Examined no-severance control cases contain populated `KAYAM` flags while their severance balances are zero — so mere presence or population of a `KAYAM` flag does **not** prove an active sequence. (The `TIKUN-190` decoding recorded in `PF_OPEN_QUESTIONS.md` Q3 belongs to a different field and must not be extended to these.) Enum semantics remain an Open Question (Q4 boundary item 2).

### 13.10 Current-state vs full-history — open research hypothesis

Goose may not need to reconstruct the provider's complete historical severance ledger if the clearinghouse XML exposes a sufficiently rich **current** legally / tax-relevant state. Possible architecture:

```
XML → Money Layers + Current Tax / Disposition / Rights State → Rights Engine
```

as opposed to `XML → reconstruct every historical event → recreate provider ledger → derive current state`.

**This is not established.** The next research question is not merely "does Holdings contain the full history?" but **"does Holdings contain enough Current State for Roy Reality to determine current institutional severance rights correctly?"** Classification: open research hypothesis. Q4 boundary item 3.

### 13.11 Eligibility — partial findings, not a matrix

Indicated (not classified): Total Severance is not necessarily homogeneous with respect to available choices. The Form-161 structure and related material suggest conceptually distinct allocations among: an amount designated to annuity sequence; an amount designated to severance sequence; a grant amount; an exempt grant; a taxable grant. Annuity-sequence eligibility appears structurally tied to qualifying pension / provident-fund money rather than to arbitrary severance everywhere. Severance sequence has separate statutory conditions and limits and can involve employer / event facts.

**Not done:** no final `SUG1` / `SUG2` → choice eligibility matrix; no assertion that pre/post-2008 alone determines the available choice. Q4 boundary item 4.

### 13.12 Employer rights

Employer rights or claims over severance cannot be modeled as a simple property of `SUG1` or `SUG2`. They depend on legal / employment circumstances — potentially termination circumstances, statutory entitlement, employment agreements, applicable severance-law rules, and court / approval routes where relevant. **Employer Right belongs in the Event / Rights model, not in Money-Layer regime identity.** Detailed rules: Q4 boundary item 9.

### 13.13 Fixation of Rights — unchanged

§7 stands unchanged: a tax-exempt retirement / severance grant may affect future Fixation of Rights and the exempt capital available for qualifying pension / capitalization; the Tax Authority material indicates a reduction of exempt capital and a statutory / form mechanism that may involve a coefficient. **The mechanism is not upgraded.** Open: how the exempt severance amount is calculated; which grants count; treatment of the taxable remainder; the exact current Section 9A mechanism; the exact current coefficient, rules and exclusions; interaction with future qualifying-pension exemption. Roy Reality must eventually explain both the **immediate** and the **future** consequence. No simulation change is made.

### 13.14 User-facing simplicity vs engine complexity

The legal / tax engine may need multiple states and transitions; the user-facing model need not expose that. A simple explanation may still offer choices such as *withdraw severance*, *leave toward pension / annuity sequence*, *severance sequence / defer treatment*, while the engine holds the precise state, eligibility, tax and future-rights consequences. Product / domain insight only — no UI is designed here (Constitution, Core Principle 8).

### 13.15 Report / PDF representation

Different consumer or adviser reports present different views over structured clearinghouse reality: structured clearinghouse data → interpretation / internal model → report / PDF / view. A generated adviser PDF is **not** automatically canonical financial reality; it is useful as evidence or cross-check. It is not claimed that every adviser consumes the same XML transport file. This reinforces *Reality before Representation* (`PF_KNOWLEDGE_REGISTRY.md`, Guiding Principles; PF-KR-003).

### 13.16 Future requirements (documented only — nothing built)

- **Non-institutional severance input** — see §13.5.
- **Canonical Glossary.** For important terms, eventually provide: canonical term; canonical definition; authoritative source / evidence; confidence; Roy Reality meaning; related concepts; user-facing plain-language explanation. Candidate terms: פיצויים · קצבה · רצף קצבה · רצף פיצויים · מענק פרישה · התחשבנות · פיצויים ללא התחשבנות · היוון קצבה · קיבוע זכויות · הון · tax-exempt grant / taxable grant. No glossary document is created here and no owning location is decided; that is a documentation-ownership decision for the Chief Architect / Product Owner.

### 13.17 Confidence classification — addendum items

| Item | Confidence | Note |
|---|---|---|
| Intermediate State / Event structure between Money and Rights (§13.1) | **Evidence Supported** (domain refinement) | State machine and transitions not promoted. |
| Form 161 as event reconciliation / decision document (§13.4) | Domain-modeling conclusion | Not an implementation instruction; Q5 separate. |
| Institutional vs non-institutional severance reality (§13.5) | **Working domain-modeling conclusion** | Motivating case is private and not recorded; future input requirement only. |
| `YitrotShonot` is a separate XML family (§13.6) | **Observed** | Field semantics not classified. |
| Account-level "without settlement" amount = total `REKIV1` balance (§13.7) | **Observed** (two cases) | Not a legal definition; other states untested. |
| Money Layer and `YitrotShonot` information are distinct dimensions (§13.7) | **Evidence Supported** (examined cases) | That `YitrotShonot` is a tax / disposition / rights state is not established — under investigation; legal meaning not established. |
| `LELO-HITCHASHBENOT` = tax / disposition state, settlement not completed (§13.8) | **Hypothesis** — not Verified | Supporting material reviewed but not yet canonically cited. |
| `KAYAM` numeric enums (§13.9) | **Unresolved** | Not mapped. |
| Current State sufficient without full ledger (§13.10) | **Open research hypothesis** | Not established. |
| Eligibility matrix; employer rights; exempt-amount calculation (§13.11–13.13) | **Not classified — open research** | Q4. |
| `KOD9` | **Observed**; semantics unresolved | Unchanged (§9). |

Not reopened by this addendum: `REKIV1` = severance; the pre/post-2008 distinction; the `SUG1` / `SUG2` working interpretation and its confidence boundary; capital ≠ tax-free; pension ≠ monthly-pension-only; Form-161 severance alternatives as distinct mechanisms; the Money Reality / Rights / Scenario separation.

---

## Cross-references

Addendum §13 cross-references: `PF_KNOWLEDGE_REGISTRY.md` (PF-KR-012; PF-KR-008 refinement) · `PF_OPEN_QUESTIONS.md` (Q3 and Q4 updates; Q5 status unchanged) · `docs/foundation/EVIDENCE_HANDLING.md` §5.1.

Tracked documents: `PF_KNOWLEDGE_REGISTRY.md` (PF-KR-005 to 011) · `PF_OPEN_QUESTIONS.md` (Q2–Q5) · `PF_ROY_REALITY_DEFINITION.md` §6.1 · `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` · `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` · `PF_STAGE1_STAGE2_DISCOVERIES.md` · `docs/knowledge/financial_assets/MONEY_LAYER_DEFINITION.md` · `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` · `docs/foundation/GOOSE_PENSION_FOUNDATION.md` · `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` · `docs/foundation/EVIDENCE_HANDLING.md` · `docs/foundation/GIT_PRIVACY_REMEDIATION_INCIDENT.md` · `docs/provident_funds_logic.md` (§11.1).

External sources: Israel Aerospace Industries Employees Provident Fund report (§3.3) · Israel Tax Authority Form 161ד, archived copy (§7.1).
