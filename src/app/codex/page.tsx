'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map, Shuffle, Search } from 'lucide-react';
import type { SearchEntry } from '@/types/codex';
import { CodexChrome } from '@/components/codex/CodexChrome';
import { EntitySeal } from '@/components/codex/EntitySeal';
import { EntityImage } from '@/components/codex/EntityImage';
import { getAtmosphereVisual } from '@/lib/atmosphere';
import { WEIGHT_RANK, categoryVisual, entryVisual, rankResults } from '@/lib/codex-search';

// ─── constants ───────────────────────────────────────────────────────────────
// Ranking + atmosphere helpers live in @/lib/codex-search so the search overlay
// and this landing page rank and tint results identically.

const OVERVIEW_ORDER = [
  'overview-geography', 'overview-races', 'overview-creatures', 'overview-factions',
  'overview-magic', 'overview-deities', 'overview-cosmology', 'overview-history',
  'overview-personae', 'overview-artifacts',
];

const CATEGORY_ICON_TYPE: Record<string, string> = {
  geography: 'region', races: 'race', creatures: 'creature', factions: 'faction',
  magic: 'magic', deities: 'deity', cosmology: 'plane', history: 'era',
  personae: 'person', artifacts: 'artifact',
};

/** Portal subtitles for each overview category. */
const CATEGORY_SUBTITLE: Record<string, string> = {
  geography: 'Realms, cities & wilds',
  races: 'Peoples of Alaria',
  creatures: 'Beasts & monsters',
  factions: 'Powers & orders',
  magic: 'Forces & arts',
  deities: 'Gods & the divine',
  cosmology: 'Planes & the astral',
  history: 'Ages & events',
  personae: 'Figures of note',
  artifacts: 'Relics of power',
};

// ─── sub-components ──────────────────────────────────────────────────────────

function ResultRow({ entry }: { entry: SearchEntry }) {
  const visual = entryVisual(entry);
  const [r, g, b] = visual.rgb;
  const isLegendary = entry.weight === 'legendary';
  const isMajor = entry.weight === 'major';
  const isFootnote = entry.weight === 'footnote' || entry.weight === 'minor';
  const isProminent = isLegendary || isMajor;

  const thumbSize = isLegendary ? 48 : isMajor ? 40 : isFootnote ? 26 : 36;

  return (
    <li style={{ borderBottom: '1px solid rgba(77,68,54,0.55)' }}>
      <Link
        href={`/codex/${entry.id}`}
        className="group flex items-center gap-3.5 hover:bg-gold/[0.07] transition-colors"
        style={{
          padding: isProminent ? '0.8rem 0.85rem 0.8rem 1rem' : isFootnote ? '0.45rem 0.85rem 0.45rem 1rem' : '0.6rem 0.85rem 0.6rem 1rem',
          position: 'relative',
        }}
      >
        {/* atmosphere spine */}
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: `rgba(${r},${g},${b},0.85)`,
          }}
        />
        {/* banner preview (cropped square), Sigil fallback */}
        <span
          className="shrink-0 overflow-hidden rounded"
          style={{ width: thumbSize, height: thumbSize }}
        >
          <EntityImage
            src={entry.banner}
            entry={{ id: entry.id, name: entry.name, entityType: entry.entityType, tags: [] }}
            visual={visual}
            aspect="1 / 1"
          />
        </span>
        {/* text */}
        <span className="flex flex-col min-w-0 flex-1">
          <span className={`flex items-baseline gap-2 ${isFootnote ? '' : ''}`}>
            <span
              className="font-display group-hover:text-gold transition-colors"
              style={{ fontSize: isLegendary ? '1.15rem' : isFootnote ? '0.92rem' : '1rem', color: 'var(--ink)' }}
            >
              {entry.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] shrink-0" style={{ color: 'var(--ink-muted)' }}>
              {entry.entityType}
            </span>
          </span>
          {entry.blurb && !isFootnote && (
            <span className="text-sm truncate" style={{ color: 'var(--ink-muted)' }}>{entry.blurb}</span>
          )}
          {entry.blurb && isFootnote && (
            <span className="text-[0.8rem] truncate" style={{ color: 'var(--ink-muted)', display: 'inline', marginLeft: '0.4rem' }}>{entry.blurb}</span>
          )}
        </span>
      </Link>
    </li>
  );
}

