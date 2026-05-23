'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { MapConfig, LocationType } from '@/types/location';
import { LOCATION_COLORS } from '@/types/location';
import { LOCATION_ICONS } from '@/lib/icons';
import { TILES_BASE_URL, fetchTileConfig } from '@/lib/tiles';
import type { LoreEntry, PinnedData, EntryContext, ManualPin } from '@/types/pinning';
import { Button } from '@/components/ui/button';

type PinMode = 'queue' | 'quick';

const PinningMap = dynamic(
  () => import('@/components/PinningMap').then((mod) => mod.PinningMap),
  { ssr: false, loading: () => <MapLoading /> }
);

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-parchment">
      <div className="text-ink-muted font-display text-lg">Loading map...</div>
    </div>
  );
}

interface Stats {
  total: number;
  pending: number;
  pinned: number;
  skipped: number;
}

// Type definitions with keyboard shortcuts (left-hand friendly)
const LOCATION_TYPE_CONFIG: { type: LocationType; key: string; description: string }[] = [
  { type: 'region', key: '1', description: 'Large geographic areas, kingdoms, biomes' },
  { type: 'city', key: '2', description: 'Major population centers' },
  { type: 'town', key: '3', description: 'Smaller settlements, villages' },
  { type: 'fortress', key: '4', description: 'Castles, keeps, military installations' },
  { type: 'ruins', key: '5', description: 'Abandoned structures, ancient sites' },
  { type: 'wilderness', key: 'q', description: 'Natural terrain areas: forests, deserts, swamps' },
  { type: 'water', key: 'w', description: 'Bodies of water: lakes, rivers, seas' },
  { type: 'poi', key: 'e', description: 'Notable features, dungeons, temples, other POIs' },
];

const KEY_TO_TYPE: Record<string, LocationType> = Object.fromEntries(
  LOCATION_TYPE_CONFIG.map(({ type, key }) => [key, type])
);

// Quick Label adds an "uncategorized" type ('r' continues the q/w/e row).
const QUICK_TYPE_CONFIG: { type: LocationType; key: string; description: string }[] = [
  ...LOCATION_TYPE_CONFIG,
  { type: 'uncategorized', key: 'r', description: 'Placed but not yet categorized' },
];

const QUICK_KEY_TO_TYPE: Record<string, LocationType> = Object.fromEntries(
  QUICK_TYPE_CONFIG.map(({ type, key }) => [key, type])
);

const VALID_TYPES = new Set<string>(LOCATION_TYPE_CONFIG.map(c => c.type));

// Map old/removed types to current valid types
const LEGACY_TYPE_MAP: Record<string, LocationType> = {
  dungeon: 'poi',
  temple: 'poi',
  landmark: 'poi',
};

function normalizeType(type: string): LocationType {
  if (VALID_TYPES.has(type)) return type as LocationType;
  if (type in LEGACY_TYPE_MAP) return LEGACY_TYPE_MAP[type];
  throw new Error(`Unknown location type: ${type}`);
}

const SOURCE_FILES = [
  'Ve.md', 'Clueanda.md', 'Aboyinzu.md', 'Rimihuica.md',
  'Upoceax.md', 'Western_Isles.md', 'Greenwater_Isles.md', 'City_States.md'
];

interface QuickLabelPanelProps {
  pendingCoords: [number, number] | null;
  pendingZoom: number;
  setPendingZoom: (z: number) => void;
  quickName: string;
  setQuickName: (s: string) => void;
  selectedType: LocationType;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSave: () => void;
  manualPins: ManualPin[];
  onDelete: (id: string) => void;
  selectedManualId: string | null;
  onSelectPin: (id: string) => void;
  onRetype: (t: LocationType) => void;
}

