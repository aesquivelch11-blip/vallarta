# Ultimate Luxury Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Execute a complete visual paradigm shift. We will combine Minimalist UI (warm bone palette, 1px borders, extreme typography), Antigravity Design (weightless diffused shadows), and GSAP Disney animation principles to create an Awwwards-caliber luxury dashboard.

**Architecture:** 
- **Style:** Replace generic background colors with `#FBFBFA` (warm bone) and `#111111` (charcoal). 
- **Layout:** Implement an asymmetric Bento Grid.
- **Motion:** Rewrite GSAP entrances to use squash/stretch and overlap (opacity + scale + translate) staggered at 0.05s.
- **UX:** Use progressive disclosure for secondary stats to maintain an editorial, magazine-like feel.

**Tech Stack:** React, Vanilla CSS, GSAP

---

### Task 1: Color & Typography Foundation

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Update variables to Minimalist UI standards**
```css
/* Update :root in src/index.css */
:root {
  --color-primary: #1a2e2b; /* Darker luxury teal */
  --color-bg: #FBFBFA; /* Warm bone */
  --color-surface: #FFFFFF;
  --color-text: #111111; /* Off-black for editorial legibility */
  --color-text-muted: #787774;
  --color-border: #EAEAEA; /* 1px sharp borders */
  --shadow-diffused: 0 20px 40px rgba(0,0,0,0.05); /* Antigravity float */
}

.display-text {
  font-family: var(--font-display);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -0.02em; /* Tight tracking for luxury serif */
}
```

- [ ] **Step 2: Commit**
```bash
git add src/index.css
git commit -m "style: apply minimalist UI color and typography foundation"
```

### Task 2: Antigravity Bento CSS

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Rewrite layout classes**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.bento-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover {
  box-shadow: var(--shadow-diffused);
  transform: translateY(-4px); /* Antigravity float */
}

.card-hero {
  grid-column: span 8;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-side {
  grid-column: span 4;
}

.luxury-value {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 6rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  color: var(--color-primary);
  margin: var(--space-md) 0;
}

.luxury-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
}

.progressive-data {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover .progressive-data {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Commit**
```bash
git add src/App.css
git commit -m "style: create antigravity bento grid and progressive disclosure classes"
```

### Task 3: GSAP Entrance Magic & Editorial JSX

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Rewrite GSAP animation using Disney Principles**
```javascript
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Squash & Stretch, Slow-Out, Arc translation
      gsap.from(".animate-in", {
        y: 40,
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out", // Slow-out
        delay: 0.1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);
```

- [ ] **Step 2: Rewrite DOM with Editorial Hierarchy**
```javascript
// Inside return statement
    <div className="container" ref={containerRef}>
      <header className="animate-in" style={{ padding: 'var(--space-xl) 0', borderBottom: '1px solid var(--color-border)' }}>
        <h1 className="luxury-label">Villa Horizonte / Estate Overview</h1>
      </header>

      <section className="bento-grid">
        <div className="bento-card card-hero animate-in">
          <div className="luxury-label">Monthly Yield</div>
          <div className="luxury-value">{metrics.revenue.current}</div>
          <div className="progressive-data">
            <span style={{ color: 'var(--color-primary)' }}>+11% vs last month</span><br/>
            Per-Room Yield: {metrics.revenue.revPAR}
          </div>
        </div>

        <div className="bento-card card-side animate-in">
          <div className="luxury-label">Occupancy</div>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0' }}>{metrics.occupancy.current}</div>
          <div className="progressive-data metric-sub">Next 30 Days</div>
        </div>

        <div className="bento-card card-side animate-in">
          <div className="luxury-label">Guest Satisfaction</div>
          <div className="display-text" style={{ fontSize: '3rem', margin: 'var(--space-sm) 0' }}>{metrics.satisfaction.score}</div>
          <div className="progressive-data metric-sub">Based on {metrics.satisfaction.total} reviews</div>
        </div>
      </section>
    </div>
```

- [ ] **Step 3: Run Build Verification**
```bash
npm run build
```

- [ ] **Step 4: Commit**
```bash
git add src/App.jsx
git commit -m "feat: implement premium bento layout and GSAP entrance magic"
```
