"use server"

import { fareSpot, Vehicle } from "@/types/vehicle"
import { createClient } from "@/util/supabase/server"



export async function addVehicle(vehicle: Vehicle) {
    try {
        const { fareSpots, ...updatedVehicle } = vehicle
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("vehicle")
            .insert(updatedVehicle)
            .select("id")
            .single();

        if (error) {
            console.log("Error in adding the vehicle", error);
            throw new Error(error.message)
        }
        const updatedFareSpots = updateFareSpots(fareSpots, data.id);

        const { error: insertFareSpotsError } = await supabase
            .from("fareSpots")
            .insert(updatedFareSpots)

        if (insertFareSpotsError) {
            console.log("error in inserting fare spots", insertFareSpotsError);
            throw new Error(insertFareSpotsError.message)

        }
        return { success: true, message: "Vehicle added successfully" }

    }
    catch (error) {
        return { success: true, error }

    }
}

function updateFareSpots(fareSpots: fareSpot[], vehicleId: string) {
    return fareSpots.map((f) => ({ ...f, vehicleId: vehicleId }))
}