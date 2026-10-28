"use server"

import { Booking } from "@/types/booking";
import { createClient } from "@/util/supabase/server";

export async function createBooking(booking: Partial<Booking>) {
    try {
        const supabase = await createClient();

        // Ensure system ID is assigned by default for every booking
        const bookingId = booking.id || crypto.randomUUID();

        // Sanitize relations if empty
        const payload: any = {
            ...booking,
            id: bookingId,
            email: booking.email && String(booking.email).trim() ? String(booking.email).trim() : null,
            phone: booking.phone && String(booking.phone).trim() ? String(booking.phone).trim() : null,
            supplier_id: booking.supplier_id || null,
            supplier_reference: booking.supplier_reference ? String(booking.supplier_reference).trim() : null,
            driver_id: booking.driver_id || null,
            driver_price: booking.driver_price != null ? Number(booking.driver_price) : 0,
            no_passengers: booking.no_passengers != null ? Number(booking.no_passengers) : 1,
            no_laguage: booking.no_laguage != null ? Number(booking.no_laguage) : 0,
            no_hand_laguage: booking.no_hand_laguage != null ? Number(booking.no_hand_laguage) : 0,
            vehicle_type: booking.vehicle_type ? String(booking.vehicle_type).trim() : null,
            vehicle_id: booking.vehicle_id || null,
            source: booking.source || "offline",
        }

        let { data, error } = await supabase
            .from("booking")
            .insert(payload)
            .select("*")
            .single();

        // If vehicle_type column is not yet present in DB schema, retry without vehicle_type
        if (error && error.message && error.message.includes("vehicle_type")) {
            console.warn("vehicle_type column not found in database, retrying insert without vehicle_type");
            const fallbackPayload = { ...payload };
            delete fallbackPayload.vehicle_type;
            const retryRes = await supabase
                .from("booking")
                .insert(fallbackPayload)
                .select("*")
                .single();
            data = retryRes.data;
            error = retryRes.error;
        }

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