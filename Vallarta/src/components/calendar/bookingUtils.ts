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