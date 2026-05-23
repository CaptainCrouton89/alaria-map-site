import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import type {
  WorkQueue,
  PinnedData,
  PinnedLocation,
  LoreEntry,
  EntryContext,
  ParentCrumb,
  SiblingSummary,
  RelatedEntry,
} from '@/types/pinning';
import type { LocationType } from '@/types/location';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const WORK_QUEUE_PATH = path.join(DATA_DIR, 'work-queue.json');
const PINNED_PATH = path.join(DATA_DIR, 'pinned.json');
const AUTO_SKIP_PATH = path.join(DATA_DIR, 'auto-skip.json');
const MERGE_GROUPS_PATH = path.join(DATA_DIR, 'merge-groups.json');

const LORE_DIR =
  process.env.ALARIA_LORE_DIR ||
  path.resolve(process.cwd(), '../heart-rush-tools/world-wikis/alaria/all_sections_formatted');

const SIBLINGS_CAP = 30;
const RELATED_CAP = 5;

const fileLineCache = new Map<string, string[]>();

function loadFileLines(sourceFile: string): string[] | null {
  if (fileLineCache.has(sourceFile)) {
    return fileLineCache.get(sourceFile)!;
  }
  const fullPath = path.join(LORE_DIR, sourceFile);
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');
    fileLineCache.set(sourceFile, lines);
    return lines;
  } catch {
    return null;
  }
}

