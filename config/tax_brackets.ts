/**
 * tax_brackets.ts — Israel Pension Tax Configuration 2026
 * Used by: calculate_pension_net (placeholder → v70.0 full implementation)
 */

// ─── Marginal Income Tax Brackets (Israel 2026, monthly) ──────────────────────
export interface TaxBracket {
  upTo: number;   // monthly income ceiling (ILS); Infinity = no ceiling
  rate: number;   // marginal rate (0–1)
}

export const INCOME_TAX_BRACKETS_2026: TaxBracket[] = [
  { upTo:  6_790, rate: 0.10 },
  { upTo:  9_730, rate: 0.14 },
  { upTo: 15_620, rate: 0.20 },
  { upTo: 21_910, rate: 0.31 },
  { upTo: 45_070, rate: 0.35 },
  { upTo: 57_790, rate: 0.47 },
  { upTo: Infinity, rate: 0.50 },
];

// ─── Pension-Specific Exemptions ──────────────────────────────────────────────
export const PNS_MONTHLY_EXEMPT      =  9_430;   // ₪/month tax-free pension
export const PNS_CAPITAL_EXEMPT      = 800_000;  // ₪ lump-sum (היוון) exemption
export const PNS_MARGINAL_RATE       = 0.30;     // marginal rate on excess pension
export const PNS_CAPITAL_GAINS_RATE  = 0.25;     // rate on investment gains (רווח הון)

// ─── National Insurance (ביטוח לאומי) rates ───────────────────────────────────
export const NI_RATE_BELOW_FLOOR = 0.031;
export const NI_RATE_ABOVE_FLOOR = 0.12;
export const NI_INCOME_FLOOR     = 6_940;  // ₪/month (שכר מינימום 2026)

// ─── Placeholder — to be fully implemented in v70.0 ──────────────────────────
export interface PensionNetResult {
  grossMonthly:   number;
  exemptMonthly:  number;
  taxableMonthly: number;
  taxMonthly:     number;
  netMonthly:     number;
  // capital path
  grossCapital:   number;
  exemptCapital:  number;
  taxCapital:     number;
  netCapital:     number;
}

/**
 * calculate_pension_net
 * Computes net pension income after applying Israeli 2026 tax rules.
 *
 * @param grossMonthly     - Gross monthly pension (קצבה ברוטו) in ILS
 * @param totalAccumulation - Total accumulated capital (הון צבור) in ILS
 * @param pensionExemptPct  - % of monthly exemption allocated to pension (0–100)
 * @param capitalExemptPct  - % of capital exemption allocated to lump-sum (0–100)
 * @returns PensionNetResult (placeholder — returns gross until v70.0)
 */
export function calculate_pension_net(
  grossMonthly:      number,
  totalAccumulation: number,
  pensionExemptPct:  number,
  capitalExemptPct:  number,
): PensionNetResult {
  // TODO v70.0: implement full marginal tax calculation using INCOME_TAX_BRACKETS_2026
  return {
    grossMonthly,
    exemptMonthly:  0,
    taxableMonthly: grossMonthly,
    taxMonthly:     0,
    netMonthly:     grossMonthly,   // placeholder = gross
    grossCapital:   totalAccumulation,
    exemptCapital:  0,
    taxCapital:     0,
    netCapital:     totalAccumulation, // placeholder = gross
  };
}
