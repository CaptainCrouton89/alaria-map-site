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
    </div>
  );
}
