# CLAUDE.md

## Constraints

- **Leaflet coordinate system**: The map uses `L.CRS.Simple` with pixel coordinates. Y-axis is flipped when placing markers — Leaflet has bottom-left origin, images have top-left. Always invert Y when converting image pixel coords to `L.LatLng`.

- **Codex generator**: `scripts/build-codex.mts` is the active generator — run it with `node scripts/build-codex.mts` (or `alaria-codex build`). Scripts are `.mts` and run on Node's native TypeScript type-stripping — no tsx. `finalize-locations.ts` is still listed in `package.json` scripts but is superseded; do not use it.

- **Codex CLI** (`alaria-codex`): `edge add --kind within` silently skips (logs `within-conflict`) if a `within` edge already exists — `edge rm` the old one first.

- **Entity files are canonical**: never hand-edit the 5 generated outputs — `data/locations.json`, `public/locations.json`, `public/codex-edges.json`, `data/codex/compiled.json`, `public/codex-search.json` — edit the entity file in `content/codex/entities/` and re-run the generator.

- **Containment uses edges, not frontmatter**: the `parent` frontmatter field is retired and silently ignored — use `edge add --kind within` instead.

- **Entity `id` immutable**: an entity's `id` must match its original pin id in `data/pinned.json` — reassigning it silently breaks the map.
