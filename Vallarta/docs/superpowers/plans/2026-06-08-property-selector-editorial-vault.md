# Property Selector Editorial Vault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the property selector into an asymmetric, high-end "Editorial Vault" with massive typographic breakouts and physical Z-axis hover interactions.

**Architecture:** We will implement an asymmetric 12-column CSS grid where each property card takes on a specific size and proportion depending on its index. We will introduce `isHovered` and `isAnotherHovered` props to `PropertyCard` to coordinate the Ken Burns panning, sibling recession (scale down, blur, lower opacity), and the hiding of typographic elements to reduce noise during interaction. The typography itself will be massive and absolutely positioned to overhang the image containers.

**Tech Stack:** React, framer-motion (`motion/react`), Tailwind CSS, inline styles.

---

### Task 1: Enhance `PropertyCard.tsx` with Breakout Typography and Hover States

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

- [ ] **Step 1: Write tests (if applicable) or proceed**
We are making visual enhancements, so we will focus on modifying the component structure directly.

- [ ] **Step 2: Update `PropertyCard` props and structure**
Add `isHovered` and `isAnotherHovered` to the props interface. Re-structure the card so the outer container is `overflow-visible` and the image container is `overflow-hidden`. Add the massive overhanging typography.

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { Property, OccupancyStatus } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  isHovered: boolean;
  isAnotherHovered: boolean;
}

const STATUS_LABELS: Record<OccupancyStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

