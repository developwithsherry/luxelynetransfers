"use client"

import { useState, useEffect } from "react"
import type { Booking } from "@/types/booking"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  Users,
  Luggage,
  Plane,
  FileText,
  Car,
  CreditCard,
  Calendar,
  Route,
  Briefcase,
  Trash2,
  Loader2,
  Building2,
  Globe,
  UserCheck,
  UserPlus,
  Edit3,
  MessageSquare,
  Send,
  Copy,
  Check,
} from "lucide-react"
import { formatDateUK } from "@/lib/format-util"
import { ChangeBookingStatusDialog } from "./change-booking-status-dialog"
import { AssignDriverDialog } from "./assign-driver-dialog"
import { EditBookingDialog } from "./edit-booking-dialog"
import { QuickStatusPopover } from "./quick-status-popover"
import { Button } from "@/components/ui/button"
import { capitalizeFirstLetter } from "@/lib/capatilze-firstletter"
import { deleteBooking } from "@/app/admin/bookings/action"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
  booking: Booking
  onBookingStatusChange: (data: {
    status: Booking["status"]
    date: string
    time: string
    payment_status?: string
  }) => void
}

export function BookingDetailsTable({ booking: initialBooking, onBookingStatusChange }: Props) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking>(initialBooking)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedRef, setCopiedRef] = useState(false)

  useEffect(() => {
    setBooking(initialBooking)
  }, [initialBooking])

  const buildDriverWhatsAppMessage = () => {
    const blocks: string[] = ["*Journey Details*"]

    const refNo = booking.id ? `#${booking.id.slice(0, 5).toUpperCase()}` : ""
    if (refNo) {
      blocks.push(`Reference No: ${refNo}`)
    }

    const formattedDate = booking.date ? formatDateUK(booking.date) : ""
    const formattedTime = booking.time ? booking.time.trim() : ""
    const dateTimeStr = [formattedDate, formattedTime].filter(Boolean).join(" ")
    if (dateTimeStr) {
      blocks.push(`Date/Time: ${dateTimeStr}`)
    }

    if (booking.pickup_location?.trim()) {
      blocks.push(`Pickup: ${booking.pickup_location.trim()}`)
    }

    if (booking.drop_off_location?.trim()) {
      blocks.push(`Drop off: ${booking.drop_off_location.trim()}`)
    }

    const countsLines: string[] = []
    if (booking.no_passengers != null && Number(booking.no_passengers) > 0) {
      countsLines.push(`No of Passengers: ${booking.no_passengers}`)
    }
    if (booking.no_laguage != null && Number(booking.no_laguage) > 0) {
      countsLines.push(`No of Luggages: ${booking.no_laguage}`)
    }
    if (booking.no_hand_laguage != null && Number(booking.no_hand_laguage) > 0) {
      countsLines.push(`No of Handbags: ${booking.no_hand_laguage}`)
    }
    if (countsLines.length > 0) {
      blocks.push(countsLines.join("\n"))
    }

    const passengerName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim()
    const passengerLines: string[] = []
    if (passengerName) {
      passengerLines.push(`Passenger Name:\n${passengerName}`)
    }
    if (booking.phone?.trim()) {
      passengerLines.push(`Mobile:\n${booking.phone.trim()}`)
    }
    if (passengerLines.length > 0) {
      blocks.push(passengerLines.join("\n"))
    }

    const flightLines: string[] = []
    if (booking.flight_no?.trim()) {
      flightLines.push(`Flight No: ${booking.flight_no.trim()}`)
    }
    if (booking.arriving_from?.trim()) {
      flightLines.push(`Arriving From: ${booking.arriving_from.trim()}`)
    }
    if (flightLines.length > 0) {
      blocks.push(flightLines.join("\n"))
    }

    if (booking.driver_price != null && Number(booking.driver_price) > 0) {
      blocks.push(`Fare:\n£${Number(booking.driver_price).toFixed(2)} Net`)
    }

    if (blocks.length > 1 && blocks[1].startsWith("Reference No:")) {
      const header = `${blocks[0]}\n${blocks[1]}`
      return [header, ...blocks.slice(2)].join("\n\n")
    }
    return blocks.join("\n\n")
  }

  const handlePushToDriver = async () => {
    const message = buildDriverWhatsAppMessage()

    try {
      await navigator.clipboard.writeText(message)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = message
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }

    const driverPhone = booking.driver?.phone?.trim()
    if (!driverPhone) {
      toast.info("Journey details copied! Please assign a driver with a phone number to open WhatsApp.")
      return
    }

    const cleanPhone = driverPhone.replace(/[^0-9]/g, "")
    const formattedPhone = cleanPhone.startsWith("0") ? `44${cleanPhone.slice(1)}` : cleanPhone

    if (!formattedPhone) {
      toast.info("Journey details copied! Driver phone number is invalid for WhatsApp.")
      return
    }

    toast.success(`Message copied & opening WhatsApp for ${booking.driver?.name || "Driver"}`)
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
  }

  // Parse stops if they exist
  let stops: string[] = []
  if (booking.stops) {
    if (Array.isArray(booking.stops)) {
      stops = booking.stops
    } else if (typeof booking.stops === "object" && Array.isArray(booking.stops.locations)) {
      stops = booking.stops.locations
    }
  }

  const handleDelete = async () => {
    if (!booking.id) return
    try {
      setIsDeleting(true)
      const res = await deleteBooking(booking.id)
      if (!res.success) {
        throw new Error(res.error || "Failed to delete booking")
      }
      toast.success("Booking deleted successfully")
      setDeleteDialogOpen(false)
      router.replace("/admin/bookings")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete booking")
    } finally {
      setIsDeleting(false)
    }
  }

  const isWebsite = booking.source === "website" || (!booking.supplier_id && booking.type !== "offline")

  const handleStatusChangeInternal = (data: {
    status: Booking["status"]
    date: string
    time: string
    payment_status?: string
  }) => {
    setBooking((prev) => ({
      ...prev,
      status: data.status,
      date: data.date,
      time: data.time,
      payment_status: data.payment_status || prev.payment_status,
    }))
    onBookingStatusChange(data)
  }

  const customerTotal = Number(booking.final_amount ?? booking.total_amount ?? 0)
  const driverPay = Number(booking.driver_price ?? 0)
  const netProfit = customerTotal - driverPay
  const marginPct = customerTotal > 0 ? (netProfit / customerTotal) * 100 : 0
  const passengerName = `${booking.first_name || ""} ${booking.last_name || ""}`.trim() || "Guest Passenger"
  const instructionsText = booking.driver_instructions || booking.intructions || ""

  const copySupplierRef = () => {
    if (!booking.supplier_reference) return
    navigator.clipboard.writeText(booking.supplier_reference)
    setCopiedRef(true)
    toast.success("Supplier reference copied")
    setTimeout(() => setCopiedRef(false), 2000)
  }

  return (
    <div className="space-y-6 py-4 px-2 sm:px-4">
      {/* =================================================================== */}
      {/* 1. TOP COMMAND HEADER                                               */}
      {/* =================================================================== */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <Link
            href="/admin/bookings"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition shrink-0"
            title="Back to Bookings"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-black text-xl sm:text-2xl text-slate-950 tracking-tight font-mono">
                #{booking.id?.slice(0, 5).toUpperCase()}
              </h1>

              <QuickStatusPopover
                booking={booking}
                showPaymentBadge={true}
                onSuccess={(updated) => {
                  setBooking((prev) => ({
                    ...prev,
                    status: updated.status,
                    payment_status: updated.payment_status,
                  }))
                }}
              />

              {booking.with_return && (
                <span className="bg-lime-100 text-lime-900 border border-lime-300 px-2.5 py-0.5 text-[11px] font-bold rounded-full inline-flex items-center gap-1">
                  <Route className="w-3 h-3" />
                  Return Trip
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                Created {booking.created_at ? formatDateUK(booking.created_at) : "N/A"}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700">
                {isWebsite ? "Website Direct" : booking.supplier?.name || "Offline Direct"}
              </span>
              {booking.supplier_reference && (
                <>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    Ref: {booking.supplier_reference}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={handlePushToDriver}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-3.5 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Push to Driver
          </Button>

          <Button
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
            className="border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold h-9"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Edit Booking
          </Button>

          <Button
            onClick={() => setAssignDialogOpen(true)}
            className="bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold h-9"
          >
            {booking.driver ? (
              <>
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                Change Driver
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                Assign Driver
              </>
            )}
          </Button>

          <ChangeBookingStatusDialog
            bookingId={booking.id}
            booking={booking}
            onStatusChange={handleStatusChangeInternal}
          />

          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold h-9 px-3"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. MAIN 2-COLUMN DOSSIER GRID                                       */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 COLS): JOURNEY ITINERARY + PASSENGER & VEHICLE */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: JOURNEY ROUTE, SCHEDULE & FLIGHT DETAILS */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
            {/* Schedule Banner Header */}
            <div className="bg-slate-950 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lime-400/15 border border-lime-400/30 text-lime-400 flex items-center justify-center">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    Pickup Date & Time
                  </span>
                  <div className="text-base sm:text-lg font-extrabold text-white">
                    {booking.date ? formatDateUK(booking.date) : "Date N/A"}{" "}
                    <span className="text-lime-400 ml-1">• {booking.time || "Time N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                {booking.total_distance && (
                  <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                    <span className="text-slate-400 text-[10px] block uppercase">Distance</span>
                    <span className="font-bold text-white">{booking.total_distance} miles</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(true)}
                  className="text-xs font-semibold text-lime-400 hover:underline"
                >
                  Edit Route
                </button>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="p-5 sm:p-6 space-y-5">
              <div className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {/* Pickup */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-lime-500 ring-4 ring-lime-100" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime-700 block">
                    Pickup Location
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-950 mt-0.5">
                    {booking.pickup_location || "Not specified"}
                  </p>
                </div>

                {/* Intermediate Stops */}
                {stops.map((stop, index) => (
                  <div key={index} className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                      Via Stop {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{stop}</p>
                  </div>
                ))}

                {/* Drop-off */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-950 ring-4 ring-slate-200" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                    Drop-off Destination
                  </span>
                  <p className="text-sm sm:text-base font-bold text-slate-950 mt-0.5">
                    {booking.drop_off_location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Return Trip Block (if applicable) */}
              {booking.with_return && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-lime-800 flex items-center gap-1.5">
                        <Route className="w-3.5 h-3.5 text-lime-600" />
                        Return Journey Schedule
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {booking.return_date ? formatDateUK(booking.return_date) : "N/A"} •{" "}
                        {booking.return_time || "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>From:</strong> {booking.drop_off_location} →{" "}
                      <strong>To:</strong> {booking.pickup_location}
                    </p>
                  </div>
                </div>
              )}

              {/* Integrated Flight Details Bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-200/70">
                    <Plane className="w-4 h-4" />
                  </div>
                  {booking.flight_no || booking.arriving_from ? (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      {booking.flight_no && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Flight Number
                          </span>
                          <span className="font-bold text-slate-950 text-sm">
                            {booking.flight_no}
                          </span>
                        </div>
                      )}
                      {booking.arriving_from && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold block">
                            Arriving From
                          </span>
                          <span className="font-semibold text-slate-800 text-sm">
                            {booking.arriving_from}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No airport flight number attached to this booking
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setEditDialogOpen(true)}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                >
                  {booking.flight_no || booking.arriving_from ? "Edit Flight" : "+ Add Flight #"}
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: PASSENGER, CAPACITY, VEHICLE & INSTRUCTIONS */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-lime-600" />
                Passenger & Vehicle Specifications
              </h2>
              <button
                type="button"
                onClick={() => setEditDialogOpen(true)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Edit Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Passenger Contact */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Lead Passenger
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-lime-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {passengerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-base text-slate-950 truncate">
                      {passengerName}
                    </p>
                    <p className="text-xs text-slate-500">Primary Contact</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Mobile:
                    </span>
                    {booking.phone ? (
                      <a
                        href={`tel:${booking.phone}`}
                        className="font-semibold text-slate-900 hover:text-lime-700"
                      >
                        {booking.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email:
                    </span>
                    {booking.email ? (
                      <span className="font-medium text-slate-900 truncate max-w-[190px]">
                        {booking.email}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Capacity & Vehicle Class */}
              <div className="space-y-3">
                {/* 3 Compact Capacity Pills */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl border border-slate-200/80 bg-white text-center">
                    <Users className="w-4 h-4 text-lime-600 mx-auto mb-1" />
                    <span className="text-lg font-black text-slate-950 block leading-none">
                      {booking.no_passengers ?? 1}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                      Passengers
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200/80 bg-white text-center">
                    <Luggage className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                    <span className="text-lg font-black text-slate-950 block leading-none">
                      {booking.no_laguage ?? 0}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                      Luggage
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200/80 bg-white text-center">
                    <Briefcase className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                    <span className="text-lg font-black text-slate-950 block leading-none">
                      {booking.no_hand_laguage ?? 0}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                      Handbags
                    </span>
                  </div>
                </div>

                {/* Vehicle Box */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {booking.vehicle?.imageUrl ? (
                      <img
                        src={booking.vehicle.imageUrl}
                        alt={booking.vehicle.name}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-900 text-lime-400 flex items-center justify-center shrink-0">
                        <Car className="w-4.5 h-4.5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Assigned Vehicle Class
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-slate-950 truncate">
                        {booking.vehicle?.name || booking.vehicle_type || "Standard Transfer"}
                      </p>
                      {booking.vehicle?.type && (
                        <span className="text-[11px] text-slate-500">
                          {capitalizeFirstLetter(booking.vehicle.type)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Driver / Special Instructions (Single unified block) */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Driver & Special Instructions
                </span>
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(true)}
                  className="text-xs font-semibold text-amber-700 hover:underline"
                >
                  {instructionsText ? "Edit Notes" : "+ Add Notes"}
                </button>
              </div>
              {instructionsText ? (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                  {instructionsText}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No special instructions or driver notes recorded for this journey.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS): FINANCIALS, DRIVER & SUPPLIER */}
        <div className="lg:col-span-4 space-y-5">
          {/* CARD A: FINANCIAL SUMMARY & MARGIN */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-lime-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Financial Summary
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  netProfit >= 0
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {marginPct.toFixed(1)}% Margin
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Customer Total Fare</span>
                <span className="text-base font-black text-white font-mono">
                  £{customerTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Driver Payout Cost</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  £{driverPay.toFixed(2)}
                </span>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-200">Net Profit / Loss</span>
                <span
                  className={`text-lg font-black font-mono ${
                    netProfit >= 0 ? "text-lime-400" : "text-rose-400"
                  }`}
                >
                  {netProfit < 0 ? "-" : ""}£{Math.abs(netProfit).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* CARD B: ASSIGNED DRIVER & WHATSAPP DISPATCH */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Assigned Driver
              </span>
              <button
                type="button"
                onClick={() => setAssignDialogOpen(true)}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                {booking.driver ? "Change Driver" : "Assign"}
              </button>
            </div>

            {booking.driver ? (
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  {booking.driver.photo_url ? (
                    <img
                      src={booking.driver.photo_url}
                      alt={booking.driver.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0">
                      {booking.driver.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-950 truncate">
                      {booking.driver.name}
                    </p>
                    <p className="text-xs text-slate-500">{booking.driver.phone}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-900 font-medium">Agreed Driver Pay:</span>
                  <span className="font-mono font-bold text-emerald-950 text-sm">
                    £{driverPay.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={handlePushToDriver}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Push Journey to WhatsApp
                </Button>
              </div>
            ) : (
              <div className="py-4 text-center space-y-2.5">
                <p className="text-xs text-slate-500">
                  No driver has been allocated to this journey yet.
                </p>
                <Button
                  size="sm"
                  onClick={() => setAssignDialogOpen(true)}
                  className="w-full bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold h-9"
                >
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  Assign Driver Now
                </Button>
              </div>
            )}
          </div>

          {/* CARD C: SOURCE & SUPPLIER DETAILS */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                Booking Source
              </span>
              <button
                type="button"
                onClick={() => setEditDialogOpen(true)}
                className="text-xs font-semibold text-purple-700 hover:underline"
              >
                Edit
              </button>
            </div>

            {isWebsite ? (
              <div className="flex items-center gap-2.5 p-3 bg-blue-50/70 text-blue-950 rounded-xl border border-blue-200/80 text-xs">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold">Website Direct</p>
                  <p className="text-[11px] text-blue-700">Booked online via website</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Partner / Supplier
                  </span>
                  <p className="font-bold text-slate-950 text-sm mt-0.5">
                    {booking.supplier?.name || "Offline Direct"}
                  </p>
                  {booking.supplier?.support_email && (
                    <p className="text-slate-500 text-[11px]">{booking.supplier.support_email}</p>
                  )}
                  {booking.supplier?.phone && (
                    <p className="text-slate-500 text-[11px]">{booking.supplier.phone}</p>
                  )}
                </div>

                {booking.supplier_reference && (
                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-purple-700 block">
                        Supplier Ref #
                      </span>
                      <span className="font-mono font-bold text-purple-950 text-xs truncate block">
                        {booking.supplier_reference}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={copySupplierRef}
                      className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 shrink-0"
                      title="Copy Supplier Reference"
                    >
                      {copiedRef ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Booking #{booking.id?.slice(0, 5).toUpperCase()}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-sm text-gray-600">
              <p>
                Are you sure you want to permanently delete this booking for{" "}
                <strong>{passengerName}</strong>?
              </p>
              <p className="text-red-600 font-medium">
                This will delete this job and any associated add-ons from your database. This action
                cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Driver Dialog */}
      <AssignDriverDialog
        open={assignDialogOpen}
        setOpen={setAssignDialogOpen}
        booking={booking}
        onSuccess={() => {
          router.refresh()
        }}
      />

      {/* Edit Booking Dialog */}
      <EditBookingDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        booking={booking}
        onUpdated={(updated) => {
          setBooking(updated)
          router.refresh()
        }}
      />
    </div>
  )
}
