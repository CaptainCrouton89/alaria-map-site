---
id: "2712"
name: "Ishnit Jungles"
entityType: wilderness
blurb: "The lethal jungle ringing the southern Dunes of Kunagi, ruled in pieces by two false-dragon gods, three Naruaghin confederations, and a bottomless rift."
coordinates: [145, 305]
zoomLevel: 3
tags: ["forest", "geography"]
sources: ["all_sections_formatted/Rimihuica.md#L2451"]
relations:
  - { rel: spatial, kind: within, target: "2620" }
  - { rel: culture, kind: inhabitedBy, target: "creature-pythalomos" }
  - { rel: culture, kind: inhabitedBy, target: "creature-senwyn-the-agonizer" }
  - { rel: culture, kind: inhabitedBy, target: "race-naruaghin" }
  - { rel: culture, kind: inhabitedBy, target: "race-elnir" }
  - { rel: spatial, kind: borders, target: "2651" }
  - { rel: spatial, kind: borders, target: "manual-mpjrcf71-enapy" }
---
The Ishnit is the band of jungle that rings the southern edge of the Dunes of Kunagi, and nearly everything that makes a wilderness dangerous is present in it at once. The canopy is the first of it. The trees grow tall and close enough that the floor sits in green twilight at noon, and a traveler can lose every cardinal direction inside an hour. The second is water. For most of the year the low ground floods, the rivers spread past their banks into warm standing sheets, and a path that was dry in one season is a channel in the next. The land does not hold still long enough to be learned, which is the beginning of why people who know it call it the deadliest country on the continent.

### The two gods

What lifts the Ishnit out of merely difficult country is that two of its predators have declared themselves gods, and made it stick. Pythalomos the constrictor holds the north and center. Senwyn the Agonizer, all venom and bright warning-colors, holds the west and south. Both have hunted here for roughly four centuries, both treat the people beneath them as food or as entertainment, and the strip where their territories meet is jungle no sane thing enters, because the two of them raid across it to spite one another. Their own entries carry the particulars. What matters for the jungle as a whole is that its two apex hunters are intelligent, patient, and personally invested in the suffering of everything below them.

They are gods of snakes, and they have the congregation to prove it. The Ishnit breeds serpents in a variety found nowhere else on Alaria, constrictors thick as a man's thigh and small banded things whose bite kills before a victim can walk back to camp. The South Naruaghin have built an entire craft around harvesting those venoms; everyone else learns which leaves to avoid and which water to leave alone. Add the ordinary megafauna, the big cats and the tusked things that wallow in the flood-shallows and the insects that lay eggs in open wounds, and the snakes are only the part of the jungle with a theology.

### Ekomorn, underfoot

Near the center of all this is Ekomorn, and the danger it poses is not the one travelers expect. Ekomorn is a rift, and not an ordinary one: it drops clear to the center of the material plane. The trouble is that the jungle has grown over it. The rift runs at a diagonal much farther than its visible mouth suggests, and the canopy has closed across long stretches of it, so a party can be walking on what it takes for solid ground above a crack with no floor. Things come up out of it. Animals are found killed at the rim and left uneaten, and shadows climb from the cracks on no schedule anyone has worked out. The North Naruaghin order their whole existence around watching the rift; their entry explains how.

> A clearing well past where anyone believes Ekomorn reaches. Three wild pigs lie dead in a row at the lip of a crack the moss had hidden. Nothing has fed on them. The bodies are broken in ways a fall does not account for, and the soil at the edge is cold to the touch in the middle of the wet season.

### Who holds the rest

Three confederations of Naruaghin hold most of the jungle the dragons do not actively patrol. They are one people split three ways by geography and grudge, a stone-scaled folk who fight each other nearly as readily as they fight anything else. The North gather around Ekomorn and have turned their culture entirely toward the rift. The East hold the open ground where the jungle thins toward the Green Wilds, and they have spent three generations at war with the Dwelyn across that border. The South range the western reaches down to the cursed coast, poison-makers hardened by the dragon overhead and the thing penned on the cape below. Each keeps its own entry. What the map shows is that no single authority governs the Ishnit, only these three and the two gods they cannot kill.

Not everything in the jungle is Naruaghin. The Elnir live here as well, never in numbers and never together. Each is a solitary ex-druid who long ago traded the service of the wild for command over it, and the sign of one is plain once you have seen it: a stretch of forest where the undergrowth has been dressed into straight rows, where the guard-animals have too many legs or the wrong count of eyes. There are no Elnir villages to find and burn. There is only, here and there, a patch of jungle that has been arranged, and whatever arranged it still close by.

### The southern cape

The worst corner of the Ishnit is older than either dragon. Demonwatch stands on the southern cape, a darkstone palace holding seven deathless demons that three centuries of confinement have held but never broken, and the water curled around it, Demortik Bay, has gone foul enough that fish abandon it and anchored crews do not all wake. The South Naruaghin work that shore quickly and never after dark. Both the palace and the bay keep their own entries; for the jungle as a whole, the cape is simply the one direction even the Naruaghin refuse to press.

### Edges

The Ishnit's borders tell as much as its interior. To the north the trees break against the sand of the Dunes of Kunagi, and the change is abrupt rather than gradual: flooded green for a week's walk, then dune, with little in between. To the east the jungle thins into the Green Wilds and the old Dwelyn monarchy of Enapay, the one organized power that borders the Ishnit and the only neighbor its inhabitants deal with as a rival rather than as prey. Everywhere else the jungle simply runs out at the sea.

<!-- author-notes -->
Synthesis article answering "why is the Ishnit lethal even by Alaria's standards?" per Wave 4 brief §2.
- Member lore deferred to its own files (Wikipedia-summary model): three Naruaghin confederations (2798/2662/2825), Ekomorn (2713), both dragons (creature-pythalomos / creature-senwyn-the-agonizer), Demonwatch (2714), Demortik Bay (4389), Elnir (race-elnir). One-sentence summaries only here.
- Naruaghin described as "stone-scaled" per race-naruaghin.md (Gaea flesh, giant+dwarf, NO dragon blood — the dragon-totem is a self-told story). Did NOT assert draconic heritage despite the confederation files' looser wording.
- Did NOT hardcode a compass relation BETWEEN North (2798) and East (2662) Naruaghin — flagged coord collision [136,296]. Each placed by its anchoring feature instead.
- NO new proper nouns coined (Naruaghin/Elnir have no onomastics sheet). Rivers kept generic: I wanted to name a flood-river but the canon names (Morsuye/Pino/Royon, rimihuica.md) are scoped to Westrim's "wetter margins," not confirmed to run through the Ishnit — left undescribed-by-name rather than risk a canon assertion. Flag for Silas if an Ishnit river name is wanted.
- No scholar attribution per brief. The one inset is a scene/image inset (no "> —" line), allowed.
- Edges added via CLI: borders 2651 (dunes N), borders manual-mpjrcf71-enapy (Enapay E). Existing within 2620 + 4 inhabitedBy edges preserved.
