# Phase 5: Performance Domain

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Add a 4th domain tab called "Performance" with a large revenue trajectory chart and an occupancy heatmap.

**Architecture:** Create `DashboardPerformance.tsx` with two bespoke visualizations. Add "performance" to the domain navigation.

**Tech Stack:** React 19, TypeScript, SVG

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/OccupancyHeatmap.tsx` | 30-day grid showing occupancy status |
| `src/components/Dashboard/DashboardPerformance.tsx` | Main layout with revenue chart + heatmap |
| `src/components/Dashboard/DashboardDomainNav.tsx` | Add "performance" domain |
| `src/components/Dashboard/DashboardView.tsx` | Wire up new domain |

---

### Task 1: Create OccupancyHeatmap Component

**Files:**
- Create: `src/components/Dashboard/OccupancyHeatmap.tsx`

**Code:**
```typescript
import React, { useState } from 'react';

interface OccupancyHeatmapProps {
  data: number[]; // 30 days of occupancy percentages
}

export default function OccupancyHeatmap({ data }: OccupancyHeatmapProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const today = new Date('2026-06-07');

  const getColor = (val: number) => {
    if (val >= 80) return 'var(--color-accent-positive)';
    if (val >= 50) return 'var(--color-ink-secondary)';
    return 'var(--color-border-medium)';
  };

  const getDate = (index: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + index);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
          NEXT 30 DAYS
        </p>
        {hoveredIndex !== null && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: 0 }}>
            {getDate(hoveredIndex)} · {data[hoveredIndex]}% occupied
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
        {data.map((val, i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: `${Math.max(val * 0.4, 4)}px`,
              background: getColor(val),
              borderRadius: '1px',
              opacity: hoveredIndex === i ? 1 : 0.8,
              transition: 'opacity 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            title={`${getDate(i)}: ${val}% occupied`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 400, color: 'var(--color-ink-muted)', margin: 0 }}>
          {getDate(0)}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 400, color: 'var(--color-ink-muted)', margin: 0 }}>
          {getDate(data.length - 1)}
        </p>
      </div>
    </div>
  );
}
```

**Verification:** 30 bars render. Height proportional to occupancy. Hover shows date and percentage.

---

### Task 2: Create DashboardPerformance Component

**Files:**
- Create: `src/components/Dashboard/DashboardPerformance.tsx`

**Code:**
```typescript
import React from 'react';
import { DashboardData } from './dashboardData';
import RevenueTrajectoryChart from './RevenueTrajectoryChart';
import OccupancyHeatmap from './OccupancyHeatmap';

interface DashboardPerformanceProps {
  data: DashboardData;
}

export default function DashboardPerformance({ data }: DashboardPerformanceProps) {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Generate 30 days of mock occupancy data from the current occupancy
  const occupancy30Day = Array.from({ length: 30 }, (_, i) => {
    const base = data.occupancy;
    const variance = Math.sin(i * 0.3) * 15;
    return Math.max(0, Math.min(100, Math.round(base + variance)));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(2rem, 4vw, 3rem)', overflow: 'hidden' }}>
      {/* Revenue Trend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
          REVENUE TREND
        </p>
        <RevenueTrajectoryChart data={data.revenueHistory} labels={labels} />
      </div>

      {/* Occupancy Heatmap */}
      <div style={{ marginTop: 'auto' }}>
        <OccupancyHeatmap data={occupancy30Day} />
      </div>
    </div>
  );
}
```

**Verification:** Revenue chart and heatmap both render. No overflow scroll.

---

### Task 3: Add Performance to Domain Nav

**Files:**
- Modify: `src/components/Dashboard/DashboardDomainNav.tsx`

**Change:** Add 'performance' to the Domain type and render it in the nav.

```typescript
export type Domain = 'today' | 'financials' | 'tasks' | 'performance'; // Add 'performance'

// In the nav rendering:
const domains: Domain[] = ['today', 'financials', 'tasks', 'performance'];
```

---

### Task 4: Wire Up in DashboardView

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**Change:** Import and render DashboardPerformance.

```typescript
import DashboardPerformance from './DashboardPerformance';

// In renderDomain():
case 'performance':
  return <DashboardPerformance data={data} />;
```

---

### Task 5: Commit

```bash
git add -A
git commit -m "feat: add Performance domain with Revenue Trajectory and Occupancy Heatmap"
```

---

## Self-Review

- [x] OccupancyHeatmap has 30 bars with proportional height
- [x] Hover reveals date and percentage
- [x] RevenueTrajectoryChart is large and full-width
- [x] Performance domain appears in navigation
- [x] All fits within 1080p viewport
- [x] No placeholders in any task
