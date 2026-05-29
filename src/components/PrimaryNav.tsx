'use client';

import Link from 'next/link';
import { Search, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrimaryNavProps {
  /** Which surface is current — its pill renders in the active style. */
  active: 'map' | 'codex';
  /** When provided, a Search pill is shown that calls this on click. */
  onSearch?: () => void;
  /** Keyboard hint shown on the Search pill (e.g. 'f'). */
  searchKbd?: string;
}

/**
 * The shared floating navigation cluster — `[ Search f ] [ Map ] [ Codex ]` —
 * pinned top-right on every surface. The map and the codex both render this, so
 * the buttons live on the same side and stay in sync from one source.
 *
 * Its z-index sits below the map's location sidebar (z-1000), so when a place is
 * open the sidebar cleanly covers the cluster rather than colliding with its
 * close button; on the map's default view and across the codex it stays fully
 * visible. Each surface wires its own Search target: the map opens place-search,
 * the codex opens the codex overlay.
 */
export function PrimaryNav({ active, onSearch, searchKbd = 'f' }: PrimaryNavProps) {
  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[900] flex items-center gap-2">
      {onSearch && (
        <Button
          variant="nav"
          size="sm"
          onClick={onSearch}
          aria-label="Search"
          title={`Search (press ${searchKbd})`}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
          <kbd
            className="hidden sm:inline font-mono text-[10px] px-1 py-0.5 rounded ml-0.5"
            style={{ background: 'rgba(232,224,208,0.10)', border: '1px solid var(--border)' }}
          >
            {searchKbd}
          </kbd>
        </Button>
      )}

      <Button asChild variant={active === 'map' ? 'nav-active' : 'nav'} size="sm">
        <Link href="/" aria-label="World map">
          <MapIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Map</span>
        </Link>
      </Button>

      <Button asChild variant={active === 'codex' ? 'nav-active' : 'nav'} size="sm">
        <Link href="/codex" aria-label="Codex">
          Codex
        </Link>
      </Button>
    </div>
  );
}
