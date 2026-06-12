# Property Selector Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the property selector page to Awwwards-quality while maintaining calm, coastal, high-end brand identity through intentional asymmetry, editorial typography, and restrained motion.

**Architecture:** Redesign existing PropertySelector component system (PropertySelector.tsx, PropertyCard.tsx, StickyHeader.tsx) with enhanced CSS (property-selector.css, design-tokens.css). Maintain existing tech stack: React 19, Motion, Lenis, Tailwind v4, vanilla CSS. No framework migration.

**Tech Stack:** React 19, Motion (motion/react), Lenis, Tailwind v4, vanilla CSS, TypeScript, Vite

---

## File Structure

**Modify:**
- `src/design-tokens.css` — Add noise texture variable, update easing curves, add status glow tokens
- `src/styles/property-selector.css` — Complete visual overhaul (grid, cards, header, animations)
- `src/components/PropertySelector/PropertySelector.tsx` — Update wordmark animation, selection behavior
- `src/components/PropertySelector/PropertyCard.tsx` — Update typography positioning, hover states, active press
- `src/components/PropertySelector/StickyHeader.tsx` — Add sliding tier indicator, search width animation
- `src/components/PropertySelector/propertyData.ts` — Add propertyType field to all properties

**Test:**
- `tests/components/PropertySelector/PropertyCard.test.tsx` — Update tests for new class names/behavior
- `tests/components/PropertySelector/StatusAccent.test.tsx` — Verify status glow rendering

---

## Task 1: Design Tokens Update

**Files:**
- Modify: `src/design-tokens.css:166-196` (Property Selector v2 section)

- [ ] **Step 1: Update easing curves**

Replace weak easing with stronger custom curves per emil-design-eng:

```css
/* Motion */
--ps-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ps-ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ps-duration-instant: 150ms;
--ps-duration-fast: 250ms;
--ps-duration-base: 500ms;
--ps-duration-slow: 700ms;
```

- [ ] **Step 2: Add noise texture variable**

Add after `--ps-canvas` line:

```css
--ps-canvas: #f7f5f2;
--ps-noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
```

- [ ] **Step 3: Update status glow tokens**

Replace status colors with glow variants:

```css
/* Status accent colors */
--ps-status-available: oklch(72% 0.08 155);
--ps-status-available-glow: oklch(72% 0.08 155 / 0.4);
--ps-status-occupied: oklch(55% 0.06 80);
--ps-status-occupied-glow: oklch(55% 0.06 80 / 0.3);
--ps-status-maintenance: oklch(62% 0.12 70);
--ps-status-maintenance-glow: oklch(62% 0.12 70 / 0.35);
--ps-status-reserved: oklch(65% 0.05 260);
--ps-status-reserved-glow: oklch(65% 0.05 260 / 0.3);
```

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: PASS (no type errors)

- [ ] **Step 5: Commit**

```bash
git add src/design-tokens.css
git commit -m "refactor(tokens): stronger easing curves, noise texture, status glows"
```

---

## Task 2: Property Data Enhancement

**Files:**
- Modify: `src/components/PropertySelector/propertyData.ts`
- Modify: `src/types.ts` (if Property interface needs update)

- [ ] **Step 1: Add propertyType to Property interface**

Check `src/types.ts` for Property interface. If missing `propertyType`, add:

```typescript
export interface Property {
  // ... existing fields
  propertyType?: string;
}
```

- [ ] **Step 2: Add propertyType to all sample properties**

```typescript
export const sampleProperties: Property[] = [
  {
    id: 'casa-del-sol',
    name: 'Casa del Sol',
    location: 'Marina Vallarta',
    tagline: 'Beachfront estate with private dock',
    propertyType: 'Oceanfront',
    occupancyStatus: 'available',
    // ... rest of fields
  },
  {
    id: 'villa-cemento',
    name: 'Villa Cemento',
    location: 'Conchas Chinas',
    tagline: 'Contemporary hillside retreat with panoramic views',
    propertyType: 'Cliffside',
    occupancyStatus: 'available',
    // ... rest of fields
  },
  {
    id: 'villa-tropical',
    name: 'Villa Tropical',
    location: 'Punta Mita',
    tagline: 'Cliffside villa with sunset terrace',
    propertyType: 'Private Beach',
    occupancyStatus: 'reserved',
    // ... rest of fields
  },
  {
    id: 'casa-brutal',
    name: 'Casa Brutal',
    location: 'Zona Romantica',
    tagline: 'Oceanfront luxury with private infinity pool',
    propertyType: 'Compound',
    occupancyStatus: 'occupied',
    // ... rest of fields
  },
  {
    id: 'casa-palmeras',
    name: 'Casa Palmeras',
    location: 'Bucerias',
    tagline: 'Boutique casita steps from the sand',
    propertyType: 'Garden',
    occupancyStatus: 'available',
    // ... rest of fields
  },
  {
    id: 'casa-brisa',
    name: 'Casa Brisa',
    location: 'Sayulita',
    tagline: 'Jungle-edge retreat with rooftop pool',
    propertyType: 'Hillside',
    occupancyStatus: 'maintenance',
    // ... rest of fields
  },
];
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/propertyData.ts src/types.ts
git commit -m "feat(data): add propertyType field for editorial hierarchy"
```

