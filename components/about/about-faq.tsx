"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function AboutFAQSection() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "Are you a licensed private hire operator?",
      a: "Yes. Luxelyne Transfers LTD (UK Company No. 16665396) is a fully licensed private hire operator. In accordance with UK private hire regulations, all journeys are pre-booked, officially logged, and fulfilled exclusively by licensed, DBS-vetted private hire drivers in PHV-compliant vehicles.",
    },
    {
      q: "Do you specialize in long-distance private hire runs as well as airport transfers?",
      a: "Absolutely. Alongside 24/7 transfers to Heathrow, Gatwick, Stansted, Luton, London City, and Southend airports, we specialize in long-distance intercity private hire journeys. We regularly provide direct door-to-door long runs between London, UK airports, cruise terminals (Southampton, Dover, Portsmouth), and cities across England, Wales, and Scotland at competitive fixed rates.",
    },
    {
      q: "How does your live flight tracking and airport waiting time work?",
      a: "When you provide your flight number during booking, our dispatch system tracks your aircraft in real time via live aviation feeds. Whether your flight lands early or is delayed, we automatically adjust your driver's dispatch time and include 45 minutes of complimentary waiting time from the actual landing minute.",
    },
    {
      q: "Is terminal Meet & Greet included in your airport transfer fares?",
      a: "Yes, every pre-booked airport pickup includes our professional Meet & Greet service and standard terminal parking. Your licensed private hire driver will wait inside the arrivals hall holding a name board, assist with your luggage, and escort you directly to your vehicle—with no hidden extras.",
    },
    {
      q: "What vehicles are available for airport transfers and long-distance trips?",
      a: "Our licensed private hire fleet is tailored for both high-luggage airport runs and extended motorway travel. You can book modern Saloons, Executive Business Class sedans (Mercedes E-Class equivalents), spacious Estate cars, and 8-seater Luxury MPVs (Mercedes V-Class equivalents) ideal for families, corporate groups, and long-distance comfort.",
    },
  ]

  // Generate FAQ Schema for Google
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
    <section className="py-16 md:py-24 bg-neutral-50/40 border-t border-neutral-100">
      {/* Dynamic Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Everything you need to know about booking with a licensed UK private hire operator for airport transfers and long-distance journeys.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFAQIndex === idx
            return (
              <div
                key={idx}
                className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm transition-all duration-305"
              >
                <button
                  onClick={() => setOpenFAQIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-neutral-850 hover:text-lime-700 transition-colors"
                >
                  <span className="text-base md:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-lime-600" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
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
  )
}
