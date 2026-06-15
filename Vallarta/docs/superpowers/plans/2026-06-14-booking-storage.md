# Booking Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded `SEED_BOOKINGS` in-memory state with Supabase-backed persistence, scoped per property, using TanStack React Query for async state management.

**Architecture:** Supabase JS client calls a thin service layer (`src/lib/bookings.ts`) that maps DB snake_case to TS camelCase. React Query hooks (`src/hooks/useBookings.ts`) wrap those calls and cache results. `CalendarView` swaps its `useState` for the hooks.

**Tech Stack:** `@supabase/supabase-js`, `@tanstack/react-query`, Vitest (already installed), `dotenv` (already installed), `tsx` (already installed)

---

## Spec Reference

`docs/superpowers/specs/2026-06-14-booking-storage-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/supabase.ts` | Create | Supabase client singleton |
| `src/lib/bookings.ts` | Create | CRUD service functions, snake↔camel mapping |
| `src/lib/seed.ts` | Create | One-time seed script — delete after running |
| `src/hooks/useBookings.ts` | Create | React Query hooks for bookings |
| `src/components/calendar/bookingUtils.ts` | Modify | Add `property_id`, optional fields, `DbBooking` type, `mapDbBooking`, `mapToDbBooking` |
| `src/components/CalendarView.tsx` | Modify | Swap `useState` for hooks, add `propertyId` prop |
| `src/main.tsx` | Modify | Wrap app in `QueryClientProvider` |
| `.env.example` | Create | Template for env vars |
| `.env` | Create locally | Actual secrets (gitignored) |
| `tests/lib/bookingMapper.test.ts` | Create | Unit tests for pure mapper functions |

---

## Database Setup (do this before Task 1)

Run the following SQL in your Supabase project's SQL editor (Dashboard → SQL Editor → New query):

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

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

Get your project URL and anon key from: Supabase Dashboard → Project Settings → API.

---

## Task 1: Install Dependencies + Env Files

**Files:**
- Create: `.env.example`
- Create: `.env` (locally only — gitignored)

- [ ] **Step 1: Install packages**

```bash
npm install @supabase/supabase-js @tanstack/react-query
```

Expected: both packages appear in `package.json` `dependencies`.

- [ ] **Step 2: Create `.env.example`**

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_DEFAULT_PROPERTY_ID=<uuid-filled-in-after-seed>
```

- [ ] **Step 3: Create `.env` with real values**

Copy `.env.example` to `.env` and fill in your Supabase URL and anon key. Leave `VITE_DEFAULT_PROPERTY_ID` blank for now — you get it after running the seed in Task 8.

- [ ] **Step 4: Confirm `.env` is gitignored**

Check `.gitignore` contains `.env`. If not, add it:

```bash
echo ".env" >> .gitignore
```

- [ ] **Step 5: Commit**

```bash
git add .env.example .gitignore package.json package-lock.json
git commit -m "chore: add supabase + react-query deps, env template"
```

---

## Task 2: Supabase Client Singleton

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Create client file**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(url, key);
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat: supabase client singleton"
```

---

## Task 3: Extend Booking Type + DB Mappers

