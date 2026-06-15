# Booking Storage Design

**Date:** 2026-06-14  
**Status:** Approved  
**Scope:** Persist calendar bookings to Supabase; extend `Booking` type with contact, revenue, notes; make data model multi-property ready.

---

## Context

Bookings currently live in `SEED_BOOKINGS` (hardcoded in `src/components/calendar/bookingUtils.ts`) and are held in React state via `useState` in `CalendarView.tsx`. They reset on every page refresh. The project is being handed over, so a real persistence layer is required.

---

## Architecture

**Stack addition:** Supabase (Postgres + REST + JS client) + TanStack React Query.

```
CalendarView
  └── useBookings(propertyId)          ← React Query hook
        └── src/hooks/useBookings.ts
              └── src/lib/bookings.ts  ← Supabase service layer
                    └── Supabase DB (bookings + properties tables)
```

No backend server. The Supabase JS client runs in the browser. Auth is open for now; Row Level Security can be added later without changing the service layer.

---

## Database Schema

Run in Supabase SQL editor:

```sql
CREATE TABLE properties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bookings (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id          UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest                TEXT NOT NULL,
  type                 TEXT NOT NULL CHECK (type IN ('guest', 'owner')),
  check_in             DATE NOT NULL,
  check_out            DATE NOT NULL,
  nights               INTEGER NOT NULL,
  status               TEXT NOT NULL DEFAULT 'Confirmed'
                         CHECK (status IN ('Confirmed', 'Pending', 'Cancelled')),
  revenue_nightly_rate NUMERIC(10,2),
  revenue_total        NUMERIC(10,2),
  guest_email          TEXT,
  guest_phone          TEXT,
  notes                TEXT,
  created_at           TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON bookings (property_id, check_in);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

`nights` is denormalized (matches existing `Booking` shape, avoids recomputing on reads).

---

## TypeScript Types

Extend `Booking` in `src/components/calendar/bookingUtils.ts`:

```typescript
export interface Booking {
  id: string;
  property_id: string;           // scopes booking to a property
  guest: string;
  type: BookingType;
  checkIn: string;               // YYYY-MM-DD (mapped from DB check_in)
  checkOut: string;              // YYYY-MM-DD (mapped from DB check_out)
  nights: number;
  status: BookingStatus;
  // optional — shown/edited in BookingPanel
  revenueNightlyRate?: number;
  revenueTotal?: number;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
}
```

All existing code that reads `Booking` continues to work — new fields are optional.

---

## Service Layer — `src/lib/bookings.ts`

Thin Supabase wrappers. No React. No side effects. Maps snake_case DB columns to camelCase TS fields.

| Function | DB operation |
|---|---|
| `fetchBookings(propertyId)` | `SELECT * FROM bookings WHERE property_id = ? ORDER BY check_in` |
| `createBooking(booking)` | `INSERT INTO bookings` |
| `updateBooking(id, changes)` | `UPDATE bookings SET ... WHERE id = ?` |
| `cancelBooking(id)` | `UPDATE bookings SET status = 'Cancelled' WHERE id = ?` |

Supabase client initialized once in `src/lib/supabase.ts` using env vars.

---

## React Query Hooks — `src/hooks/useBookings.ts`

```
useBookings(propertyId)   → { bookings, isLoading, error }
useCreateBooking()        → mutation; on success: invalidate bookings query
useUpdateBooking()        → mutation; on success: invalidate bookings query
useCancelBooking()        → mutation; on success: invalidate bookings query
```

Query key: `['bookings', propertyId]` — scoped per property, cache invalidated on any mutation.

---

## CalendarView Changes

| Before | After |
|---|---|
| `useState<Booking[]>(SEED_BOOKINGS)` | `useBookings(propertyId)` |
| `setBookings(...)` in handlers | mutation calls |
| `loading={false}` on BookingList | `loading={isLoading}` |

`propertyId` prop added to `CalendarView`. For now it defaults to the single Vallarta property ID from env. When multi-property switching is built, `App.tsx` passes the selected property ID down — no rearchitecting needed.

---

## Environment Variables

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_DEFAULT_PROPERTY_ID=<uuid-of-vallarta-property>
```

Add `.env` to `.gitignore`. Provide `.env.example` with blank values.

---

## Seed Data

One-time script `src/lib/seed.ts` (delete after running):

1. INSERT Vallarta Estates into `properties` → capture `property_id`
2. INSERT existing `SEED_BOOKINGS` mapped to that `property_id`
3. Copy the returned `property_id` into `.env` as `VITE_DEFAULT_PROPERTY_ID`

Run with: `npx tsx src/lib/seed.ts`

---

## Files Changed / Created

| File | Action |
|---|---|
| `src/lib/supabase.ts` | Create — client singleton |
| `src/lib/bookings.ts` | Create — service layer |
| `src/lib/seed.ts` | Create — one-time seed, delete after use |
| `src/hooks/useBookings.ts` | Create — React Query hooks |
| `src/components/calendar/bookingUtils.ts` | Edit — extend `Booking` type, keep `SEED_BOOKINGS` for reference until seed runs |
| `src/components/CalendarView.tsx` | Edit — swap useState for hooks, add propertyId prop |
| `.env.example` | Create |
| `.env` | Create locally (gitignored) |

---

## Out of Scope

- Auth / Row Level Security (add later without changing service layer)
- Multi-property switching UI (CalendarView already accepts `propertyId` prop)
- Revenue/contact fields in BookingPanel UI (schema ready, UI wiring is separate task)
- Real-time subscriptions (Supabase supports it; add later if needed)
