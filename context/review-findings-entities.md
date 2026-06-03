# Style-sweep review — currency/banking + tech-bounding entity files

Independent sub-review feeding the quality gate. Read against `docs/worldbuilding/lore-style-guide.md` and `world-systems-invariants.md`. Diffs read via `git diff HEAD`. Severity: CRITICAL (canon/invariant breach) / MAJOR (style or quality miss needing fix) / MINOR (polish).

Bottom line up front: the aether sci-fi→magic reframe and the tech-bounding adds are mostly clean and canon-correct. Two things need action: (1) **race-goblin-coghead.md was left un-updated and now contradicts its own parent and a locked invariant** (CRITICAL), and (2) the **`currency.md` in-body reference is a dangling player-facing link across 11 files** (MAJOR). Plus the requested aether/aetherial terminology audit, which surfaces a real cross-corpus name collision.

---

## CURRENCY / BANKING SET

### faction-aldriktch-trade-alliance.md — typo verification (task-mandated)
- CONFIRMED FIXED: `entie`→`entire` (L20), `threated`→`threatened` (L22), `canabalistic`→`cannibalistic` (L22). All three flagged typos are corrected.
- **L20 — RESIDUAL TYPO MISSED.** "spear headed by phenomenal diplomats" → should be "spearheaded". The task required all typos fixed; this one slipped (it sits in an unchanged pre-existing line, but it is still a misspelling in the file). **MAJOR.** Fix: "spearheaded".
- **L20 — grammar.** "from both Myorna, Ubrik, and Bestacia" — "both" with three items. **MINOR.** Fix: drop "both" or "from all three of Myorna, Ubrik, and Bestacia".
- **L24 — grammar (pre-existing).** "the Watari and Bestacians relations" → "Watari and Bestacian relations" / "Watari–Bestacian relations". **MINOR.**
- New History prose (Strugmar harbor-fee precedent, grain-bond court paragraph) is good: strong burstiness, no em-dash overuse, Foedros reference is canon (daemon-foedros.md exists). No new style violations. AFFIRM.

### dalizi-confederation.md
- **L27 — `## Money` header. MAJOR.** Uses `##`, banned by the style guide ("Headers use `###`, `####`, or `#####` only, never `#` or `##`"). Introduced this run. Note L21/L35/L41 (`## Governance`, `## Key Sub-Regions`, `## Political Tensions`) are pre-existing identical violations — the whole file should be demoted to `###`/`####`. Boldface was correctly stripped this run (good).
- New Money section: good prose, canon-consistent with aboyinzu (cattle reckoning, salt/cloth settlement, host-shades-the-rate hook, converts to southern silver via Adron). One spaced em-dash on L31 ("mostly notional — the cattle"), within limit. AFFIRM the content.
- L31 — "every single time" is a colloquial intensifier; polish only. **MINOR.**

### kyagos.md
- **L21 — em-dash overuse. MAJOR.** New sentence carries a parenthetical em-dash PAIR: "in weighed silver rather than minted coin **—** worn openly here, and scarred like the men who carry it **—** priced against the cross-rate...". Two em-dashes in one sentence; the guide caps at one per sentence. Fix: parens or recast — e.g., "...minted coin (worn openly here, and scarred like the men who carry it), priced against...". (Pre-existing unspaced em-dash earlier in L21, "mark rank—one for", is separate and pre-existing.)
- Content/canon otherwise fine; southern weighed-silver framing consistent with adron rate-setter.

### adron.md
- L39 currency paragraph: dense but readable, burstiness OK, no em-dash overuse. Royal Adrak Bank is established canon (adrak.md, person-mariseni.md, invariants). Red platinum reconciled as DISTINCT from red gold (counterfeit-test: red gold turns Kethic, red platinum does not) per author-notes — accepted new material. AFFIRM.
- **L43/45/47/49 — boldface (pre-existing). MINOR.** "**Gozwin Mountains**", "**Majesty Mountains**", "**Shrieking Peaks**", "**Drakespine Mountains**" plus the Title-Case header `#### Mountain Ranges` violate the style guide (boldface banned; sentence-case headers). Not introduced this run, but live in a reviewed file.

