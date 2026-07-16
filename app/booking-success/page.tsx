"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Loader2, MapPin, Calendar, Clock, ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { formatDateUK } from "@/lib/format-util"
import type { Booking } from "@/types/booking"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      setError("No session ID found in the URL. Please contact support if you believe this is an error.")
      return
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch("/api/stripe/confirm-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify transaction.")
        }

        setBooking(data.booking)
      } catch (err: any) {
        console.error("Verification error:", err)
        setError(err.message || "An unexpected error occurred during confirmation.")
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-lime-500" />
        <p className="text-muted-foreground text-sm font-medium">Verifying your payment, please wait...</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-red-600 dark:text-red-400 text-3xl font-bold">!</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Verification Failed</h1>
        <p className="text-muted-foreground text-sm mb-6">{error || "Could not retrieve booking details."}</p>
        <Link
          href="/"
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-medium py-2.5 px-6 rounded-lg transition"
        >
          Go Home
        </Link>
      </div>
    )
  }

  // Pre-filled WhatsApp message URL
  const waNumber = "447882733291"
  const waText = encodeURIComponent(
    `Hello LuxeLyne, I just completed my booking payment. Here are my details:\n\n` +
    `- Name: ${booking.first_name} ${booking.last_name}\n` +
    `- Pickup: ${booking.pickup_location}\n` +
    `- Drop-off: ${booking.drop_off_location}\n` +
    `- Date: ${booking.date ? formatDateUK(booking.date) : "N/A"} at ${booking.time}\n` +
    `- Total Paid: £${booking.total_amount}`
  )
  const whatsappUrl = `https://wa.me/${waNumber}?text=${waText}`

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Thank you card */}
      <div className="bg-white dark:bg-gray-900 border border-border/50 rounded-2xl p-8 text-center shadow-sm mb-8 flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-lime-100 dark:bg-lime-950/50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-lime-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">
          Booking Confirmed 🎉
        </h1>
        <p className="text-muted-foreground text-sm max-w-md">
          Thank you for choosing <span className="font-semibold text-foreground">LuxeLyne Transfers</span>. Your booking has been registered, and a confirmation email has been dispatched to <span className="font-semibold text-foreground">{booking.email}</span>.
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-white dark:bg-gray-900 border border-border/50 rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div className="border-b border-border/50 px-6 py-4 bg-muted/20">
          <h2 className="text-lg font-bold text-foreground">Journey Summary</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Pickup and Dropoff Timeline */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center mt-1">
                <div className="w-3.5 h-3.5 bg-lime-500 rounded-full"></div>
                <div className="w-0.5 h-10 bg-border mt-1"></div>
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Pickup Location</span>
                <p className="font-medium text-foreground text-sm md:text-base leading-relaxed">
                  {booking.pickup_location}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-3.5 h-3.5 bg-red-500 rounded-full mt-1"></div>
              <div className="flex-1 space-y-1">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Drop-off Location</span>
                <p className="font-medium text-foreground text-sm md:text-base leading-relaxed">
                  {booking.drop_off_location}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Date</span>
              </div>
              <p className="font-medium text-foreground text-sm">
                {booking.date ? formatDateUK(booking.date) : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Time</span>
              </div>
              <p className="font-medium text-foreground text-sm">{booking.time || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Passengers</span>
              <p className="font-medium text-foreground text-sm">{booking.no_passengers || 1}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">Luggage</span>
              <p className="font-medium text-foreground text-sm">{booking.no_laguage || 0} suitcases</p>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Pricing Row */}
          <div className="flex justify-between items-center py-2">
            <span className="text-base font-bold text-foreground">Total Price Paid</span>
            <span className="text-2xl font-extrabold text-lime-600">
              £{booking.total_amount ? booking.total_amount.toLocaleString() : 0}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/"
          className="bg-black hover:bg-black/90 text-white font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm border border-gray-800"
        >
          Return to Homepage
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-3.5 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  )
}

export default function BookingSuccess() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background dark:bg-gray-950 pt-24 pb-12">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-lime-500" />
              <p className="text-muted-foreground text-sm font-medium">Loading booking confirmation...</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}
