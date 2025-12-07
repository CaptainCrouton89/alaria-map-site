'use client';

import type { CodexEntry } from '@/types/codex';
import { getEntryIcon } from '@/lib/entry-weight';

interface StandardEntryProps {
  entry: CodexEntry;
}

/**
 * Standard Entry - for cities, factions, POIs, regions
 * Left-aligned, 2xl header, 2xl inline icon
 * 1px border bottom
 */
export function StandardEntry({ entry }: StandardEntryProps) {
  const icon = getEntryIcon(entry);

  return (
    <article className="py-4 px-6 border-b border-border">
      {/* Header with inline icon */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl" role="img" aria-hidden="true">
          {icon}
        </span>
        <h1 className="text-2xl font-display font-semibold text-ink">
          {entry.name}
        </h1>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gold/10 border border-gold/30 text-ink rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-parchment max-w-none text-ink leading-relaxed">
        {entry.content}
      </div>
    </article>
  );
}
