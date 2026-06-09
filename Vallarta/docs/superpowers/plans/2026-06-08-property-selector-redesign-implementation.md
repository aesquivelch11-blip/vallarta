# Property Selector Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the property selector from a uniform dark card grid to an asymmetric editorial gallery with GridZoom expansion animation, light coastal theme, and creative floating controls.

**Architecture:** Replace the current 3-column uniform grid with an asymmetric editorial layout (mix of 2x2, 1x1, 1x2 cells). Status indicators become colored accent lines on the leading edge instead of top-right dots. Search and filters move into a floating control bar that appears on scroll. The GridZoom animation scales the selected card to fill the viewport while other cards fade out with stagger.

**Tech Stack:** React, TypeScript, Motion (motion/react), CSS Grid, CSS Custom Properties, GSAP (for GridZoom animation)

**Spec:** `docs/superpowers/plans/2026-06-08-property-selector-redesign.md`

---

## File Structure

### Files to Create
- `src/components/PropertySelector/StatusAccent.tsx` - Status accent line component
- `src/components/PropertySelector/FloatingControls.tsx` - Floating search and filter bar
- `src/components/PropertySelector/GridZoomAnimation.ts` - GridZoom animation logic using GSAP
- `src/styles/property-selector-redesign.css` - New CSS for asymmetric grid and redesign styles

### Files to Modify
- `src/design-tokens.css` - Add light theme tokens and status accent colors
- `src/components/PropertySelector/PropertyCard.tsx` - Redesign with asymmetric layout, status accent, new typography
- `src/components/PropertySelector/PropertySelector.tsx` - Implement asymmetric grid, integrate floating controls, add GridZoom
- `src/components/PropertySelector/PropertyFilters.tsx` - Simplify for floating control bar integration
- `src/components/PropertySelector/PropertySkeleton.tsx` - Update to match asymmetric grid geometry
- `src/index.css` - Import new CSS file

### Files to Keep (No Changes)
- `src/components/PropertySelector/propertyData.ts` - Data structure remains the same

---

## Task 1: Add Light Theme Design Tokens

**Files:**
- Modify: `src/design-tokens.css`

- [ ] **Step 1: Add light theme color tokens**

Add these tokens to `src/design-tokens.css` after the existing `:root` block:

```css
/* --- Property Selector Redesign: Light Coastal Theme --- */
:root {
    /* Light canvas */
    --ps-canvas: #faf8f5; /* Bleached Bone */
    --ps-surface: #f2ece4; /* Travertine Cream */
    --ps-ink: #242424; /* Obsidian Charcoal */
    --ps-ink-secondary: #7e7a74; /* Weathered Timber */
    --ps-ink-muted: #9a9590;
    
    /* Status accent colors (OKLCH) */
    --ps-status-available: oklch(72% 0.08 155); /* Sage green */
    --ps-status-occupied: oklch(55% 0.06 80); /* Warm ochre */
    --ps-status-maintenance: oklch(62% 0.12 70); /* Terracotta */
    --ps-status-reserved: oklch(65% 0.05 260); /* Soft blue */
    
    /* Status accent hover (brighter) */
    --ps-status-available-hover: oklch(78% 0.1 155);
    --ps-status-occupied-hover: oklch(60% 0.08 80);
    --ps-status-maintenance-hover: oklch(68% 0.14 70);
    --ps-status-reserved-hover: oklch(70% 0.07 260);
    
    /* Grid dimensions */
    --ps-grid-gap: 2px;
    --ps-card-pad-x: clamp(24px, 3vw, 40px);
    --ps-card-pad-y: clamp(20px, 2.5vw, 32px);
    --ps-card-pad-bottom: clamp(32px, 4vw, 56px);
    
    /* Typography */
    --ps-name-size: clamp(2rem, 4.5vw, 3.5rem);
    --ps-location-size: 0.5625rem;
    --ps-location-tracking: 0.3em;
    
    /* Motion */
    --ps-ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ps-ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
    --ps-duration-slow: 1.2s;
    --ps-duration-base: 0.6s;
    --ps-duration-fast: 0.3s;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/design-tokens.css
git commit -m "feat: add light theme design tokens for property selector redesign"
```

---

## Task 2: Create Status Accent Component

