---
id: "faction-the-unburied"
name: "The Unburied"
entityType: faction
blurb: "A hidden Avalon network that intercepts null-Declared children and moves them out of their districts before their families grieve and let them go."
tags: ["faction", "network", "temptari", "avalon", "time-magic", "hidden"]
relations:
  - { rel: culture, kind: originatedIn, target: "18", note: "an Avalon network working against the null-Declaration verdict" }
  - { rel: polity, kind: rivalOf, target: "person-maurolin", note: "hides null-Declared children from the verdict; has found the Ecclesiarch watches some of them without ever moving against them" }
review:
  aiWritten: false
  action: keep
---
Avalon teaches that the Declaration is final and that the null Declaration is the most final of all. A child the priest reads and finds no future in is a child the world has already closed its hand around, and the families of such children do not raise them. They grieve early and let them go. Almost all of them do. The Unburied are the rest: a thin, deniable network of the people who happen to stand between a null verdict and the grave it is supposed to lead to, and who have decided, quietly and at considerable risk, to put the child somewhere else instead.

They are not many and they are not organized the way a real order is. A midwife who was in the room when the verdict came. An aunt three districts over with no children of her own and no questions. A carter who will take a small passenger north and not remember the face. The work is one handoff at a time, child to district to ordinary name, until a girl read as futureless in one valley is somebody's quiet niece in another, and the rolls of the first valley record her grieved and gone.

### Why they do it

It would be tidy to say the Unburied are heretics who have seen through the Ecclesiarch's sight, but that is not what they are. They do not argue with the rolls. Most of them believe in the Declaration as firmly as anyone in Avalon, which is what makes the thing they do so hard for them. The reason is plainer than doctrine and worse. A null-Declared child, set beside any other eight-year-old, is a healthy child, and the people who started the Unburied could not lay a healthy child in the ground because a priest had read nothing where a life should be.

> Iselma had caught two hundred children before the Declaration that broke her, and she had walked away from the ones the priest read empty the way everyone walked away, because that was the rite and she was a faithful woman. The two hundred-and-first was a boy who gripped her finger and would not let it go. She told his mother the child had been born sleeping. Then she carried him out of the district inside a basket of birthing linens and gave him to a cousin who asked nothing. She did it eleven more times before she died, and she never once decided it was right. She only decided she would rather be damned than do the other thing.

That is the whole of the founding, as the network tells it among itself. There was no manifesto. There was a midwife who reached a private floor she could not go below, and then there were others who had reached the same floor, and they found each other the way people who share a secret eventually do.

### What it costs

The Unburied are better at the taking than at the keeping. A child moved in a linen basket still has to survive a strange district, a winter, an illness, a household that may lose its nerve. Some are found. Some are given back, years on, by families who cannot carry the lie any further and turn the child over to a priest with their grief finally spent. The network loses people to fear and to conscience in roughly equal measure, and it argues with itself, in the careful way of people who can never meet in numbers, about whether it has saved anyone at all or only stretched out a sentence. No one in the Unburied can point to a child they carried out who is certainly grown and certainly safe. They keep doing it anyway. The alternative is the basket of linens, and they have all already decided how they feel about that.

### The watching

There is one thing the network cannot explain, and it is the thing that has begun to change what the Unburied think they are doing. Some of the children they hide are watched.

Not hunted. Watched. A particular attention settles on a hidden child now and then, quiet and patient and reaching from somewhere with the Ecclesiarch's own range, and then nothing comes of it. No constables arrive. No verdict is corrected. The child goes on being somebody's niece, observed and untouched, and the watcher never closes the distance. The Unburied noticed the pattern slowly, because each instance looks like nothing, and they do not agree on what it means. Some hold that they are tolerated, that someone high in Tarolin has quietly decided the loss of a few null-Declared children is not worth the correcting. Some hold that they are being counted, that every child they think they have saved is a name in a ledger they cannot see, kept for a reckoning that has not come. They cannot tell the difference from where they stand, and the not-knowing sits worse with them than a purge would. A purge they would understand. This they cannot read at all.

<!-- author-notes -->
- Wave-2 brief Writer B. Names Avalon's hidden counter-network — the grounded inversion of "the Declaration is final and total" (avalon.md "The null Declaration" section). Slug `faction-the-unburied` coined + collision-checked clean (grep -rli "unburied" → none).
- Coined name Iselma (Romance/Temptari register, onomastics-human.md Family 1; collision-clean). Named founding figure for grounding per lore-complication; no scholar-attribution (the inset is a scene, not an attributed interpretive claim).
- HARD CONSTRAINTS respected: the Unburied do NOT know about Tamari (person-tamari) — Doremin's forgery is a separate, private one-off, unconnected to this network's smuggling method. They do NOT resolve the Doremin/Maurolin standoff. Their existence explains how the null verdict occasionally fails WITHOUT touching that thread.
- CANON GUARD: avalon.md states "no record of a null-Declared child living to adulthood" and frames Tamari as "one now." Preserved deliberately — the Unburied keep children OFF the rolls (so no record), and the body asserts the network cannot point to any child certainly grown and safe (mostly-failure; "complicate, don't delete"). Tamari remains the one CONFIRMED, leverage-backed, sight-cracking survivor; the Unburied's saves are unconfirmed and unknown to the state. No collision.
- MYSTERY-HAS-ANSWER (the watching): the GM-knowable cause is Maurolin's sight. A null-Declared child is one whose future he genuinely cannot read; he cannot foresee the outcome of acting against a blind spot, and he acts only on foreseen outcomes. So he watches and does not move. This is the general blind-spot mechanism, distinct from (and not resolving) the Tamari/Doremin case, where the future was forged over and Doremin holds the proof. Whether EVERY null is a sight-blind-spot rather than a doomed child is the larger mystery (avalon.md / person-tamari) — deliberately left unresolved; the body does not assert it.
- Edges (both authored here, smaller/more-specific end): culture/originatedIn → "18" (Avalon); polity/rivalOf → "person-maurolin" (rivalOf + note carries the watching nuance, per entity-relations "complicated stance = rivalOf + note"). Prose backlinks: avalon.md (null section) + additive sentence in person-maurolin.md. NOT linked to faction-solum-impervium by design — neither network knows the other is organized.
