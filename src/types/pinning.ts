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
