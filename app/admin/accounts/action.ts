"use server"

import { getPendingBooking } from "@/app/admin/bookings/action"
import { getSuppliers } from "@/app/admin/suppliers/action"
import { getDrivers } from "@/app/admin/drivers/action"
import { getVehicles } from "@/app/admin/dashboard/action"

export async function getAccountsReportData() {
  try {
    const [bookingsRes, suppliersRes, driversRes, vehiclesRes] = await Promise.all([
      getPendingBooking(),
      getSuppliers(),
      getDrivers(),
      getVehicles(),
    ])

    if (!bookingsRes.success) {
      throw new Error(bookingsRes.error || "Failed to load bookings for financial report")
    }

    return {
      bookings: bookingsRes.data || [],
      suppliers: suppliersRes.data || [],
      drivers: driversRes.data || [],
      vehicles: (vehiclesRes.data as any[]) || [],
    }
  } catch (error: any) {
    console.error("Error loading accounts report data:", error)
    return {
      bookings: [],
      suppliers: [],
      drivers: [],
      vehicles: [],
      error: error?.message || "Failed to load accounts report data",
    }
  }
}

