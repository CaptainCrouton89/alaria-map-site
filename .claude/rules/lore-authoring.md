---
paths:
  - "content/codex/entities/**/*.md"
---

# Lore authoring — consult tier-1 docs first

Before authoring or editing ANY entity file, read both:

1. `docs/worldbuilding/lore-style-guide.md` — how to write (voice, structure, process, originality)
2. `docs/worldbuilding/world-systems-invariants.md` — what is canon (cosmology, locked invariants)

This is not optional. These documents are the authoritative authoring standard.

## Irreducible tripwires

**Entity files are canonical.** Never hand-edit `data/locations.json`, `public/locations.json`,
`data/codex/compiled.json`, or `public/codex-search.json`. Edit the entity file, then run
`alaria-codex build` (or `node scripts/build-codex.mts`).

**Containment is an edge, not frontmatter.** Use a `spatial/within` edge in `relations`; the `parent`
field is retired and silently ignored.

**Canon is consult-only.** When authoring conflicts with a locked invariant in `world-systems-invariants.md`,
surface the conflict — never silently overwrite established canon.

**"DO NOT AUTHOR YET" threads.** When lore touches an open thread, state what is already settled and
explicitly defer the unresolved part. Don't skip it silently.

## Cross-references

- `.claude/rules/entity-files.md` — full frontmatter schema and `entityType` enum
- `.claude/rules/entity-relations.md` — edge vocabulary and `within`/`capitalOf` semantics
- `.claude/rules/codex-cli.md` — id-resolution, `map shot`, and CLI mutation rules
