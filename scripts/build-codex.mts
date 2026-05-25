/**
 * Build step: content/codex/entities/*.md  ->  map + codex outputs.
 *
 * Replaces finalize-locations.ts. Entity files are canonical; this regenerates:
 *   - data/locations.json + public/locations.json   (Location[], entities with coordinates)
 *   - data/codex/compiled.json    (codex: flat byId index, server-read; no category tree)
 *   - public/codex-search.json    (lightweight client search index)
 *
 * relatedIds are derived by scanning each entity body for mentions of other entity names
 * (ancestor-disambiguated, ported from finalize-locations.ts) and unioned with authored
 * `relations` targets. weight/atmosphere are baked from entityType (+ capitalOf, + tags).
 *
 * Run: node scripts/build-codex.mts   (native ESM + Node type-stripping; no tsx)
 */
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import type { Location, LocationType } from '../src/types/location';
import type { CodexEntry, EntryWeight, AtmosphereType, EntityRef, InEdge, OutEdge, SearchEntry } from '../src/types/codex';

const REPO = path.resolve(import.meta.dirname, '..');
const ENTITIES = path.join(REPO, 'content/codex/entities');
const DATA = path.join(REPO, 'data');
const PUBLIC = path.join(REPO, 'public');

interface Relation { rel: string; kind: string; target: string; when?: string; note?: string }
interface Entity {
  id: string;
  name: string;
  entityType: string;
  parent: string | null;
  blurb: string;
  coordinates?: [number, number];
  zoomLevel?: number;
  tags: string[];
  aliases: string[];
  sources: string[];
  relations: Relation[];
  weight?: EntryWeight;
  atmosphere?: AtmosphereType;
  body: string;
}

// ---- load + parse entity files ----
const entities: Entity[] = [];
for (const file of fs.readdirSync(ENTITIES)) {
  if (!file.endsWith('.md')) continue;
  const parsed = matter(fs.readFileSync(path.join(ENTITIES, file), 'utf8'));
  const d = parsed.data as Record<string, unknown>;
  entities.push({
    id: String(d.id),
    name: String(d.name ?? ''),
    entityType: String(d.entityType ?? 'uncategorized'),
    parent: null, // retired as a frontmatter field; set below from the `within` containment edge
    blurb: String(d.blurb ?? ''),
    coordinates: Array.isArray(d.coordinates) ? (d.coordinates as [number, number]) : undefined,
    zoomLevel: typeof d.zoomLevel === 'number' ? d.zoomLevel : undefined,
    tags: Array.isArray(d.tags) ? (d.tags as string[]) : [],
    aliases: Array.isArray(d.aliases) ? (d.aliases as string[]) : [],
    sources: Array.isArray(d.sources) ? (d.sources as string[]) : [],
    relations: Array.isArray(d.relations) ? (d.relations as Relation[]) : [],
    weight: d.weight as EntryWeight | undefined,
    atmosphere: d.atmosphere as AtmosphereType | undefined,
    body: parsed.content.trim(),
  });
}
const byId = new Map(entities.map((e) => [e.id, e]));

// Containment is the `spatial/within` edge (the old `parent` frontmatter field is retired).
// Resolve each entity's container from its within-edge and assign it to `parent`, so all the
// downstream ancestry/children/partOf logic below works unchanged — just sourced from the graph.
for (const e of entities) {
  const w = e.relations.find((r) => r.kind === 'within' && byId.has(r.target));
  e.parent = w ? w.target : null;
}
console.log(`Parsed ${entities.length} entity files`);

// ---- ancestry helpers ----
function rootAncestor(e: Entity): Entity {
  let cur = e;
  const seen = new Set<string>();
  while (cur.parent && byId.has(cur.parent) && !seen.has(cur.parent)) {
    seen.add(cur.parent);
    cur = byId.get(cur.parent)!;
  }
  return cur;
}
function ancestorsOf(id: string, maxDepth = 3): Set<string> {
  const out = new Set<string>();
  let cur = byId.get(id);
  let depth = 0;
  while (cur && cur.parent && depth < maxDepth) {
    out.add(cur.parent);
    cur = byId.get(cur.parent);
    depth++;
  }
  return out;
}
function shareAncestor(a: string, b: string): boolean {
  const aa = ancestorsOf(a), bb = ancestorsOf(b);
  if (aa.has(b) || bb.has(a)) return true;
  for (const x of aa) if (bb.has(x)) return true;
  return false;
}

