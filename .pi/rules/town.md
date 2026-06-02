---
name: Town authoring
description: how to flesh out a town entity
when:
  entityType: town
---

# Town entities

A town is a minor settlement — a waypoint, a market village, a craftwork center that
does not reach city scale. Most towns sit at `zoomLevel` 4-5. The universal place
kernel — Wikipedia-summary container/member model, reading geography off the map via
`map shot`, and length by `zoomLevel` — lives in `docs/worldbuilding/lore-style-guide.md`
and `region.md`. This file is the town-specific delta.

## Recommended shape

Most towns get 2-3 tight sentences and no section headers. The shape is: what the town
is for (its trade, its garrison, its geographic function), who lives there or passes
through, and one concrete hook. Defer everything else upward to the region — the town
file is not where regional history lives.

Headers are warranted only when a town has a specific story role that is explicitly
referenced from a region or campaign entry. That is the exception.

## What makes a good town

One concrete detail that only this town could have — not "a market town" but the
specific trade that passes through, the specific reason travelers stop here rather than
the next settlement over, or the specific grievance that has not been resolved. Two
examples are usually enough; one is often better. Generic flavor is filler. Vosx is the
model at the high end: a specific geographic function (river approach to the coast),
a specific institution (the Arcane Consortium), and a specific hook (the 50,000-gold
bounty nobody has claimed in two centuries).

## Capitals

The capital of a polity is always the `city` among a region's members, never a town.
If a settlement is a capital, it should carry `entityType: city`. A capital is a
`polity/capitalOf` relation authored on the city entity (target = the nation) — never
a frontmatter field.

## Before you write

Read the region and its other member towns. Find what each sibling already does.
Write something different. If the region already has a river-crossing market, this town
needs a different hook. Onomastics: place names follow the dominant culture's sheet in
`docs/worldbuilding/onomastics/`.

## Edges that matter

- `spatial/within` → the region that contains this town (≤1).
- `culture/inhabitedBy` → the people(s), if non-obvious from the region.
- `polity/ruledBy`, `polity/vassalOf` → only when the relationship is specific to this
  settlement rather than inherited from the region.

## Length

Two to three sentences for most towns. No `<!-- mechanics -->` block.
