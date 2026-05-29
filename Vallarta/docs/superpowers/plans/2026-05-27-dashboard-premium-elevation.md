# Dashboard Premium Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `FinancialReportingView` card-grid layout with a premium, editorial, Awwward-caliber interface that embodies the "Luxury Villa Overseer" north star — no repeated card boxes, no side-stripe accents, no glassmorphism defaults.

**Architecture:** Three coordinated layers: (1) CSS token changes in `design-tokens.css` remove the `.stat-card` family and introduce open editorial primitives (`.metrics-rail`, `.arrival-row`); (2) `FinancialReportingView.tsx` is structurally rewritten, replacing `StatCard` with `MetricItem` and avatar-plus-badge arrivals with pure typographic rows; (3) chart SVG strips area fills to hairline curves. All changes are verified by Node.js assertion tests matching the existing `tests/` pattern before each implementation step.

**Tech Stack:** React 19, TypeScript 5.8, motion/react (Framer Motion v12), Lucide React, Vanilla CSS, Vite 6, Node.js assert (test runner).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/design-tokens.css` | Remove `.stat-card`, `.stats-band`, `.arrival-item`, `.arrival-avatar`; add `.metrics-rail`, `.metrics-rail__item`, `.metrics-rail__label`, `.metrics-rail__value`, `.metrics-rail__delta`, `.arrival-row`, `.arrival-row__name`, `.arrival-row__meta`, `.arrival-row__type`; update `.chart-panel`, `.sidebar__section`, responsive breakpoints |
| Rewrite | `src/components/FinancialReportingView.tsx` | Replace `StatCard` + `ArrivalAvatar` + `getInitials` with `MetricItem`; rewrite stats section JSX, arrivals JSX, chart SVG, hero scroll handler |
| Create | `tests/test_reporting_elevation.js` | Assertion tests for every anti-pattern removal and every new class introduction |
| No change | `src/App.tsx` | Props contract is unchanged |
| No change | `src/design-tokens.css` `:root` | All existing tokens are correct; only class-level blocks change |

---

## Task 1: Write the Failing Assertion Tests

**Files:**
- Create: `tests/test_reporting_elevation.js`

Write every test that will validate the completed refactor. They all fail now because the anti-patterns still exist. Run them, confirm failure, then implement across Tasks 2–7.

- [ ] **Step 1: Create the test file**

```js
// tests/test_reporting_elevation.js
import fs from 'fs';
import assert from 'assert';

const css = fs.readFileSync('src/design-tokens.css', 'utf-8');
const view = fs.readFileSync('src/components/FinancialReportingView.tsx', 'utf-8');

// ── Anti-pattern removals ──────────────────────────────────────────────────

assert.strictEqual(
  css.includes('.stat-card'),
  false,
  'FAIL: design-tokens.css still defines .stat-card (identical card grids ban)'
);

assert.strictEqual(
  css.includes('.stats-band'),
  false,
  'FAIL: design-tokens.css still defines .stats-band'
);

assert.strictEqual(
  css.includes('arrival-item::before'),
  false,
  'FAIL: design-tokens.css still has side-stripe border on arrival-item::before'
);

assert.strictEqual(
  view.includes('StatCard'),
  false,
  'FAIL: FinancialReportingView.tsx still uses StatCard component'
);

assert.strictEqual(
  view.includes('arrival-item'),
  false,
  'FAIL: FinancialReportingView.tsx still uses arrival-item className'
);

assert.strictEqual(
  view.includes('arrival-avatar'),
  false,
  'FAIL: FinancialReportingView.tsx still uses arrival-avatar className'
);

assert.strictEqual(
  view.includes('getInitials'),
  false,
  'FAIL: FinancialReportingView.tsx still uses getInitials helper'
);

assert.strictEqual(
  view.includes('ArrivalAvatar'),
  false,
  'FAIL: FinancialReportingView.tsx still uses ArrivalAvatar component'
);

// ── New primitive introductions ────────────────────────────────────────────

assert.ok(
  css.includes('.metrics-rail'),
  'FAIL: design-tokens.css missing .metrics-rail'
);

assert.ok(
  css.includes('.metrics-rail__item'),
  'FAIL: design-tokens.css missing .metrics-rail__item'
);

