# Heart Rush Interactive Map - Design Document

## Visual Identity

### Color Palette (Parchment Theme)

Light mode, immersive "aged paper" aesthetic.

| Token | Value | Usage |
|-------|-------|-------|
| `--parchment` | `#f5f0e6` | Primary background |
| `--parchment-dark` | `#e8e0d0` | Secondary background, hover states |
| `--parchment-light` | `#faf8f3` | Cards, elevated surfaces |
| `--ink` | `#2c2416` | Primary text |
| `--ink-muted` | `#5c5346` | Secondary text |
| `--gold` | `#c9a227` | Accent, selection states |
| `--gold-muted` | `#a68a4b` | Subtle accent |
| `--border` | `#d4c5a9` | Borders, dividers |

### Typography

| Usage | Font | Weight |
|-------|------|--------|
| Headers, location names | Cinzel | 600 |
| Body text, lore content | Inter | 400 |
| Map labels | Inter | 500 |
| UI elements | Inter | 400-500 |

### Location Type Colors (Muted Jewel Tones)

| Type | Color | Hex |
|------|-------|-----|
| region | Warm tan | `#b8956b` |
| city | Gold | `#c9a227` |
| town | Muted tan | `#a68a64` |
| fortress | Stone grey | `#6c6c6c` |
| dungeon | Muted red | `#8b3a3a` |
| ruins | Faded grey | `#7a7a7a` |
| wilderness | Forest green | `#4a7c59` |
| landmark | Slate blue | `#5a7a8c` |
| water | Ocean blue | `#4a8c9c` |
| temple | Purple | `#6b4a8c` |
| poi | Teal | `#4a7c7c` |

---

## Components

### Button Variants

| Variant | Usage |
|---------|-------|
| `default` | Primary actions (ink bg, parchment text) |
| `accent` | Highlighted actions (gold bg) |
| `outline` | Secondary actions (bordered) |
| `secondary` | Tertiary actions (darker parchment bg) |
| `ghost` | Subtle actions (transparent) |
| `link` | Text links |
| `nav` | Navigation tabs (inactive) |
| `nav-active` | Navigation tabs (active) |

### Sidebar

- Width: 380px
- Position: Floating over map (left side)
- Background: `--sidebar` (slightly darker parchment)
- Shadow: `4px 0 24px rgba(44, 36, 22, 0.15)`
- No transparency

### Selected State

- Map labels: Gold underline (`text-decoration-color: var(--gold)`, 2px, 3px offset)
- Marker: Slight scale (1.05)

---

## Map View

### Interaction Model

"Labels reveal on zoom" (Option A from original design doc):
- Zoom to a level → labels for that depth fade in automatically
- Click label → sidebar opens with lore
- Familiar Google Maps-style interaction

### Zoom Levels

```
Zoom 0-1 (continent)  → Continents, major regions
Zoom 2   (region)     → Kingdoms, biomes, major features
Zoom 3   (kingdom)    → Cities, forests, mountain ranges
Zoom 4   (local)      → Towns, dungeons, landmarks
Zoom 5   (street)     → Buildings, NPCs, encounters
```

### Empty Areas

Literally empty - no fog, no "terra incognita" treatment. Map speaks for itself.

### Clustering

Not needed for MVP. Zoom levels should prevent density issues.

---

## Codex View

Full-page view (Option C) - separate from map with link-outs.

### Navigation Structure

Categories from `navigation-categories.json`:
- Atlas of Alaria (🗺️)
- Nations & Powers (👑)
- Cosmology & Religion (🌌)
- History & Lore (📜)
- Magic & Knowledge (✨)
- Bestiary (🐉)

Each category contains sections, each section contains entries (H2 headers become individual entries).

### Entry Data Model

```typescript
interface CodexEntry {
  id: string;                    // slugified from name
  name: string;                  // display name
  category: string;              // top-level category
  section: string;               // parent section (file)
  tags: string[];                // standardized tags
  sourceFile: string;            // e.g., "Factions.md"
  sourceHeader: string;          // e.g., "## Elves of the Gray Order"
  content: string;               // markdown content
  relatedIds?: string[];         // cross-references
  mapLocationId?: string;        // link to map location (from pinning tool)
}
```

### Cross-Linking

- Codex entry mentions location → "View on Map" button
- Map location selected → sidebar can link to Codex entry
- Geographic hierarchy derived from `parentId`, not tags

---

## Standard Tag Taxonomy

### Entity Type (primary - can have multiple)

