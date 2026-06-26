# T190 Tax Rules — Provident Fund Simulation (קופת גמל, תיקון 190)

## Overview

Amendment 190 (תיקון 190) allows provident fund holders to withdraw funds at preferential tax rates,
or to allocate the entire amount to a monthly pension (annuity) and enjoy full tax exemption.

The simulation modal (`t190-sim-modal`) computes three outcomes based on two user choices:
- **Action**: "ייעוד לקצבה" (Annuity Allocation) vs "משיכה כהון" (Lump Sum Capital Withdrawal)
- **Tax Track** (relevant only for Lump Sum): "נומינלי 15%" vs "ריאלי 25%"

---

## Definitions

| Term | Hebrew | Description |
|------|--------|-------------|
| Gross Value | סה״כ למשיכה | Projected fund value after compound growth over the timeline |
| Principal | קרן (עלות) | Original cost basis. **Phase 3**: uses today's balance (`balK`). **Phase 4**: will use real bucket principal from the 3-bucket system |
| Withdrawn Amount | סכום המשיכה | Gross × Withdrawal% (or fixed K ₪ amount) |
| Tax Due | חבות מס | Calculated tax on profit |
| Net to Bank | נטו לכיס | Withdrawn − Tax |
| Monthly Pension | קצבה חודשית | Net (₪) ÷ Conversion Coefficient (מקדם המרה) |
| Conversion Coefficient | מקדם המרה | The divisor converting a lump sum to a monthly annuity payment (slider range: 100–300, default 200) |

---

## Rule 1 — Annuity Allocation (ייעוד לקצבה)

**Applies when**: Action radio = "ייעוד לקצבה (פטור)"

```
Tax Due    = 0
Net        = Withdrawn Amount
Monthly ₪  = (Net × 1000) ÷ Conversion Coefficient
```

- Full tax exemption — no income tax, no capital gains tax.
- The fund is converted to a stream of monthly pension payments.
- The Tax Track toggle ("נומינלי" / "ריאלי") is irrelevant in this mode.

**Example**: Net = 500 K ₪, Coeff = 200 → Monthly Pension = 500,000 ÷ 200 = **2,500 ₪/month**

---

## Rule 2 — Lump Sum, Nominal Track (משיכה כהון — נומינלי 15%)

**Applies when**: Action = "משיכה כהון" AND Tax Track = "נומינלי"

```
Nominal Profit = Withdrawn − Principal
Tax Due        = max(0, Nominal Profit × 0.15)
Net to Bank    = Withdrawn − Tax Due
```

- If Withdrawn ≤ Principal (no nominal profit), Tax = 0.
- Monthly Pension card shows `–` (not applicable for lump sum).

---

## Rule 3 — Lump Sum, Real Track (משיכה כהון — ריאלי 25%)

**Applies when**: Action = "משיכה כהון" AND Tax Track = "ריאלי"

```
Inflation-Adjusted Principal = Principal × (1 + Inflation Rate)^(Months ÷ 12)
Real Profit                  = Withdrawn − Inflation-Adjusted Principal
Tax Due                      = max(0, Real Profit × 0.25)
Net to Bank                  = Withdrawn − Tax Due
```

- If Real Profit ≤ 0 (no real gain after inflation), Tax = 0.
- The inflation rate is taken from the "Inflation" slider (default 2.5% per year).
- Monthly Pension card shows `–`.

---

## Donut Chart

| Scenario | Chart |
|----------|-------|
| ייעוד לקצבה | Single green segment — full Net amount |
| משיכה כהון (with profit) | Red (חבות מס) + Green (נטו לכיס) |
| משיכה כהון (no profit) | Single green segment — full Net amount |

---

## Phase 4 Integration Note

As of Phase 4, the simulation uses real bucket data from `item.t190Buckets` (parsed from clearinghouse XML). When no XML data is available, proportional mock data is injected automatically.

---

## The 3 Amendment 190 Buckets (Phase 4)

The fund balance is split across three tax tracks. T190 tax applies **only** to gains of the Recognized Pension bucket.

| Bucket | Key | Hebrew | Phase 4 Tax Treatment |
|--------|-----|--------|----------------------|
| Qualifying Annuity | `qualifying_annuity` | קצבה מזכה | No T190 tax. Subject to progressive marginal tax if withdrawn as capital (handled globally in Retirement Tab, not here). |
| Recognized Annuity | `recognized_annuity` | כסף מוכר | **T190 tax on gains only.** `principal_manual_k` = original post-tax principal (from annual tax report). Must be entered manually — cannot be derived from XML. |
| Capital Exempt | `capital_exempt` | הוני פטור | Fully exempt — no tax of any kind. |

### Tax on Recognized Annuity Bucket

**Nominal track (15%):**
```
Recognized Gain = Recognized Projected − (principal_manual_k × withdrawal_factor)
Tax = max(0, Recognized Gain × 0.15)
```

**Real track (25%):**
```
Inflation-Adjusted Principal = principal_manual_k × withdrawal_factor × (1 + inflation_rate)^(months/12)
Real Gain = Recognized Projected − Inflation-Adjusted Principal
Tax = max(0, Real Gain × 0.25)
```

`withdrawal_factor` = `withdrawn_K / gross_K` (adjusts for partial withdrawal).

### Missing Principal Warning

If `principal_manual_k` is `null` (not yet entered by user), the simulation:
- Cannot calculate tax on the Recognized bucket
- Shows a yellow ⚠️ warning in the bucket card and the accordion
- Displays `–` in the Tax stat card

The user must enter `principal_manual_k` via the fund's edit modal to get an accurate tax calculation.

### Bucket Flow UI

A persistent 3-card section above the sliders shows each bucket's lifecycle:
- **היום** (Today): Current balance from `balance_k`
- **מוקרן** (Projected): Projected value after compound growth × withdrawal factor
- **יעד** (Destination): Net to bank (after tax), or "מס" for the recognized bucket's tax portion

When `item.t190Buckets` is null (no XML loaded), mock data is injected using proportions:
`recognized = 53.9%`, `qualifying = 28.2%`, `exempt = 17.9%` of total balance.
A "⚡ נתוני דוגמה" badge indicates mock mode.