assert.ok(
  css.includes('.metrics-rail__value'),
  'FAIL: design-tokens.css missing .metrics-rail__value'
);

assert.ok(
  css.includes('.arrival-row'),
  'FAIL: design-tokens.css missing .arrival-row'
);

assert.ok(
  view.includes('MetricItem'),
  'FAIL: FinancialReportingView.tsx missing MetricItem component'
);

assert.ok(
  view.includes('metrics-rail'),
  'FAIL: FinancialReportingView.tsx missing metrics-rail section'
);

assert.ok(
  view.includes('arrival-row'),
  'FAIL: FinancialReportingView.tsx missing arrival-row rows'
);

// ── Chart fill areas removed ───────────────────────────────────────────────

assert.strictEqual(
  view.includes('line-fill-revenue'),
  false,
  'FAIL: FinancialReportingView.tsx still has chart fill area (line-fill-revenue)'
);

assert.strictEqual(
  view.includes('line-fill-yield'),
  false,
  'FAIL: FinancialReportingView.tsx still has chart fill area (line-fill-yield)'
);

console.log('PASS: Dashboard premium elevation assertions passed');
```

- [ ] **Step 2: Run the tests — confirm all fail**

```bash
node tests/test_reporting_elevation.js
```

Expected: the first assertion fails immediately with:

```
AssertionError [ERR_ASSERTION]: FAIL: design-tokens.css still defines .stat-card (identical card grids ban)
```

This is correct. Every test in this file should fail at this point. Do not proceed until you have confirmed the failure.

---

## Task 2: Remove Anti-Patterns from `design-tokens.css`

**Files:**
- Modify: `src/design-tokens.css:315-598`
- Test: `tests/test_reporting_elevation.js`

Remove the `.stats-band`, `.stat-card`, `.arrival-item`, `.arrival-item::before`, and `.arrival-avatar` blocks entirely.

- [ ] **Step 1: Delete `.stats-band` and `.stat-card` blocks**

In `src/design-tokens.css`, find and delete the entire block from `.stats-band {` through the closing `}` of `.stat-card__description`. This spans approximately lines 315–598. The markers are:

```css
/* Stats Band */
.stats-band { … }
```
through:
```css
.stat-card__description { … }
```

Delete every line in that range. Nothing else.

- [ ] **Step 2: Delete `.arrival-item`, `.arrival-item::before`, `.arrival-avatar` blocks**

Still in `src/design-tokens.css`, find and delete the three blocks:

```css
/* Arrival Item */
.arrival-item { … }
.arrival-item::before { … }
.arrival-item:hover { … }
.arrival-item:hover::before { … }
.arrival-avatar { … }
```

Delete all five rule-sets.

- [ ] **Step 3: Run the anti-pattern removal tests**

```bash
node tests/test_reporting_elevation.js
```

Expected output — several assertions now pass (the removal checks), but the "new primitive" assertions still fail:

```
AssertionError [ERR_ASSERTION]: FAIL: design-tokens.css missing .metrics-rail
```

This is correct. Continue.

- [ ] **Step 4: Commit the deletions**

```bash
git add src/design-tokens.css
git commit -m "refactor: remove stat-card, stats-band, arrival-item anti-patterns from CSS"
```

---

## Task 3: Add Editorial Primitives to `design-tokens.css`

**Files:**
- Modify: `src/design-tokens.css` (append after line 314, where the deleted blocks were)
- Test: `tests/test_reporting_elevation.js`

- [ ] **Step 1: Add `.metrics-rail` and item primitives**

In `src/design-tokens.css`, in the position where `.stats-band` used to be, insert:

```css
/* ── Metrics Rail ── */
.metrics-rail {
  max-width: var(--grid-max-width);
  margin: 0 auto;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: stretch;
  background: var(--color-canvas);
  border-bottom: 1px solid var(--color-border-subtle);
}

.metrics-rail__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 36px 32px;
  border-right: 1px solid var(--color-border-subtle);
  transition: background var(--duration-fast) var(--ease-out-expo);
}

.metrics-rail__item:last-child {
  border-right: none;
}

.metrics-rail__item--primary {
  flex: 1.6;
}

.metrics-rail__item[role="button"]:hover {
  background: rgba(28, 25, 23, 0.025);
  cursor: pointer;
}

