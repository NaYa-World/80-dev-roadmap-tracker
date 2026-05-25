// ═══════════════════════════════════════════════
// STATE ENGINE v5 — IndexedDB + localStorage fallback
// Adds: confidence ratings, weekly history,
//       github username, interview q progress
// ═══════════════════════════════════════════════
const SK  = 'devmap_v5';
const TK  = 'devmap_theme';
let S = {};

// ── Persist ──────────────────────────────────
function save() { try { localStorage.setItem(SK, JSON.stringify(S)); } catch(_){} }
function load() { try { const r = localStorage.getItem(SK); if(r) S = JSON.parse(r); } catch(_){} }

// ── IDs ──────────────────────────────────────
function tid(pi,di,ti) { return 'p'+pi+'d'+di+'t'+ti; }

// ── All days / tasks ─────────────────────────
function allDays() {
  const out = [];
  PHASES.forEach(function(ph,pi){ ph.data.forEach(function(d,di){ out.push({ph,pi,d,di}); }); });
  return out;
}
function allIds() {
  const out = [];
  PHASES.forEach(function(ph,pi){ ph.data.forEach(function(d,di){ d.tasks.forEach(function(_,ti){ out.push(tid(pi,di,ti)); }); }); });
  return out;
}

// ── Counts ───────────────────────────────────
function cntDone()       { return allIds().filter(function(id){ return !!S[id]; }).length; }
function cntTotal()      { return allIds().length; }
function dayDone(pi,di)  { return PHASES[pi].data[di].tasks.filter(function(_,ti){ return !!S[tid(pi,di,ti)]; }).length; }
function dayTotal(pi,di) { return PHASES[pi].data[di].tasks.length; }
function dayPct(pi,di)   { const t=dayTotal(pi,di); return t?Math.round(dayDone(pi,di)/t*100):0; }
function dayStatus(pi,di) {
  const d=dayDone(pi,di),t=dayTotal(pi,di);
  if(d===0) return 'backlog';
  if(d===t) return 'done';
  if(d/t>=0.5) return 'review';
  return 'inprogress';
}

// ── Type counts ───────────────────────────────
function typeCounts() {
  const tot={concept:0,code:0,quiz:0,project:0};
  const don={concept:0,code:0,quiz:0,project:0};
  PHASES.forEach(function(ph,pi){
    ph.data.forEach(function(d,di){
      d.tasks.forEach(function(task,ti){
        tot[task.k]=(tot[task.k]||0)+1;
        if(S[tid(pi,di,ti)]) don[task.k]=(don[task.k]||0)+1;
      });
    });
  });
  return {tot,don};
}

// ── Notes ─────────────────────────────────────
function noteKey(pi,di) { return 'note_'+pi+'_'+di; }
function getNote(pi,di) { return S[noteKey(pi,di)]||''; }
function setNote(pi,di,val) { S[noteKey(pi,di)]=val; save(); }
function hasNote(pi,di) { return !!(S[noteKey(pi,di)]&&S[noteKey(pi,di)].trim()); }

// ── Confidence ratings (1–5 per task) ────────
function confKey(pi,di,ti) { return 'conf_'+pi+'_'+di+'_'+ti; }
function getConf(pi,di,ti) { return S[confKey(pi,di,ti)]||0; }
function setConf(pi,di,ti,val) { S[confKey(pi,di,ti)]=val; save(); }
// Average confidence for a day
function dayAvgConf(pi,di) {
  const tasks=PHASES[pi].data[di].tasks;
  const rated=tasks.map(function(_,ti){ return getConf(pi,di,ti); }).filter(function(v){ return v>0; });
  if(!rated.length) return 0;
  return rated.reduce(function(a,b){ return a+b; },0)/rated.length;
}
// Low-confidence tasks (rated 1 or 2)
function lowConfTasks() {
  const out=[];
  PHASES.forEach(function(ph,pi){
    ph.data.forEach(function(d,di){
      d.tasks.forEach(function(task,ti){
        const c=getConf(pi,di,ti);
        if(c>0&&c<=2) out.push({ph,pi,d,di,task,ti,conf:c});
      });
    });
  });
  return out;
}

// ── Pomodoro / study hours ────────────────────
function studyHours() { return ((S._pomoSessions||0)*25/60).toFixed(1); }

// ── ETA ───────────────────────────────────────
function calcETA() {
  const done=cntDone(),total=cntTotal(),left=total-done;
  const history=S._history||{};
  const days=Object.keys(history).filter(function(k){ return history[k]>0; });
  if(days.length<2||done===0) return null;
  const recent=days.slice(-7);
  let tasksDone=0;
  recent.forEach(function(k){ tasksDone+=(history[k]||0); });
  const avgPerDay=tasksDone/recent.length;
  if(avgPerDay<=0) return null;
  const daysLeft=Math.ceil(left/avgPerDay);
  const eta=new Date(); eta.setDate(eta.getDate()+daysLeft);
  return {daysLeft,eta:eta.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}),avgPerDay:avgPerDay.toFixed(1)};
}

// ── Readiness score ───────────────────────────
function readinessScore() {
  const {tot,don}=typeCounts();
  const qP=tot.quiz?don.quiz/tot.quiz:0;
  const prP=tot.project?don.project/tot.project:0;
  const cP=tot.code?don.code/tot.code:0;
  const coP=tot.concept?don.concept/tot.concept:0;
  // Also factor in confidence: low-conf tasks reduce score
  const lowConf=lowConfTasks().length;
  const confPenalty=Math.min(lowConf*0.5,10);
  return Math.max(0,Math.round((qP*.35+prP*.35+cP*.20+coP*.10)*100-confPenalty));
}

// ── Record daily activity ─────────────────────
function recordToday(tasksCount) {
  const today=new Date().toDateString();
  if(!S._history) S._history={};
  S._history[today]=tasksCount;
  if(S._lastDay!==today){
    const yesterday=new Date(Date.now()-86400000).toDateString();
    S._streak=S._lastDay===yesterday?((S._streak||0)+1):1;
    S._lastDay=today;
  }
  save();
}

// ── Weekly data (for report) ──────────────────
function weekData(offsetWeeks) {
  offsetWeeks=offsetWeeks||0;
  const now=new Date();
  const startOfWeek=new Date(now);
  startOfWeek.setDate(now.getDate()-now.getDay()-offsetWeeks*7);
  startOfWeek.setHours(0,0,0,0);
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const hist=S._history||{};
  return days.map(function(name,i){
    const d=new Date(startOfWeek); d.setDate(startOfWeek.getDate()+i);
    const key=d.toDateString();
    return {name,date:key,count:hist[key]||0,isFuture:d>now};
  });
}

// ── GitHub username ───────────────────────────
function getGHUser() { return S._ghUser||''; }
function setGHUser(u) { S._ghUser=u; save(); }

// ── Jobs ──────────────────────────────────────
function getJobs()      { return S._jobs||[]; }
function addJob(job)    { if(!S._jobs)S._jobs=[]; S._jobs.unshift({...job,id:Date.now()}); save(); }
function deleteJob(id)  { S._jobs=(S._jobs||[]).filter(function(j){ return j.id!==id; }); save(); }
function moveJob(id,st) { const j=(S._jobs||[]).find(function(j){ return j.id===id; }); if(j){j.status=st;j.updatedAt=new Date().toDateString();} save(); }

// ── Interview Q progress ──────────────────────
function qDone(qId)    { return !!(S._qdone&&S._qdone[qId]); }
function toggleQ(qId)  { if(!S._qdone)S._qdone={}; S._qdone[qId]=!S._qdone[qId]; save(); }
