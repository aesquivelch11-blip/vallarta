// src/components/calendar/WeekGrid.tsx
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Booking, CalendarDay, MONTH_NAMES } from './bookingUtils';
import { toDateStr, startOfWeek } from './useCalendarView';

const DAY_LABELS_FULL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const EASE = [0.32, 0.72, 0, 1] as const;

interface WeekGridProps {
  weekStart: Date;
  bookings: Booking[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onDateRangeSelected?: (startDay: CalendarDay, endDay: CalendarDay) => void;
  onJumpToToday: () => void;
  selectedBooking?: Booking | null;
}

function buildWeekDays(weekStart: Date, bookings: Booking[]): CalendarDay[] {
  const today = new Date();
  const todayStr = toDateStr(today);
  const days: CalendarDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const date = toDateStr(d);
    const isToday = date === todayStr;
    const isPast = date < todayStr;
    let booked = false;
    let ownerStay = false;
    let pending = false;
    let checkin = false;
    let checkout = false;
    for (const b of bookings) {
      if (b.status === 'Cancelled') continue;
      if (date === b.checkIn) {
        checkin = true;
        if (b.type === 'owner') ownerStay = true;
        if (b.status === 'Pending') pending = true;
      } else if (date === b.checkOut) {
        checkout = true;
        if (b.type === 'owner') ownerStay = true;
        if (b.status === 'Pending') pending = true;
      } else if (date > b.checkIn && date < b.checkOut) {
        booked = true;
        if (b.type === 'owner') ownerStay = true;
        if (b.status === 'Pending') pending = true;
      }
    }
    days.push({ date, day: d.getDate(), today: isToday, past: isPast, booked, ownerStay, pending, checkin, checkout });
  }
  return days;
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WeekGrid({ weekStart, bookings, onPrevWeek, onNextWeek, onDateRangeSelected, onJumpToToday, selectedBooking }: WeekGridProps) {
  const prefersReduced = useReducedMotion();
  const days = useMemo(() => buildWeekDays(weekStart, bookings), [weekStart, bookings]);

  const end = useMemo(() => {
    const e = new Date(weekStart);
    e.setDate(weekStart.getDate() + 6);
    return e;
  }, [weekStart]);

  const weekLabel = `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} — ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  const sameMonth = weekStart.getMonth() === end.getMonth() && weekStart.getFullYear() === end.getFullYear();

  const hasPending = days.some(d => d.pending);
  const hasOwner = days.some(d => d.ownerStay);

  const selectedRange = useMemo(() => {
    if (!selectedBooking) return null;
    return { start: selectedBooking.checkIn, end: selectedBooking.checkOut };
  }, [selectedBooking]);

  return (
    <div role="group" aria-label={`Week of ${weekLabel}`} className="cal-calendar cal-week">
      <div className="cal-calendar__inner">
        <div className="cal-card-shell">
          <div className="cal-card cal-card--functional">
            <div className="cal-month-nav">
              <button onClick={onPrevWeek} aria-label="Previous week" className="cal-month-nav__arrow">
                <ChevronLeft />
              </button>
              <div className="flex-1">
                <div className="cal-month cal-week__title">
                  {sameMonth
                    ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} — ${end.getDate()}`
                    : `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getDate()} — ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}`}
                </div>
                <div className="cal-year">{end.getFullYear()}</div>
              </div>
              <button onClick={onJumpToToday} aria-label="Jump to current week" className="cal-week__today">
                Today
              </button>
              <button onClick={onNextWeek} aria-label="Next week" className="cal-month-nav__arrow">
                <ChevronRight />
              </button>
            </div>

            <div role="grid" aria-label="Week days" className="cal-week-grid">
              {days.map((d, i) => {
                const inSelectedBooking = selectedRange && d.date >= selectedRange.start && d.date <= selectedRange.end;
                const isOccupied = d.checkin || d.checkout || d.booked;
                
                return (
                  <motion.button
                    key={`wd-${i}`}
                    initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                    type="button"
                    role="gridcell"
                    data-date={d.date}
                    disabled={d.past}
                    aria-disabled={d.past}
                    onClick={() => {
                      if (d.past) return;
                      if (onDateRangeSelected) onDateRangeSelected(d, d);
                    }}
                    aria-label={`${DAY_LABELS_FULL[i]} ${MONTH_NAMES[new Date(d.date).getMonth()]} ${d.day}${isOccupied ? (d.pending ? ', pending' : ', confirmed') : ''}${d.today ? ', today' : ''}`}
                    className={[
                      'cal-week-card',
                      d.past ? 'cal-week-card--past' : '',
                      d.today ? 'cal-week-card--today' : '',
                      inSelectedBooking ? 'cal-week-card--selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="cal-week-card__header">
                      <span className="cal-week-card__day-label">{DAY_LABELS_FULL[i]}</span>
                      <span className="cal-week-card__day-num">{d.day}</span>
                    </div>
                    
                    <div className="cal-week-card__content">
                      {isOccupied && (
                        <div className={[
                          'cal-week-card__chip',
                          d.ownerStay ? 'cal-week-card__chip--owner' : '',
                          d.pending ? 'cal-week-card__chip--pending' : '',
                          !d.ownerStay && !d.pending ? 'cal-week-card__chip--confirmed' : ''
                        ].filter(Boolean).join(' ')}>
                          {d.ownerStay ? 'Owner' : (d.pending ? 'Pending' : 'Booked')}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="cal-grid-legend cal-week__legend" aria-label="Reservation key">
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
                  Owner
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
