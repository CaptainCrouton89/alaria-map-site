# Worldbuilding Guidelines

The operational rules for authoring Alaria — the imperatives, stripped of rationale. For the *why* behind them (the contradiction-control thesis, the pincer, the scholar frame) see `high-level.md`. For CLI mechanics and per-file conventions see `.claude/rules/` (`entity-files.md`, `entity-relations.md`, `lore-authoring.md`, `codex-cli.md`; style detail in `docs/worldbuilding/lore-style-guide.md`).

## Coherence over output

- **The edge graph is canon.** Author relationships as edges, not just prose — edges are machine-checkable; prose isn't. A fact that matters should be expressible as an edge.
- Run the linter before considering a batch done. A clean graph is the deliverable, not word count.

## Build history inward, from both fixed ends

- **Retrodict from the present.** Don't invent free-floating history. Start from a present-day fact and ask *what caused this?* — then ask it again of the cause.
- **Pull the myth forward** to meet it. New history must connect to something already fixed (a present fact above, a cosmogonic act below). History that touches neither end is suspect.
- **Trace causes; don't chase quotas.** Targets like "1,000 wars / 5,000 people" are *outputs*, not goals. Hit the rule — every border, ruin, grudge, and dead god traces to a cause — and the numbers arrive on their own. Author to a quota and you get filler.

## Depth is referential

- Most places stay `footnote`/`minor` *forever*. That's correct. Reserve depth for nodes history and people actually touch.
- **Every stub gets one gesture upward** — a war, a migration, a dead god, a person. A sentence of real connection reads as depth far more cheaply than a paragraph of description.
- Match length to `weight`/`zoomLevel`. Don't force an epic onto a hamlet.

## Attribute contradictions; don't always resolve them

- When two facts conflict and both are interesting, **attribute them to rival scholars** rather than paying to reconcile. Disagreement is texture, not a bug. (Syntax and roster: `.claude/rules/scholar-attribution.md`)
- Established canon (World Timeline / cosmogony / magic systems) is the exception — surface conflicts with it; don't silently overwrite (see `docs/worldbuilding/lore-style-guide.md` §Process).
- "None know its origins" stays banned: *you* know the answer; the in-world scholar may not. The gap is the scholar's, never the world's.

## The divine is temporal

- Always place a god in time: old/dead, current, or rising. A `worships` edge implies a daemon that was alive-to-worship in that period.

## The flip-side is coupled

- When authoring material history, ask what it sent across (soul→Astral, shadow→Malstaris); when authoring shadow/Celestia history, ask what material event fed it.

## Names come from the map

- The map is frozen and its names are ground truth. New names are generated to *match* the existing per-race/region style (extracted into the onomastic sheets), never invented free-hand.

## Entity discipline

- One file per entity, flat dir; `id` is immutable and equals the pin id; never hand-edit generated outputs (`locations.json`, compiled codex). Containment is a `within` edge, never frontmatter. Full mechanics in `.claude/rules/`.
