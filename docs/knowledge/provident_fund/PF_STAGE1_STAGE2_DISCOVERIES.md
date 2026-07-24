# Provident Fund — Stage 1 / Stage 2 Discoveries

**Status:** Discovery record. Chronological and reasoning-preserving, not a polished ontology. Nothing here is
a ratified decision, a software model, or a persistence design.
**Author:** Claude Code
**Product Owner:** Roy
**Scope:** The discovery progression and reasoning chains of Goose Expedition 3's Stage 1 and Stage 2.

---

## Sources

- `Goose Expedition 3.html` — the earlier conversation.
- `Goose Stage 1 Analysis.html` — the later conversation, continuing directly from Expedition 3's handoff.
- Adjacent repository research, consulted for continuity and referenced rather than restated:
  `PF_MONEY_LAYERS_DISCOVERY_2026-07-19.md`, `PF_ONTOLOGY_AND_PERSISTENCE_DISCOVERY_2026-07-19.md`,
  `PF_TIKUN_190_XML_FIELD_DISCOVERY.md`, `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`,
  `GOOSE_EXPEDITION_3_PROVIDENT_FUND_CLASSIFICATION_IMPLEMENTATION.md`,
  `ECOSYSTEM_FOUNDATION_DISCOVERY.md`. These are separate research threads (legal/regulatory discovery,
  implementation-reality audits) that ran alongside the two conversations below.

Evidence is cited inline as `[Expedition 3]` or `[Stage 1 Analysis]`.

---

## Part A — Goose Expedition 3

### A.1 The Deloitte reclassification — money as allocation, not label

Roy supplied real documents from an actual event: Deloitte identified misclassified money inside real accounts
(Harel and Phoenix policies) and reclassified it. Nothing about the underlying savings changed — not the
deposits, the returns, or the years. What changed was classification alone. Deloitte's own letter used the
word "צבוע" (colored/painted) for the affected funds — the language of money that carries a color, not
ordinary accounting language `[Expedition 3]`.

