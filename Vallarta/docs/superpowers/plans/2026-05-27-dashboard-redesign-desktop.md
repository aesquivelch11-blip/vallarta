# Dashboard Redesign — Desktop Two-Column Layout

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer `md:` responsive breakpoints onto the Plan 1 mobile base to produce a two-column desktop layout: left column holds the metrics strip and a tall multi-series organic chart (centrepiece); right column holds a sticky briefing panel with the numbered arrivals list and financial summary rows. The desktop layout is the primary visual reference for the organic data-viz from the Probe A brief.

**Architecture:** Requires `2026-05-27-dashboard-redesign-mobile.md` to be completed first. This plan makes five targeted modifications to `FinancialReportingView.tsx` — no section is rewritten from scratch. Each task adds or adjusts `md:` classes and a small amount of JSX restructuring. The desktop chart is upgraded from a single-series wave to three overlapping filled waves (Revenue / OpEx / Net Yield) in distinct warm hues, matching the layered mountain silhouette aesthetic of the reference image.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, `motion/react`, Lucide React, inline SVG

---

## File Structure

| File | Action |
|---|---|
| `src/components/FinancialReportingView.tsx` | Modify — five targeted edits |

---

## Task 1: Responsive Grid Wrapper

Wrap the content sections (metrics → chart → arrivals → financial summary) inside a `md:grid md:grid-cols-[1fr_360px]` container so the left column holds data visualisation and the right column holds the briefing panel.

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — add two wrapper `<div>` elements and rearrange four sections

- [ ] **Step 1: Verify the baseline build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors (Plan 1 state).

- [ ] **Step 2: Replace the four middle sections with the responsive grid structure**

In `FinancialReportingView.tsx`, locate the comment `{/* ── Metrics strip — inline, hairline dividers, no cards ── */}` and the comment `{/* ── Supervision — inline status strip + camera ── */}`. Replace everything between those two comments (i.e., metrics, chart, arrivals, financial summary) with:

```tsx
      {/* ── Responsive two-column grid (desktop) ── */}
      <div className="md:grid md:grid-cols-[1fr_360px] md:divide-x md:divide-[#C9B8A0]/25">

        {/* Left column: metrics + chart */}
        <div>
          {/* ── Metrics strip — inline, hairline dividers, no cards ── */}
          <section className="border-b border-[#C9B8A0]/25" id="reporting-metrics-section">
            <div className="flex divide-x divide-[#C9B8A0]/25">
              <div className="flex-1 px-4 py-5 pl-6 md:py-7" id="metric-revenue-card">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Revenue</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">$124,500</span>
                <span className="block text-[9px] font-mono text-green-700 mt-1">+14%</span>
              </div>
              <div
                className="flex-1 px-4 py-5 md:py-7 cursor-pointer"
                onClick={() => onNavigate('deep_dive', 'push')}
                id="metric-yield-card"
              >
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Yield</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">$1,450</span>
                <span className="block text-[9px] font-mono text-[#1C1917]/35 mt-1">Stable</span>
              </div>
              <div
                className="flex-1 px-4 py-5 md:py-7 cursor-pointer"
                onClick={() => onNavigate('calendar', 'push')}
                id="metric-occupancy-card"
              >
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Occupancy</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">88%</span>
                <span className="block text-[9px] font-mono text-green-700 mt-1">+3%</span>
              </div>
              <div className="flex-1 px-4 py-5 md:py-7 pr-6" id="metric-sentiment-card">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-2">Sentiment</span>
                <span className="block text-lg md:text-2xl font-mono text-[#1C1917]">4.9</span>
                <span className="block text-[9px] font-mono text-[#1C1917]/35 mt-1">Top 5%</span>
              </div>
            </div>
          </section>

          {/* Chart section placeholder — replaced in Task 2 */}
          <section className="px-6 py-8 border-b border-[#C9B8A0]/25 md:border-b-0" id="reporting-chart-card">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-[9px] tracking-[0.28em] uppercase text-[#1C1917]/40">Yield Performance</span>
              <span className="font-mono text-sm text-[#1C1917]" id="chart-latest-tooltip">$1,450</span>
            </div>
            <div className="relative h-[150px] md:h-[280px] w-full" id="reporting-chart-canvas">
              <svg viewBox="0 0 500 110" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wave-fill-terracotta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(58% 0.09 48)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="oklch(58% 0.09 48)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="25" x2="500" y2="25" stroke="#DDD5C8" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#DDD5C8" strokeWidth="0.5" />
                <line x1="0" y1="95" x2="500" y2="95" stroke="#DDD5C8" strokeWidth="0.5" />
                <path
                  d="M 0 95 C 50 82 80 72 140 79 S 235 48 305 60 S 405 28 500 12 L 500 110 L 0 110 Z"
                  fill="url(#wave-fill-terracotta)"
                />
                <path
                  d="M 0 95 C 50 82 80 72 140 79 S 235 48 305 60 S 405 28 500 12"
                  fill="none"
                  stroke="oklch(42% 0.09 48)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="500" cy="12" r="3" fill="oklch(42% 0.09 48)" />
              </svg>
              <div className="flex justify-between text-[8px] font-mono text-[#1C1917]/35 mt-2 uppercase tracking-widest">
                <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: arrivals + financial summary (desktop briefing panel) */}
        <div className="md:flex md:flex-col">
          {/* ── Arrivals — numbered editorial list ── */}
          <section className="px-6 py-8 border-b border-[#C9B8A0]/25" id="reporting-timeline-section">
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#1C1917]/40 mb-6">
              Upcoming Arrivals
            </span>
            <div id="arrival-timeline-list">
              {arrivals.map((a) => (
                <div
                  key={a.num}
                  id={`arrival-${a.num}`}
                  className="flex items-start gap-4 py-4 border-b border-[#C9B8A0]/20 last:border-0 cursor-pointer group"
                  onClick={() => onNavigate('calendar', 'push')}
                >
                  <span className="text-[10px] font-mono text-[#1C1917]/25 mt-0.5 w-5 shrink-0">{a.num}</span>
                  <div className="flex-1 flex justify-between items-start gap-3">
                    <div>
                      <h5 className="font-serif text-[15px] text-[#1C1917] group-hover:text-[#1C1917]/55 transition-colors duration-200">
                        {a.name}
                      </h5>
                      <p className="text-[9px] uppercase font-mono tracking-wider text-[#1C1917]/40 mt-0.5">
                        {a.dates} · {a.nights}
                      </p>
                    </div>
                    <span className={`text-[8px] tracking-[0.15em] font-mono uppercase mt-0.5 shrink-0 ${a.typeStyle}`}>
                      {a.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Financial Summary ── */}
          <section className="px-6 py-8 border-b border-[#C9B8A0]/25 md:flex-1" id="reporting-analysis-section">
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#1C1917]/40 mb-5">
              Financial Summary
            </span>
            <div id="financial-reports-summary">
              <div
                className="flex justify-between items-baseline py-4 border-b border-[#C9B8A0]/20"
                id="report-net-profit"
              >
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#1C1917]/45">Net Profit</span>
                <div>
                  <span className="font-mono text-base text-[#1C1917]">$84,200</span>
                  <span className="text-[9px] text-green-700 font-mono ml-2">+8%</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline py-4" id="report-opex">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#1C1917]/45">
                  Operating Expenses
                </span>
                <div>
                  <span className="font-mono text-base text-[#1C1917]">$40,300</span>
                  <span className="text-[9px] text-[#1C1917]/35 font-mono ml-2">Stable</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('deep_dive', 'push')}
              id="view-financial-reports-btn"
              className="mt-6 w-full py-3.5 border border-[#1C1917]/15 text-[9px] uppercase tracking-[0.25em] font-mono text-[#1C1917]/50 hover:text-[#1C1917] hover:border-[#1C1917]/40 transition-all duration-300 cursor-pointer"
            >
              View Full Financial Report
            </button>
          </section>
        </div>

      </div>{/* end responsive grid */}
```

- [ ] **Step 3: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Visual check at desktop viewport (1280px)**

Open `http://localhost:5173`. Resize browser to 1280px wide. Confirm:
- Left side shows metrics + chart
- Right side shows arrivals list + financial summary
- A hairline vertical divider runs between the two columns
- On mobile (390px) it collapses back to a single column

- [ ] **Step 5: Commit**

```powershell
git add src/components/FinancialReportingView.tsx
git commit -m "feat(dashboard/desktop): responsive two-column grid wrapper"
```

---

## Task 2: Desktop Hero — Taller + Wider Gradient

