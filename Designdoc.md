# HEart Rush Interactive Map - Design Doc

## Core Concept
A "Google Maps for fantasy lore"—infinite zoom into a massive world, with content that reveals itself at appropriate depths. The map IS the navigation.

---

## The Depth Model

The key insight: **zoom level = content hierarchy**

```
Zoom 1 (continent view)     → Continents, major regions (5-10 nodes)
Zoom 2 (region view)        → Kingdoms, biomes, major geographic features (50-100)
Zoom 3 (kingdom view)       → Cities, forests, mountain ranges (500+)
Zoom 4 (local view)         → Towns, dungeons, landmarks (1000s)
Zoom 5 (street view)        → Specific buildings, NPCs, encounters
```

Each piece of lore has a "depth" tag. Content only appears when you're at the right zoom level. This solves the "thousands of markers" problem—you never see more than ~20-50 at once.

---

## Interaction Model

### Option A: Labels Reveal on Zoom (Recommended)
- Zoom to a level → labels for that depth fade in automatically
- Click label → sidebar opens with lore
- No explicit "reveal" action needed
- Feels like Google Maps—familiar, intuitive

### Option B: Click to Reveal
- First click on empty area → reveals labels in that region
- Second click on label → opens lore
- More mysterious/discovery-oriented
- Risk: confusing, extra friction

### Option C: Hybrid
- Major locations (cities, capitals) always visible at their depth
- Minor locations require hover or proximity to reveal
- Best of both but more complex to implement

**Recommendation:** Start with Option A. It's the pattern people know. You can add mystery/discovery mechanics later if it feels too "solved."

---

## Click Behavior

When user clicks:
1. Find the nearest node **at the current zoom depth**
2. If node exists within reasonable radius → select it, open sidebar
3. If no node nearby → do nothing (or subtle "nothing here" feedback?)

Alternative: Click empty space = zoom in + center on that point. Only labeled things are clickable. This is cleaner.

---

## Sidebar Design (Left Side)

```
┌─────────────────────────────────────┐
│ ← Back to [Parent Region]           │  ← Breadcrumb up
├─────────────────────────────────────┤
│ ╔═══════════════════════════════╗   │
│ ║  LOCATION NAME                ║   │
│ ║  Subtitle/type (City, Ruin)   ║   │
│ ╚═══════════════════════════════╝   │
├─────────────────────────────────────┤
│                                     │
│  [Lore content - markdown rendered] │
│                                     │
│  Multiple paragraphs, scrollable    │
│                                     │
├─────────────────────────────────────┤
│ ▼ Locations Within                  │  ← Expand to see children
│   • Sublocation 1                   │
│   • Sublocation 2                   │
│   • Sublocation 3                   │
├─────────────────────────────────────┤
│ ○ Related Locations                 │  ← Other places mentioned
│   • Mentioned Place 1               │     in this lore
│   • Mentioned Place 2               │
└─────────────────────────────────────┘
```

### Sidebar Behavior
- **Breadcrumb up**: Click to zoom out and select parent region
- **Locations Within**: Click to zoom in and select that child
- **Related Locations**: Click to pan/zoom to that location
- Sidebar slides in from left, ~350-400px wide
- Map shifts right slightly OR sidebar overlays with slight transparency at edge

---

## Visual Hierarchy for Labels

At each zoom level, labels need to feel appropriate:

| Zoom Level | Label Style |
|------------|-------------|
| Continent | Large, bold, maybe stylized fantasy font |
| Region | Medium, all caps |
| City | Medium, title case, maybe icon |
| Town/Local | Smaller, subtle |
| POI | Small, italics or muted color |

Labels fade in/out as you cross zoom thresholds. Smooth transitions, not jarring pops.

---

## Location Type Taxonomy

Each location has a `type` that determines its icon and color. Keep to ~10 types max for clarity.

| Type | Icon | Color | Examples |
|------|------|-------|----------|
| `region` | 🗺️ | Neutral/tan | Continents, kingdoms, biomes, political territories |
| `city` | 🏰 | Gold/amber | Major cities, capitals, large settlements |
| `town` | 🏘️ | Warm brown | Towns, villages, hamlets, outposts |
| `fortress` | 🏯 | Stone grey | Castles, forts, military installations, strongholds |
| `dungeon` | 💀 | Muted red | Dungeons, crypts, lairs, cursed places, tombs |
| `ruins` | 🏚️ | Faded grey | Ancient ruins, abandoned places, battlefields |
| `wilderness` | 🌲 | Forest green | Forests, jungles, swamps, named wild areas |
| `landmark` | ⛰️ | Slate blue | Mountains, valleys, canyons, geographic features |
| `water` | 🌊 | Ocean blue | Oceans, seas, lakes, rivers, named bodies of water |
| `temple` | ✨ | Purple/violet | Temples, shrines, magical sites, portals, anomalies |
| `poi` | 📍 | Muted teal | Inns, shops, specific buildings, misc points of interest |

### Icon Rendering
- Icons render to the LEFT of the label text
- Size scales with zoom level (larger icons when zoomed out)
- At very high zoom, icons could become more detailed (stretch goal)

