# סטטוס פרויקט

## שלב נוכחי
גרסה v169.4 — Hard-Reset Isolation Protocol (25/04/2026).

## שינויים אחרונים (25/04/2026 — v169.4)

### v169.4 – Hard-Reset Isolation Protocol

**1. absoluteInternalReset() — פונקציה חדשה**
מנקה את כל המצב הפנימי לפני טעינת mode חדש:
- `SIM_LAST_RESULT = null`, `OV_CACHED_WEALTH = null`
- `clearAppState()` — כל ה-KPIs ל-'—'
- הורס כל chart objects: `simChartObj`, `ovCFChart`, `ovInvChart`, `ovSimMiniChart`, `cfChartInstance`
- מאפס globals אישיים: `SIM_USER1_NAME`, `SIM_USER2_NAME`, `SIM_USER1_BIRTH`, `SIM_USER2_BIRTH`
- `resetCalculationMemory()` — מאפס: pension, salary, rental, expense
- `pnsNetMonthly`, `pnsNetMonthlyWithHarel`, `pnsNetMonthlyNoHarel` = 0
- מנקה `FFS_PROFILE` למבנה ריק לחלוטין (ללא נתוני רועי/דן)
- `_clearPrivacyFields()` — מנקה שדות UI אישיים
- מציג "מציג: אורח" מיידית לפני כל טעינה
- `simInited = overviewInited = cfInited = pensionInited = false`
- מסיר `isDemoMode` ו-`demo-mode` class

**2. switchMode() — ארכיטקטורה חדשה**
- **FIRST LINE**: `absoluteInternalReset()` לפני כל פעולה (אחרי guard checks)
- **EXCEL**: `_dashRestoreAssets/CF/Pension()` → אם נמצאו → `loadSettings()`, re-render. אם לא → blank slate
- **DEMO**: `loadDemoData()` בלבד — טוען נתוני דן/דינה hardcoded
- **SIMULATOR**: `ffsLoadProfile()` מ-FINANCIAL_SIM_PERSONAL_DATA בלבד → אם יש נתונים → dashboard; אם לא → `ffsRenderAll()` + drawer ריק

**3. Visual Feedback Fix**
כאשר drawer פתוח ואין נתונים: `simCheckEmpty()` מסתיר chart section ומציג "אין נתונים"
FFS_PROFILE ריק לגמרי → drawer מציג שדות ריקים (0 / dd/mm/yyyy)

**4. Name Label Sync מיידי**
`simUpdateNameLabel()` ועדכון ישיר של `sim-active-name-text` ו-`ffs-drawer-title` ל-"אורח" ב-`absoluteInternalReset()`
לוגיקה mode-aware: SIMULATOR→ FFS_PROFILE.name; DEMO→SIM_USER1_NAME; EXCEL→session-gated

**5. Smart Warning (dirty check)**
אזהרה ב-SIMULATOR exit רק אם `FFS_PROFILE` מכיל נתונים בפועל (name/birthDate/investments/pension/realEstate)
ב-empty slate — אין אזהרה, עובר מיידית

## שינויים אחרונים (25/04/2026 — v169.3)


### v169.3 – Iron Dome: Privacy, Warnings & Cross-Tab Context

**1. SIMULATOR Mode-Change Warning**
- `switchMode()` בודק `prev === 'SIMULATOR' && mode !== 'SIMULATOR'`
- `confirm()` עם ההודעה: "שים לב: מעבר מצב ינקה את תצוגת הסימולטור..."
- אם המשתמש מבטל — `_updateModeSelectorUI('SIMULATOR')` משחזר את הכפתור ומחזיר `return`

**2. Excel Memory Privacy — Roy's Vault**
- `_sessionExcelUploaded = false` — משתנה גלובלי חדש, `true` רק אחרי פרסור קובץ Excel בפועל
- נקבע ל-`true` ב-3 נקודות: פנסיה / תזרים / השקעות (לפני `showToast` בכל נתיב הצלחה)
- ב-`loadSettings()`: כאשר `APP_MODE === 'EXCEL' && !_sessionExcelUploaded` → מאפס גם את הגלובלים האישיים:
  - `SIM_USER1_BIRTH`, `SIM_USER2_BIRTH`, `SIM_USER1_NAME`, `SIM_USER2_NAME` → `''`
  - מונע שנת הלידה של רועי (1962) מלהיכנס לחישובים עבור משתמש אנונימי
- `clearDashboardData()` גם מאפס `_sessionExcelUploaded = false`

**3. Cross-Tab Context Persistence (SIMULATOR mode)**
- `ovRenderSimMini()`: gate חדש כפול לפי `APP_MODE`:
  - `SIMULATOR`: בודק `simInited + ffsGetLiquidCapital/PensionAccumK/RealEstateK > 0` (לא דורש Excel)
  - `EXCEL/DEMO`: שומר גייט `ovAllDataReady() + simGetRoyCapital() > 0`
- הודעת empty state משתנה לפי mode: "הכנס נתונים אישיים בסימולטור להצגת תחזית 5 שנים"
- `ovRenderKPIs()`: הוסף `_simDataReady` gate — ב-SIMULATOR mode מציג "הון חזוי" מ-`simRunEngine()`
- `switchTab()`: כשפותח overview ב-SIMULATOR mode ו-simInited=false → מאתחל sim לפני הרינדור

**4. Complete Demo Purge**
- `switchMode()` בעת יציאה מ-DEMO, בנוסף לקיים:
  - `cfInited = false` — מאלץ re-init של תזרים שוטף עם נתונים אמיתיים
  - הורס charts ב-overview: `ovCFChart`, `ovInvChart`, `ovSimMiniChart` → null (נמנע cache של דמו)
  - `_clearPrivacyFields()` אם `!_sessionExcelUploaded` — מגן גם בחזרה מ-DEMO ל-EXCEL

## שינויים אחרונים (25/04/2026 — v169.2)


### v169.2 – Privacy Shield Protocol & Navigation Fixes

**1. Privacy-First Settings (Mode 0)**
- `loadSettings()` מסיים עם `_clearPrivacyFields()` כאשר אין נתוני אקסל/פנסיה בזיכרון
- שדות שמוסתרים בהיעדר נתונים: `stg-user1-name`, `stg-user2-name`, `stg-user1-birth`, `stg-user2-birth`, `stg-retire-exp`
- `saveSettings()`: שדות תאריך לידה ב-privacy mode חוזרים ל-global (לא שומרים blank)
- `saveSettings()`: `stg-retire-exp = 0` (blank) חוזר ל-`SIM_RETIRE_EXP` הגלובלי

**2. Floating Toast (הודעת עדכון צפה)**
- הוסף `<div id="upload-toast">` (position:fixed, bottom:28px, מרכז מסך)
- `showToast(msg, bgColor, duration)` — פונקציה גלובלית עם אנימציית slide-up + fade
- `excel-status` span הוסתר (`display:none`) — כל הקוד עובר ל-`showToast()`
- עדכן: `smartUploadRouter`, `loadExcelFile`, `loadExcelFileCore`, `loadDemoData`
- הסיר את ה-hide/show של excel-status מ-`switchTab` (toast self-dismisses)

**3. clearAppState() — Mode 0 Reset**
- מאפס את כל ה-KPI values לסימן '—' מיידית בכל החלפת מצב
- מופעל ב-`switchMode()` לפני שהנתונים החדשים נטענים
- מכסה: `ov-hdr-*`, `sim-hdr-*`, `cf-hdr-*`

**4. Navigation Fixes**
- DEMO → מנווט לטאב **Overview** (שונה מ-simulator ב-v169.1)
- סימולטור מאותחל ברקע (150ms timeout) כדי שהנתונים יהיו מוכנים לכל המיני-charts
- SIMULATOR → מנווט לטאב **Simulator** (ללא שינוי)

**5. Settings Populate After Upload**
- `loadExcelFileCore` success: קורא ל-`loadSettings()` אחרי פרסור → settings UI מתאכלס
- CF branch success: קורא ל-`loadSettings()` אחרי פרסור
- Pension branch success: קורא ל-`loadSettings()` אחרי פרסור

## שינויים אחרונים (25/04/2026 — v169.1)

## שינויים אחרונים (25/04/2026 — v169.1)

### v169.1 – Mode Selector ו-Navigation Architecture

**מה נבנה:**

**1. Mode Selector UI (בחירת עולם גלובלי)**
- נוסף אלמנט Segmented Control בפינה שמאלית עליונה של `#tabs-nav`
- 3 כפתורים: `נתוני אמת` (EXCEL) | `מצב דמו` (DEMO) | `סימולטור אישי` (SIMULATOR)
- עיצוב: background כהה, active state בכחול `#3b82f6` עם glow
- תווית `מקור נתונים: אקסל` מתחת לכפתורים — מתעדכנת דינמית בכל החלפה
- HTML: `#mode-selector-group`, CSS: `.mode-btn`, `.mode-btn.active`

**2. לוגיקת Navigation**
- `switchMode('EXCEL')`: מנקה Demo → חוזר ל-Overview → משחזר נתוני אקסל מ-localStorage
- `switchMode('DEMO')`: קורא ל-`loadDemoData()` הקיים (דן ודינה, סימולטור)
- `switchMode('SIMULATOR')`: עובר לטאב סימולטור + מחליט על הצגת טופס/דשבורד

**3. Simulator Onboarding**
- אין נתונים: פותח FFS Drawer עם "שלב א - פרטים אישיים" פתוח, שאר האקורדיון סגור (`_ffsOpenStageA()`)
- יש נתונים: מציג סימולטור + כפתור `📝 עריכת נתונים` (`#sim-edit-data-btn`)

**4. Data Isolation (NO LEAKAGE)**
- `ffsGetActiveKey()`: מחזיר `ffs_profile_v1` ב-EXCEL, `FINANCIAL_SIM_PERSONAL_DATA` ב-SIMULATOR
- `ffsLoadProfile()`, `ffsSaveProfile()`, `ffsStartFreshProfile()`, `ffsConfirmReset()` — כולם משתמשים ב-`ffsGetActiveKey()`
- `isExcelLoaded()` ו-`_hasRawExcelData()`: מחזירות `false` במצב SIMULATOR כדי שהסימולטור ישתמש בנתוני FFS ולא באקסל

**5. שינויי בטיחות**
- `APP_MODE = 'EXCEL' | 'DEMO' | 'SIMULATOR'` — משתנה גלובלי חדש
- `SIMULATOR_LS_KEY = 'FINANCIAL_SIM_PERSONAL_DATA'` — מפתח LS נפרד לסימולטור
- `loadDemoData()` מעדכן גם `APP_MODE = 'DEMO'` + UI mode selector
- `clearDashboardData()` מאפס `APP_MODE = 'EXCEL'`
- כפתור Admin "🎭 נתוני דמו" שונה מ-`loadDemoData()` ל-`switchMode('DEMO')`

**HTML:** הוסף `#tabs-buttons` wrapper לכפתורי הטאבים, `#mode-selector`, `#mode-source-label`, `#sim-edit-data-btn`
**CSS:** `#tabs-nav` שינוי ל-`space-between`, נוסף `#tabs-buttons`, `.mode-btn`, `#mode-selector`
**JS:** `switchMode()`, `_ffsOpenStageA()`, `_updateModeSelectorUI()`, `ffsGetActiveKey()`

## שינויים אחרונים (25/04/2026 — v168.118)

### v168.118 – KPI תזרים נטו בדמו: 5,000 ₪

**שורש הבעיה (זוהה):**
- `isExcelLoaded()` מחזירה `false` בדמו (שורה 8019: `if (isDemoMode) return false`)
- KPI#3 חישב: `isExcelLoaded() ? ... : (FFS_PROFILE.monthlySavings || 0)` → הגיע ל-0
- `FFS_PROFILE.monthlySavings` לא מוגדר בפרופיל דמו → 0

**התיקון (כירורגי):**
- הוסף סניף `isDemoMode` לפני בדיקת `isExcelLoaded()` ב-KPI#3 בלבד:
  `isDemoMode ? (SIM_PENSION_MONTHLY - SIM_TARGET_EXP) : (isExcelLoaded() ? ... : ...)`
- תוצאה: 25,000 - 20,000 = **5,000 ₪** מיידי ✓
- **ריאקטיביות**: הזזת גרר הכנסה/הוצאה קוראת ל-`simRenderKPI()` ← חישוב מיידי ✓

**רועי — לא נגע:**
- הסניף `isDemoMode ?` מוחדר *לפני* כל לוגיקת רועי
- הסניף של `isExcelLoaded()` (רועי) לא שונה בכלל

## שינויים אחרונים (25/04/2026 — v168.117)

### v168.117 – Firewall מלא + KPI תזרים נטו תקין + UI ניקוי דמו

**שורש הבעיה שתוקן (v168.115 חלקי):**
- `isDemoMode = true` הוגדר *לאחר* `switchTab()` → `_demoForceDanSliders()` יצא מיידית (isDemoMode=false)
- תוצאה: KPI הראה 0, ערכי ברירת מחדל לא נטענו

**תיקון מרכזי — סדר הגדרות:**
- `isDemoMode = true` ו-`document.body.classList.add('demo-mode')` הועברו לפני כל קוד init
- `switchTab('simulator')` במקום `switchTab('overview')` — מציג סימולטור מיידית
- `simInit()` → `_demoForceDanSliders()` רץ עם isDemoMode=true → 25K/20K/5K ✓

**UI ניקוי — הוצאה חודשית בפרישה:**
- CSS: `body.demo-mode #stg-retire-exp-field { display:none }` — שדה ה-Settings מוסתר בדמו
- HTML: הוסף `id="stg-retire-exp-field"` לעטיפת השדה

**זרימה מלאה בלחיצה על "דמו":**
1. `isDemoMode = true` + `body.demo-mode` ← ראשון
2. SIM_RETIRE_EXP=20K, SIM_PENSION_MONTHLY=25K, zoom=decade/2026-2036
3. `switchTab('simulator')` → simInit() → _demoForceDanSliders() →
   הון חזוי דינמי + "תחזית לגיל 67 שנת 2042" + 5K תזרים נטו — מיידי
4. Overview רונדר ב-timeout 300ms ברקע

**רועי — לא נגע:**
- SIM_RETIRE_EXP=20K הוא volatile (לא נשמר ב-localStorage ע"י demo)
- בטעינה מחדש: `loadSettings()` מחזיר 29,000 מ-localStorage

## שינויים אחרונים (25/04/2026 — v168.115)

### v168.115 – Demo Profile Overhaul (דן ודינה)

**בידוד מלא — רועי לא נגע:**
- כל השינויים מוגנים ב-`isDemoMode === true`
- `SIM_RETIRE_EXP = 20000` בדמו בלבד; לרועי נשאר 29,000 (מ-localStorage)
- `_demoForceDanSliders()` — פונקציה חדשה, מופעלת רק כשהדמו פעיל

**ברירות מחדל לדן:**
- הוצאה חודשית בפרישה: **20,000 ₪** (לא 29K של רועי)
- הכנסה פנויה בפרישה: **25,000 ₪** (= תוצאה מ-PENSION_ASSETS: 15,500+9,500)
- תזרים נטו: 5,000 ₪ ✓

**זום ברירת מחדל — "עשור קדימה" (2026-2036):**
- `SIM_ZOOM = 'decade'`, `SIM_ZOOM_CUSTOM.decStart = 2026`, `decEnd = 2036`
- כפתור "עשור" מוארים; גרף מציג 10 שנות צמיחה קדימה מיידית

**הסתרת "הכנסה כמדריך":**
- CSS: `body.demo-mode #sim-instr-group { display:none }`
- JS: `simSyncInstrSlider()` בודק `isDemoMode`
- שכבה כפולה: CSS + JS

**כותרת + KPI מיידיים:**
- `simInit()` מסיים → קורא `_demoForceDanSliders()` → `simRenderKPI()` + `simRenderChart()`
- "תחזית לגיל 67 שנת 2042" מוצג מיידית בפתיחת הסימולטור

**הון חזוי לדן:**
- הון ראשוני: ~11.7M (FUNDS + פנסיה + דירה)
- תזרים: 25K - 20K = +5K/חודש מגיל 67
- תשואה: 4% על נזילים, 3% על פנסיה, 2.5% על נדל"ן

## שינויים אחרונים (24/04/2026 — v168.114)

### v168.114 – KPI ותווית דינמיים לפי גיל-מטרה

**הבעיה:**
- `simRenderKPI()` קידד קשה: `simMonthIdx(SIM_P3_START.y, ...)` = תמיד גיל 67
- כותרת: `SIM_RETIREMENT_AGE_ROY` + `SIM_P3_START.y` — תמיד קבועות
- שינוי גיל-מטרה ל-80 לא שינה כלום ב-KPI ובכותרת

**התיקון בפונקציה `simRenderKPI()`:**
- אינדקס: `_kpiAge = SIM_TARGET_AGE || 67` → `_kpiYear = SIM_BIRTH_YEAR_ROY + _kpiAge`
- כותרת: 'תחזית לגיל **[_kpiAge]** שנת [_kpiYear]' — מתעדכן מיידית
- גיל 67 → שנת 2029 | גיל 80 → שנת 2042 | גיל 90 → שנת 2052

**ביצועים (אופטימיזציה):**
- `ovRenderKPIs()`: מוסיף שימוש ב-`SIM_LAST_RESULT` כשזמין — חוסך הרצת מנוע כפולה בשינוי גיל

**זרימת ריאקטיביות מלאה:**
`sim-target-age-input` → `simSetTargetAge()` → `simRenderKPI()` + `ovRenderKPIs()`
→ שניהם קוראים `_kpiYear = 1962 + SIM_TARGET_AGE` → index נכון ב-royData → KPI מתעדכן

## שינויים אחרונים (24/04/2026 — v168.113)

### v168.113 – הגדרת הון חזוי מוחזרת ל-Total Wealth

**הבעיה:**
- v168.112 הוציאה נדל"ן מ-KPI "הון חזוי" → הצגה: 23.4M
- "הון נוכחי" (כרטיס Overview) כולל נדל"ן → הצגה: 23.8M
- הפרש מדומה של ~0.4M יוצר רושם של הפסד — **לא נכון**

**התיקון:**
- `simRenderKPI()`: חזרה ל-`royData[_targetIdx]` (= liquid + phoenix + harel + real estate)
- `ovRenderKPIs()`: חזרה ל-`royData[_idx]`
- **תוצאה:** הון חזוי ~26.6M — תואם את סיכום ה-tooltip בגרף

**הגדרת עקביות:**
- "הון נוכחי" = סה"כ נכסים היום כולל נדל"ן
- "הון חזוי" = סה"כ נכסים בגיל 67 כולל נדל"ן (אחרי צמיחה 2.5% שנתית)
- שתי הלשוניות (Overview + Simulator) מציגות אותו ערך ✓

**Settings — מצב (ללא שינוי — כבר נקי מ-v168.106):**
- סקשן "תשואות ואינפלציה": תשואת השקעות 4%, פנסיה 3%, אינפלציה 2.5%, הוצאה בפרישה 29K, צמיחת נדל"ן 2.5%
- אין סקשן כפול "הוצאות בפרישה" — נמחק ב-v168.106 ✓

## שינויים אחרונים (24/04/2026 — v168.112)

### v168.112 – Logic Synchronization & Asset Isolation

**1. בידוד נדל"ן (Real Estate Isolation):**
- ברירת מחדל נדל"ן: שונה מ-2.0% ל-**2.5%** (`SIM_RE_GROWTH_RATE`)
- הנוסחה `Value × (1 + Rate/12)` — לינארית, ומבודדת לחלוטין מתשואת ההשקעות
- צבירת שכר דירה לתזרים נשאר ב-`totalPensionIncome` — ללא כפילות

**2. KPI הון חזוי — הגדרה מחדש (שתי לשוניות):**
- **לפני:** `royData[idx]` = liquid + פניקס + הראל + **נדל"ן** (הכניס ~2.6M נדל"ן)
- **אחרי:** `royLiquidData[idx] + royPhoenixData[idx] + royHarelData[idx]` (הון נזיל בלבד)
- תיקון ב-`simRenderKPI()` (כותרת Simulator) וב-`ovRenderKPIs()` (לשונית Overview)
- **תוצאה:** שתי הלשוניות מציגות ערך זהה ~24.1M

**3. גרר נדל"ן — צעד 0.5% → 0.1% (linearity):**
- `sim-re-growth-num` ו-`sim-re-growth-slider`: step="0.1"
- `stg-re-growth` (הגדרות): value="2.5", step="0.1"
- סימולטור מרנדר מחדש בכל שינוי בלי דיבאונס

**4. Settings → Simulator sync:** ✓ (פועל מ-v168.104 דרך `syncSettingsToSliders()`)

## שינויים קודמים (24/04/2026 — v168.107)

### v168.107 – תיקון אינדקס חישוב הון בלשונית Overview

**הבעיה שזוהתה:**
- Overview הציגה 24.1M ו-Simulator הציגה 26.7M (~2.6M הפרש)
- שורש הבעיה: `ovRenderKPIs()` השתמשה ב-`var _idx = _yr - 2026` לאינדקס מערך ה-`royData`
- עם שנת לידה 1962 + גיל פרישה 67: `_idx = 1962+67−2026 = 3` (קורא רק 3 חודשים קדימה!)
- הסימולטור קורא נכון דרך `simMonthIdx(SIM_P3_START.y, 9)` ≈ 41 חודשים

**התיקון (app.js):**
- שורה 10429: שונה מ-`_yr - 2026` ל-`simMonthIdx(_yr, _retireM)`
- כעת שתי הלשוניות קוראות אותו חודש פרישה בדיוק (ספטמבר 2029)

**תוצאה מצופה:** שתי הלשוניות יציגו ערך זהה בנקודת הפרישה.

## שינויים אחרונים (24/04/2026 — v168.106)

### v168.106 – Blind Logic Audit & UI Harmonization

**ממצאי הביקורת:**
- **כפל שכר דירה: לא נמצא** — `totalPensionIncome` כולל שכר דירה מ-`PENSION_ASSETS.realEstateIncome` פעם אחת. `monthlyFlowExtra` מגיע רק מ-user events. `royRealEstateK` הוא ערך הון (לא תזרים). ✓
- **ציר זמן: תקין** — לידה 25/08/1962, פרישה ספטמבר 2029 (חודש אחרי יום ההולדת ה-67). P3_START.m=9 ✓
- **KPI#1 vs גרף: מסונכרן** — שניהם קוראים מ-`SIM_LAST_RESULT` (תוקן ב-v168.103) ✓

**`index.html` — האחדת שמות וניקוי:**
- שדה `stg-retire-exp` הועבר לתוך סקשן "תשואות ואינפלציה" (ישיר מתחת לאינפלציה)
- סקשן "הוצאות בפרישה" נמחק (לא נדרש יותר)
- תווית: "הוצאה חודשית צפויה בפרישה" → **"הוצאה חודשית בפרישה"** (זהה לסליידר)
- FFS drawer: "📤 הוצאה חודשית צפויה (₪)" → "📤 הוצאה חודשית בפרישה (₪)"

**`app.js` — תיקון לוגיקת פאזה 1 (עיקרי):**
- v168.101 שגה: שם בפאזה-1 (שנות עבודה) את נוסחת ההכנסה-פנסיה (34K-29K=5K)
- תיקון v168.106: פאזה-1 חוזרת ל-`currentNetCashflow` (תזרים נוכחי אמיתי מ-CF_DATA)
- פאזה-3 (פרישה) ממשיכה להשתמש ב-`totalPensionIncome − targetExp` (מונחה סליידרים) ✓
- פאזה-2 (גשר): `instructorSal − targetExp` (ללא שינוי) ✓

**תוצאה צפויה לאחר הריצה העיוורת:**
פאזה-1: 41 חודש × `currentNetCashflow` (≈5K/חודש מ-CF_DATA)
פאזה-3: `totalPensionIncome − 29K` = 34K − 29K = 5K/חודש
הון ראשוני + צמיחה → ביקורת ידנית נדרשת על ערכי הבסיס בפועל

---

## שינויים אחרונים (24/04/2026 — v168.104)

### v168.104 – Settings-to-Slider Connectivity & Naming Sync

**`index.html` — שם אחיד לסליידר:**
- "הוצאה חודשית" → **"הוצאה חודשית בפרישה"** (זהה לשם בהגדרות)
- ברירות מחדל HTML עודכנו: `min=19000 max=39000 value=29000` (טווח ±10K סביב 29K)
- תוויות גבולות: `39K ₪ / 19K ₪`

**`app.js` — תיקון קריטי: `syncSettingsToSliders()`:**
- הוסר התנאי `if (!isExcelLoaded())` שחסם את עדכון הסליידר כאשר אקסל טעון
- החדש: מגדיר תמיד `SIM_TARGET_EXP = SIM_RETIRE_EXP = 29000` — אלא אם FFS פעיל עם הוצאה משלו
- הסליידר יציג 29,000 ב-startup ולאחר טעינת האקסל

**`app.js` — תיקון `simFullRefresh()`:**
- כאשר Excel טעון ו-`SIM_TARGET_EXP === 0` (אופס אחרי מעבר פרופיל) — משחזר מ-`SIM_RETIRE_EXP`
- מתקן את הבאג: חזרה ל-Excel אחרי Manual Mode לא תציג 0 בסליידר

**`app.js` — תיקון `simRefresh()`:**
- כנ"ל — שחזור הוצאה מהגדרות אם אופסה ב-re-upload

**יעד:** 24.0M | 34K | 5K | 53K — עם סליידר הוצאה = 29K מוצג נכון

---

## שינויים אחרונים (24/04/2026 — v168.103)

### v168.103 – Time Calibration & UI Sterilization

**`index.html` — הוספת Date Picker בהגדרות:**
- "גיל פרישה" → "גיל פרישה ותאריכי לידה" — הוספת 2 שדות date picker:
  - `stg-user1-birth` ברירת מחדל: 1962-08-25 (רועי)
  - `stg-user2-birth` ברירת מחדל: 1968-06-28 (יעל)

**`index.html` — ניקוי הגדרות UI:**
- הוסר `stg-inflation-macro` (כפיל של "שיעור אינפלציה שנתי")
- הוסר `stg-capital-tax` (לא נדרש)
- "מאקרו כלכלה ומיסוי" → "הוצאות בפרישה" — נותר רק `stg-retire-exp`

**`app.js` — שחזור תאריכי לידה אמיתיים:**
- `SIM_BIRTH_YEAR_ROY = 1962` (היה 1980 — ניטרלי)
- `SIM_BIRTH_YEAR_YAEL = 1968` (היה 1983)
- `SIM_USER1_BIRTH = '1962-08-25'`, `SIM_USER2_BIRTH = '1968-06-28'`
- `userCurrentAge = 64` (2026−1962)
- גבולות פאזות: P3_START = 2029, P2_START = 2026, END = 2057

**`app.js` — תיקון KPI#1 "הון חזוי":**
- שימוש ב-`SIM_LAST_RESULT` (מהגרפה האחרונה) במקום ריצת engine נפרדת
- Index = `SIM_P3_START.y` (אותו מיילסטון שהגרף מציג) — אין עוד פערים
- כותרת משנה: "תחזית לגיל 67 שנת 2029"

**`app.js` — בידוד זהות (Manual Mode):**
- `ffsToggleDataSource()`: כשמועברים ל-MANUAL — מנקה תאריכי לידה של רועי
- SIM_USER1_BIRTH / SIM_BIRTH_YEAR_ROY מאפסים לגיל ניטרלי (גיל 40 מהיום)
- שדות `stg-user1-birth` / `stg-user2-birth` מתנקים ב-DOM

**יעד סופי:** 24.0M | 34K | 5K | 53K (עם timeline נכון: retirement 2029)

---

## שינויים אחרונים (24/04/2026 — v168.101)

### v168.101 – Settings UI & Slider Logic Calibration

**`index.html` — שדה חדש בהגדרות ("מאקרו כלכלה ומיסוי"):**
- `stg-retire-exp`: "הוצאה חודשית צפויה בפרישה" — ברירת מחדל 29,000 ₪
- ממוקם בין "אינפלציה שנתית" ל-"מס רווחי הון ריאלי"

**`app.js` — גלובל חדש:**
- `SIM_RETIRE_EXP = 29000` — מניע את טווח סליידר ההוצאה ואת KPI#3

**`app.js` — `simUpdateExpSliderRange()`:**
- מעדכן דינמית `min/max` של סליידר ההוצאה ל: [SIM_RETIRE_EXP − 10K, SIM_RETIRE_EXP + 10K]

