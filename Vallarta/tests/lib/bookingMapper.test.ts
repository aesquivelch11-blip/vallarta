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
