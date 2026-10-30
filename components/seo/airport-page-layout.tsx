"use client"

import React, { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import BookingForm from "@/components/booking-form"
import WhyChooseUs from "@/components/home/why-choose-us"
import { Footer } from "@/components/home/footer"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"
import {
  Plane,
  Clock,
  Compass,
  Info,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Users,
  Briefcase,
  ArrowRight,
  Route,
} from "lucide-react"

export interface TerminalGuideItem {
  terminal: string
  meetingPoint: string
}

export interface FAQItem {
  q: string
  a: string
}

export interface PopularRouteItem {
  destination: string
  distance: string
  estimatedTime: string
  bestFor: string
}

interface AirportPageLayoutProps {
  airportName: string
  airportCode: string
  slug?: string
  tagline: string
  description: string
  distanceToLondon: string
  avgTime: string
  terminals: string[]
  terminalGuide: TerminalGuideItem[]
  generalTips: string[]
  faqs: FAQItem[]
  popularRoutes?: PopularRouteItem[]
}

const allAirportsLinks = [
  { name: "Heathrow Airport Transfers (LHR)", href: "/heathrow-airport-transfers", code: "LHR" },
  { name: "Gatwick Airport Transfers (LGW)", href: "/gatwick-airport-transfers", code: "LGW" },
  { name: "Stansted Airport Transfers (STN)", href: "/stansted-airport-transfers", code: "STN" },
  { name: "Luton Airport Transfers (LTN)", href: "/luton-airport-transfers", code: "LTN" },
  { name: "London City Airport Transfers (LCY)", href: "/london-city-airport-transfers", code: "LCY" },
  { name: "Southend Airport Transfers (SEN)", href: "/southend-airport-transfers", code: "SEN" },
]

export default function AirportPageLayout({
  airportName,
  airportCode,
  slug,
  tagline,
  description,
  distanceToLondon,
  avgTime,
  terminals,
  terminalGuide,
  generalTips,
  faqs,
  popularRoutes,
}: AirportPageLayoutProps) {
  const [activeTerminal, setActiveTerminal] = useState<string>(terminals[0] || "")
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0)

  const pageSlug =
    slug || `${airportName.toLowerCase().replace(/\s+/g, "-")}-airport-transfers`
  const pageUrl = `https://luxelynetransfers.co.uk/${pageSlug}`

  const defaultRoutes: PopularRouteItem[] = [
    {
      destination: "Central London (Westminster, Mayfair & Soho)",
      distance: distanceToLondon,
      estimatedTime: avgTime,
      bestFor: "Hotels, Business Meetings & West End",
    },
    {
      destination: "Canary Wharf & City of London (Financial District)",
      distance: airportCode === "LCY" ? "4 miles" : "20–38 miles",
      estimatedTime: airportCode === "LCY" ? "12 - 20 mins" : "50 - 80 mins",
      bestFor: "Corporate Travel & Executive Roadshows",
    },
    {
      destination: "Ilford, Redbridge & East London (IG1–IG6)",
      distance: airportCode === "STN" || airportCode === "LCY" ? "9–28 miles" : "25–42 miles",
      estimatedTime: airportCode === "LCY" ? "20 - 30 mins" : "40 - 75 mins",
      bestFor: "Residential Door-to-Door & Family Pickups",
    },
    {
      destination: "King's Cross St Pancras, Paddington & Victoria Stations",
      distance: distanceToLondon,
      estimatedTime: avgTime,
      bestFor: "Eurostar & UK National Rail Connections",
    },
    {
      destination: "Heathrow (LHR) / Gatwick (LGW) Inter-Airport Transfer",
      distance: "28–65 miles",
      estimatedTime: "45 - 85 mins",
      bestFor: "Connecting Flights & Airline Crew",
    },
    {
      destination: "Southampton & Dover Cruise Terminals",
      distance: "65–95 miles",
      estimatedTime: "80 - 120 mins",
      bestFor: "Cruise Passengers & Group MPV Transfers",
    },
  ]

  const routesToDisplay = popularRoutes && popularRoutes.length > 0 ? popularRoutes : defaultRoutes

  // 1. FAQPage Schema
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

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://luxelynetransfers.co.uk",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${airportName} Airport Transfers (${airportCode})`,
        "item": pageUrl,
      },
    ],
  }

  // 3. Airport-Specific TaxiService Schema
  const airportServiceSchema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": `${airportName} Airport Transfers (${airportCode}) — Luxelyne Transfers`,
    "description": description,
    "url": pageUrl,
    "serviceType": `${airportName} Airport Taxi, Private Hire & Chauffeur Meet and Greet`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Luxelyne Transfers LTD",
      "legalName": "Luxelyne Transfers LTD",
      "identifier": "16665396",
      "telephone": "+44 7460 019129",
      "email": "info@luxelynetransfers.co.uk",
      "url": "https://luxelynetransfers.co.uk",
      "priceRange": "££",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "58 Peregrine Rd",
        "addressLocality": "Ilford",
        "postalCode": "IG6 3SZ",
        "addressCountry": "GB",
      },
    },
    "areaServed": [
      {
        "@type": "Airport",
        "name": `London ${airportName} Airport`,
        "iataCode": airportCode,
      },
      {
        "@type": "City",
        "name": "London",
      },
    ],
  }

  return (
    <>
      {/* Structured Data Injectors */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(airportServiceSchema) }}
      />

      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black">
        {/* Split Hero Section with Light Background */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Visible Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 text-xs text-neutral-500 flex items-center gap-2">
              <Link href="/" className="hover:text-lime-700 hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-lime-700 hover:underline">
                Airport Transfers
              </Link>
              <span>/</span>
              <span className="text-neutral-900 font-semibold">
                {airportName} Airport ({airportCode})
              </span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Column: Airport info, tagline, facts */}
              <div className="flex-1 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
                  <Plane className="h-3.5 w-3.5" />
                  24/7 Fixed-Fare UK Airport Transfers
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                  {airportName} Airport Transfers{" "}
                  <span className="text-lime-600 font-mono text-3xl md:text-4xl">({airportCode})</span>
                </h1>

                <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed">
                  {tagline}
                </p>

                <p className="text-base text-neutral-500 font-normal leading-relaxed">
                  {description}
                </p>

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Central London</div>
                      <div className="text-sm font-bold text-neutral-850">{distanceToLondon}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Avg. Journey Time</div>
                      <div className="text-sm font-bold text-neutral-850">{avgTime}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Meet & Greet + Wait</div>
                      <div className="text-sm font-bold text-neutral-850">Included (45m Free)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Fare Calculator Card */}
              <div className="w-full lg:max-w-md xl:max-w-lg relative z-10">
                <BookingForm justForm={true} />
              </div>
            </div>
          </div>
        </section>

        {/* Terminal Pickup Guide (All Terminals Rendered in HTML DOM for Search & AI Crawlers) */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
                {airportName} Airport ({airportCode}) Terminal Pickup & Meet & Greet Guide
              </h2>
              <p className="text-neutral-500 max-w-3xl leading-relaxed">
                Select your arrival terminal below to view the designated meeting point where your chauffeur will wait inside the arrivals hall holding your personalized name board.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2.5" role="tablist" aria-label={`${airportName} Terminals`}>
              {terminals.map((terminal) => (
                <button
                  key={terminal}
                  role="tab"
                  aria-selected={activeTerminal === terminal}
                  onClick={() => setActiveTerminal(terminal)}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                    activeTerminal === terminal
                      ? "bg-lime-500 text-black border-lime-500 shadow-md shadow-lime-500/10"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-350 hover:text-neutral-900"
                  }`}
                >
                  {terminal}
                </button>
              ))}
            </div>

            {/* Tab content - All terminals stay in DOM so Googlebot & LLMs index every terminal */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
              {terminalGuide.map((guide, idx) => {
                const isActive = guide.terminal === activeTerminal
                return (
                  <div
                    key={idx}
                    role="tabpanel"
                    className={isActive ? "block space-y-4" : "hidden"}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-neutral-50 border border-neutral-100 text-neutral-700 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-lime-600" />
                      Official Arrivals Meeting Point
                    </div>
                    <h3 className="text-xl font-bold text-neutral-850">
                      {airportName} {guide.terminal} Meeting Area
                    </h3>
                    <p className="text-neutral-600 leading-relaxed whitespace-pre-line text-base font-light">
                      {guide.meetingPoint}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Popular Routes & Journey Time Guide (High-Value Structured Table for Google & AI Citations) */}
        <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-700">
                <Route className="h-4 w-4" />
                Fixed-Fare Route Guide
              </div>
              <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
                Popular {airportName} ({airportCode}) Private Hire Routes & Journey Times
              </h2>
              <p className="text-neutral-500 max-w-3xl leading-relaxed">
                All transfers to and from {airportName} Airport are fixed-price with zero surge charges, live flight tracking, and 45 minutes of free waiting time. Enter your exact postcodes in our calculator above for an instant quote.
              </p>
            </div>

            <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-sm">
              <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-900 font-semibold">
                  <tr>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-neutral-500">
                      Route / Destination from {airportCode}
                    </th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-neutral-500">
                      Approx. Distance
                    </th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-neutral-500">
                      Typical Journey Time
                    </th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-neutral-500">
                      Ideal For
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-600 bg-white">
                  {routesToDisplay.map((route, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-6 py-4 font-semibold text-neutral-900">
                        {airportName} ({airportCode}) ↔ {route.destination}
                      </td>
                      <td className="px-6 py-4">{route.distance}</td>
                      <td className="px-6 py-4 font-medium text-lime-700">{route.estimatedTime}</td>
                      <td className="px-6 py-4 text-neutral-500">{route.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Vehicle Classes for Airport Transfers */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
                Choose Your {airportName} Transfer Vehicle Class
              </h2>
              <p className="text-neutral-500 max-w-3xl leading-relaxed">
                Whether you are flying solo with hand luggage or arriving with a family of 8 and heavy suitcases, we assign the exact vehicle size you reserve.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-700">Most Popular</span>
                  <h3 className="text-xl font-bold text-neutral-900">Standard & Executive Saloon</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Ideal for 1–3 passengers with up to 2 large suitcases and 2 cabin bags. Clean, modern saloons for comfortable door-to-door airport travel.
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-lime-600" /> Up to 3–4 Pax
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-lime-600" /> 2 Large + 2 Small Bags
                  </span>
                </div>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-700">Corporate & VIP</span>
                  <h3 className="text-xl font-bold text-neutral-900">Executive Business Class</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Mercedes-Benz E-Class / S-Class or BMW 5/7 Series equivalents. Tailored for business travelers, corporate clients, and VIP airport arrivals.
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-lime-600" /> Up to 3 Pax
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-lime-600" /> 2 Large + 2 Cabin Bags
                  </span>
                </div>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-700">Families & Groups</span>
                  <h3 className="text-xl font-bold text-neutral-900">Luxury MPV & 8-Seater</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    Mercedes V-Class and spacious 8-passenger minibuses. Perfect for large families, group ski/golf baggage, and pre-fitted child safety seats.
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-lime-600" /> Up to 6–8 Pax
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-lime-600" /> 6–8 Large Suitcases
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href="/fleets"
                className="inline-flex items-center gap-2 text-sm font-bold text-lime-700 hover:underline"
              >
                <span>View Full Fleet Specifications</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#book-now"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-bold transition-colors"
              >
                <span>Calculate {airportName} Fare Now</span>
                <ArrowRight className="h-4 w-4 text-lime-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* Airport Travel Tips */}
        <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
              Important {airportName} ({airportCode}) Travel Guidelines
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {generalTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex gap-4.5 p-6 bg-neutral-50/50 border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 p-2.5 h-fit rounded-xl bg-lime-50 text-lime-700">
                    <Info className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-neutral-600 font-normal leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-t border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
              {airportName} Airport Transfers — Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFAQIndex === idx
                return (
                  <div
                    key={idx}
                    className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFAQIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between p-6 text-left font-bold text-neutral-850 hover:text-lime-750 transition-colors"
                    >
                      <span className="text-base md:text-lg">{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-neutral-400 transition-transform duration-350 ${
                          isOpen ? "transform rotate-180 text-lime-600" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`transition-all duration-350 ease-in-out ${
                        isOpen ? "max-h-96 border-t border-neutral-100" : "max-h-0"
                      } overflow-hidden`}
                    >
                      <p className="p-6 text-sm md:text-base text-neutral-600 leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Internal Linking Hub: Other UK Airports, London Private Hire & Travel Guides */}
        <section className="py-16 bg-white border-t border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-10">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-neutral-900">
                Explore Other UK Airports & London Private Hire Routes
              </h2>
              <p className="text-sm text-neutral-500">
                Luxelyne Transfers LTD operates 24/7 across all major London airports, inter-airport connections, and Greater London boroughs.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {allAirportsLinks
                .filter((a) => a.code !== airportCode)
                .map((airport) => (
                  <Link
                    key={airport.code}
                    href={airport.href}
                    className="p-4 rounded-xl border border-neutral-200 hover:border-lime-500 bg-neutral-50/50 hover:bg-lime-50/30 transition-all flex items-center justify-between group"
                  >
                    <span className="text-sm font-semibold text-neutral-800 group-hover:text-neutral-950">
                      {airport.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-lime-600 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              <Link
                href="/london-private-hire"
                className="p-4 rounded-xl border border-lime-500/40 bg-lime-50/40 hover:bg-lime-100/50 transition-all flex items-center justify-between group"
              >
                <span className="text-sm font-bold text-neutral-900">
                  Inside London Private Hire & Stations
                </span>
                <ArrowRight className="h-4 w-4 text-lime-700 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Helpful Airport Travel Guides */}
            <div className="pt-6 border-t border-neutral-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
                Helpful London Airport Transfer Guides
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/blog/best-way-to-book-heathrow-airport-taxi"
                  className="text-sm font-medium text-neutral-700 hover:text-lime-700 hover:underline"
                >
                  → Best Way to Book a Ride at Heathrow Airport (Guide)
                </Link>
                <Link
                  href="/blog/pre-booked-private-hire-vs-uber-heathrow"
                  className="text-sm font-medium text-neutral-700 hover:text-lime-700 hover:underline"
                >
                  → Why Choose Pre-Booked Private Hire Over Uber at Heathrow?
                </Link>
                <Link
                  href="/blog/affordable-private-hire-ilford-east-london"
                  className="text-sm font-medium text-neutral-700 hover:text-lime-700 hover:underline"
                >
                  → Affordable Private Hire in Ilford & East London
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppContactButton />
      <Footer />
    </>
  )
}
