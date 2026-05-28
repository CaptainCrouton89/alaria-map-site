# Topic F — Graph-based canon control at scale

This document tests the Alaria thesis that "the edge graph is canon, prose is a leaf-level artifact" against published precedent at 1k, 10k, and 100M+ entity scales. It informs Foundations item #5 (canon-lint tooling) and, more dangerously, asks whether the load-bearing architectural bet survives contact with the largest precedent (Wikidata, 122M entities) that actually attempted it.

## Precedents

### Wikidata (Vrandečić & Krötzsch, *Wikidata: A Free Collaborative Knowledgebase*, CACM 2014)

The largest published structured-knowledge graph: 122 million items, 1.65 billion statements, 13,514 properties as of August 2025 ([Wikidata:Statistics](https://www.wikidata.org/wiki/Wikidata:Statistics), accessed 2026-05-28). Three architectural choices matter for Alaria.

First, the qualifier mechanism. Statements take structured property-value pairs as qualifiers — `start time (P580)`, `end time (P582)`, `point in time (P585)`. P585 has 18.6 million uses, P580 has 13.5 million ([Wikidata Top 100 Properties](https://www.wikidata.org/wiki/Wikidata:Database_reports/List_of_properties/Top100)). Time-binding is first-class graph structure, not a note.

Second, references. Sourcing is a separate package of property-value pairs (`stated in P248`, `reference URL P854`, `retrieved P813`) attached to a statement. Statement rank (`Preferred`, `Normal`, `Deprecated`) marks contested or superseded claims while retaining them for completeness ([Wikidata:Statements](https://www.wikidata.org/wiki/Help:Statements)).

Third, the role-qualifier pattern. Rather than minting `friend-of`, `lover-of`, `mentor-of`, etc., the Narration WikiProject uses one generic `significant person (P3342)` plus an `object has role (P3831)` qualifier ([P3831 docs](https://www.wikidata.org/wiki/Property:P3831)). This is the published anti-proliferation pattern.

### Wikidata's failure to become canonical over Wikipedia prose

In the 2018 Infobox RfC, the English Wikipedia community refused to make Wikidata-powered infoboxes standard ([Wikipedia:Wikidata/2018 Infobox RfC](https://en.wikipedia.org/wiki/Wikipedia:Wikidata/2018_Infobox_RfC)). When values conflict, local prose wins: infobox templates retrieve Wikidata values "only in the absence of a locally supplied value." Wikidata's own verifiability policy disclaims the goal — it records "what sources say, not what is true" ([Wikidata:Verifiability](https://www.wikidata.org/wiki/Wikidata:Verifiability)). Abstract Wikipedia, the project that would close the loop and generate prose from structured data, was assessed in 2023 by external Google Fellows as at "substantial risk of failure" ([Wikipedia Signpost, 2023-01-01](https://en.wikipedia.org/wiki/Wikipedia:Wikipedia_Signpost/2023-01-01/Technology_report)).

### Traveller Universal World Profile (Marc Miller, *Traveller5*, 2013; T5 Second Survey)

The strongest precedent for typed-data-as-canon in fiction. Each of ~11,000 worlds has a UWP code encoding starport class, world size, atmosphere, hydrographics, population, government, law level, tech level — eight discrete numeric or alphanumeric fields. Marc Miller designated TravellerMap.com / T5SS as the authoritative source; when adventure prose contradicts UWP, UWP wins ([Traveller:Canon](https://wiki.travellerrpg.com/Traveller:Canon); [Second Survey Data](https://travellermap.com/doc/secondsurvey)). This has held since 2006.

### SNPedia (Cariaso & Lennon, *Nucleic Acids Research*, 2012)

Built on Semantic MediaWiki. 109,729 SNPs and 537 medical conditions as of 2019, with structured genotype-phenotype edges driving the Promethease report tool ([SNPedia on SMW wiki](https://www.semantic-mediawiki.org/wiki/SNPedia)). Structured edges are upstream; prose is downstream. The reason it works: closed-world domain, external ground truth (published papers), enumerable values.

### World Anvil and Kanka

Two production worldbuilding tools that do not use a controlled edge vocabulary. World Anvil ships Diplomacy Webs (free-text relation label + a -100/+100 numeric attitude score) and Family Trees (kinship dropdown), restricted to specific article types ([World Anvil blog, *Diplomacy Webs*, 2020-08-18](https://blog.worldanvil.com/2020/08/18/diplomacy-webs-interactive-organizations/)). 3.5 million users. Kanka exposes a fully free-text `relation` string with an attitude integer and a `two_way` mirror flag — verified in the Go client at [Henry-Sarabia/kanka/relation.go](https://github.com/Henry-Sarabia/kanka/blob/master/relation.go). 375,000 users. Neither tool exposes the family / kind two-level structure Alaria already has.

### Semantic MediaWiki (Krötzsch, Vrandečić, Völkel, *Semantic MediaWiki*, ISWC 2006)

Flat property namespace. 18 core datatypes. The pre-1.0 split between Relations (Page-type, `::`) and Attributes (literal, `:=`) — the closest off-the-shelf precedent for Alaria's family / kind two-level grouping — was collapsed into one namespace in modern SMW ([SMW Help: List of datatypes](https://www.semantic-mediawiki.org/wiki/Help:List_of_datatypes)). Constraint schema introduced in 3.1.0 covers six checks: `must_exists`, `unique_value_constraint`, `single_value_constraint`, `shape_constraint`, `non_negative_integer`, `allowed_namespaces` ([SMW Help: Constraint schema](https://www.semantic-mediawiki.org/wiki/Help:Constraint_schema)).

### SHACL (W3C Recommendation, 2017)

The W3C standard for typed-edge graph constraints. Core covers value-type (`sh:class`, `sh:datatype`, `sh:nodeKind`, `sh:in`), cardinality (`sh:minCount`, `sh:maxCount`), value range (`sh:minInclusive`, `sh:maxInclusive`), string (`sh:pattern`), property-pair (`sh:equals`, `sh:disjoint`, `sh:lessThan`), logical (`sh:and`, `sh:or`, `sh:xone`, `sh:not`), shape closure (`sh:closed`), and path (`sh:inversePath`) ([W3C SHACL](https://www.w3.org/TR/shacl/)). Cycle detection is not in Core; recursive shape behavior is formally undefined.

### Glorantha (Stafford, 1966–2018) and the YGWV doctrine

Stafford explicitly rejected the graph-as-canon model. Different sourcebooks present mutually contradictory accounts by design. "Your Glorantha Will Vary" was codified as a publisher policy ([Glorantha](https://en.wikipedia.org/wiki/Glorantha); [False Machine, *Thoughts on the Glorantha Sourcebook*, 2019](http://falsemachine.blogspot.com/2019/10/thoughts-on-glorantha-sourcebook.html)). After 50 years of multi-author publication, contradiction-tolerance is the published architecture, not contradiction-prevention. Mongoose-era sourcebooks that contradicted Stafford were "Gregged" — overruled by author authority, not by tooling.

### Obsidian Relations plugin and Dataview

The Relations community plugin ships nine default kinds — `ally, enemy, family, friend, rival, spouse, lover, mentor, parent` — with per-type symmetric / pair / tree / genealogy flags ([Obsidian Relations Plugin](https://community.obsidian.md/plugins/relations)). The Wikilink Types plugin (penfieldlabs) ships 24 defaults including `supersedes` and `contradicts`. Dataview's "queries-as-lint" pattern (Goodman, [*Finding orphans in Obsidian*, 2025-05-05](https://www.cgoodman.com/blog/2025-05-05-obsidian-orphans/)) covers orphan detection and 1-2 hop dangling references; at 3,000 notes a Dataview query takes ~30 seconds ([blacksmithgu/obsidian-dataview Discussion #2151](https://github.com/blacksmithgu/obsidian-dataview/discussions/2151)).

## Techniques that work

### Two-level vocabulary with a role qualifier (Wikidata)

Combining a small generic edge with a role qualifier outperforms minting a new kind per nuance. Wikidata uses `significant person (P3342)` + `object has role (P3831)` to handle hundreds of character relationships (friend, rival, love interest, betrayer) without a per-relation property. The graph stays small; the role lives in structured graph data, not a freeform note.

### Statement rank for contested claims (Wikidata)

`Preferred`, `Normal`, `Deprecated` ranks let two contradictory statements coexist as graph structure. `Deprecated` is a first-class state, not a deletion. The competing claims remain queryable; only the consumer's projection chooses one ([Help:Ranking](https://www.wikidata.org/wiki/Help:Ranking)).

### References as structured packages (Wikidata)

Source attribution is property-value structure, not prose. `stated in P248` + `reference URL P854` + `retrieved P813` per statement. This means "scholar X said Y" is a graph fact a linter can check, not a sentence inside a note field.

### Authoring-time enforcement beats post-hoc reporting (Wikidata)

The dominant finding in the Wikidata operational record. The 2020 Property Constraints Report ([Wikidata:2020 report on Property constraints](https://www.wikidata.org/wiki/Wikidata:2020_report_on_Property_constraints)) and the September 2024 violation summary ([Wikidata:Database reports/Constraint violations/Summary](https://www.wikidata.org/wiki/Wikidata:Database_reports/Constraint_violations/Summary)) show 50M+ value-type violations on P31 alone, with the Faber et al. quality study (arXiv:2107.00156) finding that only ~1 in 3 violations ever gets corrected. Advisory constraints accumulate; mandatory constraints that block invalid writes do not.

### SHACL's seven check categories as a complete checklist

Value-type, cardinality, value-range, string, property-pair, logical, and shape-closure cover the formalizable space. Anything outside these requires either SHACL-SPARQL (custom logic) or human review.

### Closed-world structured schema + designated authority (Traveller)

Traveller's UWP fields are enumerated. Each entity has the same eight properties. One person (Miller) decides conflicts. This is what made structured-as-canon hold for 40 years at 11,000 entities.

### Narrow schema + external ground truth (SNPedia)

When the structured claims are verifiable against external citations and the value space is closed, the graph stays clean even at 100k+ entities.

### Dataview queries-as-lint (Obsidian)

At sub-3,000 entity scale, ad-hoc queries surface orphans and dangling references cheaply. Above that scale the pattern degrades; production graphs need indexed constraint runs.

## Failure modes

Each failure mode below carries an operational name a linter can target.

### Kind sprawl (Wikidata, DBpedia, Schema.org)

The vocabulary grows monotonically and contributors lose enumeration. Wikidata went from ~900 properties at launch (2014) to 13,514 by 2026 ([Wikidata:List of properties](https://www.wikidata.org/wiki/Wikidata:List_of_properties), accessed 2026-05-28). Schema.org currently lists 1,529 properties across 823 types ([Schema.org for Wikipedia](https://en.wikipedia.org/wiki/Schema.org), accessed 2026-05-28). DBpedia reached 3,500+ properties by 2017 with mapping contributors documented as unable to enumerate the full set ([Rico et al., *Predicting Incorrect Mappings*, 2018](https://svn.aksw.org/papers/2018/SAC_DBpedia_mappings_alignment/public.pdf)).

### Synonym drift (DBpedia, Wikidata)

The same semantic relationship acquires two or more edge kinds. DBpedia's Mountain template (16,000 instances) had `dbo:height` competing with `dbo:elevation` for altitude — same fact, two properties, neither identified as duplicate without a data-driven audit (Rico et al. 2018). Doğan & Patel-Schneider (2024) identified 14,480 "culprit" classes in Wikidata whose misclassification cascades into millions of downstream violations ([Disjointness Violations in Wikidata](https://arxiv.org/html/2410.13707v2)).

### Bidirectional divergence (Wikidata RFC, 2012–2014)

When inverse edges are authored at both ends manually, they drift apart. Wikidata ran a 2012 RfC, *Make Symmetric & Inverse Property addition automatic and bidirectional*, documented 488 symmetric violations on `sex or gender (P21)` alone and "tens of thousands or more" across all symmetric properties, and closed the RfC stale in April 2014 without resolution ([Wikidata:RfC archive](https://www.wikidata.org/wiki/Wikidata:Requests_for_comment/Make_Symmetric_&_Inverse_Property_addition_automatic_and_bidirectional)). The Alaria rule "author one direction; reverse is computed at build" is the correct response — but only if enforced.

### Type-system collapse (Wikidata, Cyc)

Instance/class boundaries erode. Zhao & Takeda (2024) analyzed the October 2024 Wikidata dump (113.6M entities) and found "at least 40% of sampled entities exhibited classification errors," reaching 80–100% in some technical domains ([arXiv:2511.04926](https://arxiv.org/html/2511.04926v2)). Patel-Schneider's 2024 *Class Order Disorder* paper found 120 direct instance-of-self loops and 1,171 downstream cascade victims ([arXiv:2411.15550](https://arxiv.org/html/2411.15550v1)). Cyc hit the same collapse at ~1M assertions ([Yuxi Liu, *Cyc*](https://yuxi.ml/essays/posts/cyc/)).

### Cycle accumulation (Wikidata, SUBMASSIVE)

`within` cycles, `precededBy` cycles, `subClassOf` cycles silently break transitive closure. The SUBMASSIVE paper (Patel-Schneider et al., [arXiv:2412.15829](https://arxiv.org/abs/2412.15829)) reports cycle detection in production KGs requires MAXSAT solvers; the SPARQL cycle-detection query times out against the public Wikidata endpoint at 121M entities. Detection must happen at write time, not at corpus scan time.

### Orphan accumulation (Wikidata, Graphiti)

Deletion or rename leaves dangling targets. As of 2023-09-01, Wikidata had 4,112,295 redirects out of 109,531,235 items (a 3.75% redirect rate). 676,845 items carry the `permanent duplicated item (P2959)` flag — permanently unresolvable ID collisions ([Wikidata:Help:Merge](https://www.wikidata.org/wiki/Help:Merge)). The smaller-scale Graphiti / Neo4j tracker shows the same pattern: orphaned entity nodes accumulate indefinitely without explicit cleanup ([graphiti issue #1083](https://github.com/getzep/graphiti/issues/1083)).

### Time-binding rot (Wikidata, ACM WebSci 2018)

Edges with temporal qualifiers acquire incompatible time windows. Wikidata's qualifier taxonomy (Falquet & Aljalbout, [arXiv:2603.11767, 2025](https://arxiv.org/pdf/2603.11767)) shows ~20% of statements are qualified across 2,240 qualifier properties; the bitemporal-KG literature ([ACM WebSci 2018](https://dl.acm.org/doi/fullHtml/10.1145/3184558.3191637)) frames the inconsistency as a hard, unsolved class of bug. A free-text `when` does not catch a `ruledBy` from 300–450 contradicting a `capitalOf` from 400–500 on the same entity pair.

### Semantic drift (DBpedia, Wikidata P31)

A single edge kind acquires shifted semantics. DBpedia's `dbo:height` was populated for both mountain elevations and human stature (Rico et al. 2018). Wikidata's `instance of (P31)` accumulates 50M+ value-type violations because contributors push it to express relationships it was not designed for. The Alaria analog is documented in the repo's own Phase B notes: `inhabitedBy` already mixes specific entities and race-type entities.

### The graph-as-canon vote of no confidence (Wikipedia, 2018)

When a 122M-entity structured database that explicitly aimed to be canonical truth went to the largest prose wiki and asked to be authoritative, the community refused. Local prose overrides ([Wikipedia:Wikidata/2018 Infobox RfC](https://en.wikipedia.org/wiki/Wikipedia:Wikidata/2018_Infobox_RfC)). The Alaria scholar frame is a contradiction-absorption pattern, not a contradiction-prevention pattern; this RfC outcome is the reason the distinction matters at 10k scale.

### YGWV (Glorantha)

After 50 years of multi-author canon, Stafford's resolution was to officially declare that contradictions are not bugs. Worth naming because it represents the alternative Alaria has implicitly rejected: contradiction-absorbing by perspectivism rather than contradiction-preventing by tooling. The Alaria scholar frame is closer to YGWV than to Wikidata.

## Recommendations for Alaria

### The thesis survives at 10k only if the corpus stays narrower than the graph

The graph-as-canon claim in `plan/high-level.md` holds for relational fact edges (`within`, `capitalOf`, `ruledBy`, `borders`, `foundedBy`) and breaks for sentiment edges (`rivalOf`, `allyOf` once narrative motivation enters). The Traveller and SNPedia precedents confirm: structured-as-canon works when the schema is narrow and verifiable. Wikidata at 122M and Wikipedia's 2018 vote confirm: it does not work when prose authors write from memory and the schema expands to cover interiority.

The defensible position is to declare explicitly: edges are canonical for spatial, polity, economy, origin, history, and possession families; prose is canonical for motivation, voice, theme, and the contents of `note` fields. Cosmology and culture edges are mixed and require case-by-case adjudication. Add this as a section in `plan/high-level.md` — without it, the thesis is aspirational at 10k.

### Enforce at write time, not at corpus scan time

The Wikidata operational record is unambiguous. Advisory constraints accumulate violations indefinitely. Foundation #5 canon-lint tooling must run at the `edge add` / build step and block invalid commits rather than produce a post-hoc report. Hookify (already in this repo's toolchain) is the available enforcement surface. A linter that runs in CI but does not block will be ignored by entity #5,000.

### Lint check priority (replaces and extends the plan list)

Highest leverage first, based on Wikidata violation counts and Alaria's current exposure:

1. Dangling-edge / referential integrity — `target ∉ entity_ids`. Highest priority. Every entity rename in the current git diff is an opportunity for this. Must run at build and at `edge add`.
2. Type/range domain-range — for each edge kind, declare allowed source types and target types. `capitalOf` source must be a city/town; target must be a polity. `subraceOf` source must be a subrace, target a broad race. This is SHACL `sh:class` + Wikidata `value-type`. Catches misrouted edges that referential integrity misses.
3. One-direction violation — both ends of an inverse pair authored. Already a stated rule in `entity-relations.md`; lint it.
4. Cycle detection on `spatial/within` and `history/precededBy`. DFS at build time, run at every commit. At 10k entities a depth-first traversal completes in well under a second on a single core; the SUBMASSIVE solver cost (Patel-Schneider et al. arXiv:2412.15829) only becomes relevant past ~10M entities and is not in Alaria's scale envelope. Cyclic containment silently breaks the map renderer and the lineage queries.
5. Exclusivity / conflicts-with — `polity/allyOf` and `polity/atWarWith` between the same pair cannot coexist without a `when` window separating them.
6. Capital-of-nonexistent — the planned check, recast as a type/range check where the target type forbids `dissolved: true`.
7. Date sanity — `event.when` inside `era.start..era.end`, `person.birth < polity.founded` for `foundedBy`. Requires the era entity type from Foundation #4 to land first.

The two checks the plan currently lists that are lower priority than the above: orphan checking (already done) and date sanity (depends on era entities not yet authored).

### Vocabulary changes to `.claude/rules/entity-relations.md`

These changes require updating `entity-relations.md` and should be surfaced as decisions, not silent additions:

Consolidate `polity/vassalOf` and `polity/tributaryOf`. The DBpedia `height` / `elevation` precedent and Wikidata's disjointness data show synonym pairs drift. These two encode the same relationship at different intensities; the difference belongs in `note`. Keep `vassalOf`, retire `tributaryOf`, route the distinction to `note: "tribute only, no military obligation"`.

Consolidate `economy/paysTributeTo` with `polity/vassalOf` + note. Currently the economy family and polity family both encode tribute; one of them will drift.

Add a `role` field as an optional second qualifier on `culture/inhabitedBy` and `history/participatedIn`. Following Wikidata's P3342+P3831 pattern: rather than minting `inhabitedByMinority`, `inhabitedByDiaspora`, `ruledByOccupier`, use a single edge with `role: "minority" | "diaspora" | "occupier"`. This is the published anti-proliferation pattern. Add an enumerated allowed-values list per kind.

Add `attestedBy` and `disputedBy` to the cosmology family, target `person` (a scholar). Two scholars who disagree about whether the First Death preceded the First Dark author two separate `caused` edges, each carrying `attestedBy: <scholarId>`. The linter cross-checks that scholars on conflicting edges exist as persons and that the conflict is bidirectional (both `attestedBy` and `disputedBy` present). This makes the scholar-frame's contradiction-absorber machine-readable, which it currently is not.

The case for not adding a `flipSideOf` analog in cosmology is already met — `flipSideOf` exists. Wikidata's `alternate universe counterpart (P11799)` is its symmetric analog; the precedent supports keeping the edge.

### Time-binding decision

Free-text `when` matches industry practice at every worldbuilding tool except Wikidata. The thresholds that force a promotion to structured time-binding are two, either of which fires first: edges carrying `when` exceed ~500 across the corpus, or era entities (Foundation #4) ship. Either condition unlocks queries that the free-text field cannot satisfy.

The interim discipline: require `when` values to take one of two shapes — a bare year (`"1453"`, `"-220"`) or an era-id reference (`"era-godwar"`). The linter rejects free prose like `"shortly before the war"`. This is not full structured time-binding; it is a parseable subset that lets date-sanity checks fire without committing to a richer schema before Foundation #4. The shape constraint is enforced at `edge add` time.

### Scholar attribution as graph structure, not prose

The current scholar-attribution rule is prose-level. To make it machine-checkable, scholar disagreement must surface as `attestedBy` / `disputedBy` edges (above) plus a statement-rank analog. Borrow Wikidata's three-tier statement rank ([Help:Ranking](https://www.wikidata.org/wiki/Help:Ranking)): add an optional `rank: "preferred" | "contested" | "superseded"` field on edges. Contradictions then have two valid edges, both with `rank: "contested"`, each attested by a different scholar. The linter flags any pair of `contested` edges on the same source-target-kind that lack an `attestedBy`.

This change requires `entity-relations.md` to grow a new field (`rank`) and a new edge kind family (cosmology/attestedBy, cosmology/disputedBy, or a new family `attribution`). Flag this as a rule change.

### The failure mode the linter must catch with an operational name: synonym drift

`vassalOf` vs `tributaryOf` vs `subjectTo` is the DBpedia `dbo:height` / `dbo:elevation` pattern (Rico et al. 2018) in embryonic form. Add a linter check that runs a clustering pass over the vocabulary — string similarity plus co-occurrence on the same entity pair — and flags candidate synonym kinds for human review. At 10k entities the pass operates on at most ~50 distinct kinds, so it is computationally trivial. The Wikidata experience prescribes this as the cheapest anti-drift instrument.

### A specific test for whether graph-as-canon holds at 10k

Periodic prose-vs-graph audit. Sample 50 random entities. For each, extract the prose claims that should correspond to typed edges (where it is, who rules it, who founded it, who lives there). Compare to the graph. Count contradictions. If contradiction rate stays under 5% at 10k entities, the thesis holds. If it climbs above 15%, the project has hit Wikidata's failure mode and must either gate prose authoring on graph reads or accept Glorantha's YGWV resolution and stop claiming the graph is canon. Run this audit at 5k entities (early warning), 7.5k, and 10k.

The current corpus at 3,541 entities is past the Obsidian community's documented graph-view collapse threshold ([Obsidian forum thread on large-vault graph view](https://forum.obsidian.md/t/obsidian-graph-view-doesnt-work-for-a-large-vault/106287)). Synonym drift in Wikidata appears as soon as a second contributor authors a property with overlapping semantics (Rico et al. 2018; Doğan & Patel-Schneider 2024). Alaria is single-author plus AI generation; the equivalent trigger is AI sessions across separated context windows. That trigger has already fired in the Phase B `inhabitedBy` mixing noted in the project memory. The audit should start now.

### Rule changes this document proposes (surfaced for decision)

These changes require revising `.claude/rules/entity-relations.md` and `.claude/rules/scholar-attribution.md`. Each is a decision, not a silent recommendation.

1. Retire `polity/tributaryOf`. Route the distinction to `polity/vassalOf` + `note`. Synonym-drift prevention.
2. Retire `economy/paysTributeTo`. Route to `polity/vassalOf` + `note`. Cross-family synonym prevention.
3. Add an optional `role` field on `culture/inhabitedBy`, `history/participatedIn`, and `polity/ruledBy` with an enumerated allowed-values list per kind. Anti-proliferation pattern from Wikidata P3342+P3831.
4. Add an optional `attestedBy` field (target = `person` of type scholar) on every edge in the cosmology, culture, history, and origin families. Makes scholar disagreement machine-readable.
5. Add an optional `rank` field with values `preferred`, `contested`, `superseded` on every edge. Borrowed from Wikidata statement rank. Enables two contradictory edges to coexist as graph structure rather than be reconciled prematurely.
6. Constrain `when` to the shape: bare year, signed year, or `era-id` reference. Reject free prose at `edge add` time.

The thesis-level recommendation — declaring which edge families are canonical and which yield to prose — would require a new section in `plan/high-level.md`. The current text states "the graph is the canon database" without qualification (line 9). The Wikidata 2018 RfC outcome is the published precedent that this unqualified claim does not survive 10k-scale prose authoring. Adopting the qualification is the proposed change; rejecting the precedent and keeping the claim unqualified is the alternative. This document does not adjudicate; it surfaces the choice.
