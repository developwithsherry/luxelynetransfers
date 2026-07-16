"use client"

import Image from "next/image"

export default function WhatsAppContactButton() {
  const number = "447882733291" // your WhatsApp number
  const waLink = `https://wa.me/${number}`

  return (
    <div className="fixed bottom-5 right-5 z-50 group flex items-center">
      {/* Tooltip prompt (visible on desktop hover, hidden on mobile to avoid layout overlap) */}
      <div className="relative mr-3 bg-card border border-border text-card-foreground text-sm font-semibold py-2 px-4 rounded-xl shadow-xl opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap hidden md:block">
        Click if you want any help
        {/* Tooltip Arrow */}
        <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-card border-r border-t border-border rotate-45" />
      </div>

      {/* Floating WhatsApp Action Link */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 rounded-full shadow-lg bg-white border border-border hover:scale-110 transition duration-300 flex items-center justify-center cursor-pointer"
        aria-label="Contact us on WhatsApp"
      >
        <Image
          src="/whatsapp.png"
          alt="WhatsApp Logo"
          width={48}
          height={48}
          className="w-10 h-10 object-contain"
        />
      </a>
    </div>
  )
}
