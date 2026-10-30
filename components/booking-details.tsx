"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, Check, ChevronRight, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBooking } from "@/context/booking-context"
import { useVehicles } from "@/context/vehicle-context"
import { Badge } from "./ui/badge"
import { useAddons } from "@/context/addon-context"
import { formatDateUK } from "@/lib/format-util"
import { googleLoader } from "@/lib/google.loader"
import { TimePickerInput } from "@/components/admin/booking/time-picker-input"

interface BookingHeaderProps {
    className?: string
    isBookingPage: boolean
}

export function BookingHeader({ className, isBookingPage }: BookingHeaderProps) {
    const { booking, estimatedTime, updateBooking, setEstimatedTime } = useBooking();
    const { selectedAddon } = useAddons()
    const { selectedVehicle, fares } = useVehicles()

    const [isEditing, setIsEditing] = useState(false)
    const [editPickup, setEditPickup] = useState("")
    const [editDropoff, setEditDropoff] = useState("")
    const [editDate, setEditDate] = useState("")
    const [editTime, setEditTime] = useState("")
    const [editReturnDate, setEditReturnDate] = useState("")
    const [editReturnTime, setEditReturnTime] = useState("")
    const [updating, setUpdating] = useState(false)

    const getISODateString = (dateVal: any) => {
        if (!dateVal) return new Date().toISOString().split("T")[0]
        try {
            return new Date(dateVal).toISOString().split("T")[0]
        } catch (e) {
            return new Date().toISOString().split("T")[0]
        }
    }

    useEffect(() => {
        if (isEditing) {
            setEditPickup(booking.pickup_location || "")
            setEditDropoff(booking.drop_off_location || "")
            setEditDate(getISODateString(booking.date))
            setEditTime(booking.time || "")
            setEditReturnDate(getISODateString(booking.return_date))
            setEditReturnTime(booking.return_time || "")
        }
    }, [isEditing, booking])

    // Attach Google Maps Autocomplete to the input fields in edit mode
    useEffect(() => {
        if (!isEditing) return

        let active = true

        const initAutocomplete = async () => {
            try {
                const google = await googleLoader.load()
                if (!active) return

                const pickupEls = document.querySelectorAll(".pickup-edit-input")
                pickupEls.forEach((el) => {
                    const htmlEl = el as HTMLInputElement
                    const autocomplete = new google.maps.places.Autocomplete(htmlEl, {
                        fields: ["formatted_address", "geometry"],
                        componentRestrictions: { country: "gb" },
                    })
                    autocomplete.addListener("place_changed", () => {
                        const place = autocomplete.getPlace()
                        if (place && htmlEl.value) {
                            setEditPickup(htmlEl.value)
                        }
                    })
                })

                const dropoffEls = document.querySelectorAll(".dropoff-edit-input")
                dropoffEls.forEach((el) => {
                    const htmlEl = el as HTMLInputElement
                    const autocomplete = new google.maps.places.Autocomplete(htmlEl, {
                        fields: ["formatted_address", "geometry"],
                        componentRestrictions: { country: "gb" },
                    })
                    autocomplete.addListener("place_changed", () => {
                        const place = autocomplete.getPlace()
                        if (place && htmlEl.value) {
                            setEditDropoff(htmlEl.value)
                        }
                    })
                })
            } catch (err) {
                console.error("Error initializing edit autocomplete:", err)
            }
        }

        const timer = setTimeout(() => {
            initAutocomplete()
        }, 100)

        return () => {
            active = false
            clearTimeout(timer)
        }
    }, [isEditing])

    const handleUpdate = async () => {
        setUpdating(true)
        try {
            let newDistance = booking.total_distance
            let newDuration = estimatedTime

            const routeChanged = editPickup !== booking.pickup_location || editDropoff !== booking.drop_off_location

            if (routeChanged) {
                const google = await googleLoader.load()
                const service = new google.maps.DistanceMatrixService()

                const result = await new Promise<any>((resolve, reject) => {
                    service.getDistanceMatrix(
                        {
                            origins: [editPickup],
                            destinations: [editDropoff],
                            travelMode: google.maps.TravelMode.DRIVING,
                            unitSystem: google.maps.UnitSystem.IMPERIAL,
                        },
                        (response, status) => {
                            if (status === google.maps.DistanceMatrixStatus.OK) {
                                resolve(response)
                            } else {
                                reject(new Error(`API Error: ${status}`))
                            }
                        }
                    )
                })

                if (result.rows[0].elements[0].status === "OK") {
                    const element = result.rows[0].elements[0]
                    const distanceMeters = element.distance.value
                    const durationSeconds = element.duration.value

                    let distanceInMiles = distanceMeters * 0.000621371
                    if (booking.with_return) {
                        distanceInMiles *= 2
                    }
                    newDistance = Number.parseFloat(distanceInMiles.toFixed(2))
                    newDuration = Math.round(durationSeconds / 60).toString()
                } else {
                    throw new Error("Could not calculate route. Please check location spelling.")
                }
            }

            updateBooking({
                pickup_location: editPickup,
                drop_off_location: editDropoff,
                date: editDate ? new Date(editDate).toISOString() : booking.date,
                time: editTime,
                return_date: editReturnDate ? new Date(editReturnDate).toISOString() : booking.return_date,
                return_time: editReturnTime,
                total_distance: newDistance,
            })
            setEstimatedTime(newDuration)
            setIsEditing(false)
        } catch (err: any) {
            console.error(err)
            alert(err.message || "Failed to update booking details.")
        } finally {
            setUpdating(false)
        }
    }

    // JSX Variables to prevent recreation of functional components during re-renders
    const bookingSummaryCard = (
        <Card className="shadow-sm border-border/50 px-2">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {selectedVehicle ? (
                    <div className="flex items-center gap-4 p-4 bg-lime-50 dark:bg-lime-950/20 border border-lime-200 dark:border-lime-800 rounded-xl">
                        <div className="relative">
                            <img
                                src={selectedVehicle.imageUrl || "/placeholder.svg?height=40&width=60&query=car"}
                                alt={selectedVehicle.name}
                                className="w-14 h-10 object-cover rounded-lg shadow-sm"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{selectedVehicle.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedVehicle.type}</p>
                        </div>
                        <div className="flex items-center gap-2 text-lime-600 dark:text-lime-400">
                            <div className="p-1 bg-lime-100 dark:bg-lime-900/50 rounded-full">
                                <Check className="h-3 w-3" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 border-2 border-dashed border-border rounded-xl text-center">
                        <div className="space-y-2">
                            <div className="w-12 h-12 bg-muted rounded-full mx-auto flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground font-medium">No vehicle selected</p>
                            <p className="text-xs text-muted-foreground">Choose a vehicle to continue</p>
                        </div>
                    </div>
                )}

                <div className="space-y-4 pt-2 border-t border-border/50">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-primary">Journey Details</h4>

                    <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Fare</span>
                            <p className="font-semibold text-foreground">
                                £{fares.get(selectedVehicle?.id?.toString() || "")?.toLocaleString() || 0}  {selectedAddon && "+ £" + selectedAddon.price.toLocaleString() + "(Addon)"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Est. time</span>
                            <p className="font-semibold text-foreground">
                                {booking.with_return ? (
                                    <>
                                        {estimatedTime || 0} mins <span className="text-xs text-muted-foreground font-normal">(one-way)</span> / {Number(estimatedTime || 0) * 2} mins <span className="text-xs text-muted-foreground font-normal">(total)</span>
                                    </>
                                ) : (
                                    `${estimatedTime || 0} mins`
                                )}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Distance</span>
                            <p className="font-semibold text-foreground">
                                {booking.with_return ? (
                                    <>
                                        {booking.total_distance ? (booking.total_distance / 2).toFixed(2) : 0} {booking.unit || "miles"} <span className="text-xs text-muted-foreground font-normal">(one-way)</span> / {booking.total_distance || 0} {booking.unit || "miles"} <span className="text-xs text-muted-foreground font-normal">(total)</span>
                                    </>
                                ) : (
                                    `${booking.total_distance || 0} ${booking.unit || "miles"}`
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    const journeyDetailsCard = (
        <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex space-x-2 items-center">
                        <div className="p-2 rounded-lg bg-lime-300">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <p>Journey Details</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {booking.with_return && <Badge className="bg-lime-500 text-black">With Return</Badge>}
                        {!isEditing && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-lime-700 hover:text-lime-800 hover:bg-lime-50 h-7 px-2 font-semibold flex items-center gap-1 border border-lime-100 rounded-lg"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            
            {isEditing ? (
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pickup Location</label>
                        <input
                            type="text"
                            className="pickup-edit-input w-full p-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg text-foreground focus:ring-1 focus:ring-lime-500 focus:outline-none"
                            value={editPickup}
                            onChange={(e) => setEditPickup(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Drop-off Location</label>
                        <input
                            type="text"
                            className="dropoff-edit-input w-full p-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg text-foreground focus:ring-1 focus:ring-lime-500 focus:outline-none"
                            value={editDropoff}
                            onChange={(e) => setEditDropoff(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pickup Date</label>
                            <input
                                type="date"
                                className="w-full p-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg text-foreground focus:ring-1 focus:ring-lime-500 focus:outline-none"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Pickup Time (24h)</label>
                            <TimePickerInput
                                value={editTime}
                                onChange={(time) => setEditTime(time)}
                                hideHelperText
                                inputClassName="h-[38px] text-sm bg-neutral-50 dark:bg-neutral-900 border-border rounded-lg"
                            />
                        </div>
                    </div>

                    {booking.with_return && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Return Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-border rounded-lg text-foreground focus:ring-1 focus:ring-lime-500 focus:outline-none"
                                    value={editReturnDate}
                                    onChange={(e) => setEditReturnDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Return Time (24h)</label>
                                <TimePickerInput
                                    value={editReturnTime}
                                    onChange={(time) => setEditReturnTime(time)}
                                    hideHelperText
                                    inputClassName="h-[38px] text-sm bg-neutral-50 dark:bg-neutral-900 border-border rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => setIsEditing(false)}
                            disabled={updating}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 bg-lime-500 hover:bg-lime-600 text-black font-bold text-xs"
                            onClick={handleUpdate}
                            disabled={updating}
                        >
                            {updating ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </CardContent>
            ) : (
                <CardContent className="space-y-6">
                    {/* Pickup */}
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 bg-lime-500 rounded-full shadow-sm"></div>
                            <div className="w-0.5 h-12 bg-gradient-to-b from-lime-500 to-red-500 mt-2"></div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="font-semibold text-foreground text-sm">Pickup Location</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {booking.pickup_location || "Hounslow TW6, UK (TW6)"}
                            </p>
                            <div className="flex flex-col gap-0.5 pt-1">
                                <span className="text-[10px] font-bold text-lime-700 uppercase tracking-wider">Pickup Date & Time</span>
                                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">
                                    {booking.date ? formatDateUK(new Date(booking.date)) : "N/A"} at {booking.time || ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Drop-off */}
                    <div className="flex items-start gap-4">
                        <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                        <div className="flex-1 space-y-1">
                            <p className="font-semibold text-foreground text-sm">Drop-off Location</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {booking.drop_off_location || "London, UK"}
                            </p>
                            {booking.with_return && (
                                <div className="flex flex-col gap-0.5 pt-1">
                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Return Date & Time</span>
                                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-300">
                                        {booking.return_date ? formatDateUK(new Date(booking.return_date)) : "N/A"} at {booking.return_time || ""}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )

    return (
        <div className={cn("", className)}>
            {/* Mobile View */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full h-auto p-4 justify-between bg-card hover:bg-accent/50 border-border/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
                                    <div className="w-0.5 h-4 bg-gradient-to-b from-lime-500 to-red-500"></div>
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-sm truncate max-w-[200px]">
                                        {booking.pickup_location?.split(",")[0] || "Hounslow TW6"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">to</p>
                                    <p className="font-medium text-sm truncate max-w-[200px]">
                                        {booking.drop_off_location?.split(",")[0] || "London"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedVehicle && (
                                    <div className="flex items-center gap-1">
                                        <div className="w-6 h-4 bg-lime-100 dark:bg-lime-900/50 rounded flex items-center justify-center">
                                            <Check className="h-2 w-2 text-lime-600 dark:text-lime-400" />
                                        </div>
                                    </div>
                                )}
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="max-h-[70vh] overflow-y-scroll">
                        <SheetHeader>
                            <SheetTitle>Booking Details</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {bookingSummaryCard}
                                {journeyDetailsCard}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <div className={`grid grid-cols-1 ${isBookingPage ? "lg:grid-cols-1" : "lg:grid-cols-2"} gap-4`}>
                    {bookingSummaryCard}
                    {journeyDetailsCard}
                </div>
            </div>
        </div>
    )
}
