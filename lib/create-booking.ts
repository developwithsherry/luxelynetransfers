"use server"

import { Booking } from "@/types/booking";
import { createClient } from "@/util/supabase/server";

export async function createBooking(booking: Booking) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("booking")
            .insert(booking)

        if (error) {
            console.log("error in creating booking", error.message)
            throw error.message
        }
        return { success: true }
    } catch (error) {
        return { error }
    }
}