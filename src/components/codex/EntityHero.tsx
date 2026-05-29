import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CodexEntry, EntryWeight } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { atmosRgba } from '@/lib/atmosphere';
import { EntitySeal } from './EntitySeal';
import { HeroFrame } from './HeroFrame';

const TYPE_LABELS: Record<string, string> = {
  region: 'Region', wilderness: 'Wilderness', water: 'Body of Water',
  city: 'City', town: 'Town', village: 'Village', fortress: 'Fortress',
  ruins: 'Ruin', poi: 'Landmark', nation: 'Nation', faction: 'Organization',
  deity: 'Deity', plane: 'Plane', event: 'Event', era: 'Era', person: 'Person',
  artifact: 'Artifact', race: 'People', creature: 'Creature',
};

export function typeLabel(entry: CodexEntry): string {
  if (entry.entityType && TYPE_LABELS[entry.entityType]) return TYPE_LABELS[entry.entityType];
  if (entry.tags.includes('god')) return 'Deity';
  if (entry.tags.includes('dragon')) return 'Dragon';
  if (entry.tags.includes('daemon')) return 'Daemon';
  if (entry.tags.includes('capital')) return 'Capital';
  return 'Entry';
}

interface WeightStyle {
  centered: boolean;
  seal: 'lg' | 'md' | 'sm';
  title: string;
  flourishes: boolean;
}

const WEIGHT_STYLE: Record<EntryWeight, WeightStyle> = {
  legendary: { centered: true,  seal: 'lg', title: 'text-4xl sm:text-5xl', flourishes: true  },
  major:     { centered: false, seal: 'lg', title: 'text-3xl sm:text-4xl', flourishes: false },
  standard:  { centered: false, seal: 'md', title: 'text-2xl sm:text-3xl', flourishes: false },
  minor:     { centered: false, seal: 'md', title: 'text-xl sm:text-2xl',  flourishes: false },
  footnote:  { centered: false, seal: 'sm', title: 'text-lg sm:text-xl',   flourishes: false },
};

/** Weight-derived default banner min-height (px), restored by the editor's "Reset". */
const WEIGHT_DEFAULT_HEIGHT: Record<EntryWeight, number> = {
  legendary: 400, major: 360, standard: 320, minor: 260, footnote: 230,
};

/** Default banner crop — biases toward the upper third, matching EntityImage. */
const DEFAULT_BANNER_POSITION = '50% 33%';

interface GlanceFact {
  label: string;
  value: string;
  href?: string;
}

interface EntityHeroProps {
  entry: CodexEntry;
  weight: EntryWeight;
  visual: AtmosphereVisual;
  glanceFacts: GlanceFact[];
}

/**
 * Full-bleed hero banner: an EntityImage behind a dark bottom gradient, with
 * breadcrumb at top, and at bottom-left: seal + title + type + blurb epigraph +
 * tag chips. Followed directly by a horizontal "at a glance" stat strip.
 */
export function EntityHero({ entry, weight, visual, glanceFacts }: EntityHeroProps) {
  const w = WEIGHT_STYLE[weight];
  const parent = entry.partOf ?? null;
  const accent = atmosRgba(visual, 1);
  const accentFaint = atmosRgba(visual, 0.18);

  const gradient = `linear-gradient(to bottom,
    ${accentFaint} 0%,
    rgba(15,13,10,0.1) 30%,
    rgba(15,13,10,0.55) 55%,
    rgba(15,13,10,0.92) 100%)`;
  const defaultHeight = WEIGHT_DEFAULT_HEIGHT[weight];
  const initialHeight = entry.bannerHeight ?? defaultHeight;
  const initialPosition = entry.bannerPosition ?? DEFAULT_BANNER_POSITION;

  return (
    <>
      {/* ── Hero banner ─────────────────────────────────────────────────── */}
      <HeroFrame
        entry={entry}
        visual={visual}
        gradient={gradient}
        flourishes={w.flourishes}
        initialPosition={initialPosition}
        initialHeight={initialHeight}
        defaultPosition={DEFAULT_BANNER_POSITION}
        defaultHeight={defaultHeight}
      >
        {/* Breadcrumb — top-left overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 max-w-6xl mx-auto px-6 pt-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-ink-muted"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
          >
            <Link href="/codex" className="hover:text-gold transition-colors">Codex</Link>
            {parent && (
              <>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <Link href={`/codex/${parent.id}`} className="hover:text-gold transition-colors truncate max-w-[14rem]">
                  {parent.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 opacity-60" />
            <span className="text-ink/80 truncate max-w-[14rem]">{entry.name}</span>
          </nav>
        </div>

        {/* Bottom overlay content */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-10 max-w-6xl mx-auto px-6 pb-8 pt-12 ${w.centered ? 'text-center' : ''}`}
        >
          {/* Seal + title row */}
          <div className={`flex items-center gap-3 ${w.centered ? 'flex-col' : ''}`}>
            <EntitySeal entry={entry} visual={visual} size={w.seal} />
            <div className={w.centered ? '' : 'min-w-0'}>
              <h1
                className={`font-display font-semibold text-ink leading-tight ${w.title}`}
                style={{ textShadow: '0 2px 16px rgba(0,0,0,0.95)' }}
              >
                {entry.name}
              </h1>
              <div
                className={`mt-1 flex items-center gap-2.5 text-sm text-ink-muted ${w.centered ? 'justify-center' : ''}`}
              >
                <span aria-hidden className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: accent }} />
                <span className="uppercase tracking-[0.14em] text-xs font-display">
                  {typeLabel(entry)}{parent ? ` · part of ${parent.name}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Blurb as serif-italic epigraph */}
          {entry.blurb && (
            <p
              className={`mt-2 font-serif italic text-[1.05rem] leading-snug max-w-[40rem] ${w.centered ? 'mx-auto' : ''}`}
              style={{
                color: `color-mix(in srgb, var(--ink) 90%, rgb(${visual.rgb.join(',')}))`,
                textShadow: '0 1px 10px rgba(0,0,0,0.95)',
              }}
            >
              &ldquo;{entry.blurb}&rdquo;
            </p>
          )}

          {/* Tag chips */}
          {entry.tags.length > 0 && (
            <div className={`mt-3 flex flex-wrap gap-1.5 ${w.centered ? 'justify-center' : ''}`}>
              {entry.tags.slice(0, 10).map((tag) => (
                <Link
                  key={tag}
                  href={`/codex/tag/${encodeURIComponent(tag)}`}
                  title={`See all entries tagged "${tag}"`}
                  className="px-2 py-0.5 text-[11px] tracking-wide text-ink-muted border rounded-sm transition-colors hover:text-gold hover:shadow-[inset_0_0_0_1px_var(--gold-muted)]"
                  style={{
                    borderColor: atmosRgba(visual, 0.45),
                    background: 'rgba(15,13,10,0.5)',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </HeroFrame>

      {/* ── At-a-glance stat strip ───────────────────────────────────────── */}
      {glanceFacts.length > 0 && (
        <div
          className="border-b border-border"
          style={{
            background: `linear-gradient(180deg, ${atmosRgba(visual, 0.07)}, transparent)`,
          }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <dl className="flex flex-wrap gap-x-6 gap-y-2 py-3">
              {glanceFacts.map(({ label, value, href }) => (
                <div key={label} className="flex flex-col">
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-ink-muted">{label}</dt>
                  <dd className="text-sm font-display text-ink">
                    {href ? (
                      <Link href={href} className="text-gold hover:text-[#f3dd8a] transition-colors">
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
