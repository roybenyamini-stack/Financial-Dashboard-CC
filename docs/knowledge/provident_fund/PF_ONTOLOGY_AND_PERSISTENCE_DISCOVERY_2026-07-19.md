# Provident Fund Ontology and Persistence Discovery

Date: 2026-07-19

Pass: second discovery pass, narrowed to ontology and persistence.

Scope note: this is not a software model. It separates categories of facts, identifies the smallest history-bearing unit supported by current evidence, and marks what remains unsafe to canonicalize.

Method note:

- This pass prioritized current official CMA reporting / transfer materials and current official Tax Authority service material.
- Direct access to several `gov.il` HTML pages and to current CMA schema attachments was partially blocked in this environment. Where an official page was available only through indexed search snippets, that limitation is stated in the confidence labels.
- Mirrored legal text is not treated as sufficient for `Verified`.

Confidence legend used in this pass:

- `Verified`: current official source and explicit enough for the claimed granularity.
- `Strongly Supported`: official source exists, but the exact granularity or carry-forward behavior still needs one more primary text or current schema.
- `Operationally Supported`: current non-official operational source points clearly in one direction.
- `Inferred`: conclusion follows from the sourced structure but is not stated directly.
- `Unresolved`: current evidence is not enough.

## A. Ontology Map

### A1. Category map

| Category | What belongs here | What does not belong here | Confidence |
| --- | --- | --- | --- |
| Person | Age 60, `גיל הזכאות`, disability, low-income status, beneficiary status, aggregate pension facts | Money-internal tax basis of principal | `Strongly Supported` |
| Employer relationship | Employer identity, work period, severance liability period, separation from that employer | Whole-account tax identity | `Verified` for liability-period relevance |
| Product | `קופת גמל`, pension vs non-pension product type, transfer route | `רצף` choice, `תשלומים פטורים` | `Strongly Supported` |
| Account | Account container, institution, account number, `חשבון חדש` as a container status | The full tax identity of all money inside the account | `Strongly Supported` |
| Legal account component | `תגמולי עובד`, `תגמולי מעסיק`, `פיצויים` | `קצבה מוכרת`, age-based eligibility | `Verified` |
| Tax subcomponent | `תשלומים פטורים` versus non-exempt payments inside a component | Product type, person-level age tests | `Verified` for reporting split |
| Contribution / cohort | Deposit month, legal reform cohort, employer-period cohort where rights depend on it | Later retirement election itself | `Strongly Supported` |
| Event record | Contribution report, transfer, separation, Form 161 instructions, `רצף` election, withdrawal, commutation | Permanent principal tax basis created before the event | `Strongly Supported` |
| Derived gain/loss segment | Gains, losses, fees, and similar amounts allocated back to preserved source segments | Primitive legal identity of principal | `Inferred` |
| Payout-side tax result | `קצבה מוכרת`, `קצבה מזכה`, taxable/ exempt payout result | Stored principal bucket from day one | `Strongly Supported` |

### A2. The critical distinctions

1. `תשלומים פטורים` versus `קצבה מוכרת`

`תשלומים פטורים` behaves like a tax subcomponent of contributed principal. The official CMA 2021 employers interface requires reporting exempt and non-exempt payments for each legal account component. By contrast, the Tax Authority's pension materials describe `קצבה מוכרת` as a later pension classification arising from taxed / non-benefited contributions and explicitly distinguish it from `קצבה מזכה`. The safer ontology is therefore:

- principal layer: `תשלומים פטורים` or other tax-basis layer;
- later derived payout result: `קצבה מוכרת`.

Confidence: `Strongly Supported`.

2. Legal account components versus tax subcomponents

The official CMA circular treats `תגמולי עובד`, `תגמולי מעסיק`, and `פיצויים` as the legal account components. It separately requires exempt / non-exempt detail within each component. Therefore the tax split is not the same layer as the legal component.

Confidence: `Verified`.

3. Contribution date versus legal reform cohort

The current official reporting rule clearly uses contribution month / work month as an event fact. The broader pre/post reform cohorts identified in the first pass remain important, but this pass did not re-verify their exact current carry fields from an official consolidated legal text or current schema. Raw date and legal cohort should not be collapsed into one fact.

