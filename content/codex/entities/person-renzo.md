---
id: "person-renzo"
name: "Renzo"
entityType: person
blurb: "A Slavewatch lieutenant who runs his patrols by the book and empties the passes of the people his Tribune has sold."
tags: ["npc", "shacklands", "tamadrez", "slavewatch"]
aliases: ["the Lamp in the Pass"]
relations:
  - { rel: polity, kind: rivalOf, target: "person-kassander-volso", note: "serves under Volso while quietly sabotaging the trade the fortress profits from; the Tribune does not yet know" }
  - { rel: polity, kind: allyOf, target: "faction-the-moon-road", note: "Slavewatch inside man; routes patrols away from crossings, feeds the Road the fortress schedule" }
---
Renzo is a lieutenant of the Slavewatch garrison, which makes him, on paper, one more soldier in the most corrupt posting in the central Freedom Mountains. He signs the manifests. He routes the patrols. He draws his share of the comfort fund like everyone else, because a man who refused it would be noticed, and Renzo cannot afford to be noticed. What the paperwork does not show is that his patrols are never quite where they are written to be, and that the passes he is sent to close keep coming up empty.

He runs rescues from inside the fortress that exists to prevent them. When a group moves through his stretch of the mountains, Renzo's patrol is somewhere else, not because a village paid for the absence but because he arranged it himself and forged the record to match. He knows the inspection schedule because he helps write it. He knows which captains have been warned because he sits in the room. Everything Slavewatch sells to the slavers, Renzo quietly hands to the people the slavers are hunting. He has done it for years, and the genius of it is that a fortress already this crooked cannot easily tell deliberate sabotage from ordinary graft. His missing patrols look exactly like everyone else's missing patrols.

> Every other man here sells the dark to whoever pays most. I give it away. And because this place is what it is, nobody can tell the difference. That is the only reason I am still breathing.
> — Renzo, to a conductor he has never named to anyone

He works with the Moon Road, the Drasnian escape network that runs its people through the Moon Wilds where Gorath will not follow. Renzo is its inside man at Slavewatch: he routes the garrison away from the Road's crossings and feeds its conductors the fortress's own schedule, the docking warnings and patrol rotations that Helmo's ledger sets in motion. He has never met most of the people he saves and never will. To them he is a rumor, a reason a pass was clear on a night it should not have been, the lamp that was somehow lit.

The danger he lives with is not the empire. It is Tribune Volso, who has not yet noticed that one of his lieutenants is bleeding the trade he runs. When Volso does notice, it will not register as betrayal or principle. It will register as an accounting error, a column that never balanced, and Volso will close it the way he closes any bad debt. Renzo knows this. He keeps emptying the passes anyway.

<!-- author-notes -->
PROVISIONAL coined Gorathi name flagged for Silas: "Renzo" (mononym; underground epithet "the Lamp in the Pass" used only by those he saves). grep zero hits before this file. Iberian/Latinate register.

Role per plan §2/§3 W4: Slavewatch lieutenant running quiet rescues = the grounded INVERSION of "Slavewatch is rotten" (the principled exception inside it). PROSE two-way with faction-the-moon-road; W6a adds the backlink naming Renzo as the Road's inside man (plan §4).

Edges authored:
- rivalOf → person-kassander-volso (I create that file this task; should apply).
- allyOf → faction-the-moon-road (W6 creates that file in parallel; if not_found at edge-add, this is a DEFERRED edge).
