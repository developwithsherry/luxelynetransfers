"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Briefcase,
  Phone,
  MessageSquare,
  Loader2,
  ExternalLink,
  X,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react"
import Link from "next/link"
import type { Driver } from "@/types/driver"
import type { Booking } from "@/types/booking"
import { getDriverJobs } from "@/app/admin/bookings/action"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"

interface DriverJobsDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  driver: Driver | null
}

export function DriverJobsDialog({ open, setOpen, driver }: DriverJobsDialogProps) {
  const [jobs, setJobs] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all")
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all")

  useEffect(() => {
    if (open && driver?.id) {
      loadJobs(driver.id)
      setSearchQuery("")
      setFromDate("")
      setToDate("")
      setPaymentFilter("all")
      setActiveTab("all")
    }
  }, [open, driver?.id])

  const loadJobs = async (driverId: string) => {
    setLoading(true)
    try {
      const res = await getDriverJobs(driverId)
      if (res.data) {
        setJobs(res.data)
      }
    } catch (err) {
      console.error("Failed to load driver jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on search query, date range, and payment filter
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Date range filtering
      if (fromDate && job.date) {
        if (job.date < fromDate) return false
      }
      if (toDate && job.date) {
        if (job.date > toDate) return false
      }

      // Payment Status filtering
      const pStatus = (job.payment_status || "").toLowerCase()
      const isPaidToDriver = pStatus === "paid_to_driver"
      if (paymentFilter === "paid" && !isPaidToDriver) return false
      if (paymentFilter === "unpaid" && isPaidToDriver) return false

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const customer = `${job.first_name || ""} ${job.last_name || ""}`.toLowerCase()
        const bookingId = (job.id || "").toLowerCase()
        const pickup = (job.pickup_location || "").toLowerCase()
        const dropoff = (job.drop_off_location || "").toLowerCase()
        const ref = (job.supplier_reference || "").toLowerCase()
        const flight = (job.flight_no || "").toLowerCase()

        const matches =
          customer.includes(q) ||
          bookingId.includes(q) ||
          pickup.includes(q) ||
          dropoff.includes(q) ||
          ref.includes(q) ||
          flight.includes(q)

        if (!matches) return false
      }

      return true
    })
  }, [jobs, searchQuery, fromDate, toDate, paymentFilter])

  // Split into upcoming and past
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])

  const upcomingJobs = useMemo(() => {
    return filteredJobs.filter((job) => (job.date || "") >= todayStr)
  }, [filteredJobs, todayStr])

  const pastJobs = useMemo(() => {
    return filteredJobs.filter((job) => (job.date || "") < todayStr)
  }, [filteredJobs, todayStr])

  const currentTabJobs = useMemo(() => {
    if (activeTab === "upcoming") return upcomingJobs
    if (activeTab === "past") return pastJobs
    return filteredJobs
  }, [activeTab, upcomingJobs, pastJobs, filteredJobs])

  // Earnings calculations
  const stats = useMemo(() => {
    let totalEarnings = 0
    let paidEarnings = 0
    let unpaidEarnings = 0
    let paidCount = 0
    let unpaidCount = 0

    filteredJobs.forEach((job) => {
      const price = Number(job.driver_price || 0)
      const pStatus = (job.payment_status || "").toLowerCase()
      totalEarnings += price

      if (pStatus === "paid_to_driver") {
        paidEarnings += price
        paidCount++
      } else {
        unpaidEarnings += price
        unpaidCount++
      }
    })

    return {
      totalEarnings,
      paidEarnings,
      unpaidEarnings,
      paidCount,
      unpaidCount,
    }
  }, [filteredJobs])

  const clearFilters = () => {
    setSearchQuery("")
    setFromDate("")
    setToDate("")
    setPaymentFilter("all")
  }

  const hasActiveFilters = Boolean(
    searchQuery || fromDate || toDate || paymentFilter !== "all"
  )

  // WhatsApp link
  const cleanPhone = driver?.phone ? driver.phone.replace(/[^0-9]/g, "") : ""
  const formattedPhone = cleanPhone.startsWith("0") ? `44${cleanPhone.slice(1)}` : cleanPhone
  const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : null

  const getJobStatusBadge = (status?: string | null) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "bg-lime-500 text-white"
      case "covered":
        return "bg-blue-600 text-white"
      case "pob":
        return "bg-amber-500 text-white"
      case "completed":
        return "bg-emerald-600 text-white"
      case "complaint":
        return "bg-rose-600 text-white"
      case "cancelled":
        return "bg-gray-800 text-white"
      default:
        return "bg-lime-400 text-slate-950"
    }
  }

  if (!driver) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {driver.photo_url ? (
                <img
                  src={driver.photo_url}
                  alt={driver.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-lime-400 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-lime-400 text-slate-950 font-bold text-xl flex items-center justify-center shrink-0">
                  {driver.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{driver.name}</h2>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      driver.is_active !== false
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-gray-500/20 text-gray-300 border border-gray-500/40"
                    }`}
                  >
                    {driver.is_active !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-lime-400" />
                    {driver.phone}
                  </span>
                  {driver.area_operates && (
                    <span className="text-gray-400">• Operates: {driver.area_operates}</span>
                  )}
                  {driver.vehicle_reg && (
                    <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px]">
                      {driver.vehicle_reg}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition self-start sm:self-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Driver
              </a>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats Cards with Paid vs Unpaid breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-lime-50 border border-lime-200 rounded-xl p-3.5">
              <span className="text-xs text-lime-800 font-semibold block">Total Earnings</span>
              <span className="text-2xl font-black text-lime-950 mt-1 block">
                £{stats.totalEarnings.toFixed(2)}
              </span>
              <span className="text-[10px] text-lime-700">{filteredJobs.length} assigned jobs</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Paid to Driver
              </span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">
                £{stats.paidEarnings.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-700">{stats.paidCount} paid jobs</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
              <span className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                Unpaid / Pending
              </span>
              <span className="text-2xl font-black text-amber-950 mt-1 block">
                £{stats.unpaidEarnings.toFixed(2)}
              </span>
              <span className="text-[10px] text-amber-700">{stats.unpaidCount} unpaid jobs</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <span className="text-xs text-blue-800 font-semibold block">Schedule</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-blue-950">{upcomingJobs.length}</span>
                <span className="text-xs text-blue-700 font-medium">upcom.</span>
                <span className="text-slate-300">/</span>
                <span className="text-xl font-black text-purple-950">{pastJobs.length}</span>
                <span className="text-xs text-purple-700 font-medium">past</span>
              </div>
              <span className="text-[10px] text-slate-500">Upcoming / Past</span>
            </div>
          </div>

          {/* Filters Bar: Search, Date Range, & Driver Payment Filter */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by ID, customer, route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs bg-white h-9"
                />
              </div>

              {/* Driver Payment Filter: All / Paid / Unpaid */}
              <div className="md:col-span-3">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as "all" | "paid" | "unpaid")}
                  className="w-full h-9 border border-gray-300 bg-white rounded-md px-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-lime-400"
                >
                  <option value="all">All Driver Payments</option>
                  <option value="paid">✓ Paid to Driver</option>
                  <option value="unpaid">⏳ Not Paid to Driver (Unpaid)</option>
                </select>
              </div>

              {/* From Date */}
              <div className="md:col-span-2 flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium shrink-0">From:</span>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="text-xs bg-white h-9"
                />
              </div>

              {/* To Date */}
              <div className="md:col-span-2 flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium shrink-0">To:</span>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="text-xs bg-white h-9"
                />
              </div>

              {/* Clear */}
              <div className="md:col-span-1 flex justify-end">
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-9 px-2 text-xs text-gray-500 hover:text-red-600"
                    title="Clear filters"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs: All / Upcoming / Past */}
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
            <div className="flex items-center justify-between border-b pb-2">
              <TabsList className="bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="all" className="text-xs font-semibold px-3 py-1.5">
                  All Jobs ({filteredJobs.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="text-xs font-semibold px-3 py-1.5">
                  Upcoming ({upcomingJobs.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-xs font-semibold px-3 py-1.5">
                  Past ({pastJobs.length})
                </TabsTrigger>
              </TabsList>

              <span className="text-xs text-gray-500">
                Filtered Driver Pay: <strong className="text-slate-900">£{stats.totalEarnings.toFixed(2)}</strong>
              </span>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-lime-600" />
                  Loading driver jobs and earnings...
                </div>
              ) : currentTabJobs.length > 0 ? (
                <div className="space-y-3">
                  {currentTabJobs.map((job) => {
                    const customerName =
                      `${job.first_name || ""} ${job.last_name || ""}`.trim() || "Customer"
                    const isPaidToDriver =
                      (job.payment_status || "").toLowerCase() === "paid_to_driver"

                    return (
                      <div
                        key={job.id}
                        className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-lime-400 hover:shadow-sm transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-xs text-gray-900">
                              #{job.id?.slice(0, 5).toUpperCase()}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getJobStatusBadge(
                                job.status
                              )}`}
                            >
                              {job.status}
                            </span>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                                isPaidToDriver
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {isPaidToDriver ? "✓ Paid to Driver" : "⏳ Unpaid to Driver"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-emerald-700">
                              Driver Pay: £{Number(job.driver_price || 0).toFixed(2)}
                            </span>
                            <Link
                              href={`/admin/bookings/${job.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-lime-700 hover:text-lime-900"
                            >
                              Details <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                          <div>
                            <span className="text-gray-400 text-[10px] block">Customer</span>
                            <span className="font-semibold text-gray-900">{customerName}</span>
                            {job.phone && <span className="text-gray-500 text-[11px] block">{job.phone}</span>}
                          </div>

                          <div>
                            <span className="text-gray-400 text-[10px] block">Date & Time</span>
                            <span className="font-medium text-gray-800">
                              {job.date ? formatDateUK(job.date) : "N/A"} at {job.time || ""}
                            </span>
                            {job.flight_no && (
                              <span className="text-[11px] text-sky-700 block">
                                Flight: {job.flight_no}
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-gray-400 text-[10px] block">Journey Route</span>
                            <div className="truncate text-gray-800" title={job.pickup_location}>
                              From: {formatLocation(job.pickup_location)}
                            </div>
                            <div className="truncate text-gray-600 text-[11px]" title={job.drop_off_location}>
                              To: {formatLocation(job.drop_off_location)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-gray-400 space-y-1">
                  <Briefcase className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p className="font-medium text-gray-600">No jobs found for this driver</p>
                  <p>
                    {hasActiveFilters
                      ? "Try adjusting your search query, payment filter, or date range."
                      : "When you assign jobs to this driver, they will appear here along with calculated earnings."}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
