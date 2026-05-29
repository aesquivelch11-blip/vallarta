# Calendar View Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the CalendarView component to use the existing design system, add purposeful motion, and achieve a luxury hospitality aesthetic with restrained, legible calendar interactions.

**Architecture:** Replace the current hardcoded-color, static calendar with a design-token-driven component that uses glass cards, Framer Motion for staggered entrance and month transitions, and a unified footer. The concierge panel becomes a glass card above the calendar; the detail notes box becomes a smooth-height glass card below the grid.

**Tech Stack:** React 19 + TypeScript, Tailwind CSS 4, Motion (Framer Motion), Lucide React, existing design-tokens.css

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/CalendarView.tsx` | **Modify** | Complete redesign — all styling, motion, structure |
| `src/design-tokens.css` | **Modify** | Add calendar-specific CSS classes for cell states |
| `src/components/__tests__/CalendarView.test.tsx` | **Create** | Basic render + interaction tests (optional) |

---

### Task 1: Add Calendar CSS Classes to Design Tokens

**Files:**
- Modify: `src/design-tokens.css`

- [ ] **Step 1: Add calendar-specific CSS classes**

Append these classes to the end of `src/design-tokens.css` (before the media queries):

```css
/* ── Calendar ── */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-cell {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s var(--ease-out-expo),
              box-shadow 0.15s var(--ease-out-expo),
              transform 0.15s var(--ease-out-expo);
}

.calendar-cell:hover {
  background-color: var(--color-border-subtle);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lift);
}

.calendar-cell--available {
  background: transparent;
}

.calendar-cell--owner {
  background: var(--color-accent-warning-bg);
}

.calendar-cell--guest {
  background: var(--color-accent-positive-bg);
}

.calendar-cell--other-month {
  opacity: 0.3;
  cursor: default;
}

.calendar-cell--other-month:hover {
  background: transparent;
  transform: none;
  box-shadow: none;
}

.calendar-cell--selected {
  box-shadow: inset 0 0 0 1.5px var(--color-ink);
}

.calendar-cell--today .calendar-cell__date {
  position: relative;
}

.calendar-cell--today .calendar-cell__date::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-ink);
}

.calendar-cell__date {
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-ink);
  line-height: 1;
}

.calendar-cell__note {
  font-family: var(--font-ui);
  font-size: 9px;
  font-weight: 400;
  color: var(--color-ink-muted);
  margin-top: 6px;
  line-height: 1.3;
  text-align: left;
}

.calendar-cell--other-month .calendar-cell__date {
  color: var(--color-ink-muted);
}

.calendar-day-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-day-label {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
  text-align: center;
}

.calendar-notes-card {
  background: var(--color-surface);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-panel);
  padding: 28px;
  box-shadow: var(--shadow-contact), var(--shadow-ambient);
}

.calendar-concierge-card {
  background: var(--color-surface);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-panel);
  padding: 24px;
  box-shadow: var(--shadow-contact), var(--shadow-ambient);
}
```

- [ ] **Step 2: Verify the file still has valid CSS**

Run: `cat src/design-tokens.css | tail -20`
Expected: The new calendar classes appear at the end of the file before the media queries.

---

### Task 2: Rewrite CalendarView Component Structure

**Files:**
- Modify: `src/components/CalendarView.tsx`

- [ ] **Step 1: Replace the entire CalendarView.tsx with the redesigned component**

Replace the full contents of `src/components/CalendarView.tsx` with:

```tsx
import React, { useState, useCallback } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenType } from '../types';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

interface DayInfo {
  day: number;
  status: 'none' | 'owner' | 'guest';
  current: boolean;
  note?: string;
}

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Simplified calendar matrix (representing October 2024)
const OCTOBER_DAYS: DayInfo[] = [
  { day: 29, status: 'none', current: false },
  { day: 30, status: 'none', current: false },
  { day: 1, status: 'none', current: true },
  { day: 2, status: 'none', current: true },
  { day: 3, status: 'none', current: true },
  { day: 4, status: 'guest', current: true, note: 'Guest: Sinclair Family' },
  { day: 5, status: 'guest', current: true, note: 'Guest: Sinclair Family' },
  { day: 6, status: 'guest', current: true, note: 'Guest: Sinclair Family' },
  { day: 7, status: 'none', current: true },
  { day: 8, status: 'none', current: true },
  { day: 9, status: 'none', current: true },
  { day: 10, status: 'none', current: true },
  { day: 11, status: 'none', current: true },
  { day: 12, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 13, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 14, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 15, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 16, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 17, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 18, status: 'owner', current: true, note: 'Owner: Sinclair Family' },
  { day: 19, status: 'none', current: true },
  { day: 20, status: 'none', current: true },
  { day: 21, status: 'none', current: true },
  { day: 22, status: 'none', current: true },
  { day: 23, status: 'none', current: true },
  { day: 24, status: 'guest', current: true, note: 'Guest: Al-Sayed Party' },
  { day: 25, status: 'guest', current: true, note: 'Guest: Al-Sayed Party' },
  { day: 26, status: 'guest', current: true, note: 'Guest: Al-Sayed Party' },
  { day: 27, status: 'guest', current: true, note: 'Guest: Al-Sayed Party' },
  { day: 28, status: 'none', current: true },
  { day: 29, status: 'none', current: true },
  { day: 30, status: 'none', current: true },
  { day: 31, status: 'none', current: true },
  { day: 1, status: 'none', current: false },
  { day: 2, status: 'none', current: false },
];

