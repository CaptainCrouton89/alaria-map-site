---
id: "faction-the-ivory-hand"
name: "The Ivory Hand"
entityType: faction
blurb: "A hidden cabal that keeps the slave-sacrifice trade moving worldwide, because a life taken in blood yields Deoric power that years of prayer cannot match."
tags: ["faction", "cabal", "slavery", "deoric"]
sources:
  - "nations_and_powers/factions/The_Ivory_Hand.md"
relations:
  - { rel: polity, kind: allyOf, target: "3703", note: "Bonnetaz buys its slaves through the Hand, which keeps permanent representatives in the city; several of the Council's merchant-lords are members. A commercial alliance, not a sworn one — the Kuzagt would disown it the day it cost them more than it paid." }
  - { rel: polity, kind: allyOf, target: "manual-mpjrcf71-gtrw6", note: "The queen of Sylke is a member; the Hand operates from inside her court rather than beside it. Sylke's reputation as the opaque, hard-to-read Ofrenian kingdom is partly the work of a captured crown." }
review:
  aiWritten: false
  action: keep
---
The Ivory Hand is an order built around a single piece of arithmetic. Deoric magic is paid for in life, and there are two ways to pay. A daemon can be fed slowly, prayer by prayer, a tithe of life pooled over years into a reserve that a working then draws down. Or a life can be taken all at once, in blood, and yield a lump sum no amount of patient devotion matches in the same span. The Hand exists to move the bodies that make the second method possible. It buys, sells, and ships human beings to be killed where a Deoric working needs them, and it has made itself the quiet machinery beneath that trade across the world.

It does not announce itself, and that is the whole of its strategy. A faction with a name and a seat can be taxed, excommunicated, or besieged. The Hand has none of these. It places its people inside institutions that do operate in the open and steers them from within, never holding a title anyone could strip. Its membership reaches into a queen's court, into the merchant houses of a salt-city, into the confidence of dragons. No one elected it. No army can march on a thing whose borders it cannot find.

### The supply chain

The Hand did not invent slavery and does not run the camps. It captured the part in between. The Kuzagt of Bonnetaz hold the largest slaughter-economy on their continent and consider acquisition beneath them, so they buy through intermediaries, and the Hand made itself the intermediary that mattered. Its representatives sit permanently in the city, handling the logistics the Council prefers not to see, and several of those merchant-lords now carry the Hand's membership themselves. The same pattern repeats wherever Deoric workings run hot enough to need a steady supply of the condemned.

What holds the order together is not a creed. The Hand worships nothing. It is ecumenical in the cold sense, serving any buyer whose working requires a life and whose silence can be bought, and it keeps no loyalty to the daemons its trade feeds. This is the source of its reach. A cult can be opposed by another cult. A merchant who will sell to all sides equally is harder to corner, because everyone who buys from him has a reason to keep him alive.

### The volume question

The Hand survives by being invisible, and the thing that most threatens its invisibility is its own success. The order does not agree with itself about how large the trade should grow.

One wing is the merchant side, loudest in Bonnetaz, and the dragons who want particular workings done at a scale that ordinary supply cannot feed. A major Deoric working swallows lives the way a minor one swallows a single death, and the buyers who can pay for that kind of power are asking for volume the present trade cannot quietly move. To meet the order, the Hand would have to industrialize: more camps, more ships, more bodies crossing more borders, until the trade is too large to hide. The argument is that the profit and the leverage are worth the exposure.

The other wing is the courtly side, the members seated inside thrones and councils, and the queen of Sylke is its clearest voice. Their power is precisely their concealment. The moment the trade becomes visible enough to name, the courts they have captured will have to disown them to survive, and a hand no one can see becomes a hand on a block. They argue that the order's only real asset is that no one believes it exists, and that the first large, loud working that traces back to the Hand ends it.

Neither wing has won. A buyer has come forward wanting a working large enough to force the question, and the order is deciding, slowly and in rooms with no names on the doors, whether to fill it. The decision is the lever: whoever the Hand sides with, the losing wing has every reason to expose the other.

<!-- author-notes -->
- Edges authored here (one direction, target = resolved id): polity/allyOf → 3703 (Bonnetaz, city) and polity/allyOf → manual-mpjrcf71-gtrw6 (Sylke, kingdom-region). Both are commercial/infiltration ties, not sworn alliances — nuance carried in the edge notes per entity-relations ("nuance lives in note, never a new kind"). Precedent for a polity edge to a kingdom-region: faction-the-concordance protects → 322 (Sestros).
- The "Sylke queen" is unnamed in canon (ofrenia-sylke.md names no monarch; the Ofrenian sibling-rulers Alisandra/Edric are Tornia/Joswik, not Sylke). Did NOT invent a person entity for her — edge points at the kingdom, membership carried in prose. If a named Sylke queen is ever authored, repoint the edge to the person via ruledBy-adjacent modeling.
- The "dragons" are unnamed in source (overview-factions: "the confidence of dragons"). No dragon entity is specifically identified as a member, so no edge — kept in prose only. If a specific dragon is later named to the Hand, author the edge then.
- Alarian lever = the blood-sacrifice arbitrage on Deoric's life-cost (world-systems-invariants Magic + Daemons rows; daemon-economics.md Calibration-A: blood sacrifice ≈ 40–50 HP/life lump sum vs prayer ε ≈ 0.1 HP/prayer trickle; a major miracle ≈ 89 HP). Figures kept out of player-facing prose and rendered as texture per the daemon-economics "render as texture" instruction (same handling as overview-factions).
- Live lever (faction-rule unresolved question): expand-the-trade (Bonnetaz merchants + dragons, want volume for a large working) vs keep-it-quiet (courtly infiltrators incl. the Sylke queen, know visibility = death). Triggered by a specific large buyer. Unresolved by design; whoever loses can expose the winner. Lore-complication move: rule = the Hand survives by invisibility; inversion = a powerful wing wants to go loud.
- Source facts built on: faction file (Sylke queen / Bonnetaz merchants / dragons; slave-sacrifice purpose), bonnetaz.md (Ivory Hand merchant network, permanent reps, member merchant-lords, Kuzagt buy-through-intermediaries), overview-factions.md (the cabal essay + illustration).
