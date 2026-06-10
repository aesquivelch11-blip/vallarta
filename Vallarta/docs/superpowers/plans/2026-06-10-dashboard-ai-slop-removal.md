# Dashboard AI Slop Removal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all generic UI patterns (AI slop) from the dashboard — metric cards, status cards, sparklines, charts, gradient overlays, urgent alerts — and rebuild each domain as a clean, editorial, hospitality-grade layout.

**Architecture:** Four-phase surgical refactor. Phase 1 removes all slop components. Phase 2 rebuilds DashboardToday as a single-column editorial flow. Phase 3 rebuilds DashboardFinancials as a P&L sequence. Phase 4 cleans up dead code and verifies. No new dependencies. All changes use existing design tokens, inline styles, and CSS custom properties.

**Tech Stack:** React 18, TypeScript, motion/react, lucide-react, CSS custom properties, Vitest + @testing-library/react

**Design Principles (from research + skills):**
- **$impeccable distill**: Remove unnecessary cards, decorations, borders. Flatten structure. Use spacing and alignment for grouping.
- **$impeccable layout**: Tight grouping for related elements (8-12px), generous separation between sections (48-96px). No identical card grids. Use flex for 1D, grid for 2D.
- **ui-ux-pro-max**: Direct labeling for small datasets (no charts for 5-6 items). Emphasize trends over decoration. Limit data density per view.
- **Hospitality reference sites**: Restraint is the luxury signal. Photography is primary. Typography is architecture. No generic UI patterns.

---

## File Map

| File | Responsibility | Action |
|---|---|---|
| `src/components/Dashboard/MetricCard.tsx` | Generic metric card (icon + heading + text) | **Delete** |
| `src/components/Dashboard/MetricGrid.tsx` | 3-column metric card grid | **Delete** |
| `src/components/Dashboard/StatusCards.tsx` | 2×2 task category card grid | **Delete** |
| `src/components/Dashboard/UrgentAlert.tsx` | Red side-stripe alert banner | **Delete** |
| `src/components/Dashboard/GuestFlowStrip.tsx` | Arrivals/departures grid | **Delete** |
| `src/components/Dashboard/PropertyTitleCard.tsx` | Rounded card with border and accent line | **Delete** |
| `src/components/Dashboard/RevparSnapshot.tsx` | RevPAR figure + sparkline | **Delete** |
| `src/components/Dashboard/DashboardToday.tsx` | Today domain (rebuild) | **Rewrite** |
| `src/components/Dashboard/DashboardFinancials.tsx` | Financials domain (rebuild) | **Rewrite** |
| `src/components/Dashboard/DashboardGallery.tsx` | Gallery (strip UI overlays) | **Modify** |
| `src/components/Dashboard/DashboardView.tsx` | Top-level layout | **Modify** (remove imports) |
| `src/components/Dashboard/DashboardTasks.tsx` | Tasks domain (minor cleanup) | **Modify** (remove unused imports) |

---

## Phase 1: Destruction — Remove All Slop Components

**Goal:** Delete all generic UI components and strip DashboardGallery of UI overlays. Verify no broken imports.

---

### Task 1: Delete orphaned slop components

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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Errors in DashboardToday.tsx and DashboardView.tsx (importing deleted files). That's expected — we'll fix them in the next tasks.

---

### Task 2: Strip DashboardGallery UI overlays

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

- [ ] **Step 1: Remove gradient overlay, name overlay, chevrons, dots**

Remove the entire gradient overlay div, the motion.p name overlay, and the dot/chevron navigation. Keep only the image, the click-zone navigation, and the counter.

The file should end up as:

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

## Phase 2: Rebuild DashboardToday — Editorial Single-Column Layout

**Goal:** Rewrite DashboardToday as a clean, editorial flow: Property Identity → Occupancy → Arrivals → Departures → Quiet Day Message → Nav Links. No cards, no grids, no sparklines, no badges.

---

### Task 3: Rewrite DashboardToday.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

- [ ] **Step 1: Rewrite the component**

Replace the entire file with:

```tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { Domain } from './DashboardDomainNav';
import { DashboardData, formatTrendPercent, getTrendDirection } from './dashboardData';

interface DashboardTodayProps {
  data: DashboardData;
  propertyName: string;
  propertyLocation: string;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onDomainChange?: (domain: Domain) => void;
}

export default function DashboardToday({ data, propertyName, propertyLocation, onNavigate, onDomainChange }: DashboardTodayProps) {
  const { occupancy, occupancyPrev, arrivalsToday, departuresToday, arrivalsTomorrow, departuresTomorrow } = data;
  const occTrend = formatTrendPercent(occupancy, occupancyPrev);
  const occDirection = getTrendDirection(occupancy, occupancyPrev);

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'var(--color-ink-secondary)',
    margin: 0,
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(0.75rem, 1.5vw, 1.25rem) clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)',
        gap: 'clamp(1.5rem, 3vw, 2.5rem)',
        overflow: 'hidden',
        justifyContent: 'flex-start',
      }}
    >
      {/* Property identity — editorial, minimal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {propertyName}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          {propertyLocation}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Occupancy — dominant element */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1,
          }}
        >
          {occupancy}%
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
          <p style={labelStyle}>OCCUPANCY</p>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              color:
                occDirection === 'up'
                  ? 'var(--color-accent-positive)'
                  : occDirection === 'down'
                    ? 'var(--color-accent-negative)'
                    : 'var(--color-ink-muted)',
              margin: 0,
              opacity: 0.85,
            }}
          >
            {occTrend}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Arrivals — more visual weight than departures */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {arrivalsToday.length}
          </p>
          <p style={labelStyle}>Arriving</p>
        </div>
        {arrivalsToday.length > 0 && (
          <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {arrivalsToday.map(g => (
              <li
                key={g.id}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--color-ink)',
                  lineHeight: 1.35,
                }}
              >
                {g.name}
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.625rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-secondary)',
                    marginLeft: '8px',
                  }}
                >
                  {g.nights}n
                </span>
              </li>
            ))}
          </ul>
        )}
        {arrivalsToday.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: '10px 0 0',
            }}
          >
            No arrivals
          </p>
        )}
        {arrivalsTomorrow.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              margin: '8px 0 0',
              lineHeight: 1.4,
            }}
          >
            {arrivalsTomorrow.length} {arrivalsTomorrow.length === 1 ? 'guest arrives' : 'guests arrive'} tomorrow
          </p>
        )}
      </div>

      {/* Departures — smaller scale */}
      <div style={{ opacity: 0.75 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {departuresToday.length}
          </p>
          <p style={{ ...labelStyle, fontSize: '0.5rem', opacity: 0.75 }}>Departing</p>
        </div>
        {departuresToday.length > 0 && (
          <ul style={{ margin: '10px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {departuresToday.map(g => (
              <li
                key={g.id}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                  fontWeight: 400,
                  color: 'var(--color-ink-secondary)',
                  lineHeight: 1.35,
                }}
              >
                {g.name}
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.625rem',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-secondary)',
                    marginLeft: '8px',
                  }}
                >
                  {g.nights}n
                </span>
              </li>
            ))}
          </ul>
        )}
        {departuresToday.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: '10px 0 0',
            }}
          >
            No departures
          </p>
        )}
        {departuresTomorrow.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              margin: '8px 0 0',
              lineHeight: 1.4,
            }}
          >
            {departuresTomorrow.length} {departuresTomorrow.length === 1 ? 'guest departs' : 'guests depart'} tomorrow
          </p>
        )}
      </div>

      {/* Quiet day message */}
      {arrivalsToday.length === 0 && departuresToday.length === 0 && (
        <div
          style={{
            marginTop: 'clamp(0.5rem, 1vw, 1rem)',
            paddingTop: 'clamp(0.5rem, 1vw, 1rem)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Quiet day — no arrivals or departures scheduled.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div style={{ marginTop: 'auto', display: 'flex', gap: '24px' }}>
        <button
          className="dashboard-link"
          onClick={() => onNavigate('calendar', 'push')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-secondary)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          Calendar <ArrowRight size={10} strokeWidth={1.5} />
        </button>
        {onDomainChange && (
          <button
            className="dashboard-link"
            onClick={() => onDomainChange('financials')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-secondary)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            Financials <ArrowRight size={10} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Write tests for DashboardToday**

Create `tests/components/Dashboard/DashboardToday.test.tsx`:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import DashboardToday from '../../../src/components/Dashboard/DashboardToday';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

const mockNavigate = vi.fn();
const mockDomainChange = vi.fn();
const data = getDashboardData('casa-palmeras');

afterEach(cleanup);

describe('DashboardToday', () => {
  it('renders property name in italic', () => {
    const { container } = render(
      <DashboardToday
        data={data}
        propertyName="Casa Palmeras"
        propertyLocation="Puerto Vallarta"
        onNavigate={mockNavigate}
        onDomainChange={mockDomainChange}
      />
    );
    const nameEl = container.querySelector('p[style*="font-style: italic"]');
    expect(nameEl).toBeTruthy();
    expect(nameEl?.textContent).toContain('Casa Palmeras');
  });

  it('renders occupancy as dominant figure', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('78%');
    expect(container.textContent).toContain('OCCUPANCY');
  });

  it('renders arrivals with guest names in italic', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('Elena Rosenthal');
    expect(container.textContent).toContain('2');
    expect(container.textContent).toContain('Arriving');
  });

  it('renders departures with upright names', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('James Whitfield');
    expect(container.textContent).toContain('Departing');
  });

  it('renders tomorrow hints', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('guest arrives tomorrow');
  });

  it('does not render any cards or borders', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    const cards = container.querySelectorAll('[style*="border-radius: 8px"]');
    expect(cards.length).toBe(0);
  });

  it('does not render metric cards, sparklines, or badges', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.querySelector('svg')).toBeNull(); // no sparklines
    expect(container.textContent).not.toContain('Revenue MTD');
    expect(container.textContent).not.toContain('Satisfaction');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `rtk vitest run tests/components/Dashboard/DashboardToday.test.tsx`

Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Dashboard/DashboardToday.tsx tests/components/Dashboard/DashboardToday.test.tsx
git commit -m "feat: rebuild DashboardToday as editorial single-column layout"
```

