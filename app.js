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

// v168.12: explicit demo mode flag — true ONLY when user activates demo toggle
var isDemoMode = false;
// v169.7: global mode — null | 'EXCEL' | 'DEMO' | 'SIMULATOR'
// null = Mode 0 (no source selected) — shown to new users or after full reset
var APP_MODE = null;
// v169.1: dedicated localStorage key for personal simulator (isolated from Excel/Demo)
var SIMULATOR_LS_KEY = 'FINANCIAL_SIM_PERSONAL_DATA';
// v169.6: migrated from _sessionExcelUploaded JS var → sessionStorage.hasUploadedFiles
// Use sessionStorage.getItem('hasUploadedFiles') === '1' to read, setItem/removeItem to write.

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
// v103.10: subtract cumulative Column K deposits from each balance point → organic growth curve
function buildCatChartTotals() {
  var filterFn = invFundFilter();
  const totals = { mezuman:[], chov:[], arbitrage:[], dira:[], hishtalmut:[], gemel:[], gemel_invest:[], harel:[], meitav:[] };
  const lastIdx = LABELS.length - 1;
  Object.entries(totals).forEach(([cat, arr]) => {
    // v103.10-Investments-v2: exclude funds with 0 forward-filled balance at latest index (inactive/closed funds)
    const fundEntries = Object.entries(FUNDS).filter(([,f]) => {
      if (f.cat !== cat || !filterFn(f)) return false;
      const ffLast = ffFundData(f.data);
      return (ffLast[lastIdx] || 0) > 0;
    });
    const ffed = fundEntries.map(([,f]) => ffFundData(f.data));
    var cumulativeK = 0; // running sum of Column K deposits across all months for organic netting
    LABELS.forEach((_, i) => {
      // Accumulate Column K deposits made in month i
      fundEntries.forEach(([k]) => {
        var colK = FUND_COL_K[k] || [];
        var kv = (i < colK.length) ? colK[i] : null;
        if (typeof kv === 'number' && !isNaN(kv)) cumulativeK += kv;
      });
      var rawTotal = ffed.reduce((s, fd) => s + (fd[i]||0), 0);
      // Organic balance = raw balance minus all cumulative deposits to date
      arr.push(rawTotal > 0 ? Math.max(0, rawTotal - cumulativeK) : 0);
    });
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

// =========================================
// v160.0: GLOBAL STATE PERSISTENCE
// =========================================
var _DASH_ASSETS_LS_KEY  = 'dashboard_assets_v1';
var _DASH_CF_LS_KEY      = 'dashboard_cf_v1';
var _DASH_PENSION_LS_KEY = 'dashboard_pension_v1';

function _dashSaveAssets() {
  try {
    var payload = { labels: Array.from(LABELS), fundData: {}, yaelMeta: {} };
    Object.keys(FUNDS).forEach(function(k) {
      payload.fundData[k] = FUNDS[k].data;
      if (k.startsWith('yd_')) {
        payload.yaelMeta[k] = { name: FUNDS[k].name, cat: FUNDS[k].cat,
          owner: FUNDS[k].owner || 'yael', liquidity: FUNDS[k].liquidity,
          pensionMonthly: !!FUNDS[k].pensionMonthly };
      }
    });
    localStorage.setItem(_DASH_ASSETS_LS_KEY, JSON.stringify(payload));
  } catch(e) { console.warn('[dash-persist] assets save failed:', e.message); }
}

function _dashSaveCF() {
  try {
    localStorage.setItem(_DASH_CF_LS_KEY, JSON.stringify({
      data: CF_DATA, currentId: CF_CURRENT_MONTH_ID
    }));
  } catch(e) { console.warn('[dash-persist] CF save failed:', e.message); }
}

function _dashSavePension() {
  try { localStorage.setItem(_DASH_PENSION_LS_KEY, JSON.stringify(PENSION_ASSETS)); }
  catch(e) { console.warn('[dash-persist] pension save failed:', e.message); }
}

function _dashRestoreAssets() {
  var raw = localStorage.getItem(_DASH_ASSETS_LS_KEY);
  if (!raw) return false;
  try {
    var payload = JSON.parse(raw);
    if (!payload || !Array.isArray(payload.labels) || !payload.labels.length) return false;
    LABELS.length = 0;
    payload.labels.forEach(function(l) { LABELS.push(l); });
    if (payload.yaelMeta) {
      Object.keys(payload.yaelMeta).forEach(function(k) {
        if (!FUNDS[k]) {
          var m = payload.yaelMeta[k];
          FUNDS[k] = { name: m.name, cat: m.cat, owner: m.owner,
            liquidity: m.liquidity, pensionMonthly: m.pensionMonthly,
            data: new Array(payload.labels.length).fill(null) };
          FUND_COLORS[k] = '#ec4899';
        }
      });
    }
    if (payload.fundData) {
      Object.keys(payload.fundData).forEach(function(k) {
        if (FUNDS[k]) FUNDS[k].data = payload.fundData[k];
      });
    }
    rebuildInvTotals();
    ALL_TOTALS.length = 0;
    LABELS.forEach(function(_, i) {
      var t = 0;
      Object.keys(CAT_TOTALS).forEach(function(cat) {
        t += cat === 'chov' ? -(CAT_TOTALS[cat][i]||0) : (CAT_TOTALS[cat][i]||0);
      });
      ALL_TOTALS.push(t);
    });
    CAT_CHART_TOTALS = buildCatChartTotals();
    winStart = Math.max(0, LABELS.length - WINDOW);
    return true;
  } catch(e) { console.warn('[dash-persist] assets restore failed:', e.message); return false; }
}

function _dashRestoreCF() {
  var raw = localStorage.getItem(_DASH_CF_LS_KEY);
  if (!raw) return false;
  try {
    var payload = JSON.parse(raw);
    if (!payload || !Array.isArray(payload.data) || !payload.data.length) return false;
    CF_DATA = payload.data;
    CF_CURRENT_MONTH_ID = payload.currentId || (typeof cfGetDefaultMonthId === 'function' ? cfGetDefaultMonthId(CF_DATA) : null);
    return true;
  } catch(e) { console.warn('[dash-persist] CF restore failed:', e.message); return false; }
}

function _dashRestorePension() {
  var raw = localStorage.getItem(_DASH_PENSION_LS_KEY);
  if (!raw) return false;
  try {
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return false;
    PENSION_ASSETS = parsed;
    return true;
  } catch(e) { console.warn('[dash-persist] pension restore failed:', e.message); return false; }
}

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
  // v103.34: הכרות/העברות — restored EXTERNAL_EVENTS (hard-coded known transfers)
  // Phoenix 414 and הכרה 173 were never in FUND_COL_K; only Meitav 83k is in col K.
  // Window filter: col must be within current 13-month window (winStart+1 .. winStart+WINDOW-1)
  const _EXTERNAL_EVENTS = [
    { col: 0,  amt: 286, desc: 'הראל כללי' },
    { col: 10, amt: 414, desc: 'פניקס' },
    { col: 13, amt: 83,  desc: 'מיטב 83k' },
    { col: 14, amt: 173, desc: 'הכרה במזומן' },
  ];
  const _extEnd = Math.min(winStart + WINDOW - 1, LABELS.length - 1);
  const externalAmt = _EXTERNAL_EVENTS
    .filter(function(e) { return e.col > winStart && e.col <= _extEnd; })
    .reduce(function(s, e) { return s + e.amt; }, 0);
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
      // v103.11: apply Column K netting for all-view and single fund window return
      var _singleRetKMov = 0;
      const _winEndIdx = winStart + w.data.length - 1;
      if (!currentFund) {
        // "all" view — sum K movements for all active, invFilter-passing funds during window
        const _invFlt2 = invFundFilter();
        Object.entries(FUNDS).forEach(function(e) {
          var k = e[0], f = e[1];
          if (!_invFlt2(f)) return;
          if (!((f.data[_winEndIdx]||0) > 0)) return;
          var colK = FUND_COL_K[k] || [];
          for (var ki = winStart + 1; ki <= _winEndIdx; ki++) {
            var kv = ki < colK.length ? colK[ki] : null;
            if (typeof kv === 'number' && !isNaN(kv)) _singleRetKMov += kv;
          }
        });
      } else if (FUNDS[currentFund]) {
        var _singleColK = FUND_COL_K[currentFund] || [];
        for (var _ski = winStart + 1; _ski <= _winEndIdx; _ski++) {
          var _skv = (_ski < _singleColK.length) ? _singleColK[_ski] : null;
          if (typeof _skv === 'number' && !isNaN(_skv)) _singleRetKMov += _skv;
        }
      }
      var _singleNetDelta = (last - first) - _singleRetKMov;
      const ret = (_singleNetDelta / first * 100).toFixed(1);
      returnEl.textContent = Math.abs(parseFloat(ret)).toFixed(1) + '%';
      returnEl.style.color = parseFloat(ret) >= 0 ? '#16a34a' : '#ef4444';
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
  // v151.0: mode buttons removed from chat header — guard against missing elements
  var _mp = document.getElementById('mode-portfolio');
  var _me = document.getElementById('mode-explore');
  if (_mp) { _mp.style.background = isExplore ? 'transparent' : '#4ade80'; _mp.style.color = isExplore ? '#aaa' : '#0f0f23'; }
  if (_me) { _me.style.background = isExplore ? '#818cf8' : 'transparent'; _me.style.color = isExplore ? '#0f0f23' : '#aaa'; }
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
    // v168.0: show context buttons only from Investments tab
    var _ctxBtns = document.getElementById('chat-context-btns');
    if (_ctxBtns) {
      var _activeTab = '';
      try { _activeTab = localStorage.getItem('active_tab') || ''; } catch(e) {}
      _ctxBtns.style.display = (_activeTab === 'investments') ? 'flex' : 'none';
    }
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
    var ctx = buildGlobalContext(); // v168.59: full context — all tabs
    // v168.69: detect active tab for domain routing hint
    var _activeTab = '';
    try { _activeTab = localStorage.getItem('active_tab') || ''; } catch(e) {}
    var _tabHint = _activeTab === 'simulator' ? 'המשתמש נמצא כעת בלשונית הסימולטור — תעדף ניתוח SIMULATOR_DOMAIN.\n' :
                  _activeTab === 'pension'    ? 'המשתמש נמצא כעת בלשונית הפנסיה — תעדף ניתוח PENSION_DOMAIN.\n' :
                  _activeTab === 'cashflow'   ? 'המשתמש נמצא כעת בלשונית התזרים — תעדף ניתוח CASHFLOW_DOMAIN.\n' :
                  _activeTab === 'overview'   ? 'המשתמש נמצא בלשונית מבט על — עודד ניתוח הוליסטי כולל.\n' : '';
    // v168.69: systemStatus — data availability per domain
    var _status = buildSystemStatus();
    var _statusText = '\n--- systemStatus (זמינות נתונים) ---\n' +
      'CASHFLOW_DOMAIN: '   + _status.CASHFLOW_DOMAIN   + '\n' +
      'INVESTMENT_DOMAIN: ' + _status.INVESTMENT_DOMAIN + '\n' +
      'PENSION_DOMAIN: '    + _status.PENSION_DOMAIN    + '\n' +
      'SIMULATOR_DOMAIN: '  + _status.SIMULATOR_DOMAIN  + '\n' +
      'DEMO_MODE: '         + _status.DEMO_MODE         + '\n' +
      '---\n';
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
      : _statusText + _tabHint + 'אתה היועץ הפיננסי האישי הראשי. יש לך גישה לתמונה הכוללת.\n' +
        'אתה רואה: תזרים שוטף, תיק השקעות, פנסיה וביטוחים, וסימולטור עתידי בו-זמנית.\n' +
        'מדיניות: לפני שעונה, בדוק את systemStatus.\n' +
        'אם תחום מסומן EMPTY — הודע למשתמש שאין נתונים לאותו תחום, במקום להניח.\n' +
        'אם תחום מסומן ACTIVE-DEMO — יש לך גישה לנתוני הדגמה ומותר לך לדון בהם. הפרדה בין נתוני דמו לנתונים אישיים.\n' +
        'ניתוח הוליסטי: קשר בין תזרים שוטף נוכחי, מצב ההשקעות, ותחזיות הפנסיה לייעוץ מקיף.\n' +
        'ארבעת תחומי הנתונים:\n' +
        'INVESTMENT_DOMAIN – תיק השקעות (ערכי צבירה חודשיים באלפ\u05f4ש)\n' +
        'CASHFLOW_DOMAIN – תזרים שוטף חודשי\n' +
        'PENSION_DOMAIN – פנסיה, ביטוח חיים, וביטוחים אחרים\n' +
        'SIMULATOR_DOMAIN – סימולטור פיננסי עתידי\n\n' +
        'כללי ניתוב: כאשר נשאלת על גוף פנסיוני (הראל, פניקס, מגדל, כלל, מנורה, מיטב, מור, אלטשולר),\'\n' +
        'ביטוח חיים, פנסיה, קצבה, אנונה – סרוק את PENSION_DOMAIN לעומק לפני שמדווח על נתונים חסרים.\n' +
        'כאשר מסבירים תחזית סימולטור: השתמש תמיד בערכי activeParameters (הסליידרים של המשתמש), אל תניח ערכי ברירת מחדל.\n' +
        'כדי לאתר אירוע בשנה מסוימת: חפש תחת אותה שנה בבלוק ציר אירועים מלא ב-SIMULATOR_DOMAIN.\n' +
        'FFS_USER: ' + (FFS_PROFILE.name || '') + (FFS_PROFILE.name ? ' — התייחס אליו/אליה בשמו/ה ישירות בתשובות.\n' : '\n') +
        'ניתוח סימולטור: עיין תמיד ב-milestonesSummary ראשון — זוהי מפת הניווט הראשית.\n' +
        'השתמש ב-milestonesSummary לתשובות מידיות על פרישה / גיל 70 / גיל 80 / תוחלת חיים.\n' +
        'תשואה = (ערך סוף תקופה - ערך תחילת תקופה) / ערך תחילת תקופה * 100.\n' +
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

// v168.69: System status checker — monitors data availability per domain
function buildSystemStatus() {
  // v168.69: domain is ACTIVE if real data loaded OR if demo mode populates it
  var cfLoaded   = CF_DATA && CF_DATA.length > 0;
  var invLoaded  = FUNDS && Object.keys(FUNDS).length > 0;
  var pnsLoaded  = PENSION_ASSETS && PENSION_ASSETS.length > 0;
  var simLoaded  = (typeof SIM_RATE !== 'undefined');
  function _label(loaded, count, unit) {
    if (loaded && isDemoMode) return 'ACTIVE-DEMO (' + count + ' ' + unit + ')';
    if (loaded) return 'LOADED (' + count + ' ' + unit + ')';
    return 'EMPTY';
  }
  return {
    CASHFLOW_DOMAIN:   _label(cfLoaded,  CF_DATA ? CF_DATA.length : 0, 'months'),
    INVESTMENT_DOMAIN: _label(invLoaded, FUNDS ? Object.keys(FUNDS).length : 0, 'funds'),
    PENSION_DOMAIN:    _label(pnsLoaded, PENSION_ASSETS ? PENSION_ASSETS.length : 0, 'assets'),
    SIMULATOR_DOMAIN:  simLoaded ? 'LOADED' : 'EMPTY',
    DEMO_MODE:         isDemoMode ? 'ACTIVE' : 'OFF'
  };
}

// v168.69: 4-domain context builder — CASHFLOW / INVESTMENT / PENSION / SIMULATOR
function buildGlobalContext() {
  // SIMULATOR_DOMAIN — always included (no personal data)
  var simUser1RetYear = SIM_BIRTH_YEAR_ROY  + SIM_RETIREMENT_AGE_ROY;
  var simUser2RetYear = SIM_BIRTH_YEAR_YAEL + SIM_RETIREMENT_AGE_YAEL;
  var simDomain = '\n\n=== SIMULATOR_DOMAIN ===\n';
  simDomain += 'משתמש 1: ' + SIM_USER1_NAME + ' | נולד: ' + SIM_BIRTH_YEAR_ROY + ' | פרישה גיל ' + SIM_RETIREMENT_AGE_ROY + ' (' + simUser1RetYear + ')\n';
  simDomain += 'משתמש 2: ' + SIM_USER2_NAME + ' | נולד: ' + SIM_BIRTH_YEAR_YAEL + ' | פרישה גיל ' + SIM_RETIREMENT_AGE_YAEL + ' (' + simUser2RetYear + ')\n';
  simDomain += 'קרן פנסיה: ' + SIM_PENSION_FUND_NAME + ' | קרן חיסכון: ' + SIM_SAVINGS_FUND_NAME + '\n';
  // v168.69: activeParameters block — AI must use these values, not internal assumptions
  simDomain += '\n--- activeParameters (ערכי סליידרים פעילים) ---\n';
  simDomain += 'תשואה שנתית (SIM_RATE): ' + SIM_RATE + '%\n';
  simDomain += 'אינפלציה (SIM_INFLATION): ' + SIM_INFLATION + '%\n';
  simDomain += 'גדילת נדל\"ן (SIM_RE_GROWTH_RATE): ' + SIM_RE_GROWTH_RATE + '%\n';
  simDomain += 'מס רווח הון (SIM_CAPITAL_TAX): ' + SIM_CAPITAL_TAX + '% (מוחל ישירות על שיעור הגדילה — תשואה נטו אפקטיבית: ' + (SIM_RATE * (1 - SIM_CAPITAL_TAX / 100)).toFixed(2) + '%)\n';
  simDomain += 'תשואת פרישה (pnsRetirementYield): ' + pnsRetirementYield + '%\n';
  simDomain += 'הוצאה חודשית יעד: ' + SIM_TARGET_EXP + ' \u20aa | שכר מדריך (שלב 2): ' + SIM_INSTRUCTOR_SAL + ' \u20aa\n';
  simDomain += 'קצבה חודשית (שלב 3): ' + SIM_PENSION_MONTHLY + ' \u20aa | הכנסת שכירות: ' + SIM_RENTAL_INCOME + ' \u20aa/חודש\n';
  simDomain += 'הון פנסיוני נוכחי: ' + Math.round(SIM_PENSION_ACC) + ' \u20aa\n';
  simDomain += 'גבולות פאזות: שלב1→' + SIM_P2_START.y + ' | שלב2→' + SIM_P3_START.y + ' | סיום→' + SIM_END.y + '\n';
  simDomain += '---\n';
  // v168.72: milestonesSummary — fixed life-event navigator (primary AI reference)
  var _msYears = [2029, 2033, 2043, 2047];
  var _msLabels = { 2029: 'פרישה (גיל 67)', 2033: 'גיל 70', 2043: 'גיל 80', 2047: 'גיל 84 — תוחלת חיים' };
  var _milestonesSummary = {};
  // Pre-collect events by year for cross-reference
  var _msEvByYear = {};
  if (typeof simCollectEvents === 'function') {
    (simCollectEvents().events || []).forEach(function(ev) {
      var _yk = ev.yr;
      if (!_msEvByYear[_yk]) _msEvByYear[_yk] = [];
      var _evDesc = (ev.label || ev.type || '?') + ': ' + (ev.amount || 0) + ' K \u20aa';
      if (ev.breakdown && ev.breakdown.length) {
        _evDesc += ' [' + ev.breakdown.map(function(b){ return b.label + ': ' + b.amount; }).join(', ') + ']';
      }
      _msEvByYear[_yk].push(_evDesc);
    });
  }
  if (SIM_LAST_RESULT && SIM_LAST_RESULT.labels && SIM_LAST_RESULT.labels.length > 0) {
    var _lbl = SIM_LAST_RESULT.labels, _roy = SIM_LAST_RESULT.royData;
    var _liqD = SIM_LAST_RESULT.royLiquidData || [], _phxD = SIM_LAST_RESULT.royPhoenixData || [];
    var _hrlD = SIM_LAST_RESULT.royHarelData  || [], _reD  = SIM_LAST_RESULT.royRealEstateData || [];
    // Fixed milestone years + dynamic retirement year for accuracy
    var _retYear = SIM_BIRTH_YEAR_ROY + SIM_RETIREMENT_AGE_ROY;
    if (_msYears.indexOf(_retYear) < 0) { _msYears.push(_retYear); _msLabels[_retYear] = 'פרישה דינמית (גיל ' + SIM_RETIREMENT_AGE_ROY + ')'; }
    _msYears.sort();
    _msYears.forEach(function(ty) {
      var _best = -1;
      for (var _mi = 0; _mi < _lbl.length; _mi++) { if (parseInt(_lbl[_mi]) === ty) { _best = _mi; break; } }
      var _age = ty - SIM_BIRTH_YEAR_ROY;
      _milestonesSummary[ty] = {
        label:       _msLabels[ty] || ('גיל ' + _age),
        totalWealth: _best >= 0 ? Math.round(_roy[_best])       : 'N/A',
        liquid:      _best >= 0 ? Math.round(_liqD[_best] || 0) : 'N/A',
        pension:     _best >= 0 ? Math.round(_phxD[_best] || 0) : 'N/A',
        harel:       _best >= 0 ? Math.round(_hrlD[_best] || 0) : 'N/A',
        realEstate:  _best >= 0 ? Math.round(_reD[_best]  || 0) : 'N/A',
        events:      (_msEvByYear[ty] || []).join('; ') || 'אין אירועים'
      };
    });
  } else {
    // No engine result yet — placeholder
    _msYears.forEach(function(ty) {
      _milestonesSummary[ty] = { label: _msLabels[ty] || '', totalWealth: 'N/A', liquid: 'N/A', pension: 'N/A', harel: 'N/A', realEstate: 'N/A', events: 'N/A (הסימולטור טרם הופעל)' };
    });
  }
  simDomain += '\n--- milestonesSummary (מפת ניווט לחיי רועי) ---\n';
  simDomain += 'הוראה: זהו המדד הראשי לניתוח עתידי. עיין כאן ראשון לכל שאלה על גיל / שנה.\n';
  Object.keys(_milestonesSummary).sort().forEach(function(yr) {
    var ms = _milestonesSummary[yr];
    simDomain += yr + ' [' + ms.label + ']:\n';
    simDomain += '  הון כולל: '    + ms.totalWealth + ' K \u20aa\n';
    simDomain += '  נזיל: '        + ms.liquid      + ' | פנסיה: ' + ms.pension + ' | הראל: ' + ms.harel + ' | נדל\"ן: ' + ms.realEstate + ' (K \u20aa)\n';
    simDomain += '  אירועים: '     + ms.events      + '\n';
  });
  simDomain += '---\n';
  // v168.69: full events timeline using simCollectEvents (includes PENSION_EVENTS + breakdown)
  if (typeof simCollectEvents === 'function') {
    var _collected = simCollectEvents();
    var _allEvs = _collected.events || [];
    if (_allEvs.length) {
      // Group events by year for cross-reference
      var _evByYear = {};
      _allEvs.forEach(function(ev) {
        var _yk = String(ev.yr);
        if (!_evByYear[_yk]) _evByYear[_yk] = [];
        _evByYear[_yk].push(ev);
      });
      simDomain += 'ציר אירועים מלא (כולל אירועי פרישה):\n';
      Object.keys(_evByYear).sort().forEach(function(yr) {
        simDomain += '  [' + yr + ']\n';
        _evByYear[yr].forEach(function(ev) {
          var _evLine = '    ' + yr + '/' + (ev.mo < 10 ? '0'+ev.mo : ev.mo) + ' – ' + (ev.label||ev.type||'?') + ' | ' + (ev.amount||0) + ' K \u20aa';
          if (ev.breakdown && ev.breakdown.length) {
            _evLine += ' [פירוט: ' + ev.breakdown.map(function(b){ return b.label + ': ' + b.amount; }).join(', ') + ']';
          }
          simDomain += _evLine + '\n';
        });
      });
    }
  } else if (SIM_USER_EVENTS && SIM_USER_EVENTS.length) {
    // fallback if simCollectEvents not yet defined
    simDomain += 'אירועים בציר הזמן:\n';
    SIM_USER_EVENTS.slice(0,20).forEach(function(ev) {
      simDomain += '  ' + ev.yr + '/' + ev.mo + ' [' + (ev.type||'אירוע') + '] ' + (ev.label||'') + ' | ' + (ev.amount||0) + ' K\n';
    });
  }
  // v168.69: demo mode — include demo data for all domains (no personal data risk)
  var _demoNote = isDemoMode ? '[מצב דמו — מוצגים נתוני דגמה. אין נתוני אקסל אישיים.]\n' : '';
  var out = _demoNote;
  out += '=== INVESTMENT_DOMAIN ===\n' + buildContext();
  out += '\n\n=== CASHFLOW_DOMAIN ===\n' + buildCFContext();
  out += '\n\n=== PENSION_DOMAIN ===\n' + buildPnsContext();
  out += simDomain;
  out += buildFFSContext(); // v168.72: personalized asset names for AI
  return out;
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
    var ownerTag = ' [' + (a.owner || 'לא ידוע') + ']'; // v168.69: owner never '?'
    var lifeIns = (a.isRisk || (a.policyType && a.policyType.indexOf('ביטוח') !== -1)) ? ' | ביטוח חיים: כן' : '';
    var premium = a.lastPremium ? ' | פרמיה חודשית: ' + a.lastPremium + ' \u20aa' : '';
    var purpose = a.mainPurpose ? ' | מטרה: ' + a.mainPurpose : '';
    lines.push('- '+(a.provider||'?')+ownerTag+' | '+(a.policyType||a.type||'?')+' | הון: '+(a.accumulation||0)+' | קצבה: '+(a.expectedPension||0)+lifeIns+premium+purpose);
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
  showToast('קורא קובץ...', '#64748b', 2000); // v169.2: floating toast
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      // v104.3: CF_DATA is reset only inside the CF branch — not here — to prevent investment/pension uploads from clearing it
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, {type:'array', cellDates:true});

      // v138.0: גיליון "ציר אירועים" — נבדק ראשון, לא חוסם גיליונות אחרים
      var evTimelineGroups = parseEventsTimelineSheet(wb);
      if (evTimelineGroups.length > 0) {
        // הסרת אירועי events_timeline קיימים (רענון מלא)
        for (var _ei = SIM_USER_EVENTS.length - 1; _ei >= 0; _ei--) {
          if (SIM_USER_EVENTS[_ei].src === 'events_timeline') SIM_USER_EVENTS.splice(_ei, 1);
        }
        var _mnmsEv = ['','ינו׳','פבר׳','מרץ','אפר׳','מאי','יוני','יולי','אוג׳','ספט׳','אוק׳','נוב׳','דצמ׳'];
        evTimelineGroups.forEach(function(grp) {
          SIM_USER_EVENTS.push({
            yr: grp.yr, mo: grp.mo,
            label: 'סך אירועי פרישה - ' + (_mnmsEv[grp.mo] || grp.mo) + ' ' + grp.yr,
            type: 'expense',
            amount: grp.total / 1000, // NIS → K
            permanent: true,
            src: 'events_timeline',
            breakdown: grp.items.map(function(it){ return { label: it.label, amount: it.amount }; })
          });
        });
        console.log('[v138] ציר אירועים → SIM_USER_EVENTS:', evTimelineGroups.length, 'קבוצות');
        if (simInited) { simRenderTimeline(); simRenderChart(simRunEngine()); }
        if (overviewInited && typeof ovRenderSimMini === 'function') ovRenderSimMini();
        _simSaveUserEvents(); // v162.0: persist permanent Excel events to localStorage
        showToast('✅ נטענו ' + evTimelineGroups.length + ' אירועים מ"ציר אירועים"', '#10b981', 5000);
        // לא מחזירים return — ממשיכים לבדוק גיליונות אחרים באותו קובץ
      }

      // v144.0: detectRetirementSheet/parseRetirementSheet REMOVED — caused duplicate events
      // with parseEventsTimelineSheet when "ציר אירועים" sheet contained "קטגוריה"+"סכומי פרישה" data.
      // ALL event parsing now done exclusively via parseEventsTimelineSheet (Column A labels).

      // בדיקת גיליון פנסיה לפי תוכן תאים — עדיפות ראשונה (v60.0)
      var pnsSheetName = detectPensionSheet(wb);
      if (pnsSheetName) {
        var pnsAssets = pensionParseWorkbook(wb, pnsSheetName);
        if (pnsAssets && pnsAssets.length > 0) {
          PENSION_ASSETS = pnsAssets;
          pensionSaveToStorage();
          extractAndSaveDobFromPensionSheet(wb, pnsSheetName); // v168.4: sync DOB + names from Excel
          try { sessionStorage.setItem('hasUploadedFiles', '1'); } catch(e) {} // v169.6
          showToast('✅ עודכנו נתוני תכנון פרישה', '#10b981', 5000);
          loadSettings(); // v169.2: lift privacy shield after data loaded
          // אם הטאב פנסיה פעיל — רנדר מחדש; אחרת — אפס כדי לאלץ init
          var activePanel = document.querySelector('.tab-panel.active');
          if (activePanel && activePanel.id === 'tab-pension') {
            pensionRender();
          } else {
            pensionInited = false;
          }
          // v102.5: עדכן סימולטור עם נתוני פנסיה מהקובץ החדש
          if (simInited) simRefresh();
          // v105.1: חשב pnsNetMonthly גם כשטאב פנסיה לא פעיל — חיוני לכרטיס בממשק מבט-על
          var _sldr = document.getElementById('pns-tax-slider');
          if (typeof pensionSliderChange === 'function') pensionSliderChange(_sldr ? _sldr.value : '35');
          // v105.0: סנכרון מבט-על לאחר טעינת נתוני פנסיה (KPIs + pension card body + mini-sim)
          if (overviewInited) {
            // v105.4: reset Harel toggle on upload — label must stay plain, no "(עם/ללא הראל)" from prior toggle
            ovPnsShowHarel = false;
            var _lblReset = document.getElementById('ov-hdr-pension-label');
            if (_lblReset) _lblReset.textContent = 'קצבה נטו';
            if (typeof ovRenderKPIs === 'function') ovRenderKPIs();
            if (typeof ovRenderPensionCards === 'function') ovRenderPensionCards();
            if (typeof ovRenderSimMini === 'function') ovRenderSimMini();
          }
        } else {
          if (status) { status.textContent = '⚠️ לא נמצאו נתוני פנסיה בגיליון'; setTimeout(function(){ status.textContent=''; }, 5000); }
        }
        input.value = '';
        return;
      }

      var cfKey = 'שוטף חדשי'.normalize('NFC');
      var isCF = wb.SheetNames.some(function(n){ return n.normalize('NFC').indexOf(cfKey) >= 0; });
      if (isCF) {
        CF_DATA = []; // v104.3: reset CF_DATA only for CF uploads
        var newData = cfParseWorkbook(wb);
        if (newData.length > 0) {
          CF_DATA = newData;
          CF_CURRENT_MONTH_ID = cfGetDefaultMonthId(newData); // v19.0: THE CLOCK RULE
          _dashSaveCF(); // v160.0: persist CF data
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
          // v104.3: אם המשתמש נמצא ב-Overview — אל תחטוף את הניווט
          var _activePanel = document.querySelector('.tab-panel.active');
          var _onOverview  = _activePanel && _activePanel.id === 'tab-overview';
          var cfPanel = document.getElementById('tab-cashflow');
          if (cfPanel && !_onOverview) {
            switchTab('cashflow');
          }
          // v102.5: עדכן סימולטור עם נתוני שכר/הוצאות מהקובץ החדש
          if (simInited) simRefresh();
          // v104.2: סנכרון גרף תזרים בלשונית מבט-על
          if (overviewInited && typeof ovRenderCashflowChart === 'function') ovRenderCashflowChart();
          // v105.1: עדכן מיני-סימולטור לאחר טעינת תזרים
          if (overviewInited && typeof ovRenderSimMini === 'function') ovRenderSimMini();
          // v108.1: עדכן KPIs (כולל Profit) לאחר טעינת תזרים — תיקון חסר-ריענון ב-Overview
          if (overviewInited && typeof ovRenderKPIs === 'function') ovRenderKPIs();
          cfSandboxInitDefaults(); // v103.4: set default date to next future month
          try { sessionStorage.setItem('hasUploadedFiles', '1'); } catch(e) {} // v169.6
          showToast('✅ עודכנו נתוני תזרים שוטף', '#10b981', 6000);
          loadSettings(); // v169.2: lift privacy shield after data loaded
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
  showToast('קורא קובץ...', '#64748b', 2000); // v169.2: floating toast
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      var wb = XLSX.read(data, {type:'array', cellDates:true});
      loadExcelFileCore(wb);
    } catch(err) {
      showToast('❌ שגיאה: ' + err.message, '#ef4444', 7000);
    }
  };
  reader.readAsArrayBuffer(file);
}

function loadExcelFileCore(wb) {
    var status = null; // v169.2: replaced by floating toast — kept as null to avoid reference errors
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
      
      try { sessionStorage.setItem('hasUploadedFiles', '1'); } catch(e) {} // v169.6
      showToast('✅ עודכנו נתוני השקעות – ' + newLabels.length + ' חודשים', '#4ade80', 5000);
      loadSettings(); // v169.2: lift privacy shield after Excel data loaded
      _dashSaveAssets(); // v160.0: persist investment data

      // v102.5: עדכן סימולטור עם הון רועי/יעל מהקובץ החדש
      if (simInited) simRefresh();

      // v104.7: סנכרון מבט-על לאחר טעינת נתוני השקעות
      if (overviewInited) {
        if (typeof ovRenderKPIs === 'function') ovRenderKPIs();
        if (typeof ovRenderInvestChart === 'function') ovRenderInvestChart();
        // v105.1: עדכן מיני-סימולטור לאחר טעינת נתוני השקעות
        if (typeof ovRenderSimMini === 'function') ovRenderSimMini();
      }

    } catch(err) {
      showToast('שגיאה: ' + err.message, '#ef4444', 7000);
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
  var cashFunds      = ['מזומןשקלי','מזומןדולרי','מיטבשקלית']; // v158.0: match list items exactly (removed מיטבדשטרייד which is cat:meitav, added מזומן funds)
  var activeFunds    = ['מיטבקהש912-443286','6730511אשגמל','מורגמל1375900'];

  var eqVal=0, genVal=0, cashVal=0;
  var eqActive=0, genActive=0;

  Object.entries(FUNDS).forEach(function(entry) {
    var key = entry[0], f = entry[1];
    var v = lastVal(f.data);
    if (!v || v <= 0) return;
    var isCash       = cashFunds.includes(key);
    var isEquity     = equityFunds.includes(key);
    var isActive     = activeFunds.includes(key);
    var isRealEstate = (f.cat === 'dira'); // v160.0: exclude real estate from כללי
    var isDebt       = (f.cat === 'chov');
    if (isCash)                        { cashVal += v; }
    else if (isEquity)                 { eqVal   += v; if (isActive) eqActive  += v; }
    else if (!isRealEstate && !isDebt) { genVal  += v; if (isActive) genActive += v; }
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
  // v103.10-Investments-v2: use actual last index (not filtered wData length) so inactive funds are excluded
  var endIdx = Math.min(cmWinStart + CM_WINDOW - 1, LABELS.length - 1);
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
      var _adjustedYtdEnd = ytdEnd - _cmYtdKMov; // v103.9-FIXED: subtract cumulative K deposits from balance before computing organic %
      var ytdNetDelta = _adjustedYtdEnd - ytdStart;
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
  var endIdx = Math.min(cmWinStart + CM_WINDOW - 1, LABELS.length - 1);
  if (first > 0) {
    // v103.9: Column K netting for window return — same formula as cmSetCatStats
    var _cmFundRetKMov = 0;
    var _cmFundRetColK = FUND_COL_K[fundKey] || [];
    for (var _rfki = cmWinStart + 1; _rfki <= endIdx; _rfki++) {
      var _rfkv = (_rfki < _cmFundRetColK.length) ? _cmFundRetColK[_rfki] : null;
      if (typeof _rfkv === 'number' && !isNaN(_rfkv)) _cmFundRetKMov += _rfkv;
    }
    var _fundRetNet = (last - first) - _cmFundRetKMov;
    var ret = (_fundRetNet / first * 100).toFixed(1);
    retEl.textContent=Math.abs(parseFloat(ret)).toFixed(1)+'%'; retEl.className='cm-stat-val '+(parseFloat(ret)>=0?'pos':'neg');
  }
  var janIdx = LABELS.findIndex(function(l){ return l.indexOf('ינ') >= 0 && l.indexOf('26') >= 0; });
  var ytdEl = document.getElementById('cm-ytd');
  if (janIdx >= 0 && endIdx >= janIdx && ff[janIdx] > 0 && ff[endIdx] > 0) {
    // v103.7: Column K netting for single fund YTD — same formula as updateChartStats
    var _cmFundKMov = 0;
    var _cmFundColK = FUND_COL_K[fundKey] || [];
    for (var _fki = janIdx + 1; _fki <= endIdx; _fki++) {
      var _fkv = (_fki < _cmFundColK.length) ? _cmFundColK[_fki] : null;
      if (typeof _fkv === 'number' && !isNaN(_fkv)) _cmFundKMov += _fkv;
    }
    var _adjustedFundEnd = ff[endIdx] - _cmFundKMov; // v103.9-FIXED: subtract cumulative K deposits from balance before computing organic %
    var _fundYtdNet = _adjustedFundEnd - ff[janIdx];
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

  // v167.0: time-travel block — reject entries before current calendar month
  var _nowD = new Date();
  var _nowY = _nowD.getFullYear();
  var _nowM = _nowD.getMonth() + 1;
  if (!(yr > _nowY || (yr === _nowY && mo >= _nowM))) {
    var errEl = document.getElementById('sb-err');
    if (errEl) { errEl.textContent = '⚠️ לא ניתן להכניס אירועים לפני ' + _nowM + '/' + _nowY; errEl.style.display = 'block'; }
    setTimeout(function() { if (errEl) errEl.style.display = 'none'; }, 3000);
    return;
  }

  var lbl = lblEl ? lblEl.value.trim() : '';
  CF_SANDBOX_EVENTS.push({ amount: amt, year: yr, month: mo, label: lbl || (isExpense ? 'הוצאה זמנית' : 'הכנסה זמנית') });
  amtEl.value = ''; if (lblEl) lblEl.value = '';
  cfSandboxRender();
  cfRenderChart();
  cfRenderSummary(); // v157.0: עדכן סיכום שנתי
  // v103.7: refresh forecast panel if open
  var _fpSb = document.getElementById('cf-detailed-forecast');
  if (_fpSb && _fpSb.style.display !== 'none') cfRenderForecast();
}

function cfSandboxRemove(idx) {
  CF_SANDBOX_EVENTS.splice(idx, 1);
  cfSandboxRender();
  cfRenderChart();
  cfRenderSummary(); // v157.0: עדכן סיכום שנתי
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
  cfRenderSummary(); // v157.0: עדכן סיכום שנתי
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

// v103.6 / v161.0: disable month options before minimum; clamp year to minimum
function cfSandboxUpdateMonthOpts() {
  var yrEl = document.getElementById('sb-year');
  var moEl = document.getElementById('sb-month');
  if (!yrEl || !moEl) return;
  var minYr = parseInt(yrEl.getAttribute('data-min-yr')) || parseInt(yrEl.min) || new Date().getFullYear();
  var minMo = parseInt(moEl.getAttribute('data-min-mo-at-min-yr')) || 1;
  // v161.0: clamp year — prevent typing a past year
  var selYr = parseInt(yrEl.value) || minYr;
  if (selYr < minYr) { yrEl.value = minYr; selYr = minYr; }
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
  // v103.10: add current-month sandbox events to header YTD cards
  if (CF_SANDBOX_EVENTS && CF_SANDBOX_EVENTS.length > 0) {
    CF_SANDBOX_EVENTS.forEach(function(ev) {
      if (ev.year === m.year && ev.month === m.month) {
        if ((ev.amount || 0) > 0) inc += ev.amount;
        else exp += Math.abs(ev.amount || 0);
      }
    });
  }
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
  // v98.1/v98.2/v167.1: רווח או הפסד — כותרת + צבע דינמיים; fallback to Income-Expenses if profit_loss missing
  if (elPL) {
    var plVal = (m.rows.profit_loss && m.rows.profit_loss.val != null) ? m.rows.profit_loss.val
              : (cfCalcIncome(m.rows) - ((m.rows.total_exp && m.rows.total_exp.val != null) ? m.rows.total_exp.val : cfCalcExp(m.rows)));
    var elPLLabel = document.getElementById('cf-hdr-pl-label');
    elPL.className = 'stat-value';
    if (plVal < 0) {
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
    wrap.style.maxHeight = '350px'; // v103.9-FIXED: cap YTD chart height
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
  // v168.60: sandbox events — only current calendar month (new Date()); one-time, never projected
  var _ytdNow = new Date(), _ytdNowY = _ytdNow.getFullYear(), _ytdNowM = _ytdNow.getMonth() + 1;
  if (CF_SANDBOX_EVENTS && CF_SANDBOX_EVENTS.length) {
    CF_SANDBOX_EVENTS.forEach(function(ev) {
      if (ev.year === _ytdNowY && ev.month === _ytdNowM && ev.year === displayYear) {
        if ((ev.amount || 0) > 0) { ytdInc += ev.amount; }
        else { ytdExp += Math.abs(ev.amount || 0); }
      }
    });
    if (ytdMonths > 0) ytdNet = ytdInc - ytdExp;
  }
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
  // v168.60: sandbox events in Annual — only current calendar month; zero multipliers
  var _annNow = new Date(), _annNowY = _annNow.getFullYear(), _annNowM = _annNow.getMonth() + 1;
  if (CF_SANDBOX_EVENTS && CF_SANDBOX_EVENTS.length) {
    CF_SANDBOX_EVENTS.forEach(function(ev) {
      if (ev.year === _annNowY && ev.month === _annNowM && ev.year === displayYear) {
        if ((ev.amount || 0) > 0) { annInc += ev.amount; }
        else { annExp += Math.abs(ev.amount || 0); }
      }
    });
    annNet = annInc - annExp;
  }
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
  // v168.61: Absolute Fidelity — sum all 12 Excel cells directly, zero extrapolation
  var _fcDisplayYear = CF_SELECTED_YEAR || (function() {
    var maxY = 2025;
    for (var di = 0; di < CF_DATA.length; di++) { if (CF_DATA[di].year > maxY) maxY = CF_DATA[di].year; }
    return maxY;
  })();
  // Sum 12 months directly from cfGetDisplayMonths() — includes future Excel values as-is
  var _allMonths = cfGetDisplayMonths();
  function _sumAnn(field) {
    var sum = 0, hasData = false;
    _allMonths.forEach(function(m) {
      var v = m.rows[field] && m.rows[field].val;
      if (v != null && v !== 0) { sum += v; hasData = true; }
    });
    return hasData ? sum : null;
  }
  var hasAnyData = _allMonths.some(function(m) { return cfCalcIncome(m.rows) > 0 || cfCalcExp(m.rows) > 0; });
  if (!hasAnyData) {
    panel.innerHTML = '<div style="color:#9ca3af;text-align:center;padding:20px;font-size:13px;">אין נתונים לשנת ' + _fcDisplayYear + '</div>';
    return;
  }
  var f = {
    salary:         _sumAnn('salary'),
    rent_income:    _sumAnn('rent_income'),
    visa:           _sumAnn('visa'),
    cash_exp:       _sumAnn('cash_exp'),
    loans:          _sumAnn('loans'),
    yotam:          _sumAnn('yotam'),
    other_exp:      _sumAnn('other_exp'),
    yotam_usd:      _sumAnn('yotam_usd'),
    net_cashflow:   _sumAnn('net_cashflow'),
    profit_loss:    _sumAnn('profit_loss'),
    cashflow_total: _sumAnn('delta')
  };

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

  // v168.61: sandbox — current calendar month only, no projection forward
  var _fcNow = new Date(), _fcNowY = _fcNow.getFullYear(), _fcNowM = _fcNow.getMonth() + 1;
  var sandboxIncomeAnn = 0, sandboxExpenseAnn = 0;
  if (CF_SANDBOX_EVENTS && CF_SANDBOX_EVENTS.length > 0) {
    CF_SANDBOX_EVENTS.forEach(function(ev) {
      if (ev.year === _fcNowY && ev.month === _fcNowM && ev.year === _fcDisplayYear) {
        if ((ev.amount || 0) > 0) sandboxIncomeAnn += ev.amount;
        else sandboxExpenseAnn += Math.abs(ev.amount || 0);
      }
    });
  }
  var sandboxNetTotal = sandboxIncomeAnn - sandboxExpenseAnn; // net: income adds, expense subtracts

  // v48.0: יותם ושונות — כרטיסיות נפרדות במגירה (כדי לראות 62 ו-11 בנפרד)
  var netVal     = f.profit_loss;
  var netCash    = f.net_cashflow;
  var cashTotal  = f.cashflow_total;
  // v103.10: sandbox net correctly increases/decreases the annual P&L
  var netValWithSandbox = (netVal != null) ? netVal + sandboxNetTotal : (sandboxNetTotal !== 0 ? sandboxNetTotal : null);
  var netColor   = (netValWithSandbox != null && netValWithSandbox >= 0) ? '#16a34a' : '#dc2626';

  function bottomCard(label, val, color) {
    if (val == null || val === 0) return '';
    return '<div style="background:white;border-radius:9px;padding:9px 16px;border-right:3px solid ' + color + ';border:1px solid rgba(139,92,246,0.18);border-right:3px solid ' + color + ';box-shadow:0 1px 4px rgba(0,0,0,0.06);flex-shrink:0;">' +
      '<div style="font-size:10px;color:#9ca3af;font-weight:600;margin-bottom:2px;white-space:nowrap;">' + label + '</div>' +
      '<div style="font-size:18px;font-weight:800;color:' + color + ';white-space:nowrap;">' + Math.round(val).toLocaleString() + '</div>' +
      '</div>';
  }

  // v49.0: שורה אחת רציפה — כרטיסיות תזרים בצד שמאל (spacer דוחף אותן שמאלה)
  var html = '<div style="direction:rtl;">';
  var _titleLabel = 'סיכום שנתי — ₪ ' + _fcDisplayYear + ' (נתוני אקסל ישירים, ללא השערות)';
  html += '<div style="font-size:10px;color:#94a3b8;font-weight:600;letter-spacing:0.4px;margin-bottom:3px;direction:rtl;">' + _titleLabel + '</div>';

  // v54.0: 3 גושים: הכנסות | קו | הוצאות | קו | תזרים
  var FDIV = '<div style="width:1px;background:rgba(255,255,255,0.1);align-self:stretch;margin:0 10px;flex-shrink:0;"></div>';
  html += '<div style="display:flex;flex-wrap:nowrap;gap:8px;align-items:flex-start;overflow-x:auto;">';
  // גוש 1: הכנסות (כולל הכנסות sandbox בירוק)
  html += card('משכורת שקלית', f.salary, '#16a34a');
  html += card('שכר דירה', f.rent_income, '#0891b2');
  // v103.10: sandbox income card inside income group — green, absolute value
  if (sandboxIncomeAnn > 0) html += card('הכנסות זמניות', sandboxIncomeAnn, '#16a34a');
  // קו מפריד: הכנסות | הוצאות
  html += FDIV;
  // גוש 2: הוצאות (ערכים גולמיים ישירות מסיכומים — ללא sum/reduce)
  html += card('ויזה',     f.visa     != null ? Math.abs(f.visa)     : null, '#dc2626');
  html += card('מזומן',   f.cash_exp != null ? Math.abs(f.cash_exp) : null, '#dc2626');
  html += card('הלוואות', f.loans    != null ? Math.abs(f.loans)    : null, '#b45309');
  html += card('יותם',    f.yotam     != null ? Math.abs(f.yotam)     : null, '#ea580c');
  html += card('שונות',   f.other_exp != null ? Math.abs(f.other_exp): null, '#ca8a04');
  // v103.10: sandbox expense card — last in expense group, red, absolute value (no negative sign)
  if (sandboxExpenseAnn > 0) html += card('הוצאות זמניות', sandboxExpenseAnn, '#dc2626');
  // v58.0: יותם $ — כרטיסיית רפרנס דולרית, הכי שמאל בגוש ההוצאות (Zero Noise)
  html += card('יותם $',  f.yotam_usd != null ? Math.abs(f.yotam_usd): null, '#ea580c');
  // קו מפריד: הוצאות | תזרים
  html += FDIV;
  // גוש 3: תזרים — ישירות מסיכומים, ללא חישוב
  html += bottomCard('תזרים שקלי נטו', netCash,   '#3b82f6');
  html += bottomCard('תזרים שוטף',     cashTotal, '#6366f1');
  html += bottomCard('רווח / הפסד',    netValWithSandbox, netColor);

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



var TAB_NAMES={'overview':'מבט על','cashflow':'תזרים שוטף','investments':'השקעות','pension':'פנסיה וביטוחים','market':'ניתוח שוק ומסחר','simulator':'סימולטור פיננסי','settings':'הגדרות'};
var cfInited = false;
function switchTab(id){
  try { localStorage.setItem('active_tab', id); } catch(e) {} // v161.0: persist active tab
  document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
  document.querySelectorAll('.tab-panel').forEach(function(p){p.classList.remove('active');});
  var btn=document.getElementById('tabn-'+id);
  var panel=document.getElementById('tab-'+id);
  if(btn)btn.classList.add('active');
  if(panel)panel.classList.add('active');
  var t=document.getElementById('hdr-tab-title');
  if(t)t.textContent=TAB_NAMES[id]||id;
  // v154.0: body tab classes for per-tab header margin overrides
  document.body.classList.remove('tab-overview', 'tab-simulator', 'tab-pension');
  if(id === 'overview')  document.body.classList.add('tab-overview');
  if(id === 'simulator') document.body.classList.add('tab-simulator');
  if(id === 'pension')   document.body.classList.add('tab-pension');

  var isCF       = (id === 'cashflow');
  var isInv      = (id === 'investments');
  var isPns      = (id === 'pension');
  var isSim      = (id === 'simulator');
  var isOv       = (id === 'overview');
  var isMkt      = (id === 'market');
  var isSettings = (id === 'settings');

  // v107.0: market tab — keep title group visible (title aligns right), show search area in header
  var hdrTitleGroup = document.getElementById('hdr-title-group');
  if (hdrTitleGroup) hdrTitleGroup.style.display = '';
  var mktHeaderArea = document.getElementById('mkt-search-area');
  if (mktHeaderArea) mktHeaderArea.style.display = isMkt ? 'flex' : 'none';
  // v169.2: excel-status replaced by floating toast — no need to hide/show per tab

  // Header stats
  var invStats = document.getElementById('inv-header-stats');
  if(invStats) invStats.style.display = isInv ? '' : 'none';
  var cfStats = document.getElementById('cf-header-stats');
  if(cfStats) cfStats.style.display = isCF ? 'flex' : 'none';
  var pnsStats = document.getElementById('pns-header-stats');
  if(pnsStats) pnsStats.style.display = isPns ? 'flex' : 'none';
  var simStats = document.getElementById('sim-header-stats');
  if(simStats) simStats.style.display = isSim ? 'flex' : 'none';
  var ovStats = document.getElementById('ov-header-stats');
  if(ovStats) ovStats.style.display = isOv ? 'flex' : 'none';
  var mktStats = document.getElementById('mkt-header-stats');
  if(mktStats) mktStats.style.display = isMkt ? 'flex' : 'none';

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
  document.querySelectorAll('.ov-only-btn').forEach(function(b){ b.style.display = isOv ? 'flex' : 'none'; });
  // v136.0: sim-settings-hdr-btn uses .sim-only-btn class — shown/hidden automatically by switchTab

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
  if(isOv){
    if(!overviewInited){ overviewInited=true; }
    // v169.3: in SIMULATOR mode, ensure sim engine is ready before overview renders
    if(typeof APP_MODE !== 'undefined' && APP_MODE === 'SIMULATOR' && !simInited){
      simInited=true;
      setTimeout(function(){ simInit(); setTimeout(overviewRender,100); },80);
    } else {
      setTimeout(overviewRender,80);
    }
  }
  if(isMkt && !marketInited){ marketInited=true; setTimeout(marketInit,80); }
  // v103.14-sim-ui: update AI chat title based on active tab
  var _chatTitle = document.getElementById('chat-title');
  if (_chatTitle) _chatTitle.innerHTML = isSim
    ? '🤖 שאל את הסימולטור'
    : '🤖 שאל את הדשבורד';

  // v103.36: clear simulator subtitle when leaving simulator tab
  if (!isSim) {
    var _hdrsub = document.getElementById('hdr-subtitle');
    if (_hdrsub) _hdrsub.innerHTML = '';
  }

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
  loadSettings(); // v124.0: restore saved settings before any render

  // v168.11: if last session was demo, wipe all persisted demo data + reset contaminated globals
  var _wasDemo = false;
  try { _wasDemo = localStorage.getItem('_dash_is_demo') === '1'; } catch(e) {}
  if (_wasDemo) {
    try {
      localStorage.removeItem(_DASH_ASSETS_LS_KEY);
      localStorage.removeItem(_DASH_CF_LS_KEY);
      localStorage.removeItem(_DASH_PENSION_LS_KEY);
      localStorage.removeItem(_SIM_EVENTS_LS_KEY);
      localStorage.removeItem('_dash_is_demo');
      // strip demo names/DOBs from settings so real user data is not contaminated
      var _sRaw = localStorage.getItem(SETTINGS_LS_KEY);
      if (_sRaw) {
        try {
          var _sObj = JSON.parse(_sRaw) || {};
          _sObj.user1Name = ''; _sObj.user2Name = '';
          _sObj.user1Birth = ''; _sObj.user2Birth = '';
          localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(_sObj));
        } catch(e) {}
      }
    } catch(e) {}
    // reset in-memory globals that loadSettings() already applied from demo settings
    SIM_USER1_NAME = ''; SIM_USER2_NAME = '';
    SIM_USER1_BIRTH = ''; SIM_USER2_BIRTH = '';
    SIM_BIRTH_YEAR_ROY = new Date().getFullYear() - 30;
    SIM_BIRTH_YEAR_YAEL = new Date().getFullYear() - 30;
    userCurrentAge = 30;
    if (typeof syncBirthYearsFromSettings === 'function') syncBirthYearsFromSettings();
    if (typeof applyUserNames === 'function') applyUserNames();
    // clear DOM name inputs
    ['stg-user1-name','stg-user2-name'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
    ['stg-user1-birth','stg-user2-birth'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  }

  // v160.0: restore persisted Excel data so page refresh doesn't wipe the dashboard
  var _assetsOk  = _dashRestoreAssets();
  var _cfOk      = _dashRestoreCF();
  var _pensionOk = _dashRestorePension();
  // v169.5: returning user with data in localStorage is treated as having uploaded this session
  // (their data is real — the privacy shield should not hide it)
  if (_assetsOk || _cfOk || _pensionOk) {
    try { sessionStorage.setItem('hasUploadedFiles', '1'); } catch(e) {} // v169.6
    // v169.7: returning user with real data → auto-select Excel mode (skip Mode 0 placeholder)
    APP_MODE = 'EXCEL';
    if (typeof _updateModeSelectorUI === 'function') _updateModeSelectorUI('EXCEL');
  } else {
    // v169.7: no data in localStorage → stay in Mode 0 (null), show placeholder
    if (typeof _updateModeSelectorUI === 'function') _updateModeSelectorUI(null);
  }

  if (_assetsOk) {
    // update investment table headers + cells with restored data
    document.querySelectorAll('th[data-col]').forEach(function(th) {
      var col = parseInt(th.getAttribute('data-col'));
      if (col >= 0 && col < LABELS.length) th.textContent = LABELS[col];
    });
    updateTableCells();
    updateDynamicStats();
    updateNavButtons();
    selectView(currentView || 'all');
  }
  if (_cfOk) {
    // CF tab will lazy-init on first open; just ensure default month is set
    if (typeof cfGetDefaultMonthId === 'function' && CF_DATA.length) {
      CF_CURRENT_MONTH_ID = CF_CURRENT_MONTH_ID || cfGetDefaultMonthId(CF_DATA);
    }
  }
  if (_pensionOk) {
    pensionInited = false; // force re-init on tab open
    // calculate pnsNetMonthly so overview pension card has data immediately
    var _sldrInit = document.getElementById('pns-tax-slider');
    if (typeof pensionSliderChange === 'function') pensionSliderChange(_sldrInit ? _sldrInit.value : '35');
  }

  // v162.0: restore simulator events before any rendering
  // v170.3: call unconditionally so SIMULATOR user-events survive page reload without Excel data
  _simRestoreUserEvents();

  // v168.9: always boot on overview tab — ignore any saved tab; ensure demo mode is off
  document.body.classList.remove('demo-mode');
  switchTab('overview');

  // v162.0: explicitly render charts after restore — mimics loadExcelFileCore() success flow
  // Fires at 200ms (after switchTab's 80ms lazy-init) to ensure all charts populate on page load
  if (_assetsOk || _cfOk || _pensionOk) {
    setTimeout(function() {
      if (typeof overviewRender === 'function') {
        if (!overviewInited) overviewInited = true;
        overviewRender();
      }
      // if simulator tab was active and simInit already ran, re-render chart with restored events
      if (simInited && typeof simRenderChart === 'function' && typeof simRunEngine === 'function') {
        simRenderKPI();
        simRenderEvents();
        simRenderTimeline();
        simRenderChart(simRunEngine());
      }
    }, 200);
  }

  updateTableCells(); // מבטיח שתאי טבלת השקעות מציגים 0 כשאין נתוני localStorage

  // v120.0: Dirty state — enable save button whenever any settings input changes
  document.querySelectorAll('#tab-settings .settings-input').forEach(function(inp) {
    ['input', 'change'].forEach(function(evt) {
      inp.addEventListener(evt, function() {
        var b = document.querySelector('.settings-save-btn');
        if (b) b.disabled = false;
      });
    });
  });

  // v127.0: Restrict birth date pickers to past dates only (max = today)
  var todayStr = new Date().toISOString().split('T')[0];
  ['stg-user1-birth', 'stg-user2-birth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.setAttribute('max', todayStr);
  });

  // v168.15: fetch live S&P 500 data from local backend
  fetchMarketData();
  // v168.35: Fear & Greed — real API (alternative.me/fng)
  fetchFearGreed();
});

// =========================================
// LIVE MARKET DATA v168.15
// =========================================
window.LIVE_MARKET_YIELD = null;

function _mktFmtIndex(priceElId, chgElId, price, chgPct, prefix, styledDecimals) {
  var pEl = document.getElementById(priceElId);
  var cEl = document.getElementById(chgElId);
  if (pEl && price != null) {
    var full = (prefix || '') + price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (styledDecimals) {
      var dotIdx = full.lastIndexOf('.');
      if (dotIdx !== -1) {
        pEl.innerHTML = full.slice(0, dotIdx) +
          '<span style="font-size:0.8em;opacity:0.85;vertical-align:baseline;">' + full.slice(dotIdx) + '</span>';
      } else {
        pEl.textContent = full;
      }
    } else {
      pEl.textContent = full;
    }
  }
  if (cEl && chgPct != null) {
    var sign = chgPct >= 0 ? '+' : '';
    cEl.textContent = sign + chgPct.toFixed(2) + '%';
    cEl.style.color = chgPct >= 0 ? '#34d399' : '#f87171';
  }
}

async function fetchMarketData() {
  // v168.69: unified color system — live=blue, offline=yellow
  var LIVE_COLOR    = '#60a5fa'; // theme blue — matches live indexes
  var OFFLINE_COLOR = '#facc15'; // yellow — fallback / offline

  function _setHdrColor(id, isLive) {
    var el = document.getElementById(id);
    if (el) el.style.color = isLive ? LIVE_COLOR : OFFLINE_COLOR;
  }

  function _allOffline() {
    ['mkt-hdr-ta125-price', 'mkt-hdr-sp500-price', 'mkt-hdr-fx-price'].forEach(function(id) {
      _setHdrColor(id, false);
    });
    var fxH = document.getElementById('mkt-hdr-fx-price');
    if (fxH) fxH.textContent = '2.97';
    var fxV = document.getElementById('mkt-fx-val');
    if (fxV) { fxV.textContent = '2.97'; fxV.style.color = OFFLINE_COLOR; }
  }

  try {
    var response = await fetch('http://localhost:5051/api/market');
    if (!response.ok) { _allOffline(); return; }
    var data = await response.json();
    window.LIVE_MARKET_YIELD = data.sp500 ? data.sp500.change_pct : null;
    console.log('Market Data Loaded:', data);

    var ta125 = data.ta125 || data['^TA125.TA'] || data['TA125.TA'];
    var sp500 = data.sp500 || data['^GSPC'];
    var fx    = data.fx    || data['USDILS=X'] || data['ILS=X'];

    // TA-125
    if (ta125 && ta125.price != null) {
      _mktFmtIndex('mkt-hdr-ta125-price', 'mkt-hdr-ta125-chg', ta125.price, ta125.change_pct, '', true);
    }
    _setHdrColor('mkt-hdr-ta125-price', !!(ta125 && ta125.is_live));

    // S&P 500
    if (sp500 && sp500.price != null) {
      _mktFmtIndex('mkt-hdr-sp500-price', 'mkt-hdr-sp500-chg', sp500.price, sp500.change_pct, '$', true);
    }
    _setHdrColor('mkt-hdr-sp500-price', !!(sp500 && sp500.is_live));

    // USD/ILS — header + slider always in sync
    var fxIsLive = !!(fx && fx.is_live);
    var fxHdrEl  = document.getElementById('mkt-hdr-fx-price');
    if (fx && fx.price != null) {
      _mktFmtIndex('mkt-hdr-fx-price', 'mkt-hdr-fx-chg', fx.price, fx.change_pct, '', false);
    } else {
      if (fxHdrEl) fxHdrEl.textContent = '2.97';
      fxIsLive = false;
    }
    _setHdrColor('mkt-hdr-fx-price', fxIsLive); // header color

    var slider  = document.getElementById('mkt-fx-slider');
    var fxValEl = document.getElementById('mkt-fx-val');
    if (slider && fxValEl) {
      var rate    = (fx && fx.price && fx.price > 0) ? fx.price : 2.97;
      var clamped = Math.max(2.5, Math.min(3.5, rate));
      slider.value            = clamped.toFixed(2);
      fxValEl.textContent     = clamped.toFixed(2);
      fxValEl.style.color     = fxIsLive ? LIVE_COLOR : OFFLINE_COLOR; // slider color matches header
      mktFxRate = clamped;
    }
  } catch (e) {
    console.warn('fetchMarketData: backend unavailable', e);
    _allOffline();
  }
}

// =========================================
// FEAR & GREED GAUGE v168.35
// =========================================

function fgDrawGauge(canvasId, score) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  var cx = W / 2, cy = H - 2, r = H - 6;
  var lw = Math.max(4, Math.round(r * 0.38));

  // Radial depth gradient background (glassmorphism)
  var bgGrad = ctx.createRadialGradient(cx, cy - r * 0.3, r * 0.1, cx, cy, r + lw * 0.8);
  bgGrad.addColorStop(0,   'rgba(255,255,255,0.10)');
  bgGrad.addColorStop(0.5, 'rgba(255,255,255,0.03)');
  bgGrad.addColorStop(1,   'rgba(0,0,0,0.0)');
  ctx.beginPath();
  ctx.arc(cx, cy, r + lw * 0.6, Math.PI, 2 * Math.PI);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Dark track behind the arc
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
  ctx.lineWidth = lw + 2;
  ctx.strokeStyle = 'rgba(0,0,0,0.4)';
  ctx.lineCap = 'butt';
  ctx.stroke();

  // Gradient arc: smooth red→orange→yellow→lime→green
  var arcGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
  arcGrad.addColorStop(0,    '#ef4444');
  arcGrad.addColorStop(0.25, '#f97316');
  arcGrad.addColorStop(0.5,  '#eab308');
  arcGrad.addColorStop(0.75, '#84cc16');
  arcGrad.addColorStop(1,    '#22c55e');
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
  ctx.lineWidth = lw;
  ctx.strokeStyle = arcGrad;
  ctx.lineCap = 'butt';
  ctx.stroke();

  // Inner shadow rim
  ctx.beginPath();
  ctx.arc(cx, cy, r - lw * 0.5 + 1, Math.PI, 2 * Math.PI);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();

  // Tick marks at 0, 25, 50, 75, 100 — sharp, no glow
  [0, 0.25, 0.5, 0.75, 1.0].forEach(function(t) {
    var tickAngle = Math.PI + t * Math.PI;
    var outer = r + lw * 0.2;
    var inner = r - lw * 0.65;
    ctx.beginPath();
    ctx.moveTo(cx + outer * Math.cos(tickAngle), cy + outer * Math.sin(tickAngle));
    ctx.lineTo(cx + inner * Math.cos(tickAngle), cy + inner * Math.sin(tickAngle));
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineCap = 'square';
    ctx.stroke();
  });

  if (score != null) {
    var t     = Math.max(0, Math.min(100, score)) / 100;
    var angle = Math.PI + t * Math.PI;
    var nr    = r - lw * 0.45;
    var tipX  = cx + nr * Math.cos(angle);
    var tipY  = cy + nr * Math.sin(angle);

    // Sharp solid white needle — 2px, no shadow/glow
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tipX, tipY);
    ctx.lineWidth   = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap     = 'butt';
    ctx.stroke();

    // Triangular tip at needle end
    var perpAngle = angle + Math.PI / 2;
    var tipSize   = 3.5;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - tipSize * Math.cos(perpAngle) + tipSize * Math.cos(angle),
               tipY - tipSize * Math.sin(perpAngle) + tipSize * Math.sin(angle));
    ctx.lineTo(tipX + tipSize * Math.cos(perpAngle) + tipSize * Math.cos(angle),
               tipY + tipSize * Math.sin(perpAngle) + tipSize * Math.sin(angle));
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Base pivot circle — solid, no glow
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

function fgScoreLabel(score) {
  if (score == null) return { text: 'N/A', color: '#94a3b8' };
  if (score <= 20)   return { text: 'Extreme Fear', color: '#ef4444' };
  if (score <= 40)   return { text: 'Fear',         color: '#f97316' };
  if (score <= 60)   return { text: 'Neutral',      color: '#eab308' };
  if (score <= 80)   return { text: 'Greed',        color: '#84cc16' };
  return                    { text: 'Extreme Greed',color: '#22c55e' };
}

function fgUpdateUI(score) {
  var lbl    = fgScoreLabel(score);
  var valEl  = document.getElementById('fng-value');
  var lblEl  = document.getElementById('fng-label');
  if (valEl) { valEl.textContent = score != null ? score : 'N/A'; valEl.style.color = lbl.color; }
  if (lblEl) { lblEl.textContent = lbl.text;                       lblEl.style.color = lbl.color; }
  fgDrawGauge('fng-gauge', score);
}

async function fetchFearGreed() {
  var score = null;
  try {
    var r = await fetch('https://api.alternative.me/fng/?limit=1');
    if (r.ok) {
      var d = await r.json();
      var val = d && d.data && d.data[0] ? parseInt(d.data[0].value) : null;
      if (!isNaN(val)) score = val;
    }
  } catch(e) {
    console.warn('fetchFearGreed: API unavailable', e);
  }
  fgUpdateUI(score);
}

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
var pnsNetMonthly          = 0;
var pnsNetMonthlyWithHarel = 0; // v105.3: exact net WITH Harel (same tax engine as pension tab)
var pnsNetMonthlyNoHarel   = 0; // v105.3: exact net WITHOUT Harel
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
  // v104.5: initialize pnsNetMonthly from current slider value so overview KPI
  // shows the correct value immediately without requiring the user to touch the slider
  if (pnsNetMonthly === 0) {
    var _sldr = document.getElementById('pns-tax-slider');
    var _val  = _sldr ? _sldr.value : '35';
    pensionSliderChange(_val);
  }
  if (typeof ovRenderKPIs === 'function') ovRenderKPIs();
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
  // הראל toggle — switchTab() מנהל hide/show; כאן רק מעדכנים תוכן ו-display כשהטאב פעיל
  var harelArea = document.getElementById('pns-harel-area');
  if (harelArea) {
    try {
      var hasHarel = PENSION_ASSETS.some(function(a){ return a.provider && a.provider.indexOf('הראל') >= 0; });
      // רק אם בטאב פנסיה — עדכן display; אחרת switchTab() אחראי — לא לדרוס אותו
      if (document.querySelector('#tabn-pension.active')) {
        harelArea.style.display = 'flex';
      }
      harelArea.style.opacity = hasHarel ? '1' : '0.4';
      harelArea.innerHTML =
        '<span style="font-size:10px;color:white;margin-left:6px;">הראל:</span>' +
        '<button class="pns-ni-btn '+( hasHarel && !pnsExcludeHarel ? 'active' : '')+'" '+
          (hasHarel ? 'onclick="pensionToggleHarel(false)"' : 'disabled style="cursor:default;"') +
          '>עם</button> ' +
        '<button class="pns-ni-btn '+( hasHarel && pnsExcludeHarel  ? 'active' : '')+'" '+
          (hasHarel ? 'onclick="pensionToggleHarel(true)"' : 'disabled style="cursor:default;"') +
          '>ללא</button>';
    } catch(e) { /* UI update failure must never block data loading */ }
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
  // v104.1: sync overview header KPI label if rendered
  if (typeof ovRenderKPIs === 'function') ovRenderKPIs();
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

  // v105.3: compute exact with/without Harel values for Overview card (same tax engine, no scaling)
  (function() {
    var _royBase   = PENSION_ASSETS.filter(function(a){ return !a.isPendingReview && (!a.owner || a.owner === 'רועי'); });
    var _noHarel   = _royBase.filter(function(a){ return !a.provider || a.provider.indexOf('הראל') < 0; });
    function _calcNet(tp) {
      var _exempt  = pnsExemptBasket * pensionExemptFrac / 180;
      var _taxable = Math.max(0, tp - _exempt);
      var _tax;
      if (taxMethod === '31')      _tax = _taxable * 0.31;
      else if (taxMethod === '35') _tax = _taxable * 0.35;
      else if (taxMethod === '47') _tax = _taxable * 0.47;
      else                         _tax = pnsCalcTax(_taxable);
      return Math.round(tp - _tax);
    }
    var _tpWith    = _royBase.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
    var _tpWithout = _noHarel.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
    pnsNetMonthlyWithHarel = _tpWith    > 0 ? _calcNet(_tpWith)    : 0;
    pnsNetMonthlyNoHarel   = _tpWithout > 0 ? _calcNet(_tpWithout) : 0;
  })();

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
  var sl  = document.getElementById('pns-ret-yield-slider');
  var num = document.getElementById('pns-ret-yield-num');
  if (sl  && parseFloat(sl.value)  !== pnsRetirementYield) sl.value  = pnsRetirementYield;
  if (num && parseFloat(num.value) !== pnsRetirementYield) num.value = pnsRetirementYield;
  if (sl) sl.style.setProperty('--pns-val', (pnsRetirementYield / 6 * 100) + '%');
  // v103.31: wire "תשואת הון פנסיוני" slider to simulator — it feeds retYieldMonthly in simRunEngine
  if (typeof simRenderChart === 'function' && typeof simRunEngine === 'function') {
    simRenderChart(simRunEngine());
  }
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

// ── v133.0: Retirement Amounts Sheet Detector + Parser ───────────
// מזהה גיליון עם עמודת "קטגוריה" וערכים "סכומי פרישה" ומחזיר שמו

function detectRetirementSheet(wb) {
  var CAT_KEY = 'קטגוריה'.normalize('NFC');
  var RET_KEY = 'סכומי פרישה'.normalize('NFC');
  console.log('[v137 detect] Scanning', wb.SheetNames.length, 'sheets:', wb.SheetNames);
  for (var si = 0; si < wb.SheetNames.length; si++) {
    var sName = wb.SheetNames[si];
    try {
      var sheet = wb.Sheets[sName];
      if (!sheet || !sheet['!ref']) continue;
      var json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
      // v137: scan up to 25 header rows (was 10) + normalize Hebrew for Unicode robustness
      for (var r = 0; r < Math.min(25, json.length); r++) {
        var row = json[r];
        if (!row) continue;
        for (var c = 0; c < row.length; c++) {
          var cellStr = row[c] ? String(row[c]).trim().normalize('NFC') : '';
          if (cellStr.indexOf(CAT_KEY) >= 0) {
            console.log('[v137 detect] "קטגוריה" col found in sheet "' + sName + '" at row ' + r + ' col ' + c + ' — scanning for "סכומי פרישה"...');
            // Found קטגוריה column header — scan below for "סכומי פרישה"
            for (var rr = r + 1; rr < json.length; rr++) {
              var cell = json[rr] && json[rr][c];
              var cellV = cell ? String(cell).trim().normalize('NFC') : '';
              if (cellV.indexOf(RET_KEY) >= 0) {
                console.log('[v137 detect] ✅ Found "סכומי פרישה" at row ' + rr + ' → using sheet "' + sName + '"');
                return sName;
              }
            }
            console.log('[v137 detect] "קטגוריה" col found but no "סכומי פרישה" rows in sheet "' + sName + '"');
          }
        }
      }
    } catch (e) { console.warn('[v137 detect] Error scanning sheet "' + sName + '":', e); }
  }
  console.warn('[v137 detect] ❌ No retirement sheet found — "קטגוריה"+"סכומי פרישה" absent in all sheets');
  return null;
}

// מפרסר גיליון סכומי פרישה: מחזיר מערך קבוצות לפי חודש
// כל קבוצה: { yr, mo, total (NIS), items: [{label, amount (NIS)}] }
function parseRetirementSheet(wb, sheetName) {
  var sheet = wb.Sheets[sheetName];
  if (!sheet) return [];
  var json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  console.log('[v137 parse] Sheet "' + sheetName + '" | Total rows:', json.length);

  // זיהוי שורת כותרות + עמודות — v137: scan 25 rows, normalize Hebrew
  var headerRowIdx = -1, colDate = -1, colDesc = -1, colCat = -1, colAmt = -1;
  for (var r = 0; r < Math.min(25, json.length); r++) {
    var row = json[r];
    if (!row) continue;
    for (var c = 0; c < row.length; c++) {
      var h = row[c] ? String(row[c]).trim().normalize('NFC') : '';
      if (h.indexOf('תאריך') >= 0 || h.indexOf('חודש') >= 0) colDate = c;
      if ((h.indexOf('תיאור') >= 0 || h.indexOf('פירוט') >= 0 || h.indexOf('שם') >= 0) && colDesc < 0) colDesc = c;
      if (h.indexOf('קטגוריה') >= 0 || h === 'Category') colCat = c;
      if (h.indexOf('סכום') >= 0 || h === 'Amount') colAmt = c;
    }
    if (colCat >= 0 && colAmt >= 0) { headerRowIdx = r; break; }
  }
  console.log('[v137 parse] Header row:', headerRowIdx, '| colDate:', colDate, 'colDesc:', colDesc, 'colCat:', colCat, 'colAmt:', colAmt);
  if (headerRowIdx < 0 || colCat < 0 || colAmt < 0) {
    console.warn('[v137 parse] ❌ Could not find required columns — colCat:', colCat, 'colAmt:', colAmt);
    return [];
  }

  var RET_CAT = 'סכומי פרישה'.normalize('NFC');
  var groups = {}; // key: "YYYY-MM"
  var skippedBadDate = 0;
  for (var ri = headerRowIdx + 1; ri < json.length; ri++) {
    var row = json[ri];
    if (!row) continue;
    var cat = row[colCat] ? String(row[colCat]).trim().normalize('NFC') : '';
    if (cat.indexOf(RET_CAT) < 0) continue;

    // סכום
    var rawAmt = row[colAmt];
    var amt = 0;
    if (rawAmt !== null && rawAmt !== undefined && rawAmt !== '') {
      var n = parseFloat(String(rawAmt).replace(/,/g, '').replace(/[₪\u20aa]/g, ''));
      if (!isNaN(n)) amt = n;
    }
    if (amt === 0) continue;

    // תאריך — Date object / YYYY-MM / MM/YYYY / DD/MM/YYYY / Excel serial
    var rawDate = (colDate >= 0) ? row[colDate] : null;
    var yr = 0, mo = 0;
    if (rawDate instanceof Date) {
      yr = rawDate.getFullYear(); mo = rawDate.getMonth() + 1;
    } else if (rawDate !== null && rawDate !== undefined) {
      var ds = String(rawDate).trim();
      var m4 = ds.match(/^(\d{4})[\/\-](\d{1,2})$/);         // YYYY-MM (v137: new)
      var m2 = ds.match(/^(\d{1,2})[\/\-](\d{4})$/);         // MM/YYYY
      var m3 = ds.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/); // DD/MM/YYYY
      if (m4)      { yr = parseInt(m4[1]); mo = parseInt(m4[2]); }
      else if (m2) { mo = parseInt(m2[1]); yr = parseInt(m2[2]); }
      else if (m3) { mo = parseInt(m3[2]); yr = parseInt(m3[3]); }
      else {
        var serial = parseFloat(ds);
        if (!isNaN(serial) && serial > 40000) {
          var d = XLSX.SSF.parse_date_code ? XLSX.SSF.parse_date_code(serial) : null;
          if (d) { yr = d.y; mo = d.m; }
        }
      }
    }
    if (!yr || !mo || yr < 2026 || yr > 2080 || mo < 1 || mo > 12) {
      skippedBadDate++;
      console.log('[v137 parse] Row', ri, '— skipped bad date. rawDate:', rawDate, 'parsed yr:', yr, 'mo:', mo);
      continue;
    }

    var key = yr + '-' + (mo < 10 ? '0' : '') + mo;
    if (!groups[key]) groups[key] = { yr: yr, mo: mo, items: [], total: 0 };
    var desc = (colDesc >= 0 && row[colDesc]) ? String(row[colDesc]).trim() : 'פרישה';
    groups[key].items.push({ label: desc, amount: amt });
    groups[key].total += amt;
  }

  var result = Object.keys(groups).sort().map(function(k) { return groups[k]; });
  console.log('[v137 parse] ✅ Parsed', result.length, 'month groups | skipped bad-date rows:', skippedBadDate);
  result.forEach(function(g) {
    console.log('  → ' + g.yr + '-' + (g.mo < 10 ? '0' : '') + g.mo + ' | total:', g.total, '| items:', g.items.length, g.items.map(function(i){ return i.label + ':' + Math.round(i.amount); }).join(', '));
  });
  return result;
}

// ── v143.0: Events Timeline Sheet Parser ("ציר אירועים") — HARD REWRITE ─────
// עמודות: A=סוג האירוע, B=תאריך יעד צפוי (DD/MM/YYYY), C=סכום משוער
// גיבוץ לפי YYYY-MM בלבד — לא לפי קטגוריה.
// תאריך נקרא כמחרוזת DD/MM/YYYY — ללא UTC-shift, ללא Date-object.
function parseEventsTimelineSheet(wb) {
  var SHEET_TARGET = 'ציר אירועים'.normalize('NFC');
  var SKIP_KEY     = 'סך הכל'.normalize('NFC');
  console.log('Available sheets in uploaded file:', wb.SheetNames);
  var sheetName = null;
  for (var si = 0; si < wb.SheetNames.length; si++) {
    if (wb.SheetNames[si].trim().normalize('NFC').indexOf(SHEET_TARGET) >= 0) { sheetName = wb.SheetNames[si]; break; }
  }
  if (!sheetName) { console.log('[v143 evts] גיליון "ציר אירועים" לא נמצא. גיליונות קיימים:', wb.SheetNames); return []; }

  var sheet = wb.Sheets[sheetName];
  if (!sheet || !sheet['!ref']) return [];
  // raw:false + dateNF → תאריכים כמחרוזת DD/MM/YYYY — מונע שגיאת UTC off-by-one
  var json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: 'dd/mm/yyyy', defval: null });
  console.log('[v143 evts] פרסינג "' + sheetName + '" | שורות:', json.length);

  var groups = {}; // key: "YYYY-MM"
  var skipped = 0, parsed = 0;

  for (var ri = 1; ri < json.length; ri++) {
    var row = json[ri];
    if (!row) continue;

    // Extract ONLY from Column A for the label — Column D (קטגוריה) is NOT used
    var eventLabel = row[0] ? String(row[0]).trim().normalize('NFC') : '';
    if (!eventLabel) continue;

    // CRITICAL FILTER: דלג על שורות "סך הכל"
    if (eventLabel.indexOf(SKIP_KEY) >= 0) { skipped++; continue; }

    var rawDateStr = row[1] ? String(row[1]).trim() : ''; // B = תאריך יעד צפוי
    var rawAmt     = row[2]; // C = סכום משוער

    // פרסינג סכום
    var amt = 0;
    if (rawAmt !== null && rawAmt !== undefined && rawAmt !== '') {
      var n = parseFloat(String(rawAmt).replace(/,/g, '').replace(/[₪\u20aa]/g, ''));
      if (!isNaN(n)) amt = n;
    }
    if (amt === 0) continue;

    // Parse date as DD/MM/YYYY string — no UTC shift needed
    // "01/10/2029".split('/') → ['01','10','2029'] → YYYY-MM = "2029-10" ✓
    var yr = 0, mo = 0;
    if (rawDateStr) {
      var parts = rawDateStr.split('/');
      if (parts.length === 3) {
        // DD/MM/YYYY
        mo = parseInt(parts[1], 10);
        yr = parseInt(parts[2], 10);
      } else {
        var dashParts = rawDateStr.split('-');
        if (dashParts.length >= 2) {
          if (dashParts[0].length === 4) { yr = parseInt(dashParts[0], 10); mo = parseInt(dashParts[1], 10); }
          else { mo = parseInt(dashParts[0], 10); yr = parseInt(dashParts[1], 10); }
        }
      }
    }
    if (!yr || !mo || yr < 2024 || yr > 2080 || mo < 1 || mo > 12) {
      console.log('[v143 evts] שורה', ri, '— תאריך לא תקין, מדלג | rawDateStr:', rawDateStr);
      continue;
    }
    // v153.0: data-level filter — discard past events before they enter PERMANENT_EVENTS
    if (parseInt(yr, 10) < new Date().getFullYear()) continue;

    // One group per YYYY-MM — label from Column A only
    var correctDateIndex = yr + '-' + (mo < 10 ? '0' : '') + mo; // e.g. "2029-10"
    if (!groups[correctDateIndex]) groups[correctDateIndex] = { yr: yr, mo: mo, cat: eventLabel, items: [], total: 0 };
    groups[correctDateIndex].items.push({ label: eventLabel, amount: amt });
    groups[correctDateIndex].total += amt;
    parsed++;
  }

  var result = Object.keys(groups).sort().map(function(k) { return groups[k]; });
  console.log('[v143 evts] ✅ פורסרו', parsed, 'שורות ל-', result.length, 'קבוצות | דולגו:', skipped);
  return result;
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
  _dashSavePension(); // v160.0: real persistence via _dashSavePension
}

// v168.4: Extract DOB + names from pension sheet and sync Settings
function extractAndSaveDobFromPensionSheet(wb, sheetName) {
  try {
    // v168.5: raw:false + dateNF forces SheetJS to emit formatted strings, bypassing all serial/leap-year math
    var json = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header:1, defval:null, raw: false, dateNF: 'dd/mm/yyyy' });

    function findPRow(label) {
      for (var i = 0; i < json.length; i++) {
        var c0 = json[i] && (json[i][0] || json[i][1]);
        if (c0 && String(c0).indexOf(label) >= 0) return i;
      }
      return -1;
    }

    function parseDobToISO(val) {
      if (val == null) return '';
      // v168.8: regex bulldozer — strip typographic quotes and hidden chars, extract date numbers only
      var dateMatch = String(val).match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dateMatch) {
        var day   = dateMatch[1].padStart(2, '0');
        var month = dateMatch[2].padStart(2, '0');
        var year  = dateMatch[3];
        return year + '-' + month + '-' + day;
      }
      // Already ISO
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) return val.trim();
      // Excel serial number fallback — use SheetJS SSF exclusively, never JS Date
      var num = typeof val === 'number' ? val : parseFloat(String(val));
      if (!isNaN(num) && num > 20000) {
        var p = XLSX.SSF.parse_date_code(Math.round(num));
        return p.y + '-' + String(p.m).padStart(2,'0') + '-' + String(p.d).padStart(2,'0');
      }
      return '';
    }

    var rOwner = findPRow('שייכות');
    var rDOB   = findPRow('תאריך לידה');

    var name1 = (rOwner >= 0 && json[rOwner][1])  ? String(json[rOwner][1]).trim()  : '';
    var name2 = (rOwner >= 0 && json[rOwner][13]) ? String(json[rOwner][13]).trim() : '';
    var dob1  = rDOB >= 0 ? parseDobToISO(json[rDOB][1])  : '';
    var dob2  = rDOB >= 0 ? parseDobToISO(json[rDOB][13]) : '';

    if (!name1 && !name2 && !dob1 && !dob2) return; // nothing to update

    // Update globals
    if (name1) SIM_USER1_NAME  = name1;
    if (name2) SIM_USER2_NAME  = name2;
    if (dob1)  SIM_USER1_BIRTH = dob1;
    if (dob2)  SIM_USER2_BIRTH = dob2;

    // Persist to Settings localStorage
    var raw = localStorage.getItem(SETTINGS_LS_KEY);
    var s = {};
    try { s = JSON.parse(raw) || {}; } catch(e) {}
    if (name1) s.user1Name  = name1;
    if (name2) s.user2Name  = name2;
    if (dob1)  s.user1Birth = dob1;
    if (dob2)  s.user2Birth = dob2;
    try { localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(s)); } catch(e) {}

    // Update Settings DOM inputs
    var domMap = { 'stg-user1-name': name1, 'stg-user2-name': name2, 'stg-user1-birth': dob1, 'stg-user2-birth': dob2 };
    Object.keys(domMap).forEach(function(id) {
      var el = document.getElementById(id);
      if (el && domMap[id]) el.value = domMap[id];
    });

    // Apply name labels across the dashboard
    if (typeof applyUserNames === 'function') applyUserNames();

    // Recalculate all phase boundaries and re-render simulator
    syncBirthYearsFromSettings();
    if (typeof simGenerateData === 'function') simGenerateData();
    if (typeof simRenderChart  === 'function' && typeof simRunEngine === 'function') simRenderChart(simRunEngine());
  } catch(e) { console.warn('[v168.8 DOB extract] Error:', e); }
}

// =============================================
// SIMULATOR TAB v102.0
// =============================================

var simInited  = false;
var SIM_VIEW   = 'roy'; // 'roy' | 'yael' | 'combined' — v102.3: back to Roy default
var SIM_XAXIS_MODE = 'both'; // 'year' | 'age' | 'both' — v103.36: default = both (age + year)
var SIM_BIRTH_YEAR_ROY  = 1962; // v168.103: restored Roy birth year (born 25/08/1962 → retirement 2029)
var SIM_BIRTH_YEAR_YAEL = 1968; // v168.103: restored Yael birth year (born 28/06/1968)
var SIM_START_YEAR      = 2026; // v105.2: baseline calendar year for age ↔ year mapping
var userCurrentAge      = 64;   // v168.103: 2026 − 1962 (Roy's actual age)
// v103.13-sim: retirement ages as named constants — future-proofed for dynamic sliders
var SIM_RETIREMENT_AGE_ROY  = 67; // גיל פרישה — רועי (men's statutory pension age in Israel)
var SIM_RETIREMENT_AGE_YAEL = 64; // גיל פרישה — יעל (women's statutory pension age in Israel)
var SIM_RATE           = 4;     // % annual investment return
var SIM_PENSION_RATE   = 3;     // % annual pension capital yield — v103.26
var SIM_INFLATION      = 2.5;   // % annual inflation — v103.26
var SIM_VIEW_REAL      = false; // true = show real (inflation-adjusted) values
var SIM_CAPITAL_TAX    = 25;    // % real capital gains tax — v120.0
var SIM_PENSION_ACC    = 0;     // ₪ current pension accumulation — v124.0
var SIM_RENTAL_INCOME  = 0;     // ₪/month rental income — v124.0
var SIM_USER1_NAME     = ''; // v168.72: empty until FFS profile or Excel loaded
var SIM_USER2_NAME     = 'User B'; // v168.59: generic placeholder until real data loaded
// v161.0: hardcoded personal labels (removed Settings inputs — MVP focus)
var SIM_PENSION_FUND_NAME = 'הפניקס+מבטחים';
var SIM_SAVINGS_FUND_NAME = 'הראל';
var SIM_USER1_BIRTH    = '1962-08-25'; // v168.103: Roy default birth date
var SIM_USER2_BIRTH    = '1968-06-28'; // v168.103: Yael default birth date
var FFS_PROFILE_LS_KEY = 'ffs_profile_v1'; // v168.72: FFS side drawer profile key
var FFS_PROFILE = { name:'', birthDate:'', retirementAge:67, lifeExpectancy:84, investments:[], realEstate:[], pension:[], monthlySavings:0, savingsGrowth:0, retirementExpense:0, retirementIncome:0, bridgeAge:0, bridgeCashflow:0, bridgePensionContrib:false, incomePhases:[], ffsEvents:[] }; // v168.77/90 + v170.2 + v170.4
var SIM_TARGET_EXP     = 0;     // monthly expense target NIS — set on init
var SIM_RETIRE_EXP     = 29000; // v168.101: settings-driven expected monthly retirement expense (drives slider range + KPI#3)
var SIM_INSTRUCTOR_SAL = 35000; // monthly instructor salary NIS

// v169.7: Immutable mode defaults — each mode owns its own values, never borrows from another.
// Read-only: use Object.freeze so no code accidentally overwrites these sentinel values.
var ROY_DEFAULTS = Object.freeze({
  retireExp:     29000,  // Roy's confirmed monthly retirement expense (NIS)
  instructorSal: 35000,  // Roy's instructor salary during bridge phase
  rentalIncome:  0,      // loaded dynamically from PENSION_ASSETS at runtime
});
var DEMO_DEFAULTS = Object.freeze({
  retireExp:     20000,  // Dan's monthly retirement expense (NIS)
  instructorSal: 35000,
  rentalIncome:  0,
});
var SIMULATOR_DEFAULTS = Object.freeze({
  retireExp:     0,      // FFS mode: always driven by FFS_PROFILE.retirementExpense
  instructorSal: 0,
  rentalIncome:  0,
});
var SIM_PENSION_MONTHLY = 0; // v168.91: default 0 — always set from data, never from stale memory
var SIM_EVENTS_ON = {};      // { eventIdx: true/false }
var simChartObj = null;
var SIM_CURRENT_SALARY = 0; // v102.4: cached from CF_DATA on init
var SIM_HAREL_MODE = 'without'; // v102.4: 'with' | 'without' — syncs with pension default

// Phase boundaries — v103.13-sim: P2/P3 start years derived from birth + retirement age constants
var _simNow = new Date(); // v168.69: simulation anchor = current calendar month
var SIM_P1_START = { y: _simNow.getFullYear(), m: _simNow.getMonth() + 1 };
var SIM_P2_START = { y: SIM_BIRTH_YEAR_ROY + SIM_RETIREMENT_AGE_YAEL, m:9 }; // User A phase 2: 1962+64=2026
var SIM_P3_START = { y: SIM_BIRTH_YEAR_ROY + SIM_RETIREMENT_AGE_ROY,  m:9 }; // User A phase 3: 1962+67=2029
var SIM_END        = { y: SIM_BIRTH_YEAR_ROY + 95, m:12 }; // cap at User A age 95: 1962+95=2057
var SIM_TARGET_AGE = 67; // v103.33: default target age 67 (retirement year)
var SIM_Y_SCALE    = 60000; // v103.31: Y-axis ceiling in K (default 60M); user-adjustable
var SIM_ZOOM           = 'decade'; // v168.69: default = 10-year window from current month
var SIM_DEFAULT_ZOOM   = 'decade'; // v168.69: default preference = decade (overridden by localStorage if saved)
var SIM_RE_GROWTH_RATE = 2.5;    // v168.112: annual % appreciation for real estate layer (default 2.5% — strictly linear, isolated from investment yield)
// v103.41: custom zoom range overrides (null = use defaults)
var _simZoomNowY = new Date().getFullYear(); // v168.61: dynamic base year
var SIM_ZOOM_CUSTOM = { retStart: 2047, retEnd: 2051, decStart: _simZoomNowY, decEnd: _simZoomNowY + 10 }; // v168.61: default = current year + 10 (responsive to date)

// v103.42 / v167.7: zoom range helpers
// 'decade' = next 10 years from TODAY (not from retirement)
function simGetZoomRange() {
  if (SIM_ZOOM === 'retirement') {
    return { start: SIM_ZOOM_CUSTOM.retStart, end: SIM_ZOOM_CUSTOM.retEnd };
  }
  if (SIM_ZOOM === 'decade') {
    return { start: SIM_ZOOM_CUSTOM.decStart, end: SIM_ZOOM_CUSTOM.decEnd }; // v168.59: use custom range inputs
  }
  return { start: SIM_P1_START.y, end: SIM_END.y };
}
function simSetZoom(mode) {
  SIM_ZOOM = mode;
  ['full','retirement','decade'].forEach(function(m) {
    var btn = document.getElementById('sim-zoom-' + m);
    if (!btn) return;
    btn.style.background  = (m === mode) ? '#3b82f6' : 'rgba(0,0,0,0.05)';
    btn.style.color       = (m === mode) ? 'white'   : '#374151';
    btn.style.borderColor = (m === mode) ? '#3b82f6' : 'rgba(0,0,0,0.18)';
  });
  simRenderChart(simRunEngine());
}
// v103.41: toggle settings popover for zoom buttons
function simToggleZoomSettings() {
  var s = document.getElementById('sim-zoom-settings');
  if (!s) return;
  if (s.style.display === 'none') {
    // v168.61: sync current SIM_ZOOM_CUSTOM values into inputs before opening
    var ds = document.getElementById('zoom-dec-start');
    var de = document.getElementById('zoom-dec-end');
    if (ds) ds.value = SIM_ZOOM_CUSTOM.decStart;
    if (de) de.value = SIM_ZOOM_CUSTOM.decEnd;
    s.style.display = 'block';
  } else {
    s.style.display = 'none';
  }
}
// v103.42: read custom zoom overrides from settings inputs
function simApplyZoomSettings() {
  function rd(id, def) { var el = document.getElementById(id); return (el && el.value) ? parseInt(el.value) : def; }
  SIM_ZOOM_CUSTOM.retStart = rd('zoom-ret-start', SIM_ZOOM_CUSTOM.retStart);
  SIM_ZOOM_CUSTOM.retEnd   = rd('zoom-ret-end',   SIM_ZOOM_CUSTOM.retEnd);
  SIM_ZOOM_CUSTOM.decStart = rd('zoom-dec-start', SIM_ZOOM_CUSTOM.decStart);
  SIM_ZOOM_CUSTOM.decEnd   = rd('zoom-dec-end',   SIM_ZOOM_CUSTOM.decEnd);
  // v168.60: persist custom range to localStorage
  try {
    var _sr = localStorage.getItem(SETTINGS_LS_KEY);
    var _s = {}; try { _s = JSON.parse(_sr) || {}; } catch(e) {}
    _s.zoomDecStart = SIM_ZOOM_CUSTOM.decStart;
    _s.zoomDecEnd   = SIM_ZOOM_CUSTOM.decEnd;
    localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(_s));
  } catch(e) {}
  simSetZoom('decade'); // v168.59: activate decade/range mode so custom inputs take effect
}
// v103.41: Real estate growth rate setter
function simSetREGrowth(v) {
  SIM_RE_GROWTH_RATE = parseFloat(v) || 2.5;
  var numEl = document.getElementById('sim-re-growth-num');
  var slEl  = document.getElementById('sim-re-growth-slider');
  if (numEl) numEl.value = SIM_RE_GROWTH_RATE;
  if (slEl)  slEl.value  = SIM_RE_GROWTH_RATE;
  simRenderKPI();
  simRenderChart(simRunEngine());
}
// Slice engine result arrays to a year range (for zoom)
function simSliceResult(result, startYr, endYr) {
  var labels = result.labels || [];
  var s = 0, e = labels.length - 1;
  for (var li = 0; li < labels.length; li++) {
    var yr = parseInt(labels[li]);
    if (!isNaN(yr)) {
      // v105.2: age labels (< 200) must be converted back to calendar years for slicing
      if (yr < 200) yr = yr + SIM_BIRTH_YEAR_ROY;
      if (yr < startYr) s = li + 1;
      if (yr > endYr && e === labels.length - 1) e = li - 1;
    }
  }
  s = Math.max(0, s); e = Math.min(labels.length - 1, e);
  function sl(arr) { return (arr && arr.length) ? arr.slice(s, e + 1) : []; }
  return { labels: sl(result.labels), royData: sl(result.royData), yaelData: sl(result.yaelData),
           royLiquidData: sl(result.royLiquidData), royPhoenixData: sl(result.royPhoenixData),
           royHarelData: sl(result.royHarelData),
           royRealEstateData: sl(result.royRealEstateData),
           phase1EndLabel: result.phase1EndLabel, phase2EndLabel: result.phase2EndLabel };
}

// ── Formatters ──────────────────────────────
// v103.16-sim-ui-safe: safe M/k formatter — returns "0" on bad input to prevent crashes
function simFmtK(v) {
  if (v === undefined || v === null || isNaN(v)) return '0';
  if (typeof v !== 'number') return '0';
  var abs = Math.abs(v);
  if (abs >= 1000) return (v / 1000).toFixed(1) + 'M';
  return Math.round(v) + 'k';
}
// v103.37: M formatter — returns decimal without suffix (e.g. 15600K → "15.6"), for "מיליון ש״ח" sub-label
function simFmtM(v) {
  if (v === undefined || v === null || isNaN(v) || typeof v !== 'number') return '0';
  return (v / 1000).toFixed(1);
}
// v103.31: bare K formatter — plain number without suffix, for use alongside "אלפי ש״ח" sub-label
function simFmtKbare(v) {
  if (v === undefined || v === null || isNaN(v) || typeof v !== 'number') return '0';
  var r = Math.round(v);
  return (r < 0 ? '-' : '') + Math.abs(r).toLocaleString();
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

// ── FFS Capital Getters — v168.72 ─────────────────────────────────────────
// v169.1: return the correct localStorage key based on active mode
function ffsGetActiveKey() {
  return (APP_MODE === 'SIMULATOR') ? SIMULATOR_LS_KEY : FFS_PROFILE_LS_KEY;
}
function ffsLoadProfile() {
  try {
    var raw = localStorage.getItem(ffsGetActiveKey()); // v169.1: scoped by mode
    if (!raw) return;
    var saved = JSON.parse(raw);
    if (saved && typeof saved === 'object') {
      FFS_PROFILE.name           = saved.name           || '';
      FFS_PROFILE.birthDate      = saved.birthDate      || '';
      FFS_PROFILE.retirementAge  = saved.retirementAge  || 67;
      FFS_PROFILE.lifeExpectancy = saved.lifeExpectancy || 84;
      FFS_PROFILE.investments       = saved.investments       || [];
      FFS_PROFILE.realEstate        = saved.realEstate        || [];
      FFS_PROFILE.pension           = saved.pension           || [];
      FFS_PROFILE.monthlySavings    = saved.monthlySavings    || 0;
      FFS_PROFILE.savingsGrowth     = saved.savingsGrowth     || 0;
      FFS_PROFILE.retirementExpense    = saved.retirementExpense    || 0;
      FFS_PROFILE.retirementIncome     = saved.retirementIncome     || 0;
      FFS_PROFILE.bridgeAge            = saved.bridgeAge            || 0;
      FFS_PROFILE.bridgeCashflow       = saved.bridgeCashflow       || 0;
      FFS_PROFILE.bridgePensionContrib = saved.bridgePensionContrib || false;
      FFS_PROFILE.incomePhases         = saved.incomePhases         || []; // v170.2
      FFS_PROFILE.ffsEvents            = saved.ffsEvents            || []; // v170.4
      // v168.76: ensure pension items have pensionType field (backwards compat)
      FFS_PROFILE.pension.forEach(function(p) { if (!p.pensionType) p.pensionType = 'pension'; });
    }
  } catch(e) {}
}
function ffsSaveProfile() {
  try { localStorage.setItem(ffsGetActiveKey(), JSON.stringify(FFS_PROFILE)); } catch(e) {} // v169.1: scoped by mode
  if (typeof ffsDebouncedUpdate === 'function') ffsDebouncedUpdate(); // v170.1: live sidebar
}
function ffsSaveField(key, val) {
  FFS_PROFILE[key] = val;
  // v168.90: live slider sync — retirement income/expense fields update simulator in real-time
  if (!isExcelLoaded()) {
    if (key === 'retirementIncome') {
      SIM_PENSION_MONTHLY = val || 0;
      var _rips = document.getElementById('sim-pension-monthly-slider');
      var _ripn = document.getElementById('sim-pension-monthly-num');
      if (_rips) _rips.value = SIM_PENSION_MONTHLY;
      if (_ripn) _ripn.value = SIM_PENSION_MONTHLY;
      if (simInited) simRenderKPI();
    }
    if (key === 'retirementExpense') {
      SIM_TARGET_EXP = val || 0;
      var _rexs = document.getElementById('sim-exp-slider');
      var _rexn = document.getElementById('sim-exp-num');
      var _rexv = document.getElementById('sim-exp-val');
      if (_rexs) _rexs.value = SIM_TARGET_EXP;
      if (_rexn) _rexn.value = SIM_TARGET_EXP;
      if (_rexv) _rexv.textContent = simFmtNIS(SIM_TARGET_EXP);
      if (simInited) simRenderKPI();
    }
  }
  ffsSaveProfile();
}
function ffsGetLiquidCapital() {
  if (!FFS_PROFILE.investments || !FFS_PROFILE.investments.length) return 0;
  return FFS_PROFILE.investments.reduce(function(s, x) { return s + (x.balance || 0); }, 0);
}
function ffsGetPensionAccumK() {
  if (!FFS_PROFILE.pension || !FFS_PROFILE.pension.length) return 0;
  return FFS_PROFILE.pension.reduce(function(s, x) {
    // ביטוח מנהלים capital = inheritable asset counted in pension accumulation
    return s + (x.accumulation || 0);
  }, 0);
}
function ffsGetRealEstateK() {
  if (!FFS_PROFILE.realEstate || !FFS_PROFILE.realEstate.length) return 0;
  return FFS_PROFILE.realEstate.reduce(function(s, x) { return s + (x.value || 0); }, 0);
}
// v168.75: net monthly rent income (rent minus active mortgage) for a given simulation year — K₪
function ffsGetMonthlyRentNetK(simYear) {
  if (!FFS_PROFILE.realEstate || !FFS_PROFILE.realEstate.length) return 0;
  return FFS_PROFILE.realEstate.reduce(function(s, re) {
    if (re.type !== 'investment' || !re.monthlyRent) return s;
    var net = re.monthlyRent;
    if (re.mortgagePayment > 0 && re.mortgageEndYear > 0 && simYear < re.mortgageEndYear) {
      net -= re.mortgagePayment;
    }
    return s + net / 1000;
  }, 0);
}
// v168.72: AI context for FFS profile (asset names + balances for personalized AI responses)
function buildFFSContext() {
  if (!FFS_PROFILE || (!FFS_PROFILE.name && !FFS_PROFILE.investments.length && !FFS_PROFILE.pension.length && !FFS_PROFILE.realEstate.length)) return '';
  var out = '\n--- FFS_PROFILE ---\n';
  var name = FFS_PROFILE.name || 'המשתמש';
  if (FFS_PROFILE.birthDate) {
    var bd = new Date(FFS_PROFILE.birthDate);
    if (!isNaN(bd.getTime())) {
      var today = new Date();
      var ageExact = (today - bd) / (365.25 * 24 * 3600 * 1000);
      out += 'שם: ' + name + ' | גיל מדויק: ' + ageExact.toFixed(1) + ' | פרישה: גיל ' + (FFS_PROFILE.retirementAge || 67) + ' (' + (bd.getFullYear() + (FFS_PROFILE.retirementAge || 67)) + ') | תוחלת: ' + (FFS_PROFILE.lifeExpectancy || 84) + '\n';
    }
  } else if (FFS_PROFILE.name) {
    out += 'שם: ' + name + ' | פרישה: גיל ' + (FFS_PROFILE.retirementAge || 67) + '\n';
  }
  if (FFS_PROFILE.investments.length) {
    out += 'השקעות:\n';
    FFS_PROFILE.investments.forEach(function(x) { out += '  - ' + (x.name || 'נכס') + ': ' + x.balance + ' K ₪\n'; });
    out += '  סה"כ נזיל: ' + ffsGetLiquidCapital() + ' K ₪\n';
  }
  if (FFS_PROFILE.realEstate.length) {
    out += 'נדל"ן:\n';
    FFS_PROFILE.realEstate.forEach(function(x) { out += '  - ' + (x.name || 'נכס') + ': ' + x.value + ' K ₪ (' + (x.type === 'residence' ? 'מגורים' : 'השקעה') + ')\n'; });
  }
  if (FFS_PROFILE.pension.length) {
    out += 'פנסיה וביטוחים:\n';
    FFS_PROFILE.pension.forEach(function(x) {
      out += '  - ' + (x.name || 'פוליסה') + ' (' + (x.provider || '') + '): צבירה ' + x.accumulation + ' K ₪ | קצבה ' + x.monthlyPension + ' ₪/חודש';
      if (x.lifeInsurance > 0) out += ' | ביטוח חיים ' + (x.lifeInsurance || 0).toLocaleString() + ' ₪ (AI בלבד, לא מוצג בגרף)';
      out += '\n';
    });
    out += '  סה"כ צבירה פנסיונית: ' + ffsGetPensionAccumK() + ' K ₪\n';
  }
  out += '---\n';
  return out;
}

// v168.86: master data source switch — 'EXCEL' uses uploaded file; 'MANUAL' uses FFS drawer
var activeDataSource = 'MANUAL'; // default until Excel is uploaded

// v168.84/86: returns true only when Excel data exists AND user has not switched to manual mode
function isExcelLoaded() {
  if (APP_MODE === 'SIMULATOR') return false; // v169.1: simulator always uses personal FFS data
  if (activeDataSource !== 'EXCEL') return false; // user explicitly chose manual mode
  if (isDemoMode) return false;
  return (CF_DATA && CF_DATA.length > 0) || (PENSION_ASSETS && PENSION_ASSETS.length > 0);
}

// v168.86: raw check — does Excel data exist in memory? (ignores activeDataSource switch)
function _hasRawExcelData() {
  if (APP_MODE === 'SIMULATOR') return false; // v169.1: simulator uses FFS, not Excel
  return !isDemoMode && ((CF_DATA && CF_DATA.length > 0) || (PENSION_ASSETS && PENSION_ASSETS.length > 0));
}

// v168.89: firewall — zero FFS calculation data from active session when Excel is the source.
// Does NOT touch localStorage; ffsToggleDataSource() calls ffsLoadProfile() to restore if user switches back.
function ffsClearMemory() {
  FFS_PROFILE.investments    = [];
  FFS_PROFILE.pension        = [];
  FFS_PROFILE.realEstate     = [];
  FFS_PROFILE.monthlySavings = 0;
  FFS_PROFILE.retirementIncome = 0;
  // Keep identity fields (name/birth/retirementAge) — used for display in drawer, not calculations
}

// v168.90: zero ALL simulator input globals — prevents ghost values (e.g. 34k) from persisting across sessions
function resetAllInputs() {
  SIM_PENSION_MONTHLY = 0;
  SIM_TARGET_EXP      = 0;
  var _ps = document.getElementById('sim-pension-monthly-slider');
  var _pn = document.getElementById('sim-pension-monthly-num');
  if (_ps) _ps.value = 0;
  if (_pn) _pn.value = 0;
  var _es = document.getElementById('sim-exp-slider');
  var _en = document.getElementById('sim-exp-num');
  var _ev = document.getElementById('sim-exp-val');
  if (_es) _es.value = 0;
  if (_en) _en.value = 0;
  if (_ev) _ev.textContent = simFmtNIS ? simFmtNIS(0) : '0 ₪';
}
// v168.96: deep memory wipe — also clears cached salary/rental globals to prevent bleed between Roy/Demo/FFS
function resetCalculationMemory() {
  resetAllInputs();
  SIM_CURRENT_SALARY = 0;
  SIM_RENTAL_INCOME  = 0;
}

// v168.84: derive Layer 2 (Phoenix) display name from actual pension data
function simGetPhoenixLayerName() {
  if (PENSION_ASSETS && PENSION_ASSETS.length) {
    for (var i = 0; i < PENSION_ASSETS.length; i++) {
      var a = PENSION_ASSETS[i];
      if (a.owner === 'יעל') continue;
      if (a.provider && a.provider.indexOf('הראל') >= 0) continue; // skip Harel → Layer 3
      if (a.provider) return a.provider;
    }
  }
  if (!isExcelLoaded() && FFS_PROFILE.pension && FFS_PROFILE.pension.length) {
    for (var j = 0; j < FFS_PROFILE.pension.length; j++) {
      var p = FFS_PROFILE.pension[j];
      if (p.pensionType !== 'manager' && (p.provider || p.name)) return p.provider || p.name;
    }
  }
  return SIM_PENSION_FUND_NAME;
}

// v168.84: derive Layer 3 (Harel/Manager) display name from actual pension data
function simGetHarelLayerName() {
  if (PENSION_ASSETS && PENSION_ASSETS.length) {
    for (var i = 0; i < PENSION_ASSETS.length; i++) {
      var a = PENSION_ASSETS[i];
      if (a.owner === 'יעל') continue;
      if (a.provider && a.provider.indexOf('הראל') >= 0) return a.provider;
    }
  }
  if (!isExcelLoaded() && FFS_PROFILE.pension && FFS_PROFILE.pension.length) {
    for (var j = 0; j < FFS_PROFILE.pension.length; j++) {
      var m = FFS_PROFILE.pension[j];
      if (m.pensionType === 'manager' && (m.provider || m.name)) return m.provider || m.name;
    }
  }
  return SIM_SAVINGS_FUND_NAME;
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
  if (!isExcelLoaded()) total += ffsGetLiquidCapital(); // v168.84: FFS only when no Excel
  return total; // K
}

// v103.38: real estate (dira) value for Roy — dynamic base that grows with SIM_RE_GROWTH_RATE
function simGetRoyRealEstate() {
  var total = 0;
  Object.keys(FUNDS).forEach(function(k) {
    var f = FUNDS[k];
    if (!f || f.owner === 'yael') return;
    if (f.cat !== 'dira') return;
    for (var i = (f.data||[]).length-1; i>=0; i--) {
      if (f.data[i] !== null && f.data[i] !== undefined && f.data[i] > 0) {
        total += f.data[i]; break;
      }
    }
  });
  if (!isExcelLoaded()) total += ffsGetRealEstateK(); // v168.84: FFS only when no Excel
  return total; // K
}

// v103.41: real estate value for Yael (dira category, owner=yael)
function simGetYaelRealEstate() {
  var total = 0;
  Object.keys(FUNDS).forEach(function(k) {
    var f = FUNDS[k];
    if (!f || f.owner !== 'yael') return;
    if (f.cat !== 'dira') return;
    for (var i = (f.data||[]).length-1; i>=0; i--) {
      if (f.data[i] !== null && f.data[i] !== undefined && f.data[i] > 0) {
        total += f.data[i]; break;
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
// v168.96: current rental income from CF_DATA (שכר דירה שוטף — not retirement scenario)
function simGetCurrentRentIncome() {
  if (!CF_DATA || !CF_DATA.length) return 0;
  for (var i = CF_DATA.length-1; i>=0; i--) {
    var r = CF_DATA[i].rows;
    if (r && r.rent_income && r.rent_income.val !== null && r.rent_income.val !== undefined) return r.rent_income.val * 1000;
  }
  return 0;
}
// v168.97: authoritative monthly surplus — reads net_cashflow row directly from CF_DATA (NIS)
// This row is computed by Excel itself (salary + rent − total_exp − loans etc.) — single source of truth
function simGetCurrentNetCashflow() {
  if (!CF_DATA || !CF_DATA.length) return 0;
  for (var i = CF_DATA.length-1; i>=0; i--) {
    var r = CF_DATA[i].rows;
    if (r && r.net_cashflow && r.net_cashflow.val !== null && r.net_cashflow.val !== undefined) return r.net_cashflow.val * 1000;
  }
  return 0;
}

// v168.101: update expense slider min/max from SIM_RETIRE_EXP setting (range = [setting−10K, setting+10K])
function simUpdateExpSliderRange() {
  var lo = Math.max(0, SIM_RETIRE_EXP - 10000);
  var hi = SIM_RETIRE_EXP + 10000;
  var sl = document.getElementById('sim-exp-slider');
  var nm = document.getElementById('sim-exp-num');
  if (sl) { sl.min = lo; sl.max = hi; }
  if (nm) { nm.min = lo; nm.max = hi; }
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
  var total = 0;
  if (PENSION_ASSETS && PENSION_ASSETS.length) {
    total = PENSION_ASSETS.reduce(function(s, a) {
      if (a.owner === 'יעל') return s;
      return s + (a.accumulation || 0);
    }, 0);
  }
  if (!isExcelLoaded()) total += ffsGetPensionAccumK() * 1000; // v168.84: FFS only when no Excel
  return total;
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
  var total = 0;
  if (PENSION_ASSETS && PENSION_ASSETS.length) {
    total = PENSION_ASSETS.reduce(function(s, a) {
      if (a.owner === 'יעל') return s;
      if (a.provider && a.provider.indexOf('הראל') >= 0) return s + (a.accumulation || 0);
      return s;
    }, 0);
  }
  // v168.83/84: FFS ביטוח מנהלים → Harel layer (Layer 3); only when no Excel loaded
  if (!isExcelLoaded() && FFS_PROFILE.pension && FFS_PROFILE.pension.length) {
    FFS_PROFILE.pension.forEach(function(x) {
      if (x.pensionType === 'manager') total += (x.accumulation || 0) * 1000; // K₪ → ₪
    });
  }
  return total;
}
function simGetRoyHarelPension() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    if (a.provider && a.provider.indexOf('הראל') >= 0) return s + (a.expectedPension || 0);
    return s;
  }, 0);
}
// v168.93: rental income from Excel real estate assets (Roy only — NIS/month)
function simGetRoyRentalIncome() {
  if (!PENSION_ASSETS || !PENSION_ASSETS.length) return 0;
  return PENSION_ASSETS.reduce(function(s, a) {
    if (a.owner === 'יעל') return s;
    return s + (a.realEstateIncome || 0);
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

// ── FFS Drawer UI — v168.72 ──────────────────────────────────────────────────
function ffsAddItem(section) {
  var id = 'ffs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  if (section === 'investments') {
    FFS_PROFILE.investments.push({ id: id, name: '', balance: 0, category: '', type: '', liquidity: 'liquid' });
  } else if (section === 'realEstate') {
    FFS_PROFILE.realEstate.push({ id: id, name: '', value: 0, type: 'residence', monthlyRent: 0, mortgagePayment: 0, mortgageEndYear: 0 });
  } else if (section === 'pension') {
    FFS_PROFILE.pension.push({ id: id, name: '', provider: '', pensionType: 'pension', accumulation: 0, monthlyPension: 0, contributionPct: 0, expectedPayout: 0, conversionFactor: 0, survivorsEnabled: false, spousePct: 0, orphanPct: 0, childrenAges: '', lifeInsurance: 0 });
  }
  ffsSaveProfile();
  ffsRenderSection(section);
}
function ffsRemoveItem(section, id) {
  FFS_PROFILE[section] = FFS_PROFILE[section].filter(function(x) { return x.id !== id; });
  ffsSaveProfile();
  ffsRenderSection(section);
}
function ffsUpdateItem(section, id, key, val) {
  var item = FFS_PROFILE[section].find(function(x) { return x.id === id; });
  if (item) { item[key] = val; ffsSaveProfile(); }
}
// v168.75: accordion toggle for FFS drawer sections
function ffsToggleAcc(name) {
  var body  = document.getElementById('ffs-acc-body-' + name);
  var arrow = document.getElementById('ffs-acc-arrow-' + name);
  if (!body) return;
  var isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
}
// v168.75: update drawer header title from best available name
function ffsUpdateDrawerTitle() {
  var titleEl = document.getElementById('ffs-drawer-title');
  if (!titleEl) return;
  // v169.4: mode-aware — each world shows its own name, no cross-contamination
  var name;
  if (APP_MODE === 'SIMULATOR') {
    name = FFS_PROFILE.name || 'אורח';
  } else if (isExcelLoaded()) {
    name = SIM_USER1_NAME || 'אורח';
  } else {
    name = FFS_PROFILE.name || SIM_USER1_NAME || 'אורח';
  }
  titleEl.textContent = '👤 מציג: ' + name;
}
// v168.75: checkbox handler — re-renders section to show/hide sub-fields
function ffsHandleCheckbox(el) {
  var section = el.getAttribute('data-section');
  var id      = el.getAttribute('data-id');
  var key     = el.getAttribute('data-key');
  ffsUpdateItem(section, id, key, el.checked);
  ffsRenderSection(section);
}
// v168.72: data-* helper for event delegation (avoids nested-quote issues in innerHTML)
function ffsHandleInput(el) {
  var section = el.getAttribute('data-section');
  var id = el.getAttribute('data-id');
  var key = el.getAttribute('data-key');
  var val = (el.type === 'number') ? (parseFloat(el.value) || 0) : el.value;
  ffsUpdateItem(section, id, key, val);
  // v168.82: auto-fill lifeInsurance = accumulation for ביטוח מנהלים
  // CRITICAL: update DOM directly — never call ffsRenderSection mid-typing (destroys active input)
  if (section === 'pension' && key === 'accumulation') {
    var _pi = (FFS_PROFILE.pension || []).find(function(x) { return x.id === id; });
    if (_pi && _pi.pensionType === 'manager') {
      ffsUpdateItem('pension', id, 'lifeInsurance', val);
      // target only the lifeInsurance input for this specific item — no DOM teardown
      var _liEls = document.querySelectorAll('[data-section="pension"][data-id="' + id + '"][data-key="lifeInsurance"]');
      _liEls.forEach(function(inp) { inp.value = val; });
    }
  }
}
function ffsHandleRadio(el) {
  var id = el.getAttribute('data-id');
  ffsUpdateItem('realEstate', id, 'type', el.value);
}
function ffsHandleMortgageEnd(el) {
  var id = el.getAttribute('data-id');
  var parts = (el.value || '').split('/');
  var yr = parseInt(parts[parts.length - 1]) || 0;
  ffsUpdateItem('realEstate', id, 'mortgageEndYear', yr);
}
function ffsHandleRemove(el) {
  ffsRemoveItem(el.getAttribute('data-section'), el.getAttribute('data-id'));
}
// v168.75: full rewrite — investments/realEstate/pension with advanced fields
function ffsRenderSection(section) {
  var listId = section === 'realEstate' ? 'ffs-realestate-list' : 'ffs-' + section + '-list';
  var listEl = document.getElementById(listId);
  if (!listEl) return;
  var html = '';
  var inSt = 'background:white;border:1px solid #c9d3e0;border-radius:6px;padding:6px 8px;font-family:Heebo,sans-serif;font-size:12px;color:#1e293b;outline:none;width:100%;box-sizing:border-box;';
  var selSt= 'background:white;border:1px solid #c9d3e0;border-radius:6px;padding:5px 6px;font-family:Heebo,sans-serif;font-size:11px;color:#1e293b;outline:none;width:100%;box-sizing:border-box;direction:rtl;';
  var rmSt = 'background:transparent;border:none;color:#94a3b8;font-size:14px;cursor:pointer;padding:2px 5px;flex-shrink:0;line-height:1;';
  var lbSt = 'font-size:9px;color:#64748b;font-weight:700;margin-bottom:3px;';
  var zebra = ['#f1f5f9', '#ffffff']; // v168.81: higher contrast zebra striping

  (FFS_PROFILE[section] || []).forEach(function(item, idx) {
    var iSt = 'background:' + zebra[idx % 2] + ';border-radius:8px;padding:10px 11px;margin-bottom:6px;border:1px solid #e2e8f0;';
    var eid = item.id;
    var ds  = 'data-section="' + section + '" data-id="' + eid + '"';
    html += '<div style="' + iSt + '">';

    if (section === 'investments') {
      // Row 1: labels
      html += '<div style="display:grid;grid-template-columns:1fr 90px 90px 28px;gap:5px;align-items:end;margin-bottom:3px;">';
      html += '<div style="' + lbSt + '">שם הנכס (אופציונלי)</div>';
      html += '<div style="' + lbSt + '">מספר נכס *</div>';
      html += '<div style="' + lbSt + '">סכום (באלפי ש"ח)</div>';
      html += '<div></div>';
      html += '</div>';
      // Row 2: inputs (all on same row)
      html += '<div style="display:grid;grid-template-columns:1fr 90px 90px 28px;gap:5px;align-items:center;margin-bottom:7px;">';
      html += '<input type="text" style="' + inSt + '" placeholder="שם הנכס" value="' + (item.name || '').replace(/"/g, '&quot;') + '" ' + ds + ' data-key="name" oninput="ffsHandleInput(this)">';
      html += '<input type="text" style="' + inSt + 'text-align:center;" placeholder="מס׳ / שם" value="' + (item.assetNum || '').replace(/"/g, '&quot;') + '" ' + ds + ' data-key="assetNum" oninput="ffsHandleInput(this)">';
      html += '<input type="number" style="' + inSt + 'text-align:center;" placeholder="0" value="' + (item.balance || 0) + '" ' + ds + ' data-key="balance" oninput="ffsHandleInput(this)">';
      html += '<button ' + ds + ' onclick="ffsHandleRemove(this)" style="' + rmSt + '">✕</button>';
      html += '</div>';
      // Row 3: category, type, liquidity
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;">';
      html += '<div><div style="' + lbSt + '">קטגוריה</div><select style="' + selSt + '" ' + ds + ' data-key="category" onchange="ffsHandleInput(this)">';
      ['','קרן השתלמות','קופ"ג','גמל להשקעה','פוליסת חיסכון','מניות/ETF','אחר'].forEach(function(c) {
        html += '<option value="' + c.replace(/"/g, '&quot;') + '"' + ((item.category || '') === c ? ' selected' : '') + '>' + c + '</option>';
      });
      html += '</select></div>';
      html += '<div><div style="' + lbSt + '">סוג</div><select style="' + selSt + '" ' + ds + ' data-key="type" onchange="ffsHandleInput(this)">';
      ['','מנייתי','כללי','כספי'].forEach(function(t) {
        html += '<option value="' + t + '"' + ((item.type || '') === t ? ' selected' : '') + '>' + t + '</option>';
      });
      html += '</select></div>';
      html += '<div><div style="' + lbSt + '">נזילות</div><select style="' + selSt + '" ' + ds + ' data-key="liquidity" onchange="ffsHandleInput(this)">';
      [{v:'liquid',l:'נזיל'},{v:'private',l:'השקעה עצמית'},{v:'pension67',l:'גיל 67+'}].forEach(function(lq) {
        html += '<option value="' + lq.v + '"' + ((item.liquidity || 'liquid') === lq.v ? ' selected' : '') + '>' + lq.l + '</option>';
      });
      html += '</select></div>';
      html += '</div>';

    } else if (section === 'realEstate') {
      // v170.4: Row 1 = name + value + rent + remove; Row 2 = type + mortgage + end date
      var reType = item.type || 'investment'; // v170.4: default to investment
      // Row 1 labels
      html += '<div style="display:grid;grid-template-columns:1fr 80px 80px 28px;gap:5px;align-items:end;margin-bottom:3px;">';
      html += '<div style="' + lbSt + '">שם הנכס</div>';
      html += '<div style="' + lbSt + '">שווי (K ₪)</div>';
      html += '<div style="' + lbSt + '">שכ"ד (₪/חודש)</div>';
      html += '<div></div>';
      html += '</div>';
      // Row 1 inputs
      html += '<div style="display:grid;grid-template-columns:1fr 80px 80px 28px;gap:5px;align-items:center;margin-bottom:6px;">';
      html += '<input type="text" style="' + inSt + '" placeholder="כתובת / שם הנכס" value="' + (item.name || '').replace(/"/g, '&quot;') + '" ' + ds + ' data-key="name" oninput="ffsHandleInput(this)">';
      html += '<input type="number" style="' + inSt + 'text-align:center;" placeholder="0" value="' + (item.value || 0) + '" ' + ds + ' data-key="value" oninput="ffsHandleInput(this)">';
      html += '<input type="number" style="' + inSt + 'text-align:center;" placeholder="0" value="' + (item.monthlyRent || 0) + '" ' + ds + ' data-key="monthlyRent" oninput="ffsHandleInput(this)">';
      html += '<button ' + ds + ' onclick="ffsHandleRemove(this)" style="' + rmSt + '">✕</button>';
      html += '</div>';
      // Row 2: type + mortgage payment + mortgage end (MM/YYYY)
      var mortgageEndDisplay = item.mortgageEndYear ? ('01/' + item.mortgageEndYear) : '';
      html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:6px;">';
      html += '<div>';
      html += '<div style="' + lbSt + '">סוג נכס</div>';
      html += '<div style="display:flex;gap:10px;align-items:center;padding:5px 2px;">';
      html += '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#1e293b;font-weight:600;white-space:nowrap;"><input type="radio" name="re-type-' + eid + '" value="investment" ' + (reType === 'investment' ? 'checked' : '') + ' ' + ds + ' data-key="type" onchange="ffsHandleInput(this)" style="accent-color:#3b82f6;cursor:pointer;"> להשקעה</label>';
      html += '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#1e293b;font-weight:600;white-space:nowrap;"><input type="radio" name="re-type-' + eid + '" value="residence" ' + (reType === 'residence' ? 'checked' : '') + ' ' + ds + ' data-key="type" onchange="ffsHandleInput(this)" style="accent-color:#3b82f6;cursor:pointer;"> דירת מגורים</label>';
      html += '</div>';
      html += '</div>';
      html += '<div><div style="' + lbSt + '">משכנתא (₪/חודש)</div><input type="number" style="' + inSt + 'text-align:center;" placeholder="0" value="' + (item.mortgagePayment || 0) + '" ' + ds + ' data-key="mortgagePayment" oninput="ffsHandleInput(this)"></div>';
      html += '<div><div style="' + lbSt + '">סיום משכנתא (MM/YYYY)</div><input type="text" style="' + inSt + 'text-align:center;" placeholder="01/2035" value="' + mortgageEndDisplay + '" ' + ds + ' data-key="mortgageEndYear" oninput="ffsHandleMortgageEnd(this)"></div>';
      html += '</div>';
      // Row 3: includeInLiquid checkbox (v170.5)
      var inclLiquid = (item.includeInLiquid !== false); // default true
      html += '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:#475569;font-weight:600;">';
      html += '<input type="checkbox" ' + ds + ' data-key="includeInLiquid"' + (inclLiquid ? ' checked' : '') + ' onchange="ffsHandleCheckbox(this)" style="accent-color:#3b82f6;width:14px;height:14px;"> כלול בתזרים הנזיל (משכנתא מתווספת לתזרים בסיום)';
      html += '</label>';

    } else if (section === 'pension') {
      // Row 1: name, provider, type selector, remove
      var isPension  = !item.pensionType || item.pensionType === 'pension';
      var isManager  = item.pensionType === 'manager';
      // v170.4: field order = סוג → גוף → תיאור/שם (optional)
      html += '<div style="display:flex;gap:5px;align-items:center;margin-bottom:7px;">';
      html += '<div style="display:flex;gap:12px;align-items:center;padding:4px 6px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;flex-shrink:0;">';
      html += '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#1e293b;font-weight:600;white-space:nowrap;"><input type="radio" name="pen-type-' + eid + '" value="pension" ' + (isPension ? 'checked' : '') + ' ' + ds + ' data-key="pensionType" onchange="ffsHandleInput(this);ffsRenderSection(\'pension\')" style="accent-color:#3b82f6;cursor:pointer;"> קרן פנסיה</label>';
      html += '<label style="display:flex;align-items:center;gap:4px;cursor:pointer;font-size:11px;color:#1e293b;font-weight:600;white-space:nowrap;"><input type="radio" name="pen-type-' + eid + '" value="manager" ' + (isManager ? 'checked' : '') + ' ' + ds + ' data-key="pensionType" onchange="ffsHandleInput(this);ffsRenderSection(\'pension\')" style="accent-color:#3b82f6;cursor:pointer;"> ביטוח מנהלים</label>';
      html += '</div>';
      html += '<input type="text" list="ffs-providers-dl" style="' + inSt + 'width:100px;" placeholder="גוף מנהל" value="' + (item.provider || '').replace(/"/g, '&quot;') + '" ' + ds + ' data-key="provider" oninput="ffsHandleInput(this)">';
      html += '<input type="text" style="' + inSt + 'flex:1;" placeholder="תיאור / שם (אופציונלי)" value="' + (item.name || '').replace(/"/g, '&quot;') + '" ' + ds + ' data-key="name" oninput="ffsHandleInput(this)">';
      html += '<button ' + ds + ' onclick="ffsHandleRemove(this)" style="' + rmSt + '">✕</button>';
      html += '</div>';
      if (isPension) {
        // קרן פנסיה: payout + contribution + survivors
        html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:6px;">';
        html += '<div><div style="' + lbSt + '">קצבה נוכחית (₪)</div><input type="number" style="' + inSt + 'text-align:center;" value="' + (item.monthlyPension || 0) + '" ' + ds + ' data-key="monthlyPension" oninput="ffsHandleInput(this)"></div>';
        html += '<div><div style="' + lbSt + '">קצבה צפויה (₪)</div><input type="number" style="' + inSt + 'text-align:center;" value="' + (item.expectedPayout || 0) + '" ' + ds + ' data-key="expectedPayout" oninput="ffsHandleInput(this)"></div>';
        html += '<div><div style="' + lbSt + '">הפרשה (%)</div><input type="number" step="0.01" style="' + inSt + 'text-align:center;" placeholder="0.00" value="' + (item.contributionPct || 0) + '" ' + ds + ' data-key="contributionPct" oninput="ffsHandleInput(this)"></div>';
        html += '</div>';
        html += '<div style="border-top:1px solid #f1f5f9;padding-top:6px;">';
        html += '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:11px;color:#475569;font-weight:600;margin-bottom:' + (item.survivorsEnabled ? '7' : '0') + 'px;">';
        html += '<input type="checkbox" ' + ds + ' data-key="survivorsEnabled"' + (item.survivorsEnabled ? ' checked' : '') + ' onchange="ffsHandleCheckbox(this)" style="accent-color:#3b82f6;width:14px;height:14px;"> כיסוי שארים';
        html += '</label>';
        if (item.survivorsEnabled) {
          html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;">';
          html += '<div><div style="' + lbSt + '">בן/בת זוג (%)</div><input type="number" style="' + inSt + 'text-align:center;" value="' + (item.spousePct || 0) + '" ' + ds + ' data-key="spousePct" oninput="ffsHandleInput(this)"></div>';
          html += '<div><div style="' + lbSt + '">יתומים (%)</div><input type="number" style="' + inSt + 'text-align:center;" value="' + (item.orphanPct || 0) + '" ' + ds + ' data-key="orphanPct" oninput="ffsHandleInput(this)"></div>';
          html += '<div><div style="' + lbSt + '">גילאי ילדים</div><input type="text" style="' + inSt + '" placeholder="5,8,12" value="' + (item.childrenAges || '').replace(/"/g, '&quot;') + '" ' + ds + ' data-key="childrenAges" oninput="ffsHandleInput(this)"></div>';
          html += '</div>';
        }
        html += '</div>';
      } else {
        // ביטוח מנהלים: הון צבור + מקדם + ביטוח חיים
        html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;margin-bottom:4px;">';
        html += '<div><div style="' + lbSt + '">הון צבור (K₪)</div><input type="number" style="' + inSt + 'text-align:center;" value="' + (item.accumulation || 0) + '" ' + ds + ' data-key="accumulation" oninput="ffsHandleInput(this)"></div>';
        html += '<div><div style="' + lbSt + '">מקדם המרה</div><input type="number" style="' + inSt + 'text-align:center;" placeholder="200" value="' + (item.conversionFactor || '') + '" ' + ds + ' data-key="conversionFactor" oninput="ffsHandleInput(this)"></div>';
        html += '<div><div style="' + lbSt + '">ביטוח חיים (₪)</div><input type="number" style="' + inSt + 'text-align:center;" value="' + (item.lifeInsurance || 0) + '" ' + ds + ' data-key="lifeInsurance" oninput="ffsHandleInput(this)"></div>';
        html += '</div>';
        if (item.accumulation > 0 && item.conversionFactor > 0) {
          var _monthly = Math.round(item.accumulation * 1000 / item.conversionFactor);
          html += '<div style="font-size:10px;color:#3b82f6;font-weight:600;margin-top:3px;">קצבה מחושבת: ' + _monthly.toLocaleString() + ' ₪/חודש (הון ÷ מקדם)</div>';
        }
        html += '<div style="font-size:9px;color:#94a3b8;margin-top:3px;">הון ביטוח מנהלים = נכס עיזבון (לא נמשך כקצבה)</div>';
      }
    }
    html += '</div>';
  });
  listEl.innerHTML = html;
}
function ffsRenderAll() {
  ['investments', 'realEstate', 'pension'].forEach(ffsRenderSection);
  ffsRenderIncomePhasesUI(); // v170.2
  ffsRenderFfsEventsUI();    // v170.4
  var nameEl      = document.getElementById('ffs-name');
  var birthEl     = document.getElementById('ffs-birth-date');
  var retEl       = document.getElementById('ffs-retirement-age');
  var lifeEl      = document.getElementById('ffs-life-expectancy');
  var savEl       = document.getElementById('ffs-monthly-savings');
  var sldEl       = document.getElementById('ffs-savings-growth-slider');
  var sldLbl      = document.getElementById('ffs-savings-growth-label');
  var expEl       = document.getElementById('ffs-retirement-expense');
  var retIncEl    = document.getElementById('ffs-retirement-income'); // v168.90: new field
  var bridgeAgeEl = document.getElementById('ffs-bridge-age');
  var bridgeCfEl  = document.getElementById('ffs-bridge-cashflow');
  var bridgePcEl  = document.getElementById('ffs-bridge-pension-contrib');

  // v168.85/86: Excel-active state controls drawer lock and switch button
  var _excelActive = isExcelLoaded(); // respects activeDataSource switch
  var _hasRawExcel = _hasRawExcelData();
  var badge     = document.getElementById('ffs-excel-badge');
  var switchDiv = document.getElementById('ffs-source-switch');
  var switchBtn = document.getElementById('ffs-switch-btn');
  var bodyEl    = document.getElementById('ffs-drawer-body');

  // Badge: show only when Excel is the active source
  if (badge) badge.style.display = _excelActive ? 'block' : 'none';
  // Switch button: show whenever Excel data exists in memory
  if (switchDiv) switchDiv.style.display = _hasRawExcel ? 'block' : 'none';
  if (switchBtn) {
    if (activeDataSource === 'EXCEL') {
      switchBtn.textContent = '✏️ עבור למצב הזנה ידנית (FFS)';
      switchBtn.style.background = '#dc2626';
    } else {
      switchBtn.textContent = '📊 חזור לנתוני אקסל';
      switchBtn.style.background = '#2563eb';
    }
  }
  // v168.88: "Avi ghost" cleanup — show "התחל פרופיל חדש" button in manual mode when a profile name exists
  var _freshBtn = document.getElementById('ffs-new-profile-btn');
  if (_freshBtn) {
    var _showFreshBtn = (activeDataSource === 'MANUAL') && !!(FFS_PROFILE.name);
    _freshBtn.style.display = _showFreshBtn ? 'block' : 'none';
  }
  // Lock drawer body when Excel is the active source
  if (bodyEl) {
    bodyEl.style.pointerEvents = _excelActive ? 'none' : '';
    bodyEl.style.opacity       = _excelActive ? '0.62' : '';
  }

  if (_excelActive) {
    // Show Excel-derived profile (not FFS/Avi data)
    if (nameEl)  nameEl.value  = SIM_USER1_NAME || 'רועי';
    if (birthEl) birthEl.value = SIM_USER1_BIRTH || '';
    if (retEl)   retEl.value   = SIM_RETIREMENT_AGE_ROY || 67;
    if (lifeEl)  lifeEl.value  = FFS_PROFILE.lifeExpectancy || 84;
    // Clear FFS-only fields — Excel sources these differently
    if (savEl)       savEl.value         = '';
    if (sldEl)       sldEl.value         = 0;
    if (sldLbl)      sldLbl.textContent  = '0%';
    if (expEl)       expEl.value         = '';
    if (retIncEl)    retIncEl.value      = ''; // v168.90
    if (bridgeAgeEl) bridgeAgeEl.value   = '';
    if (bridgeCfEl)  bridgeCfEl.value    = '';
    if (bridgePcEl)  bridgePcEl.checked  = false;
  } else {
    // Show FFS profile data (normal/guest mode)
    if (nameEl)  nameEl.value  = FFS_PROFILE.name || '';
    if (birthEl) birthEl.value = FFS_PROFILE.birthDate || '';
    if (retEl)   retEl.value   = FFS_PROFILE.retirementAge || 67;
    if (lifeEl)  lifeEl.value  = FFS_PROFILE.lifeExpectancy || 84;
    if (savEl)  savEl.value  = FFS_PROFILE.monthlySavings || 0;
    if (sldEl) { sldEl.value = FFS_PROFILE.savingsGrowth || 0; if (sldLbl) sldLbl.textContent = (FFS_PROFILE.savingsGrowth || 0) + '%'; }
    if (expEl)  expEl.value  = FFS_PROFILE.retirementExpense || '';
    if (retIncEl) retIncEl.value = FFS_PROFILE.retirementIncome || ''; // v168.90
    if (bridgeAgeEl) bridgeAgeEl.value  = FFS_PROFILE.bridgeAge     || '';
    if (bridgeCfEl)  bridgeCfEl.value   = FFS_PROFILE.bridgeCashflow || '';
    if (bridgePcEl)  bridgePcEl.checked = FFS_PROFILE.bridgePensionContrib || false;
  }
  ffsUpdateDrawerTitle(); // v168.75: sync header with active name
  if (typeof ffsUpdateNavSummaries === 'function') ffsUpdateNavSummaries(); // v170.1
  if (typeof ffsUpdateLiveSidebar  === 'function') ffsUpdateLiveSidebar();  // v170.1
}
function openFFSDrawer() {
  ffsRenderAll();
  var backdrop = document.getElementById('ffs-backdrop');
  var drawer   = document.getElementById('ffs-drawer');
  if (!backdrop || !drawer) return;
  backdrop.style.display    = 'block';
  drawer.style.display      = 'flex';
  drawer.style.flexDirection = 'column';
  drawer.style.opacity      = '0';
  drawer.style.transform    = 'translate(-50%, -47%) scale(0.97)';
  setTimeout(function() {
    drawer.style.opacity   = '1';
    drawer.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
  ffsUpdateNavSummaries();
  ffsUpdateLiveSidebar();
}
function closeFFSDrawer() {
  var drawer   = document.getElementById('ffs-drawer');
  var backdrop = document.getElementById('ffs-backdrop');
  if (!drawer) return;
  drawer.style.opacity   = '0';
  drawer.style.transform = 'translate(-50%, -47%) scale(0.97)';
  setTimeout(function() {
    if (drawer)   drawer.style.display = 'none';
    if (backdrop) backdrop.style.display = 'none';
  }, 250);
}
// v170.1: FFS Command Center — navigation, live sidebar, debounced update
var ffsActiveSection = 'profile';
var _ffsDebTimer = null;
var _ffsSections = ['profile', 'income', 'expenses', 'realestate', 'investments', 'pension'];

function ffsNavTo(section) {
  ffsActiveSection = section;
  _ffsSections.forEach(function(s) {
    var panel  = document.getElementById('ffs-section-' + s);
    var navBtn = document.getElementById('ffs-nav-' + s);
    if (panel) panel.style.display = (s === section) ? 'block' : 'none';
    if (navBtn) {
      if (s === section) {
        navBtn.classList.add('ffs-nav-active');
      } else {
        navBtn.classList.remove('ffs-nav-active');
      }
    }
  });
  var center = document.getElementById('ffs-drawer-body');
  if (center) center.scrollTop = 0;
}

function ffsUpdateNavSummaries() {
  var profEl = document.getElementById('ffs-nav-summary-profile');
  if (profEl) {
    var name = FFS_PROFILE.name || '';
    var ageStr = '';
    if (FFS_PROFILE.birthDate) {
      var bd = new Date(FFS_PROFILE.birthDate);
      if (!isNaN(bd.getTime())) ageStr = ', גיל ' + (new Date().getFullYear() - bd.getFullYear());
    }
    profEl.textContent = name ? (name + ageStr) : '';
  }
  var invEl = document.getElementById('ffs-nav-summary-investments');
  if (invEl) {
    var inv = FFS_PROFILE.investments || [];
    if (inv.length) {
      var invTot = inv.reduce(function(s,x){return s+(x.balance||0);},0);
      invEl.textContent = inv.length + ' נכסים, ' + (invTot/1000).toFixed(1) + 'M';
    } else { invEl.textContent = ''; }
  }
  var reEl = document.getElementById('ffs-nav-summary-realestate');
  if (reEl) {
    var re = FFS_PROFILE.realEstate || [];
    if (re.length) {
      var reTot = re.reduce(function(s,x){return s+(x.value||0);},0);
      reEl.textContent = re.length + ' נכסים, ' + (reTot/1000).toFixed(1) + 'M ₪';
    } else { reEl.textContent = ''; }
  }
  var penEl = document.getElementById('ffs-nav-summary-pension');
  if (penEl) {
    var pen = FFS_PROFILE.pension || [];
    penEl.textContent = pen.length ? (pen.length + ' נכסים') : '';
  }
  var incEl = document.getElementById('ffs-nav-summary-income');
  if (incEl) {
    var sav = FFS_PROFILE.monthlySavings || 0;
    incEl.textContent = sav > 0 ? ('₪' + sav.toLocaleString('he-IL') + '/חודש') : '';
  }
  var expEl2 = document.getElementById('ffs-nav-summary-expenses');
  if (expEl2) {
    var exp = FFS_PROFILE.retirementExpense || 0;
    var evCount = (FFS_PROFILE.ffsEvents || []).length;
    var expParts = [];
    if (exp > 0) expParts.push('₪' + exp.toLocaleString('he-IL') + '/חודש');
    if (evCount > 0) expParts.push(evCount + ' אירועים');
    expEl2.textContent = expParts.join(' · ');
  }
}

// v170.4: FFS Special Events — add/remove/render one-time cash events in SIMULATOR
function ffsAddFfsEvent() {
  var ev = { id: 'ffs-ev-' + Date.now(), label: '', targetAge: 0, amountK: 0, type: 'expense' };
  if (!FFS_PROFILE.ffsEvents) FFS_PROFILE.ffsEvents = [];
  FFS_PROFILE.ffsEvents.push(ev);
  ffsSaveProfile();
  ffsRenderFfsEventsUI();
}
function ffsRemoveFfsEvent(id) {
  if (!FFS_PROFILE.ffsEvents) return;
  FFS_PROFILE.ffsEvents = FFS_PROFILE.ffsEvents.filter(function(e) { return e.id !== id; });
  ffsSaveProfile();
  ffsRenderFfsEventsUI();
  ffsUpdateNavSummaries();
}
function ffsUpdateFfsEvent(id, key, val) {
  if (!FFS_PROFILE.ffsEvents) return;
  var ev = FFS_PROFILE.ffsEvents.find(function(e) { return e.id === id; });
  if (ev) { ev[key] = val; ffsSaveProfile(); ffsUpdateNavSummaries(); }
}
function ffsRenderFfsEventsUI() {
  var listEl = document.getElementById('ffs-events-list');
  if (!listEl) return;
  var evs = FFS_PROFILE.ffsEvents || [];
  if (!evs.length) {
    listEl.innerHTML = '<div style="font-size:11px;color:#94a3b8;text-align:center;padding:12px 0;">אין אירועים מוגדרים — לחץ "+ הוסף אירוע"</div>';
    return;
  }
  var inSt2 = 'background:white;border:1px solid #e2e8f0;border-radius:6px;padding:7px 9px;font-family:Heebo,sans-serif;font-size:12px;color:#1e293b;outline:none;box-sizing:border-box;';
  var selSt2 = inSt2 + 'direction:rtl;';
  listEl.innerHTML = evs.map(function(ev) {
    var typeOpts = ['expense','income'].map(function(t) {
      return '<option value="' + t + '"' + (ev.type === t ? ' selected' : '') + '>' + (t === 'expense' ? '📤 הוצאה' : '📥 הכנסה') + '</option>';
    }).join('');
    return '<div style="display:grid;grid-template-columns:1fr 70px 80px 90px 28px;gap:6px;align-items:center;background:#f8fafc;border-radius:9px;padding:9px 11px;border:1px solid #e2e8f0;">' +
      '<input type="text" style="' + inSt2 + '" placeholder="תיאור האירוע (חתונה, ירושה...)" value="' + (ev.label || '').replace(/"/g, '&quot;') + '" oninput="ffsUpdateFfsEvent(\'' + ev.id + '\',\'label\',this.value)">' +
      '<input type="number" style="' + inSt2 + 'text-align:center;" placeholder="גיל" min="20" max="90" value="' + (ev.targetAge || '') + '" oninput="ffsUpdateFfsEvent(\'' + ev.id + '\',\'targetAge\',parseInt(this.value)||0)">' +
      '<input type="number" style="' + inSt2 + 'text-align:center;" placeholder="K ₪" min="0" value="' + (ev.amountK || '') + '" oninput="ffsUpdateFfsEvent(\'' + ev.id + '\',\'amountK\',parseFloat(this.value)||0)">' +
      '<select style="' + selSt2 + '" onchange="ffsUpdateFfsEvent(\'' + ev.id + '\',\'type\',this.value)">' + typeOpts + '</select>' +
      '<button onclick="ffsRemoveFfsEvent(\'' + ev.id + '\')" style="background:transparent;border:none;color:#94a3b8;font-size:15px;cursor:pointer;line-height:1;padding:2px;">✕</button>' +
    '</div>';
  }).join('');
}

// v170.5: Sidebar 5-item breakdown: תזרים נטו | השקעות | נדל"ן | פנסיה | פרישה
function ffsUpdateLiveSidebar() {
  var wealthEl   = document.getElementById('ffs-live-wealth');
  var cashflowEl = document.getElementById('ffs-live-cashflow');
  var invEl2     = document.getElementById('ffs-live-inv');
  var reEl2      = document.getElementById('ffs-live-re');
  var penAccEl   = document.getElementById('ffs-live-pen-accum');
  var retireEl   = document.getElementById('ffs-live-retire');

  // Always compute from FFS_PROFILE — current snapshot, no mode dependency
  var invTot = (FFS_PROFILE.investments || []).reduce(function(s,x){return s+(x.balance||0);},0); // K
  var reTot  = (FFS_PROFILE.realEstate  || []).reduce(function(s,x){return s+(x.value||0);},0);  // K
  var penTot = (FFS_PROFILE.pension     || []).reduce(function(s,x){return s+(x.accumulation||0);},0); // K
  var totalK = invTot + reTot + penTot;

  function fmtK(k) {
    if (!k || k === 0) return '—';
    return k >= 1000 ? ((k/1000).toFixed(2) + 'M') : (k.toLocaleString('he-IL') + 'K');
  }

  // Top KPI: total current assets
  if (wealthEl) wealthEl.textContent = fmtK(totalK) + ' ₪';

  // תזרים נטו — monthly savings
  if (cashflowEl) {
    var sav = FFS_PROFILE.monthlySavings || 0;
    cashflowEl.textContent = sav > 0 ? ('₪' + sav.toLocaleString('he-IL') + '/חודש') : '—';
  }

  // Breakdown rows: השקעות | נדל"ן | פנסיה
  if (invEl2)   invEl2.textContent   = invTot > 0 ? fmtK(invTot) + ' ₪' : '—';
  if (reEl2)    reEl2.textContent    = reTot  > 0 ? fmtK(reTot)  + ' ₪' : '—';
  if (penAccEl) penAccEl.textContent = penTot > 0 ? fmtK(penTot) + ' ₪' : '—';

  // פרישה — monthly retirement expense
  if (retireEl) {
    var retExp = FFS_PROFILE.retirementExpense || 0;
    retireEl.textContent = retExp > 0 ? ('₪' + retExp.toLocaleString('he-IL') + '/חודש') : '—';
  }
}

// v170.2: Income Phases — multi-period cash flow entry
function ffsRenderIncomePhasesUI() {
  var listEl = document.getElementById('ffs-income-phases-list');
  if (!listEl) return;
  var phases = FFS_PROFILE.incomePhases || [];
  if (!phases.length) {
    listEl.innerHTML = '<div style="font-size:11px;color:#94a3b8;text-align:center;padding:10px 0;">אין תקופות מוגדרות — לחץ "+ הוסף תקופה"</div>';
    return;
  }
  var inSt = 'width:100%;box-sizing:border-box;background:white;border:1px solid #e2e8f0;border-radius:7px;padding:8px 10px;font-family:Heebo,sans-serif;font-size:13px;color:#1e293b;outline:none;text-align:center;';
  listEl.innerHTML = phases.map(function(p) {
    return '<div style="display:grid;grid-template-columns:90px 90px 1fr 28px;gap:8px;align-items:center;background:#f8fafc;border-radius:9px;padding:9px 11px;border:1px solid #e2e8f0;">' +
      '<input type="number" style="' + inSt + '" placeholder="מגיל" value="' + (p.fromAge || '') + '" oninput="ffsUpdateIncomePhase(\'' + p.id + '\',\'fromAge\',parseInt(this.value)||0)">' +
      '<input type="number" style="' + inSt + '" placeholder="עד גיל" value="' + (p.toAge || '') + '" oninput="ffsUpdateIncomePhase(\'' + p.id + '\',\'toAge\',parseInt(this.value)||0)">' +
      '<input type="number" style="' + inSt + '" placeholder="₪/חודש" value="' + (p.monthlyNet || '') + '" oninput="ffsUpdateIncomePhase(\'' + p.id + '\',\'monthlyNet\',parseFloat(this.value)||0)">' +
      '<button onclick="ffsRemoveIncomePhase(\'' + p.id + '\')" style="background:transparent;border:none;color:#94a3b8;font-size:16px;cursor:pointer;line-height:1;padding:2px;">✕</button>' +
    '</div>';
  }).join('');
}

function ffsAddIncomePhase() {
  if (!FFS_PROFILE.incomePhases) FFS_PROFILE.incomePhases = [];
  FFS_PROFILE.incomePhases.push({ id: 'ip_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), fromAge: 0, toAge: 0, monthlyNet: 0 });
  ffsSaveProfile();
  ffsRenderIncomePhasesUI();
}

function ffsRemoveIncomePhase(id) {
  FFS_PROFILE.incomePhases = (FFS_PROFILE.incomePhases || []).filter(function(p) { return p.id !== id; });
  ffsSaveProfile();
  ffsRenderIncomePhasesUI();
}

function ffsUpdateIncomePhase(id, key, val) {
  var p = (FFS_PROFILE.incomePhases || []).find(function(x) { return x.id === id; });
  if (p) { p[key] = val; ffsSaveProfile(); }
}

function ffsDebouncedUpdate() {
  if (_ffsDebTimer) clearTimeout(_ffsDebTimer);
  _ffsDebTimer = setTimeout(function() {
    if (typeof ffsApplyToSimulator === 'function' && typeof simInited !== 'undefined' && simInited) {
      ffsApplyToSimulator();
    }
    if (typeof ffsUpdateNavSummaries === 'function') ffsUpdateNavSummaries();
    if (typeof ffsUpdateLiveSidebar  === 'function') ffsUpdateLiveSidebar();
  }, 350);
}

// v168.82: sync simulator sliders from FFS profile — strict no-leak mapping
function ffsSyncSliders() {
  if (isExcelLoaded()) return; // v168.87: Excel active — never override sliders with FFS data
  var isFFS = !!(FFS_PROFILE.name || (FFS_PROFILE.investments && FFS_PROFILE.investments.length > 0));
  if (!isFFS) return;
  // Expense slider: strictly from retirementExpense (0 = 0, not 30K ghost)
  SIM_TARGET_EXP = FFS_PROFILE.retirementExpense || 0;
  var _expSld = document.getElementById('sim-exp-slider');
  var _expNum = document.getElementById('sim-exp-num');
  var _expVal = document.getElementById('sim-exp-val');
  if (_expSld) _expSld.value = SIM_TARGET_EXP;
  if (_expNum) _expNum.value = SIM_TARGET_EXP;
  if (_expVal) _expVal.textContent = simFmtNIS(SIM_TARGET_EXP);
  // Fixed income slider: v168.90 — prefer explicit retirementIncome field if set, else sum pension items
  var _penNIS = (FFS_PROFILE.retirementIncome > 0)
    ? FFS_PROFILE.retirementIncome
    : ffsTotalPensionMonthlyNIS();
  SIM_PENSION_MONTHLY = _penNIS; // 0 if no data — no ghost 35K
  var _pnsSld = document.getElementById('sim-pension-monthly-slider');
  var _pnsNum = document.getElementById('sim-pension-monthly-num');
  if (_pnsSld) _pnsSld.value = _penNIS;
  if (_pnsNum) _pnsNum.value = _penNIS;
  simSyncInstrSlider();
}
// v168.81: show HTML reset modal instead of browser confirm()
function ffsResetAndReload() {
  var modal = document.getElementById('ffs-reset-modal');
  if (modal) { modal.style.display = 'flex'; return; }
  if (!confirm('האם אתה בטוח? פעולה זו אינה ניתנת לביטול.')) return;
  ffsConfirmReset();
}
function ffsConfirmReset() {
  var modal = document.getElementById('ffs-reset-modal');
  if (modal) modal.style.display = 'none';
  closeFFSDrawer();
  // v170.2: Atomic full wipe — clear ALL storage and hard-reload to Guest / 0 state
  try { localStorage.clear(); } catch(e) {}
  try { sessionStorage.clear(); } catch(e) {}
  setTimeout(function() { location.reload(); }, 200);
}
function ffsCancelReset() {
  var modal = document.getElementById('ffs-reset-modal');
  if (modal) modal.style.display = 'none';
}
// v170.5: Blank-Slate guard — confirm before entering Clean Slate mode
function ffsBlankConfirm() {
  var modal = document.getElementById('blank-slate-modal');
  if (modal) modal.style.display = 'none';
  // v170.6: purge ALL FFS/simulator-specific storage keys (atomic clean slate)
  try { localStorage.removeItem('ffs_profile_v1'); } catch(e) {}
  try { localStorage.removeItem('sim_user_events'); } catch(e) {}
  try { localStorage.removeItem('FINANCIAL_SIM_PERSONAL_DATA'); } catch(e) {}
  // Now actually switch to BLANK — bypass the guard by calling the core logic directly
  var _csCover = document.getElementById('clean-slate-cover');
  if (_csCover) _csCover.style.display = 'none';
  absoluteInternalReset();
  APP_MODE = 'BLANK';
  _updateModeSelectorUI('BLANK');
  // v170.6: reset alias display to "אורח" after blank confirm
  if (typeof ffsUpdateDrawerTitle === 'function') ffsUpdateDrawerTitle();
  if (typeof simUpdateNameLabel   === 'function') simUpdateNameLabel();
  var _blankCover = document.getElementById('clean-slate-cover');
  if (_blankCover) _blankCover.style.display = 'flex';
}
function ffsBlankCancel() {
  var modal = document.getElementById('blank-slate-modal');
  if (modal) modal.style.display = 'none';
  // Revert mode selector to previous mode (or SIMULATOR if undefined)
  _updateModeSelectorUI(APP_MODE || 'SIMULATOR');
}
// v170.6: Yoav demo profile — check if FFS is empty before loading
function ffsLoadYoavProfile() {
  var hasData = !!(
    FFS_PROFILE.name ||
    (FFS_PROFILE.investments && FFS_PROFILE.investments.length > 0) ||
    (FFS_PROFILE.realEstate  && FFS_PROFILE.realEstate.length  > 0) ||
    (FFS_PROFILE.pension     && FFS_PROFILE.pension.length     > 0) ||
    FFS_PROFILE.monthlySavings > 0 ||
    FFS_PROFILE.retirementExpense > 0
  );
  if (!hasData) {
    ffsLoadYoavConfirm();
  } else {
    var modal = document.getElementById('yoav-overwrite-modal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(function() {
        var cancelBtn = document.getElementById('yoav-overwrite-cancel-btn');
        if (cancelBtn) cancelBtn.focus();
      }, 50);
    }
  }
}
function ffsLoadYoavConfirm() {
  var modal = document.getElementById('yoav-overwrite-modal');
  if (modal) modal.style.display = 'none';
  // v170.6: Yoav's balanced demo dataset (Age 45, 1 investment, 1 real estate)
  var _uid = function() { return 'yoav_' + Math.random().toString(36).substr(2, 8); };
  FFS_PROFILE.name              = 'יואב';
  FFS_PROFILE.birthDate         = '1981-01-15';
  FFS_PROFILE.retirementAge     = 67;
  FFS_PROFILE.lifeExpectancy    = 85;
  FFS_PROFILE.monthlySavings    = 8000;
  FFS_PROFILE.savingsGrowth     = 3;
  FFS_PROFILE.retirementExpense = 22000;
  FFS_PROFILE.retirementIncome  = 8000;
  FFS_PROFILE.bridgeAge         = 0;
  FFS_PROFILE.bridgeCashflow    = 0;
  FFS_PROFILE.bridgePensionContrib = false;
  FFS_PROFILE.incomePhases      = [];
  FFS_PROFILE.ffsEvents         = [];
  FFS_PROFILE.investments = [{
    id: _uid(), name: 'קרן השתלמות מנהלים', assetNum: 'KH-2024',
    balance: 450, category: 'קרן השתלמות', type: 'מנייתי', liquidity: 'pension67'
  }];
  FFS_PROFILE.realEstate = [{
    id: _uid(), name: 'דירה להשקעה — תל אביב',
    value: 2200, monthlyRent: 5500, type: 'investment',
    mortgagePayment: 3200, mortgageEndYear: 2035, includeInLiquid: true
  }];
  FFS_PROFILE.pension = [];
  ffsSaveProfile();
  if (typeof ffsRenderAll === 'function') ffsRenderAll();
  if (typeof ffsUpdateNavSummaries === 'function') ffsUpdateNavSummaries();
  if (typeof ffsUpdateDrawerTitle  === 'function') ffsUpdateDrawerTitle();
}
function ffsLoadYoavCancel() {
  var modal = document.getElementById('yoav-overwrite-modal');
  if (modal) modal.style.display = 'none';
}
// v168.77: compute total monthly pension NIS from FFS profile pension items
function ffsTotalPensionMonthlyNIS() {
  if (!FFS_PROFILE.pension || !FFS_PROFILE.pension.length) return 0;
  return FFS_PROFILE.pension.reduce(function(s, p) {
    if (p.pensionType === 'manager') {
      if (p.accumulation > 0 && p.conversionFactor > 0) return s + Math.round(p.accumulation * 1000 / p.conversionFactor);
      return s;
    }
    return s + (p.monthlyPension || 0);
  }, 0);
}
// v168.77: show/hide instructor slider based on FFS profile presence
function simSyncInstrSlider() {
  var grp = document.getElementById('sim-instr-group');
  if (!grp) return;
  var isFFS = !!(FFS_PROFILE.name || (FFS_PROFILE.investments && FFS_PROFILE.investments.length > 0));
  // v168.115: also hide in demo mode (instructor salary is Roy-specific, not relevant for Dan)
  var isDemo = (typeof isDemoMode !== 'undefined' && isDemoMode);
  grp.style.display = (isFFS || isDemo) ? 'none' : '';
}
function ffsApplyToSimulator() {
  if (FFS_PROFILE.birthDate) {
    var bd = new Date(FFS_PROFILE.birthDate);
    if (!isNaN(bd.getTime())) {
      SIM_BIRTH_YEAR_ROY = bd.getFullYear();
      SIM_USER1_BIRTH    = FFS_PROFILE.birthDate;
    }
  }
  if (FFS_PROFILE.retirementAge > 0) {
    SIM_RETIREMENT_AGE_ROY = parseInt(FFS_PROFILE.retirementAge) || 67;
    var taInput = document.getElementById('sim-target-age-input');
    if (taInput) { taInput.value = SIM_RETIREMENT_AGE_ROY; }
    simSetTargetAge(SIM_RETIREMENT_AGE_ROY);
  }
  if (FFS_PROFILE.name && !isExcelLoaded()) SIM_USER1_NAME = FFS_PROFILE.name; // v168.84: Excel name wins
  // v168.78: sync all FFS-driven sliders (anti-ghosting)
  ffsSyncSliders();
  // v170.5: Recalculate phase boundaries using FFS profile data
  SIM_P3_START = { y: SIM_BIRTH_YEAR_ROY + SIM_RETIREMENT_AGE_ROY, m: 9 };
  var _bridgeAge = parseInt(FFS_PROFILE.bridgeAge) || 0;
  SIM_P2_START = _bridgeAge > 0
    ? { y: SIM_BIRTH_YEAR_ROY + _bridgeAge, m: 9 }
    : { y: SIM_P3_START.y, m: SIM_P3_START.m };
  SIM_END = { y: SIM_BIRTH_YEAR_ROY + (parseInt(FFS_PROFILE.lifeExpectancy) || 84), m: 12 };
  // v170.4/170.5: apply FFS special events to SIM_USER_EVENTS
  // First remove any previously-applied ffs_event entries
  for (var _fi = SIM_USER_EVENTS.length - 1; _fi >= 0; _fi--) {
    if (SIM_USER_EVENTS[_fi].src === 'ffs_event') SIM_USER_EVENTS.splice(_fi, 1);
  }
  // Re-add one-time events from current FFS profile
  (FFS_PROFILE.ffsEvents || []).forEach(function(ev) {
    if (!ev.targetAge || !ev.amountK) return;
    var birthYear = SIM_BIRTH_YEAR_ROY || new Date().getFullYear() - 40;
    var evYear = birthYear + ev.targetAge;
    var sign = (ev.type === 'income') ? 1 : -1;
    SIM_USER_EVENTS.push({ yr: evYear, mo: 6, label: ev.label || 'אירוע', type: ev.type || 'expense', amount: sign * Math.abs(ev.amountK), permanent: false, src: 'ffs_event' });
  });
  // v170.5: mortgage auto-raise — when mortgage ends, add that payment to monthly cashflow
  (FFS_PROFILE.realEstate || []).forEach(function(re) {
    if (!re.includeInLiquid) return;
    var mortPay = parseFloat(re.mortgagePayment) || 0;
    var mortEnd = parseInt(re.mortgageEndYear)  || 0;
    if (mortPay > 0 && mortEnd > 0) {
      SIM_USER_EVENTS.push({ yr: mortEnd, mo: 1, label: 'סיום משכנתא — ' + (re.name || 'נכס'), type: 'investment', amount: 0, rentMonthly: mortPay / 1000, permanent: true, src: 'ffs_event' });
    }
  });
  _simSaveUserEvents(); // persist

  if (typeof simRenderChart === 'function' && typeof simRunEngine === 'function') {
    simRenderKPI();
    simRenderChart(simRunEngine());
  }
  simUpdateNameLabel(); // v168.73: refresh header label after FFS apply
}
function ffsApplyAndClose() {
  ffsApplyToSimulator();
  closeFFSDrawer();
  simFullRefresh(); // v168.86: full cleanup + re-render after FFS save
}

// v168.78: update header name label — targets nested text span (icon stays separate)
function simUpdateNameLabel() {
  var lbl = document.getElementById('sim-active-name-text');
  if (!lbl) return;
  var name;
  // v169.4: mode-aware name resolution — no cross-mode fallback
  if (APP_MODE === 'SIMULATOR') {
    name = FFS_PROFILE.name || 'אורח';
  } else if (APP_MODE === 'DEMO') {
    name = SIM_USER1_NAME || 'דן';
  } else {
    // EXCEL: Excel data takes priority; fall back to "אורח" if no session data
    var hasExcelData = (sessionStorage.getItem('hasUploadedFiles') === '1') && (simGetRoyCapital() > 0 || (CF_DATA && CF_DATA.length > 0)); // v169.6
    name = hasExcelData ? (SIM_USER1_NAME || 'אורח') : 'אורח';
  }
  lbl.textContent = 'מציג: ' + name;
  // keep pns/inv single-option label in sync
  var pnsOpt = document.getElementById('pns-view-opt-mine');
  var invOpt = document.getElementById('inv-view-opt-roee');
  if (pnsOpt) pnsOpt.textContent = name;
  if (invOpt) invOpt.textContent = name;
  // v168.77: sync instructor slider visibility
  if (typeof simSyncInstrSlider === 'function') simSyncInstrSlider();
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
// Index 0 = current month (SIM_P1_START — set dynamically from new Date())
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
  // v103.38: liquid-only starting capital (no dira) — real estate tracked separately to avoid double-counting yield
  // v103.41: royRealEstateK is now dynamic — grows at SIM_RE_GROWTH_RATE annually + investment events add to it
  // v168.92/93: FIREWALL — enforce strict source isolation before every engine run
  if (isExcelLoaded()) {
    // Excel mode: ensure SIM_PENSION_MONTHLY = net pension + rental income, not stale FFS value
    var _fwNetPns  = (typeof pnsNetMonthlyNoHarel !== 'undefined' && pnsNetMonthlyNoHarel > 0)
      ? pnsNetMonthlyNoHarel : simGetRoyPension();
    var _fwRentNIS = simGetRoyRentalIncome();
    var _fwFixed   = _fwNetPns + _fwRentNIS;
    // v169.7: ALWAYS override with Excel-authoritative value — removes the === 0 guard that
    // allowed Demo ghost incomes (25K) to persist in Excel mode after a mode switch.
    if (_fwFixed > 0) SIM_PENSION_MONTHLY = _fwFixed;
  }
  var royLiquid        = simGetRoyCapital(); // K — stocks, cash, funds (excludes apartment)
  var royRealEstateK   = simGetRoyRealEstate(); // K — dynamic base (grows with RE growth rate)
  var totalPenK        = simGetRoyPensionAccum() / 1000;       // K — total pension accumulation
  var harelK           = simGetRoyHarelAccum() / 1000;         // K — Harel portion
  var royPhoenixCap    = totalPenK - harelK;                   // K — Layer 2: Phoenix/regular pension
  var royHarelCap      = harelK;                               // K — Layer 3: Harel insurance (הון לירושה)
  var totalPremium     = simGetRoyMonthlyPremium();            // NIS/month
  var harelPremium     = simGetRoyHarelPremium();              // NIS/month
  var phoenixPremium   = totalPremium - harelPremium;          // NIS/month
  // v103.4: filter isolation — Yael zeroed in Roy-only view
  var yaelCapital      = (SIM_VIEW === 'roy') ? 0 : simGetYaelCapital();

  // v168.69: after-tax effective yield — capital tax reduces net gain rate
  var _taxFactor       = 1 - Math.max(0, Math.min(1, (SIM_CAPITAL_TAX || 0) / 100));
  // v168.93: cap monthly rate at 2%/month (≈27% annual) to prevent overflow on bad input
  var monthlyRate      = Math.min((SIM_RATE / 100 / 12) * _taxFactor, 0.02);
  var retYieldMonthly  = Math.min((pnsRetirementYield / 100 / 12) * _taxFactor, 0.02);
  var currentSalary      = simGetCurrentSalary();
  var currentNetCashflow = simGetCurrentNetCashflow(); // v168.97: authoritative NIS surplus (Excel net_cashflow row)
  var targetExp          = SIM_TARGET_EXP;
  var instructorSal    = SIM_INSTRUCTOR_SAL;
  var royPhoenixPension = simGetRoyPension();        // NIS/month — used for Layer 2 capital draw
  var royHarelPension   = simGetRoyHarelPension();   // NIS/month — used for Layer 3 capital draw
  // v103.30: Phase 3 liquid income = "הכנסה קבועה" slider (SIM_PENSION_MONTHLY) so slider is live
  var totalPensionIncome = SIM_PENSION_MONTHLY > 0
    ? SIM_PENSION_MONTHLY
    : royPhoenixPension + (SIM_HAREL_MODE === 'with' ? royHarelPension : 0);

  var phase2Idx   = simMonthIdx(SIM_P2_START.y, SIM_P2_START.m);
  var phase3Idx   = simMonthIdx(SIM_P3_START.y, SIM_P3_START.m);
  var totalMonths = simMonthIdx(SIM_END.y, SIM_END.m) + 1;
  var reGrowthMonthly = SIM_RE_GROWTH_RATE / 100 / 12; // v103.41: monthly RE appreciation rate
  // v168.72/84: FFS monthly savings — only when no Excel loaded (strict isolation)
  var _ffsSavingsK = (!isExcelLoaded() && FFS_PROFILE.monthlySavings) ? FFS_PROFILE.monthlySavings / 1000 : 0;
  // v168.92: cap savings growth at 20% annual max to prevent trillion-level overflow
  var _ffsSavingsGrowthMonthly = Math.pow(1 + Math.min((FFS_PROFILE.savingsGrowth || 0), 20) / 100, 1 / 12) - 1;
  // v168.77: bridge period — income changes from bridgeAge to retirementAge
  var _bridgeCashflow = FFS_PROFILE.bridgeCashflow || 0; // NIS/month
  var _bridgeStartIdx = (FFS_PROFILE.bridgeAge > 0 && _bridgeCashflow > 0)
    ? simMonthIdx(SIM_BIRTH_YEAR_ROY + parseInt(FFS_PROFILE.bridgeAge), 9)
    : -1;
  var _bridgePensionContrib = FFS_PROFILE.bridgePensionContrib || false;

  var eventsByMonth = {};
  var reEventsByMonth = {}; // v103.41: tracks investment additions to RE equity
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

  // v103.38: user events — lump sums applied in all phases; investment events add ongoing monthly cashflow
  var monthlyFlowExtra = new Array(totalMonths).fill(0);
  SIM_USER_EVENTS.forEach(function(ev) {
    if (ev.type === 'reminder') return;
    var mIdx = simMonthIdx(ev.yr, ev.mo);
    if (mIdx < 0 || mIdx >= totalMonths) return;
    // Lump sum (amount already in K, correctly signed)
    if (!eventsByMonth[mIdx]) eventsByMonth[mIdx] = 0;
    eventsByMonth[mIdx] += (ev.type === 'investment') ? -Math.abs(ev.amount || 0) : (ev.amount || 0);
    // v103.41: investment purchase → deduct from liquid AND add to RE equity (total wealth stable)
    if (ev.type === 'investment' && (ev.amount || 0) !== 0) {
      if (!reEventsByMonth[mIdx]) reEventsByMonth[mIdx] = 0;
      reEventsByMonth[mIdx] += Math.abs(ev.amount || 0); // K — add purchase price to RE equity
    }
    // Investment type: ongoing monthly rent income + loan payments + balloon
    if (ev.type === 'investment') {
      var rentK = (ev.rentMonthly || 0) / 1000;  // NIS → K/month
      var loanK = (ev.loanMonthly || 0) / 1000;  // NIS → K/month
      if (rentK > 0) {
        for (var ji = mIdx; ji < totalMonths; ji++) monthlyFlowExtra[ji] += rentK;
      }
      if (loanK > 0) {
        // v103.40: explicit loan end year/month (replaces loanYears duration)
        var loanEndYr2 = ev.loanEndYear  || (ev.yr + 10);
        var loanEndMo2 = ev.loanEndMonth || ev.mo;
        var loanEnd    = Math.max(mIdx, simMonthIdx(loanEndYr2, loanEndMo2));
        for (var ji = mIdx; ji < Math.min(loanEnd, totalMonths); ji++) monthlyFlowExtra[ji] -= loanK;
        // v103.40: balloon payment (bullet principal) deducted at loan end date
        if ((ev.balloonAmount || 0) > 0 && loanEnd >= 0 && loanEnd < totalMonths) {
          if (!eventsByMonth[loanEnd]) eventsByMonth[loanEnd] = 0;
          eventsByMonth[loanEnd] -= Math.abs(ev.balloonAmount); // K
        }
      }
    }
  });

  var labels = [], royData = [], yaelData = [], royLiquidData = [], royPhoenixData = [], royHarelData = [], royRealEstateData = [];

  // v134.0: _push helper — snapshots current state into all output arrays
  function _push(lbl) {
    var liqVal = Math.max(0, Math.round(royLiquid));
    var phxVal = Math.max(0, Math.round(royPhoenixCap));
    var hrlVal = Math.max(0, Math.round(royHarelCap));
    var reVal  = Math.max(0, Math.round(royRealEstateK));
    labels.push(lbl);
    royLiquidData.push(liqVal);
    royPhoenixData.push(phxVal);
    royHarelData.push(hrlVal);
    royRealEstateData.push(reVal);
    royData.push(liqVal + phxVal + hrlVal + reVal);
    yaelData.push(Math.max(0, Math.round(yaelCapital)));
  }

  for (var i = 0; i < totalMonths; i++) {
    var ym = simIdxToYM(i);
    // v134.0: monthly label in "YYYY-MM" format — parseInt("2029-10") === 2029 so
    // all downstream year-parsing (sliceResult, tooltip footer) continues to work
    var _lbl = ym.y + '-' + (ym.m < 10 ? '0' + ym.m : String(ym.m));

    // v103.41: RE appreciates first (growth only — events applied below)
    royRealEstateK *= (1 + reGrowthMonthly);

    // ── Layer 2: Phoenix pension capital ──
    if (i < phase3Idx) {
      royPhoenixCap *= (1 + monthlyRate);
      // v168.77: stop pension contributions during bridge period if checkbox unchecked
      var _inBridgePh2 = (_bridgeStartIdx >= 0 && i >= _bridgeStartIdx);
      if (!_inBridgePh2 || _bridgePensionContrib) royPhoenixCap += phoenixPremium / 1000;
    } else {
      // v168.61: Phoenix compounds at retirement yield rate — no capital draw.
      // Pension income is already counted in totalPensionIncome → liquid layer.
      // Removing the draw fixes the "frozen at 3.7M" bug: yield − draw = 0 → flat capital.
      royPhoenixCap *= (1 + retYieldMonthly);
      if (royPhoenixCap < 0) royPhoenixCap = 0;
    }

    // ── Layer 3: Harel insurance capital (הון לירושה) ──
    if (i < phase3Idx) {
      royHarelCap *= (1 + monthlyRate);
      var _inBridgePh3 = (_bridgeStartIdx >= 0 && i >= _bridgeStartIdx);
      if (!_inBridgePh3 || _bridgePensionContrib) royHarelCap += harelPremium / 1000;
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

    // ── Layer 1: Liquid investments (growth + regular monthly flows) ──
    royLiquid *= (1 + monthlyRate);
    // v168.77: bridge period overrides income between bridgeAge and retirementAge
    var _inBridge = (_bridgeStartIdx >= 0 && i >= _bridgeStartIdx);
    if (i < phase2Idx) {
      // v168.106: phase-1 (working years) uses actual current CF_DATA net cashflow — NOT the retirement slider
      // net_cashflow is the authoritative Excel-computed surplus (salary + rent − expenses − loans)
      // Phase-3 (retirement) uses totalPensionIncome − targetExp (slider-driven) — kept below
      var _phase1Base = (currentNetCashflow !== 0) ? currentNetCashflow : (currentSalary - targetExp);
      royLiquid += (_inBridge ? _bridgeCashflow : _phase1Base) / 1000;
    } else if (i < phase3Idx) {
      royLiquid += ((_inBridge ? _bridgeCashflow : instructorSal) - targetExp) / 1000;
    } else {
      royLiquid += (totalPensionIncome - targetExp) / 1000;
    }
    // v103.38: investment monthly cashflow (rent − loan) always applies
    royLiquid += monthlyFlowExtra[i];
    // v168.72: FFS monthly savings compound pre-retirement
    if (i < phase3Idx && _ffsSavingsK > 0) {
      royLiquid += _ffsSavingsK;
      _ffsSavingsK *= (1 + _ffsSavingsGrowthMonthly);
    }
    // v168.75/84: FFS real estate rent — only when no Excel loaded (strict isolation)
    var _rentNetK = !isExcelLoaded() ? ffsGetMonthlyRentNetK(simIdxToYM(i).y) : 0;
    if (_rentNetK !== 0) royLiquid += _rentNetK;

    yaelCapital *= (1 + monthlyRate);

    // v134.0: Double-point trick — push pre-event snapshot THEN apply discrete events
    // This forces Chart.js to draw a 90° vertical segment only at event months;
    // all other months render as smooth slope (tension:0 straight lines).
    var _hasLiqEv = !!eventsByMonth[i];
    var _hasReEv  = !!reEventsByMonth[i];
    if (_hasLiqEv || _hasReEv) {
      _push(_lbl); // pre-event snapshot (after growth, before lump sums)
      if (_hasLiqEv) royLiquid      += eventsByMonth[i];
      if (_hasReEv)  royRealEstateK += reEventsByMonth[i];
    }

    _push(_lbl); // post-event (or single) snapshot
  }

  return { labels: labels, royData: royData,
           royLiquidData: royLiquidData, royPhoenixData: royPhoenixData, royHarelData: royHarelData,
           royRealEstateData: royRealEstateData,
           yaelData: yaelData,
           phase1EndLabel: String(SIM_P2_START.y - 1),
           phase2EndLabel: String(SIM_P3_START.y - 1) };
}

// ── Background Shading Plugin — v129.0: dynamic phase boundaries ─────────────
var simBgPlugin = {
  id: 'simBg',
  beforeDraw: function(chart) {
    var ctx = chart.ctx;
    var ca  = chart.chartArea;
    if (!ca) return;
    // v135.0: labels come from dataset {x,y}.x values (data.labels is absent in {x,y} format)
    var _rawLabels = chart.data.labels;
    var labels = (_rawLabels && _rawLabels.length) ? _rawLabels
      : (function() {
          var _ds0 = chart.data.datasets && chart.data.datasets[0];
          return (_ds0 && _ds0.data) ? _ds0.data.map(function(pt) {
            return typeof pt === 'object' ? String(pt.x) : String(pt);
          }) : [];
        })();
    if (!labels.length) return;
    var xScale = chart.scales.x;
    // Search for the first "YYYY-MM" label whose year matches each phase boundary
    var p2Label = null, p3Label = null;
    for (var _bi = 0; _bi < labels.length; _bi++) {
      var _byr = parseInt(labels[_bi]); // parseInt("2029-03") === 2029
      if (!p2Label && _byr === SIM_P2_START.y) p2Label = labels[_bi];
      if (!p3Label && _byr === SIM_P3_START.y) p3Label = labels[_bi];
      if (p2Label && p3Label) break;
    }
    var x0   = ca.left;
    // v135.0: pass label string to getPixelForValue (works with {x,y} categorical scale)
    var x1   = p2Label ? xScale.getPixelForValue(p2Label) : ca.left + ca.width * 0.05;
    var x2   = p3Label ? xScale.getPixelForValue(p3Label) : ca.left + ca.width * 0.10;
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
  SIM_LAST_RESULT = result; // v168.69: cache full (pre-zoom) result for AI context
  // v103.40: apply zoom slice before rendering
  var zr = simGetZoomRange();
  result = simSliceResult(result, zr.start, zr.end);

  // Re-mount canvas each render
  var old = document.getElementById('sim-chart');
  if (old) old.parentNode.removeChild(old);
  var canvas = document.createElement('canvas');
  canvas.id = 'sim-chart';
  wrap.appendChild(canvas);

  // v103.40: collect events for tooltip — filter to simulation range only (≥2026)
  var _tooltipEvents = (typeof simCollectEvents === 'function')
    ? simCollectEvents().events.filter(function(ev) { return ev.yr >= SIM_P1_START.y; })
    : [];

  var datasets = [];
  var _yaelRaw = result.yaelData;

  if (SIM_VIEW === 'roy') {
    // v103.41: stacked area — Layer0=נדל״ן (bottom), Layer1=השקעות, Layer2=הון פנסיוני, Layer3=הון לירושה (only if data)
    var liq = result.royLiquidData;
    var phx = result.royPhoenixData;
    var hrl = result.royHarelData;
    var re  = result.royRealEstateData || liq.map(function() { return 0; });
    // v168.83: only include Harel layer if it has actual non-zero data
    var _hasHarel = hrl && hrl.some(function(v) { return v > 0; });
    // v168.84: dynamic layer names from actual pension data (no hardcoded "הראל")
    var _phxLabel = simGetPhoenixLayerName();
    var _hrlLabel = _hasHarel ? simGetHarelLayerName() : '';
    // cumulative tops — RE is the bottom base layer
    var reTop  = re;
    var liqTop = re.map(function(v, i) { return v + liq[i]; });
    var phxTop = re.map(function(v, i) { return v + liq[i] + phx[i]; });
    var hrlTop = _hasHarel ? re.map(function(v, i) { return v + liq[i] + phx[i] + hrl[i]; }) : phxTop;
    // v129.0: tension:0 on all layers — straight-line segments so phase transitions
    // and lump-sum event injections appear as clean 90° kinks, not smoothed curves.
    datasets = [
      {
        label: 'נדל״ן',
        data: reTop,
        borderColor: '#a0522d',
        backgroundColor: 'rgba(184,115,51,0.50)',
        fill: 'origin',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: _hasHarel ? 4 : 3
      },
      {
        label: 'השקעות',
        data: liqTop,
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30,64,175,0.45)',
        fill: '-1',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: _hasHarel ? 3 : 2
      },
      {
        label: _phxLabel,
        data: phxTop,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.25)',
        fill: '-1',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: _hasHarel ? 2 : 1,
        _layer: 'phoenix'
      }
    ];
    if (_hasHarel) {
      datasets.push({
        label: _hrlLabel,
        data: hrlTop,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.20)',
        fill: '-1',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4,
        order: 1,
        _layer: 'harel'
      });
    }
  } else if (SIM_VIEW === 'yael') {
    datasets = [{
      label: 'יעל',
      data: result.yaelData,
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236,72,153,0.18)',
      fill: 'origin',
      tension: 0, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4
    }];
  } else {
    // v103.41: Combined — stacked: נדל״ן (bottom) + Roy(liquid, phoenix, harel?) + Yael
    var _cLiq = result.royLiquidData;
    var _cPhx = result.royPhoenixData;
    var _cHrl = result.royHarelData;
    var _cRe  = result.royRealEstateData || _cLiq.map(function() { return 0; });
    // v168.83: only include Harel layer if it has actual non-zero data
    var _cHasHarel = _cHrl && _cHrl.some(function(v) { return v > 0; });
    // v168.84: dynamic layer names from actual pension data
    var _cPhxLabel = simGetPhoenixLayerName();
    var _cHrlLabel = _cHasHarel ? simGetHarelLayerName() : '';
    var _cReTop   = _cRe;
    var _cLiqTop  = _cRe.map(function(v, i) { return v + _cLiq[i]; });
    var _cPhxTop  = _cRe.map(function(v, i) { return v + _cLiq[i] + _cPhx[i]; });
    var _cHrlTop  = _cHasHarel ? _cRe.map(function(v, i) { return v + _cLiq[i] + _cPhx[i] + _cHrl[i]; }) : _cPhxTop;
    var _cYaelTop = _cHasHarel
      ? _cRe.map(function(v, i) { return v + _cLiq[i] + _cPhx[i] + _cHrl[i] + _yaelRaw[i]; })
      : _cRe.map(function(v, i) { return v + _cLiq[i] + _cPhx[i] + _yaelRaw[i]; });
    // v129.0: tension:0 for all layers
    datasets = [
      {
        label: 'נדל״ן',
        data: _cReTop,
        borderColor: '#a0522d',
        backgroundColor: 'rgba(184,115,51,0.50)',
        fill: 'origin',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: _cHasHarel ? 5 : 4
      },
      {
        label: 'השקעות (רועי)',
        data: _cLiqTop,
        borderColor: '#1e40af',
        backgroundColor: 'rgba(30,64,175,0.35)',
        fill: '-1',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: _cHasHarel ? 4 : 3
      },
      {
        label: _cPhxLabel,
        data: _cPhxTop,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,0.20)',
        fill: '-1',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: _cHasHarel ? 3 : 2,
        _layer: 'phoenix'
      }
    ];
    if (_cHasHarel) {
      datasets.push({
        label: _cHrlLabel,
        data: _cHrlTop,
        borderColor: '#34d399',
        backgroundColor: 'rgba(52,211,153,0.16)',
        fill: '-1',
        tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 2,
        _layer: 'harel'
      });
    }
    datasets.push({
      label: 'יעל',
      data: _cYaelTop,
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236,72,153,0.14)',
      fill: '-1',
      tension: 0, borderWidth: 1.5, pointRadius: 0, pointHoverRadius: 4, order: 1
    });
  }

  // v168.53: apply real deflation — simulation steps are MONTHLY, so divide by 12
  // Formula: Value / (1 + annualInflation%)^(months/12)
  if (SIM_VIEW_REAL && SIM_INFLATION > 0) {
    var _inf = SIM_INFLATION / 100;
    datasets = datasets.map(function(ds) {
      return Object.assign({}, ds, {
        data: ds.data.map(function(v, i) { return v / Math.pow(1 + _inf, i / 12); })
      });
    });
  }

  // v135.0: convert all dataset arrays to {x,y} format so duplicate labels map to the
  // SAME x-pixel → truly vertical 90° jump at event months (not just steep diagonal)
  var _lbls = result.labels;
  datasets = datasets.map(function(ds) {
    ds.data = _lbls.map(function(lbl, i) { return { x: lbl, y: ds.data[i] }; });
    return ds;
  });

  // v103.31: Per-view fixed Y-axis — Roy/Combined: SIM_Y_SCALE (default 60M); Yael: fixed 10M
  var _simYMax = (SIM_VIEW === 'yael') ? 10000 : SIM_Y_SCALE; // in K units

  simChartObj = new Chart(canvas.getContext('2d'), {
    type: 'line',
    plugins: [simBgPlugin],
    data: { datasets: datasets }, // v135.0: no separate labels — {x,y} format defines x-axis categories
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      hover: { mode: 'nearest', intersect: false }, // v168.59: hover dot tracks nearest segment, not top of stack
      // v103.43: Smart tooltip — only near top of stack (5px above / 45px below top line)
      onHover: function(event, activeElements, chart) {
        if (!event || !event.native || !activeElements || !activeElements.length) return;
        try {
          var di = activeElements[0].index;
          var ds = chart.data.datasets;
          if (!ds || !ds.length) return;
          var topDs = ds[ds.length - 1]; // topmost stacked line (הון לירושה / יעל)
          if (!topDs || !topDs.data || di >= topDs.data.length) return;
          var topPt = topDs.data[di];
          var topVal = (topPt !== null && typeof topPt === 'object') ? topPt.y : topPt;
          if (topVal === undefined || topVal === null) return;
          var topYPx = chart.scales.y.getPixelForValue(topVal);
          var cursorY = event.native.offsetY;
          // Show only within 5px above / 45px below the topmost line
          if (cursorY < topYPx - 5 || cursorY > topYPx + 45) {
            chart.tooltip.setActiveElements([], {});
          }
        } catch(e) {}
      },
      scales: {
        x: {
          ticks: {
            font: { family: 'Heebo', size: 10 },
            color: '#9ca3af',
            autoSkip: false,  // v135.0: manual filtering — callback returns null for non-Jan
            maxRotation: 0,
            // v134.0/v135.0: labels are "YYYY-MM" — only show January ticks, format per mode
            callback: function(value, index) {
              var lbl = this.getLabelForValue(value);
              var parts = lbl ? String(lbl).split('-') : [];
              if (parts.length < 2) return null;
              var yr = parseInt(parts[0]);
              var mo = parseInt(parts[1]);
              if (isNaN(mo) || mo !== 1) return null; // hide non-January ticks entirely
              if (SIM_XAXIS_MODE === 'both') {
                if (isNaN(yr)) return null;
                var byear = (SIM_VIEW === 'yael') ? SIM_BIRTH_YEAR_YAEL : SIM_BIRTH_YEAR_ROY;
                return [String(yr - byear), String(yr)];
              } else if (SIM_XAXIS_MODE === 'age') {
                if (isNaN(yr)) return null;
                var byear2 = (SIM_VIEW === 'yael') ? SIM_BIRTH_YEAR_YAEL : SIM_BIRTH_YEAR_ROY;
                return String(yr - byear2);
              }
              return String(yr);
            }
          },
          grid: { color: 'rgba(0,0,0,0.04)' }
        },
        y: {
          min: 0,
          max: _simYMax, // v103.30: smart ceiling — floor 60M, grows if scenario exceeds it
          ticks: {
            callback: function(v) { return (v === undefined || v === null || isNaN(v)) ? '0' : (v >= 1000 ? Math.round(v/1000)+'M' : Math.round(v)+'k'); },
            font: { family: 'Heebo', size: 10 },
            color: '#9ca3af'
          },
          grid: { color: 'rgba(0,0,0,0.04)' }
        }
      },
      plugins: {
        legend: { display: false }, // v168.58: custom HTML legend in #sim-legend-html
        tooltip: {
          rtl: true,
          textDirection: 'rtl',
          yAlign: 'bottom',    // v103.29: anchor tooltip above the data lines
          caretPadding: 16,    // extra gap so tooltip floats clear of the lines
          titleFont: { family: 'Heebo' },
          bodyFont: { family: 'Heebo' },
          footerFont: { family: 'Heebo', weight: 'bold' },
          footerColor: '#f9fafb',
          callbacks: {
            label: function(ctx) {
              var v;
              var di = ctx.dataIndex;
              // v168.84: _layer property for robust matching regardless of dynamic label name
              var dsLayer = ctx.dataset._layer || '';
              var dsLabel = ctx.dataset.label || '';
              if (dsLabel === 'נדל״ן') {
                v = (result.royRealEstateData || [])[di] || 0;
              } else if (dsLabel === 'השקעות' || dsLabel === 'השקעות (רועי)') {
                v = result.royLiquidData[di];
              } else if (dsLayer === 'phoenix') {
                v = result.royPhoenixData[di];
              } else if (dsLayer === 'harel') {
                v = result.royHarelData[di];
              } else if (dsLabel === 'יעל') {
                v = _yaelRaw[di];
              } else {
                v = ctx.parsed.y;
              }
              // v168.59: apply real deflation to tooltip values when in Real mode
              if (SIM_VIEW_REAL && SIM_INFLATION > 0) {
                v = v / Math.pow(1 + SIM_INFLATION / 100, di / 12);
              }
              var _tv = (v !== undefined && v !== null && !isNaN(v)) ? v : 0;
              if (_tv === 0) return null; // v167.3: hide zero layers from tooltip
              return ' ' + ctx.dataset.label + ': ' + (_tv >= 1000 ? (_tv/1000).toFixed(1)+'M' : Math.round(_tv)+'k');
            },
            // v103.28/v103.40: Total row + events at this year
            footer: function(items) {
              if (!items || !items.length) return '';
              var di = items[0].dataIndex;
              var total = 0;
              if (SIM_VIEW === 'combined') {
                total = (result.royData[di] || 0) + (result.yaelData[di] || 0);
              } else if (SIM_VIEW === 'roy') {
                total = result.royData[di] || 0;
              } else {
                total = result.yaelData[di] || 0;
              }
              // v168.59: discount total to real value when in Real mode
              if (SIM_VIEW_REAL && SIM_INFLATION > 0) {
                total = total / Math.pow(1 + SIM_INFLATION / 100, di / 12);
              }
              var lines = ['סה״כ: ' + (total >= 1000 ? (total/1000).toFixed(1)+'M' : Math.round(total)+'k')];
              // v144.0: strict YYYY-MM string match — prevents any cross-month smearing
              var _hoveredLabel = String(result.labels[di] || '');
              if (_hoveredLabel) {
                _tooltipEvents.forEach(function(ev) {
                  // Build the event's exact YYYY-MM key and compare to the hovered label
                  var _eventDateIndex = ev.yr + '-' + (ev.mo < 10 ? '0' : '') + ev.mo;
                  if (_hoveredLabel !== _eventDateIndex) return;
                  var absAmt = Math.abs(ev.amount || 0);
                  var amtStr = absAmt >= 1000 ? (ev.amount < 0 ? '-' : '') + (absAmt/1000).toFixed(1)+'M'
                             : absAmt > 0 ? (ev.amount < 0 ? '-' : '') + Math.round(absAmt) + 'k' : '';
                  lines.push('◆ ' + (ev.label || '?') + (amtStr ? ': ' + amtStr : ''));
                  // v141.0: breakdown for retirement AND events_timeline from Excel (uses Col A label)
                  if ((ev.src === 'retirement' || ev.src === 'events_timeline') && ev.breakdown && ev.breakdown.length > 0) {
                    ev.breakdown.forEach(function(item) {
                      var iAmt = Math.abs(item.amount || 0);
                      var iStr = iAmt >= 1000000 ? (iAmt/1000000).toFixed(2)+'M'
                               : iAmt >= 1000     ? Math.round(iAmt/1000)+'k'
                               : Math.round(iAmt) + '₪';
                      lines.push('  · ' + item.label + ': ' + iStr);
                    });
                  }
                });
              }
              return lines;
            }
          }
        }
      }
    }
  });
  // v168.56: update custom HTML legend to match current datasets
  simUpdateLegend(datasets);
  // v103.37: sync timeline X-axis after chart renders (chart area available immediately)
  setTimeout(simRenderTimeline, 0);
}

// v168.58: Render custom HTML legend — 12×12px color squares, direction:ltr
function simUpdateLegend(datasets) {
  var el = document.getElementById('sim-legend-html');
  if (!el) return;
  // v168.85: only show datasets with at least one non-zero value — no phantom keys in guest mode
  var visible = datasets.filter(function(ds) {
    if (!ds.data || !ds.data.length) return false;
    return ds.data.some(function(pt) {
      var v = (pt !== null && typeof pt === 'object') ? pt.y : pt;
      return v > 0;
    });
  });
  if (!visible.length) { el.innerHTML = ''; return; }
  el.innerHTML = visible.map(function(ds) {
    var color = ds.borderColor || '#94a3b8';
    return '<span style="display:inline-flex;flex-direction:row;align-items:center;gap:4px;font-size:9px;color:#374151;font-family:Heebo,sans-serif;white-space:nowrap;">'
      + '<span style="display:inline-block;width:12px;height:12px;background:' + color + ';border-radius:2px;flex-shrink:0;"></span>'
      + (ds.label || '')
      + '</span>';
  }).join('');
}

// ── v103.36: Financial Events Timeline ────────
var SIM_USER_EVENTS = []; // user-added events — persisted to localStorage (v158.0)
var SIM_LAST_RESULT = null; // v168.69: cache last engine output for AI context

// v158.0: save/restore user events; v162.0: save/restore ALL events (including permanent Excel ones)
var _SIM_EVENTS_LS_KEY = 'sim_user_events';
function _simSaveUserEvents() {
  // v162.0: save entire SIM_USER_EVENTS array (permanent Excel events + user-added events)
  try { localStorage.setItem(_SIM_EVENTS_LS_KEY, JSON.stringify(SIM_USER_EVENTS)); } catch(e) {}
}
function _simRestoreUserEvents() {
  try {
    var raw = localStorage.getItem(_SIM_EVENTS_LS_KEY);
    if (!raw) return;
    var saved = JSON.parse(raw);
    if (!Array.isArray(saved) || !saved.length) return;
    // v162.0: replace entire array so permanent Excel events are also restored
    SIM_USER_EVENTS.length = 0;
    saved.forEach(function(ev){ SIM_USER_EVENTS.push(ev); });
  } catch(e) {}
}

// v103.37: collect timeline events from all sources (shared helper)
function simCollectEvents() {
  var events = [];
  var monthNames = ['','ינו׳','פבר׳','מרץ','אפר׳','מאי','יוני','יולי','אוג׳','ספט׳','אוק׳','נוב׳','דצמ׳'];

  // v155.0: NOTES removed from timeline — they are historical investment records,
  // not future planned events. Showing them as orange diamonds was misleading.

  if (PENSION_EVENTS && PENSION_EVENTS.length) {
    PENSION_EVENTS.forEach(function(ev) {
      if (!ev.date) return;
      var dp = ev.date.split('-');
      if (dp.length < 3) return;
      var yr = parseInt(dp[0]), mo = parseInt(dp[1]);
      if (isNaN(yr) || isNaN(mo)) return;
      events.push({ yr: yr, mo: mo, label: ev.label || ev.type || '', amount: ev.amount || 0,
                    color: (ev.amount || 0) >= 0 ? '#34d399' : '#f87171', src: 'pension' });
    });
  }
  SIM_USER_EVENTS.forEach(function(ev, i) {
    var color = '#34d399'; // income (green) default
    // v145.0: permanent Excel events checked FIRST — before type checks — so they are never overridden
    if (ev.permanent && ev.src === 'events_timeline') color = '#1b5e20'; // dark green — permanent Excel events
    else if (ev.permanent && ev.src === 'retirement') color = '#1b5e20'; // dark green — retirement income from Excel
    else if (ev.type === 'expense')    color = '#f87171'; // red
    else if (ev.type === 'investment') color = '#60a5fa'; // blue
    else if (ev.type === 'reminder')   color = '#9ca3af'; // gray
    // v135.0: preserve original src and breakdown so tooltip and timeline render correctly
    events.push({ yr: ev.yr, mo: ev.mo, label: ev.label, amount: ev.amount,
                  color: color, src: ev.src || 'user', _userIdx: i, type: ev.type,
                  breakdown: ev.breakdown || null,
                  rentMonthly: ev.rentMonthly, loanMonthly: ev.loanMonthly,
                  loanEndYear: ev.loanEndYear, loanEndMonth: ev.loanEndMonth, balloonAmount: ev.balloonAmount });
  });
  // v154.0: data-level filter — absolute floor: never allow any year before 2026 to reach the renderer
  var _TIMELINE_MIN_YEAR = Math.max(2026, (typeof SIM_P1_START !== 'undefined' ? SIM_P1_START.y : 2026));
  events = events.filter(function(ev) { return parseInt(ev.yr, 10) >= _TIMELINE_MIN_YEAR; });
  return { events: events, monthNames: monthNames };
}

// v103.39: custom tooltip for timeline diamonds
function simShowTltp(el, e) {
  // v103.43: innerHTML + &#10; → <br> for multi-line tooltips
  var t = document.getElementById('sim-tltp');
  if (!t) return;
  var raw = (el && el.dataset) ? (el.dataset.tip || '') : '';
  // Decode &#10; line breaks; other content is pre-escaped
  t.innerHTML = raw.replace(/&#10;/g, '<br>');
  t.style.display = 'block';
  t.style.left = (e.clientX + 14) + 'px';
  t.style.top  = Math.max(4, e.clientY - 67) + 'px';
}
function simHideTltp() {
  var t = document.getElementById('sim-tltp');
  if (t) t.style.display = 'none';
}

// v103.38: rewritten timeline — pixel-synced, no phase lines, click to edit user events
function simRenderTimeline() {
  var wrap = document.getElementById('sim-timeline');
  if (!wrap) return;

  var collected = simCollectEvents();
  var events = collected.events;
  var monthNames = collected.monthNames;

  // ── X-axis sync with chart — respects active zoom range ─────────────────
  var _zr     = simGetZoomRange();
  var startYr = _zr.start;
  var endYr   = _zr.end;
  var numYrs  = endYr - startYr;

  var ca = (simChartObj && simChartObj.chartArea) ? simChartObj.chartArea : null;
  var canvas = document.getElementById('sim-chart');
  var canvasW = canvas ? (canvas.offsetWidth || canvas.clientWidth || 0) : 0;
  var usePixels = (ca && canvasW > 0);

  // v142.0: yrToLeftPx — read actual rendered pixel from chart's dataset metadata.
  // This is pixel-perfect: it reads the real x-coordinate that Chart.js drew,
  // bypassing any scale API ambiguity with categorical {x,y} axes or duplicate labels.
  function yrToLeftPx(yr, mo) {
    if (!usePixels) return 0;
    try {
      var targetLbl = yr + '-' + ((mo || 1) < 10 ? '0' : '') + (mo || 1);
      var ds = simChartObj && simChartObj.data && simChartObj.data.datasets && simChartObj.data.datasets[0];
      if (ds && ds.data) {
        // Scan for last matching YYYY-MM point (post-event snapshot for jump months)
        for (var pi = ds.data.length - 1; pi >= 0; pi--) {
          var pt = ds.data[pi];
          var ptLbl = (pt && typeof pt === 'object') ? String(pt.x) : '';
          if (ptLbl === targetLbl) {
            var meta = simChartObj.getDatasetMeta(0);
            if (meta && meta.data && meta.data[pi]) {
              var px = meta.data[pi].x;
              if (px !== undefined && !isNaN(px) && px > 0) return px;
            }
            break;
          }
        }
      }
    } catch(e) {}
    // Fallback: linear interpolation (when chart hasn't rendered yet)
    var frac = (yr + ((mo || 1) - 1) / 12 - startYr) / numYrs;
    return ca.left + frac * (ca.right - ca.left);
  }
  function yrToLeft(yr, mo) {
    if (usePixels) return yrToLeftPx(yr, mo).toFixed(1) + 'px';
    var frac = (yr + ((mo || 1) - 1) / 12 - startYr) / numYrs;
    return (frac * 100).toFixed(2) + '%';
  }

  var outerStyle = usePixels
    ? 'position:relative;height:54px;user-select:none;width:' + canvasW + 'px;'
    : 'position:relative;height:54px;user-select:none;';

  var html = '<div style="' + outerStyle + '">';

  // Base bar
  var barL = usePixels ? ca.left.toFixed(1) + 'px' : '0';
  var barR = usePixels ? (canvasW - ca.right).toFixed(1) + 'px' : '0';
  html += '<div style="position:absolute;left:' + barL + ';right:' + barR + ';top:24px;height:2px;'
        + 'background:linear-gradient(90deg,rgba(99,102,241,0.12),rgba(99,102,241,0.35),rgba(99,102,241,0.08));'
        + 'border-radius:2px;"></div>';

  // ── v103.39: proximity zoom — find dense event windows ──────────────────
  // Build a density map: count events per year
  var evDensity = {};
  events.forEach(function(ev) {
    if (!ev.yr) return;
    evDensity[ev.yr] = (evDensity[ev.yr] || 0) + 1;
  });
  // Identify dense zones: if 2+ events within a 2-year window, mark those years for yearly ticks
  var denseSet = {};
  Object.keys(evDensity).forEach(function(y) {
    var yr = parseInt(y);
    var windowCount = 0;
    for (var dy = -2; dy <= 2; dy++) windowCount += (evDensity[yr + dy] || 0);
    if (windowCount >= 3) {
      for (var dy2 = -2; dy2 <= 2; dy2++) denseSet[yr + dy2] = true;
    }
  });

  // Year tick marks — every 5 years base; every 1 year in dense zones
  var ticksDrawn = {};
  for (var ty = startYr; ty <= endYr; ty++) {
    var isFiveYr = (ty % 5 === 0);
    var isDense  = denseSet[ty];
    if (!isFiveYr && !isDense) continue;
    if (ticksDrawn[ty]) continue;
    ticksDrawn[ty] = true;
    var tL = yrToLeft(ty, 1);
    var tickH = isFiveYr ? 8 : 5;
    var tickColor = isFiveYr ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.07)';
    var labelColor = isDense && !isFiveYr ? '#b0b8c4' : '#9ca3af';
    html += '<div style="position:absolute;left:' + tL + ';top:' + (28 - tickH) + 'px;width:1px;height:' + tickH + 'px;background:' + tickColor + ';"></div>';
    html += '<div style="position:absolute;left:' + tL + ';top:30px;font-size:' + (isFiveYr ? 8 : 7) + 'px;color:' + labelColor + ';transform:translateX(-50%);font-family:Heebo,sans-serif;white-space:nowrap;">' + ty + '</div>';
  }

  // ── Event diamond icons — strict range filter (no past events) ──────────
  var _RENDER_MIN_YR = Math.max(2026, (typeof SIM_P1_START !== 'undefined' ? SIM_P1_START.y : 2026));
  events.forEach(function(ev) {
    if (!ev.yr || ev.yr < startYr || ev.yr > endYr) return;
    // v154.0: absolute render-phase guard — parseInt ensures no string-type bypass
    if (parseInt(ev.yr, 10) < _RENDER_MIN_YR) return;
    var px = usePixels ? yrToLeftPx(ev.yr, ev.mo) : 0;
    var diamondLeft = usePixels ? (px - 6).toFixed(1) + 'px' : 'calc(' + yrToLeft(ev.yr, ev.mo) + ' - 6px)';

    // v103.43: Simplified tooltip — Event Name + Monthly Impact (net) only
    var tooltip = (ev.label || '?');
    if (ev.type === 'investment' && (ev.rentMonthly || ev.loanMonthly)) {
      // Net monthly cashflow: rent income minus loan payment
      var netMonthly = (ev.rentMonthly || 0) - (ev.loanMonthly || 0);
      var sign = netMonthly >= 0 ? '+' : '';
      tooltip += '&#10;תזרים חודשי: ' + sign + Math.round(netMonthly).toLocaleString() + '\u20aa';
    } else {
      // Non-investment: show lump-sum amount
      var absAmt = Math.abs(ev.amount || 0);
      if (absAmt >= 1000) {
        tooltip += ': ' + (ev.amount < 0 ? '-' : '') + (absAmt / 1000).toFixed(1) + 'M';
      } else if (absAmt > 0) {
        tooltip += ': ' + (ev.amount < 0 ? '-' : '') + Math.round(absAmt) + 'k';
      }
    }
    // v136.0 / v140.0: Excel permanent events — append breakdown (label = Col A "סוג האירוע")
    if ((ev.src === 'retirement' || ev.src === 'events_timeline') && ev.breakdown && ev.breakdown.length) {
      ev.breakdown.forEach(function(item) {
        var itemK = Math.round((item.amount || 0) / 1000);
        tooltip += '&#10;· ' + (item.label || '') + ': ' + itemK + 'k';
      });
    }
    var safeTip = tooltip.replace(/"/g, '&quot;');

    // All user diamonds: click to edit; others: info tooltip only
    var isUser = (ev._userIdx !== undefined);
    var clickPart = isUser ? ' onclick="simShowAddEventModal(' + ev._userIdx + ')"' : '';
    var border = isUser ? '1.5px solid rgba(255,255,255,0.85)' : '1px solid rgba(255,255,255,0.55)';
    var cursor  = isUser ? 'pointer' : 'default';
    // v145.0: permanent Excel events always dark green, regardless of simCollectEvents color path
    var diamondColor = ev.permanent ? '#1b5e20' : (ev.color || '#6366f1');
    html += '<div' + clickPart
          + ' data-tip="' + safeTip + '"'
          + ' onmouseenter="simShowTltp(this,event)" onmouseleave="simHideTltp()"'
          + ' style="position:absolute;left:' + diamondLeft + ';top:18px;'
          + 'width:12px;height:12px;transform:rotate(45deg);'
          + 'background:' + diamondColor + ';'
          + 'border:' + border + ';border-radius:1px;cursor:' + cursor + ';z-index:2;box-sizing:border-box;">'
          + '</div>';
  });

  // v103.43: Loan-end markers — grey diamonds auto-generated for user investment events with active loans
  SIM_USER_EVENTS.forEach(function(ev) {
    if (ev.type !== 'investment') return;
    if (!(ev.loanMonthly > 0)) return;
    var loanEndYr = ev.loanEndYear  || (ev.yr + 10);
    var loanEndMo = ev.loanEndMonth || (ev.mo || 1);
    if (loanEndYr < startYr || loanEndYr > endYr) return;
    var lendPx = usePixels ? yrToLeftPx(loanEndYr, loanEndMo) : 0;
    var lendLeft = usePixels ? (lendPx - 5).toFixed(1) + 'px' : 'calc(' + yrToLeft(loanEndYr, loanEndMo) + ' - 5px)';
    var lendTip = ('סיום החזר הלוואה: ' + (ev.label || '')).replace(/"/g, '&quot;');
    html += '<div'
          + ' data-tip="' + lendTip + '"'
          + ' onmouseenter="simShowTltp(this,event)" onmouseleave="simHideTltp()"'
          + ' style="position:absolute;left:' + lendLeft + ';top:21px;'
          + 'width:10px;height:10px;transform:rotate(45deg);'
          + 'background:#9ca3af;'
          + 'border:1px solid rgba(255,255,255,0.7);border-radius:1px;cursor:default;z-index:2;box-sizing:border-box;">'
          + '</div>';
  });

  html += '</div>';
  wrap.innerHTML = html;
}

// v103.38: Add / Edit Event Modal — supports all 4 event types + edit mode
var SIM_EDIT_IDX = null; // null = add mode; number = index in SIM_USER_EVENTS (edit mode)

function simShowAddEventModal(idx) {
  SIM_EDIT_IDX = (idx !== undefined && idx !== null) ? idx : null;
  var modal = document.getElementById('sim-add-event-modal');
  if (!modal) return;
  // Reset fields first
  _simResetEventForm();
  // Pre-fill if editing
  if (SIM_EDIT_IDX !== null) {
    var ev = SIM_USER_EVENTS[SIM_EDIT_IDX];
    if (!ev) { SIM_EDIT_IDX = null; }
    else {
      var _el = function(id) { return document.getElementById(id); };
      if (_el('sim-ev-label'))      _el('sim-ev-label').value      = ev.label || '';
      if (_el('sim-ev-year'))       _el('sim-ev-year').value       = ev.yr   || 2030;
      if (_el('sim-ev-month'))      _el('sim-ev-month').value      = ev.mo   || 1;
      if (_el('sim-ev-amount'))     _el('sim-ev-amount').value     = Math.abs(ev.amount || 0);
      var typeEl = _el('sim-ev-type-' + (ev.type || 'income'));
      if (typeEl) typeEl.checked = true;
      if (ev.type === 'investment') {
        if (_el('sim-ev-rent'))           _el('sim-ev-rent').value           = ev.rentMonthly  || 0;
        if (_el('sim-ev-loan'))           _el('sim-ev-loan').value           = ev.loanMonthly  || 0;
        if (_el('sim-ev-loan-end-year'))  _el('sim-ev-loan-end-year').value  = ev.loanEndYear  || (ev.yr + 10);
        if (_el('sim-ev-loan-end-month')) _el('sim-ev-loan-end-month').value = ev.loanEndMonth || 1;
        if (_el('sim-ev-balloon'))        _el('sim-ev-balloon').value        = ev.balloonAmount || 0;
      }
    }
    var titleEl = document.getElementById('sim-ev-modal-title');
    if (titleEl) titleEl.textContent = 'עריכת אירוע';
  } else {
    var titleEl = document.getElementById('sim-ev-modal-title');
    if (titleEl) titleEl.textContent = 'הוספת אירוע סימולציה';
  }
  // Toggle add/edit buttons visibility
  var btnAdd    = document.getElementById('sim-ev-btn-add');
  var btnUpdate = document.getElementById('sim-ev-btn-update');
  var btnDelete = document.getElementById('sim-ev-btn-delete');
  if (btnAdd)    btnAdd.style.display    = SIM_EDIT_IDX === null ? '' : 'none';
  if (btnUpdate) btnUpdate.style.display = SIM_EDIT_IDX !== null ? '' : 'none';
  if (btnDelete) btnDelete.style.display = SIM_EDIT_IDX !== null ? '' : 'none';
  simToggleInvestmentFields();
  modal.style.display = 'flex';
}

function _simResetEventForm() {
  // v103.43: all fields cleared — no "Jan 2026" default, empty/null for clean UX
  var _el = function(id) { return document.getElementById(id); };
  if (_el('sim-ev-label'))          _el('sim-ev-label').value          = '';
  if (_el('sim-ev-year'))           _el('sim-ev-year').value           = '';
  if (_el('sim-ev-month'))          _el('sim-ev-month').value          = '';
  if (_el('sim-ev-amount'))         _el('sim-ev-amount').value         = '';
  if (_el('sim-ev-rent'))           _el('sim-ev-rent').value           = '';
  if (_el('sim-ev-loan'))           _el('sim-ev-loan').value           = '';
  if (_el('sim-ev-loan-end-year'))  _el('sim-ev-loan-end-year').value  = '';
  if (_el('sim-ev-loan-end-month')) _el('sim-ev-loan-end-month').value = '';
  if (_el('sim-ev-balloon'))        _el('sim-ev-balloon').value        = '';
  var typeIncome = _el('sim-ev-type-income');
  if (typeIncome) typeIncome.checked = true;
}

function simCloseEventModal() {
  var modal = document.getElementById('sim-add-event-modal');
  if (modal) modal.style.display = 'none';
  SIM_EDIT_IDX = null;
  _simResetEventForm();
}

// v103.39: public "נקה שדות" button handler — resets form fields and toggles visibility
function simClearEventForm() {
  _simResetEventForm();
  simToggleInvestmentFields();
}

function simToggleInvestmentFields() {
  var typeNode   = document.querySelector('input[name="sim-ev-type"]:checked');
  var type       = typeNode ? typeNode.value : 'income';
  var isInvest   = (type === 'investment');
  var isReminder = (type === 'reminder');
  var investFlds = document.getElementById('sim-ev-invest-fields');
  var amtRow     = document.getElementById('sim-ev-amount-row');
  if (investFlds) investFlds.style.display = isInvest   ? '' : 'none';
  if (amtRow)     amtRow.style.display     = isReminder ? 'none' : '';
  // v103.40: dynamic title in add mode only
  if (SIM_EDIT_IDX === null) {
    var titleMap = { income:'הוספת הכנסה', expense:'הוספת הוצאה', investment:'הוספת השקעה', reminder:'הוספת תזכורת' };
    var titleEl  = document.getElementById('sim-ev-modal-title');
    if (titleEl) titleEl.textContent = titleMap[type] || 'הוספת אירוע סימולציה';
  }
}

function simConfirmAddEvent() {
  var _el = function(id) { return document.getElementById(id); };
  var label = (_el('sim-ev-label') || {}).value || '';
  var yr    = parseInt((_el('sim-ev-year')   || {}).value || 0);
  var mo    = parseInt((_el('sim-ev-month')  || {}).value || 1);
  var amt   = parseFloat((_el('sim-ev-amount') || {}).value || 0);

  var typeNode = document.querySelector('input[name="sim-ev-type"]:checked');
  var type = typeNode ? typeNode.value : 'income';

  if (!label.trim())                        { window.alert('נא להזין שם אירוע'); return; }
  if (isNaN(yr) || yr < 2026 || yr > 2080) { window.alert('שנה לא תקינה (2026–2080)'); return; }
  if (isNaN(mo) || mo < 1 || mo > 12)      { window.alert('חודש לא תקין (1–12)'); return; }

  // v130.0: temporary = manually added via UI; permanent = from data source (Excel/pension)
  var ev = { yr: yr, mo: mo, label: label.trim(), type: type, permanent: false };
  if (type === 'income')     ev.amount = Math.abs(amt);
  if (type === 'expense')    ev.amount = -Math.abs(amt);
  if (type === 'reminder')   ev.amount = 0;
  if (type === 'investment') {
    ev.amount        = -Math.abs(amt); // investment cost deducted from liquid wealth
    ev.rentMonthly   = parseFloat((_el('sim-ev-rent')           || {}).value || 0) || 0;
    ev.loanMonthly   = parseFloat((_el('sim-ev-loan')           || {}).value || 0) || 0;
    ev.loanEndYear   = parseInt(  (_el('sim-ev-loan-end-year')  || {}).value || (yr + 10));
    ev.loanEndMonth  = parseInt(  (_el('sim-ev-loan-end-month') || {}).value || 1);
    ev.balloonAmount = parseFloat((_el('sim-ev-balloon')        || {}).value || 0) || 0;
  }

  if (SIM_EDIT_IDX !== null && SIM_EDIT_IDX >= 0 && SIM_EDIT_IDX < SIM_USER_EVENTS.length) {
    SIM_USER_EVENTS[SIM_EDIT_IDX] = ev; // update existing
  } else {
    SIM_USER_EVENTS.push(ev); // add new
  }
  _simSaveUserEvents(); // v158.0: persist

  simCloseEventModal();
  simRenderTimeline();
  simRenderChart(simRunEngine());
}

function simDeleteEditedEvent() {
  if (SIM_EDIT_IDX === null || SIM_EDIT_IDX < 0) return;
  SIM_USER_EVENTS.splice(SIM_EDIT_IDX, 1);
  _simSaveUserEvents(); // v158.0: persist
  simCloseEventModal();
  simRenderTimeline();
  simRenderChart(simRunEngine());
}

function simClearAllUserEvents() {
  if (!SIM_USER_EVENTS.length) return;
  // v130.0: only remove temporary events (permanent:false); keep permanent ones
  var before = SIM_USER_EVENTS.length;
  for (var _ci = SIM_USER_EVENTS.length - 1; _ci >= 0; _ci--) {
    if (SIM_USER_EVENTS[_ci].permanent !== true) {
      SIM_USER_EVENTS.splice(_ci, 1);
    }
  }
  if (SIM_USER_EVENTS.length === before) return; // nothing removed
  localStorage.removeItem(_SIM_EVENTS_LS_KEY); // v158.0: clear persisted events
  simRenderTimeline();
  simRenderChart(simRunEngine());
}

// kept for backward compat (no longer called from timeline directly)
function simRemoveUserEvent(idx) {
  SIM_USER_EVENTS.splice(idx, 1);
  _simSaveUserEvents(); // v158.0: persist
  simRenderTimeline();
  simRenderChart(simRunEngine());
}

// ── KPI Rendering ─────────────────────────────
function simRenderKPI() {
  // v168.84: in guest/empty state, show '--' for all header KPIs — no phantom numbers
  // v168.89: FFS checks guarded — never count FFS data as "hasData" when Excel is active source
  var _hasAnyData = (CF_DATA && CF_DATA.length > 0) || simGetRoyPensionAccum() > 0 ||
                    (FUNDS && Object.values(FUNDS).some(function(f) {
                      return f && f.data && f.data.some(function(v) { return v > 0; });
                    })) ||
                    (!isExcelLoaded() && ffsGetLiquidCapital() > 0) ||
                    (!isExcelLoaded() && ffsGetPensionAccumK() > 0);
  function el(id) { return document.getElementById(id); }
  if (!_hasAnyData) {
    ['sim-hdr-wealth-at-age','sim-hdr-monthly-income','sim-hdr-monthly-accum','sim-hdr-total-accum'].forEach(function(id) {
      var e = el(id); if (e) { e.textContent = '—'; e.style.color = ''; }
    });
    ['sim-kpi-inv-now','sim-kpi-pen-now','sim-kpi-re-now','sim-kpi-total-now',
     'sim-kpi-salary','sim-kpi-exp','sim-kpi-delta','sim-kpi-pension'].forEach(function(id) {
      var e = el(id); if (e) { e.textContent = '—'; e.style.color = ''; }
    });
    return;
  }
  var royCapital  = simGetRoyCapital();
  var yaelCapital = simGetYaelCapital();
  var rawSal  = simGetCurrentSalary();
  var salary  = (rawSal > 0) ? rawSal : SIM_CURRENT_SALARY;
  var expenses = SIM_TARGET_EXP;
  var delta    = salary - expenses;
  var pension  = simGetRoyPension();
  // v103.1: pension accumulation — show 0K when no data (never show ghost)
  var penAccumK = simGetRoyPensionAccum() / 1000;

  var _showRoy  = (SIM_VIEW !== 'yael');

  // v103.38: liquid capital only (excludes dira — avoids yield double-count); real estate added to total
  var _allInvK = simGetRoyCapital(); // liquid only, no apartment
  var _reK     = (SIM_VIEW !== 'yael') ? simGetRoyRealEstate() : 0;
  var _invK   = (SIM_VIEW === 'yael') ? yaelCapital : _allInvK;
  var _penK   = _showRoy ? penAccumK : 0;
  var _totalK = _invK + _penK + _reK;
  if (SIM_VIEW === 'combined') { _invK = _allInvK + yaelCapital; _totalK = _invK + _penK + _reK; }
  // v103.37: wealth cards in M (no suffix) — sub-label in HTML = "מיליון ש״ח"
  if (el('sim-kpi-inv-now'))   el('sim-kpi-inv-now').textContent   = simFmtM(_invK);
  if (el('sim-kpi-pen-now'))   el('sim-kpi-pen-now').textContent   = _showRoy ? simFmtM(_penK) : '—';
  // v103.42: נדל״ן KPI — current RE value (initial, from data); shown only in Roy/Combined views
  if (el('sim-kpi-re-now'))    el('sim-kpi-re-now').textContent    = _showRoy ? simFmtM(_reK) : '—';
  if (el('sim-kpi-total-now')) el('sim-kpi-total-now').textContent = simFmtM(_totalK);

  // Operational KPIs (info-grid below chart) — Roy-specific: hide in Yael view
  if (el('sim-kpi-salary'))   el('sim-kpi-salary').textContent   = _showRoy ? simFmtNIS(salary)   : '—';
  if (el('sim-kpi-exp'))      el('sim-kpi-exp').textContent      = _showRoy ? simFmtNIS(expenses)  : '—';
  var deltaEl = el('sim-kpi-delta');
  if (deltaEl) {
    if (_showRoy) {
      deltaEl.textContent = simFmtNIS(delta);
      deltaEl.style.color = delta >= 0 ? '#16a34a' : '#dc2626';
    } else {
      deltaEl.textContent = '—';
      deltaEl.style.color = '';
    }
  }
  // v103.4: pension KPI includes Harel if mode='with'
  var totalPension = pension + (SIM_HAREL_MODE === 'with' ? simGetRoyHarelPension() : 0);
  if (el('sim-kpi-pension'))  el('sim-kpi-pension').textContent  = (_showRoy && totalPension > 0) ? simFmtNIS(totalPension) : '—';

  // v103.29: 4-metric header KPIs — fully wired + subtitle context

  // 1. הון חזוי — wealth at target age (v168.114: fully reactive to SIM_TARGET_AGE)
  // Use SIM_LAST_RESULT (cached by simRenderChart) — avoids running engine twice and diverging values
  var _hdrResult = (SIM_LAST_RESULT && SIM_LAST_RESULT.royData && SIM_LAST_RESULT.royData.length > 0)
      ? SIM_LAST_RESULT
      : simRunEngine();
  // v168.114: index = birth year + TARGET AGE (not hardcoded P3_START) — fully reactive
  var _kpiAge    = (SIM_TARGET_AGE && SIM_TARGET_AGE >= 60) ? SIM_TARGET_AGE : SIM_RETIREMENT_AGE_ROY;
  var _kpiYear   = SIM_BIRTH_YEAR_ROY + _kpiAge;
  var _kpiMonth  = SIM_P3_START.m || 9;
  var _targetIdx = simMonthIdx(_kpiYear, _kpiMonth);
  if (_targetIdx < 0) _targetIdx = 0;
  if (_targetIdx >= _hdrResult.royData.length) _targetIdx = _hdrResult.royData.length - 1;
  var _wealthAtAge = 0;
  if (_targetIdx >= 0 && _hdrResult.royData && _hdrResult.royData.length > 0) {
    // v168.113: הון חזוי = total wealth (liquid + pension + real estate) — matches "הון נוכחי" definition
    _wealthAtAge = (_hdrResult.royData[_targetIdx] || 0);
    if (SIM_VIEW === 'combined') _wealthAtAge += (_hdrResult.yaelData[_targetIdx] || 0);
    if (SIM_VIEW === 'yael')     _wealthAtAge  = (_hdrResult.yaelData[_targetIdx] || 0);
  }
  // v169.11: SHARED WEALTH — Simulator reads from OV_CACHED_WEALTH (same global as Overview).
  // This eliminates the 8.4M vs 26.6M divergence by forcing both tabs to one source of truth.
  // Only for Roy view; Yael/Combined use their own engine data (no OV_CACHED_WEALTH equivalent).
  if (el('sim-hdr-wealth-at-age')) {
    var _ovWealth = (typeof OV_CACHED_WEALTH !== 'undefined' && OV_CACHED_WEALTH !== null
                     && SIM_VIEW !== 'yael' && SIM_VIEW !== 'combined')
      ? OV_CACHED_WEALTH
      : simFmtM(_wealthAtAge);
    el('sim-hdr-wealth-at-age').textContent = _ovWealth;
  }

  // v168.114: subtitle is fully reactive — updates immediately when target age changes
  var _sub = document.getElementById('hdr-subtitle');
  if (_sub) _sub.innerHTML = 'תחזית לגיל <span style="color:#f59e0b;font-weight:800;">' + _kpiAge + '</span>' +
    '<span style="font-size:9px;color:rgba(255,255,255,0.45);font-family:Heebo,sans-serif;font-weight:400;margin-right:6px;"> שנת ' + _kpiYear + '</span>';

  // === v168.97: Pre-calculate all KPI values before rendering ===

  // KPI#2 — הכנסה פנויה בפרישה: slider is the SINGLE source of truth
  // Excel:  SIM_PENSION_MONTHLY = net pension + retirement rental (set by simInit/simRefresh)
  // FFS:    SIM_PENSION_MONTHLY + FFS rental income from profile
  // RULE:   NEVER reconstruct from salary+rent here — always use the slider global
  var _incomeNIS = isExcelLoaded()
    ? SIM_PENSION_MONTHLY
    : (SIM_PENSION_MONTHLY + ffsGetMonthlyRentNetK(new Date().getFullYear()) * 1000);

  // KPI#3 — תזרים נטו: Income Slider − Expense Slider (fully slider-driven, v168.101)
  // Demo:  SIM_PENSION_MONTHLY − SIM_TARGET_EXP (isExcelLoaded()=false in demo → must branch explicitly)
  // Excel: _incomeNIS (SIM_PENSION_MONTHLY) − SIM_TARGET_EXP (from SIM_RETIRE_EXP setting)
  // FFS:   manually entered monthlySavings
  var _currSavingNIS = isDemoMode
    ? (SIM_PENSION_MONTHLY - SIM_TARGET_EXP)   // v168.118: demo direct slider diff (25K-20K=5K)
    : (isExcelLoaded()
        ? (_incomeNIS - SIM_TARGET_EXP)
        : (FFS_PROFILE.monthlySavings || 0));

  // KPI#4 — צבירה חודשית: תזרים נטו + רווח הון חודשי על התיק הקיים
  var _monthlyCapGain    = _invK * 1000 * (SIM_RATE / 100) / 12;
  var _totalMonthlyAccum = _currSavingNIS + _monthlyCapGain;

  // === KPI 2: הכנסה פנויה בפרישה — slider value (net pension + retirement rental) ===
  var _totalAccumEl = el('sim-hdr-total-accum');
  if (_totalAccumEl) {
    if (_showRoy) {
      _totalAccumEl.textContent = simFmtKbare(_incomeNIS / 1000);
      _totalAccumEl.style.color = _incomeNIS > 0 ? '#a78bfa' : '#f87171';
    } else {
      _totalAccumEl.textContent = '—';
      _totalAccumEl.style.color = '';
    }
  }

  // === KPI 3: תזרים נטו — strict inflow − outflow (no interest) ===
  var _accumEl = el('sim-hdr-monthly-accum');
  if (_accumEl) {
    if (_showRoy) {
      _accumEl.textContent = simFmtKbare(_currSavingNIS / 1000);
      _accumEl.style.color = _currSavingNIS >= 0 ? '#fbbf24' : '#f87171';
    } else {
      _accumEl.textContent = '—';
      _accumEl.style.color = '';
    }
  }

  // === KPI 4: צבירה חודשית = תזרים נטו + רווח הון חודשי על התיק הקיים ===
  var _incomeEl = el('sim-hdr-monthly-income');
  if (_incomeEl) {
    if (_showRoy) {
      _incomeEl.textContent = simFmtKbare(_totalMonthlyAccum / 1000);
      _incomeEl.style.color = _totalMonthlyAccum >= 0 ? '#60a5fa' : '#f87171';
    } else {
      _incomeEl.textContent = '—';
      _incomeEl.style.color = '';
    }
  }

  // v168.87/88: source transparency tags — professional pill badge under each header KPI
  var _srcText   = isExcelLoaded() ? 'אקסל' : (_hasAnyData ? 'ידני' : '');
  var _srcColor  = isExcelLoaded() ? '#93c5fd' : '#fde68a';
  var _srcBorder = isExcelLoaded() ? 'rgba(147,197,253,0.35)' : 'rgba(253,224,71,0.35)';
  var _srcBg     = isExcelLoaded() ? 'rgba(37,99,235,0.22)'   : 'rgba(161,98,7,0.22)';
  ['sim-src-tag-wealth','sim-src-tag-income','sim-src-tag-accum','sim-src-tag-total'].forEach(function(id) {
    var t = el(id);
    if (!t) return;
    if (_srcText) {
      t.textContent      = _srcText;
      t.style.display    = 'inline-block';
      t.style.color      = _srcColor;
      t.style.background = _srcBg;
      t.style.border     = '1px solid ' + _srcBorder;
      t.style.borderRadius = '4px';
      t.style.padding    = '1px 4px';
      t.style.fontSize   = '7px';
      t.style.fontWeight = '700';
      t.style.letterSpacing = '0.4px';
      t.style.verticalAlign = 'middle';
      t.style.lineHeight = '1.4';
    } else {
      t.style.display = 'none';
    }
  });
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
  simRenderKPI(); // v103.9-FIXED: update KPI cards (zero out Yael when roy-only)
  simRenderChart(simRunEngine());
}

// v103.12-sim: X-axis display mode toggle
// v103.22: target age input handler
function simSetTargetAge(val) {
  var n = parseInt(val);
  if (isNaN(n) || n < 60 || n > 100) return; // v103.33: min 60 to allow retirement age 67
  SIM_TARGET_AGE = n;
  var inp = document.getElementById('sim-target-age-input');
  if (inp && parseInt(inp.value) !== n) inp.value = n;
  simRenderKPI();
  // v104.1: sync overview header KPI label if rendered
  if (typeof ovRenderKPIs === 'function') ovRenderKPIs();
}

// v103.31: Y-axis scale selector handler
function simSetYScale(v) {
  SIM_Y_SCALE = parseInt(v) || 60000;
  var sel = document.getElementById('sim-yscale-select');
  if (sel && parseInt(sel.value) !== SIM_Y_SCALE) sel.value = SIM_Y_SCALE;
  simRenderChart(simRunEngine());
}

function simSetXAxisMode(mode) {
  SIM_XAXIS_MODE = mode;
  ['year', 'age', 'both'].forEach(function(m) {
    var btn = document.getElementById('sim-xaxis-' + m);
    if (!btn) return;
    var active = (m === mode);
    btn.style.background    = active ? '#3b82f6' : 'rgba(0,0,0,0.05)';
    btn.style.borderColor   = active ? '#3b82f6' : 'rgba(0,0,0,0.18)';
    btn.style.color         = active ? 'white'   : '#374151';
  });
  simRenderChart(simRunEngine());
}

function simSetViewMode(mode) {
  SIM_VIEW_REAL = (mode === 'real');
  var nomBtn = document.getElementById('sim-viewmode-nominal');
  var realBtn = document.getElementById('sim-viewmode-real');
  if (nomBtn) {
    nomBtn.className = 'sim-viewmode-btn' + (mode === 'nominal' ? ' sim-viewmode-nominal-active' : '');
  }
  if (realBtn) {
    realBtn.className = 'sim-viewmode-btn' + (mode === 'real' ? ' sim-viewmode-real-active' : '');
  }
  simRenderChart(simRunEngine());
}

function simSetRate(r) {
  SIM_RATE = parseFloat(r);
  var sl  = document.getElementById('sim-rate-slider');
  var num = document.getElementById('sim-rate-num');
  if (sl  && parseFloat(sl.value)  !== SIM_RATE) sl.value  = SIM_RATE;
  if (num && parseFloat(num.value) !== SIM_RATE) num.value = SIM_RATE;
  simRenderKPI(); // v103.31: צבירה כוללת uses SIM_RATE
  simRenderChart(simRunEngine());
}

// v103.10: Phase boundary sliders — user can adjust when each phase starts
function simSetP2Year(y) {
  var yr = parseInt(y);
  if (isNaN(yr)) return;
  SIM_P2_START.y = Math.max(SIM_P1_START.y, Math.min(yr, SIM_P3_START.y - 1));
  var sl = document.getElementById('sim-p2-slider');
  var inp = document.getElementById('sim-p2-year-input');
  if (sl) sl.value = SIM_P2_START.y;
  if (inp) inp.value = SIM_P2_START.y;
  var lbl = document.getElementById('sim-p2-label');
  if (lbl) lbl.textContent = SIM_P2_START.y;
  simRenderChart(simRunEngine());
}
function simSetP3Year(y) {
  var yr = parseInt(y);
  if (isNaN(yr)) return;
  SIM_P3_START.y = Math.max(SIM_P2_START.y + 1, Math.min(yr, SIM_END.y - 1));
  var sl = document.getElementById('sim-p3-slider');
  var inp = document.getElementById('sim-p3-year-input');
  if (sl) sl.value = SIM_P3_START.y;
  if (inp) inp.value = SIM_P3_START.y;
  var lbl = document.getElementById('sim-p3-label');
  if (lbl) lbl.textContent = SIM_P3_START.y;
  simRenderChart(simRunEngine());
}

function simSetExpense(e) {
  SIM_TARGET_EXP = parseFloat(e);
  var sl  = document.getElementById('sim-exp-slider');
  var num = document.getElementById('sim-exp-num');
  if (sl  && parseFloat(sl.value)  !== SIM_TARGET_EXP) sl.value  = SIM_TARGET_EXP;
  if (num && parseFloat(num.value) !== SIM_TARGET_EXP) num.value = SIM_TARGET_EXP;
  simRenderKPI(); // v103.31: תזרים נטו + צבירה כוללת use SIM_TARGET_EXP
  simRenderChart(simRunEngine());
}

function simSetInstructor(s) {
  SIM_INSTRUCTOR_SAL = parseFloat(s);
  var sl  = document.getElementById('sim-instr-slider');
  var num = document.getElementById('sim-instr-num');
  if (sl  && parseFloat(sl.value)  !== SIM_INSTRUCTOR_SAL) sl.value  = SIM_INSTRUCTOR_SAL;
  if (num && parseFloat(num.value) !== SIM_INSTRUCTOR_SAL) num.value = SIM_INSTRUCTOR_SAL;
  simRenderChart(simRunEngine());
}

// v103.26: new state setters
function simSetPensionMonthly(v) {
  SIM_PENSION_MONTHLY = parseFloat(v) || 0;
  var sl  = document.getElementById('sim-pension-monthly-slider');
  var num = document.getElementById('sim-pension-monthly-num');
  if (sl  && parseFloat(sl.value)  !== SIM_PENSION_MONTHLY) sl.value  = SIM_PENSION_MONTHLY;
  if (num && parseFloat(num.value) !== SIM_PENSION_MONTHLY) num.value = SIM_PENSION_MONTHLY;
  // v103.31: update KPI cards first (הכנסה פנויה + תזרים נטו), then re-run chart
  simRenderKPI();
  simRenderChart(simRunEngine());
}
function simSetInflation(v) {
  SIM_INFLATION = parseFloat(v) || 0;
  var sl  = document.getElementById('sim-inflation-slider');
  var num = document.getElementById('sim-inflation-num');
  if (sl  && parseFloat(sl.value)  !== SIM_INFLATION) sl.value  = SIM_INFLATION;
  if (num && parseFloat(num.value) !== SIM_INFLATION) num.value = SIM_INFLATION;
  simRenderChart(simRunEngine());
}

// v103.2: Show/hide simulator content based on data availability
function simCheckEmpty() {
  // v168.76: FFS profile data (investments/pension/realEstate) counts as valid data source
  var ffsHasAssets = (FFS_PROFILE.investments.length > 0 || FFS_PROFILE.pension.length > 0 ||
                      FFS_PROFILE.realEstate.length > 0 || FFS_PROFILE.monthlySavings > 0);
  var hasData = (simGetRoyCapital() > 0 || simGetYaelCapital() > 0 ||
                 simGetRoyPensionAccum() > 0 || (CF_DATA && CF_DATA.length > 0) || ffsHasAssets);
  var kpiRow      = document.getElementById('sim-kpi-row');
  var kpiInfoGrd  = document.getElementById('sim-kpi-info-grid');
  var kpiLbl      = document.getElementById('sim-kpi-section-label');
  // v103.17-fix: use closest() to target the outer .sim-chart-section (not just inner relative div)
  var _cw = document.getElementById('sim-chart-wrap');
  var chartSec = _cw ? (_cw.closest ? _cw.closest('.sim-chart-section') : _cw.parentElement.parentElement) : null;
  var phaseSl     = document.getElementById('sim-phase-sliders'); // v103.10: phase boundary sliders
  var emptyMsg    = document.getElementById('sim-empty-msg');
  var ctrlRow     = document.querySelector('.sim-controls-row');
  var timelineSec = document.getElementById('sim-timeline-section'); // v103.36

  if (hasData) {
    // v168.85: data present — show everything, hide empty message
    if (ctrlRow)     ctrlRow.style.display     = '';
    if (phaseSl)     phaseSl.style.display     = 'flex';
    if (chartSec)    chartSec.style.display    = '';
    if (timelineSec) timelineSec.style.display = '';
    if (kpiRow)      kpiRow.style.display      = 'flex';
    if (kpiInfoGrd)  kpiInfoGrd.style.display  = 'grid';
    if (kpiLbl)      kpiLbl.style.display      = 'block';
    if (emptyMsg)    emptyMsg.style.display    = 'none';
  } else {
    // v168.85: Guest/Incognito — hide chart and all controls, show only empty message
    if (ctrlRow)     ctrlRow.style.display     = 'none';
    if (phaseSl)     phaseSl.style.display     = 'none';
    if (chartSec)    chartSec.style.display    = 'none';
    if (timelineSec) timelineSec.style.display = 'none';
    if (kpiRow)      kpiRow.style.display      = 'none';
    if (kpiInfoGrd)  kpiInfoGrd.style.display  = 'none';
    if (kpiLbl)      kpiLbl.style.display      = 'none';
    if (emptyMsg)    emptyMsg.style.display    = 'flex';
  }
  return hasData;
}

// ── Init ──────────────────────────────────────
function simInit() {
  // v102.5: Stateless — pension data already in PENSION_ASSETS/PENSION_EVENTS if Excel was uploaded

  // v168.96: HARD RESET — zero all calculation memory before any data load (salary/rental/pension/expenses)
  resetCalculationMemory();

  // v168.76 FIX: load FFS profile BEFORE simCheckEmpty so FFS capital is counted
  ffsLoadProfile();
  // v168.87: auto-detect Excel on init — set activeDataSource BEFORE ffsSyncSliders so guard works
  if (_hasRawExcelData()) {
    activeDataSource = 'EXCEL';
    // v168.89: firewall — zero FFS calculation arrays so no FFS data leaks into Excel session
    ffsClearMemory();
    // v168.92: use NET pension; v168.93: add rental income from Excel real estate assets
    var _initPnsNIS  = (typeof pnsNetMonthlyNoHarel !== 'undefined' && pnsNetMonthlyNoHarel > 0)
      ? pnsNetMonthlyNoHarel : simGetRoyPension();
    var _initRentNIS = simGetRoyRentalIncome(); // v168.93: X+Y = pension + rental
    var _initFixed   = _initPnsNIS + _initRentNIS;
    if (_initFixed > 0) {
      SIM_PENSION_MONTHLY = _initFixed;
      var _ipSl = document.getElementById('sim-pension-monthly-slider');
      var _ipNm = document.getElementById('sim-pension-monthly-num');
      if (_ipSl) _ipSl.value = SIM_PENSION_MONTHLY;
      if (_ipNm) _ipNm.value = SIM_PENSION_MONTHLY;
    }
  }
  // v168.79: apply FFS slider values to globals immediately (before CF data can overwrite)
  // (guarded by isExcelLoaded() — skipped entirely when Excel is the active source)
  ffsSyncSliders();
  // v168.80: always call simCheckEmpty for UI visibility — no early return (always render)
  simCheckEmpty();

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
  // v168.101: expense slider always driven by SIM_RETIRE_EXP (settings), not CF_DATA
  // FFS exception: use FFS retirementExpense only in manual mode (no Excel)
  var _ffsExp    = FFS_PROFILE.retirementExpense || 0;
  SIM_TARGET_EXP = (_ffsExp > 0 && !isExcelLoaded()) ? _ffsExp
    : (SIM_RETIRE_EXP > 0 ? SIM_RETIRE_EXP : (SIM_TARGET_EXP > 0 ? SIM_TARGET_EXP : 29000));
  var expSlider = document.getElementById('sim-exp-slider');
  if (expSlider) expSlider.value = SIM_TARGET_EXP;
  var expValEl = document.getElementById('sim-exp-val');
  if (expValEl) expValEl.textContent = simFmtNIS(SIM_TARGET_EXP);
  // v168.78: FFS profile overrides CF-data defaults on load (anti-ghosting)
  ffsSyncSliders();
  // v158.0: restore user-added events from localStorage before rendering
  _simRestoreUserEvents();

  // v156.0: sync saved settings → sliders before first render (silent: skip re-render, simInit renders below)
  if (typeof syncSettingsToSliders === 'function') {
    var _si = simInited; simInited = false; syncSettingsToSliders(); simInited = _si;
  }

  // v137.0: apply saved default zoom before rendering so chart + timeline use correct range
  if (SIM_DEFAULT_ZOOM && SIM_DEFAULT_ZOOM !== SIM_ZOOM) SIM_ZOOM = SIM_DEFAULT_ZOOM;
  simRenderKPI();
  simRenderEvents();
  simRenderTimeline(); // v103.36: events timeline below chart
  simRenderChart(simRunEngine());
  // v137.0: update zoom button active state to reflect the applied default
  ['full','retirement','decade'].forEach(function(m) {
    var _zBtn = document.getElementById('sim-zoom-' + m);
    if (!_zBtn) return;
    _zBtn.style.background = (m === SIM_ZOOM) ? '#3b82f6' : 'rgba(0,0,0,0.05)';
    _zBtn.style.color      = (m === SIM_ZOOM) ? 'white'   : '#374151';
  });
  pnsRetirementYieldChange(SIM_PENSION_RATE || pnsRetirementYield); // v168.83: init from settings
  simUpdateNameLabel(); // v168.73: sync header label with active data source
  // v168.115: demo mode — force Dan-specific slider values AFTER all sync (overrides Roy defaults)
  if (typeof isDemoMode !== 'undefined' && isDemoMode && typeof _demoForceDanSliders === 'function') {
    _demoForceDanSliders();
  }
}

// v102.5: Re-read live data after Excel upload and re-render simulator
// v168.86: unified full re-render — called after any data source change (Excel upload or FFS save)
function simFullRefresh() {
  if (!simInited) return;
  // v168.104: restore expense slider from settings if zeroed by profile switch
  if (isExcelLoaded()) {
    if (SIM_TARGET_EXP === 0 && SIM_RETIRE_EXP > 0) {
      SIM_TARGET_EXP = SIM_RETIRE_EXP;
      var _fesl = document.getElementById('sim-exp-slider');
      var _fesn = document.getElementById('sim-exp-num');
      var _fesv = document.getElementById('sim-exp-val');
      if (_fesl) _fesl.value = SIM_TARGET_EXP;
      if (_fesn) _fesn.value = SIM_TARGET_EXP;
      if (_fesv) _fesv.textContent = simFmtNIS(SIM_TARGET_EXP);
    }
    var _fSal = simGetCurrentSalary();
    if (_fSal > 0 && SIM_CURRENT_SALARY !== _fSal) SIM_CURRENT_SALARY = _fSal;
  }
  simCheckEmpty();
  simRenderKPI();
  simRenderChart(simRunEngine());
  simUpdateNameLabel();
  if (overviewInited && typeof ovRenderSimMini === 'function') ovRenderSimMini();
}

// v168.86: toggle between EXCEL and MANUAL data sources
function ffsToggleDataSource() {
  resetCalculationMemory(); // v168.96: deep wipe on every profile switch (Roy↔FFS↔Demo)
  if (activeDataSource === 'EXCEL') {
    activeDataSource = 'MANUAL';
    // v168.103: clear Roy's birth dates — guest user has no pre-set dates
    SIM_USER1_BIRTH    = FFS_PROFILE.birthDate || '';
    SIM_USER2_BIRTH    = '';
    SIM_BIRTH_YEAR_ROY  = SIM_USER1_BIRTH ? parseInt(SIM_USER1_BIRTH.split('-')[0], 10) || (new Date().getFullYear() - 40) : (new Date().getFullYear() - 40);
    SIM_BIRTH_YEAR_YAEL = new Date().getFullYear() - 40;
    userCurrentAge      = SIM_START_YEAR - SIM_BIRTH_YEAR_ROY;
    syncBirthYearsFromSettings();
    // Clear birth date fields in Settings DOM
    ['stg-user1-birth','stg-user2-birth'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value = (id==='stg-user1-birth' ? SIM_USER1_BIRTH : ''); });
    // v168.89: restore FFS data from localStorage (was cleared by ffsClearMemory on Excel load)
    ffsLoadProfile();
    // v168.91: if no FFS profile name, show guest immediately — no stale Excel name
    if (!FFS_PROFILE.name) SIM_USER1_NAME = '';
    ffsSyncSliders();
  } else {
    if (_hasRawExcelData()) {
      activeDataSource = 'EXCEL';
      ffsClearMemory(); // v168.89: zero FFS data when switching back to Excel
    }
  }
  ffsRenderAll();   // re-render drawer UI to reflect new state
  simFullRefresh(); // re-render chart + KPIs with new data source
}

// v168.88: clear all FFS profile fields — "start fresh" for manual mode without page reload
function ffsStartFreshProfile() {
  FFS_PROFILE.name                = '';
  FFS_PROFILE.birthDate           = '';
  FFS_PROFILE.retirementAge       = 67;
  FFS_PROFILE.lifeExpectancy      = 84;
  FFS_PROFILE.monthlySavings      = 0;
  FFS_PROFILE.savingsGrowth       = 0;
  FFS_PROFILE.retirementExpense   = 0;
  FFS_PROFILE.retirementIncome    = 0;
  FFS_PROFILE.bridgeAge           = '';
  FFS_PROFILE.bridgeCashflow      = 0;
  FFS_PROFILE.bridgePensionContrib = false;
  FFS_PROFILE.investments         = [];
  FFS_PROFILE.pension             = [];
  FFS_PROFILE.realEstate          = [];
  FFS_PROFILE.incomePhases        = []; // v170.2
  FFS_PROFILE.ffsEvents           = []; // v170.4
  try { localStorage.removeItem(ffsGetActiveKey()); } catch(e) {} // v169.1: scoped by mode
  // Reset name label to guest + zero ghost sliders
  SIM_USER1_NAME = '';
  resetAllInputs();
  ffsRenderAll();
  simFullRefresh();
}

function simRefresh() {
  if (!simInited) return;
  // v103.2: if first upload — show content and run full init instead
  var hadData = simCheckEmpty();
  if (!hadData) { simInit(); return; }
  var _sal = simGetCurrentSalary();
  if (_sal > 0) SIM_CURRENT_SALARY = _sal;
  // v168.104: restore expense slider from settings if zeroed out (reset after profile switch)
  if (SIM_TARGET_EXP === 0 && SIM_RETIRE_EXP > 0) {
    SIM_TARGET_EXP = SIM_RETIRE_EXP;
    var _resl = document.getElementById('sim-exp-slider');
    var _resn = document.getElementById('sim-exp-num');
    var _resv = document.getElementById('sim-exp-val');
    if (_resl) _resl.value = SIM_TARGET_EXP;
    if (_resn) _resn.value = SIM_TARGET_EXP;
    if (_resv) _resv.textContent = simFmtNIS(SIM_TARGET_EXP);
  }
  // v168.86: Excel upload → auto-switch to EXCEL data source, reset name if FFS was active
  var _hasExcelNow = (CF_DATA && CF_DATA.length > 0) || (PENSION_ASSETS && PENSION_ASSETS.length > 0);
  if (_hasExcelNow) {
    activeDataSource = 'EXCEL';
    if (FFS_PROFILE.name && SIM_USER1_NAME === FFS_PROFILE.name) SIM_USER1_NAME = 'רועי';
    // v168.89: FIREWALL — zero FFS calculation arrays from session memory (localStorage preserved)
    ffsClearMemory();
    // v168.101: expense slider driven by settings — no CF_DATA override on Excel load
    var _cfSalNow = simGetCurrentSalary();
    if (_cfSalNow > 0) SIM_CURRENT_SALARY = _cfSalNow;
    // v168.92: NET pension; v168.93: X+Y — pension net + rental income from Excel assets
    var _rfPnsNIS  = (typeof pnsNetMonthlyNoHarel !== 'undefined' && pnsNetMonthlyNoHarel > 0)
      ? pnsNetMonthlyNoHarel : simGetRoyPension();
    var _rfRentNIS = simGetRoyRentalIncome(); // v168.93: add rental
    var _rfFixed   = _rfPnsNIS + _rfRentNIS;
    if (_rfFixed > 0) {
      SIM_PENSION_MONTHLY = _rfFixed;
      var _rfPSl = document.getElementById('sim-pension-monthly-slider');
      var _rfPNm = document.getElementById('sim-pension-monthly-num');
      if (_rfPSl) _rfPSl.value = SIM_PENSION_MONTHLY;
      if (_rfPNm) _rfPNm.value = SIM_PENSION_MONTHLY;
    }
    // Drawer must immediately reflect Roy/Excel profile
    if (typeof ffsRenderAll === 'function') ffsRenderAll();
  }
  simRenderKPI();
  simRenderChart(simRunEngine());
  simUpdateNameLabel(); // v168.73: refresh header label after Excel/Demo data load
}

// =========================================
// OVERVIEW TAB — v104.0
// =========================================

var overviewInited  = false;
var ovCFChart       = null;
var ovInvChart      = null;
var ovSimMiniChart  = null;
var ovCFMode        = 'monthly';   // 'monthly' | 'ytd'
var OV_CACHED_WEALTH = null;       // persists הון חזוי across tab switches
var ovPnsShowHarel  = false;       // false = ללא הראל (default), true = עם הראל
var ovPnsDisplayNet = 0;           // cached displayNet from ovRenderPensionCards — used for header sync

function overviewRender() {
  ovRenderKPIs();
  ovRenderCashflowChart();
  ovRenderInvestChart();
  ovRenderPensionCards();
  ovRenderSimMini();
}

// ── Dependency Gate: all 3 data sources must be loaded ───
function ovAllDataReady() {
  var hasCF   = CF_DATA && CF_DATA.length > 0;
  // v168.12: ALL_TOTALS is initialized as 15 zeros — require at least one non-zero value for real data
  var hasInv  = ALL_TOTALS && ALL_TOTALS.some(function(v) { return v > 0; });
  var hasPns  = (typeof PENSION_ASSETS !== 'undefined') && PENSION_ASSETS && PENSION_ASSETS.length > 0;
  return hasCF && hasInv && hasPns;
}

// ── KPI Header (v104.1: KPIs moved to dark header bar) ───
function ovRenderKPIs() {
  function el(id) { return document.getElementById(id); }

  // 1. Last month net profit (delta = total NIS profit incl. USD)
  var lastIdx = (typeof cfGetLastRealMonth === 'function') ? cfGetLastRealMonth() : CF_DATA.length - 1;
  var lastRow = CF_DATA[lastIdx] && CF_DATA[lastIdx].rows;
  var netProfit = 0;
  if (lastRow) {
    if (lastRow.delta && lastRow.delta.val != null && !isNaN(lastRow.delta.val)) {
      netProfit = lastRow.delta.val;
    } else {
      var _inc = (typeof cfCalcIncome === 'function') ? cfCalcIncome(lastRow) : ((lastRow.salary ? (lastRow.salary.val || 0) : 0) + (lastRow.rent_income ? (lastRow.rent_income.val || 0) : 0));
      var _exp = lastRow.total_exp ? (lastRow.total_exp.val || 0) : ((lastRow.visa ? (lastRow.visa.val || 0) : 0) + (lastRow.cash_exp ? (lastRow.cash_exp.val || 0) : 0));
      netProfit = _inc - _exp;
    }
  }
  var profitEl = el('ov-hdr-profit');
  if (profitEl) {
    profitEl.textContent = netProfit !== 0 ? Math.round(netProfit).toLocaleString('he-IL') : '—';
    profitEl.style.color = netProfit >= 0 ? '#4ade80' : '#f87171';
  }

  // 2. Total active investments (M)
  var invTotal = (ALL_TOTALS && ALL_TOTALS.length > 0) ? ALL_TOTALS[ALL_TOTALS.length - 1] : 0;
  var invEl = el('ov-hdr-invest');
  if (invEl) invEl.textContent = invTotal > 0 ? (invTotal / 1000).toFixed(2) : '—';

  // 3. Pension net income — value only; label is set exclusively by ovTogglePnsHarel (v105.3)
  var pVal = (ovPnsDisplayNet > 0) ? ovPnsDisplayNet
           : ((typeof pnsNetMonthly !== 'undefined') ? (pnsNetMonthly || 0) : 0);
  var pensionEl = el('ov-hdr-pension');
  if (pensionEl) pensionEl.textContent = pVal > 0 ? Math.round(pVal).toLocaleString('he-IL') : '—';

  // 4. Estimated total wealth — dynamic label based on SIM_TARGET_AGE
  //    v104.3: Only compute if all data sources are loaded (dependency gate)
  //    v169.3: SIMULATOR mode uses FFS capital gate instead of Excel data gate
  var targetAge = (typeof SIM_TARGET_AGE !== 'undefined') ? SIM_TARGET_AGE : 67;
  var wealthLbl = el('ov-hdr-wealth-label');
  var wealthEl  = el('ov-hdr-wealth');
  if (wealthLbl) wealthLbl.textContent = 'הון חזוי לגיל ' + targetAge;
  if (wealthEl) {
    wealthEl.style.color = '#fbbf24';

    // v169.3: SIMULATOR mode — use FFS profile data, not Excel
    var _isSimMode = (typeof APP_MODE !== 'undefined' && APP_MODE === 'SIMULATOR');
    var _simDataReady = _isSimMode && simInited && (typeof simRunEngine === 'function') &&
      ((typeof ffsGetLiquidCapital === 'function' && ffsGetLiquidCapital() > 0) ||
       (typeof ffsGetPensionAccumK === 'function' && ffsGetPensionAccumK() > 0) ||
       (typeof ffsGetRealEstateK   === 'function' && ffsGetRealEstateK()   > 0));

    var _dataReady = _simDataReady || ovAllDataReady();

    if (!_dataReady) {
      wealthEl.textContent = (OV_CACHED_WEALTH !== null) ? OV_CACHED_WEALTH : '—';
    } else {
      var hasSimCap = _simDataReady || ((typeof simGetRoyCapital === 'function') && simGetRoyCapital() > 0);
      if (hasSimCap && typeof simRunEngine === 'function') {
        // v169.9: Simulator Sync — resetCalculationMemory() zeros SIM_TARGET_EXP; sync to SIM_RETIRE_EXP
        // before engine run so overview and simulator tab produce identical wealth projections
        if (SIM_TARGET_EXP === 0 && typeof SIM_RETIRE_EXP !== 'undefined' && SIM_RETIRE_EXP > 0) {
          SIM_TARGET_EXP = SIM_RETIRE_EXP;
        }
        // v168.114: use cached engine result when available — avoids duplicate run when target age changes
        var _hadCachedResult = !!(typeof SIM_LAST_RESULT !== 'undefined' && SIM_LAST_RESULT && SIM_LAST_RESULT.royData && SIM_LAST_RESULT.royData.length > 0);
        var _res = _hadCachedResult ? SIM_LAST_RESULT : simRunEngine();
        // v169.10: cache fresh result so Simulator tab (simRenderKPI) reads SAME data — prevents 26.6M vs 8.4M divergence
        if (!_hadCachedResult && _res && _res.royData && typeof SIM_LAST_RESULT !== 'undefined') {
          SIM_LAST_RESULT = _res;
        }
        var _yr  = (typeof SIM_BIRTH_YEAR_ROY !== 'undefined') ? SIM_BIRTH_YEAR_ROY + targetAge : 2029;
        var _retireM = (typeof SIM_P3_START !== 'undefined') ? (SIM_P3_START.m || 9) : 9;
        var _idx = (typeof simMonthIdx === 'function') ? simMonthIdx(_yr, _retireM) : (_yr - 2026);
        if (_idx < 0) _idx = 0;
        // v168.113: total wealth (liquid + pension + real estate) — aligns with "הון נוכחי" card
        var _w = (_idx >= 0 && _res.royData && _idx < _res.royData.length) ? _res.royData[_idx] : 0;
        if (_w > 0) {
          OV_CACHED_WEALTH = (_w / 1000).toFixed(1);
          wealthEl.textContent = OV_CACHED_WEALTH;
        } else if (OV_CACHED_WEALTH !== null) {
          wealthEl.textContent = OV_CACHED_WEALTH;
        } else {
          wealthEl.textContent = '—';
        }
      } else if (OV_CACHED_WEALTH !== null) {
        wealthEl.textContent = OV_CACHED_WEALTH;
      } else {
        wealthEl.textContent = '—';
      }
    }
  }
}

// ── CF Mode Toggle ────────────────────────
function ovSetCFMode(mode) {
  ovCFMode = mode;
  var btnM = document.getElementById('ov-cf-btn-monthly');
  var btnY = document.getElementById('ov-cf-btn-ytd');
  if (btnM) { btnM.style.background = mode === 'monthly' ? '#1e3a8a' : 'transparent'; btnM.style.color = mode === 'monthly' ? '#fff' : '#6b7280'; }
  if (btnY) { btnY.style.background = mode === 'ytd'     ? '#1e3a8a' : 'transparent'; btnY.style.color = mode === 'ytd'     ? '#fff' : '#6b7280'; }
  ovRenderCashflowChart();
}

// ── Cashflow Chart — Income vs Expenses (v104.4) ─────────────
function ovRenderCashflowChart() {
  var canvas  = document.getElementById('ov-cf-chart');
  var emptyEl = document.getElementById('ov-cf-empty');
  if (!canvas) return;
  if (!CF_DATA || CF_DATA.length === 0) {
    if (ovCFChart) { ovCFChart.destroy(); ovCFChart = null; }
    canvas.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  canvas.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  // Sync toggle button styles on render
  var btnM = document.getElementById('ov-cf-btn-monthly');
  var btnY = document.getElementById('ov-cf-btn-ytd');
  if (btnM) { btnM.style.background = ovCFMode === 'monthly' ? '#1e3a8a' : 'transparent'; btnM.style.color = ovCFMode === 'monthly' ? '#fff' : '#6b7280'; }
  if (btnY) { btnY.style.background = ovCFMode === 'ytd'     ? '#1e3a8a' : 'transparent'; btnY.style.color = ovCFMode === 'ytd'     ? '#fff' : '#6b7280'; }

  var curYear = new Date().getFullYear();
  var curMonth = new Date().getMonth() + 1; // 1-based
  var yearData = CF_DATA.filter(function(m) { return m.year === curYear; });
  if (yearData.length === 0) yearData = CF_DATA.slice(-6);

  var months = [], incomes = [], expenses = [], ytdByMonth = [];
  var ytdNet = 0;
  var currentMonthIdx = -1; // index of the current month bar

  yearData.forEach(function(m, i) {
    var r   = m.rows || {};
    var inc = cfCalcIncome(r);
    // v104.4: use total_exp when available to capture all special/other expenses
    var exp = (r.total_exp && r.total_exp.val > 0) ? r.total_exp.val : cfCalcExp(r);
    ytdNet += (inc - exp);
    months.push((m.label || '').split(' ')[0]);
    incomes.push(Math.round(inc));
    expenses.push(Math.round(exp));
    ytdByMonth.push(Math.round(ytdNet));
    if (m.month === curMonth) currentMonthIdx = i;
  });

  // Current month vertical marker plugin
  var currentMonthPlugin = {
    id: 'ovCurMonthLine',
    afterDraw: function(chart) {
      if (currentMonthIdx < 0) return;
      var xScale = chart.scales.x;
      var yScale = chart.scales.y;
      if (!xScale || !yScale) return;
      // Position the line in the GAP between current and next bar
      var _xCur  = xScale.getPixelForValue(currentMonthIdx);
      var _xNext = (currentMonthIdx + 1 < months.length)
        ? xScale.getPixelForValue(currentMonthIdx + 1)
        : _xCur;
      var x = (_xCur + _xNext) / 2;
      var ctx2 = chart.ctx;
      ctx2.save();
      ctx2.setLineDash([5, 5]);
      ctx2.strokeStyle = 'rgba(150,150,150,0.8)';
      ctx2.lineWidth = 1.5;
      ctx2.beginPath();
      ctx2.moveTo(x, yScale.top);
      ctx2.lineTo(x, yScale.bottom);
      ctx2.stroke();
      ctx2.setLineDash([]);
      ctx2.restore();
    }
  };

  if (ovCFChart) { ovCFChart.destroy(); ovCFChart = null; }
  canvas.height = 185;

  if (ovCFMode === 'ytd') {
    // EXACT clone of main CF tab YTD bar chart (green=positive, red=negative)
    var safeYtd  = ytdByMonth.map(function(v) { return v || 0; });
    var ytdMin   = Math.min.apply(null, safeYtd);
    var ytdMax   = Math.max.apply(null, safeYtd);
    var ytdPad   = (ytdMax - ytdMin) * 0.12 || 50;
    ovCFChart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'מצטבר',
          data: safeYtd,
          backgroundColor: safeYtd.map(function(v) { return v >= 0 ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)'; }),
          borderRadius: 3,
          maxBarThickness: 34
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        layout: { padding: { top: 8 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true, textDirection: 'rtl',
            callbacks: {
              title: function(items) { return items[0].label || ''; },
              label: function(c) {
                return 'מצטבר: ' + Math.round(c.raw).toLocaleString('he-IL') + ' ₪';
              }
            }
          }
        },
        scales: {
          x: { offset: true, grid: { display: false }, ticks: { font: { size: 9, family: 'Heebo,sans-serif' }, color: '#9ca3af' } },
          y: {
            min: ytdMin - ytdPad,
            max: ytdMax + ytdPad,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { size: 10, family: 'Heebo,sans-serif' }, color: '#9ca3af', maxTicksLimit: 5, callback: function(v) { return v.toLocaleString(); } }
          }
        }
      },
      plugins: [currentMonthPlugin]
    });
  } else {
    // Monthly bar chart
    ovCFChart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'הכנסות', data: incomes,  backgroundColor: 'rgba(74,222,128,0.78)', borderRadius: 4, borderSkipped: false },
          { label: 'הוצאות', data: expenses, backgroundColor: 'rgba(248,113,113,0.78)', borderRadius: 4, borderSkipped: false }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { font: { size: 9, family: 'Heebo' }, color: '#6b7280', boxWidth: 10, padding: 6 } },
          tooltip: {
            rtl: true,
            callbacks: {
              title: function(items) { return items[0].label || ''; },
              label: function(c) {
                var val = Math.abs(c.raw);
                var lbl = c.dataset.label === 'הוצאות' ? 'הוצאות: ' : 'הכנסות: ';
                return ' ' + lbl + val.toLocaleString('he-IL') + ' ₪';
              },
              afterBody: function(items) {
                var idx = items[0].dataIndex;
                var net = ytdByMonth[idx] || 0;
                return ['נטו מצטבר YTD: ' + net.toLocaleString('he-IL') + ' ₪'];
              }
            }
          }
        },
        scales: {
          x: { ticks: { font: { size: 10, family: 'Heebo' }, color: '#6b7280' }, grid: { display: false } },
          y: {
            ticks: { font: { size: 10, family: 'Heebo' }, color: '#6b7280', callback: function(v) { return Math.round(v); } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      },
      plugins: [currentMonthPlugin]
    });
  }
}

// ── Investment Line Chart ─────────────────
function ovRenderInvestChart() {
  var canvas  = document.getElementById('ov-inv-chart');
  var emptyEl = document.getElementById('ov-inv-empty');
  if (!canvas) return;
  // v168.12: ALL_TOTALS starts as 15 zeros on fresh load — treat as empty unless any value > 0
  var _hasInvData = ALL_TOTALS && ALL_TOTALS.some(function(v) { return v > 0; });
  if (!_hasInvData) {
    if (ovInvChart) { ovInvChart.destroy(); ovInvChart = null; }
    canvas.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  canvas.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';
  var labels = LABELS.slice(-13);
  var data   = ALL_TOTALS.slice(-13);
  if (ovInvChart) { ovInvChart.destroy(); ovInvChart = null; }
  canvas.height = 185;
  var ctx = canvas.getContext('2d');
  var grad = ctx.createLinearGradient(0, 0, 0, 185);
  grad.addColorStop(0, 'rgba(59,130,246,0.3)');
  grad.addColorStop(1, 'rgba(59,130,246,0.02)');
  ovInvChart = new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: [{ data: data, borderColor: '#3b82f6', backgroundColor: grad, fill: true, tension: 0.4, borderWidth: 2, pointRadius: 3, pointHoverRadius: 6, pointBackgroundColor: '#3b82f6' }] },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          callbacks: { label: function(c) { var v = c.raw || 0; return ' ' + (v >= 1000 ? (v/1000).toFixed(2)+'M' : Math.round(v).toLocaleString('he-IL')) + ' ₪'; } }
        }
      },
      scales: {
        x: { ticks: { font: { size: 10, family: 'Heebo' }, color: '#6b7280' }, grid: { display: false } },
        y: { ticks: { font: { size: 10, family: 'Heebo' }, color: '#6b7280', callback: function(v) { return v >= 1000 ? (v/1000).toFixed(1)+'M' : Math.round(v); } }, grid: { color: 'rgba(0,0,0,0.05)' } }
      }
    }
  });
}

// ── Pension Micro-Cards ───────────────────
function ovSetPnsHarel(val) {
  ovPnsShowHarel = val;
  // v134.0: update button active/inactive CSS immediately — even before data is loaded
  var _bMinus = document.getElementById('ov-harel-btn-minus');
  var _bPlus  = document.getElementById('ov-harel-btn-plus');
  if (_bMinus) {
    _bMinus.style.background    = !val ? '#1e3a8a' : 'transparent';
    _bMinus.style.color         = !val ? '#fff'    : '#6b7280';
  }
  if (_bPlus) {
    _bPlus.style.background     = val  ? '#1e3a8a' : 'transparent';
    _bPlus.style.color          = val  ? '#fff'    : '#6b7280';
  }
  ovRenderPensionCards();  // updates card + sets ovPnsDisplayNet
  // update header label text
  var _lbl = document.getElementById('ov-hdr-pension-label');
  if (_lbl) _lbl.textContent = ovPnsShowHarel ? 'קצבה נטו (עם הראל)' : 'קצבה נטו (ללא הראל)';
  ovRenderKPIs();          // syncs global header pension value
}

function ovTogglePnsHarel() {
  ovSetPnsHarel(!ovPnsShowHarel);
}

function ovRenderPensionCards() {
  var el = document.getElementById('ov-pension-content');
  if (!el) return;
  var hasData = (typeof PENSION_ASSETS !== 'undefined') && PENSION_ASSETS && PENSION_ASSETS.length > 0;
  if (!hasData) {
    el.innerHTML = '<div style="color:#475569;font-size:12px;padding:12px 0;">יש להעלות את קבצי הנתונים</div>';
    return;
  }
  // Base: Roy's active assets only
  var baseAssets = PENSION_ASSETS.filter(function(a) {
    return !a.isPendingReview && (!a.owner || a.owner === 'רועי');
  });
  var activeWithout = baseAssets.filter(function(a){ return !a.provider || a.provider.indexOf('הראל') < 0; });

  var totalAccum   = baseAssets.reduce(function(s,a){ return s+(a.accumulation||0); }, 0);
  var grossWith    = baseAssets.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
  var grossWithout = activeWithout.reduce(function(s,a){ return s+(a.expectedPension||0); }, 0);
  var totalRE      = baseAssets.reduce(function(s,a){ return s+(a.realEstateIncome||0); }, 0);

  // v105.3: use exact computed values from pensionSliderChange — no scaling, same tax engine as pension tab
  var netWithQ    = (typeof pnsNetMonthlyWithHarel !== 'undefined') ? (pnsNetMonthlyWithHarel || 0) : 0;
  var netWithoutQ = (typeof pnsNetMonthlyNoHarel   !== 'undefined') ? (pnsNetMonthlyNoHarel   || 0) : 0;
  // fallback: if not yet computed, use pnsNetMonthly for both
  if (!netWithQ && !netWithoutQ) {
    var _fb = (typeof pnsNetMonthly !== 'undefined') ? (pnsNetMonthly || 0) : 0;
    netWithQ = netWithoutQ = _fb;
  }

  // Display value switches based on ovPnsShowHarel
  var displayNet = ovPnsShowHarel ? netWithQ : netWithoutQ;
  ovPnsDisplayNet = displayNet; // cache for header sync in ovRenderKPIs
  var freeIncome = displayNet + totalRE;

  function fmtNIS(n) { return n > 0 ? Math.round(n).toLocaleString('he-IL') : '—'; }
  function fmtK(n) {
    if (!n || n <= 0) return '—';
    if (n >= 1000000) return (n/1000000).toFixed(2)+'M';
    if (n >= 1000)    return Math.round(n/1000)+'K';
    return Math.round(n).toLocaleString('he-IL');
  }

  // Update Harel toggle buttons in card header (static DOM, updated by ovSetPnsHarel)
  var _btnMinus = document.getElementById('ov-harel-btn-minus');
  var _btnPlus  = document.getElementById('ov-harel-btn-plus');
  if (_btnMinus) { _btnMinus.style.background = !ovPnsShowHarel ? '#1e3a8a' : 'transparent'; _btnMinus.style.color = !ovPnsShowHarel ? '#fff' : '#6b7280'; }
  if (_btnPlus)  { _btnPlus.style.background  =  ovPnsShowHarel ? '#1e3a8a' : 'transparent'; _btnPlus.style.color  =  ovPnsShowHarel ? '#fff' : '#6b7280'; }

  // Single elegant horizontal stat row
  function stat(label, val, color, suffix) {
    return '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:0;">' +
      '<div style="font-size:11px;color:#64748b;font-weight:600;white-space:nowrap;">' + label + '</div>' +
      '<div style="font-size:17px;font-weight:700;color:' + color + ';white-space:nowrap;">' + val + '</div>' +
      '<div style="font-size:11px;color:#475569;">' + (suffix || '') + '</div>' +
    '</div>';
  }
  function sep() {
    return '<div style="width:1px;height:36px;background:rgba(100,116,139,0.2);flex-shrink:0;"></div>';
  }

  el.innerHTML = '<div style="display:flex;align-items:stretch;gap:0;width:100%;">' +
    stat('הון צבור', fmtK(totalAccum), '#a5b4fc', 'ש״ח') +
    sep() +
    stat('קצבה ברוטו', fmtNIS(ovPnsShowHarel ? grossWith : grossWithout), '#7dd3fc', '₪/חודש') +
    sep() +
    '<div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1;min-width:0;">' +
      '<div style="font-size:11px;color:#64748b;font-weight:600;white-space:nowrap;">' +
        'קצבה נטו' +
      '</div>' +
      '<div style="font-size:17px;font-weight:700;color:#4ade80;white-space:nowrap;">' + fmtNIS(displayNet) + '</div>' +
      '<div style="font-size:11px;color:#475569;">₪/חודש</div>' +
    '</div>' +
    sep() +
    stat('הכנסה פנויה', fmtNIS(freeIncome), '#60a5fa', 'Cash Flow נטו') +
  '</div>';
}

// ── Simulator Mini — EXACT clone of simRenderChart (5-year, roy view) ────────
function ovRenderSimMini() {
  var canvas  = document.getElementById('ov-sim-chart');
  var emptyEl = document.getElementById('ov-sim-empty');
  var tlEl    = document.getElementById('ov-sim-timeline');
  if (!canvas) return;

  // v169.3: in SIMULATOR mode use FFS capital gate; otherwise require full Excel data
  var allReady;
  if (typeof APP_MODE !== 'undefined' && APP_MODE === 'SIMULATOR') {
    var _ffsCapital = (typeof ffsGetLiquidCapital === 'function') ? ffsGetLiquidCapital() : 0;
    var _ffsPension = (typeof ffsGetPensionAccumK === 'function') ? ffsGetPensionAccumK() : 0;
    var _ffsRE      = (typeof ffsGetRealEstateK   === 'function') ? ffsGetRealEstateK()   : 0;
    allReady = simInited && (typeof simRunEngine === 'function') &&
               (_ffsCapital > 0 || _ffsPension > 0 || _ffsRE > 0);
  } else {
    allReady = ovAllDataReady() && (typeof simRunEngine === 'function') &&
               (typeof simGetRoyCapital === 'function') && simGetRoyCapital() > 0;
  }
  if (!allReady) {
    if (ovSimMiniChart) { ovSimMiniChart.destroy(); ovSimMiniChart = null; }
    canvas.style.display = 'none';
    if (emptyEl) {
      emptyEl.textContent = (typeof APP_MODE !== 'undefined' && APP_MODE === 'SIMULATOR')
        ? 'הכנס נתונים אישיים בסימולטור להצגת תחזית 5 שנים'
        : 'יש להעלות את קבצי הנתונים להצגת התוכן';
      emptyEl.style.display = 'flex';
    }
    if (tlEl) tlEl.innerHTML = '';
    return;
  }
  canvas.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  var result  = simRunEngine();
  var startYr = (typeof SIM_P1_START !== 'undefined') ? SIM_P1_START.y : 2026;
  var endYr   = startYr + 5;
  var sliced  = simSliceResult(result, startYr, endYr);

  var re     = sliced.royRealEstateData || (sliced.royLiquidData || []).map(function(){ return 0; });
  var liq    = sliced.royLiquidData  || [];
  var phx    = sliced.royPhoenixData || [];
  var hrl    = sliced.royHarelData   || [];
  var liqTop = re.map(function(v,i){ return v + liq[i]; });
  var phxTop = re.map(function(v,i){ return v + liq[i] + phx[i]; });
  var hrlTop = re.map(function(v,i){ return v + liq[i] + phx[i] + hrl[i]; });

  // Collect tooltip events — same as main simulator
  var _tooltipEvs = (typeof simCollectEvents === 'function')
    ? simCollectEvents().events.filter(function(ev){ return ev.yr >= startYr && ev.yr <= endYr; })
    : [];

  if (ovSimMiniChart) { ovSimMiniChart.destroy(); ovSimMiniChart = null; }

  // v135.0: {x,y} format so duplicate "YYYY-MM" labels for event months share same x-pixel
  var _mLbls = sliced.labels || [];
  function _mkXY(arr) { return _mLbls.map(function(lbl,i){ return {x:lbl, y:arr[i]}; }); }

  ovSimMiniChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      datasets: [
        { label:'נדל״ן',                              data:_mkXY(re),     borderColor:'#a0522d', backgroundColor:'rgba(184,115,51,0.50)', fill:'origin', tension:0, borderWidth:1.5, pointRadius:0, pointHoverRadius:4, order:4 },
        { label:'השקעות',                             data:_mkXY(liqTop), borderColor:'#1e40af', backgroundColor:'rgba(30,64,175,0.45)',  fill:'-1',     tension:0, borderWidth:1.5, pointRadius:0, pointHoverRadius:4, order:3 },
        { label:SIM_PENSION_FUND_NAME,               data:_mkXY(phxTop), borderColor:'#60a5fa', backgroundColor:'rgba(96,165,250,0.25)', fill:'-1',     tension:0, borderWidth:1.5, pointRadius:0, pointHoverRadius:4, order:2 }, // v163.0: hardcoded MVP labels
        { label:SIM_SAVINGS_FUND_NAME,               data:_mkXY(hrlTop), borderColor:'#34d399', backgroundColor:'rgba(52,211,153,0.20)', fill:'-1',     tension:0, borderWidth:1.5, pointRadius:0, pointHoverRadius:4, order:1 }  // v163.0: hardcoded MVP labels
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top', labels: { font: { size: 9, family: 'Heebo' }, color: '#374151', boxWidth: 10, padding: 6 } },
        tooltip: {
          rtl: true, textDirection: 'rtl',
          yAlign: 'bottom', caretPadding: 12,
          titleFont: { family: 'Heebo' }, bodyFont: { family: 'Heebo' },
          footerFont: { family: 'Heebo', weight: 'bold' }, footerColor: '#f9fafb',
          callbacks: {
            label: function(ctx) {
              var di = ctx.dataIndex;
              var v;
              if (ctx.datasetIndex === 0) v = re[di]     || 0;
              else if (ctx.datasetIndex === 1) v = liq[di] || 0;
              else if (ctx.datasetIndex === 2) v = phx[di] || 0;
              else v = hrl[di] || 0;
              if (v === 0) return null; // v167.9: hide zero layers from tooltip
              return ' ' + ctx.dataset.label + ': ' + (v >= 1000 ? (v/1000).toFixed(1)+'M' : Math.round(v)+'k');
            },
            footer: function(items) {
              if (!items || !items.length) return '';
              var di    = items[0].dataIndex;
              var total = sliced.royData ? (sliced.royData[di] || 0) : (hrlTop[di] || 0);
              var lines = ['סה״כ: ' + (total >= 1000 ? (total/1000).toFixed(1)+'M' : Math.round(total)+'k')];
              // v146.0: strict YYYY-MM match — prevents smearing event across all months in same year
              var _hoveredLabel = String((sliced.labels || [])[di] || '');
              if (_hoveredLabel) {
                _tooltipEvs.forEach(function(ev) {
                  var _eventDateIndex = ev.yr + '-' + (ev.mo < 10 ? '0' : '') + ev.mo;
                  if (_hoveredLabel !== _eventDateIndex) return;
                  var absAmt = Math.abs(ev.amount || 0);
                  var amtStr = absAmt >= 1000 ? (ev.amount < 0 ? '-' : '') + (absAmt/1000).toFixed(1)+'M'
                             : absAmt > 0 ? (ev.amount < 0 ? '-' : '') + Math.round(absAmt) + 'k' : '';
                  lines.push('◆ ' + (ev.label || '?') + (amtStr ? ': ' + amtStr : ''));
                });
              }
              return lines;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: { family: 'Heebo', size: 9 }, color: '#9ca3af',
            autoSkip: false, maxRotation: 0,
            // v135.0: show only January ticks; return null hides tick mark entirely
            callback: function(value) {
              var lbl = this.getLabelForValue(value);
              var parts = lbl ? String(lbl).split('-') : [];
              if (parts.length < 2) return null;
              var mo = parseInt(parts[1]);
              if (isNaN(mo) || mo !== 1) return null;
              return parts[0];
            }
          },
          grid: { color: 'rgba(0,0,0,0.04)' }
        },
        y: {
          beginAtZero: true,
          // v136.0: dynamic suggestedMax — 20% headroom above peak value, rounded to nearest 5M; no hard cap
          suggestedMax: (function() {
            var mx = 0;
            hrlTop.forEach(function(v) { if ((v || 0) > mx) mx = (v || 0); });
            return Math.ceil(mx * 1.2 / 5000) * 5000 || 20000;
          })(),
          ticks: { font: { family: 'Heebo', size: 9 }, color: '#9ca3af', callback: function(v){ return v >= 1000 ? Math.round(v/1000)+'M' : Math.round(v)+'k'; } },
          grid: { color: 'rgba(0,0,0,0.04)' }
        }
      }
    }
  });

  // Events timeline — pixel-aligned clone of simRenderTimeline targeting ov-sim-timeline
  if (tlEl) {
    setTimeout(function() {
      var collected = (typeof simCollectEvents === 'function') ? simCollectEvents() : { events: [], monthNames: [] };
      var evs = collected.events.filter(function(ev){ return ev.yr >= startYr && ev.yr <= endYr; });
      var numYrs  = endYr - startYr;
      var ca      = (ovSimMiniChart && ovSimMiniChart.chartArea) ? ovSimMiniChart.chartArea : null;
      var canvasW = canvas ? (canvas.offsetWidth || canvas.clientWidth || 0) : 0;
      var usePixels = (ca && canvasW > 0);

      function yrToLeft(yr) {
        var frac = (yr - startYr) / numYrs;
        if (usePixels) return (ca.left + frac * (ca.right - ca.left)).toFixed(1) + 'px';
        return (frac * 100).toFixed(2) + '%';
      }

      var outerStyle = usePixels
        ? 'position:relative;height:46px;user-select:none;width:' + canvasW + 'px;'
        : 'position:relative;height:46px;user-select:none;';
      var html = '<div style="' + outerStyle + '">';

      // Base bar
      var barL = usePixels ? ca.left.toFixed(1) + 'px' : '0';
      var barR = usePixels ? (canvasW - ca.right).toFixed(1) + 'px' : '0';
      html += '<div style="position:absolute;left:' + barL + ';right:' + barR + ';top:20px;height:2px;'
            + 'background:linear-gradient(90deg,rgba(99,102,241,0.12),rgba(99,102,241,0.35),rgba(99,102,241,0.08));border-radius:2px;"></div>';

      // Year ticks
      for (var ty = startYr; ty <= endYr; ty++) {
        var tL = yrToLeft(ty);
        html += '<div style="position:absolute;left:' + tL + ';top:15px;width:1px;height:5px;background:rgba(0,0,0,0.1);"></div>';
        html += '<div style="position:absolute;left:' + tL + ';top:22px;font-size:7px;color:#9ca3af;transform:translateX(-50%);font-family:Heebo,sans-serif;white-space:nowrap;">' + ty + '</div>';
      }

      // Event diamonds
      var _OV_MIN_YR = Math.max(2026, (typeof SIM_P1_START !== 'undefined' ? SIM_P1_START.y : 2026));
      evs.forEach(function(ev) {
        if (!ev.yr) return;
        // v154.0: absolute render-phase guard — parseInt ensures no string-type bypass
        if (parseInt(ev.yr, 10) < _OV_MIN_YR) return;
        var dL = usePixels
          ? (parseFloat(yrToLeft(ev.yr)) - 5).toFixed(1) + 'px'
          : 'calc(' + yrToLeft(ev.yr) + ' - 5px)';
        var absAmt = Math.abs(ev.amount || 0);
        var amtStr = absAmt >= 1000 ? ((ev.amount < 0 ? '-' : '') + (absAmt/1000).toFixed(1) + 'M')
                   : absAmt > 0    ? ((ev.amount < 0 ? '-' : '') + Math.round(absAmt) + 'k') : '';
        var tipText;
        // v146.0: permanent Excel events — show total summary ("סך אירועי פרישה: 617k"), not the first item label
        if (ev.permanent && (ev.src === 'retirement' || ev.src === 'events_timeline')) {
          var _sumStr = absAmt >= 1000 ? (absAmt/1000).toFixed(1)+'M' : Math.round(absAmt)+'k';
          tipText = 'סך אירועי פרישה: ' + _sumStr;
        } else {
          tipText = (ev.label || '?') + (amtStr ? ': ' + amtStr : '');
        }
        var tip = tipText.replace(/"/g, '&quot;');
        html += '<div data-tip="' + tip + '"'
              + ' onmouseenter="simShowTltp(this,event)" onmouseleave="simHideTltp()"'
              + ' style="position:absolute;left:' + dL + ';top:12px;width:10px;height:10px;'
              + 'transform:rotate(45deg);background:' + (ev.color || '#6366f1') + ';'
              + 'border:1px solid rgba(255,255,255,0.55);border-radius:1px;cursor:default;z-index:2;box-sizing:border-box;">'
              + '</div>';
      });

      html += '</div>';
      tlEl.innerHTML = html;
    }, 0);
  }
}


// =========================================
// MARKET ANALYSIS TAB — v104.0
// =========================================

var marketInited        = false;
var mktCurrentTicker    = null;
var mktCurrentPeriod    = '1m';
var mktCurrentData      = null;
var mktMainChart        = null;
var mktCompChart        = null;
var mktSniperOn         = false;
var mktAIOpen           = true;
var mktFxRate           = 3.70;
var mktInflationRate    = 0;     // % annual inflation for real-yield overlay
var mktInflationOn      = false; // toggle: show real yield (nominal - inflation)
var mktChatHistory      = [];
var mktLastFxSyncTicker = null; // tracks which ticker last synced the FX slider

function marketInit() {
  var inp = document.getElementById('mkt-search-input');
  if (inp) {
    inp.focus();
    // Auto-uppercase on every keystroke
    inp.addEventListener('input', function() {
      var pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      this.setSelectionRange(pos, pos);
    });
  }
}

// ── Search & Load ─────────────────────────
function mktSearch() {
  var inp = document.getElementById('mkt-search-input');
  if (!inp) return;
  var ticker = inp.value.trim().toUpperCase();
  if (!ticker) return;
  mktLoadTicker(ticker);
}

var MKT_GROUPS = {
  mag7:  ['AAPL','MSFT','GOOGL','AMZN','NVDA','META','TSLA'],
  sp500: ['SPY'],
  ta125: ['^TA125.TA'],
  ta35:  ['TA35.TA']
};

var MAG7_TICKERS = ['AAPL','MSFT','GOOGL','AMZN','META','NVDA','TSLA','SPY'];
var MAG7_COLORS  = ['#3b82f6','#a855f7','#22c55e','#f97316','#ef4444','#06b6d4','#eab308','#94a3b8'];
var mktMag7Mode  = false;

function mktLoadGroup(group) {
  if (group === 'mag7') {
    mktMag7Mode = true;
    mktShowMag7Overlay();
    return;
  }
  mktMag7Mode = false;
  var list = MKT_GROUPS[group] || [];
  if (list.length > 0) {
    var inp = document.getElementById('mkt-search-input');
    if (inp) inp.value = list[0];
    mktLoadTicker(list[0]);
  }
}

function mktShowMag7Overlay() {
  var results = document.getElementById('mkt-results');
  if (results) results.style.display = '';

  var nameEl  = document.getElementById('mkt-stock-name');
  var tickEl  = document.getElementById('mkt-stock-ticker');
  var priceEl = document.getElementById('mkt-stock-price');
  var chgEl   = document.getElementById('mkt-stock-change');
  if (nameEl)  nameEl.textContent  = 'Magnificent 7 + SPY';
  if (tickEl)  tickEl.textContent  = 'AAPL · MSFT · GOOGL · AMZN · META · NVDA · TSLA · SPY';
  if (priceEl) priceEl.textContent = '';
  if (chgEl)   chgEl.textContent   = '';

  // Show loading state on chart
  if (mktMainChart) { mktMainChart.destroy(); mktMainChart = null; }

  var period = mktCurrentPeriod || '1m';
  var pending = MAG7_TICKERS.map(function(ticker) {
    return fetch('http://localhost:5051/api/stock?ticker=' + encodeURIComponent(ticker) +
                 '&period=' + period + '&bench=')
      .then(function(r) { return r.json(); })
      .then(function(data) { return { ticker: ticker, data: data }; })
      .catch(function()    { return { ticker: ticker, data: null  }; });
  });

  Promise.all(pending).then(function(results) { mktRenderMag7Chart(results); });
}

function mktRenderMag7Chart(tickerResults) {
  var canvas = document.getElementById('mkt-main-chart');
  if (!canvas) return;
  if (mktMainChart) { mktMainChart.destroy(); mktMainChart = null; }

  // Use the longest available label array as the x-axis
  var commonLabels = [];
  tickerResults.forEach(function(r) {
    if (r.data && r.data.history && r.data.history.length > commonLabels.length)
      commonLabels = r.data.history.map(function(h) { return h.date; });
  });

  var datasets = [];
  tickerResults.forEach(function(r, i) {
    if (!r.data || !r.data.history || r.data.history.length < 2) return;
    var prices = r.data.history.map(function(h) { return h.close; });
    var base   = prices[0] || 1;
    var norm   = prices.map(function(p) { return +((p / base - 1) * 100).toFixed(2); });
    datasets.push({
      label:           r.ticker,
      data:            norm,
      borderColor:     MAG7_COLORS[i] || '#fff',
      backgroundColor: 'transparent',
      fill:            false,
      tension:         0.3,
      borderWidth:     2,
      pointRadius:     0,
      pointHoverRadius: 4
    });
  });

  mktMainChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: commonLabels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: {
          display: true, position: 'top',
          labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 18, padding: 10, usePointStyle: true }
        },
        tooltip: {
          mode: 'index', intersect: false,
          callbacks: {
            label: function(c) {
              var v = c.raw;
              return ' ' + c.dataset.label + ': ' + (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 8 },
          grid:  { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: {
            color: '#64748b', font: { size: 10 },
            callback: function(v) { return (v >= 0 ? '+' : '') + v.toFixed(1) + '%'; }
          },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
}

function mktLoadTicker(ticker) {
  mktMag7Mode = false;
  var isNewTicker = (ticker !== mktLastFxSyncTicker);
  mktCurrentTicker = ticker;
  mktCurrentData   = null;
  mktSniperOn      = false;
  mktChatHistory   = [];

  // Clear not-found message
  var nfEl = document.getElementById('mkt-not-found');
  if (nfEl) nfEl.style.display = 'none';

  // Reset sniper toggle
  var track = document.getElementById('mkt-sniper-track');
  var thumb = document.getElementById('mkt-sniper-thumb');
  if (track) { track.style.background = '#1e2d4a'; track.style.borderColor = '#3b4f6e'; }
  if (thumb) { thumb.style.right = '2px'; thumb.style.background = '#475569'; }
  var legendEl = document.getElementById('mkt-sniper-legend');
  if (legendEl) legendEl.style.display = 'none';

  // Reset AI messages
  var aiMsgs = document.getElementById('mkt-ai-messages');
  if (aiMsgs) aiMsgs.innerHTML = '';

  // Hide news section while loading
  var newsEl = document.getElementById('mkt-news-section');
  if (newsEl) { newsEl.style.display = 'none'; newsEl.innerHTML = ''; }

  // Show results area
  var results = document.getElementById('mkt-results');
  if (results) results.style.display = '';

  // Update name immediately
  var nameEl = document.getElementById('mkt-stock-name');
  if (nameEl) nameEl.textContent = '⏳ טוען ' + ticker + '...';
  var tickerEl2 = document.getElementById('mkt-stock-ticker');
  if (tickerEl2) tickerEl2.textContent = ticker;

  var benchSel = document.getElementById('mkt-bench-select');
  var benchVal = benchSel ? benchSel.value : 'SPY';
  fetch('http://localhost:5051/api/stock?ticker=' + encodeURIComponent(ticker) +
        '&period=' + mktCurrentPeriod + '&bench=' + encodeURIComponent(benchVal))
    .then(function(r) {
      if (r.status === 404) {
        return r.json().then(function(j) {
          mktShowNotFound(ticker);
          throw new Error('404');
        });
      }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (data.error) { mktShowNotFound(ticker); return; }
      mktCurrentData = data;
      // Sync FX slider ONLY when loading a different ticker (not on period/bench change)
      if (isNewTicker && data.fx_rate && data.fx_rate > 0) {
        mktFxRate = data.fx_rate;
        mktLastFxSyncTicker = ticker;
        var slider = document.getElementById('mkt-fx-slider');
        var fxValEl = document.getElementById('mkt-fx-val');
        var clampedFx = Math.max(2.5, Math.min(3.5, mktFxRate));
        if (slider) slider.value = clampedFx.toFixed(2);
        if (fxValEl) fxValEl.textContent = clampedFx.toFixed(2);
      }
      mktRenderStockHeader(data);
      mktRenderMainChart(data);
      mktUpdateComparison();
      mktRenderNews(data.news || []);
      updateNewsSummary(data.news || [], data.name || ticker);
      mktAddAIMessage('assistant', 'שלום! אני מנתח את ' + (data.name || ticker) +
        '. מחיר: ' + (data.price ? data.price.toFixed(2) + ' ' + (data.currency || 'USD') : '—') +
        '. מה תרצה לדעת?');
    })
    .catch(function(err) {
      if (err.message === '404') return; // already handled by mktShowNotFound
      mktShowError('לא ניתן להתחבר לשרת הנתונים (localhost:5051).<br><small>ודא שהשרת פועל ונסה שוב.</small><br><small style="color:#64748b;">' + err.message + '</small>');
    });
}

function mktShowNotFound(ticker) {
  var nameEl = document.getElementById('mkt-stock-name');
  if (nameEl) nameEl.textContent = '—';
  var tickerEl = document.getElementById('mkt-stock-ticker');
  if (tickerEl) tickerEl.textContent = '';
  // Hide results area cleanly
  var results = document.getElementById('mkt-results');
  if (results) results.style.display = 'none';
  // Show gentle inline message below search bar
  var nfEl = document.getElementById('mkt-not-found');
  if (nfEl) {
    nfEl.textContent = '⚠️ "' + ticker + '" לא נמצאה — בדוק את הסימול ונסה שוב';
    nfEl.style.display = 'block';
  }
}

function mktShowError(msg) {
  var existing = document.getElementById('mkt-error-card');
  if (existing) existing.remove();
  var div = document.createElement('div');
  div.id = 'mkt-error-card';
  div.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;' +
    'background:#1c1424;border:1px solid #7f1d1d;border-radius:12px;padding:12px 22px;' +
    'color:#fca5a5;font-size:12px;text-align:center;line-height:1.6;white-space:nowrap;' +
    'box-shadow:0 4px 24px rgba(0,0,0,0.5);font-family:Heebo,sans-serif;';
  div.innerHTML = msg;
  document.body.appendChild(div);
  setTimeout(function() { var el = document.getElementById('mkt-error-card'); if (el) el.remove(); }, 6000);
}

// ── Stock Header ──────────────────────────
function mktRenderStockHeader(data) {
  function el(id){ return document.getElementById(id); }
  var errCard = document.getElementById('mkt-error-card');
  if (errCard) errCard.remove();
  if (el('mkt-stock-name'))   el('mkt-stock-name').textContent   = data.name || mktCurrentTicker;
  if (el('mkt-stock-ticker')) el('mkt-stock-ticker').textContent = mktCurrentTicker;
  if (el('mkt-stock-price'))  el('mkt-stock-price').textContent  = data.price ? data.price.toFixed(2) + ' ' + (data.currency || 'USD') : '—';
  var chgEl = el('mkt-stock-change');
  if (chgEl) {
    var chg = data.change_pct || 0;
    chgEl.textContent = (chg >= 0 ? '▲ +' : '▼ ') + chg.toFixed(2) + '%';
    chgEl.style.color = chg >= 0 ? '#4ade80' : '#f87171';
  }
}

// ── News Cards ───────────────────────────
function mktRenderNews(articles) {
  var el = document.getElementById('mkt-news-section');
  if (!el) return;
  if (!articles || !articles.length) {
    el.style.display = 'none';
    return;
  }
  el.style.display = '';
  var html = '<div style="font-size:10px;font-weight:700;color:#475569;margin-bottom:7px;letter-spacing:0.6px;text-transform:uppercase;">חדשות</div>';
  html += '<div style="display:flex;flex-direction:column;gap:5px;">';
  articles.forEach(function(a) {
    if (!a.title) return;
    var hasUrl = a.url && a.url.length > 0;
    var tag = hasUrl ? 'a' : 'div';
    var attrs = hasUrl ? 'href="' + a.url + '" target="_blank" rel="noopener noreferrer"' : '';
    html += '<' + tag + ' ' + attrs
      + ' style="display:flex;align-items:flex-start;gap:8px;background:#0d1524;border:1px solid #1e2d4a;border-radius:9px;padding:8px 10px;text-decoration:none;cursor:' + (hasUrl ? 'pointer' : 'default') + ';transition:border-color 0.18s,background 0.18s;"'
      + (hasUrl ? ' onmouseover="this.style.borderColor=\'#3b82f6\';" onmouseout="this.style.borderColor=\'#1e2d4a\';"' : '')
      + '>';
    html += '<div style="flex:1;min-width:0;overflow:hidden;">';
    html += '<div style="font-size:11px;font-weight:600;color:#cbd5e1;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">' + a.title + '</div>';
    if (a.publisher) {
      html += '<div style="font-size:9px;color:#475569;margin-top:2px;">' + a.publisher + '</div>';
    }
    html += '</div>';
    if (hasUrl) {
      html += '<div style="color:#3b82f6;font-size:10px;flex-shrink:0;padding-top:1px;">↗</div>';
    }
    html += '</' + tag + '>';
  });
  html += '</div>';
  el.innerHTML = html;
}

// ── News AI Summary ───────────────────────
function _mktAiSummaryExpand() {
  var card    = document.getElementById('mkt-news-ai-summary');
  var overlay = document.getElementById('mkt-ai-summary-overlay');
  if (!card || !overlay) return;
  card.classList.add('ai-summary-expanded');
  overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
  // Inject X close button
  if (!document.getElementById('mkt-ai-close-btn')) {
    var xBtn = document.createElement('button');
    xBtn.id = 'mkt-ai-close-btn';
    xBtn.textContent = '✕ סגור';
    xBtn.style.cssText =
      'position:absolute;top:14px;left:16px;padding:5px 14px;border-radius:8px;' +
      'border:1px solid #1e3a5f;background:rgba(255,255,255,0.06);color:#94a3b8;' +
      'font-size:11px;font-family:Heebo,sans-serif;cursor:pointer;transition:background 0.15s;';
    xBtn.addEventListener('mouseover', function() { xBtn.style.background = 'rgba(255,255,255,0.12)'; });
    xBtn.addEventListener('mouseout',  function() { xBtn.style.background = 'rgba(255,255,255,0.06)'; });
    xBtn.addEventListener('click', function(e) { e.stopPropagation(); _mktAiSummaryCollapse(); });
    card.style.position = 'relative';
    card.appendChild(xBtn);
  }
}

function _mktAiSummaryCollapse() {
  var card    = document.getElementById('mkt-news-ai-summary');
  var overlay = document.getElementById('mkt-ai-summary-overlay');
  var xBtn    = document.getElementById('mkt-ai-close-btn');
  if (card)    card.classList.remove('ai-summary-expanded');
  if (overlay) overlay.style.display = 'none';
  if (xBtn)    xBtn.remove();
  document.body.style.overflow = '';
}

// Ensure overlay exists in DOM (created once)
(function _ensureAiOverlay() {
  if (document.getElementById('mkt-ai-summary-overlay')) return;
  var ov = document.createElement('div');
  ov.id = 'mkt-ai-summary-overlay';
  ov.style.cssText =
    'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.72);z-index:8000;cursor:pointer;';
  ov.addEventListener('click', _mktAiSummaryCollapse);
  document.body.appendChild(ov);
})();

function updateNewsSummary(articles, tickerName) {
  var newsEl = document.getElementById('mkt-news-section');
  if (!newsEl || !articles || !articles.length) return;

  var existing = document.getElementById('mkt-news-ai-summary');
  if (existing) existing.remove();

  var summaryDiv = document.createElement('div');
  summaryDiv.id  = 'mkt-news-ai-summary';
  summaryDiv.style.cssText =
    'background:#0f172a;border:1px solid #1e3a5f;border-radius:11px;padding:12px 15px;' +
    'margin-bottom:8px;font-size:13px;color:#94a3b8;line-height:1.6;direction:rtl;cursor:pointer;' +
    'transition:border-color 0.2s;';
  summaryDiv.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;">' +
      '<span style="font-size:10px;font-weight:700;color:#3b82f6;letter-spacing:0.7px;">🤖 תובנות AI</span>' +
      '<span style="font-size:9px;color:#475569;">לחץ להרחבה ↗</span>' +
    '</div>' +
    '<div id="mkt-news-ai-text" style="font-size:13px;line-height:1.6;color:#94a3b8;">מנתח כותרות...</div>';
  summaryDiv.addEventListener('click', _mktAiSummaryExpand);
  summaryDiv.addEventListener('mouseover',  function() { summaryDiv.style.borderColor = '#3b82f6'; });
  summaryDiv.addEventListener('mouseout',   function() { summaryDiv.style.borderColor = '#1e3a5f'; });
  newsEl.insertBefore(summaryDiv, newsEl.firstChild);

  var headlines = articles.slice(0, 5).map(function(a, i) {
    return (i + 1) + '. ' + a.title;
  }).join('\n');

  var prompt =
    'Analyze these headlines for ' + tickerName + ' as a senior portfolio manager.\n\n' +
    headlines +
    '\n\nProvide exactly 3 bullet points IN HEBREW ONLY, each on a new line starting with •.\n' +
    '• First: Market sentiment — what does the overall tone signal?\n' +
    '• Second: Specific stock impact — direct effect on ' + tickerName + ' price/valuation.\n' +
    '• Third: Tactical bottom line — one-sentence actionable conclusion for a trader today.\n' +
    'Be clinical, precise, no fluff.';

  fetch('http://localhost:5051/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: 'אתה מנהל תיק השקעות בכיר עם 20 שנות ניסיון. ענה בעברית בלבד. היה קליני, תמציתי ומדויק.',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 350
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(resp) {
    var textEl = document.getElementById('mkt-news-ai-text');
    if (!textEl) return;
    if (resp.error) {
      textEl.textContent = 'מכין סיכום חדשות... (ממתין לאישור AI)';
      textEl.style.color = '#64748b';
      return;
    }
    var text = (resp.content && resp.content[0] && resp.content[0].text) || '';
    textEl.innerHTML = text
      .replace(/•/g, '<span style="color:#3b82f6;font-weight:700;font-size:1.1em;">•</span>')
      .replace(/\n/g, '<br>');
    textEl.style.color = '#cbd5e1';
  })
  .catch(function() {
    var textEl = document.getElementById('mkt-news-ai-text');
    if (textEl) {
      textEl.textContent = 'מכין סיכום חדשות... (ממתין לאישור AI)';
      textEl.style.color = '#64748b';
    }
  });
}

// ── Main Stock Chart ──────────────────────
function mktRenderMainChart(data) {
  var canvas = document.getElementById('mkt-main-chart');
  if (!canvas || !data || !data.history || !data.history.length) return;
  var labels = data.history.map(function(p){ return p.date; });
  var prices = data.history.map(function(p){ return p.close; });
  if (mktMainChart) { mktMainChart.destroy(); mktMainChart = null; }
  var ctx  = canvas.getContext('2d');
  var grad = ctx.createLinearGradient(0, 0, 0, 250);
  grad.addColorStop(0, 'rgba(59,130,246,0.22)');
  grad.addColorStop(1, 'rgba(59,130,246,0.01)');

  mktMainChart = new Chart(ctx, {
    type: 'line',
    data: { labels: labels, datasets: [{
      label: mktCurrentTicker,
      data: prices,
      borderColor: '#3b82f6', backgroundColor: grad,
      fill: true, tension: 0.3, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5
    }] },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false, callbacks: {
          label: function(c){ return ' ' + (c.raw||0).toFixed(2) + ' ' + (data.currency||'USD'); }
        }}
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    },
    plugins: [{
      id: 'sniperLines',
      afterDraw: function(chart) {
        if (!mktSniperOn || !mktCurrentData || !mktCurrentData.sniper) return;
        var sniper = mktCurrentData.sniper;
        var ctx2   = chart.ctx;
        var yAxis  = chart.scales.y;
        var xAxis  = chart.scales.x;
        if (!yAxis || !xAxis) return;
        function drawLine(price, color, label) {
          if (!price || price <= 0) return;
          var y = yAxis.getPixelForValue(price);
          if (y < yAxis.top || y > yAxis.bottom) return;
          ctx2.save();
          ctx2.setLineDash([7, 4]);
          ctx2.strokeStyle = color;
          ctx2.lineWidth   = 1.5;
          ctx2.globalAlpha = 0.75;
          ctx2.beginPath();
          ctx2.moveTo(xAxis.left, y);
          ctx2.lineTo(xAxis.right, y);
          ctx2.stroke();
          ctx2.globalAlpha = 1;
          ctx2.setLineDash([]);
          ctx2.fillStyle = color;
          ctx2.font      = 'bold 10px Heebo, sans-serif';
          ctx2.textAlign = 'left';
          ctx2.fillText(label + ' ' + price.toFixed(2), xAxis.left + 6, y - 5);
          ctx2.restore();
        }
        drawLine(sniper.target_buy,  '#4ade80', '🎯 קנייה:');
        drawLine(sniper.target_sell, '#f87171', '🎯 מכירה:');
        var legendEl2 = document.getElementById('mkt-sniper-legend');
        if (legendEl2) {
          legendEl2.style.display = 'flex';
          legendEl2.innerHTML =
            '<span style="color:#4ade80;">● קנייה: ' + (sniper.target_buy  || '—') + '</span> ' +
            '<span style="color:#f87171;">● מכירה: ' + (sniper.target_sell || '—') + '</span>' +
            (sniper.note ? ' <span>· ' + sniper.note + '</span>' : '');
        }
      }
    }]
  });
}

// ── Period Buttons ────────────────────────
function mktSetPeriod(period) {
  mktCurrentPeriod = period;
  document.querySelectorAll('.mkt-period-btn').forEach(function(b) {
    b.classList.toggle('active', (b.getAttribute('data-p') || '') === period);
  });
  if (mktMag7Mode) {
    mktShowMag7Overlay();
  } else if (mktCurrentTicker) {
    mktLoadTicker(mktCurrentTicker);
  }
}

// ── Sniper Toggle ─────────────────────────
function mktToggleSniper() {
  mktSniperOn = !mktSniperOn;
  var track = document.getElementById('mkt-sniper-track');
  var thumb = document.getElementById('mkt-sniper-thumb');
  var label = document.querySelector('#mkt-sniper-btn span');
  if (track) {
    track.style.background   = mktSniperOn ? 'rgba(59,130,246,0.35)' : '#1e2d4a';
    track.style.borderColor  = mktSniperOn ? '#3b82f6' : '#3b4f6e';
  }
  if (thumb) {
    thumb.style.right      = mktSniperOn ? '16px' : '2px';
    thumb.style.background = mktSniperOn ? '#60a5fa' : '#475569';
  }
  if (label) label.style.color = mktSniperOn ? '#60a5fa' : '#94a3b8';
  if (mktMainChart) mktMainChart.update();
  var legendEl3 = document.getElementById('mkt-sniper-legend');
  if (legendEl3 && !mktSniperOn) legendEl3.style.display = 'none';
}

// ── Comparison Chart ──────────────────────
function _inflationDeduction(i, n) {
  // Linear inflation deduction for data point i of n total
  var periodYears = { '1d': 1/252, '5d': 5/252, '1m': 1/12, '3m': 3/12, '6m': 6/12, '1y': 1, '3y': 3 };
  var yrs = (periodYears[mktCurrentPeriod] || 1/12);
  return mktInflationOn ? (mktInflationRate * (i / Math.max(n - 1, 1)) * yrs) : 0;
}

function mktUpdateComparison() {
  var canvas = document.getElementById('mkt-compare-chart');
  if (!canvas || !mktCurrentData || !mktCurrentData.history || !mktCurrentData.history.length) return;
  var benchSel    = document.getElementById('mkt-bench-select');
  var benchTicker = benchSel ? benchSel.value : 'SPY';
  var history     = mktCurrentData.history;
  var n           = history.length;
  var base        = history[0].close || 1;
  var liveFx      = mktCurrentData.fx_rate || 3.70;
  var fxAdj       = mktFxRate / liveFx;
  var stockPct    = history.map(function(p, i){
    return (p.close / base - 1) * 100 * fxAdj - _inflationDeduction(i, n);
  });
  var labels      = history.map(function(p){ return p.date; });
  var chartLabel  = mktCurrentTicker + (mktInflationOn ? ' (ריאלי)' : '');
  var datasets    = [{
    label: chartLabel, data: stockPct,
    borderColor: mktInflationOn ? '#a78bfa' : '#3b82f6', backgroundColor: 'transparent',
    tension: 0.3, borderWidth: 2, pointRadius: 0, fill: false
  }];
  var bench = mktCurrentData.benchmark;
  if (bench && bench.length > 0) {
    var bBase = bench[0].close || 1;
    var bN    = bench.length;
    datasets.push({
      label: benchTicker + (mktInflationOn ? ' (ריאלי)' : ''),
      data: bench.map(function(p, i){ return (p.close / bBase - 1) * 100 - _inflationDeduction(i, bN); }),
      borderColor: '#f59e0b', backgroundColor: 'transparent',
      tension: 0.3, borderWidth: 2, pointRadius: 0, fill: false
    });
  }
  // Inflation line (shown when toggle is on)
  if (mktInflationOn) {
    var periodYears = { '1d': 1/252, '5d': 5/252, '1m': 1/12, '3m': 3/12, '6m': 6/12, '1y': 1, '3y': 3 };
    var yrs = (periodYears[mktCurrentPeriod] || 1/12);
    datasets.push({
      label: 'אינפלציה (' + mktInflationRate.toFixed(1) + '%/שנה)',
      data: history.map(function(p, i){ return -(mktInflationRate * (i / Math.max(n - 1, 1)) * yrs); }),
      borderColor: '#f87171', backgroundColor: 'transparent',
      borderDash: [5, 4], tension: 0, borderWidth: 1.5, pointRadius: 0, fill: false
    });
  }
  if (mktCompChart) { mktCompChart.destroy(); mktCompChart = null; }
  mktCompChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: labels, datasets: datasets },
    options: {
      responsive: true, maintainAspectRatio: false, animation: false,
      plugins: {
        legend: { display: true, labels: { color: '#94a3b8', font: { size: 10, family: 'Heebo' }, boxWidth: 12 } },
        tooltip: { mode: 'index', intersect: false, callbacks: {
          label: function(c){ return ' ' + c.dataset.label + ': ' + (c.raw||0).toFixed(2) + '%'; }
        }}
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 6 }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#64748b', font: { size: 10 }, callback: function(v){ return v.toFixed(1)+'%'; } }, grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

// ── FX Slider ─────────────────────────────
function mktFxChange(val) {
  mktFxRate = parseFloat(val);
  var el = document.getElementById('mkt-fx-val');
  if (el) el.textContent = mktFxRate.toFixed(2);
  mktUpdateComparison();
}

// ── Inflation Slider & Toggle ──────────────
function mktInflationChange(val) {
  mktInflationRate = parseFloat(val) || 0;
  var el = document.getElementById('mkt-inflation-val');
  if (el) el.textContent = mktInflationRate.toFixed(1) + '%';
  mktUpdateComparison();
}

function mktInflationToggle() {
  mktInflationOn = !mktInflationOn;
  var track = document.getElementById('mkt-inflation-track');
  var thumb = document.getElementById('mkt-inflation-thumb');
  var row   = document.getElementById('mkt-inflation-slider-row');
  if (track) { track.style.background = mktInflationOn ? '#6d28d9' : '#1e2d4a'; }
  if (thumb) { thumb.style.right = mktInflationOn ? '2px' : '16px'; thumb.style.background = mktInflationOn ? '#a78bfa' : '#475569'; }
  if (row)   { row.style.opacity = mktInflationOn ? '1' : '0.45'; }
  mktUpdateComparison();
}

// ── AI Sidebar ────────────────────────────
function mktToggleAI() {
  mktAIOpen = !mktAIOpen;
  var body    = document.getElementById('mkt-ai-body');
  var chevron = document.getElementById('mkt-ai-chevron');
  if (body)    body.style.display  = mktAIOpen ? '' : 'none';
  if (chevron) chevron.textContent = mktAIOpen ? '▼' : '▶';
}

function mktAddAIMessage(role, text) {
  var el = document.getElementById('mkt-ai-messages');
  if (!el) return;
  var div = document.createElement('div');
  div.className = (role === 'user') ? 'mkt-ai-msg-user' : 'mkt-ai-msg-ai';
  div.textContent = text;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function mktAISend() {
  var inp = document.getElementById('mkt-ai-input');
  if (!inp) return;
  var question = inp.value.trim();
  if (!question) return;
  inp.value = '';
  mktAddAIMessage('user', question);
  mktChatHistory.push({ role: 'user', content: question });

  var stockCtx = '';
  if (mktCurrentData) {
    stockCtx = 'מניה: ' + (mktCurrentData.name || mktCurrentTicker) + ' (' + mktCurrentTicker + ')' +
      ' | מחיר: ' + (mktCurrentData.price ? mktCurrentData.price.toFixed(2) + ' ' + (mktCurrentData.currency || 'USD') : '—') +
      ' | שינוי: ' + ((mktCurrentData.change_pct || 0).toFixed(2)) + '%';
    if (mktCurrentData.sniper) {
      stockCtx += ' | יעד קנייה: ' + (mktCurrentData.sniper.target_buy || '—') +
                  ' | יעד מכירה: ' + (mktCurrentData.sniper.target_sell || '—');
    }
  }
  var inflCtx = mktInflationOn
    ? ' | שיעור אינפלציה: ' + mktInflationRate.toFixed(1) + '%/שנה (הצג תשואה ריאלית)'
    : '';
  var systemPrompt = 'אתה אנליסט פיננסי מומחה בשוק ההון. ענה בעברית בתמציתיות ובדיוק. ' +
    (stockCtx ? 'נתוני המניה הנוכחית: ' + stockCtx + inflCtx : 'לא נבחרה מניה ספציפית.');

  var msgs = mktChatHistory.slice(-8);

  // Thinking indicator
  mktAddAIMessage('assistant', '⏳ מנתח...');
  var thinkingDiv = document.getElementById('mkt-ai-messages').lastChild;

  fetch('http://localhost:5051/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages: msgs
    })
  })
  .then(function(r){ return r.json().then(function(j){ return { status: r.status, body: j }; }); })
  .then(function(res) {
    if (thinkingDiv && thinkingDiv.parentNode) thinkingDiv.parentNode.removeChild(thinkingDiv);
    var resp = res.body;
    var text = '';
    if (resp.content && resp.content.length > 0) {
      text = resp.content.filter(function(b){ return b.type === 'text'; }).map(function(b){ return b.text; }).join('\n');
    } else if (resp.error) {
      var errType = resp.error.type || '';
      if (errType === 'overloaded_error' || res.status === 429) {
        text = '⏳ ' + (resp.error.message || 'השרת עמוס כרגע. המתן מספר שניות ונסה שוב.');
      } else {
        text = 'שגיאה: ' + (resp.error.message || errType || 'לא ידוע');
      }
    }
    if (!text) text = 'לא התקבלה תשובה. נסה שוב.';
    mktAddAIMessage('assistant', text);
    mktChatHistory.push({ role: 'assistant', content: text });
  })
  .catch(function(err) {
    if (thinkingDiv && thinkingDiv.parentNode) thinkingDiv.parentNode.removeChild(thinkingDiv);
    mktAddAIMessage('assistant', 'שגיאה בחיבור לשרת (localhost:5051). ודא שהשרת פועל.');
  });
}

// =========================================
// SETTINGS TAB — v128.0
// =========================================

var SETTINGS_LS_KEY = 'fd_settings_v1';

// v128.0: Derive SIM_BIRTH_YEAR_ROY / SIM_BIRTH_YEAR_YAEL from birth date strings,
// then recalculate ALL phase boundaries in one place.
// Called from loadSettings, saveSettings, and saveModalSettings.
function syncBirthYearsFromSettings() {
  // User 1 birth date → SIM_BIRTH_YEAR_ROY + userCurrentAge
  if (SIM_USER1_BIRTH) {
    var yr1 = parseInt(SIM_USER1_BIRTH.split('-')[0], 10);
    if (!isNaN(yr1) && yr1 > 1900 && yr1 < 2020) {
      SIM_BIRTH_YEAR_ROY = yr1;
      userCurrentAge     = SIM_START_YEAR - yr1;
    }
  }
  // User 2 birth date → SIM_BIRTH_YEAR_YAEL
  if (SIM_USER2_BIRTH) {
    var yr2 = parseInt(SIM_USER2_BIRTH.split('-')[0], 10);
    if (!isNaN(yr2) && yr2 > 1900 && yr2 < 2020) {
      SIM_BIRTH_YEAR_YAEL = yr2;
    }
  }
  // Recalculate all phase boundaries from birth years + retirement ages
  SIM_P2_START.y = SIM_BIRTH_YEAR_ROY + SIM_RETIREMENT_AGE_YAEL;
  SIM_P3_START.y = SIM_BIRTH_YEAR_ROY + SIM_RETIREMENT_AGE_ROY;
  SIM_END.y      = SIM_BIRTH_YEAR_ROY + 95;
}

function loadSettings() {
  var raw = localStorage.getItem(SETTINGS_LS_KEY);
  var s = null;
  if (raw) {
    try { s = JSON.parse(raw); } catch(e) { s = null; }
  }

  // Apply saved values to globals (fall back to current defaults if key missing)
  if (s) {
    if (s.retireRoy  !== undefined) SIM_RETIREMENT_AGE_ROY  = parseInt(s.retireRoy,  10) || SIM_RETIREMENT_AGE_ROY;
    if (s.retireYael !== undefined) SIM_RETIREMENT_AGE_YAEL = parseInt(s.retireYael, 10) || SIM_RETIREMENT_AGE_YAEL;
    if (s.invRate    !== undefined) SIM_RATE           = parseFloat(s.invRate)    || SIM_RATE;
    if (s.pensionRate!== undefined) SIM_PENSION_RATE   = parseFloat(s.pensionRate) || SIM_PENSION_RATE;
    if (s.inflation  !== undefined) SIM_INFLATION      = parseFloat(s.inflation)  || SIM_INFLATION;
    if (s.reGrowth   !== undefined) SIM_RE_GROWTH_RATE = parseFloat(s.reGrowth)   || SIM_RE_GROWTH_RATE;
    if (s.pensionMonthly !== undefined) SIM_PENSION_MONTHLY = parseInt(s.pensionMonthly, 10) || SIM_PENSION_MONTHLY;
    if (s.instructorSal  !== undefined) SIM_INSTRUCTOR_SAL  = parseInt(s.instructorSal,  10) || SIM_INSTRUCTOR_SAL;
    if (s.capitalTax     !== undefined) SIM_CAPITAL_TAX     = parseFloat(s.capitalTax)    || SIM_CAPITAL_TAX;
    if (s.pensionAcc     !== undefined) SIM_PENSION_ACC     = parseFloat(s.pensionAcc)    || 0;
    if (s.rentalIncome   !== undefined) SIM_RENTAL_INCOME   = parseFloat(s.rentalIncome)  || 0;
    if (s.retireExp      !== undefined) SIM_RETIRE_EXP      = parseInt(s.retireExp, 10)   || SIM_RETIRE_EXP;
    if (s.user1Name      !== undefined) SIM_USER1_NAME      = s.user1Name  || SIM_USER1_NAME;
    if (s.user2Name      !== undefined) SIM_USER2_NAME      = s.user2Name  || SIM_USER2_NAME;
    if (s.user1Birth     !== undefined) SIM_USER1_BIRTH     = s.user1Birth || '';
    if (s.user2Birth     !== undefined) SIM_USER2_BIRTH     = s.user2Birth || '';
    // v137.0: default zoom preference
    if (s.defaultZoom    !== undefined && ['full','retirement','decade'].indexOf(s.defaultZoom) >= 0) {
      SIM_DEFAULT_ZOOM = s.defaultZoom;
      SIM_ZOOM         = s.defaultZoom;
    }
    // v168.60: restore custom zoom range from localStorage
    if (s.zoomDecStart !== undefined && !isNaN(parseInt(s.zoomDecStart))) SIM_ZOOM_CUSTOM.decStart = parseInt(s.zoomDecStart);
    if (s.zoomDecEnd   !== undefined && !isNaN(parseInt(s.zoomDecEnd)))   SIM_ZOOM_CUSTOM.decEnd   = parseInt(s.zoomDecEnd);
  }

  // v128.0: sync birth years + recalculate ALL phase boundaries
  syncBirthYearsFromSettings();

  // Populate input fields in the Settings tab
  var fld = {
    'stg-retire-age-roy':  SIM_RETIREMENT_AGE_ROY,
    'stg-retire-age-yael': SIM_RETIREMENT_AGE_YAEL,
    'stg-inv-rate':        SIM_RATE,
    'stg-pension-rate':    SIM_PENSION_RATE,
    'stg-inflation':       SIM_INFLATION,
    'stg-re-growth':       SIM_RE_GROWTH_RATE,
    'stg-pension-monthly':  SIM_PENSION_MONTHLY,
    'stg-instructor-sal':   SIM_INSTRUCTOR_SAL,
    'stg-capital-tax':      SIM_CAPITAL_TAX,
    'stg-inflation-macro':  SIM_INFLATION,
    'stg-pension-acc':      SIM_PENSION_ACC,
    'stg-rental-income':    SIM_RENTAL_INCOME,
    'stg-retire-exp':       SIM_RETIRE_EXP
  };
  // Text + date inputs need separate handling
  var txtFld = {
    'stg-user1-name':        SIM_USER1_NAME,
    'stg-user2-name':        SIM_USER2_NAME,
    'stg-user1-birth':       SIM_USER1_BIRTH,
    'stg-user2-birth':       SIM_USER2_BIRTH,
  };
  Object.keys(fld).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = fld[id];
  });
  Object.keys(txtFld).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = txtFld[id];
  });

  applyUserNames();

  // v156.0: sync loaded globals into simulator slider DOM
  syncSettingsToSliders();

  // v169.2/169.3: privacy shield — blank personal fields when no data is loaded
  var _hasActiveData = (CF_DATA && CF_DATA.length > 0) ||
                       (PENSION_ASSETS && PENSION_ASSETS.length > 0) ||
                       isDemoMode;
  if (!_hasActiveData) {
    _clearPrivacyFields();
    // v169.3/169.5: Roy's Vault — in EXCEL mode without a session upload, null ALL personal
    // globals so Roy's hardcoded birth year / names don't bleed into calculations or labels
    if (APP_MODE === 'EXCEL' && sessionStorage.getItem('hasUploadedFiles') !== '1') { // v169.6
      SIM_USER1_BIRTH = '';
      SIM_USER2_BIRTH = '';
      SIM_USER1_NAME  = '';
      SIM_USER2_NAME  = '';
      // v169.5: also reset birth year globals — prevents 1962 from leaking into sim phase calc
      var _gby = new Date().getFullYear() - 40;
      SIM_BIRTH_YEAR_ROY  = _gby;
      SIM_BIRTH_YEAR_YAEL = _gby;
      SIM_P2_START.y = _gby + SIM_RETIREMENT_AGE_YAEL;
      SIM_P3_START.y = _gby + SIM_RETIREMENT_AGE_ROY;
      SIM_END.y      = _gby + 95;
    }
  }

  // v120.0: dirty state — save button starts disabled after load
  var _saveBtn = document.querySelector('.settings-save-btn');
  if (_saveBtn) _saveBtn.disabled = true;
}

// v156.0: sync global SIM_* vars → simulator slider + numeric inputs without multiple re-renders.
// Call after globals are updated (loadSettings / saveSettings).
// Only triggers chart re-render when simulator is already initialised.
function syncSettingsToSliders() {
  function _set(sliderId, numId, val) {
    var sl  = document.getElementById(sliderId);
    var num = document.getElementById(numId);
    if (sl  && sl.value  != val) sl.value  = val;
    if (num && num.value != val) num.value = val;
  }
  _set('sim-instr-slider',           'sim-instr-num',            SIM_INSTRUCTOR_SAL);
  _set('sim-pension-monthly-slider', 'sim-pension-monthly-num',  SIM_PENSION_MONTHLY);
  _set('sim-rate-slider',            'sim-rate-num',             SIM_RATE);
  _set('pns-ret-yield-slider',       'pns-ret-yield-num',        SIM_PENSION_RATE);
  pnsRetirementYield = SIM_PENSION_RATE; // v168.83: keep in-memory var in sync with settings global
  _set('sim-inflation-slider',       'sim-inflation-num',        SIM_INFLATION);
  _set('sim-re-growth-slider',       'sim-re-growth-num',        SIM_RE_GROWTH_RATE);
  // v168.104: always restore expense slider from SIM_RETIRE_EXP
  // Only skip when FFS profile is active in manual mode AND provides its own expense (non-zero)
  if (typeof simUpdateExpSliderRange === 'function') simUpdateExpSliderRange();
  var _ffsHasExp = !isExcelLoaded() &&
      !!(FFS_PROFILE.name || (FFS_PROFILE.investments && FFS_PROFILE.investments.length > 0)) &&
      FFS_PROFILE.retirementExpense > 0;
  if (!_ffsHasExp && SIM_RETIRE_EXP > 0) {
    _set('sim-exp-slider', 'sim-exp-num', SIM_RETIRE_EXP);
    SIM_TARGET_EXP = SIM_RETIRE_EXP;
    var _ev104 = document.getElementById('sim-exp-val');
    if (_ev104) _ev104.textContent = simFmtNIS(SIM_TARGET_EXP);
  }
  // Re-render simulator only when already initialised (safe to call at any time)
  if (simInited) {
    if (typeof simRenderKPI   === 'function') simRenderKPI();
    if (typeof simRenderChart === 'function' && typeof simRunEngine === 'function') simRenderChart(simRunEngine());
  }
}

function saveSettings() {
  // v168.72: null-safe DOM read (some fields removed from Settings tab, now live in FFS drawer)
  function _rdv(id) { var el = document.getElementById(id); return el ? el.value : null; }
  // Read from inputs
  var retireRoy      = parseInt(_rdv('stg-retire-age-roy'),  10);
  var retireYael     = parseInt(_rdv('stg-retire-age-yael'), 10);
  var invRate        = parseFloat(_rdv('stg-inv-rate'));
  var pensionRate    = parseFloat(_rdv('stg-pension-rate'));
  var inflation      = parseFloat(_rdv('stg-inflation'));
  var reGrowth       = parseFloat(_rdv('stg-re-growth'));
  var pensionMonthly = parseInt(_rdv('stg-pension-monthly'), 10);
  var instructorSal  = parseInt(_rdv('stg-instructor-sal'),  10);
  var capitalTaxEl   = document.getElementById('stg-capital-tax');
  var capitalTax     = capitalTaxEl ? parseFloat(capitalTaxEl.value) : SIM_CAPITAL_TAX;
  var pensionAccEl   = document.getElementById('stg-pension-acc');
  var pensionAcc     = pensionAccEl   ? parseFloat(pensionAccEl.value)   : SIM_PENSION_ACC;
  var rentalIncomeEl = document.getElementById('stg-rental-income');
  var rentalIncome   = rentalIncomeEl ? parseFloat(rentalIncomeEl.value) : SIM_RENTAL_INCOME;
  var retireExp      = parseInt(_rdv('stg-retire-exp'), 10);
  var user1NameEl    = document.getElementById('stg-user1-name');
  var user1Name      = (user1NameEl && user1NameEl.value.trim()) ? user1NameEl.value.trim() : SIM_USER1_NAME;
  var user2NameEl    = document.getElementById('stg-user2-name');
  var user2Name      = (user2NameEl && user2NameEl.value.trim()) ? user2NameEl.value.trim() : SIM_USER2_NAME;
  var user1BirthEl   = document.getElementById('stg-user1-birth');
  var user1Birth     = (user1BirthEl && user1BirthEl.value) ? user1BirthEl.value : SIM_USER1_BIRTH; // v169.2: fall back to global when blank (privacy mode)
  var user2BirthEl   = document.getElementById('stg-user2-birth');
  var user2Birth     = (user2BirthEl && user2BirthEl.value) ? user2BirthEl.value : SIM_USER2_BIRTH; // v169.2: fall back to global when blank

  // Validate — fallback to current global if input is NaN
  if (isNaN(retireRoy))      retireRoy      = SIM_RETIREMENT_AGE_ROY;
  if (isNaN(retireYael))     retireYael     = SIM_RETIREMENT_AGE_YAEL;
  if (isNaN(invRate))        invRate        = SIM_RATE;
  if (isNaN(pensionRate))    pensionRate    = SIM_PENSION_RATE;
  if (isNaN(inflation))      inflation      = SIM_INFLATION;
  if (isNaN(reGrowth))       reGrowth       = SIM_RE_GROWTH_RATE;
  if (isNaN(pensionMonthly)) pensionMonthly = SIM_PENSION_MONTHLY;
  if (isNaN(instructorSal))  instructorSal  = SIM_INSTRUCTOR_SAL;
  if (isNaN(capitalTax))     capitalTax     = SIM_CAPITAL_TAX;
  if (isNaN(pensionAcc))     pensionAcc     = SIM_PENSION_ACC;
  if (isNaN(rentalIncome))   rentalIncome   = SIM_RENTAL_INCOME;
  if (isNaN(retireExp) || retireExp === 0) retireExp = SIM_RETIRE_EXP; // v169.2: 0 = blank privacy field → keep global

  // Update global variables
  SIM_RETIREMENT_AGE_ROY  = retireRoy;
  SIM_RETIREMENT_AGE_YAEL = retireYael;
  SIM_RATE                = invRate;
  SIM_PENSION_RATE        = pensionRate;
  SIM_INFLATION           = inflation;
  SIM_RE_GROWTH_RATE      = reGrowth;
  SIM_PENSION_MONTHLY     = pensionMonthly;
  SIM_INSTRUCTOR_SAL      = instructorSal;
  SIM_CAPITAL_TAX         = capitalTax;
  SIM_PENSION_ACC         = pensionAcc;
  SIM_RENTAL_INCOME       = rentalIncome;
  SIM_RETIRE_EXP          = retireExp;
  SIM_USER1_NAME          = user1Name;
  SIM_USER2_NAME          = user2Name;
  SIM_USER1_BIRTH         = user1Birth;
  SIM_USER2_BIRTH         = user2Birth;
  // v128.0: sync birth years + recalculate ALL phase boundaries
  syncBirthYearsFromSettings();

  // v156.0: push updated globals into simulator slider DOM immediately
  syncSettingsToSliders();

  // Persist to localStorage
  localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify({
    retireRoy:      retireRoy,
    retireYael:     retireYael,
    invRate:        invRate,
    pensionRate:    pensionRate,
    inflation:      inflation,
    reGrowth:       reGrowth,
    pensionMonthly: pensionMonthly,
    instructorSal:  instructorSal,
    capitalTax:     capitalTax,
    pensionAcc:     pensionAcc,
    rentalIncome:   rentalIncome,
    retireExp:      retireExp,
    user1Name:        user1Name,
    user2Name:        user2Name,
    user1Birth:       user1Birth,
    user2Birth:       user2Birth,
  }));

  // v120.0: Show success feedback; keep button disabled after save (dirty-state logic)
  var btn = document.querySelector('.settings-save-btn');
  var note = document.querySelector('.settings-save-note');
  if (btn) { btn.textContent = '✅ נשמר!'; btn.disabled = true; }
  if (note) note.textContent = 'ההגדרות נשמרו בהצלחה — החישובים עודכנו.';
  setTimeout(function() {
    if (btn) { btn.textContent = '💾 שמור הגדרות'; /* stays disabled until next change */ }
    if (note) note.textContent = '';
  }, 2500);

  applyUserNames();

  // Force re-render: simulator + overview mini + pension cards
  if (typeof simRenderChart === 'function' && typeof simRunEngine === 'function') {
    simRenderChart(simRunEngine());
  }
  if (typeof ovRenderSimMini === 'function') ovRenderSimMini();
  if (typeof ovRenderPensionCards === 'function') ovRenderPensionCards();
  if (typeof ovRenderKPIs === 'function') ovRenderKPIs();
}

// v125.0 / v126.0: Apply user names to all dynamic labels across the dashboard
function applyUserNames() {
  // Simulator view buttons
  var btnRoy = document.getElementById('sim-btn-roy');
  var btnYael = document.getElementById('sim-btn-yael');
  if (btnRoy)  btnRoy.textContent  = SIM_USER1_NAME;
  if (btnYael) btnYael.textContent = SIM_USER2_NAME;

  // Pension view select options
  var pnsSelect = document.getElementById('pns-view-select');
  if (pnsSelect && pnsSelect.options.length >= 2) {
    pnsSelect.options[0].textContent = SIM_USER1_NAME;
    pnsSelect.options[1].textContent = SIM_USER2_NAME;
  }

  // Investment view select options
  var invSelect = document.getElementById('inv-view-select');
  if (invSelect && invSelect.options.length >= 2) {
    invSelect.options[0].textContent = SIM_USER1_NAME;
    invSelect.options[1].textContent = SIM_USER2_NAME;
  }

  // v126.0 / v129.0: All labelled spans across the UI (settings tab + modal)
  var spans1 = [
    'display-user1-name-retire',
    'display-user1-name-charts',
    'display-user1-name-tbl',
    'display-user1-name-birth',
    'modal-display-user1-name'   // v129.0: modal label
  ];
  var spans2 = [
    'display-user2-name-retire',
    'display-user2-name-charts',
    'display-user2-name-birth',
    'modal-display-user2-name'   // v129.0: modal label
  ];
  spans1.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = SIM_USER1_NAME;
  });
  spans2.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = SIM_USER2_NAME;
  });

}

// v126.0: Calculate the calendar year of retirement given a birth date string and retirement age
// birthDateStr: 'YYYY-MM-DD' string (e.g. '1975-04-20'), retirementAge: number
// Returns the integer year, or null if birthDateStr is empty/invalid
function calculateRetirementYear(birthDateStr, retirementAge) {
  if (!birthDateStr) return null;
  var parts = birthDateStr.split('-');
  if (parts.length < 1) return null;
  var birthYear = parseInt(parts[0], 10);
  if (isNaN(birthYear)) return null;
  return birthYear + parseInt(retirementAge, 10);
}

// v127.0: Modal helpers — Simulator quick-settings
function openSettingsModal() {
  var m = document.getElementById('settings-modal');
  if (!m) return;

  // Populate modal inputs from current globals
  var todayStr = new Date().toISOString().split('T')[0];
  var fields = {
    'modal-user1-name':      SIM_USER1_NAME,
    'modal-user2-name':      SIM_USER2_NAME,
    'modal-user1-birth':     SIM_USER1_BIRTH,
    'modal-user2-birth':     SIM_USER2_BIRTH,
    'modal-retire-age-roy':  SIM_RETIREMENT_AGE_ROY,
    'modal-retire-age-yael': SIM_RETIREMENT_AGE_YAEL,
    'modal-inflation':       SIM_INFLATION,
    'modal-capital-tax':     SIM_CAPITAL_TAX
  };
  Object.keys(fields).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.value = fields[id];
      if (el.type === 'date') {
        el.setAttribute('max', todayStr);
        el.setAttribute('min', '1900-01-01');
      }
    }
  });

  // Update name labels inside the modal
  var lbl1 = document.getElementById('modal-display-user1-name');
  var lbl2 = document.getElementById('modal-display-user2-name');
  if (lbl1) lbl1.textContent = SIM_USER1_NAME;
  if (lbl2) lbl2.textContent = SIM_USER2_NAME;

  // v137.0: populate default view dropdown
  var defViewEl = document.getElementById('setting-default-view');
  if (defViewEl) defViewEl.value = SIM_DEFAULT_ZOOM || 'full';

  // Clear any previous save note
  var note = document.getElementById('modal-save-note');
  if (note) note.textContent = '';

  m.classList.add('open');
}

function closeSettingsModal(e) {
  if (e && e.target !== document.getElementById('settings-modal')) return;
  var m = document.getElementById('settings-modal');
  if (m) m.classList.remove('open');
}

// v127.0: Save from modal — updates globals, syncs main settings tab, re-renders simulator
function saveModalSettings() {
  // Read modal inputs
  var user1Name     = (document.getElementById('modal-user1-name')      || {}).value;
  var user2Name     = (document.getElementById('modal-user2-name')      || {}).value;
  var user1Birth    = (document.getElementById('modal-user1-birth')     || {}).value || '';
  var user2Birth    = (document.getElementById('modal-user2-birth')     || {}).value || '';
  var retireRoy     = parseInt((document.getElementById('modal-retire-age-roy')  || {}).value,  10);
  var retireYael    = parseInt((document.getElementById('modal-retire-age-yael') || {}).value, 10);
  var inflation     = parseFloat((document.getElementById('modal-inflation')     || {}).value);
  var capitalTax    = parseFloat((document.getElementById('modal-capital-tax')   || {}).value);
  // v137.0: default view preference
  var defViewEl     = document.getElementById('setting-default-view');
  var defaultZoom   = defViewEl ? (defViewEl.value || 'full') : 'full';
  if (['full','retirement','decade'].indexOf(defaultZoom) < 0) defaultZoom = 'full';

  // Fallbacks
  if (!user1Name || !user1Name.trim()) user1Name = SIM_USER1_NAME;
  if (!user2Name || !user2Name.trim()) user2Name = SIM_USER2_NAME;
  user1Name = user1Name.trim();
  user2Name = user2Name.trim();
  if (isNaN(retireRoy))  retireRoy  = SIM_RETIREMENT_AGE_ROY;
  if (isNaN(retireYael)) retireYael = SIM_RETIREMENT_AGE_YAEL;
  if (isNaN(inflation))  inflation  = SIM_INFLATION;
  if (isNaN(capitalTax)) capitalTax = SIM_CAPITAL_TAX;

  // Update globals
  SIM_USER1_NAME          = user1Name;
  SIM_USER2_NAME          = user2Name;
  SIM_USER1_BIRTH         = user1Birth;
  SIM_USER2_BIRTH         = user2Birth;
  SIM_RETIREMENT_AGE_ROY  = retireRoy;
  SIM_RETIREMENT_AGE_YAEL = retireYael;
  SIM_INFLATION           = inflation;
  SIM_CAPITAL_TAX         = capitalTax;
  // v137.0: save default zoom preference
  SIM_DEFAULT_ZOOM        = defaultZoom;

  // v128.0: sync birth years + recalculate ALL phase boundaries
  syncBirthYearsFromSettings();

  // Sync main Settings tab inputs
  var syncMap = {
    'stg-user1-name':      user1Name,
    'stg-user2-name':      user2Name,
    'stg-user1-birth':     user1Birth,
    'stg-user2-birth':     user2Birth,
    'stg-retire-age-roy':  retireRoy,
    'stg-retire-age-yael': retireYael,
    'stg-inflation':       inflation,
    'stg-inflation-macro': inflation,
    'stg-capital-tax':     capitalTax
  };
  Object.keys(syncMap).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = syncMap[id];
  });

  // Persist full settings to localStorage (merge with existing)
  var raw = localStorage.getItem(SETTINGS_LS_KEY);
  var s = {};
  if (raw) { try { s = JSON.parse(raw); } catch(e) { s = {}; } }
  s.user1Name   = user1Name;
  s.user2Name   = user2Name;
  s.user1Birth  = user1Birth;
  s.user2Birth  = user2Birth;
  s.retireRoy   = retireRoy;
  s.retireYael  = retireYael;
  s.inflation   = inflation;
  s.capitalTax  = capitalTax;
  s.defaultZoom = defaultZoom; // v137.0
  localStorage.setItem(SETTINGS_LS_KEY, JSON.stringify(s));

  // Apply name labels everywhere
  applyUserNames();

  // Re-render simulator + overview
  if (typeof simRenderChart === 'function' && typeof simRunEngine === 'function') {
    simRenderChart(simRunEngine());
  }
  if (typeof ovRenderSimMini === 'function') ovRenderSimMini();
  if (typeof ovRenderPensionCards === 'function') ovRenderPensionCards();
  if (typeof ovRenderKPIs === 'function') ovRenderKPIs();

  // Show confirmation in modal
  var note = document.getElementById('modal-save-note');
  var btn  = document.querySelector('.modal-save-btn');
  if (btn) { btn.textContent = '✅ נשמר!'; }
  if (note) note.textContent = 'הגרף עודכן';
  setTimeout(function() {
    if (btn) btn.textContent = '💾 שמור ועדכן';
    if (note) note.textContent = '';
  }, 2200);
}

// =============================================
// v167.8: DEMO MODE — rewritten for clean chart rendering
// =============================================
// v168.115: apply Dan-specific slider values after simInit (isolated from Roy's settings)
// Called both when simulator is already open AND from simInit when isDemoMode is true
function _demoForceDanSliders() {
  if (!isDemoMode) return;
  SIM_PENSION_MONTHLY = 25000;
  SIM_TARGET_EXP      = DEMO_DEFAULTS.retireExp; // v169.7: from DEMO_DEFAULTS, not hardcoded
  // DOM sliders
  var _ids = {
    'sim-pension-monthly-slider': 25000, 'sim-pension-monthly-num': 25000,
    'sim-exp-slider': 20000,             'sim-exp-num': 20000
  };
  Object.keys(_ids).forEach(function(id) { var e = document.getElementById(id); if (e) e.value = _ids[id]; });
  var _ev = document.getElementById('sim-exp-val');
  if (_ev) _ev.textContent = '20,000 ₪';
  // Activate decade zoom button (2026-2036)
  var _demoNowY = new Date().getFullYear();
  SIM_ZOOM = 'decade';
  SIM_ZOOM_CUSTOM.decStart = _demoNowY;
  SIM_ZOOM_CUSTOM.decEnd   = _demoNowY + 10;
  ['full','retirement','decade'].forEach(function(m) {
    var b = document.getElementById('sim-zoom-' + m);
    if (!b) return;
    b.style.background = (m === 'decade') ? '#3b82f6' : 'rgba(0,0,0,0.05)';
    b.style.color      = (m === 'decade') ? 'white'   : '#374151';
    b.style.borderColor= (m === 'decade') ? '#3b82f6' : 'rgba(0,0,0,0.18)';
  });
  simRenderKPI();
  simRenderChart(simRunEngine());
}

function loadDemoData() {
  // ── 0. Clear ALL stale state that could contaminate demo charts ──
  resetCalculationMemory(); // v168.96: wipe salary/pension/expense globals before demo profile loads
  // FUND_COL_K: Column K Excel deposits used for organic-growth subtraction
  Object.keys(FUND_COL_K).forEach(function(k){ delete FUND_COL_K[k]; });
  // PENSION_EVENTS: lump-sum events parsed from real pension Excel (never persisted → clear in-memory)
  PENSION_EVENTS.length = 0;
  // SIM_USER_EVENTS: user-added simulator events (will save empty array to localStorage below)
  SIM_USER_EVENTS.length = 0;

  // ── 1. FUNDS — base data for Jan 25 – Mar 26 (15 months), then forward-fill to LABELS.length ──
  // simGetRoyCapital() sums all non-yael, non-dira, non-pensionMonthly funds (in K)
  // RULE: do NOT duplicate funds that are also in PENSION_ASSETS accumulation
  // v166.0: arrays extended dynamically to LABELS.length so chart never drops to 0 if real data
  //         had more months (e.g. April 26 = index 15) than the hardcoded 15 demo values.
  var N = LABELS.length;
  var _demoBase = {
    // פוליסת חיסכון (harel) — savings policy, grows steadily
    'הראלמגוון-פוליסתחיסכ': [1800,1820,1845,1865,1890,1915,1940,1960,1985,2010,2035,2058,2080,2103,2125],
    // קרן השתלמות (hishtalmut) — education fund, main savings vehicle
    'מיטבקהש912-443286':    [2400,2428,2457,2487,2518,2550,2582,2615,2649,2683,2718,2754,2790,2827,2864],
    // קופת גמל (gemel) — pension-type savings
    'מורגמל1375900':        [820,830,840,851,862,874,886,898,911,924,937,951,965,979,993],
    // דירה (dira) — apartment, constant
    'דירה':                 [2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800,2800],
    // מזומן (mezuman) — cash / checking account
    'מזומןשקלי':            [280,295,308,322,337,350,364,379,395,410,426,442,458,475,492],
  };
  Object.keys(FUNDS).forEach(function(key) {
    if (_demoBase[key]) {
      var arr = _demoBase[key].slice(); // copy 15 base values
      // v166.0: forward-fill with gentle growth for any LABELS months beyond Mar 26 (index 14)
      var growthRate = (key === 'דירה') ? 1 : 1.008; // flat for real-estate, ~0.8%/mo for savings
      while (arr.length < N) {
        arr.push(Math.round(arr[arr.length - 1] * growthRate));
      }
      FUNDS[key].data = arr;
    } else {
      FUNDS[key].data = new Array(N).fill(null);
    }
  });
  // v167.1: explicit real-estate override — ensures 2800K (2.8M NIS) regardless of base array
  if (FUNDS['דירה']) FUNDS['דירה'].data = new Array(N).fill(2800);

  rebuildInvTotals();
  ALL_TOTALS.length = 0;
  LABELS.forEach(function(_, i) {
    var t = 0;
    Object.keys(CAT_TOTALS).forEach(function(cat) {
      t += cat === 'chov' ? -(CAT_TOTALS[cat][i]||0) : (CAT_TOTALS[cat][i]||0);
    });
    ALL_TOTALS.push(t);
  });
  CAT_CHART_TOTALS = buildCatChartTotals();
  winStart = Math.max(0, LABELS.length - WINDOW);

  // ── 2. CF data — 2025 (historical) + 2026 full year + 2027 full year ──
  // CRITICAL: vals are in THOUSANDS of NIS (simGetCurrentSalary() multiplies val*1000)
  //   salary: 35 → 35,000 NIS/month | total_exp: 22 → 22,000 NIS/month
  // v166.0: include ALL 12 months of 2026 + 2027 so cashflow bar chart shows full projected year
  //   ovRenderCashflowChart filters CF_DATA by year===curYear (2026) → needs 12 bars, not just 3
  function _cfRow(yr, mo, lbl) {
    var mid = yr + '-' + (mo < 10 ? '0' : '') + mo;
    return {
      year: yr, month: mo, monthId: mid, label: lbl,
      rows: {
        salary:       { val: 35,   note: 'משכורת (דמו)' },
        rent_income:  { val: 4.5,  note: 'שכ"ד (דמו)' },
        other_income: { val: 0 },
        visa:         { val: 12,   note: 'ויזה (דמו)' },
        cash_exp:     { val: 10,   note: 'מזומן (דמו)' },
        total_exp:    { val: 22 }
      }
    };
  }
  var _cfLbls = ['','ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
  var _demoNowY = new Date().getFullYear();
  var _demoPrevY = _demoNowY - 1;
  CF_DATA = [];
  // Previous year: 12 historical months
  for (var _m = 1; _m <= 12; _m++) { CF_DATA.push(_cfRow(_demoPrevY, _m, _cfLbls[_m] + ' ' + String(_demoPrevY).slice(2))); }
  // Current year: all 12 months (historical + projected)
  for (var _m = 1; _m <= 12; _m++) { CF_DATA.push(_cfRow(_demoNowY, _m, _cfLbls[_m] + ' ' + String(_demoNowY).slice(2))); }
  CF_CURRENT_MONTH_ID = typeof cfGetDefaultMonthId === 'function'
    ? (cfGetDefaultMonthId(CF_DATA) || (_demoNowY + '-' + (new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : String(new Date().getMonth() + 1))))
    : (_demoNowY + '-04');

  // ── 3. Pension — ONE policy (הפניקס pension ONLY, no overlap with FUNDS) ──
  // accumulation in full NIS → simulator divides by 1000 to get K
  // lastPremium in NIS/month → monthly Phoenix premium deducted pre-retirement
  // expectedPension in NIS/month → monthly pension income post-retirement
  PENSION_ASSETS = [
    {
      id: 'demo-phoenix-pension',
      provider: 'הפניקס', policyType: 'ביטוח מנהלים', policyId: '',
      accumulation: 1600000,   // 1.6M NIS → 1600K in simulator (royPhoenixCap)
      expectedPension: 15500,  // v168.115: NIS/month — raised so הפניקס+אלטשולר sum to 25K target
      currentPension: 0,
      lastPremium: 2800,       // NIS/month current monthly contribution
      realEstateIncome: 0,
      owner: 'רועי', isRisk: false,
      isPendingReview: false, mainPurpose: 'פנסיה'
    }
  ];
  // v167.1: second pension — push to avoid overwriting הפניקס
  PENSION_ASSETS.push({
    id: 'demo-altschuler-pension',
    name: 'אלטשולר - פנסיה',
    provider: 'אלטשולר', policyType: 'פנסיה', policyId: '',
    accumulation: 850000,    // 850K NIS
    expectedPension: 9500,   // v168.115: NIS/month — raised so הפניקס+אלטשולר sum to 25K target
    currentPension: 0,
    lastPremium: 1500,       // NIS/month current monthly contribution
    realEstateIncome: 0,
    owner: 'רועי', isRisk: false,
    isPendingReview: false, mainPurpose: 'פנסיה'
  });

  // ── 4. Persist events + demo flag only (v169.5: NEVER overwrite real Excel LS keys with demo data) ──
  // _dashSaveAssets/CF/Pension intentionally NOT called — demo data lives in memory only.
  // This guarantees Demo→Excel switches restore Roy's untouched real data.
  _simSaveUserEvents(); // saves empty SIM_USER_EVENTS to localStorage
  try { localStorage.setItem('_dash_is_demo', '1'); } catch(e) {} // flag so reload clears ghost

  // ── 5. Override simulator labels + anonymize users (v167.2/v167.3) ──
  SIM_PENSION_FUND_NAME = 'הפניקס';
  SIM_SAVINGS_FUND_NAME = 'אלטשולר - פנסיה';
  SIM_USER1_NAME    = 'דן';
  SIM_USER2_NAME    = 'דינה';
  SIM_USER1_BIRTH   = '1975-01-01';
  SIM_USER2_BIRTH   = '1978-05-15';
  SIM_BIRTH_YEAR_ROY  = 1975;
  SIM_BIRTH_YEAR_YAEL = 1978;
  userCurrentAge = new Date().getFullYear() - 1975;
  // v167.5: recompute ALL phase boundaries (P2/P3/END) from the demo birth years so the
  // simulator X-axis and retirement line reflect Dan (1975) not the real user's age
  syncBirthYearsFromSettings();
  if (typeof applyUserNames === 'function') applyUserNames(); // v167.4: update all name spans immediately

  // v169.5: demo names shown in DOM only — NOT written to SETTINGS_LS_KEY (prevents Settings contamination)
  // When switching Demo→Excel, loadSettings() reads Roy's untouched settings, not Dan's.
  (function() {
    var _domMap = { 'stg-user1-name':'דן', 'stg-user2-name':'דינה', 'stg-user1-birth':'1975-01-01', 'stg-user2-birth':'1978-05-15' };
    Object.keys(_domMap).forEach(function(id) { var el = document.getElementById(id); if (el) el.value = _domMap[id]; });
  })();

  // v167.3: force cashflow UI to current month so sandbox validation is correct from the start
  cfInited = false;
  if (typeof cfSandboxInitDefaults === 'function') cfSandboxInitDefaults();

  // ── 6. Force all retirement phase boundaries for demo users (v167.8) ──
  // Explicitly override every variable the engine loop uses for phase transitions.
  // Do NOT rely on syncBirthYearsFromSettings() alone — localStorage settings may
  // carry the real user's retirement ages (e.g. retireYael=66 → 1963+66=2029).
  SIM_RETIREMENT_AGE_ROY  = 67;  // Dan retires at 67
  SIM_RETIREMENT_AGE_YAEL = 64;  // Dina / phase-2 transition age
  SIM_P2_START.y = 1975 + SIM_RETIREMENT_AGE_YAEL; // 2039 — Dan's instructor phase start
  SIM_P2_START.m = 9;
  SIM_P3_START.y = 1975 + SIM_RETIREMENT_AGE_ROY;  // 2042 — Dan's full retirement
  SIM_P3_START.m = 9;
  SIM_END.y      = 1975 + 95;  // 2070 — simulation end cap
  // Sync zoom-range custom overrides to the retirement year (for retirement zoom button)
  SIM_ZOOM_CUSTOM.retStart = SIM_P3_START.y;
  SIM_ZOOM_CUSTOM.retEnd   = SIM_P3_START.y + 4;

  // v168.115: demo default view = decade zoom from today (2026–2036) — forward-looking launch
  var _demoNowY = new Date().getFullYear();
  SIM_ZOOM = 'decade';
  SIM_ZOOM_CUSTOM.decStart = _demoNowY;       // 2026
  SIM_ZOOM_CUSTOM.decEnd   = _demoNowY + 10;  // 2036

  // v169.7: Dan-specific slider defaults — strictly from DEMO_DEFAULTS, never from Roy's object
  SIM_RETIRE_EXP      = DEMO_DEFAULTS.retireExp;   // 20000 for Dan — NOT Roy's 29K
  SIM_TARGET_EXP      = DEMO_DEFAULTS.retireExp;   // sync immediately so engine uses correct value
  SIM_PENSION_MONTHLY = 25000;  // pre-set before simInit so first KPI render shows correct income

  // v168.117: set isDemoMode BEFORE any simInit call — _demoForceDanSliders() guards on this flag
  // CRITICAL: must be before switchTab/simInit or _demoForceDanSliders exits early (isDemoMode=false)
  isDemoMode = true;
  APP_MODE = 'DEMO'; // v169.1: keep APP_MODE in sync
  document.body.classList.add('demo-mode');
  if (typeof _updateModeSelectorUI === 'function') _updateModeSelectorUI('DEMO');
  var _editBtnDemo = document.getElementById('sim-edit-data-btn');
  if (_editBtnDemo) _editBtnDemo.style.display = 'none'; // v169.1: hide in demo mode

  // ── Bulletproof simulator chart reset (v167.7) ──
  if (simChartObj) { try { simChartObj.destroy(); } catch(e) {} simChartObj = null; }
  simInited = false; // force full re-init (new birth years → new phase boundaries → new X-axis)

  // ── 6. Trigger init flow (mirrors DOMContentLoaded success path) ──
  document.querySelectorAll('th[data-col]').forEach(function(th) {
    var col = parseInt(th.getAttribute('data-col'));
    if (col >= 0 && col < LABELS.length) th.textContent = LABELS[col];
  });
  updateTableCells();
  updateDynamicStats();
  updateNavButtons();
  selectView(currentView || 'all');

  pensionInited = false;
  var _sldr = document.getElementById('pns-tax-slider');
  if (typeof pensionSliderChange === 'function') pensionSliderChange(_sldr ? _sldr.value : '35');

  // v169.2: DEMO navigates to Overview (not Simulator directly); sim inits in background
  switchTab('overview');

  // Init simulator data in background so overview mini-sim and sim tab are both ready
  setTimeout(function() {
    if (!simInited) { simInited = true; simInit(); }
    // Re-render overview with full sim data after simInit completes
    setTimeout(function() {
      if (typeof overviewRender === 'function') {
        if (!overviewInited) overviewInited = true;
        overviewRender();
      }
    }, 250);
  }, 150);

  showToast('✅ נטענו נתוני דמו — ניתן להציג בפני כולם', '#22c55e', 5000);
}

// =============================================
// v166.0: CLEAR DATA / LOGOUT
// =============================================
function clearDashboardData() {
  if (!confirm('האם למחוק את כל הנתונים ולחזור למסך הפתיחה?\nפעולה זו אינה ניתנת לביטול.')) return;
  isDemoMode = false; // v168.12
  APP_MODE = 'EXCEL'; // v169.1: reset mode
  try { sessionStorage.removeItem('hasUploadedFiles'); } catch(e) {} // v169.6: clear session upload flag
  document.body.classList.remove('demo-mode');
  localStorage.clear();
  location.reload();
}

// =============================================
// v169.2: FLOATING TOAST — replaces header excel-status
// =============================================
(function() {
  var _toastTimer = null;
  window.showToast = function(msg, bgColor, duration) {
    var t = document.getElementById('upload-toast');
    if (!t) return;
    clearTimeout(_toastTimer);
    t.textContent = msg;
    t.style.background = bgColor || '#10b981';
    t.classList.add('toast-visible');
    _toastTimer = setTimeout(function() {
      t.classList.remove('toast-visible');
      setTimeout(function() { if (t.textContent === msg) t.textContent = ''; }, 300);
    }, duration || 5000);
  };
})();

// =============================================
// v169.2: PRIVACY SHIELD — blank personal fields until data loaded
// =============================================
function _clearPrivacyFields() {
  ['stg-user1-name','stg-user2-name','stg-user1-birth','stg-user2-birth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  var retEl = document.getElementById('stg-retire-exp');
  if (retEl) retEl.value = '';
}

// =============================================
// v169.2: CLEAR APP STATE — wipe KPI displays when switching modes
// =============================================
function clearAppState() {
  // Zero all header KPI value elements
  ['ov-hdr-profit','ov-hdr-invest','ov-hdr-pension','ov-hdr-wealth',
   'sim-hdr-wealth-at-age','sim-hdr-total-accum','sim-hdr-monthly-accum','sim-hdr-monthly-income',
   'cf-hdr-income','cf-hdr-exp','cf-hdr-net','cf-hdr-pl'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '—';
  });
  // Zero overview card values
  ['ov-hdr-profit','ov-hdr-invest','ov-hdr-pension','ov-hdr-wealth'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '—';
  });
}

// =============================================
// v169.1: GLOBAL MODE SELECTOR — 3-world navigation
// =============================================

// v170.1: navigate to profile section in the wide Command Center modal
function _ffsOpenStageA() {
  if (typeof ffsNavTo === 'function') { ffsNavTo('profile'); return; }
  // Legacy fallback (unreachable in v170.1+)
  ['investments', 'realEstate', 'pension'].forEach(function(name) {
    var body  = document.getElementById('ffs-acc-body-' + name);
    var arrow = document.getElementById('ffs-acc-arrow-' + name);
    if (body)  body.style.display = 'none';
    if (arrow) arrow.textContent = '▼';
  });
  var profileBody  = document.getElementById('ffs-acc-body-profile');
  var profileArrow = document.getElementById('ffs-acc-arrow-profile');
  if (profileBody)  profileBody.style.display = 'block';
  if (profileArrow) profileArrow.textContent = '▲';
}

// Update mode selector UI — highlight active button + update source label
// v169.7: mode=null → no button active, shows "בחר מקור נתונים" placeholder
function _updateModeSelectorUI(mode) {
  ['excel', 'demo', 'simulator', 'blank'].forEach(function(m) {
    var btn = document.getElementById('mode-btn-' + m);
    if (btn) btn.classList.toggle('active', !!mode && m === mode.toLowerCase());
  });
  var labels = { EXCEL: 'אקסל', DEMO: 'דמו (דן ודינה)', SIMULATOR: 'סימולטור אישי', BLANK: 'דף חלק' };
  var lbl = document.getElementById('mode-source-label');
  if (lbl) lbl.textContent = mode ? ('מקור נתונים: ' + (labels[mode] || mode)) : 'בחר מקור נתונים';
  // v169.7: Mode 0 — show/hide overview placeholder
  var _ph = document.getElementById('ov-mode0-placeholder');
  var _gr = document.getElementById('ov-grid-main');
  if (_ph) _ph.style.display = mode ? 'none' : 'flex';
  if (_gr) _gr.style.display = mode ? 'grid' : 'none'; // v170.2: explicit 'grid' (not '' which can fall back wrong)
}

// =============================================
// v169.6: FORMAL NULL STATE — defines exactly what "clean slate" means for every world
// =============================================
var INITIAL_NULL_STATE = {
  cfData:        [],      // no cashflow rows
  pensionAssets: [],      // no pension policies
  simResult:     null,    // no engine output cache
  ovWealth:      null,    // no overview wealth cache
  userName1:     '',      // no names
  userName2:     '',
  userBirth1:    '',      // no birth dates
  userBirth2:    '',
};

// v169.6: Formal API — every mode transition that needs a blank state calls this.
// It wraps absoluteInternalReset() so future code always has a single named entry point.
function setAppState(nullState) {
  // nullState is for documentation/future use; action is always a full wipe
  absoluteInternalReset();
}

// =============================================
// v169.4: ABSOLUTE INTERNAL RESET — called first in every mode switch
// Guarantees zero cross-contamination between EXCEL / DEMO / SIMULATOR worlds.
// =============================================
function absoluteInternalReset() {
  // ── 1. Wipe simulation engine cache ──
  SIM_LAST_RESULT  = null;
  OV_CACHED_WEALTH = null;

  // ── 2. Clear all header KPIs immediately ──
  clearAppState();

  // ── 3. Destroy ALL chart objects + clear canvas pixels (v169.5: "nuclear option") ──
  var _killChart = function(obj) { if (obj) { try { obj.destroy(); } catch(e) {} } };
  if (typeof simChartObj !== 'undefined')     { _killChart(simChartObj);     simChartObj     = null; }
  if (typeof ovCFChart !== 'undefined')       { _killChart(ovCFChart);       ovCFChart       = null; }
  if (typeof ovInvChart !== 'undefined')      { _killChart(ovInvChart);      ovInvChart      = null; }
  if (typeof ovSimMiniChart !== 'undefined')  { _killChart(ovSimMiniChart);  ovSimMiniChart  = null; }
  if (typeof cfChartInstance !== 'undefined') { _killChart(cfChartInstance); cfChartInstance = null; }
  // Clear residual canvas pixels (Chart.js destroy() leaves faded image)
  ['ov-cf-chart','ov-inv-chart','ov-sim-chart','sim-chart'].forEach(function(cid) {
    var cv = document.getElementById(cid);
    if (cv) { var cx = cv.getContext('2d'); if (cx) cx.clearRect(0, 0, cv.width, cv.height); cv.style.display = 'none'; }
  });
  // Show "no data" empty states for overview cards
  ['ov-cf-empty','ov-inv-empty','ov-sim-empty'].forEach(function(eid) {
    var el = document.getElementById(eid);
    if (el) { el.textContent = 'יש להעלות את קבצי הנתונים להצגת התוכן'; el.style.display = 'flex'; }
  });
  // Clear pension overview content
  var _pnsContent = document.getElementById('ov-pension-content');
  if (_pnsContent) _pnsContent.innerHTML = '';
  var _simTl = document.getElementById('ov-sim-timeline');
  if (_simTl) _simTl.innerHTML = '';

  // ── 4. Reset personal / calculation globals to zero ──
  SIM_USER1_NAME  = '';
  SIM_USER2_NAME  = '';
  SIM_USER1_BIRTH = '';
  SIM_USER2_BIRTH = '';
  // v169.5: also reset birth years — prevents Roy's 1962 from bleeding into calculations
  var _genericBY = new Date().getFullYear() - 40;
  SIM_BIRTH_YEAR_ROY  = _genericBY;
  SIM_BIRTH_YEAR_YAEL = _genericBY;
  SIM_P2_START.y = _genericBY + SIM_RETIREMENT_AGE_YAEL;
  SIM_P3_START.y = _genericBY + SIM_RETIREMENT_AGE_ROY;
  SIM_END.y      = _genericBY + 95;
  if (typeof resetCalculationMemory === 'function') resetCalculationMemory();
  // v170.3/v170.4: clear mode-sourced events so they don't contaminate other modes
  if (typeof SIM_USER_EVENTS !== 'undefined') {
    for (var _evi = SIM_USER_EVENTS.length - 1; _evi >= 0; _evi--) {
      var _evSrc = SIM_USER_EVENTS[_evi].src;
      if (_evSrc === 'events_timeline' || _evSrc === 'ffs_event') SIM_USER_EVENTS.splice(_evi, 1);
    }
    try { localStorage.setItem(_SIM_EVENTS_LS_KEY, JSON.stringify(SIM_USER_EVENTS)); } catch(e) {}
  }
  pnsNetMonthly          = 0;
  pnsNetMonthlyWithHarel = 0;
  pnsNetMonthlyNoHarel   = 0;
  ovPnsDisplayNet        = 0; // v169.9: Ghost Data Exorcism — must reset to prevent stale pension value in KPI
  // v170.4: reset to 0 on every mode switch — each mode restores its own values:
  //  EXCEL: loadSettings() + line 13032 re-enforce; DEMO: loadDemoData(); SIMULATOR: ffsApplyToSimulator()
  SIM_RETIRE_EXP     = 0;
  SIM_INSTRUCTOR_SAL = 0;
  SIM_RENTAL_INCOME  = 0;

  // ── 5. Clear FFS profile to blank template (no Roy/Dan data) ──
  FFS_PROFILE.name                 = '';
  FFS_PROFILE.birthDate            = '';
  FFS_PROFILE.retirementAge        = 67;
  FFS_PROFILE.lifeExpectancy       = 84;
  FFS_PROFILE.monthlySavings       = 0;
  FFS_PROFILE.savingsGrowth        = 0;
  FFS_PROFILE.retirementExpense    = 0;
  FFS_PROFILE.retirementIncome     = 0;
  FFS_PROFILE.bridgeAge            = '';
  FFS_PROFILE.bridgeCashflow       = 0;
  FFS_PROFILE.bridgePensionContrib = false;
  FFS_PROFILE.investments          = [];
  FFS_PROFILE.pension              = [];
  FFS_PROFILE.realEstate           = [];
  FFS_PROFILE.incomePhases         = []; // v170.2

  // ── 6. Clear settings UI personal fields ──
  _clearPrivacyFields();

  // ── 7. Immediately show "אורח" — name label is the FIRST visible update ──
  var _nlbl = document.getElementById('sim-active-name-text');
  if (_nlbl) _nlbl.textContent = 'מציג: אורח';
  var _dtitle = document.getElementById('ffs-drawer-title');
  if (_dtitle) _dtitle.textContent = '👤 מציג: אורח';

  // ── 8. Force all tab re-init — each mode re-bootstraps its own tabs ──
  simInited      = false;
  overviewInited = false;
  cfInited       = false;
  pensionInited  = false;

  // ── 9. Reset demo mode flags ──
  isDemoMode = false;
  document.body.classList.remove('demo-mode');
  try { localStorage.removeItem('_dash_is_demo'); } catch(e) {}

  // ── 10. v169.6: STEEL WALL — clear ALL in-memory chart/calc data arrays ──
  // Without this, Demo→Excel contamination persists when _dashRestore* returns false
  CF_DATA.length = 0;
  PENSION_ASSETS.length = 0;
  // ALL_TOTALS is a const — must zero in-place (cannot reassign)
  for (var _sw = 0; _sw < ALL_TOTALS.length; _sw++) ALL_TOTALS[_sw] = 0;
  // Null-fill each fund's data array in-place (FUNDS is a const too)
  Object.keys(FUNDS).forEach(function(k) {
    var f = FUNDS[k];
    if (f && Array.isArray(f.data)) {
      for (var _sj = 0; _sj < f.data.length; _sj++) f.data[_sj] = null;
    }
  });
  // Rebuild CAT_TOTALS from now-empty FUNDS (empties all category arrays)
  Object.keys(CAT_TOTALS).forEach(function(k) { CAT_TOTALS[k].length = 0; });
  // Clear session upload flag — each mode must re-earn it
  try { sessionStorage.removeItem('hasUploadedFiles'); } catch(e) {}
}

// Central mode switch — handles all 3 worlds with zero-contamination guarantee
function switchMode(mode) {
  var prev = APP_MODE;

  // v169.4: smart SIMULATOR guard — only warn if profile has actual data (not empty slate)
  if (prev === 'SIMULATOR' && mode !== 'SIMULATOR') {
    var _simHasData = !!(
      FFS_PROFILE.name || FFS_PROFILE.birthDate ||
      (FFS_PROFILE.investments && FFS_PROFILE.investments.length > 0) ||
      (FFS_PROFILE.pension     && FFS_PROFILE.pension.length     > 0) ||
      (FFS_PROFILE.realEstate  && FFS_PROFILE.realEstate.length  > 0)
    );
    if (_simHasData) {
      if (!confirm('שים לב: מעבר מצב ינקה את תצוגת הסימולטור. וודא ששמרת את הנתונים אם ברצונך לחזור אליהם מאוחר יותר. להמשיך?')) {
        _updateModeSelectorUI('SIMULATOR');
        return;
      }
    }
  }

  // v170.5: BLANK mode guard — intercept BEFORE reset; modal handles the actual switch
  if (mode === 'BLANK') {
    _updateModeSelectorUI(prev || 'SIMULATOR');
    var _bsModal = document.getElementById('blank-slate-modal');
    if (_bsModal) {
      _bsModal.style.display = 'flex';
      setTimeout(function() {
        var _cancelBtn = document.getElementById('blank-slate-cancel-btn');
        if (_cancelBtn) _cancelBtn.focus();
      }, 50);
    }
    return;
  }

  // v170.3: hide clean-slate cover on every mode switch (will re-show if mode===BLANK)
  var _csCover = document.getElementById('clean-slate-cover');
  if (_csCover) _csCover.style.display = 'none';

  // v169.4: IRON DOME — absolute reset is the FIRST action after all guards pass
  absoluteInternalReset();

  APP_MODE = mode;
  _updateModeSelectorUI(mode);

  var editBtn = document.getElementById('sim-edit-data-btn');
  if (editBtn) editBtn.style.display = 'none';

  // ── DEMO mode ──
  if (mode === 'DEMO') {
    loadDemoData(); // loads Dan/Dina data, sets isDemoMode=true, switches to overview
    return;
  }

  // ── EXCEL mode ──
  if (mode === 'EXCEL') {
    isDemoMode = false;
    // Restore real Excel data from localStorage (each restore returns false if key missing)
    var _assetOk = _dashRestoreAssets();
    var _cfOk    = _dashRestoreCF();
    var _pnsOk   = _dashRestorePension();
    var _hasExcelData = _assetOk || _cfOk || _pnsOk;
    // v169.6: re-earn the session upload flag if real data was successfully restored
    if (_hasExcelData) { try { sessionStorage.setItem('hasUploadedFiles', '1'); } catch(e) {} }

    if (_hasExcelData) {
      // Real data restored — rebuild investment table + lift privacy shield
      document.querySelectorAll('th[data-col]').forEach(function(th) {
        var col = parseInt(th.getAttribute('data-col'));
        if (col >= 0 && col < LABELS.length) th.textContent = LABELS[col];
      });
      if (typeof updateTableCells   === 'function') updateTableCells();
      if (typeof updateDynamicStats === 'function') updateDynamicStats();
      if (typeof updateNavButtons   === 'function') updateNavButtons();
      if (typeof selectView         === 'function') selectView(currentView || 'all');
      loadSettings(); // populates birth dates, names, rates from saved settings
      // v169.11: 29,000 lock — loadSettings may restore a stale Demo expense (20K) from localStorage
      SIM_RETIRE_EXP = ROY_DEFAULTS.retireExp; // hard re-enforce Roy's baseline after settings load
      if (typeof syncBirthYearsFromSettings === 'function') syncBirthYearsFromSettings();
      _simRestoreUserEvents(); // v170.6: restore Roy's timeline events (October 2029 retirement spike)
      var _taxSl = document.getElementById('pns-tax-slider');
      if (typeof pensionSliderChange === 'function') pensionSliderChange(_taxSl ? _taxSl.value : '35');
    } else {
      // No Excel data in localStorage — clean blank slate, no Roy/Dan fallback
      _clearPrivacyFields();
    }

    switchTab('overview');
    if (_hasExcelData) {
      setTimeout(function() {
        overviewInited = true;
        if (typeof overviewRender === 'function') overviewRender();
        // v170.6: force re-render of simulator with restored timeline events
        if (simInited && typeof simRenderChart === 'function' && typeof simRunEngine === 'function') {
          simRenderKPI();
          simRenderTimeline();
          simRenderChart(simRunEngine());
        }
      }, 200);
    }
    return;
  }

  // ── BLANK mode already intercepted above before reset — should not reach here ──

  // ── SIMULATOR mode ──
  if (mode === 'SIMULATOR') {
    isDemoMode = false;
    // Load ONLY from FINANCIAL_SIM_PERSONAL_DATA (APP_MODE is already SIMULATOR)
    ffsLoadProfile();

    var hasData = !!(
      FFS_PROFILE.name      ||
      FFS_PROFILE.birthDate ||
      (FFS_PROFILE.investments && FFS_PROFILE.investments.length > 0) ||
      (FFS_PROFILE.pension     && FFS_PROFILE.pension.length     > 0) ||
      (FFS_PROFILE.realEstate  && FFS_PROFILE.realEstate.length  > 0)
    );

    // Update name label immediately — shows saved name or "אורח" before any render
    if (typeof simUpdateNameLabel === 'function') simUpdateNameLabel();

    switchTab('simulator');

    setTimeout(function() {
      if (hasData) {
        if (editBtn) editBtn.style.display = 'flex';
        if (typeof simFullRefresh === 'function') simFullRefresh();
      } else {
        // Empty slate — render blank drawer fields, open at Stage A
        if (typeof ffsRenderAll === 'function') ffsRenderAll();
        if (typeof openFFSDrawer === 'function') openFFSDrawer();
        _ffsOpenStageA();
      }
    }, 200);
    return;
  }
}
