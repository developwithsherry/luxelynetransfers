import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Heathrow Airport Transfers (LHR) | Fixed-Fare Taxi & Meet & Greet",
  description:
    "Book fixed-price Heathrow Airport transfers (LHR) to/from Central London, Ilford, Canary Wharf & UK airports. 24/7 private hire taxi serving Terminals 2, 3, 4 & 5 with live flight tracking & 45 mins free waiting.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/heathrow-airport-transfers",
  },
  openGraph: {
    title: "Heathrow Airport Transfers (LHR) | 24/7 Fixed-Fare Taxi & Private Hire",
    description:
      "Reliable Heathrow Airport taxi & chauffeur service covering LHR Terminals 2, 3, 4 & 5. Complimentary Meet & Greet, live flight tracking, and 45 minutes free waiting time.",
    url: "https://luxelynetransfers.co.uk/heathrow-airport-transfers",
    images: ["/og-image.png"],
  },
}

export default function HeathrowTransfersPage() {
  const terminals = ["Terminal 2", "Terminal 3", "Terminal 4", "Terminal 5"]

  const terminalGuide = [
    {
      terminal: "Terminal 2",
      meetingPoint:
        "Our driver will meet you inside the Terminal 2 (The Queen's Terminal) Arrivals Hall, directly in front of the WHSmith bookstore near the main passenger exit. Your chauffeur will be holding a name board with your name clearly displayed.",
    },
    {
      terminal: "Terminal 3",
      meetingPoint:
        "Our driver will meet you inside the Terminal 3 Arrivals Hall, directly opposite the international arrivals exit near the Airport Information Desk and WHSmith shop. Your chauffeur will hold a personalized name board.",
    },
    {
      terminal: "Terminal 4",
      meetingPoint:
        "Our driver will meet you inside the Terminal 4 Arrivals Hall, adjacent to the Costa Coffee shop opposite the customs exit. Look for your driver holding a name board.",
    },
    {
      terminal: "Terminal 5",
      meetingPoint:
        "Our driver will meet you inside the Terminal 5 Arrivals Hall, by the Costa Coffee shop (South / International Arrivals) or adjacent to the M&S Simply Food store (North Arrivals), holding a clear name board.",
    },
  ]

  const popularRoutes = [
    {
      destination: "Central London (Westminster, Mayfair, Soho & Kensington)",
      distance: "15 – 18 miles",
      estimatedTime: "45 - 60 mins",
      bestFor: "West End Hotels, Mayfair & Business Travel",
    },
    {
      destination: "Canary Wharf & City of London (EC1–EC4 / E14)",
      distance: "22 – 25 miles",
      estimatedTime: "55 - 75 mins",
      bestFor: "Corporate Finance & ExCeL London Exhibitions",
    },
    {
      destination: "Ilford, Redbridge, Stratford & East London (IG1–IG6)",
      distance: "28 – 34 miles",
      estimatedTime: "55 - 75 mins",
      bestFor: "Door-to-Door Residential & Family Transfers",
    },
    {
      destination: "Paddington, King's Cross St Pancras, Victoria & Waterloo",
      distance: "15 – 19 miles",
      estimatedTime: "40 - 60 mins",
      bestFor: "Eurostar & UK Rail Station Connections",
    },
    {
      destination: "Gatwick Airport (LGW) Inter-Airport Transfer",
      distance: "38 – 42 miles",
      estimatedTime: "45 - 65 mins",
      bestFor: "Direct M25 Flight Connections",
    },
    {
      destination: "Southampton & Dover Cruise Terminals",
      distance: "65 – 98 miles",
      estimatedTime: "75 - 115 mins",
      bestFor: "Cruise Ships & Group 8-Seater MPV Bookings",
    },
  ]

  const generalTips = [
    "Allow at least 45 to 60 minutes after landing at Heathrow to clear passport control, customs, and baggage reclaim.",
    "Every Heathrow pickup includes 45 minutes of complimentary waiting time from the actual landing time of your flight.",
    "We track your flight number in real time—if your flight lands early or is delayed, we adjust your pickup time automatically at no extra charge.",
    "Keep your mobile phone or WhatsApp switched on after landing so your chauffeur can coordinate directly with you.",
  ]

  const faqs = [
    {
      q: "How will I find my driver at Heathrow Airport (Terminals 2, 3, 4, or 5)?",
      a: "Our driver will meet you inside the arrivals hall of your arrival terminal (T2 by WHSmith, T3 by WHSmith/Info Desk, T4 by Costa Coffee, or T5 by Costa Coffee/M&S), holding a board displaying the lead passenger's name.",
    },
    {
      q: "What happens if my flight to Heathrow is delayed or lands early?",
      a: "We monitor live Heathrow flight arrivals. If your flight is delayed or arrives early, your driver's dispatch and pickup time adjust automatically—with zero extra charges for flight delays.",
    },
    {
      q: "Are Heathrow terminal drop-off/pickup fees and parking included?",
      a: "Yes. Our fixed-fare quotes are 100% transparent and include standard terminal meet and greet parking and Heathrow forecourt charges. There are no hidden fees or surge pricing.",
    },
    {
      q: "Can I book an 8-seater MPV or child seats for a Heathrow family transfer?",
      a: "Yes. You can choose a spacious MPV/Minibus (accommodating up to 8 passengers and luggage) and request infant, toddler, or booster seats during online checkout.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Heathrow"
      airportCode="LHR"
      slug="heathrow-airport-transfers"
      tagline="Fixed-fare private hire taxi and chauffeur transfers to and from London Heathrow Airport (LHR) Terminals 2, 3, 4 & 5. Operating 24/7."
      description="Luxelyne Transfers LTD (Company No. 16665396) provides professional door-to-door private hire and executive chauffeur transfers across all London Heathrow (LHR) terminals. We monitor your flight in real time to adapt automatically to delays, include 45 minutes of free waiting time, and provide complimentary Meet & Greet inside the arrivals hall."
      distanceToLondon="15 miles"
      avgTime="45 - 60 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      popularRoutes={popularRoutes}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
