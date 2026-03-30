const CACHE_NAME = 'sumberteknik-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/pembayaran.html',
  '/subpembayaran.html',
  '/laporan.html',
  '/listtagihan.html',
  '/gajih_operator.html',
  '/gajih_helper.html',
  '/pengisian_solar.html',
  '/REPAIR.html',
  '/background.png',
  '/logo-192.png',
  '/logo-512.png',
  '/splashscreen.png'
];

// ================= INSTALL =================
self.addEventListener('install', event => {
  self.skipWaiting(); // langsung aktif tanpa nunggu reload

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ================= FETCH =================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {

        // kalau ada di cache → pakai
        if (response) return response;

        // kalau tidak → ambil dari network
        return fetch(event.request)
          .then(networkResponse => {

            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            const clone = networkResponse.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });

            return networkResponse;
          })
          .catch(() => {
            // fallback saat offline total
            return caches.match('/index.html');
          });

      })
  );
});

// ================= ACTIVATE =================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim()) // langsung kontrol semua tab
  );
});
