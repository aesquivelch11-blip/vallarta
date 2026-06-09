# Dashboard Viewport Density — Design Spec

**Date:** 2026-06-09
**Status:** Draft

---

## 1. Purpose

Increase the information density of each dashboard domain tab so the owner/manager gets a complete briefing in one viewport per tab. No scrolling on desktop. Every data field in the existing model gets rendered.

---

## 2. Users

**Property Owner** — passive supervisor. Opens the app, sees everything in 3-5 seconds, closes it. Zero clicks to get the full picture.

**Property Manager** — active operator. Same overview, but uses the "View Calendar" / "View Financials" links to drill deeper when needed.

---

## 3. Constraints

- Tabs stay. Three domains: Today, Financials, Tasks.
- Gallery stays in the right panel, unchanged in placement.
- Domain nav strip stays (72px vertical on desktop, segmented pill on mobile).
- No new colors, no new fonts, no charting library.
- Existing design tokens only (`design-tokens.css`).
- Existing components reused: `MetricCard`, `TrendBadge`, `Sparkline`.
- Existing data model fully utilized — no unused fields.
- No scroll on desktop (each tab fits in viewport).
- Mobile: sections stack vertically, scroll expected.

---

## 4. Today Tab Layout

### Spatial Strategy: 3 rows, each using full horizontal width

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  78%                              [sparkline ▁▂▃▄▅▆▇]   │
│  OCCUPANCY    [+5%]                                      │
│                                                          │
│  ────────────────────────────────────────────────────── │
│                                                          │
│  4.8 ★                          4.2 nights              │
│  GUEST RATING                   AVG STAY                 │
│  47 reviews                   [███][█████][██]           │
│                                 1-2n  3-5n  6n+          │
│                                                          │
│  ────────────────────────────────────────────────────── │
│                                                          │
│  2  ARRIVING                    1  DEPARTING             │
│  Elena Rosenthal       5n       James Whitfield    7n    │
│  Marco & Lucia F.      3n                               │
│  1 tomorrow                     1 tomorrow               │
│                                                          │
│  VIEW CALENDAR →                                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Row 1: Occupancy + Sparkline

- **Left:** Large EB Garamond figure (`78%`) + Instrument Sans label `OCCUPANCY` + trend badge (`+5%`)
- **Right:** SVG sparkline (6-month `occupancyHistory`), ~120px wide, subtle stroke color (`--color-ink-muted` at 0.4 opacity)
- Shared row, flex layout, space-between

### Row 2: Guest Rating + Avg Stay (2-up)

- **Left:** Guest satisfaction score (`4.8`) + star indicator + review count (`47 reviews`)
- **Right:** Average length of stay (`4.2 nights`) + distribution mini bar (short/medium/long as proportional segments)
- Two columns, ~50/50 split

### Row 3: Arrivals ‖ Departures (2-up)

- **Left column:** Arrivals today — count + guest names (EB Garamond italic) + night count + tomorrow preview
- **Right column:** Departures today — count + guest names (EB Garamond upright) + night count + tomorrow preview
- Two columns, ~50/50 split
- Subtle vertical divider between columns

### Navigation

- `VIEW CALENDAR →` link at bottom (existing pattern)

---

## 5. Financials Tab Layout

### Spatial Strategy: Two columns — Figures (left) vs Context (right)

