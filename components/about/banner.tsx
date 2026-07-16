"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function BannerCTA() {
  return (
    <section className="relative bg-gradient-to-r from-lime-400 to-lime-500 text-black py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-extrabold mb-6 leading-snug text-black"
        >
          Safe & Reliable UK Airport Transfers
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl text-lg lg:text-xl mb-8 font-light text-neutral-850"
        >
          Whether traveling from Heathrow, Gatwick, Stansted, Luton, or London City—
          <span className="font-semibold text-black">Luxelyne Transfers</span> is your trusted partner for comfortable, direct private hire journeys across London and beyond.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            onClick={() => (window.location.href = "/#book-now")}
            className="bg-black hover:bg-neutral-900 text-white hover:text-white px-8 py-6 text-lg font-semibold shadow-lg rounded-xl transition-all"
          >
            Get an Instant Quote
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
