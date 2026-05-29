/**
 * Generate a codex image from a HAND-WRITTEN subject description, then upload to R2.
 *
 *   handwritten subject ─▶ STYLE + subject + NEG ─▶ Gemini ─▶ sharp (webp) ─▶ R2
 *                                                                              │
 *                                          images/{id}/{slot}.webp ◀──────────┘
 *
 * There is NO prompt manifest and NO auto-derived descriptions. Per
 * docs/worldbuilding/image-style-guide.md, an agent handwrites a bespoke subject
 * for each image; THIS SCRIPT owns the locked style: it prepends STYLE and appends
 * NEG so the painterly register is enforced centrally and the author only writes
 * the subject. On success it prints the public R2 URL — paste that into the
 * entity's `banner:` frontmatter (banners) or an inline `![alt](url)` (illustrations).
 *
 * REQUIREMENTS
 *   - env GEMINI_API_KEY — a key on a *paid* Google AI project (image models are
 *       quota 0 on the free tier).
 *   - wrangler logged in (`wrangler whoami`) with R2 access to `alaria`. Uploads
 *       use `wrangler r2 object put ... --remote` (without --remote it writes to a
 *       local emulation, not the real bucket).
 *
 * USAGE
 *   # single image
 *   GEMINI_API_KEY=... node scripts/generate-images.mts \
 *     --id 495 --slot banner --prompt "A sweeping establishing view of Enimogos, …"
 *   GEMINI_API_KEY=... node scripts/generate-images.mts \
 *     --id person-gaea --slot illustration --orientation upright --prompt "A portrait of …"
 *
 *   # batch: a JSON array of { id, slot?, orientation?, prompt }
 *   GEMINI_API_KEY=... node scripts/generate-images.mts --jobs ./my-batch.json
 *
 *   # free: assemble + print the full prompt(s), no API call, no upload
 *   node scripts/generate-images.mts --id 495 --slot banner --prompt "…" --dry-run
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import sharp from 'sharp';

const REPO = path.resolve(import.meta.dirname, '..');
const BUCKET = 'alaria';
const PUBLIC_BASE = 'https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/images';

// ── LOCKED style + negatives (see docs/worldbuilding/image-style-guide.md) ──────
// The author writes only the subject; the script wraps it as: `${STYLE} ${subject} ${NEG}`.
const STYLE =
  'Fantasy oil painting, painterly and richly detailed, naturalistic realism, classical oil-painting rendering with soft brushwork and atmospheric lighting.';
const NEG =
  'No text, letters, captions, watermark, signature, or border frame anywhere in the image. Not a photograph, not anime, not cartoon.';

// ── roles → exact output dimensions + the model aspect ratio to request ─────────
// Two roles only: a 16:9 banner (page header + card preview), and an illustration
// scattered in the body — upright (3:4) for figures, landscape (4:3) for scenes.
const SPEC = {
  banner:    { w: 1600, h: 900,  aspect: '16:9', imageSize: '2K' },
  upright:   { w: 900,  h: 1200, aspect: '3:4',  imageSize: '2K' },
  landscape: { w: 1200, h: 900,  aspect: '4:3',  imageSize: '2K' },
} as const;

interface Job {
  id: string;            // immutable codex id (frontmatter id)
  slot: string;          // R2 filename stem: 'banner' or e.g. 'illo-harbor'
  orientation: 'upright' | 'landscape';
  prompt: string;        // the hand-written SUBJECT (no style, no negatives)
}

function specFor(job: Job) {
  return job.slot === 'banner' ? SPEC.banner : SPEC[job.orientation];
}
function fullPrompt(job: Job): string {
  return `${STYLE} ${job.prompt.trim()} ${NEG}`;
}
function objectPath(job: Job): string {
  return `images/${job.id}/${job.slot}.webp`;
}
function publicUrl(job: Job): string {
  return `${PUBLIC_BASE}/${encodeURIComponent(job.id)}/${job.slot}.webp`;
}

// ── CLI ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const val = (f: string) => { const i = argv.indexOf(f); return i !== -1 ? argv[i + 1] ?? null : null; };

if (has('--help') || has('-h')) {
  console.log(`
generate-images.mts — render ONE or MANY codex images from hand-written subjects and upload to R2

The author writes only the subject; the script wraps it with the locked STYLE + NEG.

Single image:
  --id <id>            Immutable codex id (frontmatter id, e.g. 495 or person-gaea). Required.
  --prompt <text>      The hand-written subject (no style words, no negatives). Required.
  --slot <name>        R2 filename stem. 'banner' (default) → the page header + card preview;
                       anything else → a body illustration (e.g. 'illo-harbor', 'illo-rite').
  --orientation up|land  Illustration shape: 'upright' (3:4, figures) or 'landscape' (4:3, scenes).
                       Ignored for the banner (always 16:9). Default: landscape.

Batch:
  --jobs <file.json>   A JSON array of { id, slot?, orientation?, prompt }. Overrides the flags above.

Behavior:
  --model NAME         Gemini image model (default: gemini-3.1-flash-image — Nano Banana 2).
  --concurrency N      Parallel generations for --jobs (default: 3).
  --dry-run            Print the assembled prompt(s) + target path(s); no API call, no upload. FREE.
  --no-upload          Generate + write .webp locally; skip the R2 upload.
  --out DIR            Local output dir for --no-upload (default: ./generated-images).
  --force              Regenerate even if the R2 object already exists.

Env:
  GEMINI_API_KEY       Required for live generation (paid-tier project).

On success each job prints its public URL. Paste it into the entity file:
  • banner       → frontmatter  banner: <url>
  • illustration → inline body   ![caption](<url>)
`);
  process.exit(0);
}

const DRY_RUN = has('--dry-run');
const NO_UPLOAD = has('--no-upload');
const FORCE = has('--force');
const MODEL = val('--model') ?? 'gemini-3.1-flash-image';
const CONCURRENCY = Math.max(1, parseInt(val('--concurrency') ?? '3', 10));
const OUT_DIR = path.resolve(REPO, val('--out') ?? 'generated-images');

function normOrientation(s: string | null | undefined): 'upright' | 'landscape' {
  const v = (s ?? '').toLowerCase();
  if (v === 'up' || v === 'upright' || v === 'portrait') return 'upright';
  return 'landscape';
}

// ── resolve jobs ──────────────────────────────────────────────────────────────
let jobs: Job[] = [];
const jobsFile = val('--jobs');
if (jobsFile) {
  const raw = JSON.parse(fs.readFileSync(path.resolve(REPO, jobsFile), 'utf8'));
  if (!Array.isArray(raw)) { console.error('--jobs file must be a JSON array'); process.exit(1); }
  jobs = raw.map((j: any, i: number) => {
    if (!j.id || !j.prompt) { console.error(`job[${i}] needs both id and prompt`); process.exit(1); }
    return {
      id: String(j.id),
      slot: String(j.slot ?? 'banner'),
      orientation: normOrientation(j.orientation),
      prompt: String(j.prompt),
    };
  });
} else {
  const id = val('--id');
  const prompt = val('--prompt');
  if (!id || !prompt) {
    console.error('Provide --id and --prompt (single image) or --jobs <file>. See --help.');
    process.exit(1);
  }
  jobs = [{ id, slot: val('--slot') ?? 'banner', orientation: normOrientation(val('--orientation')), prompt }];
}

// ── one generation ──────────────────────────────────────────────────────────
const ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

async function generateOne(job: Job): Promise<Buffer> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');
  const spec = specFor(job);
  const body = {
    contents: [{ parts: [{ text: fullPrompt(job) }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: spec.aspect, imageSize: spec.imageSize },
    },
  };

  const MAX_TRIES = 4;
  let lastErr = '';
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    const res = await fetch(ENDPOINT(MODEL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: JSON.stringify(body),
    });
    const json: any = await res.json().catch(() => ({}));
    if (res.ok) {
      const parts = json?.candidates?.[0]?.content?.parts ?? [];
      const img = parts.find((p: any) => p.inlineData?.data);
      if (img) return Buffer.from(img.inlineData.data, 'base64');
      lastErr = `No image in response (finish: ${json?.candidates?.[0]?.finishReason})`;
    } else {
      lastErr = json?.error?.message?.split('\n')[0] ?? `HTTP ${res.status}`;
    }
    // Retry on transient empty responses, 429, and 5xx; otherwise give up.
    const transient = res.ok || res.status === 429 || res.status >= 500;
    if (attempt < MAX_TRIES && transient) {
      await new Promise((r) => setTimeout(r, attempt * 6000));
      continue;
    }
    throw new Error(lastErr);
  }
  throw new Error(lastErr || 'generation failed');
}

async function toWebp(raw: Buffer, job: Job): Promise<Buffer> {
  const spec = specFor(job);
  return sharp(raw).resize(spec.w, spec.h, { fit: 'cover', position: 'attention' }).webp({ quality: 88 }).toBuffer();
}

// ── R2 ──────────────────────────────────────────────────────────────────────
function r2Exists(objectPath: string): boolean {
  try {
    execFileSync('wrangler', ['r2', 'object', 'get', `${BUCKET}/${objectPath}`, '--remote', '--pipe'],
      { stdio: ['ignore', 'ignore', 'ignore'] });
    return true;
  } catch { return false; }
}
function uploadR2(buf: Buffer, objectPath: string): void {
  const tmp = path.join(REPO, `.tmp-${objectPath.replace(/[^a-z0-9]/gi, '_')}.webp`);
  fs.writeFileSync(tmp, buf);
  try {
    execFileSync('wrangler',
      ['r2', 'object', 'put', `${BUCKET}/${objectPath}`, '--file', tmp, '--content-type', 'image/webp', '--remote'],
      { stdio: ['ignore', 'ignore', 'inherit'] });
  } finally { fs.unlinkSync(tmp); }
}
function writeLocal(buf: Buffer, objectPath: string): string {
  const dest = path.join(OUT_DIR, objectPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return dest;
}

// ── run ────────────────────────────────────────────────────────────────────
console.log(`generate-images: model=${MODEL} jobs=${jobs.length} mode=${DRY_RUN ? 'DRY-RUN' : NO_UPLOAD ? `local→${OUT_DIR}` : `upload→R2:${BUCKET}`}`);

if (DRY_RUN) {
  for (const job of jobs) {
    const spec = specFor(job);
    console.log(`\n• ${objectPath(job)}  [${spec.w}×${spec.h}, ask ${spec.aspect} ${spec.imageSize}]`);
    console.log(`  ${fullPrompt(job)}`);
  }
  console.log(`\n(dry-run) ${jobs.length} prompt(s) assembled. No API calls made.`);
  process.exit(0);
}

if (!process.env.GEMINI_API_KEY) {
  console.error('\nGEMINI_API_KEY not set — export a paid-tier key, or use --dry-run.');
  process.exit(1);
}

let done = 0, failed = 0, skipped = 0;
const urls: string[] = [];

async function runJob(job: Job): Promise<void> {
  const op = objectPath(job);
  if (!FORCE && !NO_UPLOAD && r2Exists(op)) {
    skipped++;
    console.log(`  = skip (exists) ${op}  ${publicUrl(job)}`);
    urls.push(publicUrl(job));
    return;
  }
  try {
    const webp = await toWebp(await generateOne(job), job);
    if (NO_UPLOAD) {
      const dest = writeLocal(webp, op);
      console.log(`  ✓ ${op} → ${path.relative(REPO, dest)} (${(webp.length / 1024).toFixed(0)} KB)`);
    } else {
      uploadR2(webp, op);
      console.log(`  ✓ ${op} (${(webp.length / 1024).toFixed(0)} KB) → ${publicUrl(job)}`);
      urls.push(publicUrl(job));
    }
    done++;
  } catch (e: any) {
    failed++;
    console.error(`  ✗ ${op}: ${e.message}`);
  }
}

const queue = [...jobs];
async function worker() { while (queue.length) await runJob(queue.shift()!); }
await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, () => worker()));

console.log(`\nDone. generated=${done} skipped=${skipped} failed=${failed}`);
if (urls.length && !NO_UPLOAD) {
  console.log('\nURLs (paste into the entity file — banner: frontmatter, or ![](…) in body):');
  for (const u of urls) console.log(`  ${u}`);
}
if (failed && done === 0) process.exit(1);
