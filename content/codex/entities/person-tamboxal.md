---
id: "person-tamboxal"
name: "Tamboxal"
entityType: person
blurb: "A creole broker out of Nadang who keeps the bribe economy running and makes a practice of never asking where the cargo goes."
tags: ["npc", "tamadrez", "shacklands"]
relations:
  - { rel: polity, kind: allyOf, target: "person-kishuntar", note: "moves the day-to-day graft Kishuntar's office runs on; half-guesses the reeve's secret, says nothing" }
---
Tamboxal is the man who makes the small money move. Where Kishuntar holds the office and carries the navigation fee down to Slavewatch, Tamboxal handles everything beneath that line: which fisherman owes which headman, which garrison sergeant expects a gift at which festival, what a docking slot costs this season and who is allowed to be short. He is creole, like most of the northern coast, three centuries of islander and mainlander and shipwrecked everything mixed past sorting. He brokers between all of them because he is trusted by all of them, which is to say he is trusted to take his cut and keep his mouth shut.

He deals directly with Helmo, Volso's broker, and the two understand each other completely. Neither is cruel. The trade is paperwork and percentages to both of them, a set of ledgers that balance if everyone pays on time. Tamboxal will tell you, if you buy him enough palm wine, that cruelty is a luxury for people who can afford opinions. The north cannot. The north keeps its eyes on its own boats.

> Look south and you will see the ships. Then you have seen them, and what have you bought yourself? Trouble you cannot eat.
> — a saying common in the northern harbors

That is not quite the whole of him. Tamboxal has handled Kishuntar's accounts long enough to notice that some of the reeve's numbers do not mean what they appear to mean, that certain fees are paid for cargo that was never fish. He has never followed the thought to its end, and he never will, because following it would make him a man who knows something, and men who know something get sweated by Slavewatch or knifed by the resistance. He looks at the figures, finds them balanced, and looks away. It is the most Tamadrezan thing he does.

<!-- author-notes -->
Coined Tamadrezan name "Tamboxal" is PROVISIONAL (coined-exotic register; no onomastics sheet). `grep -rliE "\bTamboxal\b"` = zero hits. Silas may rename.

Embodies rule "most northerners just don't look south" — the fatalist-survivor broker. Half-aware of Kishuntar's secret, deliberately doesn't pursue it (recursive texture on §3.8).

Edge AUTHORED: person-tamboxal → polity/allyOf → person-kishuntar (same writer; target on disk). Prose: Helmo (Volso's broker), the bribe economy.