Confidence: `Strongly Supported` for the distinction; `Unresolved` for the exact live transmission fields.

4. Severance origin versus later `רצף` status

`פיצויים` origin is a principal/component fact. `רצף פיצויים` and `רצף קצבה` arise only after a separation event and later instructions or approvals. They are event-created statuses, not original attributes of the contribution itself.

Confidence: `Strongly Supported`.

5. `חשבון חדש` as container versus tax identity of the money inside it

Current official material proves that `חשבון חדש` matters as a separate account/container reference in the tax system and in the CMA definition of `תשלומים פטורים`. It does not, in the evidence collected here, prove that opening a `חשבון חדש` erases every earlier tax attribute of the money inside it. Treating container status as identical to full tax identity is unsafe.

Confidence: `Strongly Supported`.

6. Gains by component versus gains by tax layer

Official evidence explicitly supports attribution of account balances, reports, and comparisons by legal account component. It does not yet explicitly show the current institution-side formula for carrying gains by every tax sublayer. That deeper tax-layer attribution is a necessary inference if `תשלומים פטורים` and non-exempt money coexist.

Confidence: `Verified` for component-level attribution pressure; `Inferred` for full tax-layer attribution.

7. Preserved transfer facts versus receiving-institution recomputation

Current official / operational transfer evidence shows that transfer uses a dedicated `ממשק ניוד`, with Excel/XSD-defined fields, and that transfer-related balances and returns matter. But the current pass could not obtain the live official XSDs themselves. Some facts are clearly preserved and transmitted; some later tax results may be recomputed by the receiving institution from preserved source facts.

Confidence: `Strongly Supported`.

8. Money-internal rights versus person-level eligibility conditions

Age, disability, low-income status, and similar conditions are not money-internal layers. They are external facts evaluated when a withdrawal, pension exemption, or benefit is requested.

Confidence: `Strongly Supported`.

## B. Candidate Unit-of-Identity Analysis

### B1. Central answer

The current evidence does not support a single universal atom such as "the individual contribution" or "the whole account."

The smallest legally and operationally meaningful unit currently supported by evidence is a:

`homogeneous rights-bearing balance segment`

This segment is not defined by one dimension alone. It must remain separate whenever any of the following differ and still affect future rights:

- legal account component;
- tax subcomponent within that component;
- employer-period / separation cohort for severance-related money;
- legal reform cohort where the rule still distinguishes old and new money;
- later event-created status such as `רצף`.

Where those dimensions are the same, aggregation appears legally safer. Where they differ, aggregation risks loss of rights or wrong tax treatment.

Confidence: `Strongly Supported`.

### B2. Candidate-unit review

| Candidate unit | Result | Why it is too coarse or too fine | Confidence |
| --- | --- | --- | --- |
| Individual contribution | Not proven as the universal minimum | Current official reporting requires detailed segmentation, but the evidence does not show that each contribution must keep a separate lifelong identity once it is homogeneous across all legally relevant dimensions | `Unresolved` |
| Contribution cohort | Supported only when the cohort matches a legally relevant distinction | A generic cohort is too vague; a rule-sensitive cohort can matter | `Strongly Supported` |
| Annual cohort | Sometimes relevant, not sufficient as a general atom | Annual records matter in transfer history, but annual grouping alone does not preserve component, tax, or severance-election differences | `Operationally Supported` |
| Employer-period cohort | Necessary for severance money | Official CMA material requires severance-balance information by the employer's liability period and the Tax Authority later revisits prior-employer events | `Verified` for relevance |
| Account component | Necessary but insufficient | Current official reporting requires exempt / non-exempt separation within each component | `Verified` |
| Tax subcomponent | Necessary but still insufficient alone | Severance money can require prior-employer / later-election separation even within a single tax subcomponent | `Strongly Supported` |
| Accumulated balance segment | Closest match to the current evidence | This is the smallest unit that can remain legally meaningful after aggregation, as long as it stays homogeneous across the rule-relevant dimensions | `Strongly Supported` |
| Account | Too coarse | Current official reporting and reconciliation rules require multiple coexisting component and tax values inside one account | `Verified` |

### B3. Practical reading of the answer

