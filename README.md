# 80-Day Dev Roadmap Tracker

Zero to hired — React · TypeScript · Tailwind · DevOps · 8–10 hrs/day

## Folder structure

```
dev-roadmap/
├── index.html        ← open this in your browser
├── css/
│   └── style.css     ← all styles, theme variables, dark/light mode
├── js/
│   └── app.js        ← all data, logic, rendering, quiz cards
└── README.md
```

## How to use locally

Just open `index.html` in any browser. No server needed.  
Progress is saved automatically in `localStorage` — it persists across page refreshes.

## How to host on GitHub Pages (free, accessible on any device)

1. Create a new GitHub repo (e.g. `dev-roadmap`)
2. Upload all three files keeping the folder structure:
   - `index.html` at the root
   - `css/style.css`
   - `js/app.js`
3. Go to repo **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Your tracker will be live at `https://yourusername.github.io/dev-roadmap/`
5. Bookmark it on your phone — works offline after first load

## Features

- ✅ Collapsible phases (click phase header to open/close)
- ✅ Collapsible day dropdowns (click day header to open/close)
- ✅ Task checkboxes with flash animation
- ✅ Done / Left / Total / Progress % / 🔥 Streak stats
- ✅ Tasks-left banner showing next task to tackle
- ✅ Search across all concepts and tasks
- ✅ Phase filter tabs
- ✅ Quiz cards — visible prompt text so you know what you're copying
- ✅ Copy prompt button + Open in Claude button (no script errors)
- ✅ Dark / Light mode toggle (remembers your choice)
- ✅ Top progress strip

## Fixing the script error (what was wrong before)

The old version put `encodeURIComponent(msg)` directly inside an HTML  
`onclick="..."` attribute string. When the encoded URL contained `&`, `'`,  
or `%` characters, the HTML parser broke the attribute and threw  
`Uncaught Error: Script error`.

The fix: quiz card buttons are now built entirely with `document.createElement`  
and `addEventListener` — no encoded strings inside HTML attributes at all.
