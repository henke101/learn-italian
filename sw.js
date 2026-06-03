// Ponte service worker
// - Navigations: network-first (always get the latest HTML when online), fall back to cache offline.
// - Static assets: stale-while-revalidate (instant from cache, refreshed in the background).
// This keeps the app fully offline while making updates appear on the next load.
const CACHE = 'ponte-v3';
const ASSETS = [
  './',
  './index.html',
  './react.production.min.js',
  './bundle.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Install: pre-cache core assets, activate immediately
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function(cache) { return cache.addAll(ASSETS); })
      .then(function() { return self.skipWaiting(); })
  );
});

// Activate: drop old caches, take control of open clients
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  // Navigations: network-first so a deploy shows up immediately when online.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE).then(function(cache) { cache.put('./index.html', clone); });
        return response;
      }).catch(function() {
        return caches.match('./index.html').then(function(c) {
          return c || caches.match('./');
        });
      })
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then(function(cached) {
      var network = fetch(req).then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(req, clone); });
        }
        return response;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});
