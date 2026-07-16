"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { X, LayoutDashboard, Truck, Calendar,Loader2, LogOut, PlusCircleIcon, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import path from "path"
import { createClient } from "@/util/supabase/client"
import { useState } from "react"
import { LogOut as LogoutAction } from "@/lib/logout"
// Define navigation links array
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
    isActive: (pathname: string) =>
      pathname.includes("/admin/addons"),
  },
  {
    path:"/admin/messages",
    label:"Messages",
    icon:MessageCircle,
    isActive:(pathname:string)=> pathname.includes("/admin/messages")
  }
]

interface SidebarProps {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [loading,setLoading]=useState<boolean>(false);
  const router=useRouter()

  // <CHANGE> Simplified logout function without external dependencies
 async function logOutUser() {
   try {
         setLoading(true)
        const {error}=await LogoutAction()

        if(error){
             throw error;
        }
        router.replace("/")
        
   } catch (error) {
    
   }
   finally{
      setLoading(false)
   }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-lime-700 bg-gradient-to-r from-lime-700 via-lime-800 to-lime-900">
        <div className="flex items-center">
          <Image src="/logo-main.png" alt="Minna Transfers" width={140} height={40} className="h-52 w-auto" />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 mt-5 px-2">
        {navigationLinks.map((link) => {
          const isActive = link.isActive(pathname)
          const IconComponent = link.icon

          return (
            <Link
              key={link.path}
              href={link.path}
              onClick={onClose}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive ? "bg-lime-300 text-lime-700" : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              <IconComponent className={`mr-3 h-5 w-5 ${isActive ? "text-lime-700" : "text-gray-500"}`} />
              {link.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
        <Button disabled={loading}  variant="ghost" className="w-full justify-start text-red-500" onClick={logOutUser}>
         {
           loading? <><Loader2 className="mr-2 animate-spin"/> Logging out...</>:
           <>
            <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
           </>
         }
        </Button>
      </div>
    </div>
  )
}

export default function Sidebar({ sidebarOpen, toggleSidebar }: SidebarProps) {
  return (
    <>
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
        <div className="flex flex-col flex-grow shadow border-r">
          <SidebarContent />
        </div>
      </div>

      <Sheet open={sidebarOpen} onOpenChange={toggleSidebar}>
        <SheetContent side="left" className="w-64 p-0 md:hidden">
          <SidebarContent onClose={toggleSidebar} />
        </SheetContent>
      </Sheet>
    </>
  )
}
