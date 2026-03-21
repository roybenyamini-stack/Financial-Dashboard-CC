// System check: Claude Code is active.
const LABELS = ['ינו׳ 25','פבר׳ 25','מרץ 25','אפר׳ 25','מאי 25','יוני 25','יולי 25','אוג׳ 25','ספט׳ 25','אוק׳ 25','נוב׳ 25','דצמ׳ 25','ינו׳ 26','פבר׳ 26','מרץ 26'];

const FUNDS = {
  'אשקהש39905556':       { name:'א״ש ק״הש 39905556',      cat:'hishtalmut', data:[2406,2437,2416,2386,2401,2469,2548,2567,2595,2654,2685,2700,2700,2743,null] },
  'אשקהש6730513':        { name:'א״ש ק״הש 6730513 ← מיטב 442504', cat:'hishtalmut', transferred:true, data:[772,792,770,747,754,802,846,860,869,905,919,921,941,981,981] },
  'אשקהש40035706':       { name:'א״ש קה״ש 40035706',       cat:'hishtalmut', data:[281,285,283,279,281,289,298,300,304,310,314,316,316,321,321] },
  'מורקהש499293':        { name:'מור קה״ש 499293 ← מיטב 443195', cat:'hishtalmut', transferred:true, data:[320,339,348,350,362,391,418,435,448,473,493,508,529,561,null] },
  'מיטבקהש912-443286':   { name:'מיטב קה״ש 912-443286', cat:'hishtalmut', data:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,9] },

  '6730511אשגמל':        { name:'א״ש גמל 6730511 ← מור 1428298', cat:'gemel', data:[402,413,402,391,395,421,444,452,457,476,484,490,495,517,null] },
  'מורגמל1375900':        { name:'מור גמל 1375900', cat:'gemel', data:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,1] },
  'אשגמל39774495':       { name:'א״ש גמל 39774495 ← מור 1375688', cat:'gemel', data:[262,266,263,260,262,269,277,277,283,289,292,293,294,300,null] },
  '6730512אשגמל':        { name:'א״ש גמל 6730512 ← מור 1375888', cat:'gemel', data:[218,220,220,220,222,224,230,231,233,237,240,242,242,245,null] },
  '6899425אשגמל':        { name:'א״ש גמל 6899425 ← מור 1375911', cat:'gemel', data:[176,180,176,170,172,183,193,196,198,206,209,209,213,223,223] },
  'הפניקסגמל926-084678': { name:'הפניקס גמל 926-084678',   cat:'gemel', data:[null,null,null,null,null,null,null,null,null,null,414,414,437,445,444] },
  'אשגמללהשקעה2016-1738':{ name:'א״ש גמל להשקעה ← מיטב 917-443197', cat:'gemel_invest', data:[286,371,368,364,366,376,389,391,396,405,410,411,415,424,424] },
  'מורגמללהשקעה':        { name:'מור גמל להשקעה ← מיטב 912-443197', cat:'gemel_invest', data:[364,376,377,370,373,393,411,419,422,436,446,449,458,478,478] },
  'הראלמגוון-פוליסתחיסכ':{ name:'הראל מגוון - פוליסת חיסכון', cat:'harel', data:[4469,4473,4440,4444,4536,4630,4704,4758,4810,4927,4949,5019,5119,5174,5181] },
  'הראלמניות106863031':  { name:'הראל מניות 106863031',    cat:'harel', data:[1680,1631,1572,1515,1620,1655,1703,1732,1799,1828,1775,1768,1766,1664,0] },
  'הראלכללי109062745':   { name:'הראל כללי 109062745',     cat:'harel', data:[null,null,null,null,252,258,262,265,268,274,275,279,285,288,288] },
  'מיטבדשניהולקרנות1693':{ name:'מיטב דש ניהול קרנות 169301968', cat:'meitav', data:[530,530,527,520,540,550,560,560,560,560,580,580,580,600,600] },
  'מיטבדשטרייד': { name:'מיטב דש טרייד', cat:'meitav', data:[39,39,39,39,39,39,39,39,39,39,39,39,39,39,39] },
  'חובהראל':   { name:'חוב הראל',       cat:'chov', data:[195,179,165,150,135,120,105,90,75,60,45,30,15,0,0] },
  'חובאלטשולר':{ name:'חוב אלטשולר',    cat:'chov', data:[1667,1674,1681,1681,1696,1708,1718,1727,1735,1743,1750,1756,1765,1768,1588] },
  'ארביטראזואליו': { name:'ארביטראז׳ ואליו', cat:'arbitrage', data:[719,822,824,772,808,846,902,900,895,895,886,901,0,0,0] },
  'דירה': { name:'דירה', cat:'dira', data:[1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200] },
  'מזומןשקלי':   { name:'מזומן שקלי',   cat:'mezuman', data:[40,40,40,40,40,40,40,40,30,20,20,20,915,100,1750] },
  'מזומןדולרי':  { name:'מזומן דולרי $', cat:'mezuman', data:[null,null,null,null,null,null,null,null,null,null,null,null,null,115,116] },
  'מיטבשקלית':   { name:'מיטב קרן כספית', cat:'mezuman', data:[0,0,0,0,0,0,0,0,0,0,0,0,0,901,901] },
};

const CAT_COLORS = { mezuman:'#0891b2', chov:'#94a3b8', arbitrage:'#0d9488', dira:'#a8a29e', hishtalmut:'#fca5a5', gemel:'#fcd34d', gemel_invest:'#6ee7b7', harel:'#fde68a', meitav:'#c4b5fd', all:'#2563eb' };
const CAT_NAMES  = { mezuman:'מזומן', chov:'חוב', arbitrage:'ארביטראז׳ ואליו', dira:'דירה', hishtalmut:'קרנות השתלמות', gemel:'קופות גמל', gemel_invest:'גמל להשקעה', harel:'הראל', meitav:'מיטב', all:'סה״כ כל הקטגוריות' };
const FUND_COLORS = {
  'מזומןשקלי': '#0891b2',
  'מזומןדולרי': '#0891b2',
  'מיטבשקלית': '#0891b2',
  'אשקהש39905556': '#16a34a',
  'אשקהש6730513': '#7c3aed',
  'אשקהש40035706': '#16a34a',
  'מורקהש499293': '#7c3aed',
  'מיטבקהש912-443286': '#7c3aed',
  '6730511אשגמל': '#b45309',
  'אשגמל39774495': '#b45309',
  '6730512אשגמל': '#b45309',
  '6899425אשגמל': '#b45309',
  'הפניקסגמל926-084678': '#be185d',
  'מורגמל1375900': '#b45309',
  'אשגמללהשקעה2016-1738': '#7c3aed',
  'מורגמללהשקעה': '#7c3aed',
  'הראלמגוון-פוליסתחיסכ': '#e6a800',
  'הראלמניות106863031': '#e6a800',
  'הראלכללי109062745': '#e6a800',
  'מיטבדשניהולקרנות1693': '#7c3aed',
  'מיטבדשטרייד': '#7c3aed',
  'ארביטראזואליו': '#7c3aed',
  'חובהראל': '#64748b',
  'חובאלטשולר': '#64748b',
};

// Category totals (for table display - includes all funds)
const CAT_TOTALS = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
LABELS.forEach((_, i) => {
  Object.entries(CAT_TOTALS).forEach(([cat, arr]) => {
    const vals = Object.values(FUNDS).filter(f => f.cat===cat).map(f => f.data[i]||0);
    arr.push(vals.reduce((a,b)=>a+b,0));
  });
});

// Per-fund forward-fill: keeps last known value instead of dropping to 0
function ffFundData(data) {
  let last = null;
  return data.map(v => { if (v !== null && v !== undefined) { last = v; return v; } return last !== null ? last : 0; });
}

// CAT_CHART_TOTALS: forward-fill each fund BEFORE summing category
function buildCatChartTotals() {
  const totals = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
  Object.entries(totals).forEach(([cat, arr]) => {
    const funds = Object.values(FUNDS).filter(f => f.cat===cat);
    const ffed = funds.map(f => ffFundData(f.data));
    LABELS.forEach((_, i) => { arr.push(ffed.reduce((s,fd) => s+(fd[i]||0), 0)); });
  });
  return totals;
}
let CAT_CHART_TOTALS = buildCatChartTotals();

// ALL_TOTALS: forward-fill per fund before summing
const ALL_TOTALS = LABELS.map((_,i) => {
  return Object.values(FUNDS).reduce((t,f) => {
    const ff = ffFundData(f.data);
    return t + (f.cat==='chov' ? -(ff[i]||0) : (ff[i]||0));
  }, 0);
});


// Fund tags for chart label
const FUND_TAGS = {
  'מורקהש499293':        [{text:'מנייתית', cls:'note-equity'}],
  'מיטבקהש912-443286':   [{text:'פעילה', cls:'note-active'},{text:'מנייתית', cls:'note-equity'}],
  'מורגמל1375900':        [{text:'פעילה', cls:'note-active'},{text:'מנייתית', cls:'note-equity'}],
  'אשקהש6730513':        [{text:'מנייתית', cls:'note-equity'}],
  '6730511אשגמל':        [{text:'פעילה', cls:'note-active'},{text:'מנייתית', cls:'note-equity'}],
  '6899425אשגמל':        [{text:'מנייתית', cls:'note-equity'}],
  'הפניקסגמל926-084678': [{text:'מנייתית', cls:'note-equity'}],
  'מורגמללהשקעה':        [{text:'מנייתית', cls:'note-equity'}],
  'הראלמניות106863031':  [{text:'מנייתית', cls:'note-equity-sold'}],
  'מיטבשקלית':           [{text:'כספית', cls:'note-cash-fund'}],
  'מיטבדשניהולקרנות1693': [{text:'מנייתית', cls:'note-equity'}],
};

function updateActiveTags(fundKey) {
  const tagsDiv = document.getElementById('activeLabelTags');
  if (!tagsDiv) return;
  tagsDiv.innerHTML = '';
  const tags = FUND_TAGS[fundKey] || [];
  tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'note ' + t.cls;
    span.textContent = t.text;
    tagsDiv.appendChild(span);
  });
}

const WINDOW = 13;
let winStart = Math.max(0, LABELS.length - WINDOW);

function getWindow(data) {
  return { labels: LABELS.slice(winStart, winStart + WINDOW), data: data.slice(winStart, winStart + WINDOW) };
}

const ctx = document.getElementById('mainChart').getContext('2d');
let currentData = ALL_TOTALS;

// Gradient fill helper
function makeGradient(chartCtx, colorStr) {
  var gradient = chartCtx.createLinearGradient(0, 0, 0, 320);
  var m = colorStr.replace('#','').match(/.{2}/g);
  var r=37,g=99,b=235;
  if(m&&m.length>=3){r=parseInt(m[0],16);g=parseInt(m[1],16);b=parseInt(m[2],16);}
  gradient.addColorStop(0,   'rgba('+r+','+g+','+b+',0.18)');
  gradient.addColorStop(0.5, 'rgba('+r+','+g+','+b+',0.06)');
  gradient.addColorStop(1,   'rgba('+r+','+g+','+b+',0.0)');
  return gradient;
}

let chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: getWindow(ALL_TOTALS).labels,
    datasets: [{
      label: 'סה״״כ',
      data: getWindow(ALL_TOTALS).data,
      borderColor: '#2563eb',
      backgroundColor: makeGradient(ctx, '#2563eb'),
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBorderWidth: 2,
      pointHoverBackgroundColor: '#2563eb',
      pointHoverBorderColor: '#fff',
      pointBackgroundColor: '#2563eb',
      tension: 0.42,
      fill: true,
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true, textDirection: 'rtl',
        backgroundColor: '#ffffff',
        titleColor: '#6b7280',
        bodyColor: '#111827',
        borderColor: 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        padding: { top:10, bottom:10, left:16, right:16 },
        titleFont: { family:'Heebo', size:11, weight:'400' },
        bodyFont: { family:'Heebo', size:16, weight:'700' },
        cornerRadius: 12,
        displayColors: false,
        caretSize: 6,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        callbacks: {
          title: function(items) { return items[0].label; },
          label: function(c) {
            var val = Math.round(c.parsed.y).toLocaleString();
            var idx = c.dataIndex;
            var raw = currentData.slice(winStart, winStart + WINDOW);
            var lines2 = ['סך הכל: ' + val + ' אלף״ש'];
            if (idx > 0 && raw[idx] != null && raw[idx-1] != null && raw[idx-1] > 0) {
              var pct = ((raw[idx] - raw[idx-1]) / raw[idx-1] * 100).toFixed(1);
              lines2.push('שינוי: ' + pct + '%');
            }
            if (currentView && currentView !== 'all') {
              var soldFunds = Object.values(FUNDS).filter(function(f) {
                if (f.cat !== currentView) return false;
                var wasActive = false;
                for (var i2 = 0; i2 < f.data.length; i2++) {
                  if ((f.data[i2]||0) > 0) wasActive = true;
                  else if (wasActive && i2 === c.dataIndex) return true;
                }
                return false;
              });
              if (soldFunds.length > 0) lines2.push('⚠️ כולל מכירת: ' + soldFunds.map(function(f){return f.name;}).join(', '));
            }
            return lines2;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family:'Heebo', size:11 }, color:'#94a3b8' } },
      y: { grid: { color:'rgba(0,0,0,0.04)' }, ticks: { callback: function(v){return v.toLocaleString();}, font:{ family:'Heebo', size:11 }, color:'#94a3b8' }, grace: '15%', beginAtZero: false }
    },
    animation: { duration: 700, easing: 'easeInOutQuart' }
  }
})
window.addEventListener('resize', () => { if(chart) chart.resize(); });
setTimeout(() => { if(chart) chart.resize(); }, 100);

// Base Jan 2025 values for % calculations
const BASE = {
  mezuman: 0, // לא נמדד
  hishtalmut: 3459, // excluding active fund
  gemel: 1058,
  gemel_invest: 731, // 650 + הפקדה 81k (פבר' 2025)
  harel: 6149, // 6679 - 530 (מיטב)
  meitav: 569, // 530 מיטב קרנות + 39 טרייד
};
// Funds excluded from % (external/active) per category
const EXCLUDE_FROM_PCT = {
  mezuman: [],
  hishtalmut: ['מיטבקהש912-443286'],
  gemel: ['הפניקסגמל926-084678'],
  gemel_invest: [],
  harel: ['הראלכללי109062745'],
  meitav: [],
};

function getCatTotal(cat, idx) {
  return Object.values(FUNDS).filter(f => f.cat===cat).reduce((s,f) => s+(f.data[idx]||0), 0);
}
function getCatMeasured(cat, idx) {
  const excl = EXCLUDE_FROM_PCT[cat] || [];
  return Object.entries(FUNDS)
    .filter(([k,f]) => f.cat===cat && !excl.includes(k) && (f.data[idx]||0) > 0)
    .reduce((s,[,f]) => s+(f.data[idx]||0), 0);
}

function getCatBase(cat, idx) {
  // Base: only funds that are active (>0) at the end index
  const excl = EXCLUDE_FROM_PCT[cat] || [];
  return Object.entries(FUNDS)
    .filter(([k,f]) => f.cat===cat && !excl.includes(k) && (f.data[idx]||0) > 0)
    .reduce((s,[,f]) => s+(f.data[idx]||0), 0);
}

function updateDynamicStats() {
  const rawEndIdx = Math.min(winStart + WINDOW - 1, LABELS.length - 1);
  let endIdx = rawEndIdx;
  while (endIdx > 0 && Object.values(FUNDS).every(f => f.data[endIdx] === null || f.data[endIdx] === undefined)) endIdx--;
  const cats = ['mezuman','hishtalmut','gemel','gemel_invest','harel','meitav','arbitrage','dira','chov'];
  const el = id => document.getElementById(id);
  const endLabel = LABELS[endIdx];

  const catTotals = {}, catMeasured = {};
  cats.forEach(cat => {
    catTotals[cat] = 0;
    catMeasured[cat] = 0;
    const excl = EXCLUDE_FROM_PCT[cat] || [];
    Object.entries(FUNDS).forEach(([k, f]) => {
      if (f.cat !== cat) return;
      const v = f.data[endIdx] || 0;
      catTotals[cat] += v;
      if (!excl.includes(k) && v > 0) catMeasured[cat] += v;
    });
  });

  const grandTotal = cats.reduce((s,c) => c === 'chov' ? s - catTotals[c] : s + catTotals[c], 0);
  const noPctCats = ['mezuman','chov','arbitrage','dira'];
  const startIdx = winStart;
  const startLabel = LABELS[startIdx];

  const grandMeasured = cats.reduce((s,c) => noPctCats.includes(c) ? s : s + catMeasured[c], 0);
  const grandMeasuredStart = cats.reduce((s,c) => {
    if(noPctCats.includes(c)) return s;
    const excl = EXCLUDE_FROM_PCT[c]||[];
    // Only include funds active (>0) at endIdx in the base calculation
    return s + Object.entries(FUNDS)
      .filter(([k,f])=>f.cat===c && !excl.includes(k) && (f.data[endIdx]||0)>0)
      .reduce((a,[,f])=>a+(f.data[startIdx]||0),0);
  }, 0);
  const grandBase = grandMeasuredStart > 0 ? grandMeasuredStart : cats.reduce((s,c) => noPctCats.includes(c) ? s : s + (BASE[c]||0), 0);
  const grandBase0 = cats.reduce((s,c) => {
    const v = Object.entries(FUNDS).filter(([k,f])=>f.cat===c).reduce((a,[k,f])=>a+(f.data[startIdx]||0),0);
    return c === 'chov' ? s - v : s + v;
  }, 0);
  const grandPct = ((grandMeasured - grandBase) / grandBase * 100).toFixed(1);
  const grandDiff = grandTotal - grandBase0;

  if(el('hdr-total')) el('hdr-total').textContent = '' + Math.round(grandTotal).toLocaleString();
  // Middle stat: total change + breakdown
  if(el('hdr-change-val')) {
    const v = Math.round(grandDiff);
    el('hdr-change-val').textContent = (v<0?'-':'') + Math.abs(v).toLocaleString();
    el('hdr-change-val').style.color = v<0 ? '#ef4444' : '#4ade80';
  }
  // אירועים חיצוניים (הכרות/העברות) לפי חודש
  const EXTERNAL_EVENTS = [
    { col: 0,  amt: 286, desc: 'הראל כללי' },
    { col: 10, amt: 414, desc: 'פניקס' },
    { col: 14, amt: 173, desc: 'הכרה במזומן' },
  ];
  const extEnd = Math.min(winStart + WINDOW - 1, LABELS.length - 1);
  const externalAmt = EXTERNAL_EVENTS
    .filter(e => e.col > winStart && e.col <= extEnd)
    .reduce((s, e) => s + e.amt, 0);
  const extWrap = el('hdr-external-wrap');
  if (extWrap) {
    if (externalAmt > 0) {
      extWrap.style.display = 'flex';
      el('hdr-external-val').textContent = externalAmt.toLocaleString();
    } else {
      extWrap.style.display = 'none';
    }
  }
  // Right stat: measured return %
  if(el('hdr-ret-val')) {
    el('hdr-ret-val').textContent = (parseFloat(grandPct)<0?'-':'') + Math.abs(parseFloat(grandPct)).toFixed(1) + '%';
    el('hdr-ret-val').style.color = parseFloat(grandPct)<0 ? '#ef4444' : '#4ade80';
  }
  if(el('hdr-ret-range')) el('hdr-ret-range').textContent = startLabel + ' – ' + endLabel;
  // Subtitle in red
  const headerSub = document.getElementById('hdr-subtitle');
  if(headerSub) { headerSub.textContent = 'מציג: ' + endLabel; }

  if(el('card-val-all')) el('card-val-all').textContent = '' + Math.round(grandTotal).toLocaleString();
  if(el('card-chg-all')) el('card-chg-all').textContent = grandPct + '% נמדד';

  cats.forEach(cat => {
    const noPct = ['mezuman','chov','arbitrage','dira'];
    const total = Math.round(Math.abs(catTotals[cat])).toLocaleString();
    if(el('card-val-'+cat)) el('card-val-'+cat).textContent = total;
    if(el('sec-val-'+cat)) {
      el('sec-val-'+cat).textContent = total;
      if(cat==='chov') el('sec-val-'+cat).style.color='#ef4444';
    }
    if (noPct.includes(cat)) {
      if(el('card-chg-'+cat)) { el('card-chg-'+cat).textContent=''; }
      if(el('sec-pct-'+cat)) { el('sec-pct-'+cat).textContent=''; el('sec-pct-'+cat).className='cat-pct'; }
      return;
    }
    // Dynamic base: only funds active (>0) at endIdx
    const excl = EXCLUDE_FROM_PCT[cat] || [];
    const dynamicBase = Object.entries(FUNDS)
      .filter(([k,f]) => f.cat===cat && !excl.includes(k) && (f.data[endIdx]||0) > 0)
      .reduce((s,[,f]) => s + (f.data[startIdx]||0), 0);
    if (dynamicBase === 0) return;
    const pct = ((catMeasured[cat] - dynamicBase) / dynamicBase * 100).toFixed(1);
    const arrow = pct >= 0 ? '▲' : '▼';
    if(el('card-chg-'+cat)) el('card-chg-'+cat).textContent = arrow + ' ' + pct + '%';
    if(el('sec-pct-'+cat)) {
      el('sec-pct-'+cat).textContent = pct + '%';
      el('sec-pct-'+cat).className = 'cat-pct ' + (parseFloat(pct) >= 0 ? 'pos' : 'neg');
    }
    // YTD: Jan 2026 to endIdx
    const janIdx = LABELS.findIndex(l => l.includes('ינו') && l.includes('26'));
    if(el('sec-ytd-'+cat) && janIdx >= 0 && endIdx >= janIdx) {
      const excl2 = EXCLUDE_FROM_PCT[cat] || [];
      const ytdEnd = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===cat && !excl2.includes(k) && (f.data[endIdx]||0) > 0)
        .reduce((s,[,f]) => s+(f.data[endIdx]||0), 0);
      const ytdStart = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===cat && !excl2.includes(k) && (f.data[endIdx]||0) > 0)
        .reduce((s,[,f]) => s+(f.data[janIdx]||0), 0);
      if(ytdStart > 0) {
        const ytd = ((ytdEnd - ytdStart) / ytdStart * 100).toFixed(1);
        el('sec-ytd-'+cat).textContent = ytd + '% YTD';
        el('sec-ytd-'+cat).className = 'cat-pct ' + (parseFloat(ytd) >= 0 ? 'pos' : 'neg');
      } else {
        el('sec-ytd-'+cat).textContent = '';
      }
    } else if(el('sec-ytd-'+cat)) {
      el('sec-ytd-'+cat).textContent = '';
    }
  });
}
function updateNavButtons() {
  document.getElementById('btnPrev').disabled = winStart <= 0;
  document.getElementById('btnNext').disabled = winStart + WINDOW >= LABELS.length;
  const from = LABELS[winStart];
  const to = LABELS[Math.min(winStart + WINDOW - 1, LABELS.length - 1)];
  document.getElementById('winRange').textContent = to + ' – ' + from;
  // Show sold notice only when last visible month is the sale month
  const soldNotice = document.getElementById('sold-fund-notice');
  if (soldNotice) {
    let noticeText = '';
    if (currentView && currentView !== 'all') {
      const lastVisIdx = Math.min(winStart + WINDOW - 1, LABELS.length - 1);
      Object.values(FUNDS).forEach(f => {
        if (f.cat !== currentView) return;
        if (f.transferred) return;
        let wasActive = false;
        for (let i = 0; i < f.data.length; i++) {
          if ((f.data[i]||0) > 0) wasActive = true;
          else if (wasActive) {
            // sold at index i – show notice if i === lastVisIdx
            if (i === lastVisIdx) {
              noticeText = 'מכירת ' + f.name.replace('הראל מניות 106863031','הראל מניות').replace(/\d+/g,'').trim() + ' | ' + Math.round(f.data[i-1]||0).toLocaleString();
            }
            break;
          }
        }
      });
    }
    if (noticeText) {
      soldNotice.textContent = noticeText;
      soldNotice.style.display = 'block';
    } else {
      soldNotice.style.display = 'none';
    }
  }
  syncTableScroll();
  updateDynamicStats();
}

function syncTableScroll() {
  // Show only columns winStart to winStart+WINDOW-1
  const visStart = winStart;
  const visEnd = winStart + WINDOW - 1;
  document.querySelectorAll('[data-col]').forEach(el => {
    const col = parseInt(el.getAttribute('data-col'));
    el.style.display = (col >= visStart && col <= visEnd) ? '' : 'none';
  });
}

function slideWindow(dir) {
  winStart = Math.max(0, Math.min(winStart + dir, LABELS.length - WINDOW));
  const w = getWindow(currentData);
  chart.data.labels = w.labels;
  chart.data.datasets[0].data = w.data;
  chart.update();
  updateNavButtons();
  updateChartStats(currentData, currentView);
}

let currentView = 'all';
let lockedFund = null;   // קרן נעולה בלחיצה
let currentCatContext = null; // קטגוריה שממנה נבחרה הקרן
let hoverTimeout = null; // debounce ל-hover
let currentFund = null;

