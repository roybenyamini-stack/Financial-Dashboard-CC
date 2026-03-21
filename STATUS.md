# סטטוס פרויקט

## שלב נוכחי
גרסה v24.0 — UX POLISH: כותרת דינמית "מציג: X", כפתור "היום", כרטיסיות "צפי שנתי" אפורות + "YTD בפועל" צבעונית.

## שינויים אחרונים (21/03/2026)

### v24.0 – User Experience Polish

**index.html:**
- Year select + כפתור "📅 היום" הועברו לשורת הכפתורים השמאלית (ליד "עדכון תזרים שוטף") — אותו גובה ויישור
- `cf-summary-row`: שונה ל-4 עמודות (`1fr 1fr 1fr 1.5fr`) — 3 צפי שנתי + 1 YTD

**app.js:**
- `cfUpdateHeader()`: מעדכן `#hdr-subtitle` ל-"מציג: [חודש]" בכל שינוי חודש
- `cfGoToday()`: פונקציה חדשה — מאפסת CF_SELECTED_YEAR + CF_SELECTED_MONTH_ID, מחזירה לחודש ברירת המחדל
- `cfSelectMonth()`: מוסיף קריאה ל-`cfRenderSummary()` כדי לעדכן YTD בלחיצה על גרף
- `cfRenderSummary()`: עיצוב מחדש מלא:
  - 3 כרטיסיות אפורות קטנות = "צפי שנתי [שנה]" (הכנסות/הוצאות/נטו)
  - כרטיסייה צבעונית אחת = "מצטבר בפועל YTD" — מציגה ינו׳–[חודש נבחר] עם 3 ערכים בגופן גדול
- גרסת localStorage עודכנה: `'23.0'` → `'24.0'`

## שינויים אחרונים (21/03/2026)

### v23.0 – Visual Perfection

**index.html:**
- `#tabs-nav`: נוסף `#cf-year-nav` (Dropdown שנה 2026/2025) בקצה השמאלי, מוצג רק בטאב תזרים (cf-only-btn)
- `#cf-header-stats`: סדר עודכן ל-הכנסות | הוצאות | נטו (מימין לשמאל), הוסר year select מהheader
- `cf-month-nav` div: הוסר (בחירת חודש דרך גרף בלבד)
- `cf-controls-box`: הוסרו כפתורי "טווח" (12 חד׳ / שנה שלמה), Legend עלה לראש, min-height:0
- גרסה עודכנה: v22.0 → v23.0

**app.js:**
- `cfRenderMonthSelector()`: no-op — אין יותר dropdown חודשים
- YTD dataset: נוסף `maxBarThickness: 34` — רוחב עמודות זהה לגרף חודשי
- Tooltip: נוסף `xAlign:'left', yAlign:'bottom'` — Tooltip לא חוסם לחיצה על עמודות
- גרסת localStorage עודכנה: `'22.0'` → `'23.0'`

## שינויים אחרונים (21/03/2026)

### v22.0 – Clean Design (השקעות סגנון)

**index.html:**
- `#cf-header-stats`: הוחלף ל-3 KPIs קומפקטיים (נטו/הכנסות/הוצאות) + Dropdown שנה (2026/2025) בסגנון טאב השקעות
- `cf-kpi-row`: הוסתר (display:none) — KPIs ראשיים עברו ל-header
- `cf-detail-row`: הועבר מתחת לקונטיינר הגרף+טבלה (לא מעל)
- גרסה עודכנה: v21.0 → v22.0

**app.js:**
- `CF_SELECTED_YEAR`: משתנה גלובלי חדש לבחירת שנת תצוגה
- `CF_CHART_MONTHS`: מטמון חודשי גרף לשימוש ב-onClick
- `cfGetDisplayMonths()`: פשוט ואחיד — תמיד 12 חודשים של שנה נבחרת (CF_SELECTED_YEAR || auto-max)
- `cfSelectYear(year)`: פונקציה חדשה — מחליפה שנה ומרנדרת הכל מחדש
- `cfUpdateHeader()`: מציג נטו/הכנסות/הוצאות של החודש הנבחר (IDs: cf-hdr-net/income/exp)
- `cfRenderMonthSelector()`: מסנן לפי שנה נבחרת
- `cfRenderKPI()`: קומפקטי — chip קטנות בלבד (9px label, 12px ערך), ללא כרטיסיות גדולות
- `cfRenderChart()`: onClick = לחיצה על עמודה מעדכנת CF_SELECTED_MONTH_ID; onHover = cursor:pointer; Tooltip = כולל label נכון + YTD afterBody
- גרסת localStorage עודכנה: `'21.0'` → `'22.0'`

