'use client';

import type { CodexEntry } from '@/types/codex';
import { getEntryIcon } from '@/lib/entry-weight';

interface MinorEntryProps {
  entry: CodexEntry;
}

/**
 * Minor Entry - for creatures, items, settlements
 * xl inline header, lg inline icon
 * No borders, compact spacing
 */
export function MinorEntry({ entry }: MinorEntryProps) {
  const icon = getEntryIcon(entry);

  return (
    <article className="py-3 px-6">
      {/* Header with inline icon */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg" role="img" aria-hidden="true">
          {icon}
        </span>
        <h1 className="text-xl font-display font-semibold text-ink">
          {entry.name}
        </h1>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
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
      <div className="prose prose-sm prose-parchment max-w-none text-ink leading-relaxed">
        {entry.content}
      </div>
    </article>
  );
}
