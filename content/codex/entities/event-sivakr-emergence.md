---
id: "event-sivakr-emergence"
name: "The Sivakr Emergence"
entityType: event
blurb: "Fifty years ago the Sivakr came up from more than sixteen centuries underground to trade, betting the surface had forgotten why it drove them below."
tags: ["event"]
relations:
  - { rel: history, kind: occurredDuring, target: "era-seventh-dawn" }
review:
  aiWritten: false
  action: keep
---
Around 3326 SD, fifty years before the present, the Sivakr unsealed their surface gates for the first time in more than sixteen hundred years. They came up to trade. Within a few years they held a contested seat in the Aldriktch Trade Alliance, and within a few more the neighbors who had granted it were beginning to wish they hadn't.

To see why a people would stay underground that long, and why they would risk coming up at all, start with how they went down.

#### The descent

In 1700 SD the surface peoples around the Grey Mountains drove the Sivakr off the high country and into the warrens the silver elves had until then used only as refuges. The cause was not land. It was the memory-work. The Sivakr negotiate the way they duel, by reaching into the other party and editing what that party remembers having agreed to, and over a few generations of trade and treaty the surface had begun to notice that its merchants came home from the Grey Mountains certain of bargains they could not afterward account for. When the pattern became undeniable, the surface answered a memory-thief the way it would answer a well-poisoner. The expulsion was thorough and it was bloody, and the silver elves who lived through it carried the grievance below without losing a detail of it.

Five years into the retreat, with the surface still raw, the underground cells acclaimed Xalvaakr, daemon of scarred memory and the vengeance of the displaced. A century later the silver-elf state installed a goddess of its own, Tiira, to keep the official memory clean. The faith split that still divides every Sivakr household dates from those two acts.

> The kings counted the years and decided the surface had forgotten us. We are the ones who spent sixteen centuries proving the surface always forgets. We never once thought it was something to be glad of.
> — a Xalvaakr-faith recitation

#### Sixteen centuries below

The warrens kept the Sivakr alive, but a closed kingdom has hard edges. They mined what the Grey Mountains held and grew what the cavern-galleries would carry, and for the rest there was nothing new under the stone. The blood-engine in the Forbidden Valley went on powering their memory-work without interruption, which meant the one thing the Sivakr never ran short of was the ability to remember exactly what had been done to them. Up on the surface the grievance aged into a footnote and then into nothing. Below it, the silver elves refreshed it every generation by reciting it. Time moved at two different speeds on the two sides of the same rock.

#### The Grand Weaver's bet

The decision to come up was King Samaryn's, and it rested on a calculation only a memory-worker would trust. Samaryn knew to the year how long a thing stays remembered once no living witness holds it, and by his reckoning more than sixteen centuries was longer than any surface memory could possibly run. The old crime was gone from the surface, the treaties dust, the witnesses' grandchildren's grandchildren dead. The Sivakr could come up as strangers and traders, not as the people the surface had once driven below.

The first half of the bet was sound. Nobody on the surface remembered. The second half is failing the same way it failed in 1700 SD, because the Sivakr did not stop editing the people they trade with, and the Alliance partners are now discovering, fresh and on their own, exactly what their ancestors discovered. Whether this turn of the cycle ends the way the last one did is the question Myorna's whole future now sits on.

<!-- author-notes -->
Dates honored as locked canon: descent 1700 SD (era-seventh-dawn "Notable Centuries"); Xalvaakr acclaimed ~1705 SD (daemon-xalvaakr.md, "first years of the underground retreat"); Tiira installed 1800 SD (era-seventh-dawn + daemon-tiira.md). Re-emergence ~3326 SD = "fifty years ago" per myorna.md and the Alliance-admission date in event-aldriktch-founding.md. Underground tenure = 1700→3326 = ~1,626 years; rendered as "more than sixteen hundred years" / "sixteen centuries." This corrects myorna.md's "thousands of years underground," which contradicts the locked 1700 SD descent — myorna.md is aiWritten:true and the loose phrasing was an error; I fixed it in that file this pass.

No `precededBy` edge: the 1700 SD descent has no event entity in the corpus to target, and a dangling target is a lint error. The descent is narrated in prose instead. If a descent event is ever authored, add `precededBy` here.

INVENTED (fits canon, contradicts nothing): (1) the *cause* of the 1700 SD descent — surface peoples driving the Sivakr below over discovered memory-tampering. Canon (era-seventh-dawn) only says "the Sivakr are driven underground"; the cause was open. This reading is built directly on race-elf-sivakr.md (memory manipulation) + daemon-xalvaakr.md ("vengeance of those driven below," "scarred memory," memory-erasure-as-murder) and rhymes the historical expulsion with the present-day hostility in myorna.md. (2) Samaryn's memory-faded calculation as the re-emergence driver. Flag both for sign-off.

Flip-side / soul economics: the Forbidden-Valley blood-engine and its HP/soul accounting are authored on the-forbidden-valley.md (mechanics + author-notes there), not restated here.

Open thread deferred: whether the blood-engine itself (an aging chained giant) is failing and forced the emergence is a stronger/darker driver but would touch the giant's lifespan, which no anchor settles — left for a later pass rather than invented here.
