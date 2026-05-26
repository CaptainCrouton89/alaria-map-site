/**
 * convert-lore.mts — convert a non-atlas wiki tree into codex-only entity files.
 *
 * Phase B of the lore migration: source docs in the external Alaria wiki carry lore prose
 * interleaved with TTRPG mechanics (ability blocks, saving throws, XP costs). We keep BOTH,
 * but separate them so the codex shows lore by default and mechanics behind a toggle:
 *
 *   body = <lore prose>\n<!-- mechanics -->\n<mechanics appendix>
 *
 * build-codex.mts splits on that sentinel into `content` + `mechanics`.
 *
 * Usage:
 *   node scripts/convert-lore.mts --tree races --type race [--limit N] [--dry] [--only Elf,Kappa]
 *
 *   --tree   subdir under the wiki root (races, bestiary/dragons, ...)
 *   --type   entityType to stamp (race, creature, deity, ...)
 *   --prefix id namespace prefix (default = --type); ids become "<prefix>-<slug>"
 *   --limit  convert at most N docs (pilot)
 *   --only   comma-separated source filenames (no .md) to convert
 *   --dry    print a per-file lore/mechanics line summary; write nothing
 */
import fs from 'node:fs';
import path from 'node:path';

const WIKI_ROOT = '/Users/silasrhyneer/Code/heart-rush-tools/world-wikis/alaria';
const OUT_DIR = path.resolve(import.meta.dirname, '../content/codex/entities');
const MECH_SENTINEL = '<!-- mechanics -->';

// --- args ---
const args = process.argv.slice(2);
const getArg = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const hasFlag = (k: string) => args.includes(`--${k}`);
const tree = getArg('tree');
const entityType = getArg('type');
const prefix = getArg('prefix') ?? entityType;
const limit = getArg('limit') ? Number(getArg('limit')) : Infinity;
const only = getArg('only')?.split(',').map((s) => s.trim());
const dry = hasFlag('dry');
if (!tree || !entityType) { console.error('required: --tree <subdir> --type <entityType>'); process.exit(1); }

const srcDir = path.join(WIKI_ROOT, tree);
if (!fs.existsSync(srcDir)) { console.error(`no such tree: ${srcDir}`); process.exit(1); }

// Docs that are tables of contents / READMEs / front-matter, not entities.
const SKIP = (f: string) => /^_|_INDEX\.md$|^RACE_INDEX|^index\.md$|^CLAUDE\.md$|^README/i.test(f);

// A block of source markdown is "mechanics" if it carries TTRPG rules signals.
const MECH_MARKERS: RegExp[] = [
  /\*\*\s*(passive|major|minor|free|quick|slow|reaction|action|ongoing)\s+(ability|action)\.?\s*\*\*/i,
  /\bCN\s*\d+/,                  // challenge number
  /\bsaving throw\b/i,
  /\b[AD]\d\b/,                  // advantage/disadvantage dice (A2, D2)
  /\bXP\b/,
  /\b\d+d\d+\b/,                 // dice notation 2d6
];
const isMechanics = (text: string) => MECH_MARKERS.some((re) => re.test(text));

// Inter-wiki links (`[text](../path/File.md)`) point at source files that don't exist in the codex.
// Strip them to plain text — the build's name mention-scan re-links them as real codex links.
const stripWikiLinks = (text: string) => text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

const slug = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

