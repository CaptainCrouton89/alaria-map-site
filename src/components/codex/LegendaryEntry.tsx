'use client';

import type { CodexEntry } from '@/types/codex';
import { getEntryIcon } from '@/lib/entry-weight';

interface LegendaryEntryProps {
  entry: CodexEntry;
}

/**
 * Legendary Entry - for gods, dragons - the grandest treatment
 * Centered layout, 5xl Cinzel header, 6xl icon above
 * Ornate gold corner flourishes, 2px gold top/bottom borders
 */
export function LegendaryEntry({ entry }: LegendaryEntryProps) {
  const icon = getEntryIcon(entry);

  return (
    <article className="relative py-8 px-6 border-t-2 border-b-2 border-gold">
      {/* Corner flourishes */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/30" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold/30" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold/30" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/30" />

      {/* Icon centered above header */}
      <div className="text-center mb-4">
        <span className="text-6xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>

      {/* Centered header */}
      <h1 className="text-5xl font-display font-semibold text-ink text-center mb-6">
        {entry.name}
      </h1>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs bg-gold/10 border border-gold/30 text-ink rounded-sm"
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
