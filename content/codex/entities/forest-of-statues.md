---
id: "manual-mphbzhol-zkrha"
name: "Forest of Statues"
entityType: wilderness
blurb: "A stretch of the Elder Wilds where the Stillness, a permanent Izzus breach, runs time unevenly and wears the unwary into standing stone."
coordinates: [346, 155]
zoomLevel: 5
tags: ["wilderness", "time", "dangerous"]
atmosphere: ancient
relations:
  - { rel: spatial, kind: within, target: "1806" }
  - { rel: culture, kind: inhabitedBy, target: "race-sevrai", note: "the Stillness is the Sevrai's home breach" }
---
The Forest of Statues is a stretch of the Elder Wilds where time does not keep one pace. Beneath it the Izzus seam, the time-layer of the elemental planes, lies torn open. The tear is called the Stillness, and it has stood open since the Lost Ages, when the seam ruptured on its own and never closed again. That is what sets the forest apart from the forest around it. Everywhere else in the Elder Wilds the hours run true. Here they run fast in one pocket and slow in the next, and in the deep places they nearly stop.

### The Stillness

An Izzus seam runs under many places in Alaria. Under most of them it lies quiet, the way it does beneath Besnoumeru, where the time-gangs work it for an edge no rival can match. Under the Forest of Statues it does not lie quiet. It surfaces raw, pressing the time-layer through onto the material world across the whole forest, so that the local rate breaks into pockets with no clean edge between them. Step from one to the next and the pace changes underfoot with no warning at all.

None of this reaches the true clock. The Great Cycle runs on past the Stillness exactly as it runs past everything, the way it runs past the Salt Tomb and every other place an Izzus seam has bent. What the breach moves is only the local rate, pocket by pocket. A traveler is never carried into a finished year or set back before a death. The forest slows a life or hurries it; it does not unstick anyone from history.

The Stillness is not the only torn seam in the world, but it is the only one nobody built. When the mage-kings of Old Tolaria drove the Apparatus of Severance into the same seam beneath Elderran, they tore a second breach on purpose and on a far larger scale, and Elderran has been completing that catastrophe century by century ever since. The Stillness has no engine at its heart and no work it was set to finish. It opened in the deep past, on its own, and it simply runs.

### The statues

The statues that give the forest its name were people. A traveler who walks into a slowing pocket without feeling it slows along with it. The steps lengthen, the thought stretches, and from the outside the figure seems to stop while inside it a single moment swells to fill what the world counts as years. Held that far out of the world's pace, a body weathers where it stands. The rain wears it toward stone faster than it can lift a hand to its face. Some of the standing figures have held their place for centuries. Others arrived last season. None of them is dead, and none is frozen outside of time. Each is a living person running so slow that the world has walked off and left it where it stood.

> Near the heart of the slow zone stands a woman with one arm raised. The Sevrai who pass her say the arm sits higher than it did a generation back. She is waving, or shielding her eyes, or reaching for a thing none of them can see. At the rate she keeps, the gesture will take her another hundred years to finish, and she will never know how long the watching took.

### The Sevrai

A people lives in the breach and crosses it the way no one from outside can. The world calls them time-witches; they call themselves the Sevrai. Generations inside the Stillness have bred into them a wide channel to Izzus and an instinct for which way the rate runs underfoot, so a Sevra walks the Forest of Statues at an easy pace while a stranger turns to stone a hundred yards in. They are not strange in any way deeper than that ground. They are mortals who happen to live somewhere strange, and they die as mortals die. The full account of who they are and how their dying differs from the haunting kind of time-touched belongs to them.

What the breach leaves behind, the Sevrai keep. In the slow zones they turn up time stones, dense little knots of the seam's own substance, and a worker who carries one can lean on it to bend the local rate in a small space, the way a shaper standing on a strong leyline reaches further than open ground allows. They are rare, the Sevrai hold nearly all of them, and they amplify the rate and nothing else. None of them is a door into a year already spent.

<!-- author-notes -->

CONTAINER confirmed: `node scripts/codex.mts entity show --id 1806` → 1806 is the Elder Wilds (region, Aboyinzu eastern peninsula). Locked per wave5 brief (race-sevrai originatedIn→1806; "the Stillness sits in the Elder Wilds, NOT in Old Tolaria"). within→1806 authored here; this fixes the orphan.

inhabitedBy→race-sevrai authored here (one direction; reverse computes). race-sevrai already reciprocates in prose (originatedIn→1806, "arose in the Forest of Statues"); per brief, race-sevrai.md NOT edited this wave.

DISTINCT IZZUS SURFACE — held to locked canon (wave5 brief + race-sevrai/creature-hourbound/elderran): the Stillness is a NATURAL deep-past seam rupture that failed to reclose, NOT Elderran's built Apparatus catastrophe (contrast stated in body), NOT the Salt Tomb's localized stall, NOT Besnoumeru's quiet stable seat. LOCAL RATE ONLY honored throughout — never history, never the Great Cycle. Statues are living people running slow, not removed from time.

Prose names Vesimar nowhere; this file's Elderran-contrast names the Apparatus of Severance and Old Tolaria only (prose, no edge — those entities are owned by other writers this wave). No new creature/person entity coined. No scholar attribution (approval-gated); all assertions stated directly.

The §9 withheld-cause for the Stillness (deep-past seam rupture, exact trigger GM-choosable) lives in elder-wilds.md author-notes and is not re-litigated here.
