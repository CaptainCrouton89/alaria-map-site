import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getEntryById } from '@/lib/codex-data';
import { calculateEntryWeight } from '@/lib/entry-weight';
import { determineAtmosphere, getAtmosphereVisual, atmosRgba } from '@/lib/atmosphere';
import { EntityHero } from '@/components/codex/EntityHero';
import { CodexBody } from '@/components/codex/CodexBody';
import { Infobox } from '@/components/codex/Infobox';

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default async function EntryPage({ params }: PageProps) {
  const { entryId } = await params;
  const entry = getEntryById(entryId);
  if (!entry) notFound();

  const weight = calculateEntryWeight(entry);
  const atmosphere = entry.atmosphere ?? determineAtmosphere(entry.tags);
  const visual = getAtmosphereVisual(atmosphere);

  // Resolve coordinates of bordering entities (both edge directions) so the
  // infobox can draw them as a spatial adjacency map rather than a chip list.
  const borderIds = new Set<string>();
  for (const r of entry.relations ?? []) if (r.kind === 'borders') borderIds.add(r.target);
  for (const r of entry.incoming ?? []) if (r.kind === 'borders') borderIds.add(r.source);
  const neighborCoords: Record<string, [number, number]> = {};
  for (const id of borderIds) {
    const n = getEntryById(id);
    if (n?.coordinates) neighborCoords[id] = n.coordinates;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${atmosRgba(visual, 0.05)} 0, transparent 640px), var(--parchment)`,
      }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-border bg-parchment-dark/85 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link
            href="/codex"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Search the Codex
          </Link>
        </div>
      </div>

      <EntityHero entry={entry} weight={weight} visual={visual} />

      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col-reverse gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">
        <main className="min-w-0">
          <CodexBody entry={entry} weight={weight} />
        </main>
        <aside className="lg:sticky lg:top-6">
          <Infobox entry={entry} visual={visual} neighborCoords={neighborCoords} />
        </aside>
      </div>
    </div>
  );
}
