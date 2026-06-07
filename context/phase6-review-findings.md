# Phase 6 — whole-diff review findings (Alaria economy/tech lore-cleanup run)

Reviewer: fresh-eyes, non-implementer. Scope: the entire uncommitted diff (tracked + the 5 untracked
entity files). No files edited. Build/lint/casing-grep were green going in; this pass is prose-level
judgment only. Verdict and counts in the pushed summary.

## Findings (numbered)

1. **overview-factions.md:34 — "the most concentrated military power in the south" — should-fix (borderline nit).**
   Issue: the index-insert places the Firemage Corps / Tarkhon Empire "in the south," but Tarkhon's
   capital and the Corps' actual seat, Tarkhetan (coords ≈[129,207]), sits north-central / Middle Sea —
   demonstrably *north* of the genuinely southern powers: Azantir/Gorath ([263,336]) and the Free Isles
   ([210,422]). Two corroborations: (a) the locked Currency invariant separates "the south (Kyagos,
   Aboyinzu, Shacklands, Free Isles)" from "Middle Sea core (the six Aldriktch members + the Tarkhon
   Empire)" — so Tarkhon is canonically *not* "the south"; (b) within this same diff,
   magic-titan-blood-bones.md:58 calls Azantir the "southern war-creditors," and Azantir is south of
   Tarkhon — internally inconsistent. Also a superlative escalation: the faction file claims only "the
   most concentrated military power **Tarkhon holds**" (internal), which the overview broadens to a
   regional "in the south." Mitigations (why not a blocker): magic-fire.md does use "fire-Kethic in the
   south" for the Neferati/Kingdoms-of-Fire sphere, and "concentrated" is carefully chosen vs Gorath's
   larger-but-dispersed legions, so the claim is defensible on the "concentration" axis.
   Recommended fix: match the faction file — replace "in the south" with "the most concentrated military
   power the Tarkhon Empire holds" (or "...on the Middle Sea"), dropping the regional superlative.

2. **overview-factions.md:30 — Grain Exchange "no relation to the similarly named Aldriktch pact" — nit.**
   Issue: the disambiguation is correct and the brief intended it, but its trigger — the Exchange's alias
   "Aldrichold" (≈ "Aldriktch") — is never surfaced in overview-factions.md. To an overview-only reader,
   "Tarkhon Grain Exchange" and "Aldriktch pact" do not look similar, so "the similarly named" reads as a
   mild non-sequitur (the name it is similar to is invisible here). The faction file disambiguates cleanly
   because it shows "Aldrichold is not Aldriktch"; the index does not.
   Recommended fix (optional): surface the alias so the disclaimer lands, e.g. "The Tarkhon Grain Exchange,
   or Aldrichold — no relation to the similarly named Aldriktch pact —", or simply drop "similarly named."

## Clean checks (explicit confirmations, per the brief)

- **Check 1 — casing reads naturally: CLEAN.** Within the diff, every standalone substance noun is
  capitalized (Aether, Lanthornium); every hyphenated compound mid-sentence is lowercase (aether-tapper,
  aether-producing, aether-fed, aether-work); the only capitalized "Aether-" forms are at sentence-start /
  heading / entity-name boundaries (e.g. plane-astral-currents.md §"Aether-tappers"; the "Aether-tapper"
  entity name), which the convention permits. Lost-Kethic aetherial/aetherium correctly left lowercase and
  explicitly disjoined from foreign Aether (technology.md, era-lost-ages.md). No standalone substance ref
  left lowercase in the diff. (Out-of-scope note, NOT a finding against this run: race-goblin.md:67-68
  "Aether-lens/Aether-thrust/Aether-fed" and garlow.md:58 "Aether-powered" are pre-existing capitalized
  hyphenated compounds in lines this run did not touch — a future casing sweep could revisit them, but they
  are outside this diff.)

- **Check 2 — de-conflation holds everywhere: CLEAN.** aether-tapper (Lanthornian-fuel goblin) and
  Etherweaver (native-Kethic goblin) are kept distinct in every touched file. The disambiguation in
  race-goblin-aether-tapper.md:22 is accurate. The two prior collisions were *fixed* by this run:
  economy.md ("aether weaver goblins" → "aether-tapper goblins") and garlow.md ("Yuki's etherweavers" →
  "Yuki's aether-tappers"). race-goblin.md, plane-astral-currents.md, magic-aether.md, plane-lanthornia.md
  reintroduce no collision.

