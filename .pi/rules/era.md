---
name: Era authoring
description: how to flesh out an era entity
when:
  entityType: era
---

# Era entities

An era is a named historical period — the narrative spine of the timeline. It gives the calendar
its shape and tells the reader what kind of world existed between two dates. The Lost Ages, the Age
of Craggus, the Seventh Dawn are all eras: each names a span with a distinct character that
separates it from what came before and what came after. An era entry is not a chronicle; it is a
structure that lets other entities know where they live in time.

## Recommended shape

An era opens with a one-paragraph orientation: when it runs, what defines it, and what it inherited
from the era before. It then moves through its sub-periods in chronological order. Each sub-period
gets its own dated header: `### The Laughing Plague: 30,000–28,800 BSD` is the canonical form from
`era-lost-ages.md`. Each section is short — the characterizing fact, the key calamity or shift, the
thing that makes this span distinguishable from the ones beside it.

## What makes a good era

A distinct character, and sub-periods that are each distinguishable from the others. An era whose
sections all read the same has not been structured yet. Each span must answer: what was different
about this time that is not true of the era on either side?

## Scholarly ownership

Each era has an owning major scholar — the voice best positioned to interpret it. Before attributing
any claim to a scholar, consult the "When to Cite Whom" table in `.claude/rules/scholar-voices.md`.
Coherence is still the default; attribution is approval-gated, not a routine move. Read
`.claude/rules/scholar-attribution.md` for the blockquote syntax and what the linter will flag.

## Dating

All dates use `NNN SD` or `NNN BSD`. Read `docs/worldbuilding/systems/calendar.md` before placing
any boundary on the era graph. An era's opening and closing dates must not contradict the dates on
its neighbors; read both neighboring eras before asserting a boundary.

## Before you write

Read the era this one precedes and the era it follows. Read every event that carries an
`occurredDuring` edge pointing here — those events are the sub-periods' raw material. Check
`world-systems-invariants.md` before any cosmological claim; era-defining events often touch locked
cosmology (the God War, the Frost Fall, leyline convergences).

## Edges that matter

- `history/precededBy` → the era immediately before this one. Author on the later era; the reverse is computed.
- `history/within` → a larger eon or super-period that contains this era (e.g., `era-gaeaic-eon` contains `era-lost-ages`). Author on the smaller era.

Eras carry no coordinates. `contains` is computed from members' `within` edges — never author it
on the era itself.

## Length & mechanics

Eras earn multi-section depth; they span centuries or millennia and their sub-periods each deserve a
dated header. No mechanics block.
