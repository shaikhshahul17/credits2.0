/* ── THEME ── */
const html = document.documentElement;
const themeBtn  = document.getElementById('theme-toggle');
const themeKnob = document.getElementById('theme-knob');

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  themeKnob.textContent = t === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('spendly-theme', t);
}
themeBtn.addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);
const savedTheme = localStorage.getItem('spendly-theme');
if (savedTheme) applyTheme(savedTheme);
else if (window.matchMedia('(prefers-color-scheme: light)').matches) applyTheme('light');

/* ── STORAGE ── */
const KEY = 'spendly_txns';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (a) => localStorage.setItem(KEY, JSON.stringify(a));

/* ── STATE ── */
let txns = load();
let curType = 'income';
let filter  = 'all';
const now = new Date();
let vy = now.getFullYear(), vm = now.getMonth();
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ── FORMAT ── */
const fmt = n => '₹' + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const fmtS = n => { const v=Math.abs(n); if(v>=1e5) return '₹'+(v/1e5).toFixed(1)+'L'; if(v>=1e3) return '₹'+(v/1e3).toFixed(1)+'K'; return fmt(n); };

/* ── CATEGORY DATA ── */
const COLORS = { Food:'#ff6b6b', Transport:'#feca57', Shopping:'#ff9ff3', Health:'#1de99b', Entertainment:'#54a0ff', Utilities:'#ffd97d', Rent:'#48dbfb', Salary:'#6c6bff', Freelance:'#b06bff', Other:'#8395a7' };
const ICONS  = { Food:'🍜', Transport:'🚗', Shopping:'🛍', Health:'💊', Entertainment:'🎬', Utilities:'💡', Rent:'🏠', Salary:'💼', Freelance:'💻', Other:'📦' };

/* ── MONTH FILTER ── */
const monthTxns = () => txns.filter(t => { const d=new Date(t.date); return d.getFullYear()===vy && d.getMonth()===vm; });

/* ── RENDER ── */
function render() {
  const label = `${MONTHS[vm]} ${vy}`;
  document.getElementById('cur-month-label').textContent = label;
  document.getElementById('header-month-label').textContent = label.toUpperCase();
  const mt = monthTxns();
  renderSummary(mt);
  renderRecent(mt);
  renderAll(mt);
  renderDonut(mt);
  renderBreakdown(mt);
}

function renderSummary(mt) {
  const inc = mt.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const exp = mt.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const net = inc - exp;
  document.getElementById('total-income').textContent  = fmt(inc);
  document.getElementById('total-expense').textContent = fmt(exp);
  document.getElementById('net-balance').textContent   = fmt(net);
  const ic = mt.filter(t=>t.type==='income').length;
  const ec = mt.filter(t=>t.type==='expense').length;
  document.getElementById('income-count').textContent  = ic+' transaction'+(ic!==1?'s':'');
  document.getElementById('expense-count').textContent = ec+' transaction'+(ec!==1?'s':'');
  document.getElementById('balance-note').textContent  = net>=0 ? '▲ Surplus' : '▼ Deficit';
}

function txRow(t) {
  const isInc = t.type==='income';
  const d = new Date(t.date);
  const ds = d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
  return `<div class="tx-item" data-id="${t.id}">
    <div class="tx-icon ${isInc?'income-icon':'expense-icon'}">${ICONS[t.cat]||'💸'}</div>
    <div class="tx-info">
      <div class="tx-desc">${t.desc||t.cat}</div>
      <div class="tx-meta">${t.cat} · ${ds}</div>
    </div>
    <div class="tx-right">
      <div class="tx-amount ${t.type}">${isInc?'+':'−'} ${fmt(t.amount)}</div>
    </div>
    <button class="tx-delete" data-id="${t.id}" title="Delete">✕</button>
  </div>`;
}

function renderRecent(mt) {
  const el = document.getElementById('recent-list');
  const sorted = [...mt].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,6);
  el.innerHTML = sorted.length ? sorted.map(txRow).join('') : '<div class="empty-state"><div class="es-icon">🧾</div>No transactions yet</div>';
}

function renderAll(mt) {
  const el = document.getElementById('all-list');
  let data = [...mt].sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (filter!=='all') data = data.filter(t=>t.type===filter);
  el.innerHTML = data.length ? data.map(txRow).join('') : '<div class="empty-state"><div class="es-icon">📋</div>No transactions found</div>';
}

