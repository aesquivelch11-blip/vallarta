# Calendar Booking Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the static CalendarView into a functional booking management screen where the estate manager can view, approve, edit, cancel, and create reservations — with owner personal stays visually distinct from guest bookings.

**Architecture:** Component decomposition — CalendarView becomes an orchestrator holding all state, delegating rendering to CalendarGrid, BookingList, and BookingDrawer. All data is local React state (resets on refresh). Pure utility functions handle date math and calendar grid derivation.

**Tech Stack:** React 19, TypeScript, Framer Motion (`motion/react`), Tailwind v4, CSS classes in `design-tokens.css`

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Create** | `src/components/calendar/bookingUtils.ts` | Types, seed data, pure functions (buildCalendarDays, calcNights, findOverlap, formatDisplayDates) |
| **Create** | `src/components/calendar/CalendarGrid.tsx` | Month grid with prev/next nav |
| **Create** | `src/components/calendar/BookingList.tsx` | Booking list with + button |
| **Create** | `src/components/calendar/BookingDrawer.tsx` | Bottom sheet for view/edit/add |
| **Modify** | `src/components/CalendarView.tsx` | Orchestrator — strip hardcoded data, wire state + subcomponents |
| **Modify** | `src/design-tokens.css` | Add `.cal-day--owner`, `.cal-booking-row--owner`, `.cal-booking-row--cancelled`, `.cal-booking-row__chip`, `.cal-month-nav`, `.cal-add-btn`, `.cal-drawer-*` classes |

---

## Task 1: Types + Utility Functions

**Files:**
- Create: `src/components/calendar/bookingUtils.ts`

- [ ] **Step 1: Create the file**

```ts
// src/components/calendar/bookingUtils.ts

export type BookingType = 'guest' | 'owner';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Booking {
  id: string;
  guest: string;
  type: BookingType;
  checkIn: string;   // "YYYY-MM-DD"
  checkOut: string;  // "YYYY-MM-DD"
  nights: number;
  status: BookingStatus;
}

export interface CalendarDay {
  day: number;
  empty?: boolean;
  booked?: boolean;
  ownerStay?: boolean;
  today?: boolean;
  checkin?: boolean;
  checkout?: boolean;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const SEED_BOOKINGS: Booking[] = [
  {
    id: '1',
    guest: 'Margaret & James Whitfield',
    type: 'guest',
    checkIn: '2026-06-19',
    checkOut: '2026-06-24',
    nights: 5,
    status: 'Confirmed',
  },
  {
    id: '2',
    guest: 'Santiago Reyes',
    type: 'guest',
    checkIn: '2026-06-28',
    checkOut: '2026-06-30',
    nights: 2,
    status: 'Confirmed',
  },
  {
    id: '3',
    guest: 'The Brenner Family',
    type: 'guest',
    checkIn: '2026-07-02',
    checkOut: '2026-07-08',
    nights: 6,
    status: 'Pending',
  },
];

/** Builds the flat array of CalendarDay cells for a given month + booking set. */
export function buildCalendarDays(
  year: number,
  month: number, // 0-indexed (0=January)
  bookings: Booking[],
): CalendarDay[] {
  const todayStr = new Date().toISOString().slice(0, 10);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sunday
  const offset = (firstDayOfWeek + 6) % 7; // Monday-first grid offset

  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const days: CalendarDay[] = [];

  for (let i = 0; i < offset; i++) {
    days.push({ day: 0, empty: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr;

    let booked = false;
    let ownerStay = false;
    let checkin = false;
    let checkout = false;

    for (const b of activeBookings) {
      if (dateStr === b.checkIn) {
        checkin = true;
        if (b.type === 'owner') ownerStay = true;
      } else if (dateStr === b.checkOut) {
        checkout = true;
        if (b.type === 'owner') ownerStay = true;
      } else if (dateStr > b.checkIn && dateStr < b.checkOut) {
        booked = true;
        if (b.type === 'owner') ownerStay = true;
      }
    }

    days.push({ day: d, today: isToday, booked, ownerStay, checkin, checkout });
  }

  return days;
}

/** Returns number of nights between two YYYY-MM-DD strings. Returns 0 if invalid. */
export function calcNights(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (isNaN(a) || isNaN(b) || b <= a) return 0;
  return Math.round((b - a) / 86_400_000);
}

/**
 * Returns the first booking that overlaps [checkIn, checkOut),
 * excluding the booking with excludeId (used during edits).
 * Returns null if no overlap.
 */
export function findOverlap(
  checkIn: string,
  checkOut: string,
  bookings: Booking[],
  excludeId?: string,
): Booking | null {
  for (const b of bookings) {
    if (b.id === excludeId) continue;
    if (b.status === 'Cancelled') continue;
    if (checkIn < b.checkOut && checkOut > b.checkIn) return b;
  }
  return null;
}

/** Formats two YYYY-MM-DD dates as "Jun 19 — Jun 24". */
export function formatDisplayDates(checkIn: string, checkOut: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const inDate = new Date(checkIn + 'T00:00:00');
  const outDate = new Date(checkOut + 'T00:00:00');
  if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) return '—';
  return `${inDate.toLocaleDateString('en-US', opts)} — ${outDate.toLocaleDateString('en-US', opts)}`;
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors related to bookingUtils.ts

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/calendar/bookingUtils.ts && rtk git commit -m "feat(calendar): add Booking types and pure utility functions"
```

