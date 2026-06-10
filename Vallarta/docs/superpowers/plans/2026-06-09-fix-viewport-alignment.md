# Fix: Viewport Content Alignment

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Eliminate dead space at the top of all dashboard domains. Content must align to the top of the viewport, not float in the middle.

**Architecture:** Audit and fix padding/alignment in DashboardView.tsx and all domain components. The content area must use `justify-content: flex-start` with minimal top padding.

**Tech Stack:** React 19, CSS flexbox

---

## Problem Statement

**Current behavior:** Domain content (Today, Financials, Tasks) is positioned in the vertical middle of the viewport with ~40% dead space above it.

**Expected behavior:** Content starts at the top of the viewport with consistent padding (same as the header bar padding: `0 clamp(1.5rem, 3vw, 2.5rem)`).

---

## Root Cause

In `DashboardView.tsx`, the content container:
```tsx
<div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
```

This is a flex column. By default, flex items align to `stretch`. But the domain components (DashboardToday, DashboardFinancials, etc.) have `height: 100%` and use flex column with gaps, which centers content if the total height is less than 100%.

The fix: Remove `height: 100%` from domain components and let them flow naturally, or change to `justify-content: flex-start`.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Dashboard/DashboardView.tsx` | Content area alignment |
| `src/components/Dashboard/DashboardToday.tsx` | Remove top padding, align to top |
| `src/components/Dashboard/DashboardFinancials.tsx` | Remove top padding, align to top |
| `src/components/Dashboard/DashboardTasks.tsx` | Remove top padding, align to top |

---

### Task 1: Fix DashboardView Content Area

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

**Change:** Add `justifyContent: 'flex-start'` to the content area container.

```tsx
{/* Domain content */}
<div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
  <DashboardErrorBoundary>
    {renderDomain()}
  </DashboardErrorBoundary>
</div>
```

---

### Task 2: Fix DashboardToday Top Padding

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

**Change:** Remove top padding from the main container. Keep horizontal padding.

```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)', gap: 'clamp(1rem, 2vw, 1.5rem)', overflow: 'hidden', justifyContent: 'flex-start' }}>
```

**Note:** Changed `padding: 'clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem)'` to `padding: '0 clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2rem)'` (top padding = 0, keep horizontal, keep bottom).

---

### Task 3: Fix DashboardFinancials Top Padding

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx`

**Change:** Remove top padding, align to top.

```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)', gap: 'clamp(1.5rem, 3vw, 2rem)', justifyContent: 'flex-start' }}>
```

---

### Task 4: Fix DashboardTasks Top Padding

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx` (or DashboardOperations.tsx)

**Change:** Remove top padding, align to top.

```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0 clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 4vw, 3rem)', gap: 'clamp(1.5rem, 3vw, 2rem)', overflow: 'hidden', justifyContent: 'flex-start' }}>
```

---

### Task 5: Visual Verification

**Checklist:**
- [ ] Today domain: Property Title Card starts at top of content area, no dead space above
- [ ] Financials domain: Revenue/Expenses/Net starts at top of content area
- [ ] Tasks domain: Task list starts at top of content area
- [ ] All domains have consistent left/right padding matching header bar
- [ ] No content is cut off at bottom
- [ ] `npx tsc --noEmit` passes

---

## Self-Review

- [x] All 3 domain components updated
- [x] Content area uses `justify-content: flex-start`
- [x] Top padding removed from all domains
- [x] No placeholders
