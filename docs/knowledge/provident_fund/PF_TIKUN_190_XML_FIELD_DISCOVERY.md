# `TIKUN-190` in the pension-clearinghouse XML

Research date: 2026-07-21\
Scope: discovery only; no product, tax, or application-model conclusion is made here.

## Executive answer

**UNKNOWN — the official materials obtained do not establish what the field is
asking “yes” or “no” about.**  The evidence supports only the following narrow
statements:

* **VERIFIED:** `TIKUN-190` is an account/policy-level element in a response
  using the Capital Market Authority's (CMA) *Holdings Interface* (ממשק
  אחזקות), under `HeshbonOPolisa`.
* **VERIFIED:** the CMA's published 2020 Holdings Interface circular assigns
  the authoritative data dictionary and the product-specific XSDs to linked
  attachments.  In particular it links `MivneAchid_Holdings_Excel.xlsx` and
  `MivneAchid_Holdings_KupotGemel_XSD_Schema.xsd`.
* **OPERATIONALLY SUPPORTED, not officially decoded:** the observed values are
  `1` and `2`.  They look like the interface's usual coded yes/no convention,
  but that does **not** identify the proposition being coded.
* **NOT ESTABLISHED:** `1 = account opened as the retail “Amendment 190”
  product`, `2 = not such an account`, or any other semantic expansion.  None
  should be used as canonical meaning.

Accordingly the answer to the stop-condition question is: **not yet known from
verifiable primary evidence.**  “1 means yes / 2 means no” would be incomplete
and is deliberately not presented as a finding.

Confidence: **high** in the interface/scope finding; **high** that the semantic
definition remains unverified in the evidence collected; **low** for any
specific meaning of values `1`/`2`.

## Official definition

### What was found

The authoritative parent instrument is CMA Institutional Bodies Circular
2020-9-12, *Uniform structure for transfer of information and data in the
pension-savings market — update* (מבנה אחיד להעברת מידע ונתונים בשוק החיסכון
הפנסיוני — עדכון).  Its Annex A, *Holdings Interface*, states that:

* worksheets 2–3 contain the interface diagram and data structure; and
* the accompanying XML/XSD files are the validation files for each pension
  product type.

The circular embeds links to the official Holdings Excel dictionary and separate
XSDs for insurance, provident funds, new pension funds, and veteran pension
funds.  This identifies the proper source hierarchy and rebuts any suggestion
that a field-name-only interpretation is authoritative.

### Definition and values

**UNKNOWN.** The obtained circular text does not reproduce the Excel row for
`TIKUN-190`, nor the relevant XSD declaration.  The linked legacy CMA files
resolve through `mof.gov.il`/`www.gov.il`; on 2026-07-21 their direct retrieval
was blocked by the regulator's Cloudflare page.  The blocked response was not
treated as evidence.

Therefore this report cannot responsibly quote a Hebrew field label, give a
paraphrase, or assert the value dictionary.  A future revision must quote the
row from the official Excel and the element declaration from the matching XSD,
including the file version/date.

## Technical contract

| Item | Finding | Evidence level |
|---|---|---|
| Interface | Holdings Interface (ממשק אחזקות), Annex A to the uniform-structure circular | VERIFIED |
| Response hierarchy | `Mimshak / YeshutYatzran / Mutzarim / Mutzar / HeshbonotOPolisot / HeshbonOPolisa / TIKUN-190` | VERIFIED from the supplied XML-path observation; product/account placement is corroborated by the official Holdings Interface terminology |
| Scope | Account/policy (`HeshbonOPolisa`), not the top-level `Mutzar` product object | VERIFIED as placement; semantic scope remains UNKNOWN |
| Products/interfaces with a confirmed declaration | UNKNOWN pending the actual XSD declaration.  The circular publishes a separate provident-fund XSD; this is the first file to inspect. | UNKNOWN |
| XML type | UNKNOWN pending XSD | UNKNOWN |
| Cardinality/mandatory status | UNKNOWN pending XSD and mandatory-code column in the Excel | UNKNOWN |
| Permitted values | Observed `1`, `2`; official dictionary not obtained | OBSERVED / UNKNOWN |
| Missing/blank semantics | UNKNOWN | UNKNOWN |

The term *account/policy level* is structural only.  It does **not** prove that
the flag classifies every balance in the account, determines a withdrawal right,
or establishes the tax treatment of any money layer.

## Statutory meaning of “Amendment 190”

### Verified statutory context

Income Tax Authority Circular 2/2013 describes Amendment 190 to the Income Tax
Ordinance as changes principally to section 9A's pension-tax exemption rules.
It addresses the broader conversion to pension-purpose savings and the tax
treatment of pension/capital choices.  That is a statute/tax context, not a
definition of this XML element.

