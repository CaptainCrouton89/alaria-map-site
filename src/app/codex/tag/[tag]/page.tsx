import { notFound } from 'next/navigation';
import { Tag } from 'lucide-react';
import type { Metadata } from 'next';
import type { EntryWeight } from '@/types/codex';
import { getEntriesByTag } from '@/lib/codex-data';
import { calculateEntryWeight } from '@/lib/entry-weight';
import { CodexChrome } from '@/components/codex/CodexChrome';
import { EntityCard } from '@/components/codex/EntityCard';

const WEIGHT_RANK: Record<EntryWeight, number> = {
  legendary: 0, major: 1, standard: 2, minor: 3, footnote: 4,
};

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
      {/* Floating search + Map/Codex cluster (top-right), shared across codex pages */}
      <CodexChrome />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        {/* Title block */}
        <div className="mb-9 text-center">
          {/* fleuron divider */}
          <div className="flex items-center justify-center gap-3 mb-4 text-gold-muted" aria-hidden>
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-muted" />
            <Tag className="w-3.5 h-3.5 text-gold" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-muted" />
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold-muted mb-3">Tag</div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-3 break-words">
            {decoded}
          </h1>
          <p className="text-lg text-ink-muted">
            {entries.length} {entries.length === 1 ? 'entry bears' : 'entries bear'} this mark.
          </p>
        </div>

        {/* Profile-card grid — each card carries its own atmosphere */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {entries.map(({ entry }) => (
            <EntityCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
