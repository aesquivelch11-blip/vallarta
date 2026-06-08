# Lookbook Property Selector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the rigid, identical property grid into a high-end, editorial lookbook layout with staggered sizing, elegant typography, and refined status indicators, adhering strictly to the DESIGN.md "Luxury Villa Overseer" ethos.

**Architecture:** We will replace `PropertyCard.tsx` with a new `EditorialPropertyItem.tsx` that supports asymmetrical layouts. `PropertySelector.tsx` will switch from a standard CSS grid to a flexible editorial stack, breaking the repetitive card mold. Filters will be redesigned to be minimalist and borderless.

**Tech Stack:** React, TailwindCSS, Motion (Framer Motion)

---

### Task 1: Create EditorialPropertyItem Component

**Files:**
- Create: `src/components/PropertySelector/EditorialPropertyItem.tsx`

- [ ] **Step 1: Write the new component structure**

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';

interface EditorialPropertyItemProps {
  property: Property;
  index: number;
  onSelect: (propertyId: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

const STATUS_COLORS: Record<string, string> = {
  available: '#4ade80',
  occupied: '#fbbf24',
  maintenance: '#94a3b8',
  reserved: '#60a5fa',
};

export default function EditorialPropertyItem({ property, index, onSelect }: EditorialPropertyItemProps) {
  const isEven = index % 2 === 0;
  const statusColor = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  return (
    <motion.div
      className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center w-full my-24 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Container */}
      <div 
        className="w-full md:w-[60%] relative overflow-hidden cursor-pointer group"
        onClick={() => onSelect(property.id)}
      >
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <picture>
            <source srcSet={property.imageWebp} type="image/webp" />
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
          </picture>
        </div>
      </div>

      {/* Text Content */}
      <div className="w-full md:w-[40%] flex flex-col items-start px-4 md:px-0">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: statusColor }}
            aria-hidden="true"
          />
          <span
            className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))]"
            style={{ fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.20em' }}
          >
            {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
          </span>
        </div>
        
        <h2
          className="font-serif text-[var(--color-ink, #F5F1E8)] mb-2 cursor-pointer transition-opacity hover:opacity-80"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1 }}
          onClick={() => onSelect(property.id)}
        >
          {property.name}
        </h2>
        
        <span
          className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))] mb-12"
          style={{ fontSize: '0.6875rem', letterSpacing: '0.30em' }}
        >
          {property.location}
        </span>

        <div className="flex flex-col gap-1">
          <span
            className="font-sans text-[var(--color-ink-secondary, rgba(201,184,160,0.6))]"
            style={{ fontSize: '0.625rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            YTD Revenue
          </span>
          <span
            className="font-serif text-[var(--color-ink, #F5F1E8)]"
            style={{ fontSize: '1.75rem' }}
          >
            {property.metrics?.revenue ?? '—'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/EditorialPropertyItem.tsx
git commit -m "feat(PropertySelector): add EditorialPropertyItem component for lookbook layout"
```

---

### Task 2: Redesign PropertyFilters

**Files:**
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

- [ ] **Step 1: Simplify filter UI into a minimalist inline row**

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { OccupancyStatus } from '../../types';

interface PropertyFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeStatus: OccupancyStatus | 'all';
  onStatusChange: (status: OccupancyStatus | 'all') => void;
}

const STATUS_OPTIONS: { value: OccupancyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

export default function PropertyFilters({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
}: PropertyFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 w-full max-w-7xl mx-auto border-b border-[var(--color-border-subtle,rgba(255,255,255,0.06))] pb-6">
      
      {/* Search */}
      <div className="relative w-full md:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search properties..."
          className="w-full bg-transparent text-[var(--color-ink, #F5F1E8)] placeholder:text-[var(--color-ink-secondary, rgba(201,184,160,0.3))] font-sans outline-none pb-2 border-b border-transparent focus:border-[var(--color-ink-secondary, rgba(201,184,160,0.3))] transition-colors"
          style={{
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
          }}
          aria-label="Search properties by name"
        />
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 -mt-1 pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: 'var(--color-ink-secondary, rgba(201,184,160,0.4))' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const isActive = activeStatus === value;
          return (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className="cursor-pointer font-sans uppercase relative shrink-0"
              style={{
                fontSize: '0.625rem',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.20em',
                color: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
                transition: 'color 0.3s ease',
              }}
              aria-pressed={isActive}
            >
              {label}
              {isActive && (
                <motion.div 
                  layoutId="activeFilter"
                  className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[var(--color-ink,#F5F1E8)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertyFilters.tsx
git commit -m "style(PropertySelector): redesign filters to be minimal inline text links"
```

---

### Task 3: Overhaul PropertySelector Layout

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`
- Modify: `src/components/PropertySelector/PropertyCard.tsx` (delete)

- [ ] **Step 1: Replace grid with a vertical editorial stack**

```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import EditorialPropertyItem from './EditorialPropertyItem';
import PropertyFilters from './PropertyFilters';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onNavigate, onSelectProperty, onNotify }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property) => {
      const matchesSearch =
        searchQuery === '' ||
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeStatus === 'all' || property.occupancyStatus === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeStatus]);

  const handleSelect = useCallback(
    (propertyId: string) => {
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );

  const liveAnnouncement = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} shown`;

  return (
    <div
      className="w-full min-h-[100dvh] relative overflow-y-auto"
      style={{ background: 'var(--color-canvas, #0c0c0c)' }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Header */}
      <header
        className="pt-16 pb-12 px-8 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
      >
        <h1
          className="font-serif italic"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1,
            color: 'var(--color-ink, #F5F1E8)',
          }}
        >
          Portfolio
        </h1>
        <span
          className="font-sans uppercase mb-2"
          style={{
            fontSize: '0.625rem',
            letterSpacing: '0.20em',
            color: 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
          }}
        >
          {filteredProperties.length} of {sampleProperties.length} Properties
        </span>
      </header>

      {/* Filters */}
      <div className="px-8 md:px-16 max-w-7xl mx-auto mb-16">
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {/* Lookbook Stack */}
      <div className="px-8 md:px-16 max-w-7xl mx-auto pb-32">
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, i) => (
              <EditorialPropertyItem 
                key={property.id} 
                property={property} 
                index={i} 
                onSelect={handleSelect} 
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProperties.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="font-sans text-center uppercase"
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-ink-secondary, rgba(201,184,160,0.4))',
                letterSpacing: '0.15em',
              }}
            >
              No properties match your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveStatus('all');
              }}
              className="mt-6 font-sans uppercase cursor-pointer transition-opacity hover:opacity-70"
              style={{
                fontSize: '0.5625rem',
                fontWeight: 500,
                letterSpacing: '0.20em',
                color: 'var(--color-ink, #F5F1E8)',
                background: 'none',
                border: 'none',
                padding: '8px 0',
                borderBottom: '1px solid var(--color-ink, #F5F1E8)',
              }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit and Cleanup**

```bash
rm src/components/PropertySelector/PropertyCard.tsx
git add src/components/PropertySelector/PropertySelector.tsx src/components/PropertySelector/PropertyCard.tsx
git commit -m "feat(PropertySelector): replace grid with editorial lookbook stack"
```
