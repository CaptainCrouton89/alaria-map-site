---
name: Ruins authoring
description: how to flesh out a ruins entity
when:
  entityType: ruins
---

# Ruins entities

A ruins is a place that was once something else — a fortress, a city, a ritual site —
and is now collapsed, abandoned, or occupied by something new. The universal place
kernel lives in `docs/worldbuilding/lore-style-guide.md` and `region.md`. This file is
the ruins-specific delta.

## Recommended shape

A ruins usually moves through three beats: what it was → why it fell → what remains
and what is still dangerous there. The "what it was" beat is an orientation clause, not
a full history — defer to the origin entity if one exists. "Why it fell" is where most
of the lore lives; this is the beat that distinguishes one ruin from another.
"What remains" is for the GM: what survives, what hunts the site, what a party will
find or face.

For a tomb or monument — a structure that was always a resting-place rather than a
functioning settlement — the shape is simpler: who or what is interred, what protects
the site, what is being kept in or kept out.

## What makes a good ruins

The cause of the fall, rendered specific. Waterdark is the model: a named founder, a
named event (the Severing), a stated current purpose (keeping watch on the dark leyline
so the souring cannot start again), and a GM-true answer that is more complicated than
the world-known one. The "what remains" beat should yield a decision — sealed tunnels
the garrison prefers not to investigate, an order that still occupies the ruin and has
never fully explained why.

## Mysteries must have answers

The style guide's rule bites hardest here. "None know its origin," "its purpose remains
unclear," and "what happened here is lost to time" are banned in all forms. The real
cause must exist in the file: either in the lore body (preferred) or in
`<!-- author-notes -->` when the cause is deliberately withheld in-text.
`build-codex.mts` strips `<!-- author-notes -->` from all public output — it is the
right place for GM-true answers the player is not meant to see.

## The `ruinsOf` edge

When the ruin was once a known, named entity, author `origin/ruinsOf` on the ruins
entity (target = the original entity's id). If no origin entity exists yet, the "what
it was" beat in the lore body is the fallback — but creating an origin entity is usually
better.

## Before you write

Read the container region and the event or person that caused the fall, if they exist
as entities. Run `alaria-codex map shot` to see what surrounds the site. Onomastics:
ruins names often follow the culture that built the original structure, not the current
dominant culture — check both sheets in `docs/worldbuilding/onomastics/`.

## Edges that matter

- `spatial/within` → the region or landmass that contains this ruin (≤1).
- `origin/ruinsOf` → the entity this ruin once was, if it exists.
- `origin/foundedBy` → the builder, authored on this entity (target = a person or
  faction).
- `history/participatedIn` → the event that caused the fall, if it exists as an event
  entity.

## Length

Ruins with story weight warrant multi-section depth. A simple tomb stub earns 2-3
sentences. No `<!-- mechanics -->` block — encounter notes belong in
`<!-- author-notes -->`.
