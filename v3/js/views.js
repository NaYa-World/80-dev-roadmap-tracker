// ═══════════════════════════════════════════════
// ALL VIEWS — Roadmap, Kanban, Focus, Stats, Jobs
// ═══════════════════════════════════════════════
let curView   = 'roadmap';
let curFilter = 'all';
let curSearch = '';
let focusDay  = 0;
let kbPhase   = 'all';

// ══════════════════════════════════════════════
// VIEW 1 — ROADMAP
// ══════════════════════════════════════════════
function renderRoadmap(filter, search) {
  const wrap=document.getElementById('roadmap-wrap'); if(!wrap) return; wrap.innerHTML='';
  PHASES.forEach(function(ph,pi){
    if(filter!=='all'&&parseInt(filter)!==pi) return;
    const phTotal=ph.data.reduce(function(a,d,di){return a+dayTotal(pi,di);},0);
    const phDone =ph.data.reduce(function(a,d,di){return a+dayDone(pi,di);},0);
    const phPct  =phTotal?Math.round(phDone/phTotal*100):0;
    const isOpen =S['po'+pi]!==false;
    const isComp =phDone===phTotal&&phTotal>0;
    const card=document.createElement('div'); card.className='phase-card';
    card.style.setProperty('--pc',ph.color); card.style.setProperty('--pcd',ph.dim);
    card.innerHTML=
      '<div class="phase-hdr" id="phdr'+pi+'">'
        +'<div class="phase-icon">'+ph.icon+'</div>'
        +'<div style="flex:1;min-width:0;">'
          +'<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:1px;">'+ph.title+'</div>'
          +'<div style="font-family:var(--mono);font-size:10px;color:var(--sub);margin-bottom:4px;">'+ph.days+' · '+phDone+'/'+phTotal+' tasks</div>'
          +'<div class="mini-bar"><div class="mini-fill" style="width:'+phPct+'%;background:'+ph.color+'"></div></div>'
        +'</div>'
        +(isComp?'<div class="done-pill">✓ done</div>':'<span style="font-family:var(--mono);font-size:10px;padding:3px 9px;border-radius:10px;background:var(--border);color:var(--sub);">'+phPct+'%</span>')
        +'<svg id="ch'+pi+'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--sub);flex-shrink:0;transition:transform .3s;transform:rotate('+(isOpen?180:0)+'deg)"><polyline points="6 9 12 15 18 9"/></svg>'
      +'</div>'
      +'<div class="phase-body'+(isOpen?' open':'')+'" id="pb'+pi+'"><div class="phase-body-inner" id="pbi'+pi+'"></div></div>';
    card.querySelector('#phdr'+pi).addEventListener('click',function(){ doPhase(pi); });
    const inner=card.querySelector('#pbi'+pi);
    ph.data.forEach(function(d,di){
      const sl=search.toLowerCase();
      const show=!search||d.tasks.some(function(t){return t.t.toLowerCase().includes(sl)||d.label.toLowerCase().includes(sl)||d.day.toLowerCase().includes(sl);});
      if(!show) return;
      const dDone=dayDone(pi,di),dTotal=dayTotal(pi,di),allDone=dDone===dTotal,dayOpen=S['do'+pi+'_'+di]!==false;
      const dayBlock=document.createElement('div'); dayBlock.className='day-block'+(allDone?' all-done':'');
      const dayHdr=document.createElement('div'); dayHdr.className='day-hdr';
      dayHdr.innerHTML='<span class="day-tag">'+d.day+'</span><span class="day-label">'+d.label+'</span><span class="day-count" style="color:'+(allDone?'var(--green)':'var(--sub)')+';">'+dDone+'/'+dTotal+(allDone?' ✓':'')+(hasNote(pi,di)?' 📝':'')+'</span><svg class="day-chev'+(dayOpen?' open':'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
      const tasksWrap=document.createElement('div'); tasksWrap.className='day-tasks'+(dayOpen?' open':'');
      const tasksInner=document.createElement('div'); tasksInner.className='day-tasks-inner';
      d.tasks.forEach(function(task,ti){
        if(search&&!task.t.toLowerCase().includes(sl)&&!d.label.toLowerCase().includes(sl)&&!d.day.toLowerCase().includes(sl)) return;
        tasksInner.appendChild(makeTaskRow(pi,di,ti));
      });
      tasksInner.appendChild(buildNotesWidget(pi,di));
      tasksInner.appendChild(buildQuizCard(d));
      tasksWrap.appendChild(tasksInner);
      (function(a,b,h,tw){
        h.addEventListener('click',function(){
          const open=tw.classList.toggle('open'); S['do'+a+'_'+b]=open; save();
          const chev=h.querySelector('.day-chev'); if(chev) chev.classList.toggle('open',open);
        });
      })(pi,di,dayHdr,tasksWrap);
      dayBlock.appendChild(dayHdr); dayBlock.appendChild(tasksWrap); inner.appendChild(dayBlock);
    });
    wrap.appendChild(card);
  });
}
function doPhase(pi){
  S['po'+pi]=S['po'+pi]===false?true:false; save(); renderRoadmap(curFilter,curSearch);
}

// ══════════════════════════════════════════════
// VIEW 2 — KANBAN
// ══════════════════════════════════════════════
function renderKanban() {
  const wrap=document.getElementById('kanban-wrap'); if(!wrap) return; wrap.innerHTML='';
  const cols={backlog:[],inprogress:[],review:[],done:[]};
  PHASES.forEach(function(ph,pi){
    if(kbPhase!=='all'&&parseInt(kbPhase)!==pi) return;
    ph.data.forEach(function(d,di){ cols[dayStatus(pi,di)].push({ph,pi,d,di}); });
  });
  [{key:'backlog',label:'Backlog',emoji:'○'},{key:'inprogress',label:'In Progress',emoji:'◑'},{key:'review',label:'Review',emoji:'◕'},{key:'done',label:'Done',emoji:'●'}]
  .forEach(function(col){
    const colEl=document.createElement('div'); colEl.className='k-col'; colEl.setAttribute('data-s',col.key);
    const items=cols[col.key];
    colEl.innerHTML='<div class="k-col-hdr"><span class="k-col-title">'+col.emoji+' '+col.label+'</span><span class="k-count">'+items.length+'</span></div>';
    const body=document.createElement('div'); body.className='k-body';
    if(!items.length){ body.innerHTML='<div class="k-empty">Empty</div>'; }
    else {
      items.forEach(function(item){
        const card=document.createElement('div'); card.className='k-card'; card.style.setProperty('--kc',item.ph.color);
        const dDone=dayDone(item.pi,item.di),dTotal=dayTotal(item.pi,item.di),pct=dTotal?Math.round(dDone/dTotal*100):0;
        const notesBadge=hasNote(item.pi,item.di)?'<span class="k-has-notes">📝 notes</span>':'';
        card.innerHTML='<div class="k-card-day">'+item.ph.icon+' '+item.d.day+'</div><div class="k-card-label">'+item.d.label+'</div><div class="k-card-meta"><span class="badge" style="background:'+item.ph.dim+';color:'+item.ph.color+';border:1px solid '+item.ph.color+'44;">'+item.d.tasks.length+' tasks</span>'+notesBadge+'<span class="k-pct">'+dDone+'/'+dTotal+' · '+pct+'%</span></div><div class="mini-bar" style="margin-top:8px;"><div class="mini-fill" style="width:'+pct+'%;background:'+item.ph.color+'"></div></div>';
        (function(a,b){
          card.addEventListener('click',function(){ S['po'+a]=true; S['do'+a+'_'+b]=true; save(); showView('roadmap'); setTimeout(function(){ const el=document.querySelector('#pbi'+a+' .day-block:nth-child('+(b+1)+')'); if(el) el.scrollIntoView({behavior:'smooth',block:'center'}); },250); });
        })(item.pi,item.di);
        body.appendChild(card);
      });
    }
    colEl.appendChild(body); wrap.appendChild(colEl);
  });
}

// ══════════════════════════════════════════════
// VIEW 3 — DAILY FOCUS
// ══════════════════════════════════════════════
function detectFocusDay() {
  const days=allDays();
  for(let i=0;i<days.length;i++){
    if(dayDone(days[i].pi,days[i].di)<dayTotal(days[i].pi,days[i].di)){focusDay=i;return;}
  }
  focusDay=days.length-1;
}
function renderFocusNav() {
  const nav=document.getElementById('focus-nav'); if(!nav) return; nav.innerHTML='';
  const days=allDays();
  const prev=document.createElement('button'); prev.className='focus-pill'; prev.textContent='← Prev';
  prev.addEventListener('click',function(){if(focusDay>0){focusDay--;renderFocusNav();renderFocusHero();}});
  const next=document.createElement('button'); next.className='focus-pill'; next.textContent='Next →';
  next.addEventListener('click',function(){if(focusDay<days.length-1){focusDay++;renderFocusNav();renderFocusHero();}});
  const lbl=document.createElement('span'); lbl.style.cssText='font-family:var(--mono);font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:1px;margin-left:auto;';
  lbl.textContent='Day '+(focusDay+1)+' of '+days.length;
  nav.appendChild(prev); nav.appendChild(next); nav.appendChild(lbl);
  const pills=document.createElement('div'); pills.style.cssText='display:flex;gap:4px;flex-wrap:wrap;width:100%;margin-top:10px;';
  let fi=0;
  PHASES.forEach(function(ph,pi){
    ph.data.forEach(function(d,di){
      (function(idx){
        const b=document.createElement('button'); b.className='focus-pill'+(idx===focusDay?' active':'');
        b.style.borderLeftColor=ph.color; b.style.borderLeftWidth='3px'; b.style.borderLeftStyle='solid'; b.style.padding='3px 8px'; b.style.fontSize='10px';
        b.textContent=d.day.replace('Days ','').split('-')[0]; b.title=d.label;
        b.addEventListener('click',function(){focusDay=idx;renderFocusNav();renderFocusHero();});
        if(idx===focusDay) b.style.background=ph.color; b.style.color=idx===focusDay?'#000':'var(--sub)';
        pills.appendChild(b);
      })(fi++);
    });
  });
  nav.appendChild(pills);
}
function renderFocusHero() {
  const days=allDays(); const idx=Math.max(0,Math.min(focusDay,days.length-1));
  const {ph,pi,d,di}=days[idx];
  const dDone=dayDone(pi,di),dTotal=dayTotal(pi,di),pct=dTotal?Math.round(dDone/dTotal*100):0;
  const tag=document.getElementById('focus-tag');
  if(tag){tag.textContent=d.day+' · '+(ph.title.includes('—')?ph.title.split('—')[1].trim():ph.title);tag.style.color=ph.color;tag.style.borderColor=ph.color+'55';tag.style.background=ph.dim;}
  const titleEl=document.getElementById('focus-title'); if(titleEl) titleEl.textContent=d.label;
  const metaEl=document.getElementById('focus-meta'); if(metaEl) metaEl.textContent=ph.title+' · '+dDone+'/'+dTotal+' tasks done';
  const doneEl=document.getElementById('focus-done'); if(doneEl){doneEl.textContent=dDone;doneEl.style.color=ph.color;}
  const leftEl=document.getElementById('focus-left'); if(leftEl) leftEl.textContent=dTotal-dDone;
  const pctEl=document.getElementById('focus-pct'); if(pctEl){pctEl.textContent=pct+'%';pctEl.style.color=ph.color;}
  const fpEl=document.getElementById('focus-prog'); if(fpEl){fpEl.style.width=pct+'%';fpEl.style.background=ph.color;}
  const countEl=document.getElementById('focus-count'); if(countEl) countEl.textContent=dDone+'/'+dTotal+' done';
  const body=document.getElementById('focus-body'); if(!body) return; body.innerHTML='';
  d.tasks.forEach(function(task,ti){ body.appendChild(makeTaskRow(pi,di,ti)); });
  body.appendChild(buildNotesWidget(pi,di));
  body.appendChild(buildQuizCard(d));
}

// ══════════════════════════════════════════════
// VIEW 4 — STATS
// ══════════════════════════════════════════════
function renderStatsView() {
  const wrap=document.getElementById('stats-wrap'); if(!wrap) return; wrap.innerHTML='';
  const done=cntDone(),total=cntTotal(),left=total-done,pct=total?Math.round(done/total*100):0;
  const score=readinessScore();

  // ETA card
  const eta=calcETA();
  const etaCard=document.createElement('div'); etaCard.className='eta-card full';
  etaCard.innerHTML='<div style="font-family:var(--mono);font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📅 Estimated Completion</div>'
    +(eta?'<div class="eta-main">'+eta.eta+'</div><div class="eta-sub">'+eta.daysLeft+' days away at '+eta.avgPerDay+' tasks/day (based on last 7 active days)</div>':'<div class="eta-main" style="color:var(--sub);">Not enough data</div><div class="eta-sub">Complete tasks on at least 2 different days to see your ETA.</div>');
  wrap.appendChild(etaCard);

  // Interview readiness
  const scoreCard=document.createElement('div'); scoreCard.className='dash-card';
  scoreCard.innerHTML='<div class="dash-card-title">🎯 Interview Readiness</div>'
    +'<div class="readiness-ring"><div>'
      +'<div class="readiness-label" style="color:'+(score<40?'var(--red)':score<70?'var(--amber)':'var(--green)')+'">'+score+'%</div>'
      +'<div class="readiness-sub">Quiz 35% · Project 35%<br>Code 20% · Concept 10%</div>'
    +'</div>'
    +'<div style="flex:1;">'
      +'<div style="font-size:12px;color:var(--sub);margin-bottom:8px;">'+(score<40?'🔴 Keep studying — not ready yet':score<70?'🟡 Getting there — focus on quizzes and projects':'🟢 Strong readiness — start applying!')+'</div>'
      +'<div class="readiness-track"><div class="readiness-fill" style="width:'+score+'%"></div></div>'
    +'</div></div>';
  wrap.appendChild(scoreCard);

  // Study hours
  const hoursCard=document.createElement('div'); hoursCard.className='dash-card';
  hoursCard.innerHTML='<div class="dash-card-title">⏱ Study Hours (Pomodoro)</div><div class="study-hours">'+studyHours()+'h</div><div style="text-align:center;font-size:12px;color:var(--sub);">'+(S._pomoSessions||0)+' sessions × 25 min<br>Target: 8–10 hrs/day = '+(8*60/25|0)+'–'+(10*60/25|0)+' sessions</div>';
  wrap.appendChild(hoursCard);

  // Phase breakdown
  const phCard=document.createElement('div'); phCard.className='dash-card full';
  phCard.innerHTML='<div class="dash-card-title">Phase Breakdown</div>';
  PHASES.forEach(function(ph,pi){
    const phTotal=ph.data.reduce(function(a,d,di){return a+dayTotal(pi,di);},0);
    const phDone=ph.data.reduce(function(a,d,di){return a+dayDone(pi,di);},0);
    const phPct=phTotal?Math.round(phDone/phTotal*100):0;
    const row=document.createElement('div'); row.className='phase-bar-row';
    row.innerHTML='<div class="pbr-label"><span class="pbr-name">'+ph.icon+' '+ph.title+'</span><span class="pbr-pct">'+phDone+'/'+phTotal+' · '+phPct+'%</span></div><div class="pbr-track"><div class="pbr-fill" style="width:'+phPct+'%;background:'+ph.color+'"></div></div>';
    phCard.appendChild(row);
  });
  wrap.appendChild(phCard);

  // Task type breakdown
  const {tot,don}=typeCounts();
  const typeCard=document.createElement('div'); typeCard.className='dash-card';
  typeCard.innerHTML='<div class="dash-card-title">Task Types</div><div class="type-grid" id="type-grid"></div>';
  [{k:'concept',name:'Concepts',color:'#4fa8ff'},{k:'code',name:'Coding',color:'#00d9a0'},{k:'quiz',name:'Quizzes',color:'#ffc850'},{k:'project',name:'Projects',color:'#b98aff'}].forEach(function(s){
    const d=don[s.k]||0,t=tot[s.k]||0,p=t?Math.round(d/t*100):0;
    const item=document.createElement('div'); item.className='type-item';
    item.innerHTML='<div class="type-item-name" style="color:'+s.color+'">'+s.name+'</div><div class="type-item-count" style="color:'+s.color+'">'+d+'<span style="font-size:13px;color:var(--sub);">/'+t+'</span></div><div class="mini-bar"><div class="mini-fill" style="width:'+p+'%;background:'+s.color+'"></div></div><div class="type-item-sub">'+p+'% complete</div>';
    typeCard.querySelector('#type-grid').appendChild(item);
  });
  wrap.appendChild(typeCard);

  // Ring chart
  const ringCard=document.createElement('div'); ringCard.className='dash-card';
  const circ=2*Math.PI*54;
  ringCard.innerHTML='<div class="dash-card-title">Overall Progress</div><div style="display:flex;align-items:center;justify-content:center;padding:12px 0;"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r="54" fill="none" stroke="var(--border)" stroke-width="9"/><circle cx="65" cy="65" r="54" fill="none" stroke="url(#rg3)" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+(circ*(1-pct/100))+'" transform="rotate(-90 65 65)"/><defs><linearGradient id="rg3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7864ff"/><stop offset="100%" stop-color="#00d9a0"/></linearGradient></defs><text x="65" y="60" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="20" font-weight="700" fill="var(--text)">'+pct+'%</text><text x="65" y="76" text-anchor="middle" font-family="Outfit,sans-serif" font-size="11" fill="var(--sub)">complete</text></svg></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center;"><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--green);">'+done+'</div><div style="font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:.8px;">Done</div></div><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--red);">'+left+'</div><div style="font-size:10px;color:var(--sub);text-transform:uppercase;letter-spacing:.8px;">Left</div></div></div>';
  wrap.appendChild(ringCard);

  // Heatmap
  const hmCard=document.createElement('div'); hmCard.className='dash-card full';
  hmCard.innerHTML='<div class="dash-card-title">Day Completion Heatmap — all '+allDays().length+' days</div><div class="hm-grid" id="hm-grid"></div><div style="display:flex;gap:6px;align-items:center;margin-top:8px;font-family:var(--mono);font-size:10px;color:var(--sub);">0% <div class="hm-cell" style="width:12px;height:12px;flex-shrink:0;"></div><div class="hm-cell l1" style="width:12px;height:12px;flex-shrink:0;"></div><div class="hm-cell l2" style="width:12px;height:12px;flex-shrink:0;"></div><div class="hm-cell l3" style="width:12px;height:12px;flex-shrink:0;"></div><div class="hm-cell l4" style="width:12px;height:12px;flex-shrink:0;"></div> 100%</div>';
  allDays().forEach(function(item){
    const p=dayPct(item.pi,item.di),lvl=p===0?0:p<25?1:p<50?2:p<100?3:4;
    const cell=document.createElement('div'); cell.className='hm-cell'+(lvl?' l'+lvl:''); cell.setAttribute('data-tip',item.d.day+' · '+p+'%');
    hmCard.querySelector('#hm-grid').appendChild(cell);
  });
  wrap.appendChild(hmCard);

  // Streak calendar
  const sCard=document.createElement('div'); sCard.className='dash-card full';
  sCard.innerHTML='<div class="dash-card-title">🔥 Streak — '+(S._streak||0)+' day'+(S._streak!==1?'s':'')+' in a row</div><div class="streak-row" id="srow"></div><p style="font-size:12px;color:var(--sub);margin-top:12px;">Complete at least one task every day. Consistency beats intensity every time.</p>';
  const history=S._history||{},today=new Date();
  for(let i=13;i>=0;i--){
    const d=new Date(today); d.setDate(today.getDate()-i);
    const key=d.toDateString(),active=!!(history[key]&&history[key]>0),isToday=i===0;
    const el=document.createElement('div'); el.className='s-day'+(active?' on':'')+(isToday?' today':'');
    el.textContent=d.getDate(); el.title=key+(active?' — '+history[key]+' tasks':'');
    sCard.querySelector('#srow').appendChild(el);
  }
  wrap.appendChild(sCard);
}

// ══════════════════════════════════════════════
// VIEW 5 — JOB TRACKER
// ══════════════════════════════════════════════
const JOB_COLS=[
  {key:'applied',   label:'Applied',      emoji:'📤', color:'#7070a0'},
  {key:'phone',     label:'Phone Screen', emoji:'📞', color:'#4fa8ff'},
  {key:'technical', label:'Technical',    emoji:'💻', color:'#ffc850'},
  {key:'offer',     label:'Offer',        emoji:'🎉', color:'#00d9a0'},
  {key:'rejected',  label:'Rejected',     emoji:'✗',  color:'#ff6060'},
];
const JOB_SOURCES=['LinkedIn','Naukri','Wellfound','Company site','Referral','Other'];

function renderJobs() {
  const wrap=document.getElementById('jobs-wrap'); if(!wrap) return; wrap.innerHTML='';
  const jobs=getJobs();
  JOB_COLS.forEach(function(col){
    const colJobs=jobs.filter(function(j){return j.status===col.key;});
    const colEl=document.createElement('div'); colEl.className='jk-col';
    const hdr=document.createElement('div'); hdr.className='jk-col-hdr';
    hdr.innerHTML='<span class="jk-col-title" style="color:'+col.color+'">'+col.emoji+' '+col.label+'</span><span class="jk-count">'+colJobs.length+'</span>';
    colEl.appendChild(hdr);
    const body=document.createElement('div'); body.className='jk-body';
    if(!colJobs.length){ body.innerHTML='<div style="text-align:center;padding:16px 8px;font-size:12px;color:var(--sub);">Empty</div>'; }
    else {
      colJobs.forEach(function(job){
        const card=document.createElement('div'); card.className='job-card'; card.style.setProperty('--jc',col.color);
        card.innerHTML='<div class="job-company">'+escHtml(job.company)+'</div><div class="job-role">'+escHtml(job.role)+'</div><div class="job-meta"><span class="job-source">'+escHtml(job.source||'')+'</span><span class="job-date">'+(job.appliedDate||'')+'</span></div>'+(job.notes?'<div style="font-size:11px;color:var(--sub);margin-top:6px;font-style:italic;">'+escHtml(job.notes.slice(0,80))+(job.notes.length>80?'…':'')+'</div>':'');
        const actions=document.createElement('div'); actions.className='job-actions';
        // Move buttons
        const nexts=JOB_COLS.filter(function(c){return c.key!==col.key;}).slice(0,2);
        nexts.forEach(function(nc){
          const mb=document.createElement('button'); mb.className='job-action-btn'; mb.textContent='→ '+nc.label;
          mb.addEventListener('click',function(e){e.stopPropagation();moveJob(job.id,nc.key);renderJobs();renderJobStats();});
          actions.appendChild(mb);
        });
        const delB=document.createElement('button'); delB.className='job-action-btn del'; delB.textContent='✕';
        delB.addEventListener('click',function(e){e.stopPropagation();if(confirm('Delete '+job.company+'?')){deleteJob(job.id);renderJobs();renderJobStats();}});
        actions.appendChild(delB);
        card.appendChild(actions);
        body.appendChild(card);
      });
    }
    colEl.appendChild(body); wrap.appendChild(colEl);
  });
}

function renderJobStats() {
  const jobs=getJobs(), total=jobs.length;
  const statsEl=document.getElementById('job-stats');
  if(!statsEl) return;
  const applied=jobs.filter(function(j){return j.status==='applied';}).length;
  const technical=jobs.filter(function(j){return j.status==='technical';}).length;
  const offers=jobs.filter(function(j){return j.status==='offer';}).length;
  const rate=total?Math.round(offers/total*100):0;
  statsEl.innerHTML='<div data-stat-j="total"><span class="sc-num">'+total+'</span><div class="sc-lbl">Applied</div></div>'
    +'<div data-stat-j="tech"><span class="sc-num" style="color:var(--amber)">'+technical+'</span><div class="sc-lbl">Technical</div></div>'
    +'<div data-stat-j="offers"><span class="sc-num" style="color:var(--green)">'+offers+'</span><div class="sc-lbl">Offers</div></div>'
    +'<div data-stat-j="rate"><span class="sc-num" style="color:var(--purple)">'+rate+'%</span><div class="sc-lbl">Offer Rate</div></div>';
}

function escHtml(str) {
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function openAddJob() { document.getElementById('job-modal').classList.add('open'); }
function closeAddJob() { document.getElementById('job-modal').classList.remove('open'); }

function initJobModal() {
  document.getElementById('job-modal').addEventListener('click',function(e){if(e.target===this)closeAddJob();});
  document.getElementById('jm-cancel').addEventListener('click',closeAddJob);
  document.getElementById('job-add-btn').addEventListener('click',openAddJob);
  document.getElementById('jm-save').addEventListener('click',function(){
    const company=document.getElementById('jm-company').value.trim();
    const role=document.getElementById('jm-role').value.trim();
    if(!company||!role){alert('Company and role are required.');return;}
    addJob({
      company, role,
      source:document.getElementById('jm-source').value,
      status:'applied',
      notes:document.getElementById('jm-notes').value.trim(),
      appliedDate:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'}),
    });
    document.getElementById('jm-company').value='';
    document.getElementById('jm-role').value='';
    document.getElementById('jm-notes').value='';
    closeAddJob(); renderJobs(); renderJobStats();
  });
}

// ══════════════════════════════════════════════
// VIEW SWITCHER
// ══════════════════════════════════════════════
function showView(v) {
  curView=v;
  document.querySelectorAll('.view').forEach(function(el){el.classList.remove('active');});
  document.querySelectorAll('.nav-tab').forEach(function(el){el.classList.remove('active');});
  const vEl=document.getElementById('view-'+v), tEl=document.querySelector('[data-view="'+v+'"]');
  if(vEl) vEl.classList.add('active');
  if(tEl) tEl.classList.add('active');
  if(v==='roadmap') renderRoadmap(curFilter,curSearch);
  if(v==='kanban')  renderKanban();
  if(v==='focus')   { detectFocusDay(); renderFocusNav(); renderFocusHero(); }
  if(v==='stats')   renderStatsView();
  if(v==='jobs')    { renderJobs(); renderJobStats(); }
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',function(){
  // Nav tabs
  document.querySelectorAll('.nav-tab').forEach(function(btn){
    btn.addEventListener('click',function(){showView(btn.getAttribute('data-view'));});
  });
  // Phase filter
  const ptabs=document.getElementById('phase-tabs');
  if(ptabs){ ptabs.addEventListener('click',function(e){const b=e.target.closest('[data-phase]');if(!b)return;curFilter=b.getAttribute('data-phase');ptabs.querySelectorAll('.pill').forEach(function(p){p.classList.remove('active');});b.classList.add('active');renderRoadmap(curFilter,curSearch);}); }
  // Search
  const si=document.getElementById('search'); let st;
  if(si){ si.addEventListener('input',function(e){clearTimeout(st);st=setTimeout(function(){curSearch=e.target.value;renderRoadmap(curFilter,curSearch);},200);}); }
  // Kanban filter
  const kf=document.getElementById('kb-filter');
  if(kf){ kf.addEventListener('click',function(e){const b=e.target.closest('[data-phase]');if(!b)return;kbPhase=b.getAttribute('data-phase');kf.querySelectorAll('.pill').forEach(function(p){p.classList.remove('active');});b.classList.add('active');renderKanban();}); }
  // Theme
  document.getElementById('theme-btn').addEventListener('click',toggleTheme);
  // Reset
  const rb=document.getElementById('reset-btn');
  if(rb) rb.addEventListener('click',function(){if(confirm('Reset ALL learning progress? Jobs tracker is kept.\nThis cannot be undone.')){const jobs=S._jobs;S={};if(jobs)S._jobs=jobs;save();updateStats();showView(curView);}});
  // Pomodoro init
  initPomo();
  // Job modal
  initJobModal();
  // AI Brief (focus view)
  initBrief();
  // Theme + load
  const saved=localStorage.getItem(TK);
  setTheme(saved||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
  load(); updateStats(); showView('roadmap');
});
