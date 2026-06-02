---
name: Water authoring
description: how to flesh out a water entity
when:
  entityType: water
---

# Water entities

A water entity is a bay, river, sound, strait, lake, ocean expanse, or analogous
geographic feature. The universal place kernel lives in
`docs/worldbuilding/lore-style-guide.md` and `region.md`. This file is the
water-specific delta.

## Sibling rule

Water bodies are siblings, not containers. A bay, sound, river, or peninsula is a
co-equal child of the parent region — it carries `spatial/within` pointing to the same
region (or landmass) as the settlements beside it. An island's or coastal ruin's
`spatial/within` points to its landmass or the top-level region, never to the water
body it sits in. Do not make a river or bay the container for a settlement or ruin.

## Recommended shape

A water entity usually covers three things: what the water is and what it does
physically (depth, current, seasonal behavior, named hazard), what it carries or
separates (trade routes, the polity on each bank, the border it forms), and the hook or
reason it is pinned over its neighbors. Urchin Bay is the model at the lean end: named
hazard (giant urchins), navigation consequence (treacherous), and a specific hook
(centuries of wrecked ships on the bottom, expeditions keep forming, most fail
expensively).

A river usually adds what the two banks are and what crossing it costs. A strait adds
what it separates and who controls transit — the `spatial/controlsPassage` edge
belongs on the fortress or settlement that commands it, not on the water body itself.

## What makes a good water entity

The route or barrier function. Water in Alaria is either a highway (trade, sky-trade
staging, tribute flows) or a wall (a border, a hazard, a buffer between polities). The
specific fact that makes this body of water worth pinning over its neighbors is where
the entry lives. A river that is simply there is not worth an entry; a river that is
the only practical crossing for an army, or that floods the valley agriculture once a
decade and the downstream polity argues about who is responsible, is.

## Before you write

Read the regions on each bank or shore. Run `alaria-codex map shot` to see actual
coastlines, islands, and the entities adjacent to this water. Water names follow the
dominant culture's sheet in `docs/worldbuilding/onomastics/` for the region they
belong to.

## Edges that matter

- `spatial/within` → the region or landmass this water body is a child of (≤1); never
  another water body.
- `spatial/borders` → when the water body itself is the border between two regions.
- `spatial/separatedBy` → authored on an entity (or on the water itself) to express
  what the body of water keeps apart.
- `economy/tradesWith`, `economy/skyRouteTo` → author on the settlements that use the
  route, not on the water body.

## Length

Most water entries: 2-3 sentences, no headers. A sea or strait that defines regional
politics earns a short section. No `<!-- mechanics -->` block.
