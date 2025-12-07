Perfect! Now I have a comprehensive understanding of the codebase. Let me create a detailed implementation plan.

---

# Implementation Plan: ENTRY WEIGHT & BREADCRUMB AS JOURNEY

## Overview

This plan addresses two key features for the Heart Rush map Codex:

1. **ENTRY WEIGHT**: Visual hierarchy system that gives major lore entries (gods, capitals, dragons) grander treatment while minor entries feel like footnotes
2. **BREADCRUMB AS JOURNEY**: Narrative breadcrumb navigation that transforms technical paths into immersive, exploration-themed prose

## Current Architecture Analysis

### Existing Components
- **Map View** (`src/app/page.tsx`): Leaflet-based interactive map with sidebar
- **Location Types** (`src/types/location.ts`): 12 location types with styling
- **Lore Structure** (`src/types/pinning.ts`): Entry metadata with tags and hierarchy
- **UI Components**: shadcn/ui with parchment theme (Button, Separator, ScrollArea)
- **Design System**: Cinzel (display) + Inter (body), parchment color palette, gold accents

### Content Structure
- 1,648 markdown files in `world-wikis/alaria/`
- Categories: Atlas, Nations & Powers, Cosmology, History & Lore, Magic, Bestiary
- Entry sizes vary dramatically: 5 lines (Loyera deity) to 14,000 lines (States.md)
- Tags in frontmatter: `state`, `god`, `dragon`, `faction`, `creature`, etc.

---

## Feature 1: ENTRY WEIGHT System

### Design Philosophy

Visual hierarchy without explicit labels. A god entry should *feel* important through presentation, not by saying "THIS IS IMPORTANT."

### Weight Determination Strategy

**Option A: Tag-Based (RECOMMENDED)**

Use existing tag taxonomy to infer entry weight:

```typescript
type EntryWeight = 'legendary' | 'major' | 'standard' | 'minor' | 'footnote';

function calculateEntryWeight(entry: CodexEntry): EntryWeight {
  const { tags, content } = entry;
  
  // Legendary: gods, dragons, major planes, world-shaping events
  if (tags.includes('god') || tags.includes('dragon')) return 'legendary';
  
  // Major: capitals, major states, significant NPCs, major factions
  if (tags.some(t => ['capital', 'state', 'daemon'].includes(t))) return 'major';
  
  // Standard: cities, factions, POIs, regions
  if (tags.some(t => ['city', 'faction', 'poi', 'region'].includes(t))) return 'standard';
  
  // Minor: creatures, items, small settlements
  if (tags.some(t => ['creature', 'item', 'settlement'].includes(t))) return 'minor';
  
  // Footnote: very brief entries (< 10 lines), references
  if (content.split('\n').length < 10) return 'footnote';
  
  return 'standard';
}
```

**Option B: Explicit Frontmatter Field**

Add `weight: legendary` to markdown frontmatter for manual control. More flexible but requires content updates.

**Recommendation**: Start with tag-based (A), add manual override field later if needed.

### Visual Treatment Mapping

#### Legendary (gods, dragons, first dragons, major planes)

```tsx
<article className="legendary-entry">
  {/* Ornate header with decorative elements */}
  <header className="relative py-8 px-6 border-y-2 border-gold/40">
    {/* Decorative corner flourishes */}
    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/30" />
    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold/30" />
    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold/30" />
    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/30" />
    
    {/* Sigil/icon - large and centered */}
    <div className="flex justify-center mb-4">
      <span className="text-6xl" role="img">{icon}</span>
    </div>
    
    {/* Title - very large, ornate */}
    <h1 className="font-display text-5xl text-center text-ink mb-3 tracking-wide">
      {entry.name}
    </h1>
    
    {/* Subtitle with tags */}
    <div className="flex justify-center gap-2 text-sm text-ink-muted">
      {tags.map(tag => (
        <span className="px-3 py-1 bg-gold/10 rounded border border-gold/30">{tag}</span>
      ))}
    </div>
  </header>
  
  {/* Content with generous spacing */}
  <div className="prose prose-lg max-w-none px-8 py-8 leading-relaxed">
    {content}
  </div>
</article>
```