- **Check 3 — index-inserts read as essay illustration & match faction facts: CLEAN (aside from #1/#2).**
  Both new overview-factions.md paragraphs are written as essay illustration ("runs the opposite play",
  "the exception is the order that cannot be carried at all"), not roll-call list entries, and sit
  correctly inside the wealth- and force-paragraphs. The Firemage coda matches faction-firemage-corps.md
  (welded to one hill; edge is the seam; seam does not travel) except for the "in the south" geo-tag (#1).
  The Grain Exchange paragraph matches faction-tarkhon-grain-exchange.md (monopsony; empire as sole buyer;
  annual bread-price set; grading floor) except for the disambiguation opacity (#2). No duplication of or
  contradiction with adjacent text.

- **Check 4 — converted author-notes are accurate applied/decision-records: CLEAN.** All 7 files
  (adron, free-isles, plane-bank-of-infindior, shacklands, magic-red-platinum, faction-firemage-corps,
  faction-tarkhon-grain-exchange) describe what is actually in the frontmatter/prose. No leftover
  "orchestrator will apply / wishlist / no edges added" stale deferral survives (the only "DEFER" matches
  are content deferred to *other entity files* — e.g. Grain-Compact history to event-enymu-subjugation —
  which is correct cross-referencing, not orchestrator-wishlist language). Spot-verified: adron states the
  produces→magic-red-platinum edge "is authored in this file's frontmatter" (it is, line 14);
  plane-bank-of-infindior states the two guards edges are authored (they are); the 5 prose-only decisions
  (free-isles silver→iron peg, shacklands Belmonte creditor→Gorath, red-platinum↔red-gold counterfeit
  contrast, firemage→evertorch/vaznik, grain-exchange spatial seat) are each recorded as DECIDED ("no
  fitting kind"), not deferred. No informational note wrongly deleted or over-edited.

- **Check 5 — Lanthornia stays in cosmology canon: CLEAN.** magic-aether.md and magic-lanthornium.md each
  carry one-directional culture/originatedIn → plane-lanthornia (no double-authoring; lint bothEndsDirected=0
  confirms). plane-lanthornia.md invents no stack geometry ("internal structure left unspecified on
  purpose"), keeps the eruption strictly one-directional debris, and pins no eruption date. plane-the-cosmos.md
  lists Lanthornia under "Other Known Stacks." No contradiction among magic-aether.md / magic-lanthornium.md /
  plane-the-cosmos.md / world-systems-invariants.md (Aether remains foreign, NOT a fifth native source).

- **Check 6 — no new contradiction or broken edge: CLEAN (aside from #1).** All new edge targets resolve
  (2455=Tarkhon Empire, 2484=Enymu, 2574=Tarkhetan, event-enymu-subjugation, magic-red-platinum,
  magic-titan-blood-bones, plane-lanthornia, magic-fire — danglingTargets=0). The kyorda.md reframe
  ("no counting-house… lends nobody anything") now *agrees* with currency.md:61 and resolves a prior
  outlier (old kyorda.md had wrongly cast Infindior as a credit-lender); no other file still describes
  Infindior as a lender. The Bank-of-Infindior, Belmonte/Azantir war-credit, mark/weighed-silver,
  red-platinum/Crimson-Crown, titan-bone-reserve, and sky-stone-vs-fuel claims are all mutually consistent
  across the diff and with the locked Currency/Technology invariants. Titan-bone "nineteen parts in twenty"
  = ~95%, matching the invariant.

## Positive note (not a finding)

- mpehi.md & kokotintin.md "Five Families" → "four families" is a **correct** consistency fix, not a new
  contradiction: free-isles.md was reduced to Four Families (review note: removed the Velathi of Hik in
  Xabraedia) and upoceax.md already says "four families." These two were the last stale "Five Families"
  holdouts; the change aligns them. Beneficial; recommend keeping. (Technically rides slightly outside the
  stated casing/currency/de-conflation scope — flagging only to confirm it was intentional.)
