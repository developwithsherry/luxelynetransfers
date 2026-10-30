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
  title: "About Us | UK Registered Airport Transfer & Private Hire Company",
  description:
    "Learn about Luxelyne Transfers LTD (UK Company No. 16665396), a trusted London airport transfer & private hire taxi company serving Heathrow, Gatwick, Stansted, Luton, London City & Southend 24/7.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/about",
  },
  openGraph: {
    title: "About Luxelyne Transfers LTD | London Airport Transfers & Private Hire",
    description:
      "UK-registered private hire & airport transfer provider (Company No. 16665396) delivering fixed-fare comfort, real-time flight tracking, and DBS-vetted chauffeurs.",
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
                Who We Are • UK Company No. 16665396
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                Redefining London Airport Transfers & Private Hire
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
                UK-registered private hire & chauffeur provider delivering fixed-fare comfort, safety, and 24/7 reliability for all major London and UK airports.
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
                Our Core Safety & Quality Standards
              </h2>
              <p className="text-neutral-500 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
                We maintain strict UK compliance and passenger comfort standards to deliver a dependable, world-class ground travel experience.
              </p>
            </div>

            {/* Trust Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">UK Registered Company</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Registered in England & Wales (Company No. 16665396), operating strictly in accordance with UK council and DVLA safety regulations.
                </p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Vetted & DBS Checked</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Every driver undergoes enhanced background checks and passenger-care vetting to ensure safety and courtesy.
                </p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Live Flight Monitoring</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Real-time flight tracking automatically adjusts pickups for early landings or delayed arrivals with 45 mins free waiting time.
                </p>
              </div>

              <div className="p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm space-y-4">
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Premium Fleets Only</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Our fleets comprise late-model executive saloons, luxury business cars, and spacious 8-seater group MPVs.
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
