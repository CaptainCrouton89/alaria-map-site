---
id: "person-torven-vorekan"
name: "Torven Vorekan"
entityType: person
blurb: "The Moon Road's organizer inside the Pesalolo slave camps. Three centuries of bondage were meant to break the Drasnians. He is the standing proof they didn't."
tags: ["npc", "drasnian", "moon-road", "resistance"]
review:
  aiWritten: false
  action: keep
relations:
  - { rel: polity, kind: memberOf, target: "faction-the-moon-road" }
  - { rel: polity, kind: allyOf, target: "faction-dead-moon-tribe" }
---
Torven Vorekan works the source end of the Moon Road, inside the extraction camps on the Slaver's Coast of Pesalolo, and he has never once tried to escape them. That is a choice. He could have taken a place in a column years ago. Instead he stays, because the Road needs someone on the inside who decides who runs and when, who keeps the ones left behind from collapsing into the despair the overseers count on, and who makes sure a dwarf chosen to go is one who can hold their nerve through the Wilds. The conductors get people out. Torven decides there are people to get out at all.

Gorath built its whole arrangement on a theory: that three centuries of chains turn a people into property, that you can breed the memory of being a people out of them in a few generations. Torven is the evidence against it. The camps he works run a second order under the first one, invisible to the overseers, a grid of who holds what and who can be trusted and who is owed. None of it shows on a manifest. All of it is real, and it has kept the Drasnians of the Coast a people through three hundred years that were designed to make them stop being one.

> Tell the overseer whatever he wants written down. Keep the rest in your teeth. A people that forgets on command was never a people to begin with. We are still here. That has always been the only argument I needed.
> — Torven Vorekan

What he is working toward now reaches past the Road. Across the water on Kyagos, the enslaved rose and won; the Dead Moon Tribe came out of Moonwood, joined the rising, and burned Syvlius to the ground, and their shamans have been meeting quietly with Drasnian leaders ever since. Torven is one of those leaders. He studies the Kyagos rising the way a general studies a battle already fought, looking for what made it work and whether the Shacklands hold the same pieces. The escapes are the visible work. The thing he is really building is the answer to a single question, which is what the enslaved Drasnians of Gorath do in the hour Emperor Veramus dies and the empire turns inward to fight over his chair.

<!-- author-notes -->
- New entity (W6a). Pesalolo source-end organizer; embodies inversion (plan §3: "the enslaved are broken" → three centuries didn't break them). One-way prose reference to faction-dead-moon-tribe (out-of-scope, NOT edited): the Kyagos rising + shamans meeting Drasnian leaders is canon from faction-dead-moon-tribe.md:26,28 — Torven cast as one of those "Drasnian leaders." Reverse backlink deferred (their file already gestures at the thread).
- Coined name follows onomastics-dwarf.md Latin-smoothed branch (Vorekan: Vor- + -ekan, cf. worked example Vorekum, NOT copied verbatim). Collision grep clean. Provisional per plan §6.
- Edges authored via CLI: memberOf → faction-the-moon-road; allyOf → faction-dead-moon-tribe. No within/originatedIn. No deferred edges (both targets exist on disk).
