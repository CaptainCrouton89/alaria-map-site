/**
 * Bulk-apply dedupe decisions:
 *   - All auto-merge audit groups → merge-all (single merge group, primary picked heuristically)
 *   - All auto-distinct audit groups → all-distinct
 *   - 25 needs-review groups → hand-crafted decisions (declared inline below)
 *
 * Backs up data/dedupe-decisions.json and data/merge-groups.json before mutating.
 * Does NOT touch data/pinned.json or data/work-queue.json (sweep-auto-skip handles the queue).
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  AuditGroup,
  DedupeDecision,
  DedupeDecisions,
  MergeGroupsFile,
} from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const AUDIT = path.join(ROOT, 'data/duplicate-audit.json');
const DECISIONS = path.join(ROOT, 'data/dedupe-decisions.json');
const MERGE_GROUPS = path.join(ROOT, 'data/merge-groups.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

interface AuditFile {
  summary: object;
  groups: AuditGroup[];
}

function ts(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function backup(p: string) {
  if (!fs.existsSync(p)) return;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const base = path.basename(p);
  fs.copyFileSync(p, path.join(BACKUP_DIR, `${base}.${ts()}.json`));
}

/** Pick a primary id for an auto-merge group:
 *  1. If ≥1 pinned member, prefer pinned with lowest header level (then lowest id).
 *  2. Otherwise lowest header level (then lowest id). */
function pickPrimary(group: AuditGroup): string {
  const pinned = group.members.filter(m => m.isPinned);
  const pool = pinned.length > 0 ? pinned : group.members;
  const sorted = [...pool].sort((a, b) => {
    if (a.headerLevel !== b.headerLevel) return a.headerLevel - b.headerLevel;
    return Number(a.id) - Number(b.id);
  });
  return sorted[0].id;
}

/** Hand-crafted decisions for the 25 needs-review groups. */
type HandDecision = Omit<DedupeDecision, 'decidedAt'>;