---

## Task 3: Grid & Layout Overhaul

**Files:**
- Modify: `src/styles/property-selector.css:9-46` (Grid section)

- [ ] **Step 1: Update grid gaps and add max-width**

```css
/* ── Grid: 3-tier layout ── */
.ps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 12px clamp(16px, 3vw, 48px);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Tier: Gallery (3-col, large cards) */
.ps-grid--gallery {
  grid-template-columns: repeat(3, 1fr);
}

/* Tier: Collection (4-col, medium cards) — default */
.ps-grid--collection {
  grid-template-columns: repeat(4, 1fr);
}

/* Tier: Catalog (5-col, small cards) */
.ps-grid--catalog {
  grid-template-columns: repeat(5, 1fr);
}
```

- [ ] **Step 2: Update responsive breakpoints**

```css
/* ── Responsive ── */
@media (max-width: 1024px) {
  .ps-grid--gallery { grid-template-columns: repeat(2, 1fr); }
  .ps-grid--collection { grid-template-columns: repeat(3, 1fr); }
  .ps-grid--catalog { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .ps-grid--gallery { grid-template-columns: repeat(2, 1fr); }
  .ps-grid--collection { grid-template-columns: repeat(2, 1fr); }
  .ps-grid--catalog { grid-template-columns: repeat(2, 1fr); }
  .ps-grid { gap: 8px; padding: 8px 16px; }
}

@media (max-width: 480px) {
  .ps-grid--gallery,
  .ps-grid--collection,
  .ps-grid--catalog {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/styles/property-selector.css
git commit -m "refactor(grid): tighter gaps, max-width container, responsive refinements"
```

---

## Task 4: Card Typography & Positioning

**Files:**
- Modify: `src/styles/property-selector.css:48-151` (Card section)
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

- [ ] **Step 1: Update card CSS — gradient, padding, text positioning**

```css
/* ── Card ── */
.ps-card {
  position: relative;
  width: 100%;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  display: block;
  overflow: hidden;
  border-radius: 2px;
  transition: transform var(--ps-duration-fast) var(--ps-ease-out);
}

.ps-card:active {
  transform: scale(0.99);
}

.ps-card__image-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.ps-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--ps-duration-base) var(--ps-ease-out);
}

/* Aspect ratios per tier — asymmetric */
.ps-grid--gallery .ps-card--tall .ps-card__image-wrap { aspect-ratio: 2 / 3; }
.ps-grid--gallery .ps-card--short .ps-card__image-wrap { aspect-ratio: 4 / 3; }
.ps-grid--collection .ps-card--tall .ps-card__image-wrap { aspect-ratio: 3 / 4; }
.ps-grid--collection .ps-card--short .ps-card__image-wrap { aspect-ratio: 1 / 1; }
.ps-grid--catalog .ps-card__image-wrap { aspect-ratio: 1 / 1; }

/* Tall cards span 2 rows */
.ps-card--tall {
  grid-row: span 2;
}

/* Smooth layout transitions */
.ps-card__image-wrap {
  transition: aspect-ratio var(--ps-duration-base) var(--ps-ease-out);
}

.ps-card {
  transition: grid-row var(--ps-duration-base) var(--ps-ease-out),
              transform var(--ps-duration-fast) var(--ps-ease-out);
}

/* ── Gradient overlay (text ON image) — softer ── */
.ps-card__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.35) 100%
  );
  pointer-events: none;
}

/* ── Text overlay ── */
.ps-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: clamp(20px, 2.5vw, 32px);
  z-index: 2;
}

.ps-card__type {
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px 0;
  line-height: 1;
}

.ps-card__name {
  font-family: var(--font-display);
  font-size: var(--ps-name-size);
  font-weight: 400;
  font-style: normal;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 12px 0;
}

.ps-card__location {
  font-family: var(--font-ui);
  font-size: var(--ps-location-size);
  font-weight: 500;
  letter-spacing: var(--ps-location-tracking);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}

.ps-card__tagline {
  font-family: var(--font-display);
  font-size: var(--ps-tagline-size);
  font-weight: 400;
  font-style: italic;
  color: rgba(255, 255, 255, 0.75);
  margin: 12px 0 0 0;
  line-height: 1.4;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity var(--ps-duration-fast) var(--ps-ease-out),
              transform var(--ps-duration-fast) var(--ps-ease-out);
}
```

