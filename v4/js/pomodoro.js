// ═══════════════════════════════════════════════
// POMODORO TIMER
// ═══════════════════════════════════════════════
const POMO_MODES = {
  focus:  { label:'Focus',       mins:25, color:'#9d8fff' },
  short:  { label:'Short Break', mins:5,  color:'#00d9a0' },
  long:   { label:'Long Break',  mins:15, color:'#4fa8ff' },
};
let pomoMode     = 'focus';
let pomoSecsLeft = 25 * 60;
let pomoRunning  = false;
let pomoInterval = null;
let pomoSessions = 0;

function openPomo() {
  document.getElementById('pomo-modal').classList.add('open');
  renderPomoRing();
}
function closePomo() {
  document.getElementById('pomo-modal').classList.remove('open');
}

function setPomoMode(mode) {
  pomoMode = mode;
  pomoSecsLeft = POMO_MODES[mode].mins * 60;
  if(pomoRunning){ clearInterval(pomoInterval); pomoRunning=false; }
  document.querySelectorAll('.pomo-mode-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.mode===mode); });
  renderPomoRing();
  updateNavPomoBtn();
}

function togglePomo() {
  if(pomoRunning){
    clearInterval(pomoInterval); pomoRunning=false;
  } else {
    pomoRunning=true;
    pomoInterval=setInterval(function(){
      if(pomoSecsLeft>0){
        pomoSecsLeft--;
        renderPomoRing();
        updateNavPomoBtn();
      } else {
        clearInterval(pomoInterval); pomoRunning=false;
        if(pomoMode==='focus'){
          pomoSessions++;
          S._pomoSessions=(S._pomoSessions||0)+1; save();
          updateStats();
        }
        playBeep();
        openPomo();
        const next=pomoMode==='focus'?(pomoSessions%4===0?'long':'short'):'focus';
        setPomoMode(next);
      }
    },1000);
  }
  document.getElementById('pomo-play').textContent = pomoRunning ? '⏸' : '▶';
  updateNavPomoBtn();
}

function resetPomo() {
  clearInterval(pomoInterval); pomoRunning=false;
  pomoSecsLeft=POMO_MODES[pomoMode].mins*60;
  document.getElementById('pomo-play').textContent='▶';
  renderPomoRing(); updateNavPomoBtn();
}

function renderPomoRing() {
  const total=POMO_MODES[pomoMode].mins*60;
  const pct=pomoSecsLeft/total;
  const r=54, circ=2*Math.PI*r;
  const offset=circ*(1-pct);
  const prog=document.getElementById('pomo-prog');
  if(prog){
    prog.style.strokeDasharray=circ;
    prog.style.strokeDashoffset=offset;
    prog.style.stroke=POMO_MODES[pomoMode].color;
  }
  const mins=Math.floor(pomoSecsLeft/60).toString().padStart(2,'0');
  const secs=(pomoSecsLeft%60).toString().padStart(2,'0');
  const num=document.getElementById('pomo-num'); if(num) num.textContent=mins+':'+secs;
  const lbl=document.getElementById('pomo-lbl'); if(lbl) lbl.textContent=POMO_MODES[pomoMode].label.toUpperCase();
  const sess=document.getElementById('pomo-sessions'); if(sess) sess.textContent='Sessions today: '+(S._pomoSessions||0)+' · '+studyHours()+' hrs studied';
}

function updateNavPomoBtn() {
  const btn=document.getElementById('pomo-nav-btn');
  if(!btn) return;
  const mins=Math.floor(pomoSecsLeft/60).toString().padStart(2,'0');
  const secs=(pomoSecsLeft%60).toString().padStart(2,'0');
  btn.textContent = pomoRunning ? '⏱ '+mins+':'+secs : '⏱ Pomodoro';
  btn.classList.toggle('pomo-active', pomoRunning);
}

function playBeep() {
  try {
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [0,200,400].forEach(function(delay){
      setTimeout(function(){
        const osc=ctx.createOscillator(); const gain=ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value=880; osc.type='sine';
        gain.gain.setValueAtTime(0,ctx.currentTime);
        gain.gain.linearRampToValueAtTime(.3,ctx.currentTime+.05);
        gain.gain.linearRampToValueAtTime(0,ctx.currentTime+.4);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime+.4);
      },delay);
    });
  } catch(_){}
}

function initPomo() {
  document.getElementById('pomo-nav-btn').addEventListener('click', openPomo);
  document.getElementById('pomo-close').addEventListener('click', closePomo);
  document.getElementById('pomo-modal').addEventListener('click', function(e){ if(e.target===this) closePomo(); });
  document.getElementById('pomo-play').addEventListener('click', togglePomo);
  document.getElementById('pomo-reset').addEventListener('click', resetPomo);
  document.querySelectorAll('.pomo-mode-btn').forEach(function(btn){
    btn.addEventListener('click', function(){ setPomoMode(btn.dataset.mode); });
  });
  renderPomoRing();
}
