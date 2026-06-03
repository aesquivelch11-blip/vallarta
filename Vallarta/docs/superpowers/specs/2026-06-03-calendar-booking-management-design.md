# Calendar Booking Management — Design Spec
**Date:** 2026-06-03  
**Status:** Approved  

---

## Overview

Transform the static `CalendarView` into a functional booking management screen. The estate owner/manager can view, approve, edit, cancel, and create reservations. Owner personal stays are visually distinct from guest bookings. All state is local (resets on refresh).

---

## Data Model

```ts
type BookingType = 'guest' | 'owner';
type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

interface Booking {
  id: string;           // crypto.randomUUID()
  guest: string;        // guest name, or owner name for owner stays
  type: BookingType;
  checkIn: string;      // "YYYY-MM-DD"
  checkOut: string;     // "YYYY-MM-DD"
  nights: number;       // stored explicitly (derived from dates)
  status: BookingStatus;
}
```

`CalendarDay` gains `ownerStay?: boolean` so the grid renders two distinct occupied states. The month grid is derived dynamically from `{ year, month }` + active bookings — no more hardcoded arrays.

---

## Component Structure

```
CalendarView (orchestrator)
├── state: bookings[], selectedBooking, showDrawer, drawerMode, currentMonth, currentYear
│
├── CalendarGrid
│   ├── prev/next month arrows + "Month YYYY" header
│   ├── day grid derived from bookings + currentMonth
│   │   ├── guest booked days → neutral (existing cal-day--booked)
│   │   ├── owner stay days  → warm amber (cal-day--owner)
│   │   └── checkin/checkout dot variants per type
│   └── props: days[], year, month, onPrevMonth, onNextMonth
│
├── BookingList
│   ├── "+" button in header → opens drawer in 'add' mode
│   ├── rows: all bookings with checkIn >= today, sorted ascending by checkIn
│   ├── owner rows: amber left-border + "Owner Stay" chip
│   ├── cancelled rows: muted opacity, strikethrough date
│   └── tap row → opens drawer in 'view' mode
│
└── BookingDrawer
    ├── Framer Motion sheet — y: '100%' → 0, backdrop tap closes
    ├── mode: 'view' | 'edit' | 'add'
    │   ├── view: name, dates, nights, status badge
    │   │        [Confirm] (hidden if Confirmed) | [Edit] | [Cancel] (hidden if Cancelled)
    │   ├── edit: pre-filled form fields
    │   └── add:  guest name input, Guest/Owner toggle pill,
    │             check-in input, check-out input, auto-calc nights display
    └── props: booking?, mode, onSave, onConfirm, onCancel, onClose
```

---

## Visual Language

### Calendar Grid
| State | Class | Color |
|---|---|---|
| Guest booked | `cal-day--booked` | existing neutral |
| Owner stay | `cal-day--owner` | warm amber (`#C9B8A0` family) |
| Check-in/out dot | `cal-day__dot` | variant per type |

### Booking List
- **Guest rows:** existing style unchanged
- **Owner rows:** amber left-border (`border-l-2 border-[#C9B8A0]`) + `Owner Stay` amber chip
- **Cancelled rows:** `opacity-50`, date text `line-through`

### BookingDrawer
- Background: `bg-[#242424]` with `border-t border-[#C9B8A0]/30` — matches toast aesthetic
- Motion: `y: '100%' → 0`, spring ease consistent with app transitions
- Backdrop: `bg-black/40`, tap closes
- **Confirm** button: amber fill (`bg-[#C9B8A0]`, dark text)
- **Edit** button: ghost border (`border-[#C9B8A0]/50`, light text)
- **Cancel** button: muted destructive (`text-red-400/70`)
- **Guest/Owner toggle:** pill switcher — owner selected = amber background

### Month Navigation
- `‹` / `›` arrows flank "June 2026" label in CalendarGrid header
- Empty month: list renders "No reservations for [Month YYYY]"

---

## State Mutations

| Action | Effect |
|---|---|
| **Confirm** | `status → 'Confirmed'`, calendar updates |
| **Cancel** | `status → 'Cancelled'`, days un-mark as booked |
| **Edit** | Replace booking in array by `id`, calendar re-derives |
| **Add** | Append new booking with `crypto.randomUUID()` |

---

## Validation & Edge Cases

- Check-out must be after check-in — inline error in drawer if violated
- Nights auto-calculated; shows `—` if dates invalid
- Overlapping bookings: drawer warns ("Dates overlap with [Name]") but does not block save
- Drawer opened defensively with no selection: closes itself
- No persistence indicators needed (local state only)

---

## Out of Scope

- Backend / API integration
- Tap-to-select dates on calendar grid (future enhancement)
- Multi-property support
- Push notifications for booking changes
