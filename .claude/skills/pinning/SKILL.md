---
name: pinning
description: Context for the /pin admin workflow — what location pinning is for, how the data flows, and what invariants must not break. Use when working in src/app/pin/, src/app/api/pin/, src/app/api/manual-pin/, scripts/extract-locations.ts, scripts/finalize-locations.ts, data/work-queue.json, data/pinned.json, data/manual-pins.json, or when planning changes that touch lore data, the work queue, pinned coordinates, or free-form manual pins.
---

# Pinning workflow

`/pin` is a one-time bootstrap UI for assigning map coordinates to every entry from the Alaria wiki. It is **not** an optional curation step — every wiki entry must end up pinned so the public map (`/`) can show it at the right zoom.

## What it produces

```
world-wikis/.../*.md           (4500+ headers across 8 continent files)
   │
   │ scripts/extract-locations.ts   (one-time parse: headers → entries with IDs)
   ▼
data/work-queue.json           (LoreEntry[]: id, name, lineNumber, headerLevel, parentEntryId, status)
   │
   │ /pin admin UI + /api/pin    (human assigns coords, type, zoom, then pin or skip)
   ▼
data/pinned.json               (PinnedData: { [id]: { coordinates, zoomLevel, type, pinnedAt } })
   │
   │                          data/manual-pins.json   (ManualPin[]: free-form pins, ids prefixed `manual-`)
   │                                 │   ▲ /pin Quick Label mode + /api/manual-pin
   │                                 │
   │ scripts/finalize-locations.ts  (merges work-queue + pinned + descriptions + manual-pins → final shape)
   ▼
data/locations.json            (consumed by the public map at /)
```

## Two modes in the `/pin` UI

- **Queue** — the original walk-through: steps every wiki `LoreEntry`, human assigns coords/type/zoom, writes `pinned.json`. This is the bootstrap pass and is now effectively done.
- **Quick Label** — free-form: click the map, type a name, Enter. Saves to `data/manual-pins.json` (not the queue), default type `uncategorized`. For places the wiki never had a header for. After Enter the new pin is *selected*; type keys (`1-5 q w e r`) retype the **selected** pin and `N`/`P` step through placed pins (map pans to follow). Default mode is Quick Label; the heavy queue layer loads as a read-only reference layer so you can see labeled gaps.

## What "pinning" is buying

- **Stable IDs.** The extraction script assigns an incrementing `id` per header. Pins are keyed by that id forever — line numbers and names can change in the wiki, but the pin survives.
- **A zoom-stratified placement.** The pinner sets `zoomLevel` (1-5). That number controls *when the marker appears* on the public map: 1 = continent-scale, 5 = building-scale. The depth model lives in `CLAUDE.md` and `src/types/location.ts`.
- **Coordinates in the Leaflet `CRS.Simple` pixel space** of the source `Alaria.png` (not lat/lon). Y is flipped at marker placement.

## What comes after pinning is done

Two follow-up passes the user already plans to run:
1. **Merge duplicates.** The wiki has ~4500 headers but fewer real places — many locations appear both as a sub-bullet under a region (`### Salty Hills` stub under "Geographic Features") *and* as a fuller standalone entry (`#### The Salty Hills` under Thespia). Both should resolve to the same pinned point.
2. **Fill missing lore.** Many entries' source markdown is literally `TODO`. Those get written by hand in the wiki, not in this app.

The `/pin` UI surfaces related entries (same normalized name) so the pinner can spot duplicates while pinning, but does not consolidate them automatically.

## Critical invariants — read before changing anything

- **Never re-run `scripts/extract-locations.ts` over `data/work-queue.json` without a migration.** It re-assigns IDs from a counter, which would silently invalidate every existing pin in `data/pinned.json`. If extraction logic must change (e.g. to detect more headers), write a script that preserves existing IDs by name+sourceFile+lineNumber lookup.
- **Pins are append-only from the human's perspective.** The user has invested manual work into hundreds of pins. Any change to data shape, ID scheme, or extraction must keep `pinned.json` valid or include a one-shot migration run by hand.
- **`/api/pin` and `/api/manual-pin` write the filesystem.** They use `fs.writeFileSync` against `data/work-queue.json` + `data/pinned.json` (pin) and `data/manual-pins.json` (manual-pin: POST create, PATCH retype, DELETE). This is by design — pinning is local-only and doesn't deploy to Vercel. Do not refactor to a database or read-only without a plan for preserving the existing files.
- **Manual pins live entirely outside the queue.** They have no `LoreEntry`, no `parentEntryId`, no wiki content. Ids are prefixed `manual-` so they never collide with the numeric extraction ids. Keep them in `manual-pins.json`; do not inject synthetic entries into `work-queue.json`/`pinned.json`.
- **`finalize-locations.ts` is the only thing that merges manual pins into the public map.** A new manual pin won't appear at `/` until you re-run finalize (with `ALARIA_LORE_DIR` set, or it strips wiki lore). Manual pins arrive with `parentId: null`, `relatedIds: []`, no content.
- **Status is on the entry, not derived.** `work-queue.json` entries have `status: 'pending' | 'pinned' | 'skipped'`. The progress counters and "next entry" cursor read from this. Don't compute status from `pinned.json` membership — skipped entries have no pin but are not pending.
- **`parentEntryId` references another entry's `id`.** Don't sort or renumber entries.

## Common mistakes

- "Let me regenerate work-queue.json to pick up new wiki entries" — see invariant #1. Write an additive migration instead.
- "I'll consolidate duplicates by deleting one entry" — that breaks `parentEntryId` references and the pin (if it has one) on that entry. Consolidation needs a deliberate scheme: a canonical entry, redirects from the others, and care about which pins survive.
- "The skipped entries should be re-shown" — they were intentionally skipped; the human will revisit them in a separate sweep, not by resetting status.

## Where things live

- UI: `src/app/pin/page.tsx` (both modes; `QuickLabelPanel` is in this file), `src/components/PinningMap.tsx` (two marker layers: stable wiki + light manual)
- API: `src/app/api/pin/route.ts` (GET current + `pinnedNames`, POST pin/skip, PUT jump/back); `src/app/api/manual-pin/route.ts` (GET list, POST create, PATCH retype, DELETE)
- Types: `src/types/pinning.ts` (`LoreEntry`, `PinnedData`, `ManualPin`, `ManualPinsFile`); `uncategorized` is in `LocationType` (`src/types/location.ts`), icons in `src/lib/icons.ts`
- Extraction: `scripts/extract-locations.ts`
- Finalization: `scripts/finalize-locations.ts`
- Source wiki: `$ALARIA_LORE_DIR` or `../heart-rush-tools/world-wikis/alaria/all_sections_formatted/`
- Data: `data/work-queue.json` (queue + status), `data/pinned.json` (id → wiki pin), `data/manual-pins.json` (free-form pins), `data/locations.json` (final, public-facing)
