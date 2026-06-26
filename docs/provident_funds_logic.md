# Provident Fund Logic — Amendment 190 (תיקון 190)

## Scope

Applies **only** to assets with `category === 'קופת גמל'` (standard employer provident fund).

`'קופת גמל להשקעה'` (Investment Provident Fund, introduced 2016) is **explicitly excluded** — it uses a flat 25% CGT on real capital gains and has no Amendment 190 bucket concept.

---

## The Three Amendment 190 Buckets

Amendment 190 allows provident fund members to redirect accumulated savings from a capital withdrawal track to a pension annuity track. The balance is split across three tax tracks:

| Bucket | Hebrew | Internal Key | XML Source | Tax Treatment |
|--------|--------|--------------|------------|---------------|
| Qualifying annuity | קצבה מזכה | `qualifying_annuity` | `tikrat=2` | Progressive tax if withdrawn as capital; uses lifetime annuity exemption quota if converted to pension |
| Recognized annuity | כסף מוכר | `recognized_annuity` | Residual (`total - tikrat1 - tikrat2`) | Tax-free if converted to pension annuity (already-taxed principal) |
| Capital exempt | הוני פטור | `capital_exempt` | `tikrat=1` | Exempt from capital gains tax (pre-2000 or other exempt contributions) |

### Schema

```javascript
{
  // ... standard investment asset fields ...
  buckets: {
    qualifying_annuity: { balance_k: number },
    recognized_annuity: { balance_k: number, principal_manual_k: number | null },
    capital_exempt:     { balance_k: number }
  },
  manual_override:          boolean,   // true after any manual balance save
  last_manual_update_date:  string | null,  // ISO date YYYY-MM-DD
  dec_31_anchor_k:          number | null   // explicit Dec 31 balance for YTD
}
```

`principal_manual_k` under `recognized_annuity` is the original post-tax principal, sourced from the user's annual tax report (דוח שנתי). It cannot be derived from the clearinghouse XML.

---

## XML Extraction (Clearinghouse / מסלקה)

**Extraction date:** `TAARICH-NECHONUT` element (YYYYMMDD) → normalized to `YYYY-MM-DD` → stored as `xmlDataDate` on the parsed product.

**Bucket balances:** `PerutYitraLeTkufa` segment elements:
- `TIKRAT-HAFKADA-MUTEVET = 1` → `capital_exempt.balance_k`
- `TIKRAT-HAFKADA-MUTEVET = 2` → `qualifying_annuity.balance_k`
- `total - tikrat1 - tikrat2` → `recognized_annuity.balance_k` (residual)

**Guard:** If `TIKRAT-HAFKADA-MUTEVET` has attribute `xsi:nil="true"`, the segment is skipped. When no valid segments exist, `t190Buckets` is `null` and existing bucket data is preserved.

---

## Pre-2008 Legacy Funds — Critical Routing Rule

### Identification

A product is a **pre-2008 provident fund** when:

| XML Field | Value |
|-----------|-------|
| `SUG-MUTZAR` | `'3'` (product type = provident fund / קופת גמל) |
| `TAARICH-HITZTARFUT-RISHON` | `< '20080101'` (first join date before Jan 1, 2008, compared as YYYYMMDD string) |

### Routing Rule

For these funds, **all** accumulated balance (`TOTAL-CHISACHON-MTZBR`) **must** be routed to `capital_exempt`. The `PerutYitraLeTkufa` tikrat values may not be present or meaningful — do not use the residual route.

```javascript
// In _salkahParseOneXML — after the tikrat segment loop:
if (type === '3') {
  var _firstJoin = _salkahXmlEl(node, 'TAARICH-HITZTARFUT-RISHON')?.textContent.trim().replace(/-/g, '') || '';
  if (_firstJoin && _firstJoin < '20080101') {
    _t190Buckets = {
      qualifying_annuity: { balance_k: 0 },
      recognized_annuity: { balance_k: 0, principal_manual_k: null },
      capital_exempt:     { balance_k: (rawBalance || 0) / 1000 }
    };
  }
}
```

**Why:** Before 2008, provident fund contributions were not subject to Amendment 190's qualifying/recognized annuity framework. The entire accumulated balance is treated as exempt capital (`הון פטור`). Routing it to `recognized_annuity` (the default residual) is legally incorrect and produces wrong simulation output.

### Schema Gotcha — `capital_exempt` Must Always Exist

The save function (`ffsSaveInvFromModal`) writes directly to `_editedInv.buckets.capital_exempt.balance_k`. If an investment was saved with old bucket data missing the `capital_exempt` key (schema migration scenario), this causes a silent TypeError.

**Guard that must be present before the bucket write:**

```javascript
if (!_editedInv.buckets) _editedInv.buckets = _t190InitBuckets();
if (!_editedInv.buckets.capital_exempt) _editedInv.buckets.capital_exempt = { balance_k: 0 };
```

`_t190InitBuckets()` always initializes all three keys — use it as the canonical initializer.

### Form Validation Gotcha — XML Assets May Lack Required Dropdown Fields

XML-imported provident funds are created with `type: ''` (no מסלול track selected). The save modal validates that `category`, `type`, and `liquidity` are non-empty before saving. If the user clicks Save without filling in `type`, the save fails silently — the button does nothing with no error message.

