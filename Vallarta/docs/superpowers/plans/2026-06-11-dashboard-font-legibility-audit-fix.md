# Dashboard Font Size & Legibility Fix

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise all sub-10px text to readable sizes, fix contrast issues, and normalize touch targets across the dashboard.

**Architecture:** Fix two shared `labelStyle` constants to resolve 12+ instances at once, then sweep remaining per-component issues. All changes are inline style adjustments in existing TSX components and one CSS token tweak.

**Tech Stack:** React, TypeScript, inline CSS-in-JS, CSS custom properties

---

## File Map

| File | Changes |
|---|---|
| `DashboardToday.tsx` | Raise `labelStyle`, fix "Departing" override, raise night counts, raise "tomorrow" hints, remove departures opacity |
| `DashboardFinancials.tsx` | Raise `labelStyle`, raise period selector, raise revenue trend text |
| `DashboardDomainNav.tsx` | Raise tab label fontSize |
| `ChronicleTimeline.tsx` | Raise time column fontSize |
| `TrendBadge.tsx` | Raise trend value fontSize |
| `PropertyHealthScore.tsx` | Raise label fontSize |
| `DashboardTasks.tsx` | Raise status labels, remove opacity, normalize body to 0.9375rem |
| `TaskList.tsx` | Raise `labelStyle`, replace opacity map with color |
| `DarkModeToggle.tsx` | Add 44px min touch target |
| `design-tokens.css` | Nudge `--color-ink-secondary` to `#77736d` |

---

### Task 1: Fix shared labelStyle constants (resolves 12+ instances)

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx:29-38`
- Modify: `src/components/Dashboard/DashboardFinancials.tsx:25-33`

- [ ] **Step 1: Raise labelStyle in DashboardToday.tsx**

Change line 31 from `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-secondary)',
  margin: 0,
  lineHeight: 1,
};
```

- [ ] **Step 2: Raise labelStyle in DashboardFinancials.tsx**

Same change at line 27:

```tsx
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-secondary)',
  margin: 0,
};
```

- [ ] **Step 3: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 2: Fix DashboardToday remaining small text

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx:87,151,186,220,249,283,205`

- [ ] **Step 1: Raise trend percent fontSize (line 87)**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'` in the trend percent `<p>`:

```tsx
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color:
                  occDirection === 'up'
                    ? 'var(--color-accent-positive)'
                    : occDirection === 'down'
                      ? 'var(--color-accent-negative)'
                      : 'var(--color-ink-muted)',
                margin: 0,
                opacity: 0.85,
              }}
            >
```

- [ ] **Step 2: Raise guest night count fontSize (line 151)**

Change `fontSize: '0.625rem'` to `fontSize: '0.6875rem'` in the arrivals night-count `<span>`:

```tsx
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.6875rem',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-secondary)',
                    marginLeft: '8px',
                  }}
                >
```

- [ ] **Step 3: Raise "arrivals tomorrow" hint fontSize (line 186)**

Change `fontSize: '0.625rem'` to `fontSize: '0.6875rem'`:

```tsx
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              margin: '8px 0 0',
              lineHeight: 1.4,
            }}
          >
            {arrivalsTomorrow.length}{' '}
            {arrivalsTomorrow.length === 1 ? 'guest arrives' : 'guests arrive'} tomorrow
          </p>
```

- [ ] **Step 4: Fix "Departing" label from 0.5rem to 0.6875rem (line 220)**

Change the spread override from `fontSize: '0.5rem'` to `fontSize: '0.6875rem'`:

```tsx
          <p style={{ ...labelStyle, fontSize: '0.6875rem' }}>Departing</p>
```

- [ ] **Step 5: Raise departures night-count fontSize (line 249)**

Change `fontSize: '0.625rem'` to `fontSize: '0.6875rem'` in the departures night-count `<span>`:

```tsx
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.6875rem',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-ink-secondary)',
                    marginLeft: '8px',
                  }}
                >
```

- [ ] **Step 6: Raise "departs tomorrow" hint fontSize (line 283)**

Change `fontSize: '0.625rem'` to `fontSize: '0.6875rem'`:

```tsx
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              margin: '8px 0 0',
              lineHeight: 1.4,
            }}
          >
            {departuresTomorrow.length}{' '}
            {departuresTomorrow.length === 1 ? 'guest departs' : 'guests depart'} tomorrow
          </p>
```

- [ ] **Step 7: Remove departures section opacity (line 205)**

Change `style={{ opacity: 0.55 }}` to remove the opacity entirely:

```tsx
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
```

- [ ] **Step 8: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 3: Fix DashboardFinancials remaining small text

**Files:**
- Modify: `src/components/Dashboard/DashboardFinancials.tsx:96,160`

- [ ] **Step 1: Raise period selector fontSize (line 96)**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'` in the period label `<span>`:

```tsx
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink)',
              userSelect: 'none',
            }}
          >
```

- [ ] **Step 2: Raise revenue trend text (line 160)**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.6875rem',
                  fontWeight: 400,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  margin: '4px 0 0',
                }}
              >
