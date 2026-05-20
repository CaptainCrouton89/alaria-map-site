/**
 * For each merge group with multiple pinned members, keep the primary's pin
 * and demote the non-primary pins. Demotion = remove from pinned.json,
 * set status=skipped in work-queue.json.
 *
 * Run after dedupe-decisions update merge-groups.json. Backs up both files.
 *
 * Skips groups whose pin coords are far apart (>thresholdPx) — those are flagged
 * for manual review rather than collapsed silently.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData, MergeGroupsFile } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const PINNED = path.join(ROOT, 'data/pinned.json');
const MERGE_GROUPS = path.join(ROOT, 'data/merge-groups.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

const SAFE_DISTANCE_PX = 200;

function ts(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backup(p: string) {
  if (!fs.existsSync(p)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const base = path.basename(p);
  fs.copyFileSync(p, path.join(BACKUP_DIR, `${base}.${ts()}.json`));
}

function pairwiseMaxDist(coords: Array<[number, number]>): number {
  let max = 0;
  for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
      const dx = coords[i][0] - coords[j][0];
      const dy = coords[i][1] - coords[j][1];
      max = Math.max(max, Math.hypot(dx, dy));
    }
  }
  return max;
}

function main() {
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));
  const pinned: PinnedData = JSON.parse(fs.readFileSync(PINNED, 'utf-8'));
  const mergeGroups: MergeGroupsFile = JSON.parse(fs.readFileSync(MERGE_GROUPS, 'utf-8'));

  const byId = new Map(queue.entries.map(e => [e.id, e]));

  let groupsExamined = 0;
  let groupsCollapsed = 0;
  let groupsFlagged = 0;
  let pinsRemoved = 0;
  const flagged: Array<{ groupId: string; name: string; maxDist: number; members: string[] }> = [];

  for (const g of mergeGroups.groups) {
    const pinnedMembers = g.memberIds.filter(id => pinned[id]);
    if (pinnedMembers.length < 2) continue;
    groupsExamined++;

    const coords = pinnedMembers.map(id => pinned[id].coordinates);
    const maxDist = pairwiseMaxDist(coords);

    if (maxDist > SAFE_DISTANCE_PX) {
      flagged.push({
        groupId: g.id,
        name: g.normalizedName,
        maxDist: Math.round(maxDist),
        members: pinnedMembers,
      });
      groupsFlagged++;
      continue;
    }

    // Keep primary, demote the rest. If primary isn't among the pinned set
    // (rare — pickPrimary already prefers pinned), keep the lowest-id pinned
    // and re-assign primary in merge-groups.json on next apply run.
    const keepId = pinnedMembers.includes(g.primaryId)
      ? g.primaryId
      : [...pinnedMembers].sort((a, b) => Number(a) - Number(b))[0];

    for (const id of pinnedMembers) {
      if (id === keepId) continue;
      delete pinned[id];
      const e = byId.get(id);
      if (e) e.status = 'skipped';
      pinsRemoved++;
    }
    groupsCollapsed++;
  }

  if (groupsCollapsed === 0 && groupsFlagged === 0) {
    console.log('Nothing to collapse — all merge groups have ≤1 pinned member.');
    return;
  }

  backup(PINNED);
  backup(WORK_QUEUE);

  fs.writeFileSync(PINNED, JSON.stringify(pinned, null, 2));
  fs.writeFileSync(WORK_QUEUE, JSON.stringify(queue, null, 2));

  console.log('Collapse summary:');
  console.log(`  groups examined:   ${groupsExamined}`);
  console.log(`  groups collapsed:  ${groupsCollapsed}`);
  console.log(`  pins removed:      ${pinsRemoved}`);
  console.log(`  groups flagged for manual review (>${SAFE_DISTANCE_PX}px spread): ${groupsFlagged}`);

  if (flagged.length > 0) {
    console.log('');
    console.log('Flagged groups (resolve by hand or with a subagent — coord spread is too large to auto-collapse):');
    for (const f of flagged) {
      console.log(`  ${f.groupId} ${f.name} maxDist=${f.maxDist}px members=[${f.members.join(',')}]`);
    }
  }
}

main();
