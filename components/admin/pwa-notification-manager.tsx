"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  BellRing,
  CheckCheck,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  UserPlus,
  MessageSquare,
  X,
  Loader2,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface NotificationLogItem {
  id: string
  notification_key: string
  category: string
  title: string
  body: string
  url: string
  booking_id?: string | null
  is_read: boolean
  created_at: string
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function AdminPwaNotificationManager() {
  const router = useRouter()
  const [swReg, setSwReg] = useState<ServiceWorkerRegistration | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [subscribing, setSubscribing] = useState<boolean>(false)
  const [logs, setLogs] = useState<NotificationLogItem[]>([])
  const [panelOpen, setPanelOpen] = useState<boolean>(false)
  const [installGuideOpen, setInstallGuideOpen] = useState<boolean>(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const seenKeysRef = useRef<Set<string>>(new Set())

  // 1. Inject Admin-Scoped Manifest & iOS Native Meta Tags into <head>
  useEffect(() => {
    if (typeof document === "undefined") return

    // Point manifest to /admin-manifest.json while inside /admin
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null
    const previousHref = manifestLink?.getAttribute("href") || "/site.webmanifest"

    if (manifestLink) {
      manifestLink.setAttribute("href", "/admin-manifest.json")
    } else {
      manifestLink = document.createElement("link")
      manifestLink.rel = "manifest"
      manifestLink.href = "/admin-manifest.json"
      document.head.appendChild(manifestLink)
    }

    // Set Apple mobile web app meta tags for iOS standalone full-screen experience
    const metaConfigs = [
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "LLT-Management" },
      { name: "application-name", content: "LLT-Management" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "theme-color", content: "#020617" },
    ]

    metaConfigs.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement("meta")
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    })

    // Ensure Apple Touch Icon points to /llt-management-icon.png
    let appleIcon = document.querySelector(
      'link[rel="apple-touch-icon"]'
    ) as HTMLLinkElement | null
    if (!appleIcon) {
      appleIcon = document.createElement("link")
      appleIcon.rel = "apple-touch-icon"
      document.head.appendChild(appleIcon)
    }
    appleIcon.href = "/llt-management-icon.png"

    // Detect standalone & iOS
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as any).standalone)
    setIsStandalone(standalone)

    const ua = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(ua))

    // Capture Android/Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      if (manifestLink) {
        manifestLink.setAttribute("href", previousHref)
      }
    }
  }, [])

  // 2. Register /admin-sw.js Service Worker & check existing push subscription
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    let mounted = true

    async function initServiceWorker() {
      try {
        const reg = await navigator.serviceWorker.register("/admin-sw.js", {
          scope: "/admin",
        })
        if (!mounted) return
        setSwReg(reg)

        const existingSub = await reg.pushManager.getSubscription()
        if (existingSub && mounted) {
          setIsSubscribed(true)
          // Sync existing subscription to server silently
          fetch("/api/admin/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscription: existingSub.toJSON(),
              deviceLabel: navigator.platform || "Admin Device",
              sendTest: false,
            }),
          }).catch(() => {})
        }

        // Register Periodic Background Sync if supported (Android Chrome PWA)
        if ("periodicSync" in reg) {
          try {
            await (reg as any).periodicSync.register("llt-admin-reminders-sync", {
              minInterval: 15 * 60 * 1000, // 15 mins
            })
          } catch {
            // Ignore if permission not granted yet
          }
        }
      } catch (err) {
        console.error("Service Worker registration failed:", err)
      }
    }

    initServiceWorker()

    // Listen for deep-link navigation messages from Service Worker notification clicks
    const handleSwMessage = (event: MessageEvent) => {
      if (event.data?.type === "LLT_NAVIGATE" && event.data?.url) {
        router.push(event.data.url)
      }
    }
    navigator.serviceWorker.addEventListener("message", handleSwMessage)

    return () => {
      mounted = false
      navigator.serviceWorker.removeEventListener("message", handleSwMessage)
    }
  }, [router])

  // 3. Background & Foreground Reminder Check Poll (runs on mount, tab focus, and every 60s)
  const checkRemindersAndLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) return
      const data = await res.json()

      if (Array.isArray(data.logs)) {
        setLogs(data.logs)
        data.logs.forEach((item: NotificationLogItem) => {
          seenKeysRef.current.add(item.notification_key)
        })
      }

      // If any new reminders were just triggered and device is open, also show toast/local alert
      if (Array.isArray(data.triggeredNotifications) && data.triggeredNotifications.length > 0) {
        data.triggeredNotifications.forEach((notif: any) => {
          toast.info(notif.title, {
            description: notif.body,
            action: notif.url
              ? {
                  label: "Open",
                  onClick: () => router.push(notif.url),
                }
              : undefined,
            duration: 9000,
          })

          // If not using Web Push yet but Notification permission is granted, trigger local SW notification
          if (!isSubscribed && Notification.permission === "granted" && swReg?.active) {
            swReg.active.postMessage({
              type: "SHOW_LOCAL_NOTIFICATION",
              payload: {
                title: notif.title,
                body: notif.body,
                url: notif.url,
                tag: notif.notificationKey,
              },
            })
          }
        })
      }
    } catch {
      // Non-blocking background check
    }
  }, [isSubscribed, router, swReg])

  useEffect(() => {
    checkRemindersAndLogs()
    const interval = setInterval(checkRemindersAndLogs, 60 * 1000)

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkRemindersAndLogs()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [checkRemindersAndLogs])

  // 4. Subscribe / Unsubscribe Device to Background Web Push
  const handleTogglePushSubscription = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error(
        "Push notifications require installing LLT-Management to your Home Screen first (especially on iOS 16.4+)."
      )
      setInstallGuideOpen(true)
      return
    }

    try {
      setSubscribing(true)

      let reg = swReg
      if (!reg && "serviceWorker" in navigator) {
        reg = await navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin" })
        setSwReg(reg)
      }

      if (!reg) {
        toast.error("Service Worker is not ready yet. Please refresh and try again.")
        return
      }

      if (isSubscribed) {
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await fetch("/api/admin/push/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          })
          await sub.unsubscribe()
        }
        setIsSubscribed(false)
        toast.success("Push notifications paused on this device.")
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast.error("Please allow Notification permission in your browser/phone settings.")
        return
      }

      const keyRes = await fetch("/api/admin/push/subscribe")
      const { publicKey } = await keyRes.json()

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
      })

      const saveRes = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          deviceLabel: isIOS ? "iPhone / iPad" : navigator.platform || "Admin Device",
          sendTest: true,
        }),
      })

      const saveData = await saveRes.json()
      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.error || "Failed to save push subscription")
      }

      setIsSubscribed(true)
      toast.success("LLT-Management Push Alerts enabled on this device!")
    } catch (err: any) {
      console.error("Push subscription error:", err)
      toast.error(
        err?.message ||
          "Could not enable push alerts. On iPhone, first Add to Home Screen, then open LLT-Management."
      )
    } finally {
      setSubscribing(false)
    }
  }

  // 5. Handle Native Install Prompt (Android Chrome / Desktop) or iOS Guide
  const handleInstallAppClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice?.outcome === "accepted") {
        setDeferredPrompt(null)
        toast.success("Installing LLT-Management...")
      }
    } else {
      setInstallGuideOpen(true)
    }
  }

  const handleMarkAllRead = async () => {
    setLogs((prev) => prev.map((item) => ({ ...item, is_read: true })))
    await fetch("/api/admin/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    }).catch(() => {})
  }

  const handleNotificationItemClick = async (item: NotificationLogItem) => {
    setPanelOpen(false)
    if (!item.is_read) {
      setLogs((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, is_read: true } : l))
      )
      fetch("/api/admin/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      }).catch(() => {})
    }
    router.push(item.url || "/admin/dashboard")
  }

  const unreadCount = logs.filter((l) => !l.is_read).length

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "new_booking":
        return <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
      case "unassigned_3h":
        return <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
      case "pob_check_20m":
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />
      case "reminder_24h":
      case "reminder_2h":
      case "reminder_30m":
        return <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
      case "driver_application":
        return <UserPlus className="w-4 h-4 text-purple-600 shrink-0" />
      case "contact_lead":
        return <MessageSquare className="w-4 h-4 text-sky-600 shrink-0" />
      default:
        return <Bell className="w-4 h-4 text-slate-600 shrink-0" />
    }
  }

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Install App Button (shown when not yet running as installed standalone app) */}
        {!isStandalone && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleInstallAppClick}
            className="h-9 md:h-8 px-2.5 text-[11px] font-bold border-slate-800 bg-slate-900 text-white hover:bg-slate-800 md:border-slate-200 md:bg-slate-50 md:hover:bg-lime-50 md:text-slate-800 md:hover:text-lime-900 md:hover:border-lime-300 rounded-xl cursor-pointer active:scale-95 transition"
            title="Install LLT-Management App"
          >
            <Smartphone className="w-4 h-4 md:w-3.5 md:h-3.5 sm:mr-1 text-lime-400 md:text-lime-600" />
            <span className="hidden sm:inline">Install App</span>
          </Button>
        )}

        {/* Notification Bell Button */}
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className={`relative h-9 md:h-8 px-3 md:px-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition cursor-pointer active:scale-95 ${
            isSubscribed
              ? "bg-slate-900 md:bg-slate-950 text-white border-slate-800 hover:bg-slate-800"
              : "bg-lime-400 text-slate-950 border-lime-400 md:bg-amber-50 md:text-amber-900 md:border-amber-300 hover:opacity-95"
          }`}
          title="Dispatch Notifications & Push Settings"
        >
          {isSubscribed ? (
            <BellRing className="w-4 h-4 md:w-3.5 md:h-3.5 text-lime-400" />
          ) : (
            <Bell className="w-4 h-4 md:w-3.5 md:h-3.5 text-slate-950 md:text-amber-600 animate-bounce" />
          )}
          <span className="text-[11px] md:text-xs font-extrabold">
            {isSubscribed ? "Alerts" : "Alerts"}
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications & Push Control Dialog */}
      <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-slate-200">
          <div className="bg-slate-950 text-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center">
                  <BellRing className="w-4.5 h-4.5 text-lime-400" />
                </div>
                <div>
                  <DialogTitle className="text-base font-black text-white">
                    LLT-Management Alerts
                  </DialogTitle>
                  <p className="text-[11px] text-slate-400">
                    Real-time bookings, driver reminders & POB checks
                  </p>
                </div>
              </div>
            </div>

            {/* Push Subscription Toggle Card */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSubscribed ? "bg-lime-400 animate-pulse" : "bg-amber-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-white">
                    {isSubscribed
                      ? "Background Push Active on This Device"
                      : "Background Push Disabled"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isSubscribed
                    ? "Receiving alerts for new bookings, 24h / 2h / 30m reminders, unassigned jobs (every 3h), and +20m POB status checks."
                    : "Turn on to receive native lock-screen alerts even when the app is closed."}
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                disabled={subscribing}
                onClick={handleTogglePushSubscription}
                className={`shrink-0 h-8 px-3 text-xs font-bold rounded-lg cursor-pointer ${
                  isSubscribed
                    ? "bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white"
                    : "bg-lime-400 hover:bg-lime-500 text-slate-950"
                }`}
              >
                {subscribing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : isSubscribed ? (
                  "Pause"
                ) : (
                  "Enable Push"
                )}
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">
              Recent Dispatch Alerts ({logs.length})
            </span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-lime-700 hover:underline cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification Feed */}
          <div className="max-h-[55vh] overflow-y-auto divide-y divide-slate-100 bg-white">
            {logs.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No alerts logged yet</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  New website bookings, leads, driver applications, and upcoming job reminders will appear here automatically.
                </p>
              </div>
            ) : (
              logs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNotificationItemClick(item)}
                  className={`w-full text-left p-3.5 hover:bg-slate-50 transition flex items-start gap-3 cursor-pointer ${
                    !item.is_read ? "bg-lime-50/40" : ""
                  }`}
                >
                  <div className="mt-0.5">{getCategoryIcon(item.category)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold text-slate-900 truncate">
                        {item.title}
                      </p>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                      {item.body}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                      {new Date(item.created_at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Install LLT-Management App Guide Dialog (iOS & Android) */}
      <Dialog open={installGuideOpen} onOpenChange={setInstallGuideOpen}>
        <DialogContent className="max-w-md rounded-2xl p-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-lime-600" />
              Install LLT-Management App
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs text-slate-600 mt-2">
            <div className="p-3.5 rounded-xl bg-slate-950 text-white space-y-2">
              <p className="font-bold text-lime-400 uppercase tracking-wider text-[11px]">
                On iPhone / iPad (Safari)
              </p>
              <ol className="space-y-1.5 list-decimal list-inside text-slate-200">
                <li>
                  Tap the <strong className="text-white">Share</strong> button{" "}
                  <Share className="w-3.5 h-3.5 inline text-lime-400 mx-0.5" /> at the bottom of Safari.
                </li>
                <li>
                  Scroll down and tap{" "}
                  <strong className="text-white">Add to Home Screen</strong>{" "}
                  <PlusSquare className="w-3.5 h-3.5 inline text-lime-400 mx-0.5" />.
                </li>
                <li>
                  Tap <strong className="text-white">Add</strong> in the top right corner.
                </li>
                <li>
                  Open <strong className="text-lime-400">LLT-Management</strong> from your Home Screen and tap{" "}
                  <strong className="text-white">Enable Alerts</strong>!
                </li>
              </ol>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                On Android (Chrome)
              </p>
              <ol className="space-y-1.5 list-decimal list-inside text-slate-700">
                <li>
                  Tap the <strong className="text-slate-900">⋮ Menu</strong> in the top-right corner of Chrome.
                </li>
                <li>
                  Tap <strong className="text-slate-900">Install app</strong> or{" "}
                  <strong className="text-slate-900">Add to Home screen</strong>.
                </li>
                <li>
                  Open <strong className="text-slate-900">LLT-Management</strong> and tap{" "}
                  <strong className="text-slate-900">Enable Alerts</strong>.
                </li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