**Files:**
- Create: `src/components/PropertySelector/StatusAccent.tsx`
- Test: `tests/components/PropertySelector/StatusAccent.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/PropertySelector/StatusAccent.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusAccent from '../../../src/components/PropertySelector/StatusAccent';

describe('StatusAccent', () => {
  it('renders with correct status class', () => {
    render(<StatusAccent status="available" />);
    const accent = screen.getByRole('presentation');
    expect(accent).toHaveClass('ps-status-accent--available');
  });

  it('renders with occupied status', () => {
    render(<StatusAccent status="occupied" />);
    const accent = screen.getByRole('presentation');
    expect(accent).toHaveClass('ps-status-accent--occupied');
  });

  it('renders with maintenance status', () => {
    render(<StatusAccent status="maintenance" />);
    const accent = screen.getByRole('presentation');
    expect(accent).toHaveClass('ps-status-accent--maintenance');
  });

  it('renders with reserved status', () => {
    render(<StatusAccent status="reserved" />);
    const accent = screen.getByRole('presentation');
    expect(accent).toHaveClass('ps-status-accent--reserved');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/PropertySelector/StatusAccent.test.tsx`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement StatusAccent component**

Create `src/components/PropertySelector/StatusAccent.tsx`:

```typescript
import { OccupancyStatus } from '../../types';

interface StatusAccentProps {
  status: OccupancyStatus;
}

export default function StatusAccent({ status }: StatusAccentProps) {
  return (
    <div
      className={`ps-status-accent ps-status-accent--${status}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/PropertySelector/StatusAccent.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PropertySelector/StatusAccent.tsx tests/components/PropertySelector/StatusAccent.test.tsx
git commit -m "feat: add StatusAccent component for leading-edge status indicator"
```

---

## Task 3: Create Asymmetric Grid CSS

**Files:**
- Create: `src/styles/property-selector-redesign.css`
- Modify: `src/index.css`

- [ ] **Step 1: Create asymmetric grid CSS**

Create `src/styles/property-selector-redesign.css`:

```css
/* ── Property Selector Redesign: Asymmetric Editorial Grid ── */

.ps-canvas {
  padding: var(--ps-grid-gap);
  min-height: 100dvh;
  background: var(--ps-canvas);
}

/* Asymmetric grid: 6-column base, mixed cell sizes */
.ps-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: minmax(280px, auto);
  gap: var(--ps-grid-gap);
  width: 100%;
  min-height: calc(100dvh - var(--ps-grid-gap) * 2);
}

/* Cell size variants */
.ps-grid-cell--large {
  grid-column: span 3;
  grid-row: span 2;
}

.ps-grid-cell--medium {
  grid-column: span 2;
  grid-row: span 1;
}

.ps-grid-cell--tall {
  grid-column: span 2;
  grid-row: span 2;
}

/* Default: medium 2x1 */
.ps-grid-cell {
  grid-column: span 2;
  grid-row: span 1;
}

/* Desktop layout: 5+ properties visible */
/* Row 1: Large (3col, 2row) | Medium (2col) | Medium (2col) */
/* Row 2: Large (cont) | Medium (2col) | Tall (2col, 2row) */
/* Row 3: Medium (2col) | Medium (2col) | Tall (cont) */

.ps-grid > *:nth-child(1) { grid-column: 1 / 4; grid-row: 1 / 3; } /* Large */
.ps-grid > *:nth-child(2) { grid-column: 4 / 6; grid-row: 1 / 2; } /* Medium */
.ps-grid > *:nth-child(3) { grid-column: 6 / 8; grid-row: 1 / 2; } /* Medium */
.ps-grid > *:nth-child(4) { grid-column: 4 / 6; grid-row: 2 / 3; } /* Medium */
.ps-grid > *:nth-child(5) { grid-column: 6 / 8; grid-row: 2 / 4; } /* Tall */
.ps-grid > *:nth-child(6) { grid-column: 1 / 3; grid-row: 3 / 4; } /* Medium */
.ps-grid > *:nth-child(7) { grid-column: 3 / 5; grid-row: 3 / 4; } /* Medium */

/* Pattern repeats for 8-14 properties */
.ps-grid > *:nth-child(8) { grid-column: 1 / 4; grid-row: 4 / 6; } /* Large */
.ps-grid > *:nth-child(9) { grid-column: 4 / 6; grid-row: 4 / 5; } /* Medium */
.ps-grid > *:nth-child(10) { grid-column: 6 / 8; grid-row: 4 / 5; } /* Medium */
.ps-grid > *:nth-child(11) { grid-column: 4 / 6; grid-row: 5 / 6; } /* Medium */
.ps-grid > *:nth-child(12) { grid-column: 6 / 8; grid-row: 5 / 7; } /* Tall */
.ps-grid > *:nth-child(13) { grid-column: 1 / 3; grid-row: 6 / 7; } /* Medium */
.ps-grid > *:nth-child(14) { grid-column: 3 / 5; grid-row: 6 / 7; } /* Medium */

