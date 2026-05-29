'use client';

import { useEffect, useRef, useState } from 'react';
import type { CodexEntry } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { Sigil } from './Sigil';

interface EntityImageProps {
  /** The image URL (an entity's `banner`). When absent, the Sigil is shown alone. */
  src?: string;
  entry: Pick<CodexEntry, 'id' | 'entityType' | 'tags' | 'name'>;
  visual: AtmosphereVisual;
  className?: string;
  /** CSS aspect-ratio value, e.g. `'16 / 9'`, `'1 / 1'`, `'4 / 3'`. */
  aspect?: string;
  /** Fully rounded — for circular framing. */
  rounded?: boolean;
  /** CSS object-position for the cover crop. Defaults to biasing toward the top
   *  of the image (the subject usually sits high), showing ~the upper two-thirds. */
  objectPosition?: string;
}

/**
 * Displays an entity's image (its `banner`) with a `<Sigil>` as a graceful
 * fallback. Most entities have no image yet, so the sigil path is the common
 * case — it renders intentionally and on-brand rather than broken. When `src`
 * is absent we skip the <img> entirely and show only the sigil.
 *
 * CLIENT component (uses useState for the load/error flags).
 */
export function EntityImage({
  src,
  entry,
  visual,
  className = '',
  aspect,
  rounded = false,
  objectPosition = '50% 33%',
}: EntityImageProps) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // With SSR the browser often finishes loading the image BEFORE React attaches
  // the onLoad handler during hydration — so onLoad never fires and the fade-in
  // would be stuck at opacity 0. Reconcile from the DOM on mount / src change.
  useEffect(() => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else setErrored(true);
  }, [src]);

  const borderRadius = rounded ? '9999px' : undefined;
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    borderRadius,
    ...(aspect ? { aspectRatio: aspect } : {}),
  };

  const showImg = Boolean(src) && !errored;

  // The sigil is the base layer and stays until a real image has actually
  // loaded. The <img> fades in on load — so a missing image (the common case
  // today) never flashes a broken-image icon; it just stays a clean sigil.
  return (
    <div className={className} style={wrapperStyle}>
      {(!loaded || !showImg) && (
        <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <SigilFill entry={entry} visual={visual} rounded={rounded} />
        </div>
      )}
      {showImg && (
        <img
          ref={imgRef}
          src={src}
          alt={entry.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
            display: 'block',
            borderRadius,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}
    </div>
  );
}

// ─── internal ───────────────────────────────────────────────────────────────

/** Sigil stretched to fill its container box. */
function SigilFill({
  entry,
  visual,
  rounded,
}: {
  entry: Pick<CodexEntry, 'id' | 'entityType' | 'tags'>;
  visual: AtmosphereVisual;
  rounded: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(26,22,18,0.95)',
        borderRadius: rounded ? '9999px' : undefined,
      }}
      aria-hidden="true"
    >
      <Sigil
        entry={entry}
        visual={visual}
        size={256}
        className="entity-image__sigil"
      />
    </div>
  );
}
