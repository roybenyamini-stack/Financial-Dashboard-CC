# Audit Report — Keren Hishtalmut Tax Logic
**Generated:** 2026-06-13T15:31:54.345Z
**Mode:** STUB (no AUDIT_API_KEY set — no real API call was made)

---
## [STUB — no API key set]

To run a real audit, set the AUDIT_API_KEY environment variable:
```
AUDIT_API_KEY=sk-... node run_audit.js
```

## Prompt that would be sent to auditor:

```
You are a strict financial compliance auditor specializing in Israeli tax law.
Your job is to verify that the JavaScript code below correctly implements the rules provided.

## RULES
# Israeli Tax Rules: Keren Hishtalmut
1. Layers: The balance consists of Exempt Principal (deposits up to ceiling), Exempt Profit, Taxable Principal (deposits above ceiling), and Taxable Profit.
2. Tax Rate: Only the "Taxable Profit" is taxed upon withdrawal, at a rate of 25% REAL Capital Gains Tax (מס רווחי הון ריאלי).
3. Real Tax Logic: Nominal Profit minus Inflation Adjustment (Inflation rate * Taxable Principal). If Real Profit <= 0, tax is 0.
4. UI Heuristic: If exact historical data (Exempt vs. Taxable) is missing from an annual report, assume all is taxable, but boldly flag the calculation in the UI with a "Low Confidence" warning. Prompt the user to "Upload Annual Report PDF" or manually enter the exact Exempt/Taxable split for high accuracy.


## CODE UNDER AUDIT (extracted from app.js)
```javascript
34: const LABELS = ['ינו׳ 25','פבר׳ 25','מרץ 25','אפר׳ 25','מאי 25','יוני 25','יולי 25','אוג׳ 25','ספט׳ 25','אוק׳ 25','נוב׳ 25','דצמ׳ 25','ינו׳ 26','פבר׳ 26','מרץ 26'];
35: 
36: // v56.2: כל מערכי data אופסו — הנתונים האמיתיים נטענים בלעדית מ-localStorage (העלאת אקסל קודמת)
37: const _Z = Array(15).fill(null); // 15 חודשים: ינו׳25–מרץ26
38: const FUNDS = {
39:   'אשקהש39905556':       { name:'א״ש ק״הש 39905556',      cat:'hishtalmut', data:[..._Z] },
40:   'אשקהש6730513':        { name:'א״ש ק״הש 6730513 ← מיטב 442504', cat:'hishtalmut', transferred:true, data:[..._Z] },
41:   'אשקהש40035706':       { name:'א״ש קה״ש 40035706',       cat:'hishtalmut', data:[..._Z] },
42:   'מורקהש499293':        { name:'מור קה״ש 499293 ← מיטב 443195', cat:'hishtalmut', transferred:true, data:[..._Z] },
43:   'מיטבקהש912-443286':   { name:'מיטב קה״ש 912-443286', cat:'hishtalmut', data:[..._Z] },
44: 
45:   '6730511אשגמל':        { name:'א״ש גמל 6730511 ← מור 1428298', cat:'gemel', data:[..._Z] },
46:   'מורגמל1375900':        { name:'מור גמל 1375900', cat:'gemel', data:[..._Z] },
47:   'אשגמל39774495':       { name:'א״ש גמל 39774495 ← מור 1375688', cat:'gemel', data:[..._Z] },
48:   '6730512אשגמל':        { name:'א״ש גמל 6730512 ← מור 1375888', cat:'gemel', data:[..._Z] },

...

61:   'דירה': { name:'דירה', cat:'dira', data:[..._Z] },
62:   'מזומןשקלי':   { name:'מזומן שקלי',   cat:'mezuman', data:[..._Z] },
63:   'מזומןדולרי':  { name:'מזומן דולרי $', cat:'mezuman', data:[..._Z] },
64:   'מיטבשקלית':   { name:'מיטב קרן כספית', cat:'mezuman', data:[..._Z] },
65:   // ── יעל ──
66:   'יעלקהש':        { name:'ק״הש – יעל',         cat:'hishtalmut', owner:'yael', liquidity:'age64',  data:[..._Z] },
67:   'יעלגמל':        { name:'גמל – יעל',           cat:'gemel',      owner:'yael', liquidity:'pension', pensionMonthly:true, data:[..._Z] },
68:   'יעלגמלהשקעה':   { name:'גמל להשקעה – יעל',    cat:'gemel_invest',owner:'yael', liquidity:'now',   data:[..._Z] },
69:   'יעלפוליסה':     { name:'פוליסת חיסכון – יעל', cat:'harel',      owner:'yael', liquidity:'now',   data:[..._Z] },
70: };
71: 
72: const CAT_COLORS = { mezuman:'#0891b2', chov:'#94a3b8', arbitrage:'#0d9488', dira:'#a8a29e', hishtalmut:'#fca5a5', gemel:'#fcd34d', gemel_invest:'#6ee7b7', harel:'#fde68a', meitav:'#c4b5fd', all:'#2563eb' };
73: const CAT_NAMES  = { mezuman:'מזומן', chov:'חוב', arbitrage:'ארביטראז׳ ואליו', dira:'דירה', hishtalmut:'קרנות השתלמות', gemel:'קופות גמל', gemel_invest:'גמל להשקעה', harel:'פוליסות חיסכון', meitav:'מיטב', all:'סה״כ כל הקטגוריות' };
74: const FUND_COLORS = {
75:   'מזומןשקלי': '#0891b2',
76:   'מזומןדולרי': '#0891b2',
77:   'מיטבשקלית': '#0891b2',
78:   'אשקהש39905556': '#16a34a',

...

158:     if (existing) existing.destroy();
159:   });
160: 
161:   // --- Donut 1: by product type ---
162:   var typeDefs = [
163:     { label:'קרן השתלמות',   color:'#fca5a5', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='hishtalmut';   }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
164:     { label:'קופת גמל',      color:'#fcd34d', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='gemel';         }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
165:     { label:'פוליסת חיסכון', color:'#fde68a', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='harel';         }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
166:     { label:'גמל להשקעה',    color:'#6ee7b7', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='gemel_invest';  }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
167:   ];
168:   var typeTotal = typeDefs.reduce(function(s,d){ return s+d.val; }, 0);

...

