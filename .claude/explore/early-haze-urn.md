Perfect! Now I have a comprehensive understanding of the map application. Let me create a detailed summary report:

## Exploration Summary: Map Application Architecture

### 1) **Current Loading States and Transitions**

#### Page-Level Loading
- **Main Page (`page.tsx`, lines 20-26)**: `MapLoading` component shows a simple loading state while the InteractiveMap component loads
  - Uses `dynamic` import with `ssr: false` to avoid SSR issues with Leaflet
  - Shows: `"Loading map..."` text on parchment background
  - No animated loading indicator currently

- **Pin Page (`pin/page.tsx`, lines 17-23)**: Similar `MapLoading` component reused
  - Maps are dynamically loaded client-side only

#### Marker-Level Loading/Transitions
- **InteractiveMap (`InteractiveMap.tsx`, lines 144-149)**: Marker hover animation
  - `transform: scale(1.05)` on hover with `transition: transform 0.15s ease`
  - Selected state also applies `scale(1.05)`

- **PinningMap (`PinningMap.tsx`, lines 192-211)**: Pending marker pulse animation
  ```jsx
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.4; }
    100% { transform: scale(2); opacity: 0; }
  }
  ```
  - Duration: `1.5s ease-out infinite`
  - Used on pending location markers during pinning workflow

#### Sidebar Transitions
- **Page (`page.tsx`, lines 67-116)**: Location sidebar appears/disappears
  - Currently no transition classes visible
  - Shows conditionally with `{selectedLocation && (...)}`

#### Content Reveal Animations
- **CodexEntry (`CodexEntry.tsx`)**: Progressive revelation with scroll-based triggering
  - Uses IntersectionObserver (30% threshold) for scroll detection
  - `reveal-collapsed` and `reveal-expanded` states in globals.css
  - **Unfurl keyframe** (`globals.css`, lines 296-307):
    ```css
    @keyframes unfurl {
      from {
        max-height: 6rem;
        opacity: 0.8;
        transform: translateY(-4px);
      }
      to {
        max-height: 2000px;
        opacity: 1;
        transform: translateY(0);
      }
    }
    ```
  - Duration: `0.4s cubic-bezier(0.4, 0, 0.2, 1)`

#### Atmosphere Transitions
- **CodexEntry** (`atmosphere.ts`, lines 136-141): 
  - Atmosphere background transitions: `transition-colors duration-[600ms] ease-in-out`
  - Respects `prefers-reduced-motion: reduce`

---

### 2) **How Map Config is Fetched**

#### Config Fetching (`tiles.ts`, lines 5-11)
```typescript
export const TILES_BASE_URL = 'https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/tiles';

export async function fetchTileConfig(): Promise<MapConfig> {
  const res = await fetch(`${TILES_BASE_URL}/config.json`);
  if (!res.ok) {
    throw new Error('Tiles not found on R2. Upload tiles to the alaria bucket.');
  }
  return res.json();
}
```

**Usage Pattern:**
- **Page.tsx** (lines 46-50): Fetches in `useEffect` with no dependencies
  ```typescript
  useEffect(() => {
    fetchTileConfig()
      .then(setConfig)
      .catch(console.error);
  }, []);
  ```
- **Pin Page** (lines 80-84): Same pattern

**Error Handling:** Minimal - errors log to console, page shows `MapLoading` indefinitely if fetch fails

**Config Type** (`location.ts`, lines 23-29):
```typescript
interface MapConfig {
  imageWidth: number;
  imageHeight: number;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
}
```

---

### 3) **Existing Animation/Transition Utilities**

#### CSS Animations Defined in `globals.css`

1. **Unfurl Animation** (lines 296-311):
   - Progressive expansion of collapsed content
   - Combines max-height, opacity, and translateY

2. **Pulse Animation** (in `PinningMap.tsx`, lines 202-211):
   - Radiating pulse from marker center
   - Scale and opacity-based expansion

3. **Marker Transitions** (in component JSX):
   - Scale transforms on hover/selected state
   - `transition: transform 0.15s ease`

4. **Atmosphere Background Transition** (lines 271-274):
   - `transition: background-color 600ms ease`
   - Used for location entry atmosphere effects

#### Utility Classes (`globals.css`, lines 201-275)

