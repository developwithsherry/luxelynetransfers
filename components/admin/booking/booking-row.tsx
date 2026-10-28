"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDateUK } from "@/lib/format-util"
import { formatLocation } from "@/components/format-location/format-location"
import { Trash2, Loader2, Globe, Building2, UserPlus, UserCheck, ArrowRight } from "lucide-react"
import { deleteBooking } from "@/app/admin/bookings/action"
import { AssignDriverDialog } from "./assign-driver-dialog"
import { QuickStatusPopover } from "./quick-status-popover"
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

interface BookingRowProps {
  booking: any
  onDeleted?: (id: string) => void
  visibleColumns?: Record<ColumnKey, boolean>
}

export default function BookingRow({
  booking,
  onDeleted,
  visibleColumns = DEFAULT_VISIBLE_COLUMNS,
}: BookingRowProps) {
  const route = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const cols = visibleColumns || DEFAULT_VISIBLE_COLUMNS

  const getJobStatusBadge = (status: string) => {
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
      case "pending":
      default:
        return "bg-lime-400 text-slate-950"
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch ((status || "pending").toLowerCase()) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-300"
      case "paid_to_driver":
        return "bg-purple-50 text-purple-700 border-purple-300"
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-300"
    }
  }

  const formatStatus = (status: string) => {
    if (!status) return "Pending"
    if (status.toLowerCase() === "pob") return "POB"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatPaymentStatus = (status: string) => {
    if (!status) return "Pending"
    if (status === "paid_to_driver") return "Paid to Driver"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const onRowClick = () => {
    route.push(`/admin/bookings/${booking.id}`)
  }

  const handleDelete = async () => {
    if (!booking.id) return
    try {
      setIsDeleting(true)
      const res = await deleteBooking(booking.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete booking")
      }
      toast.success(`Booking #${booking.id?.slice(0, 5).toUpperCase()} deleted successfully`)
      setDeleteDialogOpen(false)
      if (onDeleted) {
        onDeleted(booking.id)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete booking")
    } finally {
      setIsDeleting(false)
    }
  }

  const customerName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Customer"
  const bookingCode = booking.id ? booking.id.slice(0, 5).toUpperCase() : "N/A"
  const isWebsite = booking.source === "website" || (!booking.supplier_id && booking.type !== "offline")

  return (
    <>
      <tr
        className="hover:bg-lime-50/70 cursor-pointer transition-colors duration-200 border-b border-black/5"
        onClick={onRowClick}
      >
        {/* Booking ID */}
        {cols.id && (
          <td className="px-3 py-2.5 text-xs font-mono font-bold text-black whitespace-nowrap">
            <Link
              href={`/admin/bookings/${booking.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-lime-700 hover:text-lime-900 transition-colors"
            >
              #{bookingCode}
            </Link>
          </td>
        )}

        {/* Source / Supplier */}
        {cols.source && (
          <td className="px-3 py-2.5 text-xs whitespace-nowrap">
            {isWebsite ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Globe className="w-3 h-3 text-blue-600" />
                Website
              </span>
            ) : booking.supplier?.name ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 w-fit">
                <Building2 className="w-3 h-3 text-purple-600" />
                {booking.supplier.name}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                Offline Direct
              </span>
            )}
          </td>
        )}

        {/* Passenger */}
        {cols.customer && (
          <td className="px-3 py-2.5 text-xs text-black whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold">{customerName}</span>
              {booking.with_return && (
                <span className="bg-lime-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-bold">
                  Return
                </span>
              )}
            </div>
            {booking.phone && (
              <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                {booking.phone}
              </div>
            )}
            {booking.email && (
              <div className="text-[10px] text-gray-400 truncate max-w-[140px]">
                {booking.email}
              </div>
            )}
          </td>
        )}

        {/* Date & Time */}
        {cols.dateTime && (
          <td className="px-3 py-2.5 text-xs text-black whitespace-nowrap">
            <div>
              <div className="font-medium">{booking.date ? formatDateUK(booking.date) : "N/A"}</div>
              <div className="text-black/60 text-[11px]">{booking.time || "N/A"}</div>
              {booking.with_return && booking.return_date && (
                <div className="text-[10px] text-lime-700 font-medium">
                  Ret: {formatDateUK(booking.return_date)} {booking.return_time}
                </div>
              )}
            </div>
          </td>
        )}

        {/* Journey (Pickup & Drop-off) */}
        {cols.journey && (
          <td className="px-3 py-2.5 text-xs text-black max-w-[220px] whitespace-normal break-words">
            <div className="text-xs">
              <div className="truncate font-medium" title={booking.pickup_location}>{formatLocation(booking.pickup_location)}</div>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate mt-0.5" title={booking.drop_off_location}>
                <ArrowRight className="w-3 h-3 shrink-0 text-lime-600" />
                <span className="truncate">{formatLocation(booking.drop_off_location)}</span>
              </div>
            </div>
          </td>
        )}

        {/* Driver Assignment */}
        {cols.driver && (
          <td className="px-3 py-2.5 text-xs whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
            {booking.driver ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {booking.driver.name}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    Cost: £{Number(booking.driver_price || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAssignDialogOpen(true)}
                  className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                  title="Change assigned driver"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAssignDialogOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-lime-800 bg-lime-100 hover:bg-lime-200 border border-lime-300 rounded-lg transition-colors shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Assign Driver
              </button>
            )}
          </td>
        )}

        {/* Status */}
        {cols.status && (
          <td
            className="px-3 py-2.5 text-center whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            <QuickStatusPopover
              booking={booking}
              showPaymentBadge={true}
              onSuccess={() => {
                if (onDeleted) {
                  onDeleted("")
                }
              }}
            />
          </td>
        )}

        {/* Price */}
        {cols.price && (
          <td className="px-3 py-2.5 text-xs text-right whitespace-nowrap">
            <div className="font-bold text-black text-sm">
              £{Number(booking.final_amount || booking.total_amount || booking.price || 0).toFixed(2)}
            </div>
          </td>
        )}

        {/* Actions Column */}
        {cols.actions && (
          <td className="px-3 py-2.5 text-xs text-center whitespace-nowrap">
            <div
              className="flex items-center justify-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/admin/bookings/${booking.id}`}
                className="inline-flex items-center px-2 py-1 text-xs font-semibold text-lime-700 hover:text-white hover:bg-lime-600 border border-lime-600 rounded-lg transition-all duration-200 shadow-2xs"
              >
                View
              </Link>

              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-lg transition-all duration-200 shadow-2xs disabled:opacity-50"
                title="Delete booking"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </td>
        )}
      </tr>

      {/* Assign Driver Dialog */}
      <AssignDriverDialog
        open={assignDialogOpen}
        setOpen={setAssignDialogOpen}
        booking={booking}
        onSuccess={() => {
          if (onDeleted) {
            // Re-trigger refresh in parent
            onDeleted("")
          }
        }}
      />

      {/* Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Booking #{bookingCode}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-sm text-gray-600">
              <p>
                Are you sure you want to permanently delete this booking for{" "}
                <strong>{customerName}</strong>?
              </p>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-700 space-y-1">
                <div>
                  <strong>Pickup:</strong> {formatLocation(booking.pickup_location)}
                </div>
                <div>
                  <strong>Drop-off:</strong> {formatLocation(booking.drop_off_location)}
                </div>
                <div>
                  <strong>Date:</strong> {booking.date ? formatDateUK(booking.date) : "N/A"}{" "}
                  {booking.time || ""}
                </div>
                <div>
                  <strong>Total:</strong> £{booking.final_amount?.toFixed(2) || "0.00"}
                </div>
              </div>
              <p className="text-red-600 font-medium">
                This will delete this job and any associated add-ons from your database. This action
                cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isDeleting ? (
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
    </>
  )
}
