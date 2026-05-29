# Current Super-Phase — History Generation (the pincer, scaled)

**Status:** ACTIVE (opened 2026-05-28). Supersedes Foundations & Tooling (COMPLETE — see
`archive/phase-foundations.md` and `progress.md`).

**Goal:** Turn the crank. The reference frames are locked (pantheon, scholars, onomastics, eras,
linter) and the pincer is proven on Tarkhon. Now generate the *missing middle* — the legendarium of
events and people that connects the cosmogony to the present map — by running the pincer loop across
regions. History is **built inward from both fixed ends, never invented free-floating**: every
present-day fact retrodicts to a cause; every cosmogonic act drills forward; they collide in the
Seventh Dawn. This is the stage the Foundations gate deliberately held back.

## What we're building (arc.md Layers 2 & 3)

- **Events** — wars, migrations, falls, foundings, plagues, race-origins as `event` entities, wired
  with `caused` / `precededBy` / `participatedIn` / `occurredDuring`. Produced by the pincer, not by quota.
- **People** — founders, dynasts, rulers, legendary dead as `person` entities. A person anchors an
  event AND a place at once — the highest-leverage node type.
- **Gazetteer gestures** — as history touches a stub, give it its one upward gesture (a war, a
  migration, a dead god). Do not flesh what history doesn't touch.

## The repeatable loop (per region — the Tarkhon template)

1. **Reconcile first.** Resolve any duplicate / contradiction in the region's present-state entities
   before authoring history on top (Tarkhon needed the 2455/2575 merge).
2. **Present skeleton.** Wire the present-day edge graph: rulers (`ruledBy`), capitals (`capitalOf`),
   containment (`within`), tributaries, rivalries (`rivalOf`), borders.
3. **Retrodict ~100yr.** Author the events the present facts *demand*; wire `caused` / `precededBy` /
   `occurredDuring` → era; `participatedIn` for the people involved.
4. **Drill deeper + pull cosmogony down.** Connect to leylines, daemons, founding myths so the
   region's deep history meets the ceiling.
5. **Attribute only where genuinely open.** Coherence-first; scholarly attribution is approval-gated
   (`.claude/rules/scholar-attribution.md`). Don't manufacture disputes to dodge reconciliation.
6. **Stay consistent + clean.** Names from the onomastic sheets; build clean; `report lint` at
   `errors:0` after every batch.

## Open questions (resolve in discovery — some need a user gate)

- **Bounding.** "All history" is unbounded and quota-resistant. What bounds THIS super-phase — a
  ranked region set (top polities by weight/zoom)? A region *sequence*? An honest output signal
  (events/people authored as a *symptom* of causes traced, never a target)? → discovery + user gate.
- **Region sequencing / batching.** Which regions next, grouped how, and how many run in parallel
  before contradiction-control breaks down. (Tarkhon is the only one done.)
- **Contradiction-control cadence at scale.** How often to run the linter + a cross-region coherence
  sweep; how to prevent contradictions where regions *share* events, scholars, daemons, or borders.
- **Flip-side coupling.** How much Malstaris / Celestia / Astral exchange to author alongside material
  events (extraction of existing `plane-*.md`, per the locked decision; Labyrinth the lone invention).

## Done when (provisional — discovery tightens this, user ratifies)

- The pincer loop has been run across a **bounded, user-agreed** set of regions beyond Tarkhon.
- Events + people for those regions are authored, edge-wired, scholar-attributed where open, and
  name-consistent with the onomastic sheets.
- The corpus stays linter-clean (`errors:0`) through the expansion; **no cross-region contradictions**.
- Every authored present-day fact in those regions traces to a cause — no free-floating history.

## Guardrails (in force — from arc.md + guidelines.md)

- **Trace causes, not quotas.** Numbers are outputs. Author to a quota → filler.
- **Coherence over output.** A clean, contradiction-free graph is the deliverable, not word count.
- **Depth is referential.** Most stubs stay stubs forever, plus one upward gesture.
- **Names come from the map.** `docs/worldbuilding/onomastics/` is authoritative; never invent free-hand.
- **The divine is temporal.** A `worships` edge implies a daemon alive-to-worship in that period.
- **Flip-side is extraction, not invention** (the Labyrinth excepted).
- **No lazy mysteries.** The GM must be able to know the real cause (recorded in `<!-- author-notes -->`
  when not surfaced); "none know its origins" stays banned.
