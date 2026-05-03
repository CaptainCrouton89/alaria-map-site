/**
 * Read-only: extract groups from data/duplicate-audit.json where 2+ members are
 * already pinned. These are the highest-priority items because they represent
 * pins-on-the-map that may need consolidation.
 *
 * Output: data/multi-pinned-groups.md
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const AUDIT = path.join(ROOT, 'data/duplicate-audit.json');
const OUT = path.join(ROOT, 'data/multi-pinned-groups.md');
const PINNED_FILE = path.join(ROOT, 'data/pinned.json');

interface AuditGroup {
  normalizedName: string;
  displayName: string;
  size: number;
  verdict: string;
  confidence: string;
  reason: string;
  pinnedCount: number;
  members: Array<{
    id: string;
    name: string;
    sourceFile: string;
    lineNumber: number;
    headerLevel: number;
    status: string;
    isPinned: boolean;
    parentChain: Array<{ id: string; name: string }>;
    contentPreview: string;
  }>;
}

function main() {
  const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf-8')) as {
    summary: object;
    groups: AuditGroup[];
  };
  const pinned = JSON.parse(fs.readFileSync(PINNED_FILE, 'utf-8')) as Record<
    string,
    { coordinates: [number, number]; zoomLevel: number; type: string }
  >;

  const multi = audit.groups.filter(g => g.pinnedCount >= 2);

  multi.sort((a, b) => b.pinnedCount - a.pinnedCount || b.size - a.size);

  const lines: string[] = [];
  lines.push('# Multi-pinned duplicate groups');
  lines.push('');
  lines.push(`Total groups with 2+ pinned members: **${multi.length}**`);
  lines.push('');
  lines.push(
    'For each group: pick which member to keep as the canonical pin. The others should be unpinned and added to a merge group (handled in /dedupe). This report is read-only — no mutations.'
  );
  lines.push('');

  for (const g of multi) {
    lines.push(`## ${g.displayName}`);
    lines.push('');
    lines.push(`- Verdict: **${g.verdict}** (${g.confidence})`);
    lines.push(`- ${g.size} members, ${g.pinnedCount} pinned`);
    lines.push(`- Reason: ${g.reason}`);
    lines.push('');
    lines.push('| Pin? | Member | File:Line | Parent path | Coords | Zoom | Type |');
    lines.push('|------|--------|-----------|-------------|--------|------|------|');
    for (const m of g.members) {
      const pinInfo = pinned[m.id];
      const parentsJoined = m.parentChain.map(p => p.name).join(' › ');
      const parents = parentsJoined.length > 0 ? parentsJoined : '—';
      const coords = pinInfo ? `[${pinInfo.coordinates[0]}, ${pinInfo.coordinates[1]}]` : '—';
      const zoom = pinInfo ? String(pinInfo.zoomLevel) : '—';
      const type = pinInfo ? pinInfo.type : '—';
      const marker = m.isPinned ? '📌' : '';
      lines.push(
        `| ${marker} | id=${m.id} ${m.name} | ${m.sourceFile.replace('.md', '')}:${m.lineNumber} | ${parents} | ${coords} | ${zoom} | ${type} |`
      );
    }
    // Content previews of pinned members for disambiguation
    const pinnedMembers = g.members.filter(m => m.isPinned);
    if (pinnedMembers.length > 0) {
      lines.push('');
      lines.push('**Pinned member content previews:**');
      for (const m of pinnedMembers) {
        const preview = m.contentPreview.replace(/\s+/g, ' ').slice(0, 200);
        const display = preview.length > 0 ? preview : '(empty)';
        lines.push(`- id=${m.id}: ${display}`);
      }
    }
    lines.push('');
  }

  fs.writeFileSync(OUT, lines.join('\n'));
  console.log(`Wrote ${OUT}`);
  console.log(`Multi-pinned groups: ${multi.length}`);
}

main();
