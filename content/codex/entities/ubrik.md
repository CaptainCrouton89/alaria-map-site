---
id: "864"
name: "Ubrik"
entityType: region
blurb: "A Uline dwarf nation in the mountains of the Middle Sea coast, between Camaran and Bestacia."
coordinates: [297, 161]
zoomLevel: 3
tags: ["state", "nation"]
sources: ["all_sections_formatted/Clueanda.md#L2748"]
relations:
  - { rel: spatial, kind: borders, target: "457", note: "Ubrik refugees and silvertongue raids spill west into Bestacia" }
  - { rel: spatial, kind: within, target: "9000" }
  - { rel: polity, kind: memberOf, target: "faction-aldriktch-trade-alliance" }
  - { rel: history, kind: participatedIn, target: "event-aldriktch-founding" }
  - { rel: culture, kind: inhabitedBy, target: "race-dwarf-uline" }
review:
  aiWritten: true
  archetype: ai-ok
  action: keep
  notes: "Uline dwarf nation, silvertongue outbreak; between Camaran and Bestacia; coord matches."
---
A Uline dwarf nation in the mountains of the Middle Sea coast, between Camaran and Bestacia. Once a prosperous mining state, now a nightmare. The silvertongue outbreak has turned half the population into mercury-mouthed cannibals, and the infection is spreading.

Member of the Aldriktch Trade Alliance, though the alliance is buckling under the crisis. Refugees flood neighboring states. Silvertongues raid across borders. No cure exists.

Ubrik never had a crown. Authority belonged to the Wardens' Table, the senior mine-wardens of the great northern and southern fields, who settled disputes among themselves and apportioned the deep work between their fields. The Table came apart as the northern wardens died in their own shafts. What remains of it sits in the south and speaks for no one above the refugee line.

#### The Northern Mines

Where the outbreak began. Dozens of mining settlements, now silent or overrun. This is where Slick Silver was first discovered—a shimmering, mercury-like mineral in the deepest tunnels. The mines are considered lost. Anyone who enters doesn't come back.

The silvertongues nest here in growing numbers, emerging to raid the surface when hungry.

#### The Southern Mines

Still operational, barely. Refugees and remaining miners have fortified these settlements, hoping the infection hasn't spread this far. Paranoia is extreme—anyone showing signs of silver in their mouth is killed immediately. Some innocent dwarves have been murdered over dental fillings.

#### Slick Silver

A corrupted mineral, liquid-metallic and shimmering. Those who see it feel compelled to touch it. Those who touch it feel compelled to taste it. Those who taste it transform.

The silver coats the mouth first—teeth and tongue gleaming metallic. Then it spreads through the blood. Veins turn silver beneath the skin. The eyes go mirror-bright. Reason dissolves into hunger.

Silvertongues are cunning hunters. They ambush, overwhelm, and force Slick Silver down their victims' throats to spread the infection. They retain enough intelligence to use tools and set traps.

No cure is known. The infected cannot be reasoned with. Fire works, but silvertongues are fast and travel in packs.

#### The Refugee Camps

Along Ubrik's southern and western borders, desperate camps have formed. Thousands of dwarves with nothing, waiting to be allowed into Bestacia or Camaran. Conditions are terrible. Disease (normal disease, not silvertongue) spreads easily. Some refugees have been stuck in camps for months.

Host countries are hostile. Rumors that any Ubrik dwarf might be secretly infected have led to violence and discrimination.

#### The Border Crisis

Silvertongues don't respect borders. Raiding parties have struck into Bestacia and eastern Camaran. Both countries are fortifying their borders and demanding Ubrik "contain" the problem—but Ubrik's government barely exists anymore. The alliance is fracturing over who bears responsibility and who should commit troops.

#### The mine-rights

The vein that killed the north did not settle who owns it. Every shaft and gallery in Ubrik was held under a warden's title, and those titles did not die with the wardens who fled. They went south in the refugees' baggage: deeds to plague-filled ground, worth nothing in a camp. Watar found its opening there.

The Strugmar trading house of Watar has spent the last several years buying northern mine-rights off fleeing Uline wardens for the price of passage and a winter's bread. Drazvik Strugmar's factors work the border camps with chests of Watari coin and clean paper, and a warden with starving children signs. The house is not buying silver it can dig; the northern fields are death and will stay death for years. It is buying title. Strugmar is betting that the vein runs out or gets sealed within a generation, and that whoever holds the deeds when the last silvertongue is burned will own the next age of Clueandan silver outright.

What galls the southern remnant of the Wardens' Table is the order in which help arrived. The Aldriktch Trade Alliance, the pact Ubrik signed and has leaned on for two centuries, spent years debating who owed troops and grain to a dying member and sent neither. Watar sent buyers. The deeds went north into a Strugmar strongbox while the camps waited on relief that never came, and the wardens who signed knew exactly what they were signing away.

Not all of it sells. Vendmar, the senior surviving warden of the southern field, has refused every offer the Strugmar factors have brought him, and has forbidden the wardens still under him to sell so much as a worked-out gallery. He keeps the Gruvhak field running on the old terms, un-mortgaged and undermanned, one deep cut at a time, with the killings at the shaft-head that the paranoia of the south demands. It costs him. Coin he will not take is bread his people do not eat, and the field yields a fraction of what it did before the strike. He holds it anyway. A warden who sells his field, he argues, has already become what the silver makes of a dwarf. For the scattered south he has become the nearest thing the Table still has to a voice.

> A deed is a promise to dig. I made mine to the Table and to the dead in the Dnyrrak, not to a clerk from Watar with a chest of coin. Tell Strugmar the Gruvhak field is not for sale. Tell him slowly, so it has time to sink in.
> — Vendmar, warden of the southern field

<!-- author-notes -->
Fork D1 (Ubrik side of the mine-grab) authored 2026-06-03. The "#### The mine-rights" section is the prose backlink to the Watar-side narrative + edge. No edge authored here: W2 owns the direction (watar.md / person-drazvik-strugmar.md → economy/tradesWith → 864, note = distress-buying northern mine-rights). The computed reverse will surface it on Ubrik; do NOT add an outbound edge from this file. Backlink W2 must add on its side: prose naming Ubrik/the fleeing Uline wardens as the sellers (confirmed already present in watar.md strait/Strugmar framing — verify on serial validation).

Plague mechanics untouched: "no cure exists" preserved (event-the-slick-silver.md). Refugee/border material left consistent with camaran.md, bestacia.md, erasnus.md (Adnar = first refugee stop) — referenced, not contradicted.

lore-complication inversion (Ubrik side): the rule is total collapse + everyone selling out; the grounded named exception is Warden Vendmar, who refuses to sell and keeps the Gruvhak field un-mortgaged at real cost. Left unresolved (he is losing, slowly).

Coined names (onomastics-dwarf.md, Norse deep-clan branch; Uline are deep-delve/earth-attuned = stay Norse-harsh) — both PROVISIONAL (personal-name pool is thin per sheet), grep -rli collision-clean 2026-06-03:
- Vendmar (warden, personal name): V- labial onset (cf. worked example Vorekum) + -nd- nasal cluster (recurring) + -mar height/clan suffix (cf. event warden Grømgar's -gar). Distinct onset from the event's Grømgar to avoid reader confusion.
- Gruvhak (the southern field he holds): Gru- prefix (growth/weight, cf. Gruynmar) + -hak hard-stop place terminal (cf. worked example Grømnhak); reads minelike (echoes Norwegian "gruve"). Sits alongside existing Dnyrrak Cut (-rrak) in the north.
Vendmar is prose-only (no person entity created; matches W3 scope = ubrik.md only).
