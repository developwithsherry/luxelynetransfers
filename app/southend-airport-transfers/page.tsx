import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Southend Airport Transfers (SEN) | Fixed-Fare London & Essex Taxi",
  description:
    "Book fixed-price London Southend Airport transfers (SEN) to/from Ilford, East London, Canary Wharf & Central London. 24/7 private hire taxi with flight tracking, 45 mins free waiting & Meet & Greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/southend-airport-transfers",
  },
  openGraph: {
    title: "Southend Airport Transfers (SEN) | 24/7 Fixed-Fare London & Essex Taxi",
    description:
      "Reliable London Southend Airport (SEN) private hire & chauffeur service to Ilford, East London, Central London & UK airports. Includes Meet & Greet.",
    url: "https://luxelynetransfers.co.uk/southend-airport-transfers",
    images: ["/og-image.png"],
  },
}

export default function SouthendTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the London Southend Airport Main Terminal Arrivals Hall, directly opposite the domestic and international baggage reclaim exit, holding a clear name board displaying your name.",
    },
  ]

  const popularRoutes = [
    {
      destination: "Ilford, Romford, Hornchurch & Redbridge (IG1–IG6 / RM)",
      distance: "26 – 31 miles",
      estimatedTime: "35 - 45 mins",
      bestFor: "Direct A127 East London & Essex Home Transfers",
    },
    {
      destination: "Stratford, Canary Wharf & ExCeL London",
      distance: "34 – 37 miles",
      estimatedTime: "45 - 60 mins",
      bestFor: "Business District & Docklands Transfers",
    },
    {
      destination: "Central London (Liverpool Street, City & Westminster)",
      distance: "40 – 43 miles",
      estimatedTime: "60 - 75 mins",
      bestFor: "Central London Hotels & Rail Connections",
    },
    {
      destination: "Stansted (STN) & London City (LCY) Inter-Airport",
      distance: "33 – 36 miles",
      estimatedTime: "45 - 55 mins",
      bestFor: "Fast Connecting Flight Transfers",
    },
    {
      destination: "Heathrow (LHR) & Gatwick (LGW) Inter-Airport",
      distance: "58 – 64 miles",
      estimatedTime: "70 - 90 mins",
      bestFor: "International Flight Connections via M25",
    },
  ]

  const generalTips = [
    "London Southend is a fast, compact terminal—most passengers exit baggage reclaim within 20 to 30 minutes of landing.",
    "Every Southend Airport pickup includes 45 minutes of complimentary waiting time from the moment your flight lands.",
    "We track all incoming flights at SEN in real time and adjust your driver's arrival time automatically if your flight is delayed.",
    "Keep your phone switched on after landing so your chauffeur can coordinate your pickup smoothly.",
  ]

  const faqs = [
    {
      q: "Where does the driver meet me at London Southend Airport (SEN)?",
      a: "Your chauffeur will wait inside the Main Terminal Arrivals Hall right outside the baggage reclaim exit doors, holding a name board with the lead passenger's name.",
    },
    {
      q: "How long does a taxi take from Southend Airport to Ilford or East London?",
      a: "Via the A127 corridor, a direct private hire transfer from London Southend Airport to Romford, Ilford, or Redbridge typically takes just 35 to 45 minutes.",
    },
    {
      q: "What if my flight into Southend Airport is delayed?",
      a: "We monitor live flight arrivals at Southend Airport. If your flight is delayed, we automatically shift your pickup time with zero extra waiting fees.",
    },
    {
      q: "Can I book an 8-seater MPV or child seats for Southend transfers?",
      a: "Yes. You can select spacious MPVs for up to 8 passengers and add infant, toddler, or booster seats on our online booking calculator.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Southend"
      airportCode="SEN"
      slug="southend-airport-transfers"
      tagline="Fixed-fare private hire taxi and chauffeur transfers between London Southend Airport (SEN), East London, Ilford, Essex, and Central London. 24/7 reliability."
      description="Luxelyne Transfers LTD (Company No. 16665396) provides direct, fixed-price private hire transfers to and from London Southend Airport (SEN). Located along the A127 corridor with rapid access to Ilford, Romford, Canary Wharf, and Central London, our service includes live flight monitoring, 45 minutes free waiting time, and terminal Meet & Greet."
      distanceToLondon="40 miles"
      avgTime="55 - 75 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      popularRoutes={popularRoutes}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}

