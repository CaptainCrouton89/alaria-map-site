### Image generation style guide

> **The first rule: specific, never generic.** Generic is the enemy of good. Every subject and every
> caption must describe *this* entity in *this* world and no other — named places, named figures, the
> world's own mechanics. If a sentence could sit under any fantasy picture, it has failed. (Enforced
> as a tripwire in `.claude/rules/image-authoring.md`.)

Every codex image is an **oil painting of its subject**, generated from a **hand-written** description.

There is no prompt-generation script and no auto-derived descriptions — that approach is a trap (it
produces generic, samey prompts that read like the blurb, not like the thing). Instead: an agent looks
at the entity, writes a bespoke subject in plain language, and the generator (`scripts/generate-images.mts`)
wraps it in the one locked style. The author owns *what is in the picture*; the script owns *how it is painted*.

---

### The locked style (do not edit casually)

Prepended to every image. The author never repeats these words — the generator adds them:

> Fantasy oil painting, painterly and richly detailed, naturalistic realism, classical oil-painting
> rendering with soft brushwork and atmospheric lighting.

Appended to every image as the negative clause:

> No text, letters, captions, watermark, signature, or border frame anywhere in the image. Not a
> photograph, not anime, not cartoon.

Both constants live in `scripts/generate-images.mts` (`STYLE`, `NEG`). This is the single source of
truth; this doc is the prose mirror of it. The world is **not** grim and **not** a physical/aged
artifact — it's a clean, full-color, richly painted oil rendering. (We workshopped grim, sepia-folio,
and "physical painting" looks and rejected all three.)

---

### Two image roles

| Role | Aspect | Dimensions | Where it's used |
|---|---|---|---|
| **banner** | 16:9 | 1600×900 | The entity page header, **and** the preview image on every card (landing cornerstones, search rows, featured hero). One per entity. |
| **illustration** | 3:4 *or* 4:3 | 900×1200 / 1200×900 | Painted *into the body* of the page, scattered through the prose. **Upright (3:4)** for figures — a race, a creature, a deity, a person, an artifact. **Landscape (4:3)** for scenes — a place, a habitat, a moment. As many as the article wants. |

There is **no** square thumbnail / portrait-avatar / seal role. Small contexts that lack a banner fall
back to the generated `Sigil` (an on-brand SVG crest), never to a cropped avatar.

---

### How the two roles reach the site

**Banner → frontmatter.** Every entity page should carry a `banner:` field in its frontmatter holding
the image URL:

```yaml
banner: https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images/495/banner.webp
```

**Illustrations → inline body markdown.** Authored directly in the body where they belong, as normal
markdown images. The alt text becomes the caption:

```markdown
![The chained dragon straining against its bindings in the abyssal dark.](https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images/creature-bathemiel/illo-chains.webp)
```

**Card fallback rule.** When rendering an entity as a card, the build uses the frontmatter `banner:` if
present, otherwise **the first image URL found in the body**. So an entity with no banner but a body
illustration still previews with real art. (Resolved once in `scripts/build-codex.mts` and stored on
`CodexEntry.banner` / `SearchEntry.banner`; the frontend just reads `entry.banner`.)

---

### Writing a good subject

The subject is one or two sentences naming the thing and what's distinctive about it — what a painter
would need to know to paint *this* entity and no other. Keep it concrete and visual; skip lore the eye
can't see. Lead with the role framing so the composition is right:

- **banner (place):** `A sweeping establishing view of Enimogos, the shattered capital of the long-fallen Postronamas Empire at the heart of a vast desert: colossal broken columns and ruined domes half-swallowed by dunes, a hazy ochre sky.`
- **banner (figure/concept):** `A wide dramatic scene of …` / `A symbolic tableau of …`
- **illustration upright (figure):** `A full-body portrait of a representative Aciabro goblin: blood-powered cyborg, machine limbs and organs fed by vital essence, lit from a forge-glow.`
- **illustration landscape (scene):** `A lone windswept moment on the Akratian Plateau where bare rock meets permanent sea ice: scoured grasses bent in the wind, pale cold daylight, a vast empty horizon.`

Fold palette/lighting cues into the sentence when the entity has a strong mood (a cursed ruin reads
cold and desaturated; a sacred site reads warm and golden) rather than relying on any automatic
modifier — there isn't one anymore.

Prefer a **specific named entity** over a representative stand-in: paint Enimogos, not "a desert ruin";
the Aciabro, not "cyborg goblins." On overview/atlas pages a representative image is sometimes
unavoidable — then ground the subject in the page's actual named geography and mechanics, never in mood
alone, and have the two body illustrations each depict a *named* thing from that domain.

---

### Captions (the alt text)

The alt text on an inline body image renders as the figure's caption, so it must be specific. Its job
is to say *what specific thing you are looking at* and anchor it in named lore — never generic mood.

- ❌ "A harbor town of the warm band, terraced into a headland above a working bay." — could be anywhere.
- ✅ "A Middle Sea city-state of Clueanda — the temperate water whose trade matters out of all
  proportion to its size, because every western hull must first pay the Tarkhon strait."
- ❌ "A frozen city at the edge of the map." — names nothing, asserts nothing.
- ✅ "A sun-city of the far latitudes, frozen mid-life when its coalition lost its grip on Bryn's path —
  grain still in the jars, two hundred miles past any living border."

Banned: `a`/`an` + generic noun with no name or world hook ("an ancient ruin", "a sacred place", "a
mighty warrior", "a powerful relic"). Name it, or anchor it in named lore and the world's mechanics.

---

### Generating (costs money — get approval first)

`scripts/generate-images.mts` is the generation half. `--dry-run` is free and assembles the full prompt
for review; live generation calls a paid Gemini image model (`gemini-3.1-flash-image`, Nano Banana 2)
and must be approved per batch.

```bash
# free preview of the assembled prompt
node scripts/generate-images.mts --id 495 --slot banner --prompt "A sweeping establishing view of …" --dry-run

# one banner (paid)
GEMINI_API_KEY=… node scripts/generate-images.mts --id 495 --slot banner --prompt "…"

# one upright body illustration (paid)
GEMINI_API_KEY=… node scripts/generate-images.mts --id person-gaea --slot illo-1 --orientation upright --prompt "…"

# a batch from a JSON array of { id, slot?, orientation?, prompt }
GEMINI_API_KEY=… node scripts/generate-images.mts --jobs ./batch.json
```

On success each job prints its public R2 URL. Paste it into the entity file: the **banner** URL into the
`banner:` frontmatter, an **illustration** URL into an inline `![caption](url)` where it belongs. Then
re-run `node scripts/build-codex.mts` so the card-preview resolution picks it up.

---

### R2 path convention

Bucket `alaria`, public host `pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev`, prefix `images/`.

Path: `images/{id}/{slot}.webp` — `{id}` is the entity's immutable codex id; `{slot}` is `banner` for the
header, or any descriptive stem for illustrations (`illo-harbor`, `illo-rite`, …). Format is always
`.webp`. Uploads use `wrangler r2 object put … --remote` (without `--remote` it hits a local emulation,
not the real bucket).

---

### Cross-references

- `scripts/generate-images.mts` — generator; owns the locked `STYLE`/`NEG`. Run `--help`.
- `scripts/build-codex.mts` — reads `banner:` frontmatter and resolves the card-preview fallback.
- `src/types/codex.ts` — `CodexEntry.banner`, `SearchEntry.banner`.
- `docs/worldbuilding/lore-style-guide.md` — the lore authoring standard; this document is its sibling.
