"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Plane, FileText, Loader2, Edit3 } from "lucide-react"
import type { Booking } from "@/types/booking"
import type { Supplier } from "@/types/supplier"
import { getSuppliers } from "@/app/admin/suppliers/action"
import { updateBooking } from "@/app/admin/bookings/action"
import { toast } from "sonner"

interface EditBookingDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  booking: Booking
  onUpdated?: (updated: Booking) => void
}

export function EditBookingDialog({
  open,
  setOpen,
  booking,
  onUpdated,
}: EditBookingDialogProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierId, setSupplierId] = useState<string>("")
  const [supplierReference, setSupplierReference] = useState<string>("")
  const [flightNo, setFlightNo] = useState<string>("")
  const [arrivingFrom, setArrivingFrom] = useState<string>("")
  const [driverInstructions, setDriverInstructions] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      loadSuppliers()
      setSupplierId(booking.supplier_id || "none")
      setSupplierReference(booking.supplier_reference || "")
      setFlightNo(booking.flight_no || "")
      setArrivingFrom(booking.arriving_from || "")
      setDriverInstructions(booking.driver_instructions || booking.intructions || "")
    }
  }, [open, booking])

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers()
      if (res.data) setSuppliers(res.data)
    } catch (err) {
      console.error("Failed to load suppliers:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking.id) return

    setIsSubmitting(true)
    try {
      const updates = {
        supplier_id: supplierId === "none" ? null : supplierId,
        supplier_reference: supplierReference.trim() || null,
        flight_no: flightNo.trim() || null,
        arriving_from: arrivingFrom.trim() || null,
        driver_instructions: driverInstructions.trim() || null,
      }

      const res = await updateBooking(booking.id, updates)
      if (!res.success) {
        throw new Error(res.error || "Failed to update booking")
      }

      toast.success("Booking details updated successfully")
      setOpen(false)
      if (onUpdated && res.data) {
        // preserve enriched objects if still matching
        const chosenSupplier = suppliers.find((s) => s.id === (supplierId === "none" ? null : supplierId))
        onUpdated({
          ...booking,
          ...updates,
          supplier: chosenSupplier || undefined,
          driver_instructions: driverInstructions.trim() || undefined,
        })
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save booking updates")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-lime-100 text-lime-800 rounded-lg">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Edit Booking Details</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Update supplier, flight details, and driver instructions for #{booking.id?.slice(0, 5)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Supplier Section */}
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
            <div className="flex items-center gap-1.5 text-purple-900 font-semibold text-xs">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Supplier & Reference</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Supplier</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger className="bg-white text-xs">
                  <SelectValue placeholder="Select supplier (or Website / Direct)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {booking.source === "website" ? "Website (Direct Online)" : "Direct Offline (No Supplier)"}
                  </SelectItem>
                  {suppliers.map((sup) => (
                    <SelectItem key={sup.id} value={sup.id!}>
                      {sup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supplier-ref" className="text-xs font-medium">
                Supplier Job Reference # (Optional)
              </Label>
              <Input
                id="supplier-ref"
                placeholder="e.g. SUP-9982"
                value={supplierReference}
                onChange={(e) => setSupplierReference(e.target.value)}
                className="bg-white text-xs"
              />
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40 space-y-3">
            <div className="flex items-center gap-1.5 text-sky-950 font-semibold text-xs">
              <Plane className="w-4 h-4 text-sky-600" />
              <span>Flight Information (Optional)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="flight-no" className="text-xs font-medium">Flight Number</Label>
                <Input
                  id="flight-no"
                  placeholder="e.g. BA 145"
                  value={flightNo}
                  onChange={(e) => setFlightNo(e.target.value)}
                  className="bg-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="arriving-from" className="text-xs font-medium">Arriving From</Label>
                <Input
                  id="arriving-from"
                  placeholder="e.g. Dubai DXB"
                  value={arrivingFrom}
                  onChange={(e) => setArrivingFrom(e.target.value)}
                  className="bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Driver Instructions */}
          <div className="space-y-1.5">
            <Label htmlFor="driver-instructions" className="text-xs font-semibold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-500" />
              Driver Instructions (Optional)
            </Label>
            <Textarea
              id="driver-instructions"
              rows={3}
              placeholder="e.g. Flight BA145 arriving Terminal 5. Meet inside arrivals with nameboard: Mr. Anderson. Keep car warm."
              value={driverInstructions}
              onChange={(e) => setDriverInstructions(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Updates"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
