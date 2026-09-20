# Provident Fund Knowledge Registry

*Version 0.2 — PF-KR-005 to PF-KR-011 added 2026-09-21 (severance component, regime split, Rights/Scenario separation). PF-KR-001 to PF-KR-004 unchanged.*

---

## Purpose

This document is the canonical knowledge registry for the Provident Fund domain inside Roy Reality.

It documents only stable knowledge. It records:

- what Goose currently knows
- how Goose knows it
- how confident Goose is
- what is still unknown

This document is **not** implementation documentation, research notes, or design discussion.

This is a pre-1.0 version. It is expected to evolve. Nothing in this document should be treated as immutable.

---

## Guiding Principles

### Reality before Representation

Roy Reality models the financial reality of the money.

XML, annual reports, tax certificates and provider portals are different representations of that same reality.

No representation is assumed to be complete.

### XML First

Generic Clearinghouse XML is the preferred operational source.

Provider documents are primarily used to:

- understand XML semantics
- validate XML interpretation
- complement information that cannot yet be reconstructed from XML

The long-term objective is to reconstruct as much financial reality as possible from generic Clearinghouse XML.

### Evidence before Knowledge

Research is not Knowledge.

Hypotheses are not Knowledge.

Only evidence-backed understanding is promoted into this registry.

---

## Confidence Levels

| Level | Meaning |
|---|---|
| **Observed** | Seen in evidence, but not yet corroborated or generalized. |
| **Evidence Supported** | Supported by evidence that has been reviewed. |
| **Operationally Supported** | Supported by evidence and relied upon in operation. |
| **Verified** | Confirmed against authoritative evidence. |

---

## XML Completeness

XML Completeness should be recorded whenever sufficient evidence exists. Until then, the field may remain "Not yet recorded". When recorded, it is one of:

| Status | Meaning |
|---|---|
| **Confirmed in XML** | The knowledge is present in generic Clearinghouse XML. |
| **Partially Supported** | The XML carries part of the knowledge, but not all of it. |
| **Not Yet Identified** | The knowledge has not yet been located in XML; absence is not established. |
| **Confirmed Missing** | The knowledge has been checked and is confirmed to be absent from XML. |

---

## Discovery Template

```
PF-KR-XXX

Title

What we know

Evidence

Scope

Confidence

XML Completeness

Unknowns

Roy Reality Usage
```

---

## Knowledge Entries

### PF-KR-001

**Title:** Money Layers describe the money itself

**What we know:**
Money Layers describe the money itself. They do not describe providers, products or software structures.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Evidence Supported

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-002

**Title:** Transfers (Nyud) are historical events

**What we know:**
Transfers (Nyud) are historical events. Transfers do not create new Money Layers.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Evidence Supported

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-003

**Title:** Provider documents may represent the same reality differently

**What we know:**
Different provider documents may represent the same financial reality in different ways. Provider-specific representations must never be generalized without additional evidence.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Observed

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-004

**Title:** Contribution activity is independent of account existence

**What we know:**
Contribution activity is independent of account existence. An account may continue existing and accumulating returns while receiving no new contributions.

**Evidence:** Based on accumulated Roy Reality research across XML investigations, provider documents and discussion.

**Scope:** *Not yet recorded in this version.*

**Confidence:** Evidence Supported

**XML Completeness:** *Not yet recorded in this version.*

**Unknowns:** *Not yet recorded in this version.*

**Roy Reality Usage:** *Not yet recorded in this version.*

---

### PF-KR-005

**Title:** `REKIV1` identifies the severance component

**What we know:**
`REKIV-ITRA-LETKUFA` = 1 identifies severance (פיצויים) in the examined cases. The other observed `REKIV` values (2, 3, 4, 8, 9) remain unexplained.

**Evidence:** Exact reconciliation, to the agora, of the Mor `REKIV1` amounts (cases MOR-1 and MOR-2, 30.04.2026) against the clearinghouse Severance Balance Report for Income Tax Purposes (שווי פיצויים למעסיק); independent confirmation from the fully-severance case MOR-2. Case identifiers are masked; the mapping to real accounts is held in Private Evidence. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §2.

**Scope:** Examined evidence cases only; not established as universal across providers and product types.

**Confidence:** Evidence Supported (very strong). Not Verified — no authoritative XML field dictionary has been recovered.

**XML Completeness:** Two separate questions. (A) Is the severance component identifiable in XML in the examined cases? Confirmed in XML — `REKIV1` provides strong XML evidence for the severance component and its balance (the identification itself is Evidence Supported, not Verified). (B) Does XML contain the complete severance information required for the future Form 161 / Rights model, including employer / liability-period detail where required? Not Yet Identified — not established as reconstructable from XML; absence is not established. B does not downgrade A.

