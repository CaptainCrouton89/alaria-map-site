/**
 * One-off: merge 14 duplicate pin pairs the audit missed (spelling drift,
 * "The X" vs "X", and cross-file City_States.md mirrors of per-continent entries).
 *
 * For each pair: keep the canonical entry's pin, delete the duplicate's pin from
 * pinned.json, and set the duplicate's status='skipped' in work-queue.json.
 * Backs up both files first.
 *
 * Also updates Apketrii (id 10) type from "wilderness" to "region" — it's an island.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const PINNED = path.join(ROOT, 'data/pinned.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

interface Merge {
  keep: string;
  drop: string;
  name: string;
  note: string;
}

const MERGES: Merge[] = [
  { keep: '927', drop: '933', name: 'Blueshale Peaks', note: 'Blueshale vs Blue Shale, same Clueanda mountain range under two parents' },
  { keep: '2410', drop: '2414', name: 'Hildaneir', note: 'Same ruins in Hilda\'s Forest, listed under both Hilda\'s Forest and Crimson Coast' },
  { keep: '2649', drop: '4507', name: 'Blvnird', note: 'Rimihuica per-continent canonical; City_States.md cross-ref' },
  { keep: '2743', drop: '4530', name: 'Melaia', note: 'Rimihuica per-continent canonical; City_States.md cross-ref' },
  { keep: '3426', drop: '4533', name: 'Rilyn', note: 'Upoceax per-continent canonical; City_States.md cross-ref' },
  { keep: '3544', drop: '3549', name: 'Kilren\'s Palace', note: 'Same Upoceax ruins, listed under both Iyaklomori Grera and Farlands' },
  { keep: '4073', drop: '4555', name: 'Zor', note: 'Upoceax per-continent canonical; City_States.md cross-ref' },
  { keep: '4484', drop: '4520', name: 'Maun', note: 'Greenwater per-continent canonical; City_States.md cross-ref' },
  { keep: '4488', drop: '4526', name: 'Beauty Bay', note: 'Greenwater per-continent canonical; City_States.md cross-ref' },
  { keep: '4262', drop: '4512', name: 'Iypos', note: 'Western_Isles per-continent canonical; City_States.md cross-ref' },
  { keep: '994', drop: '2552', name: 'Plains of Oblivion', note: '"Plains of" vs "The Plains of", same cursed grasslands' },
  { keep: '9', drop: '434', name: 'Keletus', note: 'Ve.md canonical (full Lorean minotaur description); Clueanda stub' },
  { keep: '10', drop: '433', name: 'Apketrii', note: 'Ve.md canonical (mountain island description); Clueanda TODO stub' },
  { keep: '3942', drop: '3814', name: 'Deadman\'s Lake', note: 'Same Upoceax lake (Salt Tomb lore duplicated). User picked Wycendeula framing as canonical' },
];

function ts(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backup(p: string) {
  if (!fs.existsSync(p)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const base = path.basename(p);
  fs.copyFileSync(p, path.join(BACKUP_DIR, `${base}.${ts()}.json`));
}

function main() {
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));
  const pinned: PinnedData = JSON.parse(fs.readFileSync(PINNED, 'utf-8'));
  const byId = new Map(queue.entries.map(e => [e.id, e]));

  const errors: string[] = [];
  for (const m of MERGES) {
    const keepEntry = byId.get(m.keep);
    const dropEntry = byId.get(m.drop);
    if (!keepEntry) errors.push(`keep id ${m.keep} (${m.name}) not in queue`);
    if (!dropEntry) errors.push(`drop id ${m.drop} (${m.name}) not in queue`);
    if (!pinned[m.keep]) errors.push(`keep id ${m.keep} (${m.name}) is not pinned`);
    if (!pinned[m.drop]) errors.push(`drop id ${m.drop} (${m.name}) is not pinned`);
  }
  if (errors.length) {
    console.error('Pre-flight failures:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  backup(PINNED);
  backup(WORK_QUEUE);

  let pinsRemoved = 0;
  for (const m of MERGES) {
    delete pinned[m.drop];
    const dropEntry = byId.get(m.drop)!;
    dropEntry.status = 'skipped';
    pinsRemoved++;
    console.log(`  ${m.name}: kept [${m.keep}], skipped [${m.drop}]`);
  }

  // Apketrii: change surviving entry's type
  const apketrii = pinned['10'];
  if (apketrii && apketrii.type === 'wilderness') {
    apketrii.type = 'region';
    apketrii.zoomLevel = 3;
    console.log('  Apketrii [10]: type wilderness → region, zoom 4 → 3 (island, not wilderness)');
  }

  fs.writeFileSync(PINNED, JSON.stringify(pinned, null, 2));
  fs.writeFileSync(WORK_QUEUE, JSON.stringify(queue, null, 2));

  console.log(`\nDone. ${pinsRemoved} duplicate pins removed.`);
}

main();