**Files:**
- Modify: `src/components/calendar/bookingUtils.ts`
- Create: `tests/lib/bookingMapper.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/lib/bookingMapper.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { mapDbBooking, mapToDbBooking } from '../../src/components/calendar/bookingUtils';
import type { DbBooking } from '../../src/components/calendar/bookingUtils';

const fullDbRow: DbBooking = {
  id: 'abc-123',
  property_id: 'prop-456',
  guest: 'Jane Doe',
  type: 'guest',
  check_in: '2026-07-01',
  check_out: '2026-07-05',
  nights: 4,
  status: 'Confirmed',
  revenue_nightly_rate: 500,
  revenue_total: 2000,
  guest_email: 'jane@example.com',
  guest_phone: '+1 555 0100',
  notes: 'Late arrival',
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
};

describe('mapDbBooking', () => {
  it('maps snake_case DB fields to camelCase Booking', () => {
    const booking = mapDbBooking(fullDbRow);
    expect(booking.id).toBe('abc-123');
    expect(booking.property_id).toBe('prop-456');
    expect(booking.checkIn).toBe('2026-07-01');
    expect(booking.checkOut).toBe('2026-07-05');
    expect(booking.revenueNightlyRate).toBe(500);
    expect(booking.revenueTotal).toBe(2000);
    expect(booking.guestEmail).toBe('jane@example.com');
    expect(booking.guestPhone).toBe('+1 555 0100');
    expect(booking.notes).toBe('Late arrival');
  });

  it('converts null optional DB fields to undefined', () => {
    const nullRow: DbBooking = {
      ...fullDbRow,
      revenue_nightly_rate: null,
      revenue_total: null,
      guest_email: null,
      guest_phone: null,
      notes: null,
    };
    const booking = mapDbBooking(nullRow);
    expect(booking.revenueNightlyRate).toBeUndefined();
    expect(booking.revenueTotal).toBeUndefined();
    expect(booking.guestEmail).toBeUndefined();
    expect(booking.guestPhone).toBeUndefined();
    expect(booking.notes).toBeUndefined();
  });
});

describe('mapToDbBooking', () => {
  it('maps camelCase Booking to snake_case DB shape', () => {
    const row = mapToDbBooking({
      property_id: 'prop-456',
      guest: 'Jane Doe',
      type: 'guest',
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      nights: 4,
      status: 'Confirmed',
      revenueNightlyRate: 500,
      revenueTotal: 2000,
      guestEmail: 'jane@example.com',
      guestPhone: '+1 555 0100',
      notes: 'Late arrival',
    });
    expect(row.check_in).toBe('2026-07-01');
    expect(row.check_out).toBe('2026-07-05');
    expect(row.revenue_nightly_rate).toBe(500);
    expect(row.revenue_total).toBe(2000);
    expect(row.guest_email).toBe('jane@example.com');
    expect(row.guest_phone).toBe('+1 555 0100');
    expect(row.notes).toBe('Late arrival');
  });

  it('converts undefined optional fields to null for DB', () => {
    const row = mapToDbBooking({
      property_id: 'prop-456',
      guest: 'Jane Doe',
      type: 'guest',
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      nights: 4,
      status: 'Confirmed',
    });
    expect(row.revenue_nightly_rate).toBeNull();
    expect(row.revenue_total).toBeNull();
    expect(row.guest_email).toBeNull();
    expect(row.guest_phone).toBeNull();
    expect(row.notes).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npx vitest run tests/lib/bookingMapper.test.ts
```

Expected: FAIL — `mapDbBooking` and `mapToDbBooking` not found, `DbBooking` not exported.

- [ ] **Step 3: Extend `bookingUtils.ts`**

Replace the existing `Booking` interface and add new exports. The file currently has `Booking` at line 6. Replace lines 3–14 (the types block) with:

```typescript
export type BookingType = 'guest' | 'owner';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled';

export interface Booking {
  id: string;
  property_id: string;
  guest: string;
  type: BookingType;
  checkIn: string;   // "YYYY-MM-DD"
  checkOut: string;  // "YYYY-MM-DD"
  nights: number;
  status: BookingStatus;
  // optional — stored in DB, shown/edited in BookingPanel
  revenueNightlyRate?: number;
  revenueTotal?: number;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
}

/** Raw shape returned by Supabase — snake_case column names. */
export interface DbBooking {
  id: string;
  property_id: string;
  guest: string;
  type: BookingType;
  check_in: string;
  check_out: string;
  nights: number;
  status: BookingStatus;
  revenue_nightly_rate: number | null;
  revenue_total: number | null;
  guest_email: string | null;
  guest_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** Maps a raw Supabase row to a typed Booking. */
export function mapDbBooking(row: DbBooking): Booking {
  return {
    id: row.id,
    property_id: row.property_id,
    guest: row.guest,
    type: row.type,
    checkIn: row.check_in,
    checkOut: row.check_out,
    nights: row.nights,
    status: row.status,
    revenueNightlyRate: row.revenue_nightly_rate ?? undefined,
    revenueTotal: row.revenue_total ?? undefined,
    guestEmail: row.guest_email ?? undefined,
    guestPhone: row.guest_phone ?? undefined,
    notes: row.notes ?? undefined,
  };
}

/** Maps a Booking (without id) to the DB insert/update shape. */
export function mapToDbBooking(
  booking: Omit<Booking, 'id'>,
): Omit<DbBooking, 'id' | 'created_at' | 'updated_at'> {
  return {
    property_id: booking.property_id,
    guest: booking.guest,
    type: booking.type,
    check_in: booking.checkIn,
    check_out: booking.checkOut,
    nights: booking.nights,
    status: booking.status,
    revenue_nightly_rate: booking.revenueNightlyRate ?? null,
    revenue_total: booking.revenueTotal ?? null,
    guest_email: booking.guestEmail ?? null,
    guest_phone: booking.guestPhone ?? null,
    notes: booking.notes ?? null,
  };
}
```

