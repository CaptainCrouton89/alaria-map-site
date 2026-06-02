---
name: Creature authoring
description: how to flesh out a creature entity
when:
  entityType: creature
---

# Creature entities

A creature is a bestiary entity — a beast, monster, or species. The entry is primarily ecological:
what the creature is, where it lives, what it does to people who encounter it, and what people do
back. Search the corpus before writing; many species already have entries, and some (dragons,
frostwalkers, the leyline-native elementals) have extensive settled lore.

## Recommended shape

A creature usually moves: description and appearance → behavior, ecology, and habitat → danger
and how people deal with it. Individual named creatures (a specific dragon, a singleton monster)
may add character, obsession, and relationships. Species entries (ice wyrms, frostwalkers) carry
behavioral mechanics and encounter context. See `creature-ice-wyrms.md` and `creature-kanzekill.md`
for the developed pattern at species and named-individual scale.

## What makes a good creature

An ecological pressure, a hunted resource, or a creature tied to a specific place's danger. The
entry should hand a GM something to pull on: a predator that constrains a trade route, a harvested
material with a body count, a creature whose behavior changed and no one knows why. A creature that
exists only to be fought is filler. Cosmological grounding earns depth — what planes and strands
are implicated, what it leaves behind when it dies, how it fits the world rather than floating in it.

## Before you write

Search the corpus for the creature and any place it is associated with. For cosmological creatures
(elemental-body animals, leyline-born beasts), consult `docs/worldbuilding/world-systems-invariants.md`
before any claim about planes, strands, or death. Named species with onomastics sheets follow those
sheets exactly — check `docs/worldbuilding/onomastics/` for whether one exists.

## Edges that matter

- `culture/inhabitedBy` is authored on the place, target = this creature; the reverse surfaces here.
  Do not author both ends.
- `culture/originatedIn` when the species has a geographic origin claim.
- `origin/createdBy` for crafted or daemon-spawned beasts (authored on the creature, target = the
  creator or daemon).
- `cosmology/attunedTo` for leyline- or plane-native creatures (authored on the creature, target =
  the magic source or plane).

## Length & mechanics

Length follows story weight. A singleton named creature with a campaign hook earns multi-section
depth. A background species in a regional bestiary earns a tight paragraph or two. About 6 of 181
creature entities carry a `<!-- mechanics -->` block. When present, stat blocks and encounter
mechanics go after the `<!-- mechanics -->` sentinel; lore above it.
