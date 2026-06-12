# Phase 5: Operations — TaskList + Chronicle Polish

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execute phases in order.

**Goal:** Add staggered motion entrance to TaskList items and improve ChronicleTimeline visual rhythm. DashboardOperations.tsx gets a motion wrapper for its own sections.

**Architecture:** TaskList.tsx wraps each `<li>` in a `motion.li` with stagger. ChronicleTimeline.tsx wraps each entry in a `motion.div` with stagger. DashboardOperations.tsx adds a simple outer motion wrapper and removes `height: '100%', overflow: 'hidden'` (Phase 2 owns scrolling). No props changes, no structure changes — only motion added.

**Tech Stack:** Vite + React 18 + TypeScript, motion/react v12

**Prerequisites:** Phase 1 + Phase 2 + Phase 3 + Phase 4 complete and committed.

---

## Project Context

### Files to modify
1. `src/components/Dashboard/TaskList.tsx`
2. `src/components/Dashboard/ChronicleTimeline.tsx`
3. `src/components/Dashboard/DashboardOperations.tsx`

### Stagger pattern (same as Phase 3 + 4, but lighter for list items)

```typescript
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};
```

List items use shorter duration (0.4s vs 0.55s) and tighter delay (0.06s vs 0.08s) since they're smaller elements — feels appropriately lighter than section-level stagger.

### TaskList current structure
`visible.map((task, i) => <li key={task.id} ...>)` — wrap in `motion.li` with `custom={i}`.

### ChronicleTimeline current structure
`events.map((event, i) => <div key={event.id} ...>)` — wrap in `motion.div` with `custom={i}`.

### DashboardOperations current problems
1. `height: '100%', overflow: 'hidden'` — prevents natural scroll, Phase 2 owns scrolling
2. No motion wrapper
3. `flex: 1, minHeight: 0, overflowY: 'auto'` on TaskList inner div — can simplify to just `overflowY: 'auto'`

---

## Task 1: Add stagger motion to TaskList

**File:** `src/components/Dashboard/TaskList.tsx`

- [ ] **Step 1: Add `motion` import**

Add `import { motion } from 'motion/react';` after the existing React import.

- [ ] **Step 2: Add `itemVariants` constant before the component**

```typescript
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};
```

- [ ] **Step 3: Change `<ol>` to wrap items in `motion.li`**

Find the `<ol>` block (currently around line 29). The inner `{visible.map((task, i) => (<li key={task.id} style={{...}}>` needs to change to `motion.li` with variants:

Replace the map callback so each `<li>` becomes:

```tsx
{visible.map((task, i) => (
  <motion.li
    key={task.id}
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    custom={i}
    style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      paddingTop: i === 0 ? 0 : '14px',
      paddingBottom: '14px',
      borderBottom: i < visible.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
      borderLeft: task.status === 'urgent' ? '2px solid var(--color-accent-warning)' : '2px solid transparent',
      paddingLeft: task.status === 'urgent' ? '12px' : '14px',
      background: task.status === 'urgent' ? 'var(--color-accent-warning-bg)' : 'transparent',
      marginLeft: task.status === 'urgent' ? '-2px' : '0',
      borderRadius: task.status === 'urgent' ? '0 4px 4px 0' : '0',
    }}
  >
    {/* inner content unchanged */}
  </motion.li>
))}
```

Keep all inner content (`<span>` ordinal number + `<div>` with description and status) exactly as-is — only the `<li>` tag changes to `<motion.li>`.

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output.

---

## Task 2: Add stagger motion to ChronicleTimeline

**File:** `src/components/Dashboard/ChronicleTimeline.tsx`

- [ ] **Step 1: Add `motion` import**

Add `import { motion } from 'motion/react';` after the existing React import.

- [ ] **Step 2: Add `itemVariants` constant before component**

Same as Task 1 — identical `itemVariants` object.

- [ ] **Step 3: Wrap each event in `motion.div`**

Find the `events.map((event, i) => (<div key={event.id} style={{...}}>` block and change `<div>` → `<motion.div>`:

```tsx
{events.map((event, i) => (
  <motion.div
    key={event.id}
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    custom={i}
    style={{
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      padding: '8px 0',
      borderBottom: i < events.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
    }}
  >
    {/* inner content unchanged — dot + connector + text */}
  </motion.div>
))}
```

