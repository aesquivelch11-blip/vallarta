# Property Vault — GridZoom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Each task is self-contained. Run `npx tsc --noEmit` after every task. Two pre-existing TypeScript errors in `DashboardDomainNav.tsx` and `NavMenuView.tsx` are expected and must not be counted as failures.

**Goal:** Replace the vertical list layout with a full-viewport asymmetric grid where clicking any property cell triggers a smooth GridZoom-inspired expand animation — the image grows from its grid position into a centered full-screen preview panel, using Framer Motion's shared layout animation (`layoutId`).

**Architecture:** All animation happens within a single mounted component — no cross-route transitions. The grid stays rendered beneath a dimmed backdrop; the selected cell's image element is promoted via `layoutId` into a large overlay panel. Closing it reverses the animation. The "Enter Property" CTA in the overlay triggers normal App navigation to the dashboard. The grid is a CSS Grid that wraps gracefully for 5–12 properties.

**Tech stack:** React 18, Framer Motion (`motion/react`), CSS Grid, TypeScript, Tailwind utility classes

---

## How the animation works (read before implementing)

GridZoom is a **FLIP animation** (First, Last, Invert, Play). Here is the exact mechanic:

1. Every grid cell's photo is wrapped in `<motion.div layoutId="vault-img-{id}">`.
2. When a user clicks a cell, we set `selectedId = property.id`.
3. `VaultPreview` mounts and also renders `<motion.div layoutId="vault-img-{id}">` in a fixed, centered position.
4. Framer Motion sees two elements sharing the same `layoutId`. It records the grid cell's bounding rect (the **First** position), then renders the overlay element in its final position (the **Last** position), computes the delta (**Invert**), and plays the animation (**Play**) — the image appears to grow from the grid cell to the center of the screen.
5. The grid cell image is hidden (`opacity: 0`) but **stays in the DOM** — this is critical. If it unmounts, Framer Motion cannot measure its bounding rect and the reverse animation (closing the preview) breaks.
6. On close, `VaultPreview` unmounts and the reverse FLIP plays: the image shrinks back to the grid cell position, then the cell's opacity returns to 1.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/PropertySelector/VaultCell.tsx` | **NEW** | Grid cell: full-bleed photo + hover overlay + `layoutId` on image |
| `src/components/PropertySelector/VaultPreview.tsx` | **NEW** | Zoom overlay: shared `layoutId` image + property details + CTA |
| `src/components/PropertySelector/PropertyVault.tsx` | **NEW** | Grid orchestrator: CSS Grid layout, filter state, `selectedId` state |
| `src/components/PropertySelector/PropertySelector.tsx` | **MODIFY** | Thin wrapper — delegates to `PropertyVault` |
| `src/components/PropertySelector/EditorialPropertyItem.tsx` | **DELETE** | Replaced |
| `src/components/PropertySelector/PropertyFilters.tsx` | **DELETE** | Replaced by inline header in `PropertyVault` |

---

## Task 1: Create `VaultCell.tsx`

**Files:**
- Create: `src/components/PropertySelector/VaultCell.tsx`

- [ ] **Step 1: Create the file**

```tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Property } from '../../types';

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

interface VaultCellProps {
  property: Property;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function VaultCell({ property, isSelected, onSelect }: VaultCellProps) {
  const [hovered, setHovered] = useState(false);
  const statusColor = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  return (
    <button
      className="relative overflow-hidden w-full h-full block"
      style={{
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        // Keep in DOM when selected (opacity 0, NOT display:none) so Framer Motion
        // can measure this element's position for the reverse zoom animation.
        opacity: isSelected ? 0 : 1,
        transition: 'opacity 0.1s',
        minHeight: '180px',
      }}
      onClick={() => onSelect(property.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Select ${property.name}`}
      aria-pressed={isSelected}
    >
      {/* Photo — shares layoutId with VaultPreview for the zoom FLIP */}
      <motion.div
        layoutId={`vault-img-${property.id}`}
        className="absolute inset-0"
        style={{ borderRadius: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      >
        <motion.div
          className="w-full h-full"
          animate={{ scale: hovered && !isSelected ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <picture>
            <source srcSet={property.imageWebp} type="image/webp" />
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Hover identity overlay — hidden at rest, appears on hover */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.0) 55%)',
        }}
        animate={{ opacity: hovered && !isSelected ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        aria-hidden="true"
      >
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: statusColor }}
            />
            <span
              className="font-sans uppercase"
              style={{ fontSize: '0.5rem', fontWeight: 500, letterSpacing: '0.25em', color: 'rgba(245,241,232,0.75)' }}
            >
              {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
            </span>
          </div>
          <p
            className="font-serif text-[#F5F1E8] leading-none"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)', margin: 0 }}
          >
            {property.name}
          </p>
          <p
            className="font-sans uppercase"
            style={{ fontSize: '0.5rem', letterSpacing: '0.25em', color: 'rgba(245,241,232,0.5)', margin: '4px 0 0' }}
          >
            {property.location}
          </p>
        </div>
      </motion.div>
    </button>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

---

## Task 2: Create `VaultPreview.tsx`

