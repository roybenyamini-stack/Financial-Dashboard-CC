# Provident Fund Money Layers Discovery

Date: 2026-07-19

Scope: discovery only. This report does not propose a data model, implementation, UI, or architecture.

Method note: direct official legislative pages were not reliably fetchable in this environment. Where possible, this report uses official Israeli government service pages and publications. For statute and regulation text, it uses current Wikisource mirrors of Israeli legal texts as a strong but non-official text source. Confidence levels reflect that distinction.

Evidence-status legend:

- Legally explicit: stated in statute or regulation text.
- Official administrative: stated in an official government service page or publication, but not itself the controlling legal text.
- Operationally supported: required by recordkeeping / transfer / reporting rules.
- Inferred: not directly stated in a controlling source, but strongly implied by the sourced rules.
- Unknown: still unresolved after this pass.

## A. Executive Summary

The evidence does not support a model in which money inside an Israeli provident fund can be understood as just a small set of tax buckets.

At minimum, the money appears to carry multiple overlapping layers:

- the statutory product/account type in which it sits;
- the contribution source and legal account component (`מרכיב תגמולי מעביד`, `מרכיב תגמולי עובד`, `מרכיב הפיצויים`, and for some self-employed money `מרכיב חיסכון למצב אבטלה`);
- the historical contribution cohort, especially by contribution date and reform era;
- the tax basis of the contributed principal, including whether it is within ordinary tax-favored limits, already taxed, or treated as `תשלומים פטורים`;
- event-created statuses such as `רצף פיצויים`, `רצף קצבה`, and `חשבון חדש`;
- the lineage of gains, losses, fees, and insurance-cost deductions back to the relevant principal layers;
- transfer continuity rules that preserve dates, component identity, and annual records across `ניוד`;
- external person-level facts such as age, disability, low income, death, beneficiary status, retirement status, and aggregate pension amounts, which activate or deactivate rights that are not inherent in the money alone.

The strongest supported conclusion is that some rights are inherent in the money's legal and tax history, while other rights are contingent on facts outside the fund. A system deciding what can happen to a given amount therefore needs both:

- money-internal lineage; and
- person/event-level eligibility facts.

The evidence also strongly supports that investment returns and expenses are not a single undifferentiated pool: the rules require recordkeeping and attribution by component and subcomponent, and transfer rules require those records to move with the money. [S1] [S3] [S4]

## B. Candidate Money Layers / Attributes

1. Statutory product or account type.
2. Contribution source and legal component.
3. Historical contribution cohort by deposit date / reform era.
4. Tax basis of contributed principal.
5. Severance-disposition status at and after separation from employment.
6. `חשבון חדש` status.
7. Gain / loss / fee lineage.
8. Transfer continuity lineage.
9. External eligibility facts that gate realization rights.

## C. Evidence Table for Each Candidate Layer

### 1. Statutory Product or Account Type

- Proposed attribute name: statutory product/account type.
- Plain-language meaning: the legal kind of provident-fund container in which the amount currently sits.
- The question it answers: is this amount in a `קופת גמל לקצבה`, `קופת גמל לתגמולים`, `קופת גמל לפיצויים`, `קרן ותיקה`, `קופת גמל לחיסכון`, insurance policy, or other legally distinct product?
- Level: product; account.
- When the attribute is created: when the account/product is opened or when money is transferred into a different product type.
- Which source or event determines it: fund approval and account opening; later `ניוד` between product types.
- Whether it is permanent or may change: may change on transfer, but the old type can remain historically relevant because transfer rules preserve records and dates.
- Which events or decisions depend on it: whether money is payable as pension, whether lump-sum routes exist, whether low-balance withdrawal rules apply, which transfer routes are legal, and whether special legacy cohorts exist.
- Relevant evidence:
  - The provident-fund law defines distinct fund types such as `קופת גמל לקצבה`, `קופת גמל לתגמולים`, `קופת גמל לפיצויים`, `קרן ותיקה`, and others. [S1]
  - Transfer regulations enumerate which product-to-product transfers are lawful. [S4]