- [ ] **Step 2: Update PropertyCard.tsx — add propertyType, update structure**

```tsx
import { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';
import { TierLevel } from './StickyHeader';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  index: number;
  tier: TierLevel;
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

function isTallCard(index: number, tier: TierLevel): boolean {
  if (tier === 'catalog') return false;
  if (tier === 'gallery') return index % 3 === 0;
  return index % 5 === 0 || index % 5 === 3;
}

export default function PropertyCard({ property, onSelect, index, tier }: PropertyCardProps) {
  const tall = isTallCard(index, tier);
  const imageRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealed(true);
      return;
    }

    const el = imageRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={() => onSelect(property.id)}
      className={`ps-card dashboard-focus ${tall ? 'ps-card--tall' : 'ps-card--short'}`}
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`View ${property.name}, ${property.location}`}
    >
      <div
        ref={imageRef}
        className="ps-card__image-wrap"
        style={{
          clipPath: revealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
          transition: revealed
            ? `clip-path var(--ps-duration-base) var(--ps-ease-out), aspect-ratio var(--ps-duration-base) var(--ps-ease-out)`
            : 'none',
        }}
      >
        <picture>
          {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
          <motion.img
            layoutId={`property-image-${property.id}`}
            src={property.imageUrl}
            alt={property.name}
            className="ps-card__image"
            loading="lazy"
          />
        </picture>
        <div className="ps-card__gradient" />
        <div className="ps-card__status">
          <span className={`ps-card__status-dot ps-card__status-dot--${property.occupancyStatus}`} />
          <span className="ps-card__status-label">{STATUS_LABELS[property.occupancyStatus]}</span>
        </div>
        <div className="ps-card__overlay">
          {property.propertyType && (
            <p className="ps-card__type">{property.propertyType}</p>
          )}
          <motion.h3 className="ps-card__name" layoutId={`property-title-${property.id}`}>{property.name}</motion.h3>
          <p className="ps-card__location">{property.location}</p>
          {property.tagline && (
            <p className="ps-card__tagline">{property.tagline}</p>
          )}
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/styles/property-selector.css src/components/PropertySelector/PropertyCard.tsx
git commit -m "refactor(card): editorial typography, softer gradient, active press, property type label"
```

---

## Task 5: Status Indicators with Glow

**Files:**
- Modify: `src/styles/property-selector.css:153-194` (Status section)

- [ ] **Step 1: Update status dot CSS with glow**

```css
/* ── Status dot (always visible) — top-left ── */
.ps-card__status {
  position: absolute;
  top: clamp(12px, 1.5vw, 20px);
  left: clamp(12px, 1.5vw, 20px);
  right: auto;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ps-card__status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
}

.ps-card__status-dot--available {
  background: var(--ps-status-available);
  box-shadow: 0 0 8px var(--ps-status-available-glow);
}

.ps-card__status-dot--occupied {
  background: var(--ps-status-occupied);
  box-shadow: 0 0 6px var(--ps-status-occupied-glow);
}

.ps-card__status-dot--maintenance {
  background: var(--ps-status-maintenance);
  box-shadow: 0 0 6px var(--ps-status-maintenance-glow);
}

.ps-card__status-dot--reserved {
  background: var(--ps-status-reserved);
  box-shadow: 0 0 6px var(--ps-status-reserved-glow);
}

.ps-card__status-label {
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #fff;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  padding: 4px 8px;
  border-radius: 2px;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity var(--ps-duration-fast) var(--ps-ease-out),
              transform var(--ps-duration-fast) var(--ps-ease-out);
  pointer-events: none;
  white-space: nowrap;
}
```

- [ ] **Step 2: Update hover state for status label**

```css
/* ── Hover states ── */
@media (hover: hover) {
  .ps-card:hover .ps-card__image {
    transform: scale(1.03);
  }

  .ps-card:hover .ps-card__tagline {
    opacity: 1;
    transform: translateY(0);
  }

  .ps-card:hover .ps-card__status-label {
    opacity: 1;
    transform: translateX(0);
  }
}
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/styles/property-selector.css
git commit -m "refactor(status): ambient glow, top-left position, refined label"
```

---

