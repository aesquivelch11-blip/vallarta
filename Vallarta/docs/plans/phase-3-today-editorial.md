# Phase 3: DashboardToday — Editorial Rewrite

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execute phases in order.

**Goal:** Make the Today view feel like an editorial publication — occupancy as the dominant typographic element, staggered motion entrance for each section, no dividers, no property identity block (that now lives in gallery overlay).

**Architecture:** DashboardToday.tsx is completely rewritten. Property name/location block is removed entirely (moved to gallery hero in Phase 1). All horizontal dividers removed — space does the separation work. Occupancy number grows from `clamp(2.5rem, 5vw, 3.5rem)` to `clamp(4.5rem, 9vw, 6.5rem)`. Each section is a `motion.div` with stagger using `custom={index}` + `sectionVariants`. `height: '100%'` + `overflow: 'hidden'` removed — content can scroll naturally (Phase 2 made content area scrollable).

**Tech Stack:** Vite + React 18 + TypeScript, motion/react v12

**Prerequisites:** Phase 1 + Phase 2 complete and committed.

---

## Project Context

### File to rewrite
`src/components/Dashboard/DashboardToday.tsx`

### What currently exists that changes

| Element | Before | After |
|---------|--------|-------|
| Property identity block | Name + location at top, `clamp(1.25rem, 2vw, 1.625rem)` | **REMOVED** — moved to gallery overlay in Phase 1 |
| Dividers | Two horizontal 1px lines | **REMOVED** — gap-only separation |
| Occupancy font size | `clamp(2.5rem, 5vw, 3.5rem)` | `clamp(4.5rem, 9vw, 6.5rem)` — MASSIVE |
| Occupancy font style | Upright roman | Upright roman (keep — only guest names get italic) |
| Arrivals count font | `clamp(1.5rem, 3vw, 2rem)` | `clamp(1.75rem, 3.5vw, 2.5rem)` |
| Arrivals empty state | `"No arrivals"` in Instrument Sans | `"A quiet day."` in italic EB Garamond |
| Departures opacity | `opacity: 0.75` on wrapper | `opacity: 0.55` — more recessive |
| Departures empty state | `"No departures"` in Instrument Sans | same italic empty state logic |
| Motion | None | stagger: each section `motion.div custom={i}` |
| Overflow | `height: '100%', overflow: 'hidden'` | none — natural scroll (Phase 2 owns scrolling) |
| Gap between sections | `clamp(1.5rem, 3vw, 2.5rem)` | `clamp(2rem, 4vw, 3rem)` |

### Stagger animation pattern (copy exactly)

```typescript
import { motion } from 'motion/react';

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

// Usage on each section:
<motion.div
  variants={sectionVariants}
  initial="hidden"
  animate="visible"
  custom={0}  // 0, 1, 2, 3 for each section
>
```

Section stagger order: Occupancy = 0, Arrivals = 1, Departures = 2, Nav links = 3

### Imports needed
```typescript
import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { Domain } from './DashboardDomainNav';
import { DashboardData, formatTrendPercent, getTrendDirection } from './dashboardData';
```

### Props interface (unchanged)
```typescript
interface DashboardTodayProps {
  data: DashboardData;
  propertyName: string;
  propertyLocation: string;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onDomainChange?: (domain: Domain) => void;
}
```
Keep `propertyName` + `propertyLocation` in props — DashboardView still passes them even though Today no longer displays them. Removing from props would require updating DashboardView call sites — unnecessary churn.

---

## Task 1: Rewrite DashboardToday.tsx

- [ ] **Step 1: Replace the entire file content**

Write `src/components/Dashboard/DashboardToday.tsx` with exactly this content:

```typescript
import React from 'react';
import { motion } from 'motion/react';
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
  lineHeight: 1,
};

export default function DashboardToday({
  data,
  onNavigate,
  onDomainChange,
}: DashboardTodayProps) {
  const {
    occupancy,
    occupancyPrev,
    arrivalsToday,
    departuresToday,
    arrivalsTomorrow,
    departuresTomorrow,
  } = data;
  const occTrend = formatTrendPercent(occupancy, occupancyPrev);
  const occDirection = getTrendDirection(occupancy, occupancyPrev);

  const quietDay = arrivalsToday.length === 0 && departuresToday.length === 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
        gap: 'clamp(2rem, 4vw, 3rem)',
      }}
    >
      {/* Occupancy — dominant typographic anchor of the view */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={0}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4.5rem, 9vw, 6.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 0.95,
          }}
        >
          {occupancy}%
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
          <p style={labelStyle}>OCCUPANCY</p>
          {occTrend && (
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
          )}
        </div>
      </motion.div>

      {/* Arrivals */}
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={1}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
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
          <ul
            style={{
              margin: '10px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {arrivalsToday.map((g) => (
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

        {arrivalsToday.length === 0 && !quietDay && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: '10px 0 0',
            }}
          >
            A quiet day.
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
            {arrivalsTomorrow.length}{' '}
            {arrivalsTomorrow.length === 1 ? 'guest arrives' : 'guests arrive'} tomorrow
          </p>
        )}
      </motion.div>

      {/* Departures — recessive, lower opacity */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={2}
        style={{ opacity: 0.55 }}
      >
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
          <p style={{ ...labelStyle, fontSize: '0.5rem' }}>Departing</p>
        </div>

        {departuresToday.length > 0 && (
          <ul
            style={{
              margin: '10px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {departuresToday.map((g) => (
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

        {departuresToday.length === 0 && !quietDay && (
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: '10px 0 0',
            }}
          >
            No departures.
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
            {departuresTomorrow.length}{' '}
            {departuresTomorrow.length === 1 ? 'guest departs' : 'guests depart'} tomorrow
          </p>
        )}
      </motion.div>

      {/* Quiet day — only when truly nothing happening */}
      {quietDay && (
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" custom={1}>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2vw, 1.375rem)',
              fontWeight: 400,
              color: 'var(--color-ink-secondary)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            A quiet day.
          </p>
        </motion.div>
      )}

      {/* Navigation links */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={3}
        style={{ display: 'flex', gap: '24px' }}
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

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

Navigate to Dashboard → Today tab.

- [ ] Occupancy percentage is massive — roughly 4-6× bigger than before, dominant presence
- [ ] No property name/location block at top — removed
- [ ] No horizontal divider lines — pure whitespace separation between sections
- [ ] Sections animate in with stagger: occupancy first, then arrivals slightly after, departures after that, nav last
- [ ] Arrivals: guest names in italic EB Garamond
- [ ] Departures section visibly more recessive (opacity 0.55)
- [ ] If no arrivals AND no departures: single italic `"A quiet day."` renders instead of both section empty states
- [ ] Page scrolls if content overflows (no `height: 100%, overflow: hidden`)

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardToday.tsx
git commit -m "feat(today): editorial rewrite — dominant occupancy, stagger motion, no dividers"
```

---

## Expected Visual Outcome

| Before | After |
|--------|-------|
| Property name + location block at top | Removed — gallery overlay owns this |
| Two horizontal divider lines | Zero dividers — gap separation only |
| Occupancy: `clamp(2.5rem, 5vw, 3.5rem)` | Occupancy: `clamp(4.5rem, 9vw, 6.5rem)` — editorial anchor |
| No motion on any elements | Staggered entrance: each section 0.08s offset |
| `"No arrivals"` in Instrument Sans | `"A quiet day."` in italic EB Garamond |
| Departures opacity: `0.75` | Departures opacity: `0.55` — properly recessive |

---

**Proceed to Phase 4** (`phase-4-financials-editorial.md`) once this commit is verified.
