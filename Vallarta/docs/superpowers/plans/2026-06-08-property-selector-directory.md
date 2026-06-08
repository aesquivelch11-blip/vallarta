# Property Selector Directory Grid

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the cinematic slideshow property selector with a directory-style grid of cards, adding search and occupancy status filters, and removing the mandatory overlay step. Reduces flow from 5 interactions to 2 (open menu → click card).

**Architecture:** Rewrite `PropertySelector.tsx` as a responsive grid with search/filter controls. Delete the overlay (`PropertyContent.tsx`), slideshow components (`DiagonalSlide.tsx`, `SlideshowPagination.tsx`). Add `occupancyStatus` field to the `Property` type for filtering.

**Tech Stack:** React, TypeScript, Tailwind CSS, Framer Motion (motion/react)

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/types.ts` | Add `OccupancyStatus` type, update `Property` interface |
| Modify | `src/components/PropertySelector/propertyData.ts` | Add `occupancyStatus` to sample data |
| Rewrite | `src/components/PropertySelector/PropertySelector.tsx` | Directory grid with search/filter |
| Create | `src/components/PropertySelector/PropertyCard.tsx` | Individual property card component |
| Create | `src/components/PropertySelector/PropertyFilters.tsx` | Search bar + occupancy status filter |
| Delete | `src/components/PropertySelector/PropertyContent.tsx` | Remove overlay (no longer needed) |
| Delete | `src/components/PropertySelector/DiagonalSlide.tsx` | Remove slideshow card (replaced by PropertyCard) |
| Delete | `src/components/PropertySelector/SlideshowPagination.tsx` | Remove pagination dots (grid has no pagination) |

---

## Task 1: Update Property Type

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add OccupancyStatus type and update Property interface**

```typescript
// src/types.ts
export type OccupancyStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface Property {
  id: string;
  name: string;
  location: string;
  tagline: string;
  imageUrl: string;
  imageWebp?: string;
  images?: string[];
  occupancyStatus: OccupancyStatus;
  metrics?: {
    bedrooms: number;
    occupancy: string;
    revenue: string;
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `rtk npx tsc --noEmit`
Expected: No errors (other files using Property may need updates in later tasks)

- [ ] **Step 3: Commit**

```bash
rtk git add src/types.ts
rtk git commit -m "feat: add OccupancyStatus type to Property interface"
```

---

## Task 2: Update Sample Property Data

**Files:**
- Modify: `src/components/PropertySelector/propertyData.ts`

- [ ] **Step 1: Add occupancyStatus to each property**

```typescript
// src/components/PropertySelector/propertyData.ts
import { Property } from '../../types';
import propImg1 from '../../assets/Menu/menu-1.webp';
import propImg1Webp from '../../assets/Menu/menu-1.webp';
import propImg2 from '../../assets/Menu/menu-2.webp';
import propImg2Webp from '../../assets/Menu/menu-2.webp';
import propImg3 from '../../assets/Menu/menu-3.webp';
import propImg3Webp from '../../assets/Menu/menu-3.webp';
import propImg4 from '../../assets/Menu/menu-4.webp';
import propImg4Webp from '../../assets/Menu/menu-4.webp';
import propImg5 from '../../assets/Menu/menu-1.webp';
import propImg5Webp from '../../assets/Menu/menu-1.webp';

export const sampleProperties: Property[] = [
  {
    id: 'casa-palmeras',
    name: 'Casa Palmeras',
    location: 'Zona Romántica',
    tagline: 'Oceanfront luxury with private infinity pool',
    imageUrl: propImg1,
    imageWebp: propImg1Webp,
    images: [propImg1, propImg2, propImg3],
    occupancyStatus: 'occupied',
    metrics: { bedrooms: 4, occupancy: '78%', revenue: '$12,400' },
  },
  {
    id: 'villa-luna',
    name: 'Villa Luna',
    location: 'Conchas Chinas',
    tagline: 'Contemporary hillside retreat with panoramic views',
    imageUrl: propImg2,
    imageWebp: propImg2Webp,
    images: [propImg2, propImg3, propImg4],
    occupancyStatus: 'available',
    metrics: { bedrooms: 3, occupancy: '92%', revenue: '$9,800' },
  },
  {
    id: 'casa-sol',
    name: 'Casa del Sol',
    location: 'Marina Vallarta',
    tagline: 'Beachfront estate with private dock',
    imageUrl: propImg3,
    imageWebp: propImg3Webp,
    images: [propImg3, propImg4, propImg1],
    occupancyStatus: 'maintenance',
    metrics: { bedrooms: 5, occupancy: '65%', revenue: '$18,200' },
  },
  {
    id: 'vista-al-mar',
    name: 'Vista al Mar',
    location: 'Punta Mita',
    tagline: 'Cliffside villa with sunset terrace',
    imageUrl: propImg4,
    imageWebp: propImg4Webp,
    images: [propImg4, propImg1, propImg2],
    occupancyStatus: 'reserved',
    metrics: { bedrooms: 6, occupancy: '85%', revenue: '$21,500' },
  },
  {
    id: 'casa-brisa',
    name: 'Casa Brisa',
    location: 'Bucerías',
    tagline: 'Boutique casita steps from the sand',
    imageUrl: propImg5,
    imageWebp: propImg5Webp,
    images: [propImg5, propImg3],
    occupancyStatus: 'available',
    metrics: { bedrooms: 2, occupancy: '71%', revenue: '$6,100' },
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `rtk npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/PropertySelector/propertyData.ts
rtk git commit -m "feat: add occupancyStatus to sample property data"
```

---

## Task 3: Create PropertyCard Component

**Files:**
- Create: `src/components/PropertySelector/PropertyCard.tsx`

- [ ] **Step 1: Create PropertyCard component**

```tsx
// src/components/PropertySelector/PropertyCard.tsx
import React from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  available: { bg: 'rgba(74, 222, 128, 0.12)', text: '#4ade80' },
  occupied: { bg: 'rgba(251, 191, 36, 0.12)', text: '#fbbf24' },
  maintenance: { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8' },
  reserved: { bg: 'rgba(96, 165, 250, 0.12)', text: '#60a5fa' },
};

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  const status = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative flex flex-col w-full text-left cursor-pointer overflow-hidden"
      style={{
        background: 'var(--color-canvas-elevated, #141414)',
        borderRadius: '12px',
        border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`View ${property.name} dashboard`}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </picture>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(20,20,20,0.6) 0%, transparent 50%)',
          }}
        />
        {/* Status badge */}
        <span
          className="absolute top-3 right-3 font-sans uppercase"
          style={{
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            padding: '4px 10px',
            borderRadius: '999px',
            background: status.bg,
            color: status.text,
          }}
        >
          {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-4 py-3">
        <span
          className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))]"
          style={{
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.30em',
          }}
        >
          {property.location}
        </span>
        <h3
          className="font-serif italic leading-tight text-[var(--color-ink, #F5F1E8)]"
          style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)' }}
        >
          {property.name}
        </h3>
        <div className="flex items-baseline gap-3 mt-1">
          <span
            className="font-sans text-[var(--color-ink-secondary, rgba(201,184,160,0.6))]"
            style={{ fontSize: '0.625rem', letterSpacing: '0.10em', textTransform: 'uppercase' }}
          >
            YTD Revenue
          </span>
          <span
            className="font-serif text-[var(--color-ink, #F5F1E8)]"
            style={{ fontSize: '0.875rem' }}
          >
            {property.metrics?.revenue ?? '—'}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `rtk npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/PropertySelector/PropertyCard.tsx
rtk git commit -m "feat: add PropertyCard component for directory grid"
```

