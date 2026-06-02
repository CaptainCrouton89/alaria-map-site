### Lore authoring style guide

Every entity file in `content/codex/entities/` is authored against this standard. World-systems facts are in `world-systems-invariants.md` — consult it before asserting any cosmology claim. The frontmatter schema is in `.claude/rules/entity-files.md`, referenced here but not reproduced. Nothing in this guide supersedes those two sources.

---

### Voice and tone

The register is encyclopedic: third person, present tense for standing facts, past tense for history.

No boldface anywhere, including first-use terms and proper nouns. The current corpus bolds first-use terms; the new standard drops it entirely.

Headers use `###`, `####`, or `#####` only, never `#` or `##`. The file body opens at `###`, consistent with current convention. Headings are sentence-case: "The harbor district," not "The Harbor District."

No first-person. No editorializing. Lore prose is not chatbot correspondence, so the chatbot-voice and sycophancy patterns in `sounding-human` simply have no foothold here.

---

### Thematic register

Alaria is high fantasy. Its darkness draws on grounded real-world atrocity — genocide, slavery, conquest, plague, displacement — depicted with weight and consequence, not as edgy set-dressing or shock value.

This connects directly to the process requirement that lore hand a GM a live lever. Grimness earns its place when it leaves something unresolved and actionable: a perpetrator who still holds power, a displaced population that wants return, a contested resource whose exploitation has a body count. An atrocity that is historical wallpaper is the same failure as filler mystery — it produces texture without tension.

Before:
> Vardenmoor was devastated by war decades ago and has never fully recovered.

After:
> Vardenmoor's eastern quarter has stood empty since the Theocracy's clearances thirty years ago. The families displaced to the coastal labor camps were never resettled. Their land sits titled to absentee lords in Harborflame, and the question of whether it reverts is currently before the Conclave — where two of those lords sit as delegates.

The rule "Don't manufacture darkness for its own sake" still holds. The point is not more darkness; it is darkness that has cause, perpetrators, survivors, and consequences the GM can pull on.

---

### The headline rule: perplexity and burstiness

Read the last sentence you wrote. Then the one before it. Notice the length.

If they are roughly the same — subject, predicate, object; subject, predicate, object — that is the problem. Encyclopedic writing defaults to regularity because regularity is effortless. It is also the primary signal that a machine wrote the text.

Varied sentence length is the single most important instruction in this document. Short. Then a sentence that winds through a subordinate clause, circles back on itself, maybe picks up a qualifier or two before finally arriving somewhere concrete. A fragment next. The gear-change is what the reader's ear actually notices.

Before:
> The Marak Syndicate controls trade routes, maintains a private fleet, and enforces its contracts through hired enforcers.

After:
> The Marak Syndicate controls the trade routes between the Jade Coast and the interior plateau. It maintains a fleet. Enforcement is handled privately, and the contracts are not the kind anyone takes to court.

The rule-of-three is the specific failure mode for a corpus like this. It sounds thorough. The brain flags tidy triads faster than any single word choice — faster even than AI-vocab. If you have three of something, cut one, or add a fourth that breaks the symmetry. Two examples are usually enough. One is often better.

"Soul" in an encyclopedic corpus means specificity and rhythm, not first-person opinion. A place should feel specific: one concrete detail, one live dispute, one geographic fact that only this entity could have. First-person editorializing stays out. Burstiness carries what opinion cannot.

---

### Things to avoid

Adapted from `ai/output/sounding-human` for neutral reference prose.

