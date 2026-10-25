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
  Building2,
  Briefcase,
  Mail,
  User,
  Loader2,
  ExternalLink,
  X,
  CreditCard,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import type { Supplier } from "@/types/supplier"
import type { Booking } from "@/types/booking"
import { getSupplierJobs } from "@/app/admin/bookings/action"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"

interface SupplierJobsDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  supplier: Supplier | null
}

export function SupplierJobsDialog({ open, setOpen, supplier }: SupplierJobsDialogProps) {
  const [jobs, setJobs] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all")

  useEffect(() => {
    if (open && supplier?.id) {
      loadJobs(supplier.id)
      setSearchQuery("")
      setFromDate("")
      setToDate("")
      setActiveTab("all")
    }
  }, [open, supplier?.id])

  const loadJobs = async (supplierId: string) => {
    setLoading(true)
    try {
      const res = await getSupplierJobs(supplierId)
      if (res.data) {
        setJobs(res.data)
      }
    } catch (err) {
      console.error("Failed to load supplier jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  // Filter jobs based on search query and date range
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Date range filtering
      if (fromDate && job.date) {
        if (job.date < fromDate) return false
      }
      if (toDate && job.date) {
        if (job.date > toDate) return false
      }

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
  }, [jobs, searchQuery, fromDate, toDate])

  const todayStr = new Date().toISOString().split("T")[0]

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

  // Total spend/revenue from filtered jobs
  const totalRevenue = useMemo(() => {
    return filteredJobs.reduce((sum, job) => {
      return sum + Number(job.final_amount || job.total_amount || 0)
    }, 0)
  }, [filteredJobs])

  const clearFilters = () => {
    setSearchQuery("")
    setFromDate("")
    setToDate("")
  }

  const hasActiveFilters = Boolean(searchQuery || fromDate || toDate)

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

  if (!supplier) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-0">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-950 text-white p-6 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-lg">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{supplier.name}</h2>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      supplier.is_active !== false
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-gray-500/20 text-gray-300 border border-gray-500/40"
                    }`}
                  >
                    {supplier.is_active !== false ? "Active Supplier" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 mt-1">
                  {supplier.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-purple-300" />
                      {supplier.email}
                    </span>
                  )}
                  {supplier.username && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <User className="w-3.5 h-3.5" />
                      User: {supplier.username}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
              <span className="text-xs text-purple-800 font-medium block">Total Volume</span>
              <span className="text-2xl font-black text-purple-950 mt-1 block">
                £{totalRevenue.toFixed(2)}
              </span>
              <span className="text-[10px] text-purple-700">Booking value</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-xs text-slate-600 font-medium block">Total Jobs</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {filteredJobs.length}
              </span>
              <span className="text-[10px] text-slate-500">Supplied bookings</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <span className="text-xs text-blue-800 font-medium block">Upcoming</span>
              <span className="text-2xl font-black text-blue-950 mt-1 block">
                {upcomingJobs.length}
              </span>
              <span className="text-[10px] text-blue-700">Scheduled transfers</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <span className="text-xs text-emerald-800 font-medium block">Past Jobs</span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">
                {pastJobs.length}
              </span>
              <span className="text-[10px] text-emerald-700">Completed transfers</span>
            </div>
          </div>

          {/* Filters Bar: Search & Date Range */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by ID, supplier ref, customer, route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs bg-white h-9"
                />
              </div>

              {/* From Date */}
              <div className="md:col-span-3 flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium shrink-0">From:</span>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="text-xs bg-white h-9"
                />
              </div>

              {/* To Date */}
              <div className="md:col-span-3 flex items-center gap-1.5">
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
                Filtered Total: <strong>£{totalRevenue.toFixed(2)}</strong>
              </span>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="py-12 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  Loading supplier jobs...
                </div>
              ) : currentTabJobs.length > 0 ? (
                <div className="space-y-3">
                  {currentTabJobs.map((job) => {
                    const customerName =
                      `${job.first_name || ""} ${job.last_name || ""}`.trim() || "Customer"
                    return (
                      <div
                        key={job.id}
                        className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-purple-400 hover:shadow-sm transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-xs text-gray-900">
                              #{job.id?.slice(0, 5).toUpperCase()}
                            </span>
                            {job.supplier_reference && (
                              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                                Ref: {job.supplier_reference}
                              </span>
                            )}
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getJobStatusBadge(
                                job.status
                              )}`}
                            >
                              {job.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-black">
                              Amount: £{Number(job.final_amount || job.total_amount || 0).toFixed(2)}
                            </span>
                            <Link
                              href={`/admin/bookings/${job.id}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900"
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
                  <p className="font-medium text-gray-600">No jobs recorded for this supplier</p>
                  <p>
                    {hasActiveFilters
                      ? "Try adjusting your search query or date range filters."
                      : "When offline bookings are linked to this supplier, they will automatically appear here."}
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
