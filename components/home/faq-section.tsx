"use client"

import React, { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

export function HomeFAQSection() {
  const [openFAQs, setOpenFAQs] = useState<Record<number, boolean>>({})

  const toggleFAQ = (idx: number) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const faqs = [
    {
      q: "How do I book a private hire taxi to London airports with Luxelyne Transfers?",
      a: "Booking your London airport transfers is simple. You can use our secure online booking system to calculate fares and reserve your private hire taxi. We cover all major London airports including Heathrow (LHR), Gatwick (LGW), Stansted (STN), Luton (LTN), and London City Airport (LCY).",
    },
    {
      q: "What is included in your London Heathrow airport transfer service?",
      a: "Our premium London Heathrow airport transfer service includes a professional chauffeur, live flight tracking, and 45 minutes of complimentary waiting time. We also provide a complete 'Meet & Greet' service where your driver will meet you inside Heathrow Terminal 2, 3, 4, or 5 with a personalized name board.",
    },
    {
      q: "Do you operate your private hire taxi service in London 24/7?",
      a: "Yes, Luxelyne Transfers operates a reliable 24/7 private hire taxi and chauffeur service across London. Whether you have an early morning flight departure from Gatwick or a late-night arrival at Heathrow, our professional drivers are always on time to ensure a stress-free journey.",
    },
    {
      q: "How are flight delays managed for London airport pickups?",
      a: "We monitor all incoming flight arrivals at London Heathrow, Gatwick, Stansted, Luton, and London City airports in real time. If your flight is delayed or lands early, we adjust your airport taxi pickup time automatically, saving you from extra waiting fees or missed connections.",
    },
    {
      q: "What types of vehicles are available in your London chauffeur fleet?",
      a: "Our luxury private hire fleet features premium saloons for business travel, executive cars for corporate hire, and spacious multi-purpose vehicles (MPVs/Minibuses like the Mercedes V-Class) that accommodate up to 8 passengers and extensive luggage, ideal for group airport transfers.",
    },
    {
      q: "Are there any hidden fees in your London airport taxi quotes?",
      a: "No, Luxelyne Transfers believes in 100% price transparency. All of our London airport taxi and private hire quotes include meet & greet, flight tracking, standard airport parking, and tolls. The price you see on our booking form is the final price you pay.",
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

  const renderFAQItem = (faq: typeof faqs[0], globalIdx: number) => {
    const isOpen = !!openFAQs[globalIdx]
    return (
      <div
        key={globalIdx}
        className={`border rounded-2xl overflow-hidden transition-all duration-300 h-fit ${
          isOpen 
            ? "border-accent/40 bg-accent/5 shadow-md" 
            : "border-border bg-card hover:border-accent/30 hover:shadow-sm"
        }`}
      >
        <button
          onClick={() => toggleFAQ(globalIdx)}
          className="w-full flex items-center justify-between p-6 text-left font-bold text-card-foreground hover:text-accent transition-colors"
        >
          <span className="text-base md:text-lg pr-4">{faq.q}</span>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
              isOpen ? "transform rotate-180 text-accent" : ""
            }`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 border-t border-border/50" : "max-h-0"
          } overflow-hidden`}
        >
          <p className="p-6 text-sm md:text-base text-muted-foreground leading-relaxed">
            {faq.a}
          </p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/5 to-background border-t border-border">
      {/* Dynamic Schema Injection for Google Search Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-semibold tracking-wide uppercase">
            <HelpCircle className="w-4 h-4" /> FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Find answers to common questions about our 24/7 private hire taxis, airport transfers, and booking procedures in London.
          </p>
        </div>

        {/* 2-Column FAQ Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column (Items 1-3) */}
          <div className="space-y-4">
            {faqs.slice(0, 3).map((faq, idx) => renderFAQItem(faq, idx))}
          </div>

          {/* Right Column (Items 4-6) */}
          <div className="space-y-4">
            {faqs.slice(3, 6).map((faq, idx) => renderFAQItem(faq, idx + 3))}
          </div>
        </div>
      </div>
    </section>
  )
}
