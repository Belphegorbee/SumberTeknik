const CACHE_NAME = 'sumberteknik-v1';

const urlsToCache = [
  'index.html',
  'menu.html',
  'dashboard.html',
  'pembayaran.html',
  'subpembayaran.html',
  'laporan.html',
  'listtagihan.html',
  'gajih_operator.html',
  'pengisian_solar.html',
  'REPAIR.html',
  'background.png',
  'logo.png',
  'splashscreen.png'
];

// INSTALL
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// FETCH
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {

        if (response) return response;

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
            return caches.match('index.html');
          });

      })
  );
});

// ACTIVATE
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
    })
  );
});
