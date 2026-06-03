# Faction audit — mega-factions of Alaria

Read-only audit of all 23 `entityType: faction` entities against `.pi/rules/faction.md` and
`docs/worldbuilding/lore-style-guide.md`, with scope tiering, quality assessment, edge hygiene,
coverage gaps, and a prioritized improvement plan. No files were changed.

Quality ceiling for comparison: `faction-the-concordance.md` and `faction-dead-moon-tribe.md`
(both carry a full staged "unresolved question" section that is a GM lever).

Tier definitions used here:
- **MEGA** — operates at world / continent scale across multiple polities; a bloc the world negotiates with.
- **Regional** — acts across one nation/region or a tight cluster; significant but bounded.
- **Local** — a single locale, a small order, or a stub with no scale.

---

## 1. Inventory + scope-tier table (all 23)

| # | File | Tier | Quality | One-line state |
|---|------|------|---------|----------------|
| 1 | `faction-the-concordance` | Regional (Sestros) / world-system lever | **Exemplar** | Scholar-order secretly auditing a daemon's failing prayer-reserve; staged succession-crisis lever. Quality ceiling. |
| 2 | `faction-dead-moon-tribe` | Regional (Kyagos/Moonwood) | **Exemplar** | Displaced human resistance under Nyxara; staged Moonwatcher-origin dispute + live negotiation. Quality ceiling. |
| 3 | `faction-tolarian-mage-kings` | **MEGA** (Old Tolaria dynasty; world-magic consequences) | **Exemplar** | Seven-gen "clean working" dynasty; Vesimar the Unsevered still loose = live lever. Strong. |
| 4 | `faction-iron-of-the-eternal-march` | **MEGA** (Gorath imperial war-faith) | **Exemplar** | Conquest-faith that appropriated the dwarves' forge-daemon; Serel schism = staged orthodoxy lever. Strong. |
| 5 | `faction-the-moonwatchers` | **MEGA** (continent-wide apocalyptic cell-cult) | **Exemplar** | Third-Moon literalists; four readings of the return, dangerous cells. Has mechanics + author-notes. Strong. |
| 6 | `faction-the-dawnless` | **MEGA** (sect inside every prayer-coalition) | **Exemplar** | Heresy that the sun has a right to stop; mercy-wing vs "let it freeze" fringe = live lever. Strong. |
| 7 | `faction-anchor-vessel-priesthood` | **MEGA** (Golden-Age keystone class under the whole pantheon) | **Strong** | The binders every cult depended on; collapse doomed the pantheon; intact-but-unusable rite = GM hook. Historical w/ live residue. |
| 8 | `faction-pity-knights` | MEGA-historical (best lich-hunters ever; defunct) | **Exemplar** | Oath broken from inside (Xynoth → Chaal Nazzerox still out there); the Silencing still holds. Strong. |
| 9 | `faction-veilkeepers` | Regional→MEGA-adjacent (Foggy Isles; vault reaches several kingdoms) | **Exemplar** | Neutral water-shaper order; the secret-vault + Yngli keepers + Tarkhon standoff = live lever. Strong. |
| 10 | `faction-the-moon-road` | Regional (Drasnian smuggling out of Gorath) | **Exemplar** | Underground railroad through the Moon Wilds; Mireth's purpose vs Trømgar's uprising-army = live lever. Strong. |
| 11 | `faction-goldwatch` | Regional (Keshwindi mercenaries; operate Shyona/Gnotobi) | **Strong** | Nameless Ones who sell the blade; the Tally / nameless-keeper contradiction = live lever. Strong. |
| 12 | `faction-last-lamp` | Regional/Local (Aureum resistance, Blood Mountains) | **Strong** | Holdouts around the last decanted sunlight; ration-vs-strike on a withheld reserve = live lever. Strong. |
| 13 | `faction-aldriktch-trade-alliance` | **MEGA** (six-nation Middle Sea trade bloc) | **Medium** | Real strains (Myorna, silvertongue, Telphineas Strait) but rough prose, listy "Overview," lever not staged, typos. |
| 14 | `faction-first-brotherhood` | **MEGA** (pan-dwarf union) | **Medium** | Good hollowed-oath hook (dues-union, 3 city-states monopolize leadership) but short, one-sided, typos; no staged dispute. |
| 15 | `faction-the-ivory-hand` | **MEGA** (world-spanning slave-sacrifice cabal) | **Stub** | Flagship cabal of `overview-factions` (own illustration) but the file is 3 sentences. Biggest importance/quality mismatch. |
| 16 | `faction-druids` | **MEGA** (elder progenitors of all elves; leyline knowledge) | **Stub** | 3 short paragraphs ending "Have pain walker companions." No history, no lever. World-historical scale, junk file. |
| 17 | `faction-soldiers-of-the-third-eye` | MEGA-adjacent (time-attuned neutral mercenaries) | **Stub** | Cited in `overview-factions` as a model martial order; file is 3 typo-ridden sentences ("ack of hand," "mercaneries"). |
| 18 | `faction-elves-of-the-gray-order` | Regional→MEGA-adjacent (Hykravones-return supremacist cult) | **Stub** | 3 sentences. Real hook (Gray Prince search, anti-human, Shattering reset) but undeveloped. |
| 19 | `faction-church-of-margia` | Regional/Local (one-nation church of Hephake) | **Stub** | 2 sentences. Sister-temples (Agril, Nocci) exist as POIs. NOT MEGA despite the brief's example list. |
| 20 | `faction-pain-priests` | Local | **Stub** | 2 sentences. Ease the dying toward death; possible three-soul-death hook, undeveloped. |
| 21 | `faction-way-watchers` | Local | **Stub** | One paragraph; archery order that hunts powerful foes. Generic hook, no Alarian lever, no edges. |
| 22 | `faction-the-way-watchers` | Local | **EMPTY / DUPLICATE** | Blank body, empty blurb, tagged `poi`. Duplicate of #21. Delete/merge candidate. |
| 23 | `faction-house-of-the-second-sun` | — | **MISTAGGED** | Describes a *city* in the Astral around Gihatti's palace. It is a place, not an organization. Wrong `entityType`. |

