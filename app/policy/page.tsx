import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"

export const metadata: Metadata = {
  title: "Privacy Policy | Luxelyne Transfers LTD",
  description:
    "Read the Privacy Policy of Luxelyne Transfers LTD (UK Company No. 16665396). Learn how we protect your personal data, booking details, and online payments.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/policy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "Privacy Policy", url: "https://luxelynetransfers.co.uk/policy" },
        ]}
      />
      <Header />
      <main>
        <section className="relative bg-gradient-to-r py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <h1 className="text-2xl lg:text-4xl font-bold text-center mb-12">
              Privacy Policy
            </h1>

            <div className="bg-white text-gray-800 rounded-2xl shadow p-8 space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">1. Overview</h2>
                <p className="leading-relaxed text-sm">
                  Luxelyne Transfers LTD (Registered in England & Wales, Company No. 16665396, Registered Office: 58 Peregrine Rd, Ilford IG6 3SZ, UK) is committed to protecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy explains how we handle your personal information when you book a London airport transfer or private hire journey on our website.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
                <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1">
                  <li>Your device and browser details (IP address, browser type, and analytics data).</li>
                  <li>Journey and booking details (pickup/drop-off addresses, flight numbers, travel dates, passenger count, and luggage requirements).</li>
                  <li>Contact details you provide when booking or inquiring (name, email address, and telephone/WhatsApp number).</li>
                  <li>Transaction confirmation references from our secure payment processors (we do not store full payment card numbers on our servers).</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">3. Cookies</h2>
                <p className="leading-relaxed text-sm">
                  Cookies help us enhance your browsing and booking experience. We use session cookies (temporary) and persistent cookies. Google Tag Manager and Google Analytics may also collect anonymized usage data to help us improve our website performance. You can manage cookies in your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">4. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1">
                  <li>Fulfill your airport transfer or private hire booking and coordinate driver dispatch.</li>
                  <li>Monitor incoming flight numbers in real time to adjust pickup times for delays or early arrivals.</li>
                  <li>Process payments, send booking confirmations, receipts, and invoices.</li>
                  <li>Respond to customer support inquiries via phone, WhatsApp, or email.</li>
                  <li>Ensure passenger safety, regulatory compliance, and fraud prevention.</li>
                </ul>
                <p className="leading-relaxed text-sm mt-2">
                  We do not sell or share your data with third parties for direct marketing without your explicit consent. Online payments are processed securely via Stripe and PayPal.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">5. Data Sharing</h2>
                <p className="leading-relaxed text-sm">
                  We share necessary journey details (passenger name, contact number, pickup/drop-off location, and flight number) only with your assigned licensed driver or approved operator to fulfill your transfer. Additionally, we may disclose information:
                </p>
                <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1 mt-2">
                  <li>If required by UK law, local licensing authorities, or legal proceedings.</li>
                  <li>To establish, exercise, or defend our legal rights.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">6. Data Security</h2>
                <p className="leading-relaxed text-sm">
                  We use secure cloud infrastructure, firewalls, and HTTPS/SSL encryption to protect your personal data.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">7. Your UK GDPR Rights</h2>
                <p className="leading-relaxed text-sm">
                  Under UK data protection law, you have the right to request access to, correction of, or deletion of the personal data we hold about you. To exercise your rights, please contact us at <strong>info@luxelynetransfers.co.uk</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
