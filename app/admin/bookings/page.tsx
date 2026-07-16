"use client"

import { useState, useMemo } from "react"
import { usePendingBookings } from "./action-client"
import BookingsHeader from "@/components/admin/booking/booking-header"
import BookingsFilters from "@/components/admin/booking/booking-filters"
import BookingsTable from "@/components/admin/booking/bookings-table"
import { Booking } from "@/types/booking"


export const dynamic = "force-dynamic"

export type FilterState = {
  search: string
  status: "all" | "pending" | "failed" | "confirmed"
  sortOrder: "newest" | "oldest"
}

export default function BookingsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    sortOrder: "newest",
  })

  const { pendingBookings, isLoading, isError, mutate } = usePendingBookings()

  // Filter and sort bookings based on current filters
  const filteredBookings = useMemo(() => {
    if (!pendingBookings) return []

    let filtered = [...pendingBookings]

    // Filter by search (ID or customer name)
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim()
      filtered = filtered.filter((booking) => {
        const customerName = `${booking.first_name} ${booking.last_name}`.toLowerCase()
        const bookingId = booking.id?.toLowerCase() || ""
        return customerName.includes(query) || bookingId.includes(query)
      })
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((booking) => booking.status === filters.status)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)

      if (filters.sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime()
      } else {
        return dateA.getTime() - dateB.getTime()
      }
    })

    return filtered
  }, [pendingBookings, filters])

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const refreshBookings = () => {
    mutate()
  }
  function onBookingCreated(booking:Booking){
   mutate();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-full  px-4 sm:px-6 lg:px-4 py-2">
        <BookingsHeader />

        <BookingsFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onRefresh={refreshBookings}
          totalBookings={pendingBookings?.length || 0}
          filteredCount={filteredBookings.length}
          onBookingCreated={onBookingCreated}
        />

        <BookingsTable
          bookings={filteredBookings}
          isLoading={isLoading}
          isError={isError}
          hasFilters={filters.search.trim() !== "" || filters.status !== "all"}
        />
      </main>
    </div>
  )
}
