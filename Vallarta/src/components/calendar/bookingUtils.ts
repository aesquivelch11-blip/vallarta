// src/components/calendar/bookingUtils.ts

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

export interface CalendarDay {
  date: string;            // YYYY-MM-DD, "" for empty cells
  day: number;
  empty?: boolean;
  booked?: boolean;
  ownerStay?: boolean;
  pending?: boolean;
  today?: boolean;
  checkin?: boolean;
  checkout?: boolean;
  past?: boolean;          // strictly before today (computed at build time)
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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

/** Builds the flat array of CalendarDay cells for a given month + booking set. */
export function buildCalendarDays(
  year: number,
  month: number, // 0-indexed (0=January)
  bookings: Booking[],
): CalendarDay[] {
  const now = new Date();
const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sunday
  const offset = (firstDayOfWeek + 6) % 7; // Monday-first grid offset

  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const days: CalendarDay[] = [];

  for (let i = 0; i < offset; i++) {
    days.push({ date: '', day: 0, empty: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = date === todayStr;
    const isPast = date < todayStr;

    let booked = false;
    let ownerStay = false;
    let pending = false;
    let checkin = false;
    let checkout = false;

    for (const b of activeBookings) {
      const isPending = b.status === 'Pending';
      if (date === b.checkIn) {
        checkin = true;
        if (b.type === 'owner') ownerStay = true;
        if (isPending) pending = true;
      } else if (date === b.checkOut) {
        checkout = true;
        if (b.type === 'owner') ownerStay = true;
        if (isPending) pending = true;
      } else if (date > b.checkIn && date < b.checkOut) {
        booked = true;
        if (b.type === 'owner') ownerStay = true;
        if (isPending) pending = true;
      }
    }

    days.push({ date, day: d, today: isToday, past: isPast, booked, ownerStay, pending, checkin, checkout });
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