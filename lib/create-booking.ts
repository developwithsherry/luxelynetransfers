"use server"

import { Booking } from "@/types/booking";
import { createClient } from "@/util/supabase/server";

export async function createBooking(booking: Partial<Booking>) {
    try {
        const supabase = await createClient();

        // Sanitize relations if empty
        const payload: any = {
            ...booking,
            supplier_id: booking.supplier_id || null,
            driver_id: booking.driver_id || null,
            driver_price: booking.driver_price != null ? Number(booking.driver_price) : 0,
            source: booking.source || "offline",
        }

        const { data, error } = await supabase
            .from("booking")
            .insert(payload)
            .select("*")
            .single();

        if (error) {
            console.error("Error in createBooking:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, data: { booking_id: data.id, ...data } };
    } catch (error: any) {
        console.error("Exception in createBooking:", error);
        return { success: false, error: error?.message || "Failed to create booking" };
    }
}