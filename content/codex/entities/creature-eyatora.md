---
id: "creature-eyatora"
name: "Eyatora"
entityType: creature
blurb: "The eldest living child of the dragon-father Nagatayora, keeper of the hatch-ground at Nagayeshi, who chooses which Naga ride and which do not."
tags: ["dragon"]
sources: ["all_sections_formatted/Clueanda.md#L1952"]
relations:
  - { rel: history, kind: participatedIn, target: "event-dragon-rider-era" }
  - { rel: polity, kind: protects, target: "411", when: "during the Wyrmward", note: "chose and blessed Adron's bonded riders; the dragons of the Wyrmward were hers to give" }
---
Eyatora is a dragon, and she is old in a way the other dragons of the present world are not. She was hatched on Nagayeshi in the first age of dragons, while her father Nagatayora still lived and warded Gaea's world from the sky, which makes her his eldest child still living and one of the few creatures in Alaria who remembers him as a father rather than a name on a lineage. She was already ancient when Hykravones broke him open above the field, when his blood fell east and the first Naga rose from where it landed. She did not descend from that blood. She came before it. The Naga carry her father's blood; Eyatora carries his unbroken line, there from the start.

She has kept the hatch-ground ever since. She raises every clutch the island's fire brings up, and she decides, one rider at a time, who may leave Nagayeshi with a dragon. This is the part outsiders get wrong about the Wyrmward. The bond a rider carried was never a thing he took. It was a joining down to the soul, one that could not be forced on a dragon or faked by a man, and Eyatora's part in it was to judge whether a given Nagashi and a given young dragon should be offered to one another at all. She blessed the bond. She never compelled it. A hatchling she found unwilling, or a rider she found wanting, simply went unbonded, and the rider sailed home through the storm with nothing to show for the crossing.

She owes Adron nothing and gives it everything, a distinction she keeps sharper than the Nagashi tend to. The riders who reached her were her father's blood, and she received them on that account and no other. She has never thought of herself as their servant, and the dragons have never been theirs to demand. When the Waterdark order severed the bonds across the sea, the cut did not reach her. It took the threads from the living riders and their dragons; it did not touch the island, and it did not stop the cone from bringing up new clutches. Eyatora has gone on hatching and raising dragons that no one has come to claim for centuries now. What she makes of a people who stopped crossing the storm to meet her, she has not said.

<!-- author-notes -->
NEW entity, Wave EC Writer 4. Guardian of the Oblivion dragon-origin beat (Decision 1, Option A folded into C).

NAME: "Eyatora" COINED fresh, resonant with the dragon-father's line per Decision 1 ("cf. Nagatayora, Eyachria"): Ey- onset from Eyachria (Nagatayora's famous dragon-daughter, era-reign-of-dragons.md) + -tora from Nagatayora; flowing vowels, no hard clusters, reads as a deep-time dragon name. NOT strict Naga onomastics, because she is a DRAGON, not a Naga. Collision-checked clean: `grep -rliE "Eyatora" content/codex/entities/ docs/worldbuilding/` -> 0 hits. REPLACES the AI-coined "Damasaki Edara" (was middle-sea.md:64 only; that name sat off-register, harder stops, no Naga/dragon-line resonance, no entity, no corroboration per explore doc item 2/7). middle-sea.md and clueanda.md repointed this wave.

CANON GUARDS:
- NEVER a daemon. Dragons are NOT daemon-eligible (world-systems-invariants.md Daemon-substrate gate). She is a dragon, full stop.
- "Daughter of Nagatayora" is literally true with NO timeline break: she predates the Hykravones war and the Naga (hatched in the Reign of Dragons while her father lived; explore doc item 7 resolution). Her great age is asserted, not handwaved.
- Wyrmward bond stays soul-deep and CONSENSUAL (locked, event-dragon-rider-era.md:15): she blesses, judges, and offers; she does not compel. Stated explicitly.
- Severing (~2976 SD, event-the-severing-of-the-dragon-bonds) cut the living bonds, not her; "centuries now" kept vague to avoid pinning a present-year date.

EDGES: participatedIn event-dragon-rider-era (she granted/blessed the Wyrmward's dragons; a one-sentence backlink was added to that event file, which previously left HOW riders got dragons unstated). protects 411 (Adron), when "during the Wyrmward" + note (the guardian<->Adron link from Decision 1; authored on the more-specific side, target = the nation). inhabitedBy edge for the island lives on nagayeshi.md (authored on the place); reverse surfaces here. A one-line prose backlink naming Eyatora + Nagayeshi was added to adron.md (the permitted single Adron backlink). Storm and island detail deferred to oblivion.md / nagayeshi.md (no duplication).
