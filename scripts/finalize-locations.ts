import * as fs from 'fs';
import * as path from 'path';
import type { Location } from '../src/types/location';
import type { WorkQueue, PinnedData, LoreEntry } from '../src/types/pinning';

const DATA_DIR = path.resolve(__dirname, '../data');
const LORE_DIR = path.resolve(__dirname, '../../world-wikis/alaria/all_sections_formatted');
const WORK_QUEUE_PATH = path.join(DATA_DIR, 'work-queue.json');
const PINNED_PATH = path.join(DATA_DIR, 'pinned.json');
const OUTPUT_PATH = path.join(DATA_DIR, 'locations.json');
const AMBIGUOUS_PATH = path.join(DATA_DIR, 'ambiguous-references.json');

interface ContentSection {
  id: string;
  name: string;
  content: string;
  lineStart: number;
  lineEnd: number;
}

// Extract full content for each header section from a markdown file
function extractSections(filePath: string): ContentSection[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const sections: ContentSection[] = [];

  let currentSection: { name: string; lineStart: number; lines: string[] } | null = null;
  let sectionIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headerMatch) {
      // Save previous section
      if (currentSection) {
        sections.push({
          id: '', // Will be matched later
          name: currentSection.name,
          content: currentSection.lines.join('\n'),
          lineStart: currentSection.lineStart,
          lineEnd: i,
        });
      }

      currentSection = {
        name: headerMatch[2].trim(),
        lineStart: i + 1, // 1-indexed
        lines: [],
      };
      sectionIndex++;
    } else if (currentSection) {
      currentSection.lines.push(line);
    }
  }

  // Save final section
  if (currentSection) {
    sections.push({
      id: '',
      name: currentSection.name,
      content: currentSection.lines.join('\n'),
      lineStart: currentSection.lineStart,
      lineEnd: lines.length,
    });
  }

  return sections;
}

// Check if two entries share a common ancestor
function shareAncestor(
  id1: string,
  id2: string,
  entryMap: Map<string, LoreEntry>,
  maxDepth: number = 3
): boolean {
  const getAncestors = (id: string): Set<string> => {
    const ancestors = new Set<string>();
    let current = entryMap.get(id);
    let depth = 0;
    while (current && current.parentEntryId && depth < maxDepth) {
      ancestors.add(current.parentEntryId);
      current = entryMap.get(current.parentEntryId);
      depth++;
    }
    return ancestors;
  };

  const ancestors1 = getAncestors(id1);
  const ancestors2 = getAncestors(id2);

  // Check if either is ancestor of the other, or they share an ancestor
  if (ancestors1.has(id2) || ancestors2.has(id1)) return true;
  for (const a of ancestors1) {
    if (ancestors2.has(a)) return true;
  }
  return false;
}

function main() {
  // Load work queue and pinned data
  if (!fs.existsSync(WORK_QUEUE_PATH)) {
    throw new Error('Work queue not found. Run extract-locations.ts first.');
  }
  if (!fs.existsSync(PINNED_PATH)) {
    throw new Error('Pinned data not found. Run extract-locations.ts first.');
  }

  const workQueue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE_PATH, 'utf-8'));
  const pinnedData: PinnedData = JSON.parse(fs.readFileSync(PINNED_PATH, 'utf-8'));

  console.log(`Loaded ${workQueue.entries.length} entries from work queue`);
  console.log(`Loaded ${Object.keys(pinnedData).length} pinned locations`);

  // Build maps
  const entryMap = new Map<string, LoreEntry>();
  for (const entry of workQueue.entries) {
    entryMap.set(entry.id, entry);
  }

  // Get all pinned entry IDs
  const pinnedIds = new Set(Object.keys(pinnedData));

  // Build name -> [pinned ids] map for finding duplicates
  const nameToIds = new Map<string, string[]>();
  for (const id of pinnedIds) {
    const entry = entryMap.get(id);
    if (!entry) continue;
    const name = entry.name.toLowerCase();
    if (!nameToIds.has(name)) {
      nameToIds.set(name, []);
    }
    nameToIds.get(name)!.push(id);
  }

  // Count duplicates
  const duplicateNames = Array.from(nameToIds.entries()).filter(([_, ids]) => ids.length > 1);
  console.log(`Found ${duplicateNames.length} names with multiple pinned locations`);

  // Load full content from source files
  console.log('\nLoading source content...');
  const contentByFile = new Map<string, ContentSection[]>();
  const sourceFiles = [...new Set(workQueue.entries.map(e => e.sourceFile))];

  for (const fileName of sourceFiles) {
    const filePath = path.join(LORE_DIR, fileName);
    if (fs.existsSync(filePath)) {
      contentByFile.set(fileName, extractSections(filePath));
    }
  }

  // Match sections to entries by line number
  const contentById = new Map<string, string>();
  for (const entry of workQueue.entries) {
    const sections = contentByFile.get(entry.sourceFile);
    if (!sections) continue;

    // Find section matching this entry's line number
    const section = sections.find(s => s.lineStart === entry.lineNumber);
    if (section) {
      contentById.set(entry.id, section.content);
    }
  }

  console.log(`Matched content for ${contentById.size} entries`);

  // Find parent for each pinned entry (closest pinned ancestor)
  function findPinnedParent(entryId: string): string | null {
    let current = entryMap.get(entryId);
    while (current && current.parentEntryId) {
      if (pinnedIds.has(current.parentEntryId)) {
        return current.parentEntryId;
      }
      current = entryMap.get(current.parentEntryId);
    }
    return null;
  }

  // Find related locations by searching content for mentions
  console.log('\nFinding related locations...');

  interface AmbiguousReference {
    sourceId: string;
    sourceName: string;
    mentionedName: string;
    candidateIds: string[];
    candidateNames: string[];
    context: string;
  }

  const ambiguousReferences: AmbiguousReference[] = [];
  const relatedByIds = new Map<string, Set<string>>();

  // Initialize related sets
  for (const id of pinnedIds) {
    relatedByIds.set(id, new Set());
  }

  // Build search patterns for all pinned location names
  // Sort by length descending to match longer names first
  const pinnedNames = Array.from(nameToIds.keys()).sort((a, b) => b.length - a.length);

  // Skip very short or common words that would cause false positives
  const skipNames = new Set(['the', 'and', 'for', 'but', 'bay', 'sea', 'lake', 'hill', 'port', 'fort', 'east', 'west', 'north', 'south', 'old', 'new', 'great', 'little', 'upper', 'lower']);

  let totalRelated = 0;
  let totalAmbiguous = 0;

  for (const [sourceId, content] of contentById.entries()) {
    if (!pinnedIds.has(sourceId)) continue;

    const sourceEntry = entryMap.get(sourceId)!;
    const relatedSet = relatedByIds.get(sourceId)!;
    const contentLower = content.toLowerCase();

    for (const name of pinnedNames) {
      // Skip self-references and very short names
      if (name.length < 4 || skipNames.has(name)) continue;

      // Check if name appears in content
      const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (!regex.test(content)) continue;

      const candidateIds = nameToIds.get(name)!;

      // Skip if only candidate is self
      const otherCandidates = candidateIds.filter(id => id !== sourceId);
      if (otherCandidates.length === 0) continue;

      if (otherCandidates.length === 1) {
        // Unique name - auto-add
        relatedSet.add(otherCandidates[0]);
        totalRelated++;
      } else {
        // Multiple candidates - try to disambiguate by shared ancestry
        const sharedAncestorCandidates = otherCandidates.filter(id =>
          shareAncestor(sourceId, id, entryMap)
        );

        if (sharedAncestorCandidates.length === 1) {
          // Found exactly one candidate in same region
          relatedSet.add(sharedAncestorCandidates[0]);
          totalRelated++;
        } else if (sharedAncestorCandidates.length > 1) {
          // Multiple in same region - still ambiguous
          // Pick the closest one (check if one is direct parent/child)
          const directRelation = sharedAncestorCandidates.find(id => {
            const entry = entryMap.get(id);
            return entry?.parentEntryId === sourceId || sourceEntry.parentEntryId === id;
          });

          if (directRelation) {
            relatedSet.add(directRelation);
            totalRelated++;
          } else {
            // Log for manual review
            const match = content.match(new RegExp(`.{0,50}${name}.{0,50}`, 'i'));
            ambiguousReferences.push({
              sourceId,
              sourceName: sourceEntry.name,
              mentionedName: name,
              candidateIds: sharedAncestorCandidates,
              candidateNames: sharedAncestorCandidates.map(id => {
                const e = entryMap.get(id);
                return e ? `${e.name} (${e.sourceFile}:${e.lineNumber})` : id;
              }),
              context: match ? match[0].trim() : '',
            });
            totalAmbiguous++;
          }
        } else {
          // No candidates in same region - probably referring to a different region's location
          // Log for manual review
          const match = content.match(new RegExp(`.{0,50}${name}.{0,50}`, 'i'));
          ambiguousReferences.push({
            sourceId,
            sourceName: sourceEntry.name,
            mentionedName: name,
            candidateIds: otherCandidates,
            candidateNames: otherCandidates.map(id => {
              const e = entryMap.get(id);
              return e ? `${e.name} (${e.sourceFile}:${e.lineNumber})` : id;
            }),
            context: match ? match[0].trim() : '',
          });
          totalAmbiguous++;
        }
      }
    }
  }

  console.log(`Found ${totalRelated} auto-resolved related references`);
  console.log(`Found ${totalAmbiguous} ambiguous references for manual review`);

  // Build final locations array
  const locations: Location[] = [];

  for (const [id, pinned] of Object.entries(pinnedData)) {
    const entry = entryMap.get(id);
    if (!entry) {
      console.warn(`Warning: Pinned entry ${id} not found in work queue, skipping`);
      continue;
    }

    const relatedIds = Array.from(relatedByIds.get(id) || []);

    const location: Location = {
      id: entry.id,
      name: entry.name,
      type: pinned.type,
      coordinates: pinned.coordinates,
      zoomLevel: pinned.zoomLevel,
      parentId: findPinnedParent(entry.id),
      relatedIds,
      loreFile: entry.sourceFile,
      tags: entry.tags,
    };

    locations.push(location);
  }

  // Sort by zoom level, then by name
  locations.sort((a, b) => {
    if (a.zoomLevel !== b.zoomLevel) return a.zoomLevel - b.zoomLevel;
    return a.name.localeCompare(b.name);
  });

  // Write outputs
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(locations, null, 2));

  if (ambiguousReferences.length > 0) {
    fs.writeFileSync(AMBIGUOUS_PATH, JSON.stringify(ambiguousReferences, null, 2));
    console.log(`\nAmbiguous references saved to: ${AMBIGUOUS_PATH}`);
  }

  // Summary
  console.log('\n=== Finalization Complete ===');
  console.log(`Generated ${locations.length} locations`);
  console.log(`Output: ${OUTPUT_PATH}`);

  // Stats
  const byZoom = new Map<number, number>();
  const byType = new Map<string, number>();
  const withParent = locations.filter(l => l.parentId).length;
  const withRelated = locations.filter(l => l.relatedIds.length > 0).length;
  const totalRelatedCount = locations.reduce((sum, l) => sum + l.relatedIds.length, 0);

  for (const loc of locations) {
    byZoom.set(loc.zoomLevel, (byZoom.get(loc.zoomLevel) ?? 0) + 1);
    byType.set(loc.type, (byType.get(loc.type) ?? 0) + 1);
  }

  console.log('\nBy zoom level:');
  for (const [zoom, count] of Array.from(byZoom.entries()).sort((a, b) => a[0] - b[0])) {
    console.log(`  Level ${zoom}: ${count}`);
  }

  console.log('\nBy type:');
  for (const [type, count] of Array.from(byType.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  console.log(`\nLocations with parent: ${withParent}/${locations.length}`);
  console.log(`Locations with related: ${withRelated}/${locations.length}`);
  console.log(`Total related links: ${totalRelatedCount}`);

  if (ambiguousReferences.length > 0) {
    console.log(`\nAmbiguous references to review: ${ambiguousReferences.length}`);
    console.log('Review and manually add to locations.json as needed.');
  }
}

main();
