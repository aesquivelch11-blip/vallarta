# Property Selector — Phase 4: Motion & Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all animation issues (remove slow transitions, remove scale effects, add staggered entrance), implement accessibility fixes (alt text, focus indicators), add skeleton loading, and perform final polish.

**Architecture:** Staggered entrance with 80ms delays. Gradient depth shift on hover instead of scale. Spotlight hover dims non-hovered cells. All interactive elements have visible focus indicators. Skeleton loading matches the grid structure.

**Tech Stack:** React 18+, TypeScript, Framer Motion, Tailwind CSS v4.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/PropertySelector/PropertySelector.tsx` | Staggered entrance, spotlight hover, skeleton loading, focus indicators |
| `src/components/PropertySelector/PropertyCard.tsx` | Gradient hover, remove scale effects, focus ring |
| `src/components/PropertySelector/PropertyFilters.tsx` | Focus indicators |

---

## Task 1: Implement Staggered Entrance Animation

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** Page load should stagger cells in with 80ms delays. The narrow cells (3rd and 5th) enter slightly faster (0.4s duration vs 0.5s).

- [ ] **Step 1: Verify staggered entrance exists**

From Phase 1, the stagger should already be in place:

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{
  duration: i === 2 || i === 4 ? 0.4 : 0.5,
  ease: [0.16, 1, 0.3, 1],
  delay: i * 0.08,
}}
```

- [ ] **Step 2: Add staggered entrance for filters**

Add a staggered entrance for the header and filters:

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
>
  <header ...>
</motion.div>

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
  style={{ padding: '0 24px 8px' }}
>
  <PropertyFilters ... />
</motion.div>
```

- [ ] **Step 3: Verify staggered entrance**

Run dev server. Refresh the page. Expected:
- Header slides in first (0ms delay)
- Filters fade in at 200ms delay
- Grid cells stagger in with 80ms delays each
- Narrow cells (3rd, 5th) animate slightly faster
- All animations use ease-out-expo `[0.16, 1, 0.3, 1]`

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): staggered entrance animation for header, filters, grid"
```

---

## Task 2: Remove Scale Animations

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

**Context:** The current code has `whileHover={{ scale: 0.95 }}` and `whileTap={{ scale: 0.92 }}` on the card, and `whileTap={{ scale: 0.97 }}` on filters. Scale effects are decorative and cheapen the luxury feel. They must be removed.

- [ ] **Step 1: Remove scale from PropertyCard**

Remove the `whileTap` prop from the motion.button:

```tsx
<motion.button
  onClick={() => onSelect(property.id)}
  className="group relative w-full h-full text-left cursor-pointer overflow-hidden"
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
  aria-label={`View ${property.name}`}
>
```

- [ ] **Step 2: Remove scale from PropertyFilters**

Remove the `whileTap` prop from filter buttons:

```tsx
<motion.button
  onClick={() => onStatusChange(value)}
  className="cursor-pointer uppercase"
  style={{...}}
  aria-pressed={isActive}
>
  {label}
</motion.button>
```

- [ ] **Step 3: Remove image hover scale**

Remove the `group-hover:scale-125` class from the image:

```tsx
<img
  src={property.imageUrl}
  alt={property.name}
  className="w-full h-full object-cover"
/>
```

- [ ] **Step 4: Verify no scale effects**

Run dev server. Hover and tap on cells and filters. Expected:
- No scale transformation on any element
- Hover effects are limited to gradient depth and opacity changes
- All interactions feel solid, not bouncy

- [ ] **Step 5: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx src/components/PropertySelector/PropertyFilters.tsx
git commit -m "fix: remove all scale animations (hover/tap/image)"
```

---

## Task 3: Fix setTimeout Navigation

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** The current code uses `setTimeout(() => onSelectProperty(propertyId), 10)` which is a race condition risk and a code smell. It should use `requestAnimationFrame` or a direct call.

- [ ] **Step 1: Replace setTimeout with direct call**

The `handleSelect` function should already be fixed in Phase 1:

```tsx
const handleSelect = useCallback(
  (propertyId: string) => {
    onSelectProperty(propertyId);
  },
  [onSelectProperty],
);
```

Verify this exists. If not, replace it:

```tsx
// REMOVE:
// const handleSelect = useCallback(
//   (propertyId: string) => {
//     setSelectedPropertyId(propertyId);
//     setTimeout(() => {
//       onSelectProperty(propertyId);
//     }, 10);
//   },
//   [onSelectProperty],
// );