Keep all inner content (dot, connector line, timestamp, description) exactly as-is.

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output.

---

## Task 3: Simplify DashboardOperations

**File:** `src/components/Dashboard/DashboardOperations.tsx`

Current content (full file):

```typescript
import React from 'react';
import { ScreenType } from '../../types';
import { DashboardData } from './dashboardData';
import TaskList from './TaskList';
import ChronicleTimeline from './ChronicleTimeline';

interface DashboardOperationsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardOperations({ data, onNavigate }: DashboardOperationsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)', gap: 'clamp(1.5rem, 3vw, 2rem)', overflow: 'hidden' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <TaskList tasks={data.tasks} />
      </div>
      <ChronicleTimeline events={data.guestLog} />
    </div>
  );
}
```

- [ ] **Step 1: Replace the entire file content**

```typescript
import React from 'react';
import { ScreenType } from '../../types';
import { DashboardData } from './dashboardData';
import TaskList from './TaskList';
import ChronicleTimeline from './ChronicleTimeline';

interface DashboardOperationsProps {
  data: DashboardData;
  onNavigate: (screen: ScreenType, style: 'push' | 'push_back' | 'slide_up') => void;
}

export default function DashboardOperations({ data }: DashboardOperationsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(1.25rem, 2.5vw, 2rem) clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)',
        gap: 'clamp(2rem, 4vw, 3rem)',
      }}
    >
      <TaskList tasks={data.tasks} />
      <ChronicleTimeline events={data.guestLog} />
    </div>
  );
}
```

Key changes:
1. Removed `height: '100%'` and `overflow: 'hidden'` — Phase 2 owns scrolling
2. Removed `<div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>` wrapper around TaskList
3. Removed `onNavigate` from destructuring (unused in Operations) — keep in props interface in case parent passes it

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output. (If `onNavigate` removal causes type errors, keep it in the function signature but just don't use it.)

---

## Task 4: Visual verification + commit

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Navigate to Dashboard → Tasks tab.

**TaskList:**
- [ ] Task items stagger in from bottom (y: 10 → 0) with subtle opacity entrance
- [ ] Urgent task (left border + warning background) still renders correctly
- [ ] Stagger delay is subtle — items feel like they enter as a group, not one-by-one

**ChronicleTimeline:**
- [ ] Chronicle entries stagger in similarly
- [ ] Timeline connector lines between dots still render correctly

**Operations overall:**
- [ ] Content can scroll if task list is long (no overflow: hidden)
- [ ] Layout uses full column width with correct padding

- [ ] **Step 2: Test all three domain tabs work cleanly**

- [ ] Today tab: stagger entrance, large occupancy
- [ ] Financials tab: NET dominant, two-column grid
- [ ] Tasks tab: task list stagger, chronicle stagger

- [ ] **Step 3: Commit all three files**

```bash
git add src/components/Dashboard/TaskList.tsx src/components/Dashboard/ChronicleTimeline.tsx src/components/Dashboard/DashboardOperations.tsx
git commit -m "feat(operations): stagger motion on task list and chronicle entries"
```

---

## Expected Visual Outcome

| Before | After |
|--------|-------|
| Task items appear instantly | Items stagger in from y+10, 0.06s between each |
| Chronicle events appear instantly | Chronicle entries stagger in similarly |
| Operations uses `height: 100%, overflow: hidden` | Natural layout — Phase 2 scroll context owns it |
| TaskList inner div: `flex: 1, minHeight: 0, overflowY: auto` | TaskList rendered directly without wrapper div |

---

## Final Verification Checklist (all 5 phases)

After Phase 5 is committed, verify the full system:

- [ ] Gallery (Phase 1): full-bleed, cinematic grade, property name overlay, crossfade transition
- [ ] Nav (Phase 2): unified horizontal text tabs, spring sliding indicator, no icon strip
- [ ] Today (Phase 3): massive occupancy number, stagger entrance, no dividers, italic empty state
- [ ] Financials (Phase 4): NET first and dominant, two-column Revenue/Expenses, stagger entrance
- [ ] Operations (Phase 5): task items stagger, chronicle stagger, no overflow clip
- [ ] Dark mode: toggle in header — verify all five domains look correct in dark mode
- [ ] Mobile (< 1024px): gallery strip at top, horizontal tab nav, all content scrollable

**All 5 phases complete — dashboard redesign done.**
