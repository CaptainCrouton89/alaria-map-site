# Review findings — calendar/economy/faction improvement run

Independent quality gate. Findings appended incrementally as confirmed. Severity: CRITICAL (canon/invariant breach) / MAJOR (style or quality miss needing fix) / MINOR (polish).

Out of scope (per task note, do not re-litigate): build+lint pass errors:0; creature-hykravones vs race-dwarf-trakkozur contradiction (staged Gray Order lever); red platinum as new prose-only material (accepted flag).

---

## Adjudications (6 known-suspect items)

### #1 DEEP-TIME SEAM (Craggus↔Lost Ages) — MAJOR (real contradiction, must-fix)

VERDICT: Real contradiction, not acceptable deep-time fuzz. It is a systematic 3,376-yr offset (exactly the SD-epoch constant) — the very double-count this pass set out to kill — and it creates an era OVERLAP, which `.pi/rules/era.md` explicitly forbids ("An era's opening and closing dates must not contradict the dates on its neighbors").

Evidence:
- `era-age-of-craggus.md:25` sub-header "Craggus' Reign: 45,000–30,000 years ago" → reign ends 30,000 **years ago**.
- `era-lost-ages.md:18` "It spans 30,000–10,209 **BSD**, beginning with the Laughing Plague that ended Craggus' reign." → Lost Ages begins 30,000 **BSD**.
- `systems/calendar.md` Era-ranges table lists both side by side: "The Age of Craggus | 45,000–30,000 years ago" and "The Lost Ages | 30,000–10,209 BSD".
- By the pass's own conversion (years-ago = BSD + 3,376): 30,000 BSD = 33,376 ya. So the Lost Ages actually begins at 33,376 ya while the Age of Craggus runs until 30,000 ya → both eras claim 33,376–30,000 ya (a 3,376-yr OVERLAP). Equivalently: the Laughing Plague (30,000–28,800 BSD = 33,376–32,176 ya) is said to *end Craggus' reign*, yet falls *inside* the Age of Craggus's stated 45,000–30,000-ya span. Internally inconsistent.

