# Israeli Pension Ecosystem: Ecosystem-First Foundation Discovery

**Discovery ID:** `IPE-FOUNDATION-DISCOVERY`\
**Domain:** Israeli pension ecosystem\
**Version 0.1 — Draft**\
**Research cut-off:** 2026-07-23\
**Author:** Codex\
**Product Owner:** Roy — approval of discovery scope; ratification pending

> **Purpose of this artifact:** establish the reality Goose must preserve before it models pension products. It is evidence-led discovery, not legal advice, a complete law survey, or a ratified system contract.

## 1. Reading protocol

Each substantive statement is classified as follows.

| Label | Meaning | Implementation consequence |
|---|---|---|
| **Verified fact** | Directly supported by an identified authoritative source. | May guide discovery; still requires applicability/effective-date checks before runtime use. |
| **Supported interpretation** | A cautious synthesis of identified sources; not itself a quoted legal rule. | Candidate model only. |
| **Inference** | A design or conceptual conclusion drawn from the evidence. | Never encode as legal truth without a later rule object and validation. |
| **Unknown / evidence gap** | The available sources do not establish the proposition. | Preserve uncertainty; do not fill with a default. |

“Current” in this document means only that the linked source was available at the research cut-off. It does **not** mean it governs an earlier fact pattern.

## 2. Motivation layer — why this ecosystem exists

### 2.1 What the evidence supports

- **Verified fact:** A government pension-savings service describes pension savings as a principal household income source during the benefit/retirement period for many workers, and says earlier saving can support living standards after retirement. [S4]
- **Verified fact:** Official government material distinguishes pension products by disability/loss-of-work-capacity and death/survivor coverage: a pension fund includes those covers by default subject to stated exceptions; executive insurance may purchase them; a savings provident fund generally does not include them. [S4]
- **Verified fact:** The 2008 mandatory-pension arrangement made pension insurance an employment obligation across the economy; a Knesset Research and Information Center paper records its stated long-run consequence as a monthly pension after retirement, in addition to old-age benefit, according to accumulations and the insured track. [S7]
- **Verified fact:** Section 14 material issued by the Ministry of Labor states that employer payments to a provident fund/pension fund/similar fund do not replace statutory severance pay unless the relevant collective agreement so provides or the payment was approved by ministerial order. [S6]
- **Verified fact:** Israel Tax Authority’s continuity service requires records of a previous employment-termination event, continuity choice, current balance confirmation, and transfer confirmation where money moved. [S8]
- **Verified fact:** The Capital Market Authority’s mandate includes stability, competitiveness, ability of supervised institutions to meet public obligations, and fair/professional service. [S1]

### 2.2 Supported interpretation: distinct policy problems, not one “pension purpose”

The evidence supports a multi-purpose ecosystem:

1. **Retirement income replacement:** accumulate or secure periodic income after work income ends.
2. **Earnings-risk protection:** provide a mechanism for disability/loss-of-capacity and for survivors after death; its presence and structure are not uniform across products.
3. **Employment-transition protection:** severance law addresses a distinct employment-termination problem. Payments into a pension-related vehicle may interact with it, but Section 14 shows they are not automatically identical to the statutory severance obligation.
4. **Long-term savings and capital formation:** public institutions describe pension managers as managing the public’s long-term savings, while regulation also focuses on institutional stability and investment management. [S1][S5]
5. **Tax and administrative policy:** tax-continuity procedures and tax-qualified account categories demonstrate that the system attaches consequences to employment termination, continuation choices, and lineage—not merely to a total balance. [S8]

### 2.3 Boundary conclusion

**Inference:** “pension money” is not one economic thing. It can simultaneously participate in saving, insurance/risk protection, employment-law settlement, and tax administration. Goose should not use a single `pension_balance` as the foundational legal model. It may use one as a display aggregate only, derived from more granular facts.

**Unknown:** A complete historical account of the original legislative policy objective for every component is outside this pass. It needs explanatory notes, enactment records, and the exact instrument that introduced or changed each component.

## 3. Ecosystem-first discovery findings

### 3.1 Person

**Verified fact:** The regulatory and administrative sources refer to distinct roles including employee/saver (`עמית`), insured person, beneficiary/survivor, employer, institutional body, and tax applicant. [S2][S8][S10]

