# תיעוד טכני – דשבורד תיק השקעות v16
_עודכן: 11/03/2026 | גרסה נוכחית: v16.59_

---

## ארכיטקטורה כללית
קובץ HTML יחיד (~206KB), פרונטאנד בלבד. ללא backend.
- נתוני השקעות: נטענים מקובץ Excel (asset_data.xlsx) דרך SheetJS
- נתוני תזרים: מוטמעים ישירות ב-HTML כ-`var CF_DATA = [...]`
- GitHub Pages: https://roybenyamini-stack.github.io/Financial-Dashboard-CC/ (index.html — v17.0)

---

## מבנה Tabs – ארכיטקטורה

### HTML
```
<div id="top-fixed">          ← sticky, z-index:100
  <div id="tabs-nav">         ← 6 לשוניות, direction:rtl
  <div class="header">        ← כותרת כהה (משתנה לפי tab)
  <div id="inv-cards-row">    ← כרטיסיות השקעות (מוסתר בתזרים)
  <div id="cf-cards-row">     ← כרטיסיות תזרים (מוסתר בהשקעות)
  <div id="inv-chart-section"> ← גרף הצטברות נכסים (מוסתר בתזרים)
</div>

<div class="tab-panel active" id="tab-investments">
<div class="tab-panel" id="tab-cashflow">
<div class="tab-panel" id="tab-overview">     ← בבנייה
<div class="tab-panel" id="tab-pension">      ← בבנייה
<div class="tab-panel" id="tab-market">       ← בבנייה
<div class="tab-panel" id="tab-simulator">    ← בבנייה
```

### סדר לשוניות (מימין לשמאל)
מבט על · **תזרים שוטף** · **השקעות** · פנסיה וביטוחים · ניתוח שוק ומסחר · סימולטור פיננסי

### switchTab(id) – לוגיקת החלפה
```javascript
function switchTab(id) {
  // החלפת tab-btn.active + tab-panel.active
  // isCF = (id === 'cashflow')
  // header-stats: מחליף בין .header-stats הראשי ל-#cf-header-stats
  // cards: מחליף בין #inv-cards-row ל-#cf-cards-row
  // chart: מסתיר/מציג #inv-chart-section
  // אם isCF ו-!cfInited: cfInited=true; setTimeout(cfInit, 80)
}
```

---

## מבנה נתונים – השקעות

### LABELS
מערך חודשים: `['ינו׳ 25', 'פבר׳ 25', ..., 'מרץ 26']` (15 חודשים)

### FUNDS
```javascript
FUNDS = {
  'keyName': {
    name: 'שם להצגה',
    cat: 'harel',             // קטגוריה
    data: [v1, v2, ...],      // null = לא דווח
    transferred: true,        // אופציונלי – הועברה לגוף אחר
  }
}
```

### CAT_COLORS
```javascript
{ mezuman:'#0891b2', hishtalmut:'#fca5a5', gemel:'#fcd34d',
  gemel_invest:'#6ee7b7', harel:'#fde68a', meitav:'#c4b5fd',
  arbitrage:'#0d9488', dira:'#a8a29e', chov:'#94a3b8', all:'#1a1a2e' }
```

### FUND_COLORS
```javascript
const FUND_COLORS = {
  'מזומןשקלי': '#0891b2', 'מזומןדולרי': '#0891b2', 'מיטבשקלית': '#0891b2',
  'אשקהש39905556': '#16a34a', 'אשקהש6730513': '#7c3aed',
  'אשקהש40035706': '#16a34a', 'מורקהש499293': '#ea580c',
  'מיטבקהש912-443286': '#7c3aed',
  'הראלמגוון-פוליסתחיסכ': '#ca8a04', 'הראלמניות106863031': '#ca8a04',
  'הראלכללי109062745': '#ca8a04',
  'מיטבדשניהולקרנות1693': '#7c3aed', 'מיטבדשטרייד': '#7c3aed',
}
```

