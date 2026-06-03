---
id: "person-aelrein"
name: "Aelrein"
entityType: person
blurb: "Senior forge-priest of Ystaeria at Tuur and Istora's loudest Traditionalist, who calls Queen Lamenrae's Winterwood-timber export the slow sale of the ancestors."
weight: standard
tags: ["npc", "winter-elf", "istori", "forge-priest", "traditionalist"]
relations:
  - { rel: polity, kind: memberOf, target: "2420" }
  - { rel: culture, kind: worships, target: "daemon-ystaeria" }
sources: []
review:
  aiWritten: false
  action: keep
---
Aelrein keeps the forge-temple of Ystaeria at Tuur, which makes her the senior voice of the cold-glass patron in the eastern kingdom and, by the same standing, the most dangerous critic Queen Lamenrae has at home. She is devout in the exact way that makes her a problem. No one can call her greedy or disloyal, because she wants nothing for herself and has never once questioned the queen's right to the throne.

What she questions is the timber. Ystaeria's Traditionalists hold that sacred work belongs with those who know how to keep it, and Aelrein has carried that doctrine out of the forge and into the Winterwood. The ancestors wait in that wood between their lives, she teaches, and its timber is their flesh while they wait. Lamenrae's export of it down the coast, to lowlanders who will burn it for a winter's heat, is the scattering of the dead to pay for a war that keeps making more of them. She is careful never to name the queen faithless, and careful to grant that the Industrialists who back the trade read the same scripture in good conscience. That restraint is what gives her weight. A zealot the court could dismiss. Aelrein it has to answer, because she has handed it nothing to dismiss her for.

> They ask me whether I would sooner the kingdom fell than the wood be sold. I tell them the wood is the kingdom. Everything else is only the people it is keeping.
> — Aelrein, to the queen's council at Tuur

<!-- author-notes -->
Fork E inversion (lore-complication; daemon-ystaeria.md, locked-decisions Fork E): the Ystaeria
Traditionalist/Industrialist schism cuts across the Klevnaf-Istora civil war. Istora is politically
reformist under Lamenrae, whose Winterwood-timber export is Industrialist-aligned theology in practice;
Aelrein is the grounded, named Traditionalist inside that reformist realm. The dispute is civil-but-bitter
and neither side accuses the other of irreligion, per daemon-ystaeria.md ("both sides accuse the other of
arithmetic errors"); Aelrein's council inset deliberately echoes that ("I doubt her arithmetic" appears in
her istora.md inset). She is sincere, not a hypocrite or a schemer, and that is the point of the
inversion: she cannot be bought, frightened, or caught in disloyalty, which is exactly why the court
cannot simply remove her.

Her distinctive theological move: extending Ystaeria's cold-preservation doctrine (sacred output stays with
those who can keep it) from ice-glass to the ancestral Winterwood. This bridges Istora's two faiths, the
ancestral-voices spirituality of the Winterwood and the forge-temple cult of Ystaeria, into a single
argument against the export.

NAME: "Aelrein" coined here, soft branch of onomastics-elf.md (Istori register): Ael- (ae diphthong opener,
per the Aelvara worked example) + -rein (radiant terminal); open vowels, soft l/r/n, no harsh clusters, no
doubled-consonant cluster. Chosen to be clearly distinct from two near-collisions in the same cluster: the
Klevnaf Fork E Industrialist forge-priest "Elowir" (in-prose in klevnaf.md, per backlinks-todo) and the
counselor "Amrela" (person-amrela) — different opener (Ael- vs Elo-/Am-) and a suffix neither uses (-rein
vs -wir/-rela). Also avoids the My- prefix to stay clear of the wight-lord Mylanor (person-mylanor).
Collision check before commit: grep -rliE "aelrein" content/codex/entities/ returned 0 hits. PROVISIONAL
pending sign-off.

EDGES authored here (one direction): memberOf 2420 (Istora) for graph connectivity; worships daemon-ystaeria
(authored on the worshipper per daemon-ystaeria.md's note that the worships edge lives downstream). A
reciprocal prose mention into daemon-ystaeria is queued in backlinks-todo.md, NOT authored here (shared
anchor; not edited this wave). istora.md names her in prose and carries the export dispute; a person-lamenrae
backlink is queued so the queen's page can name her domestic critic.
