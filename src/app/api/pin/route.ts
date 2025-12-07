import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import type { WorkQueue, PinnedData, PinnedLocation } from '@/types/pinning';
import type { LocationType } from '@/types/location';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const WORK_QUEUE_PATH = path.join(DATA_DIR, 'work-queue.json');
const PINNED_PATH = path.join(DATA_DIR, 'pinned.json');

function loadWorkQueue(): WorkQueue {
  const content = fs.readFileSync(WORK_QUEUE_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveWorkQueue(queue: WorkQueue): void {
  fs.writeFileSync(WORK_QUEUE_PATH, JSON.stringify(queue, null, 2));
}

function loadPinned(): PinnedData {
  const content = fs.readFileSync(PINNED_PATH, 'utf-8');
  return JSON.parse(content);
}

function savePinned(pinned: PinnedData): void {
  fs.writeFileSync(PINNED_PATH, JSON.stringify(pinned, null, 2));
}

// GET: Fetch current state
export async function GET() {
  const queue = loadWorkQueue();
  const pinned = loadPinned();

  // Find next pending entry
  let currentEntry = null;
  let currentIndex = -1;
  for (let i = 0; i < queue.entries.length; i++) {
    if (queue.entries[i].status === 'pending') {
      currentEntry = queue.entries[i];
      currentIndex = i;
      break;
    }
  }

  const stats = {
    total: queue.entries.length,
    pending: queue.entries.filter(e => e.status === 'pending').length,
    pinned: queue.entries.filter(e => e.status === 'pinned').length,
    skipped: queue.entries.filter(e => e.status === 'skipped').length,
  };

  return NextResponse.json({
    currentEntry,
    currentIndex,
    stats,
    pinnedData: pinned,
  });
}

// POST: Pin a location or skip it
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, action, coordinates, zoomLevel, type } = body as {
    id: string;
    action: 'pin' | 'skip';
    coordinates?: [number, number];
    zoomLevel?: number;
    type?: LocationType;
  };

  const queue = loadWorkQueue();
  const pinned = loadPinned();

  // Find the entry
  const entryIndex = queue.entries.findIndex(e => e.id === id);
  if (entryIndex === -1) {
    return NextResponse.json({ error: `Entry not found: ${id}` }, { status: 404 });
  }

  const entry = queue.entries[entryIndex];

  if (action === 'pin') {
    if (!coordinates || zoomLevel === undefined || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: coordinates, zoomLevel, type' },
        { status: 400 }
      );
    }

    // Save pinned location
    const pinnedLocation: PinnedLocation = {
      coordinates,
      zoomLevel,
      type,
      pinnedAt: new Date().toISOString(),
    };
    pinned[id] = pinnedLocation;
    entry.status = 'pinned';
  } else if (action === 'skip') {
    entry.status = 'skipped';
  }

  // Save both files
  saveWorkQueue(queue);
  savePinned(pinned);

  // Find next pending entry
  let nextEntry = null;
  let nextIndex = -1;
  for (let i = 0; i < queue.entries.length; i++) {
    if (queue.entries[i].status === 'pending') {
      nextEntry = queue.entries[i];
      nextIndex = i;
      break;
    }
  }

  const stats = {
    total: queue.entries.length,
    pending: queue.entries.filter(e => e.status === 'pending').length,
    pinned: queue.entries.filter(e => e.status === 'pinned').length,
    skipped: queue.entries.filter(e => e.status === 'skipped').length,
  };

  return NextResponse.json({
    success: true,
    currentEntry: nextEntry,
    currentIndex: nextIndex,
    stats,
  });
}

// PUT: Jump to a specific entry (for navigation)
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { action, sourceFile, fromIndex } = body as {
    action: 'jump' | 'jumpToFile' | 'back';
    sourceFile?: string;
    fromIndex?: number;
  };

  const queue = loadWorkQueue();
  const pinned = loadPinned();

  if (action === 'jumpToFile' && sourceFile) {
    // Find first pending entry in that file
    for (let i = 0; i < queue.entries.length; i++) {
      if (queue.entries[i].sourceFile === sourceFile && queue.entries[i].status === 'pending') {
        return NextResponse.json({
          currentEntry: queue.entries[i],
          currentIndex: i,
        });
      }
    }
    return NextResponse.json({ error: `No pending entries in ${sourceFile}` }, { status: 404 });
  }

  if (action === 'back' && fromIndex !== undefined && fromIndex > 0) {
    // Find the previous non-pending entry and revert it
    for (let i = fromIndex - 1; i >= 0; i--) {
      const entry = queue.entries[i];
      if (entry.status === 'pinned' || entry.status === 'skipped') {
        // Revert this entry to pending
        const previousStatus = entry.status;
        entry.status = 'pending';

        // If it was pinned, remove from pinned data
        if (previousStatus === 'pinned' && pinned[entry.id]) {
          delete pinned[entry.id];
          savePinned(pinned);
        }

        saveWorkQueue(queue);

        const stats = {
          total: queue.entries.length,
          pending: queue.entries.filter(e => e.status === 'pending').length,
          pinned: queue.entries.filter(e => e.status === 'pinned').length,
          skipped: queue.entries.filter(e => e.status === 'skipped').length,
        };

        return NextResponse.json({
          currentEntry: entry,
          currentIndex: i,
          stats,
          pinnedData: pinned,
        });
      }
    }
    return NextResponse.json({ error: 'No previous entry to go back to' }, { status: 404 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
