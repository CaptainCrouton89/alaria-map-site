/**
 * codex — author and review the Alaria worldbuilding graph (content/codex/entities/*.md).
 * Agent-consumed CLI: flags-only input, JSON on stdout, structured errors, -h spec at every node.
 * Run with: node scripts/codex.mts <noun> <verb> [--flags]  (or the `alaria-codex` shim)
 * Native ESM + Node type-stripping — no tsx, no loader, no deprecation warnings.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import sharp from 'sharp';
import matter from 'gray-matter';
import { MENTION_SCAN_SKIP_NAMES } from './mention-scan-skipnames.mts';

const REPO = path.resolve(import.meta.dirname, '..');
const ENTITIES = path.join(REPO, 'content/codex/entities');
const TILES = 'https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/tiles';
const TILE = 256;
const CACHE = '/tmp/alaria-tiles';
// Map scale (fixed): coordinates are pin units on the zoom-0 pixel grid. The on-map hex grid measures
// 1.125 pin units across (zoom 4: 18px/16; zoom 5: 36px/32) and the legend cartouche reads "1 Hex = 5
// Miles", so 1.125 units = 1 hex = 5 miles => ~4.44 miles per pin unit. (Previously mis-set to 20
// units/hex => 0.25 mi/unit, ~18x too small, which made cross-continental gaps read as tens of miles.)
// Distances live entirely in this grid, so they are zoom-INDEPENDENT — tile zoom only changes render
// resolution, never the coordinate spacing. Never adjust a measured distance for zoom.
const PIXELS_PER_HEX = 1.125; // measured hex-grid pitch in pin units (zoom 4: 18px/16, zoom 5: 36px/32)
const MILES_PER_HEX = 5;       // map legend cartouche: "1 Hex = 5 Miles"
const MILES_PER_PIXEL = MILES_PER_HEX / PIXELS_PER_HEX; // ~4.44 mi per pin unit
const ARCHETYPES = ['stub', 'ai-ok', 'geo-wrong', 'inflated'];
const ACTIONS = ['keep', 'trim', 'rewrite', 'stub', 'fix-geo'];

// ---- arg parsing: command path = leading non-flag tokens; everything else is --flags ----
const argv = process.argv.slice(2);
let ci = 0; const cmd: string[] = [];
while (ci < argv.length && !argv[ci].startsWith('-')) { cmd.push(argv[ci]); ci++; }
const rest = argv.slice(ci);
const wantHelp = rest.includes('-h') || rest.includes('--help');
const flag = (n: string): string | undefined => { const j = rest.indexOf('--' + n); return j >= 0 ? rest[j + 1] : undefined; };
const has = (n: string): boolean => rest.includes('--' + n);
const flagsAll = (n: string): string[] => { const out: string[] = []; for (let j = 0; j < rest.length - 1; j++) if (rest[j] === '--' + n) out.push(rest[j + 1]); return out; };

const emit = (o: unknown) => process.stdout.write(JSON.stringify(o, null, 2) + '\n');
const fail = (error: string, message: string, extra: Record<string, unknown> = {}): never => { emit({ error, message, ...extra }); process.exit(1); };
const help = (s: string): never => { process.stdout.write(s.trim() + '\n'); process.exit(0); };
const req = (name: string): string => { const v = flag(name); if (v === undefined) fail('missing_flag', `--${name} is required`, { field: name, next: `Run \`codex ${cmd.join(' ')} -h\` for the full input schema.` }); return v as string; };

// ---- shared entity index ----
interface Loaded { file: string; data: Record<string, unknown>; body: string }
let _all: Loaded[] | null = null;
const all = (): Loaded[] => {
  if (_all) return _all;
  _all = [];
  for (const f of fs.readdirSync(ENTITIES)) {
    if (!f.endsWith('.md')) continue;
    const g = matter(fs.readFileSync(path.join(ENTITIES, f), 'utf8'));
    _all.push({ file: f, data: g.data as Record<string, unknown>, body: g.content.trim() });
  }
  return _all;
};
const byId = (): Map<string, Loaded> => new Map(all().map((e) => [String(e.data.id), e]));
const coordsOf = (d: Record<string, unknown>): [number, number] | undefined => (Array.isArray(d.coordinates) ? (d.coordinates as [number, number]) : undefined);
const withinTarget = (d: Record<string, unknown>): string | null => {
  const rels = Array.isArray(d.relations) ? (d.relations as { kind?: string; target?: string }[]) : [];
  const w = rels.find((r) => r.kind === 'within');
  return w && w.target !== undefined ? String(w.target) : null;
};
// Distance helpers — straight-line gap in miles via the fixed scale, plus a compass bearing.
const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const bearingDir = (from: [number, number], to: [number, number]): string => {
  const deg = (Math.atan2(to[0] - from[0], -(to[1] - from[1])) * 180) / Math.PI;
  return COMPASS[Math.round(((deg + 360) % 360) / 45) % 8];
};
const milesBetween = (a: [number, number], b: [number, number]): number => +(Math.hypot(a[0] - b[0], a[1] - b[1]) * MILES_PER_PIXEL).toFixed(1);

// ===================================================================== HELP TEXT
const ROOT_HELP = `
codex — author and review the Alaria worldbuilding graph (content/codex/entities/*.md).
Entity files are canonical; commands read them, mutate their frontmatter, or regenerate outputs.

I/O: parameters are --flags (long-form only). Results are JSON on stdout; diagnostics on stderr.
Errors are JSON {error, message, next}. -h on any node prints its spec.
Ids: every --id / --target / --source is the entity's numeric frontmatter id (e.g. "1789"), NEVER
the filename slug. Resolve a name to its id with: grep -rl "Name" content/codex/entities/, then read id.

Branches
  map      visual + spatial queries over coordinates    | use when you need what's near a place, or a map image
  edge     author/remove relationship edges             | use when recording containment, capitals, borders, etc.
  review   set an entity's review verdict block          | use when classifying a doc (stub/ai-ok/geo-wrong/inflated)
  entity   inspect one entity (frontmatter+body+derived) | use when you need a place's full current state
  report   aggregate stats and filtered lists            | use when triaging progress or finding flagged docs
  build    regenerate locations.json + codex outputs     | use after a batch of edits, to refresh derived data
`;
const MAP_HELP = `
codex map — read-only spatial queries over pin coordinates. No mutation.
Scale: ~4.44 miles per pin unit (map legend: 1 hex = 5 miles; the hex grid is 1.125 pin units across). Distances are reported in MILES and are zoom-independent — never
adjust for tile zoom.

Leaves
  shot   render a region image with labeled pins   | use when you must SEE terrain/coast/rivers around a place
  near   nearest pins by distance (miles) + bearing | use when you need exact adjacency to author within/borders
  dist   distance in miles between two places        | use BEFORE any claim about how far/near/reachable two places are
`;
const EDGE_HELP = `
codex edge — author or remove relationship edges in entity frontmatter (minimal-diff text edits).
Containment is the spatial/within edge (member -> container); capitals are polity/capitalOf.
Author one direction only (from the smaller entity); reverses are computed at build.

Leaves
  add   add an edge to one or more sources | use when recording a relationship you have verified
  rm    remove a matching edge             | use when correcting a wrong edge
`;
const REVIEW_HELP = `
codex review — write the review verdict block on an entity (frontmatter; ignored by the build).

Leaves
  set   set/replace the review block | use after judging a doc against the map and its neighbors
`;
const ENTITY_HELP = `
codex entity — inspect a single entity. Read-only.

Leaves
  show   full frontmatter + body + derived partOf/contains | use when you need a place's current state
`;
const REPORT_HELP = `
codex report — aggregates and filtered lists for triage. Read-only. Never enumerates in counts.

Leaves
  status   corpus-wide counts (review coverage, containment, weights) | use to gauge overall progress
  list     filtered, paginated entity list                            | use to pull a worklist (e.g. unclaimed in a region)
  lint     graph-validity checks: dangling targets, capitalOf non-polity, both-ends-authored, orphans | exits 1 on errors
`;

// ===================================================================== HANDLERS
async function mapShot() {
  if (wantHelp) help(`
codex map shot — render a square region of the map with entity pins overlaid; writes a PNG.

Input
  --id <id>        center on this entity (highlighted); mutually exclusive with --center
  --center <x,y>   explicit center in pin units; required when --id is absent
  --radius <u>     half-extent in pin units; default 30
  --zoom <z>       tile zoom 0..5; default auto (targets ~1400px across)
  --labels <mode>  all | capitals | none; default all. capitals = entityType:city (capitals and
                   city-states are always type city; regular settlements are type town). City dots
                   get label priority. Dot color = entityType: focus=red, region/nation=yellow,
                   city=orange, town=blue, fortress=purple, ruins=grey, wilderness=green,
                   water=light-blue, poi=white.
  --enhance <mode> saturate | none | borders; DEFAULT saturate. saturate boosts color so the map's
                   dark-red national border lines (color ~#7A492F), rivers, roads and capital stars
                   pop in context — on by default since this CLI is read by agents, not humans.
                   saturate also pops watercourses: rivers and ocean share one teal in the source art,
                   so they're told apart by shape (thin stroke vs large body), and the thin ones —
                   rivers plus shipping lanes — are recolored to deep cobalt #0a3cd2 and dilated 1px so
                   they stay legible when downscaled. Override color with env RIVER_POP="r,g,b", or set
                   RIVER_DEBUG=1 to visualize the water/ocean masks. Pass none for raw tiles. borders recolors just the
                   border hue to high-contrast cyan over a greyed map (border = saturated red,
                   distinct from the desaturated terrain).
  --out <path>     output PNG path; default /tmp/alaria-shot.png

Output (JSON)
  { out, width, height, zoom, center:[x,y], radius, pins } — pins = number of markers drawn

Effects
  Writes a PNG at --out. Caches fetched tiles under /tmp/alaria-tiles.
  Borders aren't always drawn; when present they are the authoritative membership signal — prefer them
  over place-name language or the letterspaced region labels. The harness downscales the PNG on display,
  so for reading borders use a tight radius (~6-10) and --enhance saturate.
`);
  const pins = all().map((e) => ({ id: String(e.data.id), name: typeof e.data.name === 'string' ? e.data.name : '', type: typeof e.data.entityType === 'string' ? e.data.entityType : '', c: coordsOf(e.data), z: typeof e.data.zoomLevel === 'number' ? (e.data.zoomLevel as number) : 5 })).filter((p) => p.c);
  const id = flag('id');
  let cx: number, cy: number, focusId: string | undefined;
  if (id !== undefined) {
    const p = pins.find((p) => p.id === id);
    if (!p) fail('not_found', `no entity with id ${id}`, { field: 'id', next: 'Verify the id with `codex entity show` or `codex map near`.' });
    [cx, cy] = p!.c as [number, number]; focusId = id;
  } else {
    const c = flag('center');
    if (c === undefined) fail('missing_flag', 'provide --id or --center x,y', { next: 'Pass --id <id> or --center <x,y>.' });
    const parts = (c as string).split(',').map(Number);
    if (parts.length !== 2 || parts.some(Number.isNaN)) fail('bad_value', '--center must be x,y integers', { field: 'center', received: c });
    [cx, cy] = parts as [number, number];
  }
  const radius = flag('radius') === undefined ? 30 : Number(flag('radius'));
  const labels = flag('labels') === undefined ? 'all' : (flag('labels') as string);
  const outPath = flag('out') === undefined ? '/tmp/alaria-shot.png' : (flag('out') as string);
  const zoom = flag('zoom') === undefined ? Math.max(2, Math.min(5, Math.round(Math.log2(1400 / (2 * radius))))) : Number(flag('zoom'));

  const scale = Math.pow(2, zoom);
  const minCol = Math.floor((cx! - radius) * scale / TILE), maxCol = Math.floor((cx! + radius) * scale / TILE);
  const minRow = Math.floor((cy! - radius) * scale / TILE), maxRow = Math.floor((cy! + radius) * scale / TILE);
  const originX = minCol * TILE, originY = minRow * TILE;
  const W = (maxCol - minCol + 1) * TILE, H = (maxRow - minRow + 1) * TILE;

  const tileLayers: sharp.OverlayOptions[] = [];
  for (let c = minCol; c <= maxCol; c++) for (let r = minRow; r <= maxRow; r++) {
    const local = path.join(CACHE, `${zoom}_${c}_${r}.webp`);
    let buf: Buffer | null = null;
    if (fs.existsSync(local)) buf = fs.readFileSync(local);
    else { const res = await fetch(`${TILES}/${zoom}/${c}/${r}.webp`); if (res.ok) { buf = Buffer.from(await res.arrayBuffer()); fs.mkdirSync(CACHE, { recursive: true }); fs.writeFileSync(local, buf); } }
    if (buf) tileLayers.push({ input: await sharp(buf).png().toBuffer(), left: (c - minCol) * TILE, top: (r - minRow) * TILE });
  }
  const overlayLayers: sharp.OverlayOptions[] = [];
  const inBox = pins.filter((p) => p.c![0] >= cx! - radius && p.c![0] <= cx! + radius && p.c![1] >= cy! - radius && p.c![1] <= cy! + radius);
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // one color per entityType so the legend is scannable at a glance
  const TYPE_FILL: Record<string, string> = {
    region: '#ffd60a', nation: '#ffd60a', // territory (yellow)
    city: '#ff9f0a',                       // capital / city-state (orange)
    town: '#0a84ff',                       // ordinary settlement (blue)
    fortress: '#af52de',                   // purple
    ruins: '#98989d',                      // grey
    wilderness: '#30d158',                 // green
    water: '#64d2ff',                      // light blue
    poi: '#ffffff',                        // white
  };
  const dotOf = (p: { id: string; name: string; type: string }) => ({ rad: p.id === focusId ? 11 : p.type === 'region' || p.type === 'nation' ? 8 : 7, fill: p.id === focusId ? '#ff2d55' : (TYPE_FILL[p.type] !== undefined ? TYPE_FILL[p.type] : '#0a84ff') });

  // greedy label placement: priority order, four candidate anchors, collide -> number into legend
  const FS = 20, CH = FS * 0.56, LH = 24;
  type Box = { x: number; y: number; w: number; h: number };
  const placedBoxes: Box[] = [];
  const overlap = (a: Box, b: Box) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const prio = (p: typeof inBox[number]) => (p.id === focusId ? 0 : p.type === 'region' || p.type === 'nation' ? 1 : p.type === 'city' ? 2 : 3 + p.z);
  const ordered = [...inBox].sort((a, b) => prio(a) - prio(b) || Math.hypot(a.c![0] - cx!, a.c![1] - cy!) - Math.hypot(b.c![0] - cx!, b.c![1] - cy!));
  const placed: { px: number; py: number; tx: number; ty: number; anchor: string; name: string; rad: number; fill: string }[] = [];
  const numbered: { px: number; py: number; n: number; id: string; name: string; rad: number; fill: string }[] = [];
  for (const p of ordered) {
    const px = p.c![0] * scale - originX, py = p.c![1] * scale - originY;
    const { rad, fill } = dotOf(p);
    const want = labels === 'all' || (labels === 'capitals' && p.type === 'city') || p.id === focusId;
    if (!want) continue;
    const w = Math.max(10, p.name.length * CH);
    const cands = [
      { bx: px + rad + 4, by: py - LH / 2, tx: px + rad + 4, ty: py + FS * 0.34, a: 'start' },
      { bx: px - rad - 4 - w, by: py - LH / 2, tx: px - rad - 4, ty: py + FS * 0.34, a: 'end' },
      { bx: px - w / 2, by: py - rad - 4 - LH, tx: px, ty: py - rad - 9, a: 'middle' },
      { bx: px - w / 2, by: py + rad + 4, tx: px, ty: py + rad + 4 + FS * 0.8, a: 'middle' },
    ];
    const hit = cands.find((c) => { const b = { x: c.bx, y: c.by, w, h: LH }; return b.x >= 0 && b.y >= 0 && b.x + b.w <= W && b.y + b.h <= H && !placedBoxes.some((o) => overlap(o, b)); });
    if (hit) { placedBoxes.push({ x: hit.bx, y: hit.by, w, h: LH }); placed.push({ px, py, tx: hit.tx, ty: hit.ty, anchor: hit.a, name: p.name, rad, fill }); }
    else numbered.push({ px, py, n: numbered.length + 1, id: p.id, name: p.name, rad, fill });
  }

  const dots = inBox.map((p) => { const px = p.c![0] * scale - originX, py = p.c![1] * scale - originY; const { rad, fill } = dotOf(p); return `<circle cx="${px}" cy="${py}" r="${rad}" fill="${fill}" stroke="#000" stroke-width="2.5"/>`; }).join('');
  const txt = (x: number, y: number, a: string, fs: number, s: string) => `<text x="${x}" y="${y}" text-anchor="${a}" font-family="sans-serif" font-weight="bold" font-size="${fs}" fill="#fff" stroke="#000" stroke-width="1.2" paint-order="stroke">${esc(s)}</text>`;
  const labelSvg = placed.map((l) => txt(l.tx, l.ty, l.anchor, FS, l.name)).join('');
  const badgeSvg = numbered.map((b) => `<circle cx="${b.px}" cy="${b.py}" r="${b.rad + 2}" fill="${b.fill}" stroke="#fff" stroke-width="1.5"/>${txt(b.px, b.py + 4.5, 'middle', 13, String(b.n))}`).join('');
  overlayLayers.push({ input: Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${dots}${labelSvg}${badgeSvg}</svg>`), left: 0, top: 0 });

  // legend panel for numbered (overlapping) pins
  const LW = numbered.length ? 420 : 0;
  if (LW) {
    const lh = Math.min(26, Math.floor((H - 50) / numbered.length));
    const lfs = Math.max(9, Math.floor(lh * 0.72));
    const rows = numbered.map((b, i) => `<text x="14" y="${44 + i * lh}" font-family="sans-serif" font-size="${lfs}" fill="#e8e8f0">${b.n}. ${esc(b.name)}</text>`).join('');
    const legend = `<svg width="${LW}" height="${H}" xmlns="http://www.w3.org/2000/svg"><rect width="${LW}" height="${H}" fill="#11111b"/><text x="14" y="24" font-family="sans-serif" font-weight="bold" font-size="16" fill="#9aa">overlapping pins (numbered on map):</text>${rows}</svg>`;
    overlayLayers.push({ input: Buffer.from(legend), left: W, top: 0 });
  }

  // Build the map (tiles), optionally enhance it for border legibility, then lay pins/labels on top.
  const enhance = flag('enhance') === undefined ? 'saturate' : (flag('enhance') as string);
  let mapBuf = await sharp({ create: { width: W, height: H, channels: 3, background: '#1a1a2e' } }).composite(tileLayers).png().toBuffer();
  if (enhance === 'saturate') {
    // Hue-dependent saturation boost. Green (the dominant lowland terrain) is left alone so it doesn't
    // blow out; yellows get a gentle lift; blues are pushed hardest (ocean/rivers must read). Then
    // apply global contrast. Anchors are [hue°, multiplier], piecewise-linearly interpolated.
    const { data: sd, info: si } = await sharp(mapBuf).raw().toBuffer({ resolveWithObject: true });
    const sch = si.channels;
    const ANCHORS: [number, number][] = [
      [0, 4.6],   // red (borders)
      [40, 2.2],  // yellow — gentler
      [60, 2.0],  // yellow/olive highlands
      [70, 1.0],  // green start (protected)
      [160, 1.0], // green end
      [172, 3.0],
      [190, 7.5], // cyan/blue (ocean, rivers) — strongest
      [255, 7.5], // blue
      [285, 4.6],
      [360, 4.6],
    ];
    const mulForHue = (h: number): number => {
      for (let k = 1; k < ANCHORS.length; k++) {
        if (h <= ANCHORS[k][0]) {
          const [h0, m0] = ANCHORS[k - 1], [h1, m1] = ANCHORS[k];
          return m0 + ((m1 - m0) * (h - h0)) / (h1 - h0);
        }
      }
      return 4.6;
    };
    // Watercourse mask, captured from the RAW tiles inside the boost loop. On the source art every
    // water pixel (river, lake, ocean) is a cool teal — blue clearly above red — while the gold/olive
    // land has blue below red. That cool-tint test catches even the faint, half-anti-aliased river
    // strokes that a post-saturate cyan test misses (and that the green-protecting boost would mangle).
    const water = new Uint8Array(si.width * si.height);
    for (let i = 0; i < sd.length; i += sch) {
      const r = sd[i], g = sd[i + 1], b = sd[i + 2];
      if (b - r >= 8 && g - r >= 0) water[i / sch] = 1;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
      if (d === 0) continue; // greyscale pixel, no hue to boost
      const v = mx / 255, s = d / mx;
      let hue = 0;
      if (mx === r) hue = ((g - b) / d) % 6;
      else if (mx === g) hue = (b - r) / d + 2;
      else hue = (r - g) / d + 4;
      hue *= 60; if (hue < 0) hue += 360;
      const mul = mulForHue(hue);
      const ns = Math.min(1, s * mul);
      // HSV -> RGB with same hue/value, new saturation
      const c = v * ns, hp = hue / 60, x = c * (1 - Math.abs((hp % 2) - 1)), m = v - c;
      let rr = 0, gg = 0, bb = 0;
      if (hp < 1) { rr = c; gg = x; } else if (hp < 2) { rr = x; gg = c; }
      else if (hp < 3) { gg = c; bb = x; } else if (hp < 4) { gg = x; bb = c; }
      else if (hp < 5) { rr = x; bb = c; } else { rr = c; bb = x; }
      sd[i] = Math.round((rr + m) * 255); sd[i + 1] = Math.round((gg + m) * 255); sd[i + 2] = Math.round((bb + m) * 255);
    }
    mapBuf = await sharp(sd, { raw: { width: si.width, height: si.height, channels: sch } }).linear(1.7, -58).png().toBuffer();
    // River pop pass. Rivers and the ocean are drawn in the *same* desaturated teal in the source art
    // (hue ~175-190), so the saturate loop blows both up to identical cyan — hue can't separate them.
    // What separates them is shape: rivers (and shipping lanes) are thin strokes; the ocean is a mass.
    // So: build a broad water mask, erode it to isolate large water bodies, subtract that to leave the
    // thin watercourses, then recolor those to deep cobalt and dilate 1px so they survive downscaling.
    // RIVER_POP="r,g,b" overrides the color.
    {
      const popHex = process.env.RIVER_POP ? process.env.RIVER_POP.split(',').map(Number) : [10, 60, 210]; // deep cobalt #0a3cd2
      const { data: fd, info: fi } = await sharp(mapBuf).raw().toBuffer({ resolveWithObject: true });
      const fch = fi.channels, fw = fi.width, fh = fi.height, N = fw * fh;
      // separable Chebyshev morphology (min=erode, max=dilate) over a (2R+1)² box
      const morph = (src: Uint8Array, R: number, max: boolean): Uint8Array => {
        const pick = max ? (a: number, b: number) => a | b : (a: number, b: number) => a & b;
        const tmp = new Uint8Array(N), dst = new Uint8Array(N);
        for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) { let v = max ? 0 : 1; for (let dx = -R; dx <= R; dx++) { const nx = x + dx; v = pick(v, nx < 0 || nx >= fw ? (max ? 0 : 1) : src[y * fw + nx]); } tmp[y * fw + x] = v; }
        for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) { let v = max ? 0 : 1; for (let dy = -R; dy <= R; dy++) { const ny = y + dy; v = pick(v, ny < 0 || ny >= fh ? (max ? 0 : 1) : tmp[ny * fw + x]); } dst[y * fw + x] = v; }
        return dst;
      };
      const ocean = morph(morph(water, 3, false), 6, true); // erode away thin strokes, regrow the bodies
      const rivers = new Uint8Array(N);
      for (let p = 0; p < N; p++) if (water[p] && !ocean[p]) rivers[p] = 1;
      const painted = morph(rivers, 1, true); // dilate 1px so thin strokes survive display downscaling
      if (process.env.RIVER_DEBUG) {
        for (let p = 0; p < N; p++) { const i = p * fch; if (ocean[p]) { fd[i] = 30; fd[i + 1] = 30; fd[i + 2] = 60; } else if (water[p]) { fd[i] = 255; fd[i + 1] = 0; fd[i + 2] = 255; } else { const gy = Math.round((fd[i] + fd[i + 1] + fd[i + 2]) / 3 * 0.4); fd[i] = gy; fd[i + 1] = gy; fd[i + 2] = gy; } }
      } else
      for (let p = 0; p < N; p++) if (painted[p]) { const i = p * fch; fd[i] = popHex[0]; fd[i + 1] = popHex[1]; fd[i + 2] = popHex[2]; }
      mapBuf = await sharp(fd, { raw: { width: fw, height: fh, channels: fch } }).png().toBuffer();
    }
  } else if (enhance === 'borders') {
    const { data, info } = await sharp(mapBuf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    for (let i = 0; i < data.length; i += ch) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const v = mx / 255, s = mx === 0 ? 0 : (mx - mn) / mx;
      let hue = 0;
      if (mx !== mn) {
        if (mx === r) hue = ((g - b) / (mx - mn)) % 6;
        else if (mx === g) hue = (b - r) / (mx - mn) + 2;
        else hue = (r - g) / (mx - mn) + 4;
        hue *= 60; if (hue < 0) hue += 360;
      }
      const isBorder = (hue < 22 || hue > 345) && s > 0.42 && v > 0.30 && v < 0.78;
      if (isBorder) { data[i] = 0; data[i + 1] = 229; data[i + 2] = 255; }
      else { const grey = Math.round((r + g + b) / 3 / 2 + 96); data[i] = grey; data[i + 1] = grey; data[i + 2] = grey; }
    }
    mapBuf = await sharp(data, { raw: { width: info.width, height: info.height, channels: ch } }).png().toBuffer();
  }
  await sharp({ create: { width: W + LW, height: H, channels: 3, background: '#1a1a2e' } })
    .composite([{ input: mapBuf, left: 0, top: 0 }, ...overlayLayers]).png().toFile(outPath);
  emit({ out: outPath, width: W + LW, height: H, zoom, center: [cx!, cy!], radius, pins: inBox.length, labeled: placed.length, numbered: numbered.length, legend: numbered.map((b) => ({ n: b.n, id: b.id, name: b.name })) });
}

function mapNear() {
  if (wantHelp) help(`
codex map near — nearest pins to an entity, by coordinate distance. Read-only.
Image space: +x=east, +y=south; north is -y. Distances are in MILES (~4.44 mi per pin unit; 1 hex = 5 miles) and are
zoom-independent.

Input
  --id <id>      the entity to query from; required
  --radius <mi>  return all pins within this many MILES (overrides --limit)
  --limit <k>    return the k nearest; default 15

Output (JSON)
  { self:{id,name,type,coordinates,zoomLevel}, neighbors:[{id,name,type,miles,dir,zoomLevel}] }
  neighbors sorted by miles ascending; dir is one of N NE E SE S SW W NW.
  For an exact A->B measurement (and one-to-many) use \`codex map dist\`.
`);
  const id = req('id');
  const self = byId().get(id);
  if (!self) fail('not_found', `no entity with id ${id}`, { field: 'id', next: 'List candidates with `codex report list`.' });
  const sc = coordsOf(self!.data);
  if (!sc) fail('no_coordinates', `entity ${id} has no coordinates`, { field: 'id' });
  let near = all().map((e) => ({ e, c: coordsOf(e.data) })).filter((x) => x.c && String(x.e.data.id) !== id).map(({ e, c }) => {
    return { id: String(e.data.id), name: e.data.name, type: e.data.entityType, miles: milesBetween(sc!, c!), dir: bearingDir(sc!, c!), zoomLevel: e.data.zoomLevel };
  }).sort((a, b) => a.miles - b.miles);
  const radius = flag('radius');
  if (radius !== undefined) near = near.filter((p) => p.miles <= Number(radius));
  else { const k = flag('limit') === undefined ? 15 : Number(flag('limit')); near = near.slice(0, k); }
  emit({ self: { id, name: self!.data.name, type: self!.data.entityType, coordinates: sc, zoomLevel: self!.data.zoomLevel }, neighbors: near });
}

function mapDist() {
  if (wantHelp) help(`
codex map dist — straight-line distance between two places, in MILES. Read-only.

Distance is computed on the canonical zoom-0 pixel grid the coordinates live on, so it is
zoom-INDEPENDENT — tile zoom changes only render resolution, never the spacing. Never adjust for zoom.
Map scale is fixed at ~4.44 miles per pin unit (1 hex = 5 miles; the hex grid is 1.125 pin units across). The result is a flat straight-line gap that ignores
terrain, water, and roads — treat it as a lower bound on real travel distance, not a road/sail distance.

Input
  --from <id>         origin entity id (numeric frontmatter id)
  --from-coord <x,y>  origin as raw pin coordinates; use instead of --from
  --to <id>           destination entity id; repeatable (--to A --to B) for one-to-many
  --to-coord <x,y>    destination as raw pin coordinates; repeatable; combines with --to
  Provide exactly one origin and at least one destination.

Output (JSON)
  { from:{id?,name?,coordinates}, results:[{id?,name?,coordinates,miles,dir}] }
  results sorted by distance ascending. dir is the compass bearing origin->target
  (N NE E SE S SW W NW; image space +x=east, +y=south).
`);
  const idx = byId();
  const parseCoord = (s: string, field: string): [number, number] => {
    const parts = s.split(',').map(Number);
    if (parts.length !== 2 || parts.some(Number.isNaN)) fail('bad_value', `--${field} must be x,y numbers`, { field, received: s });
    return parts as [number, number];
  };
  const resolve = (rid: string, field: string): { id: string; name: string; coordinates: [number, number] } => {
    const e = idx.get(rid);
    if (!e) fail('not_found', `no entity with id ${rid}`, { field, received: rid, next: 'List candidates with `codex report list`, or read the id from the entity filename.' });
    const c = coordsOf(e!.data);
    if (!c) fail('no_coordinates', `entity ${rid} has no coordinates`, { field, received: rid });
    return { id: rid, name: e!.data.name as string, coordinates: c! };
  };
  const fromId = flag('from'), fromCoordRaw = flag('from-coord');
  let from: { id?: string; name?: string; coordinates: [number, number] };
  if (fromId !== undefined) from = resolve(fromId, 'from');
  else if (fromCoordRaw !== undefined) from = { coordinates: parseCoord(fromCoordRaw, 'from-coord') };
  else fail('missing_flag', 'provide --from <id> or --from-coord <x,y>', { field: 'from', next: 'Pass exactly one origin.' });
  const targets: { id?: string; name?: string; coordinates: [number, number] }[] = [];
  for (const tid of flagsAll('to')) targets.push(resolve(tid, 'to'));
  for (const tc of flagsAll('to-coord')) targets.push({ coordinates: parseCoord(tc, 'to-coord') });
  if (targets.length === 0) fail('missing_flag', 'provide at least one --to <id> or --to-coord <x,y>', { field: 'to', next: 'Pass one or more destinations.' });
  const fc = from!.coordinates;
  const results = targets.map((t) => ({ ...t, miles: milesBetween(fc, t.coordinates), dir: bearingDir(fc, t.coordinates) })).sort((a, b) => a.miles - b.miles);
  emit({ from: from!, results });
}

function edgeAdd() {
  if (wantHelp) help(`
codex edge add — add a relations edge to one or more source entities. Minimal-diff frontmatter edit.

Input
  --sources <ids>  comma-separated entity ids to add the edge TO; required
  --rel <family>   relation family: spatial|polity|economy|culture|origin|history|possession|cosmology; required
  --kind <kind>    edge kind within the family (e.g. within, borders, capitalOf); required
  --target <id>    the entity the edge points to; required, must exist
  --when <text>    optional time-bound qualifier
  --note <text>    optional nuance

Output (JSON)
  { applied:[{id,file}], skipped:[{id,reason}] }

Effects
  Edits frontmatter of each existing source file. Duplicates (same kind+target) are skipped, not duplicated.
  Containment is exclusive: adding a second within is refused (skipped as within-conflict); edge rm the old one first.
`);
  const sources = req('sources'), rel = req('rel'), kind = req('kind'), target = req('target');
  const index = byId();
  if (!index.has(target)) fail('not_found', `target id ${target} has no entity file`, { field: 'target' });
  const when = flag('when'), note = flag('note');
  let edge = `  - { rel: ${rel}, kind: ${kind}, target: "${target}"`;
  if (when !== undefined) edge += `, when: "${when}"`;
  if (note !== undefined) edge += `, note: "${note.replace(/"/g, '\\"')}"`;
  edge += ' }';
  const applied: { id: string; file: string }[] = [], skipped: { id: string; reason: string }[] = [];
  for (const id of sources.split(',').map((s) => s.trim()).filter(Boolean)) {
    const ent = index.get(id);
    if (!ent) { skipped.push({ id, reason: 'no entity file' }); continue; }
    const p = path.join(ENTITIES, ent.file);
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    const fmEnd = lines.indexOf('---', 1);
    if (lines[0] !== '---' || fmEnd < 0) { skipped.push({ id, reason: 'no frontmatter' }); continue; }
    if (lines.slice(1, fmEnd).some((l) => new RegExp(`kind:\\s*${kind}\\b`).test(l) && l.includes(`target: "${target}"`))) { skipped.push({ id, reason: 'duplicate' }); continue; }
    if (kind === 'within') {
      const conflict = lines.slice(1, fmEnd).find((l) => /kind:\s*within\b/.test(l) && !l.includes(`target: "${target}"`));
      if (conflict) { const m = conflict.match(/target:\s*"([^"]+)"/); skipped.push({ id, reason: `within-conflict: already within ${m ? m[1] : '?'} (containment is exclusive; edge rm the old one first)` }); continue; }
    }
    const relIdx = lines.slice(1, fmEnd).findIndex((l) => /^relations:/.test(l)) + 1;
    if (relIdx > 0) {
      if (/^relations:\s*\[\s*\]\s*$/.test(lines[relIdx])) { lines[relIdx] = 'relations:'; lines.splice(relIdx + 1, 0, edge); }
      else { let last = relIdx; while (last + 1 < fmEnd && /^\s+-/.test(lines[last + 1])) last++; lines.splice(last + 1, 0, edge); }
    } else lines.splice(fmEnd, 0, 'relations:', edge);
    fs.writeFileSync(p, lines.join('\n'));
    applied.push({ id, file: ent.file });
  }
  emit({ applied, skipped });
}

function edgeRm() {
  if (wantHelp) help(`
codex edge rm — remove edges matching kind+target from one or more sources.

Input
  --sources <ids>  comma-separated entity ids to edit; required
  --kind <kind>    edge kind to remove; required
  --target <id>    edge target to remove; required

Output (JSON)
  { removed:[{id,file}], missing:[{id,reason}] }

Effects
  Deletes matching edge lines from frontmatter. Leaves an empty relations: block if it was the last edge.
`);
  const sources = req('sources'), kind = req('kind'), target = req('target');
  const index = byId();
  const removed: { id: string; file: string }[] = [], missing: { id: string; reason: string }[] = [];
  for (const id of sources.split(',').map((s) => s.trim()).filter(Boolean)) {
    const ent = index.get(id);
    if (!ent) { missing.push({ id, reason: 'no entity file' }); continue; }
    const p = path.join(ENTITIES, ent.file);
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    const before = lines.length;
    const kept = lines.filter((l) => !(new RegExp(`kind:\\s*${kind}\\b`).test(l) && l.includes(`target: "${target}"`)));
    if (kept.length === before) { missing.push({ id, reason: 'no matching edge' }); continue; }
    fs.writeFileSync(p, kept.join('\n'));
    removed.push({ id, file: ent.file });
  }
  emit({ removed, missing });
}

function reviewSet() {
  if (wantHelp) help(`
codex review set — write/replace the review verdict block in an entity's frontmatter.
The build ignores this block; it is the human/agent triage record.

Input
  --id <id>           the entity; required
  --archetype <x>     ${ARCHETYPES.join(' | ')}; required
  --action <y>        ${ACTIONS.join(' | ')}; required
  --notes <text>      specific findings and fixes; required
  --ai-written <b>    true | false; default true

Output (JSON)
  { id, file, review:{aiWritten, archetype, action, notes} }

Effects
  Inserts or replaces the review: block in frontmatter. Other fields untouched.
`);
  const id = req('id'), archetype = req('archetype'), action = req('action'), notes = req('notes');
  if (!ARCHETYPES.includes(archetype)) fail('bad_value', `--archetype must be one of: ${ARCHETYPES.join(', ')}`, { field: 'archetype', received: archetype });
  if (!ACTIONS.includes(action)) fail('bad_value', `--action must be one of: ${ACTIONS.join(', ')}`, { field: 'action', received: action });
  const aiRaw = flag('ai-written');
  if (aiRaw !== undefined && aiRaw !== 'true' && aiRaw !== 'false') fail('bad_value', '--ai-written must be true or false', { field: 'ai-written', received: aiRaw });
  const aiWritten = aiRaw !== 'false';
  const ent = byId().get(id);
  if (!ent) fail('not_found', `no entity with id ${id}`, { field: 'id' });
  const p = path.join(ENTITIES, ent!.file);
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const fmEnd = lines.indexOf('---', 1);
  if (lines[0] !== '---' || fmEnd < 0) fail('bad_state', `entity ${id} has no frontmatter`, {});
  // remove existing review: block (the key line + following indented lines)
  const ri = lines.slice(1, fmEnd).findIndex((l) => /^review:/.test(l));
  if (ri >= 0) { const start = ri + 1; let end = start + 1; while (end < fmEnd && /^\s+\S/.test(lines[end])) end++; lines.splice(start, end - start); }
  const block = ['review:', `  aiWritten: ${aiWritten}`, `  archetype: ${archetype}`, `  action: ${action}`, `  notes: "${notes.replace(/"/g, '\\"')}"`];
  const at = lines.indexOf('---', 1); // recompute after potential splice
  lines.splice(at, 0, ...block);
  fs.writeFileSync(p, lines.join('\n'));
  emit({ id, file: ent!.file, review: { aiWritten, archetype, action, notes } });
}

function entityShow() {
  if (wantHelp) help(`
codex entity show — full current state of one entity. Read-only.

Input
  --id <id>     the entity; required
  --no-body     omit the markdown body from output

Output (JSON)
  { id, name, entityType, coordinates, zoomLevel, blurb, tags, relations, review,
    partOf:{id,name}|null, contains:[{id,name}], body? } — partOf/contains derived live from within edges.
`);
  const id = req('id');
  const index = byId();
  const ent = index.get(id);
  if (!ent) fail('not_found', `no entity with id ${id}`, { field: 'id' });
  const d = ent!.data;
  const containerId = withinTarget(d);
  const container = containerId && index.has(containerId) ? { id: containerId, name: index.get(containerId)!.data.name } : null;
  const contains = all().filter((e) => withinTarget(e.data) === id).map((e) => ({ id: String(e.data.id), name: e.data.name })).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  const o: Record<string, unknown> = { id, name: d.name, entityType: d.entityType, coordinates: coordsOf(d), zoomLevel: d.zoomLevel, blurb: d.blurb, tags: d.tags, relations: d.relations, review: d.review, partOf: container, contains };
  if (!has('no-body')) o.body = ent!.body;
  emit(o);
}

function reportStatus() {
  if (wantHelp) help(`
codex report status — corpus-wide aggregate counts. Read-only. Aggregates only, never enumerates.

Output (JSON)
  { total, withReview, byArchetype:{...}, byAction:{...}, withWithinEdge, topLevel,
    bodyBuckets:{empty,short,substantial} } — substantial = body >= 400 chars (TODO stripped).
`);
  const items = all();
  const byArchetype: Record<string, number> = {}, byAction: Record<string, number> = {};
  let withReview = 0, withWithin = 0, empty = 0, short = 0, substantial = 0;
  for (const e of items) {
    const rev = e.data.review as { archetype?: string; action?: string } | undefined;
    if (rev) { withReview++; if (rev.archetype) byArchetype[rev.archetype] = (byArchetype[rev.archetype] || 0) + 1; if (rev.action) byAction[rev.action] = (byAction[rev.action] || 0) + 1; }
    if (withinTarget(e.data)) withWithin++;
    const len = e.body.replace(/TODO/g, '').trim().length;
    if (len === 0) empty++; else if (len < 400) short++; else substantial++;
  }
  emit({ total: items.length, withReview, byArchetype, byAction, withWithinEdge: withWithin, topLevel: items.length - withWithin, bodyBuckets: { empty, short, substantial } });
}

function reportList() {
  if (wantHelp) help(`
codex report list — filtered, paginated entity list for building worklists. Read-only.
Filters combine with AND. Sorted by name. Cursor-based pagination.

Input
  --archetype <x>   keep only entities whose review.archetype matches
  --action <y>      keep only entities whose review.action matches
  --has-review <b>  true | false — filter on presence of a review block
  --within <b>      true | false — filter on presence of a within (containment) edge
  --near <id>       keep only entities within --radius of this entity
  --radius <u>      radius in pin units for --near; default 30
  --substantial     keep only entities with body >= 400 chars (TODO stripped)
  --limit <n>       page size; default 50, max 500
  --cursor <s>      opaque cursor from a prior response's next_cursor

Output (JSON)
  { items:[{id,name,entityType,zoomLevel,archetype,action,within}], next_cursor, total }
  next_cursor is null at end of list.
`);
  let items = all();
  const arche = flag('archetype'), action = flag('action');
  if (arche !== undefined) items = items.filter((e) => (e.data.review as { archetype?: string } | undefined)?.archetype === arche);
  if (action !== undefined) items = items.filter((e) => (e.data.review as { action?: string } | undefined)?.action === action);
  const hr = flag('has-review'); if (hr !== undefined) items = items.filter((e) => Boolean(e.data.review) === (hr === 'true'));
  const wi = flag('within'); if (wi !== undefined) items = items.filter((e) => Boolean(withinTarget(e.data)) === (wi === 'true'));
  if (has('substantial')) items = items.filter((e) => e.body.replace(/TODO/g, '').trim().length >= 400);
  const nearId = flag('near');
  if (nearId !== undefined) {
    const self = byId().get(nearId); const sc = self ? coordsOf(self.data) : undefined;
    if (!sc) fail('not_found', `--near id ${nearId} has no coordinates`, { field: 'near' });
    const radius = flag('radius') === undefined ? 30 : Number(flag('radius'));
    items = items.filter((e) => { const c = coordsOf(e.data); return c && String(e.data.id) !== nearId && Math.hypot(c[0] - sc![0], c[1] - sc![1]) <= radius; });
  }
  items = items.sort((a, b) => String(a.data.name).localeCompare(String(b.data.name)));
  const total = items.length;
  const limit = Math.min(500, flag('limit') === undefined ? 50 : Number(flag('limit')));
  const cursor = flag('cursor');
  const offset = cursor === undefined ? 0 : Number(Buffer.from(cursor, 'base64').toString('utf8'));
  const page = items.slice(offset, offset + limit);
  const next = offset + limit < total ? Buffer.from(String(offset + limit)).toString('base64') : null;
  emit({ items: page.map((e) => ({ id: String(e.data.id), name: e.data.name, entityType: e.data.entityType, zoomLevel: e.data.zoomLevel, archetype: (e.data.review as { archetype?: string } | undefined)?.archetype, action: (e.data.review as { action?: string } | undefined)?.action, within: withinTarget(e.data) })), next_cursor: next, total });
}

function build() {
  if (wantHelp) help(`
codex build — regenerate derived outputs from the entity files (wraps scripts/build-codex.ts).

Output (JSON)
  { ok, locations, codexEntries, containmentEdges, typedEdges } — parsed from the build summary.

Effects
  Overwrites data/locations.json, public/locations.json, data/codex/compiled.json, public/codex-search.json.
`);
  let stdout = '';
  try { stdout = execFileSync(process.execPath, ['scripts/build-codex.mts'], { cwd: REPO, encoding: 'utf8' }); }
  catch (e) { fail('build_failed', 'build-codex.ts exited non-zero', { next: 'Inspect stderr; the entity files likely have a YAML error.', detail: String((e as { stderr?: unknown }).stderr) }); }
  const num = (re: RegExp): number | null => { const m = stdout.match(re); return m ? Number(m[1]) : null; };
  emit({ ok: true, locations: num(/locations\.json: (\d+)/), codexEntries: num(/codex: (\d+) entries/), containmentEdges: num(/\((\d+) containment edges/), typedEdges: num(/containment edges, (\d+) typed/) });
}

function reportLint() {
  if (wantHelp) help(`
codex report lint — graph-validity checks over the entity corpus. Read-only. Exits 1 when any error-severity finding exists.

Checks
  danglingTargets        (error)   relation targets that do not exist in the index (surfaced from build's silent skip)
  capitalOfNonPolity     (error)   capitalOf edges whose target entityType is not region/nation/faction
  bothEndsDirected       (error)   directed edge kinds authored in both directions (violates one-direction-only discipline)
  worshipsTargetType     (error)   worships edges whose target is not a daemon or a titan-tagged creature
  bordersWithinSameTarget(error)   a single entity declares BOTH a borders edge to Y AND a within edge to Y.
                                   Containment and peer-adjacency are mutually exclusive; the offending edge is
                                   local to that file. No legitimate geographic edge case exists.
  containerBordersChild  (warning) X declares borders Y where Y is within X (a container bordering its own
                                   contained region) — same invariant viewed from the container side. Warning,
                                   not error: the fix needs per-region adjudication (drop the border vs. repoint
                                   the child's within) and most live in out-of-scope periphery regions.
  bothEndsUndirected     (warning) undirected edge kinds (borders, separatedBy) authored on both ends — redundant but harmless
  orphansGeographic      (warning) geographic entities (region/town/city/water/wilderness/ruins/fortress/poi) with no within edge
  mentionScanCollisions  (warning) single-word entity names not in MENTION_SCAN_SKIP_NAMES with ≥ threshold cross-body
                                   prose hits — candidate common-English collisions polluting See Also. Review and
                                   add to scripts/mention-scan-skipnames.mts if appropriate. Threshold via --hits (default 25).
  parentRaceInhabitant   (error)   inhabitedBy edges whose target is a parent race that has subraces — resolve to a specific
                                   subrace. race-human is exempt (accepted generic fallback); a small per-region allowlist
                                   (FALLBACK_INHABITANT_ALLOW) covers non-human regions where no subrace fits. Any other
                                   broad non-human inhabitedBy edge flags — these are the worklist for subrace resolution.
  orphansNonGeographic   (info)    non-geographic entities with no within edge — expected; count only, not enumerated

Severity model
  error   → ok:false, exit code 1 (gates CI/agents)
  warning → counted and enumerated, does NOT fail the exit code
  info    → count only, not enumerated

Limitations
  date-sanity: no structured date fields — entities use free-text dates in body prose; born-after-death /
  capital-predates-polity checks are not implementable without a structured era ordering (future schema work).

Flags
  --hits <n>             mentionScanCollisions threshold (default 25)

Output (JSON)
  { ok, errors, warnings, checks: { danglingTargets, capitalOfNonPolity, bothEndsDirected, worshipsTargetType,
    bordersWithinSameTarget, containerBordersChild, bothEndsUndirected, orphansGeographic, mentionScanCollisions, parentRaceInhabitant, orphansNonGeographic }, limitations }
`);

  interface Finding { source: string; sourceName: string; kind: string; target?: string; detail: string }

  const POLITY_SET = new Set(['region', 'nation', 'faction']);
  const UNDIRECTED = new Set(['borders', 'separatedBy']);
  const GEOGRAPHIC = new Set(['region', 'town', 'city', 'water', 'wilderness', 'ruins', 'fortress', 'poi']);

  const index = byId();
  const entities = all();

  // Check 1 — dangling targets
  const danglingFindings: Finding[] = [];
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    for (const r of rels) {
      if (r.target === undefined) continue;
      const tid = String(r.target);
      if (!index.has(tid)) {
        danglingFindings.push({
          source: String(e.data.id),
          sourceName: String(e.data.name ?? e.file),
          kind: String(r.kind ?? r.rel ?? ''),
          target: tid,
          detail: 'target id not found',
        });
      }
    }
  }

  // Check 2 — capitalOf non-polity
  const capitalFindings: Finding[] = [];
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    for (const r of rels) {
      if (String(r.kind ?? r.rel ?? '') !== 'capitalOf') continue;
      if (r.target === undefined) continue;
      const tid = String(r.target);
      const tgt = index.get(tid);
      if (!tgt) continue; // already caught by check 1
      if (!POLITY_SET.has(String(tgt.data.entityType ?? ''))) {
        capitalFindings.push({
          source: String(e.data.id),
          sourceName: String(e.data.name ?? e.file),
          kind: 'capitalOf',
          target: tid,
          detail: `target entityType is "${tgt.data.entityType}" (expected region/nation/faction)`,
        });
      }
    }
  }

  // Check 3 — both-ends-authored
  const tripleSet = new Set<string>();
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    for (const r of rels) {
      if (r.target === undefined) continue;
      const k = String(r.kind ?? r.rel ?? '');
      tripleSet.add(`${String(e.data.id)}|${k}|${String(r.target)}`);
    }
  }
  const bothDirectedFindings: Finding[] = [];
  const bothUndirectedFindings: Finding[] = [];
  const bothEndsSeen = new Set<string>();
  for (const triple of tripleSet) {
    const [src, kind, tgt] = triple.split('|');
    const reverse = `${tgt}|${kind}|${src}`;
    if (!tripleSet.has(reverse)) continue;
    const pairKey = `${[src, tgt].sort().join('|')}|${kind}`;
    if (bothEndsSeen.has(pairKey)) continue;
    bothEndsSeen.add(pairKey);
    const srcEntity = index.get(src);
    const finding: Finding = {
      source: src,
      sourceName: String(srcEntity?.data.name ?? src),
      kind,
      target: tgt,
      detail: 'both ends authored',
    };
    if (UNDIRECTED.has(kind)) {
      bothUndirectedFindings.push(finding);
    } else {
      bothDirectedFindings.push(finding);
    }
  }

  // Check 4 — worships target type
  // worships edges wire cultures to the daemon pantheon; the one sanctioned exception is veneration
  // of a worshipped primordial titan (the Elves of the Gray Order worship creature-hykravones, a
  // sleeping titan — a titan-cult). This converts a verbal convention into a machine-checked invariant.
  interface WorshipsTypeFinding { source: string; target: string; targetEntityType: string }
  const worshipsTypeFindings: WorshipsTypeFinding[] = [];
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    for (const r of rels) {
      if (String(r.kind ?? r.rel ?? '') !== 'worships') continue;
      if (r.target === undefined) continue;
      const tid = String(r.target);
      const tgt = index.get(tid);
      if (!tgt) {
        // dangling — already caught by check 1, record as error here too
        worshipsTypeFindings.push({ source: String(e.data.id), target: tid, targetEntityType: 'unknown (dangling)' });
        continue;
      }
      const tgtType = String(tgt.data.entityType ?? '');
      const tgtTags = Array.isArray(tgt.data.tags) ? (tgt.data.tags as unknown[]).map(String) : [];
      const isDaemon = tgtType === 'daemon';
      const isTitan = tgtType === 'creature' && tgtTags.includes('titan');
      if (!isDaemon && !isTitan) {
        worshipsTypeFindings.push({ source: String(e.data.id), target: tid, targetEntityType: tgtType });
      }
    }
  }

  // Check 5 — orphan sweep
  const orphanGeoFindings: Finding[] = [];
  let orphanNonGeoCount = 0;
  for (const e of entities) {
    if (withinTarget(e.data) !== null) continue;
    const et = String(e.data.entityType ?? '');
    if (GEOGRAPHIC.has(et)) {
      orphanGeoFindings.push({
        source: String(e.data.id),
        sourceName: String(e.data.name ?? e.file),
        kind: 'within',
        detail: 'no within edge',
      });
    } else {
      orphanNonGeoCount++;
    }
  }

  // Check 6 — mention-scan collisions
  // Single-word entity names whose string appears in many other entity bodies are likely common
  // English vocabulary collisions polluting See Also (e.g. "Sometimes" the place vs. "sometimes"
  // the adverb). Real proper-noun names rarely cross > ~20 bodies in this corpus; once they do
  // it is either an intentional dense node (a race, the continent Ve) or a collision that needs
  // adding to MENTION_SCAN_SKIP_NAMES. Warning severity: surfaces candidates for human review.
  // Mirrors the build's mention-scan: strips <!-- mechanics --> + <!-- author-notes --> so only
  // the lore body is counted (matches what the build actually scans).
  interface MentionFinding { source: string; sourceName: string; hits: number; detail: string }
  const hitsThreshold = Number(flag('hits') ?? '25');
  const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const loreBody = (raw: string): string => {
    let b = raw;
    const m = b.indexOf('<!-- mechanics -->');
    if (m >= 0) b = b.slice(0, m);
    const a = b.indexOf('<!-- author-notes -->');
    if (a >= 0) b = b.slice(0, a);
    return b;
  };
  const lore = new Map<string, string>(entities.map((e) => [String(e.data.id), loreBody(e.body)]));
  const mentionFindings: MentionFinding[] = [];
  for (const e of entities) {
    const name = String(e.data.name ?? '').trim();
    const lc = name.toLowerCase();
    if (!/^[a-z]+$/.test(lc)) continue;          // single ASCII word only
    if (lc.length < 4) continue;                  // mirror build's length guard
    if (MENTION_SCAN_SKIP_NAMES.has(lc)) continue;
    const re = new RegExp('\\b' + escRe(lc) + '\\b', 'i');
    let hits = 0;
    const selfId = String(e.data.id);
    for (const [oid, body] of lore) {
      if (oid === selfId) continue;
      if (body && re.test(body)) hits++;
    }
    if (hits >= hitsThreshold) {
      mentionFindings.push({
        source: selfId,
        sourceName: name,
        hits,
        detail: `single-word name appears in ${hits} other entity bodies — review for common-English collision`,
      });
    }
  }
  mentionFindings.sort((a, b) => b.hits - a.hits);

  // Check 7 — parentRaceInhabitant: inhabitedBy edges targeting a parent race that has subraces
  // race-human is an accepted fallback target (user decision 2026-05-29): most flagged human
  // regions are generic cities/polities/confederations with no named human subculture, so the
  // broad "Human" tag is the truthful one. Humans are exempt entirely.
  const FALLBACK_RACE_EXEMPT = new Set<string>(['race-human']);
  // Per-(region|race) intentional broad fallbacks where NO subrace fits the region's prose
  // (generic populations, advisor presences, or a fallen empire). Any OTHER broad non-human
  // inhabitedBy edge still flags, so the check keeps catching regressions.
  const FALLBACK_INHABITANT_ALLOW = new Set<string>([
    '947|race-goblin',                       // Gymlstik — generic conquered goblins, no subrace fits
    '2530|race-halfling',                    // Kerwin — generic pastoral halflings, no subrace fits
    '2533|race-halfling',                    // Tarkha — capital of Kerwin, same population
    '1475|race-naga',                        // Central Aboyinzu — naga advisors, no subrace tied here
    '1606|race-naga',                        // Kadroka — mixed human-naga administration, unspecified
    '1661|race-naga',                        // Ponoigari — minority naga presence, unspecified
    'nation-postronamas-empire|race-gnome',  // Postronamas — fallen empire; survivors became other subraces
  ]);
  const parentRaceIdsLint = new Set<string>();
  const subraceCountOf = new Map<string, number>();
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    for (const r of rels) {
      if (r.rel === 'culture' && String(r.kind ?? '') === 'subraceOf' && r.target !== undefined) {
        const tid = String(r.target);
        parentRaceIdsLint.add(tid);
        subraceCountOf.set(tid, (subraceCountOf.get(tid) ?? 0) + 1);
      }
    }
  }
  const parentRaceFindings: Finding[] = [];
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    for (const r of rels) {
      if (r.rel !== 'culture' || String(r.kind ?? '') !== 'inhabitedBy') continue;
      if (r.target === undefined) continue;
      const tid = String(r.target);
      if (!parentRaceIdsLint.has(tid)) continue;
      if (FALLBACK_RACE_EXEMPT.has(tid)) continue;
      if (FALLBACK_INHABITANT_ALLOW.has(`${String(e.data.id)}|${tid}`)) continue;
      const tgt = index.get(tid);
      const raceName = tgt ? String(tgt.data.name ?? tid) : tid;
      const n = subraceCountOf.get(tid) ?? 0;
      parentRaceFindings.push({
        source: String(e.data.id),
        sourceName: String(e.data.name ?? e.file),
        kind: 'inhabitedBy',
        target: tid,
        detail: `inhabitedBy target ${raceName} is a parent race with ${n} subraces — resolve to a specific subrace`,
      });
    }
  }

  // Check 8 — borders+within contradiction (agent-075 adjudication, 2026-05-29)
  // Containment (`within`) and peer-adjacency (`borders`) are mutually exclusive: if A is within B,
  // B's boundary IS the outer edge of A's space — there is no separate peer frontier between them.
  // A `borders` edge between two entities in a direct containment relationship is therefore invalid.
  // Two directions, two severities:
  //   (a) bordersWithinSameTarget (ERROR) — a single entity declares BOTH `borders` Y AND `within` Y.
  //       Always an authoring error in that one file; the offending edge is local and fixable. This is
  //       the ratified case (agent-075: "always a contradiction → error").
  //   (b) containerBordersChild (WARNING) — X declares `borders` Y where Y declares `within` X. The
  //       spurious edge lives on the CONTAINER and the case usually needs the same per-region geographic
  //       adjudication (is the container's border edge stale, or is the child's `within` the wrong
  //       container?). Surfaced as a tracked backlog rather than gating CI, since most live in
  //       out-of-scope periphery regions and have not been individually adjudicated.
  const containerOf = new Map<string, string>();
  for (const e of entities) {
    const w = withinTarget(e.data);
    if (w !== null) containerOf.set(String(e.data.id), w);
  }
  const bordersWithinFindings: Finding[] = [];      // (a) error
  const containerBordersChildFindings: Finding[] = []; // (b) warning
  const cbcSeen = new Set<string>();
  for (const e of entities) {
    const rels = Array.isArray(e.data.relations) ? (e.data.relations as { rel?: string; kind?: string; target?: unknown }[]) : [];
    const sid = String(e.data.id);
    for (const r of rels) {
      if (String(r.kind ?? r.rel ?? '') !== 'borders') continue;
      if (r.target === undefined) continue;
      const tid = String(r.target);
      const tgt = index.get(tid);
      const tgtName = tgt ? String(tgt.data.name ?? tid) : tid;
      if (containerOf.get(sid) === tid) {            // (a) X borders Y, X within Y — same file
        bordersWithinFindings.push({
          source: sid,
          sourceName: String(e.data.name ?? e.file),
          kind: 'borders',
          target: tid,
          detail: `borders ${tgtName} but is also 'within' it — containment and peer-adjacency are mutually exclusive`,
        });
      } else if (containerOf.get(tid) === sid) {     // (b) X borders Y, Y within X — container/child
        const pairKey = [sid, tid].sort().join('|');
        if (cbcSeen.has(pairKey)) continue;
        cbcSeen.add(pairKey);
        containerBordersChildFindings.push({
          source: sid,
          sourceName: String(e.data.name ?? e.file),
          kind: 'borders',
          target: tid,
          detail: `borders ${tgtName} but ${tgtName} is 'within' this entity — a container cannot border its own contained region (adjudicate: drop the border, or repoint the child's within)`,
        });
      }
    }
  }

  const errors = danglingFindings.length + capitalFindings.length + bothDirectedFindings.length + worshipsTypeFindings.length + parentRaceFindings.length + bordersWithinFindings.length;
  const warnings = bothUndirectedFindings.length + orphanGeoFindings.length + mentionFindings.length + containerBordersChildFindings.length;

  emit({
    ok: errors === 0,
    errors,
    warnings,
    checks: {
      danglingTargets:       { severity: 'error',   count: danglingFindings.length,       findings: danglingFindings },
      capitalOfNonPolity:    { severity: 'error',   count: capitalFindings.length,        findings: capitalFindings },
      bothEndsDirected:      { severity: 'error',   count: bothDirectedFindings.length,   findings: bothDirectedFindings },
      worshipsTargetType:    { severity: 'error',   count: worshipsTypeFindings.length,   findings: worshipsTypeFindings },
      bordersWithinSameTarget:{ severity: 'error',  count: bordersWithinFindings.length,  findings: bordersWithinFindings },
      containerBordersChild: { severity: 'warning', count: containerBordersChildFindings.length, findings: containerBordersChildFindings },
      bothEndsUndirected:    { severity: 'warning', count: bothUndirectedFindings.length, findings: bothUndirectedFindings },
      orphansGeographic:     { severity: 'warning', count: orphanGeoFindings.length,      findings: orphanGeoFindings },
      mentionScanCollisions: { severity: 'warning', count: mentionFindings.length,        findings: mentionFindings, threshold: hitsThreshold },
      parentRaceInhabitant:  { severity: 'error',   count: parentRaceFindings.length,     findings: parentRaceFindings },
      orphansNonGeographic:  { severity: 'info',    count: orphanNonGeoCount },
    },
    limitations: ['date-sanity: no structured date fields — see plan'],
  });
  process.exit(errors > 0 ? 1 : 0);
}

// ===================================================================== DISPATCH
const route = cmd.join(' ');
(async () => {
  switch (route) {
    case '': case 'help': help(ROOT_HELP);
    case 'map': help(MAP_HELP);
    case 'edge': help(EDGE_HELP);
    case 'review': help(REVIEW_HELP);
    case 'entity': help(ENTITY_HELP);
    case 'report': help(REPORT_HELP);
    case 'map shot': return mapShot();
    case 'map near': return mapNear();
    case 'map dist': return mapDist();
    case 'edge add': return edgeAdd();
    case 'edge rm': return edgeRm();
    case 'review set': return reviewSet();
    case 'entity show': return entityShow();
    case 'report status': return reportStatus();
    case 'report list': return reportList();
    case 'report lint': return reportLint();
    case 'build': return build();
    default: fail('unknown_command', `no such command: ${route}`, { received: route, next: 'Run `codex -h` for the command tree.' });
  }
})();
