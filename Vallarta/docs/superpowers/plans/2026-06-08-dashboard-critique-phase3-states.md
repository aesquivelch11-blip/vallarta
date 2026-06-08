# Dashboard Critique — Phase 3: States & Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add meaningful empty states to each domain tab, add a basic loading skeleton for the dashboard, and improve the "All clear" empty state in Tasks with context.

**Architecture:** Each domain tab gets a conditional empty state when its primary data is absent. A lightweight skeleton is added to DashboardView for the initial render. All states use existing design tokens and typography patterns.

**Tech Stack:** React, TypeScript, inline styles, CSS custom properties

---

### Task 1: Add empty state to Today tab when no activity

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

When there are zero arrivals AND zero departures, the Today tab shows "No arrivals" and "No departures" text with a large dead zone. Add a contextual message that makes this feel intentional rather than broken.

- [ ] **Step 1: Add a "quiet day" message when both lists are empty**

In `DashboardToday.tsx`, after the departures section and before the nav link, add a contextual message when there's no activity:

```tsx
{/* Quiet day message */}
{arrivalsToday.length === 0 && departuresToday.length === 0 && (
  <div
    style={{
      marginTop: 'clamp(1rem, 2vw, 1.5rem)',
      paddingTop: 'clamp(1rem, 2vw, 1.5rem)',
      borderTop: '1px solid var(--color-border-subtle)',
    }}
  >
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        fontWeight: 400,
        color: 'var(--color-ink-secondary)',
        margin: 0,
        lineHeight: 1.5,
      }}
    >
      Quiet day — no arrivals or departures scheduled.
    </p>
    {arrivalsTomorrow.length > 0 && (
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.625rem',
          fontWeight: 400,
          letterSpacing: '0.06em',
          color: 'var(--color-ink-muted)',
          margin: '8px 0 0',
          lineHeight: 1.4,
        }}
      >
        {arrivalsTomorrow.length} {arrivalsTomorrow.length === 1 ? 'guest arrives' : 'guests arrive'} tomorrow.
      </p>
    )}
  </div>
)}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Check with different properties:
- Casa Sol (0 arrivals today, 1 departure) — should NOT show the quiet day message
- A property with 0 arrivals and 0 departures — should show the quiet day message
- If there are tomorrow arrivals, the secondary line appears

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardToday.tsx
git commit -m "feat: add contextual quiet-day message to Today tab"
```

---

### Task 2: Improve Tasks empty state

**Files:**
- Modify: `src/components/Dashboard/DashboardTasks.tsx`

When there are zero tasks, the tab shows "All clear" in large display text with nothing else. Add context — how many tasks were recently completed, or a simple reassurance message.

- [ ] **Step 1: Enhance the empty state**

In `DashboardTasks.tsx`, replace the simple "All clear" with a more informative empty state. The component receives `data` which doesn't include completed task history, so use a simple reassuring message:

Replace the count section (lines 38-53) with:

```tsx
{/* Count */}
<div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
  <p
    style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 400,
      letterSpacing: '-0.01em',
      color: 'var(--color-ink)',
      margin: 0,
      lineHeight: 1,
    }}
  >
    {tasks.length > 0 ? `${tasks.length} open` : 'All clear'}
  </p>
  {tasks.length === 0 && (
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        fontWeight: 400,
        color: 'var(--color-ink-secondary)',
        margin: '10px 0 0',
        lineHeight: 1.5,
      }}
    >
      No pending tasks for this property.
    </p>
  )}
</div>
```

- [ ] **Step 2: Verify**

