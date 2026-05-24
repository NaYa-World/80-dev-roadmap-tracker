// ══════════════════════════════════════════════════════════════════
//  VIEWS.JS  —  Nav · Kanban · Focus · Analytics · Pomodoro
//  Depends on app.js being loaded first (PHASES, S, tid, etc.)
// ══════════════════════════════════════════════════════════════════

// ─── NAV ─────────────────────────────────────────────────────────
let curView = 'tracker';

document.getElementById('nav-tabs').addEventListener('click', function(e) {
  const btn = e.target.closest('[data-view]');
  if (!btn) return;
  switchView(btn.dataset.view);
});

function switchView(view) {
  curView = view;
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
  const el = document.getElementById('view-' + view);
  if (el) el.classList.add('active');
  const tab = document.querySelector('[data-view="' + view + '"]');
  if (tab) tab.classList.add('active');

  if (view === 'kanban')    renderKanban();
  if (view === 'focus')     renderFocus();
  if (view === 'analytics') renderAnalytics();
  if (view === 'timer')     renderTimerTasks();
}

// ══════════════════════════════════════════════════════════════════
//  KANBAN
// ══════════════════════════════════════════════════════════════════
// Each day card maps to: Not Started / In Progress / Done
// "Done"       = all tasks checked
// "In Progress" = some tasks checked
// "Not Started" = zero tasks checked

function getDayStatus(pi, di) {
  const d = PHASES[pi].data[di];
  const total = d.tasks.length;
  const done  = d.tasks.filter(function(_, ti) { return !!S[tid(pi, di, ti)]; }).length;
  if (done === 0)     return 'todo';
  if (done === total) return 'done';
  return 'inprog';
}

