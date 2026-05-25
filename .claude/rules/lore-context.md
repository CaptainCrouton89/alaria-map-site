---
paths:
  - "content/codex/entities/**/*.md"
---

# Writing in context (anti-contradiction)

Before asserting any fact about a place, read its neighborhood and stay consistent with it:

- **container and members** (`spatial/within` edges, both directions) — political control, scale, and demographics must agree across levels.
- **bordering entities** (`spatial/borders` edges) — shared borders, rivers, ranges, and cross-border trade must match on both sides. Borders are the retrieval trigger: load every bordering entity before writing.
- **spatial neighbors** (nearest pins by coordinate) — proximity claims ("just south of", "X miles from") must match the actual coordinates and the map. Verify against the map before asserting distance or direction.
- **entities named in `relations`** — rulers, rivals, trade partners, allies.

If you find a conflict with established canon, surface it — never silently overwrite. (Canon world-systems live in the `Alaria Worldbuilder` output-style; consult, don't restate.)

## Reading membership & borders off the map

Containment and adjacency are decided by LOOKING at the map (`alaria-codex map shot`), not by distance alone. Signal priority:

1. **Drawn national borders** — dark-red/maroon squiggly lines (color ~`#7A492F`; what sets them apart from terrain brown is *saturation*, not hue). When present they are authoritative — trust them over names or the big letterspaced region labels. They are NOT always drawn. Renders are saturated by default so the line, plus rivers/roads/capital stars, are legible; use a tight radius (~6-10) since the line is thin.
2. **Baked map symbols** — the tiles carry their own cartography: serif place names, a **red star = capital**, red triangles = peaks, dashed brown = roads, blue/green = rivers.
3. **`entityType`** — capitals and city-states are ALWAYS `entityType: city`; regular settlements are `entityType: town`. So a nation's capital is the `city` among its members (the red star on the map disambiguates the capital if several cities sit in one nation, the rest being city-states). Use the language family of place names (e.g. Nordic dwarf towns vs English human towns) as a secondary membership cue.

Containment is exclusive (≤1 `within`); if a pin already belongs to a neighbor, `alaria-codex edge add` will refuse the second `within` as a `within-conflict` rather than silently double-assign.

## Summary style (Wikipedia model)

Container and member must not duplicate prose:

- A **container** gives each notable member a 1-2 sentence summary, then relies on the member file for detail. Reuse the member's `blurb` as that sentence when it fits.
- A **member** opens in its own context and does not re-explain its container — refer upward instead.

This is the primary defense against the same lore being written many times across one region.
