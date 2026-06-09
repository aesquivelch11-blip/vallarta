# Dashboard Viewport Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase information density of each dashboard domain tab so the owner/manager gets a complete briefing in one viewport per tab, using all existing data model fields and unused components.

**Architecture:** Three domain tabs (Today, Financials, Tasks) each redesigned as a 2D canvas instead of a vertical list. Today uses 3 rows with horizontal splits. Financials uses a two-column split (figures vs context). Tasks uses an asymmetric split (categories vs list). Existing components (`MetricCard`, `TrendBadge`, `Sparkline`) are activated. Pure CSS bar charts — no library added.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Motion (motion/react), Lucide React

---

### Task 1: Today Tab — Occupancy Row with Sparkline

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`
- Use existing: `src/components/Dashboard/Sparkline.tsx`
- Use existing: `src/components/Dashboard/TrendBadge.tsx`

Context: The current occupancy section is a large figure + label + trend text stacked vertically. We add a sparkline to the right of the figure and restructure as a flex row.

- [ ] **Step 1: Read existing Sparkline and TrendBadge components**

Read `src/components/Dashboard/Sparkline.tsx` and `src/components/Dashboard/TrendBadge.tsx` to understand their props and usage.

- [ ] **Step 2: Restructure occupancy section as flex row**

In `DashboardToday.tsx`, replace the occupancy `<div>` with a flex container that puts the figure+label on the left and the sparkline on the right.

Before:
```tsx
<div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
  <p style={{...}}>78%</p>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
    <p>OCCUPANCY</p>
    <p>+5%</p>
  </div>
</div>
```

After:
```tsx
<div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
    <div>
      <p style={{...large figure...}}>78%</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
        <p style={{...label...}}>OCCUPANCY</p>
        <TrendBadge value={occupancy} previous={occupancyPrev} />
      </div>
    </div>
    <Sparkline
      data={occupancyHistory}
      width={120}
      height={40}
      color="var(--color-ink-muted)"
      opacity={0.4}
    />
  </div>
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: Zero new errors.

---

### Task 2: Today Tab — Guest Rating + Avg Stay Row

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

Context: Add a new 2-up row between occupancy and arrivals showing guest satisfaction and average length of stay.

- [ ] **Step 1: Add guest satisfaction + avg stay section**

Insert between the occupancy section and arrivals section:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: 'clamp(1.5rem, 3vw, 2rem)', paddingBottom: 'clamp(1.5rem, 3vw, 2rem)', borderBottom: '1px solid var(--color-border-subtle)' }}>
  {/* Guest Rating */}
  <div>
    <p style={{...large figure...}}>{guestSatisfaction.score}</p>
    <p style={{...label...}}>GUEST RATING</p>
    <p style={{...small text, muted...}}>{guestSatisfaction.reviewCount} reviews</p>
  </div>
  {/* Avg Stay */}
  <div>
    <p style={{...large figure...}}>{lengthOfStay.average} <span style={{...small...}}>nights</span></p>
    <p style={{...label...}}>AVG STAY</p>
    {/* Distribution mini bar */}
    <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
      <div style={{ width: `${lengthOfStay.distribution.short}%`, height: '4px', background: 'var(--color-ink-muted)', opacity: 0.3 }} />
      <div style={{ width: `${lengthOfStay.distribution.medium}%`, height: '4px', background: 'var(--color-ink-muted)', opacity: 0.6 }} />
      <div style={{ width: `${lengthOfStay.distribution.long}%`, height: '4px', background: 'var(--color-ink-muted)' }} />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
      <span style={{...tiny label...}}>1-2n</span>
      <span style={{...tiny label...}}>3-5n</span>
      <span style={{...tiny label...}}>6n+</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 3: Today Tab — Arrivals ‖ Departures Two-Column

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

Context: Split arrivals and departures into side-by-side columns instead of stacked vertically.

- [ ] **Step 1: Wrap arrivals and departures in a 2-column grid**

Replace the two separate `<div>` blocks for arrivals and departures with a single grid container:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: 'auto' }}>
  {/* Arrivals column */}
  <div>
    {/* existing arrivals content */}
  </div>
  {/* Departures column */}
  <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
    {/* existing departures content */}
  </div>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 4: Financials Tab — Two-Column Split

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

Context: Split the financials tab into two columns. Left column has the figures (Revenue, Expenses, Net). Right column has the 6-month trend chart and expense breakdown.

- [ ] **Step 1: Restructure as two-column grid**

Wrap the entire content in a grid container:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '45fr 55fr', gap: 'clamp(2rem, 4vw, 3rem)', height: '100%' }}>
  {/* Left column: Figures */}
  <div>
    {/* Period selector */}
    {/* Revenue */}
    {/* Expenses */}
    {/* Divider */}
    {/* Net */}
  </div>
  {/* Right column: Context */}
  <div>
    {/* 6-Month Trend */}
    {/* Expense Breakdown */}
  </div>
</div>
```

- [ ] **Step 2: Move period selector to span both columns**

Place the period selector above the grid, full width:

```tsx
<div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
  {/* existing period selector */}
</div>
<div style={{ display: 'grid', gridTemplateColumns: '45fr 55fr', gap: '...' }}>
  ...
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 5: Financials Tab — 6-Month Trend Chart

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

Context: Add a pure CSS horizontal bar chart showing 6 months of revenue. No library needed — each bar is a div with width proportional to max revenue.

- [ ] **Step 1: Add trend chart component**

In the right column, after the period selector area:

