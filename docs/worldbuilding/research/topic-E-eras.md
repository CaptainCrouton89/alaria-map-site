# Era-as-entity timeline design

Decisional research for Foundations item #4 — whether to break the monolithic World Timeline into discrete `era` entities, and if so, at what granularity, with what schema, and under what edge vocabulary. The question behind every section: does an era as an addressable graph node earn its overhead, or does it duplicate work that a chapter-form chronology already does cheaper?

## Precedents

### Glorantha (Stafford, Petersen, Chaosium / Moon Design)

Gloranthan time has two regimes. God Time (Green Age, Golden Age, Storm Age, Greater Darkness, Grey/Silver Age) is non-sequential by design; the *Cults of Prax* chronology (Chaosium, 1979) opens with "This is a period of mystical simultaneity. No rigid sequence can be assigned to the period." ([Well of Daliath / cop-chronology](https://wellofdaliath.chaosium.com/home/catalogue/publishers/chaosium/chaosium-runequest-12/cults-of-prax/cop-chronology/), accessed 2026-05-28). Historical Time begins at the Dawn (year 0 ST) after Arachne Solara's Great Compromise, the cosmological act that creates linear time as the gods' oath ([Web of Arachne Solara, Well of Daliath](https://wellofdaliath.chaosium.com/the-web-of-arachne-solara/)). Within Historical Time the canonical ages are First Age (1–500 ST), Second Age (500–1120 ST, ending in the Closing / Sundering / Dragonkill cascade), Third Age (1120 ST–present, ~1622 ST).

Three details matter for Alaria. The God Time / Time transition is ontological, not chronological — Greg Stafford's "Notes on the Structure of Glorantha" (Well of Daliath) states "the Myths are not objective reality... mutable and no individual can know all variations of even one Myth." Mythic ages are accessed by heroquest, not by walking a timeline. The Monomyth that orders God Time eras is a God Learner scholarly construct, retrospectively imposed to reconcile competing cultural mythologies. Different cultures count different ages: Lunar Wane cycles (1220 ST anchor, 54-year periods), Dara Happan Yelmic Solar (Yelm's Enthronement = year 0, current year 112,621 YS, extending back through God Time on Dara Happan terms), Brithini BT (14,825 years before Dawn = year 0), Pamaltelan four-season Holy Week ([Glorantha calendar tumblr digest](https://glorantha.tumblr.com/post/116275640208/), accessed 2026-05-28). The same span of Historical Time gets named differently by different cultures, and the God Time gets carved into entirely different ages depending on whose Monomyth is doing the carving. *King of Sartar* (Stafford, 1992) takes the implication to its limit — it is a future compilation "collated after a period in which knowledge of literacy was lost," and the narrator is a fictional in-world scholar arguing with rival scribes about which Argrath is real.

### Tolkien (Allen & Unwin / HarperCollins / HoME)

Six named ages: Years of the Lamps, Years of the Trees, First Age (590 YS), Second Age (3,441 YS), Third Age (3,021 YS), Fourth Age (no fixed end). Each ends with a catastrophe that reshapes the world: Lamps overthrown by Melkor; Two Trees destroyed by Ungoliant; Beleriand drowned in the War of Wrath; Númenor sunk and the world made round (SA 3319); One Ring destroyed and the Elves depart (TA 3019–3021). The pattern is consistent across every transition (*Silmarillion*, ed. C. Tolkien, 1977; *LotR* Appendix B, 1955).

Two structural choices matter. Pre-numbered time uses a different reckoning entirely: Valian Years (≈9.58 or ≈144 solar years depending on which Tolkien draft), no annal structure, Ainur and Valar as actors. Numbered ages use Years of the Sun, mortal-race actors, year-by-year annals. *Quenta Silmarillion* is 24 narrative chapters; *Ainulindalë* and *Valaquenta* are creation-myth and divine-catalogue with no temporal markers. The Annals of Aman (HoME vol. 10) impose retrospective annal structure on mythic time as an in-world scholarly reconstruction attributed to Rúmil — exactly the Monomyth pattern. Each post-First-Age era then has its own in-world chronicle: *Akallabêth* (Second Age, attributed in drafts to Pengolodh) and "Of the Rings of Power and the Third Age" (originally drafted for the LotR appendices). One document, one era, bounded by the era's opening and closing events. The era is the chronicle's total scope.

Appendix B has a telling granularity profile: First Age absent in annal form (only narrative), Second Age in under three pages with conjectural century-scale entries, Third Age year-by-year mostly empty, TA 3018–3019 day-by-day. Granularity scales to dramatic load, not to chronological span.

### Forgotten Realms (Wizards of the Coast)

Seven top-level eras in *The Grand History of the Realms* (James, Greenwood, Krashos, Boyd, Costa; WotC, 2007): Days of Thunder, Dawn Ages, First Flowering, Crown Wars, Founding Time, Age of Humanity, Present Age. The book is a year-keyed chronicle (entries like "−7975 DR") under era chapter-headers, with bracketed cross-reference pointers between related entries ([anyflip preview](https://anyflip.com/npkza/zqba/basic), accessed 2026-05-28; [Wertzone review, 2008](https://thewertzone.blogspot.com/2008/06/grand-history-of-realms-by-brian-r.html), accessed 2026-05-28).

The post-1358 DR boundaries align one-to-one with edition launches. Time of Troubles (1358 DR / 2e, 1989) — the assassin class was discontinued in 2e and the assassin guilds were canonically destroyed in-world; spell rule changes "reflected changes in the game rules" ([Forgotten Realms, Wikipedia](https://en.wikipedia.org/wiki/Forgotten_Realms), accessed 2026-05-28). Spellplague (1385 DR / 4e, 2008) — advanced the calendar 100 years and merged Toril with its twin Abeir, destroying continents and the Great Wheel cosmology because "Faerûn just flat-out doesn't fit" 4e's Points of Light design ([Gnome Stew review, 2008](https://gnomestew.com/4th-edition-forgotten-realms-campaign-guide-review-big-changes-good-book-crappy-map/), accessed 2026-05-28). Second Sundering (1487 DR / 5e, 2014) — reversed the Spellplague: Abeir and Toril re-separated, Mystra restored, geography unmoved, "Markings that marked spell-plagued people and animals will fade and go away" (Liz Schuh, quoted via [Wikipedia, The Sundering](https://en.wikipedia.org/wiki/The_Sundering), accessed 2026-05-28).

R.A. Salvatore on the 4e changes, [PC Gamer interview, October 2025](https://www.pcgamer.com/games/rpg/prolific-d-and-d-novelist-r-a-salvatore-says-writing-around-4th-edition-rules-almost-broke-him-and-he-knew-its-setting-changes-were-a-mistake-in-about-5-years-theyre-going-to-come-to-us-and-say-bob-we-got-to-fix-this/), accessed 2026-05-28: "we authors were handed a document and told how things were going to be... I said, we're going to figure out how we're going to fix it because in about five years they're going to come to us and say 'Bob we got to fix this.'" The Realms also nominally has eight calendar systems (Dalereckoning, Cormyr Reckoning, Netheril Year, Northreckoning, Shou Year, Damaran, Time of Troubles reckoning, Tethyrian) but only DR carries analytical weight; the rest are flavor.

### Tékumel (Barker, Tékumel Foundation)

Twelve named periods on tekumel.com's official history: pre-Cataclysm Humanspace, the Cataclysm, the Time of Darkness, Empire of Llyán, Three States of the Triangle, Dragon Warriors of N'lüss, Fisherman Kings, First Imperium (Bednálljan), Engsvanyali (éngsvan hlá Gánga, Priestkings), Time of No Kings, Second Imperium of Tsolyánu. The dating system has two anchors: BS (Before the Seal of the Tlakotani) and AS (After the Seal); year 0 AS = the first emperor's first regnal year.

The Engsvanyali → Tsolyani transition is the cleanest era boundary in published fantasy. The mechanism, from [tekumel.com/world_history09](https://www.tekumel.com/world_history09.html), accessed 2026-05-28: "Vast seismic convulsions" tilted Pavár's island; the western capital submerged carrying "the metropolis of the Priestkings and all its glories"; the inland Yán Kór sea rose burying coastal regions; the Sákbe Road network decayed; "the art of writing itself was lost" in some regions; the éngsvan hlá Gánga literary language fragmented into Tsolyani and Mu'ugalavyani. Four discontinuities at once — capital, infrastructure, language, calendar (0 AS resets at the opposite pole of the Time of No Kings). No other Tékumeli boundary stacks like this.

Two Barker patterns matter. Bednálljan as scholarly dustbin (Blue Room Archive vol. 13, [tekumel.com download](https://www.tekumel.com/downloads/blueroomarchive/brvol13.txt), accessed 2026-05-28): "If you don't have accurate dates or archaeological evidence, you just toss it into the Bednálljan Dynasty and hope you're right." An era becomes a named container for ignorance. Regional disagreement on era boundaries (Blue Room vol. 13): "The Tsolyani think the Latter Times ended some time later than do the Livyani." The Latter Times itself is not a discrete era at all — Barker calls it a frame that "ended sooner here and lingered longer there." Different empires keep different official chronologies of the same span.

### Star Wars Legends (Lucasfilm Licensing / Wookieepedia)

The negative precedent for granularity creep. Eight official publishing eras (October 2000 – April 2014): Before the Republic, Old Republic, Rise of the Empire, Rebellion, New Republic, New Jedi Order, Legacy, Infinities ([List of publishing eras, Wookieepedia](https://starwars.fandom.com/wiki/List_of_publishing_eras), accessed 2026-05-28). Three failures.

The "Sith era" was renamed "Old Republic era" to match the KOTOR video-game franchise branding. The era label tracked a product line, not a historiographic distinction. The "Before the Republic era" was added in February 2012 to accommodate a single comic series (*Dawn of the Jedi*) set at one moment within a 12,000-year span — an entire era category minted for one product. The "Infinities era" was not a time period at all; it was a non-canonical "what-if" bin that still received an official era stamp to keep packaging consistent.

The 2014 Legends retirement was not caused by era proliferation — Disney's acquisition and the sequel trilogy were. Leland Chee had already conceded in 2009 that "it's much safer from a continuity standpoint to have the EU stories stand on their own" — the era system could not enforce cross-product coherence at the corpus scale (~1,300 comics, 350 books, 150 games). Era labels collapsed into product-line brands.

### D&D editions-as-eras (4e Points of Light → 5e Sundering)

The 4e *Dungeon Master's Guide* (WotC, 2008) baked "Points of Light" into the implied world: "civilized people now live in small, isolated settlements scattered across a dark and dangerous world." This functioned as an era assumption — the world is post-collapse, by design. The Forgotten Realms had to be catastrophically degraded to fit; the Spellplague was that degradation. The 5e *Sword Coast Adventurer's Guide* (WotC, 2015) documents the Sundering as in-world fiction; Salvatore named it as a corrective ("they're going to come to us and say 'Bob we got to fix this'"). Cosmology, geography, divine pantheon, and magic rules all reverted. The era was real in publishing terms and is now a wound the canon has spent a decade dressing.

### The infodump failure mode in published settings

The infodump failure has named precedents at three different scales. *The Silmarillion* (Tolkien, 1977) is the canonical literary case — Christopher Tolkien's Foreword admits the manuscript required editorial intervention to produce "the most coherent and internally self-consistent narrative" and that earlier compilation attempts had failed. Reviewers from the 1977 publication onward have flagged the book as forbidding to readers unfamiliar with the legendarium; sales depended on LotR's prior readership. The failure mode is prose-monolith — undifferentiated narrative pressure with no per-era authorial voice to break it.

*The Grand History of the Realms* (WotC, 2007) is the opposite failure: distributed infodump under era headers. The Wertzone review (2008) flags the book as having "no index" and "no source attribution for dates" — a 160-page year-keyed chronicle that reads as reference rather than play material. The era-headers are present, but each era's content is uniform year-keyed entries; no scholar owns any era's voice. The result is a book GMs cite at the table but few read through. The era division did not prevent the infodump; it only chunked it.

Tékumel is the cautionary case for a 20-year project. Barker's deep history is famously inaccessible — the Tékumel community has produced multiple "introductions to Tékumel" precisely because new readers bounce off the prose. The Blue Room Archive (Barker's working notes) shows the depth that never made it into rulebook form; *Swords & Glory* vol. 1 (Gamescience, 1983) is widely treated as definitive and unreadable simultaneously. The setting's reach has been a fraction of D&D's despite higher craft, and the era structure is implicated — twelve named eras with no priority scaffolding gives a reader no path in.

The pattern that breaks the infodump is the chronicle-per-era pattern from Glorantha and Tolkien. *King of Sartar* divides material across competing scholars; *Akallabêth* is one era owned by one scholar. The era becomes an addressable, in-character document, not a slab of the master timeline. Readers do not have to absorb the whole; they can read one era's chronicle and stop.

## Techniques that work

### Two-regime structural distinction between mythic and historical time

The single most transferable technique from the precedents. Glorantha's God Time / Time split, marked by the Great Compromise (Web of Arachne Solara, Well of Daliath), and Tolkien's Years of the Trees / First Age split, marked by the first sunrise after the Two Trees' destruction (*Silmarillion*, "Of the Sun and Moon"), are the same move. Mythic-era nodes are simultaneous, accessed through ritual or vision, described in chapter-form myth or in cosmological poem; historical-era nodes are sequential, dated in named-calendar integers, described in annal-form chronicle. Tékumel's pre-Cataclysm Humanspace era is the same shape — no in-world records survive, the period is reconstructed externally, and Barker's narrator handles it from outside the in-world frame ([tekumel.com/world_history01](https://www.tekumel.com/world_history01.html)).

The implication for graph schema: mythic eras carry a different edge profile from historical eras. They do not stack along a `precededBy` chain in the same sense. They connect through one structural transition edge to the historical regime, not through ordinary sequence.

### Catastrophe-bounded eras

Tolkien's pattern across five transitions (Lamps fall, Trees destroyed, Beleriand drowned, Númenor sunk, One Ring destroyed) and Tékumel's Engsvanyali → Tsolyani break (seismic capital loss + language fragmentation + infrastructure collapse + calendar reset) both work because the boundary event leaves visible scars in the present-day world. Beleriand's drowning explains why Middle-earth's geography contains no First Age toponyms. The éngsvan hlá Gánga loss explains why Tsolyani is a fragmentary literary language. The reader can retrodict the boundary from present-day artifacts.

Each catastrophe should leave at least one of: a geographic scar, a linguistic fracture, a destroyed institution, a lost knowledge base. An era whose end leaves none of those is a bookkeeping convenience, not a real boundary.

### Era as discrete in-world document

Tolkien's *Akallabêth* is a single chronicle covering one era, bounded by that era's opening and closing events, attributed to one in-world scholar (Pengolodh in drafts). "Of the Rings of Power" is the same shape. *King of Sartar* (Stafford, 1992) generalizes the technique — the whole book is a future scholar's compilation of fragmentary in-world documents, deliberately self-contradicting. This makes each era an addressable, citable thing the way a chapter title is addressable. It also localizes contradiction: two sources within one era disagree, and the disagreement is recorded rather than reconciled. As shown in the Forgotten Realms case under "infodump failure mode" above, era-header chunking without per-era authorial voice does not prevent the infodump — it only redistributes it. The chronicle-per-era pattern is the technique that works.

For Alaria, the technique pairs with the scholar frame already locked in `.claude/rules/scholar-voices.md`. Pembling owns the Seventh Dawn; Temavori owns the Golden Age. Era-as-document says each major scholar owns one chronicle, and that chronicle is the era's authored shape.

### Granularity scales to dramatic load, not chronological span

Tolkien's Appendix B compresses the Second Age (3,441 YS) into under three pages and expands TA 3018–3019 to day-by-day. *The Grand History of the Realms* spends 60 pages on 32,000 years of ancient eras and ~100 pages on the 4,358-year Age of Humanity. Glorantha's Third Age has more named sub-periods than the entire God Time combined. Pages and entities are not budgeted proportional to years. They are budgeted proportional to how much the present-day world points back at that period.

### Multi-calendar reckoning, with one operational anchor

Forgotten Realms shows the failure case (eight calendars, only DR carries weight); Glorantha shows the success case (Solar Time ST as the cross-cultural anchor, with Lunar Wane / Dara Happan YS / Brithini BT as in-world cultural readings that all convert to ST). The pattern: choose one canonical clock, let every culture's reckoning be a function of that clock, never let the alternate calendars be required to track an event. Alternate calendars are flavor with conversion rules, not parallel canons.

## Failure modes

### Era granularity creep (Star Wars Legends)

When era labels track product lines rather than in-world divisions, the labels stop encoding periodization and start encoding franchise identity. The Star Wars "Before the Republic" era covers 12,000 in-universe years for one comic series. The "Infinities era" is a what-if bin. The "Sith era" was renamed for KOTOR. The threshold for adding a new era should be a structural in-world event, not a publishing slot. A linter rule applies: no era added without a named boundary catastrophe documented in at least one entity file.

### Publishing-cycle eras that exceed in-world coherence load (Forgotten Realms Spellplague)

The Spellplague required Faerûn to absorb simultaneous changes to continental geography (Maztica vanished, Tymanther and Akanûl appeared), divine pantheon (gods died, returned, swapped portfolios), cosmology (Great Wheel replaced wholesale), and magic rules (Weave damaged). Coherence broke; 5e spent the Sundering rolling it back. The mechanism failure: any single era boundary that has to justify a catastrophe-pattern plus a mechanical retcon plus a 100-year time skip overloads the lore. Salvatore's "almost broke me" is the author's record of the threshold being crossed.

For a 20-year project with 10k entities, the equivalent risk is an era added to make a tooling decision tractable ("let's slice the timeline here so the date-sanity linter is easier to write"). Eras must be retrodicted from present-day facts, not imposed to ease engineering.

### Era as scholarly dustbin (Tékumel Bednálljan)

Barker's admission: "If you don't have accurate dates or archaeological evidence, you just toss it into the Bednálljan Dynasty and hope you're right." Useful as a confession of method, dangerous as a default. When an era exists primarily as the place undatable material goes, the era's identity becomes structurally negative — it is what is not the other eras. Alaria's "Lost Ages" already sits at this risk profile (30,000–10,209 BSD, named by absence). Permit it under one condition: the era explicitly tags its character as a gap, with one or two anchor events that hold the gap in place. A `gap: true` frontmatter flag is honest; an era that pretends to be a real period when it is an ignorance container is not.

### Monomyth imposition on mythic time (Glorantha God Time, framed as a feature)

The Gloranthan Monomyth — Green Age, Golden Age, Storm Age, Greater Darkness — is a God Learner construct that pretends to chronologize a non-chronological regime. Stafford treats this as a feature: the imposition itself is what God Learner scholarship *is*, and rival cultures (Praxian, Pamaltelan, Vithelan) reject it. For Alaria, the corresponding risk is treating the pre-Time-of-Man eras (Age of Titans, Reign of Dragons, Walk of Elves) as a clean sequence when at least some are mythic-regime nodes that resist linear order. The fix is the two-regime distinction in the schema, not better dates.

### Era-boundary drift through retroactive sub-era nesting (Forgotten Realms sub-eras)

*Grand History of the Realms* names sub-eras informally within entries (Nemrut, Early Dynastic, Silent Death within Imaskar; Golden Age of Netheril; Era of Upheaval straddling Present Age). The Fandom wiki then nests further. There is no canonical rule for what counts as an era versus a sub-era. Granularity becomes editorial fiat. A linter rule applies: an era is an entity with `entityType: era` and a defined `start` / `end` date; anything finer is a tagged date-range or a named event cluster, not a sibling era.

### Editions-as-eras (D&D 4e → 5e)

The most explicit case of publishing cadence visible through in-world canon. An era boundary should never be a hidden marker for a tooling-version or canon-version reset. If Alaria's underlying schema changes (new edge kinds, new entity types, new linter rules), that is not an era boundary; it is a schema migration. Conflating the two is the failure that broke 4e Forgotten Realms.

## Recommendations for Alaria

### Carve seven era entities from the monolithic timeline, with one explicit mythic / historical split

The dated milestones locked in `world-systems-invariants.md` Hard-rule table row "Deep time / stasis" give a clean carve. The recommendation:

| Era id | Name | Dates | Regime | Boundary catastrophe |
|---|---|---|---|---|
| `era-age-of-titans` | Age of Titans | 23.5–12 Mya | mythic | Ezz Rift (12 Mya) — Melera's escaped music; titans driven to madness |
| `era-reign-of-dragons` | Reign of Dragons | 10–2.5 Mya | mythic-to-historical transition | Walk of Elves (2.5 Mya); Aurus / Nydus diffusion in progress |
| `era-walk-of-elves` | Walk of Elves | 2.5 Mya – 600,000 ya | historical | Eyachria vs Gaea (600,000 ya) |
| `era-birth-of-man` | Birth of Man and Long Twilight | 500,000 ya – Golden Age dawn | historical | Golden Age begins (authorial date — see Gaps) |
| `era-golden-age` | Golden Age of Man | Golden Age – God War | historical | God War — Long Winter onset |
| `era-craggus-and-lost-ages` | Age of Craggus through Lost Ages | post-God-War – 10,209 BSD | historical (gap-shadowed) | Hykravones the Shattering (10,210 BSD) |
| `era-seventh-dawn` | Seventh Dawn (already exists) | 0 SD – present (3,376 SD) | historical | n/a — current |

Notes on the carve:

The Age of Titans and Reign of Dragons sit in mythic regime. They predate the diffusion of Aurus / Nydus (per the Celest-origin row in `world-systems-invariants.md`) and the Ezz Rift conditions for linear historical time. Mark them with `regime: mythic` and accept that their internal sequence is partial. This is the Glorantha God Time pattern.

The Walk of Elves through Birth of Man span is one continuous historical regime under the same cosmological conditions; collapsing them into one era loses the Eyachria–Gaea conflict as a boundary. Keep both.

The Golden Age and God War are not the same era. Tolkien's pattern — each catastrophe ends an era, the survivors begin the next — applies here. The Long Winter / Age of Craggus / Lost Ages compress into one container because they are the gap the present-day world points back at (most stubs that gesture upward gesture into this period). Mark this container `gap: true` per the Tékumel-Bednálljan rule and let it remain coarse; deepening it later is permissible if specific events demand it.

The Seventh Dawn era already exists. The World Fire (10 BSD) and Hykravones (10,210 BSD) currently appear as eras 9 and 11 in the World Timeline — they should be events occurring at era boundaries, not eras themselves. They are catastrophe-markers, the structural verbs between era nouns. Demote them. The demotion is a multi-step data fix: see the data-fix sequencing note under "Linter rules" below.

This is seven eras. The current monolithic timeline lists thirteen. The carve drops six by reclassifying boundary catastrophes (Hykravones, World Fire) as events, and by merging the Long Twilight slice into adjacent eras.

### Era entity frontmatter schema

The existing `era-seventh-dawn.md` baseline has:

```yaml
id: "era-seventh-dawn"
name: "The Seventh Dawn"
entityType: era
blurb: "0 SD–Now. The current age of Alaria..."
tags: ["history", "era"]
weight: major
atmosphere: civilization
relations:
  - { rel: history, kind: precededBy, target: "era-world-fire" }
sources: [...]
review: { aiWritten: false, action: keep }
```

The proposed schema adds four fields on top of this baseline — none replace existing fields:

```yaml
# new fields, additive to the existing baseline
regime: mythic | historical | transitional   # the two-regime split
startDate: { value: -23500000, unit: ya }    # ya / BSD / SD
endDate:   { value: -12000000, unit: ya }    # null for the current era
boundaryEvent:                                # the catastrophe at each pole
  start: "event-..."  # id of the event that opens this era (null for first era)
  end:   "event-..."  # id of the event that closes this era (null for current era)
gap: true | false                             # true = ignorance-container era
```

`regime` is the load-bearing field. It allows the linter to enforce that `precededBy` chains do not require mythic eras to carry strict integer-year ordering, and it allows scholar attribution to differ by regime (Velorin's cosmological mode for mythic eras; Pembling's annal mode for historical).

`boundaryEvent.start` / `boundaryEvent.end` point at `event` entities. The catastrophe is itself an entity (an event, not an era), and the era references it. This pairs with the era-count carve above: catastrophes are events, not eras.

`gap: true` is honest about ignorance-containers (Lost Ages). The linter can warn if a `gap: true` era has more than a small number of anchored events — the gap is supposed to stay thin.

`startDate` / `endDate` use a structured `{ value, unit }` shape because Alaria mixes Mya / ya / BSD / SD units across deep time. A single integer field forces a unit choice the deep-prehistory dates cannot live with. The linter converts to a canonical year-zero for ordering.

The scholar-attribution field (which scholar owns the era's canonical chronicle) lives in the era's prose body, attributed via the existing `> — ` blockquote convention. Do not invent a new frontmatter field for this — the convention in `.claude/rules/scholar-attribution.md` is already greppable.

### Edge vocabulary — propose two additions, with caveats

The current `entity-relations.md` `history` family has four kinds: `participatedIn`, `occurredDuring`, `caused`, `precededBy`. The Foundations stage proposes `occurredDuring` (event → era). Three observations:

`precededBy` already exists in the `history` family and is in use on `era-seventh-dawn.md`. It works for era → era ordering. Do not add `eraPrecededBy` — it duplicates an existing kind. The existing `era-seventh-dawn` edge currently points at an era that the carve recommendation reclassifies as an event; that is a data fix, sequenced below.

`occurredDuring` (event → era) is sufficient for the common case. Propose adding the inverse `boundsEra` as an era → event edge for the catastrophe that opens or closes an era. The asymmetry: most events occur *during* an era (`occurredDuring`); a small number of events *bound* eras (Ezz Rift, the God War, Hykravones). Naming the boundary explicitly makes the catastrophe-pattern visible in the graph and lets the linter check that every non-current era has exactly one bounding end-event and (for eras after the first) one bounding start-event. This is the Tolkien catastrophe-boundary pattern as a graph invariant.

Propose adding `eraConcurrentWith` for the case where two eras describe the same span from different cultural frames. The precedent is not the Glorantha calendar-reckoning systems (those are alternate dating overlays on a single sequential timeline, not separate eras). The precedent is the Glorantha Monomyth itself: Dara Happan Yelmic Solar counting back through Yelm's reign treats the Golden Age as one era; Theyalan Heortling counting treats the same span under different Lightbringer-centric ages; the two carvings overlap. Alaria does not currently need this edge — the seven-era carve above is a single sequence under one canonical reckoning. The recommendation is to permit it in the vocabulary but not author any instances in the Foundations stage. Once cultural sub-chronicles begin appearing (a Drachman Golden Age vs. an elven view of the same period), the edge is available.

Reject `eraSpanning` as a kind. An event that spans multiple eras (a 200-year war crossing an era boundary) is better expressed as two `occurredDuring` edges or as a parent event entity with two `occurredDuring` children. The Glorantha pattern is to anchor the event by its start year and let the era boundary fall inside its duration — this works without a new edge.

Summary of proposed additions to `.claude/rules/entity-relations.md` `history` family — surface for approval before adding:

- `boundsEra` (era → event) — the catastrophe event that opens or closes the era
- `eraConcurrentWith` (era → era) — two eras over the same span from different cultural frames; permitted in vocabulary, no instances in Foundations stage

### Linter rules to defend against era-boundary drift, with sequenced rollout

Six new checks for the Foundation #5 canon-lint tooling. The rules and their rollout order matter — activating them before the data fixes below would error on the very entities the carve is fixing.

1. `era-boundary-event-required` (error): every era with `regime: historical` and `endDate != null` must have `boundaryEvent.end` pointing at a real `event` entity.
2. `era-precededBy-chain-complete` (error): every era except the first must have exactly one `precededBy` edge to another era; cycles forbidden; orphan eras forbidden.
3. `era-date-monotonic` (error): if A `precededBy` B, then B's `endDate` ≤ A's `startDate`. Cross-unit conversion handled by the linter.
4. `era-mythic-no-strict-ordering` (warning): two eras with `regime: mythic` may have ambiguous `precededBy` (warn but do not error). Lifts the strict ordering for the God Time pattern.
5. `era-gap-thinness` (warning): an era with `gap: true` should have fewer than 10 `occurredDuring` events. Fires when the Lost Ages gets over-authored.
6. `era-count-ceiling` (warning): if total era count exceeds 12, warn. Twelve is generous (Tékumel's full count); going beyond should require justification. This is the Star Wars granularity-creep tripwire.

Rollout sequence (the data-fix dependency the critic flagged):

a. Author the six new era entities and their `boundaryEvent` `event` entities (the God War, the Hykravones event, the World Fire event, the Ezz Rift event, the Walk of Elves event, the Eyachria–Gaea event). Several do not currently exist — only 5 `event` entities are in the corpus, and the God War is not one of them. These must be created before the linter rules activate.
b. Rewrite `era-seventh-dawn.md` so its `precededBy` edge points at `era-craggus-and-lost-ages` instead of `era-world-fire`. Then delete `era-world-fire` (if it exists as an era entity) and replace with `event-world-fire`.
c. Revise `event-world-timeline.md` body to match the new seven-era carve, or retire it once the era entities subsume its content.
d. Activate the rules in order: rule 2 first (chain-complete), then rule 1 (boundary-event-required), then rule 3 (date-monotonic), then 4–6 (policy warnings).

### Depth-is-referential applies to eras, with a small inversion

Most stubs gesture upward at "a war, a migration, a dead god, a person." Eras are the deep targets those gestures point at. The depth-is-referential thesis predicts that most eras stay thin (one paragraph, one catastrophe-event, one named scholar-owner, a short list of `occurredDuring` events) and the present-day stubs gesture into them densely. This matches Tolkien's Appendix B granularity profile — the Second Age compresses to under three pages because few present-day Third Age stubs gesture into it; the late Third Age expands to day-by-day because the present is dense with references to it.

Three eras should be authored deeper than the others, because the present-day map points back at them densely: the Golden Age (Temavori's domain; the "true dispensation" frame justifies authorial weight), the Age of Craggus / Lost Ages container (Erindath and Oblexan rivalry; most stubs gesture into the gap), and the Seventh Dawn (Pembling; current). The other four — Age of Titans, Reign of Dragons, Walk of Elves, Birth of Man — stay near-stub, each with one named catastrophe-event and a Velorin-attributed cosmological reading. Numbered eras are catalogued, mythic eras are gestured at through chronicle.

### Two co-load-bearing decisions

The two-regime structural split (mythic / historical) is the schema decision that costs the most to undo if made wrong. Mythic eras carry different edge profiles, different ordering invariants, and different authorial register. Glorantha's God Time / Time split is structural, not chronological; Tolkien's Years of the Trees / First Age split is the same shape. Alaria's Age of Titans through Walk of Elves sits across the same line — the Ezz Rift (12 Mya) is the structural transition that creates conditions for linear historical time, but the current monolithic timeline treats every pre-Seventh-Dawn period as a uniformly historical sequence. The `regime` field encodes this distinction at the schema level and lets the linter accept mythic-era ordering ambiguity as a feature rather than flag it as data error.

The era-count carve (seven, not thirteen) is the policy decision that costs the most to undo if made wrong. Every `occurredDuring` edge in the corpus will resolve against the era roster; changing the roster mid-project requires touching every event entity. The Star Wars granularity-creep precedent says the failure compounds: once the count is high, adding more becomes the path of least resistance. Locking at seven, with the `era-count-ceiling` linter warning at 12, is the structural defence.

If only one of these two has to be picked first, pick the regime split — it determines the shape of the era schema before any era is authored, and the era count can be revised within a fixed schema more cheaply than the schema can be revised within a fixed count.

## Sources

- Stafford, Greg. *King of Sartar.* Chaosium, 1992 (eBook 2015). [chaosium.com/king-of-sartar-ebook](https://www.chaosium.com/king-of-sartar-ebook/), accessed 2026-05-28.
- Stafford, Greg and Sandy Petersen. *The Guide to Glorantha.* Moon Design Publications, 2014.
- *Cults of Prax* chronology (Chaosium, 1979), via Well of Daliath. [wellofdaliath.chaosium.com/.../cop-chronology](https://wellofdaliath.chaosium.com/home/catalogue/publishers/chaosium/chaosium-runequest-12/cults-of-prax/cop-chronology/), accessed 2026-05-28.
- "The Ages of Glorantha," Well of Daliath. [wellofdaliath.chaosium.com/the-ages-of-glorantha](https://wellofdaliath.chaosium.com/the-ages-of-glorantha/), accessed 2026-05-28.
- Stafford, Greg. "Notes on the Structure of Glorantha," Well of Daliath. [wellofdaliath.chaosium.com/.../notes-on-the-structure-of-glorantha](https://wellofdaliath.chaosium.com/home/gloranthan-documents/greg-sez/accessing-eternity/notes-on-the-structure-of-glorantha/), accessed 2026-05-28.
- "Myth and History," RuneQuest RPG Wiki. [rqwiki.chaosium.com/glorantha/myth-and-history.html](https://rqwiki.chaosium.com/glorantha/myth-and-history.html), accessed 2026-05-28.
- Tolkien, J.R.R. *The Silmarillion.* Ed. Christopher Tolkien. Allen & Unwin, 1977.
- Tolkien, J.R.R. *The Lord of the Rings,* Appendix B, "The Tale of Years." Allen & Unwin, 1955.
- Tolkien, J.R.R. *Morgoth's Ring* (HoME vol. 10), "Annals of Aman." Ed. Christopher Tolkien. HarperCollins, 1993.
- Tolkien, J.R.R. *The Letters of J.R.R. Tolkien,* Letter #131. Ed. Carpenter, 1981.
- "History of Arda," Wikipedia. [en.wikipedia.org/wiki/History_of_Arda](https://en.wikipedia.org/wiki/History_of_Arda), accessed 2026-05-28.
- Valar Guild First Age Chronology. [valarguild.org/.../Complete_Chronology_of_First_Age.htm](https://valarguild.org/tolkien/encyc/events/timeline/Complete_Chronology_of_First_Age.htm), accessed 2026-05-28.
- James, Brian R., Ed Greenwood, George Krashos, Eric L. Boyd, Thomas M. Costa. *The Grand History of the Realms.* Wizards of the Coast, 2007. ISBN 978-0-7869-4731-7. Preview: [anyflip.com/npkza/zqba/basic](https://anyflip.com/npkza/zqba/basic), accessed 2026-05-28.
- *Forgotten Realms Adventures* (2e). TSR, 1990.
- *Forgotten Realms Campaign Guide* (4e). Wizards of the Coast, 2008.
- *Sword Coast Adventurer's Guide* (5e). Wizards of the Coast, 2015.
- "Forgotten Realms," Wikipedia. [en.wikipedia.org/wiki/Forgotten_Realms](https://en.wikipedia.org/wiki/Forgotten_Realms), accessed 2026-05-28.
- "The Sundering," Wikipedia. [en.wikipedia.org/wiki/The_Sundering](https://en.wikipedia.org/wiki/The_Sundering), accessed 2026-05-28.
- "4th Edition Forgotten Realms Campaign Guide Review," Gnome Stew, 2008. [gnomestew.com/.../4th-edition-forgotten-realms-campaign-guide-review](https://gnomestew.com/4th-edition-forgotten-realms-campaign-guide-review-big-changes-good-book-crappy-map/), accessed 2026-05-28.
- "Grand History of the Realms" review, Wertzone, 2008. [thewertzone.blogspot.com/2008/06/grand-history-of-realms-by-brian-r.html](https://thewertzone.blogspot.com/2008/06/grand-history-of-realms-by-brian-r.html), accessed 2026-05-28.
- Salvatore, R.A. Interview, PC Gamer, October 2025. [pcgamer.com/.../prolific-d-and-d-novelist-r-a-salvatore-says-writing-around-4th-edition-rules-almost-broke-him](https://www.pcgamer.com/games/rpg/prolific-d-and-d-novelist-r-a-salvatore-says-writing-around-4th-edition-rules-almost-broke-him-and-he-knew-its-setting-changes-were-a-mistake-in-about-5-years-theyre-going-to-come-to-us-and-say-bob-we-got-to-fix-this/), accessed 2026-05-28.
- Barker, M.A.R. *Empire of the Petal Throne.* TSR, 1975.
- Barker, M.A.R. *Swords & Glory* vol. 1: *Tékumel Source Book.* Gamescience, 1983.
- Tékumel official history. [tekumel.com/world_history.html](https://www.tekumel.com/world_history.html) and pages world_history01–10, accessed 2026-05-28.
- Blue Room Archive vol. 13. [tekumel.com/downloads/blueroomarchive/brvol13.txt](https://www.tekumel.com/downloads/blueroomarchive/brvol13.txt), accessed 2026-05-28.
- "List of publishing eras," Wookieepedia. [starwars.fandom.com/wiki/List_of_publishing_eras](https://starwars.fandom.com/wiki/List_of_publishing_eras), accessed 2026-05-28.
- "Timeline of Galactic History," Wookieepedia. [starwars.fandom.com/wiki/Timeline_of_Galactic_History](https://starwars.fandom.com/wiki/Timeline_of_Galactic_History), accessed 2026-05-28.
- "Star Wars Canon and Legends Explained," Screen Rant. [screenrant.com/star-wars-canon-legends-expanded-universe-explained](https://screenrant.com/star-wars-canon-legends-expanded-universe-explained/), accessed 2026-05-28.

## Gaps and open questions

- The `event` entities required by the recommended era carve do not all exist. Current corpus has 5 `event` entities; the carve requires (at minimum) `event-ezz-rift`, `event-walk-of-elves`, `event-eyachria-gaea`, `event-god-war`, `event-hykravones`, `event-world-fire`. Some may already exist under different ids; an audit is the first authoring step.
- The end-date of the Birth of Man era (200,000 ya in the prior draft) and the start-date of the Golden Age are not locked in `world-systems-invariants.md`. The Hard-rule table locks "Birth of Man 500,000 ya" as a start and "Golden Age onward unchanged" as a frame, but does not date the Golden Age's opening. Treat as authorial — the carve recommendation leaves the boundary as "Golden Age dawn" pending an authoritative date.
- The proposed `boundsEra` and `eraConcurrentWith` edge kinds require an update to `.claude/rules/entity-relations.md`. Surface for approval before adding. `eraConcurrentWith` carries no Foundations-stage instances.
- The `event-world-timeline.md` body lists eras the carve recommendation eliminates (Hykravones era, World Fire era, Great Expansion era, Dark Ages era). Revising or retiring this entity is a data fix tied to the linter rollout sequence above.
- Whether the Long Winter (post-God-War) is a distinct era or a sub-period of the Age of Craggus / Lost Ages container is left under-decided. Temavori (Long Winter mechanics) and Erindath (Age of Craggus) have a published rivalry — staging the era boundary as their disagreement may be more productive than resolving it.
