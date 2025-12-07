# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive map application for the Heart Rush TTRPG world "Alaria". A Leaflet-based tiled map viewer with zoom-dependent location markers and lore sidebars. Think "Google Maps for fantasy lore"—zoom level determines which locations are visible.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint
- `pnpm generate-tiles <input-image>` - Generate tile pyramid from source image

### Tile Generation

Before running the dev server, generate tiles from the source map image:

```bash
npx tsx scripts/generate-tiles.ts public/Alaria.png public/tiles 256 0 5
```

This creates a tile pyramid in `public/tiles/` with a `config.json` that the app reads at runtime.

## Architecture

### Tech Stack
- Next.js 16 with App Router
- TypeScript (strict mode)
- Tailwind CSS v4
- Leaflet for map rendering
- Sharp for tile generation

### Core Files

- `src/app/page.tsx` - Main page, loads tile config and renders map
- `src/components/InteractiveMap.tsx` - Leaflet map wrapper with custom markers
- `src/types/location.ts` - Location and MapConfig types, marker styles
- `scripts/generate-tiles.ts` - Tile pyramid generator using Sharp

### Depth Model

Zoom level = content hierarchy. Locations have a `zoomLevel` property that determines when they appear:

```
Zoom 0-1: Continents, major regions
Zoom 2:   Kingdoms, biomes
Zoom 3:   Cities, major geographic features
Zoom 4:   Towns, dungeons, landmarks
Zoom 5:   Specific buildings, POIs
```

### Location Types

Defined in `src/types/location.ts`: `region`, `city`, `town`, `fortress`, `dungeon`, `ruins`, `wilderness`, `landmark`, `water`, `temple`, `poi`. Each has an icon and color.

### Leaflet Coordinate System

The map uses `L.CRS.Simple` with pixel coordinates. Y-axis is flipped when placing markers (Leaflet has bottom-left origin, images have top-left).
