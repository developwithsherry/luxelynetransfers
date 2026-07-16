"use server"

import { createClient } from "@/util/supabase/server"


export async function getPendingBooking() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("booking")
            .select(`
    *,
    booking_addons (
      id,
      add_on (
        id,
        name,
        price
      )
    )
  `)
            .order("created_at", { ascending: false });


        if (error) {
            console.log("Error in fetching pending bookings", error)
            throw new Error(error.message);
        }
        return {
            success: true,
            data: data?.map((b) => {
                const addons = b.booking_addons?.map((ba) => ba.add_on) || []
                const addonsTotal = addons.reduce((sum, a) => sum + (a?.price || 0), 0)
                return {
                    ...b,
                    addons,
                    final_amount: b.total_amount + addonsTotal,
                }
            }),
        }
    } catch (error) {
        return { success: true, error };

    }
}