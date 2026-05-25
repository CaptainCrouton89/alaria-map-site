import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CodexEntry, EntryWeight } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { atmosRgba } from '@/lib/atmosphere';
import { EntitySeal } from './EntitySeal';

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
  pad: string;
}

const WEIGHT_STYLE: Record<EntryWeight, WeightStyle> = {
  legendary: { centered: true,  seal: 'lg', title: 'text-4xl sm:text-5xl', flourishes: true,  pad: 'py-14' },
  major:     { centered: false, seal: 'lg', title: 'text-3xl sm:text-4xl', flourishes: false, pad: 'py-10' },
  standard:  { centered: false, seal: 'md', title: 'text-2xl sm:text-3xl', flourishes: false, pad: 'py-9' },
  minor:     { centered: false, seal: 'md', title: 'text-xl sm:text-2xl',  flourishes: false, pad: 'py-8' },
  footnote:  { centered: false, seal: 'sm', title: 'text-lg sm:text-xl',   flourishes: false, pad: 'py-7' },
};

interface EntityHeroProps {
  entry: CodexEntry;
  weight: EntryWeight;
  visual: AtmosphereVisual;
}

/**
 * The masthead of an entry: a full-width atmosphere band carrying the seal, the
 * title, a breadcrumb trail, and the type / atmosphere labels. Scaled by weight.
 */
export function EntityHero({ entry, weight, visual }: EntityHeroProps) {
  const w = WEIGHT_STYLE[weight];
  const parent = entry.partOf ?? null;
  const accent = atmosRgba(visual, 1);

  return (
    <header
      className="relative overflow-hidden border-b border-border"
      style={{
        background: `linear-gradient(180deg, ${atmosRgba(visual, 0.18)} 0%, ${atmosRgba(visual, 0.05)} 48%, transparent 100%)`,
      }}
    >
      {/* Soft directional glow so the band has depth, not a flat wash. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 18% -10%, ${atmosRgba(visual, 0.16)}, transparent 60%)` }}
      />

      {w.flourishes && (
        <>
          <div className="corner-flourish corner-flourish-tl" />
          <div className="corner-flourish corner-flourish-tr" />
        </>
      )}

      <div className={`relative max-w-6xl mx-auto px-6 ${w.pad} ${w.centered ? 'text-center' : ''}`}>
        {/* Breadcrumb trail */}
        <nav
          aria-label="Breadcrumb"
          className={`flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-ink-muted mb-5 ${w.centered ? 'justify-center' : ''}`}
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

        <div className={`flex items-center gap-4 ${w.centered ? 'flex-col' : ''}`}>
          <EntitySeal entry={entry} visual={visual} size={w.seal} />
          <div className={w.centered ? '' : 'min-w-0'}>
            <h1 className={`font-display font-semibold text-ink leading-tight ${w.title}`}>
              {entry.name}
            </h1>
            <div
              className={`mt-2 flex items-center gap-2.5 text-sm text-ink-muted ${w.centered ? 'justify-center' : ''}`}
            >
              <span aria-hidden className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: accent }} />
              <span className="uppercase tracking-[0.14em] text-xs font-display">{typeLabel(entry)}</span>
            </div>
          </div>
        </div>

        {/* Atmosphere rule beneath the title block */}
        <div
          className={`mt-5 h-px ${w.centered ? 'mx-auto w-24' : 'w-full max-w-2xl'}`}
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />

        {entry.tags.length > 0 && (
          <div className={`mt-4 flex flex-wrap gap-1.5 ${w.centered ? 'justify-center' : ''}`}>
            {entry.tags.slice(0, 10).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] tracking-wide text-ink-muted border rounded-sm"
                style={{ borderColor: atmosRgba(visual, 0.35), background: atmosRgba(visual, 0.06) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
