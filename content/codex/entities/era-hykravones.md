---
id: "era-hykravones"
name: "Hykravones, the Shattering"
entityType: era
blurb: "10,210–10,209 BSD. The Gray Prince returns from dimensional exile and dismantles Alaria; nearly every daemon and civilization is destroyed."
tags: ["history", "era"]
weight: major
atmosphere: ancient
relations:
  - { rel: history, kind: precededBy, target: "era-lost-ages" }
  - { rel: history, kind: within, target: "era-gaeaic-eon" }
sources:
  - "history_and_lore/timelines/World Timeline.md"
review:
  aiWritten: false
  action: keep
---
Hykravones, the Shattering, is the catastrophe that ended the Gaeaic Eon. It lasted a single year, 10,210 to 10,209 BSD, and in that year one returning titan undid most of what twelve million years of life had built.

### The Gray Prince returns

Hykravones is a titan, called the Gray Prince. He left Alaria long before the rest of his kind did. While his kin still walked the world, he withdrew into the space between dimensions and did not come back, and so he was already gone when the Ezz flood drove the remaining titans to madness and death. Whatever he went looking for out there, he was absent for the whole of the change.

When he returned, millions of years later, nothing he remembered was left. The titans were dead. Gaea had filled the world with her own life and her own order, and her children kept it. The Gray Prince looked at a world that had erased his, and the rage that took him did not stop. He began taking Alaria apart.

### The War Against the Gray Prince

Gaea's children led the defense, and several of the older peoples stood with them, the Vystrilik of that age among them. The daemons of Celestia helped where they could, but their help came late and came scattered. Each daemon weighed the cost of spending itself against the risk of losing its followers and its reach, and most of them hedged. By the time they understood there would be no followers left to lose, the war was already past saving.

The last stand is remembered as the Last Line. Gaea's three children fell there. Nagatayora, the First Dragon, was the first of the three to die, his body broken open above the field. Shara Bolasi, the First Lion, held his stretch of the front alone after the rank beside him broke, and was killed where he stood. Ulvma, the Wolf-mother, fought inside the mortal ranks rather than apart from them, and was the last of the three to fall. What their deaths made of the ground and the people on it belongs to the histories of the Sharabha, the Ulvsjael, and the Naga.

> The Last Line, in its final hour. The rank beside Shara Bolasi has broken and run, and the lion-father has not moved from his stretch of the front. Overhead the sky is still burning where Nagatayora came apart. Somewhere in the press behind, the wolf-mother is still fighting among the mortal ranks, the last of the three left standing. None of them will see the morning.

### What survived, and what rose

The Gray Prince won. Nearly every civilization was destroyed, and the world was thrown thousands of years back. Nearly every daemon died with its worshippers, its reach cut off at the root.

A daemon is only as alive as it is remembered. Worship is how it stays remembered: each prayer carries a little life across the boundary between planes, and that tribute both holds the daemon's name in the world and pays for everything it does. Stop the prayer and the name falls quiet; leave it quiet long enough and the daemon is forgotten, and a forgotten daemon does not come back. This is why the daemons died with their people and not apart from them. The Shattering did not have to hunt them. It only had to kill the mouths that spoke their names.

A few were not caught that way. Before their worship failed for good, they spent what life they had left to set their name into something that would go on being remembered with no congregation to tend it. The only tool that fixes a name is Deoric, the command-tongue that sets what a thing is, and the surest vessel is something a people keeps alive for its own sake. Aelwennar set his name into the Long-Song, the memory-tradition the elves recite to stay themselves, so that every recitation speaks him whether or not anyone means it as prayer. Eluvarin Aelweir set his into the First Grove and the rite of laying the elven dead beneath its trees. Both came through the Shattering by this means, dormant and remembered rather than worshipped, and both became patrons of the Druids. It is a thin kind of survival, but it is survival, and it is more than the rest of their kind were left.

The same working has a rarer and far costlier form, because a name can be set into a people instead of a song. This is how peoples are made at all: Gaea defined her children and the Druids defined the elves, each by writing a true name into living matter so that what was written bred true and could not drift. A daemon who held that grammar, and enough life to spend, could write its own name into the definition of a new people, so that they carried it not in a song they might stop singing but in the plain fact of what they were. Such a people does not worship the daemon folded into it and keeps no rite for it, because the remembering is done by being born; the descent runs from the form the daemon defined, never from the spirit behind it, so a child inherits a people, not a ghost. The working cost more life than most daemons ever held, enough that it nearly ended the one who attempted it, and the new people were what caught them as they fell. It was done a handful of times before the grammar for it was all but lost, most of its holders dying in the same war that called for it. Which of today's peoples were made this way is written down nowhere, and not because the record is coy: a daemon set in a song leaves a song to point at, but a daemon set in a bloodline leaves only a people who look like any other and answer to nothing else. The working hides its own results.