Visual: Large ornate borders, decorative corners, centered layout, 5xl heading, gold accents, spacious padding.

#### Major (capitals, states, major factions)

```tsx
<article className="major-entry">
  <header className="py-6 px-6 border-b-2 border-parchment-dark">
    <div className="flex items-center gap-4">
      <span className="text-4xl" role="img">{icon}</span>
      <div>
        <h1 className="font-display text-3xl text-ink">{entry.name}</h1>
        <div className="flex gap-2 text-xs text-ink-muted mt-1">
          {tags.map(tag => <span className="px-2 py-0.5 bg-parchment-dark rounded">{tag}</span>)}
        </div>
      </div>
    </div>
  </header>
  
  <div className="prose px-6 py-6">
    {content}
  </div>
</article>
```

Visual: 3xl heading, prominent icon, clear separation, standard prose.

#### Standard (cities, factions, POIs)

```tsx
<article className="standard-entry">
  <header className="py-4 px-6 border-b border-border">
    <div className="flex items-center gap-3">
      <span className="text-2xl" role="img">{icon}</span>
      <h2 className="font-display text-2xl text-ink">{entry.name}</h2>
    </div>
  </header>
  
  <div className="prose px-6 py-4">
    {content}
  </div>
</article>
```

Visual: 2xl heading, inline icon, minimal decoration.

#### Minor (creatures, items, small settlements)

```tsx
<article className="minor-entry">
  <header className="py-3 px-6">
    <h3 className="font-display text-xl text-ink inline">
      <span className="text-lg mr-2">{icon}</span>
      {entry.name}
    </h3>
  </header>
  
  <div className="prose prose-sm px-6 py-2">
    {content}
  </div>
</article>
```

Visual: xl heading, smaller text, compact spacing.

#### Footnote (brief references, < 10 lines)

```tsx
<article className="footnote-entry">
  <div className="py-2 px-6 text-sm">
    <h4 className="font-display text-base text-ink inline mr-2">{entry.name}</h4>
    <span className="text-ink-muted">{content}</span>
  </div>
</article>
```

Visual: Inline layout, small text, minimal spacing, feels like marginal note.

### Component Structure

```typescript
// src/components/CodexEntry.tsx
interface CodexEntryProps {
  entry: CodexEntry;
  weight: EntryWeight;
}

export function CodexEntry({ entry, weight }: CodexEntryProps) {
  switch (weight) {
    case 'legendary':
      return <LegendaryEntry entry={entry} />;
    case 'major':
      return <MajorEntry entry={entry} />;
    case 'standard':
      return <StandardEntry entry={entry} />;
    case 'minor':
      return <MinorEntry entry={entry} />;
    case 'footnote':
      return <FootnoteEntry entry={entry} />;
  }
}
```

```typescript
// src/lib/entry-weight.ts
export function calculateEntryWeight(entry: CodexEntry): EntryWeight {
  // Implementation as described above
}

export function getEntryIcon(entry: CodexEntry): string {
  // Map primary tag to icon
}
```

### Accessibility Considerations

- Semantic HTML: `<article>`, `<header>`, `<h1>`-`<h4>` hierarchy
- ARIA labels for decorative elements: `role="presentation"`
- Maintain logical heading order across all weight levels
- Ensure color contrast ratios meet WCAA AAA (ink on parchment already compliant)

---

## Feature 2: BREADCRUMB AS JOURNEY

### Design Philosophy

Transform technical breadcrumbs into narrative prose that enhances immersion. Instead of:
```
Codex > Nations & Powers > States > Adron
```

Show:
```
You are reading about Adron, a nation in Ve, in the annals of Nations & Powers
```

### Narrative Construction Strategy

**Template System**: Context-aware prose based on entry type and hierarchy.

