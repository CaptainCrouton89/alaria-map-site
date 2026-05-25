import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { isAdmin } from '@/lib/admin';
import type { ManualPin, ManualPinsFile } from '@/types/pinning';
import type { LocationType } from '@/types/location';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const MANUAL_PINS_PATH = path.join(DATA_DIR, 'manual-pins.json');

function loadManualPins(): ManualPinsFile {
  if (!fs.existsSync(MANUAL_PINS_PATH)) {
    return { version: 1, pins: [] };
  }
  const content = fs.readFileSync(MANUAL_PINS_PATH, 'utf-8');
  const parsed = JSON.parse(content) as Partial<ManualPinsFile>;
  return { version: 1, pins: Array.isArray(parsed.pins) ? parsed.pins : [] };
}

function saveManualPins(file: ManualPinsFile): void {
  fs.writeFileSync(MANUAL_PINS_PATH, JSON.stringify(file, null, 2));
}

// GET: list all manual pins (most recent first)
export async function GET() {
  const file = loadManualPins();
  const pins = [...file.pins].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ pins });
}

// POST: create a manual pin { name, coordinates, zoomLevel, type? }
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json();
  const { name, coordinates, zoomLevel, type } = body as {
    name?: string;
    coordinates?: [number, number];
    zoomLevel?: number;
    type?: LocationType;
  };

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  }
  if (!coordinates || coordinates.length !== 2) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  // Free-form pins are uncategorized by default; the pinner re-types them later.
  const resolvedType: LocationType = type ? type : 'uncategorized';
  // Clamp zoom into the valid 1-5 band, defaulting to mid (3) when unset.
  const resolvedZoom =
    typeof zoomLevel === 'number' ? Math.max(1, Math.min(5, Math.round(zoomLevel))) : 3;

  const file = loadManualPins();
  const pin: ManualPin = {
    id: `manual-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    type: resolvedType,
    coordinates,
    zoomLevel: resolvedZoom,
    createdAt: new Date().toISOString(),
  };
  file.pins.push(pin);
  saveManualPins(file);

  return NextResponse.json({ success: true, pin });
}

// PATCH: update an existing manual pin { id, type?, name?, zoomLevel? }
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json();
  const { id, type, name, zoomLevel } = body as {
    id?: string;
    type?: LocationType;
    name?: string;
    zoomLevel?: number;
  };

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const file = loadManualPins();
  const pin = file.pins.find((p) => p.id === id);
  if (!pin) {
    return NextResponse.json({ error: `Pin not found: ${id}` }, { status: 404 });
  }

  if (type) pin.type = type;
  if (typeof name === 'string' && name.trim()) pin.name = name.trim();
  if (typeof zoomLevel === 'number') {
    pin.zoomLevel = Math.max(1, Math.min(5, Math.round(zoomLevel)));
  }
  saveManualPins(file);

  return NextResponse.json({ success: true, pin });
}

// DELETE: remove a manual pin by ?id=
export async function DELETE(request: NextRequest) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const file = loadManualPins();
  const before = file.pins.length;
  file.pins = file.pins.filter((p) => p.id !== id);
  if (file.pins.length === before) {
    return NextResponse.json({ error: `Pin not found: ${id}` }, { status: 404 });
  }
  saveManualPins(file);
  return NextResponse.json({ success: true });
}
