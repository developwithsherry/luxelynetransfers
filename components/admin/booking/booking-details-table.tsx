"use client"

import type { Booking } from "@/types/booking"
import Link from "next/link"
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
} from "lucide-react"
import { formatDateUK } from "@/lib/format-util"
import { ChangeBookingStatusDialog } from "./change-booking-status-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { capitalizeFirstLetter } from "@/lib/capatilze-firstletter"

interface Props {
  booking: Booking
  onBookingStatusChange: (status: "pending" | "confirmed" | "completed" | "cancelled") => void
}

export function BookingDetailsTable({ booking, onBookingStatusChange }: Props) {
  const { no_laguage, no_passengers, no_hand_laguage } = booking

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-lime-500 text-white border-lime-500"
      case "cancelled":
        return "bg-black text-white border-black"
      case "pending":
        return "bg-lime-400 text-black border-lime-400"
      case "completed":
        return "bg-lime-600 text-white border-lime-600"
      default:
        return "bg-white text-black border-black"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-lime-500 text-white border-lime-500"
      case "pending":
        return "bg-lime-400 text-black border-lime-400"
      default:
        return "bg-black text-white border-black"
    }
  }

  // Parse stops if they exist
  let stops: string[] = []
  if (booking.stops && typeof booking.stops === "object" && booking.stops.locations) {
    stops = booking.stops.locations
  }

  return (
    <div className="space-y-8 p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-lime-200 pb-6">
        <div className="flex items-center space-x-6">
          <Link
            href="/admin/bookings"
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-lime-50 hover:bg-lime-100 transition-all duration-200 border border-lime-200"
          >
            <ArrowLeft className="h-5 w-5 text-lime-700" />
          </Link>
          <div className="flex items-center space-x-4">
            <h1 className=" font-bold text-xl text-black tracking-tight">#{booking.id?.slice(0, 5)}</h1>
            <Badge
              variant="outline"
              className={`px-4 py-2 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}
            >
              {booking?.status?.toUpperCase()}
            </Badge>
            {booking.with_return && (
              <Badge variant="outline" className="bg-lime-50 text-lime-700 border-lime-300 px-4 py-2 rounded-full">
                <Route className="w-4 h-4 mr-2" />
                RETURN TRIP
              </Badge>
            )}
          </div>
        </div>
        <ChangeBookingStatusDialog bookingId={booking.id} booking={booking} onStatusChange={onBookingStatusChange} />
      </div>

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
                  <p className="font-bold text-white text-xl">{booking.vehicle.name}</p>
                  <p className="text-lime-400 font-medium">{capitalizeFirstLetter(booking.vehicle.type)}</p>
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
                className={`px-4 py-2 text-sm font-bold rounded-full ${getPaymentStatusColor(booking.payment_status || "pending")}`}
              >
                {(booking.payment_status || "pending").toUpperCase()}
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
    </div>
  )
}
