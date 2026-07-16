"use client"
export const dynamic = "force-dynamic";

import { useVehicles } from "@/context/vehicle-context"
import { useAddons } from "@/context/addon-context"
import { useBooking } from "@/context/booking-context"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BookingHeader } from "@/components/booking-details"
import Loader from "@/components/loader"
import { useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Users, Luggage } from "lucide-react"

export default function SelectVehiclePage() {
  const { vehicles, fares, loading, error, selectedVehicle, selectVehicle } = useVehicles()
  const { addons, loading: addonsLoading, error: addonsError, selectedAddon, selectAddon } = useAddons()
  const { booking } = useBooking()
  const router = useRouter()

  if (loading) {
    return <Loader text="Loading available vehicles" />
  }


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading vehicles</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }
  useEffect(() => {
    if (fares && fares.size === 0) {
      router.back()
    }
  }, [fares, router])
  return (
    <>
      <Header />
      <div className="mx-auto lg:px-0 px-4 py-24 max-w-7xl">
        {/* Vehicles Section */}

        <div className="grid gap-8 lg:grid-cols-4 grid-cols-1">
          {/* Sidebar */}
          <BookingHeader isBookingPage={true} />

          {/* Vehicles + Addons in same column */}
          <div className="grid gap-12 lg:col-span-3">

            {/* Vehicles */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Select Your Vehicle</h1>
              <p className="text-muted-foreground mb-6">
                Choose from our available vehicles for your journey
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((vehicle) => {
                  const fare = fares.get(vehicle.id)
                  const isSelected = selectedVehicle?.id === vehicle.id
                  return (
                    <Card
                      key={vehicle.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-primary shadow-lg bg-lime-300" : ""
                        }`}
                      onClick={() => selectVehicle(vehicle)}
                    >
                      <CardContent className="p-6">
                        <div className="relative mb-4">
                          <Image
                            src={
                              vehicle.imageUrl ||
                              `/placeholder.svg?height=200&width=300&query=${vehicle.name} vehicle`
                            }
                            alt={vehicle.name}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          {isSelected && (
                            <Badge className="absolute top-2 right-2 bg-primary">Selected</Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <p className="text-2xl font-bold">
                                £{fare ? fare.toFixed(2) : "0.00"}
                              </p>
                              <p className="text-xs text-muted-foreground">Estimated fare</p>
                            </div>
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className={`${isSelected && "bg-lime-600"}`}
                            >
                              {isSelected ? "Selected" : "Select"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Addons (in same col, below vehicles) */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Addons</h2>
              <p className="text-muted-foreground mb-6">
                Enhance your trip with optional addons
              </p>

              {addonsLoading ? (
                <Loader text="Loading addons..." />
              ) : addonsError ? (
                <p className="text-destructive">{addonsError}</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {addons.map((addon) => {
                    const isSelected = selectedAddon?.id === addon.id
                    return (
                      <Card
                        key={addon.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-primary shadow-lg bg-lime-200" : ""
                          }`}
                        onClick={() => selectAddon(isSelected ? null : addon)}
                      >
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            {addon.name}
                            {isSelected && <Badge className="bg-primary">Selected</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>
                          <p className="font-semibold">£{addon.price.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>



        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No vehicles available at the moment</p>
          </div>
        )}

        {/* Addons Section */}


        {/* Floating Footer */}
        {(selectedVehicle || selectedAddon) && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 min-w-[350px]">
            <Card className="bg-primary text-primary-foreground border-gray-800">
              <CardContent className="px-6 py-3 flex justify-between items-center">
                <p className="text-sm font-medium">
                  {selectedVehicle && `${selectedVehicle.name} selected • £${fares
                    .get(selectedVehicle.id)
                    ?.toFixed(2)}`}{" "}
                  {selectedAddon && `+ (£${selectedAddon.price.toFixed(2)}) in Addons`}
                </p>
                <Button
                  className="hover:bg-lime-400 text-black text-xs ml-1"
                  size={"sm"}
                  onClick={() => router.push("/booking")}
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
