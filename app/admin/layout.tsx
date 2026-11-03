"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Sidebar from "@/components/admin/sidebar"
import { AuthProvider } from "@/context/auth-provider"
import { SidebarProvider, useSidebar } from "@/context/sidebar-context"
import { UKLiveClock } from "@/components/admin/uk-live-clock"
import { AdminPwaNotificationManager } from "@/components/admin/pwa-notification-manager"
import { MobileBottomNav } from "@/components/admin/mobile-bottom-nav"

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isCollapsed, toggleMobileOpen } = useSidebar()
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

  return (
    <div className="min-h-screen bg-slate-50 w-full flex">
      {/* Fixed Sidebar (Desktop) */}
      <Sidebar />

      {/* Main Content Area - padded to match sidebar width, min-w-0 prevents overflow */}
      <div
        className={`flex flex-col flex-1 min-w-0 w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:pl-20" : "md:pl-52"
        }`}
      >
        {/* Top Navbar: Clean header with iOS safe-area top padding */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 w-full pt-[env(safe-area-inset-top)]">
          <div className="px-3 sm:px-6 w-full">
            <div className="flex justify-between h-14 items-center w-full gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Mobile Drawer Trigger (Mobile Only) */}
                <button
                  onClick={toggleMobileOpen}
                  className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 md:hidden shrink-0"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5 text-lime-600" />
                </button>

                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider truncate">
                    LLT-Management
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline truncate">
                    Dispatch Operations Console
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <AdminPwaNotificationManager />
                <div className="hidden xs:block sm:block">
                  <UKLiveClock />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Content (pb-24 on mobile for bottom nav bar clearance, md:pb-5 on desktop) */}
        <main className="flex-1 p-3 sm:p-5 pb-24 md:pb-5 w-full min-w-0">
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
