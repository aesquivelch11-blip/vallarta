# Phase 2: Layout Restructure + Domain Nav Redesign

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execute phases in order.

**Goal:** Replace the utilitarian icon-based vertical nav strip with a unified horizontal text-tab navigation featuring a spring-animated sliding underline indicator; restructure DashboardView to give content the full left-panel width.

**Architecture:** DashboardDomainNav.tsx is completely rewritten as a single horizontal nav (replacing separate desktop-vertical + mobile-pill variants). The motion.div with `layoutId="domain-indicator"` provides a spring-physics sliding underline between tabs. DashboardView.tsx removes the flex-row wrapper that paired the vertical nav strip with content, replacing it with a simpler column layout.

**Tech Stack:** Vite + React 18 + TypeScript, motion/react v12, Tailwind v4

**Prerequisites:** Phase 1 (`phase-1-gallery-hero.md`) must be complete and committed.

---

## Project Context

### File locations
- Component to rewrite: `src/components/Dashboard/DashboardDomainNav.tsx`
- Component to restructure: `src/components/Dashboard/DashboardView.tsx`
- CSS variables (reference only, do not edit): `src/design-tokens.css`

### Dev server
```bash
npm run dev
```
Navigate: Login → pick any property → Dashboard.

### What the current DashboardDomainNav.tsx does wrong
1. Has TWO separate nav variants: `<nav className="hidden lg:flex ...">` (vertical strip, 72px wide with icons) and `<nav className="flex lg:hidden ...">` (horizontal pill, mobile only)
2. The vertical strip occupies 72px width on desktop, squeezing the content area unnecessarily
3. Uses icons (Sun, TrendingUp, ClipboardList from lucide-react) — the luxury aesthetic calls for text-only labels
4. Active state is `background: var(--color-border-subtle)` — barely visible
5. No motion for the active indicator position change
6. Imports from lucide-react that will no longer be needed

### What changes in DashboardView.tsx
Current left-panel structure (simplified):
```
[header 52px]
[mobile domain nav: <div className="lg:hidden">]  ← REMOVE
[flex row: display:flex, flex:1, overflow:hidden]  ← REMOVE this wrapper
  [desktop nav strip: <div className="hidden lg:block">]  ← REMOVE
  [domain content: flex:1]
```

New left-panel structure:
```
[header 52px]
[unified domain nav: 40px height]                 ← ADD (single component)
[domain content: flex:1]
```

### Design rules
- Nav labels: Instrument Sans, `0.5625rem`, `0.22em` tracking, uppercase
- Active: `color: var(--color-ink)`, weight 500
- Inactive: `color: var(--color-ink-secondary)`, weight 400
- Active indicator: 1px bottom line that slides via `layoutId` spring animation
- Height of nav: `40px` with `borderBottom: 1px solid var(--color-border-subtle)`
- No icons, text only

### motion/react layoutId pattern
The `layoutId` prop on a `motion.div` causes it to animate between positions when it re-mounts under a different parent. Since the indicator conditionally renders under the active tab's container, it smoothly slides between tabs:

```tsx
{isActive && (
  <motion.div
    layoutId="domain-indicator"
    // spring config:
    transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'var(--color-ink)' }}
  />
)}
```

---

## Task 1: Rewrite DashboardDomainNav.tsx

**Files:**
- Modify: `src/components/Dashboard/DashboardDomainNav.tsx`

- [ ] **Step 1: Replace the entire file content**

Write `src/components/Dashboard/DashboardDomainNav.tsx` with exactly this content:

```typescript
import React from 'react';
import { motion } from 'motion/react';

export type Domain = 'today' | 'financials' | 'tasks';

interface DashboardDomainNavProps {
  active: Domain;
  onChange: (domain: Domain) => void;
}

const domains: { id: Domain; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'financials', label: 'Financials' },
  { id: 'tasks', label: 'Tasks' },
];

export default function DashboardDomainNav({ active, onChange }: DashboardDomainNavProps) {
  return (
    <nav
      aria-label="Dashboard sections"
      style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '40px',
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '0 clamp(1.5rem, 3vw, 2.5rem)',
        gap: 'clamp(1.25rem, 2.5vw, 2rem)',
      }}
    >
      {domains.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <div
            key={id}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Sliding underline indicator — spring-animated between tabs */}
            {isActive && (
              <motion.div
                layoutId="domain-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'var(--color-ink)',
                  borderRadius: 0,
                }}
                transition={{ type: 'spring', bounce: 0.1, duration: 0.35 }}
              />
            )}
            <button
              onClick={() => onChange(id)}
              aria-pressed={isActive}
              aria-label={`Switch to ${label} view`}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.5625rem',
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
            >
              {label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Verify file saved**

```bash
head -3 src/components/Dashboard/DashboardDomainNav.tsx
```

Expected: `import React from 'react';`

---

## Task 2: Restructure DashboardView left panel

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

The left panel currently (lines ~168–246) has this structure:

```tsx
{/* Left panel */}
<div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
  {/* Header */}
  <div style={{ height: '52px', ... }}>...</div>

  {/* Mobile domain nav */}
  <div className="lg:hidden">
    <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />
  </div>

  {/* Flex row: nav strip + content */}
  <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
    {/* Desktop vertical nav */}
    <div className="hidden lg:block">
      <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />
    </div>

    {/* Domain content */}
    <div style={{ flex: 1, overflowY: activeDomain === 'today' ? 'hidden' : 'auto', ... }}>
      <DashboardErrorBoundary>
        <motion.div key={activeDomain} ...>
          <AmbientProvider value={data.ambientColors}>
            {renderDomain()}
          </AmbientProvider>
        </motion.div>
      </DashboardErrorBoundary>
    </div>
  </div>
