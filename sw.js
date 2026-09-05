// Service worker : rend l'app disponible hors ligne.
// Changez la version à chaque mise à jour de l'app pour forcer le rafraîchissement du cache.
const VERSION = 'dori-v7.3';
const FILES = ['./', './index.html', './parser.js', './theme.css', './fonts/SpaceGrotesk.woff', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.allSettled(FILES.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Cache d'abord (ouverture instantanée, même réseau lent), puis mise à jour silencieuse en arrière-plan :
// la nouvelle version est servie à l'ouverture suivante. Hors ligne : cache, sinon index.html pour la navigation.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const refresh = fetch(e.request).then(r => {
      if (r && r.ok) e.waitUntil(e.request.mode === 'navigate' ? Promise.all([cache.put('./index.html', r.clone()), cache.put('./', r.clone())]) : cache.put(e.request, r.clone()));
      return r;
    }).catch(() => null);
    if (cached) { e.waitUntil(refresh); return cached; }
    const net = await refresh;
    if (net) return net;
    return e.request.mode === 'navigate' ? (await cache.match('./index.html')) : Response.error();
  })());
});
