'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapConfig, LocationType } from '@/types/location';
import { LOCATION_COLORS } from '@/types/location';
import { getLocationIconSvgV2 } from '@/lib/icons';
import type { PinnedData } from '@/types/pinning';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Visibility tiers based on delta = currentZoom - pin.zoomLevel.
// delta < 0: not yet reached (hidden) · 0: peak · >0: faded background context.
function tierFor(delta: number) {
  if (delta < 0) return null;
  if (delta === 0) return { size: 28, svg: 18, iconOpacity: 1, bgOpacity: 0.7, badgeOpacity: 1 };
  if (delta === 1) return { size: 24, svg: 16, iconOpacity: 0.75, bgOpacity: 0.4, badgeOpacity: 0.7 };
  if (delta === 2) return { size: 20, svg: 14, iconOpacity: 0.5, bgOpacity: 0.25, badgeOpacity: 0.4 };
  return { size: 18, svg: 12, iconOpacity: 0.35, bgOpacity: 0.15, badgeOpacity: 0.25 };
}

// Rebuild a marker layer onto `map`, returning the created markers.
function buildPinLayer(
  map: L.Map,
  data: PinnedData,
  labels: Record<string, string> | undefined,
  currentZoom: number,
  highlightId: string | null | undefined
): L.Marker[] {
  const markers: L.Marker[] = [];
  Object.entries(data).forEach(([id, pinned]) => {
    const isHighlighted = !!highlightId && id === highlightId;
    // Highlighted pins always show (at peak tier) even if zoomed out past them.
    const tier = tierFor(currentZoom - pinned.zoomLevel) ?? (isHighlighted ? tierFor(0)! : null);
    if (!tier) return;

    const [x, y] = pinned.coordinates;
    const latLng: L.LatLngExpression = [-y, x];
    const color = LOCATION_COLORS[pinned.type];
    const iconSvg = getLocationIconSvgV2(pinned.type, color);
    const badgeHtml = tier.badgeOpacity > 0
      ? `<span class="pinned-marker-badge" style="opacity: ${tier.badgeOpacity}">${pinned.zoomLevel}</span>`
      : '';
    const name = labels?.[id];
    const labelOpacity = isHighlighted ? 1 : tier.iconOpacity;
    const labelHtml = name
      ? `<span class="pinned-marker-name${isHighlighted ? ' selected' : ''}" style="opacity: ${labelOpacity};">${escapeHtml(name)}</span>`
      : '';

    const icon = L.divIcon({
      className: `pinned-marker${isHighlighted ? ' selected' : ''}`,
      html: `
        <div class="pinned-marker-container" style="--marker-color: ${color}; width: ${tier.size}px; height: ${tier.size}px;">
          <span class="pinned-marker-bg" style="opacity: ${isHighlighted ? 0.95 : tier.bgOpacity};"></span>
          <span class="pinned-marker-icon" style="opacity: ${isHighlighted ? 1 : tier.iconOpacity};">
            <span style="display: inline-flex; width: ${tier.svg}px; height: ${tier.svg}px;">${iconSvg}</span>
          </span>
          ${badgeHtml}
          ${labelHtml}
        </div>
      `,
      iconSize: [tier.size, tier.size],
      iconAnchor: [tier.size / 2, tier.size / 2],
    });

    markers.push(L.marker(latLng, { icon, interactive: false, keyboard: false }).addTo(map));
  });
  return markers;
}

interface PinningMapProps {
  config: MapConfig;
  tilesPath: string;
  onMapClick: (coords: [number, number], zoom: number) => void;
  pendingCoords: [number, number] | null;
  pendingType: LocationType;
  /** Heavy, stable wiki-pin layer — rebuilt only on zoom. */
  pinnedData: PinnedData;
  /** id → name for the wiki pins. */
  labels?: Record<string, string>;
  /** Small, frequently-changing manual-pin layer — rebuilt on edits. */
  manualData?: PinnedData;
  /** id → name for the manual pins. */
  manualLabels?: Record<string, string>;
  /** Live label rendered next to the pending marker (e.g. the name being typed). */
  pendingLabel?: string;
  /** id of a manual pin to highlight (the one selected for editing). */
  highlightId?: string | null;
  /** image coords to pan the map to when they change (follows the selection). */
  panTo?: [number, number] | null;
}

