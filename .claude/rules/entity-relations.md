---
paths:
  - "content/codex/entities/**/*.md"
---

# Relationships (the graph)

Every relationship is a `relations` edge — including containment. A place declares `spatial/within`
targeting the entity that contains it (town → its nation/region). The reverse (`contains`) is computed
at build, so never author both ends. (The old `parent` frontmatter field is retired.)

## Edge shape

```yaml
relations:
  - { rel: spatial, kind: within,     target: "477" }
  - { rel: spatial, kind: borders,    target: "1339" }
  - { rel: polity,  kind: vassalOf,   target: "1201", when: "until War of Broken Oaths", note: "tribute now nominal" }
  - { rel: economy, kind: skyRouteTo, target: "1450" }
```

## Families → kinds

- `spatial` — within (containment; ≤1 per entity), borders, separatedBy, liesOn, controlsPassage
- `polity` — capitalOf, ruledBy, vassalOf, tributaryOf, memberOf, allyOf, rivalOf, atWarWith, protects
- `economy` — tradesWith, paysTributeTo, produces, skyRouteTo
- `culture` — worships, inhabitedBy, originatedIn, speaks
- `origin` — foundedBy, createdBy, ruinsOf, successorOf
- `history` — participatedIn, occurredDuring, caused, precededBy
- `possession` — wields, forged, guards, imprisons, boundTo
- `cosmology` — sourceOf, flipSideOf, inhabits, channels, requires, attunedTo

## Discipline

- **One direction only.** Author from the smaller/more-specific entity (a city declares `vassalOf` its
  empire; a town declares `borders` its neighbor). The reverse is computed at build — never write both ends.
- **`target` is always an `id`, never a name.**
- **Nuance lives in `note` and prose, never in a new kind.** "Complicated hatred" is `rivalOf` + note,
  not a new kind. Don't invent kinds outside this list — propose an addition instead.
- **Time-bound facts take `when`**, or they read as present-tense canon.
