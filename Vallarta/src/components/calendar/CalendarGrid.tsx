// src/components/calendar/CalendarGrid.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDay, MONTH_NAMES } from './bookingUtils';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CalendarGridProps {
  days: CalendarDay[];
  year: number;
  month: number; // 0-indexed
  onPrevMonth: () => void;
  onNextMonth: () => void;
  slideDir?: 'next' | 'prev';
  onDateRangeSelected?: (startDay: CalendarDay, endDay: CalendarDay) => void;
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

export default function CalendarGrid({ days, year, month, onPrevMonth, onNextMonth, slideDir, onDateRangeSelected }: CalendarGridProps) {
  const hasPending = days.some(d => d.pending);
  const hasOwner = days.some(d => d.ownerStay);

  const [dragStartDay, setDragStartDay] = useState<CalendarDay | null>(null);
  const [dragHoverDay, setDragHoverDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragStartDay(null);
      setDragHoverDay(null);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('.cal-day') as HTMLElement;
    if (!target) return;
    const dayStr = target.dataset.day;
    if (!dayStr) return;
    const d = days.find(day => day.day === parseInt(dayStr, 10) && !day.empty);
    if (!d || d.empty) return;
    setDragStartDay(d);
    setDragHoverDay(d);
  }, [days]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!dragStartDay) return;
    const target = (e.target as HTMLElement).closest('.cal-day') as HTMLElement;
    if (!target) return;
    const dayStr = target.dataset.day;
    if (!dayStr) return;
    const d = days.find(day => day.day === parseInt(dayStr, 10) && !day.empty);
    if (!d || d.empty) return;
    setDragHoverDay(d);
  }, [dragStartDay, days]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragStartDay) return;
    const target = (e.target as HTMLElement).closest('.cal-day') as HTMLElement;
    let d = null;
    if (target && target.dataset.day) {
      d = days.find(day => day.day === parseInt(target.dataset.day!, 10) && !day.empty);
    }
    if (!d || d.empty) return;
    if (onDateRangeSelected) {
      const start = dragStartDay.day <= d.day ? dragStartDay : d;
      const end = dragStartDay.day <= d.day ? d : dragStartDay;
      onDateRangeSelected(start, end);
    }
    setDragStartDay(null);
    setDragHoverDay(null);
  }, [dragStartDay, days, onDateRangeSelected]);

  const startDayIndex = dragStartDay ? dragStartDay.day : -1;
  const hoverDayIndex = dragHoverDay ? dragHoverDay.day : -1;
  const minDay = Math.min(startDayIndex, hoverDayIndex);
  const maxDay = Math.max(startDayIndex, hoverDayIndex);
  
  const liveRegionText = dragStartDay && dragHoverDay && minDay > 0
    ? `Selecting from ${MONTH_NAMES[month]} ${minDay} to ${MONTH_NAMES[month]} ${maxDay}`
    : '';

  return (
    <div
      role="group"
      aria-label={`${MONTH_NAMES[month]} ${year} calendar`}
      className="cal-calendar"
    >
      <div aria-live="polite" className="sr-only">
        {liveRegionText}
      </div>
      <div className="cal-calendar__inner">
        <div className="cal-bezel-outer cal-bezel-outer--inline">
          <div className="cal-bezel-inner">
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

            <div
              key={`${year}-${month}`}
              role="grid"
              aria-label="Calendar days"
              className={`cal-grid${slideDir ? ` cal-grid--entering-${slideDir}` : ''}`}
              onMouseDown={handleMouseDown}
              onMouseOver={handleMouseEnter}
              onMouseUp={handleMouseUp}
            >
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
                const inSelection = dragStartDay && !d.empty && d.day >= minDay && d.day <= maxDay;

                return (
                  <div
                    key={`day-${i}`}
                    role="gridcell"
                    data-day={d.empty ? undefined : d.day}
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
                      inSelection ? 'cal-day--selected cal-day--drag-target' : '',
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
            
            <p className="cal-grid-hint">
              Click and drag dates to create a new reservation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
