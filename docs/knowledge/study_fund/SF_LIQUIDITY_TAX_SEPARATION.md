# Knowledge Object: Liquidity / Tax Separation

**Rule ID:** SF-LIQUIDITY-TAX-SEPARATION
**Domain:** Study Fund
**Version 1.0 — Draft**

**Author:** Claude Code
**Approved by (Product Owner):** Roy — (pending)

---

## 1. Rule ID & Name

`SF-LIQUIDITY-TAX-SEPARATION` — the canonical boundary rule separating *withdrawal eligibility (liquidity)* from *tax-bucket taxability*, and the reframing of the Study Fund vesting-exemption conflict that originally motivated the Knowledge Architecture Foundation milestone (see `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §13). This object is a **boundary/interaction rule** — it is referenced by `SF-TAX-MODEL` as a cross-cutting constraint, not inserted as a mathematical stage in the tax-calculation chain (it does not appear in `SF-TAX-MODEL` §4's Composed Model formula).

## 2. Reality

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

This object states two distinct claims, evidenced differently, and they must not be conflated.

**Statement A — Product/model boundary (Roy-confirmed domain decision):**
- Liquidity/withdrawal eligibility determines whether a withdrawal can actually be performed at a selected date.
- Liquidity does not block Goose from calculating a What-If withdrawal scenario for any date, including a date at which the fund may not actually be liquid.
- The Tax Model estimates tax for a selected date and withdrawal amount/percentage; withdrawal feasibility is parallel information, not a tax-formula input.

**Statement B — Legal/tax claim (not settled by Statement A; evidenced separately, and only partially):**
- Reaching liquidity/seniority does not, by itself, erase taxable above-ceiling tax buckets.

**Builder statement (English):** Statement A is a product-design decision, not a claim about the world — it needs no external evidence to justify, only Roy's explicit confirmation. Statement B is a claim about Israeli tax law; it is supported by, but not conclusively established by, the evidence in §3 below.

**Human statement (Hebrew):** קביעה A: נזילות/זכאות למשיכה אינה חוסמת את חישוב ה-What-If של Goose — זו החלטת מוצר. קביעה B: הגעה לנזילות/ותק אינה מוחקת כשלעצמה את חבות המס על שכבות חייבות מעל התקרה — זו טענה משפטית, הנתמכת חלקית בלבד בראיות שנאספו.

## 3. Evidence

This object's evidence is graded using this milestone's Product Owner-approved evidence-classification convention (Repository-verified / Independently inspected local report evidence / Roy-confirmed domain decision / Roy-supplied external analysis pending / Working Hypothesis / Unknown) — a milestone-specific convention, not one currently defined in `docs/foundation/GOOSE_KNOWLEDGE_ARCHITECTURE.md`. Where the template's own A/B/C source-quality grade also applies, it is noted separately; the two are not the same taxonomy.

**For Statement A:**
- **Roy-confirmed domain decision** — this is a product/business decision Roy is stating as policy, graded as such (not A/B/C evidence-quality, since it is not a claim to be verified against a source).
- **Level A (Repository-verified), supporting evidence that today's code already behaves this way**: a targeted search of the modern Study Fund simulator (`ffsOpenStudyFundModal`, `_sfCalculateTax`, `_sfRecalculate`) found no liquidity/eligibility gate of any kind. The only `liquidity` field anywhere in the codebase belongs to the separate, legacy Excel-mode `FUNDS` data structure, unrelated to the FFS_PROFILE-based simulator this milestone documents — an absence-of-evidence finding (a targeted, not exhaustive, search), consistent with, not contradicting, Statement A.

**For Statement B:**
- **Level A (Independently inspected local report evidence, this session)**: the actual B.8 tables in both real reports examined (`docs/knowledge/study_fund/EVIDENCE_INDEX.md`) classify every bucket purely by **deposit-era** and **ceiling-position** — there is no seniority, age, or "years held" field anywhere in the bucket structure itself. The rate a bucket carries is fixed by *when the money went in*, not by *how long it has been held* relative to today. This is real, positive evidence that the report's own classification mechanism does not implement a seniority-based exemption switch.
- **What this does not settle**: whether Israeli tax law provides some *other* exemption mechanism that applies only at the moment of actual withdrawal — not visible in a holdings report, which shows current tax-bucket composition, not a withdrawal event — is a separate question this evidence cannot answer.
- Annual reports **can** strengthen the operational evidence about how providers preserve and display tax buckets over time and across a provider transfer (exactly what `SF-B8-TAX-RIGHTS` §3 demonstrates). Annual reports **alone cannot establish** the governing legal rule for what happens at actual withdrawal. Closing the legal conclusion requires a primary legal/regulatory source (the statutory text of the relevant tax reform) or a suitably authoritative professional source — not merely more reports of the same kind already examined.

## 4. Model Assumptions

Statement A is a permanent product-design decision, not a modeling simplification subject to revision by new evidence. Statement B's status as Unknown (§10) is itself a Model Assumption of every other Study Fund Knowledge Object that touches taxability: none of them assume a seniority-based exemption exists or apply one, pending resolution of this open question.

**Model Assumptions are not Simulation Assumptions** — not applicable to this object.

## 5. Mathematical Model

This object states a boundary condition, not a formula. No mathematical model is asserted here; `SF-REPORT-DATE-TAX` and `SF-TAX-SENSITIVITY-COEFFICIENT` state the actual tax arithmetic, unconditioned on liquidity, consistent with Statement A.

## 6. Implementation

- No dedicated implementation exists for this boundary rule specifically — its evidentiary support is the *absence* of a liquidity gate in `app.js`'s Study Fund simulator functions (`ffsOpenStudyFundModal`, `_sfCalculateTax`, `_sfRecalculate`), confirmed by targeted search this session.

## 7. Consuming Views

- **Reference**: `SF-TAX-MODEL` §5 (Interaction & Edge Cases) — this object is cited there as the resolution of the historical vesting-exemption interaction question, with Statement B's open status carried forward explicitly, not smoothed over.
- **Reference**: `docs/foundation/GOOSE_DOCUMENTATION_GOVERNANCE.md` §13 — the reframed debt entry cites this object by Rule ID.
- **Canonical reframing and reference target**: `docs/TaxLogic.md` §3.1/§5.1 and `israel_tax_rules.md`'s binary "fund becomes fully exempt after six years" statements should become references to this object (and to `SF-B8-TAX-RIGHTS`/`SF-REPORT-DATE-TAX` for the actual tax mechanics) rather than independent restatements — not changed in this milestone (out of scope; flagged for a future milestone). This object **replaces the old conflated wording as the canonical reference point going forward**; it does **not** declare the unresolved legal rule at actual withdrawal (Statement B) settled — only that the conceptual conflation the old wording embodied is resolved, while the underlying legal question remains open, per §10–§11.

## 8. Validation

- No automated test exists for this boundary rule (it is a design principle, not a computation).
- The absence-of-liquidity-gate finding (§3) was produced by a targeted code search this session, not a systematic audit — a broader search could still surface an edge case not found here.

## 9. Explainability

Goose separates two different questions that used to be blurred together: *can this money actually be withdrawn on the date you're asking about* (a liquidity question, which never blocks a What-If estimate) versus *how much tax would be owed if it were withdrawn* (a tax question, which depends on the fund's tax-bucket composition, not on whether you're currently eligible to withdraw). The real annual reports examined support that a fund's tax buckets are classified by when money went in, not by how long you've held the account — but whether Israeli law has some separate rule that kicks in specifically at the moment of withdrawal, once you've reached a certain number of years or age, is still an open legal question this milestone does not resolve.

## 10. Confidence

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

**Statement A: High** — Roy-confirmed product decision, consistent with current code behavior. **Statement B: Unknown** — reframed with supporting operational evidence, but explicitly not resolved as a matter of law; this must not be described as "superseded" or "resolved," only as reframed with a clearer boundary and a named, still-open question.

## 11. Open Questions for Roy

*Drafted by Claude from approved discussions and evidence; pending explicit Product Owner validation. Document status remains Draft — see header.*

1. Does Israeli tax law provide any seniority/age-based exemption mechanism that applies specifically at the moment of Study Fund withdrawal, separate from the deposit-era/ceiling bucket classification shown in an annual report?
2. If such a mechanism exists, does it modify the bucket rate itself, or apply as a separate adjustment after `SF-REPORT-DATE-TAX`'s calculation?
3. Is a primary source (the statutory text, or a professional tax opinion) available or obtainable to close Question 1, rather than relying on further annual-report inspection, which cannot settle it?
