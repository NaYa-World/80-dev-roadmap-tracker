// ─── STATE ────────────────────────────────────────────────────────────────────
const SK = 'devmap_v5';
const TK = 'devmap_theme';
let S = {};
let curView   = 'roadmap';
let curFilter = 'all';
let curSearch = '';
let focusDay  = 0;

function save() { try { localStorage.setItem(SK, JSON.stringify(S)); } catch(_){} }
function load() { try { const r = localStorage.getItem(SK); if(r) S = JSON.parse(r); } catch(_){} }
function tid(pi,di,ti) { return 'p'+pi+'d'+di+'t'+ti; }

function allDays() {
  const days = [];
  PHASES.forEach(function(ph,pi){ ph.data.forEach(function(d,di){ days.push({ph,pi,d,di}); }); });
  return days;
}
function allIds() {
  const ids = [];
  PHASES.forEach(function(ph,pi){ ph.data.forEach(function(d,di){ d.tasks.forEach(function(_,ti){ ids.push(tid(pi,di,ti)); }); }); });
  return ids;
}
function cntDone()  { return allIds().filter(function(id){ return !!S[id]; }).length; }
function cntTotal() { return allIds().length; }
function dayDoneCount(pi,di) { return PHASES[pi].data[di].tasks.filter(function(_,ti){ return !!S[tid(pi,di,ti)]; }).length; }
function dayTotal(pi,di)     { return PHASES[pi].data[di].tasks.length; }
function dayPct(pi,di)       { const t=dayTotal(pi,di); return t?Math.round(dayDoneCount(pi,di)/t*100):0; }
function dayStatus(pi,di) {
  const d=dayDoneCount(pi,di), t=dayTotal(pi,di);
  if(d===0) return 'backlog';
  if(d===t) return 'done';
  if(d/t>=0.5) return 'review';
  return 'inprogress';
}

