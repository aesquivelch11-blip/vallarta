# Portfolio View Full Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all P1/P2 critique issues and implement a two-tier density model so 3+ properties are visible above the fold while preserving the editorial brand identity.

**Architecture:** Four targeted tasks across two components. The centerpiece is a two-tier density model splitting `EditorialPropertyItem` into a `featured` (index 0) and `compact` (index > 0) visual register — large image + dramatic type for the first property, thumbnail + tight type for the rest. Supporting fixes address the typographic system violation on the `h1`, the chrome dead-space, status label contrast, and keyboard accessibility of property items.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, Framer Motion (`motion/react`)

---

### Task 1: Fix `h1` italic violation + collapse header chrome

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

Context: `PropertySelector.tsx` line 55 has `className="font-serif italic"` on `<h1>Portfolio</h1>`. DESIGN.md explicitly forbids italic for headings — italic is reserved for property names, performance asides, and guest names. Separately, `pt-16 pb-12` on the header (112px) plus `mb-16` on the filter wrapper (64px) consumes ~308px of viewport before content begins. We reduce this to ~160px, immediately gaining ~150px of visible content space.

- [ ] **Step 1: Remove italic from `h1` and tighten header padding**

In `src/components/PropertySelector/PropertySelector.tsx`, replace the `<header>` block:

Before:
```tsx
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
```

After:
```tsx
      <header
        className="pt-8 pb-4 px-8 md:px-16 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4"
      >
        <h1
          className="font-serif"
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            lineHeight: 1,
            color: 'var(--color-ink, #F5F1E8)',
          }}
        >
          Portfolio
        </h1>
        <span
          className="font-sans uppercase mb-1"
          style={{
            fontSize: '0.625rem',
            letterSpacing: '0.20em',
            color: 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
          }}
        >
          {filteredProperties.length} of {sampleProperties.length} Properties
        </span>
      </header>
```

- [ ] **Step 2: Reduce filter wrapper bottom margin and list bottom padding**

In the same file, find the filter wrapper div and the lookbook stack div:

Before:
```tsx
      {/* Filters */}
      <div className="px-8 md:px-16 max-w-7xl mx-auto mb-16">
```

After:
```tsx
      {/* Filters */}
      <div className="px-8 md:px-16 max-w-7xl mx-auto mb-6">
```

And reduce the bottom padding on the list:

Before:
```tsx
      {/* Lookbook Stack */}
      <div className="px-8 md:px-16 max-w-7xl mx-auto pb-32">
```

After:
```tsx
      {/* Lookbook Stack */}
      <div className="px-8 md:px-16 max-w-7xl mx-auto pb-16">
```

- [ ] **Step 3: TypeScript check**

Run:
```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors in `DashboardDomainNav.tsx` and `NavMenuView.tsx`. Zero new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "fix(PropertySelector): remove italic h1 violation, collapse header chrome"
```

---

### Task 2: Implement two-tier density model in EditorialPropertyItem

**Files:**
- Modify: `src/components/PropertySelector/EditorialPropertyItem.tsx`

Context: We split the single item into two visual registers. `index === 0` renders as **Featured** — image at `48%` width, `3:2` ratio, property name at `clamp(1.5rem, 2.5vw, 2rem)`. `index > 0` renders as **Compact** — image at `30%` width, `1:1` square ratio, property name at `1.0625rem`. The compact variant still alternates image left/right for visual rhythm, but at a tighter scale. Both variants use the same divider-rhythm pattern already in place.

- [ ] **Step 1: Overwrite EditorialPropertyItem.tsx with the two-tier layout**

