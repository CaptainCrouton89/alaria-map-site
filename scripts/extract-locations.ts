import * as fs from 'fs';
import * as path from 'path';
import type { LocationType } from '../src/types/location';
import type { LoreEntry, WorkQueue, PinnedData } from '../src/types/pinning';

const LORE_DIR = path.resolve(__dirname, '../../world-wikis/alaria/all_sections_formatted');
const DATA_DIR = path.resolve(__dirname, '../data');
const WORK_QUEUE_PATH = path.join(DATA_DIR, 'work-queue.json');
const PINNED_PATH = path.join(DATA_DIR, 'pinned.json');

// Continent/region files to process (geographic content only)
const CONTINENT_FILES = [
  'Ve.md',
  'Clueanda.md',
  'Aboyinzu.md',
  'Rimihuica.md',
  'Upoceax.md',
  'Western_Isles.md',
  'Greenwater_Isles.md',
  'City_States.md',
];

// Headers that are structural, not locations
const SKIP_HEADERS = new Set([
  'geography',
  'political climate',
  'what makes it interesting',
  'what will go wrong',
  'government & peoples',
  'economy',
  'military',
  'political geography',
  'primary conflicts',
  'history',
  'culture',
  'religion',
  'notable figures',
  'notable locations', // This is a section header, children are the actual locations
  'settlements',
  'features',
  'overview',
  'surrounding waters',
  'continental layout',
  'todo',
]);

// Tag to LocationType mapping
const TAG_TYPE_MAP: Record<string, LocationType> = {
  // Water
  sea: 'water',
  ocean: 'water',
  lake: 'water',
  river: 'water',
  bay: 'water',
  strait: 'water',
  water: 'water',

  // Dungeon-like (mapped to poi)
  dungeon: 'poi',
  crypt: 'poi',
  lair: 'poi',
  tomb: 'poi',
  cavern: 'poi',
  catacomb: 'poi',

  // Ruins
  ruins: 'ruins',
  ruin: 'ruins',
  abandoned: 'ruins',
  ancient: 'ruins',

  // Fortress
  fortress: 'fortress',
  fort: 'fortress',
  castle: 'fortress',
  stronghold: 'fortress',
  military: 'fortress',

  // Temple
  temple: 'poi',
  shrine: 'poi',
  magical: 'poi',
  portal: 'poi',
  sacred: 'poi',

  // City
  city: 'city',
  capital: 'city',
  citystate: 'city',
  metropolis: 'city',

  // Town
  settlement: 'town',
  village: 'town',
  town: 'town',
  hamlet: 'town',
  outpost: 'town',

  // Wilderness
  forest: 'wilderness',
  jungle: 'wilderness',
  swamp: 'wilderness',
  rainforest: 'wilderness',
  woods: 'wilderness',

  // Natural terrain (mapped to wilderness)
  mountains: 'wilderness',
  mountain: 'wilderness',
  hills: 'wilderness',
  plains: 'wilderness',
  desert: 'wilderness',
  cliffs: 'wilderness',
  canyon: 'wilderness',
  valley: 'wilderness',
  peaks: 'wilderness',

  // Region
  state: 'region',
  nation: 'region',
  region: 'region',
  island: 'region',
  archipelago: 'region',
  continent: 'region',

  // POI
  poi: 'poi',
};

