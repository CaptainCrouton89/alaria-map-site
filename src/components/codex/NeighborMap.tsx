import Link from 'next/link';

export interface MapPoint {
  id: string;
  name: string;
  coordinates: [number, number];
}

interface NeighborMapProps {
  center: { name: string; coordinates: [number, number] };
  neighbors: MapPoint[];
  accent: string;
}

const W = 290;
const H = 196;
const PAD = 30;

function truncate(s: string, n = 16) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

/**
 * A schematic adjacency map: the current entity at the hub with its neighbours
 * plotted at their true world coordinates (x→east, y→south, matching the map
 * image's top-left origin). Connector spokes + clickable labels. This turns the
 * symmetric "borders" relation from a flat chip list into a spatial picture.
 */
export function NeighborMap({ center, neighbors, accent }: NeighborMapProps) {
  const pts = [
    { ...center, id: '__self', self: true },
    ...neighbors.map((n) => ({ ...n, self: false })),
  ];

  const xs = pts.map((p) => p.coordinates[0]);
  const ys = pts.map((p) => p.coordinates[1]);
  let minX = Math.min(...xs), maxX = Math.max(...xs);
  let minY = Math.min(...ys), maxY = Math.max(...ys);
  // Guard against a degenerate (single-axis) spread.
  if (maxX - minX < 1) { minX -= 1; maxX += 1; }
  if (maxY - minY < 1) { minY -= 1; maxY += 1; }

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale = Math.min((W - 2 * PAD) / spanX, (H - 2 * PAD) / spanY);
  // Centre the cloud within the frame.
  const offX = (W - spanX * scale) / 2;
  const offY = (H - spanY * scale) / 2;
  const project = ([x, y]: [number, number]): [number, number] => [
    offX + (x - minX) * scale,
    offY + (y - minY) * scale,
  ];

  const [cx, cy] = project(center.coordinates);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`${center.name} and its neighbours`}
      className="block"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="nm-hub" cx="40%" cy="35%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* Spokes */}
      {neighbors.map((n) => {
        const [nx, ny] = project(n.coordinates);
        return (
          <line
            key={`l-${n.id}`}
            x1={cx} y1={cy} x2={nx} y2={ny}
            stroke={accent} strokeOpacity={0.35} strokeWidth={1}
          />
        );
      })}

      {/* Neighbour nodes */}
      {neighbors.map((n) => {
        const [nx, ny] = project(n.coordinates);
        const anchorEnd = nx > W * 0.62;
        const tx = anchorEnd ? nx - 7 : nx + 7;
        return (
          <Link key={n.id} href={`/codex/${n.id}`} className="codex-mapnode">
            <circle cx={nx} cy={ny} r={3.5} fill="var(--ink-muted)" />
            <text
              x={tx} y={ny + 3}
              textAnchor={anchorEnd ? 'end' : 'start'}
              fontSize={10}
              fill="var(--ink)"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {truncate(n.name)}
            </text>
          </Link>
        );
      })}

      {/* Hub */}
      <circle cx={cx} cy={cy} r={11} fill="url(#nm-hub)" />
      <circle cx={cx} cy={cy} r={5} fill={accent} stroke="var(--parchment)" strokeWidth={1.5} />
    </svg>
  );
}
