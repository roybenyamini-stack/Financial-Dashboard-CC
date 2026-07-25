# Roy Reality — Money Layer

**Status:** Working domain definition. Sufficiently stable to guide continuing analysis. Not yet a final implementation contract. Unresolved code meanings are left explicitly unresolved (see §8).
**Author:** Claude Code
**Product Owner:** Roy
**Scope:** Defines the business term "Money Layer" as a Roy Reality domain concept, not specific to Provident Fund. Does not define implementation, persistence, calculations, or UI.

---

## 1. Definition

A Money Layer is a business/domain concept — not an XML object, not a persistence model, and not a TypeScript class. XML (e.g. a `PerutYitraLeTkufa` record, per §3) is only one external representation of it; a different data source could represent the same concept differently without changing what a Money Layer is.

A **Money Layer** is the distinguishable portion of money within an Account / Policy that shares the same relevant classification attributes.

The combination of coded attributes allows the money to be classified into Money Layers.

A Money Layer represents the person's current financial reality. It is not created by a future event.

This definition is consistent with, and named to align with, the terminology already used in `docs/knowledge/provident_fund/PF_STAGE1_STAGE2_DISCOVERIES.md` §B.5–§B.11 ("Rights Layer") and with the classification-axis evidence in `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` (§B–§D). It does not restate either document's findings; it names the concept those findings converge on.

---

## 2. Account context

- Account Type belongs to the Account / Policy, not to the Money Layer.
- Amendment 190 (`TIKUN-190`) currently belongs to the Account context rather than to the Money Layer itself. `docs/knowledge/provident_fund/PF_TIKUN_190_XML_FIELD_DISCOVERY.md` establishes this field as account/policy-level (`HeshbonOPolisa`), not attached to an individual balance record — its own semantic meaning remains UNKNOWN, per that document.
- A Money Layer always exists inside an Account / Policy. There is no Money Layer without a containing Account / Policy.

---

## 3. Clearinghouse representation

The current Clearinghouse evidence represents a Money Layer using a `PerutYitraLeTkufa` record, per `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` §C (D1–D3) — observed across both Provident Fund and Study Fund XML samples in that document's evidence base (§A).

The XML is evidence describing reality — it is not the definition of the domain concept (§1). The `PerutYitraLeTkufa` record is the current best-evidenced Clearinghouse representation of a Money Layer; it is not itself what a Money Layer *is*.

Current classification fields under investigation (per that document's §B):

- `REKIV-ITRA-LETKUFA`
- `SUG-ITRA-LETKUFA`
- `KOD-TECHULAT-SHICHVA`
- `TIKRAT-HAFKADA-MUTEVET`

The reported amount belongs to the financial state of the layer rather than to its classification. No specific XML field name for the amount is used here: the same document states only that `PerutYitraLeTkufa` "carries a balance figure together with the axis fields" — it does not name the amount field itself, and no other document in this repository has verified it. Naming it here would be inventing a fact not in evidence, which this document does not do (see §7).

---

## 4. Current conceptual model

This is a conceptual domain model, not a TypeScript schema and not a persistence design.

- Account / Policy contains an Account Type.
- Account / Policy contains Money Layers.
- Every Money Layer is currently described by:
  - `REKIV`
  - `SUG`
  - `KOD-TECHULAT-SHICHVA`
  - `TIKRAT-HAFKADA-MUTEVET`
  - Financial state (reported amount and future financial values)

---

## 5. Reality vs. Event separation, and event expression

Roy Reality stores Money Layers. Event engines interpret existing Money Layers; they do not alter them. Money Layers themselves remain unchanged by any event's interpretation. Different events may express the same Money Layers differently.

Concretely: a Money Layer does not become an event result. Instead, it comes to expression within the context of an event, according to that event's rules.

Current primary event:

- **Retirement**

Possible future event:

- **Inheritance**

**Transfer (ניוד) is explicitly not an event in this sense.** Transfer preserves financial reality — it does not create a new result from the Money Layer. This is consistent with `docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` §C (item 8, "Transfer Continuity Lineage") and `docs/knowledge/provident_fund/PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` §D2, both of which treat transfer as preserving underlying facts rather than producing a new derived result.

### Event grouping

Several different Money Layers may have identical practical meaning for one specific event. For example, several Money Layers may be grouped together as one capital result or one pension result for Retirement.

This grouping belongs only to event logic. Roy Reality must continue storing the original Money Layers separately — grouping for one event's calculation is not a merge of identity. This mirrors the conclusion already reached in `docs/knowledge/provident_fund/PF_STAGE1_STAGE2_DISCOVERIES.md` §B.5 and §B.9: "Calculation aggregation ≠ canonical merge."

---

## 6. User-facing result

Users will eventually see practical results such as:

- Capital
- Pension type
- Tax treatment
- Calculated tax
- Available choices
- Restrictions

These are outputs of event logic, not stored Money Layers. This document does not define those calculations.

---

## 7. Current conclusions

Only conclusions already established are recorded here:

- `REKIV` is a Money Layer classification dimension.
- `SUG` is a Money Layer classification dimension.
- `KOD-TECHULAT-SHICHVA` is a Money Layer classification dimension.
- `TIKRAT-HAFKADA-MUTEVET` currently appears to be an additional separating classification dimension and still requires complete code-book verification.
- Different classification combinations represent different base Money Layers.
- Different Money Layers may later be grouped for one specific event without merging them inside Roy Reality.

No unresolved numeric code mapping is invented or completed by this document. Official value-dictionary recovery for these fields was attempted and did not succeed — see `docs/knowledge/provident_fund/PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md` (Status B: no public copy of the official Holdings data dictionary recovered).

---

## 8. Open work

1. Complete verification of the `REKIV` code book.
2. Complete verification of the `SUG` code book.
3. Complete verification of the `KOD-TECHULAT-SHICHVA` code book.
4. Complete verification of the `TIKRAT-HAFKADA-MUTEVET` code book.
5. Final distinction between identity fields, classification fields, and financial state.
6. Use the completed Money Layer definition to implement Provident Funds in Roy Reality.

---

## 9. Evidence

This working definition is derived from, and traceable to, the following existing discovery artifacts. It does not copy their content — see each document for its own evidence grading and citations.

- `docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md` — first discovery pass on candidate money layers/attributes and their legal basis.
- `docs/knowledge/provident_fund/PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md` — ontology categories and the smallest history-bearing balance-segment analysis.
- `docs/knowledge/provident_fund/PF_STAGE1_STAGE2_DISCOVERIES.md` — the Rights Layer reasoning chain, the event-grouping conclusion, and the Reality-vs-Event distinction (§5 above).
- `docs/knowledge/provident_fund/PF_TIKUN_190_XML_FIELD_DISCOVERY.md` — Amendment 190 field placement evidence (§2 above).
- `docs/knowledge/provident_fund/PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md` — status of the official code-book recovery attempt (§7 above).
- `docs/knowledge/financial_assets/data_representation/UNIFORM_XML_MONEY_REPRESENTATION_DISCOVERY.md` — the `PerutYitraLeTkufa` record and four-axis-field evidence (§3–§4 above), observed across both Provident Fund and Study Fund samples.

---

## 10. Explicit boundaries

This document intentionally does not define:

- Full Roy Reality hierarchy.
- Provident Fund implementation.
- Retirement calculations.
- Inheritance calculations.
- Tax calculations.
- UI presentation.
- TypeScript classes.
- Persistence model.

---

*This document names and stabilizes a working definition of a concept already evidenced in the discovery artifacts listed in §9; it does not restate their evidence or supersede their findings.*
