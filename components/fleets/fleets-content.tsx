"use client"

import { useVehicles } from "@/context/vehicle-context"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Users, Luggage, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"

const staticFleetCategories = [
  {
    name: "Standard & Executive Saloon",
    examples: "Mercedes-Benz E-Class, BMW 5 Series, Toyota Prius / Corolla Estate or similar",
    passengers: "Up to 3–4 Passengers",
    luggage: "2 Large Suitcases + 2 Hand Luggage",
    idealFor: "Solo travelers, couples, and business executives traveling between Heathrow, Gatwick, Stansted, Luton, London City and Central London.",
  },
  {
    name: "Luxury First-Class Chauffeur",
    examples: "Mercedes-Benz S-Class, BMW 7 Series, Range Rover Autobiography or similar",
    passengers: "Up to 3 Passengers",
    luggage: "2 Large Suitcases + 2 Cabin Bags",
    idealFor: "VIP airport meet & greet, diplomatic travel, corporate roadshows, and luxury London hotel transfers.",
  },
  {
    name: "Executive MPV & 8-Seater Minibus",
    examples: "Mercedes-Benz V-Class, Vito Tourer, VW Transporter 8-Seater or similar",
    passengers: "Up to 6–8 Passengers",
    luggage: "6–8 Large Suitcases + 6–8 Hand Luggage",
    idealFor: "Families with child seats, group airport transfers, cruise port transfers (Southampton & Dover), and ski/golf luggage.",
  },
]

export default function FleetsContent() {
  const { vehicles, loading } = useVehicles()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "Our Fleet", url: "https://luxelynetransfers.co.uk/fleets" },
        ]}
      />
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 pt-28 pb-20 max-w-7xl">
          <div className="mb-10 space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              London Private Hire & Chauffeur Vehicles
            </span>
            <h1 className="text-3xl md:text-5xl font-bold">
              Our Chauffeur & Airport Transfer Fleet
            </h1>
            <p className="text-muted-foreground max-w-3xl text-base md:text-lg leading-relaxed">
              Explore the Luxelyne Transfers fleet serving Heathrow, Gatwick, Stansted, Luton, London City, Southend, and Greater London. From economical private hire saloons to executive Mercedes E-Class, S-Class, and spacious 8-seater V-Class MPVs, every vehicle is clean, air-conditioned, and driven by a DBS-vetted chauffeur.
            </p>
          </div>

          {/* Live Fleet Grid */}
          <div className="max-w-7xl">
            {loading ? (
              <div className="w-full py-16 flex flex-col items-center justify-center rounded-2xl border border-muted/30 bg-card/40">
                <Loader2 className="h-10 w-10 animate-spin text-lime-400" />
                <span className="mt-4 text-lg font-medium">Loading live vehicle availability...</span>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 py-6">
                {vehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer transition-all hover:shadow-lg bg-card border-muted/50 overflow-hidden"
                    onClick={() => (window.location.href = "/#book-now")}
                  >
                    <CardContent className="p-6">
                      <div className="relative mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={vehicle.imageUrl || `/placeholder.svg?height=200&width=300&query=${vehicle.name} vehicle`}
                          alt={`${vehicle.name} - London Airport Taxi & Private Hire`}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h2 className="text-xl font-semibold text-foreground">{vehicle.name}</h2>
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
                ))}
              </div>
            )}
          </div>

          {/* Static Crawl-Visible Fleet Guide for Search Engines & AI Assistants */}
          <section className="mt-16 pt-16 border-t border-border space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Vehicle Capacity & Luggage Guide for UK Airport Transfers
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
                Choosing the right vehicle size guarantees a comfortable journey with all your suitcases. Below is our standard capacity guide for London airport pickups and private hire bookings.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {staticFleetCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="p-6 rounded-2xl border border-border bg-card space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">{cat.name}</h3>
                    <p className="text-xs font-medium text-accent">{cat.examples}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.idealFor}</p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-lime-400 shrink-0" />
                      <span><strong>Capacity:</strong> {cat.passengers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-lime-400 shrink-0" />
                      <span><strong>Luggage:</strong> {cat.luggage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/#book-now"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-accent/90 transition-all text-sm uppercase tracking-wider"
              >
                <span>Calculate Exact Fare by Vehicle Class</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
