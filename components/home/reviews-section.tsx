"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Alistair M.",
    initials: "AM",
    trip: "Heathrow to Central London",
    rating: 5,
    comment:
      "Used their chauffeur service for an event at the Excel. Driver was prompt, car was immaculate, and the ride was exceptionally smooth. Will use again.",
  },
  {
    name: "Eleanor G.",
    initials: "EG",
    trip: "London City Airport Transfer",
    rating: 5,
    comment:
      "Booked a V-Class for a family trip from Heathrow. Excellent communication, child seats were already fitted, and our driver was incredibly helpful with our bags.",
  },
  {
    name: "Oliver P.",
    initials: "OP",
    trip: "Corporate Travel",
    rating: 5,
    comment:
      "Faultless airport transfer. The driver was waiting at arrivals with a clear name board even though my flight landed 30 minutes early. Highly professional.",
  },
  {
    name: "Fiona S.",
    initials: "FS",
    trip: "Gatwick to Westminster",
    rating: 5,
    comment:
      "Seamless booking process and pristine cars. We use them regularly for our executive travel between Gatwick and the City. Absolutely reliable.",
  },
  {
    name: "Callum D.",
    initials: "CD",
    trip: "London Private Hire",
    rating: 5,
    comment:
      "Excellent service. Very clean saloon car, polite driver, and got us to our London hotel comfortably. Fair pricing for a premium experience.",
  },
  {
    name: "Harriet W.",
    initials: "HW",
    trip: "Heathrow T5 Airport Transfer",
    rating: 5,
    comment:
      "Brilliant customer support when I had to change my booking time last minute. The transfer itself was very comfortable. Highly recommend.",
  },
]

export function ReviewsSection() {
  const repeatedReviews = [...reviews, ...reviews]

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-muted/5 to-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center animate-in fade-in duration-750">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Read verified feedback from passengers who booked our London airport transfers and private hire chauffeur service.
          </p>
        </div>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative w-full overflow-hidden py-4 select-none">
        {/* Soft edge gradients for premium layout */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          className="flex animate-marquee hover:[animation-play-state:paused]"
          style={{ animationDuration: "90s" }}
        >
          {/* Track 1 (Primary accessible track) */}
          <div className="flex gap-6 pr-6 shrink-0">
            {repeatedReviews.map((review, idx) => (
              <div
                key={`rev1-${idx}`}
                aria-hidden={idx >= reviews.length ? "true" : undefined}
                className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 my-2"
              >
                <Card className="h-full bg-card border-border hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <Quote className="w-6 h-6 text-muted-foreground/20" />
                      </div>

                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent/10 text-accent font-bold text-sm tracking-wide shrink-0 border border-accent/20">
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="font-semibold text-card-foreground text-sm md:text-base leading-none mb-1">
                          {review.name}
                        </h4>
                        <p className="text-muted-foreground text-xs font-medium">
                          {review.trip}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Track 2 (Visual loop duplicate - hidden from assistive tech & crawlers) */}
          <div className="flex gap-6 pr-6 shrink-0" aria-hidden="true">
            {repeatedReviews.map((review, idx) => (
              <div key={`rev2-${idx}`} className="w-[320px] sm:w-[380px] md:w-[420px] shrink-0 my-2">
                <Card className="h-full bg-card border-border hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                  <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <Quote className="w-6 h-6 text-muted-foreground/20" />
                      </div>

                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3.5 pt-4 border-t border-border/60">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent/10 text-accent font-bold text-sm tracking-wide shrink-0 border border-accent/20">
                        {review.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground text-sm md:text-base leading-none mb-1">
                          {review.name}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium">
                          {review.trip}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
