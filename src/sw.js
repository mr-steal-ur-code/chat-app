// change to the version you get from `npm ls workbox-build`
importScripts('workbox-v4.3.1/workbox-sw.js');

// your custom service worker code
self.addEventListener("message", (event,{ data }) => {
  if (event.request.mode === 'navigate' && registration.waiting) {
    if (( clients.matchAll()).length < 2) {
      registration.waiting.postMessage("skipWaiting");
    }
  }
});

self.addEventListener("fetch",event => {
  event.respondWith((async () => {
  if (event.request.mode === "navigate" &&
    event.request.method === "GET" &&
    registration.waiting &&
    (await clients.matchAll()).length < 2
  ) {
    registration.waiting.postMessage('skipWaiting');
    return new Response("", {headers: {"Refresh": "0"}});
  }
  return await caches.match(event.request) ||
    fetch(event.request);
})());
});

// the precache manifest will be injected into the following line
self.workbox.precaching.precacheAndRoute([]);