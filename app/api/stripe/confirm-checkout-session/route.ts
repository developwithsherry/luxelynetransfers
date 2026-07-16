import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { UpdateBookingStatus } from "@/lib/update-booking/update-booking";
import { sendEmail } from "@/lib/send-email";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const bookingId = session.metadata?.bookingId;
      const paymentId = typeof session.payment_intent === "string" 
        ? session.payment_intent 
        : session.payment_intent?.id || session.id;

      if (!bookingId) {
        return NextResponse.json(
          { error: "Booking ID is missing from session metadata" },
          { status: 400 }
        );
      }

      // Update booking status in database
      const { data: booking, error: updatePaymentError } = await UpdateBookingStatus({
        booking_id: bookingId,
        payment_id: paymentId,
        payment_status: "paid",
        booking_status: "accepted",
      });

      if (updatePaymentError) {
        console.error("Database update error:", updatePaymentError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update booking status",
            details: updatePaymentError,
          },
          { status: 500 }
        );
      }

      // Send emails
      const adminEmail = {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "official@luxelynetransfers.com",
        subject: "New booking received",
        message: `
      New booking received from customer ${booking?.email} \n
      Pickup: ${booking?.pickup_location} \n
      Drop-off: ${booking?.drop_off_location} \n
      Date: ${booking?.date} \n
      Time: ${booking?.time} \n
      Total price: £${booking?.total_amount} \n
      Stripe Transaction ID: ${paymentId}
      `,
      };

      const customerEmail = {
        email: booking?.email,
        subject: `Booking Confirmation`,
        message: `
    Dear ${booking?.first_name || 'Customer'},

    We are pleased to confirm your booking.

    Booking Details:
    - Pickup Location: ${booking?.pickup_location}
    - Drop-off Location: ${booking?.drop_off_location}
    - Date: ${booking?.date}
    - Time: ${booking?.time}
    - Total Amount: £${booking?.total_amount}

    Thank you for choosing our service. We look forward to serving you.

    Best regards,
    Team Luxelyne Transfers
  `,
      };

      try {
        await sendEmail(adminEmail);
        await sendEmail(customerEmail);
      } catch (emailErr) {
        console.error("Error sending notification emails:", emailErr);
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified and booking updated successfully",
        booking,
      });
    } else {
      return NextResponse.json(
        {
          error: "Checkout session has not been paid yet",
          paymentStatus: session.payment_status,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Stripe Session Confirmation Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to confirm Stripe Checkout Session",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
