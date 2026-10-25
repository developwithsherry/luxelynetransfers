"use server"

import { Booking } from "@/types/booking"
import { createClient } from "@/util/supabase/server"
import { revalidatePath } from "next/cache"

export async function getPendingBooking(): Promise<{ success: boolean; data?: Booking[]; error?: string }> {
    try {
        const supabase = await createClient();

        // 1. Fetch bookings with addons
        const { data: bookingsData, error } = await supabase
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
            console.error("Error in fetching pending bookings:", error);
            throw new Error(error.message);
        }

        // 2. Fetch suppliers and drivers in parallel to safely enrich without strict join dependencies
        const [suppliersRes, driversRes] = await Promise.all([
            supabase.from("suppliers").select("id, name, support_email, phone"),
            supabase.from("drivers").select("id, name, phone, photo_url, area_operates"),
        ]);

        const suppliersMap = new Map((suppliersRes.data || []).map((s: any) => [s.id, s]));
        const driversMap = new Map((driversRes.data || []).map((d: any) => [d.id, d]));

        const enriched = (bookingsData || []).map((b: any) => {
            const addons = b.booking_addons?.map((ba: any) => ba.add_on) || [];
            const addonsTotal = addons.reduce((sum: number, a: any) => sum + (a?.price || 0), 0);

            const supplier = b.supplier_id ? suppliersMap.get(b.supplier_id) || null : null;
            const driver = b.driver_id ? driversMap.get(b.driver_id) || null : null;

            return {
                ...b,
                addons,
                final_amount: (b.total_amount || 0) + addonsTotal,
                source: b.source || (b.type === "offline" || b.supplier_id ? "offline" : "website"),
                supplier,
                driver,
            } as Booking;
        });

        return {
            success: true,
            data: enriched,
        };
    } catch (error: any) {
        console.error("Failed to fetch bookings:", error);
        return { success: false, error: error?.message || "Failed to fetch bookings" };
    }
}

export async function assignDriverToBooking(
    bookingId: string,
    driverId: string | null,
    driverPrice: number,
    driverInstructions?: string | null
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();

        const updates: any = {
            driver_id: driverId || null,
            driver_price: Number(driverPrice) || 0,
        };

        if (driverInstructions !== undefined) {
            updates.driver_instructions = driverInstructions || null;
        }

        // If a driver is assigned, automatically mark job as "covered"
        if (driverId) {
            updates.status = "covered";
        }

        const { error } = await supabase
            .from("booking")
            .update(updates)
            .eq("id", bookingId);

        if (error) {
            console.error("Error assigning driver:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/bookings");
        revalidatePath(`/admin/bookings/${bookingId}`);
        revalidatePath("/admin/drivers");
        revalidatePath("/admin/dashboard");

        return { success: true };
    } catch (error: any) {
        console.error("Exception in assignDriverToBooking:", error);
        return { success: false, error: error?.message || "Failed to assign driver" };
    }
}

export async function updateBooking(
    bookingId: string,
    updates: Partial<Booking>
): Promise<{ success: boolean; data?: Booking; error?: string }> {
    try {
        const supabase = await createClient();

        // Sanitize relations
        const payload: any = {
            ...updates,
            supplier_id: updates.supplier_id === "" ? null : updates.supplier_id,
            driver_id: updates.driver_id === "" ? null : updates.driver_id,
        };

        // Remove virtual joined fields before database update
        delete payload.addons;
        delete payload.final_amount;
        delete payload.supplier;
        delete payload.driver;
        delete payload.booking_addons;

        const { data, error } = await supabase
            .from("booking")
            .update(payload)
            .eq("id", bookingId)
            .select()
            .single();

        if (error) {
            console.error("Error updating booking:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/admin/bookings");
        revalidatePath(`/admin/bookings/${bookingId}`);
        revalidatePath("/admin/drivers");
        revalidatePath("/admin/suppliers");
        revalidatePath("/admin/dashboard");

        return { success: true, data: data as Booking };
    } catch (error: any) {
        console.error("Exception in updateBooking:", error);
        return { success: false, error: error?.message || "Failed to update booking" };
    }
}

export async function getDriverJobs(driverId: string): Promise<{ success: boolean; data?: Booking[]; error?: string }> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("booking")
            .select("*")
            .eq("driver_id", driverId)
            .order("date", { ascending: false });

        if (error) {
            console.error("Error fetching driver jobs:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: (data as Booking[]) || [] };
    } catch (error: any) {
        return { success: false, error: error?.message || "Failed to fetch driver jobs" };
    }
}

export async function getSupplierJobs(supplierId: string): Promise<{ success: boolean; data?: Booking[]; error?: string }> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("booking")
            .select("*")
            .eq("supplier_id", supplierId)
            .order("date", { ascending: false });

        if (error) {
            console.error("Error fetching supplier jobs:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: (data as Booking[]) || [] };
    } catch (error: any) {
        return { success: false, error: error?.message || "Failed to fetch supplier jobs" };
    }
}

export async function deleteBooking(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient();

        // 1. Delete associated add-on entries from booking_addons first
        const { error: addonsError } = await supabase
            .from("booking_addons")
            .delete()
            .eq("booking_id", id);

        if (addonsError) {
            console.warn("Notice while deleting booking_addons:", addonsError.message);
        }

        // 2. Delete the main booking row
        const { error: bookingError } = await supabase
            .from("booking")
            .delete()
            .eq("id", id);

        if (bookingError) {
            console.error("Error deleting booking:", bookingError);
            return { success: false, error: bookingError.message };
        }

        revalidatePath("/admin/bookings");
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/drivers");
        revalidatePath("/admin/suppliers");
        return { success: true };
    } catch (error: any) {
        console.error("Error in deleteBooking action:", error);
        return { success: false, error: error?.message || "Failed to delete booking" };
    }
}