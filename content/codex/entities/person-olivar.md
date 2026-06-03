---
id: "person-olivar"
name: "Olivar"
entityType: person
blurb: "A Gorathi war-chaplain tranced in the Moon Wilds years ago and never consumed, now the living heart of the one Vexling brood that does not kill."
aliases: ["the mercy-priest", "Olivar of the Wilds"]
tags: ["moon-wilds", "gorath", "war-church", "npc"]
relations:
  - { rel: polity, kind: memberOf, target: "faction-iron-of-the-eternal-march", when: "before his trance", note: "legion war-chaplain lost to the Moon Wilds during the Drauso campaign" }
---
Olivar went into the Moon Wilds as an instrument of the Iron of the Eternal March and never came out as one. He was a legion war-chaplain attached to General Drauso's campaign, one of the men whose job was to walk the line before a fight and remind the legionaries that the empire's advance was the hammer-stroke made flesh and that the enemy in front of them existed to be broken. He blessed the march into the Wilds the way he had blessed a dozen marches before it. Somewhere west of the Myublin, the Vexlings took him.

By every rule of the place he should be dead, or worse, led off silver-eyed into the dark and never seen again. He was not. The brood that tranced him kept him, and around him it changed. Where another brood runs down the lost and the fleeing, Olivar's brood watches them, escorts them, and lets them go. Refugees who have crossed that stretch of jungle on the Moon Road describe a man at the center of a ring of the things, half-present, slow to speak, and the creatures arranged around him not as a guard exactly but the way iron filings arrange around a lodestone.

What he is now is hard to fix. He is not the hive's prisoner and not its master. He is some third thing the Vexlings have no other example of and Gorath has no word for. He remembers his name and the litany he used to recite and very little else he can put in order. Pressed on what happened to him, he says only that he stopped being afraid, and that the fear has not come back, and that this is not the comfort it sounds like.

> I was sent to teach men that the Wilds were a thing to be conquered. I learned the Wilds first. There is no contradiction in me, traveler. There is only what I know now that I did not know then.
> — attributed to Olivar, as carried out by a Moon Road conductor

He is the rarest thing in the Moon Wilds: proof that a Vexling brood can be turned, and proof of exactly how little that is worth. The mercy-brood is hunted. The hive treats it as an aberration and other broods press it constantly, and the Wilds-guides of the Moon Road who route their people past Olivar know they are spending a resource that is being killed by inches. No one knows what becomes of the road through the Wilds when the mercy-brood is finally run down, and no one has found a way to keep it from happening.

For Gorath he is a deeper problem than a lost chaplain. Olivar was a sworn voice of the war-church, and the war-church does not admit that the Wilds can do to a man what they did to him. The Iron of the Eternal March remembers him, when it remembers him at all, as a casualty. It has every reason not to learn what he became.

<!-- author-notes -->
Name "Olivar" — PROVISIONAL (Gorathi register: Iberian/Latinate, soft V-onset, -ar ending per the Veramus/Veryx precedent in authoring-plan §2). grep -rliE "\bOlivar\b" across content/codex/entities/ + docs/worldbuilding/ = 0 hits before authoring. Silas may rename.

Inversion (lore-complication / authoring-plan §3 item 2): "Vexlings are mindless killers" → the mercy-brood, grounded in a named, hunted, costly figure. Partially answers "where do the tranced go" while preserving the larger mystery (the brood kept and changed around a hostage; the mechanism is not explained).

Edges — DEFERRED (target not yet on disk; W3 creates it):
  source: person-olivar | rel: polity | kind: memberOf | target: faction-iron-of-the-eternal-march | when: "before his trance" | note: "legion war-chaplain lost to the Moon Wilds during the Drauso campaign"
person entities take NO within and NO originatedIn (authoring-plan §2 navigability rule). The single anchor edge above is the deferred memberOf.

§4 reciprocal: W3 (faction-iron-of-the-eternal-march) adds the prose backlink "the chaplain lost to the Wilds." Two-way prose with creature-vexlings (the mercy-brood) authored both directions in-cluster. Olivar references Drauso's campaign (person-drauso, W2) and the Moon Road (faction-the-moon-road, W6) by name in prose only.
