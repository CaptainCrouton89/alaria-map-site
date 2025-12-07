import type { CodexEntry, Category } from '@/types/codex';

export interface JourneyLink {
  text: string;
  href: string;
  isEntry: boolean;
}

/**
 * Generate narrative journey text for an entry's breadcrumb navigation.
 * Uses tag-based templates to create contextual, prose-style navigation.
 */
export function generateJourneyText(
  entry: CodexEntry,
  category: Category,
  parentLocation?: CodexEntry
): string {
  const { name, tags } = entry;
  const categoryName = category.name;

  // State/nation template
  if (tags.includes('state') || tags.includes('kingdom') || tags.includes('empire')) {
    if (parentLocation) {
      return `You are reading about ${name}, a nation in ${parentLocation.name}, in the annals of ${categoryName}`;
    }
    return `You are reading about ${name}, a nation, in the annals of ${categoryName}`;
  }

  // God/deity template
  if (tags.includes('god') || tags.includes('divine')) {
    return `You are reading about ${name}, a deity, in the ${categoryName}`;
  }

  // Dragon template
  if (tags.includes('dragon')) {
    return `You are reading about ${name}, a dragon, chronicled in the ${categoryName}`;
  }

  // Faction/organization template
  if (tags.includes('faction') || tags.includes('organization')) {
    return `You are reading about ${name}, an organization, in the ${categoryName}`;
  }

  // NPC/character template
  if (tags.includes('npc') || tags.includes('character')) {
    if (parentLocation) {
      return `You are reading about ${name}, a person of ${parentLocation.name}, in the ${categoryName}`;
    }
    return `You are reading about ${name}, a person, in the ${categoryName}`;
  }

  // Artifact/item template
  if (tags.includes('artifact') || tags.includes('item')) {
    return `You are reading about ${name}, an artifact, in the ${categoryName}`;
  }

  // Event template
  if (tags.includes('event') || tags.includes('historical')) {
    return `You are reading about ${name}, an event, in the ${categoryName}`;
  }

  // Location template (city, settlement, poi, etc.)
  if (
    tags.includes('city') ||
    tags.includes('capital') ||
    tags.includes('settlement') ||
    tags.includes('poi')
  ) {
    if (parentLocation) {
      return `You are reading about ${name}, a place in ${parentLocation.name}, in the ${categoryName}`;
    }
    return `You are reading about ${name}, a place, in the ${categoryName}`;
  }

  // Default template
  if (parentLocation) {
    return `You are reading about ${name} in ${parentLocation.name}, in the ${categoryName}`;
  }
  return `You are reading about ${name} in the ${categoryName}`;
}

/**
 * Extract navigable links from the journey text.
 * Returns structured links for rendering with proper hrefs.
 */
export function extractNavigableLinks(
  entry: CodexEntry,
  category: Category,
  parentLocation?: CodexEntry
): JourneyLink[] {
  const links: JourneyLink[] = [];

  // Add parent location link if present
  if (parentLocation) {
    links.push({
      text: parentLocation.name,
      href: `/codex/${parentLocation.id}`,
      isEntry: true,
    });
  }

  // Add category link
  links.push({
    text: category.name,
    href: `/codex/category/${category.slug}`,
    isEntry: false,
  });

  return links;
}