// ---- relatedIds: mention-scan (ported from finalize) + authored relations ----
const nameToIds = new Map<string, string[]>();
for (const e of entities) {
  const n = e.name.toLowerCase();
  if (!nameToIds.has(n)) nameToIds.set(n, []);
  nameToIds.get(n)!.push(e.id);
}
const names = [...nameToIds.keys()].sort((a, b) => b.length - a.length);
const skipNames = new Set(['the', 'and', 'for', 'but', 'bay', 'sea', 'lake', 'hill', 'port', 'fort', 'east', 'west', 'north', 'south', 'old', 'new', 'great', 'little', 'upper', 'lower']);
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const related = new Map<string, Set<string>>(entities.map((e) => [e.id, new Set<string>()]));
for (const e of entities) {
  // authored typed edges always count
  for (const r of e.relations) if (byId.has(r.target)) related.get(e.id)!.add(r.target);
  if (!e.body) continue;
  for (const name of names) {
    if (name.length < 4 || skipNames.has(name)) continue;
    if (!new RegExp(`\\b${esc(name)}\\b`, 'i').test(e.body)) continue;
    const others = nameToIds.get(name)!.filter((id) => id !== e.id);
    if (others.length === 0) continue;
    if (others.length === 1) { related.get(e.id)!.add(others[0]); continue; }
    const shared = others.filter((id) => shareAncestor(e.id, id));
    if (shared.length === 1) related.get(e.id)!.add(shared[0]);
    else {
      const direct = shared.find((id) => byId.get(id)?.parent === e.id || e.parent === id);
      if (direct) related.get(e.id)!.add(direct);
      // else: ambiguous cross-region mention — skip (matches finalize's manual-review path)
    }
  }
}

// ---- containment children + reverse (incoming) typed edges ----
const childrenOf = new Map<string, Entity[]>();
for (const e of entities) {
  if (e.parent && byId.has(e.parent)) {
    if (!childrenOf.has(e.parent)) childrenOf.set(e.parent, []);
    childrenOf.get(e.parent)!.push(e);
  }
}
const incomingOf = new Map<string, InEdge[]>();
for (const e of entities) {
  for (const r of e.relations) {
    if (r.kind === 'within') continue; // containment renders as contains/partOf, not a generic edge
    if (!byId.has(r.target)) continue;
    if (!incomingOf.has(r.target)) incomingOf.set(r.target, []);
    incomingOf.get(r.target)!.push({ rel: r.rel, kind: r.kind, source: e.id, sourceName: e.name, when: r.when, note: r.note });
  }
}
const refOf = (id: string): EntityRef | null => {
  const t = byId.get(id);
  return t ? { id: t.id, name: t.name } : null;
};

// ---- weight / atmosphere mapping (entityType-driven; authored value wins) ----
const WEIGHT_BY_TYPE: Record<string, EntryWeight> = {
  deity: 'legendary', plane: 'legendary',
  region: 'major', nation: 'major', faction: 'major',
  city: 'standard', water: 'standard', wilderness: 'standard', fortress: 'standard', event: 'standard', era: 'standard',
  town: 'minor', poi: 'minor', ruins: 'minor', creature: 'minor', artifact: 'minor', person: 'minor',
};
function computeWeight(e: Entity): EntryWeight {
  if (e.weight) return e.weight;
  if (e.relations.some((r) => r.kind === 'capitalOf')) return 'major';
  const base = WEIGHT_BY_TYPE[e.entityType] ?? 'standard';
  const lines = e.body ? e.body.split('\n').filter((l) => l.trim()).length : 0;
  if ((base === 'standard' || base === 'minor') && lines < 4) return 'footnote';
  return base;
}