### What cannot be inferred

The popular adviser shorthand “a Tikun-190 provident-fund account” normally
means a voluntary-capital saving arrangement marketed to people who meet the
relevant conditions.  That shorthand is **not evidence** that `TIKUN-190`
means account opening, current eligibility, the holder's age, minimum-pension
test, withdrawal entitlement, a specific money bucket, or tax rate.

In particular, a field at account/policy level can be a reporting classification
whose legal relevance is narrower or wider than the consumer product label.
Until the official row is recovered, all of the following are **UNKNOWN**:

1. whether the flag signals statutory applicability;
2. whether it marks a product/account created under Amendment 190;
3. whether it signals a withdrawal/pension treatment;
4. whether it is a reporting classification; and
5. whether it has a broader meaning that can appear for a study fund.

## Check against the supplied real XML observations

| Observation | Consistency result |
|---|---|
| Newer provident-fund account, described as operationally associated with Amendment 190: `1` | Consistent with a possible affirmative interpretation, but not proof of what is affirmed. |
| Older capital transferred from executive insurance: `2` | Consistent with a possible negative interpretation, but it does not prove that `2` means “not a retail Amendment-190 account.” |
| Study-fund XML reportedly containing `1` | Material warning against the retail-product interpretation.  The actual file/account classification was not available at the stated `/mnt/data` path in this environment, so the observation remains unverified. |

No conclusion is drawn from the examples.  They are validation observations,
not a substitute for the dictionary.

## Version history

**UNKNOWN.** The following has been verified:

* CMA Circular 2017-9-10 established the uniform structure.
* CMA Circular 2019-9-11 records continuing updates to Annex A (Holdings
  Interface).
* CMA Circular 2020-9-12 publishes a version of Annex A with the linked
  Excel/XSD artifacts.

The circulars establish that interface versions change, but no recovered
change-log or dictionary row says when `TIKUN-190` was introduced or whether its
value meanings changed.  Do not assume stability across XML versions.

## Open questions / next primary-source retrieval

1. Obtain the official `MivneAchid_Holdings_Excel.xlsx` that is attached to the
   applicable circular, and preserve its publication date/hash.  Capture the
   full `TIKUN-190` row: Hebrew label, data type, code table, mandatory code,
   product applicability, and notes.
2. Obtain the exact XSD used by each supplied XML (the root/interface version
   and schema location can identify it).  Capture the declaration and its
   containing complex type.
3. Locate CMA change documents or clearinghouse implementation Q&A that cite
   this exact field, then compare every version's label and code values.
4. Re-open the original XML examples and verify the product type, account
   number, source version, surrounding fields, and whether the study-fund
   example is truly a study-fund account.

Only after step 1 can this report answer, with authority, “yes or no to what?”

## Source table

| Source | Authority | Exact claim supported | Link / repository path |
|---|---:|---|---|
| CMA Circular 2020-9-12, *Uniform structure… — update* | 1 — regulator | Defines the uniform record; Annex A is the Holdings Interface; explains that worksheets 2–3 contain the data structure and that XML/XSD files are attached; embeds official Holdings Excel and XSD links. | [official PDF](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-506/he/regulation_h_2020-9-12.pdf) |
| CMA Circular 2019-9-11, *Uniform structure… — update* | 1 — regulator | Records that Annex A/Holdings Interface had been updated over time. | [official PDF](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-553/he/regulation_h_2019-9-11.pdf) |
| CMA Circular 2017-9-10, *Uniform structure for transfer of information and data in the pension-savings market* | 1 — regulator | Establishes the uniform record and the regulated interfaces used by institutional bodies, licensees, employers, and other consumers of information. | [official PDF](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-506/he/regulation_h_2020-9-12.pdf) (the 2020 consolidation cites the 2017 circular) |
| Income Tax Authority Circular 2/2013, *Amendment 190 to the Ordinance — section 9A instructions* | 1 — tax authority | Establishes the legislative/tax context of “Amendment 190”; does not define the XML field. | `docs/foundation/GOOSE_EXPEDITION_2_PROVIDENT_FUND_CAPITAL_EXEMPT.md` records the official source and its scope |
| Supplied task text / claimed XML observations | 5 — observation | Exact element spelling/path and observed values; not canonical meaning. | User attachment: `pasted-text.txt` |

## Evidence discipline

`VERIFIED` means directly supported by an obtained primary source or by the
supplied XML-path observation.  `OPERATIONALLY SUPPORTED` means plausible
practice evidence but non-canonical.  `INFERRED` is not used for the field's
meaning here.  `UNKNOWN` is a deliberate result, not an implicit negative.
