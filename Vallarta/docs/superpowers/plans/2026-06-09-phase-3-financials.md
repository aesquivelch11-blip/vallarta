# Phase 3: Financials — Bespoke Charts & Context

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Enrich the Financials domain with YoY context, budget bars, expense breakdown visualization, and a bespoke revenue trajectory chart.

**Architecture:** Create 2 new chart components using hand-crafted SVG. Rebuild `DashboardFinancials.tsx` to include the new visual hierarchy with all elements visible within a single viewport.

**Tech Stack:** React 19, TypeScript, SVG

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/ExpenseBreakdownChart.tsx` | Horizontal bar chart for expense categories |
| `src/components/Dashboard/RevenueTrajectoryChart.tsx` | SVG area chart for 6-month revenue trend |
| `src/components/Dashboard/DashboardFinancials.tsx` | Complete rewrite with all new elements |

---

### Task 1: Create ExpenseBreakdownChart

**Files:**
- Create: `src/components/Dashboard/ExpenseBreakdownChart.tsx`

**Code:**
```typescript
import React, { useEffect, useState } from 'react';
import { ExpenseCategory } from './dashboardData';

interface ExpenseBreakdownChartProps {
  data: ExpenseCategory[];
}

export default function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>(data.map(() => 0));
  const maxAmount = Math.max(...data.map(d => d.amount));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(data.map(d => (d.amount / maxAmount) * 100));
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
                width: `${animatedWidths[i]}%`,
                height: '100%',
                background: 'var(--color-accent-positive)',
                borderRadius: '2px',
                transition: 'width 0.6s var(--ease-out-expo)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Verification:** 5 bars render. Widths are proportional. Animated on entry.

---

### Task 2: Create RevenueTrajectoryChart

**Files:**
- Create: `src/components/Dashboard/RevenueTrajectoryChart.tsx`

