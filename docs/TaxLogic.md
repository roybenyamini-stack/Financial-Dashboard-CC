# TaxLogic.md — Taxation Rules: Source of Truth

> This document governs the logic for calculating tax on withdrawals for all product types found in the pension XML data. All future coding that touches tax calculation, exemption rules, or tax display must align with this specification.

---

## 1. Overview

The simulation model applies Israeli tax law to withdrawal scenarios for two product categories: **Study Funds** and **Provident/Severance Funds**. Tax is calculated at the point of withdrawal (not at accumulation) and depends on a combination of product type, member seniority, member age, and deposit classification (exempt vs. taxable principal).

**Data source:** XML feeds conforming to the Israeli Pension Clearing House standard (`NetuneiMutzar` / `PirteiTaktziv` sections). No tax rule may be derived from UI state alone — all inputs must trace to an XML field or a user-controlled simulation slider.

**Architecture principle:** All statutory tax parameters are consumed from the Global Config object (see Section 6). No calculation function may hardcode a rate, threshold, or bracket ceiling.

---

## 2. Product Type Definitions

Tax rules are selected by the `SUG-MUTZAR` (or `KOD-SUG-MUTZAR`) field in the XML.

| SUG-MUTZAR | Hebrew Name | English Name | Tax Regime |
|---|---|---|---|
| `4` | קרן השתלמות | Study Fund | Capital gains (`{CONFIG_CAPITAL_TAX_RATE}`), seniority/age exemption |
| `3` | קופת גמל / פיצויים | Provident / Severance Fund | Progressive income tax, exemption basket |
| `5` | ביטוח מנהלים | Executive Insurance | See `pension_logic.md` (out of scope here) |
| `1`, `2` | קרן פנסיה | Pension Fund | Monthly annuity; not subject to lump-sum withdrawal tax |

---

## 3. Taxation Rules

### 3.1 Study Funds (SUG-MUTZAR = 4)

#### Exemption Conditions

A withdrawal is **fully tax-exempt** if **either** condition is met:

| Condition | Rule | XML Field |
|---|---|---|
| Seniority | ≥ `{CONFIG_SF_SENIORITY_YEARS}` years from first deposit | `TAARICH-HITZTARFUT-RISHON` |
| Retirement age | Member has reached age `{CONFIG_RETIREMENT_AGE}` (or elected early retirement with ITA approval) | `TAARICH-LEYDA` |

If neither condition is met, the withdrawal is **partially or fully taxable** depending on segment classification.

#### Tax Rate

- **Rate:** `{CONFIG_CAPITAL_TAX_RATE}` flat (`מס רווח הון`)
- **Base:** Taxable profit only — principal (deposits) is never taxed regardless of segment type
- **Taxable profit** = accumulated value of segment − original deposits into that segment

#### Segment Classification

Each deposit segment carries a `TIKRAT-HAFKADA-MUTEVET` flag:

| Value | Type | Tax Treatment |
|---|---|---|
| `1` | קרן פטורה — Exempt Principal | Both principal and profit are exempt |
| `2` | קרן חייבת — Taxable Principal | Principal returned tax-free; profit taxed at `{CONFIG_CAPITAL_TAX_RATE}` |

The proportional withdrawal percentage is applied equally across all segments.

---

### 3.2 Provident / Severance Funds (SUG-MUTZAR = 3)

#### Withdrawal Before Age `{CONFIG_PF_WITHDRAWAL_AGE}`

Lump-sum withdrawals are taxed as **ordinary income** using progressive tax brackets (see Section 5.3). No exemption basket applies.

#### Withdrawal At or After Age `{CONFIG_PF_WITHDRAWAL_AGE}`

Member becomes eligible for the **exemption basket** (`סל פטור`):
- Basket value: **`{CONFIG_EXEMPT_BASKET}`** (annually indexed)
- Amount up to the basket is tax-free; any excess is taxed progressively

#### Employer vs. Employee Contributions

