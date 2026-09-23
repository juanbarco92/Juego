const CACHE_NAME = 'emma-aprende-v5';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './src/data/curriculum.js',
    './src/data/assets.js',
    './src/services/AudioService.js',
    './src/managers/LearningManager.js',
    './src/core/GameEngine.js'
];

// Install service worker & cache critical shell
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

// Immediate activation message listener
self.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Activate & immediately claim clients + purge all previous caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Purgando caché antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch with smart strategy: Network-First for core code, Cache-First for media
self.addEventListener('fetch', function(event) {
    if (event.request.method !== 'GET') return;

    const url = event.request.url;
    const isCoreFile = url.endsWith('.html') || url.endsWith('.js') || url.endsWith('.css') || url.endsWith('/') || url.includes('/src/');

    if (isCoreFile) {
        // Network-First strategy: Ensures user always sees latest code if online, works offline if network fails
        event.respondWith(
            fetch(event.request)
                .then(function(networkResponse) {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, copy);
                        });
                    }
                    return networkResponse;
                })
                .catch(function() {
                    return caches.match(event.request);
                })
        );
    } else {
        // Cache-First strategy for media assets (images, audio, fonts)
        event.respondWith(
            caches.match(event.request).then(function(cachedResponse) {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(function(networkResponse) {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, copy);
                        });
                    }
                    return networkResponse;
                });
            })
        );
    }
});