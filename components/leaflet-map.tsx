"use client"

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"

interface GoogleMapProps {
  pickup?: string
  dropoff?: string
  className?: string
}

const GoogleMapComponent = ({ pickup, dropoff, className }: GoogleMapProps) => {
  return (
    <div
      className={`relative lg:h-[500px] h-[600px] w-full overflow-hidden rounded-xl ${className}`}
    >
      {/* Map image */}
      <img
        src="/map.png"
        alt="Map"
        className="h-full w-full object-cover"
      />

      {/* White mask at the top */}
      <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-white/60 via-gray-200/20 to-transparent pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('/noise1.jpg')] opacity-20 mix-blend-overlay pointer-events-none" />
    </div>
  )
}

export default GoogleMapComponent