**`app.js` — `loadSettings()` / `saveSettings()`:**
- `retireExp` נשמר/נטען ב-localStorage ומסנכרן ל-`stg-retire-exp`

**`app.js` — `syncSettingsToSliders()`:**
- קורא ל-`simUpdateExpSliderRange()` לעדכון טווח
- כשאין Excel: מאתחל סליידר ההוצאה ל-`SIM_RETIRE_EXP` ומעדכן `SIM_TARGET_EXP`

**`app.js` — `simRenderKPI()` — KPI#3 נוסחה חדשה:**
- KPI#3 = `SIM_PENSION_MONTHLY − SIM_TARGET_EXP` (34K − 29K = 5K) — מונחה סליידרים לחלוטין
- (הוסר: `simGetCurrentNetCashflow()` מ-CF_DATA)

**`app.js` — `simRunEngine()` — phase-1 נוסחה חדשה:**
- phase-1 משתמש ב-`totalPensionIncome − targetExp` (עקבי עם phase-3)

**`app.js` — הסרת עקיפות SIM_TARGET_EXP מ-CF_DATA:**
- `simInit()`, `simFullRefresh()`, `simRefresh()`: הוסרו כל ה-override שקראו `simGetCurrentExpenses()` וחיפסו את `SIM_TARGET_EXP`
- ההגדרות בלבד שולטות בהוצאה הצפויה

**יעד סופי (Excel טעון):** 24.0M | 34K | 5K | 53K

---

## שינויים אחרונים (24/04/2026 — v168.97)

### v168.97 – Primary Slider-Header Synchronization

**`index.html` — שם סליידר עודכן:**
- "הכנסה קבועה (פנסיה, שכ״ד וכו')" → **"הכנסה פנויה בפרישה"**
- כך גם ברשימת צבעי אירועים בגרף.

**`app.js` — `simGetCurrentNetCashflow()` — פונקציה חדשה:**
- קוראת את שורת `net_cashflow` ישירות מ-CF_DATA (מחושבת על-ידי האקסל עצמו).
- ₪ אמיתיים: salary + rent − total_exp − loans — ללא חישוב ידני כפול.

**`app.js` — `simRenderKPI()` — מיפוי סופי:**
- KPI#2 "הכנסה פנויה": = `SIM_PENSION_MONTHLY` (הסליידר — source of truth). תמיד.
- KPI#3 "תזרים נטו": = `simGetCurrentNetCashflow()` — שורת net_cashflow מהאקסל, ↩5K.
- KPI#4 "צבירה חודשית": = KPI#3 + רווח הון. ↩53K.

**`app.js` — `simRunEngine()` — phase-1 fix:**
- `currentNetCashflow = simGetCurrentNetCashflow()` במקום `currentSalary + currentRentNIS`.
- כאשר `net_cashflow ≠ 0`: מנוע משתמש בו ישירות (no double-dip). ↩ הון חזוי 24.0M.

**`index.html`** — גרסה עודכנה ל-`v168.97`

---

## שינויים אחרונים (24/04/2026 — v168.96)

### v168.96 – Integrity Restoration & Header Alignment

**`index.html` — 4 תוויות KPI נעולות (ניסוח סופי, ללא סיומות דינמיות):**
1. **הון חזוי** — תת-תווית: "במיליוני ש״ח"
2. **הכנסה פנויה** — תת-תווית: "אלפי ש״ח / חודש"
3. **תזרים נטו** — תת-תווית: "אלפי ש״ח / חודש"
4. **צבירה חודשית** — תת-תווית: "אלפי ש״ח / חודש"

**`app.js` — `simGetCurrentRentIncome()` — פונקציה חדשה:**
- קוראת `rent_income.val * 1000` מ-CF_DATA (שכ"ד שוטף, לא שכ"ד פרישה).
- נפרדת מ-`simGetRoyRentalIncome()` שקוראת מ-PENSION_ASSETS (פרישה).

**`app.js` — `resetCalculationMemory()` — פונקציה חדשה:**
- מרחיבה את `resetAllInputs()`: מאפסת גם `SIM_CURRENT_SALARY` ו-`SIM_RENTAL_INCOME`.
- נקראת ב-`simInit()`, `ffsToggleDataSource()`, ו-`loadDemoData()`.
- מונעת דימום נתונים בין פרופילי רועי, דמו ו-FFS.

**`app.js` — `simRenderKPI()` — מיפוי חדש:**
- KPI#2 "הכנסה פנויה": Excel mode = `salary + rent_income` (שוטף, לא פרישה).
- KPI#3 "תזרים נטו": `(salary + rent_income) − total_exp` — נטו מדויק, ללא ריבית.
- KPI#4 "צבירה חודשית": `תזרים נטו + רווח הון חודשי` (ירש תיקון מ-KPI#3).

**`app.js` — `simRunEngine()` — phase-1 income fix:**
- `_phase1Income = salary + currentRentNIS` במקום `salary` בלבד.
- מבטיח שהתרומה החודשית במנוע תואמת ל-KPI#3.

**`app.js` — `simInit()` — SIM_TARGET_EXP firewall:**
- Excel תמיד גובר: `(isExcelLoaded() && _exp > 0) ? _exp` — ראשון בשרשרת.
- מונע מצב שבו FFS עם שם ריק (retirementExpense=0) מאפס את SIM_TARGET_EXP למנוע.

**`index.html`** — גרסה עודכנה ל-`v168.96`

## שינויים אחרונים (22/04/2026 — v168.93)

### v168.93 – Rental Integration & UI Sequence

**`app.js` — `simGetRoyRentalIncome()` — פונקציה חדשה:**
- מחזירה הכנסות שכ"ד של רועי מ-`PENSION_ASSETS[].realEstateIncome` (₪/חודש).
- מסננת נכסי יעל — רועי בלבד.

