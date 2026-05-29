/**
 * Oil-style test: 2 banners + 2 body illustrations, Nano Banana 2, oil-painting
 * register. Throwaway workshop script — edit JOBS and re-run to iterate.
 *   GEMINI_API_KEY=... node scripts/oil-test.mts
 */
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const REPO = path.resolve(import.meta.dirname, '..');
const OUT = path.join(REPO, 'mockups/oil-test');
const MODEL = 'gemini-3.1-flash-image';
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY not set.'); process.exit(1); }

const NEG = 'No text, letters, captions, watermark, signature, or border frame anywhere in the image. Not a photograph, not anime, not cartoon.';

const STYLE = 'Fantasy oil painting, painterly and richly detailed, naturalistic realism, classical oil-painting rendering with soft brushwork and atmospheric lighting.';

const JOBS = [
  {
    label: 'banner-1-enimogos', role: 'Banner · ruins (ancient)', aspect: '16:9', w: 1600, h: 900,
    prompt: `${STYLE} A sweeping establishing view of Enimogos, the shattered capital of the long-fallen Postronamas Empire standing at the heart of a vast desert: colossal broken columns and ruined domes half-swallowed by dunes, sun-bleached ancient stone, a hazy ochre sky. Warm faded age-yellowed palette.`,
  },
  {
    label: 'banner-2-agreben-sea', role: 'Banner · water', aspect: '16:9', w: 1600, h: 900,
    prompt: `${STYLE} A sweeping seascape of the Agreben Sea, the warm teal northern waters of the Greenwater Isles archipelago: jade-green islands scattered across a calm reflective sea, distant sails, soft sunlight and drifting cloud. Cool teal and green palette, luminous reflections.`,
  },
  {
    label: 'illo-3-bathemiel-dragon', role: 'Illustration · creature (upright)', aspect: '3:4', w: 900, h: 1200,
    prompt: `${STYLE} A towering full-body study of Bathemiel, an immense ancient dragon bound in heavy iron chains in the lightless abyssal depths beneath the sea: scarred weathered scales, smoldering eyes, straining against its bindings. Dramatic red-amber light and deep shadow, a sense of menace. Upright composition.`,
  },
  {
    label: 'illo-4-akratian-plateau', role: 'Illustration · wilderness scene (landscape)', aspect: '4:3', w: 1200, h: 900,
    prompt: `${STYLE} A lone windswept scene on the Akratian Plateau, a southernmost tableland extending toward the polar ice cap where bare rock meets permanent sea ice: scoured grasses bent in the wind, pale cold daylight, a vast empty horizon. Cold natural palette of mossy greens and grey stone.`,
  },
];

async function gen(prompt: string, aspect: string): Promise<Buffer> {
  for (let i = 1; i <= 4; i++) {
    const res = await fetch(`${BASE}/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': KEY! },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${prompt} ${NEG}` }] }],
        generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: aspect, imageSize: '2K' } },
      }),
    });
    const j: any = await res.json().catch(() => ({}));
    const img = (j?.candidates?.[0]?.content?.parts ?? []).find((p: any) => p.inlineData?.data);
    if (res.ok && img) return Buffer.from(img.inlineData.data, 'base64');
    if (i < 4) { await new Promise((r) => setTimeout(r, i * 5000)); continue; }
    throw new Error(j?.error?.message?.split('\n')[0] ?? `HTTP ${res.status} / no image`);
  }
  throw new Error('exhausted retries');
}

fs.mkdirSync(OUT, { recursive: true });
const results: any[] = [];
console.log(`oil-test: ${JOBS.length} images`);
await Promise.all(JOBS.map(async (job) => {
  try {
    const raw = await gen(job.prompt, job.aspect);
    const webp = await sharp(raw).resize(job.w, job.h, { fit: 'cover', position: 'attention' }).webp({ quality: 90 }).toBuffer();
    fs.writeFileSync(path.join(OUT, `${job.label}.webp`), webp);
    results.push({ ...job, ok: true });
    console.log(`  ✓ ${job.label} (${(webp.length / 1024).toFixed(0)} KB)`);
  } catch (e: any) {
    results.push({ ...job, ok: false, err: String(e.message ?? e) });
    console.error(`  ✗ ${job.label}: ${e.message ?? e}`);
  }
}));

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
let html = `<!doctype html><html><head><meta charset="utf-8"><title>Oil style test</title><style>
:root{--bg:#15110d;--panel:#221b13;--ink:#e8e0d0;--muted:#a89878;--gold:#c9a227;--border:#4d4436}
body{margin:0;background:var(--bg);color:var(--ink);font-family:ui-sans-serif,system-ui,sans-serif;padding:2rem}
h1{font-weight:600}.grid{display:flex;flex-direction:column;gap:1.6rem;max-width:1100px}
.card{border:1px solid var(--border);border-radius:.6rem;background:var(--panel);overflow:hidden}
.card .role{padding:.6rem .9rem;color:var(--gold);font-size:.85rem;border-bottom:1px solid var(--border)}
.card img{display:block;max-width:100%;background:#000}
.card .p{padding:.7rem .9rem;color:var(--muted);font-size:.74rem;line-height:1.5}
.up{max-width:480px}</style></head><body><h1>Oil style test — Nano Banana 2</h1><div class="grid">`;
for (const r of results) {
  html += `<div class="card"><div class="role">${esc(r.role)} — ${r.w}×${r.h}</div>`;
  html += r.ok
    ? `<img class="${r.aspect === '3:4' ? 'up' : ''}" src="${esc(r.label)}.webp">`
    : `<div class="p" style="color:#d98">failed: ${esc(r.err)}</div>`;
  html += `<div class="p">${esc(r.prompt)}</div></div>`;
}
html += `</div></body></html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`\n${results.filter((r) => r.ok).length}/${results.length} ok → ${path.join(OUT, 'index.html')}`);
