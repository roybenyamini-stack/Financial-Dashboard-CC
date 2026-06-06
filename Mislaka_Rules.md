# Mislaka (Israeli Pension Clearinghouse) XML Parser - Business Rules
**Version:** 1.2
**Purpose:** This document defines the strict business logic and routing rules for parsing XML files from the Israeli Pension Clearinghouse (Mislaka Pensyonit). Claude MUST read and adhere to these rules when modifying `app.js` related to the `Slikah`/`Mislaka` import flow.

## 1. Terminology & Entity Separation
CRITICAL: Do not confuse the managing entity with the actual financial product.
* **Provider (`שם יצרן` / `SHEM-YATZRAN`):** The managing body (e.g., "מור גמל ופנסיה", "הראל"). This is used for **display purposes only**. It MUST NEVER be used to determine the asset category (Pension vs. Investment).
* **Product/Category (`שם תוכנית` / `SHEM-TOCHNIT` / `רצומ םש`):** The actual financial product (e.g., "קרן השתלמות", "קופת גמל להשקעה"). **All routing logic MUST be based purely on this string.**

## 2. Smart Routing Logic (Investments vs. Pension)
Due to Hebrew text directionality in editors, always check for both normal and reversed strings in the Product Name.

* **Investment Keywords (`isInvest`):** `['גמל', 'למג', 'השתלמות', 'תומלתשה', 'להשקעה', 'העקשהל', 'חיסכון', 'ןוכסיח', 'תגמולים', 'םילומגת']`
* **Pension Keywords (`isPension`):** `['פנסיה', 'היסנפ', 'מנהלים', 'םילהנמ']`

**Routing Priority:**
1.  If the Product Name contains "גמל" / "למג" -> Route to **Investments** (Overrides everything else).
2.  Else if the Product Name contains any `isInvest` keyword -> Route to **Investments**.
3.  Else if the Product Name contains any `isPension` keyword -> Route to **Pension**.
4.  Fallback -> Route to **Pension**.

## 3. Data Transformation & Filtering

### 3a. Balance Fallback Chain
To find the raw balance for a product, check tags in this strict priority order:
1. `<ITRA-TZVURA>`
2. `<TOTAL-CHISACHON-MTZBR>`
3. `<SCHUM-TZVIRA-BAMASLUL>`

Only skip the asset (Ghost Filter) if ALL three tags are absent or all resolve to less than 1,000 NIS.

* **K-Rounding:** All raw balances must be converted to thousands, rounded down (`Math.floor(rawBalance / 1000)`).
* **Ghost Filter:** Any product with a resolved raw balance of less than 1,000 NIS (after the fallback chain) must be completely skipped and excluded from the dashboard. **Exception: Vatika funds (see Rule 6) are NEVER filtered by this rule.**

## 4. Upsert Mechanism (Reconciliation)
When pushing parsed products into the global state (`FFS_PROFILE`), the parser must avoid duplicates:
* Identify existing assets by matching the Policy/Account Number (`MISPAR-POLISA-O-HESHBON`).
* **If a match exists:** Update ONLY the balance value (and Vatika fields if applicable). Preserve the user's existing name, category, and manual UI configurations.
* **If no match exists:** Push the new asset into the relevant bucket using the standard schema.

## 5. User Experience (UX)
* The success modal (`statusEl`) must explicitly state the breakdown of the action: `✅ סיום יבוא: [X] חדשים | [Y] עודכנו | [Z] דולגו (<1K)`.
* **Policy Number Transparency:** Immediately below the count summary, the modal MUST display the specific policy numbers (`MISPAR-POLISA-O-HESHBON`) for each action group on separate lines, rendered as HTML (`innerHTML`):
  * `חדשים: <comma-separated list or —>`
  * `עודכנו: <comma-separated list or —>`
  * `דולגו: <comma-separated list or —>`
  The user must be able to read these numbers directly in the UI without opening DevTools.
