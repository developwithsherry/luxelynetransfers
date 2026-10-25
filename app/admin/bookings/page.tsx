"use client"

import { useState, useMemo } from "react"
import { usePendingBookings } from "./action-client"
import BookingsHeader from "@/components/admin/booking/booking-header"
import BookingsFilters, {
  FilterState,
  INITIAL_FILTERS,
} from "@/components/admin/booking/booking-filters"
import BookingsTable from "@/components/admin/booking/bookings-table"
import { DispatchStats } from "@/components/admin/booking/dispatch-stats"
import { useVisibleColumns } from "@/components/admin/booking/column-visibility-toggle"
import { Booking } from "@/types/booking"

export const dynamic = "force-dynamic"

export default function BookingsPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const { visibleColumns, toggleColumn, resetColumns } = useVisibleColumns()

  const { pendingBookings, isLoading, isError, mutate } = usePendingBookings()

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], [])

  // Calculate Dispatch KPI Stats from all bookings
  const stats = useMemo(() => {
    const list = pendingBookings || []
    const totalBookings = list.length

    let upcomingCount = 0
    let pastCount = 0
    let notAssignedCount = 0
    let totalRevenue = 0

    list.forEach((b) => {
      const isCancelled = (b.status || "").toLowerCase() === "cancelled"
      const dateStr = b.date || ""

      if (!isCancelled) {
        // Revenue (customer price + addons or total_amount)
        const amt = Number(b.final_amount ?? b.total_amount ?? 0)
        totalRevenue += isNaN(amt) ? 0 : amt

        // Driver allocation
        if (!b.driver_id) {
          notAssignedCount++
        }

        // Timeframe
        if (dateStr >= todayStr) {
          upcomingCount++
        } else {
          pastCount++
        }
      } else {
        if (dateStr < todayStr) {
          pastCount++
        }
      }
    })

    return {
      totalBookings,
      upcomingCount,
      pastCount,
      notAssignedCount,
      totalRevenue,
    }
  }, [pendingBookings, todayStr])

  // Filter and sort bookings based on current dispatch filters
  const filteredBookings = useMemo(() => {
    if (!pendingBookings) return []

    let filtered = [...pendingBookings]

    // 1. Search Query (ID, customer name, email, phone, location, flight, supplier ref)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim()
      filtered = filtered.filter((b) => {
        const customerName = `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase()
        const bookingId = (b.id || "").toLowerCase()
        const phone = (b.phone || "").toLowerCase()
        const email = (b.email || "").toLowerCase()
        const pickup = (b.pickup_location || "").toLowerCase()
        const dropoff = (b.drop_off_location || "").toLowerCase()
        const supplierRef = (b.supplier_reference || "").toLowerCase()
        const flight = (b.flight_no || "").toLowerCase()
        const driverName = (b.driver?.name || "").toLowerCase()

        return (
          customerName.includes(query) ||
          bookingId.includes(query) ||
          phone.includes(query) ||
          email.includes(query) ||
          pickup.includes(query) ||
          dropoff.includes(query) ||
          supplierRef.includes(query) ||
          flight.includes(query) ||
          driverName.includes(query)
        )
      })
    }

    // 2. Status Filter
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (b) => (b.status || "").toLowerCase() === filters.status.toLowerCase()
      )
    }

    // 3. Timeframe Filter (Upcoming / Past)
    if (filters.timeframe === "upcoming") {
      filtered = filtered.filter((b) => (b.date || "") >= todayStr)
    } else if (filters.timeframe === "past") {
      filtered = filtered.filter((b) => (b.date || "") < todayStr)
    }

    // 4. Driver Assignment Filter
    if (filters.driverAssignment === "unassigned") {
      filtered = filtered.filter((b) => !b.driver_id)
    } else if (filters.driverAssignment === "assigned") {
      filtered = filtered.filter((b) => Boolean(b.driver_id))
    }

    // 5. Payment Status Filter
    if (filters.paymentStatus === "paid") {
      filtered = filtered.filter((b) => {
        const p = (b.payment_status || "").toLowerCase()
        return p === "paid" || p === "completed" || p === "paid_to_driver"
      })
    } else if (filters.paymentStatus === "pending") {
      filtered = filtered.filter((b) => {
        const p = (b.payment_status || "").toLowerCase()
        return p === "pending" || !p
      })
    } else if (filters.paymentStatus === "paid_to_driver") {
      filtered = filtered.filter(
        (b) => (b.payment_status || "").toLowerCase() === "paid_to_driver"
      )
    } else if (filters.paymentStatus === "unpaid_to_driver") {
      filtered = filtered.filter(
        (b) =>
          Boolean(b.driver_id) &&
          (b.payment_status || "").toLowerCase() !== "paid_to_driver"
      )
    }

    // 6. Source Filter (Website vs Offline/Supplier)
    if (filters.source === "website") {
      filtered = filtered.filter(
        (b) => !b.supplier_id && (b.source || "").toLowerCase() !== "offline"
      )
    } else if (filters.source === "offline") {
      filtered = filtered.filter(
        (b) => Boolean(b.supplier_id) || (b.source || "").toLowerCase() === "offline"
      )
    }

    // 7. Date Range: From Date
    if (filters.fromDate) {
      filtered = filtered.filter((b) => (b.date || "") >= filters.fromDate)
    }

    // 8. Date Range: To Date
    if (filters.toDate) {
      filtered = filtered.filter((b) => (b.date || "") <= filters.toDate)
    }

    // 9. Sort Order
    filtered.sort((a, b) => {
      const dateStrA = `${a.date || "1970-01-01"} ${a.time || "00:00"}`
      const dateStrB = `${b.date || "1970-01-01"} ${b.time || "00:00"}`
      const dateA = new Date(dateStrA).getTime()
      const dateB = new Date(dateStrB).getTime()

      if (filters.sortOrder === "newest") {
        return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA)
      } else {
        return (isNaN(dateA) ? 0 : dateA) - (isNaN(dateB) ? 0 : dateB)
      }
    })

    return filtered
  }, [pendingBookings, filters, todayStr])

  // Has any active filter that alters the dataset from default
  const hasActiveFilters = Boolean(
    filters.search.trim() ||
      filters.status !== "all" ||
      filters.paymentStatus !== "all" ||
      filters.driverAssignment !== "all" ||
      filters.timeframe !== "all" ||
      filters.source !== "all" ||
      filters.fromDate ||
      filters.toDate
  )

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetAllFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  // Interactive Quick Filter from Stats Cards
  const handleStatCardClick = (cardKey: string) => {
    if (cardKey === "all") {
      setFilters(INITIAL_FILTERS)
    } else if (cardKey === "upcoming") {
      setFilters((prev) => ({
        ...prev,
        timeframe: prev.timeframe === "upcoming" ? "all" : "upcoming",
        driverAssignment: "all",
      }))
    } else if (cardKey === "past") {
      setFilters((prev) => ({
        ...prev,
        timeframe: prev.timeframe === "past" ? "all" : "past",
        driverAssignment: "all",
      }))
    } else if (cardKey === "not_assigned") {
      setFilters((prev) => ({
        ...prev,
        driverAssignment:
          prev.driverAssignment === "unassigned" ? "all" : "unassigned",
      }))
    }
  }

  const activeStatCard = useMemo(() => {
    if (filters.driverAssignment === "unassigned") return "not_assigned"
    if (filters.timeframe === "upcoming") return "upcoming"
    if (filters.timeframe === "past") return "past"
    if (!hasActiveFilters) return "all"
    return null
  }, [filters, hasActiveFilters])

  const refreshBookings = () => {
    mutate()
  }

  const onBookingCreated = (booking: Booking) => {
    mutate()
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <BookingsHeader />

      {/* Dispatch KPI Stats */}
      <DispatchStats
        totalBookings={stats.totalBookings}
        upcomingCount={stats.upcomingCount}
        pastCount={stats.pastCount}
        notAssignedCount={stats.notAssignedCount}
        totalRevenue={stats.totalRevenue}
        activeCard={activeStatCard}
        onCardClick={handleStatCardClick}
      />

      {/* Filters Toolbar with Column Checklist */}
      <BookingsFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onResetFilters={resetAllFilters}
        onRefresh={refreshBookings}
        totalBookings={pendingBookings?.length || 0}
        filteredCount={filteredBookings.length}
        onBookingCreated={onBookingCreated}
        visibleColumns={visibleColumns}
        toggleColumn={toggleColumn}
        resetColumns={resetColumns}
      />

      {/* Bookings Table */}
      <BookingsTable
        bookings={filteredBookings}
        isLoading={isLoading}
        isError={isError}
        hasFilters={hasActiveFilters}
        onBookingDeleted={refreshBookings}
        visibleColumns={visibleColumns}
      />
    </div>
  )
}
