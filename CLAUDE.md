# CLAUDE.md — learn-italian (Ponte)

Static offline-first PWA for learning Italian from Spanish (~515 phrase pairs).
App name: "Ponte — Spagnolo → Italiano".

## Deploy

- **GitHub**: `github.com/henke101/learn-italian` (public), account **henke101** (same
  personal account as mbarete-gainz). NOT the aguara.lan/Gitea pipeline, NOT `fox-arg`.
- **Hosting**: GitHub Pages from `main` / root. Push to `main` = deploy; Pages rebuilds in ~1 min.
- **Live**: https://henke101.github.io/learn-italian/
- No build step — files are served as-is.

## Architecture gotchas (verified in-bundle, don't re-break these)

- `bundle.js` was built with **react as an external global** (bare `React.createElement`,
  ~142 refs) but **embeds its own react-dom** (`createRoot` defined internally, react-dom
  18.3.1 baked in, zero global `ReactDOM` refs). So:
  - `index.html` MUST load `react.production.min.js` (UMD 18.3.1, vendored locally for
    offline) **before** `bundle.js`. Missing this → `ReferenceError: Can't find variable: React`.
  - Do NOT also load react-dom — it's dead weight (a 131 KB vendored react-dom was removed
    for exactly this reason; the app references no global ReactDOM).
  - If `bundle.js` is ever rebuilt, re-check the embedded react-dom version and match the
    vendored `react.production.min.js` to it (React and ReactDOM must be same version).

- `sw.js` (CACHE `ponte-v3`): **network-first for navigations + stale-while-revalidate for
  assets**, plus a `controllerchange` auto-reload in index.html. So deploys apply on next
  load without a manual cache clear. **Bump `CACHE` in sw.js whenever assets change.**

## iOS install

Offline home-screen PWA only works when added from **Safari** (Chrome "Add to Home Screen"
is just a bookmark, needs a connection). After a deploy, an already-installed device may
need one online open to pick up the new service worker.
