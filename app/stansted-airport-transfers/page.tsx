import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Stansted Airport Transfers (STN) | 24/7 Fixed-Price London Taxi",
  description:
    "Book fixed-fare Stansted Airport transfers (STN) to/from Ilford, East London, Central London & Heathrow. 24/7 private hire taxi with live flight tracking, 45 mins free wait & Meet & Greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/stansted-airport-transfers",
  },
  openGraph: {
    title: "Stansted Airport Transfers (STN) | 24/7 Fixed-Fare London Taxi",
    description:
      "Fast, fixed-price Stansted Airport taxi & private hire serving East London, Central London & UK airports. Includes Meet & Greet and 45 mins free wait.",
    url: "https://luxelynetransfers.co.uk/stansted-airport-transfers",
    images: ["/og-image.png"],
  },
}

export default function StanstedTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the Stansted Main Terminal Arrivals Hall, directly opposite the international arrivals gate near the Burger King restaurant, holding a clear name board.",
    },
  ]

  const popularRoutes = [
    {
      destination: "Ilford, Redbridge, Woodford & East London (IG1–IG6)",
      distance: "26 – 30 miles",
      estimatedTime: "35 - 45 mins",
      bestFor: "Fast M11 Corridor Direct Home Transfers",
    },
    {
      destination: "Stratford, Canary Wharf & Liverpool Street",
      distance: "31 – 35 miles",
      estimatedTime: "45 - 60 mins",
      bestFor: "Business District & East London Hotels",
    },
    {
      destination: "Central London (Westminster, King's Cross & West End)",
      distance: "38 – 42 miles",
      estimatedTime: "60 - 75 mins",
      bestFor: "Central London Hotels & Eurostar Connections",
    },
    {
      destination: "Cambridge & University Colleges",
      distance: "28 – 30 miles",
      estimatedTime: "35 - 45 mins",
      bestFor: "Academic, Business & Tourist Travel",
    },
    {
      destination: "Heathrow (LHR) & Gatwick (LGW) Inter-Airport Transfers",
      distance: "52 – 68 miles",
      estimatedTime: "65 - 90 mins",
      bestFor: "Connecting Flights Across London",
    },
  ]

  const generalTips = [
    "Stansted Airport can experience busy immigration queues; we recommend allowing 45 to 60 minutes after landing to meet your driver.",
    "Your booking includes 45 minutes of complimentary waiting time starting from when your aircraft lands.",
    "Flights are monitored in real time, and driver dispatch times are adapted automatically so you never pay extra for flight delays.",
    "Please double-check that you have entered your flight number accurately when booking online.",
  ]

  const faqs = [
    {
      q: "Where is the meeting point at Stansted Airport?",
      a: "Our driver will wait inside the arrivals hall of the Main Terminal, directly opposite the international arrivals exit near Burger King, holding a placard displaying the lead passenger's name.",
    },
    {
      q: "What happens if my flight to Stansted is delayed?",
      a: "We track all flights landing at London Stansted (STN). If your flight is delayed, the driver's arrival time shifts automatically with zero extra waiting fees.",
    },
    {
      q: "How long is the transfer from Stansted to East London or Central London?",
      a: "Via the M11, transfers from Stansted to Ilford and East London take only 35 to 45 minutes, while Central London typically takes 60 to 75 minutes depending on traffic.",
    },
    {
      q: "Are baby and child seats available for Stansted transfers?",
      a: "Yes, you can request infant seats, toddler seats, or booster seats when completing your online booking.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Stansted"
      airportCode="STN"
      slug="stansted-airport-transfers"
      tagline="Fixed-fare private hire taxi and airport transfers from London Stansted Airport (STN) to East London, Central London, Cambridge and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD (Company No. 16665396) provides punctual, fixed-price private hire transfers to and from London Stansted Airport (STN). Ideally positioned via the M11 corridor for rapid connections to Ilford, East London, Canary Wharf, and Central London, our service guarantees vetted chauffeurs, clean vehicles, and 45 minutes of free post-landing waiting time."
      distanceToLondon="38 miles"
      avgTime="55 - 75 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      popularRoutes={popularRoutes}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
