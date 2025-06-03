// Service Worker for OEM Procurement System PWA
const CACHE_NAME = 'oem-procurement-v1.0.0';
const STATIC_CACHE_NAME = 'oem-procurement-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'oem-procurement-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/styles/main.css',
    '/src/app.js',
    '/src/data/mockData.js',
    '/src/services/dataService.js',
    '/src/components/insights.js',
    '/src/components/quality.js',
    '/src/components/contracts.js',
    '/src/components/suppliers.js',
    '/src/components/purchasing.js',
    // External CDN resources
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Dynamic cache patterns
const CACHE_PATTERNS = [
    /\/api\//,
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\.(?:js|css)$/
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES.map(url => new Request(url, { cache: 'reload' })));
            }).catch((error) => {
                console.error('Service Worker: Failed to cache static files', error);
                // Continue even if some files fail to cache
                return Promise.resolve();
            })
        ]).then(() => {
            console.log('Service Worker: Installed successfully');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE_NAME && 
                        cacheName !== DYNAMIC_CACHE_NAME &&
                        cacheName.startsWith('oem-procurement-')) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated successfully');
            return self.clients.claim();
        })
    );
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request.url)) {
        event.respondWith(handleStaticFile(request));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(handleAPIRequest(request));
    } else if (isDynamicAsset(request.url)) {
        event.respondWith(handleDynamicAsset(request));
    } else {
        event.respondWith(handleGenericRequest(request));
    }
});

// Handle static files (HTML, CSS, JS)
function handleStaticFile(request) {
    return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
            // Return cached version and update in background
            updateCache(request);
            return cachedResponse;
        }
        
        // Fetch and cache if not found
        return fetchAndCache(request, STATIC_CACHE_NAME);
    }).catch(() => {
        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
    });
}

// Handle API requests
function handleAPIRequest(request) {
    return fetch(request).then((response) => {
        // Cache successful API responses
        if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
            });
        }
        return response;
    }).catch(() => {
        // Return cached API response if network fails
        return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            // Return offline data structure
            return new Response(JSON.stringify({
                error: 'Offline',
                cached: false,
                timestamp: Date.now()
            }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            });
        });
    });
}

// Handle dynamic assets (images, fonts, etc.)
function handleDynamicAsset(request) {
    return caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return fetchAndCache(request, DYNAMIC_CACHE_NAME);
    }).catch(() => {
        // Return placeholder for images
        if (request.url.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
            return generatePlaceholderImage();
        }
        return new Response('Asset not available offline', { status: 503 });
    });
}

// Handle generic requests
function handleGenericRequest(request) {
    return fetch(request).catch(() => {
        return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response('Not available offline', { status: 503 });
        });
    });
}

// Helper functions
function isStaticFile(url) {
    return STATIC_FILES.some(pattern => url.includes(pattern)) ||
           url.match(/\.(html|css|js)$/);
}

function isAPIRequest(url) {
    return url.includes('/api/') || url.includes('api.');
}

function isDynamicAsset(url) {
    return CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function fetchAndCache(request, cacheName) {
    return fetch(request).then((response) => {
        if (response.ok) {
            const responseClone = response.clone();
            caches.open(cacheName).then((cache) => {
                cache.put(request, responseClone);
            });
        }
        return response;
    });
}

function updateCache(request) {
    fetch(request).then((response) => {
        if (response.ok) {
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, response);
            });
        }
    }).catch(() => {
        // Silently fail cache updates
    });
}

function generatePlaceholderImage() {
    // Generate a simple SVG placeholder
    const svg = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#f3f4f6"/>
            <text x="100" y="100" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
                Image Offline
            </text>
        </svg>
    `;
    
    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-cache'
        }
    });
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'background-sync-procurement') {
        event.waitUntil(syncProcurementData());
    }
});

function syncProcurementData() {
    return new Promise((resolve) => {
        // Simulate background data sync
        console.log('Service Worker: Syncing procurement data in background');
        
        // In a real app, this would sync with server
        setTimeout(() => {
            console.log('Service Worker: Background sync completed');
            resolve();
        }, 1000);
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push received', event);
    
    const options = {
        body: event.data ? event.data.text() : 'New procurement update available',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/?view=insights'
        },
        actions: [
            {
                action: 'view',
                title: 'View Details',
                icon: '/icons/action-view.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/icons/action-dismiss.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('OEM Procurement System', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        caches.keys().then((cacheNames) => {
            event.ports[0].postMessage({
                caches: cacheNames,
                version: CACHE_NAME
            });
        });
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('Service Worker: Periodic sync triggered', event.tag);
    
    if (event.tag === 'procurement-data-sync') {
        event.waitUntil(syncProcurementData());
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});

// Cache management utilities
function cleanupCaches() {
    return caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName.startsWith('oem-procurement-dynamic-')) {
                    return caches.open(cacheName).then((cache) => {
                        return cache.keys().then((requests) => {
                            // Keep only recent dynamic cache entries (last 50)
                            if (requests.length > 50) {
                                const toDelete = requests.slice(0, requests.length - 50);
                                return Promise.all(
                                    toDelete.map((request) => cache.delete(request))
                                );
                            }
                        });
                    });
                }
            })
        );
    });
}

// Run cleanup periodically
setInterval(cleanupCaches, 30 * 60 * 1000); // Every 30 minutes

console.log('Service Worker: Script loaded');