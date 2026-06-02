---
name: Region authoring
description: how to flesh out a region entity
when:
  entityType: region
---

# Region entities

A region is a top-level geographic container — the map's mid-zoom unit (`zoomLevel`
usually 1–3). It holds settlements, water bodies, wilderness, and ruins as members and
is the article a reader lands on to understand a stretch of the world. The universal
place kernel — the Wikipedia-summary container/member model, reading geography off the
map rather than distance rankings, and length-by-`zoomLevel` — lives in
`docs/worldbuilding/lore-style-guide.md` (Process and Length sections). This file is
the region-specific delta.

## Recommended shape

A region usually opens with a geography section: the terrain, the borders, the one
geographic fact that defines this land and no other (an island chain, a rain-shadow
plateau, a strait everyone must pay to cross). Named sub-features — peaks, bays,
passes — sit under it.

It then summarizes its notable member settlements one sentence each, drawn from each
member's `blurb`, and defers to the member file for detail. Do not restate a town's
lore in its region; read the member file before writing its one-liner.

A strong region closes on relations: how its members get along, who answers to whom,
and the live dispute that crosses the whole region.

## What makes a good region

One defining geographic fact plus one live, region-spanning dispute — a contested
border, a resource everyone fights over, a sky-trade route or leyline that reorders the
local economy. A settled, harmonious region with no lever is filler. Surface the
tension Alaria's geography already holds rather than inventing grimness.

## Before you write

Read the container (the nation/continent/landmass this region is `within`), every
member, and every entity across each `borders` edge — load both sides of a border
before asserting what lies there. Run `alaria-codex map shot` to see the real
coastline and the maroon national border line; containment comes from the map, not from
which pins are nearest. Consult `world-systems-invariants.md` before any cosmological
claim. Region and place names follow the dominant culture's sheet in
`docs/worldbuilding/onomastics/` — match it exactly, never blend families.

## Edges that matter

- `spatial/within` → the nation, continent, or landmass that contains this region (≤1).
- `spatial/borders` → co-equal neighboring regions; author one direction only.
- `contains` is computed at build from members' `within` edges — never author it here.
- `capitalOf` is authored on the settlement, never on the region.

## Length

Regions carry story weight, so multi-section depth is appropriate — but earn each
section. A two-paragraph entry with one live hook beats four padded ones. No
`<!-- mechanics -->` block: places do not carry stat blocks.
