const CACHE_NAME = 'waktu-solat-v4';

// Pre-cache the app shell — index.html MUST be here so Chrome considers
// the PWA installable (it checks that start_url is served offline).
const SHELL = [
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];

// Install: cache shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
  const url = e.request.url;

  // API calls — network first, fall back to cache (offline support)
  if (url.includes('e-solat.gov.my') || url.includes('corsproxy.io') || url.includes('allorigins.win')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else — cache first, network fallback, cache dynamically
  // Navigation requests (index.html) will be served from cache if offline.
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      });
    }).catch(() => caches.match('./index.html'))
  );
});

// Notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('e-Solat') || c.url.endsWith('/'));
      if (existing) return existing.focus();
      return clients.openWindow('./index.html');
    })
  );
});
