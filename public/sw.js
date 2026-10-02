// Care Saathi Offline-First Service Worker
// Version 2.0.0 - Full Offline App Shell & Static Asset Caching

const CACHE_NAME = 'care-saathi-static-v2';
const RUNTIME_CACHE = 'care-saathi-runtime-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) {
            console.log('Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Do not intercept non-GET requests or mutation endpoints
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Exclude server-side dynamic report upload / chat API calls from service worker cache
  // (Sync & IndexedDB handle data persistence and queued mutations)
  if (url.pathname.startsWith('/api/chat') || url.pathname.startsWith('/api/analyze')) {
    return;
  }

  // 1. Navigation Requests (HTML / App Shell): Network First, fallback to cached '/' or '/index.html'
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(async () => {
          // Offline navigation fallback: serve cached index.html
          const cachedNavigate = await caches.match(request);
          if (cachedNavigate) return cachedNavigate;
          const cachedRoot = await caches.match('/');
          if (cachedRoot) return cachedRoot;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, Fonts, Vite assets)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate (Stale-While-Revalidate)
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {
          // Silently handle offline network revalidation failure
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in runtime cache
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseClone = networkResponse.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      }).catch(async (fetchError) => {
        // Try fallback for assets
        if (request.destination === 'image') {
          return caches.match('/icon-192.png');
        }
        throw fetchError;
      });
    })
  );
});
