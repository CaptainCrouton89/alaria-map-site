'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  // In production, this would:
  // 1. Unwrap params
  // 2. Load category data from compiled JSON
  // 3. List all entries in this category
  // 4. Organize by sections if available

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <div className="border-b border-border bg-parchment-dark">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/codex">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Codex
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-ink mb-4">
            Category Listing
          </h1>
          <p className="text-ink-muted mb-8">
            This page will display all entries in this category.
          </p>
          <p className="text-sm text-ink-muted italic">
            (Content compilation and entry listing coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}