**Rule:** Always surface validation failures explicitly. The current implementation flashes the Save button red with the message `⚠️ יש למלא שדות חובה` and emits `console.warn('[FFS Save] blocked — missing required fields')` so the blocked field can be identified.

---

## Analysis Modal Data Flow (`_t190SimGetBuckets`)

The T190 Simulation / Analysis modal calls `_t190SimGetBuckets(item)` to obtain the bucket distribution for display and simulation. This function has three priority branches:

| Branch | Condition | Source | Notes |
|--------|-----------|--------|-------|
| **A** | `manual_override === true` AND `dec_31_anchor_k > 0` | Scales stored ratios against anchor | Most precise; used when user has set an explicit Dec 31 anchor |
| **B** | `manual_override !== true` AND `rawXml` present AND ≥2 non-zero buckets in reparsed XML | Re-parses `rawXml` via `_parseT190BucketsFromXML` | Only works for XML files using `KOD-TECHULAT-SHICHVA` field names (some clearinghouse formats) |
| **B'** | `item.buckets` has ≥1 non-zero value | Uses `item.buckets` directly, scales by `currentBalance / bucketSum` | Fallback for pre-2008 funds and any fund where `_parseT190BucketsFromXML` returns null (field name mismatch between clearinghouse formats) |
| **C** | All above fail | Returns `isEmpty: true` | Shows "⚠️ חסרים נתוני חלוקת שכבות" warning |

**Key distinction — two XML field schemas:**

`_salkahParseOneXML` reads `TIKRAT-HAFKADA-MUTEVET` from `PerutYitraLeTkufa` nodes.  
`_parseT190BucketsFromXML` reads `KOD-TECHULAT-SHICHVA` from the same nodes.

These are **different field names** from different clearinghouse format versions. Branch B only works when the raw XML uses `KOD-TECHULAT-SHICHVA`. Branch B' exists precisely to handle all other cases using the pre-computed `item.buckets`.

---

## Manual Override Protection

When a user manually saves a balance in the edit modal, `manual_override` is set to `true` and `last_manual_update_date` is set to today (`YYYY-MM-DD`).

On the next XML import, the merge logic compares dates:

```
if (item.manual_override === true
    && item.last_manual_update_date
    && xmlDateObj
    && new Date(item.last_manual_update_date) > xmlDateObj) {
  // SKIP — user's manual save is newer than XML data date
}
```

The balance and bucket data are **not overwritten** when the item is protected. `isActive` and `needsReview` are still updated regardless of protection status.

**Releasing the lock:** To allow the next XML import to overwrite, the user can clear `manual_override` (future UI enhancement), or it will reset automatically if they do not manually edit the balance after an import.

---

## Proportional Bucket Update

When the user edits `total_balance_k` manually, each bucket is rescaled proportionally to maintain the existing distribution:

```
new_bucket_k = round((old_bucket_k / old_total) * new_total, 3)
```

If `old_total ≤ 0` (no prior bucket data), no update is performed and buckets remain at zero until the next XML import populates them.

---

## Dec 31 YTD Anchor (`dec_31_anchor_k`)

The user fills this field **once a year** (in January, after receiving their annual Dec 31 statement or tax report). It is a plain numeric input — no auto-detection or auto-locking.

**YTD formula:**
```
ytdPct = (current_balance - dec_31_anchor_k) / dec_31_anchor_k × 100
```

If `dec_31_anchor_k` is `null` or `0`, YTD is **not calculated or displayed** in the asset card.

The anchor is displayed as a badge in the investment card: `YTD: +5.2% (מול 31/12)`.

---

## UI States

| Condition | UI Effect |
|-----------|-----------|
| `recognized_annuity.balance_k > 0` AND `principal_manual_k === null` | "כסף מוכר" cell gets yellow background (`#fff9c4`) and amber border — missing data warning |
| `qualifying_annuity.balance_k > 0` AND `designation === 'capital'` | Red warning banner: "⚠️ צבירה בקצבה מזכה עם ייעוד הוני — משיכה הונית חייבת ב-35% מס" |
| `manual_override === true` | Yellow badge shows override date: "🔒 עודכן ידנית ב: YYYY-MM-DD" |
| `dec_31_anchor_k` is set | YTD% badge shown in asset card: `+X.X% (מול 31/12)` |
| Category is not `'קופת גמל'` | T190 section hidden entirely in the modal |

---

## Helper Functions (app.js)

| Function | Purpose |
|----------|---------|
| `_isProvidentCategory(cat)` | Returns `true` only for `'קופת גמל'` |
| `_t190InitBuckets()` | Returns a fresh zeroed buckets object |
| `_t190ProportionalUpdate(item, newTotalK)` | Rescales all three buckets when balance changes |
| `_t190CalcYtdPct(item)` | Computes YTD% from `dec_31_anchor_k`; returns `null` if anchor absent |
| `_ffsPopulateT190Section(item)` | Populates T190 section in the edit modal; pass `null` to read category from DOM |
| `_t190SimGetBuckets(item)` | Returns bucket distribution for the analysis modal — branches A → B → B' → C (see Analysis Modal section) |
| `_parseT190BucketsFromXML(rawXml)` | Re-parses raw XML string using `KOD-TECHULAT-SHICHVA` field; returns `null` if that field is absent |