---

## Task 4: Create PropertyFilters Component

**Files:**
- Create: `src/components/PropertySelector/PropertyFilters.tsx`

- [ ] **Step 1: Create PropertyFilters component**

```tsx
// src/components/PropertySelector/PropertyFilters.tsx
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
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      {/* Search */}
      <div
        className="relative"
        style={{
          background: 'var(--color-canvas-elevated, #141414)',
          borderRadius: '8px',
          border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))',
        }}
      >
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--color-ink-secondary, rgba(201,184,160,0.4))' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search properties..."
          className="w-full bg-transparent text-[var(--color-ink, #F5F1E8)] placeholder:text-[var(--color-ink-secondary, rgba(201,184,160,0.3))] font-sans outline-none"
          style={{
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
            padding: '12px 16px 12px 40px',
          }}
          aria-label="Search properties by name"
        />
      </div>

      {/* Status filter */}
      <div
        className="flex items-center gap-2 flex-wrap"
        role="group"
        aria-label="Filter by occupancy status"
      >
        {STATUS_OPTIONS.map(({ value, label }) => {
          const isActive = activeStatus === value;
          return (
            <motion.button
              key={value}
              onClick={() => onStatusChange(value)}
              className="cursor-pointer font-sans uppercase"
              style={{
                fontSize: '0.5625rem',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.20em',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'var(--color-border-subtle, rgba(255,255,255,0.06))',
                background: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'transparent',
                color: isActive
                  ? 'var(--color-canvas, #0c0c0c)'
                  : 'var(--color-ink-secondary, rgba(201,184,160,0.6))',
                transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
              }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isActive}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `rtk npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/PropertySelector/PropertyFilters.tsx