| Contribution Type | Hebrew | Tax Treatment |
|---|---|---|
| Employer (severance) | פיצויים | Exempt up to `{CONFIG_SEVERANCE_CEILING_PER_YEAR}` × years of seniority (statutory ceiling) |
| Employee | תגמולים | Principal returned tax-free; profit subject to progressive tax |

#### Pension Regime Flag

`PENSIA-VATIKA-O-HADASHA` determines the applicable legal framework:

| Value | Regime | Notes |
|---|---|---|
| `1` | וותיקה (Vatika) | Pre-1995 regime; different exemption ceilings apply |
| `0` | חדשה (Hadasha) | Post-1995 regime; standard rules above apply |

---

## 4. XML Variables Required for Calculation

All fields are sourced from `NetuneiMutzar` unless otherwise noted.

| XML Tag | Source Section | Purpose |
|---|---|---|
| `SUG-MUTZAR` / `KOD-SUG-MUTZAR` | NetuneiMutzar | Product type classifier — selects tax regime |
| `TAARICH-HITZTARFUT-RISHON` | NetuneiMutzar | First join date — seniority clock start |
| `TAARICH-HITZTARFUT-MUTZAR` | NetuneiMutzar | Latest product join date (used for mid-product transfers) |
| `TAARICH-LEYDA` | PirteiTaktziv | Date of birth — age-based exemption check |
| `TAARICH-PTIRA` | NetuneiMutzar | Projected retirement date |
| `REVACH-HEFSED-BENIKOI-HOZAHOT` | NetuneiMutzar | Net profit/loss after expense deduction |
| `SIMAN-REVACH-HEFSED` | NetuneiMutzar | Sign indicator: positive profit or loss |
| `TIKRAT-HAFKADA-MUTEVET` | PerutYitrot (segment) | Deposit type: `1`=exempt, `2`=taxable |
| `TOTAL-CHISACHON-MTZBR` | NetuneiMutzar | Total accumulated balance (K ₪) |
| `KITZVAT-HODSHIT-TZFUYA` | NetuneiMutzar | Expected monthly pension (for annuity products) |
| `PENSIA-VATIKA-O-HADASHA` | NetuneiMutzar | Pension regime: `1`=Vatika, `0`=Hadasha |

---

## 5. Calculation Flow

> All `CONFIG_*` variables are loaded from the Global Config object **before** the calculation block begins. See Section 6 for the full variable registry.

### 5.1 Study Fund (SUG-MUTZAR = 4)

```
// Load config
capitalTaxRate   = CONFIG_CAPITAL_TAX_RATE
seniorityCutoff  = CONFIG_SF_SENIORITY_YEARS
retirementAge    = CONFIG_RETIREMENT_AGE

seniority  = (TODAY - TAARICH-HITZTARFUT-RISHON) in years
memberAge  = (TODAY - TAARICH-LEYDA) in years

IF seniority >= seniorityCutoff OR memberAge >= retirementAge:
    taxDue = 0                          // full exemption — no further calculation

ELSE:
    taxDue = 0
    FOR EACH segment IN PerutYitrot:
        IF segment.TIKRAT-HAFKADA-MUTEVET == 2:   // taxable segment
            taxableProfit = segment.accumulation - segment.deposits
            IF taxableProfit > 0:
                taxDue += taxableProfit × withdrawalPct × capitalTaxRate

grossWithdrawal = totalBalance × withdrawalPct
netToBank       = grossWithdrawal - taxDue
```

> `withdrawalPct` is user-controlled via the withdrawal slider (0–100% of balance, or a fixed ₪ amount converted to a fraction).

---

### 5.1a Study Fund — YTD Accrual (when annual PDF is uploaded)

When the user uploads an annual report PDF, the calculation is upgraded from the segment-based estimate above to a **three-phase precise calculation**. The phases are described in full in `israel_tax_rules.md` § "Current Dashboard Implementation". Summary:

#### Historical Tax Tiers (Phase 1)

The PDF report discloses taxable profit broken down by the period in which it was accrued, reflecting the Israeli reform timeline:

| Period | Rate | Why |
|--------|------|-----|
| Before 2002 | **0%** | Pre-reform grandfathering (`isPreReformExempt`). Entire fund exempt. |
| 2003 – 2005 | **15%** | Transitional bracket post-2003 reform. |
| 2006 – 2011 | **20%** | Second transitional bracket. |
| 2012 – present | **25%** | Full capital gains rate (current statutory rate). |

```
pdfTierTaxK = (taxableProfit15K × 0.15) + (taxableProfit20K × 0.20) + (taxableProfit25K × 0.25)
```

#### Effective Tax Coefficient — מקדם מס אפקטיבי (Phase 2 & 3 input)

New profit (YTD or simulated) is NOT taxed at a flat 25%. Instead, the fund's blended effective rate is derived from the PDF:

```
effectiveTaxCoeff = pdfTierTaxK / pdfTotalBalanceK
```

This encodes all tier weights and exempt layers into a single ratio. New profit is then taxed at this ratio rather than the nominal 25%, preventing systematic overstatement of tax for funds with significant pre-2012 or exempt layers.

#### YTD Real Profit (Phase 2)

```
ytdDepositsK     = salary deposits Jan-1-reportYear..today (XML or manual override)
ytdDelta         = currentBalanceK − pdfBalanceK − ytdDepositsK
inflationDeductK = pdfBalanceK × (inflationRate / 100) × yearsSinceReport
ytdRealProfitK   = max(0, ytdDelta − inflationDeductK)
ytdTaxDueK       = ytdRealProfitK × effectiveTaxCoeff
```

#### Simulation (Phase 3)

```
simTaxDueK = simRealProfitK × effectiveTaxCoeff
```

The same coefficient is applied to the future projection so that slider output is consistent with the YTD accrual method.

#### Final Tax

```
totalTax = max(0, (pdfTierTaxK + ytdTaxDueK + simTaxDueK) × withdrawalPct)
netToBank = grossWithdrawal − totalTax
```

### 5.2 Provident Fund (SUG-MUTZAR = 3)

```
// Load config
withdrawalAge  = CONFIG_PF_WITHDRAWAL_AGE
exemptBasket   = CONFIG_EXEMPT_BASKET
taxBrackets    = CONFIG_TAX_BRACKETS
taxRates       = CONFIG_TAX_RATES
creditValue    = CONFIG_CREDIT_POINT_VALUE
creditPoints   = CONFIG_CREDIT_POINTS_DEFAULT

memberAge = (TODAY - TAARICH-LEYDA) in years

IF memberAge >= withdrawalAge:
    exemptAmount   = min(totalBalance, exemptBasket)
    taxableAmount  = max(0, totalBalance - exemptAmount)
    taxDue         = progressiveTax(taxableAmount, taxBrackets, taxRates, creditValue, creditPoints)
ELSE:
    taxDue = progressiveTax(totalBalance, taxBrackets, taxRates, creditValue, creditPoints)

grossWithdrawal = totalBalance × withdrawalPct
taxDue          = taxDue × withdrawalPct
netToBank       = grossWithdrawal - taxDue
```

### 5.3 Progressive Tax Brackets

> Bracket ceilings and marginal rates are read from `CONFIG_TAX_BRACKETS` and `CONFIG_TAX_RATES` respectively. The table below shows the **2026 statutory reference values** — do not hardcode these in any function.

| Monthly Income (₪) | Marginal Rate |
|---|---|
| 0 – 7,010 | 10% |
| 7,010 – 10,060 | 14% |
| 10,060 – 16,150 | 20% |
| 16,150 – 22,440 | 31% |
| 22,440 – 46,690 | 35% |
| 46,690 – 60,130 | 47% |
| 60,130+ | 50% |

Credit point deduction: **`{CONFIG_CREDIT_POINT_VALUE}`/point** × `{CONFIG_CREDIT_POINTS_DEFAULT}` points (default).

---

## 6. System Architecture & Configuration Reference

### 6.1 Single Config Source Rule

