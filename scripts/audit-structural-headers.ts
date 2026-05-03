/**
 * Read-only audit: find headers in work-queue.json that look like document
 * structure (e.g. "Climate", "Hooks", "Government") rather than locations.
 *
 * Heuristic: a name that recurs across many continent files at deeper header
 * levels is almost certainly a section template, not a place. A real location
 * appears in one file, possibly with a fuller and a stub form.
 *
 * Output:
 *   data/structural-header-audit.json — machine-readable
 *   data/structural-header-audit.md   — human-readable report
 *
 * Mutates nothing.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData, LoreEntry } from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const WORK_QUEUE = path.join(ROOT, 'data/work-queue.json');
const PINNED = path.join(ROOT, 'data/pinned.json');
const OUT_JSON = path.join(ROOT, 'data/structural-header-audit.json');
const OUT_MD = path.join(ROOT, 'data/structural-header-audit.md');

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/['’`"().,:;!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

interface Candidate {
  normalized: string;
  displayName: string;
  totalCount: number;
  fileCount: number;
  files: string[];
  levelCounts: Record<number, number>;
  pinnedCount: number;
  pendingCount: number;
  skippedCount: number;
  confidence: 'very-high' | 'high' | 'medium' | 'low';
  reason: string;
  members: Array<{
    id: string;
    sourceFile: string;
    lineNumber: number;
    headerLevel: number;
    status: LoreEntry['status'];
    isPinned: boolean;
    parentEntryId: string | null;
  }>;
}

function classify(c: {
  totalCount: number;
  fileCount: number;
  levelCounts: Record<number, number>;
}): { confidence: Candidate['confidence']; reason: string } {
  const deepLevels = Object.entries(c.levelCounts)
    .filter(([lvl]) => Number(lvl) >= 3)
    .reduce((acc, [, n]) => acc + n, 0);
  const deepRatio = deepLevels / c.totalCount;

  if (c.fileCount >= 4 && c.totalCount >= 6) {
    return {
      confidence: 'very-high',
      reason: `Appears in ${c.fileCount} continent files (${c.totalCount} total). Real locations don't repeat across continents like this.`,
    };
  }
  if (c.fileCount >= 3 && deepRatio >= 0.8) {
    return {
      confidence: 'very-high',
      reason: `Appears in ${c.fileCount} continent files at deep nesting (${Math.round(deepRatio * 100)}% at level 3+). Almost certainly a section template.`,
    };
  }
  if (c.fileCount >= 3) {
    return {
      confidence: 'high',
      reason: `Appears in ${c.fileCount} continent files. Likely a section template, but check.`,
    };
  }
  if (c.fileCount === 1 && c.totalCount >= 6 && deepRatio >= 0.9) {
    return {
      confidence: 'medium',
      reason: `${c.totalCount} occurrences in a single file, all at deep nesting. Could be a per-region section header.`,
    };
  }
  return {
    confidence: 'low',
    reason: 'Limited recurrence; probably real location duplicates rather than structure.',
  };
}

function main() {
  const queue: WorkQueue = JSON.parse(fs.readFileSync(WORK_QUEUE, 'utf-8'));
  const pinned: PinnedData = JSON.parse(fs.readFileSync(PINNED, 'utf-8'));

  const buckets = new Map<string, LoreEntry[]>();
  for (const e of queue.entries) {
    const key = normalizeName(e.name);
    if (!key) continue;
    const arr = buckets.get(key);
    if (arr) arr.push(e);
    else buckets.set(key, [e]);
  }

  const candidates: Candidate[] = [];
  for (const [normalized, members] of buckets) {
    if (members.length < 3) continue;
    const files = [...new Set(members.map(m => m.sourceFile))].sort();
    const levelCounts: Record<number, number> = {};
    for (const m of members) levelCounts[m.headerLevel] = (levelCounts[m.headerLevel] || 0) + 1;
    const stats = {
      totalCount: members.length,
      fileCount: files.length,
      levelCounts,
    };
    const { confidence, reason } = classify(stats);
    if (confidence === 'low') continue;

    candidates.push({
      normalized,
      displayName: members[0].name,
      ...stats,
      files,
      pinnedCount: members.filter(m => m.status === 'pinned').length,
      pendingCount: members.filter(m => m.status === 'pending').length,
      skippedCount: members.filter(m => m.status === 'skipped').length,
      confidence,
      reason,
      members: members.map(m => ({
        id: m.id,
        sourceFile: m.sourceFile,
        lineNumber: m.lineNumber,
        headerLevel: m.headerLevel,
        status: m.status,
        isPinned: !!pinned[m.id],
        parentEntryId: m.parentEntryId,
      })),
    });
  }

  // Sort by confidence, then total count desc.
  const order = { 'very-high': 0, high: 1, medium: 2, low: 3 } as const;
  candidates.sort((a, b) => order[a.confidence] - order[b.confidence] || b.totalCount - a.totalCount);

  // Aggregate stats
  const summary = {
    generatedAt: new Date().toISOString(),
    totalQueueEntries: queue.entries.length,
    totalCandidates: candidates.length,
    byConfidence: {
      'very-high': candidates.filter(c => c.confidence === 'very-high').length,
      high: candidates.filter(c => c.confidence === 'high').length,
      medium: candidates.filter(c => c.confidence === 'medium').length,
    },
    totalAffectedEntries: candidates.reduce((acc, c) => acc + c.totalCount, 0),
    totalAlreadyPinned: candidates.reduce((acc, c) => acc + c.pinnedCount, 0),
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify({ summary, candidates }, null, 2));

  // Write markdown report
  const lines: string[] = [];
  lines.push('# Structural-header audit');
  lines.push('');
  lines.push(`Generated: ${summary.generatedAt}`);
  lines.push('');
  lines.push('Names that look like document structure (section headings) rather than real locations.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total queue entries: ${summary.totalQueueEntries}`);
  lines.push(`- Candidate structural names: ${summary.totalCandidates}`);
  lines.push(`  - very-high confidence: ${summary.byConfidence['very-high']}`);
  lines.push(`  - high: ${summary.byConfidence.high}`);
  lines.push(`  - medium: ${summary.byConfidence.medium}`);
  lines.push(`- Entries affected (would be auto-skipped): ${summary.totalAffectedEntries}`);
  lines.push(`- Among those, already pinned: **${summary.totalAlreadyPinned}** (need per-entry review before mass-skip)`);
  lines.push('');

  for (const conf of ['very-high', 'high', 'medium'] as const) {
    const subset = candidates.filter(c => c.confidence === conf);
    if (!subset.length) continue;
    lines.push(`## Confidence: ${conf} (${subset.length})`);
    lines.push('');
    for (const c of subset) {
      lines.push(`### ${c.displayName}  \`${c.normalized}\``);
      lines.push('');
      lines.push(`- ${c.totalCount} occurrences across ${c.fileCount} file(s): ${c.files.map(f => f.replace('.md', '')).join(', ')}`);
      const lvl = Object.entries(c.levelCounts).map(([l, n]) => `L${l}=${n}`).join(', ');
      lines.push(`- Levels: ${lvl}`);
      lines.push(`- Status: ${c.pinnedCount} pinned, ${c.pendingCount} pending, ${c.skippedCount} skipped`);
      lines.push(`- Reason: ${c.reason}`);
      if (c.pinnedCount > 0) {
        lines.push('- ⚠️ Pinned entries (review before skip):');
        for (const m of c.members.filter(x => x.isPinned)) {
          lines.push(`    - id=${m.id} ${m.sourceFile.replace('.md', '')}#L${m.lineNumber}`);
        }
      }
      lines.push('');
    }
  }

  fs.writeFileSync(OUT_MD, lines.join('\n'));

  console.log(`Wrote ${OUT_JSON}`);
  console.log(`Wrote ${OUT_MD}`);
  console.log('');
  console.log(JSON.stringify(summary, null, 2));
}

main();
