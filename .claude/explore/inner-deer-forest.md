Excellent! Now I have a comprehensive understanding of the styling system. Let me create a detailed report:

## Design System & Styling Architecture Report

### Overview
The Heart Rush Interactive Map uses a **parchment-themed fantasy design system** built on Tailwind CSS v4 with custom CSS variables. The design prioritizes an immersive medieval aesthetic with warm, aged paper tones and muted jewel colors.

---

## Color System

### Core Palette (in `:root`)
**Parchment Foundation:**
- `--parchment: #f5f0e6` - Main background (aged cream)
- `--parchment-dark: #e8e0d0` - Secondary surfaces
- `--parchment-light: #faf8f3` - Lighter cards/popovers
- `--ink: #2c2416` - Primary text/dark elements
- `--ink-muted: #5c5346` - Secondary text
- `--gold: #c9a227` - Accent/highlights
- `--gold-muted: #a68a4b` - Muted accents

**Tailwind Color Mapping:**
- `--background: #f5f0e6` (parchment)
- `--foreground: #2c2416` (ink)
- `--card: #faf8f3` (light parchment)
- `--primary: #2c2416` (ink)
- `--secondary: #e8e0d0` (dark parchment)
- `--accent: #c9a227` (gold)
- `--destructive: #9c2222` (muted red)
- `--border: #d4c5a9` (subtle tan)
- `--input: #e8e0d0` (dark parchment)
- `--ring: #c9a227` (gold - focus ring)

**Sidebar Colors:**
- `--sidebar: #f0ebe0` (slightly darker parchment)
- `--sidebar-primary: #2c2416` (ink)
- `--sidebar-accent: #e8e0d0` (dark parchment)
- `--sidebar-border: #d4c5a9` (border tan)

**Location Type Colors** (muted jewel tones):
```
--loc-region: #b8956b       (warm tan)
--loc-city: #c9a227        (gold)
--loc-town: #a68a64        (muted tan)
--loc-fortress: #6c6c6c    (stone grey)
--loc-dungeon: #8b3a3a     (muted red)
--loc-ruins: #7a7a7a       (faded grey)
--loc-wilderness: #4a7c59  (forest green)
--loc-landmark: #5a7a8c    (slate blue)
--loc-water: #4a8c9c       (ocean blue)
--loc-temple: #6b4a8c      (purple)
--loc-poi: #4a7c7c         (teal)
```

### Dark Mode
Complete dark mode variant defined (lines 130-165) with inverted colors, though app is currently light-only for the parchment aesthetic.

---

## Typography System

**Fonts:**
- **Display Font:** `--font-cinzel` (Google Fonts) - Serif, elegant heading font
- **Body Font:** `--font-inter` (Google Fonts) - Clean sans-serif for body text
- Loading via Next.js Font module with `display: swap`

**Typography Defaults (in @layer base):**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);  /* Cinzel */
  font-weight: 600;
  color: var(--ink);                 /* #2c2416 */
}
```

**Utility Classes:**
- `.font-display` - Apply Cinzel font
- `.text-ink` - Apply ink color
- `.text-ink-muted` - Apply muted ink color

---

## Border Radius System

Calculated using base `--radius: 0.5rem`:
```css
--radius-sm: 0.25rem      (0.5rem - 4px)
--radius-md: 0.375rem    (0.5rem - 2px)
--radius-lg: 0.5rem      (base)
--radius-xl: 0.625rem    (0.5rem + 4px)
```

---

## Button Component System

**Location:** `src/components/ui/button.tsx`

Uses **class-variance-authority (CVA)** for variant management with these variants:

| Variant | Colors | Use Case |
|---------|--------|----------|
| `default` | Ink bg + parchment text | Primary actions |
| `accent` | Gold bg + ink text | Highlighted actions |
| `destructive` | Red bg + light parchment | Danger actions |
| `outline` | Parchment bg + ink text + border | Secondary actions |
| `secondary` | Dark parchment bg | Alternative actions |
| `ghost` | Transparent + muted text | Light interactions |
| `link` | Ink text + underline | Text-style links |
| `nav` | Light parchment + muted text + border | Navigation tabs |
| `nav-active` | Light parchment + ink text (darker) | Active nav tab |

**Sizes:**
- `sm` - 32px (h-8) with rounded-md
- `default` - 36px (h-9)
- `lg` - 40px (h-10)
- `icon-sm` - 32px square
- `icon` - 36px square
- `icon-lg` - 40px square

**Common Styles:**
- `transition-colors` - Smooth hover transitions
- Focus: `focus-visible:ring-2` with gold color
- Disabled: `disabled:opacity-50`

---

## Custom Texture & Effects

### Parchment Texture Layer
**Class:** `.parchment-texture`
- SVG-based fractal noise pattern at 3% opacity
- Applied to background via `background-image` with data URI
- Creates subtle aged paper effect without performance impact

### Location Selection Underline
**Class:** `.location-selected`
```css
text-decoration: underline;
text-decoration-color: var(--gold);     /* #c9a227 */
text-decoration-thickness: 2px;
text-underline-offset: 3px;
```

---

## Interactive Map Styles

**Location:** `src/components/InteractiveMap.tsx` (lines 122-207)

Custom JSX-embedded styles for Leaflet integration:

### Marker Styles
```css
.marker-container {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.15s ease;  /* ⚡ ANIMATION */
}

.marker-container:hover {
  transform: scale(1.05);            /* ⚡ ANIMATION */
}

