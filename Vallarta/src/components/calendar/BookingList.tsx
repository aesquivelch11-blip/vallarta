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
