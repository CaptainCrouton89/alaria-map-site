/**
 * Bulk-apply dedupe decisions:
 *   - All auto-merge audit groups → single merge group, primary picked heuristically
 *   - All auto-distinct audit groups → all-distinct
 *   - Overrides from data/dedupe-overrides.json take precedence over verdicts
 *   - Uncovered needs-review groups: warned (not thrown) so they're surfaced for follow-up
 *
 * Tolerates audit drift: override member IDs are intersected with current audit; merge
 * groups that lose multi-member status after intersection are dropped, and overrides
 * that become empty are skipped (the audit's verdict-based path takes over).
 *
 * Backs up data/dedupe-decisions.json and data/merge-groups.json before mutating.
 */

import * as fs from 'fs';
import * as path from 'path';
import type {
  AuditGroup,
  DedupeDecision,
  DedupeDecisions,
  MergeGroup,
  MergeGroupsFile,
} from '../src/types/pinning';

const ROOT = path.resolve(__dirname, '..');
const AUDIT = path.join(ROOT, 'data/duplicate-audit.json');
const OVERRIDES = path.join(ROOT, 'data/dedupe-overrides.json');
const DECISIONS = path.join(ROOT, 'data/dedupe-decisions.json');
const MERGE_GROUPS = path.join(ROOT, 'data/merge-groups.json');
const BACKUP_DIR = path.join(ROOT, 'data/backups');

interface AuditFile {
  summary: object;
  groups: AuditGroup[];
}

type Override = Omit<DedupeDecision, 'decidedAt'>;

