"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  UserCheck,
  Menu,
  Truck,
  PlusCircleIcon,
  Building2,
  UserPlus,
  BarChart3,
  MessageCircle,
  LogOut,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react"
import { LogOut as LogoutAction } from "@/lib/logout"

const PRIMARY_TABS = [
  {
    label: "Home",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/admin/dashboard",
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: Calendar,
    isActive: (pathname: string) =>
      pathname.includes("/admin/bookings") && !pathname.includes("/admin/previous-bookings"),
  },
  {
    label: "Drivers",
    path: "/admin/drivers",
    icon: UserCheck,
    isActive: (pathname: string) =>
      pathname.includes("/admin/drivers") && !pathname.includes("/admin/driver-hiring"),
  },
]

const MENU_DRAWER_LINKS = [
  {
    label: "Calendar",
    description: "Visual monthly schedule & daily dispatch",
    path: "/admin/calendar",
    icon: CalendarDays,
    isActive: (pathname: string) => pathname.includes("/admin/calendar"),
  },
  {
    label: "Fleets",
    description: "Manage vehicle classes & capacities",
    path: "/admin/fleets",
    icon: Truck,
    isActive: (pathname: string) => pathname.includes("/admin/fleets"),
  },
  {
    label: "Addons",
    description: "Child seats & booking extras",
    path: "/admin/addons",
    icon: PlusCircleIcon,
    isActive: (pathname: string) => pathname.includes("/admin/addons"),
  },
  {
    label: "Suppliers",
    description: "Partner sources & supplier accounts",
    path: "/admin/suppliers",
    icon: Building2,
    isActive: (pathname: string) => pathname.includes("/admin/suppliers"),
  },
  {
    label: "Driver Hiring",
    description: "Review driver recruitment applications",
    path: "/admin/driver-hiring",
    icon: UserPlus,
    isActive: (pathname: string) => pathname.includes("/admin/driver-hiring"),
  },
  {
    label: "Accounts & Reports",
    description: "Revenue, payouts & profit analytics",
    path: "/admin/accounts",
    icon: BarChart3,
    isActive: (pathname: string) => pathname.includes("/admin/accounts"),
  },
  {
    label: "Messages",
    description: "Customer contact form inquiries",
    path: "/admin/messages",
    icon: MessageCircle,
    isActive: (pathname: string) => pathname.includes("/admin/messages"),
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isMenuRouteActive = MENU_DRAWER_LINKS.some((item) => item.isActive(pathname))

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      const { error } = await LogoutAction()
      if (error) throw error
      setMenuOpen(false)
      router.replace("/")
    } catch {
      // ignore
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <>
      {/* Native Mobile Bottom Tab Bar (iOS & Android, hidden on desktop md+) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 pb-[env(safe-area-inset-bottom)] select-none"
      >
        <div className="grid grid-cols-4 h-16 px-2">
          {PRIMARY_TABS.map((tab) => {
            const active = tab.isActive(pathname) && !menuOpen
            const Icon = tab.icon
            return (
              <Link
                key={tab.path}
                href={tab.path}
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 relative active:scale-95 transition-transform"
              >
                {active && (
                  <span className="absolute top-0 w-8 h-1 rounded-b-full bg-lime-400" />
                )}
                <div
                  className={`flex items-center justify-center w-10 h-7 rounded-xl transition-colors ${
                    active
                      ? "bg-lime-400 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span
                  className={`text-[10px] font-bold tracking-tight ${
                    active ? "text-lime-400" : "text-slate-400"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}

          {/* 4th Tab: Menu (All other tabs) */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col items-center justify-center gap-1 relative active:scale-95 transition-transform cursor-pointer"
          >
            {(menuOpen || isMenuRouteActive) && (
              <span className="absolute top-0 w-8 h-1 rounded-b-full bg-lime-400" />
            )}
            <div
              className={`flex items-center justify-center w-10 h-7 rounded-xl transition-colors ${
                menuOpen || isMenuRouteActive
                  ? "bg-lime-400 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {menuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </div>
            <span
              className={`text-[10px] font-bold tracking-tight ${
                menuOpen || isMenuRouteActive ? "text-lime-400" : "text-slate-400"
              }`}
            >
              Menu
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Mobile Menu Sheet */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs flex flex-col justify-end pb-16"
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl max-h-[82vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
          >
            {/* Drag Handle & Sheet Header */}
            <div className="pt-3 pb-3 px-5 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center">
                  LLT
                </div>
                <div>
                  <p className="text-sm font-black tracking-tight text-white">
                    LLT-Management
                  </p>
                  <p className="text-[11px] text-slate-400">
                    All Console Modules & Settings
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Items Grid / List */}
            <div className="p-4 overflow-y-auto space-y-2 divide-y divide-slate-100">
              <div className="space-y-1.5 pb-2">
                {MENU_DRAWER_LINKS.map((item) => {
                  const active = item.isActive(pathname)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition active:scale-[0.99] ${
                        active
                          ? "bg-lime-400 text-slate-950 border-lime-500 font-bold shadow-xs"
                          : "bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            active
                              ? "bg-slate-950 text-lime-400"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold truncate">{item.label}</p>
                          <p
                            className={`text-[11px] truncate ${
                              active ? "text-slate-800 font-medium" : "text-slate-500"
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${
                          active ? "text-slate-950" : "text-slate-400"
                        }`}
                      />
                    </Link>
                  )
                })}
              </div>

              {/* Logout Button */}
              <div className="pt-3">
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-extrabold transition cursor-pointer"
                >
                  {loggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out of LLT-Management</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

