// src/components/calendar/CalendarGrid.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarDay, MONTH_NAMES } from './bookingUtils';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarGridProps {
  days: CalendarDay[];
  year: number;
  month: number; // 0-indexed
  onPrevMonth: () => void;
  onNextMonth: () => void;
  slideDir?: 'next' | 'prev';
  onDateRangeSelected?: (startDay: CalendarDay, endDay: CalendarDay) => void;
  error?: string | null;
  onRetry?: () => void;
  loading?: boolean;
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

export default function CalendarGrid({ days, year, month, onPrevMonth, onNextMonth, slideDir, onDateRangeSelected, error, onRetry, loading }: CalendarGridProps) {
  const hasPending = days.some(d => d.pending);
  const hasOwner = days.some(d => d.ownerStay);

  if (loading) {
    return (
      <div role="group" aria-label="Loading calendar" className="cal-calendar">
        <div className="cal-calendar__inner">
          <div className="cal-card-shell">
            <div className="cal-card cal-card--grid">
              <div className="cal-month-nav">
                <div style={{ width: 64, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} className="animate-pulse" />
              </div>
              <div className="cal-grid">
                {DAY_LABELS.map((_, i) => (
                  <div key={`skel-label-${i}`} className="cal-day-label" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 14 }} />
                ))}
                {Array.from({ length: 42 }, (_, i) => (
                  <div key={`skel-day-${i}`} className="cal-day animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8 }} />
                ))}
              </div>
              <div className="cal-grid-legend" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 18, width: '50%' }} />

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div role="group" aria-label="Calendar error" className="cal-calendar">
        <div className="cal-calendar__inner">
          <div className="cal-card-shell">
            <div
              className="cal-card cal-card--grid"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '32px 16px',
                minHeight: 260,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                style={{ color: 'var(--cal-error, rgba(248, 113, 113, 0.85))' }}
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="16" r="0.75" fill="currentColor" />
              </svg>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, textAlign: 'center', fontSize: 14 }}>
                {error}
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  style={{
                    background: 'var(--color-accent-positive, #22c55e)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="cal-card-shell">
          <div className="cal-card cal-card--grid">
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
              aria-label="Calendar days. Click and drag to select a date range."
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
                          !d.ownerStay && !isPendingDay ? 'cal-day__dot--confirmed' : '',
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
      </div>
    </div>
  );
}
