'use client';

import type { CodexEntry } from '@/types/codex';
import { getEntryIcon } from '@/lib/entry-weight';

interface MajorEntryProps {
  entry: CodexEntry;
}

/**
 * Major Entry - for capitals, states, daemons
 * Left-aligned, 3xl header, 4xl inline icon
 * 2px parchment-dark bottom border
 */
export function MajorEntry({ entry }: MajorEntryProps) {
  const icon = getEntryIcon(entry);

  return (
    <article className="py-6 px-6 border-b-2 border-parchment-dark">
      {/* Header with inline icon */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl" role="img" aria-hidden="true">
          {icon}
        </span>
        <h1 className="text-3xl font-display font-semibold text-ink">
          {entry.name}
        </h1>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-xs bg-gold/10 border border-gold/30 text-ink rounded-sm"
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
