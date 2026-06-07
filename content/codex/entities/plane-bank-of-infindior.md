---
id: "plane-bank-of-infindior"
name: "Bank of Infindior"
entityType: plane
banner: "https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images/plane-bank-of-infindior/banner.webp"
blurb: "Bank where time doesn't pass, but anything is immediately accessible."
tags: ["poi"]
relations:
  - { rel: possession, kind: guards, target: "magic-red-platinum", note: "the few Crimson Crowns of red platinum are vaulted here, outside time and reach" }
  - { rel: possession, kind: guards, target: "magic-titan-blood-bones", note: "the great houses keep their titan-bone reserves of last resort in the time-frozen vault" }
sources:
  - "cosmology_and_religion/alarian_planar_stack/planes/Bank_of_Infindior.md"
review:
  aiWritten: false
  action: keep
---
The Bank of Infindior is a place where time does not pass. It is not a layer of the cosmological stack and not a seventh plane, but a single bounded room pinched off the world through one door, and inside that room the Izzus time-current has been stalled to nothing. A coin left there does not age. A document does not yellow. A wound does not close and a held breath does not run out. The bank is reached only through its door, which stands in the small Frostmarch state of Kyorda on the Denrik Sea, within easy reach of the Adron counting-houses that use it most.

What the stillness buys is custody no ordinary vault can match. Whatever crosses the threshold is held outside time and outside reach — untouchable by rust, by rot, by a creditor's writ, by a court order, by an heir, by a thief. The great banking houses keep their titan-bone reserves here, the few Crimson Crowns that exist, and the fortunes that other parties would dearly like to seize. And the bank does the reverse just as readily: for a price it will take a thing in and make it inaccessible to its own owner, freezing an estate, a relic, or a debtor's collateral so completely that no power in the living world can touch it until the bank releases it.

That second service is where the trouble lives. A thing put beyond time is a thing put beyond a court, a war, a marriage settlement, or a dying man's will, and a great many of the deposits at Infindior are there not to be kept safe but to be kept from someone. A contested inheritance frozen until the claimants are themselves dead. A war-chest sealed where the enemy who is winning cannot spend it even after the battle is lost. The bank asks no questions about whose freeze it is enforcing, which makes it indispensable to the wider financial layer and a standing hazard to anyone on the wrong side of a deposit slip.

<!-- mechanics -->
Time inside the vault is held at zero relative to the Material Plane: an object or person inside experiences no duration at all, and emerges exactly as it entered however long the outside world has run. Access is keyed to the depositor, not the holder — a frozen deposit cannot be reached by force, scrying, planar travel, or legal authority from the material side; only the bank's release (or the satisfaction of whatever release-condition was contracted at deposit) opens it. A living being placed under a freeze does not die and does not age, but also cannot act or be acted upon until released, which has been used as both sanctuary and prison.

<!-- author-notes -->
Origin (GM-knowable, withheld from public prose): the stillness is an Izzus time-seam node where the time-current drops to zero, walled off and held by the bank rather than a manufactured magic. Ties to magic-time.md (the Izzus current) and to the time leyline that crosses northern Adron per adron.md; Kyorda sits near that line on the Denrik Sea. There is a cosmological answer (a leyline anomaly the bank harnesses and guards), not a hollow "no one knows how it works" — a party that investigates finds a time-seam and its keepers, not a miracle.

Stack-safety: deliberately framed as a bounded pocket reached through one material-world door, NOT a layer of the six-plane stack and NOT a seventh true plane, to avoid contradicting world-systems-invariants.md (Planes row) and planar-stack.md. entityType stays `plane` per the existing review-kept frontmatter; the prose denies it is a stack-layer.

Currency role (currency-worker pass): positioned as the reserve-custody / supra-secure vault of the credit layer in docs/worldbuilding/systems/currency.md — holds titan-bone reserves (the reserve of last resort) and the Crimson Crowns (red platinum), and the freeze mechanic is named as a financial weapon. The possession/guards edges to magic-titan-blood-bones and magic-red-platinum are authored in this file's frontmatter. The map pin is the separate POI entity bank-of-infindior.md (id manual-mphbxx52-8k3hb), within Kyorda (405).
