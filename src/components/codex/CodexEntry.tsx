'use client';

import { useState, useEffect, useRef } from 'react';
import type { CodexEntry as CodexEntryType } from '@/types/codex';
import { calculateEntryWeight } from '@/lib/entry-weight';
import { determineAtmosphere, getAtmosphereStyle } from '@/lib/atmosphere';
import { LegendaryEntry } from './LegendaryEntry';
import { MajorEntry } from './MajorEntry';
import { StandardEntry } from './StandardEntry';
import { MinorEntry } from './MinorEntry';
import { FootnoteEntry } from './FootnoteEntry';

interface CodexEntryProps {
  entry: CodexEntryType;
}

/**
 * CodexEntry - Dispatcher component with progressive revelation
 * Determines entry weight and atmosphere, applies appropriate styling
 */
export function CodexEntry({ entry }: CodexEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const weight = calculateEntryWeight(entry);
  const atmosphere = determineAtmosphere(entry.tags);
  const atmosphereStyle = getAtmosphereStyle(atmosphere);

  // Intersection Observer for scroll-based reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.3, // Trigger at 30% visibility
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Determine if content should be collapsible (longer entries)
  const isLongContent = entry.content.split('\n').length > 8;
  const shouldCollapse = isLongContent && !isExpanded;

  // Select appropriate entry component based on weight
  const EntryComponent = (() => {
    switch (weight) {
      case 'legendary':
        return LegendaryEntry;
      case 'major':
        return MajorEntry;
      case 'standard':
        return StandardEntry;
      case 'minor':
        return MinorEntry;
      case 'footnote':
        return FootnoteEntry;
      default:
        return StandardEntry;
    }
  })();

  return (
    <div
      ref={containerRef}
      className={`
        relative overflow-hidden
        ${shouldCollapse ? 'reveal-collapsed' : 'reveal-expanded'}
        ${isInView ? 'opacity-100' : 'opacity-80'}
        transition-opacity duration-500
      `}
      style={{
        backgroundColor: atmosphereStyle.tint,
        transitionProperty: 'background-color, opacity',
        transitionDuration: '600ms',
        transitionTimingFunction: 'ease',
      }}
    >
      <EntryComponent entry={entry} />

      {/* Progressive revelation gradient overlay */}
      {shouldCollapse && (
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent, ${atmosphereStyle.tint})`,
          }}
        />
      )}

      {/* Continue reading button */}
      {shouldCollapse && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-auto">
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 bg-parchment-dark hover:bg-gold/20 border border-border text-ink text-sm font-display transition-colors"
          >
            Continue reading...
          </button>
        </div>
      )}
    </div>
  );
}
