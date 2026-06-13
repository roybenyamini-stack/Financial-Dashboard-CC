# Israeli Tax Rules: Keren Hishtalmut
1. Layers: The balance consists of Exempt Principal (deposits up to ceiling), Exempt Profit, Taxable Principal (deposits above ceiling), and Taxable Profit.
2. Tax Rate: Only the "Taxable Profit" is taxed upon withdrawal, at a rate of 25% REAL Capital Gains Tax (מס רווחי הון ריאלי).
3. Real Tax Logic: Nominal Profit minus Inflation Adjustment (Inflation rate * Taxable Principal). If Real Profit <= 0, tax is 0.
4. UI Heuristic: If exact historical data (Exempt vs. Taxable) is missing from an annual report, assume all is taxable, but boldly flag the calculation in the UI with a "Low Confidence" warning. Prompt the user to "Upload Annual Report PDF" or manually enter the exact Exempt/Taxable split for high accuracy.
