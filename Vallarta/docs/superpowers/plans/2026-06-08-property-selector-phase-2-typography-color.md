# Property Selector — Phase 2: Typography & Color

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the brand typography (EB Garamond for property names, Instrument Sans for UI) and replace the hardcoded status colors with a monochrome, restrained palette.

**Architecture:** Property names use `font-family: var(--font-display)` (EB Garamond Variable). All UI text (locations, status, filters, header) uses `font-family: var(--font-ui)` (Instrument Sans). Status is communicated through typography weight/opacity, not color. The single accent color (`#d49a55`) appears only on the active filter underline.

**Tech Stack:** React 18+, TypeScript, Tailwind CSS v4, CSS variables from `design-tokens.css`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/components/PropertySelector/PropertySelector.tsx` | Header typography, count text styling |
| `src/components/PropertySelector/PropertyCard.tsx` | Property name (EB Garamond italic), location, status (monochrome) |
| `src/components/PropertySelector/PropertyFilters.tsx` | Filter text styling, search input styling |
| `src/components/PropertySelector/propertyData.ts` | Data (no changes) |
| `src/design-tokens.css` | Source of truth for font and color variables |

---

## Task 1: Apply Typography to PropertyCard

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Context:** The property name must be the hero text element. It should be EB Garamond italic, large, and dominant. The location and status should be significantly smaller, creating dramatic hierarchy.

- [ ] **Step 1: Update property name to use design token font**

Replace the `h3` style block with CSS variables:

```tsx
<h3
  className="italic"
  style={{
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
    fontWeight: 400,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  }}
>
  {property.name}
</h3>
```

- [ ] **Step 2: Update location styling**

Replace the location `span` with:

```tsx
<span
  className="uppercase"
  style={{
    fontFamily: 'var(--font-ui)',
    fontSize: '0.625rem',
    fontWeight: 400,
    letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.5)',
  }}
>
  {property.location}
</span>
```

- [ ] **Step 3: Update status to be monochrome with weight variation**

Replace the status `span` with a weight-based approach:

```tsx
<span
  className="uppercase"
  style={{
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: property.occupancyStatus === 'occupied' ? 500 : 400,
    letterSpacing: '0.15em',
    color: property.occupancyStatus === 'occupied' 
      ? 'rgba(255,255,255,0.7)' 
      : 'rgba(255,255,255,0.4)',
  }}
>
  {STATUS_LABELS[property.occupancyStatus] ?? property.occupancyStatus}
</span>
```

- [ ] **Step 4: Verify typography hierarchy**

Run dev server. Check that:
- Property name is clearly the largest text in each cell
- Location is small, uppercase, tracked
- Status is the smallest text, weight varies by occupancy
- No colored badges visible

- [ ] **Step 5: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "feat(property-card): EB Garamond names, monochrome status via weight/opacity"
```

---

## Task 2: Apply Typography to Header

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

**Context:** The header should use the design system tokens and maintain minimal visual weight.

- [ ] **Step 1: Update header text styles**

Replace the header `h1` (lines 86-96):

```tsx
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
```

- [ ] **Step 2: Update count text**

Replace the count `span` (lines 97-106):

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/PropertySelector.tsx
git commit -m "feat(property-selector): header typography with design tokens"
```

---

## Task 3: Apply Typography to Filters

**Files:**
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

**Context:** Filters should use the UI font consistently. The search input should be minimal.

- [ ] **Step 1: Update search input styling**

Replace the search input style block:

```tsx
<input
  type="text"
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  placeholder="Search..."
  className="w-full bg-transparent outline-none"
  style={{
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    fontWeight: 400,
    letterSpacing: '0.02em',
    padding: '8px 0',
    color: 'rgba(255,255,255,0.9)',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
  }}
  aria-label="Search properties"
/>
```

- [ ] **Step 2: Update filter button styling**

Ensure the filter buttons use the UI font:

```tsx
<motion.button
  onClick={() => onStatusChange(value)}
  className="cursor-pointer uppercase"
  style={{
    fontFamily: 'var(--font-ui)',
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
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PropertySelector/PropertyFilters.tsx
git commit -m "feat(property-filters): typography with design tokens, accent underline"
```

---

## Task 4: Remove Hardcoded Status Colors

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`

**Context:** The `STATUS_COLORS` object uses raw Tailwind hex values (`#4ade80`, `#fbbf24`, etc.). These must be removed entirely. Status is now communicated through typography only.

- [ ] **Step 1: Delete STATUS_COLORS**

Remove lines 18-23:

```tsx
// DELETE:
// const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
//   available: { bg: 'rgba(74, 222, 128, 0.12)', text: '#4ade80' },
//   occupied: { bg: 'rgba(251, 191, 36, 0.12)', text: '#fbbf24' },
//   maintenance: { bg: 'rgba(148, 163, 184, 0.12)', text: '#94a3b8' },
//   reserved: { bg: 'rgba(96, 165, 250, 0.12)', text: '#60a5fa' },
// };
```

- [ ] **Step 2: Remove status color references**

Since the status is now rendered as monochrome text in the overlay, there's no `status` variable needed. The status `span` in Task 1 already uses `property.occupancyStatus` directly.

- [ ] **Step 3: Verify no colored badges remain**

Run dev server. Check all 5 cells. Confirm:
- No green/amber/gray/blue pills anywhere
- Status is text-only at the bottom-right
- The only color in the UI is the accent underline on the active filter

- [ ] **Step 4: Commit**

```bash
git add src/components/PropertySelector/PropertyCard.tsx
git commit -m "fix(property-card): remove hardcoded status colors, monochrome only"
```

---

## Task 5: Add Accent Color Variable

**Files:**
- Modify: `src/components/PropertySelector/PropertyFilters.tsx`

**Context:** The active filter underline should use the design system accent color. The current code uses `var(--color-accent, #d49a55)` which is correct, but we should verify it exists.

- [ ] **Step 1: Verify accent color exists**

Check `src/design-tokens.css` line 106: `--color-dark-accent: #d49a55;`.

Since the property selector uses dark mode, we should use `--color-dark-accent`. However, the current filter code uses `--color-accent` which may not exist in dark mode. Let's add a fallback:

```tsx
borderBottom: isActive ? '1px solid var(--color-dark-accent, #d49a55)' : '1px solid transparent',
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PropertySelector/PropertyFilters.tsx
git commit -m "fix(property-filters): use dark accent color variable for active filter"
```

---

## Self-Review

**1. Spec coverage:**
- ✅ EB Garamond for property names → Task 1
- ✅ Instrument Sans for UI text → Tasks 1, 2, 3
- ✅ Font hierarchy (name ≥1.25rem, location 0.625rem, status 0.5625rem) → Task 1
- ✅ Remove colored badges → Task 4
- ✅ Monochrome status (weight/opacity only) → Task 1
- ✅ Single accent color (active filter underline) → Task 5

**2. Placeholder scan:**
- No placeholders found.
- All code is exact and complete.

**3. Type consistency:**
- `fontFamily: 'var(--font-display)'` is EB Garamond
- `fontFamily: 'var(--font-ui)'` is Instrument Sans
- Status uses `property.occupancyStatus` consistently

**Gaps:** None.

---

## Verification Checklist

After completing all tasks:
- [ ] Property names are in EB Garamond italic, clearly dominant
- [ ] Location text is small, uppercase, tracked
- [ ] Status text is smallest, weight varies by occupancy
- [ ] No colored badges anywhere
- [ ] Active filter has accent underline
- [ ] All text uses design token font families
- [ ] Header is minimal, 0.6875rem uppercase

Run: `npm run dev` and verify visually.