function updateChartStats(data, viewCat) {
  const w = getWindow(data);
  const validData = w.data.filter(v => v != null && !isNaN(v));
  const growthEl = document.getElementById('chart-growth');
  const returnEl = document.getElementById('chart-return');
  const growthLabel = growthEl.previousElementSibling;
  const returnLabel = returnEl.previousElementSibling;

  if(validData.length === 0) {
    document.getElementById('chart-accum').textContent = '—';
    growthEl.textContent = '—';
    returnEl.textContent = '—';
    return;
  }
  const last = validData[validData.length - 1];
  const first = validData[0];
  const growth = last - first;

  // Mezuman category (including כספית) - show only accum
  const isMezuman = viewCat === 'mezuman';
  // Chov category - show chov / שינוי בחוב / %
  const isChov = viewCat === 'chov';

  if(isMezuman) {
    document.getElementById('chart-accum-label').textContent = 'צבירה';
    document.getElementById('chart-accum').textContent = Math.round(last).toLocaleString();
    growthEl.closest('div').style.display = 'none';
    returnEl.closest('div').style.display = 'none';
  } else if(isChov) {
    growthEl.closest('div').style.display = '';
    returnEl.closest('div').style.display = '';
    growthLabel.textContent = 'שינוי בחוב';
    returnLabel.textContent = 'שינוי %';
    document.getElementById('chart-accum-label').textContent = 'חוב';
    document.getElementById('chart-accum').textContent = Math.round(last).toLocaleString();
    growthEl.textContent = (growth < 0 ? '-' : '') + Math.abs(Math.round(growth)).toLocaleString();
    growthEl.style.color = growth <= 0 ? '#16a34a' : '#ef4444';
    if(first > 0) {
      const ret = ((last - first) / first * 100).toFixed(1);
      returnEl.textContent = (ret < 0 ? '-' : '') + Math.abs(ret) + '%';
      returnEl.style.color = ret <= 0 ? '#16a34a' : '#ef4444';
    } else { returnEl.textContent = '—'; }
  } else {
    growthEl.closest('div').style.display = '';
    returnEl.closest('div').style.display = '';
    growthLabel.textContent = 'גידול בחלון';
    returnLabel.textContent = 'תשואה בחלון';
    document.getElementById('chart-accum-label').textContent = 'צבירה';
    document.getElementById('chart-accum').textContent = Math.round(last).toLocaleString();
    // If last value is 0 (sold/inactive) - don't show growth or return
    if(last === 0) {
      growthEl.textContent = '—';
      growthEl.style.color = '#888';
      returnEl.textContent = '—';
      returnEl.style.color = '#888';
      return;
    }
    growthEl.textContent = (growth < 0 ? '-' : '') + Math.abs(Math.round(growth)).toLocaleString();
    growthEl.style.color = growth >= 0 ? '#16a34a' : '#ef4444';
    // Use dynamic base for return% - only when viewing full category (not single fund)
    if(viewCat && viewCat !== 'all' && !currentFund) {
      const endIdx = winStart + w.data.length - 1;
      const startIdx = winStart;
      const excl = EXCLUDE_FROM_PCT[viewCat] || [];
      const measuredEnd = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===viewCat && !excl.includes(k) && (f.data[endIdx]||0) > 0)
        .reduce((s,[,f]) => s+(f.data[endIdx]||0), 0);
      const measuredStart = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===viewCat && !excl.includes(k) && (f.data[endIdx]||0) > 0)
        .reduce((s,[,f]) => s+(f.data[startIdx]||0), 0);
      if(measuredStart > 0) {
        const ret = ((measuredEnd - measuredStart) / measuredStart * 100).toFixed(1);
        returnEl.textContent = Math.abs(parseFloat(ret)).toFixed(1) + '%';
        returnEl.style.color = ret >= 0 ? '#16a34a' : '#ef4444';
      } else { returnEl.textContent = '—'; }
    } else if(first > 0) {
      const ret = ((last - first) / first * 100).toFixed(1);
      returnEl.textContent = Math.abs(parseFloat(ret)).toFixed(1) + '%';
      returnEl.style.color = ret >= 0 ? '#16a34a' : '#ef4444';
    } else { returnEl.textContent = '—'; }
  }
  // YTD calculation
  const ytdWrap = document.getElementById('chart-ytd-wrap');
  const ytdEl = document.getElementById('chart-ytd');
  const janIdx = LABELS.findIndex(l => l.includes('ינו') && l.includes('26'));
  const endIdx2 = winStart + w.data.length - 1;
  if(ytdWrap && ytdEl && janIdx >= 0 && endIdx2 >= janIdx && !isMezuman && !isChov) {
    ytdWrap.style.display = '';
    let ytdEndVal, ytdStartVal;
    if(viewCat && viewCat !== 'all' && !currentFund) {
      // Category view - dynamic base
      const excl3 = EXCLUDE_FROM_PCT[viewCat] || [];
      ytdEndVal = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===viewCat && !excl3.includes(k) && (f.data[endIdx2]||0) > 0)
        .reduce((s,[,f]) => s+(f.data[endIdx2]||0), 0);
      ytdStartVal = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===viewCat && !excl3.includes(k) && (f.data[endIdx2]||0) > 0)
        .reduce((s,[,f]) => s+(f.data[janIdx]||0), 0);
    } else if(currentFund && FUNDS[currentFund]) {
      // Single fund view
      ytdEndVal = FUNDS[currentFund].data[endIdx2] || 0;
      ytdStartVal = FUNDS[currentFund].data[janIdx] || 0;
    } else {
      // All categories
      ytdEndVal = ALL_TOTALS[endIdx2] || 0;
      ytdStartVal = ALL_TOTALS[janIdx] || 0;
    }
    if(ytdStartVal > 0 && ytdEndVal > 0) {
      const ytd = ((ytdEndVal - ytdStartVal) / ytdStartVal * 100).toFixed(1);
      ytdEl.textContent = Math.abs(parseFloat(ytd)).toFixed(1) + '%';
      ytdEl.style.color = parseFloat(ytd) >= 0 ? '#16a34a' : '#ef4444';
    } else {
      ytdEl.textContent = '—';
      ytdEl.style.color = '#888';
    }
  } else if(ytdWrap) {
    ytdWrap.style.display = 'none';
  }
}

function getSoldAnnotations(viewCat) {
  if (!viewCat || viewCat === 'all') return [];
  const annotations = [];
  const winLabels = getWindow(CAT_TOTALS[viewCat] || ALL_TOTALS).labels;
  Object.values(FUNDS).forEach(f => {
    if (f.cat !== viewCat) return;
    let wasActive = false;
    for (let i = 0; i < f.data.length; i++) {
      if ((f.data[i]||0) > 0) wasActive = true;
      else if (wasActive) {
        // Fund sold at index i (first 0 after being active)
        // Show annotation on last visible window point before/at sale
        const saleLabel = LABELS[i]; // e.g. מרץ 26
        const lastActiveLabel = LABELS[i-1]; // e.g. פבר 26
        // Try to place on sale month if visible, else on last active month
        let winIdx = winLabels.indexOf(saleLabel);
        if (winIdx < 0) winIdx = winLabels.indexOf(lastActiveLabel);
        if (winIdx >= 0) {
          annotations.push({ winIdx, name: f.name, value: Math.round(f.data[i-1]||0).toLocaleString() });
        }
        break;
      }
    }
  });
  return annotations;
}

function forwardFill(data) {
  let last = null;
  return data.map(v => {
    if (v !== null && !isNaN(v)) { last = v; return v; }
    return last !== null ? last : NaN;
  });
}

function updateChart(data, color, label) {
  currentData = data;
  const filled = forwardFill(data);
  const w = getWindow(filled);
  chart.data.labels = w.labels;
  chart.data.datasets[0].data = w.data;
  chart.data.datasets[0].borderColor = color;
  chart.data.datasets[0].backgroundColor = makeGradient(ctx, color);
  chart.data.datasets[0].pointBackgroundColor = color;
  chart.data.datasets[0].label = label;

  updateChartStats(data, currentView);;
  chart.update();
  document.getElementById('activeLabel').style.setProperty('--active-color', color);
  document.getElementById('activeLabelText').textContent = label;

}

// הוסף hover listeners לכל שורות הטבלה
function initTableHover() {
  document.querySelectorAll('tr[data-fund]').forEach(function(row) {
    var fundKey = row.getAttribute('data-fund');
    var onclickStr = row.getAttribute('onclick') || '';
    var colorMatch = onclickStr.match(/'(#[^']+)'\)/);
    var color = colorMatch ? colorMatch[1] : '#2563eb';
    row.addEventListener('mouseenter', function() { hoverFund(fundKey, color); });
    row.addEventListener('mouseleave', function() { hoverFund(null, null); });
  });
}

function hoverFund(fundKey, color) {
  if (lockedFund) return; // אם יש נעילה – אל תשנה
  if (!fundKey) {
    // עזיבת שורה – חזור לתצוגה הנוכחית
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(function() {
      if (!lockedFund) {
        document.querySelectorAll('tr[data-fund]').forEach(r => r.classList.remove('fund-active'));
        selectView(currentView || 'all');
      }
    }, 150);
    return;
  }
  clearTimeout(hoverTimeout);
  const fund = FUNDS[fundKey];
  if (!fund) return;
  document.querySelectorAll('tr[data-fund]').forEach(r => r.classList.remove('fund-active'));
  const fundRow = document.querySelector(`tr[data-fund="${fundKey}"]`);
  fundRow?.classList.add('fund-active');
  const hoverFilled = ffFundData(fund.data).map(v => v ?? NaN);
  updateChart(hoverFilled, color || CAT_COLORS[fund.cat] || '#2563eb', fund.name);
  updateActiveTags(fundKey);
  document.getElementById('activeLabelText').textContent = fund.name;
}

function selectView(cat) {
  currentFund = null;
  updateActiveTags(null);
  currentView = cat;
  // Clear fund row highlights
  document.querySelectorAll('tr[data-fund]').forEach(r => r.classList.remove('fund-active'));
  // Update card highlights
  document.querySelectorAll('.card, .card-total').forEach(c => c.classList.remove('active'));
  document.getElementById('card-' + (cat==='all'?'all':cat))?.classList.add('active');
  // Update category header highlight
  document.querySelectorAll('.category-header').forEach(h => h.classList.remove('active'));
  if (cat !== 'all') document.getElementById('hdr-'+cat)?.classList.add('active');

  if (cat === 'all') {
    updateChart(ALL_TOTALS, '#2563eb', CAT_NAMES.all);
  } else {
    updateChart(CAT_CHART_TOTALS[cat] || CAT_TOTALS[cat], CAT_COLORS[cat], CAT_NAMES[cat]);
  }
  updateNavButtons();
}



function selectFund(fundKey, color) {
  const fund = FUNDS[fundKey];
  if (!fund) return;

  // שמור קטגוריה + הצג כפתורי ניווט
  currentCatContext = fund.cat;
  const catBtn = document.getElementById('btn-back-cat');
  if (catBtn) catBtn.textContent = '← ' + (CAT_NAMES[fund.cat] || fund.cat);
  const navBtns = document.getElementById('chart-nav-btns');
  if (navBtns) navBtns.classList.add('visible');

  // נעילה/שחרור – לחיצה על אותה קרן נעולה משחררת
  if (lockedFund === fundKey) {
    lockedFund = null;
    document.querySelectorAll('tr[data-fund]').forEach(r => {
      r.classList.remove('fund-active');
      r.classList.remove('fund-locked');
    });
    document.querySelectorAll('.delta-row').forEach(r => r.remove());
    selectView(currentView || 'all');
    return;
  }

  // נעל את הקרן החדשה
  lockedFund = fundKey;
  currentFund = fundKey;
  document.querySelectorAll('tr[data-fund]').forEach(r => {
    r.classList.remove('fund-active');
    r.classList.remove('fund-locked');
  });
  const fundRow = document.querySelector(`tr[data-fund="${fundKey}"]`);
  fundRow?.classList.add('fund-active');
  fundRow?.classList.add('fund-locked');

  // Remove any existing delta rows
  document.querySelectorAll('.delta-row').forEach(r => r.remove());

  // Build delta row – only for non-mezuman funds
  const NO_DELTA_CATS = ['mezuman'];
  if (fundRow && !NO_DELTA_CATS.includes(fund.cat)) {
    const deltaRow = document.createElement('tr');
    deltaRow.className = 'delta-row visible';
    deltaRow.setAttribute('data-delta', fundKey);

    // Label cell
    const labelTd = document.createElement('td');
    labelTd.textContent = 'שינוי חודשי';
    deltaRow.appendChild(labelTd);

    // Delta cells for each month
    fund.data.forEach((v, i) => {
      const td = document.createElement('td');
      td.setAttribute('data-col', i);
      // Check visibility
      if (i < winStart || i > winStart + WINDOW - 1) td.style.display = 'none';

      if (i === 0 || v === null) {
        td.textContent = '—';
      } else {
        const prev = fund.data[i-1];
        if (prev === null || prev === 0) { td.textContent = '—'; }
        else {
          const delta = v - prev;
          const pct = (delta / prev * 100).toFixed(1);
          const cls = delta > 0 ? 'dpos' : (delta < 0 ? 'dneg' : 'dzer');
          td.innerHTML = `<span class="${cls} dval">${delta}</span><br><span class="${cls}">${pct}%</span>`;
        }
      }
      deltaRow.appendChild(td);
    });

    fundRow.insertAdjacentElement('afterend', deltaRow);
  }

  document.querySelectorAll('.card, .card-total').forEach(c => c.classList.remove('active'));
  updateChart(fund.data.map(v => v ?? NaN), color, fund.name);
  updateActiveTags(fundKey);
}

function toggleCat(id) {
  const body = document.getElementById('body-' + id);
  const chev = document.getElementById('chev-' + id);
  body.classList.toggle('open');
  chev.classList.toggle('open');
}

function saveToLocalStorage() {
  try {
    const payload = {
      labels: LABELS,
      funds: {}
    };
    Object.entries(FUNDS).forEach(([k, f]) => { payload.funds[k] = f.data; });
    localStorage.setItem('dashboard_v15_data', JSON.stringify(payload));
  } catch(e) { console.warn('שמירה נכשלה:', e); }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('dashboard_v15_data');
    if (!raw) return false;
    const payload = JSON.parse(raw);
    if (!payload.labels || !payload.funds) return false;
    // Restore LABELS
    LABELS.length = 0;
    payload.labels.forEach(l => LABELS.push(l));
    // Restore FUNDS data
    Object.entries(payload.funds).forEach(([k, data]) => {
      if (FUNDS[k]) FUNDS[k].data = data;
    });
    // Recalculate totals
    Object.keys(CAT_TOTALS).forEach(cat => { CAT_TOTALS[cat].length = 0; });
    LABELS.forEach((_, i) => {
      Object.entries(CAT_TOTALS).forEach(([cat, arr]) => {
        const vals = Object.values(FUNDS).filter(f => f.cat===cat).map(f => f.data[i]||0);
        arr.push(vals.reduce((a,b)=>a+b,0));
      });
    });
    ALL_TOTALS.length = 0;
    LABELS.forEach((_, i) => {
      let t = 0;
      Object.entries(CAT_TOTALS).forEach(([cat, arr]) => { t += cat === 'chov' ? -(arr[i]||0) : (arr[i]||0); });
      ALL_TOTALS.push(t);
    });
    return true;
  } catch(e) { console.warn('טעינה נכשלה:', e); return false; }
}

function updateTableCells() {
  const numCols = LABELS.length;

  // Add missing header columns to all tables
  document.querySelectorAll('thead tr').forEach(headerRow => {
    const existingCols = headerRow.querySelectorAll('th[data-col]').length;
    // Find max existing col index
    let maxCol = -1;
    headerRow.querySelectorAll('th[data-col]').forEach(th => {
      maxCol = Math.max(maxCol, parseInt(th.getAttribute('data-col')));
    });
    // Add missing columns
    for (let c = maxCol + 1; c < numCols; c++) {
      const th = document.createElement('th');
      th.setAttribute('data-col', c);
      th.textContent = LABELS[c];
      headerRow.appendChild(th);
    }
    // Update existing header labels
    headerRow.querySelectorAll('th[data-col]').forEach(th => {
      const col = parseInt(th.getAttribute('data-col'));
      if (col < numCols) th.textContent = LABELS[col];
    });
  });

  // Add missing td cells to fund rows and update values
  document.querySelectorAll('tr[data-fund]').forEach(row => {
    const fundKey = row.getAttribute('data-fund');
    const fund = FUNDS[fundKey];
    if (!fund) return;
    let maxCol = -1;
    row.querySelectorAll('td[data-col]').forEach(td => {
      maxCol = Math.max(maxCol, parseInt(td.getAttribute('data-col')));
    });
    // Add missing tds
    for (let c = maxCol + 1; c < numCols; c++) {
      const td = document.createElement('td');
      td.setAttribute('data-col', c);
      row.appendChild(td);
    }
    // Update all tds
    row.querySelectorAll('td[data-col]').forEach(td => {
      const col = parseInt(td.getAttribute('data-col'));
      if (col >= numCols) return;
      const val = fund.data[col];
      if (val === null || val === undefined || isNaN(val)) {
        td.textContent = '—';
        td.className = 'dash';
      } else {
        td.textContent = Math.round(val).toLocaleString();
        td.className = 'val';
      }
    });
  });

  // Add missing td cells to total rows and update values
  document.querySelectorAll('tr.total-row').forEach(row => {
    const section = row.closest('.category-section');
    if (!section) return;
    const catId = section.id.replace('sec-', '');
    const catArr = CAT_TOTALS[catId];
    if (!catArr) return;
    let maxCol = -1;
    row.querySelectorAll('td[data-col]').forEach(td => {
      maxCol = Math.max(maxCol, parseInt(td.getAttribute('data-col')));
    });
    for (let c = maxCol + 1; c < numCols; c++) {
      const td = document.createElement('td');
      td.setAttribute('data-col', c);
      row.appendChild(td);
    }
    row.querySelectorAll('td[data-col]').forEach(td => {
      const col = parseInt(td.getAttribute('data-col'));
      if (col >= catArr.length) return;
      td.textContent = Math.round(Math.abs(catArr[col])).toLocaleString();
      td.className = 'val';
    });
  });
}

// ===== NOTES SYSTEM =====
const NOTES = [];

const NOTE_TYPE_COLOR = {
  'מכירת נכס': '#dc2626',
  'קניית נכס': '#16a34a',
  'הכרה במזומן': '#0891b2',
  'העברה בין קרנות': '#7c3aed',
  'אחר': '#64748b',
};

function showAddForm() {
  document.getElementById('notes-add-form').style.display = 'block';
  // Set today's date
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  document.getElementById('nf-date').value = dd+'/'+mm+'/'+yyyy;
  // Show/hide sale fields based on type
  document.getElementById('nf-type').onchange = updateNoteFields;
  updateNoteFields();
}

function updateNoteFields() {
  const type = document.getElementById('nf-type').value;
  const hasSale = ['מכירת נכס','קניית נכס'].includes(type);
  const hasAmount = ['הכרה במזומן','העברה בין קרנות','אחר'].includes(type);
  document.getElementById('nf-fields-sale').style.display = hasSale ? 'grid' : 'none';
  document.getElementById('nf-fields-amount').style.display = hasAmount ? 'block' : 'none';
}

function hideAddForm() {
  document.getElementById('notes-add-form').style.display = 'none';
  ['nf-date','nf-title','nf-gross','nf-tax','nf-net','nf-link','nf-amount'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function saveNewNote() {
  const date = document.getElementById('nf-date').value.trim();
  const type = document.getElementById('nf-type').value;
  const title = document.getElementById('nf-title').value.trim();
  const gross = document.getElementById('nf-gross').value.trim();
  const tax = document.getElementById('nf-tax').value.trim();
  const net = document.getElementById('nf-net').value.trim();
  const link = document.getElementById('nf-link').value.trim();

  if (!date || !title) { alert('נא למלא תאריך ופירוט'); return; }

  // Parse month key from date DD/MM/YYYY
  const parts = date.split('/');
  const monthKey = parts.length === 3 ? parts[2] + '-' + parts[1].padStart(2,'0') : '';

  const amount = document.getElementById('nf-amount').value.trim();
  const fields = [];
  if (gross) fields.push({ label: 'סכום כולל בפוליסה', value: gross });
  if (tax)   fields.push({ label: 'מס רווח הון', value: tax });
  if (net)   fields.push({ label: 'תמורה נטו לחשבון', value: net });
  if (amount) fields.push({ label: 'סכום', value: amount });

  const note = { date, month: monthKey, type, title, fields, link: link || null, linkLabel: link ? 'מסמך רפרנס' : null };
  NOTES.unshift(note); // newest first
  saveNotesToStorage();
  hideAddForm();
  renderNotesList();
  markNoteMonths();
}

function deleteNote(i) {
  if (!confirm('למחוק הערה זו?')) return;
  NOTES.splice(i, 1);
  saveNotesToStorage();
  renderNotesList();
  markNoteMonths();
}

function editNote(i) {
  const n = NOTES[i];
  showAddForm();
  document.getElementById('nf-date').value = n.date;
  document.getElementById('nf-type').value = n.type;
  document.getElementById('nf-title').value = n.title;
  const gross = n.fields.find(f => f.label === 'סכום כולל בפוליסה');
  const tax   = n.fields.find(f => f.label === 'מס רווח הון');
  const net   = n.fields.find(f => f.label === 'תמורה נטו לחשבון');
  if (gross) document.getElementById('nf-gross').value = gross.value;
  if (tax)   document.getElementById('nf-tax').value = tax.value;
  if (net)   document.getElementById('nf-net').value = net.value;
  document.getElementById('nf-link').value = n.link || '';
  // Remove old note and save new on submit
  NOTES.splice(i, 1);
  saveNotesToStorage();
  renderNotesList();
}

function saveNotesToStorage() {
  try { localStorage.setItem('dashboard_v15_notes', JSON.stringify(NOTES)); } catch(e) {}
}

function loadNotesFromExcel(workbook) {
  try {
    const sheet = workbook.Sheets['Notes'];
    if (!sheet) return;
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
    // Find header row
    let headerIdx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] && rows[i].includes('תאריך')) { headerIdx = i; break; }
    }
    if (headerIdx < 0) return;
    const headers = rows[headerIdx];
    const iDate   = headers.indexOf('תאריך');
    const iType   = headers.indexOf('סוג');
    const iTitle  = headers.indexOf('פירוט');
    const iGross  = headers.indexOf('סכום כולל');
    const iTax    = headers.indexOf('מס');
    const iNet    = headers.indexOf('נטו');
    const iAmount = headers.indexOf('סכום');
    const iLink   = headers.indexOf('קישור');

    const excelNotes = [];
    for (let i = headerIdx + 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !r[iDate]) continue;
      // Format date
      let dateStr = '';
      const raw = r[iDate];
      if (typeof raw === 'number') {
        // Excel serial date - use local time
        const d = new Date(Math.round((raw - 25569) * 86400 * 1000));
        const dd = String(d.getUTCDate()).padStart(2,'0');
        const mm = String(d.getUTCMonth()+1).padStart(2,'0');
        dateStr = dd + '/' + mm + '/' + d.getUTCFullYear();
      } else if (raw instanceof Date) {
        // cellDates:true gives local date - use UTC to avoid timezone shift
        const dd = String(raw.getUTCDate()).padStart(2,'0');
        const mm = String(raw.getUTCMonth()+1).padStart(2,'0');
        dateStr = dd + '/' + mm + '/' + raw.getUTCFullYear();
      } else {
        dateStr = String(raw);
      }
      // Month key
      const parts = dateStr.split('/');
      const monthKey = parts.length === 3 ? parts[2] + '-' + parts[1].padStart(2,'0') : '';
      // Fields
      const fields = [];
      if (r[iGross]) fields.push({ label: 'סכום כולל בפוליסה', value: String(r[iGross]) });
      if (r[iTax])   fields.push({ label: 'מס רווח הון',        value: String(r[iTax]) });
      if (r[iNet])   fields.push({ label: 'תמורה נטו לחשבון',   value: String(r[iNet]) });
      if (r[iAmount])fields.push({ label: 'סכום',               value: String(r[iAmount]) });

      excelNotes.push({
        date: dateStr,
        month: monthKey,
        type: r[iType] || 'אחר',
        title: r[iTitle] || '',
        fields,
        link: r[iLink] || null,
        linkLabel: r[iLink] ? 'מסמך רפרנס' : null
      });
    }
    if (excelNotes.length === 0) return;
    // Merge: excel notes override, keep built-in not in excel
    const excelKeys = new Set(excelNotes.map(n => n.date + n.title));
    // Keep hardcoded notes not present in excel
    const hardcoded = NOTES.filter(n => n._hardcoded && !excelKeys.has(n.date + n.title));
    NOTES.length = 0;
    // newest first: sort by date desc
    const all = [...excelNotes, ...hardcoded].sort((a,b) => {
      const pd = s => { const p = s.split('/'); return p.length===3 ? new Date(p[2],p[1]-1,p[0]) : new Date(0); };
      return pd(b.date) - pd(a.date);
    });
    all.forEach(n => NOTES.push(n));
    saveNotesToStorage();
  } catch(e) { console.warn('שגיאה בקריאת Notes:', e); }
}

