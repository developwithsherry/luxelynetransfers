"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function OurMission() {
  return (
    <section className="py-16 bg-neutral-50/50 text-neutral-900 border-t border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - text */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-3xl lg:text-4xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4"
          >
            Our Mission as a Private Hire Operator
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-base lg:text-lg text-neutral-600 font-light leading-relaxed space-y-4"
          >
            At Luxelyne Transfers LTD, our mission is to set the benchmark for licensed private hire operations in the UK—combining strict regulatory compliance with effortless comfort on every airport transfer and long-distance journey. Whether you are catching an early-morning flight from Heathrow or booking a direct long-run transfer from London to Birmingham, Manchester, Oxford, Cambridge, or Southampton Cruise Port, we make pre-booked travel dependable and stress-free.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-base lg:text-lg text-neutral-600 font-light leading-relaxed"
          >
            We believe long-distance and airport travel demands more than a standard taxi ride. Through proactive 24/7 dispatch management, real-time flight tracking, complimentary terminal meet-and-greet service, and late-model executive vehicles, we ensure every mile of your journey is smooth, punctual, and fixed in price from the moment you book.
          </motion.p>
        </div>

        {/* Right side - image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex justify-center lg:justify-end px-4"
        >
          <Image
            src="/cab1.jpg"
            alt="Luxelyne Transfers Executive Private Hire Vehicle in London"
            width={500}
            height={400}
            className="rounded-2xl shadow-xl object-cover max-h-[480px] aspect-[4/3] w-full"
          />
        </motion.div>
      </div>
    </section>
  )
}
