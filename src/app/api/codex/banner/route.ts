import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { isAdmin } from '@/lib/admin';

// Admin-only, local-authoring endpoint: persist hero-banner crop overrides
// (bannerPosition / bannerHeight) for a codex entity.
//
// The canonical source is the entity .md frontmatter (per CLAUDE.md), so we
// rewrite ONLY those two lines there — a surgical text edit that leaves the
// rest of the carefully-authored frontmatter byte-identical (gray-matter's
// stringify would reformat relations/quoting and churn the whole file). We
// then mirror the same two scalar fields into the generated compiled.json so
// the change shows on reload without a full `build-codex` run; build-codex now
// reads these fields too, so a later full rebuild regenerates them identically.

const ENTITIES_DIR = path.resolve(process.cwd(), 'content/codex/entities');
const COMPILED_PATH = path.resolve(process.cwd(), 'data/codex/compiled.json');

const POSITION_RE = /^\d{1,3}(?:\.\d+)?% \d{1,3}(?:\.\d+)?%$/;
const MIN_HEIGHT = 140;
const MAX_HEIGHT = 1000;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

// id -> .md filepath. The filename is a slug, never the frontmatter id, so we
// must resolve by parsing frontmatter. Cached in module scope; rescans on miss.
let idToFile: Map<string, string> | null = null;

function buildIndex(): Map<string, string> {
  const m = new Map<string, string>();
  for (const f of fs.readdirSync(ENTITIES_DIR)) {
    if (!f.endsWith('.md')) continue;
    const full = path.join(ENTITIES_DIR, f);
    try {
      const { data } = matter(fs.readFileSync(full, 'utf8'));
      if (data && data.id != null) m.set(String(data.id), full);
    } catch {
      /* skip unparseable files */
    }
  }
  return m;
}

function findFile(id: string): string | null {
  if (!idToFile) idToFile = buildIndex();
  let f = idToFile.get(id);
  if (f && fs.existsSync(f)) return f;
  idToFile = buildIndex(); // stale cache (new/renamed file) — rescan once
  f = idToFile.get(id);
  return f && fs.existsSync(f) ? f : null;
}

/**
 * Upsert (or, when `value` is null, delete) a scalar key in the leading YAML
 * frontmatter block, leaving every other line untouched. `value` must already
 * be a serialized YAML scalar (e.g. `"50% 25%"` or `420`). Returns null if the
 * file has no frontmatter block (we refuse to mangle it).
 */
function setFrontmatterScalar(src: string, key: string, value: string | null): string | null {
  const match = src.match(/^(---\r?\n)([\s\S]*?\r?\n)(---\r?\n?)/);
  if (!match) return null;
  const [whole, open, block, close] = match;
  const rest = src.slice(whole.length);
  const eol = block.includes('\r\n') ? '\r\n' : '\n';

  const lines = block.split(/\r?\n/);
  while (lines.length && lines[lines.length - 1] === '') lines.pop();

  const keyRe = new RegExp(`^${key}\\s*:`);
  const idx = lines.findIndex((l) => keyRe.test(l));
  if (value === null) {
    if (idx >= 0) lines.splice(idx, 1);
  } else {
    const line = `${key}: ${value}`;
    if (idx >= 0) lines[idx] = line;
    else lines.push(line);
  }

  return open + lines.join(eol) + eol + close + rest;
}

function patchCompiled(
  id: string,
  position: string | null | undefined,
  height: number | null | undefined,
): void {
  if (!fs.existsSync(COMPILED_PATH)) return;
  const compiled = JSON.parse(fs.readFileSync(COMPILED_PATH, 'utf8')) as {
    byId?: Record<string, Record<string, unknown>>;
  };
  const entry = compiled.byId?.[id];
  if (!entry) return;
  if (position === null) delete entry.bannerPosition;
  else if (typeof position === 'string') entry.bannerPosition = position;
  if (height === null) delete entry.bannerHeight;
  else if (typeof height === 'number') entry.bannerHeight = height;
  fs.writeFileSync(COMPILED_PATH, JSON.stringify(compiled, null, 2));
}

// PATCH { id, position?: string|null, height?: number|null }
// A field set to null clears the override; omitting it leaves it unchanged.
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    position?: unknown;
    height?: unknown;
  } | null;
  if (!body || typeof body.id !== 'string' || !body.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const id = body.id;

  let position: string | null | undefined;
  if (body.position === null) {
    position = null;
  } else if (typeof body.position === 'string') {
    const p = body.position.trim();
    if (!POSITION_RE.test(p)) {
      return NextResponse.json({ error: 'Invalid position' }, { status: 400 });
    }
    position = p;
  }

  let height: number | null | undefined;
  if (body.height === null) {
    height = null;
  } else if (typeof body.height === 'number' && Number.isFinite(body.height)) {
    height = clamp(Math.round(body.height), MIN_HEIGHT, MAX_HEIGHT);
  }

  if (position === undefined && height === undefined) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const file = findFile(id);
  if (!file) return NextResponse.json({ error: `Entity not found: ${id}` }, { status: 404 });

  let src = fs.readFileSync(file, 'utf8');
  if (position !== undefined) {
    const next = setFrontmatterScalar(src, 'bannerPosition', position === null ? null : `"${position}"`);
    if (next === null) return NextResponse.json({ error: 'No frontmatter in entity file' }, { status: 500 });
    src = next;
  }
  if (height !== undefined) {
    const next = setFrontmatterScalar(src, 'bannerHeight', height === null ? null : String(height));
    if (next === null) return NextResponse.json({ error: 'No frontmatter in entity file' }, { status: 500 });
    src = next;
  }
  fs.writeFileSync(file, src);

  patchCompiled(id, position, height);

  return NextResponse.json({
    success: true,
    id,
    position: position ?? null,
    height: height ?? null,
  });
}
