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

    // 1. Comprehensive Search Query: matches against all data inside the job page
    if (filters.search.trim()) {
      const rawQuery = filters.search.toLowerCase().trim()
      const terms = rawQuery.split(/\s+/).filter(Boolean)

      filtered = filtered.filter((b) => {
        // Stops (locations array or object)
        let stopsText = ""
        if (b.stops) {
          if (Array.isArray(b.stops)) {
            stopsText = b.stops.join(" ")
          } else if (Array.isArray((b.stops as any).locations)) {
            stopsText = (b.stops as any).locations.join(" ")
          } else if (typeof b.stops === "object") {
            stopsText = Object.values(b.stops)
              .filter((v) => typeof v === "string")
              .join(" ")
          } else if (typeof b.stops === "string") {
            stopsText = b.stops
          }
        }

        // Add-ons
        const addonsText = (b.addons || []).map((a) => a.name || "").join(" ")

        // Amounts
        const totalAmt = b.total_amount != null ? String(b.total_amount) : ""
        const finalAmt = b.final_amount != null ? String(b.final_amount) : ""
        const driverPrice = b.driver_price != null ? String(b.driver_price) : ""

        // Formatted booking reference (e.g. 5-character ID)
        const shortId = b.id ? b.id.slice(0, 5) : ""
        const shortId4 = b.id ? b.id.substring(0, 4) : ""

        const searchableFields = [
          // System reference and IDs
          b.id || "",
          shortId ? `#${shortId}` : "",
          shortId,
          shortId4 ? `#${shortId4}` : "",
          shortId4,

          // Supplier reference & supplier details
          b.supplier_reference || "",
          b.supplier?.name || "",
          b.supplier?.support_email || "",
          b.supplier?.phone || "",
          b.source || "",

          // Customer details
          b.first_name || "",
          b.last_name || "",
          `${b.first_name || ""} ${b.last_name || ""}`,
          b.email || "",
          b.phone || "",
          b.no_passengers ? `${b.no_passengers} passengers` : "",
          b.no_laguage ? `${b.no_laguage} luggage` : "",
          b.no_hand_laguage ? `${b.no_hand_laguage} hand luggage` : "",

          // Journey & Route
          b.pickup_location || "",
          b.drop_off_location || "",
          stopsText,
          b.date || "",
          b.time || "",
          b.return_date || "",
          b.return_time || "",
          b.with_return ? "return return trip" : "",
          b.total_distance ? `${b.total_distance} miles` : "",

          // Flight Details & Instructions
          b.flight_no || "",
          b.arriving_from || "",
          b.intructions || "",
          b.driver_instructions || "",

          // Assigned Driver
          b.driver?.name || "",
          b.driver?.phone || "",
          b.driver?.area_operates || "",
          driverPrice ? `£${driverPrice} ${driverPrice}` : "",

          // Vehicle Information
          b.vehicle?.name || "",
          b.vehicle?.type || "",
          b.vehicle_id || "",

          // Addons
          addonsText,

          // Status & Payment Status
          b.status || "",
          b.payment_status || "",
          b.payment_status === "paid_to_driver" ? "paid to driver" : "",

          // Pricing
          totalAmt ? `£${totalAmt} ${totalAmt}` : "",
          finalAmt ? `£${finalAmt} ${finalAmt}` : "",
        ]

        const searchableContent = searchableFields.join(" ").toLowerCase()
        return terms.every((term) => searchableContent.includes(term))
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