function FeatureCard({ entry }: { entry: SearchEntry }) {
  const visual = entryVisual(entry);
  const [r, g, b] = visual.rgb;
  return (
    <Link
      href={`/codex/${entry.id}`}
      className="group block overflow-hidden rounded-[0.55rem] border transition-all"
      style={{
        borderColor: 'var(--border)',
        background: `linear-gradient(180deg, rgba(${r},${g},${b},0.08), rgba(44,36,22,0.5)), var(--parchment-light)`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(${r},${g},${b},0.7)`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, rgba(${r},${g},${b},1), rgba(${r},${g},${b},0.15))` }} />
      {/* banner image */}
      <div style={{ height: 116 }}>
        <EntityImage
          src={entry.banner}
          entry={{ id: entry.id, name: entry.name, entityType: entry.entityType, tags: [] }}
          visual={visual}
          aspect="16 / 9"
        />
      </div>
      {/* body */}
      <div style={{ padding: '0.7rem 0.85rem 0.95rem' }}>
        <div className="flex items-center gap-2">
          <EntitySeal entry={{ entityType: entry.entityType, tags: [] }} visual={visual} size="sm" />
          <span className="font-display text-[1.05rem]" style={{ color: 'var(--ink)' }}>{entry.name}</span>
        </div>
        <div className="text-[0.62rem] uppercase tracking-[0.12em] mt-1 mb-1.5" style={{ color: 'var(--ink-muted)' }}>
          {entry.entityType} · {visual.label ? visual.label : entry.weight}
        </div>
        {entry.blurb && (
          <div className="text-[0.82rem] leading-[1.45]" style={{ color: 'var(--ink-muted)' }}>
            {entry.blurb}
          </div>
        )}
      </div>
    </Link>
  );
}

