import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';

// Stripe signature verification needs the Node runtime and the raw request body.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stripe webhook (snapshot payload style) for the CO-gm destination.
 *
 * The buy → download flow is fulfilled by the /download page (the buyer is
 * redirected there and the session is re-verified server-side), so this endpoint
 * is not on the critical path. Its job is to (a) acknowledge every event so the
 * destination doesn't accumulate delivery failures, and (b) give us a logged,
 * server-side record of completed purchases (and a hook for future email delivery).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'webhook not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'missing stripe-signature' }, { status: 400 });

  // Raw, unparsed body — required for HMAC verification.
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', (err as Error).message);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid') {
        console.log('[stripe/webhook] paid checkout', {
          id: session.id,
          email: session.customer_details?.email ?? null,
          amount_total: session.amount_total,
          currency: session.currency,
        });
        // Fulfillment hook (e.g. email the download link) can live here later.
      }
      break;
    }
    default:
      // Acknowledge everything else so Stripe records a successful delivery.
      break;
  }

  return NextResponse.json({ received: true });
}
