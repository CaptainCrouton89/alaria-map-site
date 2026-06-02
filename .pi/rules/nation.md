---
name: Nation authoring
description: how to flesh out a nation entity
when:
  entityType: nation
---

# Nation entities

A nation is a sovereign polity with territory — a kingdom, empire, republic, or confederation that
governs land and people. There are currently no authored nation entities in the corpus; this file
exists so the first one has guidance derived from faction and region conventions rather than
improvised from scratch.

## Recommended shape

Three moves: identity and government (what kind of polity, who holds power and by what mandate),
territory and capital (what land it controls, what the capital is, how geography shapes governance),
and relations with neighbors (the diplomatic stance, the live disputes, the edges that place this
nation in the world). The opening is like a region's orientation section — a defining geographic
fact plus a defining governmental fact — and the close is like a faction's contested question:
something still in motion that a GM can reach for.

## Capital

A capital is a `polity/capitalOf` edge authored on the settlement, with target = this nation. It is
**never a frontmatter field on the nation** and never authored on the nation entity itself. The
nation entry names the capital in prose; the edge lives on the settlement file; the nation surfaces
the capital via the computed reverse.

## What makes a good nation

A live territorial dispute, a contested succession, or a diplomatic relationship still moving. A
nation whose borders are uncontested, whose government is stable, and whose neighbors are at peace
is setting wallpaper. Surface what Alaria's geography already holds: a border drawn through
disputed land, a people who answer to a different polity, a trade route that feeds one side of the
frontier more than the other.

## Before you write

Read every region this nation contains or borders. Read both sides of every `borders` edge before
asserting what lies there. Run `alaria-codex map shot` to confirm where borders actually lie — the
drawn maroon national border line is authoritative when present. Check `world-systems-invariants.md`
before any cosmological claim about the nation's territory.

## Edges that matter

- `spatial/within` → the continent or landmass this nation sits inside (≤1), if applicable.
- `spatial/borders` → co-equal neighboring nations or regions; author one direction only.
- `polity/vassalOf`, `polity/allyOf`, `polity/atWarWith`, `polity/protects` — diplomatic stance; use `when` for time-bound relationships.
- `culture/inhabitedBy` → the primary peoples of this nation.

`capitalOf` is authored on the settlement, never here. `contains` is computed from members'
`within` edges — never author it on the nation.

## Length & mechanics

Nations carry story weight; multi-section depth is appropriate — but earn each section. A
two-paragraph entry with one live border dispute outweighs four padded sections. No mechanics block.