export default function PropertyCard({ property, onSelect, isHovered, isAnotherHovered }: PropertyCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative w-full h-full text-left cursor-pointer focus-visible:outline-none overflow-visible"
      style={{
        transition: 'box-shadow 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-dark-accent, #d49a55)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      aria-label={`View ${property.name}`}
    >
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-elevated,#141414)] shadow-2xl">
        <motion.div
           className="w-full h-full"
           animate={{ scale: isHovered ? 1.15 : 1.0 }}
           transition={{ 
             duration: isHovered ? 15 : 0.6, 
             ease: isHovered ? 'linear' : [0.16, 1, 0.3, 1] 
           }}
        >
          <picture>
            {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </picture>
        </motion.div>

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.85) 0%, rgba(12,12,12,0.2) 40%, transparent 60%)',
            transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.95) 0%, rgba(12,12,12,0.3) 40%, transparent 60%)',
            transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        {/* Secondary Metadata inside image container */}
        <div className="absolute bottom-4 right-4 text-right pointer-events-none">
          <div className="flex flex-col items-end gap-1">
            <span
              className="uppercase"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.625rem',
                fontWeight: 400,
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {property.location}
            </span>
            <span
              className="uppercase"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.5625rem',
                fontWeight: property.occupancyStatus === 'occupied' ? 500 : 400,
                letterSpacing: '0.15em',
                color: property.occupancyStatus === 'occupied' 
                  ? 'rgba(255,255,255,0.9)' 
                  : 'rgba(255,255,255,0.5)',
              }}
            >
              {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Breakout Typography */}
      <motion.h3
        className="absolute italic whitespace-nowrap pointer-events-none"
        animate={{
          opacity: isAnotherHovered ? 0 : 1,
          y: isHovered ? -8 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          color: '#F5F1E8',
          bottom: '-1.5rem',
          left: '-1.5rem',
          zIndex: 20,
          textShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {property.name}
      </motion.h3>
    </motion.button>
  );
}
```

- [ ] **Step 3: Commit**
```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "feat(PropertyCard): add breakout typography and ken burns hover effect"
```


### Task 2: Implement Asymmetric Layout and Sibling Recession in `PropertySelector.tsx`

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Update grid layout and pass new props to PropertyCard**

```tsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import PropertySkeleton from './PropertySkeleton';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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
      className="w-full min-h-[100dvh] relative overflow-hidden"
      style={{ background: 'var(--color-canvas, #0c0c0c)' }}
    >
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <header
          className="sticky top-0 z-40 flex items-center justify-between"
          style={{
            height: '48px',
            padding: '0 24px',
            background: 'var(--color-canvas, #0c0c0c)',
          }}
        >
          <h1
            className="uppercase"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.35em',
              color: 'rgba(255,255,255,0.6)',
            }}
          >
            Properties
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.10em',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            {filteredProperties.length} of {sampleProperties.length}
          </span>
        </header>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ padding: '0 24px 8px' }}
      >
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </motion.div>

      {/* Grid / Skeleton */}
      {isLoading ? (
        <div
          className="grid grid-cols-12 auto-rows-[minmax(300px,auto)] gap-x-6 gap-y-32 px-12 pb-32 pt-16"
          style={{
            width: '100%',
            background: 'var(--color-canvas, #0c0c0c)',
          }}
        >
          {[1, 2, 3, 4, 5].map((i, index) => {
            const pattern = index % 5;
            const gridStyle = 
              pattern === 0 ? { gridColumn: 'span 8', gridRow: 'span 2', height: '600px' } :
              pattern === 1 ? { gridColumn: 'span 4', gridRow: 'span 1', height: '400px', marginTop: '100px' } :
              pattern === 2 ? { gridColumn: 'span 5', gridRow: 'span 1', height: '450px' } :
              pattern === 3 ? { gridColumn: 'span 7', gridRow: 'span 2', height: '700px', marginTop: '-100px' } :
                              { gridColumn: 'span 12', gridRow: 'span 2', height: '500px' };
            
            return (
              <div key={i} style={gridStyle}>
                <PropertySkeleton />
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: 0 }}>
          {filteredProperties.length > 0 ? (
            <div
              className="grid grid-cols-12 auto-rows-[minmax(300px,auto)] gap-x-6 gap-y-32 px-12 pb-32 pt-16"
              style={{
                width: '100%',
                background: 'var(--color-canvas, #0c0c0c)',
              }}
            >
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => {
                  const isHovered = hoveredPropertyId === property.id;
                  const isAnotherHovered = hoveredPropertyId !== null && !isHovered;

                  const pattern = i % 5;
                  const gridStyle = 
                    pattern === 0 ? { gridColumn: 'span 8', gridRow: 'span 2', height: '600px' } :
                    pattern === 1 ? { gridColumn: 'span 4', gridRow: 'span 1', height: '400px', marginTop: '100px' } :
                    pattern === 2 ? { gridColumn: 'span 5', gridRow: 'span 1', height: '450px' } :
                    pattern === 3 ? { gridColumn: 'span 7', gridRow: 'span 2', height: '700px', marginTop: '-100px' } :
                                    { gridColumn: 'span 12', gridRow: 'span 2', height: '500px' };

                  return (
                    <motion.div
                      key={property.id}
                      layoutId={`container-${property.id}`}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ 
                        opacity: isAnotherHovered ? 0.4 : 1,
                        scale: isAnotherHovered ? 0.95 : 1,
                        filter: isAnotherHovered ? 'blur(3px)' : 'blur(0px)',
                        y: 0,
                        zIndex: isHovered ? 10 : 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                        delay: i * 0.04,
                      }}
                      style={gridStyle}
                      className="relative"
                      onMouseEnter={() => setHoveredPropertyId(property.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                    >
                      <PropertyCard 
                        property={property} 
                        onSelect={handleSelect} 
                        isHovered={isHovered}
                        isAnotherHovered={isAnotherHovered}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center"
              style={{ height: 'calc(100dvh - 48px)' }}
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
      )}
    </div>
  );
}
```

- [ ] **Step 2: Check test files for obsolete assertions**
Update `tests/test_property_selector.js` and `tests/test_property_selector_aria.js` to avoid failures on deleted states or missing components that are no longer referenced in the main file.
Run `node tests/test_property_selector.js` to verify.

- [ ] **Step 3: Update Test Assertions in `tests/test_property_selector.js`**
If the test asserts `isContentOpen`, `DiagonalSlide`, `SlideshowPagination`, or `PropertyContent`, those tests should be removed.

```javascript
// Modify tests/test_property_selector.js to only assert valid aspects of PropertySelector
import fs from 'fs';
import assert from 'assert';

const selectorContent = fs.readFileSync('src/components/PropertySelector/PropertySelector.tsx', 'utf-8');
assert.ok(selectorContent.includes('export default function PropertySelector'), 'PropertySelector should be default exported');

const typesContent = fs.readFileSync('src/types.ts', 'utf-8');
assert.ok(typesContent.includes("property_selector"), 'ScreenType should include property_selector');
assert.ok(typesContent.includes('interface Property'), 'types.ts should export Property interface');

const dataContent = fs.readFileSync('src/components/PropertySelector/propertyData.ts', 'utf-8');
assert.ok(dataContent.includes('sampleProperties'), 'propertyData should export sampleProperties');

const navContent = fs.readFileSync('src/components/NavMenuView.tsx', 'utf-8');
assert.ok(navContent.includes('property_selector'), 'NavMenuView should have a menu item routing to property_selector');

console.log('PASS: All property selector tests passed.');
```

- [ ] **Step 4: Update ARIA Test Assertions in `tests/test_property_selector_aria.js`**

```javascript
// Modify tests/test_property_selector_aria.js
import fs from 'fs';
import assert from 'assert';

const selectorContent = fs.readFileSync('src/components/PropertySelector/PropertySelector.tsx', 'utf-8');
assert.ok(selectorContent.includes('aria-live="polite"'), 'PropertySelector should have aria-live region');

const cardContent = fs.readFileSync('src/components/PropertySelector/PropertyCard.tsx', 'utf-8');
assert.ok(cardContent.includes('aria-label'), 'PropertyCard should have an aria-label');

console.log('PASS: All ARIA tests passed.');
```

- [ ] **Step 5: Run tests**
```bash
node tests/test_property_selector.js
node tests/test_property_selector_aria.js
```

- [ ] **Step 6: Commit**
```bash
git add src/components/PropertySelector/PropertySelector.tsx tests/test_property_selector.js tests/test_property_selector_aria.js
git commit -m "feat(PropertySelector): implement editorial asymmetric layout with sibling recession"
```