.marker-selected {
  transform: scale(1.05);
}

.marker-icon {
  font-size: 1.25rem;
  filter: drop-shadow(0 1px 3px rgba(44, 36, 22, 0.4));
}

.marker-label {
  font-family: var(--font-inter);
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c2416;
  text-shadow: 4-point outline (parchment) + center glow;
}

.label-selected {
  text-decoration: underline;
  text-decoration-color: #c9a227;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}
```

### Leaflet Customization
```css
.leaflet-container {
  background: #e8e0d0;
  font-family: var(--font-inter);
}

/* Zoom controls: rounded, parchment-styled */
.leaflet-control-zoom {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.15);
}

.leaflet-control-zoom a {
  background: #faf8f3;
  color: #2c2416;
  border: 1px solid #d4c5a9;
  width/height: 32px;
  font-weight: 500;
}
```

---

## Sidebar Styling

**Location:** `src/app/page.tsx` (lines 73-118)

```css
.sidebar {
  width: 380px;
  background: var(--sidebar);
  box-shadow: 4px 0 24px rgba(44, 36, 22, 0.15);
  display: flex;
  flex-direction: column;
}
```

Uses:
- `ScrollArea` component (Radix UI)
- `Separator` component for visual divisions
- `Button` components for navigation

---

## Animation & Transition System

### Available Animations (via tw-animate-css)

The project imports `tw-animate-css` library providing:

**Enter/Exit Animations:**
- `fade-in` / `fade-out` - Opacity transitions
- `zoom-in` / `zoom-out` - Scale transitions (CSS custom properties)
- `spin-in` / `spin-out` - Rotation transitions
- `slide-in-from-*` / `slide-out-to-*` - Directional slides
  - `top`, `bottom`, `left`, `right`
  - `start`, `end` (RTL-aware)

**Accordion/Collapsible:**
- `accordion-down` / `accordion-up` (0.2s)
- `collapsible-down` / `collapsible-up` (0.2s)

**Utilities:**
- `animation-duration-*` - Custom durations (in milliseconds)
- `delay-*` - Animation delays (0, 75ms, 100ms, 150ms, 200ms, 300ms, 500ms, 700ms, 1000ms)
- `repeat-*` - Iteration counts
- `direction-*` - Animation direction (normal, reverse, alternate)
- `fill-mode-*` - Fill modes (forwards, backwards, both)
- `caret-blink` - Built-in caret animation

### Current Usage in Code

**Minimal animation currently:**
1. **Button transitions:** `transition-colors` on all buttons
2. **Marker hover:** `transform scale(1.05)` with `transition: transform 0.15s ease`
3. **ScrollArea:** `transition-[color,box-shadow]` on viewport
4. **ScrollBar:** `transition-colors` on scrollbar thumb

---

## Component Dependencies

**UI Components Used:**
- `Button` - CVA-based with 9 variants
- `ScrollArea` - Radix UI scroll-area primitive
- `Separator` - Radix UI separator primitive

**Third-Party Libraries:**
- **Radix UI** - `react-scroll-area`, `react-separator`, `react-slot`
- **class-variance-authority** - Button variant system
- **clsx + tailwind-merge** - Utility function for class merging
- **Leaflet** - Map rendering with custom CRS
- **Tailwind CSS v4** - Latest with PostCSS integration
- **tw-animate-css** - Extended animation library

---

## Design Principles Observed

1. **Parchment Aesthetic** - Warm, aged paper colors dominate
2. **Hierarchy via Gold** - Gold accents highlight important elements
3. **Typography Contrast** - Serif (Cinzel) for headings, sans-serif (Inter) for body
4. **Subtle Depth** - Box shadows use ink color with low opacity (0.15)
5. **Muted Jewel Tones** - Location colors are desaturated for fantasy feel
6. **Smooth Interactions** - All transitions use `ease` or `ease-out` timing
7. **No Brightness Extremes** - Colors stay within parchment/ink/gold range
8. **Accessibility** - Focus rings use visible gold color

---

## CSS Variable Reference

**All CSS variables from globals.css theme:**

```
Color Variables: --color-background through --color-loc-poi (60 vars)
Font Variables: --font-sans, --font-display
Radius Variables: --radius-sm through --radius-xl
Parchment Variables: --parchment, --parchment-dark, --parchment-light
Ink Variables: --ink, --ink-muted
Gold Variables: --gold, --gold-muted
Sidebar Variables: 8 custom sidebar colors
Location Colors: 11 location type colors
```

---

## Utility Classes Available

```css
.font-display               /* Cinzel serif font */
.text-ink                   /* #2c2416 */
.text-ink-muted            /* #5c5346 */
.bg-parchment              /* #f5f0e6 */
.bg-parchment-dark         /* #e8e0d0 */
.bg-parchment-light        /* #faf8f3 */
.border-parchment          /* #d4c5a9 */
.parchment-texture         /* SVG noise overlay */
.location-selected         /* Gold underline + offset */
```

Plus all standard Tailwind utilities (flexbox, spacing, sizing, etc.)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Main theme definition (228 lines) |
| `postcss.config.mjs` | PostCSS with Tailwind plugin |
| `src/app/layout.tsx` | Font loading + globals.css import |
| `src/components/ui/button.tsx` | Button component with 9 variants |
| `src/components/InteractiveMap.tsx` | Leaflet map with custom marker styles |
| `src/types/location.ts` | Location styles mapped to colors |