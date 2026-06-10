# Phase 4: Cleanup — Dead Code, Verification, and Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up all dead imports in DashboardView.tsx, delete the remaining unused chart component files, run the full test suite, and perform a manual AI slop audit. This phase ensures the codebase is clean and consistent after Phases 1-3. This phase depends on Phases 1-3 (all components already deleted or rewritten).

**Architecture:** Import cleanup in DashboardView.tsx. File deletion for orphaned chart components. Full test suite run. Manual audit checklist. No new code is written — only deletions, import fixes, and verification.

**Tech Stack:** React 18, TypeScript, Vitest + @testing-library/react, CSS custom properties

**Design Principles:**
- **$impeccable distill**: Remove unused code. Flatten component trees.
- **$impeccable layout**: Verify no arbitrary spacing values remain. Confirm spacing system is consistent.
- **$impeccable critique**: AI slop audit — check for remaining generic patterns.

---

## File Map

| File | Responsibility | Action |
|---|---|---|
| `src/components/Dashboard/DashboardView.tsx` | Top-level layout — clean imports | **Modify** |
| `src/components/Dashboard/DashboardTasks.tsx` | Tasks domain — remove unused imports | **Modify** |
| `src/components/Dashboard/ExpenseBreakdownChart.tsx` | Orphaned chart file | **Delete** |
| `src/components/Dashboard/RevenueTrajectoryChart.tsx` | Orphaned chart file | **Delete** |
| `src/components/Dashboard/OccupancyHeatmap.tsx` | Orphaned chart file | **Delete** |

---

## Task 1: Clean up DashboardView.tsx imports

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**What to check:**
- Remove any imports of deleted components (MetricCard, MetricGrid, StatusCards, UrgentAlert, GuestFlowStrip, PropertyTitleCard, RevparSnapshot)
- Verify no deleted chart components are imported
- Keep all imports that are still used (DashboardGallery, DashboardDomainNav, DashboardToday, DashboardFinancials, DashboardOperations, DashboardErrorBoundary, DarkModeToggle, AmbientProvider, motion)

- [ ] **Step 1: Read the current imports in DashboardView.tsx**

Open `src/components/Dashboard/DashboardView.tsx` and check the import block (lines 1-14). Verify the import list matches:

```tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScreenType } from '../../types';
import { sampleProperties } from '../PropertySelector/propertyData';
import { getDashboardData } from './dashboardData';
import DashboardGallery from './DashboardGallery';
import DashboardDomainNav, { Domain } from './DashboardDomainNav';
import DashboardToday from './DashboardToday';
import DashboardFinancials from './DashboardFinancials';
import DashboardOperations from './DashboardOperations';
import DashboardErrorBoundary from './DashboardErrorBoundary';
import DarkModeToggle from './DarkModeToggle';
import { AmbientProvider } from './AmbientColorProvider';
import { motion } from 'motion/react';
```

If any deleted component is still imported, remove it. If the import list already matches the above, skip to Step 2.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardView.tsx
git commit -m "chore: clean up DashboardView imports after redesign"
```

---

## Task 2: Clean up DashboardTasks.tsx imports

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx`

**What to check:**
- Remove any imports of deleted components
- The current DashboardTasks.tsx imports: `React`, `ArrowRight`, `ScreenType`, `DashboardData`, `DashboardTask`
- Verify no `UrgentAlert`, `StatusCards`, or other deleted component is imported

- [ ] **Step 1: Read the current imports in DashboardTasks.tsx**

Open `src/components/Dashboard/DashboardTasks.tsx` and check the import block. If any deleted component is imported, remove it.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardTasks.tsx
git commit -m "chore: clean up DashboardTasks imports after redesign"
```

---

## Task 3: Delete orphaned chart component files

**Files:**
- Delete: `src/components/Dashboard/ExpenseBreakdownChart.tsx`
- Delete: `src/components/Dashboard/RevenueTrajectoryChart.tsx`
- Delete: `src/components/Dashboard/OccupancyHeatmap.tsx`

- [ ] **Step 1: Delete the files**

```bash
rm src/components/Dashboard/ExpenseBreakdownChart.tsx
rm src/components/Dashboard/RevenueTrajectoryChart.tsx
rm src/components/Dashboard/OccupancyHeatmap.tsx
```

- [ ] **Step 2: Search for any remaining imports**

```bash
rtk grep "ExpenseBreakdownChart\|RevenueTrajectoryChart\|OccupancyHeatmap" src/
```

Expected: No matches.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete unused chart components (ExpenseBreakdownChart, RevenueTrajectoryChart, OccupancyHeatmap)"
```

---

## Task 4: Run full test suite

- [ ] **Step 1: Run all tests**

Run: `rtk vitest run`

Expected: All tests pass.

- [ ] **Step 2: Fix any failing tests**

If any tests fail:
1. Read the error message
2. Identify the failing file
3. Fix the code or test
4. Re-run `rtk vitest run`
5. Repeat until all pass

