#!/usr/bin/env npx tsx

// Worker script - generates a specific range of X columns for a zoom level
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

sharp.cache(false);

const [, , scaledPath, zoomDir, startX, endX, tilesY, tileSize, scaledWidth, scaledHeight] = process.argv;

const start = parseInt(startX, 10);
const end = parseInt(endX, 10);
const yCount = parseInt(tilesY, 10);
const size = parseInt(tileSize, 10);
const sWidth = parseInt(scaledWidth, 10);
const sHeight = parseInt(scaledHeight, 10);

async function processChunk() {
  let processed = 0;
  const total = (end - start) * yCount;

  for (let x = start; x < end; x++) {
    const xDir = join(zoomDir, String(x));
    mkdirSync(xDir, { recursive: true });

    for (let y = 0; y < yCount; y++) {
      const left = x * size;
      const top = y * size;
      const tileWidth = Math.min(size, sWidth - left);
      const tileHeight = Math.min(size, sHeight - top);

      if (tileWidth <= 0 || tileHeight <= 0) continue;

      const tilePath = join(xDir, `${y}.png`);

      let tile = sharp(scaledPath, { limitInputPixels: false }).extract({
        left,
        top,
        width: tileWidth,
        height: tileHeight,
      });

      if (tileWidth < size || tileHeight < size) {
        tile = tile.extend({
          top: 0,
          bottom: size - tileHeight,
          left: 0,
          right: size - tileWidth,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        });
      }

      await tile.png({ compressionLevel: 6 }).toFile(tilePath);
      processed++;
    }

    // Report progress per column
    console.log(`Worker ${start}-${end}: column ${x} done (${processed}/${total})`);
  }

  console.log(`Worker ${start}-${end}: COMPLETE`);
}

processChunk().catch((err) => {
  console.error(`Worker ${start}-${end} error:`, err);
  process.exit(1);
});
