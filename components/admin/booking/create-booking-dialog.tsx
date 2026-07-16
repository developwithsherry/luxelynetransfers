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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Plus, X, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { formatDateUK } from "@/lib/format-util"
import { toast } from "sonner"
import type { Booking } from "@/types/booking"
import type { Vehicle } from "@/types/vehicle"

import { getActiveVehicles } from "@/app/select-vehicle/action"
interface CreateBookingDialogProps {
  onBookingCreated: (booking: Booking) => void
  trigger?: React.ReactNode
}

type TimeOption = {
  value: string
  label: string
}

export function CreateBookingDialog({ onBookingCreated, trigger }: CreateBookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Customer information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Journey details
    pickupLocation: "",
    dropOffLocation: "",
    date: new Date(),
    time: "09:00",

    // Return trip
    withReturn: false,
    returnDate: new Date(),
    returnTime: "17:00",

    // Vehicle and pricing
    vehicleId: "",
    totalDistance: "",
    totalAmount: "",

    // Booking details
    status: "confirmed" as const,
    paymentStatus: "pending" as const,
  })

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [stops, setStops] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      loadVehicles()
    }
  }, [open])

  const loadVehicles = async () => {
    setVehiclesLoading(true)
    try {
      const result = await getActiveVehicles()
      if (result.success && result.data) {
        setVehicles(result.data)
      } else {
        toast.error(`Failed to load vehicles: ${result.error}`)
      }
    } catch (error) {
      console.error("Error loading vehicles:", error)
      toast.error("Failed to load vehicles")
    } finally {
      setVehiclesLoading(false)
    }
  }

  // Generate time options in 15-minute intervals
  const timeOptions: TimeOption[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour.toString().padStart(2, "0")
      const minuteStr = minute.toString().padStart(2, "0")
      const value = `${hourStr}:${minuteStr}`
      const label = `${hourStr}:${minuteStr}`
      timeOptions.push({ value, label })
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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pickupLocation: "",
      dropOffLocation: "",
      date: new Date(),
      time: "09:00",
      withReturn: false,
      returnDate: new Date(),
      returnTime: "17:00",
      vehicleId: "",
      totalDistance: "",
      totalAmount: "",
      status: "confirmed",
      paymentStatus: "pending",
    })
    setStops([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all customer information fields")
      return
    }

    if (!formData.pickupLocation || !formData.dropOffLocation) {
      toast.error("Please provide pickup and drop-off locations")
      return
    }

    if (!formData.vehicleId) {
      toast.error("Please select a vehicle")
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
        // Customer information
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,

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

        // Vehicle and pricing
        vehicle_id: formData.vehicleId,
        total_distance: formData.totalDistance ? Number.parseFloat(formData.totalDistance) : null,
        unit: "miles",
        total_amount: Number.parseFloat(formData.totalAmount),

        // Booking metadata - Note: status will be overridden to "pending" in the server function
        type: "offline", // Set type to offline for manual bookings
      }

      // Call server action to create booking
      const result = await createBooking(bookingData)

      if (result.success && result.data) {
        toast.success("Booking created successfully!")

        // Create a mock booking object for the callback
        const createdBooking: Booking = {
          id: result.data.booking_id,
          created_at: new Date().toISOString(),
          pickup_location: formData.pickupLocation,
          drop_off_location: formData.dropOffLocation,
          date: format(formData.date, "yyyy-MM-dd"),
          time: formData.time,
          stops:
            stops.filter((stop) => stop.trim()).length > 0 ? { locations: stops.filter((stop) => stop.trim()) } : null,
          total_distance: formData.totalDistance ? Number.parseFloat(formData.totalDistance) : null,
          unit: "miles",
          status: "pending", // Server function sets this to pending
          total_amount: Number.parseFloat(formData.totalAmount),
          vehicle_id: formData.vehicleId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          payment_id: null,
          payment_status: "pending",
          with_return: formData.withReturn,
          return_date: formData.withReturn ? format(formData.returnDate, "yyyy-MM-dd") : null,
          return_time: formData.withReturn ? formData.returnTime : null,
          type: "offline",
          payments: [],
          vehicle: vehicles.find((v) => v.id.toString() === formData.vehicleId) || ({} as Vehicle),
        }

        

       
        toast.success("Booking created successfully")
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

  // Show loading state while vehicles are being fetched
  if (vehiclesLoading && open) {
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

        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Loading Vehicles</h3>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we fetch the available vehicles...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
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
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+44 7123 456789"
                  required
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? formatDateUK(format(formData.date, "yyyy-MM-dd")) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleInputChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Time *</Label>
                <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {formData.time}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Return Journey Details */}
          {formData.withReturn && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h3 className="text-lg font-semibold">Return Journey</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Return Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.returnDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.returnDate ? (
                          formatDateUK(format(formData.returnDate, "yyyy-MM-dd"))
                        ) : (
                          <span>Pick return date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.returnDate}
                        onSelect={(date) => date && handleInputChange("returnDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Return Time *</Label>
                  <Select value={formData.returnTime} onValueChange={(value) => handleInputChange("returnTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select return time">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {formData.returnTime}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Label htmlFor="vehicleId">Vehicle *</Label>
                <Select value={formData.vehicleId} onValueChange={(value) => handleInputChange("vehicleId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length === 0 ? (
                      <SelectItem value="" disabled>
                        No vehicles available
                      </SelectItem>
                    ) : (
                      vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.name} - {vehicle.type}
                        </SelectItem>
                      ))
                    )}
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
