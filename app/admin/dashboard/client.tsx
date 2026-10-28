"use client"

import { useMemo, useState } from "react"
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
  CalendarCheck,
  MessageSquare,
  ShieldAlert,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Booking } from "@/types/booking"
import type { DriverDocumentAlert } from "@/types/driver"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"
import { QuickStatusPopover } from "@/components/admin/booking/quick-status-popover"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface Props {
  bookings: Booking[]
  driverAlerts?: DriverDocumentAlert[]
}

export default function DashboardPage({ bookings, driverAlerts = [] }: Props) {
  const todayStr = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }, [])

  // Expired and expiring driver document compliance alerts
  const expiredDriverAlerts = useMemo(
    () => driverAlerts.filter((a) => a.isExpired),
    [driverAlerts]
  )
  const expiringSoonAlerts = useMemo(
    () => driverAlerts.filter((a) => a.isExpiringSoon),
    [driverAlerts]
  )

  const formatExpiryUK = (dateStr: string) => {
    if (!dateStr) return ""
    const parts = dateStr.split("-").map(Number)
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    }
    return dateStr
  }

  const getWhatsAppAlertUrl = (phone: string, driverName: string, docLabel: string) => {
    const clean = phone.replace(/[^0-9]/g, "")
    const formatted = clean.startsWith("0") ? `44${clean.slice(1)}` : clean
    const text = encodeURIComponent(
      `Hello ${driverName}, our Luxelyne Transfers compliance system indicates that your ${docLabel} has expired. Please provide your updated certificate and renewed expiry date as soon as possible.`
    )
    return formatted ? `https://wa.me/${formatted}?text=${text}` : null
  }

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

  // Today and Tomorrow date objects and labels
  const { todayFormatted, tomorrowFormatted, todayDate, tomorrowDate } = useMemo(() => {
    const now = new Date()
    const tom = new Date(now)
    tom.setDate(now.getDate() + 1)

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
    return {
      todayDate: now,
      tomorrowDate: tom,
      todayFormatted: now.toLocaleDateString("en-GB", options),
      tomorrowFormatted: tom.toLocaleDateString("en-GB", options),
    }
  }, [])

  // Exact calendar date comparison against target local date
  const isBookingOnDay = (dateVal?: string | null, target?: Date) => {
    if (!dateVal || !target) return false
    const trimmed = typeof dateVal === "string" ? dateVal.trim() : ""
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (ymdMatch) {
      const y = Number(ymdMatch[1])
      const m = Number(ymdMatch[2])
      const day = Number(ymdMatch[3])
      return (
        y === target.getFullYear() &&
        m === target.getMonth() + 1 &&
        day === target.getDate()
      )
    }

    const d = new Date(dateVal)
    if (isNaN(d.getTime())) return false

    return (
      d.getFullYear() === target.getFullYear() &&
      d.getMonth() === target.getMonth() &&
      d.getDate() === target.getDate()
    )
  }

  // Active tab state: Today or Tomorrow only
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today")

  // Segregate jobs into Today and Tomorrow
  const { todayJobs, tomorrowJobs } = useMemo(() => {
    const todayList: Booking[] = []
    const tomorrowList: Booking[] = []

    bookings.forEach((b) => {
      if (isBookingOnDay(b.date, todayDate)) {
        todayList.push(b)
      } else if (isBookingOnDay(b.date, tomorrowDate)) {
        tomorrowList.push(b)
      }
    })

    const sortByTime = (a: Booking, b: Booking) => {
      const timeA = a.time || "00:00"
      const timeB = b.time || "00:00"
      return timeA.localeCompare(timeB)
    }

    todayList.sort(sortByTime)
    tomorrowList.sort(sortByTime)

    return {
      todayJobs: todayList,
      tomorrowJobs: tomorrowList,
    }
  }, [bookings, todayDate, tomorrowDate])

  const todayUnassignedCount = useMemo(
    () => todayJobs.filter((b) => !b.driver_id && !b.driver && (b.status || "").toLowerCase() !== "cancelled").length,
    [todayJobs]
  )
  const tomorrowUnassignedCount = useMemo(
    () => tomorrowJobs.filter((b) => !b.driver_id && !b.driver && (b.status || "").toLowerCase() !== "cancelled").length,
    [tomorrowJobs]
  )

  const displayedJobs = activeTab === "today" ? todayJobs : tomorrowJobs
  const currentUnassignedCount = activeTab === "today" ? todayUnassignedCount : tomorrowUnassignedCount

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
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 h-9 shadow-sm transition flex items-center gap-1.5">
              <Users className="h-4 w-4 text-lime-400" />
              <span>Manage Drivers</span>
              {expiredDriverAlerts.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {expiredDriverAlerts.length} Expired
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* ⚠️ CRITICAL DRIVER COMPLIANCE NOTIFICATION: EXPIRED DOCUMENTS */}
      {expiredDriverAlerts.length > 0 && (
        <div className="rounded-2xl border-2 border-rose-400 bg-gradient-to-r from-rose-950 via-slate-950 to-slate-950 text-white p-5 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Alert Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-rose-900/60">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    Action Required: Driver Documents Expired
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-xs">
                    {expiredDriverAlerts.length} Document{expiredDriverAlerts.length > 1 ? "s" : ""} Expired
                  </span>
                </div>
                <p className="text-xs text-rose-200/80 mt-0.5 leading-relaxed">
                  The following driver compliance documents have expired. This notification will remain active on your dashboard until renewed certificates are uploaded and the expiry dates are updated.
                </p>
              </div>
            </div>

            <Link
              href="/admin/drivers?filter=expired"
              className="text-xs font-bold text-rose-300 hover:text-white inline-flex items-center gap-1 transition shrink-0"
            >
              <span>View All in Driver Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* List of Expired Driver Documents */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiredDriverAlerts.map((alert, idx) => {
              const waUrl = getWhatsAppAlertUrl(alert.driverPhone, alert.driverName, alert.docLabel)
              const daysAgo = Math.abs(alert.daysDiff)

              return (
                <div
                  key={`${alert.driverId}-${alert.docKey}-${idx}`}
                  className="bg-slate-900/90 border border-rose-900/80 hover:border-rose-500 rounded-xl p-3.5 flex flex-col justify-between transition-all group shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {alert.driverPhoto ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-700">
                            <img src={alert.driverPhoto} alt={alert.driverName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs shrink-0 border border-rose-500/30">
                            {alert.driverName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-white block truncate group-hover:text-rose-300 transition-colors">
                            {alert.driverName}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {alert.driverPhone}
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                        Expired
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold text-rose-200">{alert.docLabel}</span>
                        <span className="text-rose-400 font-bold text-[11px]">
                          {daysAgo === 0 ? "Expired Today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
                        <span>Expiry Date:</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {formatExpiryUK(alert.expiryDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 text-xs font-semibold inline-flex items-center gap-1.5 transition shrink-0"
                        title="Chat with driver on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <Link
                      href={`/admin/drivers?edit=${alert.driverId}`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs h-7 shadow-xs justify-center"
                      >
                        <span>Update Document</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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
        {/* Left: Today & Tomorrow Dispatch Schedule Widget (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-950">
                    Dispatch Queue: Today & Tomorrow
                  </h2>
                  {(todayUnassignedCount > 0 || tomorrowUnassignedCount > 0) && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      {todayUnassignedCount + tomorrowUnassignedCount} Unassigned Alert
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled passenger journeys with urgent driver assignment tracking.
                </p>
              </div>
            </div>

            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-lime-700 hover:text-lime-900 inline-flex items-center gap-1 transition shrink-0"
            >
              View All {metrics.totalBookings} Bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tab Navigation: Today & Tomorrow */}
          <div className="flex items-center">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("today")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "today"
                    ? "bg-white text-slate-950 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-lime-600" />
                <span>Today</span>
                <span className="text-[11px] text-slate-400 font-normal">({todayFormatted})</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    todayJobs.length > 0 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {todayJobs.length}
                </span>
                {todayUnassignedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                    ⚠️ {todayUnassignedCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tomorrow")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "tomorrow"
                    ? "bg-white text-slate-950 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Tomorrow</span>
                <span className="text-[11px] text-slate-400 font-normal">({tomorrowFormatted})</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    tomorrowJobs.length > 0 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tomorrowJobs.length}
                </span>
                {tomorrowUnassignedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                    ⚠️ {tomorrowUnassignedCount}
                  </span>
                )}
              </button>
            </div>
          </div>


          {/* Schedule Table */}
          {displayedJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold text-left">
                    <th className="pb-2">Date & Time</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Route</th>
                    <th className="pb-2">Driver Allocation</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-right">Total Fare</th>
                    <th className="pb-2 text-right">Driver Amount</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedJobs.map((b) => {
                    const customerName = `${b.first_name || ""} ${b.last_name || ""}`.trim() || "Customer"
                    const isCancelled = (b.status || "").toLowerCase() === "cancelled"
                    const isUnassigned = !b.driver_id && !b.driver && !isCancelled

                    return (
                      <tr
                        key={b.id}
                        className={`transition-colors ${
                          isUnassigned
                            ? "bg-amber-50/70 hover:bg-amber-100/60 border-l-4 border-l-amber-500"
                            : "hover:bg-slate-50/80 border-l-4 border-l-transparent"
                        }`}
                      >
                        <td className="py-2.5 text-slate-800 whitespace-nowrap">
                          <div className="font-bold text-slate-900">
                            {b.date ? formatDateUK(b.date) : "N/A"}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{b.time || "N/A"}</span>
                          </div>
                          {b.flight_no && (
                            <span className="text-[10px] text-sky-700 font-medium block">
                              Flight: {b.flight_no}
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 font-medium text-slate-900 whitespace-nowrap">
                          {customerName}
                          {b.phone && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              {b.phone}
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 text-slate-600 max-w-[190px] truncate" title={b.pickup_location || ""}>
                          <span className="font-medium text-slate-800 block truncate">
                            {formatLocation(b.pickup_location)}
                          </span>
                          {b.drop_off_location && (
                            <span className="text-[11px] text-slate-400 block truncate">
                              → {formatLocation(b.drop_off_location)}
                            </span>
                          )}
                        </td>

                        {/* Driver Allocation: Prominent Alert if unassigned */}
                        <td className="py-2.5 whitespace-nowrap">
                          {b.driver ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {b.driver.name}
                            </span>
                          ) : (
                            <div className="flex flex-col gap-0.5 items-start">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-[10px] shadow-2xs">
                                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 animate-bounce" />
                                ⚠️ ALERT: NO DRIVER
                              </span>
                              <span className="text-[9px] font-bold text-amber-800">
                                Requires allocation
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="py-2.5 text-center whitespace-nowrap">
                          <QuickStatusPopover booking={b} showPaymentBadge={true} />
                        </td>

                        <td className="py-2.5 text-right font-extrabold text-slate-900 whitespace-nowrap">
                          £{Number(b.final_amount ?? b.total_amount ?? 0).toFixed(2)}
                        </td>

                        <td className="py-2.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                          £{Number(b.driver_price ?? 0).toFixed(2)}
                        </td>

                        {/* Direct Action: Assign Driver if unassigned, else View Details */}
                        <td className="py-2.5 text-right whitespace-nowrap">
                          {isUnassigned ? (
                            <Link href={`/admin/bookings/${b.id}`}>
                              <Button
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-[11px] h-7 px-2.5 shadow-xs"
                              >
                                <UserPlus className="w-3 h-3 mr-1" />
                                Assign Driver
                              </Button>
                            </Link>
                          ) : (
                            <Link href={`/admin/bookings/${b.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 px-2.5"
                              >
                                Details →
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-4 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <CalendarCheck className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No bookings scheduled for {activeTab === "today" ? `Today (${todayFormatted})` : `Tomorrow (${tomorrowFormatted})`}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                No passenger journeys are currently slated for this date.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {activeTab === "today" && tomorrowJobs.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("tomorrow")}
                    className="text-xs font-semibold"
                  >
                    Check Tomorrow ({tomorrowJobs.length} jobs)
                  </Button>
                )}
                {activeTab === "tomorrow" && todayJobs.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab("today")}
                    className="text-xs font-semibold"
                  >
                    Check Today ({todayJobs.length} jobs)
                  </Button>
                )}
                <Link href="/admin/bookings">
                  <Button size="sm" className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold text-xs">
                    View All Bookings
                  </Button>
                </Link>
              </div>
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
