# Israeli Tax Rules — Master Source of Truth

> This is the single authoritative reference for all Israeli capital gains tax rules used in this dashboard.
> All AI audit prompts and verification logic must reference this file.

---

# General Tax Principles

1. **Scope**: Israeli Capital Gains Tax (CGT) applies to investment profit, not principal. Returned principal is never taxed.

2. **CGT Calculation Method (v181.76)**: Use **nominal** profit (no inflation adjustment). The inflation/CPI slider affects only forward growth projections (`growthF`). Real CGT (nominal minus CPI adjustment) will be re-enabled once a historical CPI API is integrated.

3. **Loss Shield (מגן מס)**: A negative real profit in a taxable segment reduces the total tax owed. The aggregate tax across all segments is always floored at **0** — it can never go negative.
   ```
   totalTax = max(0, Σ taxPerSegment)
   ```

4. **Partial Withdrawal**: Tax is proportional to the fraction withdrawn.
   ```
   taxOnWithdrawal = totalTax × (withdrawnAmount / totalBalance)
   ```

5. **YTD and Simulation Components**: The final tax due must aggregate three components, then scale by the withdrawal ratio:
   - `pdfTierTaxK` — Historical tax from the uploaded PDF annual report
   - `ytdTaxDueK` — Inflation-adjusted tax on real growth since the report date
   - `simTaxDueK` — Inflation-adjusted tax on projected future growth (simulation)
   - `withdrawalRatio` — Fraction being withdrawn (1.0 = full withdrawal)
   ```
   userCalculatedTax = max(0, (pdfTierTaxK + ytdTaxDueK + simTaxDueK) × withdrawalRatio)
   ```
   All monetary values in the `genericData` payload are in **K (thousands of NIS)**.

---

# Keren Hishtalmut (קרן השתלמות)

## Balance Layers

A Keren Hishtalmut balance is divided into four layers:

| Layer | Description | Taxed? |
|-------|-------------|--------|
| Exempt Principal (קרן פטורה) | Deposits up to the annual statutory ceiling | Never taxed after vesting |
| Exempt Profit (רווח פטור) | Profits on the exempt principal | Never taxed after vesting |
| Taxable Principal (קרן חייבת) | Deposits above the annual statutory ceiling | Not taxed (principal return) |
| Taxable Profit (רווח חייב) | Profits on the taxable principal | **Taxed — see brackets below** |

Only **Taxable Profit** is subject to CGT. All other layers are returned tax-free.

## Vesting Rule (כלל ההבשלה)

- After **6 years** from the first deposit date, the entire fund (all layers) is fully exempt from CGT on withdrawal.
- Before 6 years: Exempt layers remain tax-free; Taxable Profit is taxed at the applicable historical bracket.

## Ceiling Rule (תיקרת הפקדה)

- Annual statutory deposit cap (approx. ₪17,400/year for salaried employees; varies by tax year).
- Employer + employee deposits within the cap → Exempt tier.
- Any deposits above the cap → Taxable tier.

## Pre-2002 Full Exemption (פטור היסטורי)

> **Code flag: `isPreReformExempt`**

Funds whose **first deposit date was before January 1, 2002** (i.e., opened before the 2003 tax reform took effect) are **100% exempt from capital gains tax on the entire balance** — including any taxable-tier profit. This is a historical grandfathering exemption, not a vesting exemption.

### Rules when `isPreReformExempt = true`

1. **Tax due = 0.** The total capital gains tax liability is zero, regardless of balance size, profit amount, or withdrawal percentage.
2. **No tier breakdown applies.** The 15%/20%/25% bracket structure does not apply. Do not attempt to apply the 25% general rate.
3. **The entire balance is returned to the account holder tax-free.**
4. **AI MUST NOT apply any CGT.** When the `isPreReformExempt` flag is present and `true`, the AI must immediately return a confirmed tax liability of ₪0 and must not attempt to apply the 25% rule or any other bracket.
5. All financial fields (`exemptPrincipal`, `exemptProfit`, `taxablePrincipal`, `taxableProfit`, `taxableProfit15/20/25`) will be **zero** in the PDF parse response — this is correct and expected; the zero values are not a data error.

