"use server"

import { createClient } from "@/util/supabase/server"

export async function getBookings() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("booking")
            .select("*")
            .eq("payment_status", "COMPLETED")

        if (error) {
            console.log("Error", error);
            throw error.message
        }
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function getVehicles() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("vehicle")
            .select("*")

        if (error) {
            console.log("error in getting vehicle", error);
            throw error.message

        }
        return { data }
    } catch (error) {
        return { error }
    }
}