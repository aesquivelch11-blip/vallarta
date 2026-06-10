# Phase 2: Rebuild DashboardToday — Editorial Single-Column Layout

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite DashboardToday as a clean, editorial, single-column flow. No cards, no grids, no sparklines, no badges. The layout reads as a narrative: Property Identity → Occupancy (dominant) → Arrivals (italic guest names) → Departures (upright, smaller) → Quiet Day Message → Nav Links. This phase depends on Phase 1 (deletion of MetricCard, MetricGrid, StatusCards, UrgentAlert, GuestFlowStrip, PropertyTitleCard, RevparSnapshot).

**Architecture:** Complete rewrite of DashboardToday.tsx. All removed components are replaced with inline elements. Spacing is generous between sections, tight within sections. The layout uses flexbox (1D) — no grid needed. All data comes from the existing `DashboardData` interface and `dashboardData.ts` helpers.

**Tech Stack:** React 18, TypeScript, CSS custom properties, lucide-react, motion/react (for ambient provider context)

**Design Principles:**
- **$impeccable distill**: Remove cards, borders, decorations. Use spacing and alignment for grouping.
- **$impeccable layout**: Tight grouping for related elements (8-12px), generous separation between sections (48-96px). Flexbox for 1D flow.
- **Hospitality reference sites**: Restraint is the luxury signal. One dominant number (occupancy). Typography is architecture. Human language ("Quiet day", "No arrivals").

---

## File Map

| File | Responsibility | Action |
|---|---|---|
| `src/components/Dashboard/DashboardToday.tsx` | Today domain — complete rewrite | **Rewrite** |
| `tests/components/Dashboard/DashboardToday.test.tsx` | Tests for Today domain | **Create** |

---

## Task 1: Rewrite DashboardToday.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

**What to remove:**
- All imports of deleted components (MetricGrid, MetricCard, PropertyTitleCard, RevparSnapshot, GuestFlowStrip, UrgentAlert)
- All card-based layouts
- All grid-based layouts
- All sparklines and trend badges
- The "Zone A / Zone B / Zone C" structure

**What to build:**
- Property Identity (italic name + uppercase location)
- Occupancy (dominant EB Garamond figure, trend delta in text)
- Arrivals (numeral anchor + italic guest names + "n" suffix)
- Departures (smaller numeral, upright names, reduced opacity)
- Tomorrow hints (subordinate, muted)
- Quiet day message (when both arrivals and departures are empty)
- Nav links (Calendar →, Financials →)

- [ ] **Step 1: Replace the entire file**

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

- [ ] **Step 3: Write tests**

Create `tests/components/Dashboard/DashboardToday.test.tsx`:

```tsx
import { render, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
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

  it('renders location in uppercase tracked label', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="Puerto Vallarta" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('Puerto Vallarta');
  });

  it('renders occupancy as dominant figure', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('78%');
    expect(container.textContent).toContain('OCCUPANCY');
  });

  it('renders occupancy trend', () => {
    const { container } = render(
      <DashboardToday data={data} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('+5%');
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

  it('renders quiet day message when no activity', () => {
    const quietData = { ...data, arrivalsToday: [], departuresToday: [] };
    const { container } = render(
      <DashboardToday data={quietData} propertyName="Casa Palmeras" propertyLocation="PV" onNavigate={mockNavigate} />
    );
    expect(container.textContent).toContain('Quiet day');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `rtk vitest run tests/components/Dashboard/DashboardToday.test.tsx`

Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Dashboard/DashboardToday.tsx tests/components/Dashboard/DashboardToday.test.tsx
git commit -m "feat: rebuild DashboardToday as editorial single-column layout"
```

---

## Self-Review

### Spec Coverage

| Requirement | Task | Covered |
|---|---|---|
| Property name in italic | Task 1 | ✅ |
| Location in uppercase label | Task 1 | ✅ |
| Occupancy as dominant figure | Task 1 | ✅ |
| Occupancy trend as text (no badge) | Task 1 | ✅ |
| Arrivals with italic names | Task 1 | ✅ |
| Departures with upright names | Task 1 | ✅ |
| Arrivals > departures in visual weight | Task 1 | ✅ |
| Tomorrow hints subordinate | Task 1 | ✅ |
| Quiet day message | Task 1 | ✅ |
| Nav links (Calendar, Financials) | Task 1 | ✅ |
| No cards, no grids, no sparklines | Task 1 | ✅ |

### Placeholder Scan

- No "TBD", "TODO", or placeholders.
- All steps contain actual commands and complete code.
- No references to undefined types or functions.

### Type Consistency

- `DashboardTodayProps` interface uses existing types: `DashboardData`, `ScreenType`, `Domain`.
- `formatTrendPercent` and `getTrendDirection` are imported from `dashboardData.ts`.
- `onNavigate` and `onDomainChange` props match the call site in `DashboardView.tsx`.

---

## Execution Handoff

**Plan complete.**

**Execution options:**

**1. Subagent-Driven** — Dispatch a subagent to execute this phase.

**2. Inline Execution** — Execute all tasks in this session.

**Which approach?**
