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

interface ChangeBookingStatusDialogProps {
  booking: Booking;
  status: string;
  onStatusChange: (data: { status: Booking["status"], date: string, time: string }) => void;
}

export function ChangeBookingStatusDialog({
  booking,
  status,
  onStatusChange,
}: ChangeBookingStatusDialogProps) {
  const [bookingStatus, setBookingStatus] = useState<"pending" | "confirmed" | "completed" | "cancelled">(status as any);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [date, setDate] = useState(booking.date || "");
  const [time, setTime] = useState(booking.time || "");

  const onChangeStatusConfirm = async () => {
    try {
      setLoading(true);
      const response = await changeBookingStatus(booking.id!, bookingStatus, date, time);
      if (response.error) throw response.error;

      toast.success("Booking updated successfully");
      onStatusChange({ status: bookingStatus, date, time });
    } catch (error) {
      toast.error("Error updating booking: " + (error as Error));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Change Booking Status</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Booking</DialogTitle>
          <DialogDescription>
            Change the status, date, and time for booking ID: {booking.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Label>Status</Label>
          <Select
            defaultValue={bookingStatus}
            onValueChange={(value) => setBookingStatus(value as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["pending", "confirmed", "completed", "cancelled"].map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <Label>Time</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

          <Button onClick={onChangeStatusConfirm} disabled={loading}>
            {loading ? "Updating..." : "Update Booking"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
