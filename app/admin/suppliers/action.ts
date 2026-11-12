"use server"

import { Supplier } from "@/types/supplier"
import { createClient } from "@/util/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSuppliers(): Promise<{ data?: Supplier[]; error?: string }> {
  try {
    const supabase = await createClient()
    const [{ data, error }, { data: bookingsData }] = await Promise.all([
      supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("booking")
        .select("supplier_id, status, payment_status, total_amount, created_at")
        .not("supplier_id", "is", null)
        .order("created_at", { ascending: false }),
    ])

    if (error) {
      console.error("Error fetching suppliers:", error)
      if (error.code === "42P01") {
        return {
          error: "Table 'suppliers' does not exist yet. Please run the SQL file (suppliers.sql) in your Supabase SQL Editor.",
        }
      }
      return { error: error.message }
    }

    const unpaidStatsBySupplier = new Map<string, { count: number; amount: number }>()
    const lastUsedBySupplier = new Map<string, string>()

    if (Array.isArray(bookingsData)) {
      bookingsData.forEach((b: any) => {
        const supplierId = b.supplier_id
        if (!supplierId) return

        if (b.created_at && !lastUsedBySupplier.has(supplierId)) {
          lastUsedBySupplier.set(supplierId, b.created_at)
        }

        const isCompleted = (b.status || "").toLowerCase().trim() === "completed"
        const pStatus = (b.payment_status || "").toLowerCase().trim()
        const isPaid = pStatus === "paid" || pStatus === "paid_to_driver"

        if (isCompleted && !isPaid) {
          const prev = unpaidStatsBySupplier.get(supplierId) || { count: 0, amount: 0 }
          const amount = Number(b.total_amount || 0)
          unpaidStatsBySupplier.set(supplierId, {
            count: prev.count + 1,
            amount: prev.amount + (isNaN(amount) ? 0 : amount),
          })
        }
      })
    }

    const enrichedSuppliers = ((data as Supplier[]) || []).map((supplier) => {
      const unpaid = supplier.id ? unpaidStatsBySupplier.get(supplier.id) : undefined
      const lastUsed = supplier.id ? lastUsedBySupplier.get(supplier.id) || null : null
      return {
        ...supplier,
        unpaid_completed_jobs_count: unpaid?.count || 0,
        unpaid_completed_amount: unpaid?.amount || 0,
        last_used_at: lastUsed,
      }
    })

    return { data: enrichedSuppliers }
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

    const basePayload = {
      name: supplier.name.trim(),
      support_email: supplier.support_email?.trim() || null,
      username: supplier.username?.trim() || null,
      password: supplier.password || null,
      phone: supplier.phone?.trim() || null,
      notes: supplier.notes?.trim() || null,
      is_active: supplier.is_active ?? true,
    }

    const payloadWithColor = {
      ...basePayload,
      color: supplier.color?.trim() || null,
    }

    if (supplier.id) {
      let { data, error } = await supabase
        .from("suppliers")
        .update(payloadWithColor)
        .eq("id", supplier.id)
        .select()
        .single()

      if (error && (error.code === "42703" || error.message?.includes("color"))) {
        const fallback = await supabase
          .from("suppliers")
          .update(basePayload)
          .eq("id", supplier.id)
          .select()
          .single()
        data = fallback.data
          ? ({ ...fallback.data, color: payloadWithColor.color } as any)
          : fallback.data
        error = fallback.error
      }

      if (error) {
        console.error("Error updating supplier:", error)
        return { success: false, error: error.message }
      }

      revalidatePath("/admin/suppliers")
      revalidatePath("/admin/bookings")
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/calendar")
      revalidatePath("/admin/accounts")
      return { success: true, data: data as Supplier }
    } else {
      let { data, error } = await supabase
        .from("suppliers")
        .insert([payloadWithColor])
        .select()
        .single()

      if (error && (error.code === "42703" || error.message?.includes("color"))) {
        const fallback = await supabase
          .from("suppliers")
          .insert([basePayload])
          .select()
          .single()
        data = fallback.data
          ? ({ ...fallback.data, color: payloadWithColor.color } as any)
          : fallback.data
        error = fallback.error
      }

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
      revalidatePath("/admin/bookings")
      revalidatePath("/admin/dashboard")
      revalidatePath("/admin/calendar")
      revalidatePath("/admin/accounts")
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