function loadNotesFromStorage() {
  try {
    const raw = localStorage.getItem('dashboard_v15_notes');
    if (!raw) return;
    const saved = JSON.parse(raw);
    // Merge: saved notes first, then built-in notes not already present
    const savedTitles = new Set(saved.map(n => n.date + n.title));
    const builtIn = NOTES.filter(n => !savedTitles.has(n.date + n.title));
    NOTES.length = 0;
    saved.forEach(n => NOTES.push(n));
    builtIn.forEach(n => NOTES.push(n));
  } catch(e) {}
}

function openNotes() {
  renderNotesList();
  const modal = document.getElementById('notes-modal');
  modal.style.display = 'flex';
}

function closeNotes() {
  document.getElementById('notes-modal').style.display = 'none';
}

function renderNotesList() {
  const list = document.getElementById('notes-list');
  if (NOTES.length === 0) {
    list.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">אין הערות עדיין</p>';
    return;
  }

  // Table headers based on note type columns
  const colHeaders = ['קישור','תמורה נטו','מס','סכום כולל','פירוט','אירוע','תאריך',''];
  
  let tableHtml = '<table style="width:100%; border-collapse:collapse; font-size:13px; font-family:Heebo,sans-serif;" dir="rtl">';
  // Header row
  tableHtml += '<thead><tr style="border-bottom:2px solid #1a1a2e;">';
  colHeaders.forEach(h => {
    tableHtml += '<th style="padding:8px 10px; color:#1a1a2e; font-weight:700; text-align:right; white-space:nowrap;">' + h + '</th>';
  });
  tableHtml += '</tr></thead><tbody>';

  // Data rows (newest first)
  NOTES.forEach((n, i) => {
    const color = NOTE_TYPE_COLOR[n.type] || '#64748b';
    const bg = i % 2 === 0 ? '#f9fafb' : 'white';
    const gross = n.fields.find(f => f.label === 'סכום כולל בפוליסה');
    const tax   = n.fields.find(f => f.label === 'מס רווח הון');
    const net   = n.fields.find(f => f.label === 'תמורה נטו לחשבון') || n.fields.find(f => f.label === 'סכום');
    const linkHtml = n.link
      ? '<a href="' + n.link + '" target="_blank" style="color:#0891b2; text-decoration:none; font-size:14px; font-weight:600;">מסמך ↗</a>'
      : '';
    const taxVal = tax ? '<span style="color:#dc2626;">-' + tax.value + '</span>' : '—';

    tableHtml += '<tr style="background:' + bg + '; border-bottom:1px solid #e5e7eb;">' +
      '<td style="padding:10px 16px; text-align:right; white-space:nowrap;">' + linkHtml + '</td>' +
      '<td style="padding:10px 16px; text-align:right; font-weight:700; white-space:nowrap;">' + (net ? net.value : '—') + '</td>' +
      '<td style="padding:10px 16px; text-align:right; white-space:nowrap;">' + taxVal + '</td>' +
      '<td style="padding:10px 16px; text-align:right; white-space:nowrap;">' + (gross ? gross.value : '—') + '</td>' +
      '<td style="padding:10px 16px; font-weight:600; white-space:nowrap;">' + n.title + '</td>' +
      '<td style="padding:10px;"><span style="background:' + color + '20; color:' + color + '; padding:2px 8px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap;">' + n.type + '</span></td>' +
      '<td style="padding:10px; white-space:nowrap; color:#555;">' + n.date + '</td>' +
      '<td style="padding:10px; white-space:nowrap;">' +
        '<button onclick="editNote(' + i + ')" style="background:none; border:none; cursor:pointer; font-size:14px; padding:2px 5px;" title="עריכה">✏️</button>' +
        '<button onclick="deleteNote(' + i + ')" style="background:none; border:none; cursor:pointer; font-size:14px; padding:2px 5px;" title="מחיקה">🗑️</button>' +
      '</td>' +
      '</tr>';
  });

  tableHtml += '</tbody></table>';
  list.innerHTML = tableHtml;
}

// Mark chart months that have notes
function markNoteMonths() {
  // Will color x-axis labels that have notes
  const noteMonths = new Set(NOTES.map(n => n.month));
  if (!chart || !chart.data.labels) return;
  const labels = chart.data.labels;
  // Map label to month key
  const MONTH_HEB = {'ינו':1,'פבר':2,'מרץ':3,'אפר':4,'מאי':5,'יונ':6,'יול':7,'אוג':8,'ספט':9,'אוק':10,'נוב':11,'דצמ':12};
  chart.options.scales.x.ticks.color = function(ctx) {
    const label = ctx.tick && labels[ctx.index];
    if (!label) return '#64748b';
    // Parse label like "פבר' 26"
    const m = label.match(/^(א-ת{2,3})'\s*(\d{2})$/);
    if (!m) return '#64748b';
    const mon = MONTH_HEB[m[1]];
    const yr = 2000 + parseInt(m[2]);
    const key = yr + '-' + String(mon).padStart(2,'0');
    return noteMonths.has(key) ? '#f59e0b' : '#64748b';
  };
  chart.update();
}

// ===== END NOTES SYSTEM =====

// Init – load last saved data if available
if (loadFromLocalStorage()) {
  winStart = Math.max(0, LABELS.length - WINDOW);
  // Update table headers
  document.querySelectorAll('th[data-col]').forEach(th => {
    const col = parseInt(th.getAttribute('data-col'));
    if (col >= 0 && col < LABELS.length) th.textContent = LABELS[col];
  });
  updateTableCells();
  // Refresh chart with loaded data
  currentData = ALL_TOTALS;
  const w = getWindow(ALL_TOTALS);
  chart.data.labels = w.labels;
  chart.data.datasets[0].data = w.data;
  chart.update();
}
loadNotesFromStorage();
document.getElementById('card-all').classList.add('active');
updateNavButtons();
updateChartStats(currentData, currentView);
initTableHover();
markNoteMonths();



var chatOpen = false;
var chatMode = 'portfolio';

function setChatMode(mode) {
  chatMode = mode;
  var isExplore = mode === 'explore';
  document.getElementById('mode-portfolio').style.background = isExplore ? 'transparent' : '#4ade80';
  document.getElementById('mode-portfolio').style.color = isExplore ? '#aaa' : '#0f0f23';
  document.getElementById('mode-explore').style.background = isExplore ? '#818cf8' : 'transparent';
  document.getElementById('mode-explore').style.color = isExplore ? '#0f0f23' : '#aaa';
  document.getElementById('chat-title').textContent = isExplore ? '🌐 חקור את השוק' : '🤖 שאל את הדשבורד';
  document.getElementById('ci').placeholder = isExplore ? 'למשל: השווה את התיק שלי ל-S&P 500...' : 'שאל על התיק שלך...';
  // נקה שיחה בעת מעבר מוד
  chatHistory = [];
  var cm = document.getElementById('cm');
  cm.innerHTML = '';
  var welcomeMsg = isExplore 
    ? 'מוד חקור פעיל 🌐\nאני יכול לחפש מידע עדכני מהאינטרנט.\nלמשל: השוואה ל-S&P 500, מידע על קרנות, נתוני שוק.' 
    : 'שלום, מוזמן לשאול אותי כל שאלה על התיק שלך 😊';
  addMsg(welcomeMsg, false);
  setTimeout(function(){ document.getElementById('ci').focus(); }, 100);
}

function toggleChat() {
  chatOpen = !chatOpen;
  var cp = document.getElementById('cp');
  cp.style.display = chatOpen ? 'flex' : 'none';
  if(chatOpen) {
    var cm = document.getElementById('cm');
    if(cm.children.length === 0) addMsg('שלום, מוזמן לשאול אותי כל שאלה 😊', false);
    setTimeout(function(){ document.getElementById('ci').focus(); }, 100);
  }
}
function addMsg(txt, isUser) {
  var cm = document.getElementById('cm');
  var d = document.createElement('div');
  d.style.cssText = 'padding:9px 12px;border-radius:10px;font-family:Heebo,sans-serif;font-size:17px;line-height:1.8;direction:rtl;max-width:85%;white-space:pre-wrap;';
  if(isUser) {
    d.style.cssText += 'background:#2d2d4e;color:white;align-self:flex-end;margin-right:auto;';
  } else {
    d.style.cssText += 'background:#0f3460;color:#e2e8f0;align-self:flex-start;margin-left:auto;';
  }
  d.textContent = txt;
  cm.appendChild(d);
  cm.scrollTop = cm.scrollHeight;
  return d;
}
var chatHistory = [];

async function sendChat() {
  var ci = document.getElementById('ci');
  var q = ci.value.trim();
  if(!q) return;
  ci.value = '';
  addMsg(q, true);
  chatHistory.push({role:'user', content: q});

  var thinking = addMsg('חושב...', false);

  try {
    var ctx = buildContext();
    var isExplore = chatMode === 'explore';
    // במוד חקור – סיכום קצר בלבד כדי לא לחרוג ממגבלת טוקנים
    // קרנות מנייתיות לפי FUND_TAGS (לא f.tags)
    var equityKeys = Object.keys(FUND_TAGS).filter(function(k){
      return FUND_TAGS[k].some(function(t){ return t.cls==='note-equity'; });
    });
    var equityFunds = equityKeys.map(function(k){ return FUNDS[k]; }).filter(Boolean);
    var equityTotal = equityFunds.reduce(function(sum,f){
      var last = f.data.slice().reverse().find(function(v){return v!=null;})||0;
      return sum+last;
    },0);
    var totalNow = Math.round(ALL_TOTALS[ALL_TOTALS.length-1]);
    var equityPct = totalNow>0 ? Math.round(equityTotal/totalNow*100) : 0;
    var equityList = equityFunds.map(function(f){
      var last = f.data.slice().reverse().find(function(v){return v!=null;})||0;
      return f.name+': '+Math.round(last);
    }).join(', ');
    var catStr = Object.keys(CAT_TOTALS).map(function(k){
      var arr=CAT_TOTALS[k]; var v=arr[arr.length-1]||0;
      return (CAT_NAMES[k]||k)+': '+Math.round(v);
    }).join(', ');
    var briefCtx = 'תיק השקעות ישראלי. סה״כ נכסים: '+totalNow+' אלפי ש״ח.\n'+
      'רכיב מנייתי: '+Math.round(equityTotal)+' אלפ״ש ('+equityPct+'% מהתיק).\n'+
      'קרנות/קופות מנייתיות: '+(equityList||'אין')+'.\n'+
      'קטגוריות: '+catStr+'.';
    var systemPrompt = isExplore
      ? 'אתה יועץ פיננסי שיכול לחפש מידע עדכני באינטרנט. ענה בעברית.\n' +
        briefCtx + '\n' +
        'השתמש ב-web search כדי להביא מידע עדכני על שוקי ההון, benchmark-ים, קרנות נאמנות וכו\'.'
      : 'אתה עוזר פיננסי שמנתח תיק השקעות. ענה בעברית בתמציתיות.\n' +
        'הנתונים הם ערכי צבירה חודשיים באלפי ש\"ח (לא תזרימים).\n' +
        'תשואה = (ערך סוף תקופה - ערך תחילת תקופה) / ערך תחילת תקופה * 100.\n' +
        'הנתונים לפי סדר החודשים שמופיעים בשורת "חודשים".\n' +
        'ינו\' 25 = חודש ראשון, דצמ\' 25 = חודש 12, ינו\' 26 = חודש 13, פבר\' 26 = חודש 14.\n\n' + ctx;

    var res = await fetch('https://holy-poetry-claude-proxy.roy-benyamini.workers.dev', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
body: JSON.stringify(Object.assign({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: isExplore ? chatHistory.slice(-6) : chatHistory
      }, isExplore ? {mode: 'explore'} : {}))
    });
    var data = await res.json();
    thinking.remove();
    var answer;
    if (data.content && data.content.length > 0) {
      // web search מחזיר בלוקים מרובים – אסוף רק text
      answer = data.content
        .filter(function(b){ return b.type === 'text'; })
        .map(function(b){ return b.text; })
        .join('\n');
      if (!answer) answer = 'קיבלתי תגובה אך ללא טקסט. נסה שוב.';
    } else if (data.error) {
      var errType = data.error.type || '';
      if (errType === 'overloaded_error') answer = 'המערכת עמוסה כרגע, נסה שוב בעוד כמה שניות.';
      else answer = 'שגיאה: ' + (data.error.message || errType);
    } else {
      answer = 'תגובה לא צפויה, נסה שוב.';
    }
    chatHistory.push({role:'assistant', content: answer});
    addMsg(answer, false);
  } catch(e) {
    thinking.remove();
    addMsg('שגיאה: ' + e.message, false);
  }
}

function buildContext() {
  var ctx = 'תיק השקעות באלפי ש"ח.\n';
  ctx += 'חודשים: ' + LABELS.join(',') + '\n';
  ctx += 'נתונים לכל קרן (לפי סדר החודשים):\n';
  Object.entries(FUNDS).forEach(function(entry) {
    var key = entry[0], f = entry[1];
    var tags = FUND_TAGS[key] || [];
    var type = 'כללי';
    if (tags.some(function(t){ return t.cls==='note-equity' || t.cls==='note-equity-sold'; })) type = 'מנייתי';
    else if (tags.some(function(t){ return t.cls==='note-cash-fund'; })) type = 'כספי';
    ctx += f.name + ' [' + CAT_NAMES[f.cat] + ', ' + type + ']: ' +
           f.data.map(function(v){return v!=null?Math.round(v):'';}).join(',') + '\n';
  });
  ctx += 'סהכ תיק: ' + ALL_TOTALS.map(function(v){return Math.round(v);}).join(',') + '\n';
  // Add notes to context
  if (NOTES.length > 0) {
    ctx += '\nהערות תיק:\n';
    NOTES.forEach(function(n) {
      ctx += '- ' + n.date + ' | ' + n.type + ' | ' + n.title;
      n.fields.forEach(function(f) { ctx += ' | ' + f.label + ': ' + f.value; });
      ctx += '\n';
    });
  }
  return ctx;
}
// v26.0: CF CHAT
var cfChatOpen = false;
var cfChatHistory = [];

function buildCFContext() {
  if (!CF_DATA || CF_DATA.length === 0) return 'no data';
  var lines = [];
  CF_DATA.forEach(function(m) {
    var r = m.rows;
    function rv(k) { return (r[k] && r[k].val != null) ? Math.round(r[k].val) : 0; }
    var inc = rv('total_income'), exp = rv('total_exp');
    var line = m.label + ' ' + m.year + ': income=' + inc + ' exp=' + exp + ' net=' + (inc - exp);
    var sal=rv('salary'), rent=rv('rent_income'), visa=rv('visa'), cash=rv('cash_exp'), loan=rv('loans'), yotam=rv('yotam'), usd=rv('total_usd');
    if(sal)   line += ' salary=' + sal;
    if(rent)  line += ' rent=' + rent;
    if(visa)  line += ' visa=' + visa;
    if(cash)  line += ' cash=' + cash;
    if(loan)  line += ' loans=' + loan;
    if(yotam) line += ' yotam=' + yotam;
    if(usd)   line += ' usd_net=' + usd;
    lines.push(line);
  });
  return 'Monthly cashflow (thousands ILS):\n' + lines.join('\n');
}

function toggleCFChat() {
  cfChatOpen = !cfChatOpen;
  var cp = document.getElementById('cf-cp');
  if (!cp) return;
  cp.style.display = cfChatOpen ? 'flex' : 'none';
  if (cfChatOpen) {
    var cm = document.getElementById('cf-cm');
    if (cm && cm.children.length === 0) {
      addCFMsg('\u05e9\u05dc\u05d5\u05dd! \u05e9\u05d0\u05dc \u05d0\u05d5\u05ea\u05d9 \u05e2\u05dc \u05d4\u05ea\u05d6\u05e8\u05d9\u05dd.\n\u05dc\u05de\u05e9\u05dc: "\u05d4\u05e9\u05d5\u05d5\u05d4 \u05d4\u05db\u05e0\u05e1\u05d5\u05ea 2025 \u05de\u05d5\u05dc 2026"', false);
    }
    setTimeout(function() { var i = document.getElementById('cf-ci'); if(i) i.focus(); }, 100);
  }
}

function addCFMsg(txt, isUser) {
  var cm = document.getElementById('cf-cm');
  if (!cm) return null;
  var d = document.createElement('div');
  var base = 'padding:8px 12px;border-radius:10px;font-family:Heebo,sans-serif;font-size:14px;line-height:1.6;direction:rtl;max-width:85%;white-space:pre-wrap;margin-bottom:4px;';
  var clr = isUser ? 'background:#2d2d4e;color:white;align-self:flex-end;margin-right:auto;' : 'background:#0f3460;color:#e2e8f0;align-self:flex-start;margin-left:auto;';
  d.style.cssText = base + clr;
  d.textContent = txt;
  cm.appendChild(d);
  cm.scrollTop = cm.scrollHeight;
  return d;
}

async function sendCFChat() {
  var ci = document.getElementById('cf-ci');
  if (!ci) return;
  var q = ci.value.trim();
  if (!q) return;
  ci.value = '';
  addCFMsg(q, true);
  cfChatHistory.push({role: 'user', content: q});
  var thinking = addCFMsg('\u05d7\u05d5\u05e9\u05d1...', false);
  try {
    var sys = '\u05d0\u05ea\u05d4 \u05e2\u05d5\u05d6\u05e8 \u05e4\u05d9\u05e0\u05e0\u05e1\u05d9 \u05e9\u05de\u05e0\u05ea\u05d7 \u05ea\u05d6\u05e8\u05d9\u05dd \u05e9\u05d5\u05d8\u05e3. \u05e2\u05e0\u05d4 \u05d1\u05e2\u05d1\u05e8\u05d9\u05ea \u05d1\u05ea\u05de\u05e6\u05d9\u05ea\u05d9\u05d5\u05ea.\n' + buildCFContext();
    var res = await fetch('https://holy-poetry-claude-proxy.roy-benyamini.workers.dev', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1200, system:sys, messages:cfChatHistory.slice(-10)})
    });
    var data = await res.json();
    thinking.remove();
    var answer = '';
    if (data.content && data.content.length > 0) {
      answer = data.content.filter(function(b){ return b.type === 'text'; }).map(function(b){ return b.text; }).join('\n');
    } else if (data.error) {
      answer = '\u05e9\u05d2\u05d9\u05d0\u05d4: ' + (data.error.message || '');
    }
    if (!answer) answer = '\u05ea\u05d2\u05d5\u05d1\u05d4 \u05e8\u05d9\u05e7\u05d4. \u05e0\u05e1\u05d4 \u05e9\u05d5\u05d1.';
    cfChatHistory.push({role:'assistant', content:answer});
    addCFMsg(answer, false);
  } catch(e) {
    thinking.remove();
    addCFMsg('\u05e9\u05d2\u05d9\u05d0\u05d4: ' + e.message, false);
  }
}

function answerQ(q) {
  var months = {'ינו':0,'ינואר':0,'פבר':1,'פברואר':1,'מרץ':2,'מרס':2,'אפר':3,'אפריל':3,'מאי':4,'יוני':5,'יולי':6,'אוג':7,'אוגוסט':7,'ספט':8,'ספטמבר':8,'אוק':9,'אוקטובר':9,'נוב':10,'נובמבר':10,'דצמ':11,'דצמבר':11};
  function getMonths(str) {
    var res = [], toks = str.replace(/[,?]/g,' ').split(' ');
    for(var i=0;i<toks.length;i++) {
      for(var key in months) {
        if(toks[i].indexOf(key)>=0) {
          var ctx = toks.slice(i,i+3).join(' ');
          var yr = (ctx.indexOf('2026')>=0||ctx.indexOf("'26")>=0) ? 26 : 25;
          res.push(Math.min(yr===26?months[key]+12:months[key], LABELS.length-1));
          break;
        }
      }
    }
    return res;
  }
  function getFund(str) {
    var checks = [['הראל מגוון','מגוון'],['פוליסת חיסכון','מגוון'],['928884078','מגוון'],['הראל מניות','מניות'],['106863031','מניות'],['הראל כללי','כללי'],['109062745','כללי'],['ארביטראז','ארביטראז'],['ואליו','ארביטראז'],['מיטב קרנות','169301968'],['169301968','169301968'],['טרייד','טרייד'],['כספית','כספית'],['מור גמל','מור גמל'],['מור קה','מור קה'],['פניקס','פניקס'],['שקלי','שקלי'],['דולרי','דולרי']];
    for(var i=0;i<checks.length;i++) {
      if(str.indexOf(checks[i][0])>=0) {
        for(var k in FUNDS) if(FUNDS[k].name.toLowerCase().indexOf(checks[i][1])>=0) return FUNDS[k];
      }
    }
    return null;
  }
  function catSum(cat,idx) { return Object.values(FUNDS).filter(function(f){return f.cat===cat;}).reduce(function(s,f){return s+(f.data[idx]||0);},0); }
  function fmt(name,v1,v2,l1,l2) { var d=v2-v1,p=v1>0?(d/v1*100).toFixed(1):'—'; return name+':\n'+l1+': '+Math.round(v1).toLocaleString()+'\n'+l2+': '+Math.round(v2).toLocaleString()+'\nשינוי: '+(d>=0?'+':'')+Math.round(d).toLocaleString()+' ('+(d>=0?'+':'')+p+'%)'; }
  var mi = getMonths(q);
  var yf=-1,yt=-1;
  if(q.indexOf('2025')>=0&&q.indexOf('2026')<0){yf=0;yt=11;}
  else if(q.indexOf('2026')>=0&&q.indexOf('2025')<0){yf=12;yt=LABELS.length-1;}
  else if(q.indexOf('2025')>=0&&q.indexOf('2026')>=0){yf=0;yt=LABELS.length-1;}
  var isChg = ['עלה','ירד','שינוי','עלייה','גדל','בכמה','תשואה','עלתה','ירדה','השתנה','הפרש','ביצועים'].some(function(w){return q.indexOf(w)>=0;});
  var fund = getFund(q);
  if(fund) {
    // Best/worst month for a fund
    if(q.indexOf('חודש')>=0&&(q.indexOf('גבוה')>=0||q.indexOf('מקסימום')>=0||q.indexOf('הכי')>=0)) {
      var fi5=yf>=0?yf:0, ti5=yt>=0?yt:LABELS.length-1;
      var maxV=-Infinity, maxL='';
      for(var i5=fi5;i5<=ti5;i5++) { if((fund.data[i5]||0)>maxV){maxV=fund.data[i5];maxL=LABELS[i5];} }
      return fund.name+':\nהחודש הגבוה ביותר: '+maxL+'\nערך: '+maxV.toLocaleString()+' אלפי ש"ח';
    }
    if(q.indexOf('חודש')>=0&&(q.indexOf('נמוך')>=0||q.indexOf('מינימום')>=0)) {
      var fi6=yf>=0?yf:0, ti6=yt>=0?yt:LABELS.length-1;
      var minV=Infinity, minL='';
      for(var i6=fi6;i6<=ti6;i6++) { var v6=fund.data[i6]||0; if(v6>0&&v6<minV){minV=v6;minL=LABELS[i6];} }
      return fund.name+':\nהחודש הנמוך ביותר: '+minL+'\nערך: '+minV.toLocaleString()+' אלפי ש"ח';
    }
    if(mi.length>=2) return fmt(fund.name,fund.data[mi[0]]||0,fund.data[mi[1]]||0,LABELS[mi[0]],LABELS[mi[1]]);
    if(yf>=0||isChg) { var fi=yf>=0?yf:0,ti=yt>=0?yt:LABELS.length-1; return fmt(fund.name,fund.data[fi]||0,fund.data[ti]||0,LABELS[fi],LABELS[ti]); }
    if(mi.length===1) return fund.name+' ב'+LABELS[mi[0]]+': '+(fund.data[mi[0]]!=null?fund.data[mi[0]].toLocaleString()+' אלפי ש"ח':'אין נתון');
    return fmt(fund.name,fund.data[0]||0,fund.data[LABELS.length-1]||0,LABELS[0],LABELS[LABELS.length-1]);
  }
  var cats = {'hishtalmut':['השתלמות'],'gemel':['קופות גמל','קופת גמל','גמל'],'gemel_invest':['גמל להשקעה'],'harel':['הראל'],'meitav':['מיטב'],'mezuman':['מזומן'],'arbitrage':['ארביטראז'],'dira':['דירה'],'chov':['חוב']};
  for(var cat in cats) {
    if(cats[cat].some(function(kw){return q.indexOf(kw)>=0;})) {
      if(mi.length===1&&!isChg&&yf<0) return CAT_NAMES[cat]+' ב'+LABELS[mi[0]]+': '+Math.round(catSum(cat,mi[0])).toLocaleString()+' אלפי ש"ח';
      if(isChg||yf>=0) { var fi2=yf>=0?yf:(mi[0]!=null?mi[0]:0),ti2=yt>=0?yt:(mi[1]!=null?mi[1]:LABELS.length-1); return fmt(CAT_NAMES[cat],catSum(cat,fi2),catSum(cat,ti2),LABELS[fi2],LABELS[ti2]); }
      return fmt(CAT_NAMES[cat],catSum(cat,0),catSum(cat,LABELS.length-1),LABELS[0],LABELS[LABELS.length-1]);
    }
  }
  if(q.indexOf('תשואה')>=0||q.indexOf('ביצועים')>=0) {
    var fi3=yf>=0?yf:0,ti3=yt>=0?yt:LABELS.length-1,lines=[];
    ['hishtalmut','gemel','gemel_invest','harel','meitav'].forEach(function(c){var v1=catSum(c,fi3),v2=catSum(c,ti3),d=v2-v1,p=v1>0?(d/v1*100).toFixed(1):'—';lines.push(CAT_NAMES[c]+': '+(d>=0?'+':'')+p+'%');});
    return 'תשואה '+LABELS[fi3]+' – '+LABELS[ti3]+':\n'+lines.join('\n');
  }
  if(q.indexOf('סך')>=0||q.indexOf('סה"כ')>=0||q.indexOf('תיק')>=0||q.indexOf('כולל')>=0) {
    if(mi.length===1) return 'סה"כ תיק ב'+LABELS[mi[0]]+': '+Math.round(ALL_TOTALS[mi[0]]).toLocaleString()+' אלפי ש"ח';
    var fi4=yf>=0?yf:0,ti4=yt>=0?yt:LABELS.length-1;
    return fmt('סה"כ תיק',ALL_TOTALS[fi4],ALL_TOTALS[ti4],LABELS[fi4],LABELS[ti4]);
  }
  return 'אני יכול לענות על:\n• כמה היה הראל מגוון בספטמבר 25?\n• בכמה עלתה הראל מגוון בשנת 2025?\n• מה התשואה של כל הקטגוריות?\n• סך הכל התיק בדצמבר 25?';
}

