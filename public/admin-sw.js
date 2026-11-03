/* ============================================================================
 * LLT-Management — Admin PWA Service Worker (/admin scope)
 * Handles background Web Push notifications, deep-linking, and reminder sync
 * ============================================================================ */

const SW_VERSION = "llt-management-v1.0.0";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for Web Push notifications sent from server (works when app is closed / phone locked)
self.addEventListener("push", (event) => {
  let payload = {
    title: "LLT-Management Alert",
    body: "You have a new dispatch notification.",
    url: "/admin/dashboard",
    tag: "llt-general",
    category: "general",
    requireInteraction: true,
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const actions =
    payload.category === "pob_check_20m"
      ? [
          { action: "open", title: "Update POB / Status" },
          { action: "dismiss", title: "Dismiss" },
        ]
      : payload.category === "unassigned_3h"
      ? [
          { action: "open", title: "Assign Driver Now" },
          { action: "dismiss", title: "Dismiss" },
        ]
      : [
          { action: "open", title: "Open in LLT-Management" },
          { action: "dismiss", title: "Dismiss" },
        ];

  const options = {
    body: payload.body,
    icon: "/Luxelyne-Transfers-Icon.png",
    badge: "/Luxelyne-Transfers-Icon.png",
    tag: payload.tag || payload.notification_key || `llt-${Date.now()}`,
    renotify: true,
    requireInteraction: payload.requireInteraction !== false,
    vibrate: [250, 120, 250, 120, 350],
    data: {
      url: payload.url || "/admin/dashboard",
      category: payload.category || "general",
      bookingId: payload.bookingId || null,
    },
    actions,
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Deep-link directly to the relevant Admin page when notification is tapped
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/admin/dashboard";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/admin") && "focus" in client) {
            client.postMessage({
              type: "LLT_NAVIGATE",
              url: targetUrl,
            });
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

// Background Periodic Sync support (Android Chrome PWA)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "llt-admin-reminders-sync") {
    event.waitUntil(
      fetch("/api/admin/notifications/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).catch(() => {})
    );
  }
});

// Allow client pages to trigger a local OS notification via Service Worker registration
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SHOW_LOCAL_NOTIFICATION" && event.data.payload) {
    const p = event.data.payload;
    self.registration.showNotification(p.title || "LLT-Management", {
      body: p.body || "",
      icon: "/Luxelyne-Transfers-Icon.png",
      badge: "/Luxelyne-Transfers-Icon.png",
      tag: p.tag || `llt-local-${Date.now()}`,
      renotify: true,
      requireInteraction: true,
      vibrate: [250, 120, 250],
      data: { url: p.url || "/admin/dashboard" },
    });
  }
});

