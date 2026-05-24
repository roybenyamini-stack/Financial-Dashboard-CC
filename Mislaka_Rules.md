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
