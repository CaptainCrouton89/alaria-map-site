/**
 * Shared skip-set for the codex mention-scan.
 *
 * The mention-scan (in `build-codex.mts`) links entity A to entity B when B's `name` appears
 * in A's body as `\b…\b`. Single-word entity names that collide with everyday English vocabulary
 * — a magic element called "Water", a place called "Sometimes" — would otherwise link from
 * every body that uses the word in ordinary prose. Listing them here suppresses the auto-link;
 * authored `relations` edges still resolve normally for intentional cross-references.
 *
 * Imported by:
 *   - scripts/build-codex.mts      (skips during the mention-scan)
 *   - scripts/codex.mts            (lint check warns when a new high-hit single-word name
 *                                   appears that should likely be added here)
 *
 * To add an entry: confirm the name is a real entity AND the corpus uses the word in
 * ordinary prose. Run `node scripts/codex.mts report lint` — the mentionScanCollisions
 * check enumerates candidates with their cross-body hit count.
 */
export const MENTION_SCAN_SKIP_NAMES = new Set<string>([
  'the', 'and', 'for', 'but',
  'bay', 'sea', 'lake', 'hill', 'port', 'fort',
  'east', 'west', 'north', 'south',
  'old', 'new', 'great', 'little', 'upper', 'lower',
  'sometimes', 'edge', 'dark', 'scar',
  // magic-element names — collide with everyday prose
  'water', 'time', 'light', 'fire', 'air', 'force', 'earth', 'void',
  // extraction-artifact / generic-noun entity names
  'era', 'states', 'brown', 'freed',
]);
