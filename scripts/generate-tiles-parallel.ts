#!/usr/bin/env npx tsx

// Main orchestrator - spawns multiple worker processes
import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import os from 'os';

const NUM_WORKERS = Math.min(os.cpus().length, 8); // Cap at 8 workers

interface TileConfig {
  inputImage: string;
  outputDir: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
}

function spawnWorker(
  scaledPath: string,
  zoomDir: string,
  startX: number,
  endX: number,
  tilesY: number,
  tileSize: number,
  scaledWidth: number,
  scaledHeight: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const worker = spawn('npx', [
      'tsx',
      'scripts/generate-tiles-chunk.ts',
      scaledPath,
      zoomDir,
      String(startX),
      String(endX),
      String(tilesY),
      String(tileSize),
      String(scaledWidth),
      String(scaledHeight),
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: process.cwd(),
    });

    worker.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    worker.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    worker.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Worker ${startX}-${endX} exited with code ${code}`));
      }
    });
  });
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
  console.log(`Workers: ${NUM_WORKERS} parallel processes`);

  const tempDir = join(outputDir, '.temp');
  mkdirSync(tempDir, { recursive: true });

  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    const zoomDir = join(outputDir, String(zoom));

    if (existsSync(zoomDir)) {
      console.log(`\nSkipping zoom level ${zoom} (already exists)`);
      continue;
    }

    console.log(`\nGenerating zoom level ${zoom}...`);

    const scale = Math.pow(2, zoom - maxZoom);
    const scaledWidth = Math.ceil(width * scale);
    const scaledHeight = Math.ceil(height * scale);

    const tilesX = Math.ceil(scaledWidth / tileSize);
    const tilesY = Math.ceil(scaledHeight / tileSize);

    console.log(`  Dimensions: ${scaledWidth}x${scaledHeight}, Tiles: ${tilesX}x${tilesY} = ${tilesX * tilesY}`);

    mkdirSync(zoomDir, { recursive: true });

    const scaledPath = join(tempDir, `zoom-${zoom}.png`);
    console.log(`  Creating scaled image...`);

    await sharp(inputImage, { limitInputPixels: false })
      .resize(scaledWidth, scaledHeight, { fit: 'fill', kernel: 'lanczos3' })
      .png()
      .toFile(scaledPath);

    console.log(`  Spawning ${NUM_WORKERS} workers...`);
    const startTime = Date.now();

    // Divide X columns among workers
    const colsPerWorker = Math.ceil(tilesX / NUM_WORKERS);
    const workerPromises: Promise<void>[] = [];

    for (let i = 0; i < NUM_WORKERS; i++) {
      const startX = i * colsPerWorker;
      const endX = Math.min((i + 1) * colsPerWorker, tilesX);

      if (startX >= tilesX) break;

      workerPromises.push(
        spawnWorker(scaledPath, zoomDir, startX, endX, tilesY, tileSize, scaledWidth, scaledHeight)
      );
    }

    await Promise.all(workerPromises);

    const elapsed = (Date.now() - startTime) / 1000;
    console.log(`  Done with zoom level ${zoom} in ${elapsed.toFixed(1)}s`);

    rmSync(scaledPath);
  }

  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }

  const mapConfig = { imageWidth: width, imageHeight: height, tileSize, minZoom, maxZoom };
  writeFileSync(join(outputDir, 'config.json'), JSON.stringify(mapConfig, null, 2));
  console.log(`\nWrote config.json`);
}

// CLI
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log(`Usage: npx tsx scripts/generate-tiles-parallel.ts <input-image> [output-dir] [tile-size] [min-zoom] [max-zoom]`);
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
    .then((m) => {
      const calc = Math.ceil(Math.log2(Math.max(m.width ?? 1, m.height ?? 1) / tileSize));
      return generateTiles({ inputImage, outputDir, tileSize, minZoom, maxZoom: calc });
    })
    .then(() => console.log('\nComplete!'))
    .catch((e) => { console.error(e); process.exit(1); });
} else {
  generateTiles({ inputImage, outputDir, tileSize, minZoom, maxZoom })
    .then(() => console.log('\nComplete!'))
    .catch((e) => { console.error(e); process.exit(1); });
}
