export type EntryWeight = 'legendary' | 'major' | 'standard' | 'minor' | 'footnote';

export type AtmosphereType =
  | 'civilization'
  | 'sacred'
  | 'cursed'
  | 'ancient'
  | 'dangerous'
  | 'trade'
  | 'nature'
  | 'water'
  | 'default';

/** A resolved pointer to another entity, for graph navigation. */
export interface EntityRef {
  id: string;
  name: string;
}

/** An authored typed edge leaving this entity (e.g. polity/capitalOf -> nation). */
export interface OutEdge {
  rel: string;
  kind: string;
  target: string;
  targetName: string;
  when?: string;
  note?: string;
}

/** The reverse of an OutEdge: another entity points a typed edge AT this one. */
export interface InEdge {
  rel: string;
  kind: string;
  source: string;
  sourceName: string;
  when?: string;
  note?: string;
}

export interface CodexEntry {
  id: string;
  name: string;
  category: string;
  section: string;
  tags: string[];
  content: string;
  /** TTRPG rules text, shown behind a toggle (off by default). */
  mechanics?: string;
  sourceFile: string;
  sourceHeader: string;
  relatedIds?: string[];
  mapLocationId?: string;
  parentLocationId?: string;
  weight?: EntryWeight;
  // New entity model (baked by scripts/build-codex.mts from content/codex/entities/)
  entityType?: string;
  blurb?: string;
  /** Card-preview image URL: the frontmatter `banner:`, else the first body image (resolved by build). */
  banner?: string;
  /** Admin override: CSS object-position for the hero banner crop, e.g. "50% 25%". */
  bannerPosition?: string;
  /** Admin override: hero banner min-height in px (else weight-derived default). */
  bannerHeight?: number;
  atmosphere?: AtmosphereType;
  coordinates?: [number, number];
  zoomLevel?: number;
  // Graph navigation (the codex travels by relation, not by category tree)
  partOf?: EntityRef | null;   // containment parent ("part of X")
  contains?: EntityRef[];      // direct children ("contains …")
  relations?: OutEdge[];       // authored typed edges leaving this entity
  incoming?: InEdge[];         // authored typed edges pointing at this entity
  seeAlso?: EntityRef[];       // mention-scan links not already covered above
  derivedInhabitants?: string[]; // race entity ids, computed by build (authored + inheritance)
}

/** Lightweight record shipped to the client for codex search (public/codex-search.json). */
export interface SearchEntry {
  id: string;
  name: string;
  entityType: string;
  category: string; // top-level taxonomy slug (geography, races, deities, cosmology…)
  blurb: string;
  /** Card-preview image URL (banner frontmatter, else first body image) — for landing/search cards. */
  banner?: string;
  weight: EntryWeight;
  aliases?: string[];
  derivedInhabitantNames?: string[]; // resolved race names for search (from derivedInhabitants)
}

export interface AtmosphereStyle {
  tint: string;
}

export interface Section {
  name: string;
  slug: string;
  entries: CodexEntry[];
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
  sections: Section[];
}
