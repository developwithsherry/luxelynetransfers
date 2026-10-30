"use client"

import { useState, useEffect, useRef } from "react"
import { googleLoader } from "@/lib/google.loader"
import { CalendarIcon, MapPin, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerInput } from "@/components/admin/booking/time-picker-input"
import { useRouter } from "next/navigation"
import { formatDateUK } from "@/lib/format-util"
import { extractPostalCodeFromPlace, extractPostalCode, getPostcodeFromGeocodeAPI } from "@/lib/manage-hotspot-route"
import { checkHotspotRoute } from "@/lib/hotspot-routes"
import { toast } from "sonner"
import { getPostcodeExtras } from "@/lib/postcode-extras"

type Location = {
  id: string
  address: string
  placeId?: string
  postalCode?: string
}

const FareCalculator = () => {
  const router = useRouter()
  const [pickup, setPickup] = useState<Location>({ id: "pickup", address: "" })
  const [dropoff, setDropoff] = useState<Location>({ id: "dropoff", address: "" })
  const [stops, setStops] = useState<Location[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState<string>("09:00")

  // Return trip states
  const [withReturn, setWithReturn] = useState<boolean>(false)
  const [returnDate, setReturnDate] = useState<Date>(new Date())
  const [returnTime, setReturnTime] = useState<string>("17:00")

  const [isCalculating, setIsCalculating] = useState(false)
  const [pickupError, setPickupError] = useState<string>("")
  const [dropoffError, setDropoffError] = useState<string>("")

  // Postcode extras state
  const [postcodeExtras, setPostcodeExtras] = useState<number>(0)
  const [checkingExtras, setCheckingExtras] = useState(false)

  // Return discount state
  const [returnDiscount, setReturnDiscount] = useState<number>(0)
  const [loadingReturnDiscount, setLoadingReturnDiscount] = useState(false)

  const pickupAutocompleteRef = useRef<any | null>(null)
  const dropoffAutocompleteRef = useRef<any | null>(null)
  const stopAutocompleteRefs = useRef<Map<string, any>>(new Map())

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
          const selectedTextGeo = pickupAutocompleteRef.current?.value || ""
          if (place) {
            const selectedText = pickupInput.value
            let postalCode = extractPostalCodeFromPlace(place)
            if (!postalCode) {
              postalCode = await getPostcodeFromGeocodeAPI(selectedTextGeo)
            }
            setPickup({
              id: "pickup",
              address: selectedText,
              placeId: place.place_id,
              postalCode: postalCode || undefined,
            })
            setPickupError("")
          } else {
            if (pickupInput && pickupInput.value) {
              if (isUKLocation(pickupInput.value)) {
                const postalCode = extractPostalCode(pickupInput.value)
                setPickup({
                  id: "pickup",
                  address: pickupInput.value,
                  postalCode: postalCode || undefined,
                })
                setPickupError("")
              } else {
                setPickupError("Location not found")
              }
            } else {
              setPickupError("Location not found")
            }
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
          const selectedTextGeo = pickupAutocompleteRef.current?.value || ""
          if (place) {
            const selectedText = dropoffInput.value
            let postalCode = extractPostalCodeFromPlace(place)
            if (!postalCode) {
              postalCode = await getPostcodeFromGeocodeAPI(selectedTextGeo)
            }
            setDropoff({
              id: "dropoff",
              address: selectedText,
              placeId: place.place_id,
              postalCode: postalCode || undefined,
            })
            setDropoffError("")
          } else {
            if (dropoffInput && dropoffInput.value) {
              if (isUKLocation(dropoffInput.value)) {
                const postalCode = extractPostalCode(dropoffInput.value)
                setDropoff({
                  id: "dropoff",
                  address: dropoffInput.value,
                  postalCode: postalCode || undefined,
                })
                setDropoffError("")
              } else {
                setDropoffError("Location not found")
              }
            } else {
              setDropoffError("Location not found")
            }
          }
        })
      }

      // Initialize autocomplete for existing stops
      stops.forEach((stop) => {
        initializeStopAutocomplete(stop.id, googleInstance)
      })
    } catch (error) {
      console.error("Error loading Google Maps API:", error)
    }
  }

  useEffect(() => {
    initializeGoogleMaps()
  }, [])

  useEffect(() => {
    stops.forEach((stop) => {
      if (!stopAutocompleteRefs.current.has(stop.id)) {
        if (window.google && window.google.maps && window.google.maps.places) {
          initializeStopAutocomplete(stop.id, window.google)
        }
      }
    })
  }, [stops])

  const initializeStopAutocomplete = (stopId: string, googleInstance: any) => {
    const stopInput = document.getElementById(`stop-${stopId}`) as HTMLInputElement
    if (!stopInput) return

    const autocomplete = new googleInstance.maps.places.Autocomplete(stopInput, {
      fields: ["place_id", "formatted_address", "geometry", "name", "address_components"],
      componentRestrictions: { country: "gb" },
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place) {
        const selectedText = stopInput.value
        const postalCode = extractPostalCodeFromPlace(place)
        setStops((prevStops) =>
          prevStops.map((stop) =>
            stop.id === stopId
              ? { ...stop, address: selectedText, placeId: place.place_id, postalCode: postalCode || undefined }
              : stop,
          ),
        )
      }
    })

    stopAutocompleteRefs.current.set(stopId, autocomplete)
  }

  const addStop = () => {
    const newStop: Location = {
      id: `stop-${Date.now()}`,
      address: "",
    }
    setStops([...stops, newStop])
  }

  const removeStop = (id: string) => {
    setStops(stops.filter((stop) => stop.id !== id))
    stopAutocompleteRefs.current.delete(id)
  }

  const updateStopAddress = (id: string, address: string) => {
    setStops(stops.map((stop) => (stop.id === id ? { ...stop, address } : stop)))
  }

  const calculateFare = async () => {
    if (!pickup.address || !dropoff.address) {
      toast.error("Please enter pickup and drop-off locations.")
      return
    }

    if (!time || !date) {
      toast.error("Please select the date and time first.")
      return
    }
    if (withReturn) {
      if (!returnTime || !returnDate) {
        toast.error("Please select return date and time.")
        return
      }
    }
    setIsCalculating(true)
    try {
      let pickupPostcode = pickup.postalCode
      let dropoffPostcode = dropoff.postalCode

      if (!pickupPostcode && pickup.placeId) {
        pickupPostcode = (await getPostcodeFromPlaceId(pickup.placeId)) || undefined
      }
      if (!dropoffPostcode && dropoff.placeId) {
        dropoffPostcode = (await getPostcodeFromPlaceId(dropoff.placeId)) || undefined
      }

      let pickUpextraAmount = 0
      if (pickupPostcode) {
        setCheckingExtras(true)
        try {
          const data = await getPostcodeExtras(pickupPostcode)
          pickUpextraAmount = Number(data?.data?.extras) || 0
          setPostcodeExtras(pickUpextraAmount)
        } catch (error) {
          console.error("Error fetching postcode extras:", error)
          pickUpextraAmount = 0
          setPostcodeExtras(0)
        }
        setCheckingExtras(false)
      }

      let extraAmount = 0
      if (dropoffPostcode) {
        setCheckingExtras(true)
        try {
          const data = await getPostcodeExtras(dropoffPostcode)
          extraAmount = Number(data?.data?.extras) || 0
          setPostcodeExtras(extraAmount)
        } catch (error) {
          console.error("Error fetching postcode extras:", error)
          extraAmount = 0
          setPostcodeExtras(0)
        }
        setCheckingExtras(false)
      }

      if (stops.length === 0 && pickupPostcode && dropoffPostcode) {
        const hotspotResult = await checkHotspotRoute(pickupPostcode, dropoffPostcode)
        if (hotspotResult.success && hotspotResult.data) {
          toast.success("Using express route pricing!")

          const params = new URLSearchParams()
          params.append("hotspotRouteId", hotspotResult.data.id.toString())
          params.append("hotspotFare", hotspotResult.data.fare.toString())
          params.append("pickup", pickup.address)
          params.append("pc", pickupPostcode)
          params.append("dc", dropoffPostcode)
          params.append("dropoff", dropoff.address)
          params.append("date", format(date, "yyyy-MM-dd"))
          params.append("time", time)
          params.append("withReturn", withReturn.toString())

          params.append("postcodeExtras", (pickUpextraAmount + extraAmount).toString())

          if (withReturn && returnDiscount > 0) {
            params.append("returnDiscount", returnDiscount.toString())
          }

          if (withReturn) {
            params.append("returnDate", format(returnDate, "yyyy-MM-dd"))
            params.append("returnTime", returnTime)
          }

          router.push(`/select-vehicle?${params.toString()}`)
          return
        }
      }

      const googleInstance = await googleLoader.load()
      const directionsService = new googleInstance.maps.DirectionsService()
      let stopsExtraAmount = 0
      const validStops = stops.filter((stop) => stop.address)
      const waypoints = stops.filter((stop) => stop.address).map((stop) => ({ location: stop.address, stopover: true }))

      if (validStops.length > 0) {
        setCheckingExtras(true)

        for (const stop of validStops) {
          try {
            let stopPostcode = stop.postalCode

            if (!stopPostcode && stop.placeId) {
              stopPostcode = (await getPostcodeFromPlaceId(stop.placeId)) || undefined
            }

            if (stopPostcode) {
              const data = await getPostcodeExtras(stopPostcode)
              const stopExtra = Number(data?.data?.extras) || 0
              stopsExtraAmount += stopExtra
            }
          } catch (error) {
            console.error(`Error fetching extras for stop ${stop.address}:`, error)
          }
        }
        setCheckingExtras(false)
      }
      const request = {
        origin: pickup.address,
        destination: dropoff.address,
        waypoints,
        travelMode: googleInstance.maps.TravelMode.DRIVING,
      }

      directionsService.route(request, (result: any, status: any) => {
        if (status === googleInstance.maps.DirectionsStatus.OK) {
          let totalDistance = 0
          let totalDuration = 0
          const route = result.routes[0]

          route.legs.forEach((leg: any) => {
            totalDistance += leg.distance.value
            totalDuration += leg.duration.value
          })

          let distanceInKm = totalDistance / 1000
          if (withReturn) distanceInKm *= 2

          const params = new URLSearchParams()
          params.append("distance", distanceInKm.toFixed(2))
          params.append("duration", totalDuration.toString())
          params.append("pickup", pickup.address)
          params.append("dropoff", dropoff.address)
          params.append("date", format(date, "yyyy-MM-dd"))
          params.append("time", time)
          params.append("withReturn", withReturn.toString())
          params.append("pc", pickup.postalCode || "")
          params.append("dc", dropoff.postalCode || "")

          params.append("postcodeExtras", (pickUpextraAmount + extraAmount + stopsExtraAmount).toString())

          if (withReturn && returnDiscount > 0) {
            params.append("returnDiscount", returnDiscount.toString())
          }

          if (withReturn) {
            params.append("returnDate", format(returnDate, "yyyy-MM-dd"))
            params.append("returnTime", returnTime)
          }

          const validStops = stops.filter((stop) => stop.address)
          if (validStops.length > 0) {
            params.append("stops", JSON.stringify(validStops.map((s) => s.address)))
          }

          router.push(`/select-vehicle?${params.toString()}`)
        } else {
          console.error("Directions request failed due to " + status)
          alert("Error calculating route. Please try again.")
          setIsCalculating(false)
        }
      })
    } catch (error) {
      console.error("Error calculating fare:", error)
      alert("Error calculating fare. Please try again.")
      setIsCalculating(false)
    }
  }

  async function getPostcodeFromPlaceId(placeId: string): Promise<string | null> {
    try {
      const place = await (window.google.maps.places.Place as any).fetchByPlaceId(placeId, {
        fields: ["addressComponents"],
      })

      const component = place.addressComponents?.find((c: any) => c.types.includes("postal_code"))

      return component ? component.longText.split(" ")[0].toUpperCase() : null
    } catch (error) {
      console.error("Failed to fetch place:", error)
      return null
    }
  }

  const isUKLocation = (address: string): boolean => {
    const ukIndicators = [
      "UK",
      "United Kingdom",
      "England",
      "Scotland",
      "Wales",
      "Northern Ireland",
      "London",
      "Manchester",
      "Birmingham",
      "Glasgow",
      "Edinburgh",
      "Cardiff",
      "Belfast",
    ]
    const ukPostcodePattern = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i
    return ukIndicators.some((indicator) => address.includes(indicator)) || ukPostcodePattern.test(address)
  }

  return (
    <Card className="border shadow-md border-t-0">
      <CardContent className="p-6">
        {/* With Return Toggle */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <Switch
              id="with-return"
              checked={withReturn}
              onCheckedChange={setWithReturn}
              className={cn(
                "peer h-7 w-14 rounded-full border-2 transition-all duration-300 ease-in-out",
                withReturn
                  ? "bg-yellow-400 border-yellow-500 shadow-[0_0_10px_3px_rgba(255,223,0,0.6)]"
                  : "bg-gray-300",
              )}
            >
              <span
                className={cn(
                  "block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out",
                  withReturn ? "translate-x-7" : "translate-x-0",
                )}
              />
            </Switch>
            {withReturn && (
              <div className="absolute top-1 left-1 h-6 w-6 animate-ping rounded-full bg-yellow-300 opacity-75 z-[-1]" />
            )}
          </div>

          <Label
            htmlFor="with-return"
            className="text-sm font-extrabold tracking-wide text-yellow-600 font-poppins hover:scale-105 transition-transform duration-300"
          >
            WITH RETURN
          </Label>
        </div>

        <div className="grid md:grid-cols-5 gap-4 md:gap-6">
          {/* Pickup Location */}
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="pickup" className="block text-sm font-medium font-poppins">
              PICKUP LOCATION
            </label>
            <div className="relative">
              <Input
                id="pickup"
                placeholder="Pick address or postcode"
                value={pickup.address}
                onChange={(e) => {
                  setPickup({ ...pickup, address: e.target.value })
                  if (e.target.value && !isUKLocation(e.target.value)) {
                    setPickupError("Location not found")
                  } else {
                    setPickupError("")
                  }
                }}
                className={pickupError ? "border-red-500" : ""}
              />
              {pickupError && <p className="text-red-500 text-xs mt-1">{pickupError}</p>}
            </div>
          </div>

          {/* Stops Container */}
          {stops.length > 0 && (
            <div className="space-y-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium font-poppins">VIA</label>
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
                {stops.map((stop, index) => (
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
                  <span className="text-xs font-poppins">Add another stop</span>
                </Button>
              </div>
            </div>
          )}

          {/* Add Stop Button */}
          <div className={`hidden md:flex items-end ${stops.length > 0 ? "md:hidden" : ""}`}>
            <Button
              variant="outline"
              onClick={addStop}
              className="flex items-center justify-center gap-2 border-dashed hover:border-primary bg-transparent text-muted-foreground h-10 w-full"
            >
              <Plus className="h-4 w-4" />
              <span className="font-poppins">Add Via</span>
            </Button>
          </div>

          {/* Drop Off */}
          <div className="space-y-2 md:col-span-1">
            <label htmlFor="dropoff" className="block text-sm font-medium font-poppins">
              DROP OFF
            </label>
            <div className="relative">
              <Input
                id="dropoff"
                placeholder="Drop off address or postcode"
                value={dropoff.address}
                onChange={(e) => {
                  setDropoff({ ...dropoff, address: e.target.value })
                  if (e.target.value && !isUKLocation(e.target.value)) {
                    setDropoffError("Location not found")
                  } else {
                    setDropoffError("")
                  }
                }}
                className={dropoffError ? "border-red-500" : ""}
              />
              {dropoffError && <p className="text-red-500 text-xs mt-1">{dropoffError}</p>}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium font-poppins">PICK UP DATE</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDateUK(format(date, "yyyy-MM-dd")) : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time (24-Hour Format - Any Minute) */}
          <div className="space-y-2 md:col-span-1">
            <label className="block text-sm font-medium font-poppins">TIME (24H)</label>
            <TimePickerInput
              value={time}
              onChange={setTime}
              placeholder="Select time (HH:MM)"
              hideHelperText
              inputClassName="h-10"
            />
          </div>
        </div>

        {/* Return Trip Fields */}
        {withReturn && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium font-poppins mb-4 text-muted-foreground">RETURN TRIP DETAILS</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium font-poppins">RETURN DATE</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !returnDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? formatDateUK(format(returnDate, "yyyy-MM-dd")) : <span>Pick return date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={(date) => date && setReturnDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium font-poppins">RETURN TIME (24H)</label>
                <TimePickerInput
                  value={returnTime}
                  onChange={setReturnTime}
                  placeholder="Select return time (HH:MM)"
                  hideHelperText
                  inputClassName="h-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Stop Button - Mobile */}
        {stops.length === 0 && (
          <Button
            variant="outline"
            onClick={addStop}
            className="flex md:hidden items-center justify-center gap-2 border-dashed hover:border-primary bg-transparent text-muted-foreground mt-4 w-full"
          >
            <Plus className="h-4 w-4" />
            <span className="font-poppins">Add Via</span>
          </Button>
        )}

        {/* Calculate Button */}
        <Button
          onClick={calculateFare}
          disabled={isCalculating || checkingExtras || loadingReturnDiscount}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
        >
          {isCalculating
            ? "Calculating..."
            : checkingExtras
              ? "Checking extras..."
              : loadingReturnDiscount
                ? "Loading discount..."
                : "NEXT →"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default FareCalculator
