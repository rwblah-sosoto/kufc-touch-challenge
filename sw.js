const CACHE = "kufc-v3";
const ASSETS = ["/kufc-touch-challenge/", "/kufc-touch-challenge/index.html", "/kufc-touch-challenge/u11-leaderboard.html", "/kufc-touch-challenge/u12-leaderboard.html", "/kufc-touch-challenge/pst-leaderboard.html", "/kufc-touch-challenge/privacy_policy.html"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener("fetch", e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));
