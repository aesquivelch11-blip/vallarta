# Dashboard Design Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate AI slop tells, fix critical UX bugs, and consolidate the Financials + Performance tabs into a single unified view.

**Architecture:** Eight targeted fixes applied in priority order — P0 interaction bug first, then P1 slop removal, then P2 polish, then tab consolidation, then performance/consistency. Each task is self-contained; tests stay green between commits.

**Tech Stack:** React 18, TypeScript, Vitest + @testing-library/react, motion/react, lucide-react, CSS custom properties (OKLCH design tokens)

---

## Task 1: Fix period navigation arrow direction (P0 bug)

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx:35-43`

The `ChevronLeft` button calls `goNextPeriod` (moves to a more recent period) and `ChevronRight` calls `goPrevPeriod` (moves to an older period). This is inverted. Pressing Left should go to an older period (higher index); pressing Right should go to a newer period (lower index).

- [ ] **Step 1: Write the failing test**

Create `tests/components/Dashboard/DashboardFinancials.test.tsx`:

```tsx
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import DashboardFinancials from '../../../src/components/Dashboard/DashboardFinancials';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

const mockNavigate = vi.fn();
const data = getDashboardData('casa-palmeras');

afterEach(cleanup);

describe('DashboardFinancials period navigation', () => {
  it('ChevronLeft navigates to an older period (increases index)', () => {
    const { container } = render(
      <DashboardFinancials data={data} onNavigate={mockNavigate} />
    );
    // Initial period is index 0 = 'June 2026'
    expect(container.textContent).toContain('June 2026');

    // Press Left arrow — should go to May 2026 (older, index 1)
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    fireEvent.click(leftBtn);

    expect(container.textContent).toContain('May 2026');
  });

  it('ChevronRight navigates to a newer period (decreases index)', () => {
    const { container } = render(
      <DashboardFinancials data={data} onNavigate={mockNavigate} />
    );
    // Navigate to May first
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    fireEvent.click(leftBtn);
    expect(container.textContent).toContain('May 2026');

    // Press Right arrow — should go back to June 2026 (newer, index 0)
    const rightBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Next period'
    ) as HTMLButtonElement;
    fireEvent.click(rightBtn);
    expect(container.textContent).toContain('June 2026');
  });

  it('Left arrow is disabled on oldest period', () => {
    const { container } = render(
      <DashboardFinancials data={data} onNavigate={mockNavigate} />
    );
    // Navigate to last period (January 2026)
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    for (let i = 0; i < data.periods.length - 1; i++) {
      fireEvent.click(leftBtn);
    }
    expect(leftBtn).toBeDisabled();
  });

  it('Right arrow is disabled on most recent period', () => {
    const { container } = render(
      <DashboardFinancials data={data} onNavigate={mockNavigate} />
    );
    const buttons = container.querySelectorAll('button[aria-label]');
    const rightBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Next period'
    ) as HTMLButtonElement;
    expect(rightBtn).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/DashboardFinancials.test.tsx
```

Expected: FAIL — "May 2026" found instead of expected or button disabled state wrong.

- [ ] **Step 3: Fix the arrow-to-handler assignments in `DashboardFinancials.tsx`**

Change lines 35–43. The fix: `aria-label="Previous period"` goes on `ChevronLeft` and calls `goPrevPeriod` (goes to older period = higher index). `aria-label="Next period"` goes on `ChevronRight` and calls `goNextPeriod` (goes to newer period = lower index).

```tsx
<button
  className="dashboard-focus"
  onClick={goPrevPeriod}
  disabled={selectedPeriodIndex >= periods.length - 1}
  aria-label="Previous period"
  style={{
    background: 'none', border: 'none', padding: '2px',
    cursor: selectedPeriodIndex >= periods.length - 1 ? 'default' : 'pointer',
    color: selectedPeriodIndex >= periods.length - 1 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
    display: 'flex', alignItems: 'center',
  }}
>
  <ChevronLeft size={14} strokeWidth={1.5} />
</button>
<span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink)', letterSpacing: '0.02em', userSelect: 'none' }}>
  {period.label}
</span>
<button
  className="dashboard-focus"
  onClick={goNextPeriod}
  disabled={selectedPeriodIndex <= 0}
  aria-label="Next period"
  style={{
    background: 'none', border: 'none', padding: '2px',
    cursor: selectedPeriodIndex <= 0 ? 'default' : 'pointer',
    color: selectedPeriodIndex <= 0 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)',
    display: 'flex', alignItems: 'center',
  }}