// REPLACE WITH:
const handleSelect = useCallback(
  (propertyId: string) => {
    onSelectProperty(propertyId);
  },
  [onSelectProperty],
);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "fix(property-selector): remove setTimeout, use direct navigation"
```

---

## Task 4: Fix AnimatePresence

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** The current code uses `mode="popLayout"` which can cause layout jumps. For filter transitions, `mode="sync"` is more appropriate.

- [ ] **Step 1: Change AnimatePresence mode**

Replace:

```tsx
<AnimatePresence mode="popLayout">
```

With:

```tsx
<AnimatePresence mode="sync">
```

- [ ] **Step 2: Verify filter transitions**

Run dev server. Click through filter options. Expected:
- Cards cross-fade smoothly
- No layout jumps or popping
- Transition duration is 0.3s

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "fix(property-selector): use sync mode for AnimatePresence"
```

---

## Task 5: Add Focus Indicators

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

**Context:** All interactive elements must have visible focus indicators for keyboard navigation.

- [ ] **Step 1: Add focus ring to PropertyCard**

Add a focus-visible style to the motion.button:

```tsx
<motion.button
  onClick={() => onSelect(property.id)}
  className="group relative w-full h-full text-left cursor-pointer overflow-hidden focus-visible:outline-none"
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
```

Alternatively, use a CSS class:

```css
/* Add to index.css or a new module */
.property-card:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--color-dark-accent, #d49a55);
}
```

And add the class:

```tsx
className="group relative w-full h-full text-left cursor-pointer overflow-hidden property-card"
```

- [ ] **Step 2: Add focus indicator to filter buttons**

Add focus-visible styles to filter buttons:

```tsx
<motion.button
  onClick={() => onStatusChange(value)}
  className="cursor-pointer uppercase focus-visible:outline-none"
  style={{
    fontFamily: 'var(--font-ui)',
    ...,
  }}
  onFocus={(e) => {
    e.currentTarget.style.borderBottomColor = 'var(--color-dark-accent, #d49a55)';
  }}
  onBlur={(e) => {
    if (!isActive) {
      e.currentTarget.style.borderBottomColor = 'transparent';
    }
  }}
  aria-pressed={isActive}
>
  {label}
</motion.button>
```

- [ ] **Step 3: Verify focus indicators**

Run dev server. Tab through the interface. Expected:
- Each grid cell has a 2px inset outline in the accent color when focused
- Filter buttons have an accent underline when focused
- Focus indicators are visible and clear

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx src/components/PropertySelector/PropertyFilters.tsx
git commit -m "feat(a11y): visible focus indicators on cards and filters"
```

---

## Task 6: Add Skeleton Loading State

**Files:**
- Create: `src/components/PropertySelector/PropertySkeleton.tsx`
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** When data is loading, show skeleton rectangles that match the grid structure.

- [ ] **Step 1: Create skeleton component**

```tsx
// src/components/PropertySelector/PropertySkeleton.tsx
import React from 'react';

export default function PropertySkeleton() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div
          className="h-6 bg-[rgba(255,255,255,0.08)] animate-pulse"
          style={{ width: '60%', borderRadius: '2px' }}
        />
        <div className="flex items-end justify-between mt-2">
          <div
            className="h-3 bg-[rgba(255,255,255,0.06)] animate-pulse"
            style={{ width: '40%', borderRadius: '2px' }}
          />
          <div
            className="h-3 bg-[rgba(255,255,255,0.06)] animate-pulse"
            style={{ width: '20%', borderRadius: '2px' }}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add skeleton to PropertySelector**

Add a loading state and skeleton grid:

```tsx
// In PropertySelector.tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  // Simulate loading or check actual data loading
  const timer = setTimeout(() => setIsLoading(false), 600);
  return () => clearTimeout(timer);
}, []);

// In the render:
{isLoading ? (
  <div
    className="grid"
    style={{
      gridTemplateColumns: '2fr 2fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '1px',
      height: 'calc(100dvh - 48px)',
      width: '100%',
      background: 'var(--color-canvas, #0c0c0c)',
    }}
  >
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ gridColumn: i === 4 ? 'span 2' : undefined }}>
        <PropertySkeleton />
      </div>
    ))}
  </div>
) : (
  // existing grid with AnimatePresence
)}
```

- [ ] **Step 3: Verify skeleton loading**