---

## Phase 3: Rebuild DashboardFinancials — P&L Sequence

**Goal:** Rewrite DashboardFinancials as a clean P&L sequence: Period Selector → Revenue → Expenses → Net → Nav Link. Remove all charts. Use generous spacing to create hierarchy.

---

### Task 4: Rewrite DashboardFinancials.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

- [ ] **Step 1: Remove chart imports and rewrite the component**

Replace the entire file with:

```tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency, formatTrendPercent } from './dashboardData';

interface DashboardFinancialsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardFinancials({ data, onNavigate }: DashboardFinancialsProps) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const { periods } = data;
  const period = periods[selectedPeriodIndex];
  const net = period.revenue - period.expenses;
  const isNegative = net < 0;

  const goPrevPeriod = () => setSelectedPeriodIndex(prev => Math.min(prev + 1, periods.length - 1));
  const goNextPeriod = () => setSelectedPeriodIndex(prev => Math.max(prev - 1, 0));

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'var(--color-ink-secondary)',
    margin: 0,
  };

  const figureStyle: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    color: 'var(--color-ink)',
    margin: 0,
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(0.75rem, 1.5vw, 1.25rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
        gap: 'clamp(2rem, 4vw, 3rem)',
        justifyContent: 'flex-start',
      }}
    >
      {/* Period selector */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="dashboard-focus"
          onClick={goPrevPeriod}
          disabled={selectedPeriodIndex >= periods.length - 1}
          aria-label="Previous period"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: selectedPeriodIndex >= periods.length - 1 ? 'default' : 'pointer',
            color: selectedPeriodIndex >= periods.length - 1 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--color-ink)',
            letterSpacing: '0.02em',
            userSelect: 'none',
          }}
        >
          {period.label}
        </span>
        <button
          className="dashboard-focus"
          onClick={goNextPeriod}
          disabled={selectedPeriodIndex <= 0}
          aria-label="Next period"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px',
            cursor: selectedPeriodIndex <= 0 ? 'default' : 'pointer',
            color: selectedPeriodIndex <= 0 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Revenue */}
      <div>
        <p style={labelStyle}>REVENUE</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            marginTop: '6px',
          }}
        >
          {formatCurrency(period.revenue)}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.5625rem',
            fontWeight: 400,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-muted)',
            margin: '4px 0 0',
          }}
        >
          {formatTrendPercent(period.revenue, data.revenueHistory[selectedPeriodIndex] || period.revenue)} vs prior
        </p>
      </div>

      {/* Expenses — subordinate */}
      <div style={{ opacity: 0.75 }}>
        <p style={{ ...labelStyle, opacity: 0.7 }}>EXPENSES</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            marginTop: '6px',
            opacity: 0.75,
          }}
        >
          {formatCurrency(period.expenses)}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Net — dominant */}
      <div>
        <p style={{ ...labelStyle, fontSize: '0.625rem', letterSpacing: '0.32em' }}>NET</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginTop: '10px',
            color: isNegative ? 'var(--color-accent-negative)' : 'var(--color-ink)',
          }}
        >
          {formatCurrency(net)}
        </p>
      </div>

      {/* Nav link */}
      <button
        className="dashboard-link"
        onClick={() => onNavigate('reporting', 'push')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.625rem',
          fontWeight: 500,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          alignSelf: 'flex-start',
          marginTop: 'auto',
        }}
      >
        VIEW FINANCIALS <ArrowRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Write tests for DashboardFinancials**

Create `tests/components/Dashboard/DashboardFinancials.test.tsx`:

```tsx
import { render, cleanup, fireEvent } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardFinancials from '../../../src/components/Dashboard/DashboardFinancials';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

