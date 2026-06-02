---
name: Wilderness authoring
description: how to flesh out a wilderness entity
when:
  entityType: wilderness
---

# Wilderness entities

A wilderness is a natural feature — a mountain range, a forest, a marsh, a desert. It
is not a settlement; it is terrain that defines what lives in it, what passes through
it, and what the cost of crossing it is. The universal place kernel lives in
`docs/worldbuilding/lore-style-guide.md` and `region.md`. This file is the
wilderness-specific delta.

## Recommended shape

A wilderness usually opens with the terrain fact that distinguishes it from the region
around it — not "a mountain range" but the specific feature of the range that shapes
everything (a leyline running its spine, a stratified stone that concentrates a
particular attunement, a permanent weather system nobody has explained). Then the
people or creatures that inhabit it, drawn from `culture/inhabitedBy` edges. Then the
hazard or resource: what a party is likely to find, fight, or extract here.

Most wilderness entries are low-zoom and get 2-3 sentences with no headers. A mountain
range that defines the politics of a whole region earns more; a forest that is simply
forest does not.

## What makes a good wilderness

The specific terrain fact that connects to an Alaria lever: a leyline seam, a creature
unique to this ground, a resource somebody wants badly enough to fight over. Blueshale
Peaks is the model — one claim (deepest Golus seam in the northern reach, stratified
stone, attunement at depth) explains why the Korrun arose here and still hold it.
Generic "dangerous mountains" is filler. The hazard and the resource are often the same
thing: the leyline that makes the range worth controlling is also what makes it
dangerous to enter without preparation.

## Before you write

Read the container region and every entity with `spatial/within` pointing to the same
parent — find what each sibling already claims, then write something different. Run
`alaria-codex map shot` to see the terrain. For any leyline, element, or cosmological
claim, consult `world-systems-invariants.md` first. Onomastics: wilderness feature
names follow the dominant culture's sheet in `docs/worldbuilding/onomastics/`.

## Edges that matter

- `spatial/within` → the region or nation that contains this wilderness (≤1).
- `culture/inhabitedBy` → the creatures or peoples who live in or hold this terrain;
  author on this entity, target = the race or creature entity.
- `spatial/borders` → neighboring regions or features, when the wilderness is itself
  a significant boundary marker.

## Length

Most wilderness entries: 2-3 sentences, no headers. Feature ranges that carry regional
story weight warrant a short section or two. No `<!-- mechanics -->` block.
