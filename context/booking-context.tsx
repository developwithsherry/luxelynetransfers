"use client"

import { Booking } from "@/types/booking"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAddons } from "./addon-context"  // ✅ import addons context

type BookingContextType = {
  booking: Booking
  estimatedTime: string
  setEstimatedTime: (time: string) => void
  updateBooking: (details: Partial<Booking>) => void
  resetBooking: () => void
}

const defaultBooking: Booking = {
  pickup_location: "",
  drop_off_location: "",
  stops: [],
  time: "",
  with_return: false,
  return_date: new Date(),
  return_time: "",
  returnDiscount: 0,
  total_amount: 0,
  addon: null,
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(defaultBooking)
  const [estimatedTime, setEstimatedTime] = useState<string>("")

  const { selectedAddon } = useAddons()   


  const updateBooking = (details: Partial<Booking>) => {
    setBooking((prev) => ({ ...prev, ...details }))
  }

  const resetBooking = () => {
    setBooking(defaultBooking)
  }

// booking-context.tsx
useEffect(() => {
  if (selectedAddon) {
    setBooking((prev) => ({
      ...prev,
      addon: selectedAddon,
      total_amount: selectedAddon.price, // or base fare + addon.price
    }))
  } else {
    setBooking((prev) => ({
      ...prev,
      addon: null,
      total_amount: 0, // reset if no addon
    }))
  }
}, [selectedAddon])



  return (
    <BookingContext.Provider
      value={{ booking, updateBooking, resetBooking, estimatedTime, setEstimatedTime }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
