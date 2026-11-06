import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"
import ImageSection from "@/components/carousal"
import AboutSection from "@/components/about/about-section"
import OurMission from "@/components/about/our-mission"
import BannerCTA from "@/components/about/banner"
import WhyChooseUs from "@/components/home/why-choose-us"
import AboutFAQSection from "@/components/about/about-faq"
import { ShieldCheck, Award, Clock, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Licensed UK Private Hire Operator for Airport Transfers & Long-Distance Travel",
  description:
    "Luxelyne Transfers LTD (UK Company No. 16665396) is a fully licensed private hire operator specializing in 24/7 London airport transfers and long-distance intercity journeys across Heathrow, Gatwick, Stansted, Luton, London City & nationwide.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/about",
  },
  openGraph: {
    title: "About Luxelyne Transfers LTD | Licensed Private Hire Operator & Airport Specialists",
    description:
      "Fully licensed UK private hire operator (Company No. 16665396) specializing in fixed-fare airport transfers, executive chauffeur travel, and long-distance nationwide runs.",
    url: "https://luxelynetransfers.co.uk/about",
    images: ["/og-image.png"],
  },
}

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "About Us", url: "https://luxelynetransfers.co.uk/about" },
        ]}
      />
      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black">
        {/* Premium Light-Themed Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-7xl text-center space-y-12">
            {/* Heading */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
                Licensed Private Hire Operator • UK Company No. 16665396
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                Specialists in Airport Transfers & Long-Distance Private Hire
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
                As a fully licensed UK private hire operator, we deliver pre-booked, fixed-fare airport transfers and nationwide long-distance journeys with vetted PHV drivers 24/7.
              </p>
            </div>

            {/* Carousel / Grid Images */}
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-neutral-100 bg-neutral-950 p-6">
              <ImageSection />
            </div>
          </div>
        </section>

        {/* About Main Info Section */}
        <AboutSection />

        {/* Expertise & Trust Badges Section */}
        <section className="py-16 md:py-24 bg-neutral-50/40 border-t border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-5xl space-y-12 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-neutral-900">
                Licensed Private Hire Operator Standards & Compliance
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                As an authorized private hire operator, every pre-booked journey is dispatched, tracked, and logged under strict UK private hire regulations to guarantee passenger safety and punctuality.
              </p>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Licensed PHV Operator</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Registered in England & Wales (Company No. 16665396), operating as a licensed private hire operator compliant with UK PHV dispatch and safety standards.
                </p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Badged & DBS-Vetted Drivers</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Every private hire driver holds a valid PHV licence, undergoes enhanced DBS background checks, medical screening, and route assessments.
                </p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">24/7 Airport & Flight Dispatch</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Our dispatch team monitors live flight arrivals in real time, automatically adjusting pickup times for early or delayed flights with 45 mins free waiting.
                </p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Long-Run & Airport Fleet</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Our PHV-licensed vehicles—from executive saloons and estates to 8-seater MPVs—are maintained specifically for airport transfers and long-distance comfort.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <OurMission />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* About Page FAQs Section */}
        <AboutFAQSection />

        {/* Bottom CTA Banner */}
        <BannerCTA />
      </main>

      <Footer />
    </>
  )
}
