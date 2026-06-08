# Viewport Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase visible property density so 2–2.5 properties fit in a standard viewport without sacrificing the editorial aesthetic.

**Architecture:** Three targeted changes to `EditorialPropertyItem.tsx` only — shrink the image from 60% wide / 16:10 aspect to 44% wide / 3:2, replace the `my-24` (96px) vertical margin with `py-8` (32px) + a `border-t` divider, and collapse the oversized `mb-12` gap inside the text column to `mb-4`. No other files touched.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, Framer Motion (`motion/react`)

---

### Task 1: Shrink image and text column proportions

**Files:**
- Modify: `src/components/PropertySelector/EditorialPropertyItem.tsx`

Context: The image is currently `w-[60%]` with a `16/10` aspect ratio. On a 1280px-wide viewport the image renders at ~768×480px — nearly half the screen height by itself. The text column is `w-[40%]`. We will change the image to `w-[44%]` / `3:2` (~564×376px), and the text column to `w-[56%]`. This alone reduces per-item height by ~100px.

- [ ] **Step 1: Update the image container width**

In `src/components/PropertySelector/EditorialPropertyItem.tsx`, find the image container div (currently `className="w-full md:w-[60%] ..."`). Change `md:w-[60%]` to `md:w-[44%]`.

Before:
```tsx
<div
  className="w-full md:w-[60%] relative overflow-hidden cursor-pointer group"
  onClick={() => onSelect(property.id)}
>
```

After:
```tsx
<div
  className="w-full md:w-[44%] relative overflow-hidden cursor-pointer group"
  onClick={() => onSelect(property.id)}
>
```

- [ ] **Step 2: Update the aspect ratio**

Inside the image container, change `aspectRatio: '16/10'` to `aspectRatio: '3/2'`.

Before:
```tsx
<div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/10' }}>
```

After:
```tsx
<div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
```

- [ ] **Step 3: Update the text column width**

Change the text column from `md:w-[40%]` to `md:w-[56%]`.

Before:
```tsx
<div className="w-full md:w-[40%] flex flex-col items-start px-4 md:px-0">
```

After:
```tsx
<div className="w-full md:w-[56%] flex flex-col items-start px-4 md:px-0">
```

- [ ] **Step 4: Verify the TypeScript compiler is happy**

Run:
```bash
npx tsc --noEmit
```

Expected: The two pre-existing errors in `DashboardDomainNav.tsx` and `NavMenuView.tsx` — those are unrelated. Our changed file should produce zero new errors.

---

### Task 2: Replace vertical margin with divider rhythm

**Files:**
- Modify: `src/components/PropertySelector/EditorialPropertyItem.tsx`

Context: Each `EditorialPropertyItem` carries `my-24` (96px top + 96px bottom = 192px of dead air per item). We replace this with `py-8` (32px top + 32px bottom = 64px) and a `border-t` divider that provides visual separation at a fraction of the spatial cost. The first item should not show a top border, which is handled by the `index === 0` prop already available.

- [ ] **Step 1: Replace `my-24` with `py-8` and conditional `border-t`**

Replace the outer `motion.div` className. The `border-t` uses the existing design-system border token via an inline style so it picks up any theme variable.

Before:
```tsx
<motion.div
  className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center w-full my-24 ${
    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
  }`}
```

After:
```tsx
<motion.div
  className={`flex flex-col md:flex-row gap-8 lg:gap-12 items-center w-full py-8 ${
    index > 0 ? 'border-t' : ''
  } ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
  style={{ borderColor: 'var(--color-border-subtle, rgba(255,255,255,0.06))' }}
```

Note: `lg:gap-16` → `lg:gap-12` (48px → 48px, fine as-is; we slightly tighten to `lg:gap-12` = 48px for proportional feel with the smaller image).

- [ ] **Step 2: Verify the TypeScript compiler is happy**

Run:
```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors, no new ones.

---

### Task 3: Collapse oversized internal gap

**Files:**
- Modify: `src/components/PropertySelector/EditorialPropertyItem.tsx`

Context: The location `<span>` has `mb-12` (48px) below it — a legacy of needing to fill the tall column height when images were larger. With a smaller image and less vertical space, this gap now looks awkward and wastes vertical real estate.

- [ ] **Step 1: Change `mb-12` to `mb-4` on the location span**

Before:
```tsx
<span
  className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))] mb-12"
  style={{ fontSize: '0.6875rem', letterSpacing: '0.30em' }}
>
  {property.location}
</span>
```

After:
```tsx
<span
  className="font-sans uppercase text-[var(--color-ink-secondary, rgba(201,184,160,0.6))] mb-6"
  style={{ fontSize: '0.6875rem', letterSpacing: '0.30em' }}
>
  {property.location}
</span>
```

We use `mb-6` (24px) rather than `mb-4` (16px) to preserve a breathing moment between location and the revenue block — just not 48px of it.

- [ ] **Step 2: Final TypeScript check**

Run:
```bash
npx tsc --noEmit
```

Expected: Same two pre-existing errors, zero new ones.

- [ ] **Step 3: Commit all three tasks together**

```bash
git add src/components/PropertySelector/EditorialPropertyItem.tsx
git commit -m "feat(PropertySelector): increase viewport density in editorial list"
```

---

## Self-Review

**Spec coverage:**
- ✅ Image shrunk from 60%/16:10 → 44%/3:2 (Task 1)
- ✅ `my-24` removed, replaced with `py-8` + `border-t` divider (Task 2)
- ✅ `mb-12` location gap collapsed to `mb-6` (Task 3)
- ✅ Editorial alternating layout preserved (isEven logic untouched)
- ✅ Design system border token used (`--color-border-subtle`)
- ✅ Only one file modified

**Placeholder scan:** No TBDs, no "add validation" phrases, no missing code.

**Type consistency:** No new types introduced. All classNames are strings. `index` prop was already in the interface — used here for `index > 0` border guard.
