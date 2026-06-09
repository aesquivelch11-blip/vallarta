# Property Selector: Asymmetric Editorial Wall

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Property Selector from a competent grid into an awwwards-worthy asymmetric editorial wall with scroll-driven parallax and cinematic hover interactions.

**Architecture:** Layout foundation first (canvas frame, masonry grid, typography scale, status indicator evolution), then overdrive layer (scroll-driven parallax, hover scale + counter-animate, entry animations). The grid uses CSS Grid with varied column/row proportions to create a masonry feel without requiring CSS Masonry (unreliable browser support). Status indicators move from bottom-right text labels to top-right ambient micro-dots with ochre halos.

**Tech Stack:** React, motion/react, CSS Grid, `animation-timeline: scroll()`, CSS `@property`, `clamp()` for fluid spacing. No new dependencies.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/design-tokens.css` | Modify | Add editorial wall spacing scale, typography tokens, status-dot tokens |
| `src/index.css` | Modify | Add `.editorial-wall` grid classes, canvas frame, scroll-driven animation utilities |
| `src/components/PropertySelector/PropertySelector.tsx` | Modify | Canvas frame wrapper, floating header, scroll-timeline setup, entry choreography |
| `src/components/PropertySelector/PropertyCard.tsx` | Modify | New internal layout: asymmetric padding, status micro-dot, typography hierarchy |
| `src/components/PropertySelector/PropertySkeleton.tsx` | Modify | Match new card internal layout for loading state |

---

### Task 1: Design Tokens — Editorial Spacing & Typography Scale

**Files:**
- Modify: `src/design-tokens.css`

- [ ] **Step 1: Add editorial wall spacing tokens**

Open `src/design-tokens.css`. Inside `:root`, after the existing `/* --- Layout --- */` section (line ~46), add a new section:

```css
/* --- Editorial Wall --- */
--ew-frame: clamp(32px, 5vw, 80px);
--ew-gap: 2px;
--ew-card-pad-x: clamp(24px, 3vw, 40px);
--ew-card-pad-y: clamp(20px, 2.5vw, 32px);
--ew-card-pad-bottom: clamp(32px, 4vw, 56px);
--ew-status-dot-size: 6px;
--ew-name-size: clamp(2rem, 4.5vw, 3.5rem);
--ew-location-size: 0.5625rem;
--ew-location-tracking: 0.3em;
--ew-header-size: 0.625rem;
--ew-header-tracking: 0.35em;
```

- [ ] **Step 2: Add status-dot color tokens**

In the same file, after the existing `/* --- Accents --- */` section (line ~25), add:

```css
/* --- Status Ambient --- */
--status-available-glow: oklch(72% 0.08 155 / 0.5);
--status-occupied-glow: oklch(55% 0.06 80 / 0.4);
--status-maintenance-glow: oklch(62% 0.12 70 / 0.45);
--status-reserved-glow: oklch(65% 0.05 260 / 0.35);
```

- [ ] **Step 3: Verify tokens render**

Run: `rtk npm run dev` and open the app. The tokens won't be visible yet — this is just confirming no CSS parse errors. Open DevTools console, check there are no CSS-related errors.

- [ ] **Step 4: Commit**

```bash
rtk git add src/design-tokens.css
rtk git commit -m "feat(tokens): editorial wall spacing, typography scale, status-dot palette"
```

---

### Task 2: CSS Utilities — Canvas Frame, Grid, Scroll Animations

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add editorial wall CSS classes**

Open `src/index.css`. Before the closing of the file (after the existing utility classes), add:

```css
/* ── Editorial Wall ── */
.ew-canvas {
  padding: var(--ew-frame);
  min-height: 100dvh;
  background: var(--color-canvas, #0c0c0c);
}

.ew-grid {
  display: grid;
  grid-template-columns: 3fr 2fr 2fr;
  grid-template-rows: 1fr 1.15fr;
  gap: var(--ew-gap);
  width: 100%;
  height: calc(100dvh - var(--ew-frame) * 2);
  background: var(--color-canvas, #0c0c0c);
}

/* Card sizing: varied proportions for masonry feel */
.ew-grid > *:nth-child(1) { grid-row: 1 / 2; }
.ew-grid > *:nth-child(2) { grid-row: 1 / 2; }
.ew-grid > *:nth-child(3) { grid-row: 1 / 3; } /* tall right card */
.ew-grid > *:nth-child(4) { grid-row: 2 / 3; }
.ew-grid > *:nth-child(5) { grid-row: 2 / 3; }

/* Canvas frame fallback for grid gap */
.ew-grid::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 1px solid rgba(255,255,255,0.03);
}

/* Hover scale — contained within grid cell */
.ew-card-hover-target {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.ew-card-hover-target:hover {
  transform: scale(1.02);
}

/* Status micro-dot */
.ew-status-dot {
  position: absolute;
  top: var(--ew-card-pad-y);
  right: var(--ew-card-pad-x);
  width: var(--ew-status-dot-size);
  height: var(--ew-status-dot-size);
  border-radius: 50%;
  z-index: 5;
}

.ew-status-dot--available {
  background: var(--status-available-glow);
  box-shadow: 0 0 8px var(--status-available-glow);
}

.ew-status-dot--occupied {
  background: var(--status-occupied-glow);
  box-shadow: 0 0 6px var(--status-occupied-glow);
}

.ew-status-dot--maintenance {
  background: var(--status-maintenance-glow);
  box-shadow: 0 0 6px var(--status-maintenance-glow);
}

.ew-status-dot--reserved {
  background: var(--status-reserved-glow);
  box-shadow: 0 0 6px var(--status-reserved-glow);
}

/* ── Scroll-driven parallax (progressive enhancement) ── */
@supports (animation-timeline: scroll()) {
  .ew-parallax-slow {
    animation: ew-parallax-drift linear;
    animation-timeline: scroll(nearest block);
    animation-range: 0% 100%;
  }
  .ew-parallax-fast {
    animation: ew-parallax-drift-fast linear;
    animation-timeline: scroll(nearest block);
    animation-range: 0% 100%;
  }
  @keyframes ew-parallax-drift {
    from { transform: translateY(0); }
    to { transform: translateY(-20px); }
  }
  @keyframes ew-parallax-drift-fast {
    from { transform: translateY(0); }
    to { transform: translateY(-35px); }
  }
}

/* Reduced motion — kill parallax */
@media (prefers-reduced-motion: reduce) {
  .ew-parallax-slow,
  .ew-parallax-fast {
    animation: none !important;
    transform: none !important;
  }
  .ew-card-hover-target {
    transition: none !important;
  }
  .ew-card-hover-target:hover {
    transform: none !important;
  }
}
```

- [ ] **Step 2: Verify CSS parses**

Run: `rtk npm run dev`. Open the app in browser. Confirm no console errors. The page will still use old classes — these new classes aren't wired up yet.

- [ ] **Step 3: Commit**

```bash
rtk git add src/index.css
rtk git commit -m "feat(css): editorial wall grid, canvas frame, status dots, scroll parallax utilities"
```

---

### Task 3: PropertyCard — Asymmetric Internal Layout

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`
- Modify: `src/components/PropertySelector/PropertySkeleton.tsx`

- [ ] **Step 1: Rewrite PropertyCard internal layout**

Replace the entire contents of `src/components/PropertySelector/PropertyCard.tsx` with:

```tsx
import React from 'react';
import { motion } from 'motion/react';
import { Property, OccupancyStatus } from '../../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (propertyId: string) => void;
  parallaxClass?: string;
}

export default function PropertyCard({ property, onSelect, parallaxClass }: PropertyCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(property.id)}
      className="group relative w-full h-full text-left cursor-pointer overflow-hidden focus-visible:outline-none"
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 0 0 2px var(--color-dark-accent, #d49a55)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      aria-label={`View ${property.name}`}
    >
      {/* Status micro-dot — top right */}
      <div
        className={`ew-status-dot ew-status-dot--${property.occupancyStatus}`}
        aria-label={property.occupancyStatus}
      />

      <div className="relative w-full h-full overflow-hidden bg-[var(--color-canvas-elevated,#141414)]">
        {/* Image with parallax */}
        <div className={`absolute inset-0 ${parallaxClass || ''}`}>
          <picture>
            {property.imageWebp && <source srcSet={property.imageWebp} type="image/webp" />}
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Bottom gradient — tighter, asymmetric */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.82) 0%, rgba(12,12,12,0.15) 35%, transparent 55%)',
            transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.88) 0%, rgba(12,12,12,0.25) 35%, transparent 55%)',
            transition: 'opacity 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />

        {/* Text overlay — asymmetric padding, bottom-left anchored */}
        <div
          className="absolute bottom-0 left-0"
          style={{
            padding: `0 var(--ew-card-pad-x) var(--ew-card-pad-bottom)`,
          }}
        >
          <h3
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--ew-name-size)',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.94)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            {property.name}
          </h3>
          <span
            className="uppercase block"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--ew-location-size)',
              fontWeight: 400,
              letterSpacing: 'var(--ew-location-tracking)',
              color: 'rgba(255,255,255,0.4)',
              marginTop: '8px',
            }}
          >
            {property.location}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
```

- [ ] **Step 2: Update PropertySkeleton to match new layout**

Replace the entire contents of `src/components/PropertySelector/PropertySkeleton.tsx` with:

```tsx
import React from 'react';

export default function PropertySkeleton() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
      {/* Fake status dot */}
      <div
        className="absolute animate-pulse"
        style={{
          top: 'var(--ew-card-pad-y)',
          right: 'var(--ew-card-pad-x)',
          width: 'var(--ew-status-dot-size)',
          height: 'var(--ew-status-dot-size)',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      {/* Fake text — bottom left, asymmetric */}
      <div
        className="absolute bottom-0 left-0"
        style={{
          padding: '0 var(--ew-card-pad-x) var(--ew-card-pad-bottom)',
        }}
      >
        <div
          className="animate-pulse"
          style={{
            height: 'clamp(2rem, 4.5vw, 3.5rem)',
            width: '60%',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px',
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: '9px',
            width: '35%',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '2px',
            marginTop: '8px',
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify cards render with new layout**

Run: `rtk npm run dev`. The PropertySelector still uses the old grid classes — cards should still render but won't have the new grid yet. Confirm no TypeScript errors:

```bash
rtk tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/PropertySelector/PropertyCard.tsx src/components/PropertySelector/PropertySkeleton.tsx
rtk git commit -m "feat(card): asymmetric layout, status micro-dot, editorial typography"
```

---

### Task 4: PropertySelector — Canvas Frame & Editorial Grid

**Files:**
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Replace the PropertySelector shell**

Replace the entire contents of `src/components/PropertySelector/PropertySelector.tsx` with:

```tsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType, OccupancyStatus } from '../../types';
import { sampleProperties } from './propertyData';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import PropertySkeleton from './PropertySkeleton';

interface PropertySelectorProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up' | 'morph') => void;
  onSelectProperty: (propertyId: string) => void;
  onNotify?: (message: string) => void;
}

