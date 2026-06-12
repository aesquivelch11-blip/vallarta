# Phase 1: Gallery Hero Transformation

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execute phases in order (Phase 1 → 2 → 3 → 4 → 5).

**Goal:** Transform the dashboard gallery from a padded image carousel into a full-bleed cinematic hero with the property name overlaid in large italic serif typography.

**Architecture:** DashboardGallery.tsx is completely rewritten to use existing CSS classes from design-tokens.css (`.hero__gradient`, `.hero__identity`, `.hero__property-name`, `.hero__property-location`, `.hero__counter-*`, `.cinematic-grade`) that are already defined but unused. Image transitions change from horizontal slide to crossfade + subtle scale. DashboardView.tsx receives one new prop on both Gallery call sites.

**Tech Stack:** Vite + React 18 + TypeScript, motion/react v12 (Framer Motion), Tailwind v4, lucide-react

**Prerequisites:** None. This is Phase 1.

---

## Project Context (read before touching any file)

### File locations
- Component to rewrite: `src/components/Dashboard/DashboardGallery.tsx`
- Component to update: `src/components/Dashboard/DashboardView.tsx`
- CSS classes used (already defined, DO NOT edit): `src/design-tokens.css`

### Dev server
```bash
npm run dev
```
Opens at `http://localhost:5173` (Vite). Navigate: Login → pick any property → Dashboard.

### CSS classes already defined in `src/design-tokens.css` (use as-is, no edits)
```css
.cinematic-grade {
    filter: saturate(0.78) contrast(0.88) brightness(1.06) sepia(0.14) hue-rotate(-5deg);
}
.hero__gradient {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 35%,
        rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.72) 100%);
    pointer-events: none; z-index: 1;
}
.hero__identity {
    position: absolute;
    bottom: clamp(96px, 20%, 180px);
    left: clamp(24px, 6vw, 80px);
    z-index: 10;
    display: flex; flex-direction: column; gap: 14px;
    pointer-events: none;
}
.hero__property-name {
    font-family: var(--font-display);        /* EB Garamond Variable */
    font-size: clamp(2.75rem, 5.5vw, 4.5rem);
    font-weight: 400; font-style: italic;
    letter-spacing: -0.02em; line-height: 1;
    color: rgba(255,255,255,0.94);
}
.hero__property-location {
    font-family: var(--font-ui);             /* Instrument Sans */
    font-size: 0.6875rem; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.5); line-height: 1;
}
.hero__counter {
    position: absolute; bottom: 28px; right: clamp(24px, 6vw, 80px);
    display: flex; align-items: baseline; gap: 5px; z-index: 10;
    font-family: var(--font-mono); font-size: 0.625rem;
    letter-spacing: 0.12em; color: rgba(255,255,255,0.45);
    user-select: none; pointer-events: none;
}
.hero__counter-current { color: rgba(255,255,255,0.9); }
.hero__counter-sep { font-size: 0.625rem; margin: 0 1px; }
.hero__counter-total { color: rgba(255,255,255,0.35); }
```

### CSS variables used by components (defined in `src/design-tokens.css`)
```css
--font-display: "EB Garamond Variable", Georgia, serif;
--font-ui: "Instrument Sans", -apple-system, sans-serif;
--font-mono: "Instrument Sans", ui-monospace, monospace;
--color-canvas: #faf8f5;
```

### Design rules (from DESIGN.md)
- Property name on hero: EB Garamond italic, `clamp(2.75rem, 5.5vw, 4.5rem)`, `rgba(255,255,255,0.94)`
- Image treatment: cinematic grade filter (warm matte film look)
- Gallery transitions: crossfade with subtle scale (more editorial than horizontal slide)
- No padding on gallery — full bleed to panel edges

### What the current DashboardGallery.tsx does wrong
1. Has `padding: 'clamp(1.5rem, 3vw, 2.5rem)...'` creating a windowed frame — remove this
2. Image transitions use horizontal slide (`x: dir * 100%`) — change to crossfade + scale
3. Does NOT show property name overlay — add it
4. Does NOT apply `.cinematic-grade` filter — add it
5. Counter is a plain `<span>` — use `.hero__counter` CSS classes
6. `directionRef` drives slide direction — remove (no longer needed for crossfade)
7. Missing `propertyLocation` prop — add it

### sampleProperties shape (confirm `location` field exists)
From `src/components/PropertySelector/propertyData.ts`, each property has: `id`, `name`, `location`, `images[]`, etc. `location` is a string like `"Puerto Vallarta, Jalisco"`.

---

## Task 1: Update DashboardGallery props interface

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

- [ ] **Step 1: Add `propertyLocation` to the interface**

Open `src/components/Dashboard/DashboardGallery.tsx`. Find the `DashboardGalleryProps` interface (currently lines 4–8):

```typescript
interface DashboardGalleryProps {
  images: string[];
  propertyId: string;
  propertyName: string;
}
```

Replace with:

```typescript
interface DashboardGalleryProps {
  images: string[];
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
}
```

And update the function signature (line 10):

```typescript
export default function DashboardGallery({ images, propertyId, propertyName, propertyLocation }: DashboardGalleryProps) {
```

- [ ] **Step 2: Verify TypeScript compiles (expect error in DashboardView — fix in Task 3)**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: error about missing `propertyLocation` prop in DashboardView. That's expected — fix in Task 3.

---

## Task 2: Complete DashboardGallery rewrite

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

- [ ] **Step 1: Replace the entire file content**

Write `src/components/Dashboard/DashboardGallery.tsx` with exactly this content:

