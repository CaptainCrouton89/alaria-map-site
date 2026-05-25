'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { TILES_BASE_URL, fetchTileConfig } from '@/lib/tiles';

interface MiniMapProps {
  /** Entity id, for the "open full map" deep link. */
  id: string;
  /** Image-pixel coordinates [x, y] (top-left origin), as stored on the entity. */
  coordinates: [number, number];
  zoomLevel?: number;
  accent: string;
}

/**
 * A small, non-interactive tile map centred on the entity — "where in the world
 * this is." Mirrors InteractiveMap's L.CRS.Simple setup (y placed at -y) so the
 * framing matches the full map exactly. Clicking opens the full map at this spot.
 */
export function MiniMap({ id, coordinates, zoomLevel, accent }: MiniMapProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import('leaflet').Map | undefined;

    (async () => {
      const L = (await import('leaflet')).default;
      const config = await fetchTileConfig();
      if (cancelled || !ref.current) return;

      const scale = Math.pow(2, config.maxZoom);
      const tilesX = Math.ceil(config.imageWidth / (config.tileSize * scale));
      const tilesY = Math.ceil(config.imageHeight / (config.tileSize * scale));
      const bounds = L.latLngBounds([-tilesY * config.tileSize, 0], [0, tilesX * config.tileSize]);

      const [x, y] = coordinates;
      const z = Math.min(Math.max(zoomLevel ?? 3, config.minZoom), config.maxZoom);

      map = L.map(ref.current, {
        crs: L.CRS.Simple,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        preferCanvas: true,
        fadeAnimation: false,
      });

      L.tileLayer(`${TILES_BASE_URL}/{z}/{x}/{y}.webp`, {
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        noWrap: true,
        tileSize: config.tileSize,
        bounds,
      }).addTo(map);

      map.setView([-y, x], z);

      // Marker: a soft halo + crisp dot in the atmosphere hue.
      L.circleMarker([-y, x], {
        radius: 11, color: accent, weight: 1, opacity: 0.35, fillColor: accent, fillOpacity: 0.12,
      }).addTo(map);
      L.circleMarker([-y, x], {
        radius: 4.5, color: '#1a1612', weight: 1.5, fillColor: accent, fillOpacity: 1,
      }).addTo(map);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [id, coordinates, zoomLevel, accent]);

  return (
    <Link
      href={`/?loc=${id}`}
      className="group relative block overflow-hidden rounded border border-border"
      aria-label="View on the full map"
    >
      <div ref={ref} className="h-[150px] w-full bg-parchment-dark" />
      {/* Frame + click affordance */}
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/30" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-sm bg-parchment-dark/85 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink-muted opacity-0 transition-opacity group-hover:opacity-100">
        <Maximize2 className="h-3 w-3" />
        Open map
      </span>
    </Link>
  );
}
