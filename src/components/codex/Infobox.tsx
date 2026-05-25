import Link from 'next/link';
import type { CodexEntry, EntityRef, OutEdge, InEdge } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { atmosRgba } from '@/lib/atmosphere';
import { EntitySeal } from './EntitySeal';
import { typeLabel } from './EntityHero';
import { NeighborMap, type MapPoint } from './NeighborMap';
import { MiniMap } from './MiniMap';

const CONTAINS_CAP = 40;

// Edge kinds whose two directions describe the same fact (A borders B ⇔ B borders A).
// For these we merge outbound + inbound into one group instead of listing twice.
const SYMMETRIC = new Set(['borders', 'separatedBy', 'alliedWith', 'atWarWith', 'tradesWith']);

// Outbound edge labels (this entity → other).
const KIND_LABELS: Record<string, string> = {
  capitalOf: 'Capital of', borders: 'Borders', partOf: 'Part of', memberOf: 'Member of',
  alliedWith: 'Allied with', atWarWith: 'At war with', tradesWith: 'Trades with',
  vassalOf: 'Vassal of', ruledBy: 'Ruled by', founded: 'Founded', worships: 'Worships',
  sacredTo: 'Sacred to', homeOf: 'Home of', originOf: 'Origin of', separatedBy: 'Separated by',
};
// Inbound edge labels (other → this entity), phrased from this entity's vantage.
const REVERSE_LABELS: Record<string, string> = {
  capitalOf: 'Capital', ruledBy: 'Rules', memberOf: 'Members', vassalOf: 'Vassals',
  founded: 'Founded by',
};
const humanize = (k: string) =>
  k.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
const outLabel = (k: string) => KIND_LABELS[k] ?? humanize(k);
const inLabel = (k: string) => REVERSE_LABELS[k] ?? `${humanize(k)} (referenced by)`;

function dedupe(refs: EntityRef[]): EntityRef[] {
  const seen = new Set<string>();
  return refs.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));
}

function Chip({ id, name, accent }: EntityRef & { accent: string }) {
  return (
    <Link
      href={`/codex/${id}`}
      className="codex-chip inline-block px-2 py-0.5 text-[13px] leading-snug bg-parchment border border-border text-ink rounded-sm transition-colors"
      style={{ '--accent': accent } as React.CSSProperties}
    >
      {name}
    </Link>
  );
}

function ChipGroup({ label, items, accent }: { label: string; items: EntityRef[]; accent: string }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-[11px] uppercase tracking-[0.13em] font-display" style={{ color: accent }}>
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <Chip key={it.id} {...it} accent={accent} />
        ))}
      </div>
    </div>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-muted shrink-0">{label}</dt>
      <dd className="text-sm text-ink text-right min-w-0">{children}</dd>
    </div>
  );
}

interface InfoboxProps {
  entry: CodexEntry;
  visual: AtmosphereVisual;
  /** Coordinates of border neighbours, by id — supplied by the page for the adjacency map. */
  neighborCoords?: Record<string, [number, number]>;
}

/**
 * The wiki infobox: a scribe's marginal panel summarising where the entity sits
 * in the world (quick facts) and how it connects to everything else (relations).
 * Symmetric relations are merged; borders are drawn as a small adjacency map.
 */
