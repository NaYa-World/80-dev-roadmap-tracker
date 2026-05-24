// ═══════════════════════════════════════════════
// STATE ENGINE — shared across all views
// ═══════════════════════════════════════════════
const SK  = 'devmap_v3';
const TK  = 'devmap_theme';
let S = {};

function save() { try { localStorage.setItem(SK, JSON.stringify(S)); } catch(_){} }
function load() { try { const r = localStorage.getItem(SK); if(r) S = JSON.parse(r); } catch(_){} }

// ── task id ──────────────────────────────────
function tid(pi,di,ti) { return 'p'+pi+'d'+di+'t'+ti; }

// ── flat list helpers ─────────────────────────
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

// ── counts ───────────────────────────────────
function cntDone()       { return allIds().filter(function(id){ return !!S[id]; }).length; }
function cntTotal()      { return allIds().length; }
function dayDone(pi,di)  { return PHASES[pi].data[di].tasks.filter(function(_,ti){ return !!S[tid(pi,di,ti)]; }).length; }
function dayTotal(pi,di) { return PHASES[pi].data[di].tasks.length; }
function dayPct(pi,di)   { const t=dayTotal(pi,di); return t ? Math.round(dayDone(pi,di)/t*100) : 0; }

function dayStatus(pi,di) {
  const d=dayDone(pi,di), t=dayTotal(pi,di);
  if(d===0) return 'backlog';
  if(d===t) return 'done';
  if(d/t>=0.5) return 'review';
  return 'inprogress';
}

// ── type counts ───────────────────────────────
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

// ── notes ─────────────────────────────────────
function noteKey(pi,di) { return 'note_'+pi+'_'+di; }
function getNote(pi,di) { return S[noteKey(pi,di)] || ''; }
function setNote(pi,di,val) { S[noteKey(pi,di)] = val; save(); }
function hasNote(pi,di) { return !!(S[noteKey(pi,di)] && S[noteKey(pi,di)].trim()); }

// ── study hours (pomodoro sessions × 25min) ──
function studyMinutes() { return ((S._pomoSessions||0) * 25); }
function studyHours()   { return (studyMinutes()/60).toFixed(1); }

// ── ETA calculator ────────────────────────────
function calcETA() {
  const done = cntDone(), total = cntTotal(), left = total - done;
  const history = S._history || {};
  const days = Object.keys(history).filter(function(k){ return history[k]>0; });
  if(days.length < 2 || done === 0) return null;
  // avg tasks done per active day over last 7 recorded days
  const recent = days.slice(-7);
  let tasksDone = 0;
  recent.forEach(function(k){ tasksDone += (history[k]||0); });
  const avgPerDay = tasksDone / recent.length;
  if(avgPerDay <= 0) return null;
  const daysLeft = Math.ceil(left / avgPerDay);
  const eta = new Date(); eta.setDate(eta.getDate() + daysLeft);
  return { daysLeft, eta: eta.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), avgPerDay: avgPerDay.toFixed(1) };
}

// ── interview readiness score ─────────────────
function readinessScore() {
  const {tot,don} = typeCounts();
  const quizW=0.35, projW=0.35, codeW=0.20, concW=0.10;
  const quizPct  = tot.quiz    ? don.quiz/tot.quiz       : 0;
  const projPct  = tot.project ? don.project/tot.project : 0;
  const codePct  = tot.code    ? don.code/tot.code       : 0;
  const concPct  = tot.concept ? don.concept/tot.concept : 0;
  return Math.round((quizPct*quizW + projPct*projW + codePct*codeW + concPct*concW) * 100);
}

// ── streak + history ─────────────────────────
function recordToday(tasksCompletedCount) {
  const today = new Date().toDateString();
  if(!S._history) S._history = {};
  S._history[today] = tasksCompletedCount;
  if(S._lastDay !== today) {
    const yesterday = new Date(Date.now()-86400000).toDateString();
    S._streak = S._lastDay===yesterday ? ((S._streak||0)+1) : 1;
    S._lastDay = today;
  }
  save();
}

// ── jobs (job application tracker) ───────────
function getJobs()          { return S._jobs || []; }
function saveJobs(jobs)     { S._jobs = jobs; save(); }
function addJob(job)        { if(!S._jobs) S._jobs=[]; S._jobs.unshift({...job, id:Date.now()}); save(); }
function deleteJob(id)      { S._jobs = (S._jobs||[]).filter(function(j){ return j.id!==id; }); save(); }
function moveJob(id,status) { const j=(S._jobs||[]).find(function(j){ return j.id===id; }); if(j){j.status=status;j.updatedAt=new Date().toDateString();} save(); }
