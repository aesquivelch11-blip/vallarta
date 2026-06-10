# Dashboard Premium Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the dashboard's Today view into a premium, viewport-filling command surface with 9+ metrics, add a proper header with back/menu navigation, move the property title to an editorial gallery overlay, and clean up inconsistencies across all three domain panels.

**Architecture:** DashboardView gets a top header bar (back + menu) spanning the full left panel. DashboardGallery gains a property-name overlay with gradient scrim so the right panel becomes fully editorial. DashboardToday is rebuilt as a 5-zone flex layout filling 100% height without scroll, surfacing financial snapshot, occupancy satellites, guest activity, urgent tasks, and dual nav links.

**Tech Stack:** React 18, TypeScript, motion/react (AnimatePresence already used), Lucide icons, existing CSS design tokens in `src/design-tokens.css`

---

## File Map

| File | Change |
|------|--------|
| `src/components/Dashboard/DashboardView.tsx` | Add header bar; remove standalone property name section; pass props to gallery and today |
| `src/components/Dashboard/DashboardGallery.tsx` | Add `propertyName?`/`propertyLocation?` props; add gradient scrim + editorial overlay |
| `src/components/Dashboard/DashboardToday.tsx` | Full 5-zone rebuild; add `onDomainChange` prop |
| `src/components/Dashboard/DashboardFinancials.tsx` | Fix misleading nav link label |
| `src/components/Dashboard/DashboardTasks.tsx` | Add missing nav link at bottom |

---

## Task 1: Dashboard Header Bar (DashboardView.tsx)

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**What to build:** A 52px-tall header row at the very top of the left panel. Left side: back button (← BACK) navigating to `property_selector` with `push_back`. Right side: MENU button navigating to `nav_menu` with `push`. This header sits above the domain nav strip and content area.

- [ ] **Step 1: Add the header bar to the left panel**

In `src/components/Dashboard/DashboardView.tsx`, find the left panel div (the one with `display: 'flex', flexDirection: 'column', overflow: 'hidden'`). Add this as the FIRST child, before the mobile `DashboardDomainNav`:

```tsx
{/* Dashboard header — back + menu */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
    height: '52px',
    borderBottom: '1px solid var(--color-border-subtle)',
    flexShrink: 0,
  }}
>
  <button
    className="dashboard-focus"
    onClick={() => onNavigate('property_selector', 'push_back')}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: 'none',
      border: 'none',
      padding: '8px 0',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      fontSize: '0.5625rem',
      fontWeight: 500,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--color-ink-secondary)',
    }}
    aria-label="Back to property selector"
  >
    <ChevronLeft size={12} strokeWidth={1.5} />
    Back
  </button>

  <button
    className="dashboard-focus"
    onClick={() => onNavigate('nav_menu', 'push')}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      background: 'none',
      border: 'none',
      padding: '8px 0',
      cursor: 'pointer',
      fontFamily: 'var(--font-ui)',
      fontSize: '0.5625rem',
      fontWeight: 500,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--color-ink-secondary)',
    }}
    aria-label="Open navigation menu"
  >
    Menu
    <ChevronRight size={12} strokeWidth={1.5} />
  </button>
</div>
```

- [ ] **Step 2: Add ChevronLeft and ChevronRight to imports**

At the top of `DashboardView.tsx`, find the lucide-react import (if none exists, add it). The file currently has no lucide imports. Add:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
```

- [ ] **Step 3: Fix domain content wrapper for no-scroll on Today**

Find the inner domain content div:
```tsx
<div style={{ flex: 1, overflowY: 'auto' }}>
```

Change to:
```tsx
<div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
```

This prevents Today from scrolling (the 5-zone layout will fill the height) while Financials and Tasks still scroll.

- [ ] **Step 4: Pass onDomainChange to DashboardToday**

In the `renderDomain` switch, update the `today` case:
```tsx
case 'today':
  return <DashboardToday data={data} onNavigate={onNavigate} onDomainChange={setActiveDomain} />;
