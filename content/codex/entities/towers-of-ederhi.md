---
id: "658"
name: "Towers of Ederhi"
entityType: ruins
blurb: "Ancient spires of fused glass rising from the Jahazai sands."
coordinates: [213, 181]
zoomLevel: 5
sources: ["all_sections_formatted/Clueanda.md#L1623"]
relations:
  - { rel: spatial, kind: within, target: "652" }
  - { rel: origin, kind: ruinsOf, target: "event-the-glassing" }
---
Ancient spires of fused glass rising from the Jahazai sands. The Ederhi raised them by magic in the age before the desert, and the Glassing sealed them: when casting turned lethal, the shapers died at their work and the towers fused solid around them mid-growth. The glass is unlike anything modern artisans can produce, harder and clearer, faintly luminescent at night. No entrance has ever been found because there is no inside to enter. Treasure-hunters who cut into the spires find only more glass, threaded here and there with the shadow of a shaper caught in the work, and an Ederhi script no living scholar can read.

<!-- author-notes -->
The world's gap is closed: the builders are the Ederhi, the cause is the Glassing (event-the-glassing, the Kazül-local fall under the Blight of Arcanus, 12,000 BSD). The remaining in-world gap — treasure-hunters cannot read the Ederhi script, no entrance exists — is genuine and intended, not a banned mystery. `ruinsOf → event-the-glassing` is authored one-direction here (ruins → event); the event does not declare a reverse `caused` edge.