All statutory tax parameters **must** be read from the Global Config object at the start of each calculation call. No tax function may hardcode a bracket ceiling, rate, age threshold, or seniority threshold. This ensures that a single update to the Global Config object propagates identically across all user profiles and both execution modes.

### 6.2 Config Namespace Separation

The Global Config has two strictly separated namespaces:

| Namespace | Variables | Scope | Managed Via |
|---|---|---|---|
| **Statutory Tax Settings** | `CONFIG_CAPITAL_TAX_RATE`, `CONFIG_EXEMPT_BASKET`, `CONFIG_SF_SENIORITY_YEARS`, `CONFIG_RETIREMENT_AGE`, `CONFIG_PF_WITHDRAWAL_AGE`, `CONFIG_SEVERANCE_CEILING_PER_YEAR`, `CONFIG_TAX_BRACKETS`, `CONFIG_TAX_RATES`, `CONFIG_CREDIT_POINT_VALUE`, `CONFIG_CREDIT_POINTS_DEFAULT` | Globally applied — identical for all profiles and both Simulation and Real Data modes | UI Settings screen (Tax Settings panel) |
| **Economic Assumptions** | Inflation rate, investment return, pension yield | Profile-specific | Macro/Sliders screen |

**Economic Assumptions are NOT part of this document.** They are governed by `docs/sliders_module.md`.

### 6.3 Mode Agnosticism

The same tax engine function is called by both **Guest Simulation** mode and **Real Data** mode. Mode selection determines which XML data (or simulated defaults) are fed into the engine — it never alters which tax rules or config values apply.

### 6.4 Global Config Variable Registry

| Config Key | Description | 2026 Statutory Default | Code Reference (`app.js`) |
|---|---|---|---|
| `CONFIG_CAPITAL_TAX_RATE` | Capital gains tax rate on taxable profits | `0.25` (25%) | `SIM_CAPITAL_TAX` ~line 7893 |
| `CONFIG_EXEMPT_BASKET` | Provident fund exemption basket (₪) | `882,924` | `pnsExemptBasket` ~line 6477 |
| `CONFIG_SF_SENIORITY_YEARS` | Study fund seniority threshold for full exemption | `6` | Implicit in `_sfRecalculate` |
| `CONFIG_RETIREMENT_AGE` | Retirement age for study fund age-based exemption | `67` | Implicit in `_sfRecalculate` |
| `CONFIG_PF_WITHDRAWAL_AGE` | Provident fund withdrawal age for exemption basket eligibility | `60` | Implicit in `pnsCalcTax` flow |
| `CONFIG_SEVERANCE_CEILING_PER_YEAR` | Max tax-exempt severance per year of seniority (₪) | `4,200` | — |
| `CONFIG_TAX_BRACKETS` | Array of monthly income ceiling thresholds (₪) | `[7010, 10060, 16150, 22440, 46690, 60130]` | `cfg.taxBrackets` ~line 7028 |
| `CONFIG_TAX_RATES` | Array of marginal tax rates (7 elements) | `[0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50]` | `cfg.taxRates` ~line 7029 |
| `CONFIG_CREDIT_POINT_VALUE` | Value of a single tax credit point (₪) | `242` | `cfg.creditPointValue` ~line 7066 |
| `CONFIG_CREDIT_POINTS_DEFAULT` | Default number of tax credit points per individual | `2.25` | `cfg.creditPoints` ~line 7067 |

---

## 7. Transparency Requirements

### 7.1 Purpose

The "Show Tax Details" panel (future UI component) must surface the full decision chain so the user understands why a specific tax amount was calculated. No number should appear without a derivable reason.

### 7.2 Tax Details Data Structure

