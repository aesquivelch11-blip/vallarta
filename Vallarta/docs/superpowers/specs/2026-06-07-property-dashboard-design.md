# Property Dashboard — Design Spec

**Date:** 2026-06-07
**Status:** Approved

---

## 1. Purpose

A per-property command center for the Property Manager. Surfaces the most critical operational and financial data for the active property in a single, glanceable screen. Read-only: every section provides a navigation link to the relevant full screen for actions and detail.

The dashboard is the default landing screen after a property is selected via the existing `PropertySelector`. Switching properties in the selector reloads the dashboard for the new active property.

---

## 2. Users

**Primary:** Property Manager — active day-to-day operations. Opens the dashboard to orient before acting: who arrives today, how the books look, what needs attention.

**Secondary:** Property Owner — passive oversight. The dashboard satisfies their need for a quick read without requiring navigation deeper into the app.

---

## 3. Layout

### Two-zone split

The screen is divided into two persistent zones within the existing app shell (global nav already handled):

| Zone | Desktop width | Role |
|---|---|---|
| Left panel | ~58% | Domain selector + domain content |
| Right panel | ~42% | Property image gallery |

**Desktop:** Both zones fill the viewport height. The right panel is fixed; it does not scroll. The left panel scrolls only if content overflows — by design it should not (each domain is constrained to one screen).

**Tablet (768px–1024px):** Gallery moves to a full-width strip at the top (~220px tall). Below it, the domain selector becomes a horizontal segmented pill and content fills the remaining width. Full page scrolls.

**Mobile (<768px):** Gallery strip at top (~180px). Segmented pill selector below it. Domain content stacked single-column. Full page scrolls.

---

## 4. Left Panel

### 4a. Domain Selector

Three domains: **Today**, **Financials**, **Tasks**.

**Desktop (vertical strip):**
- Narrow column on the far left of the left panel
- Icon + Instrument Sans uppercase label per item
- Generous space above the cluster; tight spacing between items
- "Today" carries slightly more visual weight (larger label scale, not a highlight color) — it is the default active domain
- Active state: weight shift and a subtle background tint, no underlines, no border-left accents

**Tablet / Mobile (horizontal segmented pill):**
- Compact pill row, no underlines, no equal-width tab borders
- Selected state: weight change + subtle background shift only
- Fits all three labels without truncation at 320px minimum

---

### 4b. Today Domain

**Purpose:** Know who arrives, who leaves, and whether the property is occupied — right now.

**Layout (priority order, top to bottom):**

**Occupancy** — EB Garamond upright, large financial figure scale. The dominant element. Percentage only (e.g., `78%`). Instrument Sans uppercase label below: `OCCUPANCY`.

**Arrivals** — More visual weight than departures; operationally heavier. EB Garamond numeral anchor (e.g., `3`) at section scale, followed by a compact list of guest names (EB Garamond italic, guest name style per DESIGN.md). Below the count: tomorrow's arrivals in Instrument Sans at reduced size and opacity — present but subordinate.

**Departures** — Smaller scale than arrivals. Same structure (numeral + names) but Instrument Sans upright for the names, not italic. Tomorrow's departures follow the same reduced treatment.

**Navigation:** Instrument Sans uppercase `VIEW CALENDAR →` link at the bottom of the domain, tracked, muted color.

---

### 4c. Financials Domain

**Purpose:** P&L health of the property for the selected period, at a glance.

**Layout:**

**Period selector** — Top of the domain. Compact inline control. Default: current calendar month (e.g., `June 2026`). Options: previous months and custom range. Instrument Sans, sentence case, no dropdown styling — styled as an inline text toggle consistent with the brand.

**P&L sequence** — Structured as accounting logic, not an equal-weight metric grid:

- **Revenue** — Instrument Sans label `REVENUE`, supporting scale. EB Garamond upright figure.
- **Expenses** — Instrument Sans label `EXPENSES`, same supporting scale. EB Garamond upright figure. Visually subordinate to Revenue through reduced size and opacity — not indented.
- **Net** — The dominant element. Instrument Sans label `NET`, larger. EB Garamond upright figure at financial figure scale (largest on screen). Separated from Revenue/Expenses by generous spacing — the result of the sequence above, not a peer.

Positive Net: no color change needed — the figure speaks. Negative Net: muted warm red (OKLCH, reduced chroma), not alarming.

Unavailable figures: display `—` not `$0`. A missing figure and a zero figure are different facts.

