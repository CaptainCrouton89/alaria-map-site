---
id: "faction-tarkhon-grain-exchange"
name: "The Tarkhon Grain Exchange"
entityType: faction
blurb: "The Tarkhon institution that grades Enymu's harvest and fixes the empire's bread price each year — a monopsony in all but the word."
aliases: ["Aldrichold"]
tags: ["faction", "trade"]
relations:
  - { rel: polity, kind: memberOf, target: "2455", note: "an organ of the Tarkhon Empire, which operates the Exchange and sets the bread price each year" }
  - { rel: economy, kind: tradesWith, target: "2484", note: "Enymu is the bound supplier; the Exchange grades and buys its bread-grain harvest at a price the empire decides" }
  - { rel: history, kind: participatedIn, target: "event-enymu-subjugation", note: "the Grain Compact founded the arrangement and still binds it" }
sources:
  - "docs/worldbuilding/systems/economy.md#The Middle Sea trade architecture"
review:
  aiWritten: true
  archetype: ai-ok
  action: keep
  notes: "Institution-as-faction, no place-furniture and no pin. Harmonizes economy.md ('licensed imperial merchants') with enymu.md ('Nektuna's merchants') as Nektunan houses licensed by the empire. Grain Compact history deferred to event-enymu-subjugation."
---
Once a year the Tarkhon Empire decides what its own bread is worth, and the Tarkhon Grain Exchange is where the decision is made. The empire is the buyer. Enymu, the farming kingdom whose lowlands grow that bread, is the seller, and it has only the one buyer to sell to. There is a word for a market with one purchaser who therefore names the price. The word is monopsony. Nobody at the Exchange uses it.

The name draws a confusion it does not deserve. Aldrichold is not Aldriktch. The Grain Exchange has nothing to do with the Aldriktch Trade Alliance, the pact among six small Middle Sea states that caps their mutual tolls, nor with the iron-denominated standard that travels under the Aldriktch name. This is one empire's apparatus for pricing one kingdom's wheat. They share a prefix and nothing else.

### Grading the crop

Every harvest, Enymu's wheat comes to the warehouse complex at Aldrichold to be weighed and graded before it is bought. The graders are not Enymese. They are merchant houses out of Nektuna, the imperial region across Enymu's western border, licensed by the empire to assay the crop and fix its grade, and the grade is what the price hangs on. A good grade, and a farming year pays for itself with something left over. A poor one, and the same harvest, the same labor, comes back as a number that barely covers next season's seed. Enymu grows the grain and the Exchange names what it is worth, and those are not the same power.

> The Exchange grades the wheat and names the coin. Enymu only grows it.
> — a saying among the grain factors of Aldrichold

### An instrument on the kingdom's own land

The Exchange sits inside Enymu. The warehouses and the grading floor stand at Aldrichold, on Enymese ground, in a kingdom the empire never had to conquer. The binding was a treaty rather than a war, struck around 2876 SD as the Grain Compact, which carries its own entry. What that treaty did keeps its force here, in a building that stands on the land of the kingdom the empire holds. The lever of imperial control is not a garrison on the border. It is a counting-house at Aldrichold, where the grain comes to be told its price by the buyer who sets it.

### The compact nobody has broken

The Grain Compact has never been renegotiated and never formally broken. Five centuries of harvests have passed through Aldrichold under terms that were set once and never reopened, and King Aldric IV keeps them as the kings before him kept them. The pressure is not coming from the throne.

It is coming from underneath it. The Enymese who farm now were born into the arrangement, and they increasingly refuse to treat it as weather — as a fixed feature of the world rather than a price a delegation accepted under a closed-road threat five hundred years ago, on behalf of people now five hundred years dead. They ask why this year's wheat should answer to that bargain. The Exchange has no answer except that it always has, and that answer is wearing thin. The grading floor keeps grading. How long Enymu keeps bringing its harvest to be graded, on the empire's terms, by Nektuna's licensed houses, is the one question the Exchange cannot grade away.

<!-- author-notes -->
Authoring decisions and open flags (stripped from public build):

WHY A FACTION, NOT A TOWN. Built as an institution-faction mirroring faction-aldriktch-trade-alliance.md / faction-order-of-bryn.md. All load-bearing canon is institutional mechanics — grading, imperial licensing, the annual price-set, the monopsony, the binding of Enymu. There is zero place-furniture in any source (no districts, population, terrain), and canon treats Aldrichold as the place that *contains* the institution. No coordinates, no pin invented.

HARMONIZATION (the deliberate reconcile). economy.md / event-enymu-subjugation say "licensed imperial merchants"; enymu.md says "Nektuna's merchants set the prices." Nektuna is an imperial region within Tarkhon, west of Enymu (enymu.md borders). Both are the same actor, stated here as Nektunan merchant houses licensed by the empire. Not a contradiction — one fact in two phrasings.

OPENING-SENTENCE DISAMBIGUATION. The cluster Aldriktch / Adrak / Adron / Aldrichold opens near-identically ("The Aldriktch...", "Adron is..."). This file opens on the once-a-year price decision, not on the name, and paragraph 2 explicitly separates Aldrichold from Aldriktch and the Grain Exchange from the Aldriktch Trade Alliance / iron standard, so a reader cannot conflate them.

DEFERRALS. Grain Compact history (the ~2876 SD treaty, the geographic coercion, the signatory) lives in event-enymu-subjugation.md and is touched here only as a brief orienting clause. King Aldric I is prose-only canon in the event file; not referenced here to keep the deferral clean. King Aldric IV is the present-day upholder per enymu.md. The grain-factors' saying is reused verbatim from event-enymu-subjugation.md — identical text, cannot diverge; the Exchange is its natural home.

LIVE LEVER. The younger Enymese generation questioning a compact never renegotiated and never formally broken — the same lever enymu.md and the event surface, pointed here at the institution itself. The GM-facing open question: how long Enymu keeps delivering before someone refuses.

EDGES (applied): polity/memberOf → "2455" (the empire operates the Exchange — memberOf adjudicated over the flagged ruledBy, since the operator is a polity, not a person), economy/tradesWith → "2484" (Enymu, the bound supplier), and history/participatedIn → event-enymu-subjugation. No spatial/within → "2484" — factions are non-geographic; the Aldrichold/Enymu seat is carried in prose. The overview-factions.md wealth-paragraph index-insert naming the Exchange (and pre-empting the Aldriktch collision) is applied.
