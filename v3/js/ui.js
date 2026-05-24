// ═══════════════════════════════════════════════
// UI HELPERS — shared DOM builders
// ═══════════════════════════════════════════════

// ── theme ─────────────────────────────────────
function setTheme(t) {
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem(TK,t);
  const btn=document.getElementById('theme-btn');
  if(btn) btn.textContent = t==='dark' ? '☀ Light' : '◑ Dark';
}
function toggleTheme() {
  setTheme(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light');
}

// ── badge ─────────────────────────────────────
function badge(k) {
  const map={concept:'b-concept',code:'b-code',quiz:'b-quiz',project:'b-project'};
  const b=document.createElement('span');
  b.className='badge '+(map[k]||'b-concept'); b.textContent=k; return b;
}

// ── checkbox ──────────────────────────────────
function makeCb(pi,di,ti) {
  const id=tid(pi,di,ti), done=!!S[id], ph=PHASES[pi];
  const cb=document.createElement('div');
  cb.className='cb'+(done?' on':''); cb.id='cb_'+id;
  cb.style.background  = done ? ph.color : '';
  cb.style.borderColor = done ? ph.color : '';
  cb.innerHTML='<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"/></svg>';
  return cb;
}

// ── task row ──────────────────────────────────
function makeTaskRow(pi,di,ti) {
  const task=PHASES[pi].data[di].tasks[ti];
  const id=tid(pi,di,ti), done=!!S[id];
  const row=document.createElement('div');
  row.className='task-row'; row.id='row_'+id;
  const cb=makeCb(pi,di,ti);
  const tx=document.createElement('div');
  tx.className='tx'+(done?' done':''); tx.id='tx_'+id;
  tx.style.color=done?'var(--sub)':'var(--text)'; tx.textContent=task.t;
  row.appendChild(cb); row.appendChild(tx); row.appendChild(badge(task.k));
  row.addEventListener('click',function(){ doTask(pi,di,ti); });
  return row;
}

// ── quiz card ─────────────────────────────────
function buildQuizCard(d) {
  const msg='Quiz me on the following topic as a senior trainer would: '+d.label+' ('+d.day+'). Ask me 3 questions one at a time and give feedback on each answer.';
  const url='https://claude.ai/new?q='+encodeURIComponent(msg);
  const card=document.createElement('div'); card.className='quiz-card';
  const hdr=document.createElement('div'); hdr.className='quiz-card-hdr';
  hdr.innerHTML='<div class="quiz-card-icon">🤖</div><span class="quiz-card-name">Quiz me on: '+d.label+'</span><span class="quiz-card-tag">AI quiz</span>';
  const prompt=document.createElement('div'); prompt.className='quiz-prompt'; prompt.textContent=msg;
  const actions=document.createElement('div'); actions.className='quiz-actions';
  const cpBtn=document.createElement('button'); cpBtn.className='quiz-btn cp';
  cpBtn.innerHTML='📋 Copy prompt';
  cpBtn.addEventListener('click',function(){
    const btn=this;
    (navigator.clipboard?navigator.clipboard.writeText(msg):Promise.reject())
      .catch(function(){ const ta=document.createElement('textarea');ta.value=msg;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta); });
    btn.innerHTML='✓ Copied!'; btn.style.color='var(--green)'; btn.style.background='rgba(0,217,160,.08)';
    setTimeout(function(){ btn.innerHTML='📋 Copy prompt'; btn.style.color=''; btn.style.background=''; },2200);
  });
  const opBtn=document.createElement('button'); opBtn.className='quiz-btn op';
  opBtn.innerHTML='↗ Open in Claude';
  opBtn.addEventListener('click',function(){ window.open(url,'_blank'); });
  actions.appendChild(cpBtn); actions.appendChild(opBtn);
  card.appendChild(hdr); card.appendChild(prompt); card.appendChild(actions); return card;
}

// ── notes widget ──────────────────────────────
function buildNotesWidget(pi,di) {
  const wrap=document.createElement('div'); wrap.className='notes-wrap';
  const hdr=document.createElement('div'); hdr.className='notes-hdr';
  const lbl=document.createElement('span'); lbl.className='notes-hdr-label'; lbl.textContent='📝 MY NOTES';
  const saveBtn=document.createElement('button'); saveBtn.className='notes-save-btn'; saveBtn.textContent='Save';
  hdr.appendChild(lbl); hdr.appendChild(saveBtn);
  const ta=document.createElement('textarea'); ta.className='notes-ta';
  ta.placeholder='Write what you learned, paste code snippets, note what confused you…';
  ta.value=getNote(pi,di);
  saveBtn.addEventListener('click',function(){
    setNote(pi,di,ta.value);
    saveBtn.textContent='✓ Saved'; saveBtn.classList.add('saved');
    setTimeout(function(){ saveBtn.textContent='Save'; saveBtn.classList.remove('saved'); },1800);
    if(curView==='kanban') renderKanban();
  });
  ta.addEventListener('keydown',function(e){ if((e.ctrlKey||e.metaKey)&&e.key==='s'){ e.preventDefault(); saveBtn.click(); } });
  wrap.appendChild(hdr); wrap.appendChild(ta); return wrap;
}

