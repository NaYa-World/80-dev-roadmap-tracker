# Dev Roadmap v3 — Zero to Hired in 80 Days

## Features

| Feature | Details |
|---------|---------|
| **Roadmap** | Collapsible phases + days, search, filter, notes per day, quiz cards |
| **Kanban** | Days auto-sorted: Backlog → In Progress → Review → Done |
| **Daily Focus** | Auto-detects next incomplete day, day picker, AI brief, time block guide |
| **AI Daily Brief** | Claude generates a personalised daily coaching brief based on your real progress |
| **Pomodoro Timer** | 25/5/15 min modes, audio alert, study hours tracked automatically |
| **Stats Dashboard** | ETA, Interview Readiness Score, study hours, phase bars, heatmap, streak calendar |
| **Job Tracker** | Applied → Phone → Technical → Offer → Rejected Kanban for job applications |
| **Notes per Day** | Write learnings, paste code, Ctrl+S to save — visible on Kanban cards |
| **PWA** | Installable on phone, works offline after first load |
| **Dark/Light mode** | Persists in localStorage |

## Folder structure

```
dev-roadmap-v3/
├── index.html
├── manifest.json       ← PWA manifest
├── sw.js               ← Service worker (offline support)
├── css/
│   └── style.css
├── js/
│   ├── data.js         ← All 80 days of tasks (PHASES array)
│   ├── state.js        ← State engine, ETA, readiness score, notes, jobs
│   ├── ui.js           ← Shared DOM helpers, task toggle, stats update
│   ├── pomodoro.js     ← Timer logic
│   ├── ai-brief.js     ← Claude API integration
│   └── views.js        ← All 5 views + init
└── icons/              ← Add icon-192.png and icon-512.png for PWA
```

## GitHub Pages deployment

1. Create repo `dev-roadmap-v3`
2. Push all files keeping folder structure
3. Settings → Pages → Source: main / root
4. Live at `https://yourusername.github.io/dev-roadmap-v3/`
5. On mobile: tap Share → Add to Home Screen → installs as an app

## AI Brief note

The AI Brief calls the Anthropic API directly from the browser.
This works when opened via GitHub Pages (the API key is handled by claude.ai's
infrastructure when using the Open in Claude button).
For the inline brief to work you need to run it through a backend proxy
that adds your API key — or use the "Open in Claude ↗" button which always works.
