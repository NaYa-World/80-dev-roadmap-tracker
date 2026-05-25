// ═══════════════════════════════════════════════
// VIEWS v5 — Roadmap, Kanban, Focus, Stats,
//            Jobs, Q-Bank, Report, GitHub
// ═══════════════════════════════════════════════
let curView   = 'roadmap';
let curFilter = 'all';
let curSearch = '';
let searchFilters = { types:[], statusOnly:'' }; // Search 2.0
let focusDay  = 0;
let kbPhase   = 'all';
let reportWeekOffset = 0;

// ══════════ VIEW 1: ROADMAP ══════════
function renderRoadmap(filter, search) {
  const wrap=document.getElementById('roadmap-wrap'); if(!wrap) return; wrap.innerHTML='';
  PHASES.forEach(function(ph,pi){
    if(filter!=='all'&&parseInt(filter)!==pi) return;
    const phTotal=ph.data.reduce(function(a,d,di){return a+dayTotal(pi,di);},0);
    const phDone=ph.data.reduce(function(a,d,di){return a+dayDone(pi,di);},0);
    const phPct=phTotal?Math.round(phDone/phTotal*100):0;
    const isOpen=S['po'+pi]!==false, isComp=phDone===phTotal&&phTotal>0;
    const card=document.createElement('div'); card.className='phase-card';
    card.style.setProperty('--pc',ph.color); card.style.setProperty('--pcd',ph.dim);
    card.innerHTML=
      '<div class="phase-hdr" id="phdr'+pi+'">'
        +'<div class="phase-icon">'+ph.icon+'</div>'
        +'<div style="flex:1;min-width:0;">'
          +'<div class="phase-title">'+ph.title+'</div>'
          +'<div class="phase-meta-txt">'+ph.days+' · '+phDone+'/'+phTotal+' tasks</div>'
          +'<div class="mini-bar"><div class="mini-fill" style="width:'+phPct+'%;background:'+ph.color+'"></div></div>'
        +'</div>'
        +(isComp?'<div class="done-pill">✓ done</div>':'<span style="font-family:var(--mono);font-size:11px;padding:3px 10px;border-radius:10px;background:var(--border);color:var(--sub);">'+phPct+'%</span>')
        +'<svg id="ch'+pi+'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--sub);flex-shrink:0;transition:transform .3s;transform:rotate('+(isOpen?180:0)+'deg)"><polyline points="6 9 12 15 18 9"/></svg>'
      +'</div>'
      +'<div class="phase-body'+(isOpen?' open':'')+'" id="pb'+pi+'"><div class="phase-body-inner" id="pbi'+pi+'"></div></div>';
    card.querySelector('#phdr'+pi).addEventListener('click',function(){doPhase(pi);});
    const inner=card.querySelector('#pbi'+pi);
    ph.data.forEach(function(d,di){
      // Apply search + filter
      const sl=search.toLowerCase();
      const typeOk=searchFilters.types.length===0||d.tasks.some(function(t){return searchFilters.types.includes(t.k);});
      const statusOk=!searchFilters.statusOnly||(searchFilters.statusOnly==='incomplete'?dayDone(pi,di)<dayTotal(pi,di):dayDone(pi,di)===dayTotal(pi,di));
      const textOk=!search||d.tasks.some(function(t){return t.t.toLowerCase().includes(sl)||d.label.toLowerCase().includes(sl)||d.day.toLowerCase().includes(sl);});
      if(!typeOk||!statusOk||!textOk) return;
      const dDone=dayDone(pi,di),dTotal=dayTotal(pi,di),allDone=dDone===dTotal,dayOpen=S['do'+pi+'_'+di]!==false;
      const dayBlock=document.createElement('div'); dayBlock.className='day-block'+(allDone?' all-done':'');
      const avgConf=dayAvgConf(pi,di);
      const confDisplay=avgConf>0?'⭐'+avgConf.toFixed(1):'';
      const dayHdr=document.createElement('div'); dayHdr.className='day-hdr';
      dayHdr.innerHTML=
        '<span class="day-tag">'+d.day+'</span>'
        +'<span class="day-label">'+d.label+'</span>'
        +'<span class="day-count" style="color:'+(allDone?'var(--green)':'var(--sub)')+'">'+dDone+'/'+dTotal+(allDone?' ✓':'')+(hasNote(pi,di)?' 📝':'')+(confDisplay?' '+confDisplay:'')+'</span>'
        +'<svg class="day-chev'+(dayOpen?' open':'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
      const tasksWrap=document.createElement('div'); tasksWrap.className='day-tasks'+(dayOpen?' open':'');
      const tasksInner=document.createElement('div'); tasksInner.className='day-tasks-inner';
      d.tasks.forEach(function(task,ti){
        if(search&&!task.t.toLowerCase().includes(sl)&&!d.label.toLowerCase().includes(sl)&&!d.day.toLowerCase().includes(sl)) return;
        if(searchFilters.types.length>0&&!searchFilters.types.includes(task.k)) return;
        tasksInner.appendChild(makeTaskRow(pi,di,ti));
      });
      tasksInner.appendChild(buildNotesWidget(pi,di));
      // Code review widget for code-heavy days
      if(d.tasks.some(function(t){return t.k==='code'||t.k==='project';}))
        tasksInner.appendChild(buildCodeReviewWidget(d,pi,di));
      tasksInner.appendChild(buildQuizCard(d));
      tasksWrap.appendChild(tasksInner);
      (function(a,b,h,tw){
        h.addEventListener('click',function(){const open=tw.classList.toggle('open');S['do'+a+'_'+b]=open;save();const chev=h.querySelector('.day-chev');if(chev)chev.classList.toggle('open',open);});
      })(pi,di,dayHdr,tasksWrap);
      dayBlock.appendChild(dayHdr); dayBlock.appendChild(tasksWrap); inner.appendChild(dayBlock);
    });
    wrap.appendChild(card);
  });
}
function doPhase(pi){
  S['po'+pi]=S['po'+pi]===false?true:false; save(); renderRoadmap(curFilter,curSearch);
}

// ══════════ VIEW 2: KANBAN ══════════
function renderKanban() {
  const wrap=document.getElementById('kanban-wrap'); if(!wrap) return; wrap.innerHTML='';
  const cols={backlog:[],inprogress:[],review:[],done:[]};
  PHASES.forEach(function(ph,pi){
    if(kbPhase!=='all'&&parseInt(kbPhase)!==pi) return;
    ph.data.forEach(function(d,di){cols[dayStatus(pi,di)].push({ph,pi,d,di});});
  });
  [{key:'backlog',label:'Backlog',emoji:'○'},{key:'inprogress',label:'In Progress',emoji:'◑'},{key:'review',label:'Review',emoji:'◕'},{key:'done',label:'Done',emoji:'●'}]
  .forEach(function(col){
    const colEl=document.createElement('div'); colEl.className='k-col'; colEl.setAttribute('data-s',col.key);
    const items=cols[col.key];
    colEl.innerHTML='<div class="k-col-hdr"><span class="k-col-title">'+col.emoji+' '+col.label+'</span><span class="k-count">'+items.length+'</span></div>';
    const body=document.createElement('div'); body.className='k-body';
    if(!items.length){body.innerHTML='<div class="k-empty">Empty</div>';}
    else{
      items.forEach(function(item){
        const card=document.createElement('div'); card.className='k-card'; card.style.setProperty('--kc',item.ph.color);
        const dDone=dayDone(item.pi,item.di),dTotal=dayTotal(item.pi,item.di),pct=dTotal?Math.round(dDone/dTotal*100):0;
        const avgConf=dayAvgConf(item.pi,item.di);
        const confIco=avgConf>=4?'🟢':avgConf>=3?'🟡':avgConf>0?'🔴':'';
        card.innerHTML='<div class="k-card-day">'+item.ph.icon+' '+item.d.day+'</div><div class="k-card-label">'+item.d.label+'</div><div class="k-card-meta"><span class="badge" style="background:'+item.ph.dim+';color:'+item.ph.color+';border:1px solid '+item.ph.color+'44">'+item.d.tasks.length+' tasks</span>'+(hasNote(item.pi,item.di)?'<span class="k-has-notes">📝</span>':'')+(confIco?'<span style="font-size:13px;" title="Avg confidence">'+confIco+'</span>':'')+'<span class="k-pct">'+dDone+'/'+dTotal+' · '+pct+'%</span></div><div class="mini-bar" style="margin-top:8px;"><div class="mini-fill" style="width:'+pct+'%;background:'+item.ph.color+'"></div></div>';
        (function(a,b){card.addEventListener('click',function(){S['po'+a]=true;S['do'+a+'_'+b]=true;save();showView('roadmap');setTimeout(function(){const el=document.querySelector('#pbi'+a+' .day-block:nth-child('+(b+1)+')');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},250);});
        })(item.pi,item.di);
        body.appendChild(card);
      });
    }
    colEl.appendChild(body); wrap.appendChild(colEl);
  });
}

// ══════════ VIEW 3: FOCUS ══════════
function detectFocusDay(){
  const days=allDays();
  for(let i=0;i<days.length;i++){if(dayDone(days[i].pi,days[i].di)<dayTotal(days[i].pi,days[i].di)){focusDay=i;return;}}
  focusDay=days.length-1;
}
function renderFocusNav(){
  const nav=document.getElementById('focus-nav'); if(!nav) return; nav.innerHTML='';
  const days=allDays();
  const prev=document.createElement('button'); prev.className='focus-pill'; prev.textContent='← Prev';
  prev.addEventListener('click',function(){if(focusDay>0){focusDay--;renderFocusNav();renderFocusHero();}});
  const next=document.createElement('button'); next.className='focus-pill'; next.textContent='Next →';
  next.addEventListener('click',function(){if(focusDay<days.length-1){focusDay++;renderFocusNav();renderFocusHero();}});
  const lbl=document.createElement('span'); lbl.style.cssText='font-family:var(--mono);font-size:11px;color:var(--sub);text-transform:uppercase;letter-spacing:1px;margin-left:auto;';
  lbl.textContent='Day '+(focusDay+1)+' of '+days.length;
  nav.appendChild(prev); nav.appendChild(next); nav.appendChild(lbl);
  const pills=document.createElement('div'); pills.style.cssText='display:flex;gap:4px;flex-wrap:wrap;width:100%;margin-top:10px;';
  let fi=0;
  PHASES.forEach(function(ph,pi){
    ph.data.forEach(function(d,di){
      (function(idx){
        const b=document.createElement('button');
        b.className='focus-pill'+(idx===focusDay?' active':'');
        b.style.cssText='padding:4px 8px;font-size:10px;border-left:3px solid '+ph.color+';';
        if(idx===focusDay){b.style.background=ph.color;b.style.color='#000';}
        b.textContent=d.day.replace('Days ','').split('-')[0]; b.title=d.label;
        b.addEventListener('click',function(){focusDay=idx;renderFocusNav();renderFocusHero();});
        pills.appendChild(b);
      })(fi++);
    });
  });
  nav.appendChild(pills);
}
function renderFocusHero(){
  const days=allDays(); const idx=Math.max(0,Math.min(focusDay,days.length-1));
  const {ph,pi,d,di}=days[idx];
  const dDone=dayDone(pi,di),dTotal=dayTotal(pi,di),pct=dTotal?Math.round(dDone/dTotal*100):0;
  const tag=document.getElementById('focus-tag');
  if(tag){tag.textContent=d.day+' · '+(ph.title.includes('—')?ph.title.split('—')[1].trim():ph.title);tag.style.color=ph.color;tag.style.borderColor=ph.color+'55';tag.style.background=ph.dim;}
  const titleEl=document.getElementById('focus-title'); if(titleEl) titleEl.textContent=d.label;
  const metaEl=document.getElementById('focus-meta'); if(metaEl) metaEl.textContent=ph.title+' · '+dDone+'/'+dTotal+' tasks done';
  ['focus-done','focus-left','focus-pct'].forEach(function(id,i){
    const el=document.getElementById(id); if(!el) return;
    el.textContent=[dDone,dTotal-dDone,pct+'%'][i]; el.style.color=i!==1?ph.color:'';
  });
  const fp=document.getElementById('focus-prog'); if(fp){fp.style.width=pct+'%';fp.style.background=ph.color;}
  const countEl=document.getElementById('focus-count'); if(countEl) countEl.textContent=dDone+'/'+dTotal+' done';
  const body=document.getElementById('focus-body'); if(!body) return; body.innerHTML='';
  d.tasks.forEach(function(task,ti){body.appendChild(makeTaskRow(pi,di,ti));});
  body.appendChild(buildNotesWidget(pi,di));
  if(d.tasks.some(function(t){return t.k==='code'||t.k==='project';})) body.appendChild(buildCodeReviewWidget(d,pi,di));
  body.appendChild(buildQuizCard(d));
}

// ══════════ VIEW 4: STATS ══════════
function renderStatsView(){
  const wrap=document.getElementById('stats-wrap'); if(!wrap) return; wrap.innerHTML='';
  const done=cntDone(),total=cntTotal(),left=total-done,pct=total?Math.round(done/total*100):0;
  const score=readinessScore(),eta=calcETA();
  // ETA
  const etaCard=document.createElement('div'); etaCard.className='eta-card full';
  etaCard.innerHTML='<div style="font-family:var(--mono);font-size:11px;color:var(--sub);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">📅 Estimated Completion</div>'+(eta?'<div class="eta-main">'+eta.eta+'</div><div class="eta-sub">'+eta.daysLeft+' days away at '+eta.avgPerDay+' tasks/day (7-day avg)</div>':'<div class="eta-main" style="color:var(--sub)">Not enough data yet</div><div class="eta-sub">Complete tasks on at least 2 different days to see ETA.</div>');
  wrap.appendChild(etaCard);
  // Readiness + ring in a grid row
  const twoCol=document.createElement('div'); twoCol.className='dash-grid'; twoCol.style.marginBottom='16px';
  // Readiness score
  const scoreCard=document.createElement('div'); scoreCard.className='dash-card';
  scoreCard.innerHTML='<div class="dash-card-title">🎯 Interview Readiness</div><div style="font-size:42px;font-weight:800;font-family:var(--mono);color:'+(score<40?'var(--red)':score<70?'var(--amber)':'var(--green)')+'">'+score+'%</div><div style="font-size:13px;color:var(--sub);margin:8px 0 12px">'+(score<40?'🔴 Not ready yet — focus on quizzes and projects':score<70?'🟡 Getting there — push through the hard phases':'🟢 Strong readiness — start applying now!')+'</div><div style="font-size:12px;color:var(--sub);margin-bottom:10px">Weighted: Quiz 35% · Project 35% · Code 20% · Concept 10%<br>Low-confidence tasks reduce score.</div><div class="readiness-track"><div class="readiness-fill" style="width:'+score+'%"></div></div>';
  twoCol.appendChild(scoreCard);
  // Study hours
  const hoursCard=document.createElement('div'); hoursCard.className='dash-card';
  hoursCard.innerHTML='<div class="dash-card-title">⏱ Study Hours</div><div class="study-hours">'+studyHours()+'h</div><div style="text-align:center;font-size:13px;color:var(--sub);">'+(S._pomoSessions||0)+' Pomodoro sessions × 25 min<br><br>Daily target: 8–10 hrs = 19–24 sessions</div>';
  twoCol.appendChild(hoursCard);
  wrap.appendChild(twoCol);
  // Low confidence items
  const lowConf=lowConfTasks();
  if(lowConf.length>0){
    const confCard=document.createElement('div'); confCard.className='dash-card full';
    confCard.innerHTML='<div class="dash-card-title">⚠️ Low Confidence — Revise These</div>';
    lowConf.slice(0,8).forEach(function(item){
      const row=document.createElement('div'); row.className='confidence-low-row';
      const stars='★'.repeat(item.conf)+'☆'.repeat(5-item.conf);
      row.innerHTML='<span style="color:var(--red);font-family:var(--mono);font-size:12px">'+stars+'</span><span style="font-size:13px;flex:1">'+item.task.t.slice(0,80)+'</span><span style="font-family:var(--mono);font-size:11px;color:var(--sub)">'+item.d.day+'</span>';
      confCard.appendChild(row);
    });
    if(lowConf.length>8){ const more=document.createElement('div'); more.style.cssText='font-size:12px;color:var(--sub);margin-top:8px;'; more.textContent='+'+(lowConf.length-8)+' more low-confidence tasks'; confCard.appendChild(more); }
    wrap.appendChild(confCard);
  }
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
  // Type breakdown
  const {tot,don}=typeCounts();
  const typeCard=document.createElement('div'); typeCard.className='dash-card';
  typeCard.innerHTML='<div class="dash-card-title">Task Types</div><div class="type-grid" id="type-grid"></div>';
  [{k:'concept',name:'Concepts',color:'#4fa8ff'},{k:'code',name:'Coding',color:'#00d9a0'},{k:'quiz',name:'Quizzes',color:'#ffc850'},{k:'project',name:'Projects',color:'#b98aff'}].forEach(function(s){
    const d=don[s.k]||0,t=tot[s.k]||0,p=t?Math.round(d/t*100):0;
    const item=document.createElement('div'); item.className='type-item';
    item.innerHTML='<div class="type-item-name" style="color:'+s.color+'">'+s.name+'</div><div class="type-item-count" style="color:'+s.color+'">'+d+'<span style="font-size:14px;color:var(--sub)">/'+t+'</span></div><div class="mini-bar"><div class="mini-fill" style="width:'+p+'%;background:'+s.color+'"></div></div><div class="type-item-sub">'+p+'% complete</div>';
    typeCard.querySelector('#type-grid').appendChild(item);
  });
  wrap.appendChild(typeCard);
  // Ring
  const circ=2*Math.PI*54;
  const ringCard=document.createElement('div'); ringCard.className='dash-card';
  ringCard.innerHTML='<div class="dash-card-title">Overall</div><div style="display:flex;align-items:center;justify-content:center;padding:10px 0"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r="54" fill="none" stroke="var(--border)" stroke-width="9"/><circle cx="65" cy="65" r="54" fill="none" stroke="url(#rg5)" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+(circ*(1-pct/100))+'" transform="rotate(-90 65 65)"/><defs><linearGradient id="rg5" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7864ff"/><stop offset="100%" stop-color="#00d9a0"/></linearGradient></defs><text x="65" y="60" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="20" font-weight="700" fill="var(--text)">'+pct+'%</text><text x="65" y="76" text-anchor="middle" font-family="Outfit,sans-serif" font-size="11" fill="var(--sub)">complete</text></svg></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:center"><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--green)">'+done+'</div><div style="font-size:11px;color:var(--sub);text-transform:uppercase;letter-spacing:.8px">Done</div></div><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--red)">'+left+'</div><div style="font-size:11px;color:var(--sub);text-transform:uppercase;letter-spacing:.8px">Left</div></div></div>';
  wrap.appendChild(ringCard);
  // Heatmap
  const hmCard=document.createElement('div'); hmCard.className='dash-card full';
  hmCard.innerHTML='<div class="dash-card-title">Day Completion Heatmap</div><div class="hm-grid" id="hm-grid"></div><div style="display:flex;gap:6px;align-items:center;margin-top:8px;font-family:var(--mono);font-size:11px;color:var(--sub)">0% <div class="hm-cell" style="width:12px;height:12px;flex-shrink:0"></div><div class="hm-cell l1" style="width:12px;height:12px;flex-shrink:0"></div><div class="hm-cell l2" style="width:12px;height:12px;flex-shrink:0"></div><div class="hm-cell l3" style="width:12px;height:12px;flex-shrink:0"></div><div class="hm-cell l4" style="width:12px;height:12px;flex-shrink:0"></div> 100%</div>';
  allDays().forEach(function(item){
    const p=dayPct(item.pi,item.di),lvl=p===0?0:p<25?1:p<50?2:p<100?3:4;
    const cell=document.createElement('div'); cell.className='hm-cell'+(lvl?' l'+lvl:''); cell.title=item.d.day+' · '+p+'%';
    hmCard.querySelector('#hm-grid').appendChild(cell);
  });
  wrap.appendChild(hmCard);
  // Streak
  const sCard=document.createElement('div'); sCard.className='dash-card full';
  sCard.innerHTML='<div class="dash-card-title">🔥 Streak — '+(S._streak||0)+' day'+(S._streak!==1?'s':'')+' in a row</div><div class="streak-row" id="srow"></div><p style="font-size:13px;color:var(--sub);margin-top:12px">Complete at least one task every day. Consistency beats intensity.</p>';
  const hist=S._history||{},today=new Date();
  for(let i=13;i>=0;i--){
    const d=new Date(today); d.setDate(today.getDate()-i);
    const key=d.toDateString(),active=!!(hist[key]&&hist[key]>0),isToday=i===0;
    const el=document.createElement('div'); el.className='s-day'+(active?' on':'')+(isToday?' today':'');
    el.textContent=d.getDate(); el.title=key+(active?' — '+hist[key]+' tasks':'');
    sCard.querySelector('#srow').appendChild(el);
  }
  wrap.appendChild(sCard);
}

