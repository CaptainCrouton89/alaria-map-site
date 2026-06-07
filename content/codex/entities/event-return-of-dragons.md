---
id: "event-return-of-dragons"
name: "The Return of Dragons"
entityType: event
blurb: "8,104 BSD. Dragonkind recovered its numbers and forced its way back into a rebuilt world that met the returnees with fire."
tags: ["event", "dragon"]
relations:
  - { rel: history, kind: occurredDuring, target: "era-great-expansion" }
---
The Reign of Dragons was deep time, ten million years and more before the calendar, and it had already ended long before the Shattering — other races walked into the world, and the dragons that had ruled it became one power among many. Then Hykravones broke Nagatayora open in the sky, and the dragon-father's death thinned what was left. Through the early Modern Era dragons were scarce in the settled lands. They kept to the deep ranges and the drowned coasts, far from the rebuilding peoples, few enough that a generation could grow up having never seen one. By 8,104 BSD that was no longer true.

Nagayeshi never stopped. The cone at the eye of Oblivion went on warming its buried clutches through the whole long recovery, Eyatora went on raising what hatched, and grown dragons went on leaving across the sea the way they always had, indifferent to whether the world outside still remembered them. The Shattering had killed the dragon-father and scattered his kind; it never touched the hatch-ground. So the Return was not an invasion mounted from anywhere. It was arithmetic. A hatch-ground that outlived the catastrophe put more dragons into the air each century than the one before, until there were again enough abroad to be felt, and a world that had learned to do without them met them with fire. The middle centuries of the Great Expansion were bloody for it.

The returnees never shared a purpose, whatever the later chronicles made of them. Rothogomos cracked a dwarven kingdom open for its gold and has brooded over the corpse ever since; Kanzekill barely notices the realms in her shadow, lost in a four-century hunt of her own. Off the Blades, Chavux raids the strait shipping and Adron will not raise a hand, because one law binds the whole kind without regard to temperament: no dragon may be killed, conqueror and recluse alike. That a raiding dragon is sacrosanct is the Return's longest-running consequence, and the one a strait full of robbed merchants would most like to see ended. Shoryaven gave more of his fourteen-volume Chronicle to the Return than to any other upheaval of the age, and read it as the hinge on which human dominion turned.

<!-- author-notes -->
NEW entity, dragon-canon mini-wave (W-return). Decision C1 (create the event); reproduction Decision B1 (Nagayeshi = the universal hatch-ground; returnees originate there and disperse).

CAUSE — deliberately restrained per the authoring contract. The Return has NO single triggering event. The in-text cause is demographic: Nagayeshi outlived the Shattering and kept hatching and dispersing dragons (creature-eyatora.md, nagayeshi.md), so dragonkind's presence in the settled world recovered over the ~2,100 years from the Shattering (10,209 BSD) to 8,104 BSD until it was felt again. Do NOT retrofit a dramatic trigger.

CONSISTENCY:
- adron.md:31 (FROZEN): "wild dragons that have wandered back across the sea since the Return of Dragons" — this event is that re-emergence; "across the sea" = out of Nagayeshi at the eye of Oblivion.
- event-the-dragon-betrayal.md: Rothogomos/Tepheranos were "two of the dragons whose kind had been clawing their way back to prominence ... since the Return." Their participatedIn edges treat them as returnees.
- B1: returnees originate at Nagayeshi; this event asserts NO second hatch-ground. The Reign of Dragons (10–2.5 Mya) predates Nagayeshi's present function, so the deep-time dominance is NOT claimed to have come from the present hatch-ground (world-systems-invariants deep-time row; nagayeshi.md caveat).
- middle-sea.md:64 (locked, concurrent wave): only Naga cross the storm inward; dragons hatched on the island fly OUT (nagayeshi.md "first flight over a sea no enemy can cross"). The event references departure, never inward passage by non-Naga.

EDGES: occurredDuring → era-great-expansion (authored here; reverse computed). participatedIn edges live on the dragon files (kanzekill, rothogomos, tepheranos, ziru, and chavux via W-chavux); the reverse member list surfaces here at build.

SCHOLAR: Shoryaven named in prose as the Return's chronicler — his established voice (scholar-voices.md: "Return of Dragons as a political crisis"). NO blockquote attribution and NO staged scholar-vs-scholar dispute (attribution gated). "whatever the later chronicles made of them" is unattributed narrative complication, not a `> —` attribution line.
