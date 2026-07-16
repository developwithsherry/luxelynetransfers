"use server"

import { createClient } from "@/util/supabase/server"

export async function getReturnDiscount() {
  try {
    const supabase = await createClient()

    // get final discount
   const { data: finalDiscountData, error: finalDiscountError } = await supabase
  .from("final_discount")
  .select("final_discount")
  .limit(1)
  .maybeSingle()

    if (finalDiscountError) {
      throw new Error(finalDiscountError.message)
    }

    // get return discount
    const { data: returnDiscountData, error: returnDiscountError } = await supabase
      .from("return_discount")
      .select("value")
      .single()

    if (returnDiscountError) {
      throw new Error(returnDiscountError.message)
    }

    return {
      finalDiscount: finalDiscountData?.final_discount ?? null,
      returnDiscount: returnDiscountData?.value ?? null,
    }
  } catch (error) {
    console.error("Error fetching discounts:", error)
    return {
      finalDiscount: null,
      returnDiscount: null,
      error: (error as Error).message,
    }
  }
}
