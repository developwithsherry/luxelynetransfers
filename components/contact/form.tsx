"use client"

import { useForm } from "react-hook-form"
import { Phone, Mail, MapPin, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsappButton } from "../whatsapp-button"
import { InsertContactUs } from "@/app/contact/action"
import { toast } from "sonner"

type FormData = {
  name: string
  company?: string
  phone?: string
  email: string
  message: string
}

export function ContactSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await InsertContactUs({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
      })

      if (error) {
        throw new Error(`${error}`)
      }
      reset()
      toast.success("Thanks for contacting us, our team will get to you shortly!")
    } catch (error) {
      toast.error("Unable to send your message something went wrong")
    }
  }

  return (
    <section id="contact" className="py-24 bg-white text-neutral-900">
      <div className="pt-12 pb-12 container mx-auto px-4 text-center space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
          24/7 Dispatch & Support
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold">Contact Luxelyne Transfers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Need help with a London airport transfer, corporate account, or multi-stop private hire booking? Reach our 24/7 UK team via phone, WhatsApp, or email.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-12 pt-4">
        {/* Left side - Company info */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Luxelyne Transfers LTD provides fixed-fare airport transfers and executive private hire services across Heathrow, Gatwick, Stansted, Luton, London City, Southend, and all London boroughs.
          </p>

          <div className="space-y-5">
            <a
              href="tel:+447460019129"
              className="flex items-center gap-3 text-gray-700 hover:text-lime-600 underline transition-colors"
            >
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>+44 7460 019129 (24/7 Bookings & Dispatch)</span>
            </a>

            <WhatsappButton className="text-gray-700 underline hover:text-lime-600" />

            <a
              href="mailto:info@luxelynetransfers.co.uk"
              className="flex items-center gap-3 text-gray-700 hover:text-lime-600 underline transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-700 shrink-0" />
              <span>info@luxelynetransfers.co.uk</span>
            </a>

            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>58 Peregrine Rd, Ilford IG6 3SZ, United Kingdom</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <span>Luxelyne Transfers LTD • UK Company No. <strong>16665396</strong></span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <span>Operating Hours: 24 Hours / 7 Days a Week</span>
            </div>
          </div>
        </div>

        {/* Right side - Contact form */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                aria-label="Your Name"
                {...register("name")}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Company"
                aria-label="Company Name"
                {...register("company")}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  aria-label="Phone Number"
                  {...register("phone", {
                    pattern: {
                      value: /^[0-9+\- ]*$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email *"
                  aria-label="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <textarea
                rows={4}
                placeholder="Message *"
                aria-label="Your Message"
                {...register("message", { required: "Message is required" })}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-background rounded-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