const TAG_ATMOSPHERE: Record<string, AtmosphereType> = {
  cursed: 'cursed', daemon: 'cursed', undead: 'cursed', necromancy: 'cursed',
  god: 'sacred', temple: 'sacred', divine: 'sacred', holy: 'sacred', shrine: 'sacred',
  dragon: 'dangerous', war: 'dangerous', battle: 'dangerous', monster: 'dangerous', dungeon: 'dangerous',
  ancient: 'ancient', ruins: 'ancient', archaeological: 'ancient', historical: 'ancient',
  capital: 'civilization', city: 'civilization', state: 'civilization', kingdom: 'civilization', empire: 'civilization', nation: 'civilization',
  trade: 'trade', merchant: 'trade', market: 'trade', commerce: 'trade',
  nature: 'nature', wilderness: 'nature', forest: 'nature', jungle: 'nature', mountain: 'nature',
  water: 'water', ocean: 'water', sea: 'water', river: 'water', coastal: 'water',
};
const ATM_PRIORITY: AtmosphereType[] = ['cursed', 'sacred', 'dangerous', 'ancient', 'civilization', 'trade', 'nature', 'water', 'default'];
const ATM_BY_TYPE: Record<string, AtmosphereType> = {
  water: 'water', wilderness: 'nature', ruins: 'ancient', deity: 'sacred', plane: 'sacred',
  creature: 'dangerous', region: 'civilization', nation: 'civilization', city: 'civilization',
  town: 'civilization', fortress: 'civilization', faction: 'civilization', poi: 'civilization',
};
function computeAtmosphere(e: Entity): AtmosphereType {
  if (e.atmosphere) return e.atmosphere;
  const found = new Set<AtmosphereType>();
  for (const t of e.tags) { const a = TAG_ATMOSPHERE[t.toLowerCase()]; if (a) found.add(a); }
  for (const a of ATM_PRIORITY) if (found.has(a)) return a;
  return ATM_BY_TYPE[e.entityType] ?? 'default';
}

