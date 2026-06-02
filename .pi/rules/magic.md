---
name: Magic authoring
description: how to flesh out a magic entity
when:
  entityType: magic
---

# Magic entities

A magic entity is a magical source, discipline, or art of Alaria. The system is
locked: read `docs/worldbuilding/systems/magic.md` before writing a word. There are
**four sources and only four** — Deoric (Azus; costs life), Psywinds (Ezz's thought
aspect), Faesong (Melera's emotion aspect of Ezz), and Kethic (the caster's own
emotion through leylines). A magic entity slots into one of these. Do not invent a
fifth source, and do not contradict the Psywinds/Faesong "two faces of one Ezz"
settlement — there is no scholarly ambiguity there to exploit.

## Recommended shape

A magic entity usually moves: mechanism (what it draws on and how a practitioner works
it) → cost and limit (the price paid and the line that cannot be crossed) → planar and
cosmological interaction (which planes, leylines, threads, or daemons it touches). See
`magic-deoric.md` for the fully developed pattern — handmagic mechanism, why it strains
the soul-threads, ritual use, and the Celestia interaction.

## What makes a good magic entity

A real cost and a real limit. "Anything is possible" is banned unless it is bought with
a concrete price (life, thread-strain, blood sacrifice, sanity) and bounded by a stated
impossibility. Tie the working to the planar stack and the cosmology rather than leaving
it free-floating — the cost is usually where the story lever lives.

## Before you write

`docs/worldbuilding/systems/magic.md` first, then `world-systems-invariants.md` for any
planar or cosmological claim. Search the corpus for the source and any named practice
before inventing — much is already authored (planes, threads, Deoric, leylines).

## Edges that matter

The `cosmology` family: `sourceOf`, `channels`, `requires`, `attunedTo`, `flipSideOf`.
Author from the more-specific entity; the reverse is computed at build.

## Length & mechanics

Magic entities earn multi-section depth. TTRPG rules — spell mechanics, costs in
hitpoints, ritual procedures — go after a `<!-- mechanics -->` sentinel, which splits
them into the compiled `mechanics` field. Lore above the sentinel, rules below.
