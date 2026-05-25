import type { AtmosphereType, AtmosphereStyle } from '@/types/codex';

/**
 * Atmosphere styles: subtle tints (2-6% opacity) for emotional resonance.
 * Applied to entry container backgrounds for ambient atmosphere.
 */
export const ATMOSPHERE_STYLES: Record<AtmosphereType, AtmosphereStyle> = {
  civilization: { tint: 'rgba(201, 162, 39, 0.03)' }, // gold
  sacred: { tint: 'rgba(107, 74, 140, 0.04)' }, // purple
  cursed: { tint: 'rgba(75, 58, 92, 0.06)' }, // dark purple
  ancient: { tint: 'rgba(122, 122, 122, 0.04)' }, // grey
  dangerous: { tint: 'rgba(139, 58, 58, 0.03)' }, // red
  trade: { tint: 'rgba(184, 149, 107, 0.02)' }, // warm tan
  nature: { tint: 'rgba(74, 124, 89, 0.03)' }, // green
  water: { tint: 'rgba(74, 140, 156, 0.03)' }, // blue
  default: { tint: 'rgba(0, 0, 0, 0)' }, // transparent
};

/**
 * Tag priority order for determining atmosphere when multiple tags are present.
 * Higher priority (earlier in array) takes precedence.
 */
export const ATMOSPHERE_PRIORITY: AtmosphereType[] = [
  'cursed',
  'sacred',
  'dangerous',
  'ancient',
  'civilization',
  'trade',
  'nature',
  'water',
  'default',
];

/**
 * Tag to atmosphere type mapping.
 * Used to determine which atmosphere applies based on entry tags.
 */
const TAG_ATMOSPHERE_MAP: Record<string, AtmosphereType> = {
  // Cursed
  cursed: 'cursed',
  daemon: 'cursed',
  undead: 'cursed',
  necromancy: 'cursed',

  // Sacred
  god: 'sacred',
  temple: 'sacred',
  divine: 'sacred',
  holy: 'sacred',
  shrine: 'sacred',

  // Dangerous
  dragon: 'dangerous',
  war: 'dangerous',
  battle: 'dangerous',
  monster: 'dangerous',
  dungeon: 'dangerous',

  // Ancient
  ancient: 'ancient',
  ruins: 'ancient',
  archaeological: 'ancient',
  historical: 'ancient',

  // Civilization
  capital: 'civilization',
  city: 'civilization',
  state: 'civilization',
  kingdom: 'civilization',
  empire: 'civilization',

  // Trade
  trade: 'trade',
  merchant: 'trade',
  market: 'trade',
  commerce: 'trade',

  // Nature
  nature: 'nature',
  wilderness: 'nature',
  forest: 'nature',
  jungle: 'nature',
  mountain: 'nature',

  // Water
  water: 'water',
  ocean: 'water',
  sea: 'water',
  river: 'water',
  coastal: 'water',
};

/**
 * Determine the atmosphere type for an entry based on its tags.
 * Uses priority-based tag analysis: first matching tag in priority order wins.
 */
export function determineAtmosphere(tags: string[]): AtmosphereType {
  // Build a set of applicable atmosphere types from the tags
  const applicableAtmospheres = new Set<AtmosphereType>();

  for (const tag of tags) {
    const atmosphereType = TAG_ATMOSPHERE_MAP[tag.toLowerCase()];
    if (atmosphereType) {
      applicableAtmospheres.add(atmosphereType);
    }
  }

  // If no atmospheres match, return default
  if (applicableAtmospheres.size === 0) {
    return 'default';
  }

  // Return the highest priority atmosphere type
  for (const atmosphereType of ATMOSPHERE_PRIORITY) {
    if (applicableAtmospheres.has(atmosphereType)) {
      return atmosphereType;
    }
  }

  return 'default';
}

/**
 * Get the style configuration for a given atmosphere type.
 */
export function getAtmosphereStyle(type: AtmosphereType): AtmosphereStyle {
  return ATMOSPHERE_STYLES[type];
}

/**
 * Rich visual descriptor for an atmosphere — the "bold & immersive" treatment.
 * `rgb` is the accent hue; everything else (rules, labels, header band, page wash,
 * seal tint, hover borders) is derived from it at the chosen opacity so the whole
 * page reads as one mood without any single element shouting.
 */
export interface AtmosphereVisual {
  type: AtmosphereType;
  /** Human label shown beside the entry; empty string means "don't show a label". */
  label: string;
  /** Accent hue as an [r,g,b] triplet. */
  rgb: [number, number, number];
}

const ATMOSPHERE_VISUALS: Record<AtmosphereType, AtmosphereVisual> = {
  civilization: { type: 'civilization', label: 'Civilization', rgb: [216, 178, 74] },
  sacred:       { type: 'sacred',       label: 'Sacred',       rgb: [169, 136, 214] },
  cursed:       { type: 'cursed',       label: 'Cursed',       rgb: [140, 107, 176] },
  ancient:      { type: 'ancient',      label: 'Ancient',      rgb: [179, 169, 143] },
  dangerous:    { type: 'dangerous',    label: 'Perilous',     rgb: [208, 106, 90] },
  trade:        { type: 'trade',        label: 'Trade',        rgb: [210, 168, 120] },
  nature:       { type: 'nature',       label: 'Wilds',        rgb: [111, 174, 126] },
  water:        { type: 'water',        label: 'Waters',       rgb: [95, 180, 198] },
  default:      { type: 'default',      label: '',             rgb: [182, 155, 84] },
};

export function getAtmosphereVisual(type: AtmosphereType): AtmosphereVisual {
  return ATMOSPHERE_VISUALS[type];
}

/** `rgba(r,g,b,a)` string for an atmosphere accent at the given opacity. */
export function atmosRgba(v: AtmosphereVisual, alpha: number): string {
  const [r, g, b] = v.rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