### daemon-bylzar.md
- **L25 — register. MINOR.** "Foedros is the single enforceable signature, the deal sealed last Tuesday." "last Tuesday" is a colloquial real-world idiom in an encyclopedic high-fantasy register, and "Tuesday" is a real-world weekday that likely has no place in the Alarian calendar. Fix: "the deal sealed yesterday" / "last week" / "the bargain struck this season". 
- Bylzar/Foedros division of labor (continuity-house vs single-contract) is canon-consistent: Foedros exists (daemon-foedros.md); Bylzar's domain matches the scholar roster ("Bylzar — propagation, continuity, gold"). AFFIRM.

### bank-of-infindior.md
- GOOD. Blurb was empty (a real quality gap) and is now filled, ~22 words (≤25). Body orients the POI and defers upward to the plane entity (Wikipedia-summary model respected). One em-dash on L11, within limit. Correct use of the `<!-- author-notes -->` convention. No violations. AFFIRM.

### upoceax.md
- **L48 — "Their wealth is weighed, not counted". MINOR.** Borderline negative-parallelism/antithesis. Clean and short, probably fine, but it is the one construction in the set that leans on the banned "X, not Y" shape; flag for the gate. Kokotintin is canon (kokotintin.md). Rest clean, no em-dash. 

### rimihuica.md
- L58 — canon-consistent. "the Azantir banking house of Belmonte writes against conquests not yet made" matches person-belmonte.md (head of Azantir's oldest house, finances Gorath's wars) and currency.md exactly. Style clean (semicolon, no em-dash overuse). AFFIRM.

### aboyinzu.md
- L32 (Money sentence) — clean, canon-consistent with dalizi (southern silver + Dalizi cattle exception). AFFIRM.
- L40 — Tangiern characterization swap. **MINOR (net-neutral).** The edit dropped "pays tribute to neither claimant and keeps its head down" (which matched crimson-coast.md) and replaced it with "a seafaring people of the Void coast who give their dead to the open ocean...". The new claim is ALSO canon-consistent — feycreek.md: "The Tangier will give their dead to no inland water" (i.e. to the sea), and crimson-coast.md frames them as seafaring with the Void at their backs. So not a violation, but it is an out-of-scope characterization change inside a currency/tech pass; flagging so the gate knows the swap was deliberate and verified, not a drift.

### CROSS-CUTTING — `currency.md` in-body reference (MAJOR)
- **Files: adron.md L39, faction-aldriktch L18, daemon-bylzar L25, kyagos L21, aboyinzu L32, dalizi-confederation (Money), upoceax L48, rimihuica L58, person-belmonte (body), aboyinzu L32 — 11 entity files total.**
- Problem: `currency.md` is a worldbuilding SYSTEMS doc (`docs/worldbuilding/systems/currency.md`), NOT a codex entity. There is no `currency.md` entity file. The established backtick convention (`daemon-olisea.md`, `tarkha.md`, `phirexes.md`, etc.) always points at a real entity that resolves to a codex page; `currency.md` resolves to nothing. A reader of the public codex sees "documented in `currency.md`" / "the standard is in `currency.md`" — a pointer to a file they cannot open, reading like an author's note that leaked into the body.
- Fix (pick one, apply corpus-wide): (a) author a `currency`/economy overview entity so the reference resolves, or (b) drop the literal filename and phrase as "the wider money system" / "the southern standard" without the backtick path. Right now every currency edit ships this dangling ref.

---

## TECH-BOUNDING SET

### race-goblin-coghead.md — CRITICAL (the file the task flagged)
- This file was NOT touched this run, and the run's edits to its parent now contradict it.
- **L8 (blurb) + L20–24 (body) + L26–28 (Aspects)** still frame Coghead as a freely-chosen, perfectible mechanical ENGINEERING tradition: "an engineering tradition in Kobuk that commits to mechanical body-augmentation as a chosen craft, not an inherited trait"; "spent generations perfecting the art of mechanical augmentation, replacing or enhancing their natural body parts with intricate contraptions and gear-driven devices"; "living testaments to their engineering prowess." Nothing about aether; nothing about a lost craft.
- This contradicts, after this run:
  - **race-goblin.md** (now: Coghead "graft aether-fed augmentations into their own flesh, a surviving fragment of a lost craft"; mechanics block: "the grafting craft your hold keeps secret... a relic of a lost art, not something the world at large can build or replace").
  - **world-systems-invariants.md L31** (locked): "Aciabro/Coghead fleshcraft and Techgnome relics (surviving fragments of a lost craft)" — a bounded exception fenced behind a lost monopoly, explicitly NOT a general, perfectible tech tier.
