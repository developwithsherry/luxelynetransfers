import type { Metadata } from "next"
import Header from "@/components/header"
import { FleetSection } from "@/components/home/fleets-section"
import WhyChooseUs from "@/components/home/why-choose-us"
import { ServicesSection } from "@/components/home/services"
import { Footer } from "@/components/home/footer"
import { ReviewsSection } from "@/components/home/reviews-section"
import { HomeFAQSection } from "@/components/home/faq-section"
import { HomeArticlesSection } from "@/components/home/articles-section"
import SimpleBookingForm from "@/components/booking-form"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Luxelyne Transfers | London Airport Transfers & 24/7 Private Hire Taxi",
  description:
    "Book fixed-fare London airport transfers & private hire taxis online. Reliable 24/7 chauffeur & minicab service for Heathrow, Gatwick, Stansted, Luton, London City & Southend airports.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk",
  },
  openGraph: {
    title: "Luxelyne Transfers | London Airport Transfers & 24/7 Private Hire Taxi",
    description:
      "Book fixed-fare London airport transfers & private hire taxis online. Reliable 24/7 chauffeur & minicab service for Heathrow, Gatwick, Stansted, Luton, London City & Southend.",
    url: "https://luxelynetransfers.co.uk",
    images: ["/og-image.png"],
  },
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <SimpleBookingForm />
        <div className="py-12"></div>
        <FleetSection />
        <ServicesSection />
        <WhyChooseUs />
        <ReviewsSection />
        <HomeFAQSection />
        <HomeArticlesSection />
      </main>
      <WhatsAppContactButton />
      <Footer />
    </>
  )
}