```

- [ ] **Step 5: Verify the header renders and buttons are tappable**

Run `pnpm dev`, open dashboard. Confirm back button is visible, clicking it returns to property selector. Confirm Menu button opens nav menu. Check 44px minimum touch target (the buttons have 8px vertical padding on a 12px font — if needed, increase padding to `'10px 4px'`).

---

## Task 2: Property Name → Gallery Overlay (DashboardGallery.tsx + DashboardView.tsx)

**Files:**
- Modify: `src/components/Dashboard/DashboardGallery.tsx`
- Modify: `src/components/Dashboard/DashboardView.tsx`

**What to build:** Remove the standalone property name/location block from the right panel top. Instead, pass name and location into DashboardGallery as optional props. The gallery renders them as an editorial overlay at bottom-left, identical in spirit to `.hero__property-name` / `.hero__property-location` from the design system — EB Garamond italic + Instrument Sans uppercase, on top of a dark gradient scrim.

- [ ] **Step 1: Add optional props to DashboardGallery**

In `src/components/Dashboard/DashboardGallery.tsx`, update the interface:

```tsx
interface DashboardGalleryProps {
  images: string[];
  propertyName?: string;
  propertyLocation?: string;
}
```

Update the function signature:
```tsx
export default function DashboardGallery({ images, propertyName, propertyLocation }: DashboardGalleryProps) {
```

- [ ] **Step 2: Add gradient scrim + property name overlay to gallery**

Inside the `<div className="relative w-full h-full overflow-hidden" ...>`, add these two elements after the `AnimatePresence` block:

```tsx
{/* Gradient scrim — only when property name is shown */}
{propertyName && (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 42%)',
      pointerEvents: 'none',
      zIndex: 2,
    }}
  />
)}

{/* Property identity overlay */}
{propertyName && (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      bottom: 'clamp(1.25rem, 2.5vw, 2rem)',
      left: 'clamp(1rem, 2vw, 1.75rem)',
      zIndex: 3,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}
  >
    <p
      style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
        letterSpacing: '-0.01em',
        color: 'rgba(255,255,255,0.94)',
        margin: 0,
        lineHeight: 1.1,
      }}
    >
      {propertyName}
    </p>
    {propertyLocation && (
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontWeight: 500,
          fontSize: '0.5625rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        {propertyLocation}
      </p>
    )}
  </div>
)}
```

- [ ] **Step 3: Update DashboardView.tsx — desktop right panel**

Find the right panel `<div className="hidden lg:flex lg:flex-col" ...>`. It currently has:

```tsx
{/* Property name */}
<div style={{ padding: ... }}>
  <p ...>{property.name}</p>
  <p ...>{property.location}</p>
</div>

{/* Gallery */}
<div style={{ flex: 1, minHeight: 0 }}>
  <DashboardGallery images={property.images} />
</div>
```

Replace with:
```tsx
{/* Gallery — now fills full height with property name overlay */}
<div style={{ flex: 1, minHeight: 0 }}>
  <DashboardGallery
    images={property.images}
    propertyName={property.name}
    propertyLocation={property.location}
  />
</div>
```

Also remove the padding wrapper div entirely. The right panel no longer has a standalone title block. `property` is already defined in scope.

- [ ] **Step 4: Verify gallery overlay renders correctly**

Run `pnpm dev`, open dashboard at desktop viewport. Confirm:
- Property name shows at bottom-left of gallery image
- Gradient scrim visible (dark fade at image bottom)
- No standalone title block above the gallery
- Slide between images — name persists correctly (it's static, not animated per image)
- Counter "01 / 03" still visible at bottom-right (zIndex 3 for name overlay, counter is `absolute bottom-3 right-4` — verify no collision)

Note: the counter uses `className="absolute bottom-3 right-4"` at zIndex default. Add `style={{ zIndex: 4 }}` to the counter span to ensure it renders above the gradient scrim.

---

## Task 3: DashboardToday 5-Zone Rebuild

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

**What to build:** Replace the current sparse layout with a 5-zone flex column that fills `height: 100%` without scrolling. Zones: (1) financial snapshot, (2) occupancy + satellites, (3) today's activity, (4) urgent task alert, (5) nav row.

- [ ] **Step 1: Update props interface and imports**

Replace the top of `DashboardToday.tsx` with:

```tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { Domain } from './DashboardDomainNav';
import {
  DashboardData,
  GuestEvent,
  formatCurrency,
  formatTrendPercent,
  getTrendDirection,
  formatDueDate,
} from './dashboardData';
import TrendBadge from './TrendBadge';
import Sparkline from './Sparkline';

