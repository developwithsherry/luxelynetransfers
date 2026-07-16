"use server"

import type { VehicleFormValues } from "@/schema/vehicle/schema"
import { createClient } from "@/util/supabase/server"

// Fetch all vehicles with their fare spots
export async function getVehicles() {
  try {
    const supabase = await createClient()

    // Get all vehicles
    const { data: vehicles, error: vehiclesError } = await supabase.from("vehicle").select("*").order("name")

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

    return { success: true, data: vehiclesWithFareSpots }
  } catch (error: any) {
    console.error("Error in getVehicles:", error)
    return { success: false, error: error.message }
  }
}

// Fetch a single vehicle by ID
export async function getVehicleById(id: string) {
  try {
    const supabase = await createClient()

    // Get the vehicle
    const { data: vehicle, error: vehicleError } = await supabase.from("vehicle").select("*").eq("id", id).single()

    if (vehicleError) {
      console.error("Error fetching vehicle:", vehicleError)
      throw new Error(vehicleError.message)
    }

    // Get the fare spots for this vehicle
    const { data: fareSpots, error: fareSpotsError } = await supabase.from("fareSpots").select("*").eq("vehicleId", id)

    if (fareSpotsError) {
      console.error("Error fetching fare spots:", fareSpotsError)
      throw new Error(fareSpotsError.message)
    }

    // Combine vehicle with its fare spots
    const vehicleWithFareSpots = {
      ...vehicle,
      fareSpots: fareSpots || [],
    }

    return { success: true, data: vehicleWithFareSpots }
  } catch (error: any) {
    console.error("Error in getVehicleById:", error)
    return { success: false, error: error.message }
  }
}

export async function addVehicle(vehicle: VehicleFormValues) {
  try {
    const { fareSpots, ...vehicleData } = vehicle
    const supabase = await createClient()

    // Insert the vehicle
    const { data, error } = await supabase.from("vehicle").insert(vehicleData).select("id").single()

    if (error) {
      console.error("Error adding vehicle:", error)
      throw new Error(error.message)
    }

    // Update fareSpots with the vehicle ID
    const updatedFareSpots = fareSpots.map((spot) => ({
      ...spot,
      vehicleId: data.id,
    }))

    // Insert fareSpots
    const { error: insertFareSpotsError } = await supabase.from("fareSpots").insert(updatedFareSpots)

    if (insertFareSpotsError) {
      console.error("Error inserting fare spots:", insertFareSpotsError)
      throw new Error(insertFareSpotsError.message)
    }

    return { success: true, message: "Vehicle added successfully", id: data.id }
  } catch (error: any) {
    console.error("Error in addVehicle:", error)
    return { success: false, error: error.message }
  }
}

// Update an existing vehicle
export async function updateVehicle(id: string, vehicle: VehicleFormValues) {
  try {
    const { fareSpots, ...vehicleData } = vehicle
    const supabase = await createClient()

    // Update the vehicle
    const { error: vehicleError } = await supabase.from("vehicle").update(vehicleData).eq("id", id)

    if (vehicleError) {
      console.error("Error updating vehicle:", vehicleError)
      throw new Error(vehicleError.message)
    }

    // Get existing fare spots to determine which to update, delete, or add
    const { data: existingFareSpots, error: fetchError } = await supabase
      .from("fareSpots")
      .select("*")
      .eq("vehicleId", id)

    if (fetchError) {
      console.error("Error fetching existing fare spots:", fetchError)
      throw new Error(fetchError.message)
    }

    // Identify spots to update, delete, and add
    const existingIds = existingFareSpots.map((spot) => spot.id)
    const newIds = fareSpots.map((spot) => spot.id)

    const spotsToUpdate = fareSpots.filter((spot) => existingIds.includes(spot.id))
    const spotsToDelete = existingFareSpots.filter((spot) => !newIds.includes(spot.id))
    const spotsToAdd = fareSpots
      .filter((spot) => !existingIds.includes(spot.id))
      .map((spot) => ({ ...spot, vehicleId: id }))

    // Delete spots that are no longer present
    if (spotsToDelete.length > 0) {
      const idsToDelete = spotsToDelete.map((spot) => spot.id)
      const { error: deleteError } = await supabase.from("fareSpots").delete().in("id", idsToDelete)

      if (deleteError) {
        console.error("Error deleting fare spots:", deleteError)
        throw new Error(deleteError.message)
      }
    }

    // Update existing spots
    for (const spot of spotsToUpdate) {
      const { error: updateError } = await supabase
        .from("fareSpots")
        .update({ ...spot, vehicleId: id })
        .eq("id", spot.id)

      if (updateError) {
        console.error(`Error updating fare spot ${spot.id}:`, updateError)
        throw new Error(updateError.message)
      }
    }

    // Add new spots
    if (spotsToAdd.length > 0) {
      const { error: addError } = await supabase.from("fareSpots").insert(spotsToAdd)

      if (addError) {
        console.error("Error adding new fare spots:", addError)
        throw new Error(addError.message)
      }
    }

    return { success: true, message: "Vehicle updated successfully" }
  } catch (error: any) {
    console.error("Error in updateVehicle:", error)
    return { success: false, error: error.message }
  }
}

// Delete a vehicle and its fare spots
export async function deleteVehicle(id: string) {
  try {
    const supabase = await createClient()

    // First delete all fare spots for this vehicle
    const { error: fareSpotsError } = await supabase.from("fareSpots").delete().eq("vehicleId", id)

    if (fareSpotsError) {
      console.error("Error deleting fare spots:", fareSpotsError)
      throw new Error(fareSpotsError.message)
    }

    // Then delete the vehicle
    const { error: vehicleError } = await supabase.from("vehicle").delete().eq("id", id)

    if (vehicleError) {
      console.error("Error deleting vehicle:", vehicleError)
      throw new Error(vehicleError.message)
    }

    return { success: true, message: "Vehicle deleted successfully" }
  } catch (error: any) {
    console.error("Error in deleteVehicle:", error)
    return { success: false, error: error.message }
  }
}
