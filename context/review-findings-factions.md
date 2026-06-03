# Style-sweep review — faction entities

Read-only quality gate against `docs/worldbuilding/lore-style-guide.md` and `.pi/rules/faction.md`.
Files reviewed (git diff HEAD inspected for each):

- `faction-order-of-bryn.md` (NEW — untracked, no diff baseline)
- `faction-the-ivory-hand.md`
- `faction-druids.md`
- `faction-soldiers-of-the-third-eye.md`
- `faction-elves-of-the-gray-order.md`
- `faction-first-brotherhood.md`
- `faction-house-of-the-second-sun.md` (faction → city retype)

Severity key: CRITICAL (block) / MAJOR (should fix) / MINOR (polish) / OBSERVATION (noted).

---

## Mechanical sweep — corpus-wide result

Ran across all 7 bodies (author-notes excluded where stripped):

- **Boldface (`**`)** — NONE. Clean.
- **Curly quotes / smart punctuation** — NONE. Straight quotes throughout. Clean.
- **AI-vocab** (delve/tapestry/intricate/testament/vibrant/pivotal/showcase/underscore/foster/garner/crucial/enduring/enhance/highlight/interplay/key-adj/landscape/nestled/renowned/stunning/breathtaking) — NONE. Clean.
- **Copula-avoidance** (serves as / stands as) — NONE. Uses plain "is/has" throughout. Clean.
- **Filler phrases** (in order to / it is important to note / due to the fact that) — NONE. Clean.
- **Scholar-attribution crutch** ("scholars believe/note") — NONE. Clean.
- **Em-dash density** — 9–12 per file in the longer entries; every multi-dash sentence is a single *paired* parenthetical (two dashes = one construction), never stacked independent dashes. See OBSERVATION below.

No CRITICAL findings. No MAJOR findings. The prose is genuinely high-burstiness — short punchy sentences ("Elves multiplied. They filled the world. Their makers did not." / "A world can lose the sun." / "It is the next quarter." / "So the Order looked.") are doing the work the style guide's headline rule demands. Findings are MINOR/OBSERVATION polish and one recurring cross-file tic.

---

## faction-order-of-bryn.md (NEW)

- **Line 5 (blurb) — rule-of-three triad. Severity: MINOR.**
  Blurb is three tidy parallel verb-phrases: "maintains the singing rota…, collects the sun-tax, and **enforces** the law of light against unsanctioned prayer-coalitions." This is the exact tidy-triad pattern the style guide flags as the highest-signal AI tell. Blurb is a compressed summary so the bar is softer, but per the guide ("cut one, or add a fourth that breaks the symmetry") drop to two: e.g. "…maintains the singing rota that holds Bryn's warmth-band and collects the sun-tax, outlawing any prayer-coalition it has not sanctioned."

- **Line 17 — minor triad. Severity: OBSERVATION.**
  "the schedule that fixes who sings, at which latitude, in which quarter" — three parallel clauses defining the rota. Reads as a parameter list, mild; could drop to two but defensible.

- **Line 25 — negative-parallelism antithesis. Severity: MINOR (see consolidated tic below).**
  "that is **not** a closed chapter **but** the whole case for the law of light."

