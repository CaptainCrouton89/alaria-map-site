Perfect! Now let me create a comprehensive summary document:

## Component Structure & Architecture Analysis

I've explored the map application and created a comprehensive analysis of the current component structure, UI patterns, and styling system. Here's what I found:

### **Directory Structure**

```
src/
├── app/
│   ├── page.tsx (Main interactive map page)
│   ├── pin/page.tsx (Location pinning page)
│   ├── layout.tsx (Root layout with fonts)
│   ├── globals.css (Complete design system)
│   └── api/
│       └── pin/route.ts (API endpoint)
├── components/
│   ├── InteractiveMap.tsx (Leaflet map wrapper with markers)
│   ├── PinningMap.tsx (Enhanced map for pinning interface)
│   └── ui/
│       ├── button.tsx (CVA-based button component)
│       ├── scroll-area.tsx (Radix UI scroll area)
│       └── separator.tsx (Radix UI separator)
├── types/
│   ├── location.ts (Location & MapConfig types)
│   └── pinning.ts (Pinning workflow types)
└── lib/
    └── utils.ts (cn() utility for class merging)
```

### **Existing UI Components**

**1. Button Component** (`src/components/ui/button.tsx`)
- Uses CVA (class-variance-authority) for variant system
- **Variants**: `default`, `accent`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `nav`, `nav-active`
- **Sizes**: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`
- Fully integrated with parchment color theme

**2. ScrollArea Component** (`src/components/ui/scroll-area.tsx`)
- Radix UI wrapper with custom styling
- Parchment-themed scrollbar with border colors

**3. Separator Component** (`src/components/ui/separator.tsx`)
- Radix UI separator with horizontal/vertical orientation
- Uses `--border` CSS variable for consistent styling

### **Design System & Styling**

**Color Palette** (from `globals.css`):
- **Parchment Base**: `#f5f0e6` (main), `#faf8f3` (light), `#e8e0d0` (dark)
- **Ink**: `#2c2416` (primary), `#5c5346` (muted)
- **Gold Accent**: `#c9a227` (primary), `#a68a4b` (muted)
- **Destructive**: `#9c2222`
- **Border**: `#d4c5a9`
- **Location Types**: 11 muted jewel-tone colors mapped to specific location types

**Typography**:
- Display Font: Cinzel (serif) - `--font-cinzel` for headings
- Body Font: Inter (sans-serif) - `--font-inter` for text
- Utility classes: `.font-display`, `.text-ink`, `.text-ink-muted`, `.bg-parchment`, `.bg-parchment-light`, `.bg-parchment-dark`

**CSS Utilities**:
- Parchment texture overlay class: `.parchment-texture`
- Location selection style: `.location-selected` (gold underline)
- All components use Tailwind + custom CSS variables

### **Component Patterns**

**1. Map Components**
- `InteractiveMap` - Basic map viewer with clickable markers, zoom-dependent location visibility
- `PinningMap` - Enhanced map with pending marker (animated pulse), pinned markers (faded), coordinate display
- Both use Leaflet with custom CRS (Simple coordinate system for pixel-based positioning)

**2. Layout Pattern**
- Sidebar pattern: Fixed-width left panel (380px for viewer, 420px for pinning) with scrollable content
- Floating controls: Top-right buttons for tab switching
- Map takes remaining space

**3. Sidebar Content Pattern** (from `page.tsx` and `pin/page.tsx`):
```
- Top: Header with navigation/close button
- Separator
- Title section with icon + metadata
- Separator
- Scrollable content area
- Separator sections with distinct purposes
- Bottom: Action buttons in fixed footer
```

**4. Typography Hierarchy**:
- Display font (Cinzel) for h1/h2/location names
- Inter for body text and UI labels
- Semantic text classes: `.text-ink` (primary), `.text-ink-muted` (secondary)

### **Key Technical Patterns**

1. **Dynamic Imports**: Both map components use `next/dynamic` with SSR disabled due to Leaflet
2. **State Management**: Component-level state with `useState`, no global context for core maps
3. **Marker System**: Custom HTML emoji-based markers with div icons and inline styles
4. **Zoom-Based Visibility**: Locations only appear when zoom level >= their `zoomLevel` property
5. **Coordinate System**: Image coordinates (top-left origin) converted to Leaflet coords (bottom-left origin)
6. **Loading States**: Separate `MapLoading` component for fallback

### **Existing Interactive Features**

- Location selection with visual feedback (gold underline on labels)
- Hover effects on markers (scale 1.05)
- Type-based emoji icons and colors for locations
- Pin placement with pending state (pulsing animation)
- Keyboard shortcuts: `S` for skip, `Enter` to pin
- File jumping for work queue navigation
- Progress tracking with visual progress bar

### **Styling Approach**

- **Base**: Tailwind CSS v4
- **Component Library**: Radix UI primitives
- **Variants**: CVA (class-variance-authority) for button variants
- **CSS Variables**: Extensive use of CSS custom properties for theming
- **JSX Styles**: Inline `<style jsx global>` for complex interactive styles (marker animations, Leaflet overrides)
- **Light-Mode Only**: Currently configured for immersive parchment aesthetic, dark mode variables defined for future use

This is a well-organized, cohesive design system ready for expansion with new components and features.