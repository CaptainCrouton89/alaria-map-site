---
id: "faction-kro-shiik-convocation"
name: "The Kro Shiik Convocation"
entityType: faction
blurb: "The annual gathering of every Rakiten tribe at Kro Shiik—the one pan-Rakiten institution, deciding by visible consensus, and paralyzed over Roule."
tags: ["faction", "rakite", "elven", "convocation"]
relations:
  - { rel: culture, kind: originatedIn, target: "3604", note: "the only pan-tribal institution of the Rakiten plains" }
  - { rel: culture, kind: worships, target: "daemon-vaeloten", note: "deliberation is conducted in sign, under the witness of the seen gesture" }
  - { rel: polity, kind: rivalOf, target: "4423", note: "the Roule colony's dams and diversions on the lower Ver Neles, and the water-rent the Honey Lords' envoy offers at the gathering" }
review:
  aiWritten: true
  archetype: ai-ok
  action: keep
---
Once a year, at the autumn equinox, every Rakiten tribe brings its sight-bonds to the shore of Kro Shiik for five days, and for those five days the scattered plains-people are briefly a single body. The convocation is the only institution Rakite has. There is no capital to govern from, no standing council between gatherings, no chief whose word carries past his own sightline. What pan-Rakiten decisions exist are made here or not at all, and mostly they are not.

### How it decides

Business is conducted entirely in sign, in the open, where every tribe with a line of sight is a witness — the form of worship the Rakiten owe Vaeloten, the daemon of the seen gesture, for whom a thing done unwitnessed is a thing not done. Camps ring the lake in an order fixed by tradition, and the order is itself a record: the sight-bonds of the Ver Pes delta hold the western shore by the freshest inflowing water, a position their ancestors earned and they have never surrendered, and a dispute over placement has more than once ended a gathering before it began. Decisions require consensus. In practice this means the tribes are too independent, too watchful of one another, and too attached to their own ways to agree on anything that costs them, so the convocation excels at the things consensus does not block — marriages brokered, feuds settled, news and trade carried home — and stalls on everything that would commit the whole people to one course.

### Envoys or riders

The course it cannot commit to is what to do about Roule. The halfling colony on the lower Ver Neles dams and bleeds the river the Rakiten hold sacred from source to sea, and three positions have hardened across twenty autumns of deferral. One bond would withdraw further, move the herds, and let distance solve what it has always solved. One would ride east and end the colony in a season. The largest faction is the one that cannot choose between them and asks, each year, for another year. The smoke of burned grass stands closer on the eastern horizon at every gathering, and how near the patience is to ending is the thing the tribes read in it.

Into that deadlock Roule has now sent Wendel Corvos, a Honey Lord land-factor, with a standing offer of annual water-rent for the diverted flow. The offer is built to break consensus the way nothing the tribes have faced before can. To take coin is to price a sacred river and admit it can be bought; to refuse is to be entered in a foreigner's ledger as the party that declined a fair settlement. Either answer hands Roule the precedent it wants. The convocation has not found a third.

### The dam on the Ver Lakei

The hardest thing the convocation will not say aloud is that the law it would punish Roule for breaking has already been bent from inside. In the last drought the sight-bonds of the Ver Pes delta — the strongest at the gathering, the holders of the freshest water — threw an earthwork across the Ver Lakei, a narrow tributary in their southern winter range, and held its water back. Not to foul it; the water stayed clean. To control it: with the Ver Lakei stopped, the rival bonds whose herds had always watered there had to come to the delta tribes and ask. A stilled river is a dead river by the people's own law, and this one was stilled by the very bond that speaks loudest against Roule. No one has named it the gravest crime, because the delta tribes are too strong and the drought was real and the water, after all, was only being held. The contradiction sits at the western shore every autumn, unspoken, and it is the reason the convocation's case against the colony is quieter than its anger would suggest.

<!-- author-notes -->
House-rule inversion (load-bearing Rakiten rule = "to foul/still a river is the gravest crime; a river is one living sacred body source-to-sea"). Grounded named exception: the Ver Pes delta sight-bonds (the strongest, freshest-water-rights tribes per ver-pes.md) dammed the Ver Lakei (coined tributary, grep-clean) in drought to control rival herds' watering — river-law enforced against Roule, bent by insiders for leverage. Left unresolved; their prestige shields them. Recursive with the Roule grievance (downstream stilling) turned inward. The convocation's drought-dam undercuts its own moral case, which is why its anger outruns its action. A named individual leader (Eskei) for the delta bonds is referenced at water-kro-shiik.md; kept prose-only, no separate entity.

Edges (one direction): culture/originatedIn → 3604 (Rakite); culture/worships → daemon-vaeloten; polity/rivalOf → 4423 (Roule, the colonial polity — no Honey Lords faction entity exists). Wendel Corvos (person-wendel-corvos) named in prose; his structural home edge is memberOf → 4423 on his own file. Reciprocity with Kro Shiik (water-kro-shiik) and Rakite (3604) is by prose, both in-cluster files.
