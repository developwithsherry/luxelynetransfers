"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Luggage } from "lucide-react"
import { useVehicles } from "@/context/vehicle-context"
import { Skeleton } from "@/components/ui/skeleton"

export function FleetSection() {
  const { vehicles, loading } = useVehicles()

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <Card className="bg-card border-border w-[300px] sm:w-[350px] md:w-[380px] shrink-0 my-2">
      <CardContent className="p-0">
        <div className="p-4 flex items-center justify-center h-48">
          <Skeleton className="w-3/4 h-24 rounded-lg" />
        </div>
        <div className="p-5 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-4 pt-3 border-t border-border">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Duplicate track elements to ensure a continuous, seamless loop
  const getRepeatedItems = (items: any[]) => {
    if (!items || items.length === 0) return []
    // Target around 12 items to cover full wide screens seamlessly
    const multiplier = Math.max(2, Math.ceil(12 / items.length))
    return Array.from({ length: multiplier }).flatMap(() => items)
  }

  const repeatedVehicles = getRepeatedItems(vehicles)
  const repeatedSkeletons = Array.from({ length: 8 })

  return (
    <section className="lg:py-24 py-12 bg-gradient-to-br from-background via-muted/10 to-background overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center animate-in fade-in duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent">Our Premium Fleet</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose from our collection of luxury vehicles, each maintained to the highest standards and equipped with
            premium amenities.
          </p>
        </div>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Soft edge gradients for premium layout */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {loading ? (
          <div className="flex animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: "75s" }}>
            <div className="flex gap-6 pr-6 shrink-0">
              {repeatedSkeletons.map((_, idx) => (
                <SkeletonCard key={`sk1-${idx}`} />
              ))}
            </div>
            <div className="flex gap-6 pr-6 shrink-0">
              {repeatedSkeletons.map((_, idx) => (
                <SkeletonCard key={`sk2-${idx}`} />
              ))}
            </div>
          </div>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="flex animate-marquee hover:[animation-play-state:paused]" style={{ animationDuration: "75s" }}>
            {/* Track 1 */}
            <div className="flex gap-6 pr-6 shrink-0">
              {repeatedVehicles.map((vehicle, idx) => (
                <div key={`copy1-${vehicle.id}-${idx}`} className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 my-2">
                  <Card className="h-full bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                    <CardContent className="p-0 flex flex-col justify-between h-full">
                      <div>
                        <div className="relative group p-4 flex items-center justify-center">
                          <img
                            src={vehicle.imageUrl || "/placeholder.svg"}
                            alt={vehicle.name}
                            className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold mb-1 text-card-foreground group-hover:text-accent transition-colors duration-200">{vehicle.name}</h3>
                          <p className="text-muted-foreground text-sm font-medium mb-3">{vehicle.type}</p>

                          <div className="flex gap-4 text-sm mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="w-4 h-4 text-accent" />
                              <span>{vehicle.sittingCapacity} Passengers</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Luggage className="w-4 h-4 text-accent" />
                              <span>{vehicle.laguageCapacity} Bags</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Track 2 - Identical duplicate */}
            <div className="flex gap-6 pr-6 shrink-0">
              {repeatedVehicles.map((vehicle, idx) => (
                <div key={`copy2-${vehicle.id}-${idx}`} className="w-[300px] sm:w-[350px] md:w-[380px] shrink-0 my-2">
                  <Card className="h-full bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
                    <CardContent className="p-0 flex flex-col justify-between h-full">
                      <div>
                        <div className="relative group p-4 flex items-center justify-center">
                          <img
                            src={vehicle.imageUrl || "/placeholder.svg"}
                            alt={vehicle.name}
                            className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold mb-1 text-card-foreground group-hover:text-accent transition-colors duration-200">{vehicle.name}</h3>
                          <p className="text-muted-foreground text-sm font-medium mb-3">{vehicle.type}</p>

                          <div className="flex gap-4 text-sm mt-3 pt-3 border-t border-border">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="w-4 h-4 text-accent" />
                              <span>{vehicle.sittingCapacity} Passengers</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Luggage className="w-4 h-4 text-accent" />
                              <span>{vehicle.laguageCapacity} Bags</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">No vehicles available at the moment.</div>
        )}
      </div>
    </section>
  )
}