---

## Task 2: CSS — New Visual States

**Files:**
- Modify: `src/design-tokens.css`

- [ ] **Step 1: Add owner day state, cancelled booking row, owner row, chip, month nav, add button, and drawer tokens**

Find the block ending at `.cal-day--today { ... }` in `design-tokens.css` (around line 1328) and add immediately after it:

```css
.cal-day--owner {
  color: #C9B8A0;
  opacity: 0.9;
}

.cal-day__dot--owner {
  background: #C9B8A0;
}
```

Find `.cal-bookings__header {` and replace the entire block up through `.cal-bookings__meta {` with:

```css
.cal-bookings__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: clamp(12px, 2vh, 20px);
  border-bottom: 1px solid var(--cal-booking-border);
  gap: 12px;
}

.cal-bookings__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cal-bookings__title {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: rgba(255,255,255,0.9);
}

.cal-bookings__meta {
  font-family: var(--font-ui);
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

.cal-add-btn {
  font-family: var(--font-ui);
  font-size: 1.25rem;
  line-height: 1;
  color: #C9B8A0;
  background: none;
  border: 1px solid rgba(201,184,160,0.3);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  flex-shrink: 0;
}

.cal-add-btn:hover {
  background: rgba(201,184,160,0.1);
  border-color: rgba(201,184,160,0.6);
}

.cal-add-btn:focus-visible {
  outline: 2px solid rgba(201,184,160,0.6);
  outline-offset: 3px;
  border-radius: 50%;
}
```

At the end of the calendar CSS block, before any responsive overrides, add:

```css
/* ─── Month nav ─── */
.cal-month-nav {
  display: flex;
  align-items: flex-start;
  gap: clamp(12px, 2vw, 24px);
  margin-bottom: clamp(12px, 2vh, 20px);
}

.cal-month-nav__arrow {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.6);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s ease;
  line-height: 1;
  align-self: center;
}

.cal-month-nav__arrow:hover {
  color: #ffffff;
}

.cal-month-nav__arrow:focus-visible {
  outline: 2px solid rgba(255,255,255,0.5);
  outline-offset: 4px;
  border-radius: 2px;
}

/* ─── Booking row variants ─── */
.cal-booking-row--owner {
  border-left: 2px solid #C9B8A0;
  padding-left: calc(clamp(12px, 2vw, 20px) - 2px);
}

.cal-booking-row--cancelled {
  opacity: 0.45;
}

.cal-booking-row__chip {
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  font-weight: 500;
  flex-shrink: 0;
}

.cal-booking-row__chip--owner {
  color: #C9B8A0;
  border: 1px solid rgba(201,184,160,0.4);
}

.cal-bookings__empty {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.1em;
  padding: clamp(16px, 3vh, 28px) 0;
  text-align: center;
}

/* ─── Booking Drawer ─── */
.cal-drawer-label {
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  display: block;
  margin-bottom: 4px;
}

.cal-drawer-value {
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: rgba(255,255,255,0.9);
}

.cal-drawer-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(201,184,160,0.2);
  border-radius: 10px;
  padding: 10px 14px;
  font-family: var(--font-ui);
  font-size: 0.875rem;
  color: #ffffff;
  outline: none;
  transition: border-color 0.2s ease;
}

.cal-drawer-input:focus {
  border-color: rgba(201,184,160,0.6);
}

.cal-drawer-input::placeholder {
  color: rgba(255,255,255,0.25);
}

.cal-drawer-toggle {
  display: flex;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  padding: 3px;
  gap: 2px;
}

.cal-drawer-toggle__option {
  flex: 1;
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 7px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  color: rgba(255,255,255,0.5);
  background: transparent;
}

.cal-drawer-toggle__option--active {
  background: #C9B8A0;
  color: #1a1a1a;
}

.cal-drawer-btn {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 12px 20px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
  flex: 1;
}

.cal-drawer-btn:hover { opacity: 0.85; }

.cal-drawer-btn--confirm {
  background: #C9B8A0;
  color: #1a1a1a;
}

.cal-drawer-btn--edit {
  background: transparent;
  border: 1px solid rgba(201,184,160,0.5);
  color: rgba(255,255,255,0.8);
}

.cal-drawer-btn--cancel {
  background: transparent;
  color: rgba(248,113,113,0.7);
  border: 1px solid rgba(248,113,113,0.25);
}

.cal-drawer-btn--save {
  background: #C9B8A0;
  color: #1a1a1a;
}

.cal-drawer-btn--close {
  background: transparent;
  color: rgba(255,255,255,0.4);
  border: 1px solid rgba(255,255,255,0.12);
}

.cal-drawer-error {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  color: rgba(248,113,113,0.85);
  letter-spacing: 0.05em;
}

.cal-drawer-warning {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  color: #C9B8A0;
  letter-spacing: 0.05em;
}

.cal-drawer-nights {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.1em;
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/design-tokens.css && rtk git commit -m "feat(calendar): add CSS for owner stays, booking drawer, month nav, and row variants"
```

