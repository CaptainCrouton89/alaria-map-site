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
import { MENTION_SCAN_SKIP_NAMES } from './mention-scan-skipnames.mts';

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
  /** Explicit category slug — only authored on `overview` root pages, which span many types. */
  category?: string;
  /** Banner image URL from frontmatter (the page header + card preview). */
  banner?: string;
  /** Admin overrides for the hero banner crop/size (authored via the in-page banner editor). */
  bannerPosition?: string;
  bannerHeight?: number;
  /** Four-way taxonomy axis: race | culture | template | creature. */
  entityCategory?: string;
  /** Non-reserved frontmatter keys (population, ruler, founded…) — shown as sidebar facts. */
  metadata?: Record<string, unknown>;
  body: string;
  /** TTRPG rules text split off from the lore body at the `<!-- mechanics -->` sentinel. */
  mechanics?: string;
}

const MECH_SENTINEL = '<!-- mechanics -->';
/** Split a body on the mechanics sentinel into lore `body` + optional `mechanics`. */
function splitMechanics(content: string): { body: string; mechanics?: string } {
  const i = content.indexOf(MECH_SENTINEL);
  if (i < 0) return { body: content };
  const body = content.slice(0, i).trim();
  const mechanics = content.slice(i + MECH_SENTINEL.length).trim();
  return mechanics ? { body, mechanics } : { body };
}

const AUTHOR_SENTINEL = '<!-- author-notes -->';
/**
 * Strip a private author-notes block (the sentinel to end-of-file) so it NEVER reaches the
 * map/codex outputs. These are authoring reminders — constraints to bear in mind when working a
 * subject — not player-facing lore. Must be the final block in the file (after any mechanics).
 */
function stripAuthorNotes(content: string): string {
  const i = content.indexOf(AUTHOR_SENTINEL);
  return i < 0 ? content : content.slice(0, i).trim();
}

// Frontmatter keys with a dedicated home; everything else falls through to `metadata`.
const RESERVED_FM = new Set([
  'id', 'name', 'entityType', 'parent', 'blurb', 'coordinates', 'zoomLevel',
  'tags', 'aliases', 'sources', 'relations', 'weight', 'atmosphere', 'review', 'category', 'banner',
  'bannerPosition', 'bannerHeight', 'entityCategory',
]);

/** First image URL in a markdown body: `![alt](url)` or `<img src="url">`. Used as the
 *  card-preview fallback when an entity has no `banner:` frontmatter. */
