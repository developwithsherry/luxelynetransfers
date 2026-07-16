"use server"

import { createClient } from "@/util/supabase/server"
import type { Vehicle } from "@/types/vehicle"

// Fetch all active vehicles with their fare spots for the selection page
export async function getActiveVehicles(): Promise<{
  success: boolean
  data?: Vehicle[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    // Get all active vehicles
    const { data: vehicles, error: vehiclesError } = await supabase.from("vehicle").select("*").order("created_at",{ascending:true})

    if (vehiclesError) {
      console.error("Error fetching vehicles:", vehiclesError)
      throw new Error(vehiclesError.message)
    }

    // Get all fare spots
    const { data: fareSpots, error: fareSpotsError } = await supabase.from("fareSpots").select("*")

    if (fareSpotsError) {
      console.error("Error fetching fare spots:", fareSpotsError)
      throw new Error(fareSpotsError.message)
    }

    // Combine vehicles with their fare spots
    const vehiclesWithFareSpots = vehicles.map((vehicle) => {
      const vehicleFareSpots = fareSpots.filter((spot) => spot.vehicleId === vehicle.id)
      return {
        ...vehicle,
        fareSpots: vehicleFareSpots,
      }
    })
      console.log("vehicle",vehicles)
    return { success: true, data: vehiclesWithFareSpots }
  } catch (error: any) {
    console.error("Error in getActiveVehicles:", error)
    return { success: false, error: error.message }
  }
}
