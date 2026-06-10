# Phase 2: "At a Glance" Hero Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Rebuild the "Today" domain into an editorial executive overview with Property Title Card, Health Score, 3-metric grid, Guest Flow strip, and urgent alert.

**Architecture:** Create 5 new focused components. Rebuild `DashboardToday.tsx` as a compositional layout using CSS Grid with strict viewport height zones.

**Tech Stack:** React 19, TypeScript, CSS Grid, SVG, `requestAnimationFrame`

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/PropertyTitleCard.tsx` | Floating editorial title card with ambient underline |
| `src/components/Dashboard/PropertyHealthScore.tsx` | Animated circular ring score |
| `src/components/Dashboard/AnimatedFigure.tsx` | Reusable count-up number animation |
| `src/components/Dashboard/MetricGrid.tsx` | 3-column editorial metric grid |
| `src/components/Dashboard/GuestFlowStrip.tsx` | Horizontal guest arrivals/departures strip |
| `src/components/Dashboard/UrgentAlert.tsx` | Thin persistent urgent task bar |
| `src/components/Dashboard/DashboardToday.tsx` | Complete rewrite of main layout |

---

### Task 1: Create PropertyTitleCard Component

**Files:**
- Create: `src/components/Dashboard/PropertyTitleCard.tsx`

**Code:**
```typescript
import React from 'react';
import { useAmbient } from './AmbientColorProvider';

interface PropertyTitleCardProps {
  name: string;
  location: string;
}

export default function PropertyTitleCard({ name, location }: PropertyTitleCardProps) {
  const ambient = useAmbient();

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: '4px',
        padding: 'clamp(0.75rem, 1.5vw, 1.25rem) clamp(1rem, 2vw, 1.5rem)',
        background: ambient.surface,
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '12px',
        transition: 'background-color 0.4s ease, border-color 0.4s ease',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: 'var(--color-ink)',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        {name}
      </p>
      <div
        style={{
          width: '40px',
          height: '2px',
          background: ambient.accent,
          borderRadius: '2px',
          transition: 'width 0.8s var(--ease-out-expo)',
        }}
      />
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5625rem',
          fontWeight: 500,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-secondary)',
          margin: 0,
        }}
      >
        {location}
      </p>
    </div>
  );
}
```

**Verification:** Render in isolation. Verify italic EB Garamond, underline color matches ambient.

---

### Task 2: Create PropertyHealthScore Component

**Files:**
- Create: `src/components/Dashboard/PropertyHealthScore.tsx`

**Code:**
```typescript
import React, { useEffect, useState } from 'react';

interface PropertyHealthScoreProps {
  score: number;
}

export default function PropertyHealthScore({ score }: PropertyHealthScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(283);

  const circumference = 2 * Math.PI * 45;
  const targetOffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
      setStrokeOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, targetOffset]);

  const getColor = (s: number) => {
    if (s >= 80) return 'var(--color-accent-positive)';
    if (s >= 60) return 'var(--color-accent-warning)';
    return 'var(--color-accent-negative)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" fill="none" stroke="var(--color-border-subtle)" strokeWidth="4" />
          <circle
            cx="60" cy="60" r="45" fill="none" stroke={getColor(score)}
            strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={strokeOffset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.8s var(--ease-out-expo)' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>
            {animatedScore}
          </p>
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
        Property Health
      </p>
    </div>
  );
}
```

**Verification:** Ring draws from 0 to target. Score counts up. Color changes with score.

---

### Task 3: Create AnimatedFigure Component

**Files:**
- Create: `src/components/Dashboard/AnimatedFigure.tsx`

**Code:**
```typescript
import React, { useEffect, useState } from 'react';

interface AnimatedFigureProps {
  value: number;
  formatter: (n: number) => string;
  duration?: number;
  style?: React.CSSProperties;
}

export default function AnimatedFigure({ value, formatter, duration = 800, style }: AnimatedFigureProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const startVal = 0;
    const endVal = value;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span style={style}>
      {formatter(display)}
    </span>
  );
}
```

---

### Task 4: Create MetricGrid Component

**Files:**
- Create: `src/components/Dashboard/MetricGrid.tsx`

**Code:**
```typescript
import React from 'react';
import AnimatedFigure from './AnimatedFigure';
import TrendBadge from './TrendBadge';
import Sparkline from './Sparkline';

