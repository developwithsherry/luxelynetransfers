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
} from "lucide-react"
import { formatDateUK } from "@/lib/format-util"
import { ChangeBookingStatusDialog } from "./change-booking-status-dialog"
import { AssignDriverDialog } from "./assign-driver-dialog"
import { EditBookingDialog } from "./edit-booking-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

  const getJobStatusBadge = (status?: string | null) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "bg-lime-500 text-white"
      case "covered":
        return "bg-blue-600 text-white"
      case "pob":
        return "bg-amber-500 text-white"
      case "completed":
        return "bg-emerald-600 text-white"
      case "complaint":
        return "bg-rose-600 text-white"
      case "cancelled":
        return "bg-gray-800 text-white"
      case "pending":
      default:
        return "bg-lime-400 text-slate-950"
    }
  }

  const getPaymentStatusBadge = (status?: string | null) => {
    switch ((status || "pending").toLowerCase()) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-300"
      case "paid_to_driver":
        return "bg-purple-50 text-purple-700 border-purple-300"
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-300"
    }
  }

  const formatStatus = (status?: string | null) => {
    if (!status) return "Pending"
    if (status.toLowerCase() === "pob") return "POB"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatPaymentStatus = (status?: string | null) => {
    if (!status) return "Pending"
    if (status === "paid_to_driver") return "Paid to Driver"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Parse stops if they exist
  let stops: string[] = []
  if (booking.stops && typeof booking.stops === "object" && booking.stops.locations) {
    stops = booking.stops.locations
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

  return (
    <div className="space-y-8 p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-lime-200 pb-6 gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin/bookings"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-lime-50 hover:bg-lime-100 transition-all duration-200 border border-lime-200"
          >
            <ArrowLeft className="h-5 w-5 text-lime-700" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-2">
                <h1 className="font-bold text-2xl text-black tracking-tight">#{booking.id?.slice(0, 5).toUpperCase()}</h1>
                <span className="text-[10px] font-semibold text-lime-800 bg-lime-100 px-2 py-0.5 rounded-full border border-lime-300">
                  System Reference
                </span>
              </div>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full ${getJobStatusBadge(booking.status)}`}
              >
                {formatStatus(booking.status)}
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${getPaymentStatusBadge(booking.payment_status)}`}
              >
                {formatPaymentStatus(booking.payment_status)}
              </span>
              {booking.with_return && (
                <span className="bg-lime-100 text-lime-800 border border-lime-300 px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1">
                  <Route className="w-3.5 h-3.5" />
                  Return Trip
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Created: {booking.created_at ? formatDateUK(booking.created_at) : "N/A"} • Source:{" "}
              {isWebsite ? "Website" : booking.supplier?.name || "Offline Direct"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <Button
            type="button"
            onClick={handlePushToDriver}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 shadow-xs"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Push to Driver
          </Button>

          <Button
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
            className="border-gray-300 hover:bg-gray-100 text-xs font-semibold h-9"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1 text-gray-600" />
            Edit Booking
          </Button>

          <Button
            onClick={() => setAssignDialogOpen(true)}
            className="bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-semibold h-9"
          >
            {booking.driver ? (
              <>
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Change Driver
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 mr-1" />
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
            className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-semibold h-9"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5 mr-1" />
            )}
            Delete
          </Button>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Source / Supplier Card */}
        <Card className="border-purple-200 shadow-sm bg-purple-50/20">
          <CardHeader className="pb-3 bg-purple-50/70 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-sm font-bold text-purple-950">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                Supplier & Source
              </span>
              <button
                type="button"
                onClick={() => setEditDialogOpen(true)}
                className="text-xs text-purple-700 hover:underline font-normal"
              >
                Edit
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            {isWebsite ? (
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="font-bold">Website</p>
                  <p className="text-[11px] text-blue-700">Online customer booking</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {booking.supplier?.name || "Direct Offline"}
                  </p>
                  {booking.supplier?.support_email && (
                    <p className="text-gray-500 text-[11px]">{booking.supplier.support_email}</p>
                  )}
                  {booking.supplier?.phone && (
                    <p className="text-gray-500 text-[11px]">{booking.supplier.phone}</p>
                  )}
                </div>
                <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-600">Supplier Reference:</span>
                  {booking.supplier_reference ? (
                    <span className="text-xs text-purple-900 font-mono font-bold bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                      {booking.supplier_reference}
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">None</span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Driver Card */}
        <Card className="border-emerald-200 shadow-sm bg-emerald-50/20">
          <CardHeader className="pb-3 bg-emerald-50/70 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-sm font-bold text-emerald-950">
              <span className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                Assigned Driver
              </span>
              <button
                type="button"
                onClick={() => setAssignDialogOpen(true)}
                className="text-xs text-emerald-700 hover:underline font-normal"
              >
                {booking.driver ? "Change" : "Assign"}
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs">
            {booking.driver ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  {booking.driver.photo_url ? (
                    <img
                      src={booking.driver.photo_url}
                      alt={booking.driver.name}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs">
                      {booking.driver.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 truncate">{booking.driver.name}</p>
                    <p className="text-gray-500 text-[11px]">{booking.driver.phone}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-emerald-100">
                  <span className="font-semibold text-emerald-900">
                    Pay: £{Number(booking.driver_price || 0).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={handlePushToDriver}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded transition cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3 text-emerald-600" />
                    WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 space-y-1">
                <p className="text-gray-400">No driver assigned</p>
                <Button
                  size="sm"
                  onClick={() => setAssignDialogOpen(true)}
                  className="bg-lime-400 hover:bg-lime-500 text-black text-xs font-semibold h-7"
                >
                  <UserPlus className="w-3 h-3 mr-1" />
                  Assign Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flight Information Card */}
        <Card className="border-sky-200 shadow-sm bg-sky-50/20">
          <CardHeader className="pb-3 bg-sky-50/70 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-sm font-bold text-sky-950">
              <span className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-sky-600" />
                Flight Details
              </span>
              <button
                type="button"
                onClick={() => setEditDialogOpen(true)}
                className="text-xs text-sky-700 hover:underline font-normal"
              >
                Edit
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-1.5">
            {booking.flight_no || booking.arriving_from ? (
              <>
                {booking.flight_no && (
                  <div>
                    <span className="text-gray-400 text-[10px] block">Flight #</span>
                    <span className="font-bold text-gray-900 text-sm">{booking.flight_no}</span>
                  </div>
                )}
                {booking.arriving_from && (
                  <div>
                    <span className="text-gray-400 text-[10px] block">Arriving From</span>
                    <span className="font-medium text-gray-800">{booking.arriving_from}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-2 text-gray-400">
                <p>No flight details</p>
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(true)}
                  className="text-sky-700 hover:underline text-[11px]"
                >
                  + Add Flight #
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="border-lime-200 shadow-sm bg-lime-50/20">
          <CardHeader className="pb-3 bg-lime-50/70 rounded-t-lg">
            <CardTitle className="text-sm font-bold text-lime-950 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-lime-600" />
              Price & Margin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Total:</span>
              <span className="font-bold text-black text-sm">
                £{Number(booking.final_amount || booking.total_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>Driver Pay:</span>
              <span className="font-semibold text-emerald-700">
                £{Number(booking.driver_price || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-lime-200">
              <span className="font-semibold text-gray-900">Profit:</span>
              <span className="font-bold text-lime-800 text-sm">
                £{(
                  Number(booking.final_amount || booking.total_amount || 0) -
                  Number(booking.driver_price || 0)
                ).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Driver Instructions Banner (if any) */}
      {(booking.driver_instructions || booking.intructions) && (
        <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
          <CardHeader className="pb-2 bg-amber-50/70 rounded-t-lg">
            <CardTitle className="text-sm font-bold text-amber-950 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-600" />
                Driver Instructions
              </span>
              <button
                type="button"
                onClick={() => setEditDialogOpen(true)}
                className="text-xs text-amber-800 hover:underline font-normal"
              >
                Edit
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-amber-950 leading-relaxed font-medium">
              {booking.driver_instructions || booking.intructions}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Customer Information */}
        <Card className="lg:col-span-1 border-lime-200 shadow-lg">
          <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <div className="p-2 bg-lime-500 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4 p-4 bg-black rounded-xl">
              <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">
                  {booking.first_name} {booking.last_name}
                </p>
                <p className="text-sm text-lime-400">Primary Contact</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg border border-lime-200">
                <Mail className="h-5 w-5 text-lime-600" />
                <span className="text-black font-medium">{booking.email}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border border-lime-200">
                <Phone className="h-5 w-5 text-lime-600" />
                <span className="text-black font-medium">{booking.phone}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg border border-lime-200">
                <Calendar className="h-5 w-5 text-lime-600" />
                <span className="text-black font-medium">
                  {booking.created_at ? formatDateUK(booking.created_at) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card className="lg:col-span-2 border-lime-200 shadow-lg">
          <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <div className="p-2 bg-lime-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-lime-500 rounded-xl text-white">
                <Users className="h-8 w-8 mx-auto mb-3" />
                <p className="text-3xl font-bold">{booking.no_passengers}</p>
                <p className="text-sm font-medium opacity-90">Passengers</p>
              </div>
              <div className="text-center p-6 bg-lime-600 rounded-xl text-white">
                <Luggage className="h-8 w-8 mx-auto mb-3" />
                <p className="text-3xl font-bold">{booking.no_laguage}</p>
                <p className="text-sm font-medium opacity-90">Luggage</p>
              </div>
              <div className="text-center p-6 bg-lime-700 rounded-xl text-white">
                <Briefcase className="h-8 w-8 mx-auto mb-3" />
                <p className="text-3xl font-bold">{booking.no_hand_laguage}</p>
                <p className="text-sm font-medium opacity-90">Hand Luggage</p>
              </div>
              <div className="text-center p-6 bg-black rounded-xl text-white">
                <CreditCard className="h-8 w-8 mx-auto mb-3" />
                <p className="text-3xl font-bold">£{booking.final_amount?.toFixed(2) || "0.00"}</p>
                <p className="text-sm font-medium text-lime-400">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flight Information */}
      {(booking.flight_no || booking.arriving_from) && (
        <Card className="border-lime-200 shadow-lg">
          <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <div className="p-2 bg-lime-500 rounded-lg">
                <Plane className="h-5 w-5 text-white" />
              </div>
              Flight Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {booking.flight_no && (
                <div className="flex items-center gap-4 p-6 bg-lime-500 rounded-xl text-white">
                  <Plane className="h-6 w-6" />
                  <div>
                    <p className="text-sm font-medium opacity-90">Flight Number</p>
                    <p className="text-2xl font-bold">{booking.flight_no}</p>
                  </div>
                </div>
              )}
              {booking.arriving_from && (
                <div className="flex items-center gap-4 p-6 bg-black rounded-xl text-white">
                  <MapPin className="h-6 w-6" />
                  <div>
                    <p className="text-sm font-medium text-lime-400">Arriving From</p>
                    <p className="text-2xl font-bold">{booking.arriving_from}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journey Details */}
      <Card className="border-lime-200 shadow-lg">
        <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
            <div className="p-2 bg-lime-500 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            {booking.with_return ? "Outbound Journey" : "Journey Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 bg-lime-500 rounded-xl text-white">
              <Clock className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium opacity-90">Date & Time</p>
                <p className="text-xl font-bold">
                  {booking.date ? formatDateUK(booking.date) : "N/A"} at {booking.time || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-black rounded-xl text-white">
              <Route className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-lime-400">Distance</p>
                <p className="text-xl font-bold">
                  {booking.total_distance ? booking.total_distance + " miles" : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-6 p-6 border-l-4 border-lime-500 bg-lime-50 rounded-r-xl">
              <div className="w-4 h-4 bg-lime-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Pickup Location</p>
                <p className="text-black mt-2 text-lg">{booking.pickup_location}</p>
              </div>
            </div>

            {stops.length > 0 && (
              <div className="space-y-3">
                {stops.map((stop, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 p-6 border-l-4 border-lime-600 bg-lime-100 rounded-r-xl"
                  >
                    <div className="w-4 h-4 bg-lime-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-bold text-lime-800 uppercase tracking-wide">Stop {index + 1}</p>
                      <p className="text-black mt-2 text-lg">{stop}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-6 p-6 border-l-4 border-black bg-gray-50 rounded-r-xl">
              <div className="w-4 h-4 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-black uppercase tracking-wide">Drop-off Location</p>
                <p className="text-black mt-2 text-lg">{booking.drop_off_location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Journey Details */}
      {booking.with_return && (
        <Card className="border-lime-200 shadow-lg">
          <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <div className="p-2 bg-lime-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              Return Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-6 bg-lime-600 rounded-xl text-white">
                <Clock className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium opacity-90">Return Date & Time</p>
                  <p className="text-xl font-bold">
                    {booking.return_date ? formatDateUK(booking.return_date) : "N/A"} at {booking.return_time || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-black rounded-xl text-white">
                <Route className="h-6 w-6" />
                <div>
                  <p className="text-sm font-medium text-lime-400">Return Distance</p>
                  <p className="text-xl font-bold">
                    {booking.total_distance ? booking.total_distance + " miles" : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-6 p-6 border-l-4 border-lime-500 bg-lime-50 rounded-r-xl">
                <div className="w-4 h-4 bg-lime-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-lime-700 uppercase tracking-wide">Pickup Location (Return)</p>
                  <p className="text-black mt-2 text-lg">{booking.drop_off_location}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 p-6 border-l-4 border-black bg-gray-50 rounded-r-xl">
                <div className="w-4 h-4 bg-black rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-black uppercase tracking-wide">Drop-off Location (Return)</p>
                  <p className="text-black mt-2 text-lg">{booking.pickup_location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle and Payment Information */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Vehicle Information */}
        {booking.vehicle && (
          <Card className="border-lime-200 shadow-lg">
            <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
                <div className="p-2 bg-lime-500 rounded-lg">
                  <Car className="h-5 w-5 text-white" />
                </div>
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-6 p-6 bg-black rounded-xl">
                {booking.vehicle.imageUrl && (
                  <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-lg border-2 border-lime-500">
                    <img
                      src={booking.vehicle.imageUrl || "/placeholder.svg"}
                      alt={booking.vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-bold text-white text-xl">{booking.vehicle?.name || "Vehicle"}</p>
                  <p className="text-lime-400 font-medium">{capitalizeFirstLetter(booking.vehicle?.type || "")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Information */}
        <Card className="border-lime-200 shadow-lg">
          <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <div className="p-2 bg-lime-500 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between p-6 bg-lime-500 rounded-xl text-white">
              <div>
                <p className="text-sm font-medium opacity-90">Total Amount</p>
                <p className="text-3xl font-bold">£{booking.final_amount?.toFixed(2) || "0.00"}</p>
                {booking.with_return && <p className="text-xs opacity-75 mt-1">Return trip included</p>}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-lime-200 rounded-lg">
              <span className="text-lg font-bold text-black">Payment Status</span>
              <Badge
                variant="outline"
                className={`px-4 py-2 text-sm font-bold rounded-full ${getPaymentStatusBadge(booking.payment_status || "pending")}`}
              >
                {formatPaymentStatus(booking.payment_status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      {booking.intructions && (
        <Card className="border-lime-200 shadow-lg">
          <CardHeader className="pb-6 bg-lime-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
              <div className="p-2 bg-lime-500 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Special Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="p-6 bg-black rounded-xl">
              <p className="text-white text-lg leading-relaxed">{booking.intructions}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Delete Booking #{booking.id?.slice(0, 5)}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 text-sm text-gray-600">
              <p>
                Are you sure you want to permanently delete this booking for{" "}
                <strong>
                  {booking.first_name} {booking.last_name}
                </strong>
                ?
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