**Files:**
- Create: `src/components/PropertySelector/VaultPreview.tsx`

- [ ] **Step 1: Create the file**

```tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Property } from '../../types';

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

interface VaultPreviewProps {
  property: Property | null;
  onClose: () => void;
  onEnter: (propertyId: string) => void;
}

export default function VaultPreview({ property, onClose, onEnter }: VaultPreviewProps) {
  const statusColor = property
    ? (STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available)
    : '';

  // Escape key closes the preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (property) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [property, onClose]);

  return (
    <AnimatePresence>
      {property && (
        <>
          {/* Backdrop */}
          <motion.div
            key="vault-backdrop"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(12, 12, 12, 0.88)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />

          {/* Expanded image — SHARED LAYOUT with VaultCell via layoutId.
              Framer Motion reads the grid cell's bounding rect as the start position
              and animates FROM there TO this fixed, centered position. */}
          <motion.div
            key="vault-preview-img"
            layoutId={`vault-img-${property.id}`}
            className="fixed z-50"
            style={{
              top: '8vh',
              left: '50%',
              x: '-50%',
              width: 'min(80vw, 960px)',
              aspectRatio: '16 / 9',
              overflow: 'hidden',
              borderRadius: '2px',
            }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            <picture>
              <source srcSet={property.imageWebp} type="image/webp" />
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-full object-cover"
                style={{ display: 'block' }}
              />
            </picture>
          </motion.div>

          {/* Details panel — slides up from below the image */}
          <motion.div
            key="vault-preview-details"
            className="fixed z-50"
            style={{
              top: 'calc(8vh + min(80vw, 960px) * 9 / 16 + 24px)',
              left: '50%',
              x: '-50%',
              width: 'min(80vw, 960px)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-6">
              {/* Left: Identity */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-sans uppercase"
                    style={{ fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.25em', color: 'rgba(201,184,160,0.75)' }}
                  >
                    {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
                  </span>
                </div>

                {/* Property name: italic per DESIGN.md — this is a hero moment */}
                <h2
                  className="font-serif italic text-[#F5F1E8] leading-none"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', margin: 0 }}
                >
                  {property.name}
                </h2>

                <p
                  className="font-sans uppercase"
                  style={{ fontSize: '0.5625rem', letterSpacing: '0.30em', color: 'rgba(201,184,160,0.5)', margin: '6px 0 0' }}
                >
                  {property.location}
                </p>
              </div>

              {/* Right: Metrics + Actions */}
              <div className="flex items-center gap-8 shrink-0">
                {/* YTD Revenue */}
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className="font-sans uppercase"
                    style={{ fontSize: '0.5rem', letterSpacing: '0.20em', color: 'rgba(201,184,160,0.5)' }}
                  >
                    YTD Revenue
                  </span>
                  <span className="font-serif text-[#F5F1E8]" style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                    {property.metrics?.revenue ?? '—'}
                  </span>
                </div>

                {/* Enter Property CTA */}
                <button
                  onClick={() => onEnter(property.id)}
                  className="font-sans uppercase"
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 500,
                    letterSpacing: '0.25em',
                    color: '#F5F1E8',
                    background: 'none',
                    border: '1px solid rgba(245,241,232,0.3)',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(245,241,232,0.75)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,241,232,0.3)'; }}
                  aria-label={`Open ${property.name} dashboard`}
                >
                  Enter Property →
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="font-sans uppercase"
                  style={{
                    fontSize: '0.5625rem',
                    letterSpacing: '0.20em',
                    color: 'rgba(201,184,160,0.5)',
                    background: 'none',
                    border: 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#F5F1E8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,184,160,0.5)'; }}
                  aria-label="Close preview"
                >
                  esc
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

---

## Task 3: Create `PropertyVault.tsx`

**Files:**
- Create: `src/components/PropertySelector/PropertyVault.tsx`

Grid column logic:
- 1–3 properties → `1fr` (single column, full width)
- 4–6 properties → `1.6fr 1fr` (asymmetric two columns, left col dominant)
- 7+ properties → `1.6fr 1fr 1fr` (three columns, scrolls at fixed `280px` row height)

- [ ] **Step 1: Create the file**

```tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import VaultCell from './VaultCell';
import VaultPreview from './VaultPreview';

