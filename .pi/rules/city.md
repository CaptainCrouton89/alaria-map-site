---
name: City authoring
description: how to flesh out a city entity
when:
  entityType: city
---

# City entities

A city is a major settlement — the largest or most politically significant population
center in its region. It earns multi-section depth where a town does not, and is the
entry readers land on to understand the dominant culture of a stretch of the world. The
universal place kernel — Wikipedia-summary container/member model, reading geography
off the map via `map shot`, and length by `zoomLevel` — lives in
`docs/worldbuilding/lore-style-guide.md` (Process and Length sections) and `region.md`.
This file is the city-specific delta.

## Recommended shape

A city usually opens on geography and character: where it sits, what the terrain forces
on it, and the one spatial fact that makes it unlike neighboring settlements — a harbor
district that controls river access, a quarter built over a leyline, a wall that has
never been taken. Named districts or quarters follow if the city warrants them.

It then moves through economy and power: who runs the city, what it produces, who pays
whom. In Alaria, power usually follows infrastructure — a sky-trade dock, a leyline tap,
a pass nobody else can close — so the economic section usually contains the political
tension.

A strong city closes on a live dispute: a succession crisis, a contested resource, a
faction poised to act. Without a lever, a city entry is a description.

## What makes a good city

One geographic fact no other city has, and one live dispute the players can walk into.
The Alaria levers that bite hardest at city scale: sky-trade access or its loss; leyline
infrastructure that a faction wants to control or destroy; a polity relationship
(vassalOf, tributaryOf) that is nominally settled but materially unstable. Vassum is the
model: a specific geographic role (sea routes, the mountain crossing to Syvlius), a
specific collapse (the trade tower is gone), and a population scrambling to adapt in
conflicting directions.

## Capitals

A capital is a `polity/capitalOf` relation authored on the city entity (target = the
nation), never a frontmatter field. The capital is the `city` among a region's members —
if that is ambiguous, `alaria-codex map shot` resolves it via the red capital star.

## Before you write

Read the region, every named neighbor, and every entity across `borders` edges. Run
`alaria-codex map shot` to confirm harbor access, road connections, and which national
border the city sits inside. Read every member entity before summarizing one. Place names
follow the dominant culture's onomastics sheet in `docs/worldbuilding/onomastics/`.

## Edges that matter

- `spatial/within` → the region or nation that contains this city (≤1).
- `polity/capitalOf` → the nation this city serves as capital of, if applicable.
- `polity/ruledBy` → the ruling person or faction, if named.
- `economy/tradesWith`, `economy/skyRouteTo` → economic ties worth surfacing.
- `culture/inhabitedBy` → the dominant people(s).

## Length

Cities carry story weight and warrant multi-section entries — earn each section.
No `<!-- mechanics -->` block: places do not carry stat blocks.
