'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Sparkles, Swords, Bug, Gem, Scroll, type LucideIcon } from 'lucide-react';

interface Category {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
}

// Sample categories - in production, this would come from a compiled JSON file
const SAMPLE_CATEGORIES: Category[] = [
  {
    name: 'Geography & Places',
    slug: 'geography',
    icon: Globe,
    description: 'Continents, nations, cities, and landmarks across Alaria',
  },
  {
    name: 'Deities & Religion',
    slug: 'deities',
    icon: Sparkles,
    description: 'Gods, goddesses, and the faiths that worship them',
  },
  {
    name: 'Factions & Organizations',
    slug: 'factions',
    icon: Swords,
    description: 'Guilds, orders, and political powers that shape the world',
  },
  {
    name: 'Creatures & Beings',
    slug: 'creatures',
    icon: Bug,
    description: 'Monsters, beasts, and supernatural entities',
  },
  {
    name: 'Artifacts & Relics',
    slug: 'artifacts',
    icon: Gem,
    description: 'Magical items, legendary weapons, and ancient treasures',
  },
  {
    name: 'History & Events',
    slug: 'history',
    icon: Scroll,
    description: 'Wars, treaties, and pivotal moments that shaped Alaria',
  },
];

export default function CodexPage() {
  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <div className="border-b border-border bg-parchment-dark">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl font-semibold text-ink mb-4">
            The Codex of Alaria
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            A comprehensive archive of lore, legends, and knowledge from across the realm.
            Choose a category to begin your exploration.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/codex/category/${category.slug}`}
              className="group"
            >
              <div
                className="
                  h-full p-6
                  bg-parchment-light border-2 border-border
                  hover:border-gold hover:shadow-lg
                  transition-all duration-200
                  flex flex-col gap-3
                "
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-3">
                  <category.icon className="w-10 h-10 text-gold" aria-label={category.name} />
                  <h2 className="font-display text-2xl font-semibold text-ink group-hover:text-gold transition-colors">
                    {category.name}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-ink-muted leading-relaxed">
                  {category.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-auto pt-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-display">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