// Content patterns for fallback detection
const CONTENT_PATTERNS: Array<[RegExp, LocationType]> = [
  [/\b(temple|shrine|sacred|holy|divine|altar)\b/i, 'poi'],
  [/\b(ruins?|ancient|abandoned|crumbl|decay|fallen)\b/i, 'ruins'],
  [/\b(dungeon|crypt|tomb|lair|cavern|catacomb)\b/i, 'poi'],
  [/\b(fortress|castle|fort|stronghold|citadel|keep)\b/i, 'fortress'],
  [/\b(capital|metropolis|great city)\b/i, 'city'],
  [/\b(village|hamlet|settlement|small town)\b/i, 'town'],
  [/\b(forest|jungle|swamp|marsh|woods|grove)\b/i, 'wilderness'],
  [/\b(mountain|peak|hill|canyon|valley|cliff|ridge)\b/i, 'wilderness'],
  [/\b(sea|ocean|lake|river|bay|strait|gulf|waters)\b/i, 'water'],
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseTagsLine(line: string): string[] {
  const match = line.match(/^Tags:\s*(.+)$/i);
  if (!match) return [];
  return match[1].split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

function suggestType(entry: { tags: string[]; contentPreview: string; headerLevel: number }): LocationType {
  const { tags, contentPreview, headerLevel } = entry;

  // Tag-based detection (highest priority)
  for (const tag of tags) {
    const lowerTag = tag.toLowerCase();
    if (TAG_TYPE_MAP[lowerTag]) {
      return TAG_TYPE_MAP[lowerTag];
    }
  }

  // Content pattern matching
  for (const [pattern, type] of CONTENT_PATTERNS) {
    if (pattern.test(contentPreview)) {
      return type;
    }
  }

  // Header level fallback
  if (headerLevel <= 2) return 'region';
  if (headerLevel === 3) return 'city';
  if (headerLevel === 4) return 'town';
  return 'poi';
}

function suggestZoomLevel(headerLevel: number): number {
  // Map header levels to zoom levels
  // ## (2) -> zoom 1-2 (continents, major regions)
  // ### (3) -> zoom 2-3 (kingdoms, cities)
  // #### (4) -> zoom 3-4 (towns, landmarks)
  // ##### (5+) -> zoom 4-5 (POIs)
  const zoomMap: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 5,
  };
  const zoom = zoomMap[headerLevel];
  if (zoom === undefined) {
    throw new Error(`Invalid header level: ${headerLevel}. Expected 1-6.`);
  }
  return zoom;
}

function isSkippableHeader(name: string): boolean {
  return SKIP_HEADERS.has(name.toLowerCase().trim());
}

interface ParsedHeader {
  level: number;
  name: string;
  lineNumber: number;
}

let nextId = 1;

function parseMarkdownFile(filePath: string, fileName: string): LoreEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const entries: LoreEntry[] = [];

  // Stack to track parent headers at each level
  const parentStack: Map<number, string> = new Map();

  let currentHeader: ParsedHeader | null = null;
  let currentTags: string[] = [];
  let contentLines: string[] = [];

  const flushEntry = () => {
    if (!currentHeader) return;

    const name = currentHeader.name;
    if (isSkippableHeader(name)) {
      currentHeader = null;
      currentTags = [];
      contentLines = [];
      return;
    }

    const contentPreview = contentLines
      .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('Tags:'))
      .slice(0, 5)
      .join(' ')
      .slice(0, 500);

    // Find parent: look for the most recent header with a lower level
    let parentEntryId: string | null = null;
    for (let level = currentHeader.level - 1; level >= 1; level--) {
      if (parentStack.has(level)) {
        parentEntryId = parentStack.get(level)!;
        break;
      }
    }

    // Build ID: simple incrementing counter for stability
    const id = String(nextId++);

    // Update parent stack (stores ID for parent lookups)
    parentStack.set(currentHeader.level, id);
    // Clear any deeper levels
    for (let level = currentHeader.level + 1; level <= 6; level++) {
      parentStack.delete(level);
    }

    const entry: LoreEntry = {
      id,
      name,
      headerLevel: currentHeader.level,
      headerText: '#'.repeat(currentHeader.level) + ' ' + name,
      lineNumber: currentHeader.lineNumber,
      sourceFile: fileName,
      tags: currentTags,
      suggestedType: suggestType({ tags: currentTags, contentPreview, headerLevel: currentHeader.level }),
      suggestedZoomLevel: suggestZoomLevel(currentHeader.level),
      contentPreview,
      parentEntryId,
      status: 'pending',
    };

    entries.push(entry);

    currentHeader = null;
    currentTags = [];
    contentLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Check for header
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      // Flush previous entry
      flushEntry();

      const level = headerMatch[1].length;
      const name = headerMatch[2].trim();

      currentHeader = { level, name, lineNumber };
      continue;
    }

    // Check for tags line (immediately after header)
    if (line.startsWith('Tags:')) {
      currentTags = parseTagsLine(line);
      continue;
    }

    // Accumulate content
    if (currentHeader) {
      contentLines.push(line);
    }
  }

  // Flush final entry
  flushEntry();

  return entries;
}

function main() {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Load existing pinned data to preserve status
  let existingPinned: PinnedData = {};
  if (fs.existsSync(PINNED_PATH)) {
    existingPinned = JSON.parse(fs.readFileSync(PINNED_PATH, 'utf-8'));
    console.log(`Loaded ${Object.keys(existingPinned).length} existing pinned locations`);
  }

  // Load existing work queue to preserve skipped status
  const existingStatuses = new Map<string, 'pending' | 'pinned' | 'skipped'>();
  if (fs.existsSync(WORK_QUEUE_PATH)) {
    const existingQueue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE_PATH, 'utf-8'));
    console.log(`Loaded existing work queue with ${existingQueue.entries.length} entries`);
    for (const entry of existingQueue.entries) {
      existingStatuses.set(entry.id, entry.status);
    }
  }

  // Process all continent files
  const allEntries: LoreEntry[] = [];

  for (const fileName of CONTINENT_FILES) {
    const filePath = path.join(LORE_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${fileName} not found, skipping`);
      continue;
    }

    console.log(`Processing ${fileName}...`);
    const entries = parseMarkdownFile(filePath, fileName);

    // Restore status from existing data
    for (const entry of entries) {
      if (existingPinned[entry.id]) {
        entry.status = 'pinned';
      } else if (existingStatuses.get(entry.id) === 'skipped') {
        entry.status = 'skipped';
      }
    }

    allEntries.push(...entries);
    console.log(`  Found ${entries.length} location entries`);
  }

  // Find current index (first pending entry)
  let currentIndex = 0;
  for (let i = 0; i < allEntries.length; i++) {
    if (allEntries[i].status === 'pending') {
      currentIndex = i;
      break;
    }
  }

  const workQueue: WorkQueue = {
    version: 1,
    extractedAt: new Date().toISOString(),
    sourceFiles: CONTINENT_FILES,
    entries: allEntries,
    currentIndex,
  };

  // Write work queue
  fs.writeFileSync(WORK_QUEUE_PATH, JSON.stringify(workQueue, null, 2));

  // Initialize pinned.json if it doesn't exist
  if (!fs.existsSync(PINNED_PATH)) {
    fs.writeFileSync(PINNED_PATH, JSON.stringify({}, null, 2));
  }

  // Summary
  const pending = allEntries.filter(e => e.status === 'pending').length;
  const pinned = allEntries.filter(e => e.status === 'pinned').length;
  const skipped = allEntries.filter(e => e.status === 'skipped').length;

  console.log('\n=== Extraction Complete ===');
  console.log(`Total entries: ${allEntries.length}`);
  console.log(`  Pending: ${pending}`);
  console.log(`  Pinned: ${pinned}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`\nWork queue saved to: ${WORK_QUEUE_PATH}`);

  // Type distribution
  const typeCounts = new Map<string, number>();
  for (const entry of allEntries) {
    const count = typeCounts.get(entry.suggestedType) || 0;
    typeCounts.set(entry.suggestedType, count + 1);
  }
  console.log('\nSuggested type distribution:');
  for (const [type, count] of Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }
}

main();