interface DashboardTodayProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onDomainChange?: (domain: Domain) => void;
}
```

- [ ] **Step 2: Keep GuestList and EmptyGuests — no changes needed**

These components (lines 13–65) remain exactly as-is. Do not modify them.

- [ ] **Step 3: Compute derived values at top of render function**

Replace the destructuring at the start of `DashboardToday`:

```tsx
export default function DashboardToday({ data, onNavigate, onDomainChange }: DashboardTodayProps) {
  const { occupancy, arrivalsToday, departuresToday, arrivalsTomorrow, departuresTomorrow } = data;

  const currentPeriod = data.periods[0];
  const prevPeriod = data.periods[1];
  const netIncome = currentPeriod.revenue - currentPeriod.expenses;
  const revTrend = formatTrendPercent(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const revDirection = getTrendDirection(currentPeriod.revenue, prevPeriod?.revenue ?? currentPeriod.revenue);
  const urgentTask = data.tasks.find(t => t.status === 'urgent') ?? null;
```

- [ ] **Step 4: Write the root container and shared style objects**

Replace the entire return statement with the new layout. Start with the root div and shared styles:

```tsx
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.5625rem',
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-ink-secondary)',
    margin: 0,
    lineHeight: 1,
  };

  const divider = (
    <div style={{ height: '1px', background: 'var(--color-border-subtle)', flexShrink: 0 }} />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem)',
        gap: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      }}
    >
      {/* Zone 1 — Financial Snapshot */}
      {/* Zone 2 — Occupancy */}
      {divider}
      {/* Zone 3 — Today's Activity */}
      {divider}
      {/* Zone 4 — Urgent Task (conditional) */}
      {/* Zone 5 — Nav Row */}
    </div>
  );
}
```

- [ ] **Step 5: Zone 1 — Financial Snapshot**

Replace the `{/* Zone 1 — Financial Snapshot */}` comment with:

```tsx
{/* Zone 1 — Financial Snapshot */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'clamp(1rem, 2vw, 1.5rem)',
    flexShrink: 0,
  }}
>
  {/* Revenue MTD */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <p style={labelStyle}>Revenue MTD</p>
    <p
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        color: 'var(--color-ink)',
        margin: 0,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatCurrency(currentPeriod.revenue)}
    </p>
    <TrendBadge value={revTrend} direction={revDirection} />
  </div>

  {/* Net Income MTD */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <p style={labelStyle}>Net Income</p>
    <p
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        color: netIncome >= 0 ? 'var(--color-ink)' : 'oklch(53% 0.12 25)',
        margin: 0,
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {formatCurrency(netIncome)}
    </p>
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.5625rem',
        fontWeight: 400,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-muted)',
        margin: 0,
        lineHeight: 1,
      }}
    >
      {currentPeriod.label}
    </p>
  </div>
