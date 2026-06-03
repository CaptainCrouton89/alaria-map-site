---
id: "nagayeshi"
name: "Nagayeshi"
entityType: wilderness
blurb: "The volcanic island at the eye of Oblivion, hatch-ground of dragons since before the Naga; only the keeper Eyatora decides who leaves with one."
coordinates: [309, 220]
zoomLevel: 3
sources: ["all_sections_formatted/Clueanda.md#L1952"]
relations:
  - { rel: spatial, kind: within, target: "719" }
  - { rel: culture, kind: inhabitedBy, target: "creature-eyatora" }
---
Nagayeshi stands at the still center of Oblivion, where the memory-storm thins to clear air over black sand and a single smoking cone. It is where dragons hatch, and it has been since long before the storm hid it, since long before the Naga, back in the deep age the world remembers as the Reign of Dragons. The ground does the work. The cone's slow fire warms the clutches buried along the upper slopes, and the young take their first flight over a sea that no enemy can cross to reach them. The Adron Naga gave the island its name. They are the only people who have ever set foot on it and carried the name home.

> The beach where the hatchlings come down to the water. Black volcanic sand, warm underfoot even at the tide line, scattered for half a mile with the cast shells of old clutches, some of them larger across than a fishing boat. Above the beach the slope steams where the buried eggs lie. Nothing else lives here. There is no need.

The island is not empty between hatchings. Eyatora keeps it, the eldest of Nagatayora's children still living, a dragon old enough to have been hatched before the war that killed her father and made the Naga from his blood. She raises every clutch the island's fire brings up, and she alone decides who may take a dragon away from Nagayeshi. What that meeting is, and what she asks of those who come, belongs to her own account.

For most of the early Seventh Dawn this island was the far end of a pilgrimage. A Nagashi of Adron who meant to ride crossed Oblivion by blood and intention, came to ground on these black beaches, and left, if Eyatora allowed it, bonded to a dragon for the rest of his life. The age the rest of the Middle Sea called the Wyrmward began and ended here. Then the Waterdark order severed the bonds, and the pilgrimage stopped. The island is still here and still hatching, and the road to it is still a storm that eats the minds of all but one bloodline. No rider of Adron has crossed since the Severing. Eyatora has gone on raising clutches that no one comes to meet.

<!-- author-notes -->
NEW entity, Wave EC Writer 4. Island name "Nagayeshi" COINED fresh in Naga sacred register per docs/worldbuilding/onomastics/onomastics-naga.md: Naga- formal/sacred prefix (always used for sacred sites) + soft multi-syllable stem + -shi compressed terminal (from the frozen sample Nagashi); open vowels, no hard clusters. Collision-checked clean: `grep -rliE "Nagayeshi" content/codex/entities/ docs/worldbuilding/` -> 0 hits. Provisional per the sheet's "sparse sample" caveat. Replaces the AI-coined "Maw of Chao" (was in middle-sea.md:64, clueanda.md:43; both repointed this wave). Per Decision 1, the Adron Naga named it.

entityType: wilderness (no "island" type exists in the place enum; it is uninhabited wild terrain defined by what lives in it, so wilderness fits better than poi). Pinned (slug id + coordinates, vortek-river.md convention). coordinates [309,220] offset SE of Oblivion's [307,218] so pins do not stack.

CONTAINMENT: within 719 (Oblivion). .pi/rules/water.md says an island's within points to a landmass/region, never the water BODY it sits in. Oblivion is entityType wilderness (a standing storm), not a water entity, and the fiction is that the island is literally enclosed at the storm's eye; within 719 is both rule-honoring (Oblivion is not a water body) and the most navigable containment, and it satisfies Decision 1's "wire island <-> Oblivion." The nearest actual landmass (Pii / Mount Kajiit / Verucan) is off-limits to conflate; the open-ocean area has no sub-region container.

EDGES: within 719; inhabitedBy creature-eyatora (authored on the place per .pi/rules/creature.md; reverse surfaces on her file). Guardian and storm mechanics deferred to creature-eyatora.md and oblivion.md respectively (no duplication). Wyrmward referenced, not re-narrated (event-dragon-rider-era owns it).
