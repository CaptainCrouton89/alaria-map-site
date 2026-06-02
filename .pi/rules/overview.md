---
name: Overview authoring
description: how to flesh out an overview entity
when:
  entityType: overview
---

# Overview entities

An overview is a category landing page — the top of one of Alaria's ten atlas sections.
Its job is to orient a reader arriving from outside and give a one-sentence, deferring
summary of the category's major members before pointing them to the member files.

Sample the real entities before writing:

```
grep -rl "entityType: overview" content/codex/entities/
```

Read `overview-cosmology.md` (rich explanatory opening), `overview-artifacts.md` (short
analytical frame), and `overview-history.md` (narrative spine across eons) as three
different tones at the same scale.

## CRITICAL: the `category:` key

**An overview entity must carry an explicit `category:` frontmatter key.** Without it,
the entity silently resolves to the `geography` category, because `overview` has no
entry in `CATEGORY_BY_TYPE`. The failure is silent — no build error, wrong landing page.

Valid slugs (the complete set from `CATEGORY_META` in `scripts/build-codex.mts`):

| slug | display name |
|------|-------------|
| `geography` | Geography & Places |
| `races` | Races & Peoples |
| `creatures` | Creatures & Beings |
| `factions` | Factions & Organizations |
| `magic` | Magic & Knowledge |
| `deities` | Deities & Religion |
| `cosmology` | Cosmology & the Planes |
| `history` | History & Events |
| `personae` | Dramatis Personae |
| `artifacts` | Artifacts & Relics |

One overview per slug. Check that no overview already claims yours before creating one.

## Recommended shape

Open with the thing that makes this category coherent — the single organizing principle
the reader needs before any member is named. Then work through the major members one
sentence each, deferring to their own files for depth. The Wikipedia-summary model:
topic sentence + member one-liners, not re-stated lore.

An overview earns its length when the category needs an explanatory frame that no member
file could carry alone (`overview-cosmology.md` explains the whole stack; no single plane
entry does that). When the category is a list, keep the frame tight.

## What makes a good overview

A clear answer to "what is this category, and why does it exist as a distinct section?"
given before any member is mentioned. Followed by member one-liners that are genuinely
drawn from the member's own `blurb` or lore — not invented here.

## Banner images

An overview usually carries a `banner:` image. Follow `.claude/rules/image-authoring.md`
exactly: the subject describes this category's visual character in concrete, world-specific
terms, never proper names (the model renders names as text). The caption names the
category explicitly and anchors it in Alarian lore.

## Edges

Overviews are containers by category, not by the spatial graph. Do not author `spatial/within`
or `contains` edges on an overview — containment is for place entities. No coordinates.
No `<!-- mechanics -->` block.
