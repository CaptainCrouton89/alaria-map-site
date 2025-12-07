#!/usr/bin/env npx tsx

import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import os from 'os';
import pLimit from 'p-limit';

// Aggressive parallelism - 4x CPU cores
const CONCURRENCY = os.cpus().length * 4;
sharp.concurrency(0); // Let sharp use all available cores internally
sharp.cache({ files: 0, memory: 512 }); // Limit memory cache

interface TileConfig {
  inputImage: string;
  outputDir: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
}

async function generateTiles(config: TileConfig): Promise<void> {
  const { inputImage, outputDir, tileSize, minZoom, maxZoom } = config;

  if (!existsSync(inputImage)) {
    throw new Error(`Input image not found: ${inputImage}`);
  }

  const metadata = await sharp(inputImage, { limitInputPixels: false }).metadata();
  const { width, height } = metadata;

  if (!width || !height) {
    throw new Error('Could not read image dimensions');
  }

  console.log(`Input image: ${width}x${height}`);
  console.log(`Tile size: ${tileSize}px`);
  console.log(`Zoom levels: ${minZoom} to ${maxZoom}`);
  console.log(`Concurrency: ${CONCURRENCY} parallel operations`);

  const tempDir = join(outputDir, '.temp');
  mkdirSync(tempDir, { recursive: true });

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const zoomDir = join(outputDir, String(zoom));

    // Skip if already complete
    if (existsSync(zoomDir)) {
      console.log(`\nSkipping zoom level ${zoom} (already exists)`);
      continue;
    }

    console.log(`\nGenerating zoom level ${zoom}...`);

    const scale = Math.pow(2, zoom - maxZoom);
    const scaledWidth = Math.ceil(width * scale);
    const scaledHeight = Math.ceil(height * scale);

    console.log(`  Scaled dimensions: ${scaledWidth}x${scaledHeight}`);

    const tilesX = Math.ceil(scaledWidth / tileSize);
    const tilesY = Math.ceil(scaledHeight / tileSize);
    const totalTiles = tilesX * tilesY;

    console.log(`  Tiles: ${tilesX}x${tilesY} = ${totalTiles} tiles`);

    mkdirSync(zoomDir, { recursive: true });

    // Save scaled version to disk
    const scaledPath = join(tempDir, `zoom-${zoom}.png`);
    console.log(`  Creating scaled image...`);

    await sharp(inputImage, { limitInputPixels: false })
      .resize(scaledWidth, scaledHeight, {
        fit: 'fill',
        kernel: 'lanczos3',
      })
      .png()
      .toFile(scaledPath);

    console.log(`  Extracting tiles...`);

    // Create all directories first
    for (let x = 0; x < tilesX; x++) {
      mkdirSync(join(zoomDir, String(x)), { recursive: true });
    }

    // Use p-limit for controlled concurrency
    const limit = pLimit(CONCURRENCY);
    let processed = 0;
    const startTime = Date.now();

    // Build all promises
    const promises: Promise<void>[] = [];

    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const left = x * tileSize;
        const top = y * tileSize;
        const tileWidth = Math.min(tileSize, scaledWidth - left);
        const tileHeight = Math.min(tileSize, scaledHeight - top);

        if (tileWidth <= 0 || tileHeight <= 0) continue;

        const tilePath = join(zoomDir, String(x), `${y}.png`);

        promises.push(
          limit(async () => {
            let tile = sharp(scaledPath, { limitInputPixels: false }).extract({
              left,
              top,
              width: tileWidth,
              height: tileHeight,
            });

            if (tileWidth < tileSize || tileHeight < tileSize) {
              tile = tile.extend({
                top: 0,
                bottom: tileSize - tileHeight,
                left: 0,
                right: tileSize - tileWidth,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
              });
            }

            await tile.png({ compressionLevel: 6 }).toFile(tilePath);

            processed++;
            if (processed % 100 === 0 || processed === totalTiles) {
              const elapsed = (Date.now() - startTime) / 1000;
              const rate = processed / elapsed;
              const remaining = (totalTiles - processed) / rate;
              process.stdout.write(
                `\r  Progress: ${processed}/${totalTiles} (${Math.round((processed / totalTiles) * 100)}%) - ${rate.toFixed(1)} tiles/sec - ~${Math.round(remaining)}s remaining   `
              );
            }
          })
        );
      }
    }

    // Wait for all tiles to complete
    await Promise.all(promises);

    console.log(`\n  Done with zoom level ${zoom}`);

    // Remove temp scaled image
    rmSync(scaledPath);
  }

  // Cleanup temp directory
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }

  // Write config file
  const mapConfig = {
    imageWidth: width,
    imageHeight: height,
    tileSize,
    minZoom,
    maxZoom,
  };

  const configPath = join(outputDir, 'config.json');
  writeFileSync(configPath, JSON.stringify(mapConfig, null, 2));
  console.log(`\nWrote map config to ${configPath}`);
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log(`Usage: npx tsx scripts/generate-tiles.ts <input-image> [output-dir] [tile-size] [min-zoom] [max-zoom]`);
  process.exit(1);
}

const inputImage = args[0];
const outputDir = args.length > 1 ? args[1] : 'public/tiles';
const tileSize = args.length > 2 ? parseInt(args[2], 10) : 256;
const minZoom = args.length > 3 ? parseInt(args[3], 10) : 0;
const maxZoom = args.length > 4 ? parseInt(args[4], 10) : undefined;

if (maxZoom === undefined) {
  sharp(inputImage, { limitInputPixels: false })
    .metadata()
    .then((metadata) => {
      const maxDim = Math.max(metadata.width ?? 1, metadata.height ?? 1);
      const calculatedMaxZoom = Math.ceil(Math.log2(maxDim / tileSize));
      console.log(`Auto-calculated max zoom: ${calculatedMaxZoom}`);
      return generateTiles({ inputImage, outputDir, tileSize, minZoom, maxZoom: calculatedMaxZoom });
    })
    .then(() => console.log('\nTile generation complete!'))
    .catch((err) => { console.error('Error:', err); process.exit(1); });
} else {
  generateTiles({ inputImage, outputDir, tileSize, minZoom, maxZoom })
    .then(() => console.log('\nTile generation complete!'))
    .catch((err) => { console.error('Error:', err); process.exit(1); });
}
