# Loose-lore audit — calendar/economy/technology quality run

Read-only audit. Maps the entity-level gap the systems run (`docs/worldbuilding/systems/currency.md`, `economy.md`, `technology.md` + the currency/tech spec) deliberately deferred. Nothing here is authored or edited — this is a prioritized, sized build list for the CTO to decide against.

Doctrine bound (`docs/worldbuilding/lore-style-guide.md`): the corpus deliberately keeps ~65–80% of named referents as stubs/mentions. A referent earns a page only when it is load-bearing — multiple entities lean on it, a system doc points ownership *at* it, or a reader following a doc would expect a page and find a hole. This audit separates LOAD-BEARING gaps (Sections A/B) from things that should correctly stay un-built (Section C). Where a "gap" is actually a doctrine-correct stub, it says so.

Method: existence resolved by filename glob + `^name:` field grep + full-body `grep -ril` across all 3,885 entity files; depth/adequacy and canon-fact harvest done by 4 parallel read-only explore children (southern-cities, banking-cluster, missing-harvest, tech-p3). Reference counts = "entity files mentioning the term," a load-bearing proxy.

---

## SUMMARY

- **Section A — MISSING entities to author: 5 firm + 1 conditional.** New pages: `magic-red-platinum` (S), `magic-lanthornium` (S), `plane-lanthornia` (S), the Tarkhon Grain Exchange / Aldrichold institution (faction, M), `faction-firemage-corps` (M). Conditional: a currency/economy overview entity to resolve 11 dangling `currency.md` body-links (S–M, OR solve by prose cleanup — see A6).
- **Section B — THIN STUBS to deepen: 9 (3 high-value + 6 secondary).** Highest: `magic-titan-blood-bones` reserve-role deepen (S), `free-isles` southern-mark mechanic (M), `magic-sky-stone` economic role (S/M). Secondary: `shacklands` (M), `kokotintin` (M), `adrak` (M), `azantir` (S), `kyorda` framing fix (S), `faction-aldriktch-trade-alliance` optional (S). Plus minor: `kyagos` (S), namespeaker stubs (S, cleanup-only).
- **Section C — LEAVE AS-IS (intentionally not built): ~14 items.** Coin denominations, the southern mark, ng'ombe, the abstract Aldriktch standard, the chokepoint-toll model, the Free-Isles minting families, the Mwali, the Yolus fire-seam, the aetherium lost-height, and the two deferred P3 markets — all correctly NOT entities.

### Top-5 highest-value (value ÷ cost)

1. **`magic-red-platinum` (S, AUTHOR).** Apex of the LOCKED Aldriktch standard, carries a named canonical counterfeit-test, yet has no page — every fact is already harvested verbatim. Cheapest high-value build in the set.
2. **`magic-titan-blood-bones` reserve-role DEEPEN (S).** `currency.md` explicitly defers ownership of the reserve-of-last-resort role *to this page* — and the page carries none of it, so a tier-1 systems anchor dead-ends. One of titan bone's two canonical roles is wholly absent. Connect existing facts; invent nothing.
3. **`faction-firemage-corps` (M, AUTHOR).** 7 entity files name it, `technology.md` leans on it, and it is absent from `overview-factions.md` — a real institution with a ready conscription lever (Tarkhetan claims fire-attuned children) sitting in seven dangling mentions.
4. **Tarkhon Grain Exchange / Aldrichold (faction, M, AUTHOR).** `economy.md` calls it "the most mechanically specific economic institution in the corpus" and a monopsony; the instrument binding Enymu to feed Tarkhetan has no page.
5. **`magic-lanthornium` + `plane-lanthornia` (S + S, AUTHOR pair).** The mechanical catalyst and the off-world stack the *entire* aether sky-economy turns on — currently homeless (a one-line stub under `magic-aether`), while every other foreign planar stack already has its own page.

---

## SECTION A — MISSING ENTITIES TO AUTHOR

### A1. `magic-red-platinum` — Red platinum / the Crimson Crown · entityType `magic` (tags `mineral`, opt. `currency`) · **Effort S**
Load-bearing: the highest denomination of the LOCKED Aldriktch standard (`world-systems-invariants.md`), carrying a *named canonical counterfeit-test*, with NO page. Referenced in exactly 2 entities (`adron`, `plane-bank-of-infindior`) + a dedicated `currency.md` section. Sibling `magic-red-gold` (~230 words, 3 paras, no headers) is the size calibration.