**Unknowns:** Official semantics of `REKIV` values; whether the complete Form-161-required severance information (including employer / liability-period detail) is reconstructable from XML.

**Roy Reality Usage:** Evidence for the component dimension of a severance Money Layer. Not to be treated as an official decoding.

---

### PF-KR-006

**Title:** Severance splits at 01.01.2008; `SUG1` / `SUG2` are read as the pre/post-2008 regime

**What we know:**
A pre/post-2008 regime boundary for severance money (01.01.2008) is supported by the evidence. Case MOR-1 carries both `REKIV1 / SUG1` and `REKIV1 / SUG2`, so the severance component itself preserves the distinction.

*Working interpretation supported by the examined Provident Fund evidence — not an official XML field-dictionary decoding:* `SUG-ITRA-LETKUFA` = 1 is money attributable to deposits through 31.12.2007 (including attributed gains), belonging to the historical capital regime; = 2 is money attributable to deposits from 01.01.2008 (including attributed gains), belonging to the pension regime. On that interpretation at least two severance Money-Layer regimes follow (severance × through 2007 × capital; severance × from 2008 × pension); this is not a claim that they are the only ones.

**Evidence:** Observed across the Mor provident-fund cases. External institutional support: the Israel Aerospace Industries Employees Provident Fund report, which distinguishes severance-component money deposited through 31.12.2007 (קופת גמל אישית לפיצויים) and states that money deposited from 1.1.2008 onward is designated for pension (source and limits: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §3.3). That report is not an official decoding of `SUG-ITRA-LETKUFA`; statutory / regulatory text has not yet been attached. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §3.

**Scope:** Examined severance cases. Other historical boundaries exist in the record (e.g. 1997, 1999/2000) and are not excluded.

**Confidence:** Evidence Supported — working interpretation. Not an official XML-dictionary decoding; not Verified; not Operationally Supported.

**XML Completeness:** Partially Supported — the pre/post-2008 regime distinction of severance money appears to be represented in XML by the `SUG` value (working interpretation); the official field semantics are not recovered.

**Unknowns:** Official `SUG` semantics; exact rights differences resulting from the distinction (see `PF_OPEN_QUESTIONS.md` Q4); universality beyond examined cases.

**Roy Reality Usage:** Identity dimension (historical period / balance regime) of a severance Money Layer. Must not be conflated with tax status (PF-KR-007).

---

### PF-KR-007

**Title:** Capital / pension regime character is not tax status or realization form

**What we know:**
Capital character ≠ tax-free. Pension character ≠ monthly-pension-only. Pre-2008 severance has historical capital character but is not automatically tax-exempt; some may qualify as an exempt severance grant and some may be taxable. Post-2008 severance belongs to the pension regime. Pension-regime character does not by itself establish that the money is monthly-pension-only. Whether, when, and under what conditions that severance may be received as a lump-sum grant is part of the unresolved Severance Rights Matrix (Q4).

**Evidence:** Consistent with the existing legal-research record (rights depend on money-internal lineage and on event-time facts). Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §4.

**Scope:** Severance Money Layers; general principle for Provident Fund rights.

**Confidence:** Evidence Supported.

**XML Completeness:** Not Yet Identified — event-time tax status is not expected in current XML.

**Unknowns:** The exact conditions, exemption determination and treatment of the taxable portion (Rights Matrix, `PF_OPEN_QUESTIONS.md` Q4).

**Roy Reality Usage:** Roy Reality must never derive tax status or realization form from regime character alone.

---

### PF-KR-008

**Title:** Money Reality, Rights and Scenario are separate levels; a Money Layer is not a choice

**What we know:**
A Money Layer describes what the money is; it is not an XML row (an XML row is an Evidence Record), not a retirement choice, and not the current realization method. A later Form 161 decision acts on a Money Layer; it does not create or redefine it. Three levels: Money Reality (what exists and its history-derived properties) → Rights (what may legally be done, under what conditions) → Scenario (what Roy chooses). Flow: XML → Money Reality → Money Layers → Current Rights → Available Retirement Choices → Selected Scenario → Tax / Pension Outcome. Current Reality ≠ Rights ≠ Scenario; component identity ≠ balance regime; a current right / outcome ≠ historical Money Layer identity.

**Evidence:** A Goose architectural / domain-modeling principle established by Roy, not an externally verified legal fact; it is consistent with the existing record (`MONEY_LAYER_DEFINITION.md` §5 and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §D2). Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §5.

**Scope:** Provident Fund Roy Reality; likely generalizable, not asserted.

**Confidence:** Evidence Supported — as consistency with the existing record for a modeling principle; this is not legal verification.

**XML Completeness:** Not applicable — architectural distinction.

