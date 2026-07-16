import { NextResponse } from "next/server";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import client from "@/lib/paypal/config";
import { UpdateBookingStatus } from "@/lib/update-booking/update-booking";
import { sendEmail } from "@/lib/send-email";
export async function POST(request: Request) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Create capture request
    const captureRequest =
      new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    captureRequest.requestBody({});

    // Execute the capture
    const capture = await client().execute(captureRequest);
    const captureResult = capture.result;

    // Check if payment was successful
    if (captureResult.status === "COMPLETED") {
      // Extract payment details
      const paymentDetails = {
        orderID: captureResult.id,
        payerID: captureResult.payer.payer_id,
        payerEmail: captureResult.payer.email_address,
        payerName: `${captureResult.payer.name.given_name} ${captureResult.payer.name.surname}`,
        amount:
          captureResult.purchase_units[0].payments.captures[0].amount.value,
        currency:
          captureResult.purchase_units[0].payments.captures[0].amount
            .currency_code,
        transactionId:
          captureResult.purchase_units[0].payments.captures[0].id,
        status: captureResult.status,
        captureTime:
          captureResult.purchase_units[0].payments.captures[0].create_time,
        customId: captureResult.purchase_units[0].custom_id,
        referenceId: captureResult.purchase_units[0].reference_id,
      };

      // Extract booking/payment info
      const booking_id = paymentDetails.referenceId;
      const payment_status = paymentDetails.status;
      const payment_id = paymentDetails.transactionId;
      const booking_status = "accepted";

      // Update booking status in DB
      const { data: booking, error: updatePaymentError } = await UpdateBookingStatus({
        booking_id,
        payment_id,
        payment_status,
        booking_status,
      });

      if (updatePaymentError) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update booking status",
            details: updatePaymentError,
          },
          { status: 500 }
        );
      }

      const adminEmail = {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        subject: "New booking recieved",
        message: `
      New Email recieved from customer ${booking?.email} \n
      Pickup:${booking?.pickup_location} \n
      DropOff:${booking?.drop_off_location} \n
      Date:${booking?.date} \n
      Time:${booking?.time} \n
      Total price:£${booking?.total_amount} \n
      `}

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

    Thank you for choosing our service. We look forward to serving you.

    Best regards,
    Team Luxelyne Transfers
  `
      }
      const { error: adminEmailError } = await sendEmail(adminEmail);

      if (adminEmailError) {
        throw adminEmailError
      }
      const { error: customerEmailError } = await sendEmail(customerEmail);

      if (customerEmailError) {
        throw customerEmailError
      }



      return NextResponse.json({
        success: true,
        paymentDetails,
        message: "Payment captured and booking updated successfully",
      });
    } else {
      // Payment was not completed
      return NextResponse.json(
        {
          error: "Payment not completed",
          status: captureResult.status,
          details: captureResult,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("PayPal Capture Order Error:", error);

    if (error.statusCode) {
      let errorDetails;
      try {
        errorDetails = JSON.parse(error.message);
      } catch {
        errorDetails = { message: error.message };
      }

      return NextResponse.json(
        {
          error: "PayPal capture failed",
          details: errorDetails.details || errorDetails.message,
          statusCode: error.statusCode,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to capture PayPal payment",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