- Confidence level: Verified.
- Open questions / contradictions:
  - The current law text shows the old definitions of `קופת גמל משלמת לקצבה` and `קופת גמל לא משלמת לקצבה` as deleted. [S1]
  - Current official CMA terminology for the post-deletion product vocabulary still needs direct primary confirmation from a current CMA circular or specification.

### 2. Contribution Source and Legal Component

- Proposed attribute name: contribution source / legal component.
- Plain-language meaning: who paid the money, and into which legal component of the account it was posted.
- The question it answers: is this amount employer rewards, employee rewards, employer severance money, self-employed money, or self-employed unemployment-savings money?
- Level: contribution; tax layer / balance segment.
- When the attribute is created: at contribution allocation.
- Which source or event determines it: employer payroll allocation, employee deduction, self-employed deposit, and fund recordkeeping rules.
- Whether it is permanent or may change: usually persistent; some money later leaves `מרכיב הפיצויים` and becomes a `חשבון חדש`.
- Which events or decisions depend on it: employer reclaimability, withdrawal paths, insurance-cost deductions, tax treatment, sequence elections, and transfer mapping.
- Relevant evidence:
  - Section 21 authorizes component-level account division by employer payments, employee payments, severance payments, and self-employed unemployment-savings payments. [S1]
  - Regulation 49א requires separate account records for `מרכיב תגמולי מעביד`, `מרכיב תגמולי עובד`, and `מרכיב הפיצויים`. [S3]
- Confidence level: Verified.
- Open questions / contradictions:
  - A current machine-readable field list from the CMA or pension clearinghouse is still needed to confirm the exact present-day operational labels transmitted between institutions.

### 3. Historical Contribution Cohort by Deposit Date / Reform Era

- Proposed attribute name: historical contribution cohort.
- Plain-language meaning: the legal regime attached to the money because of when it was contributed.
- The question it answers: does this amount fall into an older cohort with special lump-sum rights or recordkeeping rules?
- Level: historical contribution cohort; contribution; balance segment.
- When the attribute is created: when the contribution enters the fund.
- Which source or event determines it: contribution date and product/date combination.
- Whether it is permanent or may change: permanent.
- Which events or decisions depend on it: whether employee money can be taken as a lump sum, whether self-employed money can be taken after 15 years or age 60, and how records must be separated.
- Relevant evidence:
  - For an employee, section 23 preserves a lump-sum path for funds deposited before 1 January 2000, subject to age or job-separation conditions. [S1]
  - For a self-employed member, section 23 preserves separate legacy rules for certain pension-fund and insurance contributions before 30 April 1997 / 1 January 2000. [S1]
  - Regulation 38 distinguishes self-employed money deposited through 31 December 2005 from money deposited from 1 January 2006 onward. [S3]
  - Regulation 49א requires separate records in pension provident funds for amounts paid through 31 December 1999 and amounts paid from 1 January 2000 onward. [S3]
- Confidence level: Verified.
- Open questions / contradictions:
  - The full live set of currently relevant historical cohorts in provider systems still needs confirmation from current operational specifications.

### 4. Tax Basis of Contributed Principal

- Proposed attribute name: tax basis of principal.
- Plain-language meaning: whether tax was deferred, already paid, or specially characterized on the way in.
- The question it answers: is this principal ordinary pension money, `תשלומים פטורים`, `תשלומי הפקדה מוטבת`, `תשלומים חייבים`, or taxed severance money?
- Level: contribution; tax layer / balance segment.
- When the attribute is created: at contribution, or at certain later tax events affecting severance money.
- Which source or event determines it: payroll/tax law, contribution size relative to recognized limits, and tax treatment at severance events.
- Whether it is permanent or may change: the basis of the principal is effectively permanent; later events may create derived layers on top of it.
- Which events or decisions depend on it: whether later pension is `קצבה מוכרת`, whether some withdrawals are exempt, and how commutation gains are taxed.
- Relevant evidence:
  - Section 9א defines `קצבה מוכרת` as the part of a pension from a non-veteran pension provident fund that arises from `תשלומים פטורים`. [S2]
  - The same section defines `תשלומים פטורים`, including employer and employee contributions above certain tax-favored limits and employer severance contributions already taxed as salary under section 3(ה3). [S2]
  - Regulation 49א requires separate records in non-pension provident funds between `תשלומי ההפקדה המוטבת` and `תשלומים חייבים`, and in pension provident funds it requires date-based and employer-threshold separations. [S3]
  - Section 9(7א)(א1) creates a special taxed-severance layer whose gains are then taxed under a separate rule. [S2]