```json
{
  "productType": "קרן השתלמות",
  "suqMutzar": 4,
  "seniority": "7 שנים ו-3 חודשים",
  "memberAge": 45,
  "exemptionApplied": true,
  "exemptionReason": "ותק מעל 6 שנים",
  "segments": [
    {
      "type": "קרן פטורה",
      "tikrat": 1,
      "principal": 120000,
      "profit": 18000,
      "taxRate": 0,
      "taxDue": 0
    },
    {
      "type": "קרן חייבת",
      "tikrat": 2,
      "principal": 50000,
      "profit": 7000,
      "taxRate": 0.25,
      "taxDue": 1750
    }
  ],
  "withdrawalPct": 100,
  "grossWithdrawal": 195000,
  "totalTaxDue": 1750,
  "netToBank": 193250,
  "currency": "ILS",
  "unit": "K"
}
```

### 7.3 Display Rules for the UI Component

- Always show `exemptionReason` when `exemptionApplied = true` (e.g., "ותק מעל 6 שנים", "גיל פרישה").
- Always show a segment breakdown table — even if all segments are exempt — so the user sees the fund composition.
- `taxRate` of `0` displays as "פטור" not "0%".
- Amounts are in K ₪ consistent with the rest of the dashboard.

---

## 8. Confidence Scoring System

Every tax calculation emits a confidence score that the UI surfaces alongside the result. Confidence reflects how complete and reliable the input data is — not the accuracy of the tax law itself.

### 8.1 Tiers

| Level | Score | Display Color | Trigger Condition |
|---|---|---|---|
| **High** | 100% | Green | All required XML fields are present and contain valid values |
| **Medium** | 80% | Amber | One or more fields are missing; calculation uses a reasonable default or estimate |
| **Low** | 50% | Red | Complex product or regime (e.g., Vatika pension) where the result is a rough estimation and requires user verification |

### 8.2 Field-Level Triggers

| Missing / Invalid Field | Confidence Impact |
|---|---|
| `TAARICH-HITZTARFUT-RISHON` absent | Medium — seniority estimated from `TAARICH-HITZTARFUT-MUTZAR` |
| `TAARICH-LEYDA` absent | Medium — age-based exemption check skipped; worst-case tax applied |
| `TIKRAT-HAFKADA-MUTEVET` absent on any segment | Medium — segment treated as fully taxable |
| `REVACH-HEFSED-BENIKOI-HOZAHOT` absent | Medium — profit estimated from total balance minus estimated deposits |
| `PENSIA-VATIKA-O-HADASHA = 1` (Vatika regime) | Low — Vatika exemption rules differ; calculation is approximate |
| Multiple fields missing simultaneously | Low — downgrade to Low regardless of individual tier |

### 8.3 Confidence in the Tax Details JSON

Confidence is emitted as a top-level object in the Tax Details structure (see Section 7.2):

```json
"confidence": {
  "level": "medium",
  "score": 80,
  "notes": [
    "תאריך הצטרפות ראשון חסר — הוותק חושב לפי תאריך הצטרפות למוצר.",
    "ייתכן שהפטור ממס ניתן אם הוותק האמיתי עולה על 6 שנים."
  ]
}
```

- `level`: `"high"` | `"medium"` | `"low"`
- `score`: numeric (100 / 80 / 50)
- `notes`: array of Hebrew-language strings explaining each degradation reason; empty array when `level = "high"`

---

## 9. Tax Personality — Explainability Templates

These named template strings are the single source of truth for all human-readable tax explanations rendered in the UI. Placeholders use `[X]`, `[Y]`, `[Z]`, `[RATE]` and are replaced at runtime before display.

### 9.1 Template Registry

