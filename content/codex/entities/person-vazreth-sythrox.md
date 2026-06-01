---
id: "person-vazreth-sythrox"
name: "Vazreth Sythrox"
entityType: person
blurb: "A thread-binder of Chaal Nazzerox sent up the River of Wights to leash the masterless wight-lord Mylanor; the binding failed and he did not return."
tags: ["npc", "necromancer"]
weight: minor
relations:
  - { rel: polity, kind: memberOf, target: "1410" }
review:
  aiWritten: false
  action: keep
---
Vazreth Sythrox was a thread-binder of Chaal Nazzerox, and for a while the best the necromancer-state had at the fine end of the craft. Most of the empire's work with the dead is bulk labor. A shadow is clamped back to a corpse, the corpse stands up, and it carries grain or carries a spear until it falls apart. Vazreth worked the other end. He stranded souls and shadows mid-transit to make specters, the precise cut that most thread-binders tear, and he had a particular reputation for taking a wight worth keeping out of a shadow that lesser hands would have wasted on a common skeleton.

That reputation is what sent him up the river, and the river is what finished him.

A masterless wight-lord had been standing in the northwestern Crimson Coast for some years by then, a Winter Elf named Mylanor who had died in a succession war and risen out of the River of Wights with too much of his old cunning still caught in his shadow. He commanded the lesser dead of the upper water and answered to no one, because no one had raised him. To the lich-king Xynoth Azkonor this was two intolerable things at once. A wight that gives orders is exactly the kind of officer Chaal Nazzerox is always short of, and a wight that gives orders to no master at all is precisely the thing the empire cannot allow to keep existing free, lest the example spread. Xynoth sent his best binder to settle the question the empire's way, by clamping the elf to a proper leash and walking him home.

Vazreth went up the River of Wights with the working prepared. Binding an existing wight is not raising a fresh corpse. It means reaching through the Nethereal overlay in Deoric, finding the hold the shadow already has on its body, and seizing that hold for yourself, and the working takes its price in your own life whether it closes or not. Against a mindless wight it closes. Mylanor was not mindless. He had four centuries of buried cleverness in him and he felt the thread reaching for his shadow before it arrived. He let it half-take. Then he turned it.

What came back down the river was nothing. Vazreth died on the bank with his life-price already paid out and no leash to show for it, and the river did to him what it does to everyone who dies violently in its reach. His shadow stood back up among the lesser wights of the upper water, no caster needed, and it now takes the orders Mylanor gives. The thread-binder who went to put the wight-lord on a leash is part of the wight-lord's standing host.

> The binder Sythrox went up after the elf at the turn of the season. The leash he carried was sized for a captain. Neither of them has come back down the water, and the elf still holds the upper river. Mark the working a loss and the binder with it.
> — a tribute-clerk's muster note, copied in the lower-river stations of Chaal Nazzerox

Inside the empire he is remembered, when at all, as the one who proved a point nobody wanted proven: that the dead who rise on their own can be worse than the dead a binder makes, because there is no caster to kill to be rid of them. The craft of clean specter-stranding that he refined outlived him and is still worked at Chaal Nazzerox. The man is a wight on the Crimson Coast.

<!-- author-notes -->
NAME RATIFIED (user sign-off, cycle 022 — locked as canon). "Vazreth Sythrox" was derived per task brief by anchoring off the existing Chaal Nazzerox dark-register exemplar "Xynoth Azkonor" (person-xynoth-azkonor) and the state's own corpus of harsh sibilant/velar names (Nazzerox, Myavis Kaalthox, Sharyakax, Iagyax, Lepox Naan in chaal-nazzerox.md). No bespoke onomastics sheet exists for Chaal Nazzerox (it is not a clean fit to any frozen human family in onomastics-human.md — closest is Family 3 invented-harsh, but the corpus is its own register). Vazreth: V-az- opener echoing Az- of Azkonor + -reth terminal echoing -noth of Xynoth. Sythrox: Sy-th- echoing Xynoth's th + -ox terminal echoing Nazzerox/-ox. Two-part given+surname matches the elite Chaal Nazzerox register (Xynoth Azkonor, Myavis Kaalthox). Originally flagged provisional (mirroring person-mylanor.md and person-vakhreon.md author-notes); ratified at user sign-off cycle 022, name now locked.

MYSTERY-WITH-ANSWER (style guide §mysteries): person-mylanor.md:16 (pre-edit) left the thread-binder's fate as "was not heard from again." The recorded answer, now stated in-text on both pages: the binding failed because Mylanor kept enough cunning to feel the Deoric working reach for his shadow and turn it; Vazreth spent his life-price (Deoric bills the caster whether or not the working closes) and got nothing; he died on the bank; and because the River of Wights raises the violently dead on their own (creature-undead.md:17, creature-wights.md:20, person-mylanor.md:14), his own shadow rose as a lesser wight under Mylanor's command. This is coherent with the caster-free river framing — Vazreth's wight owes nothing to any caster either.

CANON GUARDS honored:
- Mylanor holds a SHADOW, not spirit; his "cunning" is residual temperament, not restored personhood (person-mylanor.md:14, creature-wights.md:14). Vazreth likewise rises as a husk, not as the returned man — "The man is a wight" is the husk, his spirit faded to Celestia and ended.
- All thread-work is Deoric: costs life, needs titan material, routes through the Nethereal overlay (scope-magic-systems.md:38-46). Binding an existing wight = seizing the shadow's hold through the Nethereal. No fifth source, no soul-magic system, no Deoric exception. Dark-Kethic is NOT necromancy and is not referenced here.

EDGE (one-direction, authored on this file): polity/memberOf → "1410" (Chaal Nazzerox). Rationale per entity-relations.md: Vazreth is a member of the necromancer-state polity; memberOf is the cleanest fitting kind (task brief named it the candidate). The build computes the reverse on 1410; no edge authored there. NO edge to person-xynoth-azkonor (named in prose; ruledBy already lives on 1410 → Xynoth, and the smaller entity is Vazreth, whose tie to the polity covers the structural relationship).

RECIPROCITY mylanor <-> necromancer is PROSE-ONLY BOTH WAYS (task brief; sub-plan): there is NO clean edge kind for "attempted and failed to bind." boundTo is wrong — Mylanor is explicitly UNBOUND and survives masterless (the whole point). Mylanor is named here as the wight-lord who defeated the binding; person-mylanor.md names Vazreth as the binder who failed and whose shadow now serves him. No mylanor↔vazreth edge wired either direction.

Crimson Coast, River of Wights (2441), the succession war, and Xynoth Azkonor are named in prose only; their files are owned elsewhere. No edges to them from here (the only structural edge this character needs is memberOf → 1410).

Inset clerk left unnamed (a muster-note, institutional voice); no onomastics commitment, no entity implied.