**Supported interpretation:** The person is the subject of rights and events, but not all relevant status belongs directly to the person. Some status is tied to a specific employment relationship, an account/policy, a beneficiary designation, or a rule version.

**Candidate facts to preserve** (not a complete legal attribute list): person identity; residency/tax identity where proven relevant; birth-date data; family/beneficiary facts with evidence and effective period; role in each employment and product relationship.

**Unknown:** The precise legal priority among nomination, statutory survivors, estate, and product terms is product- and date-sensitive. It must not be represented by one universal beneficiary rule.

### 3.2 Employment relationship

**Verified fact:** The 2008 expansion order created an economy-wide mandatory pension-insurance framework for employees and employers; its original 2007 order was later replaced by a 2011 consolidated order, and contribution increases were later addressed by a 2016 order. [S7]

**Verified fact:** The Ministry of Labor is responsible for approvals under Section 14 of the Severance Pay Law and for expansion orders. [S6][S9]

**Supported interpretation:** Employment is not merely metadata for an account. It is a possible source of contribution obligation, salary base, severance entitlement, termination event, and tax-continuity decision.

**Candidate facts to preserve:** employment relationship identifier; employer; start/end and continuity dates; governing collective agreement/expansion order/contract where evidenced; termination classification only when evidenced; Section 14 arrangement and effective dates; relationship-to-contribution linkage.

**Unknown:** Exact eligibility waiting periods, exceptions, and precedence when an industry agreement improves on the general order require a dedicated effective-dated employment-law drill-down.

### 3.3 Salary

**Verified fact:** The mandatory-pension framework is an employment insurance/contribution arrangement; the historical order sequence changed over time. [S7]

**Supported interpretation:** Salary is a dated calculation base, not safely a single person-level field. A system must distinguish at least reported pay from the base actually used for a contribution or coverage calculation when evidence supports the distinction.

**Inference:** A durable fact unit should be `salary_basis_observation`, linked to a payroll/employment period and source evidence, rather than a mutable `insured_salary` field on a person or account.

**Unknown:** The exact definition of pensionable/insured salary, inclusions, exclusions, ceilings, and retroactive-pay treatment differs by applicable agreement and product rules. No generic formula is established here.

### 3.4 Pension contributions

**Verified fact:** Official sources differentiate employee and employer roles in the mandatory arrangement and describe pension products with different insurance structures. [S4][S7]

**Verified fact:** A transfer framework exists for money between provident funds; official rules contemplate a transferring fund and a receiving fund, and the Tax Authority requires transfer confirmation in a continuity context. [S8][S11]

**Supported interpretation:** At least five events must be distinguished: (1) obligation accrual, (2) payroll deduction/withholding, (3) employer remittance, (4) receiving-body credit/allocation, and (5) later transfer. These events can differ in date, amount, evidence, and legal consequence.

**Inference:** “Contribution” should be a composed concept, not a single posted cash row. Goose needs an event ledger that can record a claimed obligation separately from proof of payment and provider allocation.

**Unknown:** The required operational reconciliation rules for late, missing, partial, and corrected remittances need primary operational regulations/circulars and clearinghouse specifications.

### 3.5 Legal contribution components — and why each exists

This section deliberately does not assume that components are the deepest identity of money.

| Candidate component/classification | What current evidence supports | Why it appears to exist | What is *not* established here |
|---|---|---|---|
| Employee payment / תגמולי עובד | Employee-facing pension saving is part of the mandatory employment framework. [S7] | **Supported interpretation:** employee participation in retirement saving and tax-qualified accumulation. | A universal legal definition or invariant behavior across products/dates. |
| Employer payment / תגמולי מעביד | Employer pension insurance/contribution is part of the framework. [S7] | **Supported interpretation:** employer-financed employment benefit and retirement-income policy; may also finance product mechanisms depending on the arrangement. | That it produces the same ownership, liquidity, insurance, or tax result as employee payment. |
| Employer severance payment / פיצויים | Section 14 explicitly distinguishes payments to funds from automatic replacement of statutory severance pay. [S6] | **Verified/supported boundary:** it relates to employment-termination/severance obligations, not simply retirement saving. | That every “pitzuyim” ledger value discharges a severance obligation, or that it always belongs to the employee in the same way. |

### 3.5.1 Fundamental identity test