function firstBodyImage(body: string): string | undefined {
  const md = body.match(/!\[[^\]]*\]\(\s*(\S+?)\s*(?:"[^"]*")?\)/);
  if (md) return md[1];
  const html = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  return html ? html[1] : undefined;
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
    category: typeof d.category === 'string' ? d.category : undefined,
    entityCategory: typeof d.entityCategory === 'string' ? d.entityCategory : undefined,
    banner: typeof d.banner === 'string' ? d.banner : undefined,
    bannerPosition: typeof d.bannerPosition === 'string' ? d.bannerPosition : undefined,
    bannerHeight: typeof d.bannerHeight === 'number' ? d.bannerHeight : undefined,
    metadata: Object.fromEntries(Object.entries(d).filter(([k]) => !RESERVED_FM.has(k))),
    ...splitMechanics(stripAuthorNotes(parsed.content.trim())),
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
// Single-word entity names that collide with everyday English — see scripts/mention-scan-skipnames.mts.
const skipNames = MENTION_SCAN_SKIP_NAMES;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Compile one `\bname\b` matcher per eligible name ONCE. Previously the mention-scan and the
// autolink pass each rebuilt this regex inside their entity×name inner loops — ~N² `new RegExp`
// (+ `esc`) calls, which the CPU profile showed was the build's dominant cost. The compiled
// matchers are non-global and stateless, so both passes can share them. A name absent from this
// map is one filtered by the length/skip guard below — callers treat a miss as "skip".
const nameMatcher = new Map<string, RegExp>();
for (const name of names) {
  if (name.length < 4 || skipNames.has(name)) continue;
  nameMatcher.set(name, new RegExp(`\\b${esc(name)}\\b`, 'i'));
}

// Token prefilter. `\bname\b` can only match a body if every `[a-z0-9_]` run in the name appears
// in the body as a token bounded the same way — so the name's longest such run ("anchor") is a
// sound NECESSARY condition for a match. We test the anchor against a Set of the body's tokens
// (O(1)) before paying for the regex, turning the entity×name scan from ~N² regex tests into ~N²
// cheap Set lookups with the regex run only on real candidates. Names with no `[a-z0-9_]` run at
// all (anchor null — pure punctuation/diacritics) get no entry and fall through to the full regex,
// preserving exact behavior for that pathological case.
const wordTokens = (s: string): Set<string> => new Set(s.toLowerCase().match(/[a-z0-9_]+/g) ?? []);
const nameAnchor = new Map<string, string>();
for (const name of nameMatcher.keys()) {
  let best = '';
  for (const run of name.match(/[a-z0-9_]+/g) ?? []) if (run.length > best.length) best = run;
  if (best) nameAnchor.set(name, best);
}

const related = new Map<string, Set<string>>(entities.map((e) => [e.id, new Set<string>()]));
for (const e of entities) {
  // authored typed edges always count
  for (const r of e.relations) if (byId.has(r.target)) related.get(e.id)!.add(r.target);
  if (!e.body) continue;
  const bodyTokens = wordTokens(e.body);
  for (const name of names) {
    const re = nameMatcher.get(name);
    if (!re) continue;
    const anchor = nameAnchor.get(name);
    if (anchor && !bodyTokens.has(anchor)) continue;
    if (!re.test(e.body)) continue;
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

// ---- autolink pass: rewrite body + mechanics to link the first mention of each entity ----
// Mirrors the mention-scan's eligibility (same names list, length guard, skipNames, ancestor
// disambiguation). Skips fenced code blocks, inline code, and existing markdown links/images so
// we never link inside opaque regions. "First reference" = each target id is linked at most once
// per body, at its earliest plain-text occurrence. Source markdown files are untouched; only the
// emitted `content` / `mechanics` fields get the [name](/codex/<id>) syntax baked in.

interface Seg { type: 'plain' | 'opaque'; text: string }

// Tokenize markdown: opaque runs are anything we must not rewrite into (fenced code, inline code,
// images, links). Everything between is plain text where auto-linking is safe.
const OPAQUE_RE = /(```[\s\S]*?```)|(`[^`\n]+`)|(!\[[^\]]*\]\([^)]*\))|(\[[^\]]+\]\([^)]*\))/g;
function tokenize(body: string): Seg[] {
  const segs: Seg[] = [];
  let i = 0;
  for (let m: RegExpExecArray | null; (m = OPAQUE_RE.exec(body)) !== null;) {
    if (m.index > i) segs.push({ type: 'plain', text: body.slice(i, m.index) });
    segs.push({ type: 'opaque', text: m[0] });
    i = m.index + m[0].length;
  }
  if (i < body.length) segs.push({ type: 'plain', text: body.slice(i) });
  return segs;
}

function autolinkBody(rawBody: string, ownId: string): string {
  if (!rawBody) return rawBody;
  const segs = tokenize(rawBody);
  const bodyTokens = wordTokens(rawBody);
  const usedTargets = new Set<string>();

  for (const name of names) {
    const re = nameMatcher.get(name);
    if (!re) continue;
    const anchor = nameAnchor.get(name);
    if (anchor && !bodyTokens.has(anchor)) continue;
    // Disambiguate to a single target id (same rules as the mention-scan above).
    const others = nameToIds.get(name)!.filter((id) => id !== ownId);
    if (others.length === 0) continue;
    let targetId: string | undefined;
    if (others.length === 1) {
      targetId = others[0];
    } else {
      const shared = others.filter((id) => shareAncestor(ownId, id));
      if (shared.length === 1) {
        targetId = shared[0];
      } else {
        const e = byId.get(ownId);
        const direct = shared.find((id) => byId.get(id)?.parent === ownId || e?.parent === id);
        if (direct) targetId = direct;
      }
    }
    if (!targetId || usedTargets.has(targetId)) continue;

    for (let si = 0; si < segs.length; si++) {
      const seg = segs[si];
      if (seg.type !== 'plain') continue;
      const m = seg.text.match(re);
      if (!m || m.index === undefined) continue;
      const idx = m.index;
      const matched = m[0];
      const before = seg.text.slice(0, idx);
      const after = seg.text.slice(idx + matched.length);
      const linked: Seg = { type: 'opaque', text: `[${matched}](/codex/${targetId})` };
      const replacement: Seg[] = [];
      if (before) replacement.push({ type: 'plain', text: before });
      replacement.push(linked);
      if (after) replacement.push({ type: 'plain', text: after });
      segs.splice(si, 1, ...replacement);
      usedTargets.add(targetId);
      break;
    }
  }

  return segs.map((s) => s.text).join('');
}

for (const e of entities) {
  if (e.body) e.body = autolinkBody(e.body, e.id);
  if (e.mechanics) e.mechanics = autolinkBody(e.mechanics, e.id);
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

// ---- subrace lookups (used by derivedInhabitants post-processing) ----
const parentRaceIds = new Set<string>();
const subraceParentOf = new Map<string, string>();
for (const e of entities) {
  for (const r of e.relations) {
    if (r.rel === 'culture' && r.kind === 'subraceOf' && byId.has(r.target)) {
      subraceParentOf.set(e.id, r.target);
      parentRaceIds.add(r.target);
    }
  }
}

// ---- derivedInhabitants: two-pass graph-traversal race inheritance ----
// Pass 1 (bottom-up): authored edges ∪ union from containment children. No parent lookup, so
//   Step 2 children can never re-enter a parent mid-computation (avoids false cycle warnings).
// Pass 2 (top-down): entities still empty after pass 1 inherit from their containment parent.

// Pass 1
const p1Memo = new Map<string, string[]>();
const p1InProgress = new Set<string>();

function computePass1(id: string): string[] {
  if (p1Memo.has(id)) return p1Memo.get(id)!;
  if (p1InProgress.has(id)) {
    console.error(`Warning: containment cycle detected at entity ${id} (derivedInhabitants pass 1)`);
    return [];
  }
  p1InProgress.add(id);

  const e = byId.get(id);
  if (!e) { p1InProgress.delete(id); p1Memo.set(id, []); return []; }

  // Step 1 — authored culture/inhabitedBy edges
  const authored = e.relations
    .filter((r) => r.rel === 'culture' && r.kind === 'inhabitedBy')
    .map((r) => r.target);

  // Step 2 — union from containment children (no parent lookup — that is pass 2)
  // Always run regardless of authored edges so containers bubble up their children's peoples.
  const union = new Set<string>(authored);
  for (const child of (childrenOf.get(id) ?? [])) {
    for (const raceId of computePass1(child.id)) union.add(raceId);
  }
  const result = [...union].sort();
  p1InProgress.delete(id);
  p1Memo.set(id, result);
  return result;
}

for (const e of entities) computePass1(e.id);

// Pass 2 — parent-down for entities still empty after pass 1
const p2Memo = new Map<string, string[]>();

function computePass2(id: string): string[] {
  if (p2Memo.has(id)) return p2Memo.get(id)!;

  const p1Result = p1Memo.get(id) ?? [];
  if (p1Result.length > 0) {
    p2Memo.set(id, p1Result);
    return p1Result;
  }

  const e = byId.get(id);
  if (!e || !e.parent) {
    p2Memo.set(id, []);
    return [];
  }

  // Provisional guard against containment cycles that pass 1 missed
  p2Memo.set(id, []);
  const parentResult = computePass2(e.parent);
  p2Memo.set(id, parentResult);
  return parentResult;
}

function postProcessInhabitants(list: string[]): string[] {
  // Race filter: keep only entities whose entityType is 'race' (drops creature-* etc.)
  let filtered = list.filter((id) => byId.get(id)?.entityType === 'race');
  // Parent-race suppression: when a subrace is present, drop its broad parent
  const presentParents = new Set(
    filtered.filter((id) => subraceParentOf.has(id)).map((id) => subraceParentOf.get(id)!)
  );
  filtered = filtered.filter((id) => !presentParents.has(id));
  return filtered.sort();
}

const derivedInhabitantsOf = new Map<string, string[]>();
for (const e of entities) derivedInhabitantsOf.set(e.id, postProcessInhabitants(computePass2(e.id)));

// ---- weight / atmosphere mapping (entityType-driven; authored value wins) ----
const WEIGHT_BY_TYPE: Record<string, EntryWeight> = {
  overview: 'legendary', deity: 'legendary', plane: 'legendary',
  region: 'major', nation: 'major', faction: 'major',
  city: 'standard', water: 'standard', wilderness: 'standard', fortress: 'standard', event: 'standard', era: 'standard',
  town: 'minor', poi: 'minor', ruins: 'minor', creature: 'minor', artifact: 'minor', person: 'minor',
  template: 'minor',
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
// Categories are the codex's top-level taxonomy: each has an `overview` root page
// (entityType: overview) that heads it on the landing page. `plane` and `person` split
// into their own categories (cosmology, personae) so every category has a 1:1 root page.
const CATEGORY_META: Record<string, { name: string; slug: string }> = {
  geography: { name: 'Geography & Places', slug: 'geography' },
  races: { name: 'Races & Peoples', slug: 'races' },
  creatures: { name: 'Creatures & Beings', slug: 'creatures' },
  factions: { name: 'Factions & Organizations', slug: 'factions' },
  magic: { name: 'Magic & Knowledge', slug: 'magic' },
  deities: { name: 'Deities & Religion', slug: 'deities' },
  cosmology: { name: 'Cosmology & the Planes', slug: 'cosmology' },
  history: { name: 'History & Events', slug: 'history' },
  personae: { name: 'Dramatis Personae', slug: 'personae' },
  artifacts: { name: 'Artifacts & Relics', slug: 'artifacts' },
};
const CATEGORY_BY_TYPE: Record<string, string> = {
  region: 'geography', city: 'geography', town: 'geography', fortress: 'geography',
  ruins: 'geography', wilderness: 'geography', water: 'geography', poi: 'geography',
  uncategorized: 'geography', nation: 'geography',
  deity: 'deities', daemon: 'deities',
  plane: 'cosmology',
  faction: 'factions',
  creature: 'creatures',
  race: 'races',
  template: 'races',
  magic: 'magic',
  artifact: 'artifacts',
  event: 'history', era: 'history',
  person: 'personae',
};
/** Resolve an entity's category. Overview root pages carry an explicit `category`; everything
 *  else maps from entityType. Falls back to geography for unknown types. */
function categoryOf(e: Entity): { name: string; slug: string } {
  if (e.entityType === 'overview' && e.category && CATEGORY_META[e.category]) return CATEGORY_META[e.category];
  return CATEGORY_META[CATEGORY_BY_TYPE[e.entityType] ?? 'geography'] ?? CATEGORY_META.geography;
}
const loreFileOf = (e: Entity) => e.sources[0]?.replace(/^.*\//, '').replace(/#.*$/, '');

const humanizeKey = (k: string) =>
  k.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
const formatMetaValue = (v: unknown): string =>
  typeof v === 'number' ? v.toLocaleString('en-US')
    : Array.isArray(v) ? v.map(formatMetaValue).join(', ')
      : String(v);

/** Sidebar blurb: the authored blurb verbatim, else the body's first real sentence + an ellipsis.
 *  Skips headings and placeholder paragraphs (TODO/WIP/stub) so we never surface scaffolding. */
const PLACEHOLDER_RE = /^(todo|tbd|wip|stub|n\/?a|xxx|placeholder|\.\.\.)\b/i;
function deriveBlurb(e: Entity): string {
  if (e.blurb.trim()) return e.blurb.trim();
  for (const raw of e.body.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || PLACEHOLDER_RE.test(line)) continue;
    const text = line.replace(/[*_`>#[\]]/g, '').trim();
    const m = text.match(/^(.*?[.!?])(\s|$)/);
    const sentence = (m ? m[1] : text).trim().replace(/[.!?]+$/, '');
    if (sentence.length >= 12 && /\s/.test(sentence)) return `${sentence}…`;
  }
  return '';
}

// ---- emit map locations.json ----
// Beyond the raw pin, each location carries the bits the map sidebar needs to render a
// summary (blurb + facts) without loading the multi-MB codex: a resolved blurb, atmosphere
// for the accent, parent/contains/borders relations, and a generic `meta` passthrough so
// future frontmatter (population, ruler…) surfaces as facts with no UI change.
const locations: Location[] = entities
  .filter((e) => e.coordinates)
  .map((e) => {
    const blurb = deriveBlurb(e);
    const parent = e.parent ? byId.get(e.parent) : undefined;
    const borders = e.relations
      .filter((r) => r.kind === 'borders' && byId.has(r.target))
      .map((r) => ({ id: r.target, name: byId.get(r.target)!.name }));
    const containsCount = childrenOf.get(e.id)?.length ?? 0;
    const meta = Object.entries(e.metadata ?? {}).map(([k, v]) => ({ label: humanizeKey(k), value: formatMetaValue(v) }));
    return {
      id: e.id,
      name: e.name,
      type: e.entityType as LocationType,
      coordinates: e.coordinates!,
      zoomLevel: e.zoomLevel ?? 5,
      parentId: e.parent,
      relatedIds: [...related.get(e.id)!],
      ...(loreFileOf(e) ? { loreFile: loreFileOf(e) } : {}),
      tags: e.tags,
      atmosphere: computeAtmosphere(e),
      ...(blurb ? { blurb } : {}),
      ...(parent ? { parentName: parent.name } : {}),
      ...(containsCount ? { containsCount } : {}),
      ...(borders.length ? { borders } : {}),
      ...(meta.length ? { meta } : {}),
    };
  })
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
  const cat = categoryOf(e);
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

  // Card-preview image: the frontmatter `banner:`, else the first image in the body.
  const banner = e.banner ?? firstBodyImage(e.body);

  return {
    id: e.id,
    name: e.name,
    category: cat.slug,
    section: cat.slug === 'geography' ? root.name : cat.name,
    tags: e.tags,
    content: e.body,
    ...(banner ? { banner } : {}),
    ...(e.bannerPosition ? { bannerPosition: e.bannerPosition } : {}),
    ...(typeof e.bannerHeight === 'number' ? { bannerHeight: e.bannerHeight } : {}),
    ...(e.mechanics ? { mechanics: e.mechanics } : {}),
    sourceFile: loreFileOf(e) ?? '',
    sourceHeader: e.name,
    relatedIds: [...related.get(e.id)!],
    ...(e.coordinates ? { mapLocationId: e.id, coordinates: e.coordinates, zoomLevel: e.zoomLevel } : {}),
    ...(e.parent ? { parentLocationId: e.parent } : {}),
    entityType: e.entityType,
    ...(e.entityCategory ? { entityCategory: e.entityCategory } : {}),
    blurb: e.blurb,
    weight: computeWeight(e),
    atmosphere: computeAtmosphere(e),
    partOf,
    contains,
    relations,
    incoming,
    seeAlso,
    derivedInhabitants: derivedInhabitantsOf.get(e.id)!,
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
  .map((ce) => {
    const derived = derivedInhabitantsOf.get(ce.id) ?? [];
    const derivedNames = derived.map((rid) => byId.get(rid)?.name).filter((n): n is string => Boolean(n));
    return {
      id: ce.id,
      name: ce.name,
      entityType: ce.entityType ?? 'uncategorized',
      category: ce.category,
      blurb: ce.blurb ?? '',
      ...(ce.banner ? { banner: ce.banner } : {}),
      weight: ce.weight!,
      tags: ce.tags,
      ...(ce.entityCategory ? { entityCategory: ce.entityCategory } : {}),
      ...(byId.get(ce.id)!.aliases.length ? { aliases: byId.get(ce.id)!.aliases } : {}),
      ...(derivedNames.length ? { derivedInhabitantNames: derivedNames } : {}),
    };
  })
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
