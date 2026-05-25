export type LocationType =
  | 'region'
  | 'city'
  | 'town'
  | 'fortress'
  | 'ruins'
  | 'wilderness'
  | 'water'
  | 'poi'
  | 'uncategorized';

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  coordinates: [number, number]; // [x, y] in pixel coordinates
  zoomLevel: number; // 1-5, when this location appears
  parentId: string | null;
  relatedIds: string[];
  loreFile?: string;
  tags?: string[];
  content?: string; // raw markdown body, baked in by finalize-locations
}

// Authored relationship edges between pins, emitted to public/codex-edges.json.
export type EdgeKind = 'within' | 'borders' | 'capitalOf' | 'separatedBy';

export interface MapEdge {
  source: string; // entity id
  target: string; // entity id
  kind: EdgeKind;
  note?: string;
}

// Per-kind line styling + label for the relationship overlay.
export const EDGE_KINDS: Record<EdgeKind, { label: string; color: string; defaultOn: boolean }> = {
  borders: { label: 'Borders', color: '#e0883b', defaultOn: true },
  capitalOf: { label: 'Capital of', color: '#c9a227', defaultOn: true },
  separatedBy: { label: 'Separated by', color: '#14b8a6', defaultOn: true },
  within: { label: 'Within (containment)', color: '#5a8fd6', defaultOn: false },
};

export interface MapConfig {
  imageWidth: number;
  imageHeight: number;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
}

// Muted jewel tones matching parchment theme
// These should align with --loc-* CSS variables in globals.css
export const LOCATION_COLORS: Record<LocationType, string> = {
  region: '#b8956b',    // warm tan
  city: '#c9a227',      // gold
  town: '#a68a64',      // muted tan
  fortress: '#6c6c6c',  // stone grey
  ruins: '#7a7a7a',     // faded grey
  wilderness: '#4a7c59', // forest green
  water: '#4a8c9c',     // ocean blue
  poi: '#5a7a8c',       // slate blue
  uncategorized: '#9a8f7a', // neutral taupe — placed but not yet typed
};