---

## Task 3: CalendarGrid Component

**Files:**
- Create: `src/components/calendar/CalendarGrid.tsx`

- [ ] **Step 1: Create the component**

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

export default function CalendarGrid({ days, year, month, onPrevMonth, onNextMonth }: CalendarGridProps) {
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
            aria-label="Previous month"
            className="cal-month-nav__arrow"
          >
            ‹
          </button>
          <div>
            <div className="cal-month">{MONTH_NAMES[month]}</div>
            <div className="cal-year">{year}</div>
          </div>
          <button
            onClick={onNextMonth}
            aria-label="Next month"
            className="cal-month-nav__arrow"
          >
            ›
          </button>
        </div>

        <div role="grid" aria-label="Calendar days" className="cal-grid">
          {DAY_LABELS.map((label, i) => (
            <div
              key={`label-${i}`}
              role="columnheader"
              aria-label={label}
              className="cal-day-label"
            >
              {label}
            </div>
          ))}

          {days.map((d, i) => {
            const isBoth = d.checkin && d.checkout;
            return (
              <div
                key={`day-${i}`}
                role="gridcell"
                aria-label={
                  d.empty
                    ? undefined
                    : `${MONTH_NAMES[month]} ${d.day}, ${year}${d.booked ? ', booked' : ''}${d.today ? ', today' : ''}${d.checkin ? ', check-in' : ''}${d.checkout ? ', check-out' : ''}`
                }
                className={[
                  'cal-day',
                  d.empty ? 'cal-day--empty' : '',
                  d.booked && !d.ownerStay ? 'cal-day--booked' : '',
                  (d.booked || d.checkin || d.checkout) && d.ownerStay ? 'cal-day--owner' : '',
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
                    className={`cal-day__dot${d.ownerStay ? ' cal-day__dot--owner' : ''}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/calendar/CalendarGrid.tsx && rtk git commit -m "feat(calendar): add CalendarGrid component with month navigation"
```

---

## Task 4: BookingList Component

**Files:**
- Create: `src/components/calendar/BookingList.tsx`

- [ ] **Step 1: Create the component**

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
  const todayStr = new Date().toISOString().slice(0, 10);
  const visible = [...bookings]
    .filter(b => b.checkIn >= todayStr)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  const activeCount = bookings.filter(b => b.status !== 'Cancelled').length;

  return (
    <div role="region" aria-label="Upcoming arrivals" className="cal-bookings">
      <div className="cal-bookings__header">
        <h2 className="cal-bookings__title">Upcoming Arrivals</h2>
        <div className="cal-bookings__header-right">
          <span className="cal-bookings__meta">{activeCount} Active Reservations</span>
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
        <p className="cal-bookings__empty">No upcoming reservations</p>
      ) : (
        <ul role="list" className="cal-bookings__list">
          {visible.map(booking => (
            <li
              key={booking.id}
              role="listitem"
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
                className={`cal-booking-row__date${booking.status === 'Cancelled' ? ' line-through' : ''}`}
              >
                {formatDisplayDates(booking.checkIn, booking.checkOut)}
              </time>
              <span className="cal-booking-row__guest">{booking.guest}</span>
              {booking.type === 'owner' && (
                <span className="cal-booking-row__chip cal-booking-row__chip--owner">
                  Owner Stay
                </span>
              )}
              <span
                className={`cal-booking-row__status cal-booking-row__status--${booking.status.toLowerCase()}`}
              >
                {booking.status}
              </span>
              <span className="cal-booking-row__nights">{booking.nights} nights</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/calendar/BookingList.tsx && rtk git commit -m "feat(calendar): add BookingList component with owner row styling and add button"
```

---

## Task 5: BookingDrawer Component

**Files:**
- Create: `src/components/calendar/BookingDrawer.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/calendar/BookingDrawer.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  bookings: Booking[]; // full list for overlap detection
  onSave: (booking: Booking) => void;
  onConfirm: (id: string) => void;
  onCancelBooking: (id: string) => void;
  onEdit: () => void; // switches parent mode to 'edit'
  onClose: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const [formGuest, setFormGuest] = useState('');
  const [formType, setFormType] = useState<BookingType>('guest');
  const [formCheckIn, setFormCheckIn] = useState('');
  const [formCheckOut, setFormCheckOut] = useState('');
  const [dateError, setDateError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState('');

  // Populate form when switching to edit mode or opening add mode
  useEffect(() => {
    if (!open) return;
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
  }, [open, mode, booking]);

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
    const overlap = findOverlap(formCheckIn, formCheckOut, bookings, booking?.id);
    setOverlapWarning(overlap ? `Dates overlap with ${overlap.guest}` : '');
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
            transition={{ duration: 0.3 }}
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#242424] border-t border-[#C9B8A0]/30 rounded-t-[2rem] px-6 pt-4 pb-10 flex flex-col gap-5"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" aria-hidden="true" />

            {mode === 'view' && booking ? (
              /* ── View Mode ── */
              <>
                <div className="flex flex-col gap-1">
                  <span className="cal-drawer-label">Guest</span>
                  <span className="cal-drawer-value">{booking.guest}</span>
                  {booking.type === 'owner' && (
                    <span className="cal-booking-row__chip cal-booking-row__chip--owner self-start mt-1">
                      Owner Stay
                    </span>
                  )}
                </div>

                <div className="flex gap-6">
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

                <div className="flex gap-3 pt-1">
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
                  {booking.status !== 'Cancelled' && (
                    <button
                      className="cal-drawer-btn cal-drawer-btn--cancel"
                      onClick={() => onCancelBooking(booking.id)}
                    >
                      Cancel
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
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="cal-drawer-label">Booking Type</span>
                  <div className="cal-drawer-toggle">
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'guest' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('guest')}
                    >
                      Guest
                    </button>
                    <button
                      type="button"
                      className={`cal-drawer-toggle__option${formType === 'owner' ? ' cal-drawer-toggle__option--active' : ''}`}
                      onClick={() => setFormType('owner')}
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
                      onChange={e => setFormCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                {formCheckIn && formCheckOut && derivedNights > 0 && (
                  <span className="cal-drawer-nights">{derivedNights} nights</span>
                )}
                {dateError && <span className="cal-drawer-error">{dateError}</span>}
                {overlapWarning && !dateError && (
                  <span className="cal-drawer-warning">⚠ {overlapWarning}</span>
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

- [ ] **Step 3: Commit**

```bash
rtk git add src/components/calendar/BookingDrawer.tsx && rtk git commit -m "feat(calendar): add BookingDrawer bottom sheet with view/edit/add modes"
```

---

## Task 6: Refactor CalendarView as Orchestrator

**Files:**
- Modify: `src/components/CalendarView.tsx`

- [ ] **Step 1: Replace entire file contents**

```tsx
// src/components/CalendarView.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';
import {
  Booking,
  SEED_BOOKINGS,
  buildCalendarDays,
} from './calendar/bookingUtils';
import CalendarGrid from './calendar/CalendarGrid';
import BookingList from './calendar/BookingList';
import BookingDrawer, { DrawerMode } from './calendar/BookingDrawer';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>('view');

  const calendarDays = useMemo(
    () => buildCalendarDays(currentYear, currentMonth, bookings),
    [currentYear, currentMonth, bookings],
  );

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDrawerMode('view');
    setShowDrawer(true);
  };

  const handleAddBooking = () => {
    setSelectedBooking(null);
    setDrawerMode('add');
    setShowDrawer(true);
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  const handleConfirmBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Confirmed' } : b)),
    );
    onNotify?.('Reservation confirmed.');
    setShowDrawer(false);
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
    );
    onNotify?.('Reservation cancelled.');
    setShowDrawer(false);
  };

  const handleSaveBooking = (saved: Booking) => {
    setBookings(prev => {
      const exists = prev.find(b => b.id === saved.id);
      if (exists) {
        return prev.map(b => (b.id === saved.id ? saved : b));
      }
      return [...prev, saved];
    });
    onNotify?.(
      drawerMode === 'add'
        ? `Booking added for ${saved.guest}.`
        : `Booking updated for ${saved.guest}.`,
    );
    setShowDrawer(false);
  };

  const handleEdit = () => {
    setDrawerMode('edit');
  };

  return (
    <div className="cal-screen">
      {/* ─── Dark base overlay ─── */}
      <div aria-hidden="true" className="cal-base-overlay" />

      {/* ─── Asymmetric overlay ─── */}
      <div aria-hidden="true" className="cal-overlay" />

      {/* ─── Top Navigation ─── */}
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        className="cal-nav"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.3 }}
      >
        <button
          onClick={() => onNavigate('reporting', 'push')}
          aria-label="Go to Vallarta Estates dashboard"
          className="cal-nav__brand"
        >
          Vallarta Estates
        </button>
        <div className="cal-nav__right">
          <span className="cal-pill">Estate Supervisor</span>
          <div aria-hidden="true" className="cal-avatar">JD</div>
        </div>
      </motion.nav>

      {/* ─── Calendar Grid ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
      >
        <CalendarGrid
          days={calendarDays}
          year={currentYear}
          month={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </motion.div>

      {/* ─── Booking List ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.9 }}
      >
        <BookingList
          bookings={bookings}
          onSelect={handleSelectBooking}
          onAdd={handleAddBooking}
        />
      </motion.div>

      {/* ─── Booking Drawer ─── */}
      <BookingDrawer
        open={showDrawer}
        booking={selectedBooking}
        mode={drawerMode}
        bookings={bookings}
        onSave={handleSaveBooking}
        onConfirm={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
        onEdit={handleEdit}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `rtk lint`
Expected: no errors

- [ ] **Step 3: Start dev server and verify manually**

Run: `npm run dev` (opens at `http://localhost:4000`)

Check these flows in the browser:
1. Calendar screen loads — June grid renders with existing bookings colored correctly
2. `‹` / `›` arrows navigate months — grid rebuilds, empty months show "No upcoming reservations" in list
3. Tap a booking row — drawer slides up with guest name, dates, nights, status
4. Tap **Edit** in drawer — form pre-fills; change dates; tap Save — list and grid update
5. Tap **Confirm** on a Pending booking — status badge turns Confirmed; toast fires
6. Tap **Cancel** on a booking — row dims with strikethrough; calendar days clear
7. Tap **+** button — blank form opens; toggle Owner Stay → amber toggle activates; fill dates → nights auto-calculates; Save → owner row appears with amber border and "Owner Stay" chip; grid shows amber days

- [ ] **Step 4: Commit**

```bash
rtk git add src/components/CalendarView.tsx && rtk git commit -m "feat(calendar): refactor CalendarView as orchestrator — functional booking management with owner stays"
```

---

## Self-Review Checklist (completed inline)

- **Spec coverage:** ✓ Approve/reject pending → handleConfirmBooking. ✓ Edit → handleSaveBooking with existing id. ✓ Cancel confirmed → handleCancelBooking. ✓ Add new → handleAddBooking. ✓ Owner stays → type toggle, amber CSS, ownerStay flag on grid. ✓ Bottom sheet → BookingDrawer with AnimatePresence. ✓ Month nav → handlePrevMonth/NextMonth. ✓ Overlap warning → findOverlap in BookingDrawer. ✓ Date validation → validate() in BookingDrawer. ✓ Empty state → `visible.length === 0` in BookingList. ✓ Cancelled row → opacity + line-through.
- **No placeholders:** All steps contain actual code.
- **Type consistency:** `Booking`, `DrawerMode`, `BookingType`, `CalendarDay` defined once in `bookingUtils.ts` and imported everywhere. `onCancelBooking` prop named consistently between BookingDrawer definition and CalendarView usage.
