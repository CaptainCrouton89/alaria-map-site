---
name: Artifact authoring
description: how to flesh out an artifact entity
when:
  entityType: artifact
---

# Artifact entities

An artifact is a unique named object that does something no ordinary object should —
because power has been bound into it and stays there. The category spans titan-forged
engines, leyline-shaped structures, and objects of pure craft that somehow crossed the
same threshold.

Sample the real entities before inventing:

```
grep -rl "entityType: artifact" content/codex/entities/
```

Read `artifact-the-labyrinth.md` (a leyline structure, not a made object),
`artifact-the-golden-enchanting-table.md` (titan-wrought, soul-bound), and
`artifact-the-four-dragon-blades.md` (pure craft, no magic).

## Recommended shape

What it is and what binds the power — or what it is made of, if no binding is involved.
Then what it does, and the cost or limit. Then where it is and who holds or guards it.

Most artifact entries are short. `weight: minor` is the common tag. If the entry runs
long, earn each section; an artifact that is just "very powerful" without a holder,
location, or open consequence is filler.

## What makes a good artifact

A provenance trail and an open thread. "Made by one hand, taken by another, used by a
third who never asked the first two how it worked" is the standard pattern in the corpus.
The most useful artifact entry names the present holder, the current location, and one
thing about the object that has not yet been resolved — who the bound soul was, whether
the anchor was ever recovered, who the next inheritor will be. A fully settled, inert
object is the same failure as a consequence-free biography.

## Cosmological claims

Any claim about what powers the object — Deoric, soul-binding, leyline coupling, Ezz
saturation — must reconcile with `docs/worldbuilding/world-systems-invariants.md`.
There are four magic sources and only four; do not invent a fifth mode. The Ezzal
Artifacts (Ezz-soaked from the Rift) are a material property, not a separate system.

## Edges that matter

Possession edges are authored on the holder, not the artifact:

- `possession/wields` — on the current wielder (target = artifact)
- `possession/forged` — on the smith or maker (target = artifact)
- `possession/guards` — on a guardian or institution (target = artifact)
- `possession/imprisons` — on the entity bound inside (target = artifact); or on
  a structure that contains a bound entity
- `possession/boundTo` — on a spirit or entity bound to the artifact (target = artifact)

The artifact surfaces these via computed reverse; you do not author them on the artifact.
The artifact itself carries:

- `spatial/within` — its location (≤1)
- `origin/createdBy` — authored on the artifact (target = maker)
- `cosmology/attunedTo` — a leyline, plane, or magical source it is keyed to

No coordinates. Artifacts have locations, not map pins.

## Length & mechanics

Usually one to three paragraphs. TTRPG rules — what it does mechanically, charges,
attunement conditions — go after a `<!-- mechanics -->` sentinel. Lore above.
Use `<!-- author-notes -->` to flag open threads that are deliberately deferred.
