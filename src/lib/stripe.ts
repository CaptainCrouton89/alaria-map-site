import Stripe from 'stripe';

// Lazily constructed so a build without STRIPE_SECRET_KEY (e.g. CI typecheck) still
// compiles — the error only surfaces when a purchase route is actually hit.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key);
  return _stripe;
}
