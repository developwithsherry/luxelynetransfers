"use client"

import { Search, RotateCcw } from "lucide-react"
import { CreateBookingDialog } from "./create-booking-dialog"
import { Button } from "@/components/ui/button"
import { Booking } from "@/types/booking"
import {
  ColumnVisibilityToggle,
  ColumnKey,
} from "./column-visibility-toggle"

export type FilterState = {
  search: string
  status: string
  paymentStatus: string
  driverAssignment: string
  timeframe: string
  source: string
  fromDate: string
  toDate: string
  sortOrder: "newest" | "oldest"
}

export const INITIAL_FILTERS: FilterState = {
  search: "",
  status: "all",
  paymentStatus: "all",
  driverAssignment: "all",
  timeframe: "all",
  source: "all",
  fromDate: "",
  toDate: "",
  sortOrder: "newest",
}

interface BookingsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  onResetFilters: () => void
  onRefresh: () => void
  totalBookings: number
  filteredCount: number
  onBookingCreated: (booking: Booking) => void
  visibleColumns: Record<ColumnKey, boolean>
  toggleColumn: (key: ColumnKey) => void
  resetColumns: () => void
}

export default function BookingsFilters({
  filters,
  onFiltersChange,
  onResetFilters,
  onRefresh,
  totalBookings,
  filteredCount,
  onBookingCreated,
  visibleColumns,
  toggleColumn,
  resetColumns,
}: BookingsFiltersProps) {
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

  return (
    <div className="mb-5 space-y-2.5 w-full">
      {/* Top Bar: Search, Column Checklist, and Create Offline Booking */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-lg">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ref #, customer, route, stops, flight, driver, vehicle, notes..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="w-full pl-9 pr-7 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFiltersChange({ search: "" })}
              className="absolute right-2.5 top-2 text-xs font-bold text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Column Checklist Popover */}
          <ColumnVisibilityToggle
            visibleColumns={visibleColumns}
            toggleColumn={toggleColumn}
            resetColumns={resetColumns}
          />

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 px-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          )}

          {/* Create Offline Booking Dialog */}
          <CreateBookingDialog
            trigger={
              <Button className="h-8 px-3 text-xs font-bold bg-lime-500 hover:bg-lime-600 text-slate-950 shadow-xs transition">
                + New Offline Booking
              </Button>
            }
            onBookingCreated={onBookingCreated}
          />
        </div>
      </div>

      {/* Filter Controls Bar (Dispatch Grid) */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 shadow-2xs w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2">
          {/* Status Filter */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              Job Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 truncate"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="covered">Covered (Assigned)</option>
              <option value="pob">POB</option>
              <option value="completed">Completed</option>
              <option value="complaint">Complaint</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Timeframe Filter (Upcoming / Past) */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              Timeframe
            </label>
            <select
              value={filters.timeframe}
              onChange={(e) => onFiltersChange({ timeframe: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 truncate"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming Jobs</option>
              <option value="past">Past Jobs</option>
            </select>
          </div>

          {/* Driver Assignment Filter */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              Driver Allocation
            </label>
            <select
              value={filters.driverAssignment}
              onChange={(e) => onFiltersChange({ driverAssignment: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 truncate"
            >
              <option value="all">All Allocations</option>
              <option value="unassigned">⚠️ Needs Driver</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              Payment State
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => onFiltersChange({ paymentStatus: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 truncate"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid (Customer)</option>
              <option value="pending">Pending Payment</option>
              <option value="paid_to_driver">Paid to Driver</option>
              <option value="unpaid_to_driver">Unpaid to Driver</option>
            </select>
          </div>

          {/* Source / Supplier Filter */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              Source
            </label>
            <select
              value={filters.source}
              onChange={(e) => onFiltersChange({ source: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500 truncate"
            >
              <option value="all">All Sources</option>
              <option value="website">Website Online</option>
              <option value="offline">Offline / Supplier</option>
            </select>
          </div>

          {/* From Date */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              From Date
            </label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFiltersChange({ fromDate: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500"
            />
          </div>

          {/* To Date */}
          <div className="space-y-0.5 min-w-0">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
              To Date
            </label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFiltersChange({ toDate: e.target.value })}
              className="w-full h-8 border border-slate-300 bg-white rounded-md px-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500"
            />
          </div>
        </div>

        {/* Results Info & Sort Order */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 mt-2 border-t border-slate-200 text-xs">
          <div className="text-slate-600 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredCount}</span> of{" "}
            <span className="font-bold text-slate-900">{totalBookings}</span> bookings
            {hasActiveFilters && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Filtered
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-medium">Sort Order:</span>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                onFiltersChange({ sortOrder: e.target.value as FilterState["sortOrder"] })
              }
              className="border border-slate-300 bg-white rounded-md px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-lime-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
