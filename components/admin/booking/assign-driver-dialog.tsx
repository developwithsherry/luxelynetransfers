"use client"

import { useState, useEffect, useMemo } from "react"
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
import {
  UserCheck,
  Search,
  Phone,
  MapPin,
  PoundSterling,
  FileText,
  Loader2,
  Check,
  UserX,
} from "lucide-react"
import type { Booking } from "@/types/booking"
import type { Driver } from "@/types/driver"
import { getDrivers } from "@/app/admin/drivers/action"
import { assignDriverToBooking } from "@/app/admin/bookings/action"
import { toast } from "sonner"

interface AssignDriverDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  booking: Booking | null
  onSuccess?: () => void
}

export function AssignDriverDialog({
  open,
  setOpen,
  booking,
  onSuccess,
}: AssignDriverDialogProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loadingDrivers, setLoadingDrivers] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState<string>("")
  const [driverPrice, setDriverPrice] = useState<string>("")
  const [driverInstructions, setDriverInstructions] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch drivers when opened
  useEffect(() => {
    if (open) {
      loadDrivers()
      if (booking) {
        setSelectedDriverId(booking.driver_id || "")
        setDriverPrice(booking.driver_price != null ? String(booking.driver_price) : "")
        setDriverInstructions(booking.driver_instructions || booking.intructions || "")
      }
      setSearchQuery("")
    }
  }, [open, booking])

  const loadDrivers = async () => {
    setLoadingDrivers(true)
    try {
      const res = await getDrivers()
      if (res.data) {
        setDrivers(res.data)
      }
    } catch {
      toast.error("Failed to load driver roster")
    } finally {
      setLoadingDrivers(false)
    }
  }

  // Filter drivers by search query
  const filteredDrivers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return drivers
    return drivers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        (d.area_operates && d.area_operates.toLowerCase().includes(q))
    )
  }, [drivers, searchQuery])

  const selectedDriver = useMemo(() => {
    return drivers.find((d) => d.id === selectedDriverId) || null
  }, [drivers, selectedDriverId])

  const isDriverExpired = (d: Driver) => {
    const todayMs = new Date().setHours(0, 0, 0, 0)
    const expiries = [
      d.driving_license_expiry,
      d.phv_license_expiry,
      d.log_book_expiry,
      d.insurance_expiry,
      d.mot_expiry,
    ]
    return expiries.some((exp) => {
      if (!exp) return false
      const parts = exp.split("-").map(Number)
      let dt: Date
      if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        dt = new Date(parts[0], parts[1] - 1, parts[2])
      } else {
        dt = new Date(exp)
      }
      return !isNaN(dt.getTime()) && dt.setHours(0, 0, 0, 0) < todayMs
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking?.id) return

    if (!selectedDriverId) {
      toast.error("Please select a driver to assign")
      return
    }

    if (!driverPrice || isNaN(Number(driverPrice))) {
      toast.error("Please enter a valid driver price")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await assignDriverToBooking(
        booking.id,
        selectedDriverId,
        Number(driverPrice),
        driverInstructions
      )

      if (!res.success) {
        throw new Error(res.error || "Failed to assign driver")
      }

      toast.success(
        `Job assigned to ${selectedDriver?.name || "Driver"} at £${Number(driverPrice).toFixed(2)} (Status: Covered)`
      )
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Failed to assign driver")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnassign = async () => {
    if (!booking?.id) return
    setIsSubmitting(true)
    try {
      const res = await assignDriverToBooking(booking.id, null, 0, null)
      if (!res.success) throw new Error(res.error || "Failed to unassign driver")
      toast.success("Driver unassigned from booking")
      setSelectedDriverId("")
      setDriverPrice("")
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      toast.error(err.message || "Failed to unassign")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-lime-100 text-lime-800 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Assign Job to Driver</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Booking #{booking?.id?.slice(0, 5).toUpperCase()} • {booking?.first_name}{" "}
                {booking?.last_name} ({booking?.date} {booking?.time})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Driver Selection & Search */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center justify-between">
              <span>Select Driver <span className="text-red-500">*</span></span>
              {selectedDriver && (
                <span className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Selected: {selectedDriver.name}
                </span>
              )}
            </Label>

            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search drivers by name, phone #, or operating area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Driver list */}
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 bg-gray-50/50">
              {loadingDrivers ? (
                <div className="p-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-lime-600" />
                  Loading driver roster...
                </div>
              ) : filteredDrivers.length > 0 ? (
                filteredDrivers.map((d) => {
                  const isSelected = d.id === selectedDriverId
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDriverId(d.id!)}
                      className={`p-2.5 px-3 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs ${
                        isSelected
                          ? "bg-lime-100/70 border-l-4 border-l-lime-600 font-medium"
                          : "hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {d.photo_url ? (
                          <img
                            src={d.photo_url}
                            alt={d.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-lime-300 text-lime-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {d.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{d.name}</p>
                          <p className="text-gray-500 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" /> {d.phone}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-1.5">
                        {isDriverExpired(d) && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 font-bold px-1.5 py-0.5 rounded">
                            ⚠️ Expired Doc
                          </span>
                        )}
                        {d.area_operates && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border">
                            {d.area_operates}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-4 text-center text-xs text-gray-400">
                  No drivers matched your search
                </div>
              )}
            </div>
          </div>

          {/* Driver Price (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="driver-price" className="text-xs font-semibold flex items-center gap-1">
              Driver Price (£) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 font-bold text-gray-500">£</span>
              <Input
                id="driver-price"
                type="number"
                step="0.01"
                placeholder="e.g. 55.00"
                value={driverPrice}
                onChange={(e) => setDriverPrice(e.target.value)}
                className="pl-8 text-sm font-semibold"
                required
              />
            </div>
            <p className="text-[11px] text-gray-500">
              Customer Total Amount: £{Number(booking?.final_amount || booking?.total_amount || 0).toFixed(2)}
            </p>
          </div>

          {/* Driver Instructions (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="driver-instructions" className="text-xs font-semibold">
              Driver Instructions <span className="text-gray-400 font-normal">(Optional)</span>
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

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <span className="font-medium">
              Assigning this job will automatically change the Job Status to <strong>Covered</strong>.
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t flex flex-row items-center justify-between">
            <div>
              {booking?.driver_id && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUnassign}
                  disabled={isSubmitting}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                >
                  <UserX className="w-3.5 h-3.5 mr-1" /> Unassign Driver
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
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
                    Assigning...
                  </>
                ) : (
                  "Confirm Assignment"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
