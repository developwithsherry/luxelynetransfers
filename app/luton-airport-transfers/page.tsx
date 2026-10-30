import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Luton Airport Transfers (LTN) | Reliable Private Hire & Taxi",
  description:
    "Book fixed-price Luton Airport transfers (LTN) to/from Central London, North/East London & Heathrow. 24/7 private hire taxi with live flight tracking, 45 mins free waiting & Meet & Greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/luton-airport-transfers",
  },
  openGraph: {
    title: "Luton Airport Transfers (LTN) | 24/7 Fixed-Fare London Taxi",
    description:
      "Reliable Luton Airport taxi & private hire to Central London, Ilford & UK airports. Includes terminal Meet & Greet and 45 minutes free waiting time.",
    url: "https://luxelynetransfers.co.uk/luton-airport-transfers",
    images: ["/og-image.png"],
  },
}

export default function LutonTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the Luton Main Terminal Arrivals Hall, directly opposite the international arrivals exit near the Costa Coffee outlet, holding a clear name board.",
    },
  ]

  const popularRoutes = [
    {
      destination: "Central London (King's Cross, Euston, Marylebone & West End)",
      distance: "32 – 35 miles",
      estimatedTime: "50 - 70 mins",
      bestFor: "Direct M1 Route into Central London",
    },
    {
      destination: "North London (Finchley, Barnet, Hampstead & Enfield)",
      distance: "24 – 28 miles",
      estimatedTime: "35 - 50 mins",
      bestFor: "Fast North Circular & M1 Residential Pickups",
    },
    {
      destination: "Ilford, Redbridge, Canary Wharf & East London",
      distance: "38 – 43 miles",
      estimatedTime: "55 - 70 mins",
      bestFor: "M25 / A406 Door-to-Door Transfers",
    },
    {
      destination: "Heathrow Airport (LHR) Inter-Airport Transfer",
      distance: "35 – 38 miles",
      estimatedTime: "40 - 55 mins",
      bestFor: "Fast M25 Connecting Flights",
    },
    {
      destination: "Milton Keynes, Oxford & Bicester Village",
      distance: "25 – 45 miles",
      estimatedTime: "35 - 60 mins",
      bestFor: "Business Hubs & Shopping Transfers",
    },
  ]

  const generalTips = [
    "Allow 45 to 60 minutes after landing at Luton Airport to retrieve luggage and clear customs.",
    "Your booking comes with 45 minutes of complimentary waiting time from the moment your aircraft lands.",
    "We track your flight in real time—if your flight is early or delayed, your driver's arrival time adjusts automatically.",
    "Luton Airport has strict pickup zones; our terminal Meet & Greet service ensures your driver guides you smoothly to your waiting vehicle.",
  ]

  const faqs = [
    {
      q: "Where is the meeting point at London Luton Airport?",
      a: "Our driver waits inside the arrivals hall of the Main Terminal, opposite the international arrivals exit near Costa Coffee, holding a sign displaying the lead passenger's name.",
    },
    {
      q: "What if my flight to Luton is delayed?",
      a: "We track all incoming flights to Luton Airport (LTN). If your flight is delayed, the pickup time adjusts automatically with zero extra fees for delays.",
    },
    {
      q: "How long does a taxi from Luton Airport to Central London take?",
      a: "London Luton is located 34 miles north of Central London via the M1 motorway. Journey time is typically 50 to 70 minutes depending on traffic.",
    },
    {
      q: "Can I request infant seats or an 8-seater minibus for Luton?",
      a: "Yes. You can add infant, toddler, or booster seats and select up to an 8-passenger MPV on our online booking calculator.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Luton"
      airportCode="LTN"
      slug="luton-airport-transfers"
      tagline="Fixed-fare private hire taxi and chauffeur transfers from London Luton Airport (LTN) to Central London, East London and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD (Company No. 16665396) offers fixed-price private hire transportation to and from London Luton Airport (LTN). Whether traveling for business or family holidays, our service guarantees a clean executive vehicle, live flight tracking, 45 minutes free waiting time, and terminal Meet & Greet."
      distanceToLondon="34 miles"
      avgTime="50 - 70 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      popularRoutes={popularRoutes}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
