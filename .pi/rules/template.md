---
name: Template authoring
description: how to flesh out a template entity
when:
  entityType: template
---

# Template entities

`entityType: template` is a small, closed family — currently four members: Whiteling (halfling),
Whiteling (gnome, `race-gnome-whiteling.md` — the Qovryx), Savant, and Revenant. A template is a
transformation or condition applied atop a base people: undead, savant-born, revenant, or
Deoric-inscribed from birth. It is not a standalone race. Keep `entityType: template`,
`entityCategory: template`, and `tags: ["playable"]` on all four.

## Defer to race.md for the bulk

Origin, vitals, heritage shape, the `<!-- mechanics -->` stat-block expectation, and the onomastics
discipline are all covered by `.pi/rules/race.md`. Read that file first. Everything here is
additive.

## Template-specific additions

A template entry describes the transformation or condition — what changed, when it can happen, and
what the affected individual is now. The mechanical heritage it grants (aspects, traits, stat
adjustments) belongs after `<!-- mechanics -->`. Lore above that sentinel should make clear: what
triggers the condition, what the individual retains from their base people, and what is lost or
inverted. See `race-halfling-whiteling.md` and `race-gnome-whiteling.md` for the fully developed
pattern, and `race-revenant.md` and `race-savant.md` for shorter examples.

## Edges

Templates generally carry `culture/subraceOf` targeting their base race — unless the condition is
cross-race (Savant, Revenant), in which case no subraceOf edge is needed. Author one direction only.