// ===== EXCEL LOADER =====
function cfParseWorkbook(wb) {
  var HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];

  // קריאת ערך תא לפי שורה/עמודה (0-based)
  function cellVal(ws, r, c) {
    var cell = ws[XLSX.utils.encode_cell({r: r, c: c})];
    return cell ? cell.v : null;
  }

  // מיפוי שמות חודשים — משותף לשתי הפונקציות למטה
  var MONTH_NAME_MAP = {
    'january':1, 'jan':1, 'february':2, 'feb':2,
    'march':3, 'mar':3, 'mars':3, 'april':4, 'apr':4, 'may':5,
    'june':6, 'jun':6, 'july':7, 'jul':7, 'august':8, 'aug':8,
    'september':9, 'sep':9, 'october':10, 'oct':10, 'november':11, 'nov':11,
    'december':12, 'dec':12,
    'ינואר':1, 'ינו':1, 'פברואר':2, 'פבר':2,
    'מרץ':3, 'מרס':3, 'אפריל':4, 'אפר':4, 'מאי':5,
    'יוני':6, 'יולי':7, 'אוגוסט':8, 'אוג':8,
    'ספטמבר':9, 'ספט':9, 'אוקטובר':10, 'אוק':10,
    'נובמבר':11, 'נוב':11, 'דצמבר':12, 'דצמ':12
  };
  var MONTH_NAME_SORTED = Object.keys(MONTH_NAME_MAP).sort(function(a,b){return b.length-a.length;});

  // פיענוח כותרת חודש. defaultYear: שנה מגיליון (fallback כשאין שנה בתא)
  function parseMonthHeader(v, defaultYear) {
    if (v == null) return null;
    if (typeof v === 'number' && v > 40000) {
      var d = new Date(Math.round((v - 25569) * 86400 * 1000));
      return {y: d.getUTCFullYear(), m: d.getUTCMonth() + 1};
    }
    if (v instanceof Date) {
      // v20.1: SheetJS מחזיר Date בשעון מקומי. getUTCMonth() גורם ל-off-by-one ב-UTC+3
      // (אפריל 1 מקומי = 31 מרץ UTC → נספר כמרץ). נוסיף 12 שעות להבטחת חודש נכון.
      var shifted = new Date(v.getTime() + 12 * 3600 * 1000);
      return {y: shifted.getUTCFullYear(), m: shifted.getUTCMonth() + 1};
    }
    // נרמל: החלף כל סוגי רווחים (כולל non-breaking space U+00A0, BOM U+FEFF) ברווח רגיל
    var s = String(v).replace(/[\u00A0\uFEFF\t\r\n]+/g, ' ').trim();
    // MM/YYYY או MM-YYYY
    var mmyyyy = s.match(/^(\d{1,2})[\/\-\.](\d{4})$/);
    if (mmyyyy) {
      var mo = parseInt(mmyyyy[1]), yr = parseInt(mmyyyy[2]);
      if (mo >= 1 && mo <= 12 && yr >= 2025) return {y: yr, m: mo};
    }
    var sl = s.toLowerCase();
    var yearMatch = s.match(/([12][0-9]{3})/);
    var y = yearMatch ? parseInt(yearMatch[1]) : null;
    // חיפוש שם חודש (מהארוך לקצר)
    for (var i = 0; i < MONTH_NAME_SORTED.length; i++) {
      var nm = MONTH_NAME_SORTED[i];
      if (sl.indexOf(nm.toLowerCase()) >= 0 || s.indexOf(nm) >= 0) {
        // יש שם חודש — קבע שנה
        if (y && y >= 2025) return {y: y, m: MONTH_NAME_MAP[nm]};
        if (defaultYear) return {y: defaultYear, m: MONTH_NAME_MAP[nm]};
      }
    }
    return null;
  }

  // פירסור גיליון בודד → מחזיר מערך חודשים. sheetYear: שנה שחולצה משם הגיליון
  function parseSheet(ws, sheetYear) {
    if (!ws) return [];
    var wsRange = XLSX.utils.decode_range(ws['!ref'] || 'A1:BZ200');
    var maxCol = wsRange.e.c;
    var maxRow = wsRange.e.r;

    // 1. מצא HEADER_ROW (שורת כותרות חודשים) ואת העמודה הראשונה של חודש
    var HEADER_ROW = -1, firstMonthCol = -1;
    for (var hr = 0; hr <= 20 && HEADER_ROW < 0; hr++) {
      for (var c = 0; c <= maxCol; c++) {
        var pd0 = parseMonthHeader(cellVal(ws, hr, c), sheetYear);
        if (pd0 && pd0.y >= 2025) { HEADER_ROW = hr; firstMonthCol = c; break; }
      }
    }
    if (HEADER_ROW < 0) return [];

    // 2. ROW_MAP סטטי — v16.97: הוסרו total_income/total_exp/net_cashflow/profit_loss
    // שורות אלו חייבות להימצא דינמית בלבד (מנגנון הסריקה). אם לא נמצאו — val=null → מוצג 0.
    // המספרים 42/30/12 הגיעו מכך שהמפתח הסטטי הצביע לשורה שגויה — הסרתם מבטלת זאת לחלוטין.
    var ROW_MAP = {
      3:'salary', 4:'rent_income', 5:'other_income', 6:'buffer',
      9:'visa', 10:'cash_exp', 11:'loans', 12:'yotam', 13:'other_exp',
      19:'renovation',
      25:'salary_usd', 26:'exp_usd', 27:'yotam_usd', 28:'total_usd',
      39:'delta'
    };

    // v17.1: normalizeForCompare — ניקוי מלא לפני השוואה
    // שלב 1: תווים בלתי-נראים → רווח; שלב 2: גרשיים/מרכאות → ASCII; שלב 3: רווחים כפולים → אחד
    function normalizeForCompare(s) {
      return s
        .replace(/[\u00A0\uFEFF\u200B\u200C\u200D\u2060\u180E]/g, ' ')  // non-breaking/invisible → רווח
        .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036\uFF02]/g, '"')  // מרכאות מעוגלות → ASCII "
        .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035\u0060]/g, "'")  // גרש מעוגל → ASCII '
        .replace(/\u05F4/g, '"')    // ״ גרשיים עברי → ASCII "
        .replace(/\u05F3/g, "'")    // ׳ גרש עברי → ASCII '
        .replace(/\s*[\/\\]\s*/g, ' / ')  // כל וריאנטי סלש → רווח+סלש+רווח
        .replace(/\s+/g, ' ')       // רווחים כפולים → רווח יחיד
        .trim();
    }

    // 3. זיהוי דינמי (case-insensitive) — סרוק עמודות לפני firstMonthCol
    //    מטרה: לאפשר מיפוי אוטומטי גם לאקסלים עם מבנה שונה
    // v18.3: KEY_LABELS — כותרות ייחודיות מהאקסל המעודכן
    var KEY_LABELS = {
      total_income: ['סה"כ הכנסות', 'סה״כ הכנסות'],
      total_exp:    ['סה"כ הוצאות', 'סה״כ הוצאות'],
      profit_loss:  ['רווח / הפסד', 'רווח/ הפסד', 'רווח /הפסד', 'רווח/הפסד'],
      salary:       ['הכנסה ממשכורת'],
      rent_income:  ['שכר דירה', 'שכירות', 'שכ"ד', 'שכ״ד'],
      other_income: ['הכנסות שונות', 'הכנסה אחרת'],
      buffer:       ['פריטה מ-buffer', 'פריטה מ buffer', 'פריטה'],
      visa:         ['חיוב ויזה', 'ויזה', 'כרטיס אשראי'],
      cash_exp:     ['הוצאות מזומן'],
      loans:        ['הלוואות', 'החזר הלוואות', 'החזר הלוואה'],
      yotam:        ['יותם'],
      other_exp:    ['הוצאות שונות', 'הוצאות חריגות'],
      renovation:   ['הוצאות שיפוץ', 'שיפוץ'],
      net_cashflow: ['תזרים שקלי נטו', 'נטו שוטף', 'תזרים נטו'],
      salary_usd:   ['משכורת $ (בשקלים)', 'משכורת $', 'משכורת דולר'],
      exp_usd:      ['הוצאות $ (בשקלים)', 'הוצאות $', 'הוצאות דולר'],
      total_usd:    ['סך הכל $', 'סה"כ דולר', 'סה״כ דולר'],
      delta:        ['∆ תזרים שוטף', '\u0394 תזרים']
    };

    // עמודות לסריקה: col 0 + כל העמודות לפני firstMonthCol
    var colsToScan = [];
    for (var lc2 = 0; lc2 < Math.min(firstMonthCol, 6); lc2++) { colsToScan.push(lc2); }
    if (colsToScan.indexOf(0) < 0) colsToScan.push(0);

    var scanFrom = HEADER_ROW + 1;
    var scanTo   = Math.min(maxRow, HEADER_ROW + 150); // v16.97: טווח סריקה מורחב ל-150 שורות

    // v16.97: בנה רשימת שורות לא-ריקות בלבד — מדלג על שורות ריקות לחלוטין
    // מונע מצב שאקסל עם הרבה שורות ריקות "מוריד" שורות חשובות אל מחוץ לטווח הסריקה
    var nonEmptyRows = [];
    for (var r0 = scanFrom; r0 <= scanTo; r0++) {
      for (var c0 = 0; c0 < Math.min(firstMonthCol + 1, 7); c0++) {
        var cv0 = cellVal(ws, r0, c0);
        if (cv0 !== null && cv0 !== undefined) {
          var cvStr = String(cv0).replace(/[\u00A0\uFEFF\t\r\n\s]+/g, '').trim();
          if (cvStr.length > 0) { nonEmptyRows.push(r0); break; }
        }
      }
    }

    // מעבר 1: כל שאר המפתחות — First Match Only
    var mappedKeys = {};

    colsToScan.forEach(function(lc) {
      for (var nri = 0; nri < nonEmptyRows.length; nri++) {
        var sr = nonEmptyRows[nri];
        var lbl = cellVal(ws, sr, lc);
        if (!lbl) continue;
        var lblTrimmed = String(lbl).replace(/[\u00A0\uFEFF\t\r\n]+/g, ' ').trim();
        if (!lblTrimmed) continue;
        var ls = normalizeForCompare(lblTrimmed.toLowerCase());
        for (var lkey in KEY_LABELS) {
          if (mappedKeys[lkey]) continue;
          if (KEY_LABELS[lkey].length === 0) continue;
          // שורות ברזל מטופלות במעבר 2 — דלג כאן
          if (lkey === 'total_income' || lkey === 'total_exp' || lkey === 'profit_loss') continue;
          if (KEY_LABELS[lkey].some(function(kw){
            var nkw = normalizeForCompare(kw.toLowerCase());
            if (nkw.replace(/\s+/g, '').length <= 4) return ls === nkw;
            return ls.indexOf(nkw) >= 0;
          })) {
            Object.keys(ROW_MAP).forEach(function(k){ if (ROW_MAP[k] === lkey) delete ROW_MAP[k]; });
            ROW_MAP[sr] = lkey;
            mappedKeys[lkey] = true;
            break;
          }
        }
      }
    });

    // v19.2: מעבר 2 — שורות ברזל בלבד: EXACT MATCH + LAST ROW (הסכום האמיתי תמיד אחרי תת-הסכומים)
    var IRON_KEYS = ['total_income', 'total_exp', 'profit_loss'];
    IRON_KEYS.forEach(function(ikey) {
      var lastMatchRow = null;
      colsToScan.forEach(function(lc) {
        for (var nri = 0; nri < nonEmptyRows.length; nri++) {
          var sr = nonEmptyRows[nri];
          var lbl = cellVal(ws, sr, lc);
          if (!lbl) continue;
          var lblTrimmed = String(lbl).replace(/[\u00A0\uFEFF\t\r\n]+/g, ' ').trim();
          if (!lblTrimmed) continue;
          var ls = normalizeForCompare(lblTrimmed.toLowerCase());
          var matched = KEY_LABELS[ikey].some(function(kw) {
            return ls === normalizeForCompare(kw.toLowerCase()); // חייב === בלבד
          });
          if (matched) {
            lastMatchRow = sr; // תמיד עדכן — ה-LAST row מנצח
            console.log('[v19.2] iron candidate:', ikey, '→ row', sr, '| label:', lblTrimmed);
          }
        }
      });
      if (lastMatchRow !== null) {
        Object.keys(ROW_MAP).forEach(function(k){ if (ROW_MAP[k] === ikey) delete ROW_MAP[k]; });
        ROW_MAP[lastMatchRow] = ikey;
        console.log('[v19.2] FINAL iron row:', ikey, '→ row', lastMatchRow);
      }
    });

    // 4. קרא נתוני חודשים
    // v20.0: targetCol = בדיוק העמודה שבה נמצאה הכותרת. ללא חישובים, ללא הזזות.
    var sheetResult = [];
    var seenMonths = {};
    for (var col = 0; col <= maxCol; col++) {
      var colHeaderRaw = cellVal(ws, HEADER_ROW, col);
      if (colHeaderRaw && typeof colHeaderRaw === 'string') {
        var colHeaderLower = colHeaderRaw.trim().toLowerCase();
        if (colHeaderLower.indexOf('סיכומים') >= 0 || colHeaderLower.indexOf('summary') >= 0 || colHeaderLower.indexOf('סיכום') >= 0) {
          continue;
        }
      }
      var pd = parseMonthHeader(colHeaderRaw, sheetYear);
      if (!pd || pd.y < 2025) continue;
      var _mLabel = HEB_MONTHS[pd.m - 1] + ' ' + pd.y;
      var _mMonthId = pd.y + '-' + (pd.m < 10 ? '0' + pd.m : '' + pd.m);
      // כל חודש נלקח פעם אחת — מהעמודה הראשונה שבה הכותרת שלו מופיעה
      var monthKey = pd.y * 100 + pd.m;
      if (seenMonths[monthKey]) continue;
      seenMonths[monthKey] = true;
      // v20.1: targetCol = בדיוק col — First Match, עוצרים כאן.
      var targetCol = col;
      console.log('[v20.1] Locking on FIRST match for', _mLabel, 'at column', targetCol);
      var mObj = { label: _mLabel, monthId: _mMonthId, year: pd.y, month: pd.m, rows: {} };
      Object.keys(ROW_MAP).forEach(function(ri) {
        var rowIdx = parseInt(ri);
        var val  = cellVal(ws, rowIdx, targetCol);
        var note = cellVal(ws, rowIdx, targetCol + 1);
        var num  = null;
        if (val !== null && val !== undefined) {
          var p = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''));
          if (!isNaN(p)) num = Math.round(p * 10) / 10;
        }
        var noteStr = (note != null && String(note).trim() !== '') ? String(note).trim() : null;
        mObj.rows[ROW_MAP[ri]] = {val: num, note: noteStr};
      });
      sheetResult.push(mObj);
    }
    return sheetResult;
  }

  // קרא את כל הגיליונות עם 'שוטף חדשי' — גיליון מאוחר יותר דורס קודם
  var CF_KEY = 'שוטף חדשי'.normalize('NFC');
  var allMonths = {};
  wb.SheetNames.forEach(function(name) {
    if (name.normalize('NFC').indexOf(CF_KEY) < 0) return;
    // חולץ שנה משם הגיליון (למשל 'שוטף חדשי 2026' → 2026)
    var nameYearMatch = name.match(/(\d{4})/);
    var sheetYear = nameYearMatch ? parseInt(nameYearMatch[1]) : null;
    // תיקון v16.94: סרוק אך ורק גיליונות 2025 ו-2026 — גיליונות ישנים יותר הורסים את המיפוי
    if (!sheetYear || (sheetYear !== 2025 && sheetYear !== 2026)) {
      return;
    }
    var sheetMonths = parseSheet(wb.Sheets[name], sheetYear);
    sheetMonths.forEach(function(m) {
      allMonths[m.year * 100 + m.month] = m;
    });
  });

  var result = [];
  Object.keys(allMonths).forEach(function(k) { result.push(allMonths[k]); });
  result.sort(function(a, b) { return (a.year * 100 + a.month) - (b.year * 100 + b.month); });
  return result;
}

function smartUploadRouter(input) {
  var file = input.files[0];
  if (!file) return;
  var status = document.getElementById('excel-status');
  if(status) status.textContent = 'קורא קובץ...';
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      // v19.2: ניקוי זיכרון אגרסיבי — דף נקי בכל טעינת אקסל
      localStorage.clear();
      CF_DATA = [];
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, {type:'array', cellDates:true});
      var cfKey = 'שוטף חדשי'.normalize('NFC');
      var isCF = wb.SheetNames.some(function(n){ return n.normalize('NFC').indexOf(cfKey) >= 0; });
      if (isCF) {
        var newData = cfParseWorkbook(wb);
        if (newData.length > 0) {
          CF_DATA = newData;
          CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(newData); // v19.0: THE CLOCK RULE
          CF_SELECTED_MONTH_ID = null; // איפוס בחירה ידנית בטעינת קובץ חדש
          var _lastM = CF_DATA[cfGetLastRealMonth ? cfGetLastRealMonth() : CF_DATA.length - 1];
          var _logInc = _lastM && _lastM.rows.total_income ? (_lastM.rows.total_income.val || 0) : 0;
          var _logExp = _lastM && _lastM.rows.total_exp    ? (_lastM.rows.total_exp.val    || 0) : 0;
          console.log('!!! V35.0 - FINAL ACCURACY & SYNC !!!');
          console.log('[Dashboard v35.0] | חודשים:', newData.length, '| נוכחי:', CF_CURRENT_MONTH_ID, '| הכנסות:', _logInc, '| הוצאות:', _logExp);
          localStorage.setItem('dashboard_cf_version', '35.0');
          saveCFToLocalStorage();
          // תמיד מאלץ רינדור מחדש — גם אם הטאב לא פעיל
          cfInited = false;
          var cfPanel = document.getElementById('tab-cashflow');
          if (cfPanel) {
            // הצג את טאב התזרים ורנדר
            switchTab('cashflow');
          }
          if(status) {
            var lastM = newData[newData.length - 1];
            var inc = lastM.rows.total_income ? (lastM.rows.total_income.val || 0) : 0;
            var exp = lastM.rows.total_exp    ? (lastM.rows.total_exp.val    || 0) : 0;
            status.textContent = '✅ עודכנו נתוני תזרים – ' + newData.length + ' חודשים | ' + lastM.label + ': הכנסות ' + Math.round(inc) + ', הוצאות ' + Math.round(exp);
            setTimeout(function(){status.textContent='';}, 6000);
          }
        } else {
          // פיענוח נכשל — נקה נתונים ישנים כדי לא להציג mock
          CF_DATA = [];
          localStorage.removeItem('dashboard_cf_data');
          cfInited = false;
          var cfPanel2 = document.getElementById('tab-cashflow');
          if (cfPanel2) { switchTab('cashflow'); } // יציג מסך "אין נתונים"
          var cfSheets = wb.SheetNames.filter(function(n){ return n.normalize('NFC').indexOf(cfKey) >= 0; });
          var errMsg = cfSheets.length > 0
            ? '⚠️ הגיליון "' + cfSheets[0] + '" נמצא אך לא נמצאו חודשים תקינים (ראה Console לפרטים)'
            : '⚠️ לא נמצאו גיליונות "שוטף חדשי". גיליונות: ' + wb.SheetNames.slice(0, 4).join(', ');
          if(status) { status.textContent = errMsg; setTimeout(function(){status.textContent='';}, 8000); }
        }
      } else {
        var hasInvestSheets = wb.SheetNames.some(function(n){ return /^\d{2}_\d{2}_\d{4}$/.test(n); });
        if(hasInvestSheets) {
          loadExcelFileCore(wb);
        } else {
          if(status) { status.textContent = '❌ קובץ לא זוהה'; setTimeout(function(){status.textContent='';},4000); }
        }
      }
    } catch(err) {
      if(status) status.textContent = '❌ שגיאה: ' + err.message;
    }
  };
  reader.readAsArrayBuffer(file);
}

// cfLoadExcel – called by the upload button inside the cashflow tab
function cfLoadExcel(input) {
  smartUploadRouter(input);
}

function loadExcelFile(input) {
  var file = input.files[0];
  if (!file) return;
  var status = document.getElementById('excel-status');
  status.textContent = 'קורא קובץ...';
  
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, {type:'array', cellDates:true});
      loadExcelFileCore(wb);
    } catch(err) {
      var status = document.getElementById('excel-status');
      status.textContent = '❌ שגיאה בקריאת קובץ: ' + err.message;
    }
  };
  reader.readAsArrayBuffer(file);
}

