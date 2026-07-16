import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const booking = await request.json();

    if (!booking || !booking.total_amount) {
      return NextResponse.json(
        { error: 'Invalid booking data' },
        { status: 400 }
      );
    }

    const addonPrice = booking.add_on?.price || 0;
    const finalAmount = booking.total_amount + addonPrice;
    const amountInPence = Math.round(finalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: 'gbp',
      description: `Transfer from ${booking.pickup_location} to ${booking.drop_off_location}`,
      metadata: {
        bookingId: booking.id || '',
        passengerName: `${booking.first_name || ''} ${booking.last_name || ''}`,
        email: booking.email || '',
        phone: booking.phone || '',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      amount: finalAmount,
    });
  } catch (error: any) {
    console.error('Stripe Create Payment Intent Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create Stripe Payment Intent',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
