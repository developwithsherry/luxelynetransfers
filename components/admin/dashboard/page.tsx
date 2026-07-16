"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, Truck } from "lucide-react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4">
                <Image src="/minnalogo.avif" alt="Minna Transfers" width={140} height={40} className="h-8 w-auto" />
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <Image src="/minnalogo.avif" alt="Minna Transfers" width={140} height={40} className="h-8 w-auto" />
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          <Link
            href="/admin"
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              pathname === "/admin" ? "bg-blue-50 text-blue-600" : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className={`mr-3 h-5 w-5 ${pathname === "/admin/dashboard" ? "text-blue-600" : "text-gray-500"}`} />
            Dashboard
          </Link>
          <Link
            href="/admin/fleets"
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              pathname === "/admin/fleets" ? "bg-blue-50 text-blue-600" : "text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Truck className={`mr-3 h-5 w-5 ${pathname === "/admin/fleets" ? "text-blue-600" : "text-gray-500"}`} />
            Fleets
          </Link>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 transition-opacity" onClick={toggleSidebar}></div>
      )}

      {/* Main Content - Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h1>
          <p className="text-gray-600">Manage your transfers and fleet</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Fleets Card */}
          <Link href="/admin/fleets" className="block">
            <div className="aspect-square border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-gray-100">
                    <Truck className="h-8 w-8 text-gray-700" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center mb-2">Fleets</h2>
                <p className="text-sm text-gray-600 text-center flex-1">Manage your vehicles and drivers</p>
              </div>
              <div className="bg-gray-50 px-6 py-3 text-right">
                <span className="text-sm font-medium text-gray-500">View details</span>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
