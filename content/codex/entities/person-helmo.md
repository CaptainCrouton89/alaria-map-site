---
id: "person-helmo"
name: "Helmo"
entityType: person
blurb: "Kassander Volso's chief broker at Slavewatch, who keeps the bribe-ledger that decides which passes are watched and which careers end."
tags: ["npc", "shacklands", "tamadrez", "slavewatch"]
aliases: ["Helmo the Reckoner"]
relations:
  - { rel: polity, kind: allyOf, target: "person-kassander-volso", note: "runs the navigation-fee ledger and the Tribune's insurance records; the trade is rows in a book to him" }
---
Helmo keeps the books at Slavewatch, which in a less honest fortress would be a minor post and here is the second most dangerous job in the central Freedom Mountains. He is a small, dry man of unremarkable appearance, Gorathi by birth and bloodless by temperament, and he has worked for Tribune Kassander Volso longer than most of the garrison has been alive. The garrison calls him the Reckoner. He does not seem to mind.

The navigation fee runs through Helmo. Every payment from the northern villages, forwarded up the coast through the Tamadrezan reeves, lands as an entry in his ledger: who paid, how much, for which stretch of pass, and through which night. From that ledger Volso's patrols are routed, so that a village current on its account finds the soldiers conveniently absent and a village in arrears finds them suddenly thorough. Helmo does not think of the people moving through the passes while he writes. He thinks of the columns balancing. To him the slave trade and the escape trade are the same commerce viewed from opposite ends of a page, and both pay into the same book.

> A debt is a debt. The cargo is a debt, the passage is a debt, the silence is a debt. I do not ask what walks through the dark. I ask whether the account is settled. It usually is.
> — Helmo, overheard in the Slavewatch counting-room

He keeps a second set of records that matters more than the first. Every Gorathi official who ever took Volso's coin to ignore what the fortress does is named in it, with dates and sums, and copies sit in places Helmo will not discuss. This is the Tribune's insurance, and Helmo is its author and its only reliable index. As long as the ledger exists, the careful men in Azantir cannot afford to let either of them fall. Helmo understands that his own safety and Volso's are the same entry, and he has never given the empire a reason to think otherwise.

What he does not advertise is that a ledger is only as honest as the man keeping it. Helmo records what the patrols are told, not always what they do, and there is at least one lieutenant whose patrols never quite match their paperwork. Whether Helmo has noticed, and whether he has chosen not to write it down, is the kind of question the Reckoner answers by going very still and changing the subject.

<!-- author-notes -->
PROVISIONAL coined Gorathi name flagged for Silas: "Helmo" (mononym + earned epithet "the Reckoner"). grep -rliE "\bHelmo\b" across content/codex/entities/ + docs/worldbuilding/ = zero hits before this file. Iberian/Latinate register per plan §2 (soft onset, plain ending).

Role per plan §2 W4: Volso's chief broker, runs the bribe-ledger; the insurance records (slavewatch.md:75). RULE embodied: corruption is transactional, not cruel. Quietly seeded the Renzo discrepancy (the ledger's blind spot) as a hook without resolving it.

Edge authored: allyOf → person-kassander-volso (I create that file this task, so target exists; should apply).
