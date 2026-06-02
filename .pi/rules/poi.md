---
name: POI authoring
description: how to flesh out a poi entity
when:
  entityType: poi
---

# POI entities

A POI (point of interest) is a single landmark or feature that is worth pinning on the
map but does not fit another settlement type — a standing-stone formation, a named
creature's territory, a lone temple, a trade outpost, a borderland watch-post. It is
pinned because of one specific reason. The universal place kernel lives in
`docs/worldbuilding/lore-style-guide.md` and `region.md`. This file is the
POI-specific delta.

## Recommended shape

Most POIs get 2-4 sentences and no section headers: what it is, why it is pinned, and
one thing that makes a GM reach for it. The Gathering Stones is the model at the lean
end: what the feature is (standing stones, pre-Ix'Meglyakuk, unreadable carvings) →
how it is used (inter-tribal councils, neutral ground) → the specific thing that makes
it a hook (even Pyaganos respects it and no one knows why). The Church of Nocci adds a
tension line in three sentences: a narrow mandate, a disagreement between the high
priest and the garrison, and the observation that the disagreement is visible.

A POI with genuine depth — a fallen-Sarakiel community, a multi-room dungeon, a
dragon's active territory — can earn section headers, but that is the exception. Most
POIs are waypoints or one-session hooks, not full entries.

## What makes a good POI

One specific reason it is pinned, not a genre of landmark. "A ruin" is not a reason;
"the site where the treaty was signed and the body of the treaty-author is still
interred in the foundation, as the other party well knows" is. The reason should yield
something a GM can do: ask a question, make a deal, trigger a complication, or simply
orient a party who has just crossed into unfamiliar territory.

## Before you write

Read the container region and the other members pinned nearby. Find what is already
there. A POI that duplicates an adjacent entity's function is redundant; if it has a
different function, name that difference exactly. Onomastics: POI names follow the
dominant culture's sheet in `docs/worldbuilding/onomastics/`.

## Edges that matter

- `spatial/within` → the region or settlement this POI belongs to (≤1).
- `polity/ruledBy` → when the POI has a clear political authority.
- `culture/worships` → when the POI is a religious site (author on this entity,
  target = the deity or religion entity).
- `cosmology/attunedTo` → for a POI with a leyline or element association.
- `possession/guards` → when this POI guards something (a relic, a prisoner, a seal).

## Length

Most POIs: 2-4 sentences, no headers. No `<!-- mechanics -->` block — encounter notes
belong in `<!-- author-notes -->`.
