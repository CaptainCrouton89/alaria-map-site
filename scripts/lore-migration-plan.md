# Lore migration plan: pins + wiki prose → flat codex entities (in-repo)

The Alaria wiki is moving INTO this repo. One-shot, reversible migration that converts today's
tangled state (pins keyed to compiled headers; prose scattered across the wiki's category trees)
into one flat file per entity under `content/codex/entities/`. Those files become the single source for
BOTH the map and the `/codex` wiki; `data/locations.json` and the compiled codex JSON are generated.

## Hard invariants

1. **IDs never change.** An entity's `id` (string) equals its existing pin/codex id. Every id in
   `pinned.json` must map to exactly one entity file with identical `coordinates`. This is the
   pin-survival guarantee from the `pinning` skill — verify it programmatically (Phase 7), not by eye.
2. **Reversible.** Back up `data/` and tag both repos before writing anything.

## Two tiers of entity

Same frontmatter schema (`.claude/rules/entity-files.md`) for both; they differ only by `coordinates`.

- **Geographic (pinnable)** — `entityType` in {region, city, town, fortress, ruins, wilderness,
  water, poi}; HAS `coordinates`. Scope = `keys(pinned.json)` ∪ `manual-pins.json` ids (~1,759 + 410).
  Renders on the map AND in the codex. **Phase A.**
- **Non-geographic (codex-only)** — deities, factions, magic, planes, events, eras, people,
  artifacts, races, creatures. NO `coordinates`. Sourced from the wiki's non-atlas trees
  (cosmology_and_religion, magic_and_knowledge, history_and_lore, races, bestiary, the non-spatial
  parts of nations_and_powers). Codex only. **Phase B** (after the map tier lands).

## Inputs

| Source | Provides |
|---|---|
| `data/work-queue.json` | id, name, headerText, sourceFile, lineNumber, `parentEntryId`, suggestedType |
| `data/pinned.json` | **authoritative** coordinates, zoomLevel, type per id |
| `data/manual-pins.json` | free-form pins (`manual-*` ids): name, type, coords, zoom |
| `data/merge-groups.json`, `dedupe-decisions.json` | duplicate → primary id collapses |
| the wiki trees (moved in, or read from `../heart-rush-tools/world-wikis/alaria/**` during migration) | prose bodies |

## Output

- `content/codex/entities/<slug>.md` — one per entity. Filename = slug of `name`; on collision append
  `-<id>`. Canonical key is always `id` in frontmatter, not the filename.
- `scripts/build-codex.mts` — parses `content/codex/entities/**` and emits:
  - `data/locations.json` (Location[] — only entities with `coordinates`), replacing
    `extract-locations.ts` + `finalize-locations.ts`.
  - the compiled codex JSON (CodexEntry[] / category tree) the `/codex` pages read.
- Both outputs land wherever the app fetches them today (the map does `fetch('/locations.json')`).

## Codex model + UI (the existing codex is stub-only — rebuild to this model)

- Redefine `CodexEntry` so an entity's frontmatter maps onto it: `category`/`section` DERIVED from
  `entityType` (via a mapping table), `relatedIds` DERIVED from `relations` targets,
  `mapLocationId` = the entity's own id when it has `coordinates`, `parentLocationId` = `parent`.
- Keep the existing render layer (`weight` → Legendary/Major/Standard/Minor/FootnoteEntry;
  `atmosphere` → tint; breadcrumb-journey). These are authored fields on the entity.
- Replace `SAMPLE_*` hardcoded data in `src/app/codex/**` with reads of the compiled codex JSON.

## Phases

1. **Backup.** Copy `data/*.json` to `data/backups/pre-entity-migration/`; `git tag` both repos.
2. **Build geo entity set.** Union of pinned + manual ids.
3. **Apply dedupe (idempotent).** Per merge group: `primaryId` is the entity; members' names →
   primary's `aliases`; primary's coords win; union relations. Log coordinate conflicts. (Largely
   done already — run anyway.)
4. **Resolve each geo entity:**
   - `entityType` ← `pinned[id].type`; `coordinates`/`zoomLevel` ← `pinned[id]`.
   - `parent` ← walk `work-queue` `parentEntryId` upward, skipping ancestors NOT in the entity set
     (structural headers: "Settlements", "Geography", "What Will Go Wrong"). Land on nearest real
     ancestor; else null.
   - **body** ← prose for this header from the best source (precedence below), excluding nested
     child-entity sections (own files). Keep structural sub-section prose ("Climate", etc.).
   - `blurb` ← first sentence of body, ≤25 words; empty if body is `TODO`/missing.
   - `sources` ← every matched source path#anchor.
5. **Resolve each manual entity:** id, name, type, coords, zoom from `manual-pins.json`;
   `parent: null`; empty body/blurb; `sources: []`.
6. **Write entity files.**
7. **Build + verify (the gate):** run `build-codex.mts`; assert (a) every `pinned.json` id has a
   file, (b) coordinates byte-identical to `pinned.json`, (c) `count(geo entities) ==
   count(pinned ∪ manual)` after dedupe, (d) every `parent` resolves. Fail loud; do not proceed if
   (a) or (b) fail.
8. **Cutover:** wire map + `/codex` pages to the generated outputs. Retire `extract`/`finalize`.
9. **Phase B (later):** import non-geographic wiki content as coordinate-less entities, same schema.

## Prose precedence (Phase 4 body harvest)

For an entity `name`, search candidate sources in priority order; pick the **longest non-`TODO`**
block; record all matches in `sources`:
1. `nations_and_powers/**` (richest political prose)
2. `atlas_of_alaria/**` (geography)
3. other category trees (cosmology, history, magic, races, bestiary)
4. `all_sections_formatted/**` (compiled — lowest priority; duplicates the above)

Header→body extraction: from the header line to the next header of equal-or-higher level, minus
nested child-entity headers (excluded — own files). The parent's *summary* of each excluded child is
written later by the lore pass (per `lore-context.md` summary style), not synthesized here.

## Known gaps to fill in later passes (not in migration)

- **`capitalOf` edges** can't be auto-derived from pin type — a settlement's `polity/capitalOf` edge
  to its nation is added during the "capitals" generation pass. (Map legend: a star = capital.)
- **`borders` and all `relations`** start empty — migration establishes nodes + containment only.
  Edges get populated by lore passes / a map-vision pass (Gemini reads neighboring pins).
- **`parent` for manual pins** is unknown (free-form placement) — null now; infer by spatial
  containment in a later pass.
- **`weight` / `atmosphere`** — unset by migration; authored during lore passes.

## Generation order (subsequent lore passes, not migration)

regions → wilderness → capitals → waters → towns → POIs → ruins. Each pass fills body + blurb + edges
for its type, loading parent + children + bordering entities as context first.
