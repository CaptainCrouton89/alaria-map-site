'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map, Shuffle, Search } from 'lucide-react';
import type { SearchEntry } from '@/types/codex';
import { CodexChrome } from '@/components/codex/CodexChrome';
import { EntityImage } from '@/components/codex/EntityImage';
import { getAtmosphereVisual } from '@/lib/atmosphere';
import { categoryVisual, entryVisual, rankResults } from '@/lib/codex-search';

// ─── constants ───────────────────────────────────────────────────────────────
// Ranking + atmosphere helpers live in @/lib/codex-search so the search overlay
// and this landing page rank and tint results identically.

const OVERVIEW_ORDER = [
  'overview-geography', 'overview-races', 'overview-creatures', 'overview-factions',
  'overview-magic', 'overview-deities', 'overview-cosmology', 'overview-history',
  'overview-personae', 'overview-artifacts',
];

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

// The codex landing hero — a hand-written 16:9 oil painting of Bryn, Alaria's
// awakened sun, over the flat warmth-band-to-sunless-latitudes world. (The world
// is a flat plane: walk to the edge and you wrap into Celestia, so there is no
// rim or void to show.)
const LANDING_BANNER_URL =
  'https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images/codex-landing-bryn-flat/banner.webp';
const BRYN_CAPTION =
  'Bryn, the waking sun — its path across Alaria is sung by the dawn-choirs, not fixed';

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

/**
 * Shared hover behaviour for the landing's image cards: lift, tighten the
 * atmosphere-tinted border, and cast a hue-matched glow. Restored on leave.
 */
function cardHover(r: number, g: number, b: number) {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.borderColor = `rgba(${r},${g},${b},0.95)`;
      el.style.transform = 'translateY(-3px)';
      el.style.boxShadow = `0 12px 28px -10px rgba(${r},${g},${b},0.5)`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      el.style.borderColor = `rgba(${r},${g},${b},0.38)`;
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = 'none';
    },
  };
}

/** Bottom-anchored title + accent eyebrow, overlaid on a card's cover image. */
function CardCaption({
  title, eyebrow, accent, big = false,
}: { title: string; eyebrow: string; accent: string; big?: boolean }) {
  return (
    <div className="absolute bottom-0 left-0 right-0" style={{ padding: big ? '0.7rem 0.8rem' : '0.6rem 0.7rem' }}>
      <div
        className="font-display leading-tight"
        style={{ fontSize: big ? '1.12rem' : '0.97rem', color: 'var(--ink)', textShadow: '0 2px 10px rgba(0,0,0,0.95)' }}
      >
        {title}
      </div>
      <div
        className="mt-0.5"
        style={{ fontSize: big ? '0.61rem' : '0.6rem', textTransform: 'uppercase', letterSpacing: '0.11em', color: accent, textShadow: '0 1px 6px rgba(0,0,0,0.95)' }}
      >
        {eyebrow}
      </div>
    </div>
  );
}

// Gradient that seats the caption against the cover so text always reads.
const COVER_SCRIM = 'linear-gradient(180deg, rgba(15,13,10,0) 30%, rgba(15,13,10,0.5) 64%, rgba(15,13,10,0.93) 100%)';

// Deterministic shuffle: the order is stable within a seed window (here, one hour)
// but reshuffles as the seed advances, so the cornerstone marquee feels different
// through the day. mulberry32 PRNG + Fisher–Yates.
function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = arr.slice();
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Cornerstone feature card. Shows the entry's banner when one exists; these
 * marquee entries have no art yet, so the fallback is *designed* atmospheric
 * cover art (hue wash + radial glow + corner flourishes) rather than a flat
 * sigil — it reads as intentional, not broken. Title overlays the cover; the
 * blurb sits beneath.
 */
