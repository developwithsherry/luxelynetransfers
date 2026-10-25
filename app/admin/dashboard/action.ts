"use server"

import { getPendingBooking } from "@/app/admin/bookings/action"
import { createClient } from "@/util/supabase/server"

export async function getBookings() {
  try {
    const res = await getPendingBooking()
    if (!res.success) {
      throw new Error(res.error || "Failed to fetch bookings")
    }
    return { data: res.data || [] }
  } catch (error: any) {
    console.error("Error in getBookings for dashboard:", error)
    return { error: error?.message || "Failed to load bookings" }
  }
}

export async function getVehicles() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("vehicle").select("*")

    if (error) {
      console.log("error in getting vehicle", error)
      throw error.message
    }
    return { data }
  } catch (error) {
    return { error }
  }
}