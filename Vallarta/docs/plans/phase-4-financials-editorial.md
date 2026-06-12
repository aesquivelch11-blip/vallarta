# Phase 4: DashboardFinancials — Editorial Rewrite

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execute phases in order.

**Goal:** Make NET the dominant typographic element of the Financials view — shown first, at large scale — with Revenue and Expenses in a two-column grid below, and staggered motion entrance matching the Today pattern.

**Architecture:** DashboardFinancials.tsx is completely rewritten. The current layout buries NET at the bottom after Revenue and Expenses. New layout: Period selector (index 0) → NET dominant `clamp(3.5rem, 7vw, 5rem)` (index 1) → Revenue + Expenses two-column grid (index 2) → Nav link (index 3). All horizontal dividers removed. Period selector becomes text-only with icon chevrons (no border/background). Same `sectionVariants` stagger pattern as Phase 3.

**Tech Stack:** Vite + React 18 + TypeScript, motion/react v12, lucide-react

**Prerequisites:** Phase 1 + Phase 2 + Phase 3 complete and committed.

---

## Project Context

### File to rewrite
`src/components/Dashboard/DashboardFinancials.tsx`

### What currently exists that changes

| Element | Before | After |
|---------|--------|-------|
| Section order | Period → Revenue → Expenses → NET | Period → NET → Revenue/Expenses grid |
| NET font size | `clamp(2rem, 4vw, 3rem)` at bottom | `clamp(3.5rem, 7vw, 5rem)` first and dominant |
| Revenue font size | `clamp(1.25rem, 2.5vw, 1.75rem)` | `clamp(1.25rem, 2vw, 1.5rem)` (grid left col) |
| Expenses font size | `clamp(1rem, 2vw, 1.375rem)` | `clamp(1rem, 1.75vw, 1.25rem)` (grid right col) |
| Revenue/Expenses layout | Stacked vertically | Two-column CSS grid |
| Dividers | Two horizontal 1px lines | Zero — grid `borderTop` only |
| Motion | None | Stagger same as Phase 3 |
| `height: '100%'` overflow | Yes | Removed — natural scroll |

### Stagger animation pattern (same as Phase 3)

```typescript
const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};
```

Section stagger: Period selector = 0, NET = 1, Revenue/Expenses grid = 2, Nav = 3

### Revenue/Expenses two-column grid

```tsx
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 'clamp(1rem, 2vw, 1.5rem)',
  paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
  borderTop: '1px solid var(--color-border-subtle)',
}}>
  <div>
    {/* Revenue — full opacity, left col */}
  </div>
  <div style={{ opacity: 0.65 }}>
    {/* Expenses — recessive, right col */}
  </div>
</div>
```

### Period selector design

Current: chevron icons + period label. Keep chevron icons from lucide-react — they're informative UI. Change: remove any background/fill, make it text-only inline. When at first/last period, chevron opacity drops to `0.3`.

```tsx
<div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
  <button
    onClick={goPrevPeriod}
    disabled={selectedPeriodIndex >= periods.length - 1}
    style={{
      background: 'none', border: 'none', padding: '2px', cursor: ...,
      color: ...,  // 'var(--color-ink-secondary)' or opacity 0.3 when disabled
      display: 'flex', alignItems: 'center',
      opacity: selectedPeriodIndex >= periods.length - 1 ? 0.3 : 1,
    }}
  >
    <ChevronLeft size={12} strokeWidth={1.5} />
  </button>
  <span style={{
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'var(--color-ink)',
    userSelect: 'none',
  }}>
    {period.label}
  </span>
  <button
    onClick={goNextPeriod}
    disabled={selectedPeriodIndex <= 0}
    style={{
      opacity: selectedPeriodIndex <= 0 ? 0.3 : 1,
      ...
    }}
  >
    <ChevronRight size={12} strokeWidth={1.5} />
  </button>
</div>
```

### Shared style helpers

```typescript
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
```

---

## Task 1: Rewrite DashboardFinancials.tsx

- [ ] **Step 1: Replace the entire file content**

Write `src/components/Dashboard/DashboardFinancials.tsx` with exactly this content:

