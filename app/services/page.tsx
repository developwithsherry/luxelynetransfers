import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"
import { Plane, Calendar, MapPin, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Private Hire, Airport Chauffeur & Event Taxi Services in London",
  description:
    "Discover our 24/7 private hire taxi and executive chauffeur services across London and UK airports. Fixed-fare airport transfers, corporate & wedding travel, day tours, and DBS-vetted school transport.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/services",
  },
  openGraph: {
    title: "Private Hire, Airport Chauffeur & Event Taxi Services in London | Luxelyne Transfers",
    description:
      "24/7 fixed-fare airport transfers, corporate & event chauffeur hire, UK day tours, and DBS-checked school transport across London.",
    url: "https://luxelynetransfers.co.uk/services",
    images: ["/og-image.png"],
  },
}

const servicesList = [
  {
    id: "airport-transfers",
    icon: Plane,
    title: "Airport Transfers",
    description: "Punctual and stress-free airport transfers with professional drivers, ensuring a smooth start or end to your journey.",
    detailedDescription:
      "Our premium airport transfer service takes the complete hassle out of travel. We monitor your flight status in real-time, meaning that if your flight is early or delayed, our driver will be there exactly when you land. We provide a complimentary Meet & Greet service in the arrivals hall, helping with your luggage and guiding you to your executive vehicle across Heathrow, Gatwick, Stansted, Luton, London City, and Southend airports.",
    features: [
      "Real-time flight path monitoring",
      "Complimentary Meet & Greet in the arrivals hall",
      "45 minutes of complimentary waiting time after landing",
      "Help with luggage and terminal navigation",
      "Saloon, executive, and 8-seater MPV vehicle options",
      "24/7 fixed-fare service for all major UK airports",
    ],
    keywords: [
      "Heathrow Transfers (LHR)",
      "Gatwick Taxi (LGW)",
      "Stansted Private Hire (STN)",
      "Luton Airport Taxi (LTN)",
      "London City Transfer (LCY)",
      "Southend Airport (SEN)",
      "Flight Tracking",
      "Meet & Greet",
    ],
    image: "/luxury-car-at-airport-terminal-professional-chauff.png",
  },
  {
    id: "event-transfers",
    icon: Calendar,
    title: "Event & Corporate Transfers",
    description: "Reliable transport for weddings, parties, and corporate events—your guests arrive on time, in comfort and style.",
    detailedDescription:
      "Arrive at your next event in absolute comfort and make a lasting impression. Whether it is a grand wedding, corporate roadshow at ExCeL London, sports event at Wembley or Wimbledon, or a private gala in Mayfair, our fleet of luxury vehicles and professional chauffeurs ensure seamless group coordination, prompt pickups, and stress-free drop-offs.",
    features: [
      "VIP Chauffeur service for guests and corporate clients",
      "Group passenger transport coordination",
      "Spacious 8-seater MPV and luxury saloon options",
      "Flexible point-to-point and hourly bookings",
      "Impeccable vehicle cleanliness standards",
      "Polite, professionally dressed chauffeurs",
    ],
    keywords: [
      "Wedding Chauffeur",
      "Corporate Travel London",
      "VIP Chauffeur",
      "Luxury MPV Hire",
      "ExCeL London Transfers",
      "Chauffeur Service London",
      "Event Coordination",
      "Premium Fleet",
    ],
    image: "/elegant-wedding-car-with-ribbons-luxury-event-tran.png",
  },
  {
    id: "day-tours",
    icon: MapPin,
    title: "London & UK Day Tours",
    description: "Explore iconic destinations across London and the UK with our tailored day and weekly tour packages.",
    detailedDescription:
      "Discover the best of London and the United Kingdom on your own schedule. Our customized day and weekly tours offer you a private chauffeur with local route expertise. From historical landmarks in Central London to Windsor Castle, Oxford, Stonehenge, Bath, and the Cotswolds, we tailor the itinerary completely to your travel preferences.",
    features: [
      "Fully customized UK travel itineraries",
      "Private driver with extensive local route expertise",
      "Multiple sightseeing and shopping stops (e.g., Bicester Village)",
      "Chauffeur support for luggage and families",
      "Flexible half-day, full-day, and multi-day packages",
      "Spacious and climate-controlled luxury cabins",
    ],
    keywords: [
      "London Sightseeing",
      "Windsor & Stonehenge Tours",
      "Private Chauffeur Tour",
      "Bicester Village Transfers",
      "Southampton Cruise Transfers",
      "Day Trips from London",
    ],
    image: "/luxury-car-in-front-of-big-ben-london-tourist-dest.png",
  },
  {
    id: "school-transport",
    icon: GraduationCap,
    title: "School & College Transport",
    description: "Safe, timely, and trusted pickup and drop-off services for students, with DBS-checked drivers and GPS-tracked vehicles.",
    detailedDescription:
      "We provide trusted and safe school, college, and university transport solutions across Ilford, Redbridge, East London, and Greater London. Our drivers are fully DBS-checked, vetted, and experienced in student transport. With GPS-tracked vehicles and regular scheduling, we ensure complete peace of mind for parents and punctual transport for students.",
    features: [
      "Fully DBS-checked and background-vetted drivers",
      "GPS-tracked vehicles for real-time route monitoring",
      "Consistent daily scheduling and punctual pickup times",
      "Direct parent communication and arrival updates",
      "Strict UK council and DVLA vehicle safety compliance",
      "Safe, comfortable child and youth transport",
    ],
    keywords: [
      "Safe School Taxi London",
      "DBS-Checked Chauffeur",
      "Student Travel",
      "GPS-Tracked Ride",
      "Ilford & Redbridge School Run",
      "Reliable Pickups",
      "University Transfers",
    ],
    image: "/safe-family-car-school-transport-professional-driv.png",
  },
]

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "Services", url: "https://luxelynetransfers.co.uk/services" },
        ]}
      />
      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border-b border-neutral-100">
          <div className="container mx-auto px-6 max-w-7xl text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
              Our Expertise
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight max-w-4xl mx-auto">
              London Airport Transfers, Chauffeur & Private Hire Services
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
              Explore our 24/7 fixed-fare executive travel solutions across Heathrow, Gatwick, Stansted, Luton, London City, Southend, and all London boroughs.
            </p>
          </div>
        </section>

        {/* Detailed Services Sections (Alternating Rows) */}
        <section className="py-20 md:py-28 divide-y divide-neutral-100">
          {servicesList.map((service, index) => {
            const Icon = service.icon
            const isEven = index % 2 === 0

            return (
              <div
                key={service.id}
                id={service.id}
                className="py-16 md:py-24 first:pt-0 last:pb-0"
              >
                <div className="container mx-auto px-6 max-w-7xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Image Block */}
                    <div className={`lg:col-span-6 relative group ${!isEven ? "lg:order-last" : ""}`}>
                      <div className="absolute inset-0 bg-lime-400/20 rounded-3xl translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 border border-lime-400/30" />

                      <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-xl border border-neutral-100 bg-neutral-950">
                        <Image
                          src={service.image}
                          alt={`${service.title} - Luxelyne Transfers London`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover filter grayscale transition-all duration-700 group-hover:grayscale-[0.3] group-hover:scale-[1.02]"
                        />
                      </div>
                    </div>

                    {/* Content Block */}
                    <div className="lg:col-span-6 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-lime-50 text-lime-700 p-3 rounded-2xl border border-lime-100">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-lime-700">
                          Service 0{index + 1}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
                        {service.title}
                      </h2>

                      <p className="text-neutral-600 leading-relaxed text-base md:text-lg font-light">
                        {service.detailedDescription}
                      </p>

                      {/* Features */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Included With Every Booking</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-neutral-700 text-sm">
                              <CheckCircle2 className="w-5 h-5 text-lime-650 shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Coverage & Specializations */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Service Coverage & Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.keywords.map((keyword, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold tracking-wider uppercase bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="pt-4">
                        <Link
                          id={`btn-book-${service.id}`}
                          href="/#book-now"
                          className="inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-xl shadow-md transition-all duration-200 text-sm"
                        >
                          <span>Book {service.title} Now</span>
                          <ArrowRight className="w-4 h-4 text-lime-400" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Global CTA Section */}
        <section className="bg-neutral-950 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(216,236,90,0.1),transparent_70%)] pointer-events-none" />
          <div className="container mx-auto px-6 max-w-4xl text-center space-y-8 relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Ready to Book Your London Transfer?
            </h2>
            <p className="text-neutral-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Get an instant fixed-fare quote and book online in under 2 minutes. Experience top-tier passenger comfort and 24/7 professional chauffeur service.
            </p>
            <div className="pt-4">
              <Link
                href="/#book-now"
                className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold px-10 py-5 rounded-xl shadow-lg shadow-accent/15 hover:bg-accent/90 active:scale-95 transition-all duration-200 text-sm tracking-wider uppercase"
              >
                Instant Online Booking
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
