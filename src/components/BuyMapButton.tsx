'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

type BuyMapButtonProps = {
  label?: string;
  className?: string;
} & Pick<VariantProps<typeof buttonVariants>, 'variant' | 'size'>;

/**
 * Kicks off a Stripe Checkout for the full-resolution map PNG: POSTs to
 * /api/buy/checkout, then redirects the browser to Stripe's hosted page.
 * On success Stripe returns the buyer to /download?session_id=… which verifies
 * the payment and reveals the file.
 */
export function BuyMapButton({
  label = 'Buy map',
  className,
  variant = 'accent',
  size = 'sm',
}: BuyMapButtonProps) {
  const [loading, setLoading] = useState(false);

  const start = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/buy/checkout', { method: 'POST' });
      const data = (await res.json()) as { url?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return; // leaving the page; keep the spinner
      }
      throw new Error('no url');
    } catch {
      setLoading(false);
      alert('Could not start checkout. Please try again in a moment.');
    }
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={start} disabled={loading}>
      <Download className="w-4 h-4" />
      <span>{loading ? 'Starting…' : label}</span>
    </Button>
  );
}
