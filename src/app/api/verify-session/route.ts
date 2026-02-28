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
  const { sessionId } = await req.json();

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        jobId: session.metadata?.jobId,
        plan: session.metadata?.plan,
      });
    } else {
      return NextResponse.json({ error: 'Payment not completed' });
    }
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } });
  }
}
