"use server"

import { createClient } from "@/util/supabase/server"
import { revalidatePath } from "next/cache"
import type {
  DriverApplication,
  DriverApplicationStatus,
} from "@/types/driver-application"

export async function getDriverApplications(): Promise<{
  data: DriverApplication[]
  error: string | null
}> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("driver_applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    return { data: (data as DriverApplication[]) || [], error: null }
  } catch (err: any) {
    return {
      data: [],
      error: err?.message || "Failed to load driver applications.",
    }
  }
}

export async function updateDriverApplication(
  id: string,
  updates: {
    status?: DriverApplicationStatus
    admin_notes?: string | null
  }
) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("driver_applications")
      .update(updates)
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/driver-hiring")
    return { success: true }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to update application.",
    }
  }
}

export async function deleteDriverApplication(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("driver_applications")
      .delete()
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/driver-hiring")
    return { success: true }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to delete application.",
    }
  }
}

