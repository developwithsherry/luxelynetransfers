import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Stansted Airport Transfers | Reliable Taxi & Private Hire",
  description:
    "Book premium Stansted airport transfers. Private taxi hire serving STN terminals. Real-time flight tracking, flight delay management & meet and greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/stansted-airport-transfers",
  },
}

export default function StanstedTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, directly opposite the main international arrivals gate near the Burger King restaurant. The chauffeur will hold a name board.",
    },
  ]

  const generalTips = [
    "Stansted Airport can experience long immigration queues; we suggest allowing 45 to 60 minutes after landing to meet your driver.",
    "Your booking includes 45 minutes of complimentary waiting time starting from when the flight lands.",
    "Flights are monitored in real time, and driver dispatch times are adapted dynamically to prevent delay charges.",
    "Please check that you have entered your flight number correctly when checking out.",
  ]

  const faqs = [
    {
      q: "Where is the meeting point at Stansted Airport?",
      a: "Our driver will wait inside the arrivals hall of the Main Terminal, directly opposite the international arrivals exit near the Burger King, holding a placard displaying the passenger's name.",
    },
    {
      q: "What happens if my flight to Stansted is delayed?",
      a: "We track all flights landing at Stansted. If your flight is delayed, the driver's arrival time will be shifted accordingly, with no extra waiting fees.",
    },
    {
      q: "How long is the transfer from Stansted to London?",
      a: "London Stansted is located about 40 miles northeast of London. The journey duration is usually between 60 and 75 minutes, depending on traffic conditions.",
    },
    {
      q: "Are baby seats available for Stansted transfers?",
      a: "Yes, you can request child seats, booster seats, or infant seats when completing the booking calculator page.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Stansted"
      airportCode="STN"
      tagline="Premium private hire taxi and airport transfers from Stansted Airport (STN) to London and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD provides professional private hire transfers to and from London Stansted Airport (STN). Known as a major hub, Stansted requires precise timing to avoid traffic delays. Our service guarantees a smooth transition from the arrivals gate to your destination with fully-vetted drivers and clean, premium vehicles."
      distanceToLondon="40 miles"
      avgTime="60 - 75 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
