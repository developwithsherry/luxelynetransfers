"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Sidebar from "@/components/admin/sidebar"
import { AuthProvider } from "@/context/auth-provider"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const isLoginPage = pathname === "/admin/login"

  const breadcrumbs = useMemo(() => {
    if (isLoginPage) return []
    const segments = pathname.split("/").filter(Boolean)
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)
      if (segment === "admin" && index === 0) label = "Admin"
      return { path, label }
    })
  }, [pathname, isLoginPage])

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background w-full">
        {/* Sidebar (hidden on login page) */}
        {!isLoginPage && <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}

        {/* Content Area - Added md:ml-64 to prevent sidebar overlap */}
        <div className={`flex flex-col flex-1 w-full ${!isLoginPage ? "md:ml-64" : ""}`}>
          {/* Top Navigation Bar (hidden on login page) */}
          {!isLoginPage && (
            <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
              <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between h-16 items-center w-full ">
                  <div className="flex items-center">
                    <button
                      onClick={toggleSidebar}
                      className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
                      aria-label="Open sidebar"
                    >
                      <Menu className="h-6 w-6 text-lime-400" />
                    </button>

                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className="flex-1 p-0 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