</div>
```

- [ ] **Step 6: Zone 2 — Occupancy + Satellites**

Replace the `{/* Zone 2 — Occupancy */}` comment with:

```tsx
{/* Zone 2 — Occupancy */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
  {/* Occupancy figure + sparkline */}
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
    <div>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)',
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
        <p style={labelStyle}>Occupancy</p>
        <TrendBadge
          value={formatTrendPercent(occupancy, data.occupancyPrev)}
          direction={getTrendDirection(occupancy, data.occupancyPrev)}
        />
      </div>
    </div>
    <Sparkline
      data={data.occupancyHistory}
      width={120}
      height={40}
      color="var(--color-ink-secondary)"
      strokeWidth={1.25}
    />
  </div>

  {/* Satellite metrics row */}
  <div
    style={{
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      marginTop: '4px',
    }}
  >
    <span
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.5625rem',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-muted)',
        lineHeight: 1,
      }}
    >
      {data.guestSatisfaction.score.toFixed(1)}★
    </span>
    <span
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.5625rem',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-muted)',
        lineHeight: 1,
      }}
    >
      {data.guestSatisfaction.reviewCount} reviews
    </span>
    <span
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.5625rem',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-muted)',
        lineHeight: 1,
      }}
    >
      {data.lengthOfStay.average.toFixed(1)}n avg stay
    </span>
  </div>
</div>
```

- [ ] **Step 7: Zone 3 — Today's Activity**

Replace the `{/* Zone 3 — Today's Activity */}` comment with:

```tsx
{/* Zone 3 — Today's Activity */}
<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2vw, 1.5rem)', minHeight: 0 }}>
  {/* Arrivals */}
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.375rem, 2.5vw, 1.875rem)',
          fontWeight: 400,
          color: 'var(--color-ink)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        {arrivalsToday.length}
      </p>
      <p style={labelStyle}>Arriving today</p>
    </div>
    {arrivalsToday.length > 0
      ? <GuestList guests={arrivalsToday} italic={true} />
      : <EmptyGuests label="No arrivals" />
    }
    {arrivalsTomorrow.length > 0 && (
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5625rem',
          fontWeight: 400,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          margin: '8px 0 0',
          opacity: 0.7,
        }}
      >
        {arrivalsTomorrow.length} tomorrow
      </p>
    )}
  </div>

  {/* Departures */}
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          fontWeight: 400,
          color: 'var(--color-ink-secondary)',
          margin: 0,
          lineHeight: 1,
        }}
      >
        {departuresToday.length}
      </p>
      <p style={{ ...labelStyle, fontSize: '0.5rem', opacity: 0.75 }}>Departing today</p>
    </div>
    {departuresToday.length > 0
      ? <GuestList guests={departuresToday} italic={false} />
      : <EmptyGuests label="No departures" />
    }
    {departuresTomorrow.length > 0 && (
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5625rem',
          fontWeight: 400,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          margin: '8px 0 0',
          opacity: 0.6,
        }}
      >
        {departuresTomorrow.length} tomorrow
      </p>
    )}
  </div>
</div>
```

- [ ] **Step 8: Zone 4 — Urgent Task Alert**

Replace the `{/* Zone 4 — Urgent Task (conditional) */}` comment with:

```tsx
{/* Zone 4 — Urgent Task Alert */}
{urgentTask && (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexShrink: 0,
    }}
  >
    {/* Dot indicator */}
    <span
      style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: 'var(--color-task-urgent)',
        flexShrink: 0,
      }}
      aria-hidden="true"
    />
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
      {urgentTask.description}
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.5625rem',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-muted)',
          marginLeft: '8px',
        }}
      >
        {urgentTask.assignee} · {formatDueDate(urgentTask.dueDate)}
      </span>
    </p>
  </div>
)}
```

- [ ] **Step 9: Zone 5 — Navigation Row**

Replace the `{/* Zone 5 — Nav Row */}` comment with:

```tsx
{/* Zone 5 — Navigation Row */}
<div
  style={{
    display: 'flex',
    gap: '24px',
    flexShrink: 0,
  }}
>
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
    Calendar
    <ArrowRight size={10} strokeWidth={1.5} />
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
      Financials
      <ArrowRight size={10} strokeWidth={1.5} />
    </button>
  )}
