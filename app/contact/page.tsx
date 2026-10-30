import type { Metadata } from "next"
import { ContactSection } from "@/components/contact/form"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"

export const metadata: Metadata = {
  title: "Contact Us | 24/7 London Airport Taxi Bookings & WhatsApp Support",
  description:
    "Contact Luxelyne Transfers LTD (Company No. 16665396) for 24/7 London airport transfer bookings, private hire quotes, corporate accounts, and WhatsApp support (+44 7460 019129).",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/contact",
  },
  openGraph: {
    title: "Contact Luxelyne Transfers | 24/7 London Airport Taxi & Private Hire Support",
    description:
      "Get in touch with Luxelyne Transfers LTD 24/7 via phone, WhatsApp (+44 7460 019129), or email for London airport transfers and private hire bookings.",
    url: "https://luxelynetransfers.co.uk/contact",
    images: ["/og-image.png"],
  },
}

export default function ContactUsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "Contact Us", url: "https://luxelynetransfers.co.uk/contact" },
        ]}
      />
      <Header />
      <main>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
