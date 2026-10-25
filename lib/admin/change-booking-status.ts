"use server";

import { createClient } from "@/util/supabase/server";
import { revalidatePath } from "next/cache";

export async function changeBookingStatus(
  bookingId: string,
  status: string,
  date?: string,
  time?: string,
  payment_status?: string
) {
  try {
    const supabase = await createClient();

    const updates: any = { status };
    if (date) updates.date = date;
    if (time) updates.time = time;
    if (payment_status) updates.payment_status = payment_status;

    const { error } = await supabase
      .from("booking")
      .update(updates)
      .eq("id", bookingId);

    if (error) throw new Error(error.message);

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${bookingId}`);
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update status" };
  }
}