**Unknowns:** Correspondence to `GOOSE_PENSION_FOUNDATION.md`'s Rights Layer / Domain / Realization vocabulary is unreconciled.

**Roy Reality Usage:** Governs how Reality, Rights and Scenario are kept apart in any future design.

---

### PF-KR-009

**Title:** Form 161 is a future decision point; the severance alternatives are distinct mechanisms

**What we know:**
Roy is pre-retirement, so Form 161 is not evidence of a choice already made; it describes rights and choices exercisable at an employment-termination / retirement event. Principal severance alternatives: (1) lump-sum grant / withdrawal (משיכת מענק / פיצויים); (2) annuity sequence (רצף קצבה); (3) severance sequence (רצף פיצויים). Annuity sequence ≠ pension (קצבה is the periodic payment); severance sequence ≠ annuity sequence. Pension capitalization (היוון קצבה) is a different mechanism from severance withdrawal — capitalization consumes pension value; do not model both as one generic "capital withdrawal." Form 161 is a candidate domain basis for the future severance choice model; the current simulation fields must not be assumed to represent it.

**Evidence:** Tax Authority service material recorded in `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5 and `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §A2.4. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §6.

**Scope:** Severance Money Layers at a termination / retirement event.

**Confidence:** Evidence Supported (that these are distinct mechanisms).

**XML Completeness:** Not Yet Identified — not expected in current XML.

**Unknowns:** Detailed conditions, reversal rules and employer rights (`PF_OPEN_QUESTIONS.md` Q4); comparison with the current simulation inputs (Q5).

**Roy Reality Usage:** Future decision / rights layer only; not part of Money Layer identity.

---

### PF-KR-010

**Title:** A tax-exempt severance withdrawal is not costless

**What we know:**
Exempt severance grants may enter the Fixation of Rights (קיבוע זכויות) calculation and may reduce the exemption available for future qualifying pension. Roy Reality must eventually distinguish and simulate at least: amount withdrawn, exempt amount, taxable amount, immediate tax, remaining pension capital, effect on future pension, and effect on Fixation of Rights / the retirement exemption basket. Documented as a requirement only; nothing is implemented.

**Evidence:** Israel Tax Authority Form 161ד (fixation of rights under section 9א; archived copy of the Tax Authority PDF, snapshot 2025-03-02). Section ב, item 2: previously received exempt grants (מענקים פטורים) reduce the exempt capital ("הפגיעה בהון הפטור") after multiplication by a coefficient; item 5: an intended exempt-grant withdrawal is a declared input; item 7 / footnote 8: exempt capital designable for future capitalization is taken after that reduction. General dependency also recorded in `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C.5. Primary citations pending: the statutory text of section 9א and the current (2026) Form 161ד guidance, which could not be retrieved. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §7.

**Scope:** Retirement scenarios involving severance withdrawal.

**Confidence:** Evidence Supported (primary Tax Authority form). Not Verified — statute and 2026 guidance pending.

**XML Completeness:** Not Yet Identified — event-time tax history is not expected in current XML.

**Unknowns:** The exact mechanism: the form says "exempt grants" and does not itemize exempt severance grants from provident funds; the coefficient and which grants count are unresolved (`PF_OPEN_QUESTIONS.md` Q4).

**Roy Reality Usage:** Requirement for a future Rights Engine / simulation.

---

### PF-KR-011

**Title:** `KOD9` (`KOD-TECHULAT-SHICHVA` = 9) — meaning unresolved

**What we know:**
`KOD9` appears in severance evidence, always with `REKIV1`. In case MOR-1 the same `KOD9 / REKIV1` spans both `SUG1` and `SUG2`, so `KOD9` is not simply the pre/post-2008 distinction. It is an observed layer-applicability code strongly associated with severance in the evidence, but its exact official semantics are not decoded. Do not record `KOD9 = severance`: `REKIV1` already appears to encode the component, and the independent dimension `KOD9` represents is unknown.

**Evidence:** Observed in cases MOR-1 and MOR-2. `KOD9` = `KOD-TECHULAT-SHICHVA` = 9 confirmed by Roy (2026-09-21) as the field/value observed in the relevant XML. Detail: `PF_SEVERANCE_LAYERS_AND_RIGHTS_DISCOVERY_2026-09-21.md` §9.

**Scope:** Examined severance cases.

**Confidence:** Observed. Official semantics: Not Yet Identified.

**XML Completeness:** Not recorded — `KOD9` is an observed code, not a reality whose representation in XML is in question; its physical presence in XML is an observation, not an XML Completeness finding.

**Unknowns:** The official semantics of value 9 (`PF_OPEN_QUESTIONS.md` Q3). No meaning is inferred or assigned.

**Roy Reality Usage:** None. Must not be used to derive any regime, component or right.