function PortalTile({ overview }: { overview: SearchEntry }) {
  const category = overview.category;
  const visual = categoryVisual(category);
  const [r, g, b] = visual.rgb;
  const iconType = CATEGORY_ICON_TYPE[category];
  if (!iconType) throw new Error(`No icon type for category: ${category}`);
  const subtitle = CATEGORY_SUBTITLE[category];
  if (subtitle === undefined) throw new Error(`No subtitle for category: ${category}`);

  return (
    <Link
      href={`/codex/${overview.id}`}
      className="group flex flex-col gap-2 rounded-[0.5rem] border transition-all cursor-pointer"
      style={{
        border: `1px solid rgba(${r},${g},${b},0.4)`,
        background: `linear-gradient(180deg, rgba(${r},${g},${b},0.14), rgba(${r},${g},${b},0.03))`,
        padding: '0.85rem 0.7rem',
        minHeight: '6.2rem',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(${r},${g},${b},0.9)`;
        (e.currentTarget as HTMLElement).style.background = `linear-gradient(180deg, rgba(${r},${g},${b},0.22), rgba(${r},${g},${b},0.06))`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `rgba(${r},${g},${b},0.4)`;
        (e.currentTarget as HTMLElement).style.background = `linear-gradient(180deg, rgba(${r},${g},${b},0.14), rgba(${r},${g},${b},0.03))`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <EntitySeal entry={{ entityType: iconType, tags: [] }} visual={visual} size="md" />
      <div>
        <div className="font-display text-[0.92rem]" style={{ color: 'var(--ink)' }}>{overview.name}</div>
        {subtitle && <div className="text-[0.66rem]" style={{ color: 'var(--ink-muted)' }}>{subtitle}</div>}
      </div>
    </Link>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function CodexPage() {
  const router = useRouter();
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState('');
  // Day-bucket for the rotating featured hero. Computed in an effect (not during
  // render) so the component stays pure; defaults to 0 for the first paint.
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    fetch('/codex-search.json')
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        setIndex(data);
        // Read the clock here (in the async callback, not during render) so the
        // component stays pure and we still rotate the featured hero by day.
        setDayIndex(Math.floor(Date.now() / 86_400_000));
      })
      .catch(() => setIndex([]));
  }, []);

  // Wander: pick a random entry on click (random in an event handler is pure-safe,
  // unlike during render) and navigate there.
  const wander = () => {
    if (!index?.length) return;
    const e = index[Math.floor(Math.random() * index.length)];
    router.push(`/codex/${e.id}`);
  };

  // `q` (immediate) drives the snappy view switch hero↔results; `dq` (deferred)
  // drives the expensive filter/list render so it never blocks a keystroke.
  const q = query.trim().toLowerCase();
  const deferredQuery = useDeferredValue(query);
  const dq = deferredQuery.trim().toLowerCase();

  // Ten overview portals in canonical order
  const overviews = useMemo(() => {
    if (!index) return [];
    const byId: Record<string, SearchEntry> = Object.fromEntries(
      index.filter((e) => e.entityType === 'overview').map((e) => [e.id, e]),
    );
    return OVERVIEW_ORDER.map((id) => byId[id]).filter((e): e is SearchEntry => Boolean(e));
  }, [index]);

  // Featured hero: rotate among legendary entries by day
  const featured = useMemo(() => {
    if (!index) return null;
    const legendary = index.filter((e) => e.weight === 'legendary' && e.entityType !== 'overview');
    if (!legendary.length) return null;
    return legendary[dayIndex % legendary.length];
  }, [index, dayIndex]);

  // Cornerstone cards: top legendary (then major) non-overview entries, up to 3
  const cornerstones = useMemo(() => {
    if (!index) return [];
    const pool = index.filter((e) => e.entityType !== 'overview' && (e.weight === 'legendary' || e.weight === 'major'));
    // stable sort: legendary first, then by name
    return pool
      .slice()
      .sort((a, b) => WEIGHT_RANK[a.weight] - WEIGHT_RANK[b.weight] || a.name.localeCompare(b.name))
      .slice(0, 3);
  }, [index]);

  const results = useMemo(() => {
    if (!index) return [];
    return rankResults(index, dq, 200);
  }, [index, dq]);

  const featuredVisual = featured ? entryVisual(featured) : getAtmosphereVisual('default');

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--parchment)', color: 'var(--ink)', fontFamily: 'var(--sans)' }}
    >
      {/* Floating search + Map/Codex cluster (top-right), shared across codex pages */}
      <CodexChrome />

      {/* ════════════════ PERSISTENT SEARCH SHELL ════════════════ */}
      {/* A single, always-mounted <input> lives here. Hero decoration mounts and
          unmounts around it via {!q && …}, but the input keeps a stable position
          in the React tree (shell → content → box → input), so it never loses
          focus when the first keystroke flips the view from hero to results. */}
      <div
        className={q ? 'max-w-3xl mx-auto px-4 sm:px-6' : ''}
        style={
          q
            ? { paddingTop: '1.5rem' }
            : { position: 'relative', height: 300, overflow: 'hidden' }
        }
      >
        {/* hero backdrop — image, overlay, corner flourishes (no-query only) */}
        {!q && (
          <>
            {featured && (
              <div style={{ position: 'absolute', inset: 0 }}>
                <EntityImage
                  src={featured.banner}
                  entry={{ id: featured.id, name: featured.name, entityType: featured.entityType, tags: [] }}
                  visual={featuredVisual}
                  aspect="3 / 1"
                  className="w-full h-full"
                />
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(15,13,10,0.25) 20%, rgba(15,13,10,0.82) 100%)',
                zIndex: 2,
              }}
            />
            <span
              style={{
                position: 'absolute', top: 0, left: 0, width: '2.5rem', height: '2.5rem',
                borderTop: '2px solid rgba(201,162,39,0.3)', borderLeft: '2px solid rgba(201,162,39,0.3)', zIndex: 3,
              }}
            />
            <span
              style={{
                position: 'absolute', top: 0, right: 0, width: '2.5rem', height: '2.5rem',
                borderTop: '2px solid rgba(201,162,39,0.3)', borderRight: '2px solid rgba(201,162,39,0.3)', zIndex: 3,
              }}
            />
          </>
        )}

        {/* content wrapper — ALWAYS rendered so the input keeps its tree slot */}
        <div
          style={
            q
              ? undefined
              : {
                  position: 'absolute', inset: 0, zIndex: 4,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                  padding: '0 1.25rem',
                }
          }
        >
          {/* hero heading (no-query only) */}
          {!q && (
            <>
              <div className="flex items-center gap-3 mb-3" style={{ color: 'var(--gold-muted)' }} aria-hidden>
                <span style={{ height: 1, width: '3rem', background: 'linear-gradient(90deg, transparent, var(--gold-muted))' }} />
                <span style={{ color: 'var(--gold)' }}>❧</span>
                <span style={{ height: 1, width: '3rem', background: 'linear-gradient(270deg, transparent, var(--gold-muted))' }} />
              </div>
              <h1
                className="font-display font-semibold"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', letterSpacing: '0.02em', textShadow: '0 2px 18px rgba(0,0,0,0.9)', color: 'var(--ink)' }}
              >
                The Codex of Alaria
              </h1>
              <p style={{ fontSize: '0.9rem', margin: '0.35rem 0 0.9rem', textShadow: '0 1px 6px rgba(0,0,0,0.9)', color: 'var(--ink-muted)' }}>
                Search the world, then travel by its connections.
              </p>
            </>
          )}

          {/* THE single search box — stable position across query states */}
          <div
            className="flex items-center gap-2"
            style={{
              width: q ? '100%' : 'min(36rem, 90%)',
              padding: '0.7rem 0.9rem',
              borderRadius: '0.4rem',
              background: q ? 'rgba(20,17,13,0.55)' : 'rgba(20,17,13,0.6)',
              border: '1px solid var(--gold-muted)',
            }}
          >
            <Search className="shrink-0" size={18} style={{ color: 'var(--ink-muted)' }} />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places, powers, people…"
              aria-label="Search the codex"
              style={{
                all: 'unset',
                flex: 1,
                color: 'var(--ink)',
                fontFamily: 'var(--display)',
                fontSize: '1rem',
                letterSpacing: '0.02em',
              }}
            />
          </div>

          {/* quick links (no-query only) */}
          {!q && (
            <div className="flex items-center gap-5 mt-2.5" style={{ fontSize: '0.8rem', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
              <Link
                href="/"
                className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ color: 'var(--gold)', borderBottom: '1px solid var(--gold-muted)' }}
              >
                <Map size={12} />
                Open the world map
              </Link>
              <button
                type="button"
                onClick={wander}
                className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gold)', borderBottom: '1px solid var(--gold-muted)' }}
              >
                <Shuffle size={12} />
                Wander to a random entry
              </button>
            </div>
          )}
        </div>

        {/* caption (no-query only) */}
        {!q && featured && (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
              fontFamily: 'ui-monospace, monospace', fontSize: '0.58rem',
              color: 'rgba(232,224,208,0.6)',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
              padding: '0.55rem 1rem 0.35rem',
            }}
          >
            Featured · {featured.name} — rotates daily
          </div>
        )}
      </div>

      {/* ════════════════ SEARCH RESULTS ════════════════ */}
      {q && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {!index ? (
            <p className="text-center" style={{ color: 'var(--ink-muted)' }}>Loading the archive…</p>
          ) : (
            <>
              <p className="text-xs uppercase mb-4" style={{ letterSpacing: '0.14em', color: 'var(--ink-muted)' }}>
                {`${results.length}${results.length === 200 ? '+' : ''} result${results.length === 1 ? '' : 's'}`}
              </p>
              <ul
                className="flex flex-col overflow-hidden rounded-[0.4rem]"
                style={{
                  border: '1px solid var(--border)',
                  background: 'rgba(44,36,22,0.35)',
                }}
              >
                {results.map((entry) => (
                  <ResultRow key={entry.id} entry={entry} />
                ))}
                {results.length === 0 && (
                  <li className="px-4 py-8 text-center" style={{ color: 'var(--ink-muted)' }}>
                    No entries match &ldquo;{query}&rdquo;.
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      )}

      {/* ════════════════ NO-QUERY LANDING CONTENT ════════════════ */}
      {!q && (
        <div style={{ padding: '1.6rem 1.4rem 3rem', maxWidth: '72rem', margin: '0 auto' }}>
          {!index ? (
            <p className="text-center py-8" style={{ color: 'var(--ink-muted)' }}>Loading the archive…</p>
          ) : (
            <>
              {/* ── Begin with — the cornerstones ── */}
              {cornerstones.length > 0 && (
                <section className="mb-8">
                  <p
                    className="mb-3"
                    style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-muted)' }}
                  >
                    Begin with — the cornerstones
                  </p>
                  <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 16rem), 1fr))' }}>
                    {cornerstones.map((entry) => (
                      <FeatureCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              )}

              {/* ── Browse the world ── */}
              {overviews.length > 0 && (
                <section>
                  <p
                    className="mb-3"
                    style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-muted)' }}
                  >
                    Browse the world — ten realms of lore
                  </p>
                  <div
                    className="grid gap-2.5"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 11rem), 1fr))' }}
                  >
                    {overviews.map((o) => (
                      <PortalTile key={o.id} overview={o} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
