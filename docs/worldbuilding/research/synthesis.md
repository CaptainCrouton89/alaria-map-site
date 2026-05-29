# Research synthesis — Foundations & Tooling action items

This document converts the six per-topic research deliverables — `topic-A-pantheon.md` (pantheon-over-time), `topic-C-pincer.md` (retrodiction and the two-ended pincer), `topic-E-eras.md` (era-as-entity timeline), `topic-F-graph.md` (graph-as-canon at scale), `topic-G-coupled-planes.md` (coupled-plane worldbuilding), and `topic-H-shallowness.md` (referential depth) — into action items bound to a Foundations stage item (#1 pantheon roster, #4 era entities, #5 canon-lint, #6 pincer prototype) or to a thesis in `scope/arc.md`. Three load-bearing contradictions were resolved by the user before drafting and are treated as settled here: the graph-as-canon claim at `arc.md:9` stays unqualified, with Topic F's Wikidata precedent recast as motivation for a write-time blocking linter rather than as a reason to revise the thesis; the flip-side originality claim at `arc.md:46` has already been narrowed by the orchestrator to the forgetting-terminated identity-stream and the single-plane Celestia configuration, with Glorantha, Sandman, and the Egyptian *ren* named as precedent; and Foundation #6 keeps its `archive/phase-foundations.md` framing as a prototype rather than being reframed as a method-test, with Topic C's lack-of-precedent flag recorded under Risks. Findings that yield no action item are omitted. Where several topics land on the same action, it is named once and all sources cited.

---

## Foundation #1 — Pantheon roster

Topic A sizes the roster against the same-five-gods failure and supplies the lifecycle and anti-homogenization machinery; Topic G constrains *when* daemons can be authored, because daemons live in Celestia and are coupling participants.

Topic A's central number: target 90 named daemons for the initial roster (roughly 55 current, 20 dead, 10 rising, 5 dying), with headroom to 130 and a hard ceiling at 150. The plan's 60 floor supports only ~36 cultures at 2.5 patrons with 40% overlap — below the culture-count the pincer region will surface. Forgotten Realms hit ~250 named divine entities and reset its pantheon three times in seventeen years; that is the documented break point the 150 ceiling is set against. Glorantha's ~300 deities work only because they distribute across twelve cultural blocks at ~25 each, so the relevant load is per-culture, not absolute.

The decision-critical finding from Topic A — flagged by its author as the single most decision-relevant item in that document — is that every existing and future `culture/worships` edge is gated by whether the edge gains a discriminator now or is retrofitted later, and retrofit cost grows linearly with edge count. The current edge is one-directional, target-only, undifferentiated. That is the same-five-gods failure waiting to fire.

Topic G adds a sequencing constraint: hold daemon-roster authoring until the seven majors (Foundation #2) are locked and the coupling's edge vocabulary (`sentAcross`, below) is decided, because daemons that acquire faces and biases before mortals do will read as Sigil-with-an-attached-Prime (Topic G's Failure Mode 1, the flip side getting all the interesting inhabitants).

Immediately actionable:

1. Author 30 daemons in the first pass, biased toward dead and current. Dead daemons are bounded — historical entities with no ongoing dimensional pressure — and authoring them first stress-tests the dead-god rule against daemon-economics canon and the era-attribution rule against era entities. Current daemons follow once the dead set shakes out the schema.
2. Defer rising daemons (Tiira, 1800 SD is the named example) to a second pass, after at least one Seventh Dawn era entity exists; rising requires forward-pointing causal commitments the corpus must already support.
3. Expand from 60 toward 90 during the Foundation #6 pincer prototype: each culture the pincer surfaces gets its patron roster authored as it appears, which tests the discriminated `worships` edge at region scale before it is turned on across the full map.
4. Sequence the worships discriminator (catalogue item 2) ahead of any daemon authoring — see Sequencing. It is the cheapest gate to lose and the most expensive to retrofit.

Approval-gated (see catalogue): the `lifecycle` daemon field; the discriminated `culture/worships` `kind`; the daemon `domain` field; the dead-god tithe-dissipation invariant; the God-Learner-analogue major scholar (one of the seven). Hold daemon authoring per Topic G until Foundation #2 and the `sentAcross` decision land.

---

## Foundation #4 — Era entities

Topic E carries this item; Topic G identifies the two coupling-foundation events whose era entities are the test bed for the `sentAcross` edge.

Carve seven era entities from the monolithic timeline, not the thirteen the current World Timeline implies. The carve drops six by reclassifying boundary catastrophes (Hykravones, World Fire) as events rather than eras and by merging the Long Twilight slice into adjacent eras. The seven: Age of Titans (mythic), Reign of Dragons (mythic-to-historical transition), Walk of Elves (historical), Birth of Man and Long Twilight (historical), Golden Age of Man (historical), Age of Craggus through Lost Ages (historical, gap-shadowed), and the already-existing Seventh Dawn.

Two co-load-bearing schema decisions, in priority order. The mythic/historical `regime` split costs the most to undo if made wrong, because mythic eras carry different edge profiles, ordering invariants, and authorial register — it is Glorantha's God Time / Time split and Tolkien's Years of the Trees / First Age split, the same structural move in both. The era-count carve (seven, locked, with a linter ceiling at twelve) costs the next-most, because every `occurredDuring` edge in the corpus resolves against the era roster and changing it mid-project touches every event entity. If only one is fixed first, fix the regime split: era count can be revised within a fixed schema more cheaply than the schema can be revised within a fixed count.

Granularity scales to dramatic load, not chronological span — Tolkien's Appendix B compresses the 3,441-year Second Age to under three pages and expands two years of the late Third Age to day-by-day. Three eras get authored deeper because the present-day map points back at them densely: the Golden Age (Temavori), the Age of Craggus / Lost Ages container (Erindath and Oblexan), and the Seventh Dawn (Pembling). The other four stay near-stub, each with one named catastrophe-event and a Velorin-attributed cosmological reading.

The hard prerequisite, surfaced by Topic E and reinforced as a Risk below: the carve requires `event` entities that do not yet exist. The corpus holds five events; none is the God War. At minimum `event-ezz-rift`, `event-walk-of-elves`, `event-eyachria-gaea`, `event-god-war`, `event-hykravones`, and `event-world-fire` must be authored before the era-boundary linter rules can activate without erroring on the entities the carve is fixing.

Immediately actionable:

1. Audit the five existing `event` entities against the six boundary events the carve names; author the missing ones first.
2. Author the seven era entities with the proposed additive frontmatter (`regime`, structured `startDate`/`endDate` as `{value, unit}` to absorb the Mya/ya/BSD/SD unit mix, `boundaryEvent.start`/`end` pointing at event ids, `gap`). The scholar who owns each era's chronicle lives in the prose body via the existing `> — ` blockquote convention — do not mint a frontmatter field for it.
3. Mark the Age of Craggus / Lost Ages container `gap: true` and keep it coarse; deepen only if specific events demand it (Tékumel's Bednálljan-dustbin warning).
4. Execute the data-fix sequence in order: author new era and boundary-event entities; repoint `era-seventh-dawn`'s `precededBy` from `era-world-fire` to `era-craggus-and-lost-ages`; demote or delete the `era-world-fire` entity in favor of `event-world-fire`; revise or retire `event-world-timeline.md`; then activate linter rules in the order chain-complete → boundary-event-required → date-monotonic → policy warnings.
5. Treat the Birth-of-Man end date and the Golden Age start date as authorial — `world-systems-invariants.md` locks "Birth of Man 500,000 ya" but does not date the Golden Age's opening. Staging the Long-Winter boundary as the published Temavori/Erindath rivalry may be more productive than resolving it.

Approval-gated (see catalogue): the four additive era frontmatter fields; the `boundsEra` and `eraConcurrentWith` edge kinds; the six era linter checks. Rejected kinds (`eraPrecededBy`, `eraSpanning`) are recorded in the catalogue so they are not reproposed.

---

## Foundation #5 — Canon-lint

Three topics feed this item. Topic F supplies the architecture and the core check priority; Topic C, Topic G, and Topic H each add domain-specific checks.

The architectural decision, per the user's resolution of contradiction 1: build the linter as a write-time blocking gate at `edge add` and build, via hookify, not as a CI report. The Wikidata operational record is unambiguous — advisory constraints accumulated 50M+ value-type violations on a single property, and the Faber et al. quality study found only about one in three violations ever corrected. A linter that runs in CI but does not block will be ignored by entity #5,000. This is the avoidable form of the Wikidata failure mode: Alaria's smaller scale, narrower vocabulary, and write-time block are exactly what the 122M-entity precedent lacked.

Topic F's seven prioritized checks, ordered by leverage and current exposure (this list replaces and reorders the plan's check list):

1. Dangling-edge / referential integrity — `target ∉ entity_ids`. Highest priority; every entity rename in the current git diff is an opportunity for it.
2. Type/range — declared allowed source and target types per edge kind (`capitalOf` source a city/town, target a polity; `subraceOf` source a subrace, target a broad race). Catches misrouted edges referential integrity misses.
3. One-direction violation — both ends of an inverse pair authored. Already a stated rule; lint it.
4. Cycle detection on `spatial/within` and `history/precededBy` via depth-first traversal at build. Completes in well under a second at 10k entities; the MAXSAT solver cost only becomes relevant past ~10M, outside Alaria's envelope.
5. Exclusivity / conflicts-with — `allyOf` and `atWarWith` on the same pair cannot coexist without a separating `when` window.
6. Capital-of-nonexistent — recast as a type/range check whose target type forbids `dissolved: true`.
7. Date sanity — `event.when` inside `era.start..era.end`; `person.birth < polity.founded` for `foundedBy`. Depends on Foundation #4 era entities landing first.

The eighth check, synonym-drift detection, runs a clustering pass (string similarity plus co-occurrence on the same entity pair) over the ~50 distinct kinds and flags candidates for review — the cheapest anti-drift instrument the Wikidata experience prescribes.

Domain-specific checks the other topics add:

8. Dangling-cause (Topic C) — an entity body carrying retrodiction-signal phrases ("once was," "remnant of," "successor to," "before the…," "in the time of…") without a corresponding typed edge (`successorOf`, `ruinsOf`, `caused`, `occurredDuring`) is a promised cause with no authored referent. A small grep dictionary against existing edge families; this is Lindelof's "the answers are coming" failure made detectable at lint time.
9. Retcon-into-corner (Topic C) — when authoring a cause C for fact F, query the graph for facts C contradicts: date conflicts within causal reach, actor-elsewhere conflicts against prior `participatedIn` edges, geographic conflicts against authored present-day conditions in regions C touches. Surfaces the structural conflict before the author commits, which is what nobody did on *Crisis on Infinite Earths*.
10. Missing-gesture stub (Topic H) — any entity whose outgoing edges include none of the history, cosmology, culture, origin, polity-conflict, or `imprisons` kinds listed in `entity-relations.md` is a stub that points at nothing. Body length does not drive the check: a thirty-word stub with one `occurredDuring` edge passes; a thousand-word entity with only `within` and `inhabitedBy` fails. Report to `data/lint-reports/missing-gestures.csv`; do not block the build until a remediation pass closes the gap.
11. Tier-inflation / clomping-foot (Topic H) — any `footnote`- or `minor`-weight entity whose body exceeds ~800 words is a re-tiering candidate. The detector for drift between authoring intent and prose volume.
12. Major-event-without-`sentAcross` (Topic G) — any `event` of weight `major` or above lacking a `sentAcross` edge warns until corpus coverage stabilizes. Severity warning, not error.

Immediately actionable:

1. Implement checks 1–6 at `edge add` and build via hookify as the blocking gate; these need no new vocabulary or unauthored entities.
2. Implement checks 8, 10, and 11 (dangling-cause, missing-gesture, tier-inflation) now as report-only — they require no schema change and the missing-gesture count is the prerequisite for evaluating the depth-is-referential thesis (Topic H's single most decision-relevant action).
3. Sequence check 7 (date sanity) and the era checks after Foundation #4 era and boundary-event entities exist.
4. Stand up the prose-vs-graph audit harness: sample 50 random entities, extract prose claims that should be typed edges, count contradictions. Run at 5k, 7.5k, and 10k. Under 5% contradiction holds the thesis; above 15% is the Wikidata failure mode. Start now at 3,541 — the Phase B `inhabitedBy` mixing already noted in project memory is the trigger firing.

Approval-gated (see catalogue): the `when`-shape constraint (it changes the `entity-relations.md` discipline section); checks 9 and 12 depend on rule changes catalogued below; the synonym-drift check depends on the vocabulary consolidations.

---

## Foundation #6 — Pincer prototype

Topic C carries this item; Topic G adds the lockstep flip-side requirement. Per the user's resolution of contradiction 3, the framing stays a prototype, not a method-test; the no-precedent flag is recorded under Risks, not built into the item.

Pick Dalizi Confederation over Tarkhon. The 310-line Dalizi entity file is already a body of present-day facts demanding causes, which is exactly the input the floor-up arm of the pincer needs. "Confederation" is itself a retrodiction hook — it implies prior separateness, a moment of confederation, a faction that resisted. Tarkhon's largest-territory advantage is irrelevant: map size is not retrodiction-hook density, and Tarkhon lacks the floor density to make each retrodicted cause concrete.

Cap causal depth at three layers on the first pass: present fact → proximate cause (≤100 years, authored as an `event` entity) → era anchor in the Seventh Dawn. Stop there. Wolfe's implied chronology runs three named layers and resists going deeper; Tolkien's corpus broke when the fourth layer became the world-substrate (the round-world retrodiction, the orc-origin problem). Do not retrodict back to the God War or Hykravones on the first pass. Where a third-layer cause needs a fourth, mark it with a single `cosmology/sourceOf` gesture upward and leave it un-authored — the upward gesture costs one edge and is the depth-is-referential technique in operation.

The minimum sample is five complete chains. For at least five present-day Dalizi facts, produce a full chain of present fact → ~100-year cause as an `event` entity → Seventh Dawn era anchor, with every causal edge typed and at least one scholar attribution per chain. Five chains exercise every part of the loop including the new linter checks. If the loop works on five, the method scales; if it breaks on five, it breaks on five thousand. Do not turn the crank on a second region until the five chains pass lint and pass a read by a second author.

Anchor every approved retcon to a dated event, the Le Guin pattern: a dated `event` entity, a named `person` participant, and a `caused` edge to the present-day fact. Without that signature the retcon is invisible to tooling and indistinguishable from drift at entity #4,000.

Topic G's lockstep requirement: author the chosen region's flip-side counterpart alongside the material one. For Dalizi this is less immediately concrete than the Tarkhon/Evertorch-Labyrinth coupling Topic G analyzed, but the rule holds — whichever region runs, its Celestia/Malstaris consequences are authored in the same loop, and the `sentAcross` edge on its `major`-weight events is the test of that coupling at region scale.

Immediately actionable:

1. Select Dalizi as the prototype region (resolves the deferred open question in `archive/phase-foundations.md` and `progress.md`).
2. Build the five present-fact → event → era chains under the three-layer cap.
3. Author the Dalizi flip-side consequences in the same loop; place `sentAcross` edges on its `major` events.
4. Gate progression to a second region on the five chains passing lint and a second-author read.
5. Measure the region's actual stub/paragraph/multi-section distribution after the loop (Topic H) and use it to calibrate the 10,000-entity ratio empirically before propagating.

Approval-gated (see catalogue): the cap-at-two-scholars and retcon-must-anchor-to-event clauses in `scholar-attribution.md`; the dangling-cause and retcon-into-corner linter checks.

---

## Thesis — Graph-as-canon (`arc.md:9`)

The thesis stays unqualified per the user's verdict. Topic F's finding that the unqualified claim does not survive Wikidata's 122M-entity precedent is cautionary, not refuting: Alaria's 10k scale, narrow vocabulary, and the write-time blocking linter make the Wikidata failure mode avoidable. The non-graph-policed slice (prose voice, character interiority, the contents of `note` fields) stays implicit, not architecturally separated out into a new `arc.md` section.

The action the thesis generates is the write-time blocking linter under Foundation #5, plus the prose-vs-graph audit harness that measures whether the claim is holding empirically. Topic F's vocabulary discipline — the role-qualifier anti-proliferation pattern, statement rank for contested claims, structured references — is the operational content; each appears as a catalogued rule change. The single thesis-level instruction: do not add a qualifying section to `arc.md`; cite Wikidata as the reason the lint blocks at write time.

Action item: ship the blocking linter (Foundation #5, checks 1–6) and the audit harness; do not revise `arc.md:9`.

---

## Thesis — Depth is referential (`arc.md:29`)

Topic H confirms the thesis against six precedents — Tolkien's "impression of depth," Glorantha's Pamaltela, Barker's one-clause rival empires, Greenwood's design-outward method, Wolfe's translator frame, Borges's found-encyclopedia — and names the dominant failure mode, Harrison's "great clomping foot of nerdism," the urge to survey exhaustively.

The operational reframe: retire `weight` as an authoring signal (it is set in 1 of 3,541 files and effectively unused) and replace "tier discipline" with "gesture discipline." Every footnote/minor entity must carry at least one outgoing edge in the history, cosmology, culture, or origin families. The edge is the gesture; an entity with no upward edge is a stub that points at nothing. This is Barker's test ported to the graph — "Baron áld plans his revenge upon the Tsolyáni who betrayed him" is a person, a prior event, and a motive in fourteen words, which in Alaria is three edges the prose then condenses.

The target shape at 10,000 entities: roughly 5–10% (500–1,000) carry multi-section authoring; 15–25% (1,500–2,500) carry one paragraph with two or more live upward edges; the remaining 65–80% (6,500–8,000) stay at one or two sentences plus one upward edge, forever — the Pamaltela tier. The corpus reads as deep because each stub names one specific thing, not because the stubs are filled in. The Pincer Region prototype calibrates this ratio empirically before propagation.

Immediately actionable:

1. Build the missing-gesture linter check (Foundation #5, check 10) — Topic H's single most decision-relevant action, because the stub count is the prerequisite for evaluating whether the thesis holds.
2. Stop retro-populating `weight`; let `zoomLevel` plus `entityType` be the de-facto length signal as the style guide already advises.

Approval-gated (see catalogue): the gesture-rule paragraph and the three named failure modes added to `lore-style-guide.md`; the gesture-by-scholar example added to `scholar-attribution.md`. Rejected: the `gestureTarget` frontmatter field — it duplicates graph data and creates a second source of truth; the lever belongs in the linter, not the schema.

---

## Thesis — Scholar frame (`arc.md:32`)

The scholar frame is the project's contradiction-absorber, and three topics converge on making it machine-readable and bounded rather than letting it become the Glorantha *King of Sartar* use-failure (six document strata that Jeff Richard retrospectively judged "a failure and an obstacle for gamesters").

Topic C: cap scholar disagreement at two voices per disputed fact, one as working canon and one as dissent. Gyldayn's three-source apparatus survived publication because Gyldayn synthesizes; Stafford's six strata did not. Capping at two also caps the Eco hermetic-semiosis risk — the temptation when contradictions accumulate is to add more scholars, and that temptation is the failure.

Topic F: surface scholar disagreement as graph structure, not prose. Two scholars who disagree about whether the First Death preceded the First Dark author two `caused` edges, each carrying `attestedBy: <scholarId>` and `rank: contested`. This makes the contradiction-absorber linter-checkable, which it currently is not.

Topic H: the scholar frame is structurally synergistic with the gesture model — a stub authored as a scholar's brief mention is doubly cheap, because the in-world scholar's epistemic limit and the author's restraint align (the Wolfe translator frame). This needs no rule change, only an example added to `scholar-attribution.md`.

Topic G: two specific staged-disagreement proposals (Velorin/Temavori on the First Death; the niche Labyrinth-survey scholar), both approval-gated under the existing convention.

The existing `scholar-attribution.md` already makes attribution approval-gated, bans unnamed-collective hedges, and specifies the greppable `> — ` form. All proposals extend that logic rather than contradicting it.

Action items are all approval-gated and catalogued below: the cap-at-two clause; the `attestedBy`/`rank` fields; the two Topic G staged disagreements; the gesture-by-scholar example. Immediately actionable: lock the seven majors (Foundation #2) before daemon authoring, per Topic G — their voices are a coherence constraint that must not drift, and the daemon roster depends on them.

---

## Thesis — Flip-side coupling (`arc.md:46`)

The originality claim has already been narrowed by the orchestrator to two elements: the forgetting-terminated identity-stream (the Egyptian *ren* is the forgetting-termination precedent, but the *ren* is not the personality-bearer — Alaria's inversion puts the *you* in the fragile stream) and the Celestia configuration where worship, death, and identity economies all route through one plane. Glorantha's God Time / Time coupling and Sandman's Dreaming are named as the mass-exchange precedent. The revised line 46 is canon; action items are written around the narrowed claim, not the original "genuinely original" framing.

The highest-leverage action, independent of the originality verdict: author `plane-labyrinth.md`. The corpus carries two Labyrinths whose relationship is unstated — `artifact-the-labyrinth.md` (the Izzus-leyline structure under Evertorch cathedral) and the flip-side region named in `arc.md` and `progress.md` with no entity file. Couple them: a single `plane-labyrinth.md` establishing the Labyrinth as the unmapped, unsovereigned part of the flip side, tied to `artifact-the-labyrinth` by `cosmology/flipSideOf`, with a body that refuses to name inhabitants or fix geometry. This is the residue principle in action — a structure accumulating time-distortion on both sides of the boundary, the cathedral basement one of its material apertures — and it gives the flip-side region a concrete material handle that prevents drift into pure abstraction (Topic G's Failure Mode 2).

Topic G's structural cautions, for the canon-lint and authoring discipline: hold the ontological asymmetry — Celestia cannot acquire a self-sustaining native inhabitant, or the coupling slackens. Daemon Deoric agency in the material plane is the boundary-collapse risk; the rule that it is costly and bounded must stay load-bearing as the roster grows. The failure mode Alaria is most exposed to is Failure Mode 1, the flip side getting all the interesting inhabitants — do not let Celestia accumulate named, biased daemons faster than the material plane accumulates named, biased mortals. The 60–150 daemon target is the danger zone; lock the seven-major roster and the daemon-mortal authoring ratio before adding daemons.

Immediately actionable:

1. Author `plane-labyrinth.md` and the `flipSideOf` edge to `artifact-the-labyrinth` (highest-leverage, independent of every other item).
2. Lyzaria's First Death and the Ezz Rift are the two coupling-foundation events; their era/event entities (Foundation #4) declare what they sent across — the test bed for the `sentAcross` edge.
3. Hold the daemon-mortal ratio discipline as daemons are authored (Foundation #1).

Approval-gated (see catalogue): the `cosmology/sentAcross` edge kind; the Velorin/Temavori First-Death disagreement; the niche Labyrinth-survey scholar.

---

## Approval-gated rule and invariant changes

Every proposed change to `.claude/rules/entity-relations.md`, `.claude/rules/entity-files.md`, `.claude/rules/scholar-attribution.md`, `world-systems-invariants.md`, `docs/worldbuilding/lore-style-guide.md`, and the Foundation #5 linter set. Each requires orchestrator or user sign-off before authoring touches the affected surface. Rejected proposals are listed at the end so they are not reproposed.

| # | Source | Proposed change | Rationale | Affects | Gate |
|---|--------|-----------------|-----------|---------|------|
| 1 | A | Add `lifecycle` daemon field, enum `rising\|current\|dying\|dead` | Lifecycle is a property of the daemon; four states collapse from daemon-economics canon (R below R_min ends the daemon, no dormant state) | `entity-files.md` | Approval-gated |
| 2 | A | Add required `kind` to `culture/worships`: `primaryPatron\|minorVeneration\|ancestralOnly\|propitiation` | The undifferentiated edge is the same-five-gods failure; `ancestralOnly` carries the dead-god case; retrofit cost grows linearly with edge count | `entity-relations.md` | Approval-gated — highest priority, gates all worships edges |
| 3 | A | Add daemon `domain` field from a controlled vocabulary mapped to the cosmogony's elemental/conceptual axes | The Glorantha rune solution; lets two same-domain daemons stay distinct and enables the domain-overlap lint | `entity-files.md` | Approval-gated |
| 4 | A | Dead-daemon prayer-tithe dissipates into Ezz; no R receives it, no miracle funded | Plugs the tithe-dissipation hole without a silent-redirection pattern; the Gaea-dormancy diffusion is the precedent | `world-systems-invariants.md` | Approval-gated |
| 5 | A, G | Author one of the seven majors as a God-Learner analogue who tried to syncretise daemons on domain-match and produced documented disaster | Converts the homogenization failure mode into an in-world contradiction-absorber; Topic G's "name the heresy" technique | `scholar-attribution.md` roster + person entity | Approval-gated |
| 6 | C | Cap scholar disagreement at two voices per disputed fact (one working canon, one dissent); no more without explicit elevation | Stafford's six strata failed as reference; Gyldayn's bounded apparatus survived; caps the hermetic-semiosis risk | `scholar-attribution.md` | Approval-gated |
| 7 | C | Approved retcons must anchor to a dated `event` entity with a named `person` participant and a `caused` edge | The Le Guin Halkel-of-Way pattern; makes the retcon a checkable graph signature instead of invisible drift | `scholar-attribution.md` | Approval-gated |
| 8 | E | Add four additive era frontmatter fields: `regime` (`mythic\|historical\|transitional`), `startDate`/`endDate` as `{value, unit}`, `boundaryEvent.start`/`end`, `gap` | `regime` is load-bearing for ordering invariants and attribution register; structured dates absorb the Mya/ya/BSD/SD mix | `entity-files.md` | Approval-gated |
| 9 | E | Add `boundsEra` (era → event) | Names the catastrophe that opens/closes an era; lets the linter verify one bounding end-event per non-current era (Tolkien catastrophe-boundary pattern as graph invariant) | `entity-relations.md` | Approval-gated |
| 10 | E | Add `eraConcurrentWith` (era → era) | Two eras over the same span from different cultural frames; permitted in vocabulary, no Foundations-stage instances authored | `entity-relations.md` | Approval-gated |
| 11 | F | Retire `polity/tributaryOf`; route the distinction to `polity/vassalOf` + `note` | Synonym-pair drift (the DBpedia `height`/`elevation` pattern); the intensity difference belongs in `note` | `entity-relations.md` | Approval-gated |
| 12 | F | Retire `economy/paysTributeTo`; route to `polity/vassalOf` + `note` | Cross-family synonym; two families encoding tribute will drift | `entity-relations.md` | Approval-gated |
| 13 | F | Add optional `role` qualifier on `culture/inhabitedBy`, `history/participatedIn`, `polity/ruledBy` with an enumerated allowed-values list per kind | The Wikidata P3342+P3831 anti-proliferation pattern; avoids minting `inhabitedByMinority`, `ruledByOccupier`, etc. | `entity-relations.md` | Approval-gated |
| 14 | F | Add optional `attestedBy` (target `person` of type scholar) on cosmology, culture, history, origin family edges | Makes scholar disagreement machine-readable; pairs with the cap-at-two clause | `entity-relations.md` | Approval-gated |
| 15 | F | Add optional `rank` field, `preferred\|contested\|superseded`, on edges | Wikidata statement rank; lets two contradictory edges coexist as structure rather than be reconciled prematurely | `entity-relations.md` | Approval-gated |
| 16 | F | Constrain `when` to a parseable shape: bare year, signed year, or `era-id` reference; reject free prose at `edge add` | Lets date-sanity checks fire without full structured time-binding; the interim discipline before Foundation #4 | `entity-relations.md` discipline section | Approval-gated |
| 17 | G | Add `cosmology/sentAcross` (material `event`/`era` → flip-side entity); `note` carries what transferred | Records transfer at an event, which `flipSideOf` (static mirror) and `sourceOf` (unbounded origination) do not; resolve the "author from the smaller entity" convention for cosmology edges on events before locking | `entity-relations.md` | Approval-gated |
| 18 | G | Stage a Velorin/Temavori disagreement on the meaning of Lyzaria's First Death | The coupling is a historical claim as much as cosmological; the *ren*-style ambiguity (does the spirit end because the name fades, or the name fade because the spirit ends?) is the substance, not a papered gap | `scholar-attribution.md` + entity prose | Approval-gated |
| 19 | G | Add a niche scholar for failed Labyrinth surveys, tagged `scholar`, weight `minor`, attached to the Tarkhetan/Neferati clergy | The named-heresy technique; their failed maps become the in-world reason the Labyrinth's geometry cannot be settled | `scholar-attribution.md` niche index + person entity | Approval-gated |
| 20 | H | Add a gesture-rule paragraph to the "Length by importance" section | Codifies depth-is-referential at the prose layer: one concrete clause naming an actor/event/cause beats vague atmospherics | `lore-style-guide.md` | Approval-gated (doc edit) |
| 21 | H | Add three named failure modes to "Things to avoid": the clomping foot, the notes-to-self trap, explanation foreclosing mystery | Names the dominant mature-setting failures so review prose can target them | `lore-style-guide.md` | Approval-gated (doc edit) |
| 22 | H | Add a gesture-by-scholar example block | Illustrates the doubly-cheap stub (scholar epistemic limit + authorial restraint); not a rule change, an example addition | `scholar-attribution.md` examples | Approval-gated (example, not rule) |
| 23 | E | Six era linter checks: `era-boundary-event-required` (error), `era-precededBy-chain-complete` (error), `era-date-monotonic` (error), `era-mythic-no-strict-ordering` (warn), `era-gap-thinness` (warn), `era-count-ceiling` at 12 (warn) | Defend against era-boundary drift and Star Wars granularity creep; must activate only after the era/event data fix | Foundation #5 linter | Approval-gated; sequenced after data fix |
| 24 | C | Dangling-cause linter check | Detects bodies promising a cause with no typed edge (Lindelof "answers are coming") | Foundation #5 linter | Approval-gated |
| 25 | C | Retcon-into-corner linter check | Surfaces facts a new cause contradicts before commit (the *Crisis* failure) | Foundation #5 linter | Approval-gated |
| 26 | F | Synonym-drift clustering check over the ~50 kinds | Cheapest anti-drift instrument; depends on the vocabulary consolidations (11, 12) | Foundation #5 linter | Approval-gated |
| 27 | G | Major-event-without-`sentAcross` warning | Forces coupling coverage on `major`+ events; warning, not error, until coverage stabilizes; depends on edge 17 | Foundation #5 linter | Approval-gated |
| 28 | H | Missing-gesture stub check (report-only) and tier-inflation check (footnote/minor body > ~800 words) | Surfaces the stub population for the depth-is-referential evaluation; the clomping-foot detector | Foundation #5 linter | Actionable now (no new vocabulary); report-only |

Rejected proposals, recorded so they are not reproposed: `eraPrecededBy` (duplicates the existing `history/precededBy`, in use on `era-seventh-dawn`); `eraSpanning` (an event crossing an era boundary is two `occurredDuring` edges or a parent event); the `gestureTarget` frontmatter field (duplicates graph data, violates one-direction discipline; the lever belongs in the linter); a separate daemon `dormant` lifecycle state (contradicts the R-below-R_min termination canon). No change to `world-systems-invariants.md` is required by Topics C, E, F, or H; only item 4 (dead-god tithe dissipation) touches the invariants.

---

## Risks

The planned-method-precedent risk (Topic C). No surveyed setting was built as a deliberate two-ended pincer with the cosmogony pulled down to meet retrodicted present-day causes. Tolkien accreted outward from linguistic seeds and retrofitted backward; Martin gardened the novels and built history afterward through Yandel and Gyldayn; Le Guin retrofitted publicly after the fact; Stafford comes closest, and his most pincer-like artifact (*King of Sartar*) was judged a use-failure by Jeff Richard at the Well of Daliath. The pincer's component techniques are all documented as working — retrodiction from present facts, in-world historian apparatus, dated event anchors, compression-as-gesture — but planning the pincer as a method before authoring is unproven. Per the user's verdict, Foundation #6 keeps its prototype framing; this risk is the reason the five-chain minimum and the second-author read gate matter.

The Wikidata cautionary precedent (Topic F). When a 122M-entity structured database that aimed to be canonical truth asked the largest prose wiki to treat it as authoritative, the community refused and local prose won (the 2018 Infobox RfC). This now frames the write-time block requirement rather than refuting the graph-as-canon thesis: the failure was advisory enforcement at a scale and vocabulary far beyond Alaria's, and the write-time block is the documented avoidance. The audit harness (run at 5k/7.5k/10k) is the early-warning instrument — above a 15% prose-vs-graph contradiction rate, the project has hit the failure mode regardless of the thesis.

The narrowed originality (Topic G). The coupling-itself and the three-soul split both have substantial precedent (Glorantha and Sandman for mass-exchange; Egyptian and Pullman for the multi-part soul). Only the combination plus the inversion — identity in the shortest-lived, forgetting-terminated stream, with worship, death, and identity all routing through Celestia — is unattested. The orchestrator has already edited `arc.md:46` to this narrower claim; it is noted here for completeness, not as an open action.

The missing-event-entity sequencing constraint (Topic E). The era carve and its boundary linter cannot activate until the boundary `event` entities exist — the corpus holds five events and none is the God War. Activating `era-boundary-event-required` before authoring `event-god-war`, `event-hykravones`, `event-ezz-rift`, `event-walk-of-elves`, `event-eyachria-gaea`, and `event-world-fire` would error on the entities the carve is meant to fix. This is a hard prerequisite, not a preference.

---

## Sequencing

Dependency analysis across the topics yields a partial order rather than a single line, but two gates dominate.

The cheapest gate to lose is the worships discriminator (catalogue item 2, Topic A). Every `culture/worships` edge authored before the `kind` discriminator lands must be retrofitted, and retrofit cost grows linearly with edge count. Ship the discriminator decision before any daemon-roster authoring. Topic G reinforces this from the other side: daemons cannot be sized or authored before the seven majors are locked (Foundation #2) and the `sentAcross` edge is decided, or Failure Mode 1 begins immediately. So the order into Foundation #1 is: lock the seven majors → decide the worships discriminator and `sentAcross` → author dead daemons first.

The hard prerequisite is the missing event entities (Topic E). The era entities (Foundation #4) and their boundary linter cannot land until the six boundary `event` entities are authored. This makes Foundation #4's true first step an event-entity audit and authoring pass, and it makes the date-sanity linter check (Foundation #5, check 7) downstream of Foundation #4.

The recommended ship order:

1. Lock the seven majors (Foundation #2) — coherence constraint everything else leans on; prerequisite for daemon authoring.
2. Decide the worships discriminator, the daemon `lifecycle`/`domain` fields, and the `sentAcross` edge (catalogue items 1, 2, 3, 17) — the gates that are most expensive to retrofit.
3. Ship the write-time blocking linter checks 1–6 plus the report-only missing-gesture, dangling-cause, and tier-inflation checks (Foundation #5) — these need no unauthored entities and the missing-gesture count is the prerequisite for evaluating the depth thesis.
4. Author the six boundary event entities, then the seven era entities, then activate the era and date-sanity checks (Foundation #4, then the remaining Foundation #5 checks).
5. Author dead daemons first, then current (Foundation #1).
6. Author `plane-labyrinth.md` (independent; can run in parallel with any of the above).
7. Run the Dalizi pincer prototype last (Foundation #6) — five chains, three-layer cap, flip-side in lockstep, gated on lint and a second-author read before any second region.