### In the Sidebar
```
┌─────────────────────────────────┐
│ 🏰 VALDRIS                      │
│ City · Kingdom of Therenth      │  ← type (text) + parent
├─────────────────────────────────┤
│ #trade  #port  #major-city      │  ← optional tags (future)
├─────────────────────────────────┤
│                                 │
│ Valdris sits at the confluence  │
│ of the Amber River and...       │
│                                 │
└─────────────────────────────────┘
```

### Frontmatter Example (updated)
```yaml
---
id: valdris-city
name: Valdris
type: city
coordinates: [4521, 8923]
zoomLevel: 3
parent: kingdom-of-therenth
related: [valdris-undercity, therenth-royal-family]
tags: [trade, port, major-city]
---
```

### Icons
- Use custom SVGs or icon library (e.g., game-icons.net, custom set)
- Consistent stroke weight and style across all icons
- Consider: filled vs outlined variants for selected/unselected states

---

## The Codex (Non-Geographic Lore)

For lore that doesn't live on the map: gods, planes, metaphysics, history, factions.

### MVP Structure
```
┌──────────────────────────────────────────────────────────┐
│  [🗺️ Map]    [📚 Codex]                        [🔍]     │
└──────────────────────────────────────────────────────────┘
```

- **Map**: The interactive map (primary experience)
- **Codex**: Non-geographic lore, organized by category
- **Search**: Global search across both map locations AND codex entries

### Codex Categories
| Category | Contents |
|----------|----------|
| Cosmology | Planes of existence, metaphysics, how magic works |
| Pantheon | Gods, divine entities, demigods, religious orders |
| History | Ages, eras, major events, timelines |
| Factions | Organizations, guilds, secret societies |
| Peoples | Species, races, cultures, languages |

### Codex Entry Structure
```yaml
---
id: vaelorn-god
title: Vaelorn, The Dawnbringer
category: pantheon
related: [temple-of-vaelorn, valdris-city, order-of-dawn]
tags: [sun, justice, light]
---
```

### Cross-Linking
- Map location mentions god → link to Codex entry
- Codex entry mentions temple → link to map location (clicking pans/zooms to it)
- Unified search returns both types
- Sidebar can show "Referenced in: [list of related entries]"

### MVP Implementation
- Simple category list → entry list → markdown content
- Basic but functional
- Search indexes both location and codex content

### Future "Pop" Ideas (NOT MVP)
- [ ] Illustrated headers for codex entries
- [ ] Animated constellation/diagram for cosmology
- [ ] Interactive pantheon relationship graph
- [ ] Timeline scrubber for history
- [ ] Faction relationship web
- [ ] "Reading mode" with beautiful typography
- [ ] Audio narration for major entries
- [ ] Parallax/depth effects in codex headers

---

## Technical Approach

### Map Tiling
- Use `gdal2tiles` or `libvips` to generate tile pyramid from 20k×20k PNG
- Standard slippy map tiles (256×256 or 512×512)
- Host tiles on Vercel or separate CDN
- Leaflet or OpenLayers for map rendering

### Location Data Structure
```typescript
interface Location {
  id: string;
  name: string;
  type: 'continent' | 'region' | 'kingdom' | 'city' | 'town' | 'poi';
  coordinates: [number, number];  // x, y on map
  zoomLevel: number;              // when this appears
  parentId: string | null;        // for hierarchy
  loreFile: string;               // path to markdown
  relatedIds: string[];           // cross-references
}
```

### Lore Storage
- Keep as markdown files
- Add frontmatter with location metadata
- Build script extracts frontmatter → generates locations.json
- Lore content loaded on-demand when sidebar opens

Example frontmatter:
```yaml
---
id: valdris-city
name: Valdris
type: city
coordinates: [4521, 8923]
zoomLevel: 3
parent: kingdom-of-therenth
related: [valdris-undercity, therenth-royal-family]
---

Valdris sits at the confluence of the Amber River and...
```

---

## MVP Scope (30 days)

### Must Have
- [ ] Tiled map with smooth zoom/pan
- [ ] Locations appear at appropriate zoom levels
- [ ] Click location → sidebar with lore
- [ ] Breadcrumb navigation (zoom out to parent)
- [ ] 30-50 locations tagged across all depth levels

### Nice to Have
- [ ] Search
- [ ] "Locations within" expansion
- [ ] Cross-reference links
- [ ] URL defined by coordinates (shareable links)

### Not MVP
- Rulebook integration
- User accounts
- Commenting/community features
- Mobile optimization (works, just not optimized)

---

## Open Design Questions

1. **What happens at max zoom?** Dead end, or does lore keep expanding?

2. **Empty areas**: Some map regions might have no lore yet. How do we handle clicking there? Subtle "unexplored" message? Just nothing?

3. **Label density**: At city level, you might have 50 towns in view. Do we cluster? Prioritize? Show top 20 + "and 30 more"?

4. **Fantasy font**: Worth it for headers, or keep it clean/readable?

5. **Color coding**: Different label colors for different types (cities=gold, ruins=grey, forests=green)?

---

## Next Steps

1. Generate tile pyramid from source PNG
2. Set up basic Leaflet map with tiles
3. Create location schema and tag 10-20 test locations across depths
4. Build sidebar component
5. Wire up click → sidebar flow
6. Iterate on feel (zoom thresholds, label transitions, etc.)
