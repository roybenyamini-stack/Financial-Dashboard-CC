// System check: Claude Code is active.

// LOGIN — v97.6
(function() {
  var HASH = '73ad549fa408e66ead012a22af3eee5f45dc521864a3a67d91bb1d8e9bd662b7';
  function unlock() {
    var overlay = document.getElementById('login-overlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('locked');
  }
  if (sessionStorage.getItem('auth') === '1') { unlock(); return; }
  function doLogin() {
    var pw = document.getElementById('login-pw').value;
    var err = document.getElementById('login-err');
    err.textContent = '';
    if (!pw) return;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw)).then(function(buf) {
      var hash = Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
      if (hash === HASH) {
        sessionStorage.setItem('auth', '1');
        unlock();
      } else {
        err.textContent = 'סיסמה שגויה. נסה שוב.';
        document.getElementById('login-pw').value = '';
        document.getElementById('login-pw').focus();
      }
    });
  }
  document.getElementById('login-btn').addEventListener('click', doLogin);
  document.getElementById('login-pw').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doLogin();
  });
})();
const LABELS = ['ינו׳ 25','פבר׳ 25','מרץ 25','אפר׳ 25','מאי 25','יוני 25','יולי 25','אוג׳ 25','ספט׳ 25','אוק׳ 25','נוב׳ 25','דצמ׳ 25','ינו׳ 26','פבר׳ 26','מרץ 26'];

// v56.2: כל מערכי data אופסו — הנתונים האמיתיים נטענים בלעדית מ-localStorage (העלאת אקסל קודמת)
const _Z = Array(15).fill(null); // 15 חודשים: ינו׳25–מרץ26
const FUNDS = {
  'אשקהש39905556':       { name:'א״ש ק״הש 39905556',      cat:'hishtalmut', data:[..._Z] },
  'אשקהש6730513':        { name:'א״ש ק״הש 6730513 ← מיטב 442504', cat:'hishtalmut', transferred:true, data:[..._Z] },
  'אשקהש40035706':       { name:'א״ש קה״ש 40035706',       cat:'hishtalmut', data:[..._Z] },
  'מורקהש499293':        { name:'מור קה״ש 499293 ← מיטב 443195', cat:'hishtalmut', transferred:true, data:[..._Z] },
  'מיטבקהש912-443286':   { name:'מיטב קה״ש 912-443286', cat:'hishtalmut', data:[..._Z] },

  '6730511אשגמל':        { name:'א״ש גמל 6730511 ← מור 1428298', cat:'gemel', data:[..._Z] },
  'מורגמל1375900':        { name:'מור גמל 1375900', cat:'gemel', data:[..._Z] },
  'אשגמל39774495':       { name:'א״ש גמל 39774495 ← מור 1375688', cat:'gemel', data:[..._Z] },
  '6730512אשגמל':        { name:'א״ש גמל 6730512 ← מור 1375888', cat:'gemel', data:[..._Z] },
  '6899425אשגמל':        { name:'א״ש גמל 6899425 ← מור 1375911', cat:'gemel', data:[..._Z] },
  'הפניקסגמל926-084678': { name:'הפניקס גמל 926-084678',   cat:'gemel', data:[..._Z] },
  'אשגמללהשקעה2016-1738':{ name:'א״ש גמל להשקעה ← מיטב 917-443197', cat:'gemel_invest', data:[..._Z] },
  'מורגמללהשקעה':        { name:'מור גמל להשקעה ← מיטב 912-443197', cat:'gemel_invest', data:[..._Z] },
  'הראלמגוון-פוליסתחיסכ':{ name:'הראל מגוון - פוליסת חיסכון', cat:'harel', data:[..._Z] },
  'הראלמניות106863031':  { name:'הראל מניות 106863031',    cat:'harel', data:[..._Z] },
  'הראלכללי109062745':   { name:'הראל כללי 109062745',     cat:'harel', data:[..._Z] },
  'מיטבדשניהולקרנות1693':{ name:'מיטב דש ניהול קרנות 169301968', cat:'meitav', data:[..._Z] },
  'מיטבדשטרייד': { name:'מיטב דש טרייד', cat:'meitav', data:[..._Z] },
  'חובהראל':   { name:'חוב הראל',       cat:'chov', data:[..._Z] },
  'חובאלטשולר':{ name:'חוב אלטשולר',    cat:'chov', data:[..._Z] },
  'ארביטראזואליו': { name:'ארביטראז׳ ואליו', cat:'arbitrage', data:[..._Z] },
  'דירה': { name:'דירה', cat:'dira', data:[..._Z] },
  'מזומןשקלי':   { name:'מזומן שקלי',   cat:'mezuman', data:[..._Z] },
  'מזומןדולרי':  { name:'מזומן דולרי $', cat:'mezuman', data:[..._Z] },
  'מיטבשקלית':   { name:'מיטב קרן כספית', cat:'mezuman', data:[..._Z] },
  // ── יעל ──
  'יעלקהש':        { name:'ק״הש – יעל',         cat:'hishtalmut', owner:'yael', liquidity:'age64',  data:[..._Z] },
  'יעלגמל':        { name:'גמל – יעל',           cat:'gemel',      owner:'yael', liquidity:'pension', pensionMonthly:true, data:[..._Z] },
  'יעלגמלהשקעה':   { name:'גמל להשקעה – יעל',    cat:'gemel_invest',owner:'yael', liquidity:'now',   data:[..._Z] },
  'יעלפוליסה':     { name:'פוליסת חיסכון – יעל', cat:'harel',      owner:'yael', liquidity:'now',   data:[..._Z] },
};

const CAT_COLORS = { mezuman:'#0891b2', chov:'#94a3b8', arbitrage:'#0d9488', dira:'#a8a29e', hishtalmut:'#fca5a5', gemel:'#fcd34d', gemel_invest:'#6ee7b7', harel:'#fde68a', meitav:'#c4b5fd', all:'#2563eb' };
const CAT_NAMES  = { mezuman:'מזומן', chov:'חוב', arbitrage:'ארביטראז׳ ואליו', dira:'דירה', hishtalmut:'קרנות השתלמות', gemel:'קופות גמל', gemel_invest:'גמל להשקעה', harel:'פוליסות חיסכון', meitav:'מיטב', all:'סה״כ כל הקטגוריות' };
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
  'יעלקהש':        '#ec4899',
  'יעלגמל':        '#ec4899',
  'יעלגמלהשקעה':   '#ec4899',
  'יעלפוליסה':     '#ec4899',
};

// v103.0: Column K metadata — per fund per month ('תלוש' | number | null)
var FUND_COL_K = {};

// ── Family View (v94.0) ──
var invViewMode = 'roee'; // 'roee' | 'yael' | 'all'

// ── Master-Detail State (v98.4) ──
var invMDCurrentCat  = null;
var invMDCurrentFund = null;
function invFundFilter() {
  if (invViewMode === 'roee') return function(f) { return !f.owner || f.owner === 'roee'; };
  if (invViewMode === 'yael') return function(f) { return f.owner === 'yael'; };
  return function() { return true; };
}
function rebuildInvTotals() {
  var ff = invFundFilter();
  Object.keys(CAT_TOTALS).forEach(function(cat) { CAT_TOTALS[cat].length = 0; });
  LABELS.forEach(function(_, i) {
    Object.keys(CAT_TOTALS).forEach(function(cat) {
      var vals = Object.values(FUNDS).filter(function(f) { return f.cat===cat && ff(f); }).map(function(f) { return f.data[i]||0; });
      CAT_TOTALS[cat].push(vals.reduce(function(a,b) { return a+b; }, 0));
    });
  });
}
function getFilteredAllTotals() {
  var ff = invFundFilter();
  return LABELS.map(function(_, i) {
    return Object.values(FUNDS).filter(ff).reduce(function(t, f) {
      var ffed = ffFundData(f.data);
      return t + (f.cat === 'chov' ? -(ffed[i]||0) : (ffed[i]||0));
    }, 0);
  });
}
// v97.2: Yael snapshot donut charts — uses makePie() for identical look/feel to Roee charts
function renderYaelDonuts() {
  // Find last month with data for any yael fund
  var endIdx = LABELS.length - 1;
  var yaelFunds = Object.values(FUNDS).filter(function(f){ return f.owner === 'yael'; });
  while (endIdx > 0 && yaelFunds.every(function(f){ return !f.data[endIdx]; })) endIdx--;

  // Destroy any existing chart instances before re-creating
  ['yael-modal-donut-type', 'yael-modal-donut-liq'].forEach(function(id) {
    var existing = Chart.getChart(id);
    if (existing) existing.destroy();
  });

  // --- Donut 1: by product type ---
  var typeDefs = [
    { label:'קרן השתלמות',   color:'#fca5a5', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='hishtalmut';   }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
    { label:'קופת גמל',      color:'#fcd34d', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='gemel';         }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
    { label:'פוליסת חיסכון', color:'#fde68a', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='harel';         }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
    { label:'גמל להשקעה',    color:'#6ee7b7', val: Math.round(yaelFunds.filter(function(f){ return f.cat==='gemel_invest';  }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0)) },
  ];
  var typeTotal = typeDefs.reduce(function(s,d){ return s+d.val; }, 0);
  makePie('yael-modal-donut-type', 'yael-modal-donut-type-legend', typeDefs, typeTotal);

  // --- Donut 2: by liquidity (3 categories) ---
  var liqNow     = Math.round(yaelFunds.filter(function(f){ return f.liquidity === 'now';     }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0));
  var liqAge64   = Math.round(yaelFunds.filter(function(f){ return f.liquidity === 'age64';   }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0));
  var liqPension = Math.round(yaelFunds.filter(function(f){ return f.liquidity === 'pension'; }).reduce(function(s,f){ return s+(f.data[endIdx]||0); }, 0));
  var liqDefs = [
    { label:'נזיל היום',       color:'#4ade80', val: liqNow },
    { label:'נזיל בגיל 64',   color:'#94a3b8', val: liqAge64 },
    { label:'קצבה חודשית',    color:'#a855f7', val: liqPension },
  ].filter(function(d){ return d.val > 0; });
  var liqTotal = liqNow + liqAge64 + liqPension;
  makePie('yael-modal-donut-liq', 'yael-modal-donut-liq-legend', liqDefs, liqTotal);
}

function invSetView(mode) {
  invViewMode = mode;
  var sel = document.getElementById('inv-view-select');
  if (sel) sel.value = mode;
  // Show/hide fund rows by owner
  document.querySelectorAll('tr[data-fund]').forEach(function(row) {
    var owner = row.getAttribute('data-owner') || 'roee';
    var show = mode === 'all' ||
               (mode === 'roee' && owner === 'roee') ||
               (mode === 'yael' && owner === 'yael');
    row.style.display = show ? '' : 'none';
  });
  // v96.6: "פוליסות חיסכון" is the unified name for 'harel' category across all views
  var yaelOnlyCats = ['mezuman','meitav','arbitrage','dira','chov'];
  if (mode === 'yael') {
    yaelOnlyCats.forEach(function(cat) {
      var card = document.getElementById('card-' + cat);
      var sec  = document.getElementById('sec-'  + cat);
      if (card) card.style.display = 'none';
      if (sec)  sec.style.display  = 'none';
    });
  } else {
    yaelOnlyCats.forEach(function(cat) {
      var card = document.getElementById('card-' + cat);
      // sec-* (category sections) stay hidden — Master-Detail replaces them
      if (card) card.style.display = '';
    });
  }
  rebuildInvTotals();
  CAT_CHART_TOTALS = buildCatChartTotals();
  updateTableCells();
  updateDynamicStats();
  if (typeof currentView !== 'undefined') selectView(currentView || 'all');
  // v99.1: categories-scroll replaced by Master-Detail — always hidden
  var catLabel = document.getElementById('cat-scroll-label');
  var catScr   = document.getElementById('categories-scroll');
  var tableBtn = document.getElementById('inv-table-btn');
  if (catScr)   catScr.style.display   = 'none';
  if (catLabel) catLabel.style.display = 'none';
  if (mode === 'yael') {
    if (tableBtn) { tableBtn.disabled = true; tableBtn.style.opacity = '0.35'; tableBtn.style.cursor = 'not-allowed'; }
  } else {
    if (tableBtn) { tableBtn.disabled = false; tableBtn.style.opacity = ''; tableBtn.style.cursor = 'pointer'; }
  }
}

