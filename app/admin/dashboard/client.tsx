"use client"

import { useState } from "react"
import { Truck, Calendar, MessageCircle, TrendingUp, DollarSign, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/types/booking"
import { useVehicles } from "@/context/vehicle-context"
import Loader from "@/components/loader"

export const dynamic = "force-dynamic"
interface Props {
    bookings: Booking[]
}
export default function DashboardPage({ bookings }: Props) {
    const { vehicles, loading } = useVehicles()
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => {
        return acc + (booking.total_amount || 0);
    }, 0);
    const totalFleet=vehicles.length;
    const stats = [
        {
            title: "Total Fleet",
            value: `${totalFleet}`,          
            trend: "up",
            icon: Truck,
            color: "text-lime-600",
            bgColor: "bg-lime-500",
        },
        {
            title: "Completed Bookings",
            value: `${totalBookings}`,
            trend: "up",
            icon: Calendar,
            color: "text-lime-700",
            bgColor: "bg-lime-600",
        },
        {
            title: "Revenue",
            value: `£${totalRevenue}`,
            change: "+23%",
            trend: "up",
            icon: DollarSign,
            color: "text-lime-800",
            bgColor: "bg-lime-700",
        },
    ]

    const recentActivities = [
        { id: 1, type: "booking", message: "New booking from John Doe", time: "2 min ago", status: "new" },
        {
            id: 2,
            type: "maintenance",
            message: "Vehicle TRK-001 maintenance completed",
            time: "15 min ago",
            status: "completed",
        },
        { id: 3, type: "enquiry", message: "Customer inquiry about pricing", time: "1 hour ago", status: "pending" },
        { id: 4, type: "fleet", message: "New vehicle TRK-125 added to fleet", time: "2 hours ago", status: "completed" },
        { id: 5, type: "booking", message: "Booking cancelled by Sarah Smith", time: "3 hours ago", status: "cancelled" },
    ]

    const quickActions = [
        { title: "Add New Vehicle", icon: Truck, href: "/admin/fleets/", color: "bg-lime-600" },
        { title: "Create Booking", icon: Calendar, href: "/admin/bookings/", color: "bg-black" },
    ]
    if(loading){
        return(<Loader text="Loading..."/>)
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 space-y-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl lg:text-4xl font-bold text-black text-balance mb-2">Welcome back, Admin</h1>
                            <p className="text-black/60 text-lg">Here's what's happening with your fleet today</p>
                        </div>
                        <div className="flex gap-3">
                            <Button className="bg-lime-600 hover:bg-lime-700 text-white font-bold px-6" onClick={()=>window.location.href="/admin/bookings"}>
                                <Calendar className="mr-2 h-4 w-4" />
                                New Booking
                            </Button>
                            <Button className="bg-black hover:bg-black/80 text-white font-bold px-6"  onClick={()=>window.location.href="/admin/fleets/add-new"}>
                                <Truck className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="relative overflow-hidden border border-black/10   transition-all duration-300"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                    <CardTitle className="text-sm font-bold text-black/60 uppercase tracking-wider">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-black mb-2">{stat.value}</div>
                                    
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="group  transition-all duration-300 cursor-pointer border-l-4 border-l-lime-600 bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-black">Fleet Management</CardTitle>
                                    <div className="p-2 bg-lime-600 rounded-lg">
                                        <Truck className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-black/60 mb-6 leading-relaxed">
                                    Manage your vehicles, drivers, and maintenance schedules
                                </p>
                                <Button
                                onClick={()=>window.location.href="/admin/fleets"}
                                    variant="outline"
                                    className="w-full group-hover:bg-lime-600 group-hover:text-white group-hover:border-lime-600 transition-all duration-300 font-bold border-black/20 bg-transparent"
                                >
                                    View Fleet
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="group  transition-all duration-300 cursor-pointer border-l-4 border-l-black bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-black">Bookings</CardTitle>
                                    <div className="p-2 bg-black rounded-lg">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-black/60 mb-6 leading-relaxed">
                                    Track current and upcoming bookings with detailed schedules
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={()=>window.location.href="/admin/bookings"}
                                    className="w-full group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 font-bold border-black/20 bg-transparent"
                                >
                                    View Bookings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}
