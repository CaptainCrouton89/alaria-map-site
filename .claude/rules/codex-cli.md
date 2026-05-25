# Using the alaria-codex CLI

Operational rules for driving `scripts/codex.mts` (`alaria-codex`). For *what* to author, see
`entity-files.md` / `entity-relations.md`; this file is about *how to query and not get lost*.

## Read the leaf's `-h` before any mutating call

`edge add`/`edge rm`/`review`/`build` change the world; their `-h` carries constraints you will
otherwise violate (within is exclusive, capitals are `capitalOf`, author one direction only). Read-only
leaves (`entity show`, `map *`, `report *`) are exempt — invoke them directly. The carve-out is the
point: the rule only earns its keep on the leaves that mutate, so don't let it slow down reads.

## Resolve entities by numeric `id`, never the filename slug

Every command keys on the frontmatter `id` — the pin id, e.g. `"1789"` — NOT the filename
(`entity show --id serisa-s-palace` returns `not_found`). This now also states itself in root `-h`.
Name → id:

```bash
grep -rl "Serisa" content/codex/entities/   # find the file
# then read its frontmatter `id:` and use that for every CLI call
```

## "Where is X?" is a fixed sequence

1. Resolve the `id` (above).
2. `map near --id <id>` — neighbors with distance + bearing.
3. `map shot --id <id>` — wide (`--radius ~35`) for context; tight (`--radius 6-10`, default
   `--enhance saturate`) to actually read the thin national border line.
4. Reconcile the renders against the body's geography claims AND the container/sibling edges before
   asserting anything.

**Settlement proximity ≠ containment.** The nearest pins are often across water in a different
region — look at the landmass on the map, not the distance ranking.

## Water bodies are siblings, not containers

A bay, sound, river, and peninsula are co-equal children of the parent region (all `within` the same
region). An island or coastal ruin's `within` points to its **landmass** (the peninsula/region) or the
top-level region — **never** to the water body it sits in.

## Orphans are invisible to containment navigation

An entity can have zero `relations` and thus no `within` edge; nothing surfaces it when you walk
containment. Sweep for them explicitly:

```bash
node scripts/codex.mts report list --within false
```
