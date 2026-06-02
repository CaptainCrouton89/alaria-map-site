---
id: "390"
name: "Middle Sea"
entityType: water
blurb: "The Middle Sea is a large body of water lying south of the Kharvorn Mountains, in the temperate heart of Clueanda."
banner: https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images/390/banner.webp
coordinates: [250, 193]
zoomLevel: 0
tags: ["island", "geography", "forest", "state", "nation", "hills", "bay", "strait", "sea", "plateau", "city", "fortress", "dragon", "creature", "swamp", "poi", "mountains"]
sources: ["all_sections_formatted/Clueanda.md#L15"]
relations:
  - { rel: spatial, kind: within, target: "388" }
review:
  aiWritten: false
  archetype: ai-ok
  action: keep
  notes: "Geography section is the AI-trimmed sea-overview (retained). Wave-2: added a human-authored 'Politics of the inner sea' section (the stateless city-state system, the Tarkhon strait toll, the Bryn-trail freeze vulnerability, the Vogenfeld/Hedroscobb northern-flank lever). Original trim note: cut from ~16k to sea-geography overview; removed embedded sub-entity articles and ~15 TODO stubs; retained shape/position, coastal-states lists, Ofrenia overview, surrounding-waters (Oblivion/Maw of Chao)."
bannerPosition: "50% 68.2%"
bannerHeight: 320
---
### Geography

The Middle Sea is a large body of water lying south of the Kharvorn Mountains, in the temperate heart of Clueanda. It occupies the space between Clueanda to the north and the great peninsula extending from Rimihuica to the south, forming a distinctive upside-down U shape of coastline that creates an enormous amount of valuable coastal real estate.

#### Shape and Position

The sea forms where land from both Clueanda and Rimihuica curves to create an enclosed basin:
- **Northern shore**: The Clueanda coast curves in a broad arc, hosting the major trading states
- **Southern shore**: A large peninsula or island extends northward from Rimihuica
- **Western passage**: The wide waters narrow to a much straighter, narrower strait that runs due-west, eventually connecting all the way to the Western Isles—this chokepoint is controlled by Tarkhon

#### Coastal States (Clueanda Shore)

Traveling counterclockwise from the eastern end of the Middle Sea, the northern shore hosts these states, forming a curved "roof" around the Rimihuican peninsula:

- **Adron** (easternmost, where the Kharvorn Mountains end)
- **Camaran**
- **Ubrik**
- **Bestacia**
- **Erasnus**
- **Watar**
- **Echea**
- **Ta'minn**
- **Thespia**
- **Stipen**
- **Zintacas**
- **Kazül** (near where Tarkhon begins)

#### Connection to Tarkhon

West of Kazül, the Middle Sea region transitions into Tarkhon-controlled territory. The broad upside-down U of the Middle Sea narrows dramatically into the Tarkhon Strait—a due-west passage that serves as the only sea route between the Middle Sea and the open ocean beyond the Western Isles.

#### Coastal States (Rimihuica Shore)

The southern shore of the Middle Sea belongs to Rimihuica, dominated by:

##### Ofrenia

A large island (technically separated from the mainland by Swampdeep) that extends northward into the Middle Sea, creating the distinctive upside-down U shape. Ofrenia is divided among three independent states ruled by warring siblings—a political powder keg at the heart of Middle Sea commerce. The island is absolutely central to the region's military and economic affairs.

#### Surrounding Waters

- **Gray Sea**: The waters north of Swampdeep, between Ofrenia and the mainland
- **Oblivion**: A permanent supernatural storm east of the Middle Sea proper and south of Adron—a hundred-mile-wide fog bank that causes complete memory loss. Those who enter forget everything and sail out in confusion, with no recollection of what lies within. At the center of Oblivion lies the Maw of Chao, a volcanic island that serves as the hatching ground for thousands of dragons. The memory fog protects this sacred place, where Damasaki Edara (daughter of the great dragon Nagatayora) raises dragon eggs before setting the young dragons free. In ancient times, the dragon riders of Adrus (now Adron) would brave the fog to reach the Maw of Chao and receive Damasaki Edara's blessing, earning the right to raise and ride with dragons

### Politics of the inner sea

No crown rules the Middle Sea. A dozen states ring it, each its own polity with its own laws and its own standing quarrel with the next harbor down the coast, and what governs them all is not a treaty but the water. The sea is the cheap road. A load of Camaran clockwork or Kazül glass moves around the rim by hull for a fraction of what it would cost dragged overland through the Kharvorn foothills, so no state can afford to close the sea to its neighbors; every state needs it open for itself. That mutual need is the closest thing the coast has to a government, and it holds the sea-lanes open through wars that would otherwise have shut them.

The sea has a single door, and another power holds it. West past Kazül the water narrows into the Tarkhon Strait, the one sea route between the Middle Sea and the open ocean, and the Tarkhon Empire taxes everything that passes. A hull bound out pays at the narrows; the same hull, coming home, pays again. The coast has resented the toll for as long as Tarkhon has charged it and has never managed to do a thing about it, because the only alternative to paying the empire is not trading at all. Kazül, the last harbor before the strait, carries the grievance most sharply and turns it to profit where it can.

> Every hull pays twice at the narrows, going out and coming home, and a Kazül captain will tell you the homeward toll is the one that galls. You expect to pay your way out into the world. Paying to come back to your own sea is the insult.
> — a saying along the Middle Sea coast

The toll is only the price of the warmth. The Middle Sea is temperate at a latitude that ought to be frozen, and it stays temperate only because the warm band of Bryn's trail still falls across it, held in place by the congregations of the Solar Accord. The north of Clueanda is the proof of what that arrangement is worth. Under the Nysanna glaciers stand cities that kept open sun in an older age and froze where they stood when the trail moved off them, their grain still sealed in the storehouses. Should the Accord's hold on Bryn's path ever slip this far south, the Middle Sea would freeze, and every tariff and trade-war on the coast would end together with the trade itself.

The nearer threat is on land, at the strait's northern shoulder. The passes above the Tarkhon narrows are held by the Uline dwarves of Vogenfeld, who have shielded them against the orc states of Hedroscobb for five centuries in return for a tribute the empire now pays late and short. The dwarves keep the passes out of stubbornness and old oath more than any love left for Tarkhon. If they ever walk off them unpaid, Hedroscobb gains a road south toward the strait's northern flank, and the single gap that feeds the whole Middle Sea would be threatened from the land as well as taxed at the water.

<!-- author-notes -->
Wave-2 (Middle Sea political cluster). Added the "Politics of the inner sea" section; the Geography section above is the retained AI-trimmed sea-overview, untouched.

Bryn-trail framing is canon per clueanda.md:62 (warm belt held by the Solar Accord's grip on Bryn's trail; Nysanna sun-frozen ruins are the precedent). NOTE: the Middle Sea freeze risk is the BRYN-TRAIL mechanism, NOT the Frost Fall (event-frost-fall is a deep-time Pelus-drift cold in the south, 8,840 BSD, a different cause). Deliberately did NOT wire a frost-fall edge or conflate the two mechanisms. Solar Accord / Bryn / magic-light referenced in prose only, no edge (locked cosmology; clueanda.md already carries the dependence canon).

Vogenfeld/Hedroscobb lever referenced in prose; reciprocal prose backlink added in vogenfeld.md (no fitting edge kind for a water→shield-state geopolitical dependence — kept prose-only both directions).

No edges authored on this water entity (political edges live on the land polities: Kazül rivalOf Tarkhon, Adron tradesWith Camaran, Camaran tradesWith Kazül). No new names coined.