| Tag | Description |
|-----|-------------|
| `state` | Nation, kingdom, empire |
| `citystate` | Independent city-state (also counts as city) |
| `city` | Major city/settlement |
| `capital` | Seat of power |
| `settlement` | Town, village, outpost |
| `faction` | Organization, guild, order |
| `npc` | Named character |
| `race` | Playable or major species |
| `creature` | Non-playable fauna |
| `monster` | Hostile creature |
| `dragon` | Dragons specifically |
| `daemon` | Daemon entities |
| `god` | Deity |
| `poi` | Point of interest |
| `fortress` | Military structure |
| `ruins` | Abandoned/destroyed place |
| `dungeon` | Explorable dangerous location |
| `region` | Named geographic area |
| `plane` | Planar location |
| `item` | Artifact, material, object |
| `event` | Historical event |
| `magic` | Magic system/school |

### Geography (terrain - stackable)

| Tag | Description |
|-----|-------------|
| `forest` | Woods, jungle |
| `mountains` | Mountain ranges |
| `hills` | Hilly terrain |
| `plains` | Grassland, steppe, savannah |
| `desert` | Arid lands |
| `swamp` | Wetlands, marsh |
| `tundra` | Frozen waste |
| `coast` | Coastal areas |
| `island` | Islands |
| `lake` | Lakes |
| `river` | Rivers |
| `sea` | Seas, oceans |
| `underground` | Caves, underrealms |

### Qualifiers (modifiers - stackable)

| Tag | Description |
|-----|-------------|
| `dangerous` | High threat level |
| `sacred` | Holy/religious significance |
| `cursed` | Magically tainted |
| `ancient` | Very old |
| `trade` | Commerce hub |
| `port` | Maritime access |

### Cultural (affiliations - stackable)

| Tag | Description |
|-----|-------------|
| `elven` | Elf-related |
| `dwarven` | Dwarf-related |
| `orc` | Orc-related |
| `human` | Human-related |
| `fae` | Fae-related |
| `goblin` | Goblin-related |

### Example Tag Combinations

- Capital city with port: `city, capital, port, trade`
- Cursed ancient dungeon: `ruins, dungeon, cursed, ancient`
- Elven sacred forest: `region, forest, sacred, elven`
- Dragon lair in mountains: `dungeon, dragon, mountains, dangerous`

---

## Magical UX Components

### Typography Components (`src/components/typography/`)

#### DropCap
Illuminated first letters for major entries.

```tsx
import { DropCap } from '@/components/typography'

<DropCap variant="illuminated">T</DropCap>
<p>he Kingdom of Valdris stands as a beacon...</p>
```

| Variant | Description |
|---------|-------------|
| `simple` | Gold Cinzel letter, 3-4 lines tall, floated left |
| `illuminated` | Parchment-dark background, gold border, texture overlay |
| `ornate` | Decorative ✦ flourishes in corners |

#### OrnamentalDivider
Section breaks with fantasy aesthetic.

```tsx
import { OrnamentalDivider } from '@/components/typography'

<OrnamentalDivider variant="flourish" spacing="loose" />
```

| Variant | Description |
|---------|-------------|
| `simple` | Gradient line with center ◆ symbol |
| `flourish` | Curved lines with central ✦ medallion |
| `symbols` | Three ornaments: ❧ ✦ ❧ |
| `double-line` | Two parallel lines with symbol in gap |

Spacing: `tight` (my-4), `normal` (my-8), `loose` (my-12)

#### Marginalia
Pull quotes and annotations in the margins.

```tsx
import { Marginalia } from '@/components/typography'

<Marginalia variant="quote" side="right">
  "No walls can hold what the people will not defend." — King Aldric
</Marginalia>
```

| Variant | Description |
|---------|-------------|
| `quote` | Italic text with gold opening quotation mark |
| `note` | Small text in bordered parchment box |
| `annotation` | Minimal styling for references |

Responsive: Desktop shows in gutters with rotation, mobile shows inline.

---

### Codex Entry Components (`src/components/codex/`)

#### Entry Weight System

Entries have visual weight based on their tags:

| Weight | Tags | Treatment |
|--------|------|-----------|
| `legendary` | god, dragon | 5xl centered header, ornate gold corners, 6xl icon |
| `major` | capital, state, daemon | 3xl left header, 2px bottom border |
| `standard` | city, faction, poi, region | 2xl header, 1px border |
| `minor` | creature, item, settlement | xl inline header, compact |
| `footnote` | <10 lines content | base inline, minimal spacing |

Manual override via `weight` field in frontmatter.

#### CodexEntry (Dispatcher)

```tsx
import { CodexEntry } from '@/components/codex'

<CodexEntry entry={entry} />
```