Also update `SEED_BOOKINGS` to add `property_id: ''` on each entry so TypeScript is satisfied (placeholder — seed script fills real IDs). Replace the entire `SEED_BOOKINGS` constant with:

```typescript
export const SEED_BOOKINGS: Booking[] = [
  {
    id: '1',
    property_id: '',
    guest: 'Margaret & James Whitfield',
    type: 'guest',
    checkIn: '2026-06-19',
    checkOut: '2026-06-24',
    nights: 5,
    status: 'Confirmed',
  },
  {
    id: '2',
    property_id: '',
    guest: 'Santiago Reyes',
    type: 'guest',
    checkIn: '2026-06-28',
    checkOut: '2026-06-30',
    nights: 2,
    status: 'Confirmed',
  },
  {
    id: '3',
    property_id: '',
    guest: 'The Brenner Family',
    type: 'guest',
    checkIn: '2026-07-02',
    checkOut: '2026-07-08',
    nights: 6,
    status: 'Pending',
  },
];
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npx vitest run tests/lib/bookingMapper.test.ts
```

Expected: all 4 tests PASS.

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/calendar/bookingUtils.ts tests/lib/bookingMapper.test.ts
git commit -m "feat(types): extend Booking with property_id, optional fields, DB mappers"
```

---

## Task 4: Service Layer

**Files:**
- Create: `src/lib/bookings.ts`

No unit tests here — these functions call the Supabase network. They're covered by the end-to-end test in Task 9.

- [ ] **Step 1: Create `src/lib/bookings.ts`**

```typescript
// src/lib/bookings.ts
import { supabase } from './supabase';
import {
  Booking,
  DbBooking,
  mapDbBooking,
  mapToDbBooking,
} from '../components/calendar/bookingUtils';

export async function fetchBookings(propertyId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('check_in', { ascending: true });
  if (error) throw error;
  return (data as DbBooking[]).map(mapDbBooking);
}

export async function createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(mapToDbBooking(booking))
    .select()
    .single();
  if (error) throw error;
  return mapDbBooking(data as DbBooking);
}

export async function updateBooking(booking: Booking): Promise<Booking> {
  const { id, ...rest } = booking;
  const { data, error } = await supabase
    .from('bookings')
    .update(mapToDbBooking(rest))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapDbBooking(data as DbBooking);
}

export async function cancelBooking(id: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'Cancelled' })
    .eq('id', id);
  if (error) throw error;
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/bookings.ts
git commit -m "feat: bookings service layer — fetchBookings, createBooking, updateBooking, cancelBooking"
```

---

## Task 5: Add QueryClientProvider

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1: Wrap app in QueryClientProvider**

Replace the full contents of `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@fontsource-variable/eb-garamond';
import '@fontsource-variable/eb-garamond/wght-italic.css';
import '@fontsource/instrument-sans/latin-400.css';
import '@fontsource/instrument-sans/latin-500.css';
import '@fontsource/instrument-sans/latin-600.css';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "feat: wrap app in QueryClientProvider"
```

---

## Task 6: React Query Hooks

**Files:**
- Create: `src/hooks/useBookings.ts`

- [ ] **Step 1: Create hooks file**

```typescript
// src/hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking } from '../components/calendar/bookingUtils';
import {
  fetchBookings,
  createBooking,
  updateBooking,
  cancelBooking,
} from '../lib/bookings';

