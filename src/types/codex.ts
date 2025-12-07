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

export interface CodexEntry {
  id: string;
  name: string;
  category: string;
  section: string;
  tags: string[];
  content: string;
  sourceFile: string;
  sourceHeader: string;
  relatedIds?: string[];
  mapLocationId?: string;
  parentLocationId?: string;
  weight?: EntryWeight;
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
