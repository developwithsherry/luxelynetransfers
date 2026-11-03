"use client"

import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  RotateCcw,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Booking } from "@/types/booking"
import {
  CALENDAR_CATEGORY_META,
  CalendarJobCategory,
  buildMonthCalendarGrid,
  getBookingCalendarCategory,
  normalizeBookingDateYMD,
} from "@/lib/calendar-utils"
import { formatLocation } from "@/components/format-location/format-location"

interface Props {
  bookings: Booking[]
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEKDAY_HEADERS = [
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
  { short: "Sun", full: "Sunday" },
]

export default function CalendarClientPage({ bookings }: Props) {
  const router = useRouter()

  const todayInfo = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const d = String(now.getDate()).padStart(2, "0")
    const mStr = String(m + 1).padStart(2, "0")
    return {
      year: y,
      monthIndex: m,
      todayStr: `${y}-${mStr}-${d}`,
    }
  }, [])

  const [currentYear, setCurrentYear] = useState<number>(todayInfo.year)
  const [currentMonth, setCurrentMonth] = useState<number>(todayInfo.monthIndex)
  const [categoryFilter, setCategoryFilter] = useState<"all" | CalendarJobCategory>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Restore month/year if URL has ?month=YYYY-MM
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const monthParam = params.get("month")
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [yStr, mStr] = monthParam.split("-")
      const y = Number(yStr)
      const m = Number(mStr) - 1
      if (!isNaN(y) && !isNaN(m) && m >= 0 && m <= 11) {
        setCurrentYear(y)
        setCurrentMonth(m)
      }
    }
  }, [])

  // Build available years range dynamically around existing bookings + standard range
  const yearOptions = useMemo(() => {
    const years = new Set<number>()
    for (let y = todayInfo.year - 2; y <= todayInfo.year + 4; y++) {
      years.add(y)
    }
    bookings.forEach((b) => {
      const ymd = normalizeBookingDateYMD(b.date)
      if (ymd) {
        const y = Number(ymd.slice(0, 4))
        if (!isNaN(y) && y >= 2020 && y <= 2035) years.add(y)
      }
    })
    return Array.from(years).sort((a, b) => a - b)
  }, [bookings, todayInfo.year])

  // Filter bookings by search and category filter
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const cat = getBookingCalendarCategory(b)
      if (categoryFilter !== "all" && cat !== categoryFilter) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const passenger = `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase()
        const bookingId = (b.id || "").toLowerCase()
        const pickup = (b.pickup_location || "").toLowerCase()
        const dropoff = (b.drop_off_location || "").toLowerCase()
        const driverName = (b.driver?.name || "").toLowerCase()
        const supplierName = (b.supplier?.name || "").toLowerCase()
        const supplierRef = (b.supplier_reference || "").toLowerCase()

        const matches =
          passenger.includes(q) ||
          bookingId.includes(q) ||
          pickup.includes(q) ||
          dropoff.includes(q) ||
          driverName.includes(q) ||
          supplierName.includes(q) ||
          supplierRef.includes(q)

        if (!matches) return false
      }

      return true
    })
  }, [bookings, categoryFilter, searchQuery])

  // Group bookings by normalized YYYY-MM-DD date and sort chronologically within each date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>()

    filteredBookings.forEach((b) => {
      const ymd = normalizeBookingDateYMD(b.date)
      if (!ymd) return
      const existing = map.get(ymd) || []
      existing.push(b)
      map.set(ymd, existing)
    })

    map.forEach((list, key) => {
      list.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"))
      map.set(key, list)
    })

    return map
  }, [filteredBookings])

  // Calculate stats for the active month (unfiltered by categoryFilter so KPI cards show all 4 counts)
  const monthPrefix = useMemo(() => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`
  }, [currentYear, currentMonth])

  const monthStats = useMemo(() => {
    let totalJobs = 0
    let completed = 0
    let covered = 0
    let uncovered = 0
    let canceled = 0
    let totalRevenue = 0
    let completedProfit = 0

    bookings.forEach((b) => {
      const ymd = normalizeBookingDateYMD(b.date)
      if (!ymd.startsWith(monthPrefix)) return

      totalJobs++
      const cat = getBookingCalendarCategory(b)
      const fare = Number(b.final_amount ?? b.total_amount ?? 0)
      const driverCost = Number(b.driver_price ?? 0)

      if (cat !== "canceled") {
        totalRevenue += fare
      }

      if (cat === "completed") {
        completed++
        completedProfit += fare - driverCost
      } else if (cat === "covered") {
        covered++
      } else if (cat === "uncovered") {
        uncovered++
      } else if (cat === "canceled") {
        canceled++
      }
    })

    return {
      totalJobs,
      completed,
      covered,
      uncovered,
      canceled,
      totalRevenue,
      completedProfit,
    }
  }, [bookings, monthPrefix])

  // Build calendar grid for the selected month
  const calendarWeeks = useMemo(() => {
    return buildMonthCalendarGrid(currentYear, currentMonth, todayInfo.todayStr)
  }, [currentYear, currentMonth, todayInfo.todayStr])

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleJumpToday = () => {
    setCurrentYear(todayInfo.year)
    setCurrentMonth(todayInfo.monthIndex)
  }

  const handleDateClick = (dateStr: string, hasJobs: boolean) => {
    if (!hasJobs) return
    router.push(`/admin/calendar/${dateStr}`)
  }

  return (
    <div className="space-y-4 w-full max-w-[1600px] mx-auto pb-8">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
            <span>Fleet Schedule & Visual Dispatch</span>
            <span className="text-slate-300">•</span>
            <span className="text-lime-700 font-bold">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dispatch Calendar
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/bookings">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              All Bookings ({bookings.length})
              <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Month KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Total Month Jobs */}
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`text-left bg-slate-950 text-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            categoryFilter === "all"
              ? "border-lime-400 ring-2 ring-lime-400/30 shadow-md"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400">
              {MONTH_NAMES[currentMonth]} Jobs
            </span>
            <div className="w-8 h-8 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-lime-400" />
            </div>
          </div>
          <p className="text-2xl font-black tracking-tight">{monthStats.totalJobs}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Month Revenue</span>
            <span className="font-bold text-white">£{monthStats.totalRevenue.toFixed(2)}</span>
          </div>
        </button>

        {/* Card 2: Completed (Green) */}
        <button
          type="button"
          onClick={() =>
            setCategoryFilter((prev) => (prev === "completed" ? "all" : "completed"))
          }
          className={`text-left bg-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            categoryFilter === "completed"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "border-slate-200 hover:border-emerald-300 shadow-2xs"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">{monthStats.completed}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Green Line
            </span>
            <span className="font-bold text-emerald-700">
              Profit: £{monthStats.completedProfit.toFixed(0)}
            </span>
          </div>
        </button>

        {/* Card 3: Covered (Blue) */}
        <button
          type="button"
          onClick={() => setCategoryFilter((prev) => (prev === "covered" ? "all" : "covered"))}
          className={`text-left bg-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            categoryFilter === "covered"
              ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
              : "border-slate-200 hover:border-blue-300 shadow-2xs"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Covered
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-700">{monthStats.covered}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Blue Line
            </span>
            <span className="font-semibold text-blue-700">Driver Assigned</span>
          </div>
        </button>

        {/* Card 4: Uncovered (Grey) */}
        <button
          type="button"
          onClick={() =>
            setCategoryFilter((prev) => (prev === "uncovered" ? "all" : "uncovered"))
          }
          className={`text-left bg-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            categoryFilter === "uncovered"
              ? "border-slate-600 ring-2 ring-slate-500/20 shadow-md"
              : "border-slate-200 hover:border-slate-400 shadow-2xs"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-slate-500" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Uncovered
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-slate-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-700">{monthStats.uncovered}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Grey Line
            </span>
            <span className="font-semibold text-slate-600">Needs Driver</span>
          </div>
        </button>

        {/* Card 5: Canceled (Red) */}
        <button
          type="button"
          onClick={() => setCategoryFilter((prev) => (prev === "canceled" ? "all" : "canceled"))}
          className={`text-left bg-white p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
            categoryFilter === "canceled"
              ? "border-rose-600 ring-2 ring-rose-500/20 shadow-md"
              : "border-slate-200 hover:border-rose-300 shadow-2xs"
          }`}
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-rose-600" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Canceled
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600">{monthStats.canceled}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              Red Line
            </span>
            <span className="font-semibold text-rose-600">Canceled Jobs</span>
          </div>
        </button>
      </div>

      {/* Main Calendar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Calendar Toolbar: Legend + Month Navigation + Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Left: Interactive Color Legend */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Legend:
            </span>
            <button
              type="button"
              onClick={() => setCategoryFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                categoryFilter === "all"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Statuses
            </button>
            {(["completed", "covered", "uncovered", "canceled"] as CalendarJobCategory[]).map(
              (catKey) => {
                const meta = CALENDAR_CATEGORY_META[catKey]
                const isSelected = categoryFilter === catKey
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() =>
                      setCategoryFilter((prev) => (prev === catKey ? "all" : catKey))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      isSelected
                        ? `${meta.barBg} text-white border-transparent shadow-2xs`
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-xs ${
                        isSelected ? "bg-white" : meta.barBg
                      }`}
                    />
                    <span>{meta.label}</span>
                  </button>
                )
              }
            )}
          </div>

          {/* Center: Month & Year Navigation */}
          <div className="flex items-center gap-1.5 self-start lg:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </Button>

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer pr-1"
                aria-label="Select Month"
              >
                {MONTH_NAMES.map((mName, idx) => (
                  <option key={mName} value={idx}>
                    {mName}
                  </option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                aria-label="Select Year"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleJumpToday}
              className="h-8 px-3 text-xs font-bold rounded-lg border-slate-200 bg-white hover:bg-lime-50 hover:text-lime-800 hover:border-lime-300 cursor-pointer"
            >
              Today
            </Button>
          </div>

          {/* Right: Search Input */}
          <div className="flex items-center gap-2 w-full lg:w-64">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search passenger, driver, ref..."
                className="h-8 pl-8 pr-7 text-xs bg-white border-slate-200 rounded-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Helper Banner */}
        <div className="px-4 py-2 bg-slate-900 text-slate-300 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <span>
            Click on any highlighted date with jobs to open the full daily schedule & dispatch view for that date.
          </span>
          <span className="font-semibold text-lime-400">
            Showing {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
        </div>

        {/* Calendar Grid (Scrollable horizontally on very small screens) */}
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            {/* Weekday Column Headers */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/80">
              {WEEKDAY_HEADERS.map((day, idx) => (
                <div
                  key={day.short}
                  className={`py-2.5 px-3 text-center text-xs font-extrabold uppercase tracking-wider ${
                    idx >= 5 ? "text-slate-500 bg-slate-100" : "text-slate-700"
                  } ${idx < 6 ? "border-r border-slate-200" : ""}`}
                >
                  <span className="hidden sm:inline">{day.full}</span>
                  <span className="sm:hidden">{day.short}</span>
                </div>
              ))}
            </div>

            {/* Week Rows */}
            <div className="divide-y divide-slate-200">
              {calendarWeeks.map((week, wIdx) => (
                <div key={`${week.weekNumber}-${wIdx}`} className="grid grid-cols-7">
                  {week.days.map((cell, dIdx) => {
                    const dayJobs = bookingsByDate.get(cell.dateStr) || []
                    const hasJobs = dayJobs.length > 0
                    const visibleJobs = dayJobs.slice(0, 4)
                    const hiddenCount = Math.max(0, dayJobs.length - visibleJobs.length)

                    return (
                      <div
                        key={cell.dateStr}
                        onClick={() => handleDateClick(cell.dateStr, hasJobs)}
                        className={`min-h-[132px] p-1.5 sm:p-2 flex flex-col justify-between transition-all relative group ${
                          dIdx < 6 ? "border-r border-slate-200" : ""
                        } ${
                          !cell.isCurrentMonth
                            ? "bg-slate-50/70 text-slate-400"
                            : cell.isWeekend
                            ? "bg-sky-50/25"
                            : "bg-white"
                        } ${
                          cell.isToday
                            ? "ring-2 ring-inset ring-lime-500 bg-lime-50/20"
                            : ""
                        } ${
                          hasJobs
                            ? "cursor-pointer hover:bg-slate-50/90 hover:shadow-inner"
                            : ""
                        }`}
                      >
                        {/* Top of Cell: CW label on Monday + Day Number & Job Count */}
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <div className="flex items-center gap-1">
                              {dIdx === 0 && (
                                <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                                  CW {week.weekNumber}
                                </span>
                              )}
                              {hasJobs && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-lime-400">
                                  {dayJobs.length} {dayJobs.length === 1 ? "job" : "jobs"}
                                </span>
                              )}
                            </div>

                            <span
                              className={`inline-flex items-center justify-center text-xs font-extrabold rounded-lg px-1.5 py-0.5 ${
                                cell.isToday
                                  ? "bg-lime-400 text-slate-950 shadow-2xs"
                                  : cell.isCurrentMonth
                                  ? "text-slate-800"
                                  : "text-slate-400"
                              }`}
                            >
                              {String(cell.dayNumber).padStart(2, "0")}
                            </span>
                          </div>

                          {/* Colored Job Lines / Bars */}
                          <div className="space-y-1">
                            {visibleJobs.map((job) => {
                              const cat = getBookingCalendarCategory(job)
                              const meta = CALENDAR_CATEGORY_META[cat]
                              const passengerName =
                                [job.first_name, job.last_name]
                                  .filter(Boolean)
                                  .join(" ")
                                  .trim() || "Guest"
                              const shortId = (job.id || "").slice(0, 5).toUpperCase()
                              const timeLabel = (job.time || "").slice(0, 5) || "TBA"
                              const pickupShort = formatLocation(job.pickup_location || "")
                              const dropoffShort = formatLocation(job.drop_off_location || "")

                              return (
                                <div
                                  key={job.id}
                                  title={`${meta.label.toUpperCase()} • ${timeLabel} • #${shortId}\nPassenger: ${passengerName}\nRoute: ${pickupShort} → ${dropoffShort}${
                                    job.driver?.name ? `\nDriver: ${job.driver.name}` : "\nDriver: Unassigned"
                                  }`}
                                  className={`w-full px-2 py-1 rounded-md text-[11px] leading-tight font-semibold truncate border shadow-2xs transition-transform group-hover:translate-x-0.5 ${meta.barBg} ${meta.barHoverBg} ${meta.barText} ${meta.barBorder}`}
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="truncate">
                                      <span className="font-extrabold mr-1">{timeLabel}</span>
                                      <span>{passengerName}</span>
                                    </span>
                                    <span className="text-[9px] opacity-85 font-mono shrink-0">
                                      #{shortId}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}

                            {hiddenCount > 0 && (
                              <div className="w-full px-2 py-0.5 rounded bg-slate-900 text-lime-400 text-[10px] font-bold text-center">
                                +{hiddenCount} more {hiddenCount === 1 ? "job" : "jobs"} • View all
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subtle bottom hover prompt when date has jobs */}
                        {hasJobs && (
                          <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 group-hover:text-slate-900">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              Open date details
                            </span>
                            <span>→</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