For ordinary ongoing money, the minimum supported unit is at least:

- `legal account component` × `tax subcomponent`.

For severance-related money, the minimum supported unit expands to at least:

- `legal account component` × `tax subcomponent` × `employer-period / separation cohort` × `later severance-election status`.

For legacy money, the minimum unit may also need:

- `legal reform cohort`.

This is why no single fixed atom is yet safe to canonicalize across the whole lifecycle.

## C. Persistence and Transfer Matrix

| Fact | Belongs to | Nature | Preserve at what granularity | Which rule proves the granularity matters | Institution duty | What if multiple values coexist in one account? | Aggregate safely? | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Product type | Product / account | Intrinsic until transfer | Product / account level | Transfer interface exists specifically for moving money between pension products and institutions; retirement rules differ by product type | Store, transfer, report | Different products stay as separate accounts or transfer histories | Not across product types | `Strongly Supported` |
| Legal account component (`תגמולי עובד`, `תגמולי מעסיק`, `פיצויים`) | Account component | Intrinsic and permanent principal fact | Separate component ledger | Official CMA 2021 circular defines `מרכיבי חשבון` and requires reporting rate and amount for each one | Store, calculate, transfer, report | Coexistence is expected and must stay separate | No | `Verified` |
| `תשלומים פטורים` versus non-exempt payments | Tax subcomponent within account component | Intrinsic principal tax fact | At least component × exempt/non-exempt | Official CMA 2021 circular requires exempt and non-exempt detail for each account component | Store or at least preserve, transfer, report | May coexist within one component | Only within same component and same tax status | `Verified` for reporting split; `Strongly Supported` for long-term preservation |
| Contribution month / work month | Contribution / event record | Event-created report fact | Contribution report row or cohort | Official CMA 2021 circular requires reporting the work month and salary basis for deposits | Store, report | Different months coexist routinely | Only where no later rule distinguishes them | `Verified` for reporting fact |
| Legal reform cohort | Contribution cohort | Intrinsic and permanent | Reform-sensitive cohort | First pass found explicit pre/post cohort rules, but this pass did not re-obtain current official consolidated text | Store or preserve if applicable; transfer likely | Old and new money may coexist | Not if the rule distinguishes them | `Unresolved` in this pass |
| Employer-liability period for severance | Employer relationship / cohort | Intrinsic to severance origin | Employer-period cohort | Official CMA 2021 circular requires severance-balance information with reference to the employer's liability period and enough to fill Form 161 | Store, calculate, report, likely transfer | Different prior-employer cohorts can coexist in one account | No | `Verified` |
| Severance origin (`פיצויים`) | Account component / employer relationship | Intrinsic principal fact | Separate severance segment | Same CMA circular and related employer/judiciary materials treat severance balances separately from other money | Store, transfer, report | Can coexist with reward components | No | `Verified` |
| `רצף פיצויים` / `רצף קצבה` / leave-for-pension choice | Event record tied to severance cohort | Event-created, changeable | At least prior-employer severance cohort | Form 161 page says employer and worker choices direct fund characterization; Form 161ג page shows the status can later be reversed and must refer back to prior employer events and transferred money | Store as event/status record, transfer enough support, evaluate on request | Different severance cohorts may carry different later statuses | No | `Strongly Supported` |
| `חשבון חדש` | Account container, not necessarily the entire tax identity | Event-created | Account / transferred segment | Official CMA definition of `תשלומים פטורים` expressly excludes money transferred to `חשבון חדש`; official tax materials treat it as a distinct account concept | Store, transfer, report | A `חשבון חדש` can still contain money whose earlier tax basis matters | Not safe to treat as one total tax bucket | `Strongly Supported` |
| Gains / losses / fees | Derived gain/loss segment | Derived from preserved source facts | At least by preserved source segment; explicitly by component, likely finer where tax layers differ | Official CMA 2021 circular requires component-level reconciliation; transfer materials separately care about balances and returns | Calculate, store derived amounts, transfer, report | Gains from different preserved source segments must remain attributable | Only within same source segment | `Inferred` |
| `קצבה מוכרת` | Payout-side tax result | Derived at realization from earlier tax basis and person-level conditions | Not shown as a required principal storage unit in this pass | Official pension guidance says recognized pension is pension arising from taxed / non-benefited contributions and is distinct from `קצבה מזכה` | Calculate or evaluate when pension / benefit is requested; may report | Can coexist with `קצבה מזכה` in the same pension stream | Not a principal aggregation key | `Strongly Supported` |
| Person-level eligibility facts (`גיל הזכאות`, age 60, disability, low income) | Person | External at realization time | Person/event level, not money level | Official Tax Authority service pages define benefits using age, first pension date, disability, income, and similar facts | Evaluate when benefit requested; sometimes collect documents | Multiple external facts can apply simultaneously | Not a money-internal layer at all | `Strongly Supported` |
| Transfer lineage | Event record plus preserved source facts | Event-created plus preserved history | Segment-level where rights differ | Uniform-structure transfer materials define a dedicated transfer interface and require field-defined transfer data; official 2022 change note adds balance-and-return information during delayed transfer | Store, transfer, sometimes recompute derived outcomes | Mixed histories can arrive in one receiving account | Only if fully homogeneous after transfer | `Strongly Supported` |

