"use client"

import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { motion } from "framer-motion"

export default function TermsPage() {
  return (
    <>
    <Header/>
    <section className="relative bg-gradient-to-r  py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        
        {/* Page Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-2xl lg:text-4xl font-bold text-center mb-12"
        >
          Terms & Conditions
        </motion.h1>

        {/* Simple Terms */}
        <div className="bg-white text-gray-800 rounded-2xl shadow p-8 mb-12">
          <h2 className="text-xl lg:text-2xl font-semibold mb-4">Simple Terms</h2>
          <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
            <li>
              If you're using a non-UK phone number, keep it on roaming so the driver can contact you.
            </li>
            <li>
              For changes or cancellations, contact us via the website form, email{" "}
              <span className="font-medium text-green-700">info@luxelynetransfers.co.uk</span>, or WhatsApp{" "}
              <span className="font-medium text-green-700">+44 7640 019129</span>. Keep your Luxelyne reference number handy.
            </li>
            <li>
              All changes and cancellations are free if requested at least 3 hours before your pickup time. You'll get a full refund.
            </li>
            <li>
              Let us know your requirements, and we'll do our best to accommodate them.
            </li>
            <li>
              We hope you enjoy your journey with Luxelyne Transfers Ltd!
            </li>
          </ul>
        </div>

        {/* Detailed Terms */}
        <div className="bg-white text-gray-800 rounded-2xl shadow p-8 space-y-8">
          <h2 className="text-xl lg:text-2xl font-semibold mb-6">
            LUXELYNE TRANSFER – Terms & Conditions
          </h2>

          {/* Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-2">1. Definitions</h3>
            <p className="leading-relaxed text-sm">
              1.1. Booking – A confirmed reservation made with LUXELYNE TRANSFER for transport services. <br />
              1.2. Passenger – Any individual using the booked service. <br />
              1.3. Fare – The agreed price for the journey. <br />
              1.4. Pick-Up Point – The agreed location where the passenger will be collected. <br />
              1.5. Journey Date & Time – The agreed time and date of travel. <br />
              1.6. You / Customer – The person making the booking. <br />
              1.7. We / Us / LUXELYNE TRANSFER – The company providing the transfer service.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">2. General</h3>
            <p className="leading-relaxed text-sm">
              2.1. By making a booking, you accept these Terms & Conditions. <br />
              2.2. LUXELYNE TRANSFER acts as the transport provider and is responsible for fulfilling the booking. <br />
              2.3. Customers must provide correct journey details when booking. Incorrect information may lead to delays, extra charges, or cancellation without refund. <br />
              2.4. LUXELYNE TRANSFER operates as a supplier and works only with fully licensed and approved operators to ensure compliance with legal and safety standards.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">3. Bookings & Payments</h3>
            <p className="leading-relaxed text-sm">
              3.1. All bookings must be confirmed via our website, phone, or email. <br />
              3.2. Full payment or deposit (if offered) must be made at the time of booking. <br />
              3.3. The fare does not include extras such as child seats, additional waiting time, or parking charges, unless agreed in advance. <br />
              3.4. Drivers reserve the right to refuse service to passengers who behave in a disruptive, unsafe, or unlawful manner.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">4. Cancellations & Refunds</h3>
            <p className="leading-relaxed text-sm">
              4.1. If you cancel 3 days (72+ hours) before your journey, you will receive a full refund. <br />
              4.2. If you cancel 24–48 hours before, you will receive a 50% refund. <br />
              4.3. If you cancel within 24 hours of the journey (including same day), no refund will be issued. <br />
              4.4. In the event of a no-show (not present at pick-up), no refund will be issued. <br />
              4.5. Refunds (if applicable) will be processed within 5 working days to the original payment method.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">5. Liability</h3>
            <p className="leading-relaxed text-sm">
              5.1. LUXELYNE TRANSFER will not be liable for delays caused by traffic, weather, or circumstances beyond our control. <br />
              5.2. Customers are responsible for allowing sufficient time to reach their destination (e.g. airport check-in). <br />
              5.3. We are not responsible for loss or damage to personal belongings carried during the journey.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">6. Customer Responsibilities</h3>
            <p className="leading-relaxed text-sm">
              6.1. Passengers must ensure they are ready at the agreed pick-up time. <br />
              6.2. Any additional waiting time or route changes may incur extra charges. <br />
              6.3. Passengers must not consume alcohol, drugs, or act in a disorderly manner during the journey.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">7. Governing Law</h3>
            <p className="leading-relaxed text-sm">
              These Terms & Conditions are governed by UK law. Any disputes will be subject to the exclusive jurisdiction of UK courts.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  )
}
