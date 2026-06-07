# Codex Terminology Cleanup — Decision Doc

Read-only scout output. Two terminology issues mapped to a concrete, apply-without-re-investigating edit list.

**TL;DR decisions**
- **A (casing):** Capitalize **Aether** and **Lanthornium** as proper substance nouns everywhere they name the substance/stone — *including* open-compound modifiers ("Aether engine", "Lanthornium plate"). Lowercase **only** in hyphenated lexicalized compounds (`aether-tapper`, `aether-fed`, `aether-powered`, `aether-producing`, `aether-work`). Do **not** touch the unrelated lost‑Kethic word **aetherial/aetherium** — that is a different referent and stays lowercase.
- **B (canonical fuel-goblin name):** **`aether-tapper`** is the fuel/extractor goblin. **`Etherweaver`** is reserved exclusively for the native‑Kethic non‑basic‑element heritage. They are different peoples whose names rhyme.
- **Files needing edits:** **15 distinct files** (A: 3 anchor + 11 corpus‑wide; B: garlow + economy). 2 further files carry an *optional* heritage‑name capitalization tidy.

---

# A. CASING

## A.0 The evidence (why there's a problem)

Two well-formed conventions coexist for the SAME referents:

| Camp | Files | Treatment |
|---|---|---|
| **Capitalize** (proper substance) | `magic-aether.md`, `magic-lanthornium.md`, `plane-lanthornia.md`, `overview-magic.md` | "raw Aether", "purified Lanthornium", "a struck Lanthornium plate", "Aether engine" |
| **Lowercase** (common noun) | `plane-astral-currents.md`, `race-goblin-aether-tapper.md` | "burning aether", "purified lanthornium", "aether engines" (capital only sentence‑initial / in headers) |

Three `<!-- author-notes -->` blocks already flag this and defer the call:
- `magic-lanthornium.md:31` — *"Aether/Lanthornium capitalized to match the named sibling template magic-aether.md. Corpus drift to flag — plane-astral-currents.md and race-goblin-aether-tapper.md lowercase both. Orchestrator call on which convention wins…"*
- `plane-lanthornia.md:32` — same flag.

## A.1 The rule (RECOMMENDED — capitalize)

> **Aether** and **Lanthornium** are unique, coined, off-world proper substances (named after the **Lanthornia** planar stack). Treat them as **proper nouns: always capitalized** when referring to the substance/stone, in standalone use *and* as a noun-modifier in open compounds. Lowercase the word **only** inside a hyphenated lexicalized compound, where it is a fixed common-noun stem.

**Capitalize** (substance/stone): "raw **Aether**", "burning **Aether**", "the **Aether** cost", "purified **Lanthornium**", "a struck **Lanthornium** plate", "an **Aether** engine", "**Aether** engines".

**Leave lowercase** (hyphenated fixed compounds): `aether-tapper(s)`, `aether-fed`, `aether-powered`, `aether-producing`, `aether-work`, `aether-and-graft`, `aether-engines` (only where already hyphenated, e.g. `magic-air.md`).

**Rationale (3 load-bearing reasons):**
1. The entity **`name:` fields are "Aether" and "Lanthornium"** (capitalized) — these render as the codex page title and map label. A body that says "aether" mismatches its own title; a page titled "aether" reads as broken.
2. The author-notes explicitly designate **capitalized as the template** and the lowercase files as **drift to reconcile**.
3. A **unique named off-world import** behaves like a proper noun ("Unobtainium"), not a generic material class ("gold", "iron"), so capitalization is the defensible treatment.