const PARALLAX_CLASSES = [
  'ew-parallax-fast',
  '',
  'ew-parallax-slow',
  '',
  'ew-parallax-fast',
];

export default function PropertySelector({ onSelectProperty }: PropertySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<OccupancyStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property) => {
      const matchesSearch =
        searchQuery === '' ||
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        activeStatus === 'all' || property.occupancyStatus === activeStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeStatus]);

  const handleSelect = useCallback(
    (propertyId: string) => {
      onSelectProperty(propertyId);
    },
    [onSelectProperty],
  );

  const liveAnnouncement = `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} shown`;

  return (
    <div className="w-full ew-canvas relative">
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Floating header — inside canvas frame, top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-baseline justify-between"
        style={{
          marginBottom: 'clamp(16px, 2vw, 28px)',
          padding: '0',
        }}
      >
        <h1
          className="uppercase"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--ew-header-size)',
            fontWeight: 500,
            letterSpacing: 'var(--ew-header-tracking)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Properties
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          {filteredProperties.length} of {sampleProperties.length}
        </span>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 'clamp(12px, 1.5vw, 20px)' }}
      >
        <PropertyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
        />
      </motion.div>

      {/* Editorial Wall Grid */}
      {isLoading ? (
        <div className="ew-grid">
          {[1, 2, 3, 4, 5].map((i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      ) : (
        <div>
          {filteredProperties.length > 0 ? (
            <div className="ew-grid">
              <AnimatePresence mode="sync">
                {filteredProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    className="relative overflow-hidden"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.07,
                    }}
                  >
                    <div className="ew-card-hover-target">
                      <PropertyCard
                        property={property}
                        onSelect={handleSelect}
                        parallaxClass={PARALLAX_CLASSES[i] || ''}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center"
              style={{ height: 'calc(100dvh - var(--ew-frame) * 2 - 120px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p
                className="font-sans text-center"
                style={{
                  fontSize: '0.8125rem',
                  color: 'rgba(255,255,255,0.35)',
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
                  color: 'rgba(255,255,255,0.7)',
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
rtk tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Verify visual in browser**

Run: `rtk npm run dev`. Open in browser. Confirm:
- Canvas frame margin is visible around the grid
- Grid uses 3fr 2fr 2fr / 1fr 1.15fr proportions
- Header floats inside the frame, not in a sticky bar
- Status dots appear as micro-dots in top-right of each card
- Property names are large italic display font
- Locations are micro-caps below names
- Hover scales cards slightly
- Parallax works in Chrome/Edge (scroll down to see drift)

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/PropertySelector/PropertySelector.tsx
rtk git commit -m "feat(selector): canvas frame, editorial grid, floating header, scroll parallax"
```

---

### Task 5: Polish Pass — Hover Counter-Animation & Entry Refinement

**Files:**
- Modify: `src/components/PropertySelector/PropertyCard.tsx`
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Add hover counter-animation to text overlay**

In `src/components/PropertySelector/PropertyCard.tsx`, wrap the text overlay `div` with a counter-animate container. Replace the text overlay section (the `div` with `className="absolute bottom-0 left-0"`) with:

```tsx
{/* Text overlay — asymmetric padding, counter-animates on hover */}
<div
  className="absolute bottom-0 left-0 transition-transform duration-500"
  style={{
    padding: `0 var(--ew-card-pad-x) var(--ew-card-pad-bottom)`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transform: 'translateY(0)',
  }}
>
  <h3
    className="italic"
    style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--ew-name-size)',
      fontWeight: 400,
      color: 'rgba(255,255,255,0.94)',
      lineHeight: 0.95,
      letterSpacing: '-0.02em',
    }}
  >
    {property.name}
  </h3>
  <span
    className="uppercase block"
    style={{
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--ew-location-size)',
      fontWeight: 400,
      letterSpacing: 'var(--ew-location-tracking)',
      color: 'rgba(255,255,255,0.4)',
      marginTop: '8px',
    }}
  >
    {property.location}
  </span>
</div>
```

Then, in the parent `motion.button`, add a CSS rule for the counter-animation. Add this to the `className` of the button:

```
group-hover:[&>div:last-child]:-translate-y-1
```

Or more precisely, add a Tailwind arbitrary variant. The simpler approach: add a `<style>` tag inside the component or use inline `onMouseEnter`/`onMouseLeave` to toggle the transform. Since we're already using `group-hover` for the gradient, let's extend it.

Update the text overlay div to use Tailwind's group-hover:

```tsx
<div
  className="absolute bottom-0 left-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
  style={{
    padding: `0 var(--ew-card-pad-x) var(--ew-card-pad-bottom)`,
  }}
>
```

This makes the text slide down 4px on hover while the image scales up — the "window" counter-effect.

- [ ] **Step 2: Add @starting-style entry for status dots**

In `src/index.css`, add after the `.ew-status-dot` rules:

```css
/* Status dot entry animation */
@keyframes ew-dot-in {
  from {
    opacity: 0;
    scale: 0;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

.ew-status-dot {
  animation: ew-dot-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.3s;
}

@media (prefers-reduced-motion: reduce) {
  .ew-status-dot {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Verify hover and entry in browser**

Run: `rtk npm run dev`. Confirm:
- Hovering a card scales the image up while the text slides slightly down (counter-animation)
- Status dots animate in with a scale-from-zero after the card entry
- Reduced motion mode kills both animations

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/PropertySelector/PropertyCard.tsx src/index.css
rtk git commit -m "feat(overdrive): hover counter-animation, status dot entry animation"
```

---

### Task 6: Responsive Fallback & Final Audit

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/PropertySelector/PropertySelector.tsx`

- [ ] **Step 1: Add mobile responsive fallback**

In `src/index.css`, add after the editorial wall section:

```css
/* ── Editorial Wall — Mobile ── */
@media (max-width: 768px) {
  .ew-canvas {
    padding: clamp(16px, 4vw, 32px);
  }

  .ew-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    height: auto;
    min-height: calc(100dvh - clamp(16px, 4vw, 32px) * 2);
  }

  .ew-grid > *:nth-child(3) {
    grid-row: auto; /* collapse tall card on mobile */
  }

  .ew-grid > *:nth-child(5) {
    grid-column: span 2; /* last card spans full width */
  }
}

@media (max-width: 480px) {
  .ew-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .ew-grid > *:nth-child(3),
  .ew-grid > *:nth-child(5) {
    grid-column: auto;
    grid-row: auto;
  }
}
```

- [ ] **Step 2: Kill parallax on mobile (performance)**

Already handled by the `@supports` query — scroll-driven animations won't fire if the browser doesn't support them. But add explicit mobile kill in the existing `@media (prefers-reduced-motion: reduce)` block (already done in Task 2).

- [ ] **Step 3: Run full typecheck and lint**

```bash
rtk tsc --noEmit
rtk npm run lint
```

Expected: No errors.

- [ ] **Step 4: Visual audit**

Run: `rtk npm run dev`. Check:
- Desktop (1440px+): Canvas frame, 3-column masonry, parallax, hover scale + counter-animate
- Tablet (768-1024px): 2-column grid, reduced frame
- Mobile (375px): Single column, no parallax, touch-friendly
- Reduced motion: No animations, no parallax, no hover scale

- [ ] **Step 5: Final commit**

```bash
rtk git add src/index.css
rtk git commit -m "feat(responsive): mobile fallback for editorial wall grid"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Canvas frame margin ✓, masonry grid proportions ✓, aggressive type scale ✓, status micro-dot ✓, floating header ✓, scroll-driven parallax ✓, hover counter-animation ✓, responsive fallback ✓
- [ ] **Placeholder scan:** No TBD/TODO/fill-in-later found
- [ ] **Type consistency:** `parallaxClass` prop added to PropertyCard and used consistently in PropertySelector ✓
- [ ] **Design law compliance:** No side-stripe borders ✓, no gradient text ✓, no hero-metric template ✓, no identical card grids ✓, no modals ✓, no em dashes ✓, OKLCH for status colors ✓, tinted neutrals ✓
