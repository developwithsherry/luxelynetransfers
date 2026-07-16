import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "London City Airport Transfers | Reliable Taxi & Private Hire",
  description:
    "Book premium London City airport transfers. Private taxi hire serving LCY. Real-time flight tracking, flat rates & meet and greet services.",
  alternates: {
    canonical: "https://luxelynetransfers.com/london-city-airport-transfers",
  },
}

export default function LondonCityTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, directly opposite the main arrivals exit near the Airport Information Desk. The driver will hold a name board.",
    },
  ]

  const generalTips = [
    "London City is a smaller airport with fast arrivals; we suggest scheduling your meeting time 20 to 30 minutes after landing.",
    "Your transfer booking includes 45 minutes of free waiting time from the landing time of your flight.",
    "We track your flight dynamically to coordinate driver arrivals, making sure there are no delay charges for delayed flights.",
    "Be sure to provide your flight number during booking to ensure accurate tracking.",
  ]

  const faqs = [
    {
      q: "Where is the meeting point at London City Airport?",
      a: "Our driver will wait inside the arrivals hall of the Main Terminal, directly opposite the arrivals exit near the Airport Information Desk, holding a sign displaying the passenger's name.",
    },
    {
      q: "What happens if my flight is delayed?",
      a: "We track all flights landing at London City Airport. In case of delay, the driver's pickup time is shifted automatically at no extra cost.",
    },
    {
      q: "How long is the transfer time from London City Airport to Central London?",
      a: "London City Airport is situated just 6 miles east of the City of London. Travel time is typically between 20 and 30 minutes depending on road conditions.",
    },
    {
      q: "Can I book child safety seats for a City Airport transfer?",
      a: "Yes. You can select child seats, infant seats, or booster seats as options on our booking form calculator.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="London City"
      airportCode="LCY"
      tagline="Premium private hire taxi and airport transfers from London City Airport (LCY) to central London and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD provides professional private hire transfers to and from London City Airport (LCY). Positioned closest to London's financial district, City Airport is a favorite for corporate travelers. Our services are tailored to provide fast, reliable, and comfortable transfers directly to your hotel or office."
      distanceToLondon="6 miles"
      avgTime="20 - 30 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
