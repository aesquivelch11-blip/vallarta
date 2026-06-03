# Calendar Critique Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all P0–P2 issues and minor polish items identified in the calendar screen critique — including a missing CSS token, broken grid layout, overlap-blocks-save bug, cancel confirmation, CTA hierarchy, scrollable list, pending-vs-confirmed grid signal, and drawer UX refinements.

**Architecture:** All changes are contained in 5 files. No new files needed. Design-tokens.css provides all styling; component files handle logic and structure. The EB Garamond guest-name rule from DESIGN.md is applied in both BookingList and BookingDrawer view mode.

**Tech Stack:** React 19, TypeScript, Framer Motion (`motion/react`), Tailwind v4, CSS custom properties in `design-tokens.css`

---

## File Map

| Action | File | What changes |
|---|---|---|
| Modify | `src/design-tokens.css` | Add `--cal-owner-accent` + `--cal-accent-ochre` tokens; fix hardcoded colors; add cancelled status class; scroll on list; replace border-left with tint on owner row; pending dot; legend; cancel link button; drawer surface token; warning color |
| Modify | `src/components/calendar/bookingUtils.ts` | Add `pending?: boolean` to CalendarDay; set it in buildCalendarDays |
| Modify | `src/components/calendar/BookingList.tsx` | Fix chip grid overflow (wrap in guest cell); fix `dateTime` casing; rename section title; add empty-state CTA; EB Garamond italic on guest names |
| Modify | `src/components/calendar/CalendarGrid.tsx` | SVG chevrons; hollow pending dot; dot legend row; aria improvements |
| Modify | `src/components/calendar/BookingDrawer.tsx` | validate warns-not-blocks; CTA hierarchy; cancel two-tap; drawer surface token; useReducedMotion; tappable handle; live overlap check; min on date inputs; EB Garamond guest name in view mode; warning color |

---

## Task 1: CSS Token Fixes + Visual Repairs

**Files:**
- Modify: `src/design-tokens.css`

This task fixes all CSS-level issues: the undefined token causing invisible owner elements, hardcoded colors, missing cancelled status style, owner row stripe replaced with tint, scroll on booking list, and new classes needed by later tasks.

- [ ] **Step 1: Add missing tokens to `:root`**

In `design-tokens.css`, find the `:root` block that contains `--cal-day-muted` (around line 75). Add these two lines immediately after `--cal-day-muted`:

```css
  --cal-owner-accent: #C9B8A0;       /* Estate Sand — owner stays, brand accent */
  --cal-accent-ochre: #D49A55;       /* Sunset Ochre — confirmed status, check-in dots */
  --cal-drawer-surface: #242424;     /* Drawer sheet background */
```

- [ ] **Step 2: Replace hardcoded colors with tokens in `.cal-day__dot` and `.cal-booking-row__status--confirmed`**

Find `.cal-day__dot {` (around line 1360). Change:
```css
  background: #D49A55; /* Sunset Ochre */
```
to:
```css
  background: var(--cal-accent-ochre);
```

Find `.cal-booking-row__status--confirmed {` (around line 1493). Change:
```css
  color: #D49A55; /* Sunset Ochre */
```
to:
```css
  color: var(--cal-accent-ochre);
```

Find `.cal-add-btn {`. The `color:` line currently uses `var(--cal-owner-accent)` — if it was left as `#C9B8A0` hardcoded, change it to `var(--cal-owner-accent)`. Same for `border: 1px solid rgba(201,184,160,0.3)` — leave as-is (rgba is fine for opacity variants).

- [ ] **Step 3: Add missing `.cal-booking-row__status--cancelled`**

Find `.cal-booking-row__status--pending {` block. Add immediately after its closing brace:

```css
.cal-booking-row__status--cancelled {
  color: rgba(255,255,255,0.3);
  text-decoration: line-through;
}
```

- [ ] **Step 4: Replace border-left on `.cal-booking-row--owner` with background tint**

Find `.cal-booking-row--owner {`. Replace the entire block:

```css
.cal-booking-row--owner {
  background: rgba(201, 184, 160, 0.04);
}
```

Remove the `padding-left: calc(...)` line entirely — the chip already identifies owner rows, the stripe was redundant.

- [ ] **Step 5: Add scroll container to `.cal-bookings__list`**

Find `.cal-bookings__list {`. Replace:

