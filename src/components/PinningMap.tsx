'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapConfig, LocationType } from '@/types/location';
import { LOCATION_COLORS } from '@/types/location';
import { getLocationIconSvgV2 } from '@/lib/icons';
import type { PinnedData } from '@/types/pinning';

interface PinningMapProps {
  config: MapConfig;
  tilesPath: string;
  onMapClick: (coords: [number, number], zoom: number) => void;
  pendingCoords: [number, number] | null;
  pendingType: LocationType;
  pinnedData: PinnedData;
}

export function PinningMap({
  config,
  tilesPath,
  onMapClick,
  pendingCoords,
  pendingType,
  pinnedData,
}: PinningMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const pendingMarkerRef = useRef<L.Marker | null>(null);
  const pinnedMarkersRef = useRef<L.Marker[]>([]);
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

    const icon = L.divIcon({
      className: 'pending-marker',
      html: `
        <div class="pending-marker-container" style="--marker-color: ${color}">
          <span class="pending-marker-icon">${iconSvg}</span>
          <span class="pending-marker-pulse"></span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    pendingMarkerRef.current = L.marker(latLng, { icon }).addTo(map);
  }, [pendingCoords, pendingType]);

  // Update pinned markers (show existing pins faded)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove old markers
    pinnedMarkersRef.current.forEach((m) => m.remove());
    pinnedMarkersRef.current = [];

    // Add markers for all pinned locations
    Object.entries(pinnedData).forEach(([id, pinned]) => {
      const [x, y] = pinned.coordinates;
      // Convert image coords to Leaflet coords (negative y space)
      const latLng: L.LatLngExpression = [-y, x];
      const color = LOCATION_COLORS[pinned.type];
      const iconSvg = getLocationIconSvgV2(pinned.type, color);

      const icon = L.divIcon({
        className: 'pinned-marker',
        html: `
          <div class="pinned-marker-container" style="--marker-color: ${color}">
            <span class="pinned-marker-icon">${iconSvg}</span>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker(latLng, { icon }).addTo(map);
      marker.bindTooltip(id, { direction: 'top', offset: [0, -10] });
      pinnedMarkersRef.current.push(marker);
    });
  }, [pinnedData]);

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

        .pending-marker-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .pending-marker-icon svg {
          width: 24px;
          height: 24px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          opacity: 0.5;
        }

        .pinned-marker-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: grayscale(50%);
        }

        .pinned-marker-icon svg {
          width: 16px;
          height: 16px;
        }

        .leaflet-container {
          background: #e8e0d0;
          cursor: crosshair !important;
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