226:     if (tableBtn) { tableBtn.disabled = false; tableBtn.style.opacity = ''; tableBtn.style.cursor = 'pointer'; }
227:   }
228: }
229: 
230: // Category totals (for table display - includes all funds initially, rebuilt by rebuildInvTotals on view switch)
231: const CAT_TOTALS = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
232: LABELS.forEach((_, i) => {
233:   Object.entries(CAT_TOTALS).forEach(([cat, arr]) => {
234:     const vals = Object.values(FUNDS).filter(f => f.cat===cat && (!f.owner||f.owner==='roee')).map(f => f.data[i]||0);
235:     arr.push(vals.reduce((a,b)=>a+b,0));
236:   });

...

244: 
245: // CAT_CHART_TOTALS: forward-fill each fund BEFORE summing category
246: // v103.10: subtract cumulative Column K deposits from each balance point → organic growth curve
247: function buildCatChartTotals() {
248:   var filterFn = invFundFilter();
249:   const totals = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
250:   const lastIdx = LABELS.length - 1;
251:   Object.entries(totals).forEach(([cat, arr]) => {
252:     // v103.10-Investments-v2: exclude funds with 0 forward-filled balance at latest index (inactive/closed funds)
253:     const fundEntries = Object.entries(FUNDS).filter(([,f]) => {
254:       if (f.cat !== cat || !filterFn(f)) return false;

...

508: setTimeout(() => { if(chart) chart.resize(); }, 100);
509: 
510: // Base Jan 2025 values for % calculations
511: const BASE = {
512:   mezuman: 0, // לא נמדד
513:   hishtalmut: 3459, // excluding active fund
514:   gemel: 1058,
515:   gemel_invest: 731, // 650 + הפקדה 81k (פבר' 2025)
516:   harel: 6149, // 6679 - 530 (מיטב)
517:   meitav: 569, // 530 מיטב קרנות + 39 טרייד
518: };
519: // Funds excluded from % (external/active) per category
520: const EXCLUDE_FROM_PCT = {
521:   mezuman: [],
522:   hishtalmut: ['מיטבקהש912-443286'],
523:   gemel: ['הפניקסגמל926-084678'],
524:   gemel_invest: [],
525:   harel: ['הראלכללי109062745'],
526:   meitav: [],
527: };

...

551:   const filteredFunds = Object.values(FUNDS).filter(invFilter);
552:   // v97.1: find endIdx using only the funds visible in current view
553:   while (endIdx > 0 && filteredFunds.every(f => f.data[endIdx] === null || f.data[endIdx] === undefined)) endIdx--;
554:   // v103.7: check if there is ANY real data — if not, show clean empty state
555:   const hasAnyData = filteredFunds.some(f => f.data.some(v => v !== null && v !== undefined && v > 0));
556:   const cats = ['mezuman','hishtalmut','gemel','gemel_invest','harel','meitav','arbitrage','dira','chov'];
557:   const el = id => document.getElementById(id);
558:   const endLabel = hasAnyData ? LABELS[endIdx] : null;
559: 
560:   const catTotals = {}, catMeasured = {};
561:   cats.forEach(cat => {

...

1187:         if (prev === null || prev === 0) { td.textContent = '—'; }
1188:         else {
1189:           const delta = v - prev;
1190:           const colKVal = (i < _colKArr.length) ? _colKArr[i] : null;
1191:           const isTalush = (typeof colKVal === 'string' && colKVal.indexOf('תלוש') >= 0);
1192:           // colKVal as number = deposit (+) or withdrawal (-) in K
1193:           const isMovement = (typeof colKVal === 'number' && colKVal !== 0);
1194: 
1195:           if (isTalush) {
1196:             // גידול בהון — absolute change only, no yield %
1197:             const cls = delta > 0 ? 'dpos' : (delta < 0 ? 'dneg' : 'dzer');
1198:             td.innerHTML = `<span class="${cls} dval">${delta > 0 ? '+' : ''}${Math.round(delta).toLocaleString()}</span>`;
1199:           } else if (isMovement) {
1200:             // v103.1: net yield after deposit/withdrawal
1201:             // Net return = delta - movement (movement is already signed: + deposit, - withdrawal)
1202:             const netDelta = delta - colKVal;
1203:             const netPct = prev > 0 ? (netDelta / prev * 100).toFixed(1) : '0.0';
1204:             const cls = parseFloat(netPct) >= 0 ? 'dpos' : 'dneg';
1205:             const movAbs = Math.abs(Math.round(colKVal)).toLocaleString();
1206:             const movLabel = colKVal < 0 ? 'משיכה' : 'הפקדה';

...

2015:   simDomain += 'משתמש 2: ' + SIM_USER2_NAME + ' | נולד: ' + SIM_BIRTH_YEAR_YAEL + ' | פרישה גיל ' + SIM_RETIREMENT_AGE_YAEL + ' (' + simUser2RetYear + ')\n';
2016:   simDomain += 'קרן פנסיה: ' + SIM_PENSION_FUND_NAME + ' | קרן חיסכון: ' + SIM_SAVINGS_FUND_NAME + '\n';
2017:   // v168.69: activeParameters block — AI must use these values, not internal assumptions
2018:   simDomain += '\n--- activeParameters (ערכי סליידרים פעילים) ---\n';
2019:   simDomain += 'תשואה שנתית (SIM_RATE): ' + SIM_RATE + '%\n';
2020:   simDomain += 'אינפלציה (SIM_INFLATION): ' + SIM_INFLATION + '%\n';
2021:   simDomain += 'גדילת נדל\"ן (SIM_RE_GROWTH_RATE): ' + SIM_RE_GROWTH_RATE + '%\n';
2022:   simDomain += 'מס רווח הון (SIM_CAPITAL_TAX): ' + SIM_CAPITAL_TAX + '% (מוחל ישירות על שיעור הגדילה — תשואה נטו אפקטיבית: ' + (SIM_RATE * (1 - SIM_CAPITAL_TAX / 100)).toFixed(2) + '%)\n';
2023:   simDomain += 'תשואת פרישה (pnsRetirementYield): ' + pnsRetirementYield + '%\n';
2024:   simDomain += 'הוצאה חודשית יעד: ' + SIM_TARGET_EXP + ' \u20aa | שכר מדריך (שלב 2): ' + SIM_INSTRUCTOR_SAL + ' \u20aa\n';
2025:   simDomain += 'קצבה חודשית (שלב 3): ' + SIM_PENSION_MONTHLY + ' \u20aa | הכנסת שכירות: ' + SIM_RENTAL_INCOME + ' \u20aa/חודש\n';

...

2342:     if(mi.length>=2) return fmt(fund.name,fund.data[mi[0]]||0,fund.data[mi[1]]||0,LABELS[mi[0]],LABELS[mi[1]]);
2343:     if(yf>=0||isChg) { var fi=yf>=0?yf:0,ti=yt>=0?yt:LABELS.length-1; return fmt(fund.name,fund.data[fi]||0,fund.data[ti]||0,LABELS[fi],LABELS[ti]); }
2344:     if(mi.length===1) return fund.name+' ב'+LABELS[mi[0]]+': '+(fund.data[mi[0]]!=null?fund.data[mi[0]].toLocaleString()+' אלפי ש"ח':'אין נתון');
2345:     return fmt(fund.name,fund.data[0]||0,fund.data[LABELS.length-1]||0,LABELS[0],LABELS[LABELS.length-1]);
2346:   }
2347:   var cats = {'hishtalmut':['השתלמות'],'gemel':['קופות גמל','קופת גמל','גמל'],'gemel_invest':['גמל להשקעה'],'harel':['הראל'],'meitav':['מיטב'],'mezuman':['מזומן'],'arbitrage':['ארביטראז'],'dira':['דירה'],'chov':['חוב']};
2348:   for(var cat in cats) {
2349:     if(cats[cat].some(function(kw){return q.indexOf(kw)>=0;})) {
2350:       if(mi.length===1&&!isChg&&yf<0) return CAT_NAMES[cat]+' ב'+LABELS[mi[0]]+': '+Math.round(catSum(cat,mi[0])).toLocaleString()+' אלפי ש"ח';
2351:       if(isChg||yf>=0) { var fi2=yf>=0?yf:(mi[0]!=null?mi[0]:0),ti2=yt>=0?yt:(mi[1]!=null?mi[1]:LABELS.length-1); return fmt(CAT_NAMES[cat],catSum(cat,fi2),catSum(cat,ti2),LABELS[fi2],LABELS[ti2]); }
2352:       return fmt(CAT_NAMES[cat],catSum(cat,0),catSum(cat,LABELS.length-1),LABELS[0],LABELS[LABELS.length-1]);
2353:     }
2354:   }
2355:   if(q.indexOf('תשואה')>=0||q.indexOf('ביצועים')>=0) {
2356:     var fi3=yf>=0?yf:0,ti3=yt>=0?yt:LABELS.length-1,lines=[];
2357:     ['hishtalmut','gemel','gemel_invest','harel','meitav'].forEach(function(c){var v1=catSum(c,fi3),v2=catSum(c,ti3),d=v2-v1,p=v1>0?(d/v1*100).toFixed(1):'—';lines.push(CAT_NAMES[c]+': '+(d>=0?'+':'')+p+'%');});
2358:     return 'תשואה '+LABELS[fi3]+' – '+LABELS[ti3]+':\n'+lines.join('\n');
2359:   }
2360:   if(q.indexOf('סך')>=0||q.indexOf('סה"כ')>=0||q.indexOf('תיק')>=0||q.indexOf('כולל')>=0) {
2361:     if(mi.length===1) return 'סה"כ תיק ב'+LABELS[mi[0]]+': '+Math.round(ALL_TOTALS[mi[0]]).toLocaleString()+' אלפי ש"ח';
2362:     var fi4=yf>=0?yf:0,ti4=yt>=0?yt:LABELS.length-1;

...

3160:           var cat = null;
3161:           for (var sc = 0; sc < row.length; sc++) {
3162:             if (sc === ownerColIdx || sc === liqColIdx || typeof row[sc] !== 'string') continue;
3163:             var s = normCell(row[sc]);
3164:             if (s.includes('השתלמות') || s.includes('ק"הש') || s.includes("קה'ש") || (s.includes('קה') && !s.includes('גמל'))) {
3165:               cat = 'hishtalmut'; break;
3166:             }
3167:             if (s.includes('גמל להשקעה') || s.includes('גמל-להשקעה')) { cat = 'gemel_invest'; break; }
3168:             if (s.includes('גמל')) { cat = 'gemel'; break; }
3169:             if (s.includes('פוליסה') || s.includes('חיסכון') || s.includes('ביטוח') || s.includes('מגוון')) { cat = 'harel'; break; }
3170:           }

...

3238:             if (!FUND_COL_K[fundKey]) FUND_COL_K[fundKey] = new Array(newLabels.length).fill(null);
3239:             var _colKNorm;
3240:             if (typeof _colKRaw === 'string') {
3241:               _colKNorm = _colKRaw.trim();
3242:             } else if (typeof _colKRaw === 'number') {
3243:               _colKNorm = _colKRaw; // keep as number (deposit/withdrawal amount in K)
3244:             } else {
3245:               _colKNorm = null;
3246:             }
3247:             if (_colKNorm !== null) FUND_COL_K[fundKey][colIdx] = _colKNorm;
3248:           }

...

3254:           var hasDynamic = yaelRows.some(function(r){ return r.key.startsWith('yd_'); });
3255: 
3256:           yaelRows.forEach(function(row) {
3257:             // Create FUNDS entry on first encounter
3258:             if (!FUNDS[row.key]) {
3259:               var defaultLiq = row.cat === 'gemel' ? 'pension' : row.cat === 'hishtalmut' ? 'age64' : 'now';
3260:               FUNDS[row.key] = {
3261:                 name: row.name, cat: row.cat, owner: 'yael',
3262:                 liquidity: row.liquidity || defaultLiq,
3263:                 pensionMonthly: (row.liquidity || defaultLiq) === 'pension',
3264:                 data: new Array(newLabels.length).fill(null)

...

3456:   var catDef = [
3457:     { label:'מזומן שקלי',    color:'#0e7490', val: lastVal(FUNDS['מזומןשקלי'] && FUNDS['מזומןשקלי'].data) },
3458:     { label:'מזומן $',       color:'#0891b2', val: lastVal(FUNDS['מזומןדולרי'] && FUNDS['מזומןדולרי'].data) },
3459:     { label:'קרן כספית',     color:'#22d3ee', val: lastVal(FUNDS['מיטבשקלית'] && FUNDS['מיטבשקלית'].data) },
3460:     { label:'__sep__', color:'', val:0 },
3461:     { label:'קרנות השתלמות', color:'#f87171', val: getcat('hishtalmut') },
3462:     { label:'קופות גמל',     color:'#fbbf24', val: getcat('gemel') },
3463:     { label:'קופ"ג להשקעה', color:'#34d399', val: getcat('gemel_invest') },
3464:     { label:'__sep__', color:'', val:0 },
3465:     { label:'הראל',          color:'#fde047', val: getcat('harel') },
3466:     { label:'__sep__', color:'', val:0 },

...

3510:     { label:'כספי',   color:'#06b6d4', val: cashVal, active: 0 },
3511:   ];
3512:   makePieWithActive('chart-equity', 'legend-equity', eqDef, eqVal+genVal+cashVal);
3513: 
3514:   // ---- 3. נזילות ----
3515:   var age67T  = getcat('hishtalmut') + getcat('gemel');
3516:   var selfT   = getcat('harel') + getcat('meitav') + getcat('gemel_invest');
3517:   var liquidT = getcat('mezuman');
3518:   var liqDef = [
3519:     { label:'נזיל',            color:'#0891b2', val: liquidT },
3520:     { label:'השקעה עצמית',     color:'#f59e0b', val: selfT },

...

4250:   'דירה':                 {mgr:'',       agent:'',     liquid:'לא נזיל', status:'נכס קבוע'},
4251: };
4252: 
4253: var TV_SECTIONS = [
4254:   {label:'מזומן',         color:'#b2ebf8', bg:'#f0fbff', catId:'mezuman',      keys:['מזומןשקלי','מזומןדולרי','מיטבשקלית']},
4255:   {label:'קרנות השתלמות', color:'#fca5a5', bg:'#fff5f5', catId:'hishtalmut',   keys:['אשקהש39905556','אשקהש40035706','אשקהש6730513','מורקהש499293','מיטבקהש912-443286']},
4256:   {label:'קופות גמל',     color:'#fcd34d', bg:'#fffdf5', catId:'gemel',        keys:['6730511אשגמל','מורגמל1375900','אשגמל39774495','6730512אשגמל','6899425אשגמל','הפניקסגמל926-084678']},
4257:   {label:'גמל להשקעה',   color:'#6ee7b7', bg:'#f0fdf4', catId:'gemel_invest',  keys:['אשגמללהשקעה2016-1738','מורגמללהשקעה']},
4258:   {label:'הראל',          color:'#fde68a', bg:'#fefce8', catId:'harel',        keys:['הראלמגוון-פוליסתחיסכ','הראלמניות106863031','הראלכללי109062745']},
4259:   {label:'מיטב',          color:'#c4b5fd', bg:'#f8f7ff', catId:'meitav',       keys:['מיטבדשניהולקרנות1693','מיטבדשטרייד']},
4260:   {label:'דירה',          color:'#d6d3d1', bg:'#fafaf9', catId:null,           keys:['דירה'], noSubtotal:true},

...

6469: var pnsNetMonthlyWithHarel = 0; // v105.3: exact net WITH Harel (same tax engine as pension tab)
6470: var pnsNetMonthlyNoHarel   = 0; // v105.3: exact net WITHOUT Harel
6471: var pnsExcludeHarel  = true; // v102.3: default = ללא הראל
6472: var PNS_SHEET_KEY   = 'ביטוח חיים ופנסיה';
6473: // Israel 2025 approximate tax ceilings
6474: var PNS_MONTHLY_EXEMPT = 9430;   // פטור חודשי (ישן — לא בשימוש בנוסחת הסל)
6475: var PNS_CAPITAL_EXEMPT = 800000; // פטור היוון (ישן — לא בשימוש בנוסחת הסל)
6476: var PNS_MARGINAL_RATE  = 0.30;
6477: var PNS_CAPITAL_RATE   = 0.25;
6478: // סל פטור קיבוע זכויות — ניתן לשינוי ע"י המשתמש
6479: var pnsExemptBasket    = 882924;
6480: var PNS_COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#06b6d4','#f97316'];
6481: 
6482: // מפרמט תאריך לפורמט ישראלי DD/MM/YYYY — מטפל ב-Date object, string ישראלי, ו-raw JS date string
6483: function pnsFormatDate(v) {
6484:   if (!v) return '';

...

7044: 
7045: // מנוע מס הכנסה חודשי ישראלי — מדרגות 2026 + נקודות זיכוי
7046: // v180.55: Real Portfolio isolated tax config — mirrors FFS_PROFILE fields
7047: var REAL_TAX_CONFIG_LS_KEY = 'real_tax_config_v1';
7048: window.REAL_TAX_CONFIG = {
7049:   creditPointValue: 242, taxRates: [10,14,20,31,35,47,50],
7050:   taxBrackets: [7010,10060,16150,22440,46690,60130],
7051:   taxCeiling: 9430, taxRate: 57.5, taxBasket: 976005, _taxBasketOverride: false,
7052:   creditPoints: 2.25, marginalTax: 35
7053: };
7054: function loadRealTaxConfig() {
7055:   try {
7056:     var raw = localStorage.getItem(REAL_TAX_CONFIG_LS_KEY);

...

7061:   try { localStorage.setItem(REAL_TAX_CONFIG_LS_KEY, JSON.stringify(window.REAL_TAX_CONFIG)); } catch(e) {}
7062: }
7063: loadRealTaxConfig();
7064: function pnsCalcTax(gross) {
7065:   var cfg      = window.REAL_TAX_CONFIG || {};
7066:   var rates    = (cfg.taxRates    && cfg.taxRates.length    === 7) ? cfg.taxRates    : [10,14,20,31,35,47,50];
7067:   var ceilings = (cfg.taxBrackets && cfg.taxBrackets.length === 6) ? cfg.taxBrackets : [7010,10060,16150,22440,46690,60130];
7068:   var cpv      = cfg.creditPointValue != null ? cfg.creditPointValue : 242;
7069:   var credits  = cfg.creditPoints     != null ? cfg.creditPoints     : 2.25;
7070:   var tax = 0, prev = 0;
7071:   for (var i = 0; i < rates.length; i++) {

...

7092:   var totalAccum   = PENSION_ASSETS.reduce(function(s,a){ return s+(a.accumulation||0); }, 0);
7093: 
7094:   // נוסחת סל פטור קיבוע זכויות (v70.0):
7095:   // הון פטור = סל × אחוז היוון
7096:   // קצבה פטורה = (סל × אחוז קצבה) / 180
7097:   var capitalExemptFrac = val / 100;
7098:   var pensionExemptFrac = (100 - val) / 100;
7099:   var _activeBasket = (window.REAL_TAX_CONFIG && REAL_TAX_CONFIG.taxBasket != null) // v180.55
7100:                       ? REAL_TAX_CONFIG.taxBasket : pnsExemptBasket;
7101:   var capitalExempt = _activeBasket * capitalExemptFrac;
7102:   var monthlyExempt = _activeBasket * pensionExemptFrac / 180;
7103: 
7104:   // מנוע מס — לפי שיטה שנבחרה ב-dropdown (v75.0)
7105:   var taxMethodEl  = document.getElementById('pns-tax-method');
7106:   var taxMethod    = taxMethodEl ? taxMethodEl.value : 'auto';
7107:   var taxableMonthly = Math.max(0, totalPension - monthlyExempt);
7108:   var taxOnPension;
7109:   if (taxMethod === '31') {
7110:     taxOnPension = taxableMonthly * 0.31;
7111:   } else if (taxMethod === '35') {
7112:     taxOnPension = taxableMonthly * 0.35;
7113:   } else if (taxMethod === '47') {
7114:     taxOnPension = taxableMonthly * 0.47;
7115:   } else {
7116:     taxOnPension = pnsCalcTax(taxableMonthly);
7117:   }
7118:   var netMonthly   = totalPension - taxOnPension;
7119:   // Delta קצבה — הפרש בין "עם פטור" ל"ללא פטור" (v77.0: הון נטו הוסר)
7120:   var taxOnPension_base = (taxMethod === '31') ? totalPension * 0.31
7121:                         : (taxMethod === '35') ? totalPension * 0.35

...

7130:   // v105.3: compute exact with/without Harel values for Overview card (same tax engine, no scaling)
7131:   (function() {
7132:     var _royBase   = PENSION_ASSETS.filter(function(a){ return !a.isPendingReview && (!a.owner || a.owner === 'רועי'); });
7133:     var _noHarel   = _royBase.filter(function(a){ return !a.provider || a.provider.indexOf('הראל') < 0; });
7134:     function _calcNet(tp) {
7135:       var _exempt  = pnsExemptBasket * pensionExemptFrac / 180;
7136:       var _taxable = Math.max(0, tp - _exempt);
7137:       var _tax;
7138:       if (taxMethod === '31')      _tax = _taxable * 0.31;
7139:       else if (taxMethod === '35') _tax = _taxable * 0.35;
7140:       else if (taxMethod === '47') _tax = _taxable * 0.47;
7141:       else                         _tax = pnsCalcTax(_taxable);
7142:       return Math.round(tp - _tax);
7143:     }
7144:     var _tpWith    = _royBase.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
7145:     var _tpWithout = _noHarel.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
7146:     pnsNetMonthlyWithHarel = _tpWith    > 0 ? _calcNet(_tpWith)    : 0;

...

7159:   var circPen = document.getElementById('pns-circle-pension');
7160:   if (circCap) circCap.style.transform = 'scale(' + capScale + ')';
7161:   if (circPen) circPen.style.transform = 'scale(' + penScale + ')';
7162:   // עיגול הון: פנים ריק ממספרים — הנתון מוצג מתחת לעיגול (v78.0)
7163:   var capTotalEl = document.getElementById('pns-cap-total');
7164:   if (capTotalEl) capTotalEl.textContent = totalAccum > 0 ? 'סך הון פטור: ' + pnsFmtK(Math.round(capitalExempt)) + ' ₪' : '—';
7165:   // v102.4: Net economic value — uses actual marginal rate when 'auto' selected
7166:   var capNetEl = document.getElementById('pns-cap-net-val');
7167:   if (capNetEl) {
7168:     var _netTaxRate;
7169:     if (taxMethod === '31')       _netTaxRate = 0.31;
7170:     else if (taxMethod === '35')  _netTaxRate = 0.35;
7171:     else if (taxMethod === '47')  _netTaxRate = 0.47;
7172:     else _netTaxRate = pnsGetMarginalRate(taxableMonthly); // auto → actual marginal bracket
7173:     var _netTaxPct = Math.round(_netTaxRate * 100);
7174:     var netEconVal = capitalExempt * _netTaxRate;
7175:     capNetEl.textContent = (totalAccum > 0 && capitalExempt > 0)
7176:       ? 'חיסכון מס (לפי מדרגת מס ' + _netTaxPct + '%): ' + pnsFmtK(Math.round(netEconVal)) + ' ₪'
7177:       : '';
7178:   }
7179: 
7180:   // עיגול קצבה: מציג חיסכון מס (דלתא) בלבד (v79.0 — הוסרה שורת נטו מהעיגול)
7181:   var circPenVal = document.getElementById('pns-circle-pen-val');
7182:   if (circPenVal) circPenVal.textContent = totalPension > 0 && deltaMonthly > 0 ? '+ ' + pnsFmt(Math.round(deltaMonthly)) + ' ₪' : '—';
7183: 
7184:   // מתחת לעיגול קצבה: הצג פטור ברוטו — הנתון הטכני
7185:   var penTotalEl = document.getElementById('pns-pen-total');
7186:   if (penTotalEl) penTotalEl.textContent = totalPension > 0 ? 'פטור (ברוטו): ' + pnsFmt(Math.round(monthlyExempt)) + ' ₪/חודש' : '—';
7187: }
7188: 
7189: function pensionBasketChange(val) {
7190:   var v = parseInt(val) || 882924;
7191:   pnsExemptBasket = Math.max(0, v);
7192:   var inp = document.getElementById('pns-basket-input');
7193:   if (inp) inp.value = pnsExemptBasket;
7194:   var sliderEl = document.getElementById('pns-tax-slider');
7195:   pensionSliderChange(sliderEl ? sliderEl.value : pensionTaxSliderVal);
7196: }
7197: // v180.55: personal tax input handlers for real portfolio tab
7198: function pnsCreditPointsChange(val) {

...

7888: // v103.13-sim: retirement ages as named constants — future-proofed for dynamic sliders
7889: var SIM_RETIREMENT_AGE_ROY  = 67; // גיל פרישה — רועי (men's statutory pension age in Israel)
7890: var SIM_RETIREMENT_AGE_YAEL = 64; // גיל פרישה — יעל (women's statutory pension age in Israel)
7891: var SIM_RATE           = 4;     // % annual investment return
7892: var SIM_PENSION_RATE   = 3;     // % annual pension capital yield — v103.26
7893: var SIM_INFLATION      = 2.5;   // % annual inflation — v103.26
7894: var SIM_VIEW_REAL      = false; // true = show real (inflation-adjusted) values
7895: var SIM_CAPITAL_TAX    = 25;    // % real capital gains tax — v120.0
7896: var SIM_PENSION_ACC    = 0;     // ₪ current pension accumulation — v124.0
7897: var SIM_RENTAL_INCOME  = 0;     // ₪/month rental income — v124.0
7898: var SIM_USER1_NAME     = ''; // v168.72: empty until FFS profile or Excel loaded
7899: var SIM_USER2_NAME     = ''; // v168.59/173.2: empty until mode loaded — prevents "User B" ghost label

...

7904: var SIM_USER2_BIRTH    = '1968-06-28'; // v168.103: Yael default birth date
7905: var FFS_PROFILE_LS_KEY = 'ffs_profile_v1'; // v168.72: FFS side drawer profile key
7906: var DEFAULT_RETIREMENT_EXPENSE = 29000; // v180.33: FFS Guest profile default monthly retirement expense — single source of truth
7907: var TAX_CONFIG = Object.freeze({
7908:   creditPointValue: 242,
7909:   exemptionCeiling: 9430,
7910:   brackets: [
7911:     {limit: 7010,     rate: 0.10},
7912:     {limit: 10060,    rate: 0.14},
7913:     {limit: 16150,    rate: 0.20},
7914:     {limit: 22440,    rate: 0.31},

...

7917:     {limit: Infinity, rate: 0.50}
7918:   ]
7919: }); // v180.39: 2024 Israeli pension tax parameters — FFS Guest Simulator only
7920: var FFS_NET_PENSION_MONTHLY  = 0; // v180.39: transient — computed by ffsSyncSliders, read by ffsUpdateLiveSidebar
7921: var FFS_GROSS_PENSION_MONTHLY = 0; // v180.49: gross before tax, set by ffsSyncSliders
7922: function ffsCalculateNetPension(gross, monthlyExemptAmount, creditPoints, customConfig) {
7923:   var config    = customConfig || FFS_PROFILE; // v180.55: accept optional config for isolation
7924:   var _rates    = (config.taxRates    && config.taxRates.length    === 7)
7925:                   ? config.taxRates    : [10, 14, 20, 31, 35, 47, 50];
7926:   var _brackets = (config.taxBrackets && config.taxBrackets.length === 6)
7927:                   ? config.taxBrackets : [7010, 10060, 16150, 22440, 46690, 60130];
7928:   var _cpv      = config.creditPointValue != null ? config.creditPointValue : 242;
7929:   var exemption = Math.min(monthlyExemptAmount, gross);
7930:   var taxable   = gross - exemption;
7931:   var baseTax   = 0;
7932:   var prevCeil  = 0;
7933:   for (var i = 0; i < _rates.length; i++) {
7934:     var curCeil = (i < _brackets.length) ? _brackets[i] : Infinity;
7935:     var band    = Math.min(taxable, curCeil) - prevCeil;
7936:     if (band <= 0) break;
7937:     baseTax  += band * (_rates[i] / 100);
7938:     prevCeil  = curCeil;
7939:   }
7940:   var finalTax = Math.max(0, baseTax - (creditPoints * _cpv));
7941:   return gross - finalTax;
7942: } // v180.50: dynamic engine — reads taxRates/taxBrackets/creditPointValue from FFS_PROFILE with statutory fallbacks
7943: var FFS_PROFILE = { name:'', birthDate:'', retirementAge:67, lifeExpectancy:84, investments:[], realEstate:[], pension:[], monthlySavings:0, savingsGrowth:0, retirementExpense:DEFAULT_RETIREMENT_EXPENSE, retirementIncome:0, bridgeAge:0, bridgeCashflow:0, bridgePensionContrib:false, incomePhases:[], ffsEvents:[], events:[], macroInflation:2.5, macroTax:25, macroYield:4.0, macroWage:2.0, macroPensionRate:3.0, macroReGrowth:2.5, taxFixationPercent:52, additionalIncomes:[], creditPoints:2.25, marginalTax:0.35, taxCeiling:null, taxRate:null, taxBasket:null, creditPointValue:null, taxRates:null, taxBrackets:null }; // v168.77/90 + v170.2 + v170.4 + v177.88 + v177.90 + v178.3 + v178.5 + v180.33 + v180.39 + v180.44 + v180.45 + v180.50
7944: var SIM_TARGET_EXP     = 0;     // monthly expense target NIS — set on init
7945: var SIM_RETIRE_EXP     = 29000; // v168.101: settings-driven expected monthly retirement expense (drives slider range + KPI#3)
7946: var SIM_INSTRUCTOR_SAL = 35000; // monthly instructor salary NIS
7947: 
7948: // v169.7: Immutable mode defaults — each mode owns its own values, never borrows from another.

...

8175:             return ev.isSimulation === false && ev.src !== 'events_timeline' && ev.src !== 'ffs_event';
8176:           });
8177:         } catch(e) {}
8178:       }
8179:       FFS_PROFILE.personalId           = saved.personalId           || '';
8180:       FFS_PROFILE.macroInflation   = saved.macroInflation   != null ? saved.macroInflation   : 2.5;
8181:       FFS_PROFILE.macroTax         = saved.macroTax         != null ? saved.macroTax         : 25;
8182:       FFS_PROFILE.macroYield       = saved.macroYield       != null ? saved.macroYield       : 4.0;
8183:       FFS_PROFILE.macroWage        = saved.macroWage        != null ? saved.macroWage        : 2.0;
8184:       FFS_PROFILE.macroPensionRate = saved.macroPensionRate != null ? saved.macroPensionRate : 3.0;
8185:       FFS_PROFILE.macroReGrowth       = saved.macroReGrowth       != null ? saved.macroReGrowth       : 2.5;
8186:       FFS_PROFILE.taxFixationPercent  = saved.taxFixationPercent  != null ? saved.taxFixationPercent  : 52; // v178.3
8187:       FFS_PROFILE.additionalIncomes   = saved.additionalIncomes   || []; // v178.5
8188:       FFS_PROFILE.creditPoints        = saved.creditPoints        != null ? saved.creditPoints        : 2.25; // v180.39
8189:       FFS_PROFILE.marginalTax         = saved.marginalTax         != null ? saved.marginalTax         : 0.35; // v180.44
8190:       FFS_PROFILE.taxCeiling          = saved.taxCeiling          != null ? saved.taxCeiling          : null; // v180.48
8191:       FFS_PROFILE.taxRate             = saved.taxRate             != null ? saved.taxRate             : null; // v180.48
8192:       FFS_PROFILE.taxBasket           = saved.taxBasket           != null ? saved.taxBasket           : null; // v180.48
8193:       FFS_PROFILE.creditPointValue    = saved.creditPointValue    != null ? saved.creditPointValue    : null; // v180.50
8194:       FFS_PROFILE.taxRates            = saved.taxRates            != null ? saved.taxRates            : null; // v180.50
8195:       FFS_PROFILE.taxBrackets         = saved.taxBrackets         != null ? saved.taxBrackets         : null; // v180.50
8196:       // v168.76: ensure pension items have pensionType field (backwards compat)
8197:       FFS_PROFILE.pension.forEach(function(p) { if (!p.pensionType) p.pensionType = 'pension'; });
8198:       // normalize stale liquidity code saved by old master grid bug
8199:       FFS_PROFILE.investments.forEach(function(item) { if (item.liquidity === 'self-invest') item.liquidity = 'private'; });

...

8230:   if (mPenPct) mPenPct.textContent = (100 - val) + '%';
8231:   var mCapC = document.getElementById('ffs-fix-modal-circle-capital');
8232:   var mPenC = document.getElementById('ffs-fix-modal-circle-pension');
8233:   if (mCapC) mCapC.style.transform = 'scale(' + (0.6 + val / 100 * 0.4) + ')';
8234:   if (mPenC) mPenC.style.transform = 'scale(' + (0.6 + (100 - val) / 100 * 0.4) + ')';
8235:   // v180.45: basket-split math — blue=capital lump sum, green=monthly annuity exemption
8236:   var _mTax              = (FFS_PROFILE && FFS_PROFILE.marginalTax != null) ? FFS_PROFILE.marginalTax : 0.35;
8237:   var _totalBasket       = (FFS_PROFILE && FFS_PROFILE.taxBasket != null) ? FFS_PROFILE.taxBasket : 976005;
8238:   var _blueCapital       = _totalBasket * (val / 100);
8239:   var _greenBasket       = _totalBasket - _blueCapital;
8240:   var _greenMonthlyExempt = _greenBasket / 180;
8241:   var _greenShekelEl = document.getElementById('ffs-green-shekel');
8242:   var _blueShekelEl  = document.getElementById('ffs-blue-shekel');
8243:   if (_greenShekelEl) _greenShekelEl.textContent = 'חיסכון: ' + Math.round(_greenMonthlyExempt * _mTax).toLocaleString('he-IL') + ' ₪';
8244:   if (_blueShekelEl)  _blueShekelEl.textContent  = 'חיסכון: ' + Math.round(_blueCapital * _mTax).toLocaleString('he-IL') + ' ₪';
8245:   // v180.42: sync live value to profile and trigger tax engine recalculation
8246:   FFS_PROFILE.taxFixationPercent = val;
8247:   if (typeof ffsSyncSliders === 'function') ffsSyncSliders();
8248:   if (typeof simRenderKPI === 'function' && typeof simInited !== 'undefined' && simInited) simRenderKPI();

...

8362: function closeFfsFixationModal() {
8363:   var m = document.getElementById('ffs-fixation-modal');
8364:   if (m) m.style.display = 'none';
8365: }
8366: function ffsResetMacroDefaults() {
8367:   ffsSaveField('macroInflation',   2.5);
8368:   ffsSaveField('macroTax',         25);
8369:   ffsSaveField('macroYield',       4.0);
8370:   ffsSaveField('macroWage',        2.0);
8371:   ffsSaveField('macroPensionRate', 3.0);
8372:   ffsSaveField('macroReGrowth',    2.5);
8373:   var inflEl = document.getElementById('ffs-macro-inflation');
8374:   var taxEl  = document.getElementById('ffs-macro-tax');
8375:   var yldEl  = document.getElementById('ffs-macro-yield');
8376:   var wgeEl  = document.getElementById('ffs-macro-wage');
8377:   var psnEl  = document.getElementById('ffs-macro-pension-rate');
8378:   var reEl   = document.getElementById('ffs-macro-re-growth');

...

8442: }
8443: // v180.45: advanced tax params — ceiling/rate auto-derive basket; basket manual override locks auto-calc
8444: function ffsTaxParamChanged(key, val, isManualBasket) {
8445:   if (isManualBasket) FFS_PROFILE._taxBasketOverride = true;
8446:   ffsSaveField(key, val);
8447:   if ((key === 'taxCeiling' || key === 'taxRate') && !FFS_PROFILE._taxBasketOverride) {
8448:     var _c = FFS_PROFILE.taxCeiling != null ? FFS_PROFILE.taxCeiling : 9430;
8449:     var _r = FFS_PROFILE.taxRate    != null ? FFS_PROFILE.taxRate    : 57.5;
8450:     var _auto = Math.round(_c * (_r / 100) * 180);
8451:     FFS_PROFILE.taxBasket = _auto;
8452:     var _el = document.getElementById('ffs-tax-basket');
8453:     if (_el && document.activeElement !== _el) _el.value = _auto; // v180.48: focus guard
8454:     ffsSaveProfile();

...

8465:   var modal = document.getElementById('ffs-tax-modal');
8466:   if (modal) { modal.style.display = 'flex'; modal.setAttribute('data-target-mode', mode); }
8467:   var titleEl = document.getElementById('ffs-tax-modal-title');
8468:   if (titleEl) titleEl.textContent = (mode === 'real') ? 'הגדרות מס הכנסה (תיק אישי)' : 'הגדרות מס הכנסה (סימולטור)';
8469:   var cfg = (mode === 'real') ? (window.REAL_TAX_CONFIG || {}) : FFS_PROFILE;
8470:   var _rates    = (cfg.taxRates    && cfg.taxRates.length    === 7) ? cfg.taxRates.slice()    : [10, 14, 20, 31, 35, 47, 50];
8471:   var _brackets = (cfg.taxBrackets && cfg.taxBrackets.length === 6) ? cfg.taxBrackets.slice() : [7010, 10060, 16150, 22440, 46690, 60130];
8472:   var _cpv  = cfg.creditPointValue != null ? cfg.creditPointValue : 242;
8473:   var _ceil = cfg.taxCeiling       != null ? cfg.taxCeiling       : 9430;
8474:   var _rate = cfg.taxRate          != null ? cfg.taxRate          : 57.5;
8475:   // v180.52: inject statutory params header above brackets
8476:   var hdrSection = document.getElementById('ffs-tax-header-section');
8477:   if (hdrSection) {
8478:     var inpStyle = 'width:100%;border:1.5px solid #e2e8f0;border-radius:8px;padding:4px 4px;font-family:Heebo,sans-serif;font-size:12px;font-weight:600;color:#1e293b;text-align:center;outline:none;background:white;box-sizing:border-box;';
8479:     hdrSection.innerHTML =

...

8527:   var _cvEl   = document.getElementById('ffs-modal-credit-val');
8528:   var _ceilEl = document.getElementById('ffs-modal-tax-ceiling');
8529:   var _rateEl = document.getElementById('ffs-modal-tax-rate');
8530:   if (_cvEl)   cfg.creditPointValue = parseFloat(_cvEl.value)   || 242;
8531:   if (_ceilEl) cfg.taxCeiling       = parseFloat(_ceilEl.value) || 9430;
8532:   if (_rateEl) cfg.taxRate          = parseFloat(_rateEl.value) || 57.5;
8533:   var _basketEl = document.getElementById('ffs-modal-tax-basket');
8534:   if (_basketEl && _basketEl.getAttribute('data-overridden') === 'true') {
8535:     cfg.taxBasket = parseFloat(_basketEl.value) || 976005;
8536:     cfg._taxBasketOverride = true;
8537:   } else if (!cfg._taxBasketOverride) {
8538:     cfg.taxBasket = Math.round(cfg.taxCeiling * (cfg.taxRate / 100) * 180);
8539:   }
8540:   var _rates = [], _brackets = [];
8541:   for (var i = 0; i < 7; i++) {
8542:     var rEl = document.getElementById('ffs-tax-tier-rate-' + i);
8543:     if (!rEl) return;

...

8549:     _brackets.push(parseFloat(cEl.value) || 0);
8550:   }
8551:   for (var k = 1; k < _brackets.length; k++) {
8552:     if (_brackets[k] <= _brackets[k - 1]) { alert('תקרות המדרגות חייבות להיות בסדר עולה'); return; }
8553:   }
8554:   cfg.taxRates    = _rates;
8555:   cfg.taxBrackets = _brackets;
8556:   if (mode === 'real') {
8557:     saveRealTaxConfig();
8558:     if (typeof pensionSliderChange === 'function') {
8559:       var _sldr = document.getElementById('pns-tax-slider');

...

10259:     var margTaxEl = document.getElementById('ffs-marginal-tax');
10260:     if (margTaxEl) margTaxEl.value = FFS_PROFILE.marginalTax != null ? FFS_PROFILE.marginalTax : 0.35; // v180.44
10261:     if (bridgeAgeEl) bridgeAgeEl.value  = FFS_PROFILE.bridgeAge     || '';
10262:     if (bridgeCfEl)  bridgeCfEl.value   = FFS_PROFILE.bridgeCashflow || '';
10263:     if (bridgePcEl)  bridgePcEl.checked = FFS_PROFILE.bridgePensionContrib || false;
10264:     var macroInflEl = document.getElementById('ffs-macro-inflation');
10265:     var macroTaxEl  = document.getElementById('ffs-macro-tax');
10266:     var macroYldEl  = document.getElementById('ffs-macro-yield');
10267:     var macroWgeEl  = document.getElementById('ffs-macro-wage');
10268:     var macroPsnEl  = document.getElementById('ffs-macro-pension-rate');
10269:     var macroReEl   = document.getElementById('ffs-macro-re-growth');
10270:     if (macroInflEl) macroInflEl.value = FFS_PROFILE.macroInflation   != null ? FFS_PROFILE.macroInflation   : 2.5;
10271:     if (macroTaxEl)  macroTaxEl.value  = FFS_PROFILE.macroTax         != null ? FFS_PROFILE.macroTax         : 25;
10272:     if (macroYldEl)  macroYldEl.value  = FFS_PROFILE.macroYield       != null ? FFS_PROFILE.macroYield       : 4.0;
10273:     if (macroWgeEl)  macroWgeEl.value  = FFS_PROFILE.macroWage        != null ? FFS_PROFILE.macroWage        : 2.0;
10274:     if (macroPsnEl)  macroPsnEl.value  = FFS_PROFILE.macroPensionRate != null ? FFS_PROFILE.macroPensionRate : 3.0;
10275:     if (macroReEl)   macroReEl.value   = FFS_PROFILE.macroReGrowth    != null ? FFS_PROFILE.macroReGrowth    : 2.5;

...

10588:   var _grossPension = (FFS_PROFILE.retirementIncome > 0)
10589:     ? FFS_PROFILE.retirementIncome
10590:     : (_proj.totalMonthly > 0 ? _proj.totalMonthly : ffsTotalPensionMonthlyNIS());
10591:   var _fixPct      = (FFS_PROFILE.taxFixationPercent != null) ? FFS_PROFILE.taxFixationPercent : 52;
10592:   var _totalBasket = (FFS_PROFILE.taxBasket != null) ? FFS_PROFILE.taxBasket : 976005; // v180.45: basket-split
10593:   var _greenMonthlyExempt = (_totalBasket * (1 - _fixPct / 100)) / 180;
10594:   var _credits     = (FFS_PROFILE.creditPoints      != null) ? FFS_PROFILE.creditPoints      : 2.25;
10595:   var _netPension  = ffsCalculateNetPension(_grossPension, _greenMonthlyExempt, _credits);
10596:   FFS_GROSS_PENSION_MONTHLY = _grossPension;   // v180.49
10597:   FFS_NET_PENSION_MONTHLY   = _netPension;     // v180.49
10598:   var _retAgeSync  = parseInt(FFS_PROFILE.retirementAge) || 67;
10599:   var _addIncome   = 0;
10600:   (FFS_PROFILE.additionalIncomes || []).forEach(function(inc) {

...

11435:     if (i < phase3Idx) {
11436:       royHarelCap *= (1 + _penMonthlyRate);
11437:       var _inBridgePh3 = (_bridgeStartIdx >= 0 && i >= _bridgeStartIdx);
11438:       if (!_inBridgePh3 || _bridgePensionContrib) royHarelCap += harelPremium / 1000;
11439:     } else {
11440:       // v103.5: same sustainable withdrawal model for Harel if mode='with'
11441:       royHarelCap *= (1 + retYieldMonthly);
11442:       if (SIM_HAREL_MODE === 'with') {
11443:         var _hrlDraw = Math.min(royHarelPension / 1000, royHarelCap * retYieldMonthly);
11444:         royHarelCap -= _hrlDraw;
11445:         if (royHarelCap < 0) royHarelCap = 0;
11446:       }
11447:       // 'without' (default): Harel compounds as inheritance capital — no withdrawals
11448:     }
11449:     // v180.28: compound each FFS manager item individually; custom yield uses 12th-root for exact EAR
11450:     for (var _fi = 0; _fi < _ffsManagerCaps.length; _fi++) {
11451:       var _itm   = _ffsManagerItems[_fi];
11452:       var _iRate = (_itm.customYield != null)

...

11803:       tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 1
11804:     });
11805:   }
11806: 
11807:   // v168.53: apply real deflation — simulation steps are MONTHLY, so divide by 12
11808:   // Formula: Value / (1 + annualInflation%)^(months/12)
11809:   if (SIM_VIEW_REAL && SIM_INFLATION > 0) {
11810:     var _inf = SIM_INFLATION / 100;
11811:     datasets = datasets.map(function(ds) {
11812:       return Object.assign({}, ds, {
11813:         data: ds.data.map(function(v, i) { return v / Math.pow(1 + _inf, i / 12); })
11814:       });
11815:     });

...

11929:                 v = (result.ffsManagerData[ctx.dataset._ffsIdx] || [])[di] || 0;
11930:               } else {
11931:                 v = ctx.parsed.y;
11932:               }
11933:               // v168.59: apply real deflation to tooltip values when in Real mode
11934:               if (SIM_VIEW_REAL && SIM_INFLATION > 0) {
11935:                 v = v / Math.pow(1 + SIM_INFLATION / 100, di / 12);
11936:               }
11937:               if (v === undefined || v === null || isNaN(v)) return null;
11938:               var _tv = v;
11939:               return ' ' + ctx.dataset.label + ': ' + (_tv >= 1000 ? (_tv/1000).toFixed(1)+'M' : Math.round(_tv)+'k');
11940:             },

...

11949:                 total = result.royData[di] || 0;
11950:               } else {
11951:                 total = result.yaelData[di] || 0;
11952:               }
11953:               // v168.59: discount total to real value when in Real mode
11954:               if (SIM_VIEW_REAL && SIM_INFLATION > 0) {
11955:                 total = total / Math.pow(1 + SIM_INFLATION / 100, di / 12);
11956:               }
11957:               var lines = ['סה״כ: ' + (total >= 1000 ? (total/1000).toFixed(1)+'M' : Math.round(total)+'k')];
11958:               // v144.0: strict YYYY-MM string match — prevents any cross-month smearing
11959:               var _hoveredLabel = String(result.labels[di] || '');
11960:               if (_hoveredLabel) {

...

12943:   if (_fr) _fr.style.display = _dirty ? 'inline-flex' : 'none';
12944:   // v103.31: update KPI cards first (הכנסה פנויה + תזרים נטו), then re-run chart
12945:   simRenderKPI();
12946:   simRenderChart(simRunEngine());
12947: }
12948: function simSetInflation(v) {
12949:   SIM_INFLATION = parseFloat(v) || 0;
12950:   var sl  = document.getElementById('sim-inflation-slider');
12951:   var num = document.getElementById('sim-inflation-num');
12952:   if (sl  && parseFloat(sl.value)  !== SIM_INFLATION) sl.value  = SIM_INFLATION;
12953:   if (num && parseFloat(num.value) !== SIM_INFLATION) num.value = SIM_INFLATION;
12954:   simRenderChart(simRunEngine());
12955: }
12956: 
12957: // v103.2: Show/hide simulator content based on data availability
12958: function simCheckEmpty() {

...

14008: var mktMainChart        = null;
14009: var mktCompChart        = null;
14010: var mktSniperOn         = false;
14011: var mktAIOpen           = true;
14012: var mktFxRate           = 3.70;
14013: var mktInflationRate    = 0;     // % annual inflation for real-yield overlay
14014: var mktInflationOn      = false; // toggle: show real yield (nominal - inflation)
14015: var mktChatHistory      = [];
14016: var mktLastFxSyncTicker = null; // tracks which ticker last synced the FX slider
14017: 
14018: function marketInit() {
14019:   var inp = document.getElementById('mkt-search-input');

...

14546:   var legendEl3 = document.getElementById('mkt-sniper-legend');
14547:   if (legendEl3 && !mktSniperOn) legendEl3.style.display = 'none';
14548: }
14549: 
14550: // ── Comparison Chart ──────────────────────
14551: function _inflationDeduction(i, n) {
14552:   // Linear inflation deduction for data point i of n total
14553:   var periodYears = { '1d': 1/252, '5d': 5/252, '1m': 1/12, '3m': 3/12, '6m': 6/12, '1y': 1, '3y': 3 };
14554:   var yrs = (periodYears[mktCurrentPeriod] || 1/12);
14555:   return mktInflationOn ? (mktInflationRate * (i / Math.max(n - 1, 1)) * yrs) : 0;
14556: }
14557: 
14558: function mktUpdateComparison() {
14559:   var canvas = document.getElementById('mkt-compare-chart');
14560:   if (!canvas || !mktCurrentData || !mktCurrentData.history || !mktCurrentData.history.length) return;

...

14564:   var n           = history.length;
14565:   var base        = history[0].close || 1;
14566:   var liveFx      = mktCurrentData.fx_rate || 3.70;
14567:   var fxAdj       = mktFxRate / liveFx;
14568:   var stockPct    = history.map(function(p, i){
14569:     return (p.close / base - 1) * 100 * fxAdj - _inflationDeduction(i, n);
14570:   });
14571:   var labels      = history.map(function(p){ return p.date; });
14572:   var chartLabel  = mktCurrentTicker + (mktInflationOn ? ' (ריאלי)' : '');
14573:   var datasets    = [{
14574:     label: chartLabel, data: stockPct,
14575:     borderColor: mktInflationOn ? '#a78bfa' : '#3b82f6', backgroundColor: 'transparent',
14576:     tension: 0.3, borderWidth: 2, pointRadius: 0, fill: false
14577:   }];
14578:   var bench = mktCurrentData.benchmark;
14579:   if (bench && bench.length > 0) {
14580:     var bBase = bench[0].close || 1;
14581:     var bN    = bench.length;
14582:     datasets.push({
14583:       label: benchTicker + (mktInflationOn ? ' (ריאלי)' : ''),
14584:       data: bench.map(function(p, i){ return (p.close / bBase - 1) * 100 - _inflationDeduction(i, bN); }),
14585:       borderColor: '#f59e0b', backgroundColor: 'transparent',
14586:       tension: 0.3, borderWidth: 2, pointRadius: 0, fill: false
14587:     });
14588:   }
14589:   // Inflation line (shown when toggle is on)
14590:   if (mktInflationOn) {
14591:     var periodYears = { '1d': 1/252, '5d': 5/252, '1m': 1/12, '3m': 3/12, '6m': 6/12, '1y': 1, '3y': 3 };
14592:     var yrs = (periodYears[mktCurrentPeriod] || 1/12);
14593:     datasets.push({
14594:       label: 'אינפלציה (' + mktInflationRate.toFixed(1) + '%/שנה)',
14595:       data: history.map(function(p, i){ return -(mktInflationRate * (i / Math.max(n - 1, 1)) * yrs); }),
14596:       borderColor: '#f87171', backgroundColor: 'transparent',
14597:       borderDash: [5, 4], tension: 0, borderWidth: 1.5, pointRadius: 0, fill: false
14598:     });
14599:   }
14600:   if (mktCompChart) { mktCompChart.destroy(); mktCompChart = null; }

...

14623:   var el = document.getElementById('mkt-fx-val');
14624:   if (el) el.textContent = mktFxRate.toFixed(2);
14625:   mktUpdateComparison();
14626: }
14627: 
14628: // ── Inflation Slider & Toggle ──────────────
14629: function mktInflationChange(val) {
14630:   mktInflationRate = parseFloat(val) || 0;
14631:   var el = document.getElementById('mkt-inflation-val');
14632:   if (el) el.textContent = mktInflationRate.toFixed(1) + '%';
14633:   mktUpdateComparison();
14634: }
14635: 
14636: function mktInflationToggle() {
14637:   mktInflationOn = !mktInflationOn;
14638:   var track = document.getElementById('mkt-inflation-track');
14639:   var thumb = document.getElementById('mkt-inflation-thumb');
14640:   var row   = document.getElementById('mkt-inflation-slider-row');
14641:   if (track) { track.style.background = mktInflationOn ? '#6d28d9' : '#1e2d4a'; }
14642:   if (thumb) { thumb.style.right = mktInflationOn ? '2px' : '16px'; thumb.style.background = mktInflationOn ? '#a78bfa' : '#475569'; }
14643:   if (row)   { row.style.opacity = mktInflationOn ? '1' : '0.45'; }
14644:   mktUpdateComparison();
14645: }
14646: 
14647: // ── AI Sidebar ────────────────────────────
14648: function mktToggleAI() {

...

14680:     if (mktCurrentData.sniper) {
14681:       stockCtx += ' | יעד קנייה: ' + (mktCurrentData.sniper.target_buy || '—') +
14682:                   ' | יעד מכירה: ' + (mktCurrentData.sniper.target_sell || '—');
14683:     }
14684:   }
14685:   var inflCtx = mktInflationOn
14686:     ? ' | שיעור אינפלציה: ' + mktInflationRate.toFixed(1) + '%/שנה (הצג תשואה ריאלית)'
14687:     : '';
14688:   var systemPrompt = 'אתה אנליסט פיננסי מומחה בשוק ההון. ענה בעברית בתמציתיות ובדיוק. ' +
14689:     (stockCtx ? 'נתוני המניה הנוכחית: ' + stockCtx + inflCtx : 'לא נבחרה מניה ספציפית.');
14690: 
14691:   var msgs = mktChatHistory.slice(-8);

...

14865:   if (s) {
14866:     if (s.retireRoy  !== undefined) SIM_RETIREMENT_AGE_ROY  = parseInt(s.retireRoy,  10) || SIM_RETIREMENT_AGE_ROY;
14867:     if (s.retireYael !== undefined) SIM_RETIREMENT_AGE_YAEL = parseInt(s.retireYael, 10) || SIM_RETIREMENT_AGE_YAEL;
14868:     if (s.invRate    !== undefined) SIM_RATE           = parseFloat(s.invRate)    || SIM_RATE;
14869:     if (s.pensionRate!== undefined) SIM_PENSION_RATE   = parseFloat(s.pensionRate) || SIM_PENSION_RATE;
14870:     if (s.inflation  !== undefined) SIM_INFLATION      = parseFloat(s.inflation)  || SIM_INFLATION;
14871:     if (s.reGrowth   !== undefined) SIM_RE_GROWTH_RATE = parseFloat(s.reGrowth)   || SIM_RE_GROWTH_RATE;
14872:     if (s.pensionMonthly !== undefined) SIM_PENSION_MONTHLY = parseInt(s.pensionMonthly, 10) || SIM_PENSION_MONTHLY;
14873:     if (s.instructorSal  !== undefined) SIM_INSTRUCTOR_SAL  = parseInt(s.instructorSal,  10) || SIM_INSTRUCTOR_SAL;
14874:     if (s.capitalTax     !== undefined) SIM_CAPITAL_TAX     = parseFloat(s.capitalTax)    || SIM_CAPITAL_TAX;
14875:     if (s.pensionAcc     !== undefined) SIM_PENSION_ACC     = parseFloat(s.pensionAcc)    || 0;

...

14898:   var fld = {
14899:     'stg-retire-age-roy':  SIM_RETIREMENT_AGE_ROY,
14900:     'stg-retire-age-yael': SIM_RETIREMENT_AGE_YAEL,
14901:     'stg-inv-rate':        SIM_RATE,
14902:     'stg-pension-rate':    SIM_PENSION_RATE,
14903:     'stg-inflation':       SIM_INFLATION,
14904:     'stg-re-growth':       SIM_RE_GROWTH_RATE,
14905:     'stg-pension-monthly':  SIM_PENSION_MONTHLY,
14906:     'stg-instructor-sal':   SIM_INSTRUCTOR_SAL,
14907:     'stg-capital-tax':      SIM_CAPITAL_TAX,
14908:     'stg-inflation-macro':  SIM_INFLATION,
14909:     'stg-pension-acc':      SIM_PENSION_ACC,
14910:     'stg-rental-income':    SIM_RENTAL_INCOME,
14911:     'stg-retire-exp':       SIM_RETIRE_EXP
14912:   };
14913:   // Text + date inputs need separate handling

...

14972:   _set('sim-instr-slider',           'sim-instr-num',            SIM_INSTRUCTOR_SAL);
14973:   _set('sim-pension-monthly-slider', 'sim-pension-monthly-num',  SIM_PENSION_MONTHLY);
14974:   _set('sim-rate-slider',            'sim-rate-num',             SIM_RATE);
14975:   _set('pns-ret-yield-slider',       'pns-ret-yield-num',        SIM_PENSION_RATE);
14976:   pnsRetirementYield = SIM_PENSION_RATE; // v168.83: keep in-memory var in sync with settings global
14977:   _set('sim-inflation-slider',       'sim-inflation-num',        SIM_INFLATION);
14978:   _set('sim-re-growth-slider',       'sim-re-growth-num',        SIM_RE_GROWTH_RATE);
14979:   // v168.104: always restore expense slider from SIM_RETIRE_EXP
14980:   // Only skip when FFS profile is active in manual mode AND provides its own expense (non-zero)
14981:   if (typeof simUpdateExpSliderRange === 'function') simUpdateExpSliderRange();
14982:   var _ffsHasExp = !isExcelLoaded() &&

...

15001:   // Read from inputs
15002:   var retireRoy      = parseInt(_rdv('stg-retire-age-roy'),  10);
15003:   var retireYael     = parseInt(_rdv('stg-retire-age-yael'), 10);
15004:   var invRate        = parseFloat(_rdv('stg-inv-rate'));
15005:   var pensionRate    = parseFloat(_rdv('stg-pension-rate'));
15006:   var inflation      = parseFloat(_rdv('stg-inflation'));
15007:   var reGrowth       = parseFloat(_rdv('stg-re-growth'));
15008:   var pensionMonthly = parseInt(_rdv('stg-pension-monthly'), 10);
15009:   var instructorSal  = parseInt(_rdv('stg-instructor-sal'),  10);
15010:   var capitalTaxEl   = document.getElementById('stg-capital-tax');
15011:   var capitalTax     = capitalTaxEl ? parseFloat(capitalTaxEl.value) : SIM_CAPITAL_TAX;

...

15028:   // Validate — fallback to current global if input is NaN
15029:   if (isNaN(retireRoy))      retireRoy      = SIM_RETIREMENT_AGE_ROY;
15030:   if (isNaN(retireYael))     retireYael     = SIM_RETIREMENT_AGE_YAEL;
15031:   if (isNaN(invRate))        invRate        = SIM_RATE;
15032:   if (isNaN(pensionRate))    pensionRate    = SIM_PENSION_RATE;
15033:   if (isNaN(inflation))      inflation      = SIM_INFLATION;
15034:   if (isNaN(reGrowth))       reGrowth       = SIM_RE_GROWTH_RATE;
15035:   if (isNaN(pensionMonthly)) pensionMonthly = SIM_PENSION_MONTHLY;
15036:   if (isNaN(instructorSal))  instructorSal  = SIM_INSTRUCTOR_SAL;
15037:   if (isNaN(capitalTax))     capitalTax     = SIM_CAPITAL_TAX;
15038:   if (isNaN(pensionAcc))     pensionAcc     = SIM_PENSION_ACC;

...

15042:   // Update global variables
15043:   SIM_RETIREMENT_AGE_ROY  = retireRoy;
15044:   SIM_RETIREMENT_AGE_YAEL = retireYael;
15045:   SIM_RATE                = invRate;
15046:   SIM_PENSION_RATE        = pensionRate;
15047:   SIM_INFLATION           = inflation;
15048:   SIM_RE_GROWTH_RATE      = reGrowth;
15049:   SIM_PENSION_MONTHLY     = pensionMonthly;
15050:   SIM_INSTRUCTOR_SAL      = instructorSal;
15051:   SIM_CAPITAL_TAX         = capitalTax;
15052:   SIM_PENSION_ACC         = pensionAcc;

...

15078:   localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify({
15079:     retireRoy:      retireRoy,
15080:     retireYael:     retireYael,
15081:     invRate:        invRate,
15082:     pensionRate:    pensionRate,
15083:     inflation:      inflation,
15084:     reGrowth:       reGrowth,
15085:     pensionMonthly: pensionMonthly,
15086:     instructorSal:  instructorSal,
15087:     capitalTax:     capitalTax,
15088:     pensionAcc:     pensionAcc,

...

15202:     'modal-user2-name':      SIM_USER2_NAME,
15203:     'modal-user1-birth':     SIM_USER1_BIRTH,
15204:     'modal-user2-birth':     SIM_USER2_BIRTH,
15205:     'modal-retire-age-roy':  SIM_RETIREMENT_AGE_ROY,
15206:     'modal-retire-age-yael': SIM_RETIREMENT_AGE_YAEL,
15207:     'modal-inflation':       SIM_INFLATION,
15208:     'modal-capital-tax':     SIM_CAPITAL_TAX
15209:   };
15210:   Object.keys(fields).forEach(function(id) {
15211:     var el = document.getElementById(id);
15212:     if (el) {

...

15248:   var user2Name     = (document.getElementById('modal-user2-name')      || {}).value;
15249:   var user1Birth    = (document.getElementById('modal-user1-birth')     || {}).value || '';
15250:   var user2Birth    = (document.getElementById('modal-user2-birth')     || {}).value || '';
15251:   var retireRoy     = parseInt((document.getElementById('modal-retire-age-roy')  || {}).value,  10);
15252:   var retireYael    = parseInt((document.getElementById('modal-retire-age-yael') || {}).value, 10);
15253:   var inflation     = parseFloat((document.getElementById('modal-inflation')     || {}).value);
15254:   var capitalTax    = parseFloat((document.getElementById('modal-capital-tax')   || {}).value);
15255:   // v137.0: default view preference
15256:   var defViewEl     = document.getElementById('setting-default-view');
15257:   var defaultZoom   = defViewEl ? (defViewEl.value || 'full') : 'full';
15258:   if (['full','retirement','decade'].indexOf(defaultZoom) < 0) defaultZoom = 'full';

...

15262:   if (!user2Name || !user2Name.trim()) user2Name = SIM_USER2_NAME;
15263:   user1Name = user1Name.trim();
15264:   user2Name = user2Name.trim();
15265:   if (isNaN(retireRoy))  retireRoy  = SIM_RETIREMENT_AGE_ROY;
15266:   if (isNaN(retireYael)) retireYael = SIM_RETIREMENT_AGE_YAEL;
15267:   if (isNaN(inflation))  inflation  = SIM_INFLATION;
15268:   if (isNaN(capitalTax)) capitalTax = SIM_CAPITAL_TAX;
15269: 
15270:   // Update globals
15271:   SIM_USER1_NAME          = user1Name;
15272:   SIM_USER2_NAME          = user2Name;
15273:   SIM_USER1_BIRTH         = user1Birth;
15274:   SIM_USER2_BIRTH         = user2Birth;
15275:   SIM_RETIREMENT_AGE_ROY  = retireRoy;
15276:   SIM_RETIREMENT_AGE_YAEL = retireYael;
15277:   SIM_INFLATION           = inflation;
15278:   SIM_CAPITAL_TAX         = capitalTax;
15279:   // v137.0: save default zoom preference
15280:   SIM_DEFAULT_ZOOM        = defaultZoom;
15281: 
15282:   // v128.0: sync birth years + recalculate ALL phase boundaries

...

15288:     'stg-user2-name':      user2Name,
15289:     'stg-user1-birth':     user1Birth,
15290:     'stg-user2-birth':     user2Birth,
15291:     'stg-retire-age-roy':  retireRoy,
15292:     'stg-retire-age-yael': retireYael,
15293:     'stg-inflation':       inflation,
15294:     'stg-inflation-macro': inflation,
15295:     'stg-capital-tax':     capitalTax
15296:   };
15297:   Object.keys(syncMap).forEach(function(id) {
15298:     var el = document.getElementById(id);
15299:     if (el) el.value = syncMap[id];

...

15307:   s.user2Name   = user2Name;
15308:   s.user1Birth  = user1Birth;
15309:   s.user2Birth  = user2Birth;
15310:   s.retireRoy   = retireRoy;
15311:   s.retireYael  = retireYael;
15312:   s.inflation   = inflation;
15313:   s.capitalTax  = capitalTax;
15314:   s.defaultZoom = defaultZoom; // v137.0
15315:   localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(s));
15316: 
15317:   // Apply name labels everywhere

...

15386:   //         had more months (e.g. April 26 = index 15) than the hardcoded 15 demo values.
15387:   var N = LABELS.length;
15388:   var _demoBase = {
15389:     // פוליסת חיסכון (harel) — savings policy, grows steadily
15390:     'הראלמגוון-פוליסתחיסכ': [1800,1820,1845,1865,1890,1915,1940,1960,1985,2010,2035,2058,2080,2103,2125],
15391:     // קרן השתלמות (hishtalmut) — education fund, main savings vehicle
15392:     'מיטבקהש912-443286':    [2400,2428,2457,2487,2518,2550,2582,2615,2649,2683,2718,2754,2790,2827,2864],
15393:     // קופת גמל (gemel) — pension-type savings
15394:     'מורגמל1375900':        [820,830,840,851,862,874,886,898,911,924,937,951,965,979,993],
15395:     // דירה (dira) — apartment, constant
15396:     'דירה':                 [2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800],

...

15694:   if (!confirm('אישור סופי: כל הנתונים יימחקו לצמיתות. ללא אפשרות שחזור. להמשיך?')) return;
15695:   try { localStorage.clear(); } catch(e) {}
15696:   try { sessionStorage.clear(); } catch(e) {}
15697:   // Reset hard-coded defaults before reload so first paint is clean
15698:   if (typeof SIM_RATE          !== 'undefined') SIM_RATE          = 4;
15699:   if (typeof SIM_INFLATION     !== 'undefined') SIM_INFLATION     = 2.5;
15700:   if (typeof SIM_CAPITAL_TAX   !== 'undefined') SIM_CAPITAL_TAX   = 25;
15701:   if (typeof SIM_PENSION_RATE  !== 'undefined') SIM_PENSION_RATE  = 3;
15702:   if (typeof SIM_RE_GROWTH_RATE!== 'undefined') SIM_RE_GROWTH_RATE= 2.5;
15703:   if (typeof SIM_RETIRE_EXP    !== 'undefined') SIM_RETIRE_EXP    = 29000;
15704:   if (typeof SIM_RETIREMENT_AGE_ROY  !== 'undefined') SIM_RETIREMENT_AGE_ROY  = 67;

...

16922:     var isoDate = /^\d{8}$/.test(rawDate)
16923:       ? rawDate.slice(0,4) + '-' + rawDate.slice(4,6) + '-' + rawDate.slice(6,8)
16924:       : rawDate;
16925: 
16926:     var segs = '';
16927:     if (fd.accumExempt_tikrat1 > 0) {
16928:       segs += '<PerutYitraLeTkufa>'
16929:             + '<TIKRAT-HAFKADA-MUTEVET>1</TIKRAT-HAFKADA-MUTEVET>'
16930:             + '<SACH-ITRA-LESHICHVA-BESHACH>' + Math.round(fd.accumExempt_tikrat1) + '</SACH-ITRA-LESHICHVA-BESHACH>'
16931:             + '</PerutYitraLeTkufa>';
16932:     }
16933:     if (fd.accumTaxable_tikrat2 > 0) {
16934:       segs += '<PerutYitraLeTkufa>'
16935:             + '<TIKRAT-HAFKADA-MUTEVET>2</TIKRAT-HAFKADA-MUTEVET>'
16936:             + '<SACH-ITRA-LESHICHVA-BESHACH>' + Math.round(fd.accumTaxable_tikrat2) + '</SACH-ITRA-LESHICHVA-BESHACH>'
16937:             + '</PerutYitraLeTkufa>';
16938:     }
16939: 
16940:     return {
16941:       'מספר פוליסה': String(fd.fundNumber || ''),

...

16945:       rawXml: '<HeshbonOPolisa>'
16946:               + (isoDate ? '<TAARICH-HITZTARFUT-RISHON>' + isoDate + '</TAARICH-HITZTARFUT-RISHON>' : '')
16947:               + segs
16948:               + '</HeshbonOPolisa>',
16949:       joinDate:             isoDate || null,
16950:       accumExempt_tikrat1:  fd.accumExempt_tikrat1  || 0,
16951:       accumTaxable_tikrat2: fd.accumTaxable_tikrat2 || 0,
16952:       isActive: true,
16953:       _agentDataSource: true
16954:     };
16955:   });
16956: }

...

17333: // Business logic follows Mislaka_Rules.md Section 12.
17334: // ─────────────────────────────────────────────────────────────────────────────
17335: 
17336: var _sfCurrentItem    = null;
17337: var _sfPieChart       = null;
17338: var _sfWithdrawalMode = 'pct'; // 'pct' | 'fixed'
17339: var _sfLastTaxDetails = null;
17340: 
17341: function ffsOpenStudyFundModal(itemId) {
17342:   if (typeof APP_MODE === 'undefined' || APP_MODE !== 'SIMULATOR') return;
17343:   var item = (FFS_PROFILE.investments || []).find(function(x) { return x.id === itemId; });
17344:   if (!item) return;
17345:   _sfCurrentItem    = item;
17346:   _sfWithdrawalMode = 'pct';
17347: 
17348:   // Fund name + ID
17349:   var nameEl = document.getElementById('sf-fund-name');
17350:   if (nameEl) nameEl.textContent = item.name || '';
17351:   var idEl = document.getElementById('sf-fund-id');

...

17364: 
17365:   // Read macro defaults — live DOM values take priority over FFS_PROFILE
17366:   var _domVal = function(id) { var el = document.getElementById(id); return el ? parseFloat(el.value) : NaN; };
17367:   var macroInvReturn = !isNaN(_domVal('ffs-macro-yield'))        ? _domVal('ffs-macro-yield')        : (FFS_PROFILE.macroYield       != null ? FFS_PROFILE.macroYield       : 4.0);
17368:   var macroPenReturn = !isNaN(_domVal('ffs-macro-pension-rate')) ? _domVal('ffs-macro-pension-rate') : (FFS_PROFILE.macroPensionRate != null ? FFS_PROFILE.macroPensionRate : 3.0);
17369:   var macroInflation = !isNaN(_domVal('ffs-macro-inflation'))    ? _domVal('ffs-macro-inflation')    : (FFS_PROFILE.macroInflation   != null ? FFS_PROFILE.macroInflation   : 2.5);
17370: 
17371:   // Timeline: scale=10yr (max=120 months), thumb starts at 0 (today, physical right)
17372:   var tlSl = document.getElementById('sf-timeline-slider');
17373:   var tlIn = document.getElementById('sf-timeline-input');
17374:   if (tlSl) { tlSl.min = 0; tlSl.max = 120; tlSl.value = 0; }

...

17384:   var prSl = document.getElementById('sf-pen-return-slider');
17385:   var prIn = document.getElementById('sf-pen-return-input');
17386:   if (prSl) prSl.value = macroPenReturn;
17387:   if (prIn) prIn.value = macroPenReturn;
17388: 
17389:   // Inflation
17390:   var infSl = document.getElementById('sf-inflation-slider');
17391:   var infIn = document.getElementById('sf-inflation-input');
17392:   if (infSl) infSl.value = macroInflation;
17393:   if (infIn) infIn.value = macroInflation;
17394: 
17395:   // Withdrawal: default 100%
17396:   var wdSl = document.getElementById('sf-withdrawal-slider');
17397:   var wdIn = document.getElementById('sf-withdrawal-input');
17398:   if (wdSl) wdSl.value = 100;
17399:   if (wdIn) wdIn.value = 100;
17400: 
17401:   // Fixed withdrawal slider: max = balance in ₪ (balance is in K)
17402:   var fixedMax = Math.round((Number(item.balance) || 0) * 1000);
17403:   var wdFixSl = document.getElementById('sf-withdrawal-fixed-slider');
17404:   var wdFixIn = document.getElementById('sf-withdrawal-fixed-input');
17405:   if (wdFixSl) { wdFixSl.max = fixedMax; wdFixSl.value = fixedMax; }
17406:   if (wdFixIn) wdFixIn.value = fixedMax;
17407: 
17408:   // Ensure pct mode is shown on open
17409:   _sfApplyWdModeUI();

...

17464:     if (_sfLastTaxDetails) {
17465:       msgEl.innerHTML = _sfLastTaxDetails.explanation.rendered;
17466:       var _tid = _sfLastTaxDetails.explanation.templateId;
17467:       msgEl.style.color = _tid === 'SF_MISSING_XML'                                   ? '#d97706'
17468:                         : (_tid === 'SF_MANUAL_CALIBRATION' ||
17469:                            _tid === 'SF_EXEMPT_SENIORITY'   ||
17470:                            _tid === 'SF_EXEMPT_AGE')                                   ? '#16a34a'
17471:                         : '#1e293b';
17472:     }
17473:     msgEl.style.visibility = 'visible';
17474:   }
17475: }

...

17576:       if (/^\d{8}$/.test(rawDate)) {
17577:         isoDate = rawDate.slice(0,4) + '-' + rawDate.slice(4,6) + '-' + rawDate.slice(6,8);
17578:       }
17579: 
17580:       var segs = '';
17581:       if (fd.accumExempt_tikrat1 > 0) {
17582:         segs += '<PerutYitraLeTkufa>'
17583:               + '<TIKRAT-HAFKADA-MUTEVET>1</TIKRAT-HAFKADA-MUTEVET>'
17584:               + '<SACH-ITRA-LESHICHVA-BESHACH>' + Math.round(fd.accumExempt_tikrat1) + '</SACH-ITRA-LESHICHVA-BESHACH>'
17585:               + '</PerutYitraLeTkufa>';
17586:       }
17587:       if (fd.accumTaxable_tikrat2 > 0) {
17588:         segs += '<PerutYitraLeTkufa>'
17589:               + '<TIKRAT-HAFKADA-MUTEVET>2</TIKRAT-HAFKADA-MUTEVET>'
17590:               + '<SACH-ITRA-LESHICHVA-BESHACH>' + Math.round(fd.accumTaxable_tikrat2) + '</SACH-ITRA-LESHICHVA-BESHACH>'
17591:               + '</PerutYitraLeTkufa>';
17592:       }
17593: 
17594:       // Synthetic plain-XML rawXml — passes _sfCalculateTax rawXml gate with no parser changes
17595:       inv.rawXml = '<HeshbonOPolisa>'
17596:         + (isoDate ? '<TAARICH-HITZTARFUT-RISHON>' + isoDate + '</TAARICH-HITZTARFUT-RISHON>' : '')
17597:         + segs
17598:         + '</HeshbonOPolisa>';
17599: 
17600:       if (isoDate) inv.joinDate = isoDate;
17601:       if (fd.accumExempt_tikrat1  >= 0) inv.accumExempt_tikrat1  = fd.accumExempt_tikrat1;
17602:       if (fd.accumTaxable_tikrat2 >= 0) inv.accumTaxable_tikrat2 = fd.accumTaxable_tikrat2;
17603:       inv._agentDataSource = true;
17604:       updated++;
17605:     });
17606:   });
17607: 

...

17642: 
17643: function _sfBuildAutoReceipt(grossK, taxDetails, pctFraction) {
17644:   var fmt    = function(n) { return Math.round(n).toLocaleString('he-IL'); };
17645:   var pctLbl = Math.round(pctFraction * 100) + '%';
17646:   var depK   = taxDetails.depositsPropK      || 0;
17647:   var profK  = taxDetails.taxableProfitPropK || 0;
17648:   var taxK   = taxDetails.totalTaxDue        || 0;
17649:   var netK   = taxDetails.netToBank          || 0;
17650:   return '<div style="font-size:11px;font-weight:700;color:#374151;margin-bottom:8px;">פירוט חישוב (נתוני מסלקה)</div>'
17651:     + '<div style="display:flex;flex-direction:column;gap:1px;">'
17652:     + _sfReceiptRow('סכום משיכה (' + pctLbl + ')', fmt(grossK) + ' K ₪', '#1e293b')

...

17748: function _sfSyncPair(key, source) {
17749:   var pairs = {
17750:     'timeline':         ['sf-timeline-slider',         'sf-timeline-input'],
17751:     'inv-return':       ['sf-inv-return-slider',       'sf-inv-return-input'],
17752:     'pen-return':       ['sf-pen-return-slider',       'sf-pen-return-input'],
17753:     'inflation':        ['sf-inflation-slider',        'sf-inflation-input'],
17754:     'withdrawal':       ['sf-withdrawal-slider',       'sf-withdrawal-input'],
17755:     'withdrawal-fixed': ['sf-withdrawal-fixed-slider', 'sf-withdrawal-fixed-input']
17756:   };
17757:   var ids = pairs[key];
17758:   if (!ids) return;
17759:   var slId = ids[0], inId = ids[1];
17760:   var slEl = document.getElementById(slId);

...

17784: }
17785: 
17786: function _sfSyncAllSliders() {
17787:   var ids = [
17788:     'sf-timeline-slider', 'sf-inv-return-slider', 'sf-pen-return-slider',
17789:     'sf-inflation-slider', 'sf-withdrawal-slider', 'sf-withdrawal-fixed-slider'
17790:   ];
17791:   ids.forEach(function(id) {
17792:     var el = document.getElementById(id);
17793:     if (!el) return;
17794:     var min = parseFloat(el.min) || 0;

...

17797:     var pct = max > min ? ((val - min) / (max - min) * 100).toFixed(1) : '0';
17798:     el.style.setProperty('--pns-val', pct + '%');
17799:   });
17800: }
17801: 
17802: // Withdrawal mode toggle
17803: function _sfSetWdMode(mode) {
17804:   _sfWithdrawalMode = mode;
17805:   // Cross-convert when switching
17806:   if (_sfCurrentItem) {
17807:     var balK = Number(_sfCurrentItem.balance) || 0;
17808:     var projBalK = _sfGetProjectedBalance(); // K units
17809:     if (mode === 'fixed') {
17810:       // Convert current % to fixed K
17811:       var pctEl = document.getElementById('sf-withdrawal-slider');
17812:       var pct = pctEl ? parseFloat(pctEl.value) : 100;
17813:       var fixedK = Math.round(projBalK * pct / 100);
17814:       var wdFixSl = document.getElementById('sf-withdrawal-fixed-slider');
17815:       var wdFixIn = document.getElementById('sf-withdrawal-fixed-input');
17816:       if (wdFixSl) { wdFixSl.max = Math.round(projBalK); wdFixSl.value = fixedK; }
17817:       if (wdFixIn) wdFixIn.value = fixedK;
17818:     } else {
17819:       // Convert current fixed K to %
17820:       var fixEl = document.getElementById('sf-withdrawal-fixed-slider');
17821:       var fixedVal = fixEl ? parseFloat(fixEl.value) : 0;
17822:       var pctConverted = projBalK > 0 ? Math.min(100, Math.round(fixedVal / projBalK * 100)) : 100;
17823:       var wdSl = document.getElementById('sf-withdrawal-slider');
17824:       var wdIn = document.getElementById('sf-withdrawal-input');
17825:       if (wdSl) wdSl.value = pctConverted;
17826:       if (wdIn) wdIn.value = pctConverted;
17827:     }
17828:   }
17829:   _sfApplyWdModeUI();

...

17834: function _sfApplyWdModeUI() {
17835:   var pctRow   = document.getElementById('sf-wd-pct-row');
17836:   var fixedRow = document.getElementById('sf-wd-fixed-row');
17837:   var pctBtn   = document.getElementById('sf-wd-pct-btn');
17838:   var fixBtn   = document.getElementById('sf-wd-fixed-btn');
17839:   var isPct = (_sfWithdrawalMode === 'pct');
17840:   if (pctRow)   pctRow.style.display   = isPct ? 'flex' : 'none';
17841:   if (fixedRow) fixedRow.style.display = isPct ? 'none' : 'flex';
17842:   var onSt  = 'padding:1px 7px;font-size:11px;font-family:Heebo,sans-serif;cursor:pointer;border:none;background:#2563eb;color:white;font-weight:700;';
17843:   var offSt = 'padding:1px 7px;font-size:11px;font-family:Heebo,sans-serif;cursor:pointer;border:none;background:#f1f5f9;color:#64748b;font-weight:600;';
17844:   if (pctBtn)  pctBtn.style.cssText  = isPct ? onSt : offSt;

...

17849: function _sfGetProjectedBalance() {
17850:   if (!_sfCurrentItem) return 0;
17851:   var baseK  = (Number(_sfCurrentItem.balance) || 0);
17852:   var tlSl   = document.getElementById('sf-timeline-slider');
17853:   var irSl   = document.getElementById('sf-inv-return-slider');
17854:   var infSl  = document.getElementById('sf-inflation-slider');
17855:   var months = tlSl  ? parseFloat(tlSl.value || 0) : 0;
17856:   var invRet = irSl  ? parseFloat(irSl.value)  : 4;
17857:   var inf    = infSl ? parseFloat(infSl.value) : 2.5;
17858:   var years  = months / 12;
17859:   var realR  = (1 + invRet / 100) / (1 + inf / 100) - 1;
17860:   return baseK * Math.pow(1 + realR, years);
17861: }
17862: 
17863: function _sfCalcSegments(item) {
17864:   var segs = item.taxSegments || [];
17865:   var exemptPrincipal = 0, taxablePrincipal = 0, exemptProfit = 0, taxableProfit = 0;
17866:   if (segs.length > 0) {
17867:     segs.forEach(function(seg) {
17868:       var accum = (seg.accumulation != null && seg.accumulation !== '') ? Number(seg.accumulation) : null;
17869:       if (accum == null) return;
17870:       var dep   = (seg.deposits != null && seg.deposits !== '') ? Number(seg.deposits) : 0;
17871:       var profit = Math.max(0, accum - dep);
17872:       if (Number(seg.tikrat) === 1) { exemptPrincipal  += dep; exemptProfit  += profit; }
17873:       else if (Number(seg.tikrat) === 2) { taxablePrincipal += dep; taxableProfit += profit; }
17874:     });
17875:   } else {
17876:     exemptPrincipal = (item.balance != null && item.balance !== '') ? Number(item.balance) : 0;
17877:   }
17878:   return { exemptPrincipal: exemptPrincipal, taxablePrincipal: taxablePrincipal, exemptProfit: exemptProfit, taxableProfit: taxableProfit };
17879: }
17880: 
17881: // v181.21: Tax engine — pure calculation, no DOM access. Returns TaxDetails per docs/TaxLogic.md.
17882: // Both Simulation and Real Data modes call this; mode affects the product fed in, not the rules.
17883: function _sfCalculateTax(product, withdrawalPct, globalConfig) {
17884:   var cfg = globalConfig || window.REAL_TAX_CONFIG || {};
17885: 
17886:   // ── Config resolution (all fallbacks, no hardcoded statics) ─────────────────
17887:   var rawCapTax        = cfg.capitalTaxRate   != null ? cfg.capitalTaxRate   : (typeof SIM_CAPITAL_TAX !== 'undefined' ? SIM_CAPITAL_TAX : 0.25);
17888:   var capitalTaxRate   = rawCapTax > 1 ? rawCapTax / 100 : rawCapTax;  // normalize: 25 → 0.25
17889:   var sfSeniorityYears = cfg.sfSeniorityYears != null ? cfg.sfSeniorityYears : 6;
17890:   var retirementAge    = cfg.retirementAge    != null ? cfg.retirementAge    : 67;
17891:   var pfWithdrawalAge  = cfg.pfWithdrawalAge  != null ? cfg.pfWithdrawalAge  : 60;
17892:   var exemptBasket     = cfg.taxBasket        != null ? cfg.taxBasket        : (cfg.exemptBasket != null ? cfg.exemptBasket : (typeof pnsExemptBasket !== 'undefined' ? pnsExemptBasket : 882924));
17893:   var brackets         = (cfg.taxBrackets && cfg.taxBrackets.length === 6) ? cfg.taxBrackets : [7010, 10060, 16150, 22440, 46690, 60130];
17894:   var rates            = (cfg.taxRates    && cfg.taxRates.length    === 7) ? cfg.taxRates    : [10, 14, 20, 31, 35, 47, 50];
17895:   var creditValue      = cfg.creditPointValue != null ? cfg.creditPointValue : 242;
17896:   var creditPts        = cfg.creditPoints     != null ? cfg.creditPoints     : 2.25;
17897: 
17898:   // ── rawXml gate ───────────────────────────────────────────────────────────────
17899:   if (!product.rawXml) {
17900:     return {
17901:       productType: 'לא ידוע', sugMutzar: null, seniority: '—', memberAge: null,
17902:       exemptionApplied: true, exemptionReason: 'rawXml חסר',
17903:       segments: [], withdrawalPct: 0,
17904:       grossWithdrawal: 0, totalTaxDue: null, netToBank: null, currency: 'ILS', unit: 'K',
17905:       confidence: { level: 'low', score: 0, notes: ['rawXml חסר — יש לייבא מחדש את קבצי המסלקה'] },
17906:       explanation: { templateId: 'SF_MISSING_XML', placeholders: {},
17907:                      rendered: '<div>נתוני המס חסרים. אנא טען מחדש את קבצי המסלקה כדי לצפות בסימולציה.</div>' },
17908:       disclaimer: 'יש לייבא מחדש את קובץ המסלקה כדי לאפשר חישוב מס.'
17909:     };

...

18001: 
18002:   // ── Downgrade to Low if two+ Medium triggers ─────────────────────────────────
18003:   if (mediumTriggers >= 2 && confidence.level !== 'low') { confidence.level = 'low'; confidence.score = 50; }
18004:   else if (mediumTriggers >= 1 && confidence.level === 'high') { confidence.level = 'medium'; confidence.score = 80; }
18005: 
18006:   // ── Balance & withdrawal ─────────────────────────────────────────────────────
18007:   var balanceK    = (product.balance != null && product.balance !== '') ? Number(product.balance) : 0;
18008:   var wdFraction  = (withdrawalPct != null) ? Math.min(1, Math.max(0, Number(withdrawalPct))) : 1;
18009:   var grossK      = balanceK * wdFraction;
18010: 
18011:   // ── Tax calculation branch ───────────────────────────────────────────────────
18012:   var taxDueK = 0;
18013:   var exemptionApplied = false, exemptionReason = '', templateId = '', placeholders = {};
18014:   var effSeniority = seniority != null ? seniority : 0;
18015:   var effAge       = memberAge != null ? memberAge : 0;
18016: 
18017:   if (sugMutzar === 4) {
18018:     // Study Fund path
18019:     // Israeli tax law: tikrat=2 (above-ceiling) profit is ALWAYS taxed; tikrat=1 is exempt only when eligible
18020:     var isExemptEligible = (effSeniority >= sfSeniorityYears) ||
18021:                            (memberAge != null && effAge >= retirementAge);
18022:     // v181.74: REAL Capital Gains Tax — nominal profit minus inflation adjustment on principal
18023:     var inflRate = (cfg.inflation != null ? cfg.inflation : 0) / 100;
18024:     // tikrat=2 (Taxable segment): realProfit = nominalProfit − inflation × taxablePrincipal
18025:     var nomTxProfit   = seg.taxableProfit  * wdFraction;
18026:     var inflAdjTx     = inflRate * seg.taxablePrincipal * wdFraction;
18027:     var realTxProfit  = Math.max(0, nomTxProfit - inflAdjTx); // floor: if real profit ≤ 0, tax = 0
18028:     var taxableSegTax = realTxProfit * capitalTaxRate;
18029:     // tikrat=1 (Exempt segment): only taxed when NOT eligible; same real logic
18030:     var nomExProfit   = seg.exemptProfit   * wdFraction;
18031:     var inflAdjEx     = inflRate * seg.exemptPrincipal * wdFraction;
18032:     var realExProfit  = Math.max(0, nomExProfit - inflAdjEx);
18033:     var exemptSegTax  = isExemptEligible ? 0 : realExProfit * capitalTaxRate;
18034:     taxDueK = taxableSegTax + exemptSegTax;
18035: 
18036:     if (seg.taxableProfit <= 0 && seg.taxablePrincipal <= 0 && seg.exemptPrincipal <= 0) {
18037:       // No segment data at all
18038:       taxDueK = 0; exemptionApplied = true;
18039:       templateId = 'SF_NO_TAXABLE_PROFIT';
18040:       exemptionReason = 'אין נתוני מקטעים';
18041:     } else if (taxableSegTax > 0 && isExemptEligible) {
18042:       // Mixed: tikrat=1 exempt by seniority/age, tikrat=2 still taxed
18043:       exemptionApplied = false;
18044:       templateId = 'SF_MIXED';
18045:       placeholders = { RATE: Math.round(capitalTaxRate * 100) + '%' };
18046:       exemptionReason = 'קרן מוטבת פטורה, קרן חייבת חייבת';
18047:     } else if (isExemptEligible) {
18048:       // Fully exempt: no taxable segment profit
18049:       taxDueK = 0; exemptionApplied = true;
18050:       if (effSeniority >= sfSeniorityYears) {
18051:         templateId = 'SF_EXEMPT_SENIORITY';
18052:         placeholders = { X: String(Math.floor(effSeniority)) };
18053:         exemptionReason = 'ותק מעל ' + sfSeniorityYears + ' שנים';
18054:       } else {
18055:         templateId = 'SF_EXEMPT_AGE';
18056:         placeholders = { X: String(Math.floor(effAge)) };
18057:         exemptionReason = 'גיל פרישה';
18058:       }
18059:     } else {
18060:       // Not eligible: both tikrat=1 and tikrat=2 profits taxed
18061:       if (seniority == null) {
18062:         templateId = 'SF_UNKNOWN_SENIORITY';
18063:         placeholders = { RATE: Math.round(capitalTaxRate * 100) + '%' };
18064:       } else {
18065:         templateId = 'SF_TAXABLE';
18066:         placeholders = { X: String(Math.floor(effSeniority)), RATE: Math.round(capitalTaxRate * 100) + '%' };
18067:       }
18068:     }
18069: 
18070:   } else if (sugMutzar === 3) {
18071:     // Provident Fund path
18072:     if (effAge >= pfWithdrawalAge) {
18073:       var exemptAmt  = Math.min(balanceK, exemptBasket);
18074:       var taxableAmt = Math.max(0, balanceK - exemptAmt);
18075:       taxDueK = _sfProgressiveTax(taxableAmt) * wdFraction;
18076:       templateId = 'PF_EXEMPT_AGE';
18077:       placeholders = { X: String(Math.floor(effAge)), Y: Math.round(exemptAmt).toLocaleString('he-IL'), Z: Math.round(taxableAmt).toLocaleString('he-IL') };
18078:     } else {
18079:       taxDueK = _sfProgressiveTax(balanceK) * wdFraction;
18080:       templateId = 'PF_TAXABLE_YOUNG';
18081:       placeholders = {};
18082:     }
18083:     if (product.isVatika) templateId = 'PF_VATIKA';
18084:   }
18085: 

...

18090:   var senMonths = Math.round((effSeniority - senYears) * 12);
18091:   var senLabel  = (senYears > 0 ? senYears + ' שנים' : '') + (senYears > 0 && senMonths > 0 ? ' ו-' : '') + (senMonths > 0 ? senMonths + ' חודשים' : '') || '0 חודשים';
18092: 
18093:   // ── Explainability templates ─────────────────────────────────────────────────
18094:   var TEMPLATES = {
18095:     SF_EXEMPT_SENIORITY:  'החישוב מתבסס על ותק של [X] שנים, ולכן הקופה פטורה ממס.',
18096:     SF_EXEMPT_AGE:        'החבר הגיע לגיל פרישה ([X]), ולכן הקופה פטורה ממס ללא תלות בוותק.',
18097:     SF_TAXABLE:           'ותק של [X] שנים בלבד — חלק הרווח בקרן החייבת חייב במס רווח הון של [RATE].',
18098:     SF_NO_TAXABLE_PROFIT: 'אין רווחים החייבים במס בקופה זו (כל הכספים מסווגים כפטורים).',
18099:     SF_MIXED:             'הקרן המוטבת פטורה בשל ותק. חלה חבות מס של [RATE] על רווחי הקרן החייבת (מעל התקרה).',
18100:     SF_UNKNOWN_SENIORITY: '<span title="המידע חסר במסלקה. ניתן למצוא את נתוני ההפקדות והתאריכים בדו&quot;ח השנתי של הגוף המנהל. ניתן להזינם כאן ידנית לדיוק מלא." style="border-bottom:1px dotted #6b7280;cursor:help;white-space:nowrap;">החישוב מתבסס על נתונים חלקיים</span> — חבות מס של [RATE] על הקרן החייבת (מעל התקרה).',
18101:     PF_EXEMPT_AGE:        'משיכה בגיל [X] — הסכום עד [Y] ₪ פטור ממס (סל פטור). יתרה של [Z] ₪ חייבת לפי מדרגות.',
18102:     PF_TAXABLE_YOUNG:     'משיכה לפני גיל 60 מחושבת כהכנסה חייבת לפי מדרגות מס הכנסה.',
18103:     PF_VATIKA:            'קרן וותיקה — חישוב המס מבוסס על כללי הפטור של המשטר הישן ועשוי להיות שונה מהחישוב הסטנדרטי.',
18104:     SF_MISSING_XML:       '<span style="background:#fef3c7;color:#92400e;font-weight:700;padding:2px 8px;border-radius:4px;font-size:11px;">⚠ אמינות נמוכה — Low Confidence</span> ' +
18105:                           'אין נתוני פירוט פטור/חייב מהמסלקה. המס מחושב שמרנית על מלוא הרווח החייב. ' +
18106:                           'לחישוב מדויק: <b>העלה דו"ח שנתי PDF</b> או הזן ידנית את הסכום הפטור מול החייב בטופס למטה.' // v181.74
18107:   };

...

18117:     '</ul>' +
18118:     '</div>';
18119: 
18120:   // ── Segment detail rows for transparency ────────────────────────────────────
18121:   var segRows = [
18122:     { type: 'קרן פטורה',  tikrat: 1, principal: seg.exemptPrincipal,   profit: seg.exemptProfit,   taxRate: 0,              taxDue: 0 },
18123:     { type: 'קרן חייבת',  tikrat: 2, principal: seg.taxablePrincipal,  profit: seg.taxableProfit,  taxRate: exemptionApplied ? 0 : capitalTaxRate, taxDue: exemptionApplied ? 0 : realTxProfit * capitalTaxRate } // v181.74: real CGT
18124:   ];
18125: 
18126:   return {
18127:     productType: productType,
18128:     sugMutzar:   sugMutzar,
18129:     seniority:   senLabel,
18130:     memberAge:   memberAge != null ? Math.floor(memberAge) : null,
18131:     exemptionApplied:  exemptionApplied,
18132:     exemptionReason:   exemptionReason,
18133:     segments:    segRows,
18134:     withdrawalPct: wdFraction,
18135:     grossWithdrawal: Math.round(grossK),
18136:     totalTaxDue:    Math.round(taxDueK),
18137:     netToBank:      Math.round(netK),
18138:     currency: 'ILS', unit: 'K',
18139:     confidence: confidence,
18140:     explanation: { templateId: templateId, placeholders: placeholders, rendered: tpl },
18141:     disclaimer:  DISCLAIMER,
18142:     joinDateFormatted:   _sfFmtDate(joinDate),
18143:     depositsPropK:       Math.round((seg.exemptPrincipal + seg.taxablePrincipal) * wdFraction),
18144:     taxableProfitPropK:  Math.round((templateId === 'SF_TAXABLE'
18145:                            ? (seg.exemptProfit + seg.taxableProfit)
18146:                            : seg.taxableProfit) * wdFraction)
18147:   };
18148: }
18149: 
18150: function _sfRecalculate() {
18151:   if (!_sfCurrentItem) return;
18152:   var item = _sfCurrentItem;
18153: 
18154:   var tlSl  = document.getElementById('sf-timeline-slider');
18155:   var irSl  = document.getElementById('sf-inv-return-slider');
18156:   var infSl = document.getElementById('sf-inflation-slider');
18157: 
18158:   var months     = tlSl  ? parseFloat(tlSl.value || 0) : 0;
18159:   var invReturn  = irSl  ? parseFloat(irSl.value)  : 4;
18160:   var inflation  = infSl ? parseFloat(infSl.value) : 2.5;
18161:   var years      = months / 12;
18162: 
18163:   // Timeline display label: X שנים וY חודשים
18164:   var tlYears  = Math.floor(years);
18165:   var tlMonths = Math.round((years - tlYears) * 12);

...

18176:   var irV = document.getElementById('sf-inv-return-val');
18177:   if (irV) irV.textContent = invReturn.toFixed(1) + '%';
18178:   var prV = document.getElementById('sf-pen-return-val');
18179:   var prSl = document.getElementById('sf-pen-return-slider');
18180:   if (prV && prSl) prV.textContent = parseFloat(prSl.value).toFixed(1) + '%';
18181:   var infV = document.getElementById('sf-inflation-val');
18182:   if (infV) infV.textContent = inflation.toFixed(1) + '%';
18183: 
18184:   // Project balance (real return = inflation-adjusted)
18185:   var baseK    = (item.balance != null && item.balance !== '') ? Number(item.balance) : 0;
18186:   var realR    = (1 + invReturn / 100) / (1 + inflation / 100) - 1;
18187:   var growthF  = Math.pow(1 + realR, years);
18188:   var projBalK = baseK * growthF;
18189: 
18190:   // Resolve withdrawal fraction
18191:   var pctFraction;
18192:   if (_sfWithdrawalMode === 'fixed') {
18193:     var fixEl = document.getElementById('sf-withdrawal-fixed-slider');
18194:     var fixedValK = fixEl ? parseFloat(fixEl.value) : 0; // in K ₪
18195:     pctFraction = projBalK > 0 ? Math.min(1, fixedValK / projBalK) : 0;
18196:     var wdV = document.getElementById('sf-withdrawal-val');
18197:     if (wdV) wdV.style.display = 'none';
18198:     // keep % slider in sync silently
18199:     var wdSl = document.getElementById('sf-withdrawal-slider');
18200:     var wdIn = document.getElementById('sf-withdrawal-input');
18201:     var syncPct = Math.round(pctFraction * 100);
18202:     if (wdSl && document.activeElement !== wdSl) wdSl.value = syncPct;
18203:     if (wdIn && document.activeElement !== wdIn) wdIn.value = syncPct;
18204:   } else {
18205:     var wdSlEl = document.getElementById('sf-withdrawal-slider');
18206:     var pct = wdSlEl ? parseInt(wdSlEl.value, 10) : 100;
18207:     pctFraction = pct / 100;
18208:     var wdVEl = document.getElementById('sf-withdrawal-val');
18209:     if (wdVEl) wdVEl.style.display = 'none';
18210:     // keep fixed slider in sync silently (K ₪ units)
18211:     var fixSl = document.getElementById('sf-withdrawal-fixed-slider');
18212:     var fixIn = document.getElementById('sf-withdrawal-fixed-input');
18213:     var syncFixed = Math.round(projBalK * pctFraction);
18214:     if (fixSl) { fixSl.max = Math.round(projBalK); if (document.activeElement !== fixSl) fixSl.value = syncFixed; }
18215:     if (fixIn && document.activeElement !== fixIn) fixIn.value = syncFixed;
18216:     var fixMaxLbl = document.getElementById('sf-wd-fix-max-label');
18217:     if (fixMaxLbl) fixMaxLbl.textContent = Math.round(projBalK).toLocaleString('he-IL') + ' K ₪';

...

18240:   var projItem   = Object.assign({}, item, { balance: projBalK, taxSegments: grownSegs });
18241:   var _hasTikratData = grownSegs.some(function(s) {
18242:     return (Number(s.tikrat) === 1 || Number(s.tikrat) === 2) && Number(s.accumulation) > 0;
18243:   });
18244:   var seg  = _sfCalcSegments(projItem);
18245:   var exP  = seg.exemptPrincipal;
18246:   var txP  = seg.taxablePrincipal;
18247:   var exPr = seg.exemptProfit;
18248:   var txPr = seg.taxableProfit;
18249:   var taxDetails = _sfCalculateTax(projItem, pctFraction, Object.assign({ inflation: inflation }, window.REAL_TAX_CONFIG || {})); // v181.74: pass inflation for real CGT
18250:   _sfLastTaxDetails = taxDetails;
18251:   var grossK  = taxDetails.grossWithdrawal;
18252:   var taxDueK = taxDetails.totalTaxDue;
18253:   var netK    = taxDetails.netToBank;
18254: 
18255:   // ── Manual calibration override ──────────────────────────────────────────
18256:   var _manualData    = _sfLoadManualData(item.assetNum);

...

18264:         ? grownSegs.map(function(g) {
18265:             return Object.assign({}, g, { deposits: _mPrinK * (Number(g.accumulation) / _totalAccumK) });
18266:           })
18267:         : grownSegs;
18268:       var _projWithDep = Object.assign({}, projItem, { taxSegments: _segsWithDep });
18269:       var _tikratTaxDetails = _sfCalculateTax(_projWithDep, pctFraction, Object.assign({ inflation: inflation }, window.REAL_TAX_CONFIG || {})); // v181.74
18270:       taxDueK = _tikratTaxDetails.totalTaxDue;
18271:       netK    = _tikratTaxDetails.netToBank;
18272:       taxDetails = Object.assign({}, _tikratTaxDetails, {
18273:         explanation: {
18274:           templateId: 'SF_MANUAL_CALIBRATION',
18275:           rendered:   '<div style="color:#16a34a;font-weight:600;">חישוב המס משלב נתוני מסלקה אוטומטיים (תקרות מס ותאריך פתיחה) יחד עם סך ההפקדות ההיסטוריות שהוזנו ידנית.</div>'
18276:         }
18277:       });
18278:     } else {
18279:       // No tikrat data — real 25% CGT on profit (legacy path, v181.74: inflation-adjusted)
18280:       var _mPropK        = _mPrinK * pctFraction;
18281:       var _mTxProfK      = Math.max(0, grossK - _mPropK);
18282:       var _mInflRate     = inflation / 100;                                 // v181.74: real CGT
18283:       var _mRealTxProfit = Math.max(0, _mTxProfK - _mInflRate * _mPropK); // nominalProfit − inflation×principal
18284:       taxDueK = _mRealTxProfit * 0.25;
18285:       netK    = grossK - taxDueK;
18286:       taxDetails = Object.assign({}, taxDetails, {
18287:         totalTaxDue: taxDueK, netToBank: netK, exemptionApplied: false,
18288:         explanation: {
18289:           templateId: 'SF_MANUAL_CALIBRATION',
18290:           rendered:   '<div style="color:#16a34a;font-weight:600;">חישוב המס משלב נתוני מסלקה אוטומטיים (תקרות מס ותאריך פתיחה) יחד עם סך ההפקדות ההיסטוריות שהוזנו ידנית.</div>'
18291:         }
18292:       });

...

18312:     } else if (_pushTid === 'SF_UNKNOWN_SENIORITY') {
18313:       _pushMsgEl.style.color      = '#6b7280';
18314:       _pushMsgEl.innerHTML        = 'חישוב המס המוצג שמרני. הזן סך הפקדות ידני לחישוב מדויק.';
18315:       _pushMsgEl.style.visibility = 'visible';
18316:       if (_segEl) _segEl.innerHTML = _sfBuildAutoReceipt(grossK, taxDetails, pctFraction);
18317:     } else if (_pushTid === 'SF_EXEMPT_SENIORITY' || _pushTid === 'SF_EXEMPT_AGE') {
18318:       var _dateStr = taxDetails.joinDateFormatted
18319:         ? ' (תאריך הצטרפות מקורי: ' + taxDetails.joinDateFormatted + ')' : '';
18320:       _pushMsgEl.style.color      = '#16a34a';
18321:       _pushMsgEl.innerHTML        = '<div style="font-weight:700;color:#16a34a;">פטור ממס רווחי הון – ותק הקופה מעל 6 שנים' + _dateStr + '</div>';
18322:       _pushMsgEl.style.visibility = 'visible';
18323:     } else if (_pushTid === 'SF_TAXABLE' || _pushTid === 'SF_MIXED') {
18324:       if (_segEl) _segEl.innerHTML = _sfBuildAutoReceipt(grossK, taxDetails, pctFraction);
18325:       _pushMsgEl.style.visibility = 'hidden';
18326:     }
18327:   }
18328: 

...

18380:         }
18381:       }
18382:     }
18383:   }
18384: 
18385:   var ge = document.getElementById('sf-gross-withdrawal'); if (ge) ge.textContent = Math.round(grossK).toLocaleString('he-IL');
18386:   var te = document.getElementById('sf-tax-due');
18387:   if (te) {
18388:     if (taxDueK === null) {
18389:       te.style.color = '#dc2626';
18390:       te.textContent = '---';
18391:     } else if (taxDetails.exemptionApplied && taxDueK === 0) {
18392:       te.style.color = '#16a34a';
18393:       te.textContent = 'פטור';
18394:     } else {
18395:       te.style.color = '#dc2626';
18396:       te.textContent = Math.round(taxDueK).toLocaleString('he-IL');

...

18402:   var remainK = Math.max(0, Math.round(projBalK) - Math.round(grossK));
18403:   if (re) re.textContent = 'יתרה לאחר משיכה: ' + remainK.toLocaleString('he-IL') + ' K ₪';
18404: 
18405:   var wdThumb    = document.getElementById('sf-wd-thumb-tip');
18406:   var wdFixThumb = document.getElementById('sf-wd-fix-thumb-tip');
18407:   if (_sfWithdrawalMode === 'pct') {
18408:     if (wdFixThumb) wdFixThumb.style.display = 'none';
18409:     if (wdThumb) {
18410:       var wdSlPct2 = document.getElementById('sf-withdrawal-slider');
18411:       if (wdSlPct2) {
18412:         var pctV = parseInt(wdSlPct2.value, 10);
18413:         wdThumb.style.display = 'block';
18414:         wdThumb.style.left = ((1 - pctV / 100) * 100).toFixed(1) + '%';
18415:         wdThumb.textContent = Math.round(grossK) + ' K ₪';
18416:       } else { wdThumb.style.display = 'none'; }
18417:     }
18418:   } else {
18419:     if (wdThumb) wdThumb.style.display = 'none';
18420:     if (wdFixThumb) {
18421:       var fixSlEl2 = document.getElementById('sf-withdrawal-fixed-slider');
18422:       if (fixSlEl2) {
18423:         var fixValV = parseFloat(fixSlEl2.value) || 0;
18424:         var fixMaxV = parseFloat(fixSlEl2.max)   || 1;
18425:         wdFixThumb.style.display = 'block';
18426:         wdFixThumb.style.left = ((1 - fixValV / fixMaxV) * 100).toFixed(1) + '%';
18427:         wdFixThumb.textContent = Math.round(fixValV) + ' K ₪';
18428:       } else { wdFixThumb.style.display = 'none'; }
18429:     }
18430:   }
18431: 
18432:   _sfUpdatePieChart(grossK, taxDueK, taxDetails.exemptionApplied);
18433: 
18434:   // Route manual receipt to collapsible sf-tax-segments
18435:   var _receiptEl = document.getElementById('sf-tax-segments');
18436:   if (_receiptEl && _manualReceipt) {
18437:     _receiptEl.innerHTML = _manualReceipt;
18438:   }
18439:   var _calibReceiptEl = document.getElementById('sf-calibration-receipt');
18440:   if (_calibReceiptEl) { _calibReceiptEl.innerHTML = ''; _calibReceiptEl.style.display = 'none'; }
18441: }
18442: 
18443: function _sfUpdatePieChart(grossK, taxDueK, exemptionApplied) {
18444:   if (_sfPieChart) { _sfPieChart.destroy(); _sfPieChart = null; }
18445:   var canvas   = document.getElementById('sf-pie-chart');
18446:   var legendEl = document.getElementById('sf-pie-legend');
18447:   if (!canvas) return;
18448: 

...

18452:     return;
18453:   }
18454: 
18455:   var taxRnd  = Math.round(taxDueK  || 0);
18456:   var netK    = Math.max(0, Math.round(grossK || 0) - taxRnd);
18457:   var netLabel = exemptionApplied ? 'נטו לכיס (פטור)' : 'נטו לכיס';
18458:   var defs = [
18459:     { label: 'חבות מס', val: taxRnd, color: '#dc2626' },
18460:     { label: netLabel,   val: netK,   color: '#16a34a' }
18461:   ].filter(function(d) { return d.val > 0; });
18462: 
```

## YOUR TASK
For each rule, state explicitly:
  PASS — the code correctly implements this rule, OR
  FAIL — the code violates or ignores this rule (quote the offending line).

If no relevant code was found for a rule, state: NOT FOUND — no implementation detected.

End your report with an overall verdict: APPROVED or NEEDS FIXES.
Be concise. Do not hallucinate code that is not shown above.
```