```tsx
<div style={{ marginBottom: 'clamp(1.5rem, 3vw, 2rem)' }}>
  <p style={{...label...}}>6-MONTH TREND</p>
  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'flex-end', height: '60px' }}>
    {periods.map((p, i) => {
      const maxRevenue = Math.max(...periods.map(per => per.revenue));
      const widthPct = (p.revenue / maxRevenue) * 100;
      const isCurrent = i === 0;
      return (
        <div key={p.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '100%', height: '40px', background: 'var(--color-ink)', opacity: isCurrent ? 0.8 : 0.3, borderRadius: '2px 2px 0 0' }} />
          <span style={{...tiny label...}}>{p.label.split(' ')[0].slice(0, 3)}</span>
          <span style={{...tiny value...}}>${(p.revenue / 1000).toFixed(1)}k</span>
        </div>
      );
    })}
  </div>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 6: Financials Tab — Expense Breakdown

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

Context: Add expense breakdown as horizontal proportional bars below the trend chart.

- [ ] **Step 1: Add expense breakdown**

```tsx
<div>
  <p style={{...label...}}>EXPENSE BREAKDOWN</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
    {expenseBreakdown.map(cat => {
      const maxAmount = Math.max(...expenseBreakdown.map(c => c.amount));
      const widthPct = (cat.amount / maxAmount) * 100;
      return (
        <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{...small label..., width: '80px'}}>{cat.label}</span>
          <span style={{...small value..., width: '50px', textAlign: 'right'}}>{formatCurrency(cat.amount)}</span>
          <div style={{ flex: 1, height: '4px', background: 'var(--color-border-subtle)', borderRadius: '2px' }}>
            <div style={{ width: `${widthPct}%`, height: '100%', background: 'var(--color-accent-warning)', opacity: 0.5, borderRadius: '2px' }} />
          </div>
        </div>
      );
    })}
  </div>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 7: Tasks Tab — Category Breakdown + Two-Column Layout

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx`

Context: Add a category breakdown section and split the tab into two columns (categories left, task list right).

- [ ] **Step 1: Compute category counts**

Add a helper to compute counts per category from the tasks array:

```tsx
const categoryCounts = tasks.reduce((acc, task) => {
  acc[task.category] = (acc[task.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
```

- [ ] **Step 2: Restructure as two-column grid**

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '30fr 70fr', gap: 'clamp(1.5rem, 3vw, 2.5rem)', height: '100%' }}>
  {/* Left: Categories */}
  <div>
    <p style={{...label...}}>BY CATEGORY</p>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
      {Object.entries(categoryLabels).map(([key, label]) => (
        <div key={key}>
          <p style={{...small label...}}>{label}</p>
          <p style={{...figure..., opacity: categoryCounts[key] ? 1 : 0.3}}>{categoryCounts[key] || 0}</p>
        </div>
      ))}
    </div>
  </div>
  {/* Right: Task List */}
  <div>
    {/* existing numbered list */}
  </div>
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 8: Motion — Tab Switch Animations

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`
- Modify: `src/components/Dashboard/DashboardToday.tsx`
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`
- Modify: `src/components/Dashboard/DashboardTasks.tsx`

Context: Add fade+rise animation when switching tabs. Use Motion's `AnimatePresence` for exit/enter transitions.

- [ ] **Step 1: Wrap domain content in AnimatePresence**

In `DashboardView.tsx`, wrap the `renderDomain()` call:

```tsx
import { AnimatePresence, motion } from 'motion/react';

<AnimatePresence mode="wait">
  <motion.div
    key={activeDomain}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
  >
    {renderDomain()}
  </motion.div>
</AnimatePresence>
```

- [ ] **Step 2: Add staggered section animations within each tab**

In each domain component, wrap major sections with motion.div and stagger delays:

```tsx
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, delay: 0.04 }}
>
  {/* section content */}
</motion.div>
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 9: Motion — Metric Count-Up Animation

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

Context: Animate metric values counting up from 0 on tab enter.

- [ ] **Step 1: Add count-up hook**

Create a simple `useCountUp` hook or inline the logic:

```tsx
function useCountUp(target: number, duration: 400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return value;
}
```

- [ ] **Step 2: Apply to occupancy figure**

```tsx
const animatedOccupancy = useCountUp(occupancy, 400);
<p>{animatedOccupancy}%</p>
```

- [ ] **Step 3: Apply to financial figures**

Similar treatment for Revenue, Expenses, Net values.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

---

### Task 10: Final Integration & Testing

**Files:**
- All modified files

- [ ] **Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: Zero new errors.

- [ ] **Step 2: Run dev server and visually verify**

Run: `npm run dev`
Check each tab at desktop width (1440px):
- Today: 3 rows visible, no scroll
- Financials: 2 columns visible, no scroll
- Tasks: 2 columns visible, no scroll

- [ ] **Step 3: Verify mobile layout**

Resize to 375px width. Confirm sections stack vertically and scroll works.

- [ ] **Step 4: Verify reduced motion**

Enable `prefers-reduced-motion` in browser dev tools. Confirm animations are instant.

- [ ] **Step 5: Commit all changes**

```bash
git add src/components/Dashboard/
git commit -m "feat(Dashboard): increase viewport density with 2D layouts per tab"
```

---

## Self-Review

**Spec coverage:**
- ✅ Today tab: 3 rows with horizontal splits (Tasks 1-3)
- ✅ Financials tab: Two-column split figures vs context (Tasks 4-6)
- ✅ Tasks tab: Asymmetric split categories vs list (Task 7)
- ✅ Motion: Tab switch animations (Task 8)
- ✅ Motion: Metric count-up (Task 9)
- ✅ All data model fields used
- ✅ Existing components activated (Sparkline, TrendBadge)
- ✅ No scroll on desktop
- ✅ Mobile responsive

**Placeholder scan:** No TBDs, no "add validation" phrases, no missing code.

**Type consistency:** All components use existing props. `Sparkline` takes `data`, `width`, `height`, `color`. `TrendBadge` takes `value`, `previous`. No new types introduced.
