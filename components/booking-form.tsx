"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { MapPin, Calendar, Clock, Plus, X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerInput } from "@/components/admin/booking/time-picker-input"
import { useBooking } from "@/context/booking-context"
import { toast } from "sonner"
import { googleLoader } from "@/lib/google.loader"
import { PointerHighlight } from "./ui/pointer-highlight"
import GoogleMapComponent from "@/components/leaflet-map"
import { useRouter } from "next/navigation"

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export default function BookingForm({ justForm = false }: { justForm?: boolean }) {
  const { booking: bookingDetails, updateBooking: updateBookingDetails, setEstimatedTime } = useBooking()
  const [pickupInput, setPickupInput] = useState(bookingDetails.pickup_location || "")
  const [dropoffInput, setDropoffInput] = useState(bookingDetails.drop_off_location || "")
  const [stopInput, setStopInput] = useState("")

  const pickupAutocompleteRef = useRef<any | null>(null)
  const dropoffAutocompleteRef = useRef<any | null>(null)

  const router = useRouter()

  const initializeGoogleMaps = async () => {
    try {
      const googleInstance = await googleLoader.load()

      // Initialize autocomplete for pickup
      const pickupElement = document.getElementById("pickup-input") as HTMLInputElement
      if (pickupElement) {
        const pickupAutocomplete = new googleInstance.maps.places.Autocomplete(pickupElement, {
          fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
          componentRestrictions: { country: "gb" },
        })

        pickupAutocomplete.addListener("place_changed", async () => {
          const place = pickupAutocomplete.getPlace()
          if (place) {
            const selectedText = pickupElement.value
            setPickupInput(selectedText)
            updateBookingDetails({
              pickup_location: selectedText,
            })
          }
        })
      }

      // Initialize autocomplete for dropoff
      const dropoffElement = document.getElementById("dropoff-input") as HTMLInputElement
      if (dropoffElement) {
        const dropoffAutocomplete = new googleInstance.maps.places.Autocomplete(dropoffElement, {
          fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
          componentRestrictions: { country: "gb" },
        })

        dropoffAutocomplete.addListener("place_changed", async () => {
          const place = dropoffAutocomplete.getPlace()
          if (place) {
            const selectedText = dropoffElement.value
            setDropoffInput(selectedText)
            updateBookingDetails({
              drop_off_location: selectedText,
            })
          }
        })
      }

      const stopElement = document.getElementById("stop-input") as HTMLInputElement
      if (stopElement) {
        const stopAutocomplete = new googleInstance.maps.places.Autocomplete(stopElement, {
          fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
          componentRestrictions: { country: "gb" },
        })

        stopAutocomplete.addListener("place_changed", async () => {
          const place = stopAutocomplete.getPlace()
          if (place) {
            const selectedText = stopElement.value
            setStopInput(selectedText)
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

  const formatDateUK = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calculateDistance = async () => {
    if (!bookingDetails.pickup_location || !bookingDetails.drop_off_location) {
      console.log("[v0] Cannot calculate distance: missing pickup or dropoff")
      return
    }

    try {
      const googleInstance = await googleLoader.load()
      const service = new googleInstance.maps.DistanceMatrixService()

      const waypoints = [bookingDetails.pickup_location || ""]
      ;((bookingDetails.stops as any[]) || []).forEach((stop: any) => waypoints.push(stop.address))
      waypoints.push(bookingDetails.drop_off_location)

      let totalDistance = 0
      let totalDuration = 0

      for (let i = 0; i < waypoints.length - 1; i++) {
        const result = await new Promise<any>((resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: [waypoints[i]],
              destinations: [waypoints[i + 1]],
              travelMode: googleInstance.maps.TravelMode.DRIVING,
              unitSystem: googleInstance.maps.UnitSystem.IMPERIAL,
              avoidHighways: false,
              avoidTolls: false,
            },
            (response, status) => {
              if (status === googleInstance.maps.DistanceMatrixStatus.OK) {
                resolve(response)
              } else {
                reject(new Error(`Distance Matrix API error: ${status}`))
              }
            },
          )
        })

        if (result.rows[0].elements[0].status === "OK") {
          const element = result.rows[0].elements[0]
          totalDistance += element.distance.value // in meters
          totalDuration += element.duration.value // in seconds
        }
      }

      let distanceInMiles = totalDistance * 0.000621371
      const durationInMinutes = Math.round(totalDuration / 60)
      if (bookingDetails.with_return) {
        distanceInMiles *= 2
      }

      updateBookingDetails({
        total_distance: Number.parseFloat(distanceInMiles.toFixed(2)),
      })

      setEstimatedTime(durationInMinutes.toString())
      router.push("/select-vehicle")
    } catch (error) {
      console.error("[v0] Error calculating distance:", error)
      toast.error("Could not calculate distance. Please try again.")
    }
  }

  const addStop = () => {
    if (stopInput.trim()) {
      const newStop = {
        id: `stop-${Date.now()}`,
        address: stopInput.trim(),
      }
      updateBookingDetails({ stops: [...((bookingDetails.stops as any[]) || []), newStop] })
      setStopInput("")
    }
  }

  const removeStop = (id: string) => {
    const updatedStops = ((bookingDetails.stops as any[]) || []).filter((stop: any) => stop.id !== id)
    updateBookingDetails({ stops: updatedStops })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !bookingDetails.pickup_location ||
      !bookingDetails.drop_off_location ||
      !bookingDetails.date ||
      !bookingDetails.time
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    if (bookingDetails.with_return && (!bookingDetails.return_date || !bookingDetails.return_time)) {
      toast.error("Please fill in return date and time")
      return
    }

    await calculateDistance()
    toast.success("Booking details completed!")
  }

  if (justForm) {
    return (
      <Card className="bg-white shadow-xl border border-neutral-200/80 p-4 w-full">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Location Fields - 2 Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Location */}
              <div className="space-y-2 text-left">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <MapPin className="w-4 h-4 text-lime-600" />
                  From
                </Label>
                <Input
                  id="pickup-input"
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickupInput}
                  onChange={(e) => {
                    setPickupInput(e.target.value)
                    updateBookingDetails({ pickup_location: e.target.value })
                  }}
                  className="h-9 text-base border-neutral-355 focus-visible:ring-lime-500 text-neutral-900"
                  required
                />
              </div>

              {/* Dropoff Location */}
              <div className="space-y-2 text-left">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <MapPin className="w-4 h-4 text-lime-600" />
                  To
                </Label>
                <Input
                  id="dropoff-input"
                  type="text"
                  placeholder="Enter destination"
                  value={dropoffInput}
                  onChange={(e) => {
                    setDropoffInput(e.target.value)
                    updateBookingDetails({ drop_off_location: e.target.value })
                  }}
                  className="h-9 text-base border-neutral-355 focus-visible:ring-lime-500 text-neutral-900"
                  required
                />
              </div>
            </div>

            {/* Stops Section */}
            <div className="space-y-4 text-left">
              <Label className="flex items-center gap-2 text-sm font-medium text-neutral-750">
                <Plus className="w-4 h-4 text-lime-600" />
                Add Stops (Optional)
              </Label>

              {((bookingDetails.stops as any[]) || []).length > 0 && (
                <div className="space-y-2">
                  {((bookingDetails.stops as any[]) || []).map((stop: any) => (
                    <div
                      key={stop.id}
                      className="flex items-center gap-2 p-2.5 bg-neutral-50 border border-neutral-100 rounded-lg"
                    >
                      <MapPin className="w-4 h-4 text-neutral-500" />
                      <span className="flex-1 text-sm text-neutral-700">{stop.address}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStop(stop.id)}
                        className="h-6 w-6 p-0 hover:bg-neutral-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Input
                  id="stop-input"
                  type="text"
                  placeholder="Add a stop (optional)"
                  value={stopInput}
                  onChange={(e) => {
                    setStopInput(e.target.value)
                  }}
                  className="h-9 text-base border-neutral-355 focus-visible:ring-lime-500 text-neutral-900"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addStop}
                  className="h-9 px-6 bg-transparent border-neutral-300 hover:bg-neutral-50 text-neutral-800"
                  disabled={!stopInput.trim()}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Date and Time - 2 Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Date */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-705">
                  <Calendar className="w-4 h-4 text-lime-600" />
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 px-4 text-base justify-start w-full border-neutral-300 hover:bg-neutral-50 text-neutral-800",
                        !bookingDetails.date && "text-neutral-400",
                      )}
                    >
                      <Calendar className="mr-3 h-4 w-4 text-neutral-450" />
                      {bookingDetails.date ? formatDateUK(bookingDetails.date) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={bookingDetails.date ? new Date(bookingDetails.date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          updateBookingDetails({ date: date.toISOString() })
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time (24-Hour Format - Any Minute) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-neutral-705">
                  <Clock className="w-4 h-4 text-lime-600" />
                  Time (24h)
                </Label>
                <TimePickerInput
                  value={bookingDetails.time || ""}
                  onChange={(time) => {
                    updateBookingDetails({ time })
                  }}
                  placeholder="Select time (HH:MM)"
                  allowEmpty
                  hideHelperText
                  inputClassName="h-9 text-base border-neutral-300 text-neutral-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 py-2">
              <Switch
                id="with-return"
                checked={!!bookingDetails.with_return}
                onCheckedChange={(checked) => {
                  updateBookingDetails({ with_return: checked })
                }}
                className="h-6 w-12 data-[state=checked]:bg-lime-500"
              />
              <Label
                htmlFor="with-return"
                className="text-base font-medium flex items-center gap-2 text-neutral-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-lime-600" />
                Round Trip
              </Label>
            </div>

            {/* Return Date and Time */}
            {bookingDetails.with_return && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Return Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Calendar className="w-4 h-4 text-lime-600" />
                    Return Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-9 px-4 text-base justify-start w-full border-neutral-300 hover:bg-neutral-50 text-neutral-800",
                          !bookingDetails.return_date && "text-neutral-400",
                        )}
                      >
                        <Calendar className="mr-3 h-4 w-4 text-neutral-400" />
                        {bookingDetails.return_date ? (
                          formatDateUK(bookingDetails.return_date)
                        ) : (
                          <span>Pick return date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={bookingDetails.return_date ? new Date(bookingDetails.return_date) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            updateBookingDetails({ return_date: date.toISOString() })
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Return Time (24-Hour Format - Any Minute) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                    <Clock className="w-4 h-4 text-lime-600" />
                    Return Time (24h)
                  </Label>
                  <TimePickerInput
                    value={bookingDetails.return_time || ""}
                    onChange={(returnTime) => {
                      updateBookingDetails({ return_time: returnTime })
                    }}
                    placeholder="Select return time (HH:MM)"
                    allowEmpty
                    hideHelperText
                    inputClassName="h-9 text-base border-neutral-300 text-neutral-800"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full text-lg font-semibold bg-lime-500 hover:bg-lime-600 text-black py-6 rounded-xl"
              >
                BOOK NOW →
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative w-full h-screen">
      {/* Header Section */}
      <div
        id="book-now"
        className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black via-gray-900 to-transparent"
      >
        <div className="container mx-auto px-4 pt-32">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex space-x-1 w-full justify-center items-center">
              Get Booked{" "}
              <PointerHighlight rectangleClassName="bg-lime-50/50" pointerClassName="text-accent">
                <h1 className="pl-1 text-accent">Now</h1>
              </PointerHighlight>
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Explore the latest vehicles and discover the best prices and deals
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow border p-4">
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-2">
                  {/* Location Fields - 2 Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pickup Location */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        From
                      </Label>
                      <Input
                        id="pickup-input"
                        type="text"
                        placeholder="Enter pickup location"
                        value={pickupInput}
                        onChange={(e) => {
                          setPickupInput(e.target.value)
                          updateBookingDetails({ pickup_location: e.target.value })
                        }}
                        className="h-9 text-base"
                        required
                      />
                    </div>

                    {/* Dropoff Location */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        To
                      </Label>
                      <Input
                        id="dropoff-input"
                        type="text"
                        placeholder="Enter destination"
                        value={dropoffInput}
                        onChange={(e) => {
                          setDropoffInput(e.target.value)
                          updateBookingDetails({ drop_off_location: e.target.value })
                        }}
                        className="h-9 text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Stops Section */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Plus className="w-4 h-4" />
                      Add Stops (Optional)
                    </Label>

                    {((bookingDetails.stops as any[]) || []).length > 0 && (
                      <div className="space-y-2">
                        {((bookingDetails.stops as any[]) || []).map((stop: any) => (
                          <div key={stop.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="flex-1 text-sm">{stop.address}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStop(stop.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Input
                        id="stop-input"
                        type="text"
                        placeholder="Add a stop (optional)"
                        value={stopInput}
                        onChange={(e) => {
                          setStopInput(e.target.value)
                        }}
                        className="h-9 text-base"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addStop}
                        className="h-9 px-6 bg-transparent"
                        disabled={!stopInput.trim()}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Date and Time - 2 Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-9 px-4 text-base justify-start w-full",
                              !bookingDetails.date && "text-muted-foreground",
                            )}
                          >
                            <Calendar className="mr-3 h-4 w-4" />
                            {bookingDetails.date ? formatDateUK(bookingDetails.date) : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={bookingDetails.date ? new Date(bookingDetails.date) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                updateBookingDetails({ date: date.toISOString() })
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time (24-Hour Format - Any Minute) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Time (24h)
                      </Label>
                      <TimePickerInput
                        value={bookingDetails.time || ""}
                        onChange={(time) => {
                          updateBookingDetails({ time })
                        }}
                        placeholder="Select time (HH:MM)"
                        allowEmpty
                        hideHelperText
                        inputClassName="h-9 text-base"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4 py-4">
                    <Switch
                      id="with-return"
                      checked={!!bookingDetails.with_return}
                      onCheckedChange={(checked) => {
                        updateBookingDetails({ with_return: checked })
                      }}
                      className="h-6 w-12"
                    />
                    <Label htmlFor="with-return" className="text-base font-medium flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Round Trip
                    </Label>
                  </div>

                  {/* Return Date and Time - 2 Column Layout (conditional) */}
                  {bookingDetails.with_return && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Return Date */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          Return Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-9 px-4 text-base justify-start w-full",
                                !bookingDetails.return_date && "text-muted-foreground",
                              )}
                            >
                              <Calendar className="mr-3 h-4 w-4" />
                              {bookingDetails.return_date ? (
                                formatDateUK(bookingDetails.return_date)
                              ) : (
                                <span>Pick return date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={bookingDetails.return_date ? new Date(bookingDetails.return_date) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  updateBookingDetails({ return_date: date.toISOString() })
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Return Time (24-Hour Format - Any Minute) */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          Return Time (24h)
                        </Label>
                        <TimePickerInput
                          value={bookingDetails.return_time || ""}
                          onChange={(returnTime) => {
                            updateBookingDetails({ return_time: returnTime })
                          }}
                          placeholder="Select return time (HH:MM)"
                          allowEmpty
                          hideHelperText
                          inputClassName="h-9 text-base"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button type="submit" className="w-full text-lg font-semibold bg-black hover:bg-gray-800">
                      BOOK NOW →
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="absolute inset-0 pt-80">
        <GoogleMapComponent />
      </div>
    </div>
  )
}