```typescript
interface BreadcrumbJourneyProps {
  entry: CodexEntry;
  category: Category;
  section: Section;
  parentLocation?: Location; // Geographic parent if applicable
}

function generateJourneyText(props: BreadcrumbJourneyProps): string {
  const { entry, category, section, parentLocation } = props;
  
  const templates = {
    location: (entry, parent, category) => 
      `You are reading about ${entry.name}${parent ? `, a place in ${parent.name},` : ''} in the ${category.name}`,
    
    state: (entry, parent, category) =>
      `You are reading about ${entry.name}, a nation${parent ? ` in ${parent.name}` : ''}, in the annals of ${category.name}`,
    
    god: (entry, category) =>
      `You are reading about ${entry.name}, a deity, in the ${category.name}`,
    
    dragon: (entry, category) =>
      `You are reading about ${entry.name}, a dragon, chronicled in the ${category.name}`,
    
    faction: (entry, category) =>
      `You are reading about ${entry.name}, an organization, in the ${category.name}`,
    
    npc: (entry, category) =>
      `You are reading about ${entry.name}, recorded in the ${category.name}`,
    
    artifact: (entry, category) =>
      `You are reading about ${entry.name}, an artifact, chronicled in the ${category.name}`,
    
    event: (entry, category) =>
      `You are reading about ${entry.name}, an event, recorded in the ${category.name}`,
    
    default: (entry, category) =>
      `You are reading about ${entry.name} in the ${category.name}`
  };
  
  // Select template based on primary tag
  const primaryTag = entry.tags[0];
  const template = templates[primaryTag] || templates.default;
  
  return template(entry, parentLocation, category);
}
```

### Clickable Navigation Within Prose

The narrative should still function as navigation:

```tsx
<nav className="codex-journey px-6 py-4 bg-parchment-dark border-b border-border">
  <p className="text-sm text-ink-muted font-body">
    You are reading about{' '}
    <span className="font-display text-ink font-semibold">{entry.name}</span>
    {parentLocation && (
      <>
        , a place in{' '}
        <Link href={`/codex/${parentLocation.id}`} className="underline hover:text-gold">
          {parentLocation.name}
        </Link>
      </>
    )}
    , in the{' '}
    <Link href={`/codex/category/${category.slug}`} className="underline hover:text-gold">
      {category.name}
    </Link>
  </p>
</nav>
```

### Component Structure

```typescript
// src/components/BreadcrumbJourney.tsx
interface BreadcrumbJourneyProps {
  entry: CodexEntry;
  category: Category;
  section: Section;
  parentLocation?: Location;
}

export function BreadcrumbJourney(props: BreadcrumbJourneyProps) {
  const journeyText = generateJourneyText(props);
  const links = extractNavigableLinks(props);
  
  return (
    <nav className="codex-journey px-6 py-4 bg-parchment-dark border-b border-border">
      <p className="text-sm text-ink-muted font-body">
        {renderJourneyWithLinks(journeyText, links)}
      </p>
    </nav>
  );
}
```

```typescript
// src/lib/breadcrumb-journey.ts
export function generateJourneyText(props: BreadcrumbJourneyProps): string {
  // Template logic as above
}

export function extractNavigableLinks(props: BreadcrumbJourneyProps): JourneyLink[] {
  // Extract clickable entities (parent location, category, section)
}

export function renderJourneyWithLinks(text: string, links: JourneyLink[]): ReactNode {
  // Inject Link components into prose
}
```

### Narrative Variations

**Variations by Category**:

- **Atlas of Alaria**: "exploring", "in the Atlas of Alaria"
- **Nations & Powers**: "in the annals of", "within the chronicles of"
- **Cosmology & Religion**: "in the cosmology of", "within the divine records"
- **History & Lore**: "recorded in", "chronicled in"
- **Magic & Knowledge**: "documented in", "in the arcane texts of"
- **Bestiary**: "catalogued in", "in the bestiary of Alaria"

**Variations by Depth**:

- Top-level: "You are exploring {category}"
- Section-level: "You are reading about {entry} in {section}, part of {category}"
- Deep nesting: "You are reading about {entry}, found in {parent}, within {section}, in {category}"

### Accessibility & Semantics

- Use semantic `<nav>` element
- Maintain `aria-current="page"` on active element
- Screen readers: "Navigation, you are reading about..."
- Links should be clearly distinguished (underline, hover color change)

---

## Implementation Steps

### Phase 1: Type Definitions & Utilities (2-3 hours)

