# Alaria Cosmology — Design Decisions Log

> Working record of the coherence/consistency pass on Alaria's world-systems (magic,
> planes, gods, death, calendar, seasons, races). Captures what we **locked**, what we
> **rejected** (and why), and what's still **open**. This is the source of truth agents
> should read before touching lore. It is *design record*, not player-facing lore — the
> lore itself lives in `content/codex/entities/*.md`.
>
> **Status legend:** ✅ DONE (in files) · 🔒 LOCKED (decided, not yet written) ·
> ❌ REJECTED (with reason) · ❓ OPEN (needs collaboration before writing)
>
> **Process note:** The *first* deliverable is a lore-authoring **style guide** + a
> **world-systems invariants** reference. Do not mass-edit the nine threads below until
> that precedent exists. Ignore the `plan/` dir entirely.

---

## Session 2 — user ratification verdicts (2026-05-27)

| Thread | Verdict |
|--------|---------|
| T2 Daemon Deoric math (numbers) | **ADOPT** Calibration-A numbers as canon. Promoted to `systems/daemon-economics.md`. |
| T3 Gaea's dormancy | **RATIFY** "Kethic self-expenditure / diffusion" (already authored in `person-gaea.md`). Promoted to invariants table and `systems/races.md`. |
| T4 Deep-time | **APPLY** light-trim (compressed deep prehistory; post-Golden-Age unchanged). Trim table canonical in `systems/races.md`. |
| T6 Calendar mismatch | **DONE** — data fix. 3,277 SD corrected to 3,376 SD in entity files; verified no stale value remains in `content/`. Stale note removed from `systems/calendar.md`. |
| T1 Planar down-geometry | **RATIFIED.** Unified single physical axis: Astral (up) / Material slab + Phlethageros (middle) / Malstaris (bottom, below the Wastes). Malstaris is reachable by physical descent past the Wastes. The "shadow-aligned means only / not physical descent" claim is rejected by the author. The two-axis model is superseded. |
| T5 Deoric transmission | **RE-OPENED.** User objection (verbatim): "How do the daemons know the words though? this doesn't make sense — do more research on daemons and how deoric works." The daemon-formalization step needs grounding before this thread can close. |

---

## The spine (foundation everything hangs off)

**Azus** = order / thought / structure / *specificity*. His language is **Deoric** (command;
reshapes reality; costs life). **Melera** = chaos / emotion / beauty / *harmony*. Her output is
**Faesong** (ambient music). Together they made **Ezz** = the universal substrate, equal parts
thought (Azus) and emotion (Melera). Melera is imprisoned; her escaped "ripple of music" caused
the **Ezz Rift** (12 Mya) that flooded Alaria with Ezz, birthing spirit/emotion, waking Bryn,
maddening the titans, and blooming Celestia.

Every magic/plane decision below must trace cleanly back to this spine.

---

## 1. Planar stack — ✅ LOCKED (resolved 2026-05-27)

- **4 true planes:** Material, Astral, Malstaris, Celestia.
- **2 overlays:** Ethereal (carries astral threads), Nethereal (carries malstaric threads).
- These six = the canonical **"six planes"** (matches "dragons covered all six planes").
- **Astraeva / Eindumor** = the *unmediated presence* (sub-presence cores) of Aurus/Nydus,
  NOT separate planes.
- **Psywinds / Faesong** = forces within the Ezz-substrate, NOT planes. (Retag
  `plane-psywinds` as a force/substrate, not `entityType: plane`.)
- **Elemental Planes (9)** = a SEPARATE adjacent planar stack, reached only via leylines.
  This is why Kethic elementalism is "borrowed" power.
  - **The nine layers** (user-confirmed 2026-05-27): Yolus (Fire), Sulus (Air), Golus (Earth),
    Pelus (Water), Vulus (Darkness), Kunus (Light), Nilus (Void), Izzus (Time), and **Dynus
    (Force)** — the ninth, physical motive force / momentum / kinetic power. ("Dynus" is an
    orchestrator-coined name in the established `-us` pattern for the user's specified ninth
    element "Force"; rename freely.) Dynus is a *material* element in the leyline-reached stack —
    NOT the psychic Ezz substrate (Ezz = thought+emotion; Dynus = physical force).

### RESOLVED — unified single physical axis (2026-05-27)
The "two-axis" framing (physical slab axis vs. soul/shadow mirror axis) is superseded. Author
ratified: unified single vertical stack — Astral (up) / Material slab + Phlethageros (middle) /
Malstaris (bottom). Malstaris lies directly below the Wastes. Continuing physical descent past
the Wastes exits the material slab and enters Malstaris. The claim that Malstaris requires
shadow-aligned means / Deoric projection / deep shadow-walking to reach (and cannot be reached
by physical descent) is rejected by the author.