Automatically:
- Calculates entry weight from tags
- Applies atmosphere tint based on tags
- Implements progressive revelation
- Renders appropriate weight component

#### BreadcrumbJourney

Narrative navigation instead of technical breadcrumbs.

```tsx
import { BreadcrumbJourney } from '@/components/codex'

<BreadcrumbJourney
  entry={entry}
  category={category}
  parentLocation={parent}
/>
// Renders: "You are reading about Adron, a nation in Ve, in the annals of Nations & Powers"
```

---

### Progressive Revelation

Content unfurls as you scroll, creating discovery feel.

```css
.reveal-collapsed   /* First 6rem visible */
.reveal-gradient    /* Fade overlay at bottom */
.reveal-expanded    /* Unfurl animation on expand */
```

Implementation:
- Intersection Observer triggers reveal at 30% visibility
- "Continue reading..." button for manual expand
- 0.4s cubic-bezier animation

---

### Ambient Atmosphere

Subtle background tints based on content type.

| Atmosphere | Trigger Tags | Tint |
|------------|--------------|------|
| `civilization` | city, capital, trade | Warm gold (3%) |
| `sacred` | sacred, temple | Ethereal purple (4%) |
| `cursed` | cursed | Dark purple (6%) |
| `ancient` | ancient, ruins | Cool grey (4%) |
| `dangerous` | dangerous, dungeon | Muted red (3%) |
| `trade` | trade, port | Warm tan (2%) |
| `nature` | forest, wilderness | Green (3%) |
| `water` | water, sea, lake | Blue (3%) |

Priority order: cursed > sacred > dangerous > ancient > civilization > trade > nature > water

CSS Classes:
```css
.atmosphere-sacred      /* Apply sacred tint */
.atmosphere-transition  /* 600ms smooth transition */
```

---

## Deferred Features (Future)

### Map as Preview
When entry has `mapLocationId`, show embedded mini-map preview with location marker. Click jumps to full map view.

### In-World Voice
Flavor quotes from in-world characters. Add `quotes` field to frontmatter.
Example: *"As the sailors of Kyagos say, 'The current takes, the current gives.'"*

### Reading Mode
Full-screen, distraction-free typography. Wide margins, beautiful typography, no UI chrome.

### Relationship Web
Hover on mentioned entity → tooltip preview. "Connections" panel showing first-degree links.

### Easter Eggs
Hidden entries that appear after reading prerequisites. Progress tracking.

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Map view (main)
│   ├── codex/
│   │   ├── page.tsx                # Category listing
│   │   ├── [entryId]/
│   │   │   └── page.tsx            # Entry detail
│   │   └── category/
│   │       └── [categorySlug]/
│   │           └── page.tsx        # Category entries
│   ├── globals.css                 # Theme tokens, utilities, animations
│   └── layout.tsx                  # Fonts (Cinzel, Inter)
├── components/
│   ├── InteractiveMap.tsx          # Leaflet map component
│   ├── PinningMap.tsx              # Location pinning tool
│   ├── typography/
│   │   ├── DropCap.tsx             # Illuminated first letters
│   │   ├── OrnamentalDivider.tsx   # Section dividers
│   │   ├── Marginalia.tsx          # Pull quotes/notes
│   │   └── index.ts
│   ├── codex/
│   │   ├── CodexEntry.tsx          # Weight dispatcher + revelation
│   │   ├── LegendaryEntry.tsx      # Gods, dragons
│   │   ├── MajorEntry.tsx          # Capitals, states
│   │   ├── StandardEntry.tsx       # Cities, factions
│   │   ├── MinorEntry.tsx          # Creatures, items
│   │   ├── FootnoteEntry.tsx       # Brief references
│   │   ├── BreadcrumbJourney.tsx   # Narrative navigation
│   │   └── index.ts
│   └── ui/                         # shadcn components
│       ├── button.tsx              # Custom parchment variants
│       ├── scroll-area.tsx
│       └── separator.tsx
├── types/
│   ├── location.ts                 # Location types, styles
│   └── codex.ts                    # CodexEntry, EntryWeight, AtmosphereType
└── lib/
    ├── utils.ts                    # Tailwind utilities
    ├── entry-weight.ts             # Weight calculation
    ├── atmosphere.ts               # Tag → atmosphere mapping
    └── breadcrumb-journey.ts       # Narrative generation
```

---

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Leaflet for map rendering
- shadcn/ui components (customized)
- Cinzel + Inter fonts (Google Fonts)
- class-variance-authority (CVA) for component variants