.metrics-rail__label {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 10px;
}

.metrics-rail__value {
  font-family: var(--font-display);
  font-size: clamp(32px, 3vw, 44px);
  font-weight: 300;
  font-style: italic;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}

.metrics-rail__item--primary .metrics-rail__value {
  font-size: clamp(40px, 4vw, 56px);
}

.metrics-rail__delta {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 8px;
}

.metrics-rail__delta--positive { color: var(--color-accent-positive); }
.metrics-rail__delta--neutral  { color: var(--color-ink-muted); }
.metrics-rail__delta--negative { color: #DC2626; }
```

- [ ] **Step 2: Add `.arrival-row` primitives**

Directly after the metrics rail block, insert:

```css
/* ── Arrival Row ── */
.arrival-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border-subtle);
  cursor: pointer;
  transition: opacity var(--duration-fast) var(--ease-out-expo);
}

.arrival-row:last-child {
  border-bottom: none;
}

.arrival-row:hover {
  opacity: 0.6;
}

.arrival-row__name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  font-style: italic;
  color: var(--color-ink);
  line-height: 1.2;
}

.arrival-row__meta {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-top: 5px;
}

.arrival-row__type {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  align-self: center;
}

.arrival-row__type--owner {
  color: var(--color-accent-warning);
}
```

- [ ] **Step 3: Run tests — confirm CSS primitives now pass**

```bash
node tests/test_reporting_elevation.js
```

Expected: the CSS assertions all pass. The view (`.tsx`) assertions still fail:

```
AssertionError [ERR_ASSERTION]: FAIL: FinancialReportingView.tsx still uses StatCard component
```

This is correct. Continue.

- [ ] **Step 4: Commit**

```bash
git add src/design-tokens.css
git commit -m "feat: add metrics-rail and arrival-row editorial CSS primitives"
```

---

## Task 4: Replace `StatCard` with `MetricItem` in the Component

**Files:**
- Modify: `src/components/FinancialReportingView.tsx:1-69`
- Test: `tests/test_reporting_elevation.js`

- [ ] **Step 1: Replace the imports and arrival data (lines 1–15)**

Replace lines 1–15 of `src/components/FinancialReportingView.tsx` with:

```tsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { ScreenType } from '../types';