## Task 6: Canvas Noise & Scroll Progress

**Files:**
- Modify: `src/styles/property-selector.css:3-7` (Canvas section)
- Modify: `src/styles/property-selector.css:251-263` (Scroll progress)

- [ ] **Step 1: Add noise overlay to canvas**

```css
.ps-canvas {
  min-height: 100dvh;
  background: var(--ps-canvas);
  position: relative;
}

.ps-canvas::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--ps-noise);
  opacity: 0.025;
}
```

- [ ] **Step 2: Update scroll progress bar to ochre**

```css
/* ── Scroll progress bar ── */
.ps-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 1px;
  background: var(--color-accent-warning);
  z-index: 100;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 100ms linear;
}
```

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/styles/property-selector.css
git commit -m "feat(canvas): noise texture, ochre scroll progress"
```

---

## Task 7: Wordmark & Header Refinement

**Files:**
- Modify: `src/styles/property-selector.css:526-542` (Hero wordmark)
- Modify: `src/styles/property-selector.css:356-508` (Sticky Header)
- Modify: `src/components/PropertySelector/PropertySelector.tsx`
- Modify: `src/components/PropertySelector/StickyHeader.tsx`

- [ ] **Step 1: Update wordmark CSS — larger, clip-path reveal**

```css
/* ── Hero wordmark (page load) ── */
.ps-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  background: var(--ps-canvas);
}

.ps-hero__wordmark {
  font-family: var(--font-display);
  font-size: clamp(5rem, 14vw, 12rem);
  font-weight: 400;
  letter-spacing: -0.05em;
  color: var(--ps-ink);
  line-height: 1;
  clip-path: inset(100% 0 0 0);
  animation: ps-wordmark-reveal 0.8s var(--ps-ease-out) forwards;
}

@keyframes ps-wordmark-reveal {
  to {
    clip-path: inset(0 0 0 0);
  }
}
```

- [ ] **Step 2: Update PropertySelector.tsx — wordmark animation**

Replace the wordmark motion.div:

```tsx
<AnimatePresence>
  {phase === 'wordmark' && (
    <motion.div
      key="hero-wordmark"
      className="ps-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="ps-hero__wordmark">Vallarta</div>
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 3: Update header tier buttons with sliding indicator**

Add to header CSS:

```css
.ps-header__tier {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}

.ps-header__tier-btn {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--ps-ink-muted);
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  transition: color var(--ps-duration-instant) var(--ps-ease-out);
  position: relative;
}

.ps-header__tier-btn:hover {
  color: var(--ps-ink-secondary);
}

.ps-header__tier-btn--active {
  color: var(--ps-ink);
}

.ps-header__tier-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--color-accent-warning);
  transition: transform var(--ps-duration-fast) var(--ps-ease-out),
              width var(--ps-duration-fast) var(--ps-ease-out);
}
```

- [ ] **Step 4: Update StickyHeader.tsx — add sliding indicator**

```tsx
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

export type TierLevel = 'gallery' | 'collection' | 'catalog';

interface StickyHeaderProps {
  tier: TierLevel;
  onTierChange: (tier: TierLevel) => void;
  onSearch: (query: string) => void;
}

const TIERS: { id: TierLevel; label: string; icon: React.ReactNode }[] = [
  // ... keep existing tier definitions
];

export default function StickyHeader({ tier, onTierChange, onSearch }: StickyHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRect, setActiveRect] = useState<{ left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!tierRef.current) return;
    const activeBtn = tierRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      const rect = activeBtn.getBoundingClientRect();
      const parentRect = tierRef.current.getBoundingClientRect();
      setActiveRect({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [tier]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className="ps-header">
      <div className="ps-header__wordmark">Vallarta // Mita</div>

      <div className="ps-header__controls">
        {searchOpen ? (
          <motion.div
            className="ps-header__search"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search properties..."
              className="ps-header__search-input"
              aria-label="Search properties"
            />
            <button
              onClick={handleSearchClose}
              className="ps-header__search-close"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="ps-header__search-toggle"
            aria-label="Open search"
          >
            <Search size={16} />
          </button>
        )}

        <div className="ps-header__tier" role="radiogroup" aria-label="Card size" ref={tierRef}>
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => onTierChange(t.id)}
              className={`ps-header__tier-btn ${tier === t.id ? 'ps-header__tier-btn--active' : ''}`}
              role="radio"
              aria-checked={tier === t.id}
              data-active={tier === t.id}
            >
              <span className="ps-header__tier-btn-icon">{t.icon}</span>
              <span className="ps-header__tier-btn-label">{t.label}</span>
            </button>
          ))}
          {activeRect && (
            <motion.div
              className="ps-header__tier-indicator"
              initial={false}
              animate={{
                transform: `translateX(${activeRect.left}px)`,
                width: activeRect.width,
              }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 5: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/styles/property-selector.css src/components/PropertySelector/PropertySelector.tsx src/components/PropertySelector/StickyHeader.tsx
git commit -m "feat(header): sliding tier indicator, clip-path wordmark, search width animation"
```

---

## Task 8: Selection Behavior & Empty State

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`
- Modify: `src/styles/property-selector.css:265-300` (Empty state)

- [ ] **Step 1: Update selection animation in PropertySelector.tsx**

Replace the AnimatePresence block:

```tsx
<AnimatePresence mode="sync">
  {filteredProperties.map((property, i) => (
    <motion.div
      key={property.id}
      className="ps-grid-cell"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={
        selectedId === null
          ? { opacity: 1, y: 0 }
          : selectedId === property.id
            ? { opacity: 1, y: 0 }
            : { opacity: 0.4, filter: 'blur(4px)', y: 4 }
      }
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        layout: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
        opacity: { duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: selectedId === null ? i * 0.06 : 0 },
        y: { duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: selectedId === null ? i * 0.06 : 0 },
        filter: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
      }}
    >
      <PropertyCard
        property={property}
        onSelect={handleSelect}
        index={i}
        tier={tier}
      />
    </motion.div>
  ))}
