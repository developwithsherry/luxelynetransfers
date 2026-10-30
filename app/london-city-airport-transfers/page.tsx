import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "London City Airport Transfers (LCY) | Executive Taxi & Private Hire",
  description:
    "Book fixed-price London City Airport transfers (LCY) to Canary Wharf, City of London, Ilford & Central London. Fast executive chauffeur & private hire with Meet & Greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/london-city-airport-transfers",
  },
  openGraph: {
    title: "London City Airport Transfers (LCY) | Executive Chauffeur & Private Hire",
    description:
      "Fast, fixed-fare London City Airport (LCY) taxi and executive chauffeur service to Canary Wharf, the City, Ilford & West End.",
    url: "https://luxelynetransfers.co.uk/london-city-airport-transfers",
    images: ["/og-image.png"],
  },
}

export default function LondonCityTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the London City Airport Main Terminal Arrivals Hall, directly opposite the main arrivals exit near the Airport Information Desk and WHSmith, holding a personalized name board.",
    },
  ]

  const popularRoutes = [
    {
      destination: "Canary Wharf & ExCeL London (Docklands E14 / E16)",
      distance: "2 – 4 miles",
      estimatedTime: "8 - 15 mins",
      bestFor: "Executive Financial & Exhibition Transfers",
    },
    {
      destination: "City of London (Bank, Liverpool Street & Bishopsgate)",
      distance: "6 – 7 miles",
      estimatedTime: "20 - 28 mins",
      bestFor: "Corporate Roadshows & Banking District",
    },
    {
      destination: "Ilford, Redbridge, Stratford & East London (IG1–IG6)",
      distance: "7 – 9 miles",
      estimatedTime: "18 - 25 mins",
      bestFor: "Rapid Local Door-to-Door Pickups",
    },
    {
      destination: "Westminster, Mayfair & West End Hotels",
      distance: "9 – 11 miles",
      estimatedTime: "30 - 40 mins",
      bestFor: "Luxury Hotel & Diplomatic Transfers",
    },
    {
      destination: "Heathrow Airport (LHR) / Gatwick Airport (LGW)",
      distance: "24 – 36 miles",
      estimatedTime: "50 - 70 mins",
      bestFor: "Executive Inter-Airport Connections",
    },
  ]

  const generalTips = [
    "London City Airport offers rapid arrivals; most passengers clear baggage reclaim within 15 to 25 minutes of landing.",
    "Your transfer booking still includes a full 45 minutes of complimentary waiting time from the landing time of your flight.",
    "We track your flight dynamically to coordinate driver dispatch, ensuring zero delay charges if your flight is held up.",
    "Provide your flight number during booking so we can monitor your arrival gate in real time.",
  ]

  const faqs = [
    {
      q: "Where is the meeting point at London City Airport (LCY)?",
      a: "Our driver waits inside the Main Terminal Arrivals Hall, directly opposite the passenger exit near the Airport Information Desk, holding a sign displaying your name.",
    },
    {
      q: "How close is London City Airport to Canary Wharf and Ilford?",
      a: "London City Airport is just 3 miles (10–15 minutes) from Canary Wharf, 2 miles from ExCeL London, and 8 miles (20 minutes) from Ilford and Redbridge.",
    },
    {
      q: "What happens if my flight into London City Airport is delayed?",
      a: "We track all incoming flights to LCY in real time. In case of delay, your chauffeur's pickup time is shifted automatically at no extra cost.",
    },
    {
      q: "Can I book child safety seats for a London City Airport transfer?",
      a: "Yes. You can select infant, toddler, or booster seats as options on our online booking calculator.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="London City"
      airportCode="LCY"
      slug="london-city-airport-transfers"
      tagline="Executive private hire taxi and chauffeur transfers from London City Airport (LCY) to Canary Wharf, the City, Ilford and Central London. 24/7 reliability."
      description="Luxelyne Transfers LTD (Company No. 16665396) provides fast, executive private hire transfers to and from London City Airport (LCY). Positioned in the Royal Docks right next to Canary Wharf, ExCeL London, and Ilford, LCY is London's premier business gateway. Enjoy fixed fares, live flight tracking, and terminal Meet & Greet."
      distanceToLondon="6 miles"
      avgTime="20 - 30 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      popularRoutes={popularRoutes}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
