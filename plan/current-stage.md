# Current Stage — Foundations & Tooling

**Goal of this stage:** lock the small, finite reference frames and the contradiction-control tooling *before* mass-generating history. Generate 1,000 wars before the foundations exist and you spend the following years untangling them. These foundations are deliberately bounded — build them, then stop and turn the crank.

Do **not** start mass history generation in this stage. The last item is a single-region proof-of-concept, not a green light to scale.

## Sequence

1. **Pantheon roster (pantheon-over-time).**
   - Produce the set of named daemons: dead/old, current, rising. Size for ~50–100 cultures × 0–5 patrons with overlap → ~60–150 daemons so worship isn't monotonous.
   - Each daemon: domain, era of ascension (and death, if dead), the culture(s) that worship it.
   - This gates `worships` edges everywhere downstream.

2. **The 7 major scholars (+ seed the 13 niche).**
   - Each major: name, era they wrote in, culture, patron daemon, signature bias, and the era/theme they own. They are `person` entities on the timeline.
   - Define a lightweight convention for how a scholar's *note/commentary* attaches to an entity (so disagreement can be authored as attribution rather than reconciled away).

3. **Onomastic sheets, extracted from the map.**
   - Per race/culture: sound palette, common morphemes, naming customs — *derived from existing map names*, not invented. Dwarf=Norse, elf=Tolkien-elf, halfling=British/medieval as starting anchors; confirm against the map.
   - Output is a reference AI uses to keep new names consistent with what's already drawn.

4. **Era entities.**
   - Break the monolithic World Timeline into navigable `era` nodes so each can deepen independently and events can `occurredDuring` them.

5. **Canon-lint tooling.**
   - Cheap checks against the edge graph: dangling/`not_found` edge targets, date sanity (e.g. born-after-death, fought-before-born), capital-of-nonexistent-nation, orphan sweep (`report list --within false`), one-direction-only edge violations.
   - This is the instrument that makes scale survivable; build it before scale.

6. **Pincer prototype — ONE region.**
   - Pick one region. Run present → ~100 yrs prior → deeper, while pulling the cosmogony down to meet it. Prove the loop end-to-end (events authored, edges wired, scholars attributed, names consistent, linter clean) before turning the crank on fifty regions.

## Open questions (unresolved — answer before/within this stage)

- **Flip-side material:** is there existing Malstaris/Celestia/Labyrinth history, or is it the emptiest room? Determines whether foundation #4 (and the parallel-timeline work) is *extraction* or *invention*.
- **Prototype region:** which region runs the pincer first?

## Done when

- The pantheon roster exists and is sized.
- The 7 majors are authored with biases + the note/attribution convention works.
- Onomastic sheets exist for the major races.
- Eras are discrete entities.
- The linter runs and the corpus passes (or its failures are catalogued).
- One region has been taken through the full pincer loop as a repeatable template.
