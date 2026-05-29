'use client';

import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders an entity body (markdown) the same way the map sidebar does.
 * Entity bodies are GFM markdown, so render them rather than dumping the source text.
 *
 * Auto-links: the build (scripts/build-codex.mts) bakes [name](/codex/<id>) links into the
 * first occurrence of each related entity in each body. Internal /codex/... hrefs route
 * client-side via next/link; everything else falls through to a normal anchor.
 */
const components: Components = {
  a({ href, children, ...rest }) {
    if (typeof href === 'string' && href.startsWith('/codex/')) {
      return (
        <Link href={href} className="text-gold hover:text-[#f3dd8a] underline underline-offset-2 decoration-gold-muted/50 hover:decoration-gold">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>;
}
