'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

export default function Home() {
  const router = useRouter();
  const [config, setConfig] = useState<MapConfig | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [pinsVisible, setPinsVisible] = useState(true);

  useEffect(() => {
    fetchTileConfig()
      .then(setConfig)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/locations.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
        return res.json();
      })
      .then((data: Location[]) => setLocations(data))
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

  // Space bar toggles pin visibility (ignore when typing in an input)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return;
      }
      e.preventDefault();
      setPinsVisible((v) => !v);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Cinematic loading overlay */}
      {overlayVisible && <CinematicOverlay isFading={mapReady} />}

      {config && (
        <InteractiveMap
          locations={locations}
          config={config}
          tilesPath={TILES_BASE_URL}
          onLocationSelect={setSelectedLocation}
          selectedLocationId={selectedLocation?.id}
          onMapReady={handleMapReady}
          pinsVisible={pinsVisible}
        />
      )}

      {/* Sidebar for selected location (right side) */}
      {selectedLocation && (
        <div
          className="absolute right-0 top-0 h-full w-[420px] bg-sidebar flex flex-col z-[1000]"
          style={{
            boxShadow: '-4px 0 24px rgba(44, 36, 22, 0.15)',
          }}
        >
          {/* Close */}
          <div className="px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="h-auto p-0 text-sm"
            >
              Close &times;
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
          <ScrollArea className="flex-1 min-h-0 px-6 py-5">
            {selectedLocation.content ? (
              <div className="location-markdown text-sm text-ink leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedLocation.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-ink-muted text-sm italic">
                No lore content yet.
              </p>
            )}
          </ScrollArea>

          <Separator />

          {/* Contribute footer */}
          <div className="px-6 py-5">
            <p className="text-sm text-ink-muted leading-relaxed mb-3">
              Interested in contributing to the lore of Alaria? Message me on
              Discord at <span className="text-ink font-medium">@CaptainCrouton89</span>.
            </p>
            <Button asChild variant="ghost" size="sm" className="btn-gold w-full font-medium tracking-wide">
              <a
                href="https://discord.com/users/304156551210467328"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message me on Discord
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Floating header buttons (top-left to avoid sidebar overlap) */}
      <div className="absolute top-4 left-4 flex gap-2 z-[900]">
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

      {/* Pin toggle hint */}
      <div className="absolute bottom-4 left-4 text-xs text-ink-muted bg-sidebar/80 backdrop-blur-sm px-3 py-1.5 rounded border border-border/40 z-[900]">
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-ink/10 rounded border border-border/40">space</kbd>
        <span className="ml-2">{pinsVisible ? 'pins on' : 'pins off'}</span>
      </div>
    </div>
  );
}
