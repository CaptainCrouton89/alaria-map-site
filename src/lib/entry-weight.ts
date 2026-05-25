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
