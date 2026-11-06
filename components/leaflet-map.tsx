import Image from "next/image"

interface GoogleMapProps {
  pickup?: string
  dropoff?: string
  className?: string
}

const GoogleMapComponent = ({ className }: GoogleMapProps) => {
  return (
    <div
      className={`relative lg:h-[500px] h-[600px] w-full overflow-hidden rounded-xl ${className || ""}`}
    >
      {/* Optimized Hero Map Image (LCP Element) */}
      <Image
        src="/map.png"
        alt="London Airport Transfers & Private Hire Coverage Map"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={70}
        className="object-cover"
      />

      {/* White mask at the top */}
      <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-white/60 via-gray-200/20 to-transparent pointer-events-none z-10" />
    </div>
  )
}

export default GoogleMapComponent
