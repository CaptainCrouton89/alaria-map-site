Perfect! Now I have a comprehensive understanding of the codebase. Let me create the implementation plan.

---

# Implementation Plan: Progressive Revelation & Ambient Atmosphere for Heart Rush Map Codex

## 1. Understanding the Current State

### Existing Architecture
- **Next.js 16** with App Router, TypeScript strict mode
- **Tailwind v4** with custom parchment theme (cream/aged paper aesthetic)
- **tw-animate-css** library already installed for animations
- **Map + Codex dual view**: Currently toggled via `activeTab` state in `page.tsx`
- **Sidebar pattern**: 380px left sidebar for location details (already has `ScrollArea` component)
- **Color palette**: 
  - Base: `--parchment` (#f5f0e6), `--parchment-dark` (#e8e0d0), `--parchment-light` (#faf8f3)
  - Accents: `--gold` (#c9a227), `--ink` (#2c2416)
  - Location type colors: 11 muted jewel tones defined in `LOCATION_STYLES`
- **Content structure**: 
  - Lore entries with `tags[]` for categorization
  - 6 codex categories: Atlas, Nations, Cosmology, History, Magic, Bestiary
  - Tag taxonomy includes qualifiers: `sacred`, `cursed`, `ancient`, `dangerous`, `trade`, etc.

### Key Files Identified
- `src/app/page.tsx` - Main page with Map/Codex toggle (currently empty codex view)
- `src/app/globals.css` - Parchment theme with CSS variables, includes tw-animate-css
- `src/types/location.ts` - Location types and color definitions
- `src/types/pinning.ts` - LoreEntry interface with tags
- `src/components/ui/scroll-area.tsx` - Radix ScrollArea wrapper
- `src/lib/utils.ts` - Utility functions (cn for className merging)

---

## 2. Design Approach

### Progressive Revelation Strategy

**Visual Metaphor**: "Unrolling a scroll" - content reveals progressively as you read, creating a sense of discovery.

**Implementation Approach**:
1. **CSS-first with Intersection Observer enhancement**
   - Avoids layout thrash
   - Performant with modern browser APIs
   - Graceful degradation without JS
   
2. **Entry-level revelation** (not paragraph-level):
   - Each codex entry (H2 section) is a revelation unit
   - First 3-4 lines visible initially (preview state)
   - Remainder hidden behind gradient fade
   - Click/scroll triggers expansion with smooth animation
   
3. **Animation approach**:
   - Use `tw-animate-css` for entrance animations
   - Custom CSS for height transitions and gradient overlays
   - Intersection Observer to trigger reveals as entries scroll into view
   - State management: track expanded/collapsed per entry ID

**Why this approach**:
- Maintains reading flow (can expand and continue without jarring jumps)
- Encourages exploration without overwhelming with text walls
- Scroll-based revelation feels natural for discovery
- Performance: Only animate what's in viewport

---

### Ambient Atmosphere Strategy

**Visual Metaphor**: "Subtle environmental shifts" - like walking from a sunny market square into a shadowy temple.

**Implementation Approach**:
1. **Tag-based atmosphere mapping**:
   ```typescript
   const ATMOSPHERE_STYLES = {
     // Civilization (warm, welcoming)
     civilization: { bg: '--parchment', tint: 'rgba(201, 162, 39, 0.03)' }, // gold tint
     
     // Sacred (ethereal purple glow)
     sacred: { bg: '--parchment-light', tint: 'rgba(107, 74, 140, 0.04)' }, // temple purple
     
     // Cursed (eerie purple-grey)
     cursed: { bg: '--parchment-dark', tint: 'rgba(75, 58, 92, 0.06)' }, // dark purple
     
     // Ancient/ruins (faded, cool grey)
     ancient: { bg: '--parchment-dark', tint: 'rgba(122, 122, 122, 0.04)' }, // ruins grey
     
     // Dangerous (subtle red undertone)
     dangerous: { bg: '--parchment', tint: 'rgba(139, 58, 58, 0.03)' }, // dungeon red
     
     // Trade/port (bright, open)
     trade: { bg: '--parchment-light', tint: 'rgba(184, 149, 107, 0.02)' }, // warm tan
     
     // Natural/wilderness (green undertone)
     nature: { bg: '--parchment', tint: 'rgba(74, 124, 89, 0.03)' }, // forest green
     
     // Water (cool blue tint)
     water: { bg: '--parchment-light', tint: 'rgba(74, 140, 156, 0.03)' }, // ocean blue
     
     // Default fallback
     default: { bg: '--parchment', tint: 'rgba(0, 0, 0, 0)' },
   };
   ```

2. **Tag priority system**:
   - Multiple tags → prioritized mapping (e.g., `cursed` overrides `ancient`)
   - Priority order: `cursed` > `sacred` > `dangerous` > `ancient` > `trade` > `nature` > `water`
   - Location type fallback: Use `LOCATION_STYLES` colors as subtle tint

3. **Texture variations**:
   - Add `.parchment-texture` class intensity variations
   - Sacred: Smoother texture (less grain opacity)
   - Cursed: More pronounced grain
   - Ancient: Faded/weathered texture overlay
   - Use CSS filters for subtle effects

4. **Transition approach**:
   - Smooth CSS transitions on background/tint changes (500-800ms)
   - Apply to entry container backgrounds
   - Use `transform: translateZ(0)` for GPU acceleration
   - Avoid animating expensive properties

**Why this approach**:
- **Subtle**: Tints are 2-6% opacity - barely noticeable but emotionally resonant
- **Performance**: CSS-only, no JS overhead, hardware accelerated
- **Scalable**: Tag-based system works with existing content structure
- **Accessible**: Doesn't interfere with readability
- **Immersive**: Reinforces thematic content without being distracting

---

## 3. Implementation Steps

### Phase 1: Foundation & Type Setup

**Create new types for codex system** (`src/types/codex.ts`):
```typescript
export interface CodexEntry {
  id: string;
  name: string;
  category: string;
  section: string;
  tags: string[];
  content: string;
  mapLocationId?: string;
}

export type AtmosphereType = 
  | 'civilization' | 'sacred' | 'cursed' | 'ancient' 
  | 'dangerous' | 'trade' | 'nature' | 'water' | 'default';

export interface AtmosphereStyle {
  bg: string;
  tint: string;
  textureIntensity?: number;
}
```

**Create atmosphere mapping utility** (`src/lib/atmosphere.ts`):
- `determineAtmosphere(tags: string[]): AtmosphereType` - Priority-based tag analysis
- `getAtmosphereStyle(type: AtmosphereType): AtmosphereStyle` - Returns CSS variables
- `getAtmosphereClasses(type: AtmosphereType): string` - Returns Tailwind classes

### Phase 2: CSS Animations & Utilities

**Extend `globals.css`** with:
1. **Atmosphere CSS variables**:
   ```css
   /* Atmosphere tints */
   --atmos-civilization: rgba(201, 162, 39, 0.03);
   --atmos-sacred: rgba(107, 74, 140, 0.04);
   --atmos-cursed: rgba(75, 58, 92, 0.06);
   /* ... etc */
   ```

2. **Revelation animations**:
   ```css
   @keyframes unfurl {
     from { 
       max-height: 0; 
       opacity: 0; 
       transform: translateY(-8px);
     }
     to { 
       max-height: var(--max-height); 
       opacity: 1; 
       transform: translateY(0);
     }
   }
   
   .reveal-collapsed {
     max-height: 6rem; /* ~3-4 lines */
     overflow: hidden;
     position: relative;
   }
   
   .reveal-gradient::after {
     content: '';
     position: absolute;
     bottom: 0;
     left: 0;
     right: 0;
     height: 3rem;
     background: linear-gradient(transparent, var(--parchment));
     pointer-events: none;
   }
   
   .reveal-expanded {
     animation: unfurl 0.4s cubic-bezier(0.4, 0, 0.2, 1);
   }
   ```

3. **Atmosphere transition utilities**:
   ```css
   .atmosphere-transition {
     transition: background-color 600ms ease, 
                 box-shadow 600ms ease;
     will-change: background-color;
   }
   
   .atmosphere-sacred {
     background: linear-gradient(
       var(--parchment-light), 
       color-mix(in srgb, var(--parchment-light) 96%, #6b4a8c)
     );
   }
   /* ... similar for other atmosphere types */
   ```

4. **Texture intensity variations**:
   ```css
   .texture-subtle { 
     background-image: url(...); 
     opacity: 0.02; 
   }
   .texture-normal { opacity: 0.03; }
   .texture-heavy { opacity: 0.05; }
   ```

### Phase 3: Codex Entry Component

**Create `src/components/CodexEntry.tsx`**:
```typescript
interface CodexEntryProps {
  entry: CodexEntry;
  defaultExpanded?: boolean;
}

export function CodexEntry({ entry, defaultExpanded = false }: CodexEntryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isInView, setIsInView] = useState(false);
  const entryRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for scroll-triggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );
    
    if (entryRef.current) observer.observe(entryRef.current);
    return () => observer.disconnect();
  }, []);
  
  const atmosphere = determineAtmosphere(entry.tags);
  const atmosphereClasses = getAtmosphereClasses(atmosphere);
  
  return (
    <div
      ref={entryRef}
      className={cn(
        "codex-entry rounded-lg p-6 mb-4",
        "atmosphere-transition",
        atmosphereClasses,
        isInView && "animate-fade-in-up" // tw-animate-css
      )}
    >
      {/* Entry header with icon/tags */}
      <div className="entry-header">
        <h2>{entry.name}</h2>
        <TagList tags={entry.tags} />
      </div>
      
      {/* Content with revelation */}
      <div
        className={cn(
          "entry-content",
          !isExpanded && "reveal-collapsed reveal-gradient"
        )}
      >
        <MarkdownContent>{entry.content}</MarkdownContent>
      </div>
      
      {/* Expand/collapse button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="text-sm text-ink-muted hover:text-ink mt-2"
        >
          Continue reading... ↓
        </button>
      )}
    </div>
  );
}
```

### Phase 4: Codex View Page

**Create `src/app/codex/page.tsx`** (or modify main page):
```typescript
export default function CodexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [entries, setEntries] = useState<CodexEntry[]>([]);
  
  // Load entries from compiled JSON or API
  useEffect(() => {
    // Fetch codex entries
  }, [selectedCategory]);
  
  return (
    <div className="codex-view min-h-screen bg-parchment">
      {/* Category navigation */}
      <CodexNav 
        categories={CATEGORIES} 
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />
      
      {/* Entry list with scroll container */}
      <ScrollArea className="codex-content max-w-4xl mx-auto px-6 py-8">
        {entries.map(entry => (
          <CodexEntry key={entry.id} entry={entry} />
        ))}
      </ScrollArea>
    </div>
  );
}
```

### Phase 5: Integration with Map View

**Modify `src/app/page.tsx`**:
- Import `CodexPage` component
- Conditionally render based on `activeTab` state:
  ```tsx
  {activeTab === 'map' ? (
    <InteractiveMap ... />
  ) : (
    <CodexPage />
  )}
  ```
- Pass selected location context to codex view (for filtering/highlighting)
- Add "View on Map" button in codex entries that have `mapLocationId`

### Phase 6: Performance Optimization

1. **Virtualization** (if needed):
   - Use `react-virtual` for long entry lists
   - Only render entries in/near viewport
   
2. **Lazy loading**:
   - Split codex entries into category bundles
   - Load on-demand when category selected
   
3. **Memoization**:
   - Memoize atmosphere calculations
   - Cache expanded state in localStorage
   
4. **CSS optimization**:
   - Use `contain: layout paint` on entry containers
   - Minimize repaints with `transform` vs `margin/padding`
   - Use `content-visibility: auto` for off-screen entries

### Phase 7: Polish & Accessibility

1. **Keyboard navigation**:
   - Space/Enter to expand entries
   - Arrow keys to navigate between entries
   
2. **Focus management**:
   - Proper focus indicators on interactive elements
   - Focus trap in expanded entries if needed
   
3. **Reduced motion**:
   ```css
   @media (prefers-reduced-motion: reduce) {
     .reveal-expanded { animation: none; }
     .atmosphere-transition { transition: none; }
   }
   ```
   
4. **Screen reader support**:
   - ARIA labels for expand buttons
   - Live regions for atmosphere changes
   
5. **Loading states**:
   - Skeleton screens for entry loading
   - Smooth transitions between categories

---

## 4. Technical Considerations

### Performance Budget
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Frame rate**: Maintain 60fps during scrolling
- **Memory**: < 50MB for full codex view

### Browser Compatibility
- Chrome 90+, Firefox 88+, Safari 15+ (modern Intersection Observer, CSS color-mix)
- Fallback for older browsers: No atmosphere effects, immediate content reveal

### Testing Strategy
1. **Unit tests**: Atmosphere determination logic
2. **Visual regression**: Screenshot comparisons for atmosphere styles
3. **Performance**: Lighthouse CI, measure scroll jank
4. **Accessibility**: Automated WAVE/axe testing + manual screen reader testing

### Edge Cases
- **Very long entries**: Cap max-height, add "Show more" pagination within entry
- **No tags**: Use `default` atmosphere
- **Conflicting tags**: Priority system handles this
- **Rapid category switching**: Debounce/cancel pending loads

---

## 5. Alternative Approaches Considered

### Progressive Revelation Alternatives
1. **Paragraph-by-paragraph reveal**: Too granular, interrupts reading flow
2. **Fade-in only (no height animation)**: Less dramatic, misses "unfurling" metaphor
3. **Click-to-reveal sections**: More manual, less discovery-oriented
4. **Automatic scroll-reveal only**: No manual control, potentially jarring

**Why entry-level with hybrid approach is best**: Balances control with automation, maintains reading flow, clear visual metaphor.

### Ambient Atmosphere Alternatives
1. **Full background image swaps**: Too heavy, distracting, expensive
2. **Border color changes only**: Too subtle, doesn't create "atmosphere"
3. **Animated gradients**: Performance concerns, visually noisy
4. **Icon/decoration changes**: Doesn't affect mood as effectively

**Why subtle tint overlays are best**: Imperceptible yet emotionally resonant, performant, scalable.

---

## 6. Future Enhancements

1. **Sound design**: Subtle ambient audio per atmosphere type (opt-in)
2. **Particle effects**: Very subtle floating particles for sacred/cursed (WebGL)
3. **Reading progress tracking**: Bookmark system, resume where you left off
4. **Cross-reference visualization**: Graph view of tag relationships
5. **Search integration**: Filter by tags, full-text search with highlights
6. **User annotations**: Personal notes on entries (localStorage)
7. **Dynamic atmosphere**: Shift based on time of day or weather API

---

### Critical Files for Implementation

1. **`src/app/page.tsx`** - Main integration point: Add conditional rendering for Map vs Codex view, manage activeTab state, pass context between views

2. **`src/app/globals.css`** - Core styling: Add atmosphere CSS variables, revelation animations, texture utilities, transition definitions, and ensure performance optimizations

3. **`src/components/CodexEntry.tsx`** - New component: Heart of progressive revelation system, Intersection Observer logic, atmosphere application, expand/collapse state management

4. **`src/lib/atmosphere.ts`** - New utility: Tag analysis logic, atmosphere type determination with priority system, style/class generation functions, memoization for performance

5. **`src/types/codex.ts`** - New types: CodexEntry interface, AtmosphereType enum, AtmosphereStyle interface, type guards and validators