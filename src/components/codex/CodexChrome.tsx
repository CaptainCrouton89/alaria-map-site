'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodexSearch } from '@/components/codex/CodexSearch';

/**
 * Persistent codex chrome: a floating top-right control cluster
 * `[ Search f ] [ Map ] [ Codex ]` plus the search overlay it opens. Mounted on
 * every codex surface (landing, entity, tag) so search and the Map↔Codex switch
 * are reachable from anywhere — including deep entity pages, which otherwise have
 * no navigation but the breadcrumb.
 *
 * `f` (matching the map's place-search shortcut) and `/` open the overlay, except
 * while the user is typing in a field or holding a modifier (so Cmd/Ctrl+F still
 * reaches the browser's find).
 */
export function CodexChrome() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (isTyping) return;
      if (e.key === 'f' || e.key === 'F' || e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[1100] flex items-center gap-2">
        <Button
          variant="nav"
          size="sm"
          onClick={() => setSearchOpen(true)}
          aria-label="Search the Codex"
          title="Search the Codex (press f)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd
            className="hidden sm:inline font-mono text-[10px] px-1 py-0.5 rounded ml-0.5"
            style={{ background: 'rgba(232,224,208,0.10)', border: '1px solid var(--border)' }}
          >
            f
          </kbd>
        </Button>

        <Button asChild variant="nav" size="sm">
          <Link href="/" aria-label="Go to the world map">
            <MapIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Map</span>
          </Link>
        </Button>

        <Button asChild variant="nav-active" size="sm">
          <Link href="/codex" aria-label="Go to the Codex home">
            Codex
          </Link>
        </Button>
      </div>

      <CodexSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
