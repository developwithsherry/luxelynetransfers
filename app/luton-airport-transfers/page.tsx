import type { Metadata } from "next"
import AirportPageLayout from "@/components/seo/airport-page-layout"

export const metadata: Metadata = {
  title: "Luton Airport Transfers | Reliable Taxi & Private Hire",
  description:
    "Book premium Luton airport transfers. Private taxi hire serving LTN terminals. Real-time flight tracking, delay management & meet and greet.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/luton-airport-transfers",
  },
}

export default function LutonTransfersPage() {
  const terminals = ["Main Terminal"]

  const terminalGuide = [
    {
      terminal: "Main Terminal",
      meetingPoint:
        "Our driver will meet you inside the Arrivals Hall, directly opposite the international arrivals exit near the Costa Coffee outlet. The driver will hold a name board.",
    },
  ]

  const generalTips = [
    "We suggest allowing 45 to 60 minutes after landing to retrieve luggage and pass customs before meeting your driver.",
    "Your booking comes with 45 minutes of free waiting time from the moment the aircraft lands.",
    "We track your flight path in real time. If your flight is early or delayed, the driver's arrival time shifts automatically.",
    "Luton airport has custom drop-off/pickup zones; our meet and greet service ensures you avoid navigating these zones yourself.",
  ]

  const faqs = [
    {
      q: "Where is the meeting point at Luton Airport?",
      a: "Our driver will wait inside the arrivals hall of the Main Terminal, opposite the international arrivals exit near the Costa Coffee, holding a sign displaying the passenger's name.",
    },
    {
      q: "What if my flight to Luton is delayed?",
      a: "We track all incoming flights to Luton Airport. If your flight is delayed, the pickup time will adjust automatically, and there are no extra fees for delays.",
    },
    {
      q: "How long is the transfer from Luton to Central London?",
      a: "London Luton is located about 34 miles north of Central London. The travel time is typically between 55 and 70 minutes, depending on traffic flow.",
    },
    {
      q: "Can I request infant seats for my Luton transfer?",
      a: "Yes. You can add infant, toddler, or child seats during the booking process on our calculator page.",
    },
  ]

  return (
    <AirportPageLayout
      airportName="Luton"
      airportCode="LTN"
      tagline="Premium private hire taxi and airport transfers from Luton Airport (LTN) to London and beyond. 24/7 reliability."
      description="Luxelyne Transfers LTD offers premier private hire transportation to and from London Luton Airport (LTN). Whether traveling for business or leisure, our service ensures a comfortable, safe, and timely transfer. We track your flight details and coordinate closely to ensure a seamless airport pickup experience."
      distanceToLondon="34 miles"
      avgTime="55 - 70 mins"
      terminals={terminals}
      terminalGuide={terminalGuide}
      generalTips={generalTips}
      faqs={faqs}
    />
  )
}