Canon to build from (all harvested, no invention):
- A platinum-group element that takes a red cast — "a different element" from red gold; recovered in trace amounts from Adron's eastern ranges (Gozwin + Majesty Mtns), "beside the gold."
- ~100× scarcer than red gold; rarer than ordinary platinum by a wide margin; the Adron houses "hold nearly all of it."
- It does **NOT** turn Kethic (LOCKED) — the defining inversion of red gold, whose whole point is that it *does*. Red platinum is the precious metal that is pointedly non-magical, and that absence is the point.
- The coin: struck into the Crimson Crown, one rung above the Crown; "barely a coin," worth >10,000 iron at no fixed multiple, "trades like a small kingdom"; near-uncirculated, surfaces to "settle the kind of balance that ends a war or buys a throne." Most are vaulted in the time-frozen Bank of Infindior with the titan-bone reserves.
- The counterfeit-test (the load-bearing hook, LOCKED): a fake struck in red gold scatters a Kethic test off its face; real red platinum lets the working pass clean through. "A coin that should be the most valuable object in the room and refuses to turn a flame is the genuine article."
- Hard guardrail (adron.md author-notes): never give red platinum red gold's Kethic-turning property; the two must not be confused.
- Suggested edges: `adron --produces--> magic-red-platinum`; Bank of Infindior guards the Crimson Crowns; sibling-of `magic-red-gold`.

### A2. `magic-lanthornium` — the catalyst stone · entityType `magic` (tag `material`) · **Effort S**
Load-bearing: the mechanical half of the aether sky-trade — the struck plate that drives every piston — currently living only as a one-line stub *inside* `magic-aether.md`. Named in 2 entities (`magic-aether`, `plane-astral-currents`) + `technology.md` + `economy.md`. Aether is inert without it. Mirrors `magic-aether.md` exactly in shape.

Canon to build from:
- An uncommon gray-blue stone needing expensive processing/purification to be usable; off-world (from the Lanthornia stack), not a native mineral.
- Engine mechanism: purified lanthornium is vibrated at a specific frequency; bound/processed aether striking it rapidly expands, sheds its bond with the water, and discharges as it slips back toward the insubstantial — that discharge is "the work." A struck lanthornium plate begins a self-sustaining cycle (similar to a steam engine), driving pistons / turning propellers.
- What it releases is an off-world planar substance, NOT combustion any foundry could copy or scale.
- Cost driver: the aether engine (lanthornium + complex mechanisms + specialized knowledge) is a major share of a sky-ship's cost, atop astral stone and astral-steel chains.
- Disambiguation to honor: keep lanthornium/aether cleanly distinct from the lost-height "aetherium" (near-homophone, unrelated — see C13).

### A3. `plane-lanthornia` — the planar stack · entityType `plane` (tags `cosmology`, `planar stack`) · **Effort S**
Load-bearing: named in **4 entities** (`magic-aether`, `plane-astral-currents`, `overview-magic`, `race-goblin-aether-tapper`) + 2 system docs + `world-systems-invariants.md` — MORE inbound refs than several foreign stacks that already have stub `plane` entities (`plane-epyphiozath`, `plane-instruxofinum`, `plane-glyssen`, `plane-klokas`, `plane-narglon`). It is the only named stranger-stack with real downstream lore (an entire sky economy + a goblin race) yet no page. Also absent from `plane-the-cosmos.md`'s "Other Known Stacks" list — add it there for in-corpus reachability.

Canon to build from:
- A planar stack neighbouring Alaria; its aether is "not native to the world and not one of the four sources of Alarian magic." Aether is the primary meta-fluid energy source *on Lanthornia* — native there, foreign here.
- The eruption (key event): an eruption on Lanthornia expelled a large quantity of both aether AND lanthornium; both "came to rest here" / "rained down on Alaria." This is a post-eruption foreign accident, explicitly NOT a remnant of any lost age.
- Consequence: goblin aether-tappers' sensitivity developed *after* the eruption deposited aether across Alaria — "a people shaped by a foreign accident."
- LOCKED: aether is foreign (Lanthornia stack), exotic, NOT a fifth native source.
- Edges (author from the more-specific entity only): `magic-aether` and `magic-lanthornium` originate-in `plane-lanthornia`.

### A4. Tarkhon Grain Exchange / Aldrichold — entityType `faction` (institution) · **Effort M**
Primary verdict: build as a faction named "The Tarkhon Grain Exchange" (alias Aldrichold), mirroring `faction-aldriktch-trade-alliance.md`. All load-bearing canon is institutional mechanics (grading, licensing, annual price-set, monopsony, the binding of Enymu) — there is ZERO place-furniture (no districts/population/terrain/pin); canon treats Aldrichold as the place *containing* the institution. (Alternative — a pinned town in Enymu — is weaker: it forces inventing a map pin + townscape canon never asserts. Choose it only if you want it on the map; that pushes effort to L.)

