---
paths:
  - "content/codex/entities/**/*.md"
  - "docs/worldbuilding/image-style-guide.md"
  - "scripts/generate-images.mts"
---

# Image authoring — specific, never generic

**Generic is the enemy of good. Specific is always better.** This is the first rule for every image
subject (the prompt fed to `generate-images.mts`) AND every caption (the alt text on an inline body
image, which renders as the figure's caption).

An image and its caption must describe **this** entity in **this** world and no other. If the same
sentence could sit under any fantasy picture, it has failed.

## Captions

The caption's job is to say *what specific thing you are looking at* and tie it to real, named lore —
a named place, figure, faction, event, or the world's own mechanics. Concrete beats atmospheric.

- ❌ "A harbor town of the warm band, terraced into a headland above a working bay." — could be any port.
- ✅ "A Middle Sea city-state of Clueanda — the temperate water whose trade matters out of all
  proportion to its size, because every western hull must first pay the Tarkhon strait."
- ❌ "A fearsome beast of the deep places." — names nothing.
- ✅ "Bathemiel, the chained dragon bound beneath Mpehi since before humans reached the Free Isles."

Banned in captions: "a/an" + generic noun with no name or world-specific hook ("an ancient ruin", "a
mighty warrior", "a sacred place", "a powerful relic"). Name it or anchor it in named lore.

## Subjects (prompts)

Specific still rules — but in a subject, specificity is carried by **visual description, not by proper
names. Describe the thing; do not name it.**

A name is meaningless to the image model. It has never seen "Enimogos" or the "Sandreach Mountains," so
the name tells it nothing about what to paint — and worse, it routinely renders the name as **text baked
into the image** (labels, captions, map titles), which the locked NEG forbids and which we then have to
throw away and regenerate. The name adds no information and all the risk. Strip every proper noun out of
the subject and put the *appearance* in instead.

This does **not** loosen "specific, never generic" — a generic stand-in is still banned. The discipline
is to make the *description* itself unique to this one entity:

- ❌ "A sweeping view of Enimogos, capital of the Postronamas Empire." — names mean nothing to the model; it may paint the words.
- ✅ "A sweeping view of a shattered desert capital: colossal broken columns and the stumps of ruined domes half-swallowed by dunes, a hazy ochre sky." — same place, described so it can only be this one.
- ❌ "Belu Jenari rising over the Sandreach desert." — renders the label "BELU JENARI".
- ✅ "a lone smoking volcanic cone rising from an endless golden sand-sea."
- ❌ "a representative Aciabro goblin." — ✅ "a goblin remade as a blood-powered cyborg: machine limbs and organs fed by vital essence through brass valves, lit by forge-glow."

On overview/atlas pages, describe the page's actual terrain and the world's mechanics in visual terms —
never a name, never mood alone. The more region names you stack into one subject, the more the model
treats it as a labeled map and writes the labels in.

**Captions are the opposite.** A caption is human-facing text rendered as HTML, never fed to the model,
so it MUST name the thing (see Captions above). Name in the caption; describe in the subject.

See the **five-move subject recipe** in `docs/worldbuilding/image-style-guide.md` for the full method
(shot → describe-don't-name → distinctive details → light/palette → positive framing) plus the locked
style and the two roles.
