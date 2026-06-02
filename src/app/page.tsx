'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { BookOpen, ArrowRight, X } from 'lucide-react';
import type { Location, MapConfig, MapEdge, EdgeKind } from '@/types/location';
import { EDGE_KINDS } from '@/types/location';
import { TILES_BASE_URL, fetchTileConfig } from '@/lib/tiles';
import { determineAtmosphere, getAtmosphereVisual, atmosRgba } from '@/lib/atmosphere';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EntitySeal } from '@/components/codex/EntitySeal';

import { MapSearch } from '@/components/MapSearch';
import { AdminPanel } from '@/components/AdminPanel';
import { PrimaryNav } from '@/components/PrimaryNav';
import { BuyMapButton } from '@/components/BuyMapButton';
import { useAdmin } from '@/hooks/useAdmin';

/** A wiki-infobox row: label on the left, value on the right. */
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-muted shrink-0">{label}</dt>
      <dd className="text-sm text-ink text-right min-w-0">{children}</dd>
    </div>
  );
}

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
  const [config, setConfig] = useState<MapConfig | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [pinsVisible, setPinsVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [flyTo, setFlyTo] = useState<{ coordinates: [number, number]; zoomLevel: number } | null>(null);
  // Set of codex entry ids, lazily loaded the first time a location sidebar opens.
  // A location maps to its codex entry by shared id (location.id === codex entry id),
  // so this set tells us whether to surface the "full codex entry" link.
  const [codexIds, setCodexIds] = useState<Set<string> | null>(null);
  const [edges, setEdges] = useState<MapEdge[]>([]);
  const [visibleEdgeKinds, setVisibleEdgeKinds] = useState<Set<EdgeKind>>(
    () => new Set((Object.keys(EDGE_KINDS) as EdgeKind[]).filter((k) => EDGE_KINDS[k].defaultOn)),
  );
  const { isAdmin, error: adminError, login, logout } = useAdmin();

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

  // Lazily load the set of codex entry ids the first time a location is selected,
  // so we only pay for it when someone actually opens a sidebar. Used to gate the
  // "full codex entry" link to locations that really have an entry.
  useEffect(() => {
    if (!selectedLocation || codexIds) return;
    fetch('/codex-search.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch codex index: ${res.status}`);
        return res.json();
      })
      .then((data: { id: string }[]) => setCodexIds(new Set(data.map((e) => e.id))))
      .catch(console.error);
  }, [selectedLocation, codexIds]);

  // Relationship edges are an admin-only overlay — only fetch them once logged in.
  useEffect(() => {
    if (!isAdmin || edges.length > 0) return;
    fetch('/codex-edges.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch edges: ${res.status}`);
        return res.json();
      })
      .then((data: MapEdge[]) => setEdges(data))
      .catch(console.error);
  }, [isAdmin, edges.length]);

  const toggleEdgeKind = useCallback((kind: EdgeKind) => {
    setVisibleEdgeKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
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

  // Keyboard shortcuts (ignore when typing in an input)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (isTyping) return;

      // 'f' opens the place search
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }

      // Space toggles pin visibility
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setPinsVisible((v) => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSearchSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    setFlyTo({ coordinates: location.coordinates, zoomLevel: location.zoomLevel });
    setSearchOpen(false);
  }, []);

  // Deep link from the codex ("View on map"): /?loc=<id> selects a location and
  // flies to it. Runs once the map is ready and locations are loaded.
  const deepLinkDone = useRef(false);
  useEffect(() => {
    if (deepLinkDone.current || !mapReady || locations.length === 0) return;
    const id = new URLSearchParams(window.location.search).get('loc');
    if (!id) return;
    deepLinkDone.current = true;
    const loc = locations.find((l) => l.id === id);
    if (!loc) return;
    // Defer to the next tick so the map has painted before we fly/select.
    const t = setTimeout(() => {
      setSelectedLocation(loc);
      setFlyTo({ coordinates: loc.coordinates, zoomLevel: loc.zoomLevel });
      setOverlayVisible(false); // skip the intro veil when arriving at a target
    }, 0);
    return () => clearTimeout(t);
  }, [mapReady, locations]);

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
          flyTo={flyTo}
          edges={isAdmin ? edges : undefined}
          visibleEdgeKinds={isAdmin ? visibleEdgeKinds : undefined}
        />
      )}

      {/* Admin panel: login + relationship overlay controls */}
      <AdminPanel
        isAdmin={isAdmin}
        error={adminError}
        login={login}
        logout={logout}
        edges={edges}
        visibleEdgeKinds={visibleEdgeKinds}
        toggleEdgeKind={toggleEdgeKind}
      />

      {/* Place search (press "f") */}
      {searchOpen && (
        <MapSearch
          locations={locations}
          onSelect={handleSearchSelect}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {/* Sidebar for selected location (right side) — a summary "preview" of the
          codex entry: atmosphere hero, blurb, the full-entry CTA, and quick facts. */}
      {selectedLocation && (() => {
        const loc = selectedLocation;
        const visual = getAtmosphereVisual(loc.atmosphere ?? determineAtmosphere(loc.tags ?? []));
        const accent = atmosRgba(visual, 1);
        const typeText = loc.type.charAt(0).toUpperCase() + loc.type.slice(1);
        const hasCodex = !codexIds || codexIds.has(loc.id);
        return (
          <div
            className="absolute right-0 top-0 h-full w-[420px] bg-sidebar flex flex-col z-[1000]"
            style={{ boxShadow: '-4px 0 24px rgba(44, 36, 22, 0.15)' }}
          >
            {/* Atmosphere hero band — mirrors the codex EntityHero */}
            <div
              className="relative overflow-hidden border-b border-border"
              style={{ background: `linear-gradient(180deg, ${atmosRgba(visual, 0.18)} 0%, ${atmosRgba(visual, 0.06)} 50%, transparent 100%)` }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: `radial-gradient(120% 90% at 18% -10%, ${atmosRgba(visual, 0.16)}, transparent 60%)` }}
              />
              <div className="relative px-6 pt-4 pb-5">
                <div className="flex justify-end mb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedLocation(null)}
                    aria-label="Close"
                    className="-mr-1.5 rounded-md p-1.5 text-ink-muted hover:text-ink hover:bg-ink/10 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <EntitySeal entry={{ entityType: loc.type, tags: loc.tags ?? [] }} visual={visual} size="lg" />
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl font-semibold text-ink leading-tight truncate">
                      {loc.name}
                    </h2>
                    <div className="mt-1.5 flex items-center gap-2 text-ink-muted">
                      <span aria-hidden className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: accent }} />
                      <span className="uppercase tracking-[0.14em] text-xs font-display">{typeText}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-px w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
              </div>
            </div>

            {/* Scrollable summary: blurb → CTA → quick facts → borders */}
            <ScrollArea className="flex-1 min-h-0 px-6 py-5">
              {loc.blurb ? (
                <p className="text-[15px] leading-relaxed text-ink mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                  {loc.blurb}
                </p>
              ) : (
                <p className="text-sm italic text-ink-muted mb-4">
                  No description yet — open the codex entry to read more.
                </p>
              )}

              {hasCodex && (
                <Button
                  asChild
                  variant="accent"
                  className="w-full justify-between font-medium tracking-wide text-[var(--parchment-dark)] hover:text-[var(--parchment-dark)]"
                >
                  <Link href={`/codex/${loc.id}`} aria-label={`Open the full codex entry for ${loc.name}`}>
                    <BookOpen className="w-4 h-4" />
                    <span className="flex-1 text-center">Open full codex entry</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              )}

              <dl className="mt-5 divide-y divide-border/60">
                <Fact label="Type">{typeText}</Fact>
                {loc.parentId && loc.parentName && (
                  <Fact label="Within">
                    <Link
                      href={`/codex/${loc.parentId}`}
                      className="text-gold hover:text-[#f3dd8a] underline underline-offset-2 decoration-gold-muted"
                    >
                      {loc.parentName}
                    </Link>
                  </Fact>
                )}
                {loc.containsCount ? (
                  <Fact label="Contains">
                    {loc.containsCount.toLocaleString()} {loc.containsCount === 1 ? 'place' : 'places'}
                  </Fact>
                ) : null}
                {loc.meta?.map((m) => (
                  <Fact key={m.label} label={m.label}>{m.value}</Fact>
                ))}
              </dl>

              {loc.borders && loc.borders.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-[11px] uppercase tracking-[0.13em] font-display mb-2" style={{ color: accent }}>
                    Borders
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.borders.map((b) => (
                      <Link
                        key={b.id}
                        href={`/codex/${b.id}`}
                        className="inline-block px-2 py-0.5 text-[13px] bg-parchment border border-border text-ink rounded-sm hover:border-gold-muted transition-colors"
                      >
                        {b.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>

            {/* Slim contribute footer */}
            <Separator />
            <div className="px-6 py-4 space-y-3">
              <BuyMapButton
                variant="accent"
                size="default"
                className="w-full justify-center"
                label="Buy the full-resolution map · $20"
              />
              <p className="text-sm text-ink-muted leading-relaxed">
                Know more about this place?{' '}
                <a
                  href="https://discord.com/users/304156551210467328"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-[#f3dd8a] transition-colors"
                >
                  Contribute lore &rarr;
                </a>
              </p>
            </div>
          </div>
        );
      })()}

      {/* Shared nav cluster (top-right). Search here opens the map's place-search
          — the same overlay `f` opens. The cluster sits below the sidebar's
          z-index, so an open location panel cleanly covers it. */}
      <PrimaryNav active="map" onSearch={() => setSearchOpen(true)} searchKbd="f" />

      {/* Keyboard hints */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 text-xs text-ink-muted bg-sidebar/80 backdrop-blur-sm px-3 py-1.5 rounded border border-border/40 z-[900]">
        <span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-ink/10 rounded border border-border/40">space</kbd>
          <span className="ml-2">{pinsVisible ? 'pins on' : 'pins off'}</span>
        </span>
        <span className="opacity-40">·</span>
        <span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 bg-ink/10 rounded border border-border/40">f</kbd>
          <span className="ml-2">search</span>
        </span>
      </div>
    </div>
  );
}