1. **Extend Type System**
   - Add `EntryWeight` type to `src/types/location.ts`
   - Add `CodexEntry` interface (currently missing)
   - Add `Category`, `Section` interfaces for navigation

2. **Weight Calculation Logic**
   - Create `src/lib/entry-weight.ts`
   - Implement `calculateEntryWeight()` with tag-based rules
   - Implement `getEntryIcon()` for sigils
   - Write unit tests for weight calculation

3. **Journey Generation Logic**
   - Create `src/lib/breadcrumb-journey.ts`
   - Implement template system for narrative generation
   - Implement link extraction and rendering
   - Write unit tests for journey text generation

### Phase 2: Component Development (3-4 hours)

4. **Entry Components**
   - Create `src/components/codex/LegendaryEntry.tsx`
   - Create `src/components/codex/MajorEntry.tsx`
   - Create `src/components/codex/StandardEntry.tsx`
   - Create `src/components/codex/MinorEntry.tsx`
   - Create `src/components/codex/FootnoteEntry.tsx`
   - Create `src/components/codex/CodexEntry.tsx` (dispatcher)

5. **Breadcrumb Journey Component**
   - Create `src/components/BreadcrumbJourney.tsx`
   - Implement narrative rendering with links
   - Add hover states and transitions

### Phase 3: Styling & Polish (2-3 hours)

6. **CSS Utilities**
   - Add weight-specific utility classes to `globals.css`:
     ```css
     .legendary-entry { /* ornate borders, gold accents */ }
     .entry-corner-flourish { /* decorative SVG corners */ }
     .codex-journey { /* journey nav styling */ }
     ```

7. **Prose Customization**
   - Extend Tailwind prose plugin for weight-specific typography
   - Ensure line-height, spacing scales appropriately per weight

### Phase 4: Integration (2-3 hours)

8. **Codex Page Setup**
   - Create `src/app/codex/page.tsx` (category listing)
   - Create `src/app/codex/[entryId]/page.tsx` (entry detail)
   - Integrate `<BreadcrumbJourney />` at top of entry pages
   - Integrate `<CodexEntry />` for main content

9. **Content Loading**
   - Create `src/lib/codex-content.ts` for loading markdown entries
   - Parse frontmatter to extract tags
   - Build category/section hierarchy from `navigation-categories.json`

### Phase 5: Testing & Refinement (2-3 hours)

10. **Visual Testing**
    - Test all weight levels with real content (Loyera, Adron, Dragons)
    - Verify responsive behavior on mobile
    - Check dark mode compatibility (future-proofing)

11. **Navigation Testing**
    - Test breadcrumb journey links work correctly
    - Verify back navigation preserves context
    - Test with deep nesting scenarios

12. **Accessibility Audit**
    - Screen reader testing (VoiceOver, NVDA)
    - Keyboard navigation verification
    - Color contrast validation

---

## Technical Considerations

### Type Safety

All components should enforce strict types:

```typescript
interface CodexEntry {
  id: string;
  name: string;
  category: string;
  section: string;
  tags: string[];
  sourceFile: string;
  sourceHeader: string;
  content: string;
  relatedIds?: string[];
  mapLocationId?: string;
  parentLocationId?: string; // For geographic hierarchy
}

interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  sections: Section[];
}

interface Section {
  name: string;
  slug: string;
  entries: CodexEntry[];
}
```

### Performance

- **Static Generation**: Use Next.js 16 static generation for all codex pages
- **Incremental Static Regeneration**: Rebuild on content changes
- **Code Splitting**: Lazy-load weight-specific components if bundle size becomes issue

### Markdown Processing

Use existing patterns from main Heart Rush app:

```typescript
import matter from 'gray-matter';
import { marked } from 'marked';

export function parseCodexEntry(filepath: string): CodexEntry {
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  
  return {
    id: generateId(filepath),
    name: extractName(content),
    tags: data.tags?.split(', ') || [],
    category: determineCategoryFromPath(filepath),
    section: determineSectionFromPath(filepath),
    content: marked(content),
    // ...
  };
}
```

### Integration with Existing Button/Separator Components

- **Button**: Use existing `ghost`, `link`, `nav` variants for journey links
- **Separator**: Use between entry header and content for major/standard entries
- **ScrollArea**: Wrap long legendary entries to maintain fixed viewport

