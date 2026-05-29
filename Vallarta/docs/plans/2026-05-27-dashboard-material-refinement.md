# Dashboard Material Refinement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 6 specific material/spatial failures in the FinancialReportingView dashboard — stats card interiors, chart polish, avatar treatment, color temperature, status band unification, and footer cleanup.

**Architecture:** Single-component surgery on `FinancialReportingView.tsx` (stats card layout, chart SVG attributes, avatar styling, status band layout, footer content) plus targeted CSS token and selector adjustments in `design-tokens.css`. No new files. No new dependencies.

**Tech Stack:** React 19, motion (framer-motion v12), inline SVG, CSS custom properties.

---

### Task 1: Restructure StatCard Interior Layout

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — StatCard component, lines 27-44
- Modify: `src/design-tokens.css` — add `.stat-delta` and `.stat-description` classes if needed

**Problem:** Current layout has label stacked above value stacked above change text, but the change string "+14% VS LAST PERIOD" is too long and sits on its own line like a cheap spreadsheet. Needs to match the spec: value + delta inline, description below in muted 11px.

**Step 1: Rewrite StatCard component JSX**

Replace the StatCard body with this structure:

```tsx
<span className="t-metric-label">{label}</span>
<div className="stat-card__value-row">
  <span className="t-metric-value">{value}</span>
  {change && (
    <span className={`stat-card__delta ${trend === 'up' ? 'stat-card__delta--positive' : trend === 'down' ? 'stat-card__delta--negative' : 'stat-card__delta--neutral'}`}>
      {change.split(' ')[0]}
    </span>
  )}
</div>
{change && (
  <span className="stat-card__description">{change}</span>
)}
```

Key changes:
- Extract only the first word of `change` (e.g. "+14%") for the inline delta
- Put the full `change` string as a description on the next line
- Value + delta sit on same row via flex row

**Step 2: Add CSS for stat-card__value-row and stat-card__delta**

Add to `design-tokens.css`:

```css
.stat-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 4px;
}

.stat-card__delta {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 500;
}

.stat-card__delta--positive {
  color: var(--color-accent-positive);
}

.stat-card__delta--negative {
  color: #DC2626;
}

.stat-card__delta--neutral {
  color: var(--color-ink-muted);
}

.stat-card__description {
  display: block;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--color-ink-muted);
  margin-top: 4px;
}
```

**Step 3: Update StatCard prop interface**

The `change` prop stays as-is; we just split the rendering logic to show delta inline vs description below.

**Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

---

### Task 2: Fix Chart Line Weight, Gradient Fill, and Grid

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — SVG chart section, lines 148-202

**Problem:** Line stroke looks too thick (user reports ~4px visual), gradient fill is too opaque and looks muddy, grid lines too visible.

**Step 1: Reduce line stroke width and soften grid**

In the SVG, change:

```tsx
{/* Grid lines — reduce opacity from 0.05 to 0.04 */}
<line x1="0" y1="30" x2="500" y2="30" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />
<line x1="0" y1="75" x2="500" y2="75" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />
<line x1="0" y1="120" x2="500" y2="120" stroke="rgba(28,25,23,0.04)" strokeWidth="1" />

{/* Revenue line — strokeWidth 2 */}
<motion.path
  d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20"
  fill="none"
  stroke="#B45309"
  strokeWidth="2"
  strokeLinecap="round"
/>

{/* Net Yield line — strokeWidth 2 */}
<motion.path
  d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98"
  fill="none"
  stroke="#15803D"
  strokeWidth="2"
  strokeLinecap="round"
/>
```

**Step 2: Reduce gradient fill opacity from 20% to 12%**

Change the gradient defs:

```tsx
<linearGradient id="line-fill-revenue" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#B45309" stopOpacity="0.12" />
  <stop offset="100%" stopColor="#B45309" stopOpacity="0" />
</linearGradient>
<linearGradient id="line-fill-yield" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#15803D" stopOpacity="0.12" />
  <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
</linearGradient>
```

**Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: No errors.

---

### Task 3: Warm Up Sidebar Whites — Use Frosted Glass Instead of Solid

**Files:**
- Modify: `src/design-tokens.css` — `.sidebar__section` rule

**Problem:** `.sidebar__section` uses `background: var(--color-surface-solid)` which is `#FDFCFB` — still too opaque and solid. Should use frosted glass like the stat cards.

**Step 1: Change sidebar__section background**

Replace current `.sidebar__section` with:

```css
.sidebar__section {
  background: var(--color-surface);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-panel);
  padding: 28px;
  box-shadow: var(--shadow-contact), var(--shadow-ambient);
}
```

**Step 2: Verify the change didn't break layout**

The removal of `var(--shadow-lift)` and switch from solid to surface makes the sidebar sections match the chart panel and stat cards in material quality.

---

### Task 4: Fix Status Band — Unify Layout, Fix Dot Halo Color

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — status band + camera section, lines 244-283
- Modify: `src/design-tokens.css` — `.status-dot--active` rule

**Problem:** Status band left column has excessive empty space, dots are too bright. Dots use `--color-accent-positive: #15803D` but user says they look like "traffic lights."

**Step 1: Soften the status dot halo**

In `design-tokens.css`, replace current `.status-dot--active`:

```css
.status-dot--active {
  background: var(--color-accent-positive);
  box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.08);
}
```

The current code uses `var(--color-accent-positive-bg)` which is `rgba(21, 128, 61, 0.08)` — actually same value. The issue might be that inline styles override. Check that all status dots use the class and no inline style overrides exist.

**Step 2: Unify status band and camera into shared section**

Change the supervision section grid so status items vertically center against the camera feed height:

```tsx
{/* ── Status Band + Camera ── */}
<section className="supervision-section" id="reporting-supervision-section">
  <div className="supervision-grid">
    {/* Property Status */}
    <div className="supervision-status">
      <span className="t-metric-label">Property Status</span>
      <div className="status-band" id="supervision-stats">
        <div id="supervision-security">
          <span className="status-item__label">Security</span>
          <div className="status-item__value">
            <span className="status-dot status-dot--active" />
            <span>Active</span>
          </div>
        </div>
        <div id="supervision-maintenance">
          <span className="status-item__label">Maintenance</span>
          <div className="status-item__value">
            <span className="status-dot status-dot--active" />
            <span>On Schedule</span>
          </div>
        </div>
        <div id="supervision-staff">
          <span className="status-item__label">Staff</span>
          <div className="status-item__value">
            <span className="status-dot status-dot--active" />
            <span>4 On-Site</span>
          </div>
        </div>
      </div>
    </div>

    {/* Camera Feed */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="camera-feed"
      style={{ height: '200px' }}
      onClick={() => onNavigate('camera_expanded', 'push')}
      id="supervision-camera-card"
    >
      <img
        src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
        alt="Pool camera feed preview"
        className="cinematic-grade"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <div className="camera-feed__overlay">
        <p className="camera-feed__label">CAM 02 · POOL TERRACE</p>
        <h4 className="camera-feed__title">Obsidiana Main Suite View</h4>
      </div>
    </motion.div>
  </div>
</section>
```

Note: The `.camera-feed__overlay` div structure has been simplified — removed the flex-between layout that pushed the LIVE badge to the right. Instead, the overlay shows just camera label + title stacked vertically on the left.

**Step 3: Replace inline grid with CSS classes**

Add to `design-tokens.css`:

```css
.supervision-section {
  max-width: var(--grid-max-width);
  margin: 0 auto;
  padding: 0 var(--grid-gutter);
  padding-top: var(--space-element);
  border-top: 1px solid var(--color-border-subtle);
}

.supervision-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--grid-gutter);
  align-items: center;
}

.supervision-status {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

Remove the inline `style` props and use these classes instead.

---

### Task 5: Clean Up Footer — Remove Copyright, Tighten Typography

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — footer section, lines 285-306

**Problem:** Copyright sentence "Architectural Precision in Hospitality" feels like marketing copy. Links feel generic.

**Step 1: Simplify footer structure**

Replace current footer with:

```tsx
{/* ── Footer ── */}
<footer className="site-footer" id="reporting-footer">
  <div className="site-footer__inner">
    <h4 className="site-footer__wordmark">
      Vallarta Estates
    </h4>
    <div className="site-footer__links">
      <button onClick={() => onNotify?.('Secure privacy guidelines.')}>
        Privacy
      </button>
      <button onClick={() => onNotify?.('Accepting terms of use.')}>
        Terms
      </button>
      <button onClick={() => onNotify?.('Media kits.')}>
        Press
      </button>
    </div>
    <button onClick={() => onNotify?.('Call primary concierge at +52 (322) 849-0122.')}>
      Contact Concierge
    </button>
  </div>
</footer>
```

Key changes:
- Removed the centered copyright paragraph entirely
- Removed inline `style` props from all footer buttons (these classes should be defined in `.site-footer__links button` in the CSS)
- Layout keeps asymmetric structure: wordmark left, links center, CTA right

**Step 2: Add CSS for footer link buttons**

In `design-tokens.css`, update `.site-footer__links` styles to apply to buttons too:

```css
.site-footer__links button,
.site-footer__links a {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-secondary);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out-expo);
}

.site-footer__links button:hover,
.site-footer__links a:hover {
  color: var(--color-ink);
}
```

---

### Task 6: Check Diagnostic Criteria

**Files:**
- Verify: `src/design-tokens.css` — all `#fff` or `#000` occurrences

**Step 1: Audit for forbidden colors**

Search for `#fff`, `#ffffff`, `#000`, `#000000` in `design-tokens.css` and `FinancialReportingView.tsx`.

In `design-tokens.css`:
- `.live-badge` has `color: #fff` — OK, this is white text on a deep rose background
- `.camera-feed__title` has `color: #fff` — OK, white text on dark overlay
- `.hero__content` inline style has `color: '#fff'` — OK, white text on hero image

Check that no card background uses `#fff` or pure white. The `--color-surface` should be `rgba(255,255,255,0.72)`.

**Step 2: Verify backdrop-filter is applied**

Ensure `backdrop-filter: blur(20px) saturate(160%)` is present on:
- `.stat-card` ✓
- `.chart-panel` ✓
- `.sidebar__section` (needs fix from Task 3) ✓

---

### Verification

After all tasks:

```bash
npx tsc --noEmit
npx vite build
```

Both must pass with zero errors.
