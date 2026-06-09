# Property Selector — Phase 3: Layout & Spacing

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Editorial Wall spacing details: 1px gaps, edge-to-edge images, bottom gradients, minimal header, and the spotlight hover effect.

**Architecture:** The grid is a single surface with 1px gaps. No borders, no rounded corners, no shadows. The bottom gradient overlay creates a reading zone for the property name. Hovering a cell dims the non-hovered cells to 80% opacity.

**Tech Stack:** React 18+, TypeScript, Tailwind CSS v4, CSS Grid, Framer Motion.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/PropertySelector/PropertySelector.tsx` | Grid container, header sizing, filter positioning, spotlight hover logic |
| `src/components/PropertySelector/PropertyCard.tsx` | Bottom gradient overlay, text positioning |
| `src/components/PropertySelector/PropertyFilters.tsx` | Filter positioning in header area |

---

## Task 1: Implement 1px Grid Gaps and Remove Card Chrome

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** The grid currently uses `gap-4 md:gap-8` (16px/32px). This must become `1px`. The cells must have no borders, no rounded corners, no shadows.

- [ ] **Step 1: Update grid gap**

The grid gap is already set to `1px` in Phase 1. Verify:

```tsx
style={{
  gridTemplateColumns: '2fr 2fr 1fr',
  gridTemplateRows: '1fr 1fr',
  gap: '1px',
  height: 'calc(100dvh - 48px)',
  width: '100%',
  background: 'var(--color-canvas, #0c0c0c)',
}}
```

- [ ] **Step 2: Remove padding from grid container**

The grid container currently has `style={{ padding: '0 32px 48px' }}`. Remove all padding:

```tsx
<div style={{ padding: 0 }}>
  {/* grid here */}
</div>
```

- [ ] **Step 3: Verify no borders/corners on grid cells**

The `motion.div` cells in the grid should not have any Tailwind classes that add borders or rounded corners. Check that the cell class is:

```tsx
className="relative overflow-hidden"
```

No `rounded-xl`, no `border`, no `shadow`.

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): 1px grid gaps, zero padding, no card chrome"
```

---

## Task 2: Add Bottom Gradient Overlay to PropertyCard

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Context:** The gradient overlay creates a reading zone for the text. It should be subtle but ensure text readability over any image.

- [ ] **Step 1: Verify gradient overlay exists**

From Phase 1, the gradient should be:

```tsx
<div
  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
  style={{
    background: 'linear-gradient(to top, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.2) 40%, transparent 60%)',
  }}
/>
```

- [ ] **Step 2: Add hover state for gradient**

On hover, the gradient should deepen slightly. This requires a group hover approach. Since the card is a `motion.button`, we can use CSS `group-hover`:

```tsx
<div
  className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-100"
  style={{
    background: 'linear-gradient(to top, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.2) 40%, transparent 60%)',
  }}
/>
```

Actually, we need the gradient to be deeper on hover. Let's use a different approach:

```tsx
<div
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'linear-gradient(to top, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.2) 40%, transparent 60%)',
    transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
  }}
/>
<div
  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
  style={{
    background: 'linear-gradient(to top, rgba(12,12,12,0.9) 0%, rgba(12,12,12,0.3) 40%, transparent 60%)',
    transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
  }}
/>
```

Add `group` class to the parent button:

```tsx
<motion.button
  onClick={() => onSelect(property.id)}
  className="group relative w-full h-full text-left cursor-pointer overflow-hidden"
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
  aria-label={`View ${property.name}`}
>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "feat(property-card): gradient deepens on hover"
```

---

## Task 3: Implement Spotlight Hover Effect

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** When hovering a cell, the hovered cell stays at 100% opacity and non-hovered cells dim to 80%. This creates a "spotlight" effect.

- [ ] **Step 1: Add hover state tracking**

Add `hoveredPropertyId` state:

```tsx
const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
```

- [ ] **Step 2: Pass hover state to grid cells**

Inside the map, add hover handlers:

```tsx
{filteredProperties.map((property, i) => {
  const isHovered = hoveredPropertyId === property.id;
  const isAnotherHovered = hoveredPropertyId !== null && !isHovered;

  return (
    <motion.div
      key={property.id}
      layoutId={`container-${property.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnotherHovered ? 0.8 : 1,
        y: 0,
        zIndex: isHovered ? 10 : 1
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: i * 0.08,
      }}
      style={{
        gridColumn: i === 3 ? 'span 2' : undefined,
      }}
      className="relative overflow-hidden"
      onMouseEnter={() => setHoveredPropertyId(property.id)}
      onMouseLeave={() => setHoveredPropertyId(null)}
    >
      <PropertyCard 
        property={property} 
        onSelect={handleSelect} 
      />
    </motion.div>
  );
})}
```

- [ ] **Step 3: Verify spotlight effect**

Run dev server. Hover over a cell. Expected:
- Hovered cell: 100% opacity
- Other 4 cells: 80% opacity
- Transition is smooth, 0.5s

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): spotlight hover effect on grid cells"
```

---

## Task 4: Reduce Header to 48px

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** The header should be minimal — 48px height, no background, no shadow, no border. The text floats directly on the canvas.

- [ ] **Step 1: Update header height**

The header style should already be set from Phase 1:

```tsx
<header
  className="sticky top-0 z-40 flex items-center justify-between"
  style={{
    height: '48px',
    padding: '0 24px',
    background: 'var(--color-canvas, #0c0c0c)',
  }}
>
```

- [ ] **Step 2: Remove filter padding**

The filter container currently has `style={{ padding: '0 32px 24px' }}`. Change to:

```tsx
<div style={{ padding: '0 24px 8px' }}>
  <PropertyFilters
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
    activeStatus={activeStatus}
    onStatusChange={setActiveStatus}
  />
</div>
```

- [ ] **Step 3: Verify header is minimal**

Run dev server. Check:
- Header is 48px tall
- No background shadow or border
- Text floats directly on the dark canvas
- Filters sit close below the header

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): minimal 48px header, tight filter spacing"
```

---

## Task 5: Ensure Edge-to-Edge Images

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Context:** Images must fill the entire cell with no padding, no border radius, no border.

- [ ] **Step 1: Verify image styling**

The image should already be:

```tsx
<img
  src={property.imageUrl}
  alt={property.name}
  className="w-full h-full object-cover"
/>
```

- [ ] **Step 2: Remove any border-radius from containers**

Check that the inner `div` has no border-radius:

```tsx
<div className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-elevated,#141414)]">
```

No `rounded-xl` on the inner div or the button.

- [ ] **Step 3: Verify edge-to-edge**

Run dev server. Check that images touch the cell edges with no padding, no rounded corners, no borders.

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "fix(property-card): ensure edge-to-edge images, no border radius"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ 1px gaps only → Task 1
- ✅ No borders, no rounded corners, no shadows → Tasks 1, 5
- ✅ Bottom gradients in every cell → Task 2
- ✅ Header minimal (48px) → Task 4
- ✅ Baseline-aligned text → Task 2 (text overlay positioning)
- ✅ Spotlight hover effect → Task 3
- ✅ Edge-to-edge images → Task 5

**2. Placeholder scan:**
- No placeholders found.
- All code is exact.

**3. Type consistency:**
- `hoveredPropertyId` is `string | null` consistently
- `isAnotherHovered` logic is correct
- Grid column span logic is correct

**Gaps:** None.

---

## Verification Checklist

After completing all tasks:
- [ ] 1px gaps between all cells
- [ ] No borders, no rounded corners, no shadows on cells
- [ ] Images fill entire cell edge-to-edge
- [ ] Bottom gradient visible in every cell
- [ ] Header is 48px, minimal, no background
- [ ] Hovering a cell dims others to 80%
- [ ] Gradient deepens on hover
- [ ] All 5 cells fit in viewport without scrolling

Run: `npm run dev` and verify visually.
