import { NextResponse } from 'next/server';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import client from '@/lib/paypal/config';

export async function POST(request) {
  try {
    console.log("in createor-order")
    // Get booking data from request body
    const booking = await request.json();
    console.log("booking id", booking)

    // Validate booking data
    if (!booking || !booking.total_amount) {
      return NextResponse.json(
        { error: 'Invalid booking data from api' },
        { status: 400 }
      );
    }

    // Create PayPal order request
    const orderRequest = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    orderRequest.prefer('return=representation');
    orderRequest.requestBody({
      intent: 'CAPTURE',
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking-cancel`,
        brand_name: 'LuxeLyne Transfers',
        locale: 'en-GB',
        landing_page: 'BILLING',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
      purchase_units: [
        {
          reference_id: booking.id || `booking-${Date.now()}`,
          description: `Transfer from ${booking.pickup_location} to ${booking.drop_off_location}`,
          custom_id: booking.booking_id || booking.id, // internal reference
          soft_descriptor: 'BOOKING',
          amount: {
            currency_code: 'GBP',
            value: booking.total_amount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'GBP',
                value: booking.total_amount.toFixed(2),
              },
              ...(booking.returnDiscount > 0 && {
                discount: {
                  currency_code: 'GBP',
                  value: booking.returnDiscount.toFixed(2),
                },
              }),
            },
          },
          items: [
            {
              name: 'Booking Service',
              description: `Passenger: ${booking.first_name} ${booking.last_name}, 
                        Date: ${new Date(booking.date).toLocaleString()}, 
                        Route: ${booking.pickup_location} → ${booking.drop_off_location}`,
              quantity: '1',
              unit_amount: {
                currency_code: 'GBP',
                value: booking.total_amount.toFixed(2),
              },
              category: 'DIGITAL_GOODS',
            },
          ],
          // Optional: add metadata about passenger/vehicle as invoice_id or note
          invoice_id: `INV-${booking.id}`,
          custom_id: booking.vehicle_id || booking.id,
        },
      ],
    });

    // Execute the order creation
    const order = await client().execute(orderRequest);


    return NextResponse.json({
      id: order.result.id,
      status: order.result.status,
      links: order.result.links
    });

  } catch (error) {
    console.error('PayPal Create Order Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create PayPal order',
        details: error.message
      },
      { status: 500 }
    );
  }
}