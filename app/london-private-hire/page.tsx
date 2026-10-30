import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/header"
import BookingForm from "@/components/booking-form"
import WhyChooseUs from "@/components/home/why-choose-us"
import { Footer } from "@/components/home/footer"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"
import {
  MapPin,
  Train,
  Building2,
  Ship,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plane,
} from "lucide-react"

export const metadata: Metadata = {
  title: "London Private Hire Taxi, Chauffeur & Train Station Transfers",
  description:
    "Book 24/7 fixed-fare private hire taxis & executive chauffeurs inside London. Serving Central London, Ilford & East London, Canary Wharf, Paddington, King's Cross St Pancras, Victoria & UK Cruise Ports.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/london-private-hire",
  },
  openGraph: {
    title: "London Private Hire Taxi, Executive Chauffeur & Station Transfers | Luxelyne Transfers",
    description:
      "24/7 fixed-price London private hire and chauffeur service across Central London, East London (Ilford/Redbridge), Canary Wharf, major rail stations, and UK airports.",
    url: "https://luxelynetransfers.co.uk/london-private-hire",
    images: ["/og-image.png"],
  },
}

const londonAreas = [
  {
    region: "Central London & West End",
    icon: Building2,
    areas: "Westminster, Mayfair, Soho, Covent Garden, Marylebone, Fitzrovia, Bloomsbury, Holborn",
    description:
      "Executive door-to-door transfers for luxury hotels, diplomatic missions, West End theatres, restaurants, and corporate headquarters with zero surge pricing.",
  },
  {
    region: "East London, Ilford & Redbridge Hub",
    icon: MapPin,
    areas: "Ilford (IG1–IG6), Gants Hill, Barkingside, Wanstead, Woodford, Chigwell, Romford, Stratford",
    description:
      "Local fixed-fare minicabs, daily school runs, Elizabeth Line station connections, and direct transfers from East London to Heathrow, Gatwick, Stansted, Luton, City & Southend.",
  },
  {
    region: "Canary Wharf, City & Docklands",
    icon: Building2,
    areas: "Canary Wharf (E14), Bank, Bishopsgate, Liverpool Street, ExCeL London, Greenwich, O2 Arena",
    description:
      "Punctual corporate roadshow chauffeurs, financial district private hire, and exhibition group MPV transfers for ExCeL London and London City Airport.",
  },
  {
    region: "West, North & South London",
    icon: MapPin,
    areas: "Kensington, Chelsea, Knightsbridge, Paddington, Hammersmith, Camden, Hampstead, Islington, Wimbledon",
    description:
      "24/7 pre-booked private hire for residential pickups, private hospitals (Harley Street), stadium events (Wembley, Twickenham, Wimbledon), and airport runs.",
  },
  {
    region: "London Rail & Eurostar Stations",
    icon: Train,
    areas: "King's Cross St Pancras (Eurostar), Paddington, Victoria, Waterloo, Euston, Liverpool Street, London Bridge",
    description:
      "Seamless rail-to-airport and station-to-hotel transfers with luggage assistance and pre-booked family MPVs.",
  },
  {
    region: "UK Cruise Ports & Intercity Rides",
    icon: Ship,
    areas: "Southampton Cruise Terminal, Dover Cruise Port, Portsmouth, Harwich, Oxford, Cambridge, Bicester Village",
    description:
      "Long-distance fixed-fare private hire connecting London hotels and airports directly to UK cruise ship terminals and university cities.",
  },
]

const faqs = [
  {
    q: "Can I book a private hire taxi inside London that is not an airport transfer?",
    a: "Yes. Luxelyne Transfers LTD operates 24/7 point-to-point private hire and chauffeur journeys across all London boroughs—including hotel transfers, train station connections (Paddington, King's Cross St Pancras, Victoria, Waterloo, Euston), corporate meetings, hospital appointments, and evening events.",
  },
  {
    q: "How is your London private hire pricing calculated compared to Uber or black cabs?",
    a: "Unlike metered black cabs (which charge by the minute in London traffic) or rideshare apps (which multiply fares during peak hours or rain), our fares are 100% fixed at the time of booking based on your route and vehicle class.",
  },
  {
    q: "Do you cover local private hire bookings in Ilford, Redbridge, and East London?",
    a: "Yes, our headquarters is located at 58 Peregrine Rd, Ilford (IG6 3SZ). We provide rapid, affordable fixed-fare private hire across Ilford, Gants Hill, Barkingside, Woodford, Chigwell, Romford, Stratford, and Canary Wharf.",
  },
  {
    q: "Can I book an 8-seater MPV for group travel or train station pickups in London?",
    a: "Absolutely. Our fleet includes executive saloons, luxury business cars, and spacious 6-to-8 passenger MPVs ideal for group travel, Eurostar arrivals at St Pancras, and cruise port transfers.",
  },
]

