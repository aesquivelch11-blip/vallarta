# Animate Motion Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove tacky `animate-bounce` classes and replace them with smooth, high-end exponential ease-out transitions to reflect a calm, luxury brand.

**Architecture:** We will use a Node.js assertion script to verify the removal of `animate-bounce` from `FinancialDeepDiveView.tsx` before and after modifications.

**Tech Stack:** React, Tailwind CSS, Node.js (for simple TDD test scripts).

---

### Task 1: Fix Elastic Motion in Financial Deep Dive

**Files:**
- Create: `tests/test_deepdive_animate.js`
- Modify: `src/components/FinancialDeepDiveView.tsx`

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_deepdive_animate.js
import fs from 'fs';
import assert from 'assert';

const content = fs.readFileSync('src/components/FinancialDeepDiveView.tsx', 'utf-8');
assert.strictEqual(content.includes('animate-bounce'), false, 'FinancialDeepDiveView should not contain animate-bounce');
console.log('PASS: FinancialDeepDiveView motion is refined');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_deepdive_animate.js`
Expected: FAIL with "AssertionError: FinancialDeepDiveView should not contain animate-bounce"

- [ ] **Step 3: Write minimal implementation**

Modify `src/components/FinancialDeepDiveView.tsx`.
1. Locate `animate-bounce` on the button or element (line ~289).
2. Remove `animate-bounce`.
3. If entry motion is desired, replace it with `animate-fade-in` (if configured) or rely on the existing `transition-all` with a custom easing utility if needed, but primarily just remove the bounce.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_deepdive_animate.js`
Expected: PASS: FinancialDeepDiveView motion is refined

- [ ] **Step 5: Commit**

```bash
git add tests/test_deepdive_animate.js src/components/FinancialDeepDiveView.tsx
git commit -m "refactor: remove tacky bounce animation from deep dive view"
```