- Confidence level: Strongly Supported.
- Open questions / contradictions:
  - `תשלומים פטורים` is clearly a legal tax term; `קצבה מוכרת` is a payout-side consequence of that tax basis, not necessarily the best name for the principal layer itself.
  - Current provider balance labels for these layers still need direct operational evidence.

### 5. Severance-Disposition Status at Separation

- Proposed attribute name: severance-disposition status.
- Plain-language meaning: what legal/tax path was chosen or imposed for severance money after leaving a job.
- The question it answers: was severance money withdrawn, left for pension, placed on `רצף פיצויים`, placed on `רצף קצבה`, or deemed left for pension absent contrary notice?
- Level: person; employer-separation cohort; tax layer / balance segment.
- When the attribute is created: on separation from a specific employer and the related tax election.
- Which source or event determines it: separation from employment, Tax Authority election, employer rights, and later reversal requests.
- Whether it is permanent or may change: may change in legally defined ways.
- Which events or decisions depend on it: immediate tax, future exemption use, future commutation rights, treatment of gains, and whether funds become part of a later retirement grant.
- Relevant evidence:
  - Section 9(7א)(4) creates `רצף פיצויים`, treats gains on the deferred grant as part of the later grant, and allows reversal within two years. [S2]
  - The Tax Authority's `161ג` service page confirms that `רצף פיצויים` and `רצף קצבה` are tracked statuses that can later be changed or used on a later separation event, and that the member may need transfer confirmations if the money was moved between funds. [S10]
  - The courts/government service for employer release of severance money confirms that employer withdrawal rights depend on labor-law conditions and whether the money is also pension-designated. [S9]
- Confidence level: Strongly Supported.
- Open questions / contradictions:
  - The exact boundary between `רצף קצבה`, "left for pension", and the default deemed leave-for-pension rule needs direct form instructions or circular text beyond the service summaries.

### 6. `חשבון חדש` Status

- Proposed attribute name: `חשבון חדש` status.
- Plain-language meaning: money has been moved into a special no-further-deposits account created by statute.
- The question it answers: is this amount sitting in a special post-event account with its own legal consequences?
- Level: account; tax layer / balance segment.
- When the attribute is created: when eligible severance money or beneficiary money is transferred into a `חשבון חדש`.
- Which source or event determines it: post-tax severance transfer under section 23(א)(2א), or beneficiary transfer under section 23(א)(2ב).
- Whether it is permanent or may change: effectively permanent as an account status until realization.
- Which events or decisions depend on it: whether new deposits are allowed, whether the money is still treated as `מרכיב הפיצויים`, and later tax treatment on withdrawal or annuitization.
- Relevant evidence:
  - Section 23(א)(2א) allows severance money to move to a new account after tax withholding, forbids further deposits into that account, and states that the money will no longer be regarded as part of `מרכיב הפיצויים` for section 23. [S1]
  - Section 23(א)(2ב) creates the same structure for money transferred to a beneficiary. [S1]
  - Section 9א refers back to `חשבון חדש` in the definitions of `תשלומים פטורים` and in rules for commutation of recognized annuity. [S2]
- Confidence level: Verified.
- Open questions / contradictions:
  - The exact operational treatment of mixed-source gains inside a `חשבון חדש` still needs current tax guidance or provider calculations.

### 7. Gain / Loss / Fee Lineage