Run: `npm run dev`
Check with a property that has tasks (Casa Palmeras — 3 tasks) and verify the list renders. If you temporarily set `tasks: []` in the mock data, verify the empty state shows "All clear" with the subtitle.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dashboard/DashboardTasks.tsx
git commit -m "feat: improve Tasks empty state with contextual message"
```

---

### Task 3: Add lightweight loading skeleton to DashboardView

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

The dashboard renders immediately with mock data, but in production there will be a data fetch. Add a minimal skeleton state that shows while data is "loading." Since the current implementation is synchronous (mock data), use a brief mount delay to demonstrate the skeleton.

- [ ] **Step 1: Add a loading state to DashboardView**

Add a `useState` for loading and a `useEffect` to simulate the transition:

```tsx
import React, { useState, useEffect } from 'react';
```

Add state and effect inside the component:

```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => setIsLoading(false), 400);
  return () => clearTimeout(timer);
}, []);
```

- [ ] **Step 2: Create a skeleton placeholder**

Add a skeleton component inside DashboardView, before the `return`:

```tsx
if (isLoading) {
  return (
    <div
      className="w-full"
      style={{
        minHeight: '100dvh',
        background: 'var(--color-canvas)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      {/* Mobile skeleton */}
      <div
        className="lg:hidden"
        style={{
          height: 'clamp(180px, 30vw, 220px)',
          background: 'var(--color-border-subtle)',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
        className="grid-cols-1 lg:grid-cols-[58fr_42fr] lg:h-[100dvh]"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
            gap: '16px',
          }}
        >
          {/* Skeleton lines */}
          <div style={{
            width: '40%',
            height: 'clamp(2rem, 4vw, 3rem)',
            background: 'var(--color-border-subtle)',
            borderRadius: '4px',
            opacity: 0.6,
          }} />
          <div style={{
            width: '60%',
            height: '1rem',
            background: 'var(--color-border-subtle)',
            borderRadius: '4px',
            opacity: 0.4,
          }} />
          <div style={{
            width: '50%',
            height: '1rem',
            background: 'var(--color-border-subtle)',
            borderRadius: '4px',
            opacity: 0.4,
          }} />
          <div style={{
            width: '30%',
            height: '0.75rem',
            background: 'var(--color-border-subtle)',
            borderRadius: '4px',
            opacity: 0.3,
            marginTop: '16px',
          }} />
        </div>
        <div
          className="hidden lg:block"
          style={{
            height: '100dvh',
            background: 'var(--color-border-subtle)',
            opacity: 0.3,
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
On page load, a brief skeleton (400ms) should appear showing placeholder lines, then transition to the real dashboard. The skeleton should match the layout proportions (58/42 split, gallery on right). The transition should feel smooth.

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardView.tsx
git commit -m "feat: add loading skeleton to dashboard mount"
```

---

### Task 4: Add error boundary wrapper

**Files:**
- Create: `src/components/Dashboard/DashboardErrorBoundary.tsx`
- Modify: `src/components/Dashboard/DashboardView.tsx`

If any domain tab throws during render, the entire dashboard crashes. Add a lightweight error boundary that catches render errors and shows a recovery UI.

- [ ] **Step 1: Create DashboardErrorBoundary.tsx**

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class DashboardErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Dashboard error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: 'clamp(2rem, 4vw, 3rem)',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                fontWeight: 400,
                color: 'var(--color-ink)',
                margin: '0 0 12px',
              }}
            >
              Something went wrong
            </p>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.75rem',
                color: 'var(--color-ink-secondary)',
                margin: '0 0 24px',
                maxWidth: '320px',
                lineHeight: 1.5,
              }}
            >
              This section couldn't load. Try refreshing the page or switching sections.
            </p>
            <button
              className="dashboard-link"
              onClick={() => this.setState({ hasError: false })}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.625rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-secondary)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              TRY AGAIN
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

- [ ] **Step 2: Wrap the domain content in DashboardView**

Import the boundary:

```tsx
import DashboardErrorBoundary from './DashboardErrorBoundary';
```

Wrap the domain content rendering (line 84-86):

```tsx
{/* Domain content */}
<div style={{ flex: 1, overflowY: 'auto' }}>
  <DashboardErrorBoundary>
    {renderDomain()}
  </DashboardErrorBoundary>
</div>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
The dashboard should render normally. To test the error boundary, temporarily throw in one of the domain components:

```tsx
// In DashboardToday.tsx, add at the top of the component:
throw new Error('Test error');
```

Verify the error boundary catches it, shows the fallback UI, and the "TRY AGAIN" button resets the state. Remove the test throw after verification.

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardErrorBoundary.tsx src/components/Dashboard/DashboardView.tsx
git commit -m "feat: add error boundary to dashboard domain tabs"
```
