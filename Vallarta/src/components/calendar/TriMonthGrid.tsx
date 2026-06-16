// src/components/calendar/TriMonthGrid.tsx
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Booking, CalendarDay, MONTH_NAMES } from './bookingUtils';
import { toDateStr } from './useCalendarView';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartOfWeekOffset(firstDayOfMonth: Date) {
  // Returns 0 for Monday, 6 for Sunday
  const day = firstDayOfMonth.getDay();
  return day === 0 ? 6 : day - 1;
}

interface TriMonthGridProps {
  baseMonthStart: Date;
  bookings: Booking[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateRangeSelected?: (startDay: CalendarDay, endDay: CalendarDay) => void;
  selectedBooking?: Booking | null;
}

const EASE = [0.32, 0.72, 0, 1] as const;

function generateMonthGrid(date: Date, bookings: Booking[]): CalendarDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1);
  const offset = getStartOfWeekOffset(firstDay);
  
  const today = new Date();
  const todayStr = toDateStr(today);
  const selectedMonthStr = toDateStr(firstDay).substring(0, 7);
  
  const days: CalendarDay[] = [];
  
  // Fill leading blank days
  for (let i = 0; i < offset; i++) {
    days.push({ date: '', day: 0, today: false, past: true });
  }
  
  // Fill actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const dateStr = toDateStr(d);
    const isToday = dateStr === todayStr;
    const isPast = dateStr < todayStr;
    
    let booked = false;
    let ownerStay = false;
    let pending = false;
    let checkin = false;
    let checkout = false;
    
    for (const b of bookings) {
      if (b.status === 'Cancelled') continue;
      if (dateStr === b.checkIn) {
        checkin = true;
        if (b.type === 'owner') ownerStay = true;
        if (b.status === 'Pending') pending = true;
      } else if (dateStr === b.checkOut) {
        checkout = true;
        if (b.type === 'owner') ownerStay = true;
        if (b.status === 'Pending') pending = true;
      } else if (dateStr > b.checkIn && dateStr < b.checkOut) {
        booked = true;
        if (b.type === 'owner') ownerStay = true;
        if (b.status === 'Pending') pending = true;
      }
    }
    
    days.push({
      date: dateStr,
      day: i,
      today: isToday,
      past: isPast,
      booked,
      ownerStay,
      pending,
      checkin,
      checkout
    });
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

export default function TriMonthGrid({ baseMonthStart, bookings, onPrevMonth, onNextMonth, onDateRangeSelected, selectedBooking }: TriMonthGridProps) {
  const prefersReduced = useReducedMotion();
  
  const monthData = useMemo(() => {
    const m = [];
    let hasPending = false;
    let hasOwner = false;
    
    for (let i = 0; i < 3; i++) {
      const d = new Date(baseMonthStart.getFullYear(), baseMonthStart.getMonth() + i, 1);
      const days = generateMonthGrid(d, bookings);
      
      if (days.some(day => day.pending)) hasPending = true;
      if (days.some(day => day.ownerStay)) hasOwner = true;
      
      m.push({
        date: d,
        monthName: MONTH_NAMES[d.getMonth()],
        year: d.getFullYear(),
        days
      });
    }
    return { months: m, hasPending, hasOwner };
  }, [baseMonthStart, bookings]);

  const selectedRange = useMemo(() => {
    if (!selectedBooking) return null;
    return { start: selectedBooking.checkIn, end: selectedBooking.checkOut };
  }, [selectedBooking]);

  const endMonth = monthData.months[2].date;
  const rangeLabel = `${MONTH_NAMES[baseMonthStart.getMonth()]} ${baseMonthStart.getFullYear()} — ${MONTH_NAMES[endMonth.getMonth()]} ${endMonth.getFullYear()}`;

  return (
    <div className="cal-calendar cal-trimonth">
      <div className="cal-calendar__inner">
        <div className="cal-card-shell">
          <div className="cal-card cal-card--functional">
            <div className="cal-month-nav cal-trimonth__nav">
              <button onClick={onPrevMonth} aria-label="Previous month" className="cal-month-nav__arrow">
                <ChevronLeft />
              </button>
              <div className="cal-trimonth__range">
                <div className="cal-trimonth__range-label">{rangeLabel}</div>
              </div>
              <button onClick={onNextMonth} aria-label="Next month" className="cal-month-nav__arrow">
                <ChevronRight />
              </button>
            </div>

            <div className="cal-trimonth__row">
              {monthData.months.map((m, mIndex) => (
                <motion.div 
                  key={m.date.getTime()}
                  initial={prefersReduced ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: mIndex * 0.1, ease: EASE }}
                  className="cal-trimonth__month-col"
                >
                  <div className="cal-trimonth__month-header">
                    <span className="cal-trimonth__month-title">{m.monthName}</span>
                    <span className="cal-trimonth__month-year">{m.year}</span>
                  </div>
                  
                  <div className="cal-trimonth__days-header">
                    <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                  </div>
                  
                  <div className="cal-trimonth__grid">
                    {m.days.map((d, i) => {
                      if (!d.date) {
                        return <div key={`empty-${i}`} className="cal-trimonth__cell cal-trimonth__cell--empty" />;
                      }
                      
                      const isOccupied = d.checkin || d.checkout || d.booked;
                      const inSelectedBooking = selectedRange && d.date >= selectedRange.start && d.date <= selectedRange.end;
                      
                      return (
                        <button
                          key={d.date}
                          type="button"
                          disabled={d.past}
                          aria-disabled={d.past}
                          onClick={() => {
                            if (d.past) return;
                            if (onDateRangeSelected) onDateRangeSelected(d, d);
                          }}
                          className={[
                            'cal-trimonth__cell',
                            d.past ? 'cal-trimonth__cell--past' : '',
                            d.today ? 'cal-trimonth__cell--today' : '',
                            inSelectedBooking ? 'cal-trimonth__cell--selected' : '',
                          ].filter(Boolean).join(' ')}
                        >
                          <span className={[
                            'cal-trimonth__num',
                            isOccupied ? (d.ownerStay ? 'cal-trimonth__num--owner' : (d.pending ? 'cal-trimonth__num--pending' : 'cal-trimonth__num--confirmed')) : ''
                          ].filter(Boolean).join(' ')}>
                            {d.day}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="cal-grid-legend cal-trimonth__legend" aria-label="Reservation key">
              <span className="cal-grid-legend__item">
                <span className="cal-grid-legend__dot cal-grid-legend__dot--confirmed" aria-hidden="true" />
                Confirmed
              </span>
              {monthData.hasPending && (
                <span className="cal-grid-legend__item">
                  <span className="cal-grid-legend__dot cal-grid-legend__dot--pending" aria-hidden="true" />
                  Pending
                </span>
              )}
              {monthData.hasOwner && (
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
