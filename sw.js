const CACHE_NAME = "segunda-sagrada-v9";
const APP_SHELL = ["./", "./index.html", "./master.html", "./geral-content.html", "./duplas.html", "./instalar.html", "./manifest.json"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME).map(cacheName => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const scopeUrl = new URL("./", self.location.href);
  const sameOrigin = requestUrl.origin === self.location.origin;
  const isAppRootNavigation = event.request.mode === "navigate" && requestUrl.pathname === scopeUrl.pathname;
  const isFreshAsset = sameOrigin && (
    requestUrl.pathname.endsWith(".js") ||
    requestUrl.pathname.endsWith(".html") ||
    requestUrl.pathname.endsWith(".css")
  );

  if (isAppRootNavigation) {
    event.respondWith(
      fetch("./master.html", { cache: "no-store" })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put("./master.html", copy));
          }
          return response;
        })
        .catch(() => caches.match("./master.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request, isFreshAsset ? { cache: "no-store" } : undefined)
      .then(response => {
        const copy = response.clone();
        if (response.ok && sameOrigin) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