```css
.cal-bookings__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: clamp(160px, 28vh, 260px);
  overflow-y: auto;
  scrollbar-width: none;
}

.cal-bookings__list::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 6: Add pending dot, legend, cancel-link button, guest-cell, drawer warning, and drawer surface token CSS**

After the `.cal-day__dot--owner {` block, add:

```css
.cal-day__dot--pending {
  background: transparent;
  border: 1.5px solid var(--cal-accent-ochre);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  bottom: clamp(3px, 0.7vh, 7px);
}
```

After `.cal-bookings__empty {`, add:

```css
/* ─── Grid legend ─── */
.cal-grid-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: clamp(8px, 1.5vh, 14px);
  padding-left: 2px;
}

.cal-grid-legend__item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

.cal-grid-legend__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cal-grid-legend__dot--confirmed {
  background: var(--cal-accent-ochre);
}

.cal-grid-legend__dot--pending {
  background: transparent;
  border: 1.5px solid var(--cal-accent-ochre);
}

.cal-grid-legend__dot--owner {
  background: var(--cal-owner-accent);
}

/* ─── Booking row guest cell (flex wrapper for guest + chip) ─── */
.cal-booking-row__guest-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

/* ─── Guest name typography (EB Garamond italic per DESIGN.md) ─── */
.cal-booking-row__guest {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.8125rem, 1.5vw, 0.9375rem);
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Drawer surface token ─── */
.cal-drawer-sheet {
  background: var(--cal-drawer-surface);
  border-top: 1px solid rgba(201, 184, 160, 0.3);
  border-radius: 2rem 2rem 0 0;
}

/* ─── Drawer guest name (EB Garamond italic in view mode) ─── */
.cal-drawer-guest-name {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
}

/* ─── Cancel as text link (not a peer pill button) ─── */
.cal-drawer-btn--cancel-link {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(248, 113, 113, 0.55);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  transition: color 0.2s ease;
  align-self: center;
}

.cal-drawer-btn--cancel-link:hover {
  color: rgba(248, 113, 113, 0.85);
}

.cal-drawer-btn--cancel-link--armed {
  color: rgba(248, 113, 113, 0.9);
  font-weight: 500;
}

/* ─── Override warning color to neutral (not brand amber) ─── */
.cal-drawer-warning {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.05em;
}
```

Note: `cal-booking-row__guest` was previously defined in the original CSS. Find and **replace** the existing `.cal-booking-row__guest {` block entirely with the new one above (it adds `font-family: var(--font-serif)`, `font-style: italic`, and text overflow handling).

- [ ] **Step 7: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 8: Commit**

```bash
rtk git add src/design-tokens.css && rtk git commit -m "fix(calendar): define cal-owner-accent + cal-accent-ochre tokens, fix owner row, add scroll, cancelled status style, pending dot, legend, and drawer CSS"
```

---

## Task 2: bookingUtils — CalendarDay pending flag

**Files:**
- Modify: `src/components/calendar/bookingUtils.ts`

- [ ] **Step 1: Add `pending` flag to CalendarDay interface**

In `bookingUtils.ts`, find `export interface CalendarDay {`. Add `pending?: boolean;` to the interface:

```ts
export interface CalendarDay {
  day: number;
  empty?: boolean;
  booked?: boolean;
  ownerStay?: boolean;
  pending?: boolean;
  today?: boolean;
  checkin?: boolean;
  checkout?: boolean;
}
```

- [ ] **Step 2: Set `pending` in `buildCalendarDays`**

In `buildCalendarDays`, find the inner loop that builds `checkin`, `checkout`, `booked`. Add a `pending` accumulator:

```ts
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;

    let booked = false;
    let ownerStay = false;
    let pending = false;
    let checkin = false;
    let checkout = false;

    for (const b of activeBookings) {
      const isPending = b.status === 'Pending';
      if (dateStr === b.checkIn) {
        checkin = true;
        if (b.type === 'owner') ownerStay = true;
        if (isPending) pending = true;
      } else if (dateStr === b.checkOut) {
        checkout = true;
        if (b.type === 'owner') ownerStay = true;
        if (isPending) pending = true;
      } else if (dateStr > b.checkIn && dateStr < b.checkOut) {
        booked = true;
        if (b.type === 'owner') ownerStay = true;
        if (isPending) pending = true;
      }
    }

    days.push({ day: d, today: isToday, booked, ownerStay, pending, checkin, checkout });
  }
```

Note: `activeBookings` already includes Pending bookings (filter removes only Cancelled), so this just reads `.status` on existing items.

- [ ] **Step 3: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/calendar/bookingUtils.ts && rtk git commit -m "fix(calendar): add pending flag to CalendarDay — enables Pending vs Confirmed visual distinction on grid"
```

---

## Task 3: BookingList — Layout, dateTime, title, empty state, typography

**Files:**
- Modify: `src/components/calendar/BookingList.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
// src/components/calendar/BookingList.tsx
import React from 'react';
import { Booking, formatDisplayDates } from './bookingUtils';

interface BookingListProps {
  bookings: Booking[];
  onSelect: (booking: Booking) => void;
  onAdd: () => void;
}

export default function BookingList({ bookings, onSelect, onAdd }: BookingListProps) {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const visible = [...bookings]
    .filter(b => b.checkIn >= todayStr)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  const activeCount = bookings.filter(b => b.status !== 'Cancelled').length;

  return (
    <div role="region" aria-label="Reservations" className="cal-bookings">
      <div className="cal-bookings__header">
        <h2 className="cal-bookings__title">Reservations</h2>
        <div className="cal-bookings__header-right">
          <span className="cal-bookings__meta">{activeCount} Active</span>
          <button
            onClick={onAdd}
            aria-label="Add new booking"
            className="cal-add-btn"
          >
            +
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="cal-bookings__empty-state">
          <p className="cal-bookings__empty">No upcoming reservations.</p>
          <button
            onClick={onAdd}
            className="cal-bookings__empty-cta"
          >
            + Add a reservation
          </button>
        </div>
      ) : (
        <ul className="cal-bookings__list">
          {visible.map(booking => (
            <li
              key={booking.id}
              className={[
                'cal-booking-row',
                booking.type === 'owner' ? 'cal-booking-row--owner' : '',
                booking.status === 'Cancelled' ? 'cal-booking-row--cancelled' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelect(booking)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(booking);
                }
              }}
              tabIndex={0}
              aria-label={`${booking.guest}, ${formatDisplayDates(booking.checkIn, booking.checkOut)}, ${booking.nights} nights, ${booking.status}`}
            >
              <time
                dateTime={booking.checkIn}
                className={`cal-booking-row__date${booking.status === 'Cancelled' ? ' line-through' : ''}`}
              >
                {formatDisplayDates(booking.checkIn, booking.checkOut)}
              </time>
              {/* Guest name + chip live inside one grid column via flex wrapper */}
              <span className="cal-booking-row__guest-cell">
                <span className="cal-booking-row__guest">{booking.guest}</span>
                {booking.type === 'owner' && (
                  <span className="cal-booking-row__chip cal-booking-row__chip--owner">
                    Owner Stay
                  </span>
                )}
              </span>
              <span
                className={`cal-booking-row__status cal-booking-row__status--${booking.status.toLowerCase()}`}
              >
                {booking.status}
              </span>
              <span className="cal-booking-row__nights">{booking.nights}n</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

Also add CSS for the empty state CTA and empty state wrapper in `design-tokens.css` — find `.cal-bookings__empty {` and add after it:

```css
.cal-bookings__empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: clamp(16px, 3vh, 28px) 0;
}

.cal-bookings__empty-cta {
  font-family: var(--font-ui);
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cal-owner-accent);
  background: none;
  border: 1px solid rgba(201,184,160,0.25);
  border-radius: 999px;
  padding: 8px 20px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.cal-bookings__empty-cta:hover {
  border-color: rgba(201,184,160,0.6);
  color: rgba(255,255,255,0.9);
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Verify in browser**

Start dev server: `npm run dev` (port 4000)

Navigate to calendar screen. Verify:
- Section heading reads "Reservations" (not "Upcoming Arrivals")
- `‹ Margaret & James Whitfield ›` guest name renders in serif italic
- Owner Stay chip sits beside the guest name without pushing status/nights to wrong columns
- Active count shows correctly in header

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/calendar/BookingList.tsx src/design-tokens.css && rtk git commit -m "fix(calendar): fix chip grid overflow, dateTime casing, section title, empty state CTA, EB Garamond italic on guest names"
```

---

## Task 4: CalendarGrid — SVG chevrons, pending dot, legend

**Files:**
- Modify: `src/components/calendar/CalendarGrid.tsx`

- [ ] **Step 1: Replace entire file**

```tsx
// src/components/calendar/CalendarGrid.tsx
import React from 'react';
import { CalendarDay, MONTH_NAMES } from './bookingUtils';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CalendarGridProps {
  days: CalendarDay[];
  year: number;
  month: number; // 0-indexed
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CalendarGrid({ days, year, month, onPrevMonth, onNextMonth }: CalendarGridProps) {
  const hasPending = days.some(d => d.pending);
  const hasOwner = days.some(d => d.ownerStay);

  return (
    <div
      role="group"
      aria-label={`${MONTH_NAMES[month]} ${year} calendar`}
      className="cal-calendar"
    >
      <div className="cal-calendar__inner">
        <div className="cal-month-nav">
          <button
            onClick={onPrevMonth}
            aria-label={`Go to previous month`}
            className="cal-month-nav__arrow"
          >
            <ChevronLeft />
          </button>
          <div>
            <div className="cal-month">{MONTH_NAMES[month]}</div>
            <div className="cal-year">{year}</div>
          </div>
          <button
            onClick={onNextMonth}
            aria-label={`Go to next month`}
            className="cal-month-nav__arrow"
          >
            <ChevronRight />
          </button>
        </div>

        <div role="grid" aria-label="Calendar days" className="cal-grid">
          {DAY_LABELS.map((label, i) => (
            <div
              key={`label-${i}`}
              role="columnheader"
              aria-label={['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]}
              className="cal-day-label"
            >
              {label}
            </div>
          ))}

          {days.map((d, i) => {
            const isBoth = d.checkin && d.checkout;
            const isOwnerDay = (d.booked || d.checkin || d.checkout) && d.ownerStay;
            const isPendingDay = (d.booked || d.checkin || d.checkout) && d.pending && !d.ownerStay;

            return (
              <div
                key={`day-${i}`}
                role="gridcell"
                aria-label={
                  d.empty
                    ? undefined
                    : `${MONTH_NAMES[month]} ${d.day}, ${year}${d.booked || d.checkin || d.checkout ? (d.pending ? ', pending reservation' : ', confirmed reservation') : ''}${d.today ? ', today' : ''}${d.checkin ? ', check-in' : ''}${d.checkout ? ', check-out' : ''}`
                }
                className={[
                  'cal-day',
                  d.empty ? 'cal-day--empty' : '',
                  isOwnerDay ? 'cal-day--owner' : '',
                  !isOwnerDay && (d.booked || d.checkin || d.checkout) ? 'cal-day--booked' : '',
                  d.today ? 'cal-day--today' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  d.empty
                    ? undefined
                    : ({
                        '--accent-dot': isBoth
                          ? 'left: 50%; transform: translateX(-50%)'
                          : d.checkin
                          ? 'left: clamp(6px, 1vw, 10px)'
                          : 'right: clamp(6px, 1vw, 10px)',
                      } as React.CSSProperties)
                }
              >
                {d.empty ? '' : d.day}
                {(d.checkin || d.checkout) && (
                  <div
                    aria-hidden="true"
                    className={[
                      'cal-day__dot',
                      d.ownerStay ? 'cal-day__dot--owner' : '',
                      isPendingDay ? 'cal-day__dot--pending' : '',
                    ].filter(Boolean).join(' ')}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dot legend — only shows legend items relevant to this month's data */}
        <div className="cal-grid-legend" aria-label="Reservation key">
          <span className="cal-grid-legend__item">
            <span className="cal-grid-legend__dot cal-grid-legend__dot--confirmed" aria-hidden="true" />
            Confirmed
          </span>
          {hasPending && (
            <span className="cal-grid-legend__item">
              <span className="cal-grid-legend__dot cal-grid-legend__dot--pending" aria-hidden="true" />
              Pending
            </span>
          )}
          {hasOwner && (
            <span className="cal-grid-legend__item">
              <span className="cal-grid-legend__dot cal-grid-legend__dot--owner" aria-hidden="true" />
              Owner Stay
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Verify in browser**

Navigate to calendar screen. Check:
- Month nav arrows are clean SVG chevrons (not `‹ ›` characters)
- Legend row appears beneath the grid with correct items
- Brenner Family booking (Pending, Jul 02–08) — navigate to July and verify the dots are hollow (pending style)
- June confirmed bookings show filled dots

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/calendar/CalendarGrid.tsx && rtk git commit -m "fix(calendar): SVG chevrons for month nav, hollow dot for pending reservations, dot legend with conditional items"
```

---

## Task 5: BookingDrawer — All interaction + polish fixes

**Files:**
- Modify: `src/components/calendar/BookingDrawer.tsx`

This is the largest task. It covers: CTA hierarchy, cancel two-tap confirmation, drawer surface token, `useReducedMotion`, tappable handle, live overlap check, `min` attrs on date inputs, EB Garamond guest name in view mode, warning color fix, and validate()-warns-not-blocks.

- [ ] **Step 1: Replace entire file**

```tsx
// src/components/calendar/BookingDrawer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Booking,
  BookingType,
  calcNights,
  findOverlap,
  formatDisplayDates,
} from './bookingUtils';

export type DrawerMode = 'view' | 'edit' | 'add';

interface BookingDrawerProps {
  open: boolean;
  booking: Booking | null;
  mode: DrawerMode;
  bookings: Booking[];
  onSave: (booking: Booking) => void;
  onConfirm: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onEdit: () => void;
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function BookingDrawer({
  open,
  booking,
  mode,
  bookings,
  onSave,
  onConfirm,
  onCancelBooking,
  onEdit,
  onClose,
}: BookingDrawerProps) {
  const prefersReduced = useReducedMotion();

  const [formGuest, setFormGuest] = useState('');
  const [formType, setFormType] = useState<BookingType>('guest');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [dateError, setDateError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState('');
  const [cancelArmed, setCancelArmed] = useState(false);
  const cancelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset form state when drawer opens or mode changes
  useEffect(() => {
    if (!open) {
      setCancelArmed(false);
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
      return;
    }
    if (mode === 'edit' && booking) {
      setFormGuest(booking.guest);
      setFormType(booking.type);
      setFormCheckIn(booking.checkIn);
      setFormCheckOut(booking.checkOut);
    } else if (mode === 'add') {
      setFormGuest('');
      setFormType('guest');
      setFormCheckIn('');
      setFormCheckOut('');
    }
    setDateError('');
    setOverlapWarning('');
  }, [open, mode, booking?.id]);

  // Cleanup cancel timer on unmount
  useEffect(() => {
    return () => {
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
    };
  }, []);

  // Live overlap check as dates change
  useEffect(() => {
    if (!formCheckIn || !formCheckOut || formCheckOut <= formCheckIn) {
      setOverlapWarning('');
      return;
    }
    const overlap = findOverlap(formCheckIn, formCheckOut, bookings, booking?.id);
    setOverlapWarning(overlap ? `Overlaps with ${overlap.guest}` : '');
  }, [formCheckIn, formCheckOut, bookings, booking?.id]);

  const derivedNights = calcNights(formCheckIn, formCheckOut);

  const validate = (): boolean => {
    if (!formGuest.trim()) {
      setDateError('Guest name is required.');
      return false;
    }
    if (!formCheckIn || !formCheckOut) {
      setDateError('Both dates are required.');
      return false;
    }
    if (formCheckOut <= formCheckIn) {
      setDateError('Check-out must be after check-in.');
      return false;
    }
    setDateError('');
    // Overlap warns but does NOT block save — manager may intend it
    return true;
  };

  const handleSave = () => {
    if (!validate()) return;
    const saved: Booking = {
      id: booking?.id ?? crypto.randomUUID(),
      guest: formGuest.trim(),
      type: formType,
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      nights: derivedNights,
      status: booking?.status ?? 'Confirmed',
    };
    onSave(saved);
  };

  const handleCancelTap = (id: string) => {
    if (!cancelArmed) {
      // First tap: arm the confirmation
      setCancelArmed(true);
      cancelTimerRef.current = setTimeout(() => setCancelArmed(false), 3000);
    } else {
      // Second tap: execute
      if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
      setCancelArmed(false);
      onCancelBooking(id);
    }
  };

  const sheetTransition = prefersReduced
    ? { duration: 0.01 }
    : { duration: 0.45, ease: EASE };

  const backdropTransition = prefersReduced
    ? { duration: 0.01 }
    : { duration: 0.3 };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cal-drawer-backdrop"
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="cal-drawer-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={
              mode === 'add'
                ? 'New booking'
                : `Booking for ${booking?.guest ?? 'guest'}`
            }
            className="cal-drawer-sheet fixed bottom-0 left-0 right-0 z-50 px-6 pt-4 pb-10 flex flex-col gap-5"
            initial={{ y: prefersReduced ? 0 : '100%' }}
            animate={{ y: 0 }}
            exit={{ y: prefersReduced ? 0 : '100%' }}
            transition={sheetTransition}
            onKeyDown={e => { if (e.key === 'Escape') onClose(); }}
          >
            {/* Drag handle — tappable to close */}
            <button
              onClick={onClose}
              aria-label="Close booking panel"
              className="w-10 h-1 bg-white/20 rounded-full mx-auto hover:bg-white/35 transition-colors cursor-pointer border-none"
            />

            {mode === 'view' && booking ? (
              /* ── View Mode ── */
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="cal-drawer-label">Guest</span>
                  <span className="cal-drawer-guest-name">{booking.guest}</span>
                  {booking.type === 'owner' && (
                    <span className="cal-booking-row__chip cal-booking-row__chip--owner self-start mt-0.5">
                      Owner Stay
                    </span>
                  )}
                </div>

                <div className="flex gap-6 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <span className="cal-drawer-label">Dates</span>
                    <span className="cal-drawer-value">
                      {formatDisplayDates(booking.checkIn, booking.checkOut)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="cal-drawer-label">Nights</span>
                    <span className="cal-drawer-value">{booking.nights}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="cal-drawer-label">Status</span>
                    <span
                      className={`cal-booking-row__status cal-booking-row__status--${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* CTA row: Confirm (primary fill) + Edit (ghost) — horizontal */}
                <div className="flex gap-3 pt-1 items-center">
                  {booking.status !== 'Confirmed' && (
                    <button
                      className="cal-drawer-btn cal-drawer-btn--confirm"
                      onClick={() => onConfirm(booking.id)}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    className="cal-drawer-btn cal-drawer-btn--edit"
                    onClick={onEdit}
                  >
                    Edit
                  </button>
                  {/* Cancel is a text link, separated from primary actions */}
                  <span className="flex-1" />
                  {booking.status !== 'Cancelled' && (
                    <button
                      className={`cal-drawer-btn--cancel-link${cancelArmed ? ' cal-drawer-btn--cancel-link--armed' : ''}`}
                      onClick={() => handleCancelTap(booking.id)}
                      aria-label={cancelArmed ? 'Tap again to confirm cancellation' : `Cancel reservation for ${booking.guest}`}
                    >
                      {cancelArmed ? 'Confirm cancel?' : 'Cancel reservation'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* ── Add / Edit Mode ── */
              <>
                <div className="flex flex-col gap-1">
                  <label htmlFor="drawer-guest" className="cal-drawer-label">
                    Guest Name
                  </label>
                  <input
                    id="drawer-guest"
                    className="cal-drawer-input"
                    placeholder="Full name"
                    value={formGuest}
                    onChange={e => setFormGuest(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="cal-drawer-label">Booking Type</span>
                  <div className="cal-drawer-toggle" role="group" aria-label="Booking type">
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'guest' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('guest')}
                      aria-pressed={formType === 'guest'}
                    >
                      Guest
                    </button>
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'owner' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('owner')}
                      aria-pressed={formType === 'owner'}
                    >
                      Owner Stay
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="drawer-checkin" className="cal-drawer-label">
                      Check-in
                    </label>
                    <input
                      id="drawer-checkin"
                      type="date"
                      className="cal-drawer-input"
                      value={formCheckIn}
                      min={todayStr()}
                      onChange={e => setFormCheckIn(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="drawer-checkout" className="cal-drawer-label">
                      Check-out
                    </label>
                    <input
                      id="drawer-checkout"
                      type="date"
                      className="cal-drawer-input"
                      value={formCheckOut}
                      min={formCheckIn || todayStr()}
                      onChange={e => setFormCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                {formCheckIn && formCheckOut && derivedNights > 0 && (
                  <span className="cal-drawer-nights">{derivedNights} nights</span>
                )}
                {dateError && <span className="cal-drawer-error" role="alert">{dateError}</span>}
                {overlapWarning && !dateError && (
                  <span className="cal-drawer-warning" role="status">
                    {overlapWarning} — saving anyway is allowed.
                  </span>
                )}

                <div className="flex gap-3 pt-1">
                  <button className="cal-drawer-btn cal-drawer-btn--save" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cal-drawer-btn cal-drawer-btn--close" onClick={onClose}>
                    Discard
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Verify in browser**

Navigate to calendar screen. Test these flows:

1. **View mode CTA hierarchy**: Tap a confirmed booking. Drawer shows: `[Edit]` (ghost) + `Cancel reservation` (text link far right). No Confirm button (already confirmed). Clear hierarchy — Edit is clearly primary.

2. **Cancel two-tap**: Tap a confirmed booking → tap "Cancel reservation" once → label changes to "Confirm cancel?" → tap again within 3s → booking dims in list. Tap once → wait 3s → button resets to "Cancel reservation" without cancelling.

3. **Handle closes**: Tap the handle bar at top of drawer → drawer closes.

4. **Overlap warning live**: In add mode, enter dates that overlap Whitfield booking (Jun 15–25) → warning appears immediately without needing to tap Save. Both dates needed before warning shows.

5. **Overlap allows save**: With overlapping dates, tap Save → booking is added (not blocked). Warning is informational only.

6. **Check-out min**: In add mode, set check-in to Jun 20 → click check-out picker → cannot select a date before Jun 20.

7. **Guest name in view mode**: Tap any booking → guest name renders in EB Garamond italic (larger, serif, not Instrument Sans).

8. **Reduced motion**: Enable "Reduce Motion" in OS accessibility settings → drawer appears instantly without slide animation.

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/calendar/BookingDrawer.tsx && rtk git commit -m "fix(calendar): CTA hierarchy, cancel two-tap confirmation, validate warns-not-blocks, live overlap, useReducedMotion, tappable handle, min date attrs, EB Garamond guest name in view mode"
```

---

## Self-Review

**Spec / critique coverage:**

| Issue | Task | Status |
|---|---|---|
| `--cal-owner-accent` undefined | Task 1 | ✓ Added to `:root` |
| `--cal-accent-ochre` vs hardcoded `#D49A55` | Task 1 | ✓ Two named tokens |
| Missing `.cal-booking-row__status--cancelled` | Task 1 | ✓ Added |
| `border-left` owner row (impeccable ban) | Task 1 | ✓ Replaced with tint |
| No scroll on booking list | Task 1 | ✓ max-height + overflow-y |
| `pending` flag on CalendarDay | Task 2 | ✓ Interface + buildCalendarDays |
| Chip is 5th item in 4-col grid | Task 3 | ✓ Wrapped in guest-cell flex |
| `datetime` → `dateTime` camelCase | Task 3 | ✓ Fixed |
| "Upcoming Arrivals" misleading label | Task 3 | ✓ Renamed "Reservations" |
| Empty state has no CTA | Task 3 | ✓ "+ Add a reservation" button |
| Guest names not EB Garamond italic (list) | Task 3 | ✓ `var(--font-serif)` + italic |
| `‹ ›` character arrows | Task 4 | ✓ SVG chevrons |
| Pending = Confirmed on grid | Task 4 | ✓ Hollow dot for pending |
| No dot legend | Task 4 | ✓ Conditional legend row |
| `validate()` blocks on overlap | Task 5 | ✓ Returns true (warn-only) |
| Cancel fires instantly | Task 5 | ✓ Two-tap with 3s timer |
| CTA hierarchy flat in drawer | Task 5 | ✓ Confirm fill / Edit ghost / Cancel text-link |
| `bg-[#242424]` not tokenized | Task 5 | ✓ `.cal-drawer-sheet` CSS class |
| No `prefers-reduced-motion` guard | Task 5 | ✓ `useReducedMotion()` |
| Handle doesn't close | Task 5 | ✓ `<button onClick={onClose}>` |
| Overlap warning only on save | Task 5 | ✓ Live via `useEffect` |
| No `min` on date inputs | Task 5 | ✓ `min={todayStr()}` and `min={formCheckIn}` |
| Guest name not EB Garamond italic (drawer) | Task 5 | ✓ `.cal-drawer-guest-name` |
| Overlap warning uses brand amber | Task 5 | ✓ `.cal-drawer-warning` overridden to white/60 |
| `aria-pressed` on type toggle | Task 5 | ✓ Added |
| `role="alert"` on error | Task 5 | ✓ Added |

**No placeholders found. Type consistency verified: `Booking`, `DrawerMode`, `BookingType`, `CalendarDay` all originate in `bookingUtils.ts` and imported identically across all files.**
