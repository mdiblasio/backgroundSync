importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.googleAnalytics.initialize();

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

const bgSyncPlugin = new workbox.backgroundSync.Plugin('offlineFormSubmissionsQueue', {
  maxRetentionTime: 60,
  onSync: async({ queue }) => {

    let entry;

    while (entry = await queue.shiftRequest()) {
      try {
        const response = await fetch(entry.request);
        const clone = await response.clone();
        let statusCode = response.status;
        let statusText = await response.text();
        const cache = await caches.open('offline-form-submissions');
        const offlineUrl = `/index.html?statusCode=${statusCode}&statusText=${encodeURI(statusText)}&notification=true`;

        console.log(`offlineUrl = ${offlineUrl}`);

        cache.put(offlineUrl, clone);
        showNotification(offlineUrl);

      } catch (error) {
        await this.unshiftRequest(entry);
        throw error;
      }
    }
  }
});

const showNotification = (notificationUrl) => {
  if (Notification.permission) {
    self.registration.showNotification('Your form was submitted!', {
      body: "Click to see the result",
      icon: '/icon-192x192.png',
      data: {
        url: notificationUrl
      }
    });
  }
}

workbox.routing.registerRoute(
  /submit_form/,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  })
);

workbox.routing.setCatchHandler(({ event }) => {
  console.log('default catch handler');
  switch (event.request.destination) {
    // case 'document':
    //   return caches.match(FALLBACK_HTML_URL);
    //   break;
    default:
      return Response.error();
  }
});

self.addEventListener('notificationclick', function(event) {
   event.notification.close();
   event.waitUntil(
      clients.openWindow(event.notification.data.url)
   );
});