// ══════════ VIEW 5: JOBS ══════════
const JOB_COLS=[
  {key:'applied',label:'Applied',emoji:'📤',color:'#7070a0'},
  {key:'phone',label:'Phone Screen',emoji:'📞',color:'#4fa8ff'},
  {key:'technical',label:'Technical',emoji:'💻',color:'#ffc850'},
  {key:'offer',label:'Offer 🎉',emoji:'',color:'#00d9a0'},
  {key:'rejected',label:'Rejected',emoji:'✗',color:'#ff6060'},
];
function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function renderJobs(){
  const wrap=document.getElementById('jobs-wrap'); if(!wrap) return; wrap.innerHTML='';
  const jobs=getJobs();
  JOB_COLS.forEach(function(col){
    const colJobs=jobs.filter(function(j){return j.status===col.key;});
    const colEl=document.createElement('div'); colEl.className='jk-col';
    colEl.innerHTML='<div class="jk-col-hdr"><span class="jk-col-title" style="color:'+col.color+'">'+col.emoji+' '+col.label+'</span><span class="jk-count">'+colJobs.length+'</span></div>';
    const body=document.createElement('div'); body.className='jk-body';
    if(!colJobs.length){body.innerHTML='<div style="text-align:center;padding:16px;font-size:13px;color:var(--sub)">Empty</div>';}
    else{
      colJobs.forEach(function(job){
        const card=document.createElement('div'); card.className='job-card'; card.style.setProperty('--jc',col.color);
        card.innerHTML='<div class="job-company">'+escHtml(job.company)+'</div><div class="job-role">'+escHtml(job.role)+'</div><div class="job-meta"><span class="job-source">'+escHtml(job.source||'')+'</span><span class="job-date">'+(job.appliedDate||'')+'</span></div>'+(job.notes?'<div style="font-size:12px;color:var(--sub);margin-top:6px;font-style:italic">'+escHtml(job.notes.slice(0,80))+(job.notes.length>80?'…':'')+'</div>':'');
        const actions=document.createElement('div'); actions.className='job-actions';
        JOB_COLS.filter(function(c){return c.key!==col.key;}).slice(0,2).forEach(function(nc){
          const mb=document.createElement('button'); mb.className='job-action-btn'; mb.textContent='→ '+nc.label;
          mb.addEventListener('click',function(e){e.stopPropagation();moveJob(job.id,nc.key);renderJobs();renderJobStats();});
          actions.appendChild(mb);
        });
        const delB=document.createElement('button'); delB.className='job-action-btn del'; delB.textContent='✕';
        delB.addEventListener('click',function(e){e.stopPropagation();if(confirm('Delete '+job.company+'?')){deleteJob(job.id);renderJobs();renderJobStats();}});
        actions.appendChild(delB); card.appendChild(actions); body.appendChild(card);
      });
    }
    colEl.appendChild(body); wrap.appendChild(colEl);
  });
}
function renderJobStats(){
  const jobs=getJobs(),total=jobs.length;
  const el=document.getElementById('job-stats'); if(!el) return;
  const tech=jobs.filter(function(j){return j.status==='technical';}).length;
  const offers=jobs.filter(function(j){return j.status==='offer';}).length;
  const rate=total?Math.round(offers/total*100):0;
  el.innerHTML='<div class="sc"><div class="sc-num">'+total+'</div><div class="sc-lbl">Applied</div></div><div class="sc"><div class="sc-num" style="color:var(--amber)">'+tech+'</div><div class="sc-lbl">Technical</div></div><div class="sc"><div class="sc-num" style="color:var(--green)">'+offers+'</div><div class="sc-lbl">Offers</div></div><div class="sc"><div class="sc-num" style="color:var(--purple)">'+rate+'%</div><div class="sc-lbl">Offer Rate</div></div>';
}
function openAddJob(){document.getElementById('job-modal').classList.add('open');}
function closeAddJob(){document.getElementById('job-modal').classList.remove('open');}
function initJobModal(){
  document.getElementById('job-modal').addEventListener('click',function(e){if(e.target===this)closeAddJob();});
  document.getElementById('jm-cancel').addEventListener('click',closeAddJob);
  document.getElementById('jm-x').addEventListener('click',closeAddJob);
  document.getElementById('job-add-btn').addEventListener('click',openAddJob);
  document.getElementById('jm-save').addEventListener('click',function(){
    const company=document.getElementById('jm-company').value.trim();
    const role=document.getElementById('jm-role').value.trim();
    if(!company||!role){alert('Company and role are required.');return;}
    addJob({company,role,source:document.getElementById('jm-source').value,status:'applied',notes:document.getElementById('jm-notes').value.trim(),appliedDate:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'})});
    document.getElementById('jm-company').value='';document.getElementById('jm-role').value='';document.getElementById('jm-notes').value='';
    closeAddJob();renderJobs();renderJobStats();
  });
}

// ══════════ VIEW 6: Q-BANK ══════════
let qbSearch='';
let qbFilters={cats:[],diffs:[]};

function renderQBank(){
  const wrap=document.getElementById('qbank-wrap'); if(!wrap) return;
  const sl=qbSearch.toLowerCase();
  let qs=QUESTIONS.filter(function(q){
    const textOk=!sl||(q.q.toLowerCase().includes(sl)||q.hint.toLowerCase().includes(sl)||q.cat.toLowerCase().includes(sl));
    const catOk=qbFilters.cats.length===0||qbFilters.cats.some(function(c){return q.tags.includes(c);});
    const diffOk=qbFilters.diffs.length===0||qbFilters.diffs.some(function(d){return q.tags.includes(d);});
    return textOk&&catOk&&diffOk;
  });
  const lbl=document.getElementById('qbank-count');
  if(lbl) lbl.textContent='Showing '+qs.length+' of '+QUESTIONS.length+' questions';
  wrap.innerHTML='';
  if(!qs.length){wrap.innerHTML='<div style="text-align:center;padding:40px;color:var(--sub);font-size:15px">No questions match your filters.</div>';return;}
  qs.forEach(function(q,i){
    const done=qDone(q.id);
    const card=document.createElement('div'); card.className='q-card';
    if(done) card.style.opacity='.6';
    const hdr=document.createElement('div'); hdr.className='q-card-hdr';
    hdr.innerHTML='<span class="q-card-num">'+(i+1)+'</span><span class="q-card-text">'+q.q+'</span><div class="q-card-tags">'
      +q.tags.map(function(t){return '<span class="q-tag '+t+'">'+t+'</span>';}).join('')
      +'</div>'+(done?'<span style="color:var(--green);font-size:16px;flex-shrink:0">✓</span>':'');
    const body=document.createElement('div'); body.className='q-card-body';
    body.innerHTML='<div class="q-hint">💡 '+q.hint+'</div>';
    const actRow=document.createElement('div'); actRow.style.cssText='display:flex;gap:8px;flex-wrap:wrap;';
    const markBtn=document.createElement('button'); markBtn.className='q-open-claude'; markBtn.style.background=done?'rgba(0,217,160,.1)':'';
    markBtn.innerHTML=done?'✓ Mark incomplete':'✓ Mark as practiced';
    markBtn.addEventListener('click',function(){toggleQ(q.id);renderQBank();});
    const openBtn=document.createElement('button'); openBtn.className='q-open-claude';
    openBtn.innerHTML='↗ Practice in Claude';
    openBtn.addEventListener('click',function(){
      const msg='Act as a senior '+q.cat+' interviewer. Ask me this question and then evaluate my answer strictly:\n\n"'+q.q+'"\n\nAfter I answer, give me detailed feedback — what I got right, what I missed, and a model answer.';
      window.open('https://claude.ai/new?q='+encodeURIComponent(msg),'_blank');
    });
    actRow.appendChild(markBtn); actRow.appendChild(openBtn); body.appendChild(actRow);
    hdr.addEventListener('click',function(){body.classList.toggle('open');});
    card.appendChild(hdr); card.appendChild(body); wrap.appendChild(card);
  });
}
function initQBank(){
  const si=document.getElementById('qbank-search-input');
  if(si){let t;si.addEventListener('input',function(e){clearTimeout(t);t=setTimeout(function(){qbSearch=e.target.value;renderQBank();},200);});}
  document.querySelectorAll('.qb-filter-chip').forEach(function(btn){
    btn.addEventListener('click',function(){
      const type=btn.dataset.type,val=btn.dataset.val;
      const arr=type==='cat'?qbFilters.cats:qbFilters.diffs;
      const idx=arr.indexOf(val);
      if(idx>=0)arr.splice(idx,1); else arr.push(val);
      btn.classList.toggle('on');
      renderQBank();
    });
  });
}

// ══════════ VIEW 7: WEEKLY REPORT ══════════
function renderReport(){
  const wrap=document.getElementById('report-wrap'); if(!wrap) return;
  const data=weekData(reportWeekOffset);
  const startDate=new Date(); startDate.setDate(startDate.getDate()-startDate.getDay()-reportWeekOffset*7);
  const endDate=new Date(startDate); endDate.setDate(startDate.getDate()+6);
  const fmt=function(d){return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'});};
  const weekLabel=fmt(startDate)+' – '+fmt(endDate)+(reportWeekOffset===0?' (This week)':reportWeekOffset===1?' (Last week)':'');
  // Week nav
  wrap.querySelector('#report-week-label').textContent=weekLabel;
  // Day bars
  const maxCount=Math.max(1,...data.map(function(d){return d.count;}));
  const barsWrap=wrap.querySelector('#report-day-bars'); barsWrap.innerHTML='';
  let weekTotal=0,weekActive=0;
  data.forEach(function(d){
    weekTotal+=d.count; if(d.count>0) weekActive++;
    const row=document.createElement('div'); row.className='report-day-row';
    const pct=Math.round(d.count/maxCount*100);
    row.innerHTML='<span class="report-day-name">'+d.name+'</span><div class="report-day-bar-wrap"><div class="report-day-bar" style="width:'+pct+'%;'+(d.isFuture?'opacity:.3':'')+'"></div></div><span class="report-day-count">'+d.count+'</span>';
    barsWrap.appendChild(row);
  });
  // Week stats
  const done=cntDone(),total=cntTotal(),pct=total?Math.round(done/total*100):0;
  const sc=wrap.querySelectorAll('.report-stat-num');
  if(sc[0]) sc[0].textContent=weekTotal;
  if(sc[1]) sc[1].textContent=weekActive+'/7';
  if(sc[2]) sc[2].textContent=studyHours()+'h';
  if(sc[3]) sc[3].textContent=readinessScore()+'%';
}
function initReport(){
  const prevBtn=document.getElementById('report-prev'); const nextBtn=document.getElementById('report-next');
  if(prevBtn) prevBtn.addEventListener('click',function(){reportWeekOffset++;renderReport();});
  if(nextBtn) nextBtn.addEventListener('click',function(){if(reportWeekOffset>0){reportWeekOffset--;renderReport();}});
  const exportBtn=document.getElementById('report-export');
  if(exportBtn) exportBtn.addEventListener('click',function(){
    const data=weekData(reportWeekOffset);
    const lines=['# Weekly Dev Roadmap Report','','Week: '+document.getElementById('report-week-label').textContent,'','## Daily tasks completed',''];
    data.forEach(function(d){lines.push(d.name+': '+d.count+' tasks');});
    lines.push('','## Overall progress','Done: '+cntDone()+'/'+cntTotal()+' ('+Math.round(cntDone()/cntTotal()*100)+'%)','Readiness: '+readinessScore()+'%','Study hours: '+studyHours()+'h','Streak: '+(S._streak||0)+' days');
    const blob=new Blob([lines.join('\n')],{type:'text/plain'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='devmap-week-report.txt'; a.click();
  });
}

// ══════════ VIEW 8: GITHUB ══════════
async function fetchGitHub(username){
  const card=document.getElementById('gh-card-content'); if(!card) return;
  card.innerHTML='<div style="color:var(--sub);font-style:italic;font-size:14px">Fetching GitHub data for @'+username+'…</div>';
  try{
    const [userRes,eventsRes]=await Promise.all([
      fetch('https://api.github.com/users/'+username),
      fetch('https://api.github.com/users/'+username+'/events/public?per_page=100')
    ]);
    if(!userRes.ok) throw new Error('User not found');
    const user=await userRes.json();
    const events=await eventsRes.json();
    // Build 26-week (182 day) commit graph
    const commitDays={};
    events.filter(function(e){return e.type==='PushEvent';}).forEach(function(e){
      const d=new Date(e.created_at).toDateString(); commitDays[d]=(commitDays[d]||0)+1;
    });
    const today=new Date();
    const todayKey=today.toDateString();
    const hasToday=!!commitDays[todayKey];
    // Build 26 weeks of cells
    let cells='';
    for(let i=181;i>=0;i--){
      const d=new Date(today); d.setDate(today.getDate()-i);
      const key=d.toDateString();
      const c=commitDays[key]||0;
      const lvl=c===0?0:c<3?1:c<6?2:c<10?3:4;
      cells+='<div class="gh-cell'+(lvl?' l'+lvl:'')+'" title="'+key+(c?' — '+c+' commits':'')+'"></div>';
    }
    const totalCommits=Object.values(commitDays).reduce(function(a,b){return a+b;},0);
    card.innerHTML=
      '<div class="gh-header">'
        +'<div class="gh-avatar"><img src="'+user.avatar_url+'" alt="@'+username+'" onerror="this.style.display=\'none\'"/></div>'
        +'<div><div class="gh-name">'+(user.name||username)+'</div><div class="gh-handle">@'+username+'</div></div>'
      +'</div>'
      +'<div class="gh-stats-row">'
        +'<div class="gh-stat"><div class="gh-stat-num">'+user.public_repos+'</div><div class="gh-stat-lbl">Repos</div></div>'
        +'<div class="gh-stat"><div class="gh-stat-num">'+user.followers+'</div><div class="gh-stat-lbl">Followers</div></div>'
        +'<div class="gh-stat"><div class="gh-stat-num">'+totalCommits+'</div><div class="gh-stat-lbl">Recent pushes</div></div>'
      +'</div>'
      +'<div style="font-family:var(--mono);font-size:11px;color:var(--sub);margin-bottom:6px;text-transform:uppercase;letter-spacing:.8px">Last 6 months</div>'
      +'<div class="gh-graph">'+cells+'</div>'
      +(hasToday
        ?'<div class="gh-today-ok">✅ You pushed code today. Keep the streak alive!</div>'
        :'<div class="gh-today-warn">⚠️ No commits today yet. Push something to GitHub before midnight.</div>');
  } catch(e){
    card.innerHTML='<div style="color:var(--red);font-size:14px">Could not load data for @'+username+'. Check the username and try again.</div>';
  }
}
function initGitHub(){
  const input=document.getElementById('gh-username-input');
  const btn=document.getElementById('gh-fetch-btn');
  if(!input||!btn) return;
  const saved=getGHUser();
  if(saved){input.value=saved;fetchGitHub(saved);}
  btn.addEventListener('click',function(){
    const u=input.value.trim();
    if(!u) return;
    setGHUser(u); fetchGitHub(u);
  });
  input.addEventListener('keydown',function(e){if(e.key==='Enter') btn.click();});
}

// ══════════ SEARCH 2.0 ══════════
function initSearch2(){
  const input=document.getElementById('search-v2-input');
  const clearBtn=document.getElementById('search-v2-clear');
  const resultsLbl=document.getElementById('search-results-lbl');
  if(!input) return;
  let t;
  input.addEventListener('input',function(e){
    clearTimeout(t); t=setTimeout(function(){
      curSearch=e.target.value;
      if(resultsLbl) resultsLbl.classList.toggle('show',curSearch.length>0||searchFilters.types.length>0||!!searchFilters.statusOnly);
      renderRoadmap(curFilter,curSearch);
    },200);
  });
  if(clearBtn) clearBtn.addEventListener('click',function(){
    input.value=''; curSearch=''; searchFilters={types:[],statusOnly:''};
    document.querySelectorAll('.sf-chip').forEach(function(c){c.classList.remove('on');});
    if(resultsLbl) resultsLbl.classList.remove('show');
    renderRoadmap(curFilter,curSearch);
  });
  document.querySelectorAll('.sf-chip').forEach(function(chip){
    chip.addEventListener('click',function(){
      const type=chip.dataset.type,val=chip.dataset.val;
      chip.classList.toggle('on');
      if(type==='type'){
        const idx=searchFilters.types.indexOf(val);
        if(idx>=0) searchFilters.types.splice(idx,1); else searchFilters.types.push(val);
      } else {
        searchFilters.statusOnly=chip.classList.contains('on')?val:'';
        // deselect other status chips
        document.querySelectorAll('.sf-chip[data-type="status"]').forEach(function(c){ if(c!==chip) c.classList.remove('on'); });
      }
      if(resultsLbl) resultsLbl.classList.add('show');
      renderRoadmap(curFilter,curSearch);
    });
  });
}

// ══════════ VIEW SWITCHER ══════════
function showView(v){
  curView=v;
  document.querySelectorAll('.view').forEach(function(el){el.classList.remove('active');});
  document.querySelectorAll('.nav-tab,.btab').forEach(function(el){el.classList.remove('active');});
  const vEl=document.getElementById('view-'+v);
  if(vEl) vEl.classList.add('active');
  document.querySelectorAll('[data-view="'+v+'"]').forEach(function(el){el.classList.add('active');});
  if(v==='roadmap') renderRoadmap(curFilter,curSearch);
  if(v==='kanban')  renderKanban();
  if(v==='focus')   {detectFocusDay();renderFocusNav();renderFocusHero();}
  if(v==='stats')   renderStatsView();
  if(v==='jobs')    {renderJobs();renderJobStats();}
  if(v==='qbank')   renderQBank();
  if(v==='report')  renderReport();
  if(v==='github')  initGitHub();
}

// ══════════ INIT ══════════
document.addEventListener('DOMContentLoaded',function(){
  // Nav + bottom bar tabs
  document.querySelectorAll('.nav-tab,.btab').forEach(function(btn){
    btn.addEventListener('click',function(){showView(btn.getAttribute('data-view'));});
  });
  // Phase filter
  const ptabs=document.getElementById('phase-tabs');
  if(ptabs){ptabs.addEventListener('click',function(e){const b=e.target.closest('[data-phase]');if(!b)return;curFilter=b.getAttribute('data-phase');ptabs.querySelectorAll('.pill').forEach(function(p){p.classList.remove('active');});b.classList.add('active');renderRoadmap(curFilter,curSearch);});}
  // Kanban filter
  const kf=document.getElementById('kb-filter');
  if(kf){kf.addEventListener('click',function(e){const b=e.target.closest('[data-phase]');if(!b)return;kbPhase=b.getAttribute('data-phase');kf.querySelectorAll('.pill').forEach(function(p){p.classList.remove('active');});b.classList.add('active');renderKanban();});}
  // Theme
  document.getElementById('theme-btn').addEventListener('click',toggleTheme);
  // Reset
  const rb=document.getElementById('reset-btn');
  if(rb) rb.addEventListener('click',function(){if(confirm('Reset ALL learning progress? Jobs and Q-bank progress kept.')){const jobs=S._jobs,qd=S._qdone;S={};if(jobs)S._jobs=jobs;if(qd)S._qdone=qd;save();updateStats();showView(curView);}});
  // Pomodoro
  initPomo();
  // Job modal
  initJobModal();
  // AI Brief
  initBrief();
  // Search 2.0
  initSearch2();
  // Q-Bank
  initQBank();
  // Report
  initReport();
  // Theme + load
  const saved=localStorage.getItem(TK);
  setTheme(saved||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'));
  load(); updateStats(); showView('roadmap');
});
