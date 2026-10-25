"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { Booking } from "@/types/booking"
import { getBookingByID } from "./action"
import { toast } from "sonner"
import { BookingVehicleTable } from "@/components/admin/booking/vehicle-table"
import { BookingDetailsTable } from "@/components/admin/booking/booking-details-table"
import Loading from "./loading"
import { BookingPaymentTable } from "@/components/admin/booking/booking-payment-table"

export const dynamic = "force-dynamic"
export default function BookingDetailsPage() {
  const [booking, setBooking] = useState<Booking>({});
  const [loading, setLoading] = useState<Boolean>(false)
  const params = useParams()
  const bookingId = params.id as string

 const onBookingStatusChange = ({
  status,
  date,
  time,
}: {
  status: Booking["status"];
  date: string;
  time: string;
}) => {
  setBooking((prev) => ({
    ...prev,
    status,
    date,
    time,
  }));
};

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true)
        const result = await getBookingByID(bookingId);
        console.log('Booking details:', result);
        if (result.error) {
          throw new Error(typeof result.error === "string" ? result.error : (result.error as any)?.message || "Failed to fetch booking")
        }
        setBooking(result.data);
      } catch (error) {
        console.log('Error in fetching booking', error);
        toast.error(`${error}`)
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId])

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }
 
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto ">
        <BookingDetailsTable booking={booking} onBookingStatusChange={onBookingStatusChange} />
        {
          booking.payments && booking.payments.length > 0 && (
            <BookingPaymentTable payment={booking.payments[0]} />
          )
        }
        {booking.vehicle && (
          <BookingVehicleTable vehicle={booking.vehicle} />
        )}
      </main>
    </div>
  )
}
