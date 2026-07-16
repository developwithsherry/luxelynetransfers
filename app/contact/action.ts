"use server"

import { createClient } from "@/util/supabase/server"

interface ContactUsData {
    name: string;
    email: string;
    phone: string | null;
    message: string;
}
export async function InsertContactUs(contactUs: ContactUsData) {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("contact")
            .insert(contactUs)

        if (error) {
            console.log("Error in saving contact us",error)
            throw error.message
        }
        
        return { success: true }
    } catch (error) {
        return { error }
    }
}