import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { UpdateBookingStatus } from "@/lib/update-booking/update-booking";
import { sendEmail } from "@/lib/send-email";

export async function POST(request: Request) {
  try {
    const { paymentIntentId, bookingId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve the payment intent from Stripe to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Extract details
      const transactionId = paymentIntent.id;
      const payment_status = paymentIntent.status;
      const actualBookingId = bookingId || paymentIntent.metadata.bookingId;

      if (!actualBookingId) {
        return NextResponse.json(
          { error: "Booking ID is missing" },
          { status: 400 }
        );
      }

      // Update booking status in database
      const { data: booking, error: updatePaymentError } = await UpdateBookingStatus({
        booking_id: actualBookingId,
        payment_id: transactionId,
        payment_status: payment_status,
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
      Transaction ID: ${transactionId}
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
          error: "Payment not completed successfully",
          status: paymentIntent.status,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Stripe Confirm Payment Route Error:", error);
    return NextResponse.json(
      {
        error: "Failed to confirm Stripe payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
