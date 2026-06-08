# Portfolio Vault: Full-Viewport Mosaic Grid

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Each task is independent, sequential, and checkpointed before proceeding.

---

## Architecture

We are completely replacing the vertical list paradigm with a **full-viewport mosaic grid** — "The Vault." The concept:

- All 5 properties fill the entire viewport simultaneously. No scrolling on the overview.
- A single 56px header bar sits above the grid (title + filters).
- The grid cells are pure photography — `2px` dark gaps between them, no cards, no borders.
- On hover: a bottom-gradient overlay fades in revealing the property name, location, and status.
- On click: Framer Motion `layoutId` morphs the clicked cell into a full-screen detail overlay. The image grows from its grid position to fill the screen — the GridZoom effect.

**Grid layout (3 cols × 2 rows, 5 cells):**

```
┌────────────────┬────────┬────────┐
│                │   P2   │   P3   │   ← row 1
│      P1        ├────────┼────────┤
│  (spans 2 rows)│   P4   │   P5   │   ← row 2
└────────────────┴────────┴────────┘
  1.8fr           1fr      1fr
```

**Technical stack:**
- CSS Grid with `grid-template-areas` for the asymmetric layout
- `height: calc(100dvh - 56px)` so the grid fills the viewport below the header
- Framer Motion `layoutId` for the zoom-morph animation between grid and detail view
- `AnimatePresence` for the enter/exit of the detail overlay

**New file structure:**

| File | Action | Description |
|---|---|---|
| `PropertyVault.tsx` | NEW | Main grid component. Owns `selectedId` state. Renders header + grid. |
| `VaultCell.tsx` | NEW | Individual grid cell. Manages hover overlay. Fires `onSelect`. |
| `VaultDetail.tsx` | NEW | Full-screen expanded detail overlay. Rendered via `AnimatePresence`. |
| `PropertySelector.tsx` | MODIFY | Swap `EditorialPropertyItem` + `PropertyFilters` orchestration for `PropertyVault`. |
| `EditorialPropertyItem.tsx` | DELETE | No longer used. |
| `PropertyFilters.tsx` | DELETE | Replaced by inline header in `PropertyVault`. |

---

## Task 1: Create `VaultCell.tsx`

**File:** Create `src/components/PropertySelector/VaultCell.tsx`

This is the individual grid cell: a full-bleed photo with a hover overlay revealing the property identity.

- [ ] **Step 1: Create the file**

Create `src/components/PropertySelector/VaultCell.tsx` with this exact content:

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
  onSelect: (id: string) => void;
}

