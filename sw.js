// Service Worker for PWA functionality

const CACHE_NAME = 'tennis-oath-v2';
const urlsToCache = [
    '/tennis-oath/',
    '/tennis-oath/index.html',
    '/tennis-oath/styles.css',
    '/tennis-oath/app.js',
    '/tennis-oath/manifest.json',
    '/tennis-oath/sw.js'
];

// Version tracking
const APP_VERSION = '2.0.0';

// Install event - cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache).catch(err => {
                console.log('Cache addAll error:', err);
                // Don't fail install if some resources aren't available
                return Promise.resolve();
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first for app files, cache first for others
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    const isAppFile = url.pathname.endsWith('.html') ||
                      url.pathname.endsWith('.js') ||
                      url.pathname.endsWith('.css') ||
                      url.pathname === '/tennis-oath/' ||
                      url.pathname === '/tennis-oath';

    if (isAppFile) {
        // Network first for app files - ensures users get updates
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache the new version
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache first for other resources
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }).catch(() => {
                    return new Response('Offline - please check your connection');
                });
            })
        );
    }
});

// Message event - allow clients to skip waiting
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
