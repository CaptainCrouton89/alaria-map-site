import type { MapConfig } from '@/types/location';

export const TILES_BASE_URL = 'https://pub-2f7d72a936214040b067e1f9ffc82e63.r2.dev/tiles';

export async function fetchTileConfig(): Promise<MapConfig> {
  const res = await fetch(`${TILES_BASE_URL}/config.json`);
  if (!res.ok) {
    throw new Error('Tiles not found on R2. Upload tiles to the alaria bucket.');
  }
  return res.json();
}