*(Reversible-call note for the orchestrator: if you instead pick lowercase-common-noun, the edit set inverts — you'd lowercase the 4 "capitalize-camp" files **and** the `name:` titles, which is why capitalize is the cleaner pick. Everything below assumes the capitalize rule.)*

## A.2 CRITICAL scoping — three near-homograph referents

Do **not** blind-replace `aether`. There are three distinct referents (per prior gate finding #4 in `context/review-findings.md`):

| Referent | Spelling | Casing under this rule |
|---|---|---|
| Off-world sky-fuel | **aether** → **Aether** | capitalize (this is the target) |
| The catalyst stone | **lanthornium** → **Lanthornium** | capitalize |
| Lost-Kethic industrial height | **aetherial / aetherium** | **LEAVE lowercase — different word, not in scope** |

## A.3 Edit list — PRIMARY (anchor files)

> Rule of thumb for every file below: replace standalone & open-compound `aether→Aether`, `lanthornium→Lanthornium`; **never** touch a hyphenated compound (`aether-tapper`, `aether-fed`, …).

### `content/codex/entities/magic-lanthornium.md`
| Line | Current | Replace with |
|---|---|---|
| 5 (blurb) | `…it makes struck aether discharge the work an aether engine runs on.` | `…it makes struck Aether discharge the work an Aether engine runs on.` |
| 8 (relation `note`) | `…the same eruption that seeded Alaria's aether` | `…the same eruption that seeded Alaria's Aether` |

*(Body lines 13–23 already comply. Author-notes 26/31/33 are stripped at build — optional to fix; not public.)*

### `content/codex/entities/race-goblin-aether-tapper.md`
| Line | Current substring | Replace with |
|---|---|---|
| 6 (blurb) | `pull raw aether from the air` | `pull raw Aether from the air` |
| 16 | `Raw aether hangs in the air` | `Raw Aether hangs in the air` |
| 20 | `Their aether powers Yuki's alarms` | `Their Aether powers Yuki's alarms` |

*(Keep `Aether-tapper(s)`, `aether-producing`, `aether-tapper` compounds as-is. Line 22's Etherweaver disambiguation is correct — see Issue B.)*

### `content/codex/entities/plane-astral-currents.md`  *(the bulk of the casing drift — ~20 substance instances)*
| Line | Current substring | Replace with |
|---|---|---|
| 52 | `burns expensive aether to motor` | `burns expensive Aether to motor` |
| 66 | `sails and aether engines provide` | `sails and Aether engines provide` |
| 74 (header) | `### Aether Engines` | `### Aether engines` *(sentence-case the second word; Aether already capital)* |
| 77 | `harvest raw aether and fix it` | `harvest raw Aether and fix it` |
| 79 | `mechanism involves lanthornium, an uncommon` | `mechanism involves Lanthornium, an uncommon` |
| 79 | `When purified lanthornium vibrates` | `When purified Lanthornium vibrates` |
| 79 | `contacts processed aether, the aether rapidly expands` | `contacts processed Aether, the Aether rapidly expands` |
| 81 | `But burning aether to motor between currents` | `But burning Aether to motor between currents` |
| 81 | `pirates who burn aether to catch prey` | `pirates who burn Aether to catch prey` |
| 84 | `The extraction of aether from the atmosphere` | `The extraction of Aether from the atmosphere` |
| 84 | `eruption deposited aether across Alaria` | `eruption deposited Aether across Alaria` |
| 84 | `They pull raw aether from the air` | `They pull raw Aether from the air` |
| 98 | `requires burning aether to motor downward` | `requires burning Aether to motor downward` |
| 125 | `Escape requires burning aether to motor off-current` | `Escape requires burning Aether to motor off-current` |
| 138 | `requires burning aether to motor against the flow` | `requires burning Aether to motor against the flow` |
| 140 | `the aether cost of reaching them` | `the Aether cost of reaching them` |
| 151 | `The aether engine (lanthornium, complex mechanisms` | `The Aether engine (Lanthornium, complex mechanisms` |
| 151 | `Ongoing aether costs depend on route` | `Ongoing Aether costs depend on route` |
| 167 | `requires burning aether for the entire journey` | `requires burning Aether for the entire journey` |
| 174 | `aether engine maintenance` | `Aether engine maintenance` |
| 183 | `with minimal aether expenditure` | `with minimal Aether expenditure` |

*(Keep `#### Aether-tappers` header and all `Aether-tapper`/`aether-tapper` compounds as-is.)*

## A.4 Edit list — CORPUS-WIDE EXTENSION (required for full consistency; orchestrator may scope/defer)

A casing rule applied to 3 files while 11 others stay lowercase just entrenches the split. These carry the **same fuel referent** and need the same treatment.

### Entity files
| File | Line | Current substring | Replace with |
|---|---|---|---|
| `crystal-caverns.md` | 53 | `conventional aether engines fail` | `conventional Aether engines fail` |
| `jaipon.md` | 72 | `(via aether communication devices)` | `(via Aether communication devices)` |
| `kobuk.md` | 50 | `aether drawn from the air and fixed` | `Aether drawn from the air and fixed` |
| `last-chance.md` | 14 | `without enough aether to break free` | `without enough Aether to break free` |
| `magic-sky-stone.md` | 19 | `Sails and aether engines only move` | `Sails and Aether engines only move` |
| `magic-sky-stone.md` | 25 | `the aether the engines burn and the lanthornium that fires it` | `the Aether the engines burn and the Lanthornium that fires it` |
| `plane-the-cosmos.md` | 22 | `rained aether and lanthornium down onto Alaria` | `rained Aether and Lanthornium down onto Alaria` |
| `race-goblin-aciabro.md` | 16 | `grafts run on aether drawn from the air` | `grafts run on Aether drawn from the air` |
| `race-goblin-coghead.md` | 17 | `a working fed on the aether that hangs in the air` | `a working fed on the Aether that hangs in the air` |
| `yuki.md` | 21 | `Their aether powers the alarm systems` | `Their Aether powers the alarm systems` |
| `yuki.md` | 39 | `produce a steady supply of goblin aether` | `produce a steady supply of goblin Aether` |

*(In `kobuk.md` keep `aether-fed` (24,28) and `aether-work` (70) lowercase. In `yuki.md` keep `aether-tapper(s)`, `aether-producing`, `aether-powered` lowercase. In `race-goblin-coghead.md` keep `aether-fed` (7,17) lowercase. In `magic-air.md` keep `aether-engines` — already hyphenated — lowercase; no edit.)*

### Systems docs
| File | Line | Current substring | Replace with |
|---|---|---|---|
| `docs/worldbuilding/systems/technology.md` | 5 | `accreted aether engines, gunpowder` | `accreted Aether engines, gunpowder` |
| `technology.md` | 15 | `the foreign aether the goblins burn for sky-fuel` | `the foreign Aether the goblins burn for sky-fuel` |
| `technology.md` | 17 | `The foreign aether sky-trade is the standout exception` | `The foreign Aether sky-trade is the standout exception` |
| `technology.md` | 23 | `the struck lanthornium drives pistons` | `the struck Lanthornium drives pistons` |
| `technology.md` | 31 | `fed on aether and blood` | `fed on Aether and blood` |
| `docs/worldbuilding/systems/economy.md` | 45 | `lifted by sky-stone and steered by aether engines` | `lifted by sky-stone and steered by Aether engines` |

> **technology.md DO-NOT-TOUCH on the same lines:** `aetherium` and `aetherial magic` (line 15, and line 23's `Aether sky-industry`/`Aether is`/`An aether engine` which are already sentence-initial caps). Keep `aether-tappers` (23) lowercase. Line 23 mid-sentence already starts sentences with capital A; only the `struck lanthornium→Lanthornium` and `aether engine` open-compound need care — `An aether engine` at sentence start is fine as "An Aether engine"? It is already capital "An", and "aether" is mid-phrase → should be "An Aether engine"; include if you want full consistency.

*(`economy.md:35` also needs a casing touch on its de-conflation edit — handled jointly in Issue B so the file is edited once.)*

## A.5 LEAVE AS-IS — different referent (do NOT capitalize)
- `era-lost-ages.md:20,24,38` (+author-notes 59,61) — `aetherial` = lost-Kethic height. Correct lowercase.
- `technology.md:15` — `aetherium` / `aetherial magic` = lost-Kethic. Correct lowercase.
- All hyphenated `aether-*` compounds listed above — correct lowercase by the rule.

## A.6 Already COMPLIANT (no casing edit)
- `magic-aether.md` — capitalizes Aether/Lanthornium; only `aether-tappers` (compound) lowercase. ✓
- `plane-lanthornia.md` — body capitalizes; only `aether-tapper(s)` compound lowercase. ✓
- `overview-magic.md` — "Aether" capitalized; `aether-tappers` compound lowercase. ✓
- `race-goblin.md` — `aether-fed` (32,65,68) correct; `Aether-lens`/`Aether-thrust` (67,68) are bold list-label initials (acceptable; optional to lowercase for strictness). ✓

## A.7 Disjointness / parallelization (Issue A)
Every file above is a **separate file** → all edits are mutually disjoint and can be applied **in parallel**, with one exception: **`economy.md` is touched by both A and B** — give it to a single worker who applies both its casing (line 45) and de-conflation (line 35) edits together.

---

# B. DE-CONFLATION (aether-tapper vs Etherweaver)

## B.0 The two groups

| Group | Substance | Canonical entity | Canonical name |
|---|---|---|---|
| **(1) Fuel goblins** — extract/fix off-world Aether into sky-fuel | off-world Lanthornian **Aether** | `race-goblin-aether-tapper.md` | **`aether-tapper`** |
| **(2) Kethic heritage** — born attuned to non-basic elements (light/dark/force/time/void), enchant metal | native **Kethic** magic | `race-goblin-etherweaver.md` | **`Etherweaver`** |

These are **opposite substances** (off-world fuel vs native Kethic magic) with near-homograph names. `race-goblin-aether-tapper.md:22` already states the canonical disambiguation: *"The aether-tappers should not be confused with the Etherweavers, the goblin line born to the non-basic Kethic elements… An Etherweaver weaves a power native to Alaria; an aether-tapper fixes a fuel that fell from another world."*

**Good news:** the conflation flagged in prior finding #4 EXTENSION has **mostly already been repaired** — `yuki.md` and the three magic files (`magic-aether`, `plane-astral-currents`, `overview-magic`) now correctly use `aether-tapper`. **Only 2 genuine conflations remain.**

## B.1 Per-file classification (every file in the grep set)

| File:line | Quote | MEANS | Verdict |
|---|---|---|---|
| `race-goblin.md:31` | "**Etherweaver** — …attunement to non-basic elements…" | Kethic-Etherweaver | ✅ correct (heritage list; NOT aether-producing — confirmed) |
| `race-goblin.md:53` | "### Etherweaver — Etherweaver" (mechanics) | Kethic-Etherweaver | ✅ correct |
| `race-goblin-etherweaver.md` (whole) | "mastery over the non-basic elements: light, dark, force, time, void" | Kethic-Etherweaver | ✅ correct (canonical entity; no aether-production) |
| `race-goblin-aether-tapper.md:12,16,20,22` | "Aether-tappers are the aether-producing goblin variant…" | fuel-tapper | ✅ correct (canonical entity + explicit de-conflation at :22) |
| `yuki.md:13,17,19,21,23,39` | "aether-tappers—the aether-producing goblin variant" | fuel-tapper | ✅ correct (ALREADY de-conflated — was "etherweavers" in the old version) |
| `morgnor-s-cradle.md:5,14,21,33,35` | "The goblins here are Etherweavers—born with attunements to time, void, force, light, or dark… enchant the metals" | Kethic-Etherweaver | ✅ correct |
| `hills-of-red-gold.md:19` | "Etherweaver goblins work the mines… for the dragon's hoard" | Kethic-Etherweaver (Morgnor's enchanters) | ✅ correct |
| `creature-morgnor-dragon.md:13` | "a kingdom of etherweaver goblins… metals mined from earth and enchanted" | Kethic-Etherweaver | ✅ correct group — **casing only** (lowercase heritage name; see B.3) |
| `daemon-shak-shak.md:18` | "…Scalawag, Aciabro, Blitzling, **Etherweaver**, Spine, and Wydling goblin lineages…" | Kethic-Etherweaver | ✅ correct |
| `onomastics-goblin.md:4,15` | "Etherweaver" listed among English-descriptive goblin names | Kethic-Etherweaver | ✅ correct |
| `magic-lanthornium.md:26` | "the aether-tapper extraction…" (author-notes) | fuel-tapper | ✅ correct (stripped at build) |
| `technology.md:23` | "Only the aether-tappers can draw it from the air" | fuel-tapper | ✅ correct |
| `plane-astral-currents.md:77,83,84,86` | "the aether-tappers, who harvest raw aether" | fuel-tapper | ✅ correct |
| `plane-lanthornia.md:19,22` | "the goblin aether-tappers" | fuel-tapper | ✅ correct |
| `magic-aether.md:17` | "the aether-tappers" | fuel-tapper | ✅ correct |
| `overview-magic.md:34` | "a working only the aether-tappers can perform" | fuel-tapper | ✅ correct |
| **`garlow.md:34`** | "Joint operations with **Yuki's etherweavers**, processing raw goblin aether" | fuel-tapper (Yuki's goblins are aether-tappers, per `yuki.md`) | ❌ **CONFLATION** — fuel-goblins mislabeled "etherweavers" |
| **`economy.md:35`** | "only the **aether weaver goblins** can extract and process it" | fuel-tapper | ❌ **CONFLATION** — uses the colliding "aether weaver" homograph for the fuel-extractors |

## B.2 Edit list — the 2 genuine conflations

### `content/codex/entities/garlow.md`
| Line | Current | Replace with |
|---|---|---|
| 34 | `Joint operations with Yuki's etherweavers, processing raw goblin aether into usable forms.` | `Joint operations with Yuki's aether-tappers, processing raw goblin Aether into usable forms.` |

*(Two changes on one line: de-conflation `etherweavers→aether-tappers` **and** the A-rule casing `goblin aether→goblin Aether`. `**The Aether Refineries**` label is already correct.)*

### `docs/worldbuilding/systems/economy.md`
| Line | Current | Replace with |
|---|---|---|
| 35 | `only the aether weaver goblins can extract and process it` | `only the aether-tapper goblins can extract and process it` |
| 45 | `lifted by sky-stone and steered by aether engines` | `lifted by sky-stone and steered by Aether engines` |

*(Line 35 = de-conflation; line 45 = A-rule casing. One worker, both edits.)*

## B.3 OPTIONAL — heritage-name capitalization (NOT a conflation; correct group, just lowercase)

`Etherweaver` is a proper heritage name capitalized everywhere it matters (`race-goblin.md`, `morgnor-s-cradle.md`, `daemon-shak-shak.md`). Two files lowercase it mid-sentence — correct meaning, inconsistent case. Low priority.

| File | Line(s) | Current | Replace with |
|---|---|---|---|
| `creature-morgnor-dragon.md` | 13 | `a kingdom of etherweaver goblins` | `a kingdom of Etherweaver goblins` |
| `race-goblin-etherweaver.md` | 16, 18, 20 | mid-sentence `etherweaver(s)` | `Etherweaver(s)` |

## B.4 Confirmations & observations
- **CONFIRMED:** `race-goblin.md` keeps **Etherweaver as the Kethic heritage** ("attunement to non-basic elements") and does **NOT** describe it as aether-producing. ✓
- **Observation (out of scope):** the fuel-goblin `aether-tapper` is **absent** from `race-goblin.md`'s heritage list, from `daemon-shak-shak.md:18`'s lineage list, and from `onomastics-goblin.md`'s source pool. These are likely real coverage gaps (the heritage list predates the aether-tapper entity), but adding it is a separate authoring task, not a de-conflation fix.

## B.5 Disjointness / parallelization (Issue B)
- `garlow.md` — Issue-B only, disjoint → parallel.
- `economy.md` — **shared with Issue A** (line 45 casing + line 35 de-conflation) → one worker.
- Optional `creature-morgnor-dragon.md`, `race-goblin-etherweaver.md` — disjoint → parallel.

---

# Application map (who can run in parallel)

- **Lane 1 (A primary):** `magic-lanthornium.md`, `plane-astral-currents.md`, `race-goblin-aether-tapper.md` — disjoint, parallel.
- **Lane 2 (A extension entities):** `crystal-caverns.md`, `jaipon.md`, `kobuk.md`, `last-chance.md`, `magic-sky-stone.md`, `plane-the-cosmos.md`, `race-goblin-aciabro.md`, `race-goblin-coghead.md`, `yuki.md` — disjoint, parallel.
- **Lane 3 (docs + B):** `technology.md` (A only), `economy.md` (A line 45 + B line 35), `garlow.md` (B). `economy.md` must be one worker for both its edits.
- **Lane 4 (optional heritage case):** `creature-morgnor-dragon.md`, `race-goblin-etherweaver.md`.

**No two lanes share a file**, so all four run concurrently.
