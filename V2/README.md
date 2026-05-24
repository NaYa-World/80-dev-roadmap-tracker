# Dev Roadmap v2 — 80 Days Zero to Hired

React · TypeScript · Tailwind · DevOps · 8-10 hrs/day

## Folder structure

```
dev-roadmap-v2/
├── index.html        ← open this in your browser
├── css/
│   └── style.css     ← all styles, dark/light theme, all 4 views
├── js/
│   ├── data.js       ← PHASES data (all 80 days, all tasks)
│   └── app.js        ← all logic: state, rendering, view switching
└── README.md
```

## 4 Views

| View | What it does |
|------|-------------|
| **Roadmap** | Full 80-day checklist. Collapsible phases + day dropdowns. Search + filter. Quiz cards. |
| **Kanban** | Every day as a card: Backlog → In Progress → Review → Done. Auto-updates as you tick tasks. Click a card to jump to that day. |
| **Daily Focus** | Auto-selects your next incomplete day. Day picker, task list, time-block guide. |
| **Stats** | Phase breakdown bars, task-type breakdown, completion ring chart, day heatmap, 14-day streak calendar. |

## Features

- Collapsible phases and day dropdowns with smooth animation
- Tasks-left banner showing your next task to tackle
- Search across all 80 days
- Quiz cards: visible prompt text + Copy button + Open in Claude button (no script errors)
- Dark / Light mode toggle (persists in localStorage)
- 🔥 Day streak counter + 14-day streak calendar
- Day completion heatmap
- Progress ring chart
- Kanban auto-categorises days by completion %

## How to deploy on GitHub Pages (free)

1. Create a new repo e.g. `dev-roadmap-v2`
2. Upload keeping the folder structure intact
3. Settings → Pages → Source: main / root → Save
4. Live at `https://yourusername.github.io/dev-roadmap-v2/`
5. Bookmark on phone — works offline after first load

## Bug fix from v1

The "Script error" was caused by `encodeURIComponent(msg)` inside an HTML
`onclick="..."` attribute. Special characters broke the HTML parser.
Fixed: all quiz buttons are built with `document.createElement` +
`addEventListener` — zero encoded strings inside HTML attributes.