>
  <ChevronRight size={14} strokeWidth={1.5} />
</button>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
rtk vitest run tests/components/Dashboard/DashboardFinancials.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
rtk git add tests/components/Dashboard/DashboardFinancials.test.tsx src/components/Dashboard/DashboardFinancials.tsx
rtk git commit -m "fix: correct period navigation arrow direction in DashboardFinancials"
```

---

## Task 2: Replace PropertyHealthScore with RevparSnapshot (P1 slop removal)

**Files:**
- Create: `src/components/Dashboard/RevparSnapshot.tsx`
- Modify: `src/components/Dashboard/DashboardToday.tsx`
- Keep (unused): `src/components/Dashboard/PropertyHealthScore.tsx` (do not delete yet — may be referenced in tests)

RevPAR (Revenue Per Available Room night) = `revenue / daysInPeriod`. For MTD, use 30 days. This is the standard hospitality KPI replacing the synthetic composite score. The component shows: REVPAR label → EB Garamond figure → trend delta → mini occupancy sparkline (80×28 SVG).

- [ ] **Step 1: Write the failing test**

Create `tests/components/Dashboard/RevparSnapshot.test.tsx`:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import RevparSnapshot from '../../../src/components/Dashboard/RevparSnapshot';

afterEach(cleanup);

const mockSparkline = [68, 71, 73, 74, 76, 78];

describe('RevparSnapshot', () => {
  it('renders REVPAR label', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} daysInPeriod={30} sparklineData={mockSparkline} trend="+5%" trendDirection="up" />
    );
    expect(container.textContent).toContain('REVPAR');
  });

  it('displays correct RevPAR value (revenue / daysInPeriod)', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} daysInPeriod={30} sparklineData={mockSparkline} trend="+5%" trendDirection="up" />
    );
    // 12400 / 30 = 413.33 → rounds to 413
    expect(container.textContent).toContain('413');
  });

  it('defaults to 30 days when daysInPeriod is omitted', () => {
    const { container } = render(
      <RevparSnapshot revenue={9000} sparklineData={mockSparkline} trend="+2%" trendDirection="up" />
    );
    // 9000 / 30 = 300
    expect(container.textContent).toContain('300');
  });

  it('renders an SVG sparkline', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} sparklineData={mockSparkline} trend="+5%" trendDirection="up" />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('polyline')).toBeInTheDocument();
  });

  it('renders trend value', () => {
    const { container } = render(
      <RevparSnapshot revenue={12400} sparklineData={mockSparkline} trend="+14%" trendDirection="up" />
    );
    expect(container.textContent).toContain('+14%');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/RevparSnapshot.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/components/Dashboard/RevparSnapshot.tsx`**

```tsx
import React from 'react';

interface RevparSnapshotProps {
  revenue: number;
  daysInPeriod?: number;
  sparklineData: number[];
  trend: string;
  trendDirection: 'up' | 'down' | 'flat';
}

export default function RevparSnapshot({
  revenue,
  daysInPeriod = 30,
  sparklineData,
  trend,
  trendDirection,
}: RevparSnapshotProps) {
  const revpar = Math.round(revenue / daysInPeriod);

  const w = 80, h = 28, pad = 2;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const points = sparklineData
    .map((val, i) => {
      const x = pad + (i / (sparklineData.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((val - min) / range) * (h - 2 * pad);
      return `${x},${y}`;
    })
    .join(' ');

  const trendColor =
    trendDirection === 'up'
      ? 'var(--color-accent-positive)'
      : trendDirection === 'down'
      ? 'var(--color-accent-negative)'
      : 'var(--color-ink-muted)';

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'var(--color-ink-secondary)',
    margin: 0,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={labelStyle}>REVPAR</p>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: 'var(--color-ink)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        ${revpar.toLocaleString()}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5rem',
          fontWeight: 400,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: trendColor,
          margin: '2px 0 0',
        }}
      >
        {trend}
      </p>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ marginTop: '8px' }}
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-ink-secondary)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.35"
        />
      </svg>
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.4375rem',
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          margin: 0,
        }}
      >
        30-day occupancy
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
rtk vitest run tests/components/Dashboard/RevparSnapshot.test.tsx
```

