'use client';

import type { CodexEntry } from '@/types/codex';

interface FootnoteEntryProps {
  entry: CodexEntry;
}

/**
 * Footnote Entry - for brief references (<10 lines)
 * base inline header, no icon
 * Very compact, no borders
 */
export function FootnoteEntry({ entry }: FootnoteEntryProps) {
  return (
    <article className="py-2 px-6">
      {/* Header - no icon */}
      <h1 className="inline text-base font-display font-semibold text-ink mr-2">
        {entry.name}
      </h1>

      {/* Tags inline */}
      {entry.tags.length > 0 && (
        <span className="inline-flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-1.5 py-0.5 text-xs bg-gold/10 border border-gold/30 text-ink rounded-sm"
            >
              {tag}
            </span>
          ))}
        </span>
      )}

      {/* Content inline */}
      <div className="inline prose prose-sm prose-parchment text-ink leading-relaxed ml-2">
        {entry.content}
      </div>
    </article>
  );
}