export function PinningMap({
  config,
  tilesPath,
  onMapClick,
  pendingCoords,
  pendingType,
  pinnedData,
  labels,
  manualData,
  manualLabels,
  pendingLabel,
  highlightId,
  panTo,
}: PinningMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const pendingMarkerRef = useRef<L.Marker | null>(null);
  const pinnedMarkersRef = useRef<L.Marker[]>([]);
  const manualMarkersRef = useRef<L.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = useState(config.minZoom);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Calculate bounds in tile coordinate space (same as InteractiveMap)
    const scale = Math.pow(2, config.maxZoom);
    const tilesX = Math.ceil(config.imageWidth / (config.tileSize * scale));
    const tilesY = Math.ceil(config.imageHeight / (config.tileSize * scale));
    const boundsWidth = tilesX * config.tileSize;
    const boundsHeight = tilesY * config.tileSize;

    // CRS.Simple: origin at bottom-left, y increases upward
    // Our tiles: y=0 at top of image
    // Solution: put image in negative y space so y=0 tile row is at the top
    const bounds = L.latLngBounds([-boundsHeight, 0], [0, boundsWidth]);

    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      maxBounds: bounds.pad(0.1),
      maxBoundsViscosity: 1.0,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
    });

    L.tileLayer(`${tilesPath}/{z}/{x}/{y}.webp`, {
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      noWrap: true,
      tileSize: config.tileSize,
      keepBuffer: 1,
      updateWhenIdle: false,
      updateWhenZooming: false,
      bounds: bounds,
    }).addTo(map);

    map.fitBounds(bounds);

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Click handler for pinning
    map.on('click', (e: L.LeafletMouseEvent) => {
      // Convert from Leaflet coords to image coords
      const x = Math.round(e.latlng.lng);
      const y = Math.round(-e.latlng.lat); // negative y space, so negate
      onMapClick([x, y], map.getZoom());
    });

    leafletMapRef.current = map;

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [config, tilesPath, onMapClick]);

  // Update pending marker
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove old pending marker
    if (pendingMarkerRef.current) {
      pendingMarkerRef.current.remove();
      pendingMarkerRef.current = null;
    }

    if (!pendingCoords) return;

    const [x, y] = pendingCoords;
    // Convert image coords to Leaflet coords (negative y space)
    const latLng: L.LatLngExpression = [-y, x];
    const color = LOCATION_COLORS[pendingType];
    const iconSvg = getLocationIconSvgV2(pendingType, color);
    const labelText = pendingLabel && pendingLabel.trim() ? pendingLabel.trim() : '';
    const labelHtml = labelText
      ? `<span class="pending-marker-label">${escapeHtml(labelText)}</span>`
      : '';

    const icon = L.divIcon({
      className: 'pending-marker',
      html: `
        <div class="pending-marker-container" style="--marker-color: ${color}">
          <span class="pending-marker-pulse"></span>
          <span class="pending-marker-bg"></span>
          <span class="pending-marker-icon">${iconSvg}</span>
          ${labelHtml}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    pendingMarkerRef.current = L.marker(latLng, { icon }).addTo(map);
  }, [pendingCoords, pendingType, pendingLabel]);

  // Pan to follow the selected pin (negative-y image space → Leaflet coords).
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !panTo) return;
    const [x, y] = panTo;
    map.panTo([-y, x]);
  }, [panTo]);

  // Wiki-pin layer: heavy (~1.7k) but stable, so it only rebuilds on zoom.
  // Deliberately excludes highlightId — highlights only apply to manual pins,
  // so editing a manual pin never rebuilds this layer.
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    pinnedMarkersRef.current.forEach((m) => m.remove());
    pinnedMarkersRef.current = buildPinLayer(map, pinnedData, labels, currentZoom, null);
  }, [pinnedData, currentZoom, labels]);

  // Manual-pin layer: small and frequently edited, so rebuilding it on each
  // add/retype/selection is cheap and doesn't touch the wiki layer.
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    manualMarkersRef.current.forEach((m) => m.remove());
    manualMarkersRef.current = manualData
      ? buildPinLayer(map, manualData, manualLabels, currentZoom, highlightId)
      : [];
  }, [manualData, manualLabels, currentZoom, highlightId]);

  return (
    <>
      <style jsx global>{`
        .pending-marker, .pinned-marker {
          background: transparent !important;
          border: none !important;
        }

        .pending-marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .pending-marker-bg {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(250, 248, 243, 0.75);
          border: 2px solid var(--marker-color);
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          z-index: 1;
        }

        .pending-marker-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .pending-marker-icon svg {
          width: 24px;
          height: 24px;
        }

        .pending-marker-label {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 4px;
          white-space: nowrap;
          background: var(--marker-color);
          color: #faf8f3;
          font-size: 12px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.35);
          z-index: 3;
          pointer-events: none;
        }

        .pending-marker-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--marker-color);
          opacity: 0.4;
          animation: pulse 1.5s ease-out infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .pinned-marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 120ms ease, width 120ms ease, height 120ms ease;
        }

        .pinned-marker-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(250, 248, 243, 0.85);
          border: 1.5px solid var(--marker-color);
          box-shadow: 0 1px 2px rgba(0,0,0,0.18);
          z-index: 0;
          transition: opacity 120ms ease;
        }

        .pinned-marker-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }

        .pinned-marker-icon svg {
          width: 100%;
          height: 100%;
        }

        .pinned-marker-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          min-width: 12px;
          height: 12px;
          padding: 0 3px;
          border-radius: 6px;
          background: var(--marker-color);
          color: #faf8f3;
          font-size: 9px;
          font-weight: 600;
          line-height: 12px;
          text-align: center;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          pointer-events: none;
        }

        .leaflet-container {
          background: #e8e0d0;
          cursor: crosshair !important;
        }

        /* Selected pin (Quick Label edit target) */
        .pinned-marker.selected {
          z-index: 1000 !important;
        }
        .pinned-marker.selected .pinned-marker-bg {
          border-width: 2.5px;
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.55), 0 1px 3px rgba(0,0,0,0.3);
        }
        .pinned-marker-name.selected {
          background: var(--marker-color);
          color: #faf8f3;
          border-color: var(--marker-color);
          font-size: 11px;
        }

        /* Name labels baked into each pinned marker */
        .pinned-marker-name {
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translateY(-50%);
          margin-left: 4px;
          white-space: nowrap;
          background: rgba(250, 248, 243, 0.85);
          border: 1px solid #d4c5a9;
          color: #2c2416;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.3;
          padding: 0 4px;
          border-radius: 3px;
          box-shadow: 0 1px 2px rgba(44, 36, 22, 0.2);
          pointer-events: none;
          z-index: 2;
        }

        /* Fix tile seams during pan/zoom */
        .leaflet-tile {
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          outline: 1px solid transparent;
        }

        .leaflet-tile-pane {
          will-change: transform;
        }

        .leaflet-fade-anim .leaflet-tile {
          transition: opacity 0.15s;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(44, 36, 22, 0.15) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }

        .leaflet-control-zoom a {
          background: #faf8f3 !important;
          color: #2c2416 !important;
          border: 1px solid #d4c5a9 !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 30px !important;
          font-weight: 500 !important;
        }

        .leaflet-control-zoom a:hover {
          background: #f5f0e6 !important;
        }

        .leaflet-control-zoom a:first-child {
          border-radius: 8px 8px 0 0 !important;
        }

        .leaflet-control-zoom a:last-child {
          border-radius: 0 0 8px 8px !important;
          border-top: none !important;
        }
      `}</style>

      {/* Zoom indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-parchment-light border border-border rounded-lg px-3 py-2 shadow-md">
        <span className="text-sm font-medium text-ink">Zoom: {currentZoom}</span>
      </div>

      {/* Coordinates display */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-parchment-light border border-border rounded-lg px-3 py-2 shadow-md">
        <span className="text-xs font-mono text-ink-muted">
          {pendingCoords ? `[${pendingCoords[0]}, ${pendingCoords[1]}]` : 'Click to place pin'}
        </span>
      </div>

      <div ref={mapRef} className="h-full w-full" />
    </>
  );
}
