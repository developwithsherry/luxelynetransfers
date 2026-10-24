import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Gatwick Airport Transfers | Reliable Taxi & Private Hire",
  description:
    "Book premium Gatwick airport transfers. Private taxi hire serving LGW North and South terminals. Real-time flight tracking, flat rates & meet and greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/gatwick-airport-transfers",
  },
}

export default function GatwickTransfersPage() {
  const terminals = ["North Terminal", "South Terminal"]

  const terminalGuide = [
    {
      terminal: "North Terminal",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, directly opposite the international arrivals gate near the Costa Coffee outlet. The driver will hold a name board.",
    },
    {
      terminal: "South Terminal",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, opposite the main arrivals exit, near the Costa Coffee store or airport help desk. The driver will be holding a name board.",
    },
  ]

  const generalTips = [
    "Allow at least 45 to 60 minutes after landing to clear customs, retrieve bags, and exit.",
    "All airport pick-ups include 45 minutes of free waiting time starting from your flight landing time.",
    "We track your flight dynamically to make sure your driver is ready at the terminal when you exit, even if the flight is delayed.",
    "Make sure your mobile phone is switched on upon landing so the driver can connect with you immediately.",
  ]

  const faqs = [
    {
      q: "Where does the driver meet me at Gatwick?",
      a: "Our driver will wait inside the arrivals hall of your terminal (North or South), near the main international exits (next to Costa Coffee), holding a placard displaying the passenger's name.",
    },
    {
      q: "What if my flight to Gatwick is early or delayed?",
      a: "We track all incoming flights to Gatwick. We will adjust the driver dispatch time automatically, ensuring no extra wait charges for delays.",
    },
    {
      q: "How long is the travel time between Gatwick and Central London?",
      a: "Depending on the time of day and exact destination, a transfer between London Gatwick and Central London typically takes between 75 and 90 minutes.",
    },
    {
      q: "Can I book a child seat for a Gatwick transfer?",
      a: "Yes. Child, toddler, and infant seats can easily be added to your booking via the booking form configuration screen.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Gatwick"
      airportCode="LGW"
      tagline="Premium private hire taxi and airport transfers from Gatwick Airport (LGW) to central London and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD provides premium private hire services to and from London Gatwick Airport (LGW). Serving both North and South terminals, our service is tailored for travelers who appreciate promptness, clean modern fleets, and professional drivers. We monitor flights dynamically to manage scheduling adjustments for any arrival variations."
      distanceToLondon="28 miles"
      avgTime="75 - 90 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
