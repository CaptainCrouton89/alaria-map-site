# Lanthornia/Aether cluster — close remaining author-note flags (4 files), then build+lint

Casing convention (already applied corpus-wide, see `context/cleanup-findings.md`): **Aether**/**Lanthornium** capitalized as proper substance nouns; lowercase ONLY hyphenated compounds (`aether-tapper`, `aether-fed`); leave lost-Kethic `aetherial`/`aetherium` lowercase. Read `.claude/rules/entity-relations.md` + `.claude/rules/codex-cli.md` before any edge mutation. Do EXACTLY the below — nothing more. NEVER hand-edit the 5 generated outputs (the build regenerates them).

## 1) content/codex/entities/magic-lanthornium.md (edits inside the `<!-- author-notes -->` block)
- Casing residuals: `the engine cycle from aether's POV` → `from Aether's POV`; `who refines raw lanthornium, and where` → `raw Lanthornium, and where`. (Keep `aether-tapper` compound lowercase.)
- APPLY the edge wishlist, then DELETE that wishlist paragraph: author in magic-lanthornium's `relations:` frontmatter the edge `culture/originatedIn` → plane-lanthornia. Resolve plane-lanthornia's frontmatter `id:` and use it as `target` (concept entities use slug ids). Author one-direction-only from this (more-specific) entity. The wishlist paragraph to remove reads: "Edge wishlist (author on this, the more-specific entity; reverse computed at build): - magic-lanthornium --(culture/originatedIn)--> plane-lanthornia".
- DELETE the now-stale paragraph beginning `Casing: Aether/Lanthornium capitalized to match the named sibling template magic-aether.md. Corpus drift to flag ... Orchestrator call on which convention wins ...` (convention decided + applied; flag resolved).

## 2) content/codex/entities/magic-aether.md
- APPLY edge: author in magic-aether's `relations:` frontmatter `culture/originatedIn` → plane-lanthornia (same target id as above). plane-lanthornia's author-notes asked for this edge authored on the magic entities. If magic-aether already has this exact edge, leave it.

## 3) content/codex/entities/plane-lanthornia.md (edits inside `<!-- author-notes -->`)
- DELETE the `Edge wishlist (author on the magic entities, the more-specific end ...)` paragraph and its two bullet lines (now applied in files 1+2).
- DELETE the `Index-insert wishlist (orchestrator applies; I did not edit that file): add Lanthornia to the "Other Known Stacks" list in plane-the-cosmos.md ...` paragraph (now applied in file 4).
- DELETE the stale `Casing note: Aether/Lanthornium capitalized ... flagged for an orchestrator-level convention call.` paragraph (resolved).

## 4) content/codex/entities/plane-the-cosmos.md
- In the "Other Known Stacks" list (currently reads "Glyssen, Klokas, and Narglon"), ADD **Lanthornia** so plane-lanthornia becomes reachable in-corpus. Match that list's existing prose style exactly. Do NOT re-touch the already-correct Aether/Lanthornium casing on L22.

## Then validate
Run `node scripts/build-codex.mts` (expect `Parsed 3890 entity files`) then `node scripts/codex.mts report lint` → target `errors:0`. If your new edges produce a NEW dangling-target or both-ends-directed error, fix it (verify the target id exists; author only one direction). `crtr push final` with edits-per-file + final entity count + lint errors count.
