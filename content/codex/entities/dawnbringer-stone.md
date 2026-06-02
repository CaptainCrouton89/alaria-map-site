---
id: "manual-mph4psob-48u4u"
name: "Dawnbringer Stone"
entityType: poi
blurb: "A standing stone on Shyona's far-northern coast that holds Dawnbringer, the fire-and-light sword forged at the distant Temple of Bryn and borne north."
coordinates: [585, 114]
zoomLevel: 5
relations:
  - { rel: spatial, kind: within, target: "338" }
---
The Dawnbringer Stone stands on the cold far-northern coast of Shyona, a weathered pedestal of grey rock at the edge of the Norswell Sea where the golden plains give out into shingle and salt wind. It holds a sword. Dawnbringer was forged a continent away to the south, at the Temple of Bryn beneath the Sandreach, where the fire and light leylines crossed and the temple's smiths drew the two together into a single blade. The temple is a glass ruin now, scoured when the volcano Belu Jenari pushed up burning out of the desert. The sword was carried north after that ending, set on this stone, and left.

Who brought it here, and why, no one can say. The temple kept no record of itself that came through the burning, and whoever made the journey left no name on the stone or in any account of the coast. The blade simply arrived, in a season no one wrote down, and has stood on its pedestal long enough that the rock beneath the grip has worn smooth.

A forged thing carries only what was worked into it. Dawnbringer holds the fire and light beaten into its steel at the convergence, and it draws nothing fresh from this cold shore, far from any seam. So it does not flare or surge the way the live crossing at the temple still does. It gives off a steady warmth and a low even light it has no business holding, here at the edge of a sea that freezes its own spray.

The effect is plain to anyone who comes near. Frost will not hold on the stone or the ground a few paces around it. The shingle there stays bare and faintly warm through the worst of the Norswell winter, when everything past that ring is locked white, and fishermen working the southern shallows steer by the glow on dark nights. A traveler who walks up to the pedestal feels the cold drop away by degrees, and the light in the steel catches the salt haze like a coal that will not go out. The coast folk leave it where it stands. They do not climb the pedestal or close a hand on the grip, and the older among them will only say that a thing this warm on a shore this cold is owed a wide berth.

<!-- author-notes -->
DAWNBRINGER STONE RECONCILIATION (decided this wave; resolves the name collision with temple-of-bryn 3681).

This northern POI (id manual-mph4psob-48u4u) is the SOLE canonical Dawnbringer Stone and the resting place of the sword Dawnbringer. The sword was FORGED at the Temple of Bryn (id 3681, far to the south beneath the Sandreach), at the seam-fed convergence-anvil there, and borne north after the temple was scoured in the birth of the volcano Belu Jenari. WHO carried it and WHY is deliberately lost — consistent with temple-of-bryn lore that no one now knows who raised the temple and that its records burned. Not a filler mystery: the answer is that the bearers and the temple's records are both gone, so the trail is genuinely cold rather than withheld.

BANKED-ARTIFACT logic: the blade is away from its forge-seam, so it holds the fire and light worked into the steel at forging rather than drawing fresh from any convergence. Hence steady warmth and low even light, no flare/surge, no blinding-amplification hazard (that hazard belongs to the live Kunus seam at the temple, not here). The cold-coast contrast (frost-free ring, fishermen steering by the glow) is the visible signature of a banked fire/light Kethic artifact.

EDGES (one direction only; reverse computes):
- spatial/within → 338 (Shyona). The pin sits in the Norswell Sea's southern shallows, but water bodies are never containers, so the coastal feature attaches to the Shyona landmass/region per the codex-cli rule.
- NO typed edge to temple-of-bryn 3681: there is no clean edge kind for "the sword this holds was forged there." The Temple of Bryn is named in prose, which auto-links the two entities. Do not force a typed edge.
- NO attunedTo: the Stone is a resting place far from any light seam, not a seam site. Its elemental nature is the sword's, conveyed in prose only.
