"use client"

import type React from "react"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Plus, X, MapPin, Loader2, Building2, Plane, FileText, Users, Luggage, Briefcase } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { formatDateUK } from "@/lib/format-util"
import { toast } from "sonner"
import type { Booking } from "@/types/booking"
import type { Vehicle } from "@/types/vehicle"
import { HARDCODED_FLEET_CATEGORIES, getHardcodedVehicle } from "@/lib/fleet-categories"
import { getSuppliers } from "@/app/admin/suppliers/action"
import { createBooking } from "@/lib/create-booking"
import type { Supplier } from "@/types/supplier"
import { DatePickerInput } from "./date-picker-input"
import { TimePickerInput } from "./time-picker-input"

interface CreateBookingDialogProps {
  onBookingCreated: (booking: Booking) => void
  trigger?: React.ReactNode
}

export function CreateBookingDialog({ onBookingCreated, trigger }: CreateBookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Supplier Information
    supplierId: "",
    supplierReference: "",

    // Customer information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Passengers & Luggage (optional)
    noPassengers: "1",
    noLaguage: "0",
    noHandLaguage: "0",

    // Flight Information
    flightNo: "",
    arrivingFrom: "",

    // Journey details
    pickupLocation: "",
    dropOffLocation: "",
    date: new Date(),
    time: "09:00",

    // Return trip
    withReturn: false,
    returnDate: new Date(),
    returnTime: "17:00",

    // Vehicle and pricing (Hardcoded offline categories: Saloon, Estate, MPV, Minibus, Executive Saloon, Executive Minibus)
    vehicleCategory: "Saloon",
    totalDistance: "",
    totalAmount: "",

    // Driver Instructions
    driverInstructions: "",

    // Booking details
    status: "confirmed" as const,
    paymentStatus: "pending" as const,
  })

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [stops, setStops] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      loadSuppliers()
    }
  }, [open])

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers()
      if (res.data) {
        setSuppliers(res.data)
      }
    } catch (err) {
      console.error("Failed to load suppliers:", err)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addStop = () => {
    setStops((prev) => [...prev, ""])
  }

  const removeStop = (index: number) => {
    setStops((prev) => prev.filter((_, i) => i !== index))
  }

  const updateStop = (index: number, value: string) => {
    setStops((prev) => prev.map((stop, i) => (i === index ? value : stop)))
  }

  const resetForm = () => {
    setFormData({
      supplierId: "",
      supplierReference: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      noPassengers: "1",
      noLaguage: "0",
      noHandLaguage: "0",
      flightNo: "",
      arrivingFrom: "",
      pickupLocation: "",
      dropOffLocation: "",
      date: new Date(),
      time: "09:00",
      withReturn: false,
      returnDate: new Date(),
      returnTime: "17:00",
      vehicleCategory: "Saloon",
      totalDistance: "",
      totalAmount: "",
      driverInstructions: "",
      status: "confirmed",
      paymentStatus: "pending",
    })
    setStops([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation: Only lead customer/passenger name and journey details are required
    if (!formData.firstName.trim()) {
      toast.error("Please enter customer name or passenger lead name")
      return
    }

    if (!formData.pickupLocation || !formData.dropOffLocation) {
      toast.error("Please provide pickup and drop-off locations")
      return
    }

    if (!formData.vehicleCategory) {
      toast.error("Please select a vehicle category")
      return
    }

    if (!formData.totalAmount) {
      toast.error("Please enter the total amount")
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare booking data
      const bookingData: Partial<Booking> = {
        // Supplier details
        supplier_id: formData.supplierId && formData.supplierId !== "none" ? formData.supplierId : null,
        supplier_reference: formData.supplierReference ? formData.supplierReference.trim() : null,
        source: "offline",

        // Customer information (email and phone are optional)
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim() || null,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,

        // Passengers & Luggage (optional)
        no_passengers: formData.noPassengers ? Number.parseInt(formData.noPassengers) : 1,
        no_laguage: formData.noLaguage ? Number.parseInt(formData.noLaguage) : 0,
        no_hand_laguage: formData.noHandLaguage ? Number.parseInt(formData.noHandLaguage) : 0,

        // Flight details
        flight_no: formData.flightNo || null,
        arriving_from: formData.arrivingFrom || null,

        // Journey details
        pickup_location: formData.pickupLocation,
        drop_off_location: formData.dropOffLocation,
        date: format(formData.date, "yyyy-MM-dd"),
        time: formData.time,

        // Return trip information
        with_return: formData.withReturn,
        return_date: formData.withReturn ? format(formData.returnDate, "yyyy-MM-dd") : null,
        return_time: formData.withReturn ? formData.returnTime : null,

        // Stops
        stops:
          stops.filter((stop) => stop.trim()).length > 0 ? { locations: stops.filter((stop) => stop.trim()) } : null,

        // Driver instructions
        driver_instructions: formData.driverInstructions || null,

        // Vehicle and pricing
        vehicle_type: formData.vehicleCategory,
        vehicle_id: null,
        total_distance: formData.totalDistance ? Number.parseFloat(formData.totalDistance) : null,
        unit: "miles",
        total_amount: Number.parseFloat(formData.totalAmount),

        type: "offline",
      }

      // Call server action to create booking
      const result = await createBooking(bookingData)

      if (result.success && result.data) {
        const createdId = result.data.id || result.data.booking_id || ""
        const systemRef = createdId ? `#${createdId.slice(0, 5).toUpperCase()}` : ""
        toast.success(`Booking created successfully! ${systemRef ? `Reference: ${systemRef}` : ""}`)

        // Create a booking object for the callback
        const createdBooking: Booking = {
          id: createdId,
          created_at: new Date().toISOString(),
          pickup_location: formData.pickupLocation,
          drop_off_location: formData.dropOffLocation,
          date: format(formData.date, "yyyy-MM-dd"),
          time: formData.time,
          supplier_id: formData.supplierId && formData.supplierId !== "none" ? formData.supplierId : undefined,
          supplier_reference: formData.supplierReference ? formData.supplierReference.trim() : undefined,
          source: "offline",
          flight_no: formData.flightNo || undefined,
          arriving_from: formData.arrivingFrom || undefined,
          driver_instructions: formData.driverInstructions || undefined,
          stops:
            stops.filter((stop) => stop.trim()).length > 0 ? { locations: stops.filter((stop) => stop.trim()) } : null,
          total_distance: formData.totalDistance ? Number.parseFloat(formData.totalDistance) : null,
          unit: "miles",
          status: "confirmed",
          total_amount: Number.parseFloat(formData.totalAmount),
          vehicle_id: null,
          vehicle_type: formData.vehicleCategory,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          email: formData.email.trim() || undefined,
          no_passengers: formData.noPassengers ? Number.parseInt(formData.noPassengers) : 1,
          no_laguage: formData.noLaguage ? Number.parseInt(formData.noLaguage) : 0,
          no_hand_laguage: formData.noHandLaguage ? Number.parseInt(formData.noHandLaguage) : 0,
          payment_id: null,
          payment_status: "pending",
          with_return: formData.withReturn,
          return_date: formData.withReturn ? format(formData.returnDate, "yyyy-MM-dd") : null,
          return_time: formData.withReturn ? formData.returnTime : null,
          type: "offline",
          payments: [],
          vehicle: getHardcodedVehicle(formData.vehicleCategory) || ({} as Vehicle),
        }

        onBookingCreated(createdBooking)
        resetForm()
        setOpen(false)
      } else {
        throw new Error(result.error || "Failed to create booking")
      }
    } catch (error: any) {
      console.error("Error creating booking:", error)
      toast.error(`Failed to create booking: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Offline Booking
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Offline Booking</DialogTitle>
          <DialogDescription>
            Manually create a booking for customers who book via phone or in-person.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier Section (Optional) */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
            <div className="flex items-center gap-2 text-purple-900 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Supplier & Source (Optional)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="supplierId" className="text-xs font-medium">Select Supplier</Label>
                <Select
                  value={formData.supplierId || "none"}
                  onValueChange={(val) => handleInputChange("supplierId", val === "none" ? "" : val)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select supplier (or leave direct)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Direct Offline Booking (No Supplier)</SelectItem>
                    {suppliers.map((sup) => (
                      <SelectItem key={sup.id} value={sup.id!}>
                        {sup.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="supplierReference" className="text-xs font-medium">Supplier Reference # (Optional)</Label>
                <Input
                  id="supplierReference"
                  value={formData.supplierReference}
                  onChange={(e) => handleInputChange("supplierReference", e.target.value)}
                  placeholder="e.g. SUP-48201"
                  className="bg-white"
                />
                <p className="text-[10px] text-purple-700">
                  Our system reference will always be assigned by default. The supplier reference will be saved inside the job.
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <span className="text-xs text-gray-500">Contact details optional for supplier jobs</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name / Lead Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name (Optional)</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john.doe@example.com (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+44 7123 456789 (optional)"
                />
              </div>
            </div>
          </div>

          {/* Passengers & Luggage (Optional) */}
          <div className="p-4 rounded-xl border border-lime-200 bg-lime-50/40 space-y-3">
            <div className="flex items-center gap-2 text-lime-950 font-semibold text-sm">
              <Users className="w-4 h-4 text-lime-700" />
              <span>Passengers & Luggage Details (Optional)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="noPassengers" className="text-xs font-medium flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Passengers
                </Label>
                <Input
                  id="noPassengers"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.noPassengers}
                  onChange={(e) => handleInputChange("noPassengers", e.target.value)}
                  placeholder="1"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noLaguage" className="text-xs font-medium flex items-center gap-1.5">
                  <Luggage className="w-3.5 h-3.5 text-slate-500" />
                  Luggage / Suitcases
                </Label>
                <Input
                  id="noLaguage"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.noLaguage}
                  onChange={(e) => handleInputChange("noLaguage", e.target.value)}
                  placeholder="0"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noHandLaguage" className="text-xs font-medium flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  Hand Luggage
                </Label>
                <Input
                  id="noHandLaguage"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.noHandLaguage}
                  onChange={(e) => handleInputChange("noHandLaguage", e.target.value)}
                  placeholder="0"
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Return Trip Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="withReturn"
              checked={formData.withReturn}
              onCheckedChange={(checked) => handleInputChange("withReturn", checked)}
            />
            <Label htmlFor="withReturn" className="text-sm font-medium">
              Return Trip
            </Label>
          </div>

          {/* Journey Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{formData.withReturn ? "Outbound Journey" : "Journey Details"}</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <Input
                  id="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                  placeholder="Enter pickup address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropOffLocation">Drop-off Location *</Label>
                <Input
                  id="dropOffLocation"
                  value={formData.dropOffLocation}
                  onChange={(e) => handleInputChange("dropOffLocation", e.target.value)}
                  placeholder="Enter drop-off address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="pickupDate">Date *</Label>
                <DatePickerInput
                  id="pickupDate"
                  value={formData.date}
                  onChange={(date) => handleInputChange("date", date)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="pickupTime">Time (24h) *</Label>
                <TimePickerInput
                  id="pickupTime"
                  value={formData.time}
                  onChange={(time) => handleInputChange("time", time)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Return Journey Details */}
          {formData.withReturn && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-semibold">Return Journey</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="returnDate">Return Date *</Label>
                  <DatePickerInput
                    id="returnDate"
                    value={formData.returnDate}
                    onChange={(date) => handleInputChange("returnDate", date)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="returnTime">Return Time (24h) *</Label>
                  <TimePickerInput
                    id="returnTime"
                    value={formData.returnTime}
                    onChange={(time) => handleInputChange("returnTime", time)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stops */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Via Stops (Optional)</h3>
              <Button type="button" variant="outline" size="sm" onClick={addStop}>
                <Plus className="mr-2 h-4 w-4" />
                Add Stop
              </Button>
            </div>

            {stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={stop}
                  onChange={(e) => updateStop(index, e.target.value)}
                  placeholder={`Stop ${index + 1} address`}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeStop(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Vehicle and Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle & Pricing</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleCategory">Vehicle *</Label>
                <Select
                  value={formData.vehicleCategory}
                  onValueChange={(value) => handleInputChange("vehicleCategory", value)}
                >
                  <SelectTrigger id="vehicleCategory">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {HARDCODED_FLEET_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDistance">Distance (miles)</Label>
                <Input
                  id="totalDistance"
                  type="number"
                  step="0.1"
                  value={formData.totalDistance}
                  onChange={(e) => handleInputChange("totalDistance", e.target.value)}
                  placeholder="25.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount (£) *</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                  placeholder="45.00"
                  required
                />
              </div>
            </div>
          </div>

          {/* Flight Details (Optional) */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 space-y-3">
            <div className="flex items-center gap-2 text-sky-950 font-semibold text-sm">
              <Plane className="w-4 h-4 text-sky-600" />
              <span>Flight Details (Optional)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="flightNo" className="text-xs font-medium">Flight Number</Label>
                <Input
                  id="flightNo"
                  value={formData.flightNo}
                  onChange={(e) => handleInputChange("flightNo", e.target.value)}
                  placeholder="e.g. BA 117"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="arrivingFrom" className="text-xs font-medium">Arriving From</Label>
                <Input
                  id="arrivingFrom"
                  value={formData.arrivingFrom}
                  onChange={(e) => handleInputChange("arrivingFrom", e.target.value)}
                  placeholder="e.g. New York JFK"
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Driver Instructions (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="driverInstructions" className="text-sm font-semibold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-500" />
              Driver Instructions (Optional)
            </Label>
            <Textarea
              id="driverInstructions"
              rows={2}
              value={formData.driverInstructions}
              onChange={(e) => handleInputChange("driverInstructions", e.target.value)}
              placeholder="e.g. Meet passenger with nameboard inside arrivals. Assist with luggage."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
