# Uniform XML Money Representation — Discovery

Date: 2026-07-20

Status: Living. This document evolves as more XML files are inspected. It is not final and does not close the investigation.

Scope: discovery only. This report documents observations, structural findings, hypotheses, and open questions from direct inspection of Pension Clearing House (מסלקה פנסיונית) XML files. It does not define a canonical ontology, does not propose a data model, and does not propose implementation or architecture. Any future canonical modeling decision is out of scope for this document and must go through its own review.

Evidence source note: the underlying XML files are Private Evidence (Roy's real clearinghouse exports) per `docs/foundation/EVIDENCE_HANDLING.md` and are not stored in this repository. This document records field names, enumerated values, and structural relationships observed in those files — not account-identifying content.

## Evidence-status legend

- **Verified Fact** — directly observed, present in the XML files as-is, not open to interpretation.
- **Strongly Supported** — observed consistently across multiple files/records; the pattern itself is not in question, though its official meaning may still be unknown.
- **Operationally Supported** — the structure behaves this way in the files inspected, but the sample is small and the official specification has not been consulted to confirm this is the general rule.
- **Hypothesis** — a candidate explanation for the observed structure. Not yet confirmed or rejected.
- **Rejected (current evidence)** — a prior working assumption that the current evidence does not support.
- **Unknown** — not yet determined by this pass.

---

## A. Evidence Base

Current investigation includes 6 XML files:

- 5 Provident Fund (קופת גמל) XMLs
- 1 Study Fund (קרן השתלמות) XML

Observed product types: Provident Fund, Study Fund.

Evidence status: Verified Fact (file count and product types, as inspected in this pass).

Sample size caveat: 6 files is a small sample from one clearinghouse export format, one point in time, and one member. Findings below should be read as "observed so far," not as population-level statistics.

---

## B. Observed Axes

Four fields were observed acting as apparent classification/discriminator fields on balance records:

- `KOD-TECHULAT-SHICHVA`
- `REKIV-ITRA-LETKUFA`
- `SUG-ITRA-LETKUFA`
- `TIKRAT-HAFKADA-MUTEVET`

### Observed values per field

**`KOD-TECHULAT-SHICHVA`**

3, 4, 5, 6, 7, 9, 13

**`REKIV-ITRA-LETKUFA`**

1, 2, 3, 4, 8, 9

**`SUG-ITRA-LETKUFA`**

1, 2

**`TIKRAT-HAFKADA-MUTEVET`**

(empty), 1, 2

Evidence status: Verified Fact (values as observed in the 6 files). The official meaning of each value is Unknown (see Open Questions, section E).

---

## C. Structural Discoveries

### D1 — `PerutYitraLeTkufa` appears to be the smallest repeating balance record observed so far

`PerutYitraLeTkufa` is the smallest repeating element found that carries a balance figure together with the axis fields listed in section B. No smaller repeating structure carrying a balance amount plus classification fields has been observed in this file set.

Evidence status: **Operationally Supported**

### D2 — Multiple balance records may exist inside the same account

A single account (חשבון) has been observed containing more than one `PerutYitraLeTkufa` record, each with its own combination of axis-field values and its own balance amount.

Evidence status: **Strongly Supported**

### D3 — Balance records are distinguished by several independent fields rather than one bucket identifier

Where records within the same account differ, they differ across combinations of the four fields in section B, not by a single dedicated "bucket ID" or "bucket type" field. No single field observed in these files uniquely identifies a balance record on its own.

Evidence status: **Operationally Supported**

### D4 — The XML may represent money using multiple independent dimensions ("axes") rather than directly storing tax buckets

Taken together, D1–D3 suggest the XML's balance-record structure could be organized as a set of independent classification axes (of which the four fields above may be examples) whose *combination* identifies a money segment, rather than the file directly storing a single "tax bucket" label per segment.

This is a hypothesis, not a conclusion. It has not been checked against an official schema/specification, and the sample is 6 files.

Evidence status: **Hypothesis**

---

## D. Rejected Hypotheses

### Initial assumption: money is stored as tax buckets

**Initial assumption:** The clearinghouse XML represents money holdings directly as a small set of named tax buckets (i.e., one field whose value is "the bucket").

**Current evidence:** Does not support this model. No single field in the files inspected functions as a standalone bucket identifier; balance records are instead distinguished by combinations of the four axis fields in section B (see D3).

**Status:** Rejected (current evidence). This may be revisited if a larger sample or an official specification shows a bucket-identifying field this pass did not locate.

---

## E. Open Questions

- What is the official meaning of `KOD-TECHULAT-SHICHVA`?
- What is the official meaning of `REKIV-ITRA-LETKUFA`?
- What is the official meaning of `SUG-ITRA-LETKUFA`?
- What is the official meaning of `TIKRAT-HAFKADA-MUTEVET`, including what an empty value represents versus `1` or `2`?
- Is the "Uniform Schema" (מבנה אחיד) a superset of fields shared across all products, or does each product type define its own subset/variant?
- Which of the four observed fields are universal across product types (Provident Fund, Study Fund, and others not yet sampled)?
- Which of the four observed fields are product-specific?
- What is the minimal set of fields required to uniquely identify a money segment (a `PerutYitraLeTkufa` record) within an account?
- Do the observed value sets (e.g. `KOD-TECHULAT-SHICHVA` ∈ {3,4,5,6,7,9,13}) represent the complete enumerated domain, or only the subset that happens to appear in these 6 files?
- Is `PerutYitraLeTkufa` genuinely the smallest repeating balance unit, or does a smaller structure exist that was not present in this sample?

---

## F. Goose Impact

This section documents impact only. It does not recommend an implementation change and does not propose an architecture.

The current Goose canonical model (as reflected in existing Study Fund and Provident Fund knowledge documents, e.g. `docs/knowledge/study_fund/SF_B8_TAX_RIGHTS.md` and `docs/knowledge/provident_fund/PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md`) is bucket-oriented: money is discussed in terms of named tax buckets and legal components.

The current investigation (D1–D4) suggests that the raw clearinghouse data may instead be organized around multiple independent classification axes, whose combination — not a single field — identifies a money segment. If this hypothesis holds up under further evidence, it would mean that any future canonical modeling work touching this area has an open question to resolve: whether Goose's bucket-oriented framing is a derived/computed view on top of these axes, rather than a direct reflection of how the source data is structured.

This is stated as an open question for future review, not as a finding that requires or justifies any change today.

---

## G. Confidence Summary

**Verified Facts**
- 6 XML files inspected: 5 Provident Fund, 1 Study Fund (section A).
- The four fields in section B, and their observed values, as they appear in these 6 files.

**Operationally Supported Findings**
- D1: `PerutYitraLeTkufa` is the smallest repeating balance record observed so far.
- D3: balance records are distinguished by several independent fields rather than one bucket identifier.

**Strongly Supported Findings**
- D2: multiple balance records may exist inside the same account.

**Hypotheses**
- D4: the XML may represent money using multiple independent axes rather than directly storing tax buckets.

**Rejected (current evidence)**
- Money is stored as tax buckets (section D).

**Open Questions**
- See section E in full.

Confidence should not be overstated beyond these labels. In particular, D4 and the Goose Impact section (F) remain a hypothesis and an open question respectively — neither is a conclusion.
