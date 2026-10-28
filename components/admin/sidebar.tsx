"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  X,
  LayoutDashboard,
  Truck,
  Calendar,
  Loader2,
  LogOut,
  PlusCircleIcon,
  MessageCircle,
  Building2,
  UserCheck,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useState } from "react"
import { LogOut as LogoutAction } from "@/lib/logout"
import { useSidebar } from "@/context/sidebar-context"

const navigationLinks = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/admin/dashboard",
  },
  {
    path: "/admin/fleets",
    label: "Fleets",
    icon: Truck,
    isActive: (pathname: string) => pathname.includes("/admin/fleets"),
  },
  {
    path: "/admin/bookings",
    label: "Bookings",
    icon: Calendar,
    isActive: (pathname: string) =>
      pathname.includes("/admin/bookings") && !pathname.includes("/admin/previous-bookings"),
  },
  {
    path: "/admin/addons",
    label: "Addons",
    icon: PlusCircleIcon,
    isActive: (pathname: string) => pathname.includes("/admin/addons"),
  },
  {
    path: "/admin/suppliers",
    label: "Suppliers",
    icon: Building2,
    isActive: (pathname: string) => pathname.includes("/admin/suppliers"),
  },
  {
    path: "/admin/drivers",
    label: "Drivers",
    icon: UserCheck,
    isActive: (pathname: string) => pathname.includes("/admin/drivers"),
  },
  {
    path: "/admin/accounts",
    label: "Accounts and Reports",
    icon: BarChart3,
    isActive: (pathname: string) => pathname.includes("/admin/accounts"),
  },
  {
    path: "/admin/messages",
    label: "Messages",
    icon: MessageCircle,
    isActive: (pathname: string) => pathname.includes("/admin/messages"),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const { isCollapsed, toggleCollapse, isMobileOpen, setIsMobileOpen } = useSidebar()

  async function logOutUser() {
    try {
      setLoading(true)
      const { error } = await LogoutAction()
      if (error) throw error
      router.replace("/")
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  // Desktop sidebar content
  const renderNavItems = (collapsed: boolean, onItemClick?: () => void) => (
    <nav className="flex-1 mt-3 px-2 space-y-1">
      {navigationLinks.map((link) => {
        const isActive = link.isActive(pathname)
        const IconComponent = link.icon

        return (
          <Link
            key={link.path}
            href={link.path}
            onClick={onItemClick}
            title={link.label}
            className={`group flex items-center ${
              collapsed ? "justify-center px-2 py-3" : "px-2.5 py-2"
            } text-xs font-semibold rounded-xl transition-all duration-150 ${
              isActive
                ? "bg-lime-400 text-slate-950 shadow-sm font-bold"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            }`}
          >
            <IconComponent
              className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                collapsed ? "" : "mr-2.5"
              } ${isActive ? "text-slate-950" : "text-slate-500 group-hover:text-slate-900"}`}
            />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar (Collapsible) */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-sm ${
          isCollapsed ? "w-20" : "w-52"
        }`}
      >
        {/* Sidebar Brand Header - DARK BACKGROUND */}
        <div className="flex items-center justify-between h-16 px-3 bg-slate-950 border-b border-slate-800">
          {!isCollapsed ? (
            <>
              <Link href="/admin/dashboard" className="flex items-center flex-1 mr-1">
                <Image
                  src="/logo-main.png"
                  alt="Luxelyne Transfers"
                  width={160}
                  height={48}
                  className="h-10.5 w-auto max-w-[142px] object-contain brightness-110 drop-shadow-sm"
                  priority
                />
              </Link>
              {/* Collapse Button inside the dark header */}
              <button
                type="button"
                onClick={toggleCollapse}
                className="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors shrink-0"
                title="Minimize sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center">
              <Link href="/admin/dashboard">
                <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm hover:scale-105 transition-transform">
                  LT
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        {renderNavItems(isCollapsed)}

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-2 bg-slate-50/70">
          {/* Re-expand button when collapsed */}
          {isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="w-full h-9 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 rounded-xl transition-colors"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-lime-600" />
            </button>
          )}

          <Button
            disabled={loading}
            variant="ghost"
            className={`w-full ${
              isCollapsed ? "justify-center px-0" : "justify-start"
            } text-red-600 hover:bg-red-50 hover:text-red-700 h-9 rounded-xl font-medium text-xs`}
            onClick={logOutUser}
            title="Logout"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <>
                <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`} />
                {!isCollapsed && <span>Logout</span>}
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-white">
          <div className="flex flex-col h-full">
            {/* Mobile Header with dark background */}
            <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800">
              <Image
                src="/logo-main.png"
                alt="Luxelyne Transfers"
                width={130}
                height={38}
                className="h-9 w-auto object-contain brightness-105"
              />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderNavItems(false, () => setIsMobileOpen(false))}
            <div className="p-4 border-t border-slate-100">
              <Button
                disabled={loading}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 text-xs font-semibold"
                onClick={logOutUser}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
