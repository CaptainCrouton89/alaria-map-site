# Phase 6 — whole-diff review brief (Alaria economy/tech lore-cleanup run)

You are a fresh-eyes, non-implementer reviewer. Read the WHOLE uncommitted git diff and judge whether the cleanup run introduced any new contradiction, broken/dangling edge, or over-edited author-note. **Do NOT edit any files.** Report findings; the orchestrator fixes in-pass.

## What this run did (the diff you're reviewing)
1. **Aether-cluster casing** — capitalize **Aether** and **Lanthornium** as proper substance nouns (standalone + open compounds like "Aether engine"); lowercase ONLY hyphenated compounds (aether-tapper, aether-fed, aether-producing, aether-work) except at sentence-start/heading/entity-name; leave lost-Kethic **aetherial/aetherium** untouched (lowercase).
2. **De-conflation** — **aether-tapper** = the Lanthornian-fuel goblin variant (race-goblin-aether-tapper.md); **Etherweaver** = the native-Kethic-heritage goblin line (race-goblin-etherweaver.md). Distinct peoples whose names merely rhyme. They must NOT be conflated anywhere.
3. **Lanthornia cluster** — magic-aether + magic-lanthornium each carry `culture/originatedIn → plane-lanthornia` (one-direction-only, closes the plane-lanthornia orphan). plane-the-cosmos lists Lanthornia under "Other Known Stacks". Stale wishlist/casing author-notes in plane-lanthornia.md deleted; the eruption-coupling + "internal structure unspecified by design" + "eruption date not in canon" notes KEPT (informational, correct to keep).
4. **Edge wishlist pass** — a prior pass had already authored all well-fitting currency/economy edges; this pass added 0 new edges and instead **converted the now-stale "orchestrator will apply" wishlist author-notes into terse applied/decision records** in: adron, free-isles, plane-bank-of-infindior, shacklands, magic-red-platinum, faction-firemage-corps, faction-tarkhon-grain-exchange. 5 ill-fitting edges were DECIDED prose-only (free-isles silver→iron peg, person-belmonte creditor→Gorath, red-platinum↔red-gold counterfeit-test contrast, firemage→evertorch/vaznik, grain-exchange spatial/within→Enymu) — all because no edge KIND fits, NOT deferred.
5. **Index-inserts** — 2 new paragraphs in overview-factions.md §"Where the leverage comes from": a Firemage Corps coda appended to the *force* paragraph; a Tarkhon Grain Exchange paragraph after the Erasnus customs-master blockquote (pre-empting the Aldrichold/Aldriktch name collision).

## Already-verified by the orchestrator (don't re-litigate unless you find a real problem)
- `node scripts/build-codex.mts` = **3890 entities**; `node scripts/codex.mts report lint` = **errors:0** (all 6 error-severity checks at 0 — danglingTargets, capitalOfNonPolity, bothEndsDirected, worshipsTargetType, bordersWithinSameTarget, parentRaceInhabitant).
- `rg -nP "(?<![A-Za-z-])aether(?![A-Za-z-])"` = 0 hits (no stray lowercase standalone "aether"); standalone lowercase "lanthornium" = 0.
- The 7 "Aetherial" matches are out-of-scope proper nouns (the event-aetherial-reckoning cult + a quoted historical taxonomy term) — correct, leave them.

## Your checks (read the prose, not just the lint)
1. **Casing reads naturally** — spot-check the prose passages in the diff: does Aether/Lanthornium capitalization read as a consistent proper-noun convention? Any hyphenated compound wrongly capitalized mid-sentence (not at a sentence/heading/name boundary)? Any standalone substance ref left lowercase?
2. **De-conflation holds everywhere** — no file treats aether-tapper and Etherweaver as the same people; the disambiguation in race-goblin-aether-tapper.md is accurate; nothing in race-goblin-etherweaver.md, race-goblin.md, plane-astral-currents.md, or the docs reintroduces the collision.
3. **Index-inserts** — do the 2 overview-factions.md paragraphs read as essay *illustration* (not a roll-call list entry), match the facts in faction-firemage-corps.md / faction-tarkhon-grain-exchange.md, and not duplicate or contradict adjacent text? Is the Aldrichold/Aldriktch disambiguation correct?
4. **Converted author-notes** — for each of the 7 files, does the new applied/decision-record accurately describe what's actually in the frontmatter / prose? Any leftover "orchestrator will apply / no edges added" stale deferral? Any informational decision-note wrongly deleted, or any note over-edited beyond what was needed?
5. **Lanthornia** — does the originatedIn edge + the kept plane-lanthornia notes stay inside cosmology canon (plane rule: no invented stack geometry; eruption is one-directional debris)? Any contradiction with magic-aether.md / magic-lanthornium.md / plane-the-cosmos.md?
6. **No new contradiction or broken edge anywhere in the diff.**

## Output
Write findings to `context/phase6-review-findings.md` as a numbered list: each finding = {file:line, issue, severity (blocker/should-fix/nit), recommended fix}. If clean, say so explicitly with a one-line confirmation per check. Push a final summary (verdict + finding count). Do NOT edit entity files.

## Reference docs
- context/cleanup-findings.md — the casing + de-conflation DECISION + per-file edit list.
- /Users/silasrhyneer/.crtr/nodes/mq2t1af7-04fed881/context/edge-wishlist-plan.md — the validated edge/index apply-plan (full rationale for the 0-edges + 5-prose-only + 2-index decisions).
- context/loose-lore-audit.md — the run's audit + execution log.
- CLAUDE.md + .claude/rules/entity-relations.md — edge discipline (one-direction-only, target=id); .pi/rules/faction.md (factions non-geographic).
