import type { Metadata } from "next"
import { ContactSection } from "@/components/contact/form"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Luxelyne Transfers. Contact us for London airport taxi bookings, corporate private hire services, and 24/7 customer support.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/contact",
  },
}

export default function ContactUsPage() {
  return (
    <>
      <Header />
      <ContactSection />
      <Footer />
    </>
  )
}