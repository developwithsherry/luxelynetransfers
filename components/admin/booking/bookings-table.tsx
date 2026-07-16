"use client"

import { useState, useMemo } from "react"
import { Loader2 } from "lucide-react"
import BookingRow from "./booking-row"
import { Button } from "@/components/ui/button"

interface BookingsTableProps {
  bookings: any[]
  isLoading: boolean
  isError: boolean
  hasFilters: boolean
}

const ITEMS_PER_PAGE = 5

export default function BookingsTable({ bookings, isLoading, isError, hasFilters }: BookingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE)

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return bookings.slice(start, start + ITEMS_PER_PAGE)
  }, [bookings, currentPage])

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-black/10">
        <div className="p-8 text-center flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-3 text-lime-600" />
          <span className="text-black font-medium">Loading bookings...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-black/10">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-full mb-4">
            <span className="text-white text-xl">!</span>
          </div>
          <p className="text-black font-medium">Error loading bookings. Please try again.</p>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white shadow-lg overflow-hidden rounded-xl border border-black/10">
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-500 rounded-full mb-4">
            <span className="text-white text-xl">📋</span>
          </div>
          <p className="text-black font-medium">
            {hasFilters
              ? "No bookings match your search criteria. Please try adjusting your filters."
              : "No bookings found."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden rounded-xl border border-black/10 max-w-screen">
      {/* ✅ Desktop Table */}
      <div className="hidden md:block">
        <div className="w-full max-w-screen overflow-x-auto overflow-y-hidden rounded-xl relative">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">From</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">To</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Price
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black/5">
              {paginatedBookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Mobile Cards */}
      <div className="block md:hidden p-4 space-y-4">
        {paginatedBookings.map((booking) => (
          <div key={booking.id} className="border border-black/10 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-lime-700">#{booking.id}</span>
              <span className="text-xs text-gray-500">{booking.status}</span>
            </div>
            <p className="text-sm">
              <strong>Customer:</strong> {booking.customer_name || "N/A"}
            </p>
            <p className="text-sm">
              <strong>Date & Time:</strong> {booking.date_time}
            </p>
            <p className="text-sm break-words whitespace-normal">
              <strong>From:</strong> {booking.from_location}
            </p>
            <p className="text-sm break-words whitespace-normal">
              <strong>To:</strong> {booking.to_location}
            </p>
            <p className="text-sm">
              <strong>Price:</strong> £{booking.price}
            </p>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="secondary">
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-3 p-4 border-t border-black/10 bg-gray-50">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
