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
      driving_license_expiry: driver.driving_license_expiry || null,
      phv_license_expiry: driver.phv_license_expiry || null,
      log_book_expiry: driver.log_book_expiry || null,
      insurance_expiry: driver.insurance_expiry || null,
      mot_expiry: driver.mot_expiry || null,
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
      revalidatePath("/admin/dashboard")
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
      revalidatePath("/admin/dashboard")
      return { success: true, data: data as Driver }
    }
  } catch (error: any) {
    console.error("Error saving driver:", error)
    return { success: false, error: error?.message || "An unexpected error occurred" }
  }
}

export async function getDriverDocumentAlerts(): Promise<{
  alerts: import("@/types/driver").DriverDocumentAlert[]
  expiredCount: number
  expiringSoonCount: number
  error?: string
}> {
  try {
    const { data: drivers, error } = await getDrivers()
    if (error || !drivers) {
      return { alerts: [], expiredCount: 0, expiringSoonCount: 0, error }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayMs = today.getTime()

    const alerts: import("@/types/driver").DriverDocumentAlert[] = []

    const docConfigs: Array<{
      key: import("@/types/driver").DriverDocKey
      label: string
      urlKey: keyof Driver
      expiryKey: keyof Driver
    }> = [
      { key: "driving_license", label: "Driving License", urlKey: "driving_license_url", expiryKey: "driving_license_expiry" },
      { key: "phv_license", label: "PHV License (PCO)", urlKey: "phv_license_url", expiryKey: "phv_license_expiry" },
      { key: "insurance", label: "Insurance Certificate", urlKey: "insurance_url", expiryKey: "insurance_expiry" },
      { key: "mot", label: "MOT Certificate", urlKey: "mot_url", expiryKey: "mot_expiry" },
      { key: "log_book", label: "Log Book (V5C)", urlKey: "log_book_url", expiryKey: "log_book_expiry" },
    ]

    for (const driver of drivers) {
      // We check active drivers or all drivers with documents
      for (const config of docConfigs) {
        const expiryVal = driver[config.expiryKey] as string | undefined | null
        if (!expiryVal) continue

        // Parse date (support YYYY-MM-DD)
        const parts = expiryVal.split("-").map(Number)
        let expDate: Date
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          expDate = new Date(parts[0], parts[1] - 1, parts[2])
        } else {
          expDate = new Date(expiryVal)
        }
        if (isNaN(expDate.getTime())) continue

        expDate.setHours(0, 0, 0, 0)
        const diffMs = expDate.getTime() - todayMs
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

        const isExpired = diffDays < 0
        const isExpiringSoon = diffDays >= 0 && diffDays <= 30

        if (isExpired || isExpiringSoon) {
          alerts.push({
            driverId: driver.id || "",
            driverName: driver.name,
            driverPhone: driver.phone,
            driverPhoto: driver.photo_url,
            docKey: config.key,
            docLabel: config.label,
            docUrl: (driver[config.urlKey] as string) || null,
            expiryDate: expiryVal,
            isExpired,
            isExpiringSoon,
            daysDiff: diffDays,
          })
        }
      }
    }

    // Sort: most severely expired first (smallest negative daysDiff), then expiring soonest
    alerts.sort((a, b) => a.daysDiff - b.daysDiff)

    const expiredCount = alerts.filter((a) => a.isExpired).length
    const expiringSoonCount = alerts.filter((a) => a.isExpiringSoon).length

    return { alerts, expiredCount, expiringSoonCount }
  } catch (err: any) {
    console.error("Error checking driver document alerts:", err)
    return { alerts: [], expiredCount: 0, expiringSoonCount: 0, error: err.message }
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
