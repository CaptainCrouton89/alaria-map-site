---
id: "event-the-glassing"
name: "The Glassing"
entityType: event
blurb: "The fall of the Ederhi, Kazül's glass civilization, when the Blight of Arcanus turned their own magic lethal and left the desert in their place."
aliases: ["Fall of the Glass Kings"]
tags: ["event"]
atmosphere: cursed
relations:
  - { rel: history, kind: occurredDuring, target: "era-lost-ages" }
review:
  aiWritten: false
  action: keep
---
Before the Jahazai Desert there were the Ederhi, and the coast they held was not a desert at all. They built in glass. Not the trade-glass that makes Kazül rich today, but a grown, worked, aetherial glass their casters coaxed out of sand by magic, harder and clearer than anything a modern furnace can pour. Their towers held back the dunes. Their buried channels carried water across country that is now open sand, and for as long as the arts held, the southern coast was green enough to feed an empire.

The arts did not hold. Around 12,000 BSD the Blight of Arcanus reached the Ederhi the way it reached everyone who had built their world on magic. Casting began to kill the caster. For a people whose every load-bearing thing was a working, this was not a setback but an execution, and it came one hand at a time.

They could not simply stop. A civilization that grows its towers cannot leave them half-grown, and a coast watered by channels dies the season the channels fail. So the glass-shapers kept working, and kept dying at their work, and the towers fused where they stood. That is why no entrance has ever been found in the Towers of Ederhi: they were never hollow buildings waiting to be opened, but solid castings caught mid-growth, set hard around whatever and whoever was inside when the last shaper fell. The channels broke. The desert came back over the green in a generation, maybe two, and the Ederhi who outlived their magic did not outlive their land.

> A shaper's tower, sectioned by treasure-cutters two centuries ago and abandoned where it lay. The cut face shows no rooms. It shows the inside of the man who raised it: a darker seam of glass run through with the curve of a spine and the shadow of a hand still lifted, fused into the work at the instant the working turned on him.

What is left is scattered across the kingdom. The Towers stand sealed in the deep Jahazai. The catacombs under Bhutag hold the Ederhi dead the desert did not take. And the desert itself is the rest of the monument: the Jahazai is not older than the Ederhi but younger, the ground their failure uncovered. Modern Kazül still works glass and works it well, and the kings still keep one Ederhi thing that answers. The art that grew the towers is gone, and what the treasure-hunters carry out of the sand they cannot read, because the people who could read it are inside the glass.

<!-- author-notes -->
Cosmogony pull-down: this is the Kazül-LOCAL fall under the Blight of Arcanus (12,000 BSD, Lost Ages; "magic itself was cursed; using it killed the caster; brought down an empire built on aetherial foundations" — era-lost-ages.md L30-32, world-systems-invariants Magic/Deoric rows). NOT a separate Blight event — tied to the era via `occurredDuring → era-lost-ages` only. The Ederhi were a limb of (or kin to) the canonical aetherial-founded empire the Blight destroyed; the Glassing is how that catastrophe read on this stretch of coast.

DISTINCT from the Camaran Blight (~3340 SD, event-the-camaran-blight.md): that is a recent, local, few-hundred-dead foundry accident that merely borrowed the word "Blight" in grief. The Glassing is the real Lost-Ages cataclysm, ~15,000 years earlier. Do not conflate.

Naming (ratified canon, lead sign-off 2026-05-29): "the Ederhi" is the name of the fallen civilization, reusing the existing in-corpus place-name "Towers of Ederhi" (658) — the towers are named for their builders. "The Glassing" is a descriptive event name in the manner of "The Severance" / "The Camaran Blight"; alias "Fall of the Glass Kings" retained. Both names are locked.

Mechanics consistency: the Ederhi worked generative magic on aetherial/Psywinds-and-glass foundations and died when the Blight reversed it (canon). Salomor's surviving ring is an artifact-key (template-execution, NOT generative casting — world-systems-invariants Daemon-knowledge-gate row lists artifact-keys as below the gate), which is why operating it now spends no caster-life and does not re-trigger the curse; the binding was completed before the Blight. Ring detail lives on person-salomor.md and kazu-l.md, not here.

One-direction edge discipline: this event declares only `occurredDuring → era-lost-ages`. The ruins (towers-of-ederhi 658, bhutag 659) declare `ruinsOf → event-the-glassing` pointing back; jahazai-desert (657) gestures in prose only. No `caused`/reverse edges authored here.