const MONTH_CONFIG: Record<string, { days: DayInfo[]; label: string }> = {
  'OCTOBER 2024': { days: OCTOBER_DAYS, label: 'October 2024' },
  'SEPTEMBER 2024': { days: OCTOBER_DAYS, label: 'September 2024' },
  'NOVEMBER 2024': { days: OCTOBER_DAYS, label: 'November 2024' },
};

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState('OCTOBER 2024');
  const [activeDateNote, setActiveDateNote] = useState<string | null>(
    'Elena Rostova is on-site preparing the Master Suite for your upcoming arrival on October 12.'
  );
  const [monthDirection, setMonthDirection] = useState<'left' | 'right'>('right');

  const days = MONTH_CONFIG[currentMonth]?.days ?? OCTOBER_DAYS;
  const monthLabel = MONTH_CONFIG[currentMonth]?.label ?? currentMonth;

  const handleMonthChange = useCallback(
    (direction: 'prev' | 'next') => {
      const newMonth = direction === 'prev' ? 'SEPTEMBER 2024' : 'NOVEMBER 2024';
      setMonthDirection(direction === 'prev' ? 'left' : 'right');
      setCurrentMonth(newMonth);
      setActiveDateNote(
        direction === 'prev'
          ? 'Displaying historical September records.'
          : 'Displaying future November records.'
      );
    },
    []
  );

  const handleDayClick = useCallback(
    (dayInfo: DayInfo) => {
      if (dayInfo.note) {
        setActiveDateNote(dayInfo.note);
      } else {
        setActiveDateNote(
          `October ${dayInfo.day} is currently unreserved and ready for your booking.`
        );
      }
    },
    []
  );

  const handleContactConcierge = useCallback(() => {
    setActiveDateNote(
      'Concierge connection initiated. Elena Rostova will reach out shortly.'
    );
    if (onNotify) {
      onNotify('Contacting Elena Rostova... Secure link established.');
    }
  }, [onNotify]);

  return (
    <div
      className="min-h-screen bg-transparent text-[#1C1917] font-sans flex flex-col"
      id="calendar-view-container"
    >
      {/* Top Header */}
      <header
        className="sticky top-0 z-40 px-6 py-4 flex justify-between items-center backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(247, 245, 242, 0.9)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
        id="calendar-header"
      >
        <h1
          className="t-wordmark cursor-pointer"
          onClick={() => onNavigate('reporting', 'push')}
        >
          Vallarta Estates
        </h1>

        <button
          aria-label="Menu"
          id="calendar-menu-btn"
          onClick={() => onNavigate('nav_menu', 'slide_up')}
          className="p-2 transition-colors duration-200 cursor-pointer flex items-center justify-center"
          style={{ color: 'var(--color-ink-secondary)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              'var(--color-ink-secondary)';
          }}
        >
          <span className="sr-only">menu</span>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 w-full flex-1" id="calendar-main-content">
        {/* Page Title */}
        <div className="space-y-1" id="calendar-breadcrumb-group">
          <span className="t-mono" style={{ color: 'var(--color-ink-muted)' }}>
            Villa Arcadia
          </span>
          <h2
            className="font-display text-3xl md:text-4xl font-light tracking-wide"
            style={{ color: 'var(--color-ink)' }}
            id="calendar-page-title"
          >
            Property Calendar
          </h2>
        </div>

        {/* Concierge Panel — Glass Card */}
        <motion.div
          className="calendar-concierge-card flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          id="calendar-oversight-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
              alt="Elena Rostova, Dedicated Estate Manager"
              className="w-14 h-14 rounded-full object-cover"
              style={{ border: '1px solid var(--color-border-medium)' }}
              referrerPolicy="no-referrer"
              id="concierge-avatar"
            />
            <div>
              <span className="t-mono" style={{ color: 'var(--color-ink-muted)' }}>
                Oversight
              </span>
              <h4
                className="font-display italic text-xl mt-0.5"
                style={{ color: 'var(--color-ink)' }}
                id="concierge-name"
              >
                Elena Rostova
              </h4>
              <p
                className="text-xs font-light mt-0.5"
                style={{ color: 'var(--color-ink-secondary)' }}
                id="concierge-role"
              >
                Dedicated Estate Manager
              </p>
            </div>
          </div>

          <button
            type="button"
            id="contact-concierge-btn"
            onClick={handleContactConcierge}
            className="btn"
          >
            Contact Concierge
          </button>
        </motion.div>

        {/* Month Navigation */}
        <div
          className="flex justify-between items-center px-6 py-3"
          style={{
            backgroundColor: 'var(--color-border-subtle)',
            borderRadius: 'var(--radius-pill)',
          }}
          id="calendar-month-slider"
        >
          <button
            id="prev-month-btn"
            onClick={() => handleMonthChange('prev')}
            className="p-2 transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--color-ink-secondary)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-ink)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-ink-secondary)';
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.span
              key={currentMonth}
              className="t-mono text-sm tracking-[0.15em]"
              style={{ color: 'var(--color-ink)' }}
              id="current-month-display"
              initial={{ opacity: 0, x: monthDirection === 'right' ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: monthDirection === 'right' ? -12 : 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {monthLabel}
            </motion.span>
          </AnimatePresence>

          <button
            id="next-month-btn"
            onClick={() => handleMonthChange('next')}
            className="p-2 transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--color-ink-secondary)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-ink)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-ink-secondary)';
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day of Week Labels */}
        <div className="calendar-day-labels" id="calendar-days-headers-row">
          {DAY_LABELS.map((day, idx) => (
            <span key={idx} className="calendar-day-label">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid" id="calendar-numbers-grid">
          {days.map((dayObj, idx) => {
            const cellClass = [
              'calendar-cell',
              !dayObj.current ? 'calendar-cell--other-month' : '',
              dayObj.status === 'owner' ? 'calendar-cell--owner' : '',
              dayObj.status === 'guest' ? 'calendar-cell--guest' : '',
              dayObj.status === 'none' && dayObj.current
                ? 'calendar-cell--available'
                : '',
            ]
              .filter(Boolean)
              .join(' ');

            const row = Math.floor(idx / 7);

            return (
              <motion.button
                key={idx}
                type="button"
                onClick={() => dayObj.current && handleDayClick(dayObj)}
                className={cellClass}
                id={`calendar-day-cell-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: row * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  pointerEvents: dayObj.current ? 'auto' : 'none',
                }}
              >
                <span className="calendar-cell__date">{dayObj.day}</span>
                {dayObj.note && dayObj.current && (
                  <span className="calendar-cell__note">
                    {dayObj.note.split(':')[0]}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Reservation Notes — Glass Card */}
        <AnimatePresence mode="wait">
          {activeDateNote && (
            <motion.div
              className="calendar-notes-card"
              key={activeDateNote}
              id="calendar-interactive-notes-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="t-mono block mb-2"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                Reservation Highlights
              </span>
              <p
                className="font-display italic text-base leading-relaxed"
                style={{ color: 'var(--color-ink)' }}
              >
                {activeDateNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        <div
          className="flex justify-start gap-8 pt-4"
          id="calendar-legends"
        >
          <div className="flex items-center gap-2" id="legend-owner-occupancy">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: 'var(--color-accent-warning)' }}
            />
            <span className="t-mono" style={{ color: 'var(--color-ink-muted)' }}>
              Owner Occupancy
            </span>
          </div>

          <div className="flex items-center gap-2" id="legend-guest-booked">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: 'var(--color-accent-positive)' }}
            />
            <span className="t-mono" style={{ color: 'var(--color-ink-muted)' }}>
              Guest Booked
            </span>
          </div>
        </div>
      </main>

      {/* Footer — Using Design System */}
      <footer className="site-footer" id="calendar-footer">
        <div className="site-footer__inner">
          <span className="site-footer__wordmark">Vallarta Estates</span>
          <div className="site-footer__links">
            <button
              onClick={() =>
                onNotify
                  ? onNotify('Privacy directives active.')
                  : undefined
              }
            >
              Privacy
            </button>
            <button
              onClick={() =>
                onNotify ? onNotify('Directives terms active.') : undefined
              }
            >
              Terms
            </button>
            <button
              onClick={() =>
                onNotify ? onNotify('Media packages.') : undefined
              }
            >
              Press
            </button>
            <button
              onClick={() =>
                onNotify
                  ? onNotify('Interactive call active.')
                  : undefined
              }
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `npx tsc --noEmit --skipLibCheck src/components/CalendarView.tsx`
Expected: No errors (or only pre-existing type errors unrelated to CalendarView)

---

### Task 3: Verify Visual Quality & Dev Server

**Files:**
- Verify: `src/components/CalendarView.tsx`
- Verify: `src/design-tokens.css`

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Server starts on localhost:5173 (or similar)

- [ ] **Step 2: Navigate to the calendar screen**

Open the browser and navigate to the calendar view. Verify:
- Header uses glassmorphism with backdrop blur
- Concierge panel is a glass card with proper shadow
- Month navigation has smooth fade+slide animation
- Calendar cells have staggered entrance animation (row by row)
- Day labels are uppercase, tracked, muted
- Date numbers are 15px, legible
- Owner days have warm amber background tint
- Guest days have muted green background tint
- Available days are transparent
- Other-month days are faded (opacity 0.3)
- Hover states work: subtle lift + shadow
- Notes card appears/disappears with smooth height transition
- Footer uses `.site-footer` class (clean, no extreme border radius)
- Legend uses design system colors

- [ ] **Step 3: Check responsive behavior**

Resize browser to mobile width (375px). Verify:
- Calendar grid remains readable
- Concierge panel stacks vertically
- Header doesn't overflow
- Footer links wrap properly

- [ ] **Step 4: Stop the dev server**

Run: `Ctrl+C` in the dev server terminal

---

### Task 4: Self-Review & Polish

**Files:**
- Review: `src/components/CalendarView.tsx`
- Review: `src/design-tokens.css`

- [ ] **Step 1: Check against AI slop list**

Verify none of these patterns exist in the new code:
- No `rounded-2xl` or `rounded-[2rem]` on cards (max is `rounded-lg` / 8px for cells, `var(--radius-panel)` for cards)
- No gradient text
- No side-stripe borders
- No numbered section markers (01/02/03)
- No tiny uppercase tracked eyebrow above every section (only one "Oversight" label in concierge card)
- No ghost-card pattern (border + wide shadow on same element)
- No hardcoded hex colors (all use CSS variables)

- [ ] **Step 2: Check motion quality**

Verify:
- Month transition uses `AnimatePresence` with fade + slide
- Cell entrance is staggered by row (40ms per row)
- Notes card uses height + opacity transition
- All transitions use `--ease-out-expo` curve
- No bounce or elastic easing
- Reduced motion is respected (add `@media (prefers-reduced-motion: reduce)` override if needed)

- [ ] **Step 3: Check accessibility**

Verify:
- All buttons have `aria-label` or visible text
- Calendar cells are `<button>` elements (not `<div>`)
- Other-month cells have `pointer-events: none` (not clickable)
- Focus states work on interactive elements
- Color contrast meets WCAG AA (ink on canvas, muted on canvas)

- [ ] **Step 4: Final commit**

Run:
```bash
git add src/components/CalendarView.tsx src/design-tokens.css
git commit -m "refactor: redesign calendar view with design system tokens and motion"
```

---

## Self-Review Checklist

### 1. Spec Coverage

| Requirement | Task |
|-------------|------|
| Use design tokens instead of hardcoded colors | Task 2, Step 1 |
| Add motion (staggered entrance, month transitions) | Task 2, Step 1 |
| Strip the grid (no visible borders) | Task 1 (CSS), Task 2 |
| Concierge panel as glass card | Task 2, Step 1 |
| Notes box as glass card with smooth transition | Task 2, Step 1 |
| Footer uses `.site-footer` class | Task 2, Step 1 |
| Typography hierarchy (Cormorant for header, Josefin for labels) | Task 2, Step 1 |
| Status colors (amber for owner, green for guest) | Task 1 (CSS), Task 2 |
| Cell radius restrained (8px max) | Task 1 (CSS) |
| Month navigation animates | Task 2, Step 1 |
| Responsive behavior | Task 3, Step 3 |

### 2. Placeholder Scan

No TBD, TODO, or placeholder patterns found. All steps contain complete code.

### 3. Type Consistency

- `DayInfo` interface defined and used consistently
- `ScreenType` imported from `../types` (existing)
- `CalendarViewProps` matches original interface
- All motion imports from `motion/react` (matches project's Framer Motion setup)
- CSS class names match between `design-tokens.css` and `CalendarView.tsx`

---

Plan complete. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