A second inheritance came up out of the battlefield itself. From the blood and soil of Gaea's fallen children rose three peoples: the Sharabha from the lion, the Ulvsjael from the wolf, the Naga from the dragon. Each keeps its own account of how it began, and each of those accounts begins at the Last Line.

### The dormancy

When there was little left worth breaking, the Gray Prince stopped. He did not die, and nothing drove him off. He went down into the earth and slept. The histories hold that he is still there, somewhere under Alaria, and that he will wake again to finish the work he left undone. The Elves of the Gray Order have spent the age since searching for the place he lies, certain the world is owed his return.

<!-- author-notes -->
"The Vystrilik of that age" are now reciprocated by the modern Vystrilik nation entity (manual-mpjrcf71-vystr, entityType region), which is framed as named for and claiming descent from them (see its body's third paragraph). The bare prose token "Vystrilik" auto-links to that entity via the build's name-scan; the link is therefore correct, not a collision. Humans predate the Shattering by roughly 490,000 years (person-gaea: humans ~500,000 years ago; Shattering ~13,500 years ago), so a human people standing at the Last Line is coherent.
The "Last Line" is a coined name for the climactic battle/front, consistent with the existing race prose ("held his stretch of the line alone after the rank beside him broke", race-sharabha). Descriptive, not culture-specific, so no onomastics sheet applies.
The daemon-survival passage is derived from the magic's first principles (systems/daemon-economics.md, systems/first-death.md, systems/magic.md, systems/races.md; governed by context/decision-claim2-daemon-races.md). The chain, each link a locked invariant:
1. WHAT A DAEMON IS: a spirit-strand in Celestia that persists only while its true name is remembered (first-death: "spirit → Celestia, lasts only while the true name is remembered; forgotten means it ends permanently"). Worship = prayer = a life-tithe carried across the planar boundary (rendered in lore as "a little life across the boundary," not as R/R_min/HP per the daemon-economics doc's keep-numbers-in-author-notes rule); it both holds the name remembered and funds the daemon's acts.
2. WHY THEY DIED: kill the worshippers and prayer stops, the name goes quiet, the daemon is forgotten and its Celestian strand ends. So daemons died WITH their people (consistent with the prior paragraph's "died with its worshippers, reach cut off at the root").
3. THE SURVIVAL MOVE (not "became a song" by fiat — this is the fix for the user's "doesn't make sense" objection): a daemon IS its remembered name, so survival = getting the true name remembered through a vessel needing no congregation. The only tool that fixes a true name is Deoric (magic.md: Deoric = Azus, "sets what a thing is"). So a few spent their last life to inscribe their name into a self-perpetuating cultural vessel: Aelwennar → the Long-Song (recited as elven memory, NOT worship, so it outlives worship); Eluvarin Aelweir → the First Grove + death-rite. They survive DORMANT — remembered, not fed — consistent with their own entities (daemon-aelwennar "his body is the assembly" / daemon-eluvarin "he is the First Grove").
4. THE FLESH/RACE EXTREME: species are Deoric-defined (races.md: "a true name is a definition... bred true... cannot drift" — how Gaea made her children, Druids made elves). The costliest binding writes the daemon's name into a NEW species' definition, so the people remember it by being what they are. "Daemon-descended" = Deoric-defined-by-a-daemon, NOT a spirit passing blood ("a child inherits a people, not a ghost") — satisfies the Claim-2 ban on biological spirit-descent. It costs near-fatal life (approaching world-altering scale; the working nearly ends the daemon, who is "caught" by the people it just defined), so it is the rarest lost art; grammar-holders mostly died in the war.
5. SELF-CONCEALING (replaces the old "which peoples is its own tangle" shrug): a song-bound daemon leaves a song to point at; a bloodline-bound daemon leaves only a people indistinguishable from any other. Which peoples is unrecorded as a DEFINED PROPERTY of the working, not an authorial dodge. No race named here; that selection stays the parallel racial-origins effort's job (session d5c13b10). The three peoples in the following paragraph descend from Gaea's fallen children — a separate population, kept distinct.