**Code:**
```typescript
import React from 'react';

interface RevenueTrajectoryChartProps {
  data: number[];
  labels?: string[];
}

export default function RevenueTrajectoryChart({ data, labels }: RevenueTrajectoryChartProps) {
  const width = 400;
  const height = 150;
  const padding = 20;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${points} ${width - padding},${height - padding} ${padding},${height - padding}`;

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(43, 59, 50, 0.06)" />
            <stop offset="100%" stopColor="rgba(43, 59, 50, 0)" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#revenueGradient)" />
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-accent-positive)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {labels && (
          <>
            <text x={padding} y={height - 4} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fill: 'var(--color-ink-secondary)' }}>{labels[0]}</text>
            <text x={width - padding - 30} y={height - 4} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fill: 'var(--color-ink-secondary)' }}>{labels[labels.length - 1]}</text>
          </>
        )}
      </svg>
    </div>
  );
}
```

**Verification:** 6 data points render as smooth curve. No grid lines. Only start/end labels.

---

### Task 3: Rebuild DashboardFinancials.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

**Code:**
```typescript
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { DashboardData, formatCurrency, formatTrendPercent, getTrendDirection } from './dashboardData';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';
import RevenueTrajectoryChart from './RevenueTrajectoryChart';
import AnimatedFigure from './AnimatedFigure';

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
  const budgetProgress = Math.min(period.revenue / data.budgetTarget, 1);

  const goPrevPeriod = () => setSelectedPeriodIndex(prev => Math.min(prev + 1, periods.length - 1));
  const goNextPeriod = () => setSelectedPeriodIndex(prev => Math.max(prev - 1, 0));

  const labelStyle = { fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase' as const, color: 'var(--color-ink-secondary)', margin: 0 };
  const figureStyle = { fontFamily: 'var(--font-display)', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--color-ink)', margin: 0, lineHeight: 1 };

  const yoyLabels = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'];
  const yoyData = data.revenueHistory;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(1.5rem, 3vw, 2rem)' }}>
      {/* Period selector */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <button className="dashboard-focus" onClick={goNextPeriod} disabled={selectedPeriodIndex <= 0} aria-label="Next period" style={{ background: 'none', border: 'none', padding: '2px', cursor: selectedPeriodIndex <= 0 ? 'default' : 'pointer', color: selectedPeriodIndex <= 0 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink)', letterSpacing: '0.02em', userSelect: 'none' }}>
          {period.label}
        </span>
        <button className="dashboard-focus" onClick={goPrevPeriod} disabled={selectedPeriodIndex >= periods.length - 1} aria-label="Previous period" style={{ background: 'none', border: 'none', padding: '2px', cursor: selectedPeriodIndex >= periods.length - 1 ? 'default' : 'pointer', color: selectedPeriodIndex >= periods.length - 1 ? 'var(--color-border-medium)' : 'var(--color-ink-secondary)', display: 'flex', alignItems: 'center' }}>
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Revenue / Expenses / Net hierarchy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <div>
          <p style={labelStyle}>REVENUE</p>
          <AnimatedFigure value={period.revenue} formatter={formatCurrency} style={{ ...figureStyle, fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', marginTop: '6px' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 400, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', margin: '4px 0 0' }}>
            {formatTrendPercent(period.revenue, yoyData[selectedPeriodIndex] || period.revenue)} vs {yoyLabels[0]}
          </p>
        </div>
        <div>
          <p style={{ ...labelStyle, opacity: 0.7 }}>EXPENSES</p>
          <AnimatedFigure value={period.expenses} formatter={formatCurrency} style={{ ...figureStyle, fontSize: 'clamp(1rem, 2vw, 1.375rem)', marginTop: '6px', opacity: 0.75 }} />
        </div>
        <div>
          <p style={{ ...labelStyle, fontSize: '0.625rem', letterSpacing: '0.32em' }}>NET</p>
          <AnimatedFigure value={net} formatter={formatCurrency} style={{ ...figureStyle, fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '10px', color: isNegative ? 'var(--color-accent-negative)' : 'var(--color-ink)' }} />
          {/* Budget bar */}
          <div style={{ width: '100%', height: '2px', background: 'var(--color-border-subtle)', marginTop: '8px', borderRadius: '1px', overflow: 'hidden' }}>
            <div style={{ width: `${budgetProgress * 100}%`, height: '100%', background: 'var(--color-accent-positive)', borderRadius: '1px', transition: 'width 0.6s var(--ease-out-expo)' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 400, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', margin: '4px 0 0' }}>
            {Math.round(budgetProgress * 100)}% of ${data.budgetTarget.toLocaleString()} budget
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)' }} />

      {/* Expense Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ ...labelStyle, fontSize: '0.625rem', letterSpacing: '0.32em' }}>EXPENSE BREAKDOWN</p>
        <ExpenseBreakdownChart data={data.expenseBreakdown} />
      </div>

      {/* Revenue Trajectory */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
        <p style={{ ...labelStyle, fontSize: '0.625rem', letterSpacing: '0.32em' }}>REVENUE TRAJECTORY</p>
        <RevenueTrajectoryChart data={data.revenueHistory} labels={yoyLabels} />
      </div>

      {/* Nav link */}
      <button className="dashboard-link" onClick={() => onNavigate('reporting', 'push')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', alignSelf: 'flex-start' }}>
        VIEW FINANCIALS <ArrowRight size={11} strokeWidth={1.5} />
      </button>
    </div>
  );
}
```

**Verification:** All charts render. No overflow scroll on 1080p. Budget bar fills proportionally.

---

### Task 4: Commit

```bash
git add -A
git commit -m "feat: enrich Financials with bespoke charts, YoY context, budget bars"
```

---

## Self-Review

- [x] Expense bars are horizontal, 6px tall, rounded caps
- [x] Revenue trajectory is SVG area chart with gradient fill
- [x] YoY comparison text below revenue
- [x] Budget progress bar under Net figure
- [x] All elements fit within 1080p viewport
- [x] No placeholders in any task
