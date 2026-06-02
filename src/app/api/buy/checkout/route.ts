import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getPriceId } from '@/lib/purchase';

// Stripe SDK needs the Node runtime (not edge).
export const runtime = 'nodejs';

/** Absolute origin for Stripe redirects — prefer the configured site URL, else the request. */
function baseUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

// POST → create a one-time Checkout Session for the full-map PNG and return its hosted URL.
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const origin = baseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: getPriceId(), quantity: 1 }],
      // The success page re-verifies this session server-side before revealing the file.
      success_url: `${origin}/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?purchase=cancelled`,
      // Checkout collects the email; Stripe emails the receipt when "successful payment"
      // emails are enabled in the dashboard (Settings → Customer emails).
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[buy/checkout] failed to create session:', err);
    return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 });
  }
}