**Navigation:** `VIEW FINANCIALS →` link, same treatment as Today domain.

---

### 4d. Tasks Domain

**Purpose:** Open maintenance and operational items that need attention.

**Layout:**

**Count** — EB Garamond upright at section headline scale. `4 open` or `All clear` (no count needed when zero — positive framing, not an empty state message).

**Numbered list** — Maximum 5 items visible. Each item:
- EB Garamond upright numeral (1, 2, 3...) as visual anchor — editorial weight, not a bullet
- Task description in Instrument Sans body weight, sentence case
- Status or priority as a subdued Instrument Sans label below the description, reduced size and opacity

Items are not equal-weight cards. No border-left accents. No icon + heading + text card grid. Spacing between items varies: tighter within an item (label below description), more generous between items.

**Navigation:** `VIEW ALL TASKS →` link. If no tasks: link omitted.

---

## 5. Right Panel — Property Gallery

**Purpose:** Decorative. Lets the manager browse property photos. No data, no overlays.

### Image treatment

The image sits inset within the panel — not full-bleed. Asymmetric padding:
- Top and outer edge: generous (`clamp(1.5rem, 3vw, 2.5rem)`)
- Inner edge (touching left panel): slightly less — creates tension between the two zones
- Bottom: minimal — the counter anchors here and the image extends close to it

Panel background: brand neutral (tinted, not white). The padding reveals this background, framing the image like a photograph in a gallery.

`object-fit: cover`. No vignette, no gradient overlay, no caption, no property name overlay.

### Navigation

**Click zones:** The image is divided invisibly into left and right halves. Clicking the right half advances; clicking the left goes back. No arrow buttons rendered by default. On hover, the active half shows a barely-there directional cue at its edge — not a button shape, just a subtle indicator. Cursor changes to `←` or `→`.

**Touch:** Swipe left/right.

**Counter:** `03 / 08` anchored bottom-right of the image (not the panel — the image itself, just inside its bottom edge). Instrument Sans uppercase, wide tracking (`0.20em`), opacity `0.55`. Always white — no adaptive logic. Property photos in this context are predominantly architectural/exterior shots that tolerate a white counter at low opacity without legibility risk.

**Transition:** Lateral slide, `ease-out-expo`, ~280ms. Not a crossfade — a slide communicates spatial movement through a gallery.

### Responsive

**Tablet/Mobile strip:** Same navigation model — swipe to move, counter in corner. The inset padding compresses proportionally. The lateral slide continues.

---

## 6. Data Model Change

The `Property` interface in `src/data/properties.ts` gains:

```ts
images: string[];   // replaces imageUrl; ordered, first image shown on load
```

`imageUrl` is kept temporarily as a fallback and deprecated. Migration: each property's existing `imageUrl` becomes `images[0]`.

---

## 7. Empty and Error States

| Condition | Behavior |
|---|---|
| No images for property | Gallery shows brand-neutral panel background, no counter, no navigation controls |
| No arrivals today | "No arrivals" in muted Instrument Sans — visible, not hidden |
| No departures today | "No departures" — same treatment |
| No tasks | "All clear" at count position, `VIEW ALL TASKS` link omitted |
| Financial data unavailable | Figures display `—`, not `$0` |
| Tomorrow data unavailable | Tomorrow row omitted entirely |

---

## 8. Component Structure

| Component | Responsibility |
|---|---|
| `DashboardView` | Top-level two-zone layout, responsive breakpoint logic |
| `DashboardGallery` | Right panel: inset image, click-zone nav, counter, slide transition |
| `DashboardDomainNav` | Domain selector: vertical strip (desktop), segmented pill (mobile) |
| `DashboardToday` | Today domain: occupancy, arrivals, departures, nav link |
| `DashboardFinancials` | Financials domain: period selector, P&L sequence, nav link |
| `DashboardTasks` | Tasks domain: count, numbered list, nav link |

`DashboardView` receives the active `Property` object from the existing `PropertySelector` context. Each domain component receives only the data slice it needs — no component reaches across domain boundaries.

---

## 9. Navigation Integration

`DashboardView` becomes the default view rendered after property selection. No new routing mechanism needed — the existing view-switching pattern in `App.tsx` handles it. A `'dashboard'` view type is added to the `ScreenType` enum.

---

## 10. Out of Scope

- Tasks data source and Tasks screen (future spec)
- Real-time data / WebSocket updates
- Editing or actioning anything from the dashboard
- Owner-specific view differences (deferred to a future role-aware spec)