---

## Edge Cases & Considerations

### Ambiguous Weight

**Problem**: Entry has multiple tags at different weight levels (e.g., `capital, city, port`).

**Solution**: Use highest weight tag. Capital overrides city.

### Missing Parent Location

**Problem**: Journey narrative references parent location but none exists.

**Solution**: Omit parent clause gracefully:
```
You are reading about Rilyn in the annals of Nations & Powers
```

### Very Long Journey Paths

**Problem**: Deeply nested entries create verbose journey text.

**Solution**: Truncate to 2 levels:
```
You are reading about X in Y, within Z
```
Not:
```
You are reading about X in Y, in Z, in A, in B, in C
```

### Entries Without Tags

**Problem**: Legacy content missing tags.

**Solution**: Default to `standard` weight. Log warning for content audit.

### Conflicting Icons

**Problem**: Multiple tags suggest different icons (e.g., `city, fortress`).

**Solution**: Priority order: `god > dragon > capital > fortress > city > town > poi`.

---

## Visual Mockup (Pseudo-Code)

### Legendary Entry (God)

```
┌────────────────────────────────────────────────────────────┐
│ ┌──                                                    ──┐ │
│ │                                                        │ │
│ │                        ✨ (6xl)                        │ │
│ │                                                        │ │
│ │                       Loyera                          │ │
│ │               (Cinzel, 5xl, centered)                 │ │
│ │                                                        │ │
│ │            [god] [iqes] [truth] [honesty]            │ │
│ │            (tags: gold/10 bg, gold/30 border)        │ │
│ │                                                        │ │
│ └──                                                    ──┘ │
│════════════════════════════════════════════════════════════│
│                                                            │
│        Iqes goddess of truth and honesty                  │
│        (prose-lg, generous line-height)                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Standard Entry (Faction)

```
┌────────────────────────────────────────────────────────────┐
│ ⚔️ Elves of the Gray Order                                │
│ (2xl, inline icon)                                        │
├────────────────────────────────────────────────────────────┤
│ Worshippers of Hykravones. They believe his return is     │
│ needed to reset society...                                 │
└────────────────────────────────────────────────────────────┘
```

### Breadcrumb Journey

```
┌────────────────────────────────────────────────────────────┐
│ You are reading about Adron, a nation in Ve, in the      │
│ annals of Nations & Powers                                 │
│ (ink-muted, underlines on hover for "Ve", "Nations & Po..")│
└────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

### Qualitative
- **Immersion**: Users report feeling "in-world" when reading lore
- **Clarity**: Visual hierarchy immediately communicates entry importance
- **Navigation**: Journey breadcrumbs feel natural, not technical

### Quantitative
- **Performance**: All codex pages < 100ms LCP
- **Accessibility**: WCAG AAA compliance, no keyboard trap errors
- **Bundle Size**: < 5KB added per weight-specific component

---

## Future Enhancements

1. **Manual Weight Override**: Add `weight: legendary` to markdown frontmatter
2. **Dynamic Journey Variations**: Randomize flavor text for repeat visits
3. **Cross-References in Journey**: "Related to [Dragon Name], connected to [Location]"
4. **Animated Transitions**: Flourishes fade in on scroll for legendary entries
5. **Sigil Library**: Custom SVG sigils for major entities instead of emoji
6. **Contextual Iconography**: Different legendary borders for gods vs. dragons vs. planes

---

### Critical Files for Implementation

Based on this exploration, here are the 5 most critical files for implementing this plan:

- **`src/types/location.ts`** - Extend with `CodexEntry`, `EntryWeight`, `Category` interfaces; foundation for entire feature
- **`src/lib/entry-weight.ts`** - Core weight calculation logic; determines which visual treatment applies
- **`src/lib/breadcrumb-journey.ts`** - Journey narrative generation; transforms technical paths into immersive prose
- **`src/components/codex/CodexEntry.tsx`** - Main dispatcher component; routes to weight-specific renderers
- **`src/app/codex/[entryId]/page.tsx`** - Entry detail page; integrates both features and renders final experience