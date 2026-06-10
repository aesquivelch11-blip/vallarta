# Phase 1: Destruction — Remove All Slop Components

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete all generic UI components (metric cards, status cards, urgent alerts, sparklines, property title cards) and strip DashboardGallery of all UI overlays (gradient, name text, chevron buttons, dot navigation). This is the first phase of a 4-phase redesign to eliminate AI slop from the dashboard.

**Architecture:** Surgical deletion of 7 component files. DashboardGallery is modified to remove all UI chrome while keeping the image, click-zone navigation, counter, and lateral slide transition. No new files are created. No dependencies change.

**Tech Stack:** React 18, TypeScript, CSS custom properties, motion/react

**Design Principles:**
- **$impeccable distill**: Remove unnecessary cards, decorations, borders. Flatten structure.
- **$impeccable layout**: Use spacing and alignment for grouping. No identical card grids.
- **Hospitality reference sites**: Photography is primary. No UI overlays on images. Restraint is the luxury signal.

---

## File Map

| File | Responsibility | Action |
|---|---|---|
| `src/components/Dashboard/MetricCard.tsx` | Generic metric card (icon + heading + text) | **Delete** |
| `src/components/Dashboard/MetricGrid.tsx` | 3-column metric card grid | **Delete** |
| `src/components/Dashboard/StatusCards.tsx` | 2×2 task category card grid | **Delete** |
| `src/components/Dashboard/UrgentAlert.tsx` | Red side-stripe alert banner | **Delete** |
| `src/components/Dashboard/GuestFlowStrip.tsx` | Arrivals/departures grid component | **Delete** |
| `src/components/Dashboard/PropertyTitleCard.tsx` | Rounded card with border and accent line | **Delete** |
| `src/components/Dashboard/RevparSnapshot.tsx` | RevPAR figure + sparkline | **Delete** |
| `src/components/Dashboard/DashboardGallery.tsx` | Gallery (strip UI overlays) | **Modify** |

---

## Task 1: Delete 7 orphaned slop components

**Files:**
- Delete: `src/components/Dashboard/MetricCard.tsx`
- Delete: `src/components/Dashboard/MetricGrid.tsx`
- Delete: `src/components/Dashboard/StatusCards.tsx`
- Delete: `src/components/Dashboard/UrgentAlert.tsx`
- Delete: `src/components/Dashboard/GuestFlowStrip.tsx`
- Delete: `src/components/Dashboard/PropertyTitleCard.tsx`
- Delete: `src/components/Dashboard/RevparSnapshot.tsx`

- [ ] **Step 1: Delete the files**

```bash
rm src/components/Dashboard/MetricCard.tsx
rm src/components/Dashboard/MetricGrid.tsx
rm src/components/Dashboard/StatusCards.tsx
rm src/components/Dashboard/UrgentAlert.tsx
rm src/components/Dashboard/GuestFlowStrip.tsx
rm src/components/Dashboard/PropertyTitleCard.tsx
rm src/components/Dashboard/RevparSnapshot.tsx
```

- [ ] **Step 2: Verify the files are gone**

```bash
ls src/components/Dashboard/ | grep -E "MetricCard|MetricGrid|StatusCards|UrgentAlert|GuestFlowStrip|PropertyTitleCard|RevparSnapshot"
```

Expected: No output (files do not exist).

- [ ] **Step 3: Verify TypeScript compiles (expect errors)**

Run: `npx tsc --noEmit`

