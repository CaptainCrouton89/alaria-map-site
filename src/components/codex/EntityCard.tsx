import Link from 'next/link';
import type { CodexEntry, EntryWeight } from '@/types/codex';
import { atmosRgba, determineAtmosphere, getAtmosphereVisual } from '@/lib/atmosphere';
import { calculateEntryWeight } from '@/lib/entry-weight';
import { EntitySeal } from './EntitySeal';
import { EntityImage } from './EntityImage';
import { typeLabel } from './EntityHero';

// Only the two top tiers earn a second-line label; everything else just shows
// its type, so the metadata row stays quiet for the long tail of entries.
const WEIGHT_LABEL: Partial<Record<EntryWeight, string>> = {
  legendary: 'Legendary',
  major: 'Major',
};

interface EntityCardProps {
  entry: CodexEntry;
  className?: string;
}

/**
 * A "profile" preview of one entity: the hero banner image (falling back to the
 * on-brand sigil when the art doesn't exist yet) above a seal, name, type, and
 * blurb. The whole card carries the entity's own atmosphere — accent bar, seal
 * tint, and hover border all derive from the `--ec-accent` hue. Modeled on the
 * feature card in mockups/codex-redesign.html.
 */
export function EntityCard({ entry, className = '' }: EntityCardProps) {
  const visual = getAtmosphereVisual(entry.atmosphere ?? determineAtmosphere(entry.tags));
  const weightLabel = WEIGHT_LABEL[calculateEntryWeight(entry)];

  return (
    <Link
      href={`/codex/${entry.id}`}
      className={`entity-card group ${className}`}
      style={{ '--ec-accent': visual.rgb.join(', ') } as React.CSSProperties}
    >
      {/* atmosphere accent bar */}
      <span className="entity-card__accent" aria-hidden />

      {/* banner preview (sigil fallback for missing art) */}
      <div className="entity-card__banner">
        <EntityImage src={entry.banner} entry={entry} visual={visual} aspect="3 / 1" />
      </div>

      {/* body */}
      <div className="entity-card__body">
        <div className="flex items-center gap-2.5">
          <EntitySeal entry={entry} visual={visual} size="sm" />
          <h3 className="font-display text-[1.05rem] leading-tight text-ink transition-colors group-hover:text-gold">
            {entry.name}
          </h3>
        </div>

        <div className="mt-1.5 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.14em] text-ink-muted">
          <span style={{ color: atmosRgba(visual, 0.9) }}>{typeLabel(entry)}</span>
          {weightLabel && (
            <>
              <span aria-hidden>·</span>
              <span>{weightLabel}</span>
            </>
          )}
        </div>

        {entry.blurb && (
          <p className="entity-card__blurb mt-2 text-sm leading-snug text-ink-muted">{entry.blurb}</p>
        )}
      </div>
    </Link>
  );
}