```typescript
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency, formatTrendPercent } from './dashboardData';

interface DashboardFinancialsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

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

export default function DashboardFinancials({ data, onNavigate }: DashboardFinancialsProps) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const { periods } = data;
  const period = periods[selectedPeriodIndex];
  const net = period.revenue - period.expenses;
  const isNegative = net < 0;

  const goPrevPeriod = () =>
    setSelectedPeriodIndex((prev) => Math.min(prev + 1, periods.length - 1));
  const goNextPeriod = () =>
    setSelectedPeriodIndex((prev) => Math.max(prev - 1, 0));

  const atFirst = selectedPeriodIndex <= 0;
  const atLast = selectedPeriodIndex >= periods.length - 1;

  const chevronBtnStyle = (disabled: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    padding: '2px',
    cursor: disabled ? 'default' : 'pointer',
    color: 'var(--color-ink-secondary)',
    display: 'flex',
    alignItems: 'center',
    opacity: disabled ? 0.3 : 1,
    transition: 'opacity 0.15s ease',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding:
          'clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
        gap: 'clamp(2rem, 4vw, 3rem)',
      }}
    >
      {/* Period selector */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="dashboard-focus"
            onClick={goPrevPeriod}
            disabled={atLast}
            aria-label="Previous period"
            style={chevronBtnStyle(atLast)}
          >
            <ChevronLeft size={12} strokeWidth={1.5} />
          </button>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.5625rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              userSelect: 'none',
            }}
          >
            {period.label}
          </span>
          <button
            className="dashboard-focus"
            onClick={goNextPeriod}
            disabled={atFirst}
            aria-label="Next period"
            style={chevronBtnStyle(atFirst)}
          >
            <ChevronRight size={12} strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>

      {/* NET — dominant, shown first */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={1}>
        <p style={labelStyle}>NET</p>
        <p
          style={{
            ...figureStyle,
            fontSize: 'clamp(3.5rem, 7vw, 5rem)',
            marginTop: '8px',
            color: isNegative ? 'var(--color-accent-negative)' : 'var(--color-ink)',
          }}
        >
          {formatCurrency(net)}
        </p>
      </motion.div>

      {/* Revenue + Expenses — two-column grid, subordinate to NET */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={2}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(1rem, 2vw, 1.5rem)',
            paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          {/* Revenue — left column */}
          <div>
            <p style={labelStyle}>REVENUE</p>
            <p
              style={{
                ...figureStyle,
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                marginTop: '6px',
              }}
            >
              {formatCurrency(period.revenue)}
            </p>
            {data.revenueHistory[selectedPeriodIndex] !== undefined && (
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
                {formatTrendPercent(
                  period.revenue,
                  data.revenueHistory[selectedPeriodIndex] || period.revenue
                )}{' '}
                vs prior
              </p>
            )}
          </div>

          {/* Expenses — right column, recessive */}
          <div style={{ opacity: 0.65 }}>
            <p style={labelStyle}>EXPENSES</p>
            <p
              style={{
                ...figureStyle,
                fontSize: 'clamp(1rem, 1.75vw, 1.25rem)',
                marginTop: '6px',
                color: 'var(--color-ink-secondary)',
              }}
            >
              {formatCurrency(period.expenses)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Nav link */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={3}>
        <button
          className="dashboard-link"
          onClick={() => onNavigate('reporting', 'push')}
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
          VIEW FINANCIALS <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output.

- [ ] **Step 3: Visually verify in dev server**

Navigate to Dashboard → Financials tab.

- [ ] Period selector: small uppercase label with chevrons that fade to 0.3 opacity at extremes
- [ ] NET appears first, font size `clamp(3.5rem, 7vw, 5rem)` — clearly dominant
- [ ] Revenue and Expenses in two-column grid below NET, separated by a subtle top border
- [ ] Expenses column is visibly more recessive (opacity 0.65)
- [ ] No horizontal divider lines between Period/NET sections — pure gap separation
- [ ] All sections animate in with stagger (Period → NET → Grid → Nav)
- [ ] Switching periods: number updates, no animation jank
- [ ] Negative NET: shows in `var(--color-accent-negative)` color
- [ ] Scrollable if content exceeds height

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardFinancials.tsx
git commit -m "feat(financials): editorial rewrite — NET dominant, two-column grid, stagger motion"
```

---

## Expected Visual Outcome

| Before | After |
|--------|-------|
| Revenue first, NET last at bottom | NET first and largest, commands the view |
| NET: `clamp(2rem, 4vw, 3rem)` | NET: `clamp(3.5rem, 7vw, 5rem)` |
| Revenue + Expenses stacked vertically | Two-column CSS grid — equal visual units |
| Two horizontal dividers | Zero dividers — one `borderTop` on the grid |
| Period selector with border/fill | Text-only inline with fading chevrons |
| No motion | Staggered entrance matching Today pattern |

---

**Proceed to Phase 5** (`phase-5-operations-polish.md`) once this commit is verified.