const mockNavigate = vi.fn();
const data = getDashboardData('casa-palmeras');

afterEach(cleanup);

describe('DashboardFinancials', () => {
  it('renders current period label', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('June 2026');
  });

  it('renders Revenue, Expenses, Net labels', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('REVENUE');
    expect(container.textContent).toContain('EXPENSES');
    expect(container.textContent).toContain('NET');
  });

  it('renders correct Net figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    // June 2026: revenue 12400 - expenses 3200 = 9200
    expect(container.textContent).toContain('$9,200');
  });

  it('does not render any charts or bars', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelectorAll('[style*="border-radius: 8px"]').length).toBe(0);
  });

  it('period navigation works', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(b => b.getAttribute('aria-label') === 'Previous period') as HTMLButtonElement;
    fireEvent.click(leftBtn);
    expect(container.textContent).toContain('May 2026');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `rtk vitest run tests/components/Dashboard/DashboardFinancials.test.tsx`

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Dashboard/DashboardFinancials.tsx tests/components/Dashboard/DashboardFinancials.test.tsx
git commit -m "feat: rebuild DashboardFinancials as P&L sequence, remove all charts"
```

---

## Phase 4: Cleanup — Remove Dead Code, Verify, and Polish

**Goal:** Remove all dead imports, delete unused chart components, verify the full dashboard works, run the full test suite.

---

### Task 5: Clean up DashboardView.tsx imports

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

- [ ] **Step 1: Remove unused imports**

Remove these lines from the imports:
- `import DashboardGallery from './DashboardGallery';` (already removed in Task 1 — verify)
- `import DashboardToday from './DashboardToday';` (keep)
- `import DashboardFinancials from './DashboardFinancials';` (keep)
- `import DashboardOperations from './DashboardOperations';` (keep)
- `import DashboardErrorBoundary from './DashboardErrorBoundary';` (keep)
- `import DarkModeToggle from './DarkModeToggle';` (keep)
- `import { AmbientProvider } from './AmbientColorProvider';` (keep)
- `import { motion } from 'motion/react';` (keep)

Verify no deleted components are imported. If any are, remove them.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardView.tsx
git commit -m "chore: clean up DashboardView imports after slop removal"
```

---

### Task 6: Delete unused chart components

**Files:**
- Delete: `src/components/Dashboard/ExpenseBreakdownChart.tsx`
- Delete: `src/components/Dashboard/RevenueTrajectoryChart.tsx`
- Delete: `src/components/Dashboard/OccupancyHeatmap.tsx`

- [ ] **Step 1: Delete files**

```bash
rm src/components/Dashboard/ExpenseBreakdownChart.tsx
rm src/components/Dashboard/RevenueTrajectoryChart.tsx
rm src/components/Dashboard/OccupancyHeatmap.tsx
```

- [ ] **Step 2: Search for any remaining imports**

```bash
rtk grep "ExpenseBreakdownChart\|RevenueTrajectoryChart\|OccupancyHeatmap" src/
```

Expected: No matches.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete unused chart components"
```

---

### Task 7: Run full test suite

- [ ] **Step 1: Run all tests**

Run: `rtk vitest run`

Expected: All tests pass.

- [ ] **Step 2: Fix any failing tests**

If any tests fail, read the error, fix the code, and re-run until all pass.

- [ ] **Step 3: Commit**

```bash
git commit -m "test: verify all dashboard tests pass after redesign"
```

---

### Task 8: Final review — AI slop check

- [ ] **Step 1: Manual audit of all modified files**

Check each file for these tells:
- [ ] No card components with borders, backgrounds, border-radius
- [ ] No gradient overlays
- [ ] No sparklines or line charts
- [ ] No bar charts or heatmaps
- [ ] No side-stripe borders (borderLeft > 1px as accent)
- [ ] No identical card grids
- [ ] No hero-metric templates (big number + small label + supporting stats)
- [ ] No generic badges or trend indicators

- [ ] **Step 2: Verify gallery is clean**

Open `src/components/Dashboard/DashboardGallery.tsx` and confirm:
- No gradient overlay div
- No name overlay on image
- No chevron buttons
- No dot navigation strip
- Counter is present, minimal

- [ ] **Step 3: Commit audit results**

```bash
git commit --allow-empty -m "review: manual AI slop audit passed — no generic patterns detected"
```

---

## Self-Review

### Spec Coverage Check

| Spec Requirement | Task | Covered |
|---|---|---|
| Remove metric cards | Task 1 | ✅ |
| Remove status cards | Task 1 | ✅ |
| Remove urgent alerts | Task 1 | ✅ |
| Remove sparklines | Task 1 | ✅ |
| Remove gradient overlay from gallery | Task 2 | ✅ |
| Remove name overlay from gallery | Task 2 | ✅ |
| Remove chevron/dots from gallery | Task 2 | ✅ |
| Rebuild Today as editorial flow | Task 3 | ✅ |
| Occupancy as dominant element | Task 3 | ✅ |
| Arrivals with italic guest names | Task 3 | ✅ |
| Departures with upright names | Task 3 | ✅ |
| Tomorrow hints subordinate | Task 3 | ✅ |
| Quiet day message | Task 3 | ✅ |
| Rebuild Financials as P&L sequence | Task 4 | ✅ |
| Remove expense breakdown chart | Task 4 | ✅ |
| Remove revenue trajectory chart | Task 4 | ✅ |
| Remove occupancy heatmap | Task 4 | ✅ |
| Delete orphaned components | Task 6 | ✅ |
| Tests for all new components | Tasks 3, 4 | ✅ |

### Placeholder Scan

- No "TBD", "TODO", "implement later", or "fill in details" found.
- All steps contain actual code, commands, and expected outputs.
- No references to types/functions not defined in the plan.

### Type Consistency

- `DashboardToday` props match the interface in `DashboardView.tsx`.
- `DashboardFinancials` props match the interface in `DashboardView.tsx`.
- `formatCurrency`, `formatTrendPercent`, `getTrendDirection` are used consistently from `dashboardData.ts`.
- No new types introduced.

---

## Execution Handoff

**Plan complete.**

**Execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per phase, review between phases, fast iteration.

**2. Inline Execution** — Execute all tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach?**
