# Israeli Tax Rules: Keren Hishtalmut
1. Layers: The balance consists of Exempt Principal (deposits up to ceiling), Exempt Profit, Taxable Principal (deposits above ceiling), and Taxable Profit.
2. Tax Rate: Only the "Taxable Profit" is taxed upon withdrawal, at a rate of 25% Capital Gains Tax.
3. CGT Calculation (v181.76): Use NOMINAL profit (no inflation adjustment). The inflation slider only affects forward projections (growthF). Real CGT (nominal minus CPI adjustment) will be re-enabled once a historical CPI API is integrated.
4. UI Heuristic: If exact historical data (Exempt vs. Taxable) is missing from an annual report, assume all is taxable, but boldly flag the calculation in the UI with a "Low Confidence" warning. Prompt the user to "Upload Annual Report PDF" or manually enter the exact Exempt/Taxable split for high accuracy.
