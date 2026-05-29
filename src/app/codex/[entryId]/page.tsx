import { notFound } from 'next/navigation';
import { getEntryById } from '@/lib/codex-data';
import { calculateEntryWeight } from '@/lib/entry-weight';
import { determineAtmosphere, getAtmosphereVisual, atmosRgba } from '@/lib/atmosphere';
import { EntityHero } from '@/components/codex/EntityHero';
import { CodexBody } from '@/components/codex/CodexBody';
import { CodexChrome } from '@/components/codex/CodexChrome';
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

  // ── At-a-glance facts ─────────────────────────────────────────────────────
  // Derived server-side from the fully resolved entry. Only include facts that
  // are cheaply available; omit any fact whose data is missing.

  // Type label reuse: must match the `typeLabel()` function in EntityHero.
  const TYPE_LABELS: Record<string, string> = {
    region: 'Region', wilderness: 'Wilderness', water: 'Body of Water',
    city: 'City', town: 'Town', village: 'Village', fortress: 'Fortress',
    ruins: 'Ruin', poi: 'Landmark', nation: 'Nation', faction: 'Organization',
    deity: 'Deity', plane: 'Plane', event: 'Event', era: 'Era', person: 'Person',
    artifact: 'Artifact', race: 'People', creature: 'Creature',
  };
  let entryTypeLabel = 'Entry';
  if (entry.entityType && TYPE_LABELS[entry.entityType]) {
    entryTypeLabel = TYPE_LABELS[entry.entityType];
  } else if (entry.tags.includes('god')) {
    entryTypeLabel = 'Deity';
  } else if (entry.tags.includes('dragon')) {
    entryTypeLabel = 'Dragon';
  } else if (entry.tags.includes('daemon')) {
    entryTypeLabel = 'Daemon';
  }

  // Capital: inbound `capitalOf` edge (the capital entity points at this one).
  const capitalRef = (entry.incoming ?? []).find((r) => r.kind === 'capitalOf');

  // Borders count (both edge directions, deduped by id).
  const allBorderIds = new Set<string>();
  for (const r of entry.relations ?? []) if (r.kind === 'borders') allBorderIds.add(r.target);
  for (const r of entry.incoming ?? []) if (r.kind === 'borders') allBorderIds.add(r.source);

  // Derived inhabitants: resolve ids to names for the "Peoples" fact.
  const inhabitantNames: string[] = [];
  for (const id of entry.derivedInhabitants ?? []) {
    const race = getEntryById(id);
    if (race) inhabitantNames.push(race.name);
  }

  type GlanceFact = { label: string; value: string; href?: string };
  const glanceFacts: GlanceFact[] = [];

  glanceFacts.push({ label: 'Type', value: entryTypeLabel });

  if (entry.partOf) {
    glanceFacts.push({ label: 'Within', value: entry.partOf.name, href: `/codex/${entry.partOf.id}` });
  }
  if (capitalRef) {
    glanceFacts.push({ label: 'Capital', value: capitalRef.sourceName, href: `/codex/${capitalRef.source}` });
  }
  if ((entry.contains ?? []).length > 0) {
    const n = entry.contains!.length;
    glanceFacts.push({ label: 'Contains', value: `${n} ${n === 1 ? 'place' : 'places'}` });
  }
  if (allBorderIds.size > 0) {
    const n = allBorderIds.size;
    glanceFacts.push({ label: 'Borders', value: `${n} ${n === 1 ? 'realm' : 'realms'}` });
  }
  if (inhabitantNames.length > 0) {
    glanceFacts.push({ label: 'Peoples', value: inhabitantNames.join(' · ') });
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${atmosRgba(visual, 0.05)} 0, transparent 640px), var(--parchment)`,
      }}
    >
      {/* Floating search + Map/Codex cluster (top-right). The hero's breadcrumb
          (Codex › … ›) stays at top-left; the cluster adds the search overlay
          and the Map switch this page otherwise lacks. */}
      <CodexChrome />

      <EntityHero entry={entry} weight={weight} visual={visual} glanceFacts={glanceFacts} />

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
