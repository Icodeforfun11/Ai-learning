/* UCP CODE AI service worker: caches the app shell for fast, offline-tolerant launches from the iOS home screen.
   API calls (/api/*) are never cached. */
const CACHE = "ucp-shell-v1";
const SHELL = ["/", "/learn", "/studio", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  // network-first for pages, cache-first for static assets
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((ca) => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("/"))));
  } else if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const c = res.clone(); caches.open(CACHE).then((ca) => ca.put(e.request, c)); return res; })));
  }
});