```
──────────────────────────────────────────────────────────┐
│                                                          │
│  ◂  June 2026  ▸                                         │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │                      │  │                          │ │
│  │  $12,400             │  │  6-MONTH TREND           │ │
│  │  REVENUE             │  │                          │ │
│  │                      │  │  Jan  Feb  Mar  Apr       │ │
│  │  $3,200              │  │  [██] [██] [███] [██]     │ │
│  │  EXPENSES            │  │  May  Jun                 │ │
│  │                      │  │  [███] [████]             │ │
│  │  ────────────────   │  │                          │ │
│  │                      │  │  $10.1 $8.9 $11.2 $9.6    │ │
│  │  $9,200              │  │  $10.8 $12.4             │ │
│  │  NET                 │  │                          │ │
│  │                      │  │  ─────────────────────   │ │
│  │                      │  │  EXPENSE BREAKDOWN       │ │
│  │                      │  │  Maintenance  $1,200 [██] │ │
│  │                      │  │  Utilities    $850   [██] │ │
│  │                      │  │  Staff        $680   [█]  │ │
│  │                      │  │  Supplies     $320        │ │
│  │                      │  │  Other        $150        │ │
│  └──────────────────────┘  └──────────────────────────┘ │
│                                                          │
│  VIEW FINANCIALS →                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Left Column (~45%): Financial Figures

- Period selector at top (existing chevron nav)
- Revenue — EB Garamond figure + Instrument Sans label
- Expenses — smaller, reduced opacity
- Subtle horizontal divider
- Net — largest figure, dominant

### Right Column (~55%): Context

**6-Month Trend:**
- Label: `6-MONTH TREND` (Instrument Sans uppercase, tracked)
- Horizontal bar chart — pure CSS divs, width proportional to revenue
- Month labels below bars (abbreviated: Jan, Feb, Mar...)
- Revenue values below labels (abbreviated: $10.1k, $8.9k...)
- Current month bar highlighted (full opacity vs 0.6 for others)

**Expense Breakdown:**
- Label: `EXPENSE BREAKDOWN`
- Each category: name + amount + proportional bar
- Bars use `--color-accent-warning` at low opacity, width proportional to max category
- No total row — the Net figure on the left already answers "how much"

### Navigation

- `VIEW FINANCIALS →` link at bottom (existing pattern)

---

## 6. Tasks Tab Layout

### Spatial Strategy: Asymmetric split — Categories (narrow left) vs List (wide right)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  3 open                                                  │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │  BY CATEGORY         │  │                          │ │
│  │                      │  │  1  Replace pool filter  │ │
│  │  Maintenance   2     │  │     cartridge            │ │
│  │  Housekeeping  0     │  │     URGENT               │ │
│  │  Amenities     0     │  │                          │ │
│  │  Inspection    1     │  │  2  AC unit inspection   │ │
│  │                      │  │     — unit 2             │ │
│  │                      │  │     PENDING              │ │
│  │                      │  │                          │ │
│  │                      │  │  3  Touch-up paint on    │ │
│  │                      │  │     terrace railing      │ │
│  │                      │  │     SCHEDULED            │ │
│  └──────────────────────┘  └──────────────────────────┘ │
│                                                          │
│                                                          │
│                                                          │
──────────────────────────────────────────────────────────┘
```

### Header

- Open count — EB Garamond large figure (`3 open` or `All clear`)
- If zero tasks: supportive text below ("No pending tasks for this property.")

### Left Column (~30%): Category Breakdown

- Label: `BY CATEGORY` (Instrument Sans uppercase, tracked)
- 2x2 grid of category + count
- Categories: Maintenance, Housekeeping, Amenities, Inspection
- Zero counts shown but muted (reduced opacity)
- Uses `category` field from existing task data

### Right Column (~70%): Task List

- Existing numbered list pattern preserved
- EB Garamond numeral anchor + task description + status label
- Status colors: urgent (red), pending (secondary), scheduled (muted)
- Max 5 visible (existing constraint)

### Bottom whitespace

- Intentionally empty. Whitespace = luxury. Don't fill it. If there are 5 tasks the list fills more; if there's 1 task, more whitespace. Both feel deliberate.

---

## 7. Motion & Interaction

| Event | Behavior |
|-------|----------|
| Tab switch | Current content fades out (150ms), new content fades in + rises 8px (200ms). Staggered by section (40ms apart). |
| Metric values | Count up from 0 on tab enter (400ms, ease-out-expo). |
| Sparkline | Draws left-to-right on appear (300ms, stroke-dashoffset animation). |
| Bar chart bars | Grow from zero width on appear (staggered, 40ms apart, ease-out-expo). |
| Category counts | Fade in with stagger (30ms apart). |
| Guest name hover | Subtle underline appears (Instrument Sans, not italic). |
| Task item hover | Slight background tint (`--color-surface`). |
| Bar chart bar hover | Highlight bar + tooltip showing exact value. |
| All motion | Respects `prefers-reduced-motion` — instant state change, no animation. |

---

## 8. Data Model Usage

| Field | Tab | Component |
|-------|-----|-----------|
| `occupancy` + `occupancyPrev` | Today | Hero metric + trend badge |
| `occupancyHistory` | Today | Sparkline |
| `guestSatisfaction` | Today | Score + review count |
| `lengthOfStay` | Today | Average + distribution bar |
| `arrivalsToday/Tomorrow` | Today | Guest list (left column) |
| `departuresToday/Tomorrow` | Today | Guest list (right column) |
| `periods` | Financials | Period selector + trend chart |
| `expenseBreakdown` | Financials | Breakdown bars |
| `tasks` | Tasks | Numbered list + category counts |

**Every field in the data model is rendered. No unused data.**

---

## 9. Responsive Behavior

### Desktop (≥1024px)
- All tabs fit in viewport, no scroll
- Two-column layouts active where specified
- Gallery sticky right panel

### Tablet (768px–1024px)
- Gallery moves to top strip
- Two-column layouts collapse to single column
- Domain nav becomes horizontal segmented pill
- Page may scroll if content exceeds viewport

### Mobile (<768px)
- Gallery strip at top (~180px)
- All sections stack vertically
- Domain nav is segmented pill
- Scroll expected and acceptable

---

## 10. What We Don't Do

- No new data fields or API calls
- No new colors or fonts
- No charting library (pure CSS/SVG)
- No scroll on desktop
- No structural changes to domain nav or gallery
- No expense breakdown on Today tab (belongs in Financials)
- No length-of-stay on Financials tab (belongs in Today)
