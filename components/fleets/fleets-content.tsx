"use client"

import { useVehicles } from "@/context/vehicle-context"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Users, Luggage } from "lucide-react"
import Image from "next/image"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"

export default function FleetsContent() {
  const { vehicles, loading } = useVehicles()

  if (loading) {
    return (
      <>
        <Header />
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black text-white">
          <Loader2 className="h-10 w-10 animate-spin text-lime-400" />
          <span className="mt-4 text-lg font-medium">Loading fleet options...</span>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container min-h-screen mx-auto px-4 py-20 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Our Fleet</h1>
          <p className="text-muted-foreground">Choose from our available premium vehicles for your journey</p>
        </div>

        <div className="max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-10">
            {vehicles.map((vehicle) => {
              return (
                <Card
                  key={vehicle.id}
                  className="cursor-pointer transition-all hover:shadow-lg bg-card border-muted/50 overflow-hidden"
                  onClick={() => (window.location.href = "/")}
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={vehicle.imageUrl || `/placeholder.svg?height=200&width=300&query=${vehicle.name} vehicle`}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{vehicle.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{vehicle.description}</p>
                      </div>

                      <div className="pt-2 border-t border-muted/20">
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-lime-400" />
                            <span>{vehicle.sittingCapacity} seats</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Luggage className="h-4 w-4 text-lime-400" />
                            <span>{vehicle.laguageCapacity} large bags</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Luggage className="h-4 w-4 text-lime-400" />
                            <span>{vehicle.hand_laguage} small bags</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