/** First sentence of the first prose paragraph, ≤25 words, plain text. */
function makeBlurb(loreLines: string[]): string {
  const para = loreLines.find((l) =>
    l.trim() && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('*') && !/^(Tags|Links):/i.test(l.trim()));
  if (!para) return '';
  const plain = stripWikiLinks(para).replace(/[*_`]/g, ''); // de-link, strip emphasis / code ticks
  const sentence = plain.split(/(?<=[.!?])\s/)[0].trim();
  const words = sentence.split(/\s+/);
  return (words.length > 25 ? words.slice(0, 25).join(' ') + '…' : sentence).replace(/"/g, "'");
}

interface Segment { level: number; title: string; lines: string[] }

/** Split a doc into heading-delimited segments (# / ## / ### / ####). */
function segment(md: string): Segment[] {
  const segs: Segment[] = [];
  let cur: Segment = { level: 0, title: '', lines: [] };
  for (const line of md.split('\n')) {
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { segs.push(cur); cur = { level: h[1].length, title: h[2].trim(), lines: [] }; }
    else cur.lines.push(line);
  }
  segs.push(cur);
  return segs.filter((s) => s.title || s.lines.some((l) => l.trim()));
}

function convert(srcPath: string, fileName: string) {
  const raw = fs.readFileSync(srcPath, 'utf8');
  const segs = segment(raw);

  // Name: the leading `# `/`## ` heading, else filename.
  const titleSeg = segs.find((s) => s.level === 1 || s.level === 2);
  const name = titleSeg?.title ?? fileName.replace(/\.md$/, '').replace(/_/g, ' ');

  // Inline `Tags: a, b, c` lines (a wiki convention) → frontmatter tags; strip from body.
  const tags = new Set<string>();
  const stripTags = (text: string) =>
    text.split('\n').filter((l) => {
      const m = l.trim().match(/^Tags:\s*(.+)$/i);
      if (m) { m[1].split(',').forEach((t) => { const v = t.trim(); if (v) tags.add(v); }); return false; }
      if (/^Links:/i.test(l.trim())) return false; // wiki nav artifact — drop
      return true;
    }).join('\n');

  const loreOut: string[] = [];
  const mechOut: string[] = [];
  let lastH3 = ''; // nearest lore section title, for context-labeling nested mechanics

  for (const seg of segs) {
    const body = stripTags(seg.lines.join('\n'));
    const segText = `${seg.title}\n${body}`;
    const mech = seg.level >= 3 && isMechanics(segText);

    if (seg.level <= 2) {
      // intro / name segment — always lore; drop the redundant name heading
      if (body.trim()) loreOut.push(body.trim(), '');
      continue;
    }
    if (mech) {
      const label = seg.level === 4 && lastH3 ? `${lastH3} — ${seg.title}` : seg.title;
      mechOut.push(`### ${label}`, body.trim(), '');
    } else {
      if (seg.level === 3) lastH3 = seg.title;
      loreOut.push(`${'#'.repeat(seg.level)} ${seg.title}`, body.trim(), '');
    }
  }

  const loreText = stripWikiLinks(loreOut.join('\n')).replace(/\n{3,}/g, '\n\n').trim();
  const mechText = stripWikiLinks(mechOut.join('\n')).replace(/\n{3,}/g, '\n\n').trim();
  const blurb = makeBlurb(loreText.split('\n'));

  const id = `${prefix}-${slug(name)}`;
  const relSource = path.relative(WIKI_ROOT, srcPath);
  const fm = [
    '---',
    `id: "${id}"`,
    `name: "${name.replace(/"/g, "'")}"`,
    `entityType: ${entityType}`,
    `blurb: "${blurb}"`,
    ...(tags.size ? [`tags: [${[...tags].map((t) => JSON.stringify(t)).join(', ')}]`] : []),
    `sources:`,
    `  - "${relSource}"`,
    'review:',
    '  aiWritten: false',
    '  action: keep',
    '---',
    '',
  ].join('\n');

  const body = mechText
    ? `${loreText}\n\n${MECH_SENTINEL}\n\n${mechText}\n`
    : `${loreText}\n`;

  return { id, name, fileName, loreLines: loreText.split('\n').length, mechLines: mechText ? mechText.split('\n').length : 0, content: fm + body };
}

// --- run ---
const recursive = hasFlag('recursive');
function listMd(dir: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (recursive) out.push(...listMd(path.join(dir, e.name))); }
    else if (e.name.endsWith('.md') && !SKIP(e.name)) out.push(path.join(dir, e.name));
  }
  return out;
}
let paths = listMd(srcDir);
if (only) paths = paths.filter((p) => only.includes(path.basename(p).replace(/\.md$/, '')));
paths = paths.slice(0, limit);

console.log(`${dry ? '[dry] ' : ''}converting ${paths.length} doc(s) from ${tree} as entityType=${entityType}\n`);
// Read the frontmatter id of an existing entity file, if any (to guard against clobbering).
const existingId = (file: string): string | null => {
  if (!fs.existsSync(file)) return null;
  const m = fs.readFileSync(file, 'utf8').match(/^id:\s*"?([^"\n]+)"?/m);
  return m ? m[1].trim() : null;
};
// Filename = the entity id (already unique by `<prefix>-<slug>`), so Phase B files never collide
// with the geographic entities' bare name-slugs. Guard anyway: never overwrite a different id.
let written = 0, skipped = 0;
for (const p of paths) {
  const f = path.basename(p);
  const r = convert(p, f);
  const outPath = path.join(OUT_DIR, `${r.id}.md`);
  const prior = existingId(outPath);
  if (prior && prior !== r.id) { console.log(`  ⛔ skip (would clobber ${prior}): ${f}`); skipped++; continue; }
  console.log(`  ${f.padEnd(30)} -> ${r.id.padEnd(24)} lore:${String(r.loreLines).padStart(4)}  mech:${String(r.mechLines).padStart(4)}`);
  if (!dry) { fs.writeFileSync(outPath, r.content); written++; }
}
if (skipped) console.log(`\n${skipped} skipped (id collision)`);
console.log(`\n${dry ? '(dry run — nothing written)' : `wrote ${paths.length} file(s) to content/codex/entities/`}`);
