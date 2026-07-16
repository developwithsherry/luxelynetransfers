"use client"
import type { Vehicle } from "@/types/vehicle"
import Image from "next/image"
import { Car, Users, Luggage, FileText, Hash } from "lucide-react"

interface Props {
  vehicle: Vehicle
}

export function BookingVehicleTable({ vehicle }: Props) {
  return (
    <div className="bg-white border border-lime-200 rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-lime-50 px-8 py-6 border-b border-lime-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-lime-500 rounded-xl">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black">Vehicle Information</h3>
            <p className="text-lime-700 font-medium">Details about the assigned vehicle</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid gap-6">
          {/* Vehicle Image and Name */}
          <div className="flex items-center gap-6 p-6 bg-black rounded-xl">
            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-lime-500">
              <Image
                src={vehicle.imageUrl || "/placeholder.svg"}
                alt={vehicle.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-white text-2xl">{vehicle.name}</p>
              <p className="text-lime-400 font-semibold text-lg capitalize">{vehicle.type}</p>
            </div>
          </div>

          {/* Vehicle Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 border border-lime-200 rounded-xl">
              <div className="p-2 bg-lime-500 rounded-lg">
                <Hash className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Vehicle ID</p>
                <p className="text-black font-semibold text-lg">{vehicle.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 border border-lime-200 rounded-xl">
              <div className="p-2 bg-lime-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Seating Capacity</p>
                <p className="text-black font-semibold text-lg">{vehicle.sittingCapacity} passengers</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 border border-lime-200 rounded-xl">
              <div className="p-2 bg-lime-700 rounded-lg">
                <Luggage className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Luggage Capacity</p>
                <p className="text-black font-semibold text-lg">{vehicle.laguageCapacity}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-start gap-4 p-6 border border-lime-200 rounded-xl">
                <div className="p-2 bg-lime-800 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-lime-700 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-black font-medium text-lg leading-relaxed">{vehicle.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
