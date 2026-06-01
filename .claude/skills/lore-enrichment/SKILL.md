---
name: lore-enrichment
description: Enrich an Alaria codex page with specific, reciprocally-linked lore using the page-topic checklist. Walk a page's topics (famous individuals, factions, conflicts/wars, legendary items, locations, historical events, peoples), add named specific detail for the relevant ones, then make every reference two-way — create/update the referenced entity to point back in prose AND wire a codex edge. Use when fleshing out, deepening, or connecting any entity in content/codex/entities/, when building out a domain (e.g. undead), or when the goal is "make the world feel alive / add connective glue."
---

# Lore enrichment — the page-topic checklist method

Lore is just nouns with connectivity. A page feels alive when it names *specific* people, wars, items, and places — and when those names point back. Add detail because it makes the page better and opens a live hook (a dispute, a contested resource, an actionable grievance), never to fill a quota. The method has two halves: **walk the checklist** to find specific lore worth adding, then **reciprocate** every reference so the graph stays two-way.

## Half 1 — Walk the topic checklist

For the page you are enriching, consider each topic-type. Not every topic fits every page; add only what earns its place.

- **Famous individuals** (`person-*`) — a founder, tyrant, hero, victim, current power-holder.
- **Factions / organizations** (`faction-*`) — guilds, orders, cults, houses, schools.
- **Conflicts / wars / battles** (`event-*`) — a named war this entity fought, caused, or suffered.
- **Legendary items / artifacts** (`artifact-*`) — a relic forged, wielded, or lost here.
- **Locations / places** — sub-sites, neighbors, ruins, landmarks.
- **Historical events / eras** (`event-*`, `era-*`) — when it rose, fell, or changed.
- **Relevant peoples / races** (`race-*`) — who lives here, who founded it, who it is hostile to.
- **Extend as the world suggests** — creatures, daemons, magic sources, materials. Any major page is a potential topic of another.

Specific beats generic, always. "A warlord razed the city" is dead. "Sythlen Vor razed it during the War of Broken Oaths to deny the Kethari their leyline" is alive — and creating those new nouns (the person, the war) is the point, not a side-effect.

## Half 2 — Reciprocate every reference (two-way)

When your prose names another entity, you owe it two things:

1. **A prose back-reference (always, primary).** The named entity's body must mention the relationship from its own side. One-way prose references are the defect this method prevents. If the named entity does not exist, create it.
2. **A codex edge, whenever the relationship fits an edge kind** — and most connective relationships do. The current graph is ~90% spatial (`within`/`borders`); the non-spatial edges (`worships`, `foundedBy`, `participatedIn`, `allyOf`, `ruledBy`, `caused`, `wields`...) are exactly the connective tissue this method exists to add. Wire the most specific kind that fits.

Author edges **one direction only** — the build computes the back-edge automatically. The prose back-reference is what you author on the *other* page, not a second edge.

## Prereqs — read these, don't restate them
- Edge families/kinds + one-direction discipline: `.claude/rules/entity-relations.md`
- Creating a new entity (id rules, frontmatter, body): `.claude/rules/entity-files.md`; sentinel blocks: `content/codex/entities/CLAUDE.md`
- Style (voice, banned vocab, burstiness): `docs/worldbuilding/lore-style-guide.md`
- Locked magic canon (closed four-source roster): `docs/worldbuilding/world-systems-invariants.md`
- Build + lint + never-run-two-builds: `.claude/rules/codex-cli.md` and root `CLAUDE.md`
- Scholar attribution (approval-gated blockquotes): `.claude/rules/scholar-attribution.md`
