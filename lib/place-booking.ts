"use server"

import { Booking } from "@/types/booking";
import { createClient } from "@/util/supabase/server";
import { dispatchAdminNotification } from "@/lib/admin-push";

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

        // Send instant background push notification to all LLT-Management admin devices
        try {
            const shortId = String(newBooking.id || "").slice(0, 6).toUpperCase();
            const passenger = [newBooking.first_name, newBooking.last_name].filter(Boolean).join(" ").trim() || "Customer";
            const pickup = String(newBooking.pickup_location || "Pickup").split(",")[0];
            const dropoff = String(newBooking.drop_off_location || "Drop-off").split(",")[0];
            const fare = Number(newBooking.total_amount || 0).toFixed(2);

            await dispatchAdminNotification({
                notificationKey: `new_booking_${newBooking.id}`,
                category: "new_booking",
                title: `🚘 New Website Booking #${shortId} (£${fare})`,
                body: `${passenger} • ${newBooking.date || ""} at ${String(newBooking.time || "").slice(0, 5)} • ${pickup} → ${dropoff}`,
                url: `/admin/bookings/${newBooking.id}`,
                bookingId: newBooking.id,
            });
        } catch (pushErr) {
            console.error("Non-blocking push error on new booking:", pushErr);
        }

        return { success: true,booking:newBooking}
    } catch (error) {
        return { error }
    }
}