"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plane, Calendar, MapPin, GraduationCap } from "lucide-react"

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Punctual and stress-free airport transfers with professional drivers, ensuring a smooth start or end to your journey.",
    features: ["Flight monitoring", "Meet & greet service", "Complimentary waiting time", "24/7 availability"],
    image: "/luxury-car-at-airport-terminal-professional-chauff.png",
  },
  {
    icon: Calendar,
    title: "Event Transfers",
    description:
      "Reliable transport for weddings, parties, and corporate events—your guests arrive on time, in comfort and style.",
    features: ["Group bookings", "Event coordination", "Multiple vehicle types", "Flexible scheduling"],
    image: "/elegant-wedding-car-with-ribbons-luxury-event-tran.png",
  },
  {
    icon: MapPin,
    title: "Day & Weekly Tours",
    description: "Explore iconic destinations across London and the UK with our tailored day and weekly tour packages.",
    features: ["Custom itineraries", "Local expertise", "Sightseeing stops", "Photography assistance"],
    image: "/luxury-car-in-front-of-big-ben-london-tourist-dest.png",
  },
  {
    icon: GraduationCap,
    title: "School & College Transport",
    description:
      "Safe, timely, and trusted pickup and drop-off services for students, with DBS-checked drivers and GPS-tracked vehicles.",
    features: ["DBS-checked drivers", "GPS tracking", "Regular schedules", "Parent notifications"],
    image: "/safe-family-car-school-transport-professional-driv.png",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-5 pb-14 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-accent max-w-4xl mx-auto leading-tight">
            Our Services
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[600px]">
            {/* Airport Transfers - Large featured card */}
            <Card className="lg:col-span-2 lg:row-span-2 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[400px] lg:min-h-full overflow-hidden rounded-lg">
                  <img
                    src={services[0].image || "/placeholder.svg"}
                    alt={services[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute top-6 left-6 bg-accent/90 text-primary p-3 rounded-xl">
                    <Plane className="w-6 h-6" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-bold text-2xl lg:text-3xl mb-3">{services[0].title}</h3>
                    <p className="text-base lg:text-lg opacity-90 mb-4 leading-relaxed">{services[0].description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {services[0].features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span className="opacity-90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Transfers - Tall card */}
            <Card className="lg:row-span-2 group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg">
                  <img
                    src={services[1].image || "/placeholder.svg"}
                    alt={services[1].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-accent/90 text-primary p-2 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-xl mb-2">{services[1].title}</h3>
                    <p className="text-sm opacity-90 mb-3 line-clamp-3">{services[1].description}</p>

                    <div className="space-y-1">
                      {services[1].features.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                          <span className="opacity-90">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day & Weekly Tours - Wide card */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[200px] lg:min-h-[290px] overflow-hidden rounded-lg">
                  <img
                    src={services[2].image || "/placeholder.svg"}
                    alt={services[2].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-accent/90 text-primary p-2 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-2">{services[2].title}</h3>
                    <p className="text-sm opacity-90 mb-2 line-clamp-2">{services[2].description}</p>

                    <div className="flex flex-wrap gap-2">
                      {services[2].features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* School & College Transport - Square card */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[200px] lg:min-h-[290px] overflow-hidden rounded-lg">
                  <img
                    src={services[3].image || "/placeholder.svg"}
                    alt={services[3].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  <div className="absolute top-4 left-4 bg-accent/90 text-primary p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-2">{services[3].title}</h3>
                    <p className="text-sm opacity-90 mb-2 line-clamp-2">{services[3].description}</p>

                    <div className="flex flex-wrap gap-2">
                      {services[3].features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