Load-bearing: named in 2 entities (`enymu`, `event-enymu-subjugation` "The Grain Compact") + `economy.md`, which singles it out as "the most mechanically specific economic institution in the corpus" and "a monopsony in everything but the word."

Canon to build from:
- Sits *outside* the Aldriktch Alliance and is "distinct from the Aldriktch tariff regime despite the similar name."
- The empire sets the price of its bread each year at the Exchange, where licensed imperial merchants grade the crop and name its worth; binds the farming kingdom Enymu to supply Tarkhetan's bread at a price the empire decides.
- Physical form: a large warehouse complex in Aldrichold where Enymu's harvest is collected, graded, and sold; "the prices set here determine whether Enymese farmers prosper or merely survive." Grain-factors' saying: "The Exchange grades the wheat and names the coin. Enymu only grows it."
- Location: Aldrichold sits within Enymu (within the Tarkhon Empire) — the instrument of subjugation stands on the subjugated kingdom's own land.
- HARMONIZATION wrinkle for the author: `economy.md`/event say "licensed imperial merchants"; `enymu.md` says "Nektuna's merchants set the prices." Nektuna is a region within Tarkhon, so the Nektunan merchants ARE the imperial graders — state it that way to reconcile, not contradict.
- Defer to the event (don't restate): the Grain Compact (~2876 SD) was "a treaty, not a conquest"; coercion is geographic (Enymu is landlocked but for a harborless coast; refuse and the grain rots). Never renegotiated, never formally broken; the younger generation now questions it — a live lever.
- Naming-collision caution: Aldriktch / Adrak / Adron / Aldrichold open near-identically — differentiate the first sentence sharply.

### A5. `faction-firemage-corps` — the Firemage Corps · entityType `faction` · **Effort M**
Load-bearing: 7 files name "Firemage Corps" (`magic-fire`, `magic-kethic`, `magic-midnight-fire`, `evertorch`, `nektuna`, `event-fleimrut-awakening`, `era-world-fire`); `technology.md` leans directly on it ("The Firemage Corps' military edge sits on the Yolus fire-seam under Tarkhetan"); yet there is no faction page and it is absent from `overview-factions.md`. A real organization with detail already scattered, plus a built-in grievance lever.

Canon to build from:
- The empire's elite military asset — an order of fire-shapers bound to the Tarkhetan (Yolus) fire-seam, which it cannot relocate.
- Conscripts fire-attuned children born in Tarkhetan ("those who do are claimed by the Firemage Corps") — a ready forced-recruitment lever.
- Has its own drill culture (a "drill maxim of the Firemage Corps"); trains on the Yolus seam "precisely because the seam deepens its students"; tied to the Evertorch and the materialist scholar `person-vaznik`.
- Dating guardrail: the Corps dates to ~2776 SD — do NOT retro-fit it as the cause of the World Fire (~10 BSD).
- Suggested: `within`/relation to Tarkhetan + Tarkhon; `cosmology/attunedTo magic-fire`.

### A6. Currency/economy overview entity — **CONDITIONAL · Effort S–M (or solve by cleanup)**
The review gate (`context/review-findings.md`) found a NEW pattern this run introduced: 11 entity files reference the literal string `currency.md` in player-facing body prose (`aboyinzu`, `adron`, `daemon-bylzar`, `daemon-foedros`, `dalizi-confederation`, `faction-aldriktch-trade-alliance`, `kyagos`, `person-belmonte`, `plane-bank-of-infindior`, `rimihuica`, `upoceax`). `currency.md` is a systems doc, not a codex entity, so the backtick resolves to nothing in the public codex — author-notes leaked into player text. No pre-existing entity references any systems doc in its body; this is a regression.

Two forks, both close the gap:
- (a) **Author a currency/economy overview ENTITY** so the references resolve — load-bearing in the sense that 11 pages currently dangle. Effort S–M.
- (b) **Cleanup only** — drop the literal filename in those 11 files and phrase as "the wider money system" / "the southern standard." No new entity.
Recommendation: this is the gate's MUST-FIX #4 and overlaps both authoring and cleanup; flagged here so the CTO sees it as a possible entity (not just a lint). The same check should run against any new `economy.md`/`technology.md` body cross-refs.

---

## SECTION B — THIN STUBS TO DEEPEN

### High-value

**B1. `magic-titan-blood-bones` — add the reserve-asset role · Effort S.** The page owns WHAT titan bone is (origins, properties, ~95% Deo Esari monopoly, depletion, black-market flaying) but says NOTHING about its monetary role. `currency.md` explicitly defers ownership of the reserve role back to this entity ("what matters here is its role as the floor under the credit system") — so the canon dead-ends. Missing entirely: reserve of last resort; a store of value that cannot be minted/inflated; great houses settling their largest balances and backing heaviest loans *against bone*; bone vaulted at the Bank of Infindior; the bone(imperishable reserve)/blood(consumed input) split. Add one lore section (~2–4 short paragraphs, above any `<!-- mechanics -->`), connect existing facts, defer the supply/monopoly mechanics to `economy.md`. Bonus live hook: reserve-hoarding competes with handmagic for a shrinking supply — every ounce vaulted as money is an ounce never tattooed.

**B2. `free-isles` — add the southern-mark mechanic · Effort M.** Rich on politics/arena/Blood-Pact/abolition, but the money mechanic the region canonically OWNS is entirely absent: zero mention of weighed silver, the mark, each family casting/stamping its own mark, the Valdrossi-vs-Gattorini same-weight benchmark, moneychangers biting the mark, or the Adron cross-rate. The child continent (`upoceax`) carries this better than the owning region does. Source text exists verbatim in `currency.md` §The southern reckoning. (Side-flag, out of scope: `free-isles` was rewritten to "Four Families" while `kokotintin`/`mpehi` still say "Five" — drift, not economic.)

**B3. `magic-sky-stone` — add the economic role · Effort S/M.** The page carries only the cosmological origin (stones broken off the Astral Plane's lower crust; buoyancy mechanics) and OMITS the entire economic role `economy.md` assigns it: it is the lift a sky-ship hangs from, "an investment so large that most stones are owned by merchant houses and state navies rather than captains." A half-of-the-sky-economy lever is missing from its own page; 12 files reference sky-stone.

### Secondary

**B4. `shacklands` — Effort M.** The region defined BY its slave economy, yet money is only "the wealth that flows through." Missing the weighed-silver/mark settlement, legions-paid-in-marks, slavers-settle-in-marks, and Belmonte-the-war-creditor — all of which `currency.md` anchors to the Shackland markets, and which the parent `rimihuica` already carries. The region itself denominates nothing.

**B5. `kokotintin` — Effort M.** Heavy economy section (tariffs, fences, murderous lenders, betting "moves more gold than merchant fleets") but all in generic "gold/coin," never the weighed-silver mark, the Valdrossi mint, or the moneychanger-bites-the-mark assay role canon names *for this exact city*. Wrong currency for the southern reckoning.

**B6. `adrak` — Effort M.** A 4-line pre-currency stub that names the Royal Adrak Bank and "seat of the monarchy" but asserts none of the mint/standard/cross-rate canon — even though `currency.md`'s closing pointer names "Adron, Adrak, and Mariseni for the standard and the rate," and the city physically houses the issuing mint. A capital that is the home of the standard's bank should not stay a stub; add the container-summary that points down to `adron`/`person-mariseni`.

**B7. `azantir` — Effort S.** A solid capital entry on the war-economy axis (Gorath's economy, Praetor Esmeraz's treasury) but with zero mention of Belmonte, "the oldest banking house," or the southern war-finance hub that routes through here. `person-belmonte` is `allyOf` Esmeraz yet never surfaces in his own city. Add the one-line banking-house container-summary pointing to `person-belmonte`.

**B8. `kyorda` — framing reconcile · Effort S.** Carries the Bank of Infindior hook but characterizes it as a normal credit/lending waypoint ("coin that flows through Infindior funds Tikhaya expeditions") — mild drift from the canonical time-frozen reserve-custody vault. Pre-currency-pass (May 27); reconcile the characterization.

**B9. `faction-aldriktch-trade-alliance` — Effort S (optional).** Currency content is a single correct clause grafted onto a Myorna-dispute body. Sufficient under the member-defers-upward model; the only "bolted-on sentence" in the banking cluster. Optional.

### Minor / cleanup-only (not load-bearing deepens)

- **`kyagos` (S):** already EXISTS-ADEQUATE; missing only the literal unit word "mark" + cut-silver/salt granularity. Trivial.
- **`creature-namespeakers` (S) / `creature-true-name` (S):** both thin stubs (namespeakers is a single typo-ridden line) that would benefit from a tidy ecological/cosmological pass *on their own merits* — but this is stub-cleanup, NOT the deferred P3 true-name market (see C14).
- **`maurevelious`:** NOT an entity gap — it carries its alchemical-pharma monopoly canon well. The mismatch is doc-side: `technology.md` lumps its swamp/botanical pharma under "leylines" when the entity has no leyline mechanism. Fix on the doc (S), not the entity.

---

## SECTION C — LEAVE AS-IS (intentionally NOT an entity)

These live correctly inside the systems docs or as self-glossing mentions. Listed so the "not built" set is explicit and not re-discovered.

- **C1. Coin denominations** — iron piece, obol, lire, ducat, crown. Units on a ladder, not objects; belong in `currency.md`.
- **C2. The southern "mark"** — a standard weight of fine silver; a unit, not an entity. Each family's mark is a stamp, not a page.
- **C3. `ng'ombe`** — the Dalizi cattle unit of account; notional reckoning unit, lives in `dalizi-confederation` + `currency.md`.
- **C4. Dalizi settlement media** — lake-salt bars, stamped cloth lengths; commodities at mention level inside `dalizi-confederation`.
- **C5. The "Aldriktch standard" as an abstract system** — carried by `adrak`, `faction-aldriktch-trade-alliance`, and `currency.md`. No separate "standard" page (once B6 fills `adrak`).
- **C6. The silver-to-iron cross-rate / Royal Adrak exchange mechanism** — a mechanism owned by `adron`/`adrak`, not a thing.
- **C7. The chokepoint-toll model** — an abstract economic form; the individual chokepoints already have pages.
- **C8. Chokepoint geography** — already pages (`shei-r`, `city-tollgate`, `telphineas-strait`, `phyndarr-sound`, `the-wurmspine`, `vogenfeld`, `kazu-l`, `the-grey-mountains`, `sea-of-merchants`). Not gaps; listed to forestall re-discovery.
- **C9. Free-Isles minting families — Valdrossi, Gattorini** — stay MENTIONS. Each is already fully realized inside its seat city (Valdrossi in `kokotintin`; Gattorini in `mpehi`, with Donna Serephina / Mani d'Oro). A page would duplicate, not enrich.
- **C10. The Mwali council + `kusafirisha kiti` seat-cycle** — stay mentions. The Mwali is an organ of the confederation, deeply described in `dalizi-confederation`; kusafirisha kiti is a named custom/grievance glossed inline. A parliament/practice belongs in its nation's article.
- **C11. The Yolus fire-seam** — stays owned by `magic-fire.md` (where "Yolus (Fire)" is one of nine elemental plane-layers; NO sibling layer has its own page). The 33 references all mean the Fire layer, not a place. A standalone `yolus.md` would break the pattern and duplicate `magic-fire`.
- **C12. The "Yolus firemage commercial monopoly" (P3) — STAYS DEFERRED.** Canon frames the seam as a *military* edge, never commercial; the seam is explicitly un-relocatable. No entity home, weak canon support. If ever pursued, it belongs in `faction-firemage-corps` (A5), not a new page.
- **C13. Aetherium / the lost-Kethic "aetherial height"** — do NOT author. "Aetherial magic" is canonically Kethic elementalism at scale (the mage-kings' own misnomer); the real referent already exists as `magic-kethic.md`, and the four-sources invariant forbids a fifth. The rise→fall arc is already structured across `era-age-of-craggus`, `era-lost-ages`, `event-shadowrift`, `event-the-glassing`. All 7 in-body uses self-gloss; no dangling proper noun demands a page. Optional nice-to-have: add prose cross-links to `magic-kethic.md` in the 6 user files. (Name-collision guard: `event-aetherial-reckoning` is an UNRELATED future-doomsday homonym — do not merge.)
- **C14. The namespeaker true-name commercial market (P3) — STAYS DEFERRED.** No commercial dimension exists in `creature-true-name`/`creature-namespeakers`, and a true-name market actively contradicts established secrecy canon (true names are guarded mortal secrets; exposure means puppetry or death — the opposite of a tradable good). Namespeakers are predators, not merchants. A clandestine name-extortion black market would be net-new invention, not a gap to fill.
- **C15. `race-gnome-techgnomes`** — NOT a gap. Already matches `technology.md`'s lost-craft-relic bounding near-verbatim (broken devices, scraps no living gnome can reassemble, the still-moving mechwurm). No action; listed to confirm it was checked.

---

## CORRECTION TO THE ORCHESTRATOR'S KNOWN-MISSING LIST

`titan-bone` is **not** page-less. `magic-titan-blood-bones.md` exists (name "Titan Blood & Bones"), referenced by 18–22 files. The real item is a DEEPEN (the financial reserve role is the clean gap — see B1), not a CREATE. The other four orchestrator-flagged items confirm as genuine MISSING: red-platinum (A1), Aldrichold (A4), and Lanthornium (A2, the catalyst stone — its parent stack Lanthornia is the related A3). The fourth, aetherium, should stay a mention (C13), not be authored.
