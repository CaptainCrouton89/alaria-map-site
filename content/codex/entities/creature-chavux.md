---
id: "creature-chavux"
name: "Chavux"
entityType: creature
blurb: "A wild green dragon lairing in the Blades, raiding Adron's strait shipping, untouchable because no Naga of Adron will kill a dragon."
tags: ["monster", "dragon", "green"]
sources:
  - "bestiary/dragons/Chavux.md"
relations:
  - { rel: history, kind: participatedIn, target: "event-return-of-dragons" }
review:
  aiWritten: false
  action: keep
---
Chavux is a green dragon who lairs among the northern islands of the Blades and preys on the shipping that threads the strait beneath them. He is cruel in the ordinary way of green dragons, and poison is the whole of his craft: a breath that fouls the air over a deck and a bite that festers in whatever it does not kill outright. He is not large as dragons go, not yet. But he is old enough to have stopped fearing anything, and young enough to still find the work amusing, and the two together make him worse year on year.

Like every dragon of the present world he traces to Nagayeshi, the hatch-ground at the eye of Oblivion, and like the rest of his kind he left it grown and went out into Alaria to do as he pleased. He came to Adron's waters in the Return of Dragons, the long re-emergence that carried wild dragons back across the sea after an age in which their kind had dwindled to almost nothing. Most of the returnees wandered on. Chavux found the Blades and the strait beneath them, found that the ships came through whether he troubled them or not, and stayed.

### The strait

The channel below the Blades is the southwest approach to Greyport and the shipyards of Shipmarsh, and Chavux has made it his table. He does not hold the islands as a territory to rule, and he demands no tribute. He simply takes what passes when the mood is on him. A hull he wants is a hull he poisons and picks apart at his leisure; one he does not want he lets through, for reasons that are his own and probably amount to nothing. The raids come more often than they used to. The merchants read that as appetite. It is closer to boredom.

### Untouchable

No Naga in Adron will kill a dragon. The kingdom holds all dragonkind in trust to Nagatayora, the dragon-father whose blood every Naga carries, and the trust cuts both ways: it won Adron its bonded war-dragons in the age of the Wyrmward, and it forbids a Naga hand against even a wild beast like Chavux, who was never bonded and is wanted by no one. So Adron suffers him, exactly as it suffered the loss of the dragons it loved. That leaves the question of what else Adron might do, and the answers all run out before they arrive anywhere.

If anyone has a claim on him, it is Eyatora, the dragon-father's eldest living child, who keeps the hatch-ground and raises every clutch the island's fire brings up. If every dragon of the present world began on Nagayeshi, as the Naga hold, then Chavux began there too, and Eyatora reared him before he ever saw the open sea. None of which gives her a lever. A grown dragon is no one's to command, not even hers; she blesses bonds and judges riders, she does not order dragons about, and she owes Adron nothing in any case. Whether she would so much as hear a petition over one of her own, no one in Adron can say, because no Nagashi has crossed Oblivion to ask her anything since the Severing cut the last of the bonds. The road to the one being who might move Chavux runs through a storm Adron no longer sails.

And the trust binds the Naga, not the world. The merchant houses of Greyport and Shipmarsh are bound by Adron's law and by their own ledgers, but not by a blood-debt to a dead god, and they would pay a great deal to see the dragon quietly killed by hands that are not Naga. A foreign sellsword under no such prohibition could in principle do what no subject of Adron will. What no one has tested is what the kingdom would do afterward: whether the trust asks only that a Naga keep his own hands clean, or whether it asks Adron to avenge a dragon killed in its strait by anyone at all. The houses that would hire the blade do not know the answer. Neither does the throne. That uncertainty is the only thing that has kept the strait's problem unsolved this long.

### Hooks

- The purse. The merchant houses of Greyport and Shipmarsh have pooled a standing bounty for outsiders willing to kill Chavux. Collecting it means surviving the dragon and then learning, the hard way, what Adron does to a dragon-slayer in its own water.
- The petition. Someone proposes crossing Oblivion to ask Eyatora to call off one of her own. Reaching her through the storm is a Naga's problem; persuading a dragon who owes Adron nothing is everyone's.
- The appetite. The raids are escalating. A green dragon old enough to stop being amused is a green dragon casting about for larger game, and the Shipmarsh yards sit a short flight up the coast.

<!-- mechanics -->

Run Chavux on the Dragons statblock, one size below the baseline; he is not yet full-grown. His breath is poison rather than fire or acid: a cloud that settles over a ship's deck and keeps doing damage for several rounds instead of a single blast, and it does not disperse on its own in still air. A bite that does not kill leaves a festering wound (recurring poison damage until treated).

<!-- author-notes -->
W-chavux writer, dragon-canon mini-wave (D1). Rewrote the "Green dragon." stub into the real wild-dragon entity per the authoring contract.

CROSS-WRITER DEPENDENCY: relations carries history/participatedIn -> event-return-of-dragons. That target entity is authored THIS WAVE by the W-return writer using the exact id `event-return-of-dragons`. Both files exist by validation time, so the edge is not dangling. Do not rename.

LORE-COMPLICATION applied on the sacrosanct rule (the cluster's load-bearing lever): the rule = no Naga of Adron will kill a dragon, so Chavux is untouchable. Two grounded, named inversions, both left unresolved:
  (1) Eyatora MIGHT have a claim on him as one of her hatched (B1 universal-hatch-ground consequence), but a grown dragon answers to no one, not even her; she blesses bonds and does not compel dragons (creature-eyatora.md / middle-sea.md:64), she owes Adron nothing, and Adron has not crossed Oblivion to petition her since the Severing. The path exists and is blocked by Adron's own estrangement from the hatch-ground.
  (2) The trust binds the NAGA, not foreigners. Greyport/Shipmarsh merchants would pay an outsider to kill him. The open question (left untested in-world): does the trust merely forbid Naga hands, or oblige Adron to avenge any dragon killed in its strait? Nobody knows; that is the lock on the bounty.

CANON GUARDS:
  - NO worships edge to creature-nagatayora (AD13). Reverence/trust is PROSE ONLY.
  - Adron FROZEN: adron.md referenced in prose only, never edited. adron.md:31 already names Chavux ("Chavux can raid the strait off the Blades and Adron will not lift a hand against him") — this entity builds on that framing, does not contradict it.
  - Nagayeshi origin leans on existing locked canon (middle-sea.md:64 "the hatching ground of dragons since before the Naga") and the wave's B1 pick, framed "as the Naga hold" rather than as certain genealogy — no one in Adron actually knows Chavux's hatching.
  - Return of Dragons framed as re-emergence after marginalization (8,104 BSD, Great Expansion), NOT a new origin; consistent with the W-return event and adron.md's "wandered back across the sea since the Return."
  - Green = cruel/poisonous per the dragon type canon (creature-dragons.md). Poison breath, not fire/acid.

FLAG FOR ORCHESTRATOR (pre-existing, NOT introduced by me, outside my ownership): a SECOND "Chavux" entity exists — chavux.md (id "482", entityType poi), a pinned territory POI within the Blades (416). I did not touch it (not in my file ownership). The two are not in conflict (bestiary creature vs pinned lair-POI), but if the orchestrator wants a single canonical Chavux it may want to reconcile them in a later pass. the-blades.md's inhabitedBy edge points at THIS creature entity (creature-chavux); the POI keeps its within->416.

No new coined names — every proper noun (Chavux, the Blades, Greyport, Shipmarsh, Nagayeshi, Eyatora, Nagatayora, Oblivion, Adron) pre-exists.
