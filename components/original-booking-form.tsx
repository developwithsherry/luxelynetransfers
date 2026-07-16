"use client"

import { useState, useEffect, useRef } from "react"
import { googleLoader } from "@/lib/google.loader"
import { CalendarIcon, Clock, MapPin, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBooking } from "@/context/booking-context"
import { toast } from "sonner"

type Location = {
  id: string
  address: string
  placeId?: string
  postalCode?: string
}

type TimeOption = {
  value: string
  label: string
  disabled: boolean
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

const BookingForm = () => {
  const { booking, updateBooking } = useBooking()
  const bookingDetails = booking as any
  const updateBookingDetails = updateBooking as any
  const [isCalculating, setIsCalculating] = useState(false)
  const [pickupError, setPickupError] = useState<string>("")
  const [dropoffError, setDropoffError] = useState<string>("")

  const pickupAutocompleteRef = useRef<any | null>(null)
  const dropoffAutocompleteRef = useRef<any | null>(null)
  const stopAutocompleteRefs = useRef<Map<string, any>>(new Map())

  useEffect(() => {
    const now = new Date()
    now.setHours(now.getHours() + 6)

    if (now.getMinutes() > 0 || now.getSeconds() > 0) {
      now.setHours(now.getHours() + 1)
      now.setMinutes(0)
      now.setSeconds(0)
    }

    const formatted = now.toTimeString().slice(0, 5)
    updateBookingDetails({ time: formatted })
  }, [])

  const generateTimeOptions = (selectedDate: Date): TimeOption[] => {
    const timeOptions: TimeOption[] = []
    const now = new Date()
    const isToday = selectedDate.toDateString() === now.toDateString()

    const minTime = new Date()
    minTime.setHours(minTime.getHours() + 6)
    if (minTime.getMinutes() > 0 || minTime.getSeconds() > 0) {
      minTime.setHours(minTime.getHours() + 1)
      minTime.setMinutes(0)
      minTime.setSeconds(0)
    }
    const minTimeString = minTime.toTimeString().slice(0, 5)

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourStr = hour.toString().padStart(2, "0")
        const minuteStr = minute.toString().padStart(2, "0")
        const value = `${hourStr}:${minuteStr}`

        const disabled = isToday ? value < minTimeString : false

        timeOptions.push({ value, label: value, disabled: disabled })
      }
    }

    return timeOptions
  }

  const timeOptions = generateTimeOptions(bookingDetails.date)

  const generateReturnTimeOptions = (selectedReturnDate: Date, outboundTime: string): TimeOption[] => {
    const timeOptions: TimeOption[] = []
    const now = new Date()
    const isToday = selectedReturnDate.toDateString() === now.toDateString()
    const isSameDay = selectedReturnDate.toDateString() === bookingDetails.date.toDateString()

    const minTime = new Date()
    minTime.setHours(minTime.getHours() + 6)
    if (minTime.getMinutes() > 0 || minTime.getSeconds() > 0) {
      minTime.setHours(minTime.getHours() + 1)
      minTime.setMinutes(0)
      minTime.setSeconds(0)
    }
    const minTimeString = minTime.toTimeString().slice(0, 5)

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourStr = hour.toString().padStart(2, "0")
        const minuteStr = minute.toString().padStart(2, "0")
        const value = `${hourStr}:${minuteStr}`

        let disabled = false

        if (isToday) {
          disabled = value < minTimeString
        } else if (isSameDay) {
          disabled = value <= outboundTime
        }

        timeOptions.push({ value, label: value, disabled: disabled })
      }
    }

    return timeOptions
  }

  const returnTimeOptions = generateReturnTimeOptions(bookingDetails.returnDate, bookingDetails.time)

  const initializeGoogleMaps = async () => {
    try {
      const googleInstance = await googleLoader.load()

      // Initialize autocomplete for pickup
      const pickupInput = document.getElementById("pickup") as HTMLInputElement
      if (pickupInput) {
        pickupAutocompleteRef.current = new googleInstance.maps.places.Autocomplete(pickupInput, {
          fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
          componentRestrictions: { country: "gb" },
        })

        pickupAutocompleteRef.current.addListener("place_changed", async () => {
          const place = pickupAutocompleteRef.current?.getPlace()
          if (place) {
            const selectedText = pickupInput.value
            const postalCode = extractPostalCodeFromPlace(place)
            updateBookingDetails({
              pickup: {
                id: "pickup",
                address: selectedText,
                placeId: place.place_id,
                postalCode: postalCode || undefined,
              },
            })
            setPickupError("")
          }
        })
      }

      // Initialize autocomplete for dropoff
      const dropoffInput = document.getElementById("dropoff") as HTMLInputElement
      if (dropoffInput) {
        dropoffAutocompleteRef.current = new googleInstance.maps.places.Autocomplete(dropoffInput, {
          fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
          componentRestrictions: { country: "gb" },
        })

        dropoffAutocompleteRef.current.addListener("place_changed", async () => {
          const place = dropoffAutocompleteRef.current?.getPlace()
          if (place) {
            const selectedText = dropoffInput.value
            const postalCode = extractPostalCodeFromPlace(place)
            updateBookingDetails({
              dropoff: {
                id: "dropoff",
                address: selectedText,
                placeId: place.place_id,
                postalCode: postalCode || undefined,
              },
            })
            setDropoffError("")
          }
        })
      }
    } catch (error) {
      console.error("Error loading Google Maps API:", error)
    }
  }

  useEffect(() => {
    initializeGoogleMaps()
  }, [])

  const extractPostalCodeFromPlace = (place: any): string | null => {
    const component = place.address_components?.find((c: any) => c.types.includes("postal_code"))
    return component ? component.long_name.split(" ")[0].toUpperCase() : null
  }

  const addStop = () => {
    const newStop: Location = {
      id: `stop-${Date.now()}`,
      address: "",
    }
    updateBookingDetails({ stops: [...(bookingDetails.stops as any[] || []), newStop] })
  }

  const removeStop = (id: string) => {
    const updatedStops = (bookingDetails.stops as any[] || []).filter((stop: any) => stop.id !== id)
    updateBookingDetails({ stops: updatedStops })
    stopAutocompleteRefs.current.delete(id)
  }

  const updateStopAddress = (id: string, address: string) => {
    const updatedStops = (bookingDetails.stops as any[] || []).map((stop: any) => (stop.id === id ? { ...stop, address } : stop))
    updateBookingDetails({ stops: updatedStops })
  }

  const handleBookNow = async () => {
    if (!bookingDetails.pickup.address || !bookingDetails.dropoff.address) {
      toast.error("Please enter pickup and drop-off locations.")
      return
    }

    if (!bookingDetails.time || !bookingDetails.date) {
      toast.error("Please select the date and time first.")
      return
    }

    if (bookingDetails.withReturn) {
      if (!bookingDetails.returnTime || !bookingDetails.returnDate) {
        toast.error("Please select return date and time.")
        return
      }
    }

    setIsCalculating(true)
    // Here you would typically navigate to the next step or process the booking
    toast.success("Booking details saved! Proceeding to vehicle selection...")
    setIsCalculating(false)
  }

  const formatDateUK = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Card className="border shadow-lg bg-white backdrop-blur-sm">
      <CardContent className="p-6">
        {/* With Return Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <Switch
              id="with-return"
              checked={bookingDetails.withReturn}
              onCheckedChange={(checked) => updateBookingDetails({ withReturn: checked })}
              className={cn(
                "peer h-7 w-14 rounded-full border-2 transition-all duration-300 ease-in-out",
                bookingDetails.withReturn
                  ? "bg-primary border-primary shadow-[0_0_10px_3px_rgba(8,145,178,0.3)]"
                  : "bg-gray-300",
              )}
            />
            {bookingDetails.withReturn && (
              <div className="absolute top-1 left-1 h-6 w-6 animate-ping rounded-full bg-primary/30 opacity-75 z-[-1]" />
            )}
          </div>

          <Label
            htmlFor="with-return"
            className="text-sm font-bold tracking-wide text-primary hover:scale-105 transition-transform duration-300"
          >
            ROUND TRIP
          </Label>
        </div>

        <div className="grid md:grid-cols-5 gap-4 md:gap-6">
          {/* Pickup Location */}
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="pickup" className="block text-sm font-medium">
              PICKUP LOCATION
            </label>
            <div className="relative">
              <Input
                id="pickup"
                placeholder="Enter pickup location"
                value={bookingDetails.pickup.address}
                onChange={(e) => {
                  updateBookingDetails({
                    pickup: { ...bookingDetails.pickup, address: e.target.value },
                  })
                }}
                className={pickupError ? "border-red-500" : ""}
              />
              {pickupError && <p className="text-red-500 text-xs mt-1">{pickupError}</p>}
            </div>
          </div>

          {/* Stops Container */}
          {bookingDetails.stops.length > 0 && (
            <div className="space-y-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">VIA</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addStop}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground md:hidden"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add stop</span>
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {((bookingDetails.stops as any[]) || []).map((stop: any, index: number) => (
                  <div key={stop.id} className="relative flex items-center">
                    <Input
                      id={`stop-${stop.id}`}
                      placeholder={`Stop ${index + 1}`}
                      value={stop.address}
                      onChange={(e) => updateStopAddress(stop.id, e.target.value)}
                      className="pl-10 pr-8"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStop(stop.id)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove stop</span>
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addStop}
                  className="w-full flex items-center justify-center gap-2 border-dashed hover:border-primary bg-transparent text-muted-foreground h-8"
                >
                  <Plus className="h-3 w-3" />
                  <span className="text-xs">Add another stop</span>
                </Button>
              </div>
            </div>
          )}

          {/* Add Stop Button */}
          <div className={`hidden md:flex items-end ${bookingDetails.stops.length > 0 ? "md:hidden" : ""}`}>
            <Button
              variant="outline"
              onClick={addStop}
              className="flex items-center justify-center gap-2 border-dashed hover:border-primary bg-transparent text-muted-foreground h-10 w-full"
            >
              <Plus className="h-4 w-4" />
              <span>Add Via</span>
            </Button>
          </div>

          {/* Drop Off */}
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="dropoff" className="block text-sm font-medium">
              DROP OFF
            </label>
            <div className="relative">
              <Input
                id="dropoff"
                placeholder="Enter destination"
                value={bookingDetails.dropoff.address}
                onChange={(e) => {
                  updateBookingDetails({
                    dropoff: { ...bookingDetails.dropoff, address: e.target.value },
                  })
                }}
                className={dropoffError ? "border-red-500" : ""}
              />
              {dropoffError && <p className="text-red-500 text-xs mt-1">{dropoffError}</p>}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium">PICK UP DATE</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !bookingDetails.date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bookingDetails.date ? (
                    formatDateUK(format(bookingDetails.date, "yyyy-MM-dd"))
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={bookingDetails.date}
                  onSelect={(date) => date && updateBookingDetails({ date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium">TIME</label>
            <Select value={bookingDetails.time} onValueChange={(time) => updateBookingDetails({ time })}>
              <SelectTrigger>
                <SelectValue placeholder="Select time">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {bookingDetails.time}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Return Trip Fields */}
        {bookingDetails.withReturn && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium mb-4 text-muted-foreground">RETURN TRIP DETAILS</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">RETURN DATE</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingDetails.returnDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDetails.returnDate ? (
                        formatDateUK(format(bookingDetails.returnDate, "yyyy-MM-dd"))
                      ) : (
                        <span>Pick return date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDetails.returnDate}
                      onSelect={(date) => date && updateBookingDetails({ returnDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">RETURN TIME</label>
                <Select
                  value={bookingDetails.returnTime}
                  onValueChange={(returnTime) => updateBookingDetails({ returnTime })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select return time">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {bookingDetails.returnTime}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {returnTimeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Add Stop Button - Mobile */}
        {bookingDetails.stops.length === 0 && (
          <Button
            variant="outline"
            onClick={addStop}
            className="flex md:hidden items-center justify-center gap-2 border-dashed hover:border-primary bg-transparent text-muted-foreground mt-4 w-full"
          >
            <Plus className="h-4 w-4" />
            <span>Add Via</span>
          </Button>
        )}

        {/* Book Now Button */}
        <Button
          onClick={handleBookNow}
          disabled={isCalculating}
          className="w-full mt-6 h-12 text-lg font-semibold"
        >
          {isCalculating ? "Processing..." : "BOOK NOW →"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default BookingForm