Common issues to check:
- DashboardView tests may reference deleted components
- Any test that checks for `MetricGrid`, `StatusCards`, `UrgentAlert`, etc. should be updated or removed
- Snapshot tests may need updating if they captured the old UI

- [ ] **Step 3: Commit**

```bash
git commit -m "test: verify all dashboard tests pass after redesign"
```

---

## Task 5: Manual AI slop audit

- [ ] **Step 1: Audit DashboardToday.tsx**

Check for these tells:
- [ ] No card components with borders, backgrounds, or `border-radius` > 4px
- [ ] No gradient text or gradient backgrounds
- [ ] No side-stripe borders (`borderLeft` > 1px as accent)
- [ ] No identical card grids (icon + heading + text, repeated)
- [ ] No hero-metric template (big number + small label + supporting stats + gradient)
- [ ] No generic badges or trend indicators (dots, colored pills)
- [ ] No sparklines or line charts
- [ ] No `AnimatedFigure` or `useCountUp` animations
- [ ] Typography hierarchy is clear: one dominant element (occupancy), subordinate elements (arrivals, departures)
- [ ] Spacing is intentional: tight within sections, generous between sections

- [ ] **Step 2: Audit DashboardFinancials.tsx**

Check for the same tells as above, plus:
- [ ] No bar charts, line charts, or heatmaps
- [ ] No progress bars or budget indicators
- [ ] No `ExpenseBreakdownChart`, `RevenueTrajectoryChart`, or `OccupancyHeatmap` references
- [ ] P&L sequence is clear: Revenue → Expenses → Net
- [ ] Net is visually dominant (largest figure, separated by divider)
- [ ] Negative Net uses muted warm red, not alarming bright red

- [ ] **Step 3: Audit DashboardGallery.tsx**

Check for:
- [ ] No gradient overlay on images
- [ ] No property name text overlay on images
- [ ] No circular hover chevron buttons
- [ ] No dot navigation strip
- [ ] Counter is present and minimal
- [ ] Image transitions with lateral slide (not crossfade)

- [ ] **Step 4: Audit DashboardView.tsx**

Check for:
- [ ] No imports of deleted components
- [ ] No references to `MetricGrid`, `StatusCards`, `UrgentAlert`, etc.
- [ ] Layout is clean: header → domain nav → domain content → gallery
- [ ] No unnecessary nesting or containers

- [ ] **Step 5: Document audit results**

If all checks pass, create a summary:

```
AI Slop Audit — PASSED
Date: 2026-06-10
Components audited: DashboardToday, DashboardFinancials, DashboardGallery, DashboardView
Generic patterns found: 0
Remaining slop components: 0
Status: CLEAN
```

If any checks fail, note the file and the specific pattern, then create a follow-up task to fix it.

- [ ] **Step 6: Commit audit results**

```bash
git commit --allow-empty -m "review: AI slop audit passed — no generic patterns detected"
```

---

## Task 6: Final verification — dev server smoke test

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Smoke test the dashboard**

Navigate to the dashboard (select a property from the PropertySelector).

Verify visually:
- [ ] Today tab loads without errors
- [ ] Occupancy figure is large and prominent
- [ ] Arrivals and departures are listed as text, not cards
- [ ] No sparklines, badges, or alerts visible
- [ ] Financials tab loads without errors
- [ ] Revenue, Expenses, Net are displayed as figures
- [ ] No charts or bars visible
- [ ] Gallery shows property image without gradient overlay
- [ ] No chevron buttons or dot navigation on gallery
- [ ] Counter is visible in gallery

- [ ] **Step 3: Check browser console**

Open browser DevTools → Console.

Verify:
- [ ] No React errors (red text in console)
- [ ] No TypeScript compilation errors
- [ ] No missing module errors
- [ ] No `undefined` or `null` access errors

- [ ] **Step 4: Stop dev server**

Press `Ctrl+C` to stop the dev server.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "review: dev server smoke test passed — dashboard loads cleanly"
```

---

## Self-Review

### Spec Coverage

| Requirement | Task | Covered |
|---|---|---|
| Clean DashboardView imports | Task 1 | ✅ |
| Clean DashboardTasks imports | Task 2 | ✅ |
| Delete ExpenseBreakdownChart | Task 3 | ✅ |
| Delete RevenueTrajectoryChart | Task 3 | ✅ |
| Delete OccupancyHeatmap | Task 3 | ✅ |
| Run full test suite | Task 4 | ✅ |
| Manual AI slop audit | Task 5 | ✅ |
| Dev server smoke test | Task 6 | ✅ |

### Placeholder Scan

- No "TBD", "TODO", or placeholders.
- All steps contain actual commands and expected outputs.
- No references to undefined types or functions.

### Type Consistency

- No new types introduced in this phase.
- All deletions are verified by TypeScript compilation.
- Import cleanup does not change any component interfaces.

---

## Execution Handoff

**Plan complete.**

**Execution options:**

**1. Subagent-Driven** — Dispatch a subagent to execute this phase.

**2. Inline Execution** — Execute all tasks in this session.

**Which approach?**
