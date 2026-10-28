"use client"

import { useMemo, useState } from "react"
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Users,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  MessageSquare,
  Plane,
  ArrowUpRight,
  PoundSterling,
  RotateCcw,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

function normalizeBookingYMD(dateVal?: string | null): string {
  if (!dateVal) return ""
  const trimmed = dateVal.trim()
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  const d = new Date(trimmed)
  if (isNaN(d.getTime())) return ""
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function DashboardPage({ bookings, driverAlerts = [] }: Props) {
  const todayStr = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, "0")
    const d = String(now.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }, [])

  // Date range filter applicable ONLY to the top stats cards
  const [statsFromDate, setStatsFromDate] = useState<string>("")
  const [statsToDate, setStatsToDate] = useState<string>("")
  const hasStatsDateFilter = Boolean(statsFromDate || statsToDate)

  // Expired driver document compliance alerts
  const expiredDriverAlerts = useMemo(
    () => driverAlerts.filter((a) => a.isExpired),
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

  // Top KPI Stats (filtered ONLY by statsFromDate / statsToDate)
  const metrics = useMemo(() => {
    const statsBookings = bookings.filter((b) => {
      if (!statsFromDate && !statsToDate) return true
      const bYMD = normalizeBookingYMD(b.date)
      if (!bYMD) return false
      if (statsFromDate && bYMD < statsFromDate) return false
      if (statsToDate && bYMD > statsToDate) return false
      return true
    })

    let upcoming = 0
    let past = 0
    let notAssigned = 0
    let assigned = 0
    let totalRevenue = 0
    let totalDriverCost = 0
    let websiteBookings = 0
    let supplierBookings = 0

    statsBookings.forEach((b) => {
      const isCancelled = (b.status || "").toLowerCase() === "cancelled"
      const dateStr = normalizeBookingYMD(b.date)

      if (!isCancelled) {
        const amt = Number(b.final_amount ?? b.total_amount ?? 0)
        const dCost = Number(b.driver_price || 0)
        totalRevenue += isNaN(amt) ? 0 : amt
        totalDriverCost += isNaN(dCost) ? 0 : dCost

        if (b.driver_id) {
          assigned++
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

    const activeCount = assigned + notAssigned
    const avgFare = activeCount > 0 ? totalRevenue / activeCount : 0
    const totalProfit = totalRevenue - totalDriverCost
    const profitMargin =
      totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0

    return {
      totalBookings: statsBookings.length,
      upcomingCount: upcoming,
      pastCount: past,
      notAssignedCount: notAssigned,
      assignedCount: assigned,
      totalRevenue,
      totalDriverCost,
      totalProfit,
      profitMargin,
      avgFare,
      websiteBookings,
      supplierBookings,
    }
  }, [bookings, todayStr, statsFromDate, statsToDate])

  // Today and Tomorrow date objects and labels
  const { todayFormatted, tomorrowFormatted, fullTodayHeading, todayDate, tomorrowDate } =
    useMemo(() => {
      const now = new Date()
      const tom = new Date(now)
      tom.setDate(now.getDate() + 1)

      const shortOptions: Intl.DateTimeFormatOptions = {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
      const fullOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
      return {
        todayDate: now,
        tomorrowDate: tom,
        todayFormatted: now.toLocaleDateString("en-GB", shortOptions),
        tomorrowFormatted: tom.toLocaleDateString("en-GB", shortOptions),
        fullTodayHeading: now.toLocaleDateString("en-GB", fullOptions),
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

  // Active tab state: Today or Tomorrow
  const [activeTab, setActiveTab] = useState<"today" | "tomorrow">("today")

  // Segregate jobs into Today and Tomorrow (always live regardless of top stats filter)
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
    () =>
      todayJobs.filter(
        (b) => !b.driver_id && !b.driver && (b.status || "").toLowerCase() !== "cancelled"
      ).length,
    [todayJobs]
  )
  const tomorrowUnassignedCount = useMemo(
    () =>
      tomorrowJobs.filter(
        (b) => !b.driver_id && !b.driver && (b.status || "").toLowerCase() !== "cancelled"
      ).length,
    [tomorrowJobs]
  )

  const todayTotalValue = useMemo(
    () =>
      todayJobs.reduce(
        (sum, b) =>
          (b.status || "").toLowerCase() === "cancelled"
            ? sum
            : sum + Number(b.final_amount ?? b.total_amount ?? 0),
        0
      ),
    [todayJobs]
  )

  const tomorrowTotalValue = useMemo(
    () =>
      tomorrowJobs.reduce(
        (sum, b) =>
          (b.status || "").toLowerCase() === "cancelled"
            ? sum
            : sum + Number(b.final_amount ?? b.total_amount ?? 0),
        0
      ),
    [tomorrowJobs]
  )

  const displayedJobs = activeTab === "today" ? todayJobs : tomorrowJobs

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 pb-8">
      {/* =================================================================== */}
      {/* 1. HEADER BAR                                                       */}
      {/* =================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5 text-slate-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-lime-500" />
              {fullTodayHeading}
            </span>
            <span className="text-slate-300">•</span>
            <span>
              {todayJobs.length} today, {tomorrowJobs.length} tomorrow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
            Operations & Dispatch Desk
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/accounts">
            <Button
              variant="outline"
              className="h-9 px-4 text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-2xs"
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Accounts & Reports
            </Button>
          </Link>

          <Link href="/admin/drivers">
            <Button
              variant="outline"
              className="h-9 px-4 text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-2xs"
            >
              <Users className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
              Drivers
              {expiredDriverAlerts.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {expiredDriverAlerts.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/admin/bookings">
            <Button className="h-9 px-4 text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-white rounded-xl shadow-2xs">
              All Bookings ({bookings.length})
              <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-lime-400" />
            </Button>
          </Link>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. EXPIRED DRIVER COMPLIANCE STRIP (ONLY IF ALERTS EXIST)           */}
      {/* =================================================================== */}
      {expiredDriverAlerts.length > 0 && (
        <div className="rounded-2xl bg-slate-950 text-white p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-sm font-semibold text-white">
                Driver Compliance Attention — {expiredDriverAlerts.length} Expired Document
                {expiredDriverAlerts.length > 1 ? "s" : ""}
              </h2>
            </div>
            <Link
              href="/admin/drivers?filter=expired"
              className="text-xs font-medium text-slate-400 hover:text-white inline-flex items-center gap-1 transition"
            >
              Open Driver Compliance <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {expiredDriverAlerts.map((alert, idx) => {
              const waUrl = getWhatsAppAlertUrl(
                alert.driverPhone,
                alert.driverName,
                alert.docLabel
              )
              const daysAgo = Math.abs(alert.daysDiff)

              return (
                <div
                  key={`${alert.driverId}-${alert.docKey}-${idx}`}
                  className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {alert.driverName}
                      </p>
                      <p className="text-xs text-rose-400 font-medium mt-0.5">
                        {alert.docLabel} • Expired {formatExpiryUK(alert.expiryDate)}
                      </p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 shrink-0">
                      {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Notify on WhatsApp
                      </a>
                    )}
                    <Link
                      href={`/admin/drivers?edit=${alert.driverId}`}
                      className="text-xs font-semibold text-lime-400 hover:text-lime-300 inline-flex items-center gap-1 ml-auto"
                    >
                      Update <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. TOP PERFORMANCE STATS + DEDICATED STATS DATE RANGE FILTER        */}
      {/* =================================================================== */}
      <section className="space-y-3.5">
        {/* Date Filter Bar for Top Stats Only */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-500" />
            <span className="text-xs font-bold text-slate-900">
              Performance Overview
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              — Filter metrics by date range
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                From
              </span>
              <Input
                type="date"
                value={statsFromDate}
                onChange={(e) => setStatsFromDate(e.target.value)}
                className="h-8 w-[138px] text-xs bg-slate-50/70 border-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                To
              </span>
              <Input
                type="date"
                value={statsToDate}
                onChange={(e) => setStatsToDate(e.target.value)}
                className="h-8 w-[138px] text-xs bg-slate-50/70 border-slate-200"
              />
            </div>

            {hasStatsDateFilter && (
              <button
                type="button"
                onClick={() => {
                  setStatsFromDate("")
                  setStatsToDate("")
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 5 Rich Brand-Palette KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Bookings (Obsidian & Signature Lime Accent) */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs hover:shadow-md hover:border-lime-400 transition-all group flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-1 bg-lime-500" />
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-lime-400/10 blur-xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Total Bookings
                </span>
                <div className="text-3xl font-black text-slate-950 tabular-nums tracking-tight mt-1.5">
                  {metrics.totalBookings}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-lime-100 text-lime-800 border border-lime-300/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Online: <strong className="text-slate-900">{metrics.websiteBookings}</strong>
              </span>
              <span>
                Suppliers: <strong className="text-slate-900">{metrics.supplierBookings}</strong>
              </span>
            </div>
          </div>

          {/* Card 2: Total Revenue (Deep Obsidian Luxury Card) */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white border border-slate-800 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-lime-400 to-emerald-400" />
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-lime-400/15 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400 block">
                  Total Revenue
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight mt-1.5">
                  £
                  {metrics.totalRevenue.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-lime-400/15 text-lime-400 border border-lime-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PoundSterling className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-[11px] text-slate-400">
              <span>Avg Fare / Job</span>
              <strong className="text-white font-mono">
                £{metrics.avgFare.toFixed(2)}
              </strong>
            </div>
          </div>

          {/* Card 3: Upcoming Jobs (Royal Blue Dispatch Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/70 via-white to-white border border-blue-200/90 p-5 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all group flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-600" />
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Upcoming Jobs
                </span>
                <div className="text-3xl font-black text-blue-950 tabular-nums tracking-tight mt-1.5">
                  {metrics.upcomingCount}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100/80 flex items-center justify-between text-[11px] text-blue-800/80">
              <span>Unassigned</span>
              <strong
                className={
                  metrics.notAssignedCount > 0
                    ? "text-amber-700 font-bold"
                    : "text-blue-950"
                }
              >
                {metrics.notAssignedCount} jobs
              </strong>
            </div>
          </div>

          {/* Card 4: Past Jobs (Deep Violet Fulfilled Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-white border border-purple-200/90 p-5 shadow-2xs hover:shadow-md hover:border-purple-400 transition-all group flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-1 bg-purple-600" />
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                  Past Jobs
                </span>
                <div className="text-3xl font-black text-purple-950 tabular-nums tracking-tight mt-1.5">
                  {metrics.pastCount}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100/80 flex items-center justify-between text-[11px] text-purple-800/80">
              <span>Assigned Drivers</span>
              <strong className="text-purple-950">{metrics.assignedCount} jobs</strong>
            </div>
          </div>

          {/* Card 5: Total Profit (Emerald & Lime Wealth Theme) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/80 via-lime-50/30 to-white border border-emerald-300/90 p-5 shadow-2xs hover:shadow-md hover:border-emerald-500 transition-all group flex flex-col justify-between">
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-600" />
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-emerald-500/15 blur-xl pointer-events-none" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Total Profit
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight mt-1.5 ${
                    metrics.totalProfit >= 0 ? "text-emerald-950" : "text-rose-700"
                  }`}
                >
                  {metrics.totalProfit < 0 ? "-" : ""}£
                  {Math.abs(metrics.totalProfit).toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between text-[11px] text-emerald-900/80">
              <span>Margin: <strong>{metrics.profitMargin}%</strong></span>
              <span className="font-mono text-slate-600">
                Cost: £{metrics.totalDriverCost.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. TODAY & TOMORROW JOURNEY BOARD                                   */}
      {/* =================================================================== */}
      <section className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* Top Split Day Switcher: Today vs Tomorrow Readiness Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-200/80 bg-slate-50/50">
          {/* TODAY SELECTOR CARD */}
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`text-left p-5 sm:p-6 transition-all relative border-b md:border-b-0 md:border-r border-slate-200/80 ${
              activeTab === "today"
                ? "bg-white"
                : "hover:bg-white/60 opacity-75 hover:opacity-100"
            }`}
          >
            {activeTab === "today" && (
              <div className="absolute inset-x-0 top-0 h-1 bg-lime-500" />
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-lime-700">
                    Today&apos;s Schedule
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    • {todayFormatted}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-bold text-slate-950 tabular-nums tracking-tight">
                    {todayJobs.length}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {todayJobs.length === 1 ? "Journey" : "Journeys"}
                  </span>
                </div>
              </div>

              <div className="text-right space-y-1.5">
                {todayUnassignedCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                    {todayUnassignedCount} Needs Driver
                  </span>
                ) : todayJobs.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    All Covered
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                    Clear Schedule
                  </span>
                )}
                <div className="text-xs text-slate-400 font-mono">
                  Value: £{todayTotalValue.toFixed(2)}
                </div>
              </div>
            </div>
          </button>

          {/* TOMORROW SELECTOR CARD */}
          <button
            type="button"
            onClick={() => setActiveTab("tomorrow")}
            className={`text-left p-5 sm:p-6 transition-all relative ${
              activeTab === "tomorrow"
                ? "bg-white"
                : "hover:bg-white/60 opacity-75 hover:opacity-100"
            }`}
          >
            {activeTab === "tomorrow" && (
              <div className="absolute inset-x-0 top-0 h-1 bg-blue-600" />
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700">
                    Tomorrow&apos;s Readiness
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    • {tomorrowFormatted}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-3xl font-bold text-slate-950 tabular-nums tracking-tight">
                    {tomorrowJobs.length}
                  </span>
                  <span className="text-sm font-medium text-slate-600">
                    {tomorrowJobs.length === 1 ? "Journey" : "Journeys"}
                  </span>
                </div>
              </div>

              <div className="text-right space-y-1.5">
                {tomorrowUnassignedCount > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                    {tomorrowUnassignedCount} Needs Driver
                  </span>
                ) : tomorrowJobs.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Ready & Covered
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                    No Bookings Yet
                  </span>
                )}
                <div className="text-xs text-slate-400 font-mono">
                  Value: £{tomorrowTotalValue.toFixed(2)}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Active Day Sub-Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              Showing {activeTab === "today" ? `Today (${todayFormatted})` : `Tomorrow (${tomorrowFormatted})`}
            </span>
            <span>•</span>
            <span>Sorted chronologically by pickup time</span>
          </div>

          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-lime-700 hover:text-lime-900 inline-flex items-center gap-1 transition"
          >
            Open Full Dispatch Table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Journeys Table */}
        {displayedJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-slate-400 text-[10px] uppercase tracking-wider font-semibold text-left">
                  <th className="py-3 pl-6 pr-3">Date & Time</th>
                  <th className="py-3 px-3">Passenger</th>
                  <th className="py-3 px-3">Journey Route</th>
                  <th className="py-3 px-3">Driver Allocation</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Total Fare</th>
                  <th className="py-3 px-3 text-right">Driver Amount</th>
                  <th className="py-3 pl-3 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedJobs.map((b) => {
                  const customerName =
                    `${b.first_name || ""} ${b.last_name || ""}`.trim() || "Guest Passenger"
                  const isCancelled = (b.status || "").toLowerCase() === "cancelled"
                  const isUnassigned = !b.driver_id && !b.driver && !isCancelled

                  return (
                    <tr
                      key={b.id}
                      className={`group transition-colors ${
                        isUnassigned
                          ? "bg-amber-50/40 hover:bg-amber-50/80"
                          : "hover:bg-slate-50/70"
                      }`}
                    >
                      {/* Date & Time (No Reference No shown here) */}
                      <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {b.date ? formatDateUK(b.date) : "N/A"}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-medium mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{b.time || "N/A"}</span>
                          {b.flight_no && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.2 rounded bg-sky-50 text-sky-800 border border-sky-200/80 ml-1">
                              <Plane className="w-2.5 h-2.5" />
                              {b.flight_no}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Passenger */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{customerName}</div>
                        {b.phone ? (
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            {b.phone}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-300 italic mt-0.5">
                            No phone listed
                          </div>
                        )}
                      </td>

                      {/* Route */}
                      <td
                        className="py-4 px-3 max-w-[260px]"
                        title={`${b.pickup_location || ""} → ${b.drop_off_location || ""}`}
                      >
                        <div className="font-medium text-slate-900 truncate">
                          {formatLocation(b.pickup_location)}
                        </div>
                        {b.drop_off_location && (
                          <div className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                            <span className="text-lime-600 font-bold">→</span>
                            <span className="truncate">
                              {formatLocation(b.drop_off_location)}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Driver Allocation */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        {b.driver ? (
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50/90 text-emerald-900 border border-emerald-200 font-semibold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{b.driver.name}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/90 text-amber-950 border border-amber-300 font-semibold text-[11px]">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Interactive Status Popover */}
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        <QuickStatusPopover booking={b} showPaymentBadge={true} />
                      </td>

                      {/* Total Fare */}
                      <td className="py-4 px-3 text-right font-mono font-bold text-slate-950 text-sm whitespace-nowrap tabular-nums">
                        £{Number(b.final_amount ?? b.total_amount ?? 0).toFixed(2)}
                      </td>

                      {/* Driver Amount (Next to Total Fare) */}
                      <td className="py-4 px-3 text-right font-mono font-semibold text-emerald-700 text-sm whitespace-nowrap tabular-nums">
                        £{Number(b.driver_price ?? 0).toFixed(2)}
                      </td>

                      {/* Action */}
                      <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                        {isUnassigned ? (
                          <Link href={`/admin/bookings/${b.id}`}>
                            <Button
                              size="sm"
                              className="bg-slate-950 hover:bg-slate-800 text-white font-semibold text-[11px] h-8 px-3 rounded-lg"
                            >
                              <UserPlus className="w-3 h-3 mr-1.5 text-lime-400" />
                              Assign Driver
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/admin/bookings/${b.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-[11px] font-semibold text-slate-700 border-slate-200 hover:bg-slate-100 px-3 rounded-lg"
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
          <div className="py-16 px-6 text-center bg-white">
            <div className="w-11 h-11 mx-auto rounded-2xl bg-lime-100/80 flex items-center justify-center text-lime-700 mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              No journeys scheduled for{" "}
              {activeTab === "today"
                ? `Today (${todayFormatted})`
                : `Tomorrow (${tomorrowFormatted})`}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
              {activeTab === "today"
                ? "There are no dispatches slated for today. Review tomorrow's queue to prepare driver allocations ahead of time."
                : "No bookings are currently scheduled for tomorrow."}
            </p>
            <div className="flex items-center justify-center gap-2.5">
              {activeTab === "today" && tomorrowJobs.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("tomorrow")}
                  className="text-xs font-semibold rounded-xl h-8"
                >
                  Switch to Tomorrow ({tomorrowJobs.length})
                </Button>
              )}
              {activeTab === "tomorrow" && todayJobs.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("today")}
                  className="text-xs font-semibold rounded-xl h-8"
                >
                  Switch to Today ({todayJobs.length})
                </Button>
              )}
              <Link href="/admin/bookings">
                <Button
                  size="sm"
                  className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold text-xs rounded-xl h-8 px-3.5"
                >
                  Browse All Bookings
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
