import { NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
  });
}

export async function POST(req: Request) {
  try {
    const { jobId, plan, price } = await req.json();

    const defaultPrices: Record<string, number> = {
      basic: 9999,
      pro: 29999,
      recruiter: 50000,
    };

    if (!defaultPrices[plan]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
    }

    const finalPrice =
      parsedPrice * 100 <= defaultPrices[plan]
        ? Math.round(parsedPrice * 100)
        : defaultPrices[plan];

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Job Posting - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/job-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/job-cancel`,
      metadata: {
        jobId,
        plan,
        discountedPrice: (finalPrice / 100).toFixed(2),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
