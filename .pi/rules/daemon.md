---
name: Daemon authoring
description: how to flesh out a daemon entity
when:
  entityType: daemon
---

# Daemon entities

A daemon is a god or spirit dwelling in Celestia, sustained by the life-tithe of prayer. It is
a mortal who died carrying an Ezz-spirit and a generative command of Deoric — not a titan, not a
dragon, not a Malstaris entity. Three gates are independently required: substrate (Ezz-spirit),
knowledge (grammar-internalized Deoric held in life), and worship (reserve R above R_min). Read
`docs/worldbuilding/systems/daemon-economics.md` and `docs/worldbuilding/world-systems-invariants.md`
before writing any daemon; read `docs/worldbuilding/systems/first-death.md` for how the spirit-strand
anchors the daemon in Celestia.

## The §11 caveat

`cosmology-decisions.md §11` supersedes the base model in §9 on daemon mastery of Deoric.
Elder daemons hold structural grammar the living tradition has lost because of two things: the
pre-burning Vyanoweir corpus (a full reconstructed grammar, now gone, that pre-death scholars
internalized) and the depth of pre-mortem study. Post-mortem accumulation is background entropy —
slow, incidental, not a curriculum. The oldest daemon ascended roughly 200,000 years ago; that is
a time-depth, not a 200ky span of study. Do not write that daemons mastered Deoric "over eons
after death."

## Recommended shape

A daemon usually moves: overview (domain, era of ascension, living cohort or dead) → history and
fall, when the fall matters → present worship and its consequence in the mortal world. Domain and
cohort belong near the top. See `daemon-craggus.md` and `daemon-borraath.md` for developed examples
at legendary and minor weight. Also grep for other daemons — 140+ entities exist, including living
pantheon members, dead Golden Age gods, and daemon-economy edge cases.

## What makes a good daemon

A daemon's prayer-economy leaves a live lever in the mortal world. Worship drains lives. A
shrinking base means smaller miracles, which means fewer worshippers, which is a death spiral the
GM can pull on. Good daemon entries carry one of: a rivalry over overlapping domains (with explicit
worship-base consequence), a fall that left a gap or a grievance still active, or a present cult
whose sacrifice practices have a body count and a perpetrator. A daemon that is simply powerful and
settled is filler.

## Scholar attribution

Contested cosmology — daemon-substrate debates, the knowledge gate, which cohort a disputed ascension
falls into — can warrant scholar attribution. When approved, see `.claude/rules/scholar-attribution.md`
for syntax and `.claude/rules/scholar-voices.md` for the roster and voice/bias mapping. Do not
duplicate the roster here, and do not reach for scholarly disagreement to avoid resolving a
contradiction. Coherence is the default; attribution is approval-gated.

## Before you write

`docs/worldbuilding/systems/daemon-economics.md` (the full model with Calibration-A numbers),
`docs/worldbuilding/world-systems-invariants.md` (Daemons, Daemon-substrate-gate, Daemon-knowledge-gate,
Daemon-knowledge-hoarding, and First-daemon-era rows). Search the corpus before authoring a new
ascension claim — cohort, era, and domain overlaps with existing daemons are consequential.

## Edges that matter

`cosmology` family: `sourceOf` (authored on the daemon, target = magic source it draws from),
`channels` (a domain it routes through another entity), `inhabits` (authored on the daemon,
target = the plane — usually Celestia), `flipSideOf` (paired daemon relationships where they apply).
The `culture/worships` edge is authored downstream on the worshipper, not on the daemon.

## Length & mechanics

Daemon entries earn multi-section depth when the daemon's story carries real weight. No coordinates.
Normally no `<!-- mechanics -->` block — daemon economics (Calibration-A HP figures, reserve math)
go in `<!-- author-notes -->` rather than the lore body or a mechanics block; use prayer-days and
congregation sizes in player-facing prose.
