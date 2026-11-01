"use server"

import { createClient } from "@/util/supabase/server"
import { revalidatePath } from "next/cache"
import {
  DRIVER_VEHICLE_CATEGORIES,
  type DriverVehicleCategory,
} from "@/types/driver-application"

export interface SubmitDriverApplicationPayload {
  full_name: string
  phone: string
  email: string
  city_area: string
  vehicle_category: DriverVehicleCategory
  vehicle_make_model?: string | null
  experience_years?: string | null
  availability?: string | null
  message?: string | null
}

export async function submitDriverApplication(
  payload: SubmitDriverApplicationPayload
) {
  try {
    const fullName = payload.full_name?.trim()
    const phone = payload.phone?.trim()
    const email = payload.email?.trim()
    const cityArea = payload.city_area?.trim()
    const vehicleCategory = payload.vehicle_category

    if (!fullName || !phone || !email || !cityArea || !vehicleCategory) {
      return {
        success: false,
        error: "Please complete all required fields.",
      }
    }

    if (!DRIVER_VEHICLE_CATEGORIES.includes(vehicleCategory)) {
      return {
        success: false,
        error: "Please select a valid vehicle category.",
      }
    }

    const supabase = await createClient()

    const { error } = await supabase.from("driver_applications").insert({
      full_name: fullName,
      phone,
      email,
      city_area: cityArea,
      vehicle_category: vehicleCategory,
      vehicle_make_model: payload.vehicle_make_model?.trim() || null,
      experience_years: payload.experience_years?.trim() || null,
      availability: payload.availability?.trim() || "Full-Time",
      message: payload.message?.trim() || null,
      status: "new",
    })

    if (error) {
      console.error("Error submitting driver application:", error)
      return {
        success: false,
        error: error.message || "Failed to submit application.",
      }
    }

    revalidatePath("/admin/driver-hiring")

    return {
      success: true,
    }
  } catch (err: any) {
    console.error("Unexpected error in submitDriverApplication:", err)
    return {
      success: false,
      error: err?.message || "Something went wrong. Please try again.",
    }
  }
}