const STATUS_OPTIONS: { value: OccupancyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

function getGridColumns(count: number): string {
  if (count <= 3) return '1fr';
  if (count <= 6) return '1.6fr 1fr';
  return '1.6fr 1fr 1fr';
}

function getGridAutoRows(count: number): string {
  if (count <= 3) return 'calc(100dvh - 56px)';
  if (count <= 6) return `calc((100dvh - 56px) / ${Math.ceil(count / 2)})`;
  return '280px';
}

interface PropertyVaultProps {
  onSelectProperty: (propertyId: string) => void;
}

export default function PropertyVault({ onSelectProperty }: PropertyVaultProps) {
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredProperties = useMemo(
    () => sampleProperties.filter((p) => activeStatus === 'all' || p.occupancyStatus === activeStatus),
    [activeStatus],
  );

  const selectedProperty = useMemo(
    () => (selectedId ? (sampleProperties.find((p) => p.id === selectedId) ?? null) : null),
    [selectedId],
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleClose = useCallback(() => setSelectedId(null), []);

  const handleEnter = useCallback(
    (propertyId: string) => {
      setSelectedId(null);
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );

  return (
    <div
      className="w-full flex flex-col"
      style={{ height: '100dvh', background: 'var(--color-canvas, #0c0c0c)', overflow: 'hidden' }}
    >
      {/* Slim header bar — 56px */}
      <header
        className="shrink-0 flex items-center justify-between px-8 md:px-12 border-b"
        style={{ height: '56px', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-baseline gap-4">
          <h1
            className="font-serif text-[#F5F1E8]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1 }}
          >
            Portfolio
          </h1>
          <span
            className="font-sans uppercase"
            style={{ fontSize: '0.5rem', letterSpacing: '0.25em', color: 'rgba(201,184,160,0.4)' }}
          >
            {filteredProperties.length} of {sampleProperties.length}
          </span>
        </div>

        <nav className="flex items-center gap-5" aria-label="Filter properties by status">
          {STATUS_OPTIONS.map(({ value, label }) => {
            const isActive = activeStatus === value;
            return (
              <button
                key={value}
                onClick={() => { setActiveStatus(value); setSelectedId(null); }}
                className="relative font-sans uppercase"
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.22em',
                  color: isActive ? '#F5F1E8' : 'rgba(201,184,160,0.55)',
                  background: 'none',
                  border: 'none',
                  padding: '4px 0',
                  cursor: 'pointer',
                  transition: 'color 0.25s ease',
                }}
                aria-pressed={isActive}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="vaultActiveFilter"
                    className="absolute -bottom-px left-0 right-0 h-px bg-[#F5F1E8]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Mosaic grid */}
      <div className="flex-1 min-h-0 overflow-y-auto" role="list" aria-label="Property grid">
        {filteredProperties.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: getGridColumns(filteredProperties.length),
              gridAutoRows: getGridAutoRows(filteredProperties.length),
              gap: '2px',
              minHeight: '100%',
            }}
          >
            {filteredProperties.map((property) => (
              <div key={property.id} role="listitem">
                <VaultCell
                  property={property}
                  isSelected={selectedId === property.id}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p
              className="font-sans uppercase"
              style={{ fontSize: '0.5625rem', letterSpacing: '0.20em', color: 'rgba(201,184,160,0.4)' }}
            >
              No properties match your criteria.
            </p>
            <button
              onClick={() => { setActiveStatus('all'); setSelectedId(null); }}
              className="font-sans uppercase"
              style={{
                fontSize: '0.5rem',
                fontWeight: 500,
                letterSpacing: '0.25em',
                color: '#F5F1E8',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(245,241,232,0.3)',
                padding: '6px 0',
                cursor: 'pointer',
              }}
            >
              Clear filter
            </button>
          </motion.div>
        )}
      </div>

      {/* Zoom overlay */}
      <VaultPreview property={selectedProperty} onClose={handleClose} onEnter={handleEnter} />
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

---

## Task 4: Rewire `PropertySelector.tsx`

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Overwrite the file**

```tsx
import React from 'react';
import { ScreenType } from '../../types';
import PropertyVault from './PropertyVault';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

/**
 * PropertySelector — thin interface boundary.
 * All logic lives in PropertyVault. This file exists so App.tsx needs zero changes.
 */
export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  return <PropertyVault onSelectProperty={onSelectProperty} />;
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

---

## Task 5: Delete deprecated files

**Files:**
- Delete: `src/components/PropertySelector/EditorialPropertyItem.tsx`
- Delete: `src/components/PropertySelector/PropertyFilters.tsx`

- [ ] **Step 1: Delete both files using the IDE or environment file API**

Do NOT use `rm` on the command line. Use the file system tool available in your environment.

- [ ] **Step 2: Check for dangling imports**

```bash
npx grep -r "EditorialPropertyItem\|PropertyFilters" src/
```

Expected: zero results. If any remain, remove those import statements.

- [ ] **Step 3: Final TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors only. No new errors.

---

## Self-Review

**Spec coverage:**
- All properties visible simultaneously in a single viewport (CSS Grid, no scroll for ≤6)
- Handles 7–12 properties gracefully (fixed `280px` row height + scrolling)
- GridZoom FLIP animation: `layoutId` shared element between cell and preview panel
- Animation is within the same page — no cross-route complexity
- Grid cell hides (`opacity: 0`) on selection but stays mounted — required for reverse FLIP
- Hover overlay: dark gradient + name + status + location — hidden at rest
- Preview: property name (italic, DESIGN.md hero rule), location, status, YTD revenue, CTA, esc close
- Escape key closes preview
- Filter change closes any open preview
- Clicking the same cell again toggles the preview closed
- `PropertySelector.tsx` interface unchanged — `App.tsx` zero changes needed
- TypeScript: no new errors beyond pre-existing two

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:** `Property` and `OccupancyStatus` from `../../types` used consistently across all files. `selectedId: string | null` maps correctly to `VaultCell.isSelected` and `selectedProperty` lookup.
