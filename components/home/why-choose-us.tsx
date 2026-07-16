"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, ShieldCheck, CreditCard, BadgeCheck } from "lucide-react"

export default function WhyChooseUs() {
  const leftFeatures = [
    {
      icon: Sparkles,
      title: "Luxury & Comfort",
      description: "Experience premium vehicles with plush interiors, climate control, and smooth rides—perfect for business or leisure."
    },
    {
      icon: ShieldCheck,
      title: "Professional Drivers",
      description: "Our courteous, DBS-checked drivers know the local routes inside out, ensuring safe and efficient journeys every time."
    }
  ]

  const rightFeatures = [
    {
      icon: CreditCard,
      title: "Easy Online Payment",
      description: "Pay securely via major debit/credit cards or digital wallets—fast, simple, and hassle-free."
    },
    {
      icon: BadgeCheck,
      title: "Fixed-Price Guarantee",
      description: "Enjoy transparent, fixed pricing with no hidden charges, surge prices, or unexpected fees."
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 relative overflow-hidden" id="why-choose-us">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-16 md:mb-20">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-accent mb-4 text-balance">
          Why Choose LuxeLyne?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Book your trip and travel in comfort.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Side Features */}
        <div className="lg:col-span-4 flex flex-col gap-12 md:gap-16">
          {leftFeatures.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:scale-110 group-hover:bg-accent group-hover:text-black transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Center Image and Call to Action */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative w-full max-w-[280px] md:max-w-[300px] aspect-[3/4] mb-8 group"
          >
            {/* Brand colored offset background */}
            <div className="absolute inset-0 bg-accent/20 rounded-2xl translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 border border-accent/30" />
            
            {/* Image Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-850 bg-neutral-900">
              <Image
                src="/p1.png"
                alt="Professional LuxeLyne Chauffeur Driver Welcoming Passenger"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </motion.div>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4"
          >
            <a
              href="/#book-now"
              className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl shadow-lg shadow-accent/15 hover:bg-accent/90 hover:shadow-accent/30 active:scale-95 transition-all duration-200 text-xs tracking-widest uppercase"
            >
              Get a FREE quote
            </a>
          </motion.div>
        </div>

        {/* Right Side Features */}
        <div className="lg:col-span-4 flex flex-col gap-12 md:gap-16">
          {rightFeatures.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:scale-110 group-hover:bg-accent group-hover:text-black transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