function loadExcelFileCore(wb) {
    var status = document.getElementById('excel-status');
    try {
      // Anchor map: name -> anchor_id (from Dashboard_Data sheet)
      var ANCHOR_MAP = {
        // מזומן
        'שיקלי': 'CASH_ILS',
        'דולרי': 'CASH_USD',
        'מיטב שקלית 5136544': 'SAV_MEITAV_CASH',
        // קרנות השתלמות - שמות כפי שמופיעים באקסל
        '39905556 א״ש ק״הש': 'PENS_SH_ALT_39905556',
        'א״ש ק״הש 6730513': 'PENS_SH_MEITAV_442504',
        'א״ש קה״ש 40035706': 'PENS_SH_ALT_40035706',
        'מור קה״ש 499293': 'PENS_SH_MEITAV_443195',
        'מיטב ק״הש 917-442504': 'PENS_SH_MEITAV_442504',
        'מיטב קה״ש 917-443195': 'PENS_SH_MEITAV_443195',
        'מיטב קה״ש 912-443286': 'PENS_SH_MEITAV_443286',
        '443286 מיטב קה״ש': 'PENS_SH_MEITAV_443286',
        // קופות גמל
        '6730511 א״ש גמל': 'PENS_GEMEL_MOR_1428298',
        'מור גמל 1428298': 'PENS_GEMEL_MOR_1428298',
        'א״ש גמל 39774495': 'PENS_GEMEL_MOR_1375688',
        'מור גמל 1375688': 'PENS_GEMEL_MOR_1375688',
        '6730512 א״ש גמל': 'PENS_GEMEL_MOR_1375888',
        '1375888 מור גמל': 'PENS_GEMEL_MOR_1375888',
        '6899425 א״ש גמל': 'PENS_GEMEL_MOR_1375911',
        '1375911 מור גמל': 'PENS_GEMEL_MOR_1375911',
        'הפניקס גמל 926-084678': 'PENS_GEMEL_PHX_084678',
        'מור גמל 1375900': 'PENS_GEMEL_MOR_1375900',
        '1375900 מור גמל': 'PENS_GEMEL_MOR_1375900',
        // גמל להשקעה
        'א״ש גמל להשקעה 2016-17 38009022': 'INV_GEMEL_MEITAV_917_443197',
        'מיטב גמל להשקעה 917-443197': 'INV_GEMEL_MEITAV_917_443197',
        'מור גמל להשקעה': 'INV_GEMEL_MEITAV_912_443197',
        'מור גמל להשקעה 470234': 'INV_GEMEL_MEITAV_912_443197',
        'מיטב גמל להשקעה 912-443197': 'INV_GEMEL_MEITAV_912_443197',
        // הראל
        'הראל מגוון - פוליסת חיסכון': 'SAV_HAREL_928884078',
        'הראל מגוון - פוליסת חיסכון כללי 928884078': 'SAV_HAREL_928884078',
        'הראל מניות 106863031': 'SAV_HAREL_106863031',
        'הראל כללי 109062745': 'SAV_HAREL_109062745',
        // מיטב
        'מיטב דש ניהול קרנות 169301968': 'SAV_MEITAV_169301968',
        'מיטב דש טרייד': 'SAV_MEITAV_TRADE',
        // שאר
        'דירה': 'RE_ISRAEL_MAIN',
        'חוב הראל': 'LIAB_HAREL',
        'חוב אלטשולר': 'LIAB_ALTSHULER',
        'ארביטראז׳ ואליו': 'SOLD_ARBITRAGE',
      };

      // Fund ID -> FUNDS key mapping
      var ANCHOR_TO_FUND = {
        'CASH_ILS': 'מזומןשקלי',
        'CASH_USD': 'מזומןדולרי',
        'PENS_SH_ALT_39905556': 'אשקהש39905556',
        'PENS_SH_ALT_40035706': 'אשקהש40035706',
        'PENS_SH_MEITAV_442504': 'אשקהש6730513',
        'PENS_SH_MEITAV_443195': 'מורקהש499293',
        'PENS_SH_MEITAV_443286': 'מיטבקהש912-443286',
        'PENS_GEMEL_MOR_1428298': '6730511אשגמל',
        'PENS_GEMEL_MOR_1375688': 'אשגמל39774495',
        'PENS_GEMEL_MOR_1375888': '6730512אשגמל',
        'PENS_GEMEL_MOR_1375911': '6899425אשגמל',
        'PENS_GEMEL_PHX_084678': 'הפניקסגמל926-084678',
        'PENS_GEMEL_MOR_1375900': 'מורגמל1375900',
        'INV_GEMEL_MEITAV_917_443197': 'אשגמללהשקעה2016-1738',
        'INV_GEMEL_MEITAV_912_443197': 'מורגמללהשקעה',
        'SAV_HAREL_928884078': 'הראלמגוון-פוליסתחיסכ',
        'SAV_HAREL_106863031': 'הראלמניות106863031',
        'SAV_HAREL_109062745': 'הראלכללי109062745',
        'SAV_MEITAV_169301968': 'מיטבדשניהולקרנות1693',
        'SAV_MEITAV_TRADE': 'מיטבדשטרייד',
        'SAV_MEITAV_CASH': 'מיטבשקלית',
        'RE_ISRAEL_MAIN': 'דירה',
        'LIAB_HAREL': 'חובהראל',
        'LIAB_ALTSHULER': 'חובאלטשולר',
        'SOLD_ARBITRAGE': 'ארביטראזואליו',
      };

      // Parse sheet dates, keep only 2025+
      var MONTH_NAMES = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];
      
      function parseSheetDate(name) {
        var clean = name.split('-')[0];
        var parts = clean.split('_');
        if (parts.length === 3) {
          var d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
          if (y >= 2025 && m >= 1 && m <= 12) return new Date(y, m-1, d);
        }
        return null;
      }

      function monthLabel(d) {
        return MONTH_NAMES[d.getMonth()] + "' " + String(d.getFullYear()).slice(2);
      }

      // Collect sheets per month, keep latest
      var monthSheets = {};
      wb.SheetNames.forEach(function(sname) {
        var d = parseSheetDate(sname);
        if (!d) return;
        var key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
        if (!monthSheets[key] || d > monthSheets[key].date) {
          monthSheets[key] = {date: d, name: sname};
        }
      });

      // Sort months
      var sortedKeys = Object.keys(monthSheets).sort();
      if (sortedKeys.length === 0) {
        status.textContent = 'לא נמצאו גיליונות תקינים';
        return;
      }

      // Build new labels and data
      var newLabels = sortedKeys.map(function(k) { return monthLabel(monthSheets[k].date); });
      
      // Init new data per fund key
      var newFundData = {};
      Object.keys(FUNDS).forEach(function(fk) {
        newFundData[fk] = new Array(newLabels.length).fill(null);
      });

      // Fill data from sheets
      sortedKeys.forEach(function(key, colIdx) {
        var sname = monthSheets[key].name;
        var ws = wb.Sheets[sname];
        var rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:null});
        
        rows.forEach(function(row) {
          var cellName = row[0];
          var cellVal = row[1];
          if (!cellName || typeof cellVal !== 'number') return;
          var normName = String(cellName).replace(/[ \t]+/g,' ').trim();
          var anchorId = ANCHOR_MAP[normName];
          if (!anchorId) return;
          var fundKey = ANCHOR_TO_FUND[anchorId];
          if (!fundKey || !newFundData[fundKey]) return;
          newFundData[fundKey][colIdx] = cellVal;
        });
      });

      // Update global data
      LABELS.length = 0;
      newLabels.forEach(function(l) { LABELS.push(l); });
      
      Object.keys(newFundData).forEach(function(fk) {
        if (FUNDS[fk]) FUNDS[fk].data = newFundData[fk];
      });

      // Recalculate CAT_TOTALS and ALL_TOTALS after data update
      Object.keys(CAT_TOTALS).forEach(cat => { CAT_TOTALS[cat].length = 0; });
      LABELS.forEach((_, i) => {
        Object.entries(CAT_TOTALS).forEach(([cat, arr]) => {
          const vals = Object.values(FUNDS).filter(f => f.cat===cat).map(f => f.data[i]||0);
          arr.push(vals.reduce((a,b)=>a+b,0));
        });
      });
      ALL_TOTALS.length = 0;
      LABELS.forEach((_, i) => {
        let t = 0;
        Object.entries(CAT_TOTALS).forEach(([cat, arr]) => { t += cat === 'chov' ? -(arr[i]||0) : (arr[i]||0); });
        ALL_TOTALS.push(t);
      });

      // Update table column headers
      document.querySelectorAll('th[data-col]').forEach(th => {
        const col = parseInt(th.getAttribute('data-col'));
        if (col >= 0 && col < LABELS.length) th.textContent = LABELS[col];
      });

      // Reset window to end
      winStart = Math.max(0, LABELS.length - WINDOW);

      // Rebuild chart totals (excludes sold funds)
      CAT_CHART_TOTALS = buildCatChartTotals();

      // Refresh chart with updated data
      if (currentView && currentView !== 'all') selectView(currentView);
      else selectView('all');

      // Read Notes sheet if exists
      loadNotesFromExcel(wb);

      // Refresh table cells from updated FUNDS data
      updateTableCells();
      saveToLocalStorage();
      markNoteMonths();

      // Refresh UI – reset currentData so chart picks up new arrays
      currentData = (currentView === 'all' || !currentView) ? ALL_TOTALS : (CAT_TOTALS[currentView] || ALL_TOTALS);
      selectView(currentView || 'all');
      updateNavButtons();
      
      status.textContent = '✅ הועלו נתוני השקעות – ' + newLabels.length + ' חודשים';
      status.style.color = '#4ade80';
      
    } catch(err) {
      status.textContent = 'שגיאה: ' + err.message;
      status.style.color = '#f87171';
    }
}


// THEME TOGGLE
var THEMES=[
  {cls:'',       lbl:'🎨 Slate Pro',line:'#2563eb',fill:'rgba(37,99,235,0.12)'},
  {cls:'t-slate',lbl:'🎨 Warm Pro', line:'#38bdf8',fill:'rgba(56,189,248,0.15)'},
  {cls:'t-warm', lbl:'🎨 Navy',     line:'#d97706',fill:'rgba(217,119,6,0.13)'},
  {cls:'t-navy', lbl:'🎨 Classic',  line:'#1a2744',fill:'rgba(26,39,68,0.12)'},
];
function toggleTheme(){
  var cur=parseInt(localStorage.getItem('th')||'0');
  var nxt=(cur+1)%4;
  THEMES.forEach(function(t){if(t.cls)document.body.classList.remove(t.cls);});
  if(THEMES[nxt].cls)document.body.classList.add(THEMES[nxt].cls);
  var btn=document.getElementById('theme-btn');
  if(btn)btn.textContent=THEMES[nxt].lbl;
  localStorage.setItem('th',nxt);
  setTimeout(function(){
    if(window.chart&&currentView==='all'){
      var ds=chart.data.datasets[0];
      ds.borderColor=THEMES[nxt].line;
      ds.backgroundColor=THEMES[nxt].fill;
      ds.pointBackgroundColor=THEMES[nxt].line;
      chart.update('none');
    }
  },20);
}
(function(){
  var s=parseInt(localStorage.getItem('th')||'0');
  if(s>0&&THEMES[s]){
    THEMES.forEach(function(t){if(t.cls)document.body.classList.remove(t.cls);});
    document.body.classList.add(THEMES[s].cls);
    var btn=document.getElementById('theme-btn');
    if(btn)btn.textContent=THEMES[s].lbl;
  }
})();
// END THEME TOGGLE



var _chartsInited = false;

function openCharts() {
  var m = document.getElementById('charts-modal');
  m.style.display = 'flex';
  // תמיד בנה מחדש – נתונים עשויים להתעדכן
  if (_chartsInited) {
    // השמד instances קודמים
    ['chart-by-cat','chart-equity','chart-liquidity','chart-manager'].forEach(function(id) {
      var existing = Chart.getChart(id);
      if (existing) existing.destroy();
    });
  }
  _chartsInited = true;

  function getcat(k) {
    var a = CAT_TOTALS[k];
    return (a && a.length) ? Math.round(a[a.length-1] || 0) : 0;
  }
  function lastVal(arr) {
    if (!arr) return 0;
    for (var i = arr.length-1; i >= 0; i--) {
      if (arr[i] != null && !isNaN(arr[i]) && arr[i] > 0) return arr[i];
    }
    return 0;
  }
  function fmt(v) { return Math.round(v).toLocaleString(); }

  // ---- 1. לפי קטגוריה ----
  var catDef = [
    { label:'מזומן שקלי',    color:'#0e7490', val: lastVal(FUNDS['מזומןשקלי'] && FUNDS['מזומןשקלי'].data) },
    { label:'מזומן $',       color:'#0891b2', val: lastVal(FUNDS['מזומןדולרי'] && FUNDS['מזומןדולרי'].data) },
    { label:'קרן כספית',     color:'#22d3ee', val: lastVal(FUNDS['מיטבשקלית'] && FUNDS['מיטבשקלית'].data) },
    { label:'__sep__', color:'', val:0 },
    { label:'קרנות השתלמות', color:'#f87171', val: getcat('hishtalmut') },
    { label:'קופות גמל',     color:'#fbbf24', val: getcat('gemel') },
    { label:'קופ"ג להשקעה', color:'#34d399', val: getcat('gemel_invest') },
    { label:'__sep__', color:'', val:0 },
    { label:'הראל',          color:'#fde047', val: getcat('harel') },
    { label:'__sep__', color:'', val:0 },
    { label:'מיטב קרנות',   color:'#a78bfa', val: getcat('meitav') },
    { label:'__sep__', color:'', val:0 },
    { label:'דירה',          color:'#9ca3af', val: getcat('dira') },
  ];
  var catFiltered = catDef.filter(function(d){ return d.label !== '__sep__'; });
  var catTotal = catFiltered.reduce(function(s,d){ return s+d.val; }, 0);
  makePie('chart-by-cat', 'legend-by-cat', catDef, catTotal);

  // ---- 2. מנייתי / כללי / כספי + פעיל ----
  var equityFunds    = ['אשקהש6730513','מורקהש499293','מיטבקהש912-443286',
                        '6730511אשגמל','אשגמל39774495','6730512אשגמל',
                        '6899425אשגמל','הפניקסגמל926-084678','מורגמל1375900',
                        'אשגמללהשקעה2016-1738','מורגמללהשקעה',
                        'מיטבדשניהולקרנות1693'];
  var cashFunds      = ['מיטבשקלית','מיטבדשטרייד'];
  var activeFunds    = ['מיטבקהש912-443286','6730511אשגמל','מורגמל1375900'];

  var eqVal=0, genVal=0, cashVal=0;
  var eqActive=0, genActive=0;

  Object.entries(FUNDS).forEach(function(entry) {
    var key = entry[0], f = entry[1];
    var v = lastVal(f.data);
    if (!v || v <= 0) return;
    var isCash   = cashFunds.includes(key);
    var isEquity = equityFunds.includes(key);
    var isActive = activeFunds.includes(key);
    if (isCash)        { cashVal += v; }
    else if (isEquity) { eqVal   += v; if (isActive) eqActive  += v; }
    else               { genVal  += v; if (isActive) genActive += v; }
  });

  eqVal   = Math.round(eqVal);
  genVal  = Math.round(genVal);
  cashVal = Math.round(cashVal);
  eqActive  = Math.round(eqActive);
  genActive = Math.round(genActive);

  var eqDef = [
    { label:'מנייתי', color:'#2563eb', val: eqVal,   active: eqActive },
    { label:'כללי',   color:'#64748b', val: genVal,  active: genActive },
    { label:'כספי',   color:'#06b6d4', val: cashVal, active: 0 },
  ];
  makePieWithActive('chart-equity', 'legend-equity', eqDef, eqVal+genVal+cashVal);

  // ---- 3. נזילות ----
  var age67T  = getcat('hishtalmut') + getcat('gemel');
  var selfT   = getcat('harel') + getcat('meitav') + getcat('gemel_invest');
  var liquidT = getcat('mezuman');
  var liqDef = [
    { label:'נזיל',            color:'#0891b2', val: liquidT },
    { label:'השקעה עצמית',     color:'#f59e0b', val: selfT },
    { label:'גיל 67+',         color:'#1e3a5f', val: age67T },
  ];
  makePie('chart-liquidity', 'legend-liquidity', liqDef, age67T+selfT+liquidT);

  // ---- 4. גוף מנהל ----
  // קרנות לפי גוף מנהל – מרץ 26 בלבד
  var mgrKeys = {
    'אלטשולר שחם': ['אשקהש39905556','אשקהש40035706'],
    'מור':          ['6730511אשגמל','אשגמל39774495','6730512אשגמל','6899425אשגמל','מורגמל1375900'],
    'מיטב כספית':  ['מיטבשקלית'],
    'מיטב קרנות':  ['מיטבדשניהולקרנות1693','מיטבדשטרייד'],
    'מיטב השתלמות+גמ"ל': ['מורקהש499293','מיטבקהש912-443286','אשגמללהשקעה2016-1738','מורגמללהשקעה'],
    'הראל':         ['הראלמגוון-פוליסתחיסכ','הראלכללי109062745'],
    'הפניקס':       ['הפניקסגמל926-084678'],
  };
  var mgrColors = {
    'אלטשולר שחם':         '#16a34a',
    'מור':                  '#f97316',
    'מיטב כספית':          '#c4b5fd',
    'מיטב קרנות':          '#7c3aed',
    'מיטב השתלמות+גמ"ל':  '#4c1d95',
    'הראל':                 '#fde047',
    'הפניקס':               '#db2777',
  };
  var mgr = Object.keys(mgrKeys).map(function(lbl) {
    var val = mgrKeys[lbl].reduce(function(s, k) {
      return s + (FUNDS[k] ? lastVal(FUNDS[k].data) : 0);
    }, 0);
    return { label: lbl, color: mgrColors[lbl], val: Math.round(val),
             tooltip: lbl };
  });
  var mgrTotal = mgr.reduce(function(s,m){ return s+m.val; }, 0);
  makePie('chart-manager', 'legend-manager', mgr, mgrTotal);
}

function makePieWithActive(canvasId, legendId, defs, total) {
  // בנה legend ידני עם שורת פעיל מתחת לכל קטגוריה
  var filtered = defs.filter(function(d){ return d.val > 0; });
  var ctx = document.getElementById(canvasId).getContext('2d');
  // מפה בין label לפעיל
  var activeMap = {};
  defs.forEach(function(d){ if(d.active) activeMap[d.label] = d.active; });

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filtered.map(function(d){ return d.label; }),
      datasets: [{
        data: filtered.map(function(d){ return d.val; }),
        backgroundColor: filtered.map(function(d){ return d.color; }),
        borderWidth: 2, borderColor: '#fff', hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: false, cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: function(c) {
          var lines = ['  ' + c.label + ': ' + c.parsed.toLocaleString() + ' אלפי ש"ח'];
          if (activeMap[c.label]) lines.push('  מתוכם פעיל: ' + activeMap[c.label].toLocaleString());
          return lines;
        }}, backgroundColor:'#fff', titleColor:'#6b7280', bodyColor:'#111827',
           borderColor:'#e5e7eb', borderWidth:1, cornerRadius:10,
           bodyFont:{family:'Heebo',size:12,weight:'600'} }
      }
    }
  });

  var legendEl = document.getElementById(legendId);
  legendEl.innerHTML = '';
  defs.forEach(function(d) {
    if (d.val <= 0) return;
    var pct = total > 0 ? (d.val/total*100).toFixed(1) : '0';
    // שורה ראשית + פעיל באותה שורה
    var row = document.createElement('div');
    row.className = 'ch-legend-item';
    row.style.fontWeight = '600';
    row.style.marginBottom = '5px';
    var activeStr = (d.active && d.active > 0)
      ? ' · <span style="color:#6b7280;font-weight:400;font-size:10px;">פעיל: ' + d.active.toLocaleString() + '</span>'
      : '';
    row.innerHTML = '<div class="ch-legend-dot" style="background:'+d.color+'"></div>'
      + '<span>' + d.label + ' · ' + d.val.toLocaleString()
      + ' <span style="color:#9ca3af">('+pct+'%)</span>'
      + activeStr + '</span>';
    legendEl.appendChild(row);
  });
}

function makePie(canvasId, legendId, defs, total) {
  var filtered = defs.filter(function(d){ return d.label !== '__sep__' && d.val > 0; });
  var ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filtered.map(function(d){ return d.label; }),
      datasets: [{
        data: filtered.map(function(d){ return d.val; }),
        backgroundColor: filtered.map(function(d){ return d.color; }),
        borderWidth: 2, borderColor: '#fff', hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: false,
      cutout: '60%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(c) {
              return '  ' + c.label + ': ' + c.parsed.toLocaleString() + ' אלפי ש"ח';
            }
          },
          backgroundColor:'#fff', titleColor:'#6b7280', bodyColor:'#111827',
          borderColor:'#e5e7eb', borderWidth:1, cornerRadius:10,
          bodyFont:{family:'Heebo',size:12,weight:'600'}
        }
      }
    }
  });

  // בנה legend ידני
  var legendEl = document.getElementById(legendId);
  legendEl.innerHTML = '';
  defs.forEach(function(d) {
    if (d.label === '__sep__') {
      var sep = document.createElement('div');
      sep.className = 'ch-legend-sep';
      legendEl.appendChild(sep);
      return;
    }
    if (d.val <= 0) return;
    var pct = total > 0 ? (d.val/total*100).toFixed(1) : '0';
    var row = document.createElement('div');
    row.className = 'ch-legend-item';
    row.innerHTML = '<div class="ch-legend-dot" style="background:'+d.color+'"></div>'
      + '<span>' + d.label + ' · ' + d.val.toLocaleString() + ' <span style="color:#9ca3af">(' + pct + '%)</span></span>';
    legendEl.appendChild(row);
  });
}

function toggleCard(el) {
  var wasExpanded = el.classList.contains('expanded');
  document.querySelectorAll('.ch-card').forEach(function(c){ c.classList.remove('expanded'); });
  if (!wasExpanded) el.classList.add('expanded');
}