### C1. The transfer boundary

The safest reading of the current evidence is:

- receiving institutions do not need every future tax result transferred as a ready-made label;
- but they do need enough preserved source facts to recompute those results later;
- current official evidence clearly proves this for component identity, exempt/non-exempt split, and severance-period information;
- it is still not verified from current official XSDs exactly which finer tax-history fields are explicitly transmitted in the live transfer schema.

## D. Facts Stored Versus Facts Derived

### D1. Facts that current evidence says institutions must preserve directly

- Legal account components.
- Exempt and non-exempt amounts within each legal component.
- Deposit reporting context such as work month and salary basis.
- Severance balances by employer liability period, at least enough for Form 161 and redemption value.
- Product / account container identity.
- Transfer-event history and transfer-related balance/return data in at least some transfer scenarios.

Confidence: `Verified` to `Strongly Supported`, depending on row.

### D2. Facts that are best understood as event records rather than money-internal principal layers

- Separation from a specific employer.
- Employer and worker instructions in the Form 161 process.
- `רצף פיצויים` / `רצף קצבה` choices and later reversals.
- Withdrawal, commutation, and transfer events.

Confidence: `Strongly Supported`.

### D3. Facts that are best understood as derived rather than stored as primitive money identity

- Gain / loss / fee segments.
- Payout-side `קצבה מוכרת`.
- Taxable gain portion on later withdrawal / commutation.

Confidence: `Inferred` to `Strongly Supported`.

### D4. Facts that appear to be evaluated when a benefit is requested rather than carried by the money

- Age 60 for recognized-pension exemption.
- `גיל הזכאות`.
- Disability-based early retirement.
- Low-income and hardship conditions.
- Aggregate pension and prior-realization interactions.

Confidence: `Strongly Supported`.

## E. Evidence Gaps

1. The current official CMA `מבנה אחיד` Excel/XSD attachments for `ממשק ניוד`, `ממשק פיצויים`, and related interfaces were not directly obtainable here.

2. Direct official consolidated legal text for the exact current wording of section 23, section 9א, and the detailed recordkeeping regulations was not obtained in this pass. The first pass used mirrored legal text, which is not enough for `Verified`.

3. The current official form instructions for 161, 161ד, and 161ג were only available here through official service-page summaries / indexed snippets, not full official instruction files.

4. No current official source was obtained that explicitly states whether receiving institutions store an explicit principal field equivalent to `קצבה מוכרת`, or instead recompute it from preserved `תשלומים פטורים` and later pension events.

5. No current official source was obtained that fully resolves how gains inside a `חשבון חדש` are attributed when multiple historical tax bases coexist.

6. The current pass did not verify the exact current field set, if any, for carrying `רצף`-related tax history through transfer rather than by later document submission.

## F. Conclusions That Remain Unsafe to Canonicalize

1. That the universal unit of identity is the `individual contribution`.

2. That the universal unit of identity is the `account`.

3. That `קצבה מוכרת` is a stored principal bucket from the day money enters the fund.

4. That `חשבון חדש` alone tells you the full tax identity of the money inside it.

5. That component-level gain attribution automatically proves full tax-layer gain attribution in every scenario.

