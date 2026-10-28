"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { changeBookingStatus } from "@/lib/admin/change-booking-status"
import { toast } from "sonner"
import type { Booking } from "@/types/booking"

const JOB_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", dot: "bg-lime-400", activeBg: "bg-lime-50 border-lime-400 text-slate-950" },
  { value: "confirmed", label: "Confirmed", dot: "bg-lime-500", activeBg: "bg-lime-50 border-lime-500 text-lime-950" },
  { value: "covered", label: "Covered", dot: "bg-blue-600", activeBg: "bg-blue-50 border-blue-500 text-blue-900" },
  { value: "pob", label: "POB", dot: "bg-amber-500", activeBg: "bg-amber-50 border-amber-500 text-amber-900" },
  { value: "completed", label: "Completed", dot: "bg-emerald-600", activeBg: "bg-emerald-50 border-emerald-500 text-emerald-900" },
  { value: "complaint", label: "Complaint", dot: "bg-rose-600", activeBg: "bg-rose-50 border-rose-500 text-rose-900" },
  { value: "cancelled", label: "Cancelled", dot: "bg-gray-800", activeBg: "bg-gray-100 border-gray-700 text-gray-900" },
]

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", dot: "bg-amber-500", activeBg: "bg-amber-50 border-amber-400 text-amber-900" },
  { value: "paid", label: "Paid", dot: "bg-emerald-600", activeBg: "bg-emerald-50 border-emerald-500 text-emerald-900" },
  { value: "paid_to_driver", label: "Paid to Driver", dot: "bg-purple-600", activeBg: "bg-purple-50 border-purple-500 text-purple-900" },
]

interface QuickStatusPopoverProps {
  booking: Booking
  showPaymentBadge?: boolean
  onSuccess?: (updated: { status: string; payment_status: string }) => void
}

export function QuickStatusPopover({
  booking,
  showPaymentBadge = true,
  onSuccess,
}: QuickStatusPopoverProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Local optimistic values so badge updates immediately
  const [currentJobStatus, setCurrentJobStatus] = useState<string>(
    (booking.status || "pending").toLowerCase()
  )
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<string>(
    (booking.payment_status || "pending").toLowerCase()
  )

  // Draft values inside the popover
  const [draftJobStatus, setDraftJobStatus] = useState<string>(currentJobStatus)
  const [draftPaymentStatus, setDraftPaymentStatus] = useState<string>(currentPaymentStatus)

  useEffect(() => {
    const js = (booking.status || "pending").toLowerCase()
    const ps = (booking.payment_status || "pending").toLowerCase()
    setCurrentJobStatus(js)
    setCurrentPaymentStatus(ps)
    setDraftJobStatus(js)
    setDraftPaymentStatus(ps)
  }, [booking.status, booking.payment_status])

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

  const handleSave = async () => {
    if (!booking.id) return
    try {
      setLoading(true)
      const res = await changeBookingStatus(
        booking.id,
        draftJobStatus,
        undefined,
        undefined,
        draftPaymentStatus
      )
      if (!res.success || res.error) {
        throw new Error(res.error || "Failed to update status")
      }

      setCurrentJobStatus(draftJobStatus)
      setCurrentPaymentStatus(draftPaymentStatus)
      toast.success("Booking & payment status updated")
      setOpen(false)
      if (onSuccess) {
        onSuccess({ status: draftJobStatus, payment_status: draftPaymentStatus })
      }
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const bookingCode = booking.id ? booking.id.slice(0, 5).toUpperCase() : ""

  return (
    <div onClick={(e) => e.stopPropagation()} className="inline-block">
      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setDraftJobStatus(currentJobStatus)
            setDraftPaymentStatus(currentPaymentStatus)
          }
          setOpen(nextOpen)
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Click to change booking or payment status"
            className="group flex flex-col gap-1 items-center p-1 -m-1 rounded-lg hover:bg-slate-100/90 transition cursor-pointer focus:outline-none"
          >
            <span
              className={`px-2 py-0.5 inline-flex items-center gap-1 text-[10px] font-bold rounded-full shadow-2xs transition group-hover:ring-2 group-hover:ring-slate-300 ${getJobStatusBadge(
                currentJobStatus
              )}`}
            >
              <span>{formatStatus(currentJobStatus)}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-80" />
            </span>

            {showPaymentBadge && (
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-medium border inline-flex items-center gap-0.5 ${getPaymentStatusBadge(
                  currentPaymentStatus
                )}`}
              >
                <span>{formatPaymentStatus(currentPaymentStatus)}</span>
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="left"
          align="center"
          sideOffset={8}
          className="w-64 p-3.5 rounded-xl border border-slate-200 bg-white shadow-xl space-y-3 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-900">
              Update Status
            </span>
            {bookingCode && (
              <span className="text-[10px] font-mono font-bold text-lime-700 bg-lime-50 px-1.5 py-0.5 rounded border border-lime-200">
                #{bookingCode}
              </span>
            )}
          </div>

          {/* Booking / Job Status */}
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Booking Status
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {JOB_STATUS_OPTIONS.map((opt) => {
                const isSelected = draftJobStatus === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftJobStatus(opt.value)}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition text-left ${
                      isSelected
                        ? `${opt.activeBg} font-bold shadow-2xs`
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                      <span className="truncate">{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="space-y-1.5 text-left pt-1 border-t border-slate-100">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Payment Status
            </label>
            <div className="grid grid-cols-1 gap-1">
              {PAYMENT_STATUS_OPTIONS.map((opt) => {
                const isSelected = draftPaymentStatus === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDraftPaymentStatus(opt.value)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition text-left ${
                      isSelected
                        ? `${opt.activeBg} font-bold shadow-2xs`
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                      <span>{opt.label}</span>
                    </span>
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-7 px-2.5 text-xs text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={loading}
              className="h-7 px-3 text-xs font-bold bg-lime-500 hover:bg-lime-600 text-slate-950"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

