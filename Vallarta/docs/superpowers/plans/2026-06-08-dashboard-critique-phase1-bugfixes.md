# Dashboard Critique — Phase 1: Bug Fixes & Quick Wins

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the inverted period navigation arrows, remove the broken "VIEW ALL TASKS" button, add focus indicators to dashboard interactive elements, and unify task status color tokens.

**Architecture:** Surgical edits to existing dashboard components. No new files. Each fix is isolated and independently testable.

**Tech Stack:** React, TypeScript, inline styles (matching existing pattern), CSS custom properties from design-tokens.css

---

### Task 1: Fix inverted period navigation arrows

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx:19-25`

The current logic is inverted. `goPrevPeriod` increments the index (going backward in time, which is "previous" in the data array but "forward" temporally). `goNextPeriod` decrements. The mental model should be: left arrow = older period, right arrow = newer period. The fix is to swap the function assignments to the buttons.

- [ ] **Step 1: Swap the arrow button onClick handlers**

In `DashboardFinancials.tsx`, the left `<button>` (line 64) calls `goPrevPeriod` and the right `<button>` (line 92) calls `goNextPeriod`. Swap them:

```tsx
// Line 64 — left arrow (ChevronLeft) should go to newer (next) period
<button
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
  <ChevronLeft size={14} strokeWidth={1.5} />
</button>

// ... label stays the same ...

// Line 92 — right arrow (ChevronRight) should go to older (previous) period
<button
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
  <ChevronRight size={14} strokeWidth={1.5} />
</button>
```

- [ ] **Step 2: Verify the fix**

Run: `npm run dev`
Navigate to the dashboard, click the Financials tab, and verify:
- Left arrow (ChevronLeft) navigates to newer months (May, April, ...)
- Right arrow (ChevronRight) navigates back toward current month (June)
- Arrows disable at boundaries (index 0 and `periods.length - 1`)

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardFinancials.tsx
git commit -m "fix: correct inverted period navigation arrows in financials"
```

---

### Task 2: Remove broken "VIEW ALL TASKS" button

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx:128-153`

The button lies — it says "VIEW ALL TASKS" but `onClick` calls `onNotify?.('Tasks screen coming soon')`. Remove it entirely until the tasks screen exists.

- [ ] **Step 1: Remove the button and the `hasMore` variable**

In `DashboardTasks.tsx`:

1. Remove line 27: `const hasMore = tasks.length > 5;`

2. Remove the entire block at lines 128-153:
```tsx
// Remove this entire block:
{tasks.length > 0 && (
  <button
    onClick={() => onNotify?.('Tasks screen coming soon')}
    style={{...}}
  >
    VIEW ALL TASKS {hasMore && `(${tasks.length})`}
  </button>
)}
```

3. Also remove `onNotify` from the props interface and destructuring since it's no longer used:

```tsx
// Change interface from:
interface DashboardTasksProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

