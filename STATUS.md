# סטטוס פרויקט

## שלב נוכחי
גרסה v103.43 — tooltip מצומצם, יהלום סיום הלוואה, ניקוי UX (11/04/2026).

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
