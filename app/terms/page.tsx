import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"

export const metadata: Metadata = {
  title: "Terms & Conditions | Luxelyne Transfers LTD",
  description:
    "Read the booking Terms & Conditions for Luxelyne Transfers LTD (UK Company No. 16665396), covering fixed fares, 45-minute free airport waiting time, flight tracking, and cancellations.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/terms",
  },
}

export default function TermsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "Terms & Conditions", url: "https://luxelynetransfers.co.uk/terms" },
        ]}
      />
      <Header />
      <main>
        <section className="relative bg-gradient-to-r py-24 lg:py-32">
          <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <h1 className="text-2xl lg:text-4xl font-bold text-center mb-12">
              Terms & Conditions
            </h1>

            {/* Key Booking Highlights */}
            <div className="bg-white text-gray-800 rounded-2xl shadow p-8 mb-12">
              <h2 className="text-xl lg:text-2xl font-semibold mb-4">Key Booking Highlights</h2>
              <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
                <li>
                  <strong>Airport Pickups & Waiting Time:</strong> All airport arrivals include live flight tracking and <strong>45 minutes of complimentary waiting time</strong> from the moment your flight lands, plus Meet & Greet inside the terminal arrivals hall.
                </li>
                <li>
                  <strong>Mobile Contact:</strong> If you are traveling with a non-UK phone number, please keep roaming or WhatsApp active upon landing so your driver can coordinate with you smoothly.
                </li>
                <li>
                  <strong>Changes & Cancellations:</strong> Contact us via email at{" "}
                  <span className="font-medium text-green-700">info@luxelynetransfers.co.uk</span> or WhatsApp{" "}
                  <span className="font-medium text-green-700">+44 7460 019129</span> with your booking reference number.
                </li>
                <li>
                  <strong>Company Details:</strong> Services are provided by <strong>Luxelyne Transfers LTD</strong>, Registered in England & Wales (Company No. <strong>16665396</strong>), Registered Office: 58 Peregrine Rd, Ilford, IG6 3SZ, UK.
                </li>
              </ul>
            </div>

            {/* Detailed Terms */}
            <div className="bg-white text-gray-800 rounded-2xl shadow p-8 space-y-8">
              <h2 className="text-xl lg:text-2xl font-semibold mb-6">
                LUXELYNE TRANSFERS LTD – Terms & Conditions
              </h2>

              <div>
                <h3 className="text-lg font-semibold mb-2">1. Definitions</h3>
                <p className="leading-relaxed text-sm">
                  1.1. Booking – A confirmed reservation made with Luxelyne Transfers LTD for private hire or airport transfer services. <br />
                  1.2. Passenger – Any individual traveling under the booked service. <br />
                  1.3. Fare – The fixed price agreed at the time of booking for the specified route and vehicle class. <br />
                  1.4. Pick-Up Point – The agreed address or airport terminal arrivals hall where the passenger will be collected. <br />
                  1.5. Journey Date & Time – The agreed date and time of travel (adjusted automatically for tracked flight arrivals). <br />
                  1.6. You / Customer – The person or corporate entity making the booking. <br />
                  1.7. We / Us / Luxelyne Transfers LTD – Luxelyne Transfers LTD (UK Company No. 16665396).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. General</h3>
                <p className="leading-relaxed text-sm">
                  2.1. By making a booking on our website, phone, or WhatsApp, you accept these Terms & Conditions. <br />
                  2.2. Luxelyne Transfers LTD acts as the transport supplier and is responsible for fulfilling your booking. <br />
                  2.3. Customers must provide accurate pickup/drop-off postcodes, passenger counts, luggage counts, and flight numbers when booking. <br />
                  2.4. Luxelyne Transfers LTD operates as a UK-registered private hire and airport transfer supplier (Company No. 16665396) and works only with fully licensed, DBS-vetted drivers and approved operators to ensure full compliance with UK legal and safety standards.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Bookings, Fares & Waiting Time</h3>
                <p className="leading-relaxed text-sm">
                  3.1. All bookings must be confirmed via our website, telephone, WhatsApp, or email. <br />
                  3.2. Payment is made securely online at the time of booking via Stripe, PayPal, or major debit/credit cards. <br />
                  3.3. Airport transfer quotes include standard terminal meet & greet, live flight tracking, and 45 minutes of complimentary waiting time after the aircraft lands. Additional waiting time beyond the 45-minute grace period or unscheduled route detours requested during the trip may incur additional charges. <br />
                  3.4. Drivers reserve the right to refuse travel to passengers who behave in an unsafe, abusive, or unlawful manner.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. Cancellations & Refunds</h3>
                <p className="leading-relaxed text-sm">
                  4.1. Cancellations or amendments requested at least 24 hours before the scheduled pickup time are eligible for a full refund. <br />
                  4.2. Cancellations requested between 12 and 24 hours before pickup are eligible for a 50% refund. <br />
                  4.3. Cancellations made after a driver has already been dispatched or within 3 hours of pickup, as well as passenger no-shows at the pickup location, are non-refundable. <br />
                  4.4. Approved refunds are processed within 5 working days to the original payment method.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. Liability</h3>
                <p className="leading-relaxed text-sm">
                  5.1. While we take every measure to ensure punctual arrival, Luxelyne Transfers LTD will not be liable for severe delays caused by road closures, extreme weather, or circumstances beyond reasonable control. <br />
                  5.2. Customers departing for an airport are responsible for scheduling their pickup with sufficient time for airport check-in and security screening. <br />
                  5.3. Personal belongings are carried at the passenger&apos;s own risk, though we will make every effort to return any lost property left in a vehicle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6. Customer Responsibilities</h3>
                <p className="leading-relaxed text-sm">
                  6.1. Passengers must ensure they are ready at the agreed pickup time and that their mobile phone is reachable. <br />
                  6.2. Passengers must select a vehicle class capable of accommodating their total number of passengers and suitcases. <br />
                  6.3. Smoking, vaping, or consuming illegal substances inside any vehicle is strictly prohibited.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">7. Governing Law</h3>
                <p className="leading-relaxed text-sm">
                  These Terms & Conditions are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
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
