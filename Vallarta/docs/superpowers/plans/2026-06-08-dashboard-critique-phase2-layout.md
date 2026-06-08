# Dashboard Critique — Phase 2: Layout & Identity

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the property name to the dashboard layout (above the gallery panel on desktop, above the mobile pill nav on mobile) and enrich the Today tab with occupancy trend context.

**Architecture:** Two focused changes — a new property title element in DashboardView.tsx, and a trend indicator addition to DashboardToday.tsx. Both use existing data (`property.name`, `data.occupancyPrev`) and existing design tokens.

**Tech Stack:** React, TypeScript, inline styles, CSS custom properties

---

### Task 1: Add property title to the dashboard layout

**Files:**
- Modify: `src/components/Dashboard/DashboardView.tsx`

The dashboard has no visible property name. The owner can't tell which property they're viewing without going to the nav menu. Add the property name as an editorial label — above the gallery on desktop (right panel), and above the domain pill on mobile.

The property name should use EB Garamond italic (the hero property name convention from DESIGN.md: italic reserved for property name on hero). On the dashboard, this is a secondary identity moment, so it should be smaller than the hero but still use the italic treatment.

- [ ] **Step 1: Add property title above the desktop gallery**

In `DashboardView.tsx`, modify the right panel (lines 90-96) to include the property name above the gallery:

```tsx
{/* Right panel — gallery, desktop only */}
<div
  className="hidden lg:flex lg:flex-col"
  style={{ height: '100dvh', position: 'sticky', top: 0 }}
>
  {/* Property name */}
  <div
    style={{
      padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) 0 clamp(1rem, 2vw, 1.75rem)',
    }}
  >
    <p
      style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
        letterSpacing: '-0.01em',
        color: 'var(--color-ink)',
        margin: 0,
        lineHeight: 1.2,
      }}
    >
      {property.name}
    </p>
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontWeight: 500,
        fontSize: '0.5625rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-secondary)',
        margin: '6px 0 0',
        lineHeight: 1,
      }}
    >
      {property.location}
    </p>
  </div>

  {/* Gallery */}
  <div style={{ flex: 1, minHeight: 0 }}>
    <DashboardGallery images={property.images} />
  </div>
</div>
```

- [ ] **Step 2: Add property title above the mobile domain pill**

Modify the mobile gallery strip section (lines 45-51) to include the property name below the gallery and above the domain pill:

```tsx
{/* Mobile/Tablet gallery strip — visible below lg */}
<div
  className="lg:hidden"
  style={{ height: 'clamp(180px, 30vw, 220px)' }}
>
  <DashboardGallery images={property.images} />
</div>

{/* Mobile property name — visible below lg, above domain pill */}
<div
  className="lg:hidden"
  style={{
    padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1.5rem, 3vw, 2.5rem) 0',
  }}
>
  <p
    style={{
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
      letterSpacing: '-0.01em',
      color: 'var(--color-ink)',
      margin: 0,
      lineHeight: 1.2,
    }}
  >
    {property.name}
  </p>
</div>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Check both desktop and mobile:
- Desktop: property name appears in italic above the gallery in the right panel, with location in uppercase tracked caps below it
- Mobile: property name appears in italic between the gallery strip and the domain pill
- The name uses EB Garamond italic (matching DESIGN.md: italic reserved for property name)
- The name updates when switching properties (if property selector is functional)

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardView.tsx
git commit -m "feat: add property name and location to dashboard layout"
```

---

### Task 2: Add occupancy trend indicator to Today tab

**Files:**
- Modify: `src/components/Dashboard/DashboardToday.tsx`

The occupancy number (78%) has no context. Is it good? Trending up? The data already includes `occupancyPrev` and the helper functions `formatTrendPercent` and `getTrendDirection` exist in `dashboardData.ts`. Add a subtle trend delta next to the occupancy label.

- [ ] **Step 1: Import the trend helpers**

At the top of `DashboardToday.tsx`, update the import:

```tsx
import { DashboardData, GuestEvent, formatTrendPercent, getTrendDirection } from './dashboardData';
```

- [ ] **Step 2: Add trend display below the occupancy label**

In the occupancy section (lines 78-106), add a trend line after the "OCCUPANCY" label:

```tsx
{/* Occupancy — dominant */}
<div style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
  <p
    style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: 400,
      letterSpacing: '-0.01em',
      color: 'var(--color-ink)',
      margin: 0,
      lineHeight: 1,
    }}
  >
    {occupancy}%
  </p>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.625rem',
        fontWeight: 500,
        letterSpacing: '0.30em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-secondary)',
        margin: 0,
      }}
    >
      OCCUPANCY
    </p>
    <p
      style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.5625rem',
        fontWeight: 500,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color: (() => {
          const dir = getTrendDirection(occupancy, data.occupancyPrev);
          if (dir === 'up') return 'var(--color-accent-positive)';
          if (dir === 'down') return 'var(--color-accent-negative)';
          return 'var(--color-ink-muted)';
        })(),
        margin: 0,
        opacity: 0.85,
      }}
    >
      {formatTrendPercent(occupancy, data.occupancyPrev)}
    </p>
  </div>
</div>
```

- [ ] **Step 3: Verify**

Run: `npm run dev`
Check the Today tab:
- Casa Palmeras (78%, prev 74%) should show "+5%" in a muted green/agave tone
- Casa Sol (65%, prev 72%) should show "-10%" in a muted red tone
- Villa Luna (92%, prev 88%) should show "+5%" in green
- The trend is visually subordinate to the occupancy label (smaller, lighter)

- [ ] **Step 4: Commit**

```bash
git add src/components/Dashboard/DashboardToday.tsx
git commit -m "feat: add occupancy trend indicator to Today tab"
```
