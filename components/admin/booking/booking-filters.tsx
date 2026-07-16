"use client"

import { Search, RefreshCw, Filter } from "lucide-react"
import type { FilterState } from "@/app/admin/bookings/page"
import { CreateBookingDialog } from "./create-booking-dialog"
import { Button } from "@/components/ui/button"
import { Booking } from "@/types/booking"

interface BookingsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  onRefresh: () => void
  totalBookings: number
  filteredCount: number
  onBookingCreated:(booking:Booking)=>void
}

export default function BookingsFilters({
  filters,
  onFiltersChange,
  onRefresh,
  totalBookings,
  filteredCount,
  onBookingCreated
}: BookingsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by ID or customer name..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="w-full sm:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value as FilterState["status"] })}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort Order */}
          <select
            value={filters.sortOrder}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value as FilterState["sortOrder"] })}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <CreateBookingDialog trigger={<Button>Create Offline Booking</Button>} onBookingCreated={onBookingCreated}/>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredCount} of {totalBookings} bookings
        {(filters.search.trim() || filters.status !== "all") && (
          <span className="ml-2 text-yellow-600">(filtered)</span>
        )}
      </div>
    </div>
  )
}