6. That a single account-level `רצף` flag is sufficient when money from multiple employers coexists.

7. That all legally relevant tax-history fields are explicitly transferred in current live schemas rather than partly recomputed by the receiving institution.

8. That raw contribution date and legal reform cohort are interchangeable facts.

## Source Notes

Primary and official sources used in this pass:

- [O1] Capital Market Authority / `gov.il` official PDF: `אופן הפקדת תשלומים לקופת גמל - עדכון`, circular `2021-9-8`.
  URL: https://www.gov.il/BlobFolder/dynamiccollectorresultitem/reg_2021-9-8/he/%D7%90%D7%95%D7%A4%D7%9F%20%D7%94%D7%A4%D7%A7%D7%93%D7%AA%20%D7%AA%D7%A9%D7%9C%D7%95%D7%9E%D7%99%D7%9D%20%D7%9C%D7%A7%D7%95%D7%A4%D7%AA%20%D7%92%D7%9E%D7%9C%20-%20%D7%A2%D7%93%D7%9B%D7%95%D7%9F.pdf
- [O2] Tax Authority service page: `הודעה על פרישה מעבודה (טופס 161 חדש)`.
  URL: https://www.gov.il/he/service/notice-of-retirement
- [O3] Tax Authority service page: `בקשה לחזרה מרצף פיצויים ורצף קצבה... (טופס 161ג)`.
  URL: https://www.gov.il/he/service/compensation-and-annuity-sequence
- [O4] Tax Authority service page: `בקשה לקיבוע זכויות - פטור ממס על הקצבה המזכה או היוון קצבה מזכה (טופס 161ד)`.
  URL: https://www.gov.il/he/service/itc-request-for-fixed-rights-at-retirement-age
- [O5] Judiciary / `gov.il` service page: `בקשה של מעסיקים למשיכת כספים מקופות פיצויים לעובדים`.
  URL: https://www.gov.il/he/service/employer_request_to_release_compensation
- [O6] Official tax publication hosted on `gov.il`: `דע את זכויותיך וחובותיך 2018`, indexed snippet for page 52 on `קצבה מוכרת`.
  URL: https://www.gov.il/files/taxes/KnowYourRights2018/files/basic-html/page52.html
- [O7] Official tax publication hosted on `gov.il`: indexed snippet for page 51 / 56, used only for support on pension / severance interaction.
  URLs:
  - https://www.gov.il/files/taxes/KnowYourRights2018/files/basic-html/page51.html
  - https://www.gov.il/files/taxes/KnowYourRights2018/files/basic-html/page56.html

Secondary / operational sources used only below the official layer:

- [S1] Kol Zchut: employer digital reporting page summarizing current reporting fields and linking to CMA circulars.
  URL: https://www.kolzchut.org.il/he/%D7%93%D7%99%D7%95%D7%95%D7%97_%D7%9E%D7%A7%D7%95%D7%95%D7%9F_%D7%A9%D7%9C_%D7%9E%D7%A2%D7%A1%D7%99%D7%A7_%D7%A2%D7%9C_%D7%94%D7%A4%D7%A7%D7%93%D7%95%D7%AA_%D7%9C%D7%91%D7%99%D7%98%D7%95%D7%97_%D7%A4%D7%A0%D7%A1%D7%99%D7%95%D7%A0%D7%99_%D7%9C%D7%A7%D7%A8%D7%9F_%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA_%D7%95%D7%9C%D7%A7%D7%95%D7%A4%D7%AA_%D7%92%D7%9E%D7%9C
- [S2] Funder copy / publication of `מבנה אחיד להעברת מידע ונתונים בשוק החיסכון הפנסיוני`, including the `ממשק ניוד` description and XSD-link references.
  URL: https://www.funder.co.il/article/100347
- [S3] Mirrored 2022 CMA `מבנה אחיד` update document hosted by Kol Zchut, used only as operational support where current official attachments were unavailable.
  URL: https://www.kolzchut.org.il/w/he/images/e/ea/%D7%97%D7%95%D7%96%D7%A8-%D7%9E%D7%91%D7%A0%D7%94-%D7%90%D7%97%D7%99%D7%93_08.02.22.docx
