'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Location, MapConfig } from '@/types/location';
import { LOCATION_COLORS } from '@/types/location';
import { getLocationIconSvgV2 } from '@/lib/icons';

interface InteractiveMapProps {
  locations: Location[];
  config: MapConfig;
  tilesPath: string;
  onLocationSelect?: (location: Location) => void;
  selectedLocationId?: string;
  onMapReady?: () => void;
}

export function InteractiveMap({
  locations,
  config,
  tilesPath,
  onLocationSelect,
  selectedLocationId,
  onMapReady,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
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

    // Filter locations visible at current zoom level
    const visibleLocations = locations.filter(
      (loc) => loc.zoomLevel <= currentZoom
    );

    // Add markers for visible locations
    visibleLocations.forEach((location) => {
      const [x, y] = location.coordinates;
      const color = LOCATION_COLORS[location.type];
      const isSelected = location.id === selectedLocationId;
      const iconSvg = getLocationIconSvgV2(location.type, color);

      // Flip Y coordinate (image coords: top-left origin, Leaflet Simple: bottom-left)
      const latLng: L.LatLngExpression = [config.imageHeight - y, x];

      // Create custom icon with SVG
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container ${isSelected ? 'marker-selected' : ''}" style="--marker-color: ${color}">
            <span class="marker-icon">${iconSvg}</span>
            <span class="marker-label ${isSelected ? 'label-selected' : ''}">${location.name}</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker(latLng, { icon }).addTo(map);

      marker.on('click', () => {
        onLocationSelect?.(location);
      });

      markersRef.current.push(marker);
    });
  }, [locations, currentZoom, config.imageHeight, onLocationSelect, selectedLocationId]);

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .marker-container {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .marker-container:hover {
          transform: scale(1.05);
        }

        .marker-selected {
          transform: scale(1.05);
        }

        .marker-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 1px 2px rgba(44, 36, 22, 0.5));
        }

        .marker-icon svg {
          width: 18px;
          height: 18px;
        }

        .marker-label {
          font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #e8e0d0;
          text-shadow:
            -1px -1px 0 rgba(10, 8, 6, 0.9),
            1px -1px 0 rgba(10, 8, 6, 0.9),
            -1px 1px 0 rgba(10, 8, 6, 0.9),
            1px 1px 0 rgba(10, 8, 6, 0.9),
            0 0 8px rgba(10, 8, 6, 0.9);
        }

        /* Selected label - gold underline */
        .label-selected {
          text-decoration: underline;
          text-decoration-color: #c9a227;
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
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
