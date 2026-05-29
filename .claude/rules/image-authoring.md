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

Same rule. Prefer depicting a **specific named entity** over a representative stand-in — paint Enimogos,
not "a desert ruin"; the Aciabro, not "cyborg goblins." On overview/atlas pages where a representative
image is unavoidable, still ground the subject and caption in the page's named geography and mechanics,
never in mood alone. See `docs/worldbuilding/image-style-guide.md` for the locked style and the two roles.