// ── global stats update ───────────────────────
function updateStats() {
  const done=cntDone(), total=cntTotal(), left=total-done, pct=total?Math.round(done/total*100):0;
  document.querySelectorAll('[data-stat="done"]').forEach(function(e){ e.textContent=done; });
  document.querySelectorAll('[data-stat="left"]').forEach(function(e){ e.textContent=left; });
  document.querySelectorAll('[data-stat="total"]').forEach(function(e){ e.textContent=total; });
  document.querySelectorAll('[data-stat="pct"]').forEach(function(e){ e.textContent=pct+'%'; });
  document.querySelectorAll('[data-stat="streak"]').forEach(function(e){ e.textContent=S._streak||0; });
  document.querySelectorAll('[data-stat="hours"]').forEach(function(e){ e.textContent=studyHours()+'h'; });
  document.querySelectorAll('.prog-fill').forEach(function(e){ e.style.width=pct+'%'; });
  document.querySelectorAll('[data-stat="prog-lbl"]').forEach(function(e){ e.textContent=pct+'%'; });
  const strip=document.getElementById('top-strip'); if(strip) strip.style.transform='scaleX('+(pct/100)+')';
  // banner
  const msg=document.getElementById('left-msg');
  if(msg){
    if(left===0){ msg.innerHTML='<strong>🎉 All 80 days done! You\'re job-ready. Go apply.</strong>'; return; }
    let npi=-1,ndi=-1;
    outer: for(let pi=0;pi<PHASES.length;pi++){ for(let di=0;di<PHASES[pi].data.length;di++){ if(dayDone(pi,di)<dayTotal(pi,di)){npi=pi;ndi=di;break outer;} } }
    msg.innerHTML='<strong>'+left+' tasks left</strong> — next: <strong>'+(npi>=0?PHASES[npi].data[ndi].day+' · '+PHASES[npi].data[ndi].label:'keep going!')+'</strong>';
  }
}

// ── task toggle (central) ────────────────────
function doTask(pi,di,ti) {
  const id=tid(pi,di,ti); S[id]=!S[id];
  const todayDoneCount=PHASES.reduce(function(a,ph,p){ return a+ph.data.reduce(function(b,d,d_){ return b+d.tasks.filter(function(_,t){ return !!S[tid(p,d_,t)]; }).length; },0); },0);
  recordToday(todayDoneCount);
  save();
  const ph=PHASES[pi];
  document.querySelectorAll('#cb_'+id).forEach(function(cb){ cb.className='cb'+(S[id]?' on':''); cb.style.background=S[id]?ph.color:''; cb.style.borderColor=S[id]?ph.color:''; });
  document.querySelectorAll('#tx_'+id).forEach(function(tx){ tx.className='tx'+(S[id]?' done':''); tx.style.color=S[id]?'var(--sub)':'var(--text)'; });
  document.querySelectorAll('#row_'+id).forEach(function(row){ if(S[id]){row.classList.add('flash');setTimeout(function(){row.classList.remove('flash');},450);} });
  updateStats();
  if(curView==='kanban') renderKanban();
  if(curView==='stats')  renderStatsView();
  if(curView==='focus')  renderFocusHero();
}
// Version Switcher

const repo = "NaYa-World/80-dev-roadmap-tracker";
const repoBase = "/80-dev-roadmap-tracker";

function getCurrentVersion() {
  const path = window.location.pathname;
  const match = path.match(/\/v(\d+)/);
  return match ? `v${match[1]}` : "v1";
}

async function fetchVersions() {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/`);
    const data = await res.json();

    return data
      .filter(item => item.type === "dir" && /^v\d+$/.test(item.name))
      .map(item => item.name)
      .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function initVersionSwitcher() {
  const menu = document.getElementById("version-menu");
  const btn = document.getElementById("version-btn");

  if (!menu || !btn) return;

  const current = getCurrentVersion();
  const versions = await fetchVersions();

  const allVersions = ["v1", ...versions];

  menu.innerHTML = "";

  allVersions.forEach(v => {
    const link = document.createElement("a");
  
    link.href = v === "v1"
      ? `${repoBase}/`
      : `${repoBase}/${v}/`;
  
    // ✅ Add rocket for current version
    link.textContent = v === current ? `${v} 🚀` : v;
  
    if (v === current) {
      link.classList.add("active-version");
      btn.textContent = v + " 🚀 ▾"; // also update button
    }
  
    menu.appendChild(link);
  });

  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });
}

document.addEventListener("DOMContentLoaded", initVersionSwitcher);