- This is exactly the "cover-less mechanical sci-fi mismatching race-goblin.md" the task warned about: the subrace reads as steampunk tinkerers who innovate and perfect replaceable machine parts, which the invariant and the updated parent now forbid.
- Also independent STYLE violations in the same file: "intricate contraptions" ("intricate" is banned AI-vocab) and "living testaments to their engineering prowess" ("testaments" is banned AI-vocab + legacy puffery; "prowess" is puffery). Plus the boldface Aspects/heritage convention.
- **Fix:** rewrite race-goblin-coghead.md (blurb + body + Aspects) to match race-goblin.md and the invariant — aether-fed grafts as a surviving fragment of a lost craft, secret to Kobuk and non-replicable, NOT a perfectible chosen engineering tradition; strip "intricate"/"testaments"/"prowess." Until then the parent and its own subrace file openly disagree.

### Aether reframe — magic-aether.md, overview-magic.md, plane-astral-currents.md — DRIFT FIXED (affirm)
- **magic-aether.md:** now "It is not native to Alaria, and it is not one of the four native sources of Alarian magic" + "Drawing it out is not chemistry. It is an exotic working." This is CANON-REQUIRED, not drift — invariant L31: "Aether is foreign (from the Lanthornia stack), exotic, and is NOT a fifth native magic source." Do NOT "correct" the "not native magic" language; it is the locked framing.
- **overview-magic.md L34:** the OLD text carried the drift — "powers sky-ships and engines through **chemistry** rather than any of the four sources." The new text removes it: "no reproducible chemistry but an exotic planar craft." FIXED.
- **plane-astral-currents.md:** aether paragraphs rewritten — "an exotic working, not a chemistry that could be taught from a manual" and "not a combustion that any foundry could copy or scale." No residual sci-fi/industrial drift. The rest of the diff is a thorough em-dash purge (good).
- Residual nit (**MINOR**): magic-aether.md and overview-magic.md keep the "behaves much like a steam engine" analogy. It is immediately bounded ("not a combustion any foundry could scale" / "does not generalize past the goblins"), so it is within the invariant's "aether engines are sky-ship propulsion, not a power grid." Acceptable; note only.

