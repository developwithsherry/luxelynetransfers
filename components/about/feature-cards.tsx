"use client"

import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function FeatureCards() {
  const features = [
    "UK Registered (Co. No. 16665396)",
    "DBS-Checked Professional Drivers",
    "Real-Time Flight Tracking",
    "Fixed-Price Guarantee (No Surges)",
  ]

  return (
    <section className="py-5">
      <div className="mx-auto px-2 lg:px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 bg-neutral-50/50 border border-neutral-100 rounded-2xl">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center justify-center text-center px-6 py-8"
          >
            <CheckCircle className="text-lime-650 w-8 h-8 mb-3" />
            <p className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">{feature}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
