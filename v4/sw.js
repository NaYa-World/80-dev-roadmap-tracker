const CACHE = 'devmap-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/state.js',
  './js/ui.js',
  './js/pomodoro.js',
  './js/ai-brief.js',
  './js/views.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap'
];
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  // Always network-first for Claude API calls
  if(e.request.url.includes('anthropic.com')){ return; }
  e.respondWith(caches.match(e.request).then(function(cached){
    return cached || fetch(e.request).then(function(resp){
      const clone=resp.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request,clone); });
      return resp;
    });
  }));
});
