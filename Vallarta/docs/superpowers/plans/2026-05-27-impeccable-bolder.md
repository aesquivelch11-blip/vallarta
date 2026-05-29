# Bolder Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the `$impeccable bolder` redesign to transform the dashboard from a safe layout into a confident, distinctive luxury experience.

**Architecture:** We will replace the identical 3-card top metric grid with a massive, full-bleed hero banner drenched in deep luxury teal (`--color-primary`) featuring an `8rem` display font. Secondary metrics will be stripped of their card borders, and utilitarian UX copy will be elevated to match a premium persona.

**Tech Stack:** React, Vanilla CSS

---

### Task 1: Update CSS for Spatial Drama and Scale

**Files:**
- Modify: `src/App.css`
- Modify: `src/index.css`

- [ ] **Step 1: Create bolder layout classes in `src/App.css`**

Replace the `.dashboard-grid` block with:
```css
.hero-drenched {
  background-color: var(--color-primary);
  color: var(--color-bg);
  padding: var(--space-2xl) var(--space-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  position: relative;
  overflow: hidden;
}

.metric-massive {
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 8rem);
  line-height: 1;
  font-weight: 300;
  letter-spacing: -0.03em;
  margin: var(--space-md) 0;
}

.metrics-secondary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
  padding: 0 var(--space-lg);
}

.surface-borderless {
  background: transparent;
  border: none;
  padding: 0;
}
```

- [ ] **Step 2: Remove fake interactivity in `src/index.css`**

Delete the following hover block from `src/index.css` (around line 72):
```css
/* Subtle interaction for read-only alive feel */
.surface.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.css src/index.css
git commit -m "style: add bolder spatial and typography classes"
```

### Task 2: Restructure the DOM for Impact

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite top sections in `src/App.jsx` with extreme hierarchy**

Replace the `<header>` and `<section className="dashboard-grid">` with:
```javascript
      <section className="hero-drenched animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="metric-label" style={{ color: 'rgba(249, 248, 246, 0.7)' }}>Monthly Yield</span>
          <span style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Villa Horizonte</span>
        </div>
        <div className="metric-massive">{metrics.revenue.current}</div>
        <div className="metric-sub" style={{ color: 'rgba(249, 248, 246, 0.7)' }}>
          Per-Room Yield: {metrics.revenue.revPAR} &mdash; The estate is in perfect order.
        </div>
      </section>

      <section className="metrics-secondary-grid animate-in">
        <div className="surface-borderless">
          <span className="metric-label">Occupancy</span>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0', color: 'var(--color-primary)' }}>{metrics.occupancy.current}</div>
          <div className="metric-sub">Next 30 Days</div>
        </div>

        <div className="surface-borderless">
          <span className="metric-label">Guest Satisfaction</span>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0', color: 'var(--color-primary)' }}>{metrics.satisfaction.score}</div>
          <div className="metric-sub">Based on {metrics.satisfaction.total} reviews</div>
        </div>
      </section>
```

- [ ] **Step 2: Elevate UX Copy in the timeline grid**

Update the Operations labels (around line 105):
Change `"Open Maintenance"` to `"Property Upkeep"`
Change `"Pending Requests"` to `"Guest Requests"`

- [ ] **Step 3: Run build to verify**
Run: `npm run build`
Expected: Passes without errors.

- [ ] **Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "style: implement bolder hero and secondary metric layouts"
```