rtk git commit -m "feat: add PropertyFilters component with search and status filter"
```

---

## Task 5: Rewrite PropertySelector as Directory Grid

**Files:**
- Rewrite: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Rewrite PropertySelector with grid, search, and filters**

```tsx
// src/components/PropertySelector/PropertySelector.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
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
        className="sticky top-0 z-40 flex items-center justify-between"
        style={{
          padding: '20px 32px',
          background: 'var(--color-canvas, #0c0c0c)',
        }}
      >
        <h1
          className="font-sans uppercase"
          style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.35em',
            color: 'var(--color-ink, #F5F1E8)',
          }}
        >
          Properties
        </h1>
        <span
          className="font-sans"
          style={{
            fontSize: '0.625rem',
            letterSpacing: '0.10em',
            color: 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
          }}
        >
          {filteredProperties.length} of {sampleProperties.length}
        </span>
      </header>

      {/* Filters */}
      <div style={{ padding: '0 32px 24px' }}>
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </div>

      {/* Grid */}
      <div style={{ padding: '0 32px 48px' }}>
        <motion.div
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          }}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, i) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <PropertyCard property={property} onSelect={handleSelect} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProperties.length === 0 && (
          <motion.div
            className="flex flex-col items-center justify-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p
              className="font-sans text-center"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-ink-secondary, rgba(201,184,160,0.4))',
                letterSpacing: '0.02em',
              }}
            >
              No properties match your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveStatus('all');
              }}
              className="mt-3 font-sans uppercase cursor-pointer"
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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `rtk npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/PropertySelector/PropertySelector.tsx
rtk git commit -m "feat: rewrite PropertySelector as directory grid with search and filters"
```

---

## Task 6: Delete Unused Slideshow Components

**Files:**
- Delete: `src/components/PropertySelector/PropertyContent.tsx`
- Delete: `src/components/PropertySelector/DiagonalSlide.tsx`
- Delete: `src/components/PropertySelector/SlideshowPagination.tsx`

- [ ] **Step 1: Delete PropertyContent.tsx**

```bash
Remove-Item "C:\Users\aesqu\Vallarta\src\components\PropertySelector\PropertyContent.tsx"
```

- [ ] **Step 2: Delete DiagonalSlide.tsx**

```bash
Remove-Item "C:\Users\aesqu\Vallarta\src\components\PropertySelector\DiagonalSlide.tsx"
```

- [ ] **Step 3: Delete SlideshowPagination.tsx**

```bash
Remove-Item "C:\Users\aesqu\Vallarta\src\components\PropertySelector\SlideshowPagination.tsx"
```

- [ ] **Step 4: Verify no remaining imports reference deleted files**

Run: `rtk npx tsc --noEmit`
Expected: No errors (PropertySelector.tsx no longer imports these files)

- [ ] **Step 5: Commit**

```bash
rtk git add -A src/components/PropertySelector/
rtk git commit -m "chore: remove unused slideshow and overlay components"
```

---

## Task 7: Verify Full Build

- [ ] **Step 1: Run TypeScript check**

Run: `rtk npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run dev server and verify manually**

Run: `npm run dev`
Open browser → Login → Nav Menu → Properties
Expected:
- Grid of property cards with images, names, locations, status badges, revenue
- Search bar filters by name/location
- Status filter buttons (All, Available, Occupied, Maintenance, Reserved)
- Clicking a card navigates directly to dashboard
- No PropertyContent overlay appears

- [ ] **Step 3: Commit final state**

```bash
rtk git add -A
rtk git commit -m "feat: property selector directory grid - complete"
```
