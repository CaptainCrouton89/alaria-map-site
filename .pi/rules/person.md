---
name: Person authoring
description: how to flesh out a person entity
when:
  entityType: person
---

# Person entities

A person is a named individual — a ruler, founder, mythic figure, or scholar. The
entry is narrative, not a stat block (almost no person entities carry a
`<!-- mechanics -->` block).

## Recommended shape

Usually short and biographical: who they are, what they did, and the consequence they
left behind. A person earns depth only when their story carries real weight (a
founder, a dynasty's origin, a mythic actor).

## What makes a good person

A live consequence the GM can pull on — a contested succession, an unfinished work, a
grievance, a faction they founded, an heir who disputes the record. A fully settled,
consequence-free biography is filler.

## Scholars

The codex has a canonical scholar roster (seven majors plus niche experts). If you are
authoring a scholar entity or citing one, **do not duplicate the roster here** — see
`.claude/rules/scholar-voices.md` for each scholar's voice, bias, era, and the
"when to cite whom" mapping, and `.claude/rules/scholar-attribution.md` for the
blockquote attribution convention and when it is allowed. A scholar person entity is
tagged `scholar`. Coherence is the default; staged scholarly disagreement is
approval-gated, not a way to dodge deciding what is true.

## Before you write

Search the corpus for the person and everything they touched before inventing.
Personal names follow the culture's sheet in `docs/worldbuilding/onomastics/` — match
it exactly, never blend families. Consult `world-systems-invariants.md` before any
claim about cosmology, eras, or the pantheon.

## Edges that matter

- `origin/foundedBy`, `origin/createdBy` are authored on the thing made (target = the
  person); the person surfaces them via the computed reverse.
- `polity/ruledBy`, `history/participatedIn`, `possession/wields` and `forged` as the
  lore needs them. Author one direction only.