- Proposed attribute name: gain / loss / fee lineage.
- Plain-language meaning: returns, losses, fees, and certain insurance-cost deductions follow underlying balance segments rather than becoming legally anonymous.
- The question it answers: to which principal layer do the gains, losses, and charges belong?
- Level: derived balance segment.
- When the attribute is created: each time returns, losses, fees, or insurance costs are booked.
- Which source or event determines it: statutory recordkeeping and attribution rules.
- Whether it is permanent or may change: continuously updated; its lineage remains tied to the component/subcomponent structure.
- Which events or decisions depend on it: proportional tax on partial withdrawals, recognized-annuity commutation tax, transfer continuity, and correct benefit calculation.
- Relevant evidence:
  - Section 21 expressly authorizes instructions about attributing gains and expenses and deducting charges among components. [S1]
  - Regulation 49ב requires gains to be attributed at least monthly by the relative balances of the components. [S3]
  - Regulation 49ג does the same for expenses. [S3]
  - Regulation 49ד requires insurance-cost deductions to be taken proportionally from all components except `מרכיב הפיצויים`. [S3]
  - Section 9(7א)(א1)(2) treats a partial withdrawal of certain taxed severance amounts as including gains proportionally. [S2]
  - Section 9א(ה)(3) taxes only the relative gain component on commutation of recognized annuity that is not fully exempt. [S2]
- Confidence level: Strongly Supported.
- Open questions / contradictions:
  - The exact ordering algorithm for partial withdrawals from mixed segments is not yet directly sourced.
  - Current provider implementation formulas still need verification from current forms, schemas, or circulars.

### 8. Transfer Continuity Lineage

- Proposed attribute name: transfer continuity lineage.
- Plain-language meaning: the money keeps legally relevant history when it moves.
- The question it answers: which attributes survive `ניוד` between funds, products, or internal tracks?
- Level: account history; contribution cohort; balance segment.
- When the attribute is created: at transfer.
- Which source or event determines it: transfer regulations and record-transfer rules.
- Whether it is permanent or may change: permanent once transferred; the lineage is the point of the rule.
- Which events or decisions depend on it: preservation of contribution dates, status as employee/self-employed money, component continuity, and tax continuity.
- Relevant evidence:
  - Transfer regulations state that on most inter-fund transfers, all payment dates in the transferring fund are treated as the payment dates in the receiving fund. [S4]
  - For relevant transfer routes, those regulations also require the receiving account to preserve the member's status and the source account's component structure under section 21. [S4]
  - Regulation 49ד1 requires the transferring fund to pass all annual account records to the receiving fund. [S3]
  - Regulation 33ב allows internal movement between investment tracks; it does not state a reclassification of the legal layers, which strongly suggests that the legal layers survive while only the investment track changes. [S3]
- Confidence level: Verified for inter-fund transfer; Inferred for internal track change.
- Open questions / contradictions:
  - A current CMA `מבנה אחיד` schema is still needed to identify the exact live transmitted fields and any provider-specific constraints.

### 9. External Eligibility Facts

- Proposed attribute name: external eligibility facts.
- Plain-language meaning: person-level or event-level facts outside the balance itself that activate or block a realization path.
- The question it answers: does the person currently satisfy a condition that makes a withdrawal, pension, commutation, or tax exemption available?
- Level: person; beneficiary; event.
- When the attribute is created: when the external fact arises.
- Which source or event determines it: age, disability rulings, income level, medical spending, death, beneficiary status, retirement, aggregate pension amounts, unemployment as a self-employed member.
- Whether it is permanent or may change: usually may change.
- Which events or decisions depend on it: hardship withdrawals, low-income withdrawals, recognized-annuity exemption after age 60, `קצבה מזכה` exemption at `גיל הזכאות`, self-employed unemployment withdrawals, small-balance commutation, beneficiary transfer.
- Relevant evidence:
  - Tax Authority service `159א` ties low-income withdrawal to the member's and spouse's monthly income and family status. [S6]
  - Tax Authority service `159` ties hardship withdrawal to disability or high medical expenses of the member or close relatives. [S7]
  - Section 23 and regulation 34 tie non-pension withdrawals from pension money to health/economic conditions, disability, and other external statuses. [S1] [S3]
  - Tax Authority service `161ד` defines `גיל הזכאות`, `קצבה מזכה`, and commutation in a way that depends on age, first pension receipt, and disability retirement. [S8]
  - Section 9א makes the exemption for `קצבה מוכרת` depend on the person being at least age 60 or a qualifying early-disability retiree. [S2]
  - Section 23(ב3) adds self-employed unemployment status as a trigger for special withdrawal rights tied to mandatory self-employed pension contributions. [S1]
