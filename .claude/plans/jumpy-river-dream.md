Perfect! Now I have enough context to design the implementation plan. Let me create a comprehensive plan for the cinematic loading experience.

---

# Implementation Plan: Cinematic Map Loading Experience

## Current State Analysis

**Files Examined:**
- `src/app/page.tsx` - Main page component with config fetch and map rendering
- `src/components/InteractiveMap.tsx` - Leaflet map wrapper with tile layer
- `src/app/globals.css` - Fantasy parchment theme with tw-animate-css
- `src/lib/tiles.ts` - Async config fetching from R2 CDN

**Current Flow:**
1. Page loads → Shows `MapLoading` component (parchment bg, "Loading map..." text)
2. `fetchTileConfig()` fetches config from R2
3. `InteractiveMap` renders with `config.minZoom` as initial zoom
4. Leaflet loads tiles asynchronously (no load state tracking)
5. Map immediately visible when tiles render

**Problems:**
- No dramatic reveal—map just appears
- Default zoom is `minZoom` (likely 0), not zoom level 1 as requested
- No detection of when tiles have actually loaded
- No cinematic buildup or fade effect

---

## Design: Epic Fantasy Map Reveal

### Animation Choreography (Total: ~3.5-4s)

**Phase 1: Initial Darkness (0-0.8s)**
- Black/very dark overlay covers entire screen
- Optional: Gold title text fades in ("Alaria" or "The World of Alaria")
- Uses `--ink` for dark background (#2c2416 or pure black)

**Phase 2: Title Hold (0.8-1.5s)**
- Title remains visible (if included)
- Subtle gold glow/shimmer effect on title

**Phase 3: Dramatic Fade Reveal (1.5-3.5s)**
- Black overlay fades out with 2s duration
- Ease-out timing for majestic feel
- Title fades out simultaneously (if used)
- Map tiles are loading underneath during this time

**Phase 4: Map Ready (3.5s+)**
- Overlay completely removed
- Map fully interactive
- Tiles continue loading if needed (lower zoom levels)

### Timing Considerations

1. **Config Fetch**: ~200-800ms (CDN latency)
2. **Leaflet Init**: ~50-100ms (map setup)
3. **Tile Loading**: ~500-2000ms (depends on zoom level, network)
4. **Animation Buffer**: Start fade before ALL tiles load, but after initial view tiles

**Strategy**: Start animation when first batch of tiles loads (using Leaflet's `load` event), not when ALL tiles finish. This prevents waiting for offscreen tiles.

---

## Technical Implementation

### A. State Management in `page.tsx`

Add loading state tracking:
```typescript
const [config, setConfig] = useState<MapConfig | null>(null);
const [mapReady, setMapReady] = useState(false); // NEW
const [showOverlay, setShowOverlay] = useState(true); // NEW
```

Flow:
1. `config === null` → Fetching config, show black screen
2. `config !== null && !mapReady` → Map rendering/tiles loading, show black overlay
3. `mapReady === true` → Trigger fade animation
4. `showOverlay === false` → Overlay completely removed after animation

### B. Leaflet Tile Load Detection in `InteractiveMap.tsx`

Leaflet provides these events:
- `load` - Fires when tiles in current view finish loading ✅ **Use this**
- `tileloadstart` - Individual tile starts
- `tileload` - Individual tile loads
- `tileerror` - Tile fails to load

**Implementation:**
```typescript
// In useEffect where map is created
const tileLayer = L.tileLayer(...);

// Track initial load
let hasLoadedOnce = false;

tileLayer.on('load', () => {
  if (!hasLoadedOnce) {
    hasLoadedOnce = true;
    onMapReady?.(); // Callback to parent
  }
});

// Timeout fallback if tiles don't load
const timeoutId = setTimeout(() => {
  if (!hasLoadedOnce) {
    onMapReady?.();
  }
}, 3000); // 3s max wait

// Cleanup
return () => clearTimeout(timeoutId);
```

### C. Initial Zoom Level Override

Currently map does `map.fitBounds(bounds)` which sets zoom based on minZoom. 

**Change:**
```typescript
// After map.fitBounds(bounds)
map.setZoom(1); // Force zoom level 1
```

This ensures the map starts at the desired overview zoom level.

### D. CSS Animations in `globals.css`

Add new keyframes and utilities:

```css
@layer utilities {
  /* Cinematic overlay fade */
  @keyframes cinematic-fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes title-glow {
    0%, 100% {
      text-shadow: 
        0 0 20px rgba(201, 162, 39, 0.5),
        0 0 40px rgba(201, 162, 39, 0.3),
        0 0 60px rgba(201, 162, 39, 0.1);
    }
    50% {
      text-shadow: 
        0 0 30px rgba(201, 162, 39, 0.7),
        0 0 50px rgba(201, 162, 39, 0.4),
        0 0 70px rgba(201, 162, 39, 0.2);
    }
  }

  .cinematic-overlay {
    position: fixed;
    inset: 0;
    background-color: #1a1612; /* Darker ink */
    z-index: 9999;
    pointer-events: none;
  }

  .cinematic-fade {
    animation: cinematic-fade-out 2s ease-out forwards;
  }

  .cinematic-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 600;
    color: var(--gold);
    text-align: center;
    animation: title-glow 2s ease-in-out infinite;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .cinematic-fade {
      animation: cinematic-fade-out 0.3s ease-out forwards;
    }
    
    .cinematic-title {
      animation: none;
      text-shadow: 0 0 20px rgba(201, 162, 39, 0.5);
    }
  }
}
```

### E. Overlay Component in `page.tsx`

Replace `MapLoading` with cinematic overlay:

```tsx
function CinematicOverlay({ 
  isVisible, 
  onAnimationComplete 
}: { 
  isVisible: boolean;
  onAnimationComplete: () => void;
}) {
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animationDuration = prefersReducedMotion ? 300 : 2000;

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(onAnimationComplete, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, animationDuration, onAnimationComplete]);

  if (!isVisible && /* animation complete */) {
    return null;
  }

  return (
    <div 
      className={`cinematic-overlay ${!isVisible ? 'cinematic-fade' : ''}`}
    >
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="cinematic-title">
          Alaria
        </h1>
      </div>
    </div>
  );
}
```

---

## Detailed Code Changes

### 1. **src/app/page.tsx** - Main orchestration

**Changes:**
- Add `mapReady` and `overlayVisible` state
- Replace `MapLoading` with `CinematicOverlay`
- Pass `onMapReady` callback to `InteractiveMap`
- Manage overlay fade timing

**State Flow:**
```
Initial: config=null, mapReady=false, overlayVisible=true
  ↓ (config fetched)
Config loaded: config={...}, mapReady=false, overlayVisible=true
  ↓ (map tiles load)
Map ready: config={...}, mapReady=true, overlayVisible=true
  ↓ (trigger fade)
Fading: config={...}, mapReady=true, overlayVisible=false
  ↓ (after 2s)
Complete: overlay unmounts
```

### 2. **src/components/InteractiveMap.tsx** - Tile load detection

**Changes:**
- Accept `onMapReady?: () => void` prop
- Add tile layer `load` event listener
- Add timeout fallback (3s max)
- Call `onMapReady()` on first successful load
- Override initial zoom to 1 instead of minZoom

**Event Handling:**
```typescript
// Track if we've already called the callback
const hasNotifiedReady = useRef(false);

const notifyReady = () => {
  if (!hasNotifiedReady.current) {
    hasNotifiedReady.current = true;
    onMapReady?.();
  }
};

tileLayer.on('load', notifyReady);
const timeout = setTimeout(notifyReady, 3000);
```

### 3. **src/app/globals.css** - Animations

**Additions:**
- `@keyframes cinematic-fade-out` - 2s opacity fade
- `@keyframes title-glow` - Pulsing gold glow effect
- `.cinematic-overlay` - Full-screen dark layer
- `.cinematic-fade` - Applied when starting fade
- `.cinematic-title` - Stylized title text
- Reduced motion variants

---

## Animation Timing Variants

### Option A: Title Reveal (Recommended)
```
0.0s: Black screen
0.3s: "Alaria" title fades in (0.5s fade)
0.8s: Title visible with glow
1.5s: Map tiles loaded → trigger fade
1.5s-3.5s: Title + overlay fade out together (2s)
3.5s: Map fully revealed
```

### Option B: No Title (Minimal)
```
0.0s: Black screen
0.0s-1.0s: Config fetch + map init
1.0s: Tiles loading
1.5s: First tiles loaded → trigger fade
1.5s-3.5s: Black overlay fades out (2s)
3.5s: Map fully revealed
```

### Option C: Extended Cinematic (Epic)
```
0.0s: Black screen
0.5s: "Alaria" title fades in (0.8s fade)
1.3s: Title hold with glow
2.0s: Map tiles loaded → start fade
2.0s: Subtitle appears: "The Known World" (0.5s fade)
2.5s-4.5s: All text + overlay fade (2s)
4.5s: Map revealed
```

**Recommendation**: Option A with title. It provides cinematic feel without being tediously long.

---

## Reduced Motion Support

For users with `prefers-reduced-motion: reduce`:
- Fade duration: 2s → 0.3s
- Title glow animation: disabled
- Overlay: still present for content stability
- No motion sickness triggers

Implementation via media query in CSS + JS check for timing.

---

## Edge Cases & Error Handling

1. **Config fetch fails**: Show error message instead of infinite black screen
2. **Tiles fail to load**: 3s timeout triggers fade anyway
3. **Very slow connection**: Fade starts even if tiles aren't fully loaded (graceful degradation)
4. **User navigates away**: Cleanup timers/listeners in useEffect returns
5. **SSR/hydration**: Overlay uses client-side rendering, no SSR mismatch

---

## Testing Checklist

- [ ] Config fetch < 1s → smooth transition
- [ ] Config fetch > 2s → still looks intentional
- [ ] Fast connection → tiles load before fade starts
- [ ] Slow connection → fade starts with partial tiles (graceful)
- [ ] Tile errors → fallback timeout works
- [ ] Reduced motion → quick fade, no glow
- [ ] Mobile devices → performance acceptable
- [ ] Return visits → same experience (no caching issues)

---

## Performance Considerations

**CSS Performance:**
- Use `opacity` (composited property, GPU-accelerated)
- `position: fixed` creates stacking context once
- `will-change` NOT needed (opacity is already optimized)
- No reflows during animation

**JS Performance:**
- Single event listener on tile layer
- Simple boolean state checks
- Timeout cleanup prevents memory leaks
- No expensive calculations during animation

**Bundle Size:**
- +~50 lines CSS (~2KB)
- +~40 lines TSX (~1.5KB)
- No new dependencies

---

### Critical Files for Implementation

1. **src/app/page.tsx** - Primary orchestration logic; add loading states, overlay management, and map ready callback handling
2. **src/components/InteractiveMap.tsx** - Tile load detection; add Leaflet load event listener, timeout fallback, and zoom override to level 1
3. **src/app/globals.css** - Animation definitions; add cinematic fade keyframes, overlay styles, title glow effect, and reduced-motion support

---

## Summary

This implementation creates a **majestic 3.5s cinematic reveal** for the fantasy map with:
- ✅ Black screen with optional gold "Alaria" title
- ✅ 2s smooth fade to reveal map at zoom level 1
- ✅ Proper Leaflet tile load detection with fallback
- ✅ Reduced motion accessibility
- ✅ Graceful degradation on slow connections
- ✅ Pure CSS animations (no Framer Motion needed)
- ✅ Fantasy parchment theme colors (gold, ink, dark parchment)

The system is robust, performant, and provides an epic first impression worthy of a fantasy world atlas.