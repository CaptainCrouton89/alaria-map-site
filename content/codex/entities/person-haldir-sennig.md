---
id: "person-haldir-sennig"
name: "Haldir Sennig"
entityType: person
blurb: "The Moon Road's best guide through the Moon Wilds. He reads the Vexling broods the way other men read weather, and knows the one brood that lets his columns pass."
tags: ["npc", "drasnian", "moon-road"]
review:
  aiWritten: false
  action: keep
relations:
  - { rel: polity, kind: memberOf, target: "faction-the-moon-road" }
---
Haldir Sennig owns the worst leg of the Moon Road, the crossing of the Wilds themselves. Other conductors get a runaway to the jungle's edge and hand off; Haldir takes the column in. He has walked the green so many times that he no longer counts the trips, and he has learned to read a Vexling brood the way a sailor reads a sky going wrong, by the small changes that come before the violence. Most of what he knows he cannot put into words, which is the Road's quiet terror, because it means the route partly lives in one dwarf's head.

The thing he will not fully explain is the safe stretch. Four days west there is a band of jungle the other guides tell you to run through, and Haldir tells you the opposite: walk, stay close, make no noise. Something in that stretch watches a column through and does not strike. He has crossed it more times than he can name and never lost a soul inside it. He has heard the explanation the runaways trade in whispers, that it is the brood gathered around Olivar, the Gorathi priest the Wilds took and did not kill, and that whatever Olivar is now, his Vexlings have inherited some shadow of his mercy. Haldir neither believes it nor argues. He has decided that the safest thing to do with a miracle you do not understand is to keep being polite to it.

> There is a place four days in where everyone tells you to run. Don't run. Something there watches the column through, and I have never lost anyone in it. I don't know what it wants from us. I have decided not to find out by being rude.
> — Haldir Sennig, on the brood that lets his people pass

The Road has tried to make him train others, and he tries, but a season of apprenticing is not enough to hand over a thing he learned over years and mostly by instinct. So the conductors who fund the Road from Levke have a fear they do not speak to the runaways: that the safest road off the continent is one Vexling strike away from closing, and that it would close with Haldir Sennig still inside it.

<!-- author-notes -->
- New entity (W6a). Conductor guiding escapees through the Wilds; embodies inversion (plan §2 W6 / rule "the jungle kills" → a brood lets his people pass). PROSE references person-olivar (W1-owned) by name — Olivar's mercy-brood is the safe stretch.
- Coined name follows onomastics-dwarf.md Latin-smoothed branch (Sennig: Senn-/Sennos/Sennites civic-Latin stem). Collision grep clean. Provisional per plan §6.
- Edge authored via CLI: memberOf → faction-the-moon-road. No within/originatedIn. No deferred edges (Olivar is prose-only here; no edge required per §4).
