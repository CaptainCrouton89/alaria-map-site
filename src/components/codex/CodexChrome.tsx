'use client';

import { useEffect, useState } from 'react';
import { PrimaryNav } from '@/components/PrimaryNav';
import { CodexSearch } from '@/components/codex/CodexSearch';

/**
 * Persistent codex chrome: the shared {@link PrimaryNav} cluster plus the search
 * overlay it opens. Mounted on every codex surface (landing, entity, tag) so
 * search and the Map↔Codex switch are reachable from anywhere — including deep
 * entity pages, which otherwise have no navigation but the breadcrumb.
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
      <PrimaryNav active="codex" onSearch={() => setSearchOpen(true)} searchKbd="f" />
      <CodexSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
