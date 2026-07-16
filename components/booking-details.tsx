"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MapPin, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBooking } from "@/context/booking-context"
import { useVehicles } from "@/context/vehicle-context"
import { Badge } from "./ui/badge"
import { useAddons } from "@/context/addon-context"
import { formatDateUK } from "@/lib/format-util"

interface BookingHeaderProps {
    className?: string
    isBookingPage: boolean
}

export function BookingHeader({ className, isBookingPage }: BookingHeaderProps) {
    const { booking,estimatedTime} = useBooking();
    const {selectedAddon}=useAddons()
    const { selectedVehicle,fares} = useVehicles()
    const MobileView = () => (
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
                        <DesktopContent />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )

    const DesktopContent = () => (
        <div className={`grid grid-cols-1 ${isBookingPage ? "lg:grid-cols-1" : "lg:grid-cols-2"} gap-4`}>
               {/* Booking Summary */}
            <Card className="shadow-sm border-border/50 px-2">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 ">
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
                                    £{fares.get(selectedVehicle?.id?.toString() || "")?.toLocaleString() || 0}  {selectedAddon&&"+ £"+selectedAddon.price.toLocaleString()+ "(Addon)"} 
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Est. time</span>
                                <p className=" font-semibold text-foreground">
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
                                <p className=" font-semibold text-foreground">
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
            {/* Journey Route */}
            <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex space-x-2 items-center">
                          <div className="p-2  rounded-lg bg-lime-300">
                            <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <p>Journey Route</p>
                      </div>
                      <div>
                        {booking.with_return&&<Badge className="bg-lime-500 text-black">With Return</Badge>}
                      </div>
                    </CardTitle>
                </CardHeader>
              <CardContent className="space-y-6">
  {/* Pickup */}
  <div className="flex items-start gap-4">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 bg-lime-500 rounded-full shadow-sm"></div>
      <div className="w-0.5 h-12 bg-gradient-to-b from-lime-500 to-red-500 mt-2"></div>
    </div>
    <div className="flex-1 space-y-1">
      <p className="font-semibold text-foreground">Pickup Location</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {booking.pickup_location || "Hounslow TW6, UK (TW6)"}
      </p>
      <p className="text-xs text-black/60">
        {booking.date ? formatDateUK(new Date(booking.date)) : "N/A"}{" "}
        {booking.time || ""}
      </p>
    </div>
  </div>

  {/* Drop-off */}
  <div className="flex items-start gap-4">
    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
    <div className="flex-1 space-y-1">
      <p className="font-semibold text-foreground">Drop-off Location</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {booking.drop_off_location || "London, UK"}
      </p>
      {booking.with_return && (
        <p className="text-xs text-black/60">
          Return:{" "}
          {booking.return_date
            ? formatDateUK(new Date(booking.return_date))
            : "N/A"}{" "}
          {booking.return_time || ""}
        </p>
      )}
    </div>
  </div>
</CardContent>

            </Card>

         
        </div>
    )

    return (
        <div className={cn("", className)}>
            <MobileView />
            <div className="hidden md:block">
                <DesktopContent />
            </div>
        </div>
    )
}