## שינויים אחרונים (21/03/2026)

### v21.0 – The Face Lift

**app.js:**
- `cfRenderMonthSelector`: הוחלף פס 24 כפתורים ב-`<select>` Dropdown נקי עם כל 13 החודשים
- `cfRenderKPI`: עיצוב מחדש מלא — 3 כרטיסיות ראשיות רחבות (נטו/הכנסות/הוצאות) + רשת פירוט (שכר, שכ"ד, ויזה, מזומן, הלוואות, שיפוץ, יותם, חריגות) + מקטע דולרים (רקע כהה, צבע סגול)
- `cfRenderChart`: Stacked Bar Chart — 4 מערכי נתונים: הכנסות (ירוק, stack:'income'), שוטף (אדום, stack:'exp'), יותם (כתום, stack:'exp'), חריג (צהוב, stack:'exp'). Tooltip מציג YTD מצטבר (הכנסות/הוצאות/נטו) דרך `afterBody` callback. `stacked: isMonthly` בשני הצירים.
- גרסת localStorage עודכנה: `'20.1'` → `'21.0'`

**index.html:**
- עדכון גרסה: v20.1 → v21.0
- נוסף `<div id="cf-detail-row">` בין cf-kpi-row ל-cf-summary-row
- אגדת גרף עודכנה ל-4 צבעים: הכנסות (ירוק) / שוטף (אדום) / יותם (כתום) / חריג (צהוב)
- גובה controls-box שונה ל-`height:auto;min-height:200px`

## שינויים אחרונים (21/03/2026)

### v19.4 – COLUMN DEDUP: First Wins

**app.js:**
- `parseSheet` (לולאת עמודות): **FIRST WINS** — נוסף `seenMonths{}` שמונע כפולות. אם 'מרץ 2026' נמצא בעמודה 22, עמודה 24 (שנפרסה גם היא כ-'מרץ 2026') מדולגת. קודם `allMonths[202603]` היה נדרס על ידי עמודה 24 (נתוני אפריל)
- לוג דיאגנוסטי: `[v19.4] DUPLICATE skipped: מרץ 2026 at col 24 (first was kept)`
- **[Final Test]** לוג: `[Final Test] Column for March is 22, Value at Row 7 is 123`
- `localStorage.clear()` — רץ בשורה הראשונה של `reader.onload` (כבר קיים מ-v19.2)
- גרסת localStorage עודכנה: `'19.3'` → `'19.4'`

**index.html:**
- עדכון גרסה: v19.3 → v19.4

### v19.3 – MAX YEAR RULE: תיקון שורש הבעיה

**app.js:**
- `cfGetDefaultMonthId`: **תיקון קריטי** — הפונקציה כבר לא סומכת על `new Date().getFullYear()` (שעון המחשב החזיר 2025). במקום, מחשבת `maxYear = max(CF_DATA[i].year)` (= 2026). ה-targetYM = 202603. מוצאת מרץ 2026 (val=123) ולא מרץ 2025 (val=42)
- נוסף `console.log('!!! FOUND מרץ 26 AT monthId: 2026-03 — val: 123 !!!')` בעת מציאת ההתאמה
- גרסת localStorage עודכנה: `'19.2'` → `'19.3'` (מחיקה אוטומטית של cache ישן)

**index.html:**
- עדכון גרסה: v19.2 → v19.3

## שינויים אחרונים (21/03/2026)

### v17.4 – Hard Mapping Fallback + Row Debug Logging

**app.js:**
- `parseSheet` (אחרי סריקה דינמית): **Debug Logging** — לוג של 55 שורות מ-HEADER_ROW עם תוויות וסידרן, לאבחון מיקום total_income/total_exp בפועל
- `parseSheet` (Hard Mapping Fallback): אם `total_income` לא נמצא דינמית — ממפה `HEADER_ROW+6` ל-`total_income`; אם `total_exp` לא נמצא — ממפה `HEADER_ROW+16` ל-`total_exp`. מבוסס על מבנה האקסל שנאמת: +6 = "סה"כ" (123), +16 = "סה"כ התחייבויות שיקלי" (32)
- localStorage: גרסה עודכנה `17.3` → `17.4`

**index.html:**
- עדכון גרסה: v17.3 → v17.4

**ניהול קבצים:**
- `git mv "כללי_עדכון_דשבורד.md" "guidelines.md"` — שם חדש באנגלית
- `git mv "תיעוד_טכני_דשבורד.md" "tech_doc.md"` — שם חדש באנגלית
- `CLAUDE.md`: עדכון הפניות לשמות החדשים

## שינויים אחרונים (21/03/2026)

### v17.3 – Exact-Match for "סה"כ", December Guarantee

**app.js:**
- `parseSheet KEY_LABELS`: **הוחזרה 'סה"כ' לרשימת total_income** — אך ורק כ-Exact Match (ראה למטה)
- `parseSheet matching logic`: **Exact Match לכינויים קצרים (≤4 תווים ללא רווחים)** — 'סה"כ' (4 תווים) מוצא רק שורות שהתוכן שלהן הוא בדיוק 'סה"כ'. כך 'סה"כ התחייבויות שיקלי' אינה נספגת בטעות כ-total_income. שאר המפתחות (ארוכים) ממשיכים ב-contains match כרגיל
- `parseSheet`: **הסרת Max-Value Heuristic** (v17.2) — גרם לקריאת ערכים מעמודת סיכומים שנתיים (מיליוני שקלים במקום מאות)
- `cfGetDisplayMonths` rolling12: **דצמבר מובטח** — אם דצמ׳ של שנת הנתונים חסר ממערך rolling12, נוסף כ-placeholder עם ערכים null (מוצג כ-0 בגרף)
- localStorage: גרסה עודכנה `17.2` → `17.3`

**index.html:**
- עדכון גרסה: v17.2 → v17.3

## שינויים אחרונים (21/03/2026)

### v17.2 – Max-Value Heuristic and Reliable Rendering

**app.js:**
- `parseSheet` (בלולאת col): **Max-value heuristic** — לאחר קריאת ROW_MAP הסטטי, מחשב:
  - `total_income` = הערך הגבוה ביותר (≥50) בשורות HEADER_ROW+1 עד +70 (קטע הכנסות). דורס כל ערך קודם.
  - `total_exp` = הערך הגבוה ביותר (>0) בשורות HEADER_ROW+71 עד +130 (קטע הוצאות). דורס כל ערך קודם.
  - פותר את בעיית ה-39 (שהגיעה מ-static ROW_MAP row 3/39 שהצביע לשורה שגויה)
- `cfRenderSummary`: **נטו מצטבר מחושב** — totalNet = totalInc - totalExp (לא net_cashflow שאף פעם לא מאוכלס). גם שנה בתווית דינמית (currentYear במקום 2026 קשיח)
- localStorage: גרסה עודכנה `17.1` → `17.2`

**index.html:**
- עדכון גרסה: v17.1 → v17.2

## שינויים אחרונים (21/03/2026)

### v17.1 – Robust Parsing and Flexible UI Scaling

**app.js:**
- `normalizeForCompare`: **ניקוי מלא** — הוספת הסרת תווים בלתי-נראים (non-breaking space, BOM, zero-width) לפני השוואה; קיפול רווחים כפולים לרווח יחיד; `.trim()` בסוף
- `cfRenderKPI`: **פולבאק חכם** — הכנסות = `total_income` אם קיים (סה"כ הכנסות מהאקסל), אחרת `salary` (הכנסה ממשכורת) כגיבוי. נטו = inc-exp (מחושב, ללא שינוי)
- `cfRenderChart` monthly: **אותו פולבאק** בגרף. צבע ירוק לעמודת הכנסות — קבוע, לא מותנה בנטו
- `cfGetDisplayMonths`: שינוי שם `'ytd2026'` → `'ytd'` — שנה-אגנוסטי. הציר תמיד דינמי לפי השנה הגבוהה ב-CF_DATA
- `cfSetDateRange`: עדכון מזהה כפתור `cf-range-ytd2026` → `cf-range-ytd`
- `cfScrollToLatest`: עדכון תנאי `ytd2026` → `ytd`
- localStorage: גרסה עודכנה `17.0` → `17.1`

**index.html:**
- עדכון גרסה: v17.0 → v17.1
- כפתור טווח: id/onclick שונו מ-`ytd2026` ל-`ytd`; תווית שונתה מ-`2026` ל-`שנה שלמה`

## שינויים אחרונים (21/03/2026)

### v17.0 – ניקוי רעלים, Refactoring ממוקד

**app.js:**
- `loadCFFromLocalStorage` + `smartUploadRouter`: **גרסת localStorage עודכנה ל-17.0** — כל נתוני גרסאות 16.xx נמחקים אוטומטית; הדף עולה ריק בטעינה ראשונה
- `cfGetNetVal`: **הסרת fallback לאקסל** — כבר לא נסמך על profit_loss/net_cashflow מהגיליון. נטו = total_income - total_exp בלבד. אם חסר אחד מהם → מחזיר null → מוצג 0
- `cfRenderKPI`: **נטו מחושב בקוד** — net = inc - exp (salary - total_exp). לא נשלף מ-profit_loss. כרטיסיות: 💰 הכנסות | 💸 הוצאות | 📊 נטו. במרץ 2026: הכנסות=123, נטו=91
- גרף חודשי: שתי עמודות — ירוק (total_income) + אדום (total_exp) ✓ (ללא שינוי מ-v16.97)
- ציר YTD: 12 חודשים קשיחים ינואר-דצמבר ✓ (ללא שינוי מ-v16.94)

**dashboard_v16.html:**
- עדכון גרסה: v16.98 → v17.0

## שינויים אחרונים (18/03/2026)

### v16.97 – הסרת Static ROW_MAP קריטי, normalizeForCompare, נטו ידני

**app.js:**
- `parseSheet` — **הסרת שורות קריטיות מ-ROW_MAP הסטטי**: הוסרו לחלוטין השורות `7:'total_income'`, `16:'total_exp'`, `22:'net_cashflow'`, `43:'profit_loss'`. ערכים אלו גרמו ל-42/30/12 כשהצביעו על שורה שגויה באקסל. עכשיו חייבים להימצא דינמית — אם לא נמצאו, val=null → מוצג 0
- `parseSheet` — **`normalizeForCompare(s)`**: פונקציה חדשה שמנרמלת לפני השוואה: מרכאות חכמות (U+201C/D) → ASCII `"`, גרשיים עברי (U+05F4 ״) → ASCII `"`, גרש עברי (U+05F3 ׳) → `'`, וריאנטי סלש → ` / `. פותרת את בעיית 'סה"כ' שלא היה נמצא בגלל הבדל בתו הגרשיים
- `parseSheet` — הסריקה משתמשת ב-`normalizeForCompare` בשני הצדדים (תווית וגם מילת מפתח)
- `cfGetNetVal` — **חישוב ידני ראשון**: עדיפות 1 = `total_income - total_exp` (מחושב בקוד). גיבוי = profit_loss/net_cashflow. אם הפחסר אחד מהם — val=null → מוצג 0
- `cfRenderKPI` — **נטו = income - expense תמיד**. 3 קלפים: הכנסות, הוצאות, נטו מחושב. הוסר קלף 'רווח/הפסד' (לא אמין)
- `cfRenderChart` monthly — **חזרה לירוק+אדום בלבד**. הוסרה עמודת הכחול (profit_loss)
- localStorage: גרסה עודכנה ל-16.97 — מחיקה אוטומטית של כל נתון ישן

## שינויים אחרונים (18/03/2026)

### v16.96 – ניקוי שורות ריקות, סריקה מורחבת, KEY_LABELS מדויק

**app.js:**
- `loadCFFromLocalStorage` + `smartUploadRouter`: **גרסת localStorage עודכנה ל-16.96** — כל נתוני גרסאות קודמות נמחקים אוטומטית בטעינה ראשונה; הדף עולה ריק
- `parseSheet`: **ניקוי שורות ריקות** — לפני הסריקה, נבנית רשימת `nonEmptyRows` (שורות עם תוכן לפחות בעמודה אחת מהעמודות הראשונות). הסריקה רצה רק על שורות אלו — מדלגת על שורות ריקות של Excel
- `parseSheet`: **טווח סריקה הורחב** מ-70 ל-150 שורות מ-HEADER_ROW — מבטיח שגם שורות כמו 'רווח / הפסד' ו-'הכנסה ממשכורת' שמופיעות בתחתית הגיליון יזוהו
- `parseSheet`: **נרמול סלש בהשוואה** — בעת בדיקת KEY_LABELS, כל וריאנטי סלש (`/`, `\`, עם/בלי רווחים) מנורמלים ל-` / ` לפני ההשוואה. מבטיח זיהוי 'רווח / הפסד' גם אם Excel כתב \'רווח/הפסד\'
- `parseSheet`: **פילטר 'סיכומים'** מפורש — עמודה שכותרתה מכילה 'סיכומים'/'סיכום'/'summary' מדולגת במפורש לפני parseMonthHeader
- `KEY_LABELS`:
  - `salary`: **אך ורק** `'הכנסה ממשכורת'` — זו השורה עם נתוני משכורת מלאים לפי מבנה האקסל. static ROW_MAP (row 3) משמש fallback
  - `profit_loss`: הורחב לוריאנטים `'רווח/הפסד'`, `'רווח/ הפסד'`, `'רווח /הפסד'`

**dashboard_v16.html:**
- עדכון גרסה: v16.95 → v16.96

## שינויים אחרונים (18/03/2026)

### v16.95 – מיפוי KEY_LABELS מדויק, break לשורה, cfGetNetVal, גרף רווח/הפסד

**app.js:**
- `KEY_LABELS` — **עדכון מקיף** לפי מבנה האקסל:
  - `salary`: נוסף `'הכנסה ממשכורת'`
  - `total_income`: נוספו `'סה"כ'` ו-`'סה״כ'` (plain = שורת סיכום הכנסות). הוסרו `'הכנסות'` לבד (רחב מדי)
  - `total_exp`: נוספו `'סה"כ התחייבויות'`, `'סה״כ התחייבויות'`, `'התחייבויות שיקלי'`, `'התחייבויות'`. הוסרו `'הוצאות'` לבד ו-`'total exp'` שגרמו לחפיפה
  - `visa`: נוסף `'חיוב ויזה'` (הנוסח המדויק מהאקסל)
  - `loans`: תוקן ל-`'החזר הלוואות'` (ריבוי כמו בגיליון)
  - `renovation`: נוסף `'הוצאות שיפוץ'`
  - `salary_usd`/`exp_usd`: נוספו נוסחי `(בשקלים)` כמו בגיליון
  - `delta`: **חדש** — `'∆ תזרים שוטף'` ווריאנטים (לפי הגיליון)
  - `profit_loss`: **הוחלפו** 'רווח' ו-'הפסד' לבד (רחבים מדי) ב-`'רווח / הפסד'` בלבד
  - `net_cashflow`: הוסר `'נטו'` לבד (רחב מדי)
- סריקה: **הוסף `break`** — מפתח אחד בלבד לכל שורה. מונע מצב שאותה שורה נכנסת למספר keys בו-זמנית. גם הוסף trim של non-breaking spaces בתווית
- `cfGetNetVal(m)`: **פונקציה חדשה** — מחזיר ערך נטו לחודש בעדיפות: `profit_loss` → `net_cashflow` → `total_income - total_exp`. ה-fallback מבטיח ערך גם כשהשורות לא מזוהות
- `cfRenderKPI`: **קלף רביעי** — רווח / הפסד (כחול אם חיובי, אדום אם שלילי)
- `cfRenderChart` monthly: **3 עמודות לחודש** — הכנסות (ירוק) + הוצאות (אדום) + רווח/הפסד (כחול/אדום לפי סימן)
- `cfRenderChart` ytd: משתמש ב-`cfGetNetVal` במקום `net_cashflow` בלבד

**dashboard_v16.html:**
- עדכון גרסה: v16.94 → v16.95

### v16.94 – סינון גיליונות, CF_CURRENT_MONTH_ID, ניקוי localStorage, ציר ytd קשיח

**app.js:**
- `cfParseWorkbook`: **סינון חדש** — סורק אך ורק גיליונות עם שנה 2025 או 2026. גיליונות ישנים (2019-2024) מדולגים עם console.log. מונע זיהוי שגוי שמחרבש את ה-mappedKeys
- `var CF_CURRENT_MONTH_ID`: משתנה גלובלי חדש — שומר את ה-monthId הגבוה ביותר שאינו עתידי
- `smartUploadRouter`: אחרי פארסינג מוצלח — מחשב `CF_CURRENT_MONTH_ID` ע"י מיון כל החודשים הלא-עתידיים בסדר יורד ובחירת הראשון. גם שומר `dashboard_cf_version=16.94` ב-localStorage
- `loadCFFromLocalStorage`: **ניקוי אוטומטי** — אם גרסת ה-localStorage שונה מ-16.94, מנקה ומחכה לקובץ חדש. גם מגדיר `CF_CURRENT_MONTH_ID` מהנתונים הטעונים
- `cfGetLastRealMonth`: **שלב 0 חדש** — אם `CF_CURRENT_MONTH_ID` קיים, משתמש בו ישירות. שלבים 1-2 נותרים כ-fallback
- `cfGetDisplayMonths` ytd: **לולאה קשיחה 1-12** — ציר X תמיד ינואר עד דצמבר של displayYear. חיפוש ב-CF_DATA לפי monthId בלבד (לא year+month)

**dashboard_v16.html:**
- עדכון גרסה: v16.93 → v16.94

### v16.93 – חודש נוכחי נכון, ytd לשנה נכונה

**app.js:**
- `cfGetLastRealMonth`: שלב 2 חדש — אם אף חודש לא עומד בתנאי total_income!=null, מחזיר את **החודש הכי מאוחר שאינו עתידי** (fallback שמחזיר מרץ 26 גם אם total_income null). קודם היה מחזיר נובמבר 25
- `cfGetDisplayMonths` ytd mode: `displayYear` = **max(year) בכל CF_DATA** (לא שנת lastIdx). מונע מצב שנובמבר 25 גרם לציר להציג 2025 בכפתור 'שנה נוכחית'

**dashboard_v16.html:**
- עדכון גרסה: v16.92 → v16.93

### v16.92 – תיקון באג mappedKeys, KEY_LABELS מורחב

**app.js:**
- `parseSheet` — **תיקון קריטי**: `mappedKeys` כבר לא מאותחל עם מפתחות ה-static ROW_MAP. קודם, `mappedKeys['total_income']=true` מהסטטיקה גרם לסריקה הדינמית לדלג על שורת total_income האמיתית — ולהשאיר בשורה 7 שמכילה 42. עכשיו `mappedKeys={}` ריק בהתחלה; הסריקה הדינמית מחליפה כל מיפוי סטטי שגוי
- `KEY_LABELS.total_income`: נוספו 'הכנסות', 'סכום הכנסות', 'סך הכל הכנסות', 'סה"כ תזרים חיובי' ועוד
- `KEY_LABELS.total_exp`: נוספו 'הוצאות', 'סכום הוצאות', 'סך הכל הוצאות', 'סה"כ תזרים שלילי' ועוד
- גרף דצמבר: נפתר אוטומטית עם הסרת הבאג — total_income/total_exp לדצמבר יקראו מהשורה הנכונה

**dashboard_v16.html:**
- עדכון גרסה: v16.91 → v16.92

### v16.91 – ניקוי localStorage ישן, trim דצמבר, ביטול 42/30

**app.js:**
- `loadCFFromLocalStorage`: נוספה בדיקת תקינות — אם הנתונים חסרי `monthId` (נשמרו לפני v16.88), localStorage מנוקה אוטומטית בטעינת הדף. זה מוחק את ה-42/30/12/644/410/234 מה-cache הישן
- `parseMonthHeader`: נרמול רווחים אגרסיבי — `replace(/[\u00A0\uFEFF\t\r\n]+/g, ' ').trim()` לפני כל פענוח. מטפל בנון-בריקינג-ספייס (U+00A0) ו-BOM (U+FEFF) שגורמים לדצמבר לא להיזהות
- ערכי 42/30 כ-fallback: לא קיימים בקוד הרינדור — מקורם היה אך ורק ב-localStorage ישן שנוקה כעת

**dashboard_v16.html:**
- עדכון גרסה: v16.90 → v16.91

### v16.90 – ביטול Fall-Forward, First Match Only, סינון הערות

**app.js:**
- `parseSheet`: הוסרה לחלוטין לוגיקת Fall-Forward (חישוב total_income/total_exp/net עצמי). הערכים נלקחים ישירות מהשורות שנמצאו באקסל
- `parseSheet` dynamic scan: הוספת `mappedKeys` — כל שדה ממופה פעם אחת בלבד (First Match Only). אם `salary` נמצא בשורה 3, שורה 41 לא תדרוס אותו
- `cfRenderNotesPanel`: סינון הערות `note === 'חושב'` — לא יופיעו בחלונית (שארית מגרסאות ישנות)
- ציר שנה: נשאר דינמי (מ-v16.89) — השנה נגזרת מהנתון האחרון ב-CF_DATA

**dashboard_v16.html:**
- עדכון גרסה: v16.89 → v16.90

### v16.89 – Fall-forward אגרסיבי, ציר שנה דינמי

**app.js:**
- `parseSheet` Fall-forward אגרסיבי: total_income מחושב מ-salary+rent+other+buffer — מחליף ערך קיים אם הסכום גדול יותר (מכסה שורה שגויה מ-static ROW_MAP). אותו דבר ל-total_exp ו-net_cashflow
- `parseSheet` console.log `[CF FF]` לכל חודש: מדפיס inc/exp/net לאחר fall-forward
- `cfGetDisplayMonths` ytd mode: השנה נקבעת דינמית מהנתון האחרון (לא 2026 קשיח) — עובד לכל שנה עתידית
- ערכי mock (42, 30 וכו'): אינם קשיחים בקוד CF — מקורם בשורות שגויות מה-Excel; ה-fall-forward האגרסיבי מחליף אותם בחישוב מרכיבים

**dashboard_v16.html:**
- עדכון גרסה: v16.88 → v16.89

### v16.88 – monthId, ניקוי localStorage, KEY_LABELS מורחב, אבחון KPI

**app.js:**
- `cfParseWorkbook`: כל אובייקט חודש מקבל `monthId` בפורמט '2026-03' (ISO קבוע)
- `cfGetDisplayMonths` ytd2026: בונה 12 monthIds מדויקים, מחפש ב-CF_DATA לפי monthId (ו-year+month לתאימות אחורה); placeholder months מקבלים monthId
- `smartUploadRouter`: ניקוי CF_DATA ו-localStorage מיד בתחילת onload — לפני הפארסינג — כך שנתוני mock לעולם לא מציגים אם הפארסינג נכשל
- `cfRenderKPI`: נוסף `console.log('[CF Render]')` המדפיס בדיוק איזה חודש, monthId, ואיזה ערכים מרונדרים
- `parseSheet KEY_LABELS`: הורחב עם וריאנטים נוספים בעברית ואנגלית לכל שדה (סהכ הכנסות, סך הכנסות, net, נטו וכו')

**dashboard_v16.html:**
- עדכון גרסה: v16.87 → v16.88

### v16.87 – חיבור State, null guards, פורמט חודשים מלא

**app.js:**
- `smartUploadRouter`: אחרי upload מוצלח — קורא `switchTab('cashflow')` שמפעיל `cfInit()` על canvas גלוי; גם בכישלון מנקה CF_DATA ו-localStorage
- `cfRenderKPI`: הוספת null guards ל-total_income / total_exp / net_cashflow
- `cfRenderChart`: null guards לכל גישה ל-rows; תוויות גרף מקוצרות (ינו׳ 25) מה-CF_HEB_MONTHS_ABBR
- `cfRenderTable`: כותרת עמודות מקוצרת (ינו׳ 25) עם title מלא ב-tooltip
- `cfParseWorkbook HEB_MONTHS`: שמות מלאים (ינואר, פברואר...) + שנה מלאה (2025/2026)
- `CF_HEB_MONTHS` גלובלי: שמות מלאים; `CF_HEB_MONTHS_ABBR` חדש לשימוש בגרף ובטבלה

**dashboard_v16.html:**
- עדכון גרסה: v16.86 → v16.87

### v16.86 – אתחול לוגי: console.log, ניקוי mock, רינדור מחדש

**app.js:**
- `cfParseWorkbook`: נוספו `console.log` בתחילת הפונקציה עם רשימת גיליונות, לכל גיליון שמעובד, ולסיכום כמות חודשים
- `parseSheet`: נוסף `console.log` עם HEADER_ROW + firstMonthCol; הודעה ברורה אם לא נמצאה שורת כותרות; log לכל label דינמי שזוהה; log של ROW_MAP הסופי
- `smartUploadRouter` ענף הצלחה: הוסר התנאי שבדק אם טאב פעיל — `cfInit()` תמיד נקרא מיד אחרי upload
- `smartUploadRouter` ענף כישלון (0 חודשים): `CF_DATA=[]` + `localStorage.removeItem` + `cfInit()` — הדשבורד יציג "אין נתונים" במקום mock ישן
- נוסף `console.log('[Upload] Parsed Data:', newData)` ב-smartUploadRouter

**dashboard_v16.html:**
- עדכון גרסה: v16.85 → v16.86

### v16.83 – תיקון נתוני Excel, הערות, כרטיסיית נטו

**app.js:**
- `cfParseWorkbook`: הוסרה `ROW_MAP` הגלובלית — הועברה לתוך `parseSheet` עם זיהוי דינמי
- `parseSheet`: זיהוי שורות דינמי מעמודה 0 (label-based) לשורות מפתח (total_income/total_exp/net_cashflow)
- `parseMonthHeader`: נוספה תמיכה בשמות חודשים עבריים (מרץ, פבר׳ וכו') ו-MM/YYYY format
- `cfParseWorkbook` + `smartUploadRouter`: Unicode normalization (`normalize('NFC')`) לשמות גיליונות
- `smartUploadRouter`: הודעת הצלחה מפורטת עם ערכי הכנסות/הוצאות לחודש האחרון; הודעת שגיאה מפורטת עם שמות הגיליונות שנמצאו
- `cfRenderNotesPanel`: הסרת סמל ₪ מסכומים; פונטים גדולים יותר (כותרת 13→15px, שורה 12→14px, label 11→12px)
- `cfRenderSummary`: כרטיסיית נטו שונתה ל-"נטו מצטבר 2026", כיתוב תחתון "חודשי 2026"

**dashboard_v16.html:**
- עדכון גרסה: v16.82 → v16.83

### v16.82 – שחזור Layout אחרי קריסת v16.81

**dashboard_v16.html:**
- עדכון גרסה: v16.81 → v16.82
- תיקון קריטי: ב-v16.81 נפתח `<div>` עוטף ל-`header-title` + `cf-header-stats` אך לא נסגר כראוי, מה שגרם לכל אלמנטי ה-Header (כולל כפתורים ונתוני השקעות) להיות לכודים בתוכו — `justify-content:space-between` של ה-Header הפסיק לעבוד
- פתרון: החלפת כל בלוק `<div class="header">` (שורות 24–86) במבנה נקי ומוודא עם סגירת `</div>` מפורשת לעוטף לפני אלמנטי ה-header הנותרים

### v16.81 – ליטוש סופי נוסף (גרם לקריסה)
### v16.80 – שדרוג ממשק מלא (dark table, כפתורים נפרדים, header)
### v16.76 – ליטוש סופי
### v16.75 – ציר Y + spacer עמודה

## קבצים פעילים כעת
| קובץ | תיאור |
|---|---|
| `index.html` | מבנה HTML (דף בית ב-GitHub Pages) |
| `style.css` | כל ה-CSS |
| `app.js` | כל קוד ה-JavaScript |
| `guidelines.md` | הוראות עדכון (שונה שם ל-v17.4) |
| `tech_doc.md` | תיעוד טכני (שונה שם ל-v17.4) |