- Confidence level: Verified.
- Open questions / contradictions:
  - These facts are clearly necessary to decide rights, but many are not intrinsic attributes of the money itself. A later phase should separate "money-carried facts" from "external eligibility facts the system must also know."

## D. Lifecycle Events Used to Reveal or Test the Layers

These events were used only to reveal underlying layers, not as the organizing model:

- Contribution and payroll allocation:
  - Reveals component, source, product type, tax basis, and historical cohort. [S1] [S3]
- Monthly gains / losses / expenses:
  - Reveals that returns and expenses are attributed across components and subcomponents rather than pooled without lineage. [S1] [S3]
- Internal investment-track change:
  - Suggests that legal/tax layers persist while investment allocation changes. [S3]
- Transfer between funds (`ניוד`):
  - Reveals that dates, status, and annual records must survive transfer. [S3] [S4]
- Separation from employment / retirement:
  - Reveals severance-specific layers, employer rights, and `רצף` elections. [S2] [S9] [S10]
- Hardship / low-income withdrawal:
  - Reveals that some realization rights depend on external eligibility rather than solely on principal history. [S6] [S7] [S3]
- Commutation / pension start:
  - Reveals the difference between `קצבה מזכה`, `קצבה מוכרת`, and the role of `תשלומים פטורים`. [S2] [S8]
- Death / beneficiary payment:
  - Reveals beneficiary-created `חשבון חדש` and survivor treatment of money stemming from `תשלומים פטורים`. [S1] [S2]
- Self-employed unemployment:
  - Reveals the distinct `מרכיב חיסכון למצב אבטלה`. [S1]

## E. Terminology Map

| Term | Observed meaning / relationship |
| --- | --- |
| `קופת גמל לקצבה` | Pension provident-fund form intended to pay a pension. Not every amount in it is necessarily homogeneous. [S1] |
| `קופת גמל לתגמולים` | Rewards provident fund; older/legacy lump-sum pathways still attach to some money in this category. [S1] [S3] |
| `קופת גמל לפיצויים` | Provident fund intended for severance compensation. [S1] |
| `מרכיב תגמולי מעביד` / `מרכיב תגמולי עובד` / `מרכיב הפיצויים` | Legal account components that must be separately recorded. [S1] [S3] |
| `מרכיב חיסכון למצב אבטלה` | A distinct self-employed unemployment-savings component referenced in the law. [S1] |
| `תשלומים פטורים` | A tax-basis term in section 9א. It is not just "tax-free money"; it means defined kinds of already-taxed or specially characterized contributions. [S2] |
| `קצבה מוכרת` | The part of a pension from a non-veteran pension provident fund that arises from `תשלומים פטורים`. This is a payout-side concept grounded in the contribution tax basis. [S2] |
| `קצבה מזכה` | A different pension concept used for retirement-age pension exemption rules; official service pages explicitly contrast it with `קצבה מוכרת`. [S8] |
| `חשבון חדש` | A new no-further-deposits account created for certain post-tax severance or beneficiary transfers; the transferred money stops being `מרכיב הפיצויים` for section 23 purposes. [S1] |
| `רצף פיצויים` | Deferral path for severance grants across employers; gains remain associated with that deferred grant. [S2] [S10] |
| `רצף קצבה` | A separate severance-related status recognized by the Tax Authority service workflow. [S10] |
| `סכום צבירה מזערי` / `סכום קצבה מזערי` | Aggregate thresholds used to determine certain lump-sum / commutation rights. These are not purely money-internal; they depend on cross-account pension facts. [S1] |

## F. Contradictions and Unresolved Questions

1. Official-service typo:
   - The Tax Authority `161ד` page refers to section 23 of the provident-fund law as `התשס"ה-2025`. The law is the 2005 law, not a 2025 enactment. This appears to be a page error, not a legal change. [S8]

2. Legal layer versus payout label:
   - The law clearly defines `תשלומים פטורים` and `קצבה מוכרת`, but the evidence is not yet sufficient to say that provider systems store `קצבה מוכרת` as a principal bucket from the first day. It may instead be computed from a principal layer labeled `תשלומים פטורים` plus later events. [S2]

3. Ordering of partial withdrawals:
   - The evidence strongly supports component-level and subcomponent-level recordkeeping, but this pass did not locate a direct current primary source that states the exact ordering rule for partial withdrawals from mixed balances.