/* Status accent line */
.ps-status-accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  z-index: 5;
  transition: opacity var(--ps-duration-fast) var(--ps-ease-out-expo);
}

.ps-status-accent--available {
  background: var(--ps-status-available);
}

.ps-status-accent--occupied {
  background: var(--ps-status-occupied);
}

.ps-status-accent--maintenance {
  background: var(--ps-status-maintenance);
}

.ps-status-accent--reserved {
  background: var(--ps-status-reserved);
}

/* Property card */
.ps-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  background: var(--ps-surface);
}

.ps-card__image-wrapper {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.ps-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--ps-duration-base) var(--ps-ease-out-expo);
}

.ps-card__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(12, 12, 12, 0.82) 0%,
    rgba(12, 12, 12, 0.15) 35%,
    transparent 55%
  );
  pointer-events: none;
}

.ps-card__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 var(--ps-card-pad-x) var(--ps-card-pad-bottom);
  z-index: 10;
  transition: transform var(--ps-duration-fast) var(--ps-ease-out-expo);
}

.ps-card__name {
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--ps-name-size);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.94);
  line-height: 0.95;
  letter-spacing: -0.02em;
  margin: 0;
}

.ps-card__location {
  font-family: var(--font-ui);
  font-size: var(--ps-location-size);
  font-weight: 400;
  letter-spacing: var(--ps-location-tracking);
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
}

/* Hover states */
@media (hover: hover) {
  .ps-card:hover .ps-card__image {
    transform: scale(1.08);
  }

  .ps-card:hover .ps-card__content {
    transform: translateY(-4px);
  }

  .ps-card:hover .ps-status-accent {
    opacity: 0.8;
  }
}

/* Grid entry animation */
.ps-grid-cell {
  opacity: 0;
  transform: translateY(24px);
  animation: ps-grid-cell-in var(--ps-duration-base) var(--ps-ease-out-expo) forwards;
  animation-delay: calc(var(--i, 0) * 70ms);
}

@keyframes ps-grid-cell-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating controls */
.ps-floating-controls {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  gap: 12px;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity var(--ps-duration-fast) var(--ps-ease-out-expo),
              transform var(--ps-duration-fast) var(--ps-ease-out-expo);
  pointer-events: none;
}

.ps-floating-controls--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.ps-search-toggle,
.ps-filter-toggle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(36, 36, 36, 0.12);
  background: var(--ps-surface);
  color: var(--ps-ink-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--ps-duration-fast) var(--ps-ease-out-expo);
}

.ps-search-toggle:hover,
.ps-filter-toggle:hover {
  background: var(--ps-canvas);
  border-color: rgba(36, 36, 36, 0.2);
}

.ps-search-input {
  width: 0;
  padding: 0;
  border: none;
  background: var(--ps-surface);
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--ps-ink);
  transition: width var(--ps-duration-fast) var(--ps-ease-out-expo),
              padding var(--ps-duration-fast) var(--ps-ease-out-expo);
}

.ps-search-input--expanded {
  width: 240px;
  padding: 12px 16px;
  border-radius: 22px;
  border: 1px solid rgba(36, 36, 36, 0.12);
}

.ps-filter-pills {
  position: absolute;
  top: 56px;
  right: 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 320px;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity var(--ps-duration-fast) var(--ps-ease-out-expo),
              transform var(--ps-duration-fast) var(--ps-ease-out-expo);
  pointer-events: none;
}

.ps-filter-pills--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.ps-filter-pill {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(36, 36, 36, 0.12);
  background: var(--ps-surface);
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ps-ink-secondary);
  cursor: pointer;
  transition: all var(--ps-duration-fast) var(--ps-ease-out-expo);
}

.ps-filter-pill:hover {
  background: var(--ps-canvas);
  border-color: rgba(36, 36, 36, 0.2);
}

.ps-filter-pill--active {
  background: var(--ps-ink);
  border-color: var(--ps-ink);
  color: var(--ps-canvas);
}

/* GridZoom expansion */
.ps-grid--zoomed .ps-grid-cell {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.15s var(--ps-ease-out-expo),
              transform 0.15s var(--ps-ease-out-expo);
}

