# Phase B edge backlog

The non-spatial Phase B entities have **no typed relation edges yet** — they're reachable by search,
category, and the build's name mention-scan, but invisible to graph navigation. (The coordinate-less
polities already got their `within` edges + coordinates; this backlog is about the rest.)

`within` is *spatial* containment and is wrong for these. Author the typed edges below per
`.claude/rules/entity-relations.md`: **one direction only, from the concrete/specific entity,
`target` is always an id.** The reverse (`contains`, `incoming`) is computed at build.

## What to add, by type

| Type (count) | Edge (rel/kind) | Author on | Example |
|---|---|---|---|
| race (73) | `culture/inhabitedBy` (region→race), or `culture/originatedIn` (race→region) | region or race | a wood-elf people `originatedIn` its forest region |
| creature (180) | `culture/inhabitedBy` (habitat→creature) | the habitat region | Elder Wilds `inhabitedBy` Anchor Trees |
| person (37) | `polity/ruledBy` (nation→person), `polity/memberOf` (person→faction), `origin/foundedBy` | nation / person | Enapay `ruledBy` Queen Teyara |
| deity / daemon (13) | `culture/worships` (settlement→deity) | the worshipping place | the seat of the Church of Margia `worships` its god |
| magic / material (25) | `economy/produces` (region→material), `cosmology/sourceOf` | region / magic | Piktiniti Desert `produces` twyl |
| plane (26) | `cosmology/flipSideOf`, `sourceOf`, `inhabits` | plane | Ethereal `flipSideOf` Nethereal |
| artifact (4) | `possession/wields` / `guards` / `forged` (holder→artifact) | person or place | a wielder `wields` a Dragon Blade |
| event (5) | `history/participatedIn` (place→event), `history/occurredDuring` (event→era) | place / event | a battle site `participatedIn` the event |
| faction (25) | `polity/memberOf` / `allyOf` / `rivalOf` / `atWarWith`, `polity/ruledBy` | faction | each Aldriktch member-nation `memberOf` the alliance |

## Spatial edges for the just-pinned polities

- **`polity/capitalOf`** — each polity's capital settlement → its polity (renders a star on the map).
  Known pairs from prose: Lise→Enapay, Vystril→Vystrilik. Find the others by reading each nation's body.
- **`spatial/borders`** — between the new nations and their neighbors (read the map; see `lore-context.md`).

## How

`node scripts/codex.mts edge add --sources <id> --rel <family> --kind <kind> --target <id>`
(read `edge add -h` first; `within` is exclusive — one per entity). This is the country-by-country
lore review pass's job: it needs judgment (which place worships which deity), so it is **authored,
not scripted**. Resolve every target to its numeric/string `id`, never a name.
