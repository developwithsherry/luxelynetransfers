"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  Plane,
  Building2,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  Search,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Booking } from "@/types/booking"
import {
  CALENDAR_CATEGORY_META,
  CalendarJobCategory,
  formatFullDateHeadingUK,
  getBookingCalendarCategory,
  normalizeBookingDateYMD,
} from "@/lib/calendar-utils"
import { formatLocation } from "@/components/format-location/format-location"

interface Props {
  dateStr: string
  allBookings: Booking[]
}

function shiftDateYMD(ymd: string, deltaDays: number): string {
  const parts = ymd.split("-").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return ymd
  const d = new Date(parts[0], parts[1] - 1, parts[2] + deltaDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function CalendarDateDetailClient({ dateStr, allBookings }: Props) {
  const router = useRouter()
  const [categoryFilter, setCategoryFilter] = useState<"all" | CalendarJobCategory>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const normalizedTargetDate = useMemo(() => normalizeBookingDateYMD(dateStr) || dateStr, [dateStr])
  const monthParam = useMemo(() => normalizedTargetDate.slice(0, 7), [normalizedTargetDate])

  // Filter all bookings belonging to this date, sorted chronologically by pickup time
  const dateBookings = useMemo(() => {
    const list = allBookings.filter(
      (b) => normalizeBookingDateYMD(b.date) === normalizedTargetDate
    )
    list.sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"))
    return list
  }, [allBookings, normalizedTargetDate])

  // Daily KPI metrics
  const dayStats = useMemo(() => {
    let completed = 0
    let covered = 0
    let uncovered = 0
    let canceled = 0
    let totalRevenue = 0
    let completedProfit = 0

    dateBookings.forEach((b) => {
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
      total: dateBookings.length,
      completed,
      covered,
      uncovered,
      canceled,
      totalRevenue,
      completedProfit,
    }
  }, [dateBookings])

  // Apply category & search filter to date's jobs
  const filteredJobs = useMemo(() => {
    return dateBookings.filter((b) => {
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

        return (
          passenger.includes(q) ||
          bookingId.includes(q) ||
          pickup.includes(q) ||
          dropoff.includes(q) ||
          driverName.includes(q) ||
          supplierName.includes(q) ||
          supplierRef.includes(q)
        )
      }

      return true
    })
  }, [dateBookings, categoryFilter, searchQuery])

  const prevDateStr = useMemo(() => shiftDateYMD(normalizedTargetDate, -1), [normalizedTargetDate])
  const nextDateStr = useMemo(() => shiftDateYMD(normalizedTargetDate, 1), [normalizedTargetDate])

  return (
    <div className="space-y-4 w-full max-w-[1400px] mx-auto pb-10">
      {/* Top Navigation & Date Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <Link href={`/admin/calendar?month=${monthParam}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 shrink-0 cursor-pointer"
              title="Back to Calendar"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
              <Link
                href={`/admin/calendar?month=${monthParam}`}
                className="text-lime-700 hover:underline font-bold inline-flex items-center gap-1"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                Dispatch Calendar
              </Link>
              <span className="text-slate-300">/</span>
              <span>Daily Schedule Breakdown</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatFullDateHeadingUK(normalizedTargetDate)}
            </h1>
          </div>
        </div>

        {/* Day Stepper Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/calendar/${prevDateStr}`)}
            className="h-9 px-3 text-xs font-semibold rounded-xl border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Previous Day
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/calendar/${nextDateStr}`)}
            className="h-9 px-3 text-xs font-semibold rounded-xl border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            Next Day
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Daily KPI Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Jobs on Date */}
        <button
          type="button"
          onClick={() => setCategoryFilter("all")}
          className={`text-left bg-slate-950 text-white p-4 rounded-2xl border transition-all cursor-pointer ${
            categoryFilter === "all"
              ? "border-lime-400 ring-2 ring-lime-400/30 shadow-md"
              : "border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400">
              Jobs on Date
            </span>
            <CalendarDays className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-2xl font-black">{dayStats.total}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
            <span>Day Revenue</span>
            <span className="font-bold text-white">£{dayStats.totalRevenue.toFixed(2)}</span>
          </div>
        </button>

        {/* Completed (Green) */}
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
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{dayStats.completed}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Green Status</span>
            <span className="font-bold text-emerald-700">
              Profit: £{dayStats.completedProfit.toFixed(2)}
            </span>
          </div>
        </button>

        {/* Covered (Blue) */}
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
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Covered
            </span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700">{dayStats.covered}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Blue Status</span>
            <span className="font-semibold text-blue-700">Driver Assigned</span>
          </div>
        </button>

        {/* Uncovered (Grey) */}
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
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Uncovered
            </span>
            <AlertCircle className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-black text-slate-700">{dayStats.uncovered}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Grey Status</span>
            <span className="font-semibold text-slate-600">Needs Driver</span>
          </div>
        </button>

        {/* Canceled (Red) */}
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
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Canceled
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600">{dayStats.canceled}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Red Status</span>
            <span className="font-semibold text-rose-600">Canceled</span>
          </div>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              categoryFilter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({dayStats.total})
          </button>
          {(["completed", "covered", "uncovered", "canceled"] as CalendarJobCategory[]).map(
            (catKey) => {
              const meta = CALENDAR_CATEGORY_META[catKey]
              const count = dayStats[catKey]
              const isSelected = categoryFilter === catKey
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() =>
                    setCategoryFilter((prev) => (prev === catKey ? "all" : catKey))
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    isSelected
                      ? `${meta.barBg} text-white border-transparent`
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : meta.dotBg}`}
                  />
                  <span>
                    {meta.label} ({count})
                  </span>
                </button>
              )
            }
          )}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter jobs on this date..."
            className="h-9 pl-8 pr-8 text-xs rounded-xl border-slate-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Jobs List for this Date */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
            <CalendarDays className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No jobs found for this date
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {dateBookings.length > 0
              ? "No jobs match your current status or search filter on this date."
              : `There are no scheduled bookings on ${formatFullDateHeadingUK(normalizedTargetDate)}.`}
          </p>
          <div className="pt-2">
            <Link href={`/admin/calendar?month=${monthParam}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-xl border-slate-200"
              >
                ← Return to Month Calendar
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => {
            const cat = getBookingCalendarCategory(job)
            const meta = CALENDAR_CATEGORY_META[cat]
            const shortId = (job.id || "").slice(0, 6).toUpperCase()
            const timeLabel = (job.time || "").slice(0, 5) || "TBA"
            const passengerName =
              [job.first_name, job.last_name].filter(Boolean).join(" ").trim() || "Guest Passenger"
            const fare = Number(job.final_amount ?? job.total_amount ?? 0)
            const driverPrice = Number(job.driver_price ?? 0)
            const vehicleName =
              job.vehicle?.name || job.vehicle?.type || job.vehicle_type || "Standard Vehicle"
            let viaStops: string[] = []
            if (job.stops) {
              const rawStops = Array.isArray(job.stops)
                ? job.stops
                : typeof job.stops === "object" && Array.isArray((job.stops as any).locations)
                ? (job.stops as any).locations
                : []
              viaStops = rawStops
                .map((item: any) =>
                  typeof item === "string"
                    ? item.trim()
                    : String(item?.address || item?.location || item?.name || "").trim()
                )
                .filter((s: string) => s.length > 0)
            }

            return (
              <div
                key={job.id}
                onClick={() => router.push(`/admin/bookings/${job.id}`)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-400 shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col lg:flex-row relative"
              >
                {/* Left Colored Status Bar matching Calendar Line */}
                <div className={`w-full lg:w-2.5 h-2 lg:h-auto shrink-0 ${meta.stripeBg}`} />

                <div className="flex-1 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Column 1: Time, ID, Status Badge & Supplier */}
                  <div className="flex sm:items-center gap-4 lg:w-60 shrink-0">
                    <div className="bg-slate-950 text-white rounded-xl px-3 py-2.5 text-center min-w-[76px] shrink-0">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-lime-400">
                        <Clock className="w-3 h-3" />
                        <span>Pickup</span>
                      </div>
                      <p className="text-base font-black tracking-tight mt-0.5">{timeLabel}</p>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-black text-slate-900">
                          #{shortId}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dotBg}`} />
                          {meta.label}
                        </span>
                      </div>

                      {job.supplier?.name ? (
                        <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 truncate">
                          <Building2 className="w-3 h-3 shrink-0" />
                          <span className="truncate">{job.supplier.name}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400 block">
                          Direct Website Booking
                        </span>
                      )}

                      {job.supplier_reference && (
                        <span className="inline-block text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                          Ref: {job.supplier_reference}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Route Details (Pickup -> Via -> Drop-off) */}
                  <div className="flex-1 min-w-0 space-y-1.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-lime-500 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Pickup Location
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {formatLocation(job.pickup_location || "N/A")}
                        </p>
                      </div>
                    </div>

                    {viaStops.map((stop, idx) => (
                      <div key={idx} className="flex items-start gap-2 pl-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                            Via Stop {viaStops.length > 1 ? idx + 1 : ""}
                          </span>
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {formatLocation(stop)}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Drop-off Destination
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {formatLocation(job.drop_off_location || "N/A")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Passenger, Vehicle & Flight */}
                  <div className="lg:w-56 shrink-0 space-y-1.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{passengerName}</span>
                    </div>
                    {job.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{job.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Car className="w-3.5 h-3.5 text-lime-600 shrink-0" />
                      <span className="truncate">{vehicleName}</span>
                    </div>
                    {job.flight_no && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200">
                        <Plane className="w-3 h-3" />
                        <span>{job.flight_no}</span>
                      </div>
                    )}
                  </div>

                  {/* Column 4: Driver Allocation, Fare & Action */}
                  <div className="lg:w-60 shrink-0 flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-4">
                    <div className="lg:text-right">
                      {job.driver?.name ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[140px]">{job.driver.name}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-300 text-xs font-bold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Uncovered (No Driver)</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 lg:mt-1">
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900 block">
                          £{fare.toFixed(2)}
                        </span>
                        {driverPrice > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-700 block">
                            Driver: £{driverPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-bold bg-slate-900 hover:bg-lime-400 text-white hover:text-slate-950 rounded-xl transition cursor-pointer"
                      >
                        Details
                        <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
