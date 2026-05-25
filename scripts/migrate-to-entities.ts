/**
 * One-shot migration: pins + all_sections_formatted prose -> flat entity files.
 *
 * Reads data/{work-queue,pinned,manual-pins}.json and the wiki's all_sections_formatted/,
 * and writes one markdown file per entity (scope: pinned ∪ manual) to content/codex/entities/.
 * IDs and coordinates are preserved exactly (verified at the end). See scripts/lore-migration-plan.md.
 *
 * Run: npx tsx scripts/migrate-to-entities.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData, ManualPinsFile } from '../src/types/pinning';

const REPO = path.resolve(__dirname, '..');
const DATA = path.join(REPO, 'data');
const OUT = path.join(REPO, 'content/codex/entities');
const LORE =
  process.env.ALARIA_LORE_DIR ||
  path.resolve(REPO, '../heart-rush-tools/world-wikis/alaria/all_sections_formatted');

type Entry = WorkQueue['entries'][number];
const headerRe = /^(#{1,6})\s+/;
const headerLevel = (line: string): number | null => {
  const m = headerRe.exec(line);
  return m ? m[1].length : null;
};

// ---- load ----
const wq: WorkQueue = JSON.parse(fs.readFileSync(path.join(DATA, 'work-queue.json'), 'utf8'));
const pinned: PinnedData = JSON.parse(fs.readFileSync(path.join(DATA, 'pinned.json'), 'utf8'));
const manual: ManualPinsFile = JSON.parse(fs.readFileSync(path.join(DATA, 'manual-pins.json'), 'utf8'));

const byId = new Map<string, Entry>(wq.entries.map((e) => [e.id, e]));
const pinnedIds = new Set(Object.keys(pinned));
const manualPins = manual.pins;
const entitySet = new Set<string>([...pinnedIds, ...manualPins.map((p) => p.id)]);

// sourceFile -> Map<1-based line, entryId>  (only entities in our set, for child detection)
const linesCache = new Map<string, string[]>();
const loadLines = (sf: string): string[] | null => {
  if (!linesCache.has(sf)) {
    const p = path.join(LORE, sf);
    linesCache.set(sf, fs.existsSync(p) ? fs.readFileSync(p, 'utf8').split('\n') : (null as never));
  }
  return linesCache.get(sf) ?? null;
};
const entityLineMap = new Map<string, Map<number, string>>();
for (const e of wq.entries) {
  if (!entitySet.has(e.id)) continue;
  if (!entityLineMap.has(e.sourceFile)) entityLineMap.set(e.sourceFile, new Map());
  entityLineMap.get(e.sourceFile)!.set(e.lineNumber, e.id);
}

// ---- body extraction ----
// Returns { body, tags } for a pinned entry. Body = the entity's own prose plus structural
// subsections, EXCLUDING nested child-entity sections (they get their own files).
function extractBody(e: Entry): { body: string; tags: string[] } {
  const lines = loadLines(e.sourceFile);
  if (!lines) return { body: '', tags: [] };
  const lvl = e.headerLevel;
  const start = e.lineNumber; // 0-based index of first line AFTER the header
  // extent end: next header with level <= lvl
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    const hl = headerLevel(lines[i]);
    if (hl !== null && hl <= lvl) { end = i; break; }
  }
  const childLines = entityLineMap.get(e.sourceFile);
  const kept: string[] = [];
  let i = start;
  while (i < end) {
    const hl = headerLevel(lines[i]);
    if (hl !== null && hl > lvl) {
      const childId = childLines?.get(i + 1); // 1-based
      if (childId && entitySet.has(childId)) {
        // skip this child-entity block (until next header with level <= child's level)
        let j = i + 1;
        for (; j < end; j++) {
          const jl = headerLevel(lines[j]);
          if (jl !== null && jl <= hl) break;
        }
        i = j;
        continue;
      }
    }
    kept.push(lines[i]);
    i++;
  }
  // pull a leading "Tags:" line into tags
  const tags = new Set<string>(e.tags ?? []);
  const bodyLines: string[] = [];
  for (const l of kept) {
    const tm = /^Tags:\s*(.+)$/.exec(l.trim());
    if (tm) { tm[1].split(',').forEach((t) => { const v = t.trim(); if (v) tags.add(v); }); continue; }
    bodyLines.push(l);
  }
  // drop structural headers left empty after child exclusion
  const cleaned: string[] = [];
  for (let k = 0; k < bodyLines.length; k++) {
    if (headerLevel(bodyLines[k]) !== null) {
      let hasContent = false;
      for (let m = k + 1; m < bodyLines.length; m++) {
        if (headerLevel(bodyLines[m]) !== null) break;
        if (bodyLines[m].trim() && bodyLines[m].trim() !== '---') { hasContent = true; break; }
      }
      if (!hasContent) continue;
    }
    cleaned.push(bodyLines[k]);
  }
  return { body: cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim(), tags: [...tags] };
}

function makeBlurb(body: string): string {
  if (!body || /^TODO\b/i.test(body.trim())) return '';
  const para = body.split(/\n\s*\n/).find((p) => p.trim() && headerLevel(p.trim()) === null) ?? '';
  const plain = para.replace(/[*_`>#]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();
  const sentence = (plain.match(/^.*?[.!?](\s|$)/)?.[0] ?? plain).trim();
  const words = sentence.split(' ');
  return (words.length > 25 ? words.slice(0, 25).join(' ') + '…' : sentence).trim();
}

// ---- parent resolution: nearest ancestor in the entity set ----
function resolveParent(e: Entry): string | null {
  let pid = e.parentEntryId;
  while (pid) {
    if (entitySet.has(pid)) return pid;
    pid = byId.get(pid)?.parentEntryId ?? null;
  }
  return null;
}

// ---- slug / filename ----
const usedNames = new Set<string>();
function fileName(name: string, id: string): string {
  let base = (name || 'entity').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!base) base = 'entity';
  let fn = `${base}.md`;
  if (usedNames.has(fn)) fn = `${base}-${id}.md`;
  usedNames.add(fn);
  return fn;
}

const q = (s: string) => JSON.stringify(s ?? '');
function frontmatter(fields: Record<string, string>): string {
  return ['---', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`), '---', ''].join('\n');
}

// ---- backup ----
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(DATA, 'backups', `pre-entity-migration-${stamp}`);
fs.mkdirSync(backupDir, { recursive: true });
for (const f of ['work-queue.json', 'pinned.json', 'manual-pins.json']) {
  fs.copyFileSync(path.join(DATA, f), path.join(backupDir, f));
}

// ---- emit ----
fs.mkdirSync(OUT, { recursive: true });
const emitted = new Map<string, { coordinates: [number, number]; parent: string | null }>();
let withBody = 0;

for (const id of pinnedIds) {
  const e = byId.get(id)!;
  const p = pinned[id];
  const { body, tags } = extractBody(e);
  if (body) withBody++;
  const parent = resolveParent(e);
  const blurb = makeBlurb(body);
  const fields: Record<string, string> = {
    id: q(id),
    name: q(e.name),
    entityType: p.type,
    parent: parent ? q(parent) : 'null',
    blurb: q(blurb),
    coordinates: `[${p.coordinates[0]}, ${p.coordinates[1]}]`,
    zoomLevel: String(p.zoomLevel),
  };
  if (tags.length) fields.tags = `[${tags.map(q).join(', ')}]`;
  fields.sources = `[${q(`all_sections_formatted/${e.sourceFile}#L${e.lineNumber}`)}]`;
  fs.writeFileSync(path.join(OUT, fileName(e.name, id)), frontmatter(fields) + (body ? body + '\n' : ''));
  emitted.set(id, { coordinates: p.coordinates, parent });
}

for (const p of manualPins) {
  const fields: Record<string, string> = {
    id: q(p.id),
    name: q(p.name),
    entityType: p.type,
    parent: 'null',
    blurb: q(''),
    coordinates: `[${p.coordinates[0]}, ${p.coordinates[1]}]`,
    zoomLevel: String(p.zoomLevel),
  };
  fs.writeFileSync(path.join(OUT, fileName(p.name, p.id)), frontmatter(fields));
  emitted.set(p.id, { coordinates: p.coordinates, parent: null });
}

// ---- verify (the gate) ----
const errors: string[] = [];
for (const id of pinnedIds) {
  const em = emitted.get(id);
  if (!em) { errors.push(`pinned id ${id} has no file`); continue; }
  const a = em.coordinates, b = pinned[id].coordinates;
  if (a[0] !== b[0] || a[1] !== b[1]) errors.push(`coord drift on ${id}: ${a} != ${b}`);
}
for (const p of manualPins) if (!emitted.has(p.id)) errors.push(`manual id ${p.id} has no file`);
let danglingParents = 0;
for (const [, v] of emitted) if (v.parent && !emitted.has(v.parent)) danglingParents++;

console.log(`\nEntities emitted: ${emitted.size}  (pinned ${pinnedIds.size} + manual ${manualPins.length})`);
console.log(`Pinned entities with extracted body: ${withBody}/${pinnedIds.size}`);
console.log(`Dangling parents (should be 0): ${danglingParents}`);
console.log(`Output: ${path.relative(REPO, OUT)}   Backup: ${path.relative(REPO, backupDir)}`);
if (errors.length) {
  console.error(`\n❌ VERIFY FAILED (${errors.length}):`);
  errors.slice(0, 20).forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log('\n✅ VERIFY PASSED — every pin id has a file with identical coordinates.');
