# Pantheon-over-time architecture

Research document for Foundations item #1: the daemon roster sized, statused, and gated against the same-five-gods failure. The question is structural, not aesthetic — how the canon database represents a god's lifecycle, how the roster is sized against culture count, what prevents cross-cultural collapse, and how a permanently-ended daemon is distinguished from one a culture has merely lost touch with.

## Precedents

### Glorantha (Stafford and successors)

Glorantha runs three lifecycle states without a `status` field. Active cults get full write-ups in *Cults of Prax* (Stafford & Perrin, 1979), *Cults of Terror* (1981), and the modern *Cults of RuneQuest* series (Chaosium, 2018–). Risen gods get a chronologically later chapter: *Cults of RuneQuest: The Lunar Way* (2024) names Lunars as "mortals who attained immortality," placing them after the primordial pantheons that crystallised in the God Time. Dead gods receive no cult entry at all; the publishing absence is the marker. The *Prosopaedia* (Chaosium, 2024) uses an omega symbol for deprecated cult entries, but that flags edition-currency, not in-world death ([Well of Daliath, *Prosopaedia*](https://wellofdaliath.chaosium.com/home/gloranthan-documents/prosopaedia/)).

The pantheon scale is the loud number. *Gods of Glorantha* (Avalon Hill / Chaosium, 1985) covered "60 religions" with a Prospaedia of "nearly 300 gods." The *Greater and Major Gods* tier alone lists 20 Greater + 36 Major = 56 named entries on Chaosium's current site ([Well of Daliath, *Greater and Major Gods*](https://wellofdaliath.chaosium.com/greater-and-major-gods/)). Twelve cultural-religious blocks (Orlanthi, Lunars, Praxians, Kralorelans, Pamaltelans, Mostali, Aldryami, Uz, Westerners, Doraddi, Hsunchen, Fonritans) carry largely separate rosters with limited overlap.

Anti-homogenization runs on three mechanisms. First, the rune system: cults organise around runes (Storm, Death, Earth, Moon, Fire) rather than divine identity, so "Storm" can be Orlanth for Orlanthi, Vadrus for raiders, and Molanni for Westerners without the entities collapsing into each other. Second, the God Learner heresy is an in-world demonstration of what goes wrong when myths get treated as equivalent: the God Learners performed a "Goddess Switch" between Dendara and Ernalda because both held Earth/Fertility runes, and the result was failed marriages in one region and barren trees in another ([Montgomery, *The Sin of the God Learners*, 2019](http://andrewloganmontgomery.blogspot.com/2019/09/the-sin-of-god-learners-metaphysics-of.html)). Their civilization sank. Third, the principle Stafford locked into *HeroQuest Glorantha* (Moon Design, 2015): "Both myths are true, even if they contradict each other, because they are both facets of the original event, which is only accessible through limited cultural knowledge, lenses and biases" ([Runeblog, *Cults of RuneQuest: Mythology review*, 2024](https://elruneblog.blogspot.com/2024/03/cults-of-runequest-mythology-review.html)). Stafford clarified on the Glorantha Digest that "I Fought We Won" was a Heortling myth specifically, not a pan-Orlanthi one ([*Glorantha Digest*, 2001](http://glorantha.temppeli.org/digest/gd8/2001.04/2616.html)).

Dead-god worship has its sharpest example in Genert. The Prosopaedia entry lists "No Runes" — the formal mechanical marker that no rune cult can form and no rune points can be drawn ([Well of Daliath, *Genert*](https://wellofdaliath.chaosium.com/home/gloranthan-documents/prosopaedia/deities/g/genert/)). "The Devil arrived with his chaos legions and slew the god Genert and destroyed his land forever" (*Cults of Prax*, 1979). Praxians still invoke his name to explain the Wastes, and the oasis gods plus Waha's Survival Covenant inherit his cosmological position, but the worship that survives is genealogical (descendant cults) and shamanic (the Hyena spirit, made by Genert to protect his body parts from Chaos), not direct.

### Forgotten Realms (Greenwood and successors)

Forgotten Realms is the setting that named the structural problem. *Faiths & Avatars* (TSR, 1996) opens with a chapter called "The Death of Powers" and groups Bane, Bhaal, Myrkul, Moander, and Leira under "the honored dead." Each entry uses the same template as a live god — appearance, portfolio, church, specialty priests — distinguished only by past-tense prose and absence of current ritual mechanics. The definition is explicit: "Dead powers learn nothing new, are unaware of activities in the Realms or elsewhere, can use none of their former divine powers...are about as conscious and useful as a rock" ([*Faiths & Avatars*, 1996, AnyFlip preview](https://anyflip.com/vjcbu/bhuv/basic)).

The 3.5e move was a small-format flag: *Powers and Pantheons* (TSR, 1997) cites dead deities inline with a parenthetical "(dead)" after the name ([PDFCoffee, *Powers and Pantheons*](https://pdfcoffee.com/forgotten-realms-powers-and-pantheons-pdf-free.html)). The 4e *Forgotten Realms Campaign Guide* (2008) abandoned the dedicated dead-deity chapter and scattered dead gods as lore sidebars. The 5e *Sword Coast Adventurer's Guide* (2015) and the 2025 *Heroes of Faerûn* reset the pantheon table without marking returned gods. Across four editions, the same setting tried four different structural treatments of the same metaphysical fact.

Sizing went badly. *Faiths and Pantheons* (Wizards, 2002) compiled 115 deities, and the aggregate across Faerûnian, Mulhorandi, Maztican, Zakharan, Kara-Turan, racial, and monstrous pantheons exceeded 250 ([Wikipedia, *List of D&D Deities*](https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_deities)). 4e cut to 18 greater gods plus exarchs — Wizards' designers said the goal was to support "a manageable subset." 5e backed off to roughly 36; the 2025 sourcebook reset again to "a neat pantheon of 40 gods" ([Gaming Nexus, 2025](https://www.gamingnexus.com/News/71977/)). Three pantheon resets in seventeen years is the failure signature.

Homogenization in the Realms is by design, not by accident. Greenwood: "from the start every mortal in all of the Realms 'believed in' ALL of the gods" ([Tesseracts 18, 2013](https://tesseracts18.com/2013/09/30/only-the-insane-believed-there-were-no-gods-ed-greenwood-speaks-of-religion-and-belief-in-forgotten-realms-part-1/)). The Mulhorandi (Egyptian-styled) and Maztican (Aztec-styled) subpantheons were quarantined sub-systems that don't bleed into Faerûnian worship, which proves the main setting could have been split this way and chose not to.

Dead-god worship had a documented interregnum. Bhaal was killed Eleint 16, 1358 DR. Urban Bhaalites defected to Cyric. Rural Bhaalites kept receiving divine spells from nightly prayer until 1367 DR — nine years after Bhaal's death ([*Forgotten Realms Wiki*, Church of Bhaal](https://forgottenrealms.fandom.com/wiki/Church_of_Bhaal); summarising *Faiths & Avatars*). The mechanism is never stated, but the read is residual: the dead god has stored power that bleeds off until the reservoir is empty. Bane re-entered via his half-mortal son Iyachtu Xvim; Myrkul's portfolio fragmented; Bhaal returned via the Bhaalspawn. None of the Dead Three stayed dead.

### Eberron (Baker)

Eberron treats every act of worship as structurally indistinguishable from worship of a dead god. Baker: "A divine spellcaster must have absolute faith in order to perform divine magic.… Someone can 'make up' a religion or abuse divine powers without consequences because faith is the channel through which you gain power, but the object of your faith may not be what you think it is" ([Baker, *Dragonmarks: Religion, Faith and Souls*, 2014](https://keith-baker.com/dragonmarks-411-religion-and-faith/)). The gods do not manifest. Visions could be divine, could be a night hag, could be a quori. Conviction is the conduit; verification is unavailable.

The pantheon is small on purpose. Nine Sovereign Host plus six Dark Six = 15 named gods, with the Silver Flame, Blood of Vol, Path of Light, Undying Court, and Cults of the Dragon Below adding institutional faiths whose objects are forces, mortals, or ambiguous aggregates rather than discrete deities ([*Faiths of Eberron*, Wizards, 2006](https://en.wikipedia.org/wiki/Faiths_of_Eberron)). The Silver Flame's editorial label is "young faith" — born within recorded history when the couatl race performed mass self-sacrifice in the Age of Demons. It is the only Eberron divine entity that grew measurably: "strengthened by the addition of millions of mortal souls" ([Baker, *Couatls and the Silver Flame*](https://keith-baker.com/dm-couatls/)).

Anti-homogenization runs on agnostic cosmology plus the Schism. The Dark Six were once Sovereign Host members cast out in an event each culture interprets differently; Sovereign worshippers still offer propitiation to the Dark Six. Baker's syncretism line is the operative one: "You may be worshipping the Lady Pine and the Horned Rider, but the fact of the matter is that your powers are coming from Arawai and Balinor." Local forms hold because nobody can verify whether they collapse into the same underlying deity. The inverse of the God Learner problem: Glorantha says collapsing the forms destroys the gods, Eberron says you can never know if they were ever separate.

### Tékumel (Barker)

Tékumel's pantheon is exactly twenty. Ten gods organised as five pairs along a Stability/Change axis (Hnálla/Wurú, Karakán/Chiténg, Thúmis/Grugánu, Avánthe/Dlamélish, Belkhánu/Sárku at the pair level), each with one cohort — covered in two volumes of *Mitlanyál: The Gods of Stability* and *Mitlanyál: The Gods of Change* (Tékumel Foundation, 2003). The Five Empires (Tsolyánu, Yán Kór, Mu'ugalavyá, Salarvyá, Livyánu) share the full twenty; cultural difference is which gods each empire emphasises, not which gods exist. The Stability/Change axis maps directly to political ideology — a martial state favours Change gods of war; a bureaucratic one favours Stability gods of order.

The lifecycle marker is documentation tier. Concordat gods get full *Mitlanyál* chapters with ritual circles, calendars, and clergy. The Pariah Deities — the Goddess of the Pale Bone, the One Other, the One Who Is — first appeared in *Strategic Review* (April 1976) and the *Tékumel Source Book* (Different Worlds, 1983, §1.610). They get "relatively limited" documentation, no *Mitlanyál* volume, no standard temple write-up, no playable clergy in the core rules. Sparseness is the marker; worship is legally prohibited "in the Tsolyáni Imperium" ([Hall of Blue Illumination, *Pariah Gods*](https://tekumelpodcast.com/podcast/episode-47-pariah-gods/)). Pre-Pavar religions get a historical frame: Pavar's arrival caused old faiths to be either "clarified" (absorbed as Aspects of Concordat gods) or "their worshippers persecuted and their temples razed" ([Tekumel.com, *Éngsvan hla Gánga*](https://www.tekumel.com/world_history08.html)).

### Calibration points

Warhammer Fantasy (*Tome of Salvation*, Black Industries, 2006) runs ~16–20 Old World gods plus four Chaos gods, with Sigmar/Ulric/Myrmidia as three different ideologies of war locked to three different geographies — Reikland Empire, Middenland, Tilea/Estalia. Ulric's cult forbids gunpowder; Myrmidia's embraces it. This is patron-god-as-political-ideology, not patron-god-as-domain. Earthsea (Le Guin, 1968–) carries roughly three to five named divine figures and is animistic, not theistic — the minimum end of the spectrum for a major fantasy setting.

Pratchett's *Small Gods* (1992) is the cleanest published statement of the worship-as-fuel mechanic Alaria already runs. Around the god "there forms a Shelle of prayers and Ceremonies and Buildings and Priestes and Authority, until at Laste the Godde Dies" — the Abraxis quote in-text. Om has millions of nominal worshippers and one actual believer (Brutha); he manifests as a powerless tortoise. Forgotten gods survive as "small gods" — "chittering voices in the wilderness," mindless shells haunting abandoned ruins. Ur-Gilash is the example, barely remembered even by Om, reduced to a point of desire without substance. "There is only power so long as there is belief."

Gaiman's *Sandman* (DC, 1989–1996) runs the fading model. *Sandman* #45: "Some of them die. Some of them change. And some of them just keep going. Maybe some even get jobs as dancers." *Brief Lives* puts faded gods into careers as lawyers, executives, and dancers. *Season of Mists* gives them a political seat at Dream's court. Fading is reversible; termination is rare and narratively vague. Useful as contrast: Sandman's gods almost never genuinely end. Alaria's do.

## Techniques that work

Lifecycle as in-world chronology, not as metadata flag. Glorantha doesn't tag the Red Goddess as `status: rising` — it gives her a separate chapter under "Gods of the Lunar Way" placed chronologically after primordial pantheons, and the chapter's first lines name her as "killed and dispersed in the God War, then resurrected by mortal agents." The structural marker is *where* the cult appears in the book. Era-anchored chapters do the work a status field would do, and they carry the why with them.

Same-template entry with named dead-section grouping. *Faiths & Avatars* gives dead and live gods identical entries, separated only by which section heading they live under. The dead don't get a different schema, because they were live once and might be again, and the schema mismatch would force a rewrite each transition. The section grouping plus past-tense prose carries the lifecycle state without a typed flag. This is the closest published precedent for a typed `status` field.

Documentation tier as a soft status marker. Tékumel's Pariah Deities get less canon by design. The information density itself encodes the status — a god with a paragraph in a sidebar is structurally not the same as one with a chapter in *Mitlanyál*. Useful for Alaria because the corpus already runs `weight` and `zoomLevel` fields that occupy a similar gradient; the existing entity-importance scale can absorb the lifecycle scale without a new field, if it has to. (Note: the Tékumel evidence here rests on secondary summaries — tekumel.com, the Hall of Blue Illumination podcast — rather than direct quotation from *Mitlanyál*. The structural pattern is well-attested across those sources but a primary-source pull would tighten it.)

Rune affinity rather than direct divine identity (Glorantha). The cult is built around a rune; the rune is shared across cultures; the deity at the centre of the cult is culturally specific. This is what lets Orlanth and Vadrus both be "Storm" cults without becoming the same entity. A `worships` edge that carries a domain alongside the daemon target would replicate this — the cult of Storm-Daemon-A in Culture-X is structurally distinct from the cult of Storm-Daemon-B in Culture-Y, but both can be queried as "Storm cults" for cross-cultural analysis.

Stability/Change axis mapped to political ideology (Tékumel). Twenty gods on a binary axis make every cultural pantheon-choice an ideological statement. Alaria's daemons could carry a comparable axis as a frontmatter field — order/chaos, hunger/restraint, light/shadow, whatever the cosmogony already commits to — and cultural patron-selection then maps to cultural worldview rather than to flavour.

In-world heresy as the anti-homogenization warning (Glorantha). The God Learners performed the "Goddess Switch" between Dendara and Ernalda because both had Earth runes; the result was failed marriages and barren trees. The Stafford principle is that myths are *constitutive* — collapsing them collapses the reality they hold up. Alaria already has a scholar frame designed to absorb contradiction by attribution; one of the seven majors should be a God-Learner analogue who tried to syncretise across cultures and produced a documented disaster.

Agnostic cosmology as homogenization-prevention (Eberron). Because nobody can verify whether the Lady Pine and Arawai are the same entity, both interpretations stand. This works for Eberron because its design premise is that the gods do not manifest. Alaria's premise is the opposite — daemons absolutely manifest through miracles funded out of R — so this technique transfers only partially. It survives in the dead-god case: a culture that has lost its remembrance-floor connection cannot verify whether the daemon is silent because it has been ended or because it has chosen not to answer.

Worship-as-fuel with explicit reservoir mechanics (Pratchett). *Small Gods* makes the mechanism literal: belief is the power source, the institution is not the belief, and a god with millions of nominal followers and zero actual believers manifests as a tortoise. Alaria's daemon economics (`docs/worldbuilding/systems/daemon-economics.md`) already runs this — prayer is a life-tithe of ε ≈ 0.1 HP into reserve R, R_min ≈ 50 HP is the remembrance floor. The published precedent confirms the model is coherent and player-legible.

## Failure modes

Edition resets without a structural mechanism. Forgotten Realms cut the pantheon to 18 in 4e (2008), restored ~36 in 5e (2015), reset again to 40 in 2025. Each cut was an authorial decision delivered as an in-world catastrophe — Spellplague, Sundering. The structural problem is that the canon database had no way to express "this god has been demoted to an exarch" or "this god has returned" as edges; the change had to be performed as a destructive overwrite. At ~3,500 entities Alaria can absorb one Spellplague-equivalent before the cross-reference fan-out makes the rewrite cost prohibitive.

Universal pantheon by design (Forgotten Realms). Greenwood's "every mortal believed in ALL of the gods" was a deliberate choice to maximise player flexibility, and the cost was that religion stopped functioning as a cultural-identity marker. An Amnian merchant and a Damaran soldier worship the same Tyr, Tempus, and Tymora. Religious disagreement becomes preference, not worldview. The veritastabletop.com critique names the failure pattern: "polytheistic pantheons drawn from centralized, monotheistic churches, representing polytheism more as a medieval Catholic would view the different saints" ([Veritas Tabletop](https://www.veritastabletop.com/varied-religions/)).

Gods-in-funny-hats. The specific failure where every culture has a "Storm god, Death god, Love god" parallel-portfolio set with only name-change variation. The shape is documented across the Forgotten Realms and Eberron primary sources already cited: Greenwood's "every mortal believed in ALL of the gods" produces the shape directly, and Baker's Eberron is the explicit reaction against it. Glorantha's rune system is the worked-out solution to the same problem. The failure shape is what Alaria gets if `worships` edges go undifferentiated and culture-level patron selection runs on domain templates.

The God Learner heresy as cautionary tale. Treating "two Earth goddesses with overlapping portfolios" as "the same goddess by different names" is what the God Learners did. The in-fiction consequence was reality breakdown. The out-of-fiction consequence for a canon database is silent contradiction: two daemons collapsed into one entity downstream of an undifferentiated `sameAs` edge, with all their cult-specific facts merged and the differences erased. Alaria's edge graph would absorb this kind of merge silently unless the canon-lint tooling flagged it.

Astral-corpse worship without proxy redirection (Planescape). *On Hallowed Ground* (TSR, 1996) rules that dead gods' priests "possess no realm and grant no spells (such priests gain their powers from the whole of the Ennead, though they may not be aware of this)" ([Timaresh, *Guardian of the Dead Gods*](https://rilmani.org/timaresh/Guardian_of_the_Dead_Gods)). The dead god is physically present as a corpse, but the spells are redirected to a living aggregate without the worshippers knowing. This is a published failure mode for Alaria: if a culture worships a daemon whose R has hit zero, and the system silently redirects their prayer to a different daemon, the metaphysical weight of the daemon's end gets papered over.

Pantheon bloat past the manageable ceiling. Forgotten Realms hit ~250 named divine entities; the *Faiths and Pantheons* compilation alone was 115. Players cannot hold that count. The 4e cut was the public admission. Glorantha runs ~300 but distributes them across 12 cultural blocks that mostly don't share rosters — the effective per-block load is ~15–25, which is in the holdable range. The failure is not absolute count but per-culture load: a pantheon that requires every player to learn 100 gods to function in any region is broken; one that requires 15–25 per region is not.

Sandman's fading-and-jobs model. Useful only as a contrast: Gaiman's gods rarely actually end. They become dancers. For a setting where the metaphysical stakes of divine death are real — Alaria's daemons are ended by definition when R drops below R_min — the fading model is the wrong shape. It allows authorial backsliding ("the god isn't quite dead, just diminished") that would erode the daemon-economics canon over time.

## Recommendations for Alaria

### Sizing

Target 90 named daemons for the initial roster, with growth headroom to 130 as more cultures get authored, and a hard ceiling at 150.

Why 90 and not the plan's 60 floor: 60 supports roughly 36 cultures at average 2.5 patrons with 40% inter-culture overlap, which is below the Foundations item #6 pincer prototype's expected culture-count once the chosen region's tribes and sub-polities are enumerated. 90 supports 50–60 cultures at the same density, which clears the pincer-stage need with margin for the first wave of cross-regional authorship without re-sizing. The 60 floor of the high-level plan is the absolute minimum if average patrons-per-culture drop to 1.8 and overlap rises to 55%, which is closer to Tékumel-style maximum syncretism than to Alaria's intended cultural variation.

The precedent ratios anchor the upper bound. Glorantha's ~300 deities across 12 cultural blocks runs ~25 per block, and the per-culture load on a player is the relevant number rather than the absolute total. Forgotten Realms' 115 in *Faiths and Pantheons* is the documented failure ceiling — three pantheon resets in seventeen years. Eberron's 15 is the minimum-viable count for a sharing-cultures design but produces religious flatness across nations. Tékumel's 20 shared by five empires is the maximum-syncretism case and works only because the Stability/Change axis carries the cultural-distinction load that pantheon size would otherwise carry. The 150 ceiling is set against the Forgotten Realms compilation as the documented break point.

The roster splits across lifecycle states. Initial 90: roughly 55 current, 20 dead, 10 rising, 5 dying. The dead figure is higher than most published settings allow because the cosmogony commits to two mass-die-off events (God War, Hykravones) plus the Greater Darkness analogue. Many daemons existed once. Many ended.

### Lifecycle status: frontmatter field plus era edge

Add a `lifecycle` frontmatter field to the daemon entityType (already enumerated in `.claude/rules/entity-files.md`), with the enum: `rising | current | dying | dead`. Keep the field on the entity rather than on the edge, because lifecycle is a property of the daemon, not of the relationship.

The enum collapses to four states under daemon-economics canon, not five. The world-systems-invariants daemon row is explicit: R below R_min ends the daemon, full stop. A separate "dormant" state with sub-R_min persistence would contradict locked canon. `dying` is R approaching R_min and the cult visibly contracting; `dead` is R hit zero and the daemon is terminated, no return mechanism. The lore voice can still say "the cult of X-daemon ended in 800 SD and the high temples in Doraddi still keep the calendar" — that statement is about the cult, not about the daemon's continued ontological presence.

Add an era edge separately. Foundations item #4 creates `era` entities (the entityType already exists in the schema enum, even though no instances exist yet). Each daemon authors an edge `history/occurredDuring → era-of-ascension` and, where applicable, `history/occurredDuring → era-of-death` with `note: cause`. This puts the lifecycle event on the timeline graph where canon-lint can date-check it, the same way the linter will date-check person births and deaths in Foundations item #5.

The frontmatter field is queryable cheaply for status. The era edges carry the why and the when, and the scholar frame can attribute era-of-death to a major (Foundations item #2). Both, not either.

The `lifecycle` field is a proposed addition to `.claude/rules/entity-files.md`; the `history/occurredDuring` edge use is already permitted by the current `entity-relations.md` vocabulary. The schema change requires orchestrator sign-off (per the shared brief's flagging rule).

### Anti-homogenization: discriminated `worships` edge

The current `culture/worships` edge in `.claude/rules/entity-relations.md` is one-directional, target-only, no kind discriminator. That's the same-five-gods failure waiting to fire. Three modifications:

First, add a required `kind` field to `culture/worships`: `primaryPatron | minorVeneration | ancestralOnly | propitiation`. `primaryPatron` is "this culture's central cult." `minorVeneration` is "this culture worships this daemon at the margin." `ancestralOnly` is "this culture remembers this daemon historically and may keep rites, but does not draw active worship" — the dead-god-worship case. `propitiation` is the Eberron Schism pattern — worshippers of a rival pantheon still offer prayer to ward off harm.

Second, add a `domain` field to daemon frontmatter, drawn from a controlled vocabulary that maps to Alaria's existing rune-equivalents (the elemental/conceptual axes the cosmogony already commits to). This is the Glorantha rune solution. The canon-lint check is: if two daemons share the same primary domain and have overlapping cultures with `primaryPatron` edges, flag for review — that's a candidate Goddess-Switch heresy waiting to happen.

Third, write the God Learner heresy into the legendarium. One of the seven majors (Foundations item #2) should be a scholar who attempted to syncretise daemons across cultures on domain-match logic, with documented disaster. That scholar's bias is "all daemons of the same domain are facets of one entity"; the canonical refutation lives in the lore of the cultures whose daemons they tried to collapse. This converts the failure mode into a contradiction-absorber: future generations that try to collapse the roster on AI suggestion get pushed back via the scholar's documented mistake.

The discriminated `worships` edge is a proposed addition to `.claude/rules/entity-relations.md` and requires orchestrator sign-off. This is the single most decision-relevant finding in this document: every existing and future `culture/worships` edge in the corpus is gated by whether the discriminator is adopted now or retrofitted later. The cost of retrofit grows linearly with edge count.

### Dead-god worship: distinct rule

Worship of an ended daemon is metaphysically distinct from worship of a silent-but-living daemon. The canon must enforce this, because daemon-economics already commits to the proposition that R below R_min terminates the entity.

The rule: a culture that worships a daemon with `lifecycle: dead` carries the relationship as `culture/worships` with `kind: ancestralOnly`. This worship does not contribute prayer-tithe to any R (the daemon is gone, there is no R to fill), and it does not fund miracles.

The tithe-dissipation question is the open logic hole the dead-god case has to plug. Daemon-economics canon says prayer is a small life-tithe (ε ≈ 0.1 HP per prayer session) drawn from the worshipper. If there is no R to receive it, the tithe still leaves the worshipper. The recommendation: the life-tithe from prayer to a dead daemon dissipates into Ezz, the universal substrate the world-systems-invariants spine already commits to as the receptacle for spent psyic energy (the Gaea-dormancy mechanism is the precedent — Kethic self-expenditure diffuses into Ezz via Psywinds and does not return). Worshippers still pay the cost; nothing receives the benefit. This is the cosmologically clean answer and the one that keeps the daemon-economics canon load-bearing rather than letting it leak into a redirect pattern.

The ancestralOnly cult, then, is a cultural fossil. Rites continue. Names persist in invocation. The cult buildings stand and the priesthood teaches ethics and history without divine response, and the village keeps the calendar because the calendar is what it has. Miracles attributed to an ended daemon are coincidence or the priest's own Deoric handmagic; the Planescape-Ennead silent-redirection pattern is available as a plot tool for specific stories but not the default mechanism — the default is dissipation.

This is sharper than any published precedent. Pratchett's small gods can be revived by belief; Alaria's ended daemons cannot. Forgotten Realms' Dead Three bled residual power for nine years and then returned via successors; Alaria's ended daemons do not. Glorantha's Genert has descendant cults that inherit position; Alaria can use this same mechanism for ended daemons whose cultural-position needs to be filled, but the descendants are different daemons, not the original.

The lore-voice consequence: scholar attribution becomes load-bearing for dead daemon entries. A major who studied the God War can write "Daemon X's last reserve emptied in 412 SD; her rites are still performed in the highland villages but no miracle has been recorded from her since"; a different major can dispute the date or the cause. The dispute is the texture. The metaphysical fact — she is ended, she does not return — is canon.

### Scope and growth

For the Foundations stage as scoped in `scope/archive/phase-foundations.md`: author 30 daemons in the first pass, biased toward dead and current. The dead are easier to write because their authorship is bounded — they exist as historical entities only, no ongoing dimensional pressure. Authoring dead daemons first stress-tests the `lifecycle: dead-ended` rule against the daemon-economics canon and the scholar-attribution rule against era entities. The current daemons follow once the dead set has shaken out the schema.

Rising daemons — Tiira (1800 SD) is the named example — wait until at least one era entity for the modern Seventh Dawn exists. Rising is the hardest lifecycle state to author because it requires forward-pointing causal commitments that the rest of the corpus has to support; doing it in the second pass is correct.

The 60-to-90 expansion happens during the pincer prototype (Foundations item #6) for the chosen region: every culture in that region gets its patron roster authored as the pincer surfaces it, which is the test that the discriminated `worships` edge works at culture-region scale before it gets turned on across the full map.

## Sources

- Stafford, Greg, and Steve Perrin. *Cults of Prax*. Chaosium, 1979.
- Stafford, Greg. *Cults of Terror*. Chaosium, 1981.
- Stafford, Greg. *Gods of Glorantha*. Avalon Hill / Chaosium, 1985.
- Stafford, Greg, and Sandy Petersen. *The Guide to Glorantha*. Moon Design, 2014.
- *HeroQuest Glorantha*. Moon Design, 2015.
- *RuneQuest: Roleplaying in Glorantha*. Chaosium, 2018.
- *Cults of RuneQuest: The Lunar Way*. Chaosium, 2024.
- Well of Daliath, *Prosopaedia* (Chaosium official): https://wellofdaliath.chaosium.com/home/gloranthan-documents/prosopaedia/
- Well of Daliath, *Greater and Major Gods*: https://wellofdaliath.chaosium.com/greater-and-major-gods/
- Well of Daliath, *Genert*: https://wellofdaliath.chaosium.com/home/gloranthan-documents/prosopaedia/deities/g/genert/
- Well of Daliath, *On Broken Gods and Dead Gods*: https://wellofdaliath.chaosium.com/on-broken-gods-and-dead-gods/
- Montgomery, Andrew Logan. *The Sin of the God Learners*, 2019: http://andrewloganmontgomery.blogspot.com/2019/09/the-sin-of-god-learners-metaphysics-of.html
- Runeblog, *Cults of RuneQuest: Mythology review*, 2024: https://elruneblog.blogspot.com/2024/03/cults-of-runequest-mythology-review.html
- Runeblog, *Cults of RuneQuest: The Lunar Way review*, 2024: https://elruneblog.blogspot.com/2024/07/cults-of-runequest-lunar-way-review.html
- Stafford, *I Fought We Won* (Glorantha Digest, 2001): http://glorantha.temppeli.org/digest/gd8/2001.04/2616.html
- Martin, Julia, and Eric L. Boyd. *Faiths & Avatars*. TSR, 1996.
- *Powers and Pantheons*. TSR, 1997.
- *Demihuman Deities*. TSR, 1998.
- *Faiths and Pantheons*. Wizards of the Coast, 2002.
- *Forgotten Realms Campaign Guide*. Wizards of the Coast, 2008.
- *Sword Coast Adventurer's Guide*. Wizards of the Coast, 2015.
- *Faiths & Avatars* AnyFlip preview: https://anyflip.com/vjcbu/bhuv/basic
- Forgotten Realms Wiki, *Church of Bhaal*: https://forgottenrealms.fandom.com/wiki/Church_of_Bhaal
- Forgotten Realms Wiki, *Dead Three*: https://forgottenrealms.fandom.com/wiki/Dead_Three
- Wikipedia, *List of Dungeons & Dragons Deities*: https://en.wikipedia.org/wiki/List_of_Dungeons_%26_Dragons_deities
- Greenwood interview, *Tesseracts 18*, 2013: https://tesseracts18.com/2013/09/30/only-the-insane-believed-there-were-no-gods-ed-greenwood-speaks-of-religion-and-belief-in-forgotten-realms-part-1/
- Gaming Nexus on 2025 *Heroes of Faerûn*: https://www.gamingnexus.com/News/71977/
- *Powers and Pantheons* PDFCoffee preview: https://pdfcoffee.com/forgotten-realms-powers-and-pantheons-pdf-free.html
- Baker, Keith. *Eberron Campaign Setting*. Wizards of the Coast, 2004.
- *Faiths of Eberron*. Wizards of the Coast, 2006.
- Baker, Keith. *Dragonmarks: Religion, Faith and Souls*, 2014: https://keith-baker.com/dragonmarks-411-religion-and-faith/
- Baker, Keith. *Couatls and the Silver Flame*: https://keith-baker.com/dm-couatls/
- Baker, Keith. *Faith and Wisdom*, 2016: https://keith-baker.com/dragonmarks-61816-faith-and-wisdom/
- Eberron Wiki, *Dark Six*: https://eberron.fandom.com/wiki/Dark_Six
- Barker, M.A.R. *Empire of the Petal Throne*. TSR, 1975.
- Barker, M.A.R. *The Tékumel Source Book*. Different Worlds, 1983.
- Barker, M.A.R., and Patrick Brady. *Mitlanyál: The Gods of Stability* and *Mitlanyál: The Gods of Change*. Tékumel Foundation, 2003.
- Tekumel.com, *Gods*: https://www.tekumel.com/world_gods.html
- Tekumel.com, *Éngsvan hla Gánga history*: https://www.tekumel.com/world_history08.html
- Hall of Blue Illumination podcast, *Pariah Gods*: https://tekumelpodcast.com/podcast/episode-47-pariah-gods/
- *On Hallowed Ground*. TSR, 1996, summarised at Timaresh, *Guardian of the Dead Gods*: https://rilmani.org/timaresh/Guardian_of_the_Dead_Gods
- *Tome of Salvation* (WFRP 2e). Black Industries, 2006.
- Lexicanum, *Religion (Old World)*: https://whfb.lexicanum.com/wiki/Religion
- Lexicanum, *Gods of the Empire*: https://whfb.lexicanum.com/wiki/Gods_of_the_Empire
- Pratchett, Terry. *Small Gods*. Gollancz, 1992.
- Gaiman, Neil. *The Sandman*, especially *Brief Lives* and *Season of Mists*. DC Comics, 1989–1996.
- Book Riot, *Before American Gods, Gaiman Explored the Brief Lives of Gods*: https://bookriot.com/before-american-gods-gaiman-explored-the-brief-lives-of-gods-in-the-sandman/
- Veritas Tabletop, *Varying Religious Culture in TTRPGs*: https://www.veritastabletop.com/varied-religions/