function FeatureCard({ entry }: { entry: SearchEntry }) {
  const visual = entryVisual(entry);
  const [r, g, b] = visual.rgb;
  const eyebrow = `${entry.entityType}${visual.label ? ` · ${visual.label}` : ''}`;

  return (
    <Link
      href={`/codex/${entry.id}`}
      className="group block overflow-hidden rounded-[0.55rem] border transition-all"
      style={{ borderColor: `rgba(${r},${g},${b},0.38)`, background: 'var(--parchment-light)' }}
      {...cardHover(r, g, b)}
    >
      {/* cover */}
      <div className="relative overflow-hidden" style={{ height: 150 }}>
        {entry.banner ? (
          <EntityImage
            src={entry.banner}
            entry={{ id: entry.id, name: entry.name, entityType: entry.entityType, tags: [] }}
            visual={visual}
            objectPosition="50% 40%"
            className="w-full h-full transition-transform duration-[650ms] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0" aria-hidden>
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(${r},${g},${b},0.24), rgba(15,13,10,0.9) 78%)` }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(95% 130% at 82% -12%, rgba(${r},${g},${b},0.34), transparent 60%)` }} />
            <div className="absolute inset-0" style={{ background: `repeating-linear-gradient(118deg, transparent 0 16px, rgba(${r},${g},${b},0.05) 16px 17px)` }} />
            <span style={{ position: 'absolute', top: 10, left: 10, width: '1.7rem', height: '1.7rem', borderTop: `1px solid rgba(${r},${g},${b},0.55)`, borderLeft: `1px solid rgba(${r},${g},${b},0.55)` }} />
            <span style={{ position: 'absolute', bottom: 10, right: 10, width: '1.7rem', height: '1.7rem', borderBottom: `1px solid rgba(${r},${g},${b},0.55)`, borderRight: `1px solid rgba(${r},${g},${b},0.55)` }} />
          </div>
        )}
        <div className="absolute top-0 left-0 right-0" style={{ height: 3, background: `linear-gradient(90deg, rgba(${r},${g},${b},1), rgba(${r},${g},${b},0.1))`, zIndex: 2 }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: COVER_SCRIM }} />
        <CardCaption title={entry.name} eyebrow={eyebrow} accent={`rgba(${r},${g},${b},0.95)`} big />
      </div>
      {/* body */}
      {entry.blurb && (
        <div style={{ padding: '0.65rem 0.8rem 0.85rem' }}>
          <div
            className="text-[0.84rem] leading-[1.5]"
            style={{ color: 'var(--ink-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {entry.blurb}
          </div>
        </div>
      )}
    </Link>
  );
}

/**
 * One of the ten "realms of lore" — a banner cover card. Every overview entity
 * has a 16:9 banner, cropped to a 4:3 tile with the realm name + subtitle
 * overlaid. Hover zooms the art and lights the atmosphere-hued border.
 */