Root cause: the number "30,000" was reused across two different units. The boundary instant is the same event (Laughing Plague ends Craggus' reign = Lost Ages begin), but it is written 30,000 ya on one side and 30,000 BSD on the other.

CHEAPEST CORRECT FIX (keeps all 25+ downstream BSD sub-period dates frozen, per cosmology log): re-express the Age-of-Craggus END in years-ago to match 30,000 BSD = ~33,400 ya. Three touch-points:
  1. `era-age-of-craggus.md:25` header → "Craggus' Reign: 45,000–~33,400 years ago" (and adjust the "next fifteen thousand years" prose → ~11,600 yr, or soften to "the millennia of his kingship").
  2. `systems/calendar.md` table row → "The Age of Craggus | 45,000–~33,400 years ago (ends 30,000 BSD)".
  3. Confirm nothing else dates Craggus' end at "30,000 ya". (era-lost-ages BSD dates and blurb stay as-is.)
Do NOT instead shift the Lost Ages to 26,624 BSD — that would move the 25+ referenced sub-period dates.

### #1b WORLD FIRE vs CALENDAR ZERO — MAJOR (new inconsistency introduced by the rewrite)

The rewritten `calendar.md` asserts the World Fire and 0 SD are the *same instant*, which contradicts the corpus-wide (and its own table's) dating of the World Fire at ~10 BSD.

- `systems/calendar.md:11`: "Its opening year, 0 SD, and the World Fire's zero are the same instant; the two reckonings meet there, and the seam is exact rather than a conversion." — claims World Fire = 0 SD exactly.
- `systems/calendar.md:38` (own table): "— The World Fire | ~10 BSD" — places it at 10 BSD, i.e. ~10 years *before* zero.
- `systems/calendar.md:9`: "a date written 9,950 BSD fell 9,950 years before the World Fire" — wrong if World Fire = 10 BSD (it would be 9,940 yr before the Fire); BSD counts back from the 0 threshold, not from the Fire.
- Invariants Calendar row: "(~10 BSD = calendar zero)" — literally equates 10 BSD with zero (10 ≠ 0).
- `era-great-expansion.md:28` sub-header "The World Fire: 10 BSD" inside an era ranged "9,950–0 BSD"; `era-modern-era.md:23` "It closed at the World Fire, around 10 BSD" for an age ranged to 0 BSD; `event-world-timeline.md:37` "The World Fire | ~10 BSD"; many entities write "World Fire (10 BSD)". The established canon is firmly World Fire = ~10 BSD, ~a decade before the 0 SD/BSD boundary. The original invariant correctly hedged ("World Fire (10 BSD) ≈ year zero").

The rewrite over-tightened "≈ year zero" into "= calendar zero / same instant / exact," manufacturing the contradiction. Severity MAJOR (only a ~10-yr wobble, but it is in the authoritative dating doc, on its central anchor, and self-contradicts its own table).

CHEAPEST FIX (keep World Fire = ~10 BSD everywhere; do not touch the 100+ refs):
- `calendar.md:9`: "9,950 years before the World Fire" → "9,950 years before calendar zero (0 SD)".
- `calendar.md:11`: reword to "0 SD sits at calendar zero — the threshold the surviving calendars fixed in the World Fire's immediate aftermath (the burning itself fell about a decade earlier, ~10 BSD). The two reckonings meet at that threshold, an exact seam rather than a conversion."
- Invariants Calendar row: "(~10 BSD = calendar zero)" → "(calendar zero = 0 SD, fixed just after the World Fire of ~10 BSD)".
- `era-modern-era.md:23`: "closed at the World Fire, around 10 BSD" → "closed at calendar zero, the decade after the World Fire (~10 BSD)".

### System-doc coherence (economy / currency / technology) — PASS (observations only)

- `systems/economy.md`, `systems/currency.md`, `systems/technology.md` each match their invariant rows faithfully and stay in lane: economy owns goods/tolls/commodity map and defers money to currency.md; currency owns metal standards/reserves/credit and defers prayer to daemon-economics.md; technology bounds the tech ceiling. Adjudication #5 lane-separation (mortal money / goods+tolls / divine prayer): CLEAN — no cross-contradiction. The three files explicitly cross-defer.
- Aldriktch members listed identically in economy.md and currency.md (Erasnus, Watar, Myorna, Camaran, Bestacia, Ubrik = six). Consistent with both invariant rows.
- Style: systems/ docs use `#`/`##` headers (matches existing calendar.md/seasons.md convention); the entity-file "### only" rule does not apply to reference docs. No boldface, copula intact, burstiness good across all three. No findings.
- MINOR (naming-collision risk, polish): the cluster Aldriktch (alliance + harbor) / Adrak (bank) / Adron (kingdom) / Aldrichold (grain exchange) are five distinct referents with near-identical openings. Not a synonym-cycling violation (different referents), but a reader-confusion hazard. No fix required; flagged for awareness.

### #2 COGHEAD MISMATCH — CRITICAL (canon breach; race-goblin-coghead.md contradicts the new Technology invariant)

VERDICT: Real, breaking mismatch. `race-goblin-coghead.md` (standalone, NOT touched this pass) still frames Cogheads as cover-less mechanical/cyborg sci-fi, directly contradicting (a) the recast Coghead block in `race-goblin.md`, (b) `systems/technology.md`, and (c) the Technology invariant row.

Conflict:
- Invariant Technology row: "Aciabro/Coghead **fleshcraft**... (surviving fragments of a lost craft)".
- `systems/technology.md` "The Aciabro and Coghead goblins are a surviving fragment of the lost craft. Their augmentations are handmagic-cut and fed on aether and blood, **not bolted-on machinery**."
- `race-goblin.md:32` "Coghead — Goblins of Kobuk who graft aether-fed augmentations into their own flesh, a surviving fragment of a lost craft"; `:65` "an aether-fed augmentation cut into your own body... a relic of a lost art."
- BUT `race-goblin-coghead.md:7` (blurb) "Flesh-and-machinery goblins... integrate **mechanical** augmentations directly into their bodies"; `:19` "the marriage of flesh and machinery... perfecting the art of **mechanical augmentation**, replacing or enhancing their natural body parts with intricate contraptions and **gear-driven devices**"; `:21` "Cogheads integrate **machinery** directly into their bodies, becoming **living testaments to their engineering prowess**." This is precisely the "bolted-on machinery" framing the invariant and technology.md now forbid.

WHAT race-goblin-coghead.md NEEDS (the fix):
- Recast all "mechanical augmentation / intricate contraptions / gear-driven devices / machinery / engineering prowess" prose to "aether-fed, handmagic-cut grafts fed on aether and blood — a surviving fragment of a lost craft," mirroring `race-goblin.md` and `technology.md`.
- `:7` blurb → adopt race-goblin.md's line ("graft aether-fed augmentations into their own flesh, a surviving fragment of a lost craft").
- `:19` "massive hollowed-out machine in Kobuk" → reframe as a relic/fragment of the lost craft, not a contemporary machine they built.
- BONUS (style, while rewriting): `:21` "living testaments to their engineering prowess" — "testaments" is banned AI-vocab; "intricate" (`:19`) is banned AI-vocab. Drop both.

### #3 AETHER FRAMING — PASS (no residual "chemistry/not-native-magic" drift)

The retracted framings are GONE and correctly inverted:
- `magic-aether.md:13` "not one of the four native sources"; `:15` "Drawing it out is **not chemistry**. It is an exotic working."
- `overview-magic.md:34` "not one of the four sources, but... not mundane matter either... no reproducible chemistry but an exotic planar craft."
- `plane-astral-currents.md:77` "not native to the world and not one of the four sources... an exotic working, **not a chemistry** that could be taught from a manual."
Aether is consistently foreign (Lanthornia), exotic, explicitly NOT a 5th source. No "chemistry, not magic" or "not native magic at all" survives.
OBSERVATION (acceptable): the "behaves much like a steam engine / drives pistons / turns propellers" simile appears in magic-aether.md:17, plane-astral-currents.md:79, and technology.md — but each instance is immediately fenced ("not a combustion any foundry could scale"). Consistent and bounded; matches the invariant ("propulsion, not a power grid"). No fix needed.

### #4 AETHER vs AETHERIUM/AETHERIAL TERM BLUR — MAJOR (latent, concentrated in technology.md)

Three distinct referents carry near-homograph names, used *correctly* per file but never disambiguated where they collide:
- "aether" = Lanthornian sky-fuel (magic-aether, overview-magic, plane-astral-currents, economy, technology).
- "lanthornium" = the gray-blue catalyst stone from Lanthornia (magic-aether.md:19 dedicated section; plane-astral-currents.md:79). Cleanly distinguished — no blur.
- "aetherium" / "aetherial" = the LOST Kethic industrial high-water mark (era-age-of-craggus, era-lost-ages, technology.md "what the mage-kings called aetherial magic, which is to say Kethic elementalism").

The blur risk is real and lands in `systems/technology.md`, the one doc that juxtaposes "aetherium/aetherial" (lost Kethic) and "aether" (Lanthornian) without flagging that they are unrelated. A careful reader can read the goblin aether sky-trade as a remnant of the lost Kethic "aetherium" civilization. It is not — aether is a post-eruption foreign import.
FIX (MAJOR-leaning-polish): add one disambiguating clause in technology.md "The lost height"/"The bounded exceptions" boundary, e.g. "(the lost height's *aetherium* is Kethic elementalism and has nothing to do with the foreign *aether* the goblins burn)."

### #4b TECHNOLOGY.MD "LEAVINGS" OVERREACH — MAJOR (internal + cross-file coherence)

`systems/technology.md` "## The lost height" claims universality: "the advanced pockets... **They are leavings**. ...**Every surviving marvel** sits in the same relation to the lost age." That overstates. The Technology invariant reserves "surviving fragments of a lost craft" for ONLY Aciabro/Coghead fleshcraft + Techgnome relics. The other exceptions are not leavings of the lost Kethic age:
- Aether sky-industry is FOREIGN (Lanthornian, post-eruption) — explicitly not a remnant (contradicts the very next section's own "rained down from Lanthornia").
- Gruynmar gunpowder and Ohblex/Camaran clockwork are LIVE racial/guild secrets, not relics.
- Force-crystal/leyline "magic as industry" is ongoing, not a leaving.
This is the same blur as #4: lumping foreign aether under "leavings of the lost height."
FIX: scope the universal down — "Most of the surviving marvels sit in the same relation to the lost age" and add the aether-is-the-exception clause (it is fenced by monopoly, not by being a relic).

### #5 CURRENCY/ECONOMY/DAEMON-ECONOMICS CONSISTENCY — PASS

- Lane separation clean (see system-doc note above): currency = mortal money/credit; economy = goods/tolls/commodities; daemon-economics = divine prayer (a life-tithe, "no coin, mark, or head of cattle touches it"). No contradiction.
- Titan-bone reserve: currency.md "reserve of last resort... roughly nineteen parts in twenty held by Deo Esari" == economy.md "~95% from Deo Esari" == invariant Economy row "~95%". 19/20 = 95%. Consistent.
- Red gold vs red platinum: stated consistently and the distinction is guarded:
  - `magic-red-gold.md:15` red gold "turns aside elemental Kethic" (turns Kethic). Does not mention/conflate red platinum. Consistent by omission.
  - `currency.md` red gold turns Kethic; red platinum "does not turn Kethic. That single difference is how a true Crimson Crown is told from a forgery."
  - `adron.md:39` red platinum "a hundred times scarcer and a different metal entirely"; author-notes `:66` explicitly forbids future conflation ("red gold turns Kethic, red platinum does not... Do not let any future edit conflate the two").
  - Invariant Currency row matches. PASS.
- race-goblin.md's Coghead/Aciabro recast (this run) correctly aligns with technology.md/invariant (aether-fed/handmagic-cut, "surviving fragment of a lost craft"). The only outlier is the un-touched race-goblin-coghead.md (finding #2).
OBSERVATION (pre-existing, not a regression): race-goblin.md retains boldface list lead-ins ("**Coghead**", "**Aether-lens eyes:**", "**Passive ability.**"). This is pre-existing corpus debt (heritage list was already bold); the run edited within it without adding new bold. Low priority; drop on next touch per the no-boldface standard.

## Calendar-cluster entities

### person-bryn.md — PASS (Faesong canon call coherent; style cleaned)
- Faesong-not-prayer distinction stated plainly and correctly: "What the congregations work is Faesong — Melera's harmony-aspect of Ezz... Bryn keeps no reserve, takes no tithe, and grants no miracle." Coherent with the four-source Magic invariant and the updated Seasons row. No contradiction.
- Style: italic emphasis (*is*/*want*/*woke up*) removed; headers sentence-cased ("The awakening", "The faithful"). Good.
- OBSERVATION (not a defect): per `cosmology-decisions.md` this Bryn-singing = Faesong call is flagged "Needs user sign-off." It is internally coherent and ready, but it is an unratified canon call — surface for sign-off, do not treat as landed canon.
- MINOR (pre-existing, not a regression): retains tight em-dashes ("construct—the largest") and the triad "navigators, farmers, and seasonal priests" — both pre-existing; drop on next touch.

### plane-stars-suns-and-moons.md — PASS (Killing Moon / Celest coherent; style cleaned)
- Third-moon now leads with "stabilizing keystone of the whole lunar resonance" and demotes the Celest-moon claim to a temple belief "the rest of the cosmology does not support... Celest sealed her selfhood in Celestia's core and left no moon-body behind." Matches Celest-origin invariant (§10) and the cosmology-log Killing-Moon answer. Coherent.
- "Unlike Aurus and Nydus, which are dissolved titan-gods, it is a construct that gained consciousness" — matches Celest-origin row. Good.
- Style: boldface view-labels ("**The Orthodox View:**" etc.) and italics (*is*/*aware*/*revealed*) removed; headers sentence-cased. Good cleanup.

### plane-time-and-seasons.md — PASS with two small flags
- Great Cycle reframed to "cyclical position... read, never used to date events — that work belongs to SD/BSD alone." Matches calendar.md. Eight quarters (Kindling/Greenreach/Highsun/Goldreap/Greysky/Lowlight/Deepcold/Stillturn) and four solar holidays (Newlight/the Crown/the Last Sheaf/the Hearthhold) are new, coherent. Full-date example "Marketday, the 14th of Highsun, 3376 SD" matches calendar.md exactly. Time Puzzle 312 SD and Dark-Ages-war-end 231 SD match era-seventh-dawn. Good.
- FLAG (rolls into #1b): `:42` still reads "counts forward from the World Fire (approximately 10 BSD), which functions as the epoch. BSD counts backward from that same threshold." This is the same World-Fire-IS-zero conflation as #1b, left un-reconciled although the pass touched this file. Apply the #1b fix here too.
- MINOR (calendar-cluster wobble): `:24` "the two faces coincide only every 253 days... and that coincidence is the double full moon (Brightnight) or the double new moon (Hollownight)" reads as if each 253-day coincidence is one OR the other. calendar.md treats both Brightnight AND Hollownight as returning on the 253-day cycle (both occur, ~half a super-cycle apart). Reword to "both full (Brightnight) or both new (Hollownight), the two falling about half a cycle apart" for agreement with calendar.md.

### #6 FACTION LEVERS (6 deepened + order-of-bryn) — PASS (all clear the faction.md bar)

Sub-review in `context/review-findings-factions.md` (factions child) — independently spot-verified by the gate on the two highest-stakes items:

- faction-order-of-bryn.md (NEW): GENUINE, Alaria-specific, UNRESOLVED lever, staged as a full named section ("The band and the weapon"): hawks want to break the Solar Accord's seasonal-band limit to strand a rival northern coalition in permanent winter (an open sun-war by the body that outlawed sun-wars); institutionalists hold that doing so forfeits the Accord that legitimizes the monopoly/sun-tax/law-of-light. Neither has carried the synod, and the clock is the aging institutionalist Precentor with no named successor. This is exactly the faction.md model (a live dispute, not decorative ambiguity). Author-notes are exemplary (open threads — Kryaaji sect, the Vykus — respected per the Seasons partial-open; edges deliberately scoped). STRONG.
- The five deepened factions each carry a real lever (per the child's lever table, all with named parties + a concrete unresolved question): ivory-hand "the volume question," druids "whether to make again," soldiers-of-the-third-eye "what the eye is for," elves-of-the-gray-order "wake him or wait" (rests on the deliberately-staged hykravones/trakkozur contradiction — out of scope per task), first-brotherhood "the dues and the prayers." None decorative.

VERDICT: all six (+order-of-bryn) clear the lever bar. No faction falls short. The child found only polish-tier issues (a recurring but defensible "not X but Y" antithesis tic across 4 lines; a few rule-of-three triads incl. the order-of-bryn blurb; moderate em-dash density). See the sub-file for line-level detail.

### house-of-the-second-sun retype (faction → city) — PASS (coherent; id immutable honored)
- `id: "faction-house-of-the-second-sun"` UNCHANGED across the retype (critical per CLAUDE.md). ✓
- entityType faction → city; added `spatial/within → plane-astral-plane` and `polity/ruledBy → person-gihatti`. Body rewritten as a city with a genuine contested-legitimacy lever (is Gihatti's kingship sovereignty or a title over will-less soul-husks — canon-reinforced by plane-astral-plane.md "no one rules them"). Coherent.
- No coordinates/zoomLevel and not in `data/pinned.json` — correct: it is an Astral-Plane city with no material-map pin, and the build passes (errors:0). The pinned.json deletion this run is id 2399 (a water feature), unrelated to this retype. No map breakage.

### #1 (cont.) — the Craggus/Lost-Ages seam is SYSTEMIC, present in 3 places
The 30,000-ya-vs-30,000-BSD seam from #1 appears identically in: `systems/calendar.md` era table, `event-world-timeline.md` Era Index (rows 7 vs 8: "The Age of Craggus | 45,000–30,000 years ago" / "The Lost Ages | 30,000–10,209 BSD"), and the two era files. event-world-timeline.md is otherwise well-reconciled (its new author-notes document the years-ago↔BSD convention correctly). The #1 fix must update all three surfaces, not just the era files.

## Currency/banking entities (gate spot-checks; full sweep in review-findings-entities.md)

### faction-aldriktch-trade-alliance.md — typos FIXED (the three flagged) + new levers good; small residuals
- The three flagged misspellings are fixed: "entie"→"entire", "threated"→"threatened", "canabalistic"→"cannibalistic". ✓
- New content (the Strugmar/Watar capped-tariff-dodge precedent ~3306 SD; the Sivakr-signature grain-bond court dispute hostage to Watar's slow venue) adds genuine Alaria-specific levers. Currency wiring ("reckoned in the Aldriktch standard... mint... seal under Foedros... `currency.md`") is coherent with currency.md. Straight quotes used. Clean style.
- MINOR residuals (pre-existing, on the partially-edited line `:20`): "spear headed" → "spearheaded"; "from both Myorna, Ubrik, and Bestacia" ("both" + three names → "among"); elsewhere "the Watari and Bestacians relations" → "Bestacian". Worth fixing while in the file; not blocking.

## Tech-bounding + currency entities — endorsed from sub-review (context/review-findings-entities.md), with gate severity calls

### `currency.md` IN-BODY REFERENCE — MAJOR (NEW this run; dangling player-facing link in 11 files)
Confirmed: 11 entity files reference `currency.md` in player-facing body prose (aboyinzu, adron, daemon-bylzar, daemon-foedros, dalizi-confederation, faction-aldriktch-trade-alliance, kyagos, person-belmonte, plane-bank-of-infindior, rimihuica, upoceax). `currency.md` is a `docs/worldbuilding/systems/` doc, NOT a codex entity, so the backtick reference resolves to nothing in the public codex. Verified this is a NEW pattern: NO pre-existing entity references any systems doc (`seasons.md`/`calendar.md`/`daemon-economics.md`/`magic.md`/`economy.md`/`technology.md`) in its body — the established backtick convention is entity→entity links that resolve to a codex page. These read as author-notes leaked into player text.
FIX (corpus-wide, pick one): (a) author a `currency`/economy overview ENTITY so the ref resolves, or (b) drop the literal filename and phrase as "the wider money system" / "the southern standard." Same issue likely applies to the new economy.md/technology.md cross-refs if any entity points at them.

### daemon-bylzar.md:25 "last Tuesday" — MAJOR (real-world weekday; setting break)
"Foedros is the single enforceable signature, the deal sealed last Tuesday." Tuesday is a real-world weekday with no place in the now-canonical Alarian 11-day week (Cautious/Wakeday/Patrons' Day/Moil/Marketday/Merrynight/Brightlove/Lazyday/Farewell/Gather/Fireday — set THIS run in calendar.md). Jarring anachronism in encyclopedic register, doubly so right after the calendar pass canonized the week. FIX: "the deal sealed this week" / "the bargain struck on Marketday" / "sealed yesterday."

### dalizi-confederation.md `## Money` — MAJOR (banned header level, introduced this run)
Style guide: "Headers use `###`, `####`, or `#####` only, never `#` or `##`." The new Money section uses `##`. (Pre-existing `## Governance`/`## Key Sub-Regions`/`## Political Tensions` share the violation — demote the whole file to `###`/`####` while in it.)

### kyagos.md:21 — MAJOR (em-dash overuse, introduced this run)
New sentence carries an em-dash PAIR ("...minted coin — worn openly here, and scarred like the men who carry it — priced against..."). Guide caps at one per sentence. FIX: parens or recast.

### #4 EXTENSION — "aether weaver goblins" vs "Etherweaver" heritage NAME COLLISION — MAJOR
Beyond the aether/aetherium/aetherial homograph (#4): the fuel-extractors are "aether weaver goblins" (magic-aether, plane-astral-currents, overview-magic), while race-goblin.md carries a SEPARATE "Etherweaver" heritage (Kethic non-basic-element attunement) — canonically two different goblin groups with near-identical names and OPPOSITE substance (off-world fuel vs native Kethic). The corpus actively conflates them: yuki.md ("etherweavers — the aether-producing goblin variant"), hills-of-red-gold.md, morgnor-s-cradle.md, creature-morgnor-dragon.md. The aether reframe cleaned the three core files but left the collision. FIX (naming decision for the orchestrator): rename one side (e.g., fuel-goblins → "aether-tappers", or move the Kethic heritage off the "ether" stem) and de-conflate yuki/morgnor/hills-of-red-gold. (Out of this run's file set, but the task asked the question — it is real and corpus-wide.)

### AFFIRM — clean tech-bounding adds (matches gate's independent spot-checks)
- race-goblin-aciabro.md: correctly recast to handmagic-cut, life-spending, "surviving fragment of a lost craft" (blood-fuel vs Coghead aether-fuel split coherent). This is the fixed TWIN of the still-broken coghead file (#2) — confirms the pass simply missed the orphaned standalone.
- race-dwarf-gruynmar.md ("never written down and never sold... a dangerous gunner, not the seed of a gunpowder trade"), race-ogre-silzar.md ("not a second gunpowder people but the rare landward customers"), race-gnome-ohblex.md, mkinti.md, camaran.md ("#### The cost of the ban" — strongest add) all match the Technology invariant's monopoly-input bounding precisely. No action.

### MINOR (polish, mostly pre-existing boldface debt)
- adron.md:43-49 boldface mountain labels + Title-Case `#### Mountain Ranges` (pre-existing).
- plane-astral-currents.md: residual bold list-labels in "Major Trade Hubs" / "Cultural Attitudes" (em-dash purge was thorough; finish the bold cleanup).
- overview-magic.md:12 burstiness regression ("Magic in Alaria is not one thing. It is four..." → "has four sources") — flatter on the most-read magic page; the original was NOT a banned construction. Optional revert.
- upoceax.md:48 "weighed, not counted" borderline antithesis; aldriktch residual grammar (above); dalizi "every single time" colloquialism.


---

# OVERALL VERDICT

The run is strong work — the three new system docs are coherent with their invariant rows and stay cleanly in lane, the aether sci-fi/chemistry drift is genuinely fixed, the currency consistency (red-gold vs red-platinum, titan-bone reserve) is tight and even self-guarded, all seven factions clear the faction.md lever bar, and the tech-bounding adds (aciabro/gruynmar/silzar/ohblex/mkinti/camaran) match the Technology invariant precisely. But it is NOT landable as-is: one canon breach and a cluster of dating/style misses must be cleared first.

## MUST-FIX before merge (blocking)

1. CRITICAL — race-goblin-coghead.md contradicts the locked Technology invariant + its own parent race-goblin.md + technology.md (mechanical-cyborg "engineering tradition / intricate contraptions / gear-driven devices / living testaments to engineering prowess" vs the new aether-fed, handmagic-cut "surviving fragment of a lost craft"). The pass fixed the twin (aciabro) and the parent but orphaned this standalone. Rewrite blurb + body + Aspects to the lost-craft/aether-fed framing; strip banned "intricate"/"testaments"/"prowess." [#2]

2. MAJOR (borderline CRITICAL) — Deep-time seam: era-age-of-craggus ends "30,000 years ago" while era-lost-ages begins "30,000 BSD" (= 33,376 ya by the invariant's own years-ago = BSD + 3,376), creating a 3,376-yr era OVERLAP that violates era.md and the Calendar invariant's own conversion. Present in calendar.md table, event-world-timeline Era Index, and the two era files. Cheapest fix: re-express the Age-of-Craggus END as ~33,400 ya (= 30,000 BSD), leaving the 25+ downstream BSD sub-period dates frozen. [#1]

3. MAJOR — World Fire dating self-contradiction: the rewritten calendar.md asserts 0 SD and the World Fire are "the same instant... exact," contradicting the corpus-wide (and calendar.md's own table) "World Fire ~10 BSD." Echoed in the invariant Calendar row ("~10 BSD = calendar zero"), plane-time-and-seasons.md:42, era-modern-era.md:23. Fix: keep World Fire = ~10 BSD as the event; make 0 SD the threshold fixed in its aftermath; drop "same instant." [#1b]

4. MAJOR — `currency.md` dangling in-body reference in 11 entity files (NEW pattern; resolves to nothing in the public codex). Author a currency/economy overview entity, or drop the literal filename. [entities-endorsed]

5. MAJOR — technology.md "leavings" overreach: "Every surviving marvel sits in the same relation to the lost age" wrongly lumps foreign aether (Lanthornian) and live racial secrets (gunpowder, clockwork) under remnants of the lost Kethic height. Scope the universal down and flag aether as the foreign exception. [#4b]

6. MAJOR — terminology: aether (Lanthornian fuel) vs aetherium/aetherial (lost Kethic) homograph is undisambiguated where technology.md juxtaposes them; and "aether weaver goblins" collides with the distinct Kethic "Etherweaver" heritage, actively conflated in yuki/morgnor-s-cradle/hills-of-red-gold. Add a disambiguating clause in technology.md and make a naming decision for the goblin collision. [#4 + extension]

7. MAJOR — quick localized fixes: daemon-bylzar.md:25 "last Tuesday" (real-world weekday not in the Alarian week); dalizi-confederation.md `## Money` (banned header level); kyagos.md:21 em-dash pair. [entities-endorsed]

## SHOULD-FIX (non-blocking)
- aldriktch residual "spear headed"→"spearheaded" + "both [three names]" grammar (the three flagged typos ARE fixed).
- plane-time-and-seasons.md:24 Brightnight/Hollownight cadence wobble (agree with calendar.md that both return on the 253-day cycle).

## OPTIONAL (polish)
- Pre-existing boldface debt in reviewed files (race-goblin heritage labels, adron mountain labels, plane-astral-currents trade-hub/attitude labels); overview-magic.md:12 burstiness regression; upoceax.md:48 antithesis; the Aldriktch/Adrak/Adron/Aldrichold naming-collision awareness; person-bryn pre-existing tight em-dashes.

## TWO UNRATIFIED CANON CALLS (coherent, but pending user sign-off — not defects)
- Bryn-singing = Faesong (person-bryn / seasons.md) — internally consistent with the four-source Magic invariant; flagged "Needs user sign-off" in cosmology-decisions.md.
- ~13,500-ya re-dating of the Shattering — flagged for user confirmation in cosmology-decisions.md.

## CLEAN / PASS (no action)
System-doc coherence (economy/currency/technology) with invariant rows; #3 aether-framing drift fixed; #5 money/goods/prayer lane separation + red-gold/red-platinum/titan-bone consistency; #6 all faction levers; house-of-the-second-sun retype (id immutable honored, no map breakage); calendar-cluster coherence (Killing Moon/Celest, Great Cycle reframe, full-date examples); clean tech-bounding adds.

LANDABLE after must-fix items 1–7 are cleared (item 1 is the only hard canon breach; items 2–3 are the dating-integrity fixes the whole subsystem pass exists to deliver; 4–7 are mechanical). Should-fix and optional can follow.
