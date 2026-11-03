"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Sidebar from "@/components/admin/sidebar"
import { AuthProvider } from "@/context/auth-provider"
import { SidebarProvider, useSidebar } from "@/context/sidebar-context"
import { UKLiveClock } from "@/components/admin/uk-live-clock"
import { AdminPwaNotificationManager } from "@/components/admin/pwa-notification-manager"
import { MobileBottomNav } from "@/components/admin/mobile-bottom-nav"

function getMobileScreenMeta(pathname: string): {
  title: string
  subtitle: string
  backHref?: string
} {
  if (/^\/admin\/bookings\/[^/]+$/.test(pathname)) {
    return {
      title: "Journey Dispatch",
      subtitle: "LLT-Management • Job Details",
      backHref: "/admin/bookings",
    }
  }
  if (/^\/admin\/calendar\/[^/]+$/.test(pathname)) {
    return {
      title: "Daily Schedule",
      subtitle: "LLT-Management • Date View",
      backHref: "/admin/calendar",
    }
  }
  if (pathname.includes("/admin/bookings")) {
    return { title: "Bookings", subtitle: "Live Dispatch Queue" }
  }
  if (pathname.includes("/admin/driver-hiring")) {
    return { title: "Driver Hiring", subtitle: "Recruitment Applications" }
  }
  if (pathname.includes("/admin/drivers")) {
    return { title: "Drivers", subtitle: "Fleet Roster & Payouts" }
  }
  if (pathname.includes("/admin/calendar")) {
    return { title: "Calendar", subtitle: "Monthly Fleet Schedule" }
  }
  if (pathname.includes("/admin/accounts")) {
    return { title: "Accounts", subtitle: "Revenue & Profit Reports" }
  }
  if (pathname.includes("/admin/suppliers")) {
    return { title: "Suppliers", subtitle: "Partner Accounts" }
  }
  if (pathname.includes("/admin/fleets")) {
    return { title: "Fleets", subtitle: "Vehicle Categories" }
  }
  if (pathname.includes("/admin/addons")) {
    return { title: "Addons", subtitle: "Booking Extras" }
  }
  if (pathname.includes("/admin/messages")) {
    return { title: "Messages", subtitle: "Customer Leads" }
  }
  return { title: "LLT-Management", subtitle: "Live Dispatch Console" }
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isCollapsed } = useSidebar()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return (
      <>
        <div className="hidden">
          <AdminPwaNotificationManager />
        </div>
        {children}
      </>
    )
  }

  const screenMeta = getMobileScreenMeta(pathname)

  return (
    <div className="min-h-screen bg-slate-100 md:bg-slate-50 w-full flex selection:bg-lime-400 selection:text-slate-950">
      {/* Global iOS / Android Native App Polish Rules for Admin */}
      <style jsx global>{`
        @media (max-width: 767px) {
          html,
          body {
            -webkit-tap-highlight-color: transparent;
            overscroll-behavior-y: none;
            -webkit-touch-callout: none;
          }
          /* Prevent iOS Safari from auto-zooming when tapping inputs/selects */
          input,
          select,
          textarea {
            font-size: 16px !important;
          }
        }
      `}</style>

      {/* Fixed Sidebar (Desktop Only — md and up) */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 min-w-0 w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:pl-20" : "md:pl-52"
        }`}
      >
        {/* Top App Bar: Native Obsidian Bar on Mobile, Clean White Bar on Desktop */}
        <header className="bg-slate-950 text-white md:bg-white md:text-slate-900 border-b border-slate-800 md:border-slate-200 sticky top-0 z-30 w-full pt-[env(safe-area-inset-top)] shadow-xs">
          <div className="px-3.5 sm:px-6 w-full">
            <div className="flex justify-between h-14 items-center w-full gap-2">
              {/* Mobile Left: Native Back Button OR App Badge + Active Screen Title */}
              <div className="flex items-center gap-2.5 min-w-0 md:hidden">
                {screenMeta.backHref ? (
                  <button
                    type="button"
                    onClick={() => router.push(screenMeta.backHref!)}
                    className="inline-flex items-center gap-1 pr-2.5 pl-1.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-lime-400 active:scale-95 transition text-xs font-extrabold shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                    LLT
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black tracking-tight text-white truncate">
                      {screenMeta.title}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shrink-0" />
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 truncate leading-tight">
                    {screenMeta.subtitle}
                  </p>
                </div>
              </div>

              {/* Desktop Left: Standard Console Title */}
              <div className="hidden md:flex items-center gap-2 min-w-0">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider truncate">
                  LLT-Management
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium truncate">
                  Dispatch Operations Console
                </span>
              </div>

              {/* Right Controls: Push Alerts & UK Live Clock */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <AdminPwaNotificationManager />
                <div className="hidden sm:block">
                  <UKLiveClock />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Content (padded for floating iOS bottom tab bar on mobile) */}
        <main className="flex-1 p-3 sm:p-5 pb-28 md:pb-6 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Native Mobile Bottom Navigation Bar (Home, Bookings, Drivers, Menu) */}
      <MobileBottomNav />
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </SidebarProvider>
    </AuthProvider>
  )
}
