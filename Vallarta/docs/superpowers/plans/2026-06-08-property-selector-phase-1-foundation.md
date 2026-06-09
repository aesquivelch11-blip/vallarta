# Property Selector — Phase 1: Foundation & Grid Architecture

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken 4-column grid with the asymmetric Editorial Wall grid structure and simplify the PropertySelector component architecture.

**Architecture:** Single CSS Grid with fixed `grid-template-columns: 2fr 2fr 1fr` and `grid-template-rows: 1fr 1fr`. Row 2 uses `grid-column: span 2` for the 4th item. PropertyCard is simplified to a single render mode. No more `GRID_PLACEMENTS`, `isActive`, or manual grid positioning.

**Tech Stack:** React 18+, TypeScript, Tailwind CSS v4, Framer Motion (`motion/react`), CSS Grid.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/PropertySelector/PropertySelector.tsx` | Main grid container, orchestrates layout, filters, and selection state |
| `src/components/PropertySelector/PropertyCard.tsx` | Single render mode: image + bottom gradient overlay with name/location/status |
| `src/components/PropertySelector/PropertyFilters.tsx` | Search input + status filter links (text-only, no pills) |
| `src/components/PropertySelector/propertyData.ts` | Sample data (no changes needed) |
| `src/types.ts` | Type definitions (no changes needed) |

---

## Task 1: Rewrite PropertySelector Grid

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`
- Test: `src/components/PropertySelector/PropertySelector.tsx` (visual verification)

**Context:** The current grid uses a `GRID_PLACEMENTS` array with manual `gridColumn`/`gridRow` assignments. This creates holes and is brittle. The new grid uses CSS Grid template definitions with `grid-column: span 2` for the asymmetric 3-2 layout.

- [ ] **Step 1: Delete GRID_PLACEMENTS and related grid logic**

Remove lines 14-25 and the grid placement logic inside the map (lines 131-134):

```typescript
// DELETE: const GRID_PLACEMENTS = [...]
// DELETE: const placement = GRID_PLACEMENTS[i % GRID_PLACEMENTS.length];
// DELETE: const baseRow = Math.floor(i / GRID_PLACEMENTS.length) * 4;
// DELETE: const gridColumn = placement.c;
// DELETE: const gridRow = placement.r + baseRow;
// DELETE: style={{ gridColumn, gridRow }}
```

- [ ] **Step 2: Replace the grid container with fixed template**

Replace the grid container (lines 121-128) with:

```tsx
<div style={{ padding: '0 0 0' }}>
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
```

- [ ] **Step 3: Add grid-column span for 4th item**

Inside the map, add conditional styling for the 4th item (index 3):

```tsx
{filteredProperties.map((property, i) => {
  const isSelected = selectedPropertyId === property.id;
  const isAnotherSelected = selectedPropertyId !== null && !isSelected;

  return (
    <motion.div
      key={property.id}
      layoutId={`container-${property.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isAnotherSelected ? 0.5 : 1,
        y: 0,
        zIndex: isSelected ? 50 : 1
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
    >
      <PropertyCard 
        property={property} 
        onSelect={handleSelect} 
      />
    </motion.div>
  );
})}
```

- [ ] **Step 4: Remove the outer motion.div wrapper**

The outer `motion.div` with `animate={{ opacity, pointerEvents }}` and `exit={{ opacity, scale }}` is no longer needed. Replace the entire outer wrapper with a plain `div`:

```tsx
<div
  className="w-full min-h-[100dvh] relative overflow-hidden"
  style={{ background: 'var(--color-canvas, #0c0c0c)' }}
>
```

- [ ] **Step 5: Simplify the scroll container**

Remove the inner scroll container `h-[100dvh] overflow-y-auto`. The grid fills the viewport. No scrolling needed:

```tsx
{/* Header */}
<header
  className="sticky top-0 z-40 flex items-center justify-between"
  style={{
    height: '48px',
    padding: '0 24px',
    background: 'var(--color-canvas, #0c0c0c)',
  }}
>
```

- [ ] **Step 6: Run dev server and verify grid layout**

Run: `npm run dev` (or `pnpm dev` / `yarn dev`)
Navigate to the property selector screen.
Expected: 5 cells visible in a 3-top/2-bottom asymmetric layout. No holes. No scrolling. The 4th cell spans 2 columns.

- [ ] **Step 7: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): replace broken grid with asymmetric editorial wall"
```

---

## Task 2: Simplify PropertyCard to Single Render Mode

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Context:** The current card has two render modes (`isActive` and normal). The `isActive` mode is effectively unreachable (selection triggers navigation after 10ms). We need a single render mode that always shows the image + gradient overlay + name + location + status.

- [ ] **Step 1: Remove isActive prop and STATUS_COLORS**

Delete the `isActive` prop, the `if (isActive)` block, and the `STATUS_COLORS` object:

```tsx
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

export default function PropertyCard({ property, onSelect }: PropertyCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative w-full h-full text-left cursor-pointer overflow-hidden"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`View ${property.name}`}
    >
      <div className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-elevated,#141414)]">
        <picture>
          <source srcSet={property.imageWebp} type="image/webp" />
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </picture>
        
        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.75) 0%, rgba(12,12,12,0.2) 40%, transparent 60%)',
          }}
        />
        
        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="font-serif italic"
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.2,
            }}
          >
            {property.name}
          </h3>
          <div className="flex items-end justify-between mt-1">
            <span
              className="font-sans uppercase"
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.25em',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {property.location}
            </span>
            <span
              className="font-sans uppercase"
              style={{
                fontSize: '0.5625rem',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Run dev server and verify cards show names**

Expected: Each cell shows the property image with the name in EB Garamond italic at the bottom-left, location in uppercase below it, and status in uppercase at the bottom-right.

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "feat(property-card): single render mode with name/location/status overlay"
```

---

## Task 3: Simplify PropertyFilters

**Files:**
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

**Context:** The current filter uses pill buttons with backgrounds and borders. The new design uses text links separated by middots, with the active filter underlined in the accent color.

- [ ] **Step 1: Replace pill buttons with text links**

Replace the entire filter section (lines 68-105) with:

```tsx
      {/* Status filter */}
      <div
        className="flex items-center gap-1 flex-wrap"
        role="group"
        aria-label="Filter by occupancy status"
      >
        {STATUS_OPTIONS.map(({ value, label }, index) => {
          const isActive = activeStatus === value;
          return (
            <React.Fragment key={value}>
              {index > 0 && (
                <span
                  className="font-sans"
                  style={{
                    fontSize: '0.5625rem',
                    color: 'rgba(255,255,255,0.2)',
                    margin: '0 4px',
                  }}
                >
                  ·
                </span>
              )}
              <motion.button
                onClick={() => onStatusChange(value)}
                className="cursor-pointer font-sans uppercase"
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: '0.20em',
                  padding: '4px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '1px solid var(--color-accent, #d49a55)' : '1px solid transparent',
                  color: isActive
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={isActive}
              >
                {label}
              </motion.button>
            </React.Fragment>
          );
        })}
      </div>
```

- [ ] **Step 2: Simplify search input**

Replace the search input container (lines 28-65) with a minimal input:

```tsx
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent font-sans outline-none"
          style={{
            fontSize: '0.8125rem',
            letterSpacing: '0.02em',
            padding: '8px 0',
            color: 'rgba(255,255,255,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
          }}
          aria-label="Search properties"
        />
      </div>
```

- [ ] **Step 3: Run dev server and verify filters**

Expected: Filters appear as text links separated by middots. Active filter has an underline in the accent color. Search input is a minimal line with no background or icon.

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertyFilters.tsx
git commit -m "feat(property-filters): text links with accent underline, minimal search"
```

---

## Task 4: Remove isActive Prop from PropertySelector

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** The `selectedPropertyId` state and `isActive` prop are no longer needed since PropertyCard no longer accepts `isActive`. Selection immediately triggers navigation.

- [ ] **Step 1: Remove selectedPropertyId state and isActive logic**

Delete lines 30 and 136-137:

```tsx
// DELETE: const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
// DELETE: const isSelected = selectedPropertyId === property.id;
// DELETE: const isAnotherSelected = selectedPropertyId !== null && !isSelected;
```

- [ ] **Step 2: Simplify handleSelect**

Replace the handleSelect function (lines 46-56) with:

```tsx
  const handleSelect = useCallback(
    (propertyId: string) => {
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );
```

- [ ] **Step 3: Simplify PropertyCard call**

Remove the `isActive` prop from the `PropertyCard` call:

```tsx
<PropertyCard 
  property={property} 
  onSelect={handleSelect} 
/>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "refactor(property-selector): remove selectedPropertyId state and isActive prop"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ Replace GRID_PLACEMENTS with fixed grid → Task 1
- ✅ Simplify PropertyCard to single mode → Task 2
- ✅ Map data model (name, location, status) to cells → Task 2
- ✅ Remove isActive prop → Task 4
- ✅ Remove manual grid positioning → Task 1
- ✅ Fix grid-template-columns/rows → Task 1

**2. Placeholder scan:**
- No "TBD", "TODO", or "implement later" found.
- No vague descriptions without code.
- All steps have exact code or exact commands.

**3. Type consistency:**
- `PropertyCardProps` removes `isActive` in Task 2 and Task 4.
- `handleSelect` signature matches `onSelectProperty` in Task 4.
- `STATUS_LABELS` is preserved in Task 2.

**Gaps:** None identified.

---

## Verification Checklist

After completing all tasks:
- [ ] 5 cells visible in viewport, no scrolling
- [ ] Asymmetric layout: 3 top, 2 bottom, 4th cell spans 2 columns
- [ ] Each cell shows property name, location, status
- [ ] No cards, no borders, no rounded corners, no shadows
- [ ] 1px gaps between cells
- [ ] Filters are text links with middot separators
- [ ] Active filter has accent underline

Run: `npm run dev` and verify visually.