On desktop the hero becomes taller (`md:h-[62vh]`) and the gradient scrim extends further right so the editorial text reads cleanly at a wider viewport.

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — `casa-obsidiana-hero` section

- [ ] **Step 1: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Update the hero section**

Locate `className="relative h-[45vh] overflow-hidden"` on the `<motion.section>` with id `casa-obsidiana-hero`. Replace that className with:

```tsx
className="relative h-[45vh] md:h-[62vh] overflow-hidden"
```

Then locate the gradient overlay `<div>` inside the hero and replace its className with:

```tsx
className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent md:bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.2)_50%,transparent_100%),linear-gradient(to_right,rgba(0,0,0,0.35)_0%,transparent_55%)]"
```

Then update the bottom text container to be larger on desktop:

```tsx
<div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-6 md:pb-10">
  <span className="block text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-white/55 font-mono mb-1.5">
    Estate 04 · Puerto Vallarta, Mexico
  </span>
  <h2 className="text-3xl md:text-5xl font-serif italic tracking-wide text-white" id="hero-estate-title">
    Casa Obsidiana
  </h2>
</div>
```

- [ ] **Step 3: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Visual check at desktop viewport**

At 1280px wide: hero should occupy approximately 60% of the viewport height. The estate name should be noticeably larger. The gradient should darken from the bottom and slightly from the left so text is always legible regardless of what part of the image is behind it.

- [ ] **Step 5: Commit**

```powershell
git add src/components/FinancialReportingView.tsx
git commit -m "feat(dashboard/desktop): taller hero with enhanced gradient scrim"
```

---

## Task 3: Multi-Series Organic Chart (Desktop)

On desktop, upgrade the single-wave chart to three overlapping filled wave shapes: Revenue (terracotta, largest mountain), Operating Expenses (warm stone, medium mountain), Net Yield (sage, smallest mountain in front). This matches the layered silhouette aesthetic from the reference image. Mobile keeps the single series.

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — `reporting-chart-card` section, SVG content only

- [ ] **Step 1: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Replace the SVG and chart header inside `reporting-chart-card`**

Locate the `<section>` with `id="reporting-chart-card"` and replace its entire contents with:

```tsx
        <div className="flex justify-between items-baseline mb-5 md:mb-7">
          <span className="text-[9px] tracking-[0.28em] uppercase text-[#1C1917]/40">Performance Overview</span>
          <span className="font-mono text-sm text-[#1C1917]" id="chart-latest-tooltip">$1,450 yield</span>
        </div>

        {/* Desktop legend */}
        <div className="hidden md:flex gap-6 mb-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(58%_0.09_48)] opacity-70" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#1C1917]/45">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(70%_0.04_60)] opacity-70" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#1C1917]/45">Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[oklch(60%_0.06_155)] opacity-70" />
            <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#1C1917]/45">Net Yield</span>
          </div>
        </div>

        <div className="relative h-[150px] md:h-[280px] w-full" id="reporting-chart-canvas">
          <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              {/* Terracotta — Revenue (largest) */}
              <linearGradient id="wave-fill-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(58% 0.09 48)" stopOpacity="0.40" />
                <stop offset="100%" stopColor="oklch(58% 0.09 48)" stopOpacity="0.05" />
              </linearGradient>
              {/* Warm stone — Expenses (medium) */}
              <linearGradient id="wave-fill-opex" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(70% 0.04 60)" stopOpacity="0.50" />
                <stop offset="100%" stopColor="oklch(70% 0.04 60)" stopOpacity="0.05" />
              </linearGradient>
              {/* Sage — Net Yield (smallest, foreground) */}
              <linearGradient id="wave-fill-yield" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(60% 0.06 155)" stopOpacity="0.45" />
                <stop offset="100%" stopColor="oklch(60% 0.06 155)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#DDD5C8" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#DDD5C8" strokeWidth="0.5" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#DDD5C8" strokeWidth="0.5" />

            {/* Revenue — terracotta, tallest wave */}
            <path
              d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20 L 500 140 L 0 140 Z"
              fill="url(#wave-fill-revenue)"
            />
            <path
              d="M 0 130 C 40 115 70 100 130 108 S 220 75 290 85 S 380 45 500 20"
              fill="none"
              stroke="oklch(42% 0.09 48)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Expenses — warm stone, medium height, starts slightly right */}
            <path
              d="M 0 140 C 60 128 100 118 170 122 S 270 98 360 105 S 440 80 500 60 L 500 140 L 0 140 Z"
              fill="url(#wave-fill-opex)"
            />

            {/* Net Yield — sage, shortest wave, foreground */}
            <path
              d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98 L 500 140 L 0 140 Z"
              fill="url(#wave-fill-yield)"
            />
            <path
              d="M 0 140 C 80 136 120 130 200 133 S 310 118 400 122 S 460 110 500 98"
              fill="none"
              stroke="oklch(44% 0.06 155)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* End dot on revenue (primary series) */}
            <circle cx="500" cy="20" r="3" fill="oklch(42% 0.09 48)" />
          </svg>

          <div className="flex justify-between text-[8px] font-mono text-[#1C1917]/35 mt-2 uppercase tracking-widest">
            <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
          </div>
        </div>
```