- `.font-display`: Display font family
- `.text-ink` / `.text-ink-muted`: Semantic text colors
- `.bg-parchment*`: Parchment background colors
- `.border-parchment`: Border styling
- `.location-selected`: Gold underline decoration
- `.atmosphere-*`: Atmospheric background tints (8 types)
- `.atmosphere-transition`: CSS transition wrapper
- `.reveal-collapsed` / `.reveal-expanded`: Progressive revelation states
- `.reveal-gradient`: Gradient overlay for collapsed content
- `.corner-flourish*`: Ornamental corner decorations
- Reduced motion support (lines 350-359)

#### Tailwind v4 Integration
- `@import "tailwindcss"` + `@import "tw-animate-css"` in globals.css
- Custom theme variables defined inline
- Uses `@theme inline` block (lines 8-70)
- Custom animations from `tw-animate-css` package available

#### No Dedicated Animation Utility Library
- **No Framer Motion or similar**: All animations are CSS-based
- **Leaflet controls**: Custom styled with hardcoded CSS
- **Performance optimizations**: `will-change`, `backface-visibility: hidden`, `translate3d` hacks (InteractiveMap, lines 195-199)

---

### 4) **Tailwind Config and Custom Animations**

#### Tailwind CSS v4 Setup
- **PostCSS** (`postcss.config.mjs`): `@tailwindcss/postcss` plugin
- **Globals** (`globals.css`): 
  - Imports `@import "tw-animate-css"` for additional animations
  - Uses new Tailwind v4 inline `@theme` syntax

#### Theme Colors (`:root`, lines 72-136)

**Parchment Palette:**
- `--parchment`: `#f5f0e6` (cream)
- `--parchment-dark`: `#e8e0d0` (aged paper)
- `--parchment-light`: `#faf8f3` (light cream)
- `--ink`: `#2c2416` (dark brown)
- `--ink-muted`: `#5c5346` (muted brown)
- `--gold`: `#c9a227` (accent gold)
- `--gold-muted`: `#a68a4b` (muted gold)

**Location Type Colors** (`location.ts`, lines 33-42):
```typescript
region: '#b8956b',      // warm tan
city: '#c9a227',        // gold
town: '#a68a64',        // muted tan
fortress: '#6c6c6c',    // stone grey
ruins: '#7a7a7a',       // faded grey
wilderness: '#4a7c59',  // forest green
water: '#4a8c9c',       // ocean blue
poi: '#5a7a8c',         // slate blue
```

**Atmospheric Tints** (lines 127-136):
- 8 atmosphere types with subtle color overlays (2-6% opacity)
- Themes: civilization, sacred, cursed, ancient, dangerous, trade, nature, water

#### Custom Animation Keyframes

Defined inline in component styles or globals.css:

1. **Pulse** (PinningMap):
   - `0%`: scale(0.8), opacity: 0.4
   - `100%`: scale(2), opacity: 0
   - Duration: 1.5s

2. **Unfurl** (globals.css):
   - Smooth content expansion
   - Duration: 0.4s
   - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

#### Fonts
- **Display**: Cinzel (serif, elegant)
- **Body**: Inter (sans-serif, readable)
- Variables: `--font-cinzel`, `--font-inter` set in `layout.tsx`

#### Dark Mode Support
- Dark theme CSS vars defined (lines 140-175)
- Currently light-mode only for "immersive parchment feel"
- Framework in place for future dark mode toggle

#### Reduced Motion Support
- All animations respect `@media (prefers-reduced-motion: reduce)` (lines 350-359)
- Animations disabled for accessibility

---

### Key Files Summary

| File | Purpose | Key Content |
|------|---------|-------------|
| `src/app/page.tsx` | Main map view | Config fetching, sidebar selection, marker click handling |
| `src/components/InteractiveMap.tsx` | Leaflet map wrapper | Marker rendering, zoom-based visibility, scale animations |
| `src/components/PinningMap.tsx` | Pin tool map | Pending marker pulse, pinned marker display, crosshair cursor |
| `src/lib/tiles.ts` | Tile config fetching | R2 CDN fetch, config parsing |
| `src/lib/atmosphere.ts` | Atmosphere system | Tag-to-atmosphere mapping, transition utilities |
| `src/app/globals.css` | Theme + animations | Unfurl keyframe, atmosphere tints, utility classes |
| `src/types/location.ts` | Type definitions | Location, MapConfig, color palette |
| `postcss.config.mjs` | PostCSS config | Tailwind v4 postcss plugin |

All animations are **CSS-based with inline JSX `<style jsx global>`** for Leaflet-specific styling.