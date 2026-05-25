# Dev Roadmap v5 — Zero to Hired in 80 Days

The most complete version of the tracker. 8 views, mobile-first, fully offline.

## What's new in v5

| Feature | Details |
|---------|---------|
| **Mobile-first** | Bottom tab bar on phones. Full touch UI. Safe area insets for notched phones. |
| **Search 2.0** | Filter by task type (concept/code/quiz/project), status (incomplete/done), and free text — all combinable. |
| **Confidence Ratings** | Rate 1–5 stars after completing each task. Shows on Kanban cards. Surfaces low-confidence tasks in Stats. Reduces readiness score for shaky topics. |
| **AI Code Reviewer** | Paste your code for any exercise directly in the app. Claude reviews it like a senior dev — bugs, improvements, interview-readiness verdict. |
| **Interview Q-Bank** | 60+ real questions across JS, TS, React, Next.js, CSS, DevOps, System Design, Behavioral. Searchable, filterable by topic and difficulty. Mark practiced. Open each in Claude for a full interview simulation. |
| **Weekly Report** | Navigate week-by-week. See tasks/day bar chart, active days, hours studied, readiness %. Export as text file. |
| **GitHub Tracker** | Enter username → fetches real commit graph via GitHub API. Shows 6-month contribution heatmap. Warns if you haven't pushed today. |
| **All v4 features** | Roadmap, Kanban, Daily Focus, AI Brief, Pomodoro, Stats, Jobs tracker, Notes, Dark/Light mode, PWA |

## Folder structure

```
dev-roadmap-v5/
├── index.html          ← single page, all 8 views
├── manifest.json       ← PWA manifest
├── sw.js               ← service worker (offline support)
├── css/
│   └── style.css       ← all styles, mobile-first, 8 views
├── js/
│   ├── data.js         ← PHASES array (80 days of tasks)
│   ├── state.js        ← state engine: localStorage, confidence, ETA, readiness, jobs
│   ├── ui.js           ← shared helpers: theme, checkbox, stars, code review, quiz card, version switcher
│   ├── pomodoro.js     ← 25/5/15 min timer with audio
│   ├── ai-brief.js     ← Claude API daily brief
│   ├── questions.js    ← 60+ interview questions bank
│   └── views.js        ← all 8 views + search 2.0 + init
└── icons/
    ├── icon-192.png    ← add your app icon here
    └── icon-512.png
```

## Deploy to GitHub Pages

1. Add the `v5/` folder to your `NaYa-World/80-dev-roadmap-tracker` repo
2. Push — live at `https://naya-world.github.io/80-dev-roadmap-tracker/v5/`
3. Version switcher auto-detects v5 via GitHub API
4. On Android Chrome: ⋮ → Add to Home Screen → installs as PWA

## Data stays in your browser

All progress (tasks, notes, confidence ratings, jobs, streak) is saved in `localStorage`.
Nothing is sent to any server. The AI Brief and Code Review call the Anthropic API directly.

## Readiness score formula (v5)

```
score = (quiz% × 0.35) + (project% × 0.35) + (code% × 0.20) + (concept% × 0.10)
penalty = low_confidence_tasks × 0.5  (max 10 points)
final = score - penalty
```

Low-confidence means you rated a completed task 1 or 2 stars.
This forces honest self-assessment — ticking a box without understanding costs you.