export default function LondonPrivateHirePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "London Private Hire & Stations", url: "https://luxelynetransfers.co.uk/london-private-hire" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black">
        {/* Split Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-neutral-500 flex items-center gap-2">
              <Link href="/" className="hover:text-lime-700 hover:underline">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-900 font-semibold">
                London Private Hire & Chauffeur
              </span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5" />
                  24/7 Greater London Private Hire
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                  London Private Hire Taxi &{" "}
                  <span className="text-lime-600">Executive Chauffeur</span>
                </h1>

                <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed">
                  Fixed-fare door-to-door private hire across Central London, Ilford & East London, Canary Wharf, major London train stations, and UK cruise ports.
                </p>

                <p className="text-base text-neutral-500 font-normal leading-relaxed">
                  Luxelyne Transfers LTD (Company No. 16665396) delivers pre-booked private hire and chauffeur journeys across all 32 London boroughs. Avoid black cab meter anxiety and rideshare surge pricing—lock in your exact fare online with DBS-vetted drivers and modern saloon, executive, or 8-seater MPV vehicles.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Availability</div>
                      <div className="text-sm font-bold text-neutral-850">24/7 Pre-Booked</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Pricing Model</div>
                      <div className="text-sm font-bold text-neutral-850">100% Fixed Fares</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <Train className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Coverage</div>
                      <div className="text-sm font-bold text-neutral-850">All London & UK</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:max-w-md xl:max-w-lg relative z-10">
                <BookingForm justForm={true} />
              </div>
            </div>
          </div>
        </section>

        {/* London Areas & Stations Grid */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-6xl space-y-10">
            <div className="space-y-3 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900">
                Areas, Rail Stations & Destinations We Cover
              </h2>
              <p className="text-neutral-500 leading-relaxed">
                From local East London minicab bookings in Ilford and Redbridge to executive corporate travel in Mayfair, Canary Wharf, and Central London rail terminals.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {londonAreas.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.region}
                    className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900">{item.region}</h3>
                      <p className="text-xs font-semibold text-lime-700 leading-relaxed">
                        {item.areas}
                      </p>
                      <p className="text-sm text-neutral-600 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs font-semibold text-neutral-700">
                      <CheckCircle2 className="h-4 w-4 text-lime-600 shrink-0" />
                      <span>Instant Online Postcode Fare Quote</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Direct Airport Links */}
        <section className="py-16 md:py-20 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-700">
                <Plane className="h-4 w-4" />
                Direct Airport Connections
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-900">
                Connecting Every London Postcode to All 6 Airports
              </h2>
              <p className="text-neutral-500 text-sm md:text-base">
                Need a fixed-price transfer from your London home, hotel, or office to the airport? Explore our dedicated terminal pickup guides:
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { name: "Heathrow Airport (LHR)", href: "/heathrow-airport-transfers" },
                { name: "Gatwick Airport (LGW)", href: "/gatwick-airport-transfers" },
                { name: "Stansted Airport (STN)", href: "/stansted-airport-transfers" },
                { name: "Luton Airport (LTN)", href: "/luton-airport-transfers" },
                { name: "London City Airport (LCY)", href: "/london-city-airport-transfers" },
                { name: "Southend Airport (SEN)", href: "/southend-airport-transfers" },
              ].map((airport) => (
                <Link
                  key={airport.href}
                  href={airport.href}
                  className="p-4 rounded-xl border border-neutral-200 hover:border-lime-500 bg-neutral-50/60 hover:bg-lime-50/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-sm font-bold text-neutral-850">{airport.name}</span>
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-lime-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <WhyChooseUs />

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-t border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
              London Private Hire — Frequently Asked Questions
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-3"
                >
                  <h3 className="text-base md:text-lg font-bold text-neutral-900">{faq.q}</h3>
                  <p className="text-sm text-neutral-600 font-light leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <WhatsAppContactButton />
      <Footer />
    </>
  )
}