interface OverridesFile {
  version: number;
  overrides: Override[];
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

function pickPrimary(group: AuditGroup): string {
  const pinned = group.members.filter(m => m.isPinned);
  const pool = pinned.length > 0 ? pinned : group.members;
  const sorted = [...pool].sort((a, b) => {
    if (a.headerLevel !== b.headerLevel) return a.headerLevel - b.headerLevel;
    return Number(a.id) - Number(b.id);
  });
  return sorted[0].id;
}

function buildAutoMergeDecision(g: AuditGroup): Override {
  return {
    normalizedName: g.normalizedName,
    type: 'merge-all',
    mergeGroups: [{ memberIds: g.members.map(m => m.id), primaryId: pickPrimary(g) }],
    distinctMemberIds: [],
    note: `auto-applied (audit verdict: auto-merge, ${g.confidence})`,
  };
}

function buildAutoDistinctDecision(g: AuditGroup): Override {
  return {
    normalizedName: g.normalizedName,
    type: 'all-distinct',
    mergeGroups: [],
    distinctMemberIds: g.members.map(m => m.id),
    note: `auto-applied (audit verdict: auto-distinct, ${g.confidence})`,
  };
}

/**
 * Reduce an override to only the audit members that still exist.
 * Returns null if the override has nothing left to say.
 */
function reconcileOverride(
  override: Override,
  auditGroup: AuditGroup
): { decision: Override; warnings: string[] } | null {
  const validIds = new Set(auditGroup.members.map(m => m.id));
  const warnings: string[] = [];

  // Filter and validate primary IDs
  const filteredMergeGroups: MergeGroup[] = [];
  for (const mg of override.mergeGroups) {
    const keptIds = mg.memberIds.filter(id => validIds.has(id));
    const droppedIds = mg.memberIds.filter(id => !validIds.has(id));
    if (droppedIds.length > 0) {
      warnings.push(`  - merge group dropped members [${droppedIds.join(',')}] (no longer in audit)`);
    }
    if (keptIds.length < 2) {
      if (keptIds.length === 1) {
        warnings.push(`  - merge group reduced to single member [${keptIds[0]}], dropping group`);
      }
      continue;
    }
    let primaryId = mg.primaryId;
    if (!keptIds.includes(primaryId)) {
      // Original primary was dropped; pick the lowest-id remaining as new primary
      primaryId = [...keptIds].sort((a, b) => Number(a) - Number(b))[0];
      warnings.push(`  - primary ${mg.primaryId} dropped, new primary: ${primaryId}`);
    }
    filteredMergeGroups.push({ memberIds: keptIds, primaryId });
  }

  const filteredDistinct = override.distinctMemberIds.filter(id => validIds.has(id));
  const droppedDistinct = override.distinctMemberIds.filter(id => !validIds.has(id));
  if (droppedDistinct.length > 0) {
    warnings.push(`  - distinct list dropped [${droppedDistinct.join(',')}] (no longer in audit)`);
  }

  // Members the override didn't account for (audit grew unexpectedly)
  const accounted = new Set<string>(filteredDistinct);
  for (const mg of filteredMergeGroups) for (const id of mg.memberIds) accounted.add(id);
  const unaccounted = auditGroup.members.map(m => m.id).filter(id => !accounted.has(id));
  if (unaccounted.length > 0) {
    // New members appeared since the override was written. Treat as distinct.
    warnings.push(`  - new audit members not covered by override [${unaccounted.join(',')}] — treating as distinct`);
    filteredDistinct.push(...unaccounted);
  }

  if (filteredMergeGroups.length === 0 && filteredDistinct.length === 0) {
    warnings.push(`  - override is empty after reconciliation, skipping (audit verdict will apply)`);
    return null;
  }

  return {
    decision: {
      normalizedName: override.normalizedName,
      type: override.type,
      mergeGroups: filteredMergeGroups,
      distinctMemberIds: filteredDistinct,
      note: override.note,
    },
    warnings,
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
  const overridesFile: OverridesFile = fs.existsSync(OVERRIDES)
    ? JSON.parse(fs.readFileSync(OVERRIDES, 'utf-8'))
    : { version: 1, overrides: [] };

  const groupByName = new Map(audit.groups.map(g => [g.normalizedName, g]));
  const overrideByName = new Map(overridesFile.overrides.map(o => [o.normalizedName, o]));

  const decisions: DedupeDecision[] = [];
  const now = new Date().toISOString();

  let overrideUsed = 0;
  let overrideDriftSkipped = 0;
  let overrideMissingFromAudit = 0;
  let autoMerge = 0;
  let autoDistinct = 0;
  let needsReviewUncovered: AuditGroup[] = [];

  // Track which overrides we've consumed
  const usedOverrides = new Set<string>();

  for (const g of audit.groups) {
    const override = overrideByName.get(g.normalizedName);
    if (override) {
      usedOverrides.add(g.normalizedName);
      const reconciled = reconcileOverride(override, g);
      if (reconciled) {
        if (reconciled.warnings.length > 0) {
          console.log(`override "${g.normalizedName}" reconciled with drift:`);
          for (const w of reconciled.warnings) console.log(w);
        }
        decisions.push({ ...reconciled.decision, decidedAt: now });
        overrideUsed++;
        continue;
      }
      console.log(`override "${g.normalizedName}" empty after reconciliation, falling through to verdict`);
      overrideDriftSkipped++;
    }

    if (g.verdict === 'auto-merge') {
      decisions.push({ ...buildAutoMergeDecision(g), decidedAt: now });
      autoMerge++;
    } else if (g.verdict === 'auto-distinct') {
      decisions.push({ ...buildAutoDistinctDecision(g), decidedAt: now });
      autoDistinct++;
    } else {
      needsReviewUncovered.push(g);
    }
  }

  // Overrides whose normalizedName isn't in the current audit
  for (const o of overridesFile.overrides) {
    if (!usedOverrides.has(o.normalizedName)) {
      overrideMissingFromAudit++;
      console.log(`override "${o.normalizedName}" not in current audit, skipped`);
    }
  }

  // Backup before mutating
  backup(DECISIONS);
  backup(MERGE_GROUPS);

  const out: DedupeDecisions = { version: 1, decisions };
  fs.writeFileSync(DECISIONS, JSON.stringify(out, null, 2));
  rebuildMergeGroupsFile(out);

  let mergeGroupCount = 0;
  let mergeMemberCount = 0;
  let distinctCount = 0;
  for (const d of decisions) {
    mergeGroupCount += d.mergeGroups.length;
    for (const mg of d.mergeGroups) mergeMemberCount += mg.memberIds.length;
    distinctCount += d.distinctMemberIds.length;
  }

  console.log('');
  console.log('Decision summary:');
  console.log(`  override used:           ${overrideUsed}`);
  console.log(`  override drift-skipped:  ${overrideDriftSkipped}`);
  console.log(`  override not in audit:   ${overrideMissingFromAudit}`);
  console.log(`  auto-merge:              ${autoMerge}`);
  console.log(`  auto-distinct:           ${autoDistinct}`);
  console.log(`  total decisions:         ${decisions.length}`);
  console.log('');
  console.log('Merge groups in output:');
  console.log(`  groups:                  ${mergeGroupCount}`);
  console.log(`  members in merge groups: ${mergeMemberCount}`);
  console.log(`  distinct members:        ${distinctCount}`);

  if (needsReviewUncovered.length > 0) {
    console.log('');
    console.log(`WARNING: ${needsReviewUncovered.length} needs-review group(s) have no override:`);
    for (const g of needsReviewUncovered) {
      console.log(`  - ${g.normalizedName} (${g.size} members across ${new Set(g.members.map(m => m.sourceFile)).size} files, ${g.pinnedCount} pinned)`);
    }
    console.log('Add overrides for these in data/dedupe-overrides.json, then re-run.');
  }
}

main();
