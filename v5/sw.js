const CACHE = 'devmap-v5';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/state.js',
  './js/ui.js',
  './js/pomodoro.js',
  './js/ai-brief.js',
  './js/questions.js',
  './js/views.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap'
];
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(ASSETS.map(function(url) {
        return new Request(url, { cache: 'reload' });
      })).catch(function() {
        return c.addAll(ASSETS.filter(function(u) { return u.startsWith('.'); }));
      });
    })
  );
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  // Never cache API calls
  if (e.request.url.includes('anthropic.com') || e.request.url.includes('api.github.com')) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return resp;
      });
    }).catch(function() {
      return caches.match('./index.html');
    })
  );
});