### FUND_TAGS
```javascript
const FUND_TAGS = {
  'מורקהש499293':         [{text:'מנייתית', cls:'note-equity'}],
  'מיטבקהש912-443286':    [{text:'פעילה', cls:'note-active'},{text:'מנייתית', cls:'note-equity'}],
  'מורגמל1375900':         [{text:'פעילה', cls:'note-active'},{text:'מנייתית', cls:'note-equity'}],
  'אשקהש6730513':         [{text:'מנייתית', cls:'note-equity'}],
  '6730511אשגמל':         [{text:'פעילה', cls:'note-active'},{text:'מנייתית', cls:'note-equity'}],
  '6899425אשגמל':         [{text:'מנייתית', cls:'note-equity'}],
  'הפניקסגמל926-084678':  [{text:'מנייתית', cls:'note-equity'}],
  'מורגמללהשקעה':         [{text:'מנייתית', cls:'note-equity'}],
  'הראלמניות106863031':   [{text:'מנייתית', cls:'note-equity-sold'}],
  'מיטבשקלית':            [{text:'כספית', cls:'note-cash-fund'}],
  'מיטבדשניהולקרנות1693': [{text:'מנייתית', cls:'note-equity'}],
};
```

### EXTERNAL_EVENTS
```javascript
const EXTERNAL_EVENTS = [
  { col: 0,  amt: 286, desc: 'הראל כללי' },
  { col: 10, amt: 414, desc: 'פניקס' },
  { col: 14, amt: 173, desc: 'הכרה במזומן' },
];
```

### TV_SECTIONS (טבלת תצוגה)
```javascript
var TV_SECTIONS = [
  {label:'מזומן',         color:'#b2ebf8', bg:'#f0fbff', catId:'mezuman',     keys:[...]},
  {label:'קרנות השתלמות', color:'#fca5a5', bg:'#fff5f5', catId:'hishtalmut',  keys:[...]},
  {label:'קופות גמל',     color:'#fcd34d', bg:'#fffdf5', catId:'gemel',       keys:[...]},
  {label:'גמל להשקעה',   color:'#6ee7b7', bg:'#f0fdf4', catId:'gemel_invest', keys:[...]},
  {label:'הראל',          color:'#fde68a', bg:'#fefce8', catId:'harel',       keys:[...]},
  {label:'מיטב',          color:'#c4b5fd', bg:'#f8f7ff', catId:'meitav',      keys:[...]},
  {label:'דירה',          color:'#d6d3d1', bg:'#fafaf9', catId:null,          keys:['דירה'], noSubtotal:true},
];
```
**חשוב:** `catId` משמש לניווט טבלה→מודאל קטגוריה.

---

## מבנה נתונים – תזרים שוטף

### CF_DATA
מוגדר **ישירות בקוד** כ-`var CF_DATA = [...]` בתוך `<script>` בלשונית תזרים.
**לא** נטען מ-localStorage. מכיל 24 חודשים (ינו׳ 25 – דצמ׳ 26).

```javascript
CF_DATA = [{
  label: 'ינו׳ 25',
  year: 2025, month: 1,
  rows: {
    salary:       {val: 97,  note: null},
    rent_income:  {val: 6,   note: null},
    other_income: {val: null, note: null},
    buffer:       {val: null, note: null},
    total_income: {val: 103, note: null},
    visa:         {val: 25,  note: null},
    cash_exp:     {val: 5,   note: null},
    loans:        {val: 16,  note: 'החזר הלוואה 71'},
    yotam:        {val: 12,  note: 'יותם'},
    other_exp:    {val: null, note: null},
    total_exp:    {val: 58,  note: null},
    renovation:   {val: null, note: null},
    net_cashflow: {val: 45,  note: null},
    salary_usd:   {val: 12,  note: null},
    exp_usd:      {val: -10, note: null},
    yotam_usd:    {val: null, note: null},
    total_usd:    {val: 2,   note: null},
    delta:        {val: 47,  note: null},
    profit_loss:  {val: 63,  note: null},
  }
}, ...]
```