* The modal must remain open for **7000ms** (7 seconds) before automatically closing, allowing the user sufficient time to read the summary.
* After the import is completed, the dashboard MUST NOT forcefully switch the active UI tab or focus to the Pension section. It should maintain the user's current view.

## 6. Legacy Pension — Vatika (עמיתים / קרן ותיקה)
* **Detection:** If `<PENSIA-VATIKA-O-HADASHA>` equals `1`, the asset is a legacy (Vatika) pension fund.
* **Balance:** For Vatika funds, completely ignore the balance fallback chain (Rule 3a). Do NOT apply the Ghost Filter (<1K rule). Set `accumulation` to `0`.
* **Field Extraction:**
  * `<KITZVAT-HODSHIT-TZFUYA>` → maps to `monthlyPension` (expected monthly pension payout).
  * `<AHUZ-PENSIYA-TZVURA>` → maps to `contributionPct` (accumulated pension percentage).
* **Schema:** Push with `pensionSubtype: 'vatiqa'` (NOT `'old'`). All modal radio-button checks and simulator Route-B branching in `app.js` use the string `'vatiqa'` — using any other value silently breaks Vatika calculation logic.

## 7. Bituach Menahalim Auto-Detection
* **Detection:** If `SHEM-TOCHNIT` (Product Name) **or** `SHEM-YATZRAN` (Provider Name) contains "מנהלים" or its RTL-reversed form "םילהנמ", automatically set:
  * `isBituachMenahalim: true`
  * `pensionType: 'manager'`
  in the parsed product object.
* This detection runs on both new and existing (upserted) assets.

## 8. Balance Extraction — Max-Sum Heuristic
To extract the raw balance for a non-Vatika account node, collect **all** matching elements within the specific account scope and apply:
* `Math.max` over all `<TOTAL-CHISACHON-MTZBR>` values → `maxTotal`
* `Math.max` over all `<ITRA-TZVURA>` values → `maxItra`
* `sum` of all `<SCHUM-TZVIRA-BAMASLUL>` values → `sumTracks`
* `rawBalance = Math.max(maxTotal, maxItra, sumTracks)`

This handles nesting correctly: policy-level totals naturally dominate track-level values, and multi-track products are summed rather than using only the first match.

* **PerutYitrot Fallback:** If `rawBalance` is still 0 after the Max-Sum heuristic (all three primary tags absent or zero within the account node), sum all `<TOTAL-CHISACHON-MTZBR>` elements scoped inside `<PerutYitrot>` children. Use that sum as `rawBalance`. This handles older Bituach Menahalim formats (e.g. Harel pre-2000) that only expose per-track subtotals with no policy-level aggregate.

## 9. Account-Level Scoping (PascalCase container nodes)
Assets MUST be split by iterating over `<HeshbonOPolisa>` child nodes within each `<Mutzar>`, not one per `<Mutzar>`. This prevents providers like Altshuler or Meitav from having all their grouped policies collapsed into a single asset.
* Container/block nodes in Mislaka XML use **PascalCase without dashes**: `<Mutzar>`, `<HeshbonOPolisa>`, `<Maslulit>`.
* Data-field nodes use **ALL-CAPS with dashes**: `<MISPAR-POLISA-O-HESHBON>`, `<TOTAL-CHISACHON-MTZBR>`.
* Fallback: if a `<Mutzar>` has no `<HeshbonOPolisa>` children, treat the `<Mutzar>` itself as the single account node.

## 10. Account Status (`isActive`)
* **Source tags (in priority order):** `<KOD-STATUS-HESHBON>`, `<STATUS-HESHBON>`, `<KOD-STATUS-KUPA>`, `<STATUS-POLISA-O-CHESHBON>` — first match wins.
* **Default:** If no tag is found, or if the value is empty, the account is considered active (`isActive: true`). Active accounts frequently omit the status tag entirely.
* **Explicit inactive codes:** '2', '3', '4' (and other frozen/closed codes) → `isActive: false`. Any other value (including '1', empty string, or missing) → `isActive: true`.
* This value MUST be passed through to the `FFS_PROFILE` asset on both new-push and update (upsert) paths. Do not hardcode `isActive: true`.

