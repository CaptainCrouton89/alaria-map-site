Perfect! Now I have enough context. Let me create a comprehensive implementation plan for typography-as-artifact components for the Codex view.

---

# Typography as Artifact - Implementation Plan

## Context Analysis

After exploring the codebase, I've identified the following key architectural elements:

**Current State:**
- **Design System**: Parchment theme with Cinzel (display) + Inter (body) fonts, gold accents (#c9a227), ink text (#2c2416)
- **Component Pattern**: shadcn/ui with CVA (class-variance-authority) for variants
- **Tailwind v4**: Inline theme configuration with custom CSS variables
- **No Codex Route Yet**: Currently only map view exists; Codex will be a new full-page route
- **No Markdown Renderer**: Will need to add markdown processing for Codex content
- **Existing Utilities**: `cn()` utility for class merging, `parchment-texture` class available

**Design Principles from Existing Code:**
- CSS variable-based theming (`var(--gold)`, `var(--ink)`, etc.)
- CVA variants for component flexibility
- Minimal JavaScript, CSS-first approaches
- Performance-conscious (no heavy assets)
- Shadcn pattern: composition over configuration

---

## Component Architecture

### 1. **DropCap Component** - Illuminated First Letters

**Purpose**: Large decorative first letter on major Codex entries (categories, major locations)

**Implementation Strategy**: CSS-only with pseudo-elements for ornamentation

**Component Structure:**
```typescript
// src/components/typography/DropCap.tsx
interface DropCapProps {
  variant?: 'simple' | 'illuminated' | 'ornate'
  children: string // Single character
  className?: string
}
```

**Variant Breakdown:**

1. **Simple** - Basic enlarged letter, Cinzel font, gold color
   - 3-4 lines tall, float left
   - Gold accent with ink stroke
   - No decoration

2. **Illuminated** - Letter with background treatment
   - Same as simple but with parchment-dark background box
   - Subtle border with gold accent
   - Small margin/padding for breathing room

3. **Ornate** - Decorated with flourishes
   - CSS pseudo-elements for corner flourishes
   - SVG-based unicode ornaments (❧, ✦, ◆) positioned absolutely
   - Border treatment with double-line effect

**CSS Approach:**
- Use `::first-letter` pseudo-element where possible for automatic application
- Float mechanism for text wrapping
- Pure CSS borders/box-shadow for ornamental effects
- No images - unicode ornamental characters + CSS transforms

**Responsive Behavior:**
- Desktop: 3-4 line height (~60-80px)
- Tablet: 3 line height (~48px)
- Mobile: 2 line height (~36px) or disable ornate variant

---

### 2. **OrnamentalDivider Component** - Section Breaks

**Purpose**: Visual separation between Codex sections with fantasy aesthetic

**Implementation Strategy**: CSS-only with SVG inline or unicode + CSS tricks

**Component Structure:**
```typescript
// src/components/typography/OrnamentalDivider.tsx
interface OrnamentalDividerProps {
  variant?: 'simple' | 'flourish' | 'symbols' | 'double-line'
  spacing?: 'tight' | 'normal' | 'loose'
  className?: string
}
```

**Variant Breakdown:**

1. **Simple** - Enhanced horizontal rule
   - Gradient from transparent → gold → transparent
   - 1px height with box-shadow for depth
   - Centered small ornament (✦ or ◆) overlaid

2. **Flourish** - Curved decorative line
   - CSS border-radius + pseudo-elements to create curves
   - Central medallion with unicode symbol
   - Symmetrical left/right flourishes

3. **Symbols** - Three ornamental characters
   - Three unicode symbols (e.g., ❧ ✦ ❧) spaced with flex
   - Gold color with slight text-shadow
   - Subtle scaling on center symbol

4. **Double-line** - Two parallel lines with break
   - Two horizontal rules with gap in center
   - Small text or symbol in gap (e.g., "⟡" or section number)
   - Parchment-dark lines instead of gold

**CSS Approach:**
- Flexbox for alignment and spacing
- Pseudo-elements (::before, ::after) for line extensions
- CSS gradients for fade effects
- Unicode ornamental dingbats (U+2766 through U+2767 range)

**Performance**: Zero images, all CSS + unicode

---

### 3. **Marginalia Component** - Pull Quotes with Handwritten Feel

**Purpose**: Offset quotes, lore snippets, or GM notes in the margin with handwritten aesthetic

**Implementation Strategy**: CSS positioning with optional pseudo-handwriting font

**Component Structure:**
```typescript
// src/components/typography/Marginalia.tsx
interface MarginaliaProps {
  children: React.ReactNode
  side?: 'left' | 'right'
  variant?: 'quote' | 'note' | 'annotation'
  marker?: string // Optional reference marker (e.g., "*", "†")
  className?: string
}
```

**Variant Breakdown:**

1. **Quote** - Pull quote style
   - Italic Inter font (no custom handwriting font - performance)
   - Slightly rotated (-1 to 2 degrees)
   - Gold opening quotation mark
   - Ink-muted text color

2. **Note** - GM/authorial aside
   - Smaller font size (0.85rem)
   - Bracketed with ornamental corners
   - Slightly rotated
   - Background: parchment-light with subtle border

3. **Annotation** - Reference marker style
   - Inline superscript marker in main text
   - Margin content connected with dashed line (CSS)
   - Very small font (0.75rem)
   - Less rotation, more compact

**Layout Strategy:**
- **Desktop (≥1024px)**: Absolute positioning outside main content column
  - Main content max-width: ~70ch
  - Marginalia positioned in side gutters (left/right)
  - Use CSS Grid or positioned container

- **Tablet (768-1023px)**: Floated within content
  - Float left/right with generous margin
  - Reduced width (30-40%)

- **Mobile (<768px)**: Inline callout
  - No positioning, flows with content
  - Bordered box with indentation
  - No rotation

**CSS Approach:**
- CSS `transform: rotate()` for handwritten feel
- `position: absolute` within relatively-positioned container
- Pseudo-elements for connecting lines/markers
- Responsive breakpoints with different layout strategies

**Performance Consideration**: No custom fonts beyond existing Cinzel/Inter to avoid FOUT

---

## Integration with Existing Theme

### Color Palette Usage

- **Primary Text**: `var(--ink)` - #2c2416
- **Secondary Text**: `var(--ink-muted)` - #5c5346
- **Accent/Ornaments**: `var(--gold)` - #c9a227
- **Backgrounds**: `var(--parchment-light)` - #faf8f3, `var(--parchment-dark)` - #e8e0d0
- **Borders**: `var(--border)` - #d4c5a9

### Typography Usage

- **Drop Caps**: Cinzel 600 (matches headers)
- **Body Content**: Inter 400 (existing body font)
- **Marginalia**: Inter italic 400
- **Ornaments**: System fallback for unicode symbols

### Existing Utilities to Leverage

- `.parchment-texture` - For illuminated drop cap backgrounds
- `.font-display` - Cinzel font application
- `.text-ink`, `.text-ink-muted`, `.bg-parchment-*` - Color utilities

---

## File Structure

```
src/
├── components/
│   └── typography/
│       ├── DropCap.tsx          # Drop cap component
│       ├── OrnamentalDivider.tsx # Section divider component
│       ├── Marginalia.tsx        # Margin notes component
│       └── index.ts              # Barrel export
├── app/
│   └── codex/
│       ├── page.tsx              # Codex main page (NEW)
│       ├── [entry]/
│       │   └── page.tsx          # Individual entry page (NEW)
│       └── layout.tsx            # Codex-specific layout (NEW)
```

---

## CVA Pattern Examples

### DropCap Variants

```typescript
const dropCapVariants = cva(
  // Base styles
  "float-left font-display font-semibold leading-none select-none",
  {
    variants: {
      variant: {
        simple: "text-[var(--gold)] text-6xl mr-2 mt-1",
        illuminated: "text-[var(--ink)] bg-[var(--parchment-dark)] border border-[var(--gold)] text-6xl mr-3 mt-1 px-2 py-1 parchment-texture",
        ornate: "relative text-[var(--gold)] text-7xl mr-4 mt-1 before:content-['✦'] before:absolute before:top-0 before:right-0 before:text-xs before:text-[var(--gold-muted)]"
      }
    },
    defaultVariants: {
      variant: "simple"
    }
  }
)
```

### OrnamentalDivider Variants

```typescript
const dividerVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        simple: "relative h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent",
        flourish: "gap-4 text-[var(--gold)] text-xl",
        symbols: "gap-6 text-[var(--gold)] text-2xl",
        "double-line": "flex-col gap-2"
      },
      spacing: {
        tight: "my-4",
        normal: "my-8",
        loose: "my-12"
      }
    },
    defaultVariants: {
      variant: "simple",
      spacing: "normal"
    }
  }
)
```

### Marginalia Variants

```typescript
const marginaliaVariants = cva(
  "relative italic text-[var(--ink-muted)] transition-transform",
  {
    variants: {
      variant: {
        quote: "text-sm before:content-['"'] before:text-[var(--gold)] before:text-2xl before:font-display",
        note: "text-xs bg-[var(--parchment-light)] border border-[var(--border)] rounded px-3 py-2",
        annotation: "text-xs"
      },
      side: {
        left: "lg:-ml-48 lg:float-left lg:mr-6 lg:rotate-[-1deg]",
        right: "lg:-mr-48 lg:float-right lg:ml-6 lg:rotate-[1deg]"
      }
    },
    defaultVariants: {
      variant: "quote",
      side: "right"
    }
  }
)
```

---

## Responsive Strategy

### Desktop (≥1024px)
- Full marginalia positioning in gutters
- Largest drop caps (3-4 line height)
- All divider ornamentations visible
- Content max-width: ~70ch with side margins for marginalia

### Tablet (768-1023px)
- Marginalia floated within content area (30-40% width)
- Medium drop caps (3 line height)
- Simplified divider variants (remove complex pseudo-elements)
- Content width: 85% of viewport

### Mobile (<768px)
- Marginalia as inline callout boxes
- Smaller drop caps (2 line height) or removed on very small screens
- Simplest divider variants only
- Full-width content with padding

### Implementation:
- Use Tailwind responsive prefixes (`lg:`, `md:`, `sm:`)
- CSS `@media` queries for complex positioning
- Consider `@container` queries for Codex article containers (future enhancement)

---

## Performance Optimization

### CSS-Only Philosophy
- **Zero JavaScript** for visual rendering
- **Zero images** - all ornaments via unicode + CSS
- **No custom fonts** beyond existing Cinzel/Inter
- **No animation** - static decorative elements (or minimal CSS transitions)

### Bundle Size Impact
- **DropCap**: ~0.5KB
- **OrnamentalDivider**: ~0.3KB
- **Marginalia**: ~0.7KB
- **Total**: ~1.5KB uncompressed TypeScript/CSS

### Loading Strategy
- Components are client-side only if needed for interactivity
- Most can be server-rendered (no hydration needed)
- No dynamic imports required (small bundle size)

---

## Usage Examples

### In Codex Entry Page

```tsx
// app/codex/[entry]/page.tsx
import { DropCap, OrnamentalDivider, Marginalia } from '@/components/typography'

export default function CodexEntry({ content }) {
  return (
    <article className="max-w-prose mx-auto px-6 py-12">
      {/* Major section heading with drop cap */}
      <div className="mb-8">
        <DropCap variant="illuminated">T</DropCap>
        <p className="font-display text-2xl">
          he Kingdom of Valdris stands as a beacon...
        </p>
      </div>

      {/* Body content with marginalia */}
      <div className="relative">
        <p>
          Founded in the Third Age by King Aldric the Wise, 
          Valdris has endured countless sieges...
        </p>
        
        <Marginalia variant="quote" side="right">
          "No walls can hold what the people will not defend."
          — King Aldric
        </Marginalia>

        <p>The city's golden spires can be seen...</p>
      </div>

      {/* Section break */}
      <OrnamentalDivider variant="flourish" spacing="loose" />

      {/* Next section */}
      <div>
        <DropCap variant="simple">V</DropCap>
        <p>aldris today is a sprawling metropolis...</p>
      </div>
    </article>
  )
}
```

### Auto-applying Drop Caps

```tsx
// For automatic first-letter treatment without component
<p className="first-letter:float-left first-letter:text-6xl first-letter:font-display first-letter:text-[var(--gold)] first-letter:mr-2 first-letter:mt-1">
  The ancient ruins whisper secrets...
</p>
```

---

## Unicode Ornament Library

Recommended unicode characters for zero-asset decorations:

**Flourishes & Ornaments:**
- ❧ (U+2767) - Rotated floral heart bullet
- ✦ (U+2726) - Black four pointed star
- ✧ (U+2727) - White four pointed star
- ◆ (U+25C6) - Black diamond
- ◇ (U+25C7) - White diamond
- ⟡ (U+27E1) - White concave-sided diamond
- ❖ (U+2756) - Black diamond minus white X

**Quotation Marks:**
- " (U+201C/201D) - Left/right double quotation
- ' (U+2018/2019) - Left/right single quotation
- « » (U+00AB/00BB) - Guillemets

**Borders & Lines:**
- ═ (U+2550) - Double horizontal line
- ─ (U+2500) - Single horizontal line
- ┄ ┅ ┆ ┇ (U+2504-2507) - Dashed/dotted lines

---

## Development Sequence

### Phase 1: Core Components (2-3 hours)
1. Create `DropCap.tsx` with all three variants
2. Create `OrnamentalDivider.tsx` with all four variants
3. Create barrel export in `index.ts`
4. Add utility classes to `globals.css` if needed

### Phase 2: Marginalia (2-3 hours)
5. Create `Marginalia.tsx` with responsive positioning
6. Test layout in various viewport sizes
7. Add connecting line pseudo-elements for annotations

### Phase 3: Codex Integration (3-4 hours)
8. Create `/codex/page.tsx` route
9. Build sample entry page with all typography components
10. Test responsive behavior
11. Ensure performance (no layout shifts, smooth rendering)

### Phase 4: Polish (1-2 hours)
12. Fine-tune rotations and spacing
13. Add dark mode support (if needed)
14. Create documentation/usage examples

**Total Estimated Time**: 8-12 hours of focused development

---

## Testing Strategy

### Visual Regression
- Screenshot comparisons at 320px, 768px, 1024px, 1440px widths
- Test all variant combinations
- Verify text wrapping around drop caps
- Check marginalia positioning

### Accessibility
- Ensure drop caps don't break screen readers (use aria-hidden on decorative elements)
- Verify keyboard navigation doesn't get confused by absolute positioning
- Check color contrast ratios (WCAG AA minimum)

### Performance
- Lighthouse score should remain 95+ (no impact from CSS-only components)
- No layout shift (CLS = 0)
- Test with 50+ marginalia on single page (edge case)

---

## Future Enhancements (Not MVP)

- **Animated flourishes**: Subtle CSS animations on scroll-into-view
- **Contextual variants**: Different ornaments per Codex category (e.g., dragons for Bestiary, stars for Cosmology)
- **Interactive marginalia**: Click to expand/collapse longer notes
- **Print stylesheet**: Optimized typography for PDF export
- **Custom ornament SVG sprites**: Higher quality than unicode if needed later
- **Handwriting font**: Google Font like "Caveat" or "Kalam" for marginalia (if bundle size acceptable)

---

## Critical Files for Implementation

- **src/components/typography/DropCap.tsx** - Core drop cap component with CVA variants for illuminated letters
- **src/components/typography/OrnamentalDivider.tsx** - Section divider with multiple decorative patterns using CSS + unicode
- **src/components/typography/Marginalia.tsx** - Responsive margin quote system with rotation and positioning logic
- **src/app/globals.css** - Add typography utility classes and responsive container queries for marginalia layout
- **src/app/codex/page.tsx** - Main Codex page to showcase typography components in context with sample content