</div>
```

- [ ] **Step 10: Delete old Quiet day block and old nav button**

The old code (lines 231–295 in the original) is now replaced entirely. Confirm the file no longer contains the old "Quiet day" section or the old single `VIEW CALENDAR` button.

- [ ] **Step 11: Verify Today domain renders correctly**

Run `pnpm dev`. Open dashboard → Today domain. Confirm:
- All 5 zones visible without scrolling at 1440×900
- Revenue MTD + Net Income in two columns at top
- 78% occupancy with sparkline at full opacity
- Satellite row shows satisfaction, reviews, avg stay
- Guest arrivals with italic EB Garamond names
- Urgent task dot + description visible for `casa-palmeras`
- Two nav links at bottom
- No scroll on Today; switch to Financials → still scrollable

---

## Task 4: DashboardFinancials — Fix Nav Link Label

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

The current bottom link says "VIEW FINANCIALS" and navigates to `reporting`. This is confusing — you're already on the Financials domain. Fix the label.

- [ ] **Step 1: Fix the nav link text**

In `src/components/Dashboard/DashboardFinancials.tsx`, find:

```tsx
>
  VIEW FINANCIALS
  <ArrowRight size={11} strokeWidth={1.5} />
</button>
```

Replace with:

```tsx
>
  Full Report
  <ArrowRight size={11} strokeWidth={1.5} />
</button>
```

---

## Task 5: DashboardTasks — Add Missing Nav Link

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx`

Tasks domain has no navigation link at the bottom — inconsistent with Today (VIEW CALENDAR) and Financials (FULL REPORT). Add a link to the calendar since tasks are often associated with upcoming arrivals.

- [ ] **Step 1: Add ArrowRight import**

At the top of `DashboardTasks.tsx`, `ArrowRight` is already imported:
```tsx
import { ArrowRight } from 'lucide-react';
```
✓ Already present. No change needed.

- [ ] **Step 2: Add nav link at the bottom of the tasks list**

After the closing `</ol>` (or the empty state block), before the closing outer `</div>`, add:

```tsx
{/* Nav link */}
<button
  className="dashboard-link"
  onClick={() => onNavigate('calendar', 'push')}
  style={{
    marginTop: 'clamp(1.5rem, 3vw, 2rem)',
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
    alignSelf: 'flex-start',
  }}
>
  View Calendar
  <ArrowRight size={10} strokeWidth={1.5} />
</button>
```

---

## Verification Checklist

Run `pnpm dev` and verify each item:

**Header:**
- [ ] Back button visible in left panel top-left
- [ ] Clicking Back → navigates to `property_selector` with slide-back transition
- [ ] Menu button visible in left panel top-right
- [ ] Clicking Menu → opens `nav_menu`

**Gallery Overlay:**
- [ ] Property name (EB Garamond italic) visible over gallery photo, bottom-left
- [ ] Location (Instrument Sans uppercase, muted) visible below name
- [ ] Dark gradient scrim fades image bottom
- [ ] Photo counter (01/03) still visible at bottom-right, not obscured
- [ ] No standalone property name block above gallery

**Today — 5 Zones:**
- [ ] Revenue MTD + Net Income in 2-col grid (top)
- [ ] Occupancy 78% dominant with sparkline at right (not 0.4 opacity)
- [ ] Satellite row: `4.8★ · 47 reviews · 4.2n avg stay`
- [ ] Arrivals: italic guest names; Departures: upright guest names
- [ ] Urgent task dot + description + assignee for `casa-palmeras`
- [ ] `casa-brisa` (no urgent tasks) — Zone 4 absent, no empty state
- [ ] Two nav links: Calendar + Financials
- [ ] Clicking Financials link → switches to Financials domain (no screen navigation)
- [ ] Zero vertical scroll on Today at 1440×900 and 1280×800

**Financials:**
- [ ] Bottom link now reads "Full Report →" not "VIEW FINANCIALS"

**Tasks:**
- [ ] "View Calendar →" link appears at bottom of Tasks domain
