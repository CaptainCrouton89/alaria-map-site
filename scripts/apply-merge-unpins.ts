/**
 * Collapse multi-pinned merge groups to a single pin per group.
 *
 * For each merge group in data/merge-groups.json:
 *   - If only the primary is pinned: noop.
 *   - If primary + non-primaries are pinned: unpin all non-primaries.
 *   - If primary is unpinned but ≥1 non-primary is pinned: transfer the earliest-pinned
 *     non-primary's pin to the primary, then unpin all non-primaries.
 *
 * Work-queue updates:
 *   - Unpinned non-primary → status 'skipped' (logically merged into primary).
 *   - Primary newly receiving a transferred pin → status 'pinned'.
 *
 * Backs up data/pinned.json and data/work-queue.json before mutating.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { LoreEntry, MergeGroupsFile, PinnedData, WorkQueue } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const PINNED = path.join(ROOT, 'data/pinned.json');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const MERGE_GROUPS = path.join(ROOT, 'data/merge-groups.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

function ts(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backup(p: string) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const base = path.basename(p);
  fs.copyFileSync(p, path.join(BACKUP_DIR, `${base}.${ts()}.json`));
}

interface UnpinAction {
  groupId: string;
  normalizedName: string;
  primaryId: string;
  removedIds: string[];
  transferredFromId: string | null;
  transferredCoords: [number, number] | null;
}

function main() {
  const merge: MergeGroupsFile = JSON.parse(fs.readFileSync(MERGE_GROUPS, 'utf-8'));
  const pinned: PinnedData = JSON.parse(fs.readFileSync(PINNED, 'utf-8'));
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));

  const entryById = new Map<string, LoreEntry>();
  for (const e of queue.entries) entryById.set(e.id, e);

  const actions: UnpinAction[] = [];
  let groupsTouched = 0;
  let pinsRemoved = 0;
  let pinsTransferred = 0;
  let entriesSkipped = 0;

  for (const g of merge.groups) {
    const nonPrimaries = g.memberIds.filter(id => id !== g.primaryId);
    const pinnedNonPrimaries = nonPrimaries.filter(id => pinned[id]);
    const primaryPinned = !!pinned[g.primaryId];

    if (pinnedNonPrimaries.length === 0) continue; // nothing to clean
    groupsTouched++;

    let transferredFromId: string | null = null;
    let transferredCoords: [number, number] | null = null;

    if (!primaryPinned) {
      // Pick the non-primary pinned earliest (lowest id as tiebreaker on equal timestamps)
      const sorted = [...pinnedNonPrimaries].sort((a, b) => {
        const ta = pinned[a].pinnedAt;
        const tb = pinned[b].pinnedAt;
        if (ta !== tb) return ta < tb ? -1 : 1;
        return Number(a) - Number(b);
      });
      transferredFromId = sorted[0];
      const src = pinned[transferredFromId];
      // Copy pin to primary; preserve original pinnedAt to keep history
      pinned[g.primaryId] = {
        coordinates: src.coordinates,
        zoomLevel: src.zoomLevel,
        type: src.type,
        pinnedAt: src.pinnedAt,
      };
      transferredCoords = src.coordinates;
      pinsTransferred++;
      // Mark primary as pinned in queue
      const primaryEntry = entryById.get(g.primaryId);
      if (primaryEntry && primaryEntry.status !== 'pinned') {
        primaryEntry.status = 'pinned';
      }
    }

    // Remove non-primary pins, mark entries skipped
    for (const id of pinnedNonPrimaries) {
      delete pinned[id];
      pinsRemoved++;
      const entry = entryById.get(id);
      if (entry && entry.status !== 'skipped') {
        entry.status = 'skipped';
        entriesSkipped++;
      }
    }

    actions.push({
      groupId: g.id,
      normalizedName: g.normalizedName,
      primaryId: g.primaryId,
      removedIds: pinnedNonPrimaries,
      transferredFromId,
      transferredCoords,
    });
  }

  if (groupsTouched === 0) {
    console.log('No multi-pinned merge groups need cleanup. Exiting.');
    return;
  }

  backup(PINNED);
  backup(WORK_QUEUE);

  fs.writeFileSync(PINNED, JSON.stringify(pinned, null, 2));
  fs.writeFileSync(WORK_QUEUE, JSON.stringify(queue, null, 2));

  console.log('Merge-unpin summary:');
  console.log(`  groups cleaned: ${groupsTouched}`);
  console.log(`  pins removed:   ${pinsRemoved}`);
  console.log(`  pins transferred to primary: ${pinsTransferred}`);
  console.log(`  queue entries set to skipped: ${entriesSkipped}`);
  console.log('');
  if (pinsTransferred > 0) {
    console.log('Transfers (primary received non-primary coords):');
    for (const a of actions.filter(x => x.transferredFromId)) {
      console.log(
        `  ${a.normalizedName}: ${a.transferredFromId} → ${a.primaryId} ` +
          `@ [${a.transferredCoords?.join(',')}]`
      );
    }
  }
}

main();