function QuickLabelPanel({
  pendingCoords,
  pendingZoom,
  setPendingZoom,
  quickName,
  setQuickName,
  selectedType,
  inputRef,
  onSave,
  manualPins,
  onDelete,
  selectedManualId,
  onSelectPin,
  onRetype,
}: QuickLabelPanelProps) {
  const selectedPin = manualPins.find((p) => p.id === selectedManualId) ?? null;
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Capture form */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <p className="text-sm text-ink-muted mb-3">
          Click the map, type a name, press{' '}
          <kbd className="font-mono text-[10px] px-1 py-0.5 bg-parchment rounded border border-border">Enter</kbd>.
          Then tap{' '}
          <kbd className="font-mono text-[10px] px-1 py-0.5 bg-parchment rounded border border-border">N</kbd>/
          <kbd className="font-mono text-[10px] px-1 py-0.5 bg-parchment rounded border border-border">P</kbd>{' '}
          through pins and press a type key to set each one.
        </p>

        <label className="block text-xs font-medium text-ink-muted mb-1">Name</label>
        <input
          ref={inputRef}
          type="text"
          value={quickName}
          onChange={(e) => setQuickName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSave();
            }
          }}
          placeholder={pendingCoords ? 'Name this place…' : 'Click the map first'}
          disabled={!pendingCoords}
          className="w-full px-2 py-1.5 text-sm bg-parchment border border-border rounded focus:outline-none focus:border-accent-gold disabled:opacity-50"
        />

        {/* Type selector — edits the SELECTED pin (the one shown below) */}
        <label className="block text-xs font-medium text-ink-muted mt-3 mb-1">
          Type{' '}
          <span className="opacity-60">
            {selectedPin ? `→ ${selectedPin.name}` : '(select a pin to retype)'}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-1">
          {QUICK_TYPE_CONFIG.map(({ type, key, description }) => {
            const Icon = LOCATION_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => onRetype(type)}
                title={description}
                className={`px-2 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
                  selectedType === type
                    ? 'bg-accent-gold text-white border-accent-gold'
                    : 'bg-parchment border-border text-ink-muted hover:border-ink-muted'
                }`}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{type}</span>
                <kbd className="ml-auto text-[10px] opacity-60 font-mono">{key}</kbd>
              </button>
            );
          })}
        </div>

        <div className="mt-2 text-xs text-ink-muted">
          {pendingCoords ? (
            <code className="font-mono bg-parchment px-1.5 py-0.5 rounded">
              [{pendingCoords[0]}, {pendingCoords[1]}]
            </code>
          ) : (
            <span className="italic">No point selected</span>
          )}
        </div>

        <label className="block text-xs font-medium text-ink-muted mt-3 mb-1">Zoom Level</label>
        <input
          type="range"
          min={1}
          max={5}
          value={pendingZoom}
          onChange={(e) => setPendingZoom(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-ink-muted">
          <span>1 (Continental)</span>
          <span className="font-medium">{pendingZoom}</span>
          <span>5 (Local)</span>
        </div>

        <Button
          variant="accent"
          onClick={onSave}
          disabled={!pendingCoords || !quickName.trim()}
          className="w-full mt-3"
        >
          Add Point <kbd className="ml-1 text-xs opacity-80">↵</kbd>
        </Button>
      </div>

      {/* Added points list */}
      <div className="px-4 py-3 flex-1">
        <div className="text-xs font-medium text-ink-muted mb-2">
          Added points ({manualPins.length})
        </div>
        {manualPins.length === 0 ? (
          <p className="text-sm text-ink-muted italic">Nothing added yet.</p>
        ) : (
          <div className="space-y-1">
            {manualPins.map((p) => {
              const Icon = LOCATION_ICONS[p.type];
              const isSelected = p.id === selectedManualId;
              return (
              <div
                key={p.id}
                onClick={() => onSelectPin(p.id)}
                className={`flex items-center gap-2 rounded px-2 py-1.5 group cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-accent-gold/25 ring-1 ring-accent-gold'
                    : 'bg-parchment/40 hover:bg-parchment/70'
                }`}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: LOCATION_COLORS[p.type] }}
                />
                <span className="text-sm text-ink truncate flex-1">{p.name}</span>
                <span className="text-[10px] text-ink-muted">{p.type}</span>
                <span className="text-[10px] text-ink-muted font-mono">z{p.zoomLevel}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                  className="text-xs text-ink-muted hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete this point"
                >
                  ✕
                </button>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PinPage() {
  const [config, setConfig] = useState<MapConfig | null>(null);
  const [currentEntry, setCurrentEntry] = useState<LoreEntry | null>(null);
  const [currentContext, setCurrentContext] = useState<EntryContext | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pinnedData, setPinnedData] = useState<PinnedData>({});
  const [pendingCoords, setPendingCoords] = useState<[number, number] | null>(null);
  const [pendingZoom, setPendingZoom] = useState<number>(2);
  const [selectedType, setSelectedType] = useState<LocationType>('region');
  const [loading, setLoading] = useState(true);

  // Quick-label mode: free-form pins typed straight onto the map.
  // Default to quick: the wiki queue is finished, but we still load its pins so
  // their icons + names show as a reference layer for spotting unlabeled gaps.
  const [mode, setMode] = useState<PinMode>('quick');
  const [pinnedNames, setPinnedNames] = useState<Record<string, string>>({});
  const [manualPins, setManualPins] = useState<ManualPin[]>([]);
  const [quickName, setQuickName] = useState('');
  // The manual pin currently selected for type-editing (after Enter, or via n/p).
  const [selectedManualId, setSelectedManualId] = useState<string | null>(null);
  // Map only pans when this changes — set on N/P/row-click, NOT on save (which
  // would re-center on the spot you just clicked).
  const [panTarget, setPanTarget] = useState<[number, number] | null>(null);
  const quickInputRef = useRef<HTMLInputElement>(null);

  // Load map config from R2
  useEffect(() => {
    fetchTileConfig()
      .then(setConfig)
      .catch(console.error);
  }, []);

  // Fetch current state
  const fetchState = useCallback(async () => {
    const res = await fetch('/api/pin');
    const data = await res.json();
    setCurrentEntry(data.currentEntry);
    setCurrentContext(data.context ?? null);
    setCurrentIndex(data.currentIndex);
    setStats(data.stats);
    setPinnedData(data.pinnedData);
    setPinnedNames(data.pinnedNames && typeof data.pinnedNames === 'object' ? data.pinnedNames : {});
    if (data.currentEntry) {
      setSelectedType(normalizeType(data.currentEntry.suggestedType));
      setPendingZoom(data.currentEntry.suggestedZoomLevel);
    }
    setPendingCoords(null);
    setLoading(false);
  }, []);

  // Fetch free-form manual pins
  const fetchManualPins = useCallback(async () => {
    const res = await fetch('/api/manual-pin');
    if (!res.ok) return;
    const data = await res.json();
    setManualPins(Array.isArray(data.pins) ? data.pins : []);
  }, []);

  useEffect(() => {
    // Load both on mount: the queue supplies the reference pins + names shown
    // under Quick Label, and manual pins are the free-form additions.
    // setState after await is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchState();
    fetchManualPins();
  }, [fetchState, fetchManualPins]);

  // Handle map click
  const handleMapClick = useCallback((coords: [number, number], zoom: number) => {
    setPendingCoords(coords);
    setPendingZoom(Math.round(zoom));
  }, []);

  // Quick mode: save a free-form pin from the typed name + clicked coords.
  const handleSaveManual = useCallback(async () => {
    const name = quickName.trim();
    if (!name || !pendingCoords) return;

    const res = await fetch('/api/manual-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        coordinates: pendingCoords,
        zoomLevel: pendingZoom,
        type: selectedType,
      }),
    });
    const data = await res.json();
    setQuickName('');
    setPendingCoords(null);
    // Optimistic: insert the returned pin locally instead of refetching the whole
    // list — avoids a round-trip and a re-render on every Enter.
    if (data?.pin) {
      const pin: ManualPin = data.pin;
      setManualPins((prev) => [pin, ...prev]);
      // The just-placed pin becomes selected so type keys (1-5/q/w/e/r) retype it.
      // We do NOT pan here — it's already on screen where you clicked.
      setSelectedManualId(pin.id);
    }
    // Blur the name field so type keys edit the selected pin instead of typing,
    // until the user clicks the map again (which refocuses the field).
    quickInputRef.current?.blur();
  }, [quickName, pendingCoords, pendingZoom, selectedType]);

  // Quick mode: change the type of the currently selected manual pin (optimistic).
  const handleRetypeManual = useCallback((type: LocationType) => {
    setSelectedType(type);
    if (!selectedManualId) return;
    setManualPins((prev) => prev.map((p) => (p.id === selectedManualId ? { ...p, type } : p)));
    fetch('/api/manual-pin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedManualId, type }),
    });
  }, [selectedManualId]);

  // Quick mode: step the selection through placed pins (newest-first list order).
  // Wraps around so N always advances and P always goes back — never dead-ends.
  const handleSelectManual = useCallback((direction: 1 | -1) => {
    const len = manualPins.length;
    if (len === 0) return;
    const idx = manualPins.findIndex((p) => p.id === selectedManualId);
    const next = idx === -1
      ? (direction === 1 ? 0 : len - 1)
      : (idx + direction + len) % len;
    const target = manualPins[next];
    if (target) {
      setSelectedManualId(target.id);
      setSelectedType(target.type);
      setPanTarget(target.coordinates); // pan to follow the tap-through
    }
  }, [manualPins, selectedManualId]);

  // Quick mode: remove a free-form pin (optimistic).
  const handleDeleteManual = useCallback((id: string) => {
    setManualPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedManualId === id) setSelectedManualId(null);
    fetch(`/api/manual-pin?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }, [selectedManualId]);

  // Focus the name field as soon as a point is dropped in quick mode.
  useEffect(() => {
    if (mode === 'quick' && pendingCoords) {
      quickInputRef.current?.focus();
    }
  }, [mode, pendingCoords]);

  // Pin the current location
  const handlePin = useCallback(async () => {
    if (!currentEntry || !pendingCoords) return;

    setLoading(true);
    await fetch('/api/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentEntry.id,
        action: 'pin',
        coordinates: pendingCoords,
        zoomLevel: pendingZoom,
        type: selectedType,
      }),
    });
    await fetchState();
  }, [currentEntry, pendingCoords, pendingZoom, selectedType, fetchState]);

  // Skip current location
  const handleSkip = useCallback(async () => {
    if (!currentEntry) return;

    setLoading(true);
    await fetch('/api/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: currentEntry.id,
        action: 'skip',
      }),
    });
    await fetchState();
  }, [currentEntry, fetchState]);

  // Jump to a specific file
  const handleJumpToFile = useCallback(async (file: string) => {
    setLoading(true);
    const res = await fetch('/api/pin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'jumpToFile', sourceFile: file }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentEntry(data.currentEntry);
      setCurrentContext(data.context ?? null);
      setCurrentIndex(data.currentIndex);
      if (data.currentEntry) {
        setSelectedType(normalizeType(data.currentEntry.suggestedType));
        setPendingZoom(data.currentEntry.suggestedZoomLevel);
      }
    }
    setPendingCoords(null);
    setLoading(false);
  }, []);

  // Browse to a neighbor entry without mutating state
  const handleNavigate = useCallback(async (direction: 1 | -1) => {
    if (currentIndex < 0) return;
    const target = currentIndex + direction;
    if (target < 0) return;

    setLoading(true);
    const res = await fetch('/api/pin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'navigate', targetIndex: target }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentEntry(data.currentEntry);
      setCurrentContext(data.context ?? null);
      setCurrentIndex(data.currentIndex);
      if (data.stats) setStats(data.stats);
      if (data.pinnedData) setPinnedData(data.pinnedData);
      if (data.currentEntry) {
        setSelectedType(normalizeType(data.currentEntry.suggestedType));
        setPendingZoom(data.currentEntry.suggestedZoomLevel);
      }
    }
    setPendingCoords(null);
    setLoading(false);
  }, [currentIndex]);

  // Go back to previous entry
  const handleBack = useCallback(async () => {
    if (currentIndex <= 0) return;

    setLoading(true);
    const res = await fetch('/api/pin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'back', fromIndex: currentIndex }),
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentEntry(data.currentEntry);
      setCurrentContext(data.context ?? null);
      setCurrentIndex(data.currentIndex);
      setStats(data.stats);
      setPinnedData(data.pinnedData);
      if (data.currentEntry) {
        setSelectedType(normalizeType(data.currentEntry.suggestedType));
        setPendingZoom(data.currentEntry.suggestedZoomLevel);
      }
    }
    setPendingCoords(null);
    setLoading(false);
  }, [currentIndex]);

  // Keyboard shortcuts - use capture phase to intercept before Leaflet.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input (e.g. the Quick Label name field)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();

      // Type selection works in both modes (quick mode also offers 'r' = uncategorized).
      const typeMap = mode === 'quick' ? QUICK_KEY_TO_TYPE : KEY_TO_TYPE;
      if (typeMap[key]) {
        e.preventDefault();
        e.stopPropagation();
        // Quick mode retypes the selected pin; queue mode sets the pending type.
        if (mode === 'quick') handleRetypeManual(typeMap[key]);
        else setSelectedType(typeMap[key]);
        return;
      }

      // Quick mode: N / P step the selection through the placed pins.
      if (mode === 'quick') {
        if (key === 'n' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          handleSelectManual(1);
        } else if (key === 'p' && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
          handleSelectManual(-1);
        }
        return;
      }

      // Remaining shortcuts are queue-only.
      if (mode !== 'queue') return;

      // Skip: S or Tab
      if ((key === 's' || key === 'tab') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        handleSkip();
        return;
      }

      // Pin: F or Space (left-hand friendly)
      if ((key === 'f' || key === ' ') && pendingCoords && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        handlePin();
        return;
      }

      // Back: A or Backspace
      if ((key === 'a' || key === 'backspace') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        handleBack();
        return;
      }

      // Browse next/prev without mutating state: N / P
      if (key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        handleNavigate(1);
        return;
      }
      if (key === 'p' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
        handleNavigate(-1);
        return;
      }
    };
    // Use capture phase to intercept events before they reach Leaflet
    document.addEventListener('keydown', handler, true);
    return () => document.removeEventListener('keydown', handler, true);
  }, [mode, handleSkip, handlePin, handleBack, handleNavigate, handleRetypeManual, handleSelectManual, pendingCoords]);

  // Manual pins as their own light marker layer (kept separate from the heavy
  // ~1.7k wiki layer so adding/retyping a pin doesn't rebuild the whole map).
  const manualAsPinned = useMemo<PinnedData>(
    () =>
      Object.fromEntries(
        manualPins.map((p) => [
          p.id,
          { coordinates: p.coordinates, zoomLevel: p.zoomLevel, type: p.type, pinnedAt: p.createdAt },
        ])
      ),
    [manualPins]
  );
  const manualNames = useMemo<Record<string, string>>(
    () => Object.fromEntries(manualPins.map((p) => [p.id, p.name])),
    [manualPins]
  );

  if (!config) return <MapLoading />;

  const progress = stats ? ((stats.pinned + stats.skipped) / stats.total * 100).toFixed(1) : 0;

  function pickSectionContent(): string {
    if (currentContext?.fullContent && currentContext.fullContent.trim().length > 0) {
      return currentContext.fullContent;
    }
    if (currentEntry?.contentPreview && currentEntry.contentPreview.trim().length > 0) {
      return currentEntry.contentPreview;
    }
    return '(No content)';
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Panel - Location Info */}
      <div className="w-[420px] flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Header with stats */}
        <div className="px-4 py-3 border-b border-sidebar-border bg-parchment-light">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-lg font-semibold text-ink">Location Pinning</h1>
            <Link href="/" className="text-xs text-ink-muted hover:text-ink">← Back to Map</Link>
          </div>
          {/* Mode toggle: queue walk-through vs free-form quick labeling */}
          <div className="flex gap-1 mb-2 p-0.5 bg-parchment rounded">
            {([
              { id: 'queue', label: 'Queue' },
              { id: 'quick', label: 'Quick Label' },
            ] as { id: PinMode; label: string }[]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setMode(id);
                  setPendingCoords(null);
                  // Quick mode defaults to uncategorized; queue restores the entry's type.
                  if (id === 'quick') setSelectedType('uncategorized');
                  else if (currentEntry) setSelectedType(normalizeType(currentEntry.suggestedType));
                }}
                className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                  mode === id
                    ? 'bg-accent-gold text-white'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {mode === 'queue' && stats && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>{stats.pinned} pinned, {stats.skipped} skipped</span>
                <span>{stats.pending} remaining</span>
              </div>
              <div className="h-2 bg-parchment rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {mode === 'quick' && (
          <QuickLabelPanel
            pendingCoords={pendingCoords}
            pendingZoom={pendingZoom}
            setPendingZoom={setPendingZoom}
            quickName={quickName}
            setQuickName={setQuickName}
            selectedType={selectedType}
            inputRef={quickInputRef}
            onSave={handleSaveManual}
            manualPins={manualPins}
            onDelete={handleDeleteManual}
            selectedManualId={selectedManualId}
            onSelectPin={(id) => {
              setSelectedManualId(id);
              const pin = manualPins.find((p) => p.id === id);
              if (pin) {
                setSelectedType(pin.type);
                setPanTarget(pin.coordinates);
              }
            }}
            onRetype={handleRetypeManual}
          />
        )}

        {/* File selector */}
        {mode === 'queue' && (
        <div className="px-4 py-2 border-b border-sidebar-border">
          <select
            className="w-full px-2 py-1 text-sm bg-parchment border border-border rounded"
            value={currentEntry ? currentEntry.sourceFile : SOURCE_FILES[0]}
            onChange={(e) => handleJumpToFile(e.target.value)}
          >
            {SOURCE_FILES.map(f => (
              <option key={f} value={f}>{f.replace('.md', '')}</option>
            ))}
          </select>
        </div>
        )}

        {/* Current entry */}
        {mode === 'queue' && (currentEntry ? (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-4 border-b border-sidebar-border">
              {currentContext && currentContext.parentChain.length > 0 && (
                <div className="text-xs text-ink-muted mb-1 truncate">
                  {currentContext.parentChain.map(c => c.name).join(' › ')}
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                {(() => {
                  const Icon = LOCATION_ICONS[selectedType];
                  const color = LOCATION_COLORS[selectedType];
                  return <Icon className="w-5 h-5" style={{ color }} />;
                })()}
                <h2 className="font-display text-xl font-semibold text-ink">
                  {currentEntry.name}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="bg-parchment px-1.5 py-0.5 rounded">
                  {currentEntry.headerText}
                </span>
                <span>Line {currentEntry.lineNumber}</span>
                <span>{currentEntry.sourceFile.replace('.md', '')}</span>
                {currentEntry.status !== 'pending' && (
                  <span
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      currentEntry.status === 'pinned'
                        ? 'bg-accent-gold/30 text-ink'
                        : 'bg-ink-muted/20 text-ink'
                    }`}
                  >
                    {currentEntry.status}
                  </span>
                )}
              </div>
              {currentEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentEntry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-xs bg-accent-gold/20 text-ink rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {currentContext && currentContext.siblings.length > 0 && (() => {
                const sibs = currentContext.siblings;
                const pinned = sibs.filter(s => s.status === 'pinned').length;
                const skipped = sibs.filter(s => s.status === 'skipped').length;
                const pending = sibs.filter(s => s.status === 'pending').length;
                const parentName = currentContext.parentChain.length > 0
                  ? currentContext.parentChain[currentContext.parentChain.length - 1].name
                  : currentEntry.sourceFile.replace('.md', '');
                return (
                  <p className="text-xs text-ink-muted mt-2">
                    {sibs.length} sibling{sibs.length === 1 ? '' : 's'} under {parentName}
                    {' '}
                    <span className="opacity-70">
                      ({pinned} pinned, {skipped} skipped, {pending} pending)
                    </span>
                  </p>
                );
              })()}
            </div>

            {/* Preview summary (flattened, from extraction) */}
            {currentEntry.contentPreview && currentEntry.contentPreview.trim().length > 0 && (
              <div className="px-4 py-3 border-b border-sidebar-border">
                <div className="text-xs font-medium text-ink-muted mb-1">Preview</div>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {currentEntry.contentPreview}
                </p>
              </div>
            )}

            {/* Section content */}
            <div className="px-4 py-3 border-b border-sidebar-border">
              <div className="text-xs font-medium text-ink-muted mb-1">Section content</div>
              <div className="max-h-72 overflow-y-auto bg-parchment/40 rounded p-2">
                <pre className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap font-sans">
                  {pickSectionContent()}
                </pre>
              </div>
            </div>

            {/* Related entries (same name elsewhere in the queue) */}
            {currentContext && currentContext.related.length > 0 && (
              <div className="px-4 py-3 border-b border-sidebar-border">
                <div className="text-xs font-medium text-ink-muted mb-2">
                  Related entries ({currentContext.related.length})
                </div>
                <div className="space-y-3">
                  {currentContext.related.map(rel => (
                    <div key={rel.id} className="bg-parchment/40 rounded p-2">
                      <div className="text-xs text-ink-muted mb-1 truncate">
                        {[rel.sourceFile.replace('.md', ''), ...rel.parentNames].join(' › ')}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-ink">{rel.name}</span>
                        <span className="text-[10px] text-ink-muted bg-parchment px-1 py-0.5 rounded">
                          {rel.headerText}
                        </span>
                        <span className="text-[10px] text-ink-muted">L{rel.lineNumber}</span>
                        <span className="text-[10px] text-ink-muted ml-auto">{rel.status}</span>
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <pre className="text-xs text-ink-muted leading-relaxed whitespace-pre-wrap font-sans">
                          {rel.content && rel.content.trim().length > 0
                            ? rel.content
                            : '(No content)'}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Type selector */}
            <div className="px-4 py-3 border-b border-sidebar-border">
              <label className="block text-xs font-medium text-ink-muted mb-1">Type</label>
              <div className="grid grid-cols-4 gap-1">
                {LOCATION_TYPE_CONFIG.map(({ type, key, description }) => {
                  const Icon = LOCATION_ICONS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      title={description}
                      className={`px-2 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
                        selectedType === type
                          ? 'bg-accent-gold text-white border-accent-gold'
                          : 'bg-parchment border-border text-ink-muted hover:border-ink-muted'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="truncate">{type}</span>
                      <kbd className="ml-auto text-[10px] opacity-60 font-mono">{key}</kbd>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pending coords */}
            <div className="px-4 py-3 border-b border-sidebar-border">
              <label className="block text-xs font-medium text-ink-muted mb-1">
                Coordinates (click map)
              </label>
              {pendingCoords ? (
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-parchment px-2 py-1 rounded">
                    [{pendingCoords[0]}, {pendingCoords[1]}]
                  </code>
                  <span className="text-xs text-ink-muted">Zoom: {pendingZoom}</span>
                </div>
              ) : (
                <p className="text-sm text-ink-muted italic">Click on the map to set position</p>
              )}
            </div>

            {/* Zoom level override */}
            <div className="px-4 py-3 border-b border-sidebar-border">
              <label className="block text-xs font-medium text-ink-muted mb-1">Zoom Level</label>
              <input
                type="range"
                min={1}
                max={5}
                value={pendingZoom}
                onChange={(e) => setPendingZoom(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-ink-muted">
                <span>1 (Continental)</span>
                <span className="font-medium">{pendingZoom}</span>
                <span>5 (Local)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-ink-muted">No more pending locations!</p>
          </div>
        ))}

        {/* Actions */}
        {mode === 'queue' && (
        <div className="px-4 py-3 border-t border-sidebar-border bg-parchment-light">
          <div className="flex gap-2 mb-2">
            <Button
              variant="ghost"
              onClick={() => handleNavigate(-1)}
              disabled={currentIndex <= 0 || loading}
              className="flex-1"
              title="Browse to previous entry (no state change)"
            >
              ← Prev <kbd className="ml-1 text-xs opacity-60">P</kbd>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigate(1)}
              disabled={!stats || currentIndex < 0 || currentIndex >= stats.total - 1 || loading}
              className="flex-1"
              title="Browse to next entry (no state change)"
            >
              Next → <kbd className="ml-1 text-xs opacity-60">N</kbd>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentIndex <= 0 || loading}
              className="px-2"
              title="Revert previous decision and edit it"
            >
              <kbd className="text-xs opacity-60">A</kbd>
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={!currentEntry || loading}
              className="flex-1"
            >
              Skip <kbd className="ml-1 text-xs opacity-60">S</kbd>
            </Button>
            <Button
              variant="accent"
              onClick={handlePin}
              disabled={!currentEntry || !pendingCoords || loading}
              className="flex-1"
            >
              Pin <kbd className="ml-1 text-xs opacity-80">F</kbd>
            </Button>
          </div>
          {stats && (
            <p className="text-xs text-ink-muted text-center mt-2">
              Entry {currentIndex + 1} of {stats.total}
            </p>
          )}
        </div>
        )}
      </div>

      {/* Right - Map */}
      <div className="flex-1 relative">
        <PinningMap
          config={config}
          tilesPath={TILES_BASE_URL}
          onMapClick={handleMapClick}
          pendingCoords={pendingCoords}
          pendingType={selectedType}
          pendingLabel={mode === 'quick' ? quickName : undefined}
          pinnedData={pinnedData}
          labels={pinnedNames}
          manualData={manualAsPinned}
          manualLabels={manualNames}
          highlightId={mode === 'quick' ? selectedManualId : null}
          panTo={mode === 'quick' ? panTarget : null}
        />
      </div>
    </div>
  );
}