function renderKanban() {
  const board = document.getElementById('kanban-board');
  board.innerHTML = '';

  const cols = [
    { key:'todo',   label:'Not Started', dot:'#7070a0', textCol:'var(--sub)' },
    { key:'inprog', label:'In Progress',  dot:'#ffc850', textCol:'#ffc850' },
    { key:'done',   label:'Done',         dot:'#00d9a0', textCol:'#00d9a0' },
  ];

  cols.forEach(function(col) {
    const colEl = document.createElement('div');
    colEl.className = 'kanban-col';

    // collect cards for this column
    const cards = [];
    PHASES.forEach(function(ph, pi) {
      ph.data.forEach(function(d, di) {
        if (getDayStatus(pi, di) === col.key) {
          cards.push({ ph: ph, pi: pi, d: d, di: di });
        }
      });
    });

    const hdr = document.createElement('div');
    hdr.className = 'kanban-col-hdr';
    hdr.innerHTML =
      '<div class="kanban-col-dot" style="background:' + col.dot + ';"></div>' +
      '<span class="kanban-col-title">' + col.label + '</span>' +
      '<span class="kanban-col-count" style="color:' + col.textCol + ';">' + cards.length + '</span>';
    colEl.appendChild(hdr);

    const cardsEl = document.createElement('div');
    cardsEl.className = 'kanban-cards';

    if (cards.length === 0) {
      cardsEl.innerHTML = '<div class="kanban-empty"><span style="font-size:22px;">' +
        (col.key==='done'?'🎯':col.key==='inprog'?'🚀':'📋') +
        '</span>' + (col.key==='done'?'Complete tasks to see them here':col.key==='inprog'?'Start a day to move it here':'All caught up!') + '</div>';
    }

    cards.forEach(function(item) {
      const total = item.d.tasks.length;
      const done  = item.d.tasks.filter(function(_, ti) { return !!S[tid(item.pi, item.di, ti)]; }).length;
      const pct   = total ? Math.round(done / total * 100) : 0;

      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.style.setProperty('--kc', item.ph.color);

      card.innerHTML =
        '<div class="kanban-card-day">' + item.ph.title.split('—')[0].trim() + ' · ' + item.d.day + '</div>' +
        '<div class="kanban-card-label">' + item.d.label + '</div>' +
        '<div class="kanban-card-meta">' +
          '<div class="kanban-card-prog"><div class="kanban-card-fill" style="width:' + pct + '%;background:' + item.ph.color + ';"></div></div>' +
          '<span class="kanban-card-pct">' + done + '/' + total + '</span>' +
        '</div>';

      // Click → switch to tracker and open that day
      card.addEventListener('click', function() {
        // open that phase and day in tracker
        S['po' + item.pi] = true;
        S['do' + item.pi + '_' + item.di] = true;
        save();
        switchView('tracker');
        setTimeout(function() {
          render(curFilter, curSearch);
          // scroll to it
          var el = document.getElementById('phdr' + item.pi);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });

      cardsEl.appendChild(card);
    });

    colEl.appendChild(cardsEl);
    board.appendChild(colEl);
  });
}

// ══════════════════════════════════════════════════════════════════
//  TODAY'S FOCUS
// ══════════════════════════════════════════════════════════════════
function renderFocus() {
  const container = document.getElementById('focus-content');
  container.innerHTML = '';

  // Find current day = first phase+day with incomplete tasks
  let curPh = null, curPi = -1, curDi = -1;
  outer: for (var pi = 0; pi < PHASES.length; pi++) {
    for (var di = 0; di < PHASES[pi].data.length; di++) {
      const d = PHASES[pi].data[di];
      const incomplete = d.tasks.some(function(_, ti) { return !S[tid(pi, di, ti)]; });
      if (incomplete) { curPh = PHASES[pi]; curPi = pi; curDi = di; break outer; }
    }
  }

  if (!curPh) {
    container.innerHTML = '<div style="text-align:center;padding:60px 20px;"><div style="font-size:48px;margin-bottom:16px;">🎉</div><div style="font-size:20px;font-weight:700;color:var(--text);margin-bottom:8px;">All 80 days complete!</div><div style="color:var(--sub);">Time to apply. You\'ve got this.</div></div>';
    return;
  }

  const d = curPh.data[curDi];
  const dayDone = d.tasks.filter(function(_, ti) { return !!S[tid(curPi, curDi, ti)]; }).length;
  const dayTotal = d.tasks.length;
  const pct = Math.round(dayDone / dayTotal * 100);

  // Hero
  const hero = document.createElement('div');
  hero.className = 'focus-hero';
  hero.innerHTML =
    '<div class="focus-label">Current focus</div>' +
    '<div class="focus-day">' + d.day + ' — ' + d.label + '</div>' +
    '<div class="focus-topic" style="color:' + curPh.color + ';">' + curPh.title + '</div>' +
    '<div class="focus-stats">' +
      '<div class="focus-stat"><div class="focus-stat-dot" style="background:' + curPh.color + ';"></div>' + dayDone + ' of ' + dayTotal + ' tasks done</div>' +
      '<div class="focus-stat"><div class="focus-stat-dot" style="background:#7864ff;"></div>' + pct + '% today</div>' +
    '</div>';
  container.appendChild(hero);

  // Today's tasks
  const tasksTitle = document.createElement('div');
  tasksTitle.style.cssText = 'font-size:13px;font-weight:600;color:var(--sub);text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;';
  tasksTitle.textContent = "Today's tasks";
  container.appendChild(tasksTitle);

  const tasksList = document.createElement('div');
  tasksList.className = 'today-tasks';

  d.tasks.forEach(function(task, ti) {
    const id = tid(curPi, curDi, ti);
    const done = !!S[id];
    const item = document.createElement('div');
    item.className = 'today-task' + (done ? ' done-task' : '');
    item.id = 'ft_' + id;

    const cb = document.createElement('div');
    cb.className = 'today-task-cb' + (done ? ' on' : '');
    cb.style.borderColor = done ? curPh.color : '';
    cb.style.background  = done ? curPh.color : '';

    const body = document.createElement('div');
    body.className = 'today-task-body';
    const badgeMap = { concept:'b-concept',code:'b-code',quiz:'b-quiz',project:'b-project' };
    body.innerHTML =
      '<div class="today-task-text' + (done?' done':'') + '" id="fttx_' + id + '">' + task.t + '</div>' +
      '<div class="today-task-badges"><span class="badge ' + (badgeMap[task.k]||'b-concept') + '">' + task.k + '</span></div>';

    item.appendChild(cb);
    item.appendChild(body);

    (function(cPi, cDi, cTi, cId, cColor) {
      item.addEventListener('click', function() {
        doTask(cPi, cDi, cTi);
        // update focus UI in place
        var nowDone = !!S[cId];
        var cbEl = item.querySelector('.today-task-cb');
        var txEl = document.getElementById('fttx_' + cId);
        if (cbEl) { cbEl.className = 'today-task-cb' + (nowDone?' on':''); cbEl.style.background = nowDone ? cColor : ''; cbEl.style.borderColor = nowDone ? cColor : ''; }
        if (txEl) { txEl.className = 'today-task-text' + (nowDone?' done':''); }
        item.className = 'today-task' + (nowDone?' done-task':'');
      });
    })(curPi, curDi, ti, id, curPh.color);

    tasksList.appendChild(item);
  });
  container.appendChild(tasksList);

  // Quiz card for today
  const qCard = buildQuizCard(d, curPi, curDi);
  container.appendChild(qCard);

  // Upcoming days
  const upTitle = document.createElement('div');
  upTitle.style.cssText = 'font-size:13px;font-weight:600;color:var(--sub);text-transform:uppercase;letter-spacing:.8px;margin:24px 0 12px;';
  upTitle.textContent = 'Coming up next';
  container.appendChild(upTitle);

  const upList = document.createElement('div');
  upList.className = 'upcoming-list';
  let count = 0;
  for (var pi2 = curPi; pi2 < PHASES.length && count < 5; pi2++) {
    var startDi = (pi2 === curPi) ? curDi + 1 : 0;
    for (var di2 = startDi; di2 < PHASES[pi2].data.length && count < 5; di2++) {
      var upDay = PHASES[pi2].data[di2];
      var upTotal = upDay.tasks.length;
      var upDone = upDay.tasks.filter(function(_, ti) { return !!S[tid(pi2, di2, ti)]; }).length;
      var item2 = document.createElement('div');
      item2.className = 'upcoming-item';
      item2.innerHTML =
        '<span class="upcoming-day">' + upDay.day + '</span>' +
        '<span class="upcoming-label">' + upDay.label + '</span>' +
        '<span class="upcoming-count">' + upDone + '/' + upTotal + '</span>';
      upList.appendChild(item2);
      count++;
    }
  }
  container.appendChild(upList);
}

// ══════════════════════════════════════════════════════════════════
//  ANALYTICS
// ══════════════════════════════════════════════════════════════════
function renderAnalytics() {
  const container = document.getElementById('analytics-content');
  container.innerHTML = '';

  const done  = cntDone();
  const total = cntTotal();
  const left  = total - done;
  const pct   = total ? Math.round(done / total * 100) : 0;

  // Count by type
  const types = { concept:0, code:0, quiz:0, project:0 };
  const typesDone = { concept:0, code:0, quiz:0, project:0 };
  PHASES.forEach(function(ph, pi) {
    ph.data.forEach(function(d, di) {
      d.tasks.forEach(function(task, ti) {
        types[task.k] = (types[task.k]||0) + 1;
        if (S[tid(pi, di, ti)]) typesDone[task.k] = (typesDone[task.k]||0) + 1;
      });
    });
  });

  // Milestones
  const milestones = [
    { pct:10, label:'First steps — 10% done', icon:'🌱' },
    { pct:25, label:'Phase 1+2 territory — 25%', icon:'⚡' },
    { pct:50, label:'Halfway hero — 50%', icon:'🔥' },
    { pct:75, label:'On the home stretch — 75%', icon:'🚀' },
    { pct:100,label:'Zero to hired — 100%!', icon:'🎉' },
  ];

  const grid = document.createElement('div');
  grid.className = 'analytics-grid';

  // ── Big numbers row
  const bigCard = document.createElement('div');
  bigCard.className = 'chart-card';
  bigCard.innerHTML = '<div class="chart-title">Overall progress</div>';
  const bigRow = document.createElement('div');
  bigRow.style.cssText = 'display:flex;gap:20px;flex-wrap:wrap;';
  [
    { n: done,  lbl:'Tasks done',  col:'#00d9a0' },
    { n: left,  lbl:'Tasks left',  col:'#ff6b6b' },
    { n: S._streak||0, lbl:'Day streak', col:'#ffc850' },
    { n: pct+'%', lbl:'Complete', col:'#a090ff' },
  ].forEach(function(item) {
    var el = document.createElement('div');
    el.innerHTML = '<div class="big-num" style="color:' + item.col + ';">' + item.n + '</div><div class="big-label">' + item.lbl + '</div>';
    bigRow.appendChild(el);
  });
  bigCard.appendChild(bigRow);
  grid.appendChild(bigCard);

  // ── Phase breakdown
  const phaseCard = document.createElement('div');
  phaseCard.className = 'chart-card full';
  phaseCard.innerHTML = '<div class="chart-title">Phase breakdown</div>';
  const phaseBars = document.createElement('div');
  phaseBars.className = 'phase-bars';
  PHASES.forEach(function(ph, pi) {
    var phTotal = ph.data.reduce(function(a,d){ return a+d.tasks.length; }, 0);
    var phDone  = ph.data.reduce(function(a,d,di){ return a+d.tasks.filter(function(_,ti){ return !!S[tid(pi,di,ti)]; }).length; }, 0);
    var phPct   = phTotal ? Math.round(phDone/phTotal*100) : 0;
    var row = document.createElement('div');
    row.className = 'phase-bar-row';
    row.innerHTML =
      '<span class="phase-bar-name">' + ph.title.replace('Phase ','Ph') + '</span>' +
      '<div class="phase-bar-track"><div class="phase-bar-fill" style="width:' + phPct + '%;background:' + ph.color + ';"></div></div>' +
      '<span class="phase-bar-pct">' + phPct + '%</span>';
    phaseBars.appendChild(row);
  });
  phaseCard.appendChild(phaseBars);
  grid.appendChild(phaseCard);

  // ── Task type breakdown
  const typeCard = document.createElement('div');
  typeCard.className = 'chart-card';
  typeCard.innerHTML = '<div class="chart-title">Task type breakdown</div>';
  const typeBreak = document.createElement('div');
  typeBreak.className = 'type-breakdown';
  const typeColors = { concept:'#4fa8ff', code:'#00d9a0', quiz:'#ffc850', project:'#b98aff' };
  Object.keys(types).forEach(function(k) {
    var tPct = types[k] ? Math.round(typesDone[k]/types[k]*100) : 0;
    var row = document.createElement('div');
    row.className = 'type-row';
    row.innerHTML =
      '<div class="type-dot" style="background:' + typeColors[k] + ';"></div>' +
      '<span class="type-name">' + k.charAt(0).toUpperCase()+k.slice(1) + '</span>' +
      '<div class="type-track"><div class="type-fill" style="width:' + tPct + '%;background:' + typeColors[k] + ';"></div></div>' +
      '<span class="type-count">' + typesDone[k] + '/' + types[k] + '</span>';
    typeBreak.appendChild(row);
  });
  typeCard.appendChild(typeBreak);
  grid.appendChild(typeCard);

  // ── Milestones
  const msCard = document.createElement('div');
  msCard.className = 'chart-card';
  msCard.innerHTML = '<div class="chart-title">Milestones</div>';
  const msList = document.createElement('div');
  msList.className = 'milestone-list';
  milestones.forEach(function(ms) {
    var reached = pct >= ms.pct;
    var item = document.createElement('div');
    item.className = 'milestone-item';
    item.innerHTML =
      '<div class="milestone-icon" style="background:' + (reached?'rgba(0,217,160,.12)':'var(--border)') + ';">' + ms.icon + '</div>' +
      '<span class="milestone-label" style="color:' + (reached?'var(--text)':'var(--sub)') + ';">' + ms.label + '</span>' +
      '<span class="milestone-pct ' + (reached?'milestone-done':'milestone-pending') + '">' + (reached?'✓ done':ms.pct+'%') + '</span>';
    msList.appendChild(item);
  });
  msCard.appendChild(msList);
  grid.appendChild(msCard);

  // ── Activity heatmap (simulated from task completion data)
  const hmCard = document.createElement('div');
  hmCard.className = 'chart-card full';
  hmCard.innerHTML = '<div class="chart-title">Progress heatmap — tasks per phase</div><div class="chart-sub">Each cell = 1 day block · shade = % complete</div>';
  const hmWrap = document.createElement('div');
  hmWrap.className = 'heatmap-wrap';
  const hm = document.createElement('div');
  hm.className = 'heatmap';
  // Build one row per phase, cells per day
  PHASES.forEach(function(ph, pi) {
    var row = document.createElement('div');
    row.className = 'heatmap-row';
    // Phase label
    var lbl = document.createElement('div');
    lbl.style.cssText = 'font-family:"JetBrains Mono",monospace;font-size:9px;color:var(--sub);width:24px;flex-shrink:0;display:flex;align-items:center;';
    lbl.textContent = 'P' + (pi+1);
    row.appendChild(lbl);
    ph.data.forEach(function(d, di) {
      var dTotal = d.tasks.length;
      var dDone  = d.tasks.filter(function(_,ti){ return !!S[tid(pi,di,ti)]; }).length;
      var v = dTotal ? Math.ceil(dDone/dTotal*4) : 0;
      var cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.setAttribute('data-v', v);
      cell.setAttribute('title', d.day + ': ' + dDone + '/' + dTotal + ' done');
      row.appendChild(cell);
    });
    hm.appendChild(row);
  });
  hmWrap.appendChild(hm);
  hmCard.appendChild(hmWrap);
  // Legend
  var leg = document.createElement('div');
  leg.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:10px;';
  leg.innerHTML = '<span style="font-size:10px;color:var(--sub);">Less</span>';
  [0,1,2,3,4].forEach(function(v) {
    var c = document.createElement('div');
    c.className = 'heatmap-cell';
    c.setAttribute('data-v', v);
    leg.appendChild(c);
  });
  leg.innerHTML += '<span style="font-size:10px;color:var(--sub);">More</span>';
  hmCard.appendChild(leg);
  grid.appendChild(hmCard);

  container.appendChild(grid);
}

// ══════════════════════════════════════════════════════════════════
//  POMODORO TIMER
// ══════════════════════════════════════════════════════════════════
var timerInterval   = null;
var timerRunning    = false;
var timerSeconds    = 25 * 60;
var timerTotal      = 25 * 60;
var timerSession    = 1;
var timerMode       = 'pomodoro';
var selectedTaskId  = null;
var selectedTaskPi  = -1;
var selectedTaskDi  = -1;
var selectedTaskTi  = -1;

function setTimerMode(mode, minutes) {
  if (timerRunning) return;
  timerMode  = mode;
  timerTotal = minutes * 60;
  timerSeconds = timerTotal;
  document.querySelectorAll('.timer-mode-btn').forEach(function(b) { b.classList.remove('active'); });
  event.target.classList.add('active');
  var labels = { pomodoro:'Focus', short:'Short Break', long:'Long Break' };
  document.getElementById('timer-mode-label').textContent = labels[mode] || 'Focus';
  updateTimerDisplay();
}

function updateTimerDisplay() {
  var m = Math.floor(timerSeconds / 60);
  var s = timerSeconds % 60;
  document.getElementById('timer-display').textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  // Ring
  var circ = 2 * Math.PI * 90; // 565.49
  var offset = circ * (1 - timerSeconds / timerTotal);
  document.getElementById('timer-ring').style.strokeDashoffset = circ - offset;
  // Session dots
  var dots = document.querySelectorAll('.timer-dot');
  dots.forEach(function(dot, i) { dot.classList.toggle('done', i < timerSession - 1); });
  document.getElementById('timer-sessions-label').textContent = 'Session ' + timerSession + ' of 4';
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById('timer-start-btn').textContent = '▶ Resume';
  } else {
    timerRunning = true;
    document.getElementById('timer-start-btn').textContent = '⏸ Pause';
    timerInterval = setInterval(function() {
      timerSeconds--;
      updateTimerDisplay();
      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById('timer-start-btn').textContent = '▶ Start';
        // Auto advance sessions
        if (timerMode === 'pomodoro') {
          timerSession = Math.min(timerSession + 1, 5);
          updateTimerDisplay();
          try { new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA...').play(); } catch(e) {}
          // Simple beep via Web Audio
          try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
            osc.start(); osc.stop(ctx.currentTime + 0.8);
          } catch(e) {}
          // Mark selected task done if set
          if (selectedTaskId && !S[selectedTaskId]) {
            doTask(selectedTaskPi, selectedTaskDi, selectedTaskTi);
            renderTimerTasks();
            renderFocusIfActive();
          }
        }
        // Reset for next session
        timerSeconds = timerTotal;
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = timerTotal;
  document.getElementById('timer-start-btn').textContent = '▶ Start';
  updateTimerDisplay();
}

function renderTimerTasks() {
  const list = document.getElementById('timer-task-list');
  if (!list) return;
  list.innerHTML = '';

  // Show incomplete tasks across all phases
  var count = 0;
  PHASES.forEach(function(ph, pi) {
    ph.data.forEach(function(d, di) {
      d.tasks.forEach(function(task, ti) {
        if (count > 40) return;
        var id = tid(pi, di, ti);
        if (S[id]) return; // skip done tasks
        count++;
        var item = document.createElement('div');
        item.className = 'timer-task-item' + (selectedTaskId === id ? ' selected' : '');
        item.id = 'tt_' + id;

        var cb = document.createElement('div');
        cb.className = 'timer-task-cb' + (S[id] ? ' on' : '');

        var txt = document.createElement('span');
        txt.textContent = task.t;
        txt.style.lineHeight = '1.4';

        item.appendChild(cb);
        item.appendChild(txt);

        (function(cPi, cDi, cTi, cId, cTask) {
          item.addEventListener('click', function() {
            selectedTaskId = cId;
            selectedTaskPi = cPi;
            selectedTaskDi = cDi;
            selectedTaskTi = cTi;
            document.querySelectorAll('.timer-task-item').forEach(function(el) { el.classList.remove('selected'); });
            item.classList.add('selected');
            var cur = document.getElementById('timer-current-task');
            if (cur) cur.innerHTML =
              '<span style="color:var(--purple);font-size:11px;font-weight:600;display:block;margin-bottom:4px;">🎯 Focused task</span>' +
              '<span style="font-size:12px;color:var(--text);">' + cTask.t + '</span>';
          });
        })(pi, di, ti, id, task);

        list.appendChild(item);
      });
    });
  });

  if (count === 0) {
    list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--sub);font-size:13px;">🎉 All tasks complete!</div>';
  }
  updateTimerDisplay();
}

function renderFocusIfActive() {
  if (curView === 'focus') renderFocus();
}

// Re-render kanban/focus/analytics when tasks change (hook into doTask)
var _originalDoTask = window.doTask;
// We override updateStats to also refresh other views if open
var _origUpdateStats = window.updateStats;
window.updateStats = function() {
  _origUpdateStats();
  if (curView === 'kanban')    renderKanban();
  if (curView === 'analytics') renderAnalytics();
  if (curView === 'focus')     renderFocus();
};

// ─── INIT ─────────────────────────────────────────────────────────
// Views JS is loaded after app.js which already ran init.
// We just need to ensure the timer display is set on load.
updateTimerDisplay();
