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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  Plane,
  FileText,
  Loader2,
  Edit3,
  Users,
  Luggage,
  Briefcase,
  Car,
  MapPin,
  Calendar,
  PoundSterling,
  UserCheck,
  Plus,
  X,
  User,
} from "lucide-react"
import { format, isValid } from "date-fns"
import type { Booking } from "@/types/booking"
import type { Supplier } from "@/types/supplier"
import type { Driver } from "@/types/driver"
import { HARDCODED_FLEET_CATEGORIES, getHardcodedVehicle } from "@/lib/fleet-categories"
import { getSuppliers } from "@/app/admin/suppliers/action"
import { getDrivers } from "@/app/admin/drivers/action"
import { updateBooking } from "@/app/admin/bookings/action"
import { DatePickerInput } from "./date-picker-input"
import { TimePickerInput, parseTimeString, formatTime24H } from "./time-picker-input"
import { toast } from "sonner"

interface EditBookingDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  booking: Booking
  onUpdated?: (updated: Booking) => void
}

function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr) return null
  const trimmed = dateStr.trim()
  const ymd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (ymd) {
    return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]))
  }
  const d = new Date(trimmed)
  return isValid(d) ? d : null
}

export function EditBookingDialog({
  open,
  setOpen,
  booking,
  onUpdated,
}: EditBookingDialogProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])

  // 1. Schedule (Date, Time & Return Trip)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string>("09:00")
  const [withReturn, setWithReturn] = useState<boolean>(false)
  const [returnDate, setReturnDate] = useState<Date | null>(null)
  const [returnTime, setReturnTime] = useState<string>("17:00")

  // 2. Journey Route & Stops
  const [pickupLocation, setPickupLocation] = useState<string>("")
  const [dropOffLocation, setDropOffLocation] = useState<string>("")
  const [stops, setStops] = useState<string[]>([])
  const [totalDistance, setTotalDistance] = useState<string>("")

  // 3. Passenger Contact Details
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [email, setEmail] = useState<string>("")

  // 4. Capacity & Vehicle Class
  const [noPassengers, setNoPassengers] = useState<string>("1")
  const [noLaguage, setNoLaguage] = useState<string>("0")
  const [noHandLaguage, setNoHandLaguage] = useState<string>("0")
  const [vehicleType, setVehicleType] = useState<string>("Saloon")

  // 5. Financials & Driver Assignment
  const [totalAmount, setTotalAmount] = useState<string>("0")
  const [driverId, setDriverId] = useState<string>("none")
  const [driverPrice, setDriverPrice] = useState<string>("0")

  // 6. Supplier & Source
  const [sourceType, setSourceType] = useState<string>("offline")
  const [supplierId, setSupplierId] = useState<string>("none")
  const [supplierReference, setSupplierReference] = useState<string>("")

  // 7. Flight & Instructions
  const [flightNo, setFlightNo] = useState<string>("")
  const [arrivingFrom, setArrivingFrom] = useState<string>("")
  const [driverInstructions, setDriverInstructions] = useState<string>("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      loadEntities()

      // Schedule
      setDate(parseLocalDate(booking.date) || new Date())
      const parsedOutTime = parseTimeString(booking.time || "09:00")
      setTime(parsedOutTime ? formatTime24H(parsedOutTime) : booking.time || "09:00")
      setWithReturn(Boolean(booking.with_return))
      setReturnDate(parseLocalDate(booking.return_date) || parseLocalDate(booking.date) || new Date())
      const parsedRetTime = parseTimeString(booking.return_time || "17:00")
      setReturnTime(parsedRetTime ? formatTime24H(parsedRetTime) : booking.return_time || "17:00")

      // Route & Stops
      setPickupLocation(booking.pickup_location || "")
      setDropOffLocation(booking.drop_off_location || "")
      let initialStops: string[] = []
      if (booking.stops) {
        if (Array.isArray(booking.stops)) {
          initialStops = booking.stops
        } else if (typeof booking.stops === "object" && Array.isArray((booking.stops as any).locations)) {
          initialStops = (booking.stops as any).locations
        }
      }
      setStops(initialStops)
      setTotalDistance(booking.total_distance != null ? String(booking.total_distance) : "")

      // Passenger Contact
      setFirstName(booking.first_name || "")
      setLastName(booking.last_name || "")
      setPhone(booking.phone || "")
      setEmail(booking.email || "")

      // Capacity & Vehicle
      setNoPassengers(String(booking.no_passengers ?? 1))
      setNoLaguage(String(booking.no_laguage ?? 0))
      setNoHandLaguage(String(booking.no_hand_laguage ?? 0))
      setVehicleType(
        booking.vehicle_type || booking.vehicle?.name || booking.vehicle?.type || "Saloon"
      )

      // Financials & Driver
      setTotalAmount(
        booking.total_amount != null
          ? String(booking.total_amount)
          : booking.final_amount != null
          ? String(booking.final_amount)
          : "0"
      )
      setDriverId(booking.driver_id || "none")
      setDriverPrice(booking.driver_price != null ? String(booking.driver_price) : "0")

      // Source & Supplier
      const isWeb =
        booking.source === "website" || (!booking.supplier_id && booking.type !== "offline")
      setSourceType(isWeb ? "website" : "offline")
      setSupplierId(booking.supplier_id || "none")
      setSupplierReference(booking.supplier_reference || "")

      // Flight & Instructions
      setFlightNo(booking.flight_no || "")
      setArrivingFrom(booking.arriving_from || "")
      setDriverInstructions(booking.driver_instructions || booking.intructions || "")
    }
  }, [open, booking])

  const loadEntities = async () => {
    try {
      const [supRes, drvRes] = await Promise.all([getSuppliers(), getDrivers()])
      if (supRes.data) setSuppliers(supRes.data)
      if (drvRes.data) setDrivers(drvRes.data)
    } catch (err) {
      console.error("Failed to load suppliers/drivers:", err)
    }
  }

  const addStop = () => setStops((prev) => [...prev, ""])
  const removeStop = (index: number) =>
    setStops((prev) => prev.filter((_, i) => i !== index))
  const updateStop = (index: number, val: string) =>
    setStops((prev) => prev.map((s, i) => (i === index ? val : s)))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!booking.id) return

    if (!pickupLocation.trim() || !dropOffLocation.trim()) {
      toast.error("Pickup and drop-off locations are required")
      return
    }

    setIsSubmitting(true)
    try {
      const cleanStops = stops.map((s) => s.trim()).filter(Boolean)
      const dateStr =
        date && isValid(date) ? format(date, "yyyy-MM-dd") : booking.date || ""
      const returnDateStr =
        withReturn && returnDate && isValid(returnDate)
          ? format(returnDate, "yyyy-MM-dd")
          : null

      const parsedTotalAmount = Number.parseFloat(totalAmount) || 0
      const parsedDriverPrice = Number.parseFloat(driverPrice) || 0
      const parsedDistance = totalDistance.trim()
        ? Number.parseFloat(totalDistance)
        : null

      const resolvedSupplierId = supplierId === "none" ? null : supplierId
      const resolvedDriverId = driverId === "none" ? null : driverId
      const resolvedSource = resolvedSupplierId ? "offline" : sourceType

      const updates: Partial<Booking> = {
        // Schedule
        date: dateStr,
        time: time.trim() || "09:00",
        with_return: withReturn,
        return_date: returnDateStr,
        return_time: withReturn ? returnTime.trim() || "17:00" : null,

        // Route & Stops
        pickup_location: pickupLocation.trim(),
        drop_off_location: dropOffLocation.trim(),
        stops: cleanStops.length > 0 ? { locations: cleanStops } : null,
        total_distance: parsedDistance,

        // Passenger Contact
        first_name: firstName.trim() || "Guest",
        last_name: lastName.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || undefined,

        // Capacity & Vehicle
        no_passengers: noPassengers ? Number.parseInt(noPassengers) : 1,
        no_laguage: noLaguage ? Number.parseInt(noLaguage) : 0,
        no_hand_laguage: noHandLaguage ? Number.parseInt(noHandLaguage) : 0,
        vehicle_type: vehicleType.trim() || null,

        // Financials & Driver
        total_amount: parsedTotalAmount,
        driver_id: resolvedDriverId,
        driver_price: parsedDriverPrice,

        // Source & Supplier
        source: resolvedSource,
        supplier_id: resolvedSupplierId,
        supplier_reference: supplierReference.trim() || null,

        // Flight & Instructions
        flight_no: flightNo.trim() || null,
        arriving_from: arrivingFrom.trim() || null,
        driver_instructions: driverInstructions.trim() || null,
      }

      const res = await updateBooking(booking.id, updates)
      if (!res.success) {
        throw new Error(res.error || "Failed to update booking")
      }

      toast.success("All booking details updated successfully")
      setOpen(false)

      if (onUpdated) {
        const chosenSupplier =
          suppliers.find((s) => s.id === resolvedSupplierId) || null
        const chosenDriver =
          drivers.find((d) => d.id === resolvedDriverId) || null
        const addonsTotal = (booking.addons || []).reduce(
          (sum, a: any) => sum + Number(a?.price || 0),
          0
        )

        onUpdated({
          ...booking,
          ...updates,
          final_amount: parsedTotalAmount + addonsTotal,
          supplier: chosenSupplier,
          driver: chosenDriver,
          vehicle: getHardcodedVehicle(vehicleType) || booking.vehicle,
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
      <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lime-100 text-lime-800 rounded-xl">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-950">
                Edit Complete Booking — #{booking.id?.slice(0, 5).toUpperCase()}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Modify schedule, route, passenger contact, vehicle, fare, driver pay, supplier, and flight details.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* 1. SCHEDULE: DATE, TIME & RETURN */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-lime-600" />
                <span>1. Schedule (Date & Time)</span>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="edit-with-return" className="text-xs font-semibold text-slate-700">
                  Return Trip
                </Label>
                <Switch
                  id="edit-with-return"
                  checked={withReturn}
                  onCheckedChange={setWithReturn}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Pickup Date</Label>
                <DatePickerInput value={date} onChange={setDate} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Pickup Time (24h)</Label>
                <TimePickerInput value={time} onChange={setTime} />
              </div>
            </div>

            {withReturn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-lime-800">Return Date</Label>
                  <DatePickerInput value={returnDate} onChange={setReturnDate} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-lime-800">Return Time (24h)</Label>
                  <TimePickerInput value={returnTime} onChange={setReturnTime} />
                </div>
              </div>
            )}
          </div>

          {/* 2. JOURNEY ROUTE, STOPS & DISTANCE */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-lime-600" />
                <span>2. Route, Via Stops & Distance</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStop}
                className="h-7 px-2.5 text-xs font-semibold"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Via Stop
              </Button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Pickup Location</Label>
                <Input
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Full pickup address, postcode, or airport terminal"
                  className="text-xs"
                  required
                />
              </div>

              {stops.length > 0 && (
                <div className="space-y-2 pl-3 border-l-2 border-amber-400">
                  {stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={stop}
                        onChange={(e) => updateStop(idx, e.target.value)}
                        placeholder={`Stop ${idx + 1} address or postcode`}
                        className="text-xs h-8"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStop(idx)}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs font-medium">Drop-off Location</Label>
                  <Input
                    value={dropOffLocation}
                    onChange={(e) => setDropOffLocation(e.target.value)}
                    placeholder="Full drop-off destination address or postcode"
                    className="text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Distance (miles)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={totalDistance}
                    onChange={(e) => setTotalDistance(e.target.value)}
                    placeholder="e.g. 24.5"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. PASSENGER CONTACT DETAILS */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <User className="w-4 h-4 text-lime-600" />
              <span>3. Passenger Contact Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">First / Lead Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="bg-white text-xs"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Last Name (Optional)</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="bg-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Mobile / Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7..."
                  className="bg-white text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Email (Optional)</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="passenger@email.com"
                  className="bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4. CAPACITY & VEHICLE CATEGORY */}
          <div className="p-4 rounded-xl border border-lime-200 bg-lime-50/30 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Car className="w-4 h-4 text-lime-700" />
              <span>4. Passengers, Luggage & Vehicle Class</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Vehicle Category</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="bg-white text-xs">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDCODED_FLEET_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name} className="text-xs">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-500" />
                  Passengers
                </Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={noPassengers}
                  onChange={(e) => setNoPassengers(e.target.value)}
                  className="bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Luggage className="w-3 h-3 text-slate-500" />
                  Luggage
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={noLaguage}
                  onChange={(e) => setNoLaguage(e.target.value)}
                  className="bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-500" />
                  Handbags
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={noHandLaguage}
                  onChange={(e) => setNoHandLaguage(e.target.value)}
                  className="bg-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* 5. FINANCIALS & DRIVER ALLOCATION */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              <PoundSterling className="w-4 h-4 text-emerald-700" />
              <span>5. Fare, Driver Allocation & Driver Payout</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Customer Total Fare (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="bg-white text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-600" />
                  Assigned Driver
                </Label>
                <Select value={driverId} onValueChange={setDriverId}>
                  <SelectTrigger className="bg-white text-xs">
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned (No Driver)</SelectItem>
                    {drivers.map((drv) => (
                      <SelectItem key={drv.id} value={drv.id!}>
                        {drv.name} ({drv.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-medium">Driver Payout (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={driverPrice}
                  onChange={(e) => setDriverPrice(e.target.value)}
                  className="bg-white text-xs font-bold text-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* 6. SUPPLIER & FLIGHT DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supplier */}
            <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/30 space-y-3">
              <div className="flex items-center gap-1.5 text-purple-950 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>6. Source & Supplier</span>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Partner Supplier</Label>
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger className="bg-white text-xs">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        {sourceType === "website"
                          ? "Website (Direct Online)"
                          : "Direct Offline (No Supplier)"}
                      </SelectItem>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id!}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Supplier Reference #</Label>
                  <Input
                    value={supplierReference}
                    onChange={(e) => setSupplierReference(e.target.value)}
                    placeholder="e.g. SUP-9982"
                    className="bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Flight Info */}
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/30 space-y-3">
              <div className="flex items-center gap-1.5 text-sky-950 font-bold text-xs uppercase tracking-wider">
                <Plane className="w-4 h-4 text-sky-600" />
                <span>7. Flight Details (Optional)</span>
              </div>

              <div className="space-y-2.5">
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Flight Number</Label>
                  <Input
                    value={flightNo}
                    onChange={(e) => setFlightNo(e.target.value)}
                    placeholder="e.g. BA 145"
                    className="bg-white text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium">Arriving From</Label>
                  <Input
                    value={arrivingFrom}
                    onChange={(e) => setArrivingFrom(e.target.value)}
                    placeholder="e.g. Dubai DXB"
                    className="bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 8. DRIVER & SPECIAL INSTRUCTIONS */}
          <div className="space-y-1.5">
            <Label
              htmlFor="driver-instructions"
              className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              8. Driver & Special Instructions (Optional)
            </Label>
            <Textarea
              id="driver-instructions"
              rows={2}
              placeholder="e.g. Meet inside arrivals with nameboard. Child seat required."
              value={driverInstructions}
              onChange={(e) => setDriverInstructions(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-3 border-t">
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
              className="bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving All Changes...
                </>
              ) : (
                "Save All Booking Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
