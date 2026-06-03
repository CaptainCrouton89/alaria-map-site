---
id: "person-renaro-tovellin"
name: "Renaro Tovellin"
entityType: person
blurb: "A junior Camaran magistrate whose legally airtight petition against the anti-magic ban sits, unanswered, on the First Consul's desk."
tags: ["npc"]
weight: minor
review:
  aiWritten: false
  action: keep
---
Renaro Tovellin is a foundry-magistrate in Camaran, young enough that the Blight is something he studied rather than survived. He came up the way the republic still trains its clerks: statute first, the Volari quarter walked through once a year with the looms left strung as they were found. He is good at the work. The petition he filed late in 3375 is, by the account of everyone who has read it, the cleanest piece of legal reasoning to reach the consul's office in years.

Its argument is simple and hard to answer. The Camaran Blight was Deoric, and Deoric spends living price; that is the danger the statutes exist to stop. The elemental schools spend nothing but the caster's own effort and reach. Banning them prevents no second Volari, because they could not have caused the first. The statute, Tovellin wrote, confuses the act with the grief that followed it, and a law that cannot tell the two apart is not caution but confusion given the force of the state. He signed it, as a magistrate signs his own filings, and sent it up.

> The statute forbids the spending of life by command. The elemental schools spend no life. To enforce the one law as though it were the other is not prudence. It is a category error with the whole weight of the republic behind it.
> — from the Tovellin petition, filed to the office of the First Consul, 3375 SD

It has sat on Doravin Selmari's desk for eight months. Tovellin reads the silence as deliberation. The consul is old, the question is genuinely hard, and the office has never been quick. He is wrong about which of those things is keeping his petition unanswered. Under the same statutes his argument attacks, saying in any official forum that some magic is safe is itself the career-ending offense, and Tovellin has now said it in writing, over his own signature, in a document filed to the state. He has not submitted a question for the consul to weigh. He has submitted a confession, and he does not know it.

There is precedent he could have read. Fifteen years ago a magistrate named Padrin Olveri argued the same point more softly and is now a notary in a river town upcountry, struck from the rolls, his petition entered into the record as the proof against him. Tovellin knows Olveri's name. He has not yet understood that he is walking the same road, or that the man at the end of it agrees with every word he wrote and intends to ruin him for putting it on paper.

<!-- author-notes -->
NEW provisional names (flag for sign-off):
- "Renaro Tovellin" — onomastics-human.md Family 1 (Romance). Given "Renaro": Ren- opener + -aro terminal (attested in canon "Selvaro" Mellin). Surname "Tovellin": To- + -vellin (-lin terminal, attested in "Mellin" and the sheet's -lin suffix). Soft consonants, open vowels, no blend. `grep -rli` clean at creation.
- "Padrin Olveri" — the prior ruined magistrate, mentioned in prose only (no entity authored). Family 1 Romance: "Padrin" (Pa- + -drin, -in terminal); "Olveri" (Ol- + -veri, -ri terminal like Selmari/-ari). `grep -rli` clean. Flag if an Olveri entity is later commissioned.

Timeline: present 3376 SD. Blight ~3340 (36 yrs ago); Tovellin "early thirties," born ~3343–3345, so he was an infant or unborn at the Blight — "too young to remember," consistent. Petition filed late 3375, "eight months" on the desk. Olveri ruined ~3361 (fifteen years ago), after the Blight and the statutes, consistent.

Cross-ref: two-way prose with person-doravin-selmari.md (the trap, from the perpetrator's side) and a region-level surface in camaran.md (the ban's human cost). NO codex edge: per the F2 spec and entity-relations.md, no typed kind fits a magistrate serving under a consul in the same government (rivalOf is wrong; ruledBy is for polities; there is no event entity to participatedIn). Relation is prose-only by design; Tovellin is intentionally an orphan node. Flag if a "Camaran reform" event entity is ever created — then wire participatedIn.

lore-complication (recursive inversion, F2 "nastier"): Rule = Selmari rules Camaran in penance, the just man bearing his guilt. Inversion = he will commit a calculated injustice (spring a self-indictment trap) to defend a law he knows is wrong. Recursive turn = he privately agrees with Tovellin completely, and that agreement is exactly why the petition cannot be allowed to stand. Left unresolved: the petition is still on the desk; whether Selmari enters it, and whether anyone warns Tovellin first, is the live GM lever.