## 11. Bituach Menahalim Classification (Scalable Keyword Dictionary)
* **Detection keyword list (`MGR_KEYWORDS`):** `['מנהלים', 'םילהנמ', 'מעולה', 'הלועמ', 'עדיף', 'ףידע', 'גמלא', 'אלמג', 'ביטוח חיים', 'םייח חוטיב']`
* Apply `.some()` iteration against both `SHEM-TOCHNIT` (product name) and `SHEM-YATZRAN` (provider name).
* If any keyword matches → `isBituachMenahalim: true`, `pensionType: 'manager'`.
* **Scalability rule:** Do NOT hardcode individual string checks. Add new product-name patterns only to this list — never add new `indexOf` calls inline.

## 12. Study Funds (קרן השתלמות) - Data Extraction & Logic
This section defines universal business logic for Study Funds. The rules apply to all managing bodies because the XML schema from the Mislaka Pensyonit is standardized across providers.

### 12a. Data Nodes
Target the `BlockItrot` and `NesilutTag` blocks for each product where the product name indicates a Study Fund (i.e., contains "השתלמות" or its RTL-reversed form "תומלתשה").

### 12b. Liquidity Status
Extract `<MOED-NEZILUT-TAGMULIM>` (the liquidity date):
* If the date has **passed** relative to today → mark as **נזיל** (Liquid).
* If the date is in the **future** → calculate and display the remaining time (e.g., "עוד X שנים וY חודשים").
* If the tag is absent or `xsi:nil="true"` → apply the missing-data UI treatment (see Rule 12f). Do NOT assume liquid or non-liquid.

### 12c. Tax Parsing — The Ceiling Rule
Scan all `PerutYitraLeTkufa` blocks within the account node and read the `<TIKRAT-HAFKADA-MUTEVET>` field:
* **Value `1`:** Funds deposited **up to** the annual ceiling → **100% Tax Exempt**. No capital gains tax applies to profits from these funds.
* **Value `2`:** Funds deposited **above** the annual ceiling → Profits on these specific funds are subject to **25% capital gains tax**.

A single Study Fund account may contain multiple `PerutYitraLeTkufa` segments — each with its own `TIKRAT-HAFKADA-MUTEVET` value. Process them independently.

### 12d. Profit Calculation for Taxable Segments
For each `PerutYitraLeTkufa` segment where `TIKRAT-HAFKADA-MUTEVET` equals `2`:
* **Taxable Profit** = `SACH-ITRA-LESHICHVA-BESHACH` (total accumulation for this segment) − total deposits for this segment.
* The result is the gross taxable gain. Apply the 25% rate to this figure to derive the tax liability for the segment.
* Sum tax liabilities across all Value-`2` segments to get the total fund-level tax exposure.

### 12e. Partial Withdrawal — Proportionality Rule (כלל היחסות)
When a user simulates a partial withdrawal:
* The tax liability is **exactly proportional** to the withdrawal percentage.
* Formula: `Tax Due = Total Tax Liability × (Withdrawal Amount / Total Fund Balance)`.
* Example: withdrawing 50% of the fund triggers exactly 50% of the total calculated tax liability.
* This rule applies regardless of which segment (ceiling vs. above-ceiling) the withdrawal is drawn from — the proportionality is applied at the fund level, not the segment level.

### 12f. Missing Data UI Treatment
Applies to all fields within the Study Fund data nodes, including numeric balances, dates, and coded values:
* Before reading any field, check for `xsi:nil="true"` on the element.
* If `xsi:nil="true"` is present **or** the tag is entirely absent:
  * **Do NOT** fallback to `0` or any default numeric value — a zero balance or a zero date is materially misleading in financial data.
  * Leave the rendered UI field **empty** (blank string).
  * Apply a **light yellow background** to that specific UI field to visually alert the user that data is missing.
  * This treatment must be consistent with the existing dashboard `_nullBg` pattern used elsewhere in the UI.
