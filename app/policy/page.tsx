"use client"

import Header from "@/components/header"
import { motion } from "framer-motion"
import { Footer } from "@/components/home/footer"

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </motion.h1>

        {/* Policy Content */}
        <div className="bg-white text-gray-800 rounded-2xl shadow p-8 space-y-8">
          
          <div>
            <h2 className="text-lg font-semibold mb-2">1. Overview</h2>
            <p className="leading-relaxed text-sm">
              We are committed to protecting your privacy. This policy explains how we handle your personal
              information. By using our website, you agree to our use of cookies as described in this policy.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1">
              <li>Your computer details (IP address, location, browser type, etc.).</li>
              <li>Information about transactions you make on our website.</li>
              <li>Details you provide when registering or subscribing to our services.</li>
              <li>Any other information you choose to share with us.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">3. Cookies</h2>
            <p className="leading-relaxed text-sm">
              Cookies help us enhance your browsing experience. We use session cookies (temporary) and persistent
              cookies (stored longer). Google Analytics may also collect data to generate reports. You can manage
              cookies in your browser settings, but blocking them may affect website functionality.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">4. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1">
              <li>Manage and improve our website and services.</li>
              <li>Process orders and transactions.</li>
              <li>Send invoices and payment requests.</li>
              <li>Respond to inquiries and complaints.</li>
              <li>Send newsletters and promotional content (if opted in).</li>
              <li>Provide statistics (without identifying individuals).</li>
              <li>Ensure security and prevent fraud.</li>
            </ul>
            <p className="leading-relaxed text-sm mt-2">
              We do not share your data with third parties for direct marketing without your consent. Payments are
              processed securely via Streamline, PayPal, Revolut, GoCardless, and American Express.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">5. Data Sharing</h2>
            <p className="leading-relaxed text-sm">
              We may share your information with employees, service providers, or subcontractors when necessary.
              Additionally, we may disclose information:
            </p>
            <ul className="list-disc pl-6 text-sm leading-relaxed space-y-1 mt-2">
              <li>If required by law or legal proceedings.</li>
              <li>To protect our legal rights.</li>
              <li>In case of business sale or transfer.</li>
            </ul>
            <p className="leading-relaxed text-sm mt-2">
              We will not sell or misuse your personal data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">6. International Data Transfers</h2>
            <p className="leading-relaxed text-sm">
              Your data may be stored and processed in different countries. While we take security measures, online
              data sharing always carries some risks.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">7. Data Security</h2>
            <p className="leading-relaxed text-sm">
              We use secure servers, firewalls, and SSL encryption to protect your data. However, online data
              transmission is not completely risk-free. Keep your login details secure, and never share your
              password.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">8. Policy Updates</h2>
            <p className="leading-relaxed text-sm">
              We may update this privacy policy from time to time. Please check this page regularly for any changes.
              We may also notify you via email.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">9. Your Rights</h2>
            <p className="leading-relaxed text-sm">
              You can request a copy of the personal data we hold about you by providing proof of identity and a
              processing fee (£10). You can also opt out of marketing communications at any time.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">10. Third-Party Websites</h2>
            <p className="leading-relaxed text-sm">
              We are not responsible for the privacy policies of external websites linked on our platform.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">11. Updating Your Information</h2>
            <p className="leading-relaxed text-sm">
              If your personal details change, please contact us to update your information.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  )
}
