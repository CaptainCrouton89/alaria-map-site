---
name: Plane authoring
description: how to flesh out a plane entity
when:
  entityType: plane
---

# Plane entities

A plane is a discrete layer of the Alarian cosmological stack — a full world in its own
right, or an overlay that drapes across several of them. The cosmology is locked.

**Read these before writing a single sentence:**
- `docs/worldbuilding/systems/planar-stack.md` — the authoritative stack structure
- `docs/worldbuilding/world-systems-invariants.md` — invariants that cannot be
  contradicted

Why this matters in practice: an agent inventing lore for the ayblek placed it "past
the titan-glass stars at the world's edge" — a planar geometry that does not exist.
The stack was already specified. Do not invent planes, stack layers, or world-edge
mechanics; do not move existing planes relative to each other; do not add a seventh plane.

Also grep the existing plane entities before writing:

```
grep -rl "entityType: plane" content/codex/entities/
```

Read `plane-the-cosmos.md` and `plane-celestia.md` as the fully developed models.

## Recommended shape

Where does this plane sit in the stack, and how is it reached? Then its internal
structure and divisions. Then who or what inhabits it, and how it couples back to the
Material Plane.

`plane-celestia.md` illustrates the full arc: origin → nature (the Ezz-reflection
mechanism) → spirits → travel → magic. Most planes will not need that depth, but the
coupling section is never optional — a plane that touches nothing is lore without a hook.

## What makes a good plane

The coupling. A plane matters through what crosses its boundary: leylines surfacing,
dead arriving, daemons reaching back, souls cycling, a material-side anchor holding a
spirit. If you cannot name what crosses and what it costs to cross, the plane has no
lever. Locate the crossing; locate the cost.

## Edges that matter

Cosmology family, authored from the more-specific entity:

- `cosmology/flipSideOf` — Material Plane ↔ Celestia; use only where the stack
  specifies a flip-side pair. Do not invent new pairs.
- `cosmology/inhabits` — a creature, race, or daemon that resides in this plane.
  Author on the inhabitant (target = plane).
- `cosmology/sourceOf` — leyline or magical current that originates here.
- `cosmology/channels` — entity that channels power from this plane.
- `cosmology/attunedTo` — for objects or practitioners keyed to this plane.

No coordinates. A plane has no position on the Material map.

## Length & mechanics

The stack's major planes (Celestia, Malstaris, Astral, Material) warrant multi-section
depth. Minor planes and overlays can be brief — a few tight paragraphs — as long as the
coupling is named. TTRPG rules for travel or survival in the plane go after a
`<!-- mechanics -->` sentinel; lore above it.