function renderDonut(mt) {
  const exp = mt.filter(t=>t.type==='expense');
  const total = exp.reduce((s,t)=>s+t.amount,0);
  const arcs = document.getElementById('donut-arcs');
  const leg  = document.getElementById('donut-legend');
  const cen  = document.getElementById('donut-center-num');
  if (!exp.length) { arcs.innerHTML=''; leg.innerHTML='<div class="empty-state" style="padding:0;text-align:left;font-size:12px">No expenses yet</div>'; cen.textContent='—'; return; }
  const cats = {};
  exp.forEach(t=>{ cats[t.cat]=(cats[t.cat]||0)+t.amount; });
  const sorted = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const R=50,C=60,SW=18,circ=2*Math.PI*R;
  let off=0; arcs.innerHTML='';
  sorted.forEach(([cat,amt])=>{
    const pct=amt/total, dash=pct*circ;
    const a=document.createElementNS('http://www.w3.org/2000/svg','circle');
    a.setAttribute('cx',C); a.setAttribute('cy',C); a.setAttribute('r',R);
    a.setAttribute('fill','none'); a.setAttribute('stroke',COLORS[cat]||'#8395a7');
    a.setAttribute('stroke-width',SW);
    a.setAttribute('stroke-dasharray',`${dash} ${circ-dash}`);
    a.setAttribute('stroke-dashoffset',-(off*circ));
    arcs.appendChild(a); off+=pct;
  });
  cen.textContent = fmtS(total);
  leg.innerHTML = sorted.slice(0,5).map(([cat,amt])=>`
    <div class="legend-item">
      <div class="legend-dot" style="background:${COLORS[cat]||'#8395a7'}"></div>
      <span class="legend-name">${cat}</span>
      <span class="legend-pct">${Math.round(amt/total*100)}%</span>
    </div>`).join('');
}

function renderBreakdown(mt) {
  const el = document.getElementById('cat-breakdown');
  const exp = mt.filter(t=>t.type==='expense');
  const total = exp.reduce((s,t)=>s+t.amount,0);
  if (!exp.length) { el.innerHTML='<div class="empty-state"><div class="es-icon">📊</div>No expenses yet</div>'; return; }
  const cats={};
  exp.forEach(t=>{ cats[t.cat]=(cats[t.cat]||0)+t.amount; });
  el.innerHTML = Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>`
    <div>
      <div class="progress-row"><span>${ICONS[cat]||'📦'} ${cat}</span><span>${fmt(amt)}</span></div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${Math.round(amt/total*100)}%;background:${COLORS[cat]||'#8395a7'}"></div>
      </div>
    </div>`).join('');
}

/* ── ADD ── */
document.getElementById('add-transaction').addEventListener('click', () => {
  const desc   = document.getElementById('inp-desc').value.trim();
  const amount = parseFloat(document.getElementById('inp-amount').value);
  const cat    = document.getElementById('inp-cat').value;
  const date   = document.getElementById('inp-date').value;
  if (!desc)         return toast('⚠️ Add a description');
  if (!amount||amount<=0) return toast('⚠️ Enter a valid amount');
  if (!date)         return toast('⚠️ Pick a date');
  txns.push({ id:Date.now(), type:curType, desc, amount, cat, date });
  save(txns); render(); toast('✓ Transaction added');
  document.getElementById('inp-desc').value='';
  document.getElementById('inp-amount').value='';
});

/* ── TYPE TOGGLE ── */
document.getElementById('btn-income').addEventListener('click', () => {
  curType='income';
  document.getElementById('btn-income').className='active income';
  document.getElementById('btn-expense').className='expense';
});
document.getElementById('btn-expense').addEventListener('click', () => {
  curType='expense';
  document.getElementById('btn-expense').className='active expense';
  document.getElementById('btn-income').className='income';
});

/* ── MONTH NAV ── */
document.getElementById('prev-month').addEventListener('click', () => { vm--; if(vm<0){vm=11;vy--;} render(); });
document.getElementById('next-month').addEventListener('click', () => { vm++; if(vm>11){vm=0;vy++;} render(); });

/* ── FILTER ── */
document.querySelectorAll('.filter-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); filter=b.dataset.filter; renderAll(monthTxns());
  });
});

/* ── DELETE ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('.tx-delete');
  if (!btn) return;
  txns = txns.filter(t=>t.id!==parseInt(btn.dataset.id));
  save(txns); render(); toast('🗑 Removed');
});

/* ── TOAST ── */
let toastT;
function toast(msg) {
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2300);
}

/* ── INIT ── */
document.getElementById('inp-date').valueAsDate=new Date();
render();
