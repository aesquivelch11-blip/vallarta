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

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CalendarGrid({ days, year, month, onPrevMonth, onNextMonth }: CalendarGridProps) {
  const hasPending = days.some(d => d.pending);
  const hasOwner = days.some(d => d.ownerStay);

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
            aria-label={`Go to previous month`}
            className="cal-month-nav__arrow"
          >
            <ChevronLeft />
          </button>
          <div>
            <div className="cal-month">{MONTH_NAMES[month]}</div>
            <div className="cal-year">{year}</div>
          </div>
          <button
            onClick={onNextMonth}
            aria-label={`Go to next month`}
            className="cal-month-nav__arrow"
          >
            <ChevronRight />
          </button>
        </div>

        <div role="grid" aria-label="Calendar days" className="cal-grid">
          {DAY_LABELS.map((label, i) => (
            <div
              key={`label-${i}`}
              role="columnheader"
              aria-label={['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]}
              className="cal-day-label"
            >
              {label}
            </div>
          ))}

          {days.map((d, i) => {
            const isBoth = d.checkin && d.checkout;
            const isOwnerDay = (d.booked || d.checkin || d.checkout) && d.ownerStay;
            const isPendingDay = (d.booked || d.checkin || d.checkout) && d.pending && !d.ownerStay;

            return (
              <div
                key={`day-${i}`}
                role="gridcell"
                aria-label={
                  d.empty
                    ? undefined
                    : `${MONTH_NAMES[month]} ${d.day}, ${year}${d.booked || d.checkin || d.checkout ? (d.pending ? ', pending reservation' : ', confirmed reservation') : ''}${d.today ? ', today' : ''}${d.checkin ? ', check-in' : ''}${d.checkout ? ', check-out' : ''}`
                }
                className={[
                  'cal-day',
                  d.empty ? 'cal-day--empty' : '',
                  isOwnerDay ? 'cal-day--owner' : '',
                  !isOwnerDay && (d.booked || d.checkin || d.checkout) ? 'cal-day--booked' : '',
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
                    className={[
                      'cal-day__dot',
                      d.ownerStay ? 'cal-day__dot--owner' : '',
                      isPendingDay ? 'cal-day__dot--pending' : '',
                    ].filter(Boolean).join(' ')}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dot legend — only shows legend items relevant to this month's data */}
        <div className="cal-grid-legend" aria-label="Reservation key">
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
              Owner Stay
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
