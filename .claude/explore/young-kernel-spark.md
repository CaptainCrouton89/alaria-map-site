Perfect! Now I have all the information needed. Let me create a comprehensive investigation report.

## Investigation Report: Map Project Tile Setup and Architecture

### Summary

The Heart Rush map project is a **Next.js 16 + Leaflet-based interactive map viewer** with a complete tile pyramid serving system already in place. The current setup is production-ready for serving tiles but has **no Cloudflare/wrangler configuration** - it's using Next.js's built-in public static file serving.

---

### 📁 Current Tile Structure

**Location**: `/Users/silasrhyneer/Code/heart-rush-tools/map/public/tiles/`

**Size**: 1.3GB total with 2,644 PNG tile files across 6 zoom levels

**Zoom Levels**:
- **Zoom 0-1**: Continent/region level (small tile counts, low bandwidth)
- **Zoom 2**: Kingdom/biome level 
- **Zoom 3**: Cities/major features
- **Zoom 4**: Towns/dungeons (42 x-directories with many y-tiles each)
- **Zoom 5**: Specific buildings/POIs (10 x-directories)
- **`.temp/`**: Temporary directory (can be cleaned)

**Tile Format**: PNG format, 256px tiles (standard web tile size)
- Typical file sizes: 80-190KB per tile
- Example: `/public/tiles/0/0/0.png` (183K), `/public/tiles/4/0/0.png`

**Structure**:
```
public/tiles/
├── {z}/           # Zoom level directory
│   ├── {x}/       # X coordinate directory
│   │   ├── {y}.png    # Tile file (y coordinate)
│   │   └── ...
│   └── ...
├── config.json    # Tile configuration (MISSING - see issue below)
└── .temp/         # Temporary files from generation
```

---

### ⚙️ Tile Generation System

**Script**: `scripts/generate-tiles.ts` (lines 1-197)

**How it works**:
1. Takes source image (`public/Alaria.png`) - exists and is valid
2. For each zoom level (0-5):
   - Scales the image down by powers of 2 (`2^(zoom - maxZoom)`)
   - Extracts 256×256 pixel tiles in grid pattern (z/x/y.png)
   - Pads edge tiles with transparency if smaller than 256px
   - Uses Sharp with Lanczos3 resampling for quality
3. Generates `config.json` with metadata

**Key parameters**:
```typescript
tileSize: 256
minZoom: 0
maxZoom: 5 (auto-calculated from image dimensions)
imageWidth/Height: Stored in config.json
```

**Invocation**: `pnpm run generate-tiles -- public/Alaria.png public/tiles 256 0 5`

**Critical Issue**: The `config.json` file is **not present** in the tiles directory, but `src/app/page.tsx` line 44 tries to fetch it:
```typescript
fetch('/tiles/config.json')
  .then((res) => {
    if (!res.ok) {
      throw new Error('Tiles not generated. Run: npx tsx scripts/generate-tiles.ts public/Alaria.png');
    }
    return res.json();
  })
```

---

### 🗺️ Tile Serving: InteractiveMap Component

**Location**: `src/components/InteractiveMap.tsx` (lines 1-211)

**Architecture**:
- Client-side component (uses `'use client'` directive)
- Uses Leaflet.js with Simple CRS (pixel coordinates, not geographic)
- Dynamically imported in `page.tsx` to avoid SSR issues

**Tile Layer Configuration** (lines 50-56):
```typescript
L.tileLayer(`${tilesPath}/{z}/{x}/{y}.png`, {
  minZoom: config.minZoom,
  maxZoom: config.maxZoom,
  bounds,
  noWrap: true,
  tileSize: config.tileSize,  // 256px
}).addTo(map);
```

**Tile Path**: Passed as prop from page: `/tiles` → resolves to `public/tiles/{z}/{x}/{y}.png`

**Coordinate System**:
- Leaflet's CRS.Simple: origin at bottom-left, Y-axis flipped from image coordinates
- Marker Y-coordinates are flipped: `[config.imageHeight - y, x]` (line 95)
- Bounds set to `[[0, 0], [imageHeight, imageWidth]]` (lines 44-47)

**Features**:
- Zoom-dependent location markers (only shown if `location.zoomLevel <= currentZoom`)
- Location filtering in `useEffect` (lines 84-86)
- Custom marker styling with emoji icons and labels
- Parchment-themed UI with medieval styling

---

### 🔌 API Route: Pin/Pinning System

**Location**: `src/app/api/pin/route.ts` (lines 1-157)

**Purpose**: Backend system for pinning locations to the map with coordinates and zoom levels

**Endpoints**:

| Method | Purpose | Files Used |
|--------|---------|-----------|
| **GET** | Fetch current pinning state + stats | `data/work-queue.json`, `data/pinned.json` |
| **POST** | Pin a location or skip it | Updates both JSON files |
| **PUT** | Jump to specific entries | Work queue navigation |

**Data Files** (in `data/` directory, **not version controlled**):
- `work-queue.json`: Queue of location entries with status (pending/pinned/skipped)
- `pinned.json`: Map of pinned locations with coordinates/zoomLevel/type

**Response Structure** (lines 52-57, 125-130):
```typescript
{
  currentEntry: LoreEntry | null,
  currentIndex: number,
  stats: {
    total: number,
    pending: number,
    pinned: number,
    skipped: number
  },
  pinnedData: PinnedData
}
```

---

### 📝 Type Definitions

**Location Types** (`src/types/location.ts`):
```typescript
interface MapConfig {
  imageWidth: number;
  imageHeight: number;
  tileSize: number;      // 256
  minZoom: number;       // 0
  maxZoom: number;       // 5
}

interface Location {
  id: string;
  name: string;
  type: LocationType;    // 11 types: region, city, town, fortress, dungeon, ruins, wilderness, landmark, water, temple, poi
  coordinates: [x, y];   // pixel coordinates
  zoomLevel: number;     // 0-5, when location appears
  parentId: string | null;
  relatedIds: string[];
}
```

**Pinning Types** (`src/types/pinning.ts`):
```typescript
interface WorkQueue {
  version: number;
  extractedAt: string;
  sourceFiles: string[];
  entries: LoreEntry[];        // From markdown extraction
}

interface PinnedLocation {
  coordinates: [x, y];
  zoomLevel: number;
  type: LocationType;
  pinnedAt: string;           // ISO timestamp
}
```

---

### 🚀 Current Tile Serving

**Method**: Static file serving via Next.js
- Files in `public/tiles/` are served as-is by Next.js
- No compression or streaming transformations
- Fast due to static hosting, but **full 1.3GB must be deployed**

**Configuration**: 
- `next.config.ts` is minimal (empty, lines 1-7)
- No compression middleware
- No Cloudflare Pages or edge caching configured

---

### ⚠️ Issues Identified

1. **Missing `config.json`**: Must regenerate tiles or manually copy from tile gen
2. **No Cloudflare Configuration**: Zero wrangler.toml or Cloudflare setup
3. **1.3GB Deployment Size**: All tiles bundled with app - massive initial deploy
4. **No CDN/Cache Strategy**: Static serving only, no global edge caching
5. **No Tile Optimization**: PNG tiles could benefit from:
   - WebP format with fallback (10-20% smaller)
   - Compression optimization
   - Image quantization
6. **No `.temp` cleanup**: `.temp/` directory persists after generation (minor)

---

### 📦 Dependencies

**Core**: Next.js 16, React 19, TypeScript 5
**Map**: Leaflet 1.9.4, react-leaflet 5.0.0
**Generation**: Sharp 0.34.5 (tile pyramid creation)
**Styling**: Tailwind CSS 4, Cinzel/Inter fonts
**UI**: Radix UI components (ScrollArea, Separator, Slot)

---

### 📂 File Reference Summary

| File | Purpose | Status |
|------|---------|--------|
| `src/components/InteractiveMap.tsx` | Map rendering component | ✓ Complete |
| `src/app/page.tsx` | Main page, loads config | ⚠️ config.json missing |
| `scripts/generate-tiles.ts` | Tile generation script | ✓ Complete |
| `src/types/location.ts` | Location type definitions | ✓ Complete |
| `src/types/pinning.ts` | Pinning queue types | ✓ Complete |
| `src/app/api/pin/route.ts` | Pinning backend API | ✓ Complete |
| `package.json` | Dependencies | ✓ Complete |
| `next.config.ts` | Next.js config | ⚠️ Minimal, no optimization |
| `public/tiles/` | Generated tile pyramid | ✓ 1.3GB, 2,644 tiles |
| `public/tiles/config.json` | Tile metadata | ✗ MISSING |
| `wrangler.toml` | Cloudflare config | ✗ NOT FOUND |

---

### 🎯 Ready for Cloudflare Migration

**Current capability**: The tile serving infrastructure is **ready to migrate to Cloudflare Workers**. All that's needed:

1. ✓ Tiles are pre-generated and static
2. ✓ Config is JSON-based
3. ✓ No server-side rendering dependencies
4. ✓ Simple URL pattern: `/{z}/{x}/{y}.png`
5. ✓ API route is already isolated and testable

**What's missing for Cloudflare**:
- Wrangler configuration
- R2 bucket setup for tiles
- Worker script for routing
- Build script modifications
- Environment configuration

The project structure is **optimal for serverless edge tile serving**.