**Inference:** A component is best treated as an important *classification dimension*, not yet as the ontological identity of money. The facts that may sit beneath it are:

```text
dated employment-linked obligation
  → contribution/remittance event
  → allocation to an administered holding
  → rights and restrictions under law + contract/product + event + rule version
```

This explains why the same economic amount can need different treatment after a job end, a transfer, a withdrawal request, a death, or a tax continuity choice.

**Active falsification target:** If a primary rule shows that two amounts with different contribution components always have identical rights in a stated context, component cannot be the determinant for that context. Conversely, if an outcome follows a component even after transfer, it supports component as a persistent attribute—but still not necessarily the deepest identity.

**Unknown:** Original enactment purpose, legal definition, and date-by-date behavior of each component are not established by this source set. They need instrument-level research.

### 3.6 Persistent money attributes

**Verified fact:** The Tax Authority’s continuity process preserves prior employer/termination references and asks for transfer confirmation; it therefore operationally recognizes historical lineage across a later request. [S8]

**Verified fact:** Transfers are formally regulated rather than being equivalent to a new contribution. [S11][S12]

**Supported interpretation:** A total balance is insufficient to represent the money’s history. At minimum, a durable model must be able to preserve source relationship, time, legal classification, tax/continuity status, movement lineage, governing rule version, and evidence provenance.

**Candidate persistent attributes** — all effective-dated and evidence-bearing:

| Attribute | Why retain it |
|---|---|
| Source employment relationship and contribution period | Links money to obligation, salary context, and termination history. |
| Obligor/payer and legal basis | Separates a legal obligation from a voluntary or transferred amount. |
| Contribution component / classification | Required candidate dimension for severance and tax investigation. |
| Salary basis and rate basis | Allows later verification of how the amount arose. |
| Tax and continuity election/status | Tax Authority process shows this can survive a job change and interact with withdrawal. |
| Product/account and plan-rule version | A holding is administered through a product, whose terms can change by version. |
| Transfer lineage | Prevents transfer from erasing historical identity. |
| Liquidity/vesting/eligibility state | Must be distinguished from balance and from ownership. |
| Coverage/risk allocation where applicable | Needed because some products bundle insurance and some do not. |
| Evidence and rule provenance | Enables a later conclusion to be audited. |

### 3.7 Rights model

**Verified fact:** Product structures differ in whether disability and death/survivor protection are built in, optional, or generally absent. [S4]

**Verified fact:** A Section 14 arrangement is conditional; a fund payment does not automatically substitute for severance pay. [S6]

**Verified fact:** Tax continuity choices can concern previous termination events and money later transferred between funds. [S8]

**Supported interpretation:** Goose must distinguish at least these non-equivalent concepts:

```text
economic balance ≠ legal ownership/beneficial entitlement ≠ withdrawal entitlement
                 ≠ retirement-income entitlement ≠ insured-event eligibility
                 ≠ tax treatment
```

**Inference:** A right should be modeled as a dated, evidence-backed evaluation: `right_type`, `holder`, `subject holding/relationship`, `triggering event`, `conditions`, `rule set/version`, `result`, and `confidence`. It should not be encoded as a permanent boolean on an account.

**Unknown:** The legally correct rights graph for severance, death, disability, retirement and transfers requires product-rule and statute-specific work. This discovery establishes the separation requirement, not the decisions.

### 3.8 Lifecycle events

**Verified fact:** Official sources specifically recognize employment termination and continuity choices, transfers, retirement saving, death/survivor and disability/loss-of-capacity cover. [S4][S6][S8][S11]

**Candidate event taxonomy:** employment start; eligibility start; salary-basis change; obligation accrual; contribution due/paid/credited/corrected; coverage commencement/lapse/change; employment end; severance determination; tax continuity election/change; transfer; withdrawal request/payment; disability claim/decision; death; retirement/annuity commencement; rule/product-version transition.

**Inference:** Events should be append-only facts with known date precision, not state mutations that erase the previous position. The system derives current status from facts under a selected “as-of” date and applicable rule versions.

**Unknown:** Event precedence and retroactivity rules—especially corrections, late deposits, reinstated coverage, and historical legal changes—need targeted research and test cases.

## 4. Product layer — intentionally downstream

### 4.1 Product-neutral finding before comparison