// Category totals (for table display - includes all funds initially, rebuilt by rebuildInvTotals on view switch)
const CAT_TOTALS = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
LABELS.forEach((_, i) => {
  Object.entries(CAT_TOTALS).forEach(([cat, arr]) => {
    const vals = Object.values(FUNDS).filter(f => f.cat===cat && (!f.owner||f.owner==='roee')).map(f => f.data[i]||0);
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
  var filterFn = invFundFilter();
  const totals = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
  Object.entries(totals).forEach(([cat, arr]) => {
    const funds = Object.values(FUNDS).filter(f => f.cat===cat && filterFn(f));
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
              var tooltipFilter = invFundFilter(); // v96.5: סנן לפי מבט נוכחי
              var soldFunds = Object.values(FUNDS).filter(function(f) {
                if (f.cat !== currentView) return false;
                if (!tooltipFilter(f)) return false;
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
  const invFilter = invFundFilter();
  const filteredFunds = Object.values(FUNDS).filter(invFilter);
  // v97.1: find endIdx using only the funds visible in current view
  while (endIdx > 0 && filteredFunds.every(f => f.data[endIdx] === null || f.data[endIdx] === undefined)) endIdx--;
  // v103.7: check if there is ANY real data — if not, show clean empty state
  const hasAnyData = filteredFunds.some(f => f.data.some(v => v !== null && v !== undefined && v > 0));
  const cats = ['mezuman','hishtalmut','gemel','gemel_invest','harel','meitav','arbitrage','dira','chov'];
  const el = id => document.getElementById(id);
  const endLabel = hasAnyData ? LABELS[endIdx] : null;

  const catTotals = {}, catMeasured = {};
  cats.forEach(cat => {
    catTotals[cat] = 0;
    catMeasured[cat] = 0;
    const excl = EXCLUDE_FROM_PCT[cat] || [];
    Object.entries(FUNDS).forEach(([k, f]) => {
      if (f.cat !== cat) return;
      if (!invFilter(f)) return;
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
      .filter(([k,f])=>f.cat===c && !excl.includes(k) && (f.data[endIdx]||0)>0 && invFilter(f))
      .reduce((a,[,f])=>a+(f.data[startIdx]||0),0);
  }, 0);
const grandBase0 = cats.reduce((s,c) => {
    const v = Object.entries(FUNDS).filter(([,f])=>f.cat===c && invFilter(f)).reduce((a,[,f])=>a+(f.data[startIdx]||0),0);
    return c === 'chov' ? s - v : s + v;
  }, 0);
  const grandPct = (grandMeasuredStart > 0 && grandMeasured > 0)
    ? ((grandMeasured - grandMeasuredStart) / grandMeasuredStart * 100).toFixed(1)
    : (grandMeasured > 0 ? '—' : '0.0');
  const grandDiff = grandTotal - grandBase0;

  // v103.7: clean empty state — no data loaded yet
  if (!hasAnyData) {
    if(el('hdr-total'))      el('hdr-total').textContent = '—';
    if(el('hdr-change-val')){ el('hdr-change-val').textContent = '—'; el('hdr-change-val').style.color = '#94a3b8'; }
    if(el('hdr-ret-val'))  { el('hdr-ret-val').textContent = '—'; el('hdr-ret-val').style.color = '#94a3b8'; }
    if(el('hdr-ret-range'))  el('hdr-ret-range').textContent = '—';
    const headerSub0 = document.getElementById('hdr-subtitle');
    if(headerSub0) headerSub0.textContent = '';
    if(el('hdr-external-wrap')) el('hdr-external-wrap').style.visibility = 'hidden';
    cats.forEach(cat => {
      if(el('card-val-'+cat)) el('card-val-'+cat).textContent = '—';
      if(el('card-chg-'+cat)){ el('card-chg-'+cat).textContent = ''; el('card-chg-'+cat).className = 'card-change'; }
    });
    if(el('card-val-all')) el('card-val-all').textContent = '—';
    if(el('card-chg-all')){ el('card-chg-all').textContent = '—'; el('card-chg-all').style.color = '#94a3b8'; }
    return;
  }

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
    if (externalAmt > 0 && invViewMode !== 'yael') {
      extWrap.style.visibility = 'visible';
      el('hdr-external-val').textContent = externalAmt.toLocaleString();
    } else {
      extWrap.style.visibility = 'hidden';
    }
  }
  // Right stat: measured return %
  if(el('hdr-ret-val')) {
    if (grandPct === '—') {
      el('hdr-ret-val').textContent = '—';
      el('hdr-ret-val').style.color = '#94a3b8';
    } else {
      el('hdr-ret-val').textContent = (parseFloat(grandPct)<0?'-':'') + Math.abs(parseFloat(grandPct)).toFixed(1) + '%';
      el('hdr-ret-val').style.color = parseFloat(grandPct)<0 ? '#ef4444' : '#4ade80';
    }
  }
  if(el('hdr-ret-range')) el('hdr-ret-range').textContent = (startLabel && endLabel) ? startLabel + ' – ' + endLabel : '—';
  // Subtitle showing current month
  const headerSub = document.getElementById('hdr-subtitle');
  if(headerSub) { headerSub.textContent = endLabel ? 'מציג: ' + endLabel : ''; }

  if(el('card-val-all')) el('card-val-all').textContent = '' + Math.round(grandTotal).toLocaleString();
  if(el('card-chg-all')) {
    el('card-chg-all').textContent = grandPct === '—' ? '—' : grandPct + '% נמדד';
    el('card-chg-all').style.color = grandPct === '—' ? '#94a3b8' : '';
  }

  cats.forEach(cat => {
    const noPct = ['mezuman','chov','arbitrage','dira'];
    const total = Math.round(Math.abs(catTotals[cat])).toLocaleString();
    if(el('card-val-'+cat)) el('card-val-'+cat).textContent = total;
    if(el('sec-val-'+cat)) {
      el('sec-val-'+cat).textContent = total;
      if(cat==='chov') el('sec-val-'+cat).style.color='#ef4444';
    }
    if (noPct.includes(cat) || invViewMode === 'yael') {
      if(el('card-chg-'+cat)) { el('card-chg-'+cat).textContent = invViewMode === 'yael' ? '—' : ''; el('card-chg-'+cat).style.color = '#94a3b8'; }
      if(el('sec-pct-'+cat)) { el('sec-pct-'+cat).textContent=''; el('sec-pct-'+cat).className='cat-pct'; }
      return;
    }
    // v103.2: Column K-netted yield for category cards
    // Sum net return = Σ(endVal - startVal - colK_movements) over the window
    // Base = Σ startVal (only active funds)
    const excl = EXCLUDE_FROM_PCT[cat] || [];
    const activeFunds = Object.entries(FUNDS)
      .filter(([k,f]) => f.cat===cat && !excl.includes(k) && (f.data[endIdx]||0) > 0 && invFilter(f));
    const dynamicBase = activeFunds.reduce((s,[,f]) => s + (f.data[startIdx]||0), 0);
    if (dynamicBase === 0) return;
    // Compute net delta: subtract Column K movements accumulated over window
    const netDelta = activeFunds.reduce((s,[k,f]) => {
      const rawDelta = (f.data[endIdx]||0) - (f.data[startIdx]||0);
      // Sum Column K values over the window [startIdx+1 .. endIdx]
      var kMovements = 0;
      var colK = FUND_COL_K[k] || [];
      for (var _ki = startIdx + 1; _ki <= endIdx; _ki++) {
        var kv = (_ki < colK.length) ? colK[_ki] : null;
        if (typeof kv === 'number' && !isNaN(kv)) kMovements += kv;
      }
      return s + rawDelta - kMovements;
    }, 0);
    const pct = (netDelta / dynamicBase * 100).toFixed(1);
    const arrow = pct >= 0 ? '▲' : '▼';
    if(el('card-chg-'+cat)) el('card-chg-'+cat).textContent = arrow + ' ' + pct + '%';
    if(el('sec-pct-'+cat)) {
      el('sec-pct-'+cat).textContent = pct + '%';
      el('sec-pct-'+cat).className = 'cat-pct ' + (parseFloat(pct) >= 0 ? 'pos' : 'neg');
    }
    // YTD: Jan 2026 to endIdx — v103.2: Column K-netted
    const janIdx = LABELS.findIndex(l => l.includes('ינו') && l.includes('26'));
    if(el('sec-ytd-'+cat) && janIdx >= 0 && endIdx >= janIdx) {
      const excl2 = EXCLUDE_FROM_PCT[cat] || [];
      const ytdFunds = Object.entries(FUNDS)
        .filter(([k,f]) => f.cat===cat && !excl2.includes(k) && (f.data[endIdx]||0) > 0 && invFilter(f));
      const ytdStart = ytdFunds.reduce((s,[,f]) => s+(f.data[janIdx]||0), 0);
      if(ytdStart > 0) {
        const ytdNetDelta = ytdFunds.reduce((s,[k,f]) => {
          const rawD = (f.data[endIdx]||0) - (f.data[janIdx]||0);
          var km = 0; var colK = FUND_COL_K[k] || [];
          for (var _yi = janIdx + 1; _yi <= endIdx; _yi++) {
            var kv = (_yi < colK.length) ? colK[_yi] : null;
            if (typeof kv === 'number' && !isNaN(kv)) km += kv;
          }
          return s + rawD - km;
        }, 0);
        const ytd = (ytdNetDelta / ytdStart * 100).toFixed(1);
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
      const noticeFilter = invFundFilter(); // v96.5: הצג הערות רק לקרנות הרלוונטיות למבט הנוכחי
      Object.values(FUNDS).forEach(f => {
        if (f.cat !== currentView) return;
        if (!noticeFilter(f)) return;
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
        // v103.6: Column K netting for trailing window return
        var _retKMov = 0;
        Object.entries(FUNDS).forEach(function(e) {
          var k=e[0], f=e[1];
          if (f.cat !== viewCat || excl.includes(k) || !(f.data[endIdx] > 0)) return;
          var colK = FUND_COL_K[k] || [];
          for (var ki = startIdx+1; ki <= endIdx; ki++) {
            var kv = ki < colK.length ? colK[ki] : null;
            if (typeof kv === 'number' && !isNaN(kv)) _retKMov += kv;
          }
        });
        const retNet = (measuredEnd - measuredStart) - _retKMov;
        const ret = (retNet / measuredStart * 100).toFixed(1);
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
      // v103.4: Column K netting for YTD calc
      var _ytdKMov = 0;
      if (viewCat && viewCat !== 'all' && !currentFund) {
        const _excl = EXCLUDE_FROM_PCT[viewCat] || [];
        Object.entries(FUNDS).forEach(function(e) {
          var k=e[0], f=e[1];
          if (f.cat !== viewCat || _excl.includes(k) || !(f.data[endIdx2] > 0)) return;
          var colK = FUND_COL_K[k] || [];
          for (var ki = janIdx+1; ki <= endIdx2; ki++) {
            var kv = ki < colK.length ? colK[ki] : null;
            if (typeof kv === 'number' && !isNaN(kv)) _ytdKMov += kv;
          }
        });
      } else if (currentFund && FUNDS[currentFund]) {
        var _ck = FUND_COL_K[currentFund] || [];
        for (var ki = janIdx+1; ki <= endIdx2; ki++) {
          var kv2 = ki < _ck.length ? _ck[ki] : null;
          if (typeof kv2 === 'number' && !isNaN(kv2)) _ytdKMov += kv2;
        }
      }
      const ytdNet = (ytdEndVal - ytdStartVal) - _ytdKMov;
      const ytd = (ytdNet / ytdStartVal * 100).toFixed(1);
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

// v96.5: Empty State helpers for non-roee views
function showEmptyChart() {
  var ep = document.getElementById('chart-empty-msg');
  if (ep) ep.style.display = 'flex';
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.data.datasets[0].borderColor = '#94a3b8';
  chart.data.datasets[0].backgroundColor = makeGradient(ctx, '#94a3b8');
  chart.update();
  updateChartStats([], null);
  document.getElementById('activeLabel').style.setProperty('--active-color', '#94a3b8');
  document.getElementById('activeLabelText').textContent = CAT_NAMES.all;
}
function hideEmptyChart() {
  var ep = document.getElementById('chart-empty-msg');
  if (ep) ep.style.display = 'none';
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
    // v96.5: במבט יעל/משותף — אל תציג את גרף "סה"כ" כברירת מחדל
    if (invViewMode !== 'roee') {
      showEmptyChart();
    } else {
      updateChart(getFilteredAllTotals(), '#2563eb', CAT_NAMES.all);
    }
    // v98.4: הסתר Master-Detail בעת חזרה ל"כל"
    var _mdp = document.getElementById('inv-master-detail');
    if (_mdp) _mdp.style.display = 'none';
    invMDCurrentCat  = null;
    invMDCurrentFund = null;
  } else {
    hideEmptyChart();
    updateChart(CAT_CHART_TOTALS[cat] || CAT_TOTALS[cat], CAT_COLORS[cat], CAT_NAMES[cat]);
    // v98.4: הצג רשימת קרנות לקטגוריה שנבחרה
    invMDShowCat(cat);
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
    // v103.1: determine row label from Column K — scan any month for 'תלוש' keyword
    var _colKArr = FUND_COL_K[fundKey] || [];
    var _hasTalush = _colKArr.some(function(v) { return typeof v === 'string' && v.indexOf('תלוש') >= 0; });
    var _rowLabel = _hasTalush ? 'גידול בהון' : 'תשואה';
    const labelTd = document.createElement('td');
    labelTd.textContent = _rowLabel;
    deltaRow.appendChild(labelTd);

    // Delta cells for each month
    fund.data.forEach((v, i) => {
      const td = document.createElement('td');
      td.setAttribute('data-col', i);
      if (i < winStart || i > winStart + WINDOW - 1) td.style.display = 'none';

      if (i === 0 || v === null) {
        td.textContent = '—';
      } else {
        const prev = fund.data[i-1];
        if (prev === null || prev === 0) { td.textContent = '—'; }
        else {
          const delta = v - prev;
          const colKVal = (i < _colKArr.length) ? _colKArr[i] : null;
          const isTalush = (typeof colKVal === 'string' && colKVal.indexOf('תלוש') >= 0);
          // colKVal as number = deposit (+) or withdrawal (-) in K
          const isMovement = (typeof colKVal === 'number' && colKVal !== 0);

          if (isTalush) {
            // גידול בהון — absolute change only, no yield %
            const cls = delta > 0 ? 'dpos' : (delta < 0 ? 'dneg' : 'dzer');
            td.innerHTML = `<span class="${cls} dval">${delta > 0 ? '+' : ''}${Math.round(delta).toLocaleString()}</span>`;
          } else if (isMovement) {
            // v103.1: net yield after deposit/withdrawal
            // Net return = delta - movement (movement is already signed: + deposit, - withdrawal)
            const netDelta = delta - colKVal;
            const netPct = prev > 0 ? (netDelta / prev * 100).toFixed(1) : '0.0';
            const cls = parseFloat(netPct) >= 0 ? 'dpos' : 'dneg';
            const movAbs = Math.abs(Math.round(colKVal)).toLocaleString();
            const movLabel = colKVal < 0 ? 'משיכה' : 'הפקדה';
            td.innerHTML = `<span class="${cls}">${parseFloat(netPct) >= 0 ? '+' : ''}${netPct}%</span><br><span style="font-size:9px;color:#94a3b8">${movLabel}: ${movAbs}</span>`;
          } else {
            // normal yield %
            const pct = (delta / prev * 100).toFixed(1);
            const cls = delta > 0 ? 'dpos' : (delta < 0 ? 'dneg' : 'dzer');
            td.innerHTML = `<span class="${cls} dval">${delta > 0 ? '+' : ''}${pct}%</span>`;
          }
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

// ── Master-Detail: רמה 1 — הצג רשימת קרנות לקטגוריה (v98.4) ──
function invMDShowCat(catId) {
  invMDCurrentCat  = catId;
  invMDCurrentFund = null;

  var panel       = document.getElementById('inv-master-detail');
  var fundsRow    = document.getElementById('inv-md-funds-row');
  var catTitle    = document.getElementById('inv-md-cat-title');
  var detailWrap  = document.getElementById('inv-md-detail-wrap');
  var detailName  = document.getElementById('inv-md-detail-name');
  var detailTable = document.getElementById('inv-md-detail-table');
  if (!panel || !fundsRow) return;

  panel.style.display = 'block';
  if (catTitle) catTitle.textContent = (CAT_NAMES[catId] || catId) + ' — קרנות';

  var color  = CAT_COLORS[catId] || '#2563eb';
  var filter = invFundFilter();
  var funds  = Object.entries(FUNDS).filter(function(e) {
    return e[1].cat === catId && filter(e[1]);
  });

  if (!funds.length) {
    fundsRow.innerHTML = '<div style="color:#94a3b8;font-size:13px;padding:8px 0;direction:rtl;">לא נמצאו קרנות</div>';
    if (detailWrap) detailWrap.style.display = 'none';
    return;
  }

  // בנה כרטיסיות קרנות — הסתר קרנות ריקות (בפרט ביעל)
  var endIdx = Math.min(winStart + WINDOW - 1, LABELS.length - 1);
  var html = '';
  var activeFunds = [];
  funds.forEach(function(entry) {
    var key  = entry[0], fund = entry[1];
    var ff   = ffFundData(fund.data);
    var val  = ff[endIdx];
    // הצג רק קרנות עם נתונים בחלון הנוכחי
    var hasAnyData = fund.data.some(function(v){ return v !== null && v > 0; });
    if (!hasAnyData) return;
    activeFunds.push(entry);
    var fc   = (typeof FUND_COLORS !== 'undefined' && FUND_COLORS[key]) ? FUND_COLORS[key] : color;
    var disp = (val !== null && val !== undefined && val > 0) ? Math.round(val).toLocaleString() : '—';
    var tags = '';
    if (fund.transferred) tags += ' <span class="note note-equity-sold">הועבר</span>';
    if (fund.owner === 'yael') tags += ' <span class="note note-yael">יעל</span>';
    html += '<div class="inv-md-fund-card" id="invmd-fc-' + key + '" style="--fc:' + fc + ';">';
    html += '<div class="mdf-name">' + fund.name + tags + '</div>';
    html += '<div class="mdf-val">' + disp + '</div>';
    html += '</div>';
  });
  fundsRow.innerHTML = html;

  activeFunds.forEach(function(entry) {
    var key = entry[0];
    var el  = document.getElementById('invmd-fc-' + key);
    if (el) el.addEventListener('click', function() { invMDSelectFund(key); });
  });

  // הצג טבלה מצטברת של הקטגוריה — בדיוק כמו טבלת קרן בודדת
  if (detailWrap && detailTable) {
    if (detailName) {
      detailName.innerHTML = (CAT_NAMES[catId] || catId) +
        ' <span style="font-size:10px;color:#94a3b8;font-weight:400;">(באלפי ש״ח)</span>';
      detailName.style.color = color;
    }
    detailTable.innerHTML = buildCatAggTable(catId);
    detailWrap.style.display = 'block';
  }
}

// ── Master-Detail: רמה 2 — לחיצה על קרן ספציפית (v98.4) ──
function invMDSelectFund(fundKey) {
  invMDCurrentFund = fundKey;
  var fund = FUNDS[fundKey];
  if (!fund) return;

  var fc = (typeof FUND_COLORS !== 'undefined' && FUND_COLORS[fundKey])
    ? FUND_COLORS[fundKey] : (CAT_COLORS[fund.cat] || '#2563eb');

  // הדגשת הכרטיסייה הנבחרת
  document.querySelectorAll('.inv-md-fund-card').forEach(function(el) { el.classList.remove('md-active'); });
  var card = document.getElementById('invmd-fc-' + fundKey);
  if (card) card.classList.add('md-active');

  // פאנל פירוט
  var detailWrap  = document.getElementById('inv-md-detail-wrap');
  var detailName  = document.getElementById('inv-md-detail-name');
  var detailTable = document.getElementById('inv-md-detail-table');
  if (!detailWrap || !detailTable) return;

  detailWrap.style.display = 'block';
  if (detailName) {
    detailName.innerHTML = fund.name + ' <span style="font-size:10px;color:#94a3b8;font-weight:400;">(באלפי ש״ח)</span>';
    detailName.style.color = fc;
  }

  // בניית טבלת פירוט — חלון winStart/WINDOW
  var ff     = ffFundData(fund.data);
  var winEnd = Math.min(winStart + WINDOW, LABELS.length);

  // רוחב עמודה ראשונה = אזור Y-axis בגרף (לצורך יישור מתחת לגרף)
  var yAxisW = (chart && chart.chartArea) ? Math.ceil(chart.chartArea.left) : 60;
  var nDataCols = winEnd - winStart;
  var colHtml = '<colgroup><col style="width:' + yAxisW + 'px;">';
  for (var ci = 0; ci < nDataCols; ci++) colHtml += '<col style="width:calc((100% - ' + yAxisW + 'px) / ' + nDataCols + ');">';
  colHtml += '</colgroup>';

  // תא סגנון: padding מינימלי לעמודות נתונים צרות
  var tdStyle    = 'padding:5px 4px;text-align:center;overflow:visible;font-size:11px;';
  // עמודה ראשונה: רוחב קבוע, overflow:hidden כדי לא לשבור table-layout:fixed
  var tdLblStyle = 'padding:5px 6px;text-align:right;direction:rtl;white-space:nowrap;overflow:hidden;font-size:11px;width:' + yAxisW + 'px;max-width:' + yAxisW + 'px;';

  var h = '<table style="direction:ltr;table-layout:fixed;width:100%;">' + colHtml + '<thead><tr>';
  h += '<th style="width:' + yAxisW + 'px;max-width:' + yAxisW + 'px;text-align:right;direction:rtl;padding:5px 6px;overflow:hidden;"></th>';
  for (var i = winStart; i < winEnd; i++) h += '<th style="padding:4px 2px;font-size:11px;text-align:center;">' + LABELS[i] + '</th>';
  h += '</tr></thead><tbody>';

  // שורת ערך + % שינוי inline מתחת (קרן בודדת — קומפקטי) v103.3: Column K netting
  h += '<tr><td style="' + tdLblStyle + 'font-weight:600;color:#64748b;">ערך</td>';
  var _mdColK = FUND_COL_K[fundKey] || [];
  for (var i = winStart; i < winEnd; i++) {
    var v    = ff[i];
    var prev = (i > 0) ? ff[i - 1] : null;
    if (v > 0) {
      var delta    = (prev !== null && prev > 0) ? (v - prev) : null;
      var kv       = (i < _mdColK.length) ? _mdColK[i] : null;
      var isTlsh   = (typeof kv === 'string' && kv.indexOf('תלוש') >= 0);
      var isMov    = (typeof kv === 'number' && kv !== 0);
      var pctHtml  = '';
      if (delta !== null && prev > 0) {
        if (isTlsh) {
          var clr2 = delta > 0 ? '#16a34a' : delta < 0 ? '#dc2626' : '#94a3b8';
          pctHtml = '<br><span style="font-size:9px;display:inline-block;color:' + clr2 + ';">' + (delta > 0 ? '+' : '') + Math.round(delta).toLocaleString() + '</span>';
        } else if (isMov) {
          var netD = delta - kv;
          var pct2 = (netD / prev * 100).toFixed(1);
          var clr2 = parseFloat(pct2) >= 0 ? '#16a34a' : '#dc2626';
          var mAbs = Math.abs(Math.round(kv)).toLocaleString();
          var mLbl = kv < 0 ? 'משיכה' : 'הפקדה';
          pctHtml = '<br><span style="font-size:9px;display:inline-block;color:' + clr2 + ';">' + (parseFloat(pct2) >= 0 ? '+' : '') + pct2 + '%</span>' +
                    '<br><span style="font-size:8px;color:#94a3b8">' + mLbl + ': ' + mAbs + '</span>';
        } else {
          var pct2 = (delta / prev * 100).toFixed(1);
          var clr2 = delta > 0 ? '#16a34a' : delta < 0 ? '#dc2626' : '#94a3b8';
          pctHtml = '<br><span style="font-size:9px;display:inline-block;color:' + clr2 + ';">' + (delta > 0 ? '+' : '') + pct2 + '%</span>';
        }
      }
      h += '<td class="val" style="' + tdStyle + 'color:' + fc + ';">' + Math.round(v).toLocaleString() + pctHtml + '</td>';
    } else {
      h += '<td class="dash" style="' + tdStyle + '">—</td>';
    }
  }
  h += '</tr>';

  h += '</tbody></table>';
  detailTable.innerHTML = h;

  // גלילה עדינה לפאנל
  setTimeout(function() { detailWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 50);

  // עדכון גרף ראשי לקרן שנבחרה
  selectFund(fundKey, fc);
}

// ── Master-Detail: סגירת פאנל פירוט (v98.4) ──
function invMDCloseDetail() {
  var wasFund = invMDCurrentFund;
  invMDCurrentFund = null;
  document.querySelectorAll('.inv-md-fund-card').forEach(function(el) { el.classList.remove('md-active'); });
  if (wasFund && invMDCurrentCat) {
    // חזרה מקרן → הצג טבלת קטגוריה
    selectView(invMDCurrentCat);
  } else {
    // סגירת תצוגת קטגוריה → חזרה ל"הכל"
    navCloseAll();
  }
}

function toggleCat(id) {
  const body = document.getElementById('body-' + id);
  const chev = document.getElementById('chev-' + id);
  body.classList.toggle('open');
  chev.classList.toggle('open');
}

function saveToLocalStorage() {
  // v102.5: Stateless — no data persistence between sessions
}

function loadFromLocalStorage() {
  // v102.5: Stateless — always start fresh
  return false;
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
  // v102.5: Stateless — notes come from Excel only
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
    // v97.2: owner column for notes filtering
    const iOwner  = headers.findIndex(function(h){ return h && (String(h).includes('שייכות ההערה') || String(h) === 'שייכות'); });

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
        linkLabel: r[iLink] ? 'מסמך רפרנס' : null,
        owner: iOwner >= 0 ? (r[iOwner] ? String(r[iOwner]).trim() : '') : '' // v97.2: 'רועי'/'יעל'/''
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
  // v102.5: Stateless — notes come from Excel only
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

  // v97.2: filter by current view mode
  const filtered = NOTES.filter(function(n) {
    if (invViewMode === 'all') return true;
    if (invViewMode === 'yael') return n.owner === 'יעל';
    // roee: show notes with owner='רועי' OR owner='' (legacy notes without owner field)
    return !n.owner || n.owner === 'רועי';
  });

  if (filtered.length === 0) {
    list.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">אין הערות להצגה</p>';
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
  filtered.forEach((n, i) => {
    const color = NOTE_TYPE_COLOR[n.type] || '#64748b';
    const bg = i % 2 === 0 ? '#f9fafb' : 'white';
    const gross = n.fields.find(f => f.label === 'סכום כולל בפוליסה');
    const tax   = n.fields.find(f => f.label === 'מס רווח הון');
    const net   = n.fields.find(f => f.label === 'תמורה נטו לחשבון') || n.fields.find(f => f.label === 'סכום');
    const linkHtml = n.link
      ? '<a href="' + n.link + '" target="_blank" style="color:#0891b2; text-decoration:none; font-size:14px; font-weight:600;">מסמך ↗</a>'
      : '';
    const taxVal = tax ? '<span style="color:#dc2626;">-' + tax.value + '</span>' : '—';
    // v97.3: in shared view, show a "יעל" badge on notes that belong to Yael
    const ownerBadge = (invViewMode === 'all' && n.owner === 'יעל')
      ? ' <span style="background:#fce7f3;color:#be185d;padding:1px 6px;border-radius:20px;font-size:10px;font-weight:700;">יעל</span>'
      : '';

    tableHtml += '<tr style="background:' + bg + '; border-bottom:1px solid #e5e7eb;">' +
      '<td style="padding:10px 16px; text-align:right; white-space:nowrap;">' + linkHtml + '</td>' +
      '<td style="padding:10px 16px; text-align:right; font-weight:700; white-space:nowrap;">' + (net ? net.value : '—') + '</td>' +
      '<td style="padding:10px 16px; text-align:right; white-space:nowrap;">' + taxVal + '</td>' +
      '<td style="padding:10px 16px; text-align:right; white-space:nowrap;">' + (gross ? gross.value : '—') + '</td>' +
      '<td style="padding:10px 16px; font-weight:600; white-space:nowrap;">' + n.title + ownerBadge + '</td>' +
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

// v102.5: Stateless — no startup data load from localStorage
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
    var inc = rv('salary') + rv('rent_income'), exp = rv('total_exp'); // v43: חישוב דינמי
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

// ===== PENSION CHAT v66.0 =====
var pnsChatOpen = false;
var pnsChatHistory = [];

function buildPnsContext() {
  if (!PENSION_ASSETS || PENSION_ASSETS.length === 0) return 'no pension data';
  var active = pensionActiveAssets();
  var totalAccum   = PENSION_ASSETS.reduce(function(s,a){ return s+(a.accumulation||0); }, 0);
  var totalPension = active.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
  var lines = ['נכסי פנסיה וביטוח:'];
  PENSION_ASSETS.forEach(function(a) {
    lines.push('- '+(a.provider||'?')+' | '+(a.type||'?')+' | הון: '+(a.accumulation||0)+' | קצבה: '+(a.expectedPension||0));
  });
  lines.push('סה"כ הון צבור: '+Math.round(totalAccum));
  lines.push('קצבה ברוטו: '+Math.round(totalPension)+' ₪/חודש');
  lines.push('קצבה נטו (אחרי מס): '+Math.round(pnsNetMonthly)+' ₪/חודש');
  return lines.join('\n');
}

function togglePnsChat() {
  pnsChatOpen = !pnsChatOpen;
  var cp = document.getElementById('pns-cp');
  if (!cp) return;
  cp.style.display = pnsChatOpen ? 'flex' : 'none';
  if (pnsChatOpen) {
    var cm = document.getElementById('pns-cm');
    if (cm && cm.children.length === 0) {
      addPnsMsg('שלום! שאל אותי על הפנסיה וביטוחים שלך 🏦', false);
    }
    setTimeout(function() { var i = document.getElementById('pns-ci'); if(i) i.focus(); }, 100);
  }
}

function addPnsMsg(txt, isUser) {
  var cm = document.getElementById('pns-cm');
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

async function sendPnsChat() {
  var ci = document.getElementById('pns-ci');
  if (!ci) return;
  var q = ci.value.trim();
  if (!q) return;
  ci.value = '';
  addPnsMsg(q, true);
  pnsChatHistory.push({role: 'user', content: q});
  var thinking = addPnsMsg('חושב...', false);
  try {
    var sys = 'אתה עוזר פיננסי המנתח נתוני פנסיה וביטוחים. ענה בעברית בתמציתיות.\n' + buildPnsContext();
    var res = await fetch('https://holy-poetry-claude-proxy.roy-benyamini.workers.dev', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1200, system:sys, messages:pnsChatHistory.slice(-10)})
    });
    var data = await res.json();
    thinking.remove();
    var answer = '';
    if (data.content && data.content.length > 0) {
      answer = data.content.filter(function(b){ return b.type === 'text'; }).map(function(b){ return b.text; }).join('\n');
    } else if (data.error) {
      answer = 'שגיאה: ' + (data.error.message || '');
    }
    if (!answer) answer = 'תגובה ריקה. נסה שוב.';
    pnsChatHistory.push({role:'assistant', content:answer});
    addPnsMsg(answer, false);
  } catch(e) {
    thinking.remove();
    addPnsMsg('שגיאה: ' + e.message, false);
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
    // v41.0: נוספו U+200E/200F (LTR/RTL marks) + U+202A-202F (directional formatting) שExcel מוסיף לעברית
    function normalizeForCompare(s) {
      return s
        .replace(/[\u00A0\uFEFF\u200B\u200C\u200D\u200E\u200F\u2060\u180E\u202A\u202B\u202C\u202D\u202E\u202F]/g, ' ')  // invisible/directional → רווח
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
      // v43.0: total_income הוסר — מחושב דינמית מ-salary + rent_income (לא קיים באקסל)
      total_exp:    ['סה"כ הוצאות', 'סה״כ הוצאות', 'סה"כ הוצאות שקלי', 'סה״כ הוצאות שקלי'],
      profit_loss:  ['רווח / הפסד', 'רווח/ הפסד', 'רווח /הפסד', 'רווח/הפסד'],
      salary:       ['משכורת שקלית', 'משכורת שקל', 'הכנסה ממשכורת'],  // v41: שמות חדשים קודם
      rent_income:  ['שכר דירה', 'שכירות', 'שכ"ד', 'שכ״ד'],
      other_income: ['הכנסות שונות', 'הכנסה אחרת'],
      buffer:       ['פריטה מ-buffer', 'פריטה מ buffer', 'פריטה'],
      visa:         ['חיוב ויזה', 'ויזה', 'כרטיס אשראי'],
      cash_exp:     ['הוצאות מזומן'],
      loans:        ['הלוואות', 'החזר הלוואות', 'החזר הלוואה'],
      yotam:        ['יותם'],
      other_exp:    ['הוצאות שונות 1', 'הוצאות שונות', 'הוצאות חריגות'],
      other_exp_2:  ['הוצאות שונות 2'],
      renovation:   ['הוצאות שיפוץ', 'שיפוץ'],
      net_cashflow: ['תזרים שקלי נטו', 'נטו שוטף', 'תזרים נטו'],
      salary_usd:   ['משכורת $ (בשקלים)', 'משכורת $', 'משכורת דולר', 'משכורת דולרית'],
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

    // v41.0: PRIORITY PASS — EXACT MATCH לשמות האקסל החדשים לפני הסריקה הכללית
    // מונע false-match של שם ישן בשורה אחרת → גורם לנתונים שגויים
    var PRIORITY_LABELS = {
      salary:      ['משכורת שקלית', 'משכורת שקל'],
      salary_usd:  ['משכורת דולרית'],
      rent_income: ['שכר דירה'],
    };
    // v42.0: aggressive label cleaner — מסיר כל תו שאינו ASCII מודפס / עברית
    function aggressiveClean(raw) {
      return String(raw)
        .replace(/[\u00A0\uFEFF\t\r\n]+/g, ' ')
        .replace(/[^\x20-\x7E\u0590-\u05FF]/g, '')  // הסר כל תו לא-ASCII לא-עברי
        .replace(/\s+/g, ' ')
        .trim();
    }

    var mappedKeys = {};
    colsToScan.forEach(function(lc) {
      for (var nri = 0; nri < nonEmptyRows.length; nri++) {
        var sr = nonEmptyRows[nri];
        var lbl = cellVal(ws, sr, lc);
        if (!lbl) continue;
        var lblN = normalizeForCompare(aggressiveClean(lbl).toLowerCase());
        for (var pkey in PRIORITY_LABELS) {
          if (mappedKeys[pkey]) continue;
          if (PRIORITY_LABELS[pkey].some(function(kw) {
            return lblN === normalizeForCompare(aggressiveClean(kw).toLowerCase());  // EXACT match
          })) {
            Object.keys(ROW_MAP).forEach(function(k){ if (ROW_MAP[k] === pkey) delete ROW_MAP[k]; });
            ROW_MAP[sr] = pkey;
            mappedKeys[pkey] = true;
            console.log('[v42 PRIORITY] mapped:', pkey, '→ row', sr, '| label:', aggressiveClean(lbl));
            break;
          }
        }
      }
    });

    // מעבר 1: שאר המפתחות — First Match Only (Substring + aggressive clean)
    colsToScan.forEach(function(lc) {
      for (var nri = 0; nri < nonEmptyRows.length; nri++) {
        var sr = nonEmptyRows[nri];
        var lbl = cellVal(ws, sr, lc);
        if (!lbl) continue;
        var lblTrimmed = aggressiveClean(lbl);  // v42: aggressive clean
        if (!lblTrimmed) continue;
        var ls = normalizeForCompare(lblTrimmed.toLowerCase());
        for (var lkey in KEY_LABELS) {
          if (mappedKeys[lkey]) continue;
          if (KEY_LABELS[lkey].length === 0) continue;
          // שורות ברזל מטופלות במעבר 2 — דלג כאן
          if (lkey === 'total_exp' || lkey === 'profit_loss') continue; // v43: total_income הוסר מ-IRON
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
    var IRON_KEYS = ['total_exp', 'profit_loss']; // v43.0: total_income הוסר — מחושב דינמית
    IRON_KEYS.forEach(function(ikey) {
      var lastMatchRow = null;
      colsToScan.forEach(function(lc) {
        for (var nri = 0; nri < nonEmptyRows.length; nri++) {
          var sr = nonEmptyRows[nri];
          var lbl = cellVal(ws, sr, lc);
          if (!lbl) continue;
          var lblTrimmed = aggressiveClean(lbl);  // v42.0: aggressiveClean כמו Pass 1
          if (!lblTrimmed) continue;
          var ls = normalizeForCompare(lblTrimmed.toLowerCase());
          var matched = KEY_LABELS[ikey].some(function(kw) {
            return ls === normalizeForCompare(aggressiveClean(kw).toLowerCase()); // חייב === בלבד
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

    // v41.0: לוג סיכום מיפוי — הדפסה של כל ROW_MAP לדיאגנוסטיקה
    console.log('[v42 ROW_MAP FINAL]', JSON.stringify(ROW_MAP));
    ['salary','rent_income','salary_usd','total_exp'].forEach(function(k) { // v43: total_income הוסר
      var found = Object.keys(ROW_MAP).some(function(r){ return ROW_MAP[r] === k; });
      if (!found) console.warn('[v43 MISSING KEY]', k, '— לא נמצא בגיליון! מפתח חסר.');
    });

    // v42.0: INDEX FALLBACK — אם המיפוי הדינמי נכשל, השתמש בשורות קבועות יחסית ל-HEADER_ROW
    // salary=HEADER_ROW+1, rent_income=HEADER_ROW+2, total_exp=HEADER_ROW+7
    var INDEX_FALLBACKS = {
      salary:      HEADER_ROW + 1,
      rent_income: HEADER_ROW + 2,
      total_exp:   HEADER_ROW + 7
    };
    Object.keys(INDEX_FALLBACKS).forEach(function(fbKey) {
      var alreadyMapped = Object.keys(ROW_MAP).some(function(r){ return ROW_MAP[r] === fbKey; });
      if (!alreadyMapped) {
        var fbRow = INDEX_FALLBACKS[fbKey];
        // וודא שהשורה לא תפוסה ע"י מפתח אחר
        if (ROW_MAP[fbRow] && ROW_MAP[fbRow] !== fbKey) {
          console.warn('[v42 INDEX FALLBACK] שורה', fbRow, 'תפוסה ע"י', ROW_MAP[fbRow], '— לא ממפה', fbKey);
        } else {
          ROW_MAP[fbRow] = fbKey;
          var fbLabel = cellVal(ws, fbRow, colsToScan[0]);
          console.log('[v42 INDEX FALLBACK] ממפה', fbKey, '→ שורה', fbRow, '| תווית:', fbLabel ? aggressiveClean(String(fbLabel)) : '(ריק)');
        }
      }
    });

    // 4. קרא נתוני חודשים
    // v20.0: targetCol = בדיוק העמודה שבה נמצאה הכותרת. ללא חישובים, ללא הזזות.
    var sheetResult = [];
    var seenMonths = {};
    for (var col = 0; col <= maxCol; col++) {
      var colHeaderRaw = cellVal(ws, HEADER_ROW, col);
      // v98.5: Soft matching — מחיל את אותה שרשרת ניקוי שמשמשת לתוויות שורה
      // (aggressiveClean + normalizeForCompare) כדי לטפל בתווי Unicode בלתי נראים
      // שExcel מוסיף לתאי טקסט עבריים (RTL marks, non-breaking spaces וכו')
      if (colHeaderRaw != null) {
        var colHeaderNorm = normalizeForCompare(aggressiveClean(String(colHeaderRaw))).toLowerCase();
        if (colHeaderNorm.indexOf('סיכומים') >= 0 || colHeaderNorm.indexOf('summary') >= 0 || colHeaderNorm.indexOf('סיכום') >= 0) {
          // v47.0: סריקת תוויות ישירה לעמודת סיכומים — לא תלויה ב-ROW_MAP
          // v48.0: Data Locking — משיכה ישירה מעמודת סיכומים לפי תוויות מדויקות
          var FC_LABELS = {
            salary:            ['משכורת שקלית', 'משכורת שקל', 'הכנסה ממשכורת'],
            rent_income:       ['שכר דירה', 'שכירות'],
            visa:              ['חיוב ויזה', 'ויזה', 'כרטיס אשראי', 'חיוב ויזה מחודש קודם'],
            cash_exp:          ['הוצאות מזומן', 'מזומן'],
            loans:             ['הלוואות', 'החזר הלוואות', 'החזר הלוואה'],
            yotam:             ['יותם', 'הוצאות יותם'],
            yotam_usd:         ['יותם $', 'הוצאות יותם $', 'יותם דולרי', 'הוצ יותם $'],
            other_exp:         ['הוצאות שונות 1', 'הוצאות שונות', 'הוצאות חריגות'],
            net_cashflow:      ['תזרים שקלי נטו', 'תזרים נטו'],
            cashflow_total:    ['תזרים שוטף', 'נטו שוטף', '∆ תזרים שוטף', 'Δ תזרים שוטף'],
            profit_loss:       ['רווח / הפסד', 'רווח/ הפסד', 'רווח /הפסד', 'רווח/הפסד'],
          };
          // v49.0: last-match לשורות סיכום (net_cashflow, cashflow_total, profit_loss)
          // שורות אלו עשויות להופיע מספר פעמים — הפגישה האחרונה היא הסיכום האמיתי
          var FC_LAST_KEYS = ['net_cashflow', 'cashflow_total', 'profit_loss'];
          var fcData = {};
          var fcLastMatch = {}; // אחסן last match לכל LAST_KEY
          colsToScan.forEach(function(lc) {
            for (var nri = 0; nri < nonEmptyRows.length; nri++) {
              var sr = nonEmptyRows[nri];
              var lbl = cellVal(ws, sr, lc);
              if (!lbl) continue;
              var lblN = normalizeForCompare(aggressiveClean(String(lbl)).toLowerCase());
              for (var fkey in FC_LABELS) {
                var isLast = FC_LAST_KEYS.indexOf(fkey) >= 0;
                if (!isLast && fcData[fkey] !== undefined) continue; // first-match לשאר
                if (FC_LABELS[fkey].some(function(kw) {
                  var nkw = normalizeForCompare(aggressiveClean(kw).toLowerCase());
                  // v54: LAST_KEYS — exact match בלבד; שאר — substring (תומך בשמות ארוכים כמו 'חיוב ויזה מחודש קודם')
                  return isLast ? (lblN === nkw) : (lblN.indexOf(nkw) >= 0);
                })) {
                  var fval = cellVal(ws, sr, col);
                  var fnum = null;
                  if (fval !== null && fval !== undefined) {
                    // v98.5: הוסף trim לפני parseFloat — מנקה רווחי Unicode שנשארו אחרי aggressiveClean
                    var fp = typeof fval === 'number' ? fval : parseFloat(String(fval).replace(/,/g, '').trim());
                    if (!isNaN(fp)) fnum = Math.round(fp * 10) / 10;
                  }
                  if (isLast) {
                    fcLastMatch[fkey] = {row: sr, val: fnum};
                  } else {
                    fcData[fkey] = fnum;
                  }
                  console.log('[v49 FORECAST' + (isLast?' LAST':'') + ']', fkey, '→ row', sr, '| val:', fnum);
                }
              }
            }
          });
          // החל last-match על שורות הסיכום
          FC_LAST_KEYS.forEach(function(k) {
            if (fcLastMatch[k]) fcData[k] = fcLastMatch[k].val;
          });
          // v52.0: שמור תחזית לפי שנת הגיליון — לא מדרסה בין שנים
          CF_FORECAST_BY_YEAR[sheetYear] = fcData;
          console.log('[v52 FORECAST] שמור לשנה', sheetYear, '| מפתחות:', Object.keys(fcData).join(', '));
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
      // v102.5: Stateless — no localStorage cleanup needed; reset runtime state only
      CF_DATA = [];
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, {type:'array', cellDates:true});
      // בדיקת גיליון פנסיה לפי תוכן תאים — עדיפות ראשונה (v60.0)
      var pnsSheetName = detectPensionSheet(wb);
      if (pnsSheetName) {
        var pnsAssets = pensionParseWorkbook(wb, pnsSheetName);
        if (pnsAssets && pnsAssets.length > 0) {
          PENSION_ASSETS = pnsAssets;
          pensionSaveToStorage();
          if (status) { status.textContent = '✅ עודכנו נתוני פנסיה – '+pnsAssets.length+' פוליסות'; setTimeout(function(){ status.textContent=''; }, 5000); }
          // אם הטאב פנסיה פעיל — רנדר מחדש; אחרת — אפס כדי לאלץ init
          var activePanel = document.querySelector('.tab-panel.active');
          if (activePanel && activePanel.id === 'tab-pension') {
            pensionRender();
          } else {
            pensionInited = false;
          }
          // v102.5: עדכן סימולטור עם נתוני פנסיה מהקובץ החדש
          if (simInited) simRefresh();
        } else {
          if (status) { status.textContent = '⚠️ לא נמצאו נתוני פנסיה בגיליון'; setTimeout(function(){ status.textContent=''; }, 5000); }
        }
        input.value = '';
        return;
      }

      var cfKey = 'שוטף חדשי'.normalize('NFC');
      var isCF = wb.SheetNames.some(function(n){ return n.normalize('NFC').indexOf(cfKey) >= 0; });
      if (isCF) {
        var newData = cfParseWorkbook(wb);
        if (newData.length > 0) {
          CF_DATA = newData;
          CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(newData); // v19.0: THE CLOCK RULE
          CF_SELECTED_MONTH_ID = null; // איפוס בחירה ידנית בטעינת קובץ חדש
          var _lastM = CF_DATA[cfGetLastRealMonth ? cfGetLastRealMonth() : CF_DATA.length - 1];
          var _logInc = _lastM ? Math.round(cfCalcIncome(_lastM.rows)) : 0; // v43: חישוב דינמי
          var _logExp = _lastM && _lastM.rows.total_exp ? (_lastM.rows.total_exp.val || 0) : 0;
          console.log('!!! V58.0 - USD Yotam Forecast Card !!!');
          console.log('[Dashboard v43.0] | חודשים:', newData.length, '| נוכחי:', CF_CURRENT_MONTH_ID, '| הכנסות:', _logInc, '| הוצאות:', _logExp);
          // v42.0: console.table — הדפסת שורות החודש הנוכחי לדיאגנוסטיקה
          var _diagIdx = cfGetLastRealMonth ? cfGetLastRealMonth() : CF_DATA.length - 1;
          var _diagM = CF_DATA[_diagIdx];
          if (_diagM && _diagM.rows) {
            console.log('[v42 DIAG] חודש:', _diagM.label);
            var _tableRows = {};
            Object.keys(_diagM.rows).forEach(function(k) { _tableRows[k] = _diagM.rows[k]; });
            console.table(_tableRows);
          }
          // תמיד מאלץ רינדור מחדש — גם אם הטאב לא פעיל
          cfInited = false;
          var cfPanel = document.getElementById('tab-cashflow');
          if (cfPanel) {
            // הצג את טאב התזרים ורנדר
            switchTab('cashflow');
          }
          // v102.5: עדכן סימולטור עם נתוני שכר/הוצאות מהקובץ החדש
          if (simInited) simRefresh();
          cfSandboxInitDefaults(); // v103.4: set default date to next future month
          if(status) {
            var lastM = newData[newData.length - 1];
            var inc = Math.round(cfCalcIncome(lastM.rows)); // v43: חישוב דינמי
            var exp = lastM.rows.total_exp ? (lastM.rows.total_exp.val || 0) : 0;
            status.textContent = '✅ עודכנו נתוני תזרים – ' + newData.length + ' חודשים | ' + lastM.label + ': הכנסות ' + Math.round(inc) + ', הוצאות ' + Math.round(exp);
            setTimeout(function(){status.textContent='';}, 6000);
          }
        } else {
          // פיענוח נכשל — נקה נתונים ישנים כדי לא להציג mock
          CF_DATA = [];
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
          var sheetList = wb.SheetNames.slice(0,5).join(', ');
          if(status) { status.textContent = '❌ קובץ לא זוהה – גיליונות: ' + sheetList; setTimeout(function(){status.textContent='';},6000); }
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
        // יעל — יש לעדכן שמות עמודות לפי קובץ האקסל בפועל
        'קה"ש יעל': 'INV_SH_YAEL',
        'ק"הש יעל': 'INV_SH_YAEL',
        'גמל יעל': 'INV_GEMEL_YAEL',
        'גמל להשקעה יעל': 'INV_GEMEL_INV_YAEL',
        'פוליסת חיסכון יעל': 'INV_POLICY_YAEL',
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
        'INV_SH_YAEL':       'יעלקהש',
        'INV_GEMEL_YAEL':    'יעלגמל',
        'INV_GEMEL_INV_YAEL':'יעלגמלהשקעה',
        'INV_POLICY_YAEL':   'יעלפוליסה',
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

      // v95.1 / v100.7: Yael individual fund rows via שייכות column
      function normCell(v) {
        return String(v||'').replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\xa0]/g,'').trim();
      }

      // Map Excel liquidity text → internal code (Yael-only)
      function parseLiqCode(str) {
        var s = normCell(str).toLowerCase();
        if (s.includes('קצבה') || s.includes('pension') || s.includes('פנסיה')) return 'pension';
        if (s.includes('64') || s.includes('פרישה') || s.includes('גיל')) return 'age64';
        if (s.includes('נזיל') || s.includes('now') || s.includes('מיידי')) return 'now';
        return null;
      }

      // Generate a stable FUNDS key from fund name (Yael dynamic funds use prefix 'yd_')
      function yaelKey(fundName, cat) {
        var slug = normCell(fundName).replace(/\s+/g,'_').replace(/['"״׳]/g,'').slice(0, 25);
        return 'yd_' + cat + '_' + slug;
      }

      // v100.8: Returns INDIVIDUAL rows — one per Excel row — instead of aggregating
      function parseYaelFromSheet(rows) {
        var ownerColIdx = -1, nameColIdx = -1, liqColIdx = -1;

        // --- Strategy A: find header row (broad matching) ---
        for (var ri = 0; ri < Math.min(rows.length, 15); ri++) {
          var hrow = rows[ri];
          if (!Array.isArray(hrow)) continue;
          var found = false;
          for (var ci = 0; ci < hrow.length; ci++) {
            var cell = normCell(hrow[ci]);
            if (cell.includes('שייכות') || cell.includes('בעלות') || cell.includes('owner')) { ownerColIdx = ci; found = true; }
            if (cell.includes('שם') && !cell.includes('שייכות')) nameColIdx = ci; // any column with "שם"
            if (cell.includes('נזיל') || cell.includes('נזילות') || cell.includes('liquidity')) liqColIdx = ci;
          }
          if (found) break;
        }

        // --- Strategy B: auto-detect owner column by "יעל" frequency ---
        if (ownerColIdx < 0) {
          var hits = {};
          for (var ri2 = 0; ri2 < rows.length; ri2++) {
            var r2 = rows[ri2];
            if (!Array.isArray(r2)) continue;
            for (var ci2 = 1; ci2 <= Math.min(r2.length - 1, 20); ci2++) {
              if (normCell(r2[ci2]) === 'יעל') hits[ci2] = (hits[ci2]||0) + 1;
            }
          }
          var bestCol = -1, bestCnt = 0;
          Object.keys(hits).forEach(function(c) {
            if (hits[c] > bestCnt) { bestCnt = hits[c]; bestCol = parseInt(c); }
          });
          if (bestCol >= 0) ownerColIdx = bestCol;
        }

        if (ownerColIdx < 0) return null;

        // If still no name column: default to col 0 (same as ANCHOR_MAP — asset name is always first)
        if (nameColIdx < 0) nameColIdx = 0;
        // If still no type column: scan all text columns for category keywords
        // (handled per-row below if typeColIdx is -1)

        var yaelRows = []; // one object per Excel row

        for (var ri3 = 0; ri3 < rows.length; ri3++) {
          var row = rows[ri3];
          if (!Array.isArray(row) || row.length <= ownerColIdx) continue;
          if (normCell(row[ownerColIdx]) !== 'יעל') continue;

          // Extract value: rightmost number, skip text-likely columns
          var val = 0;
          for (var vc = row.length - 1; vc >= 1; vc--) {
            if (vc === ownerColIdx || vc === liqColIdx || vc === nameColIdx) continue;
            if (typeof row[vc] === 'number' && row[vc] > 0) { val = row[vc]; break; }
          }
          if (val <= 0) continue;

          // Determine category: scan all text cells in this row
          var cat = null;
          for (var sc = 0; sc < row.length; sc++) {
            if (sc === ownerColIdx || sc === liqColIdx || typeof row[sc] !== 'string') continue;
            var s = normCell(row[sc]);
            if (s.includes('השתלמות') || s.includes('ק"הש') || s.includes("קה'ש") || (s.includes('קה') && !s.includes('גמל'))) {
              cat = 'hishtalmut'; break;
            }
            if (s.includes('גמל להשקעה') || s.includes('גמל-להשקעה')) { cat = 'gemel_invest'; break; }
            if (s.includes('גמל')) { cat = 'gemel'; break; }
            if (s.includes('פוליסה') || s.includes('חיסכון') || s.includes('ביטוח') || s.includes('מגוון')) { cat = 'harel'; break; }
          }
          if (!cat) continue;

          // Fund name: use nameCol (col 0 by default)
          var fundName = row[nameColIdx] ? normCell(row[nameColIdx]) : null;
          // Skip rows where the "name" cell is the owner value itself or a category keyword
          if (!fundName || fundName === 'יעל') continue;

          var liqCode = (liqColIdx >= 0 && row[liqColIdx]) ? parseLiqCode(row[liqColIdx]) : null;
          var key     = yaelKey(fundName, cat);

          yaelRows.push({ key: key, name: fundName, cat: cat, liquidity: liqCode, val: val });
        }

        return yaelRows.length ? yaelRows : null;
      }

      // v100.7: Clean up dynamic Yael entries from previous Excel load
      Object.keys(FUNDS).forEach(function(fk) { if (fk.startsWith('yd_')) delete FUNDS[fk]; });
      Object.keys(FUND_COLORS).forEach(function(fk) { if (fk.startsWith('yd_')) delete FUND_COLORS[fk]; });
      // v103.0: Reset column K metadata
      Object.keys(FUND_COL_K).forEach(function(fk) { delete FUND_COL_K[fk]; });

      // Fill data from sheets
      sortedKeys.forEach(function(key, colIdx) {
        var sname = monthSheets[key].name;
        var ws = wb.Sheets[sname];
        // v95.2: Extend !ref so rows added below Excel's auto-range are captured
        if (ws['!ref']) {
          var wsRange = XLSX.utils.decode_range(ws['!ref']);
          wsRange.e.r = wsRange.e.r + 300; // read up to 300 extra rows beyond stated range
          wsRange.e.c = Math.max(wsRange.e.c, 20); // at least 21 columns
          ws['!ref'] = XLSX.utils.encode_range(wsRange);
        }
        var rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:null});

        // Standard ANCHOR_MAP pass (רועי + any named יעל rows)
        rows.forEach(function(row) {
          var cellName = row[0];
          var cellVal = row[1];
          if (!cellName || typeof cellVal !== 'number') return;
          var normName = String(cellName).replace(/[ \t]+/g,' ').trim();
          var anchorId = ANCHOR_MAP[normName];
          if (!anchorId) return;
          var fundKey = ANCHOR_TO_FUND[anchorId];
          if (!fundKey || !newFundData[fundKey]) return;
          // v102.2: Outlier protection — detect NIS→K data entry errors
          // If a fund value jumps by more than 20x vs previous, assume entered in NIS instead of K
          var _prevFundVal = null;
          for (var _pi = colIdx - 1; _pi >= 0; _pi--) {
            if (newFundData[fundKey][_pi] !== null && newFundData[fundKey][_pi] > 0) {
              _prevFundVal = newFundData[fundKey][_pi]; break;
            }
          }
          if (_prevFundVal !== null && _prevFundVal > 0 && cellVal > _prevFundVal * 20) {
            var _norm = cellVal / 1000;
            if (_norm >= _prevFundVal * 0.1 && _norm <= _prevFundVal * 5) cellVal = _norm;
          } else if (_prevFundVal === null && cellVal > 50000) {
            // New fund with first value > 50,000K (50M NIS) — likely entered in NIS
            cellVal = cellVal / 1000;
          }
          newFundData[fundKey][colIdx] = cellVal;

          // v103.1: Column K (index 10) — deposit/talush metadata
          // row is sparse — access col 10 safely; also try col indices 9 and 10 since Excel col K can be 0-based 10
          var _colKRaw = (row.length > 10) ? row[10] : null;
          if (_colKRaw === null || _colKRaw === undefined || _colKRaw === '') _colKRaw = null;
          if (_colKRaw !== null) {
            if (!FUND_COL_K[fundKey]) FUND_COL_K[fundKey] = new Array(newLabels.length).fill(null);
            var _colKNorm;
            if (typeof _colKRaw === 'string') {
              _colKNorm = _colKRaw.trim();
            } else if (typeof _colKRaw === 'number') {
              _colKNorm = _colKRaw; // keep as number (deposit/withdrawal amount in K)
            } else {
              _colKNorm = null;
            }
            if (_colKNorm !== null) FUND_COL_K[fundKey][colIdx] = _colKNorm;
          }
        });

        // v100.7: Dynamic Yael pass — individual fund per Excel row
        var yaelRows = parseYaelFromSheet(rows);
        if (yaelRows) {
          var hasDynamic = yaelRows.some(function(r){ return r.key.startsWith('yd_'); });

          yaelRows.forEach(function(row) {
            // Create FUNDS entry on first encounter
            if (!FUNDS[row.key]) {
              var defaultLiq = row.cat === 'gemel' ? 'pension' : row.cat === 'hishtalmut' ? 'age64' : 'now';
              FUNDS[row.key] = {
                name: row.name, cat: row.cat, owner: 'yael',
                liquidity: row.liquidity || defaultLiq,
                pensionMonthly: (row.liquidity || defaultLiq) === 'pension',
                data: new Array(newLabels.length).fill(null)
              };
              FUND_COLORS[row.key] = '#ec4899';
              newFundData[row.key] = new Array(newLabels.length).fill(null);
            } else {
              // Update name & liquidity from latest sheet
              FUNDS[row.key].name = row.name;
              if (row.liquidity) { FUNDS[row.key].liquidity = row.liquidity; FUNDS[row.key].pensionMonthly = row.liquidity === 'pension'; }
            }
            // Accumulate (same fund name → same key → sums correctly)
            newFundData[row.key][colIdx] = (newFundData[row.key][colIdx] || 0) + row.val;
          });

          // If dynamic keys used, zero out static Yael buckets for this month
          if (hasDynamic) {
            ['יעלקהש', 'יעלגמל', 'יעלגמלהשקעה', 'יעלפוליסה'].forEach(function(fk) {
              if (newFundData[fk]) newFundData[fk][colIdx] = null;
            });
          }
        }
      });

      // Update global data
      LABELS.length = 0;
      newLabels.forEach(function(l) { LABELS.push(l); });
      
      Object.keys(newFundData).forEach(function(fk) {
        if (FUNDS[fk]) FUNDS[fk].data = newFundData[fk];
      });

      // v95.0: Recalculate CAT_TOTALS respecting current invViewMode, then rebuild ALL_TOTALS
      rebuildInvTotals();
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

      // Refresh table cells and header stats from updated FUNDS data
      updateTableCells();
      updateDynamicStats();
      markNoteMonths();

      // Refresh UI – reset currentData so chart picks up new arrays
      currentData = (currentView === 'all' || !currentView) ? ALL_TOTALS : (CAT_TOTALS[currentView] || ALL_TOTALS);
      selectView(currentView || 'all');
      updateNavButtons();
      
      status.textContent = '✅ עודכנו נתוני השקעות – ' + newLabels.length + ' חודשים';
      status.style.color = '#4ade80';
      setTimeout(function(){ status.style.color = ''; }, 5000);

      // v102.5: עדכן סימולטור עם הון רועי/יעל מהקובץ החדש
      if (simInited) simRefresh();

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

  // v97.4: reset any previously expanded cards on each open
  document.querySelectorAll('.ch-card').forEach(function(c){ c.classList.remove('expanded'); });

  // v97.1: show/hide sections based on view mode
  var roeeSec = document.getElementById('roee-charts-section');
  var yaelSec = document.getElementById('yael-charts-section');
  if (invViewMode === 'yael') {
    if (roeeSec) roeeSec.style.display = 'none';
    if (yaelSec) yaelSec.style.display = '';
    renderYaelDonuts();
    return;
  } else if (invViewMode === 'all') {
    if (roeeSec) roeeSec.style.display = '';
    if (yaelSec) yaelSec.style.display = '';
  } else {
    if (roeeSec) roeeSec.style.display = '';
    if (yaelSec) yaelSec.style.display = 'none';
  }

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

  // v97.1: also render Yael donuts in shared (all) mode
  if (invViewMode === 'all') {
    renderYaelDonuts();
  }
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

// ---- בניית טבלת ציר-זמן מצטברת לקטגוריה (v100.1) ----
function buildCatAggTable(catId) {
  var color  = CAT_COLORS[catId] || '#2563eb';
  var filter = invFundFilter();
  var funds  = Object.entries(FUNDS).filter(function(e) {
    return e[1].cat === catId && filter(e[1]);
  });

  var winEnd    = Math.min(winStart + WINDOW, LABELS.length);
  var nDataCols = winEnd - winStart;
  var yAxisW    = (chart && chart.chartArea) ? Math.ceil(chart.chartArea.left) : 60;

  // Pre-compute ff arrays once
  var ffArrays = funds.map(function(e) { return ffFundData(e[1].data); });

  // v103.3: צבירת ערכים + Column K netting (מחליף mechanism של "קרן נמכרה")
  var aggData = [];
  var aggColKMovements = []; // סכום תנועות Column K בכל חודש לכל הקרנות בקטגוריה
  for (var mi = 0; mi < LABELS.length; mi++) {
    var total = 0, colKTotal = 0;
    funds.forEach(function(e, fi) {
      var ff = ffArrays[fi];
      total += ff[mi] || 0;
      var colK = FUND_COL_K[e[0]] || [];
      var kv = (mi < colK.length) ? colK[mi] : null;
      if (typeof kv === 'number' && !isNaN(kv)) colKTotal += kv;
    });
    aggData.push(total > 0 ? total : null);
    aggColKMovements.push(colKTotal);
  }

  // בניית טבלה זהה ל-invMDSelectFund
  var colHtml = '<colgroup><col style="width:' + yAxisW + 'px;">';
  for (var ci = 0; ci < nDataCols; ci++)
    colHtml += '<col style="width:calc((100% - ' + yAxisW + 'px) / ' + nDataCols + ');">';
  colHtml += '</colgroup>';

  var tdStyle    = 'padding:5px 4px;text-align:center;overflow:visible;font-size:11px;';
  var tdLblStyle = 'padding:5px 6px;text-align:right;direction:rtl;white-space:nowrap;overflow:hidden;font-size:11px;width:' + yAxisW + 'px;max-width:' + yAxisW + 'px;';

  var h = '<table style="direction:ltr;table-layout:fixed;width:100%;font-family:Heebo,sans-serif;">'
        + colHtml + '<thead><tr>';
  h += '<th style="width:' + yAxisW + 'px;max-width:' + yAxisW + 'px;text-align:right;direction:rtl;padding:5px 6px;overflow:hidden;"></th>';
  for (var i = winStart; i < winEnd; i++)
    h += '<th style="padding:4px 2px;font-size:11px;text-align:center;">' + LABELS[i] + '</th>';
  h += '</tr></thead><tbody>';

  // שורה 1: ערך בלבד (ללא אחוז)
  h += '<tr><td style="' + tdLblStyle + 'font-weight:600;color:#64748b;">ערך</td>';
  for (var i = winStart; i < winEnd; i++) {
    var v = aggData[i];
    if (v !== null && v > 0)
      h += '<td style="' + tdStyle + 'color:' + color + ';">' + Math.round(v).toLocaleString() + '</td>';
    else
      h += '<td style="' + tdStyle + '">—</td>';
  }
  h += '</tr>';

  // שורה 2: שינוי אבסולוטי בלבד (ללא אחוז)
  h += '<tr><td style="' + tdLblStyle + 'color:#64748b;">שינוי</td>';
  for (var i = winStart; i < winEnd; i++) {
    var v    = aggData[i];
    var prev = (i > 0) ? aggData[i - 1] : null;
    var d    = (v !== null && v > 0 && prev !== null && prev > 0) ? (v - prev) : null;
    if (d === null) {
      h += '<td style="' + tdStyle + '">—</td>';
    } else {
      var clr = d > 0 ? '#16a34a' : d < 0 ? '#dc2626' : '#94a3b8';
      h += '<td style="' + tdStyle + 'color:' + clr + ';">' + (d > 0 ? '+' : '') + Math.round(d).toLocaleString() + '</td>';
    }
  }
  h += '</tr>';

  // שורה 3: אחוז שינוי — v103.3: Column K netting במקום mechanism מכירות
  h += '<tr><td style="' + tdLblStyle + 'color:#64748b;">% שינוי</td>';
  for (var i = winStart; i < winEnd; i++) {
    var v    = aggData[i];
    var prev = (i > 0) ? aggData[i - 1] : null;
    if (v === null || prev === null || prev <= 0) {
      h += '<td style="' + tdStyle + '">—</td>';
    } else {
      var rawDelta      = v - prev;
      var colKMov       = aggColKMovements[i] || 0;
      var adjustedDelta = rawDelta - colKMov; // v103.3: נטרול תנועות Column K
      var pct           = (adjustedDelta / prev * 100).toFixed(1);
      var clr           = adjustedDelta > 0 ? '#16a34a' : adjustedDelta < 0 ? '#dc2626' : '#94a3b8';
      h += '<td style="' + tdStyle + 'color:' + clr + ';font-weight:600;">' +
           (adjustedDelta >= 0 ? '+' : '') + pct + '%</td>';
    }
  }
  h += '</tr></tbody></table>';
  return h;
}

// ---- פתיחת מודאל ----
var cmOpenedFromTable = false;
function openCatModal(catId, fromTable) {
  if (!catId) return;
  cmOpenedFromTable = !!fromTable;
  cmCurrentCat = catId;
  cmCurrentFundKey = null;
  cmFundClickState = 0;

  // Use CAT_COLORS/CAT_NAMES directly (sec-* elements removed in v99.5)
  var color      = CAT_COLORS[catId] || '#2563eb';
  var colorLight = color + '22';
  var box = document.getElementById('cat-modal-box');
  if (!box) return;
  box.style.setProperty('--cm-color', color);
  box.style.setProperty('--cm-color-light', colorLight);

  document.getElementById('cm-icon').textContent = '📊';
  document.getElementById('cm-icon').style.background = colorLight;
  var nameEl = document.getElementById('cm-name');
  nameEl.style.color = color;
  nameEl.textContent = (CAT_NAMES[catId] || catId) + ' <span style="font-size:11px;font-weight:400;color:#94a3b8;">(באלפי ש״ח)</span>';

  cmWinStart = Math.max(0, LABELS.length - CM_WINDOW);

  // הסתר כפתורי ניווט שאינם רלוונטיים
  var btnBack  = document.getElementById('cm-back');
  var btnBackT = document.getElementById('cm-back-table');
  if (btnBack)  btnBack.classList.remove('visible');
  if (btnBackT) btnBackT.classList.remove('visible');

  // סטטיסטיקות קטגוריה בכותרת
  cmSetCatStats(catId);

  // הצג טבלת ציר-זמן מצטברת בגוף המודאל
  var body = document.getElementById('cm-body');
  if (body) {
    body.innerHTML =
      '<div style="padding:12px 20px 16px;overflow-x:auto;direction:ltr;">' +
        buildCatAggTable(catId) +
      '</div>';
  }

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
  var retActiveFunds = Object.entries(FUNDS).filter(function(e){ return e[1].cat===catId && !excl.includes(e[0]) && (e[1].data[endIdx]||0)>0; });
  var measEnd   = retActiveFunds.reduce(function(s,e){ return s+(e[1].data[endIdx]||0); },0);
  var measStart = retActiveFunds.reduce(function(s,e){ return s+(e[1].data[cmWinStart]||0); },0);
  var retEl = document.getElementById('cm-ret');
  if (measStart > 0) {
    // v103.7: Column K netting for window return
    var _cmRetKMov = 0;
    retActiveFunds.forEach(function(e) {
      var k = e[0];
      var colK = FUND_COL_K[k] || [];
      for (var _rki = cmWinStart + 1; _rki <= endIdx; _rki++) {
        var rkv = (_rki < colK.length) ? colK[_rki] : null;
        if (typeof rkv === 'number' && !isNaN(rkv)) _cmRetKMov += rkv;
      }
    });
    var retNetDelta = (measEnd - measStart) - _cmRetKMov;
    var ret = (retNetDelta / measStart * 100).toFixed(1);
    retEl.textContent=Math.abs(parseFloat(ret)).toFixed(1)+'%'; retEl.className='cm-stat-val '+(parseFloat(ret)>=0?'pos':'neg');
  }
  var janIdx = LABELS.findIndex(function(l){ return l.indexOf('ינ') >= 0 && l.indexOf('26') >= 0; });
  var ytdEl = document.getElementById('cm-ytd');
  if (janIdx >= 0 && endIdx >= janIdx) {
    var ytdActiveFunds = Object.entries(FUNDS).filter(function(e){ return e[1].cat===catId && !excl.includes(e[0]) && (e[1].data[endIdx]||0)>0; });
    var ytdEnd   = ytdActiveFunds.reduce(function(s,e){ return s+(e[1].data[endIdx]||0); },0);
    var ytdStart = ytdActiveFunds.reduce(function(s,e){ return s+(e[1].data[janIdx]||0); },0);
    if (ytdStart > 0 && ytdEnd > 0) {
      // v103.7: Column K netting — same formula as updateDynamicStats
      var _cmYtdKMov = 0;
      ytdActiveFunds.forEach(function(e) {
        var k = e[0];
        var colK = FUND_COL_K[k] || [];
        for (var _ki = janIdx + 1; _ki <= endIdx; _ki++) {
          var kv = (_ki < colK.length) ? colK[_ki] : null;
          if (typeof kv === 'number' && !isNaN(kv)) _cmYtdKMov += kv;
        }
      });
      var ytdNetDelta = (ytdEnd - ytdStart) - _cmYtdKMov;
      var ytd = (ytdNetDelta / ytdStart * 100).toFixed(1);
      ytdEl.textContent=Math.abs(parseFloat(ytd)).toFixed(1)+'%'; ytdEl.className='cm-stat-val '+(parseFloat(ytd)>=0?'pos':'neg');
    }
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
  if (janIdx >= 0 && endIdx >= janIdx && ff[janIdx] > 0 && ff[endIdx] > 0) {
    // v103.7: Column K netting for single fund YTD — same formula as updateChartStats
    var _cmFundKMov = 0;
    var _cmFundColK = FUND_COL_K[fundKey] || [];
    for (var _fki = janIdx + 1; _fki <= endIdx; _fki++) {
      var _fkv = (_fki < _cmFundColK.length) ? _cmFundColK[_fki] : null;
      if (typeof _fkv === 'number' && !isNaN(_fkv)) _cmFundKMov += _fkv;
    }
    var _fundYtdNet = (ff[endIdx] - ff[janIdx]) - _cmFundKMov;
    var ytd = (_fundYtdNet / ff[janIdx] * 100).toFixed(1);
    ytdEl.textContent=Math.abs(parseFloat(ytd)).toFixed(1)+'%'; ytdEl.className='cm-stat-val '+(parseFloat(ytd)>=0?'pos':'neg');
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
  // v97.5: dynamic title — clarify Roee ownership in shared view
  var titleEl = document.getElementById('tv-title-label');
  if (titleEl) titleEl.textContent = invViewMode === 'all' ? 'תצוגת טבלה – רועי' : 'תצוגת טבלה';
  buildTableView();
}
function closeTableView() {
  document.getElementById('table-modal').style.display = 'none';
}

// ── ניווט מהטבלה הראשית → Master-Detail (v99.2) ──
function tableNavToCat(catId) {
  closeTableView();
  selectView(catId);
}
function tableNavToFund(fundKey, catId) {
  closeTableView();
  selectView(catId);
  // setTimeout מאפשר ל-invMDShowCat לסיים לבנות את הכרטיסיות לפני הבחירה
  setTimeout(function() { invMDSelectFund(fundKey); }, 30);
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
    var rowStyle = 'background:'+sec.color+';';
    var catClass = sec.catId ? ' class="tv-cat-row-link"' : '';
    var catClick = sec.catId ? ' onclick="tableNavToCat(\''+sec.catId+'\');"' : '';
    var rowLabel = sec.catId
      ? '<span style="opacity:0.4;font-size:10px;margin-left:4px;">&#x2197;</span> '+sec.label
      : sec.label;
    h += '<tr style="'+rowStyle+'"'+catClass+catClick+'>';
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

      var fundClick = sec.catId ? ' onclick="tableNavToFund(\''+r.fk+'\',\''+sec.catId+'\');"' : '';
      h += '<tr style="background:'+zebra+';border-bottom:1px solid #e5e7eb;'+rowOpacity+'">';
      h += '<td style="padding:7px 12px;color:#374151;font-size:13px;text-align:left;border-left:3px solid '+sec.color+';">'
         + (sec.catId ? '<span class="tv-fund-name-link"'+fundClick+'>'+r.f.name+'</span>' : r.f.name)
         + '</td>';
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

// v103.0: Sandbox — אירועים זמניים לסימולציה בלבד (לא נשמרים)
var CF_SANDBOX_EVENTS = []; // [{ amount: K, year, month, label }]

function cfSandboxToggle() {
  var panel = document.getElementById('cf-sandbox-panel');
  var btn   = document.getElementById('sb-toggle-btn');
  if (!panel) return;
  var isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  if (btn) {
    btn.style.background = isOpen ? 'rgba(255,255,255,0.08)' : 'rgba(139,92,246,0.25)';
    btn.style.borderColor = isOpen ? 'rgba(255,255,255,0.2)' : 'rgba(139,92,246,0.8)';
  }
}

function cfSandboxAdd() {
  var amtEl  = document.getElementById('sb-amount');
  var yrEl   = document.getElementById('sb-year');
  var moEl   = document.getElementById('sb-month');
  var lblEl  = document.getElementById('sb-label');
  var typeEl = document.getElementById('sb-type');
  if (!amtEl || !yrEl || !moEl) return;
  var absAmt = parseFloat(amtEl.value);
  var yr     = parseInt(yrEl.value);
  var mo     = parseInt(moEl.value);
  if (isNaN(absAmt) || absAmt <= 0 || isNaN(yr) || isNaN(mo)) return;

  // v103.2: type selector handles sign — no negative numbers needed
  var isExpense = typeEl && typeEl.value === 'expense';
  var amt = isExpense ? -absAmt : absAmt;

  // v103.2: time-travel block — reject entries before last actual CF month
  if (CF_DATA && CF_DATA.length > 0) {
    var lastReal = CF_DATA[cfGetLastRealMonth ? cfGetLastRealMonth() : CF_DATA.length - 1];
    if (lastReal) {
      var lastY = lastReal.year, lastM = lastReal.month;
      if (yr < lastY || (yr === lastY && mo < lastM)) {
        var errEl = document.getElementById('sb-err');
        if (errEl) { errEl.textContent = '⚠️ לא ניתן להוסיף ארוע לפני ' + lastReal.label; errEl.style.display = 'block'; }
        setTimeout(function() { if (errEl) errEl.style.display = 'none'; }, 3000);
        return;
      }
    }
  }

  var lbl = lblEl ? lblEl.value.trim() : '';
  CF_SANDBOX_EVENTS.push({ amount: amt, year: yr, month: mo, label: lbl || (isExpense ? 'הוצאה זמנית' : 'הכנסה זמנית') });
  amtEl.value = ''; if (lblEl) lblEl.value = '';
  cfSandboxRender();
  cfRenderChart();
  // v103.7: refresh forecast panel if open
  var _fpSb = document.getElementById('cf-detailed-forecast');
  if (_fpSb && _fpSb.style.display !== 'none') cfRenderForecast();
}

function cfSandboxRemove(idx) {
  CF_SANDBOX_EVENTS.splice(idx, 1);
  cfSandboxRender();
  cfRenderChart();
  // v103.7: refresh forecast panel if open
  var _fpRm = document.getElementById('cf-detailed-forecast');
  if (_fpRm && _fpRm.style.display !== 'none') cfRenderForecast();
}

function cfSandboxReset() {
  CF_SANDBOX_EVENTS.length = 0;
  var amtEl2 = document.getElementById('sb-amount');
  var lblEl2 = document.getElementById('sb-label');
  var typEl2 = document.getElementById('sb-type');
  if (amtEl2) amtEl2.value = '';
  if (lblEl2) lblEl2.value = '';
  if (typEl2) typEl2.value = 'expense';
  cfSandboxInitDefaults(); // v103.5: restore date to current Excel month
  cfSandboxRender();
  cfRenderChart();
  // v103.7: refresh forecast panel if open
  var _fpRst = document.getElementById('cf-detailed-forecast');
  if (_fpRst && _fpRst.style.display !== 'none') cfRenderForecast();
}

// v103.5: Set sandbox default date to CURRENT (last real) Excel month; block past months
function cfSandboxInitDefaults() {
  if (!CF_DATA || !CF_DATA.length) return;
  var lastIdx = cfGetLastRealMonth ? cfGetLastRealMonth() : CF_DATA.length - 1;
  var lastM = CF_DATA[lastIdx];
  if (!lastM) return;
  var curMo = lastM.month || 1;
  var curYr = lastM.year || new Date().getFullYear();
  var yrEl = document.getElementById('sb-year');
  var moEl = document.getElementById('sb-month');
  if (yrEl) { yrEl.value = curYr; yrEl.min = curYr; }
  if (moEl) moEl.value = curMo;
  // Store min allowed month for JS-level enforcement
  if (yrEl) yrEl.setAttribute('data-min-yr', curYr);
  if (moEl) moEl.setAttribute('data-min-mo-at-min-yr', curMo);
  // v103.6: disable past month options
  cfSandboxUpdateMonthOpts();
}

// v103.6: disable month <select> options that are before the minimum allowed month
function cfSandboxUpdateMonthOpts() {
  var yrEl = document.getElementById('sb-year');
  var moEl = document.getElementById('sb-month');
  if (!yrEl || !moEl) return;
  var minYr = parseInt(yrEl.getAttribute('data-min-yr')) || parseInt(yrEl.min) || new Date().getFullYear();
  var minMo = parseInt(moEl.getAttribute('data-min-mo-at-min-yr')) || 1;
  var selYr = parseInt(yrEl.value) || minYr;
  moEl.querySelectorAll('option').forEach(function(opt) {
    opt.disabled = (selYr === minYr && parseInt(opt.value) < minMo);
  });
  // If currently selected month is now disabled, jump to minMo
  if (selYr === minYr && parseInt(moEl.value) < minMo) moEl.value = minMo;
}

function cfSandboxRender() {
  var list = document.getElementById('sb-event-list');
  if (!list) return;
  if (!CF_SANDBOX_EVENTS.length) { list.innerHTML = '<span style="color:#94a3b8;font-size:11px;">אין אירועים</span>'; return; }
  var _HEB = ['ינו','פבר','מרץ','אפר','מאי','יונ','יול','אוג','ספט','אוק','נוב','דצמ'];
  list.innerHTML = CF_SANDBOX_EVENTS.map(function(ev, i) {
    var color = ev.amount >= 0 ? '#4ade80' : '#f87171';
    var sign  = ev.amount > 0 ? '+' : '';
    return '<div style="display:flex;align-items:center;gap:6px;margin-top:4px;">' +
      '<span style="font-size:11px;color:' + color + ';font-weight:700;">' + sign + ev.amount.toLocaleString() + 'K</span>' +
      '<span style="font-size:11px;color:#cbd5e1;">' + _HEB[ev.month-1] + '\' ' + String(ev.year).slice(2) + '</span>' +
      '<span style="font-size:11px;color:#94a3b8;">' + ev.label + '</span>' +
      '<button onclick="cfSandboxRemove(' + i + ')" style="margin-right:auto;background:transparent;border:none;color:#64748b;cursor:pointer;font-size:12px;padding:0 4px;">✕</button>' +
      '</div>';
  }).join('');
}

function saveCFToLocalStorage() {
  // v102.5: Stateless — no data persistence between sessions
}

function loadCFFromLocalStorage() {
  // v102.5: Stateless — always start fresh
  return false;
}

// v102.5: Stateless — no startup load from localStorage

var cfPrivacyOn = false;
var cfChartInstance = null;
var cfCurrentView = 'monthly';
var cfDateRange = 'rolling12'; // 'rolling12' | 'ytd'
var CF_SELECTED_YEAR = null;   // v22.0: שנת תצוגה נבחרת (null = auto = שנה מקסימלית)
var CF_FORECAST_BY_YEAR = {};  // v52.0: תחזית לפי שנה — {2025: {...}, 2026: {...}}
var CF_CHART_MONTHS = [];      // v22.0: מטמון חודשי הגרף לשימוש ב-onClick

// מחזיר את החודשים לתצוגה לפי cfDateRange
var CF_EMPTY_ROWS = ['salary','rent_income','other_income','buffer','total_income','visa','cash_exp','loans','yotam','other_exp','other_exp_2','total_exp','renovation','net_cashflow','salary_usd','exp_usd','yotam_usd','total_usd','delta','profit_loss'];
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
  cfUpdateCFCards();  // v36: sync cards
  cfRenderKPI();
  cfRenderSummary();
  cfRenderChart();
  cfRenderTable();
  // v54.0: רענן תחזית מיידית אם המגירה פתוחה
  var _fp0 = document.getElementById('cf-detailed-forecast');
  if (_fp0 && _fp0.style.display !== 'none') cfRenderForecast();
  setTimeout(function(){
    var sc = document.getElementById('cf-scroll-container');
    if (sc) sc.scrollLeft = 0;
  }, 100);
}

// v37.0: בחירת שנת תצוגה — שמור אותו חודש בשנה החדשה
function cfSelectYear(year) {
  // v37: נסה לשמור אותו מספר חודש (למשל: מרץ 26 → מרץ 25)
  var prevMonthNum = null;
  var prevId = CF_SELECTED_MONTH_ID || CF_CURRENT_MONTH_ID;
  if (prevId) { var _p = prevId.split('-'); prevMonthNum = parseInt(_p[1], 10); }
  CF_SELECTED_YEAR = year;
  if (prevMonthNum) {
    var tryId = year + '-' + (prevMonthNum < 10 ? '0' + prevMonthNum : '' + prevMonthNum);
    var exists = CF_DATA.some(function(m){ return m.monthId === tryId && (cfCalcIncome(m.rows) > 0 || cfCalcExp(m.rows) > 0); });
    CF_SELECTED_MONTH_ID = exists ? tryId : null;
  } else {
    CF_SELECTED_MONTH_ID = null;
  }
  CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(CF_DATA);
  cfRenderMonthSelector();
  cfUpdateHeader();
  cfUpdateCFCards();  // v36: sync cards
  cfRenderKPI();
  cfRenderSummary();
  cfRenderChart();
  cfRenderTable();
  // v54.0: רענן תחזית מיידית אם המגירה פתוחה
  var _fp = document.getElementById('cf-detailed-forecast');
  if (_fp && _fp.style.display !== 'none') cfRenderForecast();
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

// v51.0: Notes Modal — חלון קופץ במקום inline panel
function cfTogglePrivacy() {
  var modal = document.getElementById('cf-notes-modal');
  if (modal) { cfCloseNotesModal(); return; }
  cfOpenNotesModal();
}

function cfOpenNotesModal() {
  // בנה תוכן הערות
  var lastIdx = cfGetLastRealMonth();
  var ROW_LABELS = {
    salary:'משכורת שקלית', rent_income:'שכר דירה', other_income:'הכנסות שונות',
    buffer:'פריטה מ-Buffer', visa:'חיוב ויזה',
    cash_exp:'הוצאות מזומן', loans:'החזר הלוואות', yotam:'הוצאות יותם',
    other_exp:'הוצאות שונות 1', other_exp_2:'הוצאות שונות 2', total_exp:'סה״כ הוצאות', renovation:'שיפוץ',
    net_cashflow:'תזרים שקלי נטו', salary_usd:'משכורת $', exp_usd:'הוצאות $',
    yotam_usd:'הוצאות יותם $', total_usd:'סך הכל $',
    delta:'Δ תזרים שוטף', profit_loss:'רווח / הפסד'
  };
  var FULL_HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var selM = CF_DATA[lastIdx];
  var html = '<div style="font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:0.5px;margin-bottom:16px;">📋 הערות — ' + (selM ? selM.label : '') + '</div>';
  var hasAny = false;
  if (selM) {
    var noteItems = [];
    Object.keys(selM.rows).forEach(function(k) {
      if (selM.rows[k] && selM.rows[k].note && selM.rows[k].note !== 'חושב') {
        // שם דינמי: אם ה-note הוא string לא-מספרי, הוא השם; אחרת השתמש ב-ROW_LABELS
        var dynLbl = ROW_LABELS[k] || k;
        noteItems.push({label: dynLbl, note: selM.rows[k].note, val: selM.rows[k].val});
      }
    });
    var netRow = selM.rows.net_cashflow;
    var netVal2 = netRow ? netRow.val : null;
    var fullMonthLabel = FULL_HEB_MONTHS[selM.month - 1] + ' ' + selM.year;
    if (noteItems.length > 0 || netVal2 !== null) {
      hasAny = true;
      html += '<div style="margin-bottom:8px;">';
      html += '<div style="font-size:14px;font-weight:700;color:rgba(255,255,255,0.85);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.1);">📅 ' + fullMonthLabel + '</div>';
      if (netVal2 !== null) {
        var nc = netVal2 >= 0 ? 'rgba(74,222,128,0.9)' : 'rgba(248,113,113,0.9)';
        html += '<div style="font-size:14px;color:rgba(255,255,255,0.78);padding:5px 12px 5px 0;border-right:2px solid '+nc+';margin-right:2px;margin-bottom:6px;">';
        html += '<span style="color:rgba(255,255,255,0.4);font-size:11px;">תזרים שקלי נטו</span><br>';
        html += '<span style="color:'+nc+';font-weight:700;font-size:16px;">'+netVal2.toLocaleString()+'</span>';
        html += '</div>';
      }
      noteItems.forEach(function(item) {
        var amtStr = (item.val !== null && item.val !== undefined) ? ' — <span style="color:rgba(99,179,237,0.9);font-weight:700;">'+item.val.toLocaleString()+'</span>' : '';
        var displayNote = (item.note.trim().toLowerCase() === item.label.trim().toLowerCase()) ? '' : item.note;
        html += '<div style="font-size:13px;color:rgba(255,255,255,0.75);padding:5px 12px 5px 0;border-right:2px solid rgba(99,179,237,0.4);margin-right:2px;margin-bottom:4px;">';
        html += '<span style="color:rgba(255,255,255,0.38);font-size:11px;">'+item.label+'</span>';
        if (displayNote) html += '<br><span>' + displayNote + '</span>';
        html += amtStr;
        html += '</div>';
      });
      html += '</div>';
    }
  }
  if (!hasAny) html += '<div style="color:rgba(255,255,255,0.35);font-size:12px;text-align:center;padding:20px;">אין הערות בנתונים</div>';

  // צור Modal
  var backdrop = document.createElement('div');
  backdrop.id = 'cf-notes-modal';
  backdrop.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);';
  backdrop.onclick = function(e) { if (e.target === backdrop) cfCloseNotesModal(); };

  var inner = document.createElement('div');
  inner.style.cssText = 'background:#1e293b;border-radius:16px;padding:28px 28px 24px;max-width:460px;width:90%;max-height:75vh;overflow-y:auto;direction:rtl;position:relative;box-shadow:0 24px 60px rgba(0,0,0,0.55);border:1px solid rgba(255,255,255,0.08);';
  var closeBtn = '<button onclick="cfCloseNotesModal()" style="position:absolute;top:12px;left:14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);color:rgba(255,255,255,0.65);border-radius:50%;width:30px;height:30px;font-size:15px;cursor:pointer;line-height:28px;text-align:center;font-family:Heebo,sans-serif;flex-shrink:0;">✕</button>';
  inner.innerHTML = closeBtn + html;

  backdrop.appendChild(inner);
  document.body.appendChild(backdrop);

  var privIcon = document.getElementById('cf-privacy-icon');
  var privText = document.getElementById('cf-privacy-text');
  if (privIcon) privIcon.textContent = '👁️';
  if (privText) privText.textContent = 'הסתר הערות';
}

function cfCloseNotesModal() {
  var modal = document.getElementById('cf-notes-modal');
  if (modal) document.body.removeChild(modal);
  var privIcon = document.getElementById('cf-privacy-icon');
  var privText = document.getElementById('cf-privacy-text');
  if (privIcon) privIcon.textContent = '🔒';
  if (privText) privText.textContent = 'הצג הערות';
}

function cfRenderNotesPanel() {
  var panel = document.getElementById('cf-notes-panel');
  if (!panel) return;
  var lastIdx = cfGetLastRealMonth();
  var ROW_LABELS = {
    salary:'משכורת שקלית', rent_income:'שכר דירה', other_income:'הכנסות שונות',
    buffer:'פריטה מ-Buffer', total_income:'סה״כ הכנסות', visa:'חיוב ויזה',
    cash_exp:'הוצאות מזומן', loans:'החזר הלוואות', yotam:'הוצאות יותם',
    other_exp:'הוצאות שונות 1', other_exp_2:'הוצאות שונות 2', total_exp:'סה״כ הוצאות', renovation:'שיפוץ',
    net_cashflow:'תזרים שקלי נטו', salary_usd:'משכורת $', exp_usd:'הוצאות $',
    yotam_usd:'הוצאות יותם $', total_usd:'סך הכל $',
    delta:'Δ תזרים שוטף', profit_loss:'רווח / הפסד'
  };
  var FULL_HEB_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  // v46.0: הצג הערות רק לחודש הנבחר הנוכחי (לא כל ההיסטוריה)
  var selM = CF_DATA[lastIdx];
  var html = '<div style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.5px;margin-bottom:14px;">הערות — ' + (selM ? selM.label : '') + '</div>';
  var hasAny = false;
  for (var i = lastIdx; i === lastIdx; i--) {
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
// v39.0: נוסף other_exp_2 (הוצאות שונות 2)
function cfCalcExp(r) {
  return (r.visa&&r.visa.val!=null?r.visa.val:0)
       + (r.cash_exp&&r.cash_exp.val!=null?r.cash_exp.val:0)
       + (r.loans&&r.loans.val!=null?r.loans.val:0)
       + (r.yotam&&r.yotam.val!=null?r.yotam.val:0)
       + (r.other_exp&&r.other_exp.val!=null?r.other_exp.val:0)
       + (r.other_exp_2&&r.other_exp_2.val!=null?r.other_exp_2.val:0)
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

  // שלב 1: חפש התאמה מדויקת — חודש זה בשנת maxYear עם salary>0 או total_exp>0
  // v43.0: total_income הוסר — בודקים salary ו-total_exp במקומו
  for (var i = 0; i < data.length; i++) {
    if (data[i].year * 100 + data[i].month === targetYM && data[i].rows &&
        ((data[i].rows.salary    && data[i].rows.salary.val    > 0) ||
         (data[i].rows.total_exp && data[i].rows.total_exp.val > 0))) {
      console.log('!!! FOUND', data[i].label, 'AT monthId:', data[i].monthId, '— salary:', (data[i].rows.salary&&data[i].rows.salary.val)||0, '!!!');
      return data[i].monthId;
    }
  }
  // שלב 2: החודש האחרון ב-maxYear עם salary>0 או total_exp>0
  for (var j = data.length - 1; j >= 0; j--) {
    if (data[j].year === maxYear && data[j].rows &&
        ((data[j].rows.salary    && data[j].rows.salary.val    > 0) ||
         (data[j].rows.total_exp && data[j].rows.total_exp.val > 0))) {
      return data[j].monthId;
    }
  }
  // שלב 3: אחרון ב-maxYear עם salary > 0 או total_exp > 0 — v42.0: לא חוזר לדצמבר ריק
  for (var k = data.length - 1; k >= 0; k--) {
    if (data[k].year === maxYear &&
        data[k].rows &&
        ((data[k].rows.salary    && data[k].rows.salary.val    > 0) ||
         (data[k].rows.total_exp && data[k].rows.total_exp.val > 0))) {
      return data[k].monthId;
    }
  }
  // שלב 3b: אחרון ב-maxYear, כולל ריק — רק כגיבוי אחרון
  for (var k2 = data.length - 1; k2 >= 0; k2--) {
    if (data[k2].year === maxYear) return data[k2].monthId;
  }
  // שלב 4: כל הנתונים — קח הראשון עם salary>0 או total_exp>0
  for (var l = 0; l < data.length; l++) {
    if (data[l].rows && ((data[l].rows.salary && data[l].rows.salary.val > 0) ||
                         (data[l].rows.total_exp && data[l].rows.total_exp.val > 0))) return data[l].monthId;
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
  // v43.0: fallback — salary > 0 או total_exp > 0 (total_income הוסר — מחושב דינמית)
  for (var i = CF_DATA.length - 1; i >= 0; i--) {
    var row = CF_DATA[i].rows;
    if (row && ((row.salary    && row.salary.val    > 0) ||
                (row.total_exp && row.total_exp.val > 0))) return i;
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
  // v40.0: הכנסות = 'משכורת שקלית' + 'שכר דירה' (salary + rent_income)
  var inc = (m.rows.salary&&m.rows.salary.val!=null?m.rows.salary.val:0) +
            (m.rows.rent_income&&m.rows.rent_income.val!=null?m.rows.rent_income.val:0);
  // v40.0: הוצאות = ערך ישיר מ-'סה"כ הוצאות שקלי' (total_exp); fallback: חישוב מרכיבים
  var exp = (m.rows.total_exp && m.rows.total_exp.val != null) ? m.rows.total_exp.val : cfCalcExp(m.rows);
  // v45.0: נטו שקלי בלבד — ללא profit_loss מהאקסל (עלול לכלול דולרים)
  var net = inc - exp;

  var elNet = document.getElementById('cf-hdr-net');
  var elNetSub = document.getElementById('cf-hdr-net-sub');
  var elNetLabel = document.getElementById('cf-hdr-net-label');
  var elInc = document.getElementById('cf-hdr-income');
  var elExp = document.getElementById('cf-hdr-exp');
  var elPL  = document.getElementById('cf-hdr-pl');

  // v45.0: label קבוע + כחול תמיד
  if(elNet){ elNet.textContent = Math.round(net).toLocaleString(); elNet.className = 'stat-value'; elNet.style.color = '#60a5fa'; }
  if(elNetSub) elNetSub.textContent = m.label;
  if(elNetLabel) elNetLabel.textContent = 'תזרים שקלי נטו';
  if(elInc){ elInc.textContent = Math.round(inc).toLocaleString(); elInc.className = 'stat-value green'; }
  if(elExp){ elExp.textContent = Math.round(exp).toLocaleString(); elExp.className = 'stat-value red'; }
  // v98.1/v98.2: רווח או הפסד — כותרת + צבע דינמיים
  if (elPL) {
    var plVal = (m.rows.profit_loss && m.rows.profit_loss.val != null) ? m.rows.profit_loss.val : null;
    var elPLLabel = document.getElementById('cf-hdr-pl-label');
    elPL.className = 'stat-value';
    if (plVal === null) {
      elPL.textContent = '—';
      elPL.style.color = '';
      if (elPLLabel) elPLLabel.textContent = 'רווח או הפסד';
    } else if (plVal < 0) {
      elPL.textContent = Math.round(plVal).toLocaleString();
      elPL.style.color = '#c0394e'; // בורדו
      if (elPLLabel) elPLLabel.textContent = 'הפסד';
    } else {
      elPL.textContent = Math.round(plVal).toLocaleString();
      elPL.style.color = '#4169e1'; // Royal Blue
      if (elPLLabel) elPLLabel.textContent = 'רווח';
    }
  }

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
  // פירוט הוצאות — v30.0: הלוואות מוסתרות אם 0; v39.0: other_exp_2 דינמי
  // v51.0: Tooltip חכם עם שמות דינמיים + Zero Noise — מחושב לפני הArray
  function _dn(key, fb) {
    var n = r[key] && r[key].note;
    return (n && isNaN(parseFloat(String(n).replace(/,/g,'').trim()))) ? String(n) : fb;
  }
  var _tipParts = [];
  if (r.yotam && r.yotam.val > 0)       _tipParts.push('יותם: ' + Math.round(r.yotam.val).toLocaleString());
  if (r.other_exp && r.other_exp.val > 0)   _tipParts.push(_dn('other_exp','שונות') + ': ' + Math.round(r.other_exp.val).toLocaleString());
  if (r.other_exp_2 && r.other_exp_2.val > 0) _tipParts.push(_dn('other_exp_2','שונות 2') + ': ' + Math.round(r.other_exp_2.val).toLocaleString());
  var _miscTip = _tipParts.join(', ');
  var _miscVal = (r.yotam&&r.yotam.val!=null?r.yotam.val:0)+(r.other_exp&&r.other_exp.val!=null?r.other_exp.val:0)+(r.other_exp_2&&r.other_exp_2.val!=null?r.other_exp_2.val:0);
  var expCards = [
    {label:'הוצאות שוטפות', val:(r.visa&&r.visa.val||0)+(r.cash_exp&&r.cash_exp.val||0), color:'#dc2626', icon:'💳'},
    {label:'החזר הלוואה',   val:(r.loans&&r.loans.val!=null?r.loans.val:0), color:'#b45309', icon:'🏦'},
    {label:'הוצאות שונות',  val:_miscVal, color:'#eab308', icon:'📌', tip:_miscTip},
    {label:'תזרים דולרי נטו', val:r.total_usd&&r.total_usd.val!=null?r.total_usd.val:0, color:'#7c3aed', icon:'$'},
  ];
  var container = document.getElementById('cf-cards-row');
  if(!container) return;
  var html = '';
  incCards.concat(expCards).forEach(function(card){
    if (card.val === 0) return;
    var dispVal = Math.abs(Math.round(card.val)).toLocaleString();
    var titleAttr = card.tip ? ' title="' + card.tip + '"' : '';
    html += '<div' + titleAttr + ' style="background:white;border-radius:9px;padding:9px 13px;border-right:3px solid '+card.color+';box-shadow:0 1px 4px rgba(0,0,0,0.07);cursor:default;">';
    html += '<div style="font-size:11px;color:#6b7280;font-weight:600;margin-bottom:2px;">'+card.icon+' '+card.label+'</div>';
    html += '<div style="font-size:18px;font-weight:800;color:'+card.color+';">'+dispVal+'</div>';
    html += '<div style="font-size:11px;color:#9ca3af;">'+m.label+'</div>';
    html += '</div>';
  });
  // v35: הצג container כשיש תוכן; v98.4: גם תווית הסעיף
  var _hasCards = !!html.trim();
  container.style.display = _hasCards ? 'grid' : 'none';
  container.innerHTML = html;
  var _lbl = document.getElementById('cf-label-summary-month');
  if (_lbl) _lbl.style.display = _hasCards ? 'block' : 'none';
}

// v27.0: cfRenderKPI — שורה אחת, ללא כותרות, overflow-x:auto
function cfRenderKPI() {
  var lastIdx = cfGetLastRealMonth();
  var m = CF_DATA[lastIdx];
  var detailEl = document.getElementById('cf-detail-row');
  if (!detailEl) return;

  function gv(key) { return (m.rows[key] && m.rows[key].val != null) ? m.rows[key].val : null; }
  // v48.0: כרטיסיות לבנות עם Tooltip
  function chip(lbl, val, col, tip) {
    if (val === null || val === 0) return '';
    var titleAttr = tip ? ' title="' + tip + '"' : '';
    return '<div' + titleAttr + ' style="display:flex;flex-direction:column;background:white;border-radius:8px;padding:10px 16px;border-right:3px solid '+col+';flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,0.08);cursor:default;">' +
      '<span style="font-size:12px;color:#6b7280;font-weight:600;white-space:nowrap;">'+lbl+'</span>' +
      '<span style="font-size:19px;font-weight:800;color:'+col+';margin-top:2px;white-space:nowrap;">'+Math.round(val).toLocaleString()+'</span></div>';
  }
  var SEP = '<div style="width:1px;background:rgba(0,0,0,0.08);flex-shrink:0;align-self:stretch;margin:0 3px;"></div>';

  var IG='#16a34a', ER='#dc2626', EO='#ea580c', EY='#ca8a04', EP='#7c3aed';
  var h = '<div style="background:#f8fafc;border-radius:12px;padding:10px 14px;direction:rtl;border:1px solid rgba(0,0,0,0.06);margin-bottom:2px;">';
  h += '<div style="display:flex;align-items:flex-start;gap:6px;overflow-x:auto;padding-bottom:2px;">';
  h += chip('שקלית',gv('salary'),IG);
  h += chip('שכ"ד',gv('rent_income'),IG);
  h += chip('אחרות',gv('other_income'),IG);
  h += chip('פריטה',gv('buffer'),IG);
  h += SEP;
  h += chip('ויזה',gv('visa'),ER);
  h += chip('מזומן',gv('cash_exp'),ER);
  h += chip('הלוואות',gv('loans'),ER);
  h += chip('שיפוץ',gv('renovation'),ER);
  h += SEP;
  // v51.0: שמות דינמיים מעמודת הערות — other_exp ו-other_exp_2 כרטיסיות נפרדות
  function gn(key) { return (m.rows[key] && m.rows[key].note) ? m.rows[key].note : null; }
  function dynLabel(key, fallback) {
    var n = gn(key);
    return (n && isNaN(parseFloat(String(n).replace(/,/g,'').trim()))) ? String(n) : fallback;
  }
  h += chip('יותם', gv('yotam'), EO);
  h += chip(dynLabel('other_exp', 'הוצ. שונות'), gv('other_exp'), EY);
  h += chip(dynLabel('other_exp_2', 'הוצ. שונות'), gv('other_exp_2'), EY);
  h += SEP;
  var _eusd = gv('exp_usd');   var _yusd = gv('yotam_usd');
  h += chip('משכ$ ', gv('salary_usd'), EP);
  h += chip('הוצ$',  _eusd  !== null ? Math.abs(_eusd)  : null, '#fca5a5');  // v39: ורוד עדין כמו Slim Bar
  h += chip('יותם$', _yusd  !== null ? Math.abs(_yusd)  : null, EO);  // כתום = יותם
  // סך$ הוסר בv36
  h += '</div></div>';
  detailEl.innerHTML = h;
}

// v98.3: סניטציה — מונע null/undefined/NaN שגורמים לציר Y להתאפס
function cfSafeArr(arr) {
  return arr.map(function(v) { var n = Number(v); return (v === null || v === undefined || isNaN(n)) ? 0 : n; });
}

function cfRenderChart() {
  var COL_W   = 80;
  var YAXIS_W = 50;  // רוחב ציר Y — חייב להתאים ל-YAXIS_W ב-cfRenderTable
  var months = cfGetDisplayMonths();
  // v98.3: guard — אל תנסה לרנדר בלי נתונים
  if (!months || months.length === 0) return;
  // תוויות מקוצרות רק לגרף — ינו׳ 25, פבר׳ 26 וכו׳
  CF_CHART_MONTHS = months; // v22.0: שמור לשימוש ב-onClick
  var labels = months.map(function(m){ return CF_HEB_MONTHS_ABBR[m.month-1] + ' ' + String(m.year).slice(2); });
  var chartW = months.length * COL_W + YAXIS_W;

  // קבע רוחב מדויק למניעת מתיחת עמודות
  var CHART_H = 265; // v103.5: extra height for x-axis labels
  var wrap = document.getElementById('cf-chart-wrap');
  if (wrap) {
    wrap.style.width     = chartW + 'px';
    wrap.style.minWidth  = chartW + 'px';
    wrap.style.maxWidth  = chartW + 'px';
    wrap.style.height    = CHART_H + 'px';
    wrap.style.minHeight = CHART_H + 'px'; // v98.3: מניעת קריסת גובה
    wrap.style.maxHeight = '350px'; // v103.8: cap YTD chart height
    wrap.style.flex      = 'none';
  }

  // v98.3: Canvas Re-mount — החלפה פיזית של האלמנט (שקוילנט של React key prop)
  // מונע state שבור שנשאר על Canvas ישן לאחר destroy
  if (cfChartInstance) { cfChartInstance.destroy(); cfChartInstance = null; }
  var oldCtx = document.getElementById('cf-chart');
  if (!oldCtx) return;
  var ctx = document.createElement('canvas');
  ctx.id = 'cf-chart';
  ctx.style.cssText = 'display:block;width:' + chartW + 'px;height:' + CHART_H + 'px;';
  ctx.width  = chartW;
  ctx.height = CHART_H;
  oldCtx.parentNode.replaceChild(ctx, oldCtx);

  var datasets;
  var isMonthly = cfCurrentView === 'monthly';
  if (isMonthly) {
    // v21.0: Stacked Bar — הכנסות ירוק | שוטף אדום | יותם כתום | חריג צהוב
    var expShoter = [], expYotam = [], expCharig = [];
    months.forEach(function(m) {
      // v33.0: totalExpCalc מחושב מרכיבים (כולל הלוואות)
      var totalExpCalc = cfCalcExp(m.rows);
      var yotamV  = (m.rows.yotam    && m.rows.yotam.val    != null) ? m.rows.yotam.val    : 0;
      var charigV = (m.rows.other_exp && m.rows.other_exp.val != null ? m.rows.other_exp.val : 0)
                  + (m.rows.other_exp_2 && m.rows.other_exp_2.val != null ? m.rows.other_exp_2.val : 0);
      expShoter.push(Math.max(0, totalExpCalc - yotamV - charigV));
      expYotam.push(yotamV);
      expCharig.push(charigV);
    });
    // v103.5: Sandbox events — split income (dark green on income stack) / expense (burgundy on exp stack)
    var sandboxIncome = months.map(function(m) {
      var s = 0;
      CF_SANDBOX_EVENTS.forEach(function(ev) {
        if (ev.year === m.year && ev.month === m.month && typeof ev.amount === 'number' && ev.amount > 0) s += ev.amount;
      });
      return s;
    });
    var sandboxExpense = months.map(function(m) {
      var s = 0;
      CF_SANDBOX_EVENTS.forEach(function(ev) {
        if (ev.year === m.year && ev.month === m.month && typeof ev.amount === 'number' && ev.amount < 0) s += Math.abs(ev.amount);
      });
      return s;
    });
    var hasSandbox = CF_SANDBOX_EVENTS.length > 0;
    datasets = [
      { label:'הכנסות', data:cfSafeArr(months.map(function(m){ return cfCalcIncome(m.rows); })), backgroundColor:'rgba(34,197,94,0.85)',  borderRadius:4, stack:'income' },
      { label:'שוטף',  data:cfSafeArr(expShoter), backgroundColor:'rgba(239,68,68,0.85)',  borderRadius:0, stack:'exp' },
      { label:'יותם',  data:cfSafeArr(expYotam),  backgroundColor:'rgba(249,115,22,0.85)', borderRadius:0, stack:'exp' },
      { label:'חריג',  data:cfSafeArr(expCharig), backgroundColor:'rgba(234,179,8,0.85)',  borderRadius:4, stack:'exp' },
    ];
    if (hasSandbox) {
      // v103.5: build per-month label maps for income and expense events
      var _sbIncLblMap = {}, _sbExpLblMap = {};
      months.forEach(function(m, mi) {
        var incEvs = CF_SANDBOX_EVENTS.filter(function(ev) { return ev.year === m.year && ev.month === m.month && ev.amount > 0; });
        var expEvs = CF_SANDBOX_EVENTS.filter(function(ev) { return ev.year === m.year && ev.month === m.month && ev.amount < 0; });
        if (incEvs.length) _sbIncLblMap[mi] = incEvs.map(function(ev) { return ev.label; }).join(', ');
        if (expEvs.length) _sbExpLblMap[mi] = expEvs.map(function(ev) { return ev.label; }).join(', ');
      });
      datasets.push({
        label: 'הכנסה זמנית',
        data: sandboxIncome,
        backgroundColor: 'rgba(21,128,61,0.9)',   // dark green — on top of income bar
        borderRadius: 4, stack: 'income',
        _sbLabelMap: _sbIncLblMap
      });
      datasets.push({
        label: 'הוצאה זמנית',
        data: sandboxExpense,
        backgroundColor: 'rgba(136,19,55,0.9)',   // burgundy — on top of expense bar
        borderRadius: 4, stack: 'exp',
        _sbLabelMap: _sbExpLblMap
      });
    }
  } else {
    // ytd: מצטבר לפי cfGetNetVal (total_income - total_exp)
    // v103.7: calculate base cumulative (no sandbox) to lock Y-axis range
    var cumBase = [], sBase = 0;
    months.forEach(function(m){
      var v = cfGetNetVal(m);
      sBase += (v !== null ? v : 0);
      cumBase.push(sBase);
    });
    var baseSafeCum = cfSafeArr(cumBase);
    var baseMin = Math.min.apply(null, baseSafeCum);
    var baseMax = Math.max.apply(null, baseSafeCum);

    var cum = [], s = 0;
    months.forEach(function(m){
      var v = cfGetNetVal(m);
      s += (v !== null ? v : 0);
      // v103.6: include sandbox events in cumulative chart
      CF_SANDBOX_EVENTS.forEach(function(ev) {
        if (ev.year === m.year && ev.month === m.month) s += (ev.amount || 0);
      });
      cum.push(s);
    });
    var safeCum = cfSafeArr(cum);
    // v103.7: Y-axis locked to base range — only expands if sandbox pushes beyond
    var sandboxMin = Math.min.apply(null, safeCum);
    var sandboxMax = Math.max.apply(null, safeCum);
    var ytdAxisMin = Math.min(baseMin, sandboxMin);
    var ytdAxisMax = Math.max(baseMax, sandboxMax);
    // add 10% padding to locked range so bars don't touch top/bottom
    var ytdPad = (ytdAxisMax - ytdAxisMin) * 0.12 || 50;
    datasets = [{
      label:'מצטבר', data:safeCum,
      backgroundColor:safeCum.map(function(v){ return v>=0?'rgba(34,197,94,0.85)':'rgba(239,68,68,0.85)'; }),
      borderRadius:3,
      maxBarThickness: 34  // v23.0: אחיד עם רוחב עמודות בגרף חודשי
    }];
    // store for use in scales section below
    window._cfYtdAxisMin = ytdAxisMin - ytdPad;
    window._cfYtdAxisMax = ytdAxisMax + ytdPad;
  }

  // v98.4: Plugin — קו הפרדה מקווקו בין חודש נוכחי לחודשים הבאים
  var cfForecastDividerPlugin = {
    id: 'cfForecastDivider',
    afterDraw: function(chart) {
      var currentIdx = -1;
      for (var _pi = 0; _pi < CF_CHART_MONTHS.length; _pi++) {
        if (CF_CHART_MONTHS[_pi].monthId === CF_CURRENT_MONTH_ID) { currentIdx = _pi; break; }
      }
      if (currentIdx < 0) return;
      var xScale = chart.scales.x;
      var x;
      if (currentIdx < CF_CHART_MONTHS.length - 1) {
        var _x1 = xScale.getPixelForValue(currentIdx);
        var _x2 = xScale.getPixelForValue(currentIdx + 1);
        x = (_x1 + _x2) / 2;
      } else {
        // קו בקצה הימני של העמודה האחרונה
        var _bw = CF_CHART_MONTHS.length > 1
          ? xScale.getPixelForValue(1) - xScale.getPixelForValue(0)
          : 40;
        x = xScale.getPixelForValue(currentIdx) + _bw / 2;
      }
      var _ctx2 = chart.ctx;
      _ctx2.save();
      _ctx2.beginPath();
      _ctx2.setLineDash([4, 4]);
      _ctx2.strokeStyle = 'rgba(255,255,255,0.28)';
      _ctx2.lineWidth = 1.5;
      _ctx2.moveTo(x, chart.chartArea.top);
      _ctx2.lineTo(x, chart.chartArea.bottom);
      _ctx2.stroke();
      _ctx2.setLineDash([]);
      _ctx2.restore();
    }
  };

  cfChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels:labels, datasets:datasets },
    plugins: [cfForecastDividerPlugin],
    options: {
      responsive: false,
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
              var val = item.raw;
              if (!val && val !== 0) return '';
              // v103.2: sandbox dataset — show event description from _sbLabelMap
              if (item.dataset._sbLabelMap) {
                var evLbl = item.dataset._sbLabelMap[item.dataIndex];
                var dispLbl = evLbl || (val >= 0 ? 'הכנסה זמנית' : 'הוצאה זמנית');
                return dispLbl + ': ' + (val > 0 ? '+' : '') + Math.round(val).toLocaleString();
              }
              var datasetLabel = item.dataset.label || '';
              return datasetLabel + ': ' + Math.round(val).toLocaleString();
            },
            afterBody: function(items) {
              if (!isMonthly || !items.length) return [];
              var idx = items[0].dataIndex;
              var ytdInc = 0, ytdExp = 0;
              for (var i = 0; i <= idx; i++) {
                ytdInc += cfCalcIncome(months[i].rows);
                ytdExp += cfCalcExp(months[i].rows);
              }
              return ['──────────────', 'YTD הכנסות: '+Math.round(ytdInc).toLocaleString(), 'YTD הוצאות: '+Math.abs(Math.round(ytdExp)).toLocaleString(), 'YTD נטו: '+(ytdInc-ytdExp<0?'-':'')+Math.abs(Math.round(ytdInc-ytdExp)).toLocaleString()];
            }
          }
        }
      },
      scales: {
        x: {
          stacked: isMonthly,
          display: true,
          offset: true,
          grid:  { display:false },
          ticks: { font:{ size:9, family:'Heebo,sans-serif' }, color:'#9ca3af', maxRotation:45, minRotation:0, maxTicksLimit:24 },
          barPercentage:    0.7,
          categoryPercentage: 1.0
        },
        y: {
          stacked: isMonthly,
          display: true,
          position: 'left',
          // v103.7: lock Y-axis to base data range when YTD chart; prevents sandbox from jumping scale
          min: (!isMonthly && window._cfYtdAxisMin !== undefined) ? window._cfYtdAxisMin : undefined,
          max: (!isMonthly && window._cfYtdAxisMax !== undefined) ? window._cfYtdAxisMax : undefined,
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
    {key:'salary',       label:'\u05de\u05e9\u05db\u05d5\u05e8\u05ea \u05e9\u05e7\u05dc\u05d9\u05ea',     block:'income',   total:false},
    {key:'rent_income',  label:'\u05e9\u05db\u05e8 \u05d3\u05d9\u05e8\u05d4',             block:'income',   total:false},
    {key:'other_income', label:'\u05d4\u05db\u05e0\u05e1\u05d5\u05ea \u05e9\u05d5\u05e0\u05d5\u05ea',         block:'income',   total:false},
    {key:'buffer',       label:'\u05e4\u05e8\u05d9\u05d8\u05d4 \u05de\u05d1 Buffer',       block:'income',   total:false},
    {key:'total_income', label:'\u05e1\u05d4\u05f4\u05db \u05d4\u05db\u05e0\u05e1\u05d5\u05ea',          block:'income',   total:true},
    {key:'visa',         label:'\u05d7\u05d9\u05d5\u05d1 \u05d5\u05d9\u05d6\u05d4',            block:'expenses', total:false},
    {key:'cash_exp',     label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05de\u05d6\u05d5\u05de\u05df',         block:'expenses', total:false},
    {key:'loans',        label:'\u05d4\u05d7\u05d6\u05e8 \u05d4\u05dc\u05d5\u05d5\u05d0\u05d5\u05ea',         block:'expenses', total:false},
    {key:'yotam',        label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05d9\u05d5\u05ea\u05dd',          block:'expenses', total:false},
    {key:'other_exp',    label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05e9\u05d5\u05e0\u05d5\u05ea 1',       block:'expenses', total:false},
    {key:'other_exp_2',  label:'\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea \u05e9\u05d5\u05e0\u05d5\u05ea 2',       block:'expenses', total:false, optional:true},
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
    // v39: optional rows — הסתר שורה אם אין נתונים בשום חודש
    if (row.optional) {
      var hasData = months.some(function(m){ var v=m.rows[row.key]; return v&&v.val!=null&&v.val!==0; });
      if (!hasData) return;
    }
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
      // v43.0: total_income — חישוב דינמי (לא נשמר באקסל)
      var cell = (row.key === 'total_income')
        ? {val: Math.round(cfCalcIncome(m.rows)), note: null}
        : (m.rows[row.key] || {val:null, note:null});
      var val  = cell.val, note = cell.note;
      var vc   = 'rgba(255,255,255,0.75)';
      if (isTot) {
        if      (bl==='income')   vc='#16a34a';
        else if (bl==='expenses') vc='#dc2626';
        else if (row.key==='profit_loss') // v98.1: כחול=חיובי | בורדו=שלילי | אפור=0
          vc = val!==null&&val>0?'#4169e1':val!==null&&val<0?'#c0394e':'#9ca3af';
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

// v57.0: Graceful Empty State — skeleton יציב כשאין נתוני תזרים
function cfShowNoData() {
  // Row 1: הודעת "אין נתונים" + הוראת פעולה
  var kpi = document.getElementById('cf-kpi-row');
  if (kpi) kpi.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:32px 20px;">' +
    '<div style="font-size:36px;margin-bottom:10px;">📂</div>' +
    '<div style="font-size:15px;font-weight:700;color:#374151;margin-bottom:6px;">אין נתוני תזרים</div>' +
    '<div style="font-size:13px;color:#6b7280;">לחץ על <strong>עדכן נתונים מאקסל</strong> ובחר את קובץ התזרים השוטף</div>' +
    '</div>';

  // Row 2 (cf-detail-row): כרטיסיית skeleton בהירה עם הודעת המתנה
  var det = document.getElementById('cf-detail-row');
  if (det) det.innerHTML = '<div style="background:#f8fafc;border-radius:12px;padding:10px 14px;direction:rtl;border:1px solid rgba(0,0,0,0.06);margin-bottom:2px;">' +
    '<div style="display:flex;gap:6px;align-items:center;">' +
    '<div style="display:flex;flex-direction:column;background:white;border-radius:8px;padding:10px 16px;border-right:3px solid #e5e7eb;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.05);">' +
    '<span style="font-size:12px;color:#9ca3af;font-weight:600;white-space:nowrap;">סעיפים מחכים לנתונים</span>' +
    '<span style="font-size:19px;font-weight:800;color:#d1d5db;margin-top:2px;">0</span>' +
    '</div></div></div>';

  // Row 3 (cf-cards-row): נקה והסתר; v98.4: הסתר גם תווית
  var cf = document.getElementById('cf-cards-row');
  if (cf) { cf.innerHTML = ''; cf.style.display = 'none'; }
  var _lbl0 = document.getElementById('cf-label-summary-month');
  if (_lbl0) _lbl0.style.display = 'none';

  // Summary Bar: מוצג תמיד עם 0 + כפתור תחזית
  var sumRow = document.getElementById('cf-summary-row');
  if (sumRow) {
    var _D  = '<div style="width:1px;background:rgba(255,255,255,0.08);align-self:stretch;margin:0 6px;flex-shrink:0;"></div>';
    var _BD = '<div style="width:3px;background:rgba(255,255,255,0.18);align-self:stretch;margin:0 14px;flex-shrink:0;border-radius:2px;"></div>';
    function _z(lbl) {
      return '<div style="display:flex;flex-direction:column;gap:2px;">' +
        '<span style="font-size:12px;color:rgba(255,255,255,0.35);font-weight:500;">' + lbl + '</span>' +
        '<span style="font-size:18px;font-weight:600;color:rgba(255,255,255,0.2);line-height:1;">0</span></div>';
    }
    var sh = '<div style="background:#0d1b2e;border-radius:10px;padding:13px 16px;display:flex;align-items:center;gap:8px;direction:rtl;border:1px solid rgba(99,102,241,0.15);overflow-x:auto;">';
    sh += '<div style="font-size:13px;font-weight:700;color:#6366f1;white-space:nowrap;line-height:1.6;flex-shrink:0;">שנתי<br><span style="font-size:11px;color:rgba(255,255,255,0.25);">—</span></div>';
    sh += _D; sh += _z('הכנסות'); sh += _z('הוצאות'); sh += _z('נטו');
    sh += _BD;
    sh += '<div style="font-size:13px;font-weight:700;color:#22d3ee;white-space:nowrap;line-height:1.6;flex-shrink:0;">YTD<br><span style="font-size:11px;color:rgba(255,255,255,0.25);">—</span></div>';
    sh += _D; sh += _z('הכנסות'); sh += _z('הוצאות'); sh += _z('נטו');
    sh += _BD;
    sh += '<div style="display:flex;flex-direction:row;gap:6px;flex-wrap:wrap;align-items:center;align-self:stretch;flex-shrink:0;">';
    sh += '<button onclick="cfToggleForecast()" id="cf-forecast-btn" style="display:flex;cursor:pointer;align-items:center;gap:6px;background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.4);border-radius:8px;padding:7px 14px;font-size:12px;font-family:Heebo,sans-serif;white-space:nowrap;">🔮 הצג תחזית</button>';
    sh += '<button onclick="cfSandboxToggle()" id="sb-toggle-btn" style="display:flex;cursor:pointer;align-items:center;gap:6px;background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.35);border-radius:8px;padding:7px 14px;font-size:12px;font-family:Heebo,sans-serif;white-space:nowrap;">🧪 סימולטור</button>';
    sh += '</div></div>';
    sumRow.innerHTML = sh;
    cfSyncForecastBtn();
  }

  // ניקוי טבלה, גרף וכותרת
  var t = document.getElementById('cf-table'); if (t) t.innerHTML = '';
  if (cfChartInstance) { cfChartInstance.destroy(); cfChartInstance = null; }
  ['cf-hdr-current','cf-hdr-ytd','cf-hdr-avg'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.textContent = '—'; el.className = 'stat-value'; }
  });
}

// v36.0: Slim Summary Bar — ימין=שנתי (מסונכרן לגרף) | שמאל=YTD ממשי
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
  // upToMonth: אם החודש הנבחר הוא בשנת displayYear — הגבל עד אליו; אחרת כל השנה
  var upToMonth = (selM && selM.year === displayYear) ? selM.month : 12;

  // ══ שמאל: YTD ממשי ══
  var ytdInc = 0, ytdExp = 0, ytdNet = 0, ytdMonths = 0;
  var ytdSalUsd = 0, ytdExpUsd = 0, ytdTotUsd = 0;
  CF_DATA.forEach(function(m) {
    if (m.year !== displayYear || m.month > upToMonth) return;
    ytdInc     += cfCalcIncome(m.rows);
    ytdExp     += cfCalcExp(m.rows);
    ytdNet     += (cfGetNetVal(m) || 0);
    ytdSalUsd  += m.rows.salary_usd && m.rows.salary_usd.val != null ? m.rows.salary_usd.val : 0;
    ytdExpUsd  += m.rows.exp_usd    && m.rows.exp_usd.val    != null ? m.rows.exp_usd.val    : 0;
    ytdTotUsd  += m.rows.total_usd  && m.rows.total_usd.val  != null ? m.rows.total_usd.val  : 0;
    ytdMonths++;
  });
  var ytdNetCol    = ytdNet    >= 0 ? '#60a5fa' : '#f87171'; // v97.7: תכלת = צבע נטו ראשי (כמו Header KPI)
  var ytdTotUsdCol = ytdTotUsd >= 0 ? '#a5b4fc' : '#fca5a5';
  var ytdRange = (selM && ytdMonths > 1) ? '\u05d9\u05e0\u05d5\u02b9\u2013' + selM.label : (selM ? selM.label : String(displayYear));

  // ══ ימין: שנתי — אותם חודשים כמו הגרף המצטבר (December bar = annNet) ══
  var annInc = 0, annExp = 0, annNet = 0;
  var annSalUsd = 0, annExpUsd = 0, annTotUsd = 0;
  cfGetDisplayMonths().forEach(function(m) {
    annInc    += cfCalcIncome(m.rows);
    annExp    += cfCalcExp(m.rows);
    annNet    += (cfGetNetVal(m) || 0);  // = Tooltip בדצמבר בגרף המצטבר
    annSalUsd += m.rows.salary_usd && m.rows.salary_usd.val != null ? m.rows.salary_usd.val : 0;
    annExpUsd += m.rows.exp_usd    && m.rows.exp_usd.val    != null ? m.rows.exp_usd.val    : 0;
    annTotUsd += m.rows.total_usd  && m.rows.total_usd.val  != null ? m.rows.total_usd.val  : 0;
  });
  var annNetCol    = annNet    >= 0 ? '#60a5fa' : '#f87171'; // v97.7: תכלת = צבע נטו ראשי (כמו Header KPI)
  var annTotUsdCol = annTotUsd >= 0 ? '#a5b4fc' : '#fca5a5';

  // ללא ₪; מינוס רק לנטו שלילי; הוצאות מועברות כ-Math.abs
  function fmt(v) { var a = Math.abs(Math.round(v)); return (v < 0 ? '-' : '') + a.toLocaleString(); }
  function cellBig(lbl, val, col) {
    return '<div style="display:flex;flex-direction:column;gap:2px;">' +
      '<span style="font-size:12px;color:rgba(255,255,255,0.38);font-weight:500;">' + lbl + '</span>' +
      '<span style="font-size:18px;font-weight:600;color:' + col + ';line-height:1;">' + fmt(val) + '</span>' +
      '</div>';
  }
  function cellSmall(lbl, val, col) {
    return '<div style="display:flex;flex-direction:column;gap:1px;">' +
      '<span style="font-size:11px;color:rgba(255,255,255,0.22);font-weight:500;">' + lbl + '</span>' +
      '<span style="font-size:14px;font-weight:700;color:' + col + ';line-height:1;">' + fmt(val) + '</span>' +
      '</div>';
  }

  var DIV  = '<div style="width:1px;background:rgba(255,255,255,0.08);align-self:stretch;margin:0 6px;flex-shrink:0;"></div>';
  var GDIV = '<div style="width:1px;background:rgba(255,255,255,0.12);align-self:stretch;margin:0 14px;flex-shrink:0;"></div>'; // v37: gap רחב בין שקל ל-$
  var BDIV = '<div style="width:3px;background:rgba(255,255,255,0.18);align-self:stretch;margin:0 14px;flex-shrink:0;border-radius:2px;"></div>';

  var html = '<div style="background:#0d1b2e;border-radius:10px;padding:13px 16px;display:flex;align-items:center;gap:8px;direction:rtl;border:1px solid rgba(99,102,241,0.15);overflow-x:auto;">';

  // ── ימין: שנתי ──
  html += '<div style="font-size:13px;font-weight:700;color:#6366f1;white-space:nowrap;line-height:1.6;flex-shrink:0;">\u05e9\u05e0\u05ea\u05d9<br><span style="font-size:11px;color:rgba(255,255,255,0.3);">' + displayYear + '</span></div>';
  html += DIV;
  html += cellBig('\u05d4\u05db\u05e0\u05e1\u05d5\u05ea', annInc, '#4ade80');
  html += cellBig('\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea', Math.abs(annExp), '#f87171');
  html += cellBig('\u05e0\u05d8\u05d5', annNet, annNetCol);
  html += GDIV;
  html += cellSmall('\u05de\u05e9\u05db\u05f3$', annSalUsd, '#818cf8');
  html += cellSmall('\u05d4\u05d5\u05e6\u05f3$', Math.abs(annExpUsd), '#fca5a5');
  html += cellSmall('\u05e1\u05da$', annTotUsd, annTotUsdCol);

  html += BDIV;

  // ── שמאל: YTD ──
  html += '<div style="font-size:13px;font-weight:700;color:#22d3ee;white-space:nowrap;line-height:1.6;flex-shrink:0;">YTD<br><span style="font-size:11px;color:rgba(255,255,255,0.3);">' + ytdRange + '</span></div>';
  html += DIV;
  html += cellBig('\u05d4\u05db\u05e0\u05e1\u05d5\u05ea', ytdInc, '#4ade80');
  html += cellBig('\u05d4\u05d5\u05e6\u05d0\u05d5\u05ea', Math.abs(ytdExp), '#f87171');
  html += cellBig('\u05e0\u05d8\u05d5', ytdNet, ytdNetCol);
  html += GDIV;
  html += cellSmall('\u05de\u05e9\u05db\u05f3$', ytdSalUsd, '#818cf8');
  html += cellSmall('\u05d4\u05d5\u05e6\u05f3$', Math.abs(ytdExpUsd), '#fca5a5');
  html += cellSmall('\u05e1\u05da$', ytdTotUsd, ytdTotUsdCol);

  // v103.4: כפתורי תחזית וסימולטור — באותה שורה אופקית
  html += BDIV;
  html += '<div style="display:flex;flex-direction:row;gap:6px;flex-wrap:wrap;align-items:center;align-self:stretch;flex-shrink:0;">';
  html += '<button onclick="cfToggleForecast()" id="cf-forecast-btn" style="display:flex;cursor:pointer;align-items:center;gap:6px;background:rgba(255,255,255,0.15);color:white;border:1px solid rgba(255,255,255,0.4);border-radius:8px;padding:7px 14px;font-size:12px;font-family:Heebo,sans-serif;white-space:nowrap;">🔮 הצג תחזית</button>';
  html += '<button onclick="cfSandboxToggle()" id="sb-toggle-btn" style="display:flex;cursor:pointer;align-items:center;gap:6px;background:rgba(255,255,255,0.08);color:white;border:1px solid rgba(255,255,255,0.35);border-radius:8px;padding:7px 14px;font-size:12px;font-family:Heebo,sans-serif;white-space:nowrap;">🧪 סימולטור</button>';
  html += '</div>';

  html += '</div>';
  container.innerHTML = html;
  // v55.0: סנכרן טקסט כפתור למצב הפאנל הנוכחי — מונע איפוס בעת החלפת שנה
  cfSyncForecastBtn();
}

// v55.0: מסנכרן טקסט כפתור תחזית למצב הפאנל (פתוח/סגור)
function cfSyncForecastBtn() {
  var panel = document.getElementById('cf-detailed-forecast');
  var btn   = document.getElementById('cf-forecast-btn');
  if (!btn || !panel) return;
  btn.textContent = (panel.style.display !== 'none') ? '🔮 הסתר תחזית' : '🔮 הצג תחזית';
}

// v46.0: Toggle + Render forecast panel
function cfToggleForecast() {
  var panel = document.getElementById('cf-detailed-forecast');
  if (!panel) return;
  var isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  // v47: עדכן טקסט כפתור
  var btn = document.getElementById('cf-forecast-btn');
  if (btn) btn.textContent = isOpen ? '🔮 הצג תחזית' : '🔮 הסתר תחזית';
  if (!isOpen) cfRenderForecast();
  // v97.6: צייר מחדש את הגרף לאחר שינוי הלייאאוט — מונע ציר Y מתאפס
  setTimeout(cfRenderChart, 0);
}

function cfRenderForecast() {
  var panel = document.getElementById('cf-detailed-forecast');
  if (!panel) return;
  // v52.0: קרא תחזית לפי שנה נבחרת בלבד
  var _fcDisplayYear = CF_SELECTED_YEAR || (function() {
    var maxY = 2025;
    for (var di = 0; di < CF_DATA.length; di++) { if (CF_DATA[di].year > maxY) maxY = CF_DATA[di].year; }
    return maxY;
  })();
  var f = CF_FORECAST_BY_YEAR[_fcDisplayYear] || null;
  // v102.2: Interpolate from monthly averages when no Excel forecast is available
  if (!f) {
    var _interpMonths = CF_DATA.filter(function(m) {
      return m.year === _fcDisplayYear && m.rows &&
        (cfCalcIncome(m.rows) > 0 || cfCalcExp(m.rows) > 0);
    });
    if (_interpMonths.length === 0) {
      panel.innerHTML = '<div style="color:#9ca3af;text-align:center;padding:20px;font-size:13px;">אין נתונים לשנת ' + _fcDisplayYear + '</div>';
      return;
    }
    var _n = _interpMonths.length;
    function _avgAnn(field) {
      var sum = 0, cnt = 0;
      _interpMonths.forEach(function(m) { var v = m.rows[field] && m.rows[field].val; if (v != null) { sum += v; cnt++; } });
      return cnt > 0 ? (sum / cnt) * 12 : null;
    }
    f = {
      salary:      _avgAnn('salary'),
      rent_income: _avgAnn('rent_income'),
      visa:        _avgAnn('visa'),
      cash_exp:    _avgAnn('cash_exp'),
      loans:       _avgAnn('loans'),
      yotam:       _avgAnn('yotam'),
      other_exp:   _avgAnn('other_exp'),
      yotam_usd:   _avgAnn('yotam_usd'),
      net_cashflow: _avgAnn('net_cashflow'),
      profit_loss:  _avgAnn('profit_loss'),
      cashflow_total: _avgAnn('delta')
    };
    // Mark as interpolated so note can be shown
    f._interpolated = true;
    f._interpCount = _n;
  }

  // v47.0: Zero Noise — הצג כרטיסייה רק אם val != 0 && val != null
  // כרטיסיות לבנות עם גבול סגול עדין — שורה אופקית אחת (flex-wrap)
  function card(label, val, color) {
    if (val == null || val === 0) return ''; // Zero Noise
    var dispVal = Math.abs(Math.round(val)).toLocaleString();
    return '<div style="background:white;border-radius:9px;padding:9px 14px;border-right:3px solid ' + color + ';border:1px solid rgba(139,92,246,0.18);border-right:3px solid ' + color + ';box-shadow:0 1px 4px rgba(0,0,0,0.07);flex-shrink:0;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;margin-bottom:3px;white-space:nowrap;">' + label + '</div>' +
      '<div style="font-size:16px;font-weight:800;color:' + color + ';white-space:nowrap;">' + dispVal + '</div>' +
      '</div>';
  }

  // v48.0: יותם ושונות — כרטיסיות נפרדות במגירה (כדי לראות 62 ו-11 בנפרד)
  var netVal     = f.profit_loss;
  var netCash    = f.net_cashflow;
  var cashTotal  = f.cashflow_total;
  var netColor   = (netVal != null && netVal >= 0) ? '#16a34a' : '#dc2626';

  function bottomCard(label, val, color) {
    if (val == null || val === 0) return '';
    return '<div style="background:white;border-radius:9px;padding:9px 16px;border-right:3px solid ' + color + ';border:1px solid rgba(139,92,246,0.18);border-right:3px solid ' + color + ';box-shadow:0 1px 4px rgba(0,0,0,0.06);flex-shrink:0;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;margin-bottom:2px;white-space:nowrap;">' + label + '</div>' +
      '<div style="font-size:18px;font-weight:800;color:' + color + ';white-space:nowrap;">' + Math.round(val).toLocaleString() + '</div>' +
      '</div>';
  }

  // v103.7: Calculate sandbox net impact for Annual Forecast
  var _sbAnnualNet = 0;
  if (CF_SANDBOX_EVENTS && CF_SANDBOX_EVENTS.length > 0) {
    CF_SANDBOX_EVENTS.forEach(function(ev) {
      if (ev.year === _fcDisplayYear) {
        _sbAnnualNet += (ev.amount || 0);
      }
    });
  }

  // v49.0: שורה אחת רציפה — כרטיסיות תזרים בצד שמאל (spacer דוחף אותן שמאלה)
  var html = '<div style="direction:rtl;">';
  var _titleLabel = f._interpolated
    ? 'תחזית שנתית — אומדן מ-' + f._interpCount + ' חודשים'
    : 'פירוט תחזית שנתית';
  html += '<div style="font-size:10px;color:#94a3b8;font-weight:600;letter-spacing:0.4px;margin-bottom:3px;direction:rtl;">' + _titleLabel + '</div>';

  // v54.0: 3 גושים: הכנסות | קו | הוצאות | קו | תזרים
  var FDIV = '<div style="width:1px;background:rgba(255,255,255,0.1);align-self:stretch;margin:0 10px;flex-shrink:0;"></div>';
  html += '<div style="display:flex;flex-wrap:nowrap;gap:8px;align-items:flex-start;overflow-x:auto;">';
  // גוש 1: הכנסות
  html += card('משכורת שקלית', f.salary, '#16a34a');
  html += card('שכר דירה', f.rent_income, '#0891b2');
  // קו מפריד: הכנסות | הוצאות
  html += FDIV;
  // גוש 2: הוצאות (ערכים גולמיים ישירות מסיכומים — ללא sum/reduce)
  html += card('ויזה',     f.visa     != null ? Math.abs(f.visa)     : null, '#dc2626');
  html += card('מזומן',   f.cash_exp != null ? Math.abs(f.cash_exp) : null, '#dc2626');
  html += card('הלוואות', f.loans    != null ? Math.abs(f.loans)    : null, '#b45309');
  html += card('יותם',    f.yotam     != null ? Math.abs(f.yotam)     : null, '#ea580c');
  html += card('שונות',   f.other_exp != null ? Math.abs(f.other_exp): null, '#ca8a04');
  // v58.0: יותם $ — כרטיסיית רפרנס דולרית, הכי שמאל בגוש ההוצאות (Zero Noise)
  html += card('יותם $',  f.yotam_usd != null ? Math.abs(f.yotam_usd): null, '#ea580c');
  // קו מפריד: הוצאות | תזרים
  html += FDIV;
  // גוש 3: תזרים — ישירות מסיכומים, ללא חישוב
  html += bottomCard('תזרים שקלי נטו', netCash,   '#3b82f6');
  html += bottomCard('תזרים שוטף',     cashTotal, '#6366f1');
  html += bottomCard('רווח / הפסד',    netVal,    netColor);
  html += '</div>';

  // v103.7: Sandbox net impact row — shown only when there are sandbox events for this year
  if (_sbAnnualNet !== 0) {
    var _sbColor = _sbAnnualNet >= 0 ? '#8b5cf6' : '#dc2626';
    var _sbSign  = _sbAnnualNet > 0 ? '+' : '';
    html += '<div style="margin-top:8px;padding:8px 14px;border-radius:9px;background:rgba(139,92,246,0.08);border:1px dashed rgba(139,92,246,0.35);display:flex;align-items:center;gap:10px;direction:rtl;">';
    html += '<span style="font-size:10px;color:#8b5cf6;font-weight:700;">⚡ השפעת אירועים זמניים</span>';
    html += '<span style="font-size:15px;font-weight:800;color:' + _sbColor + ';">' + _sbSign + Math.round(_sbAnnualNet).toLocaleString() + ' K</span>';
    html += '<span style="font-size:10px;color:#94a3b8;">(סכום נטו של ' + CF_SANDBOX_EVENTS.filter(function(ev){ return ev.year === _fcDisplayYear; }).length + ' אירועים)</span>';
    html += '</div>';
  }

  html += '</div>';
  panel.innerHTML = html;
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

  var isCF  = (id === 'cashflow');
  var isInv = (id === 'investments');
  var isPns = (id === 'pension');
  var isSim = (id === 'simulator');

  // Header stats
  var invStats = document.getElementById('inv-header-stats');
  if(invStats) invStats.style.display = isInv ? '' : 'none';
  var cfStats = document.getElementById('cf-header-stats');
  if(cfStats) cfStats.style.display = isCF ? 'flex' : 'none';
  var pnsStats = document.getElementById('pns-header-stats');
  if(pnsStats) pnsStats.style.display = isPns ? 'flex' : 'none';
  var simStats = document.getElementById('sim-header-stats');
  if(simStats) simStats.style.display = isSim ? 'flex' : 'none';

  // Cards row
  var invCards = document.getElementById('inv-cards-row');
  if(invCards) invCards.style.display = isInv ? '' : 'none';
  var cfCards = document.getElementById('cf-cards-row');
  if(cfCards) cfCards.style.display = isCF ? 'grid' : 'none';
  var cfLblSM = document.getElementById('cf-label-summary-month');
  if(cfLblSM) cfLblSM.style.display = isCF ? 'block' : 'none';

  // Chart section
  var invChart = document.getElementById('inv-chart-section');
  if(invChart) invChart.style.display = isInv ? '' : 'none';

  // Header buttons
  document.querySelectorAll('.inv-only-btn').forEach(function(b){ b.style.display = isInv ? '' : 'none'; });
  document.querySelectorAll('.cf-only-btn').forEach(function(b){ b.style.display = isCF ? 'flex' : 'none'; });
  document.querySelectorAll('.pns-only-btn').forEach(function(b){ b.style.display = isPns ? 'flex' : 'none'; });
  document.querySelectorAll('.sim-only-btn').forEach(function(b){ b.style.display = isSim ? 'flex' : 'none'; });

  // v99.3: categories-scroll always hidden (Master-Detail replaces it)
  var _catScr = document.getElementById('categories-scroll');
  if (_catScr) _catScr.style.display = 'none';

  if (isInv) {
    // switching TO investments: reset to default "all" view → empty area below chart
    var _md = document.getElementById('inv-master-detail');
    if (_md) _md.style.display = 'none';
    invMDCurrentCat  = null;
    invMDCurrentFund = null;
    currentView = 'all';
    document.querySelectorAll('.card, .card-total').forEach(function(c){ c.classList.remove('active'); });
    var _cardAll = document.getElementById('card-all');
    if (_cardAll) _cardAll.classList.add('active');
    if (invViewMode === 'roee') {
      hideEmptyChart();
      updateChart(getFilteredAllTotals ? getFilteredAllTotals() : ALL_TOTALS, '#2563eb', (CAT_NAMES && CAT_NAMES.all) || 'הכל');
    } else {
      showEmptyChart();
    }
  } else {
    // leaving investments: hide Master-Detail
    var _md2 = document.getElementById('inv-master-detail');
    if (_md2) _md2.style.display = 'none';
    invMDCurrentCat  = null;
    invMDCurrentFund = null;
  }

  // v28.0: סגור חלוני צ'אט פתוחים בעת מעבר בין טאבים
  if (cfChatOpen)  { cfChatOpen  = false; var _cfcp  = document.getElementById('cf-cp');  if(_cfcp)  _cfcp.style.display='none'; }
  if (chatOpen)    { chatOpen    = false; var _cp    = document.getElementById('cp');     if(_cp)    _cp.style.display='none'; }
  if (pnsChatOpen) { pnsChatOpen = false; var _pnscp = document.getElementById('pns-cp'); if(_pnscp) _pnscp.style.display='none'; }

  if(isCF && !cfInited){ cfInited=true; setTimeout(cfInit,80); }
  if(isPns && !pensionInited){ pensionInited=true; setTimeout(pensionInit,80); }
  if(isSim && !simInited){ simInited=true; setTimeout(simInit,80); }
}

// חיבור כפתור העדכון ל-fileInput
(function() {
  var fi = document.getElementById('fileInput');
  if (fi) fi.addEventListener('change', function() { smartUploadRouter(this); });
})();

// v56.1: הפעל טאב ברירת מחדל ב-DOMContentLoaded — מפעיל את כל ה-show/hide logic
// v56.2: קרא updateTableCells כדי לאפס תאי HTML לאפס כשאין localStorage
document.addEventListener('DOMContentLoaded', function() {
  switchTab('cashflow');
  updateTableCells(); // מבטיח שתאי טבלת השקעות מציגים 0 כשאין נתוני localStorage
});

// =========================================
// PENSION TAB v1.0
// =========================================

var PENSION_ASSETS  = [];
var PENSION_EVENTS  = [];
var PENSION_NI      = { single: 0, couple: 0 };
var pensionInited   = false;
var pensionExcludeHeritage  = false;
var pnsLegacyExcludeHarel   = false; // סימולציה מקומית לכרטיסיית עיזבון בלבד
var pensionTaxSliderVal    = 50;
var pensionNIMode   = 'single';
var pnsLegacyChart  = null;
var pnsTimelineChart = null;
var pnsViewMode      = 'mine';
var pnsNetMonthly    = 0;
var pnsExcludeHarel  = true; // v102.3: default = ללא הראל
var PNS_SHEET_KEY   = 'ביטוח חיים ופנסיה';
// Israel 2025 approximate tax ceilings
var PNS_MONTHLY_EXEMPT = 9430;   // פטור חודשי (ישן — לא בשימוש בנוסחת הסל)
var PNS_CAPITAL_EXEMPT = 800000; // פטור היוון (ישן — לא בשימוש בנוסחת הסל)
var PNS_MARGINAL_RATE  = 0.30;
var PNS_CAPITAL_RATE   = 0.25;
// סל פטור קיבוע זכויות — ניתן לשינוי ע"י המשתמש
var pnsExemptBasket    = 882924;
var PNS_COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#06b6d4','#f97316'];

// מפרמט תאריך לפורמט ישראלי DD/MM/YYYY — מטפל ב-Date object, string ישראלי, ו-raw JS date string
function pnsFormatDate(v) {
  if (!v) return '';
  // כבר בפורמט DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(String(v))) return String(v);
  // Date object
  if (v instanceof Date) {
    return String(v.getDate()).padStart(2,'0')+'/'+String(v.getMonth()+1).padStart(2,'0')+'/'+v.getFullYear();
  }
  // ניסיון לפרש string כ-Date (כולל raw JS date strings)
  var d = new Date(v);
  if (!isNaN(d.getTime())) {
    return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
  }
  return String(v);
}

function pnsFmt(n) {
  if (!n || n === 0) return '—';
  return Math.round(n).toLocaleString('he-IL');
}
function pnsFmtK(n) {
  if (!n || n === 0) return '—';
  if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000)    return Math.round(n / 1000) + 'K';
  return Math.round(n).toLocaleString('he-IL');
}

function pensionInit() {
  // v102.5: Stateless — always show empty state; data loaded from Excel only
  if (PENSION_ASSETS && PENSION_ASSETS.length > 0) {
    pensionRender();
  } else {
    pensionShowEmpty();
  }
}

function pensionShowEmpty() {
  var c = document.getElementById('pns-content');
  var e = document.getElementById('pns-empty');
  if (c) c.style.display = 'none';
  if (e) e.style.display = 'flex';
}

function pensionRender() {
  var c = document.getElementById('pns-content');
  var e = document.getElementById('pns-empty');
  if (c) c.style.display = '';
  if (e) e.style.display = 'none';
  pensionRenderSnapshot();
  pensionRenderRiskRow();
  pensionRenderCards();
  pensionRenderLumpsums();
  pensionRenderTaxLab();
  pensionRenderLegacy();
}

function pensionActiveAssets() {
  // v80.0: מסנן קופות ממתינות לבדיקה ומפעיל סינון לפי בעלות
  var base = PENSION_ASSETS.filter(function(a){ return !a.isPendingReview; });
  if (pnsViewMode === 'mine') {
    base = base.filter(function(a){ return !a.owner || a.owner === 'רועי'; });
  } else if (pnsViewMode === 'yael') {
    base = base.filter(function(a){ return a.owner === 'יעל'; });
  }
  // 'all' = כל הבעלים
  if (pensionExcludeHeritage) base = base.filter(function(a){ return a.mainPurpose !== 'הורשה'; });
  if (pnsExcludeHarel)        base = base.filter(function(a){ return !a.provider || a.provider.indexOf('הראל') < 0; });
  return base;
}

// ---------- SNAPSHOT — 4 KPIs ----------
function pensionRenderSnapshot() {
  var active       = pensionActiveAssets();
  var totalPension = active.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
  var totalCurrPen = active.reduce(function(s,a){ return s+(a.currentPension||0);  }, 0);
  var totalRealEst = active.reduce(function(s,a){ return s+(a.realEstateIncome||0);}, 0);

  // v87.0: הון צבור — תמיד כולל הראל (נכס קיים גם כש"ללא הראל" מופעל)
  // הראל מוחרג מהקצבה אך לא מהשווי הכולל של התיק
  var activeForAccum = pnsExcludeHarel
    ? PENSION_ASSETS.filter(function(a){
        if (a.isPendingReview) return false;
        if (pnsViewMode === 'mine' && a.owner && a.owner !== 'רועי') return false;
        if (pnsViewMode === 'yael' && a.owner !== 'יעל') return false;
        if (pensionExcludeHeritage && a.mainPurpose === 'הורשה') return false;
        return true; // אין סינון הראל כאן
      })
    : active;
  var totalAccum = activeForAccum.reduce(function(s,a){ return s+(a.accumulation||0); }, 0);
  // v82.0: קצבה נטו = קצבה לאחר מס (רועי) + קצבה שוטפת (יעל, כבר נטו)
  // הכנסה פנויה = שכירות נטו (ללא קשר לקצבה)
  var pensionNetVal = (pnsViewMode === 'yael')
    ? totalCurrPen
    : ((pnsNetMonthly || 0) + totalCurrPen);

  // v83.0: הכנסה פנויה = Cash Flow מלא (קצבה נטו + שכירות נטו)
  var cashFlowVal = pensionNetVal + totalRealEst;

  var items = [
    { lbl:'הון צבור',    val: totalAccum    > 0 ? pnsFmtK(totalAccum)               : '—', sub:'ש״ח',              cls:'capital'  },
    { lbl:'קצבה ברוטו',  val: totalPension  > 0 ? pnsFmt(totalPension)              : '—', sub:'₪/חודש',           cls:'blue'     },
    { lbl:'קצבה נטו',    val: pensionNetVal > 0 ? pnsFmt(Math.round(pensionNetVal))  : '—', sub:'₪/חודש',           cls:'green'    },
    { lbl:'הכנסה פנויה', val: cashFlowVal   > 0 ? pnsFmt(Math.round(cashFlowVal))    : '—', sub:'Cash Flow נטו',   cls:'cashflow' }
  ];

  var statsEl = document.getElementById('pns-snap-stats');
  if (statsEl) {
    // capital = violet-blue (#a5b4fc) | blue = sky (#7dd3fc) | green = bright green | muted = dim
    var colorMap = {capital:'color:#a5b4fc', blue:'color:#7dd3fc', green:'color:#4ade80', muted:'color:rgba(255,255,255,0.35);font-size:14px;font-weight:600', cashflow:'color:#60a5fa;font-weight:800'};
    statsEl.innerHTML = items.map(function(it) {
      var style = colorMap[it.cls] || '';
      return '<div class="stat-item">' +
        '<div class="stat-label">'+it.lbl+'</div>' +
        '<div class="stat-value" style="'+style+'">'+it.val+'</div>' +
        '<div class="stat-change">'+it.sub+'</div>' +
      '</div>';
    }).join('');
  }

  var niArea = document.getElementById('pns-ni-area');
  if (niArea) {
    var hasBoth = (PENSION_NI.single > 0 || PENSION_NI.couple > 0);
    niArea.style.display = hasBoth ? 'flex' : 'none';
    if (hasBoth) {
      niArea.innerHTML =
        '<span style="font-size:10px;color:rgba(255,255,255,0.45);margin-left:6px;">ביטוח לאומי:</span>' +
        '<button class="pns-ni-btn '+(pensionNIMode==='single'?'active':'')+'" onclick="pensionSetNI(\'single\')">יחיד</button> ' +
        '<button class="pns-ni-btn '+(pensionNIMode==='couple'?'active':'')+'" onclick="pensionSetNI(\'couple\')">זוג</button>';
    }
  }
  // הראל toggle — תמיד מוצג; active כשיש נתוני הראל, disabled (greyed) כשאין
  var harelArea = document.getElementById('pns-harel-area');
  if (harelArea) {
    var hasHarel = PENSION_ASSETS.some(function(a){ return a.provider && a.provider.indexOf('הראל') >= 0; });
    harelArea.style.display = 'flex';
    harelArea.style.opacity = hasHarel ? '1' : '0.4';
    harelArea.innerHTML =
      '<span style="font-size:10px;color:white;margin-left:6px;">הראל:</span>' +
      '<button class="pns-ni-btn '+( hasHarel && !pnsExcludeHarel ? 'active' : '')+'" '+
        (hasHarel ? 'onclick="pensionToggleHarel(false)"' : 'disabled style="cursor:default;"') +
        '>עם</button> ' +
      '<button class="pns-ni-btn '+( hasHarel && pnsExcludeHarel  ? 'active' : '')+'" '+
        (hasHarel ? 'onclick="pensionToggleHarel(true)"' : 'disabled style="cursor:default;"') +
        '>ללא</button>';
  }
}

function pensionSetNI(mode) {
  pensionNIMode = mode;
  pensionRenderSnapshot();
}

function pensionToggleHarel(exclude) {
  pnsExcludeHarel = exclude;
  pensionRenderSnapshot();
  pensionRenderRiskRow();
  pensionRenderCards();
  pensionRenderTaxLab();
}

// ---------- MASTER VIEW TOGGLE ----------
function pensionSetView(mode) {
  pnsViewMode = mode;
  var sel = document.getElementById('pns-view-select');
  if (sel) sel.value = mode;
  // v83.0: מחשבון מס — מוסתר ביעל | הורשה — גלויה רק ב"משותף"
  var taxLab = document.getElementById('pns-tax-lab');
  if (taxLab) taxLab.style.display = (mode === 'yael') ? 'none' : '';
  var legacySec = document.getElementById('pns-legacy-section');
  if (legacySec) legacySec.style.display = (mode === 'all') ? '' : 'none';
  pensionRenderSnapshot();
  pensionRenderRiskRow();
  pensionRenderCards();
  pensionRenderLumpsums();
  pensionRenderTaxLab();
}

// ---------- RISK ROW ----------
function pensionRenderRiskRow() {
  var el = document.getElementById('pns-risk-row');
  if (!el) return;
  var active = pensionActiveAssets();
  // v96.1: ביטוח חיים מחושב מכלל הנכסים ללא תלות בטוגל הראל (Single Source of Truth)
  var lifeBase = PENSION_ASSETS.filter(function(a){
    if (a.isPendingReview) return false;
    if (pnsViewMode === 'mine' && a.owner && a.owner !== 'רועי') return false;
    if (pnsViewMode === 'yael' && a.owner !== 'יעל') return false;
    if (pensionExcludeHeritage && a.mainPurpose === 'הורשה') return false;
    return true;
  });
  var totalLifeAll  = lifeBase.reduce(function(s,a){ return s+(a.deathCapital||0); }, 0);
  var pureRiskLife  = lifeBase.filter(function(a){ return a.isRisk; }).reduce(function(s,a){ return s+(a.deathCapital||0); }, 0);
  var accumLifePart = totalLifeAll - pureRiskLife;
  var totalDisab    = active.reduce(function(s,a){ return s+(a.disabilityCover||0); }, 0);
  // v91.0: הגנה מתאונות — מוצגת תמיד ללא תלות ב-Toggle הראל
  var accidentBase = pnsExcludeHarel
    ? PENSION_ASSETS.filter(function(a){
        if (a.isPendingReview) return false;
        if (pnsViewMode === 'mine' && a.owner && a.owner !== 'רועי') return false;
        if (pnsViewMode === 'yael' && a.owner !== 'יעל') return false;
        if (pensionExcludeHeritage && a.mainPurpose === 'הורשה') return false;
        return true; // אין סינון הראל
      })
    : active;
  var totalAccident = accidentBase.reduce(function(s,a){ return s+(a.accidentCover||0); }, 0);
  var realEstAssets = active.filter(function(a){ return a.realEstateIncome > 0; });

  // v91.0: compact = true במצב משותף — 6 כרטיסיות בשורה אחת
  var compact = (pnsViewMode === 'all');
  var cs = compact ? 'flex:1 0 0;min-width:115px;max-width:160px;padding:8px 10px;' : '';

  // tooltip breakdown for life insurance
  var lifeTooltipHtml = totalLifeAll > 0 && (accumLifePart > 0 || pureRiskLife > 0)
    ? '<span class="pns-life-tooltip">ℹ️<div class="pns-life-tooltip-box">' +
        '<div style="font-weight:700;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:4px;">פירוט כיסוי מוות</div>' +
        '<div>סה״כ: <b>' + pnsFmtK(totalLifeAll) + ' ₪</b></div>' +
        (accumLifePart > 0 ? '<div style="color:#93c5fd;">📦 הון צבור: ' + pnsFmtK(accumLifePart) + ' ₪</div>' : '') +
        (pureRiskLife  > 0 ? '<div style="color:#fca5a5;">🔴 ריסק טהור: ' + pnsFmtK(pureRiskLife) + ' ₪</div>' : '') +
      '</div></span>'
    : '';

  var lifeHtml = totalLifeAll > 0
    ? '<div class="pns-risk-item life" style="'+cs+'">' +
        '<div class="pns-risk-icon" style="background:#fef3c7;">🛡️</div>' +
        '<div>' +
          '<div class="pns-risk-lbl">ביטוח חיים / הורשה</div>' +
          '<div class="pns-risk-val" style="display:flex;align-items:center;gap:4px;">' +
            pnsFmtK(totalLifeAll)+' ₪' + lifeTooltipHtml +
          '</div>' +
          '<div class="pns-risk-sub">סה״כ מוות</div>' +
        '</div>' +
      '</div>'
    : '';

  var disabHtml = totalDisab > 0
    ? '<div class="pns-risk-item disab" style="'+cs+'">' +
        '<div class="pns-risk-icon" style="background:#dbeafe;">♿</div>' +
        '<div>' +
          '<div class="pns-risk-lbl">אובדן כושר עבודה</div>' +
          '<div class="pns-risk-val">'+pnsFmt(totalDisab)+' ₪</div>' +
          '<div class="pns-risk-sub">קצבה חודשית</div>' +
        '</div>' +
      '</div>'
    : '';

  var accidentHtml = totalAccident > 0
    ? '<div class="pns-risk-item accid" style="'+cs+'">' +
        '<div class="pns-risk-icon" style="background:#d1fae5;">🏥</div>' +
        '<div>' +
          '<div class="pns-risk-lbl">הגנה מתאונות</div>' +
          '<div class="pns-risk-val">'+pnsFmtK(totalAccident)+' ₪</div>' +
          '<div class="pns-risk-sub">פיצוי אירוע תאונתי</div>' +
        '</div>' +
      '</div>'
    : '';

  var realEstHtml = realEstAssets.map(function(a) {
    var ownerLabel = (pnsViewMode === 'all' && a.owner) ? ' – ' + a.owner : '';
    return '<div class="pns-risk-item" style="border-right-color:#f59e0b;'+cs+'">' +
      '<div class="pns-risk-icon" style="background:#fef3c7;">🏠</div>' +
      '<div>' +
        '<div class="pns-risk-lbl">שכר דירה נטו' + ownerLabel + '</div>' +
        '<div class="pns-risk-val">' + pnsFmt(Math.round(a.realEstateIncome)) + ' ₪</div>' +
        '<div class="pns-risk-sub">₪/חודש</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // v93.1: חישוב ממתינים לפני כל early-return — נגיש בכל המצבים
  var pendingBadgesHtml = '';
  if (pnsViewMode !== 'mine') {
    var pendingForRow = PENSION_ASSETS.filter(function(a){ return a.isPendingReview; });
    if (pendingForRow.length > 0) {
      // v93.2: מבנה אנכי — כותרת מעל, תגים מתחת, כולו ממורכז אנכית
      pendingBadgesHtml =
        '<div style="display:flex;flex-direction:column;align-items:flex-start;align-self:center;' +
                     'border-right:1px solid #e5e7eb;padding-right:10px;margin-right:4px;gap:4px;">' +
          '<span style="font-size:9px;color:#9ca3af;font-weight:600;white-space:nowrap;">ממתינים</span>' +
          '<div style="display:flex;gap:5px;flex-wrap:wrap;">' +
          pendingForRow.map(function(a){
            var label = a.provider + (a.policyId ? ' '+a.policyId : '');
            var amt   = a.accumulation > 0 ? ' '+pnsFmtK(a.accumulation)+' ₪' : '';
            return '<span style="font-size:10px;background:#f3f4f6;color:#6b7280;' +
              'padding:3px 8px;border-radius:12px;border:1px solid #e5e7eb;white-space:nowrap;">' +
              label + amt + '</span>';
          }).join('') +
          '</div>' +
        '</div>';
    }
  }

  // מצב יעל — פנסיה + שכר דירה + ממתינים
  if (pnsViewMode === 'yael') {
    var currPenHtml = active.filter(function(a){ return a.currentPension > 0; }).map(function(a) {
      return '<div class="pns-risk-item" style="border-right-color:#22c55e;">' +
        '<div class="pns-risk-icon" style="background:#dcfce7;">👵</div>' +
        '<div>' +
          '<div class="pns-risk-lbl">פנסיה' + (a.owner ? ' ' + a.owner : '') + '</div>' +
          '<div class="pns-risk-val">' + pnsFmt(a.currentPension) + ' ₪</div>' +
          '<div class="pns-risk-sub">קצבה שוטפת נטו</div>' +
        '</div>' +
      '</div>';
    }).join('');
    el.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
      currPenHtml + realEstHtml + pendingBadgesHtml + '</div>';
    return;
  }

  // v91.0: משותף — שורה שטוחה אחת: ביטוחים (ימין) | spacer | הכנסות (שמאל)
  // v89.0: פנסיה יעל מוצגת בשורת הסטטוס
  var yaelPenHtml = '';
  if (pnsViewMode === 'all') {
    yaelPenHtml = active.filter(function(a){ return a.currentPension > 0 && a.owner === 'יעל'; })
      .map(function(a) {
        return '<div class="pns-risk-item" style="border-right-color:#22c55e;'+cs+'">' +
          '<div class="pns-risk-icon" style="background:#dcfce7;">👵</div>' +
          '<div>' +
            '<div class="pns-risk-lbl">פנסיה ' + (a.owner || '') + '</div>' +
            '<div class="pns-risk-val">' + pnsFmt(a.currentPension) + ' ₪</div>' +
            '<div class="pns-risk-sub">קצבה שוטפת נטו</div>' +
          '</div>' +
        '</div>';
      }).join('');
  }

  var hasIncome = yaelPenHtml || realEstHtml;
  var spacer = (compact && hasIncome && (lifeHtml || disabHtml || accidentHtml))
    ? '<div style="flex:0 0 16px;"></div>'
    : '';

  // כל 6 הכרטיסיות בשורה שטוחה אחת ב-משותף; שתי קבוצות ב-רועי
  if (compact) {
    el.innerHTML = lifeHtml + disabHtml + accidentHtml + spacer + yaelPenHtml + realEstHtml + pendingBadgesHtml;
  } else {
    var insuranceGroup = (lifeHtml || disabHtml || accidentHtml)
      ? '<div style="display:flex;flex-wrap:wrap;gap:8px;flex:1;">' + lifeHtml + disabHtml + accidentHtml + '</div>'
      : '';
    var incomeGroup = hasIncome
      ? '<div style="display:flex;flex-wrap:wrap;gap:8px;">' + realEstHtml + '</div>'
      : '';
    el.innerHTML = insuranceGroup + incomeGroup;
  }
}

// ---------- CARDS ----------
function pensionRenderCards() {
  var grid = document.getElementById('pns-cards-grid');
  if (!grid) return;

  // v88.0: ביעל mode — אזור הכרטיסיות ריק לחלוטין (הכל מוצג בשורת הסטטוס)
  if (pnsViewMode === 'yael') { grid.innerHTML = ''; return; }

  // v80.0: סינון לפי בעלות + מסנן קופות ממתינות
  var active = pensionActiveAssets();
  var activeIds = {};
  active.forEach(function(a){ activeIds[a.id] = true; });

  // v84.0: נכס נדל"ן טהור = רק realEstateIncome, ללא פנסיה/צבירה/ביטוח
  function isPureRealEst(a) {
    return a.realEstateIncome > 0 && !a.accumulation && !a.expectedPension &&
           !a.deathCapital && !a.disabilityCover && !a.currentPension;
  }

  // v89.0: ב-משותף — "קצבה שוטפת בלבד" של יעל שייכת לשורת הסטטוס, לא לגריד
  var currPenOnlyIds = {};
  if (pnsViewMode === 'all') {
    PENSION_ASSETS.forEach(function(a){
      if (a.currentPension > 0 && a.owner === 'יעל' &&
          !a.accumulation && !a.expectedPension && !a.deathCapital &&
          !a.disabilityCover && !a.guaranteedMonths) {
        currPenOnlyIds[a.id] = true;
      }
    });
  }

  // כרטיסיות פנסיה רגילות (לא ריסק, לא נדל"ן טהור, לפחות שדה אחד עם ערך)
  var pensionOnly = PENSION_ASSETS.filter(function(a){
    return !a.isRisk && activeIds[a.id] && !isPureRealEst(a) && !currPenOnlyIds[a.id] &&
      (a.currentPension > 0 || a.expectedPension > 0 || a.accumulation > 0 ||
       a.deathCapital > 0 || a.disabilityCover > 0 || a.guaranteedMonths > 0);
  });

  // v86.0: נדל"ן מוצג בשורת הסטטוס העליונה בלבד — לא בגריד הכרטיסיות
  var realEstCards = [];

  // קופות ממתינות — מוצגות כרשימה קומפקטית, לא כרטיסיות גדולות (v81.0)
  var pendingCards = (pnsViewMode !== 'mine')
    ? PENSION_ASSETS.filter(function(a){ return a.isPendingReview; })
    : [];

  // v87.0: הראל — מוצג גם ב"ללא הראל" אך מעומעם עם תווית הורשה/גיבוי
  var harelMuted = [];
  if (pnsExcludeHarel) {
    var baseNoHarelFilter = PENSION_ASSETS.filter(function(a){
      if (a.isPendingReview) return false;
      if (pnsViewMode === 'mine' && a.owner && a.owner !== 'רועי') return false;
      if (pnsViewMode === 'yael' && a.owner !== 'יעל') return false;
      if (pensionExcludeHeritage && a.mainPurpose === 'הורשה') return false;
      return true;
    });
    harelMuted = baseNoHarelFilter.filter(function(a){
      return !a.isRisk && !activeIds[a.id] && !isPureRealEst(a) &&
        a.provider && a.provider.indexOf('הראל') >= 0 &&
        (a.currentPension > 0 || a.expectedPension > 0 || a.accumulation > 0 ||
         a.deathCapital > 0 || a.disabilityCover > 0 || a.guaranteedMonths > 0);
    });
  }

  if (!pensionOnly.length && !harelMuted.length && !realEstCards.length && !pendingCards.length) {
    grid.innerHTML = '<div style="font-size:12px;color:#9ca3af;padding:8px;">אין נכסי פנסיה פעילים</div>';
    return;
  }

  function renderPensionCard(a, muted) {
    var isHeritage  = (a.mainPurpose === 'הורשה');
    var isMivtachim = (a.provider && a.provider.indexOf('מבטחים') >= 0);
    var displayType = isMivtachim ? 'פנסיה' : a.policyType;
    var borderColor = isHeritage ? '#8b5cf6' : '#3b82f6';
    var iconBg      = isMivtachim ? '#dcfce7' : '#dbeafe';
    var icon        = isMivtachim ? '🏛️' : '🏦';
    var ownerBadge  = a.owner ? '<span class="pns-card-badge" style="background:#f3f4f6;color:#374151;">'+a.owner+'</span>' : '';

    var rows = [];
    if (a.currentPension   > 0) rows.push({ lbl:'קצבה שוטפת (נטו)',  val:pnsFmt(a.currentPension)+' ₪',  cls:'green' });
    if (a.expectedPension  > 0) rows.push({ lbl:'קצבה חודשית',        val:pnsFmt(a.expectedPension)+' ₪', cls:'green' });
    if (a.accumulation     > 0) rows.push({ lbl:'צבירה',               val:pnsFmtK(a.accumulation)+' ₪',  cls:'' });
    if (a.deathCapital     > 0) rows.push({ lbl:'ביטוח חיים',          val:pnsFmtK(a.deathCapital)+' ₪',  cls:'red' });
    if (a.disabilityCover  > 0) rows.push({ lbl:'אכ״ע',                val:pnsFmt(a.disabilityCover)+' ₪', cls:'' });
    if (a.guaranteedMonths > 0) rows.push({ lbl:'חודשים מובטחים',      val:a.guaranteedMonths,             cls:'' });

    var badges = '';
    if (displayType) badges += '<span class="pns-card-badge pns-badge-pension">'+displayType+'</span>';
    if (isHeritage)  badges += '<span class="pns-card-badge pns-badge-heritage">הורשה</span>';
    // v87.0: תווית ייעוד הורשה/גיבוי כאשר הראל מוחרג מהקצבה
    if (muted) badges += '<span class="pns-card-badge" style="background:#fef3c7;color:#92400e;font-size:9px;">להורשה/גיבוי</span>';
    badges += ownerBadge;

    var rowsHtml = rows.map(function(r) {
      return '<div class="pns-card-row"><span class="pns-card-lbl">'+r.lbl+'</span><span class="pns-card-num '+r.cls+'">'+r.val+'</span></div>';
    }).join('');

    var expiryHtml = a.expiryDate ? '<div class="pns-card-expiry">תוקף: '+pnsFormatDate(a.expiryDate)+'</div>' : '';
    var docHtml    = a.documentLink ? '<a class="pns-card-doc-link" href="'+a.documentLink+'" target="_blank">📄 מסמך פוליסה</a>' : '';
    // v88.0: הראל מוחרג — צבע מלא, רק תגית ייעוד (ללא הצללה/אפרוריות)

    return '<div class="pns-card'+(isHeritage?' heritage':'')+'" style="border-right-color:'+borderColor+';">' +
      '<div class="pns-card-header">' +
        '<div class="pns-card-icon" style="background:'+iconBg+';">'+icon+'</div>' +
        '<div><div class="pns-card-provider">'+a.provider+'</div><div class="pns-card-policy">'+a.policyId+'</div></div>' +
        '<div style="margin-right:auto;min-height:36px;display:flex;flex-wrap:wrap;align-content:flex-start;align-items:flex-start;gap:2px;">' + badges + '</div>' +
      '</div>' +
      '<div class="pns-card-rows">'+rowsHtml+'</div>' +
      expiryHtml + docHtml +
    '</div>';
  }

  function renderRealEstCard(a) {
    var ownerBadge = a.owner ? '<span class="pns-card-badge" style="background:#f3f4f6;color:#374151;">'+a.owner+'</span>' : '';
    return '<div class="pns-card" style="border-right-color:#f59e0b;background:#fffbeb;">' +
      '<div class="pns-card-header">' +
        '<div class="pns-card-icon" style="background:#fef3c7;">🏠</div>' +
        '<div><div class="pns-card-provider">'+a.provider+'</div><div class="pns-card-policy">'+a.policyId+'</div></div>' +
        '<div style="margin-right:auto;"><span class="pns-card-badge" style="background:#fef3c7;color:#92400e;">נדל״ן</span>'+ownerBadge+'</div>' +
      '</div>' +
      '<div class="pns-card-rows">' +
        '<div class="pns-card-row"><span class="pns-card-lbl">הכנסה חודשית</span><span class="pns-card-num green">'+pnsFmt(a.realEstateIncome)+' ₪</span></div>' +
        '<div class="pns-card-row"><span class="pns-card-lbl">סטטוס</span><span class="pns-card-num" style="font-size:11px;color:#6b7280;">נטו (לאחר הוצאות)</span></div>' +
      '</div>' +
    '</div>';
  }

  // v92.0: נכסים ממתינים מוצגים כ-Badges בשורת הסטטוס — לא בגריד
  var pendingListHtml = '';

  // v89.0: מיזוג pensionOnly + harelMuted בסדר טבעי לפי PENSION_ASSETS (הראל במיקומו הטבעי)
  var pensionOnlyMap = {}, harelMutedMap = {};
  pensionOnly.forEach(function(a){ pensionOnlyMap[a.id] = true; });
  harelMuted.forEach(function(a){ harelMutedMap[a.id] = true; });
  var allCardsSorted = [];
  PENSION_ASSETS.forEach(function(a){
    if (pensionOnlyMap[a.id])   allCardsSorted.push({ asset: a, muted: false });
    else if (harelMutedMap[a.id]) allCardsSorted.push({ asset: a, muted: true });
  });

  grid.innerHTML =
    allCardsSorted.map(function(c){ return renderPensionCard(c.asset, c.muted); }).join('') +
    realEstCards.map(renderRealEstCard).join('') +
    pendingListHtml;
}

// ---------- LUMP SUMS (zero noise) ----------
function pensionRenderLumpsums() {
  var section = document.getElementById('pns-lumpsum-section');
  var listEl  = document.getElementById('pns-events-list');
  if (!listEl || !section) return;

  if (!PENSION_EVENTS || !PENSION_EVENTS.length) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  var sorted = PENSION_EVENTS.slice().sort(function(a,b){ return a.date.localeCompare(b.date); });
  listEl.innerHTML = sorted.map(function(ev) {
    var pos = ev.amount > 0;
    var dp  = ev.date.split('-');
    var dateDisplay = dp.length===3 ? dp[2]+'/'+dp[1]+'/'+dp[0] : ev.date;
    var dotColor = ev.type==='expense' ? '#dc2626' : ev.type==='transfer' ? '#3b82f6' : '#16a34a';
    return '<div class="pns-event-row">' +
      '<div class="pns-event-dot" style="background:'+dotColor+';"></div>' +
      '<div class="pns-event-date">'+dateDisplay+'</div>' +
      '<div class="pns-event-label">'+ev.label+'</div>' +
      '<div class="pns-event-amt '+(pos?'pos':'neg')+'">'+(pos?'+':'')+pnsFmt(Math.abs(ev.amount))+' ₪</div>' +
    '</div>';
  }).join('');
}

// ---------- TAX LAB ----------
function pensionToggleHeritage(checked) {
  pensionExcludeHeritage = checked;
  pensionRenderSnapshot();
  pensionSliderChange(pensionTaxSliderVal);
}

function pensionRenderTaxLab() {
  var taxLab = document.getElementById('pns-tax-lab');
  if (taxLab) taxLab.style.display = (pnsViewMode === 'yael') ? 'none' : '';
  var legacySec = document.getElementById('pns-legacy-section');
  if (legacySec) legacySec.style.display = (pnsViewMode === 'all') ? '' : 'none';
  pensionSliderChange(pensionTaxSliderVal);
}

// v102.4: מחזיר את שיעור המס השולי (המדרגה הגבוהה ביותר) לפי הכנסה ברוטו חודשית 2026
function pnsGetMarginalRate(grossMonthly) {
  var brackets = [
    { up: 7010, rate: 0.10 },
    { up: 10060, rate: 0.14 },
    { up: 16150, rate: 0.20 },
    { up: 22440, rate: 0.31 },
    { up: 46690, rate: 0.35 },
    { up: 60130, rate: 0.47 },
    { up: Infinity, rate: 0.50 }
  ];
  for (var _bi = brackets.length - 1; _bi >= 0; _bi--) {
    if (grossMonthly > (_bi > 0 ? brackets[_bi - 1].up : 0)) return brackets[_bi].rate;
  }
  return 0.10;
}

// מנוע מס הכנסה חודשי ישראלי — מדרגות 2026 + נקודות זיכוי
function pnsCalcTax(gross) {
  var brackets = [
    { up: 7010,      rate: 0.10 },
    { up: 10060,     rate: 0.14 },
    { up: 16150,     rate: 0.20 },
    { up: 22440,     rate: 0.31 },
    { up: 46690,     rate: 0.35 },
    { up: 60130,     rate: 0.47 },
    { up: Infinity,  rate: 0.50 }
  ];
  var tax = 0;
  var prev = 0;
  for (var i = 0; i < brackets.length; i++) {
    var band = Math.min(gross, brackets[i].up) - prev;
    if (band <= 0) break;
    tax += band * brackets[i].rate;
    prev = brackets[i].up;
  }
  // קיזוז 2.25 נקודות זיכוי × ~241.6 ₪ = 543.6 ₪ לחודש
  var CREDIT = 544;
  return Math.max(0, tax - CREDIT);
}

function pensionSliderChange(val) {
  pensionTaxSliderVal = parseInt(val);
  var sliderEl = document.getElementById('pns-tax-slider');
  if (sliderEl) { sliderEl.value = val; sliderEl.style.setProperty('--pns-val', val + '%'); }
  var capPct = document.getElementById('pns-cap-pct');
  var penPct = document.getElementById('pns-pen-pct');
  if (capPct) capPct.textContent = val + '%';
  if (penPct) penPct.textContent = (100 - val) + '%';

  var active = pensionActiveAssets();
  var totalPension = active.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
  var totalAccum   = PENSION_ASSETS.reduce(function(s,a){ return s+(a.accumulation||0); }, 0);

  // נוסחת סל פטור קיבוע זכויות (v70.0):
  // הון פטור = סל × אחוז היוון
  // קצבה פטורה = (סל × אחוז קצבה) / 180
  var capitalExemptFrac = val / 100;
  var pensionExemptFrac = (100 - val) / 100;
  var capitalExempt = pnsExemptBasket * capitalExemptFrac;
  var monthlyExempt = pnsExemptBasket * pensionExemptFrac / 180;

  // מנוע מס — לפי שיטה שנבחרה ב-dropdown (v75.0)
  var taxMethodEl  = document.getElementById('pns-tax-method');
  var taxMethod    = taxMethodEl ? taxMethodEl.value : 'auto';
  var taxableMonthly = Math.max(0, totalPension - monthlyExempt);
  var taxOnPension;
  if (taxMethod === '31') {
    taxOnPension = taxableMonthly * 0.31;
  } else if (taxMethod === '35') {
    taxOnPension = taxableMonthly * 0.35;
  } else if (taxMethod === '47') {
    taxOnPension = taxableMonthly * 0.47;
  } else {
    taxOnPension = pnsCalcTax(taxableMonthly);
  }
  var netMonthly   = totalPension - taxOnPension;
  // Delta קצבה — הפרש בין "עם פטור" ל"ללא פטור" (v77.0: הון נטו הוסר)
  var taxOnPension_base = (taxMethod === '31') ? totalPension * 0.31
                        : (taxMethod === '35') ? totalPension * 0.35
                        : (taxMethod === '47') ? totalPension * 0.47
                        : pnsCalcTax(totalPension);
  var netMonthly_base = totalPension - taxOnPension_base;
  var deltaMonthly    = netMonthly - netMonthly_base;

  // עדכן global ורענן KPI קצבה נטו ב-snapshot
  pnsNetMonthly = netMonthly;
  pensionRenderSnapshot();

  // אנימציית עיגולים — scale() בתוך מיכל יציב (אין layout shift)
  var capFrac = parseInt(val) / 100;
  var penFrac = (100 - parseInt(val)) / 100;
  // v74: minimum scale 0.85 → text always readable; max 1.15 → fits 180px wrapper
  var capScale = (0.85 + capFrac * 0.30).toFixed(3);
  var penScale = (0.85 + penFrac * 0.30).toFixed(3);
  var circCap = document.getElementById('pns-circle-capital');
  var circPen = document.getElementById('pns-circle-pension');
  if (circCap) circCap.style.transform = 'scale(' + capScale + ')';
  if (circPen) circPen.style.transform = 'scale(' + penScale + ')';
  // עיגול הון: פנים ריק ממספרים — הנתון מוצג מתחת לעיגול (v78.0)
  var capTotalEl = document.getElementById('pns-cap-total');
  if (capTotalEl) capTotalEl.textContent = totalAccum > 0 ? 'סך הון פטור: ' + pnsFmtK(Math.round(capitalExempt)) + ' ₪' : '—';
  // v102.4: Net economic value — uses actual marginal rate when 'auto' selected
  var capNetEl = document.getElementById('pns-cap-net-val');
  if (capNetEl) {
    var _netTaxRate;
    if (taxMethod === '31')       _netTaxRate = 0.31;
    else if (taxMethod === '35')  _netTaxRate = 0.35;
    else if (taxMethod === '47')  _netTaxRate = 0.47;
    else _netTaxRate = pnsGetMarginalRate(taxableMonthly); // auto → actual marginal bracket
    var _netTaxPct = Math.round(_netTaxRate * 100);
    var netEconVal = capitalExempt * _netTaxRate;
    capNetEl.textContent = (totalAccum > 0 && capitalExempt > 0)
      ? 'חיסכון מס (לפי מדרגת מס ' + _netTaxPct + '%): ' + pnsFmtK(Math.round(netEconVal)) + ' ₪'
      : '';
  }

  // עיגול קצבה: מציג חיסכון מס (דלתא) בלבד (v79.0 — הוסרה שורת נטו מהעיגול)
  var circPenVal = document.getElementById('pns-circle-pen-val');
  if (circPenVal) circPenVal.textContent = totalPension > 0 && deltaMonthly > 0 ? '+ ' + pnsFmt(Math.round(deltaMonthly)) + ' ₪' : '—';

  // מתחת לעיגול קצבה: הצג פטור ברוטו — הנתון הטכני
  var penTotalEl = document.getElementById('pns-pen-total');
  if (penTotalEl) penTotalEl.textContent = totalPension > 0 ? 'פטור (ברוטו): ' + pnsFmt(Math.round(monthlyExempt)) + ' ₪/חודש' : '—';
}

function pensionBasketChange(val) {
  var v = parseInt(val) || 882924;
  pnsExemptBasket = Math.max(0, v);
  var inp = document.getElementById('pns-basket-input');
  if (inp) inp.value = pnsExemptBasket;
  var sliderEl = document.getElementById('pns-tax-slider');
  pensionSliderChange(sliderEl ? sliderEl.value : pensionTaxSliderVal);
}

// ---------- WORKING MONEY IN RETIREMENT (v102.2) ----------
var pnsRetirementYield = 3; // % annual default

function pnsRetirementYieldChange(val) {
  pnsRetirementYield = parseFloat(val) || 0;
  var labelEl = document.getElementById('pns-ret-yield-val');
  if (labelEl) labelEl.textContent = pnsRetirementYield.toFixed(1) + '%';
  var sliderEl = document.getElementById('pns-ret-yield-slider');
  if (sliderEl) sliderEl.style.setProperty('--pns-val', (pnsRetirementYield / 6 * 100) + '%');

  var resultEl = document.getElementById('pns-ret-yield-result');
  if (!resultEl) return;

  // Executive Insurance = הראל or פניקס policies with accumulation + expected pension
  var execAssets = PENSION_ASSETS.filter(function(a) {
    return (a.provider && (a.provider.indexOf('\u05d4\u05e8\u05d0\u05dc') >= 0 || a.provider.indexOf('\u05e4\u05e0\u05d9\u05e7\u05e1') >= 0))
      && (a.accumulation || 0) > 0 && (a.expectedPension || 0) > 0;
  });

  var totalCapital = execAssets.reduce(function(s,a){ return s + (a.accumulation||0); }, 0);
  var totalPension = execAssets.reduce(function(s,a){ return s + (a.expectedPension||0); }, 0);

  if (!totalCapital || !totalPension) {
    resultEl.innerHTML = '<div style="color:#9ca3af;font-size:12px;padding:8px 0;">טען נתוני פנסיה (הראל/פניקס) כדי לחשב</div>';
    return;
  }

  var monthlyRate = pnsRetirementYield / 100 / 12;
  var yearsStr;
  if (monthlyRate <= 0) {
    var yrs = totalCapital / (totalPension * 12);
    yearsStr = isFinite(yrs) ? Math.round(yrs) + ' שנים' : '\u221e';
  } else {
    var factor = totalCapital * monthlyRate / totalPension;
    if (factor >= 1) {
      yearsStr = '\u221e — לא יתרוקן';
    } else {
      var months = -Math.log(1 - factor) / Math.log(1 + monthlyRate);
      yearsStr = Math.round(months / 12) + ' שנים';
    }
  }
  var monthlyYieldIncome = totalCapital * monthlyRate;

  resultEl.innerHTML =
    '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;">' +
    '<div style="background:#f0fdf4;border-radius:8px;padding:8px 14px;border-right:3px solid #16a34a;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;">\u05d4\u05d5\u05df \u05d1\u05d9\u05d8\u05d5\u05d7\u05d9</div>' +
      '<div style="font-size:16px;font-weight:800;color:#1a1a2e;">' + pnsFmtK(totalCapital) + ' \u20aa</div>' +
    '</div>' +
    '<div style="background:#eff6ff;border-radius:8px;padding:8px 14px;border-right:3px solid #3b82f6;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;">\u05e7\u05e6\u05d1\u05d4 \u05d7\u05d5\u05d3\u05e9\u05d9\u05ea</div>' +
      '<div style="font-size:16px;font-weight:800;color:#2563eb;">' + pnsFmt(totalPension) + ' \u20aa</div>' +
    '</div>' +
    (monthlyRate > 0 ? '<div style="background:#fefce8;border-radius:8px;padding:8px 14px;border-right:3px solid #ca8a04;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;">\u05d4\u05db\u05e0\u05e1\u05d4 \u05de\u05ea\u05e9\u05d5\u05d0\u05d4</div>' +
      '<div style="font-size:16px;font-weight:800;color:#92400e;">' + pnsFmt(Math.round(monthlyYieldIncome)) + ' \u20aa/\u05d7\u05d5\u05d3\u05e9</div>' +
    '</div>' : '') +
    '<div style="background:#ede9fe;border-radius:8px;padding:8px 14px;border-right:3px solid #8b5cf6;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;">\u05d9\u05d7\u05d6\u05d9\u05e7 \u05e2\u05d3</div>' +
      '<div style="font-size:16px;font-weight:800;color:#7c3aed;">' + yearsStr + '</div>' +
    '</div>' +
    '</div>';
}

// ---------- LEGACY / PIE ----------
function pensionLegacyToggleHarel(checked) {
  pnsLegacyExcludeHarel = checked;
  pensionRenderLegacy();
}

function pensionRenderLegacy() {
  // סינון מקומי לסימולציה ללא הראל (לא משפיע על שאר הדשבורד)
  var legacyAssets = pnsLegacyExcludeHarel
    ? PENSION_ASSETS.filter(function(a){ return !a.provider || a.provider.indexOf('הראל') < 0; })
    : PENSION_ASSETS;

  var totalLegacy = legacyAssets.reduce(function(s,a) {
    return s + (a.deathCapital||0) + (a.guaranteedMonths||0) * (a.expectedPension||0);
  }, 0);

  var totalValEl = document.getElementById('pns-pie-total-val');
  if (totalValEl) totalValEl.textContent = pnsFmtK(totalLegacy) + ' ₪';

  // Build heirs map
  var heirMap = {};
  legacyAssets.forEach(function(a) {
    if (!a.beneficiaries || !a.beneficiaries.length) return;
    var base = (a.deathCapital||0) + (a.guaranteedMonths||0)*(a.expectedPension||0);
    a.beneficiaries.forEach(function(b) {
      if (!b.name || !b.pct) return;
      heirMap[b.name] = (heirMap[b.name]||0) + base * b.pct / 100;
    });
  });
  var heirs = Object.keys(heirMap).map(function(n){ return {name:n, val:Math.round(heirMap[n])}; })
                .sort(function(a,b){ return b.val-a.val; });

  // Pie chart — placeholder אפור אם אין נתוני מוטבים
  var canvas = document.getElementById('pns-pie-chart');
  if (canvas) {
    if (pnsLegacyChart) { pnsLegacyChart.destroy(); pnsLegacyChart = null; }
    var noData = (heirs.length === 0 && totalLegacy === 0);
    var pieData   = noData ? [1] : (heirs.length > 0 ? heirs.map(function(h){ return h.val; }) : [totalLegacy||1]);
    var pieLabels = noData ? ['אין נתונים'] : (heirs.length > 0 ? heirs.map(function(h){ return h.name; }) : ['סה״כ']);
    var pieColors = noData ? ['#e5e7eb'] : PNS_COLORS.slice(0, pieData.length);
    pnsLegacyChart = new Chart(canvas.getContext('2d'), {
      type:'doughnut',
      data: { labels:pieLabels, datasets:[{ data:pieData, backgroundColor:pieColors, borderWidth:noData?0:2, borderColor:'#fff' }] },
      options: {
        cutout:'68%',
        plugins: {
          legend: { display:false },
          tooltip: { enabled:!noData, rtl:true, callbacks:{ label:function(c){ return c.label+': '+pnsFmtK(c.raw)+' ₪'; } } }
        },
        animation: { duration:600 }
      }
    });
  }

  // Heirs list
  var heirsList = document.getElementById('pns-heirs-list');
  if (!heirsList) return;
  var totalH = heirs.reduce(function(s,h){ return s+h.val; }, 0);
  var heirRows = heirs.map(function(h, i) {
    var pct = totalH > 0 ? Math.round(h.val/totalH*100) : 0;
    return '<div class="pns-heir-row">' +
      '<div class="pns-heir-dot" style="background:'+PNS_COLORS[i%PNS_COLORS.length]+';"></div>' +
      '<div class="pns-heir-name">'+h.name+'</div>' +
      '<div class="pns-heir-pct">'+pct+'%</div>' +
      '<div class="pns-heir-val">'+pnsFmtK(h.val)+' ₪</div>' +
    '</div>';
  }).join('');

  if (!heirRows) {
    heirRows = '<div style="font-size:12px;color:#9ca3af;">אין נתוני מוטבים</div>';
  }

  // Document links — מהכלל (לא מסוננים)
  var docLinks = PENSION_ASSETS.filter(function(a){ return a.documentLink; });
  var docHtml = '';
  if (docLinks.length) {
    docHtml = '<div style="margin-top:12px;padding-top:10px;border-top:1px solid #f3f4f6;">' +
      '<div style="font-size:10px;color:#9ca3af;margin-bottom:5px;">מסמכים</div>' +
      docLinks.map(function(a){
        return '<a href="'+a.documentLink+'" target="_blank" style="font-size:11px;color:#3b82f6;text-decoration:none;display:flex;align-items:center;gap:3px;margin-bottom:2px;">📄 '+a.provider+' '+a.policyId+'</a>';
      }).join('') +
    '</div>';
  }
  heirsList.innerHTML = heirRows + docHtml;
}

// ---------- TIMELINE ----------
function pensionRenderTimeline() {
  var listEl = document.getElementById('pns-events-list');
  var chartWrap = document.getElementById('pns-timeline-chart-wrap');
  if (!listEl) return;

  if (!PENSION_EVENTS.length) {
    listEl.innerHTML = '<div style="font-size:12px;color:#9ca3af;padding:8px 0;">אין אירועי ציר זמן</div>';
    if (chartWrap) chartWrap.style.display = 'none';
    return;
  }

  var sorted = PENSION_EVENTS.slice().sort(function(a,b){ return a.date.localeCompare(b.date); });

  listEl.innerHTML = sorted.map(function(ev) {
    var pos = ev.amount > 0;
    var dp = ev.date.split('-');
    var dateDisplay = dp.length===3 ? dp[2]+'/'+dp[1]+'/'+dp[0] : ev.date;
    var dotColor = ev.type==='expense' ? '#dc2626' : ev.type==='transfer' ? '#3b82f6' : '#16a34a';
    return '<div class="pns-event-row">' +
      '<div class="pns-event-dot" style="background:'+dotColor+';"></div>' +
      '<div class="pns-event-date">'+dateDisplay+'</div>' +
      '<div class="pns-event-label">'+ev.label+'</div>' +
      '<div class="pns-event-amt '+(pos?'pos':'neg')+'">'+(pos?'+':'')+pnsFmt(Math.abs(ev.amount))+' ₪</div>' +
    '</div>';
  }).join('');

  if (!chartWrap) return;
  chartWrap.style.display = '';
  var canvas = document.getElementById('pns-timeline-chart');
  if (!canvas) return;
  if (pnsTimelineChart) { pnsTimelineChart.destroy(); pnsTimelineChart = null; }
  pnsTimelineChart = new Chart(canvas.getContext('2d'), {
    type:'bar',
    data: {
      labels: sorted.map(function(ev){ var dp=ev.date.split('-'); return dp.length===3?dp[2]+'/'+dp[1]:ev.date; }),
      datasets:[{
        data: sorted.map(function(ev){ return ev.amount; }),
        backgroundColor: sorted.map(function(ev){ return ev.amount>0?'rgba(22,163,74,0.7)':'rgba(220,38,38,0.7)'; }),
        borderColor:     sorted.map(function(ev){ return ev.amount>0?'#16a34a':'#dc2626'; }),
        borderWidth:1.5, borderRadius:6
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{ rtl:true, callbacks:{ label:function(c){ return pnsFmt(c.raw)+' ₪'; } } } },
      scales:{
        x:{ grid:{display:false}, ticks:{font:{size:10},color:'#9ca3af'} },
        y:{ grid:{color:'rgba(0,0,0,0.04)'}, ticks:{font:{size:10},color:'#9ca3af',callback:function(v){ return pnsFmtK(v); }} }
      }
    }
  });
}

// ---------- PENSION SHEET DETECTOR (content-based) ----------
// מזהה גיליון פנסיה לפי תוכן תאים — בלתי תלוי בשם הגיליון
var PNS_DETECT_KEYWORDS = ['ביטוח חיים', 'קצבה', 'ביטוח מנהלים', 'ייעוד מרכזי', 'תאריך תוקף', 'מקדם', 'מוטבים', 'אכ"ע', 'פנסיה', 'הפניקס'];
var PNS_DETECT_SCORE    = 3; // מספר מילות מפתח מינימלי לזיהוי חיובי

function detectPensionSheet(wb) {
  for (var si = 0; si < wb.SheetNames.length; si++) {
    var sName = wb.SheetNames[si];
    try {
      var sheet = wb.Sheets[sName];
      if (!sheet || !sheet['!ref']) continue;
      var range = XLSX.utils.decode_range(sheet['!ref']);
      range.e.r = Math.min(range.e.r, 34);  // סריקת עד 35 שורות
      range.e.c = Math.min(range.e.c, 19);  // סריקת עד 20 עמודות
      var text = '';
      for (var r = range.s.r; r <= range.e.r; r++) {
        for (var c = range.s.c; c <= range.e.c; c++) {
          var cell = sheet[XLSX.utils.encode_cell({r:r, c:c})];
          if (cell && cell.v) text += String(cell.v) + ' ';
        }
      }
      var score = PNS_DETECT_KEYWORDS.filter(function(kw){ return text.indexOf(kw) >= 0; }).length;
      if (score >= PNS_DETECT_SCORE) return sName;
    } catch(ignored) {}
  }
  return null;
}

// ---------- EXCEL PARSER ----------
function pensionParseWorkbook(wb, sheetName) {
  var resolvedSheet = sheetName || detectPensionSheet(wb);
  if (!resolvedSheet) return null;

  var json = XLSX.utils.sheet_to_json(wb.Sheets[resolvedSheet], { header:1, defval:null });

  // Find header row (first row with 3+ non-empty cells)
  var headerRow = null, headerIdx = 0;
  for (var r = 0; r < Math.min(6, json.length); r++) {
    var row = json[r];
    if (row && row.filter(function(c){ return c && String(c).trim().length > 2; }).length >= 3) {
      headerRow = row; headerIdx = r; break;
    }
  }
  if (!headerRow) return null;

  function findRow(label) {
    for (var i = 0; i < json.length; i++) {
      var cell = json[i] && (json[i][0] || json[i][1]);
      if (cell && String(cell).indexOf(label) >= 0) return i;
    }
    return -1;
  }
  function getNum(ri, ci) {
    if (ri < 0 || !json[ri]) return null;
    var v = json[ri][ci];
    if (v === null || v === undefined || v === '') return null;
    var n = parseFloat(String(v).replace(/,/g,''));
    return isNaN(n) ? null : n;
  }
  function getStr(ri, ci) {
    if (ri < 0 || !json[ri]) return null;
    var v = json[ri][ci];
    if (v === null || v === undefined) return null;
    // v61.0: Date objects מ-XLSX → פורמט ישראלי DD/MM/YYYY
    if (v instanceof Date) {
      var dd = String(v.getDate()).padStart(2,'0');
      var mm = String(v.getMonth()+1).padStart(2,'0');
      var yy = v.getFullYear();
      return dd+'/'+mm+'/'+yy;
    }
    var s = String(v).trim();
    return s || null;
  }

  // v61.0: מיפוי שורות מתוקן
  // קיצבה צפויה — "קיצבה" עם יוד (≠ "קצבה" substring) ← חיפוש ספציפי
  var rPension = findRow('קיצבה');           // "קיצבה צפויה"
  if (rPension < 0) rPension = findRow('צפויה');  // fallback: כל שורה עם "צפויה"
  var rDeath   = findRow('ביטוח חיים');
  var rAccum   = findRow('צבירה');
  if (rAccum < 0) rAccum = findRow('כספים');
  if (rAccum < 0) rAccum = findRow('יתרת כספים'); // v80.0: שם שורה חדש
  // אובדן כושר עבודה (אכ"ע) — ≠ נכות (13,053)
  var rDisab   = findRow('אבדן כושר');
  if (rDisab < 0) rDisab = findRow('אובדן כושר');
  if (rDisab < 0) rDisab = findRow('כושר עבודה');
  if (rDisab < 0) rDisab = findRow('אכ"ע');
  if (rDisab < 0) rDisab = findRow('אק"ע'); // תאימות לאחור — קבצי Excel ישנים
  var rGuarM   = findRow('חודשי קצבה');
  var rGuarC   = findRow('מקדם');
  var rExpiry    = findRow('תאריך תוקף');
  var rPremium   = findRow('פרמיה');
  var rPurpose   = findRow('ייעוד');
  var rTax       = findRow('מיסוי');
  var rBenef     = findRow('מוטבים');
  var rDoc       = findRow('קישור');
  // v80.0: שורות חדשות — מבנה משפחתי + נדל"ן
  var rOwner   = findRow('שייכות');          // "רועי" / "יעל"
  var rCurrPen = findRow('קצבה שוטפת');     // קצבה שכבר משולמת נטו (יעל)
  var rRealEst = findRow('נדל');             // הכנסה מנדל"ן נטו
  if (rRealEst < 0) rRealEst = findRow('שכירות');
  // v85.0: כיסוי תאונתי (נכות/מוות מתאונה)
  var rAccident = findRow('נכות מתאונה');
  if (rAccident < 0) rAccident = findRow('מוות מתאונה');
  if (rAccident < 0) rAccident = findRow('תאונה');

  var assets = [];
  for (var c = 1; c < headerRow.length; c++) {
    var hdr = headerRow[c];
    if (!hdr || !String(hdr).trim()) continue;
    var hdrStr = String(hdr).trim();
    if (hdrStr.indexOf('סה') >= 0 || hdrStr.indexOf('כולל') >= 0 || hdrStr.indexOf('סך') >= 0 || hdrStr.indexOf('ללא') >= 0 || hdrStr.indexOf('סיכום') >= 0) continue;

    var provider = hdrStr, policyId = '';
    var m = hdrStr.match(/^(.+?)\s+(\d{6,15})$/);
    if (m) { provider = m[1]; policyId = m[2]; }
    // v84.0: נורמליזציה — "רעיה" → "יעל" בשם ספק (כותרת עמודה באקסל)
    provider = provider.replace(/רעיה/g, 'יעל');

    var subType = getStr(headerIdx + 2, c);
    var accumVal   = getNum(rAccum, c);
    var pensionVal = getNum(rPension, c);
    var deathVal   = getNum(rDeath, c);
    var disabVal   = getNum(rDisab, c);
    var guarM      = getNum(rGuarM, c);
    var guarC      = getNum(rGuarC, c);
    var expiry     = getStr(rExpiry, c);
    var premium    = getNum(rPremium, c);
    var purpose    = getStr(rPurpose, c);
    var taxSt      = getStr(rTax, c);
    var benefStr   = getStr(rBenef, c);
    var docLink    = getStr(rDoc, c);
    // v80.0: שדות משפחתיים ונדל"ן
    var ownerVal    = getStr(rOwner, c);
    // v84.0: נורמליזציה — "רעיה" הוא שם ישן ל-"יעל" בקובץ אקסל
    if (ownerVal === 'רעיה') ownerVal = 'יעל';
    var currPenVal  = getNum(rCurrPen, c);
    var realEstVal  = getNum(rRealEst, c);
    // v85.0: כיסוי תאונתי
    var accidentVal = getNum(rAccident, c);

    if (!accumVal && !pensionVal && !deathVal && !disabVal && !currPenVal && !realEstVal && !accidentVal) continue;

    var benefList = [];
    if (benefStr) {
      benefStr.split(/[,;\/]/).forEach(function(p) {
        var pm = p.trim().match(/^(.+?)\s*[-–]\s*(\d+)%?$/);
        if (pm) benefList.push({ name:pm[1].trim(), pct:parseInt(pm[2]) });
        else if (p.trim()) benefList.push({ name:p.trim(), pct:null });
      });
    }

    var isRisk = (!pensionVal && !accumVal && deathVal > 0 && !realEstVal);
    if (subType && (subType.indexOf('ריסק') >= 0 || subType.indexOf('מגן') >= 0)) isRisk = true;

    // v80.0: קופה ממתינה לבדיקה — שייכת ליעל, יש יתרה, אין קצבה צפויה/שוטפת
    var isPending = (ownerVal === 'יעל' && (accumVal > 0) && !pensionVal && !currPenVal);

    assets.push({
      id:          (provider+policyId).replace(/\s+/g,''),
      provider:    provider,
      policyId:    policyId,
      policyType:  subType || (isRisk ? 'ריסק' : 'מנהלים'),
      accumulation:    accumVal   || 0,
      expectedPension: pensionVal || 0,
      deathCapital:    deathVal   || 0,
      disabilityCover: disabVal   || 0,
      guaranteedMonths: guarM     || 0,
      guaranteedCoeff:  guarC     || 0,
      mainPurpose:  purpose  || 'קצבה',
      taxStatus:    taxSt    || '',
      beneficiaries: benefList,
      expiryDate:   expiry   || null,
      lastPremium:  premium  || 0,
      documentLink: (docLink && (docLink.indexOf('http')===0 || docLink.indexOf('/')===0)) ? docLink : null,
      isRisk:           isRisk,
      owner:            ownerVal   || '',
      currentPension:   currPenVal || 0,
      realEstateIncome: realEstVal || 0,
      accidentCover:    accidentVal || 0,
      isPendingReview:  isPending
    });
  }
  return assets;
}

function pensionSaveToStorage() {
  // v102.5: Stateless — no data persistence between sessions
}

// =============================================
// SIMULATOR TAB v102.0
// =============================================

var simInited  = false;
var SIM_VIEW   = 'roy'; // 'roy' | 'yael' | 'combined' — v102.3: back to Roy default
var SIM_RATE   = 4;          // % annual interest
var SIM_TARGET_EXP    = 0;   // monthly expense target NIS — set on init
var SIM_INSTRUCTOR_SAL = 20000; // monthly instructor salary NIS
var SIM_EVENTS_ON = {};      // { eventIdx: true/false }
var simChartObj = null;
var SIM_CURRENT_SALARY = 0; // v102.4: cached from CF_DATA on init
var SIM_HAREL_MODE = 'without'; // v102.4: 'with' | 'without' — syncs with pension default

// Phase boundaries
var SIM_P1_START = { y:2026, m:3 };
var SIM_P2_START = { y:2027, m:9 };
var SIM_P3_START = { y:2029, m:9 };
var SIM_END      = { y:2080, m:12 }; // v102.2: extended to age ~90

// ── Formatters ──────────────────────────────
function simFmtK(v) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return Math.round(v).toLocaleString() + 'K';
}
function simFmtNIS(v) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return Math.round(v).toLocaleString() + ' ₪';
}

// ── Data Helpers ─────────────────────────────

// v102.5: Stateless — simLoadLSFunds removed (no localStorage)
function simLoadLSFunds() { return {}; }

function simGetYaelCapital() {
  // v102.5: read only from live FUNDS (no localStorage fallback needed)
  var total = 0;
  Object.keys(FUNDS).forEach(function(k) {
    var f = FUNDS[k];
    if (!f || f.owner !== 'yael') return;
    if (f.pensionMonthly) return; // exclude קצבה חודשית
    for (var i = (f.data||[]).length-1; i>=0; i--) {
      if (f.data[i] !== null && f.data[i] !== undefined && f.data[i] > 0) {
        total += f.data[i]; break;
      }
    }
  });
  return total; // K
}

function simGetRoyCapital() {
  // Sum Roy liquid assets: all non-Yael, non-dira, non-pensionMonthly funds
  // chov (debt) is subtracted (stored as positive, represents liability)
  var total = 0;
  Object.keys(FUNDS).forEach(function(k) {
    var f = FUNDS[k];
    if (!f) return;
    if (f.owner === 'yael') return;
    if (f.pensionMonthly) return;
    if (f.cat === 'dira') return;
    for (var i = (f.data||[]).length-1; i>=0; i--) {
      if (f.data[i] !== null && f.data[i] !== undefined) {
        total += (f.cat === 'chov') ? -f.data[i] : f.data[i];
        break;
      }
    }
  });
  return total; // K
}

function simGetCurrentSalary() {
  // CF_DATA values stored in thousands of NIS → return NIS
  if (!CF_DATA || !CF_DATA.length) { console.log('[SIM] CF_DATA is empty — load cash-flow Excel first'); return 0; }
  for (var i = CF_DATA.length-1; i>=0; i--) {
    var r = CF_DATA[i].rows;
    if (r && r.salary && r.salary.val !== null && r.salary.val !== undefined) return r.salary.val * 1000;
  }
  console.log('[SIM] salary row not found in CF_DATA');
  return 0;
}

function simGetCurrentExpenses() {
  if (!CF_DATA || !CF_DATA.length) return 0;
  for (var i = CF_DATA.length-1; i>=0; i--) {
    var r = CF_DATA[i].rows;
    if (r && r.total_exp && r.total_exp.val !== null && r.total_exp.val !== undefined) return r.total_exp.val * 1000;
  }
  console.log('[SIM] total_exp row not found in CF_DATA');
  return 0;
}

function simGetRoyPension() {
  // v103.4: Phoenix always included as Layer 2; Harel tracked separately as Layer 3
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    if (a.provider && a.provider.indexOf('הראל') >= 0) return s; // Harel → Layer 3
    return s + (a.expectedPension || 0);
  }, 0);
}

// v103.0: Total pension accumulation for Roy (all providers) — returns NIS
function simGetRoyPensionAccum() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    return s + (a.accumulation || 0);
  }, 0);
}

// v103.0: Total monthly premium for Roy — returns NIS/month
function simGetRoyMonthlyPremium() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    return s + (a.lastPremium || 0);
  }, 0);
}

// v103.4: Harel-specific helpers for 3-layer chart
function simGetRoyHarelAccum() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    if (a.provider && a.provider.indexOf('הראל') >= 0) return s + (a.accumulation || 0);
    return s;
  }, 0);
}
function simGetRoyHarelPension() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    if (a.provider && a.provider.indexOf('הראל') >= 0) return s + (a.expectedPension || 0);
    return s;
  }, 0);
}
function simGetRoyHarelPremium() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    if (a.provider && a.provider.indexOf('הראל') >= 0) return s + (a.lastPremium || 0);
    return s;
  }, 0);
}

function simSetHarelMode(mode) {
  SIM_HAREL_MODE = mode;
  ['with', 'without'].forEach(function(n) {
    var btn = document.getElementById('sim-btn-harel-' + n);
    if (btn) btn.classList.toggle('active', n === mode);
  });
  simRenderKPI();
  simRenderChart(simRunEngine());
}

// ── Month index helpers ───────────────────────
// Index 0 = March 2026 (SIM_P1_START)
function simMonthIdx(y, m) {
  return (y - SIM_P1_START.y) * 12 + (m - SIM_P1_START.m);
}
function simIdxToYM(idx) {
  var total = idx + (SIM_P1_START.y * 12 + SIM_P1_START.m - 1);
  var y = Math.floor(total / 12);
  var m = total % 12 + 1;
  return { y: y, m: m };
}

// ── Projection Engine ─────────────────────────
function simRunEngine() {
  // v103.4: 3-layer split — liquid / phoenix / harel; filter isolation for Roy-only view
  var royLiquid        = simGetRoyCapital();                   // K — liquid investments (Layer 1)
  var totalPenK        = simGetRoyPensionAccum() / 1000;       // K — total pension accumulation
  var harelK           = simGetRoyHarelAccum() / 1000;         // K — Harel portion
  var royPhoenixCap    = totalPenK - harelK;                   // K — Layer 2: Phoenix/regular pension
  var royHarelCap      = harelK;                               // K — Layer 3: Harel insurance (הון לירושה)
  var totalPremium     = simGetRoyMonthlyPremium();            // NIS/month
  var harelPremium     = simGetRoyHarelPremium();              // NIS/month
  var phoenixPremium   = totalPremium - harelPremium;          // NIS/month
  // v103.4: filter isolation — Yael zeroed in Roy-only view
  var yaelCapital      = (SIM_VIEW === 'roy') ? 0 : simGetYaelCapital();

  var monthlyRate      = SIM_RATE / 100 / 12;
  var retYieldMonthly  = pnsRetirementYield / 100 / 12;
  var currentSalary    = simGetCurrentSalary();
  var targetExp        = SIM_TARGET_EXP;
  var instructorSal    = SIM_INSTRUCTOR_SAL;
  var royPhoenixPension = simGetRoyPension();        // NIS/month — always drawn in Phase 3 (Layer 2)
  var royHarelPension   = simGetRoyHarelPension();   // NIS/month — drawn only if mode='with' (Layer 3)
  // Total pension income hitting liquid in Phase 3
  var totalPensionIncome = royPhoenixPension + (SIM_HAREL_MODE === 'with' ? royHarelPension : 0);

  var phase2Idx   = simMonthIdx(SIM_P2_START.y, SIM_P2_START.m);
  var phase3Idx   = simMonthIdx(SIM_P3_START.y, SIM_P3_START.m);
  var totalMonths = simMonthIdx(SIM_END.y, SIM_END.m) + 1;

  var eventsByMonth = {};
  if (PENSION_EVENTS && PENSION_EVENTS.length) {
    PENSION_EVENTS.forEach(function(ev, idx) {
      if (SIM_EVENTS_ON[idx] === false) return;
      if (!ev.date) return;
      var dp = ev.date.split('-');
      if (dp.length < 3) return;
      var mIdx = simMonthIdx(parseInt(dp[0]), parseInt(dp[1]));
      if (mIdx < 0 || mIdx >= totalMonths) return;
      if (!eventsByMonth[mIdx]) eventsByMonth[mIdx] = 0;
      eventsByMonth[mIdx] += (ev.amount || 0) / 1000;
    });
  }

  var labels = [], royData = [], yaelData = [], royLiquidData = [], royPhoenixData = [], royHarelData = [];

  for (var i = 0; i < totalMonths; i++) {
    var ym = simIdxToYM(i);

    // ── Layer 2: Phoenix pension capital ──
    if (i < phase3Idx) {
      royPhoenixCap *= (1 + monthlyRate);
      royPhoenixCap += phoenixPremium / 1000;
    } else {
      // v103.5: sustainable withdrawal — compound first, then draw at most the monthly yield
      // so the principal is preserved and the layer never depletes prematurely
      royPhoenixCap *= (1 + retYieldMonthly);
      var _phxDraw = Math.min(royPhoenixPension / 1000, royPhoenixCap * retYieldMonthly);
      royPhoenixCap -= _phxDraw;
      if (royPhoenixCap < 0) royPhoenixCap = 0;
    }

    // ── Layer 3: Harel insurance capital (הון לירושה) ──
    if (i < phase3Idx) {
      royHarelCap *= (1 + monthlyRate);
      royHarelCap += harelPremium / 1000;
    } else {
      // v103.5: same sustainable withdrawal model for Harel if mode='with'
      royHarelCap *= (1 + retYieldMonthly);
      if (SIM_HAREL_MODE === 'with') {
        var _hrlDraw = Math.min(royHarelPension / 1000, royHarelCap * retYieldMonthly);
        royHarelCap -= _hrlDraw;
        if (royHarelCap < 0) royHarelCap = 0;
      }
      // 'without' (default): Harel compounds as inheritance capital — no withdrawals
    }

    // ── Layer 1: Liquid investments ──
    royLiquid *= (1 + monthlyRate);
    if (i < phase2Idx) {
      royLiquid += (currentSalary - targetExp) / 1000;
    } else if (i < phase3Idx) {
      royLiquid += (instructorSal - targetExp) / 1000;
    } else {
      royLiquid += (totalPensionIncome - targetExp) / 1000;
      if (eventsByMonth[i]) royLiquid += eventsByMonth[i];
    }

    yaelCapital *= (1 + monthlyRate);

    if (ym.m === 12 || i === totalMonths - 1) {
      var liqVal = Math.max(0, Math.round(royLiquid));
      var phxVal = Math.max(0, Math.round(royPhoenixCap));
      var hrlVal = Math.max(0, Math.round(royHarelCap));
      labels.push(String(ym.y));
      royLiquidData.push(liqVal);
      royPhoenixData.push(phxVal);
      royHarelData.push(hrlVal);
      royData.push(liqVal + phxVal + hrlVal);
      yaelData.push(Math.max(0, Math.round(yaelCapital)));
    }
  }

  return { labels: labels, royData: royData,
           royLiquidData: royLiquidData, royPhoenixData: royPhoenixData, royHarelData: royHarelData,
           yaelData: yaelData,
           phase1EndLabel: String(SIM_P2_START.y - 1),
           phase2EndLabel: String(SIM_P3_START.y - 1) };
}

// ── Background Shading Plugin ─────────────────
var simBgPlugin = {
  id: 'simBg',
  beforeDraw: function(chart) {
    var ctx = chart.ctx;
    var ca  = chart.chartArea;
    if (!ca) return;
    var labels = chart.data.labels;
    if (!labels || !labels.length) return;
    var xScale = chart.scales.x;
    var i2027 = labels.indexOf('2027');
    var i2029 = labels.indexOf('2029');
    var x0   = ca.left;
    var x1   = (i2027 >= 0) ? xScale.getPixelForValue(i2027) : ca.left + ca.width * 0.05;
    var x2   = (i2029 >= 0) ? xScale.getPixelForValue(i2029) : ca.left + ca.width * 0.10;
    var xEnd = ca.right;
    // Phase 1 — blue
    ctx.fillStyle = 'rgba(59,130,246,0.07)';
    ctx.fillRect(x0, ca.top, x1 - x0, ca.height);
    // Phase 2 — amber
    ctx.fillStyle = 'rgba(245,158,11,0.07)';
    ctx.fillRect(x1, ca.top, x2 - x1, ca.height);
    // Phase 3 — green
    ctx.fillStyle = 'rgba(34,197,94,0.06)';
    ctx.fillRect(x2, ca.top, xEnd - x2, ca.height);
  }
};

// ── Chart Rendering ───────────────────────────
function simRenderChart(result) {
  var wrap = document.getElementById('sim-chart-wrap');
  if (!wrap) return;
  // Re-mount canvas each render
  var old = document.getElementById('sim-chart');
  if (old) old.parentNode.removeChild(old);
  var canvas = document.createElement('canvas');
  canvas.id = 'sim-chart';
  wrap.appendChild(canvas);

  var datasets = [];
  var _yaelRaw = result.yaelData;

  if (SIM_VIEW === 'roy') {
    // v103.4: 3-layer stacked area — Layer1=השקעות, Layer2=הון פנסיוני, Layer3=הון לירושה
    var liq = result.royLiquidData;
    var phx = result.royPhoenixData;
    var hrl = result.royHarelData;
    // cumulative tops for stacking
    var liqTop = liq;
    var phxTop = liq.map(function(v, i) { return v + phx[i]; });
    var hrlTop = liq.map(function(v, i) { return v + phx[i] + hrl[i]; });
    datasets = [
      {
        label: 'השקעות',
        data: liqTop,
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30,64,175,0.45)',
        fill: 'origin',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: 3
      },
      {
        label: 'הון פנסיוני',
        data: phxTop,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.25)',
        fill: '-1',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: 2
      },
      {
        label: 'הון לירושה',
        data: hrlTop,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.20)',
        fill: '-1',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: 1
      }
    ];
  } else if (SIM_VIEW === 'yael') {
    datasets = [{
      label: 'יעל',
      data: result.yaelData,
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236,72,153,0.18)',
      fill: 'origin',
      tension: 0.35, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4
    }];
  } else {
    // v103.6: Combined — 4-layer stacked: Roy(liquid, phoenix, harel) + Yael
    var _cLiq = result.royLiquidData;
    var _cPhx = result.royPhoenixData;
    var _cHrl = result.royHarelData;
    var _cLiqTop = _cLiq;
    var _cPhxTop = _cLiq.map(function(v, i) { return v + _cPhx[i]; });
    var _cHrlTop = _cLiq.map(function(v, i) { return v + _cPhx[i] + _cHrl[i]; });
    var _cYaelTop = _cHrlTop.map(function(v, i) { return v + _yaelRaw[i]; });
    datasets = [
      {
        label: 'השקעות (רועי)',
        data: _cLiqTop,
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30,64,175,0.35)',
        fill: 'origin',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 4
      },
      {
        label: 'הון פנסיוני (רועי)',
        data: _cPhxTop,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.20)',
        fill: '-1',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 3
      },
      {
        label: 'הון לירושה (רועי)',
        data: _cHrlTop,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.16)',
        fill: '-1',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 2
      },
      {
        label: 'יעל',
        data: _cYaelTop,
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236,72,153,0.14)',
        fill: '-1',
        tension: 0.35, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 1
      }
    ];
  }

  simChartObj = new Chart(canvas.getContext('2d'), {
    type: 'line',
    plugins: [simBgPlugin],
    data: { labels: result.labels, datasets: datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          ticks: {
            font: { family: 'Heebo', size: 10 },
            color: '#9ca3af',
            maxTicksLimit: 20,
            maxRotation: 0
          },
          grid: { color: 'rgba(0,0,0,0.04)' }
        },
        y: {
          ticks: {
            callback: function(v) { return v.toLocaleString() + 'K'; },
            font: { family: 'Heebo', size: 10 },
            color: '#9ca3af'
          },
          grid: { color: 'rgba(0,0,0,0.04)' }
        }
      },
      plugins: {
        legend: {
          labels: { font: { family: 'Heebo', size: 12 }, color: '#374151' }
        },
        tooltip: {
          rtl: true,
          textDirection: 'rtl',
          titleFont: { family: 'Heebo' },
          bodyFont: { family: 'Heebo' },
          callbacks: {
            label: function(ctx) {
              var v;
              var di = ctx.dataIndex;
              if (SIM_VIEW === 'combined') {
                // v103.6: 4-layer combined — show individual values per layer
                if (ctx.datasetIndex === 0) v = result.royLiquidData[di];
                else if (ctx.datasetIndex === 1) v = result.royPhoenixData[di];
                else if (ctx.datasetIndex === 2) v = result.royHarelData[di];
                else if (ctx.datasetIndex === 3) v = _yaelRaw[di];
                else v = ctx.parsed.y;
              } else if (SIM_VIEW === 'roy') {
                // Show individual layer value (not cumulative top)
                if (ctx.datasetIndex === 0) v = result.royLiquidData[di];
                else if (ctx.datasetIndex === 1) v = result.royPhoenixData[di];
                else if (ctx.datasetIndex === 2) v = result.royHarelData[di];
                else v = ctx.parsed.y;
              } else {
                v = ctx.parsed.y;
              }
              return ' ' + ctx.dataset.label + ': ' + (v || 0).toLocaleString() + 'K';
            }
          }
        }
      }
    }
  });
}

// ── KPI Rendering ─────────────────────────────
function simRenderKPI() {
  var royCapital  = simGetRoyCapital();
  var yaelCapital = simGetYaelCapital();
  var rawSal  = simGetCurrentSalary();
  var salary  = (rawSal > 0) ? rawSal : SIM_CURRENT_SALARY;
  var expenses = SIM_TARGET_EXP;
  var delta    = salary - expenses;
  var pension  = simGetRoyPension();
  // v103.1: pension accumulation — show 0K when no data (never show ghost)
  var penAccumK = simGetRoyPensionAccum() / 1000;

  function el(id) { return document.getElementById(id); }

  // v103.4: filter isolation — zero out Yael KPIs when view=Roy only
  var _showYael = (SIM_VIEW !== 'roy');
  if (el('sim-kpi-roy-now'))  el('sim-kpi-roy-now').textContent  = simFmtK(royCapital);
  if (el('sim-kpi-yael-now')) el('sim-kpi-yael-now').textContent = _showYael ? simFmtK(yaelCapital) : '—';
  if (el('sim-kpi-combined')) el('sim-kpi-combined').textContent = _showYael ? simFmtK(royCapital + yaelCapital) : simFmtK(royCapital);
  if (el('sim-kpi-salary'))   el('sim-kpi-salary').textContent   = simFmtNIS(salary);
  if (el('sim-kpi-exp'))      el('sim-kpi-exp').textContent      = simFmtNIS(expenses);
  var deltaEl = el('sim-kpi-delta');
  if (deltaEl) {
    deltaEl.textContent = simFmtNIS(delta);
    deltaEl.style.color = delta >= 0 ? '#16a34a' : '#dc2626';
  }
  // v103.4: pension KPI includes Harel if mode='with'
  var totalPension = pension + (SIM_HAREL_MODE === 'with' ? simGetRoyHarelPension() : 0);
  if (el('sim-kpi-pension'))    el('sim-kpi-pension').textContent    = totalPension > 0 ? simFmtNIS(totalPension) : '—';
  // v103.1: always display, shows 0K before upload (no ghost data)
  if (el('sim-kpi-pen-accum')) el('sim-kpi-pen-accum').textContent = penAccumK > 0 ? simFmtK(penAccumK) : '—';

  // Header stats — v103.4: filter isolation
  if (el('sim-hdr-roy'))      el('sim-hdr-roy').textContent      = simFmtK(royCapital);
  if (el('sim-hdr-yael'))     el('sim-hdr-yael').textContent     = _showYael ? simFmtK(yaelCapital) : '—';
  if (el('sim-hdr-combined')) el('sim-hdr-combined').textContent = _showYael ? simFmtK(royCapital + yaelCapital) : simFmtK(royCapital);
  var hdrDelta = el('sim-hdr-delta');
  if (hdrDelta) {
    hdrDelta.textContent = simFmtNIS(delta);
    hdrDelta.style.color = delta >= 0 ? '#4ade80' : '#f87171';
  }
}

// ── Events Ledger ─────────────────────────────
function simRenderEvents() {
  var section = document.getElementById('sim-events-section');
  var list    = document.getElementById('sim-events-list');
  if (!list) return;

  if (!PENSION_EVENTS || !PENSION_EVENTS.length) {
    list.innerHTML = '<div class="sim-events-empty">אין אירועים. טען קובץ פנסיה כדי לצפות באירועים ולשלוט בהם.</div>';
    if (section) section.style.display = '';
    return;
  }

  // Init toggle states
  PENSION_EVENTS.forEach(function(_, idx) {
    if (SIM_EVENTS_ON[idx] === undefined) SIM_EVENTS_ON[idx] = true;
  });

  var sorted = PENSION_EVENTS.map(function(ev, idx) { return { ev: ev, idx: idx }; })
    .sort(function(a, b) { return (a.ev.date || '').localeCompare(b.ev.date || ''); });

  list.innerHTML = sorted.map(function(item) {
    var ev  = item.ev, idx = item.idx;
    var on  = SIM_EVENTS_ON[idx] !== false;
    var dp  = (ev.date || '').split('-');
    var dateDisp = dp.length === 3 ? dp[2]+'/'+dp[1]+'/'+dp[0] : (ev.date || '');
    var pos = (ev.amount || 0) > 0;
    var amtStr = (pos ? '+' : '') + Math.round(Math.abs(ev.amount || 0)).toLocaleString() + ' ₪';
    var dotColor = ev.type === 'expense' ? '#dc2626' : ev.type === 'transfer' ? '#3b82f6' : '#16a34a';
    return '<div class="sim-event-row' + (on ? '' : ' sim-ev-off') + '">' +
      '<label class="sim-ev-switch">' +
        '<input type="checkbox" ' + (on ? 'checked' : '') + ' onchange="simToggleEvent(' + idx + ',this.checked)">' +
        '<span class="sim-ev-rail"></span>' +
      '</label>' +
      '<span class="sim-ev-dot" style="background:' + dotColor + '"></span>' +
      '<span class="sim-ev-date">' + dateDisp + '</span>' +
      '<span class="sim-ev-label">' + (ev.label || '—') + '</span>' +
      '<span class="sim-ev-amt ' + (pos ? 'pos' : 'neg') + '">' + amtStr + '</span>' +
    '</div>';
  }).join('');

  if (section) section.style.display = '';
}

function simToggleEvent(idx, checked) {
  SIM_EVENTS_ON[idx] = !!checked;
  simRenderEvents();
  simRenderChart(simRunEngine());
}

// ── Controls ──────────────────────────────────
function simSetView(v) {
  SIM_VIEW = v;
  ['roy', 'yael', 'combined'].forEach(function(n) {
    var btn = document.getElementById('sim-btn-' + n);
    if (btn) btn.classList.toggle('active', n === v);
  });
  simRenderKPI(); // v103.8: update KPI cards (zero out Yael when roy-only)
  simRenderChart(simRunEngine());
}

function simSetRate(r) {
  SIM_RATE = parseFloat(r);
  var el = document.getElementById('sim-rate-val');
  if (el) el.textContent = SIM_RATE + '%';
  simRenderChart(simRunEngine());
}

function simSetExpense(e) {
  SIM_TARGET_EXP = parseFloat(e);
  var el = document.getElementById('sim-exp-val');
  if (el) el.textContent = simFmtNIS(SIM_TARGET_EXP);
  simRenderChart(simRunEngine());
}

function simSetInstructor(s) {
  SIM_INSTRUCTOR_SAL = parseFloat(s);
  var el = document.getElementById('sim-instr-val');
  if (el) el.textContent = simFmtNIS(SIM_INSTRUCTOR_SAL);
  simRenderChart(simRunEngine());
}

// v103.2: Show/hide simulator content based on data availability
function simCheckEmpty() {
  var hasData = (simGetRoyCapital() > 0 || simGetYaelCapital() > 0 ||
                 simGetRoyPensionAccum() > 0 || (CF_DATA && CF_DATA.length > 0));
  var kpiRow   = document.getElementById('sim-kpi-row');
  var chartSec = document.getElementById('sim-chart-wrap') ? document.getElementById('sim-chart-wrap').parentElement : null;
  var phaseLeg = document.querySelector('.sim-phase-legend');
  var emptyMsg = document.getElementById('sim-empty-msg');
  var ctrlRow  = document.querySelector('.sim-controls-row');

  if (hasData) {
    if (kpiRow)   kpiRow.style.display   = '';
    if (chartSec) chartSec.style.display = '';
    if (phaseLeg) phaseLeg.style.display = '';
    if (ctrlRow)  ctrlRow.style.display  = '';
    if (emptyMsg) emptyMsg.style.display = 'none';
  } else {
    if (kpiRow)   kpiRow.style.display   = 'none';
    if (chartSec) chartSec.style.display = 'none';
    if (phaseLeg) phaseLeg.style.display = 'none';
    if (ctrlRow)  ctrlRow.style.display  = 'none';
    if (emptyMsg) emptyMsg.style.display = 'flex';
  }
  return hasData;
}

// ── Init ──────────────────────────────────────
function simInit() {
  // v102.5: Stateless — pension data already in PENSION_ASSETS/PENSION_EVENTS if Excel was uploaded

  // v103.2: show empty state if no data loaded yet
  if (!simCheckEmpty()) return;

  // Diagnostics — open browser console to debug zero-capital issues
  var _royK  = simGetRoyCapital();
  var _yaelK = simGetYaelCapital();
  var _sal   = simGetCurrentSalary();
  var _exp   = simGetCurrentExpenses();
  console.log('[SIM v102.1] Roy capital:', _royK, 'K | Yael capital:', _yaelK, 'K');
  console.log('[SIM v102.1] CF_DATA entries:', CF_DATA ? CF_DATA.length : 0, '| Salary:', _sal, '₪ | Expenses:', _exp, '₪');
  console.log('[SIM v102.1] Pension assets:', PENSION_ASSETS ? PENSION_ASSETS.length : 0, '| Pension events:', PENSION_EVENTS ? PENSION_EVENTS.length : 0);
  console.log('[SIM v102.1] ALL_TOTALS latest:', ALL_TOTALS && ALL_TOTALS.length ? Math.round(ALL_TOTALS[ALL_TOTALS.length-1]) : 'empty');
  if (_royK === 0) console.warn('[SIM] Roy capital = 0 — asset Excel may not be loaded. Check FUNDS:', Object.keys(FUNDS).filter(function(k){ var f=FUNDS[k]; return f && !f.owner && f.cat !== 'dira'; }).length, 'Roy funds found');
  if (_sal === 0)  console.warn('[SIM] Salary = 0 — cash-flow Excel may not be loaded');

  // v102.4: cache salary so KPIs show correct values even when CF_DATA re-queried returns 0
  SIM_CURRENT_SALARY = (_sal > 0) ? _sal : SIM_CURRENT_SALARY;
  // Set expense default from real CF_DATA or fallback
  SIM_TARGET_EXP = (_exp > 0) ? _exp : (SIM_TARGET_EXP > 0 ? SIM_TARGET_EXP : 58000);
  var expSlider = document.getElementById('sim-exp-slider');
  if (expSlider) expSlider.value = SIM_TARGET_EXP;
  var expValEl = document.getElementById('sim-exp-val');
  if (expValEl) expValEl.textContent = simFmtNIS(SIM_TARGET_EXP);

  simRenderKPI();
  simRenderEvents();
  simRenderChart(simRunEngine());
  pnsRetirementYieldChange(pnsRetirementYield); // v102.3: init slider in simulator
}

// v102.5: Re-read live data after Excel upload and re-render simulator
function simRefresh() {
  if (!simInited) return;
  // v103.2: if first upload — show content and run full init instead
  var hadData = simCheckEmpty();
  if (!hadData) { simInit(); return; }
  var _sal = simGetCurrentSalary();
  var _exp = simGetCurrentExpenses();
  if (_sal > 0) SIM_CURRENT_SALARY = _sal;
  if (_exp > 0) {
    SIM_TARGET_EXP = _exp;
    var expSlider = document.getElementById('sim-exp-slider');
    if (expSlider) expSlider.value = SIM_TARGET_EXP;
    var expValEl = document.getElementById('sim-exp-val');
    if (expValEl) expValEl.textContent = simFmtNIS(SIM_TARGET_EXP);
  }
  simRenderKPI();
  simRenderChart(simRunEngine());
}
