"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { format, isValid } from "date-fns"
import { DatePickerInput } from "./date-picker-input"
import { TimePickerInput } from "./time-picker-input"

interface ChangeBookingStatusDialogProps {
  booking: Booking;
  status?: string | null;
  bookingId?: string;
  onStatusChange?: (data: { status: Booking["status"], date: string, time: string, payment_status?: string }) => void;
}

const JOB_STATUSES = [
  { value: "confirmed", label: "Confirmed" },
  { value: "covered", label: "Covered (Assigned)" },
  { value: "pob", label: "POB (Passenger on Board)" },
  { value: "completed", label: "Completed" },
  { value: "complaint", label: "Complaint" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "paid_to_driver", label: "Paid to Driver" },
];

export function ChangeBookingStatusDialog({
  booking,
  status,
  bookingId,
  onStatusChange,
}: ChangeBookingStatusDialogProps) {
  const [bookingStatus, setBookingStatus] = useState<string>(
    String(status || booking.status || "pending")
  );
  const [paymentStatus, setPaymentStatus] = useState<string>(
    booking.payment_status || "pending"
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState<Date | null>(() => {
    if (!booking.date) return null
    const d = new Date(booking.date)
    return isValid(d) ? d : null
  });
  const [time, setTime] = useState(booking.time || "09:00 AM");

  const onChangeStatusConfirm = async () => {
    try {
      setLoading(true);
      const targetId = booking.id || bookingId;
      if (!targetId) throw new Error("No booking ID found");

      const dateStr = date && isValid(date) ? format(date, "yyyy-MM-dd") : (booking.date || "");

      const response = await changeBookingStatus(
        targetId,
        bookingStatus || "pending",
        dateStr,
        time,
        paymentStatus
      );
      if (response.error) throw response.error;

      toast.success("Booking updated successfully");
      if (onStatusChange) {
        onStatusChange({
          status: (bookingStatus || "pending") as Booking["status"],
          date: dateStr,
          time,
          payment_status: paymentStatus,
        });
      }
      setOpen(false);
    } catch (error) {
      toast.error("Error updating booking: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9">Update Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
          <DialogDescription>
            Change job status, payment status, date, and time for #{booking.id?.slice(0, 8)}
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
              value={paymentStatus}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Date</Label>
              <DatePickerInput
                value={date}
                onChange={setDate}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Time (AM/PM)</Label>
              <TimePickerInput
                value={time}
                onChange={setTime}
              />
            </div>
          </div>

          <Button 
            className="w-full bg-lime-400 text-slate-950 hover:bg-lime-500 font-semibold mt-2" 
            onClick={onChangeStatusConfirm} 
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