```typescript
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface DashboardGalleryProps {
  images: string[];
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
}

export default function DashboardGallery({
  images,
  propertyId,
  propertyName,
  propertyLocation,
}: DashboardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const total = images.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleFrameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    if (e.clientX - left >= width / 2) goNext();
    else goPrev();
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

  // Crossfade + subtle scale — more cinematic than horizontal slide.
  // Entering image zooms from 1.04 → 1; exiting shrinks to 0.98.
  // AnimatePresence mode="sync" renders both simultaneously for true crossfade.
  const imageVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        initial: { opacity: 0, scale: 1.04 },
        animate: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
        },
        exit: {
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
        },
      };

  const counterCurrent = String(currentIndex + 1).padStart(2, '0');
  const counterTotal = String(total).padStart(2, '0');

  return (
    <div
      className="w-full h-full"
      role="region"
      aria-label={`${propertyName} gallery`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'pan-y',
        cursor: total > 1 ? 'pointer' : 'default',
        background: '#111',
      }}
      onClick={handleFrameClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images with cinematic grade — crossfade via sync mode */}
      <AnimatePresence mode="sync">
        <motion.img
          key={`${propertyId}-${currentIndex}`}
          src={images[currentIndex]}
          alt=""
          className="cinematic-grade"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          variants={imageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </AnimatePresence>

      {/* Bottom gradient scrim for text legibility */}
      <div className="hero__gradient" aria-hidden="true" />

      {/* Property identity: name + location overlaid bottom-left */}
      <div className="hero__identity" aria-hidden="true">
        <p className="hero__property-name">{propertyName}</p>
        <p className="hero__property-location">{propertyLocation}</p>
      </div>

      {/* Image counter bottom-right */}
      {total > 1 && (
        <div className="hero__counter" aria-hidden="true">
          <span className="hero__counter-current">{counterCurrent}</span>
          <span className="hero__counter-sep">/</span>
          <span className="hero__counter-total">{counterTotal}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Confirm the file saved correctly**

```bash
head -5 src/components/Dashboard/DashboardGallery.tsx
```

Expected first line: `import React, { useState, useRef, useCallback } from 'react';`

---

## Task 3: Pass `propertyLocation` from DashboardView

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

There are TWO `<DashboardGallery>` renders in `DashboardView.tsx`:
1. The mobile gallery strip (inside `<div className="lg:hidden">`)
2. The desktop right panel (inside `<div className="hidden lg:flex lg:flex-col">`)

Both need `propertyLocation={property.location}` added.

- [ ] **Step 1: Find the mobile gallery call (line ~157) and add the prop**

Find this block:
```typescript
<div
  className="lg:hidden"
  style={{ height: 'clamp(180px, 30vw, 220px)' }}
>
  <DashboardGallery images={property.images} propertyId={property.id} propertyName={property.name} />
</div>
```

Change `<DashboardGallery ...>` to:
```typescript
<DashboardGallery
  images={property.images}
  propertyId={property.id}
  propertyName={property.name}
  propertyLocation={property.location}
/>
```

- [ ] **Step 2: Find the desktop gallery call (line ~254) and add the prop**

Find this block:
```typescript
<div style={{ flex: 1, minHeight: 0 }}>
  <DashboardGallery images={property.images} propertyId={property.id} propertyName={property.name} />
</div>
```

Change to:
```typescript
<div style={{ flex: 1, minHeight: 0 }}>
  <DashboardGallery
    images={property.images}
    propertyId={property.id}
    propertyName={property.name}
    propertyLocation={property.location}
  />
</div>
```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output (no errors).

- [ ] **Step 4: Start dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:5173`. Navigate: Login → pick any property → Dashboard.

**On desktop (1024px+ wide):**
- [ ] Right panel (42% column) shows a full-bleed image filling edge to edge — no padding/frame around it
- [ ] Property name appears overlaid on the image in large italic serif text (`clamp(2.75rem, 5.5vw, 4.5rem)`) near the bottom-left
- [ ] Property location appears below the name in small uppercase sans-serif (`rgba(255,255,255,0.5)`)
- [ ] Image has a warm cinematic filter (slightly desaturated, warm tone)
- [ ] Gradient scrim darkens the bottom 40% of the image so the text is legible
- [ ] Image counter `01 / 06` appears bottom-right in subtle white text
- [ ] Clicking right half of image advances to next photo with a crossfade + scale effect (not horizontal slide)
- [ ] Clicking left half goes to previous photo

**On mobile (< 1024px):**
- [ ] Gallery strip at top (180-220px tall) shows full-bleed image with property name overlay
- [ ] Name may appear smaller due to the shorter strip height — acceptable

**Dark mode (toggle in header):**
- [ ] Gallery unaffected (already dark context)

- [ ] **Step 5: Commit**

```bash
git add src/components/Dashboard/DashboardGallery.tsx src/components/Dashboard/DashboardView.tsx
git commit -m "feat(gallery): full-bleed hero with cinematic grade, property overlay, crossfade transition"
```

---

## Expected Visual Outcome

| Before | After |
|--------|-------|
| Gallery has padding, shows as a framed window | Gallery is full-bleed, fills the entire right panel |
| No property name visible on right panel | Property name in large italic EB Garamond overlaid at bottom-left |
| Raw unfiltered photography | Warm cinematic grade (slightly desaturated, slight sepia warmth) |
| Horizontal slide transition between images | Crossfade with entering image zooming 1.04→1, exit 1→0.98 |
| Plain `01 / 06` counter in bottom-right | Styled counter: current in white 90%, separator in 45%, total in 35% |

---

**Proceed to Phase 2** (`phase-2-layout-domain-nav.md`) once this commit is verified in the browser.
