
self.addEventListener("push", (event) => {
  let data = {
    title: "New Notification",
    body: "You have a new update.",
    icon: "/icon.png",
    badge: "/icon-192x192.png",
    tag: "generic",
    data: { url: "/", type: "generic" },
  };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    // fallback to default data
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    data: data.data,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const notificationData = event.notification.data || {};
  let urlToOpen = notificationData.url || "/";

  if (!urlToOpen.startsWith("http")) {
    urlToOpen = new URL(urlToOpen, self.location.origin).href;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});