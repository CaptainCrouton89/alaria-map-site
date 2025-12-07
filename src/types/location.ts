export type LocationType =
  | 'region'
  | 'city'
  | 'town'
  | 'fortress'
  | 'ruins'
  | 'wilderness'
  | 'water'
  | 'poi';

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
}

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
};