// ---- category mapping ----
const CATEGORY_BY_TYPE: Record<string, { name: string; slug: string }> = {
  region: { name: 'Geography & Places', slug: 'geography' },
  city: { name: 'Geography & Places', slug: 'geography' },
  town: { name: 'Geography & Places', slug: 'geography' },
  fortress: { name: 'Geography & Places', slug: 'geography' },
  ruins: { name: 'Geography & Places', slug: 'geography' },
  wilderness: { name: 'Geography & Places', slug: 'geography' },
  water: { name: 'Geography & Places', slug: 'geography' },
  poi: { name: 'Geography & Places', slug: 'geography' },
  uncategorized: { name: 'Geography & Places', slug: 'geography' },
  nation: { name: 'Geography & Places', slug: 'geography' },
  deity: { name: 'Deities & Religion', slug: 'deities' },
  plane: { name: 'Deities & Religion', slug: 'deities' },
  faction: { name: 'Factions & Organizations', slug: 'factions' },
  creature: { name: 'Creatures & Beings', slug: 'creatures' },
  artifact: { name: 'Artifacts & Relics', slug: 'artifacts' },
  event: { name: 'History & Events', slug: 'history' },
  era: { name: 'History & Events', slug: 'history' },
  person: { name: 'History & Events', slug: 'history' },
};
const loreFileOf = (e: Entity) => e.sources[0]?.replace(/^.*\//, '').replace(/#.*$/, '');

// ---- emit map locations.json ----
const locations: Location[] = entities
  .filter((e) => e.coordinates)
  .map((e) => ({
    id: e.id,
    name: e.name,
    type: e.entityType as LocationType,
    coordinates: e.coordinates!,
    zoomLevel: e.zoomLevel ?? 5,
    parentId: e.parent,
    relatedIds: [...related.get(e.id)!],
    ...(loreFileOf(e) ? { loreFile: loreFileOf(e) } : {}),
    tags: e.tags,
    ...(e.body ? { content: e.body } : {}),
  }))
  .sort((a, b) => (a.zoomLevel !== b.zoomLevel ? a.zoomLevel - b.zoomLevel : a.name.localeCompare(b.name)));

fs.writeFileSync(path.join(DATA, 'locations.json'), JSON.stringify(locations, null, 2));
fs.writeFileSync(path.join(PUBLIC, 'locations.json'), JSON.stringify(locations));

// ---- emit relationship edges for the map overlay ----
// Authored typed edges (borders / capitalOf / separatedBy) plus containment (within).
// Both endpoints must have a pin to draw a line; undirected kinds dedupe on the
// unordered pair so a bidirectional relation renders as a single line. The map joins
// `source`/`target` to pin coordinates by id, so we ship ids + kind + optional note only.
const pinnedIds = new Set(locations.map((l) => l.id));
const UNDIRECTED_KINDS = new Set(['borders', 'separatedBy']);
const edgeMap = new Map<string, { source: string; target: string; kind: string; note?: string }>();
for (const e of entities) {
  if (!pinnedIds.has(e.id)) continue;
  for (const r of e.relations) {
    if (r.target === e.id || !pinnedIds.has(r.target)) continue;
    const pair = UNDIRECTED_KINDS.has(r.kind)
      ? [e.id, r.target].sort().join('~')
      : `${e.id}~${r.target}`;
    const key = `${r.kind}:${pair}`;
    if (edgeMap.has(key)) continue;
    edgeMap.set(key, { source: e.id, target: r.target, kind: r.kind, ...(r.note ? { note: r.note } : {}) });
  }
}
const mapEdges = [...edgeMap.values()];
fs.writeFileSync(path.join(PUBLIC, 'codex-edges.json'), JSON.stringify(mapEdges));

// ---- emit codex compiled JSON ----
const codexEntries: CodexEntry[] = entities.map((e) => {
  const cat = CATEGORY_BY_TYPE[e.entityType] ?? { name: 'Geography & Places', slug: 'geography' };
  const root = rootAncestor(e);

  // graph navigation: part-of, contains, typed out/in edges, and leftover see-also links
  const partOf = e.parent ? refOf(e.parent) : null;
  const contains = (childrenOf.get(e.id) ?? [])
    .map((c) => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const relations: OutEdge[] = e.relations
    .filter((r) => byId.has(r.target) && r.kind !== 'within') // within = containment, shown as partOf
    .map((r) => ({ rel: r.rel, kind: r.kind, target: r.target, targetName: byId.get(r.target)!.name, when: r.when, note: r.note }));
  const incoming = incomingOf.get(e.id) ?? [];
  const covered = new Set<string>([
    ...(e.parent ? [e.parent] : []),
    ...contains.map((c) => c.id),
    ...relations.map((r) => r.target),
    ...incoming.map((r) => r.source),
  ]);
  const seeAlso = [...related.get(e.id)!]
    .filter((id) => !covered.has(id))
    .map(refOf)
    .filter((r): r is EntityRef => Boolean(r));

  return {
    id: e.id,
    name: e.name,
    category: cat.slug,
    section: cat.slug === 'geography' ? root.name : cat.name,
    tags: e.tags,
    content: e.body,
    sourceFile: loreFileOf(e) ?? '',
    sourceHeader: e.name,
    relatedIds: [...related.get(e.id)!],
    ...(e.coordinates ? { mapLocationId: e.id, coordinates: e.coordinates, zoomLevel: e.zoomLevel } : {}),
    ...(e.parent ? { parentLocationId: e.parent } : {}),
    entityType: e.entityType,
    blurb: e.blurb,
    weight: computeWeight(e),
    atmosphere: computeAtmosphere(e),
    partOf,
    contains,
    relations,
    incoming,
    seeAlso,
  };
});

// The codex travels by relation, not by a category tree — emit a flat byId index only.
const byIdOut: Record<string, CodexEntry> = {};
for (const ce of codexEntries) byIdOut[ce.id] = ce;
const compiled = { byId: byIdOut };

fs.mkdirSync(path.join(DATA, 'codex'), { recursive: true });
fs.writeFileSync(path.join(DATA, 'codex', 'compiled.json'), JSON.stringify(compiled, null, 2));

// Lightweight client search index (the full byId blob is too large to ship).
const searchIndex: SearchEntry[] = codexEntries
  .map((ce) => ({
    id: ce.id,
    name: ce.name,
    entityType: ce.entityType ?? 'uncategorized',
    blurb: ce.blurb ?? '',
    weight: ce.weight!,
    ...(byId.get(ce.id)!.aliases.length ? { aliases: byId.get(ce.id)!.aliases } : {}),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(path.join(PUBLIC, 'codex-search.json'), JSON.stringify(searchIndex));

// ---- report ----
const withRelated = locations.filter((l) => l.relatedIds.length > 0).length;
const totalRelated = locations.reduce((s, l) => s + l.relatedIds.length, 0);
console.log(`\nlocations.json: ${locations.length} (with related: ${withRelated}, total links: ${totalRelated})`);
const containEdges = codexEntries.reduce((s, ce) => s + (ce.contains?.length ?? 0), 0);
const typedEdges = codexEntries.reduce((s, ce) => s + (ce.relations?.length ?? 0), 0);
console.log(`codex: ${codexEntries.length} entries (${containEdges} containment edges, ${typedEdges} typed edges)`);
const wc = new Map<string, number>();
for (const ce of codexEntries) wc.set(ce.weight!, (wc.get(ce.weight!) ?? 0) + 1);
console.log('weights:', Object.fromEntries(wc));
console.log(`search index: ${searchIndex.length} entries`);
const edgeKindCounts = mapEdges.reduce<Record<string, number>>((m, e) => ((m[e.kind] = (m[e.kind] ?? 0) + 1), m), {});
console.log(`map edges: ${mapEdges.length}`, edgeKindCounts);
console.log('Outputs: data/locations.json, public/locations.json, data/codex/compiled.json, public/codex-search.json, public/codex-edges.json');
