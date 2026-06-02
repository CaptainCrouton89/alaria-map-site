---
paths:
  - "content/codex/entities/**/*.md"
---

# Lore authoring — consult tier-1 docs first

Before authoring or editing ANY entity file, read both:

1. `docs/worldbuilding/lore-style-guide.md` — how to write (voice, structure, process, originality)
2. `docs/worldbuilding/world-systems-invariants.md` — what is canon (cosmology, locked invariants)

This is not optional. These documents are the authoritative authoring standard.

## Search the existing corpus before inventing any lore

Canon is the default; invention is the exception. Before you write a single sentence of lore about any
proper noun — a place, plane, people, person, era, faction, artifact, or cosmological term — search the
entity corpus and the worldbuilding docs for it first. The answer is very often already authored, and
asserting your own version on top of it is a canon violation even when it sounds plausible.

This is a hard rule, not a courtesy. It is the difference between enriching the world and bullshitting a
new one next to it. A real failure that motivated this rule: an agent wrote that the ayblek came from
"outside the planar stack, past the titan-glass stars that mark the world's edge" — inventing both a
cosmological structure and an origin — when `plane-instruxofinum.md` already existed (Instruxofinum is a
*separate planar stack* in the cosmos, per `plane-the-cosmos.md`) and the titan-glass stars are canonically
*inside* Alaria's stack (`plane-stars-suns-and-moons.md`, `plane-the-skies.md`). Every fact needed was
already written down. None of it was checked.

Before inventing, run the search:

```bash
ls content/codex/entities/ | grep -iE "<term>"        # is there already an entity for this?
grep -rliE "<term>" content/codex/entities/           # who already references it, and how?
grep -rniE "<term>" docs/worldbuilding/               # is it fixed in the systems/invariants docs?
```

Then:

- **If an entity or canon statement exists**, build on it. Match its facts exactly; do not contradict,
  re-spell, or quietly re-define it (the ayblek file even mis-spelled the existing plane's name).
- **If a proper noun is referenced but has no entity**, read every file that mentions it and stay
  consistent with the picture they collectively establish before adding to it.
- **If nothing exists**, you may invent — but invention must fit the locked systems in
  `world-systems-invariants.md`, obey the relevant onomastics sheet, and not collide with an existing
  name. Coined names get a `grep -rli` collision check before you commit them.

When you assert a structural or cosmological fact ("X is the edge of the world," "Y lies beyond the
stars," "Z is a kind of plane"), that is exactly the kind of claim most likely to already be canon —
verify it against the planar-stack docs rather than reasoning it out from the name.

## Cross-references

- `.claude/rules/entity-files.md` — full frontmatter schema and `entityType` enum
- `.claude/rules/entity-relations.md` — edge vocabulary and `within`/`capitalOf` semantics
- `.claude/rules/codex-cli.md` — id-resolution, `map shot`, and CLI mutation rules
- `.pi/rules/<entityType>.md` — per-type fleshing-out guidance (recommended sections, the type's
  levers, which canon doc to read). Loads automatically from frontmatter when you read an entity of
  that type; one file per `entityType` (region, city, magic, race, daemon, era, …).
