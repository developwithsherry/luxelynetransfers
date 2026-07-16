import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Heathrow Airport Transfers | Reliable Taxi & Private Hire",
  description:
    "Book premium Heathrow airport transfers. Reliable private taxi hire serving LHR Terminals 2, 3, 4, and 5. Flat rates, flight tracking & meet and greet.",
  alternates: {
    canonical: "https://luxelynetransfers.com/heathrow-airport-transfers",
  },
}

export default function HeathrowTransfersPage() {
  const terminals = ["Terminal 2", "Terminal 3", "Terminal 4", "Terminal 5"]

  const terminalGuide = [
    {
      terminal: "Terminal 2",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, directly in front of the WHSmith bookstore. Your chauffeur will be holding a premium board with your name clearly displayed.",
    },
    {
      terminal: "Terminal 3",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, near the Airport Information Desk and the WHSmith shop. Your chauffeur will be holding a board displaying your name.",
    },
    {
      terminal: "Terminal 4",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, by the Costa Coffee shop. Look for our professional driver holding a name board.",
    },
    {
      terminal: "Terminal 5",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, by the Costa Coffee shop (near international arrivals) or adjacent to the M&S Simply Food store, depending on which gate you exit. The driver will hold a name board.",
    },
  ]

  const generalTips = [
    "Allow at least 45 to 60 minutes after landing to clear passport control, customs, and retrieve luggage.",
    "We provide 45 minutes of free waiting time from the moment your flight lands to ensure a stress-free exit.",
    "We track your flight details dynamically. If your flight is early or delayed, we adjust the pickup time automatically.",
    "Be sure to provide your mobile number (including international dial code) to coordinate with your driver via call or WhatsApp.",
  ]

  const faqs = [
    {
      q: "How will I find my driver at Heathrow Airport?",
      a: "Our driver will meet you inside the arrivals hall of your specified terminal, near the designated meeting points (such as Costa Coffee or WHSmith), holding a sign showing the lead passenger's name.",
    },
    {
      q: "What happens if my flight to Heathrow is delayed?",
      a: "We track all arrivals. If your flight is delayed, your pickup time will be automatically adjusted so that your driver is there exactly when you land. There are no extra charges for delayed flights.",
    },
    {
      q: "Are airport drop-off/pickup fees and parking included?",
      a: "Yes, our quotes are transparent and include standard meet and greet parking and terminal drop-off/pickup fees. There are no hidden surprises.",
    },
    {
      q: "Can I request child seats for my transfer?",
      a: "Yes. You can select child seats, toddler seats, or infant capsules as addons during the booking process to ensure safety for the entire family.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Heathrow"
      airportCode="LHR"
      tagline="Premium private hire taxi and airport transfers from Heathrow Airport (LHR) to central London and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD provides professional chauffeur-driven private hire services across London Heathrow (LHR) terminals. We track your flight details in real time to adapt to any delays, ensuring that your driver is waiting for you when you land. Our vehicles are fully compliant, clean, and customized to accommodate individuals, families, and business travelers looking for stress-free ground transport."
      distanceToLondon="15 miles"
      avgTime="45 - 60 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
