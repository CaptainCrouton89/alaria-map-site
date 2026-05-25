'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders an entity body (markdown) the same way the map sidebar does.
 * Entity bodies are GFM markdown, so render them rather than dumping the source text.
 */
export function MarkdownContent({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
}
