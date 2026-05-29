import type { SearchEntry, EntryWeight, AtmosphereType } from '@/types/codex';
import { getAtmosphereVisual, type AtmosphereVisual } from '@/lib/atmosphere';

// ─── ranking ───────────────────────────────────────────────────────────────

/** Sort key for entry prominence — lower is weightier. */
export const WEIGHT_RANK: Record<EntryWeight, number> = {
  legendary: 0, major: 1, standard: 2, minor: 3, footnote: 4,
};

// ─── atmosphere by category ──────────────────────────────────────────────────
// SearchEntry carries no tags, so a search result derives its mood from its
// top-level category. Kept here so the landing list and the search overlay tint
// results identically.

export const CATEGORY_ATMOSPHERE: Record<string, AtmosphereType> = {
  geography: 'nature',
  races: 'default',
  creatures: 'dangerous',
  factions: 'civilization',
  magic: 'cursed',
  deities: 'sacred',
  cosmology: 'water',
  history: 'ancient',
  personae: 'default',
  artifacts: 'trade',
};

export function categoryVisual(category: string): AtmosphereVisual {
  const atm = CATEGORY_ATMOSPHERE[category];
  if (!atm) throw new Error(`Unknown category: ${category}`);
  return getAtmosphereVisual(atm);
}

export function entryVisual(entry: SearchEntry): AtmosphereVisual {
  return categoryVisual(entry.category);
}

// ─── scoring ─────────────────────────────────────────────────────────────────

/**
 * Rank a single entry against a lowercased query. Lower is a better match;
 * -1 means "no match". The tiers, best-first: exact name/alias, prefix, word
 * boundary, substring, then weaker fallbacks on entity type and blurb.
 */
export function score(entry: SearchEntry, q: string): number {
  const name = entry.name.toLowerCase();
  const hay = [name, ...(entry.aliases ?? []).map((a) => a.toLowerCase())];
  let best = Infinity;
  for (const h of hay) {
    if (h === q) best = Math.min(best, 0);
    else if (h.startsWith(q)) best = Math.min(best, 1);
    else if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(h)) best = Math.min(best, 2);
    else if (h.includes(q)) best = Math.min(best, 3);
  }
  if (best === Infinity && entry.entityType.toLowerCase().startsWith(q)) best = 4;
  if (best === Infinity && entry.blurb.toLowerCase().includes(q)) best = 5;
  return best === Infinity ? -1 : best;
}

/**
 * Filter + rank the index for a (raw, untrimmed) query string. Returns the best
 * `limit` matches, ordered by match quality, then prominence, then name. An
 * empty query returns `[]`.
 */
export function rankResults(index: SearchEntry[], query: string, limit = 50): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index
    .map((e) => ({ e, s: score(e, q) }))
    .filter((x) => x.s >= 0)
    .sort(
      (a, b) =>
        a.s - b.s ||
        WEIGHT_RANK[a.e.weight] - WEIGHT_RANK[b.e.weight] ||
        a.e.name.localeCompare(b.e.name),
    )
    .slice(0, limit)
    .map((x) => x.e);
}