- [ ] **Step 3: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Visual check — desktop and mobile**

At 1280px: chart should show three overlapping mountain-range shapes in terracotta, warm stone, and sage — the largest at the back, the smallest in front. A three-item legend appears above the chart. The chart is 280px tall on desktop.

At 390px: chart collapses to 150px, shows a single organic wave (the terracotta Revenue wave dominates visually; the other fills are present but the shorter height makes them secondary). The legend is hidden (`hidden md:flex`).

- [ ] **Step 5: Commit**

```powershell
git add src/components/FinancialReportingView.tsx
git commit -m "feat(dashboard/desktop): multi-series organic chart with layered wave fills"
```

---

## Task 4: Desktop Supervision — Side-by-Side Status + Camera

On desktop, the supervision section goes full-width below the grid. The three status items (Security / Maintenance / Staff) sit in a row on the left, and the camera feed occupies the right half of the section — like a split information panel.

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — `reporting-supervision-section`

- [ ] **Step 1: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Replace the supervision section**

Locate `{/* ── Supervision — inline status strip + camera ── */}` and replace the entire `<section>` with:

```tsx
      {/* ── Supervision — inline status strip + camera ── */}
      <section className="border-b border-[#C9B8A0]/25" id="reporting-supervision-section">
        <div className="md:grid md:grid-cols-[1fr_1fr] md:divide-x md:divide-[#C9B8A0]/25">

          {/* Status strip */}
          <div className="px-6 py-8">
            <span className="block text-[8px] tracking-[0.3em] uppercase text-[#1C1917]/40 mb-5">
              Property Status
            </span>
            <div className="flex gap-8 md:gap-12" id="supervision-stats">
              <div id="supervision-security">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-1.5">Security</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs text-[#1C1917]">Active</span>
                </div>
              </div>
              <div id="supervision-maintenance">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-1.5">
                  Maintenance
                </span>
                <span className="font-mono text-xs text-[#1C1917]">On Schedule</span>
              </div>
              <div id="supervision-staff">
                <span className="block text-[8px] tracking-[0.22em] uppercase text-[#1C1917]/40 mb-1.5">Staff</span>
                <span className="font-mono text-xs text-[#1C1917]">4 On-Site</span>
              </div>
            </div>
          </div>

          {/* Camera feed */}
          <div
            className="relative h-[180px] md:h-[200px] overflow-hidden cursor-pointer group"
            onClick={() => onNavigate('camera_expanded', 'push')}
            id="supervision-camera-card"
          >
            <img
              src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80"
              alt="Pool camera feed preview"
              className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors" />
            <span
              className="absolute top-4 left-4 bg-red-600 text-white text-[8px] tracking-widest uppercase font-mono px-2.5 py-1 flex items-center gap-1.5 rounded-full"
              id="camera-live-badge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
              <div>
                <p className="text-[9px] tracking-wider text-white/55 uppercase font-mono">
                  CAM 02 · POOL TERRACE
                </p>
                <h4 className="text-lg font-serif italic tracking-wide mt-0.5">
                  Obsidiana Main Suite View
                </h4>
              </div>
              <button
                id="view-cameras-btn"
                className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/65 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                VIEW <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </section>
```

- [ ] **Step 3: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Visual check — desktop and mobile**

At 1280px: supervision section should be a horizontal split — left half shows the three status items on the parchment background; right half shows the camera feed image. A hairline divider separates them.

