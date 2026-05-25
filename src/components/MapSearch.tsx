'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Location } from '@/types/location';
import { LOCATION_COLORS } from '@/types/location';
import { LOCATION_ICONS } from '@/lib/icons';

interface MapSearchProps {
  locations: Location[];
  onSelect: (location: Location) => void;
  onClose: () => void;
}

const MAX_RESULTS = 8;

// Rank a location against the query. Lower score = better match. null = no match.
function scoreLocation(name: string, query: string): number | null {
  const n = name.toLowerCase();
  const q = query.toLowerCase();
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  const wordBoundary = n.includes(` ${q}`);
  if (wordBoundary) return 2;
  if (n.includes(q)) return 3;
  return null;
}

export function MapSearch({ locations, onSelect, onClose }: MapSearchProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return locations
      .map((loc) => ({ loc, score: scoreLocation(loc.name, q) }))
      .filter((r): r is { loc: Location; score: number } => r.score !== null)
      .sort((a, b) => a.score - b.score || a.loc.name.length - b.loc.name.length)
      .slice(0, MAX_RESULTS)
      .map((r) => r.loc);
  }, [query, locations]);

  // Keep the active index in range as results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const choice = results[activeIndex];
      if (choice) onSelect(choice);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center pt-[12vh]"
      onMouseDown={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" />

      {/* Palette */}
      <div
        className="relative w-[520px] max-w-[90vw] bg-sidebar border-2 border-border rounded-lg overflow-hidden shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <svg
            className="w-5 h-5 text-ink-muted shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a place…"
            className="flex-1 bg-transparent outline-none text-ink text-lg font-display placeholder:text-ink-muted"
          />
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-ink/10 rounded border border-border/40 text-ink-muted">
            esc
          </kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-[360px] overflow-y-auto py-1">
            {results.map((loc, i) => {
              const Icon = LOCATION_ICONS[loc.type];
              const color = LOCATION_COLORS[loc.type];
              const isActive = i === activeIndex;
              return (
                <li key={loc.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => onSelect(loc)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive ? 'bg-ink/10' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                    <span className="flex-1 text-ink truncate">{loc.name}</span>
                    <span className="text-xs capitalize text-ink-muted">{loc.type}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {query.trim() && results.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-ink-muted italic">
            No places found.
          </div>
        )}
      </div>
    </div>
  );
}
