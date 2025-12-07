'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Location, MapConfig } from '@/types/location';
import { LOCATION_COLORS } from '@/types/location';
import { LOCATION_ICONS } from '@/lib/icons';
import { TILES_BASE_URL, fetchTileConfig } from '@/lib/tiles';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Dynamically import the map component to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(
  () => import('@/components/InteractiveMap').then((mod) => mod.InteractiveMap),
  { ssr: false }
);

function CinematicOverlay({ isFading }: { isFading: boolean }) {
  return (
    <div className={`cinematic-overlay ${isFading ? 'cinematic-fade' : ''}`}>
      {/* Expanding ripple rings */}
      <div className="cinematic-ripples">
        <div className="cinematic-ripple cinematic-ripple-1" />
        <div className="cinematic-ripple cinematic-ripple-2" />
        <div className="cinematic-ripple cinematic-ripple-3" />
      </div>

      {/* Corner flourishes */}
      <div className="cinematic-flourish cinematic-flourish-tl" />
      <div className="cinematic-flourish cinematic-flourish-tr" />
      <div className="cinematic-flourish cinematic-flourish-bl" />
      <div className="cinematic-flourish cinematic-flourish-br" />

      {/* Compass rose decoration */}
      <div className="cinematic-compass" />

      {/* Title with subtitle */}
      <div className="cinematic-title-container">
        <h1 className="cinematic-title">Alaria</h1>
        <p className="cinematic-subtitle">The Known World</p>
      </div>

      {/* Vignette overlay */}
      <div className="cinematic-vignette" />
    </div>
  );
}

// Sample locations for testing - these would come from compiled markdown frontmatter
const SAMPLE_LOCATIONS: Location[] = [
  {
    id: 'alaria-continent',
    name: 'Alaria',
    type: 'region',
    coordinates: [2500, 2500],
    zoomLevel: 0,
    parentId: null,
    relatedIds: [],
  },
];

export default function Home() {
  const router = useRouter();
  const [config, setConfig] = useState<MapConfig | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    fetchTileConfig()
      .then(setConfig)
      .catch(console.error);
  }, []);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  // Remove overlay from DOM after fade animation completes
  useEffect(() => {
    if (mapReady) {
      const timer = setTimeout(() => {
        setOverlayVisible(false);
      }, 3500); // Match cinematic-reveal animation duration
      return () => clearTimeout(timer);
    }
  }, [mapReady]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Cinematic loading overlay */}
      {overlayVisible && <CinematicOverlay isFading={mapReady} />}

      {config && (
        <InteractiveMap
          locations={SAMPLE_LOCATIONS}
          config={config}
          tilesPath={TILES_BASE_URL}
          onLocationSelect={setSelectedLocation}
          selectedLocationId={selectedLocation?.id}
          onMapReady={handleMapReady}
        />
      )}

      {/* Sidebar for selected location */}
      {selectedLocation && (
        <div
          className="absolute left-0 top-0 h-full w-[380px] bg-sidebar flex flex-col"
          style={{
            boxShadow: '4px 0 24px rgba(44, 36, 22, 0.15)',
          }}
        >
          {/* Breadcrumb / Close */}
          <div className="px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="h-auto p-0 text-sm"
            >
              &larr; Back to Map
            </Button>
          </div>

          <Separator />

          {/* Header */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = LOCATION_ICONS[selectedLocation.type];
                const color = LOCATION_COLORS[selectedLocation.type];
                return <Icon className="w-6 h-6" style={{ color }} />;
              })()}
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {selectedLocation.name}
                </h2>
                <p className="text-sm capitalize text-ink-muted">
                  {selectedLocation.type}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Content area with scroll */}
          <ScrollArea className="flex-1 px-6 py-5">
            <p className="text-ink-muted text-sm italic">
              Lore content will appear here...
            </p>
          </ScrollArea>
        </div>
      )}

      {/* Floating header buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="nav-active"
          size="sm"
        >
          Map
        </Button>
        <Button
          variant="nav"
          size="sm"
          onClick={() => router.push('/codex')}
        >
          Codex
        </Button>
      </div>
    </div>
  );
}
