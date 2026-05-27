---
paths:
  - "content/codex/entities/**/*.md"
---

# Entity files

Each world entity — place, deity, faction, event, artifact, anything — is ONE markdown file in the
flat `content/codex/entities/` directory. The filesystem carries no hierarchy; containment and
relationships live in frontmatter. These files are the single source for BOTH the map and `/codex`.

## Required frontmatter

```yaml
id: "1742"               # string; equals the existing pin/codex id. NEVER change it — pins key on it.
name: Hillat Abu Hizam
entityType: city         # places: region|city|town|fortress|ruins|wilderness|water|poi
                         # non-places: nation|faction|daemon|plane|magic|event|era|person|artifact|race|creature
blurb: "≤25 words, plain text. The map-hover line and the codex one-liner."
```

Containment is NOT a frontmatter field — it is a `spatial/within` edge in `relations` (town → its
nation/region). The reverse (`contains`) is derived at build. See `entity-relations.md`.

## Pinnable (geographic) entities also require

```yaml
coordinates: [4821, 3310]   # CRS.Simple pixel space. Presence here = it renders on the map.
zoomLevel: 4                # 1 (continent) … 5 (building)
```

A capital is a `polity/capitalOf` relation on the settlement (target = its nation) — see `entity-relations.md`.

## Optional (authored)

- `weight: legendary|major|standard|minor|footnote` — codex prominence; selects the render style.
- `atmosphere: civilization|sacred|cursed|ancient|dangerous|trade|nature|water` — codex tint.
- `aliases: []` · `tags: []` · `relations: []` (see `entity-relations.md`) · `sources: []` (provenance)

## Body

The full markdown article. `blurb` is the summary; the body is the entry. Don't restate a member's
lore in its container (see `docs/worldbuilding/lore-style-guide.md` §Process).

The build DERIVES codex `category`/`section` (from `entityType`), `relatedIds` and containment
(`contains`/`partOf`, from `within` edges in `relations`), and map links (from `coordinates`).
`data/locations.json` and the compiled codex JSON are generated FROM these files — never hand-edit
the outputs.