| Template ID | Scenario | Template String (Hebrew) |
|---|---|---|
| `SF_EXEMPT_SENIORITY` | Study Fund — seniority ≥ `{CONFIG_SF_SENIORITY_YEARS}` years | `"החישוב מתבסס על ותק של [X] שנים, ולכן הקופה פטורה ממס."` |
| `SF_EXEMPT_AGE` | Study Fund — member age ≥ `{CONFIG_RETIREMENT_AGE}` | `"החבר הגיע לגיל פרישה ([X]), ולכן הקופה פטורה ממס ללא תלות בוותק."` |
| `SF_TAXABLE` | Study Fund — taxable (seniority < `{CONFIG_SF_SENIORITY_YEARS}`, age < `{CONFIG_RETIREMENT_AGE}`) | `"ותק של [X] שנים בלבד — חלק הרווח בקרן החייבת חייב במס רווח הון של [RATE]."` |
| `PF_EXEMPT_AGE` | Provident Fund — age ≥ `{CONFIG_PF_WITHDRAWAL_AGE}` | `"משיכה בגיל [X] — הסכום עד [Y] ₪ פטור ממס (סל פטור). יתרה של [Z] ₪ חייבת לפי מדרגות."` |
| `PF_TAXABLE_YOUNG` | Provident Fund — age < `{CONFIG_PF_WITHDRAWAL_AGE}` | `"משיכה לפני גיל 60 מחושבת כהכנסה חייבת לפי מדרגות מס הכנסה."` |
| `PF_VATIKA` | Provident Fund — Vatika regime | `"קרן וותיקה — חישוב המס מבוסס על כללי הפטור של המשטר הישן ועשוי להיות שונה מהחישוב הסטנדרטי."` |
| `GENERAL_DISCLAIMER` | All products (always shown) | `"המס המוצג הוא הערכה בלבד ומבוסס על הנתונים הקיימים בקופה. לייעוץ מס אישי פנה לרואה חשבון."` |

### 9.2 Placeholder Reference

| Placeholder | Meaning |
|---|---|
| `[X]` | Primary numeric value (years of seniority, member age) |
| `[Y]` | Secondary numeric value (exempt amount in ₪) |
| `[Z]` | Tertiary numeric value (taxable remainder in ₪) |
| `[RATE]` | Capital gains tax rate — resolved from `CONFIG_CAPITAL_TAX_RATE` at render time |

### 9.3 Template ID in Tax Details JSON

`templateId` is added to the Tax Details structure (see Section 7.2) so the UI can look up the correct string without re-running logic:

```json
"explanation": {
  "templateId": "SF_EXEMPT_SENIORITY",
  "placeholders": { "X": "7" },
  "rendered": "החישוב מתבסס על ותק של 7 שנים, ולכן הקופה פטורה ממס."
},
"disclaimer": "המס המוצג הוא הערכה בלבד ומבוסס על הנתונים הקיימים בקופה. לייעוץ מס אישי פנה לרואה חשבון."
```

- `templateId`: key from the registry table above
- `placeholders`: map of `[X]`/`[Y]`/`[Z]`/`[RATE]` → actual values (as strings)
- `rendered`: pre-interpolated string ready for direct display
- `disclaimer`: always `GENERAL_DISCLAIMER` text, always present

---

## 10. Global Config Variable Registry

See Section 6.4 for the full registry with 2026 defaults and `app.js` code references.

| Config Key | Legacy Code Name | 2026 Default Value |
|---|---|---|
| `CONFIG_CAPITAL_TAX_RATE` | `SIM_CAPITAL_TAX` | `0.25` |
| `CONFIG_EXEMPT_BASKET` | `pnsExemptBasket` | `882924` |
| `CONFIG_SF_SENIORITY_YEARS` | *(implicit)* | `6` |
| `CONFIG_RETIREMENT_AGE` | *(implicit)* | `67` |
| `CONFIG_PF_WITHDRAWAL_AGE` | *(implicit)* | `60` |
| `CONFIG_SEVERANCE_CEILING_PER_YEAR` | *(implicit)* | `4200` |
| `CONFIG_TAX_BRACKETS` | `cfg.taxBrackets` | `[7010, 10060, 16150, 22440, 46690, 60130]` |
| `CONFIG_TAX_RATES` | `cfg.taxRates` | `[0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50]` |
| `CONFIG_CREDIT_POINT_VALUE` | `cfg.creditPointValue` | `242` |
| `CONFIG_CREDIT_POINTS_DEFAULT` | `cfg.creditPoints` | `2.25` |

---

*Last updated: 2026-06-07. Aligns with Israeli tax regulations as of tax year 2025/2026.*
