'use client';

import { useCallback, useRef, useState } from 'react';
import { Check, GripHorizontal, Loader2, Move, RotateCcw, TriangleAlert } from 'lucide-react';
import type { CodexEntry } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { useAdmin } from '@/hooks/useAdmin';
import { EntityImage } from './EntityImage';

const MIN_HEIGHT = 140;
const MAX_HEIGHT = 1000;

interface HeroFrameProps {
  entry: CodexEntry;
  visual: AtmosphereVisual;
  /** CSS background string for the dark bottom gradient overlay. */
  gradient: string;
  flourishes: boolean;
  /** Resolved initial crop position ("50% 33%") — override or default. */
  initialPosition: string;
  /** Resolved initial banner min-height (px) — override or weight default. */
  initialHeight: number;
  /** Weight-derived defaults, restored by "Reset". */
  defaultPosition: string;
  defaultHeight: number;
  /** Server-rendered overlay content (breadcrumb + title block). */
  children: React.ReactNode;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function parseY(pos: string): number {
  const parts = pos.trim().split(/\s+/);
  const n = parseFloat(parts[1] ?? parts[0] ?? '50');
  return Number.isFinite(n) ? n : 50;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * The full-bleed hero header. For everyone it just renders the banner image,
 * gradient, and the server-supplied overlay. For a logged-in admin it adds an
 * "Adjust banner" mode: drag the image to reposition the crop, drag the bottom
 * handle to resize, and each gesture autosaves to the entity .md frontmatter.
 */
export function HeroFrame({
  entry,
  visual,
  gradient,
  flourishes,
  initialPosition,
  initialHeight,
  defaultPosition,
  defaultHeight,
  children,
}: HeroFrameProps) {
  const { isAdmin } = useAdmin();
  const hasBanner = Boolean(entry.banner);

  const [editing, setEditing] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [height, setHeight] = useState(initialHeight);
  const [status, setStatus] = useState<SaveStatus>('idle');

  const headerRef = useRef<HTMLElement>(null);
  // Latest committed values, read on pointer-up (state closures can lag a drag).
  const liveRef = useRef({ position: initialPosition, height: initialHeight });
  const dragRef = useRef<{
    mode: 'move' | 'resize';
    startClientY: number;
    startY: number;
    startHeight: number;
  } | null>(null);

  // Serialized, latest-wins saver so rapid drags never overlap requests.
  const savingRef = useRef(false);
  const pendingRef = useRef<{ position: string | null; height: number | null } | null>(null);

  const flush = useCallback(async () => {
    if (savingRef.current) return;
    const payload = pendingRef.current;
    if (!payload) return;
    pendingRef.current = null;
    savingRef.current = true;
    setStatus('saving');
    try {
      const res = await fetch('/api/codex/banner', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, ...payload }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('saved');
    } catch {
      setStatus('error');
    } finally {
      savingRef.current = false;
      if (pendingRef.current) void flush();
    }
  }, [entry.id]);

  const save = useCallback(
    (pos: string | null, h: number | null) => {
      pendingRef.current = { position: pos, height: h };
      void flush();
    },
    [flush],
  );

  const beginDrag = (mode: 'move' | 'resize') => (e: React.PointerEvent) => {
    if (!editing) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    dragRef.current = {
      mode,
      startClientY: e.clientY,
      startY: parseY(liveRef.current.position),
      startHeight: liveRef.current.height,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const delta = e.clientY - d.startClientY;
    if (d.mode === 'move') {
      const boxH = headerRef.current?.offsetHeight || liveRef.current.height;
      // Drag down → reveal the top of the image → object-position Y decreases.
      const y = clamp(d.startY - (delta / boxH) * 100, 0, 100);
      const next = `50% ${y.toFixed(1)}%`;
      liveRef.current.position = next;
      setPosition(next);
    } else {
      const h = clamp(Math.round(d.startHeight + delta), MIN_HEIGHT, MAX_HEIGHT);
      liveRef.current.height = h;
      setHeight(h);
    }
  };

  const endDrag = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    save(liveRef.current.position, liveRef.current.height);
  };

  const reset = () => {
    liveRef.current = { position: defaultPosition, height: defaultHeight };
    setPosition(defaultPosition);
    setHeight(defaultHeight);
    save(null, null);
  };

  return (
    <header
      ref={headerRef}
      className="relative overflow-hidden border-b border-border"
      style={{ minHeight: `${height}px` }}
    >
      {/* Background: full-bleed banner image (sigil fallback handled inside) */}
      <div className="absolute inset-0">
        <EntityImage
          src={entry.banner}
          entry={entry}
          visual={visual}
          className="w-full h-full"
          objectPosition={position}
        />
      </div>

      {/* Dark bottom gradient so the overlay text reads clearly */}
      <div className="pointer-events-none absolute inset-0" style={{ background: gradient }} />

      {flourishes && (
        <>
          <div className="corner-flourish corner-flourish-tl" />
          <div className="corner-flourish corner-flourish-tr" />
        </>
      )}

      {children}

      {/* ── Admin: banner crop editor ──────────────────────────────────────── */}
      {isAdmin && hasBanner && (
        <div
          className={`absolute right-3 z-40 flex flex-col items-end gap-2 ${
            editing ? 'bottom-6' : 'bottom-3'
          }`}
        >
          {!editing ? (
            <button
              onClick={() => {
                setEditing(true);
                setStatus('idle');
              }}
              className="flex items-center gap-1.5 rounded-md border border-[#4d4436] bg-[#2c2416]/90 px-2.5 py-1.5 text-xs font-medium text-[#e8e0d0] shadow-lg backdrop-blur-sm transition hover:text-[#c9a227]"
            >
              <Move className="h-3.5 w-3.5" />
              Adjust banner
            </button>
          ) : (
            <div className="w-52 rounded-lg border border-[#4d4436] bg-[#2c2416]/95 p-3 text-[#e8e0d0] shadow-xl backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-[11px] text-[#9a8f7a]">
                <GripHorizontal className="h-3.5 w-3.5" />
                Drag image · drag base to resize
              </p>
              <dl className="mt-2 flex justify-between text-xs tabular-nums">
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-[#9a8f7a]">Vertical</dt>
                  <dd>{parseY(position).toFixed(0)}%</dd>
                </div>
                <div className="text-right">
                  <dt className="text-[10px] uppercase tracking-wide text-[#9a8f7a]">Height</dt>
                  <dd>{height}px</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-[11px] text-[#9a8f7a] transition hover:text-[#c9a227]"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded bg-[#c9a227] px-2.5 py-1 text-[11px] font-medium text-[#1a1612] transition hover:bg-[#d9b237]"
                >
                  Done
                </button>
              </div>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-[#9a8f7a]">
                {status === 'saving' && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                  </>
                )}
                {status === 'saved' && (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Saved
                  </>
                )}
                {status === 'error' && (
                  <>
                    <TriangleAlert className="h-3 w-3 text-red-400" /> Save failed
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Drag surfaces — only mounted in edit mode, above the overlay (z-10). */}
      {editing && (
        <>
          <div
            className="absolute inset-0 z-20"
            style={{ cursor: dragRef.current?.mode === 'move' ? 'grabbing' : 'grab' }}
            onPointerDown={beginDrag('move')}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
          <div
            className="absolute inset-x-0 bottom-0 z-30 flex h-4 items-center justify-center"
            style={{ cursor: 'ns-resize', background: 'rgba(201,162,39,0.28)' }}
            onPointerDown={beginDrag('resize')}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <GripHorizontal className="h-3 w-3 text-[#1a1612]/70" />
          </div>
          <div className="pointer-events-none absolute inset-0 z-30 ring-2 ring-inset ring-[#c9a227]/60" />
        </>
      )}
    </header>
  );
}