function navBackToCat() {
  // חזרה לקטגוריה הפעילה
  if (currentCatContext) {
    selectView(currentCatContext);
    // פתח את הקטגוריה אם סגורה
    var body = document.getElementById('body-' + currentCatContext);
    var chev = document.getElementById('chev-' + currentCatContext);
    if (body && !body.classList.contains('open')) {
      body.classList.add('open');
      if (chev) chev.classList.add('open');
    }
    // גלול לקטגוריה
    var sec = document.getElementById('sec-' + currentCatContext);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.getElementById('chart-nav-btns').classList.remove('visible');
  currentCatContext = null;
}

function navCloseAll() {
  // סגור הכל וחזור לסה"כ
  selectView('all');
  document.querySelectorAll('.category-body.open').forEach(function(b) { b.classList.remove('open'); });
  document.querySelectorAll('.chevron.open').forEach(function(c) { c.classList.remove('open'); });
  document.getElementById('chart-nav-btns').classList.remove('visible');
  currentCatContext = null;
}

function closeCharts() {
  document.getElementById('charts-modal').style.display = 'none';
}

// ===== CATEGORY MODAL v5 =====
var cmChartInstance = null;
var cmCurrentCat = null;
var cmCurrentFundKey = null;
var cmFundClickState = 0; // 0=list, 1=graph, 2=graph+table
var cmCatFundKeys = [];
var cmWinStart = 0;
var CM_WINDOW = 13;
var cmChartData = null;

// ---- פתיחת מודאל ----
var cmOpenedFromTable = false;
function openCatModal(catId, fromTable) {
  cmOpenedFromTable = !!fromTable;
  var btnT = document.getElementById('cm-back-table');
  if (btnT) btnT.classList.toggle('visible', cmOpenedFromTable);
  cmCurrentCat = catId;
  cmCurrentFundKey = null;
  cmFundClickState = 0;
  var sec = document.getElementById('sec-' + catId);
  if (!sec) return;

  var color = getComputedStyle(sec).getPropertyValue('--cat-color').trim() || '#2563eb';
  var colorLight = getComputedStyle(sec).getPropertyValue('--cat-color-light').trim() || '#f0f4ff';
  var box = document.getElementById('cat-modal-box');
  box.style.setProperty('--cm-color', color);
  box.style.setProperty('--cm-color-light', colorLight);

  var hdr = document.getElementById('hdr-' + catId);
  var iconEl = hdr ? hdr.querySelector('.cat-icon') : null;
  var nameText = hdr ? (hdr.querySelector('.cat-name') ? hdr.querySelector('.cat-name').textContent : catId) : catId;
  document.getElementById('cm-icon').textContent = iconEl ? iconEl.textContent : '📊';
  document.getElementById('cm-icon').style.background = colorLight;
  var nameEl = document.getElementById('cm-name');
  nameEl.style.color = color;
  nameEl.textContent = nameText;

  cmWinStart = Math.max(0, LABELS.length - CM_WINDOW);
  cmCatFundKeys = Object.keys(FUNDS).filter(function(k){ return FUNDS[k].cat === catId; });

  // סטטיסטיקות קטגוריה
  cmSetCatStats(catId);

  // בנה רשימה ותצוגה
  cmBuildList(catId, color);
  cmShowList();

  document.getElementById('cat-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ---- סטטיסטיקות קטגוריה ----
function cmSetCatStats(catId) {
  var catData = CAT_CHART_TOTALS[catId] || CAT_TOTALS[catId] || [];
  var ff = forwardFill(catData.slice());
  var wData = ff.slice(cmWinStart, cmWinStart + CM_WINDOW).filter(function(v){ return v > 0; });
  if (!wData.length) return;
  var first = wData[0], last = wData[wData.length-1];
  document.getElementById('cm-total').textContent = Math.round(last).toLocaleString();
  var growth = last - first;
  var gEl = document.getElementById('cm-growth');
  gEl.textContent = Math.abs(Math.round(growth)).toLocaleString();
  gEl.className = 'cm-stat-val ' + (growth >= 0 ? 'pos' : 'neg');
  var excl = (typeof EXCLUDE_FROM_PCT !== 'undefined' && EXCLUDE_FROM_PCT[catId]) ? EXCLUDE_FROM_PCT[catId] : [];
  var endIdx = cmWinStart + wData.length - 1;
  var measEnd = Object.entries(FUNDS).filter(function(e){ return e[1].cat===catId && !excl.includes(e[0]) && (e[1].data[endIdx]||0)>0; }).reduce(function(s,e){ return s+(e[1].data[endIdx]||0); },0);
  var measStart = Object.entries(FUNDS).filter(function(e){ return e[1].cat===catId && !excl.includes(e[0]) && (e[1].data[endIdx]||0)>0; }).reduce(function(s,e){ return s+(e[1].data[cmWinStart]||0); },0);
  var retEl = document.getElementById('cm-ret');
  if (measStart > 0) { var ret = ((measEnd-measStart)/measStart*100).toFixed(1); retEl.textContent=Math.abs(parseFloat(ret)).toFixed(1)+'%'; retEl.className='cm-stat-val '+(parseFloat(ret)>=0?'pos':'neg'); }
  var janIdx = LABELS.findIndex(function(l){ return l.indexOf('ינ') >= 0 && l.indexOf('26') >= 0; });
  var ytdEl = document.getElementById('cm-ytd');
  if (janIdx >= 0 && endIdx >= janIdx) {
    var ytdEnd = Object.entries(FUNDS).filter(function(e){ return e[1].cat===catId && !excl.includes(e[0]) && (e[1].data[endIdx]||0)>0; }).reduce(function(s,e){ return s+(e[1].data[endIdx]||0); },0);
    var ytdStart = Object.entries(FUNDS).filter(function(e){ return e[1].cat===catId && !excl.includes(e[0]) && (e[1].data[endIdx]||0)>0; }).reduce(function(s,e){ return s+(e[1].data[janIdx]||0); },0);
    if (ytdStart > 0 && ytdEnd > 0) { var ytd=((ytdEnd-ytdStart)/ytdStart*100).toFixed(1); ytdEl.textContent=Math.abs(parseFloat(ytd)).toFixed(1)+'%'; ytdEl.className='cm-stat-val '+(parseFloat(ytd)>=0?'pos':'neg'); }
  }
}

// ---- סטטיסטיקות קרן ----
function cmSetFundStats(fundKey) {
  var fund = FUNDS[fundKey];
  var ff = ffFundData(fund.data);
  var wData = ff.slice(cmWinStart, cmWinStart + CM_WINDOW).filter(function(v){ return v > 0; });
  if (!wData.length) return;
  var first = wData[0], last = wData[wData.length-1];
  document.getElementById('cm-total').textContent = Math.round(last).toLocaleString();
  var growth = last - first;
  var gEl = document.getElementById('cm-growth');
  gEl.textContent = Math.abs(Math.round(growth)).toLocaleString();
  gEl.className = 'cm-stat-val ' + (growth >= 0 ? 'pos' : 'neg');
  var retEl = document.getElementById('cm-ret');
  if (first > 0) { var ret=((last-first)/first*100).toFixed(1); retEl.textContent=Math.abs(parseFloat(ret)).toFixed(1)+'%'; retEl.className='cm-stat-val '+(parseFloat(ret)>=0?'pos':'neg'); }
  var janIdx = LABELS.findIndex(function(l){ return l.indexOf('ינ') >= 0 && l.indexOf('26') >= 0; });
  var endIdx = Math.min(cmWinStart + CM_WINDOW - 1, LABELS.length - 1);
  var ytdEl = document.getElementById('cm-ytd');
  var decIdx = janIdx >= 1 ? janIdx - 1 : -1;
  if (decIdx >= 0 && endIdx >= janIdx && ff[decIdx] > 0 && ff[endIdx] > 0) {
    var ytd=((ff[endIdx]-ff[decIdx])/ff[decIdx]*100).toFixed(1); ytdEl.textContent=Math.abs(parseFloat(ytd)).toFixed(1)+'%'; ytdEl.className='cm-stat-val '+(parseFloat(ytd)>=0?'pos':'neg');
  } else { ytdEl.textContent='—'; ytdEl.className='cm-stat-val'; }
}

// ---- בניית רשימת קרנות ----
function cmBuildList(catId, color) {
  var listEl = document.getElementById('cm-fund-list');
  var funds = Object.entries(FUNDS).filter(function(e){ return e[1].cat === catId; });
  if (!funds.length) { listEl.innerHTML = '<p style="padding:20px;color:#888;text-align:center">לא נמצאו נתונים</p>'; return; }

  var html = '<table><thead><tr><th style="min-width:200px;">קרן</th>';
  for (var ci = cmWinStart; ci < Math.min(cmWinStart + CM_WINDOW, LABELS.length); ci++) {
    html += '<th>' + LABELS[ci] + '</th>';
  }
  html += '</tr></thead><tbody>';

  var catTotal = new Array(LABELS.length).fill(0);
  var NO_DELTA = ['mezuman'];

  funds.forEach(function(entry) {
    var key = entry[0], fund = entry[1];
    var ff = ffFundData(fund.data);
    var fundClr = (typeof FUND_COLORS !== 'undefined' && FUND_COLORS[key]) ? FUND_COLORS[key] : color;

    html += '<tr data-fund="' + key + '">';
    html += '<td style="font-size:12px;white-space:nowrap;">' + fund.name + '</td>';
    for (var i = cmWinStart; i < Math.min(cmWinStart + CM_WINDOW, LABELS.length); i++) {
      var v = ff[i];
      if (v > 0) catTotal[i] += v;
      html += '<td style="font-weight:600;color:' + fundClr + ';">' + (v > 0 ? Math.round(v).toLocaleString() : '—') + '</td>';
    }
    html += '</tr>';


  });

  html += '<tr class="total-row"><td>סה"כ קטגוריה</td>';
  for (var k = cmWinStart; k < Math.min(cmWinStart + CM_WINDOW, LABELS.length); k++) {
    html += '<td>' + (catTotal[k] > 0 ? Math.round(catTotal[k]).toLocaleString() : '—') + '</td>';
  }
  html += '</tr></tbody></table>';
  listEl.innerHTML = html;

  listEl.querySelectorAll('tr[data-fund]').forEach(function(row) {
    var k = row.getAttribute('data-fund');
    row.addEventListener('click', function(e) { e.stopPropagation(); cmClickFund(k); });
  });
}

// ---- לחיצה ציקלית על קרן ----
function cmClickFund(fundKey) {
  cmCurrentFundKey = fundKey;
  var fund = FUNDS[fundKey];
  var catColor = CAT_COLORS[fund.cat] || '#2563eb';
  var fundClr = (typeof FUND_COLORS !== 'undefined' && FUND_COLORS[fundKey]) ? FUND_COLORS[fundKey] : catColor;

  // כותרת
  var nameEl = document.getElementById('cm-name');
  nameEl.style.color = fundClr;
  nameEl.textContent = fund.name;

  // סטטיסטיקות
  cmSetFundStats(fundKey);
  document.getElementById('cm-back').classList.add('visible');
  cmUpdateFundNavBtns();

  // אפס חלון לחודש הנוכחי בכל פתיחת קרן חדשה
  cmWinStart = Math.max(0, LABELS.length - CM_WINDOW);

  // הצג view (canvas חייב להיות גלוי לפני Chart.js)
  cmShowFundView();

  // גרף – setTimeout מבטיח שה-canvas מרונדר לגמרי לפני Chart.js
  var ff = ffFundData(fund.data);
  var _fundClr = fundClr, _fundName = fund.name, _fundKey = fundKey;
  setTimeout(function() {
    cmDrawChart(ff, _fundClr, _fundName);
    cmUpdateWinLabel();
    cmUpdateNavBtns();
    cmBuildFundTable(_fundKey, _fundClr);
  }, 50);
}

// ---- ניווט בין קרנות ----
function cmNavFund(dir) {
  var idx = cmCatFundKeys.indexOf(cmCurrentFundKey);
  var newIdx = idx + dir;
  if (newIdx >= 0 && newIdx < cmCatFundKeys.length) {
    cmCurrentFundKey = null; // איפוס כדי שהקרן החדשה תתחיל מ-state=1
    cmFundClickState = 0;
    cmClickFund(cmCatFundKeys[newIdx]);
  }
}

function cmUpdateFundNavBtns() {
  var prev = document.getElementById('cm-prev-fund');
  var next = document.getElementById('cm-next-fund');
  if (!prev || !next) return;
  var idx = cmCatFundKeys.indexOf(cmCurrentFundKey);
  prev.disabled = (idx <= 0);
  next.disabled = (idx >= cmCatFundKeys.length - 1);
}

// ---- גרף ----
function cmDrawChart(data, color, label) {
  var canvas = document.getElementById('cm-mini-chart');
  if (cmChartInstance) { cmChartInstance.destroy(); cmChartInstance = null; }
  var filled = forwardFill(data.slice ? data.slice() : Array.from(data));
  var wLabels = LABELS.slice(cmWinStart, cmWinStart + CM_WINDOW);
  var wData = filled.slice(cmWinStart, cmWinStart + CM_WINDOW);
  var ctx = canvas.getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(0, color + '44');
  gradient.addColorStop(1, color + '00');
  cmChartInstance = new Chart(canvas, {
    type: 'line',
    data: { labels: wLabels, datasets: [{ data: wData, borderColor: color, backgroundColor: gradient, borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointBackgroundColor: color }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { rtl: true, bodyFont: { family: 'Heebo', size: 12 }, callbacks: { label: function(c) { var v = c.raw; if (!v) return ''; var prev = c.dataIndex > 0 ? wData[c.dataIndex-1] : null; var pct = (prev && prev > 0) ? ' (' + ((v-prev)/prev*100).toFixed(1) + '%)' : ''; return Math.round(v).toLocaleString() + pct; } } } },
      layout: { padding: { left: 0, right: 4, bottom: 0 } },
      scales: {
        x: { display: false, grid: { display: false }, offset: false },
        y: {
          ticks: { font: { family: 'Heebo', size: 10 } }, grid: { color: '#f0f0f0' },
          afterFit: function(scaleInstance) { window.cmYAxisWidth = scaleInstance.width; cmSyncTablePadding(); }
        }
      }
    }
  });
  cmChartData = { data: data, color: color, label: label };
}

function cmSyncTablePadding() {
  var w = window.cmYAxisWidth || 52;
  var wrap = document.getElementById('cm-fund-table');
  if (!wrap) return;
  var inner = wrap.querySelector('div');
  if (inner) {
    inner.style.paddingLeft = w + 'px';
    inner.style.paddingRight = '4px';
  }
}

function cmSlide(dir) {
  cmWinStart = Math.max(0, Math.min(cmWinStart + dir, LABELS.length - CM_WINDOW));
  if (cmChartData) cmDrawChart(cmChartData.data, cmChartData.color, cmChartData.label);
  cmUpdateWinLabel();
  cmUpdateNavBtns();
  if (cmCurrentFundKey) {
    cmSetFundStats(cmCurrentFundKey);
    var fundClr = (typeof FUND_COLORS !== 'undefined' && FUND_COLORS[cmCurrentFundKey]) ? FUND_COLORS[cmCurrentFundKey] : '#2563eb';
    cmBuildFundTable(cmCurrentFundKey, fundClr);
  } else { cmSetCatStats(cmCurrentCat); }
}

function cmUpdateWinLabel() {
  var from = LABELS[cmWinStart] || '';
  var to = LABELS[Math.min(cmWinStart + CM_WINDOW - 1, LABELS.length - 1)] || '';
  document.getElementById('cm-win-label').textContent = to + ' — ' + from;
}

function cmUpdateNavBtns() {
  document.getElementById('cm-btn-next').disabled = cmWinStart + CM_WINDOW >= LABELS.length;
  document.getElementById('cm-btn-prev').disabled = cmWinStart <= 0;
}

// ---- טבלת קרן מיושרת עם גרף ----
function cmBuildFundTable(fundKey, color) {
  var fund = FUNDS[fundKey];
  var ff = ffFundData(fund.data);
  var wrap = document.getElementById('cm-fund-table');
  var endIdx = Math.min(cmWinStart + CM_WINDOW - 1, LABELS.length - 1);
  var count = endIdx - cmWinStart + 1;

  // חישוב רוחב Y-axis של Chart.js (בד"כ ~50-55px משמאל)
  var yAxisW = window.cmYAxisWidth || 58;

  // בנה 3 שורות עם עמודות שוות
  var cellStyle = 'width:' + (100/count).toFixed(2) + '%;text-align:center;padding:5px 2px;box-sizing:border-box;';

  var rowLbl = '', rowVal = '', rowPct = '';
  for (var m = cmWinStart; m <= endIdx; m++) {
    var val = ff[m];
    var prev = m > 0 ? ff[m-1] : null;
    var chgPct = (val > 0 && prev && prev > 0) ? ((val - prev) / prev * 100) : null;
    var isFF = (fund.data[m] == null && val != null);
    var pClr = chgPct != null ? (chgPct >= 0 ? '#16a34a' : '#dc2626') : '#94a3b8';
    var pStr = chgPct != null ? Math.abs(chgPct).toFixed(1) + '%' : '—';

    rowLbl += '<td style="' + cellStyle + 'font-size:10px;color:#64748b;white-space:nowrap;overflow:hidden;">' + (LABELS[m]||'') + '</td>';
    rowVal += '<td style="' + cellStyle + 'font-size:12px;font-weight:700;color:' + color + ';">' + (val > 0 ? Math.round(val).toLocaleString() : '—') + (isFF ? '<span style="font-size:8px;color:#aaa"> ff</span>' : '') + '</td>';
    rowPct += '<td style="' + cellStyle + 'font-size:11px;font-weight:700;color:' + pClr + ';">' + pStr + '</td>';
  }

  // תא ריק בצד ימין – מקביל ל-Y axis של הגרף
  var yCell = '<td style="width:' + yAxisW + 'px;min-width:' + yAxisW + 'px;flex-shrink:0;"></td>';

  wrap.innerHTML =
    '<div style="direction:ltr;font-family:Heebo,sans-serif;border-top:1px solid #e8eaf0;padding-left:' + (window.cmYAxisWidth || yAxisW) + 'px;padding-right:4px;">' +
    '<table style="width:100%;border-collapse:collapse;table-layout:fixed;">' +
    '<tbody>' +
    '<tr style="background:#f0f4ff;">' + rowLbl + '</tr>' +
    '<tr>' + rowVal + '</tr>' +
    '<tr style="background:#fafbff;">' + rowPct + '</tr>' +
    '</tbody></table></div>';
  wrap.style.flex = '0 0 auto';
  wrap.style.overflowY = 'visible';
}

// ---- מעברים ----
function cmShowList() {
  document.getElementById('cm-fund-list').style.display = 'block';
  var fv = document.getElementById('cm-fund-view');
  fv.style.display = 'none'; fv.classList.remove('visible');
  document.getElementById('cm-back').classList.remove('visible');
  document.getElementById('cm-fund-nav').classList.remove('visible');
  // שחזר כותרת קטגוריה
  if (cmCurrentCat) {
    var sec = document.getElementById('sec-' + cmCurrentCat);
    var color = sec ? getComputedStyle(sec).getPropertyValue('--cat-color').trim() : '#2563eb';
    var hdr = document.getElementById('hdr-' + cmCurrentCat);
    var nameText = hdr ? (hdr.querySelector('.cat-name') ? hdr.querySelector('.cat-name').textContent : cmCurrentCat) : cmCurrentCat;
    var nameEl = document.getElementById('cm-name');
    nameEl.style.color = color;
    nameEl.textContent = nameText;
  }
}

function cmShowFundView() {
  document.getElementById('cm-fund-list').style.display = 'none';
  var fv = document.getElementById('cm-fund-view');
  fv.style.display = 'flex'; fv.classList.add('visible');
}

function cmBackToList() {
  cmCurrentFundKey = null;
  cmFundClickState = 0;
  if (cmChartInstance) { cmChartInstance.destroy(); cmChartInstance = null; }
  cmBuildList(cmCurrentCat, CAT_COLORS[cmCurrentCat] || '#2563eb');
  cmShowList();
  cmSetCatStats(cmCurrentCat);
  var btnT = document.getElementById('cm-back-table');
  if (btnT) btnT.classList.toggle('visible', cmOpenedFromTable);
}

function cmBackToTable() {
  closeCatModal();
  document.getElementById('table-modal').style.display = 'flex';
}
function closeCatModal() {
  document.getElementById('cat-modal').classList.remove('open');
  document.body.style.overflow = '';
  if (cmChartInstance) { cmChartInstance.destroy(); cmChartInstance = null; }
  cmCurrentFundKey = null;
  cmFundClickState = 0;
  cmChartData = null;
  cmOpenedFromTable = false;
  var btnT = document.getElementById('cm-back-table');
  if (btnT) btnT.classList.remove('visible');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCatModal();
});




var TV_META = {
  'מזומןשקלי':            {mgr:'',       agent:'',     liquid:'נזיל',    status:''},
  'מזומןדולרי':           {mgr:'',       agent:'',     liquid:'נזיל',    status:''},
  'מיטבשקלית':            {mgr:'מיטב',   agent:'',     liquid:'נזיל',    status:'כספית'},
  'אשקהש39905556':        {mgr:'אלטשולר',agent:'הילה', liquid:'גיל 67+', status:'לא פעילה'},
  'אשקהש6730513':         {mgr:'מיטב',   agent:'תמוז', liquid:'גיל 67+', status:'לא פעילה'},
  'אשקהש40035706':        {mgr:'אלטשולר',agent:'',     liquid:'גיל 67+', status:'לא פעילה'},
  'מורקהש499293':         {mgr:'מיטב',   agent:'תמוז', liquid:'גיל 67+', status:'לא פעילה'},
  'מיטבקהש912-443286':    {mgr:'מיטב',   agent:'',     liquid:'גיל 67+', status:'פעילה, מנייתי'},
  '6730511אשגמל':         {mgr:'מור',    agent:'תמוז', liquid:'גיל 67+', status:'פעילה, מנייתי'},
  'אשגמל39774495':        {mgr:'מור',    agent:'',     liquid:'גיל 67+', status:'לא פעילה'},
  '6730512אשגמל':         {mgr:'מור',    agent:'',     liquid:'גיל 67+', status:'פעילה'},
  '6899425אשגמל':         {mgr:'מור',    agent:'',     liquid:'גיל 67+', status:'לא פעילה'},
  'הפניקסגמל926-084678':  {mgr:'הפניקס', agent:'תמוז', liquid:'גיל 67+', status:'לא פעילה, מנייתי'},
  'מורגמל1375900':        {mgr:'מור',    agent:'',     liquid:'גיל 67+', status:'פעילה, מנייתי'},
  'אשגמללהשקעה2016-1738': {mgr:'מיטב',   agent:'תמוז', liquid:'השקעה',   status:'לא פעילה'},
  'מורגמללהשקעה':         {mgr:'מיטב',   agent:'',     liquid:'השקעה',   status:'לא פעילה, מנייתי'},
  'הראלמגוון-פוליסתחיסכ':{mgr:'הראל',   agent:'הילה', liquid:'השקעה',   status:'כללי'},
  'הראלמניות106863031':   {mgr:'הראל',   agent:'',     liquid:'',        status:'נמכרה, מנייתי'},
  'הראלכללי109062745':    {mgr:'הראל',   agent:'',     liquid:'השקעה',   status:'כללי'},
  'מיטבדשניהולקרנות1693': {mgr:'מיטב',   agent:'',     liquid:'השקעה',   status:'מנייתי'},
  'מיטבדשטרייד':          {mgr:'מיטב',   agent:'',     liquid:'השקעה',   status:'כספי'},
  'דירה':                 {mgr:'',       agent:'',     liquid:'לא נזיל', status:'נכס קבוע'},
};

var TV_SECTIONS = [
  {label:'מזומן',         color:'#b2ebf8', bg:'#f0fbff', catId:'mezuman',      keys:['מזומןשקלי','מזומןדולרי','מיטבשקלית']},
  {label:'קרנות השתלמות', color:'#fca5a5', bg:'#fff5f5', catId:'hishtalmut',   keys:['אשקהש39905556','אשקהש40035706','אשקהש6730513','מורקהש499293','מיטבקהש912-443286']},
  {label:'קופות גמל',     color:'#fcd34d', bg:'#fffdf5', catId:'gemel',        keys:['6730511אשגמל','מורגמל1375900','אשגמל39774495','6730512אשגמל','6899425אשגמל','הפניקסגמל926-084678']},
  {label:'גמל להשקעה',   color:'#6ee7b7', bg:'#f0fdf4', catId:'gemel_invest',  keys:['אשגמללהשקעה2016-1738','מורגמללהשקעה']},
  {label:'הראל',          color:'#fde68a', bg:'#fefce8', catId:'harel',        keys:['הראלמגוון-פוליסתחיסכ','הראלמניות106863031','הראלכללי109062745']},
  {label:'מיטב',          color:'#c4b5fd', bg:'#f8f7ff', catId:'meitav',       keys:['מיטבדשניהולקרנות1693','מיטבדשטרייד']},
  {label:'דירה',          color:'#d6d3d1', bg:'#fafaf9', catId:null,           keys:['דירה'], noSubtotal:true},
];

function openTableView() {
  document.getElementById('table-modal').style.display = 'flex';
  buildTableView();
}
function closeTableView() {
  document.getElementById('table-modal').style.display = 'none';
}

function buildTableView() {
  var wrap = document.getElementById('tv-wrap');
  var lastLabel = LABELS[LABELS.length - 1] || '';
  document.getElementById('tv-month-label').textContent = lastLabel ? '(' + lastLabel + ')' : '';

  // 6 columns (no notes)
  var cols = [
    {label:'השקעה',     w:'200px'},
    {label:'סכום',      w:'58px'},
    {label:'נזילות',    w:'58px'},
    {label:'סטטוס',     w:'100px'},
    {label:'גוף מנהל', w:'68px'},
    {label:'סוכן',      w:'48px'},
  ];

  var h = '<table style="width:auto;min-width:580px;border-collapse:collapse;font-size:13px;font-family:Heebo,sans-serif;direction:ltr;">';
  h += '<thead><tr style="background:#1a1a2e;color:white;position:sticky;top:0;z-index:5;">';
  cols.forEach(function(c) {
    h += '<th style="padding:9px 10px;text-align:right;font-weight:600;white-space:nowrap;min-width:'+c.w+';border-right:1px solid rgba(255,255,255,0.07);">'+c.label+'</th>';
  });
  h += '</tr></thead><tbody>';

  var grandTotal = 0;

  TV_SECTIONS.forEach(function(sec) {
    var secTotal = 0;
    var secRows = [];

    sec.keys.forEach(function(fk, ri) {
      var f = FUNDS[fk];
      if (!f) return;
      var meta = TV_META[fk] || {};
      var val = 0;
      for (var i = f.data.length - 1; i >= 0; i--) {
        if (f.data[i] !== null && f.data[i] !== undefined) { val = f.data[i]; break; }
      }
      secTotal += val;
      secRows.push({fk:fk, f:f, meta:meta, val:val, ri:ri});
    });

    // Category header row (above all fund rows) – clickable if catId exists
    var rowStyle = sec.catId
      ? 'background:'+sec.color+';cursor:pointer;'
      : 'background:'+sec.color+';';
    var rowClick = sec.catId
      ? ' onclick="closeTableView();openCatModal(\'' + sec.catId + '\', true);"'
      : '';
    var rowLabel = sec.catId
      ? '<span style="opacity:0.4;font-size:10px;margin-left:4px;">&#x2197;</span> '+sec.label
      : sec.label;
    h += '<tr style="'+rowStyle+'"'+rowClick+'>';
    h += '<td colspan="6" style="padding:7px 12px;font-weight:700;font-size:12px;color:#1f2937;letter-spacing:0.03em;border-bottom:1px solid rgba(0,0,0,0.1);text-align:left;">'+rowLabel+'</td>';
    h += '</tr>';

    // Fund rows
    secRows.forEach(function(r, idx) {
      var zebra = idx % 2 === 0 ? sec.bg : '#ffffff';
      var valColor = r.val === 0 ? '#9ca3af' : '#111827';
      var isSold = r.meta.status && /נמכרה/.test(r.meta.status);
      var rowOpacity = isSold ? 'opacity:0.65;' : '';

      // Status badges - compact
      var sb = '';
      if (r.meta.status) {
        var st = r.meta.status;
        if (/נמכרה/.test(st)) {
          sb = '<span style="background:#fee2e2;color:#dc2626;border-radius:4px;padding:1px 5px;font-size:11px;">נמכרה</span>';
        } else if (/פעילה/.test(st) && !/לא/.test(st)) {
          sb = '<span style="background:#dcfce7;color:#16a34a;border-radius:4px;padding:1px 5px;font-size:11px;font-weight:600;">פעילה</span>';
        } else if (/לא פעילה/.test(st)) {
          sb = '<span style="color:#9ca3af;font-size:11px;">לא פעילה</span>';
        } else {
          sb = '<span style="color:#6b7280;font-size:11px;">'+st.split(',')[0].trim()+'</span>';
        }
        if (/מנייתי/.test(st)) sb += '&nbsp;<span style="background:#dbeafe;color:#1d4ed8;border-radius:4px;padding:0 4px;font-size:10px;">מנייתי</span>';
        if (/כספי/.test(st)) sb += '&nbsp;<span style="background:#ede9fe;color:#6d28d9;border-radius:4px;padding:0 4px;font-size:10px;">כספי</span>';
      }

      h += '<tr style="background:'+zebra+';border-bottom:1px solid #e5e7eb;'+rowOpacity+'">';
      h += '<td style="padding:7px 12px;color:#374151;font-size:13px;text-align:left;border-left:3px solid '+sec.color+';">'+r.f.name+'</td>';
      h += '<td style="padding:7px 10px;text-align:right;font-weight:500;color:'+valColor+';font-variant-numeric:tabular-nums;">'+r.val.toLocaleString('he-IL')+'</td>';
      h += '<td style="padding:7px 8px;text-align:right;font-size:11px;color:#6b7280;">'+(r.meta.liquid||'')+'</td>';
      h += '<td style="padding:7px 8px;text-align:right;">'+sb+'</td>';
      h += '<td style="padding:7px 8px;text-align:right;font-size:12px;color:#374151;">'+(r.meta.mgr||'')+'</td>';
      h += '<td style="padding:7px 8px;text-align:right;font-size:12px;color:#6b7280;">'+(r.meta.agent||'')+'</td>';
      h += '</tr>';
    });

    grandTotal += secTotal;
  });

  // Debt row: display 0 per spec, but deduct real chov from grand total
  var chov = 0;
  ['חובהראל','חובאלטשולר'].forEach(function(fk) {
    var f = FUNDS[fk];
    if (!f) return;
    for (var i = f.data.length-1; i >= 0; i--) {
      if (f.data[i] !== null && f.data[i] !== undefined) { chov += f.data[i]; break; }
    }
  });
  var net = grandTotal - chov;
  var tvTotalEl = document.getElementById('tv-total-label');
  if (tvTotalEl) tvTotalEl.textContent = net.toLocaleString('he-IL');

  h += '<tr style="background:#fef2f2;border-bottom:1px solid #fecaca;">';
  h += '<td style="padding:8px 12px;font-weight:600;color:#dc2626;text-align:left;border-left:3px solid #fca5a5;">חוב</td>';
  h += '<td style="padding:8px 10px;text-align:right;font-weight:600;color:#9ca3af;font-variant-numeric:tabular-nums;">0</td>';
  h += '<td colspan="4"></td></tr>';



  h += '</tbody></table>';
  wrap.innerHTML = h;
}



var CF_DATA = [];
var CF_CURRENT_MONTH_ID = null; // monthId ברירת מחדל — החודש המלא האחרון (לפני החודש הנוכחי)
var CF_SELECTED_MONTH_ID = null; // v18.3: חודש שנבחר ידנית ע"י המשתמש

function saveCFToLocalStorage() {
  try {
    localStorage.setItem('dashboard_cf_data', JSON.stringify(CF_DATA));
  } catch(e) { console.warn('שמירת תזרים נכשלה:', e); }
}

function loadCFFromLocalStorage() {
  try {
    // v17.0: נקה localStorage מכל גרסה קודמת — מחייב העלאת קובץ חדש
    var savedVer = localStorage.getItem('dashboard_cf_version');
    if (savedVer !== '35.0') {
      localStorage.removeItem('dashboard_cf_data');
      localStorage.setItem('dashboard_cf_version', '35.0');
      return false;
    }
    var raw = localStorage.getItem('dashboard_cf_data');
    if (!raw) return false;
    var data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) return false;
    // נתונים ישנים (לפני v16.88) חסרים שדה monthId — דחה ונקה
    if (!data[0] || !data[0].monthId) {
      localStorage.removeItem('dashboard_cf_data');
      return false;
    }
    CF_DATA = data;
    CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(CF_DATA);
    return true;
  } catch(e) { return false; }
}

// טען נתוני תזרים שמורים מיד עם אתחול הדף
loadCFFromLocalStorage();

var cfPrivacyOn = false;
var cfChartInstance = null;
var cfCurrentView = 'monthly';
var cfDateRange = 'rolling12'; // 'rolling12' | 'ytd'
var CF_SELECTED_YEAR = null;   // v22.0: שנת תצוגה נבחרת (null = auto = שנה מקסימלית)
var CF_CHART_MONTHS = [];      // v22.0: מטמון חודשי הגרף לשימוש ב-onClick

// מחזיר את החודשים לתצוגה לפי cfDateRange
var CF_EMPTY_ROWS = ['salary','rent_income','other_income','buffer','total_income','visa','cash_exp','loans','yotam','other_exp','total_exp','renovation','net_cashflow','salary_usd','exp_usd','yotam_usd','total_usd','delta','profit_loss'];
var CF_HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
var CF_HEB_MONTHS_ABBR = ['ינו׳','פבר׳','מרץ','אפר׳','מאי','יוני','יולי','אוג׳','ספט׳','אוק׳','נוב׳','דצמ׳'];

function cfGetDisplayMonths() {
  // v22.0: תמיד מציג שנה שלמה (12 חודשים). שנה = CF_SELECTED_YEAR || auto-max
  var displayYear = CF_SELECTED_YEAR;
  if (!displayYear) {
    displayYear = 2025;
    for (var di = 0; di < CF_DATA.length; di++) {
      if (CF_DATA[di].year > displayYear) displayYear = CF_DATA[di].year;
    }
  }
  var result = [];
  for (var mo = 1; mo <= 12; mo++) {
    var mId = displayYear + '-' + (mo < 10 ? '0' + mo : '' + mo);
    var found = null;
    for (var i = 0; i < CF_DATA.length; i++) {
      if (CF_DATA[i].monthId === mId) { found = CF_DATA[i]; break; }
    }
    if (found) {
      result.push(found);
    } else {
      var emptyRows = {};
      CF_EMPTY_ROWS.forEach(function(k){ emptyRows[k] = {val: null, note: null}; });
      result.push({ label: CF_HEB_MONTHS[mo-1] + ' ' + displayYear, monthId: mId, year: displayYear, month: mo, rows: emptyRows });
    }
  }
  return result;
}

function cfSetDateRange(range) {
  cfDateRange = range;
  var btn12  = document.getElementById('cf-range-rolling12');
  var btnYtd = document.getElementById('cf-range-ytd');
  if (btn12)  { btn12.style.background  = range==='rolling12'?'#3b82f6':'rgba(255,255,255,0.06)'; btn12.style.color  = range==='rolling12'?'white':'rgba(255,255,255,0.5)'; btn12.style.borderColor  = range==='rolling12'?'#3b82f6':'rgba(255,255,255,0.12)'; }
  if (btnYtd) { btnYtd.style.background = range==='ytd'?'#3b82f6':'rgba(255,255,255,0.06)'; btnYtd.style.color = range==='ytd'?'white':'rgba(255,255,255,0.5)'; btnYtd.style.borderColor = range==='ytd'?'#3b82f6':'rgba(255,255,255,0.12)'; }
  cfRenderChart();
  cfRenderTable();
  // תמיד חזור לתחילת הגרף כך שציר Y גלוי
  setTimeout(function(){
    var sc = document.getElementById('cf-scroll-container');
    if (sc) sc.scrollLeft = 0;
  }, 100);
}

// v24.0: חזרה לחודש הנוכחי (reset לברירת מחדל)
function cfGoToday() {
  CF_SELECTED_YEAR = null;
  CF_SELECTED_MONTH_ID = null;
  CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(CF_DATA);
  var autoIdx = cfGetLastRealMonth();
  var autoYear = CF_DATA[autoIdx] ? CF_DATA[autoIdx].year : 2026;
  var yearSel = document.getElementById('cf-year-select');
  if(yearSel) yearSel.value = String(autoYear);
  cfUpdateHeader();
  cfRenderKPI();
  cfRenderSummary();
  cfRenderChart();
  cfRenderTable();
  setTimeout(function(){
    var sc = document.getElementById('cf-scroll-container');
    if (sc) sc.scrollLeft = 0;
  }, 100);
}

// v22.0: בחירת שנת תצוגה
function cfSelectYear(year) {
  CF_SELECTED_YEAR = year;
  CF_SELECTED_MONTH_ID = null; // איפוס בחירת חודש ידנית בעת החלפת שנה
  CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(CF_DATA);
  cfRenderMonthSelector();
  cfUpdateHeader();
  cfRenderKPI();
  cfRenderSummary();
  cfRenderChart();
  cfRenderTable();
  setTimeout(function(){
    var sc = document.getElementById('cf-scroll-container');
    if (sc) sc.scrollLeft = 0;
  }, 100);
}

// גלילה אוטומטית לחודש הכי חדש עם נתונים
function cfScrollToLatest() {
  setTimeout(function() {
    var sc = document.getElementById('cf-scroll-container');
    if (!sc) return;
    if (cfDateRange === 'ytd') {
      // גלול עד החודש האחרון עם נתונים אמיתיים (לא דצמבר ריק)
      var lastReal = cfGetLastRealMonth();
      var lastRealMonth = CF_DATA[lastReal] ? CF_DATA[lastReal].month : 3;
      var COL_W = 80, YAXIS_W = 50;
      sc.scrollLeft = YAXIS_W + (lastRealMonth - 1) * COL_W;
    } else {
      sc.scrollLeft = sc.scrollWidth;
    }
  }, 100);
}

function cfTogglePrivacy() {
  cfPrivacyOn = !cfPrivacyOn;
  document.getElementById('cf-privacy-icon').textContent = cfPrivacyOn ? '👁️' : '🔒';
  document.getElementById('cf-privacy-text').textContent = cfPrivacyOn ? 'הסתר הערות' : 'הצג הערות';
  var panel = document.getElementById('cf-notes-panel');
  if (!panel) return;
  if (cfPrivacyOn) {
    cfRenderNotesPanel();
    // פתיחה חלקה — max-height transition
    panel.style.padding = '16px 18px';
    panel.style.marginBottom = '12px';
    panel.style.maxHeight = '200px';
    panel.style.overflowY = 'auto';
  } else {
    // סגירה חלקה
    panel.style.maxHeight = '0';
    panel.style.padding = '0 18px';
    panel.style.marginBottom = '0';
    setTimeout(function(){ panel.style.overflowY = 'hidden'; }, 350);
  }
}

function cfRenderNotesPanel() {
  var panel = document.getElementById('cf-notes-panel');
  if (!panel) return;
  var lastIdx = cfGetLastRealMonth();
  var ROW_LABELS = {
    salary:'משכורת', rent_income:'שכר דירה', other_income:'הכנסות שונות',
    buffer:'פריטה מ-Buffer', total_income:'סה״כ הכנסות', visa:'חיוב ויזה',
    cash_exp:'הוצאות מזומן', loans:'החזר הלוואות', yotam:'הוצאות יותם',
    other_exp:'הוצאות שונות', total_exp:'סה״כ הוצאות', renovation:'שיפוץ',
    net_cashflow:'תזרים שקלי נטו', salary_usd:'משכורת $', exp_usd:'הוצאות $',
    yotam_usd:'הוצאות יותם $', total_usd:'סך הכל $',
    delta:'Δ תזרים שוטף', profit_loss:'רווח / הפסד'
  };
  var FULL_HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var html = '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.5px;margin-bottom:14px;">הערות לפי חודש (מהחדש לישן)</div>';
  var hasAny = false;
  for (var i = lastIdx; i >= 0; i--) {
    var m = CF_DATA[i];
    var noteItems = [];
    Object.keys(m.rows).forEach(function(k) {
      if (m.rows[k] && m.rows[k].note && m.rows[k].note !== 'חושב') {
        noteItems.push({label: ROW_LABELS[k]||k, note: m.rows[k].note, val: m.rows[k].val});
      }
    });
    // הוסף תזרים שקלי נטו כשורה קבועה (גם ללא הערה)
    var netRow = m.rows.net_cashflow;
    var netVal = netRow ? netRow.val : null;
    var fullMonthLabel = FULL_HEB_MONTHS[m.month - 1] + ' ' + m.year;
    if (noteItems.length === 0 && netVal === null) continue;
    hasAny = true;
    html += '<div style="margin-bottom:12px;">';
    html += '<div style="font-size:15px;font-weight:700;color:rgba(255,255,255,0.9);margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,0.12);">📅 ' + fullMonthLabel + '</div>';
    // שורת נטו קבועה בראש
    if (netVal !== null) {
      var netColor = netVal >= 0 ? 'rgba(74,222,128,0.9)' : 'rgba(248,113,113,0.9)';
      html += '<div style="font-size:14px;color:rgba(255,255,255,0.78);padding:4px 10px 4px 0;border-right:2px solid ' + netColor + ';margin-right:2px;margin-bottom:4px;">';
      html += '<span style="color:rgba(255,255,255,0.4);font-size:12px;">תזרים שקלי נטו</span><br>';
      html += '<span style="color:' + netColor + ';font-weight:700;">' + netVal.toLocaleString() + '</span>';
      html += '</div>';
    }
    noteItems.forEach(function(item) {
      var amtStr = (item.val !== null && item.val !== undefined) ? ' — <span style="color:rgba(99,179,237,0.9);font-weight:700;">'+item.val.toLocaleString()+'</span>' : '';
      // הימנע מהצגת תיאור זהה לתווית (למשל: 'רווח / הפסד' לא יופיע פעמיים)
      var displayNote = (item.note.trim().toLowerCase() === item.label.trim().toLowerCase()) ? '' : item.note;
      html += '<div style="font-size:14px;color:rgba(255,255,255,0.78);padding:4px 10px 4px 0;border-right:2px solid rgba(99,179,237,0.45);margin-right:2px;margin-bottom:2px;">';
      html += '<span style="color:rgba(255,255,255,0.4);font-size:12px;">'+item.label+'</span>';
      if (displayNote) html += '<br>' + displayNote;
      html += amtStr;
      html += '</div>';
    });
    html += '</div>';
  }
  if (!hasAny) html += '<div style="color:rgba(255,255,255,0.35);font-size:12px;text-align:center;padding:16px;">אין הערות בנתונים</div>';
  panel.innerHTML = html;
}

function cfSetView(view) {
  cfCurrentView = view;
  var btnM = document.getElementById('cf-view-monthly');
  var btnY = document.getElementById('cf-view-ytd');
  if(btnM){ btnM.style.background=view==='monthly'?'#3b82f6':'rgba(255,255,255,0.06)'; btnM.style.color=view==='monthly'?'white':'rgba(255,255,255,0.5)'; btnM.style.borderColor=view==='monthly'?'#3b82f6':'rgba(255,255,255,0.12)'; }
  if(btnY){ btnY.style.background=view==='ytd'?'#3b82f6':'rgba(255,255,255,0.06)'; btnY.style.color=view==='ytd'?'white':'rgba(255,255,255,0.5)'; btnY.style.borderColor=view==='ytd'?'#3b82f6':'rgba(255,255,255,0.12)'; }
  cfRenderChart();
}

// v32.0: חישוב הכנסות מסכום מרכיבים — מונע קריאת שורה שגויה מהאקסל
function cfCalcIncome(r) {
  return (r.salary&&r.salary.val!=null?r.salary.val:0)
       + (r.rent_income&&r.rent_income.val!=null?r.rent_income.val:0)
       + (r.other_income&&r.other_income.val!=null?r.other_income.val:0)
       + (r.buffer&&r.buffer.val!=null?r.buffer.val:0);
}

// v33.0: חישוב הוצאות מסכום מרכיבים — כולל הלוואות במפורש
function cfCalcExp(r) {
  return (r.visa&&r.visa.val!=null?r.visa.val:0)
       + (r.cash_exp&&r.cash_exp.val!=null?r.cash_exp.val:0)
       + (r.loans&&r.loans.val!=null?r.loans.val:0)
       + (r.yotam&&r.yotam.val!=null?r.yotam.val:0)
       + (r.other_exp&&r.other_exp.val!=null?r.other_exp.val:0)
       + (r.renovation&&r.renovation.val!=null?r.renovation.val:0);
}

// חישוב נטו — income ו-exp שניהם מחושבים מרכיבים
function cfGetNetVal(m) {
  var inc = cfCalcIncome(m.rows);
  var exp = cfCalcExp(m.rows);
  if (inc > 0 || exp > 0) return Math.round((inc - exp) * 10) / 10;
  return null;
}

// v19.3: MAX YEAR RULE — השתמש בשנה הגבוהה ביותר בנתונים, לא בשנת שעון המחשב
function cfGetDefaultMonthId(data) {
  if (!data || data.length === 0) return null;
  var now = new Date();
  var currentMonth = now.getMonth() + 1; // חודש לפי שעון המחשב בלבד (מרץ = 3)

  // v19.3: מוצא את השנה הגבוהה ביותר בנתונים (2026) — לא תלוי בשנת המחשב (2025)
  var maxYear = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].year > maxYear) maxYear = data[i].year;
  }
  var targetYM = maxYear * 100 + currentMonth; // 2026*100+3 = 202603

  // שלב 1: חפש התאמה מדויקת — חודש זה בשנת maxYear עם נתוני total_income
  for (var i = 0; i < data.length; i++) {
    if (data[i].year * 100 + data[i].month === targetYM &&
        data[i].rows && data[i].rows.total_income && data[i].rows.total_income.val !== null) {
      console.log('!!! FOUND', data[i].label, 'AT monthId:', data[i].monthId, '— val:', data[i].rows.total_income.val, '!!!');
      return data[i].monthId;
    }
  }
  // שלב 2: החודש האחרון ב-maxYear עם total_income
  for (var j = data.length - 1; j >= 0; j--) {
    if (data[j].year === maxYear &&
        data[j].rows && data[j].rows.total_income && data[j].rows.total_income.val !== null) {
      return data[j].monthId;
    }
  }
  // שלב 3: אחרון ב-maxYear, גם בלי total_income
  for (var k = data.length - 1; k >= 0; k--) {
    if (data[k].year === maxYear) return data[k].monthId;
  }
  // שלב 4: כל הנתונים — קח הראשון עם total_income
  for (var l = 0; l < data.length; l++) {
    if (data[l].rows && data[l].rows.total_income && data[l].rows.total_income.val !== null) return data[l].monthId;
  }
  return data[0].monthId;
}

