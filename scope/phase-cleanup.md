# Phase: Cleanup & Backlog (ACTIVE)

A bounded follow-up phase the user opened at History Generation sign-off (completion deck 2026-05-29:
`backlog=followup_phase`). These are out-of-scope items that surfaced *during* History but were
deliberately not fixed silently — periphery contradictions, a duplicate pin, and onomastic-register
gaps. The point of this phase is to clear them cleanly, not to expand worldbuilding scope.

## Guardrails (unchanged from the arc)

- **`report lint` stays `errors:0`** after every mutation. Build is serialized — never two
  `build-codex.mts` at once.
- **Map is frozen ground truth.** No coordinate changes. An entity `id` must match its pin id — never
  reassign a live pin id (CLAUDE.md tripwire). Pin dedup means content/entity reconciliation, not
  moving pins.
- **Names from `docs/worldbuilding/onomastics/`.** Enrich sheets by extracting from attested map
  names; do not free-invent a register.
- **Leave the unrelated UI/image workstream alone.**
- Out-of-scope here: re-opening History, authoring new history for periphery regions.

## The four items

### 1. `containerBordersChild` contradictions (17, periphery)
A container region declares a `borders` edge to an entity that is `within` it — you cannot both
contain and border the same child. Reciprocal of the `bordersWithinSameTarget` class fixed in History.
- **Method:** the proven agent-075 pattern — resolve each id, `map near` / `map shot` (landmass, not
  distance), then adjudicate: is the child a CHILD (drop the spurious `borders`) or actually a PEER
  that borders the region (repoint the `within`)? Most are expected to be drop-the-border.
- The 17 are all out-of-scope periphery (e.g. Avalon→Promisewood, Shiverplains→children, Middle Sea
  water-body containment). Adjudicate read-only first, then apply mechanical edge fixes, rebuild, lint.
- **Done:** `containerBordersChild` count drops to 0, or any deliberate keep is documented in-file +
  the linter note updated.

### 2. Waterdark duplicate pin
Pin id **893** ("Wateytrdark") appears to duplicate the live Waterdark entity (`waterdark.md`).
- **Investigate:** is 893 a synthetic/typo duplicate with no inbound references (graph-safe delete, as
  with the earlier `nation-dalizi-confederation` and `race-claude-md-manager` artifacts), or a real
  second pin needing a content merge? Check `data/pinned.json`, inbound edges, and the map.
- **Done:** dup removed if graph-safe, or documented as an intentional frozen-map artifact with
  rationale. No live pin id reassigned.

### 3. Giant onomastic register gap
`docs/worldbuilding/onomastics/onomastics-giant.md` is a 28-line sparse sheet whose examples drift
English-descriptive, off the Gül-Germanic register the corpus uses for giants elsewhere.
- **Method:** harvest attested giant names from the corpus (entity bodies, existing giant entities),
  pin down the real register, and enrich the sheet to parity with the fuller sheets. Extraction, not
  invention.
- **Done:** sheet carries a coherent palette + morphemes + worked examples that match attested names.

### 4. Kazül onomastic sub-sheet
Kazül-region authoring used a mixed Romance / invented-harsh desert palette with no dedicated sheet.
- **Assess:** scan the authored Kazül names (region + children + persons like Salomor) for a coherent
  recurring register. If one exists, author `onomastics-kazul.md` (or a sub-section) capturing it and
  add it to the `.claude/rules/onomastics.md` table. If the names are too few/ad-hoc to generalize,
  document that and skip — do not manufacture a register.
- **Done:** sub-sheet authored + linked, or its omission justified.

## Sequence
Items are largely independent and file-disjoint (contradictions touch periphery entity edges; pin
dedup touches `data/pinned.json` + one entity; onomastics touch `docs/worldbuilding/onomastics/`).
Adjudicate/investigate read-only first (items 1–2), enrich/author in parallel (items 3–4), then apply
edge fixes + a single serialized build + lint to close.
