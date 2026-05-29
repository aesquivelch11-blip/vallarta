import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ScreenType } from '../types';
import calendarBg from '../assets/Calendar-background.jpeg';

interface CalendarViewProps {
  onNavigate: (screen: ScreenType, transitionStyle: 'push' | 'push_back' | 'slide_up') => void;
  onNotify?: (message: string) => void;
}

interface Booking {
  id: string;
  dates: string;
  guest: string;
  status: 'Confirmed' | 'Pending';
  nights: number;
}

interface CalendarDay {
  day: number;
  empty?: boolean;
  booked?: boolean;
  today?: boolean;
  checkin?: boolean;
  checkout?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const JUNE_2026: CalendarDay[] = [
  { day: 0, empty: true },
  { day: 1 }, { day: 2 }, { day: 3 },
  { day: 4, checkin: true },
  { day: 5, booked: true }, { day: 6, booked: true }, { day: 7, booked: true },
  { day: 8, checkout: true },
  { day: 9 },
  { day: 10, checkin: true },
  { day: 11, booked: true }, { day: 12, booked: true },
  { day: 13, checkout: true },
  { day: 14 }, { day: 15 },
  { day: 16, today: true },
  { day: 17 }, { day: 18 },
  { day: 19, checkin: true },
  { day: 20, booked: true }, { day: 21, booked: true }, { day: 22, booked: true }, { day: 23, booked: true },
  { day: 24, checkout: true },
  { day: 25 }, { day: 26 }, { day: 27 },
  { day: 28, checkin: true },
  { day: 29, booked: true },
  { day: 30, checkout: true },
];

const BOOKINGS: Booking[] = [
  { id: '1', dates: 'Jun 19 — 24', guest: 'Margaret & James Whitfield', status: 'Confirmed', nights: 5 },
  { id: '2', dates: 'Jun 28 — 30', guest: 'Santiago Reyes', status: 'Confirmed', nights: 2 },
  { id: '3', dates: 'Jul 02 — 08', guest: 'The Brenner Family', status: 'Pending', nights: 6 },
];

export default function CalendarView({ onNavigate, onNotify }: CalendarViewProps) {
  const [hoveredBooking, setHoveredBooking] = useState<string | null>(null);

  const handleBookingKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>, booking: Booking) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNotify?.(`Opening reservation for ${booking.guest} — ${booking.dates}`);
      }
    },
    [onNotify]
  );

  return (
    <div
      className="cal-screen"
    >
      {/* ─── Dark base overlay ─── */}
      <div aria-hidden="true" className="cal-base-overlay" />

      {/* ─── Asymmetric overlay: left vignette + top-left radial + bottom fade ─── */}
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

      {/* ─── Calendar — left-aligned in negative space ─── */}
      <motion.div
        role="group"
        aria-label="June 2026 calendar"
        className="cal-calendar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
      >
        <div className="cal-calendar__inner">
          <div className="cal-month">June</div>
          <div className="cal-year">2026</div>

          <div
            role="grid"
            aria-label="Calendar days"
            className="cal-grid"
          >
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

            {JUNE_2026.map((d, i) => {
              const isBoth = d.checkin && d.checkout;
              return (
                <div
                  key={`day-${i}`}
                  role="gridcell"
                  aria-label={
                    d.empty
                      ? undefined
                      : `June ${d.day}, 2026${d.booked ? ', booked' : d.today ? ', today' : ''}${d.checkin ? ', check-in' : ''}${d.checkout ? ', check-out' : ''}`
                  }
                  className={[
                    'cal-day',
                    d.empty ? 'cal-day--empty' : '',
                    d.booked ? 'cal-day--booked' : '',
                    d.today ? 'cal-day--today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    d.empty
                      ? undefined
                      : {
                          '--accent-dot': isBoth
                            ? 'left: 50%; transform: translateX(-50%)'
                            : d.checkin
                              ? 'left: clamp(6px, 1vw, 10px)'
                              : 'right: clamp(6px, 1vw, 10px)',
                        } as React.CSSProperties
                  }
                >
                  {d.day}
                  {(d.checkin || d.checkout) && (
                    <div aria-hidden="true" className="cal-day__dot" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── Bottom booking list ─── */}
      <motion.div
        role="region"
        aria-label="Upcoming arrivals"
        className="cal-bookings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.9 }}
      >
        <div className="cal-bookings__header">
          <h2 className="cal-bookings__title">Upcoming Arrivals</h2>
          <span className="cal-bookings__meta">
            {BOOKINGS.length} Active Reservations
          </span>
        </div>

        <ul role="list" className="cal-bookings__list">
          {BOOKINGS.map((booking) => (
            <li
              key={booking.id}
              role="listitem"
              className="cal-booking-row"
              onMouseEnter={() => setHoveredBooking(booking.id)}
              onMouseLeave={() => setHoveredBooking(null)}
              onKeyDown={(e) => handleBookingKeyDown(e, booking)}
              tabIndex={0}
              aria-label={`${booking.guest}, ${booking.dates}, ${booking.nights} nights, ${booking.status}`}
            >
              <time className="cal-booking-row__date">{booking.dates}</time>
              <span className="cal-booking-row__guest">{booking.guest}</span>
              <span className={`cal-booking-row__status cal-booking-row__status--${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
              <span className="cal-booking-row__nights">{booking.nights} nights</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}