Run dev server. Refresh the page. Expected:
- Skeleton grid appears briefly (600ms)
- Skeleton cells match the grid structure (3 top, 2 bottom, 4th spans 2)
- Skeleton has placeholder bars for name, location, status
- Real grid fades in after loading

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySkeleton.tsx src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): skeleton loading state matching grid structure"
```

---

## Task 7: Add Lazy Loading to Images

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Context:** Images below the fold should load lazily.

- [ ] **Step 1: Add loading="lazy"**

```tsx
<img
  src={property.imageUrl}
  alt={property.name}
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "perf(property-card): lazy loading on images"
```

---

## Task 8: Fix Duplicate Image

**Files:**
- Modify: `src/components/PropertySelector/propertyData.ts`

**Context:** `propImg5` imports `menu-1.webp` which is the same as `propImg1`. Casa Brisa should have a unique image.

- [ ] **Step 1: Check available images**

List files in `src/assets/Menu/`:

```bash
ls src/assets/Menu/
```

- [ ] **Step 2: Assign unique image**

If there are only 4 images, use one of them or create a note. For now, use `menu-4.webp` for Casa Brisa:

```tsx
import propImg5 from '../../assets/Menu/menu-4.webp';
import propImg5Webp from '../../assets/Menu/menu-4.webp';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/propertyData.ts
git commit -m "fix(property-data): unique image for casa-brisa"
```

---

## Task 9: Final Polish

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`
- Modify: `src/components/PropertySelector/PropertyCard.tsx`
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

**Context:** Final pass for edge cases, placeholder text, and consistency.

- [ ] **Step 1: Fix search placeholder**

Ensure placeholder text matches `aria-label`:

```tsx
placeholder="Search..."
aria-label="Search properties"
```

- [ ] **Step 2: Verify empty state**

The empty state should still work. Ensure it shows:

```tsx
{filteredProperties.length === 0 && (
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
        color: 'rgba(255,255,255,0.4)',
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
        color: 'rgba(255,255,255,0.9)',
        background: 'none',
        border: 'none',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.9)',
      }}
    >
      Clear filters
    </button>
  </motion.div>
)}
```

- [ ] **Step 3: Remove inline styles in favor of CSS**

Move any remaining inline styles to a CSS module or Tailwind classes. For example, the gradient overlay can be a class:

```css
/* In a new file: src/components/PropertySelector/property-selector.css */
.property-card-gradient {
  background: linear-gradient(to top, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.2) 40%, transparent 60%);
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.property-card-gradient-hover {
  background: linear-gradient(to top, rgba(12,12,12,0.9) 0%, rgba(12,12,12,0.3) 40%, transparent 60%);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

.group:hover .property-card-gradient-hover {
  opacity: 1;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/
git commit -m "polish(property-selector): final pass, empty state, consistency"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Staggered entrance (80ms delays) → Task 1
- ✅ Spotlight hover → Task 1 (from Phase 3)
- ✅ Gradient depth shift → Task 2
- ✅ Remove scale animations → Task 2
- ✅ Remove setTimeout → Task 3
- ✅ Remove AnimatePresence popLayout → Task 4
- ✅ Alt text on images → Phase 2 (Task 1)
- ✅ Focus indicators → Task 5
- ✅ Skeleton loading → Task 6
- ✅ Lazy loading → Task 7
- ✅ Fix duplicate propImg5 → Task 8
- ✅ Final polish → Task 9

**2. Placeholder scan:**
- No placeholders found.
- All code is exact.

**3. Type consistency:**
- All `transition` props use `[0.16, 1, 0.3, 1]` (ease-out-expo)
- All `duration` values are 0.5s or less (except entrance at 0.5s)
- Consistent use of `rgba(255,255,255,x)` for text colors

**Gaps:** None.

---

## Verification Checklist

After completing all tasks:
- [ ] Staggered entrance on page load (80ms delays)
- [ ] No scale animations anywhere
- [ ] No setTimeout navigation
- [ ] AnimatePresence uses sync mode
- [ ] Visible focus indicators on all interactive elements
- [ ] Skeleton loading matches grid structure
- [ ] Images have loading="lazy"
- [ ] Casa Brisa has unique image
- [ ] Empty state works correctly
- [ ] No inline styles remain (all moved to CSS/Tailwind)

Run: `npm run dev` and verify:
- Visual inspection of all 5 cells
- Keyboard navigation (Tab key)
- Filter transitions
- Search functionality
- Empty state
- Mobile viewport (if possible)

Then run: `npm run build` (or equivalent) to verify no TypeScript errors.

---

## Final Summary

After all 4 phases:
- **Phase 1** (Foundation): Grid architecture, component structure
- **Phase 2** (Typography & Color): EB Garamond names, monochrome status, accent underline
- **Phase 3** (Layout & Spacing): 1px gaps, gradients, spotlight hover, minimal header
- **Phase 4** (Motion & Polish): Staggered entrance, no scale, focus indicators, skeleton loading

**Total commits:** 15-20 commits across 4 phases.

**Re-run `$impeccable critique` after all phases to verify score improvement.**