// v18.3: מקור אחד ויחיד של האמת — תמיד עקבי
// v19.0: מקור אחד ויחיד — CF_SELECTED_MONTH_ID → CF_CURRENT_MONTH_ID → אחרון עם נתונים
function cfGetLastRealMonth() {
  var targetId = CF_SELECTED_MONTH_ID || CF_CURRENT_MONTH_ID;
  if (targetId) {
    for (var k = 0; k < CF_DATA.length; k++) {
      if (CF_DATA[k].monthId === targetId) return k;
    }
  }
  // fallback: האחרון עם total_income (לא שני-מהסוף)
  for (var i = CF_DATA.length - 1; i >= 0; i--) {
    if (CF_DATA[i].rows && CF_DATA[i].rows.total_income && CF_DATA[i].rows.total_income.val !== null) return i;
  }
  return CF_DATA.length > 0 ? CF_DATA.length - 1 : 0;
}

// v23.0: בורר חודשים הוסר — בחירה דרך לחיצה על הגרף בלבד
function cfRenderMonthSelector() {
  // no-op — month selection via chart click only
}

// v18.3: בחירת חודש ידנית — מעדכן את כל אלמנטי הממשק
function cfSelectMonth(monthId) {
  CF_SELECTED_MONTH_ID = monthId;
  cfUpdateHeader();   // כותרת + KPIs ב-header
  cfRenderKPI();      // כרטיסיות פירוט מתחת לטבלה
  cfRenderSummary();  // v24.0: YTD card מתעדכן לחודש הנבחר
  cfUpdateCFCards();
}

function cfUpdateHeader() {
  var lastIdx = cfGetLastRealMonth();
  var m = CF_DATA[lastIdx];
  // v30.0: הכנסות = משכורת + שכר דירה (ללא "הכנסות שונות" ו"פריטה")
  var inc = (m.rows.salary&&m.rows.salary.val!=null?m.rows.salary.val:0) +
            (m.rows.rent_income&&m.rows.rent_income.val!=null?m.rows.rent_income.val:0);
  var exp = (m.rows.total_exp    && m.rows.total_exp.val    != null) ? m.rows.total_exp.val    : 0;
  var net = (m.rows.profit_loss  && m.rows.profit_loss.val  != null) ? m.rows.profit_loss.val  : (inc - exp);

  var elNet = document.getElementById('cf-hdr-net');
  var elNetSub = document.getElementById('cf-hdr-net-sub');
  var elNetLabel = document.getElementById('cf-hdr-net-label');
  var elInc = document.getElementById('cf-hdr-income');
  var elExp = document.getElementById('cf-hdr-exp');

  if(elNet){ elNet.textContent = Math.round(net).toLocaleString(); elNet.className = 'stat-value ' + (net >= 0 ? 'green' : 'red'); }
  if(elNetSub) elNetSub.textContent = m.label;
  if(elNetLabel) elNetLabel.textContent = 'נטו — ' + m.label;
  if(elInc){ elInc.textContent = Math.round(inc).toLocaleString(); elInc.className = 'stat-value green'; }
  if(elExp){ elExp.textContent = Math.round(exp).toLocaleString(); elExp.className = 'stat-value red'; }

  // v27.0: כותרת חכמה — לבן=נוכחי | צהוב=עבר | אדום=עתיד
  var subtitle = document.getElementById('hdr-subtitle');
  if(subtitle) {
    var subColor = 'white';
    if(CF_SELECTED_MONTH_ID && CF_SELECTED_MONTH_ID !== CF_CURRENT_MONTH_ID) {
      var selEntry = null, curEntry = null;
      for(var _i=0; _i<CF_DATA.length; _i++) {
        if(CF_DATA[_i].monthId === CF_SELECTED_MONTH_ID) selEntry = CF_DATA[_i];
        if(CF_DATA[_i].monthId === CF_CURRENT_MONTH_ID)  curEntry = CF_DATA[_i];
      }
      if(selEntry && curEntry) {
        subColor = (selEntry.year*100+selEntry.month < curEntry.year*100+curEntry.month) ? '#fbbf24' : '#fca5a5';
      } else {
        subColor = '#fbbf24';
      }
    }
    subtitle.style.color = subColor;
    subtitle.textContent = 'מציג: ' + m.label;
  }

  // עדכן Dropdown שנה לשנה הנוכחית
  var yearSel = document.getElementById('cf-year-select');
  if(yearSel) yearSel.value = String(CF_SELECTED_YEAR || (m.year || 2026));
}

function cfUpdateCFCards() {
  var lastIdx = cfGetLastRealMonth();
  var m = CF_DATA[lastIdx];
  var r = m.rows;
  // v18.3: פירוט הכנסות — כל הסעיפים המרכיבים, ללא "סה"כ הכנסות" (מוצג ב-KPI בנפרד)
  // v30.0: משכורת כוללת = משכורת שקלים + הכנסה דולרית (כבר בשקלים)
  var incCards = [
    {label:'משכורת כוללת', val:(r.salary&&r.salary.val!=null?r.salary.val:0)+(r.salary_usd&&r.salary_usd.val!=null?r.salary_usd.val:0), color:'#16a34a', icon:'💼'},
    {label:'שכר דירה',      val:r.rent_income&&r.rent_income.val!=null?r.rent_income.val:0, color:'#0891b2', icon:'🏠'},
    {label:'הכנסות שונות',  val:r.other_income&&r.other_income.val!=null?r.other_income.val:0, color:'#0891b2', icon:'📦'},
    {label:'פריטה',         val:r.buffer&&r.buffer.val!=null?r.buffer.val:0, color:'#0891b2', icon:'🔄'},
  ];
  // פירוט הוצאות — v30.0: הלוואות מוסתרות אם 0
  var expCards = [
    {label:'הוצאות שוטפות', val:(r.visa&&r.visa.val||0)+(r.cash_exp&&r.cash_exp.val||0), color:'#dc2626', icon:'💳'},
    {label:'החזר הלוואה',   val:(r.loans&&r.loans.val!=null?r.loans.val:0), color:'#b45309', icon:'🏦'},
    {label:'תזרים דולרי נטו', val:r.total_usd&&r.total_usd.val!=null?r.total_usd.val:0, color:'#7c3aed', icon:'$'},
  ];
  var container = document.getElementById('cf-cards-row');
  if(!container) return;
  var html = '';
  incCards.concat(expCards).forEach(function(card){
    if (card.val === 0) return; // v31: הסתר כרטיסיות עם ערך 0
    var dispVal = Math.abs(Math.round(card.val)).toLocaleString(); // v35: ללא ₪, ללא מינוס בהוצאות
    html += '<div style="background:white;border-radius:9px;padding:9px 13px;border-right:3px solid '+card.color+';box-shadow:0 1px 4px rgba(0,0,0,0.07);">';
    html += '<div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:2px;">'+card.icon+' '+card.label+'</div>';
    html += '<div style="font-size:18px;font-weight:800;color:'+card.color+';">'+dispVal+'</div>';
    html += '<div style="font-size:11px;color:#9ca3af;">'+m.label+'</div>';
    html += '</div>';
  });
  // v35: הצג container כשיש תוכן
  container.style.display = html.trim() ? 'grid' : 'none';
  container.innerHTML = html;
}

// v27.0: cfRenderKPI — שורה אחת, ללא כותרות, overflow-x:auto
function cfRenderKPI() {
  var lastIdx = cfGetLastRealMonth();
  var m = CF_DATA[lastIdx];
  var detailEl = document.getElementById('cf-detail-row');
  if (!detailEl) return;

  function gv(key) { return (m.rows[key] && m.rows[key].val != null) ? m.rows[key].val : null; }
  function chip(lbl, val, col) {
    if (val === null || val === 0) return ''; // v31: הסתר אפסים ו-null
    return '<div style="display:flex;flex-direction:column;background:#1e293b;border-radius:8px;padding:12px 18px;border-top:3px solid '+col+';flex-shrink:0;">' +
      '<span style="font-size:13px;color:rgba(255,255,255,0.4);font-weight:600;white-space:nowrap;">'+lbl+'</span>' +
      '<span style="font-size:19px;font-weight:700;color:'+col+';margin-top:3px;white-space:nowrap;">'+Math.round(val).toLocaleString()+'</span></div>';
  }
  var SEP = '<div style="width:1px;background:rgba(255,255,255,0.06);flex-shrink:0;align-self:stretch;margin:0 2px;"></div>';

  var IG='#4ade80', ER='#f87171', EO='#fb923c', EY='#fbbf24', EP='#818cf8';
  var h = '<div style="background:#0f172a;border-radius:12px;padding:8px 14px;direction:rtl;">';
  h += '<div style="display:flex;align-items:flex-start;gap:4px;overflow-x:auto;padding-bottom:2px;">';
  h += chip('משכורת',gv('salary'),IG);
  h += chip('שכ"ד',gv('rent_income'),IG);
  h += chip('אחרות',gv('other_income'),IG);
  h += chip('פריטה',gv('buffer'),IG);
  h += SEP;
  h += chip('ויזה',gv('visa'),ER);
  h += chip('מזומן',gv('cash_exp'),ER);
  h += chip('הלוואות',gv('loans'),ER);
  h += chip('שיפוץ',gv('renovation'),ER);
  h += SEP;
  h += chip('יותם',gv('yotam'),EO);
  h += chip('חריג',gv('other_exp'),EY);
  h += SEP;
  h += chip('משכ$ ',gv('salary_usd'),EP);
  h += chip('הוצ$',gv('exp_usd'),EP);
  h += chip('יותם$',gv('yotam_usd'),EP);
  h += chip('סך$',gv('total_usd'),EP);
  h += '</div></div>';
  detailEl.innerHTML = h;
}

