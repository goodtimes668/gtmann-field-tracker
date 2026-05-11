// GT Mann Field Tracker — Service Worker
// Cache-first strategy for offline support on construction sites with spotty signal

const CACHE_NAME = ‘gtmann-field-v1’;
const ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap’
];

self.addEventListener(‘install’, (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {
// Some external assets may fail to cache; ignore and continue
}))
);
self.skipWaiting();
});

self.addEventListener(‘activate’, (e) => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

self.addEventListener(‘fetch’, (e) => {
// Cache-first for app shell, network-fallback
e.respondWith(
caches.match(e.request).then(cached => {
if (cached) return cached;
return fetch(e.request).then(resp => {
// Cache new requests opportunistically
if (resp.ok && e.request.method === ‘GET’) {
const respClone = resp.clone();
caches.open(CACHE_NAME).then(c => c.put(e.request, respClone));
}
return resp;
}).catch(() => {
// Offline + not cached — return a minimal fallback
if (e.request.mode === ‘navigate’) {
return caches.match(’./index.html’);
}
});
})
);
});