4. Internal track changes:
   - The evidence strongly suggests that investment-track changes preserve the legal/tax layers, but this report treats that as inferred rather than fully verified until a direct current CMA operational source is reviewed. [S3]

5. Current machine vocabulary:
   - This pass did not yet verify the current `מבנה אחיד` / clearinghouse schema fields for contribution source, taxed basis, `רצף`, `חשבון חדש`, or recognized-annuity lineage.

6. Scope edge:
   - Some rules in the law now refer to `קופת גמל לחיסכון` and `קופת גמל להשקעה`. It remains to be decided whether the research scope is all provident-fund products or only pension provident-fund money held for retirement.

## G. Sources Still Needed

1. Current CMA `מבנה אחיד להעברת מידע ונתונים בשוק החיסכון הפנסיוני` specification or XSDs.
2. Current CMA circular or standard bylaw showing the live product vocabulary after the deletion of old definitions in the statute.
3. Current Tax Authority form instructions for `161א`, `161ד`, and related severance/pension forms, ideally in downloadable form rather than service-page summaries.
4. Any official Tax Authority circular that explains the calculation path from `תשלומים פטורים` to `קצבה מוכרת`, including treatment of partial withdrawals and gains.
5. Current provider or clearinghouse data-spec evidence for how `ניוד` carries tax-history fields in practice.

## H. Proposed Next Research Step

Next step: inspect the current CMA operational specifications and current Tax Authority form instructions to answer three unresolved questions:

1. What exact fields are carried at transfer and at balance-segment level in today's machine interfaces?
2. How do providers operationally represent `תשלומים פטורים`, `קצבה מוכרת`, `חשבון חדש`, and `רצף` states?
3. What is the current official ordering / allocation rule for partial withdrawals from mixed balances?

If those sources confirm the current operational fields, the next discovery pass should produce a second report focused only on:

- persistence across `ניוד`;
- partial-withdrawal ordering;
- recognized-annuity calculation lineage.

## Source List

- [S1] `חוק הפיקוח על שירותים פיננסיים (קופות גמל)` as mirrored on Wikisource; used for sections 21 and 23 and statutory definitions. Source type: legal text mirror, not official publisher.
- [S2] `פקודת מס הכנסה` as mirrored on Wikisource; used for sections 9א, 9(7א), and 87. Source type: legal text mirror, not official publisher.
- [S3] `תקנות מס הכנסה (כללים לאישור ולניהול קופות גמל)` as mirrored on Wikisource; used for regulations 33ב, 34, 38, 49א, 49ב, 49ג, 49ד, and 49ד1. Source type: regulatory text mirror, not official publisher.
- [S4] `תקנות הפיקוח על שירותים פיננסיים (קופות גמל) (העברת כספים בין קופות גמל)` as mirrored on Wikisource. Source type: regulatory text mirror, not official publisher.
- [S5] `תקנות מס הכנסה (כללים בדבר חיוב במס על תשלומים לקרן שלא אושרה ותשלומים שלא כדין)` as mirrored on Wikisource. Source type: regulatory text mirror, not official publisher.
- [S6] Tax Authority service page: `בקשה למשיכת כספי תגמולים מקופת גמל בשל "מיעוט הכנסות" (טופס 159א)`. Source type: official government service summary.
- [S7] Tax Authority service page: `בקשת עמית למשיכת כספי תגמולים ללא ניכוי מס (טופס 159)`. Source type: official government service summary.
- [S8] Tax Authority service page: `בקשה לקיבוע זכויות - פטור ממס על הקצבה המזכה או היוון קצבה מזכה (טופס 161ד)`. Source type: official government service summary.
- [S9] Government/judiciary service page: `בקשה של מעסיקים למשיכת כספים מקופות פיצויים לעובדים`. Source type: official government service summary.
- [S10] Tax Authority service page: `בקשה לחזרה מרצף פיצויים ורצף קצבה... (טופס 161ג)`. Source type: official government service summary.
- [S11] Tax Authority publication `דע את זכויותיך וחובותיך 2018`, page 149, as hosted on `gov.il`. Source type: official government publication.