### How `isPreReformExempt` is detected

The flag is set **exclusively by the server-side PDF parsers** based on the B.8 table content — it is never derived from the DB's `joinDate` field:

- **`parseMeitav`**: sets `isPreReformExempt: true` when a row matching the `PRE2003_RE` pattern (`"יתרה בגין הפקדות"` suffix) is found. Ceiling-exempt rows matched by `NUM4_RE + 0%` do **not** trigger this flag.
- **`parseAltshuler`**: the AI tier-extraction prompt instructs the model to set `isPreReformExempt: true` only when a row is explicitly labeled as pre-31.12.2002 deposits in the PDF text.

The client stores this flag in `localStorage` alongside the parsed PDF data. All downstream UI and tax calculation logic must treat this flag as taking **absolute precedence** over any other calculation path.

---

## Historical Tax Brackets for Taxable Profit

The following brackets apply **only when `isPreReformExempt` is `false` (or absent)**. The tax rate applied to Taxable Profit depends on the **period in which the profit was accrued**. Annual reports break down the taxable profit by these historical periods:

| Period | Tax Rate | Field in genericData (all values in K) |
|--------|----------|----------------------------------------|
| **Before 2002** | **0% — Full Exemption** | See `isPreReformExempt` flag above |
| 2003 – 2005 | **15%** | `taxableProfit15K` |
| 2006 – 2011 | **20%** | `taxableProfit20K` |
| 2012 – present | **25%** | `taxableProfit25K` |

**PDF Tier Tax Formula (all values already in K):**
```
pdfTierTaxK = (taxableProfit15K × 0.15) + (taxableProfit20K × 0.20) + (taxableProfit25K × 0.25)
```
The payload provides `pdfTierTaxK` directly — use this for cross-checking against the formula above.

## Current Dashboard Implementation

The dashboard implements a **three-phase tax calculation** covering historical data, YTD accrual, and future projection:

### Phase 1 — Historical Tax (PDF Tier Breakdown)

When an annual report PDF is uploaded, the server extracts the 3-bracket profit breakdown and computes `pdfTierTaxK`:

```
pdfTierTaxK = (taxableProfit15K × 0.15) + (taxableProfit20K × 0.20) + (taxableProfit25K × 0.25)
```

This is the **base tax component** — it covers all taxable profit accrued up to the PDF report date. The result is in K (thousands of NIS).

---

### Phase 2 — YTD Accrual (מקדם מס אפקטיבי — Effective Tax Coefficient)

For active funds where `currentBalance > pdfReportBalance`, the dashboard calculates a **real-terms tax** on post-report growth.

#### Step 1 — Effective Tax Coefficient

The key insight is that new growth is taxed at the fund's *blended effective rate*, not at a flat 25%.
The coefficient is computed from two PDF-derived quantities:

```
marginalTaxRate   = pdfTierTaxK / totalTaxableProfitK
                    (weighted average CGT rate on taxable-tier profits only)

taxableRatio      = 1 − (exemptPrincipalK + exemptProfitK) / pdfTotalBalanceK
                    (proportion of total balance held in taxable tiers)

effectiveTaxCoeff = marginalTaxRate × taxableRatio
```

**Why this is correct:** New growth is distributed proportionally across all tiers. The taxable
fraction (`taxableRatio`) determines how much of the growth lands in taxable tiers; `marginalTaxRate`
is the weighted rate that applies to that taxable fraction. Using a flat `taxableRatio × 0.25`
overstates tax because 0.25 ignores the historical 15%/20% bracket profits already in the fund.

**Fallback (no `marginalTaxRate` available from PDF):** `effectiveTaxCoeff = taxableRatio × 0.25`.
This applies only when the PDF parser could not compute `marginalTaxRate` — i.e., never when an
annual report has been successfully uploaded.

#### Step 2 — Deposit Deduction

Before computing profit, salary deposits made since January 1 of the report year are subtracted from the balance delta. These are principal returns, not profit:

```
ytdDelta = currentBalanceK − pdfBalanceK − ytdSalaryDepositsK
```