// ─── THEME ───────────────────────────────────────────────────────────────────
function setTheme(t) {
  document.documentElement.setAttribute('data-theme',t);
  localStorage.setItem(TK,t);
  const btn=document.getElementById('theme-btn');
  if(btn) btn.textContent = t==='dark' ? '☀ Light' : '◑ Dark';
}
function toggleTheme() { setTheme(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light'); }

// ─── GLOBAL STATS ─────────────────────────────────────────────────────────────
function updateGlobalStats() {
  const done=cntDone(), total=cntTotal(), left=total-done, pct=total?Math.round(done/total*100):0;
  ['s-done','s-done2'].forEach(function(id){const e=document.getElementById(id);if(e)e.textContent=done;});
  ['s-left','s-left2'].forEach(function(id){const e=document.getElementById(id);if(e)e.textContent=left;});
  ['s-total','s-total2'].forEach(function(id){const e=document.getElementById(id);if(e)e.textContent=total;});
  ['s-pct','s-pct2'].forEach(function(id){const e=document.getElementById(id);if(e)e.textContent=pct+'%';});
  ['s-streak','s-streak2'].forEach(function(id){const e=document.getElementById(id);if(e)e.textContent=S._streak||0;});
  document.querySelectorAll('.prog-fill').forEach(function(e){e.style.width=pct+'%';});
  document.querySelectorAll('[id="prog-lbl"]').forEach(function(e){e.textContent=pct+'%';});
  const strip=document.getElementById('top-strip'); if(strip) strip.style.transform='scaleX('+(pct/100)+')';
  const msg=document.getElementById('left-msg');
  if(msg){
    if(left===0){ msg.innerHTML='<strong>🎉 All tasks complete! You are job-ready.</strong>'; }
    else if(done===0){ msg.innerHTML='<strong>'+total+' tasks</strong> ahead — start today, not tomorrow.'; }
    else {
      let npi=-1,ndi=-1;
      outer: for(let pi=0;pi<PHASES.length;pi++){ for(let di=0;di<PHASES[pi].data.length;di++){ if(dayDoneCount(pi,di)<dayTotal(pi,di)){npi=pi;ndi=di;break outer;} } }
      msg.innerHTML='<strong>'+left+' tasks left</strong> — next: <strong>'+(npi>=0?PHASES[npi].data[ndi].day+' · '+PHASES[npi].data[ndi].label:'keep going!')+'</strong>';
    }
  }
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
function makeCb(pi,di,ti) {
  const id=tid(pi,di,ti), done=!!S[id], ph=PHASES[pi];
  const cb=document.createElement('div');
  cb.className='cb'+(done?' on':''); cb.id='cb_'+id;
  cb.style.background=done?ph.color:''; cb.style.borderColor=done?ph.color:'';
  cb.innerHTML='<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 6 5 9 10 3"/></svg>';
  return cb;
}
function badge(k) {
  const map={concept:'b-concept',code:'b-code',quiz:'b-quiz',project:'b-project'};
  const b=document.createElement('span'); b.className='badge '+(map[k]||'b-concept'); b.textContent=k; return b;
}
function buildQuizCard(d) {
  const msg='Quiz me on the following topic as a senior trainer would: '+d.label+' ('+d.day+'). Ask me 3 questions one at a time and give feedback on each answer.';
  const url='https://claude.ai/new?q='+encodeURIComponent(msg);
  const card=document.createElement('div'); card.className='quiz-card';
  const hdr=document.createElement('div'); hdr.className='quiz-card-hdr';
  hdr.innerHTML='<div class="quiz-card-icon">🤖</div><span class="quiz-card-name">Quiz me on: '+d.label+'</span><span class="quiz-card-tag">AI quiz</span>';
  const prompt=document.createElement('div'); prompt.className='quiz-prompt'; prompt.textContent=msg;
  const actions=document.createElement('div'); actions.className='quiz-actions';
  const cpBtn=document.createElement('button'); cpBtn.className='quiz-btn cp';
  cpBtn.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy prompt';
  cpBtn.addEventListener('click',function(){
    const btn=this;
    (navigator.clipboard?navigator.clipboard.writeText(msg):Promise.reject()).catch(function(){const ta=document.createElement('textarea');ta.value=msg;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);});
    btn.innerHTML='✓ Copied!'; btn.style.color='#00d9a0'; btn.style.background='rgba(0,217,160,.08)';
    setTimeout(function(){btn.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy prompt';btn.style.color='';btn.style.background='';},2200);
  });
  const opBtn=document.createElement('button'); opBtn.className='quiz-btn op';
  opBtn.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Open in Claude ↗';
  opBtn.addEventListener('click',function(){window.open(url,'_blank');});
  actions.appendChild(cpBtn); actions.appendChild(opBtn);
  card.appendChild(hdr); card.appendChild(prompt); card.appendChild(actions); return card;
}

// ─── TASK TOGGLE ──────────────────────────────────────────────────────────────
function doTask(pi,di,ti) {
  const id=tid(pi,di,ti); S[id]=!S[id];
  const today=new Date().toDateString();
  if(S._lastDay!==today){
    const yesterday=new Date(Date.now()-86400000).toDateString();
    S._streak=S._lastDay===yesterday?((S._streak||0)+1):1; S._lastDay=today;
  }
  if(!S._history) S._history={};
  if(cntDone()>0) S._history[today]=true;
  save();
  const ph=PHASES[pi];
  document.querySelectorAll('#cb_'+id).forEach(function(cb){ cb.className='cb'+(S[id]?' on':''); cb.style.background=S[id]?ph.color:''; cb.style.borderColor=S[id]?ph.color:''; });
  document.querySelectorAll('#tx_'+id).forEach(function(tx){ tx.className='tx'+(S[id]?' done':''); tx.style.color=S[id]?'var(--sub)':'var(--text)'; });
  document.querySelectorAll('#row_'+id).forEach(function(row){ if(S[id]){row.classList.add('flash');setTimeout(function(){row.classList.remove('flash');},400);} });
  updateGlobalStats();
  if(curView==='kanban') renderKanban();
  if(curView==='stats')  renderStats();
  if(curView==='focus')  renderFocusHero();
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 1 — ROADMAP
// ══════════════════════════════════════════════════════════════════════════════
function renderRoadmap(filter,search) {
  const wrap=document.getElementById('roadmap-wrap'); if(!wrap) return; wrap.innerHTML='';
  PHASES.forEach(function(ph,pi){
    if(filter!=='all'&&parseInt(filter)!==pi) return;
    const phTotal=ph.data.reduce(function(a,d,di){return a+dayTotal(pi,di);},0);
    const phDone=ph.data.reduce(function(a,d,di){return a+dayDoneCount(pi,di);},0);
    const phPct=phTotal?Math.round(phDone/phTotal*100):0;
    const isOpen=S['po'+pi]!==false, isComp=phDone===phTotal&&phTotal>0;
    const card=document.createElement('div'); card.className='phase-card';
    card.style.setProperty('--pc',ph.color); card.style.setProperty('--pcd',ph.dim);
    card.innerHTML=
      '<div class="phase-hdr" id="phdr'+pi+'">'
        +'<div class="phase-icon">'+ph.icon+'</div>'
        +'<div style="flex:1;min-width:0;">'
          +'<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:1px;">'+ph.title+'</div>'
          +'<div style="font-family:var(--mono);font-size:10px;color:var(--sub);">'+ph.days+' · '+phDone+'/'+phTotal+' tasks</div>'
          +'<div class="mini-bar"><div class="mini-fill" style="width:'+phPct+'%;background:'+ph.color+'"></div></div>'
        +'</div>'
        +(isComp?'<div class="done-pill">✓ complete</div>':'<span style="font-family:var(--mono);font-size:10px;padding:3px 9px;border-radius:10px;background:var(--border);color:var(--sub);">'+phPct+'%</span>')
        +'<svg id="ch'+pi+'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--sub);flex-shrink:0;transition:transform .3s;transform:rotate('+(isOpen?180:0)+'deg)"><polyline points="6 9 12 15 18 9"/></svg>'
      +'</div>'
      +'<div class="phase-body'+(isOpen?' open':'')+'" id="pb'+pi+'"><div class="phase-body-inner" id="pbi'+pi+'"></div></div>';
    card.querySelector('#phdr'+pi).addEventListener('click',function(){doPhase(pi);});
    const inner=card.querySelector('#pbi'+pi);
    ph.data.forEach(function(d,di){
      const sl=search.toLowerCase();
      const showDay=!search||d.tasks.some(function(t){return t.t.toLowerCase().includes(sl)||d.label.toLowerCase().includes(sl)||d.day.toLowerCase().includes(sl);});
      if(!showDay) return;
      const dDone=dayDoneCount(pi,di),dTotal=dayTotal(pi,di),allDone=dDone===dTotal,dayOpen=S['do'+pi+'_'+di]!==false;
      const dayBlock=document.createElement('div'); dayBlock.className='day-block'+(allDone?' all-done':'');
      const dayHdr=document.createElement('div'); dayHdr.className='day-hdr';
      dayHdr.innerHTML='<span class="day-tag">'+d.day+'</span><span class="day-label">'+d.label+'</span><span class="day-count" style="color:'+(allDone?'#00d9a0':'var(--sub)')+';">'+dDone+'/'+dTotal+(allDone?' ✓':'')+'</span><svg class="day-chev'+(dayOpen?' open':'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
      const tasksWrap=document.createElement('div'); tasksWrap.className='day-tasks'+(dayOpen?' open':'');
      const tasksInner=document.createElement('div'); tasksInner.className='day-tasks-inner';
      d.tasks.forEach(function(task,ti){
        if(search&&!task.t.toLowerCase().includes(sl)&&!d.label.toLowerCase().includes(sl)&&!d.day.toLowerCase().includes(sl)) return;
        const id=tid(pi,di,ti),done=!!S[id];
        const row=document.createElement('div'); row.className='task-row'; row.id='row_'+id;
        const cb=makeCb(pi,di,ti);
        const tx=document.createElement('div'); tx.className='tx'+(done?' done':''); tx.id='tx_'+id; tx.style.color=done?'var(--sub)':'var(--text)'; tx.textContent=task.t;
        row.appendChild(cb); row.appendChild(tx); row.appendChild(badge(task.k));
        (function(a,b,c){row.addEventListener('click',function(){doTask(a,b,c);});})(pi,di,ti);
        tasksInner.appendChild(row);
      });
      tasksInner.appendChild(buildQuizCard(d)); tasksWrap.appendChild(tasksInner);
      (function(a,b,h,tw){h.addEventListener('click',function(){const open=tw.classList.toggle('open');S['do'+a+'_'+b]=open;save();const chev=h.querySelector('.day-chev');if(chev)chev.classList.toggle('open',open);});})(pi,di,dayHdr,tasksWrap);
      dayBlock.appendChild(dayHdr); dayBlock.appendChild(tasksWrap); inner.appendChild(dayBlock);
    });
    wrap.appendChild(card);
  });
}
function doPhase(pi){
  S['po'+pi]=S['po'+pi]===false?true:false; save(); renderRoadmap(curFilter,curSearch);
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 2 — KANBAN
// ══════════════════════════════════════════════════════════════════════════════
let kanbanPhaseFilter='all';
function renderKanban() {
  const wrap=document.getElementById('kanban-wrap'); if(!wrap) return;
  const cols={backlog:[],inprogress:[],review:[],done:[]};
  PHASES.forEach(function(ph,pi){
    if(kanbanPhaseFilter!=='all'&&parseInt(kanbanPhaseFilter)!==pi) return;
    ph.data.forEach(function(d,di){ cols[dayStatus(pi,di)].push({ph,pi,d,di}); });
  });
  const colDefs=[{key:'backlog',label:'Backlog',emoji:'○'},{key:'inprogress',label:'In Progress',emoji:'◑'},{key:'review',label:'Review',emoji:'◕'},{key:'done',label:'Done',emoji:'●'}];
  wrap.innerHTML='';
  colDefs.forEach(function(col){
    const colEl=document.createElement('div'); colEl.className='k-col'; colEl.setAttribute('data-status',col.key);
    const items=cols[col.key];
    const hdr=document.createElement('div'); hdr.className='k-col-hdr';
    hdr.innerHTML='<span class="k-col-title">'+col.emoji+' '+col.label+'</span><span class="k-col-count">'+items.length+'</span>';
    colEl.appendChild(hdr);
    const body=document.createElement('div'); body.className='k-col-body';
    if(items.length===0){ body.innerHTML='<div class="k-empty">Empty</div>'; }
    else {
      items.forEach(function(item){
        const card=document.createElement('div'); card.className='k-card'; card.style.setProperty('--kc',item.ph.color);
        const dDone=dayDoneCount(item.pi,item.di),dTotal=dayTotal(item.pi,item.di),pct=dTotal?Math.round(dDone/dTotal*100):0;
        card.innerHTML='<div class="k-card-day">'+item.ph.icon+' '+item.d.day+'</div><div class="k-card-label">'+item.d.label+'</div><div class="k-card-meta"><span class="badge" style="background:'+item.ph.dim+';color:'+item.ph.color+';border:1px solid '+item.ph.color+'44;">'+item.d.tasks.length+' tasks</span><span class="k-progress-mini">'+dDone+'/'+dTotal+' · '+pct+'%</span></div><div class="mini-bar" style="margin-top:8px;"><div class="mini-fill" style="width:'+pct+'%;background:'+item.ph.color+'"></div></div>';
        (function(a,b){card.addEventListener('click',function(){S['po'+a]=true;S['do'+a+'_'+b]=true;save();showView('roadmap');setTimeout(function(){const el=document.querySelector('#pbi'+a+' .day-block:nth-child('+(b+1)+')');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},250);});})(item.pi,item.di);
        body.appendChild(card);
      });
    }
    colEl.appendChild(body); wrap.appendChild(colEl);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 3 — DAILY FOCUS
// ══════════════════════════════════════════════════════════════════════════════
function renderFocusHero() {
  const days=allDays(), idx=Math.max(0,Math.min(focusDay,days.length-1)), item=days[idx];
  const {ph,pi,d,di}=item;
  const dDone=dayDoneCount(pi,di),dTotal=dayTotal(pi,di),pct=dTotal?Math.round(dDone/dTotal*100):0;
  const hero=document.getElementById('focus-hero');
  if(hero){ hero.style.borderColor=ph.color+'33'; }
  const tag=document.getElementById('focus-day-tag');
  if(tag){ tag.textContent=d.day+' · '+(ph.title.includes('—')?ph.title.split('—')[1].trim():ph.title); tag.style.color=ph.color; tag.style.borderColor=ph.color+'55'; tag.style.background=ph.dim; }
  const titleEl=document.getElementById('focus-title'); if(titleEl) titleEl.textContent=d.label;
  const doneEl=document.getElementById('focus-done-num'); if(doneEl){doneEl.textContent=dDone;doneEl.style.color=ph.color;}
  const leftEl=document.getElementById('focus-left-num'); if(leftEl) leftEl.textContent=dTotal-dDone;
  const pctEl=document.getElementById('focus-pct-num'); if(pctEl){pctEl.textContent=pct+'%';pctEl.style.color=ph.color;}
  const fp=document.getElementById('focus-prog'); if(fp){fp.style.width=pct+'%';fp.style.background=ph.color;}
  const countEl=document.getElementById('focus-tasks-count'); if(countEl) countEl.textContent=dDone+'/'+dTotal+' done';
  const body=document.getElementById('focus-tasks-body'); if(!body) return; body.innerHTML='';
  d.tasks.forEach(function(task,ti){
    const id=tid(pi,di,ti),done=!!S[id];
    const row=document.createElement('div'); row.className='task-row'; row.id='row_'+id;
    const cb=makeCb(pi,di,ti);
    const tx=document.createElement('div'); tx.className='tx'+(done?' done':''); tx.id='tx_'+id; tx.style.color=done?'var(--sub)':'var(--text)'; tx.textContent=task.t;
    row.appendChild(cb); row.appendChild(tx); row.appendChild(badge(task.k));
    (function(a,b,c){row.addEventListener('click',function(){doTask(a,b,c);});})(pi,di,ti);
    body.appendChild(row);
  });
  body.appendChild(buildQuizCard(d));
}
function buildFocusNav() {
  const nav=document.getElementById('focus-nav'); if(!nav) return; nav.innerHTML='';
  const days=allDays();
  const prev=document.createElement('button'); prev.className='focus-nav-btn'; prev.textContent='← Prev';
  prev.addEventListener('click',function(){if(focusDay>0){focusDay--;buildFocusNav();renderFocusHero();}});
  const next=document.createElement('button'); next.className='focus-nav-btn'; next.textContent='Next →';
  next.addEventListener('click',function(){if(focusDay<days.length-1){focusDay++;buildFocusNav();renderFocusHero();}});
  const lbl=document.createElement('span'); lbl.className='focus-phase-label';
  lbl.textContent='Day '+(focusDay+1)+' of '+days.length;
  nav.appendChild(prev); nav.appendChild(next); nav.appendChild(lbl);
  // day pills per phase
  const phRow=document.createElement('div'); phRow.style.cssText='display:flex;gap:5px;flex-wrap:wrap;width:100%;margin-top:10px;';
  let flatIdx=0;
  PHASES.forEach(function(ph,pi){
    ph.data.forEach(function(d,di){
      (function(idx,ph,d){
        const btn=document.createElement('button'); btn.className='focus-nav-btn'+(idx===focusDay?' active':'');
        btn.style.cssText='padding:3px 8px;font-size:11px;border-left:3px solid '+ph.color+';';
        btn.textContent=d.day.replace('Days ','').split('-')[0]; btn.title=d.label;
        btn.addEventListener('click',function(){focusDay=idx;buildFocusNav();renderFocusHero();});
        phRow.appendChild(btn);
      })(flatIdx,ph,d);
      flatIdx++;
    });
  });
  nav.appendChild(phRow);
}
function detectFocusDay() {
  const days=allDays();
  for(let i=0;i<days.length;i++){
    if(dayDoneCount(days[i].pi,days[i].di)<dayTotal(days[i].pi,days[i].di)){focusDay=i;return;}
  }
  focusDay=days.length-1;
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW 4 — STATS DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function renderStats() {
  const wrap=document.getElementById('stats-wrap'); if(!wrap) return; wrap.innerHTML='';
  const done=cntDone(),total=cntTotal(),left=total-done,pct=total?Math.round(done/total*100):0;

  // Phase breakdown
  const phCard=document.createElement('div'); phCard.className='dash-card full';
  phCard.innerHTML='<div class="dash-card-title">Phase Breakdown</div><div id="phase-bars"></div>';
  wrap.appendChild(phCard);
  PHASES.forEach(function(ph,pi){
    const phTotal=ph.data.reduce(function(a,d,di){return a+dayTotal(pi,di);},0);
    const phDone=ph.data.reduce(function(a,d,di){return a+dayDoneCount(pi,di);},0);
    const phPct=phTotal?Math.round(phDone/phTotal*100):0;
    const row=document.createElement('div'); row.className='phase-bar-row';
    row.innerHTML='<div class="phase-bar-label"><span class="phase-bar-name">'+ph.icon+' '+ph.title+'</span><span class="phase-bar-pct">'+phDone+'/'+phTotal+' · '+phPct+'%</span></div><div class="phase-bar-track"><div class="phase-bar-fill" style="width:'+phPct+'%;background:'+ph.color+'"></div></div>';
    phCard.querySelector('#phase-bars').appendChild(row);
  });

  // Task type breakdown
  const typeTotals={concept:0,code:0,quiz:0,project:0}, typeDone={concept:0,code:0,quiz:0,project:0};
  PHASES.forEach(function(ph,pi){ ph.data.forEach(function(d,di){ d.tasks.forEach(function(task,ti){ typeTotals[task.k]=(typeTotals[task.k]||0)+1; if(S[tid(pi,di,ti)]) typeDone[task.k]=(typeDone[task.k]||0)+1; }); }); });
  const typeCard=document.createElement('div'); typeCard.className='dash-card';
  typeCard.innerHTML='<div class="dash-card-title">Task Types</div><div class="type-grid" id="type-grid"></div>';
  wrap.appendChild(typeCard);
  [{k:'concept',name:'Concepts',color:'#4fa8ff',cls:'b-concept'},{k:'code',name:'Coding',color:'#00d9a0',cls:'b-code'},{k:'quiz',name:'Quizzes',color:'#ffc850',cls:'b-quiz'},{k:'project',name:'Projects',color:'#b98aff',cls:'b-project'}].forEach(function(s){
    const d=typeDone[s.k]||0,t=typeTotals[s.k]||0,p=t?Math.round(d/t*100):0;
    const item=document.createElement('div'); item.className='type-item';
    item.innerHTML='<div class="type-item-top"><span class="type-item-name" style="color:'+s.color+'">'+s.name+'</span><span class="badge '+s.cls+'">'+p+'%</span></div><div class="type-item-count" style="color:'+s.color+'">'+d+'<span style="font-size:13px;color:var(--sub);">/'+t+'</span></div><div class="mini-bar"><div class="mini-fill" style="width:'+p+'%;background:'+s.color+'"></div></div><div class="type-item-sub">'+d+' of '+t+' done</div>';
    typeCard.querySelector('#type-grid').appendChild(item);
  });

  // Ring chart
  const ringCard=document.createElement('div'); ringCard.className='dash-card';
  ringCard.innerHTML='<div class="dash-card-title">Overall Progress</div><div style="display:flex;align-items:center;justify-content:center;padding:16px 0;"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" stroke-width="10"/><circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg1)" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+(2*Math.PI*50)+'" stroke-dashoffset="'+(2*Math.PI*50*(1-pct/100))+'" transform="rotate(-90 60 60)"/><defs><linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7864ff"/><stop offset="100%" stop-color="#00d9a0"/></linearGradient></defs><text x="60" y="56" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="18" font-weight="700" fill="var(--text)">'+pct+'%</text><text x="60" y="72" text-anchor="middle" font-family="Outfit,sans-serif" font-size="10" fill="var(--sub)">complete</text></svg></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center;"><div><div style="font-family:var(--mono);font-size:20px;font-weight:700;color:#00d9a0;">'+done+'</div><div style="font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:.8px;">Done</div></div><div><div style="font-family:var(--mono);font-size:20px;font-weight:700;color:#ff6b6b;">'+left+'</div><div style="font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:.8px;">Left</div></div></div>';
  wrap.appendChild(ringCard);

  // Heatmap
  const hmCard=document.createElement('div'); hmCard.className='dash-card full';
  hmCard.innerHTML='<div class="dash-card-title">Day Completion Heatmap — all '+allDays().length+' days</div><div class="heatmap-grid" id="hm-grid"></div><div style="display:flex;gap:6px;align-items:center;margin-top:10px;"><span style="font-family:var(--mono);font-size:10px;color:var(--sub);">0%</span><div class="hm-cell" style="width:14px;height:14px;flex-shrink:0;"></div><div class="hm-cell lvl1" style="width:14px;height:14px;flex-shrink:0;"></div><div class="hm-cell lvl2" style="width:14px;height:14px;flex-shrink:0;"></div><div class="hm-cell lvl3" style="width:14px;height:14px;flex-shrink:0;"></div><div class="hm-cell lvl4" style="width:14px;height:14px;flex-shrink:0;"></div><span style="font-family:var(--mono);font-size:10px;color:var(--sub);">100%</span></div>';
  wrap.appendChild(hmCard);
  allDays().forEach(function(item){
    const p=dayPct(item.pi,item.di),lvl=p===0?0:p<25?1:p<50?2:p<100?3:4;
    const cell=document.createElement('div'); cell.className='hm-cell'+(lvl>0?' lvl'+lvl:''); cell.title=item.d.day+' · '+item.d.label+' · '+p+'%';
    hmCard.querySelector('#hm-grid').appendChild(cell);
  });

  // Streak calendar (last 14 days)
  const streak=S._streak||0;
  const streakCard=document.createElement('div'); streakCard.className='dash-card full';
  streakCard.innerHTML='<div class="dash-card-title">🔥 Day Streak — '+streak+' day'+(streak!==1?'s':'')+' in a row</div><div class="streak-row" id="streak-row"></div><p style="font-size:12px;color:var(--sub);margin-top:12px;">Tick off at least one task every day to keep your streak alive. Consistency is the real skill.</p>';
  wrap.appendChild(streakCard);
  const history=S._history||{},today=new Date();
  for(let i=13;i>=0;i--){
    const d=new Date(today); d.setDate(today.getDate()-i);
    const key=d.toDateString(), active=!!history[key], isToday=i===0;
    const dayEl=document.createElement('div'); dayEl.className='streak-day'+(active?' active':'')+(isToday?' today':'');
    dayEl.textContent=d.getDate(); dayEl.title=key+(active?' — tasks done ✓':'');
    streakCard.querySelector('#streak-row').appendChild(dayEl);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// VIEW SWITCHING
// ══════════════════════════════════════════════════════════════════════════════
function showView(v) {
  curView=v;
  document.querySelectorAll('.view').forEach(function(el){el.classList.remove('active');});
  document.querySelectorAll('.nav-tab').forEach(function(el){el.classList.remove('active');});
  const viewEl=document.getElementById('view-'+v), tabEl=document.querySelector('[data-view="'+v+'"]');
  if(viewEl) viewEl.classList.add('active');
  if(tabEl)  tabEl.classList.add('active');
  if(v==='roadmap') renderRoadmap(curFilter,curSearch);
  if(v==='kanban')  renderKanban();
  if(v==='focus')   { detectFocusDay(); buildFocusNav(); renderFocusHero(); }
  if(v==='stats')   renderStats();
}

// ══════════════════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.nav-tab').forEach(function(btn){
    btn.addEventListener('click',function(){showView(btn.getAttribute('data-view'));});
  });
  const tabRow=document.getElementById('phase-tabs');
  if(tabRow){ tabRow.addEventListener('click',function(e){const btn=e.target.closest('[data-phase]');if(!btn)return;curFilter=btn.getAttribute('data-phase');tabRow.querySelectorAll('.tab-pill').forEach(function(t){t.classList.remove('active');});btn.classList.add('active');renderRoadmap(curFilter,curSearch);}); }
  const searchEl=document.getElementById('search');
  if(searchEl){ let st; searchEl.addEventListener('input',function(e){clearTimeout(st);st=setTimeout(function(){curSearch=e.target.value;renderRoadmap(curFilter,curSearch);},200);}); }
  const kbFilter=document.getElementById('kb-filter');
  if(kbFilter){ kbFilter.addEventListener('click',function(e){const btn=e.target.closest('[data-phase]');if(!btn)return;kanbanPhaseFilter=btn.getAttribute('data-phase');kbFilter.querySelectorAll('.kanban-filter-btn').forEach(function(b){b.classList.remove('active');});btn.classList.add('active');renderKanban();}); }
  const themeBtn=document.getElementById('theme-btn'); if(themeBtn) themeBtn.addEventListener('click',toggleTheme);
  const resetBtn=document.getElementById('reset-btn'); if(resetBtn){ resetBtn.addEventListener('click',function(){if(confirm('Reset ALL progress? Cannot be undone.')){S={};save();updateGlobalStats();showView(curView);}});}
  const savedTheme=localStorage.getItem(TK);
  setTheme(savedTheme||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
  load(); updateGlobalStats(); showView('roadmap');
});