function RealmCard({ overview }: { overview: SearchEntry }) {
  const category = overview.category;
  const visual = categoryVisual(category);
  const [r, g, b] = visual.rgb;
  const subtitle = CATEGORY_SUBTITLE[category];
  if (subtitle === undefined) throw new Error(`No subtitle for category: ${category}`);

  return (
    <Link
      href={`/codex/${overview.id}`}
      className="group relative block overflow-hidden rounded-[0.5rem] border transition-all"
      style={{ borderColor: `rgba(${r},${g},${b},0.38)`, aspectRatio: '4 / 3', background: 'rgba(15,13,10,0.6)' }}
      {...cardHover(r, g, b)}
    >
      <div className="absolute inset-0">
        <EntityImage
          src={overview.banner}
          entry={{ id: overview.id, name: overview.name, entityType: overview.entityType, tags: [] }}
          visual={visual}
          objectPosition="50% 40%"
          className="w-full h-full transition-transform duration-[650ms] ease-out group-hover:scale-[1.07]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: COVER_SCRIM }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: 3, background: `linear-gradient(90deg, rgba(${r},${g},${b},1), rgba(${r},${g},${b},0.08))` }} />
      <CardCaption title={overview.name} eyebrow={subtitle} accent={`rgba(${r},${g},${b},0.95)`} />
    </Link>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

// Auto-scrolling marquee of cornerstone cards. The track holds the list twice and
// translates by -50% on a loop, so the scroll is seamless; the duration scales with
// the card count to keep a constant, slow pace no matter how many there are. Pauses
// on hover, and honours reduced-motion (the CSS drops the animation and lets the row
// scroll manually). Per-item marginRight — not flex `gap` — keeps the doubled track
// exactly 2× one copy, which is what makes -50% line up seam-free.
const MARQUEE_CSS = `
@keyframes cornerstone-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.cornerstone-marquee { position: relative; overflow: hidden; }
.cornerstone-marquee-track { display: flex; width: max-content; animation: cornerstone-marquee linear infinite; will-change: transform; }
.cornerstone-marquee:hover .cornerstone-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .cornerstone-marquee { overflow-x: auto; }
  .cornerstone-marquee-track { animation: none; }
}
`;

function CornerstoneCarousel({ entries }: { entries: SearchEntry[] }) {
  // ~6s of travel per card keeps a calm, readable pace; floor so a short list still drifts.
  const duration = `${Math.max(133, entries.length * 20)}s`;
  const loop = [...entries, ...entries];
  return (
    <div className="cornerstone-marquee">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />
      <div className="cornerstone-marquee-track" style={{ animationDuration: duration }}>
        {loop.map((entry, i) => (
          <div key={`${entry.id}-${i}`} style={{ flex: '0 0 18rem', maxWidth: '18rem', marginRight: '0.875rem' }} aria-hidden={i >= entries.length}>
            <FeatureCard entry={entry} />
          </div>
        ))}
      </div>
      {/* parchment edge fades so cards melt in/out at the margins */}
      <div className="pointer-events-none absolute inset-y-0 left-0" style={{ width: '3rem', background: 'linear-gradient(90deg, var(--parchment), transparent)', zIndex: 2 }} />
      <div className="pointer-events-none absolute inset-y-0 right-0" style={{ width: '3rem', background: 'linear-gradient(270deg, var(--parchment), transparent)', zIndex: 2 }} />
    </div>
  );
}

export default function CodexPage() {
  const router = useRouter();
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/codex-search.json')
      .then((r) => r.json())
      .then((data: SearchEntry[]) => setIndex(data))
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

  // Cornerstone carousel: every legendary/major non-overview entry, shuffled into a
  // fresh order each hour (a time-of-day seed) so the marquee feels different through
  // the day. Random in a useMemo is fine here — this list only renders client-side,
  // after the index has loaded, so there is no SSR order to mismatch on hydration.
  const cornerstones = useMemo(() => {
    if (!index) return [];
    const pool = index.filter(
      (e) => e.entityType !== 'overview' && (e.weight === 'legendary' || e.weight === 'major'),
    );
    const hourSeed = Math.floor(Date.now() / 3_600_000); // advances once per hour
    // Cap the marquee at a rotating subset so the loop stays watchable and the
    // DOM stays light; the hourly reseed cycles different cornerstones through the day.
    return seededShuffle(pool, hourSeed).slice(0, 24);
  }, [index]);

  const results = useMemo(() => {
    if (!index) return [];
    return rankResults(index, dq, 200);
  }, [index, dq]);

  const bannerVisual = getAtmosphereVisual('water');

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
            : { position: 'relative', height: 460, overflow: 'hidden' }
        }
      >
        {/* hero backdrop — image, overlay, corner flourishes (no-query only) */}
        {!q && (
          <>
            <div style={{ position: 'absolute', inset: 0 }}>
              <EntityImage
                src={LANDING_BANNER_URL}
                entry={{ id: 'codex-landing', name: 'The Codex of Alaria', entityType: 'plane', tags: [] }}
                visual={bannerVisual}
                objectPosition="50% 45%"
                className="w-full h-full"
              />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, rgba(15,13,10,0.5) 15%, rgba(15,13,10,0.9) 100%)',
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
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', letterSpacing: '0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.98), 0 2px 24px rgba(0,0,0,0.9)', color: 'var(--ink)' }}
              >
                The Codex of Alaria
              </h1>
              <p style={{ fontSize: '0.9rem', margin: '0.35rem 0 0.9rem', textShadow: '0 1px 3px rgba(0,0,0,0.98), 0 1px 10px rgba(0,0,0,0.85)', color: 'var(--ink-muted)' }}>
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
            <div className="flex items-center gap-5 mt-2.5" style={{ fontSize: '0.8rem', textShadow: '0 1px 3px rgba(0,0,0,0.98), 0 1px 8px rgba(0,0,0,0.85)' }}>
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
        {!q && (
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
              fontFamily: 'ui-monospace, monospace', fontSize: '0.58rem',
              color: 'rgba(232,224,208,0.6)',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
              padding: '0.55rem 1rem 0.35rem',
            }}
          >
            {BRYN_CAPTION}
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
                  <CornerstoneCarousel entries={cornerstones} />
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
                  {/* 10 realms in a balanced 5×2 grid. Only 2 and 5 divide 10
                      evenly, so the breakpoints are 2↔5 — never an orphan row. */}
                  <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
                    {overviews.map((o) => (
                      <RealmCard key={o.id} overview={o} />
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
