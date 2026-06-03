---
paths:
  - "content/codex/entities/**/*.md"
  - "scripts/codex.mts"
  - "scripts/build-codex.mts"
---

# Using the alaria-codex CLI

Operational rules for driving `scripts/codex.mts` (`alaria-codex`). For *what* to author, see
`entity-files.md` / `entity-relations.md`; this file is about *how to query and not get lost*.

## Read the leaf's `-h` before any mutating call

`edge add`/`edge rm`/`review`/`build` change the world; their `-h` carries constraints you will
otherwise violate (within is exclusive, capitals are `capitalOf`, author one direction only). Read-only
leaves (`entity show`, `map *`, `report *`) are exempt — invoke them directly. The carve-out is the
point: the rule only earns its keep on the leaves that mutate, so don't let it slow down reads.

## Run the canon-linter after any graph mutation

`node scripts/codex.mts report lint` is the graph-validity gate. Run it after `edge add`/`edge rm`/
entity create/delete and after `build` — it surfaces what `build` silently skips (dangling targets),
plus capitalOf-non-polity, both-ends-directed (one-direction-only violations), and orphan sweeps. It
exits 1 on any error-severity finding, so it works as a CI/agent gate; read its `-h` for the full
check list and severity model.

**Known baseline = `errors:0`** (updated 2026-05-29 — added the `bordersWithinSameTarget` error check;
all 8 self-declared borders+within contradictions were adjudicated and fixed, so it sits at 0). "Clean"
means *no new errors beyond zero* — if `errors` exceeds 0, you broke something this session. Warnings
(~350, mostly both-ends-undirected borders and geographic orphans) are tracked, not gating. The
`containerBordersChild` check (container borders its own contained child) was driven to 0 in the
2026-05-29 Cleanup phase — 11 spurious `borders` edges dropped, 6 `within` edges repointed to the
correct container; if it rises above 0 again, a new edge re-introduced the contradiction.

**Expand this linter over time.** It is meant to grow: when you notice a new graph invariant that
should hold corpus-wide (a new edge-kind constraint, a containment rule, a date-ordering check once a
structured era schema exists — see the `-h` Limitations note), add it as a new check in the `lint`
handler in `scripts/codex.mts` with the right severity (error gates, warning informs). Update the
known-baseline count here if you legitimately fix or add an error-severity check.

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
2. `map near --id <id>` — neighbors with distance (miles) + bearing.
3. `map dist --from <id> --to <id>` — exact straight-line miles to a *specific* place (one-to-many with
   repeated `--to`). Use this whenever you're about to name a number, not just the ranked neighbor list.
4. `map shot --id <id>` — wide (`--radius ~35`) for context; tight (`--radius 6-10`, default
   `--enhance saturate`) to actually read the thin national border line.
5. Reconcile the renders against the body's geography claims AND the container/sibling edges before
   asserting anything.

**Settlement proximity ≠ containment.** The nearest pins are often across water in a different
region — look at the landmass on the map, not the distance ranking.

## Measure distance before any claim that depends on it

Map scale is fixed — **5 miles per hex (20 pin units)** — and coordinates already live in that one grid,
so distance is *zoom-independent*: `map near` and `map dist` return **miles** you never adjust for tile
zoom. Because the number is cheap and exact, eyeballing it is never acceptable.

Run `map dist --from <id> --to <id>` (or read `miles` off `map near`) **before** you write any sentence
whose truth depends on how far apart two places are. This covers more than "X is N miles from Y":

- **Proximity / reachability** — "a day's ride," "a hard week's march," "within raiding range," "too far
  to resupply," "neighboring," "remote." A mounted day is ~30–40 mi, a foot-march day ~15–20 mi — convert
  the measured miles, don't assert the adjective blind.
- **People *from* a place** — "merchants from the coast," "refugees who fled north to Y," "a pilgrimage
  to Z": measure origin→destination first; a plausible-sounding journey is often implausibly long.
- **Spatial edges** — `borders`, `separatedBy`, `liesOn`, `controlsPassage`, `skyRouteTo`, `tradesWith`:
  bordering pins should sit within a few miles of each other; a trade or sky route spanning hundreds of
  miles needs that distance to read as deliberate, not sloppy.
- **Polity reach** — a capital governing, or an empire taxing, a place a hundred miles past its nearest
  neighbor is a claim the map may refuse. Check it.

Straight-line miles ignore terrain, water, and roads, so treat the figure as a *lower bound* on travel —
pair it with `map shot` when water or mountains sit between the two pins.

## Water-body containment lives in the per-type water rule

The "water bodies are siblings, not containers" authoring rule — where an island, bay, or coastal
ruin's `within` should point — now loads from `.pi/rules/water.md` when you read a `water` entity.

## Orphans are invisible to containment navigation

An entity can have zero `relations` and thus no `within` edge; nothing surfaces it when you walk
containment. Sweep for them explicitly:

```bash
node scripts/codex.mts report list --within false
```
