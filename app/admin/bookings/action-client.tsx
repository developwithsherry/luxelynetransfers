"use client"

import useSWR from "swr"
import { getPendingBooking } from "./action"
import type { Booking } from "@/types/booking"

// Fetcher function that calls the server action
const pendingBookingsFetcher = async () => {
  const result = await getPendingBooking()
  if (!result.success || result.error) {
    throw new Error(result.error || "Failed to fetch pending bookings")
  }
  return result.data
}

// SWR hook for pending bookings
export function usePendingBookings() {
  const { data, error, isLoading, mutate } = useSWR<Booking[]>("pending-bookings", pendingBookingsFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    pendingBookings: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
