---
id: "411"
name: "Adron"
entityType: region
blurb: "Adron is the easternmost state on the Middle Sea, a proud Naga kingdom set between mountain ranges, once the realm of bonded dragon-riders."
banner: https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images/411/banner.webp
coordinates: [323, 175]
zoomLevel: 2
tags: ["state", "nation"]
sources: ["all_sections_formatted/Clueanda.md#L142"]
relations:
  - { rel: spatial, kind: within, target: "9000" }
  - { rel: economy, kind: produces, target: "magic-red-gold" }
  - { rel: culture, kind: inhabitedBy, target: "race-naga-nagashi" }
  - { rel: culture, kind: inhabitedBy, target: "race-naga-megelren" }
  - { rel: culture, kind: inhabitedBy, target: "race-kendor-pelaendor" }
  - { rel: polity, kind: ruledBy, target: "person-mariseni" }
review:
  aiWritten: true
  archetype: ai-ok
  action: keep
  notes: "Coherent, on-theme Naga-kingdom region body. Map-confirmed: easternmost state on Middle Sea (E coast), Gozwin Mtns E (pin 585), Shrieking Peaks S (pin 764). Drakespine (central N-S) and Majesty Mtns (NE) have NO pins yet; Gemecas POI also unpinned — missing-pin refs for reconciliation, not inflation."
bannerPosition: "50% 6.9%"
bannerHeight: 360
---
Adron is the easternmost state on the Middle Sea, a proud Naga kingdom set between mountain ranges. For most of the early Seventh Dawn its Nagashi rode bonded war-dragons and warded the eastern sea from the air, the long age the rest of the coast named the Wyrmward. That age ended at the Severing, when the dragon-bonds were cut in a single night, and Adron now trades on banking, shipbuilding, and the red gold mined from its peaks. The climate is Mediterranean: warm coastlines, temperate forests in the valleys, snow-capped mountains along the horizon.

Three major ley lines cross Adron: water through the capital, time running southwest to northeast across the north, and dark through the center. Their intersections produce an unusually high number of elementally attuned Naga. The dark line carries the worst name of the three. The order that severed the dragon-bonds kept to it, and Nagashi who work darkness magic are watched in Adron, because of where that magic reaches on its far side: Malstaris, the gray plane that gathers the shadows of the dead.

Every Naga traces its blood to Nagatayora, the dragon-father, eldest son of Gaea and the first to fall in the war against the titan Hykravones. Adron does not worship him. He is long dead, gone since the deep cosmogonic age the world remembers as the Reign of Dragons, and the kingdom holds his blood as a trust rather than a god. That trust is the reason no Naga in Adron will kill a dragon. The bonded war-dragons of the Wyrmward were the trust made flesh; the wild dragons that have wandered back across the sea since the Return of Dragons are neither bonded nor wanted, and they are untouchable all the same. Chavux can raid the strait off the Blades and Adron will not lift a hand against him.

The Nagashi are Adron's people: the ruling houses and banks, the thinned-out heirs of the rider caste. The houses govern as a body from Adrak, and the foremost of them just now answers to Mariseni. The Megélren are here too, far fewer and far quieter. Adron tells itself they are traitor's blood cast out long ago, the story it hangs on the old Megélren Exile. The obsidian form answers to no such tidy history; it surfaces unbidden in any Naga line, in houses that never went near the Exile. What keeps the Megélren in Adron is the shadow economy, which has always found work for operatives who ask nothing and are owed nothing.

#### Mountain Ranges

**Gozwin Mountains**: Eastern coast along the Denrik Sea. Source of red gold and home to Waterdark.

**Majesty Mountains**: Northeastern range. Rich in red gold. The self-styled Dwarf King lurks here, claiming ancestral rights and robbing travelers.

**Shrieking Peaks**: Southern range, named for the wind that howls through the passes.

**Drakespine Mountains**: Central range running north-south, dividing eastern and western Adron. Named for the dragon riders who once patrolled its peaks.

#### Gemecas

A point of interest in eastern Adron, near the Gozwin Mountains.

<!-- author-notes -->
Present-skeleton + cosmogony pull-down authored by A3 Writer-3. Edges added: ruledBy → person-mariseni (newly minted present ruler; provisional name, flagged for lead sign-off). No occurredDuring on the region per AD15 (event-only); the Wyrmward / Severing / Return of Dragons are referenced in PROSE and gestured, not re-narrated — the spine events own the full account (event-dragon-rider-era, event-the-severing-of-the-dragon-bonds, event-the-megelren-exile).

Nagatayora reverence is PROSE-ONLY, NOT a worships edge: creature-nagatayora is a hero-tagged dragon, daemon-ineligible, and a worships edge to it is a guaranteed worshipsTargetType lint ERROR (AD13). The dragon-father is carried as ancestral/sacred-trust reverence in prose + the existing inhabitedBy lineage. "Reverence not worship" is stated explicitly in the body.

Darkness-magic → Malstaris flip-side (AD10): named lightly in the leyline paragraph; the full extraction (the Severing routed the dragon-bonds' shadow-half into Malstaris; the order's shadow-arm tapped that draw down the dark leyline) lives in event-the-severing-of-the-dragon-bonds author-notes. plane-malstaris.md is the canon source (shadows of the dead go to Malstaris).

Megélren framing: the body gives the racialized "traitor's blood" line AS the myth Adron tells itself, then denies it (the obsidian form surfaces unbidden in any line). This respects locked race canon (race-naga-megelren.md: "There was no such band"). The Megélren Exile (event-the-megelren-exile) was a political faction's expulsion, not a blood's; do NOT let any future edit correlate obsidian scale with the exiles.

Crown/houses reconciliation: adrak.md says "seat of the monarchy"; this body frames the crown as nominal, held by whichever banking house stands first (presently Mariseni's). No contradiction — the houses rule, the crown is ceremonial. adrak.md left untouched (light-touch; already strong).
