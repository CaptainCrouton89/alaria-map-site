---
name: Faction authoring
description: how to flesh out a faction entity
when:
  entityType: faction
---

# Faction entities

A faction is an organization, tribe, order, cult, or power bloc — any collective that acts as a
unit with its own identity, history, and agenda. Factions are non-geographic: they carry no
coordinates and their `spatial/within` edge points nowhere. Their place in the world is established
through polity edges and prose.

## Recommended shape

Three moves: identity and people (who they are, what holds them together), history (how they came
to be, what they did, what was done to them), and an unresolved contested question that is still
live. The Dead Moon Tribe's "Moonwatcher question" is the model — a genuine dispute between two
accounts, authored into a `rivalOf` edge with a `note`, and staged as a full named section. The open
question is not decorative ambiguity; it is the lever the GM can pull.

## What makes a good faction

A live rivalry, grievance, or unresolved question. Factions earn depth when something about them is
still in motion: a contested origin, a shifting alliance, an incomplete war, a debt the shamans say
is not free. A faction whose history is fully settled and whose relationships are all harmonious has
no story to offer.

The hook must be specific to Alaria's levers — the moon-debt of the Dead Moon Tribe, the
prayer-economics of a sun-cult, the sky-route monopoly a merchant order defends. A generic
organization (a thieves' guild, a mage school with no named costs) needs an Alarian hook before
it belongs in the codex.

## Before you write

Search the corpus for every entity the faction touches: rivals, allies, the settlements it
operates in or contests. Read those entities before writing. A faction associated with a territory
does not necessarily control it; check the region or settlement file first.

## Edges that matter

All in the `polity` family. Nuance lives in `note` and prose, never in a new kind:

- `rivalOf`, `allyOf`, `atWarWith`, `protects` — relational stance toward another faction or polity.
- `memberOf` → a larger organization this faction belongs to.
- `vassalOf`, `tributaryOf` → subordination; use `when` if time-bound.
- `ruledBy` → the person or body that leads this faction (authored on the faction, target = person entity).

Author one direction only. The reverse is computed at build.

## Length & mechanics

No mechanics block. Most faction entries fit in three to four sections, each earning its keep. A
one-line "unresolved question" at the close of the last section is the minimum viable lever; a full
named section staging the dispute — as in `faction-dead-moon-tribe.md` — is stronger.
