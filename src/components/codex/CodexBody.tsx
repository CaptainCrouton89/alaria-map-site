import type { CodexEntry, EntryWeight } from '@/types/codex';
import { MarkdownContent } from './MarkdownContent';

interface CodexBodyProps {
  entry: CodexEntry;
  weight: EntryWeight;
}

/**
 * The reading column: the entity's body rendered as styled prose.
 * Weighty entries (legendary/major) open with an illuminated initial.
 */
export function CodexBody({ entry, weight }: CodexBodyProps) {
  const dropcap = weight === 'legendary' || weight === 'major';
  return (
    <div className={`codex-prose${dropcap ? ' codex-prose--dropcap' : ''}`}>
      <MarkdownContent content={entry.content} />
      {entry.mechanics && (
        <details className="codex-mechanics mt-8 border-t border-border pt-4">
          <summary className="cursor-pointer select-none text-sm font-medium uppercase tracking-wide text-ink-muted hover:text-gold transition-colors">
            Game mechanics
          </summary>
          <div className="mt-4">
            <MarkdownContent content={entry.mechanics} />
          </div>
        </details>
      )}
    </div>
  );
}
