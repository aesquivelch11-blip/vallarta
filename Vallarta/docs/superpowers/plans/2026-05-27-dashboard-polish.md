# Dashboard Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the Owner's Dashboard to eliminate AI-generated clichés by removing fake interactivity, elevating UX copy, and implementing an asymmetric layout for top metrics.

**Architecture:** We will modify `src/App.jsx` to restructure the layout classes and update terminology. We will edit `src/index.css` to drop the AI-tell hover effects, and `src/App.css` to break the identical card grid. 

**Tech Stack:** React, Vanilla CSS

---

### Task 1: Refactor UX Copy

**Files:**
- Modify: `src/App.jsx:45`
- Modify: `src/App.jsx:52`
- Modify: `src/App.jsx:56`
- Modify: `src/App.jsx:106`
- Modify: `src/App.jsx:112`

- [ ] **Step 1: Replace Utilitarian Phrasing with Luxury Tone in `src/App.jsx`**

```javascript
// Replace lines 43-46
        <p className="metric-sub" style={{ marginTop: 'var(--space-sm)' }}>
          <span className="status-indicator"></span>
          The estate is in perfect order.
        </p>

// Replace line 52
            <span className="metric-label">Monthly Yield</span>

// Replace line 56
          <div className="metric-sub">Per-Room Yield: {metrics.revenue.revPAR}</div>

// Replace line 106
            <div className="metric-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Property Upkeep</div>

// Replace line 112
            <div className="metric-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Guest Requests</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "style: elevate UX copy to luxury tone"
```

### Task 2: Remove Fake Interactivity

**Files:**
- Modify: `src/index.css:72-76`
- Modify: `src/App.jsx`

- [ ] **Step 1: Remove `.surface.interactive:hover` from `src/index.css`**

Delete lines 72-76 in `src/index.css`:
```css
/* Subtle interaction for read-only alive feel */
.surface.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
```

- [ ] **Step 2: Remove `interactive` class from static cards in `src/App.jsx`**

Find all 5 instances of `className="surface interactive animate-in"` and replace them with:
```javascript
className="surface animate-in"
```

- [ ] **Step 3: Commit**

```bash
git add src/index.css src/App.jsx
git commit -m "style: remove hover states from static elements"
```

### Task 3: Asymmetric Layout for Top Metrics

**Files:**
- Modify: `src/App.css:2-7`
- Modify: `src/App.jsx:50-57`

- [ ] **Step 1: Update grid classes in `src/App.css`**

Replace the `.dashboard-grid` block (lines 2-7):
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.hero-metric {
  background-color: var(--color-bg);
  border: none;
}

.hero-metric .metric-value {
  font-size: 4rem;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 2: Apply classes in `src/App.jsx`**

Update the first card (Revenue) to use the `hero-metric` class:
```javascript
// Replace line 50
        <div className="surface hero-metric animate-in">
```

- [ ] **Step 3: Run Build to Verify**

Run: `npm run build`
Expected: Successfully builds without React or CSS syntax errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.css src/App.jsx
git commit -m "style: implement asymmetric dashboard layout"
```
