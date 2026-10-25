"use server"

import { Driver } from "@/types/driver"
import { createClient } from "@/util/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDrivers(): Promise<{ data?: Driver[]; error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching drivers:", error)
      if (error.code === "42P01") {
        return {
          error: "Table 'drivers' does not exist yet. Please execute drivers.sql in your Supabase SQL Editor.",
        }
      }
      return { error: error.message }
    }

    return { data: (data as Driver[]) || [] }
  } catch (error: any) {
    console.error("Failed to fetch drivers:", error)
    return { error: error?.message || "Failed to fetch drivers" }
  }
}

export async function saveDriver(
  driver: Omit<Driver, "created_at" | "updated_at">
): Promise<{ success: boolean; data?: Driver; error?: string }> {
  try {
    const supabase = await createClient()

    const payload = {
      name: driver.name.trim(),
      phone: driver.phone.trim(),
      area_operates: driver.area_operates?.trim() || null,
      photo_url: driver.photo_url || null,
      driving_license_url: driver.driving_license_url || null,
      phv_license_url: driver.phv_license_url || null,
      vehicle_model: driver.vehicle_model?.trim() || null,
      vehicle_reg: driver.vehicle_reg?.trim() || null,
      vehicle_images: driver.vehicle_images || [],
      log_book_url: driver.log_book_url || null,
      insurance_url: driver.insurance_url || null,
      mot_url: driver.mot_url || null,
      notes: driver.notes?.trim() || null,
      is_active: driver.is_active ?? true,
    }

    if (driver.id) {
      const { data, error } = await supabase
        .from("drivers")
        .update(payload)
        .eq("id", driver.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating driver:", error)
        return { success: false, error: error.message }
      }

      revalidatePath("/admin/drivers")
      return { success: true, data: data as Driver }
    } else {
      const { data, error } = await supabase
        .from("drivers")
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error("Error creating driver:", error)
        if (error.code === "42P01") {
          return {
            success: false,
            error: "Table 'drivers' does not exist yet. Please execute drivers.sql in your Supabase SQL Editor first.",
          }
        }
        return { success: false, error: error.message }
      }

      revalidatePath("/admin/drivers")
      return { success: true, data: data as Driver }
    }
  } catch (error: any) {
    console.error("Error saving driver:", error)
    return { success: false, error: error?.message || "An unexpected error occurred" }
  }
}

export async function deleteDriver(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("drivers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting driver:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/drivers")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting driver:", error)
    return { success: false, error: error?.message || "Failed to delete driver" }
  }
}

export async function toggleDriverActiveStatus(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("drivers")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/drivers")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update driver status" }
  }
}
