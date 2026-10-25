"use server"

import { Supplier } from "@/types/supplier"
import { createClient } from "@/util/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSuppliers(): Promise<{ data?: Supplier[]; error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching suppliers:", error)
      if (error.code === "42P01") {
        return {
          error: "Table 'suppliers' does not exist yet. Please run the SQL file (suppliers.sql) in your Supabase SQL Editor.",
        }
      }
      return { error: error.message }
    }

    return { data: (data as Supplier[]) || [] }
  } catch (error: any) {
    console.error("Failed to fetch suppliers:", error)
    return { error: error?.message || "Failed to fetch suppliers" }
  }
}

export async function saveSupplier(
  supplier: Omit<Supplier, "created_at" | "updated_at">
): Promise<{ success: boolean; data?: Supplier; error?: string }> {
  try {
    const supabase = await createClient()

    const payload = {
      name: supplier.name.trim(),
      support_email: supplier.support_email?.trim() || null,
      username: supplier.username?.trim() || null,
      password: supplier.password || null,
      phone: supplier.phone?.trim() || null,
      notes: supplier.notes?.trim() || null,
      is_active: supplier.is_active ?? true,
    }

    if (supplier.id) {
      const { data, error } = await supabase
        .from("suppliers")
        .update(payload)
        .eq("id", supplier.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating supplier:", error)
        return { success: false, error: error.message }
      }

      revalidatePath("/admin/suppliers")
      return { success: true, data: data as Supplier }
    } else {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error("Error creating supplier:", error)
        if (error.code === "42P01") {
          return {
            success: false,
            error: "Table 'suppliers' does not exist yet. Please execute suppliers.sql in your Supabase SQL Editor first.",
          }
        }
        return { success: false, error: error.message }
      }

      revalidatePath("/admin/suppliers")
      return { success: true, data: data as Supplier }
    }
  } catch (error: any) {
    console.error("Error saving supplier:", error)
    return { success: false, error: error?.message || "An unexpected error occurred" }
  }
}

export async function deleteSupplier(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("suppliers").delete().eq("id", id)

    if (error) {
      console.error("Error deleting supplier:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/suppliers")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting supplier:", error)
    return { success: false, error: error?.message || "Failed to delete supplier" }
  }
}

export async function toggleSupplierActiveStatus(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("suppliers")
      .update({ is_active: isActive })
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/suppliers")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to update supplier status" }
  }
}