</div>
```

Replace with this structure (the header block stays unchanged — only the nav + content area changes):

```tsx
{/* Left panel */}
<div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
  {/* Header — UNCHANGED */}
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(1.5rem, 3vw, 2.5rem)', height: '52px', borderBottom: '1px solid var(--color-border-subtle)', flexShrink: 0 }}>
    <button className="dashboard-focus" onClick={() => onNavigate('property_selector', 'push_back')} style={headerBtnStyle} aria-label="Back to property selector">
      <ChevronLeft size={12} strokeWidth={1.5} />
      Back
    </button>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <DarkModeToggle />
      <button className="dashboard-focus" onClick={() => onNavigate('nav_menu', 'push')} style={headerBtnStyle} aria-label="Open navigation menu">
        Menu
        <ChevronRight size={12} strokeWidth={1.5} />
      </button>
    </div>
  </div>

  {/* Unified domain nav — replaces both the mobile pill and desktop vertical strip */}
  <DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />

  {/* Domain content — full width, scrollable */}
  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
    <DashboardErrorBoundary>
      <motion.div
        key={activeDomain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <AmbientProvider value={data.ambientColors}>
          {renderDomain()}
        </AmbientProvider>
      </motion.div>
    </DashboardErrorBoundary>
  </div>
</div>
```

Key changes made:
1. Removed `<div className="lg:hidden"><DashboardDomainNav .../></div>`
2. Removed the flex-row wrapper `<div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>`
3. Removed `<div className="hidden lg:block"><DashboardDomainNav .../></div>`
4. Added `<DashboardDomainNav active={activeDomain} onChange={setActiveDomain} />` directly in the column flow
5. Changed domain content to `overflowY: 'auto'` (was `activeDomain === 'today' ? 'hidden' : 'auto'`)
6. Simplified motion wrapper: removed `y: 8` slide and `staggerChildren` (content now handles its own stagger in Phase 3 + 4)

- [ ] **Step 1: Apply the left panel changes described above to `src/components/Dashboard/DashboardView.tsx`**

The exact lines to find and replace are the left panel div and its children (starting from the comment `{/* Left panel */}` through the closing `</div>` of the left panel, before `{/* Right panel */}`).

Replace that entire section with the new structure shown above.

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit 2>&1
```

Expected: No output.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

**Desktop (1024px+ wide):**
- [ ] Domain nav is now a horizontal strip with text-only labels: `TODAY`, `FINANCIALS`, `TASKS`
- [ ] No vertical 72px icon nav strip on the left side of the content
- [ ] Content area now uses the full left-panel width (no 72px stolen by nav strip)
- [ ] Clicking `Financials` label: the active underline indicator slides from `TODAY` to `FINANCIALS` with a spring animation
- [ ] Clicking `Tasks`: indicator slides again
- [ ] Active label is darker/heavier weight than inactive labels
- [ ] Nav has a bottom border line that aligns with the header's bottom border

**Mobile (< 1024px):**
- [ ] Same horizontal text nav appears (works identically — there's now only one nav variant)
- [ ] No pill background, just text with sliding underline

**Transition on domain switch:**
- [ ] Domain content fades in (opacity 0 → 1, 0.2s) — simple fade without y-slide
- [ ] The sliding indicator is the primary motion cue for navigation

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardDomainNav.tsx src/components/Dashboard/DashboardView.tsx
git commit -m "feat(nav): unified horizontal domain nav with spring-animated active indicator"
```

---

## Expected Visual Outcome

| Before | After |
|--------|-------|
| Two separate nav components (desktop vertical icon strip + mobile pill) | Single horizontal text-tab nav that works at all sizes |
| 72px vertical strip with icons steals content width | Content uses full left-panel width |
| Active state: subtle background fill, barely visible | Active state: 1px underline that spring-slides between tabs |
| Icons: Sun, TrendingUp, ClipboardList | Text only: Today, Financials, Tasks |
| `staggerChildren: 0.03` in motion wrapper (non-functional) | Simple opacity fade on domain switch; content handles own stagger |

---

**Proceed to Phase 3** (`phase-3-today-editorial.md`) once this commit is verified in the browser.
