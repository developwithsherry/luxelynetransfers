import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Gatwick Airport Transfers (LGW) | North & South Terminal Taxi",
  description:
    "Book fixed-price Gatwick Airport transfers (LGW) to/from Central London, Ilford, East London & Heathrow. 24/7 private hire taxi serving LGW North and South terminals with flight tracking & Meet & Greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/gatwick-airport-transfers",
  },
  openGraph: {
    title: "Gatwick Airport Transfers (LGW) | 24/7 Fixed-Fare London Taxi",
    description:
      "Reliable Gatwick Airport taxi & private hire serving LGW North & South Terminals. Fixed fares, live flight tracking, and 45 minutes free waiting time.",
    url: "https://luxelynetransfers.co.uk/gatwick-airport-transfers",
    images: ["/og-image.png"],
  },
}

export default function GatwickTransfersPage() {
  const terminals = ["North Terminal", "South Terminal"]

  const terminalGuide = [
    {
      terminal: "North Terminal",
      meetingPoint:
        "Our driver will meet you inside the Gatwick North Terminal Arrivals Hall, directly opposite the international arrivals gate near the Costa Coffee outlet. The driver will hold a personalized name board.",
    },
    {
      terminal: "South Terminal",
      meetingPoint:
        "Our driver will meet you inside the Gatwick South Terminal Arrivals Hall, opposite the main arrivals exit near the Costa Coffee store and airport information desk, holding a clear name board.",
    },
  ]

  const popularRoutes = [
    {
      destination: "Central London (Westminster, Victoria, Mayfair & West End)",
      distance: "28 – 31 miles",
      estimatedTime: "65 - 85 mins",
      bestFor: "Hotels, Sightseeing & Corporate Travel",
    },
    {
      destination: "Canary Wharf, London Bridge & City of London",
      distance: "29 – 33 miles",
      estimatedTime: "60 - 80 mins",
      bestFor: "Business Travelers & Financial District",
    },
    {
      destination: "Ilford, Redbridge & East London (IG1–IG6)",
      distance: "38 – 44 miles",
      estimatedTime: "60 - 75 mins",
      bestFor: "Direct M25 / Dartford Crossing Home Transfers",
    },
    {
      destination: "Heathrow Airport (LHR) Inter-Airport Transfer",
      distance: "38 – 42 miles",
      estimatedTime: "45 - 65 mins",
      bestFor: "Connecting International Flights",
    },
    {
      destination: "King's Cross St Pancras, Paddington & Waterloo",
      distance: "30 – 33 miles",
      estimatedTime: "70 - 90 mins",
      bestFor: "Eurostar & National Rail Connections",
    },
    {
      destination: "Brighton, Southampton & Dover Cruise Ports",
      distance: "25 – 75 miles",
      estimatedTime: "35 - 95 mins",
      bestFor: "South Coast & Cruise Ship Connections",
    },
  ]

  const generalTips = [
    "Allow at least 45 to 60 minutes after landing at Gatwick North or South Terminal to clear passport control and baggage reclaim.",
    "All Gatwick Airport pickups include 45 minutes of complimentary waiting time starting from the actual landing time of your flight.",
    "We track your flight dynamically so your driver arrives in the terminal right on time, even if your flight is delayed.",
    "Make sure your mobile phone or WhatsApp is active upon landing so your driver can connect with you immediately.",
  ]

  const faqs = [
    {
      q: "Where does the driver meet me at Gatwick North and South Terminals?",
      a: "Our driver waits inside the arrivals hall of your specified terminal (North or South), opposite the main international arrivals exit next to Costa Coffee, holding a name board with the passenger's name.",
    },
    {
      q: "What if my flight to Gatwick is early or delayed?",
      a: "We monitor all incoming flights to London Gatwick (LGW). We automatically adjust the driver dispatch time so there are no extra waiting charges for flight delays.",
    },
    {
      q: "How long does a taxi transfer take between Gatwick and Central London?",
      a: "Depending on traffic and your exact destination postcode, a road transfer between London Gatwick Airport and Central London typically takes 65 to 90 minutes.",
    },
    {
      q: "Can I add child seats or book an 8-seater MPV for Gatwick?",
      a: "Yes. Infant, toddler, and booster seats can be added during online booking, and our 8-seater MPVs have ample room for family suitcases.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Gatwick"
      airportCode="LGW"
      slug="gatwick-airport-transfers"
      tagline="Fixed-fare private hire taxi and chauffeur transfers to and from London Gatwick Airport (LGW) North & South Terminals. 24/7 service."
      description="Luxelyne Transfers LTD (Company No. 16665396) provides reliable, fixed-price private hire transfers to and from London Gatwick Airport (LGW). Serving both North and South terminals 24/7, our service includes live flight monitoring, 45 minutes free waiting time, and complimentary Meet & Greet inside arrivals."
      distanceToLondon="28 miles"
      avgTime="65 - 85 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      popularRoutes={popularRoutes}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