Expected: PASS (5 tests)

- [ ] **Step 5: Update `DashboardToday.tsx` to use RevparSnapshot**

Replace the `PropertyHealthScore` import and usage. The `healthScore` calculation can be removed entirely.

Remove line 7: `import PropertyHealthScore from './PropertyHealthScore';`
Add after existing imports: `import RevparSnapshot from './RevparSnapshot';`

Remove lines 30–33 (the `healthScore` calculation):
```tsx
// DELETE these lines:
const healthScore = Math.round(
  (data.occupancy * 0.4) + (data.guestSatisfaction.score * 10 * 0.3) + (Math.min(currentPeriod.revenue / data.budgetTarget, 1) * 100 * 0.3)
);
```

In Zone A (lines 62–68), replace `<PropertyHealthScore score={healthScore} />` with:

```tsx
<RevparSnapshot
  revenue={currentPeriod.revenue}
  daysInPeriod={30}
  sparklineData={data.occupancyHistory}
  trend={revTrend}
  trendDirection={revDirection}
/>
```

- [ ] **Step 6: Run full test suite**

```bash
rtk vitest run
```

Expected: All existing tests pass plus the 5 new RevparSnapshot tests.

- [ ] **Step 7: Commit**

```bash
rtk git add src/components/Dashboard/RevparSnapshot.tsx src/components/Dashboard/DashboardToday.tsx tests/components/Dashboard/RevparSnapshot.test.tsx
rtk git commit -m "feat: replace PropertyHealthScore gauge with RevparSnapshot (RevPAR + occupancy sparkline)"
```

---

## Task 3: Fix StatusCards orphaned 4th card (P2)

**Files:**
- Modify: `src/components/Dashboard/StatusCards.tsx:21`

Change `gridTemplateColumns: '1fr 1fr 1fr'` to `'1fr 1fr'` for a balanced 2×2 grid.

- [ ] **Step 1: Write the failing test**

Add to `tests/components/Dashboard/` — create `StatusCards.test.tsx`:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import StatusCards from '../../../src/components/Dashboard/StatusCards';
import { getDashboardData } from '../../../src/components/Dashboard/dashboardData';

afterEach(cleanup);

const data = getDashboardData('casa-palmeras');

