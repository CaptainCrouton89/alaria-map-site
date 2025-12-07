import {
  Map,
  Castle,
  Home,
  Shield,
  Columns,
  TreePine,
  Waves,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import type { LocationType } from '@/types/location';

// Icon mappings for location types (React components)
export const LOCATION_ICONS: Record<LocationType, LucideIcon> = {
  region: Map,
  city: Castle,
  town: Home,
  fortress: Shield,
  ruins: Columns,
  wilderness: TreePine,
  water: Waves,
  poi: MapPin,
};

// SVG strings for use in Leaflet markers (inline SVG for divIcon)
export function getLocationIconSvgV2(type: LocationType, color: string): string {
  // Using actual Lucide icon paths at 24x24 viewBox
  const paths: Record<LocationType, string> = {
    region: `<path d="M14.106 5.553a2 2 0 0 0 1.788-2.916C14.108.284 12.054 0 9.945 0H6.055C3.946 0 1.892.284.106 2.637a2 2 0 0 0 1.788 2.916c.893 0 1.767-.4 2.342-1.133C5.011 5.427 6 6 8 6s2.989-.573 3.764-1.58a3.19 3.19 0 0 0 2.342 1.133ZM12 8H4v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8Z"/>`,
    city: `<path d="M22 20v-9H2v9"/><path d="M6 12v-2"/><path d="M10 12v-2"/><path d="M14 12v-2"/><path d="M18 12v-2"/><path d="M5 8V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/>`,
    town: `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 21h18"/><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>`,
    fortress: `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>`,
    ruins: `<line x1="6" x2="6" y1="3" y2="15"/><circle cx="6" cy="17" r="2"/><circle cx="6" cy="1" r="1"/><path d="M18 3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2"/><circle cx="18" cy="18" r="2"/><path d="M12 3v9"/><circle cx="12" cy="14" r="2"/>`,
    wilderness: `<path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"/><path d="M12 22v-3"/>`,
    water: `<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>`,
    poi: `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[type]}</svg>`;
}
