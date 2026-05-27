---
paths:
  - "content/codex/entities/**/*.md"
---

# Scholar Attribution Convention

See `scholar-voices.md` for per-scholar voice, bias, rivalries, and the niche-expert index.

## Coherence comes first; scholarly attribution is approval-gated

The default for all lore is internal coherence. Author a single, consistent account of what happened
and assert it directly. When two facts appear to contradict, resolve the contradiction — rewrite the
world so it coheres (see the lore-style-guide process section). Do not reach for "scholars disagree"
as a way to avoid resolving it. That is the crutch this convention exists to prevent, not to license.

Scholarly attribution — naming a scholar for an interpretive claim, and especially staging two
scholars in unresolved disagreement — is a deliberate authoring tool, **not the default move, and it
requires explicit approval before use.** Do not introduce scholar attribution (single-voice or staged
disagreement) on your own initiative to manage uncertainty or paper over a contradiction. Propose it,
get sign-off, then author it using the syntax below.

When attribution IS approved, this file defines its greppable, linter-checkable form so that
disagreement, where it is deliberately staged, is recorded rather than silently reconciled.

## Syntax

A markdown blockquote immediately followed by an em-dash attribution line:

```markdown
> *"The Frost Fall was no natural winter — it was Craggus loosening his grip."*
> — Erindath of Sennos, *Annals of the Reborn World*, 412 SD
```

The attribution line MUST:
- Begin with `> — ` (blockquote marker + em-dash + space — the linter keyed on this prefix)
- Name a scholar whose name or alias appears in the canonical roster below
- Optionally append a work title in `*italics*` and/or a date suffix (`NNN SD` / `NNN BSD`)

## When to attribute

**Assert directly** (the default for nearly everything):
- Locked canon from `world-systems-invariants.md` (cosmogony, magic-system mechanics, named geography)
- Physical description of places, artifacts, creatures
- Edge-verifiable facts (a settlement's `within` edge, a polity's founding date when dated)
- Historical cause, motive, and sequence — pick the coherent account and state it. An interpretive
  claim is not a license to attribute; it is a prompt to decide what actually happened in the world.

**Attribute only with prior approval**, and only when the disagreement or uncertainty is itself a
deliberate, load-bearing story element rather than a gap to be resolved:
- A genuinely contested interpretation that the world is meant to leave open (cause, motive, sequence)
- A reading of cosmological or magical phenomena where the ambiguity is the point
- Speculation deliberately preserved as informed opinion ("likely", "may have", "suggests")

If you find yourself wanting to attribute, first ask whether the coherent answer simply needs to be
chosen. Attribution that exists to dodge that choice is the crutch — surface it for approval instead.

## Staging disagreement (approved cases only)

Staging disagreement requires approval — it is not a default tool (see the top of this file). Once
approved, two adjacent attributed blockquotes attributed to *different* scholars is the canonical form
for a recorded dispute. Having staged an approved dispute, do NOT then silently reconcile it into a
single voice:

```markdown
> *"The leyline predates the lake entirely — the name is older than any human tongue."*
> — Oblexan, *Material Survey of the Lost Ages*, 9,870 BSD

> *"Pugrai is clearly a Drachman loanword compressed by satyr tongues over seven centuries."*
> — Shoryaven, *Chronicle of the Great Expansion*, 304 BSD
```

## Unnamed-collective hedges are BANNED

"scholars believe…", "historians note…", "some scholars argue…" are banned. They are the soft form
of the same crutch — vague disagreement standing in for a decision.

The default replacement is a direct, coherent assertion: decide what is true in the world and state
it. Only when staged disagreement has been approved (above) does the replacement become an attributed
blockquote — or two adjacent ones for a deliberate dispute — using the roster below.

The phrase "scholars believe" or "scholars note" appearing in an entity body without an attribution
line is a linting target (Item 5). No exceptions for "minor" or `footnote`-weight entities.

## Canonical Major Scholar Roster

These 7 scholars own every era and cross-cutting theme. Future authors MUST use roster names —
do not invent new major scholar names without adding them here first.

| id | Name | Era owned / theme |
|----|------|-------------------|
| `person-temavori` | Temavori of Drachma | Golden Age of Man, cosmogony, dead pantheon |
| `person-erindath-of-sennos` | Erindath of Sennos | Age of Craggus, reborn world, Laughing Plague |
| `person-oblexan` | Oblexan | Lost Ages, empirical reconstruction, Blight of Arcanus |
| `person-shoryaven` | Shoryaven | Great Expansion, modern polities, Frost Fall, Return of Dragons |
| `person-pembling` | Pembling of Grendenheim | Seventh Dawn, Dark Ages, current era |
| `person-velorin` | Velorin of Istora | Cosmology, planes, three-soul death, daemon mechanics |
| `person-ghrythan` | Ghrythan | Races, migrations, languages, oral tradition |

For deep-niche citations (a specific war's eyewitness, a regional genealogist, a creature naturalist)
use the niche-expert persons tagged `["scholar","stub"]` — they are listed in
`content/codex/entities/person-*.md` files with `weight: minor`.

## Linter invariants (Item 5 enforcement targets)

The future linter (`scripts/lint-attributions.mts`) will flag:
1. Any attribution line that does NOT start with `> — `
2. Any scholar name in an attribution line that does NOT match a `name` or `alias` in a person
   entity tagged `scholar`
3. Any entity body containing the literal string `scholars believe` or `scholars note` without an
   adjacent `> — ` attribution line within 3 lines
4. Two adjacent blockquotes attributed to the same scholar (duplicate, not disagreement)