function cfRenderChart() {
  var COL_W   = 80;
  var YAXIS_W = 50;  // רוחב ציר Y — חייב להתאים ל-YAXIS_W ב-cfRenderTable
  var months = cfGetDisplayMonths();
  // תוויות מקוצרות רק לגרף — ינו׳ 25, פבר׳ 26 וכו׳
  CF_CHART_MONTHS = months; // v22.0: שמור לשימוש ב-onClick
  var labels = months.map(function(m){ return CF_HEB_MONTHS_ABBR[m.month-1] + ' ' + String(m.year).slice(2); });
  var chartW = months.length * COL_W + YAXIS_W;

  // קבע רוחב מדויק למניעת מתיחת עמודות
  var wrap = document.getElementById('cf-chart-wrap');
  if (wrap) {
    wrap.style.width    = chartW + 'px';
    wrap.style.minWidth = chartW + 'px';
    wrap.style.maxWidth = chartW + 'px';
    wrap.style.flex     = 'none';
  }

  var ctx = document.getElementById('cf-chart');
  if (!ctx) return;
  if (cfChartInstance) { cfChartInstance.destroy(); cfChartInstance = null; }

  var datasets;
  var isMonthly = cfCurrentView === 'monthly';
  if (isMonthly) {
    // v21.0: Stacked Bar — הכנסות ירוק | שוטף אדום | יותם כתום | חריג צהוב
    var expShoter = [], expYotam = [], expCharig = [];
    months.forEach(function(m) {
      // v33.0: totalExpCalc מחושב מרכיבים (כולל הלוואות)
      var totalExpCalc = cfCalcExp(m.rows);
      var yotamV  = (m.rows.yotam    && m.rows.yotam.val    != null) ? m.rows.yotam.val    : 0;
      var charigV = (m.rows.other_exp && m.rows.other_exp.val != null) ? m.rows.other_exp.val : 0;
      expShoter.push(Math.max(0, totalExpCalc - yotamV - charigV));
      expYotam.push(yotamV);
      expCharig.push(charigV);
    });
    datasets = [
      { label:'הכנסות', data:months.map(function(m){ return cfCalcIncome(m.rows); }), backgroundColor:'rgba(34,197,94,0.85)',  borderRadius:4, stack:'income' },
      { label:'שוטף',  data:expShoter, backgroundColor:'rgba(239,68,68,0.85)',  borderRadius:0, stack:'exp' },
      { label:'יותם',  data:expYotam,  backgroundColor:'rgba(249,115,22,0.85)', borderRadius:0, stack:'exp' },
      { label:'חריג',  data:expCharig, backgroundColor:'rgba(234,179,8,0.85)',  borderRadius:4, stack:'exp' },
    ];
  } else {
    // ytd: מצטבר לפי cfGetNetVal (total_income - total_exp)
    var cum = [], s = 0;
    months.forEach(function(m){
      var v = cfGetNetVal(m);
      s += (v !== null ? v : 0);
      cum.push(s);
    });
    datasets = [{
      label:'מצטבר', data:cum,
      backgroundColor:cum.map(function(v){ return v>=0?'rgba(34,197,94,0.85)':'rgba(239,68,68,0.85)'; }),
      borderRadius:3,
      maxBarThickness: 34  // v23.0: אחיד עם רוחב עמודות בגרף חודשי
    }];
  }

  cfChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels:labels, datasets:datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding:{ top:8, bottom:0, left:0, right:0 } },
      onClick: function(_evt, elements) {
        // v22.0: לחיצה על עמודה — עדכון חודש נבחר
        if (elements && elements.length > 0) {
          var idx = elements[0].index;
          var clicked = CF_CHART_MONTHS[idx];
          if (clicked && clicked.monthId) {
            cfSelectMonth(clicked.monthId);
          }
        }
      },
      onHover: function(evt, elements) {
        if (evt.native) evt.native.target.style.cursor = elements && elements.length ? 'pointer' : 'default';
      },
      plugins: {
        legend: { display:false },
        tooltip: {
          rtl:true, textDirection:'rtl',
          xAlign: 'left', yAlign: 'bottom',  // v23.0: הזזת tooltip הצידה כדי שלא יחסום לחיצה
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              var idx = items[0].dataIndex;
              return CF_CHART_MONTHS[idx] ? CF_CHART_MONTHS[idx].label : labels[idx];
            },
            label: function(item) {
              var datasetLabel = item.dataset.label || '';
              var val = item.raw;
              return datasetLabel + ': ₪' + Math.round(val).toLocaleString();
            },
            afterBody: function(items) {
              if (!isMonthly || !items.length) return [];
              var idx = items[0].dataIndex;
              var ytdInc = 0, ytdExp = 0;
              for (var i = 0; i <= idx; i++) {
                ytdInc += cfCalcIncome(months[i].rows);
                ytdExp += cfCalcExp(months[i].rows);
              }
              return ['──────────────', 'YTD הכנסות: ₪'+Math.round(ytdInc).toLocaleString(), 'YTD הוצאות: ₪'+Math.round(ytdExp).toLocaleString(), 'YTD נטו: ₪'+Math.round(ytdInc-ytdExp).toLocaleString()];
            }
          }
        }
      },
      scales: {
        x: {
          stacked: isMonthly,
          display: false,
          offset: true,
          grid:  { display:false },
          barPercentage:    0.7,
          categoryPercentage: 1.0
        },
        y: {
          stacked: isMonthly,
          display: true,
          position: 'left',
          grid: { color: 'rgba(0,0,0,0.04)' },
          ticks: {
            font: { size:10, family:'Heebo,sans-serif' },
            color: '#9ca3af',
            maxTicksLimit: 5,
            callback: function(v){ return v.toLocaleString(); }
          },
          afterFit: function(scale){ scale.width = YAXIS_W; }
        }
      }
    }
  });
}

function cfRenderTable() {
  var COL_W   = 80;   // matches chart COL_W
  var LABEL_W = 130;  // sticky label column width — v34: reduced for tighter layout
  var YAXIS_W = 50;   // matches chart Y axis width — spacer column on left

  var months = cfGetDisplayMonths();

  var ROWS = [
    {key:'salary',       label:'\u05de\u05e9\u05db\u05d5\u05e8\u05ea',               block:'income',   total:false},
    {key:'rent_income',  label:'\u05e9\u05db\u05e8 \u05d3\u05d9\u05e8\u05d4',             block:'income',   total:false},
    {key:'other_income', label:'\u05d4\u05db\u05e0\u05e1\u05d5\u05ea \u05e9\u05d5\u05e0\u05d5\u05ea',         block:'income',   total:false},
    {key:'buffer',       label:'\u05e4\u05e8\u05d9\u05d8\u05d4 \u05de\u05d1 Buffer',       block:'income',   total:false},
    {key:'total_income', label:'\u05e1\u05d4\u05f4\u05db \u05d4\u05db\u05e0\u05e1\u05d5\u05ea',          block:'income',   total:true},
    {key:'visa',         label:'\u05d7\u05d9\u05d5\u05d1 \u05d5\u05d9\u05d6\u05d4',            block:'expenses', total:false},
    {key:'cash_exp',     label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d6\u05d5\u05de\u05df',         block:'expenses', total:false},
    {key:'loans',        label:'\u05d4\u05d7\u05d6\u05e8 \u05d4\u05dc\u05d5\u05d5\u05d0\u05d5\u05ea',         block:'expenses', total:false},
    {key:'yotam',        label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05d9\u05d5\u05ea\u05dd',          block:'expenses', total:false},
    {key:'other_exp',    label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05e9\u05d5\u05e0\u05d5\u05ea',         block:'expenses', total:false},
    {key:'total_exp',    label:'\u05e1\u05d4\u05f4\u05db \u05d4\u05d5\u05e6\u05d0\u05d5\u05ea',          block:'expenses', total:true},
    {key:'renovation',   label:'\u05e9\u05d9\u05e4\u05d5\u05e5',                block:'special',  total:false},
    {key:'net_cashflow', label:'\u05ea\u05d6\u05e8\u05d9\u05dd \u05e9\u05e7\u05dc\u05d9 \u05e0\u05d8\u05d5',       block:'cashflow', total:true},
    {key:'salary_usd',   label:'\u05de\u05e9\u05db\u05d5\u05e8\u05ea $',             block:'dollar',   total:false},
    {key:'exp_usd',      label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea $',             block:'dollar',   total:false},
    {key:'yotam_usd',    label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05d9\u05d5\u05ea\u05dd $',        block:'dollar',   total:false},
    {key:'total_usd',    label:'\u05e1\u05da \u05d4\u05db\u05dc $',             block:'dollar',   total:true},
    {key:'delta',        label:'\u2206 \u05ea\u05d6\u05e8\u05d9\u05dd \u05e9\u05d5\u05d8\u05e3',         block:'summary',  total:true},
    {key:'profit_loss',  label:'\u05e8\u05d5\u05d5\u05d7 / \u05d4\u05e4\u05e1\u05d3',          block:'summary',  total:true},
  ];

  var BC = { income:'#16a34a', expenses:'#dc2626', special:'#b45309',
             cashflow:'#2563eb', dollar:'#7c3aed', summary:'#475569' };
  var BL = { income:'\u05d4\u05db\u05e0\u05e1\u05d5\u05ea', expenses:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05e9\u05d5\u05d8\u05e4\u05d5\u05ea',
             special:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05d7\u05e8\u05d9\u05d2\u05d5\u05ea', cashflow:'\u05ea\u05d6\u05e8\u05d9\u05dd \u05e0\u05d8\u05d5',
             dollar:'\u05d3\u05d5\u05dc\u05e8\u05d9', summary:'\u05e1\u05d9\u05db\u05d5\u05dd' };

  // sticky label cell — LAST in row, right:0
  var STICKY = 'position:sticky;right:0;z-index:2;'
             + 'width:'+LABEL_W+'px;min-width:'+LABEL_W+'px;max-width:'+LABEL_W+'px;'
             + 'direction:rtl;text-align:right;white-space:nowrap;'
             + 'border-right:1px solid rgba(255,255,255,0.06);';

  var table = document.getElementById('cf-table');
  if (!table) return;
  table.style.width = (months.length * COL_W + YAXIS_W + LABEL_W) + 'px';

  // ── THEAD ─────────────────────────────────────────────
  // sticky top:0 on each <th> directly — tr sticky doesn't work cross-browser
  var TH_STICKY = 'position:sticky;top:0;z-index:10;background:#162032;';
  var h = '<thead><tr style="background:#162032;border-bottom:1px solid rgba(255,255,255,0.08);">';
  // Y axis spacer — aligns header row with chart Y axis area
  h += '<th style="'+TH_STICKY+'width:'+YAXIS_W+'px;min-width:'+YAXIS_W+'px;max-width:'+YAXIS_W+'px;padding:0;border-bottom:1px solid rgba(255,255,255,0.08);"></th>';
  // month headers (left = oldest)
  months.forEach(function(m){
    var shortLbl = CF_HEB_MONTHS_ABBR[m.month-1] + ' ' + String(m.year).slice(2);
    h += '<th style="'+TH_STICKY+'width:'+COL_W+'px;min-width:'+COL_W+'px;max-width:'+COL_W+'px;padding:8px 4px;text-align:center;font-size:11px;font-weight:700;color:rgba(255,255,255,0.55);white-space:nowrap;border-bottom:1px solid rgba(255,255,255,0.08);" title="'+m.label+'">'+shortLbl+'</th>';
    h += '<th class="cf-note-col" style="display:none;padding:8px 4px;text-align:center;font-size:10px;font-weight:600;color:rgba(255,255,255,0.3);min-width:90px;">\u05d4\u05e2\u05e8\u05d5\u05ea</th>';
  });
  // corner cell: sticky right AND top — highest z-index
  h += '<th style="'+STICKY+''+TH_STICKY+'padding:8px 12px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.55);z-index:25;border-bottom:1px solid rgba(255,255,255,0.08);">\u05e1\u05e2\u05d9\u05e3</th>';
  h += '</tr></thead>';

  // ── TBODY ─────────────────────────────────────────────
  var b = '<tbody>';
  var lastBlock = null, rowIdx = 0;

  ROWS.forEach(function(row){
    var bl    = row.block;
    var col   = BC[bl];
    var isTot = row.total;

    if (bl !== lastBlock) {
      // separator row
      b += '<tr style="background:#0f172a;border-top:1px solid rgba(255,255,255,0.06);">';
      b += '<td colspan="'+(months.length+1)+'" style="background:#0f172a;padding:4px;"></td>';
      b += '<td style="'+STICKY+'background:#0f172a;padding:4px 10px;font-size:9px;font-weight:800;color:'+col+';letter-spacing:0.5px;border-left:3px solid '+col+';">'+BL[bl].toUpperCase()+'</td>';
      b += '</tr>';
      rowIdx = 0;
    }
    lastBlock = bl;

    var bg  = isTot ? '#162032' : (rowIdx%2===0 ? '#1e293b' : '#1a2535');
    if (!isTot) rowIdx++;

    b += '<tr style="background:'+bg+';border-bottom:1px solid rgba(255,255,255,0.04);">';

    // Y axis spacer cell — aligns table columns with chart bars
    b += '<td style="width:'+YAXIS_W+'px;min-width:'+YAXIS_W+'px;max-width:'+YAXIS_W+'px;background:'+bg+';padding:0;"></td>';

    // data cells (scrollable, left side)
    months.forEach(function(m){
      var cell = m.rows[row.key] || {val:null, note:null};
      var val  = cell.val, note = cell.note;
      var vc   = 'rgba(255,255,255,0.75)';
      if (isTot) {
        if      (bl==='income')   vc='#16a34a';
        else if (bl==='expenses') vc='#dc2626';
        else if (bl==='cashflow'||bl==='summary'||bl==='dollar')
          vc = val!==null&&val>0?'#16a34a':val!==null&&val<0?'#dc2626':'#9ca3af';
      } else {
        if      (bl==='income')                     vc='#16a34a';
        else if (bl==='expenses'||bl==='special')   vc='#dc2626';
        else if (bl==='dollar'&&val!==null&&val<0)  vc='#dc2626';
        else if (bl==='dollar'&&val!==null&&val>0)  vc='#7c3aed';
      }
      var cs = 'width:'+COL_W+'px;max-width:'+COL_W+'px;padding:7px 4px;text-align:center;font-size:12px;color:'+vc+';font-variant-numeric:tabular-nums;white-space:nowrap;'+(isTot?'font-weight:700;':'');
      b += '<td style="'+cs+'">'+(val!==null?val.toLocaleString():'<span style="color:rgba(255,255,255,0.15)">—</span>')+'</td>';
      b += '<td class="cf-note-col" style="display:none;padding:7px 4px;text-align:right;font-size:10px;color:#6b7280;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+(note||'')+'">'+( note||'')+'</td>';
    });

    // sticky label cell LAST (right side)
    var lPad = isTot ? 'padding:7px 12px;' : 'padding:6px 12px 6px 12px;';
    var lBorder = 'border-left:2px solid '+col+';';
    var lTxt = isTot ? 'font-weight:700;color:rgba(255,255,255,0.92);' : 'color:rgba(255,255,255,0.65);';
    b += '<td style="'+STICKY+'background:'+bg+';'+lPad+lBorder+lTxt+'font-size:12px;">'+row.label+'</td>';

    b += '</tr>';
  });

  b += '</tbody>';

  table.innerHTML = h + b;
}

function cfShowNoData() {
  var kpi=document.getElementById('cf-kpi-row');
  if(kpi) kpi.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px 20px;">'+'<div style="font-size:40px;margin-bottom:12px;">📂</div>'+'<div style="font-size:15px;font-weight:700;color:#374151;margin-bottom:8px;">אין נתוני תזרים</div>'+'<div style="font-size:13px;">לחץ על <strong>עדכן נתונים מאקסל</strong> ובחר את קובץ התזרים השוטף</div></div>';
  var cf=document.getElementById('cf-cards-row'); if(cf) cf.innerHTML='';
  var t=document.getElementById('cf-table'); if(t) t.innerHTML='';
  if(cfChartInstance){cfChartInstance.destroy();cfChartInstance=null;}
  ['cf-hdr-current','cf-hdr-ytd','cf-hdr-avg'].forEach(function(id){
    var el=document.getElementById(id); if(el){el.textContent='—';el.className='stat-value';}
  });
}

// v33.0: Slim Summary Bar — 3 שקליים ימין (YTD גדול) + 3 דולריים שמאל (קטן ועמום)
function cfRenderSummary() {
  var container = document.getElementById('cf-summary-row');
  if (!container) return;

  var displayYear = CF_SELECTED_YEAR || (function() {
    var maxY = 2025;
    for (var di = 0; di < CF_DATA.length; di++) { if (CF_DATA[di].year > maxY) maxY = CF_DATA[di].year; }
    return maxY;
  })();

  var lastIdx = cfGetLastRealMonth();
  var selM = CF_DATA[lastIdx];
  var upToMonth = (selM && selM.year === displayYear) ? selM.month : 12;

  // YTD שקלי — v35: ytdNet מסונכרן לגרף מצטבר (cfGetNetVal = אותו חישוב בגרף)
  var ytdInc = 0, ytdExp = 0, ytdNet = 0, ytdMonths = 0;
  CF_DATA.forEach(function(m) {
    if (m.year !== displayYear || m.month > upToMonth) return;
    ytdInc += cfCalcIncome(m.rows);
    ytdExp += cfCalcExp(m.rows);
    ytdNet += (cfGetNetVal(m) || 0);  // זהה לחישוב הגרף המצטבר
    ytdMonths++;
  });
  var ytdNetCol = ytdNet >= 0 ? '#4ade80' : '#f87171';
  var ytdLabel = selM ? (selM.month > 1 ? '\u05d9\u05e0\u05d5\u02b9\u2013' + selM.label : selM.label) : 'YTD';

  // דולרי — נתוני החודש הנבחר (כבר בשקלים)
  var dr = selM ? selM.rows : {};
  var salUsd = dr.salary_usd&&dr.salary_usd.val!=null?dr.salary_usd.val:0;
  var expUsd = dr.exp_usd&&dr.exp_usd.val!=null?dr.exp_usd.val:0;
  var totUsd = dr.total_usd&&dr.total_usd.val!=null?dr.total_usd.val:0;
  var totUsdCol = totUsd >= 0 ? '#a5b4fc' : '#fca5a5';

  // v35: ללא ₪; נטו שלילי → '-X,XXX' ; הוצאות מועברות עם Math.abs מהצד הקורא
  function fmt(v) { var a = Math.abs(Math.round(v)); return (v < 0 ? '-' : '') + a.toLocaleString(); }

  function cellBig(lbl, val, col) {
    return '<div style="display:flex;flex-direction:column;gap:2px;">' +
      '<span style="font-size:13px;color:rgba(255,255,255,0.42);font-weight:600;">' + lbl + '</span>' +
      '<span style="font-size:20px;font-weight:800;color:' + col + ';line-height:1;">' + fmt(val) + '</span>' +
      '</div>';
  }
  function cellSmall(lbl, val, col) {
    return '<div style="display:flex;flex-direction:column;gap:1px;">' +
      '<span style="font-size:10px;color:rgba(255,255,255,0.22);font-weight:500;">' + lbl + '</span>' +
      '<span style="font-size:13px;font-weight:700;color:' + col + ';line-height:1;">' + fmt(val) + '</span>' +
      '</div>';
  }

  var DIV  = '<div style="width:1px;background:rgba(255,255,255,0.08);align-self:stretch;margin:0 6px;flex-shrink:0;"></div>';
  var BDIV = '<div style="width:2px;background:rgba(255,255,255,0.15);align-self:stretch;margin:0 10px;flex-shrink:0;border-radius:1px;"></div>';

  var html = '<div style="background:#0d1b2e;border-radius:10px;padding:13px 18px;display:flex;align-items:center;gap:10px;direction:rtl;border:1px solid rgba(99,102,241,0.15);">';

  // ימין — YTD שקלי (בולט)
  html += '<div style="font-size:15px;font-weight:700;color:#6366f1;white-space:nowrap;line-height:1.5;flex-shrink:0;">YTD<br>' + ytdLabel + '<br><span style="font-size:11px;color:rgba(255,255,255,0.25);font-weight:400;">' + ytdMonths + ' \u05d7\u05d3\u05f4</span></div>';
  html += DIV;
  html += cellBig('\u05d4\u05db\u05e0\u05e1\u05d5\u05ea', ytdInc, '#4ade80');
  html += cellBig('\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea', Math.abs(ytdExp), '#f87171');
  html += cellBig('\u05e0\u05d8\u05d5', ytdNet, ytdNetCol);

  html += BDIV;

  // שמאל — דולרי (עמום וקטן)
  html += '<div style="font-size:11px;font-weight:600;color:#3d5069;white-space:nowrap;line-height:1.5;flex-shrink:0;">$<br>' + (selM ? selM.label : '') + '</div>';
  html += DIV;
  html += cellSmall('\u05de\u05e9\u05db\u05f3', salUsd, '#818cf8');
  html += cellSmall('\u05d4\u05d5\u05e6\u05f3', Math.abs(expUsd), '#fca5a5');
  html += cellSmall('\u05e1\u05da', totUsd, totUsdCol);

  html += '</div>';
  container.innerHTML = html;
}

function cfInit() {
  if (!document.getElementById('cf-kpi-row')) return;
  if (!CF_DATA || CF_DATA.length === 0) { cfShowNoData(); return; }
  cfUpdateHeader();
  cfRenderMonthSelector(); // v18.3: בורר חודשים
  cfUpdateCFCards();
  cfRenderKPI();
  cfRenderSummary();
  cfRenderChart();
  cfRenderTable();
  // v32.0: הסתר טבלה בברירת מחדל
  cfTableVisible = false;
  var _ts = document.getElementById('cf-table-scroll');
  if (_ts) _ts.style.display = 'none';
  var _tb = document.getElementById('cf-table-toggle-btn');
  if (_tb) { _tb.textContent = '📋 הצג טבלה'; }

  // Start left-aligned so Y-axis is always visible on load
  setTimeout(function(){
    var sc = document.getElementById('cf-scroll-container');
    if (sc) sc.scrollLeft = 0;
  }, 150);
}

// v32.0: Toggle הצגת טבלה
var cfTableVisible = false;
function cfToggleTable() {
  cfTableVisible = !cfTableVisible;
  var ts = document.getElementById('cf-table-scroll');
  if (ts) ts.style.display = cfTableVisible ? '' : 'none';
  var btn = document.getElementById('cf-table-toggle-btn');
  if (btn) btn.textContent = cfTableVisible ? '🙈 הסתר טבלה' : '📋 הצג טבלה';
}



var TAB_NAMES={'overview':'מבט על','cashflow':'תזרים שוטף','investments':'השקעות','pension':'פנסיה וביטוחים','market':'ניתוח שוק ומסחר','simulator':'סימולטור פיננסי'};
var cfInited = false;
function switchTab(id){
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active');});
  var btn=document.getElementById('tabn-'+id);
  var panel=document.getElementById('tab-'+id);
  if(btn)btn.classList.add('active');
  if(panel)panel.classList.add('active');
  var t=document.getElementById('hdr-tab-title');
  if(t)t.textContent=TAB_NAMES[id]||id;

  var isCF = (id === 'cashflow');
  // Header stats swap
  var invStats = document.querySelector('.header-stats:not(#cf-header-stats)');
  if(invStats) invStats.style.display = isCF ? 'none' : '';
  var cfStats = document.getElementById('cf-header-stats');
  if(cfStats) cfStats.style.display = isCF ? 'flex' : 'none';
  // Cards swap
  var invCards = document.getElementById('inv-cards-row');
  if(invCards) invCards.style.display = isCF ? 'none' : '';
  var cfCards = document.getElementById('cf-cards-row');
  if(cfCards) cfCards.style.display = isCF ? 'grid' : 'none';
  // Chart hide/show
  var invChart = document.getElementById('inv-chart-section');
  if(invChart) invChart.style.display = isCF ? 'none' : '';

  // Context-sensitive header buttons
  document.querySelectorAll('.inv-only-btn').forEach(function(b){ b.style.display = isCF ? 'none' : ''; });
  document.querySelectorAll('.cf-only-btn').forEach(function(b){ b.style.display = isCF ? 'flex' : 'none'; });

  // v28.0: סגור חלוני צ'אט פתוחים בעת מעבר בין טאבים
  if (cfChatOpen) { cfChatOpen = false; var _cfcp = document.getElementById('cf-cp'); if(_cfcp) _cfcp.style.display='none'; }
  if (chatOpen)   { chatOpen   = false; var _cp   = document.getElementById('cp');    if(_cp)   _cp.style.display='none'; }

  if(isCF && !cfInited){ cfInited=true; setTimeout(cfInit,80); }
}

// חיבור כפתור העדכון ל-fileInput
(function() {
  var fi = document.getElementById('fileInput');
  if (fi) fi.addEventListener('change', function() { smartUploadRouter(this); });
})();
