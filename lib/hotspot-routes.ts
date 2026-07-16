import { createClient } from "@/util/supabase/client"

export async function checkHotspotRoute(pickup: string, dropoff: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hotspot_routes")
      .select("*")
      .eq("pickup_postcode", pickup.toUpperCase())
      .eq("dropoff_postcode", dropoff.toUpperCase())
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
