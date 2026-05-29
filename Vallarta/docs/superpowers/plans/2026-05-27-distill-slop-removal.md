# Distill Slop Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip generic AI-generated glassmorphism (`backdrop-blur-md`), fake gradients, and side-borders from the components to achieve a cleaner, intentional luxury look.

**Architecture:** We will use simple Node.js assertion scripts to verify the removal of offensive Tailwind classes before and after modifying the React components.

**Tech Stack:** React, Tailwind CSS, Node.js (for simple TDD test scripts).

---

### Task 1: Remove Slop from LoginView

**Files:**
- Create: `tests/test_login_distill.js`
- Modify: `src/components/LoginView.tsx`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_login_distill.js
import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');
assert.strictEqual(content.includes('backdrop-blur-md'), false, 'LoginView should not contain backdrop-blur-md');
assert.strictEqual(content.includes('bg-gradient-to-r'), false, 'LoginView should not contain bg-gradient-to-r');
console.log('PASS: LoginView is clean');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_login_distill.js`
Expected: FAIL with "AssertionError: LoginView should not contain backdrop-blur-md"

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/LoginView.tsx`.
1. Remove `backdrop-blur-md` from the `<header>` and `<footer>` elements (lines ~42, ~164).
2. Delete or comment out the `<div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r...` element entirely (line ~77).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_login_distill.js`
Expected: PASS: LoginView is clean

- [ ] **Step 5: Commit**

```bash
git add tests/test_login_distill.js src/components/LoginView.tsx
git commit -m "refactor: remove glassmorphism and gradient slop from LoginView"
```

### Task 2: Remove Slop from CalendarView

**Files:**
- Create: `tests/test_calendar_distill.js`
- Modify: `src/components/CalendarView.tsx`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_calendar_distill.js
import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/CalendarView.tsx', 'utf-8');
assert.strictEqual(content.includes('backdrop-blur-md'), false, 'CalendarView should not contain backdrop-blur-md');
assert.strictEqual(content.includes('border-l-4'), false, 'CalendarView should not contain side-borders');
console.log('PASS: CalendarView is clean');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_calendar_distill.js`
Expected: FAIL with AssertionError

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/CalendarView.tsx`.
1. Remove `backdrop-blur-md` from the `<header>` (line ~71).
2. Remove `border-l-4 border-amber-400` from the interactive notes box (line ~211). Consider adding a subtle background tint instead like `bg-stone-900/95` if contrast is needed.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_calendar_distill.js`
Expected: PASS: CalendarView is clean

- [ ] **Step 5: Commit**

```bash
git add tests/test_calendar_distill.js src/components/CalendarView.tsx
git commit -m "refactor: remove glassmorphism and side border from CalendarView"
```

### Task 3: Remove Slop from Remaining Views

**Files:**
- Create: `tests/test_views_distill.js`
- Modify: `src/components/FinancialReportingView.tsx`
- Modify: `src/components/FinancialDeepDiveView.tsx`
- Modify: `src/components/CameraFeedView.tsx`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_views_distill.js
import fs from 'fs';
import assert from 'assert';

const views = ['FinancialReportingView.tsx', 'FinancialDeepDiveView.tsx', 'CameraFeedView.tsx'];
views.forEach(view => {
  const content = fs.readFileSync(`src/components/${view}`, 'utf-8');
  assert.strictEqual(content.includes('backdrop-blur-md'), false, `${view} should not contain backdrop-blur-md`);
});
console.log('PASS: Remaining views are clean');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_views_distill.js`
Expected: FAIL with AssertionError

- [ ] **Step 3: Write minimal implementation**

Modify the 3 views:
1. `src/components/FinancialReportingView.tsx`: Remove `backdrop-blur-md` from `<header>`.
2. `src/components/FinancialDeepDiveView.tsx`: Remove `backdrop-blur-md` from `<header>` and `<footer>`.
3. `src/components/CameraFeedView.tsx`: Remove `backdrop-blur-md` from `<header>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_views_distill.js`
Expected: PASS: Remaining views are clean

- [ ] **Step 5: Commit**

```bash
git add tests/test_views_distill.js src/components/FinancialReportingView.tsx src/components/FinancialDeepDiveView.tsx src/components/CameraFeedView.tsx
git commit -m "refactor: remove glassmorphism from reporting, deep dive, and camera views"
```