### TERMINOLOGY — aether / aetherial / aetherium / Etherweaver — MAJOR (task-requested audit)
- **Near-homophones meaning OPPOSITE things.** "Aether" = the off-world Lanthornia meta-fluid, explicitly NOT magic (magic-aether.md). "aetherial"/"aetherium" = the mage-kings' own (failed) name for KETHIC **native** elemental magic — era-lost-ages.md L20/L38, era-age-of-craggus.md L26 ("harness the power of aetherium"), event-shadowrift.md L36 ("the aetherial arts"), event-aetherial-reckoning.md. A reader who meets both terms will conflate foreign-non-magic fuel with native magic. The invariant itself uses "aetherial (Kethic)" for the lost industrial peak while reserving "aether" for Lanthornia — the collision is baked in.
- **Worse: a people-name collision.** The fuel extractors are "**aether weaver goblins**" (magic-aether.md, plane-astral-currents.md, overview-magic.md L34). race-goblin.md L31/L53 carries a SEPARATE "**Etherweaver**" heritage = "attunement to non-basic elements" (Kethic — time/void/force/light/dark, per morgnor-s-cradle.md L35). Per magic-aether.md the fuel-goblins' sensitivity "developed after the eruption," a different origin from Kethic elemental attunement — so canonically these are two different goblin groups wearing nearly the same name.
- **And the corpus actively conflates them:** yuki.md L19 ("etherweavers—the aether-producing goblin variant whose secretions fuel magical devices"), L39 ("produce a steady supply of goblin aether"); hills-of-red-gold.md L19; creature-morgnor-dragon.md L13; morgnor-s-cradle.md — all treat the Kethic-elemental "Etherweaver" heritage as the aether-fuel producers.
- The aether-reframe run cleaned magic-aether/overview-magic/plane-astral-currents but did NOT disambiguate this (the conflation files are out of this run's set, but the task asked the question). **Recommend a naming decision for the gate:** rename one side (e.g., fuel-goblins → "aether-tappers", or the Kethic heritage off the "ether" stem), and fix yuki.md / morgnor-s-cradle.md / hills-of-red-gold.md to stop calling Kethic-elemental Etherweavers "aether-producing." Until then "aether" reads as both off-world fuel and native elemental magic depending on the page.

### plane-astral-currents.md — residual boldface — MINOR
- The em-dash purge is thorough and the inline boldface was stripped (astral steel, astral filings, aether weaver goblins, the "You cannot..." military lines). But bold list-labels remain and the guide bans boldface everywhere: Major Trade Hubs ("**Gorath** dominates", "**Kyagos**", "**Adron**", "**Tornia**", "**The Western Isles**") and Cultural Attitudes ("**Gorath and Kyagos**", "**Adron and Tornia**", "**The Western Isles**", "**Landlocked interior regions**"). Finish the cleanup.

### overview-magic.md L12 — burstiness regression — MINOR
- Opening changed from "Magic in Alaria is not one thing. It is four, and almost everything..." to "Magic in Alaria has four sources, and almost everything...". The original short-punch pair had better burstiness — the single most-prized virtue in this guide — on the most-read magic page. The rewrite is more direct but flatter. Defensible; low priority. (Note: the original was NOT a banned construction — "is/It is" are present copulas, not copula-avoidance, and not a "not just X but Y" parallelism — so there was no rule reason to flatten it.)

### Clean tech-bounding adds — AFFIRM (no action)
- **race-goblin-aciabro.md:** blurb + body drop the "cyborg" sci-fi framing and recast as handmagic/Deoric "surviving fragment of a lost craft" that spends life — canon-correct (Deoric costs life; invariant L31). The blood-vs-aether fuel split from Cogheads is coherent. Strong.
- **race-dwarf-gruynmar.md:** added gunpowder-secret bounding ("never written down and never sold... A Gruynmar exile ashore is a dangerous gunner, not the seed of a gunpowder trade") — matches invariant ("guarded clan secret that does not spread"). 
- **race-ogre-silzar.md:** "not a second gunpowder people but the rare landward customers of the only one there is" — matches invariant ("Silzar mammoth-cannon are downstream consumers, not a 2nd source").
- **race-gnome-ohblex.md:** "The craft cannot be taught out of the line, only born into it... never spread beyond the deep peaks and never will" — matches invariant (Ohblex racial-secret clockwork).
- **mkinti.md:** de-em-dashed + "What crosses the border is finished work, never the making of it... copied nowhere" bounds the clockwork secret; tradesWith→666 edge consistent with prose.
- **camaran.md:** the new "#### The cost of the ban" section is the strongest add in either set. All names canon-consistent — Doravin Selmari (First Consul; echea.md), Renaro Tovellin (person-renaro-tovellin.md), Padrin Olveri (named in that file). It bounds Camaran clockwork ("hand-built in guild workshops... no manufactory and no way to make two of anything quickly... still falls a tier short of the gem-cut precision the Ohblex of Mkinti keep secret"), matching the invariant ("Ohblex/Camaran clockwork... guild-gated precision, hand-built"; "no mass production"). Sentence-case header correct. Mild overlap with person-renaro-tovellin is acceptable (it is the nation's defining political fault line). No violation.
- **race-goblin.md:** Coghead + Aciabro summary lines and the Coghead mechanics block correctly rewritten to lost-craft/aether-fed framing. (This is precisely what orphans race-goblin-coghead.md — see CRITICAL above.) Pre-existing boldface heritage labels ("**Scalawag**", "**Etherweaver**", "**Coghead**", "**Aciabro**", etc.) remain — banned boldface, pre-existing, MINOR.
