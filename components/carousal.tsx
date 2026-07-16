"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function ImageSection() {
  const images = [
    { src: "/contract.jpg", alt: "Luxelyne Transfers - Executive Private Hire Chauffeur Booking Agreement" },
    { src: "/cab1.jpg", alt: "Luxelyne Transfers - Premium London Airport Taxi Cab Service" },
    { src: "/ride.jpg", alt: "Luxelyne Transfers - Safe Passenger Journey Airport Transfer" },
  ]

  return (
    <div
      className="
        flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8
        overflow-x-auto sm:overflow-visible
        space-x-4 sm:space-x-0
        scrollbar-hide
        py-4
        pl-6 sm:pl-0
        snap-x snap-mandatory
      "
    >
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          className="
            rounded-2xl overflow-hidden min-w-[80%] sm:min-w-0 
            flex-shrink-0 shadow-lg 
            snap-center
          "
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={400}
            height={500}
            className="object-cover w-full h-[500px]"
          />
        </motion.div>
      ))}
    </div>
  )
}
