"use client"

import { useMemo } from "react"
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PoundSterling,
  ArrowRight,
  Users,
  Building2,
  Globe,
  Truck,
  TrendingUp,
  UserPlus,
  UserCheck,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Booking } from "@/types/booking"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Props {
  bookings: Booking[]
}

export default function DashboardPage({ bookings }: Props) {
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])

  // Comprehensive dispatch analytics
  const metrics = useMemo(() => {
    let upcoming = 0
    let past = 0
    let notAssigned = 0
    let assigned = 0
    let totalRevenue = 0
    let driverPayoutLiability = 0
    let websiteBookings = 0
    let supplierBookings = 0

    bookings.forEach((b) => {
      const isCancelled = (b.status || "").toLowerCase() === "cancelled"
      const dateStr = b.date || ""

      if (!isCancelled) {
        const amt = Number(b.final_amount ?? b.total_amount ?? 0)
        totalRevenue += isNaN(amt) ? 0 : amt

        if (b.driver_id) {
          assigned++
          driverPayoutLiability += Number(b.driver_price || 0)
        } else {
          notAssigned++
        }

        if (dateStr >= todayStr) {
          upcoming++
        } else {
          past++
        }

        if (b.supplier_id || (b.source || "").toLowerCase() === "offline") {
          supplierBookings++
        } else {
          websiteBookings++
        }
      } else {
        if (dateStr < todayStr) {
          past++
        }
      }
    })

    const avgFare = bookings.length > 0 ? totalRevenue / Math.max(bookings.length, 1) : 0
    const coverageRate =
      bookings.length > 0 ? Math.round((assigned / Math.max(bookings.length, 1)) * 100) : 0

    return {
      totalBookings: bookings.length,
      upcomingCount: upcoming,
      pastCount: past,
      notAssignedCount: notAssigned,
      assignedCount: assigned,
      totalRevenue,
      driverPayoutLiability,
      avgFare,
      coverageRate,
      websiteBookings,
      supplierBookings,
    }
  }, [bookings, todayStr])

  // Top 5 recent bookings for live feed
  const recentBookings = useMemo(() => {
    return bookings.slice(0, 5)
  }, [bookings])

  const getJobStatusBadge = (status?: string | null) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "bg-lime-500 text-slate-950 font-bold"
      case "covered":
        return "bg-blue-600 text-white font-semibold"
      case "pob":
        return "bg-amber-500 text-white font-semibold"
      case "completed":
        return "bg-emerald-600 text-white font-semibold"
      case "complaint":
        return "bg-rose-600 text-white font-semibold"
      case "cancelled":
        return "bg-gray-800 text-white font-semibold"
      default:
        return "bg-lime-400 text-slate-950 font-bold"
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Executive Welcome & Live Operations Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded bg-lime-100 text-lime-900 border border-lime-300">
              Enterprise Dispatch Suite
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-500">Luxelyne Transfers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Dispatch Operations Command
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Real-time passenger journey scheduling, driver allocations, and financial health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/bookings">
            <Button className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold px-4 h-9 shadow-sm transition">
              <Calendar className="mr-1.5 h-4 w-4" />
              Live Bookings ({metrics.totalBookings})
            </Button>
          </Link>
          <Link href="/admin/drivers">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 h-9 shadow-sm transition">
              <Users className="mr-1.5 h-4 w-4 text-lime-400" />
              Manage Drivers
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid: High-Impact Distinct Styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* 1. Hero Revenue Card (Dark Obsidian Luxury Style) - 4 cols */}
        <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-lime-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-lime-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                Gross Customer Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-400 flex items-center justify-center border border-lime-400/30">
                <PoundSterling className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
              £{metrics.totalRevenue.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              All-time completed & scheduled fares
            </p>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Avg Fare / Job</span>
              <span className="font-bold text-white text-sm">£{metrics.avgFare.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-medium">Driver Liability</span>
              <span className="font-bold text-emerald-400 text-sm">
                £{metrics.driverPayoutLiability.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Critical Alert Card: Needs Driver Allocation - 4 cols */}
        <div className="lg:col-span-4 bg-gradient-to-br from-rose-50 to-orange-50/60 border-2 border-rose-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                Action Required
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] font-black uppercase tracking-wider">
                Unassigned
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">
                {metrics.notAssignedCount}
              </div>
              <span className="text-xs font-bold text-rose-800">Jobs Need Drivers</span>
            </div>
            <p className="text-xs text-rose-700/80 mt-1 font-medium">
              {metrics.notAssignedCount > 0
                ? "Pending dispatch: assign drivers to maintain schedule."
                : "All active journeys currently have drivers assigned."}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-between">
            <div className="text-[11px] text-slate-600 font-medium">
              Coverage: <strong className="text-slate-900">{metrics.coverageRate}%</strong>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
            >
              Allocate Drivers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. Operational Schedule Cards (Upcoming, Past, Total Volume) - 4 cols */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
          {/* Upcoming */}
          <Link
            href="/admin/bookings"
            className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Upcoming Queue
                </span>
                <span className="text-xl font-black text-blue-950">
                  {metrics.upcomingCount} <span className="text-xs font-semibold text-blue-700">scheduled</span>
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Past */}
          <Link
            href="/admin/bookings"
            className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-300 transition flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                  Past / Fulfilled
                </span>
                <span className="text-xl font-black text-purple-950">
                  {metrics.pastCount} <span className="text-xs font-semibold text-purple-700">journeys</span>
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition" />
          </Link>

          {/* Total Bookings */}
          <Link
            href="/admin/bookings"
            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center justify-between group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Total Bookings
                </span>
                <span className="text-xl font-black text-slate-950">
                  {metrics.totalBookings} <span className="text-xs font-semibold text-slate-500">all-time</span>
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* Live Recent Dispatches Snapshot & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Dispatches Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-950">
                Recent Dispatches
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-100 text-lime-900 font-bold">
                Live Feed
              </span>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-lime-700 hover:text-lime-900 inline-flex items-center gap-1 transition"
            >
              View All 30 Bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold text-left">
                    <th className="pb-2">Booking ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Route</th>
                    <th className="pb-2">Date & Time</th>
                    <th className="pb-2">Driver</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-right">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map((b) => {
                    const customerName = `${b.first_name || ""} ${b.last_name || ""}`.trim() || "Customer"
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 font-mono font-bold text-lime-700">
                          <Link href={`/admin/bookings/${b.id}`}>
                            #{b.id?.substring(0, 5).toUpperCase()}
                          </Link>
                        </td>
                        <td className="py-2.5 font-medium text-slate-900">
                          {customerName}
                        </td>
                        <td className="py-2.5 text-slate-600 max-w-[180px] truncate" title={b.pickup_location || ""}>
                          {formatLocation(b.pickup_location)}
                        </td>
                        <td className="py-2.5 text-slate-500 whitespace-nowrap">
                          {b.date ? formatDateUK(b.date) : "N/A"} {b.time || ""}
                        </td>
                        <td className="py-2.5 whitespace-nowrap">
                          {b.driver ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 text-[11px]">
                              <UserCheck className="w-3 h-3 text-emerald-600" />
                              {b.driver.name}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 text-[10px] font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              ⚠️ Needs Driver
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getJobStatusBadge(
                              b.status
                            )}`}
                          >
                            {b.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-extrabold text-slate-900 whitespace-nowrap">
                          £{Number(b.final_amount ?? b.total_amount ?? 0).toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent bookings found.
            </div>
          )}
        </div>

        {/* Right: Channel Breakdown & Operational Pulse (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Booking Sources Ratio */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Booking Source Channels
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Website Online
                  </span>
                  <span className="font-bold text-slate-900">
                    {metrics.websiteBookings} ({metrics.totalBookings > 0 ? Math.round((metrics.websiteBookings / metrics.totalBookings) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        metrics.totalBookings > 0
                          ? Math.round((metrics.websiteBookings / metrics.totalBookings) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    Suppliers & Offline
                  </span>
                  <span className="font-bold text-slate-900">
                    {metrics.supplierBookings} ({metrics.totalBookings > 0 ? Math.round((metrics.supplierBookings / metrics.totalBookings) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        metrics.totalBookings > 0
                          ? Math.round((metrics.supplierBookings / metrics.totalBookings) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Driver Allocation:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {metrics.coverageRate}% Covered
              </span>
            </div>
          </div>

          {/* Quick Roster Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                Driver Payouts
              </span>
              <Users className="w-4 h-4 text-lime-400" />
            </div>
            <p className="text-xs text-slate-300">
              Audit driver documents, check pending vs paid earnings, and initiate WhatsApp messages.
            </p>
            <Link href="/admin/drivers" className="block pt-1">
              <Button className="w-full bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold h-8 justify-between">
                <span>Open Driver Roster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Management Hubs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <Card className="group transition-all duration-200 border border-slate-200 bg-white hover:border-lime-500 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-950">
                Bookings & Dispatch Suite
              </CardTitle>
              <div className="p-2 bg-lime-100 rounded-xl text-lime-800">
                <Calendar className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Track live journeys, allocate drivers, check payment states, and customize visible column views.
            </p>
            <Link href="/admin/bookings" className="block">
              <Button
                variant="outline"
                className="w-full text-xs font-bold border-slate-300 hover:bg-lime-50 hover:text-lime-950 hover:border-lime-400 justify-between h-8"
              >
                <span>Dispatch Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-200 border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-950">
                Driver Fleet & Payouts
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-xl text-blue-800">
                <Users className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Review driver licenses, track paid vs unpaid jobs, send WhatsApp messages, and audit profiles.
            </p>
            <Link href="/admin/drivers" className="block">
              <Button
                variant="outline"
                className="w-full text-xs font-bold border-slate-300 hover:bg-blue-50 hover:text-blue-950 hover:border-blue-400 justify-between h-8"
              >
                <span>Manage Drivers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group transition-all duration-200 border border-slate-200 bg-white hover:border-slate-900 hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-950">
                Fleet Vehicles
              </CardTitle>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-800">
                <Truck className="h-4.5 w-4.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure vehicle classes, passenger capacities, luggage allowances, and pricing tier configurations.
            </p>
            <Link href="/admin/fleets" className="block">
              <Button
                variant="outline"
                className="w-full text-xs font-bold border-slate-300 hover:bg-slate-100 hover:text-slate-950 justify-between h-8"
              >
                <span>Vehicle Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
