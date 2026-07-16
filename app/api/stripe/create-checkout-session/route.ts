import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { booking, origin } = await request.json();

    if (!booking || !booking.total_amount) {
      return NextResponse.json(
        { error: 'Invalid booking details provided' },
        { status: 400 }
      );
    }

    const addonPrice = booking.add_on?.price || 0;
    const finalAmount = booking.total_amount + addonPrice;
    const amountInPence = Math.round(finalAmount * 100);

    const redirectOrigin = origin || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'LuxeLyne Transfers Private Hire Booking',
              description: `Transfer from ${booking.pickup_location} to ${booking.drop_off_location}`,
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${redirectOrigin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectOrigin}/booking-cancel`,
      metadata: {
        bookingId: booking.id || '',
        passengerName: `${booking.first_name || ''} ${booking.last_name || ''}`,
        email: booking.email || '',
        phone: booking.phone || '',
        pickup: booking.pickup_location || '',
        dropoff: booking.drop_off_location || '',
        dateTime: `${booking.date || ''} ${booking.time || ''}`,
      },
      payment_intent_data: {
        metadata: {
          bookingId: booking.id || '',
          passengerName: `${booking.first_name || ''} ${booking.last_name || ''}`,
          email: booking.email || '',
          phone: booking.phone || '',
          pickup: booking.pickup_location || '',
          dropoff: booking.drop_off_location || '',
          dateTime: `${booking.date || ''} ${booking.time || ''}`,
        }
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Create Checkout Session Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create Stripe Checkout Session',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