Replace the entire contents of `src/components/PropertySelector/EditorialPropertyItem.tsx`:

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
  const isFeatured = index === 0;
  const isEven = index % 2 === 0;
  const statusColor = STATUS_COLORS[property.occupancyStatus] ?? STATUS_COLORS.available;

  return (
    <motion.div
      className={`flex flex-col md:flex-row gap-6 lg:gap-10 items-center w-full py-6 ${
        index > 0 ? 'border-t' : ''
      } ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      style={{ borderColor: 'var(--color-border-subtle, rgba(255,255,255,0.06))' }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Container */}
      <button
        className={`relative overflow-hidden cursor-pointer group shrink-0 w-full ${
          isFeatured ? 'md:w-[48%]' : 'md:w-[30%]'
        }`}
        onClick={() => onSelect(property.id)}
        aria-label={`View details for ${property.name}`}
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: isFeatured ? '3/2' : '1/1' }}
        >
          <picture>
            <source srcSet={property.imageWebp} type="image/webp" />
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </picture>
        </div>
      </button>

      {/* Text Content */}
      <div className="w-full flex flex-col items-start px-4 md:px-0">
        <div className="flex items-center gap-2 mb-3">
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
              letterSpacing: '0.20em',
              color: 'var(--color-ink-secondary, rgba(201,184,160,0.85))',
            }}
          >
            {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
          </span>
        </div>

        <button
          className="text-left font-serif text-[var(--color-ink,#F5F1E8)] mb-1 cursor-pointer transition-opacity hover:opacity-75"
          style={{
            fontSize: isFeatured ? 'clamp(1.5rem, 2.5vw, 2rem)' : '1.0625rem',
            lineHeight: 1.1,
            background: 'none',
            border: 'none',
            padding: 0,
          }}
          onClick={() => onSelect(property.id)}
          aria-label={`Open ${property.name}`}
        >
          {property.name}
        </button>

        <span
          className="font-sans uppercase mb-4"
          style={{
            fontSize: '0.5625rem',
            letterSpacing: '0.25em',
            color: 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
          }}
        >
          {property.location}
        </span>

        <div className="flex flex-col gap-0.5">
          <span
            className="font-sans uppercase"
            style={{
              fontSize: '0.5625rem',
              letterSpacing: '0.15em',
              color: 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
            }}
          >
            YTD Revenue
          </span>
          <span
            className="font-serif text-[var(--color-ink,#F5F1E8)]"
            style={{ fontSize: isFeatured ? '1.5rem' : '1.125rem' }}
          >
            {property.metrics?.revenue ?? '—'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: TypeScript check**

Run:
```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors from our file.

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/EditorialPropertyItem.tsx
git commit -m "feat(EditorialPropertyItem): implement two-tier featured/compact density model"
```

---

### Task 3: Fix status label contrast + search icon overlap

**Files:**
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

Context: The status filter button labels are at `rgba(201,184,160,0.5)` — approximately 2:1 contrast on the dark canvas, far below WCAG AA (4.5:1). We also need to add `pr-6` to the search input so typed text does not overlap the search icon.

- [ ] **Step 1: Fix inactive status filter contrast**

In `src/components/PropertySelector/PropertyFilters.tsx`, find the button's style object for `color`:

Before:
```tsx
                color: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'var(--color-ink-secondary, rgba(201,184,160,0.5))',
```

After:
```tsx
                color: isActive
                  ? 'var(--color-ink, #F5F1E8)'
                  : 'var(--color-ink-secondary, rgba(201,184,160,0.75))',
```

- [ ] **Step 2: Fix search input overlapping with icon**

In `src/components/PropertySelector/PropertyFilters.tsx`, find the `<input>` className:

Before:
```tsx
          className="w-full bg-transparent text-[var(--color-ink, #F5F1E8)] placeholder:text-[var(--color-ink-secondary, rgba(201,184,160,0.3))] font-sans outline-none pb-2 border-b border-transparent focus:border-[var(--color-ink-secondary, rgba(201,184,160,0.3))] transition-colors"
```

After:
```tsx
          className="w-full bg-transparent text-[var(--color-ink, #F5F1E8)] placeholder:text-[var(--color-ink-secondary, rgba(201,184,160,0.3))] font-sans outline-none pb-2 pr-6 border-b border-transparent focus:border-[var(--color-ink-secondary, rgba(201,184,160,0.3))] transition-colors"
```

- [ ] **Step 3: TypeScript check**

Run:
```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertyFilters.tsx
git commit -m "fix(PropertyFilters): improve status label contrast, fix search icon overlap"
```

---

### Task 4: Fix `h2` keyboard accessibility for screen readers

**Files:**
- Modify: `src/components/PropertySelector/EditorialPropertyItem.tsx`

Context: Task 2 already converts the property name from `<h2 onClick>` to `<button>` — this is the correct fix. This task exists to verify that work is complete and add the correct ARIA role so the list of properties is navigable by screen reader users as a `list` + `listitem` structure.

- [ ] **Step 1: Verify button wraps were applied correctly in Task 2**

Open `src/components/PropertySelector/EditorialPropertyItem.tsx` and confirm:
- The image container is a `<button>` element with `aria-label={`View details for ${property.name}`}`
- The property name is a `<button>` element with `aria-label={`Open ${property.name}`}`

If either is still a `<div>` or `<h2>` with only `onClick`, apply the button wrapper from the Task 2 code above.

- [ ] **Step 2: Add ARIA list semantics to PropertySelector**

In `src/components/PropertySelector/PropertySelector.tsx`, the inner flex container should be a `<ul>` (unordered list) so screen readers announce "list of N items".

Before:
```tsx
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, i) => (
              <EditorialPropertyItem 
                key={property.id} 
                property={property} 
                index={i} 
                onSelect={handleSelect} 
              />
```

After:
```tsx
        <ul className="flex flex-col list-none m-0 p-0" role="list">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, i) => (
              <EditorialPropertyItem 
                key={property.id} 
                property={property} 
                index={i} 
                onSelect={handleSelect} 
              />
```

And close with `</ul>` instead of `</div>`.

- [ ] **Step 3: Add `role="listitem"` to EditorialPropertyItem's outer `motion.div`**

In `src/components/PropertySelector/EditorialPropertyItem.tsx`, add `role="listitem"` to the outer `motion.div`:

Before:
```tsx
    <motion.div
      className={`flex flex-col md:flex-row gap-6 lg:gap-10 items-center w-full py-6 ${
```

After:
```tsx
    <motion.div
      role="listitem"
      className={`flex flex-col md:flex-row gap-6 lg:gap-10 items-center w-full py-6 ${
```

- [ ] **Step 4: Final TypeScript check**

Run:
```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors. Zero new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/PropertySelector/EditorialPropertyItem.tsx src/components/PropertySelector/PropertySelector.tsx
git commit -m "fix(PropertySelector): add ARIA list semantics and keyboard-accessible property items"
```

---

## Self-Review

**Spec coverage:**
- ✅ P1 — Header chrome collapsed by ~150px (Task 1)
- ✅ P1 — `h1` italic violation fixed (Task 1)
- ✅ P1 — Two-tier density: 3+ properties visible above fold (Task 2)
- ✅ P2 — Status label contrast raised from ~2:1 to ~4:1 (Task 3)
- ✅ P2 — Property name scaled to context (featured vs. compact) (Task 2)
- ✅ P3 — `pb-32` reduced to `pb-16` (Task 1)
- ✅ Minor — Search icon overlap fixed with `pr-6` (Task 3)
- ✅ Accessibility — Property items keyboard-navigable via `<button>` (Task 2)
- ✅ Accessibility — ARIA list semantics added (Task 4)

**Placeholder scan:** No TBDs, no vague instructions, all code blocks complete.

**Type consistency:** `isFeatured` boolean used consistently in Task 2. No new types introduced. `role="listitem"` is a valid HTML attribute accepted by React's JSX typings.
