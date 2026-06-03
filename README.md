# Ponte — Spagnolo → Italiano

A small offline-first PWA for learning Italian from Spanish: ~515 phrase pairs in a
React app, installable to the iPhone home screen and fully usable without a connection.

**Live:** https://henke101.github.io/learn-italian/

## Files

| File | What |
|---|---|
| `index.html` | Entry point. Loads React, then the app bundle, then registers the service worker. |
| `bundle.js` | The whole app (UI + phrase data + react-dom), minified. |
| `react.production.min.js` | React runtime (UMD 18.3.1). The bundle expects `React` as a global, so it loads first. `react-dom` is already inside `bundle.js`. |
| `sw.js` | Service worker — network-first for the page, stale-while-revalidate for assets. Full offline after first load. |
| `manifest.json` | PWA manifest for "Add to Home Screen". |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons. |

No build step — the files are ready to serve as-is.

## Install on iPhone (offline)

iOS only grants offline/standalone behaviour to apps added from **Safari** (a Chrome
"Add to Home Screen" is just a bookmark and needs a connection).

1. Open the live URL in **Safari**.
2. Let it load once — this caches everything for offline use.
3. Share button → **Add to Home Screen** → name it → **Add**.
4. Open the icon once while online so caching finishes, then it works in Airplane Mode.

Note: the click-to-hear pronunciation (TTS) needs internet on some iOS versions; the
rest of the app is fully offline.

## Deploy / update

Hosted on GitHub Pages from `main` (root). To update:

```bash
git add -A
git commit -m "…"
git push
```

Pages rebuilds in ~1 minute. The service worker is network-first for the page, so a
new version shows up on the next load when online; bump `CACHE` in `sw.js` when assets
change to force a clean refresh of cached files.
