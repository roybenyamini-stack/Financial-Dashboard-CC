# Knowledge Object: Tax Sensitivity Coefficient

**Rule ID:** SF-TAX-SENSITIVITY-COEFFICIENT
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-TAX-SENSITIVITY-COEFFICIENT` — the canonical statement of how Goose translates a change in a Study Fund's total value (gain or loss occurring after the report date) into a corresponding change in estimated tax, since a fresh bucket-by-bucket breakdown is not available for any date after the last annual report.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** Between the report date and today (or a future projected date), only the fund's *total* value is known — not a fresh per-bucket breakdown. Goose approximates the tax effect of this additional gain or loss using a single blended coefficient, applied uniformly to the whole delta, rather than re-deriving exact per-bucket tax. Two candidate ways to derive this coefficient exist: **the current implementation**, which blends a profit-weighted marginal rate with the fraction of the fund's value that is taxable at all; and a **research-supported candidate model**, which this session partially reproduced using real longitudinal data from a single fund, observed at three points in time (§3, §5).

**Human statement (Hebrew):** בין תאריך הדוח השנתי לבין היום (או תאריך עתידי מוערך), Goose יודע רק את השינוי בשווי הכולל של הקרן — לא פירוט מחודש לפי שכבות מס. Goose מעריך את השפעת המס על שינוי זה באמצעות מקדם מס אחד, המוחל על כל השינוי כאחד, ולא באמצעות חישוב מס מדויק מחדש לכל שכבה.

## 3. Evidence

This object's evidence is graded using this milestone's Product Owner-approved evidence-classification convention (Repository-verified / Independently inspected local report evidence / Roy-confirmed domain decision / Roy-supplied external analysis pending / Working Hypothesis / Unknown) — a milestone-specific convention, not one currently defined in `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md`. Where the template's own A/B/C source-quality grade also applies, it is noted separately; the two are not the same taxonomy.

**Current implementation — Level A (Repository-verified):**
- `app.js:20750-20756`: `_taxableRatio = max(0, 1 - (exemptTotal / pdfTotalBalance))`; `_effectiveTaxCoeff = marginalTaxRate × _taxableRatio` (falls back to `_taxableRatio × 0.25` when no marginal rate is available).
- `server.js:234-244`: `calculateMarginalTaxRate` — profit-weighted average rate across taxable-tier rows: `Σ(realProfit × rate) / Σ(realProfit)`.
- **Level B (pre-existing finding, logged in the Knowledge Architecture Foundation milestone)**: `docs/TaxLogic.md` §5.1a documents a different, stale formula (`pdfTierTaxK / pdfTotalBalanceK`) that does not match the live code; `israel_tax_rules.md`'s formula does match. This document (`SF-TAX-SENSITIVITY-COEFFICIENT`) is now the one authoritative statement — both `TaxLogic.md` and `israel_tax_rules.md` should become references or Generated Views of this object rather than independent restatements.

**Candidate model — Independently inspected local report evidence, this session.** Exact figures (the transition-by-transition real-profit and linkage delta ratios, and the fixed bucket-principal ratio) are not repeated here — see `docs/knowledge/study_fund/EVIDENCE_INDEX.md`, "Real Profit and Linkage — Deltas and Ratios Between Consecutive Report Years," for the table itself. Summary of what that table shows:

- Real profit and linkage were tracked **separately, not combined**, across the three clean (no-deposit) transitions available in the longitudinal series (2022→2023, 2023→2024, 2024→Dec2025).
- These are **three longitudinal, serially related observations from the same fund and the same bucket pair.** The same underlying fund and market conditions persist across all three periods, so they should be read as one longitudinal case examined at three points in time — not as three separate, unrelated confirmations.
- Linkage's delta ratio tracks the fixed bucket-principal ratio almost exactly across all three transitions — expected, since linkage is definitionally a function of principal, not a test of the coefficient model.
- Real profit's delta ratio is the actual test, and it stays **stable across three periods with very different absolute profit magnitudes** (growth roughly tripled between the first and third period), sitting consistently about 1.2% below the principal ratio.
- **This supports allocating post-report gain/loss by current bucket value more strongly than by historical profit composition** ("Model A" over "Model B" in prior planning terms) — three clean no-principal-change transitions from a single fund support this direction, not a single ambiguous data point. It does not resolve the ~1.2% stable gap, and it does not establish whether this pattern generalizes to other funds, other providers, or fund structures with more than two active tax-rate buckets — none of that was tested.

## 4. Model Assumptions

Both the current implementation and the candidate model assume that a single coefficient, applied uniformly to the whole post-report delta, is an adequate approximation for a fund with only a small number of tax-rate buckets (here: two). Neither model has been tested against a fund with three or four active buckets, where the approximation's error could plausibly be larger. Neither model attempts to re-derive an exact, fresh bucket-by-bucket breakdown for dates after the report — that would require a new annual report or a fresh evidence capture, not an estimation technique.

**Model Assumptions are not Simulation Assumptions** — see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` §6. The forward-looking investment-return/inflation/timeline assumptions that this coefficient is later applied against (in `SF-YTD-UPDATE` and `SF-FUTURE-PROJECTION`) are Simulation Assumptions, recorded once in `SF-TAX-MODEL` §8, not here.

