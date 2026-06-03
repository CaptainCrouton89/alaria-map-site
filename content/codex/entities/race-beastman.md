---
id: "race-beastman"
name: "Beastman"
entityType: race
entityCategory: race
blurb: "Gaea's minor animal-children: dozens of distinct animal-shaped peoples, all made at the Birth of Man and scattered too widely for the Shattering to find."
tags: ["beastman", "gaea-flesh", "playable"]
relations:
  - { rel: origin, kind: createdBy, target: "person-gaea" }
sources:
  - "races/Beastman.md"
review:
  aiWritten: false
  action: keep
---
Beastmen are Gaea's minor animal-children. She shaped them in the likeness of one animal or another, gave each a person's hands and a person's mind, and turned them loose across Alaria. There are dozens of kinds, and they share almost nothing except where they came from. A bull-headed minotaur of the war-camps and a frog-small bogy of the southern marsh would not take each other for kin, but kin they are. Both were made in the same brief season of Gaea's work, and both hold the same rank in her order, well beneath the sacred three who were her true sons. The beastmen are the lesser making, and there are very many of them.

### The making

Beastmen date to the Birth of Man, roughly five hundred thousand years ago. This was the last great work of the Gaeaic Eon. Gaea had already spent millions of years filling Alaria with beasts, and now, near the end of her making, she took the shapes of those beasts and built peoples out of them. The beastmen came first, a little ahead of the first humans, and then she made humanity and went quiet.

Each kind of beastman is its own making, not a branch off some first beastman stock. Gaea did not shape one animal-person and let the rest descend from it. She made the shark-folk and the rat-folk and the horse-tall centaurs as separate works, each with its own true name and its own fixed nature. A true name does not drift. A shark-person is what it was the day Gaea named it and has never been on its way to becoming anything else. This is why there is no family tree to draw among the beastmen, only a long list of small, deliberate acts that all fall inside the same age.

### Flesh and kin

Beastmen are flesh. Gaea drew them out of her own substance through Kethic, the same way she made humans, giants, and trolls, and those four lines can interbreed because their bodies recognize one another at the level of what they are made from. A human and a beastman can have children together. The druid-crafted elves, shaped from wood and stone and river-mud rather than flesh, cannot cross with any of them.

The sacred three stand apart from all of this. Ulvma, Shara Bolasi, and Nagatayora were Gaea's sons, made with her full intent, and the Ulvsjael, Sharabha, and Naga who descend from them rose from a different cause entirely. A beastman is not of that line. When the histories speak of Gaea's animal-children in the small, scattered, ordinary sense, they mean the beastmen.

### Surviving the Shattering

When Hykravones the Gray Prince returned and began taking Alaria apart, he went after the great things first. The cities, the named powers, the gathered armies, the daemons with worshippers enough to be worth silencing. The beastmen were none of these. By their nature they were already scattered, each kind holding to the country its body had been made for: shark-folk in the reefs, frog-folk in the marshes, rat-folk in the under-streets of cities that were themselves being pulled down over their heads. They were too small to bother with one at a time and too widely spread to gather up and break together.

So most of them simply were not where the breaking happened. A few beastman clans stood with Gaea's children at the Last Line and died with them, and their names are kept in the histories of the peoples they died beside. The rest were down in the reeds and the reefs and the deep wood for the whole year the world ended, beneath the threshold of what the Gray Prince thought worth his notice. When he finally stopped, having broken everything that looked worth breaking, the beastmen were still there. Thinned and frightened, but not gone.

> The great ones stood up to be counted, and the counting was the end of them. We stayed down in the wet grass and let it pass over.
> — a saying repeated, in one form or another, across many beastman tongues

This is why animal-folk turn up today in every wild corner of Alaria, in more kinds and greater numbers than any account of their origin would lead you to expect. Each kind came through the Shattering the same way, by being beneath notice, and each kept to the same country afterward. The marsh that hid the frog-folk is still full of frog-folk. By and large, the country that saved each kind is the country it still lives in.

<!-- author-notes -->
ANCHOR ENTITY (Stage S2). This file establishes the shared origin scaffold that ALL beastfolk / animal-folk entities inherit; later stages must NOT re-derive these facts:
- ONE date for every beastman kind: the Birth of Man, ~500,000 ya (races.md trimmed timeline; person-gaea). Individual beastfolk differ by pattern + narrative reason, NOT by date or animal (problem.md principle 6).
- DISCRETE CREATION, no drift: each kind is a separate Kethic act with its own fixed true name (Deoric-fixity, races.md). Banned downstream: "evolved/adapted/slowly altered." Known existing violations to fix when those entities are authored: kendor ("evolved from seahorses"), greater/lesser satyr, ixmeglyakuk (survey-master §5).
- ONE shared Shattering-survival mechanism: survival-by-dispersal beneath the Gray Prince's notice. Scattered animal-folk kept to their niche, too small/too spread to be worth breaking; a few clans died at the Last Line. Coheres with era-hykravones ("when there was little left worth breaking, the Gray Prince stopped"). Dozens of animal-folk inherit this instead of each inventing a survival.
- Flesh-family interbreeding (human/beastman/giant/troll) + no-half-elves stated per races.md invariant.
DEFERRED (do not resolve here): beastman×beastman (cross-kind) interbreeding is unaddressed canon — leave open. Per-kind story-patterns + "why this shape" are assigned in S4/S5, not here.
EDGES: createdBy → person-gaea is the single authored direction (Gaea has no sourceOf→race-beastman, so no both-ends-directed conflict). No subraceOf edges wired in or out — the beastfolk bases (minotaur, satyr, koren, centaur, lizardfolk, kendor) and standalone animal-folk do NOT yet declare subraceOf race-beastman; wiring that tree is a later stage's job, not this one.
sources path "races/Beastman.md" is nominal (matches template convention); no such source file exists — this is newly authored, not surfaced.
