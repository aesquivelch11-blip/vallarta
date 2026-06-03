// src/components/calendar/CalendarGrid.tsx
import React from 'react';
import { CalendarDay, MONTH_NAMES } from './bookingUtils';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CalendarGridProps {
  days: CalendarDay[];
  year: number;
  month: number; // 0-indexed
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarGrid({ days, year, month, onPrevMonth, onNextMonth }: CalendarGridProps) {
  return (
    <div
      role="group"
      aria-label={`${MONTH_NAMES[month]} ${year} calendar`}
      className="cal-calendar"
    >
      <div className="cal-calendar__inner">
        <div className="cal-month-nav">
          <button
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="cal-month-nav__arrow"
          >
            ‹
          </button>
          <div>
            <div className="cal-month">{MONTH_NAMES[month]}</div>
            <div className="cal-year">{year}</div>
          </div>
          <button
            onClick={onNextMonth}
            aria-label="Next month"
            className="cal-month-nav__arrow"
          >
            ›
          </button>
        </div>

        <div role="grid" aria-label="Calendar days" className="cal-grid">
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

          {days.map((d, i) => {
            const isBoth = d.checkin && d.checkout;
            return (
              <div
                key={`day-${i}`}
                role="gridcell"
                aria-label={
                  d.empty
                    ? undefined
                    : `${MONTH_NAMES[month]} ${d.day}, ${year}${d.booked ? ', booked' : ''}${d.today ? ', today' : ''}${d.checkin ? ', check-in' : ''}${d.checkout ? ', check-out' : ''}`
                }
                className={[
                  'cal-day',
                  d.empty ? 'cal-day--empty' : '',
                  d.booked && !d.ownerStay ? 'cal-day--booked' : '',
                  (d.booked || d.checkin || d.checkout) && d.ownerStay ? 'cal-day--owner' : '',
                  d.today ? 'cal-day--today' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={
                  d.empty
                    ? undefined
                    : ({
                        '--accent-dot': isBoth
                          ? 'left: 50%; transform: translateX(-50%)'
                          : d.checkin
                          ? 'left: clamp(6px, 1vw, 10px)'
                          : 'right: clamp(6px, 1vw, 10px)',
                      } as React.CSSProperties)
                }
              >
                {d.empty ? '' : d.day}
                {(d.checkin || d.checkout) && (
                  <div
                    aria-hidden="true"
                    className={`cal-day__dot${d.ownerStay ? ' cal-day__dot--owner' : ''}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
