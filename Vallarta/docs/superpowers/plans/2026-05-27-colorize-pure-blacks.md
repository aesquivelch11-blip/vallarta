# Colorize Pure Blacks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all instances of pure black (`bg-black`) and replace them with a rich, tinted neutral (e.g., `bg-stone-900` or `bg-neutral-950`) to maintain a high-end luxury feel.

**Architecture:** We will use simple Node.js assertion scripts to verify the removal of `bg-black` from the affected components before and after modification.

**Tech Stack:** React, Tailwind CSS, Node.js (for simple TDD test scripts).

---

### Task 1: Eliminate pure black in LoginView

**Files:**
- Create: `tests/test_login_colorize.js`
- Modify: `src/components/LoginView.tsx`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_login_colorize.js
import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/LoginView.tsx', 'utf-8');
// Check that bg-black is not used
assert.strictEqual(content.includes('bg-black'), false, 'LoginView should not contain bg-black');
console.log('PASS: LoginView colorization is correct');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_login_colorize.js`
Expected: FAIL with "AssertionError: LoginView should not contain bg-black"

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/LoginView.tsx`.
1. Find all instances of `bg-black`.
2. Replace `bg-black` with `bg-neutral-950` or `bg-stone-900` (e.g., at lines ~137 and ~164).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_login_colorize.js`
Expected: PASS: LoginView colorization is correct

- [ ] **Step 5: Commit**

```bash
git add tests/test_login_colorize.js src/components/LoginView.tsx
git commit -m "style: replace pure black with tinted neutral in LoginView"
```

### Task 2: Eliminate pure black in CameraFeedView and FinancialReportingView

**Files:**
- Create: `tests/test_views_colorize.js`
- Modify: `src/components/CameraFeedView.tsx`
- Modify: `src/components/FinancialReportingView.tsx`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_views_colorize.js
import fs from 'fs';
import assert from 'assert';

const views = ['CameraFeedView.tsx', 'FinancialReportingView.tsx'];
views.forEach(view => {
  const content = fs.readFileSync(`src/components/${view}`, 'utf-8');
  assert.strictEqual(content.includes('bg-black'), false, `${view} should not contain bg-black`);
});
console.log('PASS: Views colorization is correct');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_views_colorize.js`
Expected: FAIL with AssertionError

- [ ] **Step 3: Write minimal implementation**

Modify the views:
1. `src/components/CameraFeedView.tsx`: Replace `bg-black` with `bg-neutral-950`.
2. `src/components/FinancialReportingView.tsx`: Replace `bg-black` with `bg-stone-900`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_views_colorize.js`
Expected: PASS: Views colorization is correct

- [ ] **Step 5: Commit**

```bash
git add tests/test_views_colorize.js src/components/CameraFeedView.tsx src/components/FinancialReportingView.tsx
git commit -m "style: replace pure black with tinted neutral in camera and reporting views"
```
