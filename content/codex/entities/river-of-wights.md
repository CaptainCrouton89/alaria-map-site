---
id: "2441"
name: "River of Wights"
entityType: water
blurb: "A Crimson Coast river where the violently dead rise as wights, with no necromancer to raise them."
coordinates: [303, 545]
zoomLevel: 4
tags: ["river", "geography"]
sources: ["all_sections_formatted/Aboyinzu.md#L8820"]
relations:
  - { rel: spatial, kind: within, target: "2368" }
---
The River of Wights runs down out of the northwestern highlands of the Crimson Coast, feeds the Pools of Tragedy on its way, and empties south into the Void. It earns its name in the dark. The upper reaches are genuinely haunted, bodies dropped into the water do not always stay down, and the fishers along its lower stretches learn early which bends to leave alone after sunset.

Everywhere else, raising the dead takes a caster. It takes a necromancer paying in Deoric and in life to hold a shadow knotted to the corpse it should have left. Here it takes nothing. The current of the First Dark, which drains released shadows down to Malstaris, runs slow over this riverbed, so the shadows of the violently dead are not pulled away. They linger in the water and catch on whatever is near. Where that is a corpse, the shadow knots back into it and the body rises on its own. The dead that rise this way are wights: they keep the cunning and the spite of the people they were, without keeping the mind. No one made them. No one owns them, and no one can call them off.

What feeds the river is the killing upstream. This is the southwestern country of an old Winter Elf kingdom that broke apart in civil war, and the river holds that war's dead. The blood runs back to the murder of King Istor XXVI and the fight over his throne between his daughter Lamenrae and his uncle Taoinor, the quarrel that split the realm into Klevnaf and Istora. Each half blames the other for the king's death. The water keeps no opinion on the matter. It keeps the dead.

> Two stretches you can fish. The middle reach by the falls, and the mouth where it meets the Void, and even the mouth I'd not work past dusk. Everything between, you leave to them. My grandfather lost a brother pulling a net up there. Brought up more than the net.
> — a fisher of the lower River of Wights

By the time the river reaches the Pools of Tragedy its water already carries the residue of all that dying, and the pools hold it the way a still basin holds silt. Downstream of the pools the haunting thins but never fully clears, which is why the lower river is fished at all, and why it is fished carefully.

<!-- author-notes -->
Caster-free pooling is canon per creature-undead.md:17 ("where the First Dark that drains shadows into Malstaris runs slow, the dead pool and stand on their own. The River of Wights is one such place") and the same effect a Shadowrift (event-shadowrift) produces at scale. The First Dark is the draining current (plane-malstaris.md:26-33). No Deoric cost for the natural rising — explicitly stated, since the whole point is that no caster is needed.

Wights hold SHADOW, never spirit (creature-undead.md:23; plane-life-and-death taxonomy). "Wights" named one-way in prose only — creature-wights.md is being CREATED by a parallel writer this wave; not edited here. The wights file owes the reciprocal reference to this river as the caster-free pool (per undead sub-plan §2.1/§2.7).

Historical cause matches aboyinzu.md:62 and crimson-coast.md:42,52,78-80 exactly (Istor XXVI's murder; Lamenrae vs Taoinor; split into Klevnaf/Istora; killer's identity left open per the mysteries rule — each faction blames the other; GM-knowable cause is human-scale shadow-residue of the violently dead, not a primordial curse, per crimson-coast.md:65-72 author-notes). Container war context kept to a brief orienting paragraph; full context lives in crimson-coast (id 2368).

Geography matches crimson-coast.md:42,78-84: flows from northwestern highlands, feeds the Pools of Tragedy (id 2440), empties into the Void; upper reaches haunted, bodies don't stay down, fishers avoid stretches after dark.

Edges authored on this file: spatial/within → 2368 (Crimson Coast) — the de-orphan fix; river had no prior within edge, so no rm needed. id stays 2441 (immutable). Pools of Tragedy (2440) named in prose only — no borders edge authored (not instructed for this task; pools-of-tragedy.md back-ref is a later wave). crimson-coast.md:78-80 already references the river in prose, so no reverse edge.
