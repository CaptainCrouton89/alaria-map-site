---
name: Fortress authoring
description: how to flesh out a fortress entity
when:
  entityType: fortress
---

# Fortress entities

A fortress is a military or defensive structure — a keep, a garrison tower, a
wall-complex, a lich's ice spire. It exists because something needs guarding: a
crossing, a resource, a subject population, a secret. The universal place kernel lives
in `docs/worldbuilding/lore-style-guide.md` and `region.md`. This file is the
fortress-specific delta.

## Recommended shape

A fortress usually opens with what it guards and the geographic fact that makes this
position the right one — the narrowest point of a strait, the convergence of three
passes, the only deep-water harbor on a coastline. Then who holds it, how many garrison
it, and what the command relationship is. A strong fortress entry closes on the
complication: corruption that lets things through for a price, disputed loyalty between
two overlapping polities, a structural feature the garrison has stopped investigating.

## What makes a good fortress

The strategic or moral complication. A fortress that simply guards is furniture.
Slavewatch is the model: official function and real function are not the same, the
command has become hereditary, and every power that could expose it has a reason not to.
Torsnerhun is the leaner model: a specific chokepoint (the Needle), a specific
mechanism (overlapping firemage fire), a specific career dynamic. Pick the register that
fits the fortress's scale.

## Capitals

The capital is always the `city` among a region's members. A `polity/capitalOf`
relation is authored on the city entity (target = the nation), never on a fortress.

## Before you write

Read the container region and the entity on each side of the passage or border the
fortress guards — load both sides before asserting what the fortress oversees. Run
`alaria-codex map shot` to confirm what it actually overlooks. Consult
`world-systems-invariants.md` before any claim about leyline fortification or magical
defenses. Onomastics: fortress names follow the dominant culture's sheet in
`docs/worldbuilding/onomastics/`.

## Edges that matter

- `spatial/within` → the region or polity that contains this fortress (≤1).
- `spatial/controlsPassage` → the pass, strait, or chokepoint it controls.
- `spatial/liesOn` → the road or route it sits astride, if named.
- `polity/ruledBy` → the garrison commander or ruling power, if named.
- `polity/vassalOf` → when the fortress answers to a different authority than the
  surrounding region.

## Length

Fortresses with story weight warrant multi-section depth. A simple watchtower stub
earns 2-3 sentences. No `<!-- mechanics -->` block — encounter and garrison notes belong
in `<!-- author-notes -->` or a campaign document.