function loadWorkQueue(): WorkQueue {
  const content = fs.readFileSync(WORK_QUEUE_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveWorkQueue(queue: WorkQueue): void {
  fs.writeFileSync(WORK_QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function loadPinned(): PinnedData {
  const content = fs.readFileSync(PINNED_PATH, 'utf-8');
  return JSON.parse(content);
}

function savePinned(pinned: PinnedData): void {
  fs.writeFileSync(PINNED_PATH, JSON.stringify(pinned, null, 2));
}

function loadStructuralSkipSet(): Set<string> {
  if (!fs.existsSync(AUTO_SKIP_PATH)) return new Set();
  const data = JSON.parse(fs.readFileSync(AUTO_SKIP_PATH, 'utf-8')) as {
    structuralHeaders?: string[];
  };
  if (!Array.isArray(data.structuralHeaders)) return new Set();
  return new Set(data.structuralHeaders);
}

interface MergeGroupSkipEntry {
  primaryId: string;
  memberIds: string[];
}

/**
 * Returns a map: nonPrimaryEntryId → primaryId.
 * Membership in this map means "this entry is a non-primary in a merge group" —
 * such entries are auto-skipped because the merge-group's primary is the canonical
 * entry for that place.
 */
function loadMergeGroupSkipMap(): Map<string, string> {
  const out = new Map<string, string>();
  if (!fs.existsSync(MERGE_GROUPS_PATH)) return out;
  const data = JSON.parse(fs.readFileSync(MERGE_GROUPS_PATH, 'utf-8')) as {
    groups?: MergeGroupSkipEntry[];
  };
  if (!Array.isArray(data.groups)) return out;
  for (const g of data.groups) {
    for (const id of g.memberIds) {
      if (id !== g.primaryId) out.set(id, g.primaryId);
    }
  }
  return out;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/['’`"().,:;!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find the first pending entry, auto-skipping along the way:
 *   - structural-header matches (always)
 *   - merge-group non-primaries (always — primary is the canonical entry,
 *     non-primaries represent the same place written about elsewhere)
 */
function findNextPending(
  queue: WorkQueue,
  pinned: PinnedData,
  structuralSet: Set<string>,
  mergeGroupSkipMap: Map<string, string>
): { entry: LoreEntry | null; index: number; mutated: boolean } {
  let mutated = false;
  for (let i = 0; i < queue.entries.length; i++) {
    const e = queue.entries[i];
    if (e.status !== 'pending') continue;
    if (structuralSet.has(normalizeName(e.name))) {
      e.status = 'skipped';
      mutated = true;
      continue;
    }
    if (mergeGroupSkipMap.has(e.id)) {
      e.status = 'skipped';
      mutated = true;
      continue;
    }
    return { entry: e, index: i, mutated };
  }
  return { entry: null, index: -1, mutated };
}

function buildParentChain(entry: LoreEntry, byId: Map<string, LoreEntry>): ParentCrumb[] {
  const chain: ParentCrumb[] = [];
  let parentId = entry.parentEntryId;
  const seen = new Set<string>();
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    chain.unshift({ id: parent.id, name: parent.name, headerLevel: parent.headerLevel });
    parentId = parent.parentEntryId;
  }
  return chain;
}

function extractSection(entry: LoreEntry): string | null {
  const lines = loadFileLines(entry.sourceFile);
  if (!lines) return null;
  // entry.lineNumber is 1-indexed and points at the header line itself.
  const startIdx = entry.lineNumber; // skip the header line
  const headerRegex = /^(#{1,6})\s+(.+)$/;
  const collected: string[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(headerRegex);
    if (m && m[1].length <= entry.headerLevel) break;
    if (line.startsWith('Tags:')) continue;
    collected.push(line);
  }
  // Trim leading/trailing blank lines.
  while (collected.length && !collected[0].trim()) collected.shift();
  while (collected.length && !collected[collected.length - 1].trim()) collected.pop();
  return collected.join('\n');
}

function buildNameIndex(queue: WorkQueue): Map<string, LoreEntry[]> {
  const idx = new Map<string, LoreEntry[]>();
  for (const e of queue.entries) {
    const key = normalizeName(e.name);
    if (!key) continue;
    const arr = idx.get(key);
    if (arr) arr.push(e);
    else idx.set(key, [e]);
  }
  return idx;
}

function ancestorNames(entry: LoreEntry, byId: Map<string, LoreEntry>): string[] {
  const names: string[] = [];
  let parentId = entry.parentEntryId;
  const seen = new Set<string>();
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    names.unshift(parent.name);
    parentId = parent.parentEntryId;
  }
  return names;
}

function collectRelated(
  entry: LoreEntry,
  nameIndex: Map<string, LoreEntry[]>,
  byId: Map<string, LoreEntry>
): RelatedEntry[] {
  const key = normalizeName(entry.name);
  const matches = nameIndex.get(key);
  if (!matches) return [];
  const out: RelatedEntry[] = [];
  for (const m of matches) {
    if (m.id === entry.id) continue;
    out.push({
      id: m.id,
      name: m.name,
      headerText: m.headerText,
      sourceFile: m.sourceFile,
      lineNumber: m.lineNumber,
      headerLevel: m.headerLevel,
      status: m.status,
      parentNames: ancestorNames(m, byId),
      content: extractSection(m),
    });
    if (out.length >= RELATED_CAP) break;
  }
  return out;
}

function collectSiblings(entry: LoreEntry, queue: WorkQueue): SiblingSummary[] {
  const out: SiblingSummary[] = [];
  for (const e of queue.entries) {
    if (e.id === entry.id) continue;
    if (e.sourceFile !== entry.sourceFile) continue;
    if (e.parentEntryId !== entry.parentEntryId) continue;
    if (e.headerLevel !== entry.headerLevel) continue;
    out.push({ id: e.id, name: e.name, status: e.status });
    if (out.length >= SIBLINGS_CAP) break;
  }
  return out;
}

function enrichEntry(
  entry: LoreEntry | null,
  queue: WorkQueue,
  byId: Map<string, LoreEntry>,
  nameIndex: Map<string, LoreEntry[]>
): EntryContext | null {
  if (!entry) return null;
  return {
    parentChain: buildParentChain(entry, byId),
    fullContent: extractSection(entry),
    siblings: collectSiblings(entry, queue),
    related: collectRelated(entry, nameIndex, byId),
  };
}

function indexQueue(queue: WorkQueue): Map<string, LoreEntry> {
  const byId = new Map<string, LoreEntry>();
  for (const e of queue.entries) byId.set(e.id, e);
  return byId;
}

function computeStats(queue: WorkQueue) {
  return {
    total: queue.entries.length,
    pending: queue.entries.filter(e => e.status === 'pending').length,
    pinned: queue.entries.filter(e => e.status === 'pinned').length,
    skipped: queue.entries.filter(e => e.status === 'skipped').length,
  };
}

// GET: Fetch current state
export async function GET() {
  const queue = loadWorkQueue();
  const pinned = loadPinned();
  const structuralSet = loadStructuralSkipSet();
  const mergeGroupSkipMap = loadMergeGroupSkipMap();

  const { entry: currentEntry, index: currentIndex, mutated } = findNextPending(
    queue,
    pinned,
    structuralSet,
    mergeGroupSkipMap
  );
  if (mutated) saveWorkQueue(queue);

  const byId = indexQueue(queue);
  const nameIndex = buildNameIndex(queue);

  // id → name for every pinned entry, so the map can show name labels.
  const pinnedNames: Record<string, string> = {};
  for (const id of Object.keys(pinned)) {
    const e = byId.get(id);
    if (e) pinnedNames[id] = e.name;
  }

  return NextResponse.json({
    currentEntry,
    currentIndex,
    stats: computeStats(queue),
    pinnedData: pinned,
    pinnedNames,
    context: enrichEntry(currentEntry, queue, byId, nameIndex),
  });
}

// POST: Pin a location or skip it
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, action, coordinates, zoomLevel, type } = body as {
    id: string;
    action: 'pin' | 'skip';
    coordinates?: [number, number];
    zoomLevel?: number;
    type?: LocationType;
  };

  const queue = loadWorkQueue();
  const pinned = loadPinned();

  // Find the entry
  const entryIndex = queue.entries.findIndex(e => e.id === id);
  if (entryIndex === -1) {
    return NextResponse.json({ error: `Entry not found: ${id}` }, { status: 404 });
  }

  const entry = queue.entries[entryIndex];

  if (action === 'pin') {
    if (!coordinates || zoomLevel === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: coordinates, zoomLevel, type' },
        { status: 400 }
      );
    }

    // Save pinned location
    const pinnedLocation: PinnedLocation = {
      coordinates,
      zoomLevel,
      type,
      pinnedAt: new Date().toISOString(),
    };
    pinned[id] = pinnedLocation;
    entry.status = 'pinned';
  } else if (action === 'skip') {
    entry.status = 'skipped';
    // If this entry was previously pinned (e.g. user pinned then changed mind),
    // clear the pin record so the public map doesn't show a marker for a skipped entry.
    if (pinned[id]) delete pinned[id];
  }

  // Save both files
  saveWorkQueue(queue);
  savePinned(pinned);

  const structuralSet = loadStructuralSkipSet();
  const mergeGroupSkipMap = loadMergeGroupSkipMap();
  const { entry: nextEntry, index: nextIndex, mutated } = findNextPending(
    queue,
    pinned,
    structuralSet,
    mergeGroupSkipMap
  );
  if (mutated) saveWorkQueue(queue);

  const byId = indexQueue(queue);
  const nameIndex = buildNameIndex(queue);

  return NextResponse.json({
    success: true,
    currentEntry: nextEntry,
    currentIndex: nextIndex,
    stats: computeStats(queue),
    context: enrichEntry(nextEntry, queue, byId, nameIndex),
  });
}

// PUT: Jump to a specific entry (for navigation)
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { action, sourceFile, fromIndex, targetIndex } = body as {
    action: 'jump' | 'jumpToFile' | 'back' | 'navigate';
    sourceFile?: string;
    fromIndex?: number;
    targetIndex?: number;
  };

  const queue = loadWorkQueue();
  const pinned = loadPinned();

  if (action === 'jumpToFile' && sourceFile) {
    const structuralSet = loadStructuralSkipSet();
    const mergeGroupSkipMap = loadMergeGroupSkipMap();
    let mutated = false;
    let foundEntry: LoreEntry | null = null;
    let foundIndex = -1;
    for (let i = 0; i < queue.entries.length; i++) {
      const e = queue.entries[i];
      if (e.sourceFile !== sourceFile || e.status !== 'pending') continue;
      if (structuralSet.has(normalizeName(e.name))) {
        e.status = 'skipped';
        mutated = true;
        continue;
      }
      if (mergeGroupSkipMap.has(e.id)) {
        e.status = 'skipped';
        mutated = true;
        continue;
      }
      foundEntry = e;
      foundIndex = i;
      break;
    }
    if (mutated) saveWorkQueue(queue);
    if (!foundEntry) {
      return NextResponse.json({ error: `No pending entries in ${sourceFile}` }, { status: 404 });
    }
    const byId = indexQueue(queue);
    const nameIndex = buildNameIndex(queue);
    return NextResponse.json({
      currentEntry: foundEntry,
      currentIndex: foundIndex,
      context: enrichEntry(foundEntry, queue, byId, nameIndex),
    });
  }

  if (action === 'navigate' && typeof targetIndex === 'number') {
    if (queue.entries.length === 0) {
      return NextResponse.json({ error: 'Queue is empty' }, { status: 404 });
    }
    const idx = Math.max(0, Math.min(queue.entries.length - 1, targetIndex));
    const entry = queue.entries[idx];
    const byId = indexQueue(queue);
    const nameIndex = buildNameIndex(queue);
    return NextResponse.json({
      currentEntry: entry,
      currentIndex: idx,
      stats: computeStats(queue),
      pinnedData: pinned,
      context: enrichEntry(entry, queue, byId, nameIndex),
    });
  }

  if (action === 'back' && fromIndex !== undefined && fromIndex > 0) {
    // Find the previous non-pending entry and revert it
    for (let i = fromIndex - 1; i >= 0; i--) {
      const entry = queue.entries[i];
      if (entry.status === 'pinned' || entry.status === 'skipped') {
        // Revert this entry to pending
        const previousStatus = entry.status;
        entry.status = 'pending';

        // If it was pinned, remove from pinned data
        if (previousStatus === 'pinned' && pinned[entry.id]) {
          delete pinned[entry.id];
          savePinned(pinned);
        }

        saveWorkQueue(queue);

        const byId = indexQueue(queue);
  const nameIndex = buildNameIndex(queue);

        return NextResponse.json({
          currentEntry: entry,
          currentIndex: i,
          stats: computeStats(queue),
          pinnedData: pinned,
          context: enrichEntry(entry, queue, byId, nameIndex),
        });
      }
    }
    return NextResponse.json({ error: 'No previous entry to go back to' }, { status: 404 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
