---
id: "brattholt"
name: "Brattholt"
entityType: town
blurb: "A forest-edge holding up the Rabbit's headwaters whose ruling family buries its dead in the Fragenstor on purpose, against the faith of the ebb."
coordinates: [323, 560]
zoomLevel: 5
tags: ["town", "tangiern", "crimson-coast", "human"]
relations:
  - { rel: spatial, kind: within, target: "2443" }
  - { rel: culture, kind: inhabitedBy, target: "race-human" }
---
Brattholt is a small holding far up the Rabbit's headwaters, where the heartland thins out and the Fragenstor Mielthøn closes over the river. It belongs to the Vøllund family, who have held the surrounding timber for as long as Tangier records run, and it is the one place in the kingdom where the dead are buried in the ground as a matter of conviction rather than necessity. Every other inland family that grounds its dead does so in shame, beaten by winter and a body that turned before the coast. The Vøllund do it openly, and would not stop if the river ran clear to the sea in midwinter.

Their reasoning is not the funeral fleet's. The Vøllund hold that the Forest of a Thousand Thoughts keeps its dead awake, and they want theirs kept near. A Vøllund is laid among the old trees behind the hall, and the family walks out to those graves to put questions to them, the way another household might consult an elder. They say they get answers. What troubles Nøsen is that the Tangier have spent generations insisting that a body in still ground is a body that comes back, and the Vøllund agree completely. They simply consider it the point.

> They asked us once whether our grandfathers lay quieter than the Murder Creek dead. We told them the truth. We don't know. We only know ours still answer when we ask, and theirs answer everyone, all the time, whether anyone asks or not.
> — a Vøllund of Brattholt, to a tithe-officer from Nøsen

<!-- author-notes -->
NEW pinned holding per the Fork C lore-complication mandate (locked-decisions §Fork C). entityType: town
(small forest-edge holding), zoomLevel 5, coordinates [323,560] inland of Aspenthar [320,558] up the
Rabbit's headwaters, plausibly cut off from the coast in winter. Owned by this writer.

INVERSION: Tangiern's load-bearing rule is sea-burial (never the ground, never still water). Brattholt
is the grounded, named exception that buries in the forest BY CONVICTION, not by winter accident. The
unease is left unresolved in public prose (quieter, or worse?).

GM-knowable answer (mysteries rule; recorded fully in tangiern.md author-notes, summarized here): the
Vøllund really do get fragmentary responses, but the cause is the Fragenstor's ambient cognition-bleed
(locked-decisions Fork B: the Forest of a Thousand Thoughts effect is the loose Hildaneir entity's
cognition-bleed) wearing the dead's remembered shapes, not the dead truly speaking. Brattholt's inland
bodies DO accumulate local shadow-residue slowly, but it has not bloomed into a haunting because the
deaths there are overwhelmingly peaceful and peaceful dead leak far less shadow than the violently
killed. Horror seed: one violent death at Brattholt could begin what Murder Creek already is. Fork B is
in progress under the deep-lore writer; only the cognition-bleed concept is referenced, no Hildaneir
lore authored here.

NAMES: Brattholt and Vøllund coined, Norse-coded to match the map-baked Tangier register; grep -rliE
collision check clean for both stems before commit. Two-way link: tangiern.md prose names Brattholt and
the Vøllund; this file carries within → 2443. No edge into out-of-cluster entities.