interface Metric {
  label: string;
  value: number;
  formatter: (n: number) => string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'stable';
  sparklineData?: number[];
}

interface MetricGridProps {
  metrics: Metric[];
}

export default function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
      {metrics.map((metric, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: 'clamp(0.5rem, 1vw, 1rem)', borderLeft: i > 0 ? '1px solid var(--color-border-subtle)' : 'none' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1 }}>
            {metric.label}
          </p>
          <AnimatedFigure
            value={metric.value}
            formatter={metric.formatter}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--color-ink)', lineHeight: 1, margin: '4px 0 0' }}
          />
          {metric.trend && metric.trendDirection && (
            <TrendBadge value={metric.trend} direction={metric.trendDirection} />
          )}
          {metric.sparklineData && (
            <Sparkline data={metric.sparklineData} width={140} height={48} color="var(--color-ink-secondary)" strokeWidth={1.25} />
          )}
        </div>
      ))}
    </div>
  );
}
```

---

### Task 5: Create GuestFlowStrip Component

**Files:**
- Create: `src/components/Dashboard/GuestFlowStrip.tsx`

**Code:**
```typescript
import React from 'react';
import { GuestEvent } from './dashboardData';

interface GuestFlowStripProps {
  arrivals: GuestEvent[];
  departures: GuestEvent[];
  arrivalsTomorrow: GuestEvent[];
  departuresTomorrow: GuestEvent[];
}

export default function GuestFlowStrip({ arrivals, departures, arrivalsTomorrow, departuresTomorrow }: GuestFlowStripProps) {
  const labelStyle = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-ink-secondary)',
    margin: 0,
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'clamp(1rem, 2vw, 1.5rem)', alignItems: 'start' }}>
      {/* Arrivals */}
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)', fontWeight: 400, color: 'var(--color-ink)', margin: 0, lineHeight: 1 }}>
            {arrivals.length}
          </p>
          <p style={labelStyle}>Arriving</p>
        </div>
        {arrivals.length > 0 && (
          <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {arrivals.slice(0, 3).map(g => (
              <li key={g.id} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.3 }}>
                {g.name}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontStyle: 'normal', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', marginLeft: '8px' }}>
                  {g.nights}n
                </span>
              </li>
            ))}
          </ul>
        )}
        {arrivals.length === 0 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: '6px 0 0' }}>No arrivals</p>
        )}
      </div>

      {/* Departures */}
      <div style={{ opacity: 0.75 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1 }}>
            {departures.length}
          </p>
          <p style={{ ...labelStyle, fontSize: '0.5rem', opacity: 0.75 }}>Departing</p>
        </div>
        {departures.length > 0 && (
          <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {departures.slice(0, 3).map(g => (
              <li key={g.id} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)', fontStyle: 'normal', fontWeight: 400, color: 'var(--color-ink-secondary)', lineHeight: 1.3 }}>
                {g.name}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.625rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', marginLeft: '8px' }}>
                  {g.nights}n
                </span>
              </li>
            ))}
          </ul>
        )}
        {departures.length === 0 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-secondary)', margin: '6px 0 0' }}>No departures</p>
        )}
      </div>

      {/* Tomorrow */}
      <div>
        <p style={{ ...labelStyle, opacity: 0.6 }}>Tomorrow</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-ink-muted)', margin: '6px 0 0', lineHeight: 1.4 }}>
          {arrivalsTomorrow.length > 0 && `${arrivalsTomorrow.length} arriving`}
          {arrivalsTomorrow.length > 0 && departuresTomorrow.length > 0 && ' · '}
          {departuresTomorrow.length > 0 && `${departuresTomorrow.length} departing`}
          {arrivalsTomorrow.length === 0 && departuresTomorrow.length === 0 && 'Quiet day'}
        </p>
      </div>
    </div>
  );
}
```

---

### Task 6: Create UrgentAlert Component

**Files:**
- Create: `src/components/Dashboard/UrgentAlert.tsx`

**Code:**
```typescript
import React from 'react';
import { DashboardTask, formatDueDate } from './dashboardData';

interface UrgentAlertProps {
  task: DashboardTask | null;
}

