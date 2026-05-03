/**
 * Apply the structural-header audit:
 *   1. Backup data/work-queue.json and data/pinned.json (timestamped)
 *   2. Write data/auto-skip.json with the confirmed structural-header list
 *   3. For every entry whose normalized name is structural:
 *        - status pending → skipped
 *        - status pinned  → skipped + remove from pinned.json
 *        - status skipped → unchanged
 *
 * Run after reviewing data/structural-header-audit.md.
 *
 * Idempotent: re-running has no effect once entries are already skipped.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const PINNED = path.join(ROOT, 'data/pinned.json');
const AUDIT = path.join(ROOT, 'data/structural-header-audit.json');
const AUTO_SKIP = path.join(ROOT, 'data/auto-skip.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/['’`"().,:;!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function timestamp(): string {
  const d = new Date();
  return d.toISOString().replace(/[:.]/g, '-');
}

function main() {
  if (!fs.existsSync(AUDIT)) {
    console.error(`Missing ${AUDIT}. Run audit-structural-headers.ts first.`);
    process.exit(1);
  }

  const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf-8'));
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));
  const pinned: PinnedData = JSON.parse(fs.readFileSync(PINNED, 'utf-8'));

  // Backup
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const ts = timestamp();
  fs.copyFileSync(WORK_QUEUE, path.join(BACKUP_DIR, `work-queue.${ts}.json`));
  fs.copyFileSync(PINNED, path.join(BACKUP_DIR, `pinned.${ts}.json`));
  console.log(`Backups written to ${BACKUP_DIR} with timestamp ${ts}`);

  // Build skip set
  const structuralNames: string[] = audit.candidates.map((c: { normalized: string }) => c.normalized);
  const skipSet = new Set(structuralNames);

  // Persist auto-skip.json
  const autoSkip = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: 'data/structural-header-audit.json',
    structuralHeaders: structuralNames.sort(),
  };
  fs.writeFileSync(AUTO_SKIP, JSON.stringify(autoSkip, null, 2));
  console.log(`Wrote ${AUTO_SKIP} with ${structuralNames.length} structural names`);

  // Mutate queue + pinned
  let pendingToSkipped = 0;
  let pinnedToSkipped = 0;
  let alreadySkipped = 0;
  const unpinnedIds: string[] = [];

  for (const entry of queue.entries) {
    const key = normalizeName(entry.name);
    if (!skipSet.has(key)) continue;

    if (entry.status === 'skipped') {
      alreadySkipped++;
      continue;
    }
    if (entry.status === 'pending') {
      entry.status = 'skipped';
      pendingToSkipped++;
      continue;
    }
    if (entry.status === 'pinned') {
      entry.status = 'skipped';
      pinnedToSkipped++;
      if (pinned[entry.id]) {
        delete pinned[entry.id];
        unpinnedIds.push(entry.id);
      }
    }
  }

  fs.writeFileSync(WORK_QUEUE, JSON.stringify(queue, null, 2));
  fs.writeFileSync(PINNED, JSON.stringify(pinned, null, 2));

  console.log('');
  console.log('Mutation summary:');
  console.log(`  pending → skipped: ${pendingToSkipped}`);
  console.log(`  pinned → skipped (and unpinned): ${pinnedToSkipped}`);
  console.log(`  already skipped (no change): ${alreadySkipped}`);
  if (unpinnedIds.length) console.log(`  unpinned IDs: ${unpinnedIds.join(', ')}`);
}

main();
