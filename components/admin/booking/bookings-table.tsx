import { useState, useMemo } from "react"
import Link from "next/link"
import { Loader2, Trash2 } from "lucide-react"
import BookingRow from "./booking-row"
import { QuickStatusPopover } from "./quick-status-popover"
import { Button } from "@/components/ui/button"
import { deleteBooking } from "@/app/admin/bookings/action"
import { toast } from "sonner"
import type { ColumnKey } from "./column-visibility-toggle"
import { DEFAULT_VISIBLE_COLUMNS } from "./column-visibility-toggle"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BookingsTableProps {
  bookings: any[]
  isLoading: boolean
  isError: boolean
  hasFilters: boolean
  onBookingDeleted?: (id: string) => void
  visibleColumns?: Record<ColumnKey, boolean>
}

const DEFAULT_ITEMS_PER_PAGE = 30

export default function BookingsTable({
  bookings,
  isLoading,
  isError,
  hasFilters,
  onBookingDeleted,
  visibleColumns = DEFAULT_VISIBLE_COLUMNS,
}: BookingsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileDeleteTarget, setMobileDeleteTarget] = useState<any | null>(null)
  const [isDeletingMobile, setIsDeletingMobile] = useState(false)

  const cols = visibleColumns || DEFAULT_VISIBLE_COLUMNS

  // When filters are active, show ALL matching records (no 5 or 30 cut-off)
  // When no filters are active, show up to 30 bookings per page
  const itemsPerPage = hasFilters ? Math.max(bookings.length, 1) : DEFAULT_ITEMS_PER_PAGE
  const totalPages = Math.max(1, Math.ceil(bookings.length / itemsPerPage))

  const paginatedBookings = useMemo(() => {
    if (hasFilters) return bookings
    const start = (currentPage - 1) * itemsPerPage
    return bookings.slice(start, start + itemsPerPage)
  }, [bookings, currentPage, hasFilters, itemsPerPage])

  const handleMobileDelete = async () => {
    if (!mobileDeleteTarget?.id) return
    setIsDeletingMobile(true)
    try {
      const res = await deleteBooking(mobileDeleteTarget.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete booking")
      }
      toast.success(
        `Booking #${mobileDeleteTarget.id.slice(0, 5).toUpperCase()} deleted successfully`
      )
      setMobileDeleteTarget(null)
      if (onBookingDeleted) {
        onBookingDeleted(mobileDeleteTarget.id)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete booking")
    } finally {
      setIsDeletingMobile(false)
    }
  }

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
    <>
      <div className="bg-white shadow-2xs overflow-hidden rounded-xl border border-slate-200 w-full">
        {/* ✅ Desktop Table */}
        <div className="hidden md:block w-full">
          <div className="w-full overflow-x-auto rounded-xl relative">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-slate-950">
                <tr>
                  {cols.id && (
                    <th className="px-3 py-2.5 text-left text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Booking ID
                    </th>
                  )}
                  {cols.source && (
                    <th className="px-3 py-2.5 text-left text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Source / Supplier
                    </th>
                  )}
                  {cols.customer && (
                    <th className="px-3 py-2.5 text-left text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Passenger
                    </th>
                  )}
                  {cols.dateTime && (
                    <th className="px-3 py-2.5 text-left text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </th>
                  )}
                  {cols.journey && (
                    <th className="px-3 py-2.5 text-left text-[11px] font-bold text-white uppercase tracking-wider">
                      Journey
                    </th>
                  )}
                  {cols.driver && (
                    <th className="px-3 py-2.5 text-left text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Driver
                    </th>
                  )}
                  {cols.status && (
                    <th className="px-3 py-2.5 text-center text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                  )}
                  {cols.price && (
                    <th className="px-3 py-2.5 text-right text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Price
                    </th>
                  )}
                  {cols.actions && (
                    <th className="px-3 py-2.5 text-center text-[11px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-black/5">
                {paginatedBookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onDeleted={onBookingDeleted}
                    visibleColumns={cols}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Mobile Cards */}
        <div className="block md:hidden p-4 space-y-4">
          {paginatedBookings.map((booking) => {
            const customer = `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || booking.customer_name || "N/A"
            const bookingCode = booking.id ? booking.id.slice(0, 5).toUpperCase() : "N/A"
            const isWebsite = booking.source === "website" || (!booking.supplier_id && booking.type !== "offline")
            return (
              <div key={booking.id} className="border border-black/10 rounded-lg p-4 shadow-sm bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-lime-700">#{bookingCode}</span>
                    {isWebsite ? (
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">
                        Website
                      </span>
                    ) : booking.supplier?.name ? (
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium border border-purple-200">
                        {booking.supplier.name}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        Offline
                      </span>
                    )}
                  </div>
                  <QuickStatusPopover
                    booking={booking}
                    showPaymentBadge={true}
                    onSuccess={() => {
                      if (onBookingDeleted) {
                        onBookingDeleted("")
                      }
                    }}
                  />
                </div>
                <p className="text-sm">
                  <strong>Passenger:</strong> {customer}
                  {booking.phone && (
                    <span className="block text-xs text-gray-500 mt-0.5">{booking.phone}</span>
                  )}
                </p>
                <p className="text-sm">
                  <strong>Date & Time:</strong> {booking.date || ""} {booking.time || ""}
                </p>
                <p className="text-sm break-words whitespace-normal">
                  <strong>From:</strong> {booking.pickup_location || "N/A"}
                </p>
                <p className="text-sm break-words whitespace-normal">
                  <strong>To:</strong> {booking.drop_off_location || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Driver:</strong>{" "}
                  {booking.driver ? (
                    <span className="text-emerald-700 font-medium">
                      {booking.driver.name} (£{Number(booking.driver_price || 0).toFixed(2)})
                    </span>
                  ) : (
                    <span className="text-gray-400">Unassigned</span>
                  )}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> £{booking.final_amount?.toFixed(2) || booking.price || "0.00"}
                </p>
                <div className="pt-2 flex justify-end gap-2 border-t">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button size="sm" variant="outline" className="border-lime-600 text-lime-700">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setMobileDeleteTarget(booking)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ✅ Pagination & Count Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-black/10 bg-gray-50 text-xs text-gray-700">
          <div>
            {hasFilters ? (
              <span className="font-semibold text-lime-800">
                Showing all {bookings.length} filtered bookings
              </span>
            ) : (
              <span>
                Showing {Math.min(bookings.length, (currentPage - 1) * DEFAULT_ITEMS_PER_PAGE + 1)}–
                {Math.min(bookings.length, currentPage * DEFAULT_ITEMS_PER_PAGE)} of {bookings.length} total bookings
              </span>
            )}
          </div>

          {!hasFilters && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <span className="font-medium text-xs px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Delete Alert Dialog */}
      {mobileDeleteTarget && (
        <AlertDialog
          open={Boolean(mobileDeleteTarget)}
          onOpenChange={(open) => !open && setMobileDeleteTarget(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Booking #{mobileDeleteTarget.id?.substring(0, 4).toUpperCase()}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Are you sure you want to permanently delete this booking for{" "}
                  <strong>
                    {mobileDeleteTarget.first_name} {mobileDeleteTarget.last_name}
                  </strong>
                  ?
                </p>
                <p className="text-red-600 font-medium text-xs">
                  This action cannot be undone and will delete the job from your database.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingMobile}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleMobileDelete}
                disabled={isDeletingMobile}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                {isDeletingMobile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Booking"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
