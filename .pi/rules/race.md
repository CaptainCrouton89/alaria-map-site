---
name: Race authoring
description: how to flesh out a race entity
when:
  entityType: race
---

# Race entities

A race is a people of Alaria — playable, with heritages and mechanical traits. Origin
is locked: read `docs/worldbuilding/systems/races.md` before writing. Interbreeding
follows origin-substance, not appearance — Gaea-flesh (humans, beastmen, giants,
trolls) interbreed; druid-crafted elves cannot cross with flesh (no half-elves);
daemon-descended lines follow their own rules; the sacred three are Wolf, Lion, and
Dragon. A race entity must obey the origin-substance it belongs to.

## Recommended shape

A race usually moves: Origin (origin-substance and creation) → Vitals (lifespan, size,
physiology) → Heritages, with one section per subrace carrying that heritage's
distinctive trait. See `race-dwarf.md` and `race-elf.md` for the developed pattern.

## Subraces

A subrace is its **own** entity with `entityType: race`, not a section buried in the
broad race and not a place (no coordinates). It declares `culture/subraceOf` targeting
the broad race (authored on the subrace, e.g. `race-dwarf-drasnian` → `race-dwarf`).
The broad race surfaces its subraces via the computed reverse — never author both ends.

## Naming

Match the race's sheet in `docs/worldbuilding/onomastics/` **exactly**. Do not blend
families, and do not extrapolate beyond what the sheet supports. For sheets marked
"sparse sample" or a ratified starter pool (see `.claude/rules/onomastics.md`), flag
derived names as provisional until the pool grows.

## Before you write

`docs/worldbuilding/systems/races.md`, then `world-systems-invariants.md` for any
cosmological origin claim. Search the corpus for the people and its subraces before
inventing — many heritages are already authored.

## Edges that matter

- `culture/subraceOf` → the broad race (on the subrace).
- `culture/inhabitedBy` is authored on the place, target = this race (the reverse
  surfaces here).
- `culture/worships`, `culture/speaks`, `culture/originatedIn` as the lore needs them.

## Length & mechanics

Race entities carry weight and normally include a `<!-- mechanics -->` block — the
per-heritage stat blocks and traits go after that sentinel; lore above it.
