---
id: "person-mireth-aurevan"
name: "Mireth Aurevan"
entityType: person
blurb: "The escaped Drasnian who built the Moon Road. She walked out of Gorath through the Moon Wilds alone, then spent her freedom sending others the same way."
tags: ["npc", "drasnian", "moon-road"]
review:
  aiWritten: false
  action: keep
relations:
  - { rel: polity, kind: memberOf, target: "faction-the-moon-road" }
---
Mireth Aurevan escaped Gorath the way the empire swears no one survives: west, on foot, alone, through the Moon Wilds. She was not the first slave to try the jungle. She was the first to come out the far side, mark the way she had gone, and then walk back to the edge of it to wait for the next runaway. The network that grew from that one decision is the Moon Road, and she runs it.

She built it on a hard rule: no one is allowed to know enough to give it all away. A conductor knows the leg they work and the two people they hand to, and nothing past that. Mireth herself is the only one who holds the whole shape of it, and she keeps moving, between the camps of Pesalolo and the quays of Tamadrez and the last clearing before the Wilds, so that there is never a single room you can raid to end her. Most of the dwarves the Road has freed have never seen her face. That was always the point.

> They ask whether I was not afraid of the Vexlings. I tell them the Vexlings never owned me. You learn fast out there which things want you dead and which things only want you gone. Gorath wanted me dead. The Wilds only ever wanted me to leave them be.
> — Mireth Aurevan

What is unsettling her now is not Gorath. It is the gold. The Road outgrew what she could fund the moment it started working, and the dwarves of Levke were waiting with full purses and a longer plan than hers. They do not want the Slaver's Coast emptied a column at a time. They want a freed people kept ready for the day Gorath's throne falls vacant and contested. Mireth took the money and built the Road into something that could carry hundreds, and she has not let herself finish the thought about what those hundreds are being saved for. She tells herself the work is the work, that a dwarf out of chains is out of chains whoever paid the conductor. When Veramus dies, she will not be able to tell herself that anymore.

<!-- author-notes -->
- New entity (W6a). Founder/conductor of the Moon Road; embodies inversion rule #9 (the deadliest route is the safest) by being the one who proved it. PROSE two-way with the Moon Wilds route (she walked it; route named in faction-the-moon-road.md and W1's moon-wilds.md).
- Coined name follows onomastics-dwarf.md Latin-smoothed branch (Aurevan: Aur-/Aureum + -an clan terminal). Collision grep clean. Provisional per plan §6.
- Edge authored via CLI: memberOf → faction-the-moon-road (one direction; reverse computed). No within, no originatedIn (person rule, plan §2). No deferred edges.