Tally: **12 strong/exemplar**, **2 medium**, **9 weak/problem** (5 stubs + empty duplicate + mistag + 1-nation church + local archery stub).

---

## 2. Quality assessment of the mega-factions

### Strong MEGA (meet or exceed the bar — leave alone, light polish only)
- **`tolarian-mage-kings`** — full identity/creed, multi-generation history, and a named live lever (Vesimar the Unsevered, "whether the clean working was madness or a design that needs a second attempt"). Anchored only by inbound computed edges by design; clean.
- **`iron-of-the-eternal-march`** — exemplary use of `lore-complication`: the conquest-faith vs Serel's "the hammer is a maker's hammer" schism, with the orthodox-party-may-be-the-heretic twist. Worships Krondeum (note: appropriation, not a claim Krondeum is a war-daemon — canon-safe).
- **`the-moonwatchers`** — decentralized, four-faction internal split, dangerous-cell texture, mechanics block, withheld answers in author-notes. Routes through prayer-attunement, not a 5th magic source (canon-guarded).
- **`the-dawnless`** — operates *inside* the sun-coalitions; mercy-wing vs "let it freeze" fringe is the live lever; `relations: []` is deliberate (no clean edge-kind for revere-the-sun-oppose-the-system).
- **`anchor-vessel-priesthood`** — world-historical keystone class; the intact-but-unplayable rite is a clean GM hook. Good edges (Krathokh, both eras).
- **`pity-knights`** — defunct but with a still-live residue (Xynoth's Chaal Nazzerox, the still-holding Silencing). `caused → 4342` (Thergon) resolves.

### Medium MEGA (have a lever but under-built — primary deepening targets)
- **`aldriktch-trade-alliance`** — genuinely MEGA and the live tensions are all there (Myorna admission as "the wound," Ubrik silvertongue outbreak, Camaran isolationism, Watar/Bestacia over Telphineas Strait). But: the body opens with a listy "### Overview," prose has typos (`entie`, `canabalistic`, `threated`), and the central lever ("will the alliance hold, and who breaks it first?") is implied, never staged as the closing question the rule wants. No author-notes. `foundedBy` (Corwen Hostling, Qepi Sandelyx) and `worships → daemon-foedros` all resolve.
- **`first-brotherhood`** — the hollowed-oath hook (sworn dwarven bond → dues-collecting union, three city-states Üod/Blvnird/Melaia monopolize leadership) is strong and Alarian, but it's two short paragraphs, one-sided, with typos (`Brotherood`, `everone`) and no staged dispute. **Continuity flag:** the file authors `worships → daemon-gromnuul` + `daemon-krondeum`, but `overview-deities.md` uses Krondeum + **Krunites** (first-ore daemon) as the canonical First Brotherhood example. Both Gromnuul and Krunites exist as daemons; the faction file never mentions Krunites. Reconcile.

### Stub MEGA (carry world-scale weight the file does not earn — highest-ROI fixes)
- **`the-ivory-hand`** — three sentences for the flagship world-cabal that `overview-factions` builds a whole section and an illustration around. Names the Sylke queen, Bonnetaz merchants, and dragons but authors **no edges** to any of them and stages no internal dispute. Massive importance/quality gap.
- **`druids`** — three paragraphs, ends "Have pain walker companions." World-historical (pre-Gaea elder progenitors, leyline memory per `overview-factions`) and tagged `["race"]`, not faction-appropriate content. No history, no lever.
- **`soldiers-of-the-third-eye`** — cited by name in `overview-factions` as the model time-attuned neutral mercenary order, yet the file is three typo-ridden fragments. Real Alarian hook (time-attunement / foresee outcomes → ties to Izzus / `magic-time`) entirely undeveloped.
- **`elves-of-the-gray-order`** — Hykravones-return cult (Amverela elves, anti-human, "searching for the Gray Prince for eons") with a strong reset-the-world hook, three sentences deep. `worships → creature-hykravones` resolves.

---

## 3. Contradictions / edge problems / duplicates (file cites)

1. **Duplicate: Way Watchers.** Both `faction-way-watchers.md` (one paragraph of archery content) and `faction-the-way-watchers.md` (blank body, empty blurb, tagged `poi`) exist. Neither is referenced by any other entity (grep clean), and neither slug appears in `data/pinned.json` (so neither is map-pinned). **Recommend deleting `faction-the-way-watchers` (the empty one)** and, if the order is worth keeping, develop `faction-way-watchers`. Per CLAUDE.md, confirm against `data/pinned.json` before deletion (already checked: 0 hits).

2. **Mistag: `house-of-the-second-sun`.** Body describes "a towering city built around the two massive pillars… home of Gihatti, the king of the Astral Plane." That is a *place* (an Astral city/POI), not an organization. `entityType: faction` is wrong; `tags: ["city"]` confirms the authoring intent drifted. Reclassify to a place type (or fold into the relevant Astral plane/place entity). No coordinates, so not currently map-pinned. No edges.

3. **Scope mislabel: `church-of-margia`.** Blurb "Leading church of Hephake" + body naming sister churches Agril and Nocci. `church-of-agril` and `church-of-nocci` exist but as `entityType: poi` (physical temples honoring different "aspects"). So Margia is the lead temple-church of a single nation's multi-aspect faith — **regional/local, not MEGA.** The brief lists it among MEGA examples; on the evidence it is not. Either accept it as a modest regional church (then give it a lever) or, if a continent-church is intended, that is a *new* entity (see gap #5).

4. **`druids` tagged `["race"]`.** Content reads like a race entry, not a faction (no organization, no agenda, no history). Either retag and rewrite as a faction (preferred — there is also a `race`-family elf lineage) or reconcile with `systems/races.md` (druid-crafted elves cannot cross with flesh; "no half-elves" invariant) before deepening.

5. **Edge hygiene overall: clean.** `node scripts/codex.mts report lint` exits 0 with **errors: 0** (baseline). No dangling targets, no both-ends-directed (one-direction-only) violations among factions. The Dead Moon ↔ Moonwatcher rivalry is authored one-way (`dead-moon → rivalOf → faction-the-moonwatchers`; Moonwatchers carry only `attunedTo`). All faction edge targets verified to resolve: `322` Sestros, `338` Shyona, `203` Keshwindi, `71` Chimea, `4342` Thergon, `3178` Gorath, `manual-mpifts0q-rkqps` Foggy Isles, plus all daemon/person/race/era/plane targets. The only `druids` lint hit is a single-word-name English-collision *warning* ("Druids" in 38 bodies), not an edge error. (`orphansNonGeographic: 805` is info-level and expected — factions correctly carry no `within`.)

---

## 4. Coverage gaps — world-scale organizations that are MISSING (prioritized)

The world implies several continent-scale power blocs that have no faction entity. Each is given with the Alarian lever it would hang on.

1. **The dominant sun-coalition / sun-tax church bloc — HIGHEST.** `event-solar-accord.md` names "the major prayer-coalitions," "the ecclesiastical bodies that maintain the approved singing schedule," the **sun-tax**, and "the law of light" (criminalizing unauthorized coalitions). `overview-geography.md` makes coalition prayer the organizing fact of the entire warm band. This is the central continent-scale power of the inhabited world — and it has **no faction entity.** The Dawnless are authored purely as its heretical opposition; the Dead Moon Tribe and Moonwatchers route through the same prayer-physics; nothing represents the apparatus itself. **Lever:** prayer-economics + sun-wars + the sun-tax + the law of light; a coalition is "as strong as the choirs it can pay to sing." Likely wants two *rival* coalitions, not one, so the sun-wars have named sides. **Defer-flag:** `event-solar-accord.md` author-notes say the role of *sun elves and the Vykus* in the coalition structure is explicitly open — "do not specify it." Author the coalition-as-faction around the settled mechanics; leave the sun-elf/Vykus question in `<!-- author-notes -->` and/or raise with the human before committing.

2. **A sky-trade order / sky-route monopoly — HIGH.** `.pi/rules/faction.md` itself names "the sky-route monopoly a merchant order defends" as a model Alarian hook. The world has all the pieces and no faction: skystone shipping, the Nysanna sky-stone drift-belt, the **Velthari star-accountants** of the City of Stars who "chart the sky-routes… and sell them to anyone shipping cargo north," and `person-tybalexyn`'s foundational waypoint charts. The Velthari are authored as a people/town, not as a faction controlling the lanes. **Lever:** whoever holds the waypoint-and-altitude charts controls all northern sky-cargo; a contested or stolen chart-grid is the conflict.

3. **A daemon pantheon-cartel as a faction — HIGH.** The pantheon-as-cartel mechanic (non-overlapping worship domains; sharing Deoric grammar freely *because* domains don't compete; schism the moment one expands) is load-bearing canon in `overview-deities.md`, `overview-factions.md`, and the invariants table. It currently exists only as a *concept* plus the First Brotherhood's Krondeum/Krunites micro-example. A specific named cartel — a covenant of non-competing daemons — would be a world-scale faction with a built-in lever. **Lever:** the covenant holds only while domains stay separate; an expanding member triggers religious war. **Constraint:** the daemon-*lineage* sharing mechanic is DEFERRED (invariants "do not author yet" → cosmology-decisions §11); build the cartel on domain-non-overlap + master-debt only, not on parent→child lineage.

4. **An anti-Deoric / abolitionist league — MEDIUM (raise as a design question).** The Ivory Hand runs the slave-sacrifice-for-Deoric trade at world scale; the opposition is currently only *regional* — the Moon Road (Drasnian out of Gorath), the Last Lamp (Aureum). Camaran has hardened anti-Deoric-magic law (`faction-aldriktch-trade-alliance.md`: "distrust of Deoric magic had by then hardened into law," vetoed Echea); `free-isles.md` and `divinity-passage.md` mention abolition. The `lore-style-guide` even uses "an anti-Deoric league" as its hypothetical. A continent-scale counterweight (Camaran-led, or a cross-border abolitionist compact) is the natural missing antagonist to the Ivory Hand. **Lever:** Deoric costs life → blood-sacrifice is the lump-sum shortcut → who opposes the trade at scale, and at what hypocritical cost. Flagged MEDIUM because fragmented opposition may be deliberate — confirm intent before authoring.

5. **A continent-spanning church / dead-god network — MEDIUM.** `overview-deities.md`: Craggus was "god of all mankind for fifteen thousand years," now dead, his rites still performed at empty altars; "some cultures pray to gods that are gone." There is no faction for a pan-human living church, nor for the dead-god cult network that still keeps Craggus's calendar. **Lever:** a continent-wide church going through the motions for a god the inner circle may know is dead — a Concordance-style secret at world scale and by a different mechanism (a *confirmed*-dead god vs. the Concordance's *failing*-but-alive one). Distinguish carefully from the Concordance so it doesn't duplicate that lever.

**Not a gap (noted to close the loop):** the Tarkhon strait-toll power is adequately a *polity* (`tarkhon` is `entityType: region`) with the Aldriktch Alliance as its trade-bloc counterweight; it does not need a separate faction.

---

## 5. Prioritized improvement plan (ordered; scoped per file)

No changes were made; this is the recommended sequence. Each item names the file(s) and the scope.

### Tier A — fix importance/quality mismatches on existing MEGA stubs (highest ROI; these already carry weight in `overview-factions`)
1. **`faction-the-ivory-hand`** — deepen from 3 sentences to exemplar (3–4 sections): identity/structure of a hidden cabal, history of how it captured the slave-sacrifice supply chain, and a live lever. Author edges to the entities it already names (the Sylke queen, Bonnetaz merchant houses, the dragon members) and stage an internal dispute (e.g. a faction that wants the trade *expanded* via conquest vs one that wants it kept quiet and small). Pair against gap #4 (an abolitionist counterweight) if that is approved.
2. **`faction-druids`** — rewrite as a real faction: who they are (pre-Gaea elder progenitors of the elves), what they did/what was done to them, and a contested question (their dwindling numbers, their leyline knowledge as the leverage `overview-factions` already attributes to them, the "pain walker companions" line made concrete). Reconcile with `systems/races.md` (druid-crafted elves, no half-elves) and decide the `["race"]` tag. Keep the two existing `worships` edges.
3. **`faction-soldiers-of-the-third-eye`** — deepen around the time-attunement lever (foresee strategic outcomes → tie to Izzus / `magic-time`), give them a history and a neutral-mercenary's live dilemma; fix the typos ("ack of hand," "mercaneries"). They are cited as a model order and should read like one.
4. **`faction-elves-of-the-gray-order`** — build out the Gray Prince search + Hykravones-return-as-reset doctrine + anti-human supremacism into a staged lever (e.g. a faction that wants to *force* the return vs one that fears what it would cost the elves too). Watch Hykravones/Shattering canon.

### Tier B — polish & sharpen existing medium MEGA
5. **`faction-aldriktch-trade-alliance`** — fix typos (`entie`, `canabalistic`, `threated`); convert the listy "### Overview" into bursty prose per the style guide; stage the central lever explicitly as the closing unresolved question (Myorna's admission as "the wound," who breaks the alliance first); consider an `<!-- author-notes -->` block. Keep `foundedBy`/`worships` edges.
6. **`faction-first-brotherhood`** — fix typos (`Brotherood`, `everone`); deepen the hollowed-oath into a staged dispute (the three ruling city-states vs the diaspora clans who still pay dues); reconcile the Gromnuul-vs-Krunites continuity against `overview-deities.md`.

### Tier C — cheap hygiene (duplicates / mistags / scope)
7. **`faction-the-way-watchers`** — delete the empty duplicate (unpinned, unreferenced); keep `faction-way-watchers` as the canonical slug.
8. **`faction-house-of-the-second-sun`** — reclassify from `faction` to a place type (Astral city/POI) or fold into the relevant Astral plane/place entity. It is not an organization.
9. **`faction-way-watchers`** — either give it an Alarian-specific lever (right now "hunt powerful foes" is generic per `faction.md`) or accept it as a deliberate local footnote.
10. **`faction-church-of-margia`** — decide scope: keep as a regional one-nation church (then add a lever and optionally `allyOf`/sibling edges to the Agril/Nocci POIs) and stop treating it as MEGA; OR promote the *concept* into the new continent-church (gap #5) as a separate entity.
11. **`faction-pain-priests`** — develop with a death-mechanic hook (three-soul death / pain transference) or accept as a minor footnote; currently no lever.

### Tier D — author new mega-factions (coverage gaps, in priority order)
12. **Sun-coalition / sun-tax church bloc** (gap #1) — the single biggest missing power. Author around settled prayer-economics + sun-tax + law of light; **defer the sun-elf/Vykus role** per `event-solar-accord.md` author-notes and raise it with the human first. Consider two rival coalitions so the sun-wars have named sides; the Dawnless already exist as their internal heresy.
13. **Sky-trade monopoly / sky-route guild** (gap #2) — anchor on the Velthari + Tybalexyn's chart-grid; the lever is control of the waypoint charts.
14. **A pantheon-cartel faction** (gap #3) — built on domain-non-overlap + master-debt (NOT the deferred lineage mechanic); the lever is the schism that follows any domain expansion.
15. **Design questions to raise before authoring** — (a) an anti-Deoric/abolitionist league as the Ivory Hand's counterweight (gap #4); (b) a continent church / Craggus dead-god network (gap #5), kept distinct from the Concordance's lever.

---

## Process notes
- Audit is read-only; no entity files, edges, or builds were touched.
- Linter run: `node scripts/codex.mts report lint` → exit 0, errors: 0 (matches known baseline).
- Two canon constraints to respect when acting on this plan: the **daemon-lineage sharing mechanic is deferred** (invariants "do not author yet"), and the **sun-elf/Vykus coalition role is an open thread** (Solar Accord author-notes). Both bear directly on the highest-priority new factions.
