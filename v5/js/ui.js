// ═══════════════════════════════════════════════
// UI HELPERS v5
// Shared DOM builders, theme, stats, task toggle
// ═══════════════════════════════════════════════

const repo     = 'NaYa-World/80-dev-roadmap-tracker';
const repoBase = '/80-dev-roadmap-tracker';

const VERSION_INFO = {
  'v1':{ label:'v1 · Roadmap',       desc:'Basic checklist tracker' },
  'v2':{ label:'v2 · +Kanban+Focus', desc:'Kanban · Daily Focus · Stats' },
  'v3':{ label:'v3 · +AI+Pomodoro',  desc:'AI brief · Pomodoro · Notes · Jobs' },
  'v4':{ label:'v4 · +Bigger UI',    desc:'Bigger fonts · Polished version switcher' },
  'v5':{ label:'v5 · Latest',        desc:'Mobile · Search 2.0 · Code Review · Q Bank' },
};

// ── Theme ─────────────────────────────────────
function setTheme(t) {
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem(TK,t);
  const btn=document.getElementById('theme-btn');
  if(btn) btn.textContent = t==='dark'?'☀ Light':'◑ Dark';
}
function toggleTheme() {
  setTheme(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light');
}

// ── Version switcher ─────────────────────────
function getCurrentVersion() {
  const m=window.location.pathname.match(/\/(v\d+)/);
  return m?m[1]:'v5';
}
async function fetchVersions() {
  try {
    const res=await fetch('https://api.github.com/repos/'+repo+'/contents/');
    const data=await res.json();
    const dirs=data.filter(function(i){ return i.type==='dir'&&/^v\d+$/.test(i.name); })
      .map(function(i){ return i.name; })
      .sort(function(a,b){ return Number(a.slice(1))-Number(b.slice(1)); });
    if(!dirs.includes('v5')) dirs.push('v5');
    return dirs;
  } catch(_){ return ['v2','v3','v4','v5']; }
}
async function initVersionSwitcher() {
  const menu=document.getElementById('version-menu');
  const btn=document.getElementById('version-btn');
  if(!menu||!btn) return;
  const current=getCurrentVersion();
  const versions=await fetchVersions();
  const all=['v1',...versions.filter(function(v){ return v!=='v1'; })];
  menu.innerHTML='';
  all.forEach(function(v){
    const info=VERSION_INFO[v]||{label:v,desc:''};
    const isCurrent=v===current;
    const href=v==='v1'?repoBase+'/':repoBase+'/'+v+'/';
    const a=document.createElement('a');
    a.className='ver-item'+(isCurrent?' active-ver':'');
    a.href=href;
    a.innerHTML='<span style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--text)">'+info.label+'</div><div style="font-size:12px;color:var(--sub);margin-top:2px">'+info.desc+'</div></span>'
      +(isCurrent?'<span class="ver-badge current">current</span>'
        :v==='v5'?'<span class="ver-badge new">latest</span>':'');
    if(isCurrent) btn.innerHTML=info.label+' ▾';
    menu.appendChild(a);
  });
  btn.addEventListener('click',function(e){
    e.stopPropagation(); menu.classList.toggle('hidden');
  });
  document.addEventListener('click',function(){ menu.classList.add('hidden'); });
  menu.addEventListener('click',function(e){ e.stopPropagation(); });
}
document.addEventListener('DOMContentLoaded', initVersionSwitcher);

// ── Badge ─────────────────────────────────────
function badge(k) {
  const map={concept:'b-concept',code:'b-code',quiz:'b-quiz',project:'b-project'};
  const b=document.createElement('span');
  b.className='badge '+(map[k]||'b-concept'); b.textContent=k; return b;
}

// ── Checkbox ──────────────────────────────────
function makeCb(pi,di,ti) {
  const id=tid(pi,di,ti),done=!!S[id],ph=PHASES[pi];
  const cb=document.createElement('div');
  cb.className='cb'+(done?' on':''); cb.id='cb_'+id;
  cb.style.background=done?ph.color:''; cb.style.borderColor=done?ph.color:'';
  cb.innerHTML='<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"/></svg>';
  return cb;
}

// ── Confidence stars ──────────────────────────
function makeConfRow(pi,di,ti) {
  const conf=getConf(pi,di,ti);
  const labels=['','Confused','Shaky','Getting it','Solid','Nailed it!'];
  const row=document.createElement('div');
  row.className='confidence-row';
  const lbl=document.createElement('span');
  lbl.className='conf-label'; lbl.textContent='CONFIDENCE';
  row.appendChild(lbl);
  const stars=document.createElement('div');
  stars.className='conf-stars';
  for(let i=1;i<=5;i++){
    const s=document.createElement('button');
    s.className='conf-star'+(conf>=i?' filled':'');
    s.textContent='★'; s.title=labels[i];
    s.addEventListener('click',function(e){
      e.stopPropagation();
      setConf(pi,di,ti,i);
      // re-render stars in this row
      row.querySelectorAll('.conf-star').forEach(function(st,idx){
        st.classList.toggle('filled',idx<i);
      });
      // update tag
      let tag=row.querySelector('.conf-tag');
      if(!tag){ tag=document.createElement('span'); tag.className='conf-tag'; row.appendChild(tag); }
      tag.className='conf-tag conf-'+i; tag.textContent=labels[i];
      // refresh kanban/stats if open
      if(curView==='kanban') renderKanban();
    });
    stars.appendChild(s);
  }
  row.appendChild(stars);
  if(conf>0){
    const tag=document.createElement('span');
    tag.className='conf-tag conf-'+conf; tag.textContent=labels[conf];
    row.appendChild(tag);
  }
  return row;
}

// ── Task row ──────────────────────────────────
function makeTaskRow(pi,di,ti) {
  const task=PHASES[pi].data[di].tasks[ti];
  const id=tid(pi,di,ti),done=!!S[id];
  const wrap=document.createElement('div');

  const row=document.createElement('div');
  row.className='task-row'; row.id='row_'+id;
  const cb=makeCb(pi,di,ti);
  const tx=document.createElement('div');
  tx.className='tx'+(done?' done':''); tx.id='tx_'+id;
  tx.style.color=done?'var(--sub)':'var(--text)'; tx.textContent=task.t;
  row.appendChild(cb); row.appendChild(tx); row.appendChild(badge(task.k));
  row.addEventListener('click',function(){ doTask(pi,di,ti); });
  wrap.appendChild(row);

  // Confidence row shown only when task is done
  if(done){
    wrap.appendChild(makeConfRow(pi,di,ti));
  }
  wrap.id='taskwrap_'+id;
  return wrap;
}

// ── Notes widget ──────────────────────────────
function buildNotesWidget(pi,di) {
  const wrap=document.createElement('div'); wrap.className='notes-wrap';
  const hdr=document.createElement('div'); hdr.className='notes-hdr';
  const lbl=document.createElement('span'); lbl.className='notes-hdr-label'; lbl.textContent='📝 MY NOTES';
  const saveBtn=document.createElement('button'); saveBtn.className='notes-save-btn'; saveBtn.textContent='Save';
  hdr.appendChild(lbl); hdr.appendChild(saveBtn);
  const ta=document.createElement('textarea'); ta.className='notes-ta';
  ta.placeholder='Write what you learned, paste code, note what confused you… (Ctrl+S to save)';
  ta.value=getNote(pi,di);
  saveBtn.addEventListener('click',function(){
    setNote(pi,di,ta.value);
    saveBtn.textContent='✓ Saved'; saveBtn.classList.add('saved');
    setTimeout(function(){ saveBtn.textContent='Save'; saveBtn.classList.remove('saved'); },1800);
    if(curView==='kanban') renderKanban();
  });
  ta.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key==='s'){ e.preventDefault(); saveBtn.click(); }
  });
  wrap.appendChild(hdr); wrap.appendChild(ta); return wrap;
}

