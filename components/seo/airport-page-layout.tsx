"use client"

import React, { useState } from "react"
import Header from "@/components/header"
import BookingForm from "@/components/booking-form"
import WhyChooseUs from "@/components/home/why-choose-us"
import { Footer } from "@/components/home/footer"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"
import { Plane, Clock, Compass, Info, ShieldCheck, ChevronDown, MapPin } from "lucide-react"

interface TerminalGuideItem {
  terminal: string;
  meetingPoint: string;
}

interface FAQItem {
  q: string;
  a: string;
}

interface AirportPageLayoutProps {
  airportName: string;
  airportCode: string;
  tagline: string;
  description: string;
  distanceToLondon: string;
  avgTime: string;
  terminals: string[];
  terminalGuide: TerminalGuideItem[];
  generalTips: string[];
  faqs: FAQItem[];
}

export default function AirportPageLayout({
  airportName,
  airportCode,
  tagline,
  description,
  distanceToLondon,
  avgTime,
  terminals,
  terminalGuide,
  generalTips,
  faqs
}: AirportPageLayoutProps) {
  const [activeTerminal, setActiveTerminal] = useState<string>(terminals[0] || "")
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)

  // Generate FAQ Schema dynamically for the page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  return (
    <>
      {/* FAQ Schema Injector */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black">
        {/* Split Hero Section with Light Background */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              
              {/* Left Column: Airport info, tagline, facts */}
              <div className="flex-1 text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
                  <Plane className="h-3.5 w-3.5" />
                  Airports We Cover
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                  {airportName} Airport Transfers <span className="text-lime-600 font-mono text-3xl md:text-4xl">({airportCode})</span>
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
                      <div className="text-xs text-neutral-450 font-medium">Distance</div>
                      <div className="text-sm font-bold text-neutral-850">{distanceToLondon}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Journey Time</div>
                      <div className="text-sm font-bold text-neutral-850">{avgTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-neutral-150 shadow-sm">
                    <div className="p-2.5 rounded-lg bg-lime-100 text-lime-800">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-450 font-medium">Meet & Greet</div>
                      <div className="text-sm font-bold text-neutral-850">Complimentary</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Just the Booking Calculator Card */}
              <div className="w-full lg:max-w-md xl:max-w-lg relative z-10">
                <BookingForm justForm={true} />
              </div>

            </div>
          </div>
        </section>

        {/* Terminal Pickup Guide */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
                Terminal Pickup Guide
              </h2>
              <p className="text-neutral-500 max-w-3xl leading-relaxed">
                Select your terminal to view specific pickup instructions where our professional chauffeur will meet you inside the arrivals terminal.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2.5">
              {terminals.map((terminal) => (
                <button
                  key={terminal}
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

            {/* Tab content */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
              {terminalGuide
                .filter((guide) => guide.terminal === activeTerminal)
                .map((guide, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-neutral-50 border border-neutral-100 text-neutral-700 text-xs font-semibold">
                      <MapPin className="h-3.5 w-3.5 text-lime-600" />
                      Meeting Point Instructions
                    </div>
                    <h3 className="text-xl font-bold text-neutral-850">{guide.terminal} meeting area</h3>
                    <p className="text-neutral-600 leading-relaxed whitespace-pre-line text-base font-light">
                      {guide.meetingPoint}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Airport Travel Tips */}
        <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
              Important travel guidelines
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {generalTips.map((tip, idx) => (
                <div key={idx} className="flex gap-4.5 p-6 bg-neutral-50/50 border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 p-2.5 h-fit rounded-xl bg-lime-50 text-lime-700">
                    <Info className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-neutral-600 font-normal leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section - Placed right above FAQs */}
        <WhyChooseUs />

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-t border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            <h2 className="text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
              Frequently Asked Questions
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
      </main>

      <WhatsAppContactButton />
      <Footer />
    </>
  )
}