export function Infobox({ entry, visual, neighborCoords = {} }: InfoboxProps) {
  const accent = atmosRgba(visual, 1);
  const partOf = entry.partOf ?? null;
  const contains = entry.contains ?? [];
  const seeAlso = entry.seeAlso ?? [];

  // Group typed edges by kind, preserving first-seen order.
  const groupOut = new Map<string, EntityRef[]>();
  for (const r of (entry.relations ?? []) as OutEdge[]) {
    if (!groupOut.has(r.kind)) groupOut.set(r.kind, []);
    groupOut.get(r.kind)!.push({ id: r.target, name: r.targetName });
  }
  const groupIn = new Map<string, EntityRef[]>();
  for (const r of (entry.incoming ?? []) as InEdge[]) {
    if (!groupIn.has(r.kind)) groupIn.set(r.kind, []);
    groupIn.get(r.kind)!.push({ id: r.source, name: r.sourceName });
  }

  // Merge symmetric kinds (both directions are the same fact) into one deduped group.
  const merged = new Map<string, EntityRef[]>();
  for (const kind of new Set([...groupOut.keys(), ...groupIn.keys()])) {
    if (!SYMMETRIC.has(kind)) continue;
    merged.set(kind, dedupe([...(groupOut.get(kind) ?? []), ...(groupIn.get(kind) ?? [])]));
    groupOut.delete(kind);
    groupIn.delete(kind);
  }

  // Borders → adjacency map. Split neighbours into mapped (have coords) and listed.
  const borderRefs = merged.get('borders') ?? [];
  merged.delete('borders');
  const mappedBorders: MapPoint[] = [];
  const unmappedBorders: EntityRef[] = [];
  for (const r of borderRefs) {
    const c = neighborCoords[r.id];
    if (c) mappedBorders.push({ id: r.id, name: r.name, coordinates: c });
    else unmappedBorders.push(r);
  }
  const showMap = entry.coordinates && mappedBorders.length >= 1;

  const hasRelations =
    borderRefs.length || merged.size || groupOut.size || groupIn.size || contains.length || seeAlso.length;

  const shownContains = contains.slice(0, CONTAINS_CAP);
  const moreContains = contains.length - shownContains.length;

  return (
    <div
      className="relative overflow-hidden rounded-md border border-border"
      style={{
        background: `linear-gradient(180deg, ${atmosRgba(visual, 0.08)}, rgba(44,36,22,0.4)), var(--parchment-light)`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
      }}
    >
      {/* Atmosphere accent bar */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${atmosRgba(visual, 0.15)})` }} />

      <div className="p-5">
        {/* Header — repeats the title, wiki-style */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
          <EntitySeal entry={entry} visual={visual} size="sm" />
          <div className="min-w-0">
            <div className="font-display text-ink leading-tight truncate">{entry.name}</div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">{typeLabel(entry)}</div>
          </div>
        </div>

        {/* Where in the world — a live tile minimap, click to open the full map. */}
        {entry.coordinates && (
          <div className="mb-4">
            <MiniMap
              id={entry.id}
              coordinates={entry.coordinates}
              zoomLevel={entry.zoomLevel}
              accent={accent}
            />
          </div>
        )}

        {/* Quick facts */}
        <dl className="divide-y divide-border/60">
          <Fact label="Type">{typeLabel(entry)}</Fact>
          {partOf && (
            <Fact label="Region">
              <Link href={`/codex/${partOf.id}`} className="text-gold hover:text-[#f3dd8a] underline underline-offset-2 decoration-gold-muted">
                {partOf.name}
              </Link>
            </Fact>
          )}
          {contains.length > 0 && (
            <Fact label="Contains">{contains.length.toLocaleString()} {contains.length === 1 ? 'place' : 'places'}</Fact>
          )}
        </dl>

        {/* Relations */}
        {hasRelations ? (
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
            {/* Borders, visualised */}
            {borderRefs.length > 0 && (
              <div className="flex flex-col gap-2">
                <h3 className="text-[11px] uppercase tracking-[0.13em] font-display" style={{ color: accent }}>
                  Borders
                </h3>
                {showMap && entry.coordinates ? (
                  <>
                    <div
                      className="rounded border border-border/70 px-1 py-2"
                      style={{ background: atmosRgba(visual, 0.05) }}
                    >
                      <NeighborMap
                        center={{ name: entry.name, coordinates: entry.coordinates }}
                        neighbors={mappedBorders}
                        accent={accent}
                      />
                    </div>
                    {unmappedBorders.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {unmappedBorders.map((r) => (
                          <Chip key={r.id} {...r} accent={accent} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {borderRefs.map((r) => (
                      <Chip key={r.id} {...r} accent={accent} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Remaining merged symmetric relations */}
            {[...merged.entries()].map(([kind, items]) => (
              <ChipGroup key={`m-${kind}`} label={outLabel(kind)} items={items} accent={accent} />
            ))}

            {/* Directional relations */}
            {[...groupOut.entries()].map(([kind, items]) => (
              <ChipGroup key={`o-${kind}`} label={outLabel(kind)} items={items} accent={accent} />
            ))}
            {[...groupIn.entries()].map(([kind, items]) => (
              <ChipGroup key={`i-${kind}`} label={inLabel(kind)} items={items} accent={accent} />
            ))}

            {contains.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[11px] uppercase tracking-[0.13em] font-display" style={{ color: accent }}>
                  Contains{contains.length > CONTAINS_CAP ? ` (${contains.length})` : ''}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {shownContains.map((c) => (
                    <Chip key={c.id} {...c} accent={accent} />
                  ))}
                </div>
                {moreContains > 0 && (
                  <p className="text-xs text-ink-muted mt-0.5">+{moreContains} more — search to find them</p>
                )}
              </div>
            )}

            <ChipGroup label="See also" items={seeAlso} accent={accent} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