export default function UrgentAlert({ task }: UrgentAlertProps) {
  if (!task) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        borderLeft: '2px solid var(--color-accent-warning)',
        background: 'var(--color-accent-warning-bg)',
        borderRadius: '0 4px 4px 0',
      }}
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--color-task-urgent)', flexShrink: 0 }} aria-hidden="true" />
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.6875rem',
          fontWeight: 400,
          color: 'var(--color-ink-secondary)',
          margin: 0,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {task.description}
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-ink-muted)', marginLeft: '8px' }}>
          {task.assignee} · {formatDueDate(task.dueDate)}
        </span>
      </p>
    </div>
  );
}
```

---

### Task 7: Rebuild DashboardToday.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

**Code:**
```typescript
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { Domain } from './DashboardDomainNav';
import { DashboardData, formatCurrency, formatTrendPercent, getTrendDirection } from './dashboardData';
import PropertyTitleCard from './PropertyTitleCard';
import PropertyHealthScore from './PropertyHealthScore';
import MetricGrid from './MetricGrid';
import GuestFlowStrip from './GuestFlowStrip';
import UrgentAlert from './UrgentAlert';

interface DashboardTodayProps {
  data: DashboardData;
  propertyName: string;
  propertyLocation: string;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onDomainChange?: (domain: Domain) => void;
}

export default function DashboardToday({ data, propertyName, propertyLocation, onNavigate, onDomainChange }: DashboardTodayProps) {
  const currentPeriod = data.periods[0];
  const prevPeriod = data.periods[1];
  const netIncome = currentPeriod.revenue - currentPeriod.expenses;
  const revTrend = formatTrendPercent(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const revDirection = getTrendDirection(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const occTrend = formatTrendPercent(data.occupancy, data.occupancyPrev);
  const occDirection = getTrendDirection(data.occupancy, data.occupancyPrev);
  const urgentTask = data.tasks.find(t => t.status === 'urgent') ?? null;

  const healthScore = Math.round(
    (data.occupancy * 0.4) + (data.guestSatisfaction.score * 10 * 0.3) + (Math.min(currentPeriod.revenue / data.budgetTarget, 1) * 100 * 0.3)
  );

  const metrics = [
    {
      label: 'Revenue MTD',
      value: currentPeriod.revenue,
      formatter: formatCurrency,
      trend: revTrend,
      trendDirection: revDirection,
      sparklineData: data.revenueHistory,
    },
    {
      label: 'Occupancy',
      value: data.occupancy,
      formatter: (n: number) => `${Math.round(n)}%`,
      trend: occTrend,
      trendDirection: occDirection,
      sparklineData: data.occupancyHistory,
    },
    {
      label: 'Satisfaction',
      value: data.guestSatisfaction.score,
      formatter: (n: number) => n.toFixed(1),
      sparklineData: [4.2, 4.4, 4.5, 4.6, 4.7, data.guestSatisfaction.score],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(1rem, 2vw, 1.5rem)', overflow: 'hidden' }}>
      {/* Zone A: Hero Snapshot - 40% */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <PropertyTitleCard name={propertyName} location={propertyLocation} />
          <PropertyHealthScore score={healthScore} />
        </div>
        <MetricGrid metrics={metrics} />
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Zone B: Guest Flow - 25% */}
      <GuestFlowStrip
        arrivals={data.arrivalsToday}
        departures={data.departuresToday}
        arrivalsTomorrow={data.arrivalsTomorrow}
        departuresTomorrow={data.departuresTomorrow}
      />

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />

      {/* Zone C: Urgent + Nav - 20% */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
        <UrgentAlert task={urgentTask} />
        <div style={{ display: 'flex', gap: '24px' }}>
          <button className="dashboard-link" onClick={() => onNavigate('calendar', 'push')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            Calendar <ArrowRight size={10} strokeWidth={1.5} />
          </button>
          {onDomainChange && (
            <button className="dashboard-link" onClick={() => onDomainChange('financials')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.5625rem', fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              Financials <ArrowRight size={10} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Verification:** All 3 zones fit within viewport height. No overflow scroll on 1080p.

---

### Task 8: Commit

```bash
git add -A
git commit -m "feat: rebuild At a Glance with Property Title Card, Health Score, Metric Grid, Guest Flow"
```

---

## Self-Review

- [x] Property Title Card is italic EB Garamond with ambient underline
- [x] Health Score ring draws with animation
- [x] Metric Grid uses 3-column editorial layout
- [x] Guest Flow is horizontal, viewport-efficient
- [x] Urgent Alert is thin, persistent, calm
- [x] All 3 zones fit within 1080p viewport
- [x] No placeholders in any task
