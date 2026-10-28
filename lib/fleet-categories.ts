import type { Vehicle } from "@/types/vehicle"

export interface FleetCategory {
  id: string
  name: string
  label: string
  passengers: number
  luggage: number
  handLuggage: number
  description: string
  imageUrl: string
}

export const HARDCODED_FLEET_CATEGORIES: FleetCategory[] = [
  {
    id: "Saloon",
    name: "Saloon",
    label: "Saloon",
    passengers: 4,
    luggage: 2,
    handLuggage: 2,
    description: "Toyota Prius, Kia EV3, VW Passat or similar standard saloon",
    imageUrl: "https://bfzshwwcifmfxvaxdedm.supabase.co/storage/v1/object/public/images/vehicles/gcli2cj4n7o_1758025187160.png",
  },
  {
    id: "Estate",
    name: "Estate",
    label: "Estate",
    passengers: 4,
    luggage: 4,
    handLuggage: 2,
    description: "Skoda Superb Estate, VW Passat Estate or similar estate car with large boot",
    imageUrl: "https://bfzshwwcifmfxvaxdedm.supabase.co/storage/v1/object/public/images/vehicles/gcli2cj4n7o_1758025187160.png",
  },
  {
    id: "MPV",
    name: "MPV",
    label: "MPV",
    passengers: 6,
    luggage: 4,
    handLuggage: 3,
    description: "VW Sharan, Ford Galaxy or similar People Carrier",
    imageUrl: "https://bfzshwwcifmfxvaxdedm.supabase.co/storage/v1/object/public/images/vehicles/rx9vfviqu3_1758025261532.png",
  },
  {
    id: "Minibus",
    name: "Minibus",
    label: "Minibus",
    passengers: 8,
    luggage: 8,
    handLuggage: 4,
    description: "Hyundai i800, VW Transporter or similar 8-seater minibus",
    imageUrl: "https://bfzshwwcifmfxvaxdedm.supabase.co/storage/v1/object/public/images/vehicles/rl06byqponh_1758025417462.png",
  },
  {
    id: "Executive Saloon",
    name: "Executive Saloon",
    label: "Executive Saloon",
    passengers: 3,
    luggage: 2,
    handLuggage: 2,
    description: "Mercedes-Benz E-Class, BMW 5 Series, Audi A6 or similar executive saloon",
    imageUrl: "https://bfzshwwcifmfxvaxdedm.supabase.co/storage/v1/object/public/images/vehicles/b5nmtmamqmr_1758026350126.png",
  },
  {
    id: "Executive Minibus",
    name: "Executive Minibus",
    label: "Executive Minibus",
    passengers: 7,
    luggage: 6,
    handLuggage: 4,
    description: "Mercedes-Benz V-Class, Mercedes-Benz Vito or similar luxury people carrier",
    imageUrl: "https://bfzshwwcifmfxvaxdedm.supabase.co/storage/v1/object/public/images/vehicles/96mc1qu73g7_1758026428048.png",
  },
]

export function getHardcodedVehicle(categoryName?: string | null): Vehicle | null {
  if (!categoryName) return null
  const cat = HARDCODED_FLEET_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  )
  if (!cat) {
    return {
      id: categoryName,
      name: categoryName,
      type: categoryName,
      description: `${categoryName} vehicle`,
      sittingCapacity: 4,
      laguageCapacity: "2",
      hand_laguage: "2",
      imageUrl: "/placeholder.svg",
      minFare: 0,
      fareSpots: [],
    }
  }
  return {
    id: cat.id,
    name: cat.name,
    type: cat.name,
    description: cat.description,
    sittingCapacity: cat.passengers,
    laguageCapacity: String(cat.luggage),
    hand_laguage: String(cat.handLuggage),
    imageUrl: cat.imageUrl || "/placeholder.svg",
    minFare: 0,
    fareSpots: [],
  }
}