export default function VaultCell({ property, onSelect }: VaultCellProps) {
  const [hovered, setHovered] = useState(false);
  const statusColor = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  return (
    <motion.button
      layoutId={`vault-cell-${property.id}`}
      onClick={() => onSelect(property.id)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden w-full h-full"
      style={{ border: 'none', padding: 0, cursor: 'pointer', display: 'block' }}
      aria-label={`View ${property.name}`}
    >
      {/* Full-bleed photo */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.04 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </picture>
      </motion.div>

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 55%)',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: statusColor }}
              aria-hidden="true"
            />
            <span
              className="font-sans uppercase"
              style={{
                fontSize: '0.5rem',
                fontWeight: 500,
                letterSpacing: '0.25em',
                color: 'rgba(245,241,232,0.7)',
              }}
            >
              {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
            </span>
          </div>
          <p
            className="font-serif text-[#F5F1E8] leading-tight"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.1875rem)', margin: 0 }}
          >
            {property.name}
          </p>
          <p
            className="font-sans uppercase"
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.25em',
              color: 'rgba(245,241,232,0.55)',
              marginTop: '0.25rem',
            }}
          >
            {property.location}
          </p>
        </div>
      </motion.div>
    </motion.button>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

---

## Task 2: Create `VaultDetail.tsx`

**File:** Create `src/components/PropertySelector/VaultDetail.tsx`

This is the full-screen expanded view. When a property is selected, this renders over the grid using `AnimatePresence`. The image morphs from the grid cell via `layoutId`. Text content fades in separately.

- [ ] **Step 1: Create the file**

Create `src/components/PropertySelector/VaultDetail.tsx` with this exact content:

```tsx
import React from 'react';
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

interface VaultDetailProps {
  property: Property | null;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function VaultDetail({ property, onClose, onNavigate }: VaultDetailProps) {
  const statusColor = property
    ? STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available
    : '';

  return (
    <AnimatePresence>
      {property && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(12,12,12,0.85)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Expanded image — shares layoutId with VaultCell */}
          <motion.div
            key="detail"
            layoutId={`vault-cell-${property.id}`}
            className="fixed z-50"
            style={{
              top: '5vh',
              left: '10vw',
              width: '80vw',
              height: '70vh',
              overflow: 'hidden',
            }}
          >
            <picture>
              <source srcSet={property.imageWebp} type="image/webp" />
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </picture>
          </motion.div>

          {/* Text panel — slides up independently */}
          <motion.div
            key="text"
            className="fixed z-50 flex flex-col"
            style={{
              top: 'calc(5vh + 70vh + 24px)',
              left: '10vw',
              width: '80vw',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-sans uppercase"
                    style={{
                      fontSize: '0.5625rem',
                      fontWeight: 500,
                      letterSpacing: '0.25em',
                      color: 'rgba(201,184,160,0.75)',
                    }}
                  >
                    {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
                  </span>
                </div>
                <h2
                  className="font-serif italic text-[#F5F1E8]"
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  {property.name}
                </h2>
                <p
                  className="font-sans uppercase"
                  style={{
                    fontSize: '0.5625rem',
                    letterSpacing: '0.30em',
                    color: 'rgba(201,184,160,0.5)',
                    marginTop: '0.375rem',
                  }}
                >
                  {property.location}
                </p>
              </div>

              <div className="flex items-center gap-6 mt-1">
                {/* Revenue */}
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className="font-sans uppercase"
                    style={{
                      fontSize: '0.5rem',
                      letterSpacing: '0.20em',
                      color: 'rgba(201,184,160,0.5)',
                    }}
                  >
                    YTD Revenue
                  </span>
                  <span
                    className="font-serif text-[#F5F1E8]"
                    style={{ fontSize: '1.5rem' }}
                  >
                    {property.metrics?.revenue ?? '—'}
                  </span>
                </div>

                {/* Enter button */}
                <button
                  onClick={() => onNavigate(property.id)}
                  className="font-sans uppercase"
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 500,
                    letterSpacing: '0.25em',
                    color: '#F5F1E8',
                    background: 'none',
                    border: '1px solid rgba(245,241,232,0.25)',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,241,232,0.7)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,241,232,0.25)';
                  }}
                  aria-label={`Enter ${property.name} dashboard`}
                >
                  Enter Property →
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="font-sans uppercase"
                  style={{
                    fontSize: '0.5625rem',
                    fontWeight: 400,
                    letterSpacing: '0.20em',
                    color: 'rgba(201,184,160,0.5)',
                    background: 'none',
                    border: 'none',
                    padding: '10px 0',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#F5F1E8';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,184,160,0.5)';
                  }}
                  aria-label="Close property detail"
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

**File:** Create `src/components/PropertySelector/PropertyVault.tsx`

This is the main orchestrator. It owns the `selectedId` state, renders the slim header bar, the asymmetric mosaic grid, and the `VaultDetail` overlay.

- [ ] **Step 1: Create the file**

Create `src/components/PropertySelector/PropertyVault.tsx` with this exact content:

```tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import VaultCell from './VaultCell';
import VaultDetail from './VaultDetail';

const STATUS_OPTIONS: { value: OccupancyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

/**
 * CSS grid positions for up to 5 properties.
 *
 * Layout:
 *   cols: 1.8fr 1fr 1fr
 *   rows: 1fr 1fr
 *
 *   [ P0  (row 1-2) ] [ P1 ] [ P2 ]
 *                     [ P3 ] [ P4 ]
 */
const GRID_POSITIONS: Array<React.CSSProperties> = [
  { gridColumn: '1', gridRow: '1 / span 2' }, // hero: left column, full height
  { gridColumn: '2', gridRow: '1' },
  { gridColumn: '3', gridRow: '1' },
  { gridColumn: '2', gridRow: '2' },
  { gridColumn: '3', gridRow: '2' },
];

interface PropertyVaultProps {
  onSelectProperty: (propertyId: string) => void;
}

export default function PropertyVault({ onSelectProperty }: PropertyVaultProps) {
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter(
      (p) => activeStatus === 'all' || p.occupancyStatus === activeStatus,
    );
  }, [activeStatus]);

  const selectedProperty = useMemo(
    () => sampleProperties.find((p) => p.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <div
      className="w-full h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: 'var(--color-canvas, #0c0c0c)' }}
    >
      {/* ── Header bar ── */}
      <header
        className="shrink-0 flex items-center justify-between px-8 md:px-12"
        style={{ height: '56px' }}
      >
        <div className="flex items-baseline gap-4">
          <h1
            className="font-serif text-[#F5F1E8]"
            style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1 }}
          >
            Portfolio
          </h1>
          <span
            className="font-sans uppercase"
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.25em',
              color: 'rgba(201,184,160,0.4)',
            }}
          >
            {filteredProperties.length} of {sampleProperties.length}
          </span>
        </div>

        {/* Filter pills */}
        <nav className="flex items-center gap-5" aria-label="Filter by status">
          {STATUS_OPTIONS.map(({ value, label }) => {
            const isActive = activeStatus === value;
            return (
              <button
                key={value}
                onClick={() => setActiveStatus(value)}
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
                    layoutId="vaultFilter"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#F5F1E8]"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── Mosaic grid ── */}
      <div
        className="flex-1 min-h-0"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '2px',
        }}
        role="list"
        aria-label="Property grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredProperties.slice(0, 5).map((property, i) => (
            <div
              key={property.id}
              role="listitem"
              style={GRID_POSITIONS[i] ?? {}}
            >
              <VaultCell
                property={property}
                onSelect={(id) => setSelectedId(id)}
              />
            </div>
          ))}
        </AnimatePresence>

        {/* Empty state — shown when filters yield 0 results */}
        {filteredProperties.length === 0 && (
          <motion.div
            style={{ gridColumn: '1 / -1', gridRow: '1 / -1' }}
            className="flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p
              className="font-sans uppercase"
              style={{
                fontSize: '0.5625rem',
                letterSpacing: '0.20em',
                color: 'rgba(201,184,160,0.4)',
              }}
            >
              No properties match your criteria.
            </p>
            <button
              onClick={() => setActiveStatus('all')}
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

      {/* ── Detail overlay ── */}
      <VaultDetail
        property={selectedProperty}
        onClose={() => setSelectedId(null)}
        onNavigate={(id) => {
          setSelectedId(null);
          onSelectProperty(id);
        }}
      />
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

## Task 4: Wire `PropertyVault` into `PropertySelector`

**File:** Modify `src/components/PropertySelector/PropertySelector.tsx`

Replace the entire interior of `PropertySelector` with a single `<PropertyVault>` delegation. `PropertySelector` stays as the thin interface boundary the rest of the app uses — it just now renders the new vault layout.

- [ ] **Step 1: Overwrite `PropertySelector.tsx`**

Replace the entire contents:

```tsx
import React from 'react';
import { ScreenType } from '../../types';
import PropertyVault from './PropertyVault';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

export default function PropertySelector({
  onSelectProperty,
}: PropertySelectorProps) {
  return <PropertyVault onSelectProperty={onSelectProperty} />;
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

---

## Task 5: Clean up — delete deprecated files

**Files to delete:**
- `src/components/PropertySelector/EditorialPropertyItem.tsx`
- `src/components/PropertySelector/PropertyFilters.tsx`

These files are fully replaced by `PropertyVault.tsx`, `VaultCell.tsx`, and `VaultDetail.tsx`.

- [ ] **Step 1: Delete the files**

Using whatever file-deletion API is available in your environment, delete:

1. `src/components/PropertySelector/EditorialPropertyItem.tsx`
2. `src/components/PropertySelector/PropertyFilters.tsx`

Do NOT use `rm` on the command line. Use the environment's file-deletion tool.

- [ ] **Step 2: Final TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors only. If there are import errors from the deleted files, search for any remaining imports of `EditorialPropertyItem` or `PropertyFilters` in the codebase and remove them.

---

## Self-Review

**Spec coverage:**
- ✅ All 5 properties visible in a single viewport — zero scrolling on overview
- ✅ Asymmetric grid composition creates immediate visual hierarchy
- ✅ Full-bleed photography, 2px gaps — no dead space whatsoever
- ✅ Hover reveals identity without cluttering the resting state
- ✅ GridZoom-inspired morph animation via Framer Motion `layoutId`
- ✅ Design system: EB Garamond upright for `h1`, italic only for property name in detail view (per DESIGN.md hero moment rule)
- ✅ Filter pills preserved in the slim header bar
- ✅ Keyboard accessible: all interactive elements are `<button>`
- ✅ ARIA: `role="list"` / `role="listitem"`, `aria-label` on all buttons
- ✅ `AnimatePresence` handles filter-change transitions in the grid
- ✅ Empty state for when filters yield 0 results

**Placeholder scan:** No TBDs, no vague instructions, all code blocks are complete and ready to paste.
