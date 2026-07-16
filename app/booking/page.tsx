"use client"
export const dynamic="force-dynamic";

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Check, Loader } from "lucide-react"
import { BookingProvider, useBooking } from "@/context/booking-context"
import { VehicleProvider, useVehicles } from "@/context/vehicle-context"
import { BookingHeader } from "@/components/booking-details"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { createBooking } from "@/lib/place-booking"
import { toast } from "sonner"
import { Booking } from "@/types/booking"
import { useRouter } from "next/navigation";
import { Checkout } from "@/components/payment/checkout-button";
import { useAddons } from "@/context/addon-context";
function BookingForm() {
  const { booking, updateBooking } = useBooking()
  const {selectedAddon}=useAddons()
  const { selectedVehicle, fares } = useVehicles()
  const [loading, setLoading] = useState<boolean>(false);
  const [checkoutOpen,setCheckoutOpen]=useState<boolean>(false);
  const router=useRouter()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    no_passengers: 1,
    no_laguage: 0,
    no_hand_laguage: 0,
    flight_no: "",
    arriving_from: "",
    intructions: "",
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    updateBooking({ [field]: value })
  }

  const handleSubmit = async () => {
    if(!selectedVehicle){
       toast.error("Please select a vehicle first")
    }
    try {
      setLoading(true)
      const completeBooking: Booking = {
        ...formData,
        pickup_location: booking.pickup_location,
        drop_off_location: booking.drop_off_location,
        date: booking.date,
        time: booking.time, // keep main time
        return_time: booking.return_time, // ✅ fixed from booking.time
        with_return: booking.with_return,
        return_date: booking.return_date,
        stops: typeof booking.stops === "string" ? JSON.parse(booking.stops) : booking.stops,
        total_amount: fares.get(selectedVehicle?.id?.toString() || "") ?? 0, // ✅ fallback to 0 if undefined
        total_distance: booking.total_distance,
        status: "pending",
        vehicle_id: selectedVehicle?.id,
        unit: "miles",
        payment_status: "pending",
        add_on:selectedAddon
      };

      console.log("booking", completeBooking)

      const { booking: newBooking, error } = await createBooking(completeBooking);

      if (error) {
        console.log("error in creating booking", error)
        throw new Error(`${error}`)
      }
      updateBooking(newBooking);

      // Create Stripe Checkout Session
      const sessionResponse = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking: newBooking,
          origin: window.location.origin,
        }),
      });

      if (!sessionResponse.ok) {
        const sessionError = await sessionResponse.json();
        throw new Error(sessionError.error || "Failed to create payment session");
      }

      const { url } = await sessionResponse.json();
      window.location.href = url;

    } catch (error) {
      toast.error(`Unable to place booking.${error}`)
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    if(!selectedVehicle){
       router.push("/")
    }
  },[selectedVehicle,router])

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete your booking</h1>
            <p className="text-muted-foreground">Fill the details and complete your booking</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 py-10">
             <BookingHeader isBookingPage={true} />
            {/* Left Column - Booking Form */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Passenger Information</CardTitle>
                <p className="text-sm text-muted-foreground">Please provide your contact details</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Passenger and Luggage Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passengers">No. of Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="8"
                      value={formData.no_passengers}
                      onChange={(e) => handleInputChange("no_passengers", Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Max 8 passengers</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="luggage">No. of Luggage</Label>
                    <Input
                      id="luggage"
                      type="number"
                      min="0"
                      max="8"
                      value={formData.no_laguage}
                      onChange={(e) => handleInputChange("no_laguage", Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Max 8 suitcases</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="handLuggage">No. of Hand Luggage</Label>
                    <Input
                      id="handLuggage"
                      type="number"
                      min="0"
                      value={formData.no_hand_laguage}
                      onChange={(e) => handleInputChange("no_hand_laguage", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {/* Flight Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flightNumber">Flight Number</Label>
                    <Input
                      id="flightNumber"
                      value={formData.flight_no}
                      onChange={(e) => handleInputChange("flight_no", e.target.value)}
                      placeholder="BA215"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivingFrom">Arriving From</Label>
                    <Input
                      id="arrivingFrom"
                      value={formData.arriving_from}
                      onChange={(e) => handleInputChange("arriving_from", e.target.value)}
                      placeholder="USA"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    value={formData.intructions}
                    onChange={(e) => handleInputChange("intructions", e.target.value)}
                    placeholder="Enter any special instructions, e.g. pickup notes"
                    rows={4}
                  />
                </div>

          
                

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  className="hover:bg-lime-400 text-black w-full"
                  disabled={loading}
                >{loading ? <><Loader className="mr-2 animate-spin" />Loading...</> :
                  "Proceed to Payment"}
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
      <Footer />
    </>

  )
}

export default function BookingPage() {
  return (

    <BookingForm />

  )
}