.ps-grid-cell--zooming {
  position: fixed;
  z-index: 1000;
  transition: all var(--ps-duration-slow) var(--ps-ease-in-out-expo);
}

/* Empty state */
.ps-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 200px);
  text-align: center;
}

.ps-empty__text {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: var(--ps-ink-muted);
  margin-bottom: 16px;
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
  transition: color var(--ps-duration-fast) var(--ps-ease-out-expo);
}

.ps-empty__cta:hover {
  color: var(--ps-ink);
}

/* Responsive: Tablet */
@media (max-width: 1024px) {
  .ps-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .ps-grid > *:nth-child(n) {
    grid-column: auto;
    grid-row: auto;
  }

  .ps-grid > *:nth-child(odd) {
    grid-column: span 2;
  }

  .ps-grid > *:nth-child(even) {
    grid-column: span 2;
  }
}

/* Responsive: Mobile */
@media (max-width: 640px) {
  .ps-grid {
    grid-template-columns: 1fr;
  }

  .ps-grid > * {
    grid-column: 1;
    grid-row: auto;
    min-height: 320px;
  }

  .ps-floating-controls {
    top: 16px;
    right: 16px;
  }

  .ps-search-input--expanded {
    width: 180px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ps-grid-cell {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .ps-card__image,
  .ps-card__content,
  .ps-status-accent {
    transition: none;
  }

  .ps-card:hover .ps-card__image {
    transform: none;
  }

  .ps-card:hover .ps-card__content {
    transform: none;
  }
}
```

- [ ] **Step 2: Import new CSS in index.css**

Add this line at the top of `src/index.css`, after the existing imports:

```css
@import "./styles/property-selector-redesign.css";
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/property-selector-redesign.css src/index.css
git commit -m "feat: add asymmetric grid CSS and floating controls for property selector redesign"
```

---

## Task 4: Update PropertyCard with New Design

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

- [ ] **Step 1: Rewrite PropertyCard component**

Replace the entire content of `src/components/PropertySelector/PropertyCard.tsx`:

```typescript
import { Property } from '../../types';
import StatusAccent from './StatusAccent';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  index: number;
}

export default function PropertyCard({ property, onSelect, index }: PropertyCardProps) {
  return (
    <button
      onClick={() => onSelect(property.id)}
      className="ps-card"
      style={{ '--i': index } as React.CSSProperties}
      aria-label={`View ${property.name} — ${property.occupancyStatus}`}
    >
      <StatusAccent status={property.occupancyStatus} />

      <div className="ps-card__image-wrapper">
        <picture>
          {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
          <img
            src={property.imageUrl}
            alt={property.name}
            className="ps-card__image cinematic-grade"
            loading="lazy"
          />
        </picture>
      </div>

      <div className="ps-card__gradient" />

      <div className="ps-card__content">
        <h3 className="ps-card__name">{property.name}</h3>
        <span className="ps-card__location">{property.location}</span>
      </div>
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "feat: redesign PropertyCard with status accent and new typography"
```

---

## Task 5: Create FloatingControls Component

**Files:**
- Create: `src/components/PropertySelector/FloatingControls.tsx`
- Test: `tests/components/PropertySelector/FloatingControls.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/components/PropertySelector/FloatingControls.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingControls from '../../../src/components/PropertySelector/FloatingControls';

describe('FloatingControls', () => {
  it('renders search and filter toggles', () => {
    render(
      <FloatingControls
        searchQuery=""
        onSearchChange={vi.fn()}
        activeStatus="all"
        onStatusChange={vi.fn()}
        isVisible={true}
      />
    );
    expect(screen.getByLabelText('Search properties')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
  });

  it('expands search input on toggle click', () => {
    render(
      <FloatingControls
        searchQuery=""
        onSearchChange={vi.fn()}
        activeStatus="all"
        onStatusChange={vi.fn()}
        isVisible={true}
      />
    );
    const searchToggle = screen.getByLabelText('Toggle search');
    fireEvent.click(searchToggle);
    const searchInput = screen.getByLabelText('Search properties');
    expect(searchInput).toHaveClass('ps-search-input--expanded');
  });

  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn();
    render(
      <FloatingControls
        searchQuery=""
        onSearchChange={onSearchChange}
        activeStatus="all"
        onStatusChange={vi.fn()}
        isVisible={true}
      />
    );
    const searchToggle = screen.getByLabelText('Toggle search');
    fireEvent.click(searchToggle);
    const searchInput = screen.getByLabelText('Search properties');
    fireEvent.change(searchInput, { target: { value: 'casa' } });
    expect(onSearchChange).toHaveBeenCalledWith('casa');
  });

  it('shows filter pills on filter toggle click', () => {
    render(
      <FloatingControls
        searchQuery=""
        onSearchChange={vi.fn()}
        activeStatus="all"
        onStatusChange={vi.fn()}
        isVisible={true}
      />
    );
    const filterToggle = screen.getByLabelText('Filter by status');
    fireEvent.click(filterToggle);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('calls onStatusChange when filter pill clicked', () => {
    const onStatusChange = vi.fn();
    render(
      <FloatingControls
        searchQuery=""
        onSearchChange={vi.fn()}
        activeStatus="all"
        onStatusChange={onStatusChange}
        isVisible={true}
      />
    );
    const filterToggle = screen.getByLabelText('Filter by status');
    fireEvent.click(filterToggle);
    fireEvent.click(screen.getByText('Available'));
    expect(onStatusChange).toHaveBeenCalledWith('available');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/PropertySelector/FloatingControls.test.tsx`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement FloatingControls component**

Create `src/components/PropertySelector/FloatingControls.tsx`:

```typescript
import { useState } from 'react';
import { OccupancyStatus } from '../../types';

interface FloatingControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeStatus: OccupancyStatus | 'all';
  onStatusChange: (status: OccupancyStatus | 'all') => void;
  isVisible: boolean;
}

const STATUS_OPTIONS: { value: OccupancyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

export default function FloatingControls({
  searchQuery,
  onSearchChange,
  activeStatus,
  onStatusChange,
  isVisible,
}: FloatingControlsProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  return (
    <div className={`ps-floating-controls ${isVisible ? 'ps-floating-controls--visible' : ''}`}>
      <div style={{ position: 'relative', display: 'flex', gap: '12px', alignItems: 'center' }}>
        {searchExpanded && (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="ps-search-input ps-search-input--expanded"
            aria-label="Search properties"
            autoFocus
          />
        )}
        <button
          onClick={() => setSearchExpanded(!searchExpanded)}
          className="ps-search-toggle"
          aria-label="Toggle search"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="ps-filter-toggle"
          aria-label="Filter by status"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>

        <div className={`ps-filter-pills ${filtersExpanded ? 'ps-filter-pills--visible' : ''}`}>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                onStatusChange(value);
                setFiltersExpanded(false);
              }}
              className={`ps-filter-pill ${activeStatus === value ? 'ps-filter-pill--active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/PropertySelector/FloatingControls.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PropertySelector/FloatingControls.tsx tests/components/PropertySelector/FloatingControls.test.tsx
git commit -m "feat: add FloatingControls component with search and filter toggles"
```

---

## Task 6: Update PropertySelector with Asymmetric Grid

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Rewrite PropertySelector component**

Replace the entire content of `src/components/PropertySelector/PropertySelector.tsx`:

```typescript
import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertySkeleton from './PropertySkeleton';
import FloatingControls from './FloatingControls';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setControlsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="ps-canvas">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <FloatingControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
        isVisible={controlsVisible || searchQuery !== '' || activeStatus !== 'all'}
      />

      {isLoading ? (
        <div className="ps-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      ) : (
        <div>
          {filteredProperties.length > 0 ? (
            <div className="ps-grid">
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    className="ps-grid-cell"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.07,
                    }}
                  >
                    <PropertyCard
                      property={property}
                      onSelect={handleSelect}
                      index={i}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="ps-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="ps-empty__text">No properties match your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveStatus('all');
                }}
                className="ps-empty__cta"
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

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat: implement asymmetric grid layout with floating controls in PropertySelector"
```

---

## Task 7: Update PropertySkeleton for Asymmetric Grid

**Files:**
- Modify: `src/components/PropertySelector/PropertySkeleton.tsx`

- [ ] **Step 1: Rewrite PropertySkeleton component**

Replace the entire content of `src/components/PropertySelector/PropertySkeleton.tsx`:

```typescript
export default function PropertySkeleton() {
  return (
    <div className="ps-card ps-skeleton">
      <div className="ps-skeleton__image" />
      <div className="ps-skeleton__content">
        <div className="ps-skeleton__name" />
        <div className="ps-skeleton__location" />
      </div>
    </div>
  );
}
```

Add these styles to `src/styles/property-selector-redesign.css`:

```css
/* Skeleton loading */
.ps-skeleton__image {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(242, 236, 228, 0.5) 0%,
    rgba(242, 236, 228, 0.8) 50%,
    rgba(242, 236, 228, 0.5) 100%
  );
  animation: ps-skeleton-shimmer 1.5s infinite;
}

.ps-skeleton__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 var(--ps-card-pad-x) var(--ps-card-pad-bottom);
}

.ps-skeleton__name {
  height: clamp(2rem, 4.5vw, 3.5rem);
  width: 60%;
  background: rgba(36, 36, 36, 0.08);
  border-radius: 2px;
  margin-bottom: 8px;
  animation: ps-skeleton-shimmer 1.5s infinite;
}

.ps-skeleton__location {
  height: 9px;
  width: 35%;
  background: rgba(36, 36, 36, 0.06);
  border-radius: 2px;
  animation: ps-skeleton-shimmer 1.5s infinite;
}

@keyframes ps-skeleton-shimmer {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertySkeleton.tsx src/styles/property-selector-redesign.css
git commit -m "feat: update PropertySkeleton to match asymmetric grid design"
```

---

## Task 8: Test All States and Responsive Behavior

**Files:**
- None (testing only)

- [ ] **Step 1: Start dev server and test in browser**

Run: `npm run dev`

Open: `http://localhost:5173` (or your dev server URL)

Navigate to the property selector screen.

- [ ] **Step 2: Verify default state**

Check:
- Asymmetric grid displays with 5+ properties visible
- Status accent lines appear on left edge of each card
- Property names use EB Garamond italic
- Locations appear below names in uppercase
- Light coastal theme is applied

- [ ] **Step 3: Test hover states**

Check:
- Card images zoom on hover (scale 1.08)
- Card content shifts up 4px
- Status accent line brightens

- [ ] **Step 4: Test floating controls**

Scroll down 100px:
- Floating controls fade in at top-right
- Search icon and filter icon visible

Click search icon:
- Search input expands
- Type "casa" - grid filters smoothly

Click filter icon:
- Filter pills appear
- Click "Available" - grid filters to show only available properties

- [ ] **Step 5: Test empty state**

Search for "xyz123":
- Empty state appears with "No properties match your search"
- Click "Clear filters" - grid returns to full view

- [ ] **Step 6: Test responsive behavior**

Resize browser to 1024px (tablet):
- Grid switches to 4-column layout
- Cards adjust to symmetric 2-column spans

Resize to 640px (mobile):
- Grid switches to single column
- Cards stack vertically
- Floating controls adjust position

- [ ] **Step 7: Test reduced motion**

Enable "Reduce motion" in OS accessibility settings:
- Grid cells appear without stagger animation
- Hover effects disabled
- All transitions instant

- [ ] **Step 8: Commit any fixes**

If you made any CSS adjustments during testing:

```bash
git add src/styles/property-selector-redesign.css
git commit -m "fix: adjust property selector styling after visual testing"
```

---

## Task 9: GridZoom Animation (Future Enhancement)

**Note:** The GridZoom expansion animation is complex and requires GSAP integration. This task is marked as a future enhancement. The current implementation provides the foundation (card selection handler) but does not include the full zoom animation.

**Files:**
- Create: `src/components/PropertySelector/GridZoomAnimation.ts`

- [ ] **Step 1: Document GridZoom implementation approach**

The GridZoom animation requires:
1. GSAP for smooth scale/translate animations
2. Calculating the transform from card position to full viewport
3. Staggered fade-out of other cards
4. Transition to dashboard view

Reference implementation: `C:\Users\aesqu\AppData\Local\Temp\opencode\GridZoom\src\js\grid.js`

Key animation parameters:
- Duration: 1.2s
- Easing: expo.inOut
- Scale: calculated based on card size vs viewport
- Other cards: fade to opacity 0, scale 0.8, stagger 0.17s

This will be implemented in a follow-up task after the core redesign is stable.

---

## Summary

**Completed:**
- Light coastal theme with OKLCH status accent colors
- Asymmetric editorial grid (6-column, mixed cell sizes)
- Status accent lines (not badges)
- Floating search and filter controls
- Redesigned PropertyCard with new typography
- Responsive breakpoints (tablet, mobile)
- Reduced motion support
- Skeleton loading states
- Empty state

**Next Steps:**
- GridZoom expansion animation (Task 9 - future)
- Visual iteration and polish based on user feedback
