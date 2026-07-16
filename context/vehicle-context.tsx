"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Vehicle } from "@/types/vehicle"
import { getActiveVehicles } from "@/app/select-vehicle/action"
import { getReturnDiscount } from "@/lib/get-return-discount"
import { useBooking } from "./booking-context"
import { calculateVehicleFare as calculateFare } from "@/lib/calculate-fare"

type VehicleContextType = {
  vehicles: Vehicle[]
  addVehicle: (vehicle: Vehicle) => void
  fares: Map<string, number>
  loading: boolean
  error: string | null
  selectedVehicle: Vehicle | null
  selectVehicle: (vehicle: Vehicle) => void
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined)

export function VehicleProvider({ children }: { children: ReactNode }) {
  const { booking: bookingDetails } = useBooking()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [fares, setFares] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const addVehicle = (vehicle: Vehicle) => setVehicles((prev) => [...prev, vehicle])
  const selectVehicle = (vehicle: Vehicle) => setSelectedVehicle(vehicle)

  // 🚗 Fetch active vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const res = await getActiveVehicles()
        if (res.success && res.data) {
          setVehicles(res.data)
          setError(null)
        } else {
          setError(res.error ?? "Failed to fetch vehicles")
        }
      } catch (err: any) {
        console.error("Error fetching vehicles:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  // 💸 Calculate fares with discounts
  useEffect(() => {
    if (!bookingDetails?.total_distance || vehicles.length === 0) return

    const fetchAndApplyDiscounts = async () => {
      try {
        const { finalDiscount, returnDiscount, error } = await getReturnDiscount()

        if (error) {
          console.error("Error getting discounts:", error)
        }

        // Default to 0 if null
        const baseDiscount = finalDiscount ?? 0
        const extraDiscount = bookingDetails.with_return ? returnDiscount ?? 0 : 0

        // 🔹 Combine both discounts additively
        const totalDiscount = baseDiscount + extraDiscount

        const newFares = new Map<string, number>()

        vehicles.forEach((vehicle) => {
          const isRoundTrip = !!bookingDetails.with_return;
          const distanceForCalculation = isRoundTrip && bookingDetails.total_distance 
            ? (bookingDetails.total_distance / 2) 
            : (bookingDetails.total_distance || 0);

          let fare = calculateFare(vehicle, distanceForCalculation)

          if (isRoundTrip) {
            fare = fare * 2;
          }

          if (totalDiscount > 0) {
            fare = fare - fare * (totalDiscount / 100)
          }

          newFares.set(vehicle.id.toString(), fare)
        })

        setFares(newFares)
      } catch (err) {
        console.error("Error calculating fares:", err)
      }
    }

    fetchAndApplyDiscounts()
  }, [bookingDetails?.total_distance, bookingDetails?.with_return, vehicles])

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        fares,
        loading,
        error,
        selectedVehicle,
        selectVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicles() {
  const context = useContext(VehicleContext)
  if (context === undefined) {
    throw new Error("useVehicles must be used within a VehicleProvider")
  }
  return context
}
