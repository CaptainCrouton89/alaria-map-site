---
id: "person-idaro"
name: "Idaro"
entityType: person
blurb: "Head of the cartel that feeds and arms Gorath's legions. He fixes the price of war by choosing what crosses the Divinity Passage."
aliases: ["the Dry Granary"]
tags: ["financier", "merchant", "npc"]
relations:
  - { rel: polity, kind: allyOf, target: "person-esmeraz", note: "war-economy financier aligned with the Praetor whose markets the campaigns feed" }
---
Idaro sells the army everything it eats and most of what it kills with. His cartel holds the standing contracts to supply the legions with grain, salt, dried meat, iron, and the ironwood that becomes shield and shaft and wagon, and almost none of it moves to the front without crossing the Divinity Passage on a hull he controls or has paid to overlook. He does not own the war. He owns the supply line, which on a long campaign turns out to be the same thing.

The cartel's profit is not in selling cheap goods to many buyers. It is in selling dear goods to a buyer who cannot say no. A legion in the field will pay whatever the price has climbed to, because the alternative is a hungry legion, and a hungry legion is how marshals lose throats. So Idaro manages the price the way a miller manages a sluice. Grain sits in his warehouses through a poor season and is released at the top of the market. Iron is held back from a frontier until the demand there is desperate. Scarcity in Gorath is rarely an accident of weather or war. More often it is a decision someone made in a ledger, and the someone is usually Idaro.

The grinding front at Nashua is the engine that makes the whole scheme run. A war that never resolves is a demand that never slackens, and Idaro has no incentive to see it end. The famines that pass through the river towns of the Jungles of Titania, the ones the priests blame on bad rains, are frequently just the downstream cost of a warehouse held shut so the army's bread would fetch its proper price. The people who starve and the soldiers who pay too much are two ends of the same balance sheet, and both ends feed the same house.

His weakness is that the trick can be played on him. Idaro times the market by controlling information about what is scarce and where, and a rival who learns the true state of his warehouses can break a corner before he closes it. He keeps his ledgers close and his factors frightened, and he stands with Esmeraz at the slave-markets, because the Praetor's treasury is the one buyer in Gorath even Idaro cannot squeeze, and a man in his position would rather have that buyer as a friend.

<!-- author-notes -->
Coined Gorathi name "Idaro" + epithet "the Dry Granary" are PROVISIONAL (no Gorathi onomastics sheet; Iberian/Latinate register per authoring-plan §2 / Veramus precedent). Grep collision check: zero hits across content/codex/entities/ + docs/worldbuilding/. Silas may rename.

Rule embodied (authoring-plan §2 W5): "scarcity is manufactured" — the river-town famines are ledger decisions, not accidents of war; Nashua's bottomless appetite is the engine. Grimness with cause/perpetrator/consequence per lore-style-guide thematic register.

Canon leaned on: gorath.md (3178) Jungles of Titania river-valley agriculture/logging, ironwood; azantir.md (3189) Esmeraz the Praetor + treasury; divinity-passage.md (3168) §The war-economy two-way anchor (names Idaro's cartel, dry warehouses, Nashua demand) + Idaro's seal on the patrol-bribe inset. Nashua referenced by name only (out-of-scope id 2921, not edited).

DEFERRED EDGE (target person-esmeraz absent on disk — owned by W2b, parallel; `edge add` → not_found): person-idaro → polity/allyOf → person-esmeraz. Orchestrator authors centrally. No frontmatter relations authored.
