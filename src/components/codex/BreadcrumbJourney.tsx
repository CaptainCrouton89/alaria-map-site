'use client';

import Link from 'next/link';
import type { CodexEntry, Category } from '@/types/codex';

interface BreadcrumbJourneyProps {
  entry: CodexEntry;
  category: Category;
  parentLocation?: {
    id: string;
    name: string;
  } | null;
}

/**
 * BreadcrumbJourney - Narrative navigation prose
 * Renders context like "You are reading about X, a nation in Y, in the annals of Z"
 */
export function BreadcrumbJourney({
  entry,
  category,
  parentLocation,
}: BreadcrumbJourneyProps) {
  // Determine narrative template based on tags
  const getEntityType = (): string => {
    const { tags } = entry;

    if (tags.includes('god')) return 'deity';
    if (tags.includes('dragon')) return 'dragon';
    if (tags.includes('daemon')) return 'daemon';
    if (tags.includes('state')) return 'nation';
    if (tags.includes('capital')) return 'capital';
    if (tags.includes('city')) return 'city';
    if (tags.includes('settlement') || tags.includes('town')) return 'settlement';
    if (tags.includes('faction')) return 'organization';
    if (tags.includes('creature')) return 'creature';
    if (tags.includes('item')) return 'item';
    if (tags.includes('region')) return 'region';
    if (tags.includes('poi')) return 'place';

    return 'entry';
  };

  const entityType = getEntityType();

  return (
    <nav className="px-6 py-4 bg-parchment-dark border-b border-border" aria-label="Breadcrumb">
      <p className="text-sm text-ink-muted leading-relaxed">
        You are reading about{' '}
        <span className="font-display text-ink font-semibold">{entry.name}</span>
        {entityType !== 'entry' && <>, a {entityType}</>}
        {parentLocation && (
          <>
            {' '}
            in{' '}
            <Link
              href={`/codex/${parentLocation.id}`}
              className="underline hover:text-gold transition-colors"
            >
              {parentLocation.name}
            </Link>
          </>
        )}
        , in the{' '}
        <Link
          href={`/codex/category/${category.slug}`}
          className="underline hover:text-gold transition-colors"
        >
          {category.name}
        </Link>
      </p>
    </nav>
  );
}
