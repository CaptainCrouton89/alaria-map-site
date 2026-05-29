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
/** A paragraph whose only meaningful child is an image — markdown wraps a lone
 *  `![](…)` in a <p>, but our img renderer emits a block <figure>, which is
 *  illegal (and a hydration error) inside a <p>. Unwrap those paragraphs. */
function isLoneImageParagraph(node: unknown): boolean {
  const children = (node as { children?: Array<{ type: string; tagName?: string; value?: string }> })?.children;
  if (!Array.isArray(children)) return false;
  const meaningful = children.filter(
    (c) => !(c.type === 'text' && typeof c.value === 'string' && c.value.trim() === ''),
  );
  return meaningful.length === 1 && meaningful[0].type === 'element' && meaningful[0].tagName === 'img';
}

const components: Components = {
  p({ node, children }) {
    if (isLoneImageParagraph(node)) return <>{children}</>;
    return <p>{children}</p>;
  },
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
  // Body illustrations (type-2 images authored inline) render as a centered
  // figure; the alt text becomes an italic caption. Oil paintings — upright
  // (3:4) for figures, landscape (4:3) for scenes — so we just cap the width.
  img({ src, alt }) {
    if (typeof src !== 'string') return null;
    const caption = typeof alt === 'string' ? alt : '';
    return (
      <figure className="my-8 not-prose mx-auto" style={{ maxWidth: '560px' }}>
        <img
          src={src}
          alt={caption}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto rounded border border-border/60"
        />
        {caption && (
          <figcaption className="mt-2 text-center font-serif italic text-[0.85rem] text-ink-muted">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
};

export function MarkdownContent({ content }: { content: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>;
}