**Verified fact:** Government guidance identifies the familiar product families: pension fund, executive insurance, and provident fund. It says pension funds include disability and survivor cover by default (with stated exceptions), executive insurance may include purchased death/loss-of-capacity cover, and a savings provident fund generally does not include those insurance components. [S4]

**Verified fact:** Official government information says a saver can transfer pension savings without employer approval and notes that some closed legacy products cannot receive new transfers. [S10]

**Supported interpretation:** A product is an administrative/contractual/regulatory mechanism placed on top of the ecosystem primitives. It is not the origin of every right attached to money deposited into it.

### 4.2 Initial product capability comparison — deliberately narrow

| Product family | Verified capability distinction | Do not infer yet |
|---|---|---|
| Pension Fund / קרן פנסיה | Government material describes embedded disability and survivor cover, subject to stated exceptions. [S4] | Exact benefit formula, eligibility, balance ownership, survivor hierarchy, or historical rules. |
| Executive Insurance / ביטוח מנהלים | Government material describes the possibility of purchasing death and loss-of-capacity cover. [S4] | That all policies have the same cover, pricing, guarantees, conversion rights, or transferability. |
| Savings Provident Fund / קופת גמל לחיסכון | Government material describes it as generally savings without death/loss-of-capacity cover. [S4] | That it has no rights beyond investment accumulation, or that all provident-fund accounts share withdrawal/tax treatment. |

### 4.3 Product-specific mechanisms to investigate next

1. Contract/rules version and joining date.
2. Insurance design: risk premiums, coverage start/lapse, waiting/qualification periods, exclusions, survivor hierarchy.
3. Accumulation and investment-track rules, fees, pooling, balancing/guarantees where applicable.
4. Retirement conversion/payment rules and beneficiary handling.
5. Transfer acceptance/prohibitions and which money attributes legally survive.
6. Product-specific reporting fields and their relationship to the product-neutral ledger.

## 5. Historical and effective-dated model

### 5.1 Verified historical anchors

| Period/event | Evidence-supported statement | Consequence |
|---|---|---|
| 2007/2008 | The original economy-wide expansion order was signed in 2007 and entered into force on 1 January 2008. [S7] | Do not imply the universal mandatory arrangement governed earlier employment periods. |
| 2011 | The 2007 order was replaced by a 2011 consolidated order. [S7] | Rule retrieval must choose the applicable instrument, not a timeless “mandatory pension law.” |
| 2016 | A later expansion order increased pension contributions. [S7] | Contribution-rate history is effective-dated. This artifact does not state rates. |
| 2016 transfer circular | CMA issued a transfer-circular amendment under the provident-fund law and transfer regulations. [S12] | Transfer process/rules are versioned; do not use the 2016 circular for earlier transfer events without continuity evidence. |
| 2021 law publication | The provident-fund law’s pension-fund classifications were amended in a 2021 published law. [S13] | Product taxonomy itself is historically versioned. |

### 5.2 Mandatory implementation rule

For every material conclusion, Goose must record at least:

```text
fact/event date | contribution/payroll period | employment period | product joining/plan date
rule publication date | rule effective-from/to | source | applicability predicates
```

**Inference:** A calculation request without enough dates should produce `insufficient_historical_basis`, not substitute today’s rule.

## 6. Candidate canonical Goose model

This is a conceptual proposal, not an approved schema.

```text
Person
  └─ EmploymentRelationship (effective-dated)
       └─ SalaryBasisObservation (period-specific)
       └─ ContributionObligation
            └─ ContributionEvent [withheld | remitted | credited | corrected]
                 └─ HoldingAllocation
                      ├─ MoneyAttributeSet (component, tax, lineage, etc.)
                      └─ ProductParticipation (product + plan/rules version)

LifecycleEvent ──► evaluates/changes ──► RightAssessment
RuleVersion + SourceEvidence ───────────► every material assessment
```

### Proposed entity/value-object boundaries

| Candidate | Role | Status |
|---|---|---|
| `Person`, `EmploymentRelationship`, `ProductParticipation`, `LifecycleEvent`, `SourceEvidence`, `RuleVersion` | Identity-bearing, independently dated records. | Candidate entity. |
| `SalaryBasisObservation`, `ContributionObligation`, `ContributionEvent`, `HoldingAllocation`, `RightAssessment` | Evidence-bearing domain records; may be entities if correction/lineage must be addressed individually. | Candidate entity. |
| `MoneyAttributeSet`, component classification, tax/continuity classification, date interval, confidence | Immutable descriptors used by records/assessments. | Candidate value object/dimension. |
| `Balance` | Aggregate over allocations, under a specified as-of date and inclusion policy. | Derived view, not source of legal truth. |

