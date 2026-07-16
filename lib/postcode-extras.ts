import { createClient } from "@/util/supabase/client"

export async function getPostcodeExtras(postcode: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("postcode_extras")
      .select("*")
      .eq("postcode", postcode.toUpperCase())
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
