---
name: Event authoring
description: how to flesh out an event entity
when:
  entityType: event
---

# Event entities

An event is a discrete historical happening — a battle, a treaty, a catastrophe, a founding,
a working gone wrong. The entry records what occurred, when, and what scar it left that is still
live. Events that left nothing actionable do not belong in the codex.

## Recommended shape

Usually short. Three things: what happened, when (in the blurb or opening line), and the lasting
consequence a GM can pull on. `event-torn-hour.md` is the model: a specific mechanism, a specific
wound in the terrain, a specific way the wound takes a person. `event-enymu-subjugation.md` is the
model for a political event: a concrete grievance that has compounded across four centuries. The
date goes in the blurb. The consequence goes in the body, stated plainly.

## What makes a good event

A consequence still in motion. Not "Vardenmoor was devastated" but the displaced families,
the absentee titles, the Conclave vote not yet taken. An event whose aftermath was fully resolved
and left no living claimant, no live dispute, no terrain scar is filler. Ask: what does a GM
do with this? If the answer is nothing, the event is not ready to publish.

## Dating

Dates follow `NNN SD` or `NNN BSD`. Read `docs/worldbuilding/systems/calendar.md` before placing
any date on the timeline. The blurb carries the date; the body can state it with more precision
without repeating the blurb wholesale.

## Contested causes

Coherence first. Pick a cause and assert it directly. If two accounts appear to contradict, resolve
them — rewrite the world so it coheres. Staged scholarly disagreement is an approval-gated authoring
tool, not a way to dodge deciding what actually happened. Before reaching for "scholars disagree,"
read `.claude/rules/scholar-attribution.md` and propose it explicitly.

## Before you write

Search the corpus for every named entity the event touches. Read the era it falls in, the factions
and people involved, the places it scarred. Check `docs/worldbuilding/systems/calendar.md` for era
date ranges; verify no contradiction with locked cosmology in `world-systems-invariants.md`.

## Edges that matter

- `history/occurredDuring` → the era this event falls within. Author on the event; the reverse is computed.
- `history/caused` → an entity this event directly produced (a ruin, a faction, a successor event).
- `history/precededBy` → the event that set up this one. Author on the later event.

## Length & mechanics

No mechanics block. Most events fit in one to three paragraphs. A multi-century collapse may earn
sub-headings, but each section must add to the live consequence, not pad the narrative.