**`app.js` — `simInit()` + `simRefresh()` + `simRunEngine()` — Slider = X+Y:**
- Slider "הכנסה קבועה" מוגדר ל: `netPension + rentalIncome`.
- X = `pnsNetMonthlyNoHarel` (פנסיה נטו); Y = `simGetRoyRentalIncome()` (שכ"ד מהאקסל).
- Firewall בכניסה ל-`simRunEngine()` עודכן גם הוא לכלול rental.

**`app.js` — `simRenderKPI()` — מניעת double-count:**
- Excel mode: `_incomeNIS = SIM_PENSION_MONTHLY` (rental כלול, לא מתווסף שוב).
- Manual mode: `_incomeNIS = SIM_PENSION_MONTHLY + ffsGetMonthlyRentNetK() * 1000` (rental נפרד).

**`app.js` — `simRunEngine()` — cap על ריבית חודשית:**
- `monthlyRate` ו-`retYieldMonthly` מוגבלים ל-2%/חודש (27% שנתי) — מונע overflow מקלט שגוי.

**`app.js` — KPI #3 "חיסכון חודשי (עכשיו)" — Surplus גולמי בלבד:**
- `_currSavingNIS = salary - expenses` (Excel) או `FFS_PROFILE.monthlySavings` (ידני).
- ללא ריביות, ללא רווחי הון — ערך נקי בלבד.

**`index.html`** — גרסה עודכנה ל-`v168.93`

## שינויים אחרונים (22/04/2026 — v168.92)

## שינויים אחרונים (22/04/2026 — v168.92)

### v168.92 – Dynamic Data Integrity & Logical Flow

**`app.js` — `simRenderKPI()` — תיקון קריטי להון חזוי:**
- `_targetIdx = _targetYear - 2026` → **שגוי** (הפרש שנים, לא index חודשי).
- תוקן ל: `_targetIdx = simMonthIdx(_targetYear, 12)` — December של שנת היעד.
- הבדל: עבור גיל 67 (שנת 2047) — הנוסחה הישנה נתנה index=21 (חודש 21!), החדשה נותנת index=260 (דצמבר 2047). זה היה שורש "הטריליונים".

**`app.js` — `simRunEngine()` — cap על גידול חיסכון:**
- `_ffsSavingsGrowthMonthly`: capped ב-20% שנתי — מונע overflow/טריליונים מ-savingsGrowth גבוה.

**`app.js` — `simRunEngine()` — Firewall בכניסה:**
- בתחילת הפונקציה: כשExcel פעיל ו-`SIM_PENSION_MONTHLY === 0`, מאכלס מ-Excel net pension.

**`app.js` — `simInit()` + `simRefresh()` — פנסיה נטו:**
- `simGetRoyPension()` (GROSS `expectedPension`) → `pnsNetMonthlyNoHarel` (נטו אחרי מס).
- fallback לברוטו רק אם חישוב נטו טרם רץ.

**`index.html` — Drawer — 3 שלבים לפי ציר חיים:**
- **שלב א' 🟢 צבירה**: הון נוכחי + תזרים חודשי + השקעות + נדל"ן.
- **שלב ב' 🟡 גישור**: תקופת מעבר הוצאה מ-accordion פרטים אישיים → section נפרד.
- **שלב ג' 🔵 פרישה**: הכנסות + הוצאות + פנסיה.

**`index.html`** — גרסה עודכנה ל-`v168.92`

## שינויים אחרונים (22/04/2026 — v168.91)

## שינויים אחרונים (22/04/2026 — v168.91)

### v168.91 – Final KPI Stabilization & Ghost Data Purge

**`index.html` — 4 תוויות KPI סופיות ונעולות (בסדר חדש):**
1. **הון חזוי** — הון חזוי לגיל היעד (ללא שינוי)
2. **תזרים נטו בפרישה** — הכנסות פסיביות פחות הוצאות לאחר גיל 67 (הועבר מ-#4 ל-#2)
3. **חיסכון חודשי (עכשיו)** — חיסכון שוטף בדיוק כמוזן (5K = 5, לא 6)
4. **צבירה כוללת (חודשית)** — חיסכון חודשי + רווח הון חודשי על תיק קיים

כל יחידות המשנה תוקנו ל-"אלפי ₪" (לא ₪ בלבד).

**`index.html` — Sliders Hard-Reset:**
- ערך ברירת מחדל של `sim-pension-monthly-slider` ו-`sim-pension-monthly-num` שונה מ-35000 ל-0.
- min attribute עודכן ל-0 (היה 5000).

**`app.js` — `SIM_PENSION_MONTHLY` — ברירת מחדל 0:**
- שורת הגדרת `var SIM_PENSION_MONTHLY = 35000` שונתה ל-0.
- זה סוגר את המקור העיקרי לבאג ה-34k.

**`app.js` — `simInit()` — resetAllInputs() ראשון:**
- `resetAllInputs()` מופעל כשורה הראשונה ב-`simInit()`, לפני `ffsLoadProfile()`.
- כל ה-sliders מאופסים אפס לפני שנתונים כלשהם נטענים.

**`app.js` — `simRenderKPI()` — לוגיקה חדשה לצבירה כוללת:**
- ערכים מחושבים מראש לפני הרנדור (ניקוי תלויות).
- KPI #4 "צבירה כוללת" = `_currSavingNIS + (_invK * 1000 * SIM_RATE/100/12)`.

**`app.js` — `ffsToggleDataSource()` — מעבר מיידי ל-"אורח":**
- בעת מעבר EXCEL → MANUAL: אם `FFS_PROFILE.name` ריק, מנקה `SIM_USER1_NAME = ''`.
- `simUpdateNameLabel()` מציג "מציג: אורח" מיד.

**`index.html`** — גרסה עודכנה ל-`v168.91`

## שינויים אחרונים (22/04/2026 — v168.90)

### v168.90 – Logic Separation & Two-Phase UX

**`index.html` — ה-Drawer מחולק לשני סקשנים ויזואליים:**
- **SECTION A 🟢 "תקופת הצבירה — עכשיו"**: כולל כרטיסיית "חיסכון חודשי נטו" (`id="ffs-monthly-savings"`) + accordions של השקעות ונדל"ן.
- **SECTION B 🔵 "תקופת הפרישה — מגיל 67"**: כולל כרטיסיה עם 2 שדות — "צפי הכנסות חודשיות" (`id="ffs-retirement-income"`) + "הוצאה חודשית צפויה" (`id="ffs-retirement-expense"`) — ואחריה accordion פנסיה.
- ה-accordion "פרטים אישיים" נשמר ניטרלי (מעל שני הסקשנים).

**`app.js` — `FFS_PROFILE` + `ffsLoadProfile()` — שדה חדש:**
- `retirementIncome` נוסף ל-`FFS_PROFILE` default object.
- `ffsLoadProfile()` טוען `saved.retirementIncome || 0`.

**`app.js` — `ffsSaveField()` — סנכרון slider בזמן אמת:**
- `retirementIncome` → מעדכן `SIM_PENSION_MONTHLY` + sliders DOM + `simRenderKPI()`.
- `retirementExpense` → מעדכן `SIM_TARGET_EXP` + sliders DOM + `simRenderKPI()`.

**`app.js` — `resetAllInputs()` — פונקציה חדשה:**
- מאפסת `SIM_PENSION_MONTHLY`, `SIM_TARGET_EXP` וכל sliders DOM.
- נקראת מ: `ffsToggleDataSource()`, `ffsStartFreshProfile()`, `ffsConfirmReset()`.

**`app.js` — `simRenderKPI()` — KPIs מחולקים:**
- KPI #3 "חיסכון חודשי שוטף": הפרש `SIM_CURRENT_SALARY - simGetCurrentExpenses()` (Excel) או `FFS_PROFILE.monthlySavings` (ידני).
- KPI #4 "תזרים נטו בפרישה": `_incomeNIS - SIM_TARGET_EXP` — מה שנשאר מהקצבות אחרי הוצאות.

**`app.js` — `ffsSyncSliders()` — העדפת `retirementIncome`:**
- כש-`FFS_PROFILE.retirementIncome > 0` → משתמש בו במקום בחישוב הפנסיה האוטומטי.

**`app.js` — `ffsStartFreshProfile()` — ניקוי מלא:**
- מנקה גם `retirementIncome` + קורא `resetAllInputs()`.

**`index.html`** — גרסה עודכנה ל-`v168.90`

## שינויים אחרונים (22/04/2026 — v168.89)

### v168.89 – Strict Source Sanitization & Auto-Reset

**`app.js` — `ffsClearMemory()` — New Firewall Function:**
- פונקציה חדשה: מאפסת `FFS_PROFILE.investments`, `.pension`, `.realEstate`, `.monthlySavings` בזיכרון הפעיל.
- **לא** נוגעת ב-localStorage — המשתמש יכול לחזור למצב ידני ולקבל בחזרה את הנתונים שלו.
- שומרת identity fields (name, birthDate, retirementAge) לצורך תצוגה ב-Drawer.

**`app.js` — `simInit()` — Auto-Sanitization:**
- כשExcel מזוהה: קורא `ffsClearMemory()` מיד אחרי `activeDataSource = 'EXCEL'`.
- מסנכרן `SIM_PENSION_MONTHLY` מ-`simGetRoyPension()` (נתוני קרן אמיתיים).

**`app.js` — `simRefresh()` — Auto-Sanitization on Upload:**
- כשExcel מועלה: קורא `ffsClearMemory()` לפני כל חישוב.
- Task 3: מסנכרן גם slider הכנסה קבועה מ-`simGetRoyPension()`.

**`app.js` — `ffsToggleDataSource()` — Bidirectional Isolation:**
- EXCEL → MANUAL: קורא `ffsLoadProfile()` + `ffsSyncSliders()` לשחזור FFS מ-localStorage.
- MANUAL → EXCEL: קורא `ffsClearMemory()` לניקוי FFS מהזיכרון.

**`app.js` — `simRenderKPI()` — Guarded `_hasAnyData`:**
- `ffsGetLiquidCapital()` ו-`ffsGetPensionAccumK()` עטופים ב-`!isExcelLoaded()` — מונע "phantom data detection" בExcel mode.

**`app.js` — `ffsConfirmReset()` — Instant Reset (No Reload):**
- מחיקת `location.reload()` — במקום קורא `ffsStartFreshProfile()`.
- מנקה FFS profile + אירועים מ-localStorage ומהזיכרון. Excel data נשמרת בשלמותה.

**`index.html` — כפתור "אפס פרופיל משתמש" — Highly Visible:**
- עיצוב חדש: כפתור מלא עם border אדום, רקע קל, hover state.
- תת-כיתוב: "מאפס מיידית — ללא טעינה מחדש".

**`index.html`** — גרסה עודכנה ל-`v168.89`

## שינויים אחרונים (22/04/2026 — v168.88)

### v168.88 – Dynamic KPI Sync & FFS Income Logic

**`app.js` — `simRenderKPI()` — Dynamic Income & Net Flow:**
- "הכנסה פנויה" (`sim-hdr-monthly-income`) עודכן: `SIM_PENSION_MONTHLY + _rentNIS`.
  - כשExcel: `_rentNIS = SIM_RENTAL_INCOME` (מהגדרות).
  - כשFFS ידני: `_rentNIS = ffsGetMonthlyRentNetK() × 1000` (נכסי FFS עם שכ"ד).
- "תזרים נטו" (`sim-hdr-monthly-accum`) מחושב: `_incomeNIS − SIM_TARGET_EXP` — real-time מה-sliders.
- "צבירה כוללת" (`sim-hdr-total-accum`) משתמש ב-`_netFlow` המעודכן (כולל שכ"ד).
- עדכון בזמן אמת — `simSetPensionMonthly()`, `simSetExpense()` ו-`simSetRentalIncome()` כולם קוראים `simRenderKPI()`.

**`app.js` — `ffsRenderAll()` — Avi Ghost Cleanup Button:**
- בודק אם `activeDataSource === 'MANUAL'` ו-`FFS_PROFILE.name` קיים.
- אם כן: מציג כפתור `id="ffs-new-profile-btn"` ("התחל פרופיל חדש 🆕").

**`app.js` — `ffsStartFreshProfile()` — New Function:**
- מנקה את כל `FFS_PROFILE` (ללא reload) + localStorage.
- קורא `ffsRenderAll()` + `simFullRefresh()` — Drawer ריק מוכן לפרופיל חדש.

**`index.html` — כפתור "התחל פרופיל חדש 🆕":**
- נוסף `<button id="ffs-new-profile-btn">` בראש ה-Drawer (מתחת לכפתור המקור).
- עיצוב: border אדום שקוף, רקע מינימלי — לא פולשני.

**`app.js` — Tags Styling:**
- Tags `[אקסל]`/`[ידני]` עוצבו מחדש: font 7px, border + background pill, letter-spacing 0.4px, border-radius 4px.

**`index.html`** — גרסה עודכנה ל-`v168.88`

## שינויים אחרונים (22/04/2026 — v168.87)

### v168.87 – Total KPI Alignment & Source Labeling

**`index.html` — Source Transparency Tags:**
- נוספו 4 אלמנטי `<span>` עם IDs (`sim-src-tag-wealth`, `sim-src-tag-income`, `sim-src-tag-accum`, `sim-src-tag-total`) מתחת לכל KPI ב-Header הסימולטור.
- כשExcel פעיל: מציג `[אקסל]` בצבע כחול. כשFFS ידני: מציג `[ידני]` בצבע צהוב. כשאין נתונים: נסתר.

**`app.js` — `simRenderKPI()` — Source Tags Update:**
- בסוף הפונקציה: מעדכן את 4 ה-tags לפי `isExcelLoaded()` — צבע + רקע שקוף בהתאם למקור.

**`app.js` — `ffsSyncSliders()` — Excel Guard:**
- נוסף `if (isExcelLoaded()) return;` בתחילת הפונקציה — כשExcel פעיל, sliders לא נדרסים בנתוני FFS/Avi.

**`app.js` — `simInit()` — Auto-detect Excel on Init:**
- נוסף `if (_hasRawExcelData()) activeDataSource = 'EXCEL'` לפני `ffsSyncSliders()`.
- מבטיח שב-init הראשון עם Excel קיים, ה-source יוגדר נכון לפני כל sync.

**`app.js` — `simRefresh()` — Slider Hard-Reset after Excel Upload:**
- אחרי `activeDataSource = 'EXCEL'`: מאפס `SIM_TARGET_EXP` ו-`SIM_CURRENT_SALARY` מנתוני CF_DATA האמיתיים.
- מפעיל `ffsRenderAll()` אוטומטית — Drawer מציג מיד נתוני רועי/Excel, ללא Avi ghosts.

**`app.js` — `simFullRefresh()` — Pre-render FFS Clear:**
- בתחילת הפונקציה: אם `isExcelLoaded()`, מסנכרן `SIM_TARGET_EXP` ו-`SIM_CURRENT_SALARY` מ-CF_DATA לפני כל render.
- מבטיח שאף render לא יפלוט ערכי FFS ישנים כשExcel הוא המקור הפעיל.

**`index.html`** — גרסה עודכנה ל-`v168.87`

## שינויים אחרונים (22/04/2026 — v168.86)

### v168.86 – The Absolute Data Isolation Patch

**`app.js` — 1. `activeDataSource` Global Switch:**
- נוסף `var activeDataSource = 'MANUAL'` — משתנה גלובלי ראשי ('EXCEL' | 'MANUAL').
- `isExcelLoaded()` בודק תחילה `activeDataSource !== 'EXCEL'` — משתמש יכול לעקוף Excel ולבחור ידנית.
- נוסף `_hasRawExcelData()` — בדיקת נוכחות Excel גולמית, ללא תלות ב-`activeDataSource` (לטובת הכפתור).

**`app.js` — 2. `simFullRefresh()` — Unified Re-render:**
- פונקציה חדשה `simFullRefresh()`: מפעילה `simCheckEmpty()` → `simRenderKPI()` → `simRenderChart(simRunEngine())` → `simUpdateNameLabel()` → `ovRenderSimMini()`.
- קריאה מ-`ffsApplyAndClose()`, `ffsToggleDataSource()` — עדכון אחיד בכל החלפת מקור נתונים.

**`app.js` — 3. `ffsToggleDataSource()` — Drawer Unlock:**
- פונקציה חדשה `ffsToggleDataSource()`: מחליפה `activeDataSource` בין EXCEL ↔ MANUAL, קוראת `ffsRenderAll()` + `simFullRefresh()`.
- `simRefresh()` (בטעינת Excel): מגדיר `activeDataSource = 'EXCEL'` אוטומטית.

**`app.js` / `index.html` — 4. Switch Button בDrawer:**
- נוסף `<div id="ffs-source-switch">` + `<button id="ffs-switch-btn">` בכותרת ה-Drawer.
- `ffsRenderAll()` מציג/מסתיר לפי `_hasRawExcelData()`, צובע אדום (EXCEL→MANUAL) / כחול (MANUAL→EXCEL), ומעדכן טקסט בהתאם.
- Drawer body נשאר נגיש — רק נעול כשExcel פעיל; לחיצה על הכפתור מבטלת את הנעילה.

**`index.html`** — גרסה עודכנה ל-`v168.86`

## שינויים אחרונים (22/04/2026 — v168.85)

### v168.85 – Drawer Content Sync & Profile Lock

**`index.html` — Drawer:**
- נוסף `id="ffs-drawer-body"` + `position:relative` לבלוק הגוף של ה-Drawer.
- נוסף `<div id="ffs-excel-badge">` בכותרת ה-Drawer: "📊 נתוני אקסל פעילים — עריכה ידנית מושבתת" — נגלה רק כשExcel פעיל.

**`app.js` — `ffsRenderAll()` — Profile Lock:**
- כשExcel פעיל: מציג שדות פרופיל מ-Excel globals (`SIM_USER1_NAME`, `SIM_USER1_BIRTH`, `SIM_RETIREMENT_AGE_ROY`), מנקה שדות FFS-ספציפיים, ומנטרל את כל הgestion (pointer-events:none, opacity:0.62).
- מציג/מסתיר את ה-badge לפי `isExcelLoaded()`.
- בזמן שאין Excel: מחזיר לנתוני FFS_PROFILE רגילים עם inputs פעילים.

**`app.js` — `simCheckEmpty()` — Guest Mode:**
- שוכתב: כשאין נתונים (`!hasData`) — מסתיר גם chart, sliders, controls, timeline (לא רק KPI). מציג רק את `sim-empty-msg`.
- כשיש נתונים — מציג הכל כרגיל.

**`app.js` — `simUpdateLegend()` — No Phantom Keys:**
- מסנן `datasets` לפני הצגת ה-legend: רק שכבות עם לפחות ערך אחד >0 מוצגות.
- בGuest Mode עם הכל 0 — Legend ריק לחלוטין.

**`index.html`** — גרסה עודכנה ל-`v168.85`

## שינויים אחרונים (22/04/2026 — v168.84)

### v168.84 – Strict Data Isolation & Dynamic Legend Fix

**`app.js` — 1. `isExcelLoaded()` + Strict Data Precedence:**
- פונקציה חדשה `isExcelLoaded()`: מחזירה `true` אם `CF_DATA.length > 0` אוֹ `PENSION_ASSETS.length > 0` ו-`!isDemoMode`.
- `simGetRoyCapital()`, `simGetRoyRealEstate()`, `simGetRoyPensionAccum()`, `simGetRoyHarelAccum()`: כולם עטופים — FFS נוסף **רק** כשאין Excel.
- `simRunEngine()`: `_ffsSavingsK` ו-`_rentNetK` מאופסים כשExcel טעון.
- `ffsApplyToSimulator()`: לא דורס `SIM_USER1_NAME` כשExcel טעון.
- `ffsUpdateDrawerTitle()`: מציג שם Excel כשExcel טעון.

**`app.js` — 2. Dynamic Legend (Ghost Harel Fix):**
- פונקציות חדשות `simGetPhoenixLayerName()` ו-`simGetHarelLayerName()`: מחזירות שם ספק אמיתי מ-`PENSION_ASSETS` או `FFS_PROFILE.pension`.
- שכבות הגרף מקבלות `label` דינמי מהנתונים, לא `SIM_PENSION_FUND_NAME`/`SIM_SAVINGS_FUND_NAME` hardcoded.
- נוסף `_layer: 'phoenix'/'harel'` prop לכל dataset — tooltip מזהה לפי `_layer` (לא label).
- Legend תמיד תואם 100% לנתונים בפועל.

**`app.js` — 3. Empty State KPIs:**
- `simRenderKPI()`: בתחילה בודק `_hasAnyData`. אם אין נתונים (Excel, FFS, FUNDS) — כל ה-KPI מוצגים כ-`—` וה-function עוצרת. אין "phantom numbers" בGuest Mode.

**`app.js` — 4. Inheritance Double-Count Fix:**
- `simGetRoyHarelAccum()`: FFS ביטוח מנהלים נוסף **רק** כשאין Excel (`!isExcelLoaded()`), מונע double-count כשExcel כולל נכסים דומים.

**`index.html`** — גרסה עודכנה ל-`v168.84`

## שינויים אחרונים (22/04/2026 — v168.83)

### v168.83 – Final Logic Sync & Ghost Cleanup

**`app.js` — 1. Profile Priority Overhaul:**
- `simUpdateNameLabel()`: כשיש נתוני Excel (`simGetRoyCapital()>0` או `CF_DATA.length>0`) — Excel תמיד מנצח FFS. הפונקציה מחזירה `SIM_USER1_NAME || 'רועי'` ומתעלמת מ-`FFS_PROFILE.name`.
- `simRefresh()`: כשמטענים Excel ו-`SIM_USER1_NAME === FFS_PROFILE.name` (סימן ש-FFS השתלט), מאפסים בחזרה ל-`'רועי'`.

**`app.js` — 2. Slider Wiring תשואת הון פנסיוני:**
- `syncSettingsToSliders()`: לאחר עדכון DOM של הסליידר, מוסיפים `pnsRetirementYield = SIM_PENSION_RATE` — מסנכרן את משתנה in-memory עם ה-global.
- `simInit()`: קורא ל-`pnsRetirementYieldChange(SIM_PENSION_RATE || pnsRetirementYield)` במקום `pnsRetirementYield` בלבד.

**`app.js` — 3. Legend & Ghost Data Cleanup (הראל):**
- `simRenderChart()`: בדיקת `_hasHarel = hrl.some(v>0)` לפני בניית datasets.
- שכבת הראל (`SIM_SAVINGS_FUND_NAME`) נוספת ל-datasets **רק אם** יש נתוני הראל בפועל — הן ב-'roy' הן ב-'combined'.
- `_cYaelTop` בנוי דינמית לפי נוכחות/היעדרות שכבת הראל.
- Tooltip callback שוכתב ממיפוי לפי אינדקס למיפוי לפי **label** — עמיד לשינוי מספר שכבות.
- `simUpdateLegend()` מקבל את ה-datasets הדינמיים — Legend תמיד תואם לנתונים בפועל.

**`app.js` — 4. Inheritance Sync (ביטוח מנהלים):**
- `simGetRoyHarelAccum()`: מוסיף גם פריטי FFS מסוג `pensionType === 'manager'` לשכבה 3 (הון לירושה), תוך המרת K₪ → ₪. מונע double-count כי `royPhoenixCap = totalPenK - harelK`.

**`index.html`** — גרסה עודכנה ל-`v168.83`

## שינויים אחרונים (21/04/2026 — v168.71)

### v168.71 – Non-Destructive FFS Power Pedestal

**`index.html` — Drawer + כפתור:**
- כפתור `⚙ הגדרות סימולציה` נוסף לשורת הכותרת של פאנל הסליידרים
- Drawer צד שמאל (390px): `position:fixed`, `z-index:10100`, `backdrop-filter:blur`
- 4 סקציות: פרופיל אישי (שם, תאריך לידה, גיל פרישה, תוחלת חיים) | השקעות [+] | נדל"ן [+] | פנסיה וביטוחים [+]
- כפתור "החל ועדכן סימולטור" מחיל את הנתונים ← סוגר Drawer

**`app.js` — FFS Variables & Profile:**
- `FFS_PROFILE_LS_KEY = 'ffs_profile_v1'` + אובייקט `FFS_PROFILE` (investments/realEstate/pension)
- `ffsLoadProfile()` / `ffsSaveProfile()` — LocalStorage persistence
- כל שינוי בשדה נשמר אוטומטית ל-LocalStorage

**`app.js` — Getters Additive (לא פוגעים בקוד קיים):**
- `ffsGetLiquidCapital()` → מחובר ל-`simGetRoyCapital()` (מוסיף, לא מחליף)
- `ffsGetPensionAccumK()` → מחובר ל-`simGetRoyPensionAccum()` (K₪ → ₪)
- `ffsGetRealEstateK()` → מחובר ל-`simGetRoyRealEstate()`
- ביטוח חיים = AI context בלבד, לא בגרף

**`app.js` — AI Sync:**
- `buildFFSContext()` מזריק שמות נכסים + יתרות לתוך `buildGlobalContext()` (FFS_PROFILE block)
- גיל מדויק חישוב מתאריך לידה (שנה שברית)

**`app.js` — ffsApplyToSimulator():**
- עדכון `SIM_BIRTH_YEAR_ROY`, `SIM_RETIREMENT_AGE_ROY`, `SIM_USER1_NAME`
- חישוב מחדש של גבולות פאזות + `simRenderChart(simRunEngine())`

## שינויים אחרונים (21/04/2026 — v168.70)

### v168.70 – Financial Milestone Indexing (The Navigator Update)

**`app.js` — milestonesSummary בתוך SIMULATOR_DOMAIN:**
- אובייקט `_milestonesSummary` נבנה עם 4 נקודות ציון קבועות: 2029 (פרישה גיל 67), 2033 (גיל 70), 2043 (גיל 80), 2047 (גיל 84 — תוחלת חיים)
- לכל שנה: הון כולל, נזיל, פנסיה, הראל, נדל"ן (מתוך `SIM_LAST_RESULT`) + אירועים (מתוך `simCollectEvents()`)
- כאשר `SIM_LAST_RESULT` ריק (הסימולטור טרם הופעל) — כל הערכים מוצגים כ-'N/A'
- גיל פרישה דינמי נוסף אוטומטית אם שונה מ-2029

**`app.js` — system prompt מעודכן:**
- הוראה לבינה: "עיין תמיד ב-milestonesSummary ראשון — זוהי מפת הניווט הראשית לעתיד רועי"
- מפנה במפורש לשנים: 2029 (פרישה), 2033, 2043, 2047

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.70`

## שינויים אחרונים (21/04/2026 — v168.69)

### v168.69 – Universal UI Recovery

**`index.html` — שיחזור מבנה הכותרת:**
- שוחזר `<h1>` עם `</h1>` סגור כהלכה + `<p id="hdr-subtitle">` — כפי שהיה לפני
- שוחזר `</div>` לסגירת `hdr-title-group` במקום הנכון
- שוחזר כל בלוק `<div class="sim-header sim-only-btn">` כולל:
  - 4 כרטיסי KPI: הון חזוי, הכנסה פנויה, תזרים נטו, צבירה כוללת
  - כפתורי שליטה: `chat-btn`, `settings-btn`, toggle תצוגה, toggle הראל, גיל יעד
- הסרת כפתורי sim מתוך ה-`<h1>` שם לא שייכים

**הבעיה שנגרמה (v167.9 → v168.67):** מחיקה בשגגה של כל ה-`sim-header` והכנסת הכפתורים לתוך `<h1>` פתוח — גרמה לפריסה שבורה בכל הלשוניות.

## שינויים אחרונים (21/04/2026 — v168.67)

### v168.67 – Demo Mode AI Bridge & UI Polish

**`app.js` — Task 1: Fix Demo Data Visibility for AI:**
- `buildSystemStatus()`: domain מסומן `ACTIVE-DEMO` כשמצב דמו פעיל ויש נתונים, במקום EMPTY
- `buildGlobalContext()`: הוסרה ה-early return למצב דמו — ה-AI מקבל את כל נתוני הדמו (CF, Investments, Pension)
- הסימון `[מצב דמו — מוצגים נתוני דגמה]` מוצג בראש ההקשר כהערה, לא כחסימה
- System prompt: "אם תחום מסומן ACTIVE-DEMO — יש גישה לנתוני הדגמה; מותר לדון בהם"

**`index.html` — Task 2: עיצוב אחיד לכפתור צ'אט מבט-על:**
- `ov-only-btn toggleChat`: עודכן ל-`font-size:22px;opacity:0.85;` — בדיוק כמו cf-chat-btn ו-pns chat btn
- אין יותר רקע/גבול/טקסט "שאל AI" — רק אמוג'י 💬 כמו שאר הלשוניות

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.67`

## שינויים אחרונים (21/04/2026 — v168.66)

### v168.66 – Global Overview AI & Data Integrity Check

**`index.html` — Task 1: כפתור צ'אט AI בלשונית מבט על:**
- הוספת `<span class="ov-only-btn" onclick="toggleChat()">💬 שאל AI</span>` בכותרת
- מחובר ל-`toggleChat()` ← `buildGlobalContext()` — אותו צ'אט גלובלי
- מוצג בלשונית מבט-על בלבד (`.ov-only-btn`)

**`app.js` — Task 2: `buildSystemStatus()` — בדיקת זמינות נתונים:**
- פונקציה חדשה בודקת כל domain: CF_DATA.length, FUNDS keys, PENSION_ASSETS.length, isDemoMode
- מחזירה אובייקט עם ערכים: LOADED/EMPTY לכל תחום + DEMO_MODE status

**`app.js` — Task 3: הזרקת `systemStatus` ל-`sendChat()`:**
- בלוק `--- systemStatus ---` מוזרק לפני ה-system prompt
- AI מקבל הוראה: "אם תחום מסומן EMPTY — הודע למשתמש שאין נתונים, במקום להניח"
- הוספת ניתוב overview: 'עודד ניתוח הוליסטי כולל'

**`app.js` — Task 4: Intelligence הוליסטית ב-system prompt:**
- "אתה היועץ הפיננסי האישי הראשי — רואה תמונה שלמה"
- "קשר תזרים שוטף, מצב השקעות, ותחזיות פנסיה לייעוץ מקיף"

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.66`

## שינויים אחרונים (21/04/2026 — v168.65)

### v168.65 – Events Timeline Sync & Slider Enforcement

**`app.js` — Task 1: ציר אירועים מלא ב-SIMULATOR_DOMAIN:**
- `buildGlobalContext()` קורא עכשיו ל-`simCollectEvents()` — מכיל גם `PENSION_EVENTS` (אירועי פרישה) וגם `SIM_USER_EVENTS`
- כל אירוע כולל `breakdown` מפורט (פיצוי, מענק, תשלום חד-פעמי וכד')
- אירועים מאורגנים לפי שנה לקורלציה ישירה עם הגרף

**`app.js` — Task 2: בלוק `activeParameters` מפורש:**
- הוספת סקציה `--- activeParameters ---` ב-SIMULATOR_DOMAIN עם: תשואה, אינפלציה, גדילת נדל"ן, מס רווח הון, תשואת פרישה, הוצאה יעד, שכר מדריך, קצבה, גבולות פאזות
- תשואה נטו אפקטיבית מחושבת ומוצגת: `SIM_RATE × (1 - tax%)`

**`app.js` — Task 3: הוראות קורלציה ב-system prompt:**
- "השתמש תמיד בערכי activeParameters — אל תניח ערכי ברירת מחדל"
- "כדי לאתר אירוע בשנה מסוימת: חפש תחת אותה שנה בציר האירועים"

**`app.js` — Task 2+: תחזית הון עם פירוט שכבות:**
- כל אבן דרך מציגה: נזיל | פנסיה | הראל | נדל"ן בנפרד

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.65`

## שינויים אחרונים (21/04/2026 — v168.64)

### v168.64 – Simulator Math Sync & AI Vision Fix

**`app.js` — Task 1: תיקון מתמטיקת הסימולטור:**
- `simRunEngine()`: הוספת `_taxFactor = 1 - SIM_CAPITAL_TAX/100`
- `monthlyRate` ו-`retYieldMonthly` מחושבים כעת לאחר ניכוי מס רווח הון אפקטיבי
- הסליידר "מס רווח הון" מוחל כעת ממש על חישובי הצבירה בגרף

**`app.js` — Task 2: הרחבת ראיית ה-AI (SIMULATOR_DOMAIN):**
- `SIM_LAST_RESULT` — global חדש שמאחסן את תוצאת `simRunEngine()` האחרונה
- `simRenderChart()`: שומר את ה-result המלא (לפני zoom) ב-`SIM_LAST_RESULT`
- `buildGlobalContext()` SIMULATOR_DOMAIN: כולל עכשיו אבני דרך (שנה נוכחית, +5, +10, גיל פרישה, סוף) עם הון צפוי + ציר אירועים (`SIM_USER_EVENTS`)
- ה-AI יכול לענות "מה ההון הצפוי שלי בגיל 67?"

**`app.js` — Task 3: ניתוב AI לפי לשונית פעילה:**
- `sendChat()`: מזהה לשונית פעילה מ-`localStorage.getItem('active_tab')`
- Simulator → "תעדף SIMULATOR_DOMAIN" | Pension → "תעדף PENSION_DOMAIN" | Cashflow → "תעדף CASHFLOW_DOMAIN"
- הרמז מתווסף לתחילת ה-system prompt

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.64`

## שינויים אחרונים (21/04/2026 — v168.63)

### v168.63 – AI Context Routing & Domain Mapping

**`app.js` — Task 1+2: `buildGlobalContext()` עם 4 תחומים מפורשים:**
- שכתוב מלא של `buildGlobalContext()` — עטיפת כל תחום בבלוק תוויות: `INVESTMENT_DOMAIN`, `CASHFLOW_DOMAIN`, `PENSION_DOMAIN`, `SIMULATOR_DOMAIN`
- AI כבר לא מבלבל בין פנסיה להשקעות — כל תחום עם שם ברור

**`app.js` — Task 3: `buildPnsContext()` — העשרת שדות:**
- כל נכס פנסיה כולל עכשיו: `lifeInsurance`, `פרמיה חודשית`, `מטרה`
- `owner` — אף פעם לא מציג `'?'` — ברירת מחדל: `'לא ידוע'`

**`app.js` — Task 4: הוראות ניתוב ב-`sendChat()`:**
- פרומפט מערכת חדש: "עוזר מתמחה עם 4 תחומי נתונים נפרדים"
- כלל ניתוב: כאשר נשאל על הראל/פניקס/ביטוח חיים/פנסיה — סרוק `PENSION_DOMAIN` לעומק לפני שמדווח על נתונים חסרים

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.63`

## שינויים אחרונים (21/04/2026 — v168.62)

### v168.62 – Financial Simulator Precision Start

**`app.js` — Task 1: נקודת פתיחה דינמית לסימולטור:**
- `SIM_P1_START`: שונה מ-`{ y:2026, m:3 }` לדינמי: `{ y: new Date().getFullYear(), m: new Date().getMonth()+1 }`
- כל חישובי `simMonthIdx` / `simIdxToYM` מבוססים על הנוסחה מ-`SIM_P1_START` — מגיבים לתאריך אוטומטית
- הגרף מתחיל מהחודש הנוכחי (אפריל 2026)

**`app.js` — Task 2: ברירת מחדל — 10 שנים מהיום:**
- `SIM_ZOOM = 'decade'` (שונה מ-'full') — מצב ברירת מחדל בטעינה ראשונה
- `SIM_DEFAULT_ZOOM = 'decade'` — ערך ה-reset לאחר `clearDashboardData()`
- `SIM_ZOOM_CUSTOM.decStart/decEnd`: עדיין `new Date().getFullYear()` + 10 (v168.61)
- localStorage: אם קיים ערך שמור, הוא גובר על ברירת המחדל (שמירת העדפות ממשיכה)

**Task 3 — Carryover (ללא שינוי):**
- CF: `_sumAnn` ישיר (ללא מכפילים) — v168.61 ✅
- AI Firewall במצב דמו — v168.60 ✅
- תיוג בעלות פנסיה (רועי/יעל) — v168.60 ✅
- אירועי Sandbox — חודש נוכחי בלבד — v168.60 ✅

**`index.html` + `app.js`** — גרסה עודכנה ל-`v168.62`

## שינויים אחרונים (18/04/2026 — v168.55)

### v168.55 – Absolute Header Alignment — Grid Cockpit Layout

**`index.html` — סימולטור:**
- כותרת הגרף הוחלפה מ-`position:absolute` overlays ומ-flexbox ל-**CSS Grid** עם `grid-template-columns: 1fr auto 1fr`
- עמודה שמאל: כפתורי שנה/גיל/שניהם
- עמודה מרכז (auto): כפתורי נומינלי/ריאלי — ממורכזים לחלוטין בלי margin tricks
- עמודה ימין: `#sim-legend-html` (legend מותאם אישית) + סקאלה + זום, עם `justify-self: end`
- `margin-bottom: 20px` בין הכותרת לקנבס

**`app.js` — `simRenderChart`:**
- `legend: { display: false }` — Chart.js legend מבוטל לחלוטין
- נוסף קריאה ל-`simUpdateLegend(datasets)` בסוף כל render

**`app.js` — `simUpdateLegend(datasets)` (חדש):**
- בונה HTML legend ב-`#sim-legend-html` עם color swatch (פס 12×3px) ותווית לכל dataset
- מתעדכן אוטומטית בכל שינוי תצוגה (רועי/יעל/משולב, זום, מצב ריאלי/נומינלי)

## שינויים אחרונים (18/04/2026 — v168.12)

### v168.12 – Empty Dashboard Default, isDemoMode Explicit Gate

**`app.js` — משתנה גלובלי `isDemoMode`:**
- נוסף `var isDemoMode = false;` ליד ההגדרות הגלובליות הראשיות
- הוגדר `isDemoMode = true` בסוף `loadDemoData()` — לפני הוספת `demo-mode` class
- הוגדר `isDemoMode = false` בתחילת `clearDashboardData()`

**`app.js` — `ovRenderInvestChart`:**
- **שורש הבעיה**: `ALL_TOTALS` מאותחל עם 15 אפסים (לא מערך ריק) — `ALL_TOTALS.length === 0` היה תמיד `false`
- **הפתרון**: הפיק `_hasInvData = ALL_TOTALS.some(v => v > 0)` — אם כל הערכים אפס, מציג מצב ריק (empty state) במקום גרף שטוח
- כעת טעינה ראשונה ללא אקסל מציגה מסך ריק נקי

**`app.js` — `ovAllDataReady`:**
- `hasInv` עודכן מ-`ALL_TOTALS.length > 0` ל-`ALL_TOTALS.some(v => v > 0)` — עקביות עם הלוגיקה החדשה
- מניעת הצגת גרף הסימולטור המיני כאשר אין נתוני השקעות אמיתיים

**`index.html` + `app.js`** — גרסה עודכנה מ-`v168.11` ל-`v168.12`

## שינויים אחרונים (18/04/2026 — v168.9)

### v168.9 – Reset Tab and Demo State on Load

**`app.js` — בלוק `DOMContentLoaded`:**
- הוסר קריאת `localStorage.getItem('active_tab')` בטעינה
- הדשבורד תמיד מתחיל בטאב "מבט על" (overview) ללא קשר למה שנשמר
- נוספה שורה `document.body.classList.remove('demo-mode')` לוידוא שמצב דמו כבוי בטעינה

**`index.html` + `app.js`** — גרסה עודכנה מ-`v168.8` ל-`v168.9`

## שינויים אחרונים (18/04/2026 — v168.2)

### v168.2 – Extract DOB from Excel and Sync Settings

**`app.js` — פונקציה חדשה `extractAndSaveDobFromPensionSheet(wb, sheetName)`:**
- מאתרת את שורת "שייכות" (רועי/יעל) ושורת "תאריך לידה" בגיליון תכנון פרישה
- מחלצת שמות מ-col B (index 1) ו-col N (index 13)
- ממירה ערכי תאריך לידה (Date object / Excel serial / מחרוזת DD/MM/YYYY) לפורמט YYYY-MM-DD
- שומרת שמות ותאריכי לידה ל-localStorage (SETTINGS_LS_KEY) ולמשתנים הגלובליים
- מעדכנת אלמנטי DOM בלשונית הגדרות
- קוראת `syncBirthYearsFromSettings()` ו-`simRenderChart(simRunEngine())` לעדכון מיידי

**`app.js` — `loadExcelFileCore`:**
- נוספה קריאה ל-`extractAndSaveDobFromPensionSheet(wb, pnsSheetName)` מיד אחרי `pensionSaveToStorage()`

**`index.html` + `app.js`** — גרסה עודכנה מ-`v168.0` ל-`v168.2`

גרסה: `v168.0` → `v168.2`.

## שינויים אחרונים (16/04/2026 — v166.0)

### v166.0 – Fix Demo Data Forward Projections

**`app.js` — תיקון גרף השקעות (התרסקות לאפס):**
- **שורש הבעיה**: אם המשתמש טען קודם נתוני אקסל שהכילו חודש אפריל 26 (LABELS.length=16), מערכי הדמו הקשיחים (15 ערכים) גורמים לאינדקס 15 להחזיר `undefined` → אפס בגרף
- **הפתרון**: `_demoBase` (15 ערכי בסיס ינואר 25–מרץ 26) + לולאה דינמית שמוסיפה ערכים בצמיחה עדינה (0.8%/חודש) עד `LABELS.length` — גרף לא יתרסק גם אם LABELS גדל בעתיד
- `'דירה'` מקבל `growthRate: 1` (ערך קבוע), שאר הנכסים `1.008`

**`app.js` — תיקון גרף תזרים (חודשים חסרים):**
- **שורש הבעיה**: CF_DATA כלל רק ינואר–מרץ 26 (3 חודשים) → `ovRenderCashflowChart` (מסנן `year===2026`) הציג 3 עמודות בלבד
- **הפתרון**: לולאות for מייצרות **12 חודשי 2025** (היסטורי) + **12 חודשי 2026** (ינו–מרץ היסטורי, אפר–דצ מוקרן) + **12 חודשי 2027** (מוקרן) — סה״כ 36 רשומות
- `CF_CURRENT_MONTH_ID` עודכן ל-`2026-04` (חודש נוכחי)

**`index.html` + `app.js`** — גרסה עודכנה מ-`v165.0` ל-`v166.0`

גרסה: `v165.0` → `v166.0`.

## שינויים אחרונים (16/04/2026 — v165.0)

### v165.0 – Fix Demo Data Structure & Units

**`app.js` — כתיבה מחדש של `loadDemoData()`:**
- **ניקוי FUND_COL_K:** מחיקת כל ערכי ה-Column K לפני הזרקת נתוני דמו — מנע שגיאת אפס בגרף ההשקעות (buildCatChartTotals חיסר פיקדונות אמיתיים מנתוני דמו)
- **ניקוי PENSION_EVENTS:** `PENSION_EVENTS.length = 0` — מנע אירועי חד-פעמי (לומפ-סאם) מהאקסל האמיתי שגרמו לספייק 60M+ בסימולטור
- **ניקוי SIM_USER_EVENTS:** `SIM_USER_EVENTS.length = 0` — מנע אירועי משתמש קודמים מלהשפיע על הדמו
- **5 נכסי FUNDS נקיים** (ללא כפילות): הראלמגוון, מיטבקהש, מורגמל, דירה, מזומןשקלי — אף נכס לא מופיע גם ב-FUNDS וגם ב-PENSION_ASSETS
- **PENSION_ASSETS — כניסה אחת בלבד:** הפניקס פנסיה מקיפה (accumulation: 1,600,000 ₪) — ללא כפילות עם נכסי FUNDS
- **CF_DATA — 15 חודשים:** ינואר 25 עד מרץ 26 (2025 + 3 חודשי 2026) — מבטיח שנת 2026 מוצגת בגרף תזרים במבט-על
- **`simInited = false`:** מכריח אתחול מחדש של הסימולטור בכניסה הבאה לטאב

**`index.html` + `app.js` — עדכון גרסה:**
- מספר גרסה עודכן מ-`v164.0` ל-`v165.0`

גרסה: `v164.0` → `v165.0`.

## שינויים אחרונים (16/04/2026 — v164.0)

### v164.0 – Demo Data Realism & Button UX Refinement

**`app.js` — תיקון ערכי CF בנתוני הדמו:**
- ערכי `salary`, `rent_income`, `visa`, `cash_exp`, `total_exp` ב-CF_DATA תוקנו מ-NIS מלא (35000) לאלפי ₪ (28/5/12/9/21) — כנדרש כי `simGetCurrentSalary()` מכפיל ב-1000
- תיקון מנע "ספייק" של מיליוני ₪ בגרף הסימולטור עם נתוני דמו

**`index.html` — ארגון מחדש של כפתורי האדמין:**
- הוסרו כפתורי "🗑 נקה נתונים" ו-"🎭 טען נתוני דמו" עם הסטיילינג הבוטה (אדום/זהב)
- נוספה `<div class="admin-controls">` עם שני כפתורי אדמין עדינים (`.admin-btn`) — ממוקמת *אחרי* כפתורי ה-ov-only-btn (שמאל קצה ב-RTL)

**`style.css` — נראות וסטיילינג:**
- `.admin-controls { display: none; }` — מוסתר גלובלית בכל הטאבים
- `body.tab-overview .admin-controls { display: flex; }` — נראה *רק* בלשונית מבט-על
- `.admin-btn` — כפתור שקוף-עמום (`color: rgba(255,255,255,0.38)`) עם hover עדין, מתלכד עם שאר כפתורי הכותרת

גרסה: `v163.0` → `v164.0`.

## שינויים אחרונים (16/04/2026 — v163.0)

### v163.0 – Mini-Chart Labels, Demo Mode & Clear Data Button

**`app.js` — תיקון תוויות מיני-גרף מבט-על:**
- `ovRenderSimMini()`: תוויות `SIM_USER1_NAME + ' - פנסיה/חיסכון'` הוחלפו ב-`SIM_PENSION_FUND_NAME` / `SIM_SAVINGS_FUND_NAME` — תואמות כעת לגרף הראשי

**`app.js` — מצב דמו:**
- `loadDemoData()`: טוען נתוני FUNDS, CF_DATA, ו-PENSION_ASSETS ממוקדים ומציאותיים לצורך הצגה
- שומר ל-localStorage ומפעיל את כל זרימת האתחול (mirrors DOMContentLoaded flow)
- מציג הודעת סטטוס ב-`excel-status`

**`app.js` + `index.html` — כפתור "נקה נתונים":**
- `clearDashboardData()`: `localStorage.clear()` + `location.reload()` עם אישור משתמש
- כפתור אדום קטן `🗑 נקה נתונים` תמיד נראה בכותרת (שמאל עליון ב-RTL)
- כפתור `🎭 טען נתוני דמו` מוצג בלשונית מבט-על בלבד (`ov-only-btn`)

גרסה: `v162.0` → `v163.0`.

## שינויים אחרונים (16/04/2026 — v162.0)

### v162.0 – Fix Simulator Chart Hydration on Page Load

**`app.js` — שמירת אירועי ציר (permanent events) ב-localStorage:**
- `_simSaveUserEvents()`: עודכן לשמור את כל `SIM_USER_EVENTS` (כולל `permanent: true`) — בעבר סינן אותם
- `_simRestoreUserEvents()`: עודכן להחליף את כל המערך (`SIM_USER_EVENTS.length = 0`) — בעבר שחזר רק אירועים לא-קבועים
- לאחר ניתוח גיליון "ציר אירועים" ב-Excel: נוסף קריאה ל-`_simSaveUserEvents()` כדי לשמור אירועי פרישה קבועים מיידית

**`app.js` — DOMContentLoaded: שחזור + רנדור מפורש:**
- לפני `switchTab()`: קריאה ל-`_simRestoreUserEvents()` כשיש נתוני localStorage כדי לאכלס `SIM_USER_EVENTS` לפני כל רנדור
- לאחר `switchTab()`: `setTimeout(200ms)` שקורא מפורשות ל-`overviewRender()`, `simRenderKPI()`, `simRenderEvents()`, `simRenderTimeline()`, `simRenderChart(simRunEngine())` — מחקה את רצף הרנדור של `loadExcelFileCore()` ומבטיח שכל הגרפים מאוכלסים בטעינת עמוד

גרסה: `v161.0` → `v162.0`.

## שינויים אחרונים (16/04/2026 — v161.0)

### v161.0 – Revert Labels, CF Date Fix, Tab Persistence

**`app.js` + `index.html` — חזרה לתוויות אישיות (MVP):**
- הוסרו שדות הקלט "שם קרן פנסיה" / "שם פוליסת חיסכון" מלשונית ההגדרות
- הוסרה כל לוגיקת ה-Settings wiring (loadSettings/saveSettings)
- `SIM_PENSION_FUND_NAME = 'הפניקס+מבטחים'`, `SIM_SAVINGS_FUND_NAME = 'הראל'` — קבועים

**`app.js` — הגבלת תאריך בסימולטור תזרים:**
- `cfSandboxUpdateMonthOpts()`: נוסף clamping שנה — אם המשתמש מקליד שנה נמוכה מ-minYr, הקלט מוחזר ל-minYr
- `index.html sb-year`: עודכן `min="2026"`, max="2040", נוסף `onchange="cfSandboxUpdateMonthOpts()"`

**`app.js` — שמירת טאב פעיל:**
- `switchTab()`: שומר `localStorage.setItem('active_tab', id)` בכל מעבר טאב
- `DOMContentLoaded`: קורא `localStorage.getItem('active_tab')` ומפעיל את הטאב השמור (fallback: `overview`)

גרסה: `v160.0` → `v161.0`.

## שינויים אחרונים (16/04/2026 — v160.0)

### v160.0 – Global State Persistence, Donut Fix, Aggregation Fix, Dynamic Fund Names

**`app.js` — שמירת מצב גלובלי ב-localStorage:**
- `_dashSaveAssets()` / `_dashRestoreAssets()` — שמירה/שחזור נתוני FUNDS+LABELS+CAT_TOTALS (מפתח: `dashboard_assets_v1`)
- `_dashSaveCF()` / `_dashRestoreCF()` — שמירה/שחזור CF_DATA (מפתח: `dashboard_cf_v1`)
- `_dashSavePension()` / `_dashRestorePension()` — שמירה/שחזור PENSION_ASSETS (מפתח: `dashboard_pension_v1`)
- קריאות שמירה: סיום `loadExcelFileCore()`, טעינת CF, `pensionSaveToStorage()`
- שחזור ב-`DOMContentLoaded`: לפני `switchTab('overview')` — מחזיר נתוני גיליון, תזרים ופנסיה ומרנדר את הממשק מיידית

**`index.html` + `app.js` — תיקון גרפי עוגה:**
- הוספת `width="160" height="160"` ו-`style="width:160px;height:160px;flex-shrink:0;"` לכל 6 canvases של הדונאט (4 בלשונית השקעות + 2 במודל יעל)

**`app.js` — תיקון אגרגציית "כללי":**
- נוספו בדיקות `isRealEstate = (f.cat === 'dira')` ו-`isDebt = (f.cat === 'chov')` בלולאת חישוב גרף "מנייתי/כללי/כספי"
- דירה ולחובות לא ייכללו עוד ב"כללי"

**`app.js` + `index.html` — שמות קרן פנסיה/חיסכון דינמיים:**
- גלובלים חדשים: `SIM_PENSION_FUND_NAME = 'הפניקס'`, `SIM_SAVINGS_FUND_NAME = 'הראל'`
- שדות קלט חדשים בהגדרות: `stg-pension-fund-name`, `stg-savings-fund-name`
- מחוברים ל-`loadSettings()`, `saveSettings()`, `applyUserNames()`
- תוויות גרף הסימולטור ומיני-הגרף מבט-על עודכנו לשימוש בגלובלים
- כפתורי "עם/ללא" בכותרת עודכנו עם span IDs: `hdr-savings-name`, `hdr-savings-name-pension`

גרסה: `v158.0` → `v160.0`.

## שינויים אחרונים (16/04/2026 — v158.0)

### v158.0 – Events Persistence, Dynamic Labels & כספי Aggregation Fix

**`app.js` — שמירת ארועי סימולטור ב-localStorage:**
- נוספה פונקציה `_simSaveUserEvents()` שמסנכרנת את `SIM_USER_EVENTS` (ללא permanent) ל-localStorage תחת המפתח `sim_user_events`.
- נוספה פונקציה `_simRestoreUserEvents()` שטוענת את הארועים חזרה למערך בעת `simInit()`.
- קריאות שמירה: `simSaveEvent()` (הוסף/עדכן), `simDeleteEditedEvent()`, `simRemoveUserEvent()`.
- מחיקה: `simClearAllUserEvents()` מוחק גם מ-localStorage (`removeItem`).

**`app.js` — תוויות גרף דינמיות:**
- `simRenderChart()` — מצב "רועי": `'הפניקס+מבטחים'` → `SIM_USER1_NAME + ' - פנסיה'`; `'הראל'` → `SIM_USER1_NAME + ' - חיסכון'`.
- `simRenderChart()` — מצב "combined": עדכון זהה עבור `(רועי)`.
- `ovRenderSimMini()` — עדכון זהה.

**`app.js` — תיקון אגרגציית "כספי":**
- שונה: `cashFunds = ['מיטבשקלית','מיטבדשטרייד']` ← שגוי
- תוקן ל: `cashFunds = ['מזומןשקלי','מזומןדולרי','מיטבשקלית']` ← תואם בדיוק לפריטי הרשימה
- סיבה: `מיטבדשטרייד` שייך ל-cat:meitav ולא נכלל ברשימת "כספי"; `מזומן שקלי` לא היה מוגדר כ-cashFund ולכן נפל לגנל (כללי) — הפרש של ~91.

גרסה: `v157.0` → `v158.0`.

## שינויים אחרונים (16/04/2026 — v157.0)

### v157.0 – CF Sandbox Annual Sync & X-Axis Cleanup

**`app.js` — סנכרון סיכום שנתי עם ארועי סימולטור:**
- `cfRenderSummary()`: לאחר חישוב `cfGetDisplayMonths()`, מוסיף ארועי `CF_SANDBOX_EVENTS` לסיכום השנתי (הכנסות/הוצאות) לפי שנת `displayYear`. ה-YTD נשאר ללא שינוי.
- `cfSandboxAdd()`, `cfSandboxRemove()`, `cfSandboxReset()`: כל אחת קוראת ל-`cfRenderSummary()` לאחר `cfRenderChart()` כדי לעדכן את הנתונים השנתיים מיידית.

**`app.js` — ציר X ללא "גיל":**
- `simRenderChart()` callback ציר X (מצב `both`): שונה מ-`['גיל ' + age, year]` ל-`[String(age), String(year)]`.

גרסה: `v156.0` → `v157.0`.

## שינויים אחרונים (16/04/2026 — v156.0)

### v156.0 – syncSettingsToSliders()

**`app.js` — פונקציה חדשה `syncSettingsToSliders()`:**
מסנכרנת ערכי גלובלים (`SIM_INSTRUCTOR_SAL`, `SIM_PENSION_MONTHLY`, `SIM_RATE`, `SIM_PENSION_RATE`, `SIM_INFLATION`, `SIM_RE_GROWTH_RATE`) ישירות לפקדי ה-slider + numeric input בסימולטור.
- **לא** גורמת לריבוי re-renders — מעדכנת DOM בשקט ומריצה render אחד בסוף (רק אם `simInited === true`).

**נקודות קריאה:**
1. `loadSettings()` — מיד לאחר אכלוס שדות ה-Settings; לפני `simInit` (כך שערכי ה-slider מוכנים לרינדור הראשון).
2. `saveSettings()` — מיד לאחר עדכון הגלובלים (לפני ה-localStorage ולפני feedback), כך שלחיצה על "שמור הגדרות" מסנכרנת את הסלידרים מיידית.
3. `simInit()` — בתחילת האתחול (silent mode — `simInited` מושתק זמנית כדי לא לגרום לרינדור כפול).

**מיפוי Settings → Sliders:**
| Settings ID | Global | Slider ID | Num ID |
|---|---|---|---|
| `stg-instructor-sal` | `SIM_INSTRUCTOR_SAL` | `sim-instr-slider` | `sim-instr-num` |
| `stg-pension-monthly` | `SIM_PENSION_MONTHLY` | `sim-pension-monthly-slider` | `sim-pension-monthly-num` |
| `stg-inv-rate` | `SIM_RATE` | `sim-rate-slider` | `sim-rate-num` |
| `stg-pension-rate` | `SIM_PENSION_RATE` | `pns-ret-yield-slider` | `pns-ret-yield-num` |
| `stg-inflation` | `SIM_INFLATION` | `sim-inflation-slider` | `sim-inflation-num` |
| `stg-re-growth` | `SIM_RE_GROWTH_RATE` | `sim-re-growth-slider` | `sim-re-growth-num` |

גרסה: `v155.0` → `v156.0`.

---

## שינויים אחרונים (16/04/2026 — v155.0)

### v155.0 – Remove Orange Diamond Source from Timeline

**`app.js` — `simCollectEvents`:**
- הוסר בלוק ה-NOTES לחלוטין מהפונקציה. NOTES הן רשומות היסטוריות של עסקאות השקעה (מכירה, קנייה) — לא אירועים עתידיים מתוכננים. הצגתן כ-diamonds כתומים על ציר הזמן הייתה שגויה.
- `SIM_USER_EVENTS = []` — אומת: כבר מאותחל כ-array ריקה, אין push() מוקדם בקוד.
- **לפני**: NOTES → events עם `color: '#f59e0b'` — diamonds כתומים מכל הערות האקסל.
- **אחרי**: Timeline מציג רק PENSION_EVENTS + SIM_USER_EVENTS (מאקסל / מהוספה ידנית).
- גרסה: `v154.0` → `v155.0`.

---

## שינויים אחרונים (16/04/2026 — v154.0)

### v154.0 – Ultimate Timeline Filter & Layout Spacing

**`app.js` — triple-layer render filter:**
- `simCollectEvents`: filter חוזק ל-`parseInt(ev.yr, 10) >= Math.max(2026, SIM_P1_START.y)` — hard floor ב-2026.
- `simRenderTimeline`: guard חוזק ל-`parseInt(ev.yr, 10) < _RENDER_MIN_YR` (שכבת רינדור).
- `ovRenderSimMini` timeline: guard חוזק ל-`parseInt(ev.yr, 10) < _OV_MIN_YR` (שכבת רינדור).
- `switchTab`: נוסף `tab-pension` class ל-body.

**`index.html`:**
- `pns-header-stats`: gap עודכן מ-`40px` ל-`60px`.
- כותרת `<h3>` קיבוע זכויות: `margin-bottom:15px` → `margin-bottom:5px`.
- גרסה: `v153.0` → `v154.0`.

**`style.css`:**
- `body.tab-pension .header { margin-bottom: 6px !important }` — מרווח מופחת בלשונית פנסיה.

---

## שינויים אחרונים (16/04/2026 — v153.0)

### v153.0 – Data-Level Event Filter & Final Pixel Tweaks

**`app.js` — `parseEventsTimelineSheet`:**
- נוסף guard clause ישירות לאחר validation של השנה/חודש:
  `if (parseInt(yr, 10) < new Date().getFullYear()) continue;`
- אירועי עבר לא נכנסים כלל ל-`groups` ולכן לא מגיעים ל-`SIM_USER_EVENTS` — פתרון ברמת הנתונים.

**`index.html` — לשונית פנסיה / קיבוע זכויות:**
- הוסרה כותרת "קיבוע זכויות" הפנימית מתוך `pns-slider-section`.
- נוספה `<h3>` חיצונית `text-align:right; width:100%` מעל ה-flex row של שני העמודות.
- `pns-header-stats`: gap עודכן מ-`30px` ל-`40px`.

**`style.css`:**
- `body.tab-overview .header`: עודכן ל-`margin-bottom: -5px !important` (הפחתה נוספת של 5px).
- גרסה: `v152.0` → `v153.0`.

---

## שינויים אחרונים (16/04/2026 — v152.0)

### v152.0 – Aggressive UI Polish & Timeline Filter Fix

**`style.css`:**
- `body.tab-overview .header`: `margin-bottom: 0px !important; padding-bottom: 0px !important` — אפס מרווח במבט על.
- `body.tab-simulator .header`: `margin-bottom: 8px !important` — מרווח מופחת בסימולטור.

**`app.js`:**
- `switchTab`: נוסף `tab-simulator` class ל-body בנוסף ל-`tab-overview`.
- `simRenderTimeline`: נוסף hard filter `if (ev.yr < _currentYear) return;` ישירות בלולאת הרינדור של diamonds.
- `ovRenderSimMini` (overview timeline): נוסף `if (ev.yr < _curYr) return;` — גם ציר ה-Overview לא מציג אירועי עבר.

**`index.html` — לשונית פנסיה:**
- הוסרה כותרת "⚙️ קיבוע זכויות" החיצונית (wrapper עם `pns-section-title` + info icon).
- הוסר כל בלוק "ציר זמן וצמיחה" ("בבנייה") — `<!-- 8. TIMELINE / GROWTH AREA -->`.
- `pns-header-stats`: נוסף `gap:30px` להרחבת רווח בין ה-KPIs.
- גרסה: `v151.0` → `v152.0`.

---

## שינויים אחרונים (16/04/2026 — v151.0)

### v151.0 – UI Polish & Filter Past Events

**`style.css`:**
- הוסף override: `body.tab-overview .header { margin-bottom: 8px; padding-bottom: 10px; }` — מצמצם רווח בין header ל-timeline במבט על.

**`app.js`:**
- `switchTab`: הוסף `document.body.classList.toggle('tab-overview')` — מוסיף/מסיר class על body לפי לשונית פעילה.
- `simCollectEvents`: filter שנוי — `filterYr = Math.max(_simStart, new Date().getFullYear())` — אירועים מהעבר (2024, 2025) לא מוצגים בציר הזמן.
- `setChatMode`: guard על `mode-portfolio` / `mode-explore` (אלמנטים הוסרו מה-chat header).

**`index.html`:**
- כותרת הגדרות: שונתה מ"הגדרות סימולטור" ל"הגדרות"; הפסקה ההסברתית הוסרה.
- תזרים שוטף: "פירוט תנועות" → "פירוט תנועות חודשי".
- Chat header: הוסרו כפתורי "תיק" ו"חקור" — נשארה רק כותרת + כפתור ✕.
- גרסה: `v150.0` → `v151.0`.

---

## שינויים אחרונים (15/04/2026 — v150.0)

### v150.0 – Unify Settings Tab to Dark Theme

**`style.css` — שינויי CSS בלבד:**
- `#tab-settings`: רקע `#0f172a` (כהה מלא לכל האזור)
- `.settings-section`: `background: #1e293b`, border עם שקיפות
- `.settings-section-title`: uppercase + צבע `rgba(255,255,255,0.4)` — זהה ל-modal
- `.settings-label`: `rgba(255,255,255,0.55)` — זהה ל-`.modal-label`
- `.settings-input`: `background: rgba(255,255,255,0.08); color: #fff` — זהה ל-`.modal-input`
- `.settings-hint`, `.settings-unit`: טקסט לבן שקוף
- `.settings-footer` border: `rgba(255,255,255,0.08)`
- `.settings-save-note`: ירוק `#4ade80` (כמו modal)
- `.settings-title`, `.settings-subtitle`: לבן/מעומעם לבן

**תוצאה**: לשונית ה-Settings נראית עקבית עם modal ה-Simulator — רקע `#1e293b`, טקסט לבן, inputs כהים.

**עדכון גרסה**: `v149.0` → `v150.0`.

---

## שינויים אחרונים (16/04/2026 — v149.0)

### v149.0 – Clean Tooltip Amount Format

**4 מקומות תוקנו ב-`app.js`:**
- `' (' + amtStr + ')'` → `': ' + amtStr` בכל ה-tooltip callbacks ובdiamond tooltips.
- **לפני**: `◆ סך אירועי פרישה (1.1M)` | **אחרי**: `◆ סך אירועי פרישה: 1.1M`

**עדכון גרסה**: `v148.0` → `v149.0`.

---

## שינויים אחרונים (16/04/2026 — v148.0)

## שינויים אחרונים (16/04/2026 — v148.0)

### v148.0 – Remove "+" from Tooltip Amounts

**4 מקומות תוקנו ב-`app.js`:**
- Simulator timeline diamond tooltip (`simRenderTimeline`)
- Simulator chart footer callback
- Overview chart footer callback (`ovRenderSimMini`)
- Overview timeline diamond tooltip (`ovRenderSimMini`)

**הלוגיקה**: `(ev.amount >= 0 ? '+' : '-')` → `(ev.amount < 0 ? '-' : '')` — סימן מינוס נשמר להוצאות, `+` הוסר מהכנסות.

**עדכון גרסה**
- `index.html`: `v147.0` → `v148.0`.

---

## שינויים אחרונים (16/04/2026 — v147.0)

## שינויים אחרונים (16/04/2026 — v147.0)

### v147.0 – Generic Event Group Title

**שינוי כותרת קבוצת אירועים (`app.js` — upload handler)**
- לפני: `label: grp.cat + ' ' + month + ' ' + year` — הציג את שם הפריט הראשון מעמודה A (למשל "פדיון ימי חופשה אוק׳ 2029").
- אחרי: `label: 'סך אירועי פרישה - ' + month + ' ' + year` — כותרת גנרית וברורה.
- תוצאה: ה-Overview מציג "סך אירועי פרישה - אוק׳ 2029 (1.1M+)"; הסימולטור מציג את הכותרת + הפירוט המלא בbreakdown.

**עדכון גרסה**
- `index.html`: `v146.0` → `v147.0`.

---

## שינויים אחרונים (15/04/2026 — v146.0)

## שינויים אחרונים (15/04/2026 — v146.0)

### v146.0 – Header Single-Line, Overview Smear Fix & Timeline Summary

**כותרת סימולטור — שורה אחת (`index.html`)**
- אוחדו `#sim-header-stats` ו-`.sim-header-controls` בחזרה ל-wrapper אחד `.sim-header`.
- `.sim-header` עם `flex:1 1 auto; flex-wrap:nowrap` — מתמלא לצד `#hdr-title-group` בשורה אחת.
- `flex-shrink:0` על controls, `flex-shrink:1; min-width:0` על KPIs — מגנים מחלוקות.

**תיקון smearing ב-Overview (`app.js` — `ovRenderSimMini` footer)**
- `parseInt("2029-10")` = 2029 → כל החודשים ב-2029 קיבלו אירוע בטעות.
- תוקן ל-YYYY-MM string match בדיוק כמו ב-Simulator.

**Tooltip ציר זמן ב-Overview (`app.js` — `ovRenderSimMini` timeline)**
- אירועי Excel קבועים מציגים כעת "סך אירועי פרישה: 617k" במקום שם הפריט הראשון.

**עדכון גרסה**
- `index.html`: `v145.0` → `v146.0`.

---

## שינויים אחרונים (15/04/2026 — v145.0)

## שינויים אחרונים (15/04/2026 — v145.0)

### v145.0 – KPI Top Row, Controls Bar & Diamond Color

**מבנה כותרת סימולטור מחדש (`index.html`)**
- `#sim-header-stats` הוצא מ-`.sim-header` wrapper והפך לילד ישיר של `.header` — כעת יושב באותה שורת flex כמו הכותרת.
- `.sim-header-controls` עם `flex-basis:100%` → נדחס לשורה שנייה נקייה מתחת ל-Title+KPIs.
- `.sim-header` wrapper נמחק לגמרי — שני אלמנטים פשוטים, ללא מבנה מקונן.
- שני האלמנטים שומרים `class="sim-only-btn"` — switchTab מציג/מסתיר אוטומטית.

**תיקון צבע דיאמונד (`app.js`)**
- `simCollectEvents`: תנאי `ev.permanent` הועבר לפני `ev.type === 'expense'` — לא עוד עקיפה בגלל סדר `if/else if`.
- `simRenderTimeline`: override ישיר `ev.permanent ? '#1b5e20' : (ev.color || '#6366f1')` — ירוק כהה לכל אירועי האקסל הקבועים, ללא תלות בנתיב simCollectEvents.

**עדכון גרסה**
- `index.html`: `v144.0` → `v145.0`.

---

## שינויים אחרונים (15/04/2026 — v144.0)

## שינויים אחרונים (15/04/2026 — v144.0)

### v144.0 – Simulator Header Rescue, Duplicate Purge & Tooltip Fix

**תיקון כותרת הסימולטור (`index.html`)**
- `html[dir=rtl]` → ילד ראשון בDOM מופיע ימינה, ילד שני שמאלה.
- סדר DOM תוקן: `#sim-header-stats` (KPIs) ראשון → מופיע ימינה; כפתורים שניים → מופיעים שמאלה.
- שוחזרה `class="header-stats"` ל-`#sim-header-stats` — גופני KPI חוזרים לגודל הנכון.
- `direction:ltr` על wrapper הכפתורים — כפתורים זורמים שמאל-לימין בתוך בלוק ה-RTL.

**מחיקת פרסינג כפול (`app.js` — upload handler)**
- הוסרו `detectRetirementSheet`/`parseRetirementSheet` מה-upload handler לחלוטין.
- הסיבה: שני הפרסרים זיהו את אותו גיליון "ציר אירועים" (שמכיל קטגוריה "סכומי פרישה" בעמודה D), יצרו ערכים כפולים ב-SIM_USER_EVENTS → מדרגה (staircase) בגרף.
- פרסינג אירועים כעת רק דרך `parseEventsTimelineSheet` (עמודה A).

**תיקון tooltip smearing (`app.js` — footer callback)**
- הוחלפה בדיקת `ev.yr + moHovered` הישנה בהשוואת מחרוזת `YYYY-MM` מדויקת.
- `_hoveredLabel !== _eventDateIndex` → אירוע מוצג אך ורק בחודשו המדויק, ללא smearing.

**עדכון גרסה**
- `index.html`: `v143.0` → `v144.0`.

---

## שינויים אחרונים (15/04/2026 — v143.0)

### v143.0 – Hard Rewrite: Event Tooltips, Simulator Header & CSS Fix

**כתיבת מחדש מלאה של `parseEventsTimelineSheet` (`app.js`)**
- שינוי `sheet_to_json` ל-`raw: false, dateNF: 'dd/mm/yyyy'` — תאריכים מתקבלים כמחרוזת DD/MM/YYYY.
- פרסינג תאריך ע"י `split('/')` בלבד: `"01/10/2029" → 2029-10` — אין UTC-shift, אין Date object.
- תווית (`label`) נלקחת אך ורק מעמודה A (`סוג האירוע`) — עמודה D (`קטגוריה`) לא בשימוש.
- גיבוץ לפי `YYYY-MM` בלבד — ערך אחד לחודש, ללא כפילויות/מדרגות.

**כתיבת מחדש מלאה של כותרת הסימולטור (`index.html`)**
- נמחק `#sim-hdr-controls` הישן לחלוטין.
- נמחק `#sim-header-stats` הישן מיקומו המקורי.
- נוצר `<div class="sim-header sim-only-btn">` עם שני צדדים: `sim-header-left` (כפתורים) + `sim-header-right` (KPIs).
- `#chat-btn`, `#settings-btn` כ-`<button>` מובחנים; `view-toggles` ו-`age-input` ב-divים נפרדים.
- כל הרכיבים בשורה אופקית אחת ע"י `flex-direction:row; gap:15px` ב-inline style.

**תיקון CSS (`style.css`)**
- נוסף `input[type="date"] { color: #111827 !important; }` — תאריכי לידה קריאים ברקע בהיר.

**עדכון גרסה**
- `index.html`: `v142.0` → `v143.0`.

---

## שינויים אחרונים (15/04/2026 — v142.0)

### v142.0 – Event Parsing Purge, Exact Chart Alignment & Header Rewrite

**תיקון פרסינג "ציר אירועים" (`app.js` — `parseEventsTimelineSheet`)**
- תיקון תאריך UTC: הוספת 12 שעות לפני `getUTCMonth()` — בדיוק כמו `parseMonthHeader` v20.1. "01/10/2029" כעת → אוקטובר 2029 נכון (ולא ספטמבר בטעות).
- מפתח גיבוץ שונה מ-`yr-mo|cat` ל-`yr-mo` בלבד — מונע קבוצות כפולות לאותו חודש.
- כל שורות לאותו חודש נאגרות בfbreakdown אחד; `label` של כל פריט = עמודה A ("סוג האירוע") בלבד.

**כתיבה מחדש של כותרת הסימולטור (`index.html`, `style.css`)**
- הכפתורים הוצאו מתוך `#hdr-title-group` לחלוטין.
- נוצר `#sim-hdr-controls` כ-div נפרד, ישיר של `.header`, עם `class="sim-only-btn"` — נשלט ע"י `switchTab` כרגיל.
- עיצוב CSS נקי: `display:flex; flex-direction:row; flex-wrap:nowrap; align-items:center; gap:12px` — שורה אופקית אחת ללא חפיפה.
- `#hdr-title-group` הורזק לכותרת בלבד (h1 + p).

**יישור דיאמונד מדויק (`app.js` — `simRenderTimeline`)**
- `yrToLeftPx` קורא עכשיו `simChartObj.getDatasetMeta(0).data[idx].x` — ה-pixel המדויק שצייר Chart.js.
- חיפוש מהסוף (last-occurrence) ל-YYYY-MM — מביא את ה-post-event snapshot לחודשי-קפיצה.
- Fallback ל-interpolation ליניארית אם המטאדטה לא זמינה.

**עדכון גרסה**
- `index.html`: `v141.0` → `v142.0`.

---

## שינויים אחרונים (15/04/2026 — v141.0)

### v141.0 – Parse Regression Fix, Tooltip Precision & Timeline Alignment

**תיקון רגרסיה קריטי — פרסינג פנסיה (`app.js` — upload handler)**
- הוסר `return;` מבלוק הפרישה ("סכומי פרישה") — קוד ממשיך לבדוק גם גיליון פנסיה באותו קובץ.
- כעת גם `parseEventsTimelineSheet` וגם `pensionParseWorkbook` רצים בעת העלאת קובץ המכיל שני סוגי גיליונות.
- טאב "פנסיה וביטוחים" מתמלא מחדש כנדרש.

**Tooltip מדויק בגרף Chart.js (`app.js` — tooltip footer)**
- פרסינג לייבל `YYYY-MM` גם לחילוץ **החודש** (לא רק השנה).
- פילטר קפדני: `ev.yr === yr && ev.mo === moHovered` — אירוע מוצג **רק בחודשו המדויק**, ללא smearing לאורך כל השנה.
- הוסף `events_timeline` לתנאי breakdown בגרף — breakddown מ-Excel מוצג גם לאירועי "ציר אירועים" (לא רק "סכומי פרישה").

**יישור דיאמונדים לגרף (`app.js` — `simRenderTimeline`)**
- `yrToLeftPx` משתמש ב-`chart.scales.x.getPixelForValue(YYYY-MM)` לפיקסל מדויק.
- `yrToLeft` קוראת ל-`yrToLeftPx` — שיטה אחידה לכל מיקומי הדיאמונד.
- Fallback ל-linear interpolation כשה-scale אינו זמין.

**עדכון גרסה**
- `index.html`: `v140.0` → `v141.0`.

---

## שינויים אחרונים (15/04/2026 — v140.0)

### v140.0 – Timeline Polish & Header Flexbox Rescue

**צבעי ציר זמן (`app.js` — `simCollectEvents`)**
- `retirement` (permanent Excel income) → `#1b5e20` ירוק כהה.
- `events_timeline` (permanent Excel expense) → `#881111` בורדו.
- לוגיקת בחירת צבע: `ev.permanent && ev.src === ...` — מדויק ולא פוגע באירועים ידניים.

**Tooltip Breakdown (`app.js` — `simRenderTimeline`)**
- הוסרה הגבלה ל-`retirement` בלבד — עכשיו גם `events_timeline` מציגים breakdown.
- ה-`label` של כל item = עמודה A ("סוג האירוע") → טולטיפ מראה "פדיון ימי חופשה: 617k" ולא "פרישה: 617k".

**Legend (`index.html`)**
- נוספו שני פריטים לאגדת ציר הזמן: "הכנסה קבועה (אקסל)" (#1b5e20) + "הוצאה קבועה (אקסל)" (#881111).

**Header Flexbox Rescue (`index.html`, `style.css`)**
- כל כפתורי הסימולטור (💬, ⚙️, תצוגה, הראל, גיל יעד) עטופים ב-`<div class="sim-only-btn sim-controls-left">`.
- `.sim-controls-left` ב-CSS: `flex-direction:row !important; align-items:center; gap:12px; flex-wrap:nowrap`.
- `switchTab()` מנהל show/hide של ה-wrapper בלבד דרך `.sim-only-btn` — ילדים פנימיים אינם בעלי הClass.
- כל הכפתורים בשורה אופקית אחת, לא מסתדרים אנכית.

**עדכון גרסה**
- `index.html`: `v139.0` → `v140.0`.

---

## שינויים אחרונים (15/04/2026 — v139.0)

### v139.0 – Bulletproof Sheet Matching & RTL UI Layout Fix

**זיהוי גיליון עמיד (`app.js` — `parseEventsTimelineSheet`)**
- הוחלפה השוואת `===` ב-`indexOf()` אחרי `trim().normalize('NFC')` — עמיד לרווחים מסתתרים ב-Excel.
- נוסף `console.log('Available sheets in uploaded file:', wb.SheetNames)` בתחילת הפונקציה לדיבוג.
- שיפור הודעת השגיאה: מציגה את רשימת הגיליונות כשלא נמצא גיליון "ציר אירועים".

**תיקון UI-RTL כירורגי (`index.html`)**
- כל כפתורי הסימולטור (💬, ⚙️, תצוגה, הראל, גיל יעד) הועברו לתוך `#hdr-title-group`.
- הקונטיינר `direction:rtl` — סדר DOM: Title → גיל יעד → הראל → תצוגה → ⚙️ → 💬.
- סדר ויזואלי על המסך (שמאל לימין): 💬 → ⚙️ → תצוגה → הראל → גיל יעד → Title.
- KPI numbers (`#sim-header-stats`) נשארים בצד ימין של המסך — לא שונו.
- `switchTab()` ממשיך לשלוט ב-show/hide כרגיל דרך class `.sim-only-btn`.

**עדכון גרסה**
- `index.html`: `v138.0` → `v139.0`.

---

## שינויים אחרונים (15/04/2026 — v138.0)

### v138.0 – Dedicated Events Sheet Parsing & Surgical UI Fix

**פרסינג גיליון "ציר אירועים" (`app.js` — `parseEventsTimelineSheet`)**
- פונקציה חדשה `parseEventsTimelineSheet(wb)` — מחפשת גיליון בשם בדיוק "ציר אירועים" (normalize NFC).
- עמודות: A=סוג האירוע, B=תאריך יעד צפוי, C=סכום משוער, D=קטגוריה.
- **פילטר קריטי:** שורות שבעמודה A יש "סך הכל" מדולגות — לא מוחל על גיליונות אחרים.
- קיבוץ לפי YYYY-MM + קטגוריה → push ל-SIM_USER_EVENTS עם `src:'events_timeline'`.
- נקרא ראשון ב-upload handler, לפני גיליון "סכומי פרישה", **ללא return** — ממשיך לזהות גיליונות אחרים באותו קובץ.
- אירועים מופיעים בצבע כתום `#fb923c` בציר הזמן.
- קריאה ל-`simRenderTimeline` ו-`simRenderChart(simRunEngine())` אחרי הדחיפה.

**UI Fix כירורגי — כפתור הגדרות (`index.html`)**
- Chat 💬 ו-⚙️ הועברו **לפני** View Toggles בסדר DOM.
- סדר ויזואלי משמאל לימין: 💬 Chat → ⚙️ Settings → View Toggles (תצוגה / הראל / גיל יעד).
- אין שינוי CSS — שינוי DOM בלבד.

**עדכון גרסה**
- `index.html`: `v137.0` → `v138.0`.

---

## שינויים אחרונים (15/04/2026 — v137.0)

### v137.0 – Debug Excel Parsing, Settings Icon Polish, Default Zoom

**Debug מלא — Pipeline פרסינג Excel (`app.js` — `detectRetirementSheet`, `parseRetirementSheet`)**
- `detectRetirementSheet`: console.log לכל גיליון שנסרק + מתי נמצאה עמודת "קטגוריה" + מתי נמצא "סכומי פרישה". normalize('NFC') למחרוזות עברית. סריקה עד 25 שורות (היה 10).
- `parseRetirementSheet`: console.log ל-header row, כל עמודה שזוהתה, כל קבוצה שנוצרה, וסיכום. normalize('NFC') גם לשדה הקטגוריה. תמיכה בפורמט תאריך YYYY-MM (נוסף). 25 שורות לסריקת header.
- אחרי הדחיפה ל-SIM_USER_EVENTS: `console.log('[v137] Parsed Excel Events:', ...)` — **חובה** לפי הדרישה.

**כפתור הגדרות — Polish סופי (`index.html`)**
- הוסרה המילה "הגדרות" — נותרה רק האייקון ⚙️.
- הוחלפה הסדר: כפתור הצ'אט עכשיו ראשון (שמאל), ואחריו ⚙️.
- עיצוב תואם בדיוק לכפתור ⚙️ בלשונית "מבט על": `background:rgba(255,255,255,0.15)`, `border:rgba(255,255,255,0.4)`, `padding:7px 13px`, `font-size:14px`.

**ברירת מחדל תצוגת סימולטור (`index.html`, `app.js`)**
- נוסף `var SIM_DEFAULT_ZOOM = 'full'` כמשתנה גלובלי.
- מודאל ההגדרות — סקציה חדשה "תצוגת סימולטור ברירת מחדל" עם dropdown `#setting-default-view`: "הכל" / "פרישה" / "טווח".
- `openSettingsModal`: ממלא את ה-dropdown מהמשתנה הגלובלי.
- `saveModalSettings`: קורא את הבחירה, מעדכן `SIM_DEFAULT_ZOOM`, שומר ב-localStorage (מפתח `defaultZoom`).
- `loadSettings`: טוען את `SIM_DEFAULT_ZOOM` מה-localStorage בסטארט.
- `simInit`: מגדיר `SIM_ZOOM = SIM_DEFAULT_ZOOM` לפני הרנדור הראשון → כפתורי הזום מתעדכנים בהתאם.

**עדכון גרסה**
- `index.html`: `v136.0` → `v137.0`.

---



## שינויים אחרונים (15/04/2026 — v136.0)

### v136.0 – Dynamic Y-Axis, Timeline Events Rendering, & UI Alignment

**Y-axis דינמי ב-Mini Simulator (`app.js` — `ovRenderSimMini`)**
- הוסר מגבלת max קשיחה מציר ה-Y של מיני-הגרף בלשונית "מבט על".
- נוסף `suggestedMax` חכם: 20% headroom מעל ערך השיא של `hrlTop`, מעוגל לקרוב של 5,000K (= 5M ₪).
- Chart.js ימשיך לגדול מעבר ל-suggestedMax אם הנתונים יעברו אותו — אין cap קשיח.

**Breakdown Tooltips לאירועי Excel בציר הזמן (`app.js` — `simRenderTimeline`, `ovRenderSimMini`)**
- הטולטיפ של אירועי `src:'retirement'` בציר הזמן הראשי כעת מציג כל פריט מה-breakdown: `· תיאור: XXk`.
- אותו תיקון הוחל גם על הטולטיפ במיני-טיימליין של לשונית "מבט על".
- הדיאמנדים עצמם כבר צוירו נכון (דרך `simCollectEvents` → `SIM_USER_EVENTS`) — התיקון הוא בתוכן הטולטיפ.

**Settings Icon — הועבר לשמאל (`index.html`, `app.js`)**
- הכפתור `#sim-settings-hdr-btn` הוסר מ-`#sim-header-stats` (אזור ה-KPIs הימני).
- נוסף לשורת הכפתורים השמאלית עם `class="sim-only-btn"` — לפני כפתור הצ'אט.
- עיצוב תואם בדיוק לכפתורי שליטה אחרים: `height:34px`, `border-radius:8px`, `background:rgba(255,255,255,0.08)`.
- הנראות מנוהלת אוטומטית על ידי `switchTab()` (כמו שאר `.sim-only-btn`) — אין צורך בשליטה נפרדת.

**עדכון גרסה**
- `index.html`: `v135.0` → `v136.0`.

---



## שינויים אחרונים (15/04/2026 — v135.0)

### v135.0 – Hard Fix: Events, Timeline, Settings Icon

**Double-Point Trick — עדכון ל-{x,y} format (`app.js` — `simRenderChart`, `ovRenderSimMini`)**
- המרת כל מערכי הנתונים מ-`[number, ...]` לפורמט `[{x:"YYYY-MM", y:number}, ...]`.
- Chart.js עם {x,y} ו-categorical scale ממפה שני data points עם אותו x-string לאותו x-pixel → קפיצה אנכית 90° אמיתית באירוע, ולא אלכסון תלול.
- הוסר `data.labels` ממבנה הגרף (רק `datasets`); החישובים המצטברים (stacking) עדיין עובדים על מערכי המספרים הגולמיים.
- `onHover` עודכן לחלץ `topPt.y` מ-{x,y} object.
- `autoSkip: false` + `return null` בתוך callback → מחביא ציוני ציר שאינם ינואר לחלוטין.

**`simBgPlugin` — עדכון לפורמט החדש (`app.js`)**
- כאשר `data.labels` ריק, labels נגזרות מ-`datasets[0].data[].x`.
- `getPixelForValue` מקבל עכשיו מחרוזת label (לא אינדקס מספרי) → מיקום גבולות הפאזה מדויק.

**Timeline — אירועי Excel מופיעים (`app.js` — `simCollectEvents`)**
- `src` ו-`breakdown` של SIM_USER_EVENTS נשמרים (לא מוחלפים ב-`'user'`).
- אירועי `src:'retirement'` מקבלים צבע סגול `#a78bfa` כדי להתבלט בציר הזמן.
- פילטר "עתידי בלבד" עודכן ל-`SIM_P1_START.y` (במקום `new Date().getFullYear()`) לעקביות.

**Settings Icon — inline עם ה-KPIs (`index.html`, `app.js`)**
- הכפתור `#sim-settings-hdr-btn` הועבר מ-`#hdr-title-group` לסוף `#sim-header-stats`.
- כעת גלוי/מוסתר ביחד עם ה-KPIs של הסימולטור (אין צורך בשליטה נפרדת).
- הוסרה שורת השליטה הנפרדת מ-`switchTab()`.

**עדכון גרסה**
- `index.html`: `v134.0` → `v135.0`.

---



## שינויים אחרונים (15/04/2026 — v134.0)

### v134.0 – Monthly Engine Refactor + Chart Polish

**`simRunEngine` — פלט חודשי (`app.js`)**
- הוסר גייט `if (ym.m === 12 || i === totalMonths - 1)` — עכשיו כל חודש מייצר נקודת נתונים.
- תוויות מחרוזת `"YYYY-MM"` במקום `"YYYY"` — `parseInt("2029-10") === 2029` כך שכל פרסינג שנה downstream ממשיך לעבוד.
- הוסף `_push(lbl)` helper — מצלם מצב כל שכבות ל-output arrays.
- **Double-point trick**: לחודש עם אירוע (eventsByMonth / reEventsByMonth) — מוסיף שתי נקודות עם אותה תווית YYYY-MM: לפני האירוע ואחרי. Chart.js מצייר קפיצה אנכית 90° רק באותו חודש; שאר הגרף שיפועים חלקים.

**הסרת `stepped: 'before'` (`app.js`)**
- הוסר מכל 4 שכבות ב-roy view, ה-yael view, וכל 5 שכבות ב-combined view ב-`simRenderChart`.
- הוסר מ-4 שכבות ב-`ovRenderSimMini`.

**`simBgPlugin` — עדכון חיפוש גבולות פאזה (`app.js`)**
- `labels.indexOf(p2Str)` הוחלף בלולאה שמחפשת `parseInt(label) === SIM_P2_START.y` (כי תויות "YYYY-MM" לא תואמות exact match של "YYYY").

**X-axis ticks — עדכון callback (`app.js`)**
- `simRenderChart`: מציג תווית רק לחודש ינואר (month=1), מחלץ שנה/גיל לפי mode.
- `ovRenderSimMini`: אותה לוגיקה — רק ינואר מקבל תווית, תוצג כמספר שנה.

**`ovSetPnsHarel` — עדכון CSS כפתורים מיידי (`app.js`)**
- עדכון background/color של `ov-harel-btn-minus` ו-`ov-harel-btn-plus` מתבצע מיד בתחילת הפונקציה — לפני קריאת `ovRenderPensionCards()` שעלולה לחזור מוקדם אם אין נתונים.

**`sim-settings-hdr-btn` — תיקון flex (`index.html`)**
- `align-items:center` → `align-self:center` — כפתור ⚙️ מיושר אנכית כ-flex item (לא כ-container).

**עדכון גרסה**
- `index.html`: `v133.0` → `v134.0`.

---



## שינויים אחרונים (15/04/2026 — v133.0)

### v133.0 – Dynamic "סכומי פרישה" + Simulator Settings Icon

**פרסינג דינמי "סכומי פרישה" (`app.js`)**
- `detectRetirementSheet(wb)`: סורק כל גיליון, מחפש עמודת "קטגוריה" ולפחות שורה אחת עם "סכומי פרישה".
- `parseRetirementSheet(wb, sheetName)`: קורא עמודות תאריך/תיאור/קטגוריה/סכום; מסנן שורות קטגוריה "סכומי פרישה"; מקבץ לפי חודש-שנה; מחזיר מערך קבוצות עם `{ yr, mo, total, items[] }`.
- `smartUploadRouter`: בדיקה ראשונה לפני פנסיה ותזרים — אם מזוהה, מוחק אירועי פרישה ישנים, יוצר permanent events ב-`SIM_USER_EVENTS` (NIS ÷ 1000 → K), מפעיל רנדור סימולטור.

**tooltip breakdowns (`app.js` — `simRenderChart`)**
- footer callback: לאירועים עם `src: 'retirement'` ו-`breakdown[]` — מוסיף שורות `· תיאור: XXk` מתחת לסה״כ הקבוצה.

**אייקון הגדרות סימולטור (`index.html`, `app.js`)**
- הוסר כפתור ⚙️ מ-`sim-only-btn` בשורת הכפתורים השמאלית.
- נוסף `id="sim-settings-hdr-btn"` כצאצא של `#hdr-title-group` — מוצמד לשמאל הכותרת "סימולטור פיננסי" בתוך אותה קבוצת flex.
- `switchTab()`: מציג `sim-settings-hdr-btn` רק כשהטאב הפעיל הוא Simulator.

**עדכון גרסה**
- `index.html`: `v132.0` → `v133.0`.

---

## שינויים אחרונים (15/04/2026 — v132.0)

### v132.0 – UI Polish v2: Exact Alignment

**כפתורי הראל — כרטיס פנסיה וביטוחים (`index.html`, `app.js`)**
- הכפתורים "הראל -" / "הראל +" הועברו לכותרת הכרטיס (`.ov-card-header`) בדיוק כמו "חודשי / YTD" בכרטיס התזרים: `border-radius:20px`, `#1e3a8a` active, `transparent` inactive.
- הוסרו מהתא "קצבה נטו" בגוף הכרטיס — הכרטיס מציג עכשיו תוית פשוטה.
- `ovRenderPensionCards()` מעדכן סגנון כפתורים לפי DOM ID.

**אייקון הגדרות — בחזרה לאזור הכפתורים (`index.html`)**
- `hdr-settings-btn` הוסר מ-`.header-title`.
- ⚙️ הוחזר לאזור הכפתורים: `ov-only-btn` + `sim-only-btn` נפרדים, מיושרים עם שאר כפתורי הפעולה.

**Date Inputs Contrast (`style.css`)**
- נוסף `-webkit-text-fill-color: white !important` לכל `input[type="date"]` במודאל ובהגדרות — מבטיח טקסט לבן בכל הדפדפנים.

**עדכון גרסה**
- `index.html`: `v131.0` → `v132.0`.

---

## שינויים אחרונים (15/04/2026 — v131.0)

### v131.0 – UI Polish: Empty States, Harel Toggle, Settings Icon

**Empty State — הון חזוי לגיל 67 (`app.js`)**
- `ovRenderKPIs()`: המצב הריק שהציג "ממתין..." עודכן לקו "—" (צהוב #fbbf24), עקבי עם כל שאר ה-KPIs בכותרת.

**כפתורי הראל — שני כפתורים נפרדים (`app.js`)**
- `ovRenderPensionCards()`: הכפתור הבודד "– הראל" / "+ הראל" הוחלף בשני כפתורים נפרדים: "הראל -" ו-"הראל +".
- עיצוב תואם לכפתורי "חודשי / YTD": הפעיל — כחול מלא (#1e3a8a) + טקסט לבן; הלא-פעיל — שקוף + טקסט אפור.
- "הראל -" הוא ברירת המחדל הפעילה (תואם `ovPnsShowHarel = false`).
- נוספה `ovSetPnsHarel(val)` — setter; `ovTogglePnsHarel()` מעדכן ממנה.

**אייקון הגדרות — יישור אחיד לצד הכותרת (`index.html`, `app.js`)**
- הוסר כפתור ⚙️ נפרד מאזור ה-`ov-only-btn` ומאזור ה-`sim-only-btn`.
- נוסף כפתור אחד `id="hdr-settings-btn"` בתוך `.header-title` (לצד טקסט הכותרת).
- `switchTab()`: מציג את `hdr-settings-btn` רק כשהטאב הפעיל הוא Overview או Simulator.

**עדכון גרסה**
- `index.html`: `v130.0` → `v131.0` (comment, h1 span).

---

## שינויים אחרונים (14/04/2026 — v108.0)

### v108.0 – Settings Tab: Logic & Persistence

**`loadSettings()` (`app.js`)**
- קורא מ-`localStorage` (מפתח `fd_settings_v1`), מעדכן גלובלים: `SIM_RETIREMENT_AGE_ROY/YAEL`, `SIM_RATE`, `SIM_PENSION_RATE`, `SIM_INFLATION`, `SIM_RE_GROWTH_RATE`, `SIM_PENSION_MONTHLY`, `SIM_INSTRUCTOR_SAL`.
- מחשב מחדש `SIM_P2_START.y` ו-`SIM_P3_START.y` מגיל הפרישה.
- מאכלס את שדות ה-input ב-`#tab-settings`.
- נקרא ב-`DOMContentLoaded` לפני כל render.

**`saveSettings()` (`app.js`)**
- קורא ערכים מ-8 שדות ה-input בטאב ההגדרות.
- מעדכן גלובלים ושומר ב-`localStorage`.
- מציג הודעת הצלחה על הכפתור למשך 2.5 שניות.
- מפעיל מחדש: `simRenderChart(simRunEngine())`, `ovRenderSimMini()`, `ovRenderPensionCards()`, `ovRenderKPIs()`.

**כפתור "שמור הגדרות" (`index.html`)**
- הוסר `disabled` ו-`title`; נוסף `onclick="saveSettings()"`.
- ה-`settings-save-note` מתמלא דינמית ע"י הפונקציה.

**עדכון גרסה**
- `index.html`: `v107.0` → `v108.0` (comment, h1 span, כל ה-comments).

---

## שינויים אחרונים (14/04/2026 — v107.0)

### v107.0 – Step Charts + Settings Tab Skeleton

**Step Charts בסימולטור (`app.js`)**
- כל 10 ה-datasets בפונקציות `simRenderChart` (שלושת תצוגות: רועי, יעל, משולב) ו-`ovRenderSimMini` עודכנו: `tension: 0` + `stepped: 'after'`.
- הגיון: אירועים שנתיים (משיכות, הפקדות) מיוצגים נכון כמדרגות, לא כקווים אלכסוניים.

**טאב הגדרות — שלד UI בלבד (`index.html` + `app.js` + `style.css`)**
- `index.html`: נוסף כפתור `⚙ הגדרות` בסרגל הניווט.
- `index.html`: נוסף `<div id="tab-settings">` עם 3 סקציות: גיל פרישה (רועי/יעל), תשואות ואינפלציה (4 שדות), הכנסות פרישה (2 שדות). כפתור שמירה מושבת (placeholder).
- `app.js`: נוסף `'settings':'הגדרות'` ל-`TAB_NAMES`; נוסף `var isSettings = (id === 'settings')` ב-`switchTab`.
- `style.css`: נוסף עיצוב מלא לטאב ההגדרות (grid, card sections, inputs).

**עדכון גרסה**
- `index.html`: `v106.0` → `v107.0` (comment, h1 span, market comment).
- `app.js`: `v106.0` → `v107.0` (comment בתוך `switchTab`).

---

## שינויים אחרונים (14/04/2026 — v105.5)

### v105.5 – UI Regressions & Cross-Browser Fixes

**Harel Toggle Upload Bug (`app.js`)**
- `pensionRenderSnapshot()`: כפתורי הראל (עם/ללא) עכשיו מוצגים (`display:flex`) רק כשטאב פנסיה פעיל בפועל — מונע הצצת הכפתורים בכותרת גלובלית בעת העלאת קובץ מכל טאב אחר.

**CF Header — Single Row Enforced (`index.html` + `style.css`)**
- `#hdr-title-group`: שינוי מ-`flex-shrink:0` ל-`flex-shrink:1; min-width:0; overflow:hidden` — מאפשר לקבוצה להצטמצם.
- הוספת class `cf-stat-item` ל-4 הסטטיסטיקות של תזרים עם `padding:0 14px; flex-shrink:1; min-width:0`.
- CSS: `white-space:nowrap` על `.header-stats`, `.stat-label`, `.stat-value`, `.stat-change`.
- שינוי "רווח או הפסד" ל-"רווח/הפסד" (חוסך מקום).

**Market Tab Title Alignment (`app.js` + `index.html`)**
- `switchTab()`: הוסרה ההסתרה של `hdr-title-group` בטאב שוק — הכותרת "ניתוח שוק ומסחר v105.0" מוצגת בצד ימין (RTL start) תמיד.
- הוסרה הכותרת הכפולה מתוך `#mkt-search-area` — אזור החיפוש נשאר ממורכז.

**iPad/iOS Canvas Fix (`index.html` + `style.css`)**
- CSS: `.chart-container` קיבל `display:block`; הוסף `.chart-container canvas { width:100% !important; display:block; }`.
- כל ה-wrapper divs של canvas (ov-cf, ov-inv, ov-sim, mkt-main, mkt-compare, cf-chart, pns-timeline, cm-chart) קיבלו `width:100%; display:block` + `canvas` עצמו קיבל `width:100% !important; display:block`.

---

## שינויים קודמים (14/04/2026 — v105.4)

### v105.4 – Header Regressions Fix

**Upload Label Reset (`app.js`)**
- בענף פנסיה ב-`smartUploadRouter`: מוסיף `ovPnsShowHarel = false` + איפוס `ov-hdr-pension-label` ל-"קצבה נטו" לפני כל רנדור מחדש — מונע שמירת מצב "(עם הראל)" מ-toggle קודם

**CF Header — `flex-direction:row` (`style.css`)**
- הוסף `flex-direction: row;` מפורש ל-`.header` — אכיפת שורה אחת גם ב-browsers שמפרשים flex שונה

**CF Stats — No-Wrap (`index.html`)**
- הוסף `flex-shrink:1; overflow:hidden; flex-wrap:nowrap;` ל-`#cf-header-stats` — מונע ירידת הסטטיסטיקות לשורה שנייה

**Market Search Centering (`index.html`)**
- הוסף `margin-right:auto; margin-left:auto;` ל-`#mkt-search-area` — ממרכז את אזור החיפוש בכותרת הגלובלית

**Toast Leak Fix (`app.js`)**
- ב-`switchTab()`: `#excel-status` מוסתר (`display:none`) כשנכנסים לטאב שוק, ומשוחזר ביציאה — מונע הצגת הודעות Upload בכותרת טאב שוק

---

## שינויים אחרונים (13/04/2026)

### v105.3 – Final Polish

**Upload Bug — Label Shifting (`app.js`)**
- הוסר עדכון ה-label (`ov-hdr-pension-label`) מתוך `ovRenderKPIs()` — הועבר אך ורק ל-`ovTogglePnsHarel()`
- מונע הזזת אלמנטים בכותרת בעת העלאת קבצים

**Pension Stat Width Fix (`index.html`)**
- הוסף `min-width:155px` לפריט סטטיסטיקה של קצבה — מונע shifting בין מצבי עם/ללא הראל

**Net Pension Math — חישוב מדויק (`app.js`)**
- גלובלים חדשים: `pnsNetMonthlyWithHarel`, `pnsNetMonthlyNoHarel`
- IIFE ב-`pensionSliderChange()` מחשב את שני הערכים בנפרד עם אותה מנוע מס — מחליף scaling פרופורציונלי לא-מדויק
- `ovRenderPensionCards()`: שימוש ישיר בגלובלים החדשים, ללא סקיילינג

**Harel Toggle — Active Color (`app.js`)**
- צבע active: `#1e2d4a` (כחול-נייבי כהה) → `#3b82f6` (כחול בהיר ברור)
- גם ה-border מתעדכן לכחול כשפעיל

**CF Header Nowrap (`index.html`)**
- הוסף `flex-wrap:nowrap` ל-`#hdr-title-group` — מכריח title + stats להישאר בשורה אחת

**Market Title Spacing (`index.html`)**
- הוסף `margin-left:30px` לספאן הכותרת "ניתוח שוק" ב-`#mkt-search-area` — רווח בין הכותרת לסרגל החיפוש

---

### v105.2 – Harel Toggle Polish + CF Header + Market Title + Sim Age Fix

**Harel Toggle (`app.js`)**
- גלובל חדש `ovPnsDisplayNet` — מתעדכן ב-`ovRenderPensionCards()` עם הערך הנוכחי (עם/ללא הראל)
- `ovTogglePnsHarel()`: מוסיף קריאה ל-`ovRenderKPIs()` לאחר הרינדור → כותרת גלובלית מסתנכרנת
- `ovRenderKPIs()`: משתמש ב-`ovPnsDisplayNet` לעדכון `#ov-hdr-pension`; label מגיב ל-`ovPnsShowHarel`
- עיצוב טוגל: inactive = לבן + border navy; active = navy + טקסט לבן

**CF Header Alignment (`style.css`)**
- `.header`: הוסף `flex-wrap: nowrap`
- `.header-stats`: `align-items: flex-start` → `align-items: center`

**Market Tab Title Restore (`index.html`)**
- הוסף חזרה ל-`#mkt-search-area`: `<span>ניתוח שוק <span>v105.0</span></span>` — כותרת + גרסה + search + chips על שורה אחת

**Simulator "גיל" View Bug (`app.js`)**
- גלובלים חדשים: `SIM_START_YEAR = 2026`, `userCurrentAge = 63`
- תיקון שורש (`simSliceResult`): age labels (< 200) מומרים לשנה לפני השוואה: `yr + SIM_BIRTH_YEAR_ROY` — מונע slice ריק
- label חישוב: `_royAge = (_yr - SIM_START_YEAR) + userCurrentAge` — קריא ועמיד

### v105.1 – Default Tab + Pension Net Fix + Mini-Sim Unblock

**Default Tab (`app.js`)**
- `DOMContentLoaded`: שינוי `switchTab('cashflow')` → `switchTab('overview')`

**Pension Card — "קצבה נטו" Fix (`app.js`)**
- שורש הבעיה: `pnsNetMonthly` נשאר 0 כשמעלים קובץ פנסיה מטאב מבט-על (טאב פנסיה לא אותחל)
- תיקון: בתוך `smartUploadRouter` — קריאה מיידית ל-`pensionSliderChange()` לאחר `PENSION_ASSETS = pnsAssets`
- טיפוגרפיה: כותרות אפורות `9px→11px`, ערכים כספיים `14px→17px`, suffix `9px→11px`, harelBtn `9px→11px`

**Mini-Simulator Unblock (`app.js`)**
- הוספת `ovRenderSimMini()` לשלוש נקודות upload:
  - לאחר pension upload
  - לאחר CF upload
  - לאחר investments upload

### v105.0 – Overview & Market Polish

**Overview — Pension Upload Sync (`app.js`)**
- תיקון: לאחר העלאת קובץ פנסיה מטאב מבט-על — מוסיף קריאה ל-`ovRenderPensionCards()` (בנוסף ל-`ovRenderKPIs()`) → כרטיס הפנסיה מתרענן ללא מעבר טאב ידני

**Overview — Cashflow "Today" Line (`app.js`)**
- צבע: `rgba(200,200,200,0.5)` → `rgba(150,150,150,0.8)`, עובי: `lineWidth:1` → `lineWidth:1.5`

**Overview — Pension Card UI (`index.html` + `app.js`)**
- מפרידים: `#1e2d4a` → `rgba(100,116,139,0.2)` (עדין יותר)
- יישור: `#ov-pension-content` מ-`align-items:center` ל-`align-items:flex-start` — שורת הסטטיסטיקות נדחפת לראש הכרטיס

**Overview — "קצבה ברוטו" מגיב לטוגל הראל (`app.js`)**
- תיקון: `fmtNIS(ovPnsShowHarel ? grossWith : grossWithout)` — כברירת מחדל מציג ללא הראל; עם טוגל מציג עם הראל

**Market Analysis — True Header (`index.html` + `app.js`)**
- `mkt-search-area` הועבר לתוך `.header` הגלובלי; הוסר הטקסט "ניתוח שוק" ממנו
- הוסף `id="hdr-title-group"` לאלמנט הכותרת הראשי
- `switchTab()`: כשנמצאים ב-market — מסתיר `#hdr-title-group`, מציג `#mkt-search-area` כ-flex
- FX Slider: JS clamp `Math.max(3.00, Math.min(4.50, mktFxRate))` בשעת sync

**Simulator — Month Input Clamp (`index.html`)**
- `sim-ev-month`: הוסף `oninput` JS שמונע ערך מחוץ לטווח 1–12

**Version: v105.0**

### v104.8 – Deep UI Polish

**Overview — Pension Card (`index.html` + `app.js`)**
- **שורת טקסט אחת**: הוחלפו 4 כרטיסי `ov-micro-card` בשורה הוריזונטלית אחת (הון צבור | קצבה ברוטו | קצבה נטו | הכנסה פנויה)
- **מיני-טוגל הראל**: כפתור `עם הראל` / `– הראל` (9px, inline) ליד "קצבה נטו" — מחליף ערך ב-click ללא ריענון מלא
- גלובל חדש: `ovPnsShowHarel`, פונקציה חדשה: `ovTogglePnsHarel()`

**Overview — Simulator Mini (`index.html` + `app.js`)**
- **גובה**: container → `min-height:200px;flex:1;`; הוסרה שורת `canvas.height=165` — Chart.js שולט בגובה עם `maintainAspectRatio:false`
- **Tooltip אירועים**: כעת מציג גם סכום כספי (e.g. `פרישה (+2.5M)`)
- **סינון אירועי עבר**: `simCollectEvents()` מסנן `ev.yr < 2026` לפני החזרה

**Overview — Cashflow Today Line (`app.js`)**
- **הוסרה תווית "היום"** לחלוטין
- **קו**: מהסגנון הצהוב המקווקו → `rgba(200,200,200,0.5)`, `lineWidth:1`, `[5,5]`

**Market Analysis — Layout Shift (`index.html` + `app.js`)**
- **Search לשורת כותרת**: `mkt-search-area` הוזז לראש `mkt-wrap` כשורה אחת: כותרת "ניתוח שוק" + input + כפתור + chips
- **News לסייד-בר**: `mkt-news-section` הועבר מהעמודה הראשית לתחתית `mkt-ai-panel` (sidebar ימני)
- כרטיסי חדשות: עוצבו מחדש לרוחב צר (11px title, 9px publisher, 2-line clamp)

### v104.7 – Phase 4: Cross-Tab Sync + News + UI

**Backend: `app.py`**
- **News בנקודת הקצה המשולבת `/api/stock`**: שליפת 3-4 ידיעות אחרונות (title, publisher, url) דרך `yfinance .news` — מוחזרות ב-JSON תחת `news`

**Market Analysis (`index.html` + `app.js`)**
- **Ultra-Compact Search**: input + כפתור חפש + chips בשורה אחת (flexbox) — מינימליזם מלא
- **כרטיסי חדשות**: `<div id="mkt-news-section">` מוצג מתחת לגרף הראשי. `mktRenderNews(articles)` בונה 3-4 כרטיסים קליקביליים (title + publisher + ↗) — dark theme, `target="_blank"`

**Overview Tab (`app.js`)**
- **Cross-Tab Sync — נתוני השקעות**: `loadExcelFileCore()` מוסיף קריאה ל-`ovRenderKPIs()` + `ovRenderInvestChart()` לאחר טעינת נתוני השקעות
- **Cross-Tab Sync — נתוני פנסיה**: `smartUploadRouter()` מוסיף קריאה ל-`ovRenderKPIs()` לאחר הצלחת טעינת פנסיה
- **קו "היום" בגרף תזרים**: ממוקם ב-GAP בין הבר הנוכחי לבא (חצי מרחק בין `currentMonthIdx` ל-`currentMonthIdx+1`)
- **כרטיס "קצבה נטו" — עם/ללא הראל**: תצוגה הוריזונטלית: שני ערכים זה לצד זה (עם הראל | ללא הראל) בכרטיס בודד

### v104.6 – UX/UI Edge Cases & Bug Fixes

**Market Analysis (`index.html` + `app.js`)**
- **Auto-Uppercase**: `marketInit()` מוסיף `addEventListener('input')` שממיר כל הקשה ל-UPPERCASE תוך שמירת מיקום cursor
- **Graceful 404**: `mktLoadTicker` מפריד HTTP 404 — קורא ל-`mktShowNotFound()` שמציג הודעה עדינה (`mkt-not-found` div) ומסתיר את אזור התוצאות. שגיאות אחרות → banner אדום כרגיל
- **Compact Layout**: `mkt-empty-hero` → `padding:10px 0 8px`; search row → `margin-bottom:8px`; chips → `gap:5px`; `mkt-not-found` div נוסף מתחת לחיפוש
- **FX Slider Bug**: נוסף `mktLastFxSyncTicker` — slider מסתנכרן לשער החי **רק** כשהטיקר משתנה; שינוי period/bench לא מאפס את ה-slider

**Overview Tab (`app.js`)**
- **"קצבה נטו" Async Bug**: בסוף `pensionRender()` — אם `pnsNetMonthly === 0`, קורא ל-`pensionSliderChange()` עם ערך slider נוכחי לאתחול המשתנה; ואז `ovRenderKPIs()` לעדכון header מיידי עם טעינת נתונים
- **Tooltip `+` הוסר**: ב-monthly chart afterBody — מציג `net.toLocaleString()` בלי `+`
- **YTD Exact Clone**: Bar Chart ירוק/אדום לפי סימן (clone מדויק של CF tab); Y-axis עם padded locked range; ה-plugin של קו "היום" נשמר
- **Mini Simulator Exact Clone**: `ovRenderSimMini()` כתובה מחדש — אותם datasets/צבעים/fill כמו `simRenderChart` (SIM_VIEW=roy); `interaction: {mode:'index',intersect:false}`; tooltip מציג כל שכבה + footer סה״כ + אירועים; Y-axis `min:0`; ציר אירועים pixel-aligned מ-`simCollectEvents()`

### v104.5 – Market Analysis Polish + Overview Phase 2

**Market Analysis (`index.html`)**
- **הסרת האייקון**: `mkt-empty-hero` ריק לחלוטין — אין emoji, אין כותרת. search bar עולה לראש
- **FX Slider**: `min=3.00`, `max=4.50`, `step=0.01` — טווח רחב + שלב עדין יותר; `value` מאותחל ב-3.50 (JS מסנכרן לשער החי)

**Overview Tab (`index.html` + `app.js`)**
- **"הון חזוי לגיל 67" — State Persistence**: נוסף `OV_CACHED_WEALTH` global. `ovRenderKPIs()` שומר ערך חוקי ב-cache ומשתמש בו גם כש-`ovAllDataReady()` מחזיר false (מעבר טאב). הערך לא נאבד יותר
- **Cashflow Chart — הוצאות מלאות**: משתמש ב-`r.total_exp.val` כשקיים (כל ההוצאות מהאקסל כולל חריגות); fallback ל-`cfCalcExp(r)`
- **Toggle חודשי/YTD**: כפתורים "חודשי" / "YTD" בכותרת הכרטיס. `ovSetCFMode(mode)` — מצב YTD מציג Line Chart מצטבר; מצב חודשי Bar Chart רגיל. גלובל `ovCFMode`
- **סמן חודש נוכחי**: Plugin מקומי `ovCurMonthLine` — קו אנכי מקווקו צהוב (`rgba(250,204,21,0.55)`) + תווית "היום" על index של אפריל בשני מצבי הגרף
- **Simulator Mini — Y-axis**: `min: 0` קבוע — שכבת הנדל"ן בתחתית מוצגת במלואה

### v104.4 – Market Analysis Tab Revival (Phase 1)

**Backend: `app.py`** (נמצא ב-`/Users/roybenyamini/stock-dashboard/app.py`, פורט 5050)
- **`get_fx_rate()`**: שליפת שער USD/ILS חי מ-Yahoo Finance (`ILS=X`); fallback ל-3.70
- **`_ils_price()`**: פונקציית עזר להמרת מחיר ILS/ILa (אגורות) ל-USD
- **ILS Normalization ב-`/api/stock/<ticker>`**: בדיקת currency (ILS/ILa), חלוקת price/marketCap/targetMeanPrice ב-agora_factor ו-fx_rate
- **נקודת קצה חדשה `/api/stock` (query params)**: מחזירה data משולב — info + chart history + benchmark (SPY/QQQ/IWM) + sniper zones. תואמת את קריאות ה-frontend (`?ticker=X&period=Y&bench=Z`)
- **נקודת קצה חדשה `/api/chat` (POST)**: proxy ל-Cloudflare worker; תופסת HTTP 429/529 ומחזירה שגיאה עברית ידידותית; timeout ו-server errors מטופלים גם הם

**Frontend: `app.js`**
- **`mktLoadTicker`**: קריאה לנקודה החדשה `/api/stock?ticker&period&bench`; מסנכרן FX slider לשער החי שחזר מה-API (`data.fx_rate`)
- **`mktUpdateComparison`**: `fxAdj = mktFxRate / liveFx` (במקום hardcoded 3.70)
- **`mktAISend`**: שולח ל-`localhost:5050/api/chat` (במקום ישירות ל-Cloudflare); זיהוי ספציפי של `overloaded_error` / HTTP 429 → הודעה עברית ידידותית
- **`mktToggleSniper`**: Toggle Switch אמיתי (track + thumb עם אנימציה) במקום כפתור רגיל

**Frontend: `index.html`**
- **Empty State נקי**: הוסרו "ניתוח שוק ומסחר" ו"חפש מניה לניתוח מעמיק"; נשאר רק 📈 + search + chips
- **Sniper Toggle Switch**: הוחלף הכפתור ב-label עם track/thumb מונפש

### v104.3 – Overview QA Bug Fixes
- **Empty States אחידים**: נוספה class `.ov-empty-state` (position:absolute, overlay) + overlay divs בכל quadrant (`ov-cf-empty`, `ov-inv-empty`, `ov-sim-empty`). טקסט אחיד: "יש להעלות את קבצי הנתונים להצגת התוכן"
- **אל חטיפת ניווט**: העלאת תזרים כשנמצאים ב-Overview — נשאר ב-Overview, לא קופץ לטאב תזרים
- **גרף תזרים — הוצאות כלפי מעלה**: תוקן ל-`Math.abs(exp)` (חיובי); תווית X מציגה שם חודש בלבד ללא שנה
- **CF_DATA לא נמחק בהעלאת Asset Data**: `CF_DATA = []` הועבר פנימה לענף CF בלבד ב-`smartUploadRouter`
- **Dependency Gate לסימולטור**: `ovAllDataReady()` — הסימולטור ו-KPI "הון חזוי" מציגים תוכן רק אם CF + Investments + Pension כולם טעונים; אחרת: "ממתין..." ב-KPI ו-empty state בריבוע



### v104.0 – Overview Tab + Market Analysis Tab

**טאב מבט על (`#tab-overview`) — Bento Box Layout:**
- **שורת KPI עליונה (4 כרטיסים)**: רווח חודש אחרון (מ-CF_DATA.delta) | סה"כ השקעות (מ-ALL_TOTALS, בM) | קצבה נטו ללא הראל (מ-pnsNetMonthly) | הון חזוי לגיל 67 (מ-simRunEngine)
- **גרף תזרים (Top Right)**: Bar Chart 13 חודשים מ-CF_DATA.delta; ירוק/אדום; כולל מספר "רווח YTD" בפינה
- **גרף השקעות (Top Left)**: Line Chart מ-ALL_TOTALS עם gradient fill ו-hover tooltips מפורטים
- **כרטיסי פנסיה (Bottom Right)**: 4 Micro-Cards — הון צבור / קצבה ברוטו / קצבה נטו / הכנסה פנויה. ללא גרפים. מציג "אין נתונים" כשאין Excel פנסיה
- **סימולטור מוקטן (Bottom Left)**: Stacked Area Chart 5 שנים קרובות (simRunEngine + simSliceResult). ציר אירועים תחתון מ-SIM_USER_EVENTS. ללא גרף כשאין נתונים
- **CSS**: `<style>` מוטמע בתוך הטאב (לא משנה CSS גלובלי); כל הכרטיסים `.ov-card`, `.ov-kpi-card`, `.ov-micro-card`
- **JS**: `overviewRender()` נקרא בכל מעבר לטאב (`switchTab`); 5 פונקציות: `ovRenderKPIs`, `ovRenderCashflowChart`, `ovRenderInvestChart`, `ovRenderPensionCards`, `ovRenderSimMini`

**טאב ניתוח שוק (`#tab-market`) — Market Analysis:**
- **תמה**: Dark deep `#0a0e1a` background, `#141c2e` כרטיסים
- **חיפוש**: שדה טקסט + כפתור חיפוש + Quick Chips (Mag7, S&P 500, ת"א 125, ת"א 35)
- **גרף ראשי**: Line Chart מ-`localhost:5050/api/stock?ticker=X&period=Y`; כפתורי 1M/3M/6M/1Y/3Y
- **Sniper Zones**: Toggle button — כשפעיל, מציג קווים אופקיים מקווקוים על הגרף לפי `data.sniper.target_buy` ו-`target_sell`; legend מתחת לגרף
- **Comparison Chart**: תשואה % נורמלית מול benchmark (SPY/QQQ/IWM) + Slider USD/ILS (`mktFxRate`) שמשפיע על תשואת המניה
- **AI Sidebar**: Collapsible; שולח שאלה לפרוקסי הקיים `holy-poetry-claude-proxy`; system prompt כולל נתוני המניה הנוכחית; היסטוריית שיחה (8 הודעות אחרונות)
- **Empty State**: גיבור + שדה חיפוש ענק; `#mkt-results` נשאר `display:none` עד חיפוש ראשון
- **CSS**: `<style>` מוטמע בטאב; classes: `.mkt-chip`, `.mkt-period-btn`, `.mkt-ai-msg-user`, `.mkt-ai-msg-ai`

**שינויים ב-`switchTab`:**
- נוספו `isOv` ו-`isMkt` flags
- Overview: `overviewRender()` נקרא בכל מעבר (רענון נתונים)
- Market: `marketInit()` נקרא פעם אחת (lazy init)

**קבצים שהשתנו**: `index.html` (גרסה + HTML שני טאבים), `app.js` (switchTab + ~600 שורות חדשות בסוף)

## שינויים אחרונים (11/04/2026)

### v103.43 – Tooltip Zone, Loan-End Diamond, Modal Cleanup
- **Tooltip גרף (Task 1)**: `onHover` מצומצם — טריגר רק 5px מעל עד 45px מתחת לשורת הסטאק העליונה. מחוץ לטווח → `chart.tooltip.setActiveElements([])`.
- **כפתור "טווח"**: שונה מ"טווח עשור" → "טווח" (קצר יותר).
- **פאנל הגדרות ⚙ (Task 2)**: הוסרו שורות "פרישה" (hardcoded 2029-2033) + הוסר סליידר נדל״ן; נשארו רק שדות "טווח — התחלה/סיום" עם הערה.
- **ניקוי מודאל (Task 3)**: `_simResetEventForm()` מנקה כל שדות — year/month/amount/loan שדות ריקים (לא "2026" ולא "1").
- **Tooltip ציר אירועים (Task 4)**: שורה 1 = שם האירוע; שורה 2 = "תזרים חודשי: ±X₪" (נטו = שכ״ד פחות הלוואה). שאר הפרטים הוסרו. `simShowTltp` שוּנה ל-`innerHTML` + `&#10;→<br>`.
- **יהלום סיום הלוואה (Task 5)**: לולאת `SIM_USER_EVENTS` חדשה בסוף `simRenderTimeline()` — יוצרת יהלום אפור (`#9ca3af`) בתאריך `loanEndYear/Month` לכל השקעה עם `loanMonthly>0`. Tooltip: "סיום החזר הלוואה: [שם]".
- **KPI נדל״ן (Task 6)**: אומת — כרטיס 4, צבע `#c2956c`, `sim-kpi-re-now`, `grid repeat(4,1fr)`.
- שינויים: `index.html` (גרסה + כפתור + settings modal), `app.js` (onHover + _simResetEventForm + simRenderTimeline tooltip + loan-end diamonds + simShowTltp)

### v103.42 – RE KPI Card, Smart Tooltip, Precision Zoom
- **כרטיס KPI נדל״ן**: נוסף כרטיס 4 ב-sim-kpi-row (grid 4 עמודות), בצבע טרקוטה `#c2956c`. מחובר ל-`simGetRoyRealEstate()` דרך `simRenderKPI()` → ID: `sim-kpi-re-now`. מוצג בתצוגות רועי/שניהם, '—' בתצוגת יעל.
- **Tooltip חכם (Task 2)**: `onHover` ב-Chart.js בודק אם cursor נמצא בתוך ±55px מהשורה העליונה של הסטאק. מחוץ לטווח → `chart.tooltip.setActiveElements([])` → Tooltip נעלם. רקע `#f8f9fa`, אנכור לנקודה הגבוהה.
- **זום פרישה**: 2029–2033 (5 שנים מדויקות); `SIM_ZOOM_CUSTOM` ברירות מחדל עודכנו.
- **טווח עשור**: כפתור שונה מ"עשור" ל"טווח עשור"; טווח ברירת מחדל 2029–2039.
- **הגדרות זום — סליידר נדל״ן**: נוסף סליידר "עליית ערך נדל״ן שנתית" לתוך פאנל הגדרות ⚙; מחובר ל-`simSetREGrowth()`.
- **צבע תווית סליידר נדל״ן**: הוסר צבע טרקוטה מהתווית — ירש כחול/סגול כמו שאר הסליידרים.
- שינויים: `index.html` (גרסה + sim-kpi-row → 4 cards + zoom btn rename + slider label + settings popover), `app.js` (SIM_ZOOM_CUSTOM + simGetZoomRange + simApplyZoomSettings + simRenderKPI + onHover tooltip)

### v103.41 – Real Estate Layer, Zoom Refinement, Tooltip Polish
- **שכבת נדל״ן (BOTTOM)**: `royRealEstateData[]` נוסף ל-engine — גדל חודשי לפי `SIM_RE_GROWTH_RATE`. שכבה חומה-טרקוטה (`#a0522d`) בתחתית ה-Stacked Area (לפני השקעות, פנסיוני, ירושה). גם בתצוגת Combined (5 שכבות).
- **השקעה מניבה → הוסף לנדל״ן**: `reEventsByMonth` — כשמוסיפים "השקעה מניבה", סכום נוכה מנזיל ומתווסף לנדל״ן, ה"סה״כ הון" יציב.
- **סליידר עליית ערך נדל״ן שנתית**: `SIM_RE_GROWTH_RATE` (ברירת מחדל 2.5%), סליידר 0–8%, `simSetREGrowth()`.
- **זום פרישה**: חלון 5 שנים מדויק — גיל 65 עד 70 (שנה לפני + 4 שנים אחרי גיל 66).
- **זום עשור**: בדיוק 2026–2036.
- **כפתור הגדרות זום** (⚙): `simToggleZoomSettings()` / `simApplyZoomSettings()` — popover לקביעת טווחים מותאמים.
- **Tooltip ציר אירועים**: רקע בהיר (`#f8f9fa`), טקסט כהה, הורם 15px.
- **כותרת header KPI**: "הון חזוי" → "הון השקעות פעיל".
- **simGetYaelRealEstate()**: פונקציה חדשה לנדל״ן יעל (dira, owner=yael).
- שינויים: `index.html` (גרסה + tooltip + סליידר RE + grid 7 עמודות + zoom settings + כותרת header), `app.js` (SIM_RE_GROWTH_RATE + SIM_ZOOM_CUSTOM + simGetZoomRange + simSetZoom + simToggleZoomSettings + simApplyZoomSettings + simSetREGrowth + simGetYaelRealEstate + simRunEngine + simSliceResult + simRenderChart + simShowTltp)

### v103.40 – Zoom, Balloon Loan, Dynamic Modal, Chart Events
- **KPI Label**: "הון השקעות פעיל" (שונה מ"פיננסי פעיל")
- **כפתור נקה**: עיצוב secondary אפור-שקוף (לא אדום)
- **זום גרף** (3 מצבים): `SIM_ZOOM` + `simGetZoomRange()` + `simSetZoom()` + `simSliceResult()`. כפתורים: "הכל" / "פרישה" (עד גיל 77) / "עשור" (10 שנים). Timeline גם מסתגל לזום.
- **כותרת מודאל דינמית**: `simToggleInvestmentFields()` מעדכן כותרת לפי סוג = "הוספת הכנסה/הוצאה/השקעה/תזכורת" (רק במצב הוספה)
- **שנת ברירת מחדל**: 2026 (לא 2030). סכום ברירת מחדל: 0.
- **הלוואה — שדות חדשים**: "שנת סיום החזר" + "חודש סיום החזר" (במקום "תקופת הלוואה"). נוסף שדה "החזר קרן בסיום (בלון)" — סכום מנוכה מהנזיל בתאריך הסיום.
- **מנוע בלון**: `eventsByMonth[loanEnd] -= balloonAmount` בתאריך סיום ההלוואה.
- **Chart Tooltip + אירועים**: ה-footer callback מחזיר מערך שורות — שורה ראשונה: "סה״כ: X.XM", ואחריה שורות ◆ לכל אירוע בשנה זו. מסנן אירועים לפני 2026.
- **filter timeline**: יהלומים <2026 לא מוצגים (strict filter).
- שינויים: `index.html` (גרסה + KPI + כפתור + zoom buttons + modal fields), `app.js` (SIM_ZOOM + simGetZoomRange/simSetZoom/simSliceResult + simRunEngine + simRenderChart + simRenderTimeline + simToggleInvestmentFields + _simResetEventForm + simShowAddEventModal + simConfirmAddEvent + simCollectEvents)

### v103.39 – Event Modal Polish + Timeline UX
- **שם KPI**: "הון פיננסי נזיל" → "הון פיננסי פעיל"
- **מודאל — כותרות**: מצב הוספה = "הוספת אירוע סימולציה"; מצב עריכה = "עריכת אירוע"
- **מודאל — ניקוי**: כפתור "נקה שדות" → `simClearEventForm()`. הוסר כל טקסט placeholder.
- **מודאל — כפתורי עריכה**: "הוסף" / "עדכן" + "מחק" מוצגים לפי מצב. כפתורי שמירה ומחיקה ב-v103.38 ממוקמים בשורה אחת.
- **כפתור global**: "נקה הכל" → "נקה אירועי סימולציה"
- **Proximity Zoom**: בציר האירועים — אם 3+ אירועים בחלון 5-שנים, תיקים שנתיים (לא כל 5) לאותו טווח
- **Custom Tooltip**: `simShowTltp` / `simHideTltp` — tooltip צף עם `#sim-tltp`; מציג תאריך, שם, סכום (M/k), שכ״ד, הלוואה
- **"M" בtooltip**: סכומים ≥1000K מוצגים כ-X.XM; אחרים כ-Xk
- שינויים: `index.html` (גרסה + KPI label + כפתורים + modal + tooltip div), `app.js` (simShowAddEventModal titles + simClearEventForm + simShowTltp/simHideTltp + simRenderTimeline proximity zoom + tooltip formatting)

### v103.38 – Smart Wealth + Advanced Events + Interactive Timeline
- **הפרדת הון (CRITICAL)**: נוסף `simGetRoyRealEstate()` — סכום קרנות `dira`. `royLiquid` מתחיל מ-`simGetRoyCapital()` (ללא דירה). הדירה נשמרת כ-`royRealEstate` (קבוע, לא מורבה בתשואה). ה-`royData` בגרף כולל liquid + pension + real estate. ה-KPI "הון פיננסי נזיל" מציג רק הנזיל; "סה״כ הון" כולל נדל"ן.
- **מנוע: אירועים בכל שלב**: `eventsByMonth` + `monthlyFlowExtra` מיושמים בכל ה-phases (לא רק phase 3). אירועי SIM_USER_EVENTS מוכנסים ל-eventsByMonth (חד-פעמיים) ו-monthlyFlowExtra (שוטפים).
- **מודאל מתקדם**: 4 סוגי אירוע — הכנסה / הוצאה / השקעה מניבה / תזכורת. לסוג "השקעה מניבה" — שדות נסתרים: הכנסה חודשית (₪), הוצאה חודשית (₪), תקופת הלוואה (שנים). מצב עריכה: כפתורי "עדכן" + "מחק" מוצגים, "הוסף" מוסתר.
- **ציר אינטרקטיבי**: לחיצה על יהלום של אירוע משתמש פותחת מודאל ממולא-מראש לעריכה. קווים אנכיים (phase markers) הוסרו. legend מפושט ל-4 סוגים.
- **כפתור "נקה הכל"**: `simClearAllUserEvents()` — מאפס את כל SIM_USER_EVENTS ומרנדר מחדש.
- שינויים: `index.html` (גרסה + KPI label + timeline section + modal HTML), `app.js` (simGetRoyRealEstate + simRunEngine + simRenderKPI + simCollectEvents + simRenderTimeline + modal functions + simClearAllUserEvents)

### v103.37 – Timeline Pixel-Sync + Add Event Modal + Header Format
- **פורמט מספרים**: כל KPI הון (השקעות, פנסיוני, סה״כ) עברו ל-`simFmtM()` → מציג מיליון ש״ח (e.g. 15.6) במקום K. Sub-label שונה מ"אלפי ₪" ל"מיליון ש״ח".
- **"הון חזוי" sub-label**: ה-spacer הריק הוחלף ב-sub-label "מיליון ש״ח" בצבע אפור — יישור מלא בין כל 4 ה-KPI בכותרת.
- **סנכרון ציר אירועים**: `simRenderTimeline()` נכתב מחדש — קורא ל-`simChartObj.chartArea.left/right` לאחר רינדור ומחשב מיקום פיקסל מדויק עבור כל שנה. `simRenderChart` מפעיל `setTimeout(simRenderTimeline, 0)` לאחר ציור.
- **מסיר ציר אירועים ישן** (`simAddEventPrompt` הוסר); **מוסיף 3 פונקציות מודאל**: `simShowAddEventModal()`, `simCloseEventModal()`, `simConfirmAddEvent()`.
- **מודאל הוסף אירוע** (`#sim-add-event-modal`): overlay כהה, כרטיס RTL עם שדות שם/שנה/חודש/toggle הכנסה-הוצאה/סכום. כפתורים "הוסף" / "ביטול". אירוע נוסף ל-`SIM_USER_EVENTS` → גרף ו-timeline מתעדכנים מיידית.
- **הסרת "Events Ledger"**: סעיף `sim-events-section` הוסר מ-index.html — אין עוד כפילות עם ה-timeline.
- שינויים: `index.html` (גרסה + KPI sub-labels + timeline button + modal HTML), `app.js` (simFmtM + simRenderKPI + simRenderChart + simRenderTimeline + modal functions + simRemoveUserEvent)

### v103.36 – Data Sync + UI Restructure + Events Timeline
- **הון השקעות (CRITICAL)**: מחובר כעת ל-`ALL_TOTALS[last]` — מציג ~15.6M (סכום אמיתי מטאב השקעות) במקום 14.4M (שהחסיר דירה). גם `royLiquid` ב-`simRunEngine` מתחיל מ-ALL_TOTALS → נקודת פתיחה ~21.9M.
- **כותרת משנה — גיל זהב**: המספר `${targetAge}` בכותרת "תחזית לגיל" מוצג בצבע זהב/ענבר (`#f59e0b`). ניקוי כותרת סימולטור מכל שאר הטאבים (switchTab).
- **KPI min-height**: כל 4 KPI sub-labels בכותרת קיבלו `min-height:18px` → המספרים יושרו על אותה שורה אופקית.
- **X-axis ברירת מחדל = "שניהם"**: `SIM_XAXIS_MODE = 'both'`; תצוגה דו-שורתית ['גיל X', 'YYYY'] דרך `ticks.callback` ב-Chart.js (ללא שינוי labels פנימיים).
- **ציר אירועים פיננסיים**: `simRenderTimeline()` + `SIM_USER_EVENTS` → section ישירות מתחת לגרף; יהלומים (diamonds) לפי NOTES + PENSION_EVENTS; כפתור "+ הוסף אירוע" (volatile); legend צבעים.
- **פריסה**: סליידרים הועברו לתחתית העמוד; ציר אירועים מוצג בין הגרף לרשימת האירועים.
- שינויים: `index.html` (גרסה + KPI HTML + layout + timeline HTML), `app.js` (SIM_XAXIS_MODE + simRunEngine + simRenderKPI + simRenderChart + simRenderTimeline + simAddEventPrompt + simRemoveUserEvent + switchTab)

## שינויים אחרונים (10/04/2026)

### v103.33 – Critical InvestTab Fix, KPI Polish, Target Age 67
- **הפקדות/העברות — תיקון שורש (CRITICAL)**:
  (1) `parseFloat(kv)` מחליף `typeof kv === 'number'` — טיפול בערכים כמחרוזת (למשל "83" מאקסל)
  (2) הוסרה הגבלת החלון (13 חודשים) — מסכם כעת את **כל** ה-Column K החיוביים בכל הזמן
  כך גם ה-83k ממיטב וגם פניקס 414 + הראל 286 נכנסים לחישוב
- **KPI הון חזוי**: חזר לפורמט M (e.g. "46.7M") — `simFmtK()` במקום `simFmtKbare()`
- **KPI תגיות**: הוסר sub-label "אלפי ש״ח" מ"הון חזוי" (M format מספיק); נשאר ב-3 הכרטיסיות האחרות עם `line-height:1; margin-top:0` — ללא הגבהת כרטיס
- **גיל יעד 67**: `SIM_TARGET_AGE = 67`; input חדש ב-controls panel (ליד "תרחיש סימולציה"); הוסר מאזור הגרף; מינימום שונה מ-70 ל-60
- שינויים: `index.html` (גרסה + KPI HTML + chart overlay + controls panel), `app.js` (updateDynamicStats + simRenderKPI + simSetTargetAge + SIM_TARGET_AGE)

## שינויים אחרונים (10/04/2026)

### v103.31 – KPI Polish, Fixed Y-Axis, Full Slider Sync
- **KPI sub-label**: הוסרה סיומת "k" מהמספרים; נוספה תווית "אלפי ש״ח" inline מתחת לכל ערך (`line-height:1, margin-top:1px` — אין הגבהה לכרטיס)
- **`simFmtKbare(v)`**: formatter חדש — מחזיר מספר K עגול ב-`toLocaleString()` ללא סיומת
- **Subtitle דינמי**: title גיל/שנה כעת מתעדכן בכל שינוי `SIM_TARGET_AGE`; input גיל יעד הוחזר לאזור הגרף (ימין עליון)
- **Scale Selector**: dropdown חדש בגרף (ימין עליון) — 60M/80M/100M/120M → `simSetYScale(v)` + `SIM_Y_SCALE` global
- **Y-Axis per-view**: תצוגת יעל = 10M קבוע; רועי/משותף = `SIM_Y_SCALE` (ברירת מחדל 60M, יציב)
- **Slider sync מלא**: `simSetRate` + `simSetExpense` קוראים כעת ל-`simRenderKPI()` לפני הגרף; `simSetPensionMonthly` גם קורא ל-`simRenderKPI()`
- **תשואת הון פנסיוני**: `pnsRetirementYieldChange` מפעיל כעת `simRenderChart(simRunEngine())` — הסליידר "חי" בסימולטור
- שינויים: `index.html` (גרסה + KPI HTML + chart overlay), `app.js` (simFmtKbare + SIM_Y_SCALE + simSetYScale + slider setters + pnsRetirementYieldChange + simRenderKPI)

## שינויים אחרונים (10/04/2026)

### v103.30 – Dynamic Logic Fixes & KPI Polish
- **שנת לידה**: `SIM_BIRTH_YEAR_ROY` תוקן מ-1962 ל-1963 (גיל 63 בשנת 2026) → subtitle מדויק
- **Subtitle דינמי**: "תחזית לסוף שנת YYYY (גיל XX)" — מתעדכן בכל שינוי גיל/שנה (כבר עובד, תועד)
- **הכרות/העברות (CRITICAL)**: הוסרה בדיקת `invFilter` מחישוב Column K — מסכם כעת ALL קרנות ללא תלות בתצוגה; מיטב 83k ושאר ערכים חדשים ייספרו אוטומטית
- **הכנסה קבועה ← מנוע**: `SIM_PENSION_MONTHLY` מחווט כעת ישירות ל-Phase 3 של `simRunEngine()` כ-`totalPensionIncome`; `simSetPensionMonthly` מחשב מחדש גם את הגרף
- **KPI M/k ללא ₪**: הכנסה פנויה / תזרים נטו / צבירה כוללת מציגים כעת פורמט k/M (ללא סימן ₪)
- **תזרים נטו**: חישוב = `SIM_PENSION_MONTHLY − SIM_TARGET_EXP` (סליידר הכנסה − סליידר הוצאה)
- **Y-Axis חכם**: `Math.max(60000, dataMax × 1.1)` — מאוזן ב-60M אבל גדל בתרחיש אופטימי
- **Tooltip תזרים**: שחזור גרסת pre-103.29 — רשימת קטגוריות מלאה + YTD afterBody (Revert Task 4b)
- שינויים: `index.html` (גרסה), `app.js` (SIM_BIRTH_YEAR_ROY + simRunEngine + simSetPensionMonthly + simRenderKPI + simRenderChart + updateDynamicStats + CF tooltip)

### v103.29 – KPI Terminology, Fixed Y-Axis, Tooltip Cleanup, Dynamic Transfers
- **KPI כותרת סימולטור — ניסוח**: תוויות חדשות בשורה אחת: "הון חזוי" / "הכנסה פנויה" / "תזרים נטו" / "צבירה כוללת"; הוסרו יחידות (₪, M ₪) מתוך הכרטיסיות; input גיל הוסר מהכרטיסייה
- **כותרת משנה דינמית**: `hdr-subtitle` מציג "תחזית לסוף שנת YYYY (גיל XX)" בטאב הסימולטור
- **דיוק זמן (Task 2)**: חישוב "הון חזוי" מתייחס תמיד לדצמבר של שנת היעד (סוף שנה מלאה) — תיעוד מפורש בקוד
- **Y-axis קבוע (Task 3)**: `max: 60000` (= 60M ₪) — מונע "קפיצת" ציר כשמזיזים sliders
- **Tooltip סימולטור (Task 4a)**: `yAlign: 'bottom', caretPadding: 16` — הטולטיפ צף מעל קווי הגרף
- **Tooltip תזרים (Task 4b)**: מציג רק "פריטים חריגים" + שורת footer (הכנסות / הוצאות / נטו); מסתיר רשימת קטגוריות שוטפות (שוטף, יותם, הכנסות)
- **הכרות/העברות (Task 5)**: חישוב דינמי מ-FUND_COL_K — סוכם אוטומטית כל הפקדה חיובית בחלון, ללא תלות ב-EXTERNAL_EVENTS קשיח
- שינויים: `index.html` (גרסה + KPI HTML), `app.js` (simRenderKPI + simRenderChart + CF tooltip + updateDynamicStats)

### v103.28 – Main KPI Header Logic + Tooltip Total
- **Tooltip סה״כ**: הוספת `footer` callback לגרף הסימולטור — מציג "סה״כ: [ערך]" מסוכם לכל השכבות בנקודת הזמן הנבחרת (M/k format)
- **KPI 1 — סה״כ הון בגיל X**: מחשב כעת מתוצאת מנוע ההקרנה (simRunEngine) — מסנן לשנת `SIM_BIRTH_YEAR_ROY + SIM_TARGET_AGE` ומציג הון אמיתי מוקרן
- **KPI 2 — הכנסה חודשית בפרישה**: מקושר ישירות לסליידר "הכנסה קבועה" (`SIM_PENSION_MONTHLY`)
- **KPI 3 — צבירה שוטפת**: הכנסה חודשית פחות הוצאות (salary − expenses); תווית שונתה מ"צבירה חודשית נוכחית"
- **KPI 4 — צבירה כוללת (חדש)**: צבירה שוטפת + תשואה חודשית על ההון הנוכחי (royCapital × SIM_RATE/12); הוספת element `sim-hdr-total-accum` ב-HTML
- שינויים: `index.html` (גרסה + KPI 4), `app.js` (tooltip footer + simRenderKPI logic)

## שינויים אחרונים (06/04/2026)

### v102.2 – Bug Fixes & Logical Upgrades
- **הגנת Outlier בנתוני נכסים**: בפענוח Excel — אם ערך נכס קופץ יותר מ-20x מהחודש הקודם, מחלק ב-1000 (הנחת טעות הזנה ש"ח במקום אלפי ₪)
- **גופן כרטיסיות פנסיה**: `pns-card-num` עלה מ-13px ל-17px ומ-700 ל-800 (ברירת מחדל)
- **סימולטור — גרף Stacked Area**: ברירת מחדל שונתה ל-"משותף" (Combined) שמציג רועי ויעל בשכבות נפרדות
- **סימולטור — Overflow Fix**: הוספת `overflow:hidden` ל-sim-chart-section; sim-chart-wrap עם `width:100%`
- **סימולטור — הרחבה לגיל 90**: SIM_END שונה מ-2060 ל-2080
- **פנסיה — שווי כלכלי נטו**: חישוב והצגת שווי כלכלי נטו של הון פטור (35% מס) תחת עיגול ההון
- **פנסיה — תשואת יתרה בפרישה**: סליידר חדש (0–6%) שמחשב כמה זמן ההון בביטוח מנהלים (הראל/פניקס) יחזיק תוך קבלת קצבה, כולל הכנסה מתשואה על היתרה
- **תזרים — כפתור תחזית**: תיקון לוגיקת אינטרפולציה — כאשר אין עמודת "סיכומים" באקסל, מחשב תחזית שנתית מממוצע החודשים הקיימים; הכותרת מראה "אומדן מ-N חודשים"
- שינויים: `index.html` (גרסה + HTML פנסיה + סימולטור), `app.js` (outlier + sim + pension + forecast), `style.css` (font + overflow)

## שינויים אחרונים (31/03/2026)

### v102.0 – סימולטור פיננסי (Financial Simulator)
- **טאב סימולטור פעיל**: החליף "בבנייה" בממשק מלא ומשולב
- **מנוע הקרנה (simRunEngine)**: מחשב חודש-חודש מרץ 2026 עד דצמ׳ 2060
  - **שלב 1** (עד אוג׳ 2027): הוספת דלתא חודשי (משכורת − הוצאה) להון רועי
  - **שלב 2** (ספט׳ 2027 – אוג׳ 2029): דלתא לפי משכורת מדריך
  - **שלב 3** (מספט׳ 2029): ריבית + ניכוי גירעון (הוצאה − קצבה); הוספת מענקים חד-פעמיים
  - **הון יעל**: גדל בריבית דריבית בלבד (ללא הפקדות חודשיות)
- **גרף הר (Mountain Chart)**: Chart.js area chart עם 3 צבעי רקע לפי שלב; תצוגת Roy / Yael / Combined (stacked area)
- **לוח בקרה**: 4 פקדים — View Toggle + 3 sliders (ריבית / הוצאה יעד / משכורת מדריך)
- **7 כרטיסיות KPI**: הון רועי, הון יעל, הון משותף, משכורת, הוצאה, דלתא, קצבה
- **אירועים Ledger**: מציג PENSION_EVENTS עם On/Off toggle לכל אירוע — הפעלה/כיבוי מחשבת מחדש את הגרף
- **Header Stats**: 4 ערכים בכותרת כשטאב סימולטור פעיל (הון רועי / יעל / משותף / דלתא)
- **פורמט מספרים**: הון = K אלפים (1,103K); תזרים/קצבה/הוצאה = ₪ מדויק (36,000 ₪)
- **קריאת נתונים**: מ-FUNDS (הון נוכחי), CF_DATA (משכורת+הוצאות), PENSION_ASSETS (קצבה), PENSION_EVENTS (מענקים)
- שינויים: `index.html` (גרסה + sim-header-stats + tab content), `app.js` (switchTab + simulator engine), `style.css` (all sim-* classes)

## שינויים אחרונים (30/03/2026)

### v99.8 – Pixel Perfect Alignment + Critical Bug Fix
- **ביטול רווח לבן**: `.chart-section padding-bottom:4px;margin-bottom:0`; הכותרת `(באלפי ש״ח)` עברה לכותרת הטבלה כ-span קטן אפור; עמודה ראשונה הוגדרה כריק (ללא טקסט "ערך (אלפי ש״ח)")
- **יישור עמודות מדויק**: `yAxisW = chart.chartArea.left` → `colgroup` עמודה ראשונה = רוחב Y-axis; שאר העמודות שוות ב-`calc((100% - yAxisW) / nDataCols)`; `table-layout:fixed;width:100%`
- **תיקון קריטי (Revert)**: הוסרה שורת `querySelectorAll('[id^="sec-"]')` מ-`switchTab` שגרמה לאיפוס נתונים/פגיעה ב-State. State management תקין: `loadFromLocalStorage()` → `ALL_TOTALS` → `updateDynamicStats()`
- שינויים: `index.html` (גרסה + modal dimensions), `style.css` (chart-section spacing), `app.js` (invMDSelectFund colgroup + switchTab revert)

### v99.7 – Zero-Scroll UI Polish (4 fixes)
- **Modal ניתוח**: `width:92vw;max-width:1100px;max-height:85vh;padding:16px 20px`; כותרת ו-gap מוקטנים; donuts: `max-width:160px;max-height:160px`; `.ch-card padding:10px 12px`
- **הסתרת קטגוריות תחתונות**: CSS `#inv-master-detail { display:none; }` כברירת מחדל; `switchTab` מסתיר Master-Detail בברירת מחדל
- **צמצום ריווח**: `.chart-section padding:10px 20px 4px;margin-bottom:0`; `.cards-row margin-bottom:6px`; `#tab-investments padding-top:0`
- **שחזור אחוזים**: inline percentage span בתאי ערך בטבלת פירוט; `overflow:visible`
- שינויים: `index.html` (modal + גרסה), `style.css` (ch-card + inv-master-detail + chart-section + cards-row), `app.js` (switchTab + invMDSelectFund)

### v99.6 – Pixel Perfect Layout: צמצום ריווח + יישור עמודות
- **צמצום ריווח אנכי**: `margin-bottom` של `.chart-section` הוקטן מ-14px ל-4px; `padding-top` של `#tab-investments` מ-12px ל-4px; `padding` של `#inv-master-detail` מ-`4px 20px 24px` ל-`0px 20px 16px`
- **יישור עמודות טבלה לגרף**: `invMDSelectFund` קורא `chart.chartArea.left` לקבלת רוחב אזור Y-axis; מוסיף `<colgroup>` עם עמודה ראשונה בגודל קבוע (`yAxisW px`) ו-13 עמודות נתונים שוות; הטבלה: `table-layout:fixed; width:100%`
- **CSS**: `.inv-md-detail-table-wrap` שונה מ-`overflow-x:auto` ל-`overflow-x:visible` — הטבלה ממלאת רוחב מלא
- שינויים: `style.css`, `index.html`, `app.js`

### v99.5 – הסרת HTML סטטי של קטגוריות תחתונות + שחזור אחוז בטבלה
- **שורש הבעיה**: גושי HTML עם נתונים קשיחים (`sec-arbitrage`, `sec-dira`, `sec-chov`) בתוך `#categories-scroll` הציגו תמיד נתונים גם כאשר ה-container היה אמור להיות מוסתר — הוסרו לחלוטין מה-HTML
- **אחוז בתא ערך**: `invMDSelectFund` — אחוז שינוי מוצג inline בתוך תא "ערך" עצמו (font-size:9px, ירוק/אדום/אפור לפי כיוון)
- שינויים: `index.html` (הסרת ~95 שורות), `app.js` (inline pctHtml בשורת ערך)

### v99.1–v99.4 – הסתרת קטגוריות תחתונות (CSS/JS)
- הוספת `display:none !important` ל-`#categories-scroll` ו-`#cat-scroll-label` ב-CSS
- הוספת `style="display:none"` inline ב-HTML על `#categories-scroll`
- `invSetView` — הסרת `sec.style.display = ''` עבור `yaelOnlyCats`
- `switchTab` — מסתיר `categories-scroll` בכל מעבר לטאב השקעות

### v99.2 – ניווט מתוך Modal טבלת סיכום + אחוז שינוי בטבלה
- `tableNavToCat(catId)` / `tableNavToFund(fundKey, catId)` — לחיצה על שם קטגוריה/קרן ב-modal סוגרת את ה-modal ומנווטת ל-Master-Detail הרלוונטי
- `setTimeout(..., 30)` — מאפשר ל-`invMDShowCat` לסיים לבנות כרטיסיות לפני `invMDSelectFund`
- שינויים: `app.js` (פונקציות ניווט + buildTableView)

### v99.0 – Master-Detail UI לטאב השקעות
- **הסתרת categories-scroll הישן**: `#categories-scroll { display:none }` ו-`#cat-scroll-label { display:none !important }` — ה-UI החדש מחליף את פסי הגלילה הישן
- **כרטיסיות קטגוריה** (`#inv-cards-row`): הוספת 3 כרטיסיות חדשות — ארביטראז', דירה, חוב
- **פאנל Master-Detail** (`#inv-master-detail`): מסתיר/מוצג לפי קטגוריה נבחרת; מכיל:
  - שורת כרטיסיות קרנות (`#inv-md-funds-row`) — border צבעוני לפי קטגוריה
  - פאנל פירוט קרן (`#inv-md-detail-wrap`) — טבלת ערכים חודשיים + כפתור סגירה
- **State**: `invMDCurrentCat` / `invMDCurrentFund` — מנהלים רמה 1 ורמה 2
- **פונקציות חדשות**: `invMDShowCat(catId)` / `invMDSelectFund(fundKey)` / `invMDCloseDetail()`
- **selectView()**: מפעיל `invMDShowCat(cat)` בבחירת קטגוריה; מסתיר את הפאנל ב-'all'
- **CSS**: `.cards-row` → `flex + overflow-x:auto` (במקום grid); עיצוב מלא ל-`.inv-md-*`
- שינויים: `index.html` (מבנה + גרסה), `app.js` (state + פונקציות + selectView), `style.css` (flex cards + Master-Detail styles)

### v98.6 – Micro-copy & CSS Consistency
- **"מבט מצטבר"** → **"תחזית שנתית ומצטבר"** (`index.html`, תווית סטטית)
- **"🔮 תחזית שנתית — עמודת סיכומים"** → **"פירוט תחזית שנתית"** (`app.js`, cfRenderForecast) — הוסרו: אמוג'י, `color:#8b5cf6`, `font-weight:700`, `margin-bottom:10px`; הוחל עיצוב זהה לשאר התוויות: `font-size:10px;color:#94a3b8;font-weight:600;letter-spacing:0.4px;margin-bottom:3px`
- שינויים: `index.html` (כותרת + גרסה), `app.js` (cfRenderForecast)

### v98.5 – Soft Matching לעמודת "סיכומים" (Robust Parser)
- **שורש הבעיה**: `colHeaderRaw.trim().toLowerCase()` לא מנקה תווי Unicode בלתי נראים (`\u200F` RTL mark, `\u00A0` non-breaking space וכו') שExcel מוסיף לתאי עברית — גורם ל-indexOf('סיכומים') להיכשל
- **תיקון**: בדיקת כותרת העמודה מחיל עכשיו `aggressiveClean(String(...))` + `normalizeForCompare()` — אותה שרשרת ניקוי שמשמשת לתוויות שורה
- שינוי נוסף: `typeof === 'string'` הוחלף ב-`!= null` + `String()` — עמודות עם כותרות לא-string (תאריך, מספר) מטופלות גם הן
- **ניקוי ערכים**: `parseFloat` מקבל `.trim()` נוסף — מנקה רווחים שנשארו אחרי replace
- שינויים: `app.js` (cfParseWorkbook — פונקציית parseSheet), `index.html` (גרסה)

### v98.4 – Top-Down Layout + Micro-labels + Forecast Line
- **סדר חדש**: cf-cards-row (סיכום חודשי) עולה מעל cf-detail-row (פירוט תנועות)
- **כותרות מקטע**: 3 תוויות `font-size:10px color:#94a3b8` — "סיכום חודשי" / "פירוט תנועות" / "מבט מצטבר"
- **"סיכום חודשי"** (`id=cf-label-summary-month`): מוסתר/מוצג יחד עם cf-cards-row בכל הפונקציות הרלוונטיות
- **padding תחתון**: הצומצם מ-40px ל-16px למניעת scroll
- **קו הפרדה בגרף** (`cfForecastDividerPlugin`): קו אנכי מקווקו (4px dash) לאחר החודש הנוכחי (`CF_CURRENT_MONTH_ID`) — הפרדת עבר/עתיד
- שינויים: `index.html` (מבנה + גרסה), `app.js` (cfUpdateCFCards + cfShowNoData + tab switching + cfRenderChart plugin)

### v98.3 – Chart Crash Protection
- **`cfSafeArr()`**: פונקציה חדשה — ממפה כל ערך בנתוני הגרף, null/undefined/NaN → 0 לפני העברה ל-Chart.js
- **Canvas Re-mount**: `cfRenderChart()` מחליף פיזית את אלמנט ה-`<canvas>` (`replaceChild`) בכל קריאה — שקוילנט Vanilla JS של React `key` prop, מונע state שבור
- **min-height קשיח**: `cf-chart-wrap` מקבל `min-height:242px` גם ב-HTML (סטטי) וגם ב-JS — מניעת קריסת Container לגובה 0
- **Empty guard**: `cfRenderChart()` מחזיר מיידית אם `months.length === 0` — מניעת Chart ריק
- שינויים: `index.html` (min-height + גרסה), `app.js` (cfSafeArr + cfRenderChart)

### v98.2 – Dynamic P&L Header Label
- `id="cf-hdr-pl-label"` נוסף לתווית ב-`index.html`
- `cfUpdateHeader()`: כותרת משתנה — שלילי → "הפסד" (`#c0394e`) | אחרת → "רווח" (`#4169e1`) | null → "רווח או הפסד"
- שינויים: `index.html` (id לתווית + גרסה), `app.js` (cfUpdateHeader)

### v98.1 – P&L Header KPI + Dynamic Colors
- **קוביית Header חדשה** `#cf-hdr-pl`: "רווח או הפסד" — שואב מ-`profit_loss` של החודש הנבחר
- **לוגיקת צבעים**: חיובי → `#4169e1` (Royal Blue) | שלילי → `#c0394e` (בורדו) | אפס → `#9ca3af` (ניטרלי)
- **טבלה**: שורת `profit_loss` מקבלת אותו צבע דינמי (Royal Blue / בורדו / ניטרלי) — לא ירוק/אדום רגיל
- שינויים: `index.html` (stat-item חדש + גרסה), `app.js` (cfUpdateHeader + cfRenderTable)

---

## שינויים אחרונים (28/03/2026)

### v97.7 – Net Color in Summary Bar
- `annNetCol` ו-`ytdNetCol` ב-`cfRenderSummary`: חיובי שונה מ-`#4ade80` (ירוק) ל-`#60a5fa` (תכלת)
- זהה לצבע "תזרים שקלי נטו" ב-Header KPI — קשר ויזואלי עקבי
- שלילי נשמר אדום (`#f87171`) לאות אזהרה
- שינויים: `app.js` (cfRenderSummary), `index.html` (גרסה)

---

### v97.6 – Cash Flow Chart Isolation
- **ניתוק תלות גרף/תחזית**: `responsive: false` ב-Chart.js — הגרף לא מגיב לשינויי DOM חיצוניים
- **מימדים מפורשים**: Canvas מקבל `width`/`height` מפורשים לפני יצירה — מונע קריסת ResizeObserver
- **ציור מחדש בטוח**: `cfToggleForecast()` מפעיל `setTimeout(cfRenderChart,0)` — הגרף משוחזר עם הנתונים ההיסטוריים לאחר שהלייאאוט מסתדר
- שינויים: `app.js` (cfRenderChart + cfToggleForecast)

### v97.6 – Login Security
- נוסף מסך כניסה עם סיסמה (SHA-256 via Web Crypto API)
- הטאבים וכל התוכן מוסתרים עד לכניסה מוצלחת (`body.locked`)
- לאחר כניסה — הסשן נשמר ב-`sessionStorage` (לא נדרש להקיש שוב בפגישה)
- שינויים: `style.css` (CSS), `index.html` (overlay HTML + class="locked"), `app.js` (לוגיקת login)

---

## היסטוריה קודמת

## שינויים אחרונים (25/03/2026)

### v75.0 – מנוע מס שולי ישראלי + ניקוי מעבדת קיבוע זכויות

**ניקוי עיגולים:**
- הוסרו sub-labels "ברוטו" / "נטו" מתוך שני העיגולים
- כיתוב נקי: "הון פטור" (כחול) / "קצבה פטורה" (ירוק) + ערך בלבד (font-size 22px)
- הוסרו elements: `pns-circle-cap-net`, `pns-circle-pen-net`

**מנוע מס הכנסה חודשי אמיתי (`pnsCalcTax`):**
- מדרגות 2025: 10%/7010 | 14%/10060 | 20%/16150 | 31%/22440 | 35%/46690 | 47%/60130 | 50%+
- קיזוז נקודות זיכוי: 544 ₪/חודש (2.25 נקודות)
- מחליף flat rate של `PNS_MARGINAL_RATE`

**בורר שיטת מס (Dropdown):**
- `<select id="pns-tax-method">` בתוך ה-slider section
- 3 אפשרויות: אוטומטי (מדרגות) | 31% קבוע | 35% קבוע
- מופעל ב-`onchange` → מפעיל מחדש את `pensionSliderChange`

**עדכון tooltip ℹ️ — מציג מדרגות מס מלאות**

## שינויים אחרונים (25/03/2026)

### v72.0 – Tax Lab Two-Column Layout & KPI Color Fix

**עימוד 2 עמודות במעבדת קיבוע זכויות:**
- עמודה ימנית (RTL): סל פטור input + תוויות + סליידר (`pns-slider-section`)
- עמודה שמאלית: שני עיגולים זה לצד זה (`flex-row`, `justify-content:center`)
- מיכל: `display:flex;gap:28px;align-items:center` (מגיב ל-flex-wrap עבור מסכים צרים)

**עיגולים גדולים יותר:**
- wrapper: 180×180px (מ-150px), עיגול: 155px (מ-120px)
- פונטים בתוך העיגול: label 11px, ערך ברוטו 17px, sub 10px, ערך נטו 14px
- פונטים מתחת לעיגול: אחוז 14px, total 12px, delta 13px

**הבדלת צבעים ב-KPI Macro Header:**
- `הון צבור` → `cls:'capital'` → `color:#a5b4fc` (violet-blue, indigo-300)
- `קצבה ברוטו` → `cls:'blue'` → `color:#7dd3fc` (sky-300 — כבעבר)
- `קצבה נטו` → `cls:'green'` → `color:#4ade80` (ירוק בוהק — כבעבר)
- colorMap הורחב: `capital`, `blue`, `green`, `muted`

## שינויים אחרונים (25/03/2026)

### v71.0 – Exemption Lab Redesign & Legacy Local Simulation

**מעבדת קיבוע זכויות:**
- **Heritage toggle הוסר** מה-Tax Lab (היה מבלבל עם מתג גלובלי דומה)
- **pns-tax-results הוסר** — הבלוקים המלבניים הכפולים (המידע כבר מוצג בעיגולים)
- **Layout מחודש**: עיגולים מעל הסליידר (`flex-direction:column`), ממורכזים
- **עיגולים גדולים**: wrapper 150px, עיגול 120px (מ-108/80px)
- **ברוטו+נטו בתוך כל עיגול**: IDs `pns-circle-cap-net`, `pns-circle-pen-net` (נטו = Placeholder = ברוטו)
- **סליידר Track**: דוקה מ-12px ל-7px (`style.css`)
- **תוויות הסליידר**: הוגדלו מ-9px ל-11px

**כרטיסיית הורשה ועיזבון:**
- **מתג עדין "ללא הראל 🔍"** נוסף בכותרת הכרטיסייה (עם tooltip המסביר שזו סימולציה מקומית)
- **`pensionLegacyToggleHarel(checked)`**: פונקציה חדשה — משנה רק את גרף העוגה ורשימת היורשים בלבד
- **`pnsLegacyExcludeHarel = false`**: global חדש
- **`pensionRenderLegacy()`** עודכן — מסנן לפי `pnsLegacyExcludeHarel` (local), לא משפיע על ה-snapshot הכללי

## שינויים אחרונים (25/03/2026)

### v70.0 – UI Fixes & Exemption Lab Upgrade

**תיקוני UI כותרת:**
- **"הראל:" label**: צבע תוקן ל-`color:white !important` — גלוי תמיד, לפני ואחרי טעינה
- **קצבה ברוטו KPI**: צבע שונה מירוק ל-כחול בהיר (#7dd3fc) — הפרדה ויזואלית מ"קצבה נטו" (ירוק בוהק)

**שדרוג מעבדת קיבוע זכויות:**
- **הגדלת סליידר**: `max-width` מ-320px ל-450px
- **סל פטור דינמי**: נוסף input עם ברירת מחדל 882,924 ₪ — ניתן לשינוי; מחובר לפונקציה `pensionBasketChange()`
- **נוסחה חדשה (v70.0)**: `הון פטור = סל × אחוז_היוון` | `קצבה פטורה = (סל × אחוז_קצבה) / 180`
- **global variable** `pnsExemptBasket = 882924` — מוזן מה-input
- **Total + Delta**: מתחת לכל עיגול מוצג "הון נטו: X₪" / "קצבה נטו: X₪" ו-"+ Y₪" (הפרש לעומת ללא פטור)
- **אלמנטים חדשים**: `#pns-cap-total`, `#pns-cap-delta`, `#pns-pen-total`, `#pns-pen-delta`

**תיקון טרמינולוגיה:**
- `אק"ע` / `אק״ע` → `אכ"ע` / `אכ״ע` (אובדן כושר עבודה) בכל מקומות התצוגה
- PNS_DETECT_KEYWORDS עודכן ל-`אכ"ע`
- פרסר: נוסף `findRow('אכ"ע')` כחיפוש ראשי; `findRow('אק"ע')` נשמר כגיבוי תאימות לאחור

## שינויים אחרונים (23/03/2026)

### v65.0 – Data Wiring, UI Refactor & Cleanup

**פעימה 1 — לוגיקת נתונים:**
- **Parser fix**: נוסף סינון עמודות סיכום — header המכיל 'ללא' או 'סיכום' מדולג (מונע ספירה כפולה של 'קצבה ללא הראל...')
- **pensionActiveAssets()**: תומך כעת בשני פילטרים — הוצאת הורשה + הוצאת הראל (כשמתג "ללא הראל" פעיל)
- **4 KPIs**: הון צבור + קצבה ברוטו מחוברים לנתוני PENSION_ASSETS; קצבה נטו מחוברת ל-Tax Lab; הכנסה פנויה placeholder

**פעימה 2 — UI/UX:**
- **View Dropdown**: כפתורי "שלי/רעיה/משותף" הוחלפו ב-`<select>` dropdown קומפקטי בצד ימין
- **מתג הראל** (עם/ללא) בבר הכהה — מופיע רק כשקיים נכס הראל; מאפשר סימולציה מהירה
- **Cards — פנסיה בלבד**: `pensionRenderCards()` מציג רק `!isRisk` — ריסקים (הראל) מוצגים בשורת ה-Cover בלבד
- **Risk Row**: ביטוח חיים מציג שם ספק הראל ספציפית; אובדן כושר = סיכום כלל הפוליסות
- **`pensionToggleHarel(exclude)`**: פונקציה חדשה — מחשבת מחדש snapshot + cards + tax

**פעימה 3 — ניקוי:**
- **Legacy/Inheritance** חזר: כרטיסיית "הורשה ועיזבון" עם pie chart + heirs list
- **Pie Placeholder**: כשאין נתוני מוטבים — עוגה אפורה (#e5e7eb) + tooltip מבוטל
- **Timeline**: placeholder "בבנייה" קיים מ-v64

### v64.0 – Pension Tab Full Architectural Refactor (PRD v64)
**index.html:**
- **בורר תצוגה ראשי**: כפתורי "שלי / רעיה / משותף" ממורכזים מעל כל התוכן — הכנה לפילטור עתידי לפי בעלים
- **Macro Dark Bar**: 4 KPIs גדולים — הון צבור | קצבה ברוטו | קצבה נטו (מ-Tax Lab) | הכנסה פנויה (placeholder)
- **שורת הגנה וסיכונים**: 3 כרטיסיות Light Mode — ביטוח חיים 🛡️ | אובדן כושר ♿ | תאונות אישיות 🏥
- **מענקי פרישה ואירועים**: Zero Noise — מוסתר אוטומטית אם אין PENSION_EVENTS
- **Tax Lab משודרג**: סליידר בולט יותר (8px track, thumb גדול), תוויות מפורטות, אייקון ℹ️ עם tooltip מדרגות מס
- **Timeline/Growth Placeholder**: חלונית עם placeholder לגרף צבירה עתידי
- הוסרה: עמודת הורשה ועיזבון (pie chart) — לא בארכיטקטורת PRD החדשה

**app.js:**
- **pensionSetView(mode)**: בורר תצוגה — מעדכן כפתורים + קוראים לכל render functions; מוכן לפילטור עתידי
- **pensionRenderSnapshot()**: מחושב 4 KPIs קבועים; קצבה נטו מוזנת מ-pnsNetMonthly global
- **pensionRenderRiskRow()**: חדש — מחשב totalLife ו-totalDisab, מרנדר שורת הגנה
- **pensionRenderCards()**: תיקון מבטחים — provider שמכיל 'מבטחים' מקבל badge "פנסיה" (לא "ביטוח מנהלים") ואייקון 🏛️
- **pensionRenderLumpsums()**: חדש — מחליף pensionRenderTimeline; Zero Noise מלא (מסתיר section אם אין events)
- **pensionSliderChange()**: מעדכן pnsNetMonthly ומקרין pensionRenderSnapshot() — KPI קצבה נטו בbar חי
- **globals חדשים**: pnsViewMode, pnsNetMonthly
- גרסה: v62.0 → v64.0

**style.css:**
- **.pns-view-toggle / .pns-view-btn**: עיצוב pill toggle מרכזי
- **.pns-risk-row / .pns-risk-item**: grid 3 עמודות, border-right צבעוני לפי סוג
- **.pns-slider-section**: רקע f8fafc עוטף את הסליידר
- **.pns-info-icon**: hover opacity
- Slider thumb גדול יותר (22px) עם shadow כחול

### v62.0 – Permanent Pension Upload Button
**index.html:**
- נוסף כפתור **"טען תכנון פרישה"** בשורת כפתורי ה-Header (לפני כפתור ה-Theme), עם class `pns-only-btn` ו-`display:none` כברירת מחדל
- הכפתור מקושר ל-`fileInput` הקיים — לחיצה = פתיחת חלון בחירת קובץ
- גרסה עודכנה: v61.0 → v62.0

**app.js:**
- **switchTab()**: נוסף טיפול ב-`.pns-only-btn` — מוצג כ-`flex` בטאב פנסיה, מוסתר בשאר הטאבים

## שינויים אחרונים (23/03/2026)

### v60.0 – Smart Upload Router Fix
**app.js:**
- **detectPensionSheet(wb)**: פונקציה חדשה — סורקת עד 35 שורות × 20 עמודות בכל גיליון לפי 10 מילות מפתח (ביטוח חיים, קצבה, ייעוד מרכזי, מקדם, מוטבים וכו'). ציון ≥ 3 → זיהוי חיובי. לא תלוי בשם הגיליון כלל.
- **pensionParseWorkbook(wb, sheetName)**: מקבל כעת שם גיליון ספציפי מה-detector; fallback לזיהוי עצמי
- **smartUploadRouter**: הפנסיה מזוהה ע"י `detectPensionSheet` לפני בדיקת CF ולפני בדיקת השקעות — קובץ פנסיה עם גיליון בשם תאריך ("20/03/2026") מזוהה כראוי
- **toast השקעות**: עודכן ל-"עודכנו נתוני השקעות" + timeout לניקוי; לא מופיע עוד לקבצי פנסיה/תזרים
- **toast שגיאה**: הודעת "לא זוהה" כוללת רשימת שמות גיליונות לדיאגנוסטיקה



## שינויים אחרונים (23/03/2026)

### v59.0 – Pension & Insurance Tab
**app.js:**
- **PENSION_ASSETS / PENSION_EVENTS / PENSION_NI**: מערכי נתונים חדשים לטאב פנסיה
- **pensionInit()**: טעינה מ-localStorage; מציג empty state אם אין נתונים
- **pensionRender()**: רנדר כולל — snapshot, cards, tax lab, legacy, timeline
- **pensionRenderSnapshot()**: שורת מאקרו Dark Mode (קצבה ברוטו, הון צבור, ביטוח חיים, אק"ע) + מתג ביטוח לאומי יחיד/זוג
- **pensionRenderCards()**: כרטיסיות מיקרו Light Mode — לולאה דינמית על PENSION_ASSETS, Zero Noise, אייקוני 🏦/🛡️
- **pensionToggleHeritage()**: מתג החרגת נכסי הורשה מחישוב הקצבה
- **pensionSliderChange()**: סליידר קיבוע זכויות — מחשב קצבה נטו והון פנוי בזמן אמת
- **pensionRenderLegacy()**: גרף עוגה (doughnut) + רשימת יורשים + קישורי מסמכים
- **pensionRenderTimeline()**: ציר זמן אירועים (bar chart + רשימה)
- **pensionParseWorkbook()**: מפרסר גיליון "ביטוח חיים ופנסיה" מ-Excel באופן דינמי
- **pensionSaveToStorage()**: שמירה ב-localStorage
- **switchTab()**: עודכן — הפרדה בין `isInv` / `isCF` / `isPns`; מסתיר אלמנטי INV בטאב פנסיה; קריאה ל-`pensionInit` בביקור ראשון
- **smartUploadRouter()**: נוסף זיהוי ראשוני לגיליון "ביטוח חיים ופנסיה" — מנותב ל-pensionParseWorkbook

**index.html:**
- **tab-pension**: הוחלף placeholder ב-HTML מלא — snapshot bar, empty state, cards grid, tax lab, legacy section עם canvas pie, timeline section
- גרסה: v58.0 → v59.0 (ממתין לאישור)

**style.css:**
- נוספו ~100 שורות CSS עבור טאב פנסיה: snapshot, cards, toggle switch, tax slider, heirs list, event rows, skeleton animation, responsive

## שינויים אחרונים (22/03/2026)

### v58.0 – USD Yotam Forecast Card
**app.js:**
- **FC_LABELS**: נוסף מפתח `yotam_usd` עם keywords: 'יותם $', 'הוצאות יותם $', 'יותם דולרי', 'הוצ יותם $' — substring match מוצא שורת הוצאות יותם דולריות בעמודת הסיכומים
- **cfRenderForecast**: נוספת כרטיסיית 'יותם $' בצבע כתום (#ea580c), ממוקמת הכי שמאל בגוש ההוצאות (אחרי 'שונות', לפני קו המפריד האנכי)
- **Zero Noise**: הכרטיסייה מוצגת רק אם val > 0 — תופיע ב-2025 (ערך 251) ותוסתר ב-2026 אוטומטית

**index.html:**
- תגית גרסה: `v57.0` → `v58.0`

### v57.0 – Cashflow Empty State UI Fix
**app.js:**
- **cfShowNoData()**: שופרה מהותית — במקום מסך ריק, מציגה UI שלד יציב:
  - **Row 2** (`cf-detail-row`): כרטיסייה לבנה עם "סעיפים מחכים לנתונים" + ערך "0"
  - **Summary bar** (`cf-summary-row`): תמיד מוצג עם שנתי + YTD מציגים "0", כולל כפתור תחזית
  - **Row 3** (`cf-cards-row`): מנוקה ומוסתר
  - **טבלה / גרף / header stats**: מנוקים כרגיל
- **גרסת localStorage**: עודכנה מ-'56.0' ל-'57.0'
- **console.log**: עודכן ל-V57.0

**index.html:**
- תגית גרסה: `v56.2` → `v57.0`
- תגובה בראש הקובץ: `<!-- v56.2 -->` → `<!-- v57.0 -->`

## שינויים אחרונים (22/03/2026)

### v56.0 – Uniform UI & Clean Initial State
**app.js:**
- **CRITICAL BUG FIX — localStorage**: `loadCFFromLocalStorage` השתמש בבדיקה `savedVer !== '41.0'` שגרמה למחיקת נתוני CF בכל refresh (כי גרסה נשמרה כ-'55.0' אך הבדיקה דרשה '41.0'). תוקן ל-`parseFloat(savedVer) < 41` — כל גרסה >= 41 מתקבלת. מעתה נתוני תזרים נשמרים בין רענונים!
- **כפתור תחזית**: עיצוב עוצב מחדש — זהה לכפתורי Header (רקע לבן 15%, מסגרת לבנה, border-radius:8px, padding:7px 14px, font-size:12px)

**index.html:**
- **טאב ברירת מחדל**: שונה מ-'השקעות' ל-'תזרים שוטף' — `active` class הועבר לכפתור ול-panel של cashflow

## שינויים אחרונים (22/03/2026)

### v55.0 – Persistent Forecast State
**app.js:**
- **cfSyncForecastBtn()**: פונקציה חדשה — בודקת `panel.style.display` ומעדכנת טקסט כפתור לְ-'הסתר/הצג' בהתאם
- **cfRenderSummary**: קריאה ל-`cfSyncForecastBtn()` בסוף הרינדור — מונע איפוס טקסט הכפתור ל-'הצג' גם אם המגירה פתוחה
- תוצאה: ניתן להשאיר מגירה פתוחה, לזפזפ בין 2025/2026, ולראות מספרים מתחלפים עם כפתור נכון

## שינויים אחרונים (22/03/2026)

### v54.0 – Dynamic Year Sync, Visa & Visual Separation
**app.js:**
- **CRITICAL: סנכרון דינמי תחזית**: `cfSelectYear` ו-`cfGoToday` מפעילים `cfRenderForecast()` מיידית אם המגירה פתוחה — מעבר 2025↔2026 מרענן נתונים בזמן אמת
- **FC_LABELS matching**: שמות שאינם LAST_KEYS עברו מ-exact match ל-substring match — תומך ב-'חיוב ויזה מחודש קודם' וכדומה; נוסף alias מפורש; LAST_KEYS נשארים exact
- **כרטיסיית ויזה**: נוספה כרטיסייה 'ויזה' במגירת התחזית, ממוקמת ראשונה בגוש ההוצאות
- **הפרדה ויזואלית**: 3 גושים ברורים בשורת התחזית — הכנסות | (קו) | הוצאות | (קו) | תזרים; `flex-wrap:nowrap` + `overflow-x:auto`

## שינויים אחרונים (22/03/2026)

### v52.0 – Year-Sync Bug & Final Polish
**app.js:**
- **CRITICAL BUG FIX — CF_FORECAST_BY_YEAR**: במקום גלובל יחיד `CF_FORECAST`, כעת `CF_FORECAST_BY_YEAR = {2025: {...}, 2026: {...}}`. כל גיליון שנה שומר נתוני סיכומים לשנה שלו בלבד — ללא דריסה הדדית
- **cfRenderForecast**: קורא מ-`CF_FORECAST_BY_YEAR[displayYear]` — מסונכרן לשנה שנבחרה בבורר. בעת מעבר בין 2025 ל-2026, מספרי התחזית משתנים בהתאם
- **שם כרטיסייה**: 'משכורת שנתית' → 'משכורת שקלית' במגירת התחזית
- **Typography Summary Bar**: `font-size:22px;font-weight:800` → `font-size:18px;font-weight:600` (נקי, לא צועק)

**index.html:**
- `cf-summary-row` + `cf-detailed-forecast`: margin-bottom: 20px → 8px (מרווחים צמצומים)

## שינויים אחרונים (22/03/2026)

### v51.0 – Dynamic Labels, Smart Tooltips & Modal Notes
**app.js:**
- **cfRenderKPI (Row 2)**: other_exp ו-other_exp_2 — כרטיסיות נפרדות; שם דינמי מעמודת הערות (אם note הוא string לא-מספרי → כותרת הכרטיסייה, אחרת 'הוצ. שונות')
- **cfUpdateCFCards (Row 3)**: Tooltip חכם עם שמות דינמיים; מציג רק סעיפים עם val>0 (Zero Noise); פורמט: "יותם: 62, יעל: 5, MacBook: 6"
- **cfTogglePrivacy → cfOpenNotesModal + cfCloseNotesModal**: הערות כעת מוצגות בחלון קופץ (Modal) — position:fixed, z-index:1000, backdrop כהה, כפתור X, סגירה בלחיצה מחוץ
- **גרסה**: v50.0 → v51.0

## שינויים אחרונים (22/03/2026)

### v50.0 – Golden Jubilee & Clean Data
**app.js:**
- **cfRenderKPI (Row 2)**: 'הוצ. שונות' = other_exp + other_exp_2 מחוברים (במקום OR) — מוצגים ביחד כשניהם קיימים
- **cfRenderForecast**: הסרת spacer; הוספת FDIV (קו אנכי עדין) לפני קבוצת כרטיסיות תזרים; כל כרטיסיות בשורה רציפה אחת
- **CRITICAL DATA FIX**: כרטיסיות תזרים בתחזית — ערכים גולמיים בלבד מ-CF_FORECAST, ללא שום sum/reduce
- **גרסה**: v49.0 → v50.0

**index.html:**
- `cf-summary-row`: margin-bottom שונה מ-0 ל-20px (ריווח קבוע לפני גרף)
- גרסה בכותרת: v49.0 → v50.0

## שינויים אחרונים (22/03/2026)

### v49.0 – Layout Perfection & Forecast Fix
**app.js:**
- **FC_LABELS last-match**: תזרים שקלי נטו / תזרים שוטף / רווח-הפסד — last-match בלבד (שורות סיכום אחרונות) → ערכים: 280 / 311 / 341
- **cfRenderKPI (Row 2)**: 'יותם' ו-'הוצ. שונות' — כרטיסיות נפרדות (לא מאוחדות)
- **cfUpdateCFCards (Row 3)**: כרטיסייה מאוחדת 'הוצאות שונות' = יותם+other_exp+other_exp_2 עם tooltip פירוט
- **cfRenderForecast**: שורה אחת עם spacer → כרטיסיות תזרים נדחפות שמאלה; margin-bottom: 20px

**index.html:**
- `cf-detailed-forecast`: margin-bottom שונה מ-12px ל-20px
- גרסה בכותרת: v48.0 → v49.0

## שינויים אחרונים (22/03/2026)

### v48.0 – Data Locking & Forecast Fix
**app.js:**
- **FC_LABELS**: נוסף `cashflow_total` ('תזרים שוטף'), נוסף 'הוצאות יותם' כ-alias ל-yotam
- **cfRenderKPI**: chip עם פרמטר tooltip; 'יותם + שונות' — כרטיסייה מאוחדת עם tooltip פירוט (יותם: X | שונות: Y); כרטיסיות נפרדות הוסרו
- **cfRenderForecast**: יותם ושונות כרטיסיות נפרדות (62 + 11 בנפרד); שורה תחתונה: תזרים שקלי נטו + תזרים שוטף + רווח/הפסד ביחד
- **Data Locking**: כל הנתונים ממשיכים להגיע מעמודת 'סיכומים' בלבד דרך FC_LABELS

**לאימות בConsole:**
- `[v47 FORECAST] yotam → row X | val: 62`
- `[v47 FORECAST] other_exp → row X | val: 11`
- `[v47 FORECAST] loans → row X | val: 30`

## שינויים אחרונים (22/03/2026)

### v47.0 – UI Harmony & Forecast Data Fix
**app.js:**
- **תיקון קריטי — נתוני סיכומים**: סריקת תוויות ישירה לעמודת 'סיכומים' (FC_LABELS) — לא תלויה ב-ROW_MAP, מוצאת כל מפתח לפי שם עברי מדויק
- **כפתור תחזית**: עיצוב pill עגול דומה לכפתורי Header; toggle text: "🔮 הצג תחזית" ↔ "🔮 הסתר תחזית"; יישור אנכי מרכזי
- **cfRenderKPI**: שינוי מכרטיסיות כהות → כרטיסיות לבנות עם גבול צבעוני ימני (border-right); רקע f8fafc
- **cfRenderForecast**: כל הכרטיסיות בשורה אחת (flex-wrap), כרטיסיות לבנות עם גבול סגול עדין, Zero Noise (val=0 → לא מוצג), נטו חזוי בולט בתחתית

## שינויים אחרונים (22/03/2026)

### v46.0 – Forecast Panel & UI Polish
**app.js:**
- **CF_FORECAST**: גלובל חדש — שומר נתוני עמודת סיכומים
- **parseSheet**: עמודת 'סיכומים' נקראת כעת (במקום להידלג) → שומרת ב-CF_FORECAST: salary, rent_income, visa, cash_exp, loans, yotam, other_exp, other_exp_2, profit_loss
- **cfRenderNotesPanel**: הצגת הערות לחודש הנבחר בלבד (לא כל ההיסטוריה)
- **cfRenderSummary**: כפתור '🔮 תחזית' נוסף לצד שמאל של שורת הסיכומים
- **cfToggleForecast()**: toggle חדש — פותח/סוגר את cf-detailed-forecast
- **cfRenderForecast()**: בונה פאנל עם 3 קבוצות: הכנסות / הוצאות / נטו חזוי

**index.html:**
- כפתור סטטי הוסר — נמצא עכשיו בתוך JS בשורת הסיכומים
- cf-detailed-forecast: נוקה מתוכן זמני, עוצב מחדש

## שינויים אחרונים (22/03/2026)

### v45.0 – Logical Layout & Header Fix
**app.js — cfUpdateHeader:**
- Label "נטו — [חודש]" → "תזרים שקלי נטו" (קבוע)
- Sub-label ממשיך להציג את שם החודש
- נטו = inc - exp (שקלי בלבד, בלי profit_loss מהאקסל)
- צבע נטו: `#60a5fa` (כחול) תמיד, ללא green/red

**index.html — layout reorder:**
- סדר חדש מלמעלה למטה: dark chips → white cards → summary bar → forecast → chart
- הוסר: cf-summary-row מהמקום הישן (לפני chips)
- נוסף: כפתור "🔮 תחזית שנתית" (toggle)
- נוסף: `cf-detailed-forecast` container (מוסתר כברירת מחדל, מציג "טוען נתוני תחזית...")

## שינויים אחרונים (22/03/2026)

### v44.0 – Aggregated Miscellaneous Fix
**app.js — cfUpdateCFCards:**
- כרטיסיית "הוצאות שונות 2" הוחלפה בכרטיסייה מאוחדת "הוצאות שונות"
- ערך = other_exp + other_exp_2 (סכום כל השורות)
- Zero Noise: מוסתרת אם הסכום = 0 (ממנגנון הקיים `val === 0 → return ''`)

## שינויים אחרונים (22/03/2026)

### v43.0 – Missing Key Fix
**app.js:**
- **הסרת total_income מ-KEY_LABELS ומ-IRON_KEYS**: הפונקציה לא מחפשת יותר שורה שלא קיימת
- **הסרת total_income מאזהרות MISSING KEY**: לא עוד `[v43 MISSING KEY] total_income`
- **cfGetDefaultMonthId שלבים 1,2,4**: בודק salary>0 || total_exp>0 במקום total_income
- **cfGetLastRealMonth fallback**: בודק salary>0 || total_exp>0 בלבד
- **buildCFContext**: inc = salary + rent_income (חישוב דינמי)
- **טבלה — שורת total_income**: מוצגת ערך מחושב מ-cfCalcIncome() (salary+rent+other+buffer)
- **smartUploadRouter logs**: הכנסות מחושבות מ-cfCalcIncome
- `localStorage version`: '42.0' → '43.0'

**לאחר העלאה — לאבחן בדפדפן:**
1. טען אקסל → בדוק Console: אין `[v43 MISSING KEY]` כלל
2. ראה `console.table` — salary ו-total_exp אמורים להציג מספרים אמיתיים
3. בדוק Header: הכנסות = salary + שכר דירה, הוצאות = total_exp

## שינויים קודמים (22/03/2026)

### v42.0 – Atomic Data & Month Fix
**app.js — תיקונים:**
- **Iron Keys pass**: עדכון להשתמש ב-`aggressiveClean()` (כמו Pass 1) — מסיר תווים נסתרים לפני השוואה
- **INDEX FALLBACK**: אם המיפוי הדינמי נכשל, ממפה לפי שורות קבועות יחסית ל-HEADER_ROW:
  - salary → HEADER_ROW + 1
  - rent_income → HEADER_ROW + 2
  - total_exp → HEADER_ROW + 7
- **cfGetDefaultMonthId Step 3**: תוקן — כעת בודק `salary.val > 0 || total_exp.val > 0` לפני החזרה; לא חוזר לדצמבר ריק
- **cfGetLastRealMonth fallback**: תוקן — `!== null` → `> 0`; מונע זיהוי חודש עם val=0 כחודש נוכחי
- **console.table**: הוספת לוג טבלאי של שורות החודש הנוכחי בטעינת אקסל (לדיאגנוסטיקה)
- `localStorage version`: '41.0' → '42.0'

**לאחר העלאה — לאבחן בדפדפן:**
1. פתח DevTools (F12) → Console
2. טען את קובץ התזרים
3. חפש `[v42 PRIORITY]` — salary, salary_usd, rent_income
4. חפש `[v42 INDEX FALLBACK]` — האם הופעל?
5. ראה `console.table` עם שורות החודש הנוכחי — בדוק שהמספרים נכונים

## שינויים קודמים (22/03/2026)

### v41.0 – Data Wiring Fix
**app.js — תיקון פרסור אקסל:**
- `normalizeForCompare()`: נוספו U+200E, U+200F (LTR/RTL marks) + U+202A-202F (directional formatting) שExcel מוסיף לטקסט עברי — גרמו לכשל שקט בהשוואה
- **PRIORITY PASS חדש**: העברה ראשונה עם EXACT MATCH לפני הסריקה הכללית:
  - 'משכורת שקלית' / 'משכורת שקל' → salary
  - 'משכורת דולרית' → salary_usd
  - 'שכר דירה' → rent_income
  - מונע false-match של שם ישן ('הכנסה ממשכורת') בשורה אחרת
- `KEY_LABELS.salary`: 'משכורת שקלית' ו-'משכורת שקל' **קודמים** ל-'הכנסה ממשכורת'
- **לוג סיכום** אחרי הסריקה: `console.log('[v41 ROW_MAP FINAL]', ...)` + אזהרה על מפתחות חסרים
- `localStorage version`: '40.0' → '41.0'

**לאחר העלאה — לאבחן בדפדפן:**
1. פתח DevTools (F12) → Console
2. טען את קובץ התזרים
3. חפש `[v41 PRIORITY]` — אמור להציג salary, salary_usd, rent_income
4. חפש `[v41 MISSING KEY]` — אם מופיע, המפתח לא נמצא בגיליון

## שינויים קודמים (22/03/2026)

### v40.0 – Hard-Coded Labels Fix
**app.js:**
- `cfUpdateHeader()`: הוספת fallback לחישוב הוצאות — אם total_exp.val=null, מחשב מרכיבים (cfCalcExp)
- `cfGetLastRealMonth()`: fallback רב-שלבי — מאתר חודש לפי total_income / salary / total_exp (גמיש כשמיפוי חסר)
- KPI chip: 'משכורת' → 'שקלית' (מבחין מ'משכ$')
- localStorage version: '39.1' → '40.0'

**לוגיקה סופית ומאומתת:**
- Header הכנסות = salary.val ('משכורת שקלית') + rent_income.val ('שכר דירה')
- Header הוצאות = total_exp.val ('סה"כ הוצאות שקלי') → fallback: cfCalcExp()
- כרטיסייה 'משכורת כוללת' = salary.val + salary_usd.val ('משכורת דולרית')

### v39.1 – Naming Fix
**app.js:**
- `KEY_LABELS.total_exp`: נוסף 'סה"כ הוצאות שקלי', 'סה״כ הוצאות שקלי' (IRON_KEY — EXACT MATCH חייב ערך מפורש)
- `localStorage version`: '39.0' → '39.1'

### v39.0 – Accurate Salaries & Flexible Expenses

**index.html:**
- גרסה עודכנה: `v38.0` → `v39.0`
- גרף תזרים: גובה 220px → 242px (+10%)

**app.js:**
- `KEY_LABELS.salary`: נוסף 'משכורת שקלית', 'משכורת שקל' לתמיכה בשמות עמודות חדשים באקסל
- `KEY_LABELS.salary_usd`: נוסף 'משכורת דולרית'
- `KEY_LABELS.other_exp`: עדכון סדר — 'הוצאות שונות 1' קודם, נוסף 'other_exp_2' ← 'הוצאות שונות 2'
- `CF_EMPTY_ROWS`: נוסף 'other_exp_2'
- `cfCalcExp()`: מחשב גם `other_exp_2`
- `cfRenderChart()`: charigV כולל גם `other_exp_2`
- `cfRenderKPI()`: chip 'חריג 2' ל-other_exp_2; הוצ$ צבוע '#fca5a5' (ורוד עדין כמו Slim Bar)
- `cfUpdateCFCards()`: כרטיסיית 'הוצאות שונות 2' דינמית (מוסתרת אם 0)
- `cfRenderTable()` ROWS: salary label → 'משכורת שקלית'; other_exp → 'הוצאות שונות 1'; נוסף other_exp_2 (optional — מוסתר אם אין נתונים)
- `ROW_LABELS`: salary → 'משכורת שקלית', other_exp → 'הוצאות שונות 1', נוסף other_exp_2
- `localStorage version`: '38.0' → '39.0'

## שינויים קודמים (21/03/2026)

### v26.0 – Emergency Fix & AI Integration

**index.html:**
- `cf-cp`: נוסף פאנל צ'אט ייעודי לטאב תזרים שוטף (סגנון דומה ל-`#cp` של השקעות)
- כפתור 💬 נוסף לשורת הכפתורים של תזרים שוטף (cf-only-btn)
- גרסה: `v25.0` → `v26.0`

**app.js:**
- `cfRenderKPI()`: תוקן — `flex-wrap:wrap` במקום `nowrap` (מונע קריסת layout)
- `buildCFContext()`: פונקציה חדשה — בונה קונטקסט מ-CF_DATA לכל החודשים (2025+2026) עם הכנסות/הוצאות/נטו/פירוט
- `toggleCFChat()`: פתיחה/סגירה של פאנל הצ'אט
- `addCFMsg()`: הוספת הודעה לצ'אט
- `sendCFChat()`: שולח שאלה ל-API עם קונטקסט התזרים המלא
- גרסת localStorage: `'25.0'` → `'26.0'`

### v25.0 – Final UI Consolidation

**index.html:**
- `cf-summary-row`: שונה ל-2 עמודות (`1fr 1fr`) — תחזית לסוף שנה | ביצוע בפועל YTD
- גרסה בג׳ יפ עודכנה: `v24.0` → `v25.0`

**app.js:**
- `cfUpdateHeader()`: כותרת "מציג: X" — לבן כשמוצג החודש הנוכחי, צהוב (#fbbf24) כשנבחר חודש אחר
- `cfRenderSummary()`: 2 כרטיסיות רחבות בלבד:
  - ימין: "תחזית לסוף שנה [שנה]" — הכנסות/הוצאות/נטו inline, צבעים מוטמים
  - שמאל: "ביצוע בפועל YTD" — צבעוני, אותו סגנון כמו v24 רק רחב יותר
- `cfRenderKPI()`: שורה אחת בלבד (flex-wrap:nowrap), ללא כותרות מקטעים, מפריד אנכי בין קבוצות, פונטים 10px/12px
- גרסת localStorage עודכנה: `'24.0'` → `'25.0'`

## שינויים קודמים (21/03/2026)

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