## 5. Mathematical Model

**Current implementation (live code):**
```
taxableRatio      = max(0, 1 - (exemptPrincipal + exemptProfit) / pdfTotalBalance)
marginalTaxRate    = Σ(realProfit_bucket × rate_bucket) / Σ(realProfit_bucket)     [taxable buckets only]
effectiveTaxCoeff  = marginalTaxRate × taxableRatio
                     (falls back to taxableRatio × 0.25 if marginalTaxRate unavailable)
```

**Candidate model (not implemented in code; documented for comparison only, per explicit instruction not to recommend or implement a code change in this milestone):** allocate post-report gain/loss across buckets in proportion to each bucket's **current value** (this session's reproduction used principal as the size proxy, since principal was the only value stable enough across periods to serve as a fixed weight; total current bucket value, including profit-to-date, was not tested as an alternative weighting and is an open refinement) rather than each bucket's own historical profit composition.

## 6. Implementation

- `app.js:20750-20756` — `_taxableRatio`, `_effectiveTaxCoeff` (current implementation, live).
- `server.js:234-244` — `calculateMarginalTaxRate`.
- No implementation exists for the candidate model — none is proposed by this document.

## 7. Consuming Views

- **Reference**: `docs/TaxLogic.md` §5.1a and `israel_tax_rules.md` — both currently state a formula for this coefficient independently; per the Knowledge Architecture's SSOT rule, both should become references to this object rather than restating the formula. Not changed in this milestone (out of scope; flagged for a future milestone).
- **Reference**: `SF-TAX-MODEL` §3–§5 — this object is the third stage of the composed model, and its Interaction & Edge Cases discussion of the candidate model belongs there, citing this object rather than repeating it.

## 8. Validation

- No automated test exists for `_effectiveTaxCoeff`'s formula.
- This session's three-transition reproduction (§3) is real, independently-produced validation of the *candidate* model's plausibility — it is a one-time research finding, not a repeatable automated check, and does not validate the *current implementation's* formula (which was not being tested against real data here, only compared against the candidate).

## 9. Explainability

Since Goose only has a fresh per-bucket breakdown as of the fund's last annual report, any gain or loss after that date is translated into estimated tax using one blended rate rather than a fresh per-bucket calculation. The currently implemented rate blends the tax rate actually paid on the taxable portion with what fraction of the whole fund is taxable at all. Longitudinal analysis of one fund's real data across three years suggests that new gains are actually distributed across a fund's buckets roughly in proportion to how large each bucket already is, rather than in proportion to how much profit each bucket has separately accumulated — supporting one candidate refinement of the current approach, though this is a single-fund finding, not yet shown to generalize.

## 9a. Architectural Interpretation

*Drafted by Claude from approved discussions; pending explicit Product Owner validation. Document status remains Draft — see header. This subsection is an architectural interpretation only — it does not modify the mathematical model (§5), Confidence (§10), Evidence (§3), or Implementation (§6) sections above.*

Reconstruction (Annual Report → Today) is the primary source of uncertainty for this coefficient, not Projection (Today → Retirement). Projection is a forward simulation that, given the current modeled state, is internally consistent with the current tax-bucket allocation model. Future deposits, withdrawals, transfers, or other account events may legitimately change the bucket weights and therefore the effective coefficient going forward — this does not invalidate Projection; it simply means Projection is always run against the current state at the time it is run. The remaining uncertainty described in §10–§11 therefore belongs primarily to YTD reconstruction rather than to the forward projection itself.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Current implementation formula: High** (directly read from live code, internally consistent, matches `israel_tax_rules.md`'s independently-stated formula).

**Candidate model: Operationally Supported — limited single-fund longitudinal evidence.** Not Verified. Three clean no-principal-change transitions, from one fund's two tax-rate buckets, support allocation by current bucket value more strongly than by historical profit composition — this is real evidence, not a guess, but it is one longitudinal case observed at three points in time, not three separate trials. Generalization to other funds, other providers, and fund structures with more than two active tax-rate buckets remains unverified. The approximately 1.2% stable gap between the observed real-profit ratio and the fixed principal ratio remains unresolved.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Is the ~1.2% consistent gap between the real-profit growth ratio and the principal ratio meaningful (e.g. a genuine small return-rate difference between the two buckets), or is it within the noise of a two-bucket, single-fund sample?
2. Should the candidate model be tested against a different fund, a different provider, or a fund with three or four active buckets, where a stronger discriminating test between "principal-proportional" and "total-value-proportional" allocation — and a genuine test of generalization beyond this one fund — might be possible?
3. Was there a specific longitudinal analysis in the prior ChatGPT conversation that goes beyond what this session reproduced, that should be captured here explicitly?