// ── Code reviewer widget ──────────────────────
function buildCodeReviewWidget(d,pi,di) {
  const card=document.createElement('div'); card.className='code-review-card';
  const hdr=document.createElement('div'); hdr.className='code-review-hdr';
  hdr.innerHTML='<div class="code-review-icon">🔍</div><span class="code-review-title">AI Code Reviewer — '+d.label+'</span>';
  const body=document.createElement('div'); body.className='code-review-body';
  const ta=document.createElement('textarea'); ta.className='code-ta';
  ta.placeholder='Paste your code for this exercise here…\n\nClaude will review it like a senior developer — bugs, improvements, and whether it\'s interview-ready.';
  const result=document.createElement('div'); result.className='code-review-result';
  const actRow=document.createElement('div'); actRow.style.cssText='display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;';

  const reviewBtn=document.createElement('button'); reviewBtn.className='brief-btn primary'; reviewBtn.textContent='🔍 Review my code';
  reviewBtn.addEventListener('click',function(){
    const code=ta.value.trim();
    if(!code){ result.className='code-review-result show'; result.style.color='var(--red)'; result.textContent='Please paste your code first.'; return; }
    result.className='code-review-result show loading'; result.style.color='';
    result.innerHTML='<div class="brief-dots"><span></span><span></span><span></span></div> Reviewing your code…';
    const prompt='You are a senior developer with 15+ years experience doing a code review for a career-switcher learning frontend development.\n\nThe topic is: '+d.label+'\n\nReview this code:\n\n```\n'+code+'\n```\n\nGive your review in exactly this format:\n✅ WHAT WORKS WELL\n[2-3 specific things done right]\n\n⚠️ ISSUES TO FIX\n[Any bugs, bad practices, or missing error handling — be specific]\n\n💡 IMPROVEMENTS\n[2-3 concrete suggestions to make it more professional/interview-ready]\n\n🎯 VERDICT\n[One sentence: Needs work / Getting there / Interview-ready]\n\nBe direct and specific. No generic praise.';
    fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:700,messages:[{role:'user',content:prompt}]})
    }).then(function(r){ return r.json(); }).then(function(data){
      const text=data.content.filter(function(c){ return c.type==='text'; }).map(function(c){ return c.text; }).join('');
      result.className='code-review-result show'; result.textContent=text;
    }).catch(function(){
      result.className='code-review-result show';
      result.textContent='Could not reach Claude. Copy your code and use the Open in Claude button below to get a review.';
    });
  });

  const openBtn=document.createElement('button'); openBtn.className='brief-btn secondary'; openBtn.textContent='↗ Open in Claude';
  openBtn.addEventListener('click',function(){
    const code=ta.value.trim();
    const msg='Please review my code for the exercise "'+d.label+'". Here it is:\n\n```\n'+(code||'[paste your code here]')+'\n```\n\nAct as a senior developer. Tell me what works, what needs fixing, and if it is interview-ready.';
    window.open('https://claude.ai/new?q='+encodeURIComponent(msg),'_blank');
  });

  actRow.appendChild(reviewBtn); actRow.appendChild(openBtn);
  body.appendChild(ta); body.appendChild(actRow); body.appendChild(result);
  card.appendChild(hdr); card.appendChild(body); return card;
}

