/**
 * Read-only audit: classify name-collision groups in the work queue.
 *
 * For each set of entries sharing a normalized name (excluding entries already
 * filtered as structural headers), classify the group:
 *
 *   - auto-merge   : same sourceFile AND share an ancestor entry  →  same place
 *   - auto-distinct: different sourceFiles AND no parent overlap   →  different places
 *   - needs-review : everything else; human must decide
 *
 * Output:
 *   data/duplicate-audit.json  — full audit (all groups, full member detail)
 *
 * Mutates nothing.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData, LoreEntry } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const PINNED = path.join(ROOT, 'data/pinned.json');
const AUTO_SKIP = path.join(ROOT, 'data/auto-skip.json');
const OUT = path.join(ROOT, 'data/duplicate-audit.json');

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/['’`"().,:;!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface MemberAudit {
  id: string;
  name: string;
  sourceFile: string;
  lineNumber: number;
  headerLevel: number;
  status: LoreEntry['status'];
  isPinned: boolean;
  parentChain: Array<{ id: string; name: string }>;
  contentPreview: string;
}

interface GroupAudit {
  normalizedName: string;
  displayName: string;
  size: number;
  verdict: 'auto-merge' | 'auto-distinct' | 'needs-review';
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  pinnedCount: number;
  members: MemberAudit[];
}

function buildById(queue: WorkQueue): Map<string, LoreEntry> {
  const m = new Map<string, LoreEntry>();
  for (const e of queue.entries) m.set(e.id, e);
  return m;
}

function ancestorIds(entry: LoreEntry, byId: Map<string, LoreEntry>): string[] {
  const ids: string[] = [];
  let parentId = entry.parentEntryId;
  const seen = new Set<string>();
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId);
    ids.push(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    parentId = parent.parentEntryId;
  }
  return ids;
}

function ancestorChain(entry: LoreEntry, byId: Map<string, LoreEntry>) {
  const chain: Array<{ id: string; name: string }> = [];
  let parentId = entry.parentEntryId;
  const seen = new Set<string>();
  while (parentId && !seen.has(parentId)) {
    seen.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    chain.unshift({ id: parent.id, name: parent.name });
    parentId = parent.parentEntryId;
  }
  return chain;
}

function classifyGroup(
  members: LoreEntry[],
  byId: Map<string, LoreEntry>
): { verdict: GroupAudit['verdict']; confidence: GroupAudit['confidence']; reason: string } {
  const files = new Set(members.map(m => m.sourceFile));
  const allAncestorSets = members.map(m => new Set(ancestorIds(m, byId)));
  // Pairwise: do any two members share an ancestor?
  let anySharedAncestor = false;
  for (let i = 0; i < allAncestorSets.length && !anySharedAncestor; i++) {
    for (let j = i + 1; j < allAncestorSets.length && !anySharedAncestor; j++) {
      for (const a of allAncestorSets[i]) {
        if (allAncestorSets[j].has(a)) {
          anySharedAncestor = true;
          break;
        }
      }
    }
  }

  // All members in same file?
  const sameFile = files.size === 1;
  // All members in different files (no two share a file)?
  const allDifferentFiles = files.size === members.length;

  if (sameFile && anySharedAncestor) {
    return {
      verdict: 'auto-merge',
      confidence: 'high',
      reason: 'Same source file and members share an ancestor — almost certainly the same place written about at different depths.',
    };
  }
  if (sameFile && !anySharedAncestor) {
    return {
      verdict: 'needs-review',
      confidence: 'medium',
      reason: 'Same source file but no shared ancestor. Could be duplicates under different parents, or distinct places under different sections.',
    };
  }
  if (allDifferentFiles && !anySharedAncestor) {
    return {
      verdict: 'auto-distinct',
      confidence: 'high',
      reason: 'Different continent files and no shared ancestor — different places that happen to share a name.',
    };
  }
  if (!anySharedAncestor) {
    return {
      verdict: 'needs-review',
      confidence: 'low',
      reason: 'Mixed: some members in same file, some in different files. No shared ancestor across the group.',
    };
  }
  return {
    verdict: 'needs-review',
    confidence: 'low',
    reason: 'Cross-file with shared ancestor — unusual, worth checking.',
  };
}

function main() {
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));
  const pinned: PinnedData = JSON.parse(fs.readFileSync(PINNED, 'utf-8'));

  // Load structural skip list to exclude those names from this audit.
  let structural = new Set<string>();
  if (fs.existsSync(AUTO_SKIP)) {
    const data = JSON.parse(fs.readFileSync(AUTO_SKIP, 'utf-8'));
    structural = new Set<string>(data.structuralHeaders || []);
  }

  const byId = buildById(queue);

  const buckets = new Map<string, LoreEntry[]>();
  for (const e of queue.entries) {
    if (e.status === 'skipped') continue; // out of scope; either structural or human-skipped
    const key = normalizeName(e.name);
    if (!key || structural.has(key)) continue;
    const arr = buckets.get(key);
    if (arr) arr.push(e);
    else buckets.set(key, [e]);
  }

  const groups: GroupAudit[] = [];
  for (const [normalizedName, members] of buckets) {
    if (members.length < 2) continue;
    const { verdict, confidence, reason } = classifyGroup(members, byId);
    groups.push({
      normalizedName,
      displayName: members[0].name,
      size: members.length,
      verdict,
      confidence,
      reason,
      pinnedCount: members.filter(m => m.status === 'pinned').length,
      members: members.map(m => ({
        id: m.id,
        name: m.name,
        sourceFile: m.sourceFile,
        lineNumber: m.lineNumber,
        headerLevel: m.headerLevel,
        status: m.status,
        isPinned: !!pinned[m.id],
        parentChain: ancestorChain(m, byId),
        contentPreview: m.contentPreview,
      })),
    });
  }

  // Order: needs-review first (the work to do), then auto-* for completeness.
  const verdictOrder = { 'needs-review': 0, 'auto-merge': 1, 'auto-distinct': 2 } as const;
  groups.sort((a, b) => {
    const v = verdictOrder[a.verdict] - verdictOrder[b.verdict];
    if (v) return v;
    if (a.pinnedCount !== b.pinnedCount) return b.pinnedCount - a.pinnedCount;
    return b.size - a.size;
  });

  const summary = {
    generatedAt: new Date().toISOString(),
    totalGroups: groups.length,
    totalMembers: groups.reduce((acc, g) => acc + g.size, 0),
    byVerdict: {
      'auto-merge': groups.filter(g => g.verdict === 'auto-merge').length,
      'auto-distinct': groups.filter(g => g.verdict === 'auto-distinct').length,
      'needs-review': groups.filter(g => g.verdict === 'needs-review').length,
    },
    multiPinnedGroups: groups.filter(g => g.pinnedCount >= 2).length,
    onePinnedGroups: groups.filter(g => g.pinnedCount === 1).length,
    unpinnedGroups: groups.filter(g => g.pinnedCount === 0).length,
  };

  fs.writeFileSync(OUT, JSON.stringify({ summary, groups }, null, 2));
  console.log(`Wrote ${OUT}`);
  console.log('');
  console.log(JSON.stringify(summary, null, 2));
}

main();