`ytdSalaryDepositsK` sources (in priority order):
1. **Manual override** — user input via the "עדכון הפקדות שכר" modal, stored in `localStorage` key `sf_manual_deposits_k_{assetNum}`
2. **XML scan** — `PerutHafkadotMetchilatShana` elements with `SCHUM-HAFKADA-SHESHULAM` amounts, filtered to dates ≥ Jan 1 of the report year
3. **Auto-fill** — if the latest XML deposit date is 1–6 months behind the current month, the last deposit amount is extrapolated forward for the missing months

#### Step 3 — Inflation Adjustment

```
yearsSinceReport = (currentYear − reportYear − 1) + (currentMonth / 12)
inflationDeductK = pdfBalanceK × (inflationRate / 100) × yearsSinceReport
ytdRealProfitK   = max(0, ytdDelta − inflationDeductK)
```

#### Step 4 — YTD Tax

```
ytdTaxDueK = ytdRealProfitK × effectiveTaxCoeff
```

**Fallback (no PDF uploaded):** `effectiveTaxCoeff = taxableRatio × 0.25`, where `taxableRatio = 1 − (exemptPrincipal + exemptProfit) / pdfTotalBalance`.

---

### Phase 3 — Future Simulation (Sliders)

The same `effectiveTaxCoeff` governs the slider projection, ensuring consistency between YTD and future:

```
simRealProfitK = (projectedFutureBalance − currentBalance − inflationDeductK)
simTaxDueK     = simRealProfitK × effectiveTaxCoeff
```

---

### Final Total

```
userCalculatedTax = max(0, (pdfTierTaxK + ytdTaxDueK + simTaxDueK) × withdrawalRatio)
```

---

# Kupat Gemel (קופת גמל להשקעה)

## Overview

An investment provident fund (introduced in 2016). **All capital gains are taxable** — there is no exempt tier.

## Key Differences from Keren Hishtalmut

| Rule | Keren Hishtalmut | Kupat Gemel |
|------|-----------------|-------------|
| Exempt tier | Yes (up to annual ceiling) | **No** |
| 6-year vesting exemption | Yes | **No** |
| Taxable on all profits | No | **Yes** |
| Historical brackets | Yes (15/20/25%) | Yes (same brackets) |

## Tax Rates

Same 3-bracket structure as Keren Hishtalmut's taxable tier:

| Period | Tax Rate |
|--------|----------|
| 2003 – 2005 | **15%** |
| 2006 – 2011 | **20%** |
| 2012 – present | **25%** |

**Tax Formula:**
```
pdfTierTaxK = (profit15 × 0.15) + (profit20 × 0.20) + (profit25 × 0.25)
```

Loss shield and partial withdrawal rules are identical to Keren Hishtalmut (see General Principles).

---

# T190 — Kupat Gemel Tagmulim (קופת גמל תגמולים / פנסיה)

## Overview

A pension provident fund. **Not to be confused with Keren Hishtalmut or Kupat Gemel להשקעה.** Savings are divided into three layers ("דליים" — buckets):

| Layer | Hebrew Name | Tax Treatment on Capital Withdrawal |
|-------|-------------|--------------------------------------|
| Qualifying Annuity | קצבה מזכה | Heavy penalty: 35% tax (or marginal rate, whichever is higher) if withdrawn as lump sum — designated for monthly annuity only |
| Recognized Annuity | קצבה מוכרת | 15% nominal CGT on profits; principal is exempt |
| Exempt Capital | הון פטור | Principal is exempt — **profits are subject to 15% nominal CGT** pending tax officer approval |

## NO 6-Year Rule for T190

The 6-year vesting exemption applies **only to Keren Hishtalmut**. It does **NOT** apply to T190 pension funds. An AI must **never** state that a T190 fund requires 6 years for withdrawal eligibility.

## STRICT NEGATIVE CONSTRAINTS — Capital Withdrawal

⚠️ The AI is **STRICTLY FORBIDDEN** from using phrases such as `ללא מס כלל`, `פטור לחלוטין`, or `פטור ממס` without qualification when describing a **capital withdrawal (משיכה הונית / חד-פעמית)** of `הון פטור` or `קצבה מוכרת`, unless the data payload explicitly contains a valid tax officer approval (`אישור פקיד שומה`).

