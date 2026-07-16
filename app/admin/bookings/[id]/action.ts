"use server"

import { createClient } from "@/util/supabase/server"

export async function getBookingByID(id: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("booking")
      .select(`
        *,
        vehicle(*),
        booking_addons (
          id,
          add_on (
            id,
            name,
            price
          )
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.log("Error in fetching booking by ID", error)
      throw new Error(error.message)
    }

    // Compute final_amount including add-ons
    const addons = data?.booking_addons?.map((ba: any) => ba.add_on) || []
    const addonsTotal = addons.reduce((sum: number, a: any) => sum + (a?.price || 0), 0)

    const bookingWithTotal = {
      ...data,
      addons,
      final_amount: (data?.total_amount || 0) + addonsTotal,
    }

    return { success: true, data: bookingWithTotal }
  } catch (error) {
    return { success: false, error }
  }
}
