"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { changeBookingStatus } from "@/lib/admin/change-booking-status"
import { Booking } from "@/types/booking"

interface ChangeBookingStatusDialogProps {
  booking: Booking
  status?: string | null
  bookingId?: string
  onStatusChange?: (data: {
    status: Booking["status"]
    date: string
    time: string
    payment_status?: string
  }) => void
}

const JOB_STATUSES = [
  { value: "confirmed", label: "Confirmed" },
  { value: "covered", label: "Covered (Assigned)" },
  { value: "pob", label: "POB (Passenger on Board)" },
  { value: "completed", label: "Completed" },
  { value: "complaint", label: "Complaint" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
]

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "paid_to_driver", label: "Paid to Driver" },
]

export function ChangeBookingStatusDialog({
  booking,
  status,
  bookingId,
  onStatusChange,
}: ChangeBookingStatusDialogProps) {
  const [bookingStatus, setBookingStatus] = useState<string>(
    String(status || booking.status || "pending").toLowerCase()
  )
  const [paymentStatus, setPaymentStatus] = useState<string>(
    String(booking.payment_status || "pending").toLowerCase()
  )
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setBookingStatus(String(status || booking.status || "pending").toLowerCase())
      setPaymentStatus(String(booking.payment_status || "pending").toLowerCase())
    }
  }, [open, status, booking.status, booking.payment_status])

  const onChangeStatusConfirm = async () => {
    try {
      setLoading(true)
      const targetId = booking.id || bookingId
      if (!targetId) throw new Error("No booking ID found")

      const response = await changeBookingStatus(
        targetId,
        bookingStatus || "pending",
        undefined,
        undefined,
        paymentStatus
      )
      if (!response.success || response.error) {
        throw new Error(response.error || "Failed to update status")
      }

      toast.success("Booking & payment status updated")
      if (onStatusChange) {
        onStatusChange({
          status: (bookingStatus || "pending") as Booking["status"],
          date: booking.date || "",
          time: booking.time || "",
          payment_status: paymentStatus,
        })
      }
      setOpen(false)
    } catch (error) {
      toast.error("Error updating status: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 text-xs font-semibold">
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Booking & Payment Status</DialogTitle>
          <DialogDescription>
            Change job status and payment settlement state for #
            {booking.id?.slice(0, 5).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Job Status</Label>
            <Select
              value={bookingStatus || "pending"}
              onValueChange={(value) => setBookingStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Payment Status</Label>
            <Select
              value={paymentStatus || "pending"}
              onValueChange={(value) => setPaymentStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUSES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-lime-400 text-slate-950 hover:bg-lime-500 font-bold mt-2"
            onClick={onChangeStatusConfirm}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
