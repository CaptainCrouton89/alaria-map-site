import type { CodexEntry, EntryWeight } from '@/types/codex';

/**
 * Calculate the display weight of a codex entry based on tags and content length.
 * Manual override takes precedence over automatic calculation.
 */
export function calculateEntryWeight(entry: CodexEntry): EntryWeight {
  // Manual override takes precedence
  if (entry.weight) {
    return entry.weight;
  }

  const { tags, content } = entry;

  // Legendary: gods, dragons
  if (tags.some((t) => ['god', 'dragon'].includes(t))) {
    return 'legendary';
  }

  // Major: capitals, states, daemons
  if (tags.some((t) => ['capital', 'state', 'daemon'].includes(t))) {
    return 'major';
  }

  // Standard: cities, factions, points of interest, regions
  if (tags.some((t) => ['city', 'faction', 'poi', 'region'].includes(t))) {
    return 'standard';
  }

  // Minor: creatures, items, settlements
  if (tags.some((t) => ['creature', 'item', 'settlement'].includes(t))) {
    return 'minor';
  }

  // Footnote: very short content (less than 10 lines)
  if (content.split('\n').length < 10) {
    return 'footnote';
  }

  // Default to standard if no other criteria match
  return 'standard';
}

/**
 * Map primary tag to an emoji icon for visual representation.
 * Uses first matching tag in priority order.
 */
export function getEntryIcon(entry: CodexEntry): string {
  const { tags } = entry;

  // Entity types
  if (tags.includes('god')) return '✨';
  if (tags.includes('dragon')) return '🐉';
  if (tags.includes('daemon')) return '👹';
  if (tags.includes('creature')) return '🦎';

  // Location types
  if (tags.includes('capital')) return '👑';
  if (tags.includes('city')) return '🏰';
  if (tags.includes('settlement')) return '🏘️';
  if (tags.includes('state')) return '🗺️';
  if (tags.includes('region')) return '🌍';
  if (tags.includes('poi')) return '📍';

  // Organization types
  if (tags.includes('faction')) return '⚔️';

  // Object types
  if (tags.includes('item')) return '💎';
  if (tags.includes('artifact')) return '🔮';

  // Event types
  if (tags.includes('event')) return '📜';

  // Person types
  if (tags.includes('npc')) return '🧑';

  // Default icon
  return '📖';
}