```

- [ ] **Step 3: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 4: Fix DashboardDomainNav tab labels

**Files:**
- Modify: `src/components/Dashboard/DashboardDomainNav.tsx:63`

- [ ] **Step 1: Raise tab label fontSize**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6875rem',
                fontWeight: isActive ? 500 : 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                background: 'none',
                border: 'none',
                padding: 0,
                height: '100%',
                cursor: 'pointer',
                transition: 'color 0.18s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
```

- [ ] **Step 2: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 5: Fix ChronicleTimeline time column

**Files:**
- Modify: `src/components/Dashboard/ChronicleTimeline.tsx:43`

- [ ] **Step 1: Raise time column fontSize**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.6875rem',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: 'var(--color-ink-muted)',
              fontVariantNumeric: 'tabular-nums',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
```

- [ ] **Step 2: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 6: Fix TrendBadge

**Files:**
- Modify: `src/components/Dashboard/TrendBadge.tsx:26`

- [ ] **Step 1: Raise trend value fontSize**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        letterSpacing: '0.10em',
        color: trendColors[direction],
        lineHeight: 1,
      }}
    >
```

- [ ] **Step 2: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 7: Fix PropertyHealthScore label

**Files:**
- Modify: `src/components/Dashboard/PropertyHealthScore.tsx:49`

- [ ] **Step 1: Raise "Property Health" label fontSize**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--color-ink-secondary)', margin: 0 }}>
        Property Health
      </p>
```

- [ ] **Step 2: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 8: Fix DashboardTasks status labels and normalize body text

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx:112,124,130`

- [ ] **Step 1: Normalize task description fontSize from 0.8125rem to 0.9375rem (line 112)**

Align with TaskList's body text size for consistency:

```tsx
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9375rem',
                    fontWeight: 400,
                    color: 'var(--color-ink)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
```

- [ ] **Step 2: Raise status label fontSize from 0.5625rem to 0.6875rem (line 124)**

```tsx
                <p
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.6875rem',
                    fontWeight: task.status === 'urgent' ? 600 : 400,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: statusColor[task.status],
                    margin: 0,
                  }}
                >
```

- [ ] **Step 3: Remove opacity on non-urgent status labels (line 130)**

Delete the `opacity: task.status === 'urgent' ? 1 : 0.7` line entirely. Status distinction is already conveyed through color and font-weight.

- [ ] **Step 4: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 9: Fix TaskList labelStyle and opacity map

**Files:**
- Modify: `src/components/Dashboard/TaskList.tsx:9-18,20-25`

- [ ] **Step 1: Raise labelStyle fontSize (line 11)**

Change `fontSize: '0.5625rem'` to `fontSize: '0.6875rem'`:

```tsx
const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-secondary)',
  margin: 0,
  lineHeight: 1,
};
```

- [ ] **Step 2: Replace opacity map with color-based differentiation**

Change the opacity map to use explicit colors instead. Replace lines 20-25:

```tsx
// Status drives visual weight via color, not opacity
const colorByStatus: Record<DashboardTask['status'], string> = {
  urgent: 'var(--color-task-urgent)',
  pending: 'var(--color-ink)',
  scheduled: 'var(--color-ink-secondary)',
};
```

Then update line 88 to use the new map:

```tsx
            animate={{ opacity: 1, y: 0 }}
```

And update the description color at line 113 to use status-aware color:

```tsx
                  color: colorByStatus[task.status],
```

- [ ] **Step 3: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 10: Fix DarkModeToggle touch target

**Files:**
- Modify: `src/components/Dashboard/DarkModeToggle.tsx:20-28`

- [ ] **Step 1: Add min-width and min-height for 44px touch target**

```tsx
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-ink-secondary)',
        padding: '4px',
        minWidth: '44px',
        minHeight: '44px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
```

- [ ] **Step 2: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 11: Fix light mode secondary text contrast

**Files:**
- Modify: `src/design-tokens.css:12`

- [ ] **Step 1: Nudge --color-ink-secondary to clear 4.5:1 AA**

Change `#7e7a74` to `#77736d`. This raises the contrast ratio from 4.49:1 to ~4.7:1 on `#faf8f5`.

```css
    --color-ink-secondary: #77736d; /* Weathered Timber — secondary text, WCAG AA compliant */
```

- [ ] **Step 2: Type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

---

### Task 12: Final verification

- [ ] **Step 1: Full type-check**

Run: `rtk npx tsc --noEmit`
Expected: PASS

- [ ] **Step 2: Visual smoke test**

Run: `rtk npm run dev`
Open the dashboard, switch through Today / Financials / Tasks tabs. Verify:
- All labels are readable (no text below 11px / 0.6875rem)
- Status labels in Tasks are legible without opacity tricks
- Departures section in Today is no longer faded
- Dark mode toggle has adequate touch target
- Dark mode still has good contrast

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardToday.tsx src/components/Dashboard/DashboardFinancials.tsx src/components/Dashboard/DashboardDomainNav.tsx src/components/Dashboard/ChronicleTimeline.tsx src/components/Dashboard/TrendBadge.tsx src/components/Dashboard/PropertyHealthScore.tsx src/components/Dashboard/DashboardTasks.tsx src/components/Dashboard/TaskList.tsx src/components/Dashboard/DarkModeToggle.tsx src/design-tokens.css
git commit -m "fix(dashboard): raise sub-10px text to 0.6875rem minimum, fix contrast and touch targets"
```
