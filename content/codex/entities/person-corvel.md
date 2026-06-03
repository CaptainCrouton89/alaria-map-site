---
id: "person-corvel"
name: "Corvel"
entityType: person
blurb: "Emperor Veramus's son. In a republic that elects its emperors from victorious generals, a son with no victory inherits nothing."
tags: ["npc", "gorath"]
relations:
  - { rel: polity, kind: allyOf, target: "person-veramus" }
---
Corvel is Emperor Veramus's son, which in Gorath is worth less than people outside the republic ever expect. Gorath does not pass its throne to blood. It elects its emperors from among the generals who have won it ground, and it has done so for three hundred years, and no amount of being the emperor's child changes the tally of provinces a man has taken. In Corvel's case the tally is none.

His father has done what the rule allows, which is to give him a legate's command and a run of postings safe enough to survive and quiet enough to win nothing. The army reads this for exactly what it is. A legion knows the difference between a general building a reputation and an emperor's son being kept alive in the hope that a reputation turns up on its own. Corvel is twenty-nine, he has held command in three campaigns, and the most anyone says of him is that he lost no one he did not have to lose.

> My father held the Esteves Pass for forty-three days with no relief coming when he was younger than I am now. I have held a quiet posting and the pity of better men. The republic has never once been unclear about which of us it will crown.
> — Corvel

He could go after real glory, but the fronts that grant it are the ones that destroy the men who reach for it. Nashua, where Mauros only holds. The Moon Wilds, which unmade Drauso and three legions with him. He could put his name behind another claimant and trade his blood for a place in someone else's reign. Or he could keep doing what he has done so far, which is wait, and serve his father, and watch the one thing he was raised to inherit turn out to be a thing the constitution forbids him to have. Which of the three he will choose when Veramus dies is the question the whole court is quietly asking. Corvel is not answering, possibly because he does not yet know.

<!-- author-notes -->
PROVISIONAL coined name (Gorathi Iberian/Latinate register, plan §6): Corvel. Grep-collision-clean (zero hits, 2026-06-02). Silas may rename.

DEFERRED EDGE (target person-veramus absent — W2a; orchestrator authors centrally): person-corvel → { rel: polity, kind: allyOf, target: "person-veramus", note: "the emperor's son; a legate with no victory, who inherits nothing because Gorath elects generals" }.

INVERT per plan §2/§3.11: dynastic succession → Gorath elects generals, so the heir inherits nothing. Hook left open (try for glory / back a claimant / keep waiting) — deliberately unresolved per the succession powder-keg charge.

Canon: rimihuica.md:58 (Gorath elects emperors from its generals; no clean line of succession for Veramus). Esteves "forty days" references Veramus's siege epithet (esteves.md / plan §2, W2a owns the detail) — stated from Corvel's POV, not elaborated here. Mauros (Nashua) and Drauso (Moon Wilds / three legions) cross-referenced; both W2b-owned. Corvel's age 29 is coined (not canon-fixed); flag if W2a's person-veramus implies otherwise.
