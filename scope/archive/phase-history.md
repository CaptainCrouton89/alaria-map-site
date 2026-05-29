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

## Bounded set — RATIFIED (user gate 2026-05-29: Option B)

Discovery's two explores (`context/agent-046/missing-middle-inventory.md`,
`context/region-candidates.md`) found 100 major polities, ~95% cold-start, with retrodiction pressure
and cross-polity shared structures concentrated in **two clusters**. The user ratified authoring those
two clusters now (declined the smaller "prove-the-batch" wave — the Tarkhon prototype already proved
the loop; the open risk is *cluster-level coherence where regions share events*, which is exactly what
these two clusters stress). The geographic periphery (Dalizi, Innerrim, Seacleft, Shacklands, Ve, …)
stays cold-start stubs by design — out of scope for this super-phase.

**Cluster A — Kharvorn / Middle Sea (~14 polities).** Erasnus(529), Anarak(426), Argysis(918),
Hephake(952), Myorna(710), Camaran(477), Ubrik(864), Bestacia(457), Watar(884), Kazül(652),
Adron(411), Ta Minn(801), Stipen(768), Eloesi(514). Shared causal spines that force co-authoring:
- **Argysis dragon-feud** — Rothogomos/Tepheranos betrayal → Argysis fall → dwarven exile to Hephake
  (binds Argysis + Anarak + Hephake; 3 Argysis ruins, Pact of Barrik).
- **Aldriktch Trade Alliance** (`faction-aldriktch-trade-alliance`) — founding history binds Erasnus,
  Camaran, Ubrik, Myorna, Bestacia, Watar.
- **Adron** — Naga dragon-rider kingdom + Waterdark "order that severed the dragon-bonds 400yr ago"
  (high-density standalone spine; couples thematically to the dragon-feud but not by shared event).
- 🚨 **Reconcile-first:** Erasnus(529) has `within: Anarak(426)` but sits NE of and borders Anarak —
  move to `within: Middle Sea Lands(9000)` before authoring Cluster A. (Watch coord collisions noted
  in `region-candidates.md` §4 are in *other* clusters; not blocking here.)

**Cluster B — Tarkhon inner provinces (~7 polities + KoF faction).** Kingdoms of Fire
(`nation-kingdoms-of-fire`, rivalOf Tarkhon), Gissemari(2509), Kabir(2519), Wadiyah(2593), Yaif(2611),
Enymu(2484), Kerwin(2530, tributary), Vogenfeld(2582, tributary). **Builds on the 3 existing Tarkhon
events** (neferati-founding ~2776, the-severance ~3076, klors-genocide ~3176) as scaffold — must not
contradict them. Shared spine: the Severance *caused* the KoF rivalry, so the 4 KoF kingdoms +
Kerwin's Severance-sequence knowledge co-author.

## Open questions (orchestrator-resolvable — planning sets defaults)

- **Region sequencing / batching.** Plan groups by causal spine (dragon-feud trio, Aldriktch six,
  Adron, KoF set, Tarkhon tributaries), file-disjoint per wave. `sisyphus:plan` lead proposes the
  wave DAG; `sisyphus:review-plan` gates it before authoring.
- **Contradiction-control cadence at scale.** Default: `report lint` (`errors:0`) + build after every
  batch; a cross-region coherence sweep between waves, focused on the shared spines above.
- **Flip-side coupling.** Extraction of existing `plane-*.md` per the locked decision (Labyrinth the
  lone invention) — depth is referential; author only what these clusters' events actually send across.

## Done when (ratified)

- The pincer loop has run across **Cluster A (Kharvorn/Middle Sea ~14) + Cluster B (Tarkhon inner
  provinces ~7)** beyond Tarkhon.
- Events + people for those regions are authored, edge-wired, scholar-attributed where open, and
  name-consistent with the onomastic sheets.
- The three shared spines (dragon-feud, Aldriktch Alliance, KoF rivalry) are authored once and
  consistently across every region they touch.
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
