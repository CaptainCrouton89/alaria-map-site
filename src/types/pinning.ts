import type { LocationType } from './location';

export interface LoreEntry {
  id: string;
  name: string;
  headerLevel: number;
  headerText: string;
  lineNumber: number;
  sourceFile: string;
  tags: string[];
  suggestedType: LocationType;
  suggestedZoomLevel: number;
  contentPreview: string;
  parentEntryId: string | null;
  status: 'pending' | 'pinned' | 'skipped';
}

export interface WorkQueue {
  version: number;
  extractedAt: string;
  sourceFiles: string[];
  entries: LoreEntry[];
  currentIndex: number;
}

export interface PinnedLocation {
  coordinates: [number, number];
  zoomLevel: number;
  type: LocationType;
  pinnedAt: string;
}

export interface PinnedData {
  [id: string]: PinnedLocation;
}

export interface ParentCrumb {
  id: string;
  name: string;
  headerLevel: number;
}

export interface SiblingSummary {
  id: string;
  name: string;
  status: LoreEntry['status'];
}

export interface RelatedEntry {
  id: string;
  name: string;
  headerText: string;
  sourceFile: string;
  lineNumber: number;
  headerLevel: number;
  status: LoreEntry['status'];
  parentNames: string[];
  content: string | null;
}

export interface EntryContext {
  parentChain: ParentCrumb[];
  fullContent: string | null;
  siblings: SiblingSummary[];
  related: RelatedEntry[];
}

// Dedupe types

export interface MergeGroup {
  memberIds: string[];
  primaryId: string;
}

export interface DedupeDecision {
  normalizedName: string;
  type: 'merge-all' | 'merge-subset' | 'all-distinct';
  mergeGroups: MergeGroup[];
  distinctMemberIds: string[];
  decidedAt: string;
  note?: string;
}

export interface DedupeDecisions {
  version: 1;
  decisions: DedupeDecision[];
}

export interface MergeGroupsFile {
  version: 1;
  generatedAt: string;
  groups: Array<{
    id: string;
    memberIds: string[];
    primaryId: string;
    normalizedName: string;
  }>;
}

export interface AuditMember {
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

export interface AuditGroup {
  normalizedName: string;
  displayName: string;
  size: number;
  verdict: 'auto-merge' | 'auto-distinct' | 'needs-review';
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  pinnedCount: number;
  members: AuditMember[];
}
