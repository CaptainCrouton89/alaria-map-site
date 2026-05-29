### Image generation style guide

> **The first rule: specific, never generic.** Generic is the enemy of good. Every subject and every
> caption must describe *this* entity in *this* world and no other — its specific places, figures, and
> mechanics, described so the picture could be nothing else. (A subject *describes*; a caption *names* —
> see the two sections below.) If a sentence could sit under any fantasy picture, it has failed. (Enforced
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

The subject is one or two sentences a painter could work from — concrete, visual, and true of *this*
entity and no other. The locked STYLE and NEG already own *how it's painted* and what's banned; the
subject owns only *what is in the frame*. Write it in five moves, each one earning its place for the
reason given:

1. **Open with the shot.** The first words fix the composition, so lead with them: `A sweeping aerial
   establishing view of …` (a place / banner), `A wide dramatic scene of …` or `A symbolic tableau of
   …` (a concept), `A full-body portrait of …` (a figure). Get this wrong and the framing fights the
   rest of the sentence.
2. **Describe the subject — do not name it.** A proper name means nothing to the model (it has never
   seen "Enimogos"), adds no visual information, and routinely comes back painted in as a text label or
   map title — which the NEG forbids and which forces a regenerate. Replace every proper noun with what
   the thing *looks like*.
3. **Anchor two to four distinctive details.** The specifics only this entity has — colossal broken
   columns half-swallowed by dunes; the three-thousand-year glow still lit on a sunken hull. This is
   where "specific, never generic" is won: a stand-in "desert ruin" is still banned, so make the
   *description* unique even though the name is gone.
4. **State the light and palette.** There is no automatic mood modifier — say it in the sentence. A
   cursed ruin reads cold and desaturated; a sacred site warm and golden; an arctic sea pale and
   colorless.
5. **Frame positively, then stop.** Say what *is* in the picture, never what isn't — image models act
   on the nouns you give them and largely ignore "no …" (the NEG owns exclusions, so adding more is
   noise). Keep it to one or two sentences: stacking many named regions into one subject is exactly
   what tips the model into drawing a labeled map.

Worked examples (subject only — the script prepends STYLE and appends NEG):

- **banner (place):** `A sweeping establishing view of a shattered desert capital: colossal broken columns and the stumps of ruined domes half-swallowed by dunes, a hazy ochre sky.`
- **banner (concept):** `A wide dramatic scene of …` / `A symbolic tableau of …`
- **illustration upright (figure):** `A full-body portrait of a goblin remade as a blood-powered cyborg: machine limbs and organs fed by vital essence through brass valves, lit by forge-glow.`
- **illustration landscape (scene):** `A lone windswept moment where bare high-plateau rock meets permanent sea ice: scoured grasses bent in the wind, pale cold daylight, a vast empty horizon.`

On overview/atlas pages a representative image is sometimes unavoidable — describe the page's actual
geography and the world's mechanics in visual terms, never mood alone. (Captions are the opposite:
human-facing HTML, never fed to the model, so they MUST name the thing — see Captions.)

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