At 390px: status items appear above the camera feed (single column, stacked), identical to Plan 1 behaviour.

- [ ] **Step 5: Commit**

```powershell
git add src/components/FinancialReportingView.tsx
git commit -m "feat(dashboard/desktop): split supervision panel — status left, camera right"
```

---

## Task 5: Desktop Footer — Wider Layout

The footer currently uses `text-center` which works on mobile. On desktop, expand it to a three-column footer: left — brand serif; centre — legal links; right — concierge contact detail. This avoids the centred-everything look on a 1280px viewport.

**Files:**
- Modify: `src/components/FinancialReportingView.tsx` — `reporting-footer`

- [ ] **Step 1: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Replace the footer**

Locate `{/* ── Footer ── */}` and replace the `<footer>` element with:

```tsx
      {/* ── Footer ── */}
      <footer
        className="bg-[#1C1917] text-[#F5F1E8] py-10 px-6 md:px-10 text-center md:text-left"
        id="reporting-footer"
      >
        <div className="md:flex md:items-start md:justify-between md:gap-8 md:max-w-5xl md:mx-auto">
          {/* Brand */}
          <h4 className="text-xl font-serif italic tracking-[0.1em] text-[#F5F1E8] mb-5 md:mb-0 md:shrink-0">
            Vallarta Estates
          </h4>

          {/* Legal links */}
          <div className="flex justify-center md:justify-start gap-6 text-[8px] uppercase tracking-[0.2em] mb-5 md:mb-0 text-[#F5F1E8]/40">
            <button
              onClick={() => onNotify?.('Secure privacy guidelines.')}
              className="hover:text-[#C9B8A0] cursor-pointer transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => onNotify?.('Accepting terms of use.')}
              className="hover:text-[#C9B8A0] cursor-pointer transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => onNotify?.('Media kits.')}
              className="hover:text-[#C9B8A0] cursor-pointer transition-colors"
            >
              Press
            </button>
          </div>

          {/* Concierge contact */}
          <button
            onClick={() => onNotify?.('Call primary concierge at +52 (322) 849-0122.')}
            className="block text-[8px] uppercase tracking-[0.2em] text-[#F5F1E8]/40 hover:text-[#C9B8A0] cursor-pointer transition-colors md:shrink-0"
          >
            Contact Concierge
          </button>
        </div>

        <p className="text-[9px] text-[#F5F1E8]/20 tracking-[0.12em] max-w-sm mx-auto md:mx-0 md:max-w-none leading-relaxed uppercase mt-6 md:mt-8 md:max-w-5xl md:mx-auto">
          © 2024 Vallarta Property Management. Architectural Precision in Hospitality.
        </p>
      </footer>
```

- [ ] **Step 3: Verify the build passes**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Visual check — desktop and mobile**

At 1280px: footer shows brand name left, legal links centre, "Contact Concierge" right on one row.
At 390px: footer reverts to centred stacked layout identical to Plan 1.

- [ ] **Step 5: Final commit**

```powershell
git add src/components/FinancialReportingView.tsx
git commit -m "feat(dashboard/desktop): three-column footer layout for wide viewports"
```

---

## Verification Plan

### Build check (run after every task)
```powershell
npx tsc --noEmit
```
Expected: zero errors throughout.

### Visual checklist — desktop (1280px viewport)

- [ ] Hero: 62vh tall, estate name in large italic serif (text-5xl), gradient covers both bottom and left edge
- [ ] Metrics: four figures in a row, larger on desktop (text-2xl), a hairline divides the left and right columns at the grid boundary
- [ ] Chart: three overlapping wave fills visible — terracotta (back), warm stone (mid), sage (front); legend visible; chart 280px tall
- [ ] Right panel: arrivals numbered list + financial summary fill the right column from top to bottom; a "View Full Financial Report" button sits at the bottom
- [ ] Supervision: left half = status items on parchment; right half = camera feed; hairline divider between
- [ ] Footer: brand / legal / contact on one row

### Visual checklist — mobile (390px viewport)
- [ ] All sections revert to single-column stacking
- [ ] Chart is 150px tall, one wave series
- [ ] Supervision stacks status above camera
- [ ] Footer stacks centred

### Regression check
Navigate to all other screens (Nav Menu, Financial Deep Dive, Calendar, Camera, Login) and confirm nothing is broken.