export function useBookings(propertyId: string) {
  return useQuery({
    queryKey: ['bookings', propertyId],
    queryFn: () => fetchBookings(propertyId),
    enabled: !!propertyId,
  });
}

export function useCreateBooking(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (booking: Omit<Booking, 'id'>) => createBooking(booking),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] }),
  });
}

export function useUpdateBooking(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (booking: Booking) => updateBooking(booking),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] }),
  });
}

export function useCancelBooking(propertyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['bookings', propertyId] }),
  });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useBookings.ts
git commit -m "feat: React Query hooks — useBookings, useCreateBooking, useUpdateBooking, useCancelBooking"
```

---

## Task 7: Wire CalendarView

**Files:**
- Modify: `src/components/CalendarView.tsx`

- [ ] **Step 1: Update imports and props interface**

At the top of `CalendarView.tsx`, add to the existing imports:

```tsx
import {
  useBookings,
  useCreateBooking,
  useUpdateBooking,
  useCancelBooking,
} from '../hooks/useBookings';
```

Remove `SEED_BOOKINGS` from the `bookingUtils` import — the line currently reads:
```tsx
import {
  Booking,
  SEED_BOOKINGS,
  buildCalendarDays,
} from './calendar/bookingUtils';
```
Change to:
```tsx
import {
  Booking,
  buildCalendarDays,
} from './calendar/bookingUtils';
```

Update `CalendarViewProps` to add `propertyId`:
```tsx
interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
  propertyId?: string;
}
```

- [ ] **Step 2: Replace useState + handlers with hooks**

In the component signature, add `propertyId`:
```tsx
export default function CalendarView({
  onNavigate,
  onNotify,
  propertyId = import.meta.env.VITE_DEFAULT_PROPERTY_ID as string,
}: CalendarViewProps) {
```

Replace the bookings `useState` line:
```tsx
// REMOVE this line:
const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
```

Add below the other state declarations:
```tsx
const { data: bookings = [], isLoading: bookingsLoading } = useBookings(propertyId);
const createMutation = useCreateBooking(propertyId);
const updateMutation = useUpdateBooking(propertyId);
const cancelMutation = useCancelBooking(propertyId);
```

- [ ] **Step 3: Replace handlers**

Replace `handleConfirmBooking`:
```tsx
const handleConfirmBooking = (id: string) => {
  const booking = bookings.find(b => b.id === id);
  if (!booking) return;
  updateMutation.mutate(
    { ...booking, status: 'Confirmed' },
    {
      onSuccess: () => {
        notify('Reservation confirmed.');
        setShowPanel(false);
      },
    },
  );
};
```

Replace `handleCancelBooking`:
```tsx
const handleCancelBooking = (id: string) => {
  cancelMutation.mutate(id, {
    onSuccess: () => {
      notify('Reservation cancelled.');
      setShowPanel(false);
    },
  });
};
```

Replace `handleSaveBooking`:
```tsx
const handleSaveBooking = (saved: Booking) => {
  const bookingWithProperty = { ...saved, property_id: propertyId };
  if (panelMode === 'add') {
    const { id: _, ...rest } = bookingWithProperty;
    createMutation.mutate(rest, {
      onSuccess: () => {
        notify(`Booking added for ${saved.guest}.`);
        setShowPanel(false);
      },
    });
  } else {
    updateMutation.mutate(bookingWithProperty, {
      onSuccess: () => {
        notify(`Booking updated for ${saved.guest}.`);
        setShowPanel(false);
      },
    });
  }
};
```

- [ ] **Step 4: Wire `isLoading` to BookingList**

Find the `BookingList` usage (currently `loading={false}`) and change to:
```tsx
<BookingList
  bookings={bookings}
  onSelect={handleSelectBooking}
  onAdd={handleAddBooking}
  loading={bookingsLoading}
  viewToggle={...}
/>
```

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Run existing tests**

```bash
npx vitest run
```

Expected: all tests pass (mapper tests + PropertyCard tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/CalendarView.tsx
git commit -m "feat(calendar): wire useBookings hooks, replace useState + setBookings with mutations"
```

---

## Task 8: Seed Script

**Files:**
- Create: `src/lib/seed.ts`

Run this once, then delete the file.

- [ ] **Step 1: Create `src/lib/seed.ts`**

```typescript
// src/lib/seed.ts — ONE-TIME SEED. Delete after running.
import { config } from 'dotenv';
config(); // loads .env for Node (not Vite)

import { createClient } from '@supabase/supabase-js';
import { SEED_BOOKINGS } from '../components/calendar/bookingUtils';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
);

async function seed() {
  // 1. Insert the property
  const { data: property, error: propError } = await supabase
    .from('properties')
    .insert({ name: 'Vallarta Estates', location: 'Puerto Vallarta, Mexico' })
    .select()
    .single();

  if (propError) {
    console.error('Failed to insert property:', propError.message);
    process.exit(1);
  }

  console.log('✓ Property created:', property.id);

  // 2. Insert seed bookings
  const dbBookings = SEED_BOOKINGS.map(b => ({
    property_id: property.id,
    guest: b.guest,
    type: b.type,
    check_in: b.checkIn,
    check_out: b.checkOut,
    nights: b.nights,
    status: b.status,
  }));

  const { error: bookingsError } = await supabase
    .from('bookings')
    .insert(dbBookings);

  if (bookingsError) {
    console.error('Failed to insert bookings:', bookingsError.message);
    process.exit(1);
  }

  console.log(`✓ Seeded ${dbBookings.length} bookings.`);
  console.log('');
  console.log('Add to .env:');
  console.log(`VITE_DEFAULT_PROPERTY_ID=${property.id}`);
}

seed().catch(console.error);
```

- [ ] **Step 2: Run the seed**

```bash
npx tsx src/lib/seed.ts
```

Expected output:
```
✓ Property created: <some-uuid>
✓ Seeded 3 bookings.

Add to .env:
VITE_DEFAULT_PROPERTY_ID=<some-uuid>
```

- [ ] **Step 3: Copy the UUID into `.env`**

Add the printed UUID to `.env`:
```
VITE_DEFAULT_PROPERTY_ID=<uuid-from-output>
```

- [ ] **Step 4: Verify data in Supabase**

In Supabase Dashboard → Table Editor → `bookings`: confirm 3 rows exist with the correct property_id.

- [ ] **Step 5: Delete the seed file**

```bash
rm src/lib/seed.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/seed.ts .env.example
git commit -m "chore: remove seed script (data seeded to Supabase)"
```

Note: `.env` is gitignored and not committed. The `property_id` lives only in the local `.env`.

---

## Task 9: End-to-End Verification

No code changes — confirm the full flow works.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify bookings load**

Open the app → navigate to Calendar. The BookingList should show the 3 seeded bookings (loading spinner briefly, then list appears). If blank or spinning indefinitely, check browser console for Supabase errors — likely a missing or wrong env var.

- [ ] **Step 3: Verify add booking**

Click `+ New` → fill in guest name, dates → click `Confirm Reservation`. Toast should appear. Booking should appear in the list. Check Supabase Table Editor to confirm the row was inserted.

- [ ] **Step 4: Verify edit booking**

Click a booking → `Edit Details` → change guest name → `Confirm Reservation`. Booking in list should update. Verify in Supabase.

- [ ] **Step 5: Verify cancel booking**

Click a booking → `Cancel reservation` → confirm tap. Booking removed from upcoming list. Verify `status = 'Cancelled'` in Supabase.

- [ ] **Step 6: Verify confirm pending booking**

In Supabase Table Editor, manually set one booking's `status` to `Pending`. Reload app. Click that booking → `Confirm Booking`. Verify it becomes `Confirmed` in list and in Supabase.

- [ ] **Step 7: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 8: Final commit**

```bash
git add .
git commit -m "feat: Supabase booking persistence — verified end-to-end"
```

---

## Done

After Task 9, the calendar reads from and writes to Supabase. Bookings survive page refresh. The `propertyId` prop on `CalendarView` is ready for multi-property switching — wire `App.tsx` to pass the selected property's ID when that feature is built.
