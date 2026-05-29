import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import type { EntryWeight } from '@/types/codex';
import { getEntriesByTag } from '@/lib/codex-data';
import { calculateEntryWeight } from '@/lib/entry-weight';
import { getAtmosphereVisual } from '@/lib/atmosphere';
import { EntitySeal } from '@/components/codex/EntitySeal';

const WEIGHT_RANK: Record<EntryWeight, number> = {
  legendary: 0, major: 1, standard: 2, minor: 3, footnote: 4,
};

// This is a calm filtered list, like the codex search results — seals use the
// neutral hue rather than each entry's own atmosphere so the page stays quiet.
const NEUTRAL_VISUAL = getAtmosphereVisual('default');

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return { title: `Tagged “${decoded}” — The Codex of Alaria` };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);

  // Order most-prominent first, then alphabetically — the same ranking the
  // codex search uses for its "start here" list, so the two read the same way.
  const entries = getEntriesByTag(decoded)
    .map((e) => ({ entry: e, weight: calculateEntryWeight(e) }))
    .sort(
      (a, b) =>
        WEIGHT_RANK[a.weight] - WEIGHT_RANK[b.weight] ||
        a.entry.name.localeCompare(b.entry.name)
    );

  // A tag with no entries is a dead URL — fall through to the codex 404.
  if (entries.length === 0) notFound();

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(180deg, rgba(201,162,39,0.05) 0, transparent 520px), var(--parchment)` }}
    >
      {/* Top bar */}
      <div className="border-b border-border bg-parchment-dark/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <Link
            href="/codex"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Search the Codex
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Title block */}
        <div className="mb-9 text-center">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-gold-muted mb-4">
            <Tag className="w-3.5 h-3.5" />
            <span>Tag</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-3 break-words">
            {decoded}
          </h1>
          <p className="text-lg text-ink-muted">
            {entries.length} {entries.length === 1 ? 'entry bears' : 'entries bear'} this mark.
          </p>
        </div>

        {/* Results */}
        <ul className="flex flex-col divide-y divide-border/70 border border-border rounded-md overflow-hidden bg-parchment-light/60">
          {entries.map(({ entry, weight }) => {
            const prominent = weight === 'legendary' || weight === 'major';
            return (
              <li key={entry.id}>
                <Link
                  href={`/codex/${entry.id}`}
                  className="group flex items-center gap-3.5 px-4 py-3 hover:bg-gold/[0.07] transition-colors"
                >
                  <EntitySeal
                    entry={{ entityType: entry.entityType, tags: entry.tags }}
                    visual={NEUTRAL_VISUAL}
                    size="sm"
                  />
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="flex items-baseline gap-2.5">
                      <span
                        className={`font-display group-hover:text-gold transition-colors text-ink ${prominent ? 'text-[1.05rem]' : ''}`}
                      >
                        {entry.name}
                      </span>
                      {entry.entityType && (
                        <span className="text-[10px] uppercase tracking-[0.12em] text-ink-muted shrink-0">
                          {entry.entityType}
                        </span>
                      )}
                    </span>
                    {entry.blurb && (
                      <span className="text-sm text-ink-muted truncate">{entry.blurb}</span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