### עדכון CF_DATA מאקסל
הפונקציה `cfParseWorkbook(wb)` מפענחת קובץ תזרים.
- זיהוי: גיליונות עם `indexOf('שוטף חדשי') >= 0`
- מבנה: עמודה ראשונה = שמות שורות, כל 3 עמודות = חודש (ערך, הערה, ריק)
- הטמעה: `CF_DATA = newData; cfInit();`

---

## Smart Upload Router

```javascript
function smartUploadRouter(input) {
  // קורא קובץ xlsx
  // בודק שמות גיליונות:
  //   isCF = SheetNames.some(n => n.indexOf('שוטף חדשי') >= 0)
  //   אם isCF → cfParseWorkbook(wb) → CF_DATA → cfInit()
  //   אחרת     → loadExcelFileCore(wb) → עדכון FUNDS
}

function loadExcelFileCore(wb) {
  var status = document.getElementById('excel-status');
  // מעדכן FUNDS + LABELS מגיליונות DD_MM_YYYY
}
```

**חשוב:** `loadExcelFileCore` מכיל `var status` בתוכו. אל תמחק.

---

## כותרת Header – תזרים vs השקעות

### השקעות (ברירת מחדל)
| id | תוכן |
|---|---|
| `hdr-total` | סה"כ נכסים |
| `hdr-change-val` | שינוי כולל |
| `hdr-ret-val` | תשואה מנוטרלת |

### תזרים (`#cf-header-stats`, מוצג רק בתזרים)
| id | תוכן |
|---|---|
| `cf-hdr-current` | תזרים נטו חודש נוכחי |
| `cf-hdr-ytd` | תזרים מצטבר YTD |
| `cf-hdr-avg` | ממוצע חודשי |

---

## ארכיטקטורת UI תזרים – v16.59 (סופי)

### מבנה HTML
```html
<!-- כרטיסייה שלמה: direction:ltr (כרונולוגי) -->
<div style="background:#fff;border-radius:16px;...">
  <div id="cf-scroll-container" style="overflow-x:auto;direction:ltr;">
    <div id="cf-inner-wrap" style="position:relative;display:inline-flex;flex-direction:column;min-width:100%;">

      <!-- ROW 1: גרף + בקרים sticky-RIGHT -->
      <div style="display:flex;flex-direction:row;align-items:stretch;">
        <div id="cf-chart-wrap" style="flex:1;height:200px;" dir="ltr">
          <canvas id="cf-chart"></canvas>
        </div>
        <div id="cf-controls-box" style="flex:0 0 140px;position:sticky;right:0;z-index:4;...">
          <!-- כפתורי חודשי/YTD + מקרא -->
        </div>
      </div>

      <!-- ROW 2: טבלה בקונטיינר גלילה אנכית עצמאי -->
      <div id="cf-table-scroll" style="overflow-y:auto;max-height:520px;">
        <table id="cf-table" style="...direction:ltr;"></table>
      </div>

    </div>
  </div>
</div>
```

### עקרונות ארכיטקטורה
- **direction:ltr** על הכל → חודשים כרונולוגי שמאל→ימין
- **sticky right:0** על בקרי הגרף (140px) ועמודת labels בטבלה
- עמודת labels היא **האחרונה** בכל `<tr>` (ב-LTR, אחרון = ימין)
- **overflow-y:auto + max-height:520px** על `cf-table-scroll` → sticky thead עובד בתוך הקונטיינר
- **sticky top:0** על כל `<th>` בנפרד (לא על `<tr>` — לא עובד cross-browser)

### ערכי רוחב קבועים
```javascript
var COL_W   = 80;   // רוחב עמודת חודש — גרף + טבלה
var LABEL_W = 140;  // רוחב עמודת labels = רוחב בקרי גרף
```

### z-index hierarchy בטבלה
| אלמנט | z-index |
|---|---|
| תאי גוף רגילים | — |
| עמודת labels (tbody) | 2 |
| כותרות חודש (thead th) | 10 |
| תא פינה "סעיף" | 25 |
| בקרי גרף (cf-controls-box) | 4 |