interface FinancialReportingViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const arrivals = [
  { name: 'The Sinclair Family', dates: 'Oct 12 — 19', nights: '7 nights',  type: 'OWNER USE'     },
  { name: 'M. Dubois',           dates: 'Oct 18 — 21', nights: '3 nights',  type: 'ACCEPTED GUEST' },
  { name: 'The Al-Sayed Party',  dates: 'Oct 24 — Nov 2', nights: '9 nights', type: 'OWNER USE'   },
];
```

- [ ] **Step 2: Replace `getInitials`, `ArrivalAvatar`, and `StatCard` (lines 17–69)**

Replace lines 17–69 with:

```tsx
function MetricItem({
  label, value, delta, trend, isPrimary, delay, onClick,
}: {
  label: string;
  value: string;
  delta?: string;
  trend: 'up' | 'stable' | 'down';
  isPrimary?: boolean;
  delay: number;
  onClick?: () => void;
}) {
  const deltaClass =
    trend === 'up'   ? 'metrics-rail__delta--positive'
    : trend === 'down' ? 'metrics-rail__delta--negative'
    : 'metrics-rail__delta--neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`metrics-rail__item${isPrimary ? ' metrics-rail__item--primary' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <span className="metrics-rail__label">{label}</span>
      <span className="metrics-rail__value">{value}</span>
      {delta && (
        <span className={`metrics-rail__delta ${deltaClass}`}>{delta}</span>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Run the type-checker**

```bash
npm run lint
```

Expected: errors about `StatCard` being used in JSX but not defined (from the JSX further down the file). This is correct — Task 5 fixes the JSX. The `MetricItem` definition itself should be error-free.

- [ ] **Step 4: Commit**

```bash
git add src/components/FinancialReportingView.tsx
git commit -m "refactor: replace getInitials/ArrivalAvatar/StatCard with MetricItem"
```

---

## Task 5: Replace the Stats Band JSX

**Files:**
- Modify: `src/components/FinancialReportingView.tsx:144-184`
- Test: `tests/test_reporting_elevation.js`

- [ ] **Step 1: Replace the `<section className="stats-band">` block**

Find the `{/* ── Stats Band ── */}` comment and replace the entire section through its closing `</section>` tag with:

```tsx
      {/* ── Metrics Rail ── */}
      <section className="metrics-rail" id="reporting-metrics-section">
        <MetricItem
          label="Revenue"
          value="$124,500"
          delta="+14% vs last period"
          trend="up"
          isPrimary
          delay={0.4}
        />
        <MetricItem
          label="Yield / Night"
          value="$1,450"
          delta="Stable"
          trend="stable"
          delay={0.46}
          onClick={() => onNavigate('deep_dive', 'push')}
        />
        <MetricItem
          label="Occupancy"
          value="88%"
          delta="+3% vs last period"
          trend="up"
          delay={0.52}
          onClick={() => onNavigate('calendar', 'push')}
        />
        <MetricItem
          label="Sentiment"
          value="4.9"
          delta="Top 5%"
          trend="up"
          delay={0.58}
        />
        <MetricItem
          label="Nights Booked"
          value="129"
          delta="+12% vs last period"
          trend="up"
          delay={0.64}
        />
      </section>
```

- [ ] **Step 2: Run the type-checker**

```bash
npm run lint
```

Expected: no errors related to `StatCard` — it is no longer referenced anywhere. Any remaining errors will be from a later section.

- [ ] **Step 3: Run the assertions**

```bash
node tests/test_reporting_elevation.js
```

Expected: `StatCard` and `metrics-rail` view assertions now pass. Remaining failures are for `arrival-item` and `arrival-avatar`.

- [ ] **Step 4: Commit**

```bash
git add src/components/FinancialReportingView.tsx
git commit -m "refactor: replace stats-band JSX with metrics-rail"
```

---

## Task 6: Replace the Arrivals JSX

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` (arrivals map block, approximately lines 282–307)
- Test: `tests/test_reporting_elevation.js`

- [ ] **Step 1: Replace the arrivals `map` block**

Find the `{arrivals.map((a, i) => (` block and replace it entirely:

```tsx
            {arrivals.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="arrival-row"
                id={`arrival-${i + 1}`}
                onClick={() => onNavigate('calendar', 'push')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('calendar', 'push')}
              >
                <div>
                  <p className="arrival-row__name">{a.name}</p>
                  <p className="arrival-row__meta">{a.dates} · {a.nights}</p>
                </div>
                <span className={`arrival-row__type${a.type === 'OWNER USE' ? ' arrival-row__type--owner' : ''}`}>
                  {a.type}
                </span>
              </motion.div>
            ))}
```

- [ ] **Step 2: Run the full assertion suite**

```bash
node tests/test_reporting_elevation.js
```

Expected: all assertions pass except the chart fill ones:

```
AssertionError [ERR_ASSERTION]: FAIL: FinancialReportingView.tsx still has chart fill area (line-fill-revenue)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FinancialReportingView.tsx
git commit -m "refactor: replace avatar-badge arrivals with typographic arrival-row"
```

---

## Task 7: Strip Chart Fills and Deepen Hero Parallax

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` (scroll handler ~line 79; chart SVG ~lines 208–260)
- Test: `tests/test_reporting_elevation.js`

- [ ] **Step 1: Deepen the parallax multiplier**

Find the `heroImgRef.current.style.transform` line (approximately line 79) and replace it:

```tsx
        heroImgRef.current.style.transform =
          `translateY(${window.scrollY * 0.55}px) scale(${1 + window.scrollY * 0.00012})`;
```

- [ ] **Step 2: Strip chart fills — remove `<defs>` and fill `<path>` elements**

Find the `<svg viewBox="0 0 500 140"...>` block. Remove these elements entirely:

- The entire `<defs>` block containing `linearGradient id="line-fill-revenue"` and `linearGradient id="line-fill-yield"`
- The two `<motion.path>` elements with `fill="url(#line-fill-revenue)"` and `fill="url(#line-fill-yield)"`

Then reduce `strokeWidth` from `"2"` to `"1.5"` on both remaining stroke paths, and replace the inline month labels loop with a concise map:

```tsx
          <div className="relative h-[280px] w-full" id="reporting-chart-canvas">
            <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="30"  x2="500" y2="30"  stroke="rgba(28,25,23,0.04)" strokeWidth="1" />
              <line x1="0" y1="75"  x2="500" y2="75"  stroke="rgba(28,25,23,0.04)" strokeWidth="1" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />

              <motion.path
                initial={{ strokeDasharray: 820, strokeDashoffset: 820 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20"
                fill="none"
                stroke="var(--color-accent-warning)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="500" cy="20" r="3" fill="var(--color-accent-warning)" />

              <motion.path
                initial={{ strokeDasharray: 560, strokeDashoffset: 560 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.0, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98"
                fill="none"
                stroke="var(--color-accent-positive)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex justify-between mt-2">
              {['May','Jun','Jul','Aug','Sep','Oct'].map(m => (
                <span key={m} className="t-mono" style={{ color: 'var(--color-ink-muted)', fontSize: '9px' }}>{m}</span>
              ))}
            </div>
          </div>
```

- [ ] **Step 3: Run the full assertion suite — all should pass**

```bash
node tests/test_reporting_elevation.js
```

Expected:

```
PASS: Dashboard premium elevation assertions passed
```

If any assertion still fails, fix the specific issue before continuing.

- [ ] **Step 4: Run the type-checker**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 5: Run the production build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ built in` with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/FinancialReportingView.tsx
git commit -m "refactor: strip chart area fills to hairlines, deepen hero parallax to 0.55"
```

---

## Task 8: Responsive Breakpoints for the Metrics Rail

**Files:**
- Modify: `src/design-tokens.css` (responsive block at end of file, ~lines 623–654)
- Test: `tests/test_reporting_elevation.js`

- [ ] **Step 1: Replace the `@media (max-width: 1024px)` block**

Find and replace the entire responsive block at the bottom of `src/design-tokens.css`:

```css
@media (max-width: 1024px) {
  .dashboard__body {
    grid-template-columns: 1fr;
  }

  .metrics-rail {
    flex-wrap: wrap;
  }

  .metrics-rail__item {
    flex: 1 1 calc(33.333% - 1px);
    border-right: none;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .metrics-rail__item--primary {
    flex: 1 1 100%;
    border-bottom: 1px solid var(--color-border-subtle);
  }

  .sidebar {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .metrics-rail__item {
    flex: 1 1 calc(50% - 1px);
  }

  .metrics-rail__item--primary {
    flex: 1 1 100%;
  }

  .hero__media {
    height: 70vh;
  }

  .t-property-name {
    font-size: 40px;
  }

  .status-band {
    flex-direction: column;
    gap: 24px;
  }

  .site-footer__inner {
    flex-direction: column;
    gap: 24px;
  }

  .supervision-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Run assertions and build**

```bash
node tests/test_reporting_elevation.js && npm run build 2>&1 | tail -5
```

Expected: `PASS: Dashboard premium elevation assertions passed` followed by `✓ built in`.

- [ ] **Step 3: Final commit**

```bash
git add src/design-tokens.css tests/test_reporting_elevation.js
git commit -m "feat: responsive metrics-rail breakpoints + all elevation tests passing"
```

---

## Self-Review

**Spec coverage:**
- [x] Remove `.stat-card` (identical card grids ban) — Tasks 2, 4, 5
- [x] Remove `arrival-item::before` (side-stripe ban) — Task 2
- [x] Remove glassmorphism as default on stat cards — Task 2 (deletion)
- [x] Introduce `.metrics-rail` editorial primitive — Task 3
- [x] Introduce `.arrival-row` typographic primitive — Task 3, 6
- [x] Strip chart area fills to hairlines — Task 7
- [x] Deepen hero parallax — Task 7
- [x] Responsive breakpoints for new layout — Task 8
- [x] TDD: failing tests written before any implementation — Task 1
- [x] Tests cover every removal and every addition

**Placeholder scan:** None. Every step contains exact file paths, exact code blocks, or exact commands with expected output.

**Type consistency:**
- `MetricItem` props defined in Task 4, used identically in Task 5
- `arrival-row__type--owner` class defined in Task 3, applied in Task 6
- `metrics-rail__delta--positive/neutral/negative` defined in Task 3, referenced in Task 4
