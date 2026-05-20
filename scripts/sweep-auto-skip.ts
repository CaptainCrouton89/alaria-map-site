/**
 * Walk every pending entry in work-queue.json and apply auto-skip rules:
 *   - structural-header matches (auto-skip.json)
 *   - merge-group non-primaries (merge-groups.json) — the primary is the
 *     canonical entry; non-primaries represent the same place written elsewhere.
 *
 * Useful after recording a batch of dedupe decisions, so the queue stats
 * reflect them immediately rather than only when /api/pin walks past each one.
 *
 * Backs up data/work-queue.json before mutating. No effect on data/pinned.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, MergeGroupsFile } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const AUTO_SKIP = path.join(ROOT, 'data/auto-skip.json');
const MERGE_GROUPS = path.join(ROOT, 'data/merge-groups.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/['’`"().,:;!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadStructuralSet(): Set<string> {
  if (!fs.existsSync(AUTO_SKIP)) return new Set();
  const data = JSON.parse(fs.readFileSync(AUTO_SKIP, 'utf-8'));
  if (!Array.isArray(data.structuralHeaders)) return new Set();
  return new Set(data.structuralHeaders);
}

function loadMergeMap(): Map<string, string> {
  const out = new Map<string, string>();
  if (!fs.existsSync(MERGE_GROUPS)) return out;
  const data: MergeGroupsFile = JSON.parse(fs.readFileSync(MERGE_GROUPS, 'utf-8'));
  for (const g of data.groups) {
    for (const id of g.memberIds) {
      if (id !== g.primaryId) out.set(id, g.primaryId);
    }
  }
  return out;
}

function ts(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function main() {
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));
  const structural = loadStructuralSet();
  const mergeMap = loadMergeMap();

  // Backup
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.copyFileSync(WORK_QUEUE, path.join(BACKUP_DIR, `work-queue.${ts()}.json`));

  let structuralSkips = 0;
  let mergeSkips = 0;

  for (const e of queue.entries) {
    if (e.status !== 'pending') continue;
    if (structural.has(normalizeName(e.name))) {
      e.status = 'skipped';
      structuralSkips++;
      continue;
    }
    if (mergeMap.has(e.id)) {
      e.status = 'skipped';
      mergeSkips++;
    }
  }

  fs.writeFileSync(WORK_QUEUE, JSON.stringify(queue, null, 2));

  console.log('Sweep summary:');
  console.log(`  structural-header skips:        ${structuralSkips}`);
  console.log(`  merge-group non-primary skips:  ${mergeSkips}`);
  console.log(`  total newly skipped:            ${structuralSkips + mergeSkips}`);
}

main();
