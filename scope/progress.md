# Progress Ledger

Cross-phase memory so future sessions don't re-derive locked decisions. The durable arc lives in `arc.md`; the active super-phase lives in `phase-history.md`; retired phases live in `archive/`. This file records **what's done** and **what's been decided**, super-phase by super-phase.

When a super-phase's "Done when" criteria are met: mark it COMPLETE below, move its `phase-*.md` to `archive/`, and add the next super-phase as a new `phase-*.md`.

---

## Super-phase: Foundations & Tooling — COMPLETE (2026-05-26 → 2026-05-28)

The bounded reference frames + contradiction-control tooling, before any mass history generation.
Full stage spec retired to `archive/phase-foundations.md`. Shipped as commits `a422c42`
(items 1–7) and `383cf79` (pantheon expansion 35→140).

### Delivered
- **Pantheon (item 1):** 140 daemons across dead / current / rising cohorts, each dimensioned
  (domain, era of ascension + death, worshipping culture). First pass was 35; expanded to 140 after
  the user judged 35 too thin against 106 polities / ~50 culture families. GATE-A naming = MIX.
- **Scholars (item 2):** 7 majors + 14 niche, `person` entities with bias/era/patron; attribution
  convention in `.claude/rules/scholar-attribution.md` (coherence-first, approval-gated) +
  `docs/worldbuilding/scholar-voices.md` reference.
- **Onomastics (item 3):** ~21 sheets in `docs/worldbuilding/onomastics/`, extracted from frozen map
  names, not invented.
- **Eras (item 4):** 13 `era` entities, two-tier hierarchy (`within` + same-tier `precededBy`);
  events point at them via `occurredDuring`.
- **Canon-linter (item 5):** `alaria-codex report lint` — dangling targets, capitalOf-non-polity,
  both-ends-directed, orphan sweep, `worshipsTargetType` (worships→daemon OR titan-creature).
  Baseline `errors:0`. Date-sanity dropped (no structured dates) — user-ratified, catalogued.
  Rule auto-attaches via `.claude/rules/codex-cli.md`; documented to expand over time.
- **Pincer prototype (item 6):** Tarkhon Empire taken through the full loop end-to-end (present →
  ~100yr retrodiction → cosmogony pull-down; events, edges, scholar attribution, names, linter clean).
  GATE-C signed off. The repeatable template for the History super-phase.
- **Authoring guides (item 7, user-added):** thematic register + no-lazy-mysteries in
  `docs/worldbuilding/lore-style-guide.md`; consolidated scholar reference.

### Locked decisions (carry forward)
- **Flip-side is extraction, not invention.** Malstaris / Celestia / Astral / Eindumor / three-soul
  death are already written and coherent (`plane-*.md`). Parallel-timeline work = organize + deepen.
  **Exception: the Labyrinth needs invention.**
- **Edge graph is canon** for spatial / polity / economy / origin / history / possession families;
  prose is canon for motivation / voice / theme. (See `arc.md`; topic-F research.)
- **GATE-A naming = MIX**; onomastic sheets are authoritative.
- **Daemon shape:** `id daemon-<slug>`, prose-only temporal placement (no `occurredDuring` on daemons).
- **Worships discipline:** edge only when worshipper is a concrete entity, never a generic prose class.
- **Coherence-first attribution:** scholarly disagreement is approval-gated, not the default voice.
- **Linter gate:** build clean + `report lint` at `errors:0`.

---

## Super-phase: History Generation (the pincer, scaled) — COMPLETE (2026-05-28 → 2026-05-29)

Turned the crank across the two ratified anchor clusters. Full stage spec retired to
`archive/phase-history.md`. Lead sign-off 2026-05-29 (completion deck: signoff=approve, names=lock).

### Delivered
- **Both anchor clusters authored** — Cluster A (Kharvorn/Middle Sea, 14 regions incl. the A4 set
  Kazül/Ta Minn/Stipen/Eloesi) + Cluster B (Tarkhon inner provinces, 7 + Kingdoms of Fire). Events +
  people authored, edge-wired (`participatedIn`/`caused`/`ruinsOf`/`atWarWith`/`foundedBy`/`ruledBy`),
  names from local onomastic sheets. Periphery stayed cold-start by design.
- **Three shared cross-polity spines authored once, consistent everywhere** — Aldriktch Trade Alliance
  founding; Argysis dragon-feud (kept distinct from Adron's earlier Severing — ~200yr gap, no shared
  dragons); Kingdoms-of-Fire rivalry (the Severance, reconciled with frozen Tarkhon canon).
- **Coherence proven** — T5 (Cluster A) + T8 (Cluster B) + T9 (final corpus) sweeps all PASS; every
  present-day fact traces to a cause; `report lint` held `errors:0` throughout.
- **Three names ratified** — "The Glassing", "the Ederhi", "The Ride of Ta Minn" locked as canon
  (provisional flags dropped, commit `20e2ce1`).

### Locked decisions / new invariants (carry forward)
- **borders+within is mutually exclusive.** A new linter check `bordersWithinSameTarget` (error) gates
  an entity declaring both `borders` and `within` the same target; 8 self-declared cases were
  adjudicated + fixed. A reciprocal `containerBordersChild` (warning) tracks a container bordering its
  own contained child — 17 out-of-scope periphery cases remain (the cleanup phase below).
- **Net-new edge kinds in use:** `atWarWith`, `ruinsOf` — authored one-direction (war on the aggressor;
  ruins on the ruin pointing at the event).
- Shipped on `main` (`cd87d70`, `10d67d7`, `a6edd07`, `50e5c2c`, `20e2ce1` + regen `b64135c`).

---

## Super-phase: Cleanup & Backlog — IN PROGRESS (started 2026-05-29)

Out-of-scope items surfaced during History Generation that the user routed to a dedicated bounded
follow-up phase (completion deck: backlog=followup_phase). Active spec in `phase-cleanup.md`.

### Scope (4 items)
1. **17 `containerBordersChild` contradictions** — periphery regions where a container declares
   `borders` to its own contained child. Each needs the agent-075 geographic adjudication (drop the
   spurious border, or repoint the within). Currently tracked as linter warnings.
2. **Waterdark duplicate pin** — id 893 ("Wateytrdark") vs the live entity. Investigate whether 893 is
   a synthetic dup (graph-safe delete, like the earlier dalizi/claude-md-manager artifacts) or a real
   content merge. Frozen-map caution: never reassign a live pin id.
3. **Giant onomastic register gap** — `onomastics-giant.md` is a 28-line sparse/English-descriptive
   sheet, off the Gül-Germanic register canon elsewhere. Enrich it.
4. **Kazül onomastic sub-sheet** — the mixed Romance/invented-harsh palette used in Kazül has no
   dedicated sheet. Assess whether the authored Kazül names justify one; author if warranted.

### Done when
- `containerBordersChild` warnings resolved (or each remaining one documented as a deliberate keep).
- Waterdark dup resolved or documented as intentionally-frozen with rationale.
- Giant sheet enriched to register parity; Kazül sub-sheet authored or its omission justified.
- `report lint` stays `errors:0` throughout; no map coordinate changes.
