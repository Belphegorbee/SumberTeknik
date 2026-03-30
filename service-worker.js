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

// Fetch event (Cache First Strategy)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan dari cache jika ada, jika tidak fetch dari network
        return response || fetch(event.request);
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