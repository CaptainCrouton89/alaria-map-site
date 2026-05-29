---
id: "person-vorgar"
name: "Vørgar"
entityType: person
weight: minor
blurb: "The founding thane of Vogenfeld who set the terms of the Pass of Oaths bargain, speaking for the Council of Thanes around 2876 SD."
tags: ["npc"]
review:
  aiWritten: false
  action: keep
relations:
  - { rel: history, kind: participatedIn, target: "event-vogenfeld-pact" }
---
Vørgar was the thane who spoke for Vogenfeld when Tarkhon's envoys came north to bargain for the passes. The Council of Thanes sent him to the Pass of Oaths because he was the one among them least interested in being flattered, and the imperial representatives found him hard going for exactly that reason. He gave them the frontier they had come for, made them pay in yearly tribute and in public honor to get it, and insisted the whole agreement be cut into the rock of the pass where no later clerk could revise it.

He is remembered in Vogenfeld less as a hero than as a careful man who read the empire correctly. He did not trust Tarkhon to keep faith once the danger felt distant, so he built the bargain to outlast the goodwill that made it. The monuments along the pass were his idea before they were a tradition. Five centuries on, the dwarves have been proven right about the empire and the stone has outlasted the gratitude, which is roughly what he expected.

<!-- author-notes -->
Name FLAGGED PROVISIONAL. "Vørgar" derived per `docs/worldbuilding/onomastics/onomastics-dwarf.md` Norse branch: hard-stop V-/-r frame + ø umlaut + -gar height/peak terminal (cf. Trømgar, Gruynmar). The sheet warns the personal-name pool is THIN, so this is conservative extrapolation, not a canon name. Slug strips ø→o (`person-vorgar`) to match the existing convention in `person-stromgar` (Strømgar) and `person-gronmar` (Grønmar). Checked against the current person-name roster: no collision with Strømgar/Grønmar/Grømdrak or any other entry.

Rulership decision (per Wave B2 brief): Vogenfeld is governed by the COLLECTIVE Council of Thanes. Vørgar anchors only the Pact event; he does NOT receive a `ruledBy` edge from vogenfeld (2582), and no present-day single thane was minted. The trimmed NPC thanes (Gorveth/Brunhild/Keldris) were deliberately not resurrected. If the lead later wants a machine-checkable polity head, that is a separate decision — flagged.
