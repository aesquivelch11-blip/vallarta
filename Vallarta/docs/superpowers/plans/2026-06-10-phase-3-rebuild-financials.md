# Phase 3: Rebuild DashboardFinancials — P&L Sequence

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite DashboardFinancials as a clean P&L (Profit & Loss) sequence. Remove all charts (expense breakdown bars, revenue trajectory line, occupancy heatmap). The layout reads as accounting logic: Period Selector → Revenue (supporting scale) → Expenses (subordinate, reduced opacity) → Net (dominant, largest figure). No cards, no grids, no dataviz. This phase depends on Phase 1 (deletion of chart components).

**Architecture:** Complete rewrite of DashboardFinancials.tsx. All chart components are removed. The P&L sequence uses generous spacing to create visual hierarchy — Revenue and Expenses are peers with different scales, Net is separated by a divider and dominates. All data comes from the existing `DashboardData` interface and `dashboardData.ts` helpers.

**Tech Stack:** React 18, TypeScript, CSS custom properties, lucide-react

**Design Principles:**
- **$impeccable distill**: Remove charts, cards, decorations. Direct labeling for small datasets. Flatten structure.
- **$impeccable layout**: Tight grouping within figures (label + number + hint), generous separation between sections. Flexbox for 1D flow.
- **ui-ux-pro-max**: Direct labeling for small datasets. No charts for 5-6 items. Emphasize trends over decoration.
- **Hospitality reference sites**: Calm confidence. No alarming colors. Information arrives with quiet authority.

---

## File Map

| File | Responsibility | Action |
|---|---|---|
| `src/components/Dashboard/DashboardFinancials.tsx` | Financials domain — complete rewrite | **Rewrite** |
| `tests/components/Dashboard/DashboardFinancials.test.tsx` | Tests for Financials domain | **Create** |

---

## Task 1: Rewrite DashboardFinancials.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

**What to remove:**
- All chart imports (`ExpenseBreakdownChart`, `RevenueTrajectoryChart`, `OccupancyHeatmap`)
- All chart usage and related sections
- The `AnimatedFigure` component (not needed for this layout)
- The `budgetProgress` bar and related budget logic
- The `yoyLabels` and `yoyData` arrays (not needed without charts)

**What to build:**
- Period selector (inline text toggle with Chevron arrows)
- Revenue figure (supporting scale, ~1.75rem)
- Expenses figure (subordinate, reduced opacity, ~1.375rem)
- Net figure (dominant, ~3rem, warm red only if negative)
- Nav link (View Financials →)

- [ ] **Step 1: Replace the entire file**

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

- [ ] **Step 3: Write tests**

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

  it('renders correct Revenue figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('$12,400');
  });

  it('renders correct Expenses figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).toContain('$3,200');
  });

  it('renders correct Net figure', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    // 12400 - 3200 = 9200
    expect(container.textContent).toContain('$9,200');
  });

  it('does not render any charts or bars', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.querySelector('svg')).toBeNull();
    expect(container.querySelectorAll('[style*="border-radius: 8px"]').length).toBe(0);
  });

  it('does not render Expense Breakdown or Revenue Trajectory', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    expect(container.textContent).not.toContain('EXPENSE BREAKDOWN');
    expect(container.textContent).not.toContain('REVENUE TRAJECTORY');
    expect(container.textContent).not.toContain('30-DAY OCCUPANCY');
  });

  it('period navigation works — left arrow goes to older period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    fireEvent.click(leftBtn);
    expect(container.textContent).toContain('May 2026');
  });

  it('period navigation works — right arrow goes back to newer period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    fireEvent.click(leftBtn);
    expect(container.textContent).toContain('May 2026');

    const rightBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Next period'
    ) as HTMLButtonElement;
    fireEvent.click(rightBtn);
    expect(container.textContent).toContain('June 2026');
  });

  it('left arrow disables on oldest period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const leftBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Previous period'
    ) as HTMLButtonElement;
    // Click 5 times to reach January 2026
    for (let i = 0; i < 5; i++) {
      fireEvent.click(leftBtn);
    }
    expect(leftBtn).toBeDisabled();
  });

  it('right arrow disables on most recent period', () => {
    const { container } = render(<DashboardFinancials data={data} onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button[aria-label]');
    const rightBtn = Array.from(buttons).find(
      b => b.getAttribute('aria-label') === 'Next period'
    ) as HTMLButtonElement;
    expect(rightBtn).toBeDisabled();
  });
});
```

- [ ] **Step 4: Run tests**

Run: `rtk vitest run tests/components/Dashboard/DashboardFinancials.test.tsx`

Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Dashboard/DashboardFinancials.tsx tests/components/Dashboard/DashboardFinancials.test.tsx
git commit -m "feat: rebuild DashboardFinancials as P&L sequence, remove all charts"
```

---

## Self-Review

### Spec Coverage

| Requirement | Task | Covered |
|---|---|---|
| Remove ExpenseBreakdownChart | Task 1 | ✅ |
| Remove RevenueTrajectoryChart | Task 1 | ✅ |
| Remove OccupancyHeatmap | Task 1 | ✅ |
| Remove AnimatedFigure | Task 1 | ✅ |
| Remove budget progress bar | Task 1 | ✅ |
| Period selector with arrow navigation | Task 1 | ✅ |
| Revenue figure at supporting scale | Task 1 | ✅ |
| Expenses figure subordinate (reduced opacity) | Task 1 | ✅ |
| Net figure dominant (largest) | Task 1 | ✅ |
| Negative Net in muted warm red | Task 1 | ✅ |
| Nav link (View Financials) | Task 1 | ✅ |
| No cards, no grids, no charts | Task 1 | ✅ |

### Placeholder Scan

- No "TBD", "TODO", or placeholders.
- All steps contain actual commands and complete code.
- No references to undefined types or functions.

### Type Consistency

- `DashboardFinancialsProps` interface uses existing types: `DashboardData`, `ScreenType`.
- `formatCurrency` and `formatTrendPercent` are imported from `dashboardData.ts`.
- `onNavigate` prop matches the call site in `DashboardView.tsx`.
- Period navigation logic (`goPrevPeriod`, `goNextPeriod`) is consistent with the existing data model.

---

## Execution Handoff

**Plan complete.**

**Execution options:**

**1. Subagent-Driven** — Dispatch a subagent to execute this phase.

**2. Inline Execution** — Execute all tasks in this session.

**Which approach?**
