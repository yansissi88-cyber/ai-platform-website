/**
 * Service Worker for Kira Internal Portal
 * Provides offline support and caching strategies
 */

const CACHE_NAME = 'kira-portal-v1';
const STATIC_CACHE = 'kira-static-v1';
const DATA_CACHE = 'kira-data-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/timeline.html',
  '/roadmap.html',
  '/user-stories.html',
  '/assets/css/styles.css',
  '/assets/css/dashboard.css',
  '/assets/css/timeline.css',
  '/assets/css/roadmap.css',
  '/assets/css/user-stories.css',
  '/assets/css/search.css',
  '/assets/js/dashboard.js',
  '/assets/js/timeline.js',
  '/assets/js/roadmap.js',
  '/assets/js/user-stories.js',
  '/assets/js/search.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests (except GitHub API)
  if (url.origin !== self.location.origin && !url.hostname.includes('githubusercontent.com')) {
    return;
  }
  
  // Strategy for data files (JSON)
  if (url.pathname.endsWith('.json')) {
    event.respondWith(dataStrategy(request));
    return;
  }
  
  // Strategy for images
  if (request.destination === 'image') {
    event.respondWith(imageStrategy(request));
    return;
  }
  
  // Default strategy for static assets
  event.respondWith(staticStrategy(request));
});

// Network-first strategy for data files
async function dataStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Update cache with fresh data
    const cache = await caches.open(DATA_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return empty data as fallback
    return new Response(JSON.stringify({ error: 'Offline', data: [] }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache-first strategy for static assets
async function staticStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(response => {
        if (response.ok) {
          caches.open(STATIC_CACHE)
            .then(cache => cache.put(request, response));
        }
      })
      .catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Fetch failed:', request.url);
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
      return caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Stale-while-revalidate for images
async function imageStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        const cache = caches.open(DATA_CACHE);
        cache.then(c => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('[SW] Syncing data in background...');
  // Re-fetch all data files to ensure freshness
  const dataFiles = [
    '/data/timeline-data.json',
    '/data/roadmap-data.json',
    '/data/user-stories.json'
  ];
  
  await Promise.all(
    dataFiles.map(url => 
      fetch(url)
        .then(response => {
          if (response.ok) {
            return caches.open(DATA_CACHE)
              .then(cache => cache.put(url, response));
          }
        })
        .catch(err => console.log('[SW] Sync failed for:', url, err))
    )
  );
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New update available',
    icon: '/images/icon-192.png',
    badge: '/images/icon-72.png',
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'View' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Kira Portal', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});

// Periodic background sync (when supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-check') {
    event.waitUntil(syncData());
  }
});

console.log('[SW] Service Worker loaded');