### cfRenderChart — פרמטרים
```javascript
responsive: true
maintainAspectRatio: false
animation: false
x.display: false        // ← ציר X מוסתר (החודשים מוצגים בטבלה)
x.offset: true
x.barPercentage: 0.7
x.categoryPercentage: 1.0
layout.padding: { top:8, bottom:0, left:0, right:0 }
// cf-chart-wrap.style.width = months.length × COL_W + 'px'
```

**הערה:** הסתרת ציר X היא הדרך הנכונה לסנכרון גרף-טבלה. ניסיון לחשב padding ידני נכשל בגלל Chart.js internal offsets.

---

## פונקציות מרכזיות – תזרים

```javascript
cfGetLastRealMonth()   // מחזיר index החודש האחרון עם נתונים אמיתיים
cfUpdateHeader()       // מעדכן #cf-header-stats
cfUpdateCFCards()      // מעדכן #cf-cards-row (5 כרטיסיות)
cfRenderKPI()          // מעדכן #cf-kpi-row (3 כרטיסיות ירוק/אדום)
cfRenderChart()        // מצייר גרף עמודות (חודשי / YTD מצטבר)
cfRenderTable()        // בונה טבלה מפורטת (LTR, sticky right labels, sticky top header)
cfSetView('monthly'|'ytd') // החלפת תצוגת גרף
cfTogglePrivacy()      // הצג/הסתר עמודות הערות
cfInit()               // קורא את כל הפונקציות לעיל
```

---

## מודאל קטגוריה (cat-modal)

### פונקציות
```javascript
openCatModal(catId, fromTable)  // פתח מודאל
cmBuildList(catId, color)       // בנה רשימת קרנות
cmClickFund(fundKey)            // פתח גרף קרן
cmDrawChart(data, color, label) // ציור Chart.js
cmBuildFundTable(fundKey, color)// טבלה אופקית 3 שורות
cmSlide(dir)                    // הזז חלון זמן
cmBackToList()                  // חזור לרשימה
closeCatModal()                 // סגור
```

### ניווט טבלה → מודאל
לחיצה על שורת כותרת קטגוריה בטבלה:
```javascript
closeTableView(); openCatModal(catId, true);
```
כפתור "← טבלה" (`#cm-back-table`) מופיע רק כשנפתח מהטבלה.

---

## צ'אט AI

| מוד | כפתור | Worker |
|---|---|---|
| תיק 🏠 | ירוק | claude-haiku-4-5-20251001 |
| חקור 🌐 | סגול | claude-sonnet-4-20250514 + web_search |

**Worker URL:** `https://holy-poetry-claude-proxy.roy-benyamini.workers.dev`
**אל תשנה** – Worker URL + לוגיקת חיבור.

---

## מערכת Themes

```javascript
var THEMES = [
  {cls:'',        lbl:'🎨 Slate Pro', line:'#2563eb', fill:'rgba(37,99,235,0.12)'},
  {cls:'t-slate', lbl:'🎨 Warm Pro',  line:'#38bdf8', fill:'rgba(56,189,248,0.15)'},
  {cls:'t-warm',  lbl:'🎨 Navy',      line:'#d97706', fill:'rgba(217,119,6,0.13)'},
  {cls:'t-navy',  lbl:'🎨 Classic',   line:'#1a2744', fill:'rgba(26,39,68,0.12)'},
];
```

---

## כללי עבודה עם Claude

1. **עריכת עברית** – תמיד Python string replacement. לעולם לא `str_replace` עם Unicode עברי
2. **בדיקת balance אחרי כל שינוי:**
   ```python
   c.count('<div') - c.count('</div>')  # צריך להיות -1 (ידוע)
   c.count('{') - c.count('}')          # חייב להיות 0
   ```
3. **deploy.sh מוחק** את הקובץ מ-Downloads אחרי הצלחה
4. **cache Chrome** – Cmd+Shift+R או Incognito (Cmd+Shift+N)
5. **אל תשנה** לוגיקת צ'אט, Worker URL, מבנה FUNDS, CF_DATA
6. **עדכן מספר גרסה** בכל build לאימות deploy
7. **CF_DATA** מוגדר ב-`<script>` בתוך `tab-cashflow` div – גלובלי לדף

---

## קבצים בפרויקט

| קובץ | תיאור |
|---|---|
| `index.html` | מבנה HTML של הדשבורד (דף בית ב-GitHub Pages) |
| `style.css` | כל ה-CSS של הדשבורד |
| `app.js` | כל קוד ה-JavaScript של הדשבורד |
| `asset_data.xlsx` | נתוני השקעות |
| `תזרים_חדשי_2022.xlsx` | נתוני תזרים שוטף |
| `guidelines.md` | הוראות עדכון |
| `tech_doc.md` | מסמך זה |
| `deploy.sh` | סקריפט העלאה |

---

## עדכונים אחרונים – סשן 14 (11/03/2026)

### נושא הסשן: Refactoring UI תזרים — RTL, סנכרון גרף-טבלה, sticky headers

#### v16.47–v16.48 — עיצוב מינימליסטי + Smart Router
- טבלת תזרים: zebra striping, צבע רק בטקסט, הזחה לשורות פרטים
- Smart Router: הודעות זיהוי ספציפיות לפי סוג קובץ

#### v16.52 — ארכיטקטורה RTL ראשונה (נכשלה)
- ניסיון: RTL container + sticky right
- בעיה: סדר חודשים הפוך בטבלה vs גרף

#### v16.53–v16.54 — מעבר ל-LTR
- טבלה: direction:ltr, sticky left (→ עמודת labels משמאל — שגוי)

#### v16.54 — sticky right עם LTR (הפתרון הנכון)
- עמודת labels: **אחרונה** בכל `<tr>` → `position:sticky; right:0` ב-LTR עובד
- בקרי גרף: sticky right, 140px

#### v16.55–v16.56 — צמצום רוחב + יישור גרף-טבלה
- LABEL_W: 190 → 160 → 140px
- ניסיון padding ידני לסנכרון — לא מדויק מספיק

#### v16.57 — פתרון יישור: הסתרת ציר X
- `x.display: false` על הגרף → ציר X מוסתר, אין offset פנימי
- שורת חודשים בטבלה משמשת כציר X יחיד

#### v16.58 — sticky thead (נכשל חלקית)
- `position:sticky` על `<tr>` — לא עובד cross-browser
- תוקן ב-v16.59

#### v16.59 — sticky thead נכון
- **sticky top:0 על כל `<th>` בנפרד** (לא על `<tr>`)
- `cf-table-scroll`: `overflow-y:auto; max-height:520px` — גלילה עצמאית
- תא פינה "סעיף": z-index:25 (sticky right + sticky top)
- הסרת tfoot (כפול עם thead sticky)

---

## נושאים פתוחים

| נושא | עדיפות |
|---|---|
| Persistence לתזרים (localStorage) | בינונית |
| הוספת שורת סיכום YTD לטבלה | נמוכה |
| גרף מצטבר YTD — בדיקת תצוגה | בינונית |

---

## עדכונים קודמים – סשן 13 (11/03/2026)

### cfParseWorkbook – גישה ישירה לתאים (קריטי)
sheet_to_json מחזיר sparse array → גישה עם index מחזירה null.
חייב להשתמש ב-encode_cell:

```javascript
function cellVal(ws, r, col) {
  var addr = XLSX.utils.encode_cell({r: r, c: col});
  var cell = ws[addr];
  return cell ? cell.v : null;
}
```

### מבנה גיליון תזרים
- שורה 0 (Excel 1): Table 1
- שורה 1 (Excel 2): headers חודשים – תאריכים
- שורות 3–43: נתונים
- colBase = 16 + (month_index * 3)
- col+0=ערך, col+1=הערה

### ROW_MAP
```
{3:'salary', 4:'rent_income', 5:'other_income', 6:'buffer', 7:'total_income',
 9:'visa', 10:'cash_exp', 11:'loans', 12:'yotam', 13:'other_exp',
 16:'total_exp', 19:'renovation', 22:'net_cashflow',
 25:'salary_usd', 26:'exp_usd', 27:'yotam_usd', 28:'total_usd',
 39:'delta', 43:'profit_loss'}
```