// ── Quiz card ─────────────────────────────────
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
    (navigator.clipboard?navigator.clipboard.writeText(msg):Promise.reject()).catch(function(){
      const ta=document.createElement('textarea');ta.value=msg;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    });
    btn.innerHTML='✓ Copied!'; btn.style.color='var(--green)'; btn.style.background='rgba(0,217,160,.08)';
    setTimeout(function(){ btn.innerHTML='📋 Copy prompt'; btn.style.color=''; btn.style.background=''; },2200);
  });
  const opBtn=document.createElement('button'); opBtn.className='quiz-btn op';
  opBtn.innerHTML='↗ Open in Claude';
  opBtn.addEventListener('click',function(){ window.open(url,'_blank'); });
  actions.appendChild(cpBtn); actions.appendChild(opBtn);
  card.appendChild(hdr); card.appendChild(prompt); card.appendChild(actions); return card;
}

// ── Global stats update ───────────────────────
function updateStats() {
  const done=cntDone(),total=cntTotal(),left=total-done,pct=total?Math.round(done/total*100):0;
  document.querySelectorAll('[data-stat="done"]').forEach(function(e){ e.textContent=done; });
  document.querySelectorAll('[data-stat="left"]').forEach(function(e){ e.textContent=left; });
  document.querySelectorAll('[data-stat="total"]').forEach(function(e){ e.textContent=total; });
  document.querySelectorAll('[data-stat="pct"]').forEach(function(e){ e.textContent=pct+'%'; });
  document.querySelectorAll('[data-stat="streak"]').forEach(function(e){ e.textContent=S._streak||0; });
  document.querySelectorAll('[data-stat="hours"]').forEach(function(e){ e.textContent=studyHours()+'h'; });
  document.querySelectorAll('.prog-fill').forEach(function(e){ e.style.width=pct+'%'; });
  document.querySelectorAll('[data-stat="prog-lbl"]').forEach(function(e){ e.textContent=pct+'%'; });
  const strip=document.getElementById('top-strip'); if(strip) strip.style.transform='scaleX('+(pct/100)+')';
  const msg=document.getElementById('left-msg');
  if(msg){
    if(left===0){ msg.innerHTML='<strong>🎉 All 80 days complete! You are job-ready. Go apply.</strong>'; return; }
    let npi=-1,ndi=-1;
    outer: for(let pi=0;pi<PHASES.length;pi++){ for(let di=0;di<PHASES[pi].data.length;di++){ if(dayDone(pi,di)<dayTotal(pi,di)){npi=pi;ndi=di;break outer;} } }
    msg.innerHTML='<strong>'+left+' tasks left</strong> — next: <strong>'+(npi>=0?PHASES[npi].data[ndi].day+' · '+PHASES[npi].data[ndi].label:'keep going!')+'</strong>';
  }
}

// ── Task toggle ───────────────────────────────
function doTask(pi,di,ti) {
  const id=tid(pi,di,ti); S[id]=!S[id];
  const todayCount=cntDone();
  recordToday(todayCount); save();
  const ph=PHASES[pi];
  // update all checkboxes
  document.querySelectorAll('#cb_'+id).forEach(function(cb){
    cb.className='cb'+(S[id]?' on':''); cb.style.background=S[id]?ph.color:''; cb.style.borderColor=S[id]?ph.color:'';
  });
  document.querySelectorAll('#tx_'+id).forEach(function(tx){
    tx.className='tx'+(S[id]?' done':''); tx.style.color=S[id]?'var(--sub)':'var(--text)';
  });
  document.querySelectorAll('#row_'+id).forEach(function(row){
    if(S[id]){ row.classList.add('flash'); setTimeout(function(){ row.classList.remove('flash'); },450); }
  });
  // show/hide confidence row in task wrapper
  document.querySelectorAll('#taskwrap_'+id).forEach(function(wrap){
    const existing=wrap.querySelector('.confidence-row');
    if(S[id]&&!existing) wrap.appendChild(makeConfRow(pi,di,ti));
    if(!S[id]&&existing) existing.remove();
  });
  updateStats();
  if(curView==='kanban') renderKanban();
  if(curView==='stats')  renderStatsView();
  if(curView==='focus')  renderFocusHero();
}
