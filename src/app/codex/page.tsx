'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import type { SearchEntry, EntryWeight } from '@/types/codex';
import { EntitySeal } from '@/components/codex/EntitySeal';
import { getAtmosphereVisual } from '@/lib/atmosphere';

const WEIGHT_RANK: Record<EntryWeight, number> = {
  legendary: 0, major: 1, standard: 2, minor: 3, footnote: 4,
};

// Search ships no atmosphere; seals use the neutral hue so the list stays calm.
const NEUTRAL_VISUAL = getAtmosphereVisual('default');

/** Score a candidate against the query. Lower is better; -1 means no match. */
function score(entry: SearchEntry, q: string): number {
  const name = entry.name.toLowerCase();
  const hay = [name, ...(entry.aliases ?? []).map((a) => a.toLowerCase())];
  let best = Infinity;
  for (const h of hay) {
    if (h === q) best = Math.min(best, 0);
    else if (h.startsWith(q)) best = Math.min(best, 1);
    else if (new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(h)) best = Math.min(best, 2);
    else if (h.includes(q)) best = Math.min(best, 3);
  }
  if (best === Infinity && entry.blurb.toLowerCase().includes(q)) best = 4;
  return best === Infinity ? -1 : best;
}

export default function CodexPage() {
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/codex-search.json')
      .then((r) => r.json())
      .then((data: SearchEntry[]) => setIndex(data))
      .catch(() => setIndex([]));
  }, []);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!index) return [];
    if (!q) {
      // No query: offer the most prominent entities as starting points.
      return [...index]
        .sort((a, b) => WEIGHT_RANK[a.weight] - WEIGHT_RANK[b.weight] || a.name.localeCompare(b.name))
        .slice(0, 36);
    }
    return index
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => a.s - b.s || WEIGHT_RANK[a.e.weight] - WEIGHT_RANK[b.e.weight] || a.e.name.localeCompare(b.e.name))
      .slice(0, 60)
      .map((x) => x.e);
  }, [index, q]);

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(180deg, rgba(201,162,39,0.05) 0, transparent 520px), var(--parchment)` }}
    >
      {/* Header */}
      <div className="border-b border-border bg-parchment-dark/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-9 text-center">
          <div className="flex items-center justify-center gap-3 text-gold-muted mb-5" aria-hidden>
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold-muted" />
            <span className="text-gold">❧</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold-muted" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-3">
            The Codex of Alaria
          </h1>
          <p className="text-lg text-ink-muted max-w-xl mx-auto">
            Search the world, then travel by its connections.
          </p>
        </div>

        {/* Search box */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted pointer-events-none" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search places, powers, people…"
            aria-label="Search the codex"
            className="w-full pl-12 pr-4 py-3 rounded-md bg-parchment-light border border-border focus:border-gold outline-none text-ink text-lg font-display transition-colors"
          />
        </div>

        {/* Status / results */}
        {!index ? (
          <p className="text-center text-ink-muted">Loading the archive…</p>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.14em] text-ink-muted mb-4">
              {q
                ? `${results.length}${results.length === 60 ? '+' : ''} result${results.length === 1 ? '' : 's'}`
                : 'Start here — the most prominent entries'}
            </p>
            <ul className="flex flex-col divide-y divide-border/70 border border-border rounded-md overflow-hidden bg-parchment-light/60">
              {results.map((entry) => {
                const prominent = entry.weight === 'legendary' || entry.weight === 'major';
                return (
                  <li key={entry.id}>
                    <Link
                      href={`/codex/${entry.id}`}
                      className="group flex items-center gap-3.5 px-4 py-3 hover:bg-gold/[0.07] transition-colors"
                    >
                      <EntitySeal
                        entry={{ entityType: entry.entityType, tags: [] }}
                        visual={NEUTRAL_VISUAL}
                        size="sm"
                      />
                      <span className="flex flex-col min-w-0 flex-1">
                        <span className="flex items-baseline gap-2.5">
                          <span
                            className={`font-display group-hover:text-gold transition-colors ${prominent ? 'text-ink text-[1.05rem]' : 'text-ink'}`}
                          >
                            {entry.name}
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.12em] text-ink-muted shrink-0">
                            {entry.entityType}
                          </span>
                        </span>
                        {entry.blurb && (
                          <span className="text-sm text-ink-muted truncate">{entry.blurb}</span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
              {q && results.length === 0 && (
                <li className="px-4 py-8 text-center text-ink-muted">No entries match “{query}”.</li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
