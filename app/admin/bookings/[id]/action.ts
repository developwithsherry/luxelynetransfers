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
      console.error("Error in fetching booking by ID:", error)
      throw new Error(error.message)
    }

    // Safely load supplier and driver if IDs are present
    let supplier = null
    let driver = null

    if (data.supplier_id) {
      const { data: s } = await supabase.from("suppliers").select("*").eq("id", data.supplier_id).single()
      supplier = s || null
    }

    if (data.driver_id) {
      const { data: d } = await supabase.from("drivers").select("*").eq("id", data.driver_id).single()
      driver = d || null
    }

    // Compute final_amount including add-ons
    const addons = data?.booking_addons?.map((ba: any) => ba.add_on) || []
    const addonsTotal = addons.reduce((sum: number, a: any) => sum + (a?.price || 0), 0)

    const bookingWithTotal = {
      ...data,
      addons,
      final_amount: (data?.total_amount || 0) + addonsTotal,
      source: data.source || (data.type === "offline" || data.supplier_id ? "offline" : "website"),
      supplier,
      driver,
    }

    return { success: true, data: bookingWithTotal }
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch booking" }
  }
}