These phrases are permitted **only** when describing conversion to a **monthly annuity (קצבה חודשית)**, not capital withdrawal.

## STRICT POSITIVE CONSTRAINT — Required Explanation

When describing `הון פטור` in the context of a capital withdrawal, the AI **must** always state:
1. The **principal (הקרן)** of הון פטור is exempt from tax on capital withdrawal.
2. The **nominal profits (הרווחים הנומינליים)** accrued on that principal are subject to **15% capital gains tax** at the point of withdrawal.
3. A **tax officer approval (אישור פקיד שומה)** is required before the withdrawal can be processed.

## קצבה מזכה — Capital Withdrawal Penalty

Withdrawing `קצבה מזכה` as a lump sum (rather than converting to a monthly annuity) triggers a **35% tax penalty** (or the account holder's marginal tax rate, whichever is higher) per Tikunim 161 and 190. The AI must warn about this penalty whenever the user considers a lump-sum withdrawal of `קצבה מזכה`.

## Join Date

The fund's join date (`joinDate`) is **always present** in the data payload. Never claim the join date is missing or unknown — it is provided explicitly.
- Join date **before 2008-01-01**: The fund has `הון פטור` status (pre-2008 deposits are exempt capital).
- Join date **on or after 2008-01-01**: All deposits are designated for annuity (`קצבה מזכה`) — there is no `הון פטור` bucket.

---

# AI Auditing Heuristics

Rules for the `/api/verification/tax` route when an AI model audits a user's tax calculation.

## Units

All monetary values in `genericData` are in **K (thousands of NIS)**. Do not scale them. Ratios (`taxableRatio`, `withdrawalRatio`, `effectiveTaxCoeff`) are unitless numbers between 0 and 1.

## Key Field: `effectiveTaxCoeff`

`effectiveTaxCoeff` is the **blended effective tax rate** applied to new growth, computed as:

```
effectiveTaxCoeff = marginalTaxRate × taxableRatio
```

where `marginalTaxRate = pdfTierTaxK / totalTaxableProfitK` (weighted average CGT rate on taxable-tier profits only) and `taxableRatio = 1 − (exemptPrincipal + exemptProfit) / pdfTotalBalance`.

This coefficient is applied to both `ytdTaxDueK` and `simTaxDueK`. It is **not** `taxableRatio × 0.25` (which ignores historical 15%/20% bracket profits) and it is **not** `pdfTierTaxK / pdfTotalBalanceK` (which dilutes the rate across all principal rather than just profit). The `effectiveTaxCoeff` value in `genericData` is pre-computed by the dashboard — do not attempt to re-derive it. Verify only that the arithmetic holds:

```
ytdTaxDueK = ytdRealProfitK × effectiveTaxCoeff   (± 5% tolerance)
simTaxDueK = simRealProfitK × effectiveTaxCoeff   (± 5% tolerance)
```

## Verdict Definitions

| Verdict | Meaning |
|---------|---------|
| `"correct"` | Calculated tax matches the rules within a 5% tolerance |
| `"incorrect"` | Calculated tax deviates from the rules by more than 5%, or a rule was clearly misapplied |
| `"uncertain"` | Insufficient data to verify (e.g., missing historical split) |

## Audit Rules

1. **Missing Exempt/Taxable Split**: If the payload does not provide a breakdown between exempt and taxable layers, the AI must:
   - Assume **all profit is taxable** (worst case)
   - Return verdict `"uncertain"` with confidence ≤ 50%
   - Include issue: `"Exempt/Taxable split not available — assumed fully taxable"`

2. **Tax Formula Verification — Two Steps**:

   **Step A — Cross-check the PDF tier component:**
   ```
   expectedPdfTierTaxK = (taxableProfit15K × 0.15) + (taxableProfit20K × 0.20) + (taxableProfit25K × 0.25)
   ```
   Compare to `pdfTierTaxK` provided. If they differ by more than 1%, flag it.

   **Step B — Verify the final total:**
   ```
   expectedTax = max(0, (pdfTierTaxK + ytdTaxDueK + simTaxDueK) × withdrawalRatio)
   ```
   Compare to `userCalculatedTax`. If `|userCalculatedTax − expectedTax| / expectedTax > 0.05` → verdict `"incorrect"`.

   Note: `ytdTaxDueK` is the tax on real (inflation-adjusted) YTD growth since the PDF report date. `simTaxDueK` is the tax on projected future real profit (simulation). Both are pre-computed by the dashboard and passed directly — do not re-derive them. Either value may be negative (see Rule 3).

3. **Negative Values — Tax Shield (מגן מס)**: `ytdTaxDueK` and `simTaxDueK` can legitimately be **negative numbers**. A negative value indicates a real capital loss in that component, which acts as a Tax Shield that offsets other tax owed.
   - A negative `simTaxDueK` (e.g., −69) is **valid input** — treat it as normal arithmetic subtraction within the formula.
   - Do **not** treat negative values as errors, data anomalies, or reasons to return `"uncertain"`.
   - The `max(0, …)` floor in the formula guarantees the final result never goes below zero:
   ```
   expectedTax = max(0, (pdfTierTaxK + ytdTaxDueK + simTaxDueK) × withdrawalRatio)
   ```
   Example: `pdfTierTaxK=80, ytdTaxDueK=5, simTaxDueK=−69, withdrawalRatio=1.0` → `expectedTax = max(0, 16) = 16`.

4. **Withdrawal Ratio**: `withdrawalRatio` scales all three tax components proportionally (1.0 = full withdrawal). If it is less than 1.0, the expected tax is reduced accordingly. Verify the scaling is applied correctly in `userCalculatedTax`.

5. **Kupat Gemel**: No exempt tier — if `exemptPrincipalK > 0` is provided for a Kupat Gemel asset, flag it as a data anomaly.

6. **Explanation Language**: All `explanation` fields must be written in **Hebrew**.

7. **Confidence Scoring**:
   - Full bracket data + formula matches → 90–100
   - Partial data, formula matches → 60–80
   - Missing data, verdict uncertain → 30–50
   - Formula mismatch → 10–40 (depending on size of deviation)

8. **Pre-2002 Exempt Funds (`isPreReformExempt`)**: When the payload contains `"isPreReformExempt": true`, the AI audit **must** follow this path unconditionally:
   - Set `verdict = "correct"` if `userCalculatedTax === 0`; set `verdict = "incorrect"` if `userCalculatedTax > 0`
   - Set `confidence = 99`
   - Do **not** apply the 15%/20%/25% bracket formula
   - Do **not** apply the 25% flat-rate fallback
   - Return `explanation` (in Hebrew) confirming the pre-2002 historical exemption, e.g.: `"הקרן פטורה ממס לפי פטור היסטורי לפני 2002. אין חבות מס כלשהי."`
   - All financial fields being zero is **expected and correct** for this fund type — do not flag them as missing or anomalous

9. **⚠️ JSON Output Strictness**: The response MUST be 100% valid JSON.
   - Do **not** wrap the output in markdown code fences (` ```json ` or ` ``` `).
   - Do **not** add any text, commentary, or explanation outside the JSON object.
   - Negative numbers in the input data are valid — handle them arithmetically, not as errors.
   - The response must match this structure exactly — no extra keys, no missing keys:
   ```
   {
     "verdict": "correct" | "incorrect" | "uncertain",
     "confidence": <integer 0–100>,
     "issues": ["<string>", ...],
     "explanation": "<Hebrew string>"
   }
   ```

---

### RULE: Marginal Effective Tax Rate Calculation (Keren Hishtalmut)

When calculating the effective tax rate for future profits in a mature Keren Hishtalmut,
the system MUST use a "Marginal Tax Rate" approach based ONLY on taxable tiers.

**Calculation Formula:**
1. Filter the extracted rows: include ONLY rows where `taxRate > 0` (e.g., 15%, 20%, 25%).
2. IGNORE all rows where `taxRate === 0`.
3. Calculate Total Taxable Profit: sum the `realProfit` of the filtered rows.
4. Calculate Total Tax Liability: sum `realProfit × (taxRate / 100)` of the filtered rows.
5. Effective Marginal Rate: `Total Tax Liability ÷ Total Taxable Profit`.

**Fallback:** If there are no taxable rows (account is fully exempt), the rate is 0.
