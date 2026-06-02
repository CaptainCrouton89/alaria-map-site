import { getStripe } from './stripe';

/** Human-facing product label, also used as the download filename stem. */
export const PRODUCT_LABEL = 'Alaria World Map — Full-Resolution PNG';
export const DOWNLOAD_FILENAME = 'alaria-world-map-full.png';
/** Display price for UI copy (the authoritative amount lives on the Stripe Price). */
export const PRICE_DISPLAY = '$20';

export function getPriceId(): string {
  const id = process.env.STRIPE_PRICE_ID;
  if (!id) throw new Error('STRIPE_PRICE_ID is not set');
  return id;
}

export function getMapDownloadUrl(): string {
  const url = process.env.MAP_DOWNLOAD_URL;
  if (!url) throw new Error('MAP_DOWNLOAD_URL is not set');
  return url;
}

export interface PaidDownload {
  url: string;
  email: string | null;
}

/**
 * Confirm a Checkout Session is genuinely paid *for our price*, then hand back the
 * download URL. Returns null for anything we can't verify — a bad/expired id, an
 * unpaid session, or a paid session that bought something else. This is what gates
 * the (otherwise public) download link: the URL is only emitted server-side after
 * Stripe says the session is paid.
 */
export async function resolvePaidDownload(sessionId: string): Promise<PaidDownload | null> {
  if (!sessionId) return null;
  const stripe = getStripe();

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });
  } catch {
    return null;
  }

  if (session.payment_status !== 'paid') return null;

  // Guard against someone pasting an unrelated (but paid) session id: require that
  // this session actually purchased our configured price.
  const priceId = getPriceId();
  const boughtOurPrice = (session.line_items?.data ?? []).some(
    (li) => li.price?.id === priceId,
  );
  if (!boughtOurPrice) return null;

  return { url: getMapDownloadUrl(), email: session.customer_details?.email ?? null };
}
