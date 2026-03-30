const CACHE_NAME = 'sumberteknik-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/menu.html',
  '/dashboard.html',
  '/pembayaran.html',
  '/subpembayaran.html',
  '/laporan.html',
  '/listtagihan.html',
  '/gajih_operator.html',
  '/pengisian_solar.html',
  '/REPAIR.html',
  '/background.png',
  '/logo.png',
  '/splashscreen.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;

        return fetch(event.request).then(
          networkResponse => {
            // Cache response yang sukses untuk kunjungan berikutnya
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          }
        ).catch(() => {
          // Kalau offline dan tidak ada di cache, bisa return offline page nanti
          console.log('Offline & no cache for:', event.request.url);
        });
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