- **LEVER: PRESENT, STRONG.** Named: the "break the band" question, staged as a full section ("The band and the weapon"). Hawks want to drive Bryn onto a trail that strands the northern rival coalition in permanent winter (open sun-war, by the body that outlawed sun-wars); institutionalists hold that weaponizing the band openly forfeits the Accord that legitimizes the monopoly/tax/law of light. Genuinely unresolved (neither wing has carried the synod). Clock: the aging Precentor who held the institutionalist line has no named successor, so the next accession decides it. Alaria-specific to the bone (rota / sun-trail / Solar Accord / prayer-coalition / Faesong). Plus a *second* live hook (the Dawnless recruit from the Order's own clergy → internal hunt) and a *third* (the unexplained Kryaaji Lightbearer sect). Best of the set.

- **OBSERVATION:** Faesong/Bryn handling stays inside canon ("harmony rather than command," does not assert a fifth magic source). Edge targets `faction-the-dawnless` and `event-solar-accord` both resolve. No mechanics block (correct for faction rule). author-notes is the final block (correct).

---

## faction-the-ivory-hand.md

- **Line 16 — rule-of-three triad. Severity: MINOR.**
  "It **buys, sells, and ships** human beings to be killed…" Tidy three-verb triad. Idiomatic for a trade ("buy/sell/ship"), so borderline, but it is the flagged pattern. Cut to two: "It buys and ships human beings…" (selling is implied by a trade that moves bodies for buyers).

- **LEVER: PRESENT, STRONG.** "The volume question" — expand-the-trade (Bonnetaz merchants + dragons who want a working too big for the quiet trade) vs keep-it-quiet (courtly infiltrators incl. the Sylke queen, who know visibility = death). Triggered by a specific large buyer who has come forward. Unresolved; whichever wing loses can expose the winner. Alaria-specific (the Deoric blood-sacrifice arbitrage: a life in blood yields a lump sum prayer can't match). Clean lore-complication move (rule = survives by invisibility; inversion = a powerful wing wants to go loud).

- **OBSERVATION:** Edge targets resolve — `3703` → bonnetaz.md, `manual-mpjrcf71-gtrw6` → ofrenia-sylke.md. Nuance correctly carried in edge `note`, not new kinds. Unnamed Sylke queen / dragons correctly left as prose (no invented person/dragon entities). HP/calibration figures correctly kept out of player-facing prose.

---

## faction-druids.md

- **Line 37 — negative-parallelism antithesis. Severity: MINOR (consolidated tic).**
  "To make again is **not** generosity **but** a slow and dignified suicide."

- **Line 39 — negative parallelism + a near-triad close. Severity: MINOR.**
  "what a second one would unmake: **not** the humans the Gray Order despises, **but** everything — the elves, the Long-Song, the First Grove, all of it." The "not X, but Y" is the tic; the trailing "the elves, the Long-Song, the First Grove, all of it" is a triad capped with "all of it" (the cap softens it to deliberate emphasis — acceptable, noted).

- **Line 25 — three-material list. Severity: OBSERVATION.**
  "branch-wood, riverbed stone, and river-mud" is a tidy triad, but it is the *canon-fixed* recipe for elf-making (per race-elf.md), not padding. Keep. (Note the very next clause — "the long ears, the slender build, the long sight, the patience with growing things" — is a deliberate *quad* that correctly breaks symmetry. Good.)

- **TAG/TYPE: correct.** Retagged from `["race"]` → `["faction","druids","elder-race"]`; `entityType` stays `faction`. The git diff confirms the old stub's canon errors ("alive before gaea", "survived through the time of titans") were corrected to "arrived with the Ezz flood (~12 Mya)," consistent with race-elf.md and the deep-time table. Coherence win.

- **LEVER: PRESENT, STRONG.** "Whether to make again" — spend the last of themselves on one more making and end as Gaea ended (diffused, silent) vs hoard the remnant and persist sterile until a unique knowing dies out. Sharpened by the grounded inversion: the elves they already made produced the Gray Order, who pray for the very reset that would unmake the elves too. Alaria-specific (Kethic/Faesong life-cost-of-creation; Gaea's self-expenditure). Unresolved. Edge `rivalOf → faction-elves-of-the-gray-order` resolves and is two-way-grounded in prose on both files.

---

## faction-soldiers-of-the-third-eye.md

- **Line 23 — process triad. Severity: OBSERVATION.**
  "sit with a contract before it is signed, walk its branches at stretched speed, and come back with a cold sense…" — three-beat process list. Mild; reads as sequence, not padding.

- **Line 31 — anaphora triad. Severity: OBSERVATION.**
  "here is the war you have bought, here is how it ends, and here is what it would cost to bend it." Deliberate "here is…" anaphora (rhetorical, acceptable).

- **LEVER: PRESENT, STRONG.** "What the eye is for" — honor the blade and fight contracts the readers have already marked as losses (or the order becomes a winner-picking oracle no one trusts as a sword) vs husband the irreplaceable time-attuned soldiers and refuse/renegotiate read-losses (or sell the foresight itself). Triggered by a current marked-as-lost contract whose client is in the dark. Unresolved. Alaria-specific (Izzus / time-Kethic stretched-moment, with the explicit canon guard that this is NOT prophecy — the Great Cycle is the true clock).

- **OBSERVATION:** Strongest burstiness of the set. Edge `attunedTo → magic-time` resolves; cosmology-family edge correctly chosen over a forced polity edge (the order is deliberately unaligned). Canon guard against "foretells the future" is handled exactly as magic-time.md frames the Oracle Merchants.

---

## faction-elves-of-the-gray-order.md

- **Line 31 — negative-parallelism antithesis. Severity: MINOR (consolidated tic).**
  "the Waking is **not** something to be awaited **but** something to be done."

- **Lines 29 & 31 — paired action-triads. Severity: OBSERVATION.**
  Orthodox wing: "Find him, keep the vigil, and prepare the world…"; breaking wing: "find the Cascades, kill the wardens…, and cut the titan-bone…". Two tidy 3-imperative lists. The parallel between the wings is deliberate structure (each wing gets a 3-beat program), so it reads as intentional rather than lazy — but it is the most triad-dense file. If trimming, the second list is the one to vary.

- **LEVER: PRESENT, STRONG, with a load-bearing caveat.** "Wake him, or wait for him" — orthodox (Hykravones chose to sleep; the dwarvish binding is a lie; keep the vigil) vs the breaking wing (he is bound in titan-bone at the Cascades of Ygg; the only Waking is to go break it and kill the Trakkozur wardens). Gives a GM a *locatable target* and a moral fault line (would the freed titan even spare the elves who woke him?). Unresolved.
  - **OBSERVATION → flag for a future owner:** the lever is built on a *real, pre-existing corpus contradiction* — `creature-hykravones.md` ("chose to rest, unfound, will wake himself") vs `race-dwarf-trakkozur.md` ("bound by Trakkozur wardens in titan-bone beneath the Cascades of Ygg"). The author correctly does NOT resolve it by unilaterally overwriting either out-of-scope file; instead the narrator asserts neither and stages the in-world epistemic split as the lever. This is defensible (the file is internally coherent and the dispute is between in-world factions, not a "scholars disagree" dodge), but the underlying two-file contradiction is now load-bearing and still needs corpus-level adjudication. Author flagged it in notes. Not blocking for this file.

- **OBSERVATION:** Edge `worships → creature-hykravones` resolves. Reverse of the Druids' rivalOf correctly NOT authored here (computed at build). "Vigil not congregation" correctly reflects that titans are not daemon-eligible / not prayer-fed (canon).

---

## faction-first-brotherhood.md

- **Line 32 — polysyndeton triad. Severity: OBSERVATION.**
  "the dues fund the rites and the embassies and the long memory" — three-item "and…and" list. Polysyndeton (deliberate rhythm), acceptable; noted for completeness.

- **LEVER: PRESENT, STRONG.** "The dues and the prayers" — three city-states (Üod, Blvnird, Melaia) monopolize leadership while the diaspora (Drasnian-heavy) supplies most of the prayer that keeps the two patrons alive. Diaspora threat: a worship-schism that retreats devotion to clan-patrons (as the Uline keep Krunites) would starve Krondeum and Grømnuul toward the remembrance-floor. Cities' bind: open the leadership (dilute the monopoly that is their only power) or hold it (risk presiding over their own patrons' death). Alaria-specific (daemon prayer-economics: prayer = life-tithe, a forgotten daemon ends). Unresolved.

- **COHERENCE WIN (verified):** The flagged Grømnuul-vs-Krunites continuity item is resolved correctly. `overview-deities.md` line 44 uses "Krondeum…and Krunites…" only as the *non-compete example* and labels the quote "a saying of the First Brotherhood clan-halls" — it does NOT name Krunites the Brotherhood's institutional patron. `daemon-krunites.md` self-describes as the *Uline* clan-patron of the first ore. The file keeps Krondeum + Grømnuul as the two pan-dwarf `worships` edges (both resolve) and treats Krunites in prose as the Uline clan-patron / first-ore half of the cartel. No residual contradiction.

---

## faction-house-of-the-second-sun.md (faction → city retype)

**Required verification (per task):**

- **entityType is now `city`** — CONFIRMED (git diff: `faction` → `city`). ✓
- **`id` unchanged** — CONFIRMED. Still `id: "faction-house-of-the-second-sun"`. The `faction-` prefix now mismatches the `city` entityType, but per root CLAUDE.md the id is immutable and must match the original pin id, so leaving it is CORRECT, not a defect. (OBSERVATION only: the slug/id prefix is a historical artifact; renaming would break the pin.) ✓
- **Change is coherent** — CONFIRMED. The entity was always a city ("towering city built around two pillars"), so `faction` was the original mis-type; `city` is correct. New edges fit a city: `spatial/within → plane-astral-plane` and `polity/ruledBy → person-gihatti` — both resolve. No `coordinates`/`zoomLevel`: CORRECT, because this is a *planar* city on the Astral Plane (off the physical Alaria map), not a pin. No mechanics block (correct for a place). ✓

**Canon spot-check (load-bearing claims all grounded in plane-astral-plane.md):**
- "drifting islands… cliff-island… float like icebergs" ✓ (plane line 19)
- "roll over without warning when the millennial quakes shake their underbellies loose" ✓ (plane lines 19, 28)
- "soul-husks… bare strands of Aurus-light without will or purpose… crowds that never thin and answer to no one" ✓ (plane line 37, near-verbatim)
- "far below Aurus" ✓ (Aurus lights the Astral from above, plane lines 21, 33)
- Gihatti "reached Celestia and came back a god… king of the Astral Plane" ✓ (person-gihatti confirms; "king of the Astral" was pre-existing stub canon)

**Style findings:**

- **Line 16 — "the grandest of the cities." Severity: MINOR.**
  Mild promotional superlative. It is a ranking *claim* (grandest of the Astral cities) rather than empty puffery, and the rest of the para earns it (the orb, the fixed-point stability), so borderline. If tightening, "the largest" or "the chief" is more neutral; or keep and let the concrete details carry it.

- **LEVER: PRESENT but the SOFTEST of the seven. Severity: OBSERVATION.**
  The dispute — whether Gihatti's kingship is sovereignty or an empty title over will-less soul-husks — is genuine and, importantly, *canon-reinforced*: plane-astral-plane.md line 37 states outright "No one rules them… the soul-cities take their shape and shift on their own," so "a throne over a city that takes its own shape no matter who sits in it" is exact canon, not invention. Parties exist (ship-captains, the willed presences who reject the claim) and there is a concrete vulnerability ("Gihatti has never had to defend the claim against anyone strong enough to press it"). This clears the city.md "close on a live dispute" bar. It is softer than the faction levers only because no party is *currently moving* on it — it reads closer to a standing contested-legitimacy question than an in-motion conflict. Acceptable for a city entry; not decorative (it has named doubters and a named soft spot). No fix required.

---

## Lever verdict — summary table

| File | Lever named | Genuine / Alaria-specific / unresolved | Verdict |
|---|---|---|---|
| order-of-bryn | "break the band" (Precentor succession) | yes / yes / yes | STRONG (best) |
| the-ivory-hand | "the volume question" (large buyer) | yes / yes / yes | STRONG |
| druids | "whether to make again" | yes / yes / yes | STRONG |
| soldiers-of-the-third-eye | "what the eye is for" (marked-lost contract) | yes / yes / yes | STRONG |
| elves-of-the-gray-order | "wake him, or wait for him" | yes / yes / yes | STRONG (rests on a flagged corpus contradiction — see file) |
| first-brotherhood | "the dues and the prayers" | yes / yes / yes | STRONG |
| house-of-the-second-sun | Gihatti's kingship over the will-less dead | yes / yes / yes | ADEQUATE (softest; canon-reinforced, no party moving) |

All seven clear the lever bar. None is decorative ambiguity; none has an absent lever.

## Edge-target resolution — all resolve (no dangling targets)

faction-the-dawnless, event-solar-accord, 3703 (bonnetaz), manual-mpjrcf71-gtrw6 (ofrenia-sylke), daemon-eluvarin-aelweir, daemon-aelwennar, faction-elves-of-the-gray-order, magic-time, creature-hykravones, daemon-krondeum, daemon-gromnuul, plane-astral-plane, person-gihatti — all found by frontmatter `id`.

---

## Consolidated cross-file tic — negative parallelism ("not X but Y")

Recurs in 4 places: order-of-bryn:25, druids:37, druids:39, gray-order:31 (e.g. "not generosity but a slow… suicide," "not something to be awaited but something to be done"). Severity: MINOR.

The style guide's explicit ban is the "not **just/only** X, but Y" form and tailing-negation fragments — and NONE of these use "just/only," so they are the older, more defensible classical antithesis rather than the banned construction. But four instances across one batch is a noticeable authorial habit. Recommend varying one or two (e.g. recast druids:37 as "Every making is a withdrawal that never refills, and to make again would be a slow, dignified suicide…"). Not blocking.

## Em-dash density — OBSERVATION

Longer entries carry 9–12 em-dashes. Every multi-dash *sentence* is a single paired parenthetical (two dashes bracketing one aside), never two independent dashes stacked — so no sentence violates "one [construction] per sentence" under a sensible reading. A strict literal reading of "one em-dash per sentence" would flag the parenthetical pairs; most could be commas. Low priority; the density is moderate for entries of this length.

---

## Overall verdict

No CRITICAL or MAJOR issues. All seven files are publishable as-is. The prose meets the style guide's headline burstiness rule and is clean on every mechanical banned-pattern check (boldface, curly quotes, AI-vocab, copula-avoidance, filler, scholar-crutch). All seven carry a genuine, Alaria-specific, unresolved lever. The house-of-the-second-sun retype (faction → city) is correct, coherent, and canon-grounded, with `id` correctly left unchanged. Findings are polish-tier: a handful of MINOR rule-of-three triads (the order-of-bryn blurb is the clearest), a recurring-but-defensible "not X but Y" antithesis tic, and one mild superlative ("grandest"). Nothing here blocks merge.
