/**
 * Deterministic 32-bit FNV-1a hash of a string.
 * Stable across environments — no Math.random, no Date, no env-specific APIs.
 * Used by `Sigil` to derive its generative crest geometry from the entity id.
 */
export function hashString(s: string): number {
  let hash = 0x811c9dc5; // FNV offset basis (32-bit)
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    // Multiply by FNV prime (32-bit): 0x01000193
    // JavaScript bitwise ops work on 32-bit signed integers, so >>> 0 keeps unsigned.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}
