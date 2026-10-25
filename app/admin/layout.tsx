"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Sidebar from "@/components/admin/sidebar"
import { AuthProvider } from "@/context/auth-provider"
import { SidebarProvider, useSidebar } from "@/context/sidebar-context"
import { UKLiveClock } from "@/components/admin/uk-live-clock"

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isCollapsed, toggleMobileOpen } = useSidebar()
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - padded to match sidebar width, min-w-0 prevents overflow */}
      <div
        className={`flex flex-col flex-1 min-w-0 w-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:pl-20" : "md:pl-52"
        }`}
      >
        {/* Top Navbar: Clean header without desktop collapse button */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 w-full">
          <div className="px-4 sm:px-6 w-full">
            <div className="flex justify-between h-14 items-center w-full">
              <div className="flex items-center gap-3">
                {/* Mobile Drawer Trigger (Mobile Only) */}
                <button
                  onClick={toggleMobileOpen}
                  className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5 text-lime-600" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Luxelyne Transfers
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Dispatch Operations Console
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UKLiveClock />
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Content */}
        <main className="flex-1 p-3 sm:p-5 w-full min-w-0">
          {children}
        </main>
      </div>
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