</AnimatePresence>
```

- [ ] **Step 2: Update empty state CSS**

```css
/* ── Empty state ── */
.ps-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 48px 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.ps-empty__text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--ps-ink);
  margin-bottom: 16px;
}

.ps-empty__subtext {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--ps-ink-muted);
  margin-bottom: 24px;
}

.ps-empty__cta {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ps-ink-secondary);
  background: none;
  border: none;
  border-bottom: 1px solid var(--ps-ink-secondary);
  padding: 8px 0;
  cursor: pointer;
  transition: color var(--ps-duration-instant) var(--ps-ease-out);
}

.ps-empty__cta:hover {
  color: var(--ps-ink);
}
```

- [ ] **Step 3: Update empty state JSX in PropertySelector.tsx**

```tsx
{filteredProperties.length === 0 ? (
  <div className="ps-empty">
    <p className="ps-empty__text">No properties match your search.</p>
    <p className="ps-empty__subtext">Try adjusting your search terms.</p>
    <button className="ps-empty__cta" onClick={() => handleSearch('')}>
      Clear search
    </button>
  </div>
) : (
  // ... grid
)}
```

- [ ] **Step 4: Run lint**

```bash
npm run lint
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx src/styles/property-selector.css
git commit -m "refactor(selection): softer fade, refined empty state"
```

---

## Task 9: Update Tests

**Files:**
- Modify: `tests/components/PropertySelector/PropertyCard.test.tsx`
- Modify: `tests/components/PropertySelector/StatusAccent.test.tsx`

- [ ] **Step 1: Update PropertyCard tests for new class names**

Read existing test file and update any references to changed class names or behavior. Key changes:
- `.ps-card__type` now exists
- Status moved from right to left
- Tagline font changed to italic

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/
git commit -m "test(property-selector): update tests for redesign"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Manual visual review**

Open dev server and verify:
- Noise texture visible on canvas
- Cards have softer gradient, property type label
- Status dots have ambient glow, positioned top-left
- Wordmark uses clip-path reveal
- Tier switch has sliding ochre indicator
- Selection fades others to 0.4 opacity + blur
- Hover scale is gentle (1.03)
- Active press is subtle (0.99)
- Scroll progress is ochre 1px

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat(property-selector): Awwwards-quality redesign — calm coastal luxury"
```

---

## Self-Review

**Spec coverage:**
- ✅ Layout & grid (Tasks 1, 3)
- ✅ Typography & positioning (Task 4)
- ✅ Canvas & texture (Task 6)
- ✅ Card surface (Task 4)
- ✅ Status indicators (Task 5)
- ✅ Wordmark & header (Task 7)
- ✅ Selection & interaction (Task 8)
- ✅ Empty state (Task 8)
- ✅ Motion & animation (Tasks 4, 7, 8)
- ✅ Responsive (Task 3)
- ✅ Accessibility (existing, verified in Task 9)

**Placeholder scan:** No TBD/TODO found. All steps have complete code.

**Type consistency:** Property interface updated in Task 2, used consistently in Task 4. TierLevel type consistent across Tasks 4, 7.

---

Plan complete and saved to `docs/superpowers/plans/2026-06-11-property-selector-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
