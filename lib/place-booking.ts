"use server"

import { Booking } from "@/types/booking";
import { createClient } from "@/util/supabase/server";

export async function createBooking(booking: Booking) {
    try {
        const supabase = await createClient();
        const {add_on,...restOfBooking}=booking

        const { data:newBooking, error } = await supabase
            .from("booking")
            .insert(restOfBooking)
            .select("*")
            .single();

        if (error) {
            console.log("error in creating booking", error.message)
            throw error.message
        }
         const bookingAddon={
            booking_id:newBooking.id,
            add_on_id:add_on?.id
         }
        const {error:bookingAddError}=await supabase
        .from("booking_addons")
        .insert(bookingAddon)

        if(bookingAddError){
            throw bookingAddError.message
        }
        return { success: true,booking:newBooking}
    } catch (error) {
        return { error }
    }
}