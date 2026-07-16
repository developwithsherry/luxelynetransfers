"use server";

import { createClient } from "@/util/supabase/server";

export async function changeBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
  date: string,
  time: string
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("booking")
      .update({ status, date, time })
      .eq("id", bookingId);

    if (error) throw new Error(error.message);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