> "לא אומרים: 'מצאנו כסף חדש.' הם אומרים: 'איתרנו כספים פטורים ... וסיווגם מחדש מכספים חייבים בחלקם לכספים
> פטורים ממס.'"
> *(They don't say "we found new money." They say "we located exempt funds ... and reclassified them from
> partly-taxable to tax-exempt.")* `[Expedition 3]`

The post-reclassification documents from Phoenix and Harel were not transaction logs — they were tables of
**year × account-component × exempt/non-exempt**. The unit is not the deposit; it is the combination of
year + component + classification `[Expedition 3]`.

Deloitte's own reconciliation followed an implicit sequence:

```
אישור מקורי (original certificate)
  ↓
אישור סופי (final certificate)
  ↓
הפרש (difference)
  ↓
שיערוך (revaluation / accretion)
  ↓
תוספת פטורה (exempt addition)
```

Deloitte did not recompute every deposit's return individually — they found an amount that *should have been*
exempt, then computed the return that amount would have produced had it been correctly colored from the
start `[Expedition 3]`. This produced the discovery that reframed the whole model:

```
NOT:  Money has classification
BUT:  Balance allocated between classifications
```

Deloitte did not "change the money." They performed a **reallocation** — the same total balance, re-split
between taxable and exempt portions, total unchanged, only the allocation map changed `[Expedition 3]`. The
candidate atom shifted accordingly: not a Bucket, but an **Allocation Entry** — an allocation of a balance to
a specific classification. The canonical sentence this produced:

> "המציאות הקנונית של נכס אינה רק יתרה אחת. היא הקצאה של היתרה הכוללת בין סיווגים רשמיים."
> *(The canonical reality of an asset is not a single balance. It is an allocation of the total balance among
> official classifications.)* `[Expedition 3]`

This conclusion is Operationally Supported: it comes from one real, fully-documented reclassification case,
not from statute text.

### A.2 Structure versus dictionary

Reading the CMA's Uniform Structure ("מבנה אחיד") circular, the conversation found it explains *how*
information moves between institutions — interfaces, field names, mandatory/optional status, which XML
carries what — but never the business meaning of a coded value. This produced a layering:

```
חוק (Law)
  ↓
מודל עסקי (Business Model)
  ↓
מילון תפעולי (Operational Dictionary)
  ↓
מבנה אחיד (Uniform Structure)
  ↓
XML/XSD
```

The Uniform Structure document sits only in the bottom two layers — "the grammar, not the dictionary"
`[Expedition 3]`. This reframed the search target away from "understand Amendment 190" and toward finding the
official **value dictionary** — code lists, reference tables, value domains — behind enumerated XML fields
(`Sug`, type codes, category codes, status codes). *(This search was later pursued as its own thread — see
`PF_TIKUN_190_XML_FIELD_DISCOVERY.md` and `PF_HOLDINGS_DATA_DICTIONARY_RECOVERY_PHASE_2.md`, both concluding
the dictionary was not publicly recoverable.)*

### A.3 The mobility (ניוד) rules — tax provenance travels with the money

`rules_mobility_ver10.pdf`, a clearinghouse document governing inter-fund transfer, defines an explicit block
the transferring fund must send the receiving fund: `YitrotPturot` ("exempt balances"), containing:

- `SUG-TASHLUM-PATUR` — type of exempt payment
- `MOED-PTUR` — date the exempt amount was created
- `KEREN-TASHLUMIM-PTURIM` — fund of exempt payments
- `KEREN-REVACHIM-TASHLUMIM-PTURIM` — fund of exempt payments with gains, unindexed
- `KEREN-HATZMADA-REVACHIM-TASHLUMIM-PTURIM` — indexed fund of exempt payments with gains

`SUG-TASHLUM-PATUR` must be reported from a predefined, closed value list — confirming the value dictionary
(§A.2) genuinely exists, even though this document doesn't expose it `[Expedition 3]`.

Transfer does not carry only an aggregate balance. It separately carries facts about the exempt payments
themselves — type, creation date, multiple fund/gain/indexation splits, apparently also cut by employer
(`KOD-MAASIK`) `[Expedition 3]`. A second block, for study funds (`YitrotveRevachimHishtalmut`), is structured
as a matrix over status × period × deposit × fund × nominal gain × indexation × employee/employer ×
below/above ceiling — reinforcing that a balance segment's identity is the combination of several axes, not
one `[Expedition 3]`.

> "לא מצאנו עדיין את כל המילון — אבל מצאנו את שם המדף המדויק שבו המילון חייב להיות."
> *(We haven't found the whole dictionary — but we found the exact shelf it must be on.)* `[Expedition 3]`

### A.4 Product-building context

Interleaved with the above, Roy described the product he is building — a personal financial system in which
retirement is one event among several (alongside ongoing finances and investments) — with a retirement tab
(KPIs, income sources, a Harel policy modeled with an inheritance option, a rights-fixation mechanism). Roy had
already modeled קרן פנסיה and ביטוחי מנהלים, and was stuck specifically on קופות גמל `[Expedition 3]`. This is
the motivating context for the investigation, not itself a Stage 1/2 finding.

### A.5 A first look at real annual-report structure

Roy pointed to table ב.2 in a 2023 Altshuler provident-fund report — apparently only two buckets, but amounts
there might carry additional rights not visible from the totals alone (e.g. in a commutation scenario). A
follow-up screenshot showed the money's source was the severance component (מרכיב הפיצויים), not rewards
(תגמולים). Both agreed the observation is date-sensitive — the same structure could carry different meaning at
a different date `[Expedition 3]`. A more developed version of this comparison follows in §B.3.

### A.6 Clearinghouse tax reports carry their own classification layer

Comparing five clearinghouse reports against known annual-report and XML data, two kinds of information
emerged. "Display" information (forecast retirement age, asset summary, insurance coverage, expected pension
amounts) is mostly aggregation and doesn't advance the model. The tax reports are different: the clearinghouse
pre-splits each fund's balance into הוני (capital), קצבתי לפני 2000/1997, and קצבתי חייב — a **different
classification language** from the one already in use (קצבה מזכה / קצבה מוכרת / הון פטור). The Tax Authority
uses its own bucket language, distinct from both the provider's and Goose's working vocabulary
`[Expedition 3]`.

The פיצויים report adds further splits: רצף קצבה עד 31.12.1999, רצף קצבה מ-2000, רצף פיצויים, שווי פיצויים
למעסיק — per product, not present in the ordinary annual report `[Expedition 3]`.

> "אני חושב שהמסלקה עושה בשביל רשות המסים בדיוק את מה שאנחנו מנסים לעשות — לא לחשב מס, אלא לסווג את הכסף."
> *(The clearinghouse is doing, for the Tax Authority, exactly what we're trying to do — not computing tax,
> but classifying the money.)* `[Expedition 3]`

The clearinghouse's tax view is itself a **Classification Tax View**, not the raw balance. This produced the
narrowed question that Stage 1 Analysis (Part B) was created to answer: did the clearinghouse arrive at these
tax-report numbers by field-level mapping from the XML, or by a separate calculation performed specifically
for clearinghouse reporting?

### A.7 Handoff

Facing too many uploaded files and a thread no longer able to resume analysis reliably, both parties agreed a
fresh conversation was the right fix — opening with a "GOOSE BOOT" naming the Stage 1 objective: Inventory &
Structure Analysis over the 17 XML files, XSD files, XLS files, and the תגמולים/פיצויים tax reports. This is
the direct origin of `Goose Stage 1 Analysis.html`.

---

## Part B — Goose Stage 1 Analysis

### B.1 The container-identity discovery — `מספר תיק ניכויים`

On each product's page in the 22-page concentration report (דוח ריכוז), a field labeled `מספר תיק ניכויים`
(deductions-file number) appears, e.g.:

| מוצר | מספר תיק ניכויים |
|---|---|
| מבטחים ותיקה | 930003918 |
| מנורה פנסיה | 936300342 |
| הראל עדיף | 930006101 |
| הפניקס | 930638713 |

The same numbers appear in the תגמולים tax report's own `מספר תיק ניכויים` column — strong evidence that this
column identifies the **Container**, not the taxpayer:

```
דוח ריכוז מוצרים (concentration report)
  → מוצר (product)
      → מספר תיק ניכויים (deductions-file number)
          → same number appears in
              → דוח המס (tax report)
```

This reframed the governing question from "which row belongs to which XML?" to the sharper: **"which XML
produces deduction-file number 930638713?"**

A single Container carries four identifiers simultaneously — product type, policy number, deductions-file
number, managing company. The task ahead: discover which one the tax report actually keys off of. Stage 2's
goal was revised to Stage 2.1 — prove Container identity:

```
Tax Report Row
  → מספר תיק ניכויים
      → מוצר בדוח ריכוז
          → XML
              → חשבון (account)
```

Once this chain is proven, mapping the three tax columns becomes far simpler. A secondary observation: the
22-page report, previously treated as general information, might be the **translation map** between the XML
world and the tax-report world — in which case it becomes a central investigation artifact, not a supporting
one.

### B.2 The Altshuler → Mor transfer — Account is not Money Rights History

Roy supplied real annual reports for the same accounts, transferred (נויד) between Altshuler (2024) and Mor
(2025). Both show 4 provident-fund accounts, the same status split (1 self-employed, 3 salaried) preserved
across the transfer, even though account numbers changed completely.

The key finding — two different things survive a transfer, and they are not the same thing:

> "הוותק המשפטי נשמר, בעוד מועד ההצטרפות למוצר החדש התחיל מחדש."
> *(Legal seniority is preserved, while the joining date to the new product started over.)*

For Mor account 1375888: joining date at Mor = 19/11/2025; tax seniority of the money = 01/02/1994 — kept as
two separate fields in the same report.

> "זו ראיה ישירה וחזקה לכך ש-Account ו-Money Rights History אינן אותה ישות."
> *(This is direct, strong evidence that Account and Money Rights History are not the same entity.)*

A near-certain first mapping (Altshuler 6730512 → Mor 1375888) was identified on matching status, tax
seniority, and the fact that the money in both was composed almost entirely of severance, split between
lump-sum and annuity portions in both reports — the *shape* of the right survived the transfer even as the
amounts grew.

Comparing the two snapshots directly is not valid — real events occurred between them (returns at Altshuler
before the transfer, the transfer itself, returns and fees at Mor afterward, in some accounts new deposits).
Reconciliation requires the events, not a snapshot diff:

```
Balance end-2024 at Altshuler
  + movements at Altshuler until transfer
  = amount transferred to Mor

amount transferred
  + deposits after transfer
  + gains at Mor
  − management fees at Mor
  = Balance end-2025
```

Mor's report exposes an explicit field, "כספים שהעברת לחשבון" (funds you transferred into the account), as the
primary reconciliation anchor. A further caution: Altshuler's four accounts summed to ₪1,059,954.39; Mor's
summed to only ₪750,771.87 a year later — not evidence of lost money, but also not license to assume a naive
1-to-1 account mapping just because the counts matched. **Matching account counts is not evidence of account
identity.**

### B.3 Detailed report versus short report — different products, not different verbosity

> "חשבתי שהדוח המקוצר הוא 'גרסה מקוצרת' של הדוח המפורט. הוא לא. הוא מוצר אחר."
> *(I thought the short report was a "shortened version" of the detailed report. It isn't. It's a different
> product.)*

The short report contains, per account: expected payments, this year's movements, management fees, track
(מסלול), deposits — nothing else. Tax layers, capital/annuity split, cost basis, and component breakdown exist
only in the detailed report. At least three distinct views onto the same reality:

```
Provider Internal Model
   │
   ├── XML (clearinghouse)
   ├── Detailed Annual Report
   └── Short Annual Report
```

Mor's short report shows the account almost like a bank account — opening balance + transfers in + gains −
fees = closing balance, no mention of הון, קצבה, תיקון 190, or שכבות anywhere. Altshuler's short report
foregrounds "יתרת הכספים המיועדים למשיכה כקצבה" and "יתרת הכספים המיועדים למשיכה חד פעמית" on the first page of
every fund, before the detailed report is even reached.

> "מור ואלטשולר מציגים את אותו עולם בצורה שונה. לא בגלל שהכסף שונה. אלא בגלל שה-UX שלהם שונה."
> *(Mor and Altshuler present the same world differently. Not because the money is different — because their
> UX is different.)*

This is one of the first direct proofs that **Goose must not build its model out of any single provider's
report** — different institutions surface the same underlying reality differently.

### B.4 The Projections principle, and the reframing of Goose's own role

Pulling together the Deloitte letter (§A.1), the detailed report, the short report, and the XML: all four tell
the same story, but each answers a different question.

| מקור (Source) | השאלה שהוא עונה עליה (Question it answers) |
|---|---|
| XML | How are transferable rights described between systems? |
| דוח מפורט (Detailed report) | How does the managing body document every account component? |
| דוח מקוצר (Short report) | What does the member need to understand this year? |
| מכתב דלויט (Deloitte letter) | Is the legal classification of the funds correct? |

From this, the canonical principle:

> "אין מקור מידע יחיד שמתאר את המציאות הפנסיונית במלואה. כל מקור הוא Projection של אותה מציאות, המותאם למטרה
> מסוימת: תפעול. רגולציה. שירות ללקוח. מיסוי. בקרה."
> *(There is no single information source that describes pension reality in full. Every source is a
> Projection of the same reality, adapted to a purpose: operations. regulation. customer service. taxation.
> oversight.)*

And, following directly from it, a revision of what Goose itself is:

> "עד היום דיברנו על Goose כעל SSOT. אני חושב שההגדרה המדויקת יותר היא: Goose הוא מנוע שמאחד מספר Projections
> שונים של אותה מציאות לכדי Canonical Reality אחת."
> *(Until now we spoke of Goose as an SSOT. The more precise definition: Goose is an engine that unifies
> several different Projections of the same reality into one Canonical Reality.)*

> "עד עכשיו חיפשנו את ה-SSOT בתוך אחד המקורות. אני כבר לא חושב שהוא נמצא שם. אני מתחיל לחשוב שה-SSOT לא קיים
> באף מקור בודד. הוא נוצר רק כאשר מחברים את כולם."
> *(Until now we searched for the SSOT inside one source. I no longer think it's there. The SSOT does not
> exist in any single source. It is created only when all of them are connected.)*

Flagged in the conversation itself as one of Expedition 3's most important architectural conclusions.

### B.5 Accumulation and Realization as two distinct systems

Responding to the Projections discussion, the conversation drew a split that runs through everything after
it: before retirement, the person is tracked through a savings/rights system; at retirement, part of that
system passes through a realization event into a shared tax system. "Gross" should not be thought of as an
ordinary Container.

**Before retirement — savings and rights:**

```
Rights Layers
  ↓ held in
Pension Domains
  ↓ over time
Deposits / Returns / Transfers / Corrections
```

Examples of layers named: a layer inside executive insurance, a layer inside a provident fund, rights inside a
pension fund, a קצבה מזכה layer, a קצבה מוכרת layer, exempt capital (הון פטור).

**At retirement — realization and taxation:**

```
Rights Layers
  ↓ Retirement / Realization Events
Income and Capital Flows
  ↓
Tax Treatment
```

At this point money is evaluated not only by where it came from, but also by: the type of payment created
(annuity vs. capital), whether it is קצבה מזכה or קצבה מוכרת, the exemption elected under rights-fixation,
prior retirement grants and past withdrawals affecting the exemption, the person's other income, and tax
brackets/credit points.

Roy asked whether all this money becomes "the same thing" once it reaches this stage:

> "לדעתי — לא. ... הם עשויים להגיע לאותו חישוב מס כולל, אבל הם אינם בהכרח הופכים לאותו אובייקט. ... התלכדות
> לצורך חישוב אינה מיזוג של זהות הזכות."
> *(I don't think so. They may reach the same overall tax calculation, but they don't necessarily become the
> same object. Convergence for calculation purposes is not a merge of the right's identity.)*

Named as: **Calculation aggregation ≠ canonical merge.**

### B.6 What "gross" (ברוטו) actually is

"Gross" is not a Container of rights — it is a **Tax Calculation Aggregate** (אגד הכנסות לצורכי מס): created
for a period (month or tax year), containing realization results and income, not the savings layers
themselves:

```
Monthly Tax Aggregate
├── taxable qualifying pension
├── exempt portion of qualifying pension
├── recognized pension
├── employment income
├── other taxable income
├── deductions
├── credits
└── final income tax
```

Components enter this calculation without losing their origin.

### B.7 Rights-fixation (קיבוע זכויות) is not the income-tax calculation

Two separate operations, neither substitutable for the other:

**1. Rights-fixation** — how to use the exemption benefit under section 9א:

```
Exemption entitlement
  ↓ allocation decision
monthly pension exemption
and/or
capitalization exemption
```

Made via Form 161ד, covering qualifying pensions, retirement grants, and how to use the exemption.

**2. Income tax calculation** — applied only after rights-fixation determines the exempt portion:

```
Gross qualifying pension
− pension exemption
=
Taxable pension
```

The taxable portion joins the person's other relevant taxable income; tax brackets, credit points, and
payer-coordination follow.

> "מדרגות המס ונקודות הזיכוי הן חלק ממנגנון חישוב מס ההכנסה הכללי, ולא חלק מזהות שכבת הכסף."
> *(Tax brackets and credit points are part of the general income-tax mechanism, not part of the money
> layer's identity.)*

### B.8 The full canonical pipeline

```
Accumulation Stage
──────────────────
Rights Layer A ── Manager Insurance
Rights Layer B ── Pension Fund
Rights Layer C ── Provident Fund
Rights Layer D ── Provident Fund

Retirement Decisions
────────────────────
Layer A ── annuity event ──► Pension Flow A
Layer B ── annuity event ──► Pension Flow B
Layer C ── capital withdrawal ──► Capital Flow C
Layer D ── annuity event ──► Pension Flow D

Tax Classification
──────────────────
Pension Flow A ── qualifying pension
Pension Flow B ── qualifying pension
Capital Flow C ── exempt / taxable according to rights and event
Pension Flow D ── recognized or qualifying pension

Rights Fixation
──────────────────
Relevant qualifying-pension flows
+ historical retirement grants / capitalizations
+ user elections
  ↓
Allocated pension exemption

Periodic Tax Calculation
────────────────────────
Taxable Pension A
+ Taxable Pension B
+ other taxable income
  ↓
Gross taxable income
  ↓
Tax brackets
− tax credits
  ↓
Tax payable
```

### B.9 Three kinds of Aggregate — must not be merged into one gross

1. **Rights Aggregate** — all layers of the same legal nature (e.g. all קצבה מזכה layers), lineage preserved.
2. **Realization Aggregate** — all payments created by one retirement or withdrawal event.
3. **Tax Aggregate** — all income and credits entering a period's tax calculation:

```
Tax Year 2032
├── pensions
├── salary
├── other income
├── exemptions
├── deductions
└── credits
```

"אסור למזג את שלושתם ל-gross" — the three must not be merged into a single gross.

### B.10 What happens to a layer when an annuity starts

A layer likely does not disappear the moment an annuity begins. A distinction is needed between an
**Accumulated Rights Object** and a **Realized Income Stream**, connected by the realization event:

```
Rights Layer
  ↓ annuitization event
Pension Entitlement / Pension Stream
```

The Pension Stream is a new object:

```
Pension Stream
├── source_rights_layers[]
├── payer
├── gross_monthly_amount
├── tax_classification
├── exempt_amount
├── taxable_amount
├── start_date
├── indexation_rules
└── evidence
```

Purpose: Goose should be able to explain "this monthly pension was created from these rights, at this payer,
and this portion of it is exempt due to the rights-fixation decision."

### B.11 The Object/Domain shift across a realization event

> Before retirement:
> `Object = Money Rights Layer`
> `Domain = Pension Product`
>
> After the realization event:
> `Object = Pension Income Stream`
> `Domain = Income-Tax System`

But the layer itself does not simply "move" into the tax domain:

> "אבל לא הייתי אומר שהשכבה עצמה פשוט 'עברה לדומיין מס הכנסה'. מדויק יותר: אירוע המימוש יצר אובייקט חדש מן
> השכבה, והאובייקט החדש נבחן בדומיין המס."
> *(I would not say the layer itself simply "moved to the income-tax domain." More precisely: the realization
> event created a new object from the layer, and the new object is evaluated in the tax domain.)*

```
Money Rights Layer
  ↓ realization
Pension / Capital Flow
  ↓ tax domain
Tax Result
```

### B.12 Two risk chains, then one combined model

```
Rights Layer × Current Pension Domain
  → Rights Realization Risk
```

```
Rights Layers × Retirement Elections × Tax Domain
  → Tax Optimization / Irreversibility Risk
```

Example warnings: a layer might realize in a way that doesn't preserve its rights; a capitalization election
reduces future monthly exemption; prior retirement grants affect the exemption basket; multiple pension payers
require tax coordination; a layer suited to capital was mistakenly placed into an annuity stream; a proposed
rights-fixation election doesn't match the person's income goal.

Combined:

```
Rights Layer
  ×
Pension Domain
  ×
Realization Event
  ×
Person State
  ↓
Realized Financial Flow
  ×
Tax Classification
  ×
Rights-Fixation Election
  ×
Tax-Year Context
  ↓
Net Outcome
```

> "לא עשית בלגן. הכנסת עכשיו שלב נוסף במודל."
> *(You didn't make a mess — you just introduced an additional stage into the model.)*

Still-missing pieces named at this point: `realization_events`, `income_streams`, `rights_fixation`,
`tax_aggregates`.

### B.13 The architecture lesson that produced this document

The conversation's final turns are process discovery about how Goose's own work must be run. After failing to
export the chat directly, the assistant proposed reconstructing the record from the repository itself:

> "ה-Repository הוא מקור האמת של Goose."
> *(The Repository is Goose's source of truth.)*

> "אסור לנו יותר להסתמך על היסטוריית צ'אט כמאגר ידע. כל Stage חייב להסתיים ב-Commit לפני שממשיכים. זו כבר לא
> רק המלצה - זו דרישת ארכיטקטורה."
> *(We must no longer rely on chat history as a knowledge store. Every Stage must end with a Commit before
> continuing. This is no longer just a recommendation — it is an architectural requirement.)*

Next steps named, in order: extract the conversations (or use the repo as the source), produce a discovery
document, commit, and only then continue.

---

## Part C — Open Questions and TBD

- **Merge rules.** When is aggregating two rights layers safe, versus only calculation convergence (§B.5)?
  Open.
- **Split rules.** When a single reported bucket actually contains multiple distinct rights (§A.5). Open.
- **Domain capabilities.** No enumerated taxonomy of what a Domain does or does not make possible for a Rights
  Layer it holds (used implicitly throughout, never defined as its own list). Open.
- **Realization taxonomy.** Only examples exist (annuity event, capital withdrawal); no complete list. Open.
- **Event taxonomy.** Deposits, returns, transfers, corrections are named (§B.5); no closed taxonomy produced
  here. *(A more developed candidate taxonomy exists in `ECOSYSTEM_FOUNDATION_DISCOVERY.md` §3.8 — a parallel
  thread, not reconciled with this one.)*
- **Persistence implications.** Explicitly out of scope throughout both conversations ("לא כותבים
  ארכיטקטורה" — we are not writing architecture). Not addressed here.
- **Presentation implications.** Touched only indirectly via §B.3 (different providers present the same
  reality differently). No design proposed.
- **Holding.** Named once, in passing, as a concept still needed alongside layers and domains — never defined.
  Its relationship to Rights Layer, Account, and Product is open.
- **Identity.** Used informally throughout (rights identity, money identity) without its own definition
  distinct from Rights Layer. Open.
- **Digital Twin.** Not addressed in either conversation. Open — no discovery to preserve yet.
- **The risk/reasoning chain's further shape.** §B.12's two-step and four-factor chains are what was actually
  reasoned through. Whether a more elaborate chain (naming intermediate stages such as enumerating possible
  realizations, or a gap analysis between current and possible state) belongs in the model is a plausible next
  step, not yet reasoned through here.
