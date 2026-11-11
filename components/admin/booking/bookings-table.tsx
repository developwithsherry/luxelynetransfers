import { useState, useMemo } from "react"
import Link from "next/link"
import { Loader2, Trash2 } from "lucide-react"
import BookingRow from "./booking-row"
import { QuickStatusPopover } from "./quick-status-popover"
import { getSupplierBadgeStyle } from "@/lib/supplier-colors"
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

        {/* ✅ Mobile Native Dispatch Cards */}
        <div className="block md:hidden p-3 space-y-3 bg-slate-50/70">
          {paginatedBookings.map((booking) => {
            const customer =
              `${booking.first_name || ""} ${booking.last_name || ""}`.trim() ||
              booking.customer_name ||
              "Guest Passenger"
            const bookingCode = booking.id ? booking.id.slice(0, 5).toUpperCase() : "N/A"
            const isWebsite =
              booking.source === "website" || (!booking.supplier_id && booking.type !== "offline")
            const fare = Number(booking.final_amount ?? booking.total_amount ?? booking.price ?? 0)
            const driverCost = Number(booking.driver_price || 0)

            const cleanPhone = booking.phone ? booking.phone.replace(/[^0-9]/g, "") : ""
            const formattedPhone = cleanPhone.startsWith("0") ? `44${cleanPhone.slice(1)}` : cleanPhone
            const whatsappUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : null

            return (
              <div
                key={booking.id}
                className="border border-slate-200/90 rounded-2xl p-4 shadow-xs bg-white space-y-3"
              >
                {/* Top Row: Time, Ref, Source, Status & Fare */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-black text-slate-950 px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                      #{bookingCode}
                    </span>
                    {booking.time && (
                      <span className="text-xs font-extrabold text-white px-2 py-0.5 rounded-lg bg-slate-950">
                        {booking.time}
                      </span>
                    )}
                    {isWebsite ? (
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold border border-blue-200">
                        Website
                      </span>
                    ) : booking.supplier?.name ? (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-md font-bold border truncate max-w-[100px]"
                        style={getSupplierBadgeStyle(booking.supplier)}
                      >
                        {booking.supplier.name}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                        Offline
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-950 block leading-tight">
                      £{fare.toFixed(2)}
                    </span>
                    {driverCost > 0 && (
                      <span className="text-[10px] font-semibold text-emerald-700 block">
                        Driver: £{driverCost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Route Flow (Visual from -> to) */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-500 mt-1 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Pickup {booking.date ? `• ${booking.date}` : ""}
                      </span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {booking.pickup_location || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-950 mt-1 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Destination
                      </span>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {booking.drop_off_location || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passenger & Driver Strip */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{customer}</p>
                    {booking.phone && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${booking.phone}`}
                          className="text-[11px] font-medium text-slate-600 hover:text-slate-950 underline"
                        >
                          {booking.phone}
                        </a>
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    {booking.driver ? (
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-right">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 block">
                          Driver
                        </span>
                        <span className="text-xs font-bold truncate max-w-[120px] block">
                          {booking.driver.name}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-[11px]">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions: Status Popover, Details & Delete */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <QuickStatusPopover
                    booking={booking}
                    showPaymentBadge={true}
                    onSuccess={() => {
                      if (onBookingDeleted) {
                        onBookingDeleted("")
                      }
                    }}
                  />

                  <div className="flex items-center gap-1.5">
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-bold bg-slate-950 hover:bg-slate-800 text-white rounded-xl active:scale-95 transition"
                      >
                        Details →
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setMobileDeleteTarget(booking)}
                      className="h-8 w-8 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                      title="Delete booking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
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