// To:
interface DashboardTasksProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}
```

```tsx
// Change destructuring from:
export default function DashboardTasks({ data, onNavigate, onNotify }: DashboardTasksProps) {

// To:
export default function DashboardTasks({ data, onNavigate }: DashboardTasksProps) {
```

4. Update the call site in `DashboardView.tsx:30`:

```tsx
// Change from:
case 'tasks':
  return <DashboardTasks data={data} onNavigate={onNavigate} onNotify={onNotify} />;

// To:
case 'tasks':
  return <DashboardTasks data={data} onNavigate={onNavigate} />;
```

- [ ] **Step 2: Verify the fix**

Run: `npm run dev`
Navigate to the dashboard, click the Tasks tab, and verify:
- The task list renders normally
- No "VIEW ALL TASKS" button appears
- No errors in console

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardTasks.tsx src/components/Dashboard/DashboardView.tsx
git commit -m "fix: remove broken VIEW ALL TASKS button"
```

---

### Task 3: Add focus-visible indicators to period navigation and nav links

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx` (period arrows)
- Modify: `src/components/Dashboard/DashboardToday.tsx` (VIEW CALENDAR link)
- Modify: `src/components/Dashboard/DashboardTasks.tsx` (remaining button if any)

The period navigation arrows (14px icons with 2px padding) and the "VIEW CALENDAR" / "VIEW FINANCIALS" text links have no `:focus-visible` styles. Add inline focus-visible handling via `onFocus`/`onBlur` style toggling, matching the existing pattern in `DashboardDomainNav.tsx`.

- [ ] **Step 1: Add focus styles to period arrows in DashboardFinancials.tsx**

Wrap the period arrow buttons with a focus-visible style approach. Since the codebase uses inline styles, add an `onFocus`/`onBlur` handler with a local state or use the existing button style pattern. The simplest approach: add `outline` styles directly:

```tsx
// For both period arrow buttons, add to the style object:
':focus-visible': {
  outline: '2px solid var(--color-ink-secondary)',
  outlineOffset: '2px',
  borderRadius: '2px',
}
```

Since inline styles don't support pseudo-selectors, add a CSS class. Add to `src/design-tokens.css`:

```css
/* Dashboard focus utilities */
.dashboard-focus:focus-visible {
  outline: 2px solid var(--color-ink-secondary);
  outline-offset: 2px;
  border-radius: 2px;
}

.dashboard-link:focus-visible {
  outline: 2px solid var(--color-ink-secondary);
  outline-offset: 4px;
  border-radius: 2px;
}
```

Then apply the class to the buttons:

```tsx
// Period arrow buttons — add className:
<button
  className="dashboard-focus"
  onClick={goNextPeriod}
  // ... rest unchanged
>

<button
  className="dashboard-focus"
  onClick={goPrevPeriod}
  // ... rest unchanged
>
```

```tsx
// VIEW FINANCIALS link — add className:
<button
  className="dashboard-link"
  onClick={() => onNavigate('reporting', 'push')}
  // ... rest unchanged
>
```

- [ ] **Step 2: Add focus styles to DashboardToday.tsx nav link**

```tsx
// VIEW CALENDAR link — add className:
<button
  className="dashboard-link"
  onClick={() => onNavigate('calendar', 'push')}
  // ... rest unchanged
>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Tab through the dashboard using keyboard only:
- Period arrows show a visible focus ring when focused
- VIEW CALENDAR / VIEW FINANCIALS links show a visible focus ring
- Focus ring matches the existing domain nav focus style

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardFinancials.tsx src/components/Dashboard/DashboardToday.tsx src/design-tokens.css
git commit -m "fix: add focus-visible indicators to dashboard interactive elements"
```

---

### Task 4: Unify task status color tokens

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx:18-22`
- Modify: `src/design-tokens.css` (add dashboard-specific task tokens)

The `statusColor` map uses a raw `oklch` value for `urgent` while `pending` and `scheduled` use design tokens. Unify them.

- [ ] **Step 1: Add task status tokens to design-tokens.css**

Add inside `:root`:

```css
/* --- Dashboard Task Status --- */
--color-task-urgent: oklch(53% 0.12 25);
--color-task-pending: var(--color-ink-secondary);
--color-task-scheduled: var(--color-ink-muted);
```

- [ ] **Step 2: Update DashboardTasks.tsx to use the new tokens**

```tsx
const statusColor: Record<DashboardTask['status'], string> = {
  urgent: 'var(--color-task-urgent)',
  pending: 'var(--color-task-pending)',
  scheduled: 'var(--color-task-scheduled)',
};
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Check the Tasks tab — urgent tasks should still show the red-tinted color, pending/scheduled unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardTasks.tsx src/design-tokens.css
git commit -m "refactor: unify task status colors with design tokens"
```

---

### Task 5: Remove duplicate `--color-ink-muted` token

**Files:**
- Modify: `src/design-tokens.css:12-13`

`--color-ink-secondary` and `--color-ink-muted` are both `#7e7a74`. The muted variant should be slightly lighter to justify its existence.

- [ ] **Step 1: Adjust --color-ink-muted to be distinct**

```css
/* Change from: */
--color-ink-muted: #7e7a74; /* Weathered Timber — muted text */

/* To: */
--color-ink-muted: #9a9590; /* Weathered Timber muted — lighter for tertiary text */
```

This gives muted text a lighter value while keeping the same warm grey family. The difference is subtle but creates a real hierarchy: ink > secondary > muted.

- [ ] **Step 2: Verify**

Run: `npm run dev`
Scan the dashboard — muted labels (like "tomorrow" hints, status labels on scheduled tasks, period arrow disabled states) should appear slightly lighter than secondary text. The hierarchy should be clear.

- [ ] **Step 3: Commit**

```bash
git add src/design-tokens.css
git commit -m "fix: differentiate --color-ink-muted from --color-ink-secondary"
```
