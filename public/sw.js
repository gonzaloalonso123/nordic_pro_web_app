const CACHE_NAME = "v1";
const urlsToCache = [
  "/",
  "/icon-192x192.png",
];

self.addEventListener('push', event => {
  let data = { title: 'New Notification', body: 'You have a new update.', icon: '/icon.png', tag: 'generic', data: { url: '/', type: 'generic' } };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    console.error('Error parsing push data:', e);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon.png',
    badge: data.badge || '/icon-192x192.png',
    tag: data.tag,
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const notificationData = event.notification.data;
  let urlToOpen = '/';

  if (notificationData && notificationData.url) {
    urlToOpen = notificationData.url;
  }

  if (!urlToOpen.startsWith('http') && !urlToOpen.startsWith('/')) {
    urlToOpen = '/' + urlToOpen;
  }
  const absoluteUrlToOpen = new URL(urlToOpen, self.location.origin).href;

  const promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then(windowClients => {
    let matchingClient = null;
    for (const windowClient of windowClients) {
      if (windowClient.url === absoluteUrlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(absoluteUrlToOpen);
    }
  });

  event.waitUntil(promiseChain);
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); 
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