## 7. High-value discoveries

1. **The system has multiple purposes.** Retirement accumulation, risk cover, severance, and tax administration are distinct policy domains that meet in the same savings ecosystem.
2. **Employment is a causal layer.** The 2008 economy-wide framework and Section 14 boundary mean employment facts may be indispensable to pension conclusions.
3. **Severance is not automatically transformed into pension savings.** Section 14’s conditional wording directly falsifies that simplification.
4. **Money needs lineage.** Tax-continuity and transfer procedures preserve references to prior employment and movements; total balance alone loses material context.
5. **Products are a downstream layer.** Official guidance confirms different insurance structures, but those product differences should be attached after—not substituted for—the person/employment/contribution/right model.

## 8. Largest remaining uncertainties

1. Exact effective-dated legal definitions and behavior of employee, employer, and severance components.
2. The complete salary-base and contribution-obligation rules, including precedence of general, sectoral, collective, and contractual arrangements.
3. When a severance deposit discharges an employer liability, is retrievable, or is otherwise allocated—across Section 14 status and history.
4. The precise cross-product transfer-preservation rules for components, tax attributes, cover, and eligibility history.
5. Product-rule version effects for disability, survivors, retirement conversion, guarantees, and legacy arrangements.

## 9. Evidence gaps and targeted next research

| Gap | Why it blocks modeling | Best next primary evidence |
|---|---|---|
| General pension orders, 2007/2011/2016: complete official texts and effectivity | Cannot calculate/validate contribution duties or historic eligibility. | Official publication (`ילקוט הפרסומים`/Ministry of Labor archive) and applicable collective agreements. |
| Severance Pay Law §§14 and 26 plus general Section 14 approval, all relevant versions | Cannot decide employer discharge, employee entitlement, or return-to-employer boundary. | Consolidated statutory text and ministerial general approval. |
| Provident Funds Supervision Law definitions and transition provisions | Cannot build legal taxonomy or transfer semantics. | Official consolidated law plus amending laws/regulations. |
| Income Tax Ordinance / regulations / Tax Authority professional directives | Cannot assign tax or continuity behavior to allocations. | Official consolidated text, forms and current/historical directives. |
| CMA product and transfer circulars plus standard fund rules | Cannot model products or transfers safely. | CMA circular repository, standard regulations, plan/policy terms by version. |
| Clearinghouse/remittance operational specification | Cannot reconcile payroll, remittance, crediting and corrections. | CMA clearing specifications / statutory reporting instructions. |

## 10. Recommended next focused drill-down

**Recommendation: “Employment-to-Contribution-to-Severance lineage, 2008–present.”**

It most directly unblocks the canonical model because it tests the core chain before product complexity:

```text
employment relationship → applicable obligation → salary basis → dated contribution event
→ component/classification → Section 14 / termination effect → tax-continuity record
```

The drill-down should begin with the complete legal text and effective dates of the 2011 consolidated mandatory-pension order, the 2016 increase order, the Severance Pay Law (especially §§14 and 26), and the general Section 14 approval. It should create a dated scenario set, not software logic: a standard salaried employee, an employee with a superior arrangement, a termination with and without evidenced Section 14 coverage, a late/corrected remittance, and a transfer after termination.

Only after this chain is evidence-backed should Goose map the same facts into Pension Fund, Executive Insurance, and Provident Fund-specific mechanisms.

## 11. Source register

Primary legal/regulatory sources are ranked first. Government explanatory sources are useful but do not override governing law. “Accessed” means available during this research pass, not a claim about the source’s effective date.

| ID | Authority / type | Source | Used for | Historical caution |
|---|---|---|---|---|
| S1 | Primary regulator statement | [Capital Market, Insurance and Savings Authority — role](https://www.gov.il/he/departments/Units/department_cma) | regulator’s statutory/operational mission | Current web statement; not evidence for historical product terms. |
| S2 | Primary-regulator procurement/specification | [Central pension clearing system tender](https://www.gov.il/BlobFolder/generalpage/pension-clearing/he/agents-and-consultants_pension-clearing_pensionaryclearingtender.pdf) | ecosystem roles and product-system context | Published c. 2011; not a current operative rule without verification. |
| S3 | Official regulation/circular | [CMA circular: transfer of money between provident funds — amendment (2016)](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1100/he/regulation_h_2016-9-11-changes.pdf) | formal transfer mechanism and legal basis | Read as 2016 circular only; retrieve later versions for current operation. |
| S4 | Government explanatory service | [Self-employed pension-deposit reporting service](https://www.gov.il/he/service/pension-deposit-report) | retirement purpose; high-level product insurance distinctions | Explicitly explanatory; source itself says applicable law prevails. |
| S5 | Primary central-bank statistics page | [Bank of Israel: institutional investors](https://kamakama.gov.il/roles/statistics/other-financial-institutions/institutional-investors/) | long-term public savings context | Current statistics framing; not a rights source. |
| S6 | Primary labor-ministry guidance | [Guidance for retrospective application of Section 14](https://www.gov.il/BlobFolder/servicequestionnaire/approval-agreement-section28-request/he/guidelines-applying-retroactively-section14.pdf) | Section 14 conditional replacement boundary | Guidance quotes the statute; retrieve statutory consolidated text/general approval before any decision. |
| S7 | Secondary parliamentary research | [Knesset Research and Information Center: foreign workers and pension insurance](https://fs.knesset.gov.il/globaldocs/MMM/07dcb0f8-423d-ef11-815f-005056aac6c3/2_07dcb0f8-423d-ef11-815f-005056aac6c3_11_20749.pdf) | historical anchors for 2007/2008, 2011, 2016 orders | Strong orientation, not substitute for order texts. |
| S8 | Primary tax-administration service | [Tax Authority: changing compensation/annuity continuity choice (Form 161c)](https://www.gov.il/he/service/compensation-and-annuity-sequence) | continuity, termination, transfer record requirements | Current service page; underlying tax provisions and historic forms needed for past facts. |
| S9 | Primary labor-ministry unit description | [Labor Relations Unit](https://www.gov.il/he/departments/units/working-relations) | Ministry responsibility for expansion orders and Section 14 approvals | Does not contain operative rules. |
| S10 | Government explanatory service | [Managing pension savings](https://haotzarsheli.mof.gov.il/Subject/Pages/Pension-Savings-Management.aspx) | saver transfer choice and legacy-product warning | Explanatory; transfer rules and historical exceptions need primary texts. |
| S11 | Official regulation draft/archive | [Provident-fund transfer regulations amendment (2010 draft)](https://www.gov.il/BlobFolder/generalpage/provident-fund-mobility-reform/he/Life-insurance_Providentfund_Niyud_t2010-3c.pdf) | evidence that transfer is a formal regulated process | Draft only; never treat as enacted text. |
| S12 | Official circular | [CMA circular: investment tracks in provident funds (2015)](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/regulation-1175/he/regulation_2015-9-29cngs.pdf) | product/rule versioning and regulatory basis example | Used only as a dated regulatory source. |
| S13 | Primary published legislation | [2021 published law amending provident-fund classifications](https://fs.knesset.gov.il/24/law/24_lsr_611567.pdf) | proof that product classifications change over time | Amendment text only; need consolidated law and commencement clauses. |

## 12. Validation and non-goals

### Validation performed

- Official Israeli government, regulator, Tax Authority, Ministry of Labor, Knesset, and Bank of Israel sources were prioritized.
- Every date-specific statement in §5 is attached to a dated source and constrained to what that source establishes.
- Product comparison was postponed until §4 and confined to officially stated high-level distinctions.
- No contribution percentages, withdrawal conditions, tax formulas, severance outcome, or insurance entitlement was generalized from current explanatory pages.

### Not established

- No calculation-ready contribution engine.
- No universal contribution-component ontology.
- No determination of ownership, withdrawal, tax, survivor, disability, or severance entitlement for an individual.
- No claim that the source register is exhaustive or that a current web page governs historical circumstances.

---

**Next action requires Product Owner approval:** begin the recommended employment-to-contribution-to-severance lineage drill-down and retrieve the cited primary legal texts in full before creating any rule-level Canonical Knowledge Objects.