describe('StatusCards', () => {
  it('renders all 4 category cards', () => {
    const { container } = render(<StatusCards tasks={data.tasks} />);
    const cards = container.querySelectorAll('[style*="border-radius: 8px"]');
    expect(cards).toHaveLength(4);
  });

  it('grid uses 2-column layout', () => {
    const { container } = render(<StatusCards tasks={data.tasks} />);
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe('1fr 1fr');
  });

  it('renders Maintenance category', () => {
    const { container } = render(<StatusCards tasks={data.tasks} />);
    expect(container.textContent).toContain('Maintenance');
  });

  it('renders Inspection category', () => {
    const { container } = render(<StatusCards tasks={data.tasks} />);
    expect(container.textContent).toContain('Inspection');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/StatusCards.test.tsx
```

Expected: FAIL on `gridTemplateColumns` assertion (`'1fr 1fr 1fr'` ≠ `'1fr 1fr'`).

- [ ] **Step 3: Fix the grid in `StatusCards.tsx`**

Change line 21:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
rtk vitest run tests/components/Dashboard/StatusCards.test.tsx
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/Dashboard/StatusCards.tsx tests/components/Dashboard/StatusCards.test.tsx
rtk git commit -m "fix: change StatusCards to 2x2 grid to eliminate orphaned 4th card"
```

---

## Task 4: Add gallery navigation affordances — dots + hover chevrons (P2)

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`

Add: (1) dot strip at bottom center showing current position, active dot expands to 16px pill; (2) chevron buttons that fade in on hover at left/right thirds; (3) `aria-hidden="true"` removed from outer container so screen readers can access the property name.

- [ ] **Step 1: Write the failing test**

Add to `tests/components/Dashboard/DashboardGallery.test.tsx` (append to existing describe block):

```tsx
it('renders dot navigation indicators when multiple images', () => {
  const { container } = render(
    <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
  );
  const dots = container.querySelectorAll('[data-gallery-dot]');
  expect(dots).toHaveLength(3);
});

it('first dot is active (wider) on initial render', () => {
  const { container } = render(
    <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
  );
  const dots = container.querySelectorAll('[data-gallery-dot]');
  const firstDot = dots[0] as HTMLElement;
  expect(firstDot.getAttribute('data-active')).toBe('true');
});

it('renders no dots for single image', () => {
  const { container } = render(
    <DashboardGallery images={['/single.jpg']} propertyId="casa-del-sol" propertyName="Casa del Sol" />
  );
  const dots = container.querySelectorAll('[data-gallery-dot]');
  expect(dots).toHaveLength(0);
});

it('outer container is not aria-hidden', () => {
  const { container } = render(
    <DashboardGallery images={testImages} propertyId="casa-del-sol" propertyName="Casa del Sol" />
  );
  const outer = container.firstElementChild;
  expect(outer?.getAttribute('aria-hidden')).not.toBe('true');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/DashboardGallery.test.tsx
```

Expected: FAIL on `data-gallery-dot` and `aria-hidden` assertions.

- [ ] **Step 3: Update `DashboardGallery.tsx`**

Add `useState` for `hovered`. Add `ChevronLeft, ChevronRight` to lucide-react import. Remove `aria-hidden="true"` from outer container. Add `role="region"` and `aria-label={propertyName}`. Add dot strip and chevrons inside the frame div.

Full updated file:

```tsx
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardGalleryProps {
  images: string[];
  propertyId: string;
  propertyName: string;
}

export default function DashboardGallery({ images, propertyId, propertyName }: DashboardGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
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
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: (dir: number) => ({ x: `${dir * 100}%`, opacity: 0 }),
        animate: { x: '0%', opacity: 1 },
        exit: (dir: number) => ({ x: `${dir * -100}%`, opacity: 0 }),
      };

  const counter = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  const chevronBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(15, 26, 26, 0.35)',
    border: 'none',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.85)',
    zIndex: 6,
    transition: 'opacity 0.2s ease, background 0.2s ease',
  };

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
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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

        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(15,26,26,0.3) 0%, rgba(15,26,26,0.6) 100%)',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
          className="dark-mode-overlay"
        />

        <motion.p
          layoutId={`property-title-${propertyId}`}
          className="absolute top-3 left-4"
          style={{
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
          {propertyName}
        </motion.p>

        {/* Hover chevrons */}
        {total > 1 && hovered && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
              style={{ ...chevronBtnStyle, left: '12px' }}
            >
              <ChevronLeft size={14} strokeWidth={1.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
              style={{ ...chevronBtnStyle, right: '12px' }}
            >
              <ChevronRight size={14} strokeWidth={1.5} />
            </button>
          </>
        )}

        {/* Dot navigation strip */}
        {total > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            {images.map((_, i) => (
              <div
                key={i}
                data-gallery-dot
                data-active={i === currentIndex ? 'true' : 'false'}
                style={{
                  width: i === currentIndex ? '14px' : '4px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'rgba(255,255,255,0.8)',
                  opacity: i === currentIndex ? 1 : 0.4,
                  transition: 'width 0.3s var(--ease-out-expo), opacity 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        {total > 1 && (
          <span
            className="absolute bottom-3 right-4"
            style={{
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

- [ ] **Step 4: Run tests to verify they pass**

```bash
rtk vitest run tests/components/Dashboard/DashboardGallery.test.tsx
```

Expected: PASS (all existing + 4 new tests)

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/Dashboard/DashboardGallery.tsx tests/components/Dashboard/DashboardGallery.test.tsx
rtk git commit -m "feat: add gallery dot indicators and hover chevrons for discoverability"
```

---

## Task 5: Fix ExpenseBreakdownChart categorical colors (P2)

**Files:**
- Modify: `src/components/Dashboard/ExpenseBreakdownChart.tsx`

Each expense category gets a distinct brand-coherent color instead of all bars using `--color-accent-positive`. Five colors from the Banderas palette, desaturated enough to stay calm.

- [ ] **Step 1: Write the failing test**

Create `tests/components/Dashboard/ExpenseBreakdownChart.test.tsx`:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ExpenseBreakdownChart from '../../../src/components/Dashboard/ExpenseBreakdownChart';

afterEach(cleanup);

const mockData = [
  { label: 'Maintenance', amount: 1200 },
  { label: 'Utilities', amount: 850 },
  { label: 'Staff', amount: 680 },
  { label: 'Supplies', amount: 320 },
  { label: 'Other', amount: 150 },
];

describe('ExpenseBreakdownChart', () => {
  it('renders all category labels', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    expect(container.textContent).toContain('Maintenance');
    expect(container.textContent).toContain('Utilities');
    expect(container.textContent).toContain('Staff');
    expect(container.textContent).toContain('Supplies');
    expect(container.textContent).toContain('Other');
  });

  it('bar fill elements have distinct colors (no two adjacent bars same background)', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    // Find all bar fill divs by their transform-origin style
    const bars = container.querySelectorAll('[style*="transform-origin: left center"]');
    expect(bars.length).toBe(5);

    const colors = Array.from(bars).map(b => (b as HTMLElement).style.background);
    // All 5 colors should be distinct
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(5);
  });

  it('renders dollar amounts for each category', () => {
    const { container } = render(<ExpenseBreakdownChart data={mockData} />);
    expect(container.textContent).toContain('$1,200');
    expect(container.textContent).toContain('$850');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/ExpenseBreakdownChart.test.tsx
```

Expected: FAIL on `uniqueColors.size` (all bars same color → size = 1, not 5). Also FAIL on `transform-origin` selector since `transition: width` is still in use.

- [ ] **Step 3: Update `ExpenseBreakdownChart.tsx`**

```tsx
import React, { useEffect, useState } from 'react';
import { ExpenseCategory } from './dashboardData';

const EXPENSE_COLORS = [
  'var(--color-accent-positive)',      // Shadowed Agave green
  'oklch(0.65 0.07 52)',               // Warm ochre — Sunset Ochre family
  'oklch(0.55 0.04 195)',              // Muted teal — Banderas Bay
  'oklch(0.72 0.04 28)',               // Sand/tan — Bone family
  'var(--color-ink-secondary)',        // Neutral muted
];

interface ExpenseBreakdownChartProps {
  data: ExpenseCategory[];
}

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const [animatedScales, setAnimatedScales] = useState<number[]>(data.map(() => 0));
  const maxAmount = Math.max(...data.map(d => d.amount));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScales(data.map(d => d.amount / maxAmount));
    }, 200);
    return () => clearTimeout(timer);
  }, [data, maxAmount]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.20em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
              {item.label}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 400, letterSpacing: '0.10em', color: 'var(--color-ink-muted)', margin: 0 }}>
              ${item.amount.toLocaleString()}
            </p>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--color-border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                background: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
                borderRadius: '2px',
                transform: `scaleX(${animatedScales[i]})`,
                transformOrigin: 'left center',
                transition: 'transform 0.6s var(--ease-out-expo)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
rtk vitest run tests/components/Dashboard/ExpenseBreakdownChart.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/Dashboard/ExpenseBreakdownChart.tsx tests/components/Dashboard/ExpenseBreakdownChart.test.tsx
rtk git commit -m "fix: assign distinct categorical colors to ExpenseBreakdownChart bars"
```

---

## Task 6: Consolidate Performance tab into Financials — 3-tab nav

**Files:**
- Modify: `src/components/Dashboard/DashboardDomainNav.tsx` — remove `performance` domain, uniform icon/label sizes
- Modify: `src/components/Dashboard/DashboardView.tsx` — remove `performance` case from `renderDomain`
- Modify: `src/components/Dashboard/DashboardFinancials.tsx` — add OccupancyHeatmap section at bottom
- Delete usage of: `src/components/Dashboard/DashboardPerformance.tsx` (keep file, remove import/usage)

The Performance tab contained: `RevenueTrajectoryChart` (already in Financials) + `OccupancyHeatmap` (unique). Merge only `OccupancyHeatmap`. Remove the duplicate `RevenueTrajectoryChart`. Fix the `marginTop: 'auto'` positioning issue on the trajectory chart while here — remove it from the trajectory section; put `marginTop: 'auto'` on the nav link instead so content flows naturally.

- [ ] **Step 1: Write the failing test**

```tsx
// Append to tests/components/Dashboard/DashboardView.test.tsx:

it('renders only 3 domain tabs (Today, Financials, Tasks)', () => {
  const { container } = render(
    <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
  );
  act(() => { vi.advanceTimersByTime(400); });
  // Desktop nav buttons with aria-pressed
  const navButtons = container.querySelectorAll('button[aria-pressed]');
  // 3 desktop + 3 mobile = 6 buttons total for 3 domains
  expect(navButtons.length).toBe(6);
});

it('does not render a Performance tab', () => {
  const { container } = render(
    <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
  );
  act(() => { vi.advanceTimersByTime(400); });
  expect(container.textContent).not.toContain('Performance');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/DashboardView.test.tsx
```

Expected: FAIL — 8 nav buttons found (4 domains × 2 navs), and "Performance" text present.

- [ ] **Step 3: Update `DashboardDomainNav.tsx`**

Remove `performance` from `Domain` type and `domains` array. Fix icon/label size inconsistency (remove `isFirst` special-casing — all icons `size={15}`, all labels `fontSize: '0.5rem'`).

```tsx
import React from 'react';
import { Sun, TrendingUp, ClipboardList } from 'lucide-react';

export type Domain = 'today' | 'financials' | 'tasks';

interface DashboardDomainNavProps {
  active: Domain;
  onChange: (domain: Domain) => void;
}

const domains: { id: Domain; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> }[] = [
  { id: 'today', label: 'Today', Icon: Sun },
  { id: 'financials', label: 'Financials', Icon: TrendingUp },
  { id: 'tasks', label: 'Tasks', Icon: ClipboardList },
];

export default function DashboardDomainNav({ active, onChange }: DashboardDomainNavProps) {
  return (
    <>
      {/* Desktop: vertical strip */}
      <nav
        className="hidden lg:flex flex-col items-center gap-1 py-10"
        style={{ width: '72px', borderRight: '1px solid var(--color-border-subtle)' }}
        aria-label="Dashboard sections"
      >
        {domains.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-pressed={isActive}
              aria-label={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '10px 8px',
                borderRadius: '8px',
                background: isActive ? 'var(--color-border-subtle)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '56px',
                transition: 'background 0.2s ease',
              }}
            >
              <Icon
                size={15}
                strokeWidth={isActive ? 2 : 1.5}
                style={{ color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)' }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Mobile/Tablet: horizontal segmented pill */}
      <nav
        className="flex lg:hidden"
        style={{ padding: '12px 20px 0' }}
        aria-label="Dashboard sections"
      >
        <div
          style={{
            display: 'inline-flex',
            gap: '2px',
            background: 'var(--color-border-subtle)',
            borderRadius: '999px',
            padding: '3px',
          }}
          role="group"
        >
          {domains.map(({ id, label }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-pressed={isActive}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.625rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                  background: isActive ? 'var(--color-canvas)' : 'transparent',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '5px 14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
```

- [ ] **Step 4: Update `DashboardView.tsx`**

Remove `DashboardPerformance` import and `performance` case from `renderDomain`. Update `Domain` state type (TypeScript will infer from the updated `DashboardDomainNav`).

Remove line 11: `import DashboardPerformance from './DashboardPerformance';`

Update `renderDomain` switch (remove the `performance` case):

```tsx
const renderDomain = () => {
  switch (activeDomain) {
    case 'today':
      return <DashboardToday data={data} propertyName={property.name} propertyLocation={property.location} onNavigate={onNavigate} onDomainChange={setActiveDomain} />;
    case 'financials':
      return <DashboardFinancials data={data} onNavigate={onNavigate} />;
    case 'tasks':
      return <DashboardOperations data={data} onNavigate={onNavigate} />;
  }
};
```

Update `DashboardToday` `onDomainChange` prop type — since `Domain` no longer includes `'performance'`, this is now correctly typed.

- [ ] **Step 5: Update `DashboardFinancials.tsx` — add OccupancyHeatmap section**

Add import at top:
```tsx
import OccupancyHeatmap from './OccupancyHeatmap';
```

Remove `marginTop: 'auto'` from the Revenue Trajectory section div (line 82). Add OccupancyHeatmap section and a divider after the trajectory chart, before the nav link. Move `marginTop: 'auto'` to the nav link button.

Replace lines 81–91 (Revenue Trajectory + nav link):

```tsx
{/* Revenue Trajectory */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <p style={{ ...labelStyle, fontSize: '0.625rem', letterSpacing: '0.32em' }}>REVENUE TRAJECTORY</p>
  <RevenueTrajectoryChart data={data.revenueHistory} labels={yoyLabels} />
</div>

{/* Divider */}
<div style={{ height: '1px', background: 'var(--color-border-subtle)' }} />

{/* Occupancy Heatmap */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <p style={{ ...labelStyle, fontSize: '0.625rem', letterSpacing: '0.32em' }}>30-DAY OCCUPANCY</p>
  <OccupancyHeatmap data={Array.from({ length: 30 }, (_, i) => {
    const base = data.occupancy;
    const variance = Math.sin(i * 0.3) * 15;
    return Math.max(0, Math.min(100, Math.round(base + variance)));
  })} />
</div>

{/* Nav link */}
<button
  className="dashboard-link"
  onClick={() => onNavigate('reporting', 'push')}
  style={{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 500,
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'var(--color-ink-secondary)', background: 'none', border: 'none',
    padding: 0, cursor: 'pointer', alignSelf: 'flex-start', marginTop: 'auto',
  }}
>
  VIEW FINANCIALS <ArrowRight size={11} strokeWidth={1.5} />
</button>
```

- [ ] **Step 6: Run full test suite**

```bash
rtk vitest run
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
rtk git add src/components/Dashboard/DashboardDomainNav.tsx src/components/Dashboard/DashboardView.tsx src/components/Dashboard/DashboardFinancials.tsx tests/components/Dashboard/DashboardView.test.tsx
rtk git commit -m "feat: consolidate Performance into Financials tab, reduce to 3-tab nav"
```

---

## Task 7: Fix layout property transitions — compositor-safe

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx:64` (budget bar)
- Modify: `src/components/Dashboard/PropertyTitleCard.tsx:46` (accent line — remove vestigial width transition)
- Modify: `src/styles/property-selector.css:260` (scroll progress bar)

`ExpenseBreakdownChart` was already fixed in Task 5. `DashboardFinancials` budget bar and `PropertyTitleCard` accent line still use `transition: width`. The `property-selector.css` progress bar uses `transition: width 100ms linear`.

- [ ] **Step 1: Fix budget bar in `DashboardFinancials.tsx` (line 63-65)**

Change the fill div inside the budget progress bar from `width` animation to `transform: scaleX()`:

```tsx
{/* Budget bar */}
<div style={{ width: '100%', height: '2px', background: 'var(--color-border-subtle)', marginTop: '8px', borderRadius: '1px', overflow: 'hidden' }}>
  <div style={{
    width: '100%',
    height: '100%',
    background: 'var(--color-accent-positive)',
    borderRadius: '1px',
    transform: `scaleX(${budgetProgress})`,
    transformOrigin: 'left center',
    transition: 'transform 0.6s var(--ease-out-expo)',
  }} />
</div>
```

- [ ] **Step 2: Fix accent line in `PropertyTitleCard.tsx` (line 40-48)**

The accent line width is a static `'40px'` — it never changes value, so the `transition: width` is vestigial and triggers unnecessary style recalculation. Remove the transition entirely:

```tsx
<div
  style={{
    width: '40px',
    height: '2px',
    background: ambient.accent,
    borderRadius: '2px',
    transition: 'background-color 0.4s ease',
  }}
/>
```

- [ ] **Step 3: Fix scroll progress bar in `property-selector.css` (line 258-261)**

The `.ps-progress` element must also have the JS that drives it updated. First check how width is set — search for `ps-progress` across all src files:

```bash
rtk grep "ps-progress" src/
```

If the JS sets `element.style.width`, update it to set `element.style.transform = 'scaleX(' + progress + ')'` instead.

Update `property-selector.css` lines 258–261:

```css
.ps-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--ps-status-available);
  z-index: 100;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 100ms linear;
}
```

Then update the corresponding JS that sets `.style.width` to use `.style.transform = 'scaleX(' + value + ')'`.

- [ ] **Step 4: Run full test suite**

```bash
rtk vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/Dashboard/DashboardFinancials.tsx src/components/Dashboard/PropertyTitleCard.tsx src/styles/property-selector.css
rtk git commit -m "perf: replace transition:width with transform:scaleX for compositor-safe bar animations"
```

---

## Task 8: Minor consistency fixes — dark mode icon, SVG font, design tokens

**Files:**
- Modify: `src/components/Dashboard/DarkModeToggle.tsx`
- Modify: `src/components/Dashboard/RevenueTrajectoryChart.tsx:44-45`

### 8a — DarkModeToggle: show action target, not current state

Convention: Moon icon in light mode ("click to go dark"), Sun icon in dark mode ("click to go light"). Current code shows Sun in light mode (current state), which is the reverse.

- [ ] **Step 1: Write failing test**

Append to `tests/components/Dashboard/DashboardView.test.tsx`:

```tsx
it('DarkModeToggle shows Moon icon in light mode (action target convention)', () => {
  // Ensure light mode
  localStorage.setItem('theme', 'light');
  const { container } = render(
    <DashboardView propertyId="casa-del-sol" onNavigate={mockNavigate} onNotify={mockNotify} />
  );
  act(() => { vi.advanceTimersByTime(400); });
  // lucide-react Moon icon renders a <path> with specific d attribute
  // We test that the toggle button does not contain a Sun SVG path
  // lucide Sun has 8 lines radiating — check for aria-label only since SVG internals vary
  const toggle = container.querySelector('[aria-label="Toggle dark mode"]');
  expect(toggle).toBeInTheDocument();
  // The toggle in light mode should NOT show the Sun (current state)
  // It should show Moon (switch target). Lucide Moon path contains specific shape.
  // We verify by checking the SVG child count: Sun has 9 elements, Moon has 1 path.
  const svgChildren = toggle?.querySelectorAll('svg > *');
  // Moon = 1 path element. Sun = circle + 8 lines = 9 elements.
  expect(svgChildren?.length).toBe(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
rtk vitest run tests/components/Dashboard/DashboardView.test.tsx
```

Expected: FAIL — Sun has 9 SVG children (circle + 8 line elements); test expects 1.

- [ ] **Step 3: Fix `DarkModeToggle.tsx`**

Swap the icon conditional — show what you'll switch TO, not current state:

```tsx
{isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
```

Full updated file:

```tsx
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-ink-secondary)',
        padding: '4px',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      aria-label="Toggle dark mode"
      className="dashboard-focus"
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
    </button>
  );
}
```

### 8b — RevenueTrajectoryChart: fix SVG axis labels font

SVG `<text>` nodes with `fontFamily: 'var(--font-display)'` fall back to system serif in most browsers. Axis labels are UI chrome, not display typography. Fix to `var(--font-ui)`.

- [ ] **Step 4: Fix `RevenueTrajectoryChart.tsx` lines 44-45**

```tsx
{labels && (
  <>
    <text x={padding} y={height - 4} style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.08em', fill: 'var(--color-ink-secondary)' }}>{labels[0]}</text>
    <text x={width - padding - 30} y={height - 4} style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.08em', fill: 'var(--color-ink-secondary)' }}>{labels[labels.length - 1]}</text>
  </>
)}
```

- [ ] **Step 5: Run full test suite**

```bash
rtk vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
rtk git add src/components/Dashboard/DarkModeToggle.tsx src/components/Dashboard/RevenueTrajectoryChart.tsx tests/components/Dashboard/DashboardView.test.tsx
rtk git commit -m "fix: dark mode toggle shows action target icon; SVG chart labels use UI font"
```

---

## Self-Review

**Spec coverage check:**

| Issue | Task | Covered |
|---|---|---|
| P0: Period nav arrows inverted | Task 1 | ✓ |
| P1: PropertyHealthScore gauge | Task 2 | ✓ |
| P2: StatusCards 4-card in 3-col | Task 3 | ✓ |
| P2: Gallery undiscoverable | Task 4 | ✓ |
| P2: ExpenseBreakdownChart single color | Task 5 | ✓ |
| Consolidate Financials + Performance | Task 6 | ✓ |
| transition:width layout thrash (4 instances) | Task 7 | ✓ (ExpenseBreakdownChart fixed in Task 5) |
| DarkModeToggle icon convention | Task 8a | ✓ |
| SVG chart font mismatch | Task 8b | ✓ |
| DomainNav icon/label size inconsistency | Task 6 Step 3 | ✓ |

**Placeholder scan:** No TBD, TODO, or vague instructions found.

**Type consistency:** `Domain` type updated in Task 6 (`DashboardDomainNav.tsx`) removes `'performance'`. `DashboardView.tsx` `activeDomain` state will correctly infer the new type. `DashboardToday.tsx` `onDomainChange` prop typed as `(domain: Domain) => void` — consistent since it only calls `onDomainChange('financials')` which remains valid.
