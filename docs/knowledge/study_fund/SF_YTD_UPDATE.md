# Knowledge Object: Year-to-Date (YTD) Update

**Rule ID:** SF-YTD-UPDATE
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-YTD-UPDATE` — the canonical statement of how Goose estimates the change in a Study Fund's real profit between the last annual report date and today, before applying `SF-TAX-SENSITIVITY-COEFFICIENT`.

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Builder statement (English):** The current balance minus the report-date balance gives a raw delta. For an **inactive** fund (no ongoing salary deposits), this raw delta is treated entirely as investment profit. For an **active** fund, deposits made since the report date must be netted out of the delta first, or they would be misread as profit; Goose does this by preferring a manually-entered deposit figure, else scanning the fund's own XML for dated deposit records after a cutoff, else extrapolating forward from the last known deposit amount for a 1–6 month gap. A negative delta (a loss) is preserved as such, not floored to zero, so that losses reduce — never increase — the estimated tax.

**Human statement (Hebrew):** ההפרש בין היתרה הנוכחית ליתרה בדוח השנתי האחרון הוא שינוי גולמי. בקרן **לא פעילה** (ללא הפקדות שכר שוטפות), השינוי הגולמי הזה נחשב כולו לרווח השקעה. בקרן **פעילה**, יש לנכות תחילה הפקדות שבוצעו מאז הדוח, אחרת הן ייחשבו בטעות לרווח.

## 3. Evidence

- **Level A (Repository-verified)**: `app.js:20757-20817` — `_deltaK = baseK - _pdfBalK`; for `item.isActive` funds, deposit-netting logic in priority order: manual override (`_sfManualDeposits`) → XML-scanned `PerutHafkadotMetchilatShana` elements dated after a Jan-1 cutoff → 1–6 month auto-fill extrapolation from the last known deposit amount; `_realYtdProfitK = max(0, _deltaK)` after netting.
- **Level B (project documentation, pre-existing)**: `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md` §1.7–1.8 already documents the active-vs-inactive distinction and flags active-fund confidence as lower, consistent with this object.

## 4. Model Assumptions

The deposit-netting logic assumes any XML-recorded deposit after the cutoff date genuinely represents a new contribution, not a correction or reclassification of an earlier entry. The 1–6 month auto-fill extrapolation assumes a constant monthly deposit rate equal to the last known amount — it does not model a changed salary or a paused contribution within that gap. `_realYtdProfitK` is floored at zero for the *delta after netting*, but the raw delta itself (before the floor) can be negative — a real loss is preserved, not hidden, up to that floor.

**Model Assumptions are not Simulation Assumptions** — see `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md` §6.

## 5. Mathematical Model

```
deltaK = currentBalanceK - reportDateBalanceK

if fund.isActive:
  depositsK = manualOverride
              OR sum(XML deposits dated after Jan-1 cutoff)
                 + (if 1–6 month gap since last known deposit: gapMonths × lastDepositAmountK)
  deltaK = max(0, deltaK - depositsK)

realYtdProfitK = max(0, deltaK)
ytdTaxDueK     = realYtdProfitK × effectiveTaxCoeff        [from SF-TAX-SENSITIVITY-COEFFICIENT]
```

## 6. Implementation

- `app.js:20757-20817` — full YTD delta and deposit-netting logic, inside `_sfRecalculate`.

## 7. Consuming Views

- **Reference**: `SF-TAX-MODEL` §3–§4 — this object is the fourth stage of the composed model.
- **Reference**: `docs/modules/study_fund/STUDY_FUND_CAPABILITY.md` §4 — cites this Rule ID instead of restating the deposit-netting logic.

## 8. Validation

- No automated test exists for the deposit-netting or auto-fill-extrapolation logic.
- `docs/modules/study_fund/STUDY_FUND_CAPABILITY_REVIEW.md` §1.7 already flags this as a lower-confidence path for active funds — consistent with, not contradicted by, anything found this session.

## 9. Explainability

To estimate how much a Study Fund has grown since its last annual report, Goose compares the current balance to the report-date balance. If the fund is still receiving regular salary-linked deposits, Goose subtracts those deposits first (using an explicit entry if you've provided one, otherwise scanning available records, otherwise a short reasonable estimate) so that new contributions aren't mistaken for investment growth.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Medium** for inactive funds (simple, direct delta, no netting ambiguity). **Medium-Low** for active funds (netting depends on manual entry, XML completeness, or a short extrapolation window) — matching the existing Review document's own assessment, not a new finding.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Is the 1–6 month auto-fill extrapolation window (rather than, say, a shorter or longer window) based on a specific reasoning documented anywhere, or is it a pragmatic default that should itself be revisited?