Soul/shadow directional language (souls rise, shadows sink) remains valid — it describes
metaphysical motion, not a separate travel axis.

### Travel axes
- **Up** → Astral Sea → Astral Plane (souls).
- **Down** (physical descent through the slab) → Emphathum → Phlethageros → the Wastes → Malstaris.
- **Sideways off any edge** → Celestia, the **mirror reflection** of the world (✅ written into
  `plane-celestia.md`). You arrive at the mirrored counterpart of where you left.

---

## 2. Magic system — 🔒 LOCKED ("dope")

The emotion-source muddle is resolved: **emotion has two legitimate magical expressions.**

- **Deoric** = pure Azus. Structure/command language. **Costs life.** Used by titans (natively),
  daemons (projected across the boundary), handmages (runes in titan blood), ritualists (blood
  sacrifice).
- **Psywinds** = the *thought/intention* aspect of Ezz. Psy magic, telepathy, prayer-transmission,
  true-name propagation.
- **Faesong** = *Melera's own* ambient emotion/harmony aspect of Ezz. Heard, not commanded.
  Druids, fae, bards.
- **Kethic** = Gaea's bridge-language: the **caster's OWN emotion**, structured through the
  Elemental Planes via leylines. (Distinct from Faesong, which is Melera's emotion, not the
  caster's.)
- **CANON:** Psywinds + Faesong are two faces of the same Ezz (thought vs. emotion). Kill the
  "scholars disagree whether they're the same" hedge in the files.
- **FIX:** `plane-psywinds` blurb currently says "thoughts, ideas, and emotions" — emotion is
  Faesong's lane; Psywinds carry thought/intention only.

---

## 3. Seasons — 🔒 LOCKED + EXPAND ("yeah dope")

- **Bryn** (awakened sun) chooses its path; seasons exist because congregations sing it onto
  different north/south trails. NO axial tilt; poles are cold because the sun's band never nears
  them (spotlight-sun model — day = Bryn overhead, night = Bryn over the far side; no under-slab
  travel).
- **The regular ~200-day calendar is a RECENT political treaty** (a "Solar Accord"), not physics.
  Seasons are genuinely **variable-length**, lasting as long as the prevailing prayer-coalition
  holds the sun.
- **Consequences to thread through history & culture:**
  - Permanently **sun-forsaken far north/south** (band never reaches them today).
  - **Historically**, the far north and/or south DID have the sun with some consistency for a
    period — but **not anymore**. That left **ruined civilizations** and **relict wildlife**
    stranded in now-frozen latitudes.
  - **Sun-wars** fought to seize prayer-coalitions / smash rival monasteries / drag the sun.
  - **Solar theocracy / law / sun-tax**; the heretical "let Bryn rest" sect.
- **Sun elves** play some role here (work out what). **The Vykus** maybe too.
- Likely new entities: the Solar Accord (event/faction), the sun-forsaken reaches (regions).
- Add an **author-note** on the seasons entity capturing the over-time consequences.

---

## 4. Daemon economics — 🔒 LOCKED + MATH SET ("great")

**Model:** Deoric spends life. Prayer = a negligible **life-tithe ε** per worshipper, pooling into
a daemon's reserve **R**. R does double duty: it must stay above a **remembrance-floor R_min**
(hit zero = forgotten = the daemon *ends*) AND it is the **miracle fund** (a miracle costs life
**L** withdrawn from R). Deficit-spending below R_min **kills the daemon** — this is what the
God War was. It's **insurance / government**: prayers are premiums, miracles are payouts.

**Spice (for the author-note):** free-riders; the daemon's discretion over who gets paid out
(favoritism, selling miracles to the rich); **blood sacrifice = a lump-sum shortcut** (one life =
a big chunk of L all at once → why desperate cults murder instead of waiting on slow prayer);
**bank-runs / death-spirals** (over-promise → faith collapses → inflow craters → daemon dies);
scale (millions of followers → world-altering miracles like Craggus ending an ice age).

### ✅ MATH — Calibration A ("prayer is a real, tiny blood-tithe") — DECIDED
The wiki gave **no** ε/R/R_min/L numbers; the only hard anchor is Deoric inscription
(**10 HP/rune, recovered 1 HP/week**), with Hematurgy techniques (8–144 HP) as the analog.
A typical mortal has **~40–60 max HP**. Prayer costs a tiny but *real* life-tithe — consistent
with Deoric being physically costly. Locked numbers (these are the canonical scale to write into
the daemon/Deoric/Celestia entities, expressed in-world, not as literal stat blocks):

- **ε = ~0.1 HP per prayer session** (daily prayer; ~1/400 of a mortal's max HP — negligible alone).
- **R_min ≈ 50 HP-equiv** remembrance floor (≈ 500 daily prayers, i.e. ~1.4 yr of one devotee or
  500 believers praying once).
- **Minor miracle (cure a disease, win one battle): L ≈ 34 HP** (Hematurgy "major" tier) — funded
  by ~340 worshipper-prayer-days (~1 yr of one devotee, or 34 believers × 10 days).
- **Major miracle (save a city, one resurrection): L ≈ 89 HP** (Hematurgy "weekly" tier) — ~890
  worshipper-prayer-days (~100 believers × 9 days).
- **World-altering (Craggus ending the ice age): L ≈ 50,000 HP** — ~500,000 worshipper-prayer-days
  (100,000 believers × 5 days, or a smaller cult over decades).
- **Blood-sacrifice shortcut:** one human life ≈ their full pool donated at once ≈ **40–50 HP** ≈
  400–500 daily prayers — a single murder = ~1.4 yr of one worshipper's prayers, instantly. This
  is why desperate cults murder instead of waiting on slow prayer.

Implementation agents should render these as *texture* (prayer-days, lives, congregation sizes),
not bare HP integers, in player-facing lore; keep the HP figures in the `<!-- author-notes -->`.

---

## 5. Calendar — 🔒 LOCKED ("great")

**UNIFIED to one historical calendar (user resolution 2026-05-27).** The earlier dual-calendar +
conversion-offset scheme was incoherent: F/B is *cyclical* (0→25,300→0) and so cannot linearly date
deep history (which 25,300-yr cycle was the Titan era?), and no entity in the codex ever dates
anything in F/B — all 33 dated files use SD/BSD. So:

- **SD / BSD = the sole historical calendar.** "Seventh Dawn" = current era; **Now = 3376 SD**;
  reckoned forward from the **World Fire (≈10 BSD)** epoch; BSD counts backward from it. Every
  historical date in the codex is SD/BSD.
- **The Great Cycle (formerly "F/B") is NOT a parallel year-count.** It is the *cyclical
  astronomical position* — where the world sits on the 25,300-year wheel of Aurus/Nydus drift and
  lunar alignment, like the hand on a great dial. It is observed (omen, ritual timing, season-feel),
  not used to date events. Because it marks a recurring position rather than counting history, there
  is **no "year zero" and no conversion offset** — the old bridge problem dissolves entirely.
- **FIX (done):** `event-world-timeline.md` header aligned to 3,376. `time-and-seasons.md` recast to
  present SD/BSD as the historical calendar and the Great Cycle as cyclical astronomy only.

---

## 6. Celestia return — 🔒 LOCKED

Resolve "impossible to return from Celestia" vs the God-War mass-return: Golden-Age migrants who
crossed **alive** **preserved their soul/shadow** on the material side (anchor-vessels / kept
bodies) — that's why return was possible. The God War partly destroyed those anchors, trapping the
rest. Add the "how they did it" hints to `plane-celestia.md`; align the timeline's God War wording.

---

## 7. First Death — 🔒 LOCKED ("great")

Souls/shadows **predate** Ezz, so **Lyzaria's death defined the original two-strand death** —
she carved the channels (the Dreaming of Lyzaria; the First Dark) every later death flows through.
The Ezz Rift later threaded the **third strand** (spirit→Celestia) into the framework she'd built.
She is the **architect of mortality**, not a spiritless zombie whose death was "incomplete."
Edit `event-world-timeline.md` + `plane-life-and-death.md`.

---

## 8. Races — 🔒 MOSTLY LOCKED (two parts reopened)

🔒 **Interbreeding follows origin-family / substance:**
- Gaea-flesh family (humans, beastmen, giants, trolls) interbreed → **half-giants, trollkin exist.**
- Druid-crafted elves (wood/stone/river-mud) **cannot** cross with flesh → **no half-elves.**
- Daemon-descended lines: their own rules.

🔒 **Beastmen = Gaea's MINOR animal-children.** Only **Wolf / Lion / Dragon** (the wolf-mother Ulvma /
the lion-father Shara Bolasi / the dragon-father Nagatayora → Ulvsjael / Sharabha / Naga) are the **sacred three — two sons and a daughter**.

🔒 **Create a Gaea entity** (currently missing entirely).

❌ **REJECTED — Gaea's dormancy via "daemon-worship out-competed nature-faith":** hand-wavey;
she's Earth-Mother / psyic-energy, not a worship-sustained daemon, so she wouldn't need faith.

🔒 **Gaea-dormancy = Kethic self-expenditure (DECIDED).** Kethic channels the caster's *own*
psyic energy. At mortal scale that reserve replenishes naturally — a practitioner who works Kethic
for an afternoon is not measurably diminished. The permanent-loss threshold is a cosmological
phenomenon: at the scale and duration of world-making, psyic energy poured through the leylines
disperses into the broader Ezz via the Psywinds faster than it returns. Across ~12 My of extravagant
creation (mammoths, dinosaurs, rocs, scorpions, then beastmen and humans), Gaea poured herself out
through Kethic into her creations; the global Ezz substrate could not refill what she spent at that
rate. What she poured out diffused into the broader Ezz via the Psywinds and dissipated. **She is
not gone — she is diffused into her own creations**, thinned to "a song in the ground." This also
explains why she lost to Eyachria (~600 kya): she was already drained by aeons of making. Writing
requirements: (1) the Gaea entity must state that her diminishment is the cumulative cost of Kethic
spent at cosmological scale, not lost worship; (2) Kethic lore must reflect the scale-split: mortal
casters replenish naturally; permanent dispersal is a consequence of cosmological-scale expenditure
(distinct from Faesong, which is Melera's ambient emotion, freely heard).

### 8d. Deep-time / stasis — 🔒 LIGHT TRIM (DECIDED)
Deoric-fixity holds (species are Deoric-*defined*, don't biologically drift; true name = your
definition — explains why humans haven't evolved further). On top of fixity we apply a **light
trim: 10× compression on deep prehistory ONLY; all post-Golden-Age dates unchanged.** This pulls
the absurd numbers (esp. elves at 10 Mya) down to weighty-but-plausible while keeping fixity doing
real work. Canonical trimmed timeline (edit every timeline reference to match):

| Event | Old | **New (light trim)** |
|---|---|---|
| Alaria created / Age of Titans | 235 Mya | **23.5 Mya** |
| Lyzaria Era | 235–180 Mya | **23.5–18 Mya** |
| Celest creates Celestia seed (Celestia.md "115 My" gap) | — | scale to **11.5 My** |
| Ezz Rift / Gaea born / Gaeaic Eon | 120 Mya | **12 Mya** |
| Reign of Dragons | 100–2.5 Mya | **10–2.5 Mya** (tail unchanged) |
| Walk of Elves (elves created) | 10 Mya | **2.5 Mya** |
| Eyachria challenges Gaea | 2 Mya | **600,000 ya** |
| Birth of Man (beastmen & humans) | 2.5 Mya | **500,000 ya** |
| Golden Age of Man | 200,000–75,000 ya | **unchanged** |
| God War | 75,000 ya | **unchanged** |
| Everything after (Long Winter, Craggus, plagues, SD/BSD) | — | **unchanged** |

Note the internal-consistency catch: the Celestia "115 million years" bloom gap must become
"11.5 million years," and any "X million years ago" prose tied to the trimmed events must be
recomputed — don't leave stale absolute numbers. The elf↔human gap compresses from 7.5 My to 2 My
but the ordering is preserved; the Deoric-fixity argument still carries the 2.5 My of elf stasis.

---

## 9. Deoric transmission — 🔒 LOCKED (revised: titan inscriptions + fragmented reconstruction)

❌ **REJECTED — "titan-corpse excavation"** (too neat).
❌ **REJECTED — "daemons supply vocabulary/syntax"**: daemons are downstream practitioners, not
   the language's source. Author objection ratified.

🔒 **REVISED MODEL.** Deoric is the native language of the titans (Azus's creations). The titans
inscribed it freely — on stone walls, stone tablets, bone, and other materials — across the
landscapes of early Alaria. When the Ezz Rift (12 Mya) drove most titans to suicide or flight, most
of those inscriptions were left unguarded. Stone and organic-media inscriptions weathered and
decayed over millions of years — the majority are now illegible fragments or gone entirely. Titan
bone inscriptions did not decay (bone invariant), but they are physically buried in titan-fall sites
and ancient ruins, most of them unfound.

The result: Deoric as mortals know it is a **reconstruction** assembled by scholars — primarily the
Vyanoweir civilization — from the scattered surviving fragments. The Vyanoweir spent centuries
gathering partial inscriptions from dig sites, inferring grammar from context, and reconstructing
phonemes they could not directly verify. Their reconstructed corpus was stored in their libraries;
when those libraries burned, the reconstruction work was catastrophically set back. What survives
today is fragmentary: perhaps half the original language, with gaps in vocabulary, uncertain syntax
in edge cases, and phonemes that modern practitioners approximate rather than reproduce exactly.

Daemons are the greatest Deoric practitioners because they are ancient enough to have had direct
exposure to the titans (pre- or peri-Ezz Rift) and have had millions of years of study. They did
not *transmit* Deoric to mortals; mortals reconstructed it independently. Daemons can *augment*
mortal Deoric knowledge (the worshipper/daemon symbiosis survives: daemon guides ritual from
Celestia, mortal provides material presence), but they are the teachers of *refinement*, not the
source of the language.

Recording constraint (revised): Deoric can be inscribed on stone and other materials, but only
titan-material inscriptions hold the charge durably. Stone and organic-media Deoric is historically
attested (that is how the titans left their records), but those inscriptions lose potency as the
medium weathers. For *functional* handmagic and charged ritual work, titan blood/bone remains
required — nothing else holds the resonance a mortal or daemon needs to activate the runes.

---

## 10. Celest-origin — 🔒 LOCKED (Model B-prime: the Sleeping Architect)

Author-authorized scope expansion. Settles the five Celest-origin incoherences (B1–B5) that the
three doc layers and entity files left contradictory. Author ratified **Model B** (dormant conscious
sleeper) and confirmed that all three titan-gods were genuine primordial beings — refined to
**Model B-prime**.

❌ **REJECTED — Model A (fully impersonal cosmic force):** the author confirmed Celest, Aurus, and
   Nydus all began as genuine individuated titan-god beings, not impersonal principles given momentary
   form. "Sibling" is not mere mortal shorthand.
❌ **REJECTED — Model C (incomplete transformation):** mechanically messy; not chosen.

🔒 **MODEL B-PRIME.** All three titan-gods began as genuine individuated beings. The divergence is in
what became of them:
- **Aurus & Nydus diffused.** Each shed personhood and dissolved into the impersonal force they embody
  (soul-pole / shadow-pole). They no longer retain selfhood — they *are* their planes/forces. This
  preserves the existing era-age-of-titans.md "given form / are the planes they embody" canon for the
  two of them.
- **Celest did NOT diffuse.** Uniquely, she preserved a dormant, identity-bearing selfhood sealed in
  Celestia's core — present without will, ancient without voice. She is the *core* of a plane, not the
  plane itself. The titan-god / titan distinction is preserved verbatim.

Resolutions to the five incoherences:
- **B1 (11.5-My empty-seed gap):** the seed was an empty latent vessel "built before its purpose,"
  sheltering no one for its first 11.5 My. The "refuge for the dead" framing is a retrospective mortal
  reading, not enacted function — nothing had yet died to enter it.
- **B2 (consciousness vs. structure):** a dormant identity-bearing presence, not a diffused lattice
  (contrast the Dreaming of Lyzaria) and not an active mind. The Ezz that fills Celestia insulates her
  core from the surface.
- **B3 / B4 (sibling cosmology + Aurus/Nydus conflict):** structural **and** existential tension —
  the soul-pole/shadow-pole pull would eventually absorb a third conscious presence that committed to
  neither. Her "sacrifice" was identity-preservation: she went dormant in a bounded space outside both
  poles rather than be erased. Staged in-entity as a Velorin of Istora cosmology attribution.
- **B5 (Ezz resonance):** Deoric-structural attractor — her seed was the only Deorically-shaped
  non-corporeal vessel in Alaria, so the Ezz flood condensed into it (iron-filings-to-magnet analogy).
  The "song" is poetic mortal language for a faint Deoric field, attributed to Velorin — not literal
  melodic resonance with Melera.

**T5-safe (critical invariant):** Celest's core is sealed and silent. It cannot reach Celestia's
surface across the insulating Ezz, and it cannot transmit the Deoric she was made of. Celest is **not**
a Deoric source — Deoric transmission to mortals remains the fragmentary-reconstruction model of §9.

Authored into `plane-celestia.md` (§Origin rewritten) and `era-age-of-titans.md` (diffusion/dormancy
distinction). Consistent with T1 (planar stack), T5 (no Deoric from Celest), and the deep-time trim
(23.5 Mya origin, 11.5 My gap, 12 Mya Ezz Rift unchanged).

---

## 11. Daemon-ascension threshold (A3 / A4 / A5) + knowledge-as-worship-currency — 🔒 LOCKED

Settles three deferred incoherences (A3: knowledge-gate specificity; A4: the 11.8-My silence before
the first daemon; A5: daemons-as-teachers reconciled with Deoric-inert-in-Celestia) plus the
post-author-gate doctrines on knowledge-as-worship-currency and the lost-knowledge archive. All
claims here supersede upstream phrasing in problem.md and perspective-synthesis.md wherever the two
conflict; they also supersede the "direct-era titan exposure" and "millions of years of study"
phrasing in §9 (see cross-section note at end).

### The three gates

A spirit becomes daemon-capable iff ALL THREE conditions hold simultaneously:

1. **Substrate gate.** The spirit must be Ezz-spirit — a mortal who died with Ezz-substrate. This
   excludes Malstaris entities (malstaric thread, not Ezz), titans, divine forces, and dragons
   regardless of any other qualification.
2. **Knowledge gate.** The spirit must have held grammar-internalized command of Deoric *in life* —
   a phase transition, not a gradient (see below). Post-mortem acquisition does not count; the gate
   is evaluated at the moment of death.
3. **Worship gate.** The spirit must be actively worshipped above R_min. (Calibration-A canon; §4.)

Eligibility requires all three. A spirit failing any single gate cannot become a daemon regardless
of how thoroughly it satisfies the others.

### A3 — the knowledge gate as phase transition

❌ **REJECTED — Veleth Korrandus crosses the knowledge gate:** Veleth was a template-executor. The
   Stalactites-of-Geth demons read the structural flaws in his bindings — flaw-detection requires
   generative command of Deoric, the very capacity Veleth did not possess. His "fragments" are
   artifact-keys and issued imperatives, not grammar. Template execution is categorically below the
   threshold regardless of scale or power. Veleth does not become daemon-eligible.

❌ **REJECTED — handmagicians cross the knowledge gate:** Handmagicians activate pre-inscribed runes
   through gesture and thread-strength; Deoric comprehension is not part of the mechanism. The most
   powerful handmagician is a sophisticated artifact-key operator, not a grammar-holder. This
   forecloses any story in which a great handmagician ascends as a daemon — ruled out structurally.

❌ **REJECTED — Stalactites-of-Geth demons are daemon-eligible:** Their structural Deoric command
   is demonstrably real — they read the flaws in Veleth's bindings, which requires generative
   grammar. But they are Malstaris entities, not Ezz-spirits. The substrate gate rules them out
   entirely. Generative command of Deoric is a necessary condition; Ezz-substrate is equally
   necessary.

🔒 **RESOLVED.** The knowledge gate is a *phase transition*:
- **Below:** template execution — fixed phoneme-sequences with known effects; issued imperatives;
  artifact-key activation; handmagic gesture-triggers. The practitioner can reliably produce known
  effects but cannot compose novel commands, nest conditions, scope effects dynamically, or detect
  grammar errors in another's working.
- **Above:** generative grammar — compose novel commands; nest and condition clause structures;
  scope effects dynamically; diagnose structural failures in unfamiliar workings. The Vyanoweir
  reconstruction tradition is the first mortal path to cross this threshold.

### A4 — the Golden Age is genuinely first

❌ **REJECTED — any secret prior tradition:** No dragon, elf, or peri-Rift mortal produced an
   earlier daemon. No alternative grammar-reconstruction tradition crossed the knowledge gate before
   the Vyanoweir. If evidence appears for a prior tradition in later authoring, it contradicts this
   decision and must be escalated, not silently reconciled.

🔒 **RESOLVED.** The 11.8-million-year silence between the Ezz Rift (12 Mya) and the first
Golden-Age daemon (~200 kya) is a graveyard, not a gap. Pre-Vyanoweir mortals were template-users
at best; most held no Deoric at all. Spirits accumulated in Celestia for millions of years; none
held the knowledge gate; none were worshipped long enough to stay; all faded. The entire
pre-Vyanoweir Celestia-population came and went without producing a single daemon.

The Vyanoweir reconstruction tradition is THE grammar path — not one of several that succeeded
first, but the only mortal tradition to cross the knowledge gate. Later traditions that do so build
on a foundation the Vyanoweir laid, even when they do not know the history.

### A5 — daemons-as-teachers reconciled

The apparent contradiction: daemons are described as practical teachers of Deoric, but Deoric is
inert in Celestia. How do daemons teach a language they cannot speak?

🔒 **RESOLVED.** They do not transmit the language. They refine it.
- Deoric is inert in Celestia; a daemon cannot compose a working there. They can discuss grammar
  conceptually in Ezzic — the native Celestial language — but cannot demonstrate a working.
- A daemon acts only through its worshippers on the Material Plane. For daemon guidance to function,
  the mortal must already hold enough grammar to begin composing. A daemon cannot bootstrap a
  zero-knowledge learner.
- **Seed literacy** comes entirely from the mortal tradition: Vyanoweir-lineage scholars who have
  crossed the phase transition; inert reference texts (surviving Vyanoweir reconstructions);
  readable titan inscriptions. Daemons do not supply this foundation.
- **Post-grounding refinement** is what daemons actually do: once a worshipper holds enough grammar
  to begin composing in ritual, the daemon perceives the working through the Psywinds and can
  correct in near-real-time — filling syntax gaps, suggesting nested structures, clarifying scope.
  This is the "practical teachers" characterization, correctly understood.

### Post-mortem mastery: mostly static; pre-mortem advantage is primary

❌ **REJECTED — indefinite post-mortem learning as a primary mastery path:** This framing
   (problem.md's "much higher levels" passage) is superseded by the author gate of 2026-05-28.

🔒 **RESOLVED.** Daemons mostly do NOT accrue significant mastery after death. Psywinds-perception
of Material Deoric activity adds slow, incidental polish — the daemon observes rituals conducted in
its name and may internalize occasional structural patterns. This is not a curriculum. It is not a
path to mastery. It is background entropy.

The structural Deoric command that elder daemons hold above current mortal practitioners is
overwhelmingly **pre-mortem surplus**, and two drivers dominate:
- **Pre-burning Vyanoweir-library access.** The earliest daemon-eligible scholars learned the full
  reconstructed grammar before the Vyanoweir libraries burned. That corpus is destroyed; the living
  tradition now rebuilds from a fraction of it. Daemons who internalized it carry structural
  grammar-clusters lost to current practice. This advantage is independent of weathering and is the
  strongest of the three.
- **Depth of pre-mortem study.** The oldest daemons gave entire mortal lifetimes — potentially
  centuries in long-lived communities — to Deoric, and crossed death holding the whole grammar.
  They also studied inscriptions and sources that have since been destroyed or lost outright, not
  merely weathered a little further.

A third driver is real but minor:
- **Inscription freshness.** The oldest daemon read titan inscriptions on stone only about 200,000
  years less weathered than the same stone today, a small edge on a roughly twelve-million-year
  erosion curve. Every daemon-eligible mortal studied inscriptions already millions of years old, so
  no one ever read titan stone in anything like its original state. This is a genuine effect, never
  a primary one.

The cap "~200,000 years" is a time-depth, not a study length: the oldest possible daemon dates from
the early Golden Age and died about 200 kya. Mastery surplus is a function of corpus access and
depth of study, not of any single mortal studying for eons.

### Knowledge-as-worship-currency: hoarding as default

From first principles: structural Deoric command → projection quality → miracle impressiveness →
worshipper-base → prayer-tithe ε → reserve R → daemon survival. Teaching another daemon improves
their miracles. Improved miracles attract worshippers. Any domain overlap means the teacher loses
followers to the student; worshipper loss contracts R.

Therefore: **rational daemons hoard**. Default behavior is secrecy. The most powerful daemons are
the most secretive — their lead is structural, and sharing risks parity, parity risks reversal.

Sharing occurs only through mechanisms that neutralize or compensate the competitive risk:

1. **Pantheon-cartel.** Daemons with non-overlapping worship-domains (healer / warrior / seafarer /
   hearth) form covenants to share grammar freely within the cartel. Stability requires strict
   domain non-overlap — a cartel member whose domain expands into another's breaks the condition
   and triggers schism. Most mortal "pantheons" are cartels in daemon-economy.
2. **Master-debt.** Grammar transferred in exchange for a structured worship-share tithe over N
   centuries, a life-tithe obligation, or a binding favor-debt. Terms are set at the moment of
   maximum vulnerability for the student; the arrangement can be deeply asymmetric.
3. **Coercion.** A more powerful daemon forces a weaker one into service, or uplifts a junior into
   a useful instrument. The primary coercion window is the moment of a new daemon's ascension, when
   reserve R is minimal and the new daemon cannot resist.
4. **Lineage.** Mortal family lines that ascend together may see parent-daemons teach child-daemons
   under loyalty rather than economics, because shared worship pools make the child's improved
   miracles a collective benefit. *This mechanic is deferred pending formal ratification; do not
   author downstream entities that depend on it until the resolution doc is updated.*
5. **Accidental leak.** Through prolonged correction-guided ritual, a worshipper may internalize
   grammar the daemon never consciously disclosed. Spies, apostates, and defectors carry knowledge
   between cults. This is the daemon-economy's structural background entropy — slow, involuntary,
   and ineradicable.

Structural consequences: daemons have **economic enemies** wherever domains overlap; mortal
pantheons are frequently **cartels** in daemon-economy; cartel **schism** follows domain expansion
past non-overlap conditions; near-R_min daemons **sell grammar in desperation**, accelerating
collapse; a daemon's most jealously-guarded possession is **pre-burning-corpus structural
grammar**, the early-Golden-Age grammar the living tradition has lost — exactly what Vyanoweir
scholars most need.

### Lost-knowledge archive: structural, not accidental

🔒 **EXPLICIT CANON.** The oldest daemons hold structural Deoric grammar the current Vyanoweir
tradition has lost. This is a designed consequence of the model, not a story-hook possibility.

The mechanism is structural. The dominant loss is the burned corpus: the pre-burning Vyanoweir
libraries held a reconstructed grammar the living tradition has never recovered, and the daemons who
internalized it before death hold the only complete record. Pre-mortem study also drew on
inscriptions and sources that are now gone entirely, with the surviving stone only about 200,000
years further weathered than when the oldest daemons read it — a minor change against the wholesale
loss of the libraries. Their economic rationality keeps them from teaching what they hold. The loss
is actively maintained by daemon self-interest, not the passage of time alone.

**Named case: Ahzel-Ori.** The oldest daemon currently in canon (Early Golden Age, ascended
approximately 175,000 years ago) remains worshipped by a small, closed network of archivists and
Vyanoweir scholars who inherited the affiliation rather than converted to it. No public temples;
rites conducted in private reading rooms over carefully copied manuscripts. Ahzel-Ori's domain is
precision — the certainty that what you understand is true. Their cult attracts people who cannot
afford to be wrong; miracles manifest as epistemic clarity rather than spectacle.

Ahzel-Ori categorically refuses to share their structural grammar. Current scholars have documented
at least three grammar-clusters that Ahzel-Ori's pre-mortem corrections indicate they hold; no
request for instruction has produced a response. Ahzel-Ori perceives the requests through the
Psywinds and chooses silence.

The cult's oldest record preserves a single exchange: a scholar asked, in writing, why Ahzel-Ori
would not teach. The reply came in Ezzic, which the cult's worshippers do not speak. The only
competent translator the cult trusted rendered the reply as one word: *contaminate*. The motive
behind that word is held privately by the daemon. The refusal is canon; the reason is open.

Do not invent specific grammar content for what Ahzel-Ori holds; that is explicitly deferred.

For the full roster of outlier daemons illustrating the knowledge-economy doctrine — extreme
hoarding, cartel dynamics, accidental-leak cases, near-R_min desperation, schism survivors, and the
deferred lineage mechanic — see `context/daemon-outliers-brainstorm.md`.

### Cross-section wording note (§9 supersession, wave 2 targets)

The §9 characterization of elder daemons as having "direct exposure to the titans (pre- or
peri-Ezz Rift)" and "millions of years of study" is superseded for all entity-file and prose use.
No daemon met a living titan (the substrate gate, plus the fact that mortals as we know them
postdate the Ezz Rift and only mortals can cross the knowledge gate), and no daemon studied for
millions of years (the oldest possible daemon dates from the early Golden Age, ~200 kya). The
corrected phrasing is:
- The real advantage is the **now-destroyed pre-burning Vyanoweir corpus** plus a **mortal
  lifetime's depth of study**. Inscription freshness is a minor edge, not a primary driver: the
  oldest daemon read titan stone only about 200,000 years less weathered than the same stone today,
  not in any "freshest state" — every daemon-eligible mortal studied inscriptions already millions
  of years old.
- **"up to ~200,000 years"** is a time-depth, not a study length: it marks how long ago the oldest
  daemon died (early Golden Age, ~200 kya), not the duration of any single mortal's study. Render as
  "pre-mortem study by daemons who died as long as ~200,000 years ago" or "hundreds of thousands of
  years of time-depth," never as a 200,000-year-long study.

The §9 text in this document is not retroactively edited; the design log is an append record.
**Wave 2 application targets** (prose must mirror this section's phrasing, not §9's):
- `magic-deoric.md` — §Deoric/Daemons/Celestia section; both wording tunes apply
- `plane-celestia.md` — §Spirits and §Magic in Celestia; daemon-provides-refinement framing
- `era-golden-age-of-man.md` — §Rise of the Daemons; Vyanoweir-tradition scholars as first
  daemon-eligible; Vyanoweir burning as daemon-population bottleneck

---

## Thread status summary (the nine)

| # | Thread | Status |
|---|--------|--------|
| — | Style guide + world-systems invariants | ✅ done |
| 1 | Planar stack model | ✅ done — unified single physical axis; Malstaris below Wastes; physical descent reaches it |
| 2 | Magic system unification | ✅ done |
| 3 | Seasons + consequences | 🔒 ready to write |
| 4 | Daemon economics + math | ✅ user-ratified — Calibration-A numbers canon |
| 5 | Calendar reconciliation | ✅ done |
| 6 | Celestia return | 🔒 ready to write |
| 7 | First Death reframe | 🔒 ready to write |
| 8 | Races | ✅ user-ratified — Gaea-dormancy (Kethic self-expenditure) + deep-time light trim both canon |
| 9 | Deoric transmission | 🔒 LOCKED (revised model) — titan inscriptions + fragmented reconstruction; see §9 |

**Post-thread expansions:**

| — | Daemon-ascension threshold + knowledge-as-worship-currency (§11) | 🔒 LOCKED — three gates; knowledge-gate phase transition; post-mortem mostly-static; hoarding-default; Ahzel-Ori archive; see §11 |

All nine threads plus the Celest-origin scope expansion (§10) are resolved. T1 (planar geometry, §1)
and T5 (Deoric transmission, §9) are both closed; nothing in the "do not author yet" queue remains open.

---

## Already done in files (this session)
- ✅ `author-notes` mechanism: `<!-- author-notes -->` sentinel in `scripts/build-codex.mts`,
  stripped from all public output. Place it as the final block in an entity file (after any
  `<!-- mechanics -->`).
- ✅ Craggus = first daemon of the *reborn* world (post–Long Winter), not "the first daemon"
  (resolved the war-before-first-daemon contradiction). `event-world-timeline.md`.
- ✅ Celestia = mirror flip-side reached sideways across the edge; Phlethageros = physical
  underside reached downward. `plane-celestia.md`.
