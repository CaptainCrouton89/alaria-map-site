'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location, MapConfig, MapEdge, EdgeKind } from '@/types/location';
import { LOCATION_COLORS, EDGE_KINDS } from '@/types/location';
import { getLocationIconSvgV2 } from '@/lib/icons';

interface InteractiveMapProps {
  locations: Location[];
  config: MapConfig;
  tilesPath: string;
  onLocationSelect?: (location: Location) => void;
  selectedLocationId?: string;
  onMapReady?: () => void;
  pinsVisible?: boolean;
  flyTo?: { coordinates: [number, number]; zoomLevel: number } | null;
  edges?: MapEdge[];
  visibleEdgeKinds?: Set<EdgeKind>;
}

export function InteractiveMap({
  locations,
  config,
  tilesPath,
  onLocationSelect,
  selectedLocationId,
  onMapReady,
  pinsVisible = true,
  flyTo,
  edges,
  visibleEdgeKinds,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const edgeLayerRef = useRef<L.LayerGroup | null>(null);
  const hasNotifiedReady = useRef(false);
  const [currentZoom, setCurrentZoom] = useState(2);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Calculate bounds in tile coordinate space
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
      fadeAnimation: false,
    });

    const tileLayer = L.tileLayer(`${tilesPath}/{z}/{x}/{y}.webp`, {
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      noWrap: true,
      tileSize: config.tileSize,
      keepBuffer: 3,
      updateWhenIdle: false,
      updateWhenZooming: false,
      bounds: bounds,
    }).addTo(map);

    // Notify when tiles have loaded
    const notifyReady = () => {
      if (!hasNotifiedReady.current) {
        hasNotifiedReady.current = true;
        onMapReady?.();
      }
    };

    tileLayer.on('load', notifyReady);

    // Fallback timeout in case tiles fail to load
    const timeoutId = setTimeout(notifyReady, 3000);

    map.fitBounds(bounds);
    // Start at zoom level 2 for cinematic reveal, offset north-west
    map.setZoom(2);
    const center = map.getCenter();
    map.panTo([center.lat + boundsHeight * 0.15, center.lng - boundsWidth * 0.15], { animate: false });

    // Track zoom changes
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    leafletMapRef.current = map;

    return () => {
      clearTimeout(timeoutId);
      map.remove();
      leafletMapRef.current = null;
    };
  }, [config, tilesPath, onMapReady]);

  // Update markers based on zoom level
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!pinsVisible) return;

    // Visibility by tier (matches /pin):
    //   delta = currentZoom - pin.zoomLevel
    //   delta == 0 → at the pin's main zoom — full brightness
    //   delta == 1 → one zoom closer in — slightly faded
    //   anything else → hidden
    const tierFor = (delta: number) => {
      if (delta === 0) return { size: 28, svg: 18, iconOpacity: 1, bgOpacity: 0.85, badgeOpacity: 1 };
      if (delta === 1) return { size: 24, svg: 16, iconOpacity: 0.85, bgOpacity: 0.55, badgeOpacity: 0.8 };
      return null;
    };

    locations.forEach((location) => {
      const tier = tierFor(currentZoom - location.zoomLevel);
      if (!tier) return;

      const [x, y] = location.coordinates;
      const color = LOCATION_COLORS[location.type];
      const isSelected = location.id === selectedLocationId;
      const iconSvg = getLocationIconSvgV2(location.type, color);

      // Match /pin's coordinate system: image-y stored as-is, placed at -y in CRS.Simple
      const latLng: L.LatLngExpression = [-y, x];

      const icon = L.divIcon({
        className: `pinned-marker${isSelected ? ' pinned-marker-selected' : ''}`,
        html: `
          <div class="pinned-marker-container" style="--marker-color: ${color}; width: ${tier.size}px; height: ${tier.size}px;">
            <span class="pinned-marker-bg" style="opacity: ${tier.bgOpacity};"></span>
            <span class="pinned-marker-icon" style="opacity: ${tier.iconOpacity};">
              <span style="display: inline-flex; width: ${tier.svg}px; height: ${tier.svg}px;">${iconSvg}</span>
            </span>
          </div>
        `,
        iconSize: [tier.size, tier.size],
        iconAnchor: [tier.size / 2, tier.size / 2],
      });

      const marker = L.marker(latLng, { icon }).addTo(map);
      marker.bindTooltip(location.name, { direction: 'top', offset: [0, -tier.size / 2 - 2] });
      marker.on('click', () => onLocationSelect?.(location));

      markersRef.current.push(marker);
    });
  }, [locations, currentZoom, onLocationSelect, selectedLocationId, pinsVisible]);

  // Draw relationship edges as colored polylines beneath the pins.
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Tear down the previous layer
    if (edgeLayerRef.current) {
      edgeLayerRef.current.remove();
      edgeLayerRef.current = null;
    }
    if (!edges || !visibleEdgeKinds || visibleEdgeKinds.size === 0) return;

    const byId = new Map(locations.map((l) => [l.id, l]));
    const layer = L.layerGroup();

    for (const edge of edges) {
      if (!visibleEdgeKinds.has(edge.kind)) continue;
      const a = byId.get(edge.source);
      const b = byId.get(edge.target);
      if (!a || !b) continue;

      const { color, label } = EDGE_KINDS[edge.kind];
      const [ax, ay] = a.coordinates;
      const [bx, by] = b.coordinates;
      // Match the pin coordinate system: image-y placed at -y in CRS.Simple
      const line = L.polyline(
        [
          [-ay, ax],
          [-by, bx],
        ],
        { color, weight: 1.5, opacity: 0.55, interactive: true, bubblingMouseEvents: false },
      );

      const noteHtml = edge.note ? ` <span style="opacity:0.7">(${edge.note})</span>` : '';
      line.bindTooltip(
        `<strong>${a.name}</strong> &mdash;<span style="color:${color}">${label}</span>&rarr; <strong>${b.name}</strong>${noteHtml}`,
        { sticky: true, direction: 'top', className: 'edge-tooltip' },
      );
      line.on('mouseover', () => line.setStyle({ weight: 3.5, opacity: 0.95 }));
      line.on('mouseout', () => line.setStyle({ weight: 1.5, opacity: 0.55 }));
      layer.addTo(map);
      line.addTo(layer);
    }

    edgeLayerRef.current = layer;

    return () => {
      layer.remove();
      if (edgeLayerRef.current === layer) edgeLayerRef.current = null;
    };
  }, [edges, visibleEdgeKinds, locations]);

  // Fly to a target location when requested (e.g. from search)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !flyTo) return;
    const [x, y] = flyTo.coordinates;
    // Target the pin's own zoom level so it renders at full brightness (delta 0)
    const targetZoom = Math.min(Math.max(flyTo.zoomLevel, config.minZoom), config.maxZoom);
    map.flyTo([-y, x], targetZoom, { duration: 1.2 });
  }, [flyTo, config.minZoom, config.maxZoom]);

  return (
    <>
      <style jsx global>{`
        .pinned-marker {
          background: transparent !important;
          border: none !important;
        }

        .pinned-marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 120ms ease, width 120ms ease, height 120ms ease, transform 120ms ease;
        }

        .pinned-marker-container:hover {
          transform: scale(1.12);
        }

        .pinned-marker-selected .pinned-marker-container {
          transform: scale(1.15);
        }

        .pinned-marker-selected .pinned-marker-bg {
          border-width: 2.5px !important;
          box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.55), 0 1px 3px rgba(0,0,0,0.3) !important;
        }

        .pinned-marker-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(250, 248, 243, 0.85);
          border: 1.5px solid var(--marker-color);
          box-shadow: 0 1px 2px rgba(0,0,0,0.18);
          z-index: 0;
          transition: opacity 120ms ease, border-width 120ms ease, box-shadow 120ms ease;
        }

        .pinned-marker-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          transition: opacity 120ms ease;
        }

        .pinned-marker-icon svg {
          width: 100%;
          height: 100%;
        }

        .edge-tooltip {
          background: #2c2416;
          color: #e8e0d0;
          border: 1px solid #4d4436;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }
        .edge-tooltip::before {
          display: none;
        }

        .leaflet-container {
          background: #1a1612;
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
        }

        /* Tile rendering optimizations */
        .leaflet-tile {
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          outline: 1px solid transparent;
        }

        .leaflet-tile-pane {
          will-change: transform;
        }

        /* Dark-themed zoom controls */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4) !important;
          border-radius: 8px !important;
          overflow: hidden;
        }

        .leaflet-control-zoom a {
          background: #2c2416 !important;
          color: #e8e0d0 !important;
          border: 1px solid #4d4436 !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 30px !important;
          font-weight: 500 !important;
        }

        .leaflet-control-zoom a:hover {
          background: #3d3426 !important;
          color: #c9a227 !important;
        }

        .leaflet-control-zoom a:first-child {
          border-radius: 8px 8px 0 0 !important;
        }

        .leaflet-control-zoom a:last-child {
          border-radius: 0 0 8px 8px !important;
          border-top: none !important;
        }
      `}</style>
      <div ref={mapRef} className="h-full w-full" />
    </>
  );
}
