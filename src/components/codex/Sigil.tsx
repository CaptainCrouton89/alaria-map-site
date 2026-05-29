import { createElement } from 'react';
import type { CodexEntry } from '@/types/codex';
import type { AtmosphereVisual } from '@/lib/atmosphere';
import { atmosRgba } from '@/lib/atmosphere';
import { getEntityIcon } from './EntitySeal';
import { hashString } from '@/lib/entity-image';

interface SigilProps {
  entry: Pick<CodexEntry, 'id' | 'entityType' | 'tags'>;
  visual: AtmosphereVisual;
  size?: number;
  className?: string;
}

/**
 * Deterministic generative crest — the graceful image fallback.
 *
 * Pattern geometry and rotation are derived from `hashString(entry.id)`, so
 * the same entity always renders the same sigil. Tinted with the atmosphere
 * accent hue. Renders as an inline SVG; no hooks, server-compatible.
 */
export function Sigil({ entry, visual, size = 120, className = '' }: SigilProps) {
  const hash = hashString(entry.id);
  const icon = getEntityIcon(entry);

  // --- deterministic parameters from hash ---
  // Split hash into independent fields by extracting different bit ranges.
  const rotationDeg = (hash & 0xff) * (360 / 256); // outer ring rotation 0–360°
  const innerRotDeg = ((hash >> 8) & 0xff) * (360 / 256); // inner ring rotation
  const patternVariant = (hash >> 16) & 0x03; // 0–3, picks decoration pattern
  const petalCount = 6 + ((hash >> 20) & 0x03); // 6–9 petals on outer ring
  const notchDepth = 0.12 + (((hash >> 24) & 0x0f) / 15) * 0.1; // 0.12–0.22

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.32;
  const iconBoxSize = size * 0.38; // <foreignObject> housing the Lucide icon

  // Accent color references
  const accentStrong = atmosRgba(visual, 0.7);
  const accentMid = atmosRgba(visual, 0.35);
  const accentFaint = atmosRgba(visual, 0.15);
  const accentGlow = atmosRgba(visual, 0.08);

  // --- outer petal ring path ---
  const petalPath = buildPetalRing(cx, cy, outerR, petalCount, notchDepth, rotationDeg);

  // --- inner geometric decoration (variant-dependent) ---
  const innerDeco = buildInnerDecoration(cx, cy, innerR, patternVariant, innerRotDeg, accentMid);

  // Lucide icon renders via foreignObject (server-safe; no hooks)
  const iconEl = createElement(icon, {
    size: Math.round(size * 0.26),
    strokeWidth: 1.4,
    color: accentStrong,
  });

  const uid = `sigil-${entry.id.replace(/[^a-z0-9]/gi, '')}`;
  const gradId = `${uid}-grad`;
  const glowId = `${uid}-glow`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <defs>
        <radialGradient id={gradId} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor={accentFaint} />
          <stop offset="60%" stopColor={accentGlow} />
          <stop offset="100%" stopColor="rgba(15,13,10,0.6)" />
        </radialGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={size * 0.015} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background field */}
      <circle cx={cx} cy={cy} r={outerR + 1} fill="rgba(26,22,18,0.92)" />
      <circle cx={cx} cy={cy} r={outerR + 1} fill={`url(#${gradId})`} />

      {/* Outer petal ring */}
      <path
        d={petalPath}
        fill="none"
        stroke={accentStrong}
        strokeWidth={size * 0.012}
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
        opacity={0.85}
      />

      {/* Inner geometry */}
      {innerDeco}

      {/* Hairline inner ring */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke={accentMid}
        strokeWidth={size * 0.007}
        opacity={0.6}
      />

      {/* Center icon via foreignObject */}
      <foreignObject
        x={cx - iconBoxSize / 2}
        y={cy - iconBoxSize / 2}
        width={iconBoxSize}
        height={iconBoxSize}
      >
        <div
          // @ts-expect-error xmlns is valid on foreignObject children in SVG context
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {iconEl}
        </div>
      </foreignObject>

      {/* Outer border ring */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke={accentStrong}
        strokeWidth={size * 0.009}
        opacity={0.5}
      />
    </svg>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Build an SVG path for a notched/petalled ring (star polygon with smooth arcs). */
function buildPetalRing(
  cx: number,
  cy: number,
  r: number,
  petals: number,
  notch: number,
  startDeg: number,
): string {
  const innerR = r * (1 - notch);
  const halfStep = Math.PI / petals;
  const startRad = (startDeg * Math.PI) / 180;
  const points: [number, number][] = [];

  for (let i = 0; i < petals * 2; i++) {
    const angle = startRad + i * halfStep;
    const radius = i % 2 === 0 ? r : innerR;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }

  return (
    `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)} ` +
    points
      .slice(1)
      .map(([x, y]) => `L ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(' ') +
    ' Z'
  );
}

/** Inner decorative element — four variants keyed off patternVariant 0–3. */
function buildInnerDecoration(
  cx: number,
  cy: number,
  r: number,
  variant: number,
  rotDeg: number,
  stroke: string,
): React.ReactNode {
  const sw = r * 0.025;

  switch (variant) {
    case 0: {
      // Cross + diamond
      const d = r * 0.55;
      return (
        <g
          transform={`rotate(${rotDeg.toFixed(1)} ${cx} ${cy})`}
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
          opacity={0.7}
        >
          <line x1={cx - d} y1={cy} x2={cx + d} y2={cy} />
          <line x1={cx} y1={cy - d} x2={cx} y2={cy + d} />
          <polygon
            points={`${cx},${cy - d * 0.7} ${cx + d * 0.7},${cy} ${cx},${cy + d * 0.7} ${cx - d * 0.7},${cy}`}
          />
        </g>
      );
    }
    case 1: {
      // Tri-spire
      const points = Array.from({ length: 3 }, (_, i) => {
        const a = ((rotDeg + i * 120) * Math.PI) / 180;
        return `${(cx + Math.cos(a) * r * 0.62).toFixed(2)},${(cy + Math.sin(a) * r * 0.62).toFixed(2)}`;
      }).join(' ');
      return (
        <polygon
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          opacity={0.65}
        />
      );
    }
    case 2: {
      // Concentric squares (rotated)
      return (
        <g
          transform={`rotate(${rotDeg.toFixed(1)} ${cx} ${cy})`}
          stroke={stroke}
          strokeWidth={sw}
          fill="none"
          opacity={0.65}
        >
          {[0.62, 0.42].map((scale, i) => {
            const half = r * scale;
            return (
              <rect
                key={i}
                x={cx - half}
                y={cy - half}
                width={half * 2}
                height={half * 2}
                transform={`rotate(${i * 22.5} ${cx} ${cy})`}
              />
            );
          })}
        </g>
      );
    }
    case 3:
    default: {
      // Hexagram (two overlapping triangles)
      const makeTriPoints = (rot: number) =>
        Array.from({ length: 3 }, (_, i) => {
          const a = ((rot + i * 120) * Math.PI) / 180;
          return `${(cx + Math.cos(a) * r * 0.6).toFixed(2)},${(cy + Math.sin(a) * r * 0.6).toFixed(2)}`;
        }).join(' ');
      return (
        <g stroke={stroke} strokeWidth={sw} fill="none" opacity={0.65}>
          <polygon points={makeTriPoints(rotDeg)} />
          <polygon points={makeTriPoints(rotDeg + 180)} />
        </g>
      );
    }
  }
}