- Undue significance and legacy puffery: "stands as a testament," "indelible mark," "pivotal moment," "enduring legacy," "marks a shift."
- Superficial -ing analyses: "symbolizing the region's history," "reflecting the community's values," "contributing to the broader sense of..."
- Promotional language: "nestled," "vibrant," "breathtaking," "rich history," "renowned," "stunning."
- Vague attributions: "scholars say," "some believe," "experts argue," "it is widely considered."
- AI-vocab words: delve, tapestry, intricate, testament, vibrant, pivotal, landscape (abstract), showcase, underscore, foster, garner, interplay, key (as adjective), crucial, enduring, enhance, highlight.
- Copula avoidance: write "is" or "has," not "serves as" or "stands as."
- Negative parallelisms: "not just X, but Y," and tailing negation fragments.
- Rule of three: see the section above.
- Elegant variation / synonym cycling: one referent keeps one name. Proper nouns especially — do not cycle "the Syndicate," "the organization," "the body," "the group" to avoid repetition.
- False ranges: "from X to Y" only when X and Y are actual endpoints on a scale.
- Em-dash overuse: one per sentence at most; most can be replaced with a comma or a period.
- Boldface: none. See the voice section.
- Emoji: none.
- Curly quotes: use straight quotes only (").
- Filler phrases: "in order to," "at this point in time," "due to the fact that," "it is important to note that."
- Excessive hedging: "could potentially possibly," "may have some effect on outcomes."
- Signposting: "let's dive in," "here's what you need to know," "now let's look at."
- Fragmented headers followed by a warm-up sentence that simply restates the heading before the real content begins.

Lore prose is never first-person chatbot voice. The chatbot-correspondence, sycophancy, and knowledge-cutoff patterns from `sounding-human` (#20-#22) have no application here.

---

### Structure

The full frontmatter schema is in `.claude/rules/entity-files.md`. The load-bearing fields:

- `id` — immutable; must match the pin id in `data/pinned.json`; never reassign it.
- `name` — the canonical display name.
- `entityType` — drives rendering and length expectations.
- `blurb` — 25 words or fewer; the one-sentence summary shown in map popups.

Pinnable entities (towns, cities, fortresses, POIs, ruins, and similar) also carry `coordinates` and `zoomLevel`. Do not reproduce the full schema table here; consult the rule file.

Containment is a `spatial/within` edge, not a frontmatter field. Do not use `parent`. See `.claude/rules/entity-relations.md` for edge vocabulary.

The body opens in the entity's own context. Do not re-explain the container — what region holds it, what civilization built it — except as a brief orienting clause. Full context lives in the container's article.

Two sentinels partition the file into distinct output fields:

```
[lore body]

<!-- mechanics -->
[TTRPG rules, stat blocks, encounter notes]

<!-- author-notes -->
[private authoring reminders, open questions, notes to self]
```

`<!-- mechanics -->` splits everything after it into a separate `mechanics` field in the compiled output. It is still emitted publicly, just separated from lore. 76 files use it today.

`<!-- author-notes -->` must be the final block. `build-codex.mts` strips it entirely from all public output — it never reaches a player or reader. Use it for open questions, continuity reminders, anything you would write on a sticky note. Zero files use it yet; this guide establishes the convention. It must never appear before the mechanics block.

---

### Length by importance

The `weight` frontmatter field is set in 1 of 3,541 entity files. It is effectively unused. Length guidance leans on `zoomLevel` and `entityType`, not `weight`.

Low-zoom entities — waypoints, minor water features, unnamed wilderness patches, small towns with no story role — get 2-3 tight sentences and no section headers.

Multi-section depth is for entities that carry actual story weight: regions, nations, planes, daemons, capitals, legendary artifacts. Even then, earn each section. A two-paragraph entry with one live hook outweighs four padded sections.

`weight` is worth populating going forward; it could eventually drive tooling. But do not assume it is set when assessing what any given entity deserves.

This section is the universal length kernel. Type-specific section patterns and length expectations — how a region, a magic system, a race, an era, or a daemon is each fleshed out — live in the per-type rules under `.pi/rules/<entityType>.md`, which load automatically from frontmatter when you read an entity of that type.

---

### Process

Before writing anything, read the container entity, the members, every entity named in `relations`, and the spatial neighbors. This is not optional background; it is the primary defense against contradiction. Borders are the retrieval trigger: load every entity on the other side of a border before asserting what lies there.

Containment and adjacency come from the map, not from distance rankings. Run `alaria-codex map shot` to see the actual geography. See `.claude/rules/codex-cli.md` for the full id-resolution and map-reading workflow. Drawn national borders are authoritative when present: they are thin, maroon (roughly `#7A492F`), and a tight radius of 6-10 in `map shot` is needed to read them clearly. Baked map symbols read next — the red capital star, red triangles for peaks, serif region names, road lines, river courses. When those run out, `entityType` disambiguates: the capital is the `city` among a region's members. The language family of place names is a last-resort membership cue (Nordic dwarf towns read differently from English-flavored human ones) when borders, symbols, and `entityType` are all ambiguous. Settlement proximity alone means nothing; the nearest pin is often across water in a different polity.

The Wikipedia summary model governs how container and member articles relate to each other. A region article gives each notable member a one-sentence summary drawn from its `blurb`, then defers to the member file for detail. A member article opens in its own context and refers upward rather than restating container history at length. Violating this model produces duplicated lore, and duplicated lore diverges. Read the member file before writing its summary in the container. Read the container before writing the member's orientation clause.

Originality within a parent requires reading the siblings. Skim them. Find what defines each — its hook, its economy. Then write something different. One concrete specific beats three adjectives. Filler mystery ("none know its origins," "its purpose remains unclear") is one form of lazy mystery — see "Mysteries must have answers" below. Tropes should be earned or inverted: a standard fantasy beat is fine once per region, not once per town. The world has distinct levers — sky trade, leylines, three-strand death, daemon prayer-economics, Bryn's sentience and its political consequences — and those levers are more interesting than generic fantasy furniture.

This is a TTRPG campaign setting, not a museum. Entities that hand a GM a live dispute, a contested resource, a rivalry, a grievance are stronger than settled, harmonious ones. Conflict is most useful when it turns on something specific to Alaria: a sun-war over prayer coalitions, or a ruin stranded when the sun changed course. Don't manufacture darkness for its own sake. Alaria's geography and factions already hold sufficient tension; the job is to surface it.

When lore doesn't cohere, rewrite it to cohere. Do not rationalize a broken detail by inventing a justification that preserves it. The one exception is established canon — the locked invariants in `world-systems-invariants.md`. Those must be consulted before any cosmological claim, and conflicts with them must be flagged rather than papered over with an in-universe explanation. A contradiction with a locked invariant is a bug in the entity file, not a feature.

Build/output discipline: see root `CLAUDE.md`.

---

### Mysteries must have answers

An open-ended mystery is banned unless a concrete answer exists in the world.

"Everyone who enters that ocean never returns" with no stated or recorded cause is the canonical violation. It gives the reader nothing and costs the GM a lever: there is no secret to reveal, no cause to be defeated or negotiated with, no way for a player's investigation to pay off.

The answer must be knowable to the GM even when it is deliberately withheld from players in-game. When the player-facing body leaves the cause implied, record the real answer in the `<!-- author-notes -->` block — `build-codex.mts` strips it from all public output.

Before:
> Ships that sail beyond the Ashen Line do not return. Sailors from every port have tried. None have come back. What lies there, no one knows.

After (cause in-text):
> Ships that sail beyond the Ashen Line do not return. The Line marks the outer edge of the Dawnward Current's reversal — vessels that cross it enter a permanent westward gyre with no wind to beat back against. Most sailors find this more unsettling than a monster would be.

After (cause in author-notes):
> Ships that sail beyond the Ashen Line do not return. The reason is not weather or creature. Players who investigate will find the trail cold.
>
> `<!-- author-notes -->`  
> The Ashen Line is a deliberate exclusion maintained by the Tidewarden compact. Vessels that cross are intercepted and escorted to a quarantine port on the far continent. The compact has kept the fiction of disappearance for three centuries to prevent mass migration. The Harborflame merchant council knows; the Theocracy does not.

---

### Cross-references

- `docs/worldbuilding/world-systems-invariants.md` — canonical cosmology; consult before any planar, magical, or cosmological claim; the coherence exception in the process section points here.
- `.claude/rules/entity-files.md` — full frontmatter schema and `entityType` enum.
- `.claude/rules/entity-relations.md` — edge vocabulary, `within` semantics, `capitalOf` and other typed edges.
- `.claude/rules/codex-cli.md` — id-resolution, `map shot`, neighbor queries, and CLI mutation rules.