const HAND_DECISIONS: HandDecision[] = [
  // ─── Real places (split or merge based on parent chain + content) ───
  {
    normalizedName: 'howlwood',
    type: 'merge-subset',
    mergeGroups: [
      { memberIds: ['134', '193'], primaryId: '193' },
      { memberIds: ['606', '618'], primaryId: '606' },
    ],
    distinctMemberIds: [],
    note: 'Two forests: Edari Howlwood (Ve.md, ids 134/193) and Iylovia Howlwood (Clueanda.md, ids 606/618). All 4 pinned, coords confirm split.',
  },
  {
    normalizedName: 'besnoumeru',
    type: 'merge-subset',
    mergeGroups: [{ memberIds: ['400', '828'], primaryId: '400' }],
    distinctMemberIds: ['2561'],
    note: 'Catalina/Tornia Besnoumeru (400 pinned, 828 stub) is distinct from Nektuna Besnoumeru (2561). States.md confirms two same-named cities.',
  },
  {
    normalizedName: 'lacire',
    type: 'merge-all',
    mergeGroups: [{ memberIds: ['1084', '1189', '4515'], primaryId: '1084' }],
    distinctMemberIds: [],
    note: 'All three describe the same Walking Forest city-state on Springs of Vyowehr.',
  },
  {
    normalizedName: 'enimogos',
    type: 'merge-subset',
    mergeGroups: [{ memberIds: ['1117', '1135'], primaryId: '1117' }],
    distinctMemberIds: ['3848'],
    note: 'Postronamas ruins (1117/1135 in Clueanda) merged. 3848 in Upoceax is unrelated giant artifact.',
  },
  {
    normalizedName: 'deadmans lake',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: ['1422', '3814', '3942'],
    note: 'Three different lakes: Aboyinzu Chaal Nazzerox, Upoceax Sandreach, Upoceax Wycendeula/Kilbyurn.',
  },
  {
    normalizedName: 'drift',
    type: 'merge-subset',
    mergeGroups: [{ memberIds: ['3024', '3048'], primaryId: '3048' }],
    distinctMemberIds: ['4316'],
    note: 'Eoga Drift (3024 stub + 3048 detail) merged. Sheîr/Bledreon Drift (4316) is unrelated.',
  },
  {
    normalizedName: 'nox',
    type: 'merge-subset',
    mergeGroups: [{ memberIds: ['3948', '4046'], primaryId: '4046' }],
    distinctMemberIds: ['4452'],
    note: 'Eberri Ygonzi Nox (3948 stub + 4046 detail) merged. Zelidian Nox (4452) is a different village.',
  },
  {
    normalizedName: 'blackport',
    type: 'merge-all',
    mergeGroups: [{ memberIds: ['4376', '4379', '4503'], primaryId: '4376' }],
    distinctMemberIds: [],
    note: 'All three describe Crab Island pirate haven.',
  },

  // ─── Real places that share a name across continents (all-distinct) ───
  {
    normalizedName: 'sound',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: ['1105', '1649', '2219', '2353'],
    note: '"The Sound" subsections under different unrelated places (Melodia, Mumbling Forest, Bellowing Mountains, Screech).',
  },
  {
    normalizedName: 'forest',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: ['1165', '1231', '1624'],
    note: 'Different forests: The Guiles, Knulak, M\'Svyla.',
  },
  {
    normalizedName: 'islands',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: ['3369', '4307', '4359'],
    note: 'Different island groups: Floating Islands, Sea of Sharks, Xibli.',
  },

  // ─── Section-name clashes (subsections under different parents → all-distinct) ───
  {
    normalizedName: 'position and borders',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [
      '2464', '2485', '2510', '2520', '2531', '2545', '2556', '2583', '2594', '2612',
      '4185', '4253', '4277', '4311',
    ],
    note: 'Country-level subsection. Each describes a different country.',
  },
  {
    normalizedName: 'points of interest',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [
      '1602', '1906', '1994', '2103', '2112', '2166', '2183', '2396', '2426', '2436', '2451',
      '2493', '2554',
    ],
    note: 'Region-level subsection clash.',
  },
  {
    normalizedName: 'terrain and climate',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'PLACEHOLDER - members filled in from audit',
  },
  {
    normalizedName: 'borders',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'current status',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'relations with neighbors',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'territory',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'surrounding seas',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'city-states',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'nature',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'position and extent',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'daily life',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'what lies below',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
  {
    normalizedName: 'what lives there',
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: [],
    note: 'Section subheader clash.',
  },
];

function buildAutoMergeDecision(g: AuditGroup): HandDecision {
  return {
    normalizedName: g.normalizedName,
    type: 'merge-all',
    mergeGroups: [{ memberIds: g.members.map(m => m.id), primaryId: pickPrimary(g) }],
    distinctMemberIds: [],
    note: `auto-applied (audit verdict: auto-merge, ${g.confidence})`,
  };
}

function buildAutoDistinctDecision(g: AuditGroup): HandDecision {
  return {
    normalizedName: g.normalizedName,
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: g.members.map(m => m.id),
    note: `auto-applied (audit verdict: auto-distinct, ${g.confidence})`,
  };
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
  fs.writeFileSync(MERGE_GROUPS, JSON.stringify(out, null, 2));
}

function main() {
  const audit: AuditFile = JSON.parse(fs.readFileSync(AUDIT, 'utf-8'));
  const groupByName = new Map(audit.groups.map(g => [g.normalizedName, g]));

  // Resolve hand-decisions: for placeholder ones (empty distinctMemberIds with all-distinct),
  // populate from audit members.
  const handByName = new Map<string, HandDecision>();
  for (const h of HAND_DECISIONS) {
    const auditGroup = groupByName.get(h.normalizedName);
    if (!auditGroup) {
      throw new Error(`Hand decision references unknown normalizedName: ${h.normalizedName}`);
    }
    if (h.type === 'all-distinct' && h.distinctMemberIds.length === 0) {
      h.distinctMemberIds = auditGroup.members.map(m => m.id);
    }
    // Validate every member is accounted for
    const accounted = new Set<string>(h.distinctMemberIds);
    for (const mg of h.mergeGroups) for (const id of mg.memberIds) accounted.add(id);
    for (const m of auditGroup.members) {
      if (!accounted.has(m.id)) {
        throw new Error(
          `Hand decision for ${h.normalizedName} missing member ${m.id} (${m.name} from ${m.sourceFile})`
        );
      }
    }
    // Validate no extras
    const valid = new Set(auditGroup.members.map(m => m.id));
    for (const id of accounted) {
      if (!valid.has(id)) {
        throw new Error(`Hand decision for ${h.normalizedName} references unknown id ${id}`);
      }
    }
    handByName.set(h.normalizedName, h);
  }

  // Build decision list: hand-decisions take precedence, otherwise verdict-based
  const decisions: DedupeDecision[] = [];
  const now = new Date().toISOString();
  let autoMergeCount = 0;
  let autoDistinctCount = 0;
  let handCount = 0;

  for (const g of audit.groups) {
    const hand = handByName.get(g.normalizedName);
    if (hand) {
      decisions.push({ ...hand, decidedAt: now });
      handCount++;
      continue;
    }
    if (g.verdict === 'auto-merge') {
      decisions.push({ ...buildAutoMergeDecision(g), decidedAt: now });
      autoMergeCount++;
    } else if (g.verdict === 'auto-distinct') {
      decisions.push({ ...buildAutoDistinctDecision(g), decidedAt: now });
      autoDistinctCount++;
    } else {
      throw new Error(
        `No hand decision and verdict is ${g.verdict} for ${g.normalizedName}`
      );
    }
  }

  // Backup before mutating
  backup(DECISIONS);
  backup(MERGE_GROUPS);

  const out: DedupeDecisions = { version: 1, decisions };
  fs.writeFileSync(DECISIONS, JSON.stringify(out, null, 2));
  rebuildMergeGroupsFile(out);

  // Stats: how many merge groups, members affected
  let mergeGroupCount = 0;
  let mergeMemberCount = 0;
  let distinctCount = 0;
  for (const d of decisions) {
    mergeGroupCount += d.mergeGroups.length;
    for (const mg of d.mergeGroups) mergeMemberCount += mg.memberIds.length;
    distinctCount += d.distinctMemberIds.length;
  }

  console.log('Decision summary:');
  console.log(`  hand-crafted: ${handCount}`);
  console.log(`  auto-merge:   ${autoMergeCount}`);
  console.log(`  auto-distinct: ${autoDistinctCount}`);
  console.log(`  total decisions: ${decisions.length}`);
  console.log('');
  console.log('Merge groups in output:');
  console.log(`  groups: ${mergeGroupCount}`);
  console.log(`  members in merge groups: ${mergeMemberCount}`);
  console.log(`  distinct members: ${distinctCount}`);
}

main();
