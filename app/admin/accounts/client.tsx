"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  PoundSterling,
  Download,
  Printer,
  Filter,
  RotateCcw,
  Search,
  Building2,
  Users,
  Globe,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Receipt,
  FileSpreadsheet,
  Truck,
  ExternalLink,
  Layers,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Booking } from "@/types/booking"
import type { Supplier } from "@/types/supplier"
import type { Driver } from "@/types/driver"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"
import { QuickStatusPopover } from "@/components/admin/booking/quick-status-popover"

interface Props {
  initialBookings: Booking[]
  suppliers: Supplier[]
  drivers: Driver[]
  vehicles: any[]
}

type DatePreset =
  | "all"
  | "today"
  | "yesterday"
  | "this_week"
  | "this_month"
  | "last_month"
  | "last_30_days"
  | "this_quarter"
  | "this_year"
  | "custom"

type ActiveReportTab = "overview" | "suppliers" | "drivers" | "ledger"
type ChartGranularity = "monthly" | "weekly" | "daily"

function toLocalYMD(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
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
  return toLocalYMD(d)
}

function formatCurrency(val: number): string {
  const abs = Math.abs(val)
  const formatted = abs.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return val < 0 ? `-£${formatted}` : `£${formatted}`
}

export default function AccountsAndReportsClient({
  initialBookings,
  suppliers,
  drivers,
  vehicles,
}: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)

  useEffect(() => {
    setBookings(initialBookings)
  }, [initialBookings])

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<ActiveReportTab>("overview")
  const [chartGranularity, setChartGranularity] = useState<ChartGranularity>("monthly")

  // Filters State
  const [datePreset, setDatePreset] = useState<DatePreset>("all")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [supplierFilter, setSupplierFilter] = useState<string>("all")
  const [driverFilter, setDriverFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("active_only")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [profitFilter, setProfitFilter] = useState<string>("all")
  const [vehicleFilter, setVehicleFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Handle Date Presets
  const applyDatePreset = (preset: DatePreset) => {
    setDatePreset(preset)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (preset === "all") {
      setFromDate("")
      setToDate("")
    } else if (preset === "today") {
      const ymd = toLocalYMD(today)
      setFromDate(ymd)
      setToDate(ymd)
    } else if (preset === "yesterday") {
      const yest = new Date(today)
      yest.setDate(today.getDate() - 1)
      const ymd = toLocalYMD(yest)
      setFromDate(ymd)
      setToDate(ymd)
    } else if (preset === "this_week") {
      const dayOfWeek = today.getDay() // 0 Sun .. 6 Sat
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(today)
      monday.setDate(today.getDate() + diffToMonday)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      setFromDate(toLocalYMD(monday))
      setToDate(toLocalYMD(sunday))
    } else if (preset === "this_month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      setFromDate(toLocalYMD(start))
      setToDate(toLocalYMD(end))
    } else if (preset === "last_month") {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = new Date(today.getFullYear(), today.getMonth(), 0)
      setFromDate(toLocalYMD(start))
      setToDate(toLocalYMD(end))
    } else if (preset === "last_30_days") {
      const start = new Date(today)
      start.setDate(today.getDate() - 30)
      setFromDate(toLocalYMD(start))
      setToDate(toLocalYMD(today))
    } else if (preset === "this_quarter") {
      const quarterMonth = Math.floor(today.getMonth() / 3) * 3
      const start = new Date(today.getFullYear(), quarterMonth, 1)
      const end = new Date(today.getFullYear(), quarterMonth + 3, 0)
      setFromDate(toLocalYMD(start))
      setToDate(toLocalYMD(end))
    } else if (preset === "this_year") {
      const start = new Date(today.getFullYear(), 0, 1)
      const end = new Date(today.getFullYear(), 11, 31)
      setFromDate(toLocalYMD(start))
      setToDate(toLocalYMD(end))
    }
  }

  const resetAllFilters = () => {
    setDatePreset("all")
    setFromDate("")
    setToDate("")
    setSupplierFilter("all")
    setDriverFilter("all")
    setStatusFilter("active_only")
    setPaymentFilter("all")
    setProfitFilter("all")
    setVehicleFilter("all")
    setSearchQuery("")
  }

  // Distinct vehicle options present in bookings/vehicles
  const vehicleOptions = useMemo(() => {
    const names = new Set<string>()
    vehicles.forEach((v) => {
      if (v?.name) names.add(v.name)
    })
    bookings.forEach((b) => {
      if (b.vehicle?.name) names.add(b.vehicle.name)
      else if (b.vehicle_type) names.add(b.vehicle_type)
    })
    return Array.from(names).sort()
  }, [vehicles, bookings])

  // Filtered Bookings Dataset
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const bYMD = normalizeBookingYMD(b.date)
      const statusLower = (b.status || "pending").toLowerCase()
      const paymentLower = (b.payment_status || "pending").toLowerCase()
      const grossFare = Number(b.final_amount ?? b.total_amount ?? 0)
      const driverCost = Number(b.driver_price ?? 0)
      const netProfit = grossFare - driverCost
      const isWebsite =
        !b.supplier_id && (b.source || "").toLowerCase() !== "offline"

      // 1. Date Range
      if (fromDate && bYMD < fromDate) return false
      if (toDate && bYMD > toDate) return false

      // 2. Job Status Filter
      if (statusFilter === "active_only") {
        if (statusLower === "cancelled") return false
      } else if (statusFilter !== "all") {
        if (statusLower !== statusFilter) return false
      }

      // 3. Supplier / Source Filter
      if (supplierFilter === "website") {
        if (!isWebsite) return false
      } else if (supplierFilter === "all_suppliers") {
        if (isWebsite) return false
      } else if (supplierFilter === "offline_direct") {
        if (isWebsite || b.supplier_id) return false
      } else if (supplierFilter !== "all") {
        if (b.supplier_id !== supplierFilter) return false
      }

      // 4. Driver Filter
      if (driverFilter === "assigned") {
        if (!b.driver_id) return false
      } else if (driverFilter === "unassigned") {
        if (b.driver_id) return false
      } else if (driverFilter !== "all") {
        if (b.driver_id !== driverFilter) return false
      }

      // 5. Payment & Settlement Filter
      if (paymentFilter === "customer_paid") {
        if (
          paymentLower !== "paid" &&
          paymentLower !== "completed" &&
          paymentLower !== "paid_to_driver"
        )
          return false
      } else if (paymentFilter === "customer_pending") {
        if (paymentLower !== "pending" && paymentLower !== "") return false
      } else if (paymentFilter === "driver_paid") {
        if (paymentLower !== "paid_to_driver") return false
      } else if (paymentFilter === "driver_unpaid") {
        if (!b.driver_id || paymentLower === "paid_to_driver") return false
      }

      // 6. Profitability Filter
      if (profitFilter === "profitable") {
        if (netProfit <= 0) return false
      } else if (profitFilter === "breakeven") {
        if (Math.abs(netProfit) > 0.009) return false
      } else if (profitFilter === "loss") {
        if (netProfit >= 0) return false
      }

      // 7. Vehicle Filter
      if (vehicleFilter !== "all") {
        const vName = b.vehicle?.name || b.vehicle_type || ""
        if (vName !== vehicleFilter) return false
      }

      // 8. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const shortId = b.id ? b.id.slice(0, 5).toLowerCase() : ""
        const haystack = [
          b.id || "",
          shortId,
          `#${shortId}`,
          b.supplier_reference || "",
          b.supplier?.name || "",
          b.first_name || "",
          b.last_name || "",
          `${b.first_name || ""} ${b.last_name || ""}`,
          b.phone || "",
          b.email || "",
          b.pickup_location || "",
          b.drop_off_location || "",
          b.driver?.name || "",
          b.vehicle?.name || "",
          b.flight_no || "",
        ]
          .join(" ")
          .toLowerCase()

        if (!haystack.includes(q)) return false
      }

      return true
    })
  }, [
    bookings,
    fromDate,
    toDate,
    statusFilter,
    supplierFilter,
    driverFilter,
    paymentFilter,
    profitFilter,
    vehicleFilter,
    searchQuery,
  ])

  // Core Financial & Audit Metrics on Filtered Dataset
  const auditMetrics = useMemo(() => {
    let grossRevenue = 0
    let baseFareRevenue = 0
    let addonsRevenue = 0
    let totalDriverCost = 0
    let paidToDriverAmount = 0
    let unpaidDriverLiability = 0
    let customerPaidRevenue = 0
    let customerPendingRevenue = 0
    let cancelledRevenueLost = 0
    let cancelledCount = 0

    let profitableJobsCount = 0
    let lossJobsCount = 0
    let breakEvenJobsCount = 0
    let totalLossAmount = 0
    let assignedCount = 0
    let unassignedCount = 0
    let completedJobsCount = 0

    filteredBookings.forEach((b) => {
      const statusLower = (b.status || "pending").toLowerCase()
      const paymentLower = (b.payment_status || "pending").toLowerCase()
      const isCancelled = statusLower === "cancelled"

      const finalAmt = Number(b.final_amount ?? b.total_amount ?? 0)
      const baseAmt = Number(b.total_amount ?? finalAmt)
      const addonAmt = Math.max(0, finalAmt - baseAmt)
      const dCost = Number(b.driver_price ?? 0)

      if (isCancelled) {
        cancelledCount++
        cancelledRevenueLost += finalAmt
        return
      }

      grossRevenue += finalAmt
      baseFareRevenue += baseAmt
      addonsRevenue += addonAmt
      totalDriverCost += dCost

      const profit = finalAmt - dCost
      if (profit > 0.009) {
        profitableJobsCount++
      } else if (profit < -0.009) {
        lossJobsCount++
        totalLossAmount += Math.abs(profit)
      } else {
        breakEvenJobsCount++
      }

      if (b.driver_id) {
        assignedCount++
        if (paymentLower === "paid_to_driver") {
          paidToDriverAmount += dCost
        } else {
          unpaidDriverLiability += dCost
        }
      } else {
        unassignedCount++
      }

      if (
        paymentLower === "paid" ||
        paymentLower === "completed" ||
        paymentLower === "paid_to_driver"
      ) {
        customerPaidRevenue += finalAmt
      } else {
        customerPendingRevenue += finalAmt
      }

      if (statusLower === "completed") {
        completedJobsCount++
      }
    })

    const activeJobsCount = filteredBookings.length - cancelledCount
    const netProfit = grossRevenue - totalDriverCost
    const profitMarginPct =
      grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0
    const avgRevenuePerJob =
      activeJobsCount > 0 ? grossRevenue / activeJobsCount : 0
    const avgProfitPerJob =
      activeJobsCount > 0 ? netProfit / activeJobsCount : 0

    return {
      totalJobs: filteredBookings.length,
      activeJobsCount,
      cancelledCount,
      cancelledRevenueLost,
      completedJobsCount,
      assignedCount,
      unassignedCount,
      grossRevenue,
      baseFareRevenue,
      addonsRevenue,
      totalDriverCost,
      paidToDriverAmount,
      unpaidDriverLiability,
      customerPaidRevenue,
      customerPendingRevenue,
      netProfit,
      profitMarginPct,
      avgRevenuePerJob,
      avgProfitPerJob,
      profitableJobsCount,
      lossJobsCount,
      breakEvenJobsCount,
      totalLossAmount,
    }
  }, [filteredBookings])

  // Time-Series Trend Data (Monthly / Weekly / Daily)
  const timeSeriesData = useMemo(() => {
    const buckets = new Map<
      string,
      {
        key: string
        label: string
        revenue: number
        driverCost: number
        profit: number
        jobs: number
      }
    >()

    const activeList = filteredBookings.filter(
      (b) => (b.status || "").toLowerCase() !== "cancelled"
    )

    activeList.forEach((b) => {
      const ymd = normalizeBookingYMD(b.date)
      if (!ymd) return
      const [y, m, d] = ymd.split("-").map(Number)
      const dt = new Date(y, m - 1, d)
      if (isNaN(dt.getTime())) return

      let key = ""
      let label = ""

      if (chartGranularity === "monthly") {
        key = `${y}-${String(m).padStart(2, "0")}`
        label = dt.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
      } else if (chartGranularity === "weekly") {
        const dayOfWeek = dt.getDay()
        const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        const mon = new Date(dt)
        mon.setDate(dt.getDate() + diffToMon)
        key = toLocalYMD(mon)
        label = `Wk ${mon.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
      } else {
        key = ymd
        label = dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      }

      const existing = buckets.get(key) || {
        key,
        label,
        revenue: 0,
        driverCost: 0,
        profit: 0,
        jobs: 0,
      }

      const rev = Number(b.final_amount ?? b.total_amount ?? 0)
      const cost = Number(b.driver_price ?? 0)
      existing.revenue += rev
      existing.driverCost += cost
      existing.profit += rev - cost
      existing.jobs += 1
      buckets.set(key, existing)
    })

    return Array.from(buckets.values()).sort((a, b) => a.key.localeCompare(b.key))
  }, [filteredBookings, chartGranularity])

  // Supplier / Source Breakdown for Audit & Charts
  const supplierBreakdown = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string
        name: string
        type: "website" | "supplier" | "offline"
        totalJobs: number
        activeJobs: number
        cancelledJobs: number
        revenue: number
        driverCost: number
        profit: number
        pendingCustomerAmount: number
      }
    >()

    // Pre-seed Website & Suppliers so all suppliers appear in the audit table
    map.set("website", {
      id: "website",
      name: "Website (Online Direct)",
      type: "website",
      totalJobs: 0,
      activeJobs: 0,
      cancelledJobs: 0,
      revenue: 0,
      driverCost: 0,
      profit: 0,
      pendingCustomerAmount: 0,
    })

    suppliers.forEach((s) => {
      if (s.id) {
        map.set(s.id, {
          id: s.id,
          name: s.name,
          type: "supplier",
          totalJobs: 0,
          activeJobs: 0,
          cancelledJobs: 0,
          revenue: 0,
          driverCost: 0,
          profit: 0,
          pendingCustomerAmount: 0,
        })
      }
    })

    filteredBookings.forEach((b) => {
      const isCancelled = (b.status || "").toLowerCase() === "cancelled"
      const isWebsite =
        !b.supplier_id && (b.source || "").toLowerCase() !== "offline"
      const key = isWebsite
        ? "website"
        : b.supplier_id
        ? b.supplier_id
        : "offline_direct"
      const label = isWebsite
        ? "Website (Online Direct)"
        : b.supplier?.name || "Offline Direct (Unlinked)"

      const row = map.get(key) || {
        id: key,
        name: label,
        type: isWebsite ? "website" : b.supplier_id ? "supplier" : "offline",
        totalJobs: 0,
        activeJobs: 0,
        cancelledJobs: 0,
        revenue: 0,
        driverCost: 0,
        profit: 0,
        pendingCustomerAmount: 0,
      }

      row.totalJobs += 1
      if (isCancelled) {
        row.cancelledJobs += 1
      } else {
        const rev = Number(b.final_amount ?? b.total_amount ?? 0)
        const cost = Number(b.driver_price ?? 0)
        const pStatus = (b.payment_status || "pending").toLowerCase()
        row.activeJobs += 1
        row.revenue += rev
        row.driverCost += cost
        row.profit += rev - cost
        if (pStatus === "pending" || !pStatus) {
          row.pendingCustomerAmount += rev
        }
      }
      map.set(key, row)
    })

    return Array.from(map.values())
      .filter((r) => r.totalJobs > 0 || r.type === "supplier")
      .sort((a, b) => b.revenue - a.revenue)
  }, [filteredBookings, suppliers])

  // Driver Payout & Profitability Audit Breakdown
  const driverBreakdown = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string
        name: string
        phone: string
        assignedJobs: number
        completedJobs: number
        grossFareGenerated: number
        totalDriverPay: number
        paidToDriver: number
        unpaidLiability: number
        companyNetProfit: number
      }
    >()

    drivers.forEach((d) => {
      if (d.id) {
        map.set(d.id, {
          id: d.id,
          name: d.name,
          phone: d.phone || "",
          assignedJobs: 0,
          completedJobs: 0,
          grossFareGenerated: 0,
          totalDriverPay: 0,
          paidToDriver: 0,
          unpaidLiability: 0,
          companyNetProfit: 0,
        })
      }
    })

    filteredBookings.forEach((b) => {
      if (!b.driver_id) return
      const isCancelled = (b.status || "").toLowerCase() === "cancelled"
      if (isCancelled) return

      const row = map.get(b.driver_id) || {
        id: b.driver_id,
        name: b.driver?.name || "Assigned Driver",
        phone: b.driver?.phone || "",
        assignedJobs: 0,
        completedJobs: 0,
        grossFareGenerated: 0,
        totalDriverPay: 0,
        paidToDriver: 0,
        unpaidLiability: 0,
        companyNetProfit: 0,
      }

      const rev = Number(b.final_amount ?? b.total_amount ?? 0)
      const cost = Number(b.driver_price ?? 0)
      const pStatus = (b.payment_status || "pending").toLowerCase()
      const jStatus = (b.status || "pending").toLowerCase()

      row.assignedJobs += 1
      if (jStatus === "completed") row.completedJobs += 1
      row.grossFareGenerated += rev
      row.totalDriverPay += cost
      if (pStatus === "paid_to_driver") {
        row.paidToDriver += cost
      } else {
        row.unpaidLiability += cost
      }
      row.companyNetProfit += rev - cost

      map.set(b.driver_id, row)
    })

    return Array.from(map.values())
      .filter((d) => d.assignedJobs > 0 || drivers.some((dr) => dr.id === d.id))
      .sort((a, b) => b.totalDriverPay - a.totalDriverPay)
  }, [filteredBookings, drivers])

  // Status & Vehicle Breakdown for Diagrams
  const statusAndVehicleStats = useMemo(() => {
    const statusMap = new Map<
      string,
      { status: string; count: number; revenue: number; profit: number }
    >()
    const vehicleMap = new Map<
      string,
      { vehicle: string; count: number; revenue: number; cost: number; profit: number }
    >()

    filteredBookings.forEach((b) => {
      const s = (b.status || "pending").toLowerCase()
      const rev = Number(b.final_amount ?? b.total_amount ?? 0)
      const cost = Number(b.driver_price ?? 0)
      const prof = s === "cancelled" ? 0 : rev - cost

      const sRow = statusMap.get(s) || { status: s, count: 0, revenue: 0, profit: 0 }
      sRow.count += 1
      sRow.revenue += rev
      sRow.profit += prof
      statusMap.set(s, sRow)

      if (s !== "cancelled") {
        const vName = b.vehicle?.name || b.vehicle_type || "Standard Transfer"
        const vRow = vehicleMap.get(vName) || {
          vehicle: vName,
          count: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        }
        vRow.count += 1
        vRow.revenue += rev
        vRow.cost += cost
        vRow.profit += prof
        vehicleMap.set(vName, vRow)
      }
    })

    return {
      byStatus: Array.from(statusMap.values()).sort((a, b) => b.revenue - a.revenue),
      byVehicle: Array.from(vehicleMap.values()).sort((a, b) => b.revenue - a.revenue),
    }
  }, [filteredBookings])

  // Export Filtered Ledger to CSV
  const handleExportCSV = () => {
    const headers = [
      "System Ref",
      "Date",
      "Time",
      "Source / Supplier",
      "Supplier Ref",
      "Customer Name",
      "Customer Phone",
      "Pickup",
      "Drop-off",
      "Vehicle",
      "Driver Name",
      "Job Status",
      "Payment Status",
      "Gross Customer Fare (GBP)",
      "Driver Cost (GBP)",
      "Net Profit / Loss (GBP)",
      "Margin (%)",
    ]

    const rows = filteredBookings.map((b) => {
      const ref = b.id ? `#${b.id.slice(0, 5).toUpperCase()}` : ""
      const isWebsite =
        !b.supplier_id && (b.source || "").toLowerCase() !== "offline"
      const sourceName = isWebsite
        ? "Website"
        : b.supplier?.name || "Offline Direct"
      const customer = `${b.first_name || ""} ${b.last_name || ""}`.trim()
      const rev = Number(b.final_amount ?? b.total_amount ?? 0)
      const cost = Number(b.driver_price ?? 0)
      const profit = rev - cost
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : "0.0"

      return [
        ref,
        b.date || "",
        b.time || "",
        sourceName,
        b.supplier_reference || "",
        customer,
        b.phone || "",
        b.pickup_location || "",
        b.drop_off_location || "",
        b.vehicle?.name || b.vehicle_type || "",
        b.driver?.name || "Unassigned",
        b.status || "pending",
        b.payment_status || "pending",
        rev.toFixed(2),
        cost.toFixed(2),
        profit.toFixed(2),
        `${margin}%`,
      ]
    })

    const escapeCsv = (val: string) => `"${String(val).replace(/"/g, '""')}"`
    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((r) => r.map(escapeCsv).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute(
      "download",
      `luxelyne-accounts-audit-${toLocalYMD(new Date())}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const maxChartVal = useMemo(() => {
    let m = 100
    timeSeriesData.forEach((d) => {
      if (d.revenue > m) m = d.revenue
      if (d.driverCost > m) m = d.driverCost
      if (Math.abs(d.profit) > m) m = Math.abs(d.profit)
    })
    return m
  }, [timeSeriesData])

  return (
    <div className="w-full space-y-6 pb-10 print:p-0">
      {/* Top Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded bg-lime-100 text-lime-900 border border-lime-300">
              Enterprise Financial Intelligence & Audit
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-500">
              P&L, Reconciliation & Ledgers
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Accounts & Financial Reports
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Complete profit & loss audit, supplier reconciliation, driver payout liabilities, and cash flow diagrams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 px-3.5 text-xs font-bold border-slate-300 hover:bg-slate-100"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Export Audit CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-9 px-3.5 text-xs font-bold border-slate-300 hover:bg-slate-100"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Multi-Dimension Audit Filter Console */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 print:hidden">
        {/* Row 1: Quick Period Presets */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1 mr-1">
              <Calendar className="w-3.5 h-3.5 text-lime-600" />
              Audit Period:
            </span>
            {(
              [
                { id: "all", label: "All Time" },
                { id: "today", label: "Today" },
                { id: "yesterday", label: "Yesterday" },
                { id: "this_week", label: "This Week" },
                { id: "this_month", label: "This Month" },
                { id: "last_month", label: "Last Month" },
                { id: "last_30_days", label: "Last 30 Days" },
                { id: "this_quarter", label: "This Quarter" },
                { id: "this_year", label: "This Year" },
              ] as { id: DatePreset; label: string }[]
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyDatePreset(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  datePreset === p.id
                    ? "bg-slate-950 text-lime-400 shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Row 2: Granular Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Search Ref / Entity / Route
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ref #, supplier, driver, customer..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* From Date */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              From Date
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value)
                setDatePreset("custom")
              }}
              className="h-8 text-xs"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              To Date
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value)
                setDatePreset("custom")
              }}
              className="h-8 text-xs"
            />
          </div>

          {/* Source / Supplier */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Source / Supplier
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All Channels & Suppliers</option>
              <option value="website">Website Direct Only</option>
              <option value="all_suppliers">All Suppliers / Offline</option>
              <option value="offline_direct">Offline Direct (No Supplier)</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  Supplier: {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Driver */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Driver Filter
            </label>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All Drivers</option>
              <option value="assigned">Assigned Jobs Only</option>
              <option value="unassigned">Unassigned Jobs Only</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  Driver: {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment & Settlement */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Settlement State
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All Payment States</option>
              <option value="customer_paid">Customer Paid</option>
              <option value="customer_pending">Customer Pending</option>
              <option value="driver_paid">Paid to Driver (Settled)</option>
              <option value="driver_unpaid">Unpaid to Driver (Payable)</option>
            </select>
          </div>

          {/* Profit / Loss & Job Status */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              P&L / Margin Audit
            </label>
            <select
              value={profitFilter}
              onChange={(e) => setProfitFilter(e.target.value)}
              className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="all">All (Profit & Loss)</option>
              <option value="profitable">Profitable Only (+£)</option>
              <option value="breakeven">Break-Even (£0.00)</option>
              <option value="loss">Loss-Making Only (-£)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Secondary Filters (Job Status & Vehicle Class) + Active Audit Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-500">Job Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-7 rounded border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-800"
              >
                <option value="active_only">Active Jobs (Excl. Cancelled)</option>
                <option value="all">All Jobs (Incl. Cancelled)</option>
                <option value="completed">Completed Only</option>
                <option value="covered">Covered Only</option>
                <option value="confirmed">Confirmed Only</option>
                <option value="pob">POB Only</option>
                <option value="pending">Pending Only</option>
                <option value="complaint">Complaint Only</option>
                <option value="cancelled">Cancelled Only</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-500">Vehicle Class:</span>
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="h-7 rounded border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-800"
              >
                <option value="all">All Vehicles</option>
                {vehicleOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Auditing{" "}
            <strong className="text-slate-950 font-black">
              {auditMetrics.activeJobsCount}
            </strong>{" "}
            active journeys
            {auditMetrics.cancelledCount > 0 && (
              <span className="text-rose-600 ml-1">
                (+{auditMetrics.cancelledCount} cancelled)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Primary Executive P&L KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Gross Operating Revenue */}
        <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
                Gross Customer Revenue
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <PoundSterling className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {formatCurrency(auditMetrics.grossRevenue)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {auditMetrics.activeJobsCount} active bookings (Avg{" "}
              {formatCurrency(auditMetrics.avgRevenuePerJob)}/job)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Base Fares</span>
              <span className="font-bold text-slate-200">
                {formatCurrency(auditMetrics.baseFareRevenue)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Add-ons Rev</span>
              <span className="font-bold text-lime-400">
                {formatCurrency(auditMetrics.addonsRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Total Driver Cost & Payout Liability */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">
                Driver Subcontract Cost
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              {formatCurrency(auditMetrics.totalDriverCost)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {auditMetrics.assignedCount} assigned • {auditMetrics.unassignedCount} unassigned
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Settled (Paid)</span>
              <span className="font-bold text-purple-700">
                {formatCurrency(auditMetrics.paidToDriverAmount)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Payable Owed</span>
              <span className="font-bold text-amber-600">
                {formatCurrency(auditMetrics.unpaidDriverLiability)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Net Profit / Loss & Margin */}
        <div
          className={`rounded-2xl p-5 border-2 shadow-2xs flex flex-col justify-between ${
            auditMetrics.netProfit >= 0
              ? "bg-gradient-to-br from-emerald-50/90 to-lime-50/50 border-emerald-300"
              : "bg-gradient-to-br from-rose-50 to-orange-50/50 border-rose-300"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-widest ${
                  auditMetrics.netProfit >= 0 ? "text-emerald-800" : "text-rose-800"
                }`}
              >
                {auditMetrics.netProfit >= 0 ? "Net Operating Profit" : "Net Operating Loss"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-0.5 ${
                  auditMetrics.netProfit >= 0
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 text-white"
                }`}
              >
                {auditMetrics.netProfit >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {auditMetrics.profitMarginPct.toFixed(1)}% Margin
              </span>
            </div>
            <div
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                auditMetrics.netProfit >= 0 ? "text-emerald-900" : "text-rose-700"
              }`}
            >
              {formatCurrency(auditMetrics.netProfit)}
            </div>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">
              Avg {formatCurrency(auditMetrics.avgProfitPerJob)} net per journey
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-200/70 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">Profitable Jobs</span>
              <span className="font-bold text-emerald-800">
                {auditMetrics.profitableJobsCount} jobs
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Loss Jobs Audit</span>
              <span className="font-bold text-rose-600">
                {auditMetrics.lossJobsCount} ({formatCurrency(-auditMetrics.totalLossAmount)})
              </span>
            </div>
          </div>
        </div>

        {/* 4. Receivables & Cash Collection Balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
                Collection & Receivables
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              {formatCurrency(auditMetrics.customerPaidRevenue)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Collected / settled customer revenue
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Pending Collection</span>
              <span className="font-bold text-amber-600">
                {formatCurrency(auditMetrics.customerPendingRevenue)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Completed Trips</span>
              <span className="font-bold text-emerald-700">
                {auditMetrics.completedJobsCount} fulfilled
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Section Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 print:hidden">
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "overview"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-lime-600" />
            Overview & Financial Graphs
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suppliers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "suppliers"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            Supplier Reconciliation ({supplierBreakdown.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("drivers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "drivers"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            Driver Payout Audit ({driverBreakdown.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "ledger"
                ? "bg-white text-slate-950 shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            Master Audit Ledger ({filteredBookings.length})
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW, GRAPHS, DIAGRAMS & P&L STATEMENT                     */}
      {/* ===================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Graph 1: Revenue vs Driver Cost vs Net Profit Trend Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                  <BarChart3 className="w-4.5 h-4.5 text-lime-600" />
                  Revenue, Driver Cost & Net Profit/Loss Trend
                </h2>
                <p className="text-xs text-slate-500">
                  Comparative financial performance across time periods for active journeys.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Legend */}
                <div className="flex items-center gap-3 text-[11px] font-semibold mr-2">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
                    Gross Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
                    Driver Cost
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                    Net Profit
                  </span>
                </div>

                {/* Granularity Toggle */}
                <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-[11px] font-bold">
                  {(["monthly", "weekly", "daily"] as ChartGranularity[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setChartGranularity(g)}
                      className={`px-2.5 py-1 rounded-md capitalize transition ${
                        chartGranularity === g
                          ? "bg-white text-slate-950 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {timeSeriesData.length > 0 ? (
              <div className="pt-2">
                <div className="w-full overflow-x-auto pb-2">
                  <div className="min-w-[560px] h-64 flex items-end gap-4 pt-8 px-3 border-b border-slate-200 relative">
                    {/* Horizontal Reference Grid Lines */}
                    <div className="absolute inset-x-0 top-8 bottom-0 flex flex-col justify-between pointer-events-none">
                      {[1, 0.75, 0.5, 0.25, 0].map((ratio, idx) => (
                        <div
                          key={idx}
                          className="w-full border-b border-dashed border-slate-100 flex items-center"
                        >
                          <span className="text-[9px] font-mono text-slate-400 bg-white pr-1 -mt-3">
                            £{Math.round(maxChartVal * ratio)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {timeSeriesData.map((item) => {
                      const revHeight = Math.max(
                        4,
                        Math.round((item.revenue / maxChartVal) * 200)
                      )
                      const costHeight = Math.max(
                        4,
                        Math.round((item.driverCost / maxChartVal) * 200)
                      )
                      const profHeight = Math.max(
                        4,
                        Math.round((Math.abs(item.profit) / maxChartVal) * 200)
                      )
                      const isLoss = item.profit < 0

                      return (
                        <div
                          key={item.key}
                          className="flex-1 min-w-[68px] flex flex-col items-center group relative z-10"
                        >
                          {/* Hover Tooltip */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute -top-6 bg-slate-950 text-white text-[10px] rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap z-20">
                            <div className="font-bold text-lime-400 mb-0.5">
                              {item.label} ({item.jobs} jobs)
                            </div>
                            <div>Revenue: {formatCurrency(item.revenue)}</div>
                            <div>Driver Cost: {formatCurrency(item.driverCost)}</div>
                            <div
                              className={
                                isLoss
                                  ? "text-rose-400 font-bold"
                                  : "text-emerald-400 font-bold"
                              }
                            >
                              Net: {formatCurrency(item.profit)}
                            </div>
                          </div>

                          {/* 3-Bar Group */}
                          <div className="flex items-end justify-center gap-1.5 w-full h-[205px]">
                            <div
                              style={{ height: `${revHeight}px` }}
                              className="w-3.5 sm:w-4 bg-blue-600 hover:bg-blue-500 rounded-t-sm transition-all"
                              title={`Revenue: ${formatCurrency(item.revenue)}`}
                            />
                            <div
                              style={{ height: `${costHeight}px` }}
                              className="w-3.5 sm:w-4 bg-amber-500 hover:bg-amber-400 rounded-t-sm transition-all"
                              title={`Driver Cost: ${formatCurrency(item.driverCost)}`}
                            />
                            <div
                              style={{ height: `${profHeight}px` }}
                              className={`w-3.5 sm:w-4 rounded-t-sm transition-all ${
                                isLoss
                                  ? "bg-rose-600 hover:bg-rose-500"
                                  : "bg-emerald-500 hover:bg-emerald-400"
                              }`}
                              title={`Net ${isLoss ? "Loss" : "Profit"}: ${formatCurrency(
                                item.profit
                              )}`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="min-w-[560px] flex items-center gap-4 px-3 pt-2">
                    {timeSeriesData.map((item) => (
                      <div
                        key={item.key}
                        className="flex-1 min-w-[68px] text-center"
                      >
                        <span className="text-[10px] font-bold text-slate-700 block truncate">
                          {item.label}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold block ${
                            item.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {formatCurrency(item.profit)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No active bookings match the selected filter criteria to plot time-series data.
              </div>
            )}
          </div>

          {/* Row 2: Formal P&L Statement + Cash Flow Waterfall Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Formal Accounting Profit & Loss Statement (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-lime-600" />
                      Income & Profit/Loss Statement (Audit Summary)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Standardized double-check reconciliation for the selected period
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    GBP (£)
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Operating Revenue Section */}
                  <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                    1. Operating Revenue (Inflows)
                  </div>
                  <div className="flex justify-between items-center pl-3 text-slate-700">
                    <span>Base Journey Fares ({auditMetrics.activeJobsCount} active jobs)</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(auditMetrics.baseFareRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pl-3 text-slate-700">
                    <span>Ancillary Add-ons Revenue</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(auditMetrics.addonsRevenue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pl-3 pt-1.5 border-t border-slate-100 font-bold text-slate-950">
                    <span>Total Gross Operating Revenue</span>
                    <span className="font-mono text-sm text-blue-700">
                      {formatCurrency(auditMetrics.grossRevenue)}
                    </span>
                  </div>

                  {/* Direct Costs Section */}
                  <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider pt-3">
                    2. Direct Cost of Sales (Driver Subcontracting)
                  </div>
                  <div className="flex justify-between items-center pl-3 text-slate-700">
                    <span>Driver Payouts Already Settled (Paid to Driver)</span>
                    <span className="font-mono font-semibold text-purple-700">
                      {formatCurrency(auditMetrics.paidToDriverAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pl-3 text-slate-700">
                    <span>Accrued Driver Liability (Unpaid Assigned Jobs)</span>
                    <span className="font-mono font-semibold text-amber-600">
                      {formatCurrency(auditMetrics.unpaidDriverLiability)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pl-3 pt-1.5 border-t border-slate-100 font-bold text-slate-950">
                    <span>Total Direct Driver Cost</span>
                    <span className="font-mono text-sm text-amber-700">
                      ({formatCurrency(auditMetrics.totalDriverCost)})
                    </span>
                  </div>

                  {/* Net Operating Profit / Loss */}
                  <div
                    className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between ${
                      auditMetrics.netProfit >= 0
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                        : "bg-rose-50/80 border-rose-200 text-rose-950"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block">
                        3. Net Operating {auditMetrics.netProfit >= 0 ? "Profit" : "Loss"}
                      </span>
                      <span className="text-[11px] opacity-80">
                        Gross Margin: {auditMetrics.profitMarginPct.toFixed(2)}%
                      </span>
                    </div>
                    <span className="font-mono text-xl font-black">
                      {formatCurrency(auditMetrics.netProfit)}
                    </span>
                  </div>
                </div>
              </div>

              {auditMetrics.cancelledCount > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Memo: Excluded Cancelled Bookings ({auditMetrics.cancelledCount})
                  </span>
                  <span className="font-mono font-semibold text-rose-600">
                    {formatCurrency(auditMetrics.cancelledRevenueLost)}
                  </span>
                </div>
              )}
            </div>

            {/* Channel / Supplier Share Diagram & Cash Flow Pipeline (6 cols) */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-purple-600" />
                  Channel & Supplier Revenue vs. Profit Distribution
                </h3>
                <p className="text-[11px] text-slate-500">
                  Comparison of revenue contribution and net margin across booking sources
                </p>
              </div>

              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {supplierBreakdown.filter((s) => s.activeJobs > 0).length > 0 ? (
                  supplierBreakdown
                    .filter((s) => s.activeJobs > 0)
                    .map((s) => {
                      const sharePct =
                        auditMetrics.grossRevenue > 0
                          ? (s.revenue / auditMetrics.grossRevenue) * 100
                          : 0
                      const marginPct =
                        s.revenue > 0 ? (s.profit / s.revenue) * 100 : 0

                      return (
                        <div
                          key={s.id}
                          className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              {s.type === "website" ? (
                                <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              ) : (
                                <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              )}
                              <span className="font-bold text-slate-900 truncate">
                                {s.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-semibold">
                                {s.activeJobs} jobs
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold text-slate-950">
                                {formatCurrency(s.revenue)}
                              </span>
                              <span className="text-[10px] text-slate-400 ml-1">
                                ({sharePct.toFixed(1)}%)
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                            <div
                              className="bg-blue-600 h-full"
                              style={{ width: `${Math.min(100, Math.max(2, sharePct))}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Driver Cost: {formatCurrency(s.driverCost)}</span>
                            <span
                              className={`font-bold ${
                                s.profit >= 0 ? "text-emerald-700" : "text-rose-600"
                              }`}
                            >
                              Net: {formatCurrency(s.profit)} ({marginPct.toFixed(1)}% margin)
                            </span>
                          </div>
                        </div>
                      )
                    })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No active supplier or website revenue in this filter window.
                  </p>
                )}
              </div>

              {/* Fleet / Vehicle Class Breakdown Mini-Diagram */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-700" />
                  Performance by Vehicle Class
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {statusAndVehicleStats.byVehicle.slice(0, 4).map((v) => (
                    <div
                      key={v.vehicle}
                      className="p-2.5 rounded-lg border border-slate-200/80 bg-white flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">
                          {v.vehicle}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {v.count} trips • Cost {formatCurrency(v.cost)}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-950 block">
                          {formatCurrency(v.revenue)}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            v.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          Net {formatCurrency(v.profit)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: SUPPLIER AUDIT & RECONCILIATION                                */}
      {/* ===================================================================== */}
      {activeTab === "suppliers" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                <Building2 className="w-4.5 h-4.5 text-purple-600" />
                Supplier & Channel Financial Reconciliation
              </h2>
              <p className="text-xs text-slate-500">
                Audit revenue, subcontracted driver cost, net profit, and pending receivables per supplier.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-white text-[10px] uppercase tracking-wider font-bold text-left">
                  <th className="py-3 px-3 rounded-tl-lg">Channel / Supplier</th>
                  <th className="py-3 px-3 text-center">Active Jobs</th>
                  <th className="py-3 px-3 text-center">Cancelled</th>
                  <th className="py-3 px-3 text-right">Gross Revenue</th>
                  <th className="py-3 px-3 text-right">Driver Cost</th>
                  <th className="py-3 px-3 text-right">Net Profit / Loss</th>
                  <th className="py-3 px-3 text-right">Margin %</th>
                  <th className="py-3 px-3 text-right">Pending Collection</th>
                  <th className="py-3 px-3 text-right rounded-tr-lg">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supplierBreakdown.map((s) => {
                  const margin = s.revenue > 0 ? (s.profit / s.revenue) * 100 : 0
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/90 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          {s.type === "website" ? (
                            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                              <Globe className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                              <Building2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {s.activeJobs}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">
                        {s.cancelledJobs}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">
                        {formatCurrency(s.revenue)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-amber-700">
                        {formatCurrency(s.driverCost)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-extrabold ${
                          s.profit >= 0 ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {formatCurrency(s.profit)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.profit >= 0
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-amber-600 font-semibold">
                        {formatCurrency(s.pendingCustomerAmount)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSupplierFilter(s.id)
                            setActiveTab("ledger")
                          }}
                          className="h-7 text-[11px] font-semibold px-2.5"
                        >
                          Inspect Jobs →
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: DRIVER PAYOUTS & LIABILITY AUDIT                               */}
      {/* ===================================================================== */}
      {activeTab === "drivers" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-emerald-600" />
                Driver Earnings, Settled Payouts & Unpaid Liability Audit
              </h2>
              <p className="text-xs text-slate-500">
                Reconcile how much each driver has earned, how much has been paid, and how much profit their jobs generated.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-white text-[10px] uppercase tracking-wider font-bold text-left">
                  <th className="py-3 px-3 rounded-tl-lg">Driver</th>
                  <th className="py-3 px-3 text-center">Assigned Jobs</th>
                  <th className="py-3 px-3 text-center">Completed</th>
                  <th className="py-3 px-3 text-right">Customer Value</th>
                  <th className="py-3 px-3 text-right">Total Driver Pay</th>
                  <th className="py-3 px-3 text-right">Paid to Driver</th>
                  <th className="py-3 px-3 text-right">Balance Owed</th>
                  <th className="py-3 px-3 text-right">Company Profit</th>
                  <th className="py-3 px-3 text-right rounded-tr-lg">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {driverBreakdown.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/90 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{d.name}</div>
                      {d.phone && (
                        <div className="text-[10px] text-slate-400">{d.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {d.assignedJobs}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-700 font-semibold">
                      {d.completedJobs}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                      {formatCurrency(d.grossFareGenerated)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">
                      {formatCurrency(d.totalDriverPay)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-purple-700">
                      {formatCurrency(d.paidToDriver)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-600">
                      {formatCurrency(d.unpaidLiability)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-extrabold ${
                        d.companyNetProfit >= 0 ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {formatCurrency(d.companyNetProfit)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDriverFilter(d.id)
                          setActiveTab("ledger")
                        }}
                        className="h-7 text-[11px] font-semibold px-2.5"
                      >
                        Audit Ledger →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: MASTER FINANCIAL LEDGER (JOB-BY-JOB P&L AUDIT)                 */}
      {/* ===================================================================== */}
      {activeTab === "ledger" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                <FileSpreadsheet className="w-4.5 h-4.5 text-blue-600" />
                Master Financial Audit Ledger ({filteredBookings.length} Records)
              </h2>
              <p className="text-xs text-slate-500">
                Line-by-line accounting verification. Click any status badge to update booking or payment status directly.
              </p>
            </div>
          </div>

          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-white text-[10px] uppercase tracking-wider font-bold text-left">
                    <th className="py-3 px-2.5 rounded-tl-lg">Ref #</th>
                    <th className="py-3 px-2.5">Date & Time</th>
                    <th className="py-3 px-2.5">Channel / Supplier</th>
                    <th className="py-3 px-2.5">Customer</th>
                    <th className="py-3 px-2.5">Route</th>
                    <th className="py-3 px-2.5">Driver</th>
                    <th className="py-3 px-2.5 text-center">Status & Settlement</th>
                    <th className="py-3 px-2.5 text-right">Customer Fare</th>
                    <th className="py-3 px-2.5 text-right">Driver Cost</th>
                    <th className="py-3 px-2.5 text-right">Net P&L</th>
                    <th className="py-3 px-2.5 text-right rounded-tr-lg">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => {
                    const code = b.id ? b.id.slice(0, 5).toUpperCase() : "N/A"
                    const isWebsite =
                      !b.supplier_id && (b.source || "").toLowerCase() !== "offline"
                    const customer =
                      `${b.first_name || ""} ${b.last_name || ""}`.trim() || "Customer"
                    const isCancelled =
                      (b.status || "").toLowerCase() === "cancelled"
                    const rev = Number(b.final_amount ?? b.total_amount ?? 0)
                    const cost = Number(b.driver_price ?? 0)
                    const profit = isCancelled ? 0 : rev - cost
                    const margin =
                      !isCancelled && rev > 0 ? (profit / rev) * 100 : 0

                    return (
                      <tr
                        key={b.id}
                        className={`transition ${
                          isCancelled
                            ? "bg-slate-50 opacity-60"
                            : profit < 0
                            ? "bg-rose-50/40 hover:bg-rose-50/80"
                            : "hover:bg-slate-50/90"
                        }`}
                      >
                        <td className="py-2.5 px-2.5 font-mono font-bold text-lime-700 whitespace-nowrap">
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="hover:underline inline-flex items-center gap-0.5"
                          >
                            #{code}
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </Link>
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">
                            {b.date ? formatDateUK(b.date) : "N/A"}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {b.time || "N/A"}
                          </div>
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          {isWebsite ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <Globe className="w-2.5 h-2.5" />
                              Website
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                <Building2 className="w-2.5 h-2.5" />
                                {b.supplier?.name || "Offline Direct"}
                              </span>
                              {b.supplier_reference && (
                                <span className="block text-[9px] font-mono text-slate-500 mt-0.5">
                                  Ref: {b.supplier_reference}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{customer}</div>
                          {b.phone && (
                            <div className="text-[10px] text-slate-400">{b.phone}</div>
                          )}
                        </td>

                        <td className="py-2.5 px-2.5 max-w-[180px] truncate">
                          <div
                            className="font-medium text-slate-800 truncate"
                            title={b.pickup_location || ""}
                          >
                            {formatLocation(b.pickup_location)}
                          </div>
                          <div
                            className="text-[10px] text-slate-400 truncate"
                            title={b.drop_off_location || ""}
                          >
                            → {formatLocation(b.drop_off_location)}
                          </div>
                        </td>

                        <td className="py-2.5 px-2.5 whitespace-nowrap">
                          {b.driver ? (
                            <span className="font-semibold text-slate-800">
                              {b.driver.name}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Unassigned
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          <QuickStatusPopover
                            booking={b}
                            showPaymentBadge={true}
                            onSuccess={(updated) => {
                              setBookings((prev) =>
                                prev.map((item) =>
                                  item.id === b.id
                                    ? {
                                        ...item,
                                        status: updated.status,
                                        payment_status: updated.payment_status,
                                      }
                                    : item
                                )
                              )
                            }}
                          />
                        </td>

                        <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-950 whitespace-nowrap">
                          {formatCurrency(rev)}
                        </td>

                        <td className="py-2.5 px-2.5 text-right font-mono font-semibold text-amber-700 whitespace-nowrap">
                          {formatCurrency(cost)}
                        </td>

                        <td
                          className={`py-2.5 px-2.5 text-right font-mono font-extrabold whitespace-nowrap ${
                            isCancelled
                              ? "text-slate-400"
                              : profit >= 0
                              ? "text-emerald-700"
                              : "text-rose-600"
                          }`}
                        >
                          {isCancelled ? "—" : formatCurrency(profit)}
                        </td>

                        <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                          {isCancelled ? (
                            <span className="text-[10px] text-slate-400">Cancelled</span>
                          ) : (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                profit >= 0
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {margin.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>

                {/* Grand Total Audit Footer */}
                <tfoot>
                  <tr className="bg-slate-950 text-white font-bold text-xs border-t-2 border-slate-800">
                    <td colSpan={7} className="py-3.5 px-3 rounded-bl-lg">
                      AUDIT TOTALS ({auditMetrics.activeJobsCount} Active Bookings)
                    </td>
                    <td className="py-3.5 px-2.5 text-right font-mono text-blue-300">
                      {formatCurrency(auditMetrics.grossRevenue)}
                    </td>
                    <td className="py-3.5 px-2.5 text-right font-mono text-amber-300">
                      {formatCurrency(auditMetrics.totalDriverCost)}
                    </td>
                    <td
                      className={`py-3.5 px-2.5 text-right font-mono text-sm font-black ${
                        auditMetrics.netProfit >= 0
                          ? "text-lime-400"
                          : "text-rose-400"
                      }`}
                    >
                      {formatCurrency(auditMetrics.netProfit)}
                    </td>
                    <td className="py-3.5 px-2.5 text-right rounded-br-lg font-mono text-lime-400">
                      {auditMetrics.profitMarginPct.toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No bookings match your current audit filters. Click &ldquo;Reset Filters&rdquo; to view all records.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

