'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Shuffle } from 'lucide-react';
import type { SearchEntry } from '@/types/codex';
import { entryVisual, rankResults } from '@/lib/codex-search';
import { EntitySeal } from '@/components/codex/EntitySeal';

interface CodexSearchProps {
  open: boolean;
  onClose: () => void;
}

const MAX_RESULTS = 50;

// ── module-level index cache ─────────────────────────────────────────────────
// The whole codex search index (public/codex-search.json) is ~800KB, so we fetch
// it once and share it across every place the palette opens. The landing page
// fetches the same file, so by the time the palette opens there it's usually
// already in the browser's HTTP cache too.
let cachedIndex: SearchEntry[] | null = null;
let inflight: Promise<SearchEntry[]> | null = null;

function loadIndex(): Promise<SearchEntry[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex);
  if (!inflight) {
    inflight = fetch('/codex-search.json')
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        cachedIndex = data;
        return data;
      })
      .catch(() => {
        inflight = null; // allow a retry on the next open
        return [];
      });
  }
  return inflight;
}

export function CodexSearch({ open, onClose }: CodexSearchProps) {
  const router = useRouter();
  const [index, setIndex] = useState<SearchEntry[] | null>(cachedIndex);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Load the index the first time the palette opens; focus the field every open.
  useEffect(() => {
    if (!open) return;
    if (!index) loadIndex().then(setIndex);
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [open, index]);

  // Lock body scroll while the palette is up so the page behind it doesn't move.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const results = useMemo(
    () => (index ? rankResults(index, query, MAX_RESULTS) : []),
    [index, query],
  );

  // Reset the highlight to the first row whenever the query changes. Adjusting
  // state during render (the React-recommended pattern for deriving state from a
  // prior value) keeps activeIndex in range without a cascading effect.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  // Scroll the highlighted row into view as the user arrows through.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!open) return null;

  const close = () => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  };

  const go = (id: string) => {
    router.push(`/codex/${id}`);
    close();
  };

  const wander = () => {
    if (!index?.length) return;
    const e = index[Math.floor(Math.random() * index.length)];
    go(e.id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        wander();
        return;
      }
      const choice = results[activeIndex];
      if (choice) go(choice.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center pt-[12vh] px-4"
      onMouseDown={close}
      role="presentation"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(15,13,10,0.55)', backdropFilter: 'blur(3px)' }} />

      {/* Palette */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the Codex"
        className="relative w-[600px] max-w-[92vw] rounded-lg overflow-hidden flex flex-col"
        style={{
          background: 'var(--parchment-light)',
          border: '1px solid var(--gold-muted)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(201,162,39,0.12)',
          maxHeight: '76vh',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Search field */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--gold-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search the Codex — places, powers, people…"
            aria-label="Search the Codex"
            className="flex-1 bg-transparent outline-none text-lg font-display placeholder:text-ink-muted"
            style={{ color: 'var(--ink)', letterSpacing: '0.01em' }}
          />
          <kbd
            className="font-mono text-[10px] px-1.5 py-0.5 rounded shrink-0"
            style={{ background: 'rgba(232,224,208,0.08)', border: '1px solid var(--border)', color: 'var(--ink-muted)' }}
          >
            esc
          </kbd>
        </div>

        {/* Results / states */}
        {!index ? (
          <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>
            Opening the archive…
          </div>
        ) : !query.trim() ? (
          <div className="px-4 py-7 text-center text-sm" style={{ color: 'var(--ink-muted)' }}>
            Type to search the world of Alaria.
            <div className="mt-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
              Press <Kbd>⇧</Kbd> <Kbd>↵</Kbd> to wander to a random entry.
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm italic" style={{ color: 'var(--ink-muted)' }}>
            No entries match &ldquo;{query.trim()}&rdquo;.
          </div>
        ) : (
          <ul ref={listRef} className="overflow-y-auto py-1" style={{ minHeight: 0 }}>
            {results.map((entry, i) => (
              <ResultRow
                key={entry.id}
                entry={entry}
                active={i === activeIndex}
                onActivate={() => setActiveIndex(i)}
                onSelect={() => go(entry.id)}
              />
            ))}
          </ul>
        )}

        {/* Footer hints */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-2 text-[11px] border-t"
          style={{ borderColor: 'var(--border)', color: 'var(--ink-muted)', background: 'rgba(15,13,10,0.25)' }}
        >
          <span className="flex items-center gap-3">
            <span><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
            <span><Kbd>↵</Kbd> open</span>
          </span>
          <button
            type="button"
            onClick={wander}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-gold cursor-pointer"
          >
            <Shuffle className="w-3 h-3" />
            Wander <Kbd>⇧</Kbd><Kbd>↵</Kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="font-mono text-[10px] px-1 py-0.5 rounded mx-0.5"
      style={{ background: 'rgba(232,224,208,0.08)', border: '1px solid var(--border)' }}
    >
      {children}
    </kbd>
  );
}

function ResultRow({
  entry,
  active,
  onActivate,
  onSelect,
}: {
  entry: SearchEntry;
  active: boolean;
  onActivate: () => void;
  onSelect: () => void;
}) {
  const visual = entryVisual(entry);
  const [r, g, b] = visual.rgb;
  return (
    <li data-active={active}>
      <button
        type="button"
        onMouseEnter={onActivate}
        onClick={onSelect}
        className="group w-full flex items-center gap-3 pl-4 pr-3.5 py-2.5 text-left transition-colors cursor-pointer relative"
        style={{ background: active ? `rgba(${r},${g},${b},0.12)` : 'transparent' }}
      >
        {/* atmosphere spine */}
        <span
          aria-hidden
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 3, background: `rgba(${r},${g},${b},${active ? 1 : 0.6})` }}
        />
        <EntitySeal entry={{ entityType: entry.entityType, tags: [] }} visual={visual} size="sm" />
        <span className="flex flex-col min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span
              className="font-display truncate transition-colors"
              style={{ fontSize: '1rem', color: active ? 'var(--gold)' : 'var(--ink)' }}
            >
              {entry.name}
            </span>
            <span className="text-[10px] uppercase tracking-[0.12em] shrink-0" style={{ color: 'var(--ink-muted)' }}>
              {entry.entityType}
            </span>
          </span>
          {entry.blurb && (
            <span className="text-sm truncate" style={{ color: 'var(--ink-muted)' }}>
              {entry.blurb}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}
