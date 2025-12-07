'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbJourney } from '@/components/codex/BreadcrumbJourney';
import { CodexEntry } from '@/components/codex/CodexEntry';
import type { CodexEntry as CodexEntryType, Category } from '@/types/codex';

// Sample entry for testing - in production this would be loaded from compiled JSON
const SAMPLE_ENTRY: CodexEntryType = {
  id: 'kyagos',
  name: 'Kyagos',
  category: 'geography',
  section: 'cities',
  tags: ['city', 'trade', 'water', 'civilization'],
  content: `Kyagos stands as the jewel of the eastern coast, a sprawling port city where the currents of commerce and culture converge. Built upon a natural harbor where three rivers meet the sea, the city has grown from a humble fishing village into one of Alaria's most prosperous trade hubs.

The city is divided into five distinct districts, each with its own character and purpose. The Harbor Quarter, with its countless piers and warehouses, never sleeps—merchant vessels from distant lands arrive at all hours, their holds laden with exotic goods and treasures. The Market District sprawls inland from the harbor, a labyrinth of stalls, shops, and trading houses where anything can be bought or sold for the right price.

Above the commercial heart of the city rises the Merchant Quarter, where successful traders have built grand estates overlooking the sea. These mansions, with their distinctive blue-tiled roofs and white marble facades, gleam in the sunlight like gems upon a crown. The district is connected to the rest of the city by a series of elegant bridges and raised walkways.

The Temple District occupies the eastern heights, where seven major temples stand in harmony, each dedicated to a different deity of trade, travel, and fortune. Here, merchants and sailors make offerings before embarking on long voyages, seeking divine favor for their ventures.

Finally, the Undercity—a network of ancient tunnels and waterways that existed long before the current city was built. Some say these passages were carved by an ancient civilization, while others claim they're natural formations shaped by underground rivers. Whatever their origin, they now serve as both smuggler's routes and secret passages for those who know how to navigate them.

The city is governed by the Council of Tides, a merchant oligarchy whose members are elected from among the wealthiest trading houses. While corruption is not uncommon, the council has generally proven effective at maintaining order and prosperity, understanding that peace is good for business.`,
  sourceFile: 'geography/kyagos.md',
  sourceHeader: 'Kyagos',
  relatedIds: ['eastern-ocean', 'council-of-tides', 'merchant-quarter'],
  mapLocationId: 'kyagos-location',
};

const SAMPLE_CATEGORY: Category = {
  name: 'Geography & Places',
  slug: 'geography',
  icon: '🗺️',
  description: 'Continents, nations, cities, and landmarks across Alaria',
  sections: [],
};

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default function EntryPage({ params }: PageProps) {
  // In production, you would:
  // 1. Unwrap params with use() or in a client component
  // 2. Load the actual entry from compiled JSON based on entryId
  // 3. Load the category data
  // 4. Handle 404 if entry not found

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header with Back Button */}
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

      {/* Breadcrumb Journey */}
      <BreadcrumbJourney
        entry={SAMPLE_ENTRY}
        category={SAMPLE_CATEGORY}
        parentLocation={null}
      />

      {/* Entry Content */}
      <div className="max-w-4xl mx-auto py-8">
        <CodexEntry entry={SAMPLE_ENTRY} />
      </div>

      {/* Related Entries (future enhancement) */}
      {SAMPLE_ENTRY.relatedIds && SAMPLE_ENTRY.relatedIds.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-12">
          <div className="border-t border-border pt-8">
            <h3 className="font-display text-xl font-semibold text-ink mb-4">
              Related Entries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_ENTRY.relatedIds.map((relatedId) => (
                <Link
                  key={relatedId}
                  href={`/codex/${relatedId}`}
                  className="p-4 bg-parchment-light border border-border hover:border-gold transition-colors"
                >
                  <span className="text-ink font-display capitalize">
                    {relatedId.replace(/-/g, ' ')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
