"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function AboutFAQSection() {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "How does flight delay tracking work?",
      a: "We integrate directly with live flight arrival feeds. By tracking your flight number in real time, we automatically adjust your taxi pickup time for any delays or early arrivals. Your driver will enter the terminal accordingly, meaning zero waiting stress for you.",
    },
    {
      q: "What is your waiting time policy for airport pickups?",
      a: "Every airport transfer includes 45 minutes of complimentary waiting time starting from the moment your flight lands. This gives you plenty of time to clear passport control, collect your baggage, and exit to the arrivals hall.",
    },
    {
      q: "Is parking and meet & greet included in the fare?",
      a: "Yes, all airport quotes automatically include standard parking fees and meet & greet service. Your driver will be waiting inside the arrivals terminal holding a sign with your name. There are no hidden surcharges.",
    },
    {
      q: "What types of vehicles can I book?",
      a: "We offer a diverse fleet of clean, modern vehicles to suit your requirements, including standard saloons (Mercedes E-Class/BMW 5 Series equivalents), executive chauffeur cars, and spacious MPVs (Mercedes V-Class equivalents) capable of holding up to 8 passengers and extensive luggage.",
    },
    {
      q: "How can I pay for my transfer booking?",
      a: "We support secure, cashless payments directly on our platform. You can pay using major debit and credit cards, Stripe, or PayPal, ensuring your transaction is protected by industry-standard encryption.",
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
            Find answers to common questions about our booking procedures, airport pickup guidelines, and fleets.
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