Expected: Errors in `DashboardToday.tsx` and `DashboardView.tsx` (importing deleted files). These will be fixed in Phase 2 and Phase 4. The error count should be limited to import errors only.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete 7 slop components (MetricCard, MetricGrid, StatusCards, UrgentAlert, GuestFlowStrip, PropertyTitleCard, RevparSnapshot)"
```

---

## Task 2: Strip DashboardGallery UI overlays

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

**What to remove:**
- Gradient overlay div (`linear-gradient(to bottom, rgba(15,26,26,0.3)...)`) — decorative, banned
- Property name overlay (`motion.p` with `layoutId`) — text on image, banned per spec
- Circular hover chevron buttons (`ChevronLeft`, `ChevronRight`) — generic UI pattern
- Dot navigation strip (`data-gallery-dot`) — generic UI pattern
- `hovered` state and `onMouseEnter`/`onMouseLeave` handlers — no longer needed

**What to keep:**
- Image with lateral slide transition (`AnimatePresence` + `motion.img`)
- Click-zone navigation (left half = prev, right half = next)
- Touch swipe navigation
- Counter (`03 / 08`) anchored to image
- `layoutId` for shared element transition from PropertySelector

- [ ] **Step 1: Rewrite DashboardGallery.tsx**

Replace the entire file with:

```tsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface DashboardGalleryProps {
  images: string[];
  propertyId: string;
  propertyName: string;
}

export default function DashboardGallery({ images, propertyId, propertyName }: DashboardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const directionRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const total = images.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    directionRef.current = 1;
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    directionRef.current = -1;
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    if (clickX >= width / 2) {
      goNext();
    } else {
      goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) goPrev();
      else goNext();
    }
  };

  if (total === 0) {
    return (
      <div
        className="w-full h-full"
        style={{ background: 'var(--color-canvas)' }}
        aria-hidden="true"
      />
    );
  }

  const slideVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
        animate: { x: '0%', opacity: 1 },
        exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
      };

  const counter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return (
    <div
      className="w-full h-full flex items-stretch"
      role="region"
      aria-label={propertyName}
      style={{
        background: 'var(--color-canvas)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) 0.75rem clamp(1rem, 2vw, 1.75rem)',
        touchAction: 'pan-y',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        onClick={handleFrameClick}
        style={{ cursor: total > 1 ? 'pointer' : 'default', borderRadius: '4px' }}
      >
        <AnimatePresence custom={directionRef.current} mode="wait">
          <motion.img
            key={currentIndex}
            layoutId={`property-image-${propertyId}`}
            src={images[currentIndex]}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            custom={directionRef.current}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
            }
          />
        </AnimatePresence>

        {total > 1 && (
          <span
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 500,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 4,
            }}
          >
            {counter}
          </span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors for DashboardGallery.tsx.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardGallery.tsx
git commit -m "feat: strip gallery UI overlays — gradient, name, chevrons, dots removed"
```

---

## Self-Review

### Spec Coverage

| Requirement | Task | Covered |
|---|---|---|
| Delete MetricCard | Task 1 | ✅ |
| Delete MetricGrid | Task 1 | ✅ |
| Delete StatusCards | Task 1 | ✅ |
| Delete UrgentAlert | Task 1 | ✅ |
| Delete GuestFlowStrip | Task 1 | ✅ |
| Delete PropertyTitleCard | Task 1 | ✅ |
| Delete RevparSnapshot | Task 1 | ✅ |
| Remove gradient overlay from gallery | Task 2 | ✅ |
| Remove name overlay from gallery | Task 2 | ✅ |
| Remove chevron buttons from gallery | Task 2 | ✅ |
| Remove dot navigation from gallery | Task 2 | ✅ |
| Keep click-zone navigation | Task 2 | ✅ |
| Keep counter | Task 2 | ✅ |
| Keep lateral slide transition | Task 2 | ✅ |

### Placeholder Scan

- No "TBD", "TODO", or placeholders.
- All steps contain actual commands and code.
- No references to undefined types or functions.

### Type Consistency

- `DashboardGallery` interface unchanged — no type changes.
- `propertyId` and `propertyName` props still match call sites in `DashboardView.tsx`.

---

## Execution Handoff

**Plan complete.**

**Execution options:**

**1. Subagent-Driven** — Dispatch a subagent to execute this phase, then proceed to Phase 2.

**2. Inline Execution** — Execute all tasks in this session.

**Which approach?**
