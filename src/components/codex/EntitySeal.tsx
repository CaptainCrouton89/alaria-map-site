import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Map, Trees, Waves, MapPin, Home, Tent, Castle, Shield, Landmark, Crown,
  Sparkles, Flame, Skull, PawPrint, Swords, Gem, User, ScrollText, Orbit,
  Hourglass, Users, BookOpen, Wand2,
} from 'lucide-react';
import type { CodexEntry } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { atmosRgba } from '@/lib/atmosphere';

/** Map a baked entityType to its glyph. These are the types that actually exist in the data. */
const TYPE_ICON: Record<string, LucideIcon> = {
  region: Map,
  wilderness: Trees,
  water: Waves,
  poi: MapPin,
  town: Home,
  village: Tent,
  city: Castle,
  fortress: Shield,
  ruins: Landmark,
  nation: Crown,
  // Forward-looking types (no instances yet, but cheap to support):
  deity: Sparkles,
  daemon: Skull,
  plane: Orbit,
  magic: Wand2,
  event: ScrollText,
  era: Hourglass,
  person: User,
  artifact: Gem,
  race: Users,
  creature: PawPrint,
  faction: Swords,
  overview: BookOpen,
};

/** Tag fallbacks for legendary/mythic entries that predate the entity-type model. */
const TAG_ICON: Array<[string, LucideIcon]> = [
  ['god', Sparkles], ['dragon', Flame], ['daemon', Skull], ['creature', PawPrint],
  ['capital', Crown], ['city', Castle], ['fortress', Shield], ['faction', Swords],
  ['artifact', Gem], ['item', Gem], ['event', ScrollText], ['npc', User],
  ['region', Map], ['water', Waves], ['ruins', Landmark],
];

export function getEntityIcon(entry: Pick<CodexEntry, 'entityType' | 'tags'>): LucideIcon {
  if (entry.entityType && TYPE_ICON[entry.entityType]) return TYPE_ICON[entry.entityType];
  for (const [tag, icon] of TAG_ICON) {
    if (entry.tags?.includes(tag)) return icon;
  }
  return BookOpen;
}

const SIZES = {
  lg: { ring: 76, icon: 32, stroke: 1.4 },
  md: { ring: 50, icon: 22, stroke: 1.5 },
  sm: { ring: 30, icon: 15, stroke: 1.6 },
} as const;

interface EntitySealProps {
  entry: Pick<CodexEntry, 'entityType' | 'tags'>;
  visual: AtmosphereVisual;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * A "wax seal" medallion: a gold ring over an atmosphere-tinted field with the
 * entity's glyph at center. The signature mark of a codex entry.
 */
export function EntitySeal({ entry, visual, size = 'md', className = '' }: EntitySealProps) {
  const icon = getEntityIcon(entry);
  const s = SIZES[size];

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full ${className}`}
      style={{
        width: s.ring,
        height: s.ring,
        background: `radial-gradient(circle at 38% 32%, ${atmosRgba(visual, 0.22)}, ${atmosRgba(visual, 0.05)} 70%, rgba(15,13,10,0.5))`,
        border: '1px solid var(--gold-muted)',
        boxShadow: `inset 0 0 0 1px rgba(201,162,39,0.18), inset 0 2px 6px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.4)`,
      }}
      aria-hidden="true"
    >
      {createElement(icon, { size: s.icon, strokeWidth: s.stroke, className: 'text-gold' })}
    </span>
  );
}
