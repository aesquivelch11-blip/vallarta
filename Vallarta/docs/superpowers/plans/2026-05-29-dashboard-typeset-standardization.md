# Dashboard Typeset Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dashboard page's typeset consistent with the calendar page's typeset, which is the reference. Calendar uses `var(--font-display)` only for large prominent titles, `var(--font-ui)` for everything else, and `var(--font-mono)` for nothing. No italics anywhere.

**Architecture:** Single-file CSS changes in `src/design-tokens.css` — 15 token class edits across 3 groups (remove italics, standardize label fonts from mono to UI, normalize label sizing/tracking). No component file changes unless Groups 4–5 are included.

**Tech Stack:** React 19, TypeScript, Vanilla CSS, Vite 6

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/design-tokens.css` | All 15 CSS token edits (italics removal, font-family changes, sizing/tracking normalization) |
| Verify | `src/components/FinancialReportingView.tsx` | Read-only check: confirm no inline `font-style: italic` or hardcoded font-family styles |
| Verify | `src/components/FinancialReportingView.tsx` | Optional: replace 4 inline `t-mono` usages with `t-caption` or `t-metric-label` (Group 5 only) |

---

## Task 1: Remove Italics (5 classes)

**Files:**
- Modify: `src/design-tokens.css` (5 locations)

The calendar page uses zero italics. The dashboard has 5 classes with `font-style: italic` that must be removed.

- [ ] **Step 1: Remove italic from `.t-wordmark`**

```css
/* OLD */
.t-wordmark {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 400;
  font-style: italic;
  letter-spacing: 0.04em;
  line-height: 1;
}

/* NEW */
.t-wordmark {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1;
}
```

- [ ] **Step 2: Remove italic from `.metrics-rail__value`**

```css
/* OLD */
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

/* NEW */
.metrics-rail__value {
  font-family: var(--font-display);
  font-size: clamp(32px, 3vw, 44px);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 3: Remove italic from `.arrival-row__name`**

```css
/* OLD */
.arrival-row__name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  font-style: italic;
  color: var(--color-ink);
  line-height: 1.2;
}

/* NEW */
.arrival-row__name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  color: var(--color-ink);
  line-height: 1.2;
}
```

- [ ] **Step 4: Remove italic from `.camera-feed__title`**

```css
/* OLD */
.camera-feed__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: #fff;
  margin-top: 4px;
}

/* NEW */
.camera-feed__title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  margin-top: 4px;
}
```

- [ ] **Step 5: Remove italic from `.site-footer__wordmark`**

```css
/* OLD */
.site-footer__wordmark {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: var(--color-ink);
  letter-spacing: 0.04em;
}

/* NEW */
.site-footer__wordmark {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-ink);
  letter-spacing: 0.04em;
}
```

- [ ] **Step 6: Verify no italics remain in dashboard tokens**

```bash
findstr /n "font-style: italic" src/design-tokens.css
```

Expected: no output (no matches found).

- [ ] **Step 7: Commit**

```bash
git add src/design-tokens.css
git commit -m "typeset: remove all italic from dashboard token classes"
```

---

## Task 2: Standardize Label Fonts — Mono to UI (5 classes)

**Files:**
- Modify: `src/design-tokens.css` (5 locations)

The calendar page uses `var(--font-ui)` for ALL labels, badges, meta text, and status. The dashboard incorrectly uses `var(--font-mono)` for 5 label classes. Change each to `var(--font-ui)`.

- [ ] **Step 1: Change `.metrics-rail__label` font-family**

```css
/* OLD */
.metrics-rail__label {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 10px;
}

/* NEW */
.metrics-rail__label {
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-bottom: 10px;
}
```

- [ ] **Step 2: Change `.metrics-rail__delta` font-family**

```css
/* OLD */
.metrics-rail__delta {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 8px;
}

/* NEW */
.metrics-rail__delta {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 8px;
}
```

- [ ] **Step 3: Change `.arrival-row__meta` font-family**

```css
/* OLD */
.arrival-row__meta {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-top: 5px;
}

/* NEW */
.arrival-row__meta {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  margin-top: 5px;
}
```

- [ ] **Step 4: Change `.arrival-row__type` font-family**

```css
/* OLD */
.arrival-row__type {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  align-self: center;
}

/* NEW */
.arrival-row__type {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  align-self: center;
}
```

- [ ] **Step 5: Change `.camera-feed__label` font-family**

```css
/* OLD */
.camera-feed__label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* NEW */
.camera-feed__label {
  font-family: var(--font-ui);
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

- [ ] **Step 6: Verify no dashboard label classes use mono**

```bash
findstr /n "font-family: var(--font-mono)" src/design-tokens.css
```

Expected output should ONLY show `.t-mono` and calendar-unrelated mono usages (if any). Dashboard labels should NOT appear.

- [ ] **Step 7: Build check**

```bash
npx vite build 2>&1 | Select-String "error|Error"
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/design-tokens.css
git commit -m "typeset: standardize dashboard label fonts from mono to ui"
```

---

## Task 3: Optional Refinements (Groups 4–5)

**These are NOT part of the core plan.** Implement only if explicitly requested.

### Group 4: Section title and name font-family alignment

| Class | Current | Calendar Reference | Change |
|-------|---------|-------------------|--------|
| `.t-section-header` | `var(--font-ui)`, 24px | `.cal-bookings__title` uses `var(--font-display)` | Optional: change to `var(--font-display)` |
| `.arrival-row__name` | `var(--font-display)`, 17px | `.cal-booking-row__guest` uses `var(--font-ui)` | Optional: change to `var(--font-ui)` |

### Group 5: Component-level inline `t-mono` replacements

In `src/components/FinancialReportingView.tsx`, 4 inline `t-mono` usages should use UI-based classes:

- Line 151: `className="t-mono hero__location"` → `className="t-caption hero__location"`
- Line 227: `className="t-mono text-[#A8A29E]"` → `className="t-caption text-[#A8A29E]"`
- Lines 346, 353, 359, 366: `className="t-mono ..."` (financial summary labels/deltas) → `className="t-metric-label ..."`

---

## Self-Review

### Spec Coverage

| Requirement | Task |
|------------|------|
| Remove all italics from dashboard | Task 1 (Steps 1–5) |
| Standardize label fonts to UI (not mono) | Task 2 (Steps 1–5) |
| Normalize label size to 10px | Task 2 (Steps 1–4) |
| Normalize label tracking to 0.15em | Task 2 (Steps 1–5) |
| Verify no errors post-change | Task 1 Step 6, Task 2 Step 7 |

### Placeholder Scan

- No TBD/TODO/fill-in-later references.
- Every step includes the exact old→new CSS diff.
- Exact commands and expected outputs provided.
- No references to undefined types or classes.

### Type Consistency

- All edits use `var(--font-ui)`, `var(--font-display)`, `var(--font-mono)` — consistent with `:root` token definitions.
- No font-size, letter-spacing, or font-family values introduced that don't exist elsewhere in the file.
- Color references (`var(--color-ink-muted)`, `var(--color-ink)`) unchanged — consistent.

---

## Execution Options

**Plan saved to:** `docs/superpowers/plans/2026-05-29-dashboard-typeset-standardization.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach?**
