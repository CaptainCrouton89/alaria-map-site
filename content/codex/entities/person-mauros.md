---
id: "person-mauros"
name: "Mauros"
entityType: person
blurb: "First Marshal who has held the Nashua front for eleven years. The general Emperor Veramus dares not recall, and dares not leave where he is."
aliases: ["Mauros the Nashua Wall", "the Nashua Wall"]
tags: ["npc", "gorath"]
relations:
  - { rel: polity, kind: rivalOf, target: "person-veramus", note: "First Marshal of the Nashua front; the popular general Veramus dares not recall" }
---
Mauros is the First Marshal of Gorath's southwestern front, and for eleven years his work has been to make sure the Ix'Vasyla of Nashua never come south. That is all of it. He has taken no city, raised no pillar in Azantir, and added no name to the Pillar of Conquest. What he has done is hold the line of fortified positions where the scrublands give way to marsh, against a people who have turned defensive war into something close to a science, and he has done it without losing the southern provinces and without spending his legions the way the marsh invites a commander to spend them.

In a republic that elects its emperors from its winning generals, a man who only holds should be no one. Gorath rewards the march. Mauros does not march, because the Poison Country cannot be marched into, as Drauso learned in a different jungle and three legions paid for. But the soldiers who have served a rotation on the Nashua line know what it costs to keep ground that wants them dead, and they know which marshals spend lives carefully and which spend them for a line in the dispatches. They call Mauros the Nashua Wall, and they mean it as the highest thing they have to give. His legates Vandero and Escalus run the forward camps along the approaches to Svintiste, the empire's last outpost before the true marsh, and neither has lost a position under him.

> You want to know who should be emperor? Ask the men who came back from the Svintiste line with all their fingers. They'll give you the same name.
> — a legionary of the southern front

This is the knot Veramus cannot cut. Recall Mauros to Azantir and he arrives as the obvious next emperor, a general the army already loves, standing in the capital exactly when the election comes. Leave him at the front and his legend only grows, because every year the Wall still stands is another year the emperor in Azantir has won nothing to set beside it. So Veramus keeps him at the one front in Gorath that produces no triumphs and waits for the marsh to wear the shine off the name. Eleven years on, it has not. Mauros has never said a word about the throne. He does not need to.

<!-- author-notes -->
PROVISIONAL coined names (no Gorathi onomastics sheet; Iberian/Latinate register per plan §6 — Veramus/Veryx precedent, soft Romance onsets, -us/-ar/-el endings): Mauros, epithet "the Nashua Wall"; prose-only legates Vandero and Escalus. All grep-collision-clean (zero whole-word hits across content/codex/entities/ + docs/worldbuilding/, 2026-06-02). Silas may rename.

DEFERRED EDGE (target person-veramus absent on disk — created in parallel by W2a; orchestrator authors centrally): person-mauros → { rel: polity, kind: rivalOf, target: "person-veramus", note: "chief succession rival; the popular general Veramus dares not recall" }.

Canon leaned on: rimihuica.md:58 (Gorath elects emperors from its generals; three-century conquest republic); nashua.md (2921) — Ix'Vasyla, Poison Country, scrublands/Deserted Hills contested flank, Svintiste as westernmost outpost before the deep marsh, generations of stalled legions. Azantir Pillar of Conquest from azantir.md (3189). Drauso/three-legion Moon Wilds loss referenced per plan §3.1 (person-drauso owns it). Esteves siege is Veramus's (W2a); not asserted here.
