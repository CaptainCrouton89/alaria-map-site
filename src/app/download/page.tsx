import Link from 'next/link';
import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrimaryNav } from '@/components/PrimaryNav';
import { BuyMapButton } from '@/components/BuyMapButton';
import { resolvePaidDownload, PRODUCT_LABEL, DOWNLOAD_FILENAME } from '@/lib/purchase';

// Always verify live against Stripe — never statically cache a purchase-gated page.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Your download',
  robots: { index: false, follow: false },
};

export default async function DownloadPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const result = session_id ? await resolvePaidDownload(session_id) : null;

  return (
    <div className="min-h-screen w-full bg-parchment text-ink flex items-center justify-center px-4">
      <PrimaryNav active="map" />

      <div className="w-full max-w-md rounded-xl border border-border bg-[var(--parchment-light)] shadow-md px-7 py-8 text-center">
        {result ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--gold)]/20 text-[var(--gold)]">
              <Download className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-semibold leading-tight">Thank you!</h1>
            <p className="mt-2 text-sm text-ink-muted">
              Your purchase of the {PRODUCT_LABEL} is complete
              {result.email ? <> — a receipt is on its way to <strong className="text-ink">{result.email}</strong></> : null}.
            </p>

            <Button asChild variant="accent" className="mt-6 w-full justify-center">
              <a href={result.url} download={DOWNLOAD_FILENAME} rel="noopener">
                <Download className="h-4 w-4" />
                <span>Download the full map</span>
              </a>
            </Button>

            <p className="mt-4 text-xs leading-relaxed text-ink-muted">
              This link stays available on this page — bookmark it to download again later.
              The map is licensed for personal use; please don&apos;t redistribute or resell the file.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-1.5 text-sm text-gold hover:text-[#f3dd8a] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to the map
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold leading-tight">
              {session_id ? 'Payment not found' : 'Nothing to download'}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              {session_id
                ? "We couldn't confirm this payment. If you were charged, give it a moment and refresh — otherwise try the purchase again."
                : 'This page becomes a download link after you purchase the full-resolution map.'}
            </p>

            <div className="mt-6 flex flex-col items-center gap-3">
              <BuyMapButton variant="accent" size="default" className="w-full justify-center" label="Buy the full map" />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-[#f3dd8a] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to the map
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
