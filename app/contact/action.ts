"use server"

import { createClient } from "@/util/supabase/server"
import { dispatchAdminNotification } from "@/lib/admin-push"

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

        // Send instant background push notification to all LLT-Management admin devices
        try {
            const snippet = String(contactUs.message || "").trim().slice(0, 90);
            await dispatchAdminNotification({
                notificationKey: `contact_lead_${Date.now()}`,
                category: "contact_lead",
                title: `📩 New Contact Lead: ${contactUs.name}`,
                body: `${contactUs.phone || contactUs.email} — "${snippet}"`,
                url: "/admin/messages",
                skipDedupe: true,
            });
        } catch (pushErr) {
            console.error("Non-blocking push error on contact lead:", pushErr);
        }
        
        return { success: true }
    } catch (error) {
        return { error }
    }
}