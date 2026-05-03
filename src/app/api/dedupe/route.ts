import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import type {
  AuditGroup,
  DedupeDecision,
  DedupeDecisions,
  MergeGroup,
  MergeGroupsFile,
  PinnedData,
} from '@/types/pinning';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const AUDIT_PATH = path.join(DATA_DIR, 'duplicate-audit.json');
const DECISIONS_PATH = path.join(DATA_DIR, 'dedupe-decisions.json');
const MERGE_GROUPS_PATH = path.join(DATA_DIR, 'merge-groups.json');
const PINNED_PATH = path.join(DATA_DIR, 'pinned.json');

interface AuditFile {
  summary: object;
  groups: AuditGroup[];
}

function loadAudit(): AuditFile {
  return JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf-8'));
}

function loadDecisions(): DedupeDecisions {
  if (!fs.existsSync(DECISIONS_PATH)) {
    return { version: 1, decisions: [] };
  }
  return JSON.parse(fs.readFileSync(DECISIONS_PATH, 'utf-8'));
}

function saveDecisions(d: DedupeDecisions) {
  fs.writeFileSync(DECISIONS_PATH, JSON.stringify(d, null, 2));
}

function loadPinned(): PinnedData {
  return JSON.parse(fs.readFileSync(PINNED_PATH, 'utf-8'));
}

function rebuildMergeGroupsFile(decisions: DedupeDecisions) {
  const out: MergeGroupsFile = {
    version: 1,
    generatedAt: new Date().toISOString(),
    groups: [],
  };
  let counter = 1;
  for (const d of decisions.decisions) {
    for (const mg of d.mergeGroups) {
      out.groups.push({
        id: `mg-${counter++}`,
        memberIds: mg.memberIds,
        primaryId: mg.primaryId,
        normalizedName: d.normalizedName,
      });
    }
  }
  fs.writeFileSync(MERGE_GROUPS_PATH, JSON.stringify(out, null, 2));
}

interface FilterOpts {
  filter: 'needs-review' | 'auto-merge' | 'auto-distinct' | 'all' | 'multi-pinned';
}

function filterGroups(groups: AuditGroup[], opts: FilterOpts): AuditGroup[] {
  if (opts.filter === 'all') return groups;
  if (opts.filter === 'multi-pinned') return groups.filter(g => g.pinnedCount >= 2);
  return groups.filter(g => g.verdict === opts.filter);
}

function computeStats(audit: AuditFile, decisions: DedupeDecisions) {
  const decided = new Set(decisions.decisions.map(d => d.normalizedName));
  const total = audit.groups.length;
  const decidedCount = audit.groups.filter(g => decided.has(g.normalizedName)).length;
  const pendingCount = total - decidedCount;
  return {
    total,
    decided: decidedCount,
    pending: pendingCount,
    byVerdict: {
      'needs-review': audit.groups.filter(g => g.verdict === 'needs-review').length,
      'auto-merge': audit.groups.filter(g => g.verdict === 'auto-merge').length,
      'auto-distinct': audit.groups.filter(g => g.verdict === 'auto-distinct').length,
    },
    multiPinned: audit.groups.filter(g => g.pinnedCount >= 2).length,
  };
}

// GET: returns current state + filtered group list, plus the next undecided group
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawFilter = searchParams.get('filter');
  const filterParam: FilterOpts['filter'] = rawFilter
    ? (rawFilter as FilterOpts['filter'])
    : 'needs-review';
  const cursorName = searchParams.get('cursor'); // optional: jump to specific group

  const audit = loadAudit();
  const decisions = loadDecisions();
  const decidedNames = new Set(decisions.decisions.map(d => d.normalizedName));

  const filtered = filterGroups(audit.groups, { filter: filterParam });
  const undecided = filtered.filter(g => !decidedNames.has(g.normalizedName));

  let currentGroup: AuditGroup | null = null;
  if (cursorName) {
    const found = audit.groups.find(g => g.normalizedName === cursorName);
    if (found) currentGroup = found;
  } else if (undecided.length > 0) {
    currentGroup = undecided[0];
  }

  const pinned = loadPinned();

  let currentDecision: DedupeDecision | null = null;
  if (currentGroup) {
    const found = decisions.decisions.find(d => d.normalizedName === currentGroup.normalizedName);
    if (found) currentDecision = found;
  }

  return NextResponse.json({
    filter: filterParam,
    currentGroup,
    decision: currentDecision,
    pinnedCoords: currentGroup
      ? Object.fromEntries(
          currentGroup.members
            .filter(m => pinned[m.id])
            .map(m => [m.id, pinned[m.id]])
        )
      : {},
    stats: {
      ...computeStats(audit, decisions),
      filteredTotal: filtered.length,
      filteredDecided: filtered.filter(g => decidedNames.has(g.normalizedName)).length,
      filteredPending: undecided.length,
    },
  });
}

// POST: record a decision for a group
export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    normalizedName: string;
    type: DedupeDecision['type'];
    mergeGroups: MergeGroup[];
    distinctMemberIds: string[];
    note?: string;
  };

  const audit = loadAudit();
  const group = audit.groups.find(g => g.normalizedName === body.normalizedName);
  if (!group) {
    return NextResponse.json({ error: `Group not found: ${body.normalizedName}` }, { status: 404 });
  }

  const allMemberIds = new Set(group.members.map(m => m.id));

  // Validate that all referenced IDs are in the group
  for (const mg of body.mergeGroups) {
    for (const id of mg.memberIds) {
      if (!allMemberIds.has(id)) {
        return NextResponse.json(
          { error: `Member ${id} is not in group ${body.normalizedName}` },
          { status: 400 }
        );
      }
    }
    if (!mg.memberIds.includes(mg.primaryId)) {
      return NextResponse.json(
        { error: `primaryId ${mg.primaryId} must be in memberIds` },
        { status: 400 }
      );
    }
  }
  for (const id of body.distinctMemberIds) {
    if (!allMemberIds.has(id)) {
      return NextResponse.json(
        { error: `distinctMemberId ${id} is not in group ${body.normalizedName}` },
        { status: 400 }
      );
    }
  }

  // Validate every group member is accounted for
  const accountedFor = new Set<string>(body.distinctMemberIds);
  for (const mg of body.mergeGroups) {
    for (const id of mg.memberIds) accountedFor.add(id);
  }
  for (const id of allMemberIds) {
    if (!accountedFor.has(id)) {
      return NextResponse.json(
        { error: `Member ${id} not assigned to merge group or distinct list` },
        { status: 400 }
      );
    }
  }

  const decisions = loadDecisions();
  const idx = decisions.decisions.findIndex(d => d.normalizedName === body.normalizedName);
  const newDecision: DedupeDecision = {
    normalizedName: body.normalizedName,
    type: body.type,
    mergeGroups: body.mergeGroups,
    distinctMemberIds: body.distinctMemberIds,
    decidedAt: new Date().toISOString(),
    note: body.note,
  };
  if (idx >= 0) decisions.decisions[idx] = newDecision;
  else decisions.decisions.push(newDecision);

  saveDecisions(decisions);
  rebuildMergeGroupsFile(decisions);

  return NextResponse.json({ success: true, decision: newDecision });
}

// DELETE: undo decision for a group
export async function DELETE(request: NextRequest) {
  const body = (await request.json()) as { normalizedName: string };
  const decisions = loadDecisions();
  const before = decisions.decisions.length;
  decisions.decisions = decisions.decisions.filter(d => d.normalizedName !== body.normalizedName);
  if (decisions.decisions.length === before) {
    return NextResponse.json({ error: 'No decision to undo' }, { status: 404 });
  }
  saveDecisions(decisions);
  rebuildMergeGroupsFile(decisions);
  return NextResponse.json({ success: